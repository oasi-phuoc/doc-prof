import { useState } from 'react'
import type { MathItem, Figure } from '@/math/types'
import { createRng, randomSeed } from '@/math/rng'
import { CSC_PROBLEM_BANK, buildCscProblem, rollCscProblem } from '@/tcm-csc/problems'
import { CSC_FIGURES, CSC_SIGN_NAMES } from '@/tcm-csc/items'
import { logiqueBankOptions, logiqueItemById } from '@/logique/generate'
import { buildSymmetryFigure, SYMMETRY_TEMPLATES, SYMMETRY_FIGURE_LABELS } from '@/tcm-cfr/symetrie'
import { recalculateCsc } from '@/tcm-csc/recalculate'

function NumberField({ label, value, min = 0, max = 100, change }: { label: string; value: number; min?: number; max?: number; change: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  const commit = () => { const n = Number(draft); if (!draft.trim() || !Number.isInteger(n) || n < min || n > max) setDraft(String(value)); else change(n) }
  return <label>{label}<input aria-label={label} type="number" min={min} max={max} step="1" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit() } }} /></label>
}
function NumberList({ label, values, change }: { label: string; values: number[]; change: (values: number[]) => void }) {
  const [draft, setDraft] = useState(values.join(' '))
  return <label>{label}<textarea aria-label={label} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => change(draft.trim().split(/[\s,;]+/).filter(Boolean).map(Number))} /></label>
}
export function TcmCscFields({ item, typeId, change: onChange }: { item: MathItem; typeId: string; change: (item: MathItem) => void }) {
  const change = (next: MathItem) => onChange(recalculateCsc(next, typeId) ?? next)
  const task = item.cscTask
  const number = (label: string, value: number, commit: (n: number) => void, min = 0, max = 100) => <NumberField key={`${label}:${value}`} label={label} value={value} change={commit} min={min} max={max} />
  let fields
  if (task?.kind === 'problem') {
    const select = (id: string) => { const template = CSC_PROBLEM_BANK.find((entry) => entry.id === id)!; const p = template.defaults ? buildCscProblem(id, ...template.defaults) : rollCscProblem(id, createRng(randomSeed())); change({ ...item, cscTask: { kind: 'problem', templateId: id, a: p.a, b: p.b } }) }
    fields = <><label>Choisir le problème<select aria-label="Choisir le problème" value={task.templateId} onChange={(e) => select(e.target.value)}>{[['+', 'Additions'], ['−', 'Soustractions']].map(([op, label]) => <optgroup key={op} label={label}>{CSC_PROBLEM_BANK.filter((entry) => entry.operation === op).map((entry) => <option key={entry.id} value={entry.id}>{entry.story.replaceAll('{a}', '…').replaceAll('{b}', '…')}</option>)}</optgroup>)}</select></label>
      <div className="csc-free-columns">{number('Premier nombre', task.a, (a) => change({ ...item, cscTask: { ...task, a } }), 1, 999)}{number('Deuxième nombre', task.b, (b) => change({ ...item, cscTask: { ...task, b } }), 1, 999)}</div>
      <button type="button" onClick={() => { const p = rollCscProblem(task.templateId, createRng(randomSeed())); change({ ...item, cscTask: { ...task, a: p.a, b: p.b } }) }}>Changer les nombres</button><p className="csc-problem-text">{item.prompt}</p></>
  } else if (item.logique) {
    const choices = logiqueBankOptions('logique-suite-graphique')
    fields = <><label>Choisir la suite graphique<select aria-label="Choisir la suite graphique" value={item.logique.id ?? choices.find((choice) => choice.stem[0] === item.logique?.stem[0])?.id ?? ''} onChange={(e) => change(logiqueItemById('logique-suite-graphique', e.target.value, createRng(randomSeed())))}>{choices.map((choice, i) => <option key={choice.id} value={choice.id}>Suite graphique {i + 1}</option>)}</select></label>{item.logique.stem.map((src, i) => <img key={i} src={src} alt={`Suite graphique, image ${i + 1}`} />)}</>
  } else if (task?.kind === 'calculation-audio' || task?.kind === 'operator') {
    fields = <><div className="csc-free-columns">{number('Premier nombre', task.a, (a) => change({ ...item, cscTask: { ...task, a } }), task.kind === 'operator' ? 0 : 1)}{number('Deuxième nombre', task.b, (b) => change({ ...item, cscTask: { ...task, b } }), task.kind === 'operator' ? 0 : 1)}</div><label>Opération<select aria-label="Opération" value={task.operation} onChange={(e) => change({ ...item, cscTask: { ...task, operation: e.target.value as '+' | '−' } })}><option value="+">Addition</option><option value="−">Soustraction</option></select></label>{task.kind === 'operator' && <label>Signe à compléter<select aria-label="Signe à compléter" value={task.blank} onChange={(e) => change({ ...item, cscTask: { ...task, blank: e.target.value as 'operator' | 'equals' } })}><option value="operator">+ ou −</option><option value="equals">=</option></select></label>}</>
  } else if (task?.kind === 'sign-name') {
    fields = <label>Signe à nommer<select aria-label="Signe à nommer" value={task.symbol} onChange={e=>change({...item,cscTask:{...task,symbol:e.target.value as keyof typeof CSC_SIGN_NAMES}})}>{Object.keys(CSC_SIGN_NAMES).map(symbol=><option key={symbol} value={symbol}>{symbol}</option>)}</select></label>
  } else if (item.layout === 'place-value' && typeId === 'tcm-csc-ex08') {
    fields = number('Nombre à décomposer', Number((item.prompt ?? '').replace(/['’\s]/g,'')), value=>change({...item,prompt:String(value)}),11,9999)
  } else if (task?.kind === 'number-grid') {
    fields = <><NumberList key={`grid:${task.numbers.join()}`} label="Les 36 nombres de la grille (0–100)" values={task.numbers} change={(numbers) => change({ ...item, cscTask: { ...task, numbers } })} /><NumberList key={`heard:${task.heard.join()}`} label="Les cinq nombres à entendre" values={task.heard} change={(heard) => change({ ...item, cscTask: { ...task, heard } })} /></>
  } else if (task?.kind === 'shape-names') {
    fields = task.figures.map((figure, i) => <label key={i}>Forme {String.fromCharCode(65 + i)}<select aria-label={`Forme ${String.fromCharCode(65 + i)}`} value={figure} onChange={(e) => change({ ...item, cscTask: { ...task, figures: task.figures.map((f, j) => j === i ? e.target.value as Figure : f) } })}>{CSC_FIGURES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></label>)
  } else if (task?.kind === 'copy') {
    fields = <><label>Figure à reproduire<select aria-label="Figure à reproduire" value={item.symmetryFigure?.id} onChange={(e) => change({ ...item, symmetryFigure: buildSymmetryFigure(e.target.value, 'left', 0) })}>{SYMMETRY_TEMPLATES.map((entry) => <option key={entry.id} value={entry.id}>{SYMMETRY_FIGURE_LABELS[entry.id] ?? entry.id}</option>)}</select></label><p>{task.scale === 2 ? 'Agrandissement : deux fois plus de lignes et de colonnes, même sens.' : 'Reproduction à l’identique, même sens.'}</p></>
  } else if (task?.kind === 'connect-points') {
    fields = task.points.map((p, i) => <div key={p.label} className="csc-free-columns">{number(`Point ${p.label} — horizontal`, p.x, (x) => change({ ...item, cscTask: { ...task, points: task.points.map((point, j) => j === i ? { ...point, x } : point) } }), 8, 152)}{number(`Point ${p.label} — vertical`, p.y, (y) => change({ ...item, cscTask: { ...task, points: task.points.map((point, j) => j === i ? { ...point, y } : point) } }), 8, 72)}</div>)
  } else if (item.layout === 'sequence') {
    const start = Number(item.sequence?.[0]), step = Number(item.sequence?.[1]) - start
    const update = (a: number, delta: number) => change({ ...item, sequence: Array.from({ length: 5 }, (_, i) => String(a + i * delta)) })
    fields = <div className="csc-free-columns">{number('Premier nombre de la suite', start, (n) => update(n, step))}{number('Pas de la suite', step, (n) => update(start, n), -25, 25)}</div>
  }
  return <div className="csc-free-fields" data-csc-exercise={typeId}>{fields}{item.libreError && <p role="alert">{item.libreError}</p>}<label>Corrigé<output>{item.answer || 'À vérifier'}</output></label></div>
}
