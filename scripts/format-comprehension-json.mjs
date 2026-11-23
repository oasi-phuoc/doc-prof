import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {normalizeEditorialBank,canonicalEditorialJson} from '../src/tcf/editorial-json.mjs'
export const BANK_FILES=['a0-a1','a1-a2','a2-b1'].flatMap(level=>['ce','co'].map(kind=>`src/tcf/content/${level}/${kind}.json`)).concat('src/grammaire/exercises/co-bank.json')
const sha=value=>createHash('sha256').update(value).digest('hex')
const quote=value=>JSON.stringify(value)

/** Cut only at whitespace. Every original byte of the decoded string is retained. */
export function wrapEditorialText(text,width=68) {
 if(typeof text!=='string')return text
 const parts=[];let rest=text
 while(quote(rest).length>width+2){
  let cut=0
  for(let index=1;index<rest.length;index++){
   if(quote(rest.slice(0,index)).length>width+2)break
   if(/\s/u.test(rest[index])&&!/^\s+[!?;:,.…]+(?:\s|$)/u.test(rest.slice(index)))cut=index
  }
  // An indivisible word can exceed the target width; never damage a word.
  if(!cut){const match=/\s/u.exec(rest.slice(1));if(!match)break;cut=match.index+1}
  parts.push(rest.slice(0,cut));rest=rest.slice(cut)
 }
 parts.push(rest)
 if(parts.join('')!==text)throw Error('Text fragments are not lossless.')
 return parts.length>1?parts:text
}
function prepare(value,depth=0) {
 if(Array.isArray(value))return value.map(entry=>prepare(entry,depth+1))
 if(!value||typeof value!=='object')return value
 const out={...value}
 for(const [key,child]of Object.entries(value)){
  if(key==='support'&&child&&typeof child==='object'){
   out[key]={...child}
   // A rendered string line uses this indentation plus two quotes and a comma.
   const monoWidth=Math.max(40,77-(depth+3)*2)
   if(typeof child.texte==='string')out[key].texte=wrapEditorialText(child.texte,monoWidth)
   if(typeof child.transcription==='string')out[key].transcription=wrapEditorialText(child.transcription,monoWidth)
   else if(Array.isArray(child.audios)&&Array.isArray(child.transcription))out[key].transcription=child.transcription.map(text=>wrapEditorialText(text,monoWidth-2))
  }else out[key]=prepare(child,depth+1)
 }
 return out
}
const simple=value=>value===null||typeof value!=='object'
const inline=obj=>'{ '+Object.entries(obj).map(([key,value])=>quote(key)+': '+quote(value)).join(', ')+' }'
export function formatComprehensionJson(value) {
 const render=(entry,depth,key='')=>{
  const indent='  '.repeat(depth),child='  '.repeat(depth+1)
  if(simple(entry))return quote(entry)
  if(Array.isArray(entry))return entry.length?'[\n'+entry.map(value=>child+render(value,depth+1,key==='choix'?'choice':'')).join(',\n')+'\n'+indent+']':'[]'
  const fields=Object.entries(entry)
  if(!fields.length)return '{}'
  if(key==='choice'||key==='lignes')return inline(entry)
  if(['qcm_texte','qcm_image'].includes(key)&&Array.isArray(entry.choix)&&fields.every(([name,value])=>name==='choix'||simple(value))){
   return '{ '+fields.map(([name,value])=>quote(name)+': '+(name==='choix'?render(value,depth+1,'choix'):quote(value))).join(', ')+' }'
  }
  return '{\n'+fields.map(([name,value])=>child+quote(name)+': '+render(value,depth+1,name)).join(',\n')+'\n'+indent+'}'
 }
 const normalized=normalizeEditorialBank(value),prepared=prepare(normalized)
 const output=render(prepared,0)+'\n'
 if(JSON.stringify(normalizeEditorialBank(JSON.parse(output)))!==JSON.stringify(normalized))throw Error('Formatting changed exercise values or object key order.')
 return output
}
export function formatBanks(root,{write=false}={}){
 const proofPath=path.join(root,'docs/tcf/format-json-ce-co-20261123.json')
 const previous=(()=>{try{return JSON.parse(readFileSync(proofPath,'utf8'))}catch{return {files:[]}}})()
 const files=BANK_FILES.map(file=>{
  const input=readFileSync(path.join(root,file),'utf8'),data=JSON.parse(input),output=formatComprehensionJson(data)
  const semanticSha256=sha(canonicalEditorialJson(data)),prior=previous.files.find(row=>row.path===file)
  const row={path:file,beforeSha256:prior?.beforeSha256??sha(input),inputSha256:sha(input),afterSha256:sha(output),semanticSha256:prior?.semanticSha256??semanticSha256,currentSemanticSha256:semanticSha256,contentPreserved:true,matchesInitialBaseline:!prior||prior.semanticSha256===semanticSha256,entries:data.length}
  if(write)writeFileSync(path.join(root,file),output)
  return row
 })
 const report={baseCommit:previous.baseCommit??execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),date:'2026-11-23',scope:'Source layout only; normalize line fragments before reading. No exercise, audio association, text, model or answer value changed.',targetLineWidth:80,files}
 if(write){mkdirSync(path.dirname(proofPath),{recursive:true});writeFileSync(proofPath,JSON.stringify(report,null,2)+'\n')}
 return report
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=formatBanks(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),{write:process.argv.includes('--write')})
 console.log(JSON.stringify({files:report.files.length,entries:report.files.reduce((n,f)=>n+f.entries,0),contentPreserved:report.files.every(f=>f.contentPreserved),write:process.argv.includes('--write')}))
}
