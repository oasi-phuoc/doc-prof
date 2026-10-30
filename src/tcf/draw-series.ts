import { createRng, int, pick, randomSeed, shuffle, type Rng } from '@/math/rng'
import {
  tcfCourtAudioEntries,
  tcfMoyenAudioEntries,
  tcfScenarioAudioEntries,
  type TcfAudioEntry,
} from './audio-bank'
import { isTcfCoAssociation } from './association-audio'
import { filledForms, switchQuestionForm } from './formes'
import { tcfBank, tcfBankAllLevels } from './loader'
import { emptyTcfExercise, tcfExerciseId } from './templates'
import type {
  TcfCoAssociation,
  TcfCoSixCourts,
  TcfCoTroisMoyens,
  TcfCompetence,
  TcfExercise,
  TcfNiveau,
  TcfQuestion,
  TcfSituation,
  TcfTypeExercice,
} from './types'

function withNiveau(ex: TcfExercise, niveau: TcfNiveau): TcfExercise {
  return { ...structuredClone(ex), niveau }
}

/** Le niveau courant s’il a assez d’entrées, sinon tous les niveaux. */
function enoughEntries(niveau: TcfNiveau, items: TcfAudioEntry[], min: number): TcfAudioEntry[] {
  const here = items.filter((e) => e.exercise.niveau === niveau)
  return here.length >= min ? here : items
}

/** Préfère QCM texte (défaut CSC) si une variante Texte est remplie. */
function asQcmTextePrefer(q: TcfQuestion): TcfQuestion {
  const clone = structuredClone(q)
  if (clone.type_reponse === 'qcm_texte') return clone
  if (filledForms(clone).includes('qcm_texte')) return switchQuestionForm(clone, 'qcm_texte')
  return clone
}

type DialogueUnit = {
  audio: string
  transcription: string
  image: string
  sourceId: string
}

/** Unité dialogue = 1 piste audio taguée `scenario` + 1 scène associée (hors leurres). */
function associationDialoguePool(): DialogueUnit[] {
  const out: DialogueUnit[] = []
  for (const entry of tcfScenarioAudioEntries(tcfBankAllLevels('CO'))) {
    if (!isTcfCoAssociation(entry.exercise) || entry.dialogueIndex == null) continue
    const ex = entry.exercise
    const sit = ex.situations.find((s) => s.dialogue === entry.dialogueIndex)
    if (!sit?.image.trim()) continue
    const trRaw = ex.support.transcription
    const trs = Array.isArray(trRaw)
      ? trRaw.map((t) => String(t))
      : [String(trRaw ?? '')]
    const idx = entry.dialogueIndex - 1
    out.push({
      audio: entry.audio,
      transcription: (trs[idx] ?? '').trim(),
      image: sit.image.trim(),
      sourceId: ex.id,
    })
  }
  const seen = new Set<string>()
  return out.filter((u) => {
    if (seen.has(u.audio)) return false
    seen.add(u.audio)
    return true
  })
}

function associationLeurreImages(exclude: Set<string>): string[] {
  const imgs: string[] = []
  const seen = new Set<string>(exclude)
  for (const ex of tcfBankAllLevels('CO')) {
    if (ex.type_exercice !== 'association_images') continue
    for (const sit of ex.situations) {
      const img = sit.image.trim()
      if (!img || seen.has(img)) continue
      seen.add(img)
      imgs.push(img)
    }
  }
  return imgs
}

/**
 * Tire 4 dialogues distincts + 2 ou 4 scènes leurres (6 ou 8 images).
 * Les pistes audio restent découpées (une par dialogue).
 */
function drawAssociationCompose(niveau: TcfNiveau, rng: ReturnType<typeof createRng>): TcfCoAssociation | null {
  const pool = associationDialoguePool()
  if (pool.length < 4) return null
  const picked = shuffle(rng, pool).slice(0, 4)
  const usedImages = new Set(picked.map((u) => u.image))
  const leurrePool = associationLeurreImages(usedImages)
  if (leurrePool.length < 2) return null
  const nLeurres = int(rng, 0, 1) === 0 ? 2 : Math.min(4, leurrePool.length)
  const leurres = shuffle(rng, leurrePool).slice(0, nLeurres)

  const matched: TcfSituation[] = picked.map((u, i) => ({
    id: `d${i + 1}`,
    image: u.image,
    dialogue: i + 1,
  }))
  const decoys: TcfSituation[] = leurres.map((image, i) => ({
    id: `l${i + 1}`,
    image,
    dialogue: null,
  }))
  const situations = shuffle(rng, [...matched, ...decoys])
  const nImages = situations.length
  const id = `tcf-co-assoc-draw-${niveau.toLowerCase()}`

  return {
    id,
    niveau,
    competence: 'CO',
    type_exercice: 'association_images',
    theme: 'Conversations entre locuteurs',
    scenario: 'vie-quotidienne',
    scene: 'Dialogues illustrés',
    consigne:
      `Vous allez entendre 4 petits dialogues, correspondant à 4 situations différentes. ` +
      `Associez chaque dialogue à une image. Attention : il y a ${nImages} images mais seulement 4 dialogues. ` +
      `Notez le numéro du dialogue sous l’image (Dialogue n° : ___).`,
    points: 8,
    support: {
      nb_dialogues: 4,
      audios: picked.map((u) => u.audio),
      transcription: picked.map((u) => u.transcription),
    },
    questions: [],
    situations,
    consigne_supplementaire: null,
  }
}

