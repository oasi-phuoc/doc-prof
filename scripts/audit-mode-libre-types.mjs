import { createHash } from 'node:crypto'

function typeChoices(domain, topic, refs, modules) {
  const { typeChoicesForBlock } = modules.catalogue
  return refs.flatMap(({ id, selection }) =>
    typeChoicesForBlock(domain, { topic, exerciseType: id }).map((type) => ({ type, selection })),
  )
}

function selectedTypes(domain, modules) {
  const { topicsForDomain } = modules.catalogue
  const { allAlphaBankDefs } = modules.alpha
  const { allSoutienBankDefs } = modules.soutien
  const { GRAM_EXERCISE_KINDS, gramExerciseTypeId, subthemesForTopicAll } = modules.grammar
  const { exerciseTypeById } = modules.definitions
  const { logistiqueSubthemes, logistiqueTypeForSubtheme } = modules.logistics
  const banks = domain === 'alphabetisation' ? allAlphaBankDefs()
    : domain === 'soutien-fr' ? allSoutienBankDefs() : null
  return topicsForDomain(domain).flatMap(({ id: topic }) => {
    let refs = [{ id: '', selection: {} }]
    if (banks) {
      refs = banks.filter((bank) => bank.themeId === topic).map(({ letter, sound }) => ({
        id: domain === 'alphabetisation'
          ? modules.alpha.alphaExerciseTypeId(sound.bankId, 'mots')
          : modules.soutien.soutienExerciseTypeId(sound.bankId, 'mots'),
        selection: { letter: letter.id, sound: sound.bankId },
      }))
    } else if (domain === 'grammaire') {
      const subthemes = subthemesForTopicAll(topic)
      if (subthemes.length) {
        refs = subthemes.map(({ id, theoryTypeIds }) => ({
          id: theoryTypeIds[0] ?? GRAM_EXERCISE_KINDS
            .map((kind) => gramExerciseTypeId(id, kind.id))
            .find((typeId) => exerciseTypeById[typeId]),
          selection: { subtheme: id },
        })).filter(({ id }) => id)
      }
    } else if (modules.logistics.isLogistiqueDomain(domain)) {
      refs = logistiqueSubthemes(topic).map(({ id }) => ({
        id: logistiqueTypeForSubtheme(id, '')?.id,
        selection: { subtheme: id },
      })).filter(({ id }) => id)
    }
    return typeChoices(domain, topic, refs, modules).map((row) => ({ ...row, topic }))
  })
}

function* variants(domain, typeId, modules) {
  const { grammarBanksForType } = modules.grammarBanks
  const { isTpfFamilyDomain, tpfNiveauxForDomain, tcfDifficultyFromNiveau, tcfSlotByTypeId, tcfSlotShownInMenu } = modules.tcf
  const grammarBanks = domain === 'grammaire' ? grammarBanksForType(typeId) : []
  if (grammarBanks.length) {
    for (const bank of grammarBanks) {
      for (const presentation of bank.presentations) {
        yield {
          dimensions: { level: bank.level, presentation, bankRevision: bank.revision },
          patch: {
            grammarActivityId: bank.activityId,
            grammarLevel: bank.level,
            grammarPresentation: presentation,
            grammarBankRevision: bank.revision,
            grammarPreview: bank.editorialStatus !== 'approved',
            grammarDocumentCount: presentation === 'document-set' ? 1 : undefined,
            count: 1,
          },
          pilot: bank.editorialStatus !== 'approved',
        }
      }
    }
    return
  }
  const oral = domain === 'grammaire' ? modules.grammarCo.grammarCoThemeForType(typeId) : undefined
  if (oral) {
    for (const level of ['A1', 'A2']) {
      const entries = modules.grammarCoBank.grammarCoEntries(oral.id, level)
      yield {
        dimensions: { level },
        patch: { grammarCoLevel: level },
        excluded: entries.length ? undefined : 'aucune piste autorisée à ce niveau',
      }
    }
    return
  }
  if (isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[typeId]
    for (const level of tpfNiveauxForDomain(domain)) {
      const dimensions = { level }
      const patch = { difficulty: tcfDifficultyFromNiveau(level) }
      if (!tcfSlotShownInMenu(typeId, level)) {
        yield { dimensions, patch, excluded: 'emplacement masqué à ce niveau' }
        continue
      }
      const seen = new Set()
      yield { dimensions, patch }
      if (!slot || slot.competence === 'CO') continue
      for (const source of modules.tcfBanks.tcfSlotBank(level, slot)) {
        if (seen.has(source.type_exercice)) continue
        seen.add(source.type_exercice)
        yield {
          dimensions: { level, support: source.type_exercice, bankWitness: source.id },
          patch: { ...patch, tcfAudioPickMode: 'libre', tcfBankId: source.id },
        }
      }
    }
    return
  }
  if (modules.logistics.logistiqueType(typeId)?.kind === 'theorie') {
    yield { dimensions: { theoryView: 'complet' }, patch: { logistiqueTheoryView: 'complet' } }
    yield {
      dimensions: { theoryView: 'resume' },
      patch: { logistiqueTheoryView: 'resume' },
      excluded: modules.logisticsGeneration.logistiqueHasSummary(typeId)
        ? undefined : 'résumé non publié',
    }
    return
  }
  yield { dimensions: {}, patch: {} }
}

