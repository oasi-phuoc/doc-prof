import { VERBES } from './phrase-banks'

/** Personne verbale pour l’accord du verbe (on → il ; elle → il ; elles → ils). */
export type VerbPerson = 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils'

const FORM_KEY: Record<VerbPerson, 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils'> = {
  je: 'je',
  tu: 'tu',
  il: 'il',
  nous: 'nous',
  vous: 'vous',
  ils: 'ils',
}

function startsWithVowelSound(word: string): boolean {
  return /^[aeiouhâàâäéèêëîïôöùûüœ]/i.test(word)
}

/** Infinitif nu (sans se / s’). */
export function baseInfinitive(frameId: string): string {
  if (frameId.startsWith("s'") || frameId.startsWith('s’')) return frameId.slice(2)
  if (frameId.startsWith('se ')) return frameId.slice(3)
  return frameId
}

export function isReflexiveFrame(frameId: string): boolean {
  return (
    frameId.startsWith("s'") ||
    frameId.startsWith('s’') ||
    frameId.startsWith('se ')
  )
}

function lookupTable(infinitive: string, person: VerbPerson): string | null {
  const entry = VERBES.find((item) => item.infinitive === infinitive)
  if (!entry) return null
  return entry.forms[FORM_KEY[person]]
}

/** Conjugaison régulière 1er groupe à partir de l’infinitif + forme 3e sg du modèle. */
function conjugateEr(infinitive: string, person: VerbPerson, form3sg: string): string {
  if (person === 'il' || person === 'je') return form3sg
  if (person === 'tu') return /[sxz]$/i.test(form3sg) ? form3sg : `${form3sg}s`
  const stem = infinitive.slice(0, -2)
  if (person === 'nous') {
    if (stem.endsWith('g')) return `${stem}eons`
    if (stem.endsWith('c')) return `${stem.slice(0, -1)}çons`
    return `${stem}ons`
  }
  if (person === 'vous') return `${stem}ez`
  return `${stem}ent`
}

/** 2e groupe type finir / choisir (3e sg en -it). */
function conjugateIr2(stem: string, person: VerbPerson, form3sg: string): string {
  if (person === 'il') return form3sg
  if (person === 'je' || person === 'tu') return `${stem}is`
  if (person === 'nous') return `${stem}issons`
  if (person === 'vous') return `${stem}issez`
  return `${stem}issent`
}

/** Verbes en -dre (vendre, attendre…) hors -indre / -oudre. */
function conjugateDre(stem: string, person: VerbPerson, form3sg: string): string {
  if (person === 'il') return form3sg
  if (person === 'je' || person === 'tu') return `${stem}ds`
  if (person === 'nous') return `${stem}dons`
  if (person === 'vous') return `${stem}dez`
  return `${stem}dent`
}

/**
 * Forme conjuguée du verbe (sans pronom réfléchi).
 * `form3sg` = noyau déjà présent dans le modèle (ex. mange, occupe, cache).
 */
export function conjugateCore(
  frameId: string,
  person: VerbPerson,
  form3sg: string,
): string | null {
  const infinitive = baseInfinitive(frameId)
  const fromTable = lookupTable(infinitive, person)
  if (fromTable) return fromTable

  if (infinitive === 'aller') return null

  if (infinitive.endsWith('er')) {
    return conjugateEr(infinitive, person, form3sg)
  }

  if (infinitive.endsWith('ir') && form3sg.endsWith('it') && !form3sg.endsWith('ait')) {
    const stem = infinitive.slice(0, -2)
    return conjugateIr2(stem, person, form3sg)
  }

  if (
    infinitive.endsWith('dre') &&
    !infinitive.endsWith('indre') &&
    !infinitive.endsWith('oudre') &&
    !infinitive.endsWith('aitre') &&
    !infinitive.endsWith('aître')
  ) {
    const stem = infinitive.slice(0, -3)
    return conjugateDre(stem, person, form3sg)
  }

  // Irreguliers hors table : seulement 3e personne (il / elle / on).
  if (person === 'il') return form3sg
  return null
}

export function canConjugatePerson(frameId: string, person: VerbPerson, form3sg: string): boolean {
  return conjugateCore(frameId, person, form3sg) !== null
}

const REFL_PREFIX: Record<VerbPerson, string> = {
  je: 'me',
  tu: 'te',
  il: 'se',
  nous: 'nous',
  vous: 'vous',
  ils: 'se',
}

function withReflexive(person: VerbPerson, core: string): string {
  const prefix = REFL_PREFIX[person]
  if (prefix === 'nous' || prefix === 'vous') return `${prefix}_${core}`
  if (startsWithVowelSound(core)) {
    const elided = person === 'je' ? 'm’' : person === 'tu' ? 't’' : 's’'
    return `${elided}${core}`
  }
  return `${prefix}_${core}`
}

/** Extrait le noyau 3e sg d’un jeton verbe du modèle (s’occupe → occupe, se_cache → cache). */
export function verbCoreFromToken(text: string): { reflexive: boolean; core: string } {
  if (text.startsWith("s'") || text.startsWith('s’')) {
    return { reflexive: true, core: text.slice(2) }
  }
  if (text.startsWith('se_')) return { reflexive: true, core: text.slice(3) }
  if (text.startsWith('me_') || text.startsWith('te_')) {
    return { reflexive: true, core: text.slice(3) }
  }
  if (text.startsWith('nous_') || text.startsWith('vous_')) {
    return { reflexive: true, core: text.slice(5) }
  }
  if (text.startsWith("m'") || text.startsWith('m’') || text.startsWith("t'") || text.startsWith('t’')) {
    return { reflexive: true, core: text.slice(2) }
  }
  return { reflexive: false, core: text }
}

/**
 * Remplace le premier verbe d’un prédicat étiqueté par la forme conjuguée.
 * Retourne null si la personne n’est pas disponible pour ce verbe.
 */
export function conjugateTaggedPred(
  pred: string,
  frameId: string,
  person: VerbPerson,
): string | null {
  const parts = pred.split(/\s+/)
  const index = parts.findIndex((part) => part.endsWith('/verbe'))
  if (index < 0) return pred
  const raw = parts[index]!.slice(0, parts[index]!.lastIndexOf('/'))
  const parsed = verbCoreFromToken(raw)
  const conjugated = conjugateCore(frameId, person, parsed.core)
  if (!conjugated) return null
  const needsRefl = parsed.reflexive || isReflexiveFrame(frameId)
  const next = needsRefl ? withReflexive(person, conjugated) : conjugated
  const nextParts = [...parts]
  nextParts[index] = `${next}/verbe`
  return nextParts.join(' ')
}

/** Pronom sujet Je → J’ devant un verbe à initiale vocalique (pas devant me / te). */
export function elideJeSubject(subjectTagged: string, pred: string): string {
  if (!subjectTagged.startsWith('Je/')) return subjectTagged
  const first = pred.trim().split(/\s+/)[0] ?? ''
  const verbText = first.includes('/') ? first.slice(0, first.lastIndexOf('/')) : first
  if (verbText.startsWith('me') || verbText.startsWith('te') || verbText.startsWith('nous') || verbText.startsWith('vous')) {
    return subjectTagged
  }
  const core = verbCoreFromToken(verbText).core
  if (startsWithVowelSound(core) || startsWithVowelSound(verbText)) {
    return 'J’/pronom'
  }
  return subjectTagged
}
