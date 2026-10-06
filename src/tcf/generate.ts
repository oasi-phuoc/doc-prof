import { createRng, pick, shuffle, type Rng } from '@/math/rng'
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
} from './catalog'
import { tcfBank, tcfExerciseById } from './loader'
import { melangerChoix } from './melanger'
import { TCF_LETTRES } from './templates'
import type {
  TcfChoixImage,
  TcfChoixRendu,
  TcfChoixTexte,
  TcfCompetence,
  TcfExercise,
  TcfNbMots,
  TcfNiveau,
  TcfQuestion,
  TcfSheetItem,
} from './types'

function tcfItem(tcf: TcfSheetItem, scored: boolean, answer = ''): MathItem {
  return { layout: 'tcf', tcf, noPoints: !scored, answer }
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
      },
      true,
      q.reponse_modele ?? '',
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
    },
    true,
    choix.find((c) => c.correct)?.lettre ?? '',
  )
}

/** Exercice → items de la fiche (support puis questions / zones de réponse). */
export function tcfExerciseItems(ex: TcfExercise, rng: Rng): MathItem[] {
  const support = (scored = false) => tcfItem({ kind: 'support', exercise: ex }, scored)
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
        tcfItem(
          {
            kind: 'images_a_cocher',
            numero: 1,
            // La consigne est déjà affichée sous le titre de l’exercice.
            consigne: '',
            score: ex.score ?? 'par_image',
            images,
          },
          true,
        ),
      ]
    }
    case 'formulaire':
      return [tcfItem({ kind: 'formulaire', titre: ex.support.titre, champs: ex.support.champs }, true)]
    case 'image_question':
      return [
        support(),
        tcfItem(
          {
            kind: 'ecriture',
            nbMots: ex.support.nb_mots,
            nbLignes: linesForWords(ex.support.nb_mots, 3),
            reponseModele: ex.support.reponse_modele,
          },
          true,
        ),
      ]
    case 'sms_reponse':
    case 'email_reponse':
    case 'question_texte': {
      const fallback = ex.type_exercice === 'sms_reponse' ? 5 : ex.type_exercice === 'email_reponse' ? 8 : 12
      return [
        support(),
        tcfItem(
          {
            kind: 'ecriture',
            consigneSupplementaire: ex.consigne_supplementaire ?? undefined,
            nbMots: ex.support.nb_mots,
            nbLignes: linesForWords(ex.support.nb_mots, fallback),
            reponseModele: ex.support.reponse_modele,
          },
          true,
        ),
      ]
    }
    case 'mots_theme':
    case 'sequence_4_images':
    case 'image_unique':
      // Oral : le support porte l’évaluation (un seul item noté).
      return [support(true)]
    case 'dialogue':
      return [
        tcfItem({ kind: 'dialogue', situation: ex.support.situation, repliques: ex.support.repliques }, true),
      ]
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
      instruction: 'Lisez ces informations avant de commencer le test.',
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
 * Test TCF : page Informations, puis tirage sans doublon dans la banque
 * (une page par exercice).
 * La graine est conservée par la fiche (recette = pages + graine).
 */
export function buildTcfTestPages(
  niveau: TcfNiveau,
  competences: readonly TcfCompetence[],
  parCompetence: number,
  seed: number,
): PageConfig[] {
  const rng = createRng(seed)
  const pages: PageConfig[] = [tcfConsignesPage(niveau)]
  for (const competence of competences) {
    const pool = shuffle(rng, tcfBank(niveau, competence)).slice(0, Math.max(1, parCompetence))
    if (pool.length === 0) {
      const first = TCF_TYPES.find((m) => m.competence === competence)!
      pages.push(tcfPage(first.typeId, niveau))
      continue
    }
    for (const ex of pool) {
      const typeId = TCF_TYPES.find(
        (m) => m.competence === ex.competence && m.typeExercice === ex.type_exercice,
      )!.typeId
      pages.push(tcfPage(typeId, niveau, { tcfBankId: ex.id }))
    }
  }
  return pages
}
