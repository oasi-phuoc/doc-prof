/** Exercices A1 « Qui suis-je ? » — tirage déterministe, rendu TCF. */
import { int, pick, shuffle, type Rng } from '@/math/rng'
import type {
  TcfChampFormulaire,
  TcfExercise,
  TcfQuestion,
  TcfQuestionLignes,
  TcfQuestionQcmTexte,
} from '@/tcf/types'
import type { GramExerciseKindId } from './kinds'

const SCHOOL_YEAR = 2026
const CHOICE_IDS = ['a', 'b', 'c'] as const

export const QUI_SUIS_JE_KIND_IDS = [
  'infos-perso',
  'infos-perso-qcm',
  'verbe-pastilles',
  'verbe-pastilles-qcm',
  'mots-melanges',
  'repondre-phrase',
  'ecrire-question',
  'formulaire',
  'ordre',
  'co-audio',
  'ce-texte',
  'portrait',
  'po-images',
] as const satisfies readonly GramExerciseKindId[]

export type QuiSuisJeKindId = (typeof QUI_SUIS_JE_KIND_IDS)[number]

export function isQuiSuisJeKind(kindId: string): kindId is QuiSuisJeKindId {
  return (QUI_SUIS_JE_KIND_IDS as readonly string[]).includes(kindId)
}

export const QUI_SUIS_JE_DEFAULT_COUNT: Record<QuiSuisJeKindId, number> = {
  'infos-perso': 7,
  'infos-perso-qcm': 7,
  'verbe-pastilles': 7,
  'verbe-pastilles-qcm': 7,
  'mots-melanges': 8,
  'repondre-phrase': 7,
  'ecrire-question': 7,
  formulaire: 1,
  ordre: 6,
  'co-audio': 5,
  'ce-texte': 5,
  portrait: 1,
  'po-images': 1,
}

export function quiSuisJeBankCap(kindId: QuiSuisJeKindId): number {
  switch (kindId) {
    case 'infos-perso':
    case 'infos-perso-qcm':
      return INFO_SLOTS.length
    case 'verbe-pastilles':
    case 'verbe-pastilles-qcm':
      return VERBE_SLOTS.length
    case 'mots-melanges':
      return MOTS_SETS.reduce((n, set) => n + set.items.length, 0)
    case 'repondre-phrase':
      return QUESTIONS_IDENTITE.length
    case 'ecrire-question':
      return 24
    case 'formulaire':
      return FORMULAIRES.length
    case 'ordre':
      return ORDRE_PHRASES.length
    case 'co-audio':
      return CO_SETS.length
    case 'ce-texte':
      return CE_SETS.length
    case 'portrait':
      return PORTRAITS.length
    case 'po-images':
      return 1
  }
}

type Personne = {
  prenom: string
  genre: 'm' | 'f'
  nationalite: string
  pays: string
  dePays: string
  langue: string
}

const PERSONNES: Personne[] = [
  { prenom: 'Isaac', genre: 'm', nationalite: 'ukrainien', pays: 'Ukraine', dePays: 'd’Ukraine', langue: 'ukrainien et russe' },
  { prenom: 'Amina', genre: 'f', nationalite: 'iranienne', pays: 'Iran', dePays: 'd’Iran', langue: 'persan' },
  { prenom: 'Karim', genre: 'm', nationalite: 'marocain', pays: 'Maroc', dePays: 'du Maroc', langue: 'arabe et français' },
  { prenom: 'Nina', genre: 'f', nationalite: 'suisse', pays: 'Suisse', dePays: 'de Suisse', langue: 'français et allemand' },
  { prenom: 'Farid', genre: 'm', nationalite: 'afghan', pays: 'Afghanistan', dePays: 'd’Afghanistan', langue: 'dari' },
  { prenom: 'Sofia', genre: 'f', nationalite: 'espagnole', pays: 'Espagne', dePays: 'd’Espagne', langue: 'espagnol' },
  { prenom: 'Kenji', genre: 'm', nationalite: 'japonais', pays: 'Japon', dePays: 'du Japon', langue: 'japonais' },
  { prenom: 'Mei', genre: 'f', nationalite: 'chinoise', pays: 'Chine', dePays: 'de Chine', langue: 'chinois' },
  { prenom: 'Omar', genre: 'm', nationalite: 'sénégalais', pays: 'Sénégal', dePays: 'du Sénégal', langue: 'wolof et français' },
  { prenom: 'Léa', genre: 'f', nationalite: 'belge', pays: 'Belgique', dePays: 'de Belgique', langue: 'français' },
  { prenom: 'Marco', genre: 'm', nationalite: 'italien', pays: 'Italie', dePays: 'd’Italie', langue: 'italien' },
  { prenom: 'Nadia', genre: 'f', nationalite: 'portugaise', pays: 'Portugal', dePays: 'du Portugal', langue: 'portugais' },
]

