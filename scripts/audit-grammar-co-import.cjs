/** Verify original grammar recordings, destinations, levels and saved selections. */
const assert=require('node:assert/strict')
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const get=name=>load(path.join(root,'src/grammaire/exercises',name))
const {GRAMMAR_CO_THEMES,grammarCoTypeId,normalizeGrammarCoBlock}=get('co-themes.ts')
const {GRAMMAR_CO_BANK,grammarCoEntries,defaultGrammarCoLevel,isAudioOnlyGrammarCo}=get('co-bank.ts')
const {buildImportedGrammarCo}=get('co-generate.ts')
const {buildPage}=load(path.join(root,'src/math/generate.ts'))
const {exerciseTypeById}=load(path.join(root,'src/math/catalog.ts'))
const {ALL_GRAM_SUBTHEMES}=get('catalog-exercises.ts')
const {createRng}=load(path.join(root,'src/math/rng.ts'))
const {blockFromPage,pageAsConfig}=load(path.join(root,'src/math/page-model.ts'))
const {applyType}=load(path.join(root,'src/components/generator/page-helpers.ts'))
const {parseFicheRecipe}=load(path.join(root,'src/fiches/recipe.ts'))
const report=JSON.parse(fs.readFileSync(path.join(root,'docs/grammaire/co-import/sources.json'),'utf8'))
const transcripts=JSON.parse(fs.readFileSync(path.join(root,'docs/grammaire/co-import/transcriptions.json'),'utf8'))
let checks=0
function check(value,message){assert.ok(value,message);checks++}
check(GRAMMAR_CO_THEMES.length===new Set(report.sources.map(s=>s.theme)).size,'every imported theme has one destination')
check(GRAMMAR_CO_BANK.length===report.source_count&&report.sources.length===report.source_count,'inventory covers every recording')
check(new Set(GRAMMAR_CO_BANK.map(e=>e.exercise.id)).size===GRAMMAR_CO_BANK.length,'distinct stable ids')
for(const level of ['A1','A2'])check(GRAMMAR_CO_BANK.filter(e=>e.level===level).length===report[level.toLowerCase()+'_sources'],'level count '+level)
check(report.a1_sources===127&&report.a2_sources===125,'all 127 original A1 and 125 new A2 sources')
check(new Set(report.sources.filter(s=>s.level==='A2').map(s=>s.source_lot)).size===24,'all 24 A2 source lots retained')
check(grammarCoEntries('loisirs','A2').length===11,'leisure and interests share one subtheme')
for(const [id,topic]of [['ville-campagne','gram-argumenter'],['prendre-soin','gram-conseiller'],['entretien-embauche','gram-demander'],['integration-entreprise','gram-demander']])check(GRAMMAR_CO_THEMES.find(t=>t.id===id).topic===topic,'agreed correction '+id)
for(const theme of GRAMMAR_CO_THEMES){
 const typeId=grammarCoTypeId(theme.subId),type=exerciseTypeById[typeId]
 check(type&&type.topic===theme.topic&&type.label==='Compréhension orale','one linked oral type '+theme.id)
 check(ALL_GRAM_SUBTHEMES.some(s=>s.id===theme.subId&&s.topic===theme.topic),'correct destination '+theme.id)
 const defaultLevel=defaultGrammarCoLevel(theme.id)
 const recipe={domain:'grammaire',topic:theme.topic,exerciseType:typeId,count:6,columns:1}
 check(applyType(type,{...recipe,grammarCoLevel:'A1'}).grammarCoLevel===(grammarCoEntries(theme.id,'A1').length?'A1':'A2'),'A2-only theme selects A2 instead of unavailable A1')
 const automatic=buildPage(recipe,37).blocks[0].items[0].tcf
 check(automatic.kind==='support'&&automatic.exercise.support.audio===grammarCoEntries(theme.id,defaultLevel)[0].exercise.support.audio,'default picker and actual recording agree')
 for(const level of ['A1','A2']){
  const entries=grammarCoEntries(theme.id,level)
  check(entries.length===report.sources.filter(s=>s.theme===theme.id&&s.level===level).length,'all sources reachable '+theme.id+level)
  if(!entries.length){
   const missing=buildImportedGrammarCo({...recipe,grammarCoLevel:level},createRng(1))
   check(missing.bankQuestionCap===0&&!JSON.stringify(missing).includes('/lib/audio/grammaire/'),'no fallback to the other level')
  }
  for(const entry of entries){
   const audio=entry.exercise.support.audio
   check(entry.status===(level==='A1'?'transcribed':'audio-only')&&entry.audioChecked,'source checked')
   check(entry.exercise.questions.length===0,'no questions added')
   if(level==='A2')check(entry.exercise.support.transcription==='','A2 transcription deferred')
   else check(entry.exercise.support.transcription.length>0&&entry.transcriptionReview?.sourceSha256===entry.source.sha256,'A1 transcription retained with source review')
   check(entry.exercise.niveau===(level==='A1'?'A0-A1':'A1-A2'),'TCF renderer level')
   check(audio.startsWith('/lib/audio/grammaire/co/'+theme.id+'/')&&(level!=='A2'||audio.includes('/a2/')),'correct folder, A2 separated')
   const file=path.join(root,'public',audio)
   check(fs.existsSync(file),'linked audio exists '+audio)
   const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
   check(hash===entry.source.sha256,'source bytes unchanged '+audio)
   if(level==='A1'){
    const transcript=transcripts.transcriptions.find(row=>row.exercise_id===entry.exercise.id)
    check(transcript&&transcript.source_sha256===hash&&transcript.selected_text===entry.exercise.support.transcription,'transcript bound to original bytes')
    check(transcript.human_listening_performed===false&&entry.transcriptionReview.humanListening===false,'no false listening attestation')
   }
   const source=report.sources.find(s=>s.exercise_id===entry.exercise.id)
   check(source.audio===audio&&source.sha256===hash&&source.level===level,'inventory link and level')
   const config={...recipe,grammarCoLevel:level,grammarCoAudioId:entry.exercise.id}
   const page=buildPage(config,37)
   check(page.blocks[0].items.length===1,'audio support only')
   const support=page.blocks[0].items[0].tcf
   check(support.kind==='support'&&support.exercise.support.audio===audio,'selected recording rendered')
   check(support.exercise.support.transcription===entry.exercise.support.transcription,'correct transcript rendered with selected recording')
   check(page.blocks[0].bankQuestionCap===0&&isAudioOnlyGrammarCo(typeId,level,entry.exercise.id),'no question count before questions exist')
   check(blockFromPage(config).grammarCoAudioId===entry.exercise.id,'selected recording copied')
   const next=applyType(type,config)
   check(next.grammarCoLevel===level&&next.grammarCoAudioId===entry.exercise.id,'settings retained for same type')
   const restored=parseFicheRecipe({version:1,pages:[config],seed:1,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
   check(restored.pages[0].grammarCoLevel===level&&restored.pages[0].grammarCoAudioId===entry.exercise.id,'settings survive saving')
  }
 }
 const copy=pageAsConfig({...recipe,grammarCoLevel:'A2',grammarCoAudioId:'another-block'}, {topic:theme.topic,exerciseType:typeId,count:6,columns:1})
 check(copy.grammarCoLevel===undefined&&copy.grammarCoAudioId===undefined,'independent settings per block')
}
for(const [legacy,subId]of [['gram-ex-a1-co-audio','a1'],['gram-ex-famille-fam-co','famille']]){
 check(!exerciseTypeById[legacy],'legacy duplicate hidden')
 check(normalizeGrammarCoBlock({exerciseType:legacy}).exerciseType===grammarCoTypeId(subId),'legacy recipe migration')
}
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server')
const {GrammarCoLevelControl}=load(path.join(root,'src/components/generator/GrammarCoLevelControl.tsx'))
for(const [a1Available,a2Available]of [[true,false],[false,true],[true,true]]){
 const html=renderToStaticMarkup(React.createElement(GrammarCoLevelControl,{value:a1Available?'A1':'A2',a1Available,a2Available,onChange:()=>{}}))
 check((html.match(/<button/g)||[]).length===2&&(html.match(/disabled/g)||[]).length===Number(!a1Available)+Number(!a2Available),'only available levels enabled')
}
console.log(`${checks} contrôles réussis ; ${report.a1_sources} audios A1 et ${report.a2_sources} audios A2 ; ${GRAMMAR_CO_THEMES.length} thèmes ; transcriptions A1 conservées ; transcriptions A2 et questions en attente.`)
