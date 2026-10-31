import {
  TCF_AUDIO_TAG_COURT,
  TCF_AUDIO_TAG_LONG,
  TCF_AUDIO_TAG_MOYEN,
  TCF_AUDIO_TAG_OBJET,
  TCF_AUDIO_TAG_SCENARIO,
  tcfAudioHasTag,
  tcfMergeAudioTags,
  tcfTagForQuestionPoolSize,
  type TcfAudioTag,
} from './audio-tags'
import { isTcfCoAssociation, tcfAssociationTranscriptions } from './association-audio'
import type { TcfExercise, TcfQuestion } from './types'

export type TcfAudioEntry = {
  audio: string
  exercise: TcfExercise
  /** Scène / libellé court (numéroté s’il y a des doublons). */
  label: string
  /** Thème ou type pour la recherche. */
  meta: string
  /** Tags cumulables (ex. `scenario` + `court`). */
  tags: TcfAudioTag[]
  /** N° de dialogue / piste 1-based (scenario, court, moyen ou long multi). */
  dialogueIndex?: number
  /** Pool de questions liées à cette piste (tags `court` / `moyen` / `long`). */
  questionPool?: TcfQuestion[]
}

export {
  TCF_AUDIO_TAG_COURT,
  TCF_AUDIO_TAG_LONG,
  TCF_AUDIO_TAG_MOYEN,
  TCF_AUDIO_TAG_OBJET,
  TCF_AUDIO_TAG_SCENARIO,
  tcfAudioHasTag,
  tcfMergeAudioTags,
}

/** Accents courants dans les stems / dossiers audio. */
const AUDIO_WORD_ACCENTS: Record<string, string> = {
  aeroport: 'aéroport',
  a: 'à',
  ecole: 'école',
  etudes: 'études',
  universite: 'université',
  bibliotheque: 'bibliothèque',
  theatre: 'théâtre',
  musee: 'musée',
  meteo: 'météo',
  telephone: 'téléphone',
  hopital: 'hôpital',
  cinema: 'cinéma',
  medicaments: 'médicaments',
  medecin: 'médecin',
  hotel: 'hôtel',
  presenter: 'présenter',
  vetements: 'vêtements',
  sante: 'santé',
  actualite: 'actualité',
  journee: 'journée',
}

/** Types de stem soutien à préfixer par le dossier thème. */
const GENERIC_STEM_TYPES = new Set([
  'annonce',
  'conversation',
  'message',
  'radio',
  'objet',
  'instruction',
])

/**
 * Nom lisible d’un chemin audio (« …/a-l-aeroport-1.mp3 » → « À l'aéroport »).
 * Pour les stems numériques soutien (`facile-a1__160`), utilise le dossier thème.
 */
export function tcfAudioDisplayName(audioPath: string, bankEntries?: readonly TcfAudioEntry[]): string {
  const trimmed = audioPath.trim()
  if (!trimmed) return ''
  const fromBank = bankEntries?.find((e) => e.audio === trimmed)
  if (fromBank?.label) return fromBank.label
  return tcfAudioBaseFromPath(trimmed)
}

/** Base sans numéro (pour regrouper les doublons). */
export function tcfAudioBaseFromPath(audioPath: string): string {
  const trimmed = audioPath.trim()
  const parts = trimmed.split('/').filter(Boolean)
  const file = parts[parts.length - 1] ?? trimmed
  const folder = parts.length >= 2 ? parts[parts.length - 2]! : ''
  const stem = file.replace(/\.mp3$/i, '')
  const afterLevel = stem.includes('__') ? stem.split('__').slice(1).join('__') : stem
  const bare = afterLevel.replace(/-\d+(\.\d+)?$/, '').replace(/__/g, ' ').replace(/-/g, ' ').trim()

  if (!bare || /^\d+$/.test(bare)) {
    return titleAudioWords(folder || bare || stem)
  }
  const titled = titleAudioWords(bare)
  if (GENERIC_STEM_TYPES.has(bare.toLocaleLowerCase('fr-FR')) && folder) {
    return `${titleAudioWords(folder)} · ${titled}`
  }
  return titled
}

