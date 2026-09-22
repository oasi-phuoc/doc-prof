import type { Difficulty } from './types'
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'
import { PROBLEM_BANKS, type ProblemBankEntry, type ProblemOp } from './problem-banks'

export type ProblemKind =
  | 'addition'
  | 'soustraction'
  | 'multiplication'
  | 'division'
  | 'add-sub'
  | 'melange'

function problem(prompt: string, calc: string, response: string): MathItem {
  return {
    layout: 'text',
    prompt: polishFrench(prompt),
    calcAnswer: calc,
    responseAnswer: response,
    answer: `${calc} = ${response}`,
  }
}

/** Accents / typographie scolaire (banques générées en ASCII sûr). */
function polishFrench(s: string): string {
  return s
    .replace(/a l’/g, 'à l’')
    .replace(/a la /g, 'à la ')
    .replace(/L’apres/g, 'L’après')
    .replace(/l’apres/g, 'l’après')
    .replace(/apres/g, 'après')
    .replace(/eleve/g, 'élève')
    .replace(/eleves/g, 'élèves')
    .replace(/ecole/g, 'école')
    .replace(/mediatheque/g, 'médiathèque')
    .replace(/bibliotheque/g, 'bibliothèque')
    .replace(/depot/g, 'dépôt')
    .replace(/Depot/g, 'Dépôt')
    .replace(/equipes/g, 'équipes')
    .replace(/egalement/g, 'également')
    .replace(/egaux/g, 'égaux')
    .replace(/reunit/g, 'réunit')
    .replace(/prets/g, 'prêts')
    .replace(/prete/g, 'prête')
    .replace(/pretes/g, 'prêtés')
    .replace(/reserve/g, 'réserve')
    .replace(/reserves/g, 'réservés')
    .replace(/reservees/g, 'réservées')
    .replace(/numero/g, 'numéro')
    .replace(/fevrier/g, 'février')
    .replace(/aout/g, 'août')
    .replace(/decembre/g, 'décembre')
    .replace(/annee/g, 'année')
    .replace(/gateaux/g, 'gâteaux')
    .replace(/oeufs/g, 'œufs')
    .replace(/etageres/g, 'étagères')
    .replace(/etagere/g, 'étagère')
    .replace(/recreation/g, 'récréation')
    .replace(/preau/g, 'préau')
    .replace(/aere/g, 'aéré')
    .replace(/defi/g, 'défi')
    .replace(/desistent/g, 'désistent')
    .replace(/desistent/g, 'désistent')
    .replace(/evenement/g, 'événement')
    .replace(/marche/g, 'marché')
    .replace(/musee/g, 'musée')
    .replace(/medailles/g, 'médailles')
    .replace(/legos/g, 'légos')
    .replace(/boites/g, 'boîtes')
    .replace(/boite/g, 'boîte')
    .replace(/repartit/g, 'répartit')
    .replace(/repartir/g, 'répartir')
    .replace(/Recoit/g, 'Reçoit')
    .replace(/recoit/g, 'reçoit')
    .replace(/achete/g, 'achète')
    .replace(/Achete/g, 'Achète')
    .replace(/depense/g, 'dépense')
    .replace(/enleve/g, 'enlève')
    .replace(/enleve/g, 'enlève')
    .replace(/recupere/g, 'récupère')
    .replace(/possede/g, 'possède')
    .replace(/deplace/g, 'déplace')
    .replace(/gere/g, 'gère')
    .replace(/prepare/g, 'prépare')
    .replace(/prepares/g, 'préparés')
    .replace(/prevu/g, 'prévu')
    .replace(/prevus/g, 'prévus')
    .replace(/prevoyait/g, 'prévoyait')
    .replace(/matiere/g, 'matière')
    .replace(/materiel/g, 'matériel')
    .replace(/entrees/g, 'entrées')
    .replace(/athletes/g, 'athlètes')
    .replace(/seances/g, 'séances')
    .replace(/unites/g, 'unités')
    .replace(/equitablement/g, 'équitablement')
    .replace(/ — /g, ' — ')
}

function bounds(d: Difficulty) {
  if (d === 'facile') return { lo: 2, mid: 20, hi: 40 }
  if (d === 'moyen') return { lo: 10, mid: 120, hi: 400 }
  return { lo: 40, mid: 500, hi: 2500 }
}

function fillPrompt(tpl: string, vals: Record<string, number>): string {
  return tpl
    .replace(/\{a\}/g, String(vals.a ?? ''))
    .replace(/\{b\}/g, String(vals.b ?? ''))
    .replace(/\{c\}/g, String(vals.c ?? ''))
}

