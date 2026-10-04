#!/usr/bin/env node
/**
 * Répartit les audios de mots (vocab V* + lecture/mots) dans
 * public/lib/audio/vocabulaire/{thème}/ — mêmes sous-dossiers thème que
 * public/lib/images/vocabulaire/ (presenter, famille, ecole…).
 *
 * Classement (aligné sur copy-lib-medias ClairFLE) :
 * 1. score lexical ≥ 2
 * 2. sinon défaut du dossier V* d’origine
 * 3. sinon thème image si le stem y figure déjà (hors objets fourre-tout)
 * 4. sinon objets
 *
 * Usage : node scripts/remap-word-audio-themes.mjs
 * Dry-run : DRY_RUN=1 node scripts/remap-word-audio-themes.mjs
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'

const ROOT = process.cwd()
const DRY = process.env.DRY_RUN === '1'
const DEST = join(ROOT, 'public/lib/audio/vocabulaire')
const IMG_ROOT = join(ROOT, 'public/lib/images/vocabulaire')
const SRC_VOCAB = join(ROOT, 'public/assets/words/son_f/vocab')
const SRC_MOTS = join(ROOT, 'public/assets/words/son_f/mots')

const THEMES = [
  'presenter',
  'famille',
  'logement',
  'achats',
  'vetements',
  'nourriture',
  'sante',
  'transports',
  'inviter',
  'travail',
  'journee',
  'loisirs',
  'ecole',
  'animaux',
  'administration',
  'actualite',
  'nature',
  'couleurs',
  'objets',
]

const V_DEFAULT = {
  V1: 'presenter',
  V2: 'journee',
  V3: 'loisirs',
  V4: 'logement',
  V5: 'ecole',
  V6: 'vetements',
  V7: 'nourriture',
  V8: 'sante',
  V9: 'transports',
  // V10 mélange restaurant / gare / hôtel / animaux → pas de défaut unique
}

const KEYS = {
  presenter: [
    'presenter', 'présentation', 'nationalite', 'nationalité', 'identite', 'identité',
    'prenom', 'prénom', 'bonjour', 'salut', 'age', 'âge', 'beau', 'blond', 'brun', 'roux', 'mince',
    'fort', 'jeune', 'vieux', 'gentil', 'calme', 'timide', 'suisse', 'france', 'italie', 'espagne',
    'allemagne', 'portugal', 'pays', 'afghanistan', 'angleterre', 'autriche', 'belgique', 'canada',
    'chine', 'grece', 'grèce', 'iran', 'pologne', 'russie', 'somalie', 'syrie', 'turquie', 'ukraine',
    'vietnam', 'erythree', 'etats-unis',
  ],
  famille: [
    'famille', 'pere', 'père', 'mere', 'mère', 'frere', 'frère', 'soeur', 'sœur', 'oncle', 'tante',
    'cousin', 'cousine', 'neveu', 'niece', 'nièce', 'grand-pere', 'grand-mere', 'fils', 'fille',
    'bebe', 'bébé', 'marie', 'marié', 'celibataire', 'divorce', 'veuf', 'fiance', 'pacse', 'couple',
    'concubinage', 'separe', 'enfant', 'parents',
  ],
  logement: [
    'logement', 'appartement', 'maison', 'studio', 'chambre', 'cuisine', 'salon', 'balcon', 'cave',
    'grenier', 'garage', 'immeuble', 'loyer', 'demenag', 'déménag', 'hotel', 'hôtel', 'chalet',
    'cabane', 'terrasse', 'couloir', 'toilettes', 'salle-de-bain', 'buanderie', 'canape', 'armoire',
    'panne', 'ampoule', 'robinet', 'tuyau', 'thermostat', 'cle', 'clé', 'reception', 'réception',
    'receptionniste', 'réceptionniste', 'ascenseur', 'etage', 'étage', 'lit', 'draps', 'coussin',
  ],
  achats: [
    'achat', 'acheter', 'magasin', 'boutique', 'caisse', 'prix', 'client', 'commerce', 'solde',
    'promo', 'ticket', 'carte-de-credit', 'supermarche', 'supermarché', 'marche', 'marché',
    'vendeur', 'vendeuse', 'caissiere', 'épicier', 'epiciere', 'addition',
  ],
  vetements: [
    'vetement', 'vêtement', 'habit', 'pull', 'manteau', 'veste', 'jupe', 'pantalon', 'chemise',
    'robe', 'chaussure', 'botte', 'chaussette', 'bonnet', 'echarpe', 'écharpe', 'gant', 'ceinture',
    'casquette', 'chapeau', 't-shirt', 'short', 'pyjama', 'cravate', 'bijou', 'sac-a-main',
    'accessoire',
  ],
  nourriture: [
    'nourriture', 'aliment', 'restaurant', 'manger', 'repas', 'boulangerie', 'menu',
    'pain', 'fruit', 'legume', 'légume', 'pomme', 'poire', 'banane', 'tomate', 'carotte', 'salade',
    'fromage', 'viande', 'poisson', 'riz', 'pate', 'dessert', 'gateau', 'gâteau', 'cafe', 'café',
    'the', 'thé', 'eau', 'lait', 'soupe', 'recette', 'ingredient', 'ustensile',
    'assiette', 'baguette', 'croissant', 'viennoiserie', 'serviette', 'fourchette', 'couteau',
    'cuillere', 'cuillère', 'entree', 'entrée', 'plat', 'boisson', 'serveur', 'serveure',
    'addition', 'pourboire', 'reservation', 'réservation',
  ],
  sante: [
    'sante', 'santé', 'medecin', 'médecin', 'pharmacie', 'malade', 'hopital', 'hôpital', 'fievre',
    'fièvre', 'toux', 'rhume', 'douleur', 'corps', 'tete', 'tête', 'ventre', 'dent', 'ordonnance',
    'sirop', 'panser', 'infirmier', 'dentiste',
  ],
  transports: [
    'transport', 'train', 'bus', 'tram', 'metro', 'métro', 'gare', 'aeroport', 'aéroport', 'avion',
    'billet', 'quai', 'voiture', 'velo', 'vélo', 'taxi', 'camion', 'bateau', 'itineraire', 'chemin',
    'direction', 'gauche', 'droite', 'nord', 'sud', 'est', 'ouest', 'rue', 'avenue', 'carrefour',
  ],
  inviter: [
    'invit', 'fete', 'fête', 'sortie', 'anniversaire', 'proposer', 'accepter', 'evenement',
    'événement', 'pique-nique', 'soiree', 'soirée',
  ],
  travail: [
    'travail', 'bureau', 'emploi', 'metier', 'métier', 'collegue', 'collègue', 'reunion', 'réunion',
    'contrat', 'salaire', 'stage', 'boulanger', 'cuisinier', 'electricien', 'ingenieur', 'plombier',
    'professeur', 'secretaire', 'serveur', 'vendeur', 'etudiant', 'étudiant',
  ],
  journee: [
    'journee', 'journée', 'quotidien', 'matin', 'soir', 'heure', 'reveil', 'réveil', 'routine',
    'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'janvier', 'meteo',
    'météo', 'saison', 'horloge', 'se-lever', 'se-coucher',
  ],
  loisirs: [
    'loisir', 'sport', 'cinema', 'cinéma', 'musee', 'musée', 'culture', 'vacance', 'foot', 'natation',
    'guitare', 'musique', 'concert', 'theatre', 'théâtre', 'danse', 'piscine', 'ski',
    'bibliotheque', 'bibliothèque',
  ],
  ecole: [
    'ecole', 'école', 'classe', 'cours', 'eleve', 'élève', 'cahier', 'stylo', 'trousse', 'cartable',
    'matiere', 'matière', 'tableau', 'craie', 'dictionnaire', 'professeure',
  ],
  animaux: [
    'animal', 'animaux', 'chien', 'chat', 'oiseau', 'cheval', 'vache', 'mouton', 'poule', 'poisson',
    'lion', 'tigre', 'ours', 'singe', 'lapin', 'souris', 'serpent', 'abeille', 'papillon',
  ],
  administration: [
    'demarche', 'démarche', 'administratif', 'formulaire', 'inscription', 'papier', 'carte-identite',
    'passeport', 'convocation', 'office', 'guichet',
  ],
  actualite: [
    'actualite', 'actualité', 'journal', 'information', 'nouvelle', 'radio', 'television', 'télévision',
  ],
  nature: [
    'nature', 'arbre', 'fleur', 'foret', 'forêt', 'montagne', 'riviere', 'rivière', 'mer', 'lac',
    'soleil', 'plage', 'jardin', 'plante',
  ],
  couleurs: [
    'couleur', 'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'rose', 'orange', 'violet', 'gris',
    'marron', 'beige',
  ],
  objets: [
    'objet', 'boite', 'boîte', 'sac', 'porte', 'fenetre', 'fenêtre', 'table', 'chaise',
    'telephone', 'téléphone', 'ordinateur',
  ],
}

function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function scoreText(text) {
  const n = norm(text)
  let best = 'objets'
  let bestScore = 0
  for (const theme of THEMES) {
    let score = 0
    for (const key of KEYS[theme] ?? []) {
      const k = norm(key)
      if (!k) continue
      if (n === k) {
        score += 6
        continue
      }
      // Mot contient la clé (pas l’inverse : arche⊄̸marche, ma⊄̸magasin)
      if (k.length >= 4 && n.includes(k)) {
        score += 2
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = theme
    }
  }
  return { theme: best, score: bestScore }
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

function ensure(dir) {
  if (!DRY) mkdirSync(dir, { recursive: true })
}

/** stem normalisé → thème (images déjà classées). */
function loadImageThemeIndex() {
  const map = new Map()
  if (!existsSync(IMG_ROOT)) return map
  for (const theme of readdirSync(IMG_ROOT)) {
    const dir = join(IMG_ROOT, theme)
    if (!statSync(dir).isDirectory()) continue
    for (const name of readdirSync(dir)) {
      if (!/\.(webp|png|jpe?g|svg)$/i.test(name)) continue
      const stem = norm(basename(name, extname(name)))
      if (stem && !map.has(stem)) map.set(stem, theme)
    }
  }
  return map
}

