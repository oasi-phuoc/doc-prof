import {
  collectTcfAudioJobs,
  downloadTcfAudios,
  tcfAudioFamilyPrefix,
  tcfExerciseAudioRefs,
} from '@/tcf/download-audios'
import { tcfBank, tcfSlotBank } from '@/tcf/loader'
import { tcfSlotByTypeId, tcfTypeByTypeId } from '@/tcf/catalog'
import type { TcfCompetence, TcfExercise, TcfNiveau } from '@/tcf/types'
import {
  downloadTcmCfrAudios,
  tcmCfrAudioKindFromParts,
  type TcmCfrAudioKind,
  type TcmCfrAudioPlaylist,
} from '@/tcm-cfr/audio-nombres'
import { soutienBankById } from '@/francais/soutien/banks'
import {
  downloadSoutienEcouterAudio,
  SOUTIEN_LETTRES_PHRASE_CONSIGNE,
  SOUTIEN_SYLLABE_SON_CONSIGNE,
} from '@/francais/soutien/download-ecouter-audio'
import {
  downloadSoutienCompleterAudio,
  downloadSoutienMotsAudio,
} from '@/francais/soutien/download-mots-audio'
import {
  downloadSoutienType9Phrases,
  downloadSoutienType10Phrases,
  downloadSoutienType12Phrases,
  downloadSoutienType14Phrases,
} from '@/francais/soutien/download-phrases'
import { parseSoutienType } from '@/francais/soutien/kinds'
import {
  findSoutienByBankId,
  resolveSoutienSelection,
} from '@/francais/soutien/themes'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { resolveAlphaSelection } from '@/alphabetisation/themes'
import type { ExerciseBlock, WorksheetPage } from '@/math/types'
import { useEffect, useRef, useState } from 'react'
import type { AudioProgress } from '@/components/AudioProgressDialog'
import { downloadCscAudios } from '@/tcm-csc/audio'

export type UseGeneratorAudioParams = {
  activeBlock: ExerciseBlock
  activeSheet: WorksheetPage | undefined
  worksheets: WorksheetPage[]
  safeBlockIndex: number
  pageIndex: number
  firstExerciseNo: number
  tcfNiveau: TcfNiveau
  /** Domaine courant (`tcf`, `tpf`, `tcf-csc`, `tcf-cfr`) pour le préfixe TCF/TPF. */
  domain?: string
  /** Mots type 1 Soutien (fallback si la fiche n’a pas encore de tableau). */
  soutienType1Words: string[]
}

