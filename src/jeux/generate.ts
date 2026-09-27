import { VOCAB_TOPIC_META } from '@/francais/vocab-registry'
import type { Rng } from '@/math/rng'
import { int, pick, shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { outsiderWordsFor, withAutoClues } from './clues'
import { DEFAULT_GAME_FONT_SIZE, gameFontSizeById } from './font-size'
import { resolveGameImageSrc } from './image-resolve'
import { resolveEntries } from './parse'
import { isJeuxType } from './templates'
import type { GameBoard, GameCard, GameEntry, GamePanel, ScatterWord } from './types'

export type JeuxBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type JeuxGenerateOptions = {
  gameEntries?: GameEntry[]
  /** Couleur du cadre de série (verso). */
  gameBackColor?: string
  /** Thème FR (loto / banques). */
  gameTopic?: string
  /** Nom de série imprimé au verso (logo ClairFLE). */
  gameSeriesName?: string
  /** Bordure personnalisée (01–15), optionnelle — legacy (= recto). */
  gameBorderId?: string
  /** Bordure recto (01–15), optionnelle. */
  gameBorderRectoId?: string
  /** Bordure verso (01–15), optionnelle — indépendante du recto. */
  gameBorderVersoId?: string
  /** Taille des mots (petit | moyen | grand). */
  gameFontSize?: string
}

function withBoardChrome(
  items: MathItem[],
  rectoId?: string,
  versoId?: string,
  fontSizeId?: string,
): MathItem[] {
  // Conserver '' (= aucune) pour ne pas réinjecter l’autre face via borderId.
  const recto = (rectoId ?? '').trim()
  const verso = (versoId ?? '').trim()
  const fontSize = gameFontSizeById(fontSizeId ?? DEFAULT_GAME_FONT_SIZE).id
  return items.map((item) =>
    item.gameBoard
      ? {
          ...item,
          gameBoard: {
            ...item.gameBoard,
            borderId: recto || verso || undefined,
            borderRectoId: recto,
            borderVersoId: verso,
            fontSize,
          },
        }
      : item,
  )
}

const DEFAULT_SERIES_FRAME = '#0f6b5c'

function resolveSeriesName(name: string | undefined, fallback: string): string {
  const t = name?.trim()
  return t || fallback
}

/** Dos unifiés : logo ClairFLE + nom de série + cadre (miroir bord long). */
function makeSeriesBackCards(
  recto: GameCard[],
  cols: number,
  seriesName: string,
  frameColor?: string,
): GameCard[] {
  const frame = frameColor?.trim() || DEFAULT_SERIES_FRAME
  return mirrorRows(recto, cols).map((card, i) => ({
    id: `sb-${card.id}-${i}`,
    text: seriesName,
    variant: 'series-back' as const,
    frameColor: frame,
    badge: card.badge,
  }))
}

function lotoThemeLabel(topicId?: string): { label: string; sub?: string } {
  if (!topicId || topicId === 'tous' || topicId === 'libre') {
    return { label: 'Loto', sub: 'Vocabulaire' }
  }
  const meta = VOCAB_TOPIC_META.find((t) => t.id === topicId)
  if (!meta) return { label: 'Loto', sub: 'Vocabulaire' }
  return { label: meta.label, sub: meta.vocab }
}

function boardItem(board: GameBoard, answer = ''): MathItem {
  // Pas de titre / consigne sur la feuille : seules les cartes.
  const clean = { ...board, title: undefined }
  return {
    layout: 'card-grid',
    answer,
    prompt: '',
    gameBoard: clean,
  }
}

const GRID = { cols: 3, rows: 3 } as const

/** Entrées non vides avec image résolue — sans inventer de mots « … ». */
function solidEntries(entries: GameEntry[]): GameEntry[] {
  return entries
    .filter((e) => e.text.trim() && !/^…\d*$/.test(e.text.trim()))
    .map((e) => ({
      ...e,
      text: e.text.trim(),
      imageSrc: resolveGameImageSrc(e.text, e.imageSrc),
    }))
}

function padEntries(entries: GameEntry[], n: number, fill = '…'): GameEntry[] {
  const out: GameEntry[] = solidEntries(entries).slice(0, n)
  while (out.length < n) out.push({ text: `${fill}${out.length + 1}` })
  return out.map((e) => ({
    ...e,
    imageSrc: resolveGameImageSrc(e.text, e.imageSrc),
  }))
}

/** Miroir horizontal par ligne (recto-verso bord long : le mot colle à l’image). */
function mirrorRows<T>(items: T[], cols: number): T[] {
  const out: T[] = []
  for (let i = 0; i < items.length; i += cols) {
    const row = items.slice(i, i + cols)
    while (row.length < cols) row.push(row[row.length - 1]!)
    out.push(...row.reverse())
  }
  return out
}

/**
 * Vocabulaire imprimable recto-verso :
 * feuille 1 = images, feuille 2 = mots seuls (miroir bord long).
 */
function vocab(entries: GameEntry[], rng: Rng): MathItem[] {
  const { cols, rows } = GRID
  const list = padEntries(shuffle(rng, solidEntries(entries)), cols * rows)
  const recto: GameCard[] = list.map((e, i) => ({
    id: `vr-${i}`,
    imageSrc: e.imageSrc,
    variant: 'image' as const,
    badge: String(i + 1),
  }))
  const versoSource = list.map((e, i) => ({ e, i }))
  const versoMirrored = mirrorRows(versoSource, cols)
  const verso: GameCard[] = versoMirrored.map(({ e, i }) => ({
    id: `vv-${i}`,
    text: e.text,
    variant: 'word' as const,
    badge: String(i + 1),
  }))
  return [
    boardItem({
      cols,
      rows,
      cards: recto,
      kind: 'cards',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'cards',
      side: 'verso',
    }),
  ]
}

/**
 * Devinettes recto-verso :
 * feuille 1 = mot + image, feuille 2 = une phrase-indice (miroir bord long).
 */
function devinettes(entries: GameEntry[], rng: Rng, topicId?: string): MathItem[] {
  const { cols, rows } = GRID
  const enriched = withAutoClues(
    shuffle(rng, solidEntries(entries)).slice(0, cols * rows),
    topicId,
  )
  const list = padEntries(enriched, cols * rows).map((e) => {
    const clue = (e.clues ?? []).join('\n').trim() || '…'
    return { ...e, clues: [clue] }
  })
  const recto: GameCard[] = list.map((e, i) => ({
    id: `dr-${i}`,
    text: e.text,
    imageSrc: e.imageSrc,
    variant: 'word' as const,
    badge: String(i + 1),
  }))
  const versoMirrored = mirrorRows(
    list.map((e, i) => ({ e, i })),
    cols,
  )
  const verso: GameCard[] = versoMirrored.map(({ e, i }) => ({
    id: `dv-${i}`,
    text: e.clues[0] ?? '…',
    variant: 'clue' as const,
    badge: String(i + 1),
  }))
  return [
    boardItem({
      cols,
      rows,
      cards: recto,
      kind: 'devinettes',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'devinettes',
      side: 'verso',
    }),
  ]
}

/**
 * Mémory recto-verso :
 * feuille 1 = 8 cartes (4 paires) + 1 case vide en 3×3,
 * feuille 2 = dos série (logo ClairFLE + nom, miroir bord long).
 */
function memory(
  entries: GameEntry[],
  rng: Rng,
  frameColor?: string,
  seriesName?: string,
): MathItem[] {
  const { cols, rows } = GRID
  const pairs = padEntries(shuffle(rng, solidEntries(entries)), 4)
  const series = resolveSeriesName(seriesName, 'Mémory')
  const frame = frameColor?.trim() || DEFAULT_SERIES_FRAME
  const raw: GameCard[] = pairs.flatMap((e, i) => [
    {
      id: `m-w-${i}`,
      text: e.text,
      variant: 'word' as const,
      badge: String(i + 1),
    },
    {
      id: `m-i-${i}`,
      imageSrc: e.imageSrc,
      variant: 'image' as const,
      badge: String(i + 1),
    },
  ])
  const cards = [
    ...shuffle(rng, raw),
    { id: 'm-empty', variant: 'word' as const, text: '' },
  ]
  const backs = makeSeriesBackCards(cards, cols, series, frame)
  return [
    boardItem({
      cols,
      rows,
      cards,
      kind: 'memory',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: backs,
      kind: 'memory',
      side: 'verso',
      frameColor: frame,
      themeLabel: series,
    }),
  ]
}

/** Dimensions de grille loto sans cases vides. */
function lotoGridDims(wordCount: number): { cols: number; rows: number; size: number } {
  if (wordCount >= 9) return { cols: 3, rows: 3, size: 9 }
  if (wordCount >= 6) return { cols: 3, rows: 2, size: 6 }
  if (wordCount >= 4) return { cols: 2, rows: 2, size: 4 }
  if (wordCount === 3) return { cols: 3, rows: 1, size: 3 }
  if (wordCount === 2) return { cols: 2, rows: 1, size: 2 }
  return { cols: 1, rows: 1, size: Math.max(1, wordCount) }
}

/** Grilles distinctes tirées dans le lot (taille ≤ nb de mots). */
function uniqueLotoGrids(words: string[], count: number, size: number, rng: Rng): string[][] {
  const grids: string[][] = []
  const seen = new Set<string>()
  let guard = 0
  while (grids.length < count && guard < 800) {
    guard += 1
    const picks = shuffle(rng, [...words]).slice(0, size)
    if (picks.length < size) break
    const sig = [...picks].sort((a, b) => a.localeCompare(b, 'fr')).join('|')
    if (seen.has(sig)) continue
    seen.add(sig)
    grids.push(picks)
  }
  while (grids.length < count && words.length >= size) {
    grids.push(shuffle(rng, [...words]).slice(0, size))
  }
  return grids
}

/**
 * Loto : grilles selon le nombre de mots disponibles (pas de cases vides)
 * + verso série, puis lot animateur.
 */
function loto(
  entries: GameEntry[],
  rng: Rng,
  topicId?: string,
  seriesName?: string,
): MathItem[] {
  const pool = solidEntries(entries)
  if (pool.length === 0) {
    return loto(padEntries([], 9), rng, topicId, seriesName)
  }
  const byText = new Map(pool.map((e) => [e.text, e]))
  const words = pool.map((e) => e.text)
  const { cols, rows, size } = lotoGridDims(words.length)
  const theme = lotoThemeLabel(topicId)
  const series = resolveSeriesName(seriesName, theme.label)
  const toCard = (text: string, i: number, prefix: string): GameCard => {
    const entry = byText.get(text)
    return {
      id: `${prefix}-${i}-${text}`,
      text,
      imageSrc: entry?.imageSrc,
      variant: entry?.imageSrc ? 'default' : 'word',
    }
  }
  const gridCount = words.length >= 9 ? 15 : Math.min(9, Math.max(3, words.length * 2))
  const grids = uniqueLotoGrids(words, gridCount, size, rng)
  const items: MathItem[] = []
  const perPage = 3
  const pages = Math.max(1, Math.ceil(grids.length / perPage))
  for (let page = 0; page < pages; page++) {
    const slice = grids.slice(page * perPage, page * perPage + perPage)
    if (slice.length === 0) break
    const rectoPanels: GamePanel[] = slice.map((picks, local) => {
      const n = page * perPage + local + 1
      return {
        title: `Grille ${n}`,
        cols,
        rows,
        cards: picks.map((text, i) => toCard(text, i, `g${n}`)),
        themeLabel: series,
        themeSub: theme.sub,
      }
    })
    items.push(
      boardItem({
        cols,
        rows,
        cards: [],
        kind: 'loto-page',
        themeLabel: series,
        panels: rectoPanels,
      }),
    )
    const versoPanels: GamePanel[] = rectoPanels.map((panel) => ({
      title: panel.title,
      cols,
      rows,
      cards: [],
      themeLabel: series,
      themeSub: theme.sub,
    }))
    items.push(
      boardItem({
        cols,
        rows,
        cards: [],
        kind: 'loto-back',
        themeLabel: series,
        panels: versoPanels,
      }),
    )
  }
  const call = shuffle(rng, [...words])
  const callCols = 3
  const callRows = Math.max(1, Math.ceil(call.length / callCols))
  items.push(
    boardItem({
      cols: callCols,
      rows: callRows,
      cards: call.map((text, i) => {
        const entry = byText.get(text)
        return {
          id: `call-${i}-${text}`,
          text,
          imageSrc: entry?.imageSrc,
          variant: 'default' as const,
          badge: String(i + 1),
        }
      }),
      kind: 'loto-call',
      themeLabel: series,
    }),
  )
  return items
}

/** Normalise des groupes Intrus déjà structurés (mode libre). */
function normalizeIntrusGroups(entries: GameEntry[]): Array<{ intrus: string; words: string[] }> {
  if (entries.some((e) => e.words && e.words.length > 0)) {
    const groups = entries.slice(0, 9).map((e, i) => {
      const words = [...(e.words ?? [])].map((w) => w.trim()).filter(Boolean)
      while (words.length < 4) words.push(`mot${words.length + 1}`)
      const intrus = e.text.trim() || `intrus${i + 1}`
      return { intrus, words: words.slice(0, 4) }
    })
    while (groups.length < 9) {
      groups.push({
        intrus: `intrus${groups.length + 1}`,
        words: ['a', 'b', 'c', 'd'],
      })
    }
    return groups
  }
  const byCat = new Map<string, GameEntry[]>()
  for (const e of entries) {
    const key = e.category || 'g'
    const list = byCat.get(key) ?? []
    list.push(e)
    byCat.set(key, list)
  }
  const groups: Array<{ intrus: string; words: string[] }> = []
  for (const [, group] of byCat) {
    const intrus = group.find((g) => g.isIntrus)?.text ?? group[group.length - 1]?.text ?? 'intrus'
    const words = group.filter((g) => !g.isIntrus).map((g) => g.text).slice(0, 4)
    while (words.length < 4) words.push(`mot${words.length + 1}`)
    groups.push({ intrus, words })
    if (groups.length >= 9) break
  }
  while (groups.length < 9) {
    groups.push({ intrus: `intrus${groups.length + 1}`, words: ['a', 'b', 'c', 'd'] })
  }
  return groups
}

/**
 * Construit 9 cartes Intrus à partir des mots du thème :
 * 4 mots du lot + 1 intrus tiré ailleurs (re-tiré à chaque génération).
 */
function buildIntrusFromTheme(
  entries: GameEntry[],
  rng: Rng,
  topicId?: string,
): Array<{ intrus: string; words: string[] }> {
  // Mode libre déjà structuré : garder les 4 mots, re-tirer l’intrus.
  if (entries.some((e) => e.words && e.words.length > 0)) {
    const base = normalizeIntrusGroups(entries)
    const outsiders = outsiderWordsFor(topicId ?? 'fr-nourriture', undefined, 80)
    return base.map((g) => {
      const used = new Set([...g.words, g.intrus].map((w) => w.toLowerCase()))
      const pool = shuffle(
        rng,
        outsiders.filter((o) => !used.has(o.toLowerCase())),
      )
      const intrus = pool[0] ?? g.intrus
      return { intrus, words: shuffle(rng, [...g.words]) }
    })
  }

  const themeWords = solidEntries(entries).map((e) => e.text)
  if (themeWords.length === 0) {
    return normalizeIntrusGroups(entries)
  }
  const outsiders = outsiderWordsFor(topicId ?? 'fr-nourriture', undefined, 80)
  const themeSet = new Set(themeWords.map((w) => w.toLowerCase()))
  const outsiderPool = outsiders.filter((o) => !themeSet.has(o.toLowerCase()))
  const fallbackOutsiders = ['table', 'crayon', 'nuage', 'balai', 'valise', 'quai', 'fièvre', 'oreiller', 'janvier']
  const groups: Array<{ intrus: string; words: string[] }> = []
  for (let i = 0; i < 9; i++) {
    const words = shuffle(rng, [...themeWords]).slice(0, Math.min(4, themeWords.length))
    while (words.length < 4) {
      words.push(themeWords[words.length % themeWords.length]!)
    }
    const used = new Set(words.map((w) => w.toLowerCase()))
    const pool = shuffle(
      rng,
      (outsiderPool.length ? outsiderPool : fallbackOutsiders).filter(
        (o) => !used.has(o.toLowerCase()),
      ),
    )
    const intrus = pool[i % Math.max(1, pool.length)] ?? fallbackOutsiders[i % fallbackOutsiders.length]!
    groups.push({ intrus, words: words.slice(0, 4) })
  }
  return groups
}

const SCATTER_ZONES = [
  { x: 20, y: 24 },
  { x: 74, y: 30 },
  { x: 42, y: 52 },
  { x: 24, y: 78 },
  { x: 70, y: 74 },
]

function scatterWords(words: string[], rng: Rng): ScatterWord[] {
  const zones = shuffle(rng, SCATTER_ZONES)
  const angles = [-30, -22, -14, -8, 8, 12, 20, 28]
  return words.map((text, i) => {
    const zone = zones[i % zones.length]!
    return {
      text,
      rotate: pick(rng, angles),
      x: Math.min(88, Math.max(12, zone.x + int(rng, -6, 6))),
      y: Math.min(88, Math.max(14, zone.y + int(rng, -5, 5))),
    }
  })
}

/**
 * Intrus recto-verso :
 * feuille 1 = 9 cartes (5 mots inclinés),
 * feuille 2 = dos série (logo ClairFLE + nom, miroir bord long).
 */
function intrus(
  entries: GameEntry[],
  rng: Rng,
  frameColor?: string,
  seriesName?: string,
  topicId?: string,
): MathItem[] {
  const { cols, rows } = GRID
  const groups = buildIntrusFromTheme(entries, rng, topicId)
  const frame = frameColor?.trim() || DEFAULT_SERIES_FRAME
  const series = resolveSeriesName(seriesName, 'Intrus')
  const recto: GameCard[] = groups.map((g, i) => {
    const five = shuffle(rng, [...g.words, g.intrus])
    return {
      id: `ir-${i}`,
      variant: 'scatter' as const,
      badge: String(i + 1),
      scatter: scatterWords(five, rng),
    }
  })
  const verso = makeSeriesBackCards(recto, cols, series, frame)
  return [
    boardItem({
      cols,
      rows,
      cards: recto,
      kind: 'intrus',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'intrus',
      side: 'verso',
      frameColor: frame,
      themeLabel: series,
    }),
  ]
}

/**
 * Dominos vocabulaire recto-verso :
 * feuille 1 = 16 dominos image|mot (2×8) ; feuille 2 = dos série.
 */
function dominos(
  entries: GameEntry[],
  rng: Rng,
  frameColor?: string,
  seriesName?: string,
): MathItem[] {
  const cols = 2
  const rows = 8
  const pool = padEntries(shuffle(rng, solidEntries(entries)), 16)
  const n = pool.length
  const series = resolveSeriesName(seriesName, 'Dominos')
  const frame = frameColor?.trim() || DEFAULT_SERIES_FRAME
  const raw: GameCard[] = []
  for (let i = 0; i < n; i++) {
    const left = pool[i]!
    const right = pool[(i + 1) % n]!
    raw.push({
      id: `dom-${i}`,
      imageSrc: left.imageSrc,
      text: left.imageSrc ? undefined : left.text,
      textRight: right.text,
      variant: 'domino',
      badge: String(i + 1),
    })
  }
  const cards = shuffle(rng, raw)
  const verso = makeSeriesBackCards(cards, cols, series, frame)
  return [
    boardItem({
      cols,
      rows,
      cards,
      kind: 'dominos',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'dominos',
      side: 'verso',
      frameColor: frame,
      themeLabel: series,
    }),
  ]
}

export function tryGenerateJeuxBatch(
  typeId: string,
  rng: Rng,
  options: JeuxGenerateOptions = {},
): JeuxBatch | null {
  if (!isJeuxType(typeId)) return null
  const entries = resolveEntries(typeId, options.gameEntries)

  let items: MathItem[]
  switch (typeId) {
    case 'jeux-vocabulaire':
      items = vocab(entries, rng)
      break
    case 'jeux-devinettes':
      items = devinettes(entries, rng, options.gameTopic)
      break
    case 'jeux-memory':
      items = memory(entries, rng, undefined, options.gameSeriesName)
      break
    case 'jeux-loto':
      items = loto(entries, rng, options.gameTopic, options.gameSeriesName)
      break
    case 'jeux-intrus':
      items = intrus(entries, rng, undefined, options.gameSeriesName, options.gameTopic)
      break
    case 'jeux-dominos':
      items = dominos(entries, rng, undefined, options.gameSeriesName)
      break
    default:
      items = vocab(entries, rng)
  }

  return {
    // Consigne catalogue masquée sur la feuille (cartes seules).
    instruction: '',
    preferredColumns: 1,
    items: withBoardChrome(
      items,
      options.gameBorderRectoId !== undefined
        ? options.gameBorderRectoId
        : options.gameBorderId,
      options.gameBorderVersoId !== undefined
        ? options.gameBorderVersoId
        : options.gameBorderId,
      options.gameFontSize,
    ),
  }
}
