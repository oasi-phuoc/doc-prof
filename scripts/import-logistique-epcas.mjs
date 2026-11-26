import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const revision = 'ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f'
const checkout = process.argv[2]
if (!checkout || process.argv.length !== 3) {
  throw new Error('Usage : node scripts/import-logistique-epcas.mjs /chemin/vers/epcas')
}

function readSource(filename) {
  const bytes = execFileSync('git', ['-C', checkout, 'show', `${revision}:src/lib/${filename}`], { maxBuffer: 4 * 1024 * 1024 })
  return {
    sha256: createHash('sha256').update(bytes).digest('hex'),
    tree: ts.createSourceFile(filename, bytes.toString('utf8'), ts.ScriptTarget.Latest, true),
  }
}

function initializer(tree, name) {
  for (const statement of tree.statements) {
    if (!ts.isVariableStatement(statement)) continue
    const declaration = statement.declarationList.declarations.find((entry) => entry.name.getText(tree) === name)
    if (declaration?.initializer) return declaration.initializer
  }
  throw new Error(`Déclaration EPCAS absente : ${name}`)
}

function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map((property) => {
      if (!ts.isPropertyAssignment(property) || !(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) || ts.isNumericLiteral(property.name))) {
        throw new Error('Propriété EPCAS non littérale')
      }
      return [property.name.text, literal(property.initializer)]
    }))
  }
  throw new Error(`Expression EPCAS non littérale : ${ts.SyntaxKind[node.kind]}`)
}

function studyYear(sequences, code) {
  return Number(Object.keys(sequences).find((year) => sequences[year].includes(code))) || null
}

function writeJson(path, data) {
  const destination = fileURLToPath(new URL(`../${path}`, import.meta.url))
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, JSON.stringify(data, null, 2) + '\n')
}

const curriculum = readSource('curriculum.ts')
const levels = readSource('levels.ts')
const sequences = literal(initializer(levels.tree, 'DEFAULT_YEAR_CODES'))
const themes = literal(initializer(curriculum.tree, 'curriculumBlocks')).map(({ code, title }) => ({ code, title }))
const modules = literal(initializer(curriculum.tree, 'moduleSeeds')).map(({ code, title, blockId }) => ({
  code,
  title,
  theme: blockId.replace(/^block-/, ''),
  year: { CFC: studyYear(sequences.CFC, code), AFP: studyYear(sequences.AFP, code) },
}))
const afp = modules.filter((entry) => entry.year.AFP !== null)
if (themes.length !== 9 || modules.length !== 80 || afp.length !== 63 || new Set(modules.map(({ code }) => code)).size !== 80 ||
    new Set(afp.map(({ theme }) => theme)).size !== 7 ||
    modules.some(({ year, theme }) => !year.CFC || (year.AFP !== null && ![1, 2].includes(year.AFP)) ||
      !themes.some(({ code }) => code === theme))) {
  throw new Error('Le catalogue EPCAS ne correspond pas à la matrice attendue')
}

const registry = initializer(curriculum.tree, 'filledByModule')
if (!ts.isObjectLiteralExpression(registry)) throw new Error('Registre EPCAS non littéral')

const registryByCode = new Map(registry.properties.map((entry) => {
  if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
    throw new Error('Entrée de module EPCAS non littérale')
  }
  return [entry.name.getText(curriculum.tree).replace(/^["']|["']$/g, ''), entry.initializer.properties]
}))

const requiredPages = ['theorie', 'maths', 'verification', 'situation', 'glossaire']
const inventory = modules.map(({ code, year }) => {
  const pages = (registryByCode.get(code) ?? []).map((entry) => entry.name.getText(curriculum.tree))
  return { code, year, sourcePages: pages, missing: requiredPages.filter((slug) => !pages.includes(slug)) }
})

function extractModule(code) {
  const excludedReferences = []
  const pages = Object.fromEntries((registryByCode.get(code) ?? []).map((page) => {
    if (!ts.isPropertyAssignment(page) || !ts.isObjectLiteralExpression(page.initializer)) {
      throw new Error(`Page EPCAS non littérale dans le module ${code}`)
    }
    const slug = page.name.getText(curriculum.tree)
    const versions = Object.fromEntries(page.initializer.properties.map((property) => {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.initializer)) {
        throw new Error(`Version EPCAS non littérale dans le module ${code} · ${slug}`)
      }
      const version = property.name.getText(curriculum.tree)
      const raw = literal(initializer(curriculum.tree, property.initializer.text))
      const text = raw.split('\n').map((line, index) => {
        return line
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, (_, alt) => {
            excludedReferences.push({ page: slug, version, line: index + 1, reason: 'Illustration historique', alt })
            return ''
          })
          .replace(/ Lien : \[Vers le site EnterSite\]\(#entersite-placeholder\) \(URL à compléter lorsque disponible\)\./g, () => {
            excludedReferences.push({ page: slug, version, line: index + 1, reason: 'Lien fictif vers la visite virtuelle EPCAS' })
            return ''
          })
      }).join('\n')
      if (/!\[|<img\b|\.(?:png|jpe?g|webp|gif|svg)\b/i.test(text)) {
        throw new Error(`Référence de média restante dans le module ${code} · ${slug} · ${version}`)
      }
      return [version, text]
    }))
    return [slug, versions]
  }))
  return { module: code, status: 'imported-unreviewed', excludedReferences, pages }
}

const archives = new Map(modules.map(({ code }) => [code, extractModule(code)]))
const source = { revision, curriculumSha256: curriculum.sha256, levelsSha256: levels.sha256 }
writeJson('src/logistique/curriculum.generated.json', { source, themes, modules })
writeJson('docs/logistique/inventaire-epcas.generated.json', {
  source,
  scope: 'Déclarations Git statiques, sans vérification des questions, du contenu cloud ou de l’éligibilité pédagogique AFP.',
  modules: inventory,
})
writeJson('docs/logistique/pilote-105/sources-epcas.json', {
  source,
  ...archives.get('105'),
  afp: 'héritage candidat, à valider',
})
for (const theme of themes) {
  writeJson(`docs/logistique/sources-epcas/${theme.code}.generated.json`, {
    source,
    theme: theme.code,
    modules: modules.filter((entry) => entry.theme === theme.code && entry.code !== '105')
      .map(({ code }) => archives.get(code)),
  })
}
const pageCount = [...archives.values()].reduce((total, archive) => total + Object.keys(archive.pages).length, 0)
const exclusions = [...archives.values()].reduce((total, archive) => total + archive.excludedReferences.length, 0)
console.log(`${themes.length} thèmes CFC, 7 thèmes AFP, ${modules.length} modules CFC, ${afp.length} modules AFP, ${pageCount} pages sources archivées, ${exclusions} références exclues.`)
