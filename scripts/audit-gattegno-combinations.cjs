/** Quotas, French agreement, negation and runtime coverage for all 16 combinations. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {get,load,root} = require('./gattegno-loader.cjs')
const {combinationContexts,combinationQuota,phraseContextMask,COMBINATION_CATEGORIES}=get('phrase-combinations.ts')
const {PHRASE_THEME_DEFS}=get('phrase-themes.ts')
const {frameForContext}=get('phrase-theme-frames.ts')
const {instantiateThemeFrame,sentenceOf,verbPersonOf,pronounsForFrame,DET_SUBJECTS,tagged}=get('phrase-sentences.ts')
const {withNegation}=get('phrase-negation.ts')
const {conjugateCore,verbCoreFromToken}=get('phrase-conjugate.ts')
const {phraseSelection}=get('phrase-options.ts')
const {tryGeneratePhraseBatch}=get('phrase.ts')
const {createRng}=load(path.join(root,'src/math/rng.ts'))
let checks=0
function check(value,message){assert.ok(value,message);checks++}
const report={quotaPerThemeAndGroup:525,affirmativeReferences:0,negativeReferences:0,banks:[]}
const key=context=>JSON.stringify([context.id,context.pred,context.rightId,context.rightPred])
function tokenMask(tokens){
  return COMBINATION_CATEGORIES.reduce((mask,category,bit)=>tokens.some(token=>token.category===category&&!(category==='adverbe'&&['ne','n’','pas'].includes(token.text.toLowerCase())))?mask|(1<<bit):mask,0)
}
for(const {topic,label}of PHRASE_THEME_DEFS)for(const group of ['er','autres']){
  const contexts=combinationContexts(topic,group)
  check(contexts.length===525&&new Set(contexts.map(key)).size===525,'525 distinct complete constructions '+topic+group)
  const bank={theme:topic,label,group,buckets:[]}
  const allSentences=new Set()
  for(let mask=0;mask<16;mask++){
    const entries=contexts.filter(context=>context.mask===mask)
    check(entries.length===combinationQuota(mask),'exact quota '+topic+group+mask)
    const affirmative=[],negative=[]
    for(const [index,entry]of entries.entries()){
      check(phraseContextMask(entry)===mask,'declared combination matches its tagged words')
      const frame=frameForContext(entry.id,entry)
      let subject=topic==='phrase-determinants'?DET_SUBJECTS[index%DET_SUBJECTS.length]:['Je/pronom','La/determinant voisine/nom','Sophie/nom','Nous/pronom','Elles/pronom','Le/determinant voisin/nom'][index%6]
      if(subject.includes('/pronom')&&!pronounsForFrame(entry.id,[entry.pred]).includes(subject))subject='La/determinant voisine/nom'
      const tokens=instantiateThemeFrame(topic,frame,()=>subject,preds=>preds[0],()=> 'Le/determinant voisin/nom','comp')
      const neg=withNegation(tokens,[entry.id,entry.rightId??entry.id])
      const positiveText=sentenceOf(tokens),negativeText=sentenceOf(neg)
      check(tokenMask(tokens)===mask&&tokenMask(neg)===mask,'actual categories, including negative exceptions: '+positiveText)
      check(!/[Jj]’n’|\b(?:me|te|se) ne\b|(?<![\p{L}])(?:de le|de les|à le|à les|de un|de une)(?![\p{L}])/u.test(negativeText),'French contractions and clitics: '+negativeText)
      const verbs=tokens.filter(token=>token.category==='verbe')
      const leftRaw=tagged(entry.pred).find(token=>token.category==='verbe').text
      check(verbs[0].text===conjugateCore(entry.id,verbPersonOf(subject),verbCoreFromToken(leftRaw).core),'left verb agreement: '+positiveText)
      if(entry.rightPred){
        const rightRaw=tagged(entry.rightPred).find(token=>token.category==='verbe').text
        check(verbs.length===2&&verbs[1].text===conjugateCore(entry.rightId,'il',verbCoreFromToken(rightRaw).core),'right verb agreement: '+positiveText)
        check(entry.id!==entry.rightId,'two coordinated actions use different verbs')
      }
      check(neg.filter(token=>['ne','n’'].includes(token.text)).length===verbs.length,'every clause is negated')
      affirmative.push(positiveText);negative.push(negativeText);allSentences.add(positiveText)
    }
    check(new Set(affirmative).size===entries.length&&new Set(negative).size===entries.length,'unique sentences in each bucket')
    bank.buckets.push({mask,categories:COMBINATION_CATEGORIES.filter((_,bit)=>mask&(1<<bit)),count:entries.length,affirmative,negative})
    report.affirmativeReferences+=affirmative.length;report.negativeReferences+=negative.length
  }
  check(allSentences.size===525,'525 distinct affirmative references '+topic+group)
  report.banks.push(bank)
  for(let allowed=0;allowed<16;allowed++){
    const categories=Object.fromEntries(COMBINATION_CATEGORIES.map((category,bit)=>[category,Boolean(allowed&(1<<bit))]))
    const selection=phraseSelection(topic,group,categories)
    const available=new Set(selection.frames.flatMap(frame=>frame.contexts?.map(context=>key({id:frame.id,...context}))??[]))
    for(const context of contexts.filter(context=>(context.mask&~allowed)===0))check(available.has(key(context)),'quota construction actually reachable through settings '+topic+group+allowed)
    for(const polarity of ['positive','negative','mixed']){
      let reference
      for(const kind of ['colorier','ordre','construire','ecrire']){
        const batch=tryGeneratePhraseBatch(topic+'-'+kind,12,createRng(389+allowed),'moyen',group,polarity,categories)
        check(batch.items.length===Math.min(12,selection.frames.length),'filtered model cap')
        const sentences=batch.items.map(item=>kind==='colorier'?sentenceOf(item.tokens):item.responseAnswer)
        if(kind==='colorier')reference=sentences
        else assert.deepEqual(sentences,reference,'same draw in all four formats')
        if(kind==='colorier')for(const item of batch.items)check((tokenMask(item.tokens)&~allowed)===0,'no excluded category in actual draw')
        if(kind==='construire')check(new Set(batch.items.map(item=>item.prompt)).size===batch.items.length,'no duplicate left verb on a worksheet')
        check(new Set(sentences).size===sentences.length,'no duplicate sentence')
      }
    }
  }
}
report.checks=checks
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'docs/gattegno/combinations.json'),JSON.stringify(report,null,2)+'\n')
console.log(`${checks} contrôles ; ${report.banks.length} banques ; ${report.affirmativeReferences} phrases affirmatives et ${report.negativeReferences} négatives ; les 16 combinaisons sont accessibles.`)
