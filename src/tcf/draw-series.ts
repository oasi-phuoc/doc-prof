import { createRng, pick, randomSeed, shuffle, type Rng } from '@/math/rng'
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

export type TcfComposeOpts = {
  /** Chemins audio épinglés (slots vides → tirage). */
  audioSlots?: readonly (string | undefined)[]
  /** Nombre de questions pour un audio long (défaut 5). */
  questionCount?: number
}

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

/** Unité dialogue = 1 piste audio taguée `scenario` + 1 scène associée (hors leurres). */
type DialogueUnit = {
  audio: string
  transcription: string
  image: string
  sourceId: string
  niveau: TcfNiveau
}

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
      niveau: ex.niveau,
    })
  }
  const seen = new Set<string>()
  return out.filter((u) => {
    if (seen.has(u.audio)) return false
    seen.add(u.audio)
    return true
  })
}

function enoughDialogueUnits(niveau: TcfNiveau, items: DialogueUnit[], min: number): DialogueUnit[] {
  const here = items.filter((u) => u.niveau === niveau)
  return here.length >= min ? here : items
}

/** Résout N unités scénario : chemins épinglés d’abord, puis tirage. */
function pickDialogueSlots(
  fillPool: DialogueUnit[],
  count: number,
  rng: Rng,
  pinned: readonly (string | undefined)[] | undefined,
  lookupPool: DialogueUnit[] = fillPool,
): DialogueUnit[] | null {
  if (fillPool.length < count && !(pinned?.some((p) => p?.trim()))) return null
  const byPath = new Map(lookupPool.map((u) => [u.audio, u]))
  const used = new Set<string>()
  const out: Array<DialogueUnit | null> = Array.from({ length: count }, () => null)
  for (let i = 0; i < count; i++) {
    const path = pinned?.[i]?.trim()
    const pinnedUnit = path ? byPath.get(path) : undefined
    if (pinnedUnit && !used.has(pinnedUnit.audio)) {
      out[i] = pinnedUnit
      used.add(pinnedUnit.audio)
    }
  }
  const remaining = shuffle(
    rng,
    fillPool.filter((u) => !used.has(u.audio)),
  )
  let ri = 0
  for (let i = 0; i < count; i++) {
    if (out[i]) continue
    const next = remaining[ri++]
    if (!next) return null
    out[i] = next
    used.add(next.audio)
  }
  return out as DialogueUnit[]
}

/**
 * Leurres = scènes d’autres unités `scenario` non tirées (pas les chemins
 * « *-leurre-* » des packs, souvent absents du dépôt).
 */
function associationLeurreImages(exclude: Set<string>, units: DialogueUnit[]): string[] {
  const imgs: string[] = []
  const seen = new Set<string>(exclude)
  for (const u of units) {
    const img = u.image.trim()
    if (!img || seen.has(img)) continue
    seen.add(img)
    imgs.push(img)
  }
  return imgs
}

/**
 * Compose « association scénarios » : 4 pistes taguées `scenario` (image liée)
 * + 2 scènes leurres (dialogue null) → 6 images, 1 point chacune.
 */
export function drawAssociationCompose(
  niveau: TcfNiveau,
  rng: Rng = createRng(randomSeed()),
  opts: TcfComposeOpts = {},
): TcfCoAssociation | null {
  const all = associationDialoguePool()
  const pool = enoughDialogueUnits(niveau, all, 4)
  const picked = pickDialogueSlots(pool, 4, rng, opts.audioSlots, all)
  if (!picked) return null
  const usedImages = new Set(picked.map((u) => u.image))
  // Leurres depuis le même pool de niveau (évite les scènes A1-A2 absentes du dépôt).
  const leurrePool = associationLeurreImages(usedImages, pool)
  if (leurrePool.length < 2) return null
  const leurres = shuffle(rng, leurrePool).slice(0, 2)

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

  return {
    id: `tcf-co-assoc-draw-${niveau.toLowerCase()}`,
    niveau,
    competence: 'CO',
    type_exercice: 'association_images',
    theme: 'Conversations entre locuteurs',
    scenario: 'vie-quotidienne',
    scene: 'Situations illustrées',
    consigne:
      `Vous allez entendre 4 petits dialogues, correspondant à 4 situations différentes. ` +
      `Associez chaque audio à une image. Attention : il y a 6 images mais seulement 4 audios. ` +
      `Notez le numéro de l’audio sous l’image (Audio n° : ___).`,
    points: 6,
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
