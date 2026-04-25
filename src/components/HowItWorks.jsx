export default function HowItWorks() {
  return (
    <section id="how" style={{ paddingTop: 32 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">how it works</div>
          <h2>Four quiet steps between <em>shutter</em> and <em>archive.</em></h2>
        </div>
        <div className="rail">
          <div className="step">
            <div className="k">step / 01 · detect</div>
            <h4>A new photo appears.</h4>
            <p>Siftly picks it up through the system's media index — no gallery polling, no thumbnails copied.</p>
          </div>
          <div className="step">
            <div className="k">step / 02 · classify</div>
            <h4>Gemini Nano reads it.</h4>
            <p>Locally, in batches of five. Each photo becomes one of eight categories — people, nature, food, documents, and more.</p>
          </div>
          <div className="step">
            <div className="k">step / 03 · decide</div>
            <h4>Keeper, or clutter.</h4>
            <p>Memories get queued for backup. Utility shots stay on your phone where they started.</p>
          </div>
          <div className="step">
            <div className="k">step / 04 · archive</div>
            <h4>Uploaded when conditions are right.</h4>
            <p>Google Photos receives only the keepers, on Wi-Fi and while charging. You can also tap <em>Back up now</em>.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
