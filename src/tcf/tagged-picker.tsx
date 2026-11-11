/**
 * Sélecteur CE / PE : Aléatoire (tag de l’exercice) ou Libre (liste filtrée).
 */
import { useMemo } from 'react'
import {
  tcfCeTagForSlot,
  tcfPeTagsForSlot,
  type TcfCeTag,
  type TcfPeTag,
} from './content-tags'
import { tcfSlotByTypeId } from './catalog'
import { tcfSlotBank } from './loader'
import { tcfExerciseLabels, tcfScene } from './sources'
import type { TcfExercise, TcfNiveau } from './types'

function tagLabel(tag: string): string {
  if (tag === 'instructions') return 'instructions'
  if (tag === 'temps') return 'temps'
  if (tag === 'espace') return 'espace'
  if (tag === 'informations') return 'informations'
  if (tag === 'formulaire') return 'formulaire'
  if (tag === 'mots-cles') return 'mots-clés'
  if (tag === 'dialogue') return 'dialogue'
  if (tag === 'message') return 'message'
  if (tag === 'email') return 'e-mail'
  return tag
}

function tagsLabel(tags: readonly string[]): string {
  return tags.map(tagLabel).join(' / ')
}

export function tcfTaggedSlotKind(
  typeId: string,
): { competence: 'CE' | 'PE'; tag: TcfCeTag | TcfPeTag; tags: Array<TcfCeTag | TcfPeTag> } | null {
  const slot = tcfSlotByTypeId[typeId]
  if (!slot || slot.numero == null) return null
  if (slot.competence === 'CE') {
    const tag = tcfCeTagForSlot(slot.numero)
    return tag ? { competence: 'CE', tag, tags: [tag] } : null
  }
  if (slot.competence === 'PE') {
    const tags = tcfPeTagsForSlot(slot.numero)
    const tag = tags[0]
    return tag ? { competence: 'PE', tag, tags } : null
  }
  return null
}

/** CE / PE tagués : points différenciables (sauf PE = total unique). */
export function tcfCeCanDifferentiatePoints(typeId: string): boolean {
  return tcfTaggedSlotKind(typeId)?.competence === 'CE'
}

export function tcfIsPeTaggedSlot(typeId: string): boolean {
  return tcfTaggedSlotKind(typeId)?.competence === 'PE'
}

export function TcfTaggedExercisePicker({
  typeId,
  niveau,
  bankId,
  pickMode = 'aleatoire',
  questionCount,
  onChange,
}: {
  typeId: string
  niveau: TcfNiveau
  bankId?: string
  pickMode?: 'aleatoire' | 'libre'
  questionCount?: number
  onChange: (patch: {
    tcfBankId?: string | undefined
    tcfExercise?: undefined
    tcfAudioPickMode?: 'aleatoire' | 'libre'
    tcfScenario?: undefined
    tcfQuestionCount?: number | undefined
    contentSeed?: number
  }) => void
}) {
  const kind = tcfTaggedSlotKind(typeId)
  const slot = tcfSlotByTypeId[typeId]
  const pool = useMemo(() => {
    if (!slot || !kind) return [] as TcfExercise[]
    const here = tcfSlotBank(niveau, slot)
    if (here.length > 0) return here
    // Secours : tous niveaux, même tag.
    return tcfSlotBank(
      ['A0-A1', 'A1-A2', 'A2-B1'] as const,
      slot,
    )
  }, [slot, kind, niveau])
  const labels = useMemo(() => tcfExerciseLabels(pool), [pool])
  const isLibre = pickMode === 'libre'
  const bankCap = useMemo(() => {
    if (kind?.competence !== 'CE') return 0
    if (bankId) {
      const found = pool.find((ex) => ex.id === bankId)
      if (found?.questions?.length) return found.questions.length
    }
    const lens = pool.map((ex) => ex.questions?.length ?? 0).filter((n) => n > 0)
    return lens.length > 0 ? Math.max(...lens) : 10
  }, [kind, bankId, pool])

  const sorted = useMemo(
    () =>
      [...pool].sort((a, b) =>
        (labels.get(a.id) ?? tcfScene(a)).localeCompare(labels.get(b.id) ?? tcfScene(b), 'fr', {
          numeric: true,
        }),
      ),
    [pool, labels],
  )

  if (!kind || !slot || pool.length === 0) return null

  return (
    <div className="quad-libre-block tcf-editor tcf-tagged-picker">
      <div className="mode-toggle-block">
        <b>Exercice</b>
        <div className="mode-toggle" role="group" aria-label="Tirage : aléatoire ou libre">
          <button
            type="button"
            className={!isLibre ? 'active' : undefined}
            aria-pressed={!isLibre}
            onClick={() =>
              onChange({
                tcfAudioPickMode: 'aleatoire',
                tcfBankId: undefined,
                tcfExercise: undefined,
                tcfScenario: undefined,
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
                contentSeed: Date.now() % 1_000_000_000,
              })
            }
          >
            Libre
          </button>
        </div>
        <small className="muted">
          {isLibre
            ? `Choix parmi les textes tagués « ${tagsLabel(kind.tags)} ».`
            : `Tirage automatique parmi les textes tagués « ${tagsLabel(kind.tags)} ».`}
        </small>
      </div>
      {isLibre ? (
        <label className="tcf-field">
          <span>{kind.competence === 'CE' ? 'Texte' : 'Exercice'}</span>
          <select
            className="pill-input"
            value={bankId ?? ''}
            onChange={(event) =>
              onChange({
                tcfBankId: event.target.value || undefined,
                tcfExercise: undefined,
                contentSeed: Date.now() % 1_000_000_000,
              })
            }
          >
            <option value="">Tout</option>
            {sorted.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {labels.get(ex.id) ?? tcfScene(ex)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {kind.competence === 'CE' && bankCap > 0 ? (
        <label className="tcf-field">
          <span>Nombre de questions</span>
          <input
            className="pill-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={bankCap}
            step={1}
            value={questionCount ?? bankCap}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(1, Math.min(bankCap, Math.round(raw)))
              onChange({
                tcfQuestionCount: next >= bankCap ? undefined : next,
                tcfExercise: undefined,
              })
            }}
          />
          <small className="muted">
            Défaut : toutes les questions du texte (max. {bankCap}).
          </small>
        </label>
      ) : null}
    </div>
  )
}

/** Nombre de questions pour le barème Différents (CE). */
export function tcfCeQuestionCountHint(
  typeId: string,
  niveau: TcfNiveau,
  bankId?: string,
  exercise?: TcfExercise,
  questionCount?: number,
): number {
  const full = (() => {
    if (exercise?.questions?.length) return exercise.questions.length
    const slot = tcfSlotByTypeId[typeId]
    if (!slot) return 5
    if (bankId) {
      const found = tcfSlotBank(['A0-A1', 'A1-A2', 'A2-B1'] as const, slot).find((e) => e.id === bankId)
      if (found?.questions?.length) return found.questions.length
    }
    const pool = tcfSlotBank(niveau, slot)
    const lens = pool.map((e) => e.questions?.length ?? 0).filter((n) => n > 0)
    if (lens.length === 0) return 5
    return Math.max(...lens)
  })()
  if (questionCount != null && Number.isFinite(questionCount) && questionCount > 0) {
    return Math.min(Math.round(questionCount), full)
  }
  return full
}
