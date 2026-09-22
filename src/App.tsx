import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import './App.css'
import { MathItemView } from '@/components/math/MathItemView'
import {
  CLASS_LEVELS,
  CLASS_NUMBERS,
  COURSES,
  CustomDocumentHeader,
  DEFAULT_INSTITUTIONAL,
  DocumentFooter,
  InstitutionalDocumentHeader,
  SheetBody,
  type CustomHeader,
  type HeaderStyle,
  type InstitutionalHeader,
} from '@/components/math/PrintDocumentChrome'
import {
  algebraTopics,
  defaultPage,
  exerciseTypeById,
  firstTypeFor,
  geometryTopics,
  typesForTopic,
} from '@/math/catalog'
import { buildPage } from '@/math/generate'
import { randomSeed } from '@/math/rng'
import type { Domain, ExerciseType, PageConfig, PreviewMode, WorksheetPage } from '@/math/types'

function WorksheetSheet({
  page,
  mode,
  headerStyle,
  institutional,
  custom,
  evalMode,
  pointsPerQuestion,
  pageNumber,
  total,
}: {
  page: WorksheetPage
  mode: PreviewMode
  headerStyle: HeaderStyle
  institutional: InstitutionalHeader
  custom: CustomHeader
  evalMode: boolean
  pointsPerQuestion: number
  pageNumber: number
  total: number
}) {
  const totalPoints = page.items.length * pointsPerQuestion
  return (
    <article className="worksheet-sheet" style={{ '--sheet-columns': page.columns } as CSSProperties}>
      {headerStyle === 'institutionnel' ? (
        <InstitutionalDocumentHeader
          config={institutional}
          evalMode={evalMode}
          totalPoints={evalMode ? totalPoints : undefined}
          fallbackTitle={page.title}
        />
      ) : (
        <CustomDocumentHeader config={custom} pageTitle={page.title} domain={page.domain} />
      )}
      <SheetBody>
        <div className="sheet-instruction">
          <b>Consigne</b>
          <p>{page.instruction}</p>
        </div>
        <div className="exercise-grid">
          {page.items.map((item, index) => (
            <MathItemView
              key={`${page.exerciseType}-${index}-${item.answer}`}
              item={item}
              mode={mode}
              index={index}
              points={pointsPerQuestion}
              showPoints={evalMode}
            />
          ))}
        </div>
      </SheetBody>
      <DocumentFooter text={custom.footer} pageNumber={pageNumber} total={total} />
    </article>
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
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('institutionnel')
  const [institutional, setInstitutional] = useState<InstitutionalHeader>(DEFAULT_INSTITUTIONAL)
  const [custom, setCustom] = useState<CustomHeader>({
    title: '',
    subtitle: '',
    logo: 'ClairFLE',
    footer: 'ClairFLE · Support imprimable',
  })
  const [evalMode, setEvalMode] = useState(false)
  const [pointsPerQuestion, setPointsPerQuestion] = useState(1)
  const [seed, setSeed] = useState(randomSeed)

  const activePage = pages[pageIndex] ?? pages[0]!
  const available = activePage.domain === 'algèbre' ? algebraTopics : geometryTopics
  const worksheets = useMemo(
    () => pages.map((page, index) => buildPage(page, seed + index * 7919)),
    [pages, seed],
  )
  const sheetTotalPoints = useMemo(
    () => worksheets.reduce((sum, page) => sum + page.items.length * pointsPerQuestion, 0),
    [worksheets, pointsPerQuestion],
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

  const sheetProps = {
    mode,
    headerStyle,
    institutional,
    custom,
    evalMode,
    pointsPerQuestion,
  } as const


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
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={pageIndex === index ? 'active' : ''}
                  onClick={() => setPageIndex(index)}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              <button className="add-page" type="button" onClick={addPage} aria-label="Nouvelle page">
                +
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
              <SelectBox
                label="Type d’exercice"
                value={activePage.exerciseType}
                onChange={(value) => {
                  const type = exerciseTypeById[value]
                  if (type) updatePage(applyType(type))
                }}
              >
                {typesForTopic(activePage.topic).map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.label}
                  </option>
                ))}
              </SelectBox>
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

              <div className="mode-toggle-block">
                <b>Mode de la fiche</b>
                <div className="mode-toggle">
                  <button
                    type="button"
                    className={!evalMode ? 'active' : ''}
                    onClick={() => setEvalMode(false)}
                  >
                    Exercice
                  </button>
                  <button
                    type="button"
                    className={evalMode ? 'active' : ''}
                    onClick={() => {
                      setEvalMode(true)
                      if (!institutional.documentTitle.trim()) {
                        setInstitutional((current) => ({ ...current, documentTitle: 'Évaluation' }))
                      }
                    }}
                  >
                    Évaluation
                  </button>
                </div>
                {evalMode && (
                  <label>
                    Points par question
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={pointsPerQuestion}
                      onChange={(event) =>
                        setPointsPerQuestion(Math.max(1, Math.min(20, Number(event.target.value) || 1)))
                      }
                    />
                    <small className="muted">
                      Total fiche : {worksheets[pageIndex]?.items.length ?? 0} × {pointsPerQuestion} ={' '}
                      {(worksheets[pageIndex]?.items.length ?? 0) * pointsPerQuestion} pts
                      {pages.length > 1 ? ` · toutes pages ${sheetTotalPoints} pts` : ''}
                    </small>
                  </label>
                )}
              </div>

              <div className="custom-header-form">
                <b>En-tête</b>
                <div className="mode-toggle">
                  <button
                    type="button"
                    className={headerStyle === 'institutionnel' ? 'active' : ''}
                    onClick={() => setHeaderStyle('institutionnel')}
                  >
                    Institutionnel
                  </button>
                  <button
                    type="button"
                    className={headerStyle === 'personnalise' ? 'active' : ''}
                    onClick={() => setHeaderStyle('personnalise')}
                  >
                    Personnalisé
                  </button>
                </div>
                {headerStyle === 'institutionnel' ? (
                  <>
                    <label>
                      Établissement
                      <input
                        value={institutional.schoolName}
                        onChange={(event) => setInstitutional({ ...institutional, schoolName: event.target.value })}
                      />
                    </label>
                    <label>
                      Année
                      <input
                        value={institutional.schoolYear}
                        onChange={(event) => setInstitutional({ ...institutional, schoolYear: event.target.value })}
                      />
                    </label>
                    <label>
                      Mention
                      <input
                        value={institutional.schoolTagline}
                        onChange={(event) => setInstitutional({ ...institutional, schoolTagline: event.target.value })}
                      />
                    </label>
                    <label>
                      Organisation (ligne 1)
                      <input
                        value={institutional.orgLine1}
                        onChange={(event) => setInstitutional({ ...institutional, orgLine1: event.target.value })}
                      />
                    </label>
                    <label>
                      Organisation (ligne 2)
                      <input
                        value={institutional.orgLine2}
                        onChange={(event) => setInstitutional({ ...institutional, orgLine2: event.target.value })}
                      />
                    </label>
                    <label>
                      Organisation (ligne 3)
                      <input
                        value={institutional.orgLine3}
                        onChange={(event) => setInstitutional({ ...institutional, orgLine3: event.target.value })}
                      />
                    </label>
                    <SelectBox
                      label="Classe"
                      value={institutional.classLevel}
                      onChange={(value) => setInstitutional({ ...institutional, classLevel: value })}
                    >
                      {CLASS_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </SelectBox>
                    <SelectBox
                      label="N° de classe"
                      value={institutional.classNumber}
                      onChange={(value) => setInstitutional({ ...institutional, classNumber: value })}
                    >
                      {CLASS_NUMBERS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </SelectBox>
                    <SelectBox
                      label="Cours"
                      value={institutional.course}
                      onChange={(value) => setInstitutional({ ...institutional, course: value })}
                    >
                      {COURSES.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </SelectBox>
                    <label>
                      Titre du document
                      <input
                        value={institutional.documentTitle}
                        onChange={(event) =>
                          setInstitutional({ ...institutional, documentTitle: event.target.value })
                        }
                        placeholder={evalMode ? 'Évaluation' : activePage.topic}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Logo ou nom
                      <input value={custom.logo} onChange={(event) => setCustom({ ...custom, logo: event.target.value })} />
                    </label>
                    <label>
                      Titre personnalisé
                      <input
                        value={custom.title}
                        onChange={(event) => setCustom({ ...custom, title: event.target.value })}
                        placeholder="Ex. Collège des Tilleuls"
                      />
                    </label>
                    <label>
                      Sous-titre
                      <input
                        value={custom.subtitle}
                        onChange={(event) => setCustom({ ...custom, subtitle: event.target.value })}
                        placeholder="Ex. Groupe 7H · Mathématiques"
                      />
                    </label>
                  </>
                )}
                <label>
                  Pied de page
                  <input
                    value={custom.footer}
                    onChange={(event) => setCustom({ ...custom, footer: event.target.value })}
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
            <div className="sheet-preview-wrap no-print-nav">
              <div className="sheet-stage">
                <div className="a4-frame">
                  <WorksheetSheet
                    key={`${worksheets[pageIndex]?.exerciseType}-${seed}-${pageIndex}`}
                    page={worksheets[pageIndex]!}
                    pageNumber={pageIndex + 1}
                    total={worksheets.length}
                    {...sheetProps}
                  />
                </div>
              </div>
              {pages.length > 1 && (
                <nav className="page-rail no-print" aria-label="Navigation entre les pages">
                  <div className="page-rail-line" aria-hidden />
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`page-rail-item ${pageIndex === index ? 'active' : ''}`}
                      onClick={() => setPageIndex(index)}
                      aria-label={`Page ${index + 1}`}
                    >
                      <span className="page-rail-dot" />
                      <span className="page-rail-label">{index + 1}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
            {/* Toutes les pages pour l’impression */}
            <div className="sheet-stage print-only-sheets" aria-hidden>
              {worksheets.map((page, index) => (
                <WorksheetSheet
                  key={`print-${page.exerciseType}-${seed}-${index}`}
                  page={page}
                  pageNumber={index + 1}
                  total={worksheets.length}
                  {...sheetProps}
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
