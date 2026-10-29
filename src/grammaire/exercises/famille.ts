/** Exercices « Parler de sa famille » — tirage déterministe, rendu TCF. */
import { pick, shuffle, type Rng } from '@/math/rng'
import type {
  TcfChoixTexte,
  TcfExercise,
  TcfQuestion,
  TcfQuestionLignes,
  TcfQuestionQcmTexte,
} from '@/tcf/types'
import type { GramExerciseKindId } from './kinds'

const CHOICE_IDS = ['a', 'b', 'c'] as const
const IMG = '/lib/images/documents/famille'
const AUD = '/lib/audio/grammaire/famille'

export const FAMILLE_KIND_IDS = [
  'fam-det',
  'fam-pronoms-1',
  'fam-pronoms-2',
  'fam-faire-part',
  'fam-pe',
  'fam-arbre',
  'fam-photo',
  'fam-recit',
  'fam-email',
  'fam-co',
] as const satisfies readonly GramExerciseKindId[]

export type FamilleKindId = (typeof FAMILLE_KIND_IDS)[number]

export function isFamilleKind(kindId: string): kindId is FamilleKindId {
  return (FAMILLE_KIND_IDS as readonly string[]).includes(kindId)
}

export const FAMILLE_DEFAULT_COUNT: Record<FamilleKindId, number> = {
  'fam-det': 8,
  'fam-pronoms-1': 7,
  'fam-pronoms-2': 8,
  'fam-faire-part': 6,
  'fam-pe': 5,
  'fam-arbre': 6,
  'fam-photo': 5,
  'fam-recit': 6,
  'fam-email': 5,
  'fam-co': 6,
}

export function familleBankCap(kindId: FamilleKindId): number {
  switch (kindId) {
    case 'fam-det':
      return DET_BANK.length
    case 'fam-pronoms-1':
      return PRONOMS_1.length
    case 'fam-pronoms-2':
      return PRONOMS_2.length
    case 'fam-faire-part':
      return FAIRE_PARTS[0]!.questions.length
    case 'fam-pe':
      return 5
    case 'fam-arbre':
      return ARBRE_QUESTIONS.length
    case 'fam-photo':
      return PHOTO_SETS[0]!.questions.length
    case 'fam-recit':
      return RECIT_QUESTIONS.length
    case 'fam-email':
      return EMAIL_QUESTIONS.length
    case 'fam-co':
      return Math.max(...CO_SETS.map((s) => s.questions.length))
  }
}

export function familleFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (
    kindId === 'fam-det' ||
    kindId === 'fam-pronoms-1' ||
    kindId === 'fam-pronoms-2' ||
    kindId === 'fam-faire-part' ||
    kindId === 'fam-photo'
  ) {
    return 'header2'
  }
  if (
    kindId === 'fam-arbre' ||
    kindId === 'fam-recit' ||
    kindId === 'fam-email' ||
    kindId === 'fam-co'
  ) {
    return 'margin3'
  }
  return 'none'
}

function wrap(typeId: string, consigne: string, exercise: TcfExercise): TcfExercise {
  return { ...exercise, id: `gram-${typeId}`, consigne }
}

function qcm(
  enonce: string,
  correct: string,
  options: string[],
  melanger = true,
  extra?: { modele?: string; label?: string },
): TcfQuestionQcmTexte {
  const choix = options.slice(0, 3).map((texte, index) => ({
    id: CHOICE_IDS[index] ?? `c${index}`,
    texte,
    correct: texte === correct,
  })) as TcfChoixTexte[]
  if (!choix.some((c) => c.correct)) choix[0] = { ...choix[0]!, texte: correct, correct: true }
  return {
    enonce,
    type_reponse: 'qcm_texte',
    melanger,
    choix,
    formes: extra?.modele ? { lignes: { nb_lignes: 1, reponse_modele: extra.modele } } : undefined,
    ...(extra?.label ? { numero_label: extra.label } : {}),
  }
}

