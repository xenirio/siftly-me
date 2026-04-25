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
import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './components/TweaksPanel.jsx'

const TWEAKS = [
  { key: 'mood',    section: 'Mood',    label: 'Palette',       options: ['warm', 'cool', 'mono', 'sepia'] },
  { key: 'voice',   section: 'Voice',   label: 'Headline type', options: ['serif', 'sans', 'mono']         },
  { key: 'density', section: 'Density', label: 'Rhythm',        options: ['airy', 'standard', 'compact']   },
]

const TWEAK_DEFAULTS = {
  mood: 'warm',
  voice: 'serif',
  density: 'standard',
}

const COPY = {
  serif: {
    heroLine1: 'Keep the photos',
    heroLine2: 'that matter.',
    heroLede: 'Siftly is a quiet, on-device sieve for your camera roll. It separates real memories from the receipts, screenshots, and blur — then backs up only the keepers to Google Photos.',
    ctaBand:  { a: 'Keep the ones,', b: 'leave the rest.' },
    mission:  { a: 'A quiet sieve for the camera roll. Keep the ones,', b: 'leave the rest.' },
  },
  sans: {
    heroLine1: 'keep the photos',
    heroLine2: 'that matter.',
    heroLede: "A private, on-device sieve for Android. Sort memories from clutter. Back up only what's worth it. Nothing leaves your phone to be judged.",
    ctaBand:  { a: 'keep the ones,', b: 'leave the rest.' },
    mission:  { a: 'private sieve for the camera roll.', b: 'keep the ones.' },
  },
  mono: {
    heroLine1: '// KEEP_PHOTOS',
    heroLine2: 'THAT_MATTER()',
    heroLede: 'Runs on-device. Gemini Nano → 8 categories → keepers.upload(GPHOTOS). No cloud inference. No telemetry. Open the dashboard, flip one toggle.',
    ctaBand:  { a: 'KEEP.ONES(),', b: 'LEAVE.REST()' },
    mission:  { a: 'ON-DEVICE SIEVE FOR THE CAMERA ROLL.', b: 'KEEP.ONES()' },
  },
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const copy = COPY[t.voice]

  useEffect(() => {
    document.body.dataset.mood = t.mood
    document.body.dataset.voice = t.voice
    document.body.dataset.density = t.density
  }, [t.mood, t.voice, t.density])

  useScrollReveal()
  useCollageParallax()

  return (
    <>
      <Nav />
      <Hero copy={copy} />
      <Pillars />
      <HowItWorks />
      <Dashboard />
      <Categories />
      <Privacy />
      <Faq />
      <CtaBand copy={copy} />
      <Footer copy={copy} />
      <TweaksPanel title="Tweaks">
        {TWEAKS.map(({ key, section, label, options }) => (
          <div key={key}>
            <TweakSection label={section} />
            <TweakRadio
              label={label}
              value={t[key]}
              options={options}
              onChange={(v) => setTweak(key, v)}
            />
          </div>
        ))}
      </TweaksPanel>
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

    REVEAL_SELECTORS.forEach(([sel, cls]) => {
      document.querySelectorAll(sel).forEach((el) => {
        cls.split(' ').forEach((c) => el.classList.add(c))
        if (reduce) el.classList.add('in')
        else io.observe(el)
      })
    })

    document.querySelectorAll('.collage-anim').forEach((el) => {
      if (reduce) el.classList.add('in')
      else collageObs.observe(el)
    })

    // IO fires async; reveal already-visible hero/collage on first frame to avoid FOUC.
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.85) el.classList.add('in')
      })
      const c = document.querySelector('.collage-anim')
      if (c && c.getBoundingClientRect().top < window.innerHeight * 0.85) c.classList.add('in')
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
