import type { FigureDims, MathItem } from '@/math/types'
import { fmt } from '@/math/column-arith'
import { exactDecimal, formatDecimal, scaledDecimal, type Decimal } from './exact-math'

type Verified = {
  figure: { type: 'square' | 'rectangle'; dims: FigureDims }
  prompt: string
  context?: string
  value: Decimal
  correctText: string
  model: string
} | { reason: string }
const UNITS = new Set(['mm','cm','dm','m','dam','hm','km'])
const text = (value: string) => value.trim().toLowerCase().replaceAll('’', "'").replace(/\s+/g, ' ')
const same = (a: Decimal, b: Decimal) => scaledDecimal(a, Math.max(a.precision,b.precision)) === scaledDecimal(b, Math.max(a.precision,b.precision))
const show = (n: Decimal) => formatDecimal(n.units,n.precision)
function reduced(units: bigint, precision: number): Decimal | null {
  while (precision > 0 && units % 10n === 0n) { units /= 10n; precision-- }
  return precision <= 6 ? exactDecimal(formatDecimal(units,precision)) : null
}
function sum(a: Decimal, b: Decimal, subtract = false): Decimal | null {
  const p = Math.max(a.precision,b.precision)
  return reduced(scaledDecimal(a,p) + (subtract ? -1n : 1n) * scaledDecimal(b,p),p)
}
const product = (a: Decimal, b: Decimal) => reduced(a.units*b.units,a.precision+b.precision)
function quotient(a: Decimal, b: Decimal): Decimal | null {
  if (!b.units) return null
  const numerator = a.units * 10n ** BigInt(b.precision), denominator = b.units * 10n ** BigInt(a.precision)
  for (let p=0;p<=6;p++) if (numerator*10n**BigInt(p)%denominator === 0n) return reduced(numerator*10n**BigInt(p)/denominator,p)
  return null
}
function squareRoot(a: Decimal): Decimal | null {
  const n = a.units * 10n**BigInt(12-a.precision)
  if (n <= 0n) return null
  let root=n, next=(root+1n)/2n
  while (next<root) { root=next; next=(root+n/root)/2n }
  return root*root===n ? reduced(root,6) : null
}
function dimension(n: unknown): Decimal | null {
  if (typeof n !== 'number' || !Number.isFinite(n) || n<=0 || n>1e9) return null
  const value = exactDecimal(String(n)), rendered = exactDecimal(fmt(n))
  return value && rendered && same(value,rendered) ? value : null
}
function quantity(source: string, unit: string, power: number): Decimal | null {
  if (typeof source!=='string' || source.length>100) return null
  const match = /^(.+?)\s*(mm|cm|dm|dam|hm|km|m)(²|2)?$/u.exec(source.trim())
  if (!match) return exactDecimal(source)
  if (match[2] !== unit || (match[3] ? 2 : 1) !== power) return null
  return exactDecimal(match[1]!)
}
const TWO: Decimal = {units:2n,precision:0}, FOUR: Decimal = {units:4n,precision:0}

/** Exact square/rectangle measurements. A missing side is never copied into
 * the public figure, and rounded source results are not silently accepted. */
