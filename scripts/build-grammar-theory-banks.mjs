#!/usr/bin/env node
/**
 * Extrait les théories grammaire du repo soutien-scolaire (FR seul),
 * les aplatit et écrit src/francais/grammar-theory-banks.ts.
 *
 * Relancer : node scripts/build-grammar-theory-banks.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SOUTIEN =
  process.env.SOUTIEN_DIR ||
  (existsSync('/tmp/soutien-scolaire/lib/curriculum/content/francais')
    ? '/tmp/soutien-scolaire'
    : join(ROOT, '../soutien-scolaire'))
const CONTENT = join(SOUTIEN, 'lib/curriculum/content/francais')
const OUT = join(ROOT, 'src/francais/grammar-theory-banks.ts')

/** Thème ClairFLE → slugs de leçons soutien (ordre = Théorie 1, 2…). */
const THEME_SLUGS = {
  'fr-presenter': ['a1-gr-etre', 'a1-gr-avoir', 'a1-gr-cest-il-est'],
  'fr-famille': ['a1-gr-l19'],
  'fr-description': ['a1-gr-genre-adjectifs', 'a1-gr-pluriel-adjectifs'],
  'fr-logement': ['a1-gr-l04'],
  'fr-achats': ['a1-gr-place-adjectif', 'a1-gr-expression-quantite'],
  'fr-vetements': ['a1-gr-conditionnel-present'],
  'fr-nourriture': ['a1-gr-article-partitif'],
  'fr-sante': ['a1-gr-modaux'],
  'fr-transports': ['a1-gr-verbes-er'],
  'fr-inviter': ['a1-gr-question-totale'],
  'fr-travail': ['a1-gr-genre-adjectifs'],
  'fr-journee': ['a1-gr-pronominaux'],
  'fr-loisirs': ['a1-gr-pronoms-cod-coi'],
}

const SLUG_FILES = {
  'a1-gr-etre': 'grammaire-g1.2.ts',
  'a1-gr-avoir': 'grammaire-g1.3.ts',
  'a1-gr-l01': 'grammaire-g1.1.ts',
  'a1-gr-cest-il-est': 'grammaire-g1.4.ts',
  'a1-gr-l19': 'grammaire-g4.6.ts',
  'a1-gr-genre-adjectifs': 'grammaire-g3.1.ts',
  'a1-gr-pluriel-adjectifs': 'grammaire-g3.2.ts',
  'a1-gr-l04': 'grammaire-g4.1.ts',
  'a1-gr-place-adjectif': 'grammaire-g3.4.ts',
  'a1-gr-expression-quantite': 'grammaire-g4.4.ts',
  'a1-gr-conditionnel-present': 'grammaire-g16.8.ts',
  'a1-gr-article-partitif': 'grammaire-g4.3.ts',
  'a1-gr-modaux': 'grammaire-g1.7.ts',
  'a1-gr-verbes-er': 'grammaire-g1.5.ts',
  'a1-gr-question-totale': 'grammaire-g5.3.ts',
  'a1-gr-pronominaux': 'grammaire-g1.6.ts',
  'a1-gr-pronoms-cod-coi': 'grammaire-g12.2.ts',
}

