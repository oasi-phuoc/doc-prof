import { useMemo, useState, type CSSProperties } from 'react'
import './App.css'

type Domain = 'algèbre' | 'géométrie'
type PreviewMode = 'student' | 'answers'
type Item = { prompt: string; answer: string; figure?: 'rectangle' | 'triangle' | 'cube' | 'circle' }
type HeaderConfig = { title: string; subtitle: string; logo: string; footer: string }
type Worksheet = { title: string; domain: Domain; topic: string; instruction: string; items: Item[]; header: HeaderConfig; columns: number }
type Module = { id: string; label: string; domain: Domain }

const algebraTopics: Module[] = [
  ['nombres', 'Nombres naturels et entiers'], ['addition', 'Addition et soustraction'], ['multiplication', 'Multiplication et division'],
  ['fractions', 'Fractions et opérations'], ['decimaux', 'Nombres décimaux'], ['proportionnalite', 'Proportionnalité et problèmes'],
  ['relatifs', 'Nombres relatifs'], ['puissances', 'Puissances'], ['equations', 'Équations'], ['expressions', 'Expressions algébriques'],
].map(([id, label]) => ({ id, label, domain: 'algèbre' }))
const geometryTopics: Module[] = [
  ['figures', 'Figures et propriétés'], ['angles', 'Angles et constructions'], ['perimetres', 'Périmètres'], ['aires', 'Aires'],
  ['volumes', 'Volumes'], ['reperage', 'Droites et repérage'], ['transformations', 'Symétries, translations et rotations'], ['solides', 'Solides et sections'],
].map(([id, label]) => ({ id, label, domain: 'géométrie' }))
const modules = [...algebraTopics, ...geometryTopics]
const moduleById = Object.fromEntries(modules.map((module) => [module.id, module]))

