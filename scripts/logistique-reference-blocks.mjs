import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const sourceHeading = /^(?:sources?|provenance|références?)(?:\s*[:—–-].*)?$/i

export function readLogistiqueGeneratedBank(url) {
  const raw = readFileSync(url, 'utf8')
  const start = raw.indexOf(' = [')
  const stop = raw.lastIndexOf('] satisfies readonly LogistiqueUnit[]')
  if (start < 0 || stop < 0) throw new Error('Banque de départ illisible : ' + url)
  return JSON.parse(raw.slice(start + 3, stop + 1))
}

export function moduleIntroduction(objectifs, apercu) {
  const cutoff = apercu.findIndex((block) => block.kind === 'heading' && sourceHeading.test(block.text))
  const goals = objectifs.filter((block) => block.kind !== 'paragraph' || !/^À l['’]issue de ce module.*capable de\s*:?$/i.test(block.text))
  const overview = (cutoff < 0 ? apercu : apercu.slice(0, cutoff))
    .filter((block) => block.kind !== 'heading' || block.text !== 'Vous allez découvrir')
  if (!goals.length || !overview.length) throw new Error('Objectifs ou aperçu du module absent.')
  return { id: 'objectifs-apercu', kind: 'objectifs-apercu', blocks: [...goals, ...overview] }
}

function figureImage({ file, sha256, alt, caption, description, path }, publicDirectory, directory) {
  const asset = path ?? directory + '/' + file
  const validPath = /^assets\/logistique\/\d{3}\/\d{3}\/(?:commun|afp|cfc)\/[a-z0-9-]+\.(?:svg|webp|jpe?g|png)$/.test(asset)
  if (!validPath || !asset.endsWith('/' + file) || !alt?.trim() || !caption?.trim()) {
    throw new Error('Figure sans fichier valide, texte alternatif ou légende : ' + file)
  }
  const bytes = readFileSync(new URL(asset, publicDirectory))
  if (createHash('sha256').update(bytes).digest('hex') !== sha256) {
    throw new Error('Empreinte différente de la figure enregistrée : ' + file)
  }
  return { src: '/' + asset, alt, caption, ...(description?.trim() ? { description } : {}) }
}

export function insertLogistiqueFigures(blocks, figures, publicDirectory, directory) {
  const inserted = [...blocks]
  for (const figure of figures) {
    const indices = inserted.flatMap((block, index) => block.kind === 'heading' && block.text === figure.anchor ? [index] : [])
    if (indices.length !== 1) throw new Error('Ancrage de figure introuvable ou ambigu : ' + figure.anchor)
    let block
    if (figure.cells) {
      const { cells, label } = figure
      if (!label?.trim() || cells.length < 2 || cells.length > 3 || new Set(cells.map(({ caption }) => caption)).size !== cells.length) {
        throw new Error('Tableau d’images invalide : ' + figure.anchor)
      }
      block = { kind: 'image-row', label, cells: cells.map((cell) => figureImage(cell, publicDirectory, directory)) }
    } else {
      block = { kind: 'image', ...figureImage(figure, publicDirectory, directory) }
    }
    inserted.splice(indices[0] + 1, 0, block)
  }
  return inserted
}
