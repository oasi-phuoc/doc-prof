import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeSourceText,
  parseGlossaryTables,
  parseMarkdownDirectives,
  parseSourceExercisePage,
} from '../../scripts/logistique/epcas-markdown-import.mjs'

test('parses EPCAS answer, figure, and student-note directives without losing raw source', () => {
  const markdown = [
    'Question ?',
    ':::réponse',
    'Réponse originale.',
    ':::',
    ':::figure etapes',
    '1. Étape une',
    ':::',
    ':::eleve-note note-1',
    'Écrire ici.',
    ':::',
  ].join('\n')
  const parsed = parseMarkdownDirectives(markdown)
  assert.deepEqual(parsed.blocks.map(block => block.kind), ['answer', 'figure', 'student-note'])
  assert.equal(parsed.blocks[0].directive, 'réponse')
  assert.equal(parsed.blocks[0].body, 'Réponse originale.')
  assert.equal(parsed.blocks[0].rawMarkdown, ':::réponse\nRéponse originale.\n:::')
  assert.deepEqual(parsed.issues, [])
})

test('groups situation subquestions under their parent case and keeps each answer block', () => {
  const markdown = [
    'Contexte partagé.',
    '## Mission 1 — Réception',
    '### 1.1 Contrôler la livraison',
    'Que faut-il vérifier ?',
    ':::reponse',
    'Quantité et état.',
    ':::',
    '### 1.2 Traiter un dommage',
    'Quelle action entreprendre ?',
    ':::solution',
    'Documenter le dommage.',
    ':::',
    '## Mission 2 — Stockage',
    'Décrire la procédure.',
  ].join('\n')
  const parsed = parseSourceExercisePage('situation', markdown)
  assert.equal(parsed.items.length, 2)
  assert.equal(parsed.items[0].title, 'Mission 1 — Réception')
  assert.equal(parsed.items[0].answerBlocks.length, 2)
  assert.match(parsed.items[0].promptMarkdown, /Contrôler la livraison/)
  assert.doesNotMatch(parsed.items[0].promptMarkdown, /Quantité et état/)
  assert.equal(parsed.items[1].answerBlocks.length, 0)
  assert.match(parsed.items[1].promptMarkdown, /Décrire la procédure/)
  assert.equal(parsed.unassignedBlocks.length, 0)
})

test('pairs maths and verification blocks to their own numbered headings', () => {
  const maths = parseSourceExercisePage('maths', [
    '## Exercices de maths',
    '### Exercice 1 — Pourcentage',
    'Calculer 5 % de 100.',
    ':::solution',
    '5',
    ':::',
    '### Exercice 2 — Volume',
    'Calculer le volume.',
    ':::solution',
    '12 L',
    ':::',
  ].join('\n'))
  assert.equal(maths.items.length, 2)
  assert.equal(maths.items[0].answerBlocks[0].markdown, '5')
  assert.equal(maths.items[1].answerBlocks[0].markdown, '12 L')

  const verification = parseSourceExercisePage('verification', [
    '## Vérification',
    '### Question 1',
    'Vrai ou faux ?',
    ':::reponse',
    'Vrai, car…',
    ':::',
  ].join('\n'))
  assert.equal(verification.items.length, 1)
  assert.equal(verification.items[0].answerBlocks[0].directive, 'reponse')
})

test('reports orphan and unclosed delimiters rather than silently dropping them', () => {
  const orphan = parseMarkdownDirectives(':::\ntexte')
  assert.equal(orphan.issues[0].code, 'orphan-close')
  const unclosed = parseMarkdownDirectives(':::solution\nréponse sans fermeture')
  assert.equal(unclosed.issues[0].code, 'unclosed-block')
  assert.equal(unclosed.blocks[0].body, 'réponse sans fermeture')
})

test('extracts glossary table rows with source positions and links', () => {
  const parsed = parseGlossaryTables([
    '## Glossaire',
    '| Terme technique | Lien | Définition |',
    '| --- | --- | --- |',
    '| FIFO | | Premier entré, premier sorti. |',
    '| Route | voir aussi | Une voie commerciale. |',
  ].join('\n'))
  assert.equal(parsed.entries.length, 2)
  assert.equal(parsed.entries[0].term, 'FIFO')
  assert.equal(parsed.entries[0].definition, 'Premier entré, premier sorti.')
  assert.equal(parsed.entries[1].sourceLink, 'voir aussi')
  assert.deepEqual(parsed.issues, [])
  assert.equal(normalizeSourceText('Réception des marchandises!'), 'reception des marchandises')
})

test('parses lettered, decimal, and exercise case headings without orphaning their answers', () => {
  const parsed = parseSourceExercisePage('situation', [
    '## Mission A1 — Exigences',
    'Décris les exigences à prendre en compte.',
    ':::reponse',
    'Flux, marchandises et capacité.',
    ':::',
    '## Mission 1.1 — Statistiques',
    'Interprète le tableau.',
    ':::solution',
    'La hausse est de 3 %.',
    ':::',
    '## Mission B3–B4 — Recommandation',
    'Compare les deux possibilités.',
    ':::reponse',
    'La solution dépend du flux.',
    ':::',
    '### Exercice C1 — Classification',
    'Classe les cas suivants.',
    ':::reponse',
    'Réponse argumentée.',
    ':::',
  ].join('\n'))

  assert.equal(parsed.items.length, 4)
  assert.deepEqual(parsed.items.map(item => item.answerBlocks.length), [1, 1, 1, 1])
  assert.deepEqual(parsed.items.map(item => item.parentMission), [
    'Mission A1',
    'Mission 1.1',
    'Mission B3',
    'Exercice C1',
  ])
  assert.equal(parsed.unassignedBlocks.length, 0)
})

