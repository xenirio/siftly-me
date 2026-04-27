import { useRef, useState } from 'react'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SHARE_URL = 'https://siftly.me'

export default function CtaBand() {
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const email = new FormData(e.currentTarget).get('email')?.toString().trim()
    if (!email) return

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/beta`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('done')
      } else {
        setError(humanError(data?.error) || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section id="get" className="cta-band reveal">
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
                />
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : <>Request access <span className="arrow">↗</span></>}
                </button>
              </div>
              {status === 'error' && <p className="cta-error" role="alert">{error}</p>}
            </form>
          </>
        )}
      </div>
    </section>
  )
}

function ThankYou() {
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
      <div className="eyebrow">you're in</div>
      <h2>You're on <em>the list.</em></h2>
      <p>
        We'll email you when the next Android build ships — usually every few weeks while
        the beta is small. No drip campaigns, no marketing. Just the APK and a short note.
      </p>
      {!revealed ? (
        <button className="btn btn-ghost" type="button" onClick={reveal}>
          Tell a friend <span className="arrow">↗</span>
        </button>
      ) : (
        <div className="cta-row">
          <input
            ref={inputRef}
            type="text"
            value={SHARE_URL}
            readOnly
            className="cta-input"
            aria-label="Invitation link"
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
          />
          <button type="button" className="btn btn-primary" onClick={copyLink}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}

function humanError(code) {
  switch (code) {
    case 'invalid_email': return 'That email address looks off. Mind double-checking?'
    case 'sheet_append_failed':
    case 'google_auth_failed': return 'We couldn\'t save your signup right now. Please try again in a moment.'
    default: return ''
  }
}
