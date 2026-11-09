import { SHAPES, type ShapeId } from '../domain/palette'

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
      {shape === 'triangle' && <path d="m12 2 11 20H1Z" />}
      {shape === 'diamond' && <path d="m12 1 11 11-11 11L1 12Z" />}
      {shape === 'star' && (
        <path d="m12 1 3.4 7 7.6 1.1-5.5 5.4 1.3 7.5L12 18.4 5.2 22l1.3-7.5L1 9.1 8.6 8Z" />
      )}
      {shape === 'cross' && <path d="M8 1h8v7h7v8h-7v7H8v-7H1V8h7Z" />}
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
