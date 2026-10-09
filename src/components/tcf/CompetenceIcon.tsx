import type { TcfCompetence } from '@/tcf/types'

export function CompetenceIcon({ competence }: { competence: TcfCompetence }) {
  return (
    <img
      className="tcf-competence-icon"
      src={`/lib/images/competences/${competence.toLowerCase()}.webp`}
      alt=""
      aria-hidden="true"
    />
  )
}