function measurePage({ items, instruction }) {
  const layouts = [...new Set(items.map(({ layout }) => layout))].sort()
  const payloadFields = [...new Set(items.flatMap(Object.keys))].sort()
  const hash = createHash('sha256').update(JSON.stringify({ instruction, items })).digest('hex')
  return {
    status: items.length ? 'générable' : 'aucune unité produite',
    count: items.length,
    layouts,
    payloadFields,
    hash,
  }
}

function measureGeneration(config, modules, seed) {
  try {
    return measurePage(modules.generation.buildPage(config, seed))
  } catch (error) {
    return { status: 'échec de génération', reason: error.message }
  }
}

export async function auditTypes(server, profile, seed) {
  const paths = {
    access: 'access.ts',
    definitions: 'math/catalog.ts',
    catalogue: 'components/generator/generator-derived.ts',
    pageHelpers: 'components/generator/page-helpers.ts',
    generation: 'math/generate.ts',
    alpha: 'alphabetisation/themes.ts',
    soutien: 'francais/soutien/themes.ts',
    grammar: 'grammaire/exercises/index.ts',
    grammarCo: 'grammaire/exercises/co-themes.ts',
    grammarCoBank: 'grammaire/exercises/co-bank.ts',
    grammarBanks: 'grammaire/curriculum/registry.ts',
    logistics: 'logistique/catalog.ts',
    logisticsGeneration: 'logistique/generate.ts',
    logisticsBanks: 'logistique/approved-banks.ts',
    tcf: 'tcf/catalog.ts',
    tcfBanks: 'tcf/loader.ts',
    tpm: 'tpm/test.ts',
    tcmCsc: 'tcm-csc/pages.ts',
    tcmCfr: 'tcm-cfr/test.ts',
    tcfGeneration: 'tcf/generate.ts',
  }
  const loaded = await Promise.all(Object.entries(paths).map(async ([key, path]) =>
    [key, await server.ssrLoadModule('/src/' + path)],
  ))
  const modules = Object.fromEntries(loaded)
  const { ACCESS_DOMAIN_OPTIONS, domainsForAccount } = modules.access
  const { exerciseTypes, defaultPage, topicById } = modules.definitions
  const { applyType } = modules.pageHelpers
  const access = Object.fromEntries(['admin', 'full', 'partial'].map((role) => [role, domainsForAccount(role)]))
  const standardPages = {
    tpm: modules.tpm.buildTpmTestPages(),
    'tcm-csc': modules.tcmCsc.buildTcmCscTestPages(),
    'tcm-cfr': modules.tcmCfr.buildTcmCfrTestPages(),
    ...Object.fromEntries(modules.tcf.TPF_FAMILY_DOMAINS.map((domain) =>
      [domain, modules.tcfGeneration.buildTpfFamilyTestPages(domain, seed)],
    )),
  }
  const rows = []
  const keys = new Set()
  const reachedTypes = new Set()
  const byDomain = {}
  for (const { id: domain } of ACCESS_DOMAIN_OPTIONS) {
    const roles = Object.keys(access).filter((role) => access[role].includes(domain))
    const defaults = defaultPage(domain)
    const counts = byDomain[domain] = {}
    for (const { type, topic, selection } of selectedTypes(domain, modules)) {
      reachedTypes.add(type.id)
      for (const { dimensions, patch, pilot, excluded } of variants(domain, type.id, modules)) {
        const key = JSON.stringify([domain, topic, type.id, selection, dimensions])
        if (keys.has(key)) continue
        keys.add(key)
        let result
        if (excluded) result = { status: 'masqué', reason: excluded }
        else if (!roles.length) result = { status: 'non autorisé', reason: 'aucun rôle de la fixture' }
        else if (type.id.endsWith('-placeholder')) result = { status: 'placeholder' }
        else {
          result = measureGeneration({ ...defaults, ...applyType(type, defaults), ...patch, domain, topic }, modules, seed)
          if (result.status === 'générable' && pilot) result.status = 'générable en aperçu pilote'
        }
        rows.push({ domain, topic, id: type.id, selection, dimensions, roles, ...result })
        counts[result.status] = (counts[result.status] ?? 0) + 1
      }
    }
  }
  const standard = Object.entries(standardPages).flatMap(([domain, pages]) =>
    modules.generation.buildWorksheets(pages, seed).map((page, index) => ({
      domain,
      page: index + 1,
      configIndex: page.configIndex,
      types: [page, ...(page.extraBlocks ?? [])].map((block) => block.exerciseType),
      ...measurePage(page),
    })),
  )
  const declared = exerciseTypes.map(({ id, topic }) => ({ id, topic, domain: topicById[topic]?.domain ?? null }))
  const unmatchedDeclarations = declared.filter(({ id }) => !reachedTypes.has(id))
  return {
    ...profile,
    seed,
    bankRevision: modules.logisticsBanks.currentLogistiquePublication.revision,
    summary: {
      domains: ACCESS_DOMAIN_OPTIONS.length,
      declaredTypes: declared.length,
      unmatchedDeclarations: unmatchedDeclarations.length,
      contexts: rows.length,
      byDomain,
    },
    access,
    rows,
    unmatchedDeclarations,
    standard,
  }
}