function clean(s) {
  return String(s ?? '')
    .replace(/\{a\}/g, '')
    .replace(/\{\/a\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTheoryArray(src) {
  const title = (src.match(/title:\s*"([^"]+)"/) || [])[1] || ''
  const m = src.match(/theory:\s*\[/)
  if (!m) return null
  let i = m.index + m[0].length - 1
  let depth = 0
  const start = i
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++
    else if (src[i] === ']') {
      depth--
      if (depth === 0) return { title, body: src.slice(start, i + 1) }
    }
  }
  return null
}

function stripTransProps(s) {
  const propRe = /\b(trans[A-Za-z]*|noteTrans)\s*:\s*/g
  let out = ''
  let last = 0
  let match
  while ((match = propRe.exec(s))) {
    out += s.slice(last, match.index)
    let j = match.index + match[0].length
    while (s[j] === ' ' || s[j] === '\n') j++
    if (s[j] === '{' || s[j] === '[') {
      const open = s[j]
      const close = open === '{' ? '}' : ']'
      let d = 0
      for (; j < s.length; j++) {
        if (s[j] === open) d++
        else if (s[j] === close) {
          d--
          if (d === 0) {
            j++
            break
          }
        }
      }
      while (s[j] === ',' || s[j] === ' ' || s[j] === '\n') j++
      last = j
      propRe.lastIndex = j
    } else {
      while (j < s.length && s[j] !== ',' && s[j] !== '\n') j++
      if (s[j] === ',') j++
      last = j
      propRe.lastIndex = j
    }
  }
  out += s.slice(last)
  return out.replace(/,(\s*[}\]])/g, '$1')
}

/** Stub verbsToSelector → selector de tableaux de conjugaison. */
function verbsToSelector(verbs, opts) {
  const negation = opts?.negation
  const vowel = /[aeiouàâæéèêëîïôœùûüÿh]/i
  return {
    type: 'selector',
    tabs: verbs.map((verb) => ({
      label: verb.infinitive,
      content: [
        {
          type: 'table',
          tables: [
            {
              verb: verb.infinitive + (negation ? ' (négation)' : ''),
              rows: verb.rows.map((row, ri) => {
                const radical = row.radical !== undefined ? row.radical : verb.radical
                const stem = radical ?? ''
                const refl = verb.reflexivePronouns?.[ri]
                if (negation) {
                  const reflPart = refl ? (refl.endsWith("'") ? refl : `${refl} `) : ''
                  const body = `${reflPart}${stem}${row.ending}`
                  const ne = vowel.test((stem || verb.radical || '')[0] ?? '') ? "n'" : 'ne '
                  return { pronoun: row.pronoun, form: `${ne}${body} pas` }
                }
                const reflMarkup = refl ? (refl.endsWith("'") ? refl : `${refl} `) : ''
                return { pronoun: row.pronoun, form: `${reflMarkup}${stem}${row.ending}` }
              }),
            },
          ],
        },
      ],
    })),
  }
}

function flattenBlocks(blocks, acc = []) {
  for (const b of blocks) {
    if (!b || !b.type) continue
    if (b.type === 'selector' && Array.isArray(b.tabs)) {
      for (const tab of b.tabs) {
        acc.push({ kind: 'heading', text: clean(tab.label), sub: true })
        flattenBlocks(tab.content || [], acc)
      }
      continue
    }
    if (b.type === 'heading') {
      acc.push({ kind: 'heading', text: clean(b.text), sub: Boolean(b.sub) })
    } else if (b.type === 'text') {
      if (b.label) acc.push({ kind: 'heading', text: clean(b.label), sub: true })
      if (b.text) acc.push({ kind: 'paragraph', text: clean(b.text) })
      if (b.items?.length) acc.push({ kind: 'list', items: b.items.map(clean) })
    } else if (b.type === 'rule') {
      acc.push({
        kind: 'rule',
        text: clean(b.text),
        examples: (b.examples || []).map((e) => ({
          correct: clean(e.correct),
          wrong: e.wrong ? clean(e.wrong) : undefined,
        })),
      })
    } else if (b.type === 'note') {
      acc.push({ kind: 'note', text: clean(b.text) })
    } else if (b.type === 'vocab') {
      acc.push({ kind: 'list', title: clean(b.title), items: (b.items || []).map(clean) })
    } else if (b.type === 'grid') {
      acc.push({
        kind: 'table',
        headers: (b.headers || []).map(clean),
        rows: (b.rows || []).map((r) => r.map(clean)),
      })
    } else if (b.type === 'table') {
      for (const t of b.tables || []) {
        acc.push({ kind: 'heading', text: clean(t.verb || 'Conjugaison'), sub: true })
        acc.push({
          kind: 'table',
          headers: ['Pronom', 'Forme'],
          rows: (t.rows || []).map((r) => [clean(r.pronoun), clean(r.form)]),
        })
      }
    } else if (b.type === 'word_cards') {
      acc.push({ kind: 'list', items: (b.items || []).map(clean) })
    }
  }
  return acc
}

/** Limite la densité imprimable : max ~N blocs utiles. */
function trimBlocks(blocks, max = 28) {
  if (blocks.length <= max) return blocks
  // Garder titres + début de contenu
  const out = []
  for (const b of blocks) {
    if (out.length >= max) break
    out.push(b)
  }
  return out
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function emitBlock(b, indent) {
  const pad = ' '.repeat(indent)
  if (b.kind === 'heading') {
    return `${pad}{ kind: 'heading', text: '${esc(b.text)}'${b.sub ? ', sub: true' : ''} }`
  }
  if (b.kind === 'paragraph' || b.kind === 'note') {
    return `${pad}{ kind: '${b.kind}', text: '${esc(b.text)}' }`
  }
  if (b.kind === 'rule') {
    const ex = (b.examples || [])
      .map(
        (e) =>
          `{ correct: '${esc(e.correct)}'${e.wrong ? `, wrong: '${esc(e.wrong)}'` : ''} }`,
      )
      .join(', ')
    return `${pad}{ kind: 'rule', text: '${esc(b.text)}'${ex ? `, examples: [${ex}]` : ''} }`
  }
  if (b.kind === 'list') {
    const items = (b.items || []).map((i) => `'${esc(i)}'`).join(', ')
    return `${pad}{ kind: 'list'${b.title ? `, title: '${esc(b.title)}'` : ''}, items: [${items}] }`
  }
  if (b.kind === 'table') {
    const headers = (b.headers || []).map((h) => `'${esc(h)}'`).join(', ')
    const rows = (b.rows || [])
      .map((r) => `[${r.map((c) => `'${esc(c)}'`).join(', ')}]`)
      .join(', ')
    return `${pad}{ kind: 'table', headers: [${headers}], rows: [${rows}] }`
  }
  return `${pad}{ kind: 'paragraph', text: '' }`
}

function extractPreambleConsts(src) {
  const before = src.split(/export\s+const\s+/)[0] || ''
  let s = before
    .replace(/^import[\s\S]*?;\s*/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  // Strip TS type annotations on const
  s = s.replace(/const\s+(\w+)\s*:\s*[^=]+=/g, 'const $1 =')
  return s.trim()
}

function main() {
  if (!existsSync(CONTENT)) {
    console.error('Dossier soutien introuvable:', CONTENT)
    process.exit(1)
  }

  const bySlug = {}
  for (const [slug, file] of Object.entries(SLUG_FILES)) {
    const src = readFileSync(join(CONTENT, file), 'utf8')
    const ex = extractTheoryArray(src)
    if (!ex) {
      console.error('extract fail', slug)
      process.exit(1)
    }
    let body = stripTransProps(ex.body)
    body = body.replace(/\/\*[\s\S]*?\*\//g, '')
    const preamble = extractPreambleConsts(src)
    let blocks
    try {
      // eslint-disable-next-line no-new-func
      blocks = Function(
        'verbsToSelector',
        `"use strict";\n${preamble}\nreturn (${body});`,
      )(verbsToSelector)
    } catch (err) {
      console.error('eval fail', slug, err.message)
      process.exit(1)
    }
    bySlug[slug] = {
      slug,
      title: ex.title,
      blocks: trimBlocks(flattenBlocks(blocks)),
    }
    console.log(slug, bySlug[slug].title, bySlug[slug].blocks.length)
  }

  const lines = []
  lines.push(`/** Généré par scripts/build-grammar-theory-banks.mjs — théories FR (soutien scolaire). */`)
  lines.push(`import type { GrammarTheoryDoc } from './grammar-theory'`)
  lines.push('')
  lines.push(`export const GRAMMAR_THEORY_BY_TOPIC: Record<string, GrammarTheoryDoc[]> = {`)

  for (const [topic, slugs] of Object.entries(THEME_SLUGS)) {
    lines.push(`  '${topic}': [`)
    slugs.forEach((slug, index) => {
      const doc = bySlug[slug]
      if (!doc) {
        console.error('missing slug', slug, 'for', topic)
        process.exit(1)
      }
      lines.push(`    {`)
      lines.push(`      id: '${topic}-theorie-${index + 1}',`)
      lines.push(`      index: ${index + 1},`)
      lines.push(`      title: '${esc(doc.title)}',`)
      lines.push(`      sourceSlug: '${slug}',`)
      lines.push(`      blocks: [`)
      for (const b of doc.blocks) lines.push(`${emitBlock(b, 8)},`)
      lines.push(`      ],`)
      lines.push(`    },`)
    })
    lines.push(`  ],`)
  }
  lines.push(`}`)
  lines.push('')
  lines.push(`export function theoriesForTopic(topic: string): GrammarTheoryDoc[] {`)
  lines.push(`  return GRAMMAR_THEORY_BY_TOPIC[topic] ?? []`)
  lines.push(`}`)
  lines.push('')
  lines.push(`export function theoryByTypeId(typeId: string): GrammarTheoryDoc | null {`)
  lines.push(`  const match = /^(fr-[a-z]+)-gram-theorie-(\\d+)$/.exec(typeId)`)
  lines.push(`  if (!match) return null`)
  lines.push(`  const topic = match[1]!`)
  lines.push(`  const index = Number(match[2])`)
  lines.push(`  return theoriesForTopic(topic).find((doc) => doc.index === index) ?? null`)
  lines.push(`}`)
  lines.push('')

  writeFileSync(OUT, lines.join('\n'))
  const total = Object.values(THEME_SLUGS).reduce((n, s) => n + s.length, 0)
  console.log(JSON.stringify({ topics: Object.keys(THEME_SLUGS).length, theories: total, out: OUT }, null, 2))
}

main()
