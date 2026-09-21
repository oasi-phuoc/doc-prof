import { useState } from 'react'
import './App.css'

type Exercise = { label: string; tone: string; mark: string }

const exercises: Exercise[] = [
  { label: 'Relier', tone: 'violet', mark: '↗' },
  { label: 'Écrire', tone: 'rose', mark: 'Aa' },
  { label: 'Entourer', tone: 'orange', mark: '○' },
  { label: 'Syllabes', tone: 'green', mark: 'ba' },
]

function Arrow() {
  return <span aria-hidden="true">→</span>
}

function WorksheetPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`worksheet ${compact ? 'worksheet-compact' : ''}`} aria-label="Aperçu d'une fiche de FLE">
      <div className="sheet-topline"><span>FLE · A1</span><span>Fiche 01</span></div>
      <div className="sheet-title">Les mots de la journée</div>
      <div className="sheet-goal">Je peux reconnaître des mots utiles.</div>
      <div className="sheet-rule" />
      <div className="sheet-instruction"><span className="instruction-dot">1</span> Reliez le mot et l'image.</div>
      <div className="picture-row">
        <div className="mini-picture bus"><span>BUS</span></div>
        <div className="mini-picture cup"><span>CAFÉ</span></div>
        <div className="mini-picture phone"><span>TÉLÉPHONE</span></div>
      </div>
      <div className="word-row"><span>le téléphone</span><span>le bus</span><span>le café</span></div>
      <div className="sheet-instruction second"><span className="instruction-dot">2</span> Entourez le mot entendu.</div>
      <div className="choice-row"><span>matin</span><span className="choice-active">bus</span><span>soir</span></div>
      <div className="sheet-footer"><span>Nom : __________________</span><span>1 / 1</span></div>
    </div>
  )
}

