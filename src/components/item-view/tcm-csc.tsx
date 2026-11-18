import type { ReactNode } from 'react'
import type { MathItem, PreviewMode } from '@/math/types'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import { CSC_CONNECT_COLORS, CSC_FIGURES, cscConnectFrame } from '@/tcm-csc/items'
import { CSC_PROBLEM_BANK } from '@/tcm-csc/problem-bank'
import './tcm-csc.css'

export function CscTaskBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const task = item.cscTask, show = mode === 'answers'
  if (!task) return null
  if (task.kind === 'number-grid') return <table className="csc-number-grid" aria-label="Nombres à entourer"><tbody>{Array.from({ length: Math.ceil(task.numbers.length / 10) }, (_, row) => <tr key={row}>{task.numbers.slice(row * 10, row * 10 + 10).map((n) => <td key={n} className={show && task.heard.includes(n) ? 'csc-heard' : undefined}>{n}</td>)}</tr>)}</tbody></table>
  if (task.kind === 'operator') {
    const result = task.operation === '+' ? task.a + task.b : task.a - task.b
    const blank = <span className={`answer-line-field compact${show ? ' filled' : ''}`}>{show ? item.answer : '\u00a0'}</span>
    return <div className="csc-operator"><span>{task.a}</span>{task.blank === 'operator' ? blank : <span>{task.operation}</span>}<span>{task.b}</span>{task.blank === 'equals' ? blank : <span>=</span>}<span>{result}</span></div>
  }
  if (task.kind === 'shape-names') return <ol className="csc-shape-names">{task.figures.map((figure, i) => <li className="csc-shape-row" key={i}><span className="csc-shape-num">{i + 1}.</span><div className="csc-name-figure"><GeometryFigure type={figure} dims={{bare:true}} /></div><div className="csc-shape-answer"><span className={`answer-line-field${show ? ' filled' : ''}`}>{show ? CSC_FIGURES.find((entry) => entry.value === figure)?.label : '\u00a0'}</span></div></li>)}</ol>
  if (task.kind === 'connect-points') {
    const pairs = Math.floor(task.points.length / 2)
    const frame = task.frame ?? cscConnectFrame(pairs)
    return <div className="csc-connect">
      <ol>
        {Array.from({ length: pairs }, (_, index) => {
          const from = task.points[index * 2]?.label ?? String.fromCharCode(65 + index * 2)
          const to = task.points[index * 2 + 1]?.label ?? String.fromCharCode(66 + index * 2)
          return <li key={from}>{from} à {to} en {CSC_CONNECT_COLORS[index]?.name ?? 'noir'}</li>
        })}
      </ol>
      <svg viewBox={`0 0 ${frame.width} ${frame.height}`} role="img" aria-label="Points à relier avec la règle">
        {show && Array.from({ length: pairs }, (_, index) => {
          const a = task.points[index * 2], b = task.points[index * 2 + 1], color = CSC_CONNECT_COLORS[index]?.ink
          return a && b && color ? <line key={a.label} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth=".8" /> : null
        })}
        {task.points.map((point) => <g key={point.label}><circle cx={point.x} cy={point.y} r=".8" fill="#182238" /><text x={point.x + 2} y={point.y - 2} fontSize="5">{point.label}</text></g>)}
      </svg>
    </div>
  }
  return null
}