function titleAudioWords(raw: string): string {
  const titled = raw
    .split(/\s+/)
    .map((w, i) => {
      let lower = w.toLocaleLowerCase('fr-FR')
      lower = AUDIO_WORD_ACCENTS[lower] ?? lower
      if (i > 0 && ['a', 'à', 'au', 'aux', 'de', 'des', 'du', 'en', 'et', 'l', 'la', 'le', 'les', 'un', 'une'].includes(lower)) {
        return lower === 'a' ? 'à' : lower
      }
      if (lower === 'l') return "l'"
      return lower.charAt(0).toLocaleUpperCase('fr-FR') + lower.slice(1)
    })
    .join(' ')
    .replace(/\bl'\s+/gi, "l'")
    .replace(/^A /, 'À ')
  return titled
}

/** Retire un éventuel suffixe numérique (« À l'aéroport - 2 » → « À l'aéroport »). */
function stripTrailingNumber(label: string): string {
  return label.replace(/\s*[-–]?\s*\d+$/u, '').trim() || label
}

/** Numéro implicite dans le nom de fichier (`a-l-aeroport-2`, `facile-a1__160`). */
function audioStemNumber(audio: string): number | null {
  const stem = audio.split('/').pop()?.replace(/\.mp3$/i, '') ?? ''
  const after = stem.includes('__') ? stem.split('__').slice(1).join('__') : stem
  const m = after.match(/-(\d+)(?:\.\d+)?$/u) || after.match(/^(\d+)$/u)
  return m ? Number(m[1]) : null
}

/** Chemins audio d’un exercice CO (un ou plusieurs). */
export function tcfExerciseAudios(ex: TcfExercise): string[] {
  const s = ex.support as { audio?: string; audios?: string[] }
  if (Array.isArray(s.audios)) return s.audios.map((a) => a.trim()).filter(Boolean)
  if (typeof s.audio === 'string' && s.audio.trim()) return [s.audio.trim()]
  return []
}

/** Libellé de base : scène / thème scénario, sinon nom dérivé du fichier. */
export function tcfAudioBaseLabel(exercise: TcfExercise, audio: string): string {
  const scene = exercise.scene?.trim()
  if (scene) return stripTrailingNumber(scene)
  return tcfAudioBaseFromPath(audio)
}

type RawAudioRow = {
  audio: string
  exercise: TcfExercise
  base: string
  stem: string
  tags: TcfAudioTag[]
  dialogueIndex?: number
  questionPool?: TcfQuestion[]
}

/** Questions liées à la piste `audioIndex` (1-based) d’un complet multi. */
function questionsForAudioIndex(exercise: TcfExercise, audioIndex: number, nAudios: number): TcfQuestion[] {
  const qs = exercise.questions ?? []
  const linked = qs.filter((q) => q.audio === audioIndex)
  if (linked.length > 0) return linked
  // 1 question par piste dans l’ordre, sans champ `audio`
  if (qs.length === nAudios && audioIndex >= 1 && audioIndex <= qs.length) {
    return [qs[audioIndex - 1]!]
  }
  return []
}

/** Tags explicites sur l’exercice (banque), fusionnés aux tags dérivés. */
function exerciseExtraTags(exercise: TcfExercise): TcfAudioTag[] {
  return tcfMergeAudioTags(exercise.tags)
}

/**
 * Pistes taguées court (1 Q) / moyen (2–4 Q) / long (≥ 5 Q) : mono complet,
 * ou chaque piste d’un multi qui a un pool de questions liées.
 * Les tags `exercise.tags` (ex. `scenario`) se cumulent.
 */
function taggedLengthAudioRows(exercise: TcfExercise): RawAudioRow[] {
  if (exercise.type_exercice !== 'complet') return []
  const extra = exerciseExtraTags(exercise)
  const support = exercise.support
  const multi = (support.audios ?? []).map((a) => a.trim()).filter(Boolean)
  if (multi.length >= 2) {
    const out: RawAudioRow[] = []
    const base = tcfAudioBaseLabel(exercise, multi[0]!)
    for (let i = 0; i < multi.length; i++) {
      const pool = questionsForAudioIndex(exercise, i + 1, multi.length)
      const tag = tcfTagForQuestionPoolSize(pool.length)
      if (!tag) continue
      const audio = multi[i]!
      const stem = audio.split('/').pop()?.replace(/\.mp3$/i, '') ?? audio
      out.push({
        audio,
        exercise,
        base: `${base} · extrait ${i + 1}`,
        stem,
        tags: tcfMergeAudioTags(extra, [tag]),
        dialogueIndex: i + 1,
        questionPool: pool,
      })
    }
    return out
  }
  const one = support.audio?.trim() || (multi.length === 1 ? multi[0]! : '')
  if (!one) return []
  const qs = exercise.questions ?? []
  const tag = tcfTagForQuestionPoolSize(qs.length)
  if (!tag) return []
  const stem = one.split('/').pop()?.replace(/\.mp3$/i, '') ?? one
  return [
    {
      audio: one,
      exercise,
      base: tcfAudioBaseLabel(exercise, one),
      stem,
      tags: tcfMergeAudioTags(extra, [tag]),
      dialogueIndex: 1,
      questionPool: qs,
    },
  ]
}

/**
 * Entrées audio issues d’un pack association : une entrée par dialogue découpé,
 * taguée `scenario`. Si la piste a un pool de questions (1 / 2–4 / ≥ 5), on
 * ajoute aussi `court` / `moyen` / `long` pour la rendre sélectionnable ailleurs.
 */
function associationScenarioRows(exercise: TcfExercise): RawAudioRow[] {
  if (!isTcfCoAssociation(exercise)) return []
  const audios = (exercise.support.audios ?? []).map((a) => a.trim()).filter(Boolean)
  if (audios.length < 2) return []
  const trs = tcfAssociationTranscriptions(exercise)
  const base = tcfAudioBaseLabel(exercise, audios[0]!)
  const extra = exerciseExtraTags(exercise)
  return audios.map((audio, i) => {
    const dialogueIndex = i + 1
    const stem = audio.split('/').pop()?.replace(/\.mp3$/i, '') ?? audio
    const tr = trs[i]?.trim()
    const pool = questionsForAudioIndex(exercise, dialogueIndex, audios.length)
    const lengthTag = tcfTagForQuestionPoolSize(pool.length)
    return {
      audio,
      exercise,
      base: `${base} · dialogue ${dialogueIndex}`,
      stem: tr ? `${stem} ${tr.slice(0, 80)}` : stem,
      tags: tcfMergeAudioTags(extra, [TCF_AUDIO_TAG_SCENARIO], lengthTag ? [lengthTag] : []),
      dialogueIndex,
      questionPool: pool.length > 0 ? pool : undefined,
    }
  })
}

/** Fusionne deux lignes pour le même chemin audio (tags cumulés, meilleur pool). */
function mergeAudioRows(a: RawAudioRow, b: RawAudioRow): RawAudioRow {
  const poolA = a.questionPool ?? []
  const poolB = b.questionPool ?? []
  const preferB = poolB.length > poolA.length
  const questionPool = preferB ? poolB : poolA.length > 0 ? poolA : undefined
  // Préférer l’exercice association pour le contexte scénario / situations.
  const exercise =
    isTcfCoAssociation(a.exercise) ? a.exercise : isTcfCoAssociation(b.exercise) ? b.exercise : a.exercise
  const tags = tcfMergeAudioTags(a.tags, b.tags)
  // Recaler le tag de longueur sur le pool conservé.
  const lengthTag = tcfTagForQuestionPoolSize(questionPool?.length ?? 0)
  const finalTags = lengthTag
    ? tcfMergeAudioTags(
        tags.filter(
          (t) =>
            t !== TCF_AUDIO_TAG_COURT && t !== TCF_AUDIO_TAG_MOYEN && t !== TCF_AUDIO_TAG_LONG,
        ),
        [lengthTag],
      )
    : tags
  return {
    audio: a.audio,
    exercise,
    base: tcfAudioHasTag(finalTags, TCF_AUDIO_TAG_SCENARIO)
      ? isTcfCoAssociation(a.exercise)
        ? a.base
        : isTcfCoAssociation(b.exercise)
          ? b.base
          : a.base
      : a.base,
    stem: a.stem.length >= b.stem.length ? a.stem : b.stem,
    tags: finalTags,
    dialogueIndex: a.dialogueIndex ?? b.dialogueIndex,
    questionPool,
  }
}

/** Index des audios de la banque : un chemin = une entrée, tags fusionnés. */
export function tcfAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  const byPath = new Map<string, RawAudioRow>()

  const upsert = (row: RawAudioRow) => {
    const prev = byPath.get(row.audio)
    byPath.set(row.audio, prev ? mergeAudioRows(prev, row) : row)
  }

  // 1) Dialogues association → tag scénario (+ court/moyen/long si pool de questions)
  for (const exercise of exercises) {
    for (const row of associationScenarioRows(exercise)) upsert(row)
  }

  // 2) Extraits « court » / « moyen » / « long » (fusionnent avec scénario si même chemin)
  for (const exercise of exercises) {
    for (const row of taggedLengthAudioRows(exercise)) upsert(row)
  }

  // 3) Audios « objets » (images à reconnaître)
  for (const exercise of exercises) {
    if (exercise.type_exercice !== 'images_a_reconnaitre') continue
    const audio = exercise.support.audio?.trim()
    if (!audio) continue
    const extra = exerciseExtraTags(exercise)
    const stem = audio.split('/').pop()?.replace(/\.mp3$/i, '') ?? audio
    upsert({
      audio,
      exercise,
      base: tcfAudioBaseLabel(exercise, audio),
      stem,
      tags: tcfMergeAudioTags(extra, [TCF_AUDIO_TAG_OBJET]),
      dialogueIndex: 1,
    })
  }

  // 4) Autres audios CO — chemins pas encore indexés
  for (const exercise of exercises) {
    if (isTcfCoAssociation(exercise) && (exercise.support.audios?.length ?? 0) >= 2) {
      continue
    }
    if (exercise.type_exercice === 'images_a_reconnaitre') continue
    const extra = exerciseExtraTags(exercise)
    for (const audio of tcfExerciseAudios(exercise)) {
      if (byPath.has(audio)) {
        if (extra.length) {
          const prev = byPath.get(audio)!
          byPath.set(audio, {
            ...prev,
            tags: tcfMergeAudioTags(prev.tags, extra),
          })
        }
        continue
      }
      const stem = audio.split('/').pop()?.replace(/\.mp3$/i, '') ?? audio
      byPath.set(audio, {
        audio,
        exercise,
        base: tcfAudioBaseLabel(exercise, audio),
        stem,
        tags: tcfMergeAudioTags(extra),
      })
    }
  }

  const raw = [...byPath.values()]

  const counts = new Map<string, number>()
  for (const row of raw) counts.set(row.base, (counts.get(row.base) ?? 0) + 1)

  // Ordre stable pour la numérotation : numéro de fichier puis chemin
  const byBase = new Map<string, typeof raw>()
  for (const row of raw) {
    const list = byBase.get(row.base) ?? []
    list.push(row)
    byBase.set(row.base, list)
  }
  for (const list of byBase.values()) {
    list.sort((a, b) => {
      const na = a.dialogueIndex ?? audioStemNumber(a.audio)
      const nb = b.dialogueIndex ?? audioStemNumber(b.audio)
      if (na != null && nb != null && na !== nb) return na - nb
      if (na != null && nb == null) return -1
      if (na == null && nb != null) return 1
      return a.audio.localeCompare(b.audio, 'fr')
    })
  }

  const out: TcfAudioEntry[] = []
  for (const row of raw) {
    const list = byBase.get(row.base)!
    const total = counts.get(row.base) ?? 1
    const index = list.indexOf(row) + 1
    // Les dialogues scénario / extraits court·moyen·long ont déjà « · dialogue/extrait N » dans base
    const label =
      tcfAudioHasTag(row.tags, TCF_AUDIO_TAG_SCENARIO) ||
      tcfAudioHasTag(row.tags, TCF_AUDIO_TAG_COURT) ||
      tcfAudioHasTag(row.tags, TCF_AUDIO_TAG_MOYEN) ||
      tcfAudioHasTag(row.tags, TCF_AUDIO_TAG_LONG) ||
      total <= 1
        ? row.base
        : `${row.base} ${index}`
    const tagBits = row.tags.length ? `tag:${row.tags.join(',')}` : ''
    out.push({
      audio: row.audio,
      exercise: row.exercise,
      label,
      meta: [
        row.exercise.theme,
        row.exercise.type_exercice,
        row.exercise.scenario,
        row.exercise.scene,
        tagBits,
        row.stem,
        row.exercise.id,
      ]
        .filter(Boolean)
        .join(' · '),
      tags: row.tags,
      dialogueIndex: row.dialogueIndex,
      questionPool: row.questionPool,
    })
  }
  return out.sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }))
}

