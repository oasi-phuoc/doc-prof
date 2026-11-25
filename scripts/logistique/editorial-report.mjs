import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const ARCHIVE_PATH = resolve(ROOT, 'editorial/logistique/source-archive.json')
const JSON_PATH = resolve(ROOT, 'docs/logistique/couverture-import.json')
const MARKDOWN_PATH = resolve(ROOT, 'docs/logistique/rapport-importation.md')
const TYPES = ['theorie', 'maths', 'verification', 'situation', 'glossaire']
const TARGETS = { maths: 30, verification: 50, situation: 20 }
const LEVEL_FOR_DOMAIN = { 'logistique-cfc': 'CFC', 'logistique-afp': 'AFP' }

const allowedRights = new Set(['permitted-reuse', 'project-original'])

export function buildEditorialReport(archive) {
  const bankRows = Object.entries(archive.banks).map(([key, bank]) => {
    const [domain, code, type] = key.split(':')
    const level = LEVEL_FOR_DOMAIN[domain]
    if (!level || !TYPES.includes(type)) throw new Error(`Clé de banque invalide : ${key}`)
    const units = [...new Set(bank.unitIds)].map(id => archive.units[id]).filter(Boolean)
    const statusCounts = {}
    for (const unit of units) statusCounts[unit.status] = (statusCounts[unit.status] ?? 0) + 1
    const approved = units.filter(unit => unit.status === 'approved'
      && unit.reviewByLevel?.[level]?.status === 'approved'
      && unit.provenance?.every(source => allowedRights.has(source.rights)))
    const hasTarget = Object.hasOwn(TARGETS, type)
    return {
      key,
      domain,
      diploma: level,
      submoduleCode: code,
      type,
      sourcePageIds: [...bank.sourcePageIds],
      sourceUnits: units.length,
      unitIds: units.map(unit => unit.id),
      statusCounts,
      approvedUnits: approved.length,
      pendingRightsUnits: units.filter(unit => unit.provenance?.some(source => source.rights === 'pending')).length,
      pendingRightsUnitIds: units.filter(unit => unit.provenance?.some(source => source.rights === 'pending')).map(unit => unit.id),
      blockedUnits: units.filter(unit => unit.status === 'blocked').length,
      target: hasTarget ? TARGETS[type] : null,
      deficit: hasTarget ? Math.max(0, TARGETS[type] - approved.length) : null,
      responsible: null,
      lastReview: null,
    }
  }).sort((a, b) => a.diploma.localeCompare(b.diploma) || a.submoduleCode.localeCompare(b.submoduleCode, undefined, { numeric: true }) || TYPES.indexOf(a.type) - TYPES.indexOf(b.type))

  const totals = Object.fromEntries(['CFC', 'AFP'].map(diploma => {
    const rows = bankRows.filter(row => row.diploma === diploma)
    return [diploma, {
      bankSlots: rows.length,
      populatedSlots: rows.filter(row => row.sourceUnits > 0).length,
      emptySlots: rows.filter(row => row.sourceUnits === 0).length,
      uniqueUnits: new Set(rows.flatMap(row => row.unitIds)).size,
      approvedUnitsByType: Object.fromEntries(TYPES.map(type => [type, rows.filter(row => row.type === type).reduce((sum, row) => sum + row.approvedUnits, 0)])),
      pendingRightsUnits: new Set(rows.flatMap(row => row.unitIds.filter(id => archive.units[id]?.provenance?.some(source => source.rights === 'pending')))).size,
    }]
  }))

  return {
    schemaVersion: 1,
    source: { repository: archive.source.repository, commit: archive.source.commit },
    generatedAt: new Date().toISOString(),
    policy: 'Les unités importées ne sont pas approuvées par ce rapport. Seules les unités avec approbation par diplôme et droits confirmés comptent comme approuvées.',
    totals,
    byBank: bankRows,
    quarantine: {
      total: Object.keys(archive.quarantine).length,
      byReason: archive.report.review.quarantineByReason,
    },
    duplicateCandidates: archive.report.review.duplicateCandidates.length,
  }
}

export function renderMarkdown(report) {
  const rows = ['| Diplôme | Type | Banques | Avec source | Vides | Unités uniques référencées | Approuvées | Droits en attente |', '|---|---|---:|---:|---:|---:|---:|---:|']
  for (const diploma of ['CFC', 'AFP']) {
    for (const type of TYPES) {
      const banks = report.byBank.filter(row => row.diploma === diploma && row.type === type)
      const uniqueIds = new Set(banks.flatMap(row => row.unitIds))
      const pendingRightsIds = new Set(banks.flatMap(row => row.pendingRightsUnitIds))
      rows.push(`| ${diploma} | ${type} | ${banks.length} | ${banks.filter(row => row.sourceUnits > 0).length} | ${banks.filter(row => row.sourceUnits === 0).length} | ${uniqueIds.size} | ${banks.reduce((sum, row) => sum + row.approvedUnits, 0)} | ${pendingRightsIds.size} |`)
    }
  }
  const statusTotals = Object.entries(report.byBank.reduce((counts, row) => {
    for (const [status, count] of Object.entries(row.statusCounts)) counts[status] = (counts[status] ?? 0) + count
    return counts
  }, {})).map(([status, count]) => `- ${status} : ${count} références banque`)
  return [
    '# Rapport d’importation et de couverture — Logistique CFC/AFP',
    '',
    '- Source : ' + report.source.repository + ' — commit ' + report.source.commit,
    `- Généré le : ${report.generatedAt}`,
    `- Archive : ${report.totals.CFC.uniqueUnits} unités CFC référencées et ${report.totals.AFP.uniqueUnits} unités AFP référencées; les mêmes unités communes peuvent apparaître dans les deux vues.`,
    `- Quarantaine : ${report.quarantine.total}; candidats doublons : ${report.duplicateCandidates}.`,
    '',
    report.policy,
    '',
    '| Diplôme | Type | Banques | Avec source | Vides | Unités uniques référencées | Approuvées | Droits en attente |',
    '|---|---|---:|---:|---:|---:|---:|---:|',
    ...rows.slice(2),
    '',
    '## Statuts importés',
    '',
    ...statusTotals,
    '',
    'Les compteurs de cible et de déficit détaillés par sous-thème figurent dans `couverture-import.json`. Les champs de responsable et de dernière revue restent nuls tant qu’une validation humaine n’est pas enregistrée. Les objectifs de volume sont des propositions du cahier des charges, pas des seuils officiellement validés.',
    '',
  ].join('\n')
}

async function main() {
  const archive = JSON.parse(await readFile(ARCHIVE_PATH, 'utf8'))
  const report = buildEditorialReport(archive)
  await writeFile(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`)
  await writeFile(MARKDOWN_PATH, renderMarkdown(report))
  console.log(`Rapport généré : ${JSON_PATH} et ${MARKDOWN_PATH}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
