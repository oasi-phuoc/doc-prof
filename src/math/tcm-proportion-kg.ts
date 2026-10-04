/**
 * TCM ex. 31 — règle de trois (masses en kg).
 * 25 modèles : « n kg de … coûtent … ; combien pour m kg ? »
 * n, m ∈ [10 ; 99], ni n|m ni m|n ; prix unitaires entiers (CHF).
 */
import { int, type Rng } from './rng'
import type { MathItem } from './types'

export type ProportionKgTemplate = {
  id: string
  /** Produit / matière (sans article). */
  product: string
  /** Article + produit pour l’énoncé (ex. « de farine », « de pommes »). */
  ofProduct: string
}

/** 25 modèles distincts (produits / formulations). */
export const TCM_PROPORTION_KG_TEMPLATES: readonly ProportionKgTemplate[] = [
  { id: 'k01', product: 'farine', ofProduct: 'de farine' },
  { id: 'k02', product: 'riz', ofProduct: 'de riz' },
  { id: 'k03', product: 'pommes', ofProduct: 'de pommes' },
  { id: 'k04', product: 'carottes', ofProduct: 'de carottes' },
  { id: 'k05', product: 'pommes de terre', ofProduct: 'de pommes de terre' },
  { id: 'k06', product: 'sucre', ofProduct: 'de sucre' },
  { id: 'k07', product: 'sel', ofProduct: 'de sel' },
  { id: 'k08', product: 'café', ofProduct: 'de café' },
  { id: 'k09', product: 'thé', ofProduct: 'de thé' },
  { id: 'k10', product: 'blé', ofProduct: 'de blé' },
  { id: 'k11', product: 'maïs', ofProduct: 'de maïs' },
  { id: 'k12', product: 'oranges', ofProduct: 'd’oranges' },
  { id: 'k13', product: 'bananes', ofProduct: 'de bananes' },
  { id: 'k14', product: 'tomates', ofProduct: 'de tomates' },
  { id: 'k15', product: 'oignons', ofProduct: 'd’oignons' },
  { id: 'k16', product: 'fromage', ofProduct: 'de fromage' },
  { id: 'k17', product: 'beurre', ofProduct: 'de beurre' },
  { id: 'k18', product: 'ciment', ofProduct: 'de ciment' },
  { id: 'k19', product: 'sable', ofProduct: 'de sable' },
  { id: 'k20', product: 'ferraille', ofProduct: 'de ferraille' },
  { id: 'k21', product: 'charbon', ofProduct: 'de charbon' },
  { id: 'k22', product: 'pellets', ofProduct: 'de pellets' },
  { id: 'k23', product: 'terreau', ofProduct: 'de terreau' },
  { id: 'k24', product: 'engrais', ofProduct: 'd’engrais' },
  { id: 'k25', product: 'semences', ofProduct: 'de semences' },
]

export const TCM_PROPORTION_KG_COUNT = TCM_PROPORTION_KG_TEMPLATES.length

function divides(a: number, b: number): boolean {
  return a !== 0 && b % a === 0
}

/** Deux masses 10–99 telles que ni l’une ni l’autre ne divise l’autre. */
export function pickIndepKgPair(rng: Rng): { kgA: number; kgB: number } {
  for (let attempt = 0; attempt < 80; attempt++) {
    const kgA = int(rng, 10, 99)
    let kgB = int(rng, 10, 99)
    while (kgB === kgA) kgB = int(rng, 10, 99)
    if (!divides(kgA, kgB) && !divides(kgB, kgA)) {
      return { kgA, kgB }
    }
  }
  // Repli déterministe rare (15 ∤ 28, 28 ∤ 15).
  return { kgA: 15, kgB: 28 }
}

function fillTemplate(
  tpl: ProportionKgTemplate,
  rng: Rng,
): { prompt: string; calcAnswer: string; responseAnswer: string; answer: string } {
  const { kgA, kgB } = pickIndepKgPair(rng)
  // Prix unitaire 2–9 CHF/kg → totaux entiers raisonnables.
  const unit = int(rng, 2, 9)
  const priceA = unit * kgA
  const priceB = unit * kgB
  const prompt = `${kgA} kg ${tpl.ofProduct} coûtent ${priceA} CHF. Combien coûtent ${kgB} kg ${tpl.ofProduct} ?`
  const calcAnswer = `${priceA} × ${kgB} ÷ ${kgA}`
  const responseAnswer = `${priceB} CHF`
  return { prompt, calcAnswer, responseAnswer, answer: responseAnswer }
}

/** Lot TCM ex. 31 : 2 questions, modèles distincts parmi 25. */
export function generateTcmProportionKgBatch(rng: Rng, count = 2): MathItem[] {
  const n = Math.max(1, Math.min(count, TCM_PROPORTION_KG_TEMPLATES.length))
  const pool = [...TCM_PROPORTION_KG_TEMPLATES]
  const picked: ProportionKgTemplate[] = []
  for (let i = 0; i < n; i++) {
    const idx = int(rng, 0, pool.length - 1)
    picked.push(pool.splice(idx, 1)[0]!)
  }
  return picked.map((tpl) => {
    const filled = fillTemplate(tpl, rng)
    return {
      layout: 'text' as const,
      prompt: filled.prompt,
      calcAnswer: filled.calcAnswer,
      responseAnswer: filled.responseAnswer,
      answer: filled.answer,
    }
  })
}
