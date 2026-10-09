/** Domaine TCM (test de connaissance de mathématiques) — hors `src/math/`. */

export {
  TCM_DOMAIN,
  TCM_DOCUMENT_TITLE,
  TCM_MAX_SCORE,
  TCM_STEPS,
  blockPointsTotal,
  buildTcmTestPages,
  formatPointsLabel,
  isTcmConsignesType,
  isTcmDomain,
} from './test'

export { generateTcmConversionsBatch } from './conversions'
export { generateTcmEquationsBatch } from './equations'
export { generateTcmEvaluerBatch } from './evaluer'
export {
  generateTcmInformations,
  isTcmFamilyConsignesType,
  type TcmInfoVariant,
} from './informations'
export { tryGenerateTcmItems } from './items'
export { generateTcmPrioriteBatch } from './priorite'
export { generateTcmProportionKgBatch } from './proportion-kg'
export { generateTcmReduireBatch } from './reduire'
