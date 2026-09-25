/** Banques pédagogiques lecture / voyelles (FLE), inspirées de la progression du livret soutien.
 * Listes de graphèmes, syllabes et mots courts — pas de textes narratifs verbatim.
 */

export type VowelId = 'a' | 'o' | 'i' | 'u' | 'e' | 'y'

export type VowelBank = {
  id: VowelId
  topic: string
  letterUpper: string
  letterLower: string
  /** Notation phonétique affichée (ex. /a/). */
  sound: string
  label: string
  /** Lettres graphiques à reconnaître (minuscules pour comparaison). */
  graphemes: readonly string[]
  words: readonly string[]
  syllables: readonly string[]
  /** Découpages pour « former un mot » / syllabe-son. */
  compounds: readonly { parts: readonly [string, string]; word: string }[]
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as readonly string[]

/** Exemples d’initiales pour « mots qui commencent par… » (courts, courants). */
export const WORDS_BY_INITIAL: Record<string, readonly string[]> = {
  A: ['ami', 'arbre', 'avion', 'ananas'],
  B: ['ballon', 'bateau', 'bébé', 'bus'],
  C: ['café', 'chat', 'clé', 'crayon'],
  D: ['datte', 'doigt', 'drap', 'durée'],
  E: ['école', 'éléphant', 'enfant', 'étoile'],
  F: ['feuille', 'firme', 'fromage', 'fruit'],
  G: ['gâteau', 'garde', 'gomme', 'guitare'],
  H: ['hiver', 'hôtel', 'huile', 'humain'],
  I: ['idée', 'image', 'île', 'insecte'],
  J: ['jardin', 'jus', 'jupe', 'jour'],
  K: ['kilo', 'kiwi', 'koala'],
  L: ['lampe', 'lait', 'livre', 'lune'],
  M: ['maison', 'mère', 'moto', 'mur'],
  N: ['nez', 'nid', 'nuit', 'numéro'],
  O: ['olive', 'orange', 'os', 'outil'],
  P: ['pain', 'papa', 'pomme', 'porte'],
  Q: ['quatre', 'quoi', 'queue'],
  R: ['rat', 'riz', 'robe', 'rouge'],
  S: ['sac', 'sel', 'soleil', 'stylo'],
  T: ['table', 'thé', 'train', 'tulipe'],
  U: ['usine', 'uniforme', 'un'],
  V: ['vase', 'vélo', 'ville', 'voiture'],
  W: ['wagon', 'wifi'],
  X: ['xylophone'],
  Y: ['yaourt', 'yeux'],
  Z: ['zèbre', 'zéro', 'zoo'],
}

export const VOWEL_BANKS: readonly VowelBank[] = [
  {
    id: 'a',
    topic: 'voyelle-a',
    letterUpper: 'A',
    letterLower: 'a',
    sound: '/a/',
    label: 'Voyelle A',
    graphemes: ['a', 'à', 'â'],
    words: [
      'bateau',
      'café',
      'avion',
      'arbre',
      'abricot',
      'quatre',
      'rat',
      'papier',
      'abeille',
      'arrosoir',
      'parapluie',
      'gâteau',
      'ananas',
      'datte',
      'vase',
      'âne',
    ],
    syllables: [
      'ta',
      'ar',
      'la',
      'pa',
      'va',
      'ca',
      'sa',
      'fa',
      'ga',
      'ab',
      'ba',
      'ra',
      'ma',
      'na',
      'papa',
      'lama',
      'bata',
    ],
    compounds: [
      { parts: ['pa', 'pa'], word: 'papa' },
      { parts: ['ra', 't'], word: 'rat' },
      { parts: ['va', 'se'], word: 'vase' },
      { parts: ['ca', 'fé'], word: 'café' },
      { parts: ['a', 'mi'], word: 'ami' },
      { parts: ['la', 'ma'], word: 'lama' },
    ],
  },
  {
    id: 'o',
    topic: 'voyelle-o',
    letterUpper: 'O',
    letterLower: 'o',
    sound: '/o/',
    label: 'Voyelle O',
    graphemes: ['o', 'ô'],
    words: [
      'tomate',
      'loto',
      'numéro',
      'robot',
      'omelette',
      'vélo',
      'orange',
      'orage',
      'ordinateur',
      'collier',
      'bonnet',
      'ordures',
      'cochon',
      'oreille',
      'koala',
      'olive',
    ],
    syllables: [
      'mo',
      'no',
      'to',
      'po',
      'vo',
      'co',
      'or',
      'ob',
      'ol',
      'ot',
      'jo',
      'ro',
      'go',
      'ko',
      'toto',
      'polo',
      'bobo',
    ],
    compounds: [
      { parts: ['vé', 'lo'], word: 'vélo' },
      { parts: ['lo', 'to'], word: 'loto' },
      { parts: ['ro', 'bot'], word: 'robot' },
      { parts: ['po', 'lo'], word: 'polo' },
      { parts: ['o', 'live'], word: 'olive' },
      { parts: ['to', 'to'], word: 'toto' },
    ],
  },
  {
    id: 'i',
    topic: 'voyelle-i',
    letterUpper: 'I',
    letterLower: 'i',
    sound: '/i/',
    label: 'Voyelle I',
    graphemes: ['i', 'î', 'ï'],
    words: [
      'ami',
      'piment',
      'miroir',
      'bijou',
      'basilic',
      'miel',
      'riz',
      'nid',
      'chemise',
      'limace',
      'brocoli',
      'cahier',
      'hiver',
      'fourmi',
      'bille',
      'guitare',
    ],
    syllables: [
      'mi',
      'ni',
      'ti',
      'pi',
      'li',
      'si',
      'ri',
      'ci',
      'ir',
      'il',
      'ib',
      'is',
      'midi',
      'pipi',
      'iris',
      'tipi',
    ],
    compounds: [
      { parts: ['a', 'mi'], word: 'ami' },
      { parts: ['mi', 'di'], word: 'midi' },
      { parts: ['ri', 'z'], word: 'riz' },
      { parts: ['ni', 'd'], word: 'nid' },
      { parts: ['ti', 'pi'], word: 'tipi' },
      { parts: ['li', 'mace'], word: 'limace' },
    ],
  },
  {
    id: 'u',
    topic: 'voyelle-u',
    letterUpper: 'U',
    letterLower: 'u',
    sound: '/y/',
    label: 'Voyelle U',
    graphemes: ['u', 'û'],
    words: [
      'allumette',
      'voiture',
      'jumelles',
      'laitue',
      'jus',
      'buffet',
      'usine',
      'flûte',
      'fruit',
      'ambulance',
      'zébu',
      'jupe',
      'chaussure',
      'tulipe',
      'bus',
      'légume',
    ],
    syllables: [
      'mu',
      'nu',
      'tu',
      'pu',
      'vu',
      'bu',
      'cu',
      'ru',
      'lu',
      'su',
      'ul',
      'us',
      'um',
      'ju',
      'tulipe',
      'lulu',
    ],
    compounds: [
      { parts: ['ju', 's'], word: 'jus' },
      { parts: ['bu', 's'], word: 'bus' },
      { parts: ['ju', 'pe'], word: 'jupe' },
      { parts: ['tu', 'lipe'], word: 'tulipe' },
      { parts: ['u', 'sine'], word: 'usine' },
      { parts: ['lu', 'lu'], word: 'lulu' },
    ],
  },
  {
    id: 'e',
    topic: 'voyelle-e',
    letterUpper: 'E',
    letterLower: 'e',
    sound: '/ə/',
    label: 'Voyelle E',
    graphemes: ['e', 'é', 'è', 'ê', 'ë'],
    words: [
      'biberon',
      'renard',
      'cheval',
      'semelle',
      'brebis',
      'genou',
      'chemin',
      'chenille',
      'fenêtre',
      'semaine',
      'cerise',
      'fenouil',
      'cheveux',
      'menu',
      'leçon',
      'devoir',
    ],
    syllables: [
      'me',
      'ne',
      'te',
      'pe',
      've',
      'be',
      'ce',
      're',
      'le',
      'se',
      'de',
      'je',
      'fe',
      'er',
      'el',
      'menu',
      'bebe',
    ],
    compounds: [
      { parts: ['me', 'nu'], word: 'menu' },
      { parts: ['le', 'çon'], word: 'leçon' },
      { parts: ['re', 'nard'], word: 'renard' },
      { parts: ['che', 'val'], word: 'cheval' },
      { parts: ['se', 'maine'], word: 'semaine' },
      { parts: ['ce', 'rise'], word: 'cerise' },
    ],
  },
  {
    id: 'y',
    topic: 'voyelle-y',
    letterUpper: 'Y',
    letterLower: 'y',
    sound: '/i/',
    label: 'Voyelle Y',
    graphemes: ['y', 'ÿ'],
    words: [
      'stylo',
      'pyjama',
      'bicyclette',
      'cygne',
      'gymnaste',
      'pyramide',
      'myrtille',
      'cyclone',
      'gymnase',
      'hygiène',
      'cylindre',
      'yacht',
      'yoga',
      'yaourt',
      'yoyo',
      'type',
    ],
    syllables: [
      'my',
      'ny',
      'ty',
      'ly',
      'sy',
      'ry',
      'cy',
      'gy',
      'yp',
      'ys',
      'yl',
      'yo',
      'ya',
      'yoyo',
      'type',
    ],
    compounds: [
      { parts: ['yo', 'yo'], word: 'yoyo' },
      { parts: ['ya', 'ourt'], word: 'yaourt' },
      { parts: ['sty', 'lo'], word: 'stylo' },
      { parts: ['ty', 'pe'], word: 'type' },
      { parts: ['cy', 'gne'], word: 'cygne' },
      { parts: ['gym', 'nase'], word: 'gymnase' },
    ],
  },
]

export const vowelByTopic = Object.fromEntries(VOWEL_BANKS.map((v) => [v.topic, v])) as Record<
  string,
  VowelBank
>

export function normalizeLetter(ch: string): string {
  return ch
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Compte les occurrences du graphème cible dans un mot (accents ignorés pour a/e/i/o/u/y). */
export function countGrapheme(word: string, bank: VowelBank): number {
  const target = normalizeLetter(bank.letterLower)
  let n = 0
  for (const ch of word) {
    if (normalizeLetter(ch) === target) n++
  }
  return n
}

export function wordHasGrapheme(word: string, bank: VowelBank): boolean {
  return countGrapheme(word, bank) > 0
}

export function otherVowelWords(bank: VowelBank, limit = 24): string[] {
  const out: string[] = []
  for (const other of VOWEL_BANKS) {
    if (other.id === bank.id) continue
    for (const w of other.words) {
      if (!wordHasGrapheme(w, bank)) out.push(w)
    }
  }
  return out.slice(0, limit)
}
