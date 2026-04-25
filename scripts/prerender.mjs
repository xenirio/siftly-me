import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = resolve(root, 'dist/index.html')
const ssrEntry = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render } = await import(ssrEntry)
const appHtml = render()

const template = await readFile(indexPath, 'utf-8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
}
const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
)
await writeFile(indexPath, html)
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: injected ${appHtml.length} chars into dist/index.html`)
