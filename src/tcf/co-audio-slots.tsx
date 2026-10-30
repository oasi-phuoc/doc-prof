/**
 * Paramètres CO ex. 1 / 2 / 3 / 4 : N listes déroulantes d’audios tagués
 * (court × 6, moyen × 3, long × 1, scenario × 4), regroupés par scénario.
 */
import { useMemo } from 'react'
import {
  tcfCourtAudioEntries,
  tcfLongAudioEntries,
  tcfMoyenAudioEntries,
  tcfScenarioAudioEntries,
  type TcfAudioEntry,
} from './audio-bank'
import { TCF_SCENARIOS, TCF_SCENARIO_AUTRE, tcfSlotByTypeId } from './catalog'
import { tcfBankAllLevels } from './loader'
import { tcfGroupId, tcfScene } from './sources'
import { TCF_LONG_DEFAULT_QUESTIONS } from './draw-series'
import type { TcfNiveau } from './types'

export type TcfCoAudioSlotCount = 6 | 3 | 1 | 4

export function tcfCoAudioSlotCount(typeId: string): TcfCoAudioSlotCount | null {
  const slot = tcfSlotByTypeId[typeId]
  if (slot?.competence !== 'CO' || slot.numero == null) return null
  if (slot.numero === 1) return 6
  if (slot.numero === 2) return 3
  if (slot.numero === 3) return 1
  if (slot.numero === 4) return 4
  return null
}

/** Nombre de lignes « points » en mode éval (questions ou images). */
export function tcfCoComposeQuestionCount(
  typeId: string,
  questionCount: number | undefined,
): number {
  const n = tcfCoAudioSlotCount(typeId)
  if (n === 6) return 6
  if (n === 3) return 6
  if (n === 1) return Math.max(1, Math.min(20, questionCount ?? TCF_LONG_DEFAULT_QUESTIONS))
  if (n === 4) return 6 // 4 audios + 2 leurres → 6 images
  return 0
}

/** Libellé d’une ligne de points (question vs image d’association). */
export function tcfCoPointsRowLabel(typeId: string, index: number): string {
  return tcfCoAudioSlotCount(typeId) === 4 ? `Image ${index + 1}` : `Question ${index + 1}`
}

function poolForSlots(slotCount: TcfCoAudioSlotCount): TcfAudioEntry[] {
  const all = tcfBankAllLevels('CO')
  if (slotCount === 6) return tcfCourtAudioEntries(all)
  if (slotCount === 3) return tcfMoyenAudioEntries(all)
  if (slotCount === 4) return tcfScenarioAudioEntries(all)
  return tcfLongAudioEntries(all)
}

function scenarioLabel(id: string): string {
  return TCF_SCENARIOS.find((s) => s.id === id)?.label ?? TCF_SCENARIO_AUTRE.label
}

function entryOptionLabel(entry: TcfAudioEntry): string {
  // Préférer la scène / libellé déjà numéroté de la banque audio
  const scene = tcfScene(entry.exercise)
  if (scene && scene !== entry.label) return entry.label
  return entry.label
}

type AudioOptGroup = { id: string; label: string; items: TcfAudioEntry[] }

function groupByScenario(entries: TcfAudioEntry[]): AudioOptGroup[] {
  const order = [...TCF_SCENARIOS.map((s) => s.id), TCF_SCENARIO_AUTRE.id]
  const buckets = new Map<string, TcfAudioEntry[]>()
  for (const entry of entries) {
    const id = tcfGroupId(entry.exercise)
    const list = buckets.get(id) ?? []
    list.push(entry)
    buckets.set(id, list)
  }
  for (const list of buckets.values()) {
    list.sort((a, b) => entryOptionLabel(a).localeCompare(entryOptionLabel(b), 'fr', { numeric: true }))
  }
  return order
    .filter((id) => (buckets.get(id)?.length ?? 0) > 0)
    .map((id) => ({
      id,
      label: scenarioLabel(id),
      items: buckets.get(id)!,
    }))
}

export function TcfCoAudioSlotsPicker({
  typeId,
  niveau: _niveau,
  slots,
  questionCount,
  onChange,
}: {
  typeId: string
  niveau: TcfNiveau
  slots?: Array<string | undefined>
  questionCount?: number
  onChange: (patch: {
    tcfAudioSlots?: Array<string | undefined>
    tcfQuestionCount?: number
    tcfExercise?: undefined
    tcfBankId?: undefined
    contentSeed?: number
  }) => void
}) {
  const slotCount = tcfCoAudioSlotCount(typeId)
  const pool = useMemo(() => (slotCount ? poolForSlots(slotCount) : []), [slotCount])
  const groups = useMemo(() => groupByScenario(pool), [pool])

  if (!slotCount || pool.length === 0) return null

  const current = Array.from({ length: slotCount }, (_, i) => slots?.[i] ?? '')

  const setSlot = (index: number, value: string) => {
    const next = [...current]
    next[index] = value
    onChange({
      tcfAudioSlots: next.map((v) => v || undefined),
      tcfExercise: undefined,
      tcfBankId: undefined,
      contentSeed: Date.now() % 1_000_000_000,
    })
  }

  return (
    <div className="quad-libre-block tcf-editor tcf-co-audio-slots">
      {current.map((value, i) => (
        <label className="tcf-field" key={`audio-slot-${i}`}>
          <span>
            {slotCount === 1 ? 'Audio' : slotCount === 4 ? `Audio scénario ${i + 1}` : `Audio ${i + 1}`}
          </span>
          <select
            className="pill-input"
            value={value}
            onChange={(event) => setSlot(i, event.target.value)}
          >
            <option value="">Tout</option>
            {groups.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.items.map((entry) => (
                  <option key={entry.audio} value={entry.audio}>
                    {entryOptionLabel(entry)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      ))}
      {slotCount === 1 ? (
        <label className="tcf-field">
          <span>Nombre de questions</span>
          <input
            className="pill-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            step={1}
            value={questionCount ?? TCF_LONG_DEFAULT_QUESTIONS}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(1, Math.min(20, Math.round(raw)))
              onChange({
                tcfQuestionCount: next,
                tcfExercise: undefined,
                tcfBankId: undefined,
                contentSeed: Date.now() % 1_000_000_000,
              })
            }}
          />
          <small className="muted">Défaut {TCF_LONG_DEFAULT_QUESTIONS} ; tirées du pool de l’audio.</small>
        </label>
      ) : null}
    </div>
  )
}