const VILLES_VALAIS = [
  'Sion',
  'Martigny',
  'Sierre',
  'Monthey',
  'Aproz',
  'Vouvry',
  'Savièse',
  'Fully',
  'Conthey',
  'Saxon',
  'Saint-Maurice',
]

const INFO_SLOTS = [
  {
    prompt: 'Bonjour, je m’appelle ___ (prénom).',
    hint: 'prénom',
    answer: '(votre prénom)',
    options: ['Anna', 'Karim', 'Léa'],
  },
  {
    prompt: 'Je suis ___ (nationalité).',
    hint: 'nationalité',
    answer: '(votre nationalité)',
    options: ['suisse', 'portugais', 'italienne'],
  },
  {
    prompt: 'J’ai ___ ans (âge).',
    hint: 'âge',
    answer: '(votre âge)',
    options: ['19 ans', '24 ans', '31 ans'],
  },
  {
    prompt: 'Je suis né·e le ___ (date de naissance).',
    hint: 'date de naissance',
    answer: '(votre date de naissance)',
    options: ['12.03.2001', '04.11.1998', '28.07.2004'],
  },
  {
    prompt: 'Je viens de ___ (pays).',
    hint: 'pays',
    answer: '(votre pays)',
    options: ['Portugal', 'Brésil', 'Ukraine'],
  },
  {
    prompt: 'Je parle ___ (langue).',
    hint: 'langue',
    answer: '(votre langue)',
    options: ['français', 'arabe', 'espagnol'],
  },
  {
    prompt: 'J’habite à ___ (ville).',
    hint: 'ville',
    answer: '(votre ville)',
    options: ['Sion', 'Martigny', 'Monthey'],
  },
] as const

const VERBE_SLOTS = [
  { id: 'appeler', verbe: 'm’appelle', prompt: (p: Identite) => `Bonjour, je ___ ${p.prenom}.` },
  { id: 'etre-nat', verbe: 'suis', prompt: (p: Identite) => `Je ___ ${p.nationalite}.` },
  { id: 'avoir', verbe: 'ai', prompt: (p: Identite) => `J’___ ${p.age} ans.` },
  { id: 'etre-ne', verbe: 'suis', prompt: (p: Identite) => `Je ___ ${p.ne} le ${p.naissance}.` },
  { id: 'venir', verbe: 'viens', prompt: (p: Identite) => `Je ___ ${p.dePays}.` },
  { id: 'parler', verbe: 'parle', prompt: (p: Identite) => `Je ___ ${p.langue}.` },
  { id: 'habiter', verbe: 'habite', prompt: (p: Identite) => `J’___ à ${p.ville}.` },
] as const

const VERBES_BANQUE = ['m’appelle', 'suis', 'ai', 'viens', 'parle', 'habite']

type Identite = Personne & { age: number; naissance: string; ville: string; ne: string }

const QUESTIONS_IDENTITE = [
  { q: 'Comment vous appelez-vous ?', a: 'Je m’appelle …' },
  { q: 'Vous vous appelez comment ?', a: 'Je m’appelle …' },
  { q: 'D’où venez-vous ?', a: 'Je viens de …' },
  { q: 'Vous venez d’où ?', a: 'Je viens de …' },
  { q: 'Quel âge avez-vous ?', a: 'J’ai … ans.' },
  { q: 'Vous avez quel âge ?', a: 'J’ai … ans.' },
  { q: 'Quel est votre prénom ?', a: 'Mon prénom est …' },
  { q: 'Quel est votre nom de famille ?', a: 'Mon nom de famille est …' },
  { q: 'Quelle est votre nationalité ?', a: 'Je suis …' },
  { q: 'Quelle est votre profession ?', a: 'Je suis …' },
  { q: 'Quelle est votre date de naissance ?', a: 'Je suis né·e le …' },
]

const ORDRE_PHRASES = [
  'Je m’appelle Nina.',
  'J’ai vingt ans.',
  'Je suis belge.',
  'Je viens de Belgique.',
  'J’habite à Martigny.',
  'Je parle français.',
  'Elle s’appelle Fatima.',
  'Il est syrien.',
  'Nous habitons à Sion.',
  'Vous êtes professeure.',
  'Ils parlent arabe.',
  'Tu t’appelles Léo.',
]

type MotSet = { mots: string[]; dialogue?: boolean; items: Array<{ prompt: string; answer: string }> }

