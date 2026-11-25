import { createHash } from 'node:crypto'
import {
  normalizeSourceText,
  parseGlossaryTables,
  parseSourceExercisePage,
} from './epcas-markdown-import.mjs'

const TYPE_PAGE_SLUG = {
  theorie: 'theorie',
  maths: 'maths',
  verification: 'verification',
  situation: 'situation',
  glossaire: 'glossaire',
}
const SOURCE_PAGE_SLUGS = ['objectifs', 'apercu', 'theorie', 'glossaire', 'situation', 'maths', 'verification']
const DOMAIN_FOR_LEVEL = { CFC: 'logistique-cfc', AFP: 'logistique-afp' }
const SOURCE_REPOSITORY = 'oasi-phuoc/epcas'

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function isPlaceholder(text) {
  return !text?.trim() || /contenu à importer|contenu résumé à compléter|contenu onenote à importer/i.test(text)
}

function cleanContent(text) {
  return isPlaceholder(text) ? '' : text
}

function makePageId(code, slug) {
  return `lesson-${code}-${slug}`
}

function makeBankKey(domain, code, type) {
  return `${domain}:${code}:${type}`
}

function makeProvenance({ sourceCommit, level, moduleLevels, path, sourceField, sourceHash, lessonId, sourcePageId, sourcePosition }) {
  return {
    origin: 'epcas',
    repository: SOURCE_REPOSITORY,
    commit: sourceCommit,
    path,
    sourceField,
    sourceHash,
    rights: 'pending',
    resolution: level === 'AFP' && moduleLevels.includes('CFC') ? 'inherited-cfc' : level === 'AFP' ? 'native-afp' : 'native-cfc',
    lessonId,
    sourcePageId,
    sourcePosition,
  }
}

function makeUnit({
  code,
  type,
  levels,
  sourceCommit,
  sourceRevision,
  id,
  sourceHash,
  sourceField,
  sourcePath,
  lessonId,
  sourcePageId,
  sourcePosition,
  payload,
  correction,
  sourceDifficulty,
  sourceType,
  status = 'imported-unreviewed',
  editorialNote,
  tags = [],
}) {
  return {
    id,
    submoduleCode: code,
    type,
    revision: sourceHash.slice(0, 16),
    objectiveIds: [],
    sourceDifficulty,
    sourceType,
    editorialNote,
    eligibleLevels: levels,
    reviewByLevel: Object.fromEntries(levels.map(level => [level, {
      status: status === 'blocked' ? 'blocked' : 'imported-unreviewed',
      revision: sourceRevision,
    }])),
    status,
    payload,
    ...(correction ? { correction } : {}),
    provenance: levels.map(level => makeProvenance({
      sourceCommit,
      level,
      moduleLevels: levels,
      path: sourcePath,
      sourceField,
      sourceHash,
      lessonId,
      sourcePageId,
      sourcePosition,
    })),
    tags: ['epcas-import', ...tags],
  }
}

function addQuarantine(quarantine, { code, type, sourcePageId, sourcePosition, reason, rawMarkdown = '' }) {
  const sourceHash = sha256(`${sourcePageId}\0${sourcePosition}\0${reason}\0${rawMarkdown}`)
  const id = `quarantine-${code}-${type}-${sourceHash.slice(0, 12)}`
  quarantine[id] ??= { id, submoduleCode: code, type, sourcePageId, sourcePosition, reason, rawMarkdown, sourceHash, status: 'blocked' }
  return id
}


function pageProvenance(page, module, sourceCommit) {
  return module.eligibleLevels.map(level => makeProvenance({
    sourceCommit,
    level,
    moduleLevels: module.eligibleLevels,
    path: page.sourcePath,
    sourceField: page.sourceField,
    sourceHash: page.sourceHash,
    lessonId: page.lessonId,
    sourcePageId: page.id,
    sourcePosition: `L1-L${page.rawFullMarkdown.split(/\r?\n/).length}`,
  }))
}

