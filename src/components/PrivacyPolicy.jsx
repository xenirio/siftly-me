// Page chrome only. The policy body is fetched from the public Gist
// gist.github.com/xenirio/0ae79679a1bc197f43d35e5bb432229f at build time
// by scripts/prerender.mjs and passed in as `contentHtml`.
// Never hard-code policy copy here — the Gist is the source of truth.
const EMAIL = 'hello@siftly.me'

export default function PrivacyPolicy({ contentHtml = '' }) {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="/"><span className="mark" aria-hidden="true"></span>siftly</a>
          <ul>
            <li><a href="/#how">How it works</a></li>
            <li><a href="/#privacy">Privacy</a></li>
            <li><a href="/#dashboard">The app</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
          <a className="nav-cta" href="/#get">Join the beta <span aria-hidden="true">→</span></a>
        </div>
      </nav>

      <main>
        <section>
          <div className="wrap">
            <article className="legal" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-bottom">
            <span>© 2026 Siftly. Made with care.</span>
            <span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{' · '}
              <a href="/">Back to siftly.me</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
