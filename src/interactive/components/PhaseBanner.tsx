import type { Phase } from '../domain/types'
import { Icon, type IconName } from './Icons'

const phases: Record<Phase, { icon: IconName; text: string }> = {
  thinking: { icon: 'think', text: 'Je réfléchis' },
  'cards-up': { icon: 'card', text: 'Je lève ma carte' },
  selected: { icon: 'touch', text: 'Un choix au tableau' },
  discussion: { icon: 'discuss', text: 'Discutons de la réponse' },
  revealed: { icon: 'check', text: 'La correction' },
}
export function PhaseBanner({
  phase,
  choice,
}: {
  phase: Phase
  choice: boolean
}) {
  const current = phases[phase]
  return (
    <div className="ci-phase-banner" role="status">
      <Icon
        name={
          choice
            ? current.icon
            : phase === 'cards-up'
              ? 'discuss'
              : current.icon
        }
      />
      <span>
        {!choice && phase === 'cards-up' ? 'Nous échangeons' : current.text}
      </span>
      {choice && phase === 'cards-up' && (
        <div className="ci-phase-next">
          <span>L’élève choisit au tableau</span>
          <Icon name="touch" />
        </div>
      )}
    </div>
  )
}