function sourceDocumentUnit({ module, type, pages, sourceRevision, sourceCommit }) {
  const pageBySlug = new Map(pages.map(page => [page.slug, page]))
  const course = pageBySlug.get('theorie') ?? pages[0]
  const objectives = pageBySlug.get('objectifs')
  const overview = pageBySlug.get('apercu')
  const sourceHash = sha256(JSON.stringify(pages.map(page => [page.id, page.sourceHash])))
  const hasContent = pages.some(page => cleanContent(page.rawFullMarkdown) || cleanContent(page.rawSummaryMarkdown))
  if (!hasContent) return null
  const title = module.title
  return {
    id: `epcas-${module.code}-${type}-source-${sourceHash.slice(0, 12)}`,
    submoduleCode: module.code,
    type,
    revision: sourceHash.slice(0, 16),
    objectiveIds: [],
    eligibleLevels: module.eligibleLevels,
    reviewByLevel: Object.fromEntries(module.eligibleLevels.map(level => [level, { status: 'imported-unreviewed', revision: sourceRevision }])),
    status: 'imported-unreviewed',
    payload: {
      kind: 'source-document',
      title,
      fullMarkdown: cleanContent(course?.rawFullMarkdown),
      summaryMarkdown: cleanContent(course?.rawSummaryMarkdown),
      objectivesMarkdown: cleanContent(objectives?.rawFullMarkdown),
      objectivesSummaryMarkdown: cleanContent(objectives?.rawSummaryMarkdown),
      overviewMarkdown: cleanContent(overview?.rawFullMarkdown),
      overviewSummaryMarkdown: cleanContent(overview?.rawSummaryMarkdown),
      sourceSlug: pageBySlug.has('theorie') ? 'theorie' : pages[0]?.slug ?? 'source',
    },
    provenance: pages.flatMap(page => pageProvenance(page, module, sourceCommit)),
    tags: ['epcas-import', 'needs-editorial-review', 'source-document'],
  }
}

function sourceQuestionUnit({ module, type, item, page, sourceRevision, sourceCommit }) {
  const position = `L${item.sourcePosition.startLine}-L${item.sourcePosition.endLine}`
  const correction = item.answerBlocks.length
    ? {
        kind: 'source-markdown',
        blocks: item.answerBlocks.map(block => ({
          directive: block.directive,
          markdown: block.markdown,
          startLine: block.startLine,
          endLine: block.endLine,
        })),
      }
    : undefined
  const hardIssues = item.issues.filter(issue => issue.code !== 'answer-footer-removed')
  const blocked = hardIssues.length > 0
  const sourceHash = sha256(JSON.stringify({
    sourcePageHash: page.sourceHash,
    position,
    title: item.title,
    parentMission: item.parentMission,
    pageContext: item.pageContext,
    promptMarkdown: item.promptMarkdown,
    answerBlocks: item.answerBlocks,
  }))
  const pageSource = makeProvenance({
    sourceCommit,
    level: 'CFC',
    moduleLevels: module.eligibleLevels,
    path: page.sourcePath,
    sourceField: page.sourceField,
    sourceHash,
    lessonId: page.lessonId,
    sourcePageId: page.id,
    sourcePosition: position,
  })
  const afpSource = makeProvenance({ ...pageSource, sourceCommit, level: 'AFP', moduleLevels: module.eligibleLevels })
  const status = blocked ? 'blocked' : 'imported-unreviewed'
  return {
    id: `epcas-${module.code}-${type}-${page.slug}-${item.sourcePosition.startLine}-${sourceHash.slice(0, 12)}`,
    submoduleCode: module.code,
    type,
    revision: sourceHash.slice(0, 16),
    objectiveIds: [],
    eligibleLevels: module.eligibleLevels,
    reviewByLevel: Object.fromEntries(module.eligibleLevels.map(level => [level, {
      status: blocked ? 'blocked' : 'imported-unreviewed',
      revision: sourceRevision,
    }])),
    status,
    editorialNote: blocked ? hardIssues.map(issue => `${issue.code} (ligne ${issue.line ?? item.sourcePosition.startLine})`).join('; ') : undefined,
    payload: {
      kind: 'source-question',
      title: item.title,
      sourceSlug: page.slug,
      sourcePosition: position,
      promptMarkdown: item.promptMarkdown,
      parentHeading: item.parentMission,
      pageContext: item.pageContext,
      unsupportedBlocks: item.unsupportedBlocks.length ? item.unsupportedBlocks.map(({ kind, directive, rawMarkdown }) => ({ kind, directive, rawMarkdown })) : undefined,
    },
    ...(correction ? { correction } : {}),
    provenance: module.eligibleLevels.map(level => level === 'AFP' ? afpSource : pageSource),
    tags: [
      'epcas-import',
      'markdown-question',
      ...(item.answerBlocks.length ? [] : ['missing-source-answer']),
      ...(item.unsupportedBlocks.length ? ['unsupported-source-media'] : []),
      ...(item.footerLines.length ? ['source-answer-footer-removed'] : []),
      ...(blocked ? ['manual-review-required'] : []),
    ],
  }
}

