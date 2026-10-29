/**
 * Téléchargement des audios d’une fiche TPF / TCF.
 * Tous les MP3 de la fiche (4–5 pour un test CO) partent dans un ZIP,
 * pour que le navigateur ne bloque pas le 2ᵉ fichier.
 *
 * Templates de noms : `@/francais/soutien/download-name`.
 */
import {
  tcfAudioDownloadName,
  tcfAudioFileBase as tcfAudioFileBaseShared,
  tcfAudioZipDownloadName,
  type TcfAudioFamilyPrefix,
} from '@/francais/soutien/download-name'
import { zipStoreBlob } from '@/lib/zip-store'
import { tcfAssociationAudioRefs } from './association-audio'
import { tcfCompletAudioRefs } from './complet-audio'
import { tcfExerciseById } from './loader'
import { tcfAudioSequence, tcfAudioSrc } from './media'
import type { TcfCompetence, TcfExercise, TcfNiveau } from './types'

export {
  tcfAnneeSemestre,
  tcfAudioDownloadName,
  tcfAudioFamilyPrefix,
  tcfAudioZipDownloadName,
} from '@/francais/soutien/download-name'

export function tcfAudioFileBase(opts: {
  niveau: TcfNiveau
  competence: TcfCompetence
  exerciseNo: number
  date?: Date
  prefix?: TcfAudioFamilyPrefix
}): string {
  return tcfAudioFileBaseShared(opts)
}

/** Chemins audio (relatifs ou résolus) référencés par l’exercice. */
export function tcfExerciseAudioRefs(ex: TcfExercise): string[] {
  const audios: string[] = []
  switch (ex.type_exercice) {
    case 'images_a_reconnaitre':
      if (ex.support.audio?.trim()) audios.push(ex.support.audio)
      break
    case 'association_images':
      audios.push(...tcfAssociationAudioRefs(ex))
      break
    case 'complet':
      audios.push(...tcfCompletAudioRefs(ex))
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

export type TcfAudioJob = {
  niveau: TcfNiveau
  competence: TcfCompetence
  exerciseNo: number
  audioRefs: string[]
  exerciseId?: string
}

type TcfAudioItemSource = {
  tcf?: { kind?: string; exercise?: TcfExercise }
  tcfExerciseId?: string
}

export function tcfExerciseFromItems(items: readonly TcfAudioItemSource[]): TcfExercise | undefined {
  for (const item of items) {
    const tcf = item.tcf
    if (tcf?.kind === 'support' && tcf.exercise) return tcf.exercise
  }
  const id = items.find((item) => item.tcfExerciseId)?.tcfExerciseId
  return tcfExerciseById(id)
}

type CorrigeAudioItem = TcfAudioItemSource & {
  audioSrc?: string
  audioParts?: string[]
  vocabEntries?: Array<{ audioSrc?: string }>
  syllableCompletes?: Array<{ audioSrc?: string }>
  syllablePronounceRows?: Array<{ audioSrc?: string }>
  syllableSoundItems?: Array<{ audioSrc?: string }>
  phraseScrambles?: Array<{ audioSrc?: string }>
  audioMatchRows?: Array<{ audioSrc?: string }>
  audioOrder?: { clips?: Array<{ audioSrc?: string }> }
}

/**
 * Audios à coller à droite du titre « Exercice N » sur le corrigé
 * (support TCF, document, items, QRs soutien / alphabétisation).
 */
export function collectCorrigeAudioSrcs(
  items: readonly CorrigeAudioItem[],
  documentAudioSrc?: string | null,
): string[] {
  const out: string[] = []
  const push = (raw?: string | null) => {
    const src = raw?.trim()
    if (!src) return
    const resolved = tcfAudioSrc(src) || src
    if (resolved && !out.includes(resolved)) out.push(resolved)
  }
  push(documentAudioSrc)
  for (const item of items) {
    push(item.audioSrc)
    for (const part of item.audioParts ?? []) push(part)
    for (const row of item.vocabEntries ?? []) push(row.audioSrc)
    for (const row of item.syllableCompletes ?? []) push(row.audioSrc)
    for (const row of item.syllablePronounceRows ?? []) push(row.audioSrc)
    for (const row of item.syllableSoundItems ?? []) push(row.audioSrc)
    for (const row of item.phraseScrambles ?? []) push(row.audioSrc)
    for (const row of item.audioMatchRows ?? []) push(row.audioSrc)
    for (const clip of item.audioOrder?.clips ?? []) push(clip.audioSrc)
    const tcf = item.tcf
    if (tcf?.kind === 'support' && tcf.exercise) {
      for (const ref of tcfExerciseAudioRefs(tcf.exercise)) push(ref)
    }
  }
  if (out.length === 0) {
    const ex = tcfExerciseFromItems(items)
    if (ex) for (const ref of tcfExerciseAudioRefs(ex)) push(ref)
  }
  return out
}

/** Exercices audio de toutes les feuilles (test entier : 4–5 CO typiquement). */
export function collectTcfAudioJobs(
  sheets: readonly { blocks: readonly { exerciseIndex?: number; items: readonly TcfAudioItemSource[] }[] }[],
): TcfAudioJob[] {
  const jobs: TcfAudioJob[] = []
  const seen = new Set<string>()
  for (const sheet of sheets) {
    for (const block of sheet.blocks) {
      const ex = tcfExerciseFromItems(block.items)
      if (!ex) continue
      const audioRefs = tcfExerciseAudioRefs(ex)
      if (audioRefs.length === 0) continue
      const key = ex.id || audioRefs.join('|')
      if (seen.has(key)) continue
      seen.add(key)
      jobs.push({
        niveau: ex.niveau,
        competence: ex.competence,
        exerciseNo: block.exerciseIndex && block.exerciseIndex > 0 ? block.exerciseIndex : jobs.length + 1,
        audioRefs,
        exerciseId: ex.id,
      })
    }
  }
  return jobs
}

export type TcfNamedAudio = {
  name: string
  url: string
}

/** Liste des fichiers à mettre dans le ZIP (sans fetch). */
export function listTcfAudioDownloadFiles(
  jobs: readonly TcfAudioJob[],
  prefix: TcfAudioFamilyPrefix = 'TCF',
  date?: Date,
): TcfNamedAudio[] {
  const files: TcfNamedAudio[] = []
  const used = new Set<string>()
  for (const job of jobs) {
    const urls = tcfAudioDownloadUrls(job.audioRefs)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]!
      const ext = url.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1] ?? 'mp3'
      let name = tcfAudioDownloadName({
        prefix,
        niveau: job.niveau,
        competence: job.competence,
        exerciseNo: job.exerciseNo,
        audioIndex: i + 1,
        audioCount: urls.length,
        ext,
        date,
      })
      if (used.has(name)) {
        const stem = name.replace(/\.[^.]+$/, '')
        name = `${stem}_${used.size + 1}.${ext}`
      }
      used.add(name)
      files.push({ name, url })
    }
  }
  return files
}

