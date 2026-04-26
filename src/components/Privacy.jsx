export default function Privacy() {
  return (
    <section id="privacy">
      <div className="wrap">
        <div className="privacy">
          <div>
            <div className="eyebrow">privacy, in plain terms</div>
            <h2>No photo leaves your phone <em>to be judged.</em></h2>
          </div>
          <ul>
            <li><span className="k">01</span><span>Classification runs with on-device AI — your photos are read locally, nothing else.</span></li>
            <li><span className="k">02</span><span>The only upload destination is your own Google Photos, authorized by you through Google's sign-in.</span></li>
            <li><span className="k">03</span><span>Siftly stores a lightweight hash of each photo to avoid processing the same image twice. No cloud, no servers.</span></li>
            <li><span className="k">04</span><span>You can turn auto-sift off, wipe the local index, or sign out anytime. The app stops.</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