export function CscLengthBlock({item,mode,children}:{item:MathItem;mode:PreviewMode;children:ReactNode}) {
  const segments=item.segments??[],answers=item.answer.split(';').map(value=>value.trim())
  return <div className="csc-length-parts">
    <section><p className="csc-part-instruction"><strong>Mesurez</strong> les segments avec la règle.</p>{children}</section>
    <section><p className="csc-part-instruction"><strong>Cochez</strong> la bonne réponse.</p>
      <table className="csc-length-table" aria-label="Comparaison des segments"><thead><tr><th scope="col">Question</th>{segments.map((_,index)=><th scope="col" key={index}>{String.fromCharCode(65+index)}</th>)}</tr></thead>
        <tbody>{['Quel est le plus long segment ?','Quel est le plus court segment ?'].map((question,row)=><tr key={question}><th scope="row"><span className="csc-numbered-label"><span>{row+1}.</span><span>{question}</span></span></th>{segments.map((_,index)=><td key={index}><span className={`csc-length-check${mode==='answers'&&answers[row]===String.fromCharCode(65+index)?' is-checked':''}`} /></td>)}</tr>)}</tbody>
      </table>
    </section>
  </div>
}

export function CscProblemBlock({ item, mode, draftGrid = false }: { item: MathItem; mode: PreviewMode; draftGrid?: boolean }) {
  const parts = (item.prompt ?? '').split('\n\n'), question = parts.pop(), task = item.cscTask
  const operation = task?.kind === 'problem' ? CSC_PROBLEM_BANK.find((entry) => entry.id === task.templateId)?.operation : undefined
  return <div className="csc-problem-text"><p>{parts.join('\n\n')}</p><p><b>{question}</b></p><div className={`draft-pad draft-pad-short ${draftGrid ? 'with-grid' : 'plain'}`} aria-label="Zone de développement">{mode === 'answers' && task?.kind === 'problem' && operation && <strong className="filled-answer draft-pad-answer">{task.a} {operation} {task.b} = {operation === '+' ? task.a + task.b : task.a - task.b}</strong>}</div><p className="csc-problem-answer"><span className="csc-problem-answer-label">Réponse :</span><span className={`answer-line-field${mode === 'answers' ? ' filled' : ''}`}>{mode === 'answers' ? item.answer : '\u00a0'}</span></p></div>
}

export function CscCopyBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const template = item.symmetryFigure, task = item.cscTask
  if (!template || task?.kind !== 'copy') return null
  const cellMm=4*1.15
  const columns = template.side === 'left' ? template.axisX : template.cols - template.axisX
  const offset = template.side === 'left' ? 0 : template.axisX
  return <div className="csc-copy">{[{scale:1,model:true},{scale:task.scale,model:false}].map(({scale,model}, index) => {
    const cols = columns * scale, rows = template.rows * scale, reveal = model || mode === 'answers'
    const point = (p: { x: number; y: number }) => ({ x: 1 + (p.x - offset) * scale, y: 1 + rows - p.y * scale })
    return <div key={index}><p>{model ? 'Modèle' : task.scale === 2 ? 'Reproduction agrandie' : 'Reproduction'}</p><svg data-copy-scale={scale} data-copy-cols={cols} data-copy-rows={rows} viewBox={`0 0 ${cols + 2} ${rows + 2}`} style={{ width: `${(cols+2)*cellMm}mm`, height: `${(rows+2)*cellMm}mm` }} role="img" aria-label={model ? 'Quadrillage du modèle' : 'Quadrillage de reproduction'}>
      {Array.from({ length: cols + 1 }, (_, x) => <line key={`x${x}`} x1={x + 1} x2={x + 1} y1="1" y2={rows + 1} className="csc-copy-grid" />)}
      {Array.from({ length: rows + 1 }, (_, y) => <line key={`y${y}`} y1={y + 1} y2={y + 1} x1="1" x2={cols + 1} className="csc-copy-grid" />)}
      {reveal && template.polylines.map((poly, i) => <path key={i} data-copy-figure d={poly.map((p, j) => { const s = point(p); return `${j ? 'L' : 'M'}${s.x},${s.y}` }).join(' ')} fill="none" stroke="var(--purple)" strokeWidth=".1" />)}
      {reveal && template.dots?.map((p, i) => { const s = point(p); return <circle key={i} cx={s.x} cy={s.y} r=".15" fill="var(--purple)" /> })}
    </svg></div>
  })}</div>
}