function vf(enonce: string, vrai: boolean): TcfQuestionQcmTexte {
  const answer = vrai ? 'Vrai' : 'Faux'
  return qcm(enonce, answer, ['Vrai', 'Faux', 'Je ne sais pas'], false, { modele: answer })
}

function lignes(enonce: string, modele: string, nb = 1, label?: string): TcfQuestionLignes {
  return {
    enonce,
    type_reponse: 'lignes',
    nb_lignes: nb,
    reponse_modele: modele,
    ...(label ? { numero_label: label } : {}),
  }
}

function dualQcmTrait(
  enonce: string,
  answer: string,
  options: string[],
  melanger = true,
): TcfQuestion {
  const choix: TcfChoixTexte[] = options.slice(0, 3).map((texte, index) => ({
    id: CHOICE_IDS[index] ?? `c${index}`,
    texte,
    correct: texte === answer,
  }))
  const inline = /_{3,}/.test(enonce)
  return {
    enonce,
    type_reponse: 'qcm_texte',
    melanger,
    choix,
    formes: { lignes: { nb_lignes: inline ? 0 : 1, reponse_modele: answer } },
  }
}

function take<T>(rng: Rng, list: readonly T[], count: number): T[] {
  const n = Math.min(Math.max(1, count), list.length)
  return shuffle(rng, [...list]).slice(0, n)
}

// —— Type 1 : déterminants possessifs ——

type DetItem = { stem: string; answer: string; options: [string, string] }

const DET_BANK: DetItem[] = [
  { stem: '___ sœur est mariée.', answer: 'Ma', options: ['Ma', 'Mon'] },
  { stem: '___ parents sont divorcés.', answer: 'Tes', options: ['Ton', 'Tes'] },
  { stem: '___ grands-parents sont âgés.', answer: 'Ses', options: ['Ses', 'Sa'] },
  { stem: '___ père est veuf.', answer: 'Mon', options: ['Mon', 'Mes'] },
  { stem: '___ fille est brune.', answer: 'Sa', options: ['Son', 'Sa'] },
  { stem: '___ enfants sont mariés.', answer: 'Leurs', options: ['Notre', 'Leurs'] },
  { stem: '___ cousine habite à Genève.', answer: 'Ma', options: ['Ma', 'Mon'] },
  { stem: '___ sœur est très gentille.', answer: 'Ta', options: ['Ton', 'Ta'] },
  { stem: '___ frère travaille à Lausanne.', answer: 'Mon', options: ['Mon', 'Ma'] },
  { stem: '___ oncle est médecin.', answer: 'Ton', options: ['Ton', 'Ta'] },
  { stem: '___ tante habite à Paris.', answer: 'Sa', options: ['Son', 'Sa'] },
  { stem: '___ enfants vont à l’école.', answer: 'Mes', options: ['Mon', 'Mes'] },
  { stem: '___ cousine s’appelle Léa.', answer: 'Notre', options: ['Notre', 'Nos'] },
  { stem: '___ parents sont suisses.', answer: 'Vos', options: ['Votre', 'Vos'] },
  { stem: '___ fils a huit ans.', answer: 'Leur', options: ['Leur', 'Leurs'] },
  { stem: '___ nièce est blonde.', answer: 'Ma', options: ['Ma', 'Mon'] },
  { stem: '___ neveu joue au foot.', answer: 'Ton', options: ['Ton', 'Ta'] },
  { stem: '___ grand-mère cuisine bien.', answer: 'Sa', options: ['Son', 'Sa'] },
  { stem: '___ sœurs sont jumelles.', answer: 'Mes', options: ['Ma', 'Mes'] },
  { stem: '___ cousin habite en Italie.', answer: 'Notre', options: ['Notre', 'Nos'] },
]

// —— Type 2 : pronoms possessifs (cue → déterminant) ——

type PronomItem = { cue: string; noun: string; answer: string; plural?: boolean }

function pronomPrompt(item: PronomItem): string {
  const start = item.plural ? 'Ce sont' : 'C’est'
  return `${start} ___ ${item.noun} ? (${item.cue})`
}

