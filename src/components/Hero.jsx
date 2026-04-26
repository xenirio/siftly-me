// ph-1 (largest): kids playing in a forest — group/family shot for People.
// ph-2: lake + boathouse — Nature. ph-3: phone-on-receipts — Document (skip).
// hero-people.jpg has a unique filename prefix so prerender's LCP glob
// (`hero-people-*.avif`) doesn't clash with `cat-people-2-*` (the cleats).
import heroKeep1 from '../assets/photos/hero-people.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import heroKeep2 from '../assets/photos/hero-keep-2.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import heroSkip from '../assets/photos/hero-skip.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import Picture from './Picture.jsx'

const HERO_SIZES = '(max-width: 720px) 80vw, (max-width: 1100px) 40vw, 480px'

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">for android · on-device ai</div>
            <h1>
              Keep the photos
              <span className="line2"><em>that matter.</em></span>
            </h1>
            <p className="hero-lede">Siftly is a quiet, on-device sieve for your camera roll. It separates real memories from the receipts, screenshots, and blur — then backs up only the keepers to Google Photos.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#get">Join the beta <span className="arrow">↗</span></a>
              <a className="btn btn-ghost" href="#how">How it works</a>
            </div>
            <div className="hero-meta">
              <span><span className="dot"></span>Private by design</span>
              <span><span className="dot" style={{ background: 'var(--ink)' }}></span>Quietly automatic</span>
            </div>
          </div>

          <div className="collage" aria-hidden="true">
            <div className="photo ph-1">
              <Picture image={heroKeep1} alt="" sizes={HERO_SIZES} fetchPriority="high" decoding="sync" />
              <span className="badge memory">People</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">people</span></div>
            </div>
            <div className="photo ph-2">
              <Picture image={heroKeep2} alt="" sizes={HERO_SIZES} fetchPriority="low" />
              <span className="badge memory">Nature</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">nature</span></div>
            </div>
            <div className="photo ph-3">
              <Picture image={heroSkip} alt="" sizes={HERO_SIZES} fetchPriority="low" />
              <span className="badge utility">Document</span>
              <div className="strike"></div>
              <div className="verdict skip"><span className="ico">×</span><span>Skipped · stays local</span><span className="sub">document</span></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
