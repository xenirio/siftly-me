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

// Reveal-on-scroll: sections with .reveal start at opacity:0 + translateY(16px)
// and animate in once they enter (or are already inside) the viewport. The
// initial pass handles short pages and fast-scroll-on-load — anything already
// visible at boot gets revealed immediately rather than waiting for an
// IntersectionObserver tick that may never come.
;(() => {
  const targets = document.querySelectorAll('.reveal')
  if (!targets.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('shown'))
    return
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('shown')
        io.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  const vh = window.innerHeight
  targets.forEach((el) => {
    if (el.getBoundingClientRect().top < vh) {
      el.classList.add('shown')
    } else {
      io.observe(el)
    }
  })
})()
