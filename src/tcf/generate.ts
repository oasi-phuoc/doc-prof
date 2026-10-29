import { createRng, pick, shuffle, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import {
  TCF_COMPETENCES,
  TCF_CONSIGNES_TYPE,
  TCF_INFO_TOPIC,
  TCF_SLOTS,
  TPF_DOMAIN,
  type TpfFamilyDomain,
  canonicalTpfFamilyDomain,
  isTcfConsignesType,
  tcfDifficultyFromNiveau,
  tcfNiveauForConfig,
  tcfSlotByTypeId,
  tcfTypeByTypeId,
  tcfTypeMeta,
  tpfFamilyLabel,
  tpfNiveauxForDomain,
  type TcfSlotMeta,
} from './catalog'
import { isAssociationAnnonce } from './association-documents'
import { filledForms, isTcfBaremeConsigne, resolveQuestionForm } from './formes'
import { tcfBank, tcfExerciseById, tcfSlotBank } from './loader'
import { melangerChoix } from './melanger'
import { TCF_PE_GROUPS, TCF_PO_GROUPS, tcfGroupId } from './sources'
import { TCF_LETTRES, TCF_LETTRES_SITUATIONS } from './templates'
import type {
  TcfChoixImage,
  TcfChoixRendu,
  TcfChoixTexte,
  TcfCompetence,
  TcfExercise,
  TcfFormSelect,
  TcfNbMots,
  TcfNiveau,
  TcfQuestion,
  TcfSheetItem,
  TcfTypeReponse,
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

function buildFormVariant(
  q: TcfQuestion,
  rng: Rng,
): NonNullable<TcfFormSelect['variants'][TcfTypeReponse]> {
  if (q.type_reponse === 'lignes') {
    return {
      kind: 'lignes',
      nbLignes: q.nb_lignes ?? 2,
      reponseModele: q.reponse_modele,
      tableau: q.tableau,
      answer: q.reponse_modele ?? '',
    }
  }
  const source: ReadonlyArray<TcfChoixTexte | TcfChoixImage> = q.choix
  const ordered = melangerChoix(source, rng, q.melanger !== false)
  const choix: TcfChoixRendu[] = ordered.map((c, i) => ({
    lettre: TCF_LETTRES[i] ?? String(i + 1),
    texte: 'texte' in c ? c.texte : undefined,
    image: 'image' in c ? c.image : undefined,
    correct: c.correct === true,
  }))
  return {
    kind: 'qcm',
    mode: q.type_reponse === 'qcm_image' ? 'image' : 'texte',
    choix,
    answer: choix.find((c) => c.correct)?.lettre ?? '',
  }
}

function defaultQuestionForm(
  q: TcfQuestion,
  filled: TcfTypeReponse[],
  competence?: TcfCompetence,
  exerciseId?: string,
): TcfTypeReponse {
  const isTcfBank = !exerciseId || exerciseId.startsWith('tcf-')
  if (isTcfBank && (competence === 'CE' || competence === 'CO') && filled.includes('qcm_texte')) {
    return 'qcm_texte'
  }
  return q.type_reponse
}

function questionItem(
  q: TcfQuestion,
  numero: number,
  rng: Rng,
  activeOverride?: TcfTypeReponse,
  competence?: TcfCompetence,
  exerciseId?: string,
): MathItem {
  const filled = filledForms(q)
  const active =
    activeOverride && filled.includes(activeOverride)
      ? activeOverride
      : defaultQuestionForm(q, filled, competence, exerciseId)
  const resolved = resolveQuestionForm(q, active)
  const audioLabel = resolved.audio != null ? `Audio ${resolved.audio}` : undefined
  const variants: TcfFormSelect['variants'] = {}
  for (const form of filled) {
    const variantQ = resolveQuestionForm(q, form)
    variants[form] = buildFormVariant(variantQ, rng)
  }
  const formSelect: TcfFormSelect | undefined =
    filled.length > 0
      ? { active: resolved.type_reponse, filled, variants }
      : undefined
  const variant = variants[resolved.type_reponse] ?? buildFormVariant(resolved, rng)
  if (variant.kind === 'lignes') {
    return tcfItem(
      {
        kind: 'lignes',
        numero,
        numeroLabel: resolved.numero_label,
        enonce: resolved.enonce,
        nbLignes: variant.nbLignes ?? 2,
        reponseModele: variant.reponseModele,
        audioLabel,
        image: resolved.image,
        images: resolved.images,
        tableau: variant.tableau,
        formSelect,
      },
      true,
      variant.answer,
      resolved.points,
    )
  }
  return tcfItem(
    {
      kind: 'qcm',
      numero,
      numeroLabel: resolved.numero_label,
      enonce: resolved.enonce,
      mode: variant.mode ?? 'texte',
      choix: variant.choix ?? [],
      audioLabel,
      image: resolved.image,
      images: resolved.images,
      formSelect,
    },
    true,
    variant.answer,
    resolved.points,
  )
}

/** Exercice → items de la fiche (support puis questions / zones de réponse). */
export function tcfExerciseItems(
  ex: TcfExercise,
  rng: Rng,
  formModes?: Array<TcfTypeReponse | undefined>,
): MathItem[] {
  const support = (scored = false) => tcfItem({ kind: 'support', exercise: ex }, scored, '', ex.points)
  /** Item noté unique de l’exercice (barème `ex.points`). */
  const scoredItem = (tcf: TcfSheetItem) => tcfItem(tcf, true, '', ex.points)
  const consigneSupp = isTcfBaremeConsigne(ex.consigne_supplementaire)
    ? undefined
    : (ex.consigne_supplementaire ?? undefined)
  switch (ex.type_exercice) {
    case 'annonce': {
      // Lire pour s’orienter (docs + personnes) : réponses dans le tableau du support.
      if (isAssociationAnnonce(ex)) return [support(true)]
      return [
        support(),
        ...ex.questions.map((q, i) =>
          questionItem(q, i + 1, rng, formModes?.[i + 1], ex.competence, ex.id),
        ),
      ]
    }
    case 'sms':
    case 'email':
    case 'six_courts':
    case 'trois_moyens':
    case 'complet': {
      // formModes indexés sur les items complets (0 = support) → questions à partir de 1.
      return [
        support(),
        ...ex.questions.map((q, i) =>
          questionItem(q, i + 1, rng, formModes?.[i + 1], ex.competence, ex.id),
        ),
      ]
    }
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
    case 'image_question': {
      // Le texte à trous se complète dans le document : pas de cadre message.
      const aCompleter = /complétez/i.test(ex.consigne ?? '') || /_{4,}/.test(ex.support.consigne)
      if (aCompleter) return [support(true)]
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
    }
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
          consigneSupplementaire: consigneSupp,
          nbMots: ex.support.nb_mots,
          nbLignes: linesForWords(ex.support.nb_mots, fallback),
          reponseModele: ex.support.reponse_modele,
        }),
      ]
    }
    case 'trois_themes': {
      // Toujours recharger la banque complète si l’exercice a déjà été réduit à 3 thèmes.
      let pool = ex.support.themes.filter((t) => t.theme.trim())
      if (pool.length <= 3) {
        const bankEx = tcfBank(ex.niveau, 'PO', 'trois_themes').find((e) => e.id === ex.id)
        if (bankEx?.type_exercice === 'trois_themes' && bankEx.support.themes.length > pool.length) {
          pool = bankEx.support.themes.filter((t) => t.theme.trim())
        }
      }
      const themes = shuffle(rng, pool)
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
 * Bloc TPF / TCF : exercice saisi (mode libre) ou tiré de la banque du niveau.
 * Retourne null si le type n’est pas un type TPF / TCF.
 */
export function tryGenerateTcfBlock(
  config: PageConfig,
  rng: Rng,
): { instruction: string; items: MathItem[] } | null {
  const niveau = tcfNiveauForConfig(config.domain, config.difficulty)
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
    const pinned = tcfExerciseById(config.tcfBankId)
    if (pinned && pinned.competence === competence) return pinned
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
            message: `Aucun exercice « ${(slot ?? legacy)!.label} » en ${niveau} dans la banque. Saisissez-le dans le panneau ${tpfFamilyLabel(config.domain)} ou ajoutez-le dans src/tcf/content.`,
          },
          false,
        ),
      ],
    }
  }
  const instruction = ex.consigne?.trim() || tcfTypeMeta(ex.competence, ex.type_exercice)?.instruction || fallbackInstruction
  return {
    instruction,
    items: tcfExerciseItems(ex, rng, config.tcfFormModes).map((item) => ({
      ...item,
      tcfExerciseId: ex.id,
    })),
  }
}

