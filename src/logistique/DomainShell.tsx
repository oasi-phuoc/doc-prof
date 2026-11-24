import { useMemo, useState } from 'react'
import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import type { Domain } from '@/math/types'
import { logistiqueDomainLabel, type LogistiqueDomain } from './domains'
import { LOGISTIQUE_TYPES, logistiqueCatalogCounts, logistiqueThemesForDomain, type LogistiqueSubmodule, type LogistiqueTheme, type LogistiqueType } from './catalog'

export type LogistiqueSelection = {
  themeId: string
  submoduleId: string
  type: LogistiqueType
}

type TypeSettings = {
  quantity: number
  difficulty: 'facile' | 'moyen' | 'avance'
  source: 'originale' | 'nouvelle' | 'toutes'
  format: string
  includeExamples: boolean
  includeSupports: boolean
}

const DEFAULT_TYPE_SETTINGS: Record<LogistiqueType, TypeSettings> = {
  theorie: { quantity: 1, difficulty: 'moyen', source: 'toutes', format: 'complet', includeExamples: true, includeSupports: true },
  maths: { quantity: 6, difficulty: 'moyen', source: 'toutes', format: 'calculs', includeExamples: false, includeSupports: true },
  verification: { quantity: 10, difficulty: 'moyen', source: 'toutes', format: 'toutes', includeExamples: false, includeSupports: false },
  situation: { quantity: 2, difficulty: 'moyen', source: 'toutes', format: 'tous-les-cas', includeExamples: false, includeSupports: true },
  glossaire: { quantity: 1, difficulty: 'moyen', source: 'toutes', format: 'terme-definition', includeExamples: true, includeSupports: false },
}

