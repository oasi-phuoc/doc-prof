import type { PhraseThemeId } from './phrase-themes'

const SCENARIOS = [
  'les courses au marché', 'la préparation d’un repas', 'l’entretien du logement',
  'le choix des vêtements', 'l’apprentissage d’une langue', 'les démarches à la mairie',
  'une journée de travail', 'les déplacements en train', 'les soins du quotidien',
  'les relations de voisinage', 'une sortie culturelle', 'la protection de la nature',
  'l’utilisation d’Internet', 'un entraînement sportif', 'les préparatifs d’un voyage',
] as const

export function extraProductionPrompts(theme: PhraseThemeId): string[] {
  const negative = theme.startsWith('phrase-negation')
  const structure = theme.includes('pronominaux') ? 'avec un verbe pronominal'
    : theme.includes('determinants') ? 'en variant les déterminants devant les noms'
    : theme.includes('adjectif') ? 'avec un adjectif accordé au nom'
    : theme.includes('preposition') ? 'avec un complément introduit par une préposition'
    : theme.includes('adverbe') ? 'avec un adverbe qui précise l’action'
    : theme.includes('conjonctions') ? 'en reliant deux actions par « et »'
    : 'avec un sujet, un verbe et un complément'
  return SCENARIOS.map(scenario => `Sur le thème « ${scenario} », écrivez des phrases${negative ? ' négatives avec ne… pas' : ''} ${structure}.`)
}
