import { useState } from 'react'

const CATEGORIES = [
  { key: 'all',        label: 'ALL',        muted: false },
  { key: 'people',     label: 'PEOPLE',     muted: false },
  { key: 'animal',     label: 'ANIMAL',     muted: false },
  { key: 'food',       label: 'FOOD',       muted: false },
  { key: 'nature',     label: 'NATURE',     muted: false },
  { key: 'building',   label: 'BUILDING',   muted: false },
  { key: 'document',   label: 'DOCUMENT',   muted: true  },
  { key: 'screenshot', label: 'SCREENSHOT', muted: true  },
  { key: 'other',      label: 'OTHER',      muted: true  },
]

const LIBRARY = [
  { src: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=300&q=70', cat: 'people' },
  { src: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=300&q=70', cat: 'nature' },
  { src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=70', cat: 'animal' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=70', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=300&q=70', cat: 'building' },
  { src: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=300&q=70', cat: 'document' },
  { src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=70', cat: 'screenshot' },
  { src: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=300&q=70', cat: 'people' },
  { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=300&q=70', cat: 'nature' },
  { src: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=300&q=70', cat: 'animal' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=70', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=70', cat: 'building' },
]

export default function Categories() {
  const [selected, setSelected] = useState('all')

  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">eight categories</div>
          <h2>Every photo becomes <em>one small word</em> before anything else happens.</h2>
        </div>
        <div style={{ padding: '44px 0 8px' }}>
          <div className="cats" id="catsRow">
            {CATEGORIES.map(({ key, label, muted }) => (
              <span
                key={key}
                className={`chip ${selected === key ? 'selected' : ''}`}
                data-cat={key}
                onClick={() => setSelected(key)}
              >
                <span className="c" style={muted ? { background: 'var(--muted)' } : undefined}></span>
                {label}
              </span>
            ))}
          </div>
          <div className="filter-preview" id="filterPreview">
            {LIBRARY.map((p, i) => (
              <div
                key={i}
                className={`fp-thumb ${selected !== 'all' && p.cat !== selected ? 'dim' : ''}`}
                data-cat={p.cat}
              >
                <img src={p.src} alt="" loading="lazy" />
                <span className="ftag">{p.cat}</span>
              </div>
            ))}
          </div>
          <p className="mono" style={{ marginTop: 22 }}>tap a category to filter · gold = usually a keeper · gray = usually a utility shot</p>
        </div>
      </div>
    </section>
  )
}
