import { fmt } from '@/math/column-arith'
import { opTableCell } from '@/math/op-table'
import type {
  CompositeScene,
  CoordScene,
  Figure,
  FigureDims,
  MathItem,
  WorksheetBlock,
  WorksheetPage,
} from '@/math/types'
import type { TcfSheetItem } from '@/tcf/types'

/** Pièce colorée à cliquer, entourer ou déposer. Jamais de saisie. */
export type PlayChip = {
  id: string
  label: string
  image?: string
  tone: number
}

export type PlaySlot = {
  id: string
  expected: string
  label?: string
}

export type PlayVisual = {
  figure?: Figure
  dims?: FigureDims
  composite?: CompositeScene
  coord?: CoordScene
  image?: string
}

export type PlayScene =
  | { type: 'stem'; before: string; after: string }
  | { type: 'column'; a: string; op: string; b: string }
  | { type: 'compare'; left: string; right: string }
  | { type: 'sequence'; cells: Array<{ text?: string; slotId?: string }> }
  | { type: 'order'; prompt: string; sep: string; slotIds: string[] }
  | {
      type: 'table'
      op: string
      cols: Array<{ text?: string; slotId?: string }>
      rows: Array<{ text?: string; slotId?: string; cells: Array<{ text?: string; slotId?: string }> }>
    }
  | { type: 'lines'; prompt: string; lines: Array<{ label: string; slotId: string }> }
  | { type: 'prompt'; text: string }
  | { type: 'images'; prompt: string }
  | { type: 'fraction'; kind: 'color' | 'read'; shape: NonNullable<MathItem['fracShape']> }

export type PlayRound = {
  key: string
  exerciseTitle: string
  instruction: string
  scene: PlayScene
  visual?: PlayVisual
  /** choice : entourer une pièce. slots : déposer. circle : entourer plusieurs images. color : colorier. look : à regarder ensemble. */
  mode: 'choice' | 'slots' | 'circle' | 'color' | 'look'
  choices?: PlayChip[]
  correctChoice?: string
  slots?: PlaySlot[]
  chips?: PlayChip[]
  /** Images à entourer. */
  pictures?: Array<{ id: string; image: string; correct: boolean; label: string }>
  /** Nombre de parts à colorier. */
  colorTarget?: number
}

/** Cartes de réponse, dans cet ordre : jaune, rouge, orange, bleu, vert, violet. */
export const PLAY_CARDS = ['Jaune', 'Rouge', 'Orange', 'Bleu', 'Vert', 'Violet'] as const

export function cardTone(index: number, seed = ''): number {
  const start = seed ? hash(seed) % PLAY_CARDS.length : 0
  return (start + index) % PLAY_CARDS.length
}

export function sameAnswer(a: string, b: string): boolean {
  const n = (s: string) =>
    s
      .normalize('NFC')
      .replace(/[−–]/g, '-')
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('fr')
  return n(a) === n(b)
}

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mix<T>(items: T[], seed: string): T[] {
  const out = [...items]
  let x = hash(seed) || 1
  for (let i = out.length - 1; i > 0; i--) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    const j = x % (i + 1)
    const tmp = out[i]!
    out[i] = out[j]!
    out[j] = tmp
  }
  return out
}

function chipsOf(labels: string[], seed: string, images?: Array<string | undefined>): PlayChip[] {
  return mix(
    labels.map((label, index) => ({
      id: `${seed}-${index}`,
      label,
      image: images?.[index],
      tone: 0,
    })),
    seed,
  ).map((chip, index) => ({ ...chip, tone: cardTone(index, seed) }))
}

function unique(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const key = value.normalize('NFC').trim()
    if (!key || seen.has(key.toLocaleLowerCase('fr'))) continue
    seen.add(key.toLocaleLowerCase('fr'))
    out.push(value.trim())
  }
  return out
}

function formatLike(sample: string, n: number): string {
  const shown = fmt(n)
  return sample.includes(',') ? shown : shown.replace(',', '.')
}

function tweak(answer: string, delta: number): string | null {
  const match = answer.match(/-?\d+(?:[.,]\d+)?/)
  if (!match || match.index == null) return null
  const n = Number(match[0].replace(',', '.'))
  if (!Number.isFinite(n)) return null
  const next = formatLike(match[0], n + delta)
  if (sameAnswer(next, match[0])) return null
  return answer.slice(0, match.index) + next + answer.slice(match.index + match[0].length)
}