const MOTS_SETS: MotSet[] = [
  {
    mots: ['25 ans', 'Léo', 'Mon numéro', 'quel âge', 'nationalité', 'm’appelle'],
    dialogue: true,
    items: [
      { prompt: 'Vous avez ___ ?', answer: 'quel âge' },
      { prompt: 'J’ai ___.', answer: '25 ans' },
      { prompt: 'Enchanté, moi c’est ___.', answer: 'Léo' },
      { prompt: 'Quelle est ta ___ ?', answer: 'nationalité' },
      { prompt: 'Je ___ Nicolas.', answer: 'm’appelle' },
      { prompt: '___, c’est le 07 14 54 19 30.', answer: 'Mon numéro' },
    ],
  },
  {
    mots: ['Ali', 'prénom', 'parle', 'Maroc', 'écoute', 'jours', 'pied', 'suis'],
    items: [
      { prompt: 'Ali ___ six langues.', answer: 'parle' },
      { prompt: 'Ali a traversé le Mali à ___.', answer: 'pied' },
      { prompt: 'J’apprends à écrire mon ___.', answer: 'prénom' },
      { prompt: 'J’___ de la musique.', answer: 'écoute' },
      { prompt: 'Vous devez attendre 30 ___.', answer: 'jours' },
      { prompt: 'Nina vient du ___.', answer: 'Maroc' },
      { prompt: 'Bonjour, je m’appelle ___.', answer: 'Ali' },
      { prompt: 'Je ___ né à Paris.', answer: 'suis' },
    ],
  },
  {
    mots: ['suis', 'habite', 'parle', 'viens', 'm’appelle', 'ai'],
    items: [
      { prompt: 'Bonjour, je ___ Sara.', answer: 'm’appelle' },
      { prompt: 'Je ___ portugaise.', answer: 'suis' },
      { prompt: 'J’___ 21 ans.', answer: 'ai' },
      { prompt: 'Je ___ du Portugal.', answer: 'viens' },
      { prompt: 'Je ___ portugais et un peu français.', answer: 'parle' },
      { prompt: 'J’___ à Sierre.', answer: 'habite' },
    ],
  },
]

const FORMULAIRES: Array<{ titre: string; champs: TcfChampFormulaire[] }> = [
  {
    titre: 'Fiche d’accueil',
    champs: [
      { label: 'Nom de famille', type: 'texte', corrige: '' },
      { label: 'Prénom', type: 'texte', corrige: '' },
      { label: 'Sexe', type: 'choix', options: ['Homme', 'Femme'], corrige: '' },
      { label: 'Âge', type: 'texte', corrige: '' },
      { label: 'Date de naissance', type: 'date', corrige: '' },
      { label: 'Nationalité', type: 'texte', corrige: '' },
      { label: 'Adresse', type: 'texte', corrige: '' },
      { label: 'Code postal', type: 'texte', corrige: '' },
      { label: 'Téléphone', type: 'texte', corrige: '' },
      { label: 'Courriel', type: 'texte', corrige: '' },
      { label: 'Date d’arrivée en Suisse', type: 'date', corrige: '' },
    ],
  },
  {
    titre: 'Inscription au cours',
    champs: [
      { label: 'Nom', type: 'texte', corrige: '' },
      { label: 'Prénom', type: 'texte', corrige: '' },
      { label: 'Date de naissance', type: 'date', corrige: '' },
      { label: 'Langue parlée à la maison', type: 'texte', corrige: '' },
      { label: 'Téléphone', type: 'texte', corrige: '' },
      { label: 'Courriel', type: 'texte', corrige: '' },
      { label: 'Ville', type: 'texte', corrige: '' },
    ],
  },
  {
    titre: 'Fiche professionnelle',
    champs: [
      { label: 'Nom de famille', type: 'texte', corrige: '' },
      { label: 'Prénom', type: 'texte', corrige: '' },
      { label: 'Nationalité', type: 'texte', corrige: '' },
      { label: 'Profession', type: 'texte', corrige: '' },
      { label: 'Téléphone', type: 'texte', corrige: '' },
      { label: 'Courriel', type: 'texte', corrige: '' },
      { label: 'Adresse', type: 'texte', corrige: '' },
    ],
  },
]

type CoSet = {
  id: string
  audio: string
  transcription: string
  questions: TcfQuestion[]
}

function vf(enonce: string, vrai: boolean): TcfQuestionQcmTexte {
  return qcm(enonce, vrai ? 'Vrai' : 'Faux', ['Vrai', 'Faux'], false)
}

