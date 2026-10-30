import { createRng, int, pick, randomSeed, shuffle, type Rng } from '@/math/rng'
import {
  tcfCourtAudioEntries,
  tcfLongAudioEntries,
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
  TcfCoComplet,
  TcfCoSixCourts,
  TcfCoTroisMoyens,
  TcfCompetence,
  TcfExercise,
  TcfNiveau,
  TcfQuestion,
  TcfSituation,
  TcfTypeExercice,
} from './types'

export const TCF_LONG_DEFAULT_QUESTIONS = 5

/**
 * Résout N entrées : chemins épinglés (tous niveaux) d’abord,
 * puis tirage sans doublon dans `fillPool` (niveau préféré).
 */
function pickAudioSlots(
  fillPool: TcfAudioEntry[],
  count: number,
  rng: Rng,
  pinned: readonly (string | undefined)[] | undefined,
  /** Banque complète pour résoudre un audio choisi hors niveau. */
  lookupPool: TcfAudioEntry[] = fillPool,
): TcfAudioEntry[] | null {
  if (fillPool.length < count && !(pinned?.some((p) => p?.trim()))) return null
  const byPath = new Map(lookupPool.map((e) => [e.audio, e]))
  const used = new Set<string>()
  const out: Array<TcfAudioEntry | null> = Array.from({ length: count }, () => null)
  for (let i = 0; i < count; i++) {
    const path = pinned?.[i]?.trim()
    const pinnedEntry = path ? byPath.get(path) : undefined
    if (pinnedEntry && !used.has(pinnedEntry.audio)) {
      out[i] = pinnedEntry
      used.add(pinnedEntry.audio)
    }
  }
  const remaining = shuffle(
    rng,
    fillPool.filter((e) => !used.has(e.audio)),
  )
  let ri = 0
  for (let i = 0; i < count; i++) {
    if (out[i]) continue
    const next = remaining[ri++]
    if (!next) return null
    out[i] = next
    used.add(next.audio)
  }
  return out as TcfAudioEntry[]
}

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

export type TcfComposeOpts = {
  /** Chemins audio épinglés (slots vides → tirage). */
  audioSlots?: readonly (string | undefined)[]
  /** Nombre de questions pour un audio long (défaut 5). */
  questionCount?: number
}

/**
 * Compose « 6 audios courts » : tire 6 pistes taguées `court`, une question
 * au hasard dans le pool de chaque piste (QCM texte par défaut).
 */
export function drawSixCourtsCompose(
  niveau: TcfNiveau,
  rng: Rng = createRng(randomSeed()),
  opts: TcfComposeOpts = {},
): TcfCoSixCourts | null {
  const all = tcfCourtAudioEntries(tcfBankAllLevels('CO'))
  const pool = enoughEntries(niveau, all, 6)
  const picked = pickAudioSlots(pool, 6, rng, opts.audioSlots, all)
  if (!picked) return null
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
  opts: TcfComposeOpts = {},
): TcfCoTroisMoyens | null {
  const all = tcfMoyenAudioEntries(tcfBankAllLevels('CO'))
  const pool = enoughEntries(niveau, all, 3)
  const picked = pickAudioSlots(pool, 3, rng, opts.audioSlots, all)
  if (!picked) return null
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
 * Compose « 1 audio long » : tire une piste taguée `long`, N questions
 * (défaut 5) dans son pool (QCM texte par défaut).
 */
export function drawUnLongCompose(
  niveau: TcfNiveau,
  rng: Rng = createRng(randomSeed()),
  opts: TcfComposeOpts = {},
): TcfCoComplet | null {
  const want = Math.max(1, Math.min(20, opts.questionCount ?? TCF_LONG_DEFAULT_QUESTIONS))
  const all = tcfLongAudioEntries(tcfBankAllLevels('CO'))
  const pool = enoughEntries(niveau, all, 1)
  const picked = pickAudioSlots(pool, 1, rng, opts.audioSlots, all)
  if (!picked?.[0]) return null
  const entry = picked[0]
  const fromPool = entry.questionPool ?? []
  if (fromPool.length === 0) return null
  const n = Math.min(want, fromPool.length)
  const chosen = shuffle(rng, fromPool).slice(0, n).map((q) => asQcmTextePrefer(q))
  const trRaw = entry.exercise.type_exercice === 'complet' ? entry.exercise.support.transcription : ''
  const transcription = Array.isArray(trRaw)
    ? (trRaw[Math.max(0, (entry.dialogueIndex ?? 1) - 1)] ?? trRaw[0] ?? '')
    : String(trRaw ?? '')
  return {
    id: `tcf-co-long-draw-${niveau.toLowerCase()}`,
    niveau,
    competence: 'CO',
    type_exercice: 'complet',
    theme: entry.exercise.theme ?? 'Document audio',
    scenario: entry.exercise.scenario ?? 'vie-quotidienne',
    scene: entry.label,
    consigne: 'Écoutez le document, puis répondez aux questions.',
    points: n,
    support: { audio: entry.audio, transcription },
    questions: chosen,
    consigne_supplementaire: null,
  }
}

/**
 * Un tirage pour le type choisi.
 * six_courts : 6 pistes `court` + 1 question chacune.
 * trois_moyens : 3 pistes `moyen` + 2 questions chacune.
 * complet : 1 piste `long` + N questions.
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

  if (competence === 'CO' && typeExercice === 'complet') {
    return drawUnLongCompose(niveau, rng) ?? blank()
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