async function fetchAudioBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Audio introuvable : ${url}`)
  return res.blob()
}

async function downloadBlob(blob: Blob, filename: string) {
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

export type DownloadTcfAudiosOpts = {
  niveau: TcfNiveau
  competence: TcfCompetence
  exerciseNo: number
  audioRefs: string[]
  prefix?: TcfAudioFamilyPrefix
  date?: Date
}

/** Télécharge les audios d’un exercice, ou d’une liste de jobs (fiche / test). */
export async function downloadTcfAudios(
  opts: DownloadTcfAudiosOpts | {
    jobs: readonly TcfAudioJob[]
    prefix?: TcfAudioFamilyPrefix
    niveau?: string
    date?: Date
  },
): Promise<{ count: number; base: string }> {
  const prefix = opts.prefix ?? 'TCF'
  const date = 'date' in opts ? opts.date : undefined
  const jobs: TcfAudioJob[] =
    'jobs' in opts
      ? [...opts.jobs]
      : [
          {
            niveau: opts.niveau,
            competence: opts.competence,
            exerciseNo: opts.exerciseNo,
            audioRefs: opts.audioRefs,
          },
        ]
  const files = listTcfAudioDownloadFiles(jobs, prefix, date)
  const zipNiveau = ('jobs' in opts ? opts.niveau : undefined) ?? jobs[0]?.niveau ?? 'NIVEAU'
  const base = tcfAudioZipDownloadName({ prefix, niveau: zipNiveau, date })
  if (files.length === 0) return { count: 0, base }

  const packed: { name: string; blob: Blob }[] = []
  for (const file of files) {
    try {
      packed.push({ name: file.name, blob: await fetchAudioBlob(file.url) })
    } catch {
      // Fichier manquant : on continue les autres.
    }
  }
  if (packed.length === 0) return { count: 0, base }
  if (packed.length === 1) {
    await downloadBlob(packed[0]!.blob, packed[0]!.name)
    return { count: 1, base: packed[0]!.name }
  }
  const zip = await zipStoreBlob(packed.map((file) => ({ name: file.name, data: file.blob })))
  await downloadBlob(zip, base)
  return { count: packed.length, base }
}
