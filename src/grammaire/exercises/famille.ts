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
import { buildFamilyReading } from './family-reading'

const CHOICE_IDS = ['a', 'b', 'c'] as const

export const FAMILLE_KIND_IDS = [
  'fam-det',
  'fam-faire-part',
  'fam-photo',
  'fam-recit',
  'fam-email',
  'fam-co',
  'fam-pe',
] as const satisfies readonly GramExerciseKindId[]

export type FamilleKindId = (typeof FAMILLE_KIND_IDS)[number] | 'fam-pronoms-1' | 'fam-pronoms-2'

export function isFamilleKind(kindId: string): kindId is FamilleKindId {
  return (FAMILLE_KIND_IDS as readonly string[]).includes(kindId) || kindId === 'fam-pronoms-1' || kindId === 'fam-pronoms-2'
}

export const FAMILLE_DEFAULT_COUNT: Record<FamilleKindId, number> = {
  'fam-det': 8,
  'fam-pronoms-1': 7,
  'fam-pronoms-2': 8,
  'fam-faire-part': 6,
  'fam-pe': 1,
  'fam-photo': 5,
  'fam-recit': 5,
  'fam-email': 5,
  'fam-co': 6,
}

export function familleBankCap(kindId: FamilleKindId): number {
  switch (kindId) {
    case 'fam-det':
      return DET_BANK.length + PRONOMS_1.length + PRONOMS_2.length
    case 'fam-pronoms-1':
      return PRONOMS_1.length
    case 'fam-pronoms-2':
      return PRONOMS_2.length
    case 'fam-faire-part':
      return FAIRE_PARTS[0]!.questions.length
    case 'fam-pe':
      return 1
    case 'fam-photo':
      return PHOTO_QUESTIONS.length
    case 'fam-recit':
      return 5
    case 'fam-email':
      return 5
    case 'fam-co':
      return Math.max(...CO_SETS.map((s) => s.questions.length))
  }
}

export function familleFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (
    kindId === 'fam-det' ||
    kindId === 'fam-pronoms-1' ||
    kindId === 'fam-pronoms-2' ||
    kindId === 'fam-faire-part'
  ) {
    return 'header2'
  }
  if (
    kindId === 'fam-photo' ||
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
  nom: string
  lignes: Array<{ label: string; valeur: string }>
  questions: TcfQuestion[]
}

