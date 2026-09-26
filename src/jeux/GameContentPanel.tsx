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
}

/** Dos des cartes Mémory — blanc par défaut, sinon teinte imprimable. */
const MEMORY_BACK_SWATCHES: Array<{ id: string; color: string; label: string }> = [
  { id: 'blanc', color: '', label: 'Blanc' },
  { id: 'rouge', color: '#b42318', label: 'Rouge' },
  { id: 'orange', color: '#c45c12', label: 'Orange' },
  { id: 'jaune', color: '#ca8a04', label: 'Jaune' },
  { id: 'vert', color: '#18a66a', label: 'Vert' },
  { id: 'bleu', color: '#2563eb', label: 'Bleu' },
  { id: 'indigo', color: '#4338ca', label: 'Indigo' },
  { id: 'violet', color: '#7c3aed', label: 'Violet' },
]

function templateHasImages(template: GameTemplate): boolean {
  return template.fields.some((field) => field.type === 'image')
}

function MemoryBackPicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (color: string) => void
}) {
  const current = value?.trim() ?? ''
  return (
    <div className="mode-toggle-block">
      <b>Dos des cartes</b>
      <div className="game-back-swatches" role="group" aria-label="Couleur du verso">
        {MEMORY_BACK_SWATCHES.map((swatch) => {
          const active = current === swatch.color
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
      <small className="muted">Blanc par défaut · couleur uniforme au verso (recto-verso bord long).</small>
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
      ...patch,
    })
  }

  function applySelection(ids: string[], items: BankItem[], patch: Partial<GameContentChange> = {}) {
    const byId = new Map(items.map((item) => [item.id, item]))
    const picked = ids
      .map((id) => byId.get(id))
      .filter((item): item is BankItem => Boolean(item))
      .slice(0, maxCards)
    const nextEntries = entriesFromBankItems(picked, maxCards)
    onChange({
      gameEntries: nextEntries,
      gameText: entriesToText(
        typeId,
        nextEntries.filter((e) => e.text),
      ),
      gameSource: patch.gameSource ?? source,
      gameTopic: patch.gameTopic ?? topicId,
      gameSelectedIds: picked.map((p) => p.id),
      gameBackColor,
      ...patch,
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
          <small className="muted">
            {typeId === 'jeux-vocabulaire'
              ? 'Impression recto-verso : images puis mots alignés (bord long).'
              : typeId === 'jeux-memory'
                ? 'Recto : paires image / mot mélangées · verso : dos blanc ou couleur.'
                : template.entryHint}
          </small>
        </div>
        {typeId === 'jeux-memory' ? (
          <MemoryBackPicker value={gameBackColor} onChange={setBackColor} />
        ) : null}
      </div>
    )
  }

  // —— Mode libre (ou templates sans images) ——
  const resolved = resolveEntries(typeId, entries)
  const slots = withImages || typeId === 'jeux-devinettes'
    ? Array.from({ length: template.entryCount }, (_, i) => resolved[i] ?? { text: '', clues: ['', '', ''] })
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
            Recto-verso : page mot + image, puis page indices (bord long).
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
            ? 'Recto-verso : page images puis page mots (bord long).'
            : typeId === 'jeux-memory'
              ? 'Recto : paires image / mot · verso : dos blanc ou couleur (bord long).'
              : 'JPG, PNG, WebP ou SVG · max. 2,5 Mo'}
        </small>
      )}
      {typeId === 'jeux-memory' ? (
        <MemoryBackPicker value={gameBackColor} onChange={setBackColor} />
      ) : null}
    </div>
  )
}
