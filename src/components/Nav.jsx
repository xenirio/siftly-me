import { useLocale, useT } from '../i18n/index.jsx'

export default function Nav() {
  const t = useT()
  const locale = useLocale()
  const homeHref = locale === 'th' ? '/th/' : '/'

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href={homeHref}><span className="mark" aria-hidden="true"></span>siftly</a>
        <ul>
          <li><a href="#how">{t('nav.howItWorks')}</a></li>
          <li><a href="#privacy">{t('nav.privacy')}</a></li>
          <li><a href="#dashboard">{t('nav.theApp')}</a></li>
          <li><a href="#faq">{t('nav.faq')}</a></li>
        </ul>
        <div className="nav-end">
          <div className="lang-toggle" role="group" aria-label="Language">
            <a href="/" className={locale === 'en' ? 'active' : ''} aria-current={locale === 'en' ? 'true' : undefined}>EN</a>
            <a href="/th/" className={locale === 'th' ? 'active' : ''} aria-current={locale === 'th' ? 'true' : undefined}>TH</a>
          </div>
          <a className="nav-cta" href="#get">{t('nav.joinBeta')} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </nav>
  )
}
