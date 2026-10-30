/** Exercices A3 « Adjectifs de nationalité » — tirage déterministe, rendu TCF. */
import { pick, shuffle, type Rng } from '@/math/rng'
import type {
  TcfChoixImage,
  TcfChoixTexte,
  TcfExercise,
  TcfQuestion,
  TcfQuestionLignes,
} from '@/tcf/types'
import type { GramExerciseKindId } from './kinds'

const CHOICE_IDS = ['a', 'b', 'c'] as const

/** Audio CSC_FR_LECON-01_03.01_AUDIO-3 — à déposer sous ce chemin. */
export const NAT_CO_ALI_AUDIO = '/lib/audio/grammaire/presenter/lecon-01-03-01-audio-3.mp3'

export const NATIONALITE_KIND_IDS = [
  'nat-image',
  'nat-feminin',
  'nat-masculin',
  'nat-pluriel',
  'nat-accorder',
  'nat-co',
] as const satisfies readonly GramExerciseKindId[]

export type NationaliteKindId = (typeof NATIONALITE_KIND_IDS)[number]

export function isNationaliteKind(kindId: string): kindId is NationaliteKindId {
  return (NATIONALITE_KIND_IDS as readonly string[]).includes(kindId)
}

export const NATIONALITE_DEFAULT_COUNT: Record<NationaliteKindId, number> = {
  'nat-image': 6,
  'nat-feminin': 6,
  'nat-masculin': 6,
  'nat-pluriel': 6,
  'nat-accorder': 6,
  'nat-co': 4,
}

export function nationaliteBankCap(kindId: NationaliteKindId): number {
  if (kindId === 'nat-co') return NAT_CO_ALI_QUESTIONS.length
  return NATIONALITES.length
}

export function nationaliteFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (kindId === 'nat-image') return 'header2'
  if (kindId === 'nat-co') return 'margin3'
  return 'none'
}

type Nationalite = {
  m: string
  f: string
  pays: string
  dePays: string
}

/** Banque alignée sur les images vocabulaire /presenter. */
const NATIONALITES: readonly Nationalite[] = [
  { m: 'afghan', f: 'afghane', pays: 'Afghanistan', dePays: 'd’Afghanistan' },
  { m: 'allemand', f: 'allemande', pays: 'Allemagne', dePays: 'd’Allemagne' },
  { m: 'américain', f: 'américaine', pays: 'États-Unis', dePays: 'des États-Unis' },
  { m: 'anglais', f: 'anglaise', pays: 'Angleterre', dePays: 'd’Angleterre' },
  { m: 'autrichien', f: 'autrichienne', pays: 'Autriche', dePays: 'd’Autriche' },
  { m: 'belge', f: 'belge', pays: 'Belgique', dePays: 'de Belgique' },
  { m: 'canadien', f: 'canadienne', pays: 'Canada', dePays: 'du Canada' },
  { m: 'chinois', f: 'chinoise', pays: 'Chine', dePays: 'de Chine' },
  { m: 'espagnol', f: 'espagnole', pays: 'Espagne', dePays: 'd’Espagne' },
  { m: 'français', f: 'française', pays: 'France', dePays: 'de France' },
  { m: 'grec', f: 'grecque', pays: 'Grèce', dePays: 'de Grèce' },
  { m: 'indien', f: 'indienne', pays: 'Inde', dePays: 'd’Inde' },
  { m: 'iranien', f: 'iranienne', pays: 'Iran', dePays: 'd’Iran' },
  { m: 'italien', f: 'italienne', pays: 'Italie', dePays: 'd’Italie' },
  { m: 'japonais', f: 'japonaise', pays: 'Japon', dePays: 'du Japon' },
  { m: 'marocain', f: 'marocaine', pays: 'Maroc', dePays: 'du Maroc' },
  { m: 'portugais', f: 'portugaise', pays: 'Portugal', dePays: 'du Portugal' },
  { m: 'russe', f: 'russe', pays: 'Russie', dePays: 'de Russie' },
  { m: 'suisse', f: 'suisse', pays: 'Suisse', dePays: 'de Suisse' },
  { m: 'syrien', f: 'syrienne', pays: 'Syrie', dePays: 'de Syrie' },
  { m: 'turc', f: 'turque', pays: 'Turquie', dePays: 'de Turquie' },
  { m: 'ukrainien', f: 'ukrainienne', pays: 'Ukraine', dePays: 'd’Ukraine' },
  { m: 'sénégalais', f: 'sénégalaise', pays: 'Sénégal', dePays: 'du Sénégal' },
  { m: 'brésilien', f: 'brésilienne', pays: 'Brésil', dePays: 'du Brésil' },
  { m: 'coréen', f: 'coréenne', pays: 'Corée', dePays: 'de Corée' },
  { m: 'mexicain', f: 'mexicaine', pays: 'Mexique', dePays: 'du Mexique' },
  { m: 'polonais', f: 'polonaise', pays: 'Pologne', dePays: 'de Pologne' },
  { m: 'suédois', f: 'suédoise', pays: 'Suède', dePays: 'de Suède' },
  { m: 'tunisien', f: 'tunisienne', pays: 'Tunisie', dePays: 'de Tunisie' },
  { m: 'vietnamien', f: 'vietnamienne', pays: 'Vietnam', dePays: 'du Vietnam' },
]

