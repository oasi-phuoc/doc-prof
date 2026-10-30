/** Exercices A6 « Dire sa provenance » — tirage déterministe, rendu TCF. */
import { pick, shuffle, type Rng } from '@/math/rng'
import type { TcfChoixTexte, TcfExercise, TcfQuestion } from '@/tcf/types'
import type { GramExerciseKindId } from './kinds'

const CHOICE_IDS = ['a', 'b', 'c'] as const

export const PROVENANCE_KIND_IDS = [
  'prov-pays',
  'prov-prep',
  'prov-verbe',
  'prov-phrases',
] as const satisfies readonly GramExerciseKindId[]

export type ProvenanceKindId = (typeof PROVENANCE_KIND_IDS)[number]

export function isProvenanceKind(kindId: string): kindId is ProvenanceKindId {
  return (PROVENANCE_KIND_IDS as readonly string[]).includes(kindId)
}

export const PROVENANCE_DEFAULT_COUNT: Record<ProvenanceKindId, number> = {
  'prov-pays': 6,
  'prov-prep': 6,
  'prov-verbe': 6,
  'prov-phrases': 4,
}

export function provenanceBankCap(_kindId: ProvenanceKindId): number {
  return PAYS.length
}

export function provenanceFormUi(kindId: string): 'none' | 'header2' | 'margin3' {
  if (kindId === 'prov-pays' || kindId === 'prov-prep' || kindId === 'prov-verbe') return 'header2'
  return 'none'
}

type Prep = 'du' | 'de' | 'd’' | 'des'

type GenrePays = 'masculin' | 'féminin'

type Pays = {
  pays: string
  /** Fichier sous /lib/images/vocabulaire/pays/ */
  slug: string
  prep: Prep
  genre: GenrePays
  m: string
  f: string
}

/** Banque alignée sur les images vocabulaire /pays. */
const PAYS: readonly Pays[] = [
  { pays: 'France', slug: 'france', prep: 'de', genre: 'féminin', m: 'français', f: 'française' },
  { pays: 'Suisse', slug: 'suisse', prep: 'de', genre: 'féminin', m: 'suisse', f: 'suisse' },
  { pays: 'Belgique', slug: 'belgique', prep: 'de', genre: 'féminin', m: 'belge', f: 'belge' },
  { pays: 'Chine', slug: 'chine', prep: 'de', genre: 'féminin', m: 'chinois', f: 'chinoise' },
  { pays: 'Brésil', slug: 'brésil', prep: 'du', genre: 'masculin', m: 'brésilien', f: 'brésilienne' },
  { pays: 'Portugal', slug: 'portugal', prep: 'du', genre: 'masculin', m: 'portugais', f: 'portugaise' },
  { pays: 'Japon', slug: 'japon', prep: 'du', genre: 'masculin', m: 'japonais', f: 'japonaise' },
  { pays: 'Maroc', slug: 'maroc', prep: 'du', genre: 'masculin', m: 'marocain', f: 'marocaine' },
  { pays: 'Canada', slug: 'canada', prep: 'du', genre: 'masculin', m: 'canadien', f: 'canadienne' },
  { pays: 'Sénégal', slug: 'sénégal', prep: 'du', genre: 'masculin', m: 'sénégalais', f: 'sénégalaise' },
  { pays: 'Vietnam', slug: 'vietnam', prep: 'du', genre: 'masculin', m: 'vietnamien', f: 'vietnamienne' },
  { pays: 'Mexique', slug: 'mexique', prep: 'du', genre: 'masculin', m: 'mexicain', f: 'mexicaine' },
  { pays: 'Italie', slug: 'italie', prep: 'd’', genre: 'féminin', m: 'italien', f: 'italienne' },
  { pays: 'Espagne', slug: 'espagne', prep: 'd’', genre: 'féminin', m: 'espagnol', f: 'espagnole' },
  { pays: 'Allemagne', slug: 'allemagne', prep: 'd’', genre: 'féminin', m: 'allemand', f: 'allemande' },
  { pays: 'Autriche', slug: 'autriche', prep: 'd’', genre: 'féminin', m: 'autrichien', f: 'autrichienne' },
  { pays: 'Ukraine', slug: 'ukraine', prep: 'd’', genre: 'féminin', m: 'ukrainien', f: 'ukrainienne' },
  { pays: 'Iran', slug: 'iran', prep: 'd’', genre: 'masculin', m: 'iranien', f: 'iranienne' },
  { pays: 'États-Unis', slug: 'etats-unis', prep: 'des', genre: 'masculin', m: 'américain', f: 'américaine' },
  { pays: 'Pays-Bas', slug: 'pays-bas', prep: 'des', genre: 'masculin', m: 'néerlandais', f: 'néerlandaise' },
]

type PersonneVue = {
  id: string
  /** Image personne (vocabulaire famille-personnes). */
  image: string
  sujet: string
  venir: string
  etre: string
  /** Accorde l’adjectif de nationalité. */
  adj: (p: Pays) => string
}

