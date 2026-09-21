import { useMemo, useState } from 'react'
import './App.css'

type Domain = 'algèbre' | 'géométrie'
type PreviewMode = 'student' | 'answers'
type Item = { prompt: string; answer: string }
type Worksheet = { title: string; level: string; domain: Domain; module: string; instruction: string; items: Item[] }

type Module = { id: string; label: string; domain: Domain; level: string }

const algebraTopics = [
  ['a1', 'Nombres naturels et entiers'], ['a2', 'Addition et soustraction'], ['a3', 'Multiplication et division'],
  ['a4', 'Fractions et opérations'], ['a5', 'Nombres décimaux'], ['a6', 'Proportionnalité et problèmes'],
  ['a7', 'Nombres relatifs'], ['a8', 'Puissances'], ['a9', 'Équations'], ['a10', 'Expressions algébriques'], ['a11', 'Révisions d’algèbre'],
]
const geometryTopics = [
  ['g1', 'Figures et propriétés'], ['g2', 'Angles et constructions'], ['g3', 'Périmètres'], ['g4', 'Aires'],
  ['g5', 'Volumes'], ['g6', 'Droites et repérage'], ['g7', 'Symétries, translations et rotations'], ['g9', 'Solides et sections'],
]
const modules: Module[] = [...algebraTopics.map(([id, label], i) => ({ id, label, domain: 'algèbre' as Domain, level: `${i + 1}H–${Math.min(i + 2, 11)}H` })), ...geometryTopics.map(([id, label], i) => ({ id, label, domain: 'géométrie' as Domain, level: `${Math.max(1, i + 1)}H–${Math.min(i + 2, 9)}H` }))]
const moduleById = Object.fromEntries(modules.map((module) => [module.id, module]))

