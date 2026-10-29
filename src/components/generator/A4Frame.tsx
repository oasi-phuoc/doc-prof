import {
  forwardRef,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type Ref,
} from 'react'

type A4FrameProps = {
  children: ReactNode
  className?: string
}

/** CSS mm → px (référence 96 dpi) — même conversion que les navigateurs pour `210mm`. */
const A4_WIDTH_PX = (210 * 96) / 25.4

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === 'function') ref(value)
  else ref.current = value
}

function syncA4Scale(frame: HTMLElement) {
  const width = frame.clientWidth
  if (width <= 0) return
  const sheet = frame.querySelector(':scope > .worksheet-sheet') as HTMLElement | null
  const layoutW = sheet?.offsetWidth || A4_WIDTH_PX
  if (layoutW <= 0) return
  const next = width / layoutW
  const prev = Number(frame.style.getPropertyValue('--a4-scale'))
  if (Number.isFinite(prev) && Math.abs(prev - next) < 0.0005) return
  frame.style.setProperty('--a4-scale', String(next))
}

/**
 * Cadre aperçu A4 : calcule `--a4-scale` via ResizeObserver.
 * Évite `scale(calc(100cqw / 210mm))`, mal résolu sous Firefox (feuille tronquée).
 */
export const A4Frame = forwardRef<HTMLDivElement, A4FrameProps>(function A4Frame(
  { children, className },
  ref,
) {
  const localRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const frame = localRef.current
    if (!frame) return

    const run = () => syncA4Scale(frame)
    run()

    const ro = new ResizeObserver(run)
    ro.observe(frame)

    const observeSheet = () => {
      const sheet = frame.querySelector(':scope > .worksheet-sheet')
      if (sheet instanceof HTMLElement) ro.observe(sheet)
    }
    observeSheet()

    const mo = new MutationObserver(() => {
      observeSheet()
      run()
    })
    mo.observe(frame, { childList: true })

    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <div
      className={className ? `a4-frame ${className}` : 'a4-frame'}
      ref={(node) => {
        localRef.current = node
        assignRef(ref, node)
      }}
    >
      {children}
    </div>
  )
})
