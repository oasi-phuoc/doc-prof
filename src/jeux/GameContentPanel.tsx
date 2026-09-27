import { useId, useMemo, useRef, useState } from 'react'
import { vocabSubgroupsFor } from '@/francais/vocab-learn'
import {
  DEFAULT_GAME_TOPIC,
  entriesFromBankItems,
  isGameBankType,
  lectureBankItems,
  lectureTopicOptions,
  themeBankItems,
  themeTopicOptions,
  type BankItem,
  type GameSource,
} from './bank'
import { GAME_BORDER_STYLES } from './borders'
import { resolveGameImageSrc } from './image-resolve'
import { readGameImageFile, GAME_IMAGE_ACCEPT } from './image'
import { entriesToText, resolveEntries, textToEntries } from './parse'
import type { GameTemplate } from './templates'
import type { GameEntry } from './types'

export type { GameSource }

export type GameContentChange = {
  gameText: string
  gameEntries: GameEntry[]
  gameSource?: GameSource
  gameTopic?: string
  gameSelectedIds?: string[]
  gameBackColor?: string
  gameSeriesName?: string
  gameBorderId?: string
  gameBorderRectoId?: string
  gameBorderVersoId?: string
}

const SERIES_DEFAULTS: Record<string, string> = {
  'jeux-vocabulaire': 'Vocabulaire',
  'jeux-devinettes': 'Devinettes',
  'jeux-memory': 'Mémory',
  'jeux-loto': 'Loto',
  'jeux-intrus': 'Intrus',
  'jeux-dominos': 'Dominos',
}

function defaultSeriesName(typeId: string): string {
  return SERIES_DEFAULTS[typeId] ?? 'Jeux'
}

/** Grille de cartes : identité de série (logo ClairFLE + nom + cadre) au verso. */
function usesSeriesIdentity(typeId: string): boolean {
  return (
    typeId === 'jeux-memory' ||
    typeId === 'jeux-intrus' ||
    typeId === 'jeux-loto' ||
    typeId === 'jeux-vocabulaire' ||
    typeId === 'jeux-devinettes' ||
    typeId === 'jeux-dominos'
  )
}

