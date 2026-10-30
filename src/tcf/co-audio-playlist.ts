/**
 * Playlists CO CSC : consignes orales + son-mélodie + battements / pauses
 * + annonces « Audio n° » + documents tirés (2 écoutes).
 *
 * Assets : `public/lib/audio/tcf/consignes/`.
 */
import { tcfAudioSrc } from './media'
import type { TcfTypeExercice } from './types'

const DIR = '/lib/audio/tcf/consignes'

/** Son-mélodie avant chaque écoute (bip d’annonce). */
export const TCF_SON_MELODIE = `${DIR}/bip-d-annonce.mp3`

export const TCF_EX1_INTRO = `${DIR}/ex1-intro.mp3`
export const TCF_EX2_INTRO = `${DIR}/ex2-intro.mp3`
export const TCF_EX3_INTRO = `${DIR}/ex3-intro.mp3`
export const TCF_EX4_INTRO = `${DIR}/ex4-intro.mp3`
export const TCF_EX5_INTRO = `${DIR}/ex5-intro.mp3`

export const TCF_EX1_LISEZ = `${DIR}/ex1-lisez.mp3`
export const TCF_EX3_LISEZ = `${DIR}/ex3-lisez.mp3`

export function tcfAudioNumeroSrc(n: number): string {
  const i = Math.max(1, Math.min(6, Math.round(n)))
  return `${DIR}/audio-numero-${i}.mp3`
}

export function tcfSilenceSrc(seconds: 15 | 25 | 30): string {
  return `${DIR}/silence-${seconds}s.mp3`
}

export function tcfBattementSrc(seconds: 25 | 30): string {
  return `${DIR}/battement-${seconds}s.mp3`
}

function docUrl(ref: string): string {
  return tcfAudioSrc(ref) || ref.trim()
}

/**
 * Ex. 1 (6 docs) / Ex. 2 (3 docs) :
 * intro → mélodie (démo) → « Lisez… » → battement 25 s →
 * pour chaque doc × 2 : mélodie → Audio n° → document → silence 15 s.
 */
export function buildCoMultiDocsPlaylist(docs: readonly string[], variant: 1 | 2): string[] {
  const intro = variant === 1 ? TCF_EX1_INTRO : TCF_EX2_INTRO
  const urls: string[] = [intro, TCF_SON_MELODIE, TCF_EX1_LISEZ, tcfBattementSrc(25)]
  for (let i = 0; i < docs.length; i++) {
    const doc = docUrl(docs[i]!)
    if (!doc) continue
    const n = i + 1
    for (let listen = 0; listen < 2; listen++) {
      urls.push(TCF_SON_MELODIE, tcfAudioNumeroSrc(n), doc, tcfSilenceSrc(15))
    }
  }
  return urls
}

/**
 * Ex. 3 (1 doc long) :
 * intro → mélodie → « Lisez… » → battement 30 s →
 * 2× (mélodie → Audio n° 1 → document → silence 30 s).
 */
export function buildCoLongPlaylist(doc: string): string[] {
  const src = docUrl(doc)
  if (!src) return [TCF_EX3_INTRO, TCF_SON_MELODIE, TCF_EX3_LISEZ, tcfBattementSrc(30)]
  return [
    TCF_EX3_INTRO,
    TCF_SON_MELODIE,
    TCF_EX3_LISEZ,
    tcfBattementSrc(30),
    TCF_SON_MELODIE,
    tcfAudioNumeroSrc(1),
    src,
    tcfSilenceSrc(30),
    TCF_SON_MELODIE,
    tcfAudioNumeroSrc(1),
    src,
    tcfSilenceSrc(30),
  ]
}

/**
 * Ex. 4 (4 dialogues / situations) :
 * intro → silence 30 s → mélodie →
 * tour 1 : Audio n° 1…4 + doc + 15 s →
 * mélodie → tour 2 identique.
 */
export function buildCoAssociationPlaylist(docs: readonly string[]): string[] {
  const urls: string[] = [TCF_EX4_INTRO, tcfSilenceSrc(30), TCF_SON_MELODIE]
  const pushRound = () => {
    for (let i = 0; i < docs.length; i++) {
      const doc = docUrl(docs[i]!)
      if (!doc) continue
      urls.push(tcfAudioNumeroSrc(i + 1), doc, tcfSilenceSrc(15))
    }
  }
  pushRound()
  urls.push(TCF_SON_MELODIE)
  pushRound()
  return urls
}

/**
 * Ex. 5 (objets / images à reconnaître) :
 * intro → silence 15 s → mélodie → message → mélodie → message.
 */
export function buildCoObjetsPlaylist(doc: string): string[] {
  const src = docUrl(doc)
  const urls: string[] = [TCF_EX5_INTRO, tcfSilenceSrc(15)]
  if (!src) return urls
  urls.push(TCF_SON_MELODIE, src, TCF_SON_MELODIE, src)
  return urls
}

/** Construit la playlist groupée selon le type d’exercice CO. */
export function buildTcfCoPlaylist(
  typeExercice: TcfTypeExercice | undefined,
  audioRefs: readonly string[],
): string[] {
  const docs = audioRefs.map((r) => r.trim()).filter(Boolean)
  switch (typeExercice) {
    case 'six_courts':
      return buildCoMultiDocsPlaylist(docs.slice(0, 6), 1)
    case 'trois_moyens':
      return buildCoMultiDocsPlaylist(docs.slice(0, 3), 2)
    case 'complet':
      return buildCoLongPlaylist(docs[0] ?? '')
    case 'association_images':
      return buildCoAssociationPlaylist(docs.slice(0, 4))
    case 'images_a_reconnaitre':
      return buildCoObjetsPlaylist(docs[0] ?? '')
    default:
      return docs.map(docUrl).filter(Boolean)
  }
}
