import { isDeepStrictEqual } from 'node:util'

export async function auditRecipes(server, profile, seed) {
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { parseFicheRecipe, buildFicheRecipe } = await server.ssrLoadModule('/src/fiches/recipe.ts')
  const addition = defaultPage('algèbre')
  const items = buildWorksheets([addition], seed)[0].items
  const edited = { ...items[0], a: 17, b: 25, result: 42, prompt: '17 + 25 = □', answer: '42' }
  const imageOverrides = { '/lib/images/témoin.webp': '/lib/images/témoin-remplacement.webp' }
  const witnesses = [
    {
      id: 'tcm-vers-tpm',
      page: { ...defaultPage('tpm'), domain: 'tcm' },
      expected: { domain: 'tpm' },
    },
    {
      id: 'tcf-vers-tpf',
      page: { ...defaultPage('tpf'), domain: 'tcf' },
      expected: { domain: 'tpf' },
    },
    {
      id: 'gattegno-negation',
      page: {
        ...defaultPage('gattegno'),
        topic: 'phrase-negation',
        exerciseType: defaultPage('gattegno').exerciseType.replace('phrase-simple', 'phrase-negation'),
      },
      expected: { topic: 'phrase-simple', phrasePolarity: 'negative' },
    },
    {
      id: 'grammaire-co-historique',
      page: { ...defaultPage('grammaire'), topic: 'gram-se-presenter', exerciseType: 'gram-ex-a1-co-audio' },
      expected: { exerciseType: 'gram-ex-a1-co-theme', grammarCoLevel: 'A1' },
    },
    ...['calli-4-lignes', 'calli-6-lignes'].map((exerciseType) => ({
      id: exerciseType,
      page: { ...defaultPage('calligraphie'), exerciseType },
      expected: { exerciseType },
    })),
    {
      id: 'libre-instantane-et-image',
      page: { ...addition, libreItems: [edited, ...items.slice(1)] },
      expected: { libreItems: [edited, ...items.slice(1)] },
      options: { libreMode: true, libreSnapshot: [addition], imageOverrides },
    },
  ]
  const rows = witnesses.map(({ id, page, expected, options }) => {
    const original = {
      version: 1,
      pages: [page],
      seed,
      institutional: {},
      evalMode: false,
      pointsPerQuestion: 1,
      libreMode: false,
      libreSnapshot: null,
      ...options,
    }
    try {
      const loaded = parseFicheRecipe(JSON.parse(JSON.stringify(original)))
      if (!loaded) return { id, status: 'échoué', reason: 'recette v1 refusée' }
      const matchesExpected = Object.entries(expected).every(([key, value]) =>
        isDeepStrictEqual(loaded.pages[0][key], value),
      )
      const roundTrip = parseFicheRecipe(JSON.parse(JSON.stringify(buildFicheRecipe(loaded))))
      if (!roundTrip) return { id, status: 'échoué', reason: 'recette réécrite refusée' }
      const before = buildWorksheets(loaded.pages, loaded.seed)
      const after = buildWorksheets(roundTrip.pages, roundTrip.seed)
      const sameContent = isDeepStrictEqual(before.map(({ items }) => items), after.map(({ items }) => items))
      const sameLibreData = isDeepStrictEqual(loaded.libreSnapshot, roundTrip.libreSnapshot) &&
        isDeepStrictEqual(loaded.imageOverrides, options?.imageOverrides) &&
        isDeepStrictEqual(loaded.imageOverrides, roundTrip.imageOverrides) &&
        loaded.libreMode === roundTrip.libreMode
      const editConsumed = !options || before[0].items.some(({ a, b, result, answer }) =>
        a === edited.a && b === edited.b && result === edited.result && answer === edited.answer,
      )
      return {
        id,
        status: matchesExpected && sameContent && sameLibreData && editConsumed && before.some(({ items }) => items.length)
          ? 'réussi' : 'échoué',
        matchesExpected,
        sameContent,
        sameLibreData,
        editConsumed,
        renderedItems: before.reduce((count, { items }) => count + items.length, 0),
      }
    } catch (error) {
      return { id, status: 'échoué', reason: error.message }
    }
  })
  return { ...profile, seed, rows }
}
