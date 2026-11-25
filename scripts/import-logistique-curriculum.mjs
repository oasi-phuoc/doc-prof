import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const Module = require('node:module')
const ts = require('typescript')
const [epcasRootArg, projectRootArg = process.cwd()] = process.argv.slice(2)

if (!epcasRootArg) {
  throw new Error('Usage: node scripts/import-logistique-curriculum.mjs <epcas-repo> [doc-prof-repo]')
}

const epcasRoot = resolve(epcasRootArg)
const projectRoot = resolve(projectRootArg)
const curriculumPath = resolve(epcasRoot, 'src/lib/curriculum.ts')
const curriculumJsonPath = resolve(projectRoot, 'src/logistique/curriculum.json')
const outputPath = resolve(projectRoot, 'src/logistique/imported-banks.json')

if (!existsSync(curriculumPath)) throw new Error(`Curriculum EPCAS introuvable : ${curriculumPath}`)

const originalResolve = Module._resolveFilename
Module._resolveFilename = function resolveTypeScript(request, parent, ...args) {
  if (typeof request === 'string' && request.startsWith('.') && parent?.filename) {
    const candidate = resolve(dirname(parent.filename), `${request}.ts`)
    if (existsSync(candidate)) return originalResolve.call(this, candidate, parent, ...args)
  }
  return originalResolve.call(this, request, parent, ...args)
}

Module._extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText
  module._compile(compiled, filename)
}

const { buildCurriculumLessons } = require(curriculumPath)
const curriculum = JSON.parse(readFileSync(curriculumJsonPath, 'utf8'))
const sourceCommit = execFileSync('git', ['-C', epcasRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (curriculum.source?.commit && curriculum.source.commit !== sourceCommit) {
  throw new Error(`Révision EPCAS incohérente : curriculum.json=${curriculum.source.commit}, checkout=${sourceCommit}`)
}
const sourceRevision = `epcas-${sourceCommit.slice(0, 12)}`
const sourceRepository = 'oasi-phuoc/epcas'
const typePages = [
  ['theorie', 'theorie'],
  ['maths', 'maths'],
  ['verification', 'verification'],
  ['situation', 'situation'],
  ['glossaire', 'glossaire'],
]
const levelsForDomain = { CFC: 'logistique-cfc', AFP: 'logistique-afp' }
const lessons = buildCurriculumLessons()
const lessonByModuleAndSlug = new Map(lessons.map(lesson => [`${lesson.moduleId.slice(4)}:${lesson.pageSlug}`, lesson]))
const banks = {}
const units = {}
const populatedByType = Object.fromEntries(typePages.map(([type]) => [type, 0]))

function isPlaceholder(text) {
  return !text?.trim() || /contenu à importer|contenu résumé à compléter|contenu onenote à importer/i.test(text)
}

function cleanContent(text) {
  return isPlaceholder(text) ? '' : text
}

function hashContent(pages) {
  return createHash('sha256').update(JSON.stringify(pages)).digest('hex')
}

const sourcePageCounts = {}
for (const lesson of lessons) {
  if (cleanContent(lesson.contentFull) || cleanContent(lesson.contentSummary)) {
    sourcePageCounts[lesson.pageSlug] = (sourcePageCounts[lesson.pageSlug] ?? 0) + 1
  }
}

for (const module of curriculum.modules) {
  for (const [type, pageSlug] of typePages) {
    const lesson = lessonByModuleAndSlug.get(`${module.code}:${pageSlug}`)
    const fullMarkdown = cleanContent(lesson?.contentFull)
    const summaryMarkdown = cleanContent(lesson?.contentSummary)
    const sourcePages = [{ slug: pageSlug, fullMarkdown, summaryMarkdown }]
    const extras = {}

    if (type === 'theorie') {
      const objectives = lessonByModuleAndSlug.get(`${module.code}:objectifs`)
      const overview = lessonByModuleAndSlug.get(`${module.code}:apercu`)
      extras.objectivesMarkdown = cleanContent(objectives?.contentFull)
      extras.objectivesSummaryMarkdown = cleanContent(objectives?.contentSummary)
      extras.overviewMarkdown = cleanContent(overview?.contentFull)
      extras.overviewSummaryMarkdown = cleanContent(overview?.contentSummary)
      if (extras.objectivesMarkdown || extras.objectivesSummaryMarkdown) sourcePages.push({ slug: 'objectifs', ...extras })
      if (extras.overviewMarkdown || extras.overviewSummaryMarkdown) sourcePages.push({ slug: 'apercu', ...extras })
    }

    const hasSourceContent = sourcePages.some(page => page.fullMarkdown || page.summaryMarkdown || page.objectivesMarkdown || page.objectivesSummaryMarkdown || page.overviewMarkdown || page.overviewSummaryMarkdown)
    const sourceHash = hashContent(sourcePages)
    const unitId = `epcas-${module.code}-${type}-${sourceHash.slice(0, 12)}`

    if (hasSourceContent && !units[unitId]) {
      const sourceFields = sourcePages.map(page => `filledByModule.${module.code}.${page.slug}`).join(',')
      const provenance = module.eligibleLevels.map(level => ({
        origin: 'epcas',
        repository: sourceRepository,
        commit: sourceCommit,
        path: 'src/lib/curriculum.ts',
        sourceField: sourceFields,
        sourceHash,
        rights: 'pending',
        resolution: level === 'AFP' ? 'inherited-cfc' : 'native-cfc',
      }))
      units[unitId] = {
        id: unitId,
        submoduleCode: module.code,
        type,
        revision: sourceHash.slice(0, 16),
        objectiveIds: [],
        eligibleLevels: module.eligibleLevels,
        reviewByLevel: Object.fromEntries(module.eligibleLevels.map(level => [level, {
          status: 'imported-unreviewed',
          revision: sourceRevision,
        }])),
        status: 'imported-unreviewed',
        payload: {
          kind: 'source-document',
          title: module.title,
          fullMarkdown,
          summaryMarkdown,
          ...extras,
          sourceSlug: pageSlug,
        },
        provenance,
        tags: ['epcas-import', 'needs-editorial-review'],
      }
      populatedByType[type] += 1
    }

    for (const level of module.eligibleLevels) {
      const domain = levelsForDomain[level]
      const key = `${domain}:${module.code}:${type}`
      banks[key] = {
        revision: sourceRevision,
        submoduleCode: module.code,
        type,
        unitIds: hasSourceContent ? [unitId] : [],
      }
    }
  }
}

const output = {
  schemaVersion: 1,
  source: {
    repository: sourceRepository,
    commit: sourceCommit,
    path: 'src/lib/curriculum.ts',
    policy: 'Imported source material remains unreviewed and is not eligible for generation until pedagogical review and reuse rights are approved per diploma.',
  },
  counts: {
    modules: curriculum.modules.length,
    catalogBanks: Object.keys(banks).length,
    populatedBanks: Object.values(banks).filter(bank => bank.unitIds.length > 0).length,
    uniqueUnits: Object.keys(units).length,
    emptyBanks: Object.values(banks).filter(bank => bank.unitIds.length === 0).length,
    sourcePagesImported: Object.values(sourcePageCounts).reduce((sum, count) => sum + count, 0),
    sourcePageCounts,
    populatedByType,
  },
  banks,
  units,
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({ outputPath, ...output.counts, sourceCommit }, null, 2))
