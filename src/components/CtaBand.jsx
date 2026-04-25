import { useState } from 'react'

export default function CtaBand({ copy }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="get" className="cta-band">
      <div className="wrap">
        <div className="eyebrow">the beta</div>
        <h2>{copy.ctaBand.a} <em>{copy.ctaBand.b}</em></h2>
        <p>Siftly is in closed beta for Android. Leave an email and we'll send the APK when the next build ships.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
          style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <input
            type="email"
            required
            placeholder="you@domain.com"
            aria-label="Email"
            style={{
              padding: '14px 18px',
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              font: 'inherit',
              fontSize: 14,
              minWidth: 280,
              color: 'var(--ink)',
            }}
          />
          <button className="btn btn-primary" type="submit">
            {submitted ? 'On the list ✓' : <>Request access <span className="arrow">↗</span></>}
          </button>
        </form>
      </div>
    </section>
  )
}
