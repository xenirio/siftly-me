import { useEffect, useRef, useState } from 'react'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SHARE_URL = 'https://siftly.me'
const SHARE_SUBJECT = 'Thought you might like this'
const SHARE_BODY = `Siftly is a quiet, on-device sieve for your camera roll — keeps the memories, skips the receipts and screenshots. Closed beta for Android right now: ${SHARE_URL}`

export default function CtaBand() {
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  // Turnstile is intent-gated: the widget only loads once the user has
  // signaled they actually want to use the form (focus the email input or
  // submit). Scrolling past the CTA without engaging triggers zero network
  // or main-thread cost. Otherwise the iframe load competes with paint
  // during the scroll-through and reads as the page being blocked.
  const [needsTurnstile, setNeedsTurnstile] = useState(false)
  const tokenRef = useRef('')
  const widgetIdRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (status === 'done') return
    if (!needsTurnstile) return
    if (!containerRef.current) return
    let cancelled = false

    const mount = () => {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null || !window.turnstile?.render) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => { tokenRef.current = token },
        'expired-callback': () => { tokenRef.current = '' },
        'error-callback': () => { tokenRef.current = '' },
        theme: 'light',
      })
    }

    const ensureScript = () => {
      if (window.turnstile?.render) { mount(); return }
      let script = document.querySelector('script[src*="turnstile/v0/api.js"]')
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', mount, { once: true })
    }

    ensureScript()

    return () => {
      cancelled = true
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        try { window.turnstile.remove(widgetIdRef.current) } catch {}
      }
      widgetIdRef.current = null
    }
  }, [status, needsTurnstile])

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    if (!needsTurnstile) setNeedsTurnstile(true)
    const email = new FormData(e.currentTarget).get('email')?.toString().trim()
    if (!email) return
    if (!tokenRef.current) {
      setError('Please complete the verification challenge.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/beta`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: tokenRef.current }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('done')
      } else {
        setError(humanError(data?.error) || 'Something went wrong. Please try again.')
        setStatus('error')
        if (window.turnstile && widgetIdRef.current !== null) {
          try { window.turnstile.reset(widgetIdRef.current) } catch {}
        }
        tokenRef.current = ''
      }
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section id="get" className="cta-band">
      <div className="wrap">
        {status === 'done' ? <ThankYou /> : (
          <>
            <div className="eyebrow">the beta</div>
            <h2>Keep the ones, <em>leave the rest.</em></h2>
            <p>Siftly is in closed beta for Android. Leave an email and we'll send the APK when the next build ships.</p>
            <form onSubmit={onSubmit} className="cta-form">
              <div className="cta-row">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  aria-label="Email"
                  disabled={status === 'sending'}
                  className="cta-input"
                  onFocus={() => setNeedsTurnstile(true)}
                />
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : <>Request access <span className="arrow">↗</span></>}
                </button>
              </div>
              <div ref={containerRef} className="cta-turnstile" />
              {status === 'error' && <p className="cta-error" role="alert">{error}</p>}
            </form>
          </>
        )}
      </div>
    </section>
  )
}

function ThankYou() {
  const mailto = `mailto:?subject=${encodeURIComponent(SHARE_SUBJECT)}&body=${encodeURIComponent(SHARE_BODY)}`
  return (
    <div className="cta-thanks">
      <div className="eyebrow">you're in</div>
      <h2>You're on <em>the list.</em></h2>
      <p>
        We'll email you when the next Android build ships — usually every few weeks while
        the beta is small. No drip campaigns, no marketing. Just the APK and a short note.
      </p>
      <a className="btn btn-ghost" href={mailto}>
        Tell a friend <span className="arrow">↗</span>
      </a>
    </div>
  )
}

function humanError(code) {
  switch (code) {
    case 'invalid_email': return 'That email address looks off. Mind double-checking?'
    case 'turnstile_failed':
    case 'missing_turnstile_token': return 'Verification failed. Please try again.'
    case 'sheet_append_failed':
    case 'google_auth_failed': return 'We couldn\'t save your signup right now. Please try again in a moment.'
    default: return ''
  }
}
