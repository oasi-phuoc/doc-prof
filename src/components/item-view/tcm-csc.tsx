import type { MathItem, PreviewMode } from '@/math/types'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import { CSC_FIGURES } from '@/tcm-csc/items'
import { CSC_PROBLEM_BANK } from '@/tcm-csc/problem-bank'
import './tcm-csc.css'

export function CscTaskBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const task = item.cscTask, show = mode === 'answers'
  if (!task) return null
  if (task.kind === 'number-grid') return <table className="csc-number-grid" aria-label="Nombres à entourer"><tbody>{Array.from({ length: Math.ceil(task.numbers.length / 6) }, (_, row) => <tr key={row}>{task.numbers.slice(row * 6, row * 6 + 6).map((n) => <td key={n}><span className={show && task.heard.includes(n) ? 'csc-heard' : undefined}>{n}</span></td>)}</tr>)}</tbody></table>
  if (task.kind === 'operator') {
    const result = task.operation === '+' ? task.a + task.b : task.a - task.b
    const blank = <span className={`answer-line-field compact${show ? ' filled' : ''}`}>{show ? item.answer : '\u00a0'}</span>
    return <div className="csc-operator"><span>{task.a}</span>{task.blank === 'operator' ? blank : <span>{task.operation}</span>}<span>{task.b}</span>{task.blank === 'equals' ? blank : <span>=</span>}<span>{result}</span></div>
  }
  if (task.kind === 'shape-names') return <div className="csc-shape-names">{task.figures.map((figure, i) => <div key={i}><b>{String.fromCharCode(65 + i)}.</b><div className="csc-name-figure"><GeometryFigure type={figure} dims={{bare:true}} /></div><span className={`answer-line-field${show ? ' filled' : ''}`}>{show ? CSC_FIGURES.find((entry) => entry.value === figure)?.label : '\u00a0'}</span></div>)}</div>
  if (task.kind === 'connect-points') return <div className="csc-connect"><ol><li>AB en rouge.</li><li>CD en bleu.</li></ol><svg viewBox="0 0 160 80" role="img" aria-label="Quatre points A, B, C et D à relier avec la règle">
    {show && [[0, 1, '#c02030'], [2, 3, '#174eae']].map(([from, to, color]) => { const a = task.points[Number(from)], b = task.points[Number(to)]; return a && b ? <line key={String(from)} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={String(color)} strokeWidth=".8" /> : null })}
    {task.points.map((point) => <g key={point.label}><circle cx={point.x} cy={point.y} r=".8" fill="#182238" /><text x={point.x + 2} y={point.y - 2} fontSize="5">{point.label}</text></g>)}
  </svg></div>
  return null
}

export function CscProblemBlock({ item, mode, draftGrid = false }: { item: MathItem; mode: PreviewMode; draftGrid?: boolean }) {
  const parts = (item.prompt ?? '').split('\n\n'), question = parts.pop(), task = item.cscTask
  const operation = task?.kind === 'problem' ? CSC_PROBLEM_BANK.find((entry) => entry.id === task.templateId)?.operation : undefined
  return <div className="csc-problem-text"><p>{parts.join('\n\n')}</p><p><b>{question}</b></p><div className={`draft-pad draft-pad-short ${draftGrid ? 'with-grid' : 'plain'}`} aria-label="Zone de développement">{mode === 'answers' && task?.kind === 'problem' && operation && <strong className="filled-answer draft-pad-answer">{task.a} {operation} {task.b} = {operation === '+' ? task.a + task.b : task.a - task.b}</strong>}</div><span className={`answer-line-field${mode === 'answers' ? ' filled' : ''}`}>{mode === 'answers' ? item.answer : '\u00a0'}</span></div>
}

export function CscCopyBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const template = item.symmetryFigure, task = item.cscTask
  if (!template || task?.kind !== 'copy') return null
  const columns = template.side === 'left' ? template.axisX : template.cols - template.axisX
  const offset = template.side === 'left' ? 0 : template.axisX
  return <div className="csc-copy">{[1, task.scale].map((scale, index) => {
    const cols = columns * scale, rows = template.rows * scale, reveal = index === 0 || mode === 'answers'
    const point = (p: { x: number; y: number }) => ({ x: 1 + (p.x - offset) * scale, y: 1 + rows - p.y * scale })
    return <div key={index}><p>{index === 0 ? 'Modèle' : task.scale === 2 ? 'Reproduction agrandie' : 'Reproduction'}</p><svg data-copy-scale={scale} data-copy-cols={cols} data-copy-rows={rows} viewBox={`0 0 ${cols + 2} ${rows + 2}`} style={{ width: `${cols * 4 + 8}mm`, height: `${rows * 4 + 8}mm` }} role="img" aria-label={index === 0 ? 'Quadrillage du modèle' : 'Quadrillage de reproduction'}>
      {Array.from({ length: cols + 1 }, (_, x) => <line key={`x${x}`} x1={x + 1} x2={x + 1} y1="1" y2={rows + 1} className="csc-copy-grid" />)}
      {Array.from({ length: rows + 1 }, (_, y) => <line key={`y${y}`} y1={y + 1} y2={y + 1} x1="1" x2={cols + 1} className="csc-copy-grid" />)}
      {reveal && template.polylines.map((poly, i) => <path key={i} data-copy-figure d={poly.map((p, j) => { const s = point(p); return `${j ? 'L' : 'M'}${s.x},${s.y}` }).join(' ')} fill="none" stroke={index === 0 ? '#182238' : '#174eae'} strokeWidth=".1" />)}
      {reveal && template.dots?.map((p, i) => { const s = point(p); return <circle key={i} cx={s.x} cy={s.y} r=".15" fill="#182238" /> })}
    </svg></div>
  })}</div>
}
