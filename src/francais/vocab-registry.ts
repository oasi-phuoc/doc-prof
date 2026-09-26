/** Registre des banques Voc par thème (sous-groupes). */
import type { VocabWordEntry } from './vocab-learn'
import { FR_ACHATS_BANK } from './vocab-banks/fr-achats'
import { FR_COMMERCES_BANK } from './vocab-banks/fr-commerces'
import { FR_DESCRIPTION_BANK } from './vocab-banks/fr-description'
import { FR_ECOLE_BANK } from './vocab-banks/fr-ecole'
import { FR_FAMILLE_BANK } from './vocab-banks/fr-famille'
import { FR_PRESENTER_BANK } from './vocab-banks/fr-presenter'
import { FR_LOGEMENT_BANK } from './vocab-banks/fr-logement'
import { FR_LOISIRS_BANK } from './vocab-banks/fr-loisirs'
import { FR_NOURRITURE_BANK } from './vocab-banks/fr-nourriture'
import { FR_SANTE_BANK } from './vocab-banks/fr-sante'
import { FR_TEMPS_BANK } from './vocab-banks/fr-temps'
import { FR_TRANSPORTS_BANK } from './vocab-banks/fr-transports'
import { FR_VILLE_BANK } from './vocab-banks/fr-ville'
import { FR_VOYAGE_BANK } from './vocab-banks/fr-voyage'

export type VocabSubgroup = { id: string; label: string; words: VocabWordEntry[] }
export type VocabTopicMeta = {
  id: string
  label: string
  grammar: string
  vocab: string
  subgroups: VocabSubgroup[]
}

export const VOCAB_TOPIC_BANKS: VocabTopicMeta[] = [
  {
    id: "fr-achats",
    label: "Achats",
    grammar: "place de l’adjectif et quantité",
    vocab: "vêtements, accessoires et prix",
    subgroups: FR_ACHATS_BANK,
  },
  {
    id: "fr-commerces",
    label: "Commerces",
    grammar: "articles partitifs et politesse",
    vocab: "restaurant et boulangerie",
    subgroups: FR_COMMERCES_BANK,
  },
  {
    id: "fr-description",
    label: "Description",
    grammar: "accord des adjectifs de description",
    vocab: "description physique et morale",
    subgroups: FR_DESCRIPTION_BANK,
  },
  {
    id: "fr-ecole",
    label: "École",
    grammar: "articles et prépositions de lieu",
    vocab: "matières, matériel et structure",
    subgroups: FR_ECOLE_BANK,
  },
  {
    id: "fr-famille",
    label: "Famille",
    grammar: "adjectifs possessifs",
    vocab: "liens de parenté et état civil",
    subgroups: FR_FAMILLE_BANK,
  },
  {
    id: "fr-presenter",
    label: "Identité",
    grammar: "être, avoir et s’appeler",
    vocab: "nationalités et professions",
    subgroups: FR_PRESENTER_BANK,
  },
  {
    id: "fr-logement",
    label: "Logement",
    grammar: "articles définis et indéfinis",
    vocab: "logement, pièces et équipements",
    subgroups: FR_LOGEMENT_BANK,
  },
  {
    id: "fr-loisirs",
    label: "Loisirs",
    grammar: "pronoms COD",
    vocab: "sport et activités",
    subgroups: FR_LOISIRS_BANK,
  },
  {
    id: "fr-nourriture",
    label: "Nourriture",
    grammar: "articles partitifs",
    vocab: "fruits, légumes, cuisine et quantités",
    subgroups: FR_NOURRITURE_BANK,
  },
  {
    id: "fr-sante",
    label: "Santé",
    grammar: "il faut et devoir",
    vocab: "corps, maladies et pharmacie",
    subgroups: FR_SANTE_BANK,
  },
  {
    id: "fr-temps",
    label: "Temps",
    grammar: "prépositions de temps",
    vocab: "jours, heure, saisons et météo",
    subgroups: FR_TEMPS_BANK,
  },
  {
    id: "fr-transports",
    label: "Transports",
    grammar: "aller au présent",
    vocab: "transports, gare et aéroport",
    subgroups: FR_TRANSPORTS_BANK,
  },
  {
    id: "fr-ville",
    label: "Ville",
    grammar: "il y a et prépositions de lieu",
    vocab: "ville, directions et culture",
    subgroups: FR_VILLE_BANK,
  },
  {
    id: "fr-voyage",
    label: "Voyage",
    grammar: "futur proche et expressions de voyage",
    vocab: "paysage, hôtel et animaux",
    subgroups: FR_VOYAGE_BANK,
  },
]

export const VOCAB_TOPIC_META: VocabTopicMeta[] = [
  ...VOCAB_TOPIC_BANKS,
  { id: "fr-inviter", label: "Invitation", grammar: "questions formelles et informelles", vocab: "invitations et sorties", subgroups: [] },
  { id: "fr-journee", label: "Quotidien", grammar: "verbes pronominaux", vocab: "routine quotidienne", subgroups: [] },
  { id: "fr-travail", label: "Travail", grammar: "accord des adjectifs", vocab: "métiers et bureau", subgroups: [] },
].sort((a, b) => a.label.localeCompare(b.label, 'fr'))

export function vocabBankForTopic(topic: string): VocabTopicMeta | undefined {
  return VOCAB_TOPIC_META.find((t) => t.id === topic)
}
