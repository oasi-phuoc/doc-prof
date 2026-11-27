const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {buildPage,buildWorksheets}=load(root+'/src/math/generate.ts')
const {grammarPageBreakQuestionId:key,splitGradedGrammarPages}=load(root+'/src/grammaire/curriculum/pagination.ts')
const {blockItemsForConfig}=load(root+'/src/components/generator/sheet-items.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const seed=839
const config=(bank,p)=>({domain:'grammaire',topic:bank.topic??'gram-present',exerciseType:bank.activityId,difficulty:'facile',columns:1,count:6,...defaultGrammarPilot(bank.activityId),grammarLevel:bank.level,grammarBankRevision:bank.revision,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:2}:{}),...(p==='order'&&bank.units.some(u=>u.kind==='order'&&u.tokens.some(t=>t.category==='negation'))?{phrasePolarity:bank.units.some(u=>u.kind==='order'&&!u.tokens.some(t=>t.category==='negation'))?'mixed':'negative'}:{})})
const questions=sheets=>sheets.flatMap(s=>s.items.flatMap(i=>key(i)?[key(i)]:[]))
const input=pages=>({pages,seed,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
let offerings=0
for(const b of banks)for(const p of b.presentations){
 const cfg=config(b,p),original=buildPage(cfg,seed),grouped=buildWorksheets([cfg],seed)
 assert.equal(grouped.length,1,b.activityId+'/'+b.level+'/'+p+' stays on one page')
 assert.deepEqual(grouped[0].items,original.items)
 const keys=original.items.map(key).filter(Boolean);assert(keys.length>=2,b.activityId+'/'+p+' layouts: '+original.items.map(i=>i.layout))
 const cut=keys[1],edited={...cfg,grammarPageBreakAfterQuestionIds:[cut]},split=buildWorksheets([edited],seed)
 assert.equal(split.length,2,'Only the selected question creates a page break')
 assert.deepEqual(questions(split),keys,'Question IDs and order remain unchanged')
 assert.equal(questions([split[0]]).at(-1),cut)
 assert.deepEqual(blockItemsForConfig(split,0,0).items,original.items,'Editor restores the complete block without repeated supports')
 const recipe=buildFicheRecipe(input([edited])),restored=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));assert(restored)
 assert.deepEqual(questions(buildWorksheets(restored.pages,seed)),keys)
 assert.deepEqual(restored.pages[0].grammarPageBreakAfterQuestionIds,[cut])
 assert.equal(buildWorksheets([{...cfg,grammarPageBreakAfterQuestionIds:[keys.at(-1)]}],seed).length,1,'No empty page after the last question')
 const twoCuts=buildWorksheets([{...cfg,grammarPageBreakAfterQuestionIds:[keys[0],keys[1]]}],seed)
 assert.equal(twoCuts.length,3);assert.deepEqual(questions(twoCuts),keys)
 offerings++
}
const a=config(banks.find(b=>b.activityId==='gram-ex-futur-proche-qcm-verbe'),'gap')
const b=config(banks.find(b=>b.activityId==='gram-ex-futur-simple-qcm-conj'),'gap')
const {blockFromPage}=load(root+'/src/math/page-model.ts')
const mixed={...a,extraBlocks:[blockFromPage(b)]},plain=buildWorksheets([mixed],seed)
assert.equal(plain.length,1);assert.equal(plain[0].blocks.length,2)
const firstKeys=plain[0].blocks[0].items.map(key),atBoundary=buildWorksheets([{...mixed,grammarPageBreakAfterQuestionIds:[firstKeys.at(-1)]}],seed)
assert.equal(atBoundary.length,2);assert.equal(atBoundary[1].blocks[0].sourceBlockIndex,1);assert.equal(atBoundary[1].blocks[0].itemOffset,0)
assert.deepEqual(blockItemsForConfig(atBoundary,0,0).items,plain[0].blocks[0].items)
const reading=(subtheme)=>config(banks.find(b=>b.subthemeId===subtheme&&b.presentations.includes('document-set')),'document-set')
const twoReadings={...reading('e2'),extraBlocks:[blockFromPage(reading('e5'))]}
const unsplitReadings=buildWorksheets([twoReadings],seed)
const firstReadingCut=questions(unsplitReadings).at(0)
const splitReadings=buildWorksheets([{...twoReadings,grammarPageBreakAfterQuestionIds:[firstReadingCut]}],seed)
assert.equal(splitReadings.length,2)
for(const [blockIndex,total] of [8,6].entries()){
 const items=blockItemsForConfig(splitReadings,0,blockIndex).items
 assert.deepEqual(items,unsplitReadings[0].blocks[blockIndex].items)
 assert.equal(items.filter(item=>item.grammar?.readingPart?.kind==='question').length,total)
}
const legacyItems=Array.from({length:6},(_,index)=>({layout:'texte',prompt:'Question '+(index+1),answer:'Réponse'}))
const legacyBlock={exerciseType:'gram-ex-k1-qcm-verbe',instruction:'Répondez.',items:legacyItems}
const legacy={domain:'grammaire',blocks:[legacyBlock],items:legacyItems}
assert.equal(splitGradedGrammarPages(legacy),null)
const oldSplit=splitGradedGrammarPages({...legacy,blocks:[{...legacyBlock,tcfPageBreakAfter:[false,false,true]}]})
assert.equal(oldSplit.length,2);assert.deepEqual(oldSplit.flatMap(s=>s.items),legacyItems);assert.equal(oldSplit[1].blocks[0].itemOffset,3)
const math={domain:'tcm-csc',topic:'nombres',exerciseType:'tcm-csc-ex03',count:5,columns:1,difficulty:'facile'}
assert(!buildWorksheets([math],seed).some(s=>s.items.some(i=>i.grammar)))
console.log(JSON.stringify({status:'passed',offerings,defaultSinglePage:true,manualCutsPreserveOrder:true,roundTrips:true,documentAndDialogueSupports:true,legacyQuestions:true,multipleBlocks:true}))
