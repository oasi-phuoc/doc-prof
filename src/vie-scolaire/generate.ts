import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import { ficheCommunicationItems, ficheQuestion } from '@/francais/fiches-communication'
import { completionFicheItems } from '@/grammaire/exercises/completion-fiche'
import { grammarWordCards } from '@/grammaire/exercises/word-vocab'
import { shuffle, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import type { TcfExercise } from '@/tcf/types'
import audioBank from './audios.json'
import { SCHOOL_KINDS, isSchoolKind } from './catalog'
import { SCHOOL_LESSONS } from './lecons'
import { isVieScolaireType, type SchoolAudio, type SchoolLesson, type SchoolPicture } from './types'

const reference = 'src/vie-scolaire/lecons.ts'
const lessons = new Map(SCHOOL_LESSONS.map((lesson) => [lesson.id, lesson]))
const audios: Record<string, readonly SchoolAudio[]> = audioBank

export function vieScolaireAudiosForType(typeId: string): readonly SchoolAudio[] {
  return isSchoolKind(typeId, 'co') ? audios[typeId.slice('vie-scolaire-'.length, -'-co'.length)] ?? [] : []
}

function theory(block: GrammarTheoryBlock): MathItem {
  return { layout: 'theory', answer: '', noPoints: true, theoryBlock: block, grammarTheoryFalc: true }
}

function pictureRows(pictures: readonly SchoolPicture[]): MathItem[] {
  const rows: MathItem[] = []
  for (let index = 0; index < pictures.length; index += 2) {
    rows.push(theory({ kind: 'image-row', label: 'Illustrations', cells: pictures.slice(index, index + 2) }))
  }
  return rows
}

function theoryItems(lesson: SchoolLesson): MathItem[] {
  const descriptions = Math.ceil(lesson.steps.length / 2)
  const pictures = Math.ceil(lesson.pictures.length / 4) * 2
  return [
    theory({ kind: 'heading', text: lesson.title }),
    theory({ kind: 'paragraph', text: lesson.objective }),
    ...pictureRows(lesson.pictures.slice(0, pictures)),
    theory({ kind: 'examples', label: 'Je regarde', marker: 'border', items: [lesson.situation] }),
    { ...theory({ kind: 'examples', label: 'Je comprends', marker: 'puces', items: [...lesson.steps.slice(0, descriptions)] }), theoryPageBreakAfter: true },
    theory({ kind: 'heading', text: `${lesson.title} · Un exemple`, sub: true }),
    ...pictureRows(lesson.pictures.slice(pictures)),
    theory({ kind: 'examples', label: 'Je retiens', marker: 'puces', items: [...lesson.steps.slice(descriptions)] }),
    theory(typeof lesson.example === 'string'
      ? { kind: 'examples', label: 'Je regarde l’exemple', marker: 'border', items: [lesson.example] }
      : lesson.example),
    theory({ kind: 'practice', instruction: 'J’essaie', items: [lesson.practice] }),
  ]
}

function communication(lesson: SchoolLesson, kind: 'ce' | 'co' | 'po' | 'pe', audio?: SchoolAudio): TcfExercise | undefined {
  const common = {
    id: `vie-scolaire-${lesson.id}-${kind}${audio ? `-${audio.id}` : ''}`,
    niveau: 'A0-A1' as const,
    theme: lesson.title,
    scene: lesson.title,
    questions: [],
  }
  switch (kind) {
    case 'ce':
      return {
        ...common, competence: 'CE', type_exercice: 'annonce',
        support: { titre: lesson.read.title, texte: lesson.read.lines.join('\n\n'), image: lesson.read.picture?.src ?? null },
        questions: lesson.read.questions.map((question) => ficheQuestion({ ...question, shuffleChoices: true })),
      }
    case 'co':
      if (!audio) return undefined
      return {
        ...common, competence: 'CO', type_exercice: 'complet',
        support: { audio: audio.src, transcription: audio.transcript },
        questions: audio.questions.map((question) => ficheQuestion({ ...question, shuffleChoices: true })),
      }
    case 'po':
      return {
        ...common, competence: 'PO', type_exercice: 'dialogue',
        support: {
          situation: lesson.speak.prompt,
          images: lesson.speak.picture ? [lesson.speak.picture.src] : undefined,
          repliques: [{ locuteur: 'eleve', texte: lesson.speak.model }],
          repliques_au_corrige: true,
        },
      }
    case 'pe': {
      const support = { consigne: lesson.write.prompt, reponse_modele: lesson.write.model, nb_mots: {} }
      return lesson.write.picture
        ? { ...common, competence: 'PE', type_exercice: 'image_question', support: { ...support, image: lesson.write.picture.src } }
        : { ...common, competence: 'PE', type_exercice: 'question_texte', support }
    }
  }
}

export function tryGenerateVieScolaireBlock(config: PageConfig, rng: Rng) {
  if (!isVieScolaireType(config.exerciseType)) return null
  const match = /^vie-scolaire-(.+)-(theorie|lexique|pratique|ce|co|po|pe)$/.exec(config.exerciseType)
  if (!match) return null
  const [, id, kind] = match
  const lesson = lessons.get(id)
  const type = SCHOOL_KINDS.find(([candidate]) => candidate === kind)
  if (!lesson || !type) return null
  const instruction = type[2]
  switch (kind) {
    case 'theorie':
      return { instruction: lesson.title, items: theoryItems(lesson) }
    case 'lexique': {
      const recall = Boolean(config.grammarVocabRecall)
      const entries = shuffle(rng, lesson.words)
        .slice(0, Math.min(6, Math.max(1, config.count)))
        .map((word) => ({
          id: `${id}-${word.label}`, label: word.label, clue: word.clue,
          image: recall && word.pending ? undefined : word.image,
        }))
      return { instruction: recall ? 'Retrouvez chaque mot à l’aide de l’image ou de sa définition.' : instruction, items: grammarWordCards(entries, recall) }
    }
    case 'pratique':
      return {
        instruction: config.completionPresentation === 'gap' ? instruction : 'Choisissez une réponse par phrase.',
        items: completionFicheItems(lesson.completion.slice(0, Math.max(1, config.count)), config, reference, rng),
      }
    case 'ce':
    case 'co':
    case 'po':
    case 'pe': {
      const choices = vieScolaireAudiosForType(config.exerciseType)
      const audio = choices.find((candidate) => candidate.id === config.grammarCoAudioId) ?? choices[0]
      const exercise = communication(lesson, kind, audio)
      if (!exercise) return null
      return {
        instruction: kind === 'co' && config.grammarCoFormat === 'true-false'
          ? 'Écoutez l’enregistrement. Pour chaque phrase, cochez Vrai ou Faux.'
          : instruction,
        items: ficheCommunicationItems(exercise, config, rng, {
          reference: 'Vie scolaire',
          writingLines: 4,
          statements: audio?.statements,
        }),
      }
    }
    default:
      return null
  }
}