function qcm(
  enonce: string,
  correct: string,
  options: string[],
  melanger = true,
  extra?: { audio?: number; modele?: string },
): TcfQuestionQcmTexte {
  const choix = options.slice(0, 3).map((texte, index) => ({
    id: CHOICE_IDS[index] ?? `c${index}`,
    texte,
    correct: texte === correct,
  }))
  if (!choix.some((c) => c.correct)) choix[0] = { ...choix[0]!, texte: correct, correct: true }
  return {
    enonce,
    type_reponse: 'qcm_texte',
    melanger,
    choix,
    formes: extra?.modele ? { lignes: { nb_lignes: 1, reponse_modele: extra.modele } } : undefined,
    ...(extra?.audio != null ? { audio: extra.audio } : {}),
  }
}

function lignes(enonce: string, modele: string, nb = 1): TcfQuestionLignes {
  return { enonce, type_reponse: 'lignes', nb_lignes: nb, reponse_modele: modele }
}

const CO_SETS: CoSet[] = [
  {
    id: 'lena',
    audio: '/lib/audio/grammaire/presenter/lena.mp3',
    transcription:
      'Bonjour, je m’appelle Léna. Je suis française, de Lyon. J’ai vingt-huit ans. Je parle français et anglais.',
    questions: [
      qcm('Elle s’appelle comment ?', 'Léna', ['Léna', 'Léa', 'Lina'], true, { modele: 'Léna' }),
      qcm('Quelle est sa nationalité ?', 'Française', ['Suisse', 'Française', 'Allemande'], true, {
        modele: 'Française',
      }),
      qcm('Elle est de quelle ville ?', 'Lyon', ['Lyon', 'Nantes', 'Perpignan'], true, { modele: 'Lyon' }),
      qcm(
        'Elle parle quelles langues ?',
        'Français et anglais',
        ['Français et anglais', 'Français, anglais et japonais', 'Français, anglais et polonais'],
        true,
        { modele: 'Français et anglais' },
      ),
      qcm('Elle a quel âge ?', '28 ans', ['27 ans', '28 ans', '29 ans'], true, { modele: '28 ans' }),
    ],
  },
  {
    id: 'karim',
    audio: '/lib/audio/grammaire/presenter/karim.mp3',
    transcription:
      'Salut, moi c’est Karim Haddad. Je suis marocain. Je suis cuisinier. J’habite à Sion.',
    questions: [
      lignes('Quel est son prénom ?', 'Karim'),
      lignes('Quel est son nom de famille ?', 'Haddad'),
      lignes('Quelle est sa nationalité ?', 'Marocain'),
      lignes('Quelle est sa profession ?', 'Cuisinier'),
    ],
  },
  {
    id: 'bernard',
    audio: '/lib/audio/grammaire/presenter/bernard.mp3',
    transcription:
      'Hello, my name is… ah, pardon. Je m’appelle Benoît, pas Bernard. Je suis canadien, de Montréal. Je suis journaliste.',
    questions: [
      vf('Il est anglais.', false),
      vf('Son prénom est Bernard.', false),
      vf('Il est de Montréal.', true),
      vf('Il est journaliste.', true),
    ],
  },
  {
    id: 'bus',
    audio: '/lib/audio/grammaire/presenter/bus.mp3',
    transcription:
      '— Noémie, tu connais Léo ? — Non, enchantée. — Moi c’est Barbara, je prends le bus. Noémie travaille encore. Léo n’habite pas avec Barbara.',
    questions: [
      vf('Noémie et Léo se connaissent.', false),
      vf('Barbara va prendre le bus.', true),
      vf('Noémie est en train de travailler.', true),
      vf('Noémie et Barbara sont amies.', false),
      vf('Léo habite avec Barbara.', false),
    ],
  },
  {
    id: 'carte',
    audio: '/lib/audio/grammaire/presenter/carte.mp3',
    transcription:
      '— C’est pour une carte de visite. Votre nom de famille ? — Sola. — Et le prénom ? — Jean. — Tu es l’ami de Camille ? — Oui. — Salut, ça va ?',
    questions: [
      qcm('La femme dit :', 'C’est pour une carte de visite.', [
        'C’est pour un passeport.',
        'C’est pour une carte de visite.',
        'C’est pour une carte d’identité.',
      ]),
      qcm('La femme demande', 'le nom de famille', ['le prénom', 'le nom de famille', 'l’adresse']),
      qcm('L’homme s’appelle', 'Sola', ['Zola', 'Sola', 'Salla']),
      qcm('Le prénom de l’homme est', 'Jean', ['Jacques', 'Jean', 'Julien']),
      qcm('La femme dit :', 'Tu es l’ami de Camille.', [
        'Tu es le mari de Camille.',
        'Tu es l’ami de Camille.',
        'Tu es le frère de Camille.',
      ]),
      qcm('Elle demande :', 'Salut, ça va ?', ['Bonjour, ça va ?', 'Salut, ça va ?', 'Vous allez bien ?']),
    ],
  },
  {
    id: 'annie',
    audio: '/lib/audio/grammaire/presenter/annie.mp3',
    transcription:
      'Annie Gatineau a quarante-deux ans. Elle est vendeuse. Nadine Gatineau est serveuse. Elle est belge.',
    questions: [
      qcm('Le nom de famille d’Annie est…', 'Gatineau', ['Schultz', 'Gatineau', 'Patineau']),
      qcm('Annie a…', '42 ans', ['37 ans', '42 ans', '24 ans']),
      qcm('Elle est…', 'vendeuse', ['pharmacienne', 'vendeuse', 'serveuse']),
      qcm('Le nom de famille de Nadine est…', 'Gatineau', ['Patineau', 'Gatineau', 'Schultz']),
      qcm('Nadine est…', 'serveuse', ['pharmacienne', 'serveuse', 'vendeuse']),
      qcm('Elle est…', 'belge', ['belge', 'suisse', 'française']),
    ],
  },
  {
    id: 'nina-felix',
    audio: '/lib/audio/grammaire/presenter/nina-felix.mp3',
    transcription:
      '— Je m’appelle Nina. Lui, c’est Félix, un ami de mon frère. Il est brésilien. Moi, je suis étudiante.',
    questions: [
      qcm('La femme s’appelle…', 'Nina', ['Sophie', 'Nina', 'Léna']),
      qcm('L’homme s’appelle…', 'Félix', ['Félipe', 'Félix', 'Felix']),
      qcm('C’est un ami…', 'du frère', ['de la sœur', 'du frère', 'du père']),
      qcm('Il est…', 'brésilien', ['brésilien', 'italien', 'espagnol']),
      qcm('La femme est…', 'étudiante', ['ingénieure', 'étudiante', 'professeure']),
    ],
  },
  {
    id: 'repondeur',
    audio: '/lib/audio/grammaire/presenter/repondeur.mp3',
    transcription:
      'Vous êtes bien chez Luc et Tania. Merci de laisser votre prénom après le signal. Le numéro est le 027 322 11 50. Au revoir.',
    questions: [
      vf('Vous écoutez un message.', true),
      vf('Le numéro est le 01 39 11 22 50.', false),
      vf('Vous êtes chez Luc et Tania.', true),
      vf('Vous laissez votre prénom.', true),
      vf('Vous donnez votre adresse.', false),
      vf('Le dernier mot est « au revoir ».', true),
    ],
  },
]

