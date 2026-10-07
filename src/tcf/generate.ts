import { createRng, pick, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import {
  TCF_COMPETENCES,
  TCF_CONSIGNES_TYPE,
  TCF_DOMAIN,
  TCF_INFO_TOPIC,
  TCF_SLOTS,
  type TcfSlotMeta,
  isTcfConsignesType,
  tcfDifficultyFromNiveau,
  tcfNiveauFromDifficulty,
  tcfPosition,
  tcfSlotByTypeId,
  tcfTypeByTypeId,
  tcfTypeMeta,
} from './catalog'
import { tcfBank, tcfSlotBank } from './loader'
import { melangerChoix } from './melanger'
import { TCF_LETTRES, TCF_LETTRES_SITUATIONS } from './templates'
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
    case 'dialogue_a_completer':
      return [
        scoredItem({
          kind: 'dialogue',
          situation: ex.support.situation ?? '',
          repliques: ex.support.repliques,
          interlocuteur: ex.support.interlocuteur,
        }),
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
      instruction: '',
      items: [tcfItem({ kind: 'informations', niveau }, false)],
    }
  }
  const slot = tcfSlotByTypeId[config.exerciseType]
  // Anciennes recettes : un type d’exercice précis au lieu d’un emplacement.
  const legacy = slot ? undefined : tcfTypeByTypeId[config.exerciseType]
  if (!slot && !legacy) return null
  const competence = (slot ?? legacy)!.competence
  const pool = slot ? tcfSlotBank(niveau, slot) : tcfBank(niveau, competence, legacy!.typeExercice)
  const fromBank = () => {
    const chosen = pool.find((ex) => ex.id === config.tcfBankId)
    return chosen ?? (pool.length > 0 ? pick(rng, pool) : undefined)
  }
  const ex = config.tcfExercise && config.tcfExercise.competence === competence ? config.tcfExercise : fromBank()
  const duree = config.tcfDureeMin && config.tcfDureeMin > 0 ? ` Durée : ${config.tcfDureeMin} min.` : ''
  const fallbackInstruction = (slot ?? legacy)!.instruction
  if (!ex) {
    return {
      instruction: fallbackInstruction + duree,
      items: [
        tcfItem(
          {
            kind: 'vide',
            message: `Aucun exercice « ${(slot ?? legacy)!.label} » en ${niveau} dans la banque. Saisissez-le dans le panneau TCF ou ajoutez-le dans src/content/tcf.`,
          },
          false,
        ),
      ],
    }
  }
  const instruction = ex.consigne?.trim() || tcfTypeMeta(ex.competence, ex.type_exercice)?.instruction || fallbackInstruction
  return {
    instruction: instruction + duree,
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

/** Page TCF vierge pour un emplacement donné. */
export function tcfPage(typeId: string, niveau: TcfNiveau, extra: Partial<PageConfig> = {}): PageConfig {
  const slot = tcfSlotByTypeId[typeId] ?? TCF_SLOTS[0]!
  const topic = TCF_COMPETENCES.find((c) => c.id === slot.competence)!.topic
  return {
    domain: TCF_DOMAIN,
    topic,
    exerciseType: slot.typeId,
    difficulty: tcfDifficultyFromNiveau(niveau),
    count: 1,
    columns: 1,
    ...extra,
  }
}

/**
 * Choisit `count` exercices distincts en suivant leur numéro d’origine
 * (exercice 1, puis 2…) et en évitant de répéter un même type.
 */
function pickByPosition(pool: readonly TcfExercise[], count: number, rng: Rng): TcfExercise[] {
  const chosen: TcfExercise[] = []
  for (let position = 1; position <= count; position++) {
    const remaining = pool.filter((ex) => !chosen.includes(ex))
    if (remaining.length === 0) break
    const atPosition = remaining.filter((ex) => tcfPosition(ex.id) === position)
    const candidates = atPosition.length > 0 ? atPosition : remaining
    const newType = candidates.filter((ex) => !chosen.some((c) => c.type_exercice === ex.type_exercice))
    chosen.push(pick(rng, newType.length > 0 ? newType : candidates))
  }
  return chosen
}

/**
 * Test complet tiré au hasard dans la banque du niveau : Informations,
 * CO exercices 1 à 4 (+ 5 une fois sur deux s’il existe), 4 CE, 3 PE, 1 PO.
 */
export function buildTcfRandomTestPages(niveau: TcfNiveau, seed: number): PageConfig[] {
  const rng = createRng(seed)
  const page = (typeId: string, ex: TcfExercise) => tcfPage(typeId, niveau, { tcfBankId: ex.id, pointsPerQuestion: 1 })
  // Les exemples sans numéro d’origine (`…-001`) ne viennent d’aucun test : exclus du tirage.
  const numberedBank = (n: TcfNiveau, slot: TcfSlotMeta) =>
    tcfSlotBank(n, slot).filter((ex) => tcfPosition(ex.id) != null)
  const pages: PageConfig[] = [tcfConsignesPage(niveau)]
  for (const slot of TCF_SLOTS.filter((s) => s.competence === 'CO')) {
    const pool = numberedBank(niveau, slot)
    if (pool.length === 0 || (slot.numero === 5 && rng() < 0.5)) continue
    pages.push(page(slot.typeId, pick(rng, pool)))
  }
  const slotOf = (competence: TcfCompetence) => TCF_SLOTS.find((s) => s.competence === competence)!
  for (const [competence, count] of [['CE', 4], ['PE', 3]] as const) {
    const slot = slotOf(competence)
    for (const ex of pickByPosition(numberedBank(niveau, slot), count, rng)) pages.push(page(slot.typeId, ex))
  }
  const po = slotOf('PO')
  const poPool = numberedBank(niveau, po)
  const positions = [...new Set(poPool.map((ex) => tcfPosition(ex.id)))]
  if (positions.length > 0) {
    const position = pick(rng, positions)
    pages.push(page(po.typeId, pick(rng, poPool.filter((ex) => tcfPosition(ex.id) === position))))
  }
  return pages
}
