import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import './App.css'
import { MathItemView } from '@/components/math/MathItemView'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import {
  algebraTopics,
  defaultPage,
  exerciseTypeById,
  firstTypeFor,
  geometryTopics,
  topicById,
  typesForTopic,
} from '@/math/catalog'
import { buildPage } from '@/math/generate'
import { randomSeed } from '@/math/rng'
import type { Domain, ExerciseType, PageConfig, PreviewMode, WorksheetPage } from '@/math/types'

type HeaderConfig = { title: string; subtitle: string; logo: string; footer: string }

function TypeVisual({ type }: { type: ExerciseType }) {
  if (type.figure) return <GeometryFigure type={type.figure} />
  if (type.visual === 'colonne') {
    return (
      <b>
        46
        <br />
        + 37
        <br />
        ────
      </b>
    )
  }
  if (type.visual === 'colonne-vide') {
    return (
      <b>
        □□
        <br />
        + □□
        <br />
        ────
      </b>
    )
  }
  if (type.visual === 'trou') return <b>46 + □ = 83</b>
  if (type.visual === 'suite') return <b>2 · 4 · □ · 8</b>
  if (type.visual === 'geo') return <GeometryFigure type="triangle" />
  if (type.visual === 'texte') return <b>… ?</b>
  return <b>12 + 8 = □</b>
}

function WorksheetSheet({
  page,
  mode,
  header,
  pageNumber,
  total,
}: {
  page: WorksheetPage
  mode: PreviewMode
  header: HeaderConfig
  pageNumber: number
  total: number
}) {
  return (
    <article className="worksheet-sheet" style={{ '--sheet-columns': page.columns } as CSSProperties}>
      <div className="custom-print-header">
        <div className="custom-logo">{header.logo || 'ClairFLE'}</div>
        <div>
          <strong>{header.title || page.title}</strong>
          {header.subtitle && <small>{header.subtitle}</small>}
        </div>
        <span>{new Date().toLocaleDateString('fr-FR')}</span>
      </div>
      <div className="sheet-header">
        <div>
          <span className="sheet-kicker">MATHÉMATIQUES · {page.domain.toUpperCase()}</span>
          <h3>{page.title}</h3>
        </div>
        <span className="sheet-number">Fiche d’activité</span>
      </div>
      <div className="student-line">
        Nom : <span /> Date : <span />
      </div>
      <div className="sheet-instruction">
        <b>Consigne</b>
        <p>{page.instruction}</p>
      </div>
      <div className="exercise-grid">
        {page.items.map((item, index) => (
          <MathItemView key={`${page.exerciseType}-${index}-${item.answer}`} item={item} mode={mode} index={index} />
        ))}
      </div>
      <div className="sheet-footer">
        <span>{header.footer || 'ClairFLE · Support imprimable'}</span>
        <span>
          Page {pageNumber} / {total}
        </span>
      </div>
    </article>
  )
}