function makeItems(topic: string, count: number): Item[] {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 2
    if (topic === 'addition') return { prompt: `${n * 24} + ${n * 7} =`, answer: `${n * 31}` }
    if (topic === 'multiplication') return { prompt: `${n + 4} × ${n + 2} =`, answer: `${(n + 4) * (n + 2)}` }
    if (topic === 'fractions') return { prompt: `${n}/${n + 2} + 1/${n + 2} =`, answer: `${n + 1}/${n + 2}` }
    if (topic === 'decimaux') return { prompt: `${n},${index + 2} + 1,${index + 4} =`, answer: `${n + 1},${index + 6}` }
    if (topic === 'proportionnalite') return { prompt: `${n * 3} cahiers coûtent ${n * 6} €. Un cahier coûte ___ €`, answer: '2' }
    if (topic === 'relatifs') return { prompt: `(${n * 3}) − ${n * 5} =`, answer: `${-n * 2}` }
    if (topic === 'puissances') return { prompt: `${n}² =`, answer: `${n * n}` }
    if (topic === 'equations') return { prompt: `x + ${n + 3} = ${n * 3 + 3}. x =`, answer: `${n * 2}` }
    if (topic === 'expressions') return { prompt: `Réduis : ${n}x + ${n + 2}x`, answer: `${n * 2 + 2}x` }
    if (topic === 'nombres') return { prompt: `Écris le nombre suivant : ${n * 10 + 4}`, answer: `${n * 10 + 5}` }
    if (topic === 'perimetres') return { prompt: `Périmètre d’un carré de côté ${n} cm`, answer: `${n * 4} cm`, figure: 'rectangle' }
    if (topic === 'aires') return { prompt: `Aire d’un rectangle de ${n} cm sur ${n + 2} cm`, answer: `${n * (n + 2)} cm²`, figure: 'rectangle' }
    if (topic === 'volumes') return { prompt: `Volume d’un cube d’arête ${n} cm`, answer: `${n ** 3} cm³`, figure: 'cube' }
    if (topic === 'figures') return { prompt: `Nomme cette figure géométrique`, answer: index % 2 ? 'triangle' : 'rectangle', figure: index % 2 ? 'triangle' : 'rectangle' }
    if (topic === 'angles') return { prompt: `Un angle droit mesure`, answer: '90°' }
    if (topic === 'reperage') return { prompt: `Le point A(${n} ; ${n + 1}) a pour abscisse`, answer: `${n}` }
    if (topic === 'transformations') return { prompt: `Une figure qui se superpose à son image par pliage possède une`, answer: 'symétrie' }
    return { prompt: `Un solide à 6 faces carrées est un`, answer: 'cube', figure: 'cube' }
  })
}
function instructionFor(domain: Domain) { return domain === 'géométrie' ? 'Observe les figures, calcule puis écris la réponse.' : 'Calcule, complète ou simplifie chaque expression.' }
function buildWorksheet(domain: Domain, topic: string, count: number, header: HeaderConfig, columns: number): Worksheet {
  const module = moduleById[topic]
  return { title: module.label, domain, topic, instruction: instructionFor(domain), items: makeItems(topic, count), header, columns }
}
function GeometryFigure({ type }: { type: Item['figure'] }) {
  if (!type) return null
  return <svg className="geometry-figure" viewBox="0 0 120 78" role="img" aria-label="Figure géométrique"><g fill="none" stroke="currentColor" strokeWidth="2"><rect x="16" y="18" width="72" height="42" rx="1" />{type === 'triangle' && <><path d="M16 60 52 12l36 48Z" /><path d="M52 12v48" /></>}{type === 'cube' && <><path d="M16 18 46 7l42 15-30 12Z" /><path d="M16 18v42l42 15V34M88 22v38L58 75" /><path d="M46 7v27" /></>}</g></svg>
}
function WorksheetSheet({ worksheet, mode, compact = false }: { worksheet: Worksheet; mode: PreviewMode; compact?: boolean }) {
  return <article className={`worksheet-sheet ${compact ? 'compact' : ''}`} style={{ '--sheet-columns': worksheet.columns } as CSSProperties}>
    <div className="custom-print-header"><div className="custom-logo">{worksheet.header.logo || 'ClairFLE'}</div><div><strong>{worksheet.header.title || worksheet.title}</strong>{worksheet.header.subtitle && <small>{worksheet.header.subtitle}</small>}</div><span>{new Date().toLocaleDateString('fr-FR')}</span></div>
    <div className="sheet-header"><div><span className="sheet-kicker">MATHÉMATIQUES · {worksheet.domain.toUpperCase()}</span><h3>{worksheet.title}</h3></div><span className="sheet-number">Fiche d’activité</span></div>
    <div className="student-line">Nom : <span /> Date : <span /></div><div className="sheet-instruction"><b>Consigne</b><p>{worksheet.instruction}</p></div>
    <div className="exercise-grid">{worksheet.items.map((item, index) => <div className="exercise-item" key={`${item.prompt}-${index}`}><div className="item-number">{index + 1}</div><div className="item-content">{item.figure && <GeometryFigure type={item.figure} />}<strong>{item.prompt} {item.figure ? '' : '___'}</strong>{mode === 'answers' ? <div className="answer">Correction : <b>{item.answer}</b></div> : <div className="answer-line" />}</div></div>)}</div>
    <div className="sheet-footer"><span>{worksheet.header.footer || 'ClairFLE · Support imprimable'}</span><span>Page 1</span></div>
  </article>
}
function QuestionCount({ value, onChange }: { value: number; onChange: (value: number) => void }) { return <div className="question-control"><select value={[6, 8, 10, 12, 16].includes(value) ? value : 'custom'} onChange={(event) => event.target.value !== 'custom' && onChange(Number(event.target.value))}><option value="6">6 questions</option><option value="8">8 questions</option><option value="10">10 questions</option><option value="12">12 questions</option><option value="16">16 questions</option><option value="custom">Personnalisé</option></select><input aria-label="Nombre personnalisé de questions" type="number" min="1" max="30" value={value} onChange={(event) => onChange(Math.max(1, Math.min(30, Number(event.target.value) || 1)))} /></div> }
function App() {
  const [domain, setDomain] = useState<Domain>('géométrie'); const [topic, setTopic] = useState('aires'); const [count, setCount] = useState(8); const [columns, setColumns] = useState(2); const [mode, setMode] = useState<PreviewMode>('student'); const [showGenerator, setShowGenerator] = useState(false)
  const [header, setHeader] = useState<HeaderConfig>({ title: '', subtitle: '', logo: 'ClairFLE', footer: 'ClairFLE · Support imprimable' })
  const [worksheet, setWorksheet] = useState(() => buildWorksheet('géométrie', 'aires', 8, header, 2))
  const availableModules = useMemo(() => modules.filter((module) => module.domain === domain), [domain]); const activeModule = moduleById[topic] ?? availableModules[0]
  function generate() { setWorksheet(buildWorksheet(domain, activeModule.id, count, header, columns)); setMode('student'); setShowGenerator(false) }
  function printWorksheet(printMode: PreviewMode = mode) { setMode(printMode); window.setTimeout(() => window.print(), 80) }
  const setDomainAndTopic = (next: Domain) => { setDomain(next); setTopic(next === 'algèbre' ? 'addition' : 'aires') }
  return <div className="app-shell"><header className="topbar no-print"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><nav><a href="#methode">La méthode</a><a href="#preview">Générateur</a><a href="#aide">Aide</a></nav><button className="button small" onClick={() => setShowGenerator(true)}>Créer une fiche <span>→</span></button></header>
    <main id="top"><section className="hero no-print"><div className="hero-copy"><p className="eyebrow">Générateur de supports · Mathématiques</p><h1>Tous les exercices,<br /><em>prêts à imprimer.</em></h1><p className="hero-text">Maths et géométrie, avec figures SVG, corrigé et mise en page adaptée à la fiche imprimable.</p><div className="hero-actions"><button className="button" onClick={() => setShowGenerator(true)}>Ouvrir le générateur <span>→</span></button><a className="text-link" href="#preview">Voir l’aperçu <span>↓</span></a></div><p className="microcopy"><span className="check">✓</span> Essai local gratuit, sans compte · {modules.length} thèmes disponibles</p></div><div className="hero-sheet"><WorksheetSheet worksheet={worksheet} mode="student" compact /></div></section>
      <section className="workspace-section" id="preview"><div className="workspace-head"><div><p className="eyebrow">Boîte de génération</p><h2>Votre activité est prête</h2><p className="muted">Choisissez un thème, personnalisez l’en-tête, puis imprimez la fiche ou son corrigé.</p></div><span className="ready-badge"><i /> Fiche prête</span></div><div className="workspace"><aside className="settings-panel no-print"><div className="panel-title"><h3>Paramètres de l’activité</h3><span>Formulaire</span></div><div className="field-group"><label>Domaine<select value={domain} onChange={(event) => setDomainAndTopic(event.target.value as Domain)}><option value="algèbre">Algèbre</option><option value="géométrie">Géométrie</option></select></label><label>Thème<select value={activeModule.id} onChange={(event) => setTopic(event.target.value)}>{availableModules.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}</select></label><label>Nombre de questions<QuestionCount value={count} onChange={setCount} /></label><label>Colonnes<select value={columns} onChange={(event) => setColumns(Number(event.target.value))}><option value="1">1 colonne</option><option value="2">2 colonnes</option><option value="3">3 colonnes</option></select></label></div><div className="custom-header-form"><b>En-tête personnalisée</b><label>Logo ou nom<input value={header.logo} onChange={(event) => setHeader({ ...header, logo: event.target.value })} placeholder="Votre logo" /></label><label>Titre<input value={header.title} onChange={(event) => setHeader({ ...header, title: event.target.value })} placeholder="Titre de la fiche" /></label><label>Sous-titre<input value={header.subtitle} onChange={(event) => setHeader({ ...header, subtitle: event.target.value })} placeholder="Classe, groupe..." /></label><label>Pied de page<input value={header.footer} onChange={(event) => setHeader({ ...header, footer: event.target.value })} /></label></div><button className="button full" onClick={generate}>Générer l’activité <span>→</span></button></aside><section className="result-panel"><div className="result-head"><div><h3>Résultat</h3><div className="chips"><span>{worksheet.domain}</span><span>{worksheet.title}</span><span>{worksheet.items.length} questions</span></div></div><div className="status"><i /> Activité prête</div></div><div className="preview-tabs no-print"><button className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>Fiche élève</button><button className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>Corrigé</button></div><div className="sheet-stage"><WorksheetSheet worksheet={worksheet} mode={mode} /></div><div className="result-actions no-print"><div><b>{mode === 'student' ? 'Aperçu de la fiche élève' : 'Aperçu du corrigé'}</b><p>Imprimez directement ou enregistrez en PDF avec votre navigateur.</p></div><div className="action-buttons"><button className="button secondary" onClick={() => printWorksheet('answers')}>Imprimer le corrigé</button><button className="button" onClick={() => printWorksheet('student')}>Ouvrir la fiche imprimable <span>↗</span></button></div></div></section></div></section>
      <section className="info-band no-print" id="methode"><div><p className="eyebrow">Du thème à la feuille</p><h2>Vous gardez<br />la main.</h2></div><p>Des formes géométriques vectorielles nettes à l’impression, un nombre de questions libre, plusieurs colonnes et un corrigé séparé.</p><div className="info-stat"><strong>{modules.length}</strong><span>thèmes maths</span></div><div className="info-stat"><strong>A4</strong><span>print-to-PDF</span></div></section></main><footer className="footer no-print" id="aide"><span>Clair<span className="brand-accent">FLE</span></span><span>Mathématiques et géométrie pour la classe.</span><span>Essai local · sans compte</span></footer>
    {showGenerator && <div className="modal-backdrop no-print" onMouseDown={(event) => event.target === event.currentTarget && setShowGenerator(false)}><section className="generator-modal" role="dialog" aria-modal="true" aria-labelledby="generator-title"><button className="modal-close" onClick={() => setShowGenerator(false)} aria-label="Fermer">×</button><p className="eyebrow">Créer une fiche</p><h2 id="generator-title">Choisissez votre<br /><em>thème de maths.</em></h2><p className="muted">Générez une fiche élève et son corrigé, avec votre en-tête.</p><div className="modal-options"><label>Domaine<select value={domain} onChange={(event) => setDomainAndTopic(event.target.value as Domain)}><option value="algèbre">Algèbre</option><option value="géométrie">Géométrie</option></select></label><label>Colonnes<select value={columns} onChange={(event) => setColumns(Number(event.target.value))}><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label></div><label className="modal-module">Thème<select value={activeModule.id} onChange={(event) => setTopic(event.target.value)}>{availableModules.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}</select></label><label className="modal-module">Questions<QuestionCount value={count} onChange={setCount} /></label><button className="button full" onClick={generate}>Générer ma fiche <span>→</span></button></section></div>}
  </div>
}
export default App
