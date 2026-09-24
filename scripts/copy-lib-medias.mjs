#!/usr/bin/env node
/**
 * Copie les médias pédagogiques de soutien-scolaire vers public/lib/
 * selon les thèmes ClairFLE. Pas d’audio lecture / nombres / vocabulaire,
 * pas d’images maths.
 */
import { mkdirSync, readdirSync, readFileSync, copyFileSync, existsSync, statSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'

const SRC = process.env.SOUTIEN_ROOT ?? '/tmp/soutien-scolaire'
const DEST = process.env.LIB_ROOT ?? join(process.cwd(), 'public/lib')

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

const KEYS = {
  presenter: [
    'presenter', 'présenter', 'presentation', 'nationalite', 'nationalité', 'identite', 'identité',
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
  ],
  achats: [
    'achat', 'acheter', 'magasin', 'boutique', 'caisse', 'prix', 'client', 'commerce', 'solde',
    'promo', 'ticket', 'carte-de-credit', 'supermarche', 'supermarché', 'marche', 'marché',
    'vendeur', 'vendeuse', 'caissiere', 'épicier', 'epiciere',
  ],
  vetements: [
    'vetement', 'vêtement', 'habit', 'pull', 'manteau', 'veste', 'jupe', 'pantalon', 'chemise',
    'robe', 'chaussure', 'botte', 'chaussette', 'bonnet', 'echarpe', 'écharpe', 'gant', 'ceinture',
    'casquette', 'chapeau', 't-shirt', 'short', 'pyjama', 'cravate', 'bijou', 'sac-a-main',
    'accessoire', 'couleur-vetement',
  ],
  nourriture: [
    'nourriture', 'aliment', 'restaurant', 'manger', 'repas', 'cuisine', 'boulangerie', 'menu',
    'pain', 'fruit', 'legume', 'légume', 'pomme', 'poire', 'banane', 'tomate', 'carotte', 'salade',
    'fromage', 'viande', 'poisson', 'riz', 'pate', 'dessert', 'gateau', 'gâteau', 'cafe', 'café',
    'the', 'thé', 'eau', 'lait', 'soupe', 'recette', 'ingredient', 'ustensile',
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
    'passage-pieton', 'feu-rouge',
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
    'guitare', 'musique', 'concert', 'theatre', 'théâtre', 'danse', 'piscine', 'ski', 'lecture-livre',
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
    'carte-didentite', 'passeport', 'convocation', 'office', 'guichet',
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
    'objet', 'boite', 'boîte', 'sac', ' cle', 'porte', 'fenetre', 'fenêtre', 'table', 'chaise',
    'telephone', 'téléphone', 'ordinateur',
  ],
}

function norm(s) {
  return s
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
      if (n === k || n.includes(k) || k.includes(n)) score += n === k ? 6 : 2
    }
    if (score > bestScore) {
      bestScore = score
      best = theme
    }
  }
  return { theme: best, score: bestScore }
}

function ensure(dir) {
  mkdirSync(dir, { recursive: true })
}