/** Page 1 : informations du test (non notée). */
export function tcfConsignesPage(
  niveau: TcfNiveau,
  domain: TpfFamilyDomain = TPF_DOMAIN,
): PageConfig {
  return {
    domain,
    topic: TCF_INFO_TOPIC,
    exerciseType: TCF_CONSIGNES_TYPE,
    difficulty: tcfDifficultyFromNiveau(niveau),
    count: 1,
    columns: 1,
    pointsPerQuestion: 0,
  }
}

/** Page TPF / TCF vierge pour un emplacement donné. */
export function tcfPage(
  typeId: string,
  niveau: TcfNiveau,
  extra: Partial<PageConfig> = {},
  domain: TpfFamilyDomain = TPF_DOMAIN,
): PageConfig {
  const slot = tcfSlotByTypeId[typeId] ?? TCF_SLOTS[0]!
  const topic = TCF_COMPETENCES.find((c) => c.id === slot.competence)!.topic
  return {
    domain,
    topic,
    exerciseType: slot.typeId,
    difficulty: tcfDifficultyFromNiveau(niveau),
    count: 1,
    columns: 1,
    ...extra,
  }
}

/** Les exemples de démonstration (`tcf-a0a1-ce-001`) ne viennent d’aucun test. */
function numberedBank(n: TcfNiveau, slot: TcfSlotMeta) {
  return tcfSlotBank(n, slot).filter((ex) => !/^tcf-[a-z0-9]+-(?:co|ce|pe|po)-\d{3}$/.test(ex.id))
}

