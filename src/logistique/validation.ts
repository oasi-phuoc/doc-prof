import { isLogistiqueDomain } from './domains'
import { logistiqueTypeId, logistiqueThemesForDomain, type LogistiqueLevel, type LogistiqueType } from './catalog'
import type { LogistiqueBank, LogistiqueCorrection, LogistiquePayload, LogistiqueUnit } from './types'

const validDifficulty = new Set(['facile', 'moyen', 'avance'])
const validStatus = new Set(['imported-unreviewed', 'draft', 'reviewed', 'approved', 'blocked', 'not-applicable', 'retired'])

export function diplomaForDomain(domain: string): LogistiqueLevel | null {
  if (domain === 'logistique-cfc') return 'CFC'
  if (domain === 'logistique-afp') return 'AFP'
  return null
}

export function validateLogistiquePayload(type: LogistiqueType, payload: LogistiquePayload): string[] {
  const errors: string[] = []
  const nonEmpty = (value: string, field: string) => {
    if (!value.trim()) errors.push(`${field} doit être renseigné.`)
  }

  switch (type) {
    case 'theorie':
      if (payload.kind !== 'theory') errors.push('Le type théorie exige un payload theory.')
      else {
        nonEmpty(payload.title, 'Le titre')
        nonEmpty(payload.markdown, 'Le contenu')
        nonEmpty(payload.sectionId, 'L’identifiant de section')
      }
      break
    case 'glossaire':
      if (payload.kind !== 'glossary') errors.push('Le type glossaire exige un payload glossary.')
      else {
        nonEmpty(payload.term, 'Le terme')
        nonEmpty(payload.definition, 'La définition')
      }
      break
    case 'maths':
      if (payload.kind !== 'calculation') errors.push('Le type maths exige un payload calculation.')
      else {
        nonEmpty(payload.prompt, 'L’énoncé')
        if (!Number.isInteger(payload.responseLines) || payload.responseLines < 0) errors.push('Le nombre de lignes de réponse est invalide.')
      }
      break
    case 'verification':
      if (payload.kind !== 'question') errors.push('La vérification exige un payload question.')
      else {
        nonEmpty(payload.prompt, 'La question')
        if (payload.format === 'qcm' || payload.format === 'multi') {
          const ids = payload.options?.map(option => option.id) ?? []
          if (ids.length < 2 || new Set(ids).size !== ids.length || payload.options?.some(option => !option.text.trim())) {
            errors.push('Un QCM doit avoir au moins deux options distinctes et renseignées.')
          }
        }
      }
      break
    case 'situation':
      if (payload.kind !== 'scenario') errors.push('Une mise en situation exige un payload scenario.')
      else {
        nonEmpty(payload.title, 'Le titre du cas')
        nonEmpty(payload.context, 'Le contexte')
        nonEmpty(payload.mission, 'La mission')
        if (!Number.isInteger(payload.responseLines) || payload.responseLines < 0) errors.push('Le nombre de lignes de réponse est invalide.')
      }
      break
  }
  return errors
}

export function validateLogistiqueCorrection(correction: LogistiqueCorrection | undefined): string[] {
  if (!correction) return []
  if (correction.kind === 'choice') {
    const ids = correction.options.map(option => option.id)
    if (ids.length < 2 || new Set(ids).size !== ids.length) return ['Les options du corrigé doivent avoir des identifiants distincts.']
    if (!correction.correctIds.length || correction.correctIds.some(id => !ids.includes(id))) return ['Le corrigé doit référencer une ou plusieurs options existantes.']
  }
  if (correction.kind === 'numeric' && (!Number.isFinite(correction.value) || !Number.isFinite(correction.tolerance) || correction.tolerance < 0)) {
    return ['La valeur ou la tolérance numérique du corrigé est invalide.']
  }
  if (correction.kind === 'open' && correction.criteria.some(criterion => !criterion.description.trim() || criterion.points != null && (!Number.isFinite(criterion.points) || criterion.points < 0))) {
    return ['Les critères de correction ouverte sont invalides.']
  }
  return []
}