export function useGeneratorAudio({
  activeBlock,
  activeSheet,
  worksheets,
  safeBlockIndex,
  pageIndex,
  firstExerciseNo,
  tcfNiveau,
  domain,
  soutienType1Words,
}: UseGeneratorAudioParams) {
  const [audioProgress, setAudioProgress] = useState<AudioProgress | null>(null)
  const audioController = useRef<AbortController | null>(null)
  useEffect(() => () => audioController.current?.abort(), [])
  function cancelAudio() {
    audioController.current?.abort()
    audioController.current = null
    setAudioProgress(null)
  }
  async function runAudio(work: (options: { signal: AbortSignal; onProgress: (done: number, total: number) => void }) => Promise<unknown>) {
    if (audioController.current) return
    const controller = new AbortController()
    audioController.current = controller
    setAudioProgress({ value: 0, label: 'Compilation des audios…' })
    try {
      const result = await work({ signal: controller.signal, onProgress: (done, total) => {
        if (!controller.signal.aborted) setAudioProgress({ value: done / total * 90, label: 'Chargement et compilation des pistes…' })
      } })
      if (!controller.signal.aborted) setAudioProgress({ finished: true, value: 100, label: result === 0 ? 'Aucun audio disponible.' : 'Compilation terminée. Le fichier a été transmis au navigateur pour téléchargement.' })
    } catch (error) {
      if (!controller.signal.aborted) setAudioProgress({ finished: true, label: error instanceof Error ? error.message : 'Impossible de préparer les audios.' })
    } finally { if (audioController.current === controller) audioController.current = null }
  }
  const [cscAudioBusy, setCscAudioBusy] = useState(false), [cscAudioError, setCscAudioError] = useState('')
  async function downloadActiveTcmCscAudios() {
    if (cscAudioBusy) return
    setCscAudioBusy(true); setCscAudioError('')
    try { await runAudio(options => downloadCscAudios(worksheets, options)) }
    catch { setCscAudioError('Un audio n’a pas pu être préparé. Vérifiez la connexion et réessayez le téléchargement.') }
    finally { setCscAudioBusy(false) }
  }
  /** Exercice TCF courant (banque / édition) pour télécharger ses audios. */
  function currentTcfExercise(): TcfExercise | undefined {
    if (activeBlock.tcfExercise) return activeBlock.tcfExercise
    const support = activeSheet?.blocks[safeBlockIndex]?.items.find((item) => item.tcf?.kind === 'support')?.tcf
    if (support?.kind === 'support') return support.exercise
    const niveau = tcfNiveau
    const slot = tcfSlotByTypeId[activeBlock.exerciseType]
    const legacy = slot ? undefined : tcfTypeByTypeId[activeBlock.exerciseType]
    if (!slot && !legacy) return undefined
    const bank = slot
      ? tcfSlotBank(niveau, slot)
      : tcfBank(niveau, legacy!.competence, legacy!.typeExercice)
    const shownId =
      activeSheet?.blocks[safeBlockIndex]?.items.find((item) => item.tcfExerciseId)?.tcfExerciseId
    const id = activeBlock.tcfBankId ?? shownId
    return id ? bank.find((ex) => ex.id === id) : bank[0]
  }

  async function downloadActiveTcfAudios() {
    if (audioController.current) return
    const prefix = tcfAudioFamilyPrefix(domain)
    let jobs = collectTcfAudioJobs(worksheets)
    if (jobs.length === 0) {
      const ex = currentTcfExercise()
      if (!ex) return
      const refs = tcfExerciseAudioRefs(ex)
      if (refs.length === 0) return
      const exerciseNo =
        activeSheet?.blocks[safeBlockIndex]?.exerciseIndex ??
        activeBlock.exerciseNo ??
        pageIndex + 1
      jobs = [
        {
          niveau: ex.niveau,
          competence: ex.competence as TcfCompetence,
          exerciseNo,
          audioRefs: refs,
          exerciseId: ex.id,
          typeExercice: ex.type_exercice,
        },
      ]
    }
    const controller = new AbortController()
    audioController.current = controller
    setAudioProgress({ value: 0, label: 'Préparation des pistes…' })
    try {
      const result = await downloadTcfAudios({
        jobs,
        prefix,
        niveau: jobs[0]?.niveau ?? tcfNiveau,
      }, { signal: controller.signal, onProgress: (value, label) => {
        if (!controller.signal.aborted) setAudioProgress({ value, label })
      } })
      if (!controller.signal.aborted) setAudioProgress({ value: 100, finished: true,
        label: result.count ? 'Compilation terminée. Le fichier a été transmis au navigateur pour téléchargement.' : 'Aucun audio disponible.' })
    } catch (error) {
      if (!controller.signal.aborted) setAudioProgress({ finished: true, label: error instanceof Error ? error.message : 'La préparation audio a échoué.' })
    } finally {
      if (audioController.current === controller) audioController.current = null
    }
  }

  /** Playlists audio TCM CFR du test entier (nombres + multiplications). */
  function currentTcmCfrAudioPlaylists(): TcmCfrAudioPlaylist[] {
    return worksheets.flatMap((sheet) =>
      sheet.blocks.flatMap((block) => {
        const fromType: TcmCfrAudioKind | undefined =
          block.exerciseType === 'tcm-cfr-ex02'
            ? 'MULTIPLICATION'
            : block.exerciseType === 'tcm-cfr-ex01'
              ? 'NOMBRE'
              : undefined
        return block.items
          .map((item) => item.audioParts ?? (item.audioSrc ? [item.audioSrc] : []))
          .filter((parts): parts is string[] => parts.length > 0)
          .map((parts) => ({
            parts,
            kind: fromType ?? tcmCfrAudioKindFromParts(parts),
            exerciseNo: block.exerciseIndex > 0 ? block.exerciseIndex : undefined,
          }))
      }),
    )
  }

  async function downloadActiveTcmCfrAudios() {
    const playlists = currentTcmCfrAudioPlaylists()
    if (playlists.length === 0) return
    try {
      await runAudio(options => downloadTcmCfrAudios(playlists, options))
    } catch {
      // Échec réseau / fichier manquant : silencieux.
    }
  }

  /** Mots affichés du type 1 Soutien (pour l’audio téléchargeable). */
  function currentSoutienMotsWords(): string[] {
    const fromSheet =
      activeSheet?.blocks[safeBlockIndex]?.items.find((item) => item.layout === 'vocab-table')
        ?.vocabEntries ?? []
    const labels = fromSheet.map((e) => e.label.trim()).filter(Boolean)
    if (labels.length > 0) return labels
    if (activeBlock.soutienMotsLibre && activeBlock.soutienMotsEntries?.length) {
      return activeBlock.soutienMotsEntries.map((e) => e.label.trim()).filter(Boolean)
    }
    return soutienType1Words
  }

  /** Métadonnées pour le nom de fichier audio Soutien FR / Alphabétisation. */
  function soutienAudioFileMeta(): {
    themeLabel: string
    letterLabel: string
    exerciseNo: number
  } {
    const alphaSel = resolveAlphaSelection(activeBlock.topic, activeBlock.exerciseType)
    const sel =
      resolveSoutienSelection(activeBlock.topic, activeBlock.exerciseType) ??
      alphaSel ??
      (activeBlock.exerciseType
        ? (() => {
            const bankId =
              parseSoutienType(activeBlock.exerciseType)?.bankId ??
              parseAlphaType(activeBlock.exerciseType)?.bankId
            return bankId ? findSoutienByBankId(bankId) : null
          })()
        : null)
    const exerciseNo =
      activeSheet?.blocks[safeBlockIndex]?.exerciseIndex ??
      activeBlock.exerciseNo ??
      firstExerciseNo + safeBlockIndex
    return {
      themeLabel: sel?.theme.label ?? alphaSel?.theme.label ?? 'Soutien',
      letterLabel:
        sel?.letter.letterUpper ??
        sel?.letter.label ??
        alphaSel?.letter.letterUpper ??
        alphaSel?.letter.label ??
        'X',
      exerciseNo,
    }
  }

  async function downloadActiveSoutienMotsAudio() {
    const words = currentSoutienMotsWords()
    if (words.length === 0) return
    const meta = soutienAudioFileMeta()
    try {
      await runAudio(options => downloadSoutienMotsAudio({ words, ...meta }, options))
    } catch {
      // Échec réseau / fichier manquant : silencieux.
    }
  }

  /** Mots du type 5 (compléter) pour l’audio téléchargeable. */
  function currentSoutienCompleterWords(): string[] {
    const fromSheet =
      activeSheet?.blocks[safeBlockIndex]?.items.find(
        (item) => item.layout === 'syllable-complete',
      )?.syllableCompletes ?? []
    const labels = fromSheet.map((e) => e.word.trim()).filter(Boolean)
    if (labels.length > 0) return labels
    if (activeBlock.soutienCompleterLibre && activeBlock.soutienCompleterEntries?.length) {
      return activeBlock.soutienCompleterEntries.map((e) => e.word.trim()).filter(Boolean)
    }
    return []
  }

  async function downloadActiveSoutienCompleterAudio() {
    const words = currentSoutienCompleterWords()
    if (words.length === 0) return
    const meta = soutienAudioFileMeta()
    try {
      await runAudio(options => downloadSoutienCompleterAudio({ words, ...meta }, options))
    } catch {
      // Échec réseau / fichier manquant : silencieux.
    }
  }

  /** Mots + audios des types 6 / 7 / 8 pour la playlist téléchargeable. */
  function currentSoutienEcouterWords(): {
    words: string[]
    audioSrcs: string[]
  } {
    const blockItems = activeSheet?.blocks[safeBlockIndex]?.items ?? []
    const listen = blockItems.find((row) => row.layout === 'listen-check')
    if (listen) {
      const words = (listen.options ?? []).map((w) => w.trim()).filter(Boolean)
      const audioSrcs = (listen.optionAudioSrcs ?? []).map((src) => src ?? '')
      return { words, audioSrcs }
    }
    const syllabe = blockItems.find((row) => row.layout === 'syllable-sound')
    if (syllabe?.syllableSoundItems?.length) {
      const words = syllabe.syllableSoundItems.map((row) => row.word.trim()).filter(Boolean)
      const audioSrcs = syllabe.syllableSoundItems.map((row) => row.audioSrc ?? '')
      return { words, audioSrcs }
    }
    const phrase = blockItems.find((row) => row.layout === 'phrase-scramble')
    if (phrase?.phraseScrambles?.length) {
      const words = phrase.phraseScrambles.map((row) => row.word.trim()).filter(Boolean)
      const audioSrcs = phrase.phraseScrambles.map((row) => row.audioSrc ?? '')
      return { words, audioSrcs }
    }
    return { words: [], audioSrcs: [] }
  }

  async function downloadActiveSoutienEcouterAudio() {
    const { words, audioSrcs } = currentSoutienEcouterWords()
    if (words.length === 0) return
    const parsed =
      parseSoutienType(activeBlock.exerciseType) ?? parseAlphaType(activeBlock.exerciseType)
    const bankId = parsed?.bankId ?? 'ecouter'
    const bank = soutienBankById(bankId)
    const meta = soutienAudioFileMeta()
    const kind = parsed && 'kind' in parsed ? parsed.kind : undefined
    const consigneSrc =
      kind === 'syllabe-son' || kind === 'syllabe-son-qr'
        ? SOUTIEN_SYLLABE_SON_CONSIGNE
        : kind === 'lettres-phrase'
          ? SOUTIEN_LETTRES_PHRASE_CONSIGNE
          : undefined
    /** Types 6–8 : annoncer le son après la consigne ; type 9 = phrases seules. */
    const withSon = kind !== 'lettres-phrase'
    try {
      await runAudio(options => downloadSoutienEcouterAudio({
        words,
        audioSrcs,
        phoneme: withSon ? bank?.sound : undefined,
        consigneSrc,
        ...meta,
      }, options))
    } catch {
      // Échec réseau / fichier manquant : silencieux.
    }
  }

  function downloadActiveSoutienPhrases() {
    const parsed = parseSoutienType(activeBlock.exerciseType)
    if (!parsed) return
    const bank = soutienBankById(parsed.bankId)
    if (!bank) return
    if (parsed.kind === 'lettres-phrase') downloadSoutienType9Phrases(bank)
    else if (parsed.kind === 'determinants') downloadSoutienType10Phrases(bank)
    else if (parsed.kind === 'compter') downloadSoutienType12Phrases(bank)
    else if (parsed.kind === 'lire') downloadSoutienType14Phrases(bank)
  }

  return {
    audioProgress, cancelAudio,
    downloadActiveTcmCscAudios, cscAudioBusy, cscAudioError,
    downloadActiveTcfAudios,
    downloadActiveTcmCfrAudios,
    downloadActiveSoutienMotsAudio,
    downloadActiveSoutienCompleterAudio,
    downloadActiveSoutienEcouterAudio,
    downloadActiveSoutienPhrases,
  }
}
