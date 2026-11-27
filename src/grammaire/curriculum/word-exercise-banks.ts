import raw from './data/word-exercises.json'
import type { GrammarBank, GrammarLevel, GrammarUnit } from './types'

const supplements = raw as Array<{ activityId: string; level: GrammarLevel; units: GrammarUnit[] }>

export function banksWithWordExercises(banks: GrammarBank[]): GrammarBank[] {
  for (const supplement of supplements) {
    if (!banks.some((bank) => bank.activityId === supplement.activityId && bank.level === supplement.level)) {
      throw new Error(`Banque introuvable pour les exercices Word : ${supplement.activityId} (${supplement.level}).`)
    }
  }
  return banks.map((bank) => {
    const supplement = supplements.find(({ activityId, level }) => activityId === bank.activityId && level === bank.level)
    if (!supplement) return bank
    return {
      ...bank,
      revision: `${bank.revision}-word-1`,
      units: [...bank.units, ...supplement.units],
      editorialStatus: 'reviewed',
      review: {
        reviewer: 'Codex',
        date: '2026-11-27',
        humanReview: 'pending',
        note: 'Ajout de phrases et de textes adaptés des fiches Word. Relecture pédagogique à consigner.',
      },
    }
  })
}
