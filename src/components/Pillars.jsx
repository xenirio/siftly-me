export default function Pillars() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">what siftly is</div>
          <h2>Your camera roll, <em>quietly curated</em> before it ever leaves your phone.</h2>
        </div>
        <div className="pillars">
          <article className="pillar">
            <div className="num">01 / on-device</div>
            <h3>Private by <em>architecture.</em></h3>
            <p>Classification runs locally using Gemini Nano via ML Kit. Nothing is sent off-device to decide what a photo is.</p>
          </article>
          <article className="pillar">
            <div className="num">02 / selective</div>
            <h3>Backs up what you'd <em>miss.</em></h3>
            <p>Only photos marked as keepers are uploaded to Google Photos. Screenshots, receipts, and QR blurs are left behind — not deleted, just not archived.</p>
          </article>
          <article className="pillar">
            <div className="num">03 / ambient</div>
            <h3>Works while you <em>don't think about it.</em></h3>
            <p>Runs hourly on Wi-Fi + charging, or on demand. No feeds, no streaks, no notifications that don't matter.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
