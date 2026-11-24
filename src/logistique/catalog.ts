import curriculum from './curriculum.json'
import type { LogistiqueDomain } from './domains'

export type LogistiqueLevel = 'AFP' | 'CFC'
export type LogistiqueType = 'theorie' | 'maths' | 'verification' | 'situation' | 'glossaire'

export type LogistiqueTheme = {
  id: string
  code: string
  label: string
  submodules: LogistiqueSubmodule[]
}

export type LogistiqueSubmodule = {
  id: string
  code: string
  themeId: string
  label: string
  year: 1 | 2 | 3
  domain: LogistiqueDomain
}

export const LOGISTIQUE_TYPES: readonly { id: LogistiqueType; label: string }[] = [
  { id: 'theorie', label: 'Théorie' },
  { id: 'maths', label: 'Mathématiques' },
  { id: 'verification', label: 'Vérification des connaissances' },
  { id: 'situation', label: 'Mises en situation' },
  { id: 'glossaire', label: 'Glossaires' },
]

const DOMAIN_LEVEL: Record<LogistiqueDomain, LogistiqueLevel> = {
  'logistique-cfc': 'CFC',
  'logistique-afp': 'AFP',
}

const DOMAIN_PREFIX: Record<LogistiqueDomain, 'cfc' | 'afp'> = {
  'logistique-cfc': 'cfc',
  'logistique-afp': 'afp',
}

export function logistiqueThemesForDomain(domain: LogistiqueDomain): LogistiqueTheme[] {
  const level = DOMAIN_LEVEL[domain]
  const prefix = DOMAIN_PREFIX[domain]
  const eligible = curriculum.modules.filter((module) => module.eligibleLevels.includes(level))
  const themes = new Map<string, LogistiqueTheme>()

  for (const module of eligible) {
    if (!module.themeCode || !module.themeTitle) continue
    const themeId = `log-${prefix}-theme-${module.themeCode}`
    let theme = themes.get(themeId)
    if (!theme) {
      theme = { id: themeId, code: module.themeCode, label: module.themeTitle, submodules: [] }
      themes.set(themeId, theme)
    }
    const year = module.years[level]
    if (year !== 1 && year !== 2 && year !== 3) continue
    theme.submodules.push({
      id: `log-${prefix}-sub-${module.code}`,
      code: module.code,
      themeId,
      label: module.title,
      year,
      domain,
    })
  }

  return [...themes.values()].sort((a, b) => Number(a.code) - Number(b.code))
}

export function logistiqueTypeId(
  domain: LogistiqueDomain,
  submoduleCode: string,
  type: LogistiqueType,
): string {
  return `log-${DOMAIN_PREFIX[domain]}-${submoduleCode}-${type}`
}

export function logistiqueCatalogCounts(domain: LogistiqueDomain) {
  const themes = logistiqueThemesForDomain(domain)
  return {
    themes: themes.length,
    submodules: themes.reduce((count, theme) => count + theme.submodules.length, 0),
  }
}
