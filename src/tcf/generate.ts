import { pick, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import {
  TCF_COMPETENCES,
  TCF_CONSIGNES_TYPE,
  TCF_DOMAIN,
  TCF_INFO_TOPIC,
  TCF_TYPES,
  isTcfConsignesType,
  tcfDifficultyFromNiveau,
  tcfNiveauFromDifficulty,
  tcfTypeByTypeId,
  tcfTypeId,
} from './catalog'
import type { TcfSerie } from './series'
import { tcfBank, tcfExerciseById } from './loader'
import { melangerChoix } from './melanger'
import { TCF_LETTRES, TCF_LETTRES_SITUATIONS } from './templates'
import type {
  TcfChoixImage,
  TcfChoixRendu,
  TcfChoixTexte,
  TcfExercise,
  TcfNbMots,
  TcfNiveau,
  TcfQuestion,
  TcfSheetItem,
} from './types'

function tcfItem(tcf: TcfSheetItem, scored: boolean, answer = '', points?: number): MathItem {
  return { layout: 'tcf', tcf, noPoints: !scored, answer, ...(scored && points != null ? { points } : {}) }
}

/** Nombre de traits d’écriture selon le nombre de mots attendu. */
function linesForWords(nbMots: TcfNbMots, fallback: number): number {
  const max = nbMots.max ?? 0
  if (max <= 0) return fallback
  return Math.max(3, Math.min(16, Math.ceil(max / 9)))
}

function questionItem(q: TcfQuestion, numero: number, rng: Rng): MathItem {
  const audioLabel = q.audio != null ? `Audio ${q.audio}` : undefined
  if (q.type_reponse === 'lignes') {
    return tcfItem(
      {
        kind: 'lignes',
        numero,
        enonce: q.enonce,
        nbLignes: q.nb_lignes ?? 2,
        reponseModele: q.reponse_modele,
        audioLabel,
        image: q.image,
        tableau: q.tableau,
      },
      true,
      q.reponse_modele ?? '',
      q.points,
    )
  }
  const source: ReadonlyArray<TcfChoixTexte | TcfChoixImage> = q.choix
  const ordered = melangerChoix(source, rng, q.melanger !== false)
  const choix: TcfChoixRendu[] = ordered.map((c, i) => ({
    lettre: TCF_LETTRES[i] ?? String(i + 1),
    texte: 'texte' in c ? c.texte : undefined,
    image: 'image' in c ? c.image : undefined,
    correct: c.correct === true,
  }))
  return tcfItem(
    {
      kind: 'qcm',
      numero,
      enonce: q.enonce,
      mode: q.type_reponse === 'qcm_image' ? 'image' : 'texte',
      choix,
      audioLabel,
      image: q.image,
    },
    true,
    choix.find((c) => c.correct)?.lettre ?? '',
    q.points,
  )
}

/** Exercice → items de la fiche (support puis questions / zones de réponse). */
export function tcfExerciseItems(ex: TcfExercise, rng: Rng): MathItem[] {
  const support = (scored = false) => tcfItem({ kind: 'support', exercise: ex }, scored, '', ex.points)
  /** Item noté unique de l’exercice (barème `ex.points`). */
  const scoredItem = (tcf: TcfSheetItem) => tcfItem(tcf, true, '', ex.points)
  switch (ex.type_exercice) {
    case 'sms':
    case 'email':
    case 'annonce':
    case 'six_courts':
    case 'trois_moyens':
    case 'complet':
      return [support(), ...ex.questions.map((q, i) => questionItem(q, i + 1, rng))]
    case 'images_a_reconnaitre': {
      const images = melangerChoix(ex.images, rng, ex.melanger !== false).map((img) => ({
        id: img.id,
        image: img.image,
        correct: img.correct,
      }))
      return [
        support(),
        scoredItem({
          kind: 'images_a_cocher',
          numero: 1,
          // La consigne est déjà affichée sous le titre de l’exercice.
          consigne: '',
          score: ex.score ?? 'par_image',
          images,
        }),
      ]
    }
    case 'association_images':
      return [
        support(),
        scoredItem({
          kind: 'association',
          nbDialogues: ex.support.nb_dialogues,
          situations: ex.situations.map((s, i) => ({
            lettre: TCF_LETTRES_SITUATIONS[i] ?? String(i + 1),
            image: s.image,
            dialogue: s.dialogue,
          })),
        }),
      ]
    case 'formulaire':
      return [scoredItem({ kind: 'formulaire', titre: ex.support.titre, champs: ex.support.champs })]
    case 'image_question':
      return [
        support(),
        scoredItem({
          kind: 'ecriture',
          nbMots: ex.support.nb_mots,
          nbLignes: linesForWords(ex.support.nb_mots, 3),
          reponseModele: ex.support.reponse_modele,
        }),
      ]
    case 'sms_reponse':
    case 'email_reponse':
    case 'question_texte': {
      const fallback = ex.type_exercice === 'sms_reponse' ? 5 : ex.type_exercice === 'email_reponse' ? 8 : 12
      return [
        support(),
        scoredItem({
          kind: 'ecriture',
          consigneSupplementaire: ex.consigne_supplementaire ?? undefined,
          nbMots: ex.support.nb_mots,
          nbLignes: linesForWords(ex.support.nb_mots, fallback),
          reponseModele: ex.support.reponse_modele,
        }),
      ]
    }
    case 'mots_theme':
    case 'sequence_4_images':
    case 'image_unique':
      // Oral : le support porte l’évaluation (un seul item noté).
      return [support(true)]
    case 'dialogue': {
      const { audio, images, grille } = ex.support
      return [
        ...(audio || images?.length ? [support()] : []),
        scoredItem({
          kind: 'dialogue',
          situation: ex.support.situation,
          repliques: ex.support.repliques,
          auCorrige: ex.support.repliques_au_corrige,
        }),
        ...(grille ? [tcfItem({ kind: 'grille', grille }, true, '', grille.points)] : []),
      ]
    }
  }
}

/**
 * Bloc TCF : exercice saisi (mode libre) ou tiré de la banque du niveau.
 * Retourne null si le type n’est pas un type TCF.
 */
export function tryGenerateTcfBlock(
  config: PageConfig,
  rng: Rng,
): { instruction: string; items: MathItem[] } | null {
  const niveau = tcfNiveauFromDifficulty(config.difficulty)
  if (isTcfConsignesType(config.exerciseType)) {
    return {
      instruction: '',
      items: [tcfItem({ kind: 'informations', niveau }, false)],
    }
  }
  const meta = tcfTypeByTypeId[config.exerciseType]
  if (!meta) return null
  const fromBank = () => {
    const chosen = tcfExerciseById(config.tcfBankId)
    if (chosen && chosen.type_exercice === meta.typeExercice && chosen.niveau === niveau) return chosen
    const pool = tcfBank(niveau, meta.competence, meta.typeExercice)
    return pool.length > 0 ? pick(rng, pool) : undefined
  }
  const ex =
    config.tcfExercise && config.tcfExercise.type_exercice === meta.typeExercice
      ? config.tcfExercise
      : fromBank()
  const duree = config.tcfDureeMin && config.tcfDureeMin > 0 ? ` Durée : ${config.tcfDureeMin} min.` : ''
  if (!ex) {
    return {
      instruction: meta.instruction + duree,
      items: [
        tcfItem(
          {
            kind: 'vide',
            message: `Aucun exercice « ${meta.label} » en ${niveau} dans la banque. Saisissez-le dans le panneau TCF ou ajoutez-le dans src/content/tcf.`,
          },
          false,
        ),
      ],
    }
  }
  return {
    instruction: (ex.consigne?.trim() || meta.instruction) + duree,
    items: tcfExerciseItems(ex, rng),
  }
}

/** Page 1 : informations du test (non notée). */
export function tcfConsignesPage(niveau: TcfNiveau): PageConfig {
  return {
    domain: TCF_DOMAIN,
    topic: TCF_INFO_TOPIC,
    exerciseType: TCF_CONSIGNES_TYPE,
    difficulty: tcfDifficultyFromNiveau(niveau),
    count: 1,
    columns: 1,
    pointsPerQuestion: 0,
  }
}

/** Page TCF vierge pour un type donné. */
export function tcfPage(typeId: string, niveau: TcfNiveau, extra: Partial<PageConfig> = {}): PageConfig {
  const meta = tcfTypeByTypeId[typeId] ?? TCF_TYPES[0]!
  const topic = TCF_COMPETENCES.find((c) => c.id === meta.competence)!.topic
  return {
    domain: TCF_DOMAIN,
    topic,
    exerciseType: meta.typeId,
    difficulty: tcfDifficultyFromNiveau(niveau),
    count: 1,
    columns: 1,
    ...extra,
  }
}

/**
 * Série complète (test blanc) : page Informations puis une page par exercice,
 * dans l’ordre de la série. Les exercices absents de la banque sont ignorés.
 */
export function buildTcfSeriePages(serie: TcfSerie): PageConfig[] {
  const pages: PageConfig[] = [tcfConsignesPage(serie.niveau)]
  for (const id of serie.exercices) {
    const ex = tcfExerciseById(id)
    if (!ex || ex.niveau !== serie.niveau) continue
    const typeId = tcfTypeId(ex.competence, ex.type_exercice)
    if (typeId) pages.push(tcfPage(typeId, serie.niveau, { tcfBankId: ex.id, pointsPerQuestion: 1 }))
  }
  return pages
}
