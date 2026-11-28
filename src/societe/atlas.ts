import type { ExerciseType } from '@/math/types'
import cantonData from './atlas-cantons.json'
import views from './atlas-images.json'
import { choix, reponse, vraiFaux } from './parcours/questions'
import type { SocieteCanton, SocieteImage, SocieteQuestion } from './types'

const media = '/lib/images/societe/atlas'

const anciensDemiCantons = new Set(['OW', 'NW', 'BS', 'BL', 'AR', 'AI'])

export const CANTONS: SocieteCanton[] = cantonData.map(({ sigle, nom, chefLieu, vue }) => ({
  sigle,
  nom,
  chefLieu,
  ancienDemiCanton: anciensDemiCantons.has(sigle),
  ecusson: `${media}/ecussons/${sigle.toLowerCase()}.webp`,
  vue: `${media}/vues/${vue}.webp`,
}))

type Carte = {
  id: string
  label: string
  image: SocieteImage
  consigne: string
  questions: SocieteQuestion[]
  correction?: SocieteImage
}

function carte(id: string, alt: string, caption: string): SocieteImage {
  return { src: `${media}/${id}.webp`, alt, caption }
}

export const MAPS = {
  muette: carte('cantons-muette', 'Carte muette de la Suisse avec le contour des 26 cantons.', 'Repère les limites des cantons.'),
  sigles: carte('cantons-sigles', 'Carte de la Suisse avec les limites et les sigles des 26 cantons.', 'Chaque sigle représente un canton.'),
  ecussons: carte('cantons-ecussons', 'Carte de la Suisse avec les limites et les écussons des 26 cantons.', 'Chaque écusson représente un canton.'),
  complete: carte('cantons-sigles-ecussons', 'Carte de la Suisse avec les limites, les sigles et les écussons des 26 cantons.', 'Associe chaque sigle à son écusson.'),
}

export const CARTE_ACTIVITES: Carte[] = [
  {
    id: 'societe-cantons-carte-muette',
    label: 'Carte muette · Limites des cantons',
    image: MAPS.muette,
    correction: MAPS.sigles,
    consigne: 'Sur la carte, écris les sigles GE, VD, VS et TI dans leur canton.',
    questions: [],
  },
  {
    id: 'societe-cantons-carte-sigles',
    label: 'Carte avec les sigles',
    image: MAPS.sigles,
    consigne: 'Observe la carte et retrouve les sigles. Utilise la liste des cantons pour vérifier.',
    questions: [
      choix('Quel sigle correspond au Tessin, au sud ?', ['TI', 'TG', 'JU'], 0),
      vraiFaux('Le canton de Vaud et le canton du Valais se touchent.', true),
      reponse('Quel est le sigle du canton dans lequel se trouve Lausanne ?', 'VD.'),
    ],
  },
  {
    id: 'societe-cantons-carte-ecussons',
    label: 'Carte avec les écussons',
    image: MAPS.ecussons,
    correction: MAPS.complete,
    consigne: 'Avec la liste illustrée, retrouve les écussons de Genève, de Berne et du Tessin sur la carte. Entoure-les.',
    questions: [],
  },
  {
    id: 'societe-cantons-carte-sigles-ecussons',
    label: 'Carte avec les sigles et les écussons',
    image: MAPS.complete,
    consigne: 'Observe les écussons et les sigles. Utilise la liste illustrée pour retrouver les chefs-lieux.',
    questions: [
      choix('Quel canton a un ours sur son écusson et le sigle BE ?', ['Berne', 'Bâle-Ville', 'Vaud'], 0),
      reponse('Quel est le chef-lieu du canton VD ?', 'Lausanne.'),
    ],
  },
]

export const LISTE_CANTONS_ID = 'societe-cantons-ecussons-chefs-lieux-atlas'

const GALERIES_DEFS = [
  ['societe-cantons-chefs-lieux-atlas', 'societe-cantons', 'Les 26 chefs-lieux en images', 'chefs-lieux'],
  ['societe-cantons-autres-villes-atlas', 'societe-cantons', 'D’autres villes en images', 'villes'],
  ['societe-eaux-lacs-atlas', 'societe-eaux', 'Les lacs en images', 'lacs'],
  ['societe-eaux-cours-eau-atlas', 'societe-eaux', 'Les cours d’eau en images', 'cours-eau'],
  ['societe-paysages-vues-atlas', 'societe-paysages', 'Les paysages en images', 'paysages'],
] as const

export const GALERIES_ATLAS = GALERIES_DEFS.map(([id, topic, label, group]) => ({
  id,
  topic,
  label,
  vues: views[group],
}))

const fixe: Pick<ExerciseType, 'visual' | 'preferredColumns' | 'preferredCount' | 'maxCount' | 'supportsNumberRange'> = {
  visual: 'texte', preferredColumns: 1, preferredCount: 1, maxCount: 1, supportsNumberRange: false,
}

export const ATLAS_EXERCISE_TYPES: ExerciseType[] = [
  ...CARTE_ACTIVITES.map(({ id, label, consigne }) => ({
    ...fixe, id, topic: 'societe-cantons', label, description: 'Observer les limites et situer les cantons.', instruction: consigne,
  })),
  {
    ...fixe,
    id: LISTE_CANTONS_ID,
    topic: 'societe-cantons',
    label: 'Tableau des cantons et des chefs-lieux',
    description: 'Les 26 cantons avec leur écusson, leur sigle, leur nom et leur chef-lieu.',
    instruction: 'Observe les écussons et retrouve les chefs-lieux.',
  },
  ...GALERIES_ATLAS.map(({ id, topic, label }) => ({
    ...fixe, id, topic, label, description: 'Vues réelles à compléter et repères à observer.', instruction: 'Observe les repères indiqués.',
  })),
]

export function imageVue({ id, nom, alt }: { id: string; nom: string; alt?: string }): SocieteImage {
  return { src: `${media}/vues/${id}.webp`, alt: alt ?? `Vue réaliste à ajouter pour ${nom}.`, caption: nom }
}