function literalFromNode(node, ts, sourceFile) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(element => literalFromNode(element, ts, sourceFile))
  if (ts.isObjectLiteralExpression(node)) {
    const result = {}
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) throw new Error(`Propriété non littérale dans demo-data.ts : ${property.getText(sourceFile)}`)
      const key = ts.isIdentifier(property.name) ? property.name.text : property.name.text
      result[key] = literalFromNode(property.initializer, ts, sourceFile)
    }
    return result
  }
  throw new Error(`Valeur source non littérale dans demo-data.ts : ${node.getText(sourceFile)}`)
}

export function extractDemoSourceLiterals({ demoDataPath, ts, readFileSync }) {
  const sourceFile = ts.createSourceFile(demoDataPath, readFileSync(demoDataPath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  let initialState
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === 'initialState' && ts.isObjectLiteralExpression(declaration.initializer)) {
        initialState = declaration.initializer
        break
      }
    }
  }
  if (!initialState) throw new Error('Objet initialState introuvable dans demo-data.ts')

  const collectionNames = ['exercises', 'lessonQuestions', 'assessmentQuestions', 'assessments']
  return Object.fromEntries(collectionNames.map(name => {
    const property = initialState.properties.find(candidate => {
      if (!ts.isPropertyAssignment(candidate)) return false
      const key = ts.isIdentifier(candidate.name) ? candidate.name.text : candidate.name.text
      return key === name
    })
    if (!property) return [name, []]
    if (!ts.isArrayLiteralExpression(property.initializer)) {
      throw new Error(`Liste littérale initialState.${name} introuvable dans demo-data.ts`)
    }
    return [name, property.initializer.elements.map(element => literalFromNode(element, ts, sourceFile))]
  }))
}

function mapDemoExercise(exercise) {
  const lessonMatch = /^lesson-(\d+)-([a-z-]+)$/i.exec(exercise.lessonId ?? '')
  if (!lessonMatch) return { error: 'missing-or-invalid-lesson-link' }
  const code = lessonMatch[1]
  const exerciseType = exercise.type
  if (exerciseType === 'qcm') {
    const choices = exercise.payload?.choices
    const correctIndex = exercise.payload?.correctIndex
    if (!Array.isArray(choices) || choices.length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= choices.length) {
      return { error: 'invalid-qcm-payload' }
    }
    const options = choices.map((text, index) => ({ id: `option-${index + 1}`, text }))
    return {
      code,
      type: 'verification',
      payload: { kind: 'question', prompt: exercise.payload.question, format: 'qcm', options, responseLines: 2 },
      correction: { kind: 'choice', options, correctIds: [options[correctIndex].id] },
    }
  }
  if (exerciseType === 'math') {
    const value = exercise.payload?.answer
    if (!Number.isFinite(value)) return { error: 'invalid-numeric-payload' }
    const unit = exercise.payload.unit ?? ''
    const explanation = exercise.payload.explanation ?? ''
    return {
      code,
      type: 'maths',
      payload: { kind: 'calculation', prompt: exercise.payload.question, unit: unit || undefined, responseLines: 3 },
      correction: {
        kind: 'numeric',
        value,
        unit,
        tolerance: Number.isFinite(exercise.payload.tolerance) ? exercise.payload.tolerance : 0,
        precision: `tolérance source ${exercise.payload.tolerance ?? 0}`,
        formula: explanation,
        steps: explanation ? [explanation] : [],
      },
    }
  }
  if (exerciseType === 'open') {
    const required = Array.isArray(exercise.payload?.requiredKeywords) ? exercise.payload.requiredKeywords : []
    const optional = Array.isArray(exercise.payload?.optionalKeywords) ? exercise.payload.optionalKeywords : []
    return {
      code,
      type: 'verification',
      payload: { kind: 'question', prompt: exercise.payload.question, format: 'open', responseLines: 4 },
      correction: {
        kind: 'open',
        model: exercise.payload.modelAnswer ?? '',
        accepted: [...required, ...optional],
        criteria: required.map(description => ({ description })),
        explanation: exercise.payload.explanation ?? undefined,
      },
    }
  }
  return { error: 'unsupported-exercise-type' }
}

