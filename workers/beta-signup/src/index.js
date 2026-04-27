// POST /api/beta — verify Turnstile, append a row to the configured Google Sheet.

import { Buffer } from 'node:buffer'

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SHEET_RANGE = 'Signups!A:D'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Memoized across requests within an isolate.
let serviceAccountPromise
let tokenCache

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || ''
    const allowedOrigin = pickAllowedOrigin(origin, env)
    const reply = (payload, status) => json(payload, status, allowedOrigin)

    if (request.method === 'OPTIONS') return preflight(allowedOrigin)

    const url = new URL(request.url)
    if (url.pathname !== '/api/beta') return reply({ ok: false, error: 'not_found' }, 404)
    if (request.method !== 'POST') return reply({ ok: false, error: 'method_not_allowed' }, 405)

    let body
    try { body = await request.json() }
    catch { return reply({ ok: false, error: 'invalid_json' }, 400) }

    const email = String(body?.email ?? '').trim().toLowerCase()
    const turnstileToken = String(body?.turnstileToken ?? '')
    if (!EMAIL_RE.test(email) || email.length > 254) return reply({ ok: false, error: 'invalid_email' }, 400)
    if (!turnstileToken) return reply({ ok: false, error: 'missing_turnstile_token' }, 400)

    const ip = request.headers.get('cf-connecting-ip') || ''
    const tsForm = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: turnstileToken })
    if (ip) tsForm.set('remoteip', ip)
    const tsRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: tsForm,
    })
    const tsData = await tsRes.json().catch(() => ({}))
    if (!tsData?.success) return reply({ ok: false, error: 'turnstile_failed' }, 403)

    let accessToken
    try { accessToken = await getGoogleAccessToken(env) }
    catch (err) {
      console.error('google_auth_failed', err?.message)
      return reply({ ok: false, error: 'google_auth_failed' }, 502)
    }

    const row = [
      new Date().toISOString(),
      email,
      request.headers.get('user-agent') || '',
      request.cf?.country || '',
    ]
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.SHEET_ID)}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`
    const sheetRes = await fetch(appendUrl, {
      method: 'POST',
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    })
    if (!sheetRes.ok) {
      // Drop cached token on auth failures so a rotated/revoked credential
      // can't keep failing for up to ~1h until natural expiry.
      if (sheetRes.status === 401 || sheetRes.status === 403) tokenCache = undefined
      const detail = await sheetRes.text().catch(() => '')
      console.error('sheet_append_failed', sheetRes.status, detail.slice(0, 500))
      return reply({ ok: false, error: 'sheet_append_failed' }, 502)
    }

    return reply({ ok: true }, 200)
  },
}

function pickAllowedOrigin(origin, env) {
  const list = String(env.ALLOWED_ORIGINS || '')
    .split(',').map((s) => s.trim()).filter(Boolean)
  if (list.includes('*')) return '*'
  return list.includes(origin) ? origin : list[0] || ''
}

function corsHeaders(origin) {
  const h = {
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  }
  if (origin) h['access-control-allow-origin'] = origin
  return h
}

function preflight(origin) {
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

function json(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  })
}

// ── Google service-account JWT → access token ─────────────────────────────────
function getServiceAccount(env) {
  if (!serviceAccountPromise) {
    serviceAccountPromise = (async () => {
      const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
      const key = await importRsaPrivateKey(sa.private_key)
      return { clientEmail: sa.client_email, key }
    })().catch((err) => { serviceAccountPromise = undefined; throw err })
  }
  return serviceAccountPromise
}

async function getGoogleAccessToken(env) {
  const now = Math.floor(Date.now() / 1000)
  if (tokenCache && tokenCache.expiresAt - now > 60) return tokenCache.accessToken

  const { clientEmail, key } = await getServiceAccount(env)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claims = {
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`
  const sigBuf = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(unsigned),
  )
  const jwt = `${unsigned}.${b64url(new Uint8Array(sigBuf))}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) throw new Error(`token endpoint ${res.status}: ${await res.text().catch(() => '')}`)
  const data = await res.json()
  if (!data.access_token) throw new Error('no access_token in response')
  tokenCache = { accessToken: data.access_token, expiresAt: now + (data.expires_in ?? 3600) }
  return data.access_token
}

async function importRsaPrivateKey(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey(
    'pkcs8',
    der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

function b64url(input) {
  return Buffer.from(input).toString('base64url')
}