type CeSet = {
  id: string
  titre: string
  texte: string
  image?: string | null
  questions: TcfQuestion[]
}

const CE_SETS: CeSet[] = [
  {
    id: 'amina',
    titre: '',
    texte:
      'Bonjour, je m’appelle Amina. J’ai 24 ans et je viens d’Iran. Je parle persan et un peu de français. J’ai deux sœurs et un frère. J’aime lire des livres et cuisiner. Je suis professeure d’histoire. J’adore le chocolat et je n’aime pas le café.',
    questions: [
      lignes('La personne est un homme ou une femme ?', 'Une femme'),
      lignes('Quel est son prénom ?', 'Amina'),
      lignes('La personne a quel âge ?', '24 ans'),
      lignes('Quelle est sa nationalité ?', 'Iranienne'),
      lignes('Quelle est sa profession ?', 'Professeure d’histoire'),
    ],
  },
  {
    id: 'farid',
    titre: '',
    texte:
      'Salut ! Je suis Farid. Je viens de Kaboul, une grande ville en Afghanistan. J’ai 30 ans. Dans ma famille, il y a ma mère, mon père, trois frères et moi. La musique traditionnelle afghane est ma préférée.',
    questions: [
      lignes('La personne est un homme ou une femme ?', 'Un homme'),
      lignes('Quel est son prénom ?', 'Farid'),
      lignes('La personne a quel âge ?', '30 ans'),
      lignes('Quelle est sa nationalité ?', 'Afghan'),
      lignes('Quelle est sa profession ?', 'On ne sait pas.'),
    ],
  },
  {
    id: 'cafe',
    titre: 'Café des langues',
    texte:
      'Tout le monde est le bienvenu au Café des langues : étudiant, professeur, vendeur… Vous avez 20, 30, 40 ou 50 ans ? Vous êtes brésilien, italien, allemand… ? Venez parler allemand, anglais, espagnol, coréen ou français autour d’un café. Pour les informations, téléphonez au 027 322 00 00.',
    image: '/lib/images/documents/cafe-des-langues.webp',
    questions: [
      vf('Tout le monde est le bienvenu.', true),
      vf('Une personne de 25 ans est la bienvenue.', true),
      vf('C’est une invitation pour un cours d’italien.', false),
      vf('Vous ne pouvez pas parler français.', false),
      vf('Pour les informations, il faut téléphoner.', true),
    ],
  },
  {
    id: 'nora',
    titre: '',
    texte:
      'Je m’appelle Nora Keller. J’ai 33 ans. Je suis suisse et j’habite à Sion. Je suis infirmière. Je parle français et allemand. Mes amis s’appellent Marco, Mei et Omar.',
    questions: [
      qcm('Elle s’appelle…', 'Nora Keller', ['Nora Keller', 'Nina Keller', 'Nora Müller']),
      qcm('Elle a…', '33 ans', ['31 ans', '33 ans', '36 ans']),
      qcm('Elle est…', 'infirmière', ['infirmière', 'serveuse', 'professeure']),
      qcm('Elle a un ami…', 'chinois', ['chinois', 'italien', 'sénégalais']),
    ],
  },
]

