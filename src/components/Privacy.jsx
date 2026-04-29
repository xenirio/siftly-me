import { useT } from '../i18n/index.jsx'

export default function Privacy() {
  const t = useT()
  return (
    <section id="privacy" className="reveal">
      <div className="wrap">
        <div className="privacy">
          <div>
            <div className="eyebrow">{t('privacy.eyebrow')}</div>
            <h2>{t('privacy.title.l1')}<em>{t('privacy.title.em')}</em></h2>
          </div>
          <ul>
            <li><span className="k">01</span><span>{t('privacy.point1')}</span></li>
            <li><span className="k">02</span><span>{t('privacy.point2')}</span></li>
            <li><span className="k">03</span><span>{t('privacy.point3')}</span></li>
            <li><span className="k">04</span><span>{t('privacy.point4')}</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