function App() {
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [level, setLevel] = useState('A1')
  const [theme, setTheme] = useState('La vie quotidienne')
  const [created, setCreated] = useState(false)

  const openGenerator = () => {
    setGeneratorOpen(true)
    setCreated(false)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Clair FLE, accueil">
          <span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span>
          <span>Clair<span className="brand-accent">FLE</span></span>
        </a>
        <nav className="nav-links" aria-label="Navigation principale">
          <a href="#methode">La méthode</a>
          <a href="#exemples">Exemples</a>
          <a href="#aide">Aide</a>
        </nav>
        <button className="button button-small" onClick={openGenerator}>Créer une fiche <Arrow /></button>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="hero-copy">
            <p className="eyebrow">Des fiches qui font avancer</p>
            <h1>Le français devient<br /><em>plus clair.</em></h1>
            <p className="hero-text">Composez en quelques minutes des fiches de FLE simples, respectueuses et prêtes à imprimer pour vos apprenant·e·s.</p>
            <div className="hero-actions">
              <button className="button" onClick={openGenerator}>Créer une fiche <Arrow /></button>
              <a className="text-link" href="#exemples">Voir des exemples <Arrow /></a>
            </div>
            <p className="microcopy"><span className="check">✓</span> Gratuit, sans compte, vos fiches restent à vous.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="orbit orbit-four" />
            <span className="orbit-label label-one">Relier</span>
            <span className="orbit-label label-two">Écrire</span>
            <span className="orbit-label label-three">Lire</span>
            <span className="orbit-label label-four">Parler</span>
            <WorksheetPreview />
          </div>
        </section>

        <section className="band intro" id="methode">
          <div className="narrow-copy">
            <p className="eyebrow">Pensé pour le terrain</p>
            <h2>Une fiche adaptée,<br />ça change tout.</h2>
            <p>Vous connaissez votre groupe. Clair FLE vous aide à préparer le bon support : au bon niveau, avec les bons mots, pour une situation qui a du sens.</p>
          </div>
          <div className="editor-preview">
            <div className="editor-toolbar"><span className="toolbar-title">Nouvelle fiche</span><span className="toolbar-status">Aperçu en direct</span></div>
            <div className="editor-body">
              <div className="editor-controls">
                <div className="control-label">Niveau de lecture</div>
                <div className="segmented"><button className="selected">A1</button><button>A2</button><button>B1</button></div>
                <div className="control-label">Compétence</div>
                <div className="select-look">Lexique <span>⌄</span></div>
                <div className="control-label">Exercices</div>
                <div className="exercise-list">{exercises.slice(0, 3).map((exercise) => <div className="exercise-line" key={exercise.label}><span className={`exercise-icon ${exercise.tone}`}>{exercise.mark}</span>{exercise.label}<span className="drag">⋮⋮</span></div>)}</div>
              </div>
              <div className="editor-sheet"><WorksheetPreview compact /></div>
            </div>
          </div>
        </section>

        <section className="feature-row section-grid" id="exemples">
          <div className="feature-art art-pictograms" aria-hidden="true"><div className="pictogram-card"><span className="pictogram-number">1</span><span className="pictogram-icon">↗</span><strong>Reliez</strong><small>le mot et l'image</small></div><div className="pictogram-card tilted"><span className="pictogram-number">2</span><span className="pictogram-icon">Aa</span><strong>Écrivez</strong><small>le mot</small></div></div>
          <div className="feature-copy"><p className="eyebrow">Des consignes qui parlent</p><h2>Moins de décodage.<br />Plus d'apprentissage.</h2><p>Chaque consigne associe des mots simples à un pictogramme. Les images portent le sens et la fiche reste lisible, même en noir et blanc.</p><a className="text-link" href="#aide">Découvrir les exercices <Arrow /></a></div>
        </section>

        <section className="band feature-row reverse">
          <div className="feature-copy"><p className="eyebrow">Du réglage à la feuille</p><h2>Vous gardez<br />la main.</h2><p>Choisissez la littératie, le niveau CECRL, la taille d'écriture et le thème. Réorganisez les exercices, retouchez les mots, puis imprimez.</p><button className="button button-secondary" onClick={openGenerator}>Tester le générateur <Arrow /></button></div>
          <div className="feature-art art-settings" aria-hidden="true"><div className="settings-card"><div className="fake-title">Votre fiche</div><div className="fake-row"><span>Niveau</span><b>A1</b></div><div className="fake-row"><span>Taille</span><b>Grand&nbsp;⌄</b></div><div className="fake-row"><span>Impression</span><b>Couleur&nbsp;◉</b></div><div className="fake-button">Générer la fiche&nbsp; →</div></div><span className="tiny-spark spark-a">✦</span><span className="tiny-spark spark-b">✦</span></div>
        </section>

        <section className="closing-cta" id="aide"><p className="eyebrow">Votre prochain cours</p><h2>Commencez par une fiche.</h2><p>Un support clair, une séance plus sereine.</p><button className="button" onClick={openGenerator}>Créer une fiche gratuitement <Arrow /></button></section>
      </main>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>Clair<span className="brand-accent">FLE</span></span></a><span>Des supports simples pour apprendre le français.</span><div><a href="#aide">Contact</a><a href="#aide">Mentions</a></div></footer>

      {generatorOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGeneratorOpen(false) }}><section className="generator-modal" role="dialog" aria-modal="true" aria-labelledby="generator-title"><button className="modal-close" onClick={() => setGeneratorOpen(false)} aria-label="Fermer">×</button><div className="modal-intro"><p className="eyebrow">Créer une fiche</p><h2 id="generator-title">Votre prochaine fiche<br /><em>commence ici.</em></h2><p>Choisissez un point de départ. Vous pourrez tout modifier ensuite.</p></div>{created ? <div className="created-state"><div className="success-mark">✓</div><h3>Votre fiche est prête</h3><p>« Les mots de la journée » · {level} · {theme}</p><button className="button" onClick={() => setGeneratorOpen(false)}>Voir la fiche <Arrow /></button></div> : <div className="generator-form"><label>Niveau de français<select value={level} onChange={(event) => setLevel(event.target.value)}><option>A1</option><option>A1.1</option><option>A2</option><option>B1</option></select></label><label>Thème<select value={theme} onChange={(event) => setTheme(event.target.value)}><option>La vie quotidienne</option><option>La santé</option><option>Le logement</option><option>Le travail</option></select></label><div className="form-note"><span>✦</span><p>Nous vous proposerons une fiche avec des exercices de lexique, de lecture et d'écriture.</p></div><button className="button full-width" onClick={() => setCreated(true)}>Générer ma fiche <Arrow /></button></div>}</section></div>}
    </div>
  )
}

export default App
