import { useMemo, useState } from 'react'
import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import type { Domain } from '@/math/types'
import { logistiqueDomainLabel, type LogistiqueDomain } from './domains'
import { LOGISTIQUE_TYPES, logistiqueCatalogCounts, logistiqueThemesForDomain } from './catalog'

export function LogistiqueDomainSettings({ domain, allowedDomains, onDomainChange }: {
  domain: LogistiqueDomain
  allowedDomains: Domain[]
  onDomainChange: (domain: Domain) => void
}) {
  const themes = useMemo(() => logistiqueThemesForDomain(domain), [domain])
  const counts = useMemo(() => logistiqueCatalogCounts(domain), [domain])
  const [themeId, setThemeId] = useState('')
  const [submoduleId, setSubmoduleId] = useState('')
  const activeTheme = themes.find((theme) => theme.id === themeId) ?? themes[0]
  const activeSubmodule = activeTheme?.submodules.find((module) => module.id === submoduleId) ?? activeTheme?.submodules[0]

  function changeTheme(nextThemeId: string) {
    setThemeId(nextThemeId)
    setSubmoduleId('')
  }

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
      <SelectBox label="Sous-thème" value={activeSubmodule?.id ?? ''} onChange={setSubmoduleId}>
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
          <button type="button" disabled aria-describedby="logistique-bank-status">
            <span>{type.label}</span>
            <span className="logistique-type-state">À importer</span>
          </button>
        </li>)}
      </ol>
      <p className="logistique-bank-status" id="logistique-bank-status" role="status">
        Les contenus et corrigés du référentiel sont en cours d’importation et de vérification. Aucun exercice non validé n’est proposé.
      </p>
      <p className="logistique-catalog-count">{counts.themes} thèmes · {counts.submodules} sous-thèmes référencés</p>
    </div>
  </aside>
}

export function LogistiqueDomainEmpty({ domain }: { domain: LogistiqueDomain }) {
  const [pageCount, setPageCount] = useState(1)
  const [exerciseCounts, setExerciseCounts] = useState([1])
  const [activePage, setActivePage] = useState(0)
  const [mode, setMode] = useState<'exercise' | 'evaluation'>('exercise')

  function addPage() {
    setPageCount((count) => count + 1)
    setExerciseCounts((counts) => [...counts, 1])
    setActivePage(pageCount)
  }

  function addExercise() {
    setExerciseCounts((counts) => counts.map((count, index) => index === activePage ? count + 1 : count))
  }

  return <section className="result-panel logistique-empty no-print" aria-labelledby="logistique-domain-title">
    <div className="logistique-document-tools">
      <div className="logistique-page-tabs" role="tablist" aria-label="Pages de la fiche">
        {Array.from({ length: pageCount }, (_, index) => <button
          key={index}
          type="button"
          role="tab"
          aria-selected={activePage === index}
          className={activePage === index ? 'active' : ''}
          onClick={() => setActivePage(index)}
        >Page {index + 1}</button>)}
      </div>
      <div className="logistique-structure-actions">
        <button className="button secondary" type="button" onClick={addPage}>+ Page</button>
        <button className="button secondary" type="button" onClick={addExercise}>+ Exercice</button>
      </div>
      <div className="logistique-mode-toggle" role="group" aria-label="Mode de la fiche">
        <button type="button" className={mode === 'exercise' ? 'active' : ''} aria-pressed={mode === 'exercise'} onClick={() => setMode('exercise')}>Mode exercice</button>
        <button type="button" className={mode === 'evaluation' ? 'active' : ''} aria-pressed={mode === 'evaluation'} onClick={() => setMode('evaluation')}>Mode évaluation</button>
      </div>
    </div>
    <span className="logistique-empty-kicker">Fiches pédagogiques imprimables</span>
    <h2 id="logistique-domain-title">{logistiqueDomainLabel(domain)}</h2>
    <p>Le catalogue officiel est prêt. Les banques de cours, exercices et corrigés seront activées après leur import et leur validation pédagogique.</p>
    <p className="logistique-current-structure" aria-live="polite">Page {activePage + 1} · {exerciseCounts[activePage] ?? 1} exercice{(exerciseCounts[activePage] ?? 1) > 1 ? 's' : ''} · {mode === 'exercise' ? 'Mode exercice' : 'Mode évaluation'}</p>
    <div className="logistique-empty-meta">
      <span>Référentiel EPCAS</span>
      <span>Génération A4 à venir</span>
    </div>
  </section>
}