function resolveTheme(stem, vFolder, imageIndex) {
  const n = norm(stem)
  const guessed = scoreText(stem)
  if (guessed.score >= 2) return { theme: guessed.theme, via: 'score' }
  const fromImg = imageIndex.get(n)
  if (fromImg && fromImg !== 'objets') return { theme: fromImg, via: 'image' }
  if (vFolder && V_DEFAULT[vFolder]) return { theme: V_DEFAULT[vFolder], via: 'v-default' }
  return { theme: 'objets', via: 'fallback' }
}

function copyOne(src, dest) {
  ensure(dirname(dest))
  if (!DRY) copyFileSync(src, dest)
}

if (!DRY && existsSync(DEST)) {
  rmSync(DEST, { recursive: true, force: true })
}

const imageIndex = loadImageThemeIndex()
const counts = Object.fromEntries(THEMES.map((t) => [t, 0]))
const viaCounts = { image: 0, score: 0, 'v-default': 0, fallback: 0 }
/** Prefer vocab clip over lecture when same stem. */
const planned = new Map() // theme/normStem -> entry

function plan(src, vFolder) {
  const file = basename(src)
  if (!/\.mp3$/i.test(file)) return
  const stem = basename(file, extname(file))
  const key = norm(stem)
  if (!key) return
  const prev = planned.get(key)
  // vocab (avec vFolder) prioritaire sur mots lecture
  if (prev && prev.vFolder && !vFolder) return
  const { theme, via } = resolveTheme(stem, vFolder, imageIndex)
  planned.set(key, { src, theme, stem: file, via, vFolder })
}

