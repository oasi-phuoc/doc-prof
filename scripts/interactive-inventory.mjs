import { createServer } from 'vite'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
const server = await createServer({
  cacheDir: '/tmp/clairfle-inventory-cache',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})
try {
  const { exerciseTypes, topicById, defaultPage } = await server.ssrLoadModule(
    '/src/math/catalog.ts',
  )
  const { buildPage } = await server.ssrLoadModule('/src/math/generate.ts')
  const { convertRecipe } = await server.ssrLoadModule(
    '/src/interactive/domain/convert.ts',
  )
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const seed = 20261107
  const base = demoRecipe()
  const rows = []
  const variants = exerciseTypes.flatMap((type) => {
    const domain = topicById[type.topic]?.domain
    return (domain === 'tpf' ? ['tpf', 'tcf-csc', 'tcf-cfr'] : [domain]).map(
      (domain) => ({ type, domain }),
    )
  })
  for (const { type, domain } of variants) {
    if (!domain) {
      rows.push({
        id: type.id,
        compatibility: 'unsupported',
        error: 'Thème absent',
      })
      continue
    }
    const config = {
      ...defaultPage(domain),
      topic: type.topic,
      exerciseType: type.id,
      count: 2,
      extraBlocks: undefined,
      libreItems: undefined,
    }
    try {
      const page = buildPage(config, seed)
      const items = page.blocks.flatMap((b) => b.items)
      const game = convertRecipe({
        ...base,
        pages: [config],
        libreMode: false,
        seed,
      })
      const modes = [...new Set(game.questions.map((q) => q.compatibility))]
      rows.push({
        id: type.id,
        domain,
        topic: type.topic,
        label: type.label,
        seed,
        config,
        layouts: [...new Set(items.map((i) => i.layout))],
        tcfKinds: [...new Set(items.map((i) => i.tcf?.kind).filter(Boolean))],
        sourceItems: items.length,
        playableQuestions: game.questions.length,
        compatibility: modes.length ? modes : ['unsupported'],
        issues: game.issues,
        fields: [...new Set(items.flatMap((i) => Object.keys(i)))].sort(),
        sourceFixture: items.slice(0, 2),
      })
    } catch (error) {
      rows.push({
        id: type.id,
        domain,
        config,
        compatibility: ['unsupported'],
        error: error.message,
      })
    }
  }
  const source = await readFile('src/math/types.ts', 'utf8')
  const declaredLayouts = [
    ...source
      .slice(
        source.indexOf('export type Layout'),
        source.indexOf('export type Layout') + 4000,
      )
      .split(/\n\n/)[0]
      .matchAll(/'([^']+)'/g),
  ].map((m) => m[1])
  const observedLayouts = [
    ...new Set(rows.flatMap((r) => r.layouts ?? [])),
  ].sort()
  const declaredDomains = [
    ...source
      .split('export type Domain =')[1]
      .split('/**')[0]
      .matchAll(/'([^']+)'/g),
  ].map((m) => m[1])
  const report = {
    schemaVersion: 1,
    seed,
    scope:
      'Un tirage réel par type de catalogue, count=2, niveau par défaut. Ne garantit pas les autres graines, variantes et niveaux.',
    summary: {
      types: rows.length,
      catalogTypes: exerciseTypes.length,
      declaredDomains,
      domainsWithoutCatalogTopic: declaredDomains.filter(
        (domain) => !rows.some((row) => row.domain === domain),
      ),
      domains: [...new Set(rows.map((r) => r.domain).filter(Boolean))],
      observedLayouts,
      declaredLayouts,
      unobservedLayouts: declaredLayouts.filter(
        (l) => !observedLayouts.includes(l),
      ),
      playableTypes: rows.filter((r) => r.playableQuestions > 0).length,
      generationErrors: rows.filter((r) => r.error).length,
    },
    rows,
  }
  await mkdir('docs/interactive', { recursive: true })
  await writeFile(
    'docs/interactive/inventory.json',
    JSON.stringify(report, null, 2) + '\n',
  )
  await writeFile(
    'docs/interactive/demo-fixture.json',
    JSON.stringify(convertRecipe(base, 'Les cartes de la classe'), null, 2) +
      '\n',
  )
  await writeFile(
    'docs/interactive/demo-source-recipe.json',
    JSON.stringify(base, null, 2) + '\n',
  )
  console.log(JSON.stringify(report.summary, null, 2))
} finally {
  await server.close()
}