/** Audios tagués `scenario` (petits dialogues d’association). */
export function tcfScenarioAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  return tcfAudioEntries(exercises).filter((e) => tcfAudioHasTag(e.tags, TCF_AUDIO_TAG_SCENARIO))
}

/** Audios tagués `court` (mini-extraits pour 6 audios courts), avec pool de questions. */
export function tcfCourtAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  return tcfAudioEntries(exercises).filter(
    (e) => tcfAudioHasTag(e.tags, TCF_AUDIO_TAG_COURT) && (e.questionPool?.length ?? 0) > 0,
  )
}

/** Audios tagués `moyen` (2–4 questions) pour « 3 audios moyens ». */
export function tcfMoyenAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  return tcfAudioEntries(exercises).filter(
    (e) => tcfAudioHasTag(e.tags, TCF_AUDIO_TAG_MOYEN) && (e.questionPool?.length ?? 0) >= 2,
  )
}

/** Audios tagués `long` (≥ 5 questions) pour l’audio complet CO ex. 3. */
export function tcfLongAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  return tcfAudioEntries(exercises).filter(
    (e) => tcfAudioHasTag(e.tags, TCF_AUDIO_TAG_LONG) && (e.questionPool?.length ?? 0) >= 5,
  )
}

/** Audios tagués `objet` (ex. 5 — images Oui / Non). */
export function tcfObjetAudioEntries(exercises: readonly TcfExercise[]): TcfAudioEntry[] {
  return tcfAudioEntries(exercises).filter((e) => tcfAudioHasTag(e.tags, TCF_AUDIO_TAG_OBJET))
}

