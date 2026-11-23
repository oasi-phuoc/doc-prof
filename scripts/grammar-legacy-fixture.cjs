/** Read-only historical regression reference from Git; never imported by the app. */
const {execFileSync}=require('node:child_process')
const {root}=require('./gattegno-loader.cjs')
const revision='a67c622a7',cache=new Map()
function historicalJson(name){
 if(!cache.has(name))cache.set(name,JSON.parse(execFileSync('git',['show',revision+':src/grammaire/exercises/'+name],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024})))
 return cache.get(name)
}
function historicalLessonForType(id){
 const name='__lessons'
 if(!cache.has(name))cache.set(name,['lessons-protected','lessons-revised'].flatMap(f=>JSON.parse(execFileSync('git',['show',revision+':src/grammaire/exercises/bank/'+f+'.ts'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).split('= ',2)[1])))
 return cache.get(name).find(r=>`gram-ex-${r.subId}-${r.kindId}`===id)
}
module.exports={historicalJson,historicalLessonForType}
