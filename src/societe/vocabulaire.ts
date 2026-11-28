import { grammarWordCards } from '@/grammaire/exercises/word-vocab'
import type { SocieteUnite } from './types'

const illustrations: Readonly<Record<string, string>> = {
  'la carte': 'voyage/carte',
  'le paysage': 'nature/paysage',
  'le lac': 'nature/lac',
  'le cours d’eau': 'nature/rivière',
  'la pièce d’identité': 'voyage/passeport',
  'le quai': 'voyage/quai',
}

const documents: Readonly<Record<string, string>> = {
  'la frontière': 'franchir-frontiere',
  'le sigle': 'lire-sigle-vd',
  'le col': 'relief-vallee-col',
  'le code postal': 'lire-adresse',
  'la frise': 'frise-histoire',
  'le rendez-vous': 'rendez-vous-commune',
  'la correspondance': 'bus-suivant',
  'la fuite': 'signaler-fuite',
  'la séance d’information': 'lire-invitation-cours',
  'la prime': 'deux-documents-caisse',
  'la prévoyance': 'schema-trois-piliers',
  'la Confédération': 'trois-niveaux-suisse',
  'la votation': 'election-ou-votation',
  'le net': 'du-brut-au-net',
}

export function societeVocabItems(unit: SocieteUnite, recall: boolean) {
  const entries = unit.lexique.map(([label, clue], index) => {
    const illustration = illustrations[label]
    const document = !recall ? documents[label] : undefined
    return {
      id: `societe-${unit.id}-mot-${index + 1}`,
      label,
      clue,
      image: illustration ? `/lib/images/vocabulaire/${illustration}.webp`
        : document ? `/lib/images/societe/theorie/${document}.webp` : undefined,
    }
  })
  return grammarWordCards(entries, recall).map((item) => ({ ...item, noPoints: !recall }))
}
