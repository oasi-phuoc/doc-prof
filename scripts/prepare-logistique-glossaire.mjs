import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { load, root } = require('./gattegno-loader.cjs')
const { logistiquePublication } = load(root + '/src/logistique/approved-banks.ts')
const source = logistiquePublication('logistique-implantations-stockage-v006')
const glossaries = source.units.filter(({ kind }) => kind === 'glossaire').map(({ module, blocks, illustrations }) => ({
  module,
  entries: blocks.map((block) => {
    const match = block.kind === 'paragraph' && block.text.match(/^\{g\}(.+?)\{\/g\}\s*[—–-]\s*(.+)$/s)
    if (!match) throw new Error(`Entrée de glossaire illisible dans le module ${module}`)
    const [, term, definition] = match
    return { term, definition, figure: illustrations?.[term] }
  }),
}))
const python = fileURLToPath(new URL('./logistique-glossary-art.py', import.meta.url))
const render = spawnSync('python3', [python], { cwd: root, input: JSON.stringify(glossaries), stdio: ['pipe', 'inherit', 'inherit'] })
if (render.error || render.status !== 0) throw render.error ?? new Error('La préparation des illustrations a échoué.')
