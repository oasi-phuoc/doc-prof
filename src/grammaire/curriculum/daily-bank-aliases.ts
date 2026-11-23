import type { GrammarBank } from './types'

/** One reviewed corpus, exposed in two pedagogical themes without a second source bank.
 * Units are cloned so editing a generated worksheet cannot mutate the shared corpus. */
export function activityDailyBanks(canonical: GrammarBank[]): GrammarBank[] {
  const links = [
    ['gram-ex-pronominaux-qcm-conj', 'gram-ex-d2-qcm-conj', 'Les gestes du quotidien'],
    ['gram-ex-pronominaux-ordre', 'gram-ex-d2-curriculum-o', 'Mots dans l’ordre'],
    ['gram-ex-pronominaux-curriculum-p', 'gram-ex-d2-curriculum-p', 'S’exprimer à l’oral'],
  ] as const
  return links.map(([origin, activityId, label]) => {
    const source = canonical.find(b => b.activityId === origin && b.level === 'A1')
    if (!source) throw new Error(`Missing reviewed daily-action bank: ${origin}`)
    const bank = structuredClone(source)
    return {...bank, activityId, label, subthemeId:'d2', topic:'gram-activite',
      revision:`d2-shared-2026-11-23-v1:${source.revision}`,
      review:{...bank.review, date:'2026-11-23',note:`Réemploi de ${origin} A1 : corpus gradué partagé, sans copie éditoriale. Validation enseignante en attente.`},
      units:bank.units.map((u,index) => ({...u,id:`${activityId}-a1-${String(index+1).padStart(3,'0')}`,
        source:{path:'src/grammaire/curriculum/data/pronominaux.json',typeId:activityId,position:index,partition:`shared:${origin}:A1`}})),
    } satisfies GrammarBank
  })
}
