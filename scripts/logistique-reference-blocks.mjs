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
    const start = indices[0] + 1
    let block
    if (figure.cells) {
      const { cells, label, tableCaption } = figure
      if (!label?.trim() || cells.length < 2 || cells.length > 3 || new Set(cells.map(({ caption }) => caption)).size !== cells.length) {
        throw new Error('Tableau d’images invalide : ' + figure.anchor)
      }
      block = {
        kind: 'image-row', label, ...(tableCaption?.trim() ? { caption: tableCaption.trim() } : {}),
        cells: cells.map((cell) => figureImage(cell, publicDirectory, directory)),
      }
    } else {
      block = { kind: 'image', ...figureImage(figure, publicDirectory, directory) }
    }
    const additions = [block]
    if (figure.prose?.trim()) additions.push({ kind: 'paragraph', text: figure.prose.trim() })
    if (figure.replaces || figure.endOfSection) {
      const nextHeading = inserted.findIndex((entry, index) => index >= start && entry.kind === 'heading')
      const end = nextHeading < 0 ? inserted.length : nextHeading
      if (figure.replaces) {
        const matches = inserted.slice(start, end).flatMap((entry, index) =>
          entry.kind === 'image' && entry.src.endsWith('/' + figure.replaces) ? [start + index] : [])
        if (matches.length !== 1) throw new Error('Figure à remplacer introuvable ou ambiguë : ' + figure.replaces)
        inserted.splice(matches[0], 1, ...additions)
      } else inserted.splice(end, 0, ...additions)
    } else inserted.splice(start, 0, ...additions)
  }
  return inserted
}
