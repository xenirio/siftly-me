export default function Hero({ copy }) {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">for android · on-device ai</div>
            <h1>
              {copy.heroLine1}
              <span className="line2"><em>{copy.heroLine2}</em></span>
            </h1>
            <p className="hero-lede">{copy.heroLede}</p>
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
              <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=900&q=80" alt="" loading="lazy" />
              <span className="badge memory">Memory</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">memory</span></div>
            </div>
            <div className="photo ph-2">
              <img src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80" alt="" loading="lazy" />
              <span className="badge memory">Memory</span>
              <div className="verdict keep"><span className="ico">✓</span><span>Kept · backing up</span><span className="sub">memory</span></div>
            </div>
            <div className="photo ph-3">
              <img src="https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=700&q=80" alt="" loading="lazy" />
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
