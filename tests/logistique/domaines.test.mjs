import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const vite = await createServer({ configFile: false, cacheDir: '/tmp/doc-prof-logistique-vite-unit-cache', resolve: { alias: { '@': resolve('src') } },
  server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom',
  define: { 'import.meta.env.VITE_ACCESS_DOMAINS_FULL': 'undefined', 'import.meta.env.VITE_ACCESS_DOMAINS_PARTIAL': 'undefined' } })
try {
  const access = await vite.ssrLoadModule('/src/access.ts')
  const { defaultPage, firstTypeFor } = await vite.ssrLoadModule('/src/math/catalog.ts')
  const { buildPage } = await vite.ssrLoadModule('/src/math/generate.ts')
  const { Header } = await vite.ssrLoadModule('/src/components/generator/Header.tsx')
  const { InstitutionalDocumentHeader, DEFAULT_INSTITUTIONAL } = await vite.ssrLoadModule('/src/components/math/PrintDocumentChrome.tsx')
  const { LogistiqueDomainSettings } = await vite.ssrLoadModule('/src/logistique/DomainShell.tsx')
  const { logistiqueThemesForDomain } = await vite.ssrLoadModule('/src/logistique/catalog.ts')
  const domains = ['logistique-cfc', 'logistique-afp']

  await test('two distinct regular domains follow existing access rules', () => {
    for (const domain of domains) {
      assert(access.REGULAR_DOMAIN_OPTIONS.some(option => option.id === domain))
      assert(access.domainsForAccount('admin').includes(domain))
      assert(access.domainsForAccount('full').includes(domain))
      assert(!access.domainsForAccount('partial').includes(domain))
    }
    assert.deepEqual(access.parseAccessDomainList('logistique-cfc'), ['logistique-cfc'])
    assert.deepEqual(access.parseAccessDomainList('logistique-afp'), ['logistique-afp'])
  })
  await test('empty domains never fall back to algebra, including a mismatched old exercise', () => {
    for (const domain of domains) {
      const page = defaultPage(domain)
      assert.equal(page.exerciseType, '')
      assert.equal(buildPage(page, 123).items.length, 0)
      assert.equal(buildPage({ ...defaultPage('algèbre'), domain }, 123).items.length, 0)
      assert.throws(() => firstTypeFor(domain), /pas encore ajoutés/)
    }
    assert(buildPage(defaultPage('algèbre'), 123).items.length > 0)
  })
  await test('EPCA is scoped to both logistics headers and preserves the configured logo elsewhere', () => {
    const config = { ...DEFAULT_INSTITUTIONAL, logoSrc: '/custom-school-logo.svg' }
    for (const domain of domains) {
      assert.match(renderToStaticMarkup(React.createElement(Header, { onCreate() {}, domain })), /alt="EPCA"/)
      assert.match(renderToStaticMarkup(React.createElement(InstitutionalDocumentHeader, { config, domain, evalMode: false })), /alt="EPCA"/)
    }
    assert.match(renderToStaticMarkup(React.createElement(Header, { onCreate() {}, domain: 'algèbre' })), /Clair/)
    assert.match(renderToStaticMarkup(React.createElement(InstitutionalDocumentHeader, { config, domain: 'algèbre', evalMode: false })), /custom-school-logo\.svg/)
    assert.equal(config.logoSrc, '/custom-school-logo.svg')
  })
  await test('catalogue displays imported source counts without publishing unapproved material', () => {
    const domain = 'logistique-cfc'
    const theme = logistiqueThemesForDomain(domain).find(candidate => candidate.submodules.some(module => module.code === '101'))
    const submodule = theme?.submodules.find(module => module.code === '101')
    assert.ok(theme && submodule)
    const html = renderToStaticMarkup(React.createElement(LogistiqueDomainSettings, {
      domain,
      allowedDomains: [domain],
      onDomainChange() {},
      selection: { themeId: theme.id, submoduleId: submodule.id, type: 'theorie' },
      onSelectionChange() {},
      onGenerate() {},
    }))
    assert.match(html, /692\/715 banques alimentées/)
    assert.match(html, /540\/560 pages source avec contenu/)
    assert.match(html, /1 source\(s\) · à valider/)
    assert.match(html, /unités sources archivées/)
    assert.match(html, /hors génération/)
  })
} finally { await vite.close() }
