import { exerciseTypeById } from '@/math/catalog'
import type { Rng } from '@/math/rng'
import { shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { DEFAULT_SEPT_FAMILLES } from './defaults'
import { resolveEntries } from './parse'
import { isJeuxType, templateFor } from './templates'
import type { GameBoard, GameCard, GameEntry } from './types'

export type JeuxBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type JeuxGenerateOptions = {
  gameEntries?: GameEntry[]
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

function memory(entries: GameEntry[], rng: Rng): MathItem[] {
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
      // Carte image sans le mot (la paire se lit au badge).
      imageSrc: e.imageSrc,
      variant: 'image' as const,
      badge: String(i + 1),
    },
  ])
  const cards = shuffle(rng, raw)
  return [
    boardItem({
      cols: 3,
      rows: 4,
      cards,
      kind: 'cards',
      title: 'Mémory — 6 paires (mot / image). Même numéro = même paire.',
    }),
  ]
}

function loto(entries: GameEntry[], rng: Rng): MathItem[] {
  const pool = padEntries(entries, 18)
  const byText = new Map(pool.map((e) => [e.text, e]))
  const words = pool.map((e) => e.text)
  const toCard = (text: string, i: number): GameCard => {
    const entry = byText.get(text)
    return {
      id: `l-${text}-${i}`,
      text,
      imageSrc: entry?.imageSrc,
      variant: entry?.imageSrc ? 'default' : 'word',
    }
  }
  const b1 = shuffle(rng, [...words]).slice(0, 9)
  const b2 = shuffle(rng, [...words]).slice(0, 9)
  const call = shuffle(rng, [...words])
  return [
    boardItem({
      cols: 3,
      rows: 3,
      cards: b1.map((text, i) => toCard(text, i)),
      kind: 'loto',
      title: 'Grille joueur 1',
    }),
    boardItem({
      cols: 3,
      rows: 3,
      cards: b2.map((text, i) => toCard(text, i)),
      kind: 'loto',
      title: 'Grille joueur 2',
    }),
    boardItem({
      cols: 3,
      rows: 6,
      cards: call.map((text, i) => ({
        ...toCard(text, i),
        id: `call-${i}`,
        badge: String(i + 1),
      })),
      kind: 'cards',
      title: 'Paquet animateur (ordre de tirage)',
    }),
  ]
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
      items = memory(entries, rng)
      break
    case 'jeux-loto':
      items = loto(entries, rng)
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
