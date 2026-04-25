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

function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observed = new Set()

    // Positive bottom rootMargin pre-triggers the 900ms fade ~300px before the
    // element enters the viewport, so it's mostly visible by the time the user
    // reaches it. threshold:0 fires on the first pixel — together they collapse
    // the blank window that the previous late-triggering IO left during scroll.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) reveal(e.target) })
    }, { rootMargin: '0px 0px 300px 0px', threshold: 0 })

    const reveal = (el) => {
      el.classList.add('in')
      io.unobserve(el)
      observed.delete(el)
    }

    const vh = window.innerHeight
    const shouldRevealNow = (el) => reduce || el.getBoundingClientRect().top < vh

    const observe = (el) => {
      if (shouldRevealNow(el)) el.classList.add('in')
      else { observed.add(el); io.observe(el) }
    }

    REVEAL_SELECTORS.forEach(([sel, cls]) => {
      document.querySelectorAll(sel).forEach((el) => {
        cls.split(' ').forEach((c) => el.classList.add(c))
        observe(el)
      })
    })
    document.querySelectorAll('.collage-anim').forEach(observe)

    // IO callbacks can lag a frame or two during very fast scroll (page-down,
    // fling-scroll). Re-check observed elements on each scroll tick as a safety
    // net so nothing stays blank after passing into view.
    let raf = 0
    const onScroll = () => {
      if (raf || !observed.size) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = window.innerHeight
        for (const el of observed) {
          if (el.getBoundingClientRect().top < h) reveal(el)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
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
