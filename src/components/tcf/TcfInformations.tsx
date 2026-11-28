import type { TcfCompetence, TcfNiveau } from '@/tcf/types'
import { TPF_PLACEMENT_TASKS } from '@/tcf/tpf-placement'
import { CompetenceIcon } from './CompetenceIcon'

type Partie = {
  id: TcfCompetence
  titre: string
  slogan: string
  exercices: (niveau: TcfNiveau) => number
}

const PARTIES: readonly Partie[] = [
  {
    id: 'CE',
    titre: 'Compréhension écrite',
    slogan: 'Je lis.',
    exercices: () => 4,
  },
  {
    id: 'CO',
    titre: 'Compréhension orale',
    slogan: 'J’écoute.',
    exercices: (niveau) => (niveau === 'A0-A1' ? 5 : 4),
  },
  {
    id: 'PE',
    titre: 'Production écrite',
    slogan: 'J’écris en français.',
    exercices: (niveau) => (niveau === 'A2-B1' ? 3 : 4),
  },
  {
    id: 'PO',
    titre: 'Production orale',
    slogan: 'Je parle en français.',
    exercices: () => 3,
  },
]

function exercicesLabel(n: number): string {
  return n <= 1 ? `${n} exercice` : `${n} exercices`
}

/** Page 1 du TPF / TCF : les quatre parties du test. */
export function TcfInformations({ niveau, placement, pointsByCompetence }: { niveau: TcfNiveau; placement?: boolean; pointsByCompetence?: Record<TcfCompetence, number> }) {
  const parties = placement ? [PARTIES[1]!, PARTIES[0]!, PARTIES[2]!, PARTIES[3]!] : PARTIES
  return (
    <div className="tcf-info">
      <ul className="tcf-info-parties">
        {parties.map((p, i) => {
          const n = placement ? TPF_PLACEMENT_TASKS.filter((task) => task.competence === p.id).length : p.exercices(niveau)
          return (
            <li key={p.id} className="tcf-info-partie">
              <span className="tcf-info-num" aria-hidden="true">
                {i + 1}
              </span>
              <CompetenceIcon competence={p.id} />
              <div className="tcf-info-texte">
                <p className="tcf-info-partie-title">{p.titre}</p>
                <p className="tcf-info-partie-slogan">{p.slogan}</p>
                <p className="tcf-info-partie-count">{exercicesLabel(n)}</p>
              </div>
              <span className="tcf-info-points">{(pointsByCompetence?.[p.id] ?? 25).toLocaleString('fr-CH', { maximumFractionDigits: 2 })} pts</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
