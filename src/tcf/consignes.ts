/**
 * Consignes CO liées au type / emplacement d’exercice (pas à chaque audio).
 * Marqueurs : [[em]]…[[/em]] = gras couleur thème ; [[bell]] = icône sonnerie.
 */
import type { TcfTypeExercice } from './types'

export const TCF_CO_CONSIGNE_SIX_COURTS = [
  'Vous allez écouter [[em]]6 documents audio[[/em]] différents. Il y a 2 écoutes.',
  'Avant chaque écoute, vous entendez le son suivant [[bell]].',
  '[[em]]1.[[/em]] Lisez les questions.',
  '[[em]]2.[[/em]] Écoutez les documents audio',
  '[[em]]3.[[/em]] Répondez aux questions',
  'Il y a 1 question par document audio.',
].join('\n')

export const TCF_CO_CONSIGNE_TROIS_MOYENS = [
  'Vous allez écouter [[em]]3 documents audio[[/em]] différents. Il y a 2 écoutes.',
  'Avant chaque écoute, vous entendez le son suivant [[bell]].',
  '[[em]]1.[[/em]] Lisez les questions.',
  '[[em]]2.[[/em]] Écoutez les documents audio',
  '[[em]]3.[[/em]] Répondez aux questions',
  'Il y a 2 questions par document audio.',
].join('\n')

export const TCF_CO_CONSIGNE_LONG = [
  'Vous allez écouter [[em]]1 document audio[[/em]] différent. Il y a 2 écoutes.',
  'Avant chaque écoute, vous entendez le son suivant [[bell]].',
  '[[em]]1.[[/em]] Lisez les questions.',
  '[[em]]2.[[/em]] Écoutez le document audio',
  '[[em]]3.[[/em]] Répondez aux questions',
].join('\n')

export const TCF_CO_CONSIGNE_SCENARIO = [
  'Vous allez écouter [[em]]4 documents audio[[/em]]. Il y a 2 écoutes.',
  'Avant chaque écoute, vous entendez le son suivant [[bell]].',
  '[[em]]1.[[/em]] Regardez les images',
  '[[em]]2.[[/em]] Écoutez les documents audio',
  '[[em]]3.[[/em]] Notez le numéro (1 - 2 - 3 - 4) du document audio sous l’image',
  'Attention, il y a six images (A, B, C, D, E et F) mais seulement 4 documents audio.',
].join('\n')

export const TCF_CO_CONSIGNE_OBJETS = [
  'Vous allez écouter [[em]]1 document audio[[/em]] différent. Il y a 2 écoutes.',
  'Avant chaque écoute, vous entendez le son suivant [[bell]].',
  '[[em]]1.[[/em]] Regardez les images.',
  '[[em]]2.[[/em]] Écoutez le document audio',
  '[[em]]3.[[/em]] Cochez [[em]]oui[[/em]] sous l’image quand vous [[em]]entendez le nom[[/em]] de l’objet',
  '[[em]]4.[[/em]] Cochez [[em]]non[[/em]] sous l’image quand vous [[em]]n’entendez pas le nom[[/em]] de l’objet',
].join('\n')

/** Consigne d’un emplacement CO CSC / TPF (1…5). */
export function tcfCoConsigneForSlot(numero: number | undefined): string | undefined {
  if (numero === 1) return TCF_CO_CONSIGNE_SIX_COURTS
  if (numero === 2) return TCF_CO_CONSIGNE_TROIS_MOYENS
  if (numero === 3) return TCF_CO_CONSIGNE_LONG
  if (numero === 4) return TCF_CO_CONSIGNE_SCENARIO
  if (numero === 5) return TCF_CO_CONSIGNE_OBJETS
  return undefined
}

/** Consigne d’un type d’exercice CO (mode libre / catalogue). */
export function tcfCoConsigneForType(typeExercice: TcfTypeExercice): string | undefined {
  switch (typeExercice) {
    case 'six_courts':
      return TCF_CO_CONSIGNE_SIX_COURTS
    case 'trois_moyens':
      return TCF_CO_CONSIGNE_TROIS_MOYENS
    case 'complet':
      return TCF_CO_CONSIGNE_LONG
    case 'association_images':
      return TCF_CO_CONSIGNE_SCENARIO
    case 'images_a_reconnaitre':
      return TCF_CO_CONSIGNE_OBJETS
    default:
      return undefined
  }
}
