import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Pillars from './components/Pillars.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Dashboard from './components/Dashboard.jsx'
import Categories from './components/Categories.jsx'
import Privacy from './components/Privacy.jsx'
import Faq from './components/Faq.jsx'
import CtaBand from './components/CtaBand.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  useScrollReveal()
  useCollageParallax()

  return (
    <>
      <Nav />
      <Hero />
      <Pillars />
      <HowItWorks />
      <Dashboard />
      <Categories />
      <Privacy />
      <Faq />
      <CtaBand />
      <Footer />
    </>
  )
}

const REVEAL_SELECTORS = [
  ['.hero .eyebrow', 'reveal'],
  ['.hero h1', 'reveal reveal-rise'],
  ['.hero-lede', 'reveal'],
  ['.hero-cta', 'reveal'],
  ['.hero-meta', 'reveal'],
  ['.collage', 'collage-anim'],
  ['.section-head .eyebrow', 'reveal'],
  ['.section-head h2', 'reveal reveal-rise'],
  ['.section-head p', 'reveal'],
  ['.pillars', 'stagger draw-line'],
  ['.pillar', 'reveal'],
  ['.rail', 'stagger draw-line'],
  ['.step', 'reveal'],
  ['.showcase .copy > *', 'reveal'],
  ['.phone-wrap', 'reveal reveal-rise'],
  ['.cats', 'stagger'],
  ['.chip', 'reveal reveal-fade'],
  ['.privacy > div:first-child > *', 'reveal'],
  ['.privacy ul', 'stagger'],
  ['.privacy li', 'reveal'],
  ['.faq details', 'reveal'],
  ['.cta-band .eyebrow', 'reveal'],
  ['.cta-band h2', 'reveal reveal-rise'],
  ['.cta-band p', 'reveal'],
  ['.cta-band form', 'reveal'],
  ['.foot > div', 'reveal'],
]

function makeRevealObserver(opts) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    })
  }, opts)
  return io
}

function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = makeRevealObserver({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    const collageObs = makeRevealObserver({ threshold: 0.2 })

    // IO never fires `isIntersecting: true` for elements above the viewport, so
    // anything the user has already scrolled to or past would stay invisible if
    // React mounts mid-scroll. Reveal those synchronously instead of observing.
    const vh = window.innerHeight
    const shouldRevealNow = (el) => reduce || el.getBoundingClientRect().top < vh

    REVEAL_SELECTORS.forEach(([sel, cls]) => {
      document.querySelectorAll(sel).forEach((el) => {
        cls.split(' ').forEach((c) => el.classList.add(c))
        if (shouldRevealNow(el)) el.classList.add('in')
        else io.observe(el)
      })
    })

    document.querySelectorAll('.collage-anim').forEach((el) => {
      if (shouldRevealNow(el)) el.classList.add('in')
      else collageObs.observe(el)
    })

    return () => {
      io.disconnect()
      collageObs.disconnect()
    }
  }, [])
}

function useCollageParallax() {
  useEffect(() => {
    const collage = document.querySelector('.collage')
    if (!collage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    collage.dataset.tilt = 'on'

    let rafId = null, targetX = 0, targetY = 0, curX = 0, curY = 0

    const onMove = (e) => {
      const r = collage.getBoundingClientRect()
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (!rafId) loop()
    }
    const onLeave = () => { targetX = 0; targetY = 0; if (!rafId) loop() }

    function loop() {
      curX += (targetX - curX) * 0.1
      curY += (targetY - curY) * 0.1
      collage.style.setProperty('--mx', curX.toFixed(3))
      collage.style.setProperty('--my', curY.toFixed(3))
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        rafId = requestAnimationFrame(loop)
      } else { rafId = null }
    }

    collage.addEventListener('mousemove', onMove)
    collage.addEventListener('mouseleave', onLeave)
    return () => {
      collage.removeEventListener('mousemove', onMove)
      collage.removeEventListener('mouseleave', onLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}