function pronomOptions(answer: string): string[] {
  const pool = ['mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs']
  const others = pool.filter((w) => w !== answer)
  return [answer, others[0]!, others[Math.min(5, others.length - 1)]!]
}

const PRONOMS_1: PronomItem[] = [
  { cue: 'à vous', noun: 'mari', answer: 'votre' },
  { cue: 'à elle', noun: 'fils', answer: 'son' },
  { cue: 'à eux', noun: 'père', answer: 'leur' },
  { cue: 'à toi', noun: 'amie', answer: 'ton' },
  { cue: 'à nous', noun: 'enfants', answer: 'nos', plural: true },
  { cue: 'à lui', noun: 'fille', answer: 'sa' },
  { cue: 'à elles', noun: 'mère', answer: 'leur' },
]

type PronomItem2 = PronomItem & { negatif?: boolean }

const PRONOMS_2: PronomItem2[] = [
  { cue: 'à moi', noun: 'mère', answer: 'ma', negatif: true },
  { cue: 'à toi', noun: 'mari', answer: 'ton' },
  { cue: 'à elle', noun: 'sœur', answer: 'sa' },
  { cue: 'à lui', noun: 'cousin', answer: 'son' },
  { cue: 'à nous', noun: 'parents', answer: 'nos', plural: true, negatif: true },
  { cue: 'à eux', noun: 'enfants', answer: 'leurs', plural: true },
  { cue: 'à vous', noun: 'fille', answer: 'votre' },
  { cue: 'à elles', noun: 'grand-mère', answer: 'leur' },
]

function pronomPrompt2(item: PronomItem2): string {
  if (item.negatif && item.plural) return `Ce ne sont pas ___ ${item.noun} ? (${item.cue})`
  if (item.negatif) return `Ce n’est pas ___ ${item.noun} ? (${item.cue})`
  return pronomPrompt(item)
}

// —— Type 3 : faire-part ——

type FairePart = {
  slug: string
  image: string
  questions: TcfQuestion[]
}

