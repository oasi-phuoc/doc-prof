import { int, type Rng } from '@/math/rng'

/**
 * Mélange les éléments non `fixe` entre eux ; les `fixe` gardent leur place.
 * Déterministe : même graine (même `rng`) ⇒ même ordre, donc fiche élève
 * et corrigé toujours synchronisés.
 */
export function melangerChoix<T extends { fixe?: boolean }>(
  items: readonly T[],
  rng: Rng,
  melanger = true,
): T[] {
  if (!melanger) return [...items]
  const libres = items.filter((c) => !c.fixe)
  for (let i = libres.length - 1; i > 0; i--) {
    const j = int(rng, 0, i)
    ;[libres[i], libres[j]] = [libres[j]!, libres[i]!]
  }
  let k = 0
  return items.map((c) => (c.fixe ? c : libres[k++]!))
}
