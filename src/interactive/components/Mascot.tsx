import type { CSSProperties } from 'react'
import type { MascotKind } from '../domain/mascot'
export type { MascotKind } from '../domain/mascot'
export type MascotPose = 'thinking' | 'cards-up' | 'discussion' | 'correct' | 'incorrect' | 'pause'
export function Mascot({ pose, label, className = '', kind }: { pose: MascotPose; label: string; className?: string; kind?: MascotKind }) {
  return <span className={`ci-mascot ${className}`} style={kind ? { '--ci-mascot-image': `url('/lib/images/interactive/${kind}-mascot.webp')` } as CSSProperties : undefined} role="img" aria-label={label}><span data-ci-motion className={`ci-mascot-sprite ci-mascot-${pose}`} /></span>
}
