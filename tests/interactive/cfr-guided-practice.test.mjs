import assert from 'node:assert/strict'
import test from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  resolve: { alias: { '@': resolve('src') } },
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const cfr = await server.ssrLoadModule('/src/math/cfr-guided-practice.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, typesForTopic } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { supportsActivityDifficulty } = await server.ssrLoadModule('/src/components/generator/activity-settings.ts')

  await test('les six exercices guidés sont accessibles et leur calcul tient aux trois niveaux', () => {
    assert.equal(cfr.CFR_GUIDED_TYPES.length, 6)
    for (const { id, topic } of cfr.CFR_GUIDED_TYPES) {
      assert.ok(typesForTopic(topic).some(type => type.id === id))
      assert.ok(supportsActivityDifficulty(id, 2), id)
      const domain = topic === 'transformations' ? 'géométrie' : 'algèbre'
      for (const difficulty of ['facile', 'moyen', 'avance']) {
        const config = { ...defaultPage(domain), topic, exerciseType: id, difficulty, count: 2 }
        for (let seed = 1; seed <= 128; seed++) {
          const sheets = buildWorksheets([config], seed * 239)
          const items = sheets.flatMap(sheet => sheet.items)
          assert.equal(items.length, 2, id)
          assert.deepEqual(items.map(({ cfrGuided }) => cfrGuided.guided), [true, false], id)
          for (const { cfrGuided, answer } of items) {
            assert.equal(answer, cfr.cfrSolution(cfrGuided).join('\n'))
            assert.notDeepEqual(cfr.cfrExample(cfrGuided), cfrGuided)
            const p = cfrGuided
            if (p.kind === 'fraction') {
              assert.equal(p.total % p.denominator, 0)
              assert(p.numerator > 0 && p.numerator < p.denominator)
              assert.match(answer, new RegExp(`= ${(p.total / p.denominator) * p.numerator} jetons\\.`))
            } else if (p.kind === 'graph') {
              assert.equal(p.values.length, 4)
              assert.equal(new Set(p.values).size, 4)
              assert(p.values.every(v => v % p.step === 0 && v <= 5 * p.step))
              if (difficulty === 'avance') {
                assert.notEqual(p.day, p.compareWith)
                assert.match(answer, new RegExp(`= ${Math.abs(p.values[p.day] - p.values[p.compareWith])} `))
              } else {
                assert.equal(p.compareWith, undefined)
                assert.match(answer, new RegExp(`lis ${p.values[p.day]} `))
              }
            } else if (p.kind === 'equation') {
              const right = p.coefficient * p.solution + p.offset
              assert.equal(Number(cfr.equationText(p).split(' = ')[1]), right)
              assert.match(answer, new RegExp(`x = ${p.solution}\\.`))
              if (difficulty === 'avance') assert(p.coefficient > 1 && p.offset !== 0)
            } else {
              const { center: [cx, cy], columns, rows } = cfr.CFR_GRID
              const image = p.points.map(point => cfr.transformedPoint(point, p))
              for (const [[x, y], [u, v]] of p.points.map((point, i) => [point, image[i]])) {
                assert(u > 0 && u < columns && v > 0 && v < rows)
                assert.equal((u - cx) ** 2 + (v - cy) ** 2, (x - cx) ** 2 + (y - cy) ** 2)
                if (p.kind === 'axiale') assert.deepEqual([u,v], p.horizontal ? [x, 2 * cy - y] : [2 * cx - x, y])
                if (p.kind === 'centrale') assert.deepEqual([u,v], [2 * cx - x, 2 * cy - y])
                if (p.kind === 'rotation') {
                  assert.equal((x - cx) * (u - cx) + (y - cy) * (v - cy), 0)
                  assert.equal(Math.sign((x - cx) * (v - cy) - (y - cy) * (u - cx)), p.clockwise ? 1 : -1)
                }
              }
            }
          }
          assert.deepEqual(buildWorksheets([config], seed * 239).flatMap(sheet => sheet.items), items)
        }
      }
    }
  })
} finally {
  await server.close()
}