function distractors(answer: string, siblings: string[]): string[] {
  const out: string[] = []
  const push = (value: string | null | undefined) => {
    if (!value || sameAnswer(value, answer) || out.some((item) => sameAnswer(item, value))) return
    out.push(value)
  }
  for (const delta of [1, -1, 2, -2, 10, -10, 3, 5]) push(tweak(answer, delta))
  for (const sibling of siblings) {
    if (sibling.length <= 42) push(sibling)
    if (out.length >= 3) break
  }
  return out.slice(0, 3)
}

function choiceLabels(answer: string, siblings: string[], seed: string): string[] {
  const wrong = distractors(answer, siblings)
  const pool = unique([answer, ...wrong])
  if (pool.length < 2) pool.push(sameAnswer(answer, 'oui') ? 'non' : 'oui')
  return mix(pool.slice(0, 4), seed)
}

function wordsOf(answer: string): string[] {
  return answer.trim().split(/\s+/).filter(Boolean)
}

function visualOf(item: MathItem): PlayVisual | undefined {
  const visual: PlayVisual = {}
  if (item.figure) {
    visual.figure = item.figure
    visual.dims = item.dims
  }
  if (item.compositeScene) visual.composite = item.compositeScene
  if (item.coordScene) visual.coord = item.coordScene
  if (item.tcf && 'image' in item.tcf && item.tcf.image) visual.image = item.tcf.image
  return visual.figure || visual.composite || visual.coord || visual.image ? visual : undefined
}

function base(
  partial: Omit<PlayRound, 'key' | 'exerciseTitle' | 'instruction'> & { key: string },
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
): PlayRound {
  return {
    ...partial,
    exerciseTitle: block.title,
    instruction: block.instruction,
  }
}

function asChoice(
  key: string,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  scene: PlayScene,
  answer: string,
  siblings: string[],
  visual?: PlayVisual,
  fixed?: string[],
): PlayRound {
  const labels = fixed?.length ? mix(unique(fixed), key) : choiceLabels(answer, siblings, key)
  return base(
    {
      key,
      scene,
      visual,
      mode: 'choice',
      correctChoice: answer,
      choices: chipsOf(labels, key),
    },
    block,
  )
}

function asSlots(
  key: string,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  scene: PlayScene,
  slots: PlaySlot[],
  labels: string[],
  visual?: PlayVisual,
): PlayRound {
  return base(
    {
      key,
      scene,
      visual,
      mode: 'slots',
      slots,
      chips: chipsOf(labels, `${key}-pieces`),
    },
    block,
  )
}

function asWords(
  key: string,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  prompt: string,
  answer: string,
  visual?: PlayVisual,
): PlayRound {
  const words = wordsOf(answer)
  const slots = words.map((word, index) => ({ id: `w${index}`, expected: word }))
  return asSlots(
    key,
    block,
    { type: 'order', prompt, sep: '', slotIds: slots.map((slot) => slot.id) },
    slots,
    words,
    visual,
  )
}

function adaptAnswer(
  key: string,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  prompt: string,
  answer: string,
  siblings: string[],
  visual?: PlayVisual,
): PlayRound {
  const words = wordsOf(answer)
  if (words.length >= 3 || (words.length >= 2 && answer.length > 22)) {
    return asWords(key, block, prompt, answer, visual)
  }
  return asChoice(key, block, { type: 'prompt', text: prompt }, answer, siblings, visual)
}

function tcfRounds(
  item: MathItem,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  key: string,
  siblings: string[],
): PlayRound[] | null {
  const tcf = item.tcf
  if (!tcf) return null
  return tcfItemRounds(tcf, block, key, siblings, visualOf(item))
}