function gcd(a: number, b: number) { while (b) [a, b] = [b, a % b]; return a }
function fraction(n: number, d: number) { const divisor = gcd(n, d); return `${n / divisor}/${d / divisor}` }
function makeItems(moduleId: string, count: number): Item[] {
  const items: Item[] = []
  for (let index = 0; index < count; index += 1) {
    const n = index + 2
    if (moduleId === 'a1') items.push({ prompt: `Écris le nombre suivant : ${n * 10 + 4}`, answer: `${n * 10 + 5}` })
    else if (moduleId === 'a2') items.push({ prompt: `${n * 24} + ${n * 7} =`, answer: `${n * 31}` })
    else if (moduleId === 'a3') items.push({ prompt: `${n + 4} × ${n + 2} =`, answer: `${(n + 4) * (n + 2)}` })
    else if (moduleId === 'a4') items.push({ prompt: `${n}/${n + 2} + 1/${n + 2} =`, answer: fraction(n + 1, n + 2) })
    else if (moduleId === 'a5') items.push({ prompt: `${n},${index + 2} + 1,${index + 4} =`, answer: `${n + 1},${index + 6}` })
    else if (moduleId === 'a6') items.push({ prompt: `${n * 3} cahiers coûtent ${n * 6} €. Un cahier coûte ___ €`, answer: '2' })
    else if (moduleId === 'a7') items.push({ prompt: `(${n * 3}) − ${n * 5} =`, answer: `${-n * 2}` })
    else if (moduleId === 'a8') items.push({ prompt: `${n}² =`, answer: `${n * n}` })
    else if (moduleId === 'a9') items.push({ prompt: `x + ${n + 3} = ${n * 3 + 3}. x =`, answer: `${n * 2}` })
    else if (moduleId === 'a10') items.push({ prompt: `Réduis : ${n}x + ${n + 2}x`, answer: `${n * 2 + 2}x` })
    else if (moduleId === 'g1') items.push({ prompt: `Un polygone à ${n + 1} côtés s’appelle un ___`, answer: n === 2 ? 'triangle' : `${n + 1}-gone` })
    else if (moduleId === 'g2') items.push({ prompt: `Un angle droit mesure ___°`, answer: '90' })
    else if (moduleId === 'g3') items.push({ prompt: `Périmètre d’un carré de côté ${n} cm = ___ cm`, answer: `${n * 4}` })
    else if (moduleId === 'g4') items.push({ prompt: `Aire d’un rectangle de ${n} cm sur ${n + 2} cm = ___ cm²`, answer: `${n * (n + 2)}` })
    else if (moduleId === 'g5') items.push({ prompt: `Volume d’un cube d’arête ${n} cm = ___ cm³`, answer: `${n ** 3}` })
    else if (moduleId === 'g6') items.push({ prompt: `Le point A(${n} ; ${n + 1}) a pour abscisse ___`, answer: `${n}` })
    else if (moduleId === 'g7') items.push({ prompt: `Une figure qui se superpose à son image par pliage possède une ___`, answer: 'symétrie' })
    else items.push({ prompt: `Un solide à 6 faces carrées est un ___`, answer: 'cube' })
  }
  return items
}
function buildWorksheet(domain: Domain, moduleId: string, level: string, count: number): Worksheet {
  const module = moduleById[moduleId]
  return { title: module.label, level, domain, module: moduleId.toUpperCase(), instruction: domain === 'géométrie' ? 'Observe la figure ou la situation, puis écris la réponse.' : 'Calcule, complète ou simplifie chaque expression.', items: makeItems(moduleId, count) }
}
function WorksheetSheet({ worksheet, mode, compact = false }: { worksheet: Worksheet; mode: PreviewMode; compact?: boolean }) {
  return <article className={`worksheet-sheet ${compact ? 'compact' : ''}`}>
    <div className="sheet-header"><div><span className="sheet-kicker">MATHÉMATIQUES · {worksheet.domain.toUpperCase()} · {worksheet.level}</span><h3>{worksheet.title}</h3></div><span className="sheet-number">Fiche {worksheet.module}</span></div>
    <div className="student-line">Nom : <span /> Date : <span /></div><div className="sheet-instruction"><b>Consigne</b><p>{worksheet.instruction}</p></div>
    <div className="exercise-grid">{worksheet.items.map((item, index) => <div className="exercise-item" key={`${item.prompt}-${index}`}><div className="item-number">{index + 1}</div><div className="item-content"><strong>{item.prompt}</strong>{mode === 'answers' ? <div className="answer">Réponse : <b>{item.answer}</b></div> : <div className="answer-line" />}</div></div>)}</div>
    <div className="sheet-footer"><span>Clair<span className="brand-accent">FLE</span> · Support imprimable</span><span>1 / 1</span></div>
  </article>
}
function App() {
  const [domain, setDomain] = useState<Domain>('algèbre'); const [moduleId, setModuleId] = useState('a3'); const [level, setLevel] = useState('6H'); const [count, setCount] = useState(8); const [mode, setMode] = useState<PreviewMode>('student'); const [showGenerator, setShowGenerator] = useState(false)
  const [worksheet, setWorksheet] = useState(() => buildWorksheet('algèbre', 'a3', '6H', 8))
  const availableModules = useMemo(() => modules.filter((module) => module.domain === domain), [domain])
  const activeModule = moduleById[moduleId] ?? availableModules[0]
  function generate() { setWorksheet(buildWorksheet(domain, activeModule.id, level, count)); setMode('student'); setShowGenerator(false) }
  function printWorksheet(printMode: PreviewMode = mode) { setMode(printMode); window.setTimeout(() => window.print(), 80) }
  return <div className="app-shell"><header className="topbar no-print"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><nav><a href="#methode">La méthode</a><a href="#preview">Générateur</a><a href="#aide">Aide</a></nav><button className="button small" onClick={() => setShowGenerator(true)}>Créer une fiche <span>→</span></button></header>
    <main id="top"><section className="hero no-print"><div className="hero-copy"><p className="eyebrow">Générateur de supports · Mathématiques</p><h1>Tous les exercices,<br /><em>prêts à imprimer.</em></h1><p className="hero-text">Retrouvez les modules d’algèbre et de géométrie de Soutien scolaire, composez une activité et prévisualisez sa fiche élève ou son corrigé.</p><div className="hero-actions"><button className="button" onClick={() => setShowGenerator(true)}>Ouvrir le générateur <span>→</span></button><a className="text-link" href="#preview">Voir l’aperçu <span>↓</span></a></div><p className="microcopy"><span className="check">✓</span> Essai local gratuit, sans compte · {modules.length} modules disponibles</p></div><div className="hero-sheet"><WorksheetSheet worksheet={worksheet} mode="student" compact /></div></section>
      <section className="workspace-section" id="preview"><div className="workspace-head"><div><p className="eyebrow">Boîte de génération</p><h2>Votre activité est prête</h2><p className="muted">Choisissez un module de mathématiques, prévisualisez la fiche et imprimez-la en PDF.</p></div><span className="ready-badge"><i /> Fiche prête</span></div><div className="workspace"><aside className="settings-panel no-print"><div className="panel-title"><h3>Paramètres de l’activité</h3><span>Formulaire</span></div><div className="field-group"><label>Domaine<select value={domain} onChange={(event) => { const next = event.target.value as Domain; setDomain(next); setModuleId(next === 'algèbre' ? 'a3' : 'g3') }}><option value="algèbre">Algèbre</option><option value="géométrie">Géométrie</option></select></label><label>Module<select value={activeModule.id} onChange={(event) => setModuleId(event.target.value)}>{availableModules.map((module) => <option key={module.id} value={module.id}>{module.id.toUpperCase()} · {module.label}</option>)}</select></label><label>Niveau<select value={level} onChange={(event) => setLevel(event.target.value)}>{['5H','6H','7H','8H','9H','10H','11H'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Nombre de questions<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="6">6 questions</option><option value="8">8 questions</option><option value="10">10 questions</option></select></label></div><div className="inspiration"><span>✦</span><div><b>Modules de Soutien scolaire</b><p>Algèbre, géométrie et fiches corrigées.</p></div><button onClick={() => setShowGenerator(true)}>Ouvrir</button></div><button className="button full" onClick={generate}>Générer l’activité <span>→</span></button></aside><section className="result-panel"><div className="result-head"><div><h3>Résultat</h3><div className="chips"><span>{worksheet.level}</span><span>{worksheet.domain}</span><span>{worksheet.module}</span></div></div><span className="status"><i /> Activité prête</span></div><div className="sheet-stage"><WorksheetSheet worksheet={worksheet} mode={mode} /></div><div className="result-actions no-print"><div className="preview-tabs"><button className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>Fiche élève</button><button className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>Corrigé</button></div><div className="action-buttons"><button className="button secondary" onClick={() => printWorksheet('student')}>Imprimer la fiche</button><button className="button" onClick={() => printWorksheet('answers')}>Imprimer le corrigé</button></div></div></section></div></section>
      <section className="info-band no-print" id="methode"><div><p className="eyebrow">Du module à la feuille</p><h2>Vous gardez<br />la main.</h2></div><p>Chaque module reprend la progression de Soutien scolaire. La même fiche sert à l’aperçu écran et à l’impression A4 via la boîte de dialogue native du navigateur.</p><div className="info-stat"><strong>{modules.length}</strong><span>modules maths</span></div><div className="info-stat"><strong>A4</strong><span>print-to-PDF</span></div></section></main><footer className="footer no-print" id="aide"><span>Clair<span className="brand-accent">FLE</span></span><span>Algèbre et géométrie pour la classe.</span><span>Essai local · sans compte</span></footer>
    {showGenerator && <div className="modal-backdrop no-print" onMouseDown={(event) => event.target === event.currentTarget && setShowGenerator(false)}><section className="generator-modal" role="dialog" aria-modal="true" aria-labelledby="generator-title"><button className="modal-close" onClick={() => setShowGenerator(false)} aria-label="Fermer">×</button><p className="eyebrow">Créer une fiche</p><h2 id="generator-title">Choisissez votre<br /><em>module de maths.</em></h2><p className="muted">Générez une fiche élève et son corrigé, puis utilisez Imprimer → Enregistrer au format PDF.</p><div className="modal-options"><label>Domaine<select value={domain} onChange={(event) => { const next = event.target.value as Domain; setDomain(next); setModuleId(next === 'algèbre' ? 'a3' : 'g3') }}><option value="algèbre">Algèbre</option><option value="géométrie">Géométrie</option></select></label><label>Niveau<select value={level} onChange={(event) => setLevel(event.target.value)}>{['5H','6H','7H','8H','9H','10H','11H'].map((value) => <option key={value}>{value}</option>)}</select></label></div><label className="modal-module">Module<select value={activeModule.id} onChange={(event) => setModuleId(event.target.value)}>{availableModules.map((module) => <option key={module.id} value={module.id}>{module.id.toUpperCase()} · {module.label}</option>)}</select></label><label className="modal-module">Questions<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="6">6</option><option value="8">8</option><option value="10">10</option></select></label><button className="button full" onClick={generate}>Générer ma fiche <span>→</span></button></section></div>}
  </div>
}
export default App
