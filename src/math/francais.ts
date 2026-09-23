import { pick, type Rng } from './rng'
import type { MathItem } from './types'

const ETRE: Array<[string, string]> = [
  ['Je ___ étudiant.', 'suis'],
  ['Tu ___ à la maison.', 'es'],
  ['Il ___ fatigué.', 'est'],
  ['Elle ___ suisse.', 'est'],
  ['Nous ___ en classe.', 'sommes'],
  ['Vous ___ prêts.', 'êtes'],
  ['Ils ___ contents.', 'sont'],
  ['Elles ___ à Genève.', 'sont'],
]

const AVOIR: Array<[string, string]> = [
  ['J’___ vingt ans.', 'ai'],
  ['Tu ___ un frère.', 'as'],
  ['Il ___ faim.', 'a'],
  ['Elle ___ une sœur.', 'a'],
  ['Nous ___ cours à huit heures.', 'avons'],
  ['Vous ___ raison.', 'avez'],
  ['Ils ___ deux enfants.', 'ont'],
  ['Elles ___ soif.', 'ont'],
]

const ARTICLES: Array<[string, string, string[]]> = [
  ['___ table est grande.', 'La', ['La', 'Le', 'Les']],
  ['Je vois ___ homme.', 'un', ['un', 'une', 'des']],
  ['___ enfants jouent.', 'Les', ['Le', 'La', 'Les']],
  ['Elle achète ___ pomme.', 'une', ['un', 'une', 'des']],
  ['Nous prenons ___ eau.', 'de l’', ['du', 'de la', 'de l’']],
  ['Il mange ___ pain.', 'du', ['du', 'de la', 'des']],
]

const POSSESSIFS: Array<[string, string]> = [
  ['C’est ___ livre. (je)', 'mon'],
  ['Voici ___ sœur. (tu)', 'ta'],
  ['___ parents habitent ici. (nous)', 'Nos'],
  ['Elle range ___ affaires. (elle)', 'ses'],
  ['___ maison est petite. (vous)', 'Votre'],
  ['Ils aiment ___ travail. (ils)', 'leur'],
]

const VERBES_ER: Array<[string, string]> = [
  ['Je ___ (parler) français.', 'parle'],
  ['Tu ___ (habiter) à Sion.', 'habites'],
  ['Nous ___ (écouter) la radio.', 'écoutons'],
  ['Vous ___ (regarder) le tableau.', 'regardez'],
  ['Ils ___ (travailler) le matin.', 'travaillent'],
  ['Elle ___ (aimer) le thé.', 'aime'],
]

const NEGATION: Array<[string, string]> = [
  ['Je ___ mange pas de viande.', 'ne'],
  ['Il ne parle ___.', 'pas'],
  ['Nous n’___ pas de voiture.', 'avons'],
  ['Elle ne ___ pas ici.', 'habite'],
  ['Tu ___ es pas en retard.', 'n’'],
  ['Ils ne travaillent ___.', 'pas'],
]

const FAMILLE: Array<[string, string]> = [
  ['Le père de mon père est mon ___.', 'grand-père'],
  ['La sœur de ma mère est ma ___.', 'tante'],
  ['Le fils de mon frère est mon ___.', 'neveu'],
  ['La femme de mon fils est ma ___.', 'belle-fille'],
  ['Les parents de mes parents sont mes ___.', 'grands-parents'],
  ['Le frère de mon père est mon ___.', 'oncle'],
]

const LOGEMENT: Array<[string, string, string[]]> = [
  ['On dort dans la ___.', 'chambre', ['chambre', 'cuisine', 'cave']],
  ['On prépare le repas dans la ___.', 'cuisine', ['cuisine', 'garage', 'balcon']],
  ['On se lave dans la ___.', 'salle de bain', ['salle de bain', 'cave', 'grenier']],
  ['L’___ mène à l’étage.', 'escalier', ['escalier', 'évier', 'oreiller']],
]

const VETEMENTS: Array<[string, string]> = [
  ['On met un ___ quand il fait froid.', 'manteau'],
  ['Les ___ protègent les pieds.', 'chaussures'],
  ['Un ___ se porte sur une chemise.', 'pull'],
  ['Une ___ couvre les jambes.', 'jupe'],
]

const PRESENTATION: Array<[string, string]> = [
  ['Bonjour, je ___ Léa.', 'm’appelle'],
  ['Je ___ de Sion.', 'viens'],
  ['J’___ vingt-huit ans.', 'ai'],
  ['Je ___ formatrice.', 'suis'],
  ['Enchanté, et vous, comment vous ___-vous ?', 'appelez'],
]

