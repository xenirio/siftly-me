// POST /api/beta — verify Turnstile, append a row to the configured Google Sheet.

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SHEET_RANGE = 'Signups!A:D'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || ''
    const allowedOrigin = pickAllowedOrigin(origin, env)

    if (request.method === 'OPTIONS') return preflight(allowedOrigin)

    const url = new URL(request.url)
    if (url.pathname !== '/api/beta') {
      return json({ ok: false, error: 'not_found' }, 404, allowedOrigin)
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, allowedOrigin)
    }

    let body
    try { body = await request.json() }
    catch { return json({ ok: false, error: 'invalid_json' }, 400, allowedOrigin) }

    const email = String(body?.email ?? '').trim().toLowerCase()
    const turnstileToken = String(body?.turnstileToken ?? '')
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ ok: false, error: 'invalid_email' }, 400, allowedOrigin)
    }
    if (!turnstileToken) {
      return json({ ok: false, error: 'missing_turnstile_token' }, 400, allowedOrigin)
    }

    const ip = request.headers.get('cf-connecting-ip') || ''
    const tsForm = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: turnstileToken })
    if (ip) tsForm.set('remoteip', ip)
    const tsRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: tsForm,
    })
    const tsData = await tsRes.json().catch(() => ({}))
    if (!tsData?.success) {
      return json({ ok: false, error: 'turnstile_failed' }, 403, allowedOrigin)
    }

    let accessToken
    try { accessToken = await getGoogleAccessToken(env) }
    catch (err) {
      console.error('google_auth_failed', err?.message)
      return json({ ok: false, error: 'google_auth_failed' }, 502, allowedOrigin)
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
      const detail = await sheetRes.text().catch(() => '')
      console.error('sheet_append_failed', sheetRes.status, detail.slice(0, 500))
      return json({ ok: false, error: 'sheet_append_failed' }, 502, allowedOrigin)
    }

    return json({ ok: true }, 200, allowedOrigin)
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
async function getGoogleAccessToken(env) {
  const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claims = {
    iss: sa.client_email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`
  const key = await importRsaPrivateKey(sa.private_key)
  const sigBuf = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(unsigned),
  )
  const jwt = `${unsigned}.${b64urlBytes(new Uint8Array(sigBuf))}`

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

function b64url(str) {
  return b64urlBytes(new TextEncoder().encode(str))
}
function b64urlBytes(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
