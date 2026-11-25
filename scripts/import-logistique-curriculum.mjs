import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { buildEpcasImport, extractDemoSourceLiterals } from './logistique/build-epcas-import.mjs'

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
const levelsPath = resolve(epcasRoot, 'src/lib/levels.ts')
const demoDataPath = resolve(epcasRoot, 'src/lib/demo-data.ts')
const curriculumJsonPath = resolve(projectRoot, 'src/logistique/curriculum.json')
const outputPath = resolve(projectRoot, 'src/logistique/imported-banks.json')
const archivePath = resolve(projectRoot, 'editorial/logistique/source-archive.json')

for (const path of [curriculumPath, levelsPath, demoDataPath, curriculumJsonPath]) {
  if (!existsSync(path)) throw new Error(`Fichier source introuvable : ${path}`)
}

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

const { buildCurriculumLessons, buildCurriculumModules } = require(curriculumPath)
const { buildDefaultSequences } = require(levelsPath)
const curriculum = JSON.parse(readFileSync(curriculumJsonPath, 'utf8'))
const sourceCommit = execFileSync('git', ['-C', epcasRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (curriculum.source?.commit && curriculum.source.commit !== sourceCommit) {
  throw new Error(`Révision EPCAS incohérente : curriculum.json=${curriculum.source.commit}, checkout=${sourceCommit}`)
}

const sourceModules = buildCurriculumModules()
const sourceLessons = buildCurriculumLessons()
const sourceSequences = buildDefaultSequences(sourceModules)
const demoSources = extractDemoSourceLiterals({ demoDataPath, ts, readFileSync })
const output = buildEpcasImport({
  sourceCommit,
  targetCurriculum: curriculum,
  sourceModules,
  sourceLessons,
  sourceSequences,
  demoSources,
})

mkdirSync(dirname(outputPath), { recursive: true })
mkdirSync(dirname(archivePath), { recursive: true })
const approvedUnitIds = new Set(Object.values(output.units)
  .filter(unit => unit.status === 'approved' && unit.provenance.every(source => source.rights === 'permitted-reuse' || source.rights === 'project-original'))
  .map(unit => unit.id))
const runtimeBanks = Object.fromEntries(Object.entries(output.banks).map(([key, bank]) => [key, {
  ...bank,
  unitIds: bank.unitIds.filter(id => {
    const unit = output.units[id]
    const level = key.startsWith('logistique-afp:') ? 'AFP' : 'CFC'
    return approvedUnitIds.has(id) && unit.eligibleLevels.includes(level) && unit.reviewByLevel[level]?.status === 'approved'
  }),
  sourceUnitCount: bank.unitIds.length,
}]))
const runtimeUnitIds = new Set(Object.values(runtimeBanks).flatMap(bank => bank.unitIds))
const runtimeReport = {
  ...output.report,
  review: { ...output.report.review, duplicateCandidates: [] },
}
const runtimeOutput = {
  schemaVersion: output.schemaVersion,
  source: output.source,
  counts: output.counts,
  report: runtimeReport,
  banks: runtimeBanks,
  units: Object.fromEntries([...runtimeUnitIds].map(id => [id, output.units[id]])),
}
const archiveOutput = {
  schemaVersion: output.schemaVersion,
  source: output.source,
  counts: output.counts,
  report: output.report,
  banks: output.banks,
  units: output.units,
  sourcePages: output.sourcePages,
  quarantine: output.quarantine,
}
writeFileSync(outputPath, `${JSON.stringify(runtimeOutput, null, 2)}\n`)
writeFileSync(archivePath, `${JSON.stringify(archiveOutput, null, 2)}\n`)
console.log(JSON.stringify({ outputPath, archivePath, ...output.counts, report: output.report }, null, 2))
