import { createRng, shuffle } from '@/math/rng'
import { isLogistiqueDomain } from './domains'
import type { LogistiqueGenerationConfig, LogistiqueGenerationResult, LogistiqueUnit } from './types'
import { resolveLogistiqueBank, type BankResolver } from './registry'

function isApprovedFor(unit: LogistiqueUnit, diploma: 'AFP' | 'CFC'): boolean {
  const levelReview = unit.reviewByLevel[diploma]
  return unit.status === 'approved'
    && levelReview?.status === 'approved'
    && unit.eligibleLevels.includes(diploma)
    && unit.provenance.length > 0
    && unit.provenance.every(source => source.rights === 'permitted-reuse' || source.rights === 'project-original')
}

export function tryGenerateLogistiqueBlock(
  config: LogistiqueGenerationConfig,
  resolveBank?: BankResolver,
): LogistiqueGenerationResult {
  if (!isLogistiqueDomain(config.domain)) return { status: 'invalid', reason: 'Domaine logistique inconnu.', available: 0 }
  if (!Number.isSafeInteger(config.seed)) return { status: 'invalid', reason: 'La graine doit être un entier sûr.', available: 0 }
  if (config.quantity != null && (!Number.isInteger(config.quantity) || config.quantity < 1)) {
    return { status: 'invalid', reason: 'La quantité demandée doit être un entier positif.', available: 0 }
  }

  const resolved = resolveLogistiqueBank(config.domain, config.submoduleId, config.type, resolveBank)
  if (resolved.error) return { status: 'invalid', reason: resolved.error, available: 0 }
  if (!resolved.bank || !resolved.diploma || !resolved.submoduleCode) return { status: 'empty', reason: 'missing-bank', available: 0 }
  if (config.bankRevision && config.bankRevision !== resolved.bank.revision) {
    return { status: 'invalid', reason: 'La révision de banque demandée n’est plus disponible.', available: 0 }
  }

  const eligible = resolved.bank.units
    .filter(unit => isApprovedFor(unit, resolved.diploma!))
    .filter(unit => config.difficulty == null || config.difficulty === 'toutes' || unit.difficulty === config.difficulty)
    .filter(unit => {
      if (config.source == null || config.source === 'toutes') return true
      const wanted = config.source === 'originale' ? 'epcas' : 'original-doc-prof'
      return unit.provenance.some(source => source.origin === wanted)
    })
    .sort((left, right) => left.id.localeCompare(right.id, 'fr'))
  if (!eligible.length) return { status: 'empty', reason: 'no-approved-units', available: 0 }

  const stableUnits = config.type === 'theorie' || config.type === 'glossaire'
    ? eligible
    : shuffle(createRng(config.seed), eligible)
  const quantity = config.quantity ?? stableUnits.length
  const selected = stableUnits.slice(0, quantity)
  const snapshot = {
    schemaVersion: 1 as const,
    domain: config.domain,
    diploma: resolved.diploma,
    submoduleId: config.submoduleId,
    submoduleCode: resolved.submoduleCode,
    type: config.type,
    bankRevision: resolved.bank.revision,
    seed: config.seed,
    units: selected.map(unit => ({
      id: unit.id,
      revision: unit.revision,
      payload: structuredClone(unit.payload),
      ...(unit.correction ? { correction: structuredClone(unit.correction) } : {}),
    })),
  }
  return { status: 'ready', snapshot, available: eligible.length }
}
