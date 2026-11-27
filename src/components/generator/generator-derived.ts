import {
  algebraTopics,
  calligraphieTopics,
  exerciseTypeById,
  geometryTopics,
  gattegnoTopics,
  grammaireTopics,
  jeuxTopics,
  alphabetisationTopics,
  logiqueTopics,
  santeTopics,
  societeTopics,
  soutienFrTopics,
  acmTopics,
  tcmCscTopics,
  tcmCfrTopics,
  tcfTopics,
  tpmTopics,
  typesForTopic,
  vocabulaireTopics,
} from '@/math/catalog'
import { isTpfFamilyDomain } from '@/tcf/catalog'
import { blockPointsTotal, isTpmDomain } from '@/tpm/test'
import {
  ALPHA_LETTER_KINDS,
  ALPHA_SPECIAL_KINDS,
  parseAlphaType,
} from '@/alphabetisation/kinds'
import {
  alphaExerciseTypeId,
  alphaThemeById,
  resolveAlphaSelection,
} from '@/alphabetisation/themes'
import { SOUTIEN_KINDS, parseSoutienType } from '@/francais/soutien/kinds'
import { soutienBankById } from '@/francais/soutien/banks'
import { audioOrderKind, defaultAudioOrderCapacity } from '@/francais/soutien/audio-order'
import { SOUTIEN_LISTEN_MAX, SOUTIEN_SYLLABLE_PAIR_MAX } from '@/francais/soutien/gen-kind-helpers'
import {
  resolveSoutienSelection,
  soutienExerciseTypeId,
} from '@/francais/soutien/themes'
import {
  gramExerciseTypeId,
  resolveGramSubthemeAll,
  subthemesForTopicAll,
} from '@/grammaire/exercises'
import { GRAM_EXERCISE_KINDS } from '@/grammaire/exercises/kinds'
import { GRAMMAR_NEW_PILOT_TYPES, GRAMMAR_PILOT_BANKS, grammarBanksForType } from '@/grammaire/curriculum/registry'
import { COORD_LETTER_MAX, COORD_SHAPES } from '@/math/coord-reperage'
import { TRANSFORM_MAX_POINTS } from '@/math/coord-transformations'
import { isLogistiqueDomain, logistiqueTopics, logistiqueTypeChoices } from '@/logistique/catalog'
import type { Domain, ExerciseBlock, WorksheetPage } from '@/math/types'

/** Thèmes du sélecteur selon le domaine actif. */
export function topicsForDomain(domain: Domain) {
  if (isLogistiqueDomain(domain)) return logistiqueTopics.filter((topic) => topic.domain === domain)
  return domain === 'algèbre'
    ? algebraTopics
    : domain === 'géométrie'
      ? geometryTopics
      : domain === 'gattegno'
        ? gattegnoTopics
        : domain === 'grammaire'
          ? grammaireTopics
          : domain === 'vocabulaire'
            ? vocabulaireTopics
            : domain === 'société'
              ? societeTopics
              : domain === 'santé'
                ? santeTopics
                : domain === 'acm'
                  ? acmTopics
                  : domain === 'tcm-csc'
                    ? tcmCscTopics
                    : domain === 'tcm-cfr'
                      ? tcmCfrTopics
                      : domain === 'jeux'
                        ? jeuxTopics
                        : domain === 'calligraphie'
                          ? calligraphieTopics
                          : domain === 'soutien-fr'
                            ? soutienFrTopics
                            : domain === 'alphabetisation'
                              ? alphabetisationTopics
                              : domain === 'logique'
                                ? logiqueTopics
                                : isTpmDomain(domain)
                                  ? tpmTopics
                                  : isTpfFamilyDomain(domain)
                                    ? tcfTopics
                                    : algebraTopics
}

