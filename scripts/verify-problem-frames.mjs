/**
 * Vérifie les banques régénérées (100 prompts uniques / cellule, 18 cellules).
 * Usage : node scripts/verify-problem-frames.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const genSrc = fs.readFileSync(path.join(root, 'scripts/gen-problem-banks.mjs'), 'utf8')
if (!genSrc.includes('const FRAME_COUNT = 50')) throw new Error('FRAME_COUNT != 50')
if (!genSrc.includes('const BANK_SIZE = 100')) throw new Error('BANK_SIZE != 100')

const banksTs = fs.readFileSync(path.join(root, 'src/math/problem-banks.ts'), 'utf8')
const marker = 'export const PROBLEM_BANKS: Record<string, ProblemBankEntry[]> = '
const idx = banksTs.indexOf(marker)
if (idx < 0) throw new Error('PROBLEM_BANKS introuvable')
const obj = JSON.parse(banksTs.slice(idx + marker.length).trim())
const keys = Object.keys(obj)
if (keys.length !== 18) throw new Error(`Attendu 18 cellules, got ${keys.length}`)

const all = new Set()
for (const key of keys) {
  const arr = obj[key]
  if (arr.length !== 100) throw new Error(`${key}: ${arr.length} prompts (attendu 100)`)
  const local = new Set(arr.map((e) => e.prompt))
  if (local.size !== arr.length) throw new Error(`${key}: doublons`)
  for (const p of local) {
    if (all.has(p)) throw new Error(`Doublon global: ${p.slice(0, 60)}`)
    all.add(p)
  }
}

console.log('OK — 18 cellules × 100 prompts uniques (1800 global).')
console.log('Générateur : FRAME_COUNT=50, BANK_SIZE=100 (asserté à la génération).')
