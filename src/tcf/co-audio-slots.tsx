/**
 * Paramètres CO ex. 1–5 : tirage Aléatoire (tag de l’exercice) ou Libre
 * (listes déroulantes filtrées sur le même tag).
 */
import { useMemo } from 'react'
import {
  tcfCourtAudioEntries,
  tcfLongAudioEntries,
  tcfMoyenAudioEntries,
  tcfObjetAudioEntries,
  tcfScenarioAudioEntries,
  type TcfAudioEntry,
} from './audio-bank'
import { TCF_SCENARIOS, TCF_SCENARIO_AUTRE, tcfSlotByTypeId } from './catalog'
import { tcfBankAllLevels } from './loader'
import { tcfGroupId, tcfScene } from './sources'
import { TCF_LONG_DEFAULT_QUESTIONS } from './draw-series'
import type { TcfNiveau } from './types'

export type TcfCoAudioKind = 'court' | 'moyen' | 'long' | 'scenario' | 'objet'

export type TcfCoAudioSlotCount = 6 | 3 | 1 | 4

/** Tag / pool audio lié à l’emplacement CO (ou type catalogue legacy). */
export function tcfCoAudioKind(typeId: string): TcfCoAudioKind | null {
  const slot = tcfSlotByTypeId[typeId]
  if (slot?.competence === 'CO' && slot.numero != null) {
    if (slot.numero === 1) return 'court'
    if (slot.numero === 2) return 'moyen'
    if (slot.numero === 3) return 'long'
    if (slot.numero === 4) return 'scenario'
    if (slot.numero === 5) return 'objet'
  }
  if (typeId === 'tcf-co-six-courts') return 'court'
  if (typeId === 'tcf-co-trois-moyens') return 'moyen'
  if (typeId === 'tcf-co-complet') return 'long'
  if (typeId === 'tcf-co-association') return 'scenario'
  if (typeId === 'tcf-co-images') return 'objet'
  return null
}

export function tcfCoAudioSlotCount(typeId: string): TcfCoAudioSlotCount | null {
  const kind = tcfCoAudioKind(typeId)
  if (kind === 'court') return 6
  if (kind === 'moyen') return 3
  if (kind === 'long' || kind === 'objet') return 1
  if (kind === 'scenario') return 4
  return null
}

/** Nombre de lignes « points » en mode éval (questions ou images). */
export function tcfCoComposeQuestionCount(
  typeId: string,
  questionCount: number | undefined,
): number {
  const kind = tcfCoAudioKind(typeId)
  if (kind === 'court') return 6
  if (kind === 'moyen') return 6
  if (kind === 'long') return Math.max(1, Math.min(20, questionCount ?? TCF_LONG_DEFAULT_QUESTIONS))
  if (kind === 'scenario') return 6 // 4 audios + 2 leurres → 6 images
  if (kind === 'objet') return 5
  return 0
}

/** Libellé d’une ligne de points (question vs image). */
export function tcfCoPointsRowLabel(typeId: string, index: number): string {
  const kind = tcfCoAudioKind(typeId)
  if (kind === 'scenario' || kind === 'objet') return `Image ${index + 1}`
  return `Question ${index + 1}`
}

/** CO ex. 1–5 : points identiques par défaut, différenciables (toggle Identiques / Différents). */
export function tcfCoCanDifferentiatePoints(typeId: string): boolean {
  return tcfCoAudioKind(typeId) != null
}

function poolForKind(kind: TcfCoAudioKind): TcfAudioEntry[] {
  const all = tcfBankAllLevels('CO')
  if (kind === 'court') return tcfCourtAudioEntries(all)
  if (kind === 'moyen') return tcfMoyenAudioEntries(all)
  if (kind === 'scenario') return tcfScenarioAudioEntries(all)
  if (kind === 'objet') return tcfObjetAudioEntries(all)
  return tcfLongAudioEntries(all)
}

function scenarioLabel(id: string): string {
  return TCF_SCENARIOS.find((s) => s.id === id)?.label ?? TCF_SCENARIO_AUTRE.label
}

function entryOptionLabel(entry: TcfAudioEntry): string {
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

function slotLabel(kind: TcfCoAudioKind, slotCount: number, index: number): string {
  if (kind === 'objet' || (kind === 'long' && slotCount === 1)) return 'Audio'
  if (kind === 'scenario') return `Audio scénario ${index + 1}`
  return `Audio ${index + 1}`
}

export function TcfCoAudioSlotsPicker({
  typeId,
  niveau: _niveau,
  slots,
  questionCount,
  pickMode = 'aleatoire',
  onChange,
}: {
  typeId: string
  niveau: TcfNiveau
  slots?: Array<string | undefined>
  questionCount?: number
  /** Défaut Aléatoire : tirage selon le tag ; Libre : menus filtrés sur ce tag. */
  pickMode?: 'aleatoire' | 'libre'
  onChange: (patch: {
    tcfAudioSlots?: Array<string | undefined>
    tcfQuestionCount?: number
    tcfAudioPickMode?: 'aleatoire' | 'libre'
    tcfExercise?: undefined
    tcfBankId?: undefined
    contentSeed?: number
  }) => void
}) {
  const kind = tcfCoAudioKind(typeId)
  const slotCount = tcfCoAudioSlotCount(typeId)
  const pool = useMemo(() => (kind ? poolForKind(kind) : []), [kind])
  const groups = useMemo(() => groupByScenario(pool), [pool])
  const isLibre = pickMode === 'libre'

  if (!kind || !slotCount || pool.length === 0) return null

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
      <div className="mode-toggle-block">
        <b>Exercice</b>
        <div className="mode-toggle" role="group" aria-label="Tirage des audios : aléatoire ou libre">
          <button
            type="button"
            className={!isLibre ? 'active' : undefined}
            aria-pressed={!isLibre}
            onClick={() =>
              onChange({
                tcfAudioPickMode: 'aleatoire',
                tcfAudioSlots: undefined,
                tcfExercise: undefined,
                tcfBankId: undefined,
                contentSeed: Date.now() % 1_000_000_000,
              })
            }
          >
            Aléatoire
          </button>
          <button
            type="button"
            className={isLibre ? 'active' : undefined}
            aria-pressed={isLibre}
            onClick={() =>
              onChange({
                tcfAudioPickMode: 'libre',
                tcfExercise: undefined,
                tcfBankId: undefined,
                contentSeed: Date.now() % 1_000_000_000,
              })
            }
          >
            Libre
          </button>
        </div>
        <small className="muted">
          {isLibre
            ? `Choix parmi les audios tagués « ${kind} ».`
            : `Tirage automatique parmi les audios tagués « ${kind} ».`}
        </small>
      </div>
      {isLibre
        ? current.map((value, i) => (
            <label className="tcf-field" key={`audio-slot-${i}`}>
              <span>{slotLabel(kind, slotCount, i)}</span>
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
          ))
        : null}
      {kind === 'long' ? (
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
