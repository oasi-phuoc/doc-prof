import type { CSSProperties } from 'react'
import type { TcfCompetence } from '@/tcf/types'

/** Icône de compétence : le dessin sert de masque, rempli avec la couleur du thème (`--purple`). */
export function CompetenceIcon({ competence }: { competence: TcfCompetence }) {
  const src = `url(/lib/images/competences/${competence.toLowerCase()}.webp)`
  return (
    <span
      className="tcf-competence-icon"
      style={{ maskImage: src, WebkitMaskImage: src } as CSSProperties}
      aria-hidden="true"
    />
  )
}