type Portrait = {
  slug: string
  prenom: string
  nom: string
  genre: 'm' | 'f'
  nationalite: string
  profession: string
  age: number
  amis: string
  amiNationalite: string
}

const PORTRAITS: Portrait[] = [
  {
    slug: 'lisa-morel',
    prenom: 'Lisa',
    nom: 'Morel',
    genre: 'f',
    nationalite: 'suisse',
    profession: 'serveuse',
    age: 23,
    amis: 'Marco, Nadia, Omar',
    amiNationalite: 'italien',
  },
  {
    slug: 'marco-bianchi',
    prenom: 'Marco',
    nom: 'Bianchi',
    genre: 'm',
    nationalite: 'italien',
    profession: 'étudiant',
    age: 19,
    amis: 'Lisa, Kenji, Ana',
    amiNationalite: 'suisse',
  },
  {
    slug: 'nadia-hassan',
    prenom: 'Nadia',
    nom: 'Hassan',
    genre: 'f',
    nationalite: 'marocaine',
    profession: 'infirmière',
    age: 29,
    amis: 'Omar, Nora, Mei',
    amiNationalite: 'sénégalais',
  },
  {
    slug: 'kenji-sato',
    prenom: 'Kenji',
    nom: 'Sato',
    genre: 'm',
    nationalite: 'japonais',
    profession: 'cuisinier',
    age: 34,
    amis: 'Paul, Marco, Lisa',
    amiNationalite: 'français',
  },
  {
    slug: 'ana-petrov',
    prenom: 'Ana',
    nom: 'Petrov',
    genre: 'f',
    nationalite: 'ukrainienne',
    profession: 'professeure',
    age: 27,
    amis: 'Nadia, Farid, Nora',
    amiNationalite: 'marocaine',
  },
  {
    slug: 'omar-diallo',
    prenom: 'Omar',
    nom: 'Diallo',
    genre: 'm',
    nationalite: 'sénégalais',
    profession: 'mécanicien',
    age: 31,
    amis: 'Kenji, Lisa, Marco',
    amiNationalite: 'japonais',
  },
  {
    slug: 'sofia-alvarez',
    prenom: 'Sofia',
    nom: 'Alvarez',
    genre: 'f',
    nationalite: 'espagnole',
    profession: 'vendeuse',
    age: 25,
    amis: 'Ana, Paul, Mei',
    amiNationalite: 'ukrainienne',
  },
  {
    slug: 'thomas-weber',
    prenom: 'Thomas',
    nom: 'Weber',
    genre: 'm',
    nationalite: 'allemand',
    profession: 'journaliste',
    age: 36,
    amis: 'Nora, Omar, Kenji',
    amiNationalite: 'suisse',
  },
  {
    slug: 'mei-chen',
    prenom: 'Mei',
    nom: 'Chen',
    genre: 'f',
    nationalite: 'chinoise',
    profession: 'étudiante',
    age: 22,
    amis: 'Sofia, Lisa, Ana',
    amiNationalite: 'espagnole',
  },
  {
    slug: 'paul-dupont',
    prenom: 'Paul',
    nom: 'Dupont',
    genre: 'm',
    nationalite: 'français',
    profession: 'boulanger',
    age: 40,
    amis: 'Thomas, Nadia, Marco',
    amiNationalite: 'allemand',
  },
]

const EXEMPLE_PORTRAIT =
  'Exemple :\n1. Elle s’appelle Nora Keller.\n2. Elle est infirmière.\n3. Elle a 33 ans.\n4. Elle a un ami italien.'

