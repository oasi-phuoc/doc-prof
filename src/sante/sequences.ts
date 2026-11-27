import { p, sheet, table } from '@/grammaire/theory/falc-sheet'
import type {
  TcfCeAnnonce,
  TcfCoComplet,
  TcfNiveau,
  TcfPeFormulaire,
  TcfPeQuestionTexte,
  TcfPoDialogue,
  TcfQuestion,
} from '@/tcf/types'
import rawSequences from './sequences.json'
import type { SanteActivity, SanteLevel } from './types'

type Comprehension = { title: string; text: string; questions: string[][] }

type Sequence = {
  topic: string
  level: SanteLevel
  theory?: { title: string; intro: string; examples: string[]; words: string[][]; recap: string[] }
  ce?: Comprehension
  co?: Comprehension & { slug: string }
  pe?: { title: string; prompt: string; words: number[]; model: string }
  po?: { title: string; prompt: string; dialogue: string[][] }
}

const niveaux: Record<SanteLevel, TcfNiveau> = { A1: 'A0-A1', A2: 'A1-A2', B1: 'A2-B1' }

const bodyImages: Record<string, string> = {
  'Le menton': 'menton',
  'Le front': 'front',
  'L’oreille': 'oreille',
  'Le nez': 'nez',
  'Les poumons': 'poumon',
  'Le cœur': 'coeur',
  'L’estomac': 'estomac',
  'Le cerveau': 'cerveau',
}

function comprehensionQuestions(resource: Comprehension, topic: string): TcfQuestion[] {
  return resource.questions.map(([enonce, correct, ...distractors]) => {
    const choices = [correct!, ...distractors].map((texte, index) => ({
      id: String(index + 1),
      texte,
      correct: index === 0,
    }))
    const canUseImages = topic === 'corps' && choices.every(({ texte }) => bodyImages[texte])
    return {
      enonce: enonce!,
      type_reponse: 'qcm_texte',
      points: 1,
      melanger: true,
      choix: choices,
      formes: {
        lignes: { nb_lignes: 1, reponse_modele: correct! },
        ...(canUseImages ? {
          qcm_image: {
            melanger: true,
            choix: choices.map(({ id, texte, correct }) => ({
              id,
              image: `/lib/images/vocabulaire/corps/${bodyImages[texte]}.webp`,
              correct,
            })),
          },
        } : {}),
      },
    }
  })
}

function sequenceActivities(sequence: Sequence): SanteActivity[] {
  const { topic, level, theory, ce, co, pe, po } = sequence
  const niveau = niveaux[level]
  const activities: SanteActivity[] = []
  const idFor = (skill: string) => `${topic}-${skill}-${level.toLowerCase()}`

  if (theory) {
    activities.push({
      id: idFor('theorie'), topic, level, label: `Théorie — ${theory.title}`,
      theory: sheet({
        title: theory.title,
        intro: theory.intro,
        regarder: theory.examples,
        expliquer: [table(['Mot', 'Exemple ou explication'], theory.words)],
        retenir: theory.recap.map(p),
      }),
    })
  }

  if (ce) {
    const id = idFor('ce')
    const instruction = 'Lisez le document, puis répondez aux questions.'
    const exercise: TcfCeAnnonce = {
      id: `sante-${id}`, niveau, competence: 'CE', type_exercice: 'annonce', scene: ce.title,
      support: { titre: ce.title, texte: ce.text, image: null },
      questions: comprehensionQuestions(ce, topic),
    }
    activities.push({ id, topic, level, label: `CE — ${ce.title}`, instruction, exercise })
  }

  if (co) {
    const id = idFor('co')
    const instruction = 'Écoutez deux fois le document, puis répondez aux questions.'
    const exercise: TcfCoComplet = {
      id: `sante-${id}`, niveau, competence: 'CO', type_exercice: 'complet', scene: co.title,
      support: { audio: `/lib/audio/sante/${co.slug}.mp3`, transcription: co.text },
      questions: comprehensionQuestions(co, topic),
    }
    activities.push({ id, topic, level, label: `CO — ${co.title}`, instruction, exercise })
  }

  if (pe) {
    const id = idFor('pe')
    const exercise: TcfPeQuestionTexte = {
      id: `sante-${id}`, niveau, competence: 'PE', type_exercice: 'question_texte', scene: pe.title,
      points: 10, questions: [],
      support: { consigne: pe.prompt, nb_mots: { min: pe.words[0], max: pe.words[1] }, reponse_modele: pe.model },
    }
    activities.push({ id, topic, level, label: `PE — ${pe.title}`, exercise })
  }

  if (po) {
    const id = idFor('po')
    const exercise: TcfPoDialogue = {
      id: `sante-${id}`, niveau, competence: 'PO', type_exercice: 'dialogue', scene: po.title,
      points: 5, questions: [],
      support: {
        situation: po.prompt,
        repliques_au_corrige: true,
        repliques: po.dialogue.flatMap(([question, model]) => [
          { locuteur: 'examinateur', texte: question! },
          { locuteur: 'eleve', texte: model! },
        ]),
      },
    }
    activities.push({ id, topic, level, label: `PO — ${po.title}`, exercise })
  }

  return activities
}

const appointmentForm: TcfPeFormulaire = {
  id: 'sante-soins-pe-formulaire-a1',
  niveau: 'A0-A1',
  competence: 'PE',
  type_exercice: 'formulaire',
  scene: 'La fiche d’accueil',
  consigne: 'Inès Yilmaz a rendez-vous jeudi 3 décembre à 10 h. Elle a mal à la main depuis hier. Complétez la fiche pour ce personnage.',
  points: 5,
  questions: [],
  support: {
    titre: 'Cabinet médical — Fiche d’accueil',
    champs: [
      { label: 'Prénom', type: 'texte', corrige: 'Inès' },
      { label: 'Nom', type: 'texte', corrige: 'Yilmaz' },
      { label: 'Date du rendez-vous', type: 'texte', corrige: 'Jeudi 3 décembre' },
      { label: 'Heure du rendez-vous', type: 'texte', corrige: '10 h' },
      { label: 'Motif de la visite', type: 'texte', corrige: 'Mal à la main depuis hier' },
    ],
  },
}

export const santeSequenceActivities: SanteActivity[] = [
  ...(rawSequences as Sequence[]).flatMap(sequenceActivities),
  {
    id: 'soins-pe-formulaire-a1', topic: 'soins', level: 'A1',
    label: 'PE — Remplir la fiche d’accueil', instruction: appointmentForm.consigne, exercise: appointmentForm,
  },
]
