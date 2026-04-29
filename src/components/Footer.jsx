import { useT } from '../i18n/index.jsx'

const EMAIL = 'hello@siftly.me'

export default function Footer() {
  const t = useT()
  return (
    <footer className="reveal">
      <div className="wrap">
        <div className="foot">
          <div>
            <a className="brand" href="#" style={{ marginBottom: 20 }}>
              <span className="mark" aria-hidden="true"></span>siftly
            </a>
            <p className="mission">{t('footer.mission.l1')}<em>{t('footer.mission.em')}</em></p>
          </div>
          <div>
            <h5>{t('footer.product')}</h5>
            <ul>
              <li><a href="#how">{t('footer.product.howItWorks')}</a></li>
              <li><a href="#dashboard">{t('footer.product.theApp')}</a></li>
              <li><a href="#faq">{t('footer.product.faq')}</a></li>
              <li><a href="#get">{t('footer.product.beta')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer.privacy')}</h5>
            <ul>
              <li><a href="#privacy">{t('footer.privacy.principles')}</a></li>
              <li><a href="/privacy-policy">{t('footer.privacy.policy')}</a></li>
              <li><a href="#">{t('footer.privacy.terms')}</a></li>
              <li><a href="#">{t('footer.privacy.openSource')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer.contact')}</h5>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href="#">{t('footer.contact.github')}</a></li>
              <li><a href="#">{t('footer.contact.changelog')}</a></li>
              <li><a href="#">{t('footer.contact.press')}</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t('footer.copyright')}</span>
          <span className="mono">{t('footer.version')}</span>
        </div>
      </div>
    </footer>
  )
}