const FAIRE_PARTS: FairePart[] = [
  {
    slug: 'jackie',
    nom: 'Jackie',
    lignes: [
      { label: 'Parents', valeur: 'Olivier et Natasha' },
      { label: 'Frère', valeur: 'Sébastien' },
      { label: 'Sœur', valeur: 'Marion' },
      { label: 'Grands-parents', valeur: 'Marc et Catherine' },
    ],
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
    nom: 'Lucas',
    lignes: [
      { label: 'Parents', valeur: 'Julie et Thomas' },
      { label: 'Frère', valeur: 'Noah' },
      { label: 'Sœur', valeur: 'Emma' },
      { label: 'Grands-parents', valeur: 'Paul et Anne' },
    ],
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
    nom: 'Sara',
    lignes: [
      { label: 'Parents', valeur: 'Leila et Samir' },
      { label: 'Frère', valeur: 'Karim' },
      { label: 'Sœur', valeur: 'Layla' },
      { label: 'Grands-parents', valeur: 'Hassan et Fatima' },
    ],
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
    nom: 'Léo',
    lignes: [
      { label: 'Parents', valeur: 'Marie et David' },
      { label: 'Sœur', valeur: 'Chloé' },
      { label: 'Grands-parents', valeur: 'Jean et Claire' },
    ],
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
    nom: 'Mina',
    lignes: [
      { label: 'Parents', valeur: 'Nadia et Youssef' },
      { label: 'Frère', valeur: 'Adam' },
      { label: 'Sœur', valeur: 'Yasmine' },
      { label: 'Grands-parents', valeur: 'Amira et Rachid' },
    ],
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

const PE_MODELE = 'Je m’appelle Léa. Dans ma famille, nous sommes cinq personnes. Mes parents s’appellent Julie et Thomas. J’ai un frère et une sœur. Mon frère s’appelle Noah et ma sœur s’appelle Emma. Mes grands-parents habitent près de chez nous. Nous aimons manger ensemble le dimanche.'

/** Portraits en réserve : pas de fichier image, seulement le personnage à illustrer plus tard. */
const PHOTO_PORTRAITS = [
  { nom: 'Karim', legende: 'Homme adulte, en pied, fond blanc' },
  { nom: 'Nadia', legende: 'Femme adulte, en pied, fond blanc' },
  { nom: 'Yanis', legende: 'Garçon, en pied, fond blanc' },
  { nom: 'Lina', legende: 'Fille, en pied, fond blanc' },
  { nom: 'Aïcha', legende: 'Grand-mère, en pied, fond blanc' },
  { nom: 'Ahmed', legende: 'Grand-père, en pied, fond blanc' },
] as const

const PHOTO_QUESTIONS: TcfQuestion[] = [
  dualQcmTrait('Karim est le ___ de Lina.', 'père', ['père', 'frère', 'cousin']),
  dualQcmTrait('Nadia est la ___ de Yanis.', 'mère', ['mère', 'tante', 'sœur']),
  dualQcmTrait('Lina est la ___ de Yanis.', 'sœur', ['sœur', 'cousine', 'mère']),
  dualQcmTrait('Ahmed est le ___ de Lina.', 'grand-père', ['grand-père', 'père', 'oncle']),
  dualQcmTrait('Aïcha est la ___ de Yanis.', 'grand-mère', ['grand-mère', 'mère', 'tante']),
]


// —— CO ——

type CoSet = {
  id: string
  audio: string
  questions: TcfQuestion[]
}

const CO_SETS: CoSet[] = [
  {
    id: 'audio-1-vf',
    audio: '',
    questions: [
      vf('Duprès c’est le nom de son père.', false),
      vf('Sa mère est française.', true),
      vf('Sa mère habite à Fugère.', true),
      vf('Ses deux sœurs sont infirmières.', false),
      vf('Son fils Thomas a dix ans.', false),
      vf('Thomas parle trois langues.', false),
    ],
  },
  {
    id: 'audio-2-lettres',
    audio: '',
    questions: [
      lignes('Sa ___ est musicienne.', 'femme', 0, 'a'),
      lignes('Leur tante a trois ___.', 'enfants', 0, 'b'),
      lignes('Votre ___ est professeur ?', 'oncle', 0, 'c'),
      lignes('Nos ___ ont 50 ans.', 'parents', 0, 'd'),
    ],
  },
  {
    id: 'audio-3-fabien',
    audio: '',
    questions: [
      dualQcmTrait('Fabien est ___.', 'un ami', ['un ami', 'une amie']),
      dualQcmTrait('Fabien est ___.', 'étudiant', ['professeur', 'étudiant']),
      dualQcmTrait('Simon est ___.', 'le père', ['le père', 'le frère']),
      dualQcmTrait('Flavie est ___ de Sébastien.', 'la mère', ['l’amie', 'la mère']),
      dualQcmTrait('Sébastien est ___.', 'le frère', ['le père', 'le frère']),
      dualQcmTrait('Sébastien est ___.', 'brun', ['blond', 'brun']),
    ],
  },
  {
    id: 'audio-4-photo',
    audio: '',
    questions: [
      vf('On parle d’une photo de mariage.', false),
      vf('La personne qui parle est sur la photo.', true),
      vf('Elle est blonde.', true),
      vf('Thomas est le père.', false),
      vf('C’est le petit blond.', false),
      vf('Thomas est veuf.', true),
    ],
  },
  {
    id: 'audio-5-familles',
    audio: '',
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
    audio: '',
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
      const bank = [
        ...DET_BANK.map((row) => {
          const used = new Set<string>([row.answer, ...row.options])
          const third =
            ['Mon', 'Ma', 'Mes', 'Ton', 'Ta', 'Tes', 'Son', 'Sa', 'Ses', 'Notre', 'Nos', 'Votre', 'Vos', 'Leur', 'Leurs'].find(
              (word) => !used.has(word),
            ) ?? 'Ses'
          return dualQcmTrait(row.stem, row.answer, [...row.options, third])
        }),
        ...PRONOMS_1.map((row) => dualQcmTrait(pronomPrompt(row), row.answer, pronomOptions(row.answer))),
        ...PRONOMS_2.map((row) => dualQcmTrait(pronomPrompt2(row), row.answer, pronomOptions(row.answer))),
      ]
      return wrap(typeId, 'Complétez les phrases avec les déterminants possessifs.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions: take(rng, bank, count),
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
      const set = FAIRE_PARTS.find((part) => part.slug === 'lucas')!
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Lisez le faire-part, puis répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: {
          titre: '',
          texte: '',
          image: null,
          presentation: 'portrait',
          fiche: { nom: set.nom, lignes: set.lignes },
        },
        questions,
      })
    }
    case 'fam-pe': {
      return wrap(typeId, 'Lisez la consigne et rédigez votre texte.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'PE',
        type_exercice: 'question_texte',
        support: {
          consigne: 'Présentez votre famille en cinq phrases ou plus. Parlez de vos parents, de vos frères et sœurs ou d’autres personnes de votre famille. Dites comment ils s’appellent et ce que vous aimez faire ensemble. (40 mots minimum)',
          nb_mots: { min: 40 },
          reponse_modele: PE_MODELE,
          numeroter_lignes: true,
        },
        questions: [],
      })
    }
    case 'fam-photo': {
      const questions = PHOTO_QUESTIONS.slice(0, Math.max(1, Math.min(count, PHOTO_QUESTIONS.length)))
      return wrap(typeId, 'Observez les portraits, puis répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CE',
        type_exercice: 'annonce',
        support: {
          titre: '',
          texte: '',
          image: null,
          presentation: 'portraits',
          portraits: PHOTO_PORTRAITS.map((person) => ({ nom: person.nom, legende: person.legende })),
        },
        questions,
      })
    }
    case 'fam-recit':
      return buildFamilyReading({ typeId, rng, count })
    case 'fam-email':
      return buildFamilyReading({ typeId, rng, count, messages: true })
    case 'fam-co': {
      const set = pick(rng, CO_SETS)
      const questions = set.questions.slice(0, Math.max(1, count))
      return wrap(typeId, 'Écoutez et répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: set.audio, transcription: '' },
        questions,
      })
    }
  }
}
