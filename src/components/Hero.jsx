import heroKeep1 from '../assets/photos/hero-keep-1.jpg'
import heroKeep2 from '../assets/photos/hero-keep-2.jpg'
import heroSkip from '../assets/photos/hero-skip.jpg'

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
              <img src={heroKeep1} alt="" />
              <span className="badge memory">Memory</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">memory</span></div>
            </div>
            <div className="photo ph-2">
              <img src={heroKeep2} alt="" />
              <span className="badge memory">Memory</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">memory</span></div>
            </div>
            <div className="photo ph-3">
              <img src={heroSkip} alt="" />
              <span className="badge utility">Utility</span>
              <div className="strike"></div>
              <div className="verdict skip"><span className="ico">×</span><span>Skipped · stays local</span><span className="sub">utility</span></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
