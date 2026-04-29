import { useT } from '../i18n/index.jsx'

const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5']

export default function Faq() {
  const t = useT()
  return (
    <section id="faq" className="reveal">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t('faq.eyebrow')}</div>
          <h2>{t('faq.title.l1')}<em>{t('faq.title.em')}</em></h2>
        </div>
        <div className="faq" style={{ paddingTop: 24 }}>
          {QUESTION_KEYS.map((k) => (
            <details key={k}>
              <summary>{t(`faq.${k}.q`)}<span className="plus">+</span></summary>
              <p>{t(`faq.${k}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
