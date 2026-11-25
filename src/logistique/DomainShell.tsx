import { useMemo, useState } from 'react'
import type { LogistiqueGenerationConfig, LogistiqueGenerationResult } from './types'
import './branding.css'
import { LogistiquePrintableDocument } from './PrintableDocument'
import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import type { Domain } from '@/math/types'
import { logistiqueDomainLabel, type LogistiqueDomain } from './domains'
import { LOGISTIQUE_TYPES, logistiqueCatalogCounts, logistiqueThemesForDomain, type LogistiqueSubmodule, type LogistiqueTheme, type LogistiqueType } from './catalog'
import { IMPORTED_LOGISTIQUE_BANKS, IMPORTED_LOGISTIQUE_COUNTS, IMPORTED_LOGISTIQUE_REPORT, logistiqueBankKey } from './registry'

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

export function LogistiqueDomainSettings({ domain, allowedDomains, onDomainChange, selection, onSelectionChange, onGenerate }: {
  domain: LogistiqueDomain
  allowedDomains: Domain[]
  onDomainChange: (domain: Domain) => void
  selection: LogistiqueSelection
  onSelectionChange: (selection: LogistiqueSelection) => void
  onGenerate: (config: Omit<LogistiqueGenerationConfig, 'seed'>) => void
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
        {LOGISTIQUE_TYPES.map((type) => {
          const bank = activeSubmodule ? IMPORTED_LOGISTIQUE_BANKS[logistiqueBankKey(domain, activeSubmodule.code, type.id)] : undefined
          const level = domain === 'logistique-afp' ? 'AFP' : 'CFC'
          const importedCount = bank?.sourceUnitCount ?? bank?.units.length ?? 0
          const approvedCount = bank?.units.filter(unit => unit.status === 'approved' && unit.eligibleLevels.includes(level) && unit.reviewByLevel[level]?.status === 'approved').length ?? 0
          const pendingCount = Math.max(0, importedCount - approvedCount)
          const bankStatus = !bank ? 'À importer' : importedCount === 0 ? 'Source à compléter' : pendingCount > 0 ? `${pendingCount} source(s) · à valider` : `${approvedCount} approuvée(s)`
          return <li key={type.id}>
            <button type="button" aria-pressed={selection.type === type.id} aria-describedby="logistique-bank-status" onClick={() => changeType(type.id)}>
              <span>{type.label}</span>
              <span className="logistique-type-state">{bankStatus}</span>
            </button>
          </li>
        })}
      </ol>
      <p className="logistique-bank-status" id="logistique-bank-status" role="status">
        Le moteur accepte uniquement des banques raccordées et des unités approuvées pour le diplôme choisi.
      </p>
      <p className="logistique-catalog-count">{counts.themes} thèmes · {counts.submodules} sous-thèmes référencés</p>
      <p className="logistique-catalog-count">{IMPORTED_LOGISTIQUE_COUNTS.populatedBanks}/{IMPORTED_LOGISTIQUE_COUNTS.catalogBanks} banques alimentées · {IMPORTED_LOGISTIQUE_REPORT.sourcePages.populated}/{IMPORTED_LOGISTIQUE_REPORT.sourcePages.curriculumPages} pages source avec contenu</p>
      <p className="logistique-bank-status">{IMPORTED_LOGISTIQUE_COUNTS.uniqueUnits.toLocaleString('fr-CH')} unités sources archivées · {IMPORTED_LOGISTIQUE_COUNTS.approvedUnits} publiée(s). {IMPORTED_LOGISTIQUE_REPORT.review.quarantineCount} éléments à vérifier; le contenu EPCAS reste hors génération tant que la revue pédagogique et les droits ne sont pas validés.</p>
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
      <button className="button logistique-generate" type="button" disabled={!activeSubmodule} onClick={() => onGenerate({
        domain,
        submoduleId: activeSubmodule?.id ?? '',
        type: selection.type,
        quantity: hasQuantity ? activeSettings.quantity : undefined,
        difficulty: selection.type === 'theorie' || selection.type === 'glossaire' ? 'toutes' : activeSettings.difficulty,
        source: selection.type === 'glossaire' ? 'toutes' : activeSettings.source,
      })}>Générer la fiche</button>
      <p className="logistique-count-note">La génération utilise uniquement les unités approuvées pour ce diplôme. Aucune question fictive n’est créée.</p>
    </section>
  </aside>
}

export function LogistiqueDomainResult({ domain, selection, theme, submodule, result, mode, onModeChange, onPrint }: {
  domain: LogistiqueDomain
  selection: LogistiqueSelection
  theme?: LogistiqueTheme
  submodule?: LogistiqueSubmodule
  result: LogistiqueGenerationResult | null
  mode: 'student' | 'answers'
  onModeChange: (mode: 'student' | 'answers') => void
  onPrint: () => void
}) {
  const type = LOGISTIQUE_TYPES.find((option) => option.id === selection.type) ?? LOGISTIQUE_TYPES[0]
  const title = `${submodule?.label ?? logistiqueDomainLabel(domain)} · ${type.label}`

  if (result?.status === 'ready') return <section className="result-panel logistique-result">
    <div className="logistique-result-toolbar no-print"><div><p className="eyebrow">Aperçu imprimable</p><h2>{mode === 'student' ? 'Fiche élève' : 'Corrigé'}</h2><p>{result.snapshot.units.length} unité(s) tirée(s) sur {result.available} disponible(s).</p></div><div className="logistique-result-actions"><button className="button small" type="button" aria-pressed={mode === 'student'} onClick={() => onModeChange('student')}>Fiche élève</button>{result.snapshot.units.some(unit => unit.correction) ? <button className="button small" type="button" aria-pressed={mode === 'answers'} onClick={() => onModeChange('answers')}>Corrigé</button> : null}<button className="button small" type="button" onClick={onPrint}>Imprimer</button></div></div>
    <LogistiquePrintableDocument snapshot={result.snapshot} title={title} mode={mode} />
  </section>

  return <section className="result-panel logistique-empty no-print" aria-labelledby="logistique-domain-title">
    <div className="logistique-preview-card">
      <span className="logistique-preview-kicker">Fiche pédagogique imprimable</span>
      <h2 id="logistique-domain-title">{domain === 'logistique-cfc' ? 'CFC' : 'AFP'} · {submodule ? `${submodule.code} — ${submodule.label}` : logistiqueDomainLabel(domain)}</h2>
      <p>{theme ? `${theme.code} — ${theme.label} · ` : ''}{type.label}</p>
      <p>{result?.status === 'empty' ? result.reason === 'missing-bank' ? 'Aucune banque n’est encore raccordée à ce sous-thème. Importez et validez les unités pour activer le tirage.' : 'La banque existe, mais aucune unité n’est approuvée pour ce diplôme et ces filtres.' : result?.status === 'invalid' ? result.reason : 'Configurez la fiche, puis lancez le tirage pour afficher l’aperçu élève et le corrigé.'}</p>
      <div className="logistique-preview-meta"><span>{submodule ? `${submodule.year}${submodule.year === 1 ? 're' : 'e'} année` : 'Sous-thème à sélectionner'}</span><span>{result?.status === 'empty' && result.reason === 'no-approved-units' ? 'Aucune unité approuvée' : 'Banque en attente de validation'}</span></div>
    </div>
  </section>
}