/**
 * Compose « 6 audios courts » : tire 6 pistes taguées `court`, une question
 * au hasard dans le pool de chaque piste (QCM texte par défaut).
 */
export function drawSixCourtsCompose(
  niveau: TcfNiveau,
  rng: Rng = createRng(randomSeed()),
): TcfCoSixCourts | null {
  const pool = enoughEntries(niveau, tcfCourtAudioEntries(tcfBankAllLevels('CO')), 6)
  if (pool.length < 6) return null
  const picked = shuffle(rng, pool).slice(0, 6)
  const questions: TcfQuestion[] = picked.map((entry, i) => {
    const fromPool = entry.questionPool ?? []
    const chosen = pick(rng, fromPool)
    const q = asQcmTextePrefer(chosen)
    return { ...q, audio: i + 1 }
  })
  return {
    id: `tcf-co-six-courts-draw-${niveau.toLowerCase()}`,
    niveau,
    competence: 'CO',
    type_exercice: 'six_courts',
    theme: 'Mini-audios',
    scenario: 'vie-quotidienne',
    scene: 'Six extraits courts',
    consigne: 'Écoutez chaque extrait, puis répondez aux questions.',
    points: 6,
    support: { audios: picked.map((e) => e.audio) },
    questions,
    consigne_supplementaire: null,
  }
}

/**
 * Compose « 3 audios moyens » : tire 3 pistes taguées `moyen`, deux questions
 * au hasard dans le pool de chaque piste (QCM texte par défaut).
 */
export function drawTroisMoyensCompose(
  niveau: TcfNiveau,
  rng: Rng = createRng(randomSeed()),
): TcfCoTroisMoyens | null {
  const pool = enoughEntries(niveau, tcfMoyenAudioEntries(tcfBankAllLevels('CO')), 3)
  if (pool.length < 3) return null
  const picked = shuffle(rng, pool).slice(0, 3)
  const questions: TcfQuestion[] = []
  for (let i = 0; i < picked.length; i++) {
    const fromPool = picked[i]!.questionPool ?? []
    if (fromPool.length < 2) continue
    const chosen = shuffle(rng, fromPool).slice(0, 2)
    for (const q of chosen) {
      questions.push({ ...asQcmTextePrefer(q), audio: i + 1 })
    }
  }
  if (questions.length !== 6) return null
  return {
    id: `tcf-co-trois-moyens-draw-${niveau.toLowerCase()}`,
    niveau,
    competence: 'CO',
    type_exercice: 'trois_moyens',
    theme: 'Audios moyens',
    scenario: 'vie-quotidienne',
    scene: 'Trois extraits moyens',
    consigne: 'Écoutez chaque extrait, puis répondez aux questions.',
    points: 6,
    support: { audios: picked.map((e) => e.audio) },
    questions,
    consigne_supplementaire: null,
  }
}

/**
 * Un tirage pour le type choisi.
 * six_courts : 6 pistes `court` + 1 question chacune.
 * trois_moyens : 3 pistes `moyen` + 2 questions chacune.
 * Images objets / association : composition dédiée.
 */
export function drawTcfSeries(
  niveau: TcfNiveau,
  competence: TcfCompetence,
  typeExercice: TcfTypeExercice,
): TcfExercise {
  const rng = createRng(randomSeed())
  const blank = () =>
    emptyTcfExercise(niveau, competence, typeExercice, tcfExerciseId(niveau, competence, 1))

  if (competence === 'CO' && typeExercice === 'six_courts') {
    return drawSixCourtsCompose(niveau, rng) ?? blank()
  }

  if (competence === 'CO' && typeExercice === 'trois_moyens') {
    return drawTroisMoyensCompose(niveau, rng) ?? blank()
  }

  if (competence === 'CO' && typeExercice === 'images_a_reconnaitre') {
    const ready = tcfBankAllLevels('CO').filter(
      (ex) => ex.type_exercice === 'images_a_reconnaitre' && ex.images.length === 5,
    )
    const source = shuffle(rng, ready)[0]
    return source ? withNiveau(source, niveau) : blank()
  }

  if (competence === 'CO' && typeExercice === 'association_images') {
    const composed = drawAssociationCompose(niveau, rng)
    if (composed) return composed
    const ready = tcfBankAllLevels('CO').filter((ex) => ex.type_exercice === 'association_images')
    const source = shuffle(rng, ready)[0]
    return source ? withNiveau(source, niveau) : blank()
  }

  const here = tcfBank(niveau, competence, typeExercice)
  const any = tcfBankAllLevels(competence).filter((ex) => ex.type_exercice === typeExercice)
  const source = shuffle(rng, here.length ? here : any)[0]
  return source ? withNiveau(source, niveau) : blank()
}
