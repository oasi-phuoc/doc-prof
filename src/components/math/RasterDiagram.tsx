import { useLayoutEffect, useRef, useState, type CSSProperties, type SVGProps } from 'react'

const PNG_PIXELS_PER_MM = 18
const PNG_PIXELS_PER_UNIT = 5
const MAX_PNG_EDGE = 3200
const MAX_CACHED_IMAGES = 96
const drawingProperties = [
  'color', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity',
  'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing',
  'text-anchor', 'dominant-baseline', 'alignment-baseline', 'paint-order',
  'marker-start', 'marker-mid', 'marker-end', 'clip-path', 'mask',
] as const

type Box = [x: number, y: number, width: number, height: number]
type Graphic = { svg: string; box: Box; width: number; height: number }
type Result = { graphic: Graphic; png: string }
const pngs = new Map<string, Promise<string>>()

function millimetres(value: string | number | undefined) {
  return typeof value === 'string' && value.endsWith('mm') ? Number.parseFloat(value) : undefined
}

function snapshot(source: SVGSVGElement, crop: boolean, physicalWidth?: number, physicalHeight?: number): Graphic {
  const { x, y, width, height } = source.viewBox.baseVal
  let box: Box = [x, y, width, height]
  if (crop) {
    const status = source.dataset.diagramSource
    // Certains moteurs ont besoin d'un SVG visible pour obtenir la boîte du dessin.
    if (status === 'ready') source.removeAttribute('data-diagram-source')
    try {
      const bounds = source.getBBox()
      if (bounds.width > 0 && bounds.height > 0) box = [bounds.x - 8, bounds.y - 8, bounds.width + 16, bounds.height + 16]
    } finally {
      if (status === 'ready') source.dataset.diagramSource = status
    }
  }
  const [, , boxWidth, boxHeight] = box
  const [targetWidth, targetHeight] = physicalWidth && physicalHeight
    ? [physicalWidth * PNG_PIXELS_PER_MM, physicalHeight * PNG_PIXELS_PER_MM]
    : [boxWidth * PNG_PIXELS_PER_UNIT, boxHeight * PNG_PIXELS_PER_UNIT]
  if (!(targetWidth > 0 && targetHeight > 0)) throw new Error('Les dimensions du dessin sont invalides.')
  const scale = Math.min(1, MAX_PNG_EDGE / Math.max(targetWidth, targetHeight))
  const dimensions = [Math.ceil(targetWidth * scale), Math.ceil(targetHeight * scale)] as const

  const copy = source.cloneNode(true) as SVGSVGElement
  const originals = [source, ...source.querySelectorAll<SVGElement>('*')]
  const copies = [copy, ...copy.querySelectorAll<SVGElement>('*')]
  originals.forEach((element, index) => {
    const target = copies[index]!
    const computed = getComputedStyle(element)
    target.removeAttribute('style')
    target.removeAttribute('class')
    for (const property of drawingProperties) {
      const value = computed.getPropertyValue(property)
      if (value) target.style.setProperty(property, value.replace(/url\(["']?[^)'"#]*#([^)'"\s]+)["']?\)/g, 'url(#$1)'))
    }
  })
  copy.removeAttribute('data-diagram-source')
  copy.removeAttribute('aria-hidden')
  copy.setAttribute('width', String(dimensions[0]))
  copy.setAttribute('height', String(dimensions[1]))
  copy.setAttribute('viewBox', box.join(' '))
  copy.setAttribute('preserveAspectRatio', 'none')
  return { svg: new XMLSerializer().serializeToString(copy), box, width: dimensions[0], height: dimensions[1] }
}

async function encodePng({ svg, width, height }: Graphic): Promise<string> {
  const image = new Image()
  const source = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
  const canvas = document.createElement('canvas')
  try {
    image.src = source
    await image.decode()
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Le dessin ne peut pas être converti en PNG.')
    context.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      result => result ? resolve(result) : reject(new Error('Le PNG du dessin est indisponible.')), 'image/png',
    ))
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } finally {
    URL.revokeObjectURL(source)
    canvas.width = 0
  }
}

function pngFor(graphic: Graphic) {
  const key = graphic.svg
  const existing = pngs.get(key)
  if (existing) {
    pngs.delete(key)
    pngs.set(key, existing)
    return existing
  }
  const pending = encodePng(graphic).catch(error => {
    if (pngs.get(key) === pending) pngs.delete(key)
    throw error
  })
  pngs.set(key, pending)
  if (pngs.size > MAX_CACHED_IMAGES) pngs.delete(pngs.keys().next().value!)
  return pending
}

type DiagramProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & { viewBox: string; crop?: boolean; fit?: boolean }

/** Le dessin déterministe du générateur sert de source à l’image imprimée. */
export function RasterDiagram({ children, crop = false, fit = false, className, style, viewBox, width, height, ...props }: DiagramProps) {
  const source = useRef<SVGSVGElement>(null)
  const last = useRef<Result | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [failed, setFailed] = useState(false)
  const physicalWidth = millimetres(width ?? style?.width)
  const physicalHeight = millimetres(height ?? style?.height)

  useLayoutEffect(() => {
    if (!source.current) return
    let current = true
    try {
      const graphic = snapshot(source.current, crop, physicalWidth, physicalHeight)
      if (last.current?.graphic.svg === graphic.svg) {
        setResult(last.current)
        setFailed(false)
        return
      }
      setResult(null)
      setFailed(false)
      void pngFor(graphic).then(png => {
        if (!current) return
        last.current = { graphic, png }
        setResult(last.current)
      }, () => {
        if (current) setFailed(true)
      })
    } catch {
      setResult(null)
      setFailed(true)
    }
    return () => { current = false }
  }, [children, className, crop, physicalHeight, physicalWidth, style, viewBox])

  const png = result?.png
  const imageStyle: CSSProperties = { width, height, ...style }
  const data = Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith('data-')))
  return (
    <>
      <svg {...props} ref={source} className={className} style={style} viewBox={viewBox} width={width} height={height}
        data-diagram-source={png ? 'ready' : failed ? 'failed' : 'pending'} aria-hidden={png ? true : props['aria-hidden']}>
        {children}
      </svg>
      {result && <img {...data} className={`worksheet-diagram-png${className ? ` ${className}` : ''}`}
        data-diagram-fit={fit || undefined} data-diagram-width-mm={fit ? undefined : physicalWidth} data-diagram-height-mm={fit ? undefined : physicalHeight}
        src={result.png} alt={props['aria-label'] ?? ''} style={imageStyle}
        width={result.graphic.box[2]} height={result.graphic.box[3]} />}
    </>
  )
}
