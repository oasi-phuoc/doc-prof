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
}

const SERIES_DEFAULTS: Record<string, string> = {
  'jeux-vocabulaire': 'Vocabulaire',
  'jeux-devinettes': 'Devinettes',
  'jeux-memory': 'Mémory',
  'jeux-loto': 'Loto',
  'jeux-intrus': 'Intrus',
  'jeux-tri': 'Tri',
  'jeux-dominos': 'Dominos',
}

function defaultSeriesName(typeId: string): string {
  return SERIES_DEFAULTS[typeId] ?? 'Jeux'
}

/** Types avec identité de série (logo ClairFLE + nom + cadre) au verso. */
function usesSeriesIdentity(typeId: string): boolean {
  return (
    typeId === 'jeux-memory' ||
    typeId === 'jeux-intrus' ||
    typeId === 'jeux-tri' ||
    typeId === 'jeux-loto' ||
    typeId === 'jeux-vocabulaire' ||
    typeId === 'jeux-devinettes'
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
            onAdd({ text: word, imageSrc: resolveGameImageSrc(word, imageSrc) })
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

/** Teintes imprimables (dos Mémory / cadre Intrus). */
const GAME_COLOR_SWATCHES: Array<{ id: string; color: string; label: string }> = [
  { id: 'blanc', color: '', label: 'Blanc' },
  { id: 'rouge', color: '#b42318', label: 'Rouge' },
  { id: 'orange', color: '#c45c12', label: 'Orange' },
  { id: 'jaune', color: '#ca8a04', label: 'Jaune' },
  { id: 'vert', color: '#18a66a', label: 'Vert' },
  { id: 'teal', color: '#0f6b5c', label: 'Sarcelle' },
  { id: 'bleu', color: '#2563eb', label: 'Bleu' },
  { id: 'indigo', color: '#4338ca', label: 'Indigo' },
  { id: 'violet', color: '#7c3aed', label: 'Violet' },
]

function templateHasImages(template: GameTemplate): boolean {
  return template.fields.some((field) => field.type === 'image')
}

function GameColorPicker({
  title,
  hint,
  value,
  allowWhite = true,
  onChange,
}: {
  title: string
  hint: string
  value?: string
  allowWhite?: boolean
  onChange: (color: string) => void
}) {
  const current = value?.trim() ?? ''
  const swatches = allowWhite
    ? GAME_COLOR_SWATCHES
    : GAME_COLOR_SWATCHES.filter((s) => s.color)
  return (
    <div className="mode-toggle-block">
      <b>{title}</b>
      <div className="game-back-swatches" role="group" aria-label={title}>
        {swatches.map((swatch) => {
          const active = current === swatch.color || (!current && !swatch.color)
          return (
            <button
              key={swatch.id}
              type="button"
              className={`game-back-swatch${swatch.color ? '' : ' is-white'}${active ? ' active' : ''}`}
              style={swatch.color ? { background: swatch.color } : undefined}
              title={swatch.label}
              aria-label={swatch.label}
              aria-pressed={active}
              onClick={() => onChange(swatch.color)}
            />
          )
        })}
      </div>
      <small className="muted">{hint}</small>
    </div>
  )
}

/** Nom de série + cadre (verso unifié — skill jeux-verso-serie). */
function SeriesIdentityFields({
  typeId,
  seriesName,
  frameColor,
  onSeriesName,
  onFrameColor,
}: {
  typeId: string
  seriesName?: string
  frameColor?: string
  onSeriesName: (name: string) => void
  onFrameColor: (color: string) => void
}) {
  return (
    <div className="game-series-identity">
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
      <GameColorPicker
        title="Cadre de série (verso)"
        hint="Logo ClairFLE dans un cercle + nom de série, cadre coloré (recto-verso bord long)."
        value={frameColor || '#0f6b5c'}
        allowWhite={false}
        onChange={onFrameColor}
      />
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
      ...entriesFromBankItems(bankPicked, bankPicked.length, resolveEntries(typeId, entries)),
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
    })
  }

  function setBackColor(color: string) {
    const resolved = resolveEntries(typeId, entries)
    onChange({
      gameEntries: resolved,
      gameText: entriesToText(typeId, resolved),
      gameSource: source,
      gameTopic: topicId,
      gameSelectedIds: selectedIds,
      gameBackColor: color,
      gameSeriesName,
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

        <label className="select-shell">
          <span>Thème</span>
          <select
            className="pill-input"
            value={topicId}
            onChange={(event) => {
              const nextTopic = event.target.value
              if (source === 'theme') {
                const sg = vocabSubgroupsFor(nextTopic)[0]?.id
                setSubgroup(sg)
                const items = themeBankItems(nextTopic, sg)
                applySelection(
                  items.slice(0, maxCards).map((w) => w.id),
                  items,
                  { gameTopic: nextTopic },
                )
              } else {
                const items = lectureBankItems(nextTopic)
                applySelection(
                  items.slice(0, maxCards).map((w) => w.id),
                  items,
                  { gameTopic: nextTopic },
                )
              }
            }}
          >
            {topicOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

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
          <small className="muted">
            {typeId === 'jeux-vocabulaire'
              ? 'Recto images · verso mots + logo ClairFLE et nom de série (bord long).'
              : typeId === 'jeux-memory'
                ? 'Recto : paires image / mot · verso : logo ClairFLE + nom de série.'
                : typeId === 'jeux-loto'
                  ? '15 grilles (3/page) · verso = série (logo ClairFLE) · lot animateur 27 mots.'
                  : typeId === 'jeux-devinettes'
                    ? 'Sélectionnez les mots ; verso indices + identité de série.'
                    : template.entryHint}
          </small>
        </div>
        {usesSeriesIdentity(typeId) ? (
          <SeriesIdentityFields
            typeId={typeId}
            seriesName={gameSeriesName}
            frameColor={gameBackColor}
            onSeriesName={setSeriesName}
            onFrameColor={setBackColor}
          />
        ) : null}
      </div>
    )
  }

  // —— Mode libre (ou templates sans images) ——
  const resolved = resolveEntries(typeId, entries)
  const slots =
    withImages ||
    typeId === 'jeux-devinettes' ||
    typeId === 'jeux-intrus' ||
    typeId === 'jeux-tri'
      ? Array.from({ length: template.entryCount }, (_, i) =>
          resolved[i] ??
          (typeId === 'jeux-intrus'
            ? { text: '', words: ['', '', '', ''], isIntrus: true }
            : typeId === 'jeux-tri'
              ? {
                  text: '',
                  category: '',
                  words: ['', '', '', '', '', '', ''],
                }
              : { text: '', clues: ['', '', ''] }),
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

  function updateIntrusWord(index: number, wordIndex: number, value: string) {
    const entry = slots[index] ?? { text: '', words: ['', '', '', ''], isIntrus: true }
    const words = [...(entry.words ?? ['', '', '', ''])]
    while (words.length < 4) words.push('')
    words[wordIndex] = value
    updateSlot(index, { words: words.slice(0, 4), isIntrus: true })
  }

  function updateTriWord(index: number, wordIndex: number, value: string) {
    const entry = slots[index] ?? {
      text: '',
      category: '',
      words: ['', '', '', '', '', '', ''],
    }
    const words = [...(entry.words ?? ['', '', '', '', '', '', ''])]
    while (words.length < 7) words.push('')
    words[wordIndex] = value
    const cat = entry.category || entry.text
    updateSlot(index, { words: words.slice(0, 7), category: cat, text: cat })
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

  // —— Tri : 3 blocs (catégorie + 7 mots) ——
  if (typeId === 'jeux-tri') {
    return (
      <div className="game-content-field">
        <span className="game-content-label">Contenu</span>
        <p className="muted game-content-hint">{template.entryHint}</p>
        <SeriesIdentityFields
          typeId={typeId}
          seriesName={gameSeriesName}
          frameColor={gameBackColor}
          onSeriesName={setSeriesName}
          onFrameColor={setBackColor}
        />
        <ul className="game-intrus-list" aria-label="Catégories du tri">
          {slots.map((entry, index) => {
            const words = [...(entry.words ?? [])]
            while (words.length < 7) words.push('')
            const cat = entry.category || entry.text
            return (
              <li className="game-intrus-block" key={`${typeId}-${index}`}>
                <b>Catégorie {index + 1}</b>
                <div className="game-intrus-fields">
                  <label>
                    <span>Catégorie</span>
                    <input
                      className="pill-input"
                      type="text"
                      maxLength={20}
                      value={cat}
                      aria-label={`Catégorie ${index + 1}`}
                      placeholder="Nom de la catégorie"
                      onChange={(event) => {
                        const value = event.target.value
                        updateSlot(index, { text: value, category: value })
                      }}
                    />
                  </label>
                  {[0, 1, 2, 3, 4, 5, 6].map((wordIndex) => (
                    <label key={wordIndex}>
                      <span>Mot {wordIndex + 1}</span>
                      <input
                        className="pill-input"
                        type="text"
                        maxLength={template.maxTextLen}
                        value={words[wordIndex] ?? ''}
                        aria-label={`Catégorie ${index + 1}, mot ${wordIndex + 1}`}
                        placeholder={`Mot ${wordIndex + 1}`}
                        onChange={(event) => updateTriWord(index, wordIndex, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
        <small className="muted">
          Recto : 24 cartes (étiquettes + mots) · verso : logo ClairFLE + série (bord long).
        </small>
      </div>
    )
  }

  // —— Intrus : 12 blocs (intrus + 4 mots) ——
  if (typeId === 'jeux-intrus') {
    return (
      <div className="game-content-field">
        <span className="game-content-label">Contenu</span>
        <p className="muted game-content-hint">{template.entryHint}</p>
        <ul className="game-intrus-list" aria-label="Cartes Intrus">
          {slots.map((entry, index) => {
            const words = [...(entry.words ?? [])]
            while (words.length < 4) words.push('')
            return (
              <li className="game-intrus-block" key={`${typeId}-${index}`}>
                <b>Carte {index + 1}</b>
                <div className="game-intrus-fields">
                  <label className="is-intrus">
                    <span>Intrus</span>
                    <input
                      className="pill-input"
                      type="text"
                      maxLength={template.maxTextLen}
                      value={entry.text}
                      aria-label={`Carte ${index + 1}, intrus`}
                      placeholder="Mot intrus"
                      onChange={(event) =>
                        updateSlot(index, { text: event.target.value, isIntrus: true })
                      }
                    />
                  </label>
                  {[0, 1, 2, 3].map((wordIndex) => (
                    <label key={wordIndex}>
                      <span>Mot {wordIndex + 1}</span>
                      <input
                        className="pill-input"
                        type="text"
                        maxLength={template.maxTextLen}
                        value={words[wordIndex] ?? ''}
                        aria-label={`Carte ${index + 1}, mot ${wordIndex + 1}`}
                        placeholder={`Mot ${wordIndex + 1}`}
                        onChange={(event) => updateIntrusWord(index, wordIndex, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
        <SeriesIdentityFields
          typeId={typeId}
          seriesName={gameSeriesName}
          frameColor={gameBackColor}
          onSeriesName={setSeriesName}
          onFrameColor={setBackColor}
        />
        <small className="muted">
          Recto : 5 mots inclinés · verso : logo ClairFLE + série (bord long).
        </small>
      </div>
    )
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
          frameColor={gameBackColor}
          onSeriesName={setSeriesName}
          onFrameColor={setBackColor}
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
            Recto mot + image · verso indices + logo ClairFLE et nom de série (bord long).
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
            ? 'Recto images · verso mots + logo ClairFLE et nom de série (bord long).'
            : typeId === 'jeux-memory'
              ? 'Recto : paires image / mot · verso : logo ClairFLE + série (bord long).'
              : 'JPG, PNG, WebP ou SVG · max. 2,5 Mo'}
        </small>
      )}
      {usesSeriesIdentity(typeId) ? (
        <SeriesIdentityFields
          typeId={typeId}
          seriesName={gameSeriesName}
          frameColor={gameBackColor}
          onSeriesName={setSeriesName}
          onFrameColor={setBackColor}
        />
      ) : null}
    </div>
  )
}
