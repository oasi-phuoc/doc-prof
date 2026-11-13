import { mascotStyle, type MascotKind, type MascotPose } from '../domain/mascot'
import { usePreparedMedia } from '../media/prepared-context'
export type { MascotKind } from '../domain/mascot'
export type { MascotPose } from '../domain/mascot'
export function Mascot({ pose, label, className = '', kind, decorative = false }: { pose: MascotPose; label: string; className?: string; kind?: MascotKind; decorative?: boolean }) {
  const resolve = usePreparedMedia()
  return <span className={`ci-mascot ${className}`} style={kind ? mascotStyle(kind,resolve) : undefined} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : label} aria-hidden={decorative || undefined}><span data-ci-motion className={`ci-mascot-sprite ci-mascot-${pose}`} /></span>
}
