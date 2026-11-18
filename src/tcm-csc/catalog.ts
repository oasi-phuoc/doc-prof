import type { ExerciseType, Topic } from '@/math/types'

export const TCM_CSC_DOMAIN = 'tcm-csc' as const

export const TCM_CSC_TOPICS: Topic[] = [
  { id: 'tcm-csc-info', label: 'Informations', domain: 'tcm-csc' },
  { id: 'tcm-csc-test', label: 'Test CSC', domain: 'tcm-csc' },
]

const SHEET_NUMBER: Record<number, number> = {
  25: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18, 18: 19, 19: 20, 20: 21,
}
/** Numéro affiché sur la fiche. L’exercice 25 est le second rangement, inséré en 7. */
export function cscSheetNumber(typeNumber: number): number {
  return SHEET_NUMBER[typeNumber] ?? typeNumber
}
const b = (verb: string) => `[[b]]${verb}[[/b]]`
const exercise = (number: number, label: string, instruction: string, columns = 1): ExerciseType => ({
  id: `tcm-csc-ex${String(number).padStart(2, '0')}`, topic: 'tcm-csc-test', label: `${cscSheetNumber(number)} — ${label}`,
  description: instruction.replace(/\[\[\/?[bc]\]\]/g, ''), instruction, visual: 'texte', preferredColumns: columns,
})
export const TCM_CSC_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'tcm-csc-consignes',
    topic: 'tcm-csc-info',
    label: 'Consignes du test',
    description: 'Page d’informations et consignes du test TCM CSC.',
    instruction: 'Lisez les consignes avant de commencer le test.',
    visual: 'texte',
    preferredColumns: 1,
  },
  exercise(1, 'Nombres entendus', `${b('Écrivez')} le nombre que vous entendez.`),
  exercise(2, 'Calculs entendus', `${b('Écrivez')} le calcul et son résultat.`),
  exercise(3, 'Entourer les nombres', `${b('Entourez')} les cinq nombres entendus.`),
  exercise(4, 'Suites avec indication', `${b('Complétez')} les suites de nombres.`),
  exercise(5, 'Suites sans aide', `${b('Complétez')} les suites de nombres.`),
  exercise(6, 'Ranger du plus petit au plus grand', `${b('Rangez')} les nombres du plus petit au plus grand.`),
  exercise(25, 'Ranger du plus grand au plus petit', `${b('Rangez')} les nombres du plus grand au plus petit.`),
  exercise(7, 'Comparer de 0 à 100', `${b('Comparez')} les nombres et écrivez [[c]]<[[/c]], [[c]]>[[/c]] ou [[c]]=[[/c]].`, 2),
  exercise(8, 'Décomposer les nombres', `${b('Décomposez')} les nombres en [[b]]centaines[[/b]], [[b]]dizaines[[/b]] et [[b]]unités[[/b]].\nExemple : 243 = 200 + 40 + 3`),
  exercise(9, 'Nommer les signes', `${b('Écrivez')} le nom de chaque signe.`),
  exercise(10, 'Additions et soustractions posées', `${b('Calculez')} les additions et les soustractions.`, 2),
  exercise(11, 'Poser les opérations', `${b('Posez')} les nombres dans les grilles, puis calculez.`, 2),
  exercise(12, 'Reproduire une figure', `${b('Reproduisez')} la même figure sur le quadrillage de droite.`),
  exercise(13, 'Agrandir une figure', `${b('Reproduisez')} la même figure sur le quadrillage de droite.\n1 carré à gauche = 2 carrés à droite.`),
  exercise(14, 'Comparer des longueurs', ''),
  exercise(15, 'Relier des points', `Avec la règle, ${b('reliez')} A à B en rouge, puis C à D en bleu.`),
  exercise(16, 'Suites graphiques', `${b('Cochez')} la forme qui continue la suite.`),
  exercise(17, 'Nommer quatre formes', `${b('Écrivez')} le nom de chaque forme géométrique.`),
  exercise(18, 'Compter les formes', ''),
  exercise(19, 'Lire les coordonnées', `${b('Écrivez')} les coordonnées de chaque forme.`),
  exercise(20, 'Placer les formes', `${b('Dessinez')} chaque forme à l’emplacement indiqué.`),
  // Exercice 21 réservé par le propriétaire ; il n’apparaît pas dans le test.
  exercise(22, 'Problème — crayons', `${b('Résolvez')} le problème.`),
  exercise(23, 'Problème — bus', `${b('Résolvez')} le problème.`),
  exercise(24, 'Problème — perles', `${b('Résolvez')} le problème.`),
]