const FAIRE_PARTS: FairePart[] = [
  {
    slug: 'jackie',
    image: `${IMG}/faire-part-jackie.webp`,
    questions: [
      dualQcmTrait('Jackie est ___ d’Olivier et Natasha.', 'la fille', ['la fille', 'le fils']),
      dualQcmTrait('Jackie est ___ de Sébastien et Marion.', 'la sœur', ['le frère', 'la sœur']),
      dualQcmTrait('Jackie a ___.', 'une sœur', ['une sœur', 'deux sœurs']),
      dualQcmTrait('Marc et Catherine sont les ___.', 'grands-parents', ['parents', 'grands-parents']),
      dualQcmTrait('Marion a ___.', 'un frère et une sœur', ['un frère', 'un frère et une sœur']),
      dualQcmTrait('Olivier et Natasha ont ___.', 'trois enfants', ['deux enfants', 'trois enfants']),
    ],
  },
  {
    slug: 'lucas',
    image: `${IMG}/faire-part-lucas.webp`,
    questions: [
      dualQcmTrait('Lucas est ___ de Julie et Thomas.', 'le fils', ['la fille', 'le fils']),
      dualQcmTrait('Lucas est ___ d’Emma et Noah.', 'le frère', ['le frère', 'la sœur']),
      dualQcmTrait('Lucas a ___.', 'une sœur', ['une sœur', 'deux sœurs']),
      dualQcmTrait('Paul et Anne sont les ___.', 'grands-parents', ['parents', 'grands-parents']),
      dualQcmTrait('Emma a ___.', 'deux frères', ['un frère', 'deux frères']),
      dualQcmTrait('Julie et Thomas ont ___.', 'trois enfants', ['deux enfants', 'trois enfants']),
    ],
  },
  {
    slug: 'sara',
    image: `${IMG}/faire-part-sara.webp`,
    questions: [
      dualQcmTrait('Sara est ___ de Leila et Samir.', 'la fille', ['la fille', 'le fils']),
      dualQcmTrait('Sara est ___ de Karim et Layla.', 'la sœur', ['le frère', 'la sœur']),
      dualQcmTrait('Sara a ___.', 'une sœur', ['une sœur', 'deux sœurs']),
      dualQcmTrait('Hassan et Fatima sont les ___.', 'grands-parents', ['parents', 'grands-parents']),
      dualQcmTrait('Layla a ___.', 'un frère et une sœur', ['un frère', 'un frère et une sœur']),
      dualQcmTrait('Leila et Samir ont ___.', 'trois enfants', ['deux enfants', 'trois enfants']),
    ],
  },
  {
    slug: 'leo',
    image: `${IMG}/faire-part-leo.webp`,
    questions: [
      dualQcmTrait('Léo est ___ de Marie et David.', 'le fils', ['la fille', 'le fils']),
      dualQcmTrait('Léo est ___ de Chloé.', 'le frère', ['le frère', 'la sœur']),
      dualQcmTrait('Léo a ___.', 'une sœur', ['une sœur', 'deux sœurs']),
      dualQcmTrait('Jean et Claire sont les ___.', 'grands-parents', ['parents', 'grands-parents']),
      dualQcmTrait('Chloé a ___.', 'un frère', ['un frère', 'deux frères']),
      dualQcmTrait('Marie et David ont ___.', 'deux enfants', ['deux enfants', 'trois enfants']),
    ],
  },
  {
    slug: 'mina',
    image: `${IMG}/faire-part-mina.webp`,
    questions: [
      dualQcmTrait('Mina est ___ de Nadia et Youssef.', 'la fille', ['la fille', 'le fils']),
      dualQcmTrait('Mina est ___ d’Adam et Yasmine.', 'la sœur', ['le frère', 'la sœur']),
      dualQcmTrait('Mina a ___.', 'une sœur', ['une sœur', 'deux sœurs']),
      dualQcmTrait('Amira et Rachid sont les ___.', 'grands-parents', ['parents', 'grands-parents']),
      dualQcmTrait('Yasmine a ___.', 'un frère et une sœur', ['un frère', 'un frère et une sœur']),
      dualQcmTrait('Nadia et Youssef ont ___.', 'trois enfants', ['deux enfants', 'trois enfants']),
    ],
  },
]

// —— PE ——

const PE_MODELE = [
  '1. Je m’appelle …',
  '2. J’ai un frère / une sœur.',
  '3. Mes parents s’appellent …',
  '4. Mon grand-père habite à …',
  '5. Nous sommes une famille de … personnes.',
].join('\n')

// —— CE arbre ——

const ARBRE_QUESTIONS: TcfQuestion[] = [
  vf('Dominique a une petite-fille.', false),
  vf('Louis et Damien sont frères.', false),
  vf('Camille est la sœur de Guillaume.', false),
  vf('L’oncle d’Alban est médecin.', true),
  vf('Les parents d’Auguste sont artistes.', true),
  vf('Les grands-parents d’Alban ont trois fils.', false),
]

// —— CE photo ——

type PhotoSet = {
  slug: string
  image: string
  questions: TcfQuestion[]
}

function photoQuestions(n: {
  dad: string
  girl: string
  boy: string
  gm: string
  gf: string
  mom: string
}): TcfQuestion[] {
  return [
    dualQcmTrait(`${n.dad} est le ___ de ${n.girl}.`, 'père', ['père', 'frère', 'fils']),
    dualQcmTrait(`${n.gf} est le ___ de ${n.boy}.`, 'grand-père', ['père', 'grand-père', 'oncle']),
    dualQcmTrait(`${n.boy} est le ___ de ${n.girl}.`, 'frère', ['frère', 'père', 'cousin']),
    dualQcmTrait(`${n.gm} est la ___ de ${n.boy}.`, 'grand-mère', ['mère', 'grand-mère', 'tante']),
    dualQcmTrait(`${n.dad} et ${n.mom} sont les ___ de ${n.girl}.`, 'parents', ['parents', 'grands-parents', 'enfants']),
  ]
}

