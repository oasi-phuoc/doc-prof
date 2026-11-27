import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validLibreMetadata, validLibreRaster } from '../../src/fiches/libre-metadata.ts'

const page = { domain: 'algèbre', exerciseType: 'addition-ligne', libreId: 'addition-a' }
const item = { layout: 'inline', answer: '42', libreId: 'question-a', libreLocked: true }

test('les anciennes recettes et les questions identifiées sont compatibles', () => {
  assert(validLibreMetadata([{ domain: 'algèbre', exerciseType: 'addition-ligne' }]))
  assert(validLibreMetadata([{ ...page, libreItems: [item] }]))
  assert(validLibreMetadata([{ ...page, libreItems: [item], extraBlocks: [{ libreId: 'addition-b', libreItems: [item] }] }]))
})

test('les verrous et les identités incohérentes sont refusés', () => {
  assert(!validLibreMetadata([{ ...page, libreItems: [item, item] }]))
  assert(!validLibreMetadata([{ ...page, libreItems: [{ ...item, libreId: undefined }] }]))
  assert(!validLibreMetadata([{ ...page, libreItems: [{ ...item, libreLocked: 'oui' }] }]))
  assert(!validLibreMetadata([{ ...page, libreId: undefined, libreItems: [item] }]))
  assert(!validLibreMetadata([{ ...page, extraBlocks: [page] }]))
})

test('les images privées en mode Libre sont limitées aux images raster reconnues', () => {
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGPU9r7DgA0wYRUdtBIAC9IBYkd6Sd0AAAAASUVORK5CYII='
  assert(validLibreRaster(png))
  assert(!validLibreRaster('data:image/png;base64,PHN2Zz4='))
  assert(!validLibreRaster('data:image/svg+xml;base64,PHN2Zz4='))
  const question = {
    enonce: 'Quelle image ?', libreId: 'qcm-a', correctionARevoir: true, type_reponse: 'qcm_image',
    choix: [{ id: 'a', image: png }],
  }
  assert(validLibreMetadata([{ ...page, tcfExercise: { questions: [question] } }]))
  assert(!validLibreMetadata([{ ...page, tcfExercise: { questions: [question, question] } }]))
  assert(!validLibreMetadata([{ ...page, tcfExercise: { questions: [{ ...question, choix: [{ id: 'a', image: 'data:image/png;base64,PHN2Zz4=' }] }] } }]))
  const word = { id: 'mot-1', label: 'atelier', imageSrc: png, libreImage: true }
  assert(validLibreMetadata([{ ...page, soutienMotsEntries: [word] }]))
  assert(!validLibreMetadata([{ ...page, soutienMotsEntries: [{ ...word, imageSrc: 'data:image/png;base64,PHN2Zz4=' }] }]))
})

test('le contenu et les verrous de droite restent distincts dans une recette A5', () => {
  const worksheet = {
    ...page,
    libreId: 'gauche',
    libreItems: [{ layout: 'inline', answer: '8', libreId: 'calcul-gauche', libreLocked: true }],
    a5RightLibre: { id: 'droite', items: [{ layout: 'inline', answer: '9', libreId: 'calcul-droite', libreLocked: true }] },
  }
  assert(validLibreMetadata([worksheet]))
  assert(!validLibreMetadata([{ ...worksheet, a5RightLibre: { ...worksheet.a5RightLibre, id: 'gauche' } }]))
  assert(!validLibreMetadata([{ ...worksheet, a5RightLibre: { id: 'droite', items: [] } }]))
  assert(!validLibreMetadata([{ ...worksheet, a5RightLibre: { id: 'droite', items: [{ libreLocked: true }] } }]))
})

test('les supports TCF édités conservent leurs états et refusent les médias éphémères', () => {
  const association = {
    competence: 'CO', type_exercice: 'association_images', questions: [],
    libreSupportEdited: true, libreSupportReview: true, support: { audio: '/audio/dialogues.mp3', nb_dialogues: 1 },
    situations: [{ id: 'a', image: '/images/atelier.webp', dialogue: 1 }, { id: 'b', image: '/images/ecole.webp', dialogue: null }],
  }
  assert(validLibreMetadata([{ ...page, tcfExercise: association }]))
  assert(!validLibreMetadata([{ ...page, tcfExercise: {
    ...association, situations: [association.situations[0], association.situations[0]],
  } }]))
  assert(!validLibreMetadata([{ ...page, tcfExercise: {
    ...association, situations: [{ ...association.situations[0], image: 'blob:https://exemple.invalid/image' }],
  } }]))
  assert(validLibreMetadata([{ ...page, tcfExercise: {
    competence: 'PO', type_exercice: 'mots_theme', questions: [], support: {},
    libreSupportEdited: true, libreSupportReview: false,
  } }]))
})
