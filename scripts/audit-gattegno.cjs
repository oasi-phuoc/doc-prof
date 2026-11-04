/** Complete source-bank audit and regression checks for the Gattegno domain. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const cache = new Map()
function load(file) {
  file = path.resolve(file)
  if (!path.extname(file)) file = fs.existsSync(file + '.ts') ? file + '.ts' : fs.existsSync(file + '.tsx') ? file + '.tsx' : path.join(file,'index.ts')
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  if (file.endsWith('.json')) { module.exports=JSON.parse(fs.readFileSync(file,'utf8')); return module.exports }
  if (/\.(?:webp|svg|png|jpg)$/.test(file)) { module.exports=file; return file }
  const source = fs.readFileSync(file, 'utf8').replace(/import\.meta\.glob\('([^']+)',\s*\{[^}]*\}\)/g, (_match,pattern) => `require(${JSON.stringify('__eager_glob__:'+pattern)})`)
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  new Function('require','module','exports', code)(id => {
    if(id.startsWith('__eager_glob__:')) return Object.fromEntries(fs.globSync(id.slice(15),{cwd:path.dirname(file)}).map(name=>['./'+name,load(path.join(path.dirname(file),name))]))
    return id.startsWith('@/') ? load(path.join(root,'src',id.slice(2))) : id.startsWith('.') ? load(path.resolve(path.dirname(file),id)) : require(id)
  },module,module.exports)
  return module.exports
}
const get = name => load(path.join(root,'src/francais',name))
const { PHRASE_THEME_DEFS, PHRASE_ALL_THEME_DEFS, affirmativePhraseTheme, normalizeLegacyPhraseBlock } = get('phrase-themes.ts')
const { framesForTheme, instantiateThemeFrame, pronounsForFrame, phrasesFor, sentenceOf, tagged } = get('phrase-sentences.ts')
const { withNegation } = get('phrase-negation.ts')
const { conjugateCore } = get('phrase-conjugate.ts')
const { tryGeneratePhraseBatch } = get('phrase.ts')
const { PHRASE_COLORS, PRODUCTION_PROMPTS_BY_THEME } = get('phrase-banks.ts')
const { createRng } = load(path.join(root,'src/math/rng.ts'))
let checks = 0
function check(value, message) { assert.ok(value,message);checks++ }
function negative(tokens) { return tokens.some(token => /^(ne|n’)$/.test(token.text)) }
function validate(tokens, theme, frameId) {
  const text = sentenceOf(tokens)
  check(tokens.every(token => token.text && PHRASE_COLORS[token.category]), 'recognized tags: '+text)
  check(!tokens.some(token => [...token.text].some(char => char.charCodeAt(0)<32)) && !/_|\s{2}|\s+[.,]/.test(text), 'spacing and atomic text: '+text)
  check(!/[Jj][’'](?:n[’']|ne\b)/.test(text), 'Je before ne: '+text)
  check(!/(?<![\p{L}])(?:à le|à les|de le|de les|de un|de une)(?![\p{L}])/u.test(text), 'contractions: '+text)
  check(!/\b(?:me|te|se) ne\b|[mst]’n’/.test(text), 'negative clitic placement: '+text)
  check(tokens.filter(token => token.category === 'verbe').every(token => !/^(?:se |me |te |s’|m’|t’)/.test(token.text)), 'reflexive pronouns separately tagged: '+text)
  check(!/\b(?:bébé|maison|voiture|livre|train|table) (?:ne |n’)?(?:lit|écrit|traduit|conduit)/i.test(text), 'animate plausible subject: '+text)
  if (negative(tokens)) {
    check(tokens.filter(token=>/^(?:ne|n’)$/.test(token.text)).length===tokens.filter(token=>token.category==='verbe').length, 'every coordinated finite verb is negated: '+text)
  }
  if (theme.includes('adjectif')) check(tokens.some(token => token.category === 'adjectif'), 'adjective in adjective theme')
  if (theme.includes('preposition')) check(tokens.some(token => token.category === 'preposition'), 'preposition in preposition theme')
  if (!theme.includes('preposition') && !theme.includes('pronominaux')) check(!tokens.some(token => token.category === 'preposition'), 'no unexpected prepositions: '+text)
  if (theme.includes('pronominaux')) check(tokens.some((token,i) => i>0 && token.category === 'pronom' && /^(?:me|m’|te|t’|se|s’|nous|vous)$/.test(token.text)), 'reflexive clitic present: '+text)
  if (theme === 'phrase-simple' || theme === 'phrase-negation') check(frameId !== 'être', 'no être without adjective or preposition')
}

// Independent language cases, including the bugs discovered in the original banks.
for (const [source, expected] of [
  ['J’/pronom achète/verbe une/determinant pomme/nom', 'Je n’achète pas de pomme.'],
  ['J’/pronom éteins/verbe la/determinant lampe/nom', 'Je n’éteins pas la lampe.'],
  ['Je/pronom me_lave/verbe les/determinant mains/nom', 'Je ne me lave pas les mains.'],
  ['Je/pronom m’habille/verbe chaudement/adverbe', 'Je ne m’habille pas chaudement.'],
  ['Nous/pronom nous_reposons/verbe', 'Nous ne nous reposons pas.'],
  ['Tu/pronom achètes/verbe de_la/determinant farine/nom', 'Tu n’achètes pas de farine.'],
  ['Elle/pronom apporte/verbe une/determinant écharpe/nom', 'Elle n’apporte pas d’écharpe.'],
  ['Il/pronom porte/verbe un/determinant vieux/adjectif manteau/nom', 'Il ne porte pas de vieux manteau.'],
  ['Il/pronom mange/verbe des/determinant haricots/nom', 'Il ne mange pas de haricots.'],
  ['Il/pronom est/verbe un/determinant ami/nom', 'Il n’est pas un ami.'],
  ['Je/pronom mange/verbe déjà/adverbe une/determinant pomme/nom', 'Je ne mange pas encore de pomme.'],
  ['Elle/pronom lit/verbe un/determinant livre/nom et/conjonction le/determinant voisin/nom écrit/verbe une/determinant lettre/nom', 'Elle ne lit pas de livre et le voisin n’écrit pas de lettre.'],
]) {
  const result = withNegation(tagged(source))
  assert.equal(sentenceOf(result),expected);checks++
  assert.deepEqual(withNegation(result),result,'negative conversion is idempotent');checks++
}
assert.equal(sentenceOf(tagged('Elle/pronom rêve/verbe de/preposition un/determinant voyage/nom')), 'Elle rêve d’un voyage.')
assert.equal(sentenceOf(tagged('Il/pronom marche/verbe près_de/preposition le/determinant lac/nom')), 'Il marche près du lac.')
assert.equal(sentenceOf(withNegation(tagged('Je/pronom suis/verbe une/determinant piste/nom'), ['suivre'])), 'Je ne suis pas de piste.')
const following=framesForTheme('phrase-negation','autres').find(frame=>frame.id==='suivre')
assert.equal(sentenceOf(instantiateThemeFrame('phrase-negation',following,()=> 'Je/pronom',preds=>preds[0])), 'Je ne suis pas de chemin.')
for (const [inf, form3sg, person, expected] of [
  ['lever','lève','ils','lèvent'],['jeter','jette','ils','jettent'],['envoyer','envoie','ils','envoient'],['nettoyer','nettoie','nous','nettoyons'],['manger','mange','nous','mangeons'],['commencer','commence','nous','commençons'],['s’asseoir','assied','nous','asseyons'],['se souvenir','souvient','vous','souvenez'],['se vêtir','vêt','ils','vêtent'],
]) { assert.equal(conjugateCore(inf,person,form3sg),expected);checks++ }

assert.deepEqual(PHRASE_THEME_DEFS.map(theme => theme.topic), ['phrase-simple','phrase-determinants','phrase-pronominaux','phrase-adjectif','phrase-preposition','phrase-adverbe','phrase-conjonctions'])
const report = {
  referenceSentencesPerThemeAndGroup:100,
  visibleThemes:PHRASE_THEME_DEFS.map(theme=>theme.label),
  findingsCorrected:[
    'Je rétabli devant ne/n’ ; pronoms réfléchis placés après ne et séparés des verbes.',
    'Articles indéfinis et partitifs ramenés à de/d’ après pas, sauf attribut de être.',
    'Contractions à/de et h aspiré ; majuscules des prénoms et des noms géographiques.',
    'Troisième personne du pluriel des verbes en -er à alternance ; nouveaux irréguliers pronominaux.',
    'Accord au pluriel des adjectifs attributs et suppression de sujets bébés incompatibles avec les actions.',
    'Conjonctions : verbes de la seconde proposition correctement conjugués, liens logiques arbitraires supprimés.',
    'Prédicats peu naturels relus : savoir un poème, laver la dent, continuer le chemin, glace vanille/adjectif.',
  ],
  themes:[],
}
let exhaustiveCases=0
for (const {topic:theme} of PHRASE_ALL_THEME_DEFS) {
  const groupReports=[]
  check(PRODUCTION_PROMPTS_BY_THEME[theme].length===15 && new Set(PRODUCTION_PROMPTS_BY_THEME[theme]).size===15,'fifteen prompts '+theme)
  for (const group of ['er','autres']) {
    const frames=framesForTheme(theme,group)
    check(frames.length>0 && new Set(frames.map(frame=>frame.id)).size===frames.length,'unique verb models '+theme+group)
    const references=phrasesFor(theme,group)
    check(references.length===100 && new Set(references.map(sentenceOf)).size===100,'one hundred distinct reference sentences '+theme+group)
    for(const sentence of references)validate(sentence,theme)
    for(const frame of frames){
      check(frame.preds.length>=2 && new Set(frame.preds).size===frame.preds.length,'distinct reviewed contexts '+frame.id)
      const subjects=[...pronounsForFrame(frame.id,frame.preds),'Fanny/nom','Thomas/nom','La/determinant voisine/nom','Le/determinant voisin/nom']
      for(let variant=0;variant<frame.preds.length;variant++)for(const subject of subjects){
        const tokens=instantiateThemeFrame(theme,frame,()=>subject,preds=>preds[variant%preds.length],()=> 'La/determinant voisine/nom','comp')
        validate(tokens,theme,frame.id)
        exhaustiveCases++
        if(frame.id==='être' && theme.includes('adjectif') && (subject.startsWith('Elles/')||subject.startsWith('Ils/'))){
          const attr=tokens.filter(token=>token.category==='adjectif').at(-1)
          check(/[sx]$/.test(attr.text),'plural attribute agreement')
          if(subject.startsWith('Elles/'))check(/(?:grandes|fatiguées|contentes)/.test(attr.text),'feminine plural attribute')
        }
      }
    }
    groupReports.push({group,uniqueVerbModels:frames.length,reviewedPredicates:frames.reduce((sum,frame)=>sum+frame.preds.length,0),referenceSentences:references.map(sentenceOf)})
  }
  report.themes.push({id:theme,groups:groupReports})
}
for(const {topic}of PHRASE_THEME_DEFS)for(const group of ['er','autres'])for(const polarity of ['positive','negative','mixed'])for(const count of [1,2,7,12])for(let seed=1;seed<=12;seed++){
  let gold
  for(const kind of ['colorier','ordre','construire','ecrire']){
    const result=tryGeneratePhraseBatch(topic+'-'+kind,count,createRng(seed),'moyen',group,polarity)
    check(result.items.length===Math.min(count,framesForTheme(topic,group).length),'count bounded by distinct verbs')
    const sentences=result.items.map(item=>kind==='colorier'?sentenceOf(item.tokens):item.responseAnswer)
    check(new Set(sentences).size===sentences.length,'no duplicate sentences on a worksheet')
    if(kind==='colorier')gold=sentences
    else assert.deepEqual(sentences,gold,'same sentence pool and subjects across all four layouts')
    const modes=result.items.map(item=>kind==='colorier'?negative(item.tokens): /(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer))
    if(polarity==='positive')check(modes.every(value=>!value),'positive pool '+topic+' '+group+' '+kind+' '+seed+' '+sentences.join(' | '))
    if(polarity==='negative')check(modes.every(Boolean),'negative pool')
    if(kind==='ecrire'&&polarity==='negative')check(result.instruction.includes('forme négative')&&!result.instruction.includes('affirmatives'),'negative writing instruction stays consistent')
    if(polarity==='mixed'&&modes.length>1)check(modes.some(Boolean)&&modes.some(value=>!value)&&Math.abs(modes.filter(Boolean).length-modes.filter(value=>!value).length)<=1,'balanced mixture')
    if(kind==='construire')check(new Set(result.items.map(item=>item.prompt)).size===result.items.length,'no repeated verb model')
  }
}
for(const theme of PHRASE_ALL_THEME_DEFS.filter(theme=>theme.topic.startsWith('phrase-negation'))){
  const old={topic:theme.topic,exerciseType:theme.topic+'-ordre',count:6,verbGroup:'autres',contentSeed:17}
  const next=normalizeLegacyPhraseBlock(old)
  check(next.topic===affirmativePhraseTheme(theme.topic)&&next.phrasePolarity==='negative'&&next.count===6&&next.contentSeed===17,'saved recipe migration')
  check(tryGeneratePhraseBatch(old.exerciseType,6,createRng(11),'moyen','autres').items.every(item=>/(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer)),'old recipe stays negative')
}
const {renderToStaticMarkup}=require('react-dom/server'),React=require('react')
const {PhrasePolarityControl}=load(path.join(root,'src/components/generator/PhrasePolarityControl.tsx'))
for(const value of ['positive','negative','mixed']){
  const html=renderToStaticMarkup(React.createElement(PhrasePolarityControl,{value,onChange:()=>{}}))
  check((html.match(/<button/g)||[]).length===3&&(html.match(/aria-pressed="true"/g)||[]).length===1,'accessible three-way control')
}
// Group balance and capital letters survive ordering, without repeating a verb on a sheet.
for(const topic of ['phrase-simple','phrase-preposition','phrase-pronominaux'])for(const group of ['er','autres']){
  const families={proper:0,common:0,pronoun:0}
  for(let seed=1;seed<=200;seed++){
    const batch=tryGeneratePhraseBatch(topic+'-colorier',6,createRng(seed),'moyen',group,'positive')
    for(const item of batch.items){
      const first=item.tokens[0]
      families[first.category==='nom'?'proper':first.category==='pronom'?'pronoun':'common']++
    }
  }
  check(Object.values(families).every(total=>total>250&&total<550),'all three subject families represented '+topic+group)
}
for(const {topic}of PHRASE_THEME_DEFS)for(const group of ['er','autres']){
  const batch=tryGeneratePhraseBatch(topic+'-construire',1000,createRng(7),'moyen',group,'mixed')
  check(batch.items.length===framesForTheme(topic,group).length&&new Set(batch.items.map(item=>item.prompt)).size===batch.items.length,'long requests never recycle a verb model')
}
// Page-model integration: modes survive recipe copies and remain specific to each block.
const {buildPage}=load(path.join(root,'src/math/generate.ts'))
const {blockFromPage,setPageBlock}=load(path.join(root,'src/math/page-model.ts'))
const {applyType}=load(path.join(root,'src/components/generator/page-helpers.ts'))
const {parseFicheRecipe}=load(path.join(root,'src/fiches/recipe.ts'))
const {exerciseTypeById,gattegnoTopics,typesForTopic}=load(path.join(root,'src/math/catalog.ts'))
assert.deepEqual(gattegnoTopics.map(topic=>topic.id),['phrase-tableaux',...PHRASE_THEME_DEFS.map(theme=>theme.topic)])
for(const {topic} of PHRASE_THEME_DEFS)check(typesForTopic(topic).length===4,'four layouts registered '+topic)
const recipe={domain:'gattegno',topic:'phrase-simple',exerciseType:'phrase-simple-ordre',count:6,columns:1,verbGroup:'autres',phrasePolarity:'positive',extraBlocks:[
  {topic:'phrase-pronominaux',exerciseType:'phrase-pronominaux-ordre',count:6,columns:1,verbGroup:'autres',phrasePolarity:'negative'},
  {topic:'phrase-determinants',exerciseType:'phrase-determinants-ordre',count:6,columns:1,verbGroup:'er',phrasePolarity:'mixed'},
]}
const page=buildPage(recipe,51)
check(page.blocks.length===3,'three independently configured exercises')
check(page.blocks[0].items.every(item=>!/(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer)),'first block affirmative')
check(page.blocks[1].items.every(item=>/(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer)),'second block negative')
check(page.blocks[2].items.some(item=>/(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer))&&page.blocks[2].items.some(item=>!/(?<![\p{L}])(?:ne(?![\p{L}])|n’)/u.test(item.responseAnswer)),'third block mixed')
const changed=buildPage(setPageBlock(recipe,1,{phrasePolarity:'positive'}),51)
assert.deepEqual(changed.blocks[0].items,page.blocks[0].items,'switching a block does not redraw the others')
assert.deepEqual(changed.blocks[2].items,page.blocks[2].items,'other block retains its mixture')
check(blockFromPage(recipe).phrasePolarity==='positive','mode serialized in page recipe')
check(applyType(exerciseTypeById['phrase-simple-colorier'],{...recipe,phrasePolarity:'mixed'}).phrasePolarity==='mixed','mode retained when changing layout')
check(!applyType(exerciseTypeById['gram-ex-etre-qcm-conj'],recipe).phrasePolarity,'Gattegno mode does not leak into other domains')
const manualItems=[{layout:'phrase-write',answer:'Ma phrase personnelle.',responseAnswer:'Ma phrase personnelle.'}]
const manual=buildPage({...recipe,verbGroup:'libre',phrasePolarity:'mixed',phraseItems:manualItems,phraseInstruction:'Mon texte.',extraBlocks:undefined},1)
assert.deepEqual(manual.blocks[0].items,manualItems,'saved free-mode text stays editable and unchanged')
check(manual.blocks[0].instruction==='Mon texte.','free-mode instruction preserved')
const oldPage={...recipe,topic:'phrase-negation',exerciseType:'phrase-negation-ordre',phrasePolarity:undefined,extraBlocks:[{...recipe.extraBlocks[0],topic:'phrase-negation-pronominaux',exerciseType:'phrase-negation-pronominaux-ordre',phraseItems:manualItems}]}
const restored=parseFicheRecipe({version:1,pages:[oldPage],seed:1,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:[oldPage]})
for(const pages of [restored.pages,restored.libreSnapshot]){
  check(pages[0].topic==='phrase-simple'&&pages[0].exerciseType==='phrase-simple-ordre'&&pages[0].phrasePolarity==='negative','legacy recipe migrated before rendering')
  check(pages[0].extraBlocks[0].topic==='phrase-pronominaux'&&pages[0].extraBlocks[0].phrasePolarity==='negative','legacy extra block migrated')
  assert.deepEqual(pages[0].extraBlocks[0].phraseItems,manualItems,'migration preserves manual content')
}
const conjunction=framesForTheme('phrase-conjonctions','er').find(frame=>frame.id==='manger')
assert.equal(sentenceOf(instantiateThemeFrame('phrase-conjonctions',conjunction,()=> 'Nous/pronom',preds=>preds[0],()=> 'La/determinant voisine/nom')),'Nous mangeons une pomme et la voisine cuisine un plat.')
for(const chart of ['categories','mots','vide'])check(tryGeneratePhraseBatch('phrase-tableau-'+chart,6,createRng(1),'moyen','er','mixed').items.length===1,'reference charts remain unchanged')
report.exhaustiveCases=exhaustiveCases;report.checks=checks
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'docs/gattegno/audit.json'),JSON.stringify(report,null,2)+'\n')
console.log(`${checks} contrôles réussis ; ${exhaustiveCases} instanciations contrôlées ; ${report.themes.length*200} phrases de référence (100 par banque).`)