const PHOTO_SETS: PhotoSet[] = [
  {
    slug: 'paul-lea',
    image: `${IMG}/photo-famille-paul-lea.webp`,
    questions: photoQuestions({
      dad: 'Paul',
      girl: 'Léa',
      boy: 'Jules',
      gm: 'Elise',
      gf: 'Daniel',
      mom: 'Françoise',
    }),
  },
  {
    slug: 'marc-nina',
    image: `${IMG}/photo-famille-marc-nina.webp`,
    questions: photoQuestions({
      dad: 'Marc',
      girl: 'Nina',
      boy: 'Hugo',
      gm: 'Anne',
      gf: 'Pierre',
      mom: 'Sophie',
    }),
  },
  {
    slug: 'karim-sara',
    image: `${IMG}/photo-famille-karim-sara.webp`,
    questions: photoQuestions({
      dad: 'Karim',
      girl: 'Sara',
      boy: 'Amir',
      gm: 'Fatima',
      gf: 'Hassan',
      mom: 'Leila',
    }),
  },
  {
    slug: 'thomas-emma',
    image: `${IMG}/photo-famille-thomas-emma.webp`,
    questions: photoQuestions({
      dad: 'Thomas',
      girl: 'Emma',
      boy: 'Noah',
      gm: 'Claire',
      gf: 'Jean',
      mom: 'Julie',
    }),
  },
  {
    slug: 'youssef-mina',
    image: `${IMG}/photo-famille-youssef-mina.webp`,
    questions: photoQuestions({
      dad: 'Youssef',
      girl: 'Mina',
      boy: 'Adam',
      gm: 'Amira',
      gf: 'Rachid',
      mom: 'Nadia',
    }),
  },
]

// —— CE récit ——

const RECIT_TEXTE = `Je vais vous parler de ma famille. Mes parents s’appellent Muzghan et Noorullah. J’ai un grand frère et une petite sœur. Mon frère s’appelle Ali, et ma sœur s’appelle Amina.
J’ai deux cousins. Ils s’appellent Karim et Sara. Nous jouons souvent ensemble le week-end. La fille de Sara s’appelle Mary.
Mon frère Ali a un fils et une fille. Mon neveu s’appelle Omar et ma nièce s’appelle Leila. La fille d’Amina s’appelle Jamila.`

const RECIT_QUESTIONS: TcfQuestion[] = [
  dualQcmTrait('Comment s’appellent les parents ?', 'Muzghan et Noorullah', [
    'Muzghan et Noorullah',
    'Ali et Amina',
    'Karim et Sara',
  ]),
  dualQcmTrait('Combien de frères et sœurs a la personne ?', 'Un frère et une sœur', [
    'Deux frères',
    'Un frère et une sœur',
    'Deux sœurs',
  ]),
  dualQcmTrait('Comment s’appelle le frère ?', 'Ali', ['Ali', 'Karim', 'Omar']),
  dualQcmTrait('Comment s’appelle la fille de Sara ?', 'Mary', ['Mary', 'Leila', 'Jamila']),
  lignes('Comment s’appelle le neveu ?', 'Omar'),
  lignes('Comment s’appelle la nièce ?', 'Leila'),
]

// —— CE email ——

const EMAIL_QUESTIONS: TcfQuestion[] = [
  dualQcmTrait('Le document est …', 'Un email au directeur', [
    'Un email au directeur',
    'Une invitation',
    'Une lettre d’amour',
  ]),
  dualQcmTrait('C’est pour inscrire les enfants …', 'À l’école', [
    'Au sport',
    'À une fête',
    'À l’école',
  ]),
  lignes('Comment s’appelle la mère ?', 'Véronique'),
  lignes('Quel âge ont les enfants ?', 'Marie a 8 ans et Bérangère a 10 ans'),
  lignes('Quel est le nom de famille ?', 'Duval'),
]

// —— CO ——

type CoSet = {
  id: string
  audio: string
  transcription: string
  questions: TcfQuestion[]
}