export function buildEpcasImport({
  sourceCommit,
  targetCurriculum,
  sourceModules,
  sourceLessons,
  sourceSequences,
  demoSources,
}) {
  const demoExercises = demoSources.exercises ?? []
  const structuredCollections = Object.fromEntries(Object.entries(demoSources).map(([name, records]) => [name, records.length]))
  const unhandledCollections = Object.entries(structuredCollections).filter(([name, count]) => name !== 'exercises' && count > 0)
  if (unhandledCollections.length) throw new Error(`Collections structurées non vides à mapper explicitement : ${unhandledCollections.map(([name, count]) => `${name}=${count}`).join(', ')}`)
  const sourceModulesByCode = new Map(sourceModules.map(module => [module.code, module]))
  const targetModulesByCode = new Map(targetCurriculum.modules.map(module => [module.code, module]))
  if (sourceModulesByCode.size !== targetModulesByCode.size) throw new Error('Le nombre de modules source et catalogue ne correspond pas.')

  const yearsByModule = new Map()
  for (const sequence of sourceSequences) {
    for (const moduleId of sequence.moduleIds) {
      const code = moduleId.replace(/^mod-/, '')
      yearsByModule.set(`${code}:${sequence.level}`, sequence.studyYear)
    }
  }
  for (const sourceModule of sourceModules) {
    const targetModule = targetModulesByCode.get(sourceModule.code)
    if (!targetModule || targetModule.title !== sourceModule.title) throw new Error(`Module absent ou titre divergent : ${sourceModule.code}`)
    const sourceLevels = [...sourceModule.levels].sort()
    const targetLevels = [...targetModule.eligibleLevels].sort()
    if (JSON.stringify(sourceLevels) !== JSON.stringify(targetLevels)) throw new Error(`Éligibilités divergentes : ${sourceModule.code}`)
    for (const level of sourceLevels) {
      if (targetModule.years[level] !== yearsByModule.get(`${sourceModule.code}:${level}`)) {
        throw new Error(`Année de parcours divergente : ${sourceModule.code}/${level}`)
      }
    }
  }

  const sourceRevision = `epcas-${sourceCommit.slice(0, 12)}`
  const sourceLessonsByKey = new Map(sourceLessons.map(lesson => [`${lesson.moduleId.slice(4)}:${lesson.pageSlug}`, lesson]))
  const sourcePages = {}
  const banks = {}
  const units = {}
  const quarantine = {}
  const answerBlocksByType = { maths: 0, verification: 0, situation: 0 }
  const headingsByType = { maths: 0, verification: 0, situation: 0 }
  const sourcePageCounts = Object.fromEntries(SOURCE_PAGE_SLUGS.map(slug => [slug, 0]))
  const populatedByType = Object.fromEntries(Object.keys(TYPE_PAGE_SLUG).map(type => [type, 0]))
  const structuredExerciseReport = { sourceCount: demoExercises.length, imported: 0, quarantined: 0 }

  for (const module of targetCurriculum.modules) {
    const sourceModule = sourceModulesByCode.get(module.code)
    for (const slug of SOURCE_PAGE_SLUGS) {
      const lesson = sourceLessonsByKey.get(`${module.code}:${slug}`)
      const rawFullMarkdown = lesson?.contentFull ?? ''
      const rawSummaryMarkdown = lesson?.contentSummary ?? ''
      const pageId = makePageId(module.code, slug)
      const sourceHash = sha256(`${rawFullMarkdown}\0${rawSummaryMarkdown}`)
      const fullStatus = isPlaceholder(rawFullMarkdown) ? 'placeholder' : 'present'
      const summaryStatus = isPlaceholder(rawSummaryMarkdown) ? 'placeholder' : 'present'
      const status = fullStatus === 'present' ? 'populated' : summaryStatus === 'present' ? 'summary-only' : 'placeholder'
      if (status !== 'placeholder') sourcePageCounts[slug] += 1
      sourcePages[pageId] = {
        id: pageId,
        lessonId: lesson?.id ?? pageId,
        submoduleCode: module.code,
        moduleTitle: sourceModule.title,
        slug,
        sourceField: `filledByModule.${module.code}.${slug}`,
        sourcePath: 'src/lib/curriculum.ts',
        sourceCommit,
        sourceHash,
        status,
        fullStatus,
        summaryStatus,
        rawFullMarkdown,
        rawSummaryMarkdown,
        eligibleLevels: [...sourceModule.levels],
      }
    }

    for (const type of Object.keys(TYPE_PAGE_SLUG)) {
      for (const level of sourceModule.levels) {
        const key = makeBankKey(DOMAIN_FOR_LEVEL[level], module.code, type)
        banks[key] = {
          revision: sourceRevision,
          submoduleCode: module.code,
          type,
          unitIds: [],
          sourcePageIds: [],
        }
      }
    }
  }

  const attachSourcePages = (module, type, pageIds) => {
    const levels = module.levels ?? module.eligibleLevels
    for (const level of levels) {
      const bank = banks[makeBankKey(DOMAIN_FOR_LEVEL[level], module.code, type)]
      for (const pageId of pageIds) if (!bank.sourcePageIds.includes(pageId)) bank.sourcePageIds.push(pageId)
    }
  }

  const register = (module, type, unit, pageIds) => {
    if (units[unit.id] && sha256(JSON.stringify(units[unit.id])) !== sha256(JSON.stringify(unit))) throw new Error(`Collision d’identifiant : ${unit.id}`)
    units[unit.id] ??= unit
    const levels = module.levels ?? module.eligibleLevels
    for (const level of levels) {
      const bank = banks[makeBankKey(DOMAIN_FOR_LEVEL[level], module.code, type)]
      if (!bank.unitIds.includes(unit.id)) bank.unitIds.push(unit.id)
      for (const pageId of pageIds) if (!bank.sourcePageIds.includes(pageId)) bank.sourcePageIds.push(pageId)
    }
    populatedByType[type] += 1
  }

  for (const module of targetCurriculum.modules) {
    const sourceModule = sourceModulesByCode.get(module.code)
    for (const [type, slug] of Object.entries(TYPE_PAGE_SLUG)) {
      const page = sourcePages[makePageId(module.code, slug)]
      const rawFullMarkdown = page.rawFullMarkdown
      const fullMarkdown = cleanContent(rawFullMarkdown)
      const sourcePageIds = type === 'theorie'
        ? ['objectifs', 'apercu', 'theorie'].map(pageSlug => makePageId(module.code, pageSlug))
        : [page.id]
      attachSourcePages(sourceModule, type, sourcePageIds)

      if (type === 'theorie') {
        const theoryPages = sourcePageIds.map(pageId => sourcePages[pageId])
        const unit = sourceDocumentUnit({ module, type, pages: theoryPages, sourceRevision, sourceCommit })
        if (unit) register(sourceModule, type, unit, sourcePageIds)
        continue
      }

      if (type === 'glossaire') {
        if (fullMarkdown) {
          const glossary = parseGlossaryTables(fullMarkdown)
          for (const [index, entry] of glossary.entries.entries()) {
            const sourcePosition = `L${entry.sourcePosition.startLine}-L${entry.sourcePosition.endLine}`
            const sourceHash = sha256(JSON.stringify({ pageHash: page.sourceHash, row: entry.rawMarkdown, position: sourcePosition }))
            const unit = makeUnit({
              code: module.code,
              type,
              sourceCommit,
              levels: sourceModule.levels,
              sourceRevision,
              id: `epcas-${module.code}-${type}-${entry.sourcePosition.startLine}-${sourceHash.slice(0, 12)}`,
              sourceHash,
              sourceField: page.sourceField,
              sourcePath: page.sourcePath,
              lessonId: page.lessonId,
              sourcePageId: page.id,
              sourcePosition,
              payload: {
                kind: 'glossary',
                term: entry.term,
                definition: entry.definition,
                example: entry.example,
                synonyms: entry.synonyms,
                sourceLink: entry.sourceLink,
              },
              tags: ['glossary-row', `source-row-${index + 1}`],
            })
            register(sourceModule, type, unit, sourcePageIds)
          }
          for (const issue of glossary.issues) {
            addQuarantine(quarantine, {
              code: module.code,
              type,
              sourcePageId: page.id,
              sourcePosition: `L${issue.line}`,
              reason: issue.code,
              rawMarkdown: issue.rawMarkdown ?? '',
            })
          }
          if (glossary.entries.length === 0) {
            const unit = sourceDocumentUnit({ module, type, pages: [page], sourceRevision, sourceCommit, sourceSlug: slug })
            if (unit) register(sourceModule, type, unit, sourcePageIds)
            addQuarantine(quarantine, {
              code: module.code,
              type,
              sourcePageId: page.id,
              sourcePosition: 'page',
              reason: 'unparsed-glossary-page',
              rawMarkdown: rawFullMarkdown,
            })
          }
        }
        continue
      }

      if (!fullMarkdown) continue
      const parsed = parseSourceExercisePage(type, fullMarkdown)
      answerBlocksByType[type] += parsed.answerBlockCount
      headingsByType[type] += parsed.items.length
      for (const item of parsed.items) {
        const unit = sourceQuestionUnit({ module, type, item, page, sourceRevision, sourceCommit })
        register(sourceModule, type, unit, sourcePageIds)
        for (const footer of item.footerLines) {
          addQuarantine(quarantine, {
            code: module.code,
            type,
            sourcePageId: page.id,
            sourcePosition: `L${footer.line}`,
            reason: 'source-answer-footer-removed-from-question',
            rawMarkdown: footer.markdown,
          })
        }
        for (const media of item.unsupportedBlocks) {
          addQuarantine(quarantine, {
            code: module.code,
            type,
            sourcePageId: page.id,
            sourcePosition: `L${media.startLine}-L${media.endLine}`,
            reason: 'unsupported-media-block',
            rawMarkdown: media.rawMarkdown,
          })
        }
      }
      for (const issue of parsed.issues) {
        addQuarantine(quarantine, {
          code: module.code,
          type,
          sourcePageId: page.id,
          sourcePosition: `L${issue.line}`,
          reason: issue.code,
          rawMarkdown: issue.rawMarkdown ?? '',
        })
      }
      for (const block of parsed.unassignedBlocks) {
        addQuarantine(quarantine, {
          code: module.code,
          type,
          sourcePageId: page.id,
          sourcePosition: `L${block.startLine}-L${block.endLine}`,
          reason: 'unassigned-answer-block',
          rawMarkdown: block.rawMarkdown,
        })
      }
      if (!parsed.items.length) {
        const unit = sourceDocumentUnit({ module, type, pages: [page], sourceRevision, sourceCommit, sourceSlug: slug })
        if (unit) register(sourceModule, type, unit, sourcePageIds)
        addQuarantine(quarantine, {
          code: module.code,
          type,
          sourcePageId: page.id,
          sourcePosition: 'page',
          reason: 'no-question-headings-recognized',
          rawMarkdown: rawFullMarkdown,
        })
      }
    }
  }

  const demoSourcePath = 'src/lib/demo-data.ts'
  for (const [index, exercise] of demoExercises.entries()) {
    const mapped = mapDemoExercise(exercise)
    const module = mapped.code ? targetModulesByCode.get(mapped.code) : undefined
    if (mapped.error || !module || !exercise.lessonId) {
      const code = mapped.code ?? 'unknown'
      addQuarantine(quarantine, {
        code,
        type: mapped.type ?? 'verification',
        sourcePageId: `exercise:${exercise.id ?? index}`,
        sourcePosition: `initialState.exercises[${index}]`,
        reason: mapped.error ?? 'exercise-module-not-found',
        rawMarkdown: JSON.stringify(exercise),
      })
      structuredExerciseReport.quarantined += 1
      continue
    }

    const sourceHash = sha256(JSON.stringify(exercise))
    const sourcePageId = `exercise:${exercise.id}`
    sourcePages[sourcePageId] = {
      id: sourcePageId,
      lessonId: exercise.lessonId,
      submoduleCode: module.code,
      moduleTitle: module.title,
      slug: 'structured-exercise',
      sourceField: `initialState.exercises[${index}]`,
      sourcePath: demoSourcePath,
      sourceCommit,
      sourceHash,
      status: 'populated',
      eligibleLevels: [...module.eligibleLevels],
      rawRecord: exercise,
    }
    const sourcePosition = `initialState.exercises[${index}]`
    const provenanceByLevel = module.eligibleLevels.map(level => makeProvenance({
      sourceCommit,
      level,
      moduleLevels: module.eligibleLevels,
      path: demoSourcePath,
      sourceField: sourcePages[sourcePageId].sourceField,
      sourceHash,
      lessonId: exercise.lessonId,
      sourcePageId,
      sourcePosition,
    }))
    const unit = makeUnit({
      code: module.code,
      type: mapped.type,
      sourceCommit,
      levels: module.eligibleLevels,
      sourceRevision,
      id: `epcas-${module.code}-${mapped.type}-demo-${exercise.id}-${sourceHash.slice(0, 10)}`,
      sourceHash,
      sourceField: sourcePages[sourcePageId].sourceField,
      sourcePath: demoSourcePath,
      lessonId: exercise.lessonId,
      sourcePageId,
      sourcePosition,
      payload: mapped.payload,
      correction: mapped.correction,
      sourceDifficulty: exercise.difficulty,
      sourceType: exercise.type,
      tags: ['structured-demo-exercise'],
    })
    unit.provenance = provenanceByLevel
    register(module, mapped.type, unit, [sourcePageId])
    structuredExerciseReport.imported += 1
  }

  const unitsByType = Object.fromEntries(Object.keys(TYPE_PAGE_SLUG).map(type => [type,
    Object.values(units).filter(unit => unit.type === type).length,
  ]))
  const unitsByStatus = Object.values(units).reduce((result, unit) => {
    result[unit.status] = (result[unit.status] ?? 0) + 1
    return result
  }, {})
  const duplicates = new Map()
  for (const unit of Object.values(units)) {
    const prompt = unit.payload.kind === 'question'
      ? unit.payload.prompt
      : unit.payload.kind === 'calculation'
        ? unit.payload.prompt
        : unit.payload.kind === 'source-question'
          ? unit.payload.promptMarkdown
          : null
    if (!prompt) continue
    const normalized = normalizeSourceText(prompt)
    if (normalized.length < 20) continue
    const key = `${unit.submoduleCode}:${unit.type}:${normalized}`
    const refs = duplicates.get(key) ?? []
    refs.push(unit.id)
    duplicates.set(key, refs)
  }
  const duplicateCandidates = [...duplicates.entries()]
    .filter(([, refs]) => refs.length > 1)
    .map(([key, references]) => ({ key, references }))
  for (const candidate of duplicateCandidates) {
    for (const id of candidate.references) {
      units[id].tags.push('possible-duplicate')
      units[id].sourceDuplicateCandidates = candidate.references.filter(reference => reference !== id)
    }
  }

  const blockedUnitReasons = Object.values(units)
    .filter(unit => unit.status === 'blocked')
    .flatMap(unit => (unit.editorialNote ?? 'manual-review-required').split('; '))
    .reduce((result, reason) => {
      const label = reason.replace(/ \(ligne \d+\)$/, '')
      result[label] = (result[label] ?? 0) + 1
      return result
    }, {})
  const sourcePageCountsTotal = Object.values(sourcePageCounts).reduce((sum, count) => sum + count, 0)
  const populatedBanks = Object.values(banks).filter(bank => bank.sourcePageIds.some(pageId => sourcePages[pageId]?.status !== 'placeholder')).length
  const report = {
    catalog: {
      modules: targetCurriculum.modules.length,
      cfcModules: targetCurriculum.modules.filter(module => module.eligibleLevels.includes('CFC')).length,
      afpModules: targetCurriculum.modules.filter(module => module.eligibleLevels.includes('AFP')).length,
      bankSlots: Object.keys(banks).length,
      populatedBankSlots: populatedBanks,
      emptyBankSlots: Object.keys(banks).length - populatedBanks,
    },
    sourcePages: {
      total: Object.keys(sourcePages).length,
      curriculumPages: SOURCE_PAGE_SLUGS.length * targetCurriculum.modules.length,
      populated: sourcePageCountsTotal,
      populatedBySlug: sourcePageCounts,
    },
    parsed: {
      answerBlocksByType,
      headingsByType,
      unitsByType,
      unitsByStatus,
      glossaryEntries: unitsByType.glossaire,
      structuredExercises: structuredExerciseReport,
      structuredCollections,
    },
    review: {
      allImportedUnitsRequirePedagogicalReview: true,
      allEpcasReuseRightsRemainPending: true,
      duplicateCandidates,
      blockedUnitReasons,
      duplicateDetection: 'Exact prompt match after Unicode normalization, case folding, punctuation removal, and whitespace normalization; candidates are retained, never automatically deduplicated.',
      quarantineCount: Object.keys(quarantine).length,
      quarantineByReason: Object.values(quarantine).reduce((result, item) => {
        result[item.reason] = (result[item.reason] ?? 0) + 1
        return result
      }, {}),
    },
  }

  return {
    schemaVersion: 1,
    source: {
      repository: SOURCE_REPOSITORY,
      commit: sourceCommit,
      curriculumPath: 'src/lib/curriculum.ts',
      structuredExercisePath: demoSourcePath,
      policy: 'Imported content and original corrections remain unreviewed; reuse rights remain pending. Only units with separate pedagogical and rights approval can enter generation.',
      excluded: ['EPCAS accounts', 'classes', 'progress', 'attempts', 'personal annotations', 'empty assessment collections (0 in this source revision)', 'Office practical exercises', 'live Supabase data'],
    },
    counts: {
      modules: targetCurriculum.modules.length,
      catalogBanks: Object.keys(banks).length,
      populatedBanks,
      emptyBanks: Object.keys(banks).length - populatedBanks,
      uniqueUnits: Object.keys(units).length,
      approvedUnits: Object.values(units).filter(unit => unit.status === 'approved' && unit.provenance.every(source => source.rights === 'permitted-reuse' || source.rights === 'project-original')).length,
      sourcePagesImported: sourcePageCountsTotal,
      sourcePageCounts,
      populatedByType: unitsByType,
      answerBlocksByType,
      unitsByStatus,
      quarantineCount: Object.keys(quarantine).length,
      structuredExercises: structuredExerciseReport.imported,
      duplicateCandidates: duplicateCandidates.length,
    },
    report,
    banks,
    units,
    sourcePages,
    quarantine,
  }
}