const INVITER: Array<[string, string]> = [
  ['Tu ___ venir samedi ?', 'veux'],
  ['La fête ___ à dix-neuf heures.', 'commence'],
  ['Je t’___ chez moi.', 'invite'],
  ['Tu ___ un gâteau ?', 'apportes'],
]

const NOMBRES: Array<{ src: string; answer: string }> = [
  { src: '/audio/nombres/dizaine/10.mp3', answer: '10' },
  { src: '/audio/nombres/dizaine/20.mp3', answer: '20' },
  { src: '/audio/nombres/dizaine/30.mp3', answer: '30' },
  { src: '/audio/nombres/dizaine/40.mp3', answer: '40' },
  { src: '/audio/nombres/dizaine/50.mp3', answer: '50' },
  { src: '/audio/nombres/centaine/100.mp3', answer: '100' },
  { src: '/audio/nombres/centaine/200.mp3', answer: '200' },
  { src: '/audio/nombres/special/15.mp3', answer: '15' },
]

const TEXTES: Array<{ prompt: string; options: string[]; answer: string }> = [
  {
    prompt: '« Le train de 8 h 12 part du quai 4. » Le train part à 8 h 12.',
    options: ['Vrai', 'Faux'],
    answer: 'Vrai',
  },
  {
    prompt: '« Le billet coûte 12 francs. » Le billet coûte 20 francs.',
    options: ['Vrai', 'Faux'],
    answer: 'Faux',
  },
  {
    prompt: '« La boulangerie ouvre à 7 h. » Elle ouvre le matin.',
    options: ['Vrai', 'Faux'],
    answer: 'Vrai',
  },
  {
    prompt: '« Le médecin reçoit sans rendez-vous le jeudi. » Il reçoit le mardi.',
    options: ['Vrai', 'Faux'],
    answer: 'Faux',
  },
]

function hole(prompt: string, answer: string): MathItem {
  return { layout: 'text', prompt, answer }
}

function choice(prompt: string, options: string[], answer: string): MathItem {
  return { layout: 'select', prompt, options, answer }
}

export function tryGenerateFrancais(typeId: string, rng: Rng, index: number): MathItem | null {
  const at = <T,>(list: T[]): T => list[index % list.length]!
  switch (typeId) {
    case 'fr-gram-etre':
      return hole(...at(ETRE))
    case 'fr-gram-avoir':
      return hole(...at(AVOIR))
    case 'fr-gram-articles': {
      const row = at(ARTICLES)
      return choice(row[0], row[2], row[1])
    }
    case 'fr-gram-possessifs':
      return hole(...at(POSSESSIFS))
    case 'fr-gram-verbes-er':
      return hole(...at(VERBES_ER))
    case 'fr-gram-negation':
      return hole(...at(NEGATION))
    case 'fr-vocab-famille':
      return hole(...at(FAMILLE))
    case 'fr-vocab-logement': {
      const row = at(LOGEMENT)
      return choice(row[0], row[2], row[1])
    }
    case 'fr-vocab-vetements':
      return hole(...at(VETEMENTS))
    case 'fr-vocab-intrus': {
      const groups = [
        { prompt: 'Entourez l’intrus.', options: ['pomme', 'poire', 'chaise', 'banane'], answer: 'chaise' },
        { prompt: 'Entourez l’intrus.', options: ['mère', 'oncle', 'table', 'sœur'], answer: 'table' },
        { prompt: 'Entourez l’intrus.', options: ['train', 'bus', 'vélo', 'fourchette'], answer: 'fourchette' },
        { prompt: 'Entourez l’intrus.', options: ['lundi', 'mardi', 'avril', 'jeudi'], answer: 'avril' },
      ]
      const row = at(groups)
      return choice(row.prompt, row.options, row.answer)
    }
    case 'fr-com-presenter':
      return hole(...at(PRESENTATION))
    case 'fr-com-inviter':
      return hole(...at(INVITER))
    case 'fr-com-logement':
      return hole(
        pick(rng, [
          'Décrivez votre logement en une phrase. Amorçe : J’habite…',
          'Décrivez une pièce. Amorçe : Dans la cuisine, il y a…',
          'Décrivez un problème. Amorçe : Le robinet…',
        ]),
        'réponse libre',
      )
    case 'fr-co-nombres': {
      const clip = at(NOMBRES)
      return {
        layout: 'text',
        prompt: 'Écoutez. Écrivez le nombre.',
        audioSrc: clip.src,
        answer: clip.answer,
      }
    }
    case 'fr-ce-vrai-faux': {
      const row = at(TEXTES)
      return choice(row.prompt, row.options, row.answer)
    }
    default:
      return null
  }
}
