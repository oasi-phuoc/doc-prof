import { useEffect, useState } from 'react'
import './App.css'

type ExerciseType = 'calcul' | 'fractions' | 'geometrie'
type PreviewMode = 'student' | 'answers'

type Worksheet = {
  id: number
  title: string
  level: string
  type: ExerciseType
  instruction: string
  items: { prompt: string; answer: string }[]
}

const typeLabels: Record<ExerciseType, string> = {
  calcul: 'Calcul mental',
  fractions: 'Fractions',
  geometrie: 'Géométrie',
}

const seeds: Record<ExerciseType, Worksheet['items']> = {
  calcul: [
    { prompt: '24 + 18 =', answer: '42' },
    { prompt: '75 − 29 =', answer: '46' },
    { prompt: '6 × 7 =', answer: '42' },
    { prompt: '84 ÷ 4 =', answer: '21' },
    { prompt: '125 + 36 =', answer: '161' },
    { prompt: '200 − 87 =', answer: '113' },
  ],
  fractions: [
    { prompt: '1/2 + 1/4 =', answer: '3/4' },
    { prompt: '3/4 − 1/4 =', answer: '1/2' },
    { prompt: '2/3 de 12 =', answer: '8' },
    { prompt: '1/5 de 25 =', answer: '5' },
    { prompt: '4/8 =', answer: '1/2' },
    { prompt: '2/10 =', answer: '1/5' },
  ],
  geometrie: [
    { prompt: 'Un triangle a ___ côtés.', answer: '3' },
    { prompt: 'Un carré a ___ angles droits.', answer: '4' },
    { prompt: 'Le périmètre d’un carré de 5 cm est ___ cm.', answer: '20' },
    { prompt: 'Un rectangle de 4 cm sur 3 cm a une aire de ___ cm².', answer: '12' },
    { prompt: 'Un cercle a un ___ au centre.', answer: 'point' },
    { prompt: 'Une droite qui relie deux points est un ___ .', answer: 'segment' },
  ],
}

function buildWorksheet(type: ExerciseType, level: string, count: number): Worksheet {
  const items = seeds[type].slice(0, count)
  return {
    id: Date.now(),
    title: type === 'calcul' ? 'Les opérations essentielles' : type === 'fractions' ? 'Fractions : je m’entraîne' : 'Les figures et les mesures',
    level,
    type,
    instruction: type === 'geometrie' ? 'Complète les phrases et écris les réponses.' : 'Pose le calcul si nécessaire, puis écris ta réponse.',
    items,
  }
}

function WorksheetSheet({ worksheet, mode, compact = false }: { worksheet: Worksheet; mode: PreviewMode; compact?: boolean }) {
  return <article className={`worksheet-sheet ${compact ? 'compact' : ''}`}>
    <div className="sheet-header"><div><span className="sheet-kicker">MATHÉMATIQUES · {worksheet.level}</span><h3>{worksheet.title}</h3></div><span className="sheet-number">Fiche 01</span></div>
    <div className="student-line">Nom : <span /> Date : <span /></div>
    <div className="sheet-instruction"><b>Consigne</b><p>{worksheet.instruction}</p></div>
    <div className="exercise-grid">{worksheet.items.map((item, index) => <div className="exercise-item" key={`${item.prompt}-${index}`}><div className="item-number">{index + 1}</div><div className="item-content"><strong>{item.prompt}</strong>{mode === 'answers' ? <div className="answer">Réponse : <b>{item.answer}</b></div> : <div className="answer-line" />}</div></div>)}</div>
    <div className="sheet-footer"><span>Clair<span className="brand-accent">FLE</span> · Support imprimable</span><span>1 / 1</span></div>
  </article>
}

