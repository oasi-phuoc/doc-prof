// Branche type à intégrer dans generate.ts (exemple)
// Remplacer __id__ et adapter les bornes.

function generate__Id__(rng: Rng, count: number): MathItem[] {
  const items: MathItem[] = []
  for (let i = 0; i < count; i++) {
    const a = int(rng, 10, 99)
    const b = int(rng, 10, 99)
    const result = a + b
    items.push({
      layout: 'inline',
      prompt: `${a} + ${b} =`,
      answer: String(result),
    })
  }
  return items
}