function birthDate(rng: Rng, age: number): string {
  const year = SCHOOL_YEAR - age
  const month = int(rng, 1, 12)
  const maxDay = month === 2 ? 28 : 30
  const day = int(rng, 1, maxDay)
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
}

function identite(rng: Rng): Identite {
  const p = pick(rng, PERSONNES)
  const age = int(rng, 15, 25)
  return {
    ...p,
    age,
    naissance: birthDate(rng, age),
    ville: pick(rng, VILLES_VALAIS),
    ne: p.genre === 'f' ? 'née' : 'né',
  }
}

function distracteurs(correct: string, pool: readonly string[], n: number, rng: Rng): string[] {
  const others = shuffle(
    rng,
    pool.filter((item) => item !== correct),
  )
  const out = [correct, ...others.slice(0, Math.max(0, n - 1))]
  while (out.length < n) out.push(correct)
  return shuffle(rng, out.slice(0, n))
}

function fillQuestion(
  enonce: string,
  answer: string,
  options: string[] | undefined,
  preferQcm: boolean,
): TcfQuestion {
  const lignesForme = { nb_lignes: 0 as const, reponse_modele: answer }
  if (!options || options.length < 2) {
    return { enonce, type_reponse: 'lignes', ...lignesForme }
  }
  const choix = options.slice(0, 3).map((texte, index) => ({
    id: CHOICE_IDS[index] ?? `c${index}`,
    texte,
    correct: texte === answer || (!options.includes(answer) && index === 0),
  }))
  if (preferQcm) {
    return {
      enonce,
      type_reponse: 'qcm_texte',
      melanger: true,
      choix,
      formes: { lignes: lignesForme },
    }
  }
  return {
    enonce,
    type_reponse: 'lignes',
    ...lignesForme,
    formes: { qcm_texte: { melanger: true, choix } },
  }
}

function scramble(rng: Rng, phrase: string): { prompt: string; answer: string } {
  const answer = phrase.trim()
  const tokens = answer
    .replace(/([.?!])/g, ' $1')
    .split(/\s+/)
    .filter(Boolean)
  const mixed = shuffle(rng, tokens)
  return { prompt: mixed.join(' – '), answer }
}

function take<T>(rng: Rng, list: readonly T[], count: number): T[] {
  const n = Math.min(Math.max(1, count), list.length)
  return shuffle(rng, [...list]).slice(0, n)
}

function wrap(
  typeId: string,
  consigne: string,
  exercise: TcfExercise,
): TcfExercise {
  return { ...exercise, id: `gram-${typeId}`, consigne }
}