function copyTo(src, dest) {
  ensure(dirname(dest))
  copyFileSync(src, dest)
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

function isImage(file) {
  return /\.(webp|png|jpe?g|svg|gif)$/i.test(file)
}
function isAudio(file) {
  return /\.(mp3|wav|ogg|m4a)$/i.test(file)
}

const counts = {}
function tally(key) {
  counts[key] = (counts[key] ?? 0) + 1
}

function parseCatalog(md) {
  const familyTheme = new Map()
  const blocks = md.split(/^## Famille /m).slice(1)
  for (const block of blocks) {
    const head = block.match(/^(\d+)\s+—\s+([^\n]+)/)
    if (!head) continue
    const id = head[1]
    const title = head[2]
    const slug = block.match(/`([^`]+)`/)?.[1] ?? ''
    const tags = [...block.matchAll(/#[\p{L}\d-]+/gu)].map((m) => m[0].slice(1)).join(' ')
    const { theme, score } = scoreText(`${title} ${slug} ${tags}`)
    familyTheme.set(id, score > 0 ? theme : 'objets')
  }
  return familyTheme
}

function copyVocab() {
  const root = join(SRC, 'public/assets/words/vocab')
  const vDefault = {
    V2: 'journee',
    V3: 'loisirs',
    V4: 'logement',
    V5: 'ecole',
    V6: 'vetements',
    V7: 'nourriture',
    V8: 'sante',
  }
  for (const file of walk(root).filter(isImage)) {
    const stem = basename(file, extname(file))
    const folder = file.split('/vocab/')[1]?.split('/')[0]
    const guessed = scoreText(stem)
    const theme =
      guessed.score >= 2 ? guessed.theme : (vDefault[folder] ?? (folder === 'V1' ? 'presenter' : folder === 'V10' ? 'animaux' : folder === 'V9' ? 'transports' : 'objets'))
    copyTo(file, join(DEST, 'images/vocabulaire', theme, basename(file)))
    tally(`vocab/${theme}`)
  }
}

function copyLecture() {
  const root = join(SRC, 'public/assets/words/lecture')
  for (const file of walk(root).filter(isImage)) {
    const stem = basename(file, extname(file))
    const guessed = scoreText(stem)
    const theme = guessed.score >= 2 ? guessed.theme : 'objets'
    copyTo(file, join(DEST, 'images/vocabulaire', theme, basename(file)))
    tally(`lecture/${theme}`)
  }
}

function copyScenes() {
  const dir = join(SRC, 'public/assets/expression/images/scene')
  const catalog = readFileSync(join(dir, 'CATALOG.md'), 'utf8')
  const familyTheme = parseCatalog(catalog)
  for (const file of walk(dir)) {
    if (!isImage(file)) continue
    const name = basename(file)
    const prefix = name.match(/^(\d+)\b/)?.[1]
    const theme = (prefix && familyTheme.get(prefix)) || scoreText(name).theme
    copyTo(file, join(DEST, 'images/communication', theme, name.replace(/\s+/g, '-')))
    tally(`scene/${theme}`)
  }
}

function copyComprehension() {
  const jobs = [
    { from: 'public/assets/expression/co/base', level: 'facile-a1' },
    { from: 'public/assets/expression/co/moyen', level: 'moyen-a2' },
    { from: 'public/assets/expression/co/avance', level: 'difficile-b1' },
    { from: 'public/assets/expression/communication/A1', level: 'facile-a1' },
    { from: 'public/assets/expression/communication/A2', level: 'moyen-a2' },
    { from: 'public/assets/expression/po/A1', level: 'facile-a1' },
    { from: 'public/assets/expression/po/A2-B1', level: 'difficile-b1' },
    { from: 'public/assets/expression/images/ce', level: 'facile-a1' },
    { from: 'public/assets/expression/images/comp', level: 'moyen-a2' },
  ]
  for (const job of jobs) {
    for (const file of walk(join(SRC, job.from))) {
      if (isAudio(file)) {
        copyTo(file, join(DEST, 'audio/comprehension', job.level, basename(file)))
        tally(`audio/${job.level}`)
      } else if (isImage(file)) {
        copyTo(file, join(DEST, 'images/comprehension', job.level, basename(file)))
        tally(`comprehension/${job.level}`)
      }
    }
  }
}

function copyExtras() {
  for (const file of walk(join(SRC, 'public/assets/expression/images/heure')).filter(isImage)) {
    copyTo(file, join(DEST, 'images/vocabulaire/journee', basename(file)))
    tally('heure/journee')
  }
  for (const file of walk(join(SRC, 'public/gram/images')).filter(isImage)) {
    copyTo(file, join(DEST, 'images/vocabulaire/presenter', basename(file)))
    tally('gram/presenter')
  }
  const logo = join(SRC, 'public/logo-etat-du-valais.webp')
  if (existsSync(logo)) {
    copyTo(logo, join(DEST, 'logos/etat-du-valais.webp'))
    tally('logo')
  }
  for (const file of walk(join(SRC, 'public/assets/icons/consignes')).filter(isImage)) {
    copyTo(file, join(DEST, 'images/icones/consignes', basename(file)))
    tally('icones')
  }
}

copyVocab()
copyLecture()
copyScenes()
copyComprehension()
copyExtras()

console.log(JSON.stringify(counts, null, 2))
const total = Object.values(counts).reduce((a, b) => a + b, 0)
console.log(`total ${total} fichiers → ${DEST}`)