function tcfItemRounds(
  tcf: TcfSheetItem,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  key: string,
  siblings: string[],
  visual?: PlayVisual,
): PlayRound[] {
  if (tcf.kind === 'support') return []
  if (tcf.kind === 'qcm') {
    const correct = tcf.choix.find((choice) => choice.correct)
    const answer = correct?.texte || correct?.lettre || ''
    if (!answer && !correct?.image) return []
    return [
      base(
        {
          key,
          scene: { type: 'prompt', text: tcf.enonce },
          visual: visual ?? (tcf.image ? { image: tcf.image } : undefined),
          mode: 'choice',
          correctChoice: answer || correct?.lettre || '',
          choices: tcf.choix.map((choice, index) => ({
            id: `${key}-${index}`,
            label: choice.texte || choice.lettre,
            image: choice.image,
            tone: cardTone(index, key),
          })),
        },
        block,
      ),
    ]
  }
  if (tcf.kind === 'audio_cadre') {
    return tcf.questions.flatMap((question, index) =>
      tcfItemRounds(
        question.kind === 'qcm'
          ? {
              kind: 'qcm',
              numero: question.numero,
              enonce: question.enonce,
              mode: question.mode,
              choix: question.choix,
              image: question.image,
            }
          : {
              kind: 'lignes',
              numero: question.numero,
              enonce: question.enonce,
              nbLignes: question.nbLignes,
              reponseModele: question.reponseModele || question.answer,
              image: question.image,
              tableau: question.tableau,
            },
        block,
        `${key}-q${index}`,
        siblings,
        question.image ? { image: question.image } : visual,
      ),
    )
  }
  if (tcf.kind === 'lignes') {
    if (tcf.tableau?.length) {
      const slots = tcf.tableau.map((row, index) => ({
        id: `t${index}`,
        expected: row.reponse,
        label: row.label,
      }))
      return [
        asSlots(
          key,
          block,
          { type: 'lines', prompt: tcf.enonce, lines: slots.map((slot) => ({ label: slot.label ?? '', slotId: slot.id })) },
          slots,
          slots.map((slot) => slot.expected),
          visual,
        ),
      ]
    }
    const answer = tcf.reponseModele?.trim() || ''
    if (!answer) {
      return [base({ key, scene: { type: 'prompt', text: tcf.enonce }, visual, mode: 'look' }, block)]
    }
    return [adaptAnswer(key, block, tcf.enonce, answer, siblings, visual)]
  }
  if (tcf.kind === 'images_a_cocher') {
    return [
      base(
        {
          key,
          scene: { type: 'images', prompt: tcf.consigne || 'Entourez les bonnes images.' },
          mode: 'circle',
          pictures: tcf.images.map((image, index) => ({
            id: image.id || `${key}-img${index}`,
            image: image.image,
            correct: image.correct,
            label: `Image ${index + 1}`,
          })),
        },
        block,
      ),
    ]
  }
  if (tcf.kind === 'association') {
    const pairs = tcf.situations.filter((situation) => situation.dialogue != null)
    if (!pairs.length) return []
    const slots = pairs.map((situation) => ({
      id: `d${situation.dialogue}`,
      expected: situation.lettre,
      label: `Dialogue ${situation.dialogue}`,
    }))
    return [
      asSlots(
        key,
        block,
        {
          type: 'lines',
          prompt: 'Déplacez chaque image vers son dialogue.',
          lines: slots.map((slot) => ({ label: slot.label ?? '', slotId: slot.id })),
        },
        slots,
        pairs.map((situation) => situation.lettre),
      ),
    ]
  }
  if (tcf.kind === 'formulaire') {
    const fields = tcf.champs.filter((field) => field.corrige?.trim())
    if (!fields.length) return []
    const slots = fields.map((field, index) => ({
      id: `f${index}`,
      expected: field.corrige,
      label: field.label,
    }))
    const labels = fields.flatMap((field) => unique([field.corrige, ...(field.options ?? [])]))
    return [
      asSlots(
        key,
        block,
        {
          type: 'lines',
          prompt: tcf.titre || 'Complétez le formulaire.',
          lines: slots.map((slot) => ({ label: slot.label ?? '', slotId: slot.id })),
        },
        slots,
        unique(labels),
      ),
    ]
  }
  if (tcf.kind === 'ecriture') {
    const answer = tcf.reponseModele?.trim()
    const prompt = tcf.consigneSupplementaire || 'À dire ensemble.'
    if (!answer) return [base({ key, scene: { type: 'prompt', text: prompt }, mode: 'look' }, block)]
    return [adaptAnswer(key, block, prompt, answer, siblings)]
  }
  if (tcf.kind === 'dialogue') {
    const line = tcf.repliques.find((reply) => reply.locuteur === 'eleve')
    if (!line?.texte.trim()) {
      return [base({ key, scene: { type: 'prompt', text: tcf.situation }, mode: 'look' }, block)]
    }
    if (line.variantes?.length) {
      return [asChoice(key, block, { type: 'prompt', text: tcf.situation }, line.texte, siblings, visual, [line.texte, ...line.variantes])]
    }
    return [adaptAnswer(key, block, tcf.situation, line.texte, siblings, visual)]
  }
  return []
}

