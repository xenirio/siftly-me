import { useT } from '../i18n/index.jsx'

export default function HowItWorks() {
  const t = useT()
  return (
    <section id="how" className="reveal" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t('how.eyebrow')}</div>
          <h2>{t('how.title.l1')}<em>{t('how.title.em1')}</em>{t('how.title.l2')}<em>{t('how.title.em2')}</em></h2>
        </div>
        <div className="rail">
          <div className="step">
            <div className="k">{t('how.step1.kicker')}</div>
            <h4>{t('how.step1.title')}</h4>
            <p>{t('how.step1.body')}</p>
          </div>
          <div className="step">
            <div className="k">{t('how.step2.kicker')}</div>
            <h4>{t('how.step2.title')}</h4>
            <p>{t('how.step2.body')}</p>
          </div>
          <div className="step">
            <div className="k">{t('how.step3.kicker')}</div>
            <h4>{t('how.step3.title')}</h4>
            <p>{t('how.step3.body')}</p>
          </div>
          <div className="step">
            <div className="k">{t('how.step4.kicker')}</div>
            <h4>{t('how.step4.title')}</h4>
            <p>{t('how.step4.body.l1')}<em>{t('how.step4.body.em')}</em>{t('how.step4.body.l2')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