const CO_SETS: CoSet[] = [
  {
    id: 'audio-1-vf',
    audio: `${AUD}/lecon-02-01-02-audio-1.mp3`,
    transcription:
      'Audio CSC_FR_LECON-02_01.02_AUDIO-1 — à déposer. (Présentation de la famille Duprès.)',
    questions: [
      vf('Duprès c’est le nom de son père.', true),
      vf('Sa mère est française.', false),
      vf('Sa mère habite à Fugère.', false),
      vf('Ses deux sœurs sont infirmières.', false),
      vf('Son fils Thomas a dix ans.', false),
      vf('Thomas parle trois langues.', true),
    ],
  },
  {
    id: 'audio-2-lettres',
    audio: `${AUD}/lecon-02-01-03-audio-2.mp3`,
    transcription:
      'Audio CSC_FR_LECON-02_01.03_AUDIO-2 — à déposer. (Compléter avec des mots de famille.)',
    questions: [
      lignes('Sa ___ est musicienne.', 'sœur', 0, 'a'),
      lignes('Leur tante a trois ___.', 'enfants', 0, 'b'),
      lignes('Votre ___ est professeur ?', 'cousin', 0, 'c'),
      lignes('Nos ___ ont 50 ans.', 'parents', 0, 'd'),
    ],
  },
  {
    id: 'audio-3-fabien',
    audio: `${AUD}/lecon-02-02-01-audio-3.mp3`,
    transcription:
      'Audio CSC_FR_LECON-02_02.01_AUDIO-3 — à déposer. (Photo : Fabien, Simon, Flavie, Sébastien.)',
    questions: [
      dualQcmTrait('Fabien est ___.', 'un ami', ['un ami', 'une amie']),
      dualQcmTrait('Fabien est ___.', 'professeur', ['professeur', 'étudiant']),
      dualQcmTrait('Simon est ___.', 'le frère', ['le père', 'le frère']),
      dualQcmTrait('Flavie est ___ de Sébastien.', 'l’amie', ['l’amie', 'la mère']),
      dualQcmTrait('Sébastien est ___.', 'le frère', ['le père', 'le frère']),
      dualQcmTrait('Sébastien est ___.', 'brun', ['blond', 'brun']),
    ],
  },
  {
    id: 'audio-4-photo',
    audio: `${AUD}/lecon-02-02-01-audio-4.mp3`,
    transcription:
      'Audio CSC_FR_LECON-02_02.01_AUDIO-4 — à déposer. (Description d’une photo de famille.)',
    questions: [
      vf('On parle d’une photo de mariage.', false),
      vf('La personne qui parle est sur la photo.', true),
      vf('Elle est blonde.', false),
      vf('Thomas est le père.', true),
      vf('C’est le petit blond.', true),
      vf('Thomas est veuf.', false),
    ],
  },
  {
    id: 'audio-5-familles',
    audio: `${AUD}/lecon-02-02-01-audio-5.mp3`,
    transcription:
      'Audio CSC_FR_LECON-02_02.01_AUDIO-5 — à déposer. (Les familles françaises.)',
    questions: [
      dualQcmTrait('On parle des familles ___.', 'françaises', ['anglaises', 'françaises']),
      dualQcmTrait('Elles ont ___.', 'un ou deux enfants', ['un enfant', 'un ou deux enfants']),
      dualQcmTrait('Les parents sont ___.', 'jeunes', ['âgés', 'jeunes']),
      dualQcmTrait('Ils ont ___.', '30 à 35', ['30 à 35', '40 à 45']),
      dualQcmTrait('Ils sont ___.', 'mariés ou pacsés', ['mariés et pacsés', 'mariés ou pacsés']),
      dualQcmTrait('Ils sont aussi ___.', 'séparés ou divorcés', [
        'célibataire',
        'séparés ou divorcés',
      ]),
    ],
  },
  {
    id: 'audio-nina',
    audio: `${AUD}/lecon-02-02-01-audio-1.mp3`,
    transcription:
      'Fatima, regarde la photo sur mon téléphone. C’est ma famille. Là c’est mon frère, Farid.\nWaouh, le bel homme ! Il est célibataire ?\nNon, il est marié. Et là, c’est sa femme, Fanny.\nMoi, je suis célibataire et heureuse avec mes enfants, en famille monoparentale\n… et nombreuse ! Vive les enfants.',
    questions: [
      lignes('Avec qui parle Nina ?', 'Fatima'),
      lignes('Comment s’appelle le frère de Nina ?', 'Farid'),
      dualQcmTrait('Son frère est …', 'Marié', ['Célibataire', 'Marié', 'Divorcé']),
      lignes('Comment s’appelle la femme du frère de Nina ?', 'Fanny'),
    ],
  },
]