for (const file of walk(SRC_VOCAB)) {
  const rel = file.split('/vocab/')[1] ?? ''
  const vFolder = rel.split('/')[0]
  plan(file, /^V\d+$/.test(vFolder) ? vFolder : undefined)
}
for (const file of walk(SRC_MOTS)) {
  plan(file, undefined)
}

for (const { src, theme, stem, via } of planned.values()) {
  const dest = join(DEST, theme, stem)
  copyOne(src, dest)
  counts[theme] = (counts[theme] ?? 0) + 1
  viaCounts[via] = (viaCounts[via] ?? 0) + 1
}

const report = {
  dryRun: DRY,
  dest: DEST,
  total: planned.size,
  byTheme: counts,
  bySource: viaCounts,
}
const reportPath = join(ROOT, 'scripts/word-audio-theme-report.json')
if (!DRY) {
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  const readme = join(DEST, 'README.md')
  writeFileSync(
    readme,
    [
      '# Audios mots — par thème ClairFLE',
      '',
      'Même logique que `images/vocabulaire/` : un dossier par thème.',
      '',
      'Sources :',
      '- `public/assets/words/son_f/vocab/V*` (clips vocabulaire)',
      '- `public/assets/words/son_f/mots` (lecture / mots isolés)',
      '',
      'Régénérer : `node scripts/remap-word-audio-themes.mjs`',
      '',
      `Total : **${planned.size}** fichiers.`,
      '',
    ].join('\n'),
  )
}

console.log(JSON.stringify(report, null, 2))
console.log(DRY ? '(dry-run, rien écrit)' : `écrit → ${DEST}`)
