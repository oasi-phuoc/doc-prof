import type { Phase } from '../domain/types'
const illustrations = {
  thinking: { image: 'thinking', text: 'Je réfléchis' },
  'cards-up': { image: 'cards-up', text: 'Je lève ma carte' },
  selected: { image: 'board-turn', text: 'Un choix au tableau' },
  discussion: { image: 'discussion', text: 'Discutons de la réponse' },
  revealed: { image: 'discussion', text: 'La correction' },
} as const
export function PhaseBanner({
  phase,
  choice,
  side = 'left',
}: {
  phase: Phase
  choice: boolean
  side?: 'left' | 'right'
}) {
  if (phase === 'revealed') return null
  if (
    side === 'right' &&
    (!['cards-up', 'selected'].includes(phase) || !choice)
  )
    return null
  const current =
    side === 'right'
      ? { image: 'board-turn', text: 'L’élève choisit au tableau' }
      : !choice && phase === 'cards-up'
        ? { image: 'discussion', text: 'Nous échangeons' }
        : choice && phase === 'selected'
          ? illustrations['cards-up']
          : illustrations[phase]
  return (
    <div className="ci-phase-banner" role="status">
      <img
        className="ci-phase-art"
        src={`/lib/images/interactive/${current.image}.webp`}
        alt={current.text}
      />
      <span className="ci-phase-label">{current.text}</span>
    </div>
  )
}
