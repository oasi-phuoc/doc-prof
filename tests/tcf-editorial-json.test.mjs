import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {normalizeEditorialBank,canonicalEditorialJson} from '../src/tcf/editorial-json.mjs'
import {formatComprehensionJson,wrapEditorialText,BANK_FILES} from '../scripts/format-comprehension-json.mjs'
const sha=value=>createHash('sha256').update(value).digest('hex')
const proof=JSON.parse(readFileSync('docs/tcf/format-json-ce-co-20261123.json','utf8'))

test('current banks round-trip exactly; initial migration snapshots retain their complete content',()=>{
 assert.equal(proof.files.length,7)
 for(const path of BANK_FILES){
  const bytes=readFileSync(path,'utf8'),raw=JSON.parse(bytes),record=proof.files.find(row=>row.path===path)
  assert(record.contentPreserved);assert.equal(sha(bytes),record.afterSha256)
  assert.equal(sha(canonicalEditorialJson(raw)),record.currentSemanticSha256)
  assert.equal(formatComprehensionJson(raw),bytes,'Idempotent layout: '+path)
  // Later authorised editorial edits remain possible after running the formatter.
  if(!record.matchesInitialBaseline)continue
  const before=JSON.parse(execFileSync('git',['show',proof.baseCommit?`${proof.baseCommit}:${path}`:`91f4e4eca:${path}`],{encoding:'utf8',maxBuffer:32*1024*1024}))
  assert.deepEqual(normalizeEditorialBank(raw),before,path)
  assert.equal(JSON.stringify(normalizeEditorialBank(raw)),JSON.stringify(before),'Original property order: '+path)
 }
})

test('line wrapping preserves punctuation, newlines, accents and every original space',()=>{
 for(const text of ["Bonjour.  Voici l’été : un rendez-vous à 14 h 30 !\n— D’accord, merci. ".repeat(9),'Bonjour à tous.','x'.repeat(120),"Je n’ai rien changé.\n\nEncore une ligne avec des espaces. ".repeat(3)]){
  const lines=wrapEditorialText(text,65)
  assert.equal(Array.isArray(lines)?lines.join(''):lines,text)
  if(Array.isArray(lines)&&!text.includes('x'.repeat(120)))for(const line of lines)assert(JSON.stringify(line).length<=67)
 }
})

test('mono fragments never turn into additional audio documents',()=>{
 const support={audio:'/one.mp3',transcription:['Bonjour,',' voici le texte.','\nNouvelle réplique.']}
 const original={id:'mono',support}
 const snapshot=structuredClone(original)
 const output=normalizeEditorialBank(original)
 assert.equal(output.support.transcription,'Bonjour, voici le texte.\nNouvelle réplique.')
 assert.deepEqual(original,snapshot)
 const mixed=normalizeEditorialBank({support:{audios:['/one.mp3','/two.mp3'],transcription:[['Premier',' texte.'],'Deuxième texte.']}})
 assert.deepEqual(mixed.support.transcription,['Premier texte.','Deuxième texte.'])
 assert.equal(mixed.support.audios.length,mixed.support.transcription.length)
})

test('CE paragraphs and grammar wrappers use the same lossless reader',()=>{
 assert.equal(normalizeEditorialBank({support:{texte:['Une ligne.','\nUne autre.']}}).support.texte,'Une ligne.\nUne autre.')
 assert.equal(normalizeEditorialBank([{exercise:{support:{audio:'/a.mp3',transcription:['Texte',' exact.']}}}])[0].exercise.support.transcription,'Texte exact.')
 const untouched={support:{texte:'Déjà simple.'},questions:[{choix:[{texte:'Un choix',correct:true}]}]}
 assert.equal(normalizeEditorialBank(untouched),untouched)
})

test('line objects and every answer choice occupy one source line',()=>{
 const raw={support:{audio:'/a.mp3',transcription:'Une phrase un peu longue. '.repeat(10)},questions:[{formes:{lignes:{nb_lignes:2,reponse_modele:'Un modèle.'},qcm_texte:{melanger:true,choix:[{id:'a',texte:'Oui',correct:true},{id:'b',texte:'Non',correct:false}]},qcm_image:{melanger:true,choix:[{id:'a',image:'/image.png',correct:true,annotations:[{x:1,y:2}]},{id:'b',image:'/autre.png'}]}}}]}
 const text=formatComprehensionJson(raw)
 assert.match(text,/"lignes": \{ "nb_lignes": 2, "reponse_modele": "Un modèle\." \}/)
 assert.equal(text.split('\n').filter(line=>line.trim().startsWith('{ "id":')).length,4)
 assert.deepEqual(normalizeEditorialBank(JSON.parse(text)),raw)
})


test('Python maintenance tools decode the same mono and per-track representations',()=>{
 const fixture=[{support:{audio:'/a.mp3',transcription:['Été,',' puis hiver.']}},{exercise:{support:{audios:['/a.mp3','/b.mp3'],transcription:[['Un',' texte.'],['Un autre',' texte.']]}}},{support:{texte:['Ligne.','\nSuite.']}}]
 const program="import json,sys;from scripts.audio_replacement.editorial_json import loads;print(json.dumps(loads(sys.stdin.read()),ensure_ascii=False))"
 const decoded=JSON.parse(execFileSync('python',['-c',program],{input:JSON.stringify(fixture),encoding:'utf8'}))
 assert.deepEqual(decoded,normalizeEditorialBank(fixture))
})
