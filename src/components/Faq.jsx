const QUESTIONS = [
  {
    q: 'Does Siftly delete photos?',
    a: "Never. Photos classified as Utility simply aren't uploaded. They stay where they were — on your phone, in your camera roll, exactly as you took them.",
  },
  {
    q: 'What if the AI is wrong?',
    a: 'Open the photo, tap the correct category, and Siftly remembers — for your library only. Corrections use perceptual similarity and folder patterns to improve future calls for photos like it.',
  },
  {
    q: 'Which devices support on-device AI?',
    a: 'On-device AI runs on recent Android hardware that supports it. On unsupported devices, Siftly falls back to treating every photo as a keeper so nothing is missed.',
  },
  {
    q: 'Where do backups go?',
    a: "Your Google Photos library, and only yours. Siftly never holds credentials on a server — sign-in uses Android's Credential Manager with a standard OAuth2 scope.",
  },
  {
    q: 'Is there an iOS version?',
    a: "Not yet. On-device AI support on iOS is a different animal. If it becomes feasible to do the same thing privately on iOS, we'll look at it.",
  },
]

export default function Faq() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">questions, briefly</div>
          <h2>Things people <em>ask first.</em></h2>
        </div>
        <div className="faq" style={{ paddingTop: 24 }}>
          {QUESTIONS.map(({ q, a }) => (
            <details key={q}>
              <summary>{q}<span className="plus">+</span></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
