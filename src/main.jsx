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

  // Fast-scroll fix: also reveal entries whose bottom is already above the
  // viewport — IO can fire with isIntersecting:false when the user scrolls
  // past a section before the first callback tick.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting || e.boundingClientRect.bottom <= 0) {
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

  // Belt-and-suspenders: a passive scroll listener catches any .reveal that
  // IO missed during a fast scroll. Self-removes once everything is visible
  // so steady-state scroll cost is zero.
  const onScroll = () => {
    for (const el of els) {
      if (el.classList.contains('is-visible')) continue
      if (el.getBoundingClientRect().bottom <= window.innerHeight) {
        el.classList.add('is-visible')
      }
    }
    if (!document.querySelector('.reveal:not(.is-visible)')) {
      window.removeEventListener('scroll', onScroll)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})
