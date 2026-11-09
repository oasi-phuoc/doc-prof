import { readFile } from 'node:fs/promises'

export async function classroomRecipe() {
  const recipe = JSON.parse(
    await readFile('docs/interactive/demo-source-recipe.json', 'utf8'),
  )
  const fixture = JSON.parse(
    await readFile('docs/interactive/demo-fixture.json', 'utf8'),
  )
  const audio = fixture.questions.find((q) => q.audio).audio
  const pictures = ['10-tomates', '5-tomates', '8-tomates'].map(
    (name) => `/lib/images/tcf/co/objets/${name}.webp`,
  )
  const options = pictures.map((image, i) => ({
    lettre: String.fromCharCode(65 + i),
    image,
    correct: i === 1,
  }))
  const questions = Array.from({ length: 6 }, (_, i) => ({
    layout: 'tcf',
    prompt: '',
    answer: 'Réponse à rédiger sur papier',
    tcf: {
      kind: 'lignes',
      numero: i + 1,
      enonce: `Question audio ${i + 1} : quelle image correspond ?`,
      nbLignes: 2,
      reponseModele: 'Réponse à rédiger sur papier',
      audioSrc: audio,
      formSelect: {
        active: 'lignes',
        filled: ['qcm_image', 'lignes'],
        variants: {
          qcm_image: {
            kind: 'qcm',
            mode: 'image',
            choix: options,
            answer: 'B',
          },
        },
      },
    },
  }))
  const reading = {
    layout: 'tcf',
    prompt: '',
    answer: 'B',
    tcf: {
      kind: 'qcm',
      numero: 1,
      enonce: 'Où acheter les tomates ?',
      mode: 'image',
      choix: options,
    },
  }
  const support = {
    layout: 'tcf',
    prompt: '',
    answer: '',
    tcf: {
      kind: 'support',
      exercise: {
        id: 'classroom-reading',
        niveau: 'A0-A1',
        competence: 'CE',
        type_exercice: 'annonce',
        support: {
          titre: 'Le marché du quartier',
          texte:
            'Le marché du quartier ouvre le samedi de 8 h à 13 h.\nVous pouvez acheter des fruits et des légumes frais.',
          image: null,
        },
        questions: [],
      },
    },
  }
  recipe.pages = [
    { ...recipe.pages[0], libreItems: [support, reading] },
    { ...recipe.pages[0], libreItems: questions },
  ]
  return recipe
}