function mathRound(
  item: MathItem,
  block: Pick<WorksheetBlock, 'title' | 'instruction'>,
  key: string,
  siblings: string[],
): PlayRound[] {
  const fromTcf = tcfRounds(item, block, key, siblings)
  if (fromTcf) return fromTcf
  const visual = visualOf(item)
  const prompt = (item.prompt ?? '').replace(/□/g, '').trim()

  if (item.fracShape) {
    const shape = item.fracShape
    if (shape.mode === 'color') {
      return [
        base(
          {
            key,
            scene: { type: 'fraction', kind: 'color', shape },
            visual,
            mode: 'color',
            colorTarget: shape.n,
          },
          block,
        ),
      ]
    }
    const answer = `${shape.n}/${shape.d}`
    const alts = [1, 2, 3]
      .map((delta) => `${Math.min(shape.d, Math.max(0, shape.n + (delta % 2 === 0 ? delta : -delta)))}/${shape.d}`)
      .filter((label) => label !== answer)
    return [asChoice(key, block, { type: 'fraction', kind: 'read', shape }, answer, siblings, visual, [answer, ...alts])]
  }

  if (item.layout === 'compare' && item.left && item.right) {
    return [
      asChoice(
        key,
        block,
        { type: 'compare', left: item.left, right: item.right },
        item.answer,
        siblings,
        visual,
        ['<', '=', '>'],
      ),
    ]
  }

  if (item.layout === 'order' && (item.placeParts?.length || item.sequence?.length)) {
    const ordered = item.placeParts?.length ? item.placeParts : [...(item.sequence ?? [])]
    const given = item.sequence?.length ? item.sequence : ordered
    const slots = ordered.map((part, index) => ({ id: `o${index}`, expected: part }))
    return [
      asSlots(
        key,
        block,
        {
          type: 'order',
          prompt: item.prompt || 'Rangez les nombres.',
          sep: item.orderOp === '>' ? '>' : '<',
          slotIds: slots.map((slot) => slot.id),
        },
        slots,
        given,
        visual,
      ),
    ]
  }

  if (item.layout === 'sequence' && item.sequence?.length) {
    const missing = item.answer.split(/\s*;\s*/).filter(Boolean)
    let cursor = 0
    const slots: PlaySlot[] = []
    const cells = item.sequence.map((cell, index) => {
      const blank = cell === '□' || item.blankIndexes?.includes(index)
      if (!blank) return { text: cell }
      const expected = missing[cursor] ?? ''
      const slotId = `s${cursor}`
      cursor += 1
      slots.push({ id: slotId, expected })
      return { slotId }
    })
    if (slots.length) {
      return [asSlots(key, block, { type: 'sequence', cells }, slots, slots.map((slot) => slot.expected), visual)]
    }
  }

  if (item.opTable) {
    const table = item.opTable
    const slots: PlaySlot[] = []
    const cols = table.cols.map((col, index) => {
      if (!table.colBlank[index]) return { text: fmt(col) }
      const slotId = `c${index}`
      slots.push({ id: slotId, expected: fmt(col) })
      return { slotId }
    })
    const rows = table.rows.map((row, r) => {
      let rowCell: { text?: string; slotId?: string }
      if (table.rowBlank[r]) {
        const slotId = `r${r}`
        slots.push({ id: slotId, expected: fmt(row) })
        rowCell = { slotId }
      } else rowCell = { text: fmt(row) }
      const cells = table.cols.map((col, c) => {
        if (!table.cellBlank[r]?.[c]) return { text: fmt(opTableCell(table.op, row, col)) }
        const slotId = `x${r}-${c}`
        slots.push({ id: slotId, expected: fmt(opTableCell(table.op, row, col)) })
        return { slotId }
      })
      return { ...rowCell, cells }
    })
    if (slots.length) {
      return [
        asSlots(
          key,
          block,
          { type: 'table', op: table.op, cols, rows },
          slots,
          slots.map((slot) => slot.expected),
          visual,
        ),
      ]
    }
  }

  if (item.propertyLines?.length) {
    const slots = item.propertyLines.map((line, index) => ({
      id: `p${index}`,
      expected: line.answer,
      label: line.label,
    }))
    return [
      asSlots(
        key,
        block,
        {
          type: 'lines',
          prompt: prompt || 'Complétez.',
          lines: slots.map((slot) => ({ label: slot.label ?? '', slotId: slot.id })),
        },
        slots,
        slots.map((slot) => slot.expected),
        visual,
      ),
    ]
  }

  if (item.layout === 'phrase-order' && item.tokens?.length) {
    const expectedWords = wordsOf(item.answer)
    const tokenWords = item.tokens.map((token) => token.text)
    const solution =
      expectedWords.length === tokenWords.length ? expectedWords : tokenWords
    const slots = solution.map((word, index) => ({ id: `w${index}`, expected: word }))
    return [
      asSlots(
        key,
        block,
        { type: 'order', prompt: prompt || 'Remettez la phrase dans l’ordre.', sep: '', slotIds: slots.map((slot) => slot.id) },
        slots,
        tokenWords,
        visual,
      ),
    ]
  }

  if (item.options?.length && item.answer) {
    return [
      asChoice(
        key,
        block,
        { type: 'prompt', text: prompt || item.answer },
        item.answer,
        siblings,
        visual,
        item.options.includes(item.answer) ? item.options : [item.answer, ...item.options],
      ),
    ]
  }

  if (item.coordQuestions?.length) {
    return item.coordQuestions.map((question, index) =>
      adaptAnswer(`${key}-cq${index}`, block, question.prompt, question.answer, siblings, visual),
    )
  }

  if (item.a != null && item.b != null && item.op) {
    const missing = item.missing ?? 'result'
    const aText = missing === 'a' ? '' : fmt(item.a)
    const bText = missing === 'b' ? '' : fmt(item.b)
    const resultText = missing === 'result' ? '' : fmt(item.result ?? item.a)
    const scene =
      item.layout === 'column' || item.layout === 'column-empty' || item.layout === 'division-column'
        ? ({ type: 'column', a: fmt(item.a), op: item.op, b: fmt(item.b) } as const)
        : missing === 'a'
          ? { type: 'stem' as const, before: '', after: `${item.op} ${bText} = ${resultText}`.trim() }
          : missing === 'b'
            ? { type: 'stem' as const, before: `${aText} ${item.op}`, after: `= ${resultText}`.trim() }
            : { type: 'stem' as const, before: `${aText} ${item.op} ${bText} =`, after: '' }
    const labels = choiceLabels(item.answer, siblings, key)
    return [
      asSlots(
        key,
        block,
        scene,
        [{ id: 'answer', expected: item.answer }],
        labels,
        visual,
      ),
    ]
  }

  if (item.calcAnswer || item.calcAnswerSecondary) {
    const slots: PlaySlot[] = []
    if (item.calcAnswer) slots.push({ id: 'calc', expected: item.calcAnswer, label: 'Résultat' })
    if (item.calcAnswerSecondary) slots.push({ id: 'calc2', expected: item.calcAnswerSecondary, label: 'Deuxième résultat' })
    const labels =
      slots.length === 1
        ? choiceLabels(slots[0]!.expected, siblings, key)
        : slots.map((slot) => slot.expected)
    return [
      asSlots(
        key,
        block,
        {
          type: 'lines',
          prompt: prompt || 'Déplacez la réponse.',
          lines: slots.map((slot) => ({ label: slot.label ?? '', slotId: slot.id })),
        },
        slots,
        labels,
        visual,
      ),
    ]
  }

  if (item.answer?.trim()) {
    const text = prompt || block.instruction || 'Choisissez la réponse.'
    return [adaptAnswer(key, block, text, item.answer, siblings, visual)]
  }

  if (prompt || visual) {
    return [base({ key, scene: { type: 'prompt', text: prompt || block.instruction }, visual, mode: 'look' }, block)]
  }
  return []
}

export function buildPlayRounds(sheet: WorksheetPage | undefined): PlayRound[] {
  if (!sheet) return []
  const blocks = sheet.blocks?.length
    ? sheet.blocks
    : [{ title: sheet.title, instruction: sheet.instruction, items: sheet.items ?? [] }]
  const siblings: string[] = []
  for (const block of blocks) {
    for (const item of block.items ?? []) {
      if (item.answer && item.answer.length <= 42) siblings.push(item.answer)
      for (const line of item.propertyLines ?? []) siblings.push(line.answer)
    }
  }
  const rounds: PlayRound[] = []
  blocks.forEach((block, blockIndex) => {
    ;(block.items ?? []).forEach((item, itemIndex) => {
      const key = `${blockIndex}-${itemIndex}`
      rounds.push(
        ...mathRound(
          item,
          { title: block.title || sheet.title, instruction: block.instruction || sheet.instruction },
          key,
          siblings,
        ),
      )
    })
  })
  return rounds.map((round, index) => ({ ...round, key: `${round.key}-${index}` }))
}
