import { readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const assetsDir = resolve(distDir, 'assets')
const indexPath = resolve(distDir, 'index.html')
const ssrEntry = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render } = await import(ssrEntry)
const appHtml = render()

const assets = await readdir(assetsDir)

// Match hashed asset filenames. Vite preserves the original name and inserts
// a hash before the extension (or appends one for some assets).
function findOne(pattern, label) {
  const hits = assets.filter((f) => pattern.test(f))
  if (hits.length === 0) throw new Error(`prerender: no ${label} found in dist/assets (pattern: ${pattern})`)
  if (hits.length > 1) throw new Error(`prerender: ${hits.length} ${label} candidates found: ${hits.join(', ')}`)
  return `/assets/${hits[0]}`
}

// Map every <prefix> AVIF asset to a width. Vite-imagetools encodes width as
// "-<NNN>w-" within the filename (when emitted alongside the hash). Use stat
// would be more robust but the asset list already carries the widths inline.
async function avifSrcset(prefix) {
  const hits = assets.filter((f) => f.startsWith(prefix) && f.endsWith('.avif'))
  if (hits.length === 0) throw new Error(`prerender: no AVIF variants for ${prefix}`)
  // Read each AVIF's intrinsic width from its first 'ispe' box.
  const entries = []
  for (const f of hits) {
    const buf = await readFile(resolve(assetsDir, f))
    const w = readAvifWidth(buf)
    entries.push({ file: f, w })
  }
  entries.sort((a, b) => a.w - b.w)
  return entries.map((e) => `/assets/${e.file} ${e.w}w`).join(', ')
}

// Minimal AVIF width parser: scans for the 'ispe' box and reads its width.
function readAvifWidth(buf) {
  const needle = Buffer.from('ispe')
  const i = buf.indexOf(needle)
  if (i < 0) return 0
  // ispe is followed by version+flags (4 bytes), then width (4 bytes BE).
  return buf.readUInt32BE(i + 8)
}

const cssHref = findOne(/^index-[^.]+\.css$/, 'main CSS bundle')
const cssPath = resolve(assetsDir, cssHref.replace(/^\/assets\//, ''))
const cssText = await readFile(cssPath, 'utf-8')

// Match "<name>-<hash>.woff2" where hash is alphanumeric/underscore (no dash),
// so Inter regular won't collide with any future Inter-italic and Instrument
// Serif regular won't collide with the italic variant.
const interFont = findOne(/^inter-[A-Za-z0-9_]+\.woff2$/, 'Inter font')
const serifFont = findOne(/^instrument-serif-[A-Za-z0-9_]+\.woff2$/, 'Instrument Serif font')

// Responsive preload for the LCP hero image. Browser uses imagesrcset/imagesizes
// to pick the same variant the <picture> would, so the preload doesn't
// double-fetch a too-large file on mobile.
const heroAvifSrcset = await avifSrcset('hero-keep-1-')
// Must mirror HERO_SIZES in src/components/Hero.jsx.
const HERO_SIZES = '(max-width: 720px) 80vw, (max-width: 1100px) 40vw, 480px'

const preloads = [
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="${interFont}">`,
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="${serifFont}">`,
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${heroAvifSrcset}" imagesizes="${HERO_SIZES}" fetchpriority="high">`,
].join('\n    ')

const inlinedStyle = `<style>${cssText}</style>`

const template = await readFile(indexPath, 'utf-8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
}

let html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
)

// Strip the render-blocking CSS <link> Vite injected, and replace with inlined style + preloads.
html = html.replace(
  /\s*<link rel="stylesheet"[^>]*href="\/assets\/index-[^"]+\.css"[^>]*>/,
  ''
)
html = html.replace('</head>', `    ${preloads}\n    ${inlinedStyle}\n  </head>`)

await writeFile(indexPath, html)
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(
  `prerender: injected ${appHtml.length} chars of HTML, ${cssText.length} chars of inline CSS, ` +
  `and 3 preloads (fonts: 2, hero AVIF: 1) into dist/index.html`
)
