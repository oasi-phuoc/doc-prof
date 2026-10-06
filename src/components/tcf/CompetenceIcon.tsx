import type { ReactNode } from 'react'
import type { TcfCompetence } from '@/tcf/types'

/**
 * Icônes des 4 compétences (tracé repris de soutien-scolaire/public/assets/icons/competences).
 * Trait en `currentColor` : la couleur suit le thème (`--purple`) via `.tcf-competence-icon`.
 */
const PATHS: Record<TcfCompetence, ReactNode> = {
  CE: (
    <>
      <ellipse cx="12" cy="11" rx="3" ry="2.2" />
      <path d="M5.5 11h3" />
      <path d="M15.5 11h3" />
      <path d="M7 16h10" />
      <path d="M7 18h7" />
    </>
  ),
  CO: (
    <>
      <path d="M6 10a6 6 0 0 0 11 3" />
      <path d="M9 15c1.5 1 3.5 1 5 0" />
      <path d="M5 10c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M4 12v2" />
      <path d="M20 12v2" />
    </>
  ),
  PE: (
    <>
      <path d="m4 20 8-14 8 14" />
      <path d="M7 16h10" />
    </>
  ),
  PO: (
    <>
      <path d="M8 8c0-3 1.8-5 4-5s4 2 4 5v10H8V8Z" />
      <path d="M11 14h2" />
      <circle cx="16.5" cy="12.5" r="2.5" />
      <path d="M18.5 11v3" />
    </>
  ),
}

export function CompetenceIcon({ competence }: { competence: TcfCompetence }) {
  return (
    <svg
      className="tcf-competence-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[competence]}
    </svg>
  )
}
