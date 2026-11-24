import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import type { Domain } from '@/math/types'
import { logistiqueDomainLabel, type LogistiqueDomain } from './domains'

export function LogistiqueDomainSettings({ domain, allowedDomains, onDomainChange }: {
  domain: LogistiqueDomain
  allowedDomains: Domain[]
  onDomainChange: (domain: Domain) => void
}) {
  return <aside className="settings-panel no-print">
    <div className="field-group">
      <h2>Paramètres</h2>
      <SelectBox label="Domaine" value={domain} onChange={value => onDomainChange(value as Domain)}>
        {ACCESS_DOMAIN_OPTIONS.filter(option => allowedDomains.includes(option.id)).map(option =>
          <option key={option.id} value={option.id}>{option.label}</option>,
        )}
      </SelectBox>
    </div>
  </aside>
}

export function LogistiqueDomainEmpty({ domain }: { domain: LogistiqueDomain }) {
  return <section className="result-panel logistique-empty no-print" aria-labelledby="logistique-domain-title">
    <h2 id="logistique-domain-title">{logistiqueDomainLabel(domain)}</h2>
    <p role="status">Les cours et exercices ne sont pas encore ajoutés à ce domaine.</p>
  </section>
}
