#!/usr/bin/env node
/** Génère les affiches CE CSC en conservant le texte intégral, sans OCR ni résumé. */
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { chromium } = await import(process.argv[2] || 'playwright')
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' })
const temp = mkdtempSync(resolve(tmpdir(), 'ce-posters-'))
const output = resolve(root, 'public/lib/images/tcf/ce-affiches')
mkdirSync(output, { recursive: true })
let browser
try {
  const { CePoster } = await vite.ssrLoadModule('/src/components/tcf/CePoster.tsx')
  const exercises = JSON.parse(readFileSync(resolve(root, 'src/tcf/content/a0-a1/ce.json'), 'utf8'))
  const css = readFileSync(resolve(root, 'src/App.css'), 'utf8')
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1100, height: 1600 }, deviceScaleFactor: 1 })
  await page.route('**/*', (route) => {
    const path = resolve(root, `public${decodeURIComponent(new URL(route.request().url()).pathname)}`)
    return path.startsWith(resolve(root, 'public') + '/') && existsSync(path) ? route.fulfill({ path }) : route.abort()
  })
  const entries = []
  // Les listes HTML séparent visuellement le numéro et le texte sans espace DOM.
  const normalized = (text) => text.replace(/\s+/g, '')
  for (const [i, ex] of exercises.entries()) {
    const title = ex.type_exercice === 'annonce' ? ex.support.titre : ex.type_exercice === 'email' ? ex.support.objet : ex.scene || ex.theme || 'Message'
    const metadata = ex.type_exercice === 'sms' ? `De : ${ex.support.expediteur}` : ex.type_exercice === 'email' ? `De : ${ex.support.de} — À : ${ex.support.a}` : undefined
    const image = ex.type_exercice === 'annonce' && ex.support.image && existsSync(resolve(root, 'public' + ex.support.image)) ? ex.support.image : undefined
    const html = renderToStaticMarkup(createElement(CePoster, { title, text: ex.support.texte, metadata, image,
      label: ex.type_exercice === 'sms' ? 'Message' : ex.type_exercice === 'email' ? 'Courriel' : 'Annonce',
    })).replace('class="tcf-ce-poster"', 'class="tcf-ce-poster ce-poster-export"')
    await page.setContent(`<base href="http://127.0.0.1:5999/"><style>${css}body{background:#fff;margin:0}</style>${html}`)
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode())))
    const contents = await page.locator('.tcf-ce-poster-text').allTextContents()
    assert.equal(normalized(contents.join(' ')), normalized(ex.support.texte), `Texte incomplet : ${ex.id}`)
    const file = ex.id.replace(/[^a-zA-Z0-9_-]/g, '-') + '.webp'
    const png = resolve(temp, 'poster.png')
    const poster = page.locator('.tcf-ce-poster')
    const size = await poster.boundingBox()
    await poster.screenshot({ path: png })
    execFileSync('convert', [png, '-quality', '88', resolve(output, file)])
    entries.push({ id: ex.id, label: title || ex.scene || ex.theme || 'Document CE', src: `/lib/images/tcf/ce-affiches/${file}`,
      sourceHash: createHash('sha256').update(JSON.stringify(ex.support)).digest('hex'), width: Math.round(size.width), height: Math.round(size.height) })
    if ((i + 1) % 20 === 0 || i + 1 === exercises.length) console.log(`${i + 1}/${exercises.length} affiches générées et texte vérifié.`)
  }
  assert.equal(new Set(entries.map((entry) => entry.src)).size, entries.length)
  writeFileSync(resolve(root, 'src/tcf/content/ce-posters.json'), JSON.stringify(entries, null, 2) + '\n')
} finally {
  if (browser) await browser.close()
  await vite.close()
  rmSync(temp, { recursive: true, force: true })
}
