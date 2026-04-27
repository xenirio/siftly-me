import { readFile, writeFile, rm, readdir, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const assetsDir = resolve(distDir, 'assets')
const indexPath = resolve(distDir, 'index.html')
const privacyDir = resolve(distDir, 'privacy-policy')
const privacyPath = resolve(privacyDir, 'index.html')
const ssrEntry = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render, renderPrivacy } = await import(ssrEntry)
const appHtml = render()

// Source of truth for the privacy policy is a public Gist owned by xenirio.
// The Play Store listing and siftly.me both render the same MD so the wording
// stays consistent. Override with PRIVACY_POLICY_URL to preview a different
// revision (e.g. a Gist commit URL).
const PRIVACY_POLICY_URL =
  process.env.PRIVACY_POLICY_URL ||
  'https://gist.githubusercontent.com/xenirio/0ae79679a1bc197f43d35e5bb432229f/raw/privacy_policy.md'

const policyMd = await fetchPolicyMd(PRIVACY_POLICY_URL)
const policyHtml = mdToHtml(policyMd)
const privacyHtml = renderPrivacy(policyHtml)

async function fetchPolicyMd(url) {
  let res
  try {
    res = await fetch(url, { headers: { 'user-agent': 'siftly-me-prerender' } })
  } catch (err) {
    throw new Error(`prerender: failed to fetch privacy policy from ${url}: ${err.message}`)
  }
  if (!res.ok) {
    throw new Error(`prerender: privacy policy fetch returned ${res.status} ${res.statusText} for ${url}`)
  }
  const body = await res.text()
  if (!body.trim().startsWith('#')) {
    throw new Error(`prerender: privacy policy fetched from ${url} doesn't look like markdown (no leading heading)`)
  }
  return body
}

// Minimal Markdown → HTML for the privacy policy. Supports the subset the
// upstream MD uses: # / ## / ### headings, - lists, paragraphs, **bold**,
// _italic_, `code`, [text](url). Anything else is rendered as plain text.
function mdToHtml(md) {
  const escapeHtml = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Defense-in-depth even though the Gist is trusted: only allow http(s),
  // mailto, and same-origin/relative hrefs. Anything else (javascript:, data:,
  // vbscript:) collapses to "#".
  const safeHref = (u) =>
    /^(https?:|mailto:|\/|#|\.\.?\/)/i.test(u) ? u : '#'
  const inline = (s) => escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) =>
      `<a href="${safeHref(u).replace(/"/g, '&quot;')}" rel="noopener noreferrer">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^A-Za-z0-9])_([^_\n]+)_(?![A-Za-z0-9])/g, '$1<em>$2</em>')

  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let inList = false
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false } }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h = line.match(/^(#{1,3})\s+(.+?)\s*$/)
    if (h) {
      closeList()
      const lvl = h[1].length
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`)
      continue
    }
    const li = line.match(/^[-*]\s+(.+?)\s*$/)
    if (li) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(li[1])}</li>`)
      continue
    }
    if (line.trim() === '') { closeList(); continue }
    closeList()
    const para = [line]
    while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !/^(#{1,3}\s|[-*]\s)/.test(lines[i + 1])) {
      para.push(lines[++i])
    }
    out.push(`<p>${inline(para.join(' '))}</p>`)
  }
  closeList()
  return out.join('\n')
}

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
// double-fetch a too-large file on mobile. The prefix tracks whatever asset
// Hero.jsx imports for ph-1 — currently hero-people.jpg.
const heroAvifSrcset = await avifSrcset('hero-people-')
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

// Privacy Policy page — static, no React hydration. Reuses the same fonts and
// inlined CSS from the main bundle. Skips the hero AVIF preload (no hero here)
// and removes the main.jsx script tag so the browser doesn't try to mount the
// SPA over this static page.
const privacyPreloads = [
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="${interFont}">`,
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="${serifFont}">`,
].join('\n    ')

// Strip every <script type="module"> Vite injected — the privacy page is
// static, no hydration needed. Also strip module preload <link>s pointing at
// JS chunks that go with those scripts.
let privacyDoc = template
  .replace(/<title>[^<]*<\/title>/, '<title>Privacy Policy — Siftly</title>')
  .replace(
    /\s*<link rel="stylesheet"[^>]*href="\/assets\/index-[^"]+\.css"[^>]*>/,
    ''
  )
  .replace(/\s*<script\b[^>]*type="module"[^>]*>\s*<\/script>/g, '')
  .replace(/\s*<link\b[^>]*rel="modulepreload"[^>]*>/g, '')
  .replace('</head>', `    <meta name="description" content="Siftly's privacy policy: how the Siftly Android app and siftly.me handle your data.">\n    ${privacyPreloads}\n    ${inlinedStyle}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${privacyHtml}</div>`)

await mkdir(privacyDir, { recursive: true })
await writeFile(privacyPath, privacyDoc)

await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(
  `prerender: injected ${appHtml.length} chars of HTML, ${cssText.length} chars of inline CSS, ` +
  `and 3 preloads (fonts: 2, hero AVIF: 1) into dist/index.html`
)
console.log(
  `prerender: wrote dist/privacy-policy/index.html (${privacyHtml.length} chars of HTML, no JS), ` +
  `policy from ${PRIVACY_POLICY_URL}`
)