/** Chemins des dialogues scénario (pour validation). */
export function tcfScenarioAudioPaths(exercises: readonly TcfExercise[]): Set<string> {
  return new Set(tcfScenarioAudioEntries(exercises).map((e) => e.audio))
}

/**
 * Remplace le contenu libre par celui de l’exercice banque lié à l’audio
 * (transcription, questions, thème…), en gardant l’id et le niveau courants.
 */
export function applyExerciseFromAudioBank(current: TcfExercise, source: TcfExercise): TcfExercise {
  const next = structuredClone(source)
  return {
    ...next,
    id: current.id,
    niveau: current.niveau,
  }
}

/**
 * Place un dialogue scénario découpé dans le créneau `slotIndex` (0-based)
 * d’un exercice association — sans remplacer tout le pack.
 */
export function applyAssociationDialogueSlot(
  current: TcfExercise,
  entry: TcfAudioEntry,
  slotIndex: number,
): TcfExercise {
  if (!isTcfCoAssociation(current)) return current
  const n = Math.max(current.support.nb_dialogues, slotIndex + 1)
  const audios = Array.from({ length: n }, (_, i) => current.support.audios?.[i] ?? '')
  const trsSource = Array.isArray(current.support.transcription)
    ? [...current.support.transcription]
    : [typeof current.support.transcription === 'string' ? current.support.transcription : '']
  while (trsSource.length < n) trsSource.push('')
  audios[slotIndex] = entry.audio
  const srcTrs = tcfAssociationTranscriptions(
    isTcfCoAssociation(entry.exercise) ? entry.exercise : (entry.exercise as never),
  )
  const fromEntry =
    entry.dialogueIndex != null ? srcTrs[entry.dialogueIndex - 1] : srcTrs[0]
  trsSource[slotIndex] = fromEntry?.trim() || trsSource[slotIndex] || ''

  // Image de situation liée au dialogue source, si présente
  let situations = current.situations.map((s) => ({ ...s }))
  if (isTcfCoAssociation(entry.exercise) && entry.dialogueIndex != null) {
    const srcSit = entry.exercise.situations.find((s) => s.dialogue === entry.dialogueIndex)
    if (srcSit?.image.trim()) {
      const targetDial = slotIndex + 1
      const hit = situations.findIndex((s) => s.dialogue === targetDial)
      if (hit >= 0) {
        situations[hit] = { ...situations[hit]!, image: srcSit.image }
      } else {
        const empty = situations.findIndex((s) => s.dialogue == null && !s.image.trim())
        if (empty >= 0) {
          situations[empty] = { ...situations[empty]!, image: srcSit.image, dialogue: targetDial }
        }
      }
    }
  }

  return {
    ...current,
    support: {
      ...current.support,
      audio: undefined,
      audios,
      nb_dialogues: n,
      transcription: trsSource,
    },
    situations,
  }
}