/** Types d’exercice proposés pour le bloc actif. */
export function typeChoicesForBlock(
  domain: Domain,
  block: Pick<ExerciseBlock, 'exerciseType' | 'topic' | 'track'>,
) {
  if (isLogistiqueDomain(domain)) return logistiqueTypeChoices(block.topic, block.exerciseType)
  if (domain === 'soutien-fr') {
    const bankId =
      parseSoutienType(block.exerciseType)?.bankId ??
      resolveSoutienSelection(block.topic, block.exerciseType)?.sound.bankId ??
      'a'
    const bank = soutienBankById(bankId)
    return SOUTIEN_KINDS.filter(({ id }) => !bank || !audioOrderKind(id) ||
      soutienExerciseTypeId(bankId, id) === block.exerciseType || defaultAudioOrderCapacity(bank, id) > 0).map(
      (kind) => exerciseTypeById[soutienExerciseTypeId(bankId, kind.id)],
    ).filter((t): t is NonNullable<typeof t> => Boolean(t))
  }
  if (domain === 'alphabetisation') {
    const bankId =
      parseAlphaType(block.exerciseType)?.bankId ??
      resolveAlphaSelection(block.topic, block.exerciseType)?.sound.bankId ??
      'a'
    const theme = alphaThemeById(block.topic)
    const kinds =
      theme?.mode === 'special'
        ? ALPHA_SPECIAL_KINDS.filter((k) =>
            Boolean(exerciseTypeById[alphaExerciseTypeId(bankId, k.id)]),
          )
        : ALPHA_LETTER_KINDS
    const bank = soutienBankById(bankId)
    return kinds.filter(({ id }) => !bank || !audioOrderKind(id) ||
      alphaExerciseTypeId(bankId, id) === block.exerciseType || defaultAudioOrderCapacity(bank, id) > 0)
      .map((kind) => exerciseTypeById[alphaExerciseTypeId(bankId, kind.id)])
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
  }
  if (domain === 'grammaire') {
    const sub =
      resolveGramSubthemeAll(block.topic, block.exerciseType) ??
      subthemesForTopicAll(block.topic)[0]
    if (!sub) {
      return typesForTopic(block.topic)
    }
    const theory = sub.theoryTypeIds
      .map((id) => exerciseTypeById[id])
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => ({ ...t, label: 'Théorie' }))
    const practice = GRAM_EXERCISE_KINDS.map((kind) => {
      const id = gramExerciseTypeId(sub.id, kind.id)
      return exerciseTypeById[id]
    }).filter((t): t is NonNullable<typeof t> => Boolean(t))
    const graded=GRAMMAR_NEW_PILOT_TYPES.filter(type=>grammarBanksForType(type.id).some(bank=>bank.subthemeId===sub.id))
    if(['c1','c2','c3'].includes(sub.id)){
      const ids=[...new Set(GRAMMAR_PILOT_BANKS.filter(b=>b.subthemeId===sub.id).map(b=>b.activityId))]
      return [...theory,...ids.map(id=>exerciseTypeById[id]).filter((t):t is NonNullable<typeof t>=>Boolean(t))]
    }
    const choices=[...theory, ...practice, ...graded]
    if(sub.id==='famille'){
      // Family readings use Photo de famille; writing remains last.
      const available=choices.filter(t=>t.id!=='gram-ex-famille-fam-recit')
      return [...available.filter(t=>t.id!=='gram-ex-famille-fam-pe'),...available.filter(t=>t.id==='gram-ex-famille-fam-pe')]
    }
    return choices
  }
  return typesForTopic(
    block.topic,
    domain === 'français' ? (block.track ?? 'voc') : undefined,
  )
}

type MaxQuestionsFlags = {
  isComposer: boolean
  isFormes: boolean
  isTransform: boolean
  isReperage: boolean
  soutienKind: string | undefined
}

/** Plafond du champ Questions / Mots / Lignes selon le type. */
export function maxQuestionsFor({
  isComposer,
  isFormes,
  isTransform,
  isReperage,
  soutienKind,
}: MaxQuestionsFlags): number {
  if (isComposer) return COORD_LETTER_MAX - 1
  if (isFormes) return COORD_SHAPES.length
  if (isTransform) return TRANSFORM_MAX_POINTS
  if (isReperage) return COORD_LETTER_MAX
  if (soutienKind === 'lettres' || soutienKind === 'lettres-maj' || soutienKind === 'lettres-min')
    return 15
  if (soutienKind === 'syllabes' || soutienKind === 'syllabes-cv' || soutienKind === 'syllabes-long')
    return 10
  if (
    soutienKind === 'souligner-maj' ||
    soutienKind === 'souligner-min' ||
    soutienKind === 'syllabes-prononcer'
  ) {
    return 16
  }
  if (soutienKind === 'relier') return SOUTIEN_SYLLABLE_PAIR_MAX
  if (
    soutienKind === 'completer' ||
    soutienKind === 'syllabe-son' ||
    soutienKind === 'syllabe-son-qr'
  ) {
    return 18
  }
  if (soutienKind === 'ecouter' || soutienKind === 'ecouter-image') return SOUTIEN_LISTEN_MAX
  if (
    soutienKind === 'lettres-phrase' ||
    soutienKind === 'determinants' ||
    soutienKind === 'dictee'
  ) {
    return 16
  }
  if (soutienKind === 'compter' || soutienKind === 'ordre') return 12
  if (soutienKind === 'lire') return 19
  if (
    soutienKind === 'associer-audio' ||
    soutienKind === 'associer-image' ||
    soutienKind === 'associer-syllabe'
  ) {
    return 3
  }
  return 30
}

/** Total des points du document (toutes les feuilles de l’aperçu). */
export function sheetTotalPoints(
  previewWorksheets: WorksheetPage[],
  pointsPerQuestion: number,
): number {
  return previewWorksheets.reduce(
    (sum, page) =>
      sum +
      (page.blocks?.length
        ? page.blocks.reduce(
            (blockSum, block) =>
              blockSum +
              blockPointsTotal(block.items, block.pointsPerQuestion ?? pointsPerQuestion),
            0,
          )
        : blockPointsTotal(page.items, page.pointsPerQuestion ?? pointsPerQuestion)),
    0,
  )
}