function ExerciseTypeCards({
  topic,
  selected,
  onSelect,
}: {
  topic: string
  selected: string
  onSelect: (type: ExerciseType) => void
}) {
  const cards = typesForTopic(topic)
  return (
    <section className="exercise-types no-print">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Type d’exercice</span>
          <h3>Choisissez un format</h3>
        </div>
        <span className="muted">{cards.length} formats</span>
      </div>
      <div className="exercise-type-grid">
        {cards.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`exercise-type-card ${selected === type.id ? 'selected' : ''}`}
            onClick={() => onSelect(type)}
          >
            <span className="type-visual">
              <TypeVisual type={type} />
            </span>
            <strong>{type.label}</strong>
            <small>{type.description}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function SelectBox({
  label,
  value,
  children,
  onChange,
}: {
  label: string
  value: string
  children: ReactNode
  onChange: (value: string) => void
}) {
  return (
    <label className="select-shell">
      <span>{label}</span>
      <select className="select-control" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  )
}

function Header({ onCreate, generator = false }: { onCreate: () => void; generator?: boolean }) {
  return (
    <header className="topbar no-print">
      <a className="brand" href={generator ? '/' : '#top'}>
        <span className="brand-mark">
          <i />
          <i />
          <i />
        </span>
        Clair<span className="brand-accent">FLE</span>
      </a>
      <nav>
        <a href="/#methode">La méthode</a>
        <a href="/#exemples">Exemples</a>
        <a href="/#aide">Aide</a>
      </nav>
      {!generator && (
        <button className="button small" type="button" onClick={onCreate}>
          Créer une fiche <span>→</span>
        </button>
      )}
    </header>
  )
}

function Landing({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="landing-page">
      <Header onCreate={onCreate} />
      <main id="top">
        <section className="hero landing-hero no-print">
          <div className="hero-copy">
            <p className="eyebrow">Des fiches qui font avancer</p>
            <h1>
              Le français devient
              <br />
              <em>plus clair.</em>
            </h1>
            <p className="hero-text">
              Composez en quelques minutes des fiches simples, respectueuses et prêtes à imprimer pour vos
              apprenant·e·s.
            </p>
            <div className="hero-actions">
              <button className="button" type="button" onClick={onCreate}>
                Créer une fiche <span>→</span>
              </button>
              <a className="text-link" href="#exemples">
                Voir des exemples <span>↓</span>
              </a>
            </div>
            <p className="microcopy">
              <span className="check">✓</span> Gratuit, sans compte, vos fiches restent à vous.
            </p>
          </div>
          <div className="landing-art">
            <span>Français</span>
            <span>Mathématiques</span>
            <span>Algèbre</span>
            <span>Géométrie</span>
            <div className="art-card">
              <b>Fiches claires</b>
              <small>à imprimer et partager</small>
            </div>
          </div>
        </section>
        <section className="subject-section no-print" id="exemples">
          <p className="eyebrow">Deux matières, un même outil</p>
          <h2>Choisissez votre matière.</h2>
          <div className="subject-grid">
            <button type="button" onClick={onCreate}>
              <b>Français</b>
              <span>Fiches de langue et de lecture</span>
              <strong>→</strong>
            </button>
            <button type="button" onClick={onCreate}>
              <b>Mathématiques</b>
              <span>Algèbre et géométrie</span>
              <strong>→</strong>
            </button>
          </div>
        </section>
      </main>
      <footer className="footer no-print" id="aide">
        <span>
          Clair<span className="brand-accent">FLE</span>
        </span>
        <span>Fiches pour la classe.</span>
        <span>Essai local · sans compte</span>
      </footer>
    </div>
  )
}

function applyType(type: ExerciseType): Partial<PageConfig> {
  return {
    exerciseType: type.id,
    topic: type.topic,
    columns: type.preferredColumns ?? 2,
  }
}

function GeneratorPage() {
  const initial = defaultPage('algèbre')
  const [pages, setPages] = useState<PageConfig[]>([initial])
  const [pageIndex, setPageIndex] = useState(0)
  const [mode, setMode] = useState<PreviewMode>('student')
  const [header, setHeader] = useState<HeaderConfig>({
    title: '',
    subtitle: '',
    logo: 'ClairFLE',
    footer: 'ClairFLE · Support imprimable',
  })
  const [seed, setSeed] = useState(randomSeed)

  const activePage = pages[pageIndex] ?? pages[0]!
  const available = activePage.domain === 'algèbre' ? algebraTopics : geometryTopics
  const worksheets = useMemo(
    () => pages.map((page, index) => buildPage(page, seed + index * 7919)),
    [pages, seed],
  )

  const updatePage = (patch: Partial<PageConfig>) =>
    setPages((current) => current.map((page, index) => (index === pageIndex ? { ...page, ...patch } : page)))

  const addPage = () => {
    const next = defaultPage('géométrie')
    setPages((current) => [...current, next])
    setPageIndex(pages.length)
  }

  function changeDomain(next: Domain) {
    const type = firstTypeFor(next)
    updatePage({ domain: next, ...applyType(type) })
  }

  function changeTopic(topic: string) {
    const type = typesForTopic(topic)[0] ?? firstTypeFor(activePage.domain, topic)
    updatePage({ topic, ...applyType(type) })
  }

  function generate() {
    setSeed(randomSeed())
    setMode('student')
  }

  function printWorksheet(nextMode: PreviewMode = mode) {
    setMode(nextMode)
    window.setTimeout(() => window.print(), 80)
  }

  return (
    <div className="app-shell">
      <Header onCreate={() => undefined} generator />
      <main className="generator-page" id="top">
        <div className="generator-intro">
          <a className="back-link" href="/">
            ← Retour à l’accueil
          </a>
          <p className="eyebrow">Boîte de génération · Mathématiques</p>
          <h1>
            Créez votre fiche
            <br />
            <em>à votre façon.</em>
          </h1>
          <p className="hero-text">Chaque génération crée une nouvelle série d’exercices aléatoires.</p>
        </div>
        <div className="workspace">
          <aside className="settings-panel no-print">
            <div className="panel-title">
              <h3>Paramètres de l’activité</h3>
              <span>
                {pages.length} page{pages.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="page-tabs">
              {pages.map((page, index) => (
                <button
                  key={index}
                  type="button"
                  className={pageIndex === index ? 'active' : ''}
                  onClick={() => setPageIndex(index)}
                >
                  Page {index + 1}
                  <small>{topicById[page.topic]?.label ?? page.topic}</small>
                </button>
              ))}
              <button className="add-page" type="button" onClick={addPage}>
                + Nouvelle page
              </button>
            </div>
            <div className="field-group">
              <SelectBox label="Domaine" value={activePage.domain} onChange={(value) => changeDomain(value as Domain)}>
                <option value="algèbre">Algèbre</option>
                <option value="géométrie">Géométrie</option>
              </SelectBox>
              <SelectBox label="Thème" value={activePage.topic} onChange={changeTopic}>
                {available.map((topic) => (
                  <option value={topic.id} key={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </SelectBox>
              <ExerciseTypeCards
                topic={activePage.topic}
                selected={activePage.exerciseType}
                onSelect={(type) => updatePage(applyType(type))}
              />
              <label>
                Questions
                <div className="question-control">
                  <select
                    className="select-control"
                    value={[6, 8, 10, 12, 16].includes(activePage.count) ? activePage.count : 'custom'}
                    onChange={(event) =>
                      event.target.value !== 'custom' && updatePage({ count: Number(event.target.value) })
                    }
                  >
                    <option value="6">6 questions</option>
                    <option value="8">8 questions</option>
                    <option value="10">10 questions</option>
                    <option value="12">12 questions</option>
                    <option value="16">16 questions</option>
                    <option value="custom">Personnalisé</option>
                  </select>
                  <input
                    aria-label="Nombre personnalisé de questions"
                    type="number"
                    min={1}
                    max={30}
                    value={activePage.count}
                    onChange={(event) =>
                      updatePage({ count: Math.max(1, Math.min(30, Number(event.target.value) || 1)) })
                    }
                  />
                </div>
              </label>
              <SelectBox
                label="Colonnes"
                value={String(activePage.columns)}
                onChange={(value) => updatePage({ columns: Number(value) })}
              >
                <option value="1">1 colonne</option>
                <option value="2">2 colonnes</option>
                <option value="3">3 colonnes</option>
              </SelectBox>
              <div className="custom-header-form">
                <b>En-tête et pied de page</b>
                <label>
                  Logo ou nom
                  <input value={header.logo} onChange={(event) => setHeader({ ...header, logo: event.target.value })} />
                </label>
                <label>
                  Titre personnalisé
                  <input
                    value={header.title}
                    onChange={(event) => setHeader({ ...header, title: event.target.value })}
                    placeholder="Ex. Collège des Tilleuls"
                  />
                </label>
                <label>
                  Sous-titre
                  <input
                    value={header.subtitle}
                    onChange={(event) => setHeader({ ...header, subtitle: event.target.value })}
                    placeholder="Ex. Groupe 7H · Mathématiques"
                  />
                </label>
                <label>
                  Pied de page
                  <input
                    value={header.footer}
                    onChange={(event) => setHeader({ ...header, footer: event.target.value })}
                  />
                </label>
              </div>
              <p className="type-hint muted">
                {exerciseTypeById[activePage.exerciseType]?.description ??
                  'Choisissez un thème, puis un type d’exercice.'}
              </p>
              <button className="button full" type="button" onClick={generate}>
                Générer une nouvelle fiche <span>→</span>
              </button>
            </div>
          </aside>
          <section className="result-panel">
            <div className="result-head">
              <div>
                <p className="eyebrow">Aperçu</p>
                <h2>Votre activité est prête.</h2>
              </div>
              <span className="status">Nouvelle version</span>
            </div>
            <div className="preview-tabs no-print">
              <button type="button" className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>
                Fiche élève
              </button>
              <button type="button" className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>
                Corrigé
              </button>
            </div>
            <div className="sheet-stage">
              {worksheets.map((page, index) => (
                <WorksheetSheet
                  key={`${page.exerciseType}-${seed}-${index}`}
                  page={page}
                  mode={mode}
                  header={header}
                  pageNumber={index + 1}
                  total={worksheets.length}
                />
              ))}
            </div>
            <div className="result-actions no-print">
              <button className="button secondary" type="button" onClick={() => printWorksheet('student')}>
                Imprimer la fiche
              </button>
              <button className="button" type="button" onClick={() => printWorksheet('answers')}>
                Imprimer le corrigé
              </button>
              <button className="text-link" type="button" onClick={generate}>
                Régénérer ↻
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [generator, setGenerator] = useState(window.location.pathname === '/generateur')
  const openGenerator = () => {
    window.history.pushState({}, '', '/generateur')
    setGenerator(true)
  }
  return generator ? <GeneratorPage /> : <Landing onCreate={openGenerator} />
}
