export default function Nav() {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#"><span className="mark" aria-hidden="true"></span>siftly</a>
        <ul>
          <li><a href="#how">How it works</a></li>
          <li><a href="#privacy">Privacy</a></li>
          <li><a href="#dashboard">The app</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a className="nav-cta" href="#get">Join the beta <span aria-hidden="true">→</span></a>
      </div>
    </nav>
  )
}
