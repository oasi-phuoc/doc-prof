import type { MathItem } from '@/math/types'
import { tryGenerateFigure } from '@/math/figures-school'
import { createRng, shuffle } from '@/math/rng'
import { CSC_FIGURES } from '@/tcm-csc/items'
import type { Choice, Question } from './types'
import { decimalChoices } from './decimal-choices'
import { hash } from './seeds'

type Entry = { part: number; prompt: string; figure: NonNullable<Question['figure']>; choices: Choice[]; correctId: string; model: string }
type Result = { items: Entry[]; issues: string[] }
const reject = (reason: string): Result => ({items:[],issues:[reason]})
const names = Array.from({length:16},(_,index)=>tryGenerateFigure('figures-nommer',index)!).filter(item=>item.figure!=='triangle'||item.dims?.triangleKind==='scalene')
const properties = Array.from({length:13},(_,index)=>tryGenerateFigure('figures-proprietes',index)!).filter(item=>['square','rectangle','rhombus','parallelogram','circle','oval'].includes(item.figure!))
const namePool = [...new Set([...names.map(item=>item.answer),...CSC_FIGURES.map(entry=>entry.label)])]
const normalize = (value: string) => value.normalize('NFC').trim()
function figureKey(item: MathItem): string | null {
  const d=item.dims??{}
  if (!item.figure || Object.keys(d).some(key=>!['bare','triangleKind','trapezoidKind'].includes(key)) ||
    (d.bare!==undefined && typeof d.bare!=='boolean') || (d.triangleKind!==undefined && item.figure!=='triangle') || (d.trapezoidKind!==undefined && item.figure!=='trapezoid')) return null
  return JSON.stringify([item.figure,item.figure==='triangle'?(d.triangleKind??'scalene'):null,item.figure==='trapezoid'?(d.trapezoidKind??'isosceles'):null])
}
function publicFigure(item: MathItem): NonNullable<Question['figure']> {
  return {type:item.figure!,dims:{bare:true,...(item.dims?.triangleKind?{triangleKind:item.dims.triangleKind}:{}),...(item.dims?.trapezoidKind?{trapezoidKind:item.dims.trapezoidKind}:{})}}
}
function wordChoices(answer: string, pool: string[], seed: number) {
  const rng=createRng(seed),kept=shuffle(rng,[answer,...shuffle(rng,pool.filter(value=>value!==answer)).slice(0,5)])
  return {correctId:`word${hash(answer)}`,choices:kept.map(text=>({id:`word${hash(text)}`,text}))}
}
function naming(item: MathItem, part: number, answer: string, pool: string[], seed: number): Entry {
  return {part,prompt:'Choisis le nom le plus précis de cette figure.',figure:publicFigure(item),...wordChoices(answer,pool,seed),model:answer}
}

/** Closed, reviewed geometric relations only; no imported image-bank key is inferred. */
export function adaptRecognition(item: MathItem, exerciseType: string, seedFor: (part: number)=>number): Result | undefined {
  if (item.layout==='logique') return reject('Les corrigés importés de cette banque de logique doivent être vérifiés avant un score automatique.')
  if (item.cscTask?.kind==='shape-names' && exerciseType==='tcm-csc-ex17') {
    const figures=item.cscTask.figures
    if (item.layout!=='csc-task' || !Array.isArray(figures) || figures.length!==4 || new Set(figures).size!==4 || figures.some(figure=>!CSC_FIGURES.some(entry=>entry.value===figure))) return reject('Les quatre formes CSC doivent être distinctes et appartenir à la liste des formes proposées.')
    const labels=figures.map(figure=>CSC_FIGURES.find(entry=>entry.value===figure)!.label)
    if (normalize(item.answer)!==labels.join(' ; ')) return reject('Les formes CSC et leur corrigé ne correspondent plus. Validez la fiche avant de jouer.')
    return {items:figures.map((figure,part)=>naming({layout:'geo',figure,answer:labels[part]!},part,labels[part]!,labels,seedFor(part))),issues:[]}
  }
  if (!['figures-nommer','figures-proprietes'].includes(exerciseType)) return undefined
  if (item.layout!=='geo' || item.prompt?.trim() || item.geoDualPads || item.compositeScene || item.geoNameCard || item.calcAnswer || item.responseAnswer) return reject('Cette figure ne correspond pas à une reconnaissance simple sans mesures ni autre calcul.')
  const key=figureKey(item)
  if (!key) return reject('Les données de la figure ne correspondent pas à un dessin simple vérifiable.')
  if (exerciseType==='figures-nommer') {
    const reference=names.find(candidate=>figureKey(candidate)===key)
    if (!reference) return reject('Cette variante de triangle demande encore une validation de son dessin avant un score automatique.')
    if (item.propertyLines || normalize(item.answer)!==reference.answer) return reject('La figure et son nom ne correspondent plus. Validez la fiche avant de jouer.')
    return {items:[naming(item,0,reference.answer,namePool,seedFor(0))],issues:[]}
  }
  const reference=properties.find(candidate=>figureKey(candidate)===key)
  if (!reference) return reject('Les propriétés de cette variante de triangle ou de trapèze demandent encore une validation de son dessin.')
  if (JSON.stringify(item.propertyLines)!==JSON.stringify(reference.propertyLines) || normalize(item.answer)!==reference.answer) return reject('La figure, ses propriétés et son corrigé ne correspondent plus. Validez la fiche avant de jouer.')
  const figure=publicFigure(item)
  const items=reference.propertyLines!.map(({label,answer},part): Entry=>{
    if (label==='Nom') return naming(item,part,answer,namePool,seedFor(part))
    const common={part,figure,model:`${label} : ${answer}`}
    if (answer==='une infinité') return {...common,prompt:'Combien d’axes de symétrie possède cette figure ?',choices:['0','1','2','3','4','une infinité'].map((text,index)=>({id:`axis${index}`,text})),correctId:'axis5'}
    if (/^\d+$/.test(answer)) {
      const prompt=label==='Côtés égaux'?'Combien de côtés de même longueur possède cette figure ?':label==='Angles droits'?'Combien d’angles droits possède cette figure ?':label==='Axes de symétrie'?'Combien d’axes de symétrie possède cette figure ?':'Combien de côtés possède cette figure ?'
      return {...common,prompt,...decimalChoices(BigInt(answer),0,1n,answer,seedFor(part))}
    }
    const pool=answer==='côtés opposés'?['côtés opposés','tous les côtés','aucun côté égal']:['égaux','différents','toujours droits']
    return {...common,prompt:label==='Côtés égaux'?'Quels côtés ont la même longueur ?':'Comment sont les angles opposés de cette figure ?',...wordChoices(answer,pool,seedFor(part))}
  })
  return {items,issues:[]}
}
