// ph-1 (largest): kids playing in a forest — group/family shot for People.
// ph-2: lake + boathouse — Nature. ph-3: phone-on-receipts — Document (skip).
// hero-people.jpg has a unique filename prefix so prerender's LCP glob
// (`hero-people-*.avif`) doesn't clash with `cat-people-2-*` (the cleats).
import heroKeep1 from '../assets/photos/hero-people.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import heroKeep2 from '../assets/photos/hero-keep-2.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import heroSkip from '../assets/photos/hero-skip.jpg?as=picture&format=avif;webp;jpg&w=320;480'
import Picture from './Picture.jsx'
import { useT } from '../i18n/index.jsx'

const HERO_SIZES = '(max-width: 720px) 80vw, (max-width: 1100px) 40vw, 480px'

// Drive each photo frame's CSS aspect-ratio from the source image's
// intrinsic dimensions so the image fills the frame edge-to-edge (no
// object-fit:cover crop on the top/bottom or left/right).
const ratioStyle = (img) => ({ aspectRatio: `${img.img.w} / ${img.img.h}` })

export default function Hero() {
  const t = useT()
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">{t('hero.eyebrow')}</div>
            <h1>
              {t('hero.title.l1')}
              <span className="line2"><em>{t('hero.title.l2')}</em></span>
            </h1>
            <p className="hero-lede">{t('hero.lede')}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#get">{t('hero.ctaPrimary')} <span className="arrow">↗</span></a>
              <a className="btn btn-ghost" href="#how">{t('hero.ctaSecondary')}</a>
            </div>
            <div className="hero-meta">
              <span><span className="dot"></span>{t('hero.metaPrivate')}</span>
              <span><span className="dot" style={{ background: 'var(--ink)' }}></span>{t('hero.metaQuiet')}</span>
            </div>
          </div>

          <div className="collage" aria-hidden="true">
            <div className="photo ph-1" style={ratioStyle(heroKeep1)}>
              <Picture image={heroKeep1} alt="" sizes={HERO_SIZES} fetchPriority="high" decoding="sync" />
              <span className="badge memory">{t('hero.badge.people')}</span>
              <div className="verdict keep"><span className="ico">✓</span><span>{t('hero.verdict.keep')}</span><span className="sub">{t('hero.sub.people')}</span></div>
            </div>
            <div className="photo ph-2" style={ratioStyle(heroKeep2)}>
              <Picture image={heroKeep2} alt="" sizes={HERO_SIZES} fetchPriority="low" />
              <span className="badge memory">{t('hero.badge.nature')}</span>
              <div className="verdict keep"><span className="ico">✓</span><span>{t('hero.verdict.keep')}</span><span className="sub">{t('hero.sub.nature')}</span></div>
            </div>
            <div className="photo ph-3" style={ratioStyle(heroSkip)}>
              <Picture image={heroSkip} alt="" sizes={HERO_SIZES} fetchPriority="low" />
              <span className="badge utility">{t('hero.badge.document')}</span>
              <div className="strike"></div>
              <div className="verdict skip"><span className="ico">×</span><span>{t('hero.verdict.skip')}</span><span className="sub">{t('hero.sub.document')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
