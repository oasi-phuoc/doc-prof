import {defaultGrammarPilot} from '@/grammaire/curriculum/registry'
import {defaultPage,exerciseTypeById} from '@/math/catalog'
import type {InstitutionalHeader} from '@/components/math/PrintDocumentChrome'
import {defaultThemeGameContent} from '@/jeux/bank'
import type {FicheRecipe} from '@/fiches/recipe'
import type {PageConfig} from '@/math/types'
import {readPoolConfig,POOL_TYPE_BY_ID,type PoolConfig} from './config'
import {convertRecipe} from '../domain/convert'
import {blockingPoolIssues} from './issues'
import type {Game} from '../domain/types'
const EMPTY_CHROME:InstitutionalHeader={schoolName:'',schoolYear:'',schoolTagline:'',orgLine1:'',orgLine2:'',orgLine3:'',orgLine4:'',classLevel:'',classNumber:'',course:'',documentTitle:'',reference:'',logoSrc:''}

/** A generator configuration is internal; no worksheet is loaded, frozen or saved. */
export function poolRecipe(raw:PoolConfig,seed:number):FicheRecipe{
 const config=readPoolConfig(raw)
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw new Error('La graine de partie est invalide.')
 const pages:PageConfig[]=config.entries.map(entry=>{const type=POOL_TYPE_BY_ID.get(entry.id)!,definition=exerciseTypeById[type.type];if(!definition)throw new Error('Cet exercice n’est plus disponible.')
  return{...defaultPage(type.domain),topic:type.topic,exerciseType:type.type,track:definition.track,count:entry.count,difficulty:entry.difficulty,columns:definition.preferredColumns??2,extraBlocks:undefined,libreItems:undefined,...(type.domain==='jeux'?defaultThemeGameContent(type.type,'fruits'):{}),...(type.domain==='grammaire'?defaultGrammarPilot(type.type):{}),...(entry.range?{numberLibre:true,numberMin:entry.range.min,numberMax:entry.range.max,numberDecimals:entry.range.decimals}:{})}
 })
 return{version:1,pages,seed,institutional:{...EMPTY_CHROME},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null}
}
export function checkPoolQuestions(config:PoolConfig,seed:number){
 const recipe=poolRecipe(config,seed),game=convertPoolRecipe(recipe,'Pool d’exercices')
 assertPoolDraw(recipe,game)
 return{recipe,game}
}
export function convertPoolRecipe(recipe:FicheRecipe,title:string){const game=convertRecipe(recipe,title);return{...game,issues:blockingPoolIssues(game.issues)}}
export function assertPoolDraw(recipe:FicheRecipe,game:Game){
 const missing=recipe.pages.flatMap((entry,page)=>!game.questions.some(q=>q.source.page===page)?[exerciseTypeById[entry.exerciseType]?.label??entry.exerciseType]:[])
 if(missing.length||game.issues.length)throw new Error(`Ces réglages ne permettent pas de préparer tous les exercices : ${missing.join(', ')||'changez le niveau ou la plage de nombres'}. Modifiez le pool pour continuer.`)
}
