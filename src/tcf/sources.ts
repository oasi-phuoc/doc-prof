import type { TcfExercise } from './types'

/** Document d’origine d’un exercice, déduit du préfixe de son identifiant. */
const SOURCES: ReadonlyArray<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^tcf-a0a1$/, () => 'Exemple'],
  [/^tcf-a1j-s(\d+)$/, (m) => `Test blanc A1 Junior · série ${m[1]}`],
  [/^tcf-a1-s(\d+)$/, (m) => `Test blanc A1 · série ${m[1]}`],
  [/^tcf-a1p-s(\d+)$/, (m) => `Préparation A1 · série ${m[1]}`],
  [/^tcf-a1-tp([a-z])$/, (m) => `Test blanc A1 tout public · série ${m[1]!.toUpperCase()}`],
  [/^tcf-a1-sem1$/, () => 'TCF A1.1-A1 scolaire · semestre 1 2024-2025'],
  [/^tcf-a2j-s(\d+)$/, (m) => `Test blanc A2 Junior · série ${m[1]}`],
  [/^tcf-a2-s(\d+)$/, (m) => `Test blanc A2 · série ${m[1]}`],
  [/^tcf-a2-s([a-z])$/, (m) => `Test blanc A2 · série ${m[1]!.toUpperCase()}`],
  [/^tcf-a2p-s(\d+)$/, (m) => `Préparation A2 · série ${m[1]}`],
  [/^tcf-ss-a1-s(\d+)$/, (m) => `Soutien scolaire CO A1 · série ${m[1]}`],
  [/^tcf-ss-a2-s(\d+)$/, (m) => `Soutien scolaire CO A2 · série ${m[1]}`],
  [/^tcf-ss-b1-s(\d+)$/, (m) => `Soutien scolaire CO B1 · série ${m[1]}`],
]

/** Libellé d’un exercice dans le sélecteur de banque : source, numéro, thème. */
export function tcfExerciseLabel(ex: TcfExercise): string {
  const match = ex.id.match(/^(.*)-(?:co|ce|pe|po)-([^-]+)$/)
  const prefix = match?.[1] ?? ex.id
  const found = SOURCES.map(([re, label]) => {
    const m = prefix.match(re)
    return m ? label(m) : null
  }).find((label) => label != null)
  const source = found ?? prefix
  const numero = match ? ` · ex. ${match[2]}` : ''
  return `${source}${numero}${ex.theme ? ` · ${ex.theme}` : ''}`
}
