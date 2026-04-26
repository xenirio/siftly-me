const EMAIL = 'hello@siftly.me'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <a className="brand" href="#" style={{ marginBottom: 20 }}>
              <span className="mark" aria-hidden="true"></span>siftly
            </a>
            <p className="mission">A quiet sieve for the camera roll. Keep the ones, <em>leave the rest.</em></p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><a href="#how">How it works</a></li>
              <li><a href="#dashboard">The app</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#get">Beta access</a></li>
            </ul>
          </div>
          <div>
            <h5>Privacy</h5>
            <ul>
              <li><a href="#privacy">Privacy principles</a></li>
              <li><a href="#">Policy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Open source</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Press kit</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Siftly. Made with care.</span>
          <span className="mono">v0.4.2 · beta</span>
        </div>
      </div>
    </footer>
  )
}
