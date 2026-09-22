export type Rng = () => number

export function randomSeed(): number {
  return Date.now() + Math.floor(Math.random() * 1_000_000)
}

export function createRng(seed: number): Rng {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
}

export function int(rng: Rng, min: number, max: number): number {
  if (max < min) return min
  return Math.floor(rng() * (max - min + 1)) + min
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[int(rng, 0, items.length - 1)]!
}

export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = int(rng, 0, i)
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}
