import type {Question} from './types'

export const ANNOTATION_COLORS = {red:'#bd1730',blue:'#145cba',green:'#147a48',yellow:'#ffd548'} as const
export const ANNOTATION_TOOLS = ['pen','highlighter','rectangle','ellipse'] as const
export const MAX_IMAGE_STROKES = 48
export const MAX_STROKE_POINTS = 160
export type AnnotationPoint = [number,number]
export type ImageStroke = {tool:typeof ANNOTATION_TOOLS[number];color:keyof typeof ANNOTATION_COLORS;points:AnnotationPoint[]}
export type ImageAnnotations = Record<string,ImageStroke[]>
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)
export const annotationQuestion=(q:Question)=>q.images.length>=1&&q.images.length<=4&&(q.mode==='oral'||q.mode==='sequence'&&!q.words)
export const annotationImage=(q:Question,index:unknown):index is number=>annotationQuestion(q)&&Number.isInteger(index)&&Number(index)>=0&&Number(index)<q.images.length

/** Only bounded vector geometry is stored: no image bytes, text, media URL or key. */
export function validImageStroke(value:unknown):value is ImageStroke {
  if(!object(value)||Object.keys(value).length!==3||!Object.keys(value).every(key=>['tool','color','points'].includes(key))||typeof value.tool!=='string'||!ANNOTATION_TOOLS.includes(value.tool as ImageStroke['tool'])||typeof value.color!=='string'||!Object.hasOwn(ANNOTATION_COLORS,value.color)||!Array.isArray(value.points)||value.points.length<1||value.points.length>MAX_STROKE_POINTS)return false
  if(!Array.from(value.points).every(point=>Array.isArray(point)&&point.length===2&&Array.from(point).every(n=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=1000)))return false
  if(value.tool==='rectangle'||value.tool==='ellipse')return value.points.length===2&&value.points[0][0]!==value.points[1][0]&&value.points[0][1]!==value.points[1][1]
  return true
}
export const copyImageStroke=(stroke:ImageStroke):ImageStroke=>({...stroke,points:stroke.points.map(([x,y])=>[x,y])})
export const copyImageAnnotations=(value:ImageAnnotations):ImageAnnotations=>Object.fromEntries(Object.entries(value).map(([index,strokes])=>[index,strokes.map(copyImageStroke)]))
export function validImageAnnotations(q:Question,value:unknown):value is ImageAnnotations {
  return annotationQuestion(q)&&object(value)&&Object.keys(value).length<=q.images.length&&Object.entries(value).every(([index,strokes])=>/^[0-3]$/.test(index)&&annotationImage(q,Number(index))&&Array.isArray(strokes)&&strokes.length<=MAX_IMAGE_STROKES&&Array.from(strokes).every(validImageStroke))
}
/** Keep both ends, while bounding long freehand gestures before journal writes. */
export function extendImageStroke(stroke:ImageStroke,point:AnnotationPoint):ImageStroke {
  const last=stroke.points.at(-1)!
  if(last[0]===point[0]&&last[1]===point[1])return stroke
  if(stroke.tool==='rectangle'||stroke.tool==='ellipse')return{...stroke,points:[stroke.points[0]!,point]}
  let points=[...stroke.points,point]
  if(points.length>MAX_STROKE_POINTS)points=points.filter((_,i)=>i===0||i===points.length-1||i%2===0)
  return{...stroke,points}
}
