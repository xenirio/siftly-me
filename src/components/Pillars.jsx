import { useT } from '../i18n/index.jsx'

export default function Pillars() {
  const t = useT()
  return (
    <section className="reveal" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">{t('pillars.head.eyebrow')}</div>
          <h2>{t('pillars.head.title.l1')}<em>{t('pillars.head.title.em')}</em>{t('pillars.head.title.l2')}</h2>
        </div>
        <div className="pillars">
          <article className="pillar">
            <div className="num">{t('pillars.col1.num')}</div>
            <h3>{t('pillars.col1.title.l1')}<em>{t('pillars.col1.title.em')}</em></h3>
            <p>{t('pillars.col1.body')}</p>
          </article>
          <article className="pillar">
            <div className="num">{t('pillars.col2.num')}</div>
            <h3>{t('pillars.col2.title.l1')}<em>{t('pillars.col2.title.em')}</em></h3>
            <p>{t('pillars.col2.body')}</p>
          </article>
          <article className="pillar">
            <div className="num">{t('pillars.col3.num')}</div>
            <h3>{t('pillars.col3.title.l1')}<em>{t('pillars.col3.title.em')}</em></h3>
            <p>{t('pillars.col3.body')}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