function GameAddWordRow({
  disabled,
  onAdd,
}: {
  disabled?: boolean
  onAdd: (entry: GameEntry) => void
}) {
  const [label, setLabel] = useState('')
  const [imageSrc, setImageSrc] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  async function onPick(file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      setImageSrc(dataUrl)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  return (
    <div className="game-extra-words">
      <b>Mots supplémentaires</b>
      <div className="vocab-add-row">
        <button
          type="button"
          className={`vocab-add-thumb${imageSrc ? ' has-image' : ''}`}
          aria-label="Image du nouveau mot"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
        >
          {imageSrc ? <img src={imageSrc} alt="" /> : <span aria-hidden>+</span>}
        </button>
        <input
          ref={fileRef}
          className="visually-hidden"
          type="file"
          accept={GAME_IMAGE_ACCEPT}
          onChange={(event) => {
            void onPick(event.target.files?.[0])
            event.target.value = ''
          }}
        />
        <input
          className="pill-input"
          type="text"
          value={label}
          placeholder="Nouveau mot"
          aria-label="Nouveau mot hors liste"
          disabled={disabled}
          onChange={(event) => setLabel(event.target.value)}
        />
        <button
          type="button"
          className="vocab-add-btn"
          aria-label="Ajouter le mot"
          title="Ajouter"
          disabled={disabled || !label.trim()}
          onClick={() => {
            const word = label.trim()
            if (!word) return
            // Garder l’upload tel quel (data URL) — ne pas le perdre via la résolution banque.
            onAdd({ text: word, imageSrc: imageSrc || resolveGameImageSrc(word) })
            setLabel('')
            setImageSrc(undefined)
            setError(null)
          }}
        >
          +
        </button>
        {error ? (
          <p className="questions-overflow-hint" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <small className="muted">Hors liste · image optionnelle (+).</small>
    </div>
  )
}

function templateHasImages(template: GameTemplate): boolean {
  return template.fields.some((field) => field.type === 'image')
}

function usesSeriesNameField(typeId: string): boolean {
  return (
    typeId === 'jeux-memory' ||
    typeId === 'jeux-intrus' ||
    typeId === 'jeux-loto' ||
    typeId === 'jeux-dominos'
  )
}

/** Nom de série (si dos identification) + bordures recto / verso indépendantes. */
function SeriesIdentityFields({
  typeId,
  seriesName,
  borderRectoId,
  borderVersoId,
  onSeriesName,
  onBorderIds,
}: {
  typeId: string
  seriesName?: string
  borderRectoId?: string
  borderVersoId?: string
  onSeriesName: (name: string) => void
  onBorderIds: (recto: string | undefined, verso: string | undefined) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [faceTab, setFaceTab] = useState<'recto' | 'verso'>('recto')
  const recto = borderRectoId?.trim() || ''
  const verso = borderVersoId?.trim() || ''
  const active = faceTab === 'recto' ? recto : verso
  const previewSrc = (id: string, face: 'recto' | 'verso') => {
    const style = GAME_BORDER_STYLES.find((b) => b.id === id)
    if (!style) return undefined
    return face === 'verso' ? style.verso : style.recto
  }
  const tagLabel = () => {
    if (!recto && !verso) return null
    const r = GAME_BORDER_STYLES.find((b) => b.id === recto)?.label ?? (recto ? recto : 'Défaut')
    const v = GAME_BORDER_STYLES.find((b) => b.id === verso)?.label ?? (verso ? verso : 'Défaut')
    if (recto && verso && recto === verso) return r
    return `${r} · ${v}`
  }
  return (
    <div className="game-series-identity">
      {usesSeriesNameField(typeId) ? (
        <label className="game-series-name">
          <span>Nom de la série</span>
          <input
            className="pill-input"
            type="text"
            maxLength={32}
            value={seriesName ?? defaultSeriesName(typeId)}
            aria-label="Nom de la série (verso)"
            placeholder={defaultSeriesName(typeId)}
            onChange={(event) => onSeriesName(event.target.value)}
          />
        </label>
      ) : null}
      <div className="game-border-block">
        <button
          type="button"
          className={`button secondary game-border-toggle${pickerOpen ? ' is-open' : ''}${recto || verso ? ' is-active' : ''}`}
          aria-expanded={pickerOpen}
          aria-controls="game-border-picker"
          onClick={() => {
            setFaceTab('recto')
            setPickerOpen((v) => !v)
          }}
        >
          Bordure personnalisée
          {tagLabel() ? <span className="game-border-toggle-tag">{tagLabel()}</span> : null}
        </button>
        {pickerOpen ? (
          <div id="game-border-picker" className="game-border-picker-wrap">
            <div className="mode-toggle is-2 game-border-face-tabs" role="tablist" aria-label="Face de la bordure">
              <button
                type="button"
                role="tab"
                aria-selected={faceTab === 'recto'}
                className={faceTab === 'recto' ? 'active' : ''}
                onClick={() => setFaceTab('recto')}
              >
                Recto{recto ? ` · ${GAME_BORDER_STYLES.find((b) => b.id === recto)?.label ?? ''}` : ''}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={faceTab === 'verso'}
                className={faceTab === 'verso' ? 'active' : ''}
                onClick={() => setFaceTab('verso')}
              >
                Verso{verso ? ` · ${GAME_BORDER_STYLES.find((b) => b.id === verso)?.label ?? ''}` : ''}
              </button>
            </div>
            <div className="game-border-picker" role="listbox" aria-label={`Bordures ${faceTab}`}>
              <button
                type="button"
                className={`game-border-option is-none${!active ? ' is-selected' : ''}`}
                role="option"
                aria-selected={!active}
                onClick={() => {
                  if (faceTab === 'recto') onBorderIds(undefined, verso || undefined)
                  else onBorderIds(recto || undefined, undefined)
                }}
              >
                <span className="game-border-option-preview is-default" aria-hidden />
                <span>Aucune (défaut)</span>
              </button>
              {GAME_BORDER_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`game-border-option${active === style.id ? ' is-selected' : ''}`}
                  role="option"
                  aria-selected={active === style.id}
                  title={style.label}
                  onClick={() => {
                    if (faceTab === 'recto') {
                      // Première sélection recto : même style au verso s’il est vide.
                      const nextVerso = verso || style.id
                      onBorderIds(style.id, nextVerso)
                    } else {
                      onBorderIds(recto || undefined, style.id)
                    }
                  }}
                >
                  <img
                    className="game-border-option-preview"
                    src={previewSrc(style.id, faceTab)}
                    alt=""
                    draggable={false}
                  />
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <small className="muted">
          Même liste pour le recto et le verso — choisissez chaque face séparément.
        </small>
      </div>
    </div>
  )
}

export function GameContentPanel({
  typeId,
  template,
  entries,
  text,
  gameSource = 'theme',
  gameTopic,
  gameSelectedIds,
  gameBackColor,
  gameSeriesName,
  gameBorderId,
  gameBorderRectoId,
  gameBorderVersoId,
  onChange,
}: {
  typeId: string
  template: GameTemplate
  entries: GameEntry[] | undefined
  text: string
  gameSource?: GameSource
  gameTopic?: string
  gameSelectedIds?: string[]
  gameBackColor?: string
  gameSeriesName?: string
  gameBorderId?: string
  gameBorderRectoId?: string
  gameBorderVersoId?: string
  onChange: (next: GameContentChange) => void
}) {
  const baseId = useId()
  const fileRefs = useRef<Array<HTMLInputElement | null>>([])
  const [error, setError] = useState<string | null>(null)
  const [subgroup, setSubgroup] = useState<string | undefined>()
  const withImages = templateHasImages(template)
  const bankMode = isGameBankType(typeId) && withImages
  const source = gameSource ?? 'theme'
  const topicId = gameTopic ?? DEFAULT_GAME_TOPIC
  const maxCards = template.entryCount

  const themeSubgroups = useMemo(() => vocabSubgroupsFor(topicId), [topicId])
  const activeSubgroup = subgroup ?? themeSubgroups[0]?.id

  const bankItems: BankItem[] = useMemo(() => {
    if (source === 'theme') return themeBankItems(topicId, activeSubgroup)
    if (source === 'lecture') return lectureBankItems(topicId)
    return []
  }, [source, topicId, activeSubgroup])

  const selectedIds = gameSelectedIds ?? []
  const topicOptions = source === 'lecture' ? lectureTopicOptions() : themeTopicOptions()
  const borderRectoId = gameBorderRectoId ?? gameBorderId
  const borderVersoId = gameBorderVersoId ?? gameBorderId


  function commitEntries(nextEntries: GameEntry[], patch: Partial<GameContentChange> = {}) {
    setError(null)
    onChange({
      gameEntries: nextEntries,
      gameText: entriesToText(typeId, nextEntries),
      gameSource: source,
      gameTopic: topicId,
      gameSelectedIds: selectedIds,
      gameBackColor,
      gameSeriesName,
      gameBorderId: borderRectoId,
      gameBorderRectoId: borderRectoId,
      gameBorderVersoId: borderVersoId,
      ...patch,
    })
  }

  function applySelection(ids: string[], items: BankItem[], patch: Partial<GameContentChange> = {}) {
    const byId = new Map(items.map((item) => [item.id, item]))
    const bankIds = ids.filter((id) => !id.startsWith('custom:'))
    const customIds = ids.filter((id) => id.startsWith('custom:'))
    const picked = bankIds
      .map((id) => byId.get(id))
      .filter((item): item is BankItem => Boolean(item))
    const customEntries = resolveEntries(typeId, entries).filter((entry) => {
      const key = `custom:${entry.text.trim().toLowerCase()}`
      return customIds.includes(key) && Boolean(entry.text.trim())
    })
    const room = Math.max(0, maxCards - customEntries.length)
    const bankPicked = picked.slice(0, room)
    const nextEntries = [
      ...entriesFromBankItems(bankPicked, bankPicked.length, resolveEntries(typeId, entries), {
        topicId,
        subgroupId: activeSubgroup,
        withClues: typeId === 'jeux-devinettes',
      }),
      ...customEntries,
    ]
    while (nextEntries.length < maxCards) nextEntries.push({ text: '' })
    const nextIds = [
      ...bankPicked.map((p) => p.id),
      ...customEntries.map((e) => `custom:${e.text.trim().toLowerCase()}`),
    ]
    onChange({
      gameEntries: nextEntries.slice(0, maxCards),
      gameText: entriesToText(
        typeId,
        nextEntries.filter((e) => e.text),
      ),
      gameSource: patch.gameSource ?? source,
      gameTopic: patch.gameTopic ?? topicId,
      gameSelectedIds: nextIds,
      gameBackColor,
      gameSeriesName,
      gameBorderId: borderRectoId,
      gameBorderRectoId: borderRectoId,
      gameBorderVersoId: borderVersoId,
      ...patch,
    })
  }

  function addExtraWord(entry: GameEntry) {
    const current = resolveEntries(typeId, entries).filter((e) => e.text.trim())
    if (current.length >= maxCards) return
    const key = entry.text.trim().toLowerCase()
    if (current.some((e) => e.text.trim().toLowerCase() === key)) return
    const nextEntries = [...current, entry].slice(0, maxCards)
    const bankLabels = new Set(bankItems.map((b) => b.label.toLowerCase()))
    const mergedIds = [
      ...selectedIds.filter((id) => {
        if (id.startsWith('custom:')) return false
        const item = bankItems.find((b) => b.id === id)
        return Boolean(
          item && nextEntries.some((e) => e.text.toLowerCase() === item.label.toLowerCase()),
        )
      }),
      ...nextEntries
        .filter((e) => !bankLabels.has(e.text.toLowerCase()))
        .map((e) => `custom:${e.text.trim().toLowerCase()}`),
    ]
    onChange({
      gameEntries: nextEntries,
      gameText: entriesToText(typeId, nextEntries),
      gameSource: source,
      gameTopic: topicId,
      gameSelectedIds: mergedIds.slice(0, maxCards),
      gameBackColor,
      gameSeriesName,
      gameBorderId: borderRectoId,
      gameBorderRectoId: borderRectoId,
      gameBorderVersoId: borderVersoId,
    })
  }

  function setSeriesName(name: string) {
    const resolvedNow = resolveEntries(typeId, entries)
    onChange({
      gameEntries: resolvedNow,
      gameText: entriesToText(typeId, resolvedNow),
      gameSource: source,
      gameTopic: topicId,
      gameSelectedIds: selectedIds,
      gameBackColor,
      gameSeriesName: name,
      gameBorderId: borderRectoId,
      gameBorderRectoId: borderRectoId,
      gameBorderVersoId: borderVersoId,
    })
  }

  function setBorderIds(recto: string | undefined, verso: string | undefined) {
    const resolvedNow = resolveEntries(typeId, entries)
    onChange({
      gameEntries: resolvedNow,
      gameText: entriesToText(typeId, resolvedNow),
      gameSource: source,
      gameTopic: topicId,
      gameSelectedIds: selectedIds,
      gameBackColor,
      gameSeriesName,
      gameBorderId: recto,
      gameBorderRectoId: recto,
      gameBorderVersoId: verso,
    })
  }

  function setSource(next: GameSource) {
    if (next === 'libre') {
      const resolved = resolveEntries(typeId, entries)
      commitEntries(resolved, { gameSource: 'libre', gameSelectedIds: [] })
      return
    }
    const nextTopic = topicId === 'tous' && next === 'theme' ? DEFAULT_GAME_TOPIC : topicId
    const items =
      next === 'theme'
        ? themeBankItems(nextTopic, vocabSubgroupsFor(nextTopic)[0]?.id)
        : lectureBankItems(nextTopic === 'tous' ? 'tous' : nextTopic)
    const defaults = items.slice(0, maxCards)
    applySelection(
      defaults.map((w) => w.id),
      items,
      { gameSource: next, gameTopic: nextTopic },
    )
  }

  // —— Modes banque (thème / lecture) ——
  if (bankMode && source !== 'libre') {
    return (
      <div className="game-content-field">
        <span className="game-content-label">Contenu</span>
        <div className="mode-toggle-block">
          <b>Source</b>
          <div className="mode-toggle is-3" role="group" aria-label="Source des cartes">
            <button
              type="button"
              className={source === 'theme' ? 'active' : ''}
              onClick={() => setSource('theme')}
            >
              Thème
            </button>
            <button
              type="button"
              className={source === 'lecture' ? 'active' : ''}
              onClick={() => setSource('lecture')}
            >
              Banque
            </button>
            <button type="button" className="" onClick={() => setSource('libre')}>
              Libre
            </button>
          </div>
        </div>

        {source === 'lecture' ? (
          <label className="select-shell">
            <span>Banque</span>
            <select
              className="pill-input"
              value={topicId}
              onChange={(event) => {
                const nextTopic = event.target.value
                const items = lectureBankItems(nextTopic)
                applySelection(
                  items.slice(0, maxCards).map((w) => w.id),
                  items,
                  { gameTopic: nextTopic },
                )
              }}
            >
              {topicOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {source === 'theme' && themeSubgroups.length > 1 ? (
          <label className="select-shell">
            <span>Liste</span>
            <select
              className="pill-input"
              value={activeSubgroup ?? ''}
              onChange={(event) => {
                const sg = event.target.value
                setSubgroup(sg)
                const items = themeBankItems(topicId, sg)
                applySelection(
                  items.slice(0, maxCards).map((w) => w.id),
                  items,
                )
              }}
            >
              {themeSubgroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="quad-libre-block">
          <b>
            Mots ({selectedIds.length}/{maxCards})
          </b>
          <div className="vocab-word-list" role="group" aria-label="Mots à mettre sur les cartes">
            {bankItems.map((word) => {
              const selected = selectedIds.includes(word.id)
              return (
                <label key={word.id} className={selected ? 'is-on' : ''}>
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={!selected && selectedIds.length >= maxCards}
                    onChange={() => {
                      const next = selected
                        ? selectedIds.filter((id) => id !== word.id)
                        : [...selectedIds, word.id].slice(0, maxCards)
                      applySelection(next, bankItems)
                    }}
                  />
                  {word.imageSrc ? (
                    <img className="vocab-word-thumb" src={word.imageSrc} alt="" />
                  ) : null}
                  <span className="vocab-word-label">{word.label}</span>
                </label>
              )
            })}
          </div>
          <GameAddWordRow
            disabled={selectedIds.length >= maxCards}
            onAdd={addExtraWord}
          />
          {selectedIds.some((id) => id.startsWith('custom:')) ? (
            <div className="game-custom-words" aria-label="Mots ajoutés">
              <b>Mots ajoutés</b>
              <ul className="game-custom-word-list">
                {resolveEntries(typeId, entries)
                  .filter((e) => {
                    const key = `custom:${e.text.trim().toLowerCase()}`
                    return selectedIds.includes(key) && e.text.trim()
                  })
                  .map((entry) => (
                    <li key={`custom-show-${entry.text}`}>
                      {entry.imageSrc ? (
                        <img className="vocab-word-thumb" src={entry.imageSrc} alt="" />
                      ) : (
                        <span className="vocab-word-thumb is-empty" aria-hidden />
                      )}
                      <span className="vocab-word-label">{entry.text}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          <small className="muted">
            {typeId === 'jeux-vocabulaire'
              ? '9 cartes · recto images · verso mots (miroir bord long).'
              : typeId === 'jeux-memory'
                ? '4 paires (8 cartes + 1 vide) · verso série.'
                : typeId === 'jeux-loto'
                  ? 'Grilles selon le nombre de mots (pas de cases vides) · lot animateur.'
                  : typeId === 'jeux-devinettes'
                    ? '9 mots · 3 phrases-indices générées automatiquement (sans nommer le thème).'
                    : typeId === 'jeux-intrus'
                      ? 'Mots du thème · à chaque génération, 9 cartes avec un nouvel intrus.'
                      : typeId === 'jeux-dominos'
                        ? '16 dominos image | mot (2×8) · verso série.'
                        : template.entryHint}
          </small>
        </div>
        {typeId === 'jeux-devinettes' && selectedIds.length > 0 ? (
          <div className="game-riddle-bank-clues">
            <b>Phrases-indices (modifiables)</b>
            <ul className="game-riddle-list" aria-label="Indices des mots sélectionnés">
              {resolveEntries(typeId, entries)
                .filter((e) => e.text.trim())
                .slice(0, maxCards)
                .map((entry, index) => {
                  const clues = [...(entry.clues ?? [])]
                  while (clues.length < 3) clues.push('')
                  return (
                    <li className="game-riddle-block" key={`bank-riddle-${entry.text}-${index}`}>
                      <div className="game-riddle-head">
                        <b>{entry.text}</b>
                        {entry.imageSrc ? (
                          <img className="vocab-word-thumb" src={entry.imageSrc} alt="" />
                        ) : null}
                      </div>
                      <div className="game-riddle-clues">
                        {[0, 1, 2].map((clueIndex) => (
                          <label key={clueIndex} className="game-riddle-clue">
                            <span>Phrase {clueIndex + 1}</span>
                            <input
                              className="pill-input"
                              type="text"
                              maxLength={80}
                              value={clues[clueIndex] ?? ''}
                              aria-label={`${entry.text}, phrase ${clueIndex + 1}`}
                              placeholder={`Indice ${clueIndex + 1}`}
                              onChange={(event) => {
                                const resolved = resolveEntries(typeId, entries)
                                const next = resolved.map((e) => {
                                  if (e.text.trim().toLowerCase() !== entry.text.trim().toLowerCase()) {
                                    return e
                                  }
                                  const nextClues = [...(e.clues ?? ['', '', ''])]
                                  while (nextClues.length < 3) nextClues.push('')
                                  nextClues[clueIndex] = event.target.value
                                  return { ...e, clues: nextClues.slice(0, 3) }
                                })
                                onChange({
                                  gameEntries: next,
                                  gameText: entriesToText(typeId, next),
                                  gameSource: source,
                                  gameTopic: topicId,
                                  gameSelectedIds: selectedIds,
                                  gameBackColor,
                                  gameSeriesName,
                                  gameBorderId: borderRectoId,
                                  gameBorderRectoId: borderRectoId,
                                  gameBorderVersoId: borderVersoId,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>
        ) : null}
        {usesSeriesIdentity(typeId) ? (
          <SeriesIdentityFields
            typeId={typeId}
            seriesName={gameSeriesName}
            borderRectoId={borderRectoId}
            borderVersoId={borderVersoId}
            onSeriesName={setSeriesName}
            onBorderIds={setBorderIds}
          />
        ) : null}
      </div>
    )
  }

  // —— Mode libre (ou templates sans images) ——
  const resolved = resolveEntries(typeId, entries)
  const slots =
    withImages || typeId === 'jeux-devinettes'
      ? Array.from({ length: template.entryCount }, (_, i) =>
          resolved[i] ?? { text: '', clues: typeId === 'jeux-devinettes' ? ['', '', ''] : undefined },
        )
      : resolved

  function updateSlot(index: number, patch: Partial<GameEntry>) {
    const next = slots.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    commitEntries(next, { gameSource: 'libre' })
  }

  function updateClue(index: number, clueIndex: number, value: string) {
    const entry = slots[index] ?? { text: '', clues: ['', '', ''] }
    const clues = [...(entry.clues ?? ['', '', ''])]
    while (clues.length < 3) clues.push('')
    clues[clueIndex] = value
    updateSlot(index, { clues: clues.slice(0, 3) })
  }

  async function onPickImage(index: number, file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      updateSlot(index, { imageSrc: dataUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  // —— Devinettes : Mot N + image + 3 indices (pas de syntaxe | ) ——
  if (typeId === 'jeux-devinettes') {
    return (
      <div className="game-content-field">
        <span className="game-content-label">Contenu</span>
        <p className="muted game-content-hint">{template.entryHint}</p>
        <SeriesIdentityFields
          typeId={typeId}
          seriesName={gameSeriesName}
          borderRectoId={borderRectoId}
          borderVersoId={borderVersoId}
          onSeriesName={setSeriesName}
          onBorderIds={setBorderIds}
        />
        <ul className="game-riddle-list" aria-label="Devinettes">
          {slots.map((entry, index) => {
            const inputId = `${baseId}-riddle-img-${index}`
            const clues = [...(entry.clues ?? [])]
            while (clues.length < 3) clues.push('')
            return (
              <li className="game-riddle-block" key={`${typeId}-${index}`}>
                <div className="game-riddle-head">
                  <b>Mot {index + 1}</b>
                  <button
                    type="button"
                    className={`game-entry-thumb${entry.imageSrc ? ' has-image' : ''}`}
                    aria-label={
                      entry.imageSrc
                        ? `Changer l’image du mot ${index + 1}`
                        : `Ajouter une image au mot ${index + 1}`
                    }
                    onClick={() => fileRefs.current[index]?.click()}
                  >
                    {entry.imageSrc ? <img src={entry.imageSrc} alt="" /> : <span aria-hidden>+</span>}
                  </button>
                  <input
                    ref={(el) => {
                      fileRefs.current[index] = el
                    }}
                    id={inputId}
                    className="visually-hidden"
                    type="file"
                    accept={GAME_IMAGE_ACCEPT}
                    onChange={(event) => {
                      void onPickImage(index, event.target.files?.[0])
                      event.target.value = ''
                    }}
                  />
                  <input
                    className="pill-input game-entry-text"
                    type="text"
                    maxLength={template.maxTextLen}
                    value={entry.text}
                    aria-label={`Mot ${index + 1}`}
                    placeholder={`Mot ${index + 1}`}
                    onChange={(event) => updateSlot(index, { text: event.target.value })}
                  />
                  {entry.imageSrc ? (
                    <button
                      type="button"
                      className="game-entry-clear"
                      aria-label={`Retirer l’image du mot ${index + 1}`}
                      title="Retirer l’image"
                      onClick={() => updateSlot(index, { imageSrc: undefined })}
                    >
                      ×
                    </button>
                  ) : (
                    <span className="game-entry-clear is-spacer" aria-hidden />
                  )}
                </div>
                <div className="game-riddle-clues">
                  {[0, 1, 2].map((clueIndex) => (
                    <label key={clueIndex} className="game-riddle-clue">
                      <span>Indice {clueIndex + 1}</span>
                      <input
                        className="pill-input"
                        type="text"
                        maxLength={80}
                        value={clues[clueIndex] ?? ''}
                        aria-label={`Mot ${index + 1}, indice ${clueIndex + 1}`}
                        placeholder={`Phrase ${clueIndex + 1}`}
                        onChange={(event) => updateClue(index, clueIndex, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
        {error ? (
          <p className="questions-overflow-hint" role="alert">
            {error}
          </p>
        ) : (
          <small className="muted">
            Recto mot + image · verso indices (miroir bord long).
          </small>
        )}
      </div>
    )
  }

  if (!withImages) {
    return (
      <label className="select-shell game-content-field">
        <span>Contenu</span>
        <textarea
          className="pill-input game-content-textarea"
          rows={Math.min(12, Math.max(4, template.entryCount + 1))}
          value={text}
          spellCheck
          aria-label="Contenu du jeu"
          placeholder={template.entryHint}
          onChange={(event) => {
            const nextText = event.target.value
            onChange({
              gameText: nextText,
              gameEntries: textToEntries(typeId, nextText, entries),
              gameSource: 'libre',
            })
          }}
        />
        <small className="muted">{template.entryHint}</small>
      </label>
    )
  }

  return (
    <div className="game-content-field">
      <span className="game-content-label">Contenu</span>
      {bankMode ? (
        <div className="mode-toggle-block">
          <b>Source</b>
          <div className="mode-toggle is-3" role="group" aria-label="Source des cartes">
            <button type="button" onClick={() => setSource('theme')}>
              Thème
            </button>
            <button type="button" onClick={() => setSource('lecture')}>
              Banque
            </button>
            <button type="button" className="active" onClick={() => setSource('libre')}>
              Libre
            </button>
          </div>
        </div>
      ) : null}
      <p className="muted game-content-hint">{template.entryHint}</p>
      <ul className="game-entry-list" aria-label="Cartes du jeu">
        {slots.map((entry, index) => {
          const inputId = `${baseId}-img-${index}`
          return (
            <li className="game-entry-row" key={`${typeId}-${index}`}>
              <button
                type="button"
                className={`game-entry-thumb${entry.imageSrc ? ' has-image' : ''}`}
                aria-label={
                  entry.imageSrc
                    ? `Changer l’image de la carte ${index + 1}`
                    : `Ajouter une image à la carte ${index + 1}`
                }
                onClick={() => fileRefs.current[index]?.click()}
              >
                {entry.imageSrc ? <img src={entry.imageSrc} alt="" /> : <span aria-hidden>+</span>}
              </button>
              <input
                ref={(el) => {
                  fileRefs.current[index] = el
                }}
                id={inputId}
                className="visually-hidden"
                type="file"
                accept={GAME_IMAGE_ACCEPT}
                onChange={(event) => {
                  void onPickImage(index, event.target.files?.[0])
                  event.target.value = ''
                }}
              />
              <input
                className="pill-input game-entry-text"
                type="text"
                maxLength={template.maxTextLen}
                value={entry.text}
                aria-label={`Mot carte ${index + 1}`}
                placeholder={`Mot ${index + 1}`}
                onChange={(event) => updateSlot(index, { text: event.target.value })}
              />
              {entry.imageSrc ? (
                <button
                  type="button"
                  className="game-entry-clear"
                  aria-label={`Retirer l’image de la carte ${index + 1}`}
                  title="Retirer l’image"
                  onClick={() => updateSlot(index, { imageSrc: undefined })}
                >
                  ×
                </button>
              ) : (
                <span className="game-entry-clear is-spacer" aria-hidden />
              )}
            </li>
          )
        })}
      </ul>
      {error ? (
        <p className="questions-overflow-hint" role="alert">
          {error}
        </p>
      ) : (
        <small className="muted">
          {typeId === 'jeux-vocabulaire'
            ? 'Recto images · verso mots seuls (miroir bord long).'
            : typeId === 'jeux-memory'
              ? 'Recto : paires image / mot · verso : logo ClairFLE + série (bord long).'
              : 'JPG, PNG, WebP ou SVG · max. 2,5 Mo'}
        </small>
      )}
      {usesSeriesIdentity(typeId) ? (
        <SeriesIdentityFields
          typeId={typeId}
          seriesName={gameSeriesName}
          borderRectoId={borderRectoId}
          borderVersoId={borderVersoId}
          onSeriesName={setSeriesName}
          onBorderIds={setBorderIds}
        />
      ) : null}
    </div>
  )
}