function App() {
  const [level, setLevel] = useState('6H')
  const [type, setType] = useState<ExerciseType>('calcul')
  const [count, setCount] = useState(6)
  const [worksheet, setWorksheet] = useState(() => buildWorksheet('calcul', '6H', 6))
  const [mode, setMode] = useState<PreviewMode>('student')
  const [showGenerator, setShowGenerator] = useState(false)
  const [trialCount, setTrialCount] = useState(() => Number(localStorage.getItem('clair-fle-trials') || 0))

  useEffect(() => { localStorage.setItem('clair-fle-trials', String(trialCount)) }, [trialCount])

  function generate() {
    setWorksheet(buildWorksheet(type, level, count))
    setTrialCount((value) => value + 1)
    setShowGenerator(false)
    setMode('student')
  }

  function printWorksheet(printMode: PreviewMode = mode) {
    setMode(printMode)
    window.setTimeout(() => window.print(), 80)
  }

  return <div className="app-shell">
    <header className="topbar no-print"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><nav><a href="#methode">La méthode</a><a href="#exemples">Exemples</a><a href="#aide">Aide</a></nav><button className="button small" onClick={() => setShowGenerator(true)}>Créer une fiche <span>→</span></button></header>

    <main id="top">
      <section className="hero no-print"><div className="hero-copy"><p className="eyebrow">Générateur de supports · Mathématiques</p><h1>Des fiches claires,<br /><em>prêtes à imprimer.</em></h1><p className="hero-text">Composez une activité adaptée à votre classe, visualisez le résultat et imprimez directement en PDF depuis votre navigateur.</p><div className="hero-actions"><button className="button" onClick={() => setShowGenerator(true)}>Créer une fiche <span>→</span></button><a className="text-link" href="#preview">Voir l’aperçu <span>↓</span></a></div><p className="microcopy"><span className="check">✓</span> Essai local gratuit, sans compte · {trialCount} fiche{trialCount > 1 ? 's' : ''} générée{trialCount > 1 ? 's' : ''}</p></div><div className="hero-sheet"><WorksheetSheet worksheet={worksheet} mode="student" compact /></div></section>

      <section className="workspace-section" id="preview"><div className="workspace-head"><div><p className="eyebrow">Éditeur de fiche</p><h2>Votre activité est prête</h2><p className="muted">Modifiez les paramètres ou ouvrez la fiche imprimable.</p></div><span className="ready-badge"><i /> Fiche prête</span></div><div className="workspace"><aside className="settings-panel no-print"><div className="panel-title"><h3>Paramètres de l’activité</h3><span>Formulaire</span></div><div className="field-group"><label>Type d’activité<select value={type} onChange={(event) => setType(event.target.value as ExerciseType)}><option value="calcul">Calcul mental</option><option value="fractions">Fractions</option><option value="geometrie">Géométrie</option></select></label><label>Niveau<select value={level} onChange={(event) => setLevel(event.target.value)}><option>5H</option><option>6H</option><option>7H</option><option>8H</option></select></label><label>Nombre de questions<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="4">4 questions</option><option value="6">6 questions</option></select></label></div><div className="inspiration"><span>✦</span><div><b>Inspirez-vous d’un modèle</b><p>Un format simple pour démarrer rapidement.</p></div><button onClick={() => setShowGenerator(true)}>Voir</button></div><button className="button full" onClick={generate}>Générer l’activité <span>→</span></button></aside><section className="result-panel"><div className="result-head"><div><h3>Résultat</h3><div className="chips"><span>{level}</span><span>Mathématiques</span><span>{typeLabels[type]}</span></div></div><span className="status">Activité prête</span></div><div className="sheet-stage"><WorksheetSheet worksheet={worksheet} mode={mode} /></div><div className="result-actions no-print"><div className="preview-tabs"><button className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>Fiche élève</button><button className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>Corrigé</button></div><div className="action-buttons"><button className="button secondary" onClick={() => printWorksheet('student')}>Imprimer la fiche</button><button className="button" onClick={() => printWorksheet('answers')}>Imprimer le corrigé <span>↗</span></button></div></div></section></div></section>

      <section className="info-band no-print" id="methode"><div><p className="eyebrow">Du réglage à la feuille</p><h2>Vous gardez<br />la main.</h2></div><p>Choisissez un niveau, un type d’exercice et le nombre de questions. La même fiche sert à l’aperçu écran et à l’impression A4, pour un résultat sans surprise.</p><div className="info-stat"><strong>A4</strong><span>format optimisé</span></div><div className="info-stat"><strong>2</strong><span>documents : fiche et corrigé</span></div></section>
    </main>

    <footer className="footer no-print" id="aide"><span>Clair<span className="brand-accent">FLE</span></span><span>Des supports simples pour apprendre.</span><span>Essai local · sans compte</span></footer>

    {showGenerator && <div className="modal-backdrop no-print" onMouseDown={(event) => event.target === event.currentTarget && setShowGenerator(false)}><section className="generator-modal" role="dialog" aria-modal="true" aria-labelledby="generator-title"><button className="modal-close" onClick={() => setShowGenerator(false)} aria-label="Fermer">×</button><p className="eyebrow">Créer une fiche</p><h2 id="generator-title">Votre prochaine fiche<br /><em>commence ici.</em></h2><p className="muted">Choisissez un point de départ, puis personnalisez votre activité.</p><div className="modal-options"><label>Type d’activité<select value={type} onChange={(event) => setType(event.target.value as ExerciseType)}><option value="calcul">Calcul mental</option><option value="fractions">Fractions</option><option value="geometrie">Géométrie</option></select></label><label>Niveau<select value={level} onChange={(event) => setLevel(event.target.value)}><option>5H</option><option>6H</option><option>7H</option><option>8H</option></select></label></div><button className="button full" onClick={generate}>Générer ma fiche <span>→</span></button></section></div>}
  </div>
}

export default App
