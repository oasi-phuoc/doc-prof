import type { ReactNode } from 'react'

export type HeaderStyle = 'institutionnel' | 'personnalise'

export type InstitutionalHeader = {
  schoolName: string
  schoolYear: string
  schoolTagline: string
  orgLine1: string
  orgLine2: string
  orgLine3: string
  classLevel: string
  classNumber: string
  course: string
  documentTitle: string
  /** Chemin, URL ou data URL du logo. Vide = emplacement sans image. */
  logoSrc: string
}

export const DEFAULT_INSTITUTIONAL_LOGO = '/lib/logos/etat-du-valais.webp'

export type CustomHeader = {
  logo: string
  title: string
  subtitle: string
  footer: string
}

export const DEFAULT_INSTITUTIONAL: InstitutionalHeader = {
  schoolName: 'SCAI',
  schoolYear: '2025-2026',
  schoolTagline: "Classes d'accueil",
  orgLine1: 'Département de la santé, des affaires sociales et de la culture',
  orgLine2: "Service de l'action sociale",
  orgLine3: "Office de l'asile",
  classLevel: 'CSC',
  classNumber: '01',
  course: 'Mathématiques',
  documentTitle: '',
  logoSrc: DEFAULT_INSTITUTIONAL_LOGO,
}

export const CLASS_LEVELS = ['CSC', 'CFR', 'EPL', 'CPR', 'HSS'] as const
export const CLASS_NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'))
export const COURSES = [
  'Mathématiques',
  'Français',
  'Sciences et santé',
  'Découverte de la société',
  'Informatique',
  'Sport',
]

function formatPrintDate(date = new Date()): string {
  return new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

export function InstitutionalDocumentHeader({
  config,
  evalMode,
  totalPoints,
  fallbackTitle,
}: {
  config: InstitutionalHeader
  evalMode: boolean
  totalPoints?: number
  fallbackTitle?: string
}) {
  const title = config.documentTitle.trim() || fallbackTitle || ''
  return (
    <div className="doc-header institutional">
      <div className="doc-header-top">
        <div className="doc-header-school">
          <p className="doc-school-name">{config.schoolName}</p>
          <p>{config.schoolYear}</p>
          <p className="doc-school-tag">{config.schoolTagline}</p>
        </div>
        <div className="doc-header-org">
          <div className="doc-logo-slot">
            {config.logoSrc ? (
              <img src={config.logoSrc} alt="" />
            ) : (
              <span aria-hidden>Logo</span>
            )}
          </div>
          <div className="doc-org-lines">
            <p>{config.orgLine1}</p>
            <p>{config.orgLine2}</p>
            <p>{config.orgLine3}</p>
          </div>
        </div>
      </div>
      <div className="doc-header-course">
        <p>
          {config.classLevel} {config.classNumber}
        </p>
        <p>Cours {config.course}</p>
      </div>
      <div className="doc-student-block">
        <div className="doc-student-fields">
          {(['Nom', 'Prénom', 'Date'] as const).map((label) => (
            <p key={label} className="doc-student-row">
              <span className="doc-student-label">{label}</span>
              <span className="doc-student-colon">:</span>
              <span className="doc-student-line" />
            </p>
          ))}
        </div>
        {evalMode ? (
          <div className="doc-eval-grid">
            {(['Pts', 'Total', 'Note', 'N°'] as const).map((heading) => (
              <div key={heading} className="doc-eval-cell head">
                {heading}
              </div>
            ))}
            <div className="doc-eval-cell" />
            <div className="doc-eval-cell strong">{totalPoints ?? ''}</div>
            <div className="doc-eval-cell" />
            <div className="doc-eval-cell" />
          </div>
        ) : (
          <div className="doc-numero-box">
            <div className="doc-eval-cell head">N°</div>
            <div className="doc-eval-cell" />
          </div>
        )}
      </div>
      {title ? <p className="doc-document-title">{title}</p> : null}
    </div>
  )
}

export function CustomDocumentHeader({
  config,
  pageTitle,
  domain,
}: {
  config: CustomHeader
  pageTitle: string
  domain: string
}) {
  const kicker =
    domain === 'lecture'
      ? 'FRANÇAIS · LECTURE'
      : domain === 'phrase'
        ? 'FRANÇAIS · PHRASE'
        : domain === 'français'
          ? 'FRANÇAIS'
          : `MATHÉMATIQUES · ${domain.toUpperCase()}`
  return (
    <div className="doc-header custom">
      <div className="custom-print-header">
        <div className="custom-logo">{config.logo || 'ClairFLE'}</div>
        <div>
          <strong>{config.title || pageTitle}</strong>
          {config.subtitle && <small>{config.subtitle}</small>}
        </div>
        <span>{formatPrintDate()}</span>
      </div>
      <div className="sheet-header">
        <div>
          <span className="sheet-kicker">{kicker}</span>
          <h3>{pageTitle}</h3>
        </div>
        <span className="sheet-number">Fiche d’activité</span>
      </div>
      <div className="student-line">
        Nom : <span /> Date : <span />
      </div>
    </div>
  )
}

export function DocumentFooter({
  pageNumber,
  total,
}: {
  pageNumber: number
  total: number
  /** @deprecated Pied fixe ; ignoré. */
  text?: string
  printedBy?: string
}) {
  return (
    <footer className="sheet-footer doc-footer">
      <div className="doc-footer-left">
        <strong>ClairFLE - Support imprimable</strong>
      </div>
      <div className="doc-footer-right">
        <span>ThanhPhuoc VAN</span>
        <span>Imprimé le {formatPrintDate()}</span>
        <span>
          Page {pageNumber} / {total}
        </span>
      </div>
    </footer>
  )
}

export function QuestionPoints({ points }: { points: number }) {
  return (
    <span className="question-points">
      {points} pt{points > 1 ? 's' : ''}
    </span>
  )
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className="sheet-body">{children}</div>
}