function imageSrc(adj: string): string {
  return `/lib/images/vocabulaire/presenter/${adj}.webp`
}

function pluralOf(adj: string): string {
  if (/[sx]$/i.test(adj)) return adj
  if (/al$/i.test(adj)) return `${adj.slice(0, -2)}aux`
  return `${adj}s`
}

function takeNats(rng: Rng, count: number): Nationalite[] {
  const n = Math.min(Math.max(1, count), NATIONALITES.length)
  return shuffle(rng, [...NATIONALITES]).slice(0, n)
}

/** Leurres : mauvais accord + faute d’orthographe. */
function spellingOptions(correct: string, otherForm: string, rng: Rng): string[] {
  const wrongAgree =
    otherForm !== correct
      ? otherForm
      : pluralOf(correct) !== correct
        ? pluralOf(correct)
        : `${correct}s`
  const misspell = misspellOnce(correct, rng)
  const pool = [correct, wrongAgree, misspell].filter(
    (v, i, arr) => v.trim().length > 0 && arr.indexOf(v) === i,
  )
  while (pool.length < 3) {
    const extra = misspellOnce(correct, rng)
    if (!pool.includes(extra)) pool.push(extra)
    else pool.push(`${correct}e`)
  }
  return shuffle(rng, pool.slice(0, 3))
}

function misspellOnce(word: string, rng: Rng): string {
  const variants: string[] = []
  if (word.includes('ç')) variants.push(word.replace(/ç/g, 'c'))
  if (word.includes('é')) variants.push(word.replace(/é/g, 'e'))
  if (word.includes('è')) variants.push(word.replace(/è/g, 'e'))
  if (word.endsWith('aise')) variants.push(`${word.slice(0, -4)}aice`)
  if (word.endsWith('ais')) variants.push(`${word.slice(0, -1)}oi`)
  if (word.endsWith('ien')) variants.push(`${word.slice(0, -3)}ienn`)
  if (word.endsWith('ienne')) variants.push(`${word.slice(0, -5)}iene`)
  if (word.endsWith('ais') || word.endsWith('ois')) variants.push(`${word}e`)
  if (word.length > 4) {
    const i = Math.min(word.length - 2, 2 + (word.length % 3))
    variants.push(`${word.slice(0, i)}${word.slice(i + 1)}`)
    variants.push(`${word.slice(0, i)}x${word.slice(i)}`)
  }
  const uniq = variants.filter((v) => v !== word && v.length > 2)
  if (uniq.length) return pick(rng, uniq)
  return `${word.slice(0, -1)}a${word.slice(-1)}`
}

function fillQuestion(
  enonce: string,
  answer: string,
  options: string[],
  preferQcm: boolean,
  image?: string,
): TcfQuestion {
  const inline = /_{3,}/.test(enonce)
  const lignesForme = {
    nb_lignes: inline ? (0 as const) : (1 as const),
    reponse_modele: answer,
  }
  const choix = options.slice(0, 3).map((texte, index) => ({
    id: CHOICE_IDS[index] ?? `c${index}`,
    texte,
    correct: texte === answer,
  }))
  const base = image ? { image } : {}
  if (preferQcm) {
    return {
      enonce,
      type_reponse: 'qcm_texte',
      melanger: true,
      choix,
      formes: { lignes: lignesForme },
      ...base,
    }
  }
  return {
    enonce,
    type_reponse: 'lignes',
    ...lignesForme,
    formes: { qcm_texte: { melanger: true, choix } },
    ...base,
  }
}

