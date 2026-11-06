import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { CompositeFigure } from '@/components/math/CompositeFigure'
import { CoordGrid } from '@/components/math/CoordGrid'
import { FractionShape } from '@/components/math/FractionShape'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import type { WorksheetPage } from '@/math/types'
import { buildPlayRounds, cardTone, PLAY_CARDS, sameAnswer, type PlayChip, type PlayRound, type PlaySlot } from './play-model'

type Drag = { id: string; x: number; y: number; moved: boolean }

function isNegativeSubtraction(round: PlayRound | undefined): boolean {
  if (!round || round.scene.type !== 'calc' || round.scene.result != null) return false
  if (round.scene.op !== '−' && round.scene.op !== '-') return false
  const value = Number(String(round.correctChoice ?? '').replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(value) && value < 0
}

function VerdictMark({ status }: { status: 'idle' | 'ok' | 'retry' }) {
  const label = status === 'ok' ? 'Juste' : status === 'retry' ? 'Faux' : ''
  return (
    <p className={`game-mark is-${status}`} role="status" aria-label={label || undefined}>
      {status === 'ok' ? (
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path fill="#fff" d="M10.1 16.3 6.2 12.4l1.5-1.5 2.4 2.4 6.2-6.2 1.5 1.5z" />
        </svg>
      ) : status === 'retry' ? (
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path
            fill="#fff"
            d="M8.2 6.7 12 10.5l3.8-3.8 1.5 1.5-3.8 3.8 3.8 3.8-1.5 1.5L12 13.5l-3.8 3.8-1.5-1.5 3.8-3.8-3.8-3.8z"
          />
        </svg>
      ) : null}
    </p>
  )
}

function ChipFace({ chip }: { chip: PlayChip }) {
  return (
    <>
      {chip.image ? <img src={chip.image} alt="" /> : null}
      <span>{chip.label}</span>
    </>
  )
}

function SlotBox({
  slot,
  chip,
  mark,
  onPlace,
}: {
  slot: PlaySlot
  chip?: PlayChip
  mark?: 'ok' | 'bad'
  onPlace: (chipId: string, slotId: string) => void
}) {
  return (
    <button
      type="button"
      className={`game-slot${mark ? ` is-${mark}` : ''}${chip ? ' is-filled' : ''}`}
      data-slot={slot.id}
      onClick={() => {
        const selected = document.querySelector<HTMLElement>('.game-chip.is-picked')
        const chipId = selected?.dataset.chip
        if (chipId) onPlace(chipId, slot.id)
      }}
    >
      {slot.label ? <small>{slot.label}</small> : null}
      {chip ? (
        <span className="game-chip is-nested" data-tone={chip.tone} aria-label={`${PLAY_CARDS[chip.tone] ?? ''} : ${chip.label}`}>
          <ChipFace chip={chip} />
        </span>
      ) : (
        <span className="game-slot-hint">Déposez</span>
      )}
    </button>
  )
}

export function GameBoard({
  sheet,
  onNewQuestion,
  onScored,
}: {
  sheet: WorksheetPage | undefined
  onNewQuestion: () => void
  onScored: (correct: boolean) => void
}) {
  const rounds = useMemo(() => buildPlayRounds(sheet), [sheet])
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [choice, setChoice] = useState<string | null>(null)
  const [circled, setCircled] = useState<string[]>([])
  const [colored, setColored] = useState<number[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'ok' | 'retry'>('idle')
  const [ghost, setGhost] = useState<{ id: string; x: number; y: number } | null>(null)
  const drag = useRef<Drag | null>(null)
  const refresh = useRef(onNewQuestion)
  refresh.current = onNewQuestion
  const scored = useRef(onScored)
  scored.current = onScored
  const counted = useRef<string | null>(null)
  const round = rounds[0]
  const redraws = useRef(0)

  useEffect(() => {
    if (!isNegativeSubtraction(round)) {
      redraws.current = 0
      return
    }
    if (redraws.current >= 8) return
    redraws.current += 1
    refresh.current()
  }, [round])

  useEffect(() => {
    setPlaced({})
    setChoice(null)
    setCircled([])
    setColored([])
    setPicked(null)
    setStatus('idle')
    setGhost(null)
  }, [round?.key])

  useEffect(() => {
    if (status === 'idle') return
    const mark = `${round?.key ?? ''}:${status}`
    if (counted.current !== mark) {
      counted.current = mark
      scored.current(status === 'ok')
    }
  }, [status, round?.key])

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => refresh.current(), 900)
    return () => window.clearTimeout(timer)
  }, [status, round?.key])

  const chipById = useMemo(() => {
    const map = new Map<string, PlayChip>()
    for (const chip of round?.chips ?? []) map.set(chip.id, chip)
    for (const chip of round?.choices ?? []) map.set(chip.id, chip)
    return map
  }, [round])

  const place = (chipId: string, slotId: string) => {
    if (status !== 'idle' || !round) return
    const next = { ...placed }
    for (const [slot, id] of Object.entries(next)) {
      if (id === chipId) delete next[slot]
    }
    next[slotId] = chipId
    setPlaced(next)
    setPicked(null)
    const slots = round.slots ?? []
    if (slots.length > 0 && slots.every((slot) => next[slot.id])) {
      const good = slots.every((slot) => {
        const chip = (round.chips ?? []).find((item) => item.id === next[slot.id])
        return chip ? sameAnswer(chip.label, slot.expected) : false
      })
      setStatus(good ? 'ok' : 'retry')
    }
  }

  const release = (chipId: string) => {
    setPlaced((prev) => {
      const next = { ...prev }
      for (const [slot, id] of Object.entries(next)) {
        if (id === chipId) delete next[slot]
      }
      return next
    })
    setStatus('idle')
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, chipId: string) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id: chipId, x: event.clientX, y: event.clientY, moved: false }
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current) return
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 6) current.moved = true
    if (current.moved) setGhost({ id: current.id, x: event.clientX, y: event.clientY })
  }
  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    drag.current = null
    setGhost(null)
    if (!current) return
    if (!current.moved) {
      setPicked((id) => (id === current.id ? null : current.id))
      return
    }
    const hit = document.elementFromPoint(event.clientX, event.clientY)
    const slot = hit?.closest<HTMLElement>('[data-slot]')
    if (slot?.dataset.slot) place(current.id, slot.dataset.slot)
    else release(current.id)
  }

  const choose = (id: string) => {
    if (status !== 'idle' || round?.mode !== 'choice') return
    setChoice(id)
    const chip = round.choices?.find((item) => item.id === id)
    setStatus(chip && sameAnswer(chip.label, round.correctChoice ?? '') ? 'ok' : 'retry')
  }

  if (!round) {
    return (
      <div className="game-board">
        <p className="game-empty">Régénérez la fiche pour afficher un exercice au tableau.</p>
      </div>
    )
  }

  const slotMark = (slot: PlaySlot): 'ok' | 'bad' | undefined => {
    if (status === 'idle') return undefined
    const chip = chipById.get(placed[slot.id] ?? '')
    if (!chip) return 'bad'
    return sameAnswer(chip.label, slot.expected) ? 'ok' : 'bad'
  }

  const used = new Set(Object.values(placed))
  const tray = (round.chips ?? []).filter((chip) => !used.has(chip.id))
  const ghostChip = ghost ? chipById.get(ghost.id) : undefined
  if (round.mode === 'choice') {
    return (
      <section className={`game-card-play${status !== 'idle' ? ' is-locked' : ''}`} aria-label="Tableau interactif">
        <div className="game-card-play-expression">
          <div className="game-question-card">
            <QuestionFace round={round} />
          </div>
          <VerdictMark status={status} />
        </div>
        <div className="game-card-play-choices" data-count={round.choices?.length ?? 0}>
          {(round.choices ?? []).map((chip) => {
            const selected = choice === chip.id
            const mark =
              status !== 'idle' && selected
                ? sameAnswer(chip.label, round.correctChoice ?? '')
                  ? 'ok'
                  : 'bad'
                : undefined
            return (
              <button
                key={chip.id}
                type="button"
                className={`game-chip${selected ? ' is-circled' : ''}${mark ? ` is-${mark}` : ''}`}
                data-tone={chip.tone}
                aria-pressed={selected}
                onClick={() => choose(chip.id)}
              >
                <ChipFace chip={chip} />
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section className="game-board" aria-label="Tableau interactif">
      <header className="game-board-bar">
        <div>
          <p className="game-kicker">{round.exerciseTitle}</p>
          <p className="game-instruction">{round.instruction}</p>
        </div>
      </header>
      <div className="game-board-stage">
        <div className="game-zone game-zone-prompt">
          <p className="game-zone-label">Énoncé</p>
          <div className="game-prompt-with-mark">
          <Prompt
            round={round}
            placed={placed}
            chipById={chipById}
            slotMark={slotMark}
            onPlace={place}
            colored={colored}
            setColored={(next) => {
              setColored(next)
              setStatus('idle')
            }}
          />
          <VerdictMark status={status} />
          </div>
        </div>
        <div className="game-zone game-zone-answer">
          <p className="game-zone-label">{round.mode === 'circle' ? 'Entourez' : 'Réponse'}</p>
          <Answer
            round={round}
            choice={choice}
            setChoice={choose}
            circled={circled}
            toggleCircle={(id) => {
              setCircled((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              setStatus('idle')
            }}
            placed={placed}
            chipById={chipById}
            slotMark={slotMark}
            onPlace={place}
            status={status}
          />
        </div>
      </div>
      {round.mode === 'slots' ? (
        <div className="game-zone game-zone-pieces">
          <p className="game-zone-label">Pièces</p>
          <div className="game-tray">
            {tray.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`game-chip${picked === chip.id ? ' is-picked' : ''}`}
                data-chip={chip.id}
                data-tone={chip.tone}
                onPointerDown={(event) => onPointerDown(event, chip.id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                <ChipFace chip={chip} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {ghost && ghostChip ? (
        <div className="game-ghost" data-tone={ghostChip.tone} style={{ left: ghost.x, top: ghost.y }}>
          <ChipFace chip={ghostChip} />
        </div>
      ) : null}
    </section>
  )
}

function CalcLine({ calc }: { calc: { a: string; op: string; b: string; result?: string; tail?: '≈' } }) {
  return (
    <p className="game-calc-text game-calc-line">
      <CalcSlot value={calc.a} />
      <span className="game-calc-op">{calc.op}</span>
      <CalcSlot value={calc.b} />
      {calc.result != null ? (
        <>
          <span className="game-calc-op">=</span>
          <CalcSlot value={calc.result} />
        </>
      ) : calc.tail ? (
        <span className="game-calc-op">{calc.tail}</span>
      ) : null}
    </p>
  )
}

function CalcSlot({ value }: { value: string }) {
  if (!value) return <span className="game-calc-slot is-blank" aria-hidden />
  return <span className="game-calc-slot">{value}</span>
}

function QuestionFace({ round }: { round: PlayRound }) {
  const scene = round.scene
  if (scene.type === 'calc' || scene.type === 'column') {
    const calc =
      scene.type === 'calc'
        ? scene
        : { a: scene.a, op: scene.op, b: scene.b }
    return <CalcLine calc={calc} />
  }
  if (scene.type === 'compare') {
    return <p className="game-calc-text is-long">{`${scene.left} ? ${scene.right}`}</p>
  }
  if (scene.type === 'fraction') {
    return (
      <div className="game-fraction">
        <FractionShape
          kind={scene.shape.kind}
          d={scene.shape.d}
          colored={new Set(Array.from({ length: scene.shape.n }, (_, index) => index))}
          fillVariant="light"
          scale={1.6}
        />
      </div>
    )
  }
  const text =
    scene.type === 'prompt'
      ? scene.text
      : scene.type === 'images'
        ? scene.prompt
        : scene.type === 'stem'
          ? `${scene.before} □ ${scene.after}`.replace(/\s+/g, ' ').trim()
          : scene.type === 'sequence'
            ? scene.cells.map((cell) => cell.text ?? '□').join('  ')
            : scene.type === 'order' || scene.type === 'lines'
              ? scene.prompt
              : scene.type === 'table'
                ? `Tableau ${scene.op}`
                : ''
  return (
    <>
      <Visual round={round} />
      {text ? <p className={`game-calc-text${text.length > 18 ? ' is-long' : ''}`}>{text}</p> : null}
    </>
  )
}

function Prompt({
  round,
  placed,
  chipById,
  slotMark,
  onPlace,
  colored,
  setColored,
}: {
  round: PlayRound
  placed: Record<string, string>
  chipById: Map<string, PlayChip>
  slotMark: (slot: PlaySlot) => 'ok' | 'bad' | undefined
  onPlace: (chipId: string, slotId: string) => void
  colored: number[]
  setColored: (next: number[]) => void
}) {
  const scene = round.scene
  return (
    <div className="game-prompt">
      <Visual round={round} />
      {scene.type === 'stem' ? (
        <p className="game-stem">
          <span>{scene.before}</span>
          <span className="game-stem-blank" />
          <span>{scene.after}</span>
        </p>
      ) : null}
      {scene.type === 'column' ? (
        <div className="game-column" aria-label="Opération">
          <span>{scene.a}</span>
          <span>
            {scene.op} {scene.b}
          </span>
        </div>
      ) : null}
      {scene.type === 'compare' ? (
        <p className="game-stem">
          <span>{scene.left}</span>
          <span className="game-stem-blank">?</span>
          <span>{scene.right}</span>
        </p>
      ) : null}
      {scene.type === 'prompt' ? <p className="game-stem">{scene.text}</p> : null}
      {scene.type === 'images' ? <p className="game-stem">{scene.prompt}</p> : null}
      {scene.type === 'order' ? (
        <div className="game-order">
          <p className="game-stem">{scene.prompt}</p>
          <div className="game-order-row">
            {scene.slotIds.map((slotId, index) => {
              const slot = round.slots?.find((item) => item.id === slotId)
              if (!slot) return null
              return (
                <span key={slotId} className="game-order-step">
                  {index > 0 && scene.sep ? <b>{scene.sep}</b> : null}
                  <SlotBox slot={slot} chip={chipById.get(placed[slotId] ?? '')} mark={slotMark(slot)} onPlace={onPlace} />
                </span>
              )
            })}
          </div>
        </div>
      ) : null}
      {scene.type === 'sequence' ? (
        <div className="game-sequence">
          {scene.cells.map((cell, index) =>
            cell.slotId ? (
              <SlotBox
                key={cell.slotId}
                slot={round.slots?.find((slot) => slot.id === cell.slotId) ?? { id: cell.slotId, expected: '' }}
                chip={chipById.get(placed[cell.slotId] ?? '')}
                mark={slotMark(round.slots?.find((slot) => slot.id === cell.slotId) ?? { id: cell.slotId, expected: '' })}
                onPlace={onPlace}
              />
            ) : (
              <span key={`fixed-${index}`} className="game-fixed">
                {cell.text}
              </span>
            ),
          )}
        </div>
      ) : null}
      {scene.type === 'lines' ? (
        <div className="game-lines">
          <p className="game-stem">{scene.prompt}</p>
          {scene.lines.map((line) => {
            const slot = round.slots?.find((item) => item.id === line.slotId)
            if (!slot) return null
            return (
              <div key={line.slotId} className="game-line">
                <span>{line.label}</span>
                <SlotBox slot={slot} chip={chipById.get(placed[line.slotId] ?? '')} mark={slotMark(slot)} onPlace={onPlace} />
              </div>
            )
          })}
        </div>
      ) : null}
      {scene.type === 'table' ? (
        <table className="game-table">
          <tbody>
            <tr>
              <th>{scene.op}</th>
              {scene.cols.map((col, index) => (
                <th key={`col-${index}`}>
                  {col.slotId ? (
                    <SlotBox
                      slot={round.slots?.find((slot) => slot.id === col.slotId) ?? { id: col.slotId, expected: '' }}
                      chip={chipById.get(placed[col.slotId] ?? '')}
                      mark={slotMark(round.slots?.find((slot) => slot.id === col.slotId) ?? { id: col.slotId, expected: '' })}
                      onPlace={onPlace}
                    />
                  ) : (
                    col.text
                  )}
                </th>
              ))}
            </tr>
            {scene.rows.map((row, r) => (
              <tr key={`row-${r}`}>
                <th>
                  {row.slotId ? (
                    <SlotBox
                      slot={round.slots?.find((slot) => slot.id === row.slotId) ?? { id: row.slotId, expected: '' }}
                      chip={chipById.get(placed[row.slotId] ?? '')}
                      mark={slotMark(round.slots?.find((slot) => slot.id === row.slotId) ?? { id: row.slotId, expected: '' })}
                      onPlace={onPlace}
                    />
                  ) : (
                    row.text
                  )}
                </th>
                {row.cells.map((cell, c) => (
                  <td key={`cell-${r}-${c}`}>
                    {cell.slotId ? (
                      <SlotBox
                        slot={round.slots?.find((slot) => slot.id === cell.slotId) ?? { id: cell.slotId, expected: '' }}
                        chip={chipById.get(placed[cell.slotId] ?? '')}
                        mark={slotMark(round.slots?.find((slot) => slot.id === cell.slotId) ?? { id: cell.slotId, expected: '' })}
                        onPlace={onPlace}
                      />
                    ) : (
                      cell.text
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {scene.type === 'fraction' && scene.kind === 'color' ? (
        <div className="game-fraction">
          <p className="game-stem">
            Coloriez {scene.shape.n}/{scene.shape.d}
          </p>
          <FractionShape
            kind={scene.shape.kind}
            d={scene.shape.d}
            colored={new Set(colored)}
            fillVariant="solid"
            scale={1.6}
            onToggle={(part) => {
              setColored(colored.includes(part) ? colored.filter((item) => item !== part) : [...colored, part])
            }}
          />
        </div>
      ) : null}
      {scene.type === 'fraction' && scene.kind === 'read' ? (
        <div className="game-fraction">
          <FractionShape
            kind={scene.shape.kind}
            d={scene.shape.d}
            colored={new Set(Array.from({ length: scene.shape.n }, (_, i) => i))}
            fillVariant="light"
            scale={1.6}
          />
        </div>
      ) : null}
    </div>
  )
}

function Visual({ round }: { round: PlayRound }) {
  const visual = round.visual
  if (!visual) return null
  return (
    <div className="game-visual">
      {visual.composite ? <CompositeFigure scene={visual.composite} /> : null}
      {visual.figure ? <GeometryFigure type={visual.figure} dims={visual.dims} /> : null}
      {visual.coord ? <CoordGrid scene={visual.coord} /> : null}
      {visual.image ? <img src={visual.image} alt="" /> : null}
    </div>
  )
}

function Answer({
  round,
  choice,
  setChoice,
  circled,
  toggleCircle,
  placed,
  chipById,
  slotMark,
  onPlace,
  status,
}: {
  round: PlayRound
  choice: string | null
  setChoice: (id: string) => void
  circled: string[]
  toggleCircle: (id: string) => void
  placed: Record<string, string>
  chipById: Map<string, PlayChip>
  slotMark: (slot: PlaySlot) => 'ok' | 'bad' | undefined
  onPlace: (chipId: string, slotId: string) => void
  status: 'idle' | 'ok' | 'retry'
}) {
  if (round.mode === 'look') {
    return <p className="game-look">Regardez ensemble, puis passez à la question suivante.</p>
  }
  if (round.mode === 'choice') {
    return (
      <div className="game-choices">
        {(round.choices ?? []).map((chip) => {
          const selected = choice === chip.id
          const mark = status !== 'idle' && selected ? (sameAnswer(chip.label, round.correctChoice ?? '') ? 'ok' : 'bad') : undefined
          return (
            <button
              key={chip.id}
              type="button"
              className={`game-chip game-choice${selected ? ' is-circled' : ''}${mark ? ` is-${mark}` : ''}`}
              data-tone={chip.tone}
              aria-pressed={selected}
              onClick={() => setChoice(chip.id)}
            >
              <ChipFace chip={chip} />
            </button>
          )
        })}
      </div>
    )
  }
  if (round.mode === 'circle') {
    return (
      <div className="game-choices">
        {(round.pictures ?? []).map((picture, index) => {
          const selected = circled.includes(picture.id)
          return (
            <button
              key={picture.id}
              type="button"
              className={`game-chip game-choice${selected ? ' is-circled' : ''}`}
              data-tone={cardTone(index, round.key)}
              aria-pressed={selected}
              onClick={() => toggleCircle(picture.id)}
            >
              <img src={picture.image} alt="" />
              <span>{picture.label}</span>
            </button>
          )
        })}
      </div>
    )
  }
  if (round.mode === 'color') {
    return <p className="game-look">Cliquez les parts de la forme, puis vérifiez.</p>
  }
  const embedded = round.scene.type === 'order' || round.scene.type === 'sequence' || round.scene.type === 'lines' || round.scene.type === 'table'
  if (embedded) {
    return <p className="game-look">Déplacez chaque pièce dans sa case, ou cliquez une pièce puis sa case.</p>
  }
  const slot = round.slots?.[0]
  if (!slot) return null
  return <SlotBox slot={slot} chip={chipById.get(placed[slot.id] ?? '')} mark={slotMark(slot)} onPlace={onPlace} />
}
