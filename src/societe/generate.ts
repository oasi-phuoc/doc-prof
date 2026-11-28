import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { MathItem, PageConfig } from '@/math/types'
import { CANTONS, CARTE_ACTIVITES, GALERIES_ATLAS, LISTE_CANTONS_ID, imageVue } from './atlas'
import { SOCIETE_KINDS } from './catalog'
import { normalizeSocieteBlock } from './legacy'
import { SOCIETE_UNITS } from './parcours'
import { theoriesIllustrees } from './parcours/theorie-illustree'
import { isSocieteType, type SocieteImage, type SocieteQuestion, type SocieteSupport, type SocieteUnite } from './types'

const units = new Map(SOCIETE_UNITS.map((unit) => [unit.id, unit]))

function theory(block: GrammarTheoryBlock): MathItem {
  return { layout: 'theory', answer: '', noPoints: true, theoryBlock: block, grammarTheoryFalc: true }
}

function theoryImage(image: SocieteImage): MathItem {
  return theory({ kind: 'image', ...image })
}

function theoryItems(unit: SocieteUnite): MathItem[] {
  const lecon = theoriesIllustrees[unit.id]
  const contexte = unit.image ? [unit.image, ...lecon.contexte] : lecon.contexte
  // Les notions restent en texte sélectionnable, en regard des images.
  const notionsVisibles = contexte.length > 1 ? Math.ceil(unit.explication.length / 2) : unit.explication.length
  const debut = [
    theory({ kind: 'heading', text: unit.titre }),
    theory({ kind: 'paragraph', text: unit.objectif }),
    theory({ kind: 'examples', label: 'Je regarde', items: [unit.situation] }),
    ...contexte.map(theoryImage),
    { ...theory({ kind: 'examples', label: 'J’explique', items: [...unit.explication.slice(0, notionsVisibles)], marker: 'puces' }), theoryPageBreakAfter: true },
  ]
  const complement = unit.explication.slice(notionsVisibles)
  return [
    ...debut,
    theory({ kind: 'heading', text: `${unit.titre} · Un exemple pas à pas`, sub: true }),
    ...lecon.exemple.map(theoryImage),
    ...(complement.length ? [theory({ kind: 'examples', label: 'Je retiens', items: [...complement], marker: 'puces' })] : []),
    theory({ kind: 'examples', label: 'Je vérifie', items: [lecon.essai, lecon.reponse] }),
  ]
}

function support(item: SocieteSupport): MathItem {
  return {
    layout: 'societe-support',
    answer: '',
    noPoints: true,
    hideItemNumber: true,
    societeSupport: item,
    audioSrc: item.kind === 'ecoute' ? item.audioSrc : undefined,
  }
}

function atlasBlock(exerciseType: string): { instruction: string; items: MathItem[] } | undefined {
  const carte = CARTE_ACTIVITES.find((candidate) => candidate.id === exerciseType)
  if (carte) {
    return {
      instruction: carte.consigne,
      items: [
        support({ kind: 'document', titre: carte.label, lignes: [], image: carte.image, correction: carte.correction }),
        ...questions(carte.questions),
      ],
    }
  }

  if (exerciseType === LISTE_CANTONS_ID) {
    const items = [0, 7, 14, 20].flatMap((start, pageIndex) => {
      const cantons = CANTONS.slice(start, pageIndex < 2 ? start + 7 : start + 6)
      const folio = `${start + 1} à ${start + cantons.length}`
      return [
        theory({ kind: 'heading', text: `Cantons et chefs-lieux · ${folio}` }),
        ...(pageIndex === 0 ? [
          theory({ kind: 'paragraph', text: 'Les six anciens demi-cantons font partie des 26 cantons.' }),
        ] : []),
        { ...support({ kind: 'cantons', cantons }), grammarTheoryFalc: true, theoryPageBreakAfter: pageIndex < 3 },
      ]
    })
    return { instruction: 'Cantons et chefs-lieux', items }
  }

  const galerie = GALERIES_ATLAS.find((candidate) => candidate.id === exerciseType)
  if (!galerie) return undefined
  const items: MathItem[] = []
  const legendes = new Map(CANTONS.map((canton) => [canton.vue, `${canton.nom} · ${canton.sigle}`]))
  for (let index = 0; index < galerie.vues.length; index += 2) {
    if (index % 6 === 0) {
      items.push(theory({ kind: 'heading', text: galerie.label }))
    }
    const cells = galerie.vues.slice(index, index + 2).map((vue) => {
      const image = imageVue(vue)
      return { ...image, description: legendes.get(image.src) }
    })
    items.push({
      ...theory({ kind: 'image-row', label: galerie.label, cells }),
      theoryPageBreakAfter: index % 6 === 4 && index + 2 < galerie.vues.length,
    })
  }
  return { instruction: galerie.label, items }
}

const contexteEcoute = new Set(['voisins', 'paysages', 'commune', 'transports', 'logement', 'formation', 'salaire'])

function questions(entries: readonly SocieteQuestion[]): MathItem[] {
  return entries.map(({ prompt, answer, options }) => options
    ? { layout: 'select', prompt, answer, options: [...options] }
    : { layout: 'text', prompt, answer })
}

export function tryGenerateSocieteBlock(config: PageConfig): { instruction: string; items: MathItem[] } | null {
  if (!isSocieteType(config.exerciseType)) return null
  const { exerciseType } = normalizeSocieteBlock(config)
  const atlas = atlasBlock(exerciseType)
  if (atlas) return atlas
  const match = /^societe-(.+)-(theorie|lexique|ce|co|po|pe)$/.exec(exerciseType)
  if (!match) return null
  const [, id, kind] = match
  const unit = units.get(id)
  const type = SOCIETE_KINDS.find(([candidate]) => candidate === kind)
  if (!unit || !type) return null
  const instruction = kind === 'theorie' ? unit.titre : type[2]
  const lecon = theoriesIllustrees[id]
  const imageActivite = lecon.contexte[0] ?? unit.image ?? lecon.exemple[0]
  let items: MathItem[]
  switch (kind) {
    case 'theorie':
      items = theoryItems(unit)
      break
    case 'lexique':
      items = [
        theory({ kind: 'heading', text: `Lexique · ${unit.titre}` }),
        theory({ kind: 'table', headers: ['Mot', 'Sens'], rows: unit.lexique.map(([mot, sens]) => [mot, sens]) }),
      ]
      break
    case 'ce':
      items = [support({ kind: 'document', titre: unit.document.titre, lignes: unit.document.lignes, image: unit.document.image ?? lecon.exemple[0] }), ...questions(unit.document.questions)]
      break
    case 'co':
      items = [support({
        kind: 'ecoute',
        transcription: unit.ecoute.transcription,
        audioSrc: `/lib/audio/societe/${unit.id}.mp3`,
        image: contexteEcoute.has(id) ? imageActivite : undefined,
      }), ...questions(unit.ecoute.questions)]
      break
    case 'po':
      items = [support({ kind: 'production', production: unit.oral, lignes: 0, image: imageActivite })]
      break
    default:
      items = [support({
        kind: 'production',
        production: unit.ecrit,
        image: imageActivite,
        lignes: unit.niveau === 'B1' ? 9 : unit.niveau === 'A2' ? 6 : 4,
      })]
  }
  return { instruction, items }
}