function dualQcmTrait(
  enonce: string,
  answer: string,
  options: string[],
  imageChoices?: TcfChoixImage[],
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
    melanger: true,
    choix,
    formes: {
      lignes: { nb_lignes: inline ? 0 : 1, reponse_modele: answer },
      ...(imageChoices?.length
        ? { qcm_image: { melanger: true, choix: imageChoices } }
        : {}),
    },
  }
}

/**
 * CO Ali — questions fixes (QCM + trait + image).
 * Audio à déposer : CSC_FR_LECON-01_03.01_AUDIO-3 → {@link NAT_CO_ALI_AUDIO}.
 */
const NAT_CO_ALI_QUESTIONS: TcfQuestion[] = [
  dualQcmTrait('D’où vient Ali ?', 'Je ne sais pas', [
    'Marseille',
    'Sénégal',
    'Je ne sais pas',
  ]),
  dualQcmTrait('Où Ali habite-t-il ?', 'Paris', ['Marseille', 'Paris', 'Mali']),
  dualQcmTrait(
    'Comment il est allé en France ?',
    'À pied',
    ['En bateau', 'En voiture', 'À pied'],
    [
      {
        id: 'a',
        image: '/lib/images/vocabulaire/transports/bateau.webp',
        correct: false,
      },
      {
        id: 'b',
        image: '/lib/images/vocabulaire/transports/voiture.webp',
        correct: false,
      },
      {
        id: 'c',
        image: '/lib/images/vocabulaire/actions/rentrer-a-pied.webp',
        correct: true,
      },
    ],
  ),
  dualQcmTrait(
    'Ali a traversé le Mali, le Sénégal et ___ ?',
    'Le Maroc',
    ['Le Maroc', 'L’Italie', 'La Suisse'],
    [
      {
        id: 'a',
        image: '/lib/images/vocabulaire/pays/maroc.webp',
        correct: true,
      },
      {
        id: 'b',
        image: '/lib/images/vocabulaire/pays/italie.webp',
        correct: false,
      },
      {
        id: 'c',
        image: '/lib/images/vocabulaire/pays/suisse.webp',
        correct: false,
      },
    ],
  ),
]

const NAT_CO_ALI_TRANSCRIPTION = [
  'Léon :\tAli est arrivé à Marseille à l’âge de 14 ans',
  'Nina :\tAh !',
  'Léon :\tAli a traversé le Mali, le Sénégal, le Maroc, la France à pied !',
  'Nina :\tAh ! Vous habitez à Paris Ali ?',
  'Ali :\tOui, madame, voilà l’adresse.',
].join('\n')

function lignes(enonce: string, modele: string, nb = 1): TcfQuestionLignes {
  return { enonce, type_reponse: 'lignes', nb_lignes: nb, reponse_modele: modele }
}

function wrap(typeId: string, consigne: string, exercise: TcfExercise): TcfExercise {
  return { ...exercise, id: `gram-${typeId}`, consigne }
}

function sujetPronoms(genre: 'm' | 'f'): { sg: string; pl: string; etreSg: string; etrePl: string } {
  if (genre === 'f') {
    return { sg: 'Elle', pl: 'Elles', etreSg: 'est', etrePl: 'sont' }
  }
  return { sg: 'Il', pl: 'Ils', etreSg: 'est', etrePl: 'sont' }
}

