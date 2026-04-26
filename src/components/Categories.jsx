import { useState } from 'react'
import catPeople from '../assets/photos/hero-people.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catNature from '../assets/photos/cat-nature.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catAnimal from '../assets/photos/cat-animal.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catFood from '../assets/photos/cat-food.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catBuilding from '../assets/photos/cat-building.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catDocument from '../assets/photos/cat-document.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catScreenshot from '../assets/photos/cat-screenshot.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catPeople2 from '../assets/photos/cat-people-2.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catNature2 from '../assets/photos/cat-nature-2.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catAnimal2 from '../assets/photos/cat-animal-2.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catFood2 from '../assets/photos/cat-food-2.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import catBuilding2 from '../assets/photos/cat-building-2.jpg?as=picture&format=avif;webp;jpg&w=240;480'
import Picture from './Picture.jsx'

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

// Filenames are historical; the cat field reflects what the image
// actually shows. cat-nature.jpg is a hand holding books and
// cat-people-2.jpg is a pair of soccer cleats — both are "other".
const LIBRARY = [
  { src: catPeople,     cat: 'people' },     // kids playing in a forest
  { src: catNature,     cat: 'other' },      // hand holding stack of books
  { src: catAnimal,     cat: 'animal' },     // black pug in a sweater
  { src: catFood,       cat: 'food' },       // plates of food, top-down
  { src: catBuilding,   cat: 'building' },   // NYC street with buildings
  { src: catDocument,   cat: 'document' },   // laptop showing a webpage
  { src: catScreenshot, cat: 'screenshot' }, // 3D-rendered app icons
  { src: catPeople2,    cat: 'other' },      // soccer cleats on a field
  { src: catNature2,    cat: 'nature' },     // mountain lake with a boathouse
  { src: catAnimal2,    cat: 'animal' },     // corgi puppy
  { src: catFood2,      cat: 'food' },       // restaurant plate
  { src: catBuilding2,  cat: 'building' },   // Chicago skyline
]

const THUMB_SIZES = '(max-width: 720px) 33vw, 240px'

export default function Categories() {
  const [selected, setSelected] = useState('all')

  return (
    <section className="reveal" style={{ paddingTop: 0 }}>
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
                <Picture image={p.src} alt="" loading="lazy" sizes={THUMB_SIZES} />
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
