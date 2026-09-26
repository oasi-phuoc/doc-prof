import { VOCAB_TOPIC_META } from '@/francais/vocab-registry'
import type { Rng } from '@/math/rng'
import { int, pick, shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { DEFAULT_SEPT_FAMILLES } from './defaults'
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
  /** Bordure personnalisée (01–15), optionnelle. */
  gameBorderId?: string
}

function withBoardBorder(items: MathItem[], borderId?: string): MathItem[] {
  const id = borderId?.trim()
  if (!id) return items
  return items.map((item) =>
    item.gameBoard ? { ...item, gameBoard: { ...item.gameBoard, borderId: id } } : item,
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

function padEntries(entries: GameEntry[], n: number, fill = '…'): GameEntry[] {
  const out: GameEntry[] = entries.slice(0, n).map((e) => ({
    ...e,
    imageSrc: resolveGameImageSrc(e.text, e.imageSrc),
  }))
  while (out.length < n) out.push({ text: `${fill}${out.length + 1}` })
  return out
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
function vocab(entries: GameEntry[]): MathItem[] {
  const { cols, rows } = GRID
  const list = padEntries(entries, cols * rows)
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
 * feuille 1 = mot + image, feuille 2 = 3 indices (miroir bord long).
 */
function devinettes(entries: GameEntry[]): MathItem[] {
  const { cols, rows } = GRID
  const list = padEntries(entries, cols * rows).map((e) => ({
    ...e,
    clues: e.clues && e.clues.length >= 3 ? e.clues.slice(0, 3) : ['…', '…', '…'],
  }))
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
    lines: e.clues,
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
  const pairs = padEntries(entries, 4)
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

/** 15 grilles 3×3 distinctes tirées dans un lot de 27 mots. */
function uniqueLotoGrids(words: string[], count: number, size: number, rng: Rng): string[][] {
  const grids: string[][] = []
  const seen = new Set<string>()
  let guard = 0
  while (grids.length < count && guard < 800) {
    guard += 1
    const picks = shuffle(rng, [...words]).slice(0, size)
    const sig = [...picks].sort((a, b) => a.localeCompare(b, 'fr')).join('|')
    if (seen.has(sig)) continue
    seen.add(sig)
    grids.push(picks)
  }
  while (grids.length < count) {
    grids.push(shuffle(rng, [...words]).slice(0, size))
  }
  return grids
}

/**
 * Loto : 15 grilles (3 par page) + verso série (logo ClairFLE), puis lot animateur.
 */
function loto(
  entries: GameEntry[],
  rng: Rng,
  topicId?: string,
  seriesName?: string,
): MathItem[] {
  const pool = padEntries(entries, 27)
  const byText = new Map(pool.map((e) => [e.text, e]))
  const words = pool.map((e) => e.text)
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
  const grids = uniqueLotoGrids(words, 15, 9, rng)
  const items: MathItem[] = []
  const pages = 5
  for (let page = 0; page < pages; page++) {
    const slice = grids.slice(page * 3, page * 3 + 3)
    const rectoPanels: GamePanel[] = slice.map((picks, local) => {
      const n = page * 3 + local + 1
      return {
        title: `Grille ${n}`,
        cols: 3,
        rows: 3,
        cards: picks.map((text, i) => toCard(text, i, `g${n}`)),
        themeLabel: series,
        themeSub: theme.sub,
      }
    })
    items.push(
      boardItem({
        cols: 3,
        rows: 3,
        cards: [],
        kind: 'loto-page',
        themeLabel: series,
        panels: rectoPanels,
      }),
    )
    // Verso : même ordre (flip bord long) — identité de série.
    const versoPanels: GamePanel[] = rectoPanels.map((panel) => ({
      title: panel.title,
      cols: 3,
      rows: 3,
      cards: [],
      themeLabel: series,
      themeSub: theme.sub,
    }))
    items.push(
      boardItem({
        cols: 3,
        rows: 3,
        cards: [],
        kind: 'loto-back',
        themeLabel: series,
        panels: versoPanels,
      }),
    )
  }
  const call = shuffle(rng, [...words])
  items.push(
    boardItem({
      cols: 3,
      rows: 9,
      cards: call.map((text, i) => {
        const entry = byText.get(text)
        return {
          id: `call-${i}-${text}`,
          text,
          imageSrc: entry?.imageSrc,
          // Image à gauche + mot à droite (CSS is-loto-call).
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

/** Normalise 9 groupes Intrus : text = intrus, words = 4 mots. */
function normalizeIntrusGroups(entries: GameEntry[]): Array<{ intrus: string; words: string[] }> {
  // Format moderne : une entrée = un groupe (words + text = intrus).
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
  // Ancien format plat (category + isIntrus).
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
): MathItem[] {
  const { cols, rows } = GRID
  const groups = normalizeIntrusGroups(entries)
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
 * feuille 1 = 9 dominos image|mot ; feuille 2 = dos série (logo ClairFLE).
 */
function dominos(
  entries: GameEntry[],
  rng: Rng,
  frameColor?: string,
  seriesName?: string,
): MathItem[] {
  const { cols, rows } = GRID
  const pool = padEntries(entries, 9)
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

/** Normalise 3 catégories × 2 mots (9 cartes : 3 étiquettes + 6 mots). */
function normalizeTriGroups(
  entries: GameEntry[],
): Array<{ category: string; words: string[] }> {
  if (entries.some((e) => (e.words?.length ?? 0) > 0 || (e.category && e.text === e.category))) {
    const groups = entries.slice(0, 3).map((e, i) => {
      const category = (e.category || e.text || `Catégorie ${i + 1}`).trim() || `Catégorie ${i + 1}`
      const words = [...(e.words ?? [])].map((w) => w.trim()).filter(Boolean)
      while (words.length < 2) words.push(`mot${words.length + 1}`)
      return { category, words: words.slice(0, 2) }
    })
    while (groups.length < 3) {
      const n = groups.length + 1
      groups.push({
        category: `Catégorie ${n}`,
        words: Array.from({ length: 2 }, (_, i) => `mot${i + 1}`),
      })
    }
    return groups
  }
  const byCat = new Map<string, string[]>()
  for (const e of entries) {
    const key = (e.category || 'Divers').trim() || 'Divers'
    const list = byCat.get(key) ?? []
    if (e.text.trim()) list.push(e.text.trim())
    byCat.set(key, list)
  }
  const cats = [...byCat.keys()].slice(0, 3)
  while (cats.length < 3) cats.push(`Catégorie ${cats.length + 1}`)
  return cats.map((category) => {
    const words = [...(byCat.get(category) ?? [])]
    while (words.length < 2) words.push(`mot${words.length + 1}`)
    return { category, words: words.slice(0, 2) }
  })
}

/**
 * Tri / catégories recto-verso :
 * feuille 1 = 9 cartes (3 étiquettes catégorie + 6 mots),
 * feuille 2 = dos série.
 */
function tri(
  entries: GameEntry[],
  rng: Rng,
  frameColor?: string,
  seriesName?: string,
): MathItem[] {
  const { cols, rows } = GRID
  const groups = normalizeTriGroups(entries)
  const frame = frameColor?.trim() || DEFAULT_SERIES_FRAME
  const series = resolveSeriesName(seriesName, 'Tri')
  const raw: GameCard[] = []
  for (const g of groups) {
    raw.push({
      id: `cat-${g.category}`,
      text: g.category,
      variant: 'category',
    })
    g.words.forEach((word, i) => {
      raw.push({
        id: `tri-${g.category}-${i}`,
        text: word,
        variant: 'word',
      })
    })
  }
  const recto = shuffle(rng, raw)
  const verso = makeSeriesBackCards(recto, cols, series, frame)
  return [
    boardItem({
      cols,
      rows,
      cards: recto,
      kind: 'tri',
      side: 'recto',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'tri',
      side: 'verso',
      frameColor: frame,
      themeLabel: series,
    }),
  ]
}

function septFamilles(entries: GameEntry[]): MathItem[] {
  const byCat = new Map<string, string[]>()
  for (const e of entries) {
    if (!e.category) continue
    const list = byCat.get(e.category) ?? []
    list.push(e.text)
    byCat.set(e.category, list)
  }
  let families =
    byCat.size > 0
      ? [...byCat.entries()].map(([family, members]) => ({ family, members }))
      : DEFAULT_SEPT_FAMILLES
  families = families.slice(0, 7)
  while (families.length < 7) {
    families.push({
      family: `Famille ${families.length + 1}`,
      members: ['a', 'b', 'c', 'd'],
    })
  }
  const cards: GameCard[] = []
  for (const f of families) {
    cards.push({
      id: `fh-${f.family}`,
      text: f.family,
      variant: 'family-head',
    })
    const members = [...f.members]
    while (members.length < 4) members.push('…')
    for (let i = 0; i < 4; i++) {
      cards.push({
        id: `fm-${f.family}-${i}`,
        text: members[i],
        lines: [f.family],
        variant: 'word',
      })
    }
  }
  // 7 familles × (1 tête + 4) = 35 — dense for A4; show 4 familles first page via 4*5=20
  // Better: show all as compact 4-col grid without separate head cards — head is colored card
  // Use only family member cards with family name as badge: 7*4 = 28
  const compact: GameCard[] = []
  for (const f of families) {
    compact.push({
      id: `head-${f.family}`,
      text: f.family,
      variant: 'family-head',
      badge: '★',
    })
    const members = [...f.members]
    while (members.length < 3) members.push('…')
    for (let i = 0; i < 3; i++) {
      compact.push({
        id: `m-${f.family}-${i}`,
        text: members[i],
        lines: [f.family],
        variant: 'word',
      })
    }
  }
  return [
    boardItem({
      cols: 4,
      rows: 7,
      cards: compact.slice(0, 28),
      kind: 'cards',
    }),
  ]
}

function plateau(entries: GameEntry[]): MathItem[] {
  const prompts = padEntries(entries, 12)
  const cards: GameCard[] = []
  for (let i = 0; i < 20; i++) {
    if (i === 0) {
      cards.push({ id: 'p-start', text: 'Départ', variant: 'category', badge: '1' })
    } else if (i === 19) {
      cards.push({ id: 'p-end', text: 'Arrivée', variant: 'category', badge: '20' })
    } else {
      const prompt = prompts[(i - 1) % prompts.length]!
      cards.push({
        id: `p-${i}`,
        text: prompt.text,
        variant: 'word',
        badge: String(i + 1),
      })
    }
  }
  return [
    boardItem({
      cols: 5,
      rows: 4,
      cards,
      kind: 'plateau',
    }),
  ]
}

function deRoue(entries: GameEntry[]): MathItem[] {
  const faces = padEntries(entries, 6)
  const cards: GameCard[] = faces.map((e, i) => ({
    id: `die-${i}`,
    text: e.text,
    variant: 'face',
    badge: String(i + 1),
  }))
  return [
    boardItem({
      cols: 3,
      rows: 2,
      cards,
      kind: 'die',
    }),
  ]
}

function bandesMots(entries: GameEntry[], rng: Rng): MathItem[] {
  const phrase = entries[0]?.text || 'Le chat dort.'
  const words = phrase
    .replace(/([.!?…,;:])/g, ' $1 ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
  const shuffled = shuffle(rng, words.map((text, i) => ({ text, i })))
  const cards: GameCard[] = shuffled.map((w, order) => ({
    id: `bw-${order}`,
    text: w.text,
    variant: 'band',
  }))
  return [
    boardItem({
      cols: Math.min(4, Math.max(2, Math.ceil(cards.length / 3))),
      rows: Math.ceil(cards.length / Math.min(4, Math.max(2, Math.ceil(cards.length / 3)))),
      cards,
      kind: 'bands',
    }),
  ]
}

function phrasesTexte(entries: GameEntry[], rng: Rng): MathItem[] {
  const list = padEntries(entries, Math.max(3, Math.min(6, entries.length || 5)), 'Phrase')
  const shuffled = shuffle(
    rng,
    list.map((e, i) => ({ ...e, i })),
  )
  const cards: GameCard[] = shuffled.map((e, order) => ({
    id: `ph-${order}`,
    text: e.text,
    variant: 'band',
    badge: String(order + 1),
  }))
  return [
    boardItem({
      cols: 1,
      rows: cards.length,
      cards,
      kind: 'bands',
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
      items = vocab(entries)
      break
    case 'jeux-devinettes':
      items = devinettes(entries)
      break
    case 'jeux-memory':
      items = memory(entries, rng, undefined, options.gameSeriesName)
      break
    case 'jeux-loto':
      items = loto(entries, rng, options.gameTopic, options.gameSeriesName)
      break
    case 'jeux-intrus':
      items = intrus(entries, rng, undefined, options.gameSeriesName)
      break
    case 'jeux-dominos':
      items = dominos(entries, rng, undefined, options.gameSeriesName)
      break
    case 'jeux-tri':
      items = tri(entries, rng, undefined, options.gameSeriesName)
      break
    case 'jeux-sept-familles':
      items = septFamilles(entries)
      break
    case 'jeux-plateau':
      items = plateau(entries)
      break
    case 'jeux-de-roue':
      items = deRoue(entries)
      break
    case 'jeux-bandes-mots':
      items = bandesMots(entries, rng)
      break
    case 'jeux-phrases-texte':
      items = phrasesTexte(entries, rng)
      break
    default:
      items = vocab(entries)
  }

  return {
    // Consigne catalogue masquée sur la feuille (cartes seules).
    instruction: '',
    preferredColumns: 1,
    items: withBoardBorder(items, options.gameBorderId),
  }
}
