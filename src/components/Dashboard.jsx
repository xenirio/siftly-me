import { useState } from 'react'

const ChevIcon = () => (
  <svg className="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4"/></svg>
)

const SkipIcon = () => (
  <span className="skip">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l20 20M17.9 17.9A10 10 0 0 1 12 20c-7 0-10-8-10-8a20 20 0 0 1 5.1-6.1M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a20 20 0 0 1-2.2 3.2"/></svg>
  </span>
)

const PHOTO_CATEGORIES = [
  {
    name: 'Document', count: '1 photo', open: true, single: true,
    thumbs: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=300&fit=crop&q=70'],
  },
  { name: 'Food',       count: '0 photos', open: false, thumbs: [] },
  { name: 'Nature',     count: '0 photos', open: false, thumbs: [] },
  { name: 'Other',      count: '1 photo',  open: false, thumbs: [] },
  {
    name: 'People', count: '2 photos', open: true,
    thumbs: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=70',
      'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=300&h=300&fit=crop&q=70',
    ],
  },
  { name: 'Screenshot', count: '0 photos', open: false, thumbs: [] },
]

function CatRow({ name, count, open, single, thumbs }) {
  return (
    <div className="cat-row">
      <div className={`cat-head${open ? ' open' : ''}`}>
        <div className="left">
          <ChevIcon />
          <span><span className="cname">{name}</span><span className="ccount">{count}</span></span>
        </div>
        <div className="switch small off"></div>
      </div>
      {thumbs.length > 0 && (
        <div className={`cat-thumbs${single ? ' single' : ''}`}>
          {thumbs.map((src) => (
            <div key={src} className="cat-thumb">
              <img src={src} alt="" />
              <SkipIcon />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState('home')
  const [backupOn, setBackupOn] = useState(true)

  return (
    <section id="dashboard">
      <div className="wrap">
        <div className="showcase">
          <div className="copy">
            <div className="eyebrow">the app</div>
            <h2>A dashboard that <em>tells you one thing:</em> how much space we kept out of your cloud.</h2>
            <p>A single number. A smart-backup switch. A storage-health gauge that climbs as you sift. That's most of it.</p>
            <ul>
              <li><span className="tag">A.</span>Smart Sifting Status — megabytes kept local this week</li>
              <li><span className="tag">B.</span>Smart backup — one switch to let Siftly work in the background</li>
              <li><span className="tag">C.</span>Storage Health — live split of what's local vs. in the cloud</li>
              <li><span className="tag">D.</span>Sifting Activity — categories synced, at a glance</li>
              <li><span className="tag">E.</span>Home and Photos — two tabs, nothing buried</li>
            </ul>
          </div>

          <div className="phone-wrap">
            <div className="phone" id="siftlyPhone">
              <div className="screen">
                <div className="status-bar">
                  <span>12:12</span>
                  <span className="left-dots" style={{ marginLeft: 10 }}>
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6.5L4 13.5V11H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></svg>
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2a3 3 0 0 0-3 3v3.2L3.5 10.5h9L11 8.2V5a3 3 0 0 0-3-3zm-1.4 9a1.4 1.4 0 0 0 2.8 0H6.6z"/></svg>
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3v10l9-5L4 3z"/></svg>
                  </span>
                  <span className="icons" style={{ marginLeft: 'auto' }}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2a4 4 0 0 0-4 4v3l-1.5 2h11L12 9V6a4 4 0 0 0-4-4Z"/><path d="M2 2l12 12"/></svg>
                    <svg viewBox="0 0 16 10" fill="currentColor" aria-hidden="true"><rect x="0" y="7" width="2.6" height="3" rx="0.5"/><rect x="4.5" y="5" width="2.6" height="5" rx="0.5"/><rect x="9" y="3" width="2.6" height="7" rx="0.5"/><rect x="13.4" y="0" width="2.6" height="10" rx="0.5"/></svg>
                    <svg viewBox="0 0 16 12" fill="currentColor" aria-hidden="true"><path d="M8 1C5.5 1 3.2 1.9 1.5 3.4l1.2 1.3A7.5 7.5 0 0 1 8 2.6c2 0 3.8.7 5.3 2l1.2-1.2A9 9 0 0 0 8 1Zm0 3.3c-1.6 0-3 .6-4.1 1.5l1.2 1.3A4.5 4.5 0 0 1 8 5.8c1.1 0 2.2.4 3 1.1l1.2-1.2A6 6 0 0 0 8 4.3Zm0 3.2a2.3 2.3 0 0 0-1.8.8L8 11.1l1.8-2.7A2.3 2.3 0 0 0 8 7.5Z"/></svg>
                    <svg viewBox="0 0 30 14" fill="none" aria-hidden="true">
                      <rect x="1" y="1" width="22" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <rect x="3" y="3" width="18" height="8" rx="1.5" fill="#9FE870"/>
                      <rect x="24" y="4.5" width="2" height="5" rx="0.6" fill="currentColor"/>
                      <path d="M13.5 3.5l-2 4h2l-1 3 3.5-4.2h-2.2z" fill="#0a0907"/>
                    </svg>
                  </span>
                </div>

                <div className={`screen-view ${tab === 'home' ? 'active' : ''}`} data-view="home">
                  <div className="app-head">
                    <div className="brand-block">
                      <h3>Siftly</h3>
                      <p className="tagline">Your photos, <em>effortlessly safe</em></p>
                    </div>
                    <div className="gear" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    </div>
                  </div>

                  <div className="sifting-card">
                    <div className="radar" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
                    <div className="kicker">SMART SIFTING STATUS</div>
                    <div className="big">27<span className="unit">MB</span></div>
                    <div className="sub">kept out of your cloud</div>
                    <div className="weekrow">
                      <div className="weekbars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                      <div className="weeklabel">
                        <span className="plus">+27 MB this week</span>
                        <span className="days">7-day savings</span>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="backup-row">
                      <div className="left">
                        <svg className="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z"/><path d="M9 12l2 2 4-4"/></svg>
                        <span className="label">Smart backup</span>
                      </div>
                      <div
                        className={`switch ${backupOn ? '' : 'off'}`}
                        role="switch"
                        aria-checked={backupOn ? 'true' : 'false'}
                        onClick={() => setBackupOn(v => !v)}
                      ></div>
                    </div>
                  </div>

                  <div className="mini-row">
                    <div className="mini-card">
                      <h4>Sifting Activity</h4>
                      <div className="sub">0 categories synced</div>
                      <div className="empty">No activity yet</div>
                    </div>
                    <div className="mini-card">
                      <h4>Storage Health</h4>
                      <div className="sub">Kept Local</div>
                      <div className="gauge">
                        <svg viewBox="0 0 120 64" aria-hidden="true">
                          <path className="track" d="M12 58 A48 48 0 0 1 108 58" fill="none" strokeWidth="10" strokeLinecap="round"/>
                          <path className="fill" d="M12 58 A48 48 0 0 1 108 58" fill="none" strokeWidth="10" strokeLinecap="round"/>
                        </svg>
                        <span className="pct">100%</span>
                      </div>
                      <div className="legend"><span><i></i>Local</span><span><i className="cloud"></i>Cloud</span></div>
                    </div>
                  </div>

                  <div className="pill-row">
                    <div className="pill-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M3 16l5-4 4 3 3-3 6 5"/></svg>
                      <span className="count">4 photos</span>
                    </div>
                    <div className="pill-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                      <span className="count">0 synced</span>
                    </div>
                  </div>
                </div>

                <div className={`screen-view ${tab === 'photos' ? 'active' : ''}`} data-view="photos">
                  <div className="cats-list">
                    {PHOTO_CATEGORIES.map((c) => <CatRow key={c.name} {...c} />)}
                  </div>
                </div>

                <div className="nav-tab" id="phoneNav">
                  <span
                    data-tab="home"
                    className={tab === 'home' ? 'active' : ''}
                    onClick={() => setTab('home')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/></svg>
                    Home
                  </span>
                  <span
                    data-tab="photos"
                    className={tab === 'photos' ? 'active' : ''}
                    onClick={() => setTab('photos')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M8 6 9.5 3h5L16 6"/><circle cx="12" cy="13" r="3.5"/></svg>
                    Photos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