export function buildFamilleExercise(opts: {
  kindId: FamilleKindId
  typeId: string
  rng: Rng
  count: number
}): TcfExercise {
  const { kindId, typeId, rng, count } = opts
  switch (kindId) {
    case 'fam-det': {
      const rows = take(rng, DET_BANK, count)
      return wrap(typeId, 'Choisissez le déterminant possessif correct.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) => {
          const used = new Set<string>([row.answer, ...row.options])
          const third =
            ['Mon', 'Ma', 'Mes', 'Ton', 'Ta', 'Tes', 'Son', 'Sa', 'Ses', 'Notre', 'Nos', 'Votre', 'Vos', 'Leur', 'Leurs'].find(
              (w) => !used.has(w),
            ) ?? 'Ses'
          return dualQcmTrait(row.stem, row.answer, [row.options[0], row.options[1], third])
        }),
      })
    }
    case 'fam-pronoms-1': {
      const rows = PRONOMS_1.slice(0, Math.max(1, Math.min(count, PRONOMS_1.length)))
      return wrap(typeId, 'Complétez les phrases avec les déterminants possessifs.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) =>
          dualQcmTrait(pronomPrompt(row), row.answer, pronomOptions(row.answer)),
        ),
      })
    }
    case 'fam-pronoms-2': {
      const rows = PRONOMS_2.slice(0, Math.max(1, Math.min(count, PRONOMS_2.length)))
      return wrap(typeId, 'Complétez les phrases avec les déterminants possessifs.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: rows.map((row) =>
          dualQcmTrait(pronomPrompt2(row), row.answer, pronomOptions(row.answer)),
        ),
      })
    }
    case 'fam-faire-part': {
      const set = pick(rng, FAIRE_PARTS)
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Lisez le faire-part, puis répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: '', texte: '', image: set.image },
        questions,
      })
    }
    case 'fam-pe': {
      const n = Math.min(Math.max(1, count), 5)
      return wrap(typeId, 'Écrivez cinq phrases sur votre famille.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: PE_MODELE },
        questions: Array.from({ length: n }, () =>
          lignes('', '(phrase libre sur la famille)', 1),
        ),
      })
    }
    case 'fam-arbre': {
      const questions = ARBRE_QUESTIONS.slice(0, Math.max(1, count))
      return wrap(typeId, 'Observez l’arbre généalogique. Vrai ou faux ?', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: 'Famille Lepont', texte: '', image: `${IMG}/arbre-lepont.webp` },
        questions,
      })
    }
    case 'fam-photo': {
      const set = pick(rng, PHOTO_SETS)
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Observez la photo. Complétez les phrases.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: '', texte: '', image: set.image },
        questions,
      })
    }
    case 'fam-recit': {
      const questions = RECIT_QUESTIONS.slice(0, Math.max(1, count))
      return wrap(typeId, 'Lisez le texte, puis répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: 'Ma famille', texte: RECIT_TEXTE, image: null },
        questions,
      })
    }
    case 'fam-email': {
      const questions = EMAIL_QUESTIONS.slice(0, Math.max(1, count))
      return wrap(typeId, 'Lisez le document, puis répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: { titre: '', texte: '', image: `${IMG}/email-inscription.webp` },
        questions,
      })
    }
    case 'fam-co': {
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
  }
}
