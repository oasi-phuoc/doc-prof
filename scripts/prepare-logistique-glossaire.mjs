import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { load, root } = require('./gattegno-loader.cjs')
const { logistiquePublication } = load(root + '/src/logistique/approved-banks.ts')
const source = logistiquePublication('logistique-implantations-stockage-v006')
const glossaries = source.units.filter(({ kind }) => kind === 'glossaire').map(({ module, blocks, illustrations, approvedFor }) => ({
  module, approvedFor,
  entries: blocks.map((block) => {
    const match = block.kind === 'paragraph' && block.text.match(/^\{g\}(.+?)\{\/g\}\s*[—–-]\s*(.+)$/s)
    if (!match) throw new Error(`Entrée de glossaire illisible dans le module ${module}`)
    const [, term, definition] = match
    return { term, definition, figure: illustrations?.[term] }
  }),
}))

if (process.argv.includes('--audit')) {
  const registry = JSON.parse(readFileSync(root + '/src/logistique/banks/glossaires-visuels-v006.json', 'utf8'))
  let total = 0
  let photographs = 0
  for (const { module, entries, approvedFor } of glossaries) {
    const rows = registry[module]
    if (Object.keys(rows ?? {}).length !== entries.length) throw new Error(`Taille du glossaire différente : ${module}`)
    const used = new Set()
    let complete = 0
    for (const { term } of entries) {
      const figure = rows[term]
      if (!figure?.alt?.trim() || !figure.src.endsWith('.webp') || used.has(figure.src) || !existsSync(root + '/public' + figure.src)) {
        throw new Error(`Image manquante, dupliquée ou invalide : ${module} / ${term}`)
      }
      if (!/\/(?:commun|glossaire)\//.test(figure.src) && !approvedFor.every((diploma) => figure.src.includes(`/${diploma.toLowerCase()}/`))) {
        throw new Error(`Image hors du domaine autorisé : ${module} / ${term}`)
      }
      used.add(figure.src)
      if (/-photo-v\d+\.webp$/.test(figure.src)) complete += 1
    }
    photographs += complete
    total += entries.length
    console.log(`${module} · ${complete}/${entries.length} photos`)
  }
  console.log(`${photographs}/${total} notions en photo · ${total - photographs} à illustrer`)
  process.exit(0)
}

const python = fileURLToPath(new URL('./logistique-glossary-art.py', import.meta.url))
const render = spawnSync('python3', [python], { cwd: root, input: JSON.stringify(glossaries), stdio: ['pipe', 'inherit', 'inherit'] })
if (render.error || render.status !== 0) throw render.error ?? new Error('La préparation des illustrations a échoué.')