function numsFor(rng: Rng, d: Difficulty, op: ProblemOp): {
  vals: Record<string, number>
  calc: string
  response: string
} {
  const b = bounds(d)
  if (op === '+') {
    const a = int(rng, b.lo, b.hi)
    const c = int(rng, b.lo, b.mid)
    return { vals: { a, b: c }, calc: `${a} + ${c}`, response: String(a + c) }
  }
  if (op === '-') {
    const a = int(rng, b.mid, b.hi)
    const c = int(rng, b.lo, Math.max(b.lo, Math.min(b.mid, a - 1)))
    return { vals: { a, b: c }, calc: `${a} − ${c}`, response: String(a - c) }
  }
  if (op === '*') {
    const a = int(rng, d === 'facile' ? 2 : 3, d === 'avance' ? 24 : 12)
    const c = int(rng, d === 'facile' ? 2 : 4, d === 'avance' ? 40 : 20)
    return { vals: { a, b: c }, calc: `${a} × ${c}`, response: String(a * c) }
  }
  if (op === '/') {
    const divisor = int(rng, 2, d === 'avance' ? 12 : 9)
    const quot = int(rng, 2, d === 'facile' ? 12 : d === 'moyen' ? 40 : 80)
    const dividend = divisor * quot
    return {
      vals: { a: dividend, b: divisor },
      calc: `${dividend} ÷ ${divisor}`,
      response: String(quot),
    }
  }
  if (op === '+-') {
    const a = int(rng, b.mid, b.hi)
    const add = int(rng, b.lo, b.mid)
    const sub = int(rng, b.lo, Math.max(b.lo, Math.min(a + add - 1, b.mid)))
    const result = a + add - sub
    return {
      vals: { a, b: add, c: sub },
      calc: `${a} + ${add} − ${sub}`,
      response: String(result),
    }
  }
  if (op === '*-') {
    const a = int(rng, 2, d === 'avance' ? 20 : 10)
    const c = int(rng, 2, d === 'avance' ? 30 : 12)
    const product = a * c
    const sub = int(rng, 1, Math.max(1, Math.floor(product / 3)))
    return {
      vals: { a, b: c, c: sub },
      calc: `${a} × ${c} − ${sub}`,
      response: String(product - sub),
    }
  }
  if (op === '+*') {
    const a = int(rng, b.lo, b.mid)
    const packs = int(rng, 2, d === 'avance' ? 12 : 8)
    const per = int(rng, 2, d === 'avance' ? 20 : 10)
    // Templates: "{a} ... {b} paquets de {c}" or "{a} unitaires et {b} lots de {c}"
    return {
      vals: { a, b: packs, c: per },
      calc: `${a} + ${packs} × ${per}`,
      response: String(a + packs * per),
    }
  }
  if (op === '++/') {
    const a = int(rng, b.lo, b.mid)
    const add = int(rng, b.lo, b.mid)
    const groups = int(rng, 2, d === 'avance' ? 12 : 8)
    const total = a + add
    // Ensure divisible when possible
    const adjusted = total - (total % groups)
    const a2 = Math.max(b.lo, adjusted - add)
    return {
      vals: { a: a2, b: add, c: groups },
      calc: `(${a2} + ${add}) ÷ ${groups}`,
      response: String((a2 + add) / groups),
    }
  }
  // '-*' : a - b*c
  {
    const per = int(rng, 2, d === 'avance' ? 15 : 10)
    const boxes = int(rng, 2, d === 'avance' ? 20 : 10)
    const product = per * boxes
    const start = product + int(rng, b.lo, b.mid)
    return {
      vals: { a: start, b: boxes, c: per },
      calc: `${start} − ${boxes} × ${per}`,
      response: String(start - product),
    }
  }
}

function fromEntry(rng: Rng, d: Difficulty, entry: ProblemBankEntry): MathItem {
  const { vals, calc, response } = numsFor(rng, d, entry.op)
  return problem(fillPrompt(entry.prompt, vals), calc, response)
}

function bankKey(kind: ProblemKind, difficulty: Difficulty): string {
  return `${kind}:${difficulty}`
}

export function makeWordProblem(rng: Rng, difficulty: Difficulty, kind: ProblemKind): MathItem {
  const key = bankKey(kind, difficulty)
  const bank = PROBLEM_BANKS[key]
  if (!bank || bank.length === 0) {
    throw new Error(`Banque de problèmes manquante : ${key}`)
  }
  return fromEntry(rng, difficulty, pick(rng, bank))
}

/** Vérification runtime (tests / scripts) : ≥100 prompts uniques / cellule (issus de 50 frames). */
export function assertProblemBanksIntegrity(): { cells: number; prompts: number } {
  const keys = Object.keys(PROBLEM_BANKS)
  const all = new Set<string>()
  for (const key of keys) {
    const bank = PROBLEM_BANKS[key]!
    if (bank.length < 100) throw new Error(`${key} : ${bank.length} < 100`)
    const local = new Set(bank.map((e) => e.prompt))
    if (local.size !== bank.length) throw new Error(`${key} : doublons internes`)
    for (const p of local) {
      if (all.has(p)) throw new Error(`Prompt dupliqué entre cellules : ${p.slice(0, 60)}`)
      all.add(p)
    }
  }
  return { cells: keys.length, prompts: all.size }
}
