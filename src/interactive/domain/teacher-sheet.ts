import { roundsFor, questionsForRound } from './plan'
import { PALETTE, SHAPES, SHAPE_PATHS, inkForColor, type ShapeId } from './palette'
import { planIdentity } from './persistence'
import type { Game } from './types'

export type TeacherRow = {
  number: number
  questionId: string
  prompt: string
  answer: string
  explanation: string
  notes: string
  card?: { letter: string; color: string; colorName: string; shape: ShapeId; shapeLabel: string }
  image?: string
}
export const teacherSheetSignature = (game: Game, colors: string[], shapes: ShapeId[]) => JSON.stringify({ game, colors, shapes })
export function teacherSheetRows(game: Game, colors: string[], shapes: ShapeId[]): TeacherRow[] {
  if (colors.length !== 6 || colors.some((color) => !/^#[0-9a-f]{6}$/i.test(color)) || shapes.length !== 6 || shapes.some((shape) => !SHAPES.some((entry) => entry.id === shape))) throw new Error('La palette de la classe est invalide.')
  const rows: TeacherRow[] = []
  for (let roundIndex = 0; roundIndex < roundsFor(game).length; roundIndex++) {
    const questions = questionsForRound(game, roundIndex)
    questions.forEach((question, index) => {
      const key = game.corrections[question.id]
      const correctIndex = question.choices.findIndex((choice) => choice.id === key?.choiceId)
      const correct = question.choices[correctIndex]
      if (question.mode === 'choice' && !correct) throw new Error('Le corrigé de cette question doit être vérifié avant de créer la feuille.')
      const slot = (questions.length === 2 ? index * 3 : 0) + correctIndex
      const shape = shapes[slot]
      const text = [...question.prompt]
      rows.push({
        number: rows.length + 1,
        questionId: question.id,
        prompt: text.length > 80 ? `${text.slice(0, 79).join('')}…` : question.prompt,
        answer: correct ? correct.text || 'Réponse en image' : key?.text || 'Évaluation par l’enseignant, sans modèle fourni.',
        explanation: correct && key?.text !== correct.text ? key?.text ?? '' : '',
        notes: question.oralSituation ? [question.oralSituation,...question.hints??[]].join('\n') : question.hints?.join(' · ') ?? '',
        card: correct && shape ? { letter: PALETTE[slot]!.letter, color: colors[slot]!, colorName: PALETTE.find((entry) => entry.color.toLowerCase() === colors[slot]!.toLowerCase())?.name ?? 'Teinte personnalisée', shape, shapeLabel: SHAPES.find((entry) => entry.id === shape)!.label } : undefined,
        image: correct?.image,
      })
    })
  }
  return rows
}
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
function shapeSvg(shape: ShapeId): string {
  const body = shape === 'circle' ? '<circle cx="12" cy="12" r="10"/>'
    : shape === 'square' ? '<rect x="3" y="3" width="18" height="18" rx="1"/>'
    : shape === 'oval' ? '<ellipse cx="12" cy="12" rx="7" ry="11"/>'
    : `<path d="${SHAPE_PATHS[shape]}"/>`
  return `<svg aria-label="${escape(SHAPES.find((entry) => entry.id === shape)!.label)}" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${body}</svg>`

}
export function teacherSheetHtml(title: string, planId: string, rows: TeacherRow[], images: ReadonlyMap<string, string> = new Map()): string {
  if (rows.some((row) => row.card && (!/^#[0-9a-f]{6}$/i.test(row.card.color) || !/^[A-F]$/.test(row.card.letter) || !SHAPES.some((entry) => entry.id === row.card!.shape)))) throw new Error('Les repères de la feuille sont invalides.')
  const missing = rows.filter((row) => row.image && !images.has(row.image)).length
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><title>Feuille enseignant — ${escape(title)}</title><style>
@page{size:A4 portrait;margin:14mm 12mm 22mm}*{box-sizing:border-box}body{font:12px/1.45 system-ui,sans-serif;color:#182238;margin:24px}h1{font-size:20px}header{border:3px solid #182238;padding:12px;margin-bottom:18px}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #a5aabc;padding:8px;vertical-align:top;overflow-wrap:anywhere}th{text-align:left;background:#f2f1fa}thead{display:table-header-group}tr{break-inside:avoid}.number{width:8%}.prompt{width:28%}.answer{width:40%}.notes{width:24%}.card{display:flex;align-items:center;gap:8px;border:1px solid #182238;border-radius:6px;padding:5px;margin-bottom:6px;color:#000}.card b{font-size:18px}.card small{font-size:10px}img{display:block;max-width:100%;max-height:36mm;object-fit:contain;margin:8px 0}p{margin:5px 0;white-space:pre-line}.empty-note{min-height:32px}.footer{margin-top:18px;font:9px/1.4 monospace;overflow-wrap:anywhere}.notice{border-left:4px solid #182238;padding:8px}.instructions{margin:12px 0}@media print{body{margin:0}.instructions{display:none}.footer{position:fixed;bottom:-16mm;left:0;right:0;font-size:8px}header{break-after:avoid}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><header><b>ENSEIGNANT — NE PAS PROJETER</b><h1>${escape(title)}</h1><p>${rows.length} question(s) · même ordre et mêmes cartes que le plan préparé.</p></header><p class="instructions">Enregistrez ce document. Pour imprimer : menu du navigateur → Imprimer, format A4. Une nouvelle sélection ou une nouvelle palette nécessite une nouvelle feuille.</p>${missing ? `<p class="notice">${missing} illustration(s) non incorporée(s). Utilisez la lettre, la forme et le repère de couleur indiqués pour retrouver la réponse sur la fiche.</p>` : ''}<table data-plan-id="${escape(planId)}"><thead><tr><th class="number">N°</th><th class="prompt">Question</th><th class="answer">Corrigé / modèle</th><th class="notes">Notes enseignant</th></tr></thead><tbody>${rows.map((row) => `<tr data-question-id="${escape(row.questionId)}"><td>${row.number}</td><td>${escape(row.prompt)}</td><td>${row.card ? `<div class="card" style="background:${row.card.color};color:${inkForColor(row.card.color)}"><b>${row.card.letter}</b>${shapeSvg(row.card.shape)}<small>${escape(row.card.colorName)} · ${escape(row.card.shapeLabel)} · ${row.card.color}</small></div>` : ''}${row.image && images.has(row.image) && /^data:image\/(?:png|jpeg|webp|gif|avif|svg\+xml);base64,/i.test(images.get(row.image)!) ? `<img src="${escape(images.get(row.image)!)}" alt="${row.card ? `Réponse, carte ${row.card.letter}` : 'Réponse'}">` : ''}<p>${escape(row.answer)}</p>${row.explanation ? `<p>${escape(row.explanation)}</p>` : ''}</td><td><p>${escape(row.notes)}</p><div class="empty-note"></div></td></tr>`).join('')}</tbody></table><footer class="footer">ENSEIGNANT — NE PAS PROJETER · Plan : ${escape(planId)}</footer></body></html>`
}
export async function teacherSheetData(game: Game, colors: string[], shapes: ShapeId[]) {
  return { rows: teacherSheetRows(game, colors, shapes), planId: await planIdentity(game), signature: teacherSheetSignature(game, colors, shapes) }
}