export function buildQuiSuisJeExercise(opts: {
  kindId: QuiSuisJeKindId
  typeId: string
  rng: Rng
  count: number
}): TcfExercise {
  const { kindId, typeId, rng, count } = opts
  switch (kindId) {
    case 'infos-perso':
    case 'infos-perso-qcm': {
      const preferQcm = kindId === 'infos-perso-qcm'
      const slots = take(rng, INFO_SLOTS, count)
      return wrap(typeId, 'Complétez les phrases avec vos informations personnelles.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: slots.map((slot) =>
          fillQuestion(slot.prompt, preferQcm ? slot.options[0]! : slot.answer, [...slot.options], preferQcm),
        ),
      })
    }
    case 'verbe-pastilles':
    case 'verbe-pastilles-qcm': {
      const preferQcm = kindId === 'verbe-pastilles-qcm'
      const who = identite(rng)
      const slots = take(rng, VERBE_SLOTS, count)
      const questions = slots.map((slot) => {
        const options = distracteurs(slot.verbe, VERBES_BANQUE, 3, rng)
        return fillQuestion(slot.prompt(who), slot.verbe, options, preferQcm)
      })
      return wrap(typeId, 'Complétez les phrases avec le verbe correct.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        mots_banque: shuffle(rng, [...VERBES_BANQUE]),
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'mots-melanges': {
      const set = pick(rng, MOTS_SETS)
      const items = take(rng, set.items, Math.min(count, set.items.length))
      if (set.dialogue) {
        const enonce = set.items.map((item, i) => `${i + 1}. ${item.prompt}`).join('\n')
        const answer = set.items.map((item) => item.answer).join(' / ')
        return wrap(typeId, 'Complétez le dialogue avec les mots proposés.', {
          id: '',
          niveau: 'A1-A2',
          competence: 'CO',
          type_exercice: 'complet',
          mots_banque: shuffle(rng, set.mots),
          support: { audio: '', transcription: '' },
          questions: [fillQuestion(enonce, answer, undefined, false)],
        })
      }
      return wrap(typeId, 'Complétez avec les mots proposés.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        mots_banque: shuffle(rng, set.mots),
        support: { audio: '', transcription: '' },
        questions: items.map((item) => {
          const options = distracteurs(item.answer, set.mots, 3, rng)
          return fillQuestion(item.prompt, item.answer, options, false)
        }),
      })
    }
    case 'repondre-phrase': {
      const rows = take(rng, QUESTIONS_IDENTITE, count)
      return wrap(typeId, 'Répondez aux questions avec une phrase.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) => lignes(row.q, row.a, 1)),
      })
    }
    case 'ecrire-question': {
      const who = identite(rng)
      const pool: Array<{ prompt: string; answer: string }> = [
        { prompt: `Je m’appelle ${who.prenom}.`, answer: 'Comment vous appelez-vous ?' },
        { prompt: `Je suis ${who.nationalite}.`, answer: 'Quelle est votre nationalité ?' },
        { prompt: `J’ai ${who.age} ans.`, answer: 'Quel âge avez-vous ?' },
        { prompt: `Je suis ${who.ne} le ${who.naissance}.`, answer: 'Quelle est votre date de naissance ?' },
        { prompt: `Je viens ${who.dePays}.`, answer: 'D’où venez-vous ?' },
        { prompt: `Je parle ${who.langue}.`, answer: 'Quelle langue parlez-vous ?' },
        { prompt: `J’habite à ${who.ville}.`, answer: 'Où habitez-vous ?' },
      ]
      const rows = take(rng, pool, count)
      return wrap(typeId, 'Écrivez la question selon la réponse donnée.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) => lignes(row.prompt, row.answer, 1)),
      })
    }
    case 'formulaire': {
      const form = pick(rng, FORMULAIRES)
      return wrap(typeId, 'Remplissez le formulaire avec vos informations.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'PE',
        type_exercice: 'formulaire',
        support: { titre: form.titre, champs: form.champs },
        questions: [],
      })
    }
    case 'ordre': {
      const rows = take(rng, ORDRE_PHRASES, count).map((phrase) => scramble(rng, phrase))
      return wrap(typeId, 'Remettez les mots dans l’ordre pour faire une phrase.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) => lignes(row.prompt, row.answer, 1)),
      })
    }
    case 'co-audio': {
      const set = pick(rng, CO_SETS)
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Écoutez et répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: set.audio, transcription: set.transcription },
        questions,
      })
    }
    case 'ce-texte': {
      const set = pick(rng, CE_SETS)
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Lisez et répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: set.titre, texte: set.texte, image: set.image ?? null },
        questions,
      })
    }
    case 'portrait': {
      const person = pick(rng, PORTRAITS)
      const pron = person.genre === 'f' ? 'Elle' : 'Il'
      const ami = person.genre === 'f' ? 'une amie' : 'un ami'
      const modele = [
        `${pron} s’appelle ${person.prenom} ${person.nom}.`,
        `${pron} est ${person.profession}.`,
        `${pron} a ${person.age} ans.`,
        `${pron} a ${ami} ${person.amiNationalite}.`,
      ].join('\n')
      return wrap(typeId, 'Présentez la personne comme dans l’exemple.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'PE',
        type_exercice: 'image_question',
        consigne_supplementaire: EXEMPLE_PORTRAIT,
        support: {
          image: `/lib/images/vocabulaire/presenter/portrait-${person.slug}.webp`,
          consigne: '',
          nb_mots: { min: 20, max: 36 },
          reponse_modele: modele,
          fiche: {
            nom: `${person.prenom} ${person.nom}`,
            lignes: [
              { label: 'Nationalité', valeur: person.nationalite },
              { label: 'Profession', valeur: person.profession },
              { label: 'Âge', valeur: `${person.age} ans` },
              { label: person.genre === 'f' ? 'Amie avec' : 'Ami avec', valeur: person.amis },
            ],
          },
        },
        questions: [],
      })
    }
    case 'po-images':
      return wrap(typeId, 'Observez les images. Présentez-vous comme dans l’exemple.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'PO',
        type_exercice: 'sequence_4_images',
        support: {
          images: [
            '/lib/images/comprehension/po-a1/classe-presentation-1.webp',
            '/lib/images/comprehension/po-a1/classe-presentation-2.webp',
            '/lib/images/comprehension/po-a1/classe-presentation-3.webp',
            '/lib/images/comprehension/po-a1/classe-presentation-4.webp',
          ],
          reponse_modele:
            'Bonjour, je m’appelle … Je suis … J’ai … ans. Je viens de … J’habite à … Je parle …',
        },
        questions: [],
      })
  }
}
