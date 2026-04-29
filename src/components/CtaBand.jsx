import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/index.jsx'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SHARE_URL = 'https://siftly.me'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CtaBand() {
  const t = useT()
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  // Mount Turnstile only once the email looks complete — keeps the widget
  // out of the way while the user is still typing. One-way flag: once the
  // user enters a valid email or blurs a non-empty field, the widget stays
  // mounted so a re-edit doesn't tear it down.
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [verified, setVerified] = useState(false)
  const tokenRef = useRef('')
  const widgetIdRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!showTurnstile) return
    if (!containerRef.current) return
    let cancelled = false

    const mount = () => {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null || !window.turnstile?.render) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        // Render the widget visibly so the user always has feedback:
        // "Verifying…" → "Success!" for clean traffic, or an interactive
        // checkbox for flagged traffic. interaction-only mode hides the
        // widget entirely, leaving the user stuck with a disabled submit
        // button and no visible recourse if Cloudflare wants interaction.
        callback: (token) => { tokenRef.current = token; setVerified(true) },
        'expired-callback': () => { tokenRef.current = ''; setVerified(false) },
        'error-callback': () => { tokenRef.current = ''; setVerified(false) },
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
  }, [showTurnstile])

  function onEmailChange(e) {
    const value = e.target.value
    setEmail(value)
    if (!showTurnstile && EMAIL_RE.test(value.trim())) setShowTurnstile(true)
  }

  function onEmailBlur(e) {
    if (!showTurnstile && e.target.value.trim()) setShowTurnstile(true)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const trimmed = email.trim()
    if (!trimmed) return
    if (!tokenRef.current) {
      setError(t('cta.errors.verificationMissing'))
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/beta`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmed, turnstileToken: tokenRef.current }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('done')
      } else {
        setError(humanError(data?.error, t) || t('cta.fallbackError'))
        setStatus('error')
        if (window.turnstile && widgetIdRef.current !== null) {
          try { window.turnstile.reset(widgetIdRef.current) } catch {}
        }
        tokenRef.current = ''
        setVerified(false)
      }
    } catch {
      setError(t('cta.errors.network'))
      setStatus('error')
    }
  }

  const submitDisabled = status === 'sending' || !verified

  return (
    <section id="get" className="cta-band reveal">
      <div className="wrap">
        {status === 'done' ? <ThankYou /> : (
          <>
            <div className="eyebrow">{t('cta.eyebrow')}</div>
            <h2>{t('cta.title.l1')}<em>{t('cta.title.em')}</em></h2>
            <p>{t('cta.lede')}</p>
            <form onSubmit={onSubmit} className="cta-form">
              <div className="cta-row">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={t('cta.emailPlaceholder')}
                  aria-label={t('cta.emailLabel')}
                  disabled={status === 'sending'}
                  className="cta-input"
                  value={email}
                  onChange={onEmailChange}
                  onBlur={onEmailBlur}
                />
                <button className="btn btn-primary" type="submit" disabled={submitDisabled}>
                  {status === 'sending' ? t('cta.sending') : <>{t('cta.requestAccess')} <span className="arrow">↗</span></>}
                </button>
              </div>
              {showTurnstile && <div ref={containerRef} className="cta-turnstile" />}
              {status === 'error' && <p className="cta-error" role="alert">{error}</p>}
            </form>
          </>
        )}
      </div>
    </section>
  )
}

function ThankYou() {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef(null)

  function reveal() {
    setRevealed(true)
    // Wait for the input to mount, then preselect so a single Cmd/Ctrl+C
    // copies the URL even before the user touches the Copy button.
    requestAnimationFrame(() => inputRef.current?.select())
  }

  async function copyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(SHARE_URL)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch { /* fall through to manual selection */ }
    }
    inputRef.current?.select()
  }

  return (
    <div className="cta-thanks">
      <div className="eyebrow">{t('cta.thanks.eyebrow')}</div>
      <h2>{t('cta.thanks.title.l1')}<em>{t('cta.thanks.title.em')}</em></h2>
      <p>{t('cta.thanks.body')}</p>
      {!revealed ? (
        <button className="btn btn-ghost" type="button" onClick={reveal}>
          {t('cta.thanks.tellFriend')} <span className="arrow">↗</span>
        </button>
      ) : (
        <div className="cta-row">
          <input
            ref={inputRef}
            type="text"
            value={SHARE_URL}
            readOnly
            className="cta-input"
            aria-label={t('cta.thanks.linkLabel')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
          />
          <button type="button" className="btn btn-primary" onClick={copyLink}>
            {copied ? t('cta.thanks.copied') : t('cta.thanks.copy')}
          </button>
        </div>
      )}
    </div>
  )
}

function humanError(code, t) {
  switch (code) {
    case 'invalid_email': return t('cta.errors.invalidEmail')
    case 'turnstile_failed':
    case 'missing_turnstile_token': return t('cta.errors.turnstile')
    case 'sheet_append_failed':
    case 'google_auth_failed': return t('cta.errors.server')
    default: return ''
  }
}
