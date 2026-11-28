import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { completionFicheItems } from '@/grammaire/exercises/completion-fiche'
import { CANTONS, CARTE_ACTIVITES, GALERIES_ATLAS, LISTE_CANTONS_ID, imageVue } from './atlas'
import { SOCIETE_KINDS } from './catalog'
import { societeCommunicationItems } from './communication'
import { normalizeSocieteBlock } from './legacy'
import { SOCIETE_UNITS } from './parcours'
import { theoriesIllustrees } from './parcours/theorie-illustree'
import { isSocieteType, type SocieteImage, type SocieteSupport, type SocieteUnite } from './types'
import { societeVocabItems } from './vocabulaire'

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
    ...contexte.map(theoryImage),
    theory({ kind: 'examples', label: 'Je regarde', items: [unit.situation], marker: 'border' }),
    theory({ kind: 'paragraph', text: unit.objectif }),
    { ...theory({ kind: 'examples', label: 'J’explique', items: [...unit.explication.slice(0, notionsVisibles)], marker: 'puces' }), theoryPageBreakAfter: true },
  ]
  const complement = unit.explication.slice(notionsVisibles)
  return [
    ...debut,
    theory({ kind: 'heading', text: `${unit.titre} · Un exemple pas à pas`, sub: true }),
    ...lecon.exemple.map(theoryImage),
    ...(complement.length ? [theory({ kind: 'examples', label: 'Je retiens', items: [...complement], marker: 'puces' })] : []),
    theory({ kind: 'practice', instruction: 'J’essaie', items: [{ prompt: lecon.essai, answer: lecon.reponse, explanation: '' }] }),
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

function atlasBlock(exerciseType: string, config: PageConfig, rng: Rng): { instruction: string; items: MathItem[] } | undefined {
  const carte = CARTE_ACTIVITES.find((candidate) => candidate.id === exerciseType)
  if (carte) {
    const presentation = config.completionPresentation === 'gap' ? 'Complète les phrases.' : 'Choisis une réponse par phrase.'
    return {
      instruction: carte.questions.length ? `${carte.consigne} ${presentation}` : carte.consigne,
      items: [
        support({ kind: 'document', titre: carte.label, lignes: [], image: carte.image, correction: carte.correction }),
        ...completionFicheItems(carte.questions, config, 'src/societe/atlas.ts', rng),
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

export function tryGenerateSocieteBlock(config: PageConfig, rng: Rng): { instruction: string; items: MathItem[] } | null {
  if (!isSocieteType(config.exerciseType)) return null
  const { exerciseType } = normalizeSocieteBlock(config)
  const atlas = atlasBlock(exerciseType, config, rng)
  if (atlas) return atlas
  const match = /^societe-(.+)-(theorie|lexique|ce|co|po|pe)$/.exec(exerciseType)
  if (!match) return null
  const [, id, kind] = match
  const unit = units.get(id)
  const type = SOCIETE_KINDS.find(([candidate]) => candidate === kind)
  if (!unit || !type) return null
  const formatVraiFaux = kind === 'co' && config.grammarCoFormat === 'true-false'
  const instruction = kind === 'theorie' ? unit.titre : formatVraiFaux
    ? 'Écoutez l’enregistrement. Pour chaque phrase, cochez Vrai ou Faux.'
    : type[2]
  const lecon = theoriesIllustrees[id]
  const imageActivite = lecon.contexte[0] ?? unit.image ?? lecon.exemple[0]
  let items: MathItem[]
  switch (kind) {
    case 'theorie':
      items = theoryItems(unit)
      break
    case 'lexique': {
      const recall = config.grammarVocabRecall === true
      return {
        instruction: recall ? 'Retrouvez chaque mot à l’aide de sa définition ou de son image.' : instruction,
        items: societeVocabItems(unit, recall),
      }
    }
    case 'ce':
    case 'co':
    case 'po':
    case 'pe':
      items = societeCommunicationItems(
        unit, kind, config, rng, imageActivite, unit.document.image ?? lecon.exemple[0],
        contexteEcoute.has(id) ? imageActivite : undefined,
      )
      break
    default:
      return null
  }
  return { instruction, items }
}