const PERSONNES: readonly PersonneVue[] = [
  {
    id: 'f-sg',
    image: '/lib/images/vocabulaire/famille-personnes/femme.webp',
    sujet: 'Elle',
    venir: 'vient',
    etre: 'est',
    adj: (p) => p.f,
  },
  {
    id: 'f-pl',
    image: '/lib/images/vocabulaire/famille-personnes/collègues.webp',
    sujet: 'Elles',
    venir: 'viennent',
    etre: 'sont',
    adj: (p) => pluralAdj(p.f),
  },
  {
    id: 'm-sg',
    image: '/lib/images/vocabulaire/famille-personnes/homme.webp',
    sujet: 'Il',
    venir: 'vient',
    etre: 'est',
    adj: (p) => p.m,
  },
  {
    id: 'm-pl',
    image: '/lib/images/vocabulaire/famille-personnes/jumeaux.webp',
    sujet: 'Ils',
    venir: 'viennent',
    etre: 'sont',
    adj: (p) => pluralAdj(p.m),
  },
]

const PREPS: Prep[] = ['du', 'de', 'd’', 'des']

const VERBE_FORMES = ['viens', 'vient', 'venons', 'venez', 'viennent', 'vais', 'aller'] as const

function pluralAdj(adj: string): string {
  if (/[sx]$/i.test(adj)) return adj
  if (/al$/i.test(adj)) return `${adj.slice(0, -2)}aux`
  return `${adj}s`
}

function paysImage(slug: string): string {
  return `/lib/images/vocabulaire/pays/${slug}.webp`
}

function takePays(rng: Rng, count: number): Pays[] {
  const n = Math.min(Math.max(1, count), PAYS.length)
  return shuffle(rng, [...PAYS]).slice(0, n)
}

function distractorPays(rng: Rng, correct: Pays, n: number): Pays[] {
  const pool = PAYS.filter((p) => p.pays !== correct.pays)
  return shuffle(rng, [...pool]).slice(0, n)
}

function dualQcmTrait(enonce: string, answer: string, options: string[], image?: string): TcfQuestion {
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
    image,
    formes: {
      lignes: { nb_lignes: inline ? 0 : 1, reponse_modele: answer },
    },
  }
}

function wrap(typeId: string, consigne: string, exercise: TcfExercise): TcfExercise {
  return { ...exercise, id: `gram-${typeId}`, consigne }
}

export function buildProvenanceExercise(opts: {
  kindId: ProvenanceKindId
  typeId: string
  rng: Rng
  count: number
}): TcfExercise {
  const { kindId, typeId, rng, count } = opts
  const rows = takePays(rng, count)

  switch (kindId) {
    case 'prov-pays': {
      const questions = rows.map((p) => {
        const distractors = distractorPays(rng, p, 2).map((d) => d.pays)
        const options = shuffle(rng, [p.pays, ...distractors])
        return dualQcmTrait('Je viens de', p.pays, options, paysImage(p.slug))
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
    case 'prov-prep': {
      const questions = rows.map((p) => {
        const wrong = shuffle(
          rng,
          PREPS.filter((prep) => prep !== p.prep),
        ).slice(0, 2)
        const options = shuffle(rng, [p.prep, ...wrong])
        return dualQcmTrait(
          `Je viens ___ ${p.pays} (${p.genre}).`,
          p.prep,
          options,
        )
      })
      return wrap(typeId, 'Choisissez la bonne préposition.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'prov-verbe': {
      const sujets: Array<{ sujet: string; forme: string }> = [
        { sujet: 'Je', forme: 'viens' },
        { sujet: 'Tu', forme: 'viens' },
        { sujet: 'Il', forme: 'vient' },
        { sujet: 'Elle', forme: 'vient' },
        { sujet: 'Nous', forme: 'venons' },
        { sujet: 'Vous', forme: 'venez' },
        { sujet: 'Ils', forme: 'viennent' },
        { sujet: 'Elles', forme: 'viennent' },
      ]
      const questions = rows.map((p) => {
        const slot = pick(rng, sujets)
        const wrong = shuffle(
          rng,
          VERBE_FORMES.filter((f) => f !== slot.forme),
        ).slice(0, 2)
        const options = shuffle(rng, [slot.forme, ...wrong])
        return dualQcmTrait(`${slot.sujet} ___ ${p.prep} ${p.pays}.`, slot.forme, options)
      })
      return wrap(typeId, 'Conjuguez le verbe venir.', {
        id: '',
        niveau: 'A1-A2',
        competence: 'CO',
        type_exercice: 'complet',
        support: { audio: '', transcription: '' },
        questions,
      })
    }
    case 'prov-phrases': {
      const picks = takePays(rng, Math.max(1, count))
      const questions = picks.map((p) => {
        const person = pick(rng, PERSONNES)
        const answer = `${person.sujet} ${person.venir} ${p.prep} ${p.pays}. ${person.sujet} ${person.etre} ${person.adj(p)}.`
        return {
          enonce: 'Écrivez deux phrases.',
          type_reponse: 'lignes' as const,
          nb_lignes: 2,
          reponse_modele: answer,
          image: person.image,
          images: [person.image, paysImage(p.slug)],
        }
      })
      return wrap(
        typeId,
        'Observez les images. Écrivez deux phrases (venir de + nationalité).\nExemple : Elles viennent de France. Elles sont françaises.',
        {
          id: '',
          niveau: 'A1-A2',
          competence: 'CO',
          type_exercice: 'complet',
          support: { audio: '', transcription: '' },
          questions,
        },
      )
    }
  }
}
