import { VOCAB_TOPIC_META } from '@/francais/vocab-registry'
import { exerciseTypeById } from '@/math/catalog'
import type { Rng } from '@/math/rng'
import { shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { DEFAULT_SEPT_FAMILLES } from './defaults'
import { resolveEntries } from './parse'
import { isJeuxType, templateFor } from './templates'
import type { GameBoard, GameCard, GameEntry, GamePanel } from './types'

export type JeuxBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type JeuxGenerateOptions = {
  gameEntries?: GameEntry[]
  /** Dos des cartes Mémory (hex), blanc si absent. */
  gameBackColor?: string
  /** Thème FR (loto verso — série). */
  gameTopic?: string
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
  return {
    layout: 'card-grid',
    answer,
    prompt: board.title,
    gameBoard: board,
  }
}

function padEntries(entries: GameEntry[], n: number, fill = '…'): GameEntry[] {
  const out = entries.slice(0, n)
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
 * feuille 1 = images, feuille 2 = mots (ordre mirroir pour correspondance au retournement).
 */
function vocab(entries: GameEntry[]): MathItem[] {
  const cols = 3
  const rows = 4
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
      title: 'Recto — images (imprimez cette page en premier)',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'cards',
      title: 'Verso — mots (retournez la feuille : chaque mot correspond à l’image)',
    }),
  ]
}

/**
 * Devinettes recto-verso :
 * feuille 1 = mot + image, feuille 2 = 3 indices (ordre mirroir, bord long).
 */
function devinettes(entries: GameEntry[]): MathItem[] {
  const cols = 3
  const rows = 3
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
      title: 'Recto — mot et image (imprimez cette page en premier)',
    }),
    boardItem({
      cols,
      rows,
      cards: verso,
      kind: 'devinettes',
      title: 'Verso — indices (retournez la feuille : chaque carte correspond au mot)',
    }),
  ]
}

/**
 * Mémory recto-verso :
 * feuille 1 = 12 cartes mélangées (6 paires image / mot),
 * feuille 2 = dos blanc ou couleur (ordre mirroir, bord long).
 */
function memory(entries: GameEntry[], rng: Rng, backColor?: string): MathItem[] {
  const cols = 3
  const rows = 4
  const pairs = padEntries(entries, 6)
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
  const cards = shuffle(rng, raw)
  const fill = backColor?.trim() || undefined
  const versoSource = cards.map((card, i) => ({ card, i }))
  const versoMirrored = mirrorRows(versoSource, cols)
  const backs: GameCard[] = versoMirrored.map(({ card, i }) => ({
    id: `mb-${i}`,
    variant: 'back' as const,
    badge: card.badge,
    backColor: fill,
  }))
  return [
    boardItem({
      cols,
      rows,
      cards,
      kind: 'memory',
      title: 'Recto — paires image / mot (même numéro = même paire)',
    }),
    boardItem({
      cols,
      rows,
      cards: backs,
      kind: 'memory',
      backColor: fill,
      title: fill
        ? 'Verso — dos des cartes (couleur)'
        : 'Verso — dos des cartes (blanc)',
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
 * Loto : 15 grilles (3 par page) + verso thème, puis lot animateur 27 mots.
 */
function loto(entries: GameEntry[], rng: Rng, topicId?: string): MathItem[] {
  const pool = padEntries(entries, 27)
  const byText = new Map(pool.map((e) => [e.text, e]))
  const words = pool.map((e) => e.text)
  const theme = lotoThemeLabel(topicId)
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
        themeLabel: theme.label,
        themeSub: theme.sub,
      }
    })
    items.push(
      boardItem({
        cols: 3,
        rows: 3,
        cards: [],
        kind: 'loto-page',
        themeLabel: theme.label,
        panels: rectoPanels,
        title: `Grilles ${page * 3 + 1} à ${page * 3 + 3} — découpez chaque cadre`,
      }),
    )
    // Verso : même ordre (flip bord long) — thème / série du vocabulaire.
    const versoPanels: GamePanel[] = rectoPanels.map((panel) => ({
      title: panel.title,
      cols: 3,
      rows: 3,
      cards: panel.cards
        .filter((c) => c.imageSrc)
        .slice(0, 6)
        .map((c, i) => ({
          id: `vb-${panel.title}-${i}`,
          imageSrc: c.imageSrc,
          variant: 'image' as const,
        })),
      themeLabel: theme.label,
      themeSub: theme.sub,
    }))
    items.push(
      boardItem({
        cols: 3,
        rows: 3,
        cards: [],
        kind: 'loto-back',
        themeLabel: theme.label,
        panels: versoPanels,
        title: `Verso — série « ${theme.label} »`,
      }),
    )
  }
  const call = shuffle(rng, [...words])
  items.push(
    boardItem({
      cols: 3,
      rows: 9,
      cards: call.map((text, i) => ({
        ...toCard(text, i, 'call'),
        badge: String(i + 1),
      })),
      kind: 'loto-call',
      themeLabel: theme.label,
      title: `Lot animateur — 27 mots (série « ${theme.label} »)`,
    }),
  )
  return items
}

