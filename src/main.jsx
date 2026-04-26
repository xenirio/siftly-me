import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <App />
  </StrictMode>
)

// Below-fold reveal: any element marked .reveal that is NOT already in the
// viewport at hydration time fades in once it scrolls into view. PR #15
// regression note: never start above-fold elements hidden — the failsafe
// promotes anything in-viewport to .is-visible immediately.
//
// Deferred via rAF so the className mutation happens after React's hydration
// commit — otherwise React may log a hydration-mismatch warning when it
// reconciles the SSR markup against the now-mutated DOM.
requestAnimationFrame(() => {
  const els = document.querySelectorAll('.reveal')
  if (!els.length) return

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        io.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' })

  const vh = window.innerHeight
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.top < vh && r.bottom > 0) el.classList.add('is-visible')
    else io.observe(el)
  }
})
