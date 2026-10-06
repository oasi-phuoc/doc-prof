import type { TcfCompetence } from '@/tcf/types'
import iconCe from '@/assets/icons/competences/icon-ce.svg?raw'
import iconCo from '@/assets/icons/competences/icon-co.svg?raw'
import iconPe from '@/assets/icons/competences/icon-pe.svg?raw'
import iconPo from '@/assets/icons/competences/icon-po.svg?raw'

/** Trait forcé en `currentColor` : la couleur suit le thème (`--purple`) via `.tcf-competence-icon`. */
const themed = (svg: string) => svg.replace(/stroke="#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"')

const ICONS: Record<TcfCompetence, string> = {
  CE: themed(iconCe),
  CO: themed(iconCo),
  PE: themed(iconPe),
  PO: themed(iconPo),
}

export function CompetenceIcon({ competence }: { competence: TcfCompetence }) {
  return (
    <span
      className="tcf-competence-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[competence] }}
    />
  )
}