function intrus(entries: GameEntry[]): MathItem[] {
  const groups = new Map<string, GameEntry[]>()
  for (const e of padEntries(entries, 16)) {
    const key = e.category || 'g'
    const list = groups.get(key) ?? []
    list.push(e)
    groups.set(key, list)
  }
  const cards: GameCard[] = []
  let g = 0
  for (const [, group] of groups) {
    g += 1
    const four = group.slice(0, 4)
    while (four.length < 4) four.push({ text: '…', category: `g${g}` })
    for (const e of four) {
      cards.push({
        id: `in-${g}-${e.text}`,
        text: e.text,
        variant: e.isIntrus ? 'intrus' : 'word',
        badge: e.isIntrus ? '!' : String(g),
      })
    }
  }
  while (cards.length < 16) {
    cards.push({ id: `in-pad-${cards.length}`, text: '…', variant: 'word' })
  }
  return [
    boardItem({
      cols: 4,
      rows: 4,
      cards: cards.slice(0, 16),
      kind: 'cards',
      title: 'Entourez l’intrus de chaque ligne (badge !).',
    }),
  ]
}

function dominos(entries: GameEntry[]): MathItem[] {
  const words = padEntries(entries, 8).map((e) => e.text)
  // Chain: (w0|w1) (w1|w2) ... wrap last to first for a loop.
  const cards: GameCard[] = []
  for (let i = 0; i < words.length; i++) {
    const left = words[i]!
    const right = words[(i + 1) % words.length]!
    cards.push({
      id: `dom-${i}`,
      text: left,
      textRight: right,
      variant: 'domino',
    })
  }
  return [
    boardItem({
      cols: 2,
      rows: 4,
      cards,
      kind: 'cards',
      title: 'Dominos — enchaînez les moitiés identiques.',
    }),
  ]
}

function tri(entries: GameEntry[]): MathItem[] {
  const byCat = new Map<string, string[]>()
  for (const e of entries) {
    const key = e.category || 'Divers'
    const list = byCat.get(key) ?? []
    list.push(e.text)
    byCat.set(key, list)
  }
  const cats = [...byCat.keys()].slice(0, 3)
  while (cats.length < 3) cats.push(`Catégorie ${cats.length + 1}`)
  const cards: GameCard[] = []
  for (const cat of cats) {
    cards.push({ id: `cat-${cat}`, text: cat, variant: 'category' })
    const words = byCat.get(cat) ?? []
    for (let i = 0; i < 4; i++) {
      cards.push({
        id: `tri-${cat}-${i}`,
        text: words[i] ?? '…',
        variant: 'word',
      })
    }
  }
  return [
    boardItem({
      cols: 3,
      rows: 5,
      cards,
      kind: 'cards',
      title: 'Étiquettes catégories (en tête) + cartes-mots à classer.',
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
      title: '7 familles — carte thème (★) + 3 membres par famille.',
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
      title: 'Plateau — avancez et lisez la consigne de la case.',
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
      title: 'Dé à plier — une consigne par face (1 à 6).',
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
      title: 'Étiquettes-mots — remettez la phrase dans l’ordre.',
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
      title: 'Bandes-phrases — remettez le texte dans l’ordre.',
    }),
  ]
}

export function tryGenerateJeuxBatch(
  typeId: string,
  rng: Rng,
  options: JeuxGenerateOptions = {},
): JeuxBatch | null {
  if (!isJeuxType(typeId)) return null
  const type = exerciseTypeById[typeId]
  const tpl = templateFor(typeId)
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
      items = memory(entries, rng, options.gameBackColor)
      break
    case 'jeux-loto':
      items = loto(entries, rng, options.gameTopic)
      break
    case 'jeux-intrus':
      items = intrus(entries)
      break
    case 'jeux-dominos':
      items = dominos(entries)
      break
    case 'jeux-tri':
      items = tri(entries)
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
    instruction: type?.instruction ?? tpl?.label ?? 'Préparez le jeu.',
    preferredColumns: 1,
    items,
  }
}
