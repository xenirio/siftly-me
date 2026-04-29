// Cloudflare Worker entry for siftly-me. Static assets are served by the
// ASSETS binding; this script runs first so we can auto-route the root path
// to the user's preferred locale based on Accept-Language, while letting a
// `siftly_locale` cookie override detection so manual toggles are sticky.

const SUPPORTED = ['en', 'th']
const COOKIE = 'siftly_locale'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function readCookie(header, name) {
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1)
  }
  return null
}

// Parse Accept-Language and return the best match among SUPPORTED. Walks the
// header in q-value order; returns 'th' for any th* tag, 'en' for any en*,
// otherwise falls back to 'en'.
function pickLocale(acceptLanguage) {
  if (!acceptLanguage) return 'en'
  const tags = acceptLanguage
    .split(',')
    .map((p) => {
      const [tag, ...params] = p.trim().split(';')
      let q = 1
      for (const param of params) {
        const m = param.match(/^q=([\d.]+)$/)
        if (m) q = parseFloat(m[1])
      }
      return { tag: tag.toLowerCase(), q }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of tags) {
    if (tag.startsWith('th')) return 'th'
    if (tag.startsWith('en')) return 'en'
  }
  return 'en'
}

function localeCookie(locale) {
  return `${COOKIE}=${locale}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url)
    const path = url.pathname
    const cookie = readCookie(req.headers.get('cookie'), COOKIE)
    const stored = cookie && SUPPORTED.includes(cookie) ? cookie : null

    if (path === '/' || path === '') {
      const detected = stored || pickLocale(req.headers.get('accept-language'))

      if (detected === 'th') {
        const dest = new URL('/th/', url)
        dest.search = url.search
        const headers = new Headers({
          Location: dest.toString(),
          'Cache-Control': 'no-store',
          Vary: 'Accept-Language, Cookie',
        })
        if (stored !== 'th') headers.append('Set-Cookie', localeCookie('th'))
        return new Response(null, { status: 302, headers })
      }

      const res = await env.ASSETS.fetch(req)
      if (stored === 'en') return res
      const out = new Response(res.body, res)
      out.headers.append('Set-Cookie', localeCookie('en'))
      out.headers.set('Vary', 'Accept-Language, Cookie')
      return out
    }

    // Refresh the sticky cookie when the user lands directly on /th/ so the
    // next visit to / respects that choice without depending on Accept-Language.
    if (path === '/th/' || path === '/th') {
      const res = await env.ASSETS.fetch(req)
      if (stored === 'th') return res
      const out = new Response(res.body, res)
      out.headers.append('Set-Cookie', localeCookie('th'))
      return out
    }

    return env.ASSETS.fetch(req)
  },
}
