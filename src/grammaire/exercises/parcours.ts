import { createRng } from '@/math/rng'
import type { ExerciseType, MathItem, WorksheetBlock } from '@/math/types'
import { tcfAudioSrc } from '@/tcf/media'
import type { TcfExercise } from '@/tcf/types'
import { collectCorrigeAudioSrcs } from '@/tcf/download-audios'
import { grammarExerciseItems } from './to-tcf'
import { choice, dailyGrammarScenarios } from './parcours-quotidien'

export type GrammarScenario = {
  type: ExerciseType
  subthemeId: string
  stages: { title: string; exercise: TcfExercise; audioLabel?: string }[]
}

const title = 'Déplacer un rendez-vous au cabinet dentaire'
const scenarioId = 'gram-parcours-cabinet-dentaire-a2'
const cabinetAudio = '/lib/audio/tcf/co/vie-quotidienne/bonjour-ici-cabinet-dentaire.mp3'
const source = { niveau: 'A1-A2', scenario: 'sante', scene: title } as const

const cabinet: GrammarScenario = {
  type: {
    id: scenarioId,
    topic: 'gram-temps',
    label: 'Parcours A2 — Rendez-vous au cabinet dentaire',
    description: 'Lire une confirmation, écouter un message, écrire un SMS et jouer un appel.',
    instruction: title,
    visual: 'texte',
    preferredColumns: 1,
    preferredCount: 1,
  },
  subthemeId: 'e2',
  stages: [
    {
      title: 'Compréhension écrite · Lire la confirmation',
      exercise: {
        ...source, id: `${scenarioId}-ce`, competence: 'CE', type_exercice: 'annonce',
        consigne: 'Lisez la confirmation du rendez-vous. Cochez une réponse par question.',
        support: {
          titre: 'Cabinet dentaire du docteur Molaire',
          texte: 'Votre rendez-vous est prévu aujourd’hui à 15 h 30. Apportez votre carte d’assurance maladie. Si la ligne est occupée, envoyez un SMS. Nous confirmons par téléphone.',
          image: null,
        },
        questions: [
          choice('À quelle heure est le rendez-vous ?', 'À 15 h 30.', ['À 11 h 30.', 'À 15 h 15.']),
          choice('La ligne est occupée. Que pouvez-vous faire ?', 'Envoyer un SMS.', ['Envoyer une lettre.', 'Venir au cabinet.']),
        ],
      },
    },
    {
      title: 'Compréhension orale · Écouter le message',
      audioLabel: 'Message du cabinet',
      exercise: {
        ...source, id: `${scenarioId}-co`, competence: 'CO', type_exercice: 'complet',
        consigne: 'Écoutez deux fois. Cochez une réponse par question.',
        support: {
          audio: cabinetAudio,
          transcription: 'Bonjour, ici le cabinet dentaire du docteur Molaire. Je suis désolée, mais nous sommes obligés d’annuler votre rendez-vous de 15 h 30 prévu aujourd’hui. Le docteur est souffrant. Nous vous proposons de décaler votre visite à la semaine prochaine. Nous avons une place disponible jeudi 14 à 11 h 15 ou vendredi 15 à 15 h 30. Veuillez nous rappeler pour confirmer. N’oubliez pas votre carte d’assurance maladie. À bientôt !',
        },
        questions: [
          choice('Que devient le rendez-vous d’aujourd’hui ?', 'Il est annulé.', ['Il est avancé.', 'Il reste à la même heure.']),
          choice('Quel créneau est proposé le jeudi 14 ?', 'À 11 h 15.', ['À 11 h 30.', 'À 15 h 30.']),
          choice('Que demande le cabinet pour confirmer ?', 'De rappeler le cabinet.', ['De venir au cabinet.', 'D’envoyer la carte d’assurance maladie.']),
        ],
      },
    },
    {
      title: 'Production écrite · Demander un nouvel horaire',
      exercise: {
        ...source, id: `${scenarioId}-pe`, competence: 'PE', type_exercice: 'sms_reponse',
        consigne: 'Vous essayez d’appeler le cabinet. La ligne est occupée. Écrivez un SMS pour demander le créneau du matin.',
        support: {
          expediteur: 'Cabinet dentaire',
          sms_recu: 'Si notre ligne est occupée, laissez-nous votre nom et l’horaire que vous souhaitez. Appelez ensuite le secrétariat pour confirmer.',
          consigne: 'Saluez. Indiquez votre nom et le rendez-vous annulé. Demandez le créneau du matin en précisant le jour et l’heure. Remerciez.\nPour dire l’heure, utilisez « à » comme dans « mardi à 10 heures ».',
          nb_mots: { min: 30, max: 55 },
          reponse_modele: 'Bonjour, je m’appelle Nora Diallo. Mon rendez-vous d’aujourd’hui à 15 h 30 est annulé. Est-ce que je peux prendre le rendez-vous du jeudi 14 à 11 h 15 ? Merci de votre aide. Bonne journée !',
        },
        questions: [],
      },
    },
    {
      title: 'Production orale · Confirmer par téléphone',
      exercise: {
        ...source, id: `${scenarioId}-po`, competence: 'PO', type_exercice: 'dialogue',
        consigne: 'Jouez l’appel à deux. Puis échangez les rôles.',
        support: {
          situation: 'Vous avez envoyé un SMS. Appelez pour confirmer le rendez-vous du matin.\nPersonne qui appelle. Saluez, donnez votre nom, expliquez le motif de l’appel puis redemandez le jour et l’heure.\nSecrétariat. Demandez le nom, confirmez le créneau demandé puis rappelez le document à apporter.',
          repliques_au_corrige: true,
          repliques: [
            { locuteur: 'examinateur', texte: 'Cabinet dentaire, bonjour.' },
            { locuteur: 'eleve', texte: 'Bonjour, je voudrais confirmer mon nouveau rendez-vous.' },
            { locuteur: 'examinateur', texte: 'À quel nom, s’il vous plaît ?' },
            { locuteur: 'eleve', texte: 'Nora Diallo. Est-ce que jeudi 14 à 11 h 15 est possible ?' },
            { locuteur: 'examinateur', texte: 'Oui, je confirme jeudi 14 à 11 h 15. Pensez à prendre votre carte d’assurance maladie.' },
            { locuteur: 'eleve', texte: 'D’accord, jeudi 14 à 11 h 15. Merci et bonne journée !' },
          ],
        },
        questions: [],
      },
    },
  ],
}