export function validateLogistiqueUnit(unit: LogistiqueUnit, bank: Pick<LogistiqueBank, 'submoduleCode' | 'type'>): string[] {
  const errors: string[] = []
  if (!unit.id.trim()) errors.push('Identifiant d’unité manquant.')
  if (!unit.revision.trim()) errors.push(`Révision manquante pour ${unit.id || 'une unité'}.`)
  if (unit.submoduleCode !== bank.submoduleCode || unit.type !== bank.type) errors.push(`L’unité ${unit.id} ne correspond pas à sa banque.`)
  if (!unit.objectiveIds.length || unit.objectiveIds.some(id => !id.trim())) errors.push(`Objectifs manquants pour ${unit.id}.`)
  if (!validDifficulty.has(unit.difficulty)) errors.push(`Difficulté invalide pour ${unit.id}.`)
  if (!Number.isInteger(unit.bloomLevel) || unit.bloomLevel < 1 || unit.bloomLevel > 6) errors.push(`Niveau de Bloom invalide pour ${unit.id}.`)
  if (!validStatus.has(unit.status)) errors.push(`Statut éditorial invalide pour ${unit.id}.`)
  if (!unit.eligibleLevels.length || unit.eligibleLevels.some(level => level !== 'CFC' && level !== 'AFP')) errors.push(`Éligibilité invalide pour ${unit.id}.`)
  if (!unit.provenance.length || unit.provenance.some(source => !source.path.trim() || source.rights === 'pending')) errors.push(`Provenance ou droits non résolus pour ${unit.id}.`)
  if (unit.payload.kind === 'question' && unit.payload.format !== 'qcm' && unit.payload.options) errors.push(`Options inattendues pour ${unit.id}.`)
  errors.push(...validateLogistiquePayload(unit.type, unit.payload).map(error => `${unit.id}: ${error}`))
  errors.push(...validateLogistiqueCorrection(unit.correction).map(error => `${unit.id}: ${error}`))
  if ((unit.type === 'maths' || unit.type === 'verification' || unit.type === 'situation') && !unit.correction) {
    errors.push(`Correction obligatoire pour ${unit.id}.`)
  }
  if (unit.type === 'maths' && unit.correction?.kind !== 'numeric') errors.push(`Le corrigé de ${unit.id} doit être numérique.`)
  if (unit.type === 'situation' && unit.correction?.kind !== 'open') errors.push(`Le corrigé de ${unit.id} doit contenir des critères ouverts.`)
  if (unit.type === 'verification' && unit.payload.kind === 'question') {
    const expected: Record<typeof unit.payload.format, LogistiqueCorrection['kind']> = {
      qcm: 'choice', multi: 'choice', true_false: 'boolean', open: 'open', matching: 'matching', ordering: 'ordering', fill_blank: 'gap',
    }
    if (unit.correction?.kind !== expected[unit.payload.format]) errors.push(`Le corrigé de ${unit.id} ne correspond pas au format de la question.`)
  }
  for (const level of unit.eligibleLevels) {
    const review = unit.reviewByLevel[level]
    if (unit.status === 'approved' && review?.status !== 'approved') errors.push(`${unit.id}: validation explicite ${level} requise.`)
    if (review?.status === 'approved' && !review.revision.trim()) errors.push(`${unit.id}: révision de validation ${level} manquante.`)
    const resolution = unit.provenance.some(source => source.resolution === 'inherited-cfc')
    if (level === 'AFP' && resolution && review?.status !== 'approved') errors.push(`${unit.id}: héritage CFC non validé pour AFP.`)
  }
  return errors
}

export function validateLogistiqueBank(bank: LogistiqueBank): string[] {
  const errors: string[] = []
  if (bank.schemaVersion !== 1) errors.push('Version de schéma de banque non prise en charge.')
  if (!bank.revision.trim()) errors.push('Révision de banque manquante.')
  const ids = new Set<string>()
  for (const unit of bank.units) {
    if (ids.has(unit.id)) errors.push(`Identifiant dupliqué : ${unit.id}.`)
    ids.add(unit.id)
    errors.push(...validateLogistiqueUnit(unit, bank))
  }
  return errors
}

export function validateGenerationTarget(domain: string, submoduleId: string, type: LogistiqueType): string | null {
  if (!isLogistiqueDomain(domain)) return 'Domaine logistique inconnu.'
  const level = diplomaForDomain(domain)
  const modules = logistiqueThemesForDomain(domain).flatMap(theme => theme.submodules)
  const submodule = modules.find(module => module.id === submoduleId)
  if (!level || !submodule) return 'Sous-thème non éligible pour ce diplôme.'
  if (logistiqueTypeId(domain, submodule.code, type) !== `log-${domain === 'logistique-cfc' ? 'cfc' : 'afp'}-${submodule.code}-${type}`) {
    return 'Type de fiche invalide pour ce sous-thème.'
  }
  return null
}
