// Page chrome only. The policy body is fetched from the public Gist
// gist.github.com/xenirio/0ae79679a1bc197f43d35e5bb432229f at build time
// by scripts/prerender.mjs and passed in as `contentHtml`.
// Never hard-code policy copy here — the Gist is the source of truth.
import { useT } from '../i18n/index.jsx'

const EMAIL = 'hello@siftly.me'

export default function PrivacyPolicy({ contentHtml = '' }) {
  const t = useT()
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="/"><span className="mark" aria-hidden="true"></span>siftly</a>
          <ul>
            <li><a href="/#how">{t('nav.howItWorks')}</a></li>
            <li><a href="/#privacy">{t('nav.privacy')}</a></li>
            <li><a href="/#dashboard">{t('nav.theApp')}</a></li>
            <li><a href="/#faq">{t('nav.faq')}</a></li>
          </ul>
          <a className="nav-cta" href="/#get">{t('nav.joinBeta')} <span aria-hidden="true">→</span></a>
        </div>
      </nav>

      <main>
        <section>
          <div className="wrap">
            <article className="legal" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-bottom">
            <span>{t('footer.copyright')}</span>
            <span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{' · '}
              <a href="/">{t('policy.backToHome')}</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
