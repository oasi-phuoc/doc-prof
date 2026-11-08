import { shuffle, type Rng } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { tcfExerciseItems } from '@/tcf/generate'
import { countInlineBlanks } from '@/tcf/inline-blank'
import type { TcfCompetence, TcfExercise, TcfQuestion, TcfTypeExercice, TcfTypeReponse } from '@/tcf/types'
import { TCF_LETTRES } from '@/tcf/templates'
import type { GramExerciseKindId } from './kinds'
import type { GramBankItem } from './types'

const CHOICE_IDS = ['a', 'b', 'c', 'd'] as const

function uniqueAudios(items: GramBankItem[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const src = item.audioSrc?.trim()
    if (!src || seen.has(src)) continue
    seen.add(src)
    out.push(src)
  }
  return out
}

function looksLikeDocument(prompt: string): boolean {
  const text = prompt.trim()
  if (countInlineBlanks(text) > 0) return false
  if (text.length < 90) return false
  return /[.!?].*[.!?]|De\s*:|Objet\s*:|Bonjour|Cher |Chère /.test(text)
}

function isPeRedaction(kindId: GramExerciseKindId, instruction: string, items: GramBankItem[]): boolean {
  if (/e-?mail|sms|message|rédigez un texte/i.test(instruction)) return true
  if (kindId !== 'ecrire') return false
  return items.length <= 2 && items.every((item) => !item.givenVerb && countInlineBlanks(item.prompt) === 0)
}

function padAudios(list: string[], size: number): string[] {
  const next = [...list]
  while (next.length < size) next.push('')
  return next.slice(0, size)
}

function questionFromItem(
  item: GramBankItem,
  kindId: GramExerciseKindId,
  audioIndex?: number,
): TcfQuestion {
  const enonce =
    item.givenVerb && item.givenWord
      ? `Écrivez une phrase avec « ${item.givenVerb} » et « ${item.givenWord} ».`
      : item.prompt
  const lignes = {
    nb_lignes:
      countInlineBlanks(enonce) > 0 ? 0 : kindId === 'ecrire' || Boolean(item.givenVerb) ? 2 : 1,
    reponse_modele: item.answer,
  }
  const audio = audioIndex != null && audioIndex > 0 ? { audio: audioIndex } : {}
  if (item.options && item.options.length >= 2) {
    return {
      enonce,
      type_reponse: 'qcm_texte',
      melanger: true,
      choix: item.options.slice(0, 4).map((texte, index) => ({
        id: CHOICE_IDS[index] ?? `c${index}`,
        texte,
        correct: texte === item.answer,
      })),
      formes: { lignes },
      ...audio,
    }
  }
  return {
    enonce,
    type_reponse: 'lignes',
    nb_lignes: lignes.nb_lignes,
    reponse_modele: lignes.reponse_modele,
    ...audio,
  }
}

export function gramItemsToTcfExercise(opts: {
  typeId: string
  instruction: string
  items: GramBankItem[]
  kindId: GramExerciseKindId
}): TcfExercise {
  const { typeId, instruction, items, kindId } = opts
  const id = `gram-${typeId}`
  const niveau = 'A1-A2' as const
  let working = items
  let supportText = ''
  if (working[0] && looksLikeDocument(working[0].prompt) && working.length > 1) {
    supportText = working[0].prompt
    working = working.slice(1)
  }

  const questions = working.map((item) => questionFromItem(item, kindId))
  const audios = uniqueAudios(working)
  const audioIndexBySrc = new Map(audios.map((src, index) => [src, index + 1]))
  const withAudio = working.map((item) => {
    const n = item.audioSrc ? audioIndexBySrc.get(item.audioSrc.trim()) : undefined
    return questionFromItem(item, kindId, n)
  })

  if (isPeRedaction(kindId, instruction, working) && working.length === 1) {
    const item = working[0]!
    return {
      id,
      niveau,
      competence: 'PE',
      type_exercice: /e-?mail/i.test(instruction) ? 'email_reponse' : /sms|message/i.test(instruction) ? 'sms_reponse' : 'question_texte',
      consigne: instruction,
      support:
        /e-?mail/i.test(instruction)
          ? {
              email_recu: { de: '', objet: '', texte: supportText || item.prompt },
              consigne: instruction,
              nb_mots: { min: 40, max: 80 },
              reponse_modele: item.answer,
            }
          : /sms|message/i.test(instruction)
            ? {
                sms_recu: supportText || item.prompt,
                consigne: instruction,
                nb_mots: { min: 20, max: 40 },
                reponse_modele: item.answer,
              }
            : {
                consigne: item.givenVerb
                  ? `Écrivez une phrase avec « ${item.givenVerb} » et « ${item.givenWord} ».`
                  : instruction,
                nb_mots: { min: 25, max: 60 },
                reponse_modele: item.answer,
              },
      questions: [],
    } as TcfExercise
  }

  if (supportText) {
    return {
      id,
      niveau,
      competence: 'CE',
      type_exercice: /De\s*:|Objet\s*:/i.test(supportText) ? 'email' : /sms|message/i.test(supportText) ? 'sms' : 'annonce',
      consigne: instruction,
      support: /De\s*:|Objet\s*:/i.test(supportText)
        ? { de: '', a: '', objet: '', texte: supportText }
        : /sms|message/i.test(supportText)
          ? { expediteur: '', texte: supportText }
          : { titre: '', texte: supportText, image: null },
      questions: withAudio,
    } as TcfExercise
  }

  if (audios.length === 1) {
    return {
      id,
      niveau,
      competence: 'CO',
      type_exercice: 'complet',
      consigne: instruction,
      support: { audio: audios[0]!, transcription: '' },
      questions,
    }
  }

  if (audios.length > 1 && audios.length <= 3) {
    return {
      id,
      niveau,
      competence: 'CO',
      type_exercice: 'trois_moyens',
      consigne: instruction,
      support: { audios: padAudios(audios, 3) },
      questions: withAudio,
    }
  }

  if (audios.length > 3) {
    return {
      id,
      niveau,
      competence: 'CO',
      type_exercice: 'six_courts',
      consigne: instruction,
      support: { audios: padAudios(audios, 6) },
      questions: withAudio,
    }
  }

  return {
    id,
    niveau,
    competence: 'CO',
    type_exercice: 'six_courts',
    consigne: instruction,
    support: { audios: padAudios([], 6) },
    questions,
  }
}