export function verifiedGeometry(item: MathItem): Verified | undefined {
  if (item.layout !== 'geo' || !['square','rectangle'].includes(item.figure ?? '') || item.geoDualPads || item.propertyLines || item.geoNameCard || item.compositeScene || item.calcAnswerSecondary) return undefined
  if (typeof item.prompt!=='string' || item.prompt.length>512) return {reason:'Géométrie : la consigne doit être un texte de longueur raisonnable.'}
  const prompt = text(item.prompt)
  if (!prompt.includes('calculez')) return undefined
  const invalid = (detail: string): Verified => ({reason:`Géométrie : ${detail}`})
  const d=item.dims
  if (!d || d.bare || !UNITS.has(d.unit ?? 'cm')) return invalid('la figure doit montrer des mesures dans une unité de longueur reconnue.')
  const allowed = item.figure==='square' ? ['side','unit','ask','bare'] : ['length','width','unit','ask','bare']
  if (Object.keys(d).some(key=>!allowed.includes(key)) || (d.bare!==undefined && d.bare!==false)) return invalid('les cotes de la figure ne correspondent pas à cette activité.')
  if (d.ask!==undefined && d.ask!==(item.figure==='square'?'side':'width')) return invalid('la cote à trouver ne correspond pas à cette figure.')
  if (d.ask && d[d.ask] !== undefined) return invalid('la cote à compléter est déjà renseignée dans la source.')
  const unit=d.unit ?? 'cm', square=item.figure==='square'
  const figure: {type:'square'|'rectangle';dims:FigureDims} = {type:square?'square':'rectangle',dims:{unit}}
  let value: Decimal | null=null, formula='', question=item.prompt!.trim(), power=1, context: string | undefined
  const side=dimension(d.side), length=dimension(d.length), width=dimension(d.width)
  if (!d.ask) {
    if (prompt!=="calculez l'aire." && prompt!=='calculez le périmètre.') return invalid('la consigne de calcul n’est pas reconnue.')
    const area=prompt.includes('aire')
    if (square ? !side : !length || !width) return invalid('une cote est absente, non positive ou trop précise pour être affichée exactement.')
    const a=square?side!:length!, b=square?side!:width!
    if (square) { figure.dims.side=d.side; context=`Côté : ${show(a)} ${unit}.` }
    else { figure.dims.length=d.length; figure.dims.width=d.width; context=`Longueur : ${show(a)} ${unit}. Largeur : ${show(b)} ${unit}.` }
    if (area) { value=product(a,b); formula=`${show(a)} × ${show(b)}`; power=2 }
    else { const total=sum(a,b); value=total && product(TWO,total); formula=square?`4 × ${show(a)}`:`2 × (${show(a)} + ${show(b)})` }
    question=area?`Quelle est l’aire de ce ${square?'carré':'rectangle'} ?`:`Quel est le périmètre de ce ${square?'carré':'rectangle'} ?`
  } else {
    if (d.ask!==(square?'side':'width') || (square ? d.side!==undefined : d.width!==undefined || !length)) return invalid('une seule cote manquante doit être identifiable dans la figure.')
    const match = square
      ? /^(?:le périmètre mesure (.+?) (mm|cm|dm|dam|hm|km|m)\. calculez le côté\.|l'aire mesure (.+?) (mm|cm|dm|dam|hm|km|m)(?:²|2)\. calculez le côté\.)$/u.exec(prompt)
      : /^(?:le périmètre mesure (.+?) (mm|cm|dm|dam|hm|km|m)\. la longueur mesure (.+?) (mm|cm|dm|dam|hm|km|m)\. calculez la largeur\.|l'aire mesure (.+?) (mm|cm|dm|dam|hm|km|m)(?:²|2)\. la longueur mesure (.+?) (mm|cm|dm|dam|hm|km|m)\. calculez la largeur\.)$/u.exec(prompt)
    if (!match) return invalid('les mesures données et la cote à calculer doivent figurer dans une consigne reconnue.')
    const area=prompt.startsWith("l'aire"), offset=square?(area?3:1):(area?5:1)
    const given=exactDecimal(match[offset]!), givenUnit=match[offset+1]
    if (!given || given.units<=0n || givenUnit!==unit) return invalid('la mesure donnée est absente ou son unité diffère de celle de la figure.')
    figure.dims.ask=d.ask
    if (square) {
      value=area?squareRoot(given):quotient(given,FOUR)
      formula=area?`√${show(given)}`:`${show(given)} ÷ 4`
    } else {
      const shownLength=exactDecimal(match[offset+2]!)
      if (!shownLength || match[offset+3]!==unit || !same(shownLength,length!)) return invalid('la longueur donnée dans le texte ne correspond pas à la figure.')
      figure.dims.length=d.length
      const half=area?null:quotient(given,TWO)
      value=area?quotient(given,length!):half && sum(half,length!,true)
      formula=area?`${show(given)} ÷ ${show(length!)}`:`${show(given)} ÷ 2 − ${show(length!)}`
    }
  }
  if (!value || value.units<=0n) return invalid('le résultat doit être positif et exact, sans arrondi, avec six décimales au maximum.')
  const answer=quantity(item.answer,unit,power), response=item.responseAnswer===undefined?undefined:quantity(item.responseAnswer,unit,power)
  if (!answer || !same(answer,value) || (item.responseAnswer!==undefined && (!response || !same(response,value)))) return invalid('les cotes, l’unité et le corrigé de la fiche ne correspondent plus.')
  const correctText=`${show(value)} ${unit}${power===2?'²':''}`
  return {figure,prompt:question,context,value,correctText,model:`${formula} = ${correctText}`}
}
