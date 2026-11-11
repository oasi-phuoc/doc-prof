import { SHAPES, SHAPE_PATHS, type ShapeId } from '../domain/palette'

export function Shape({ shape }: { shape: ShapeId }) {
  const label = SHAPES.find((s) => s.id === shape)?.label ?? 'Forme'
  return (
    <svg
      className="ci-shape"
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {shape === 'circle' && <circle cx="12" cy="12" r="10" />}
      {shape === 'square' && <rect x="3" y="3" width="18" height="18" rx="1" />}
      {shape === 'oval' && <ellipse cx="12" cy="12" rx="7" ry="11" />}
      {shape !== 'circle' && shape !== 'square' && shape !== 'oval' && <path d={SHAPE_PATHS[shape]} />}
    </svg>
  )
}
export function CardBadge({
  letter,
  shape,
}: {
  letter: string
  shape: ShapeId
}) {
  return (
    <span className="ci-card-badge">
      <b>{letter}</b>
      <Shape shape={shape} />
    </span>
  )
}
