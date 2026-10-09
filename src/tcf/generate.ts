import { createRng, pick, shuffle, type Rng } from '@/math/rng'
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
import { TCF_PE_GROUPS, TCF_PO_GROUPS, tcfGroupId } from './sources'
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
          cadre: 'message',
          nbMots: ex.support.nb_mots,
          nbLignes: linesForWords(ex.support.nb_mots, 3),
          reponseModele: ex.support.reponse_modele,
        }),
      ]
    case 'sms_reponse':
    case 'email_reponse':
    case 'question_texte': {
      const fallback = ex.type_exercice === 'sms_reponse' ? 5 : ex.type_exercice === 'email_reponse' ? 8 : 12
      const email =
        ex.type_exercice === 'email_reponse'
          ? { a: ex.support.email_recu.de, objet: `RE : ${ex.support.email_recu.objet}` }
          : ex.type_exercice === 'question_texte'
            ? ex.support.email
            : undefined
      return [
        support(),
        scoredItem({
          kind: 'ecriture',
          cadre: email ? 'email' : 'message',
          email,
          consigneSupplementaire: ex.consigne_supplementaire ?? undefined,
          nbMots: ex.support.nb_mots,
          nbLignes: linesForWords(ex.support.nb_mots, fallback),
          reponseModele: ex.support.reponse_modele,
        }),
      ]
    }
    case 'trois_themes': {
      const themes = shuffle(rng, ex.support.themes.filter((t) => t.theme.trim()))
        .slice(0, 3)
        .map((t) => ({ ...t, images: shuffle(rng, t.images.filter((src) => src.trim())).slice(0, 4) }))
      return [tcfItem({ kind: 'support', exercise: { ...ex, support: { themes } } }, true, '', ex.points)]
    }
    case 'entretien':
    case 'image_interaction':
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
          bulles: true,
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
  const bank = slot ? tcfSlotBank(niveau, slot) : tcfBank(niveau, competence, legacy!.typeExercice)
  const inScenario = config.tcfScenario ? bank.filter((ex) => tcfGroupId(ex) === config.tcfScenario) : bank
  const pool = inScenario.length > 0 ? inScenario : bank
  const fromBank = () => {
    const chosen = bank.find((ex) => ex.id === config.tcfBankId)
    return chosen ?? (pool.length > 0 ? pick(rng, pool) : undefined)
  }
  const ex = config.tcfExercise && config.tcfExercise.competence === competence ? config.tcfExercise : fromBank()
  const fallbackInstruction = (slot ?? legacy)!.instruction
  if (!ex) {
    return {
      instruction: fallbackInstruction,
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
    instruction,
    items: tcfExerciseItems(ex, rng).map((item) => ({ ...item, tcfExerciseId: ex.id })),
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
 * Les exercices sans numéro d’origine (sujets DELF) sont candidats à toutes les positions.
 */
function pickByPosition(pool: readonly TcfExercise[], count: number, rng: Rng): TcfExercise[] {
  const chosen: TcfExercise[] = []
  for (let position = 1; position <= count; position++) {
    const remaining = pool.filter((ex) => !chosen.includes(ex))
    if (remaining.length === 0) break
    const atPosition = remaining.filter((ex) => {
      const origin = tcfPosition(ex.id)
      return origin === position || origin == null
    })
    const candidates = atPosition.length > 0 ? atPosition : remaining
    const newType = candidates.filter((ex) => !chosen.some((c) => c.type_exercice === ex.type_exercice))
    chosen.push(pick(rng, newType.length > 0 ? newType : candidates))
  }
  return chosen
}

/**
 * Test complet tiré au hasard dans la banque du niveau : Informations,
 * CO exercices 1 à 4, 4 CE, PE (formulaire, dialogue, message, e-mail),
 * PO (entretien dirigé, questions sur 3 thèmes, image et interaction).
 */
export function buildTcfRandomTestPages(niveau: TcfNiveau, seed: number): PageConfig[] {
  const rng = createRng(seed)
  const page = (typeId: string, ex: TcfExercise) => tcfPage(typeId, niveau, { tcfBankId: ex.id, pointsPerQuestion: 1 })
  // Les exemples de démonstration (`tcf-a0a1-ce-001`) ne viennent d’aucun test : exclus du tirage.
  const numberedBank = (n: TcfNiveau, slot: TcfSlotMeta) =>
    tcfSlotBank(n, slot).filter((ex) => !/^tcf-[a-z0-9]+-(?:co|ce|pe|po)-\d{3}$/.test(ex.id))
  const pages: PageConfig[] = [tcfConsignesPage(niveau)]
  for (const slot of TCF_SLOTS.filter((s) => s.competence === 'CO' && (s.numero ?? 0) <= 4)) {
    const pool = numberedBank(niveau, slot)
    if (pool.length > 0) pages.push(page(slot.typeId, pick(rng, pool)))
  }
  const slotOf = (competence: TcfCompetence) => TCF_SLOTS.find((s) => s.competence === competence)!
  const ce = slotOf('CE')
  for (const ex of pickByPosition(numberedBank(niveau, ce), 4, rng)) pages.push(page(ce.typeId, ex))
  for (const [competence, groups] of [
    ['PE', TCF_PE_GROUPS],
    ['PO', TCF_PO_GROUPS.filter((g) => g.id !== 'interaction')],
  ] as const) {
    const slot = slotOf(competence)
    const pool = numberedBank(niveau, slot)
    for (const group of groups) {
      const inGroup = pool.filter((ex) => tcfGroupId(ex) === group.id)
      if (inGroup.length > 0) pages.push(page(slot.typeId, pick(rng, inGroup)))
    }
  }
  return pages
}