export const grammarScenarios: readonly GrammarScenario[] = [cabinet, ...dailyGrammarScenarios]

export function grammarScenarioFor(typeId: string) {
  return grammarScenarios.find(scenario => scenario.type.id === typeId)
}

export function buildGrammarScenario(scenario: GrammarScenario, seed: number) {
  return {
    instruction: scenario.type.instruction,
    items: scenario.stages.flatMap(({ exercise, audioLabel }, stageIndex) =>
      grammarExerciseItems(exercise, createRng(seed + stageIndex)).map((item): MathItem => {
        const staged = { ...item, grammarScenarioStage: stageIndex }
        if (exercise.type_exercice !== 'complet') return staged
        const tcf = item.tcf
        if (tcf?.kind === 'support' && exercise.support.audio) {
          return { ...staged, audioSrc: tcfAudioSrc(exercise.support.audio) || exercise.support.audio }
        }
        if (tcf?.kind === 'audio_cadre') {
          return { ...staged, tcf: { ...tcf, audioSrc: undefined, audioLabel: audioLabel ?? 'Enregistrement' } }
        }
        return staged
      })),
  }
}

export function paginateGrammarScenario(block: WorksheetBlock, scenario: GrammarScenario): WorksheetBlock[] {
  let itemOffset = 0
  return scenario.stages.flatMap(({ title, exercise }, stageIndex) => {
    const items = block.items.filter(item => item.grammarScenarioStage === stageIndex)
    if (!items.length) return []
    const slice = {
      ...block,
      items,
      title,
      instruction: exercise.consigne ?? '',
      columns: 1,
      itemOffset,
      corrigeAudios: collectCorrigeAudioSrcs(items),
    }
    itemOffset += items.length
    return [slice]
  })
}