function appendNiveauExercisePages(
  pages: PageConfig[],
  niveau: TcfNiveau,
  rng: Rng,
  domain: TpfFamilyDomain,
) {
  const page = (typeId: string, ex: TcfExercise) =>
    tcfPage(typeId, niveau, { tcfBankId: ex.id, pointsPerQuestion: 1 }, domain)
  const coMax = niveau === 'A0-A1' ? 5 : 4
  for (const slot of TCF_SLOTS.filter((s) => s.competence === 'CO' && (s.numero ?? 0) <= coMax)) {
    const all = numberedBank(niveau, slot)
    const tagged = all.filter((ex) => /-ex\d+-/.test(ex.id))
    const pool = tagged.length > 0 ? tagged : all
    if (pool.length > 0) pages.push(page(slot.typeId, pick(rng, pool)))
  }
  const slotOf = (competence: TcfCompetence) => TCF_SLOTS.find((s) => s.competence === competence)!
  for (const slot of TCF_SLOTS.filter((s) => s.competence === 'CE')) {
    const all = numberedBank(niveau, slot)
    const tagged = all.filter((ex) => /-ex\d+-/.test(ex.id))
    const pool = tagged.length > 0 ? tagged : all
    if (pool.length > 0) pages.push(page(slot.typeId, pick(rng, pool)))
  }
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
}

/**
 * Test complet tiré au hasard dans la banque du niveau : Informations,
 * CO selon le déroulé du niveau (A1 : 5 exercices, A2 : 4), 4 CE,
 * PE (formulaire, dialogue, message, e-mail),
 * PO (entretien dirigé, questions sur 3 thèmes, image et interaction).
 */
export function buildTcfRandomTestPages(
  niveau: TcfNiveau,
  seed: number,
  domain: TpfFamilyDomain = TPF_DOMAIN,
): PageConfig[] {
  const rng = createRng(seed)
  const pages: PageConfig[] = [tcfConsignesPage(niveau, domain)]
  appendNiveauExercisePages(pages, niveau, rng, domain)
  return pages
}

/**
 * Recette du domaine : TCF-CSC = A0-A1, TCF-CFR = A1-A2,
 * TPF = les trois niveaux (placement, A2-B1 compris).
 */
export function buildTpfFamilyTestPages(domain: string, seed: number): PageConfig[] {
  const d = canonicalTpfFamilyDomain(domain)
  const niveaux = tpfNiveauxForDomain(d)
  const rng = createRng(seed)
  const pages: PageConfig[] = [tcfConsignesPage(niveaux[0]!, d)]
  for (const niveau of niveaux) {
    appendNiveauExercisePages(pages, niveau, rng, d)
  }
  return pages
}
