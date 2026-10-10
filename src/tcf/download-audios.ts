/**
 * Téléchargement des audios d’une fiche TCF, avec nommage scolaire.
 * Ex. : TCF_A1-A2_CO_Exercice-1_26-27_Semestre-1.mp3
 *
 * Templates de noms : `@/francais/soutien/download-name`.
 */
import {
  tcfAnneeSemestre,
  tcfAudioDownloadName,
  tcfAudioFileBase as tcfAudioFileBaseShared,
} from '@/francais/soutien/download-name'
import { tcfAudioSequence, tcfAudioSrc } from './media'
import type { TcfCompetence, TcfExercise, TcfNiveau } from './types'

export { tcfAnneeSemestre, tcfAudioDownloadName } from '@/francais/soutien/download-name'

export function tcfAudioFileBase(opts: {
  niveau: TcfNiveau
  competence: TcfCompetence
  exerciseNo: number
  date?: Date
}): string {
  return tcfAudioFileBaseShared(opts)
}

/** Chemins audio (relatifs ou résolus) référencés par l’exercice. */
export function tcfExerciseAudioRefs(ex: TcfExercise): string[] {
  const audios: string[] = []
  switch (ex.type_exercice) {
    case 'images_a_reconnaitre':
    case 'complet':
    case 'association_images':
      if (ex.support.audio?.trim()) audios.push(ex.support.audio)
      break
    case 'six_courts':
    case 'trois_moyens':
      audios.push(...ex.support.audios.filter((a) => a.trim()))
      break
    case 'mots_theme':
    case 'dialogue':
      if (ex.support.audio?.trim()) audios.push(ex.support.audio)
      break
    default:
      break
  }
  return audios
}

/** URLs de fichiers MP3 à télécharger (séquences de nombres éclatées). */
export function tcfAudioDownloadUrls(refs: string[]): string[] {
  const urls: string[] = []
  for (const ref of refs) {
    const seq = tcfAudioSequence(ref)
    if (seq) urls.push(...seq)
    else {
      const src = tcfAudioSrc(ref)
      if (src) urls.push(src)
    }
  }
  return urls
}

async function downloadOne(url: string, filename: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Audio introuvable : ${url}`)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}

/** Télécharge les audios ; un seul fichier garde le nom de base, plusieurs sont suffixés. */
export async function downloadTcfAudios(opts: {
  niveau: TcfNiveau
  competence: TcfCompetence
  exerciseNo: number
  audioRefs: string[]
}): Promise<{ count: number; base: string }> {
  const urls = tcfAudioDownloadUrls(opts.audioRefs)
  const base = tcfAudioFileBase(opts)
  if (urls.length === 0) return { count: 0, base }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!
    const ext = url.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1] ?? 'mp3'
    const name = tcfAudioDownloadName({
      niveau: opts.niveau,
      competence: opts.competence,
      exerciseNo: opts.exerciseNo,
      audioIndex: i + 1,
      audioCount: urls.length,
      ext,
    })
    await downloadOne(url, name)
    // Laisse le navigateur enchaîner les téléchargements.
    if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 120))
  }
  return { count: urls.length, base }
}
