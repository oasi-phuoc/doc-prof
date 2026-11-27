import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const sourceHeading = /^(?:sources?|provenance|références?)(?:\s*[:—–-].*)?$/i

export function moduleIntroduction(objectifs, apercu) {
  const cutoff = apercu.findIndex((block) => block.kind === 'heading' && sourceHeading.test(block.text))
  const goals = objectifs.filter((block) => block.kind !== 'paragraph' || !/^À l['’]issue de ce module.*capable de\s*:?$/i.test(block.text))
  const overview = (cutoff < 0 ? apercu : apercu.slice(0, cutoff))
    .filter((block) => block.kind !== 'heading' || block.text !== 'Vous allez découvrir')
  if (!goals.length || !overview.length) throw new Error('Objectifs ou aperçu du module absent.')
  return { id: 'objectifs-apercu', kind: 'objectifs-apercu', blocks: [...goals, ...overview] }
}

export function insertLogistiqueFigures(blocks, figures, publicDirectory, directory) {
  const inserted = [...blocks]
  for (const { anchor, file, sha256, alt, caption } of figures) {
    const indices = inserted.flatMap((block, index) => block.kind === 'heading' && block.text === anchor ? [index] : [])
    if (indices.length !== 1 || !/^[a-z0-9-]+\.(?:svg|webp|jpe?g|png)$/.test(file) || !alt?.trim() || !caption?.trim()) {
      throw new Error('Figure sans ancrage unique, alternative ou légende : ' + file)
    }
    const path = directory + '/' + file
    const bytes = readFileSync(new URL(path, publicDirectory))
    if (createHash('sha256').update(bytes).digest('hex') !== sha256) {
      throw new Error('Empreinte différente de la figure enregistrée : ' + file)
    }
    inserted.splice(indices[0] + 1, 0, { kind: 'image', src: '/' + path, alt, caption })
  }
  return inserted
}
