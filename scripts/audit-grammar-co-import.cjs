/** Check uploaded grammar audio links, original bytes, level and saved selection. */
const assert=require('node:assert/strict')
const fs=require('node:fs')
const path=require('node:path')
const crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const get=name=>load(path.join(root,'src/grammaire/exercises',name))
const {GRAMMAR_CO_THEMES,grammarCoTypeId,normalizeGrammarCoBlock}=get('co-themes.ts')
const {GRAMMAR_CO_BANK,grammarCoEntries,isAudioOnlyGrammarCo}=get('co-bank.ts')
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
check(GRAMMAR_CO_THEMES.length===20,'20 agreed themes')
check(GRAMMAR_CO_BANK.length===127&&report.sources.length===127,'127 imported recordings')
check(new Set(GRAMMAR_CO_BANK.map(entry=>entry.exercise.id)).size===127,'distinct stable ids')
check(new Set(report.sources.map(source=>source.sha256)).size===127,'distinct source hashes')
check(transcripts.transcriptions.length===127,'127 byte-bound transcript records')
for(const theme of GRAMMAR_CO_THEMES){
 const typeId=grammarCoTypeId(theme.subId),type=exerciseTypeById[typeId]
 check(type&&type.topic===theme.topic&&type.label==='Compréhension orale','one linked oral type '+theme.id)
 check(ALL_GRAM_SUBTHEMES.some(sub=>sub.id===theme.subId&&sub.topic===theme.topic),'correct subtheme destination '+theme.id)
 const entries=grammarCoEntries(theme.id,'A1')
 check(entries.length===report.sources.filter(source=>source.theme===theme.id).length,'all theme sources accessible '+theme.id)
 check(grammarCoEntries(theme.id,'A2').length===0,'no A1 recording classified A2')
 const recipe={domain:'grammaire',topic:theme.topic,exerciseType:typeId,count:6,columns:1,grammarCoLevel:'A1'}
 for(const entry of entries){
  const audio=entry.exercise.support.audio
  check(entry.status==='transcribed'&&entry.audioChecked,'source status')
  check(entry.exercise.support.transcription.trim().length>0&&entry.exercise.questions.length===0,'transcript present; questions still empty')
  check(audio.startsWith('/lib/audio/grammaire/co/'+theme.id+'/'),'audio in correct theme folder')
  const file=path.join(root,'public',audio)
  check(fs.existsSync(file),'linked audio exists '+audio)
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  check(hash===entry.source.sha256,'source bytes unchanged '+audio)
  const transcript=transcripts.transcriptions.find(row=>row.exercise_id===entry.exercise.id)
  check(transcript&&transcript.source_sha256===hash&&transcript.selected_text===entry.exercise.support.transcription,'transcript bound to original bytes '+audio)
  check(transcript.human_listening_performed===false&&entry.transcriptionReview.humanListening===false,'no false listening attestation')
  const source=report.sources.find(source=>source.exercise_id===entry.exercise.id)
  check(source.audio===audio&&source.sha256===hash&&source.level==='A1','inventory link and hash')
  const config={...recipe,grammarCoAudioId:entry.exercise.id}
  const page=buildPage(config,37)
  check(page.blocks[0].items.length===1,'audio support without fake questions')
  const support=page.blocks[0].items[0].tcf
  check(support.kind==='support'&&support.exercise.support.audio===audio,'selected recording rendered '+audio)
  check(support.exercise.support.transcription===transcript.selected_text,'selected transcript rendered with its recording')
  check(page.blocks[0].bankQuestionCap===0,'zero question cap for an audio-only source')
  check(isAudioOnlyGrammarCo(typeId,'A1',entry.exercise.id),'question count hidden until questions are added')
  check(blockFromPage(config).grammarCoAudioId===entry.exercise.id,'selected recording copied in recipe')
 }
 const a2=buildImportedGrammarCo({...recipe,grammarCoLevel:'A2'},createRng(1))
 check(a2.bankQuestionCap===0&&!JSON.stringify(a2).includes('/lib/audio/grammaire/'),'no A2 fallback to A1')
 const first=entries[0].exercise.id
 const configured={...recipe,grammarCoAudioId:first}
 const next=applyType(type,configured)
 check(next.grammarCoLevel==='A1'&&next.grammarCoAudioId===first,'settings retained for same type')
 const copy=pageAsConfig({...configured,grammarCoLevel:'A2'}, {topic:theme.topic,exerciseType:typeId,count:6,columns:1})
 check(copy.grammarCoLevel===undefined&&copy.grammarCoAudioId===undefined,'independent settings per block')
 const restored=parseFicheRecipe({version:1,pages:[configured],seed:1,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
 check(restored.pages[0].grammarCoLevel==='A1'&&restored.pages[0].grammarCoAudioId===first,'settings survive saving')
}
for(const [legacy,subId]of [['gram-ex-a1-co-audio','a1'],['gram-ex-famille-fam-co','famille']]){
 check(!exerciseTypeById[legacy],'legacy duplicate hidden from menu')
 check(normalizeGrammarCoBlock({exerciseType:legacy}).exerciseType===grammarCoTypeId(subId),'legacy recipe migration')
}
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server')
const {GrammarCoLevelControl}=load(path.join(root,'src/components/generator/GrammarCoLevelControl.tsx'))
const html=renderToStaticMarkup(React.createElement(GrammarCoLevelControl,{value:'A1',a2Available:false,onChange:()=>{}}))
check((html.match(/<button/g)||[]).length===2&&(html.match(/disabled/g)||[]).length===1,'A1/A2 toggle with A2 disabled')
console.log(`${checks} contrôles réussis ; 127 audios A1 et transcriptions liés à 20 thèmes ; originaux conservés ; questions laissées vides.`)
