#!/usr/bin/env node
/**
 * Génère src/francais/comprehension-ecrite-banks.ts
 * 20 textes uniques × 13 thèmes × 3 niveaux (A1 / A2 / B1) = 780.
 * Relancer : node scripts/build-comprehension-ecrite-banks.mjs
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'src/francais/comprehension-ecrite-banks.ts')

const THEMES = [
  'fr-presenter',
  'fr-famille',
  'fr-description',
  'fr-logement',
  'fr-achats',
  'fr-vetements',
  'fr-nourriture',
  'fr-sante',
  'fr-transports',
  'fr-inviter',
  'fr-travail',
  'fr-journee',
  'fr-loisirs',
]

const NAMES = [
  'Amira', 'Léo', 'Mina', 'Yanis', 'Nora', 'Pavel', 'Inès', 'Karim', 'Léa', 'Omar',
  'Sofia', 'Noah', 'Clara', 'Hugo', 'Yasmine', 'Adam', 'Emma', 'Rayan', 'Chloé', 'Lucas',
  'Sara', 'Mehdi', 'Julie', 'Tom', 'Aya', 'Enzo', 'Lina', 'Diego', 'Mila', 'Samir',
]

const CITIES = [
  'Sion', 'Sierre', 'Martigny', 'Lausanne', 'Genève', 'Fribourg', 'Vevey', 'Montreux',
  'Berne', 'Neuchâtel', 'Yverdon', 'Nyon', 'Morges', 'Bulle', 'Aigle',
]

const THEME_LEX = {
  'fr-presenter': {
    nouns: ['prénom', 'âge', 'nationalité', 'ville', 'cours', 'carte', 'adresse', 'téléphone'],
    places: ['école', 'bureau', 'centre', 'accueil'],
    acts: ['se présente', 'habite', 'étudie', 'travaille', 'vient de'],
  },
  'fr-famille': {
    nouns: ['père', 'mère', 'frère', 'sœur', 'cousin', 'tante', 'oncle', 'grand-mère'],
    places: ['maison', 'appartement', 'jardin'],
    acts: ['habite avec', 'visite', 'appelle', 'présente'],
  },
  'fr-description': {
    nouns: ['cheveux', 'yeux', 'taille', 'barbe', 'lunettes', 'sourire'],
    places: ['photo', 'miroir', 'parc'],
    acts: ['est grand', 'est mince', 'a les cheveux', 'porte'],
  },
  'fr-logement': {
    nouns: ['chambre', 'cuisine', 'salon', 'balcon', 'loyer', 'immeuble', 'studio'],
    places: ['centre-ville', 'quartier', 'gare'],
    acts: ['loue', 'visite', 'déménage', 'habite'],
  },
  'fr-achats': {
    nouns: ['prix', 'magasin', 'caisse', 'sac', 'réduction', 'ticket', 'marché'],
    places: ['supermarché', 'boutique', 'place du Marché'],
    acts: ['achète', 'paie', 'cherche', 'compare'],
  },
  'fr-vetements': {
    nouns: ['manteau', 'pantalon', 'robe', 'chaussures', 'taille', 'pull', 'écharpe'],
    places: ['boutique', 'cabine', 'rayon'],
    acts: ['essaie', 'porte', 'cherche', 'achète'],
  },
  'fr-nourriture': {
    nouns: ['pain', 'fromage', 'fruit', 'soupe', 'menu', 'restaurant', 'café'],
    places: ['boulangerie', 'table', 'cuisine'],
    acts: ['mange', 'boit', 'commande', 'prépare'],
  },
  'fr-sante': {
    nouns: ['médecin', 'pharmacie', 'fièvre', 'ordonnance', 'hôpital', 'douleur'],
    places: ['clinique', 'salle d’attente', 'cabinet'],
    acts: ['consulte', 'prend', 'se repose', 'appelle'],
  },
  'fr-transports': {
    nouns: ['bus', 'train', 'billet', 'arrêt', 'gare', 'horaire', 'tram'],
    places: ['quai', 'station', 'aéroport'],
    acts: ['prend', 'attend', 'change', 'arrive'],
  },
  'fr-inviter': {
    nouns: ['fête', 'invitation', 'soirée', 'anniversaire', 'picnic', 'réponse'],
    places: ['jardin', 'salle', 'parc'],
    acts: ['invite', 'propose', 'accepte', 'prépare'],
  },
  'fr-travail': {
    nouns: ['bureau', 'réunion', 'contrat', 'collègue', 'stage', 'horaire'],
    places: ['entreprise', 'open space', 'usine'],
    acts: ['travaille', 'commence', 'envoie', 'termine'],
  },
  'fr-journee': {
    nouns: ['matin', 'soir', 'réveil', 'cours', 'pause', 'agenda'],
    places: ['maison', 'école', 'travail'],
    acts: ['se lève', 'part', 'rentre', 'dîne'],
  },
  'fr-loisirs': {
    nouns: ['cinéma', 'sport', 'musique', 'livre', 'piscine', 'concert', 'jeu'],
    places: ['stade', 'bibliothèque', 'salle'],
    acts: ['joue', 'regarde', 'écoute', 'pratique'],
  },
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function pick(arr, i) {
  return arr[i % arr.length]
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function padToWords(text, min, extras) {
  let t = text.trim()
  let i = 0
  const pool = extras.length ? extras : ['C’est important.', 'Merci beaucoup.', 'À bientôt.']
  while (wordCount(t) < min) {
    const extra = pool[i % pool.length]
    t += (t.endsWith('.') || t.endsWith('!') || t.endsWith('?') ? ' ' : '. ') + extra
    i++
    if (i > 40) break
  }
  return t
}

function trimToWords(text, max) {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= max) return text.trim()
  let out = parts.slice(0, max).join(' ').replace(/[,:;]+$/, '')
  if (!/[.!?]$/.test(out)) out += '.'
  return out
}

function fitWords(text, min, max, extras) {
  let t = padToWords(text, min, extras)
  t = trimToWords(t, max)
  if (wordCount(t) < min) t = padToWords(t, min, extras)
  return trimToWords(t, max)
}

function q(prompt, options, answer) {
  // Place la bonne réponse à une position variable (déterministe via longueur)
  const distractors = options.filter((o) => o !== answer)
  const slot = (prompt.length + answer.length) % 3
  const ordered = [...distractors]
  ordered.splice(slot, 0, answer)
  return { prompt, options: ordered.slice(0, 3), answer }
}

function makeQuestions(level, theme, facts) {
  const { who, where, when, what, howMuch } = facts
  const base = [
    q(`Qui est concerné ?`, [who, pick(NAMES, 3), pick(NAMES, 7)], who),
    q(`Où cela se passe-t-il ?`, [where, pick(CITIES, 2), pick(CITIES, 5)], where),
    q(`Quand cela a-t-il lieu ?`, [when, 'Demain soir', 'Le mois prochain'], when),
    q(`De quoi parle le texte ?`, [what, 'Un voyage en avion', 'Une recette secrète'], what),
  ]
  if (howMuch) {
    base.push(q(`Quelle information chiffrée est donnée ?`, [howMuch, 'Cinq euros', 'Cent francs'], howMuch))
  }
  if (level === 'b1') {
    base.push(
      q(`Pourquoi cette information est-elle utile ?`, [
        'Pour organiser la suite',
        'Pour changer de pays',
        'Pour annuler un match',
      ], 'Pour organiser la suite'),
    )
  }
  return base.slice(0, level === 'a1' ? 3 : 4)
}

function buildA1(theme, i) {
  const lex = THEME_LEX[theme]
  const who = pick(NAMES, i + theme.length)
  const city = pick(CITIES, i * 3 + 1)
  const noun = pick(lex.nouns, i)
  const place = pick(lex.places, i + 2)
  const when = pick(['aujourd’hui', 'demain', 'lundi', 'samedi matin', 'à dix heures'], i)
  const format = pick(['sms', 'annonce', 'narratif', 'avis', 'notice'], i)

  const variants = [
    `Salut ! C’est ${who}. J’habite à ${city}. ${when.charAt(0).toUpperCase() + when.slice(1)} je vais au ${place}. Je parle de mon ${noun}. Le ${place} est près de chez moi. À bientôt.`,
    `Annonce à ${city}. ${who} cherche un ${noun}. Le rendez-vous est ${when}. Le lieu est le ${place}. Merci de répondre vite. Le ${noun} est utile pour la famille.`,
    `${who} est à ${city}. ${who} regarde un ${noun}. ${who} va au ${place} ${when}. ${who} est content. ${who} lit un message simple.`,
    `Message : ${who} à ${city}. Information sur le ${noun}. Rendez-vous au ${place} ${when}. Merci. Le ${place} ouvre tôt.`,
    `Bonjour. Je m’appelle ${who}. J’habite à ${city}. Mon ${noun} est important. Je vais au ${place} ${when}. Je parle français.`,
  ]
  let text = fitWords(pick(variants, i), 30, 60, [
    `${who} lit le message.`,
    `Le ${place} est ouvert.`,
    `On parle français.`,
    `${who} regarde le ${noun}.`,
    `Le rendez-vous est clair.`,
  ])
  const facts = {
    who,
    where: `À ${city}`,
    when: when.charAt(0).toUpperCase() + when.slice(1),
    what: `Un ${noun} et le ${place}`,
    howMuch: null,
  }
  return {
    format,
    title: `${pick(['SMS', 'Note', 'Annonce', 'Message', 'Avis'], i)} — ${who}`,
    text,
    questions: makeQuestions('a1', theme, facts),
  }
}

function buildA2(theme, i) {
  const lex = THEME_LEX[theme]
  const who = pick(NAMES, i + 5)
  const friend = pick(NAMES, i + 11)
  const city = pick(CITIES, i * 2 + 4)
  const noun = pick(lex.nouns, i + 1)
  const place = pick(lex.places, i)
  const when = pick(['ce week-end', 'mardi prochain', 'vendredi à 18 h', 'demain après-midi'], i)
  const price = pick(['15 francs', '30 francs', 'deux heures', 'trois jours'], i)
  const format = pick(['email', 'annonce', 'invitation', 'article', 'avis'], i)

  const bodies = [
    `Bonjour ${friend},\nJe suis ${who}. J’habite à ${city}. ${when.charAt(0).toUpperCase() + when.slice(1)}, je vais au ${place}. Je veux parler du ${noun}. Tu peux venir avec moi ? Le ${place} est calme et facile à trouver. Réponds-moi vite.\n${who}`,
    `Annonce — ${city}. ${who} organise une activité autour du ${noun}. Rendez-vous au ${place} ${when}. Prix : ${price}. Inscription par message. Apportez une pièce d’identité.`,
    `${who} a écrit un petit texte. Hier, ${who} a visité le ${place} à ${city}. ${who} a vu un ${noun} intéressant. ${when.charAt(0).toUpperCase() + when.slice(1)}, ${who} va y retourner avec ${friend}. Ils veulent comparer les prix.`,
    `Invitation : ${who} invite ${friend} à ${city}. On se retrouve au ${place} ${when}. On parlera du ${noun}. Apportez une boisson. Merci ! Le temps prévu est d’environ ${price}.`,
  ]
  let text = fitWords(pick(bodies, i), 60, 120, [
    `Le ${place} est facile à trouver.`,
    `${friend} connaît déjà ${city}.`,
    `On peut rester environ ${price}.`,
    `N’oubliez pas votre ${noun}.`,
    `${who} attend une réponse rapide.`,
  ])
  return {
    format,
    title: `${pick(['E-mail', 'Annonce', 'Invitation', 'Brève', 'Avis'], i)} — ${city}`,
    text,
    questions: makeQuestions('a2', theme, {
      who,
      where: `À ${city}`,
      when: when.charAt(0).toUpperCase() + when.slice(1),
      what: `Le ${noun} au ${place}`,
      howMuch: price,
    }),
  }
}

function buildB1(theme, i) {
  const lex = THEME_LEX[theme]
  const who = pick(NAMES, i + 9)
  const other = pick(NAMES, i + 17)
  const city = pick(CITIES, i + 6)
  const noun = pick(lex.nouns, i + 3)
  const place = pick(lex.places, i + 1)
  const when = pick(['la semaine prochaine', 'dès lundi', 'pendant les vacances', 'jeudi soir'], i)
  const format = pick(['lettre', 'article', 'email', 'avis', 'narratif'], i)

  let text = `Chère / Cher collègue,\n\nJe m’appelle ${who} et j’habite à ${city}. Je vous écris au sujet du ${noun}. Hier, j’ai rencontré ${other} au ${place}. Nous avons parlé longtemps : si le projet avance, nous pourrons organiser une rencontre ${when}.\n\nÀ mon avis, il faudrait préparer les documents avant la réunion. ${other} pensait que c’était trop tôt, mais j’aimerais que nous soyons prêts. Le ${place} de ${city} reste disponible et le ${noun} concerne plusieurs collègues.\n\nMerci de me dire ce que vous en pensez. Je reste joignable par message.\n\nCordialement,\n${who}`

  const extras = [
    `Si vous êtes d’accord, j’enverrai un rappel la veille.`,
    `Nous pourrons aussi inviter une personne du centre de formation.`,
    `En cas de changement, prévenez-moi rapidement.`,
    `Je peux préparer un résumé court pour l’équipe.`,
    `Le calendrier reste flexible pour le moment.`,
  ]
  text = fitWords(text, 120, 250, extras)

  return {
    format,
    title: `${pick(['Lettre', 'Article', 'Courriel', 'Compte rendu', 'Avis'], i)} — ${noun}`,
    text,
    questions: makeQuestions('b1', theme, {
      who,
      where: `À ${city}`,
      when: when.charAt(0).toUpperCase() + when.slice(1),
      what: `Un projet lié au ${noun}`,
      howMuch: null,
    }),
  }
}

function main() {
  const docs = []
  const levels = [
    ['a1', buildA1],
    ['a2', buildA2],
    ['b1', buildB1],
  ]

  for (const theme of THEMES) {
    for (const [level, builder] of levels) {
      for (let i = 0; i < 20; i++) {
        const built = builder(theme, i + theme.length * 3)
        const id = `${level}-${theme.replace('fr-', '')}-${String(i + 1).padStart(2, '0')}`
        docs.push({
          id,
          level,
          themes: [theme],
          format: built.format,
          title: built.title,
          text: built.text,
          questions: built.questions,
        })
      }
    }
  }

  // Validate counts
  const byKey = {}
  for (const d of docs) {
    const k = `${d.level}|${d.themes[0]}`
    byKey[k] = (byKey[k] ?? 0) + 1
  }
  const bad = Object.entries(byKey).filter(([, n]) => n !== 20)
  if (bad.length) {
    console.error('Bad coverage', bad)
    process.exit(1)
  }

  const ranges = { a1: [30, 60], a2: [60, 120], b1: [120, 250] }
  const wordIssues = []
  for (const d of docs) {
    const [min, max] = ranges[d.level]
    const n = wordCount(d.text)
    if (n < min || n > max) wordIssues.push(`${d.id}: ${n} mots`)
  }
  if (wordIssues.length) {
    console.error('Word-count issues', wordIssues.slice(0, 20), `… (${wordIssues.length})`)
    process.exit(1)
  }

  const lines = []
  lines.push(`/** Généré par scripts/build-comprehension-ecrite-banks.mjs — 20×thème×niveau. */`)
  lines.push(`import type { ComprehensionEcritedoc, ComprehensionLevel } from './comprehension-ecrite'`)
  lines.push('')
  lines.push(`export const COMPREHENSION_ECRITE_DOCS: ComprehensionEcritedoc[] = [`)
  for (const d of docs) {
    lines.push(`  {`)
    lines.push(`    id: '${esc(d.id)}',`)
    lines.push(`    level: '${d.level}',`)
    lines.push(`    themes: ['${d.themes[0]}'],`)
    lines.push(`    format: '${d.format}',`)
    lines.push(`    title: '${esc(d.title)}',`)
    lines.push(`    text: '${esc(d.text).replace(/\n/g, '\\n')}',`)
    lines.push(`    questions: [`)
    for (const qq of d.questions) {
      lines.push(`      {`)
      lines.push(`        prompt: '${esc(qq.prompt)}',`)
      lines.push(`        options: [${qq.options.map((o) => `'${esc(o)}'`).join(', ')}],`)
      lines.push(`        answer: '${esc(qq.answer)}',`)
      lines.push(`      },`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push('')
  lines.push(`export function writtenDocsFor(topic: string, level: ComprehensionLevel): ComprehensionEcritedoc[] {`)
  lines.push(`  const exact = COMPREHENSION_ECRITE_DOCS.filter(`)
  lines.push(`    (doc) => doc.level === level && doc.themes.includes(topic),`)
  lines.push(`  )`)
  lines.push(`  if (exact.length > 0) return exact`)
  lines.push(`  const sameTheme = COMPREHENSION_ECRITE_DOCS.filter((doc) => doc.themes.includes(topic))`)
  lines.push(`  if (sameTheme.length > 0) return sameTheme`)
  lines.push(`  return COMPREHENSION_ECRITE_DOCS.filter((doc) => doc.level === level)`)
  lines.push(`}`)
  lines.push('')

  writeFileSync(OUT, lines.join('\n'))
  console.log(JSON.stringify({ docs: docs.length, themes: THEMES.length, perCell: 20, out: OUT }, null, 2))
}

main()
