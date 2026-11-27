import { validLogistiqueGaps } from '@/logistique/gaps'
import { validLogistiqueExerciseTable } from '@/logistique/tables'
import type { MathItem } from '@/math/types'

type GuidedLogistics = { context?: string; model: string } | { reason: string }

/** Retain the public worksheet data and keep model answers on the correction side. */
export function adaptLogistics(item: MathItem): GuidedLogistics | undefined {
  if (!item.logistiqueSource || item.layout !== 'text') return undefined
  const answer = item.responseAnswer?.trim() || item.answer?.trim()
  if (!answer) return { reason: 'Le corrigé de cette activité de logistique est absent.' }
  const model = [...new Set([item.calcAnswer?.trim(), answer].filter(Boolean))]
  const table = item.logistiqueTable
  const gaps = item.logistiqueGaps
  let context: string | undefined

  if (table) {
    if (gaps || !validLogistiqueExerciseTable(table)) return { reason: 'Vérifiez les colonnes et les cases à compléter dans le tableau.' }
    context = table.rows.map((row, index) => {
      const cells = row.map((cell, column) => {
        const heading = table.headers[column]!
        if (typeof cell !== 'string') model.push(`Ligne ${index + 1}, ${heading} : ${cell.answer}`)
        return `${heading} : ${typeof cell === 'string' ? cell : 'à compléter'}`
      })
      return `Ligne ${index + 1}\n${cells.join('\n')}`
    }).join('\n\n')
  }
  if (gaps) {
    if (!validLogistiqueGaps(item.prompt, gaps)) return { reason: 'Vérifiez les blancs et les réponses du texte à compléter.' }
    if (gaps.words?.length) context = `Mots proposés\n${gaps.words.join(' · ')}\nUtilisez chaque proposition au plus une fois.`
    model.push(gaps.answers.map((word, index) => `Blanc ${index + 1} : ${word}`).join('\n'))
  }
  return { context, model: model.join('\n\n') }
}