export function buildNationaliteExercise(opts: {
  kindId: NationaliteKindId
  typeId: string
  rng: Rng
  count: number
}): TcfExercise {
  const { kindId, typeId, rng, count } = opts
  const rows = takeNats(rng, count)

  switch (kindId) {
    case 'nat-co': {
      const questions = NAT_CO_ALI_QUESTIONS.slice(
        0,
        Math.min(Math.max(1, count), NAT_CO_ALI_QUESTIONS.length),
      ).map((q) => ({ ...q }))
      // Tirage déterministe : ordre des questions fixe ; mélange des choix via melanger.
      void rng
      return wrap(typeId, 'Écoutez et répondez aux questions.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: {
          audio: NAT_CO_ALI_AUDIO,
          transcription: NAT_CO_ALI_TRANSCRIPTION,
        },
        questions,
      })
    }
    case 'nat-image': {
      const questions = rows.map((nat) => {
        const fem = rng() < 0.5
        const answer = fem ? nat.f : nat.m
        const other = fem ? nat.m : nat.f
        const options = spellingOptions(answer, other === answer ? pluralOf(answer) : other, rng)
        return fillQuestion('Je suis', answer, options, true, imageSrc(answer))
      })
      return wrap(typeId, 'Observez l’image. Complétez la phrase.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'nat-feminin': {
      const questions = rows.map((nat) => {
        const { sg, etreSg } = sujetPronoms('m')
        const prompt = `${sg} ${etreSg} ${nat.m}.`
        const { sg: sgF, etreSg: etreF } = sujetPronoms('f')
        const answer = `${sgF} ${etreF} ${nat.f}.`
        return lignes(prompt, answer, 1)
      })
      return wrap(typeId, 'Mettez la phrase au féminin.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'nat-masculin': {
      const questions = rows.map((nat) => {
        const { sg, etreSg } = sujetPronoms('f')
        const prompt = `${sg} ${etreSg} ${nat.f}.`
        const { sg: sgM, etreSg: etreM } = sujetPronoms('m')
        const answer = `${sgM} ${etreM} ${nat.m}.`
        return lignes(prompt, answer, 1)
      })
      return wrap(typeId, 'Mettez la phrase au masculin.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'nat-pluriel': {
      const questions = rows.map((nat) => {
        const fem = rng() < 0.5
        const adj = fem ? nat.f : nat.m
        const { sg, pl, etreSg, etrePl } = sujetPronoms(fem ? 'f' : 'm')
        const prompt = `${sg} ${etreSg} ${adj}.`
        const answer = `${pl} ${etrePl} ${pluralOf(adj)}.`
        return lignes(prompt, answer, 1)
      })
      return wrap(typeId, 'Mettez la phrase au pluriel.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'nat-accorder': {
      const frames: Array<(nat: Nationalite) => { prompt: string; answer: string }> = [
        (nat) => ({
          prompt: `Nous venons ${nat.dePays}, nous sommes ___.`,
          answer: pluralOf(nat.m),
        }),
        (nat) => ({
          prompt: `Ils viennent ${nat.dePays}, ils sont ___.`,
          answer: pluralOf(nat.m),
        }),
        (nat) => ({
          prompt: `Elles viennent ${nat.dePays}, elles sont ___.`,
          answer: pluralOf(nat.f),
        }),
        (nat) => ({
          prompt: `Il vient ${nat.dePays}, il est ___.`,
          answer: nat.m,
        }),
        (nat) => ({
          prompt: `Elle vient ${nat.dePays}, elle est ___.`,
          answer: nat.f,
        }),
        (nat) => ({
          prompt: `Je viens ${nat.dePays}, je suis ___ (masculin).`,
          answer: nat.m,
        }),
        (nat) => ({
          prompt: `Je viens ${nat.dePays}, je suis ___ (féminin).`,
          answer: nat.f,
        }),
        (nat) => ({
          prompt: `Vous venez ${nat.dePays}, vous êtes ___.`,
          answer: pluralOf(nat.m),
        }),
      ]
      const questions = rows.map((nat) => {
        const frame = pick(rng, frames)
        const { prompt, answer } = frame(nat)
        const distractors = [
          answer,
          answer === nat.m ? nat.f : nat.m,
          pluralOf(answer === nat.m ? nat.f : nat.m),
        ].filter((v, i, arr) => arr.indexOf(v) === i)
        while (distractors.length < 3) distractors.push(misspellOnce(answer, rng))
        return fillQuestion(prompt, answer, shuffle(rng, distractors.slice(0, 3)), true)
      })
      return wrap(typeId, 'Accordez l’adjectif de nationalité correctement.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
  }
}
