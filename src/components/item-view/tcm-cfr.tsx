import { useCallback, useMemo, useState } from 'react'
import type { MathItem, PreviewMode } from '@/math/types'
import {
  tcmCfrAudioDownloadName,
  tcmCfrAudioKindFromParts,
} from '@/tcm-cfr/audio-nombres'
import { mirrorPoint, type GridPt } from '@/tcm-cfr/symetrie'

/** Concatène des MP3 (mêmes paramètres TTS) en un Blob téléchargeable. */
async function concatMp3(urls: string[]): Promise<Blob> {
  const buffers: ArrayBuffer[] = []
  for (const url of urls) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Audio introuvable : ${url}`)
    buffers.push(await res.arrayBuffer())
  }
  const total = buffers.reduce((n, b) => n + b.byteLength, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const buf of buffers) {
    out.set(new Uint8Array(buf), offset)
    offset += buf.byteLength
  }
  return new Blob([out], { type: 'audio/mpeg' })
}

export function AudioDictationBlock({
  item,
  mode,
}: {
  item: MathItem
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const partsKey = (item.audioParts ?? (item.audioSrc ? [item.audioSrc] : [])).join('|')
  const parts = useMemo(
    () => (partsKey ? partsKey.split('|') : []),
    [partsKey],
  )
  const [busy, setBusy] = useState(false)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  const playlistSrc = objectUrl ?? parts[0] ?? ''

  const ensureConcat = useCallback(async () => {
    if (objectUrl || parts.length <= 1) return objectUrl ?? parts[0] ?? ''
    setBusy(true)
    try {
      const blob = await concatMp3(parts)
      const url = URL.createObjectURL(blob)
      setObjectUrl(url)
      return url
    } finally {
      setBusy(false)
    }
  }, [objectUrl, parts])

  const onDownload = async () => {
    const url = await ensureConcat()
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = tcmCfrAudioDownloadName({ kind: tcmCfrAudioKindFromParts(parts) })
    a.click()
  }

  const onPlayAll = async () => {
    const url = await ensureConcat()
    if (!url) return
    const audio = document.querySelector<HTMLAudioElement>(
      `audio[data-cfr-audio="${parts.join('|')}"]`,
    )
    if (audio) {
      audio.src = url
      void audio.play()
    }
  }

  return (
    <div className="tcm-cfr-audio-dictation">
      <div className="tcm-cfr-audio-controls">
        <audio
          className="oral-audio"
          controls
          preload="none"
          src={playlistSrc}
          data-cfr-audio={parts.join('|')}
        >
          Écoutez l’enregistrement.
        </audio>
        <button type="button" className="tcm-cfr-audio-btn" onClick={() => void onPlayAll()} disabled={busy || parts.length === 0}>
          Écouter
        </button>
        <button type="button" className="tcm-cfr-audio-btn" onClick={() => void onDownload()} disabled={busy || parts.length === 0}>
          Télécharger
        </button>
      </div>
      <span className={`answer-line-field ${show ? 'filled' : ''}`}>
        {show ? item.answer : '\u00a0'}
      </span>
    </div>
  )
}

function toSvg(p: GridPt, cols: number, rows: number, size: number, pad: number) {
  const cell = (size - 2 * pad) / Math.max(cols, rows)
  return {
    x: pad + p.x * cell,
    y: pad + (rows - p.y) * cell,
  }
}

export function SymmetryGridBlock({
  item,
  mode,
}: {
  item: MathItem
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const tpl = item.symmetryFigure
  const mirrorPolys = useMemo(() => {
    if (!tpl) return []
    return tpl.polylines.map((poly) => poly.map((p) => mirrorPoint(p, tpl.axisX)))
  }, [tpl])
  if (!tpl) return null
  const size = 280
  const pad = 12
  const cell = (size - 2 * pad) / Math.max(tpl.cols, tpl.rows)
  const axisColor = 'var(--purple, #5b3a8c)'

  const drawPoly = (poly: GridPt[], key: string, className: string) => {
    if (poly.length === 0) return null
    const d = poly
      .map((p, i) => {
        const s = toSvg(p, tpl.cols, tpl.rows, size, pad)
        return `${i === 0 ? 'M' : 'L'}${s.x},${s.y}`
      })
      .join(' ')
    return <path key={key} d={d} className={className} fill="none" />
  }

  return (
    <div className="tcm-cfr-symmetry">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <svg
        className="tcm-cfr-symmetry-svg"
        viewBox={`0 0 ${size} ${size * (tpl.rows / tpl.cols)}`}
        role="img"
        aria-label="Quadrillage de symétrie axiale"
      >
        {Array.from({ length: tpl.cols + 1 }, (_, i) => {
          const x = pad + i * cell
          return (
            <line
              key={`v${i}`}
              x1={x}
              y1={pad}
              x2={x}
              y2={pad + tpl.rows * cell}
              className="tcm-cfr-grid-line"
            />
          )
        })}
        {Array.from({ length: tpl.rows + 1 }, (_, j) => {
          const y = pad + j * cell
          return (
            <line
              key={`h${j}`}
              x1={pad}
              y1={y}
              x2={pad + tpl.cols * cell}
              y2={y}
              className="tcm-cfr-grid-line"
            />
          )
        })}
        <line
          x1={pad + tpl.axisX * cell}
          y1={pad}
          x2={pad + tpl.axisX * cell}
          y2={pad + tpl.rows * cell}
          stroke={axisColor}
          strokeWidth={2.5}
        />
        {tpl.polylines.map((poly, i) => drawPoly(poly, `src-${i}`, 'tcm-cfr-figure-line'))}
        {show
          ? mirrorPolys.map((poly, i) => drawPoly(poly, `img-${i}`, 'tcm-cfr-figure-image'))
          : null}
      </svg>
    </div>
  )
}

export function SegmentMeasureBlock({
  item,
  mode,
}: {
  item: MathItem
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const segments = item.segments ?? []
  const qPrompts = item.options ?? []
  const answers = (item.answer ?? '').split(';').map((s) => s.trim())

  return (
    <div className="tcm-cfr-segments">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <div className="tcm-cfr-segment-frame">
        {segments.map((seg, i) => {
          const widthMm = Math.min(160, seg.mm)
          return (
            <div className="tcm-cfr-segment-row" key={`seg-${i}`}>
              <span className="tcm-cfr-segment-num">{i + 1}.</span>
              <div className="tcm-cfr-segment-line-wrap">
                <div className="tcm-cfr-segment-line" style={{ width: `${widthMm}mm` }} />
              </div>
              <span className={`answer-line-field compact ${show ? 'filled' : ''}`}>
                {show ? `${seg.display} ${seg.unit}` : '\u00a0'}
              </span>
            </div>
          )
        })}
      </div>
      <p className="column-prompt" style={{ marginTop: '0.8em' }}>
        Cochez la bonne réponse :
      </p>
      {qPrompts.map((q, qi) => (
        <div className="tcm-cfr-segment-qcm" key={`q-${qi}`}>
          <p className="prompt-stack-text">
            {qi + 1}. {q}
          </p>
          <div className="tcm-cfr-qcm-choices">
            {[1, 2, 3].map((n) => {
              const checked = show && answers[qi] === String(n)
              return (
                <label key={n} className={`tcm-cfr-qcm-choice${checked ? ' is-checked' : ''}`}>
                  <span className={`listen-check-box${checked ? ' checked' : ''}`} />
                  {n}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function cellCenter(
  cell: string,
  cols: string[],
  rows: number[],
  width: number,
  height: number,
  pad: number,
) {
  const letter = cell[0]!
  const num = Number(cell.slice(1))
  const ci = cols.indexOf(letter)
  const ri = rows.indexOf(num)
  const cw = (width - 2 * pad) / cols.length
  const rh = (height - 2 * pad) / rows.length
  return {
    x: pad + (ci + 0.5) * cw,
    y: pad + (rows.length - 1 - ri + 0.5) * rh,
    cw,
    rh,
  }
}

export function MetroMapBlock({
  item,
  mode,
}: {
  item: MathItem
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const map = item.metroMap
  const questions = item.metroQuestions ?? []
  if (!map) return null
  const width = 420
  const height = 280
  const pad = 28

  return (
    <div className="tcm-cfr-metro">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <svg className="tcm-cfr-metro-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Plan de métro">
        {/* Grille */}
        {map.cols.map((col, ci) => {
          const x = pad + (ci + 0.5) * ((width - 2 * pad) / map.cols.length)
          return (
            <text key={`c-${col}`} x={x} y={pad - 10} textAnchor="middle" className="tcm-cfr-metro-label">
              {col}
            </text>
          )
        })}
        {map.rows.map((row, ri) => {
          const y = pad + (map.rows.length - 1 - ri + 0.5) * ((height - 2 * pad) / map.rows.length)
          return (
            <text key={`r-${row}`} x={pad - 12} y={y + 4} textAnchor="end" className="tcm-cfr-metro-label">
              {row}
            </text>
          )
        })}
        {map.cols.map((_, ci) =>
          map.rows.map((_, ri) => {
            const cw = (width - 2 * pad) / map.cols.length
            const rh = (height - 2 * pad) / map.rows.length
            return (
              <rect
                key={`cell-${ci}-${ri}`}
                x={pad + ci * cw}
                y={pad + ri * rh}
                width={cw}
                height={rh}
                className="tcm-cfr-metro-cell"
              />
            )
          }),
        )}
        {map.lines.map((line) => {
          const pts = line.cells.map((c) => cellCenter(c, map.cols, map.rows, width, height, pad))
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
          const labelAt = pts[0]!
          return (
            <g key={line.id}>
              <path d={d} fill="none" stroke={line.color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p, i) => (
                <circle key={`${line.id}-n${i}`} cx={p.x} cy={p.y} r={3.5} fill={line.color} stroke="#fff" strokeWidth={1} />
              ))}
              <rect
                x={labelAt.x - 28}
                y={labelAt.y - 18}
                width={56}
                height={14}
                rx={2}
                fill="#fff"
                stroke={line.color}
                strokeWidth={1.2}
              />
              <text x={labelAt.x} y={labelAt.y - 7} textAnchor="middle" className="tcm-cfr-metro-station" fill={line.color}>
                {line.name}
              </text>
            </g>
          )
        })}
      </svg>
      <ol className="tcm-cfr-metro-questions">
        {questions.map((q, i) => (
          <li key={`mq-${i}`}>
            <p className="prompt-stack-text">{q.prompt}</p>
            <span className={`answer-line-field ${show ? 'filled' : ''}`}>
              {show ? q.answer : '\u00a0'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