export function LogistiqueDomainSettings({ domain, allowedDomains, onDomainChange, selection, onSelectionChange }: {
  domain: LogistiqueDomain
  allowedDomains: Domain[]
  onDomainChange: (domain: Domain) => void
  selection: LogistiqueSelection
  onSelectionChange: (selection: LogistiqueSelection) => void
}) {
  const themes = useMemo(() => logistiqueThemesForDomain(domain), [domain])
  const counts = useMemo(() => logistiqueCatalogCounts(domain), [domain])
  const [settings, setSettings] = useState(DEFAULT_TYPE_SETTINGS)
  const activeTheme = themes.find((theme) => theme.id === selection.themeId) ?? themes[0]
  const activeSubmodule = activeTheme?.submodules.find((module) => module.id === selection.submoduleId) ?? activeTheme?.submodules[0]
  const activeType = LOGISTIQUE_TYPES.find((type) => type.id === selection.type) ?? LOGISTIQUE_TYPES[0]
  const activeSettings = settings[selection.type]

  function changeTheme(themeId: string) {
    const theme = themes.find((candidate) => candidate.id === themeId)
    onSelectionChange({ ...selection, themeId, submoduleId: theme?.submodules[0]?.id ?? '' })
  }

  function changeType(type: LogistiqueType) {
    onSelectionChange({ ...selection, type })
  }

  function updateSettings(patch: Partial<TypeSettings>) {
    setSettings((current) => ({ ...current, [selection.type]: { ...current[selection.type], ...patch } }))
  }

  const hasQuantity = selection.type === 'maths' || selection.type === 'verification' || selection.type === 'situation'
  const quantityLabel = selection.type === 'situation' ? 'Nombre de cas' : selection.type === 'maths' ? 'Nombre de problèmes' : 'Nombre de questions'

  return <aside className="settings-panel no-print logistique-catalog" aria-label={`Catalogue ${logistiqueDomainLabel(domain)}`}>
    <div className="field-group">
      <h2>Catalogue logistique</h2>
      <SelectBox label="Domaine" value={domain} onChange={value => onDomainChange(value as Domain)}>
        {ACCESS_DOMAIN_OPTIONS.filter(option => allowedDomains.includes(option.id)).map(option =>
          <option key={option.id} value={option.id}>{option.label}</option>,
        )}
      </SelectBox>
      <SelectBox label="Thème" value={activeTheme?.id ?? ''} onChange={changeTheme}>
        {themes.map(theme => <option key={theme.id} value={theme.id}>{theme.code} — {theme.label}</option>)}
      </SelectBox>
      <SelectBox label="Sous-thème" value={activeSubmodule?.id ?? ''} onChange={submoduleId => onSelectionChange({ ...selection, submoduleId })}>
        {(activeTheme?.submodules ?? []).map(module =>
          <option key={module.id} value={module.id}>{module.code} — {module.label}</option>,
        )}
      </SelectBox>
      {activeSubmodule ? <p className="logistique-year">{activeSubmodule.year}{activeSubmodule.year === 1 ? 're' : 'e'} année {domain === 'logistique-cfc' ? 'CFC' : 'AFP'}</p> : null}
    </div>
    <div className="logistique-type-group" aria-labelledby="logistique-types-title">
      <h3 id="logistique-types-title">Type de fiche</h3>
      <ol className="logistique-type-list">
        {LOGISTIQUE_TYPES.map((type) => <li key={type.id}>
          <button type="button" aria-pressed={selection.type === type.id} aria-describedby="logistique-bank-status" onClick={() => changeType(type.id)}>
            <span>{type.label}</span>
            <span className="logistique-type-state">À importer</span>
          </button>
        </li>)}
      </ol>
      <p className="logistique-bank-status" id="logistique-bank-status" role="status">
        Les banques de contenus ne sont pas encore raccordées. La génération reste désactivée jusqu’à la validation pédagogique.
      </p>
      <p className="logistique-catalog-count">{counts.themes} thèmes · {counts.submodules} sous-thèmes référencés</p>
    </div>
    <section className="logistique-type-settings" aria-labelledby="logistique-settings-title">
      <h3 id="logistique-settings-title">Réglages · {activeType.label}</h3>
      {hasQuantity ? <label className="logistique-setting">
        <span>{quantityLabel}</span>
        <input type="number" min={1} value={activeSettings.quantity} onChange={event => updateSettings({ quantity: Math.max(1, Number(event.target.value) || 1) })} />
      </label> : null}
      {selection.type !== 'theorie' && selection.type !== 'glossaire' ? <label className="logistique-setting">
        <span>Difficulté</span>
        <select value={activeSettings.difficulty} onChange={event => updateSettings({ difficulty: event.target.value as TypeSettings['difficulty'] })}>
          <option value="facile">Facile</option><option value="moyen">Moyenne</option><option value="avance">Avancée</option>
        </select>
      </label> : null}
      {selection.type === 'maths' || selection.type === 'verification' ? <label className="logistique-setting">
        <span>Provenance des exercices</span>
        <select value={activeSettings.source} onChange={event => updateSettings({ source: event.target.value as TypeSettings['source'] })}>
          <option value="toutes">Toutes les sources</option><option value="originale">Questions originales</option><option value="nouvelle">Questions nouvelles</option>
        </select>
      </label> : null}
      {selection.type === 'theorie' ? <label className="logistique-setting">
        <span>Format du cours</span>
        <select value={activeSettings.format} onChange={event => updateSettings({ format: event.target.value })}>
          <option value="complet">Cours complet</option><option value="resume">Résumé</option><option value="aide-memoire">Aide-mémoire</option>
        </select>
      </label> : null}
      {selection.type === 'verification' ? <label className="logistique-setting">
        <span>Formes de questions</span>
        <select value={activeSettings.format} onChange={event => updateSettings({ format: event.target.value })}>
          <option value="toutes">Toutes les formes</option><option value="qcm">Choix multiples</option><option value="ouvertes">Questions ouvertes</option><option value="vrai-faux">Vrai / Faux</option>
        </select>
      </label> : null}
      {selection.type === 'situation' ? <label className="logistique-setting">
        <span>Thèmes des cas</span>
        <select value={activeSettings.format} onChange={event => updateSettings({ format: event.target.value })}>
          <option value="tous-les-cas">Tous les thèmes</option><option value="transport">Transport</option><option value="stock">Stock et entreposage</option><option value="securite">Sécurité au travail</option>
        </select>
      </label> : null}
      {selection.type === 'glossaire' ? <>
        <label className="logistique-setting">
          <span>Présentation</span>
          <select value={activeSettings.format} onChange={event => updateSettings({ format: event.target.value })}>
            <option value="terme-definition">Terme et définition</option><option value="a-completer">Définitions à compléter</option><option value="associations">Associations à relier</option>
          </select>
        </label>
        <label className="logistique-setting">
          <span>Ordre des termes</span>
          <select value={activeSettings.source} onChange={event => updateSettings({ source: event.target.value as TypeSettings['source'] })}>
            <option value="toutes">Ordre pédagogique</option><option value="originale">Ordre alphabétique</option>
          </select>
        </label>
      </> : null}
      {selection.type === 'maths' ? <label className="logistique-setting-check"><input type="checkbox" checked={activeSettings.includeSupports} onChange={event => updateSettings({ includeSupports: event.target.checked })} />Prévoir un espace de calcul</label> : null}
      {selection.type === 'verification' ? <label className="logistique-setting-check"><input type="checkbox" checked={activeSettings.includeSupports} onChange={event => updateSettings({ includeSupports: event.target.checked })} />Prévoir un espace de réponse</label> : null}
      {selection.type === 'situation' ? <label className="logistique-setting-check"><input type="checkbox" checked={activeSettings.includeSupports} onChange={event => updateSettings({ includeSupports: event.target.checked })} />Inclure les documents supports disponibles</label> : null}
      {selection.type === 'theorie' || selection.type === 'glossaire' ? <label className="logistique-setting-check"><input type="checkbox" checked={activeSettings.includeExamples} onChange={event => updateSettings({ includeExamples: event.target.checked })} />Inclure les exemples</label> : null}
      <p className="logistique-count-note">Les options seront appliquées aux contenus disponibles après import et validation. Aucune question fictive n’est générée.</p>
    </section>
  </aside>
}

export function LogistiqueDomainEmpty({ domain, selection, theme, submodule }: {
  domain: LogistiqueDomain
  selection: LogistiqueSelection
  theme?: LogistiqueTheme
  submodule?: LogistiqueSubmodule
}) {
  const type = LOGISTIQUE_TYPES.find((option) => option.id === selection.type) ?? LOGISTIQUE_TYPES[0]

  return <section className="result-panel logistique-empty no-print" aria-labelledby="logistique-domain-title">
    <div className="logistique-preview-card">
      <span className="logistique-preview-kicker">Fiche pédagogique imprimable</span>
      <h2 id="logistique-domain-title">{domain === 'logistique-cfc' ? 'CFC' : 'AFP'} · {submodule ? `${submodule.code} — ${submodule.label}` : logistiqueDomainLabel(domain)}</h2>
      <p>{theme ? `${theme.code} — ${theme.label} · ` : ''}{type.label}</p>
      <p>La structure de la fiche est sélectionnée. Son aperçu élève et son corrigé apparaîtront ici dès que la banque correspondante sera importée et validée.</p>
      <div className="logistique-preview-meta">
        <span>{submodule ? `${submodule.year}${submodule.year === 1 ? 're' : 'e'} année` : 'Sous-thème à sélectionner'}</span>
        <span>Génération indisponible · banque non validée</span>
      </div>
    </div>
  </section>
}
