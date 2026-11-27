import { isDeepStrictEqual } from 'node:util'

export async function auditRecipes(server, profile, seed) {
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { pageForA5Half } = await server.ssrLoadModule('/src/components/generator/sheet-format.ts')
  const { parseFicheRecipe, buildFicheRecipe } = await server.ssrLoadModule('/src/fiches/recipe.ts')
  const { editArea, editPerimeter, editVolume } = await server.ssrLoadModule('/src/math/mesures.ts')
  const addition = defaultPage('algèbre')
  const items = buildWorksheets([addition], seed)[0].items
  const edited = { ...items[0], a: 17, b: 25, result: 42, prompt: '17 + 25 = □', answer: '42' }
  const right = { ...edited, libreId: 'droite-1', libreLocked: true }
  const a5RightLibre = { id: 'activite-droite', items: [right] }
  const imageOverrides = { '/lib/images/témoin.webp': '/lib/images/témoin-remplacement.webp' }
  const geometry = defaultPage('géométrie')
  const measured = [
    ['perimetres', 'perimetres-cercle', editPerimeter, { radius: 10, perimeterPi: 3.1416 }, '62,83 cm'],
    ['aires', 'aires-triangle-manquant', editArea, { base: 5, area: 30 }, '12 cm'],
    ['volumes', 'volumes-cone-manquant', editVolume, { radius: 2, volume: 20, volumePi: 3 }, '5 cm'],
  ].map(([topic, exerciseType, edit, values, answer]) => {
    const page = { ...geometry, topic, exerciseType, count: 1 }
    const initial = buildWorksheets([page], seed)[0].items[0]
    const item = edit(initial, values)
    if (!item) throw new Error(`Impossible de modifier le témoin ${exerciseType}`)
    const libreItems = [{ ...item, libreId: 'temoin-mesure-1', libreLocked: true }]
    const libreId = 'temoin-mesure'
    return {
      id: `${exerciseType}-libre`,
      page: { ...page, libreId, libreItems },
      expected: { libreId, libreItems },
      verify: (sheets) => sheets[0].items.some(({ responseAnswer, libreLocked }) => responseAnswer === answer && libreLocked),
    }
  })
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
    ...measured,
    {
      id: 'symetrie-axiale-libre',
      page: { ...geometry, topic: 'transformations', exerciseType: 'transformations-axiale-figure', count: 3,
        coordLibre: true, coordSymmetryAxis: 'y', coordMarks: [
          { label: 'A', kind: 'point', x: -4, y: -1 },
          { label: 'B', kind: 'point', x: 2, y: -1 },
          { label: 'C', kind: 'point', x: 0, y: 3 },
        ] },
      expected: { coordSymmetryAxis: 'y' },
      verify: (sheets) => sheets[0].items[0]?.coordScene?.marks.some(({ label, x, y }) => label === 'A′' && x === 4 && y === -1),
    },
    {
      id: 'libre-instantane-et-image',
      page: { ...addition, libreItems: [edited, ...items.slice(1)] },
      expected: { libreItems: [edited, ...items.slice(1)] },
      options: { libreMode: true, libreSnapshot: [addition], imageOverrides },
      verify: (sheets) => sheets[0].items.some(({ a, b, result, answer }) =>
        a === edited.a && b === edited.b && result === edited.result && answer === edited.answer),
    },
    {
      id: 'libre-double-a5',
      page: { ...addition, a5RightLibre },
      expected: { a5RightLibre },
      options: { sheetFormat: 'a5-double-landscape' },
      render: (recipe) => ['left', 'right'].flatMap((half) => buildWorksheets(
        recipe.pages.map((page) => pageForA5Half(page, half)), recipe.seed,
      )),
      verify: ([left, right]) => left.items.every(({ libreId }) => libreId !== 'droite-1') &&
        right.items.some(({ libreId, libreLocked, answer }) => libreId === 'droite-1' && libreLocked && answer === '42'),
    },
    ...['afp', 'cfc'].map((diploma) => ({
      id: `logistique-${diploma}-105-historique`,
      page: { ...defaultPage(`logistique-${diploma}`), topic: `log-${diploma}-theme-100`,
        exerciseType: `log-${diploma}-105-theorie`, logistiqueBankRevision: 'logistique-105-v001' },
      expected: { logistiqueBankRevision: 'logistique-105-v001' },
    })),
  ]
  const rows = witnesses.map(({ id, page, expected, options, render = (recipe) => buildWorksheets(recipe.pages, recipe.seed), verify }) => {
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
      const before = render(loaded)
      const after = render(roundTrip)
      const sameContent = isDeepStrictEqual(before.map(({ items }) => items), after.map(({ items }) => items))
      const sameLibreData = isDeepStrictEqual(loaded.libreSnapshot, roundTrip.libreSnapshot) &&
        isDeepStrictEqual(loaded.imageOverrides, options?.imageOverrides) &&
        isDeepStrictEqual(loaded.imageOverrides, roundTrip.imageOverrides) &&
        loaded.libreMode === roundTrip.libreMode && loaded.sheetFormat === roundTrip.sheetFormat
      const editConsumed = verify?.(before) ?? true
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
