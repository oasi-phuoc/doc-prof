export type { MascotKind } from '../domain/mascot'
export type MascotPose = 'thinking' | 'cards-up' | 'discussion' | 'correct' | 'incorrect' | 'pause'
export function Mascot({ pose, label, className = '' }: { pose: MascotPose; label: string; className?: string }) {
  return <span className={`ci-mascot ${className}`} role="img" aria-label={label}><span className={`ci-mascot-sprite ci-mascot-${pose}`} /></span>
}