function hasCoAudio(exercise: TcfExercise): boolean {
  if (exercise.competence !== 'CO') return false
  const support = exercise.support as { audio?: string; audios?: string[] }
  return [support.audio, ...(support.audios ?? [])].some((audio) => Boolean(audio?.trim()))
}

function regularGrammarQuestion(q: TcfQuestion, rng: Rng, numero: number): MathItem {
  if (q.type_reponse === 'qcm_texte') {
    const choices = q.choix.filter((choice) => choice.texte)
    const ordered = q.melanger === false ? choices : shuffle(rng, choices)
    return {
      layout: 'select',
      prompt: q.enonce,
      options: ordered.map((choice) => choice.texte),
      answer: choices.filter((choice) => choice.correct).map((choice) => choice.texte).join(' · '),
      ...(q.points != null ? { points: q.points } : {}),
    }
  }
  if (q.type_reponse === 'qcm_image') {
    const ordered = q.melanger === false ? q.choix : shuffle(rng, q.choix)
    const choix = ordered.map((choice, index) => ({
      lettre: TCF_LETTRES[index] ?? String(index + 1),
      image: choice.image,
      correct: choice.correct === true,
    }))
    const answer = choix.find((choice) => choice.correct)?.lettre ?? ''
    return {
      layout: 'tcf',
      tcf: { kind: 'qcm', numero, enonce: q.enonce, mode: 'image', choix },
      answer,
      ...(q.points != null ? { points: q.points } : {}),
    }
  }
  return {
    layout: 'text',
    prompt: q.enonce,
    answer: q.reponse_modele ?? '',
    ...(q.points != null ? { points: q.points } : {}),
  }
}

/** Garde le cadre audio TCF uniquement pour les CO qui ont une piste audio. */
export function grammarExerciseItems(
  exercise: TcfExercise,
  rng: Rng,
  formModes?: Array<TcfTypeReponse | undefined>,
): MathItem[] {
  if (hasCoAudio(exercise)) {
    return tcfExerciseItems(exercise, rng, formModes).map((item) => ({
      ...item,
      tcfExerciseId: exercise.id,
    }))
  }
  if (exercise.competence === 'CO') {
    const items = exercise.questions.map((question, index) => regularGrammarQuestion(question, rng, index + 1))
    if (exercise.mots_banque?.length && items[0]) {
      items[0] = {
        ...items[0],
        prompt: `Mots : ${exercise.mots_banque.join(' · ')}\n${items[0].prompt ?? ''}`,
      }
    }
    return items
  }
  return tcfExerciseItems(exercise, rng, formModes).map((item) => ({
    ...item,
    tcfExerciseId: exercise.id,
  }))
}

export function gramTcfCompetence(ex: TcfExercise): TcfCompetence {
  return ex.competence
}

export function gramTcfType(ex: TcfExercise): TcfTypeExercice {
  return ex.type_exercice
}
