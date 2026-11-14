import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile,open} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'

const vite=await createServer({cacheDir:'/tmp/clairfle-phrase-images-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {tryGeneratePhraseBatch}=await vite.ssrLoadModule('/src/francais/phrase.ts')
  const {PHRASE_THEME_DEFS}=await vite.ssrLoadModule('/src/francais/phrase-themes.ts')
  const {phraseSelection}=await vite.ssrLoadModule('/src/francais/phrase-options.ts')
  const {typesForTopic,defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
  const {createRng}=await vite.ssrLoadModule('/src/math/rng.ts')
  const {joinPhrase}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
  const {phraseImageClues,MAX_PHRASE_IMAGE_CLUES}=await vite.ssrLoadModule('/src/francais/phrase-images.ts')
  const {GATTEGNO_PICTOGRAMS,pictureKey}=await vite.ssrLoadModule('/src/francais/phrase-pictograms.ts')
  const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
  const {parseFicheRecipe}=await vite.ssrLoadModule('/src/fiches/recipe.ts')
  const {buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
  const {PhraseImagesBlock}=await vite.ssrLoadModule('/src/components/item-view/phrase-images.tsx')
  const exampleTokens=[{text:'Je',category:'pronom'},{text:'mange',category:'verbe'},{text:'une',category:'determinant'},{text:'pomme',category:'nom'}]
  const example={layout:'phrase-images',tokens:exampleTokens,phraseImages:phraseImageClues(exampleTokens,['manger']),answer:'Je mange une pomme.',responseAnswer:'Je mange une pomme.'}
  const page={...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-images',verbGroup:'er',count:4,extraBlocks:undefined,phraseCategories:{adjectif:false,adverbe:false,conjonction:false,preposition:false}}
  const recipe={...demoRecipe(),seed:20261114,pages:[page],libreMode:false,libreSnapshot:null}

  await test('the image-writing family appears immediately before written production in every Gattegno theme, keeping the four existing formats',()=>{
    for(const theme of PHRASE_THEME_DEFS){const types=typesForTopic(theme.topic);assert.deepEqual(types.map(type=>type.id.split('-').at(-1)),['svc','colorier','ordre','construire','images','ecrire'])}
  })
  await test('existing constructions generate real, tagged image sentences at every verb group and polarity without mutating the source bank',()=>{
    const source=phraseSelection('phrase-simple','mixte'),before=structuredClone(source),pronouns=new Set()
    for(const theme of PHRASE_THEME_DEFS)for(const group of ['er','ir','autres','mixte'])for(const polarity of ['positive','negative','mixed'])for(const seed of [1,7,42,61,94,20261114]){
      const batch=tryGeneratePhraseBatch(theme.topic+'-images',4,createRng(seed),'moyen',group,polarity)
      assert.ok(batch.items.length,`${theme.topic} ${group} ${polarity}`)
      assert.equal(batch.items.length,Math.min(4,batch.bankQuestionCap));assert.equal(new Set(batch.items.map(item=>item.responseAnswer)).size,batch.items.length)
      for(const item of batch.items){
        assert.equal(item.layout,'phrase-images');assert.equal(item.responseAnswer,joinPhrase(item.tokens))
        assert.ok(item.phraseImages.length>=2&&item.phraseImages.length<=MAX_PHRASE_IMAGE_CLUES)
        assert.ok(item.phraseImages.some(clue=>clue.category==='verbe'&&clue.imageSrc))
        for(const clue of item.phraseImages){assert.ok(clue.label.trim());assert.ok(clue.category!=='determinant');if(clue.category==='nom'||clue.category==='verbe')assert.ok(clue.imageSrc);if(clue.imageSrc)assert.match(clue.imageSrc,/^\/lib\/images\/(?:tcf|gattegno)\//)}
        if(polarity==='negative')assert.match(item.responseAnswer,/\bpas\b/)
        if(item.tokens[0].category==='pronom')pronouns.add(pictureKey(item.tokens[0].text)==='j'?'je':pictureKey(item.tokens[0].text))
      }
    }
    assert.deepEqual([...pronouns].sort(),['je','tu','il','elle','nous','vous','ils','elles'].sort());assert.deepEqual(source,before)
  })
  await test('Je + manger + pomme yields three pictures with their word classes and an example only in the correction',()=>{
    assert.deepEqual(example.phraseImages.map(clue=>clue.category),['pronom','verbe','nom'])
    assert.ok(example.phraseImages[0].imageSrc.endsWith('pronom-je.webp'));assert.ok(example.phraseImages[1].imageSrc==='/lib/images/tcf/catalogue/actions/manger.webp');assert.ok(example.phraseImages[2].imageSrc.includes('/tcf/'))
    const student=renderToStaticMarkup(createElement(PhraseImagesBlock,{item:example,mode:'student'})),answers=renderToStaticMarkup(createElement(PhraseImagesBlock,{item:example,mode:'answers'}))
    assert.ok(!student.includes(example.answer));assert.ok(!student.includes('Exemple :'));assert.ok(answers.includes('Exemple : Je mange une pomme.'))
    for(const color of ['#8b5a2b','#e67e22','#2e8b57'])assert.ok(student.includes(color))
    assert.equal((student.match(/<figure/g)||[]).length,3)
  })
  await test('new seeds retain generation constraints while existing optional category filters remove whole predicates',()=>{
    const before=structuredClone(recipe),sentences=new Set()
    for(const seed of [11,22,33,44,55]){
      const input={...recipe,seed},built=buildPage(input.pages[0],seed)
      for(const item of built.blocks[0].items){sentences.add(item.responseAnswer);assert.ok(item.tokens.every(token=>!['adjectif','adverbe','preposition','conjonction'].includes(token.category)))}
    }
    assert.ok(sentences.size>4);assert.deepEqual(recipe,before)
  })
  await test('edited pictures, captions and teacher examples survive recipe serialization and worksheet regeneration',()=>{
    const input={...recipe,pages:[{...page,verbGroup:'libre',phraseImageLabels:true,phraseItems:[{...example,phraseImageLabels:true}],phraseInstruction:'Écrivez une phrase en contexte.'}]}
    const parsed=parseFicheRecipe(JSON.parse(JSON.stringify(input)));assert.ok(parsed)
    assert.deepEqual(parsed.pages[0].phraseItems,input.pages[0].phraseItems)
    const sheets=buildWorksheets(parsed.pages,parsed.seed);assert.deepEqual(sheets[0].blocks[0].items[0].phraseImages,example.phraseImages)
    const four={...parsed,pages:[{...parsed.pages[0],phraseItems:Array.from({length:4},()=>structuredClone(example)),count:4}]},pages=buildWorksheets(four.pages,four.seed)
    assert.equal(pages.length,2);assert.deepEqual(pages.flatMap(page=>page.blocks.flatMap(block=>block.items)).map(item=>item.responseAnswer),Array(4).fill(example.answer));assert.deepEqual(pages.map(page=>page.blocks[0].itemOffset),[0,3])
  })
  await test('game adaptation copies only the picture clues, keeps the example private and never creates an automatic verdict or competition question',()=>{
    const input={...recipe,pages:[{...page,libreItems:[example]}]},before=structuredClone(input),game=prepareGame(convertRecipe(input)),q=game.questions[0]
    assert.equal(q.mode,'oral');assert.equal(q.compatibility,'teacher-led');assert.deepEqual(q.choices,[])
    assert.ok(!JSON.stringify(q).includes(example.answer));assert.equal(game.corrections[q.id].text,example.answer)
    const state=transition(game,startSession(game,'solo'),{type:'TIMEOUT'});assert.equal(state.history[0].correct,undefined)
    assert.equal(competitionQuiz(game,'https://example.test').items.length,0);assert.deepEqual(input,before)
    const replacement='/lib/images/tcf/qcm-audit/vocab-tomate.webp',withOverride=convertRecipe({...input,imageOverrides:{[example.phraseImages[2].imageSrc]:replacement}})
    assert.equal(withOverride.questions[0].phraseImages[2].imageSrc,replacement);assert.equal(withOverride.questions[0].images[2],replacement)
  })
  await test('missing, ambiguous or malformed lexical support is excluded explicitly rather than truncated or assigned a fabricated picture',()=>{
    const bad=structuredClone(exampleTokens);bad[3].text='objet-introuvable';assert.equal(phraseImageClues(bad,['manger']),undefined)
    for(const patch of [{phraseImages:[]},{phraseImages:Array(13).fill(example.phraseImages[0])},{phraseImages:[{category:'wrong',label:'Je',imageSrc:'/x.webp'},...example.phraseImages.slice(1)]},{phraseImages:[{...example.phraseImages[0],label:''},...example.phraseImages.slice(1)]}]){
      const game=convertRecipe({...recipe,pages:[{...page,libreItems:[{...example,...patch}]}]});assert.equal(game.questions.length,0);assert.ok(game.issues.length)
    }
  })
  await test('all individual generated pictures match the reviewed TCF-style manifest and every lexical reference resolves to real image bytes',async()=>{
    const manifest=JSON.parse(await readFile('docs/gattegno/illustrations-generation-20261114.json','utf8'))
    assert.equal(manifest.referenceCommit,'48a753d8d6bd095e41968b39da88dbcb331fee11');assert.equal(manifest.images.length,214);assert.equal(GATTEGNO_PICTOGRAMS.length,250);assert.equal(manifest.generationMode,'individual');assert.equal(manifest.background,'contextual')
    for(const image of GATTEGNO_PICTOGRAMS){const row=[...manifest.images,...manifest.reused].find(row=>row.path===image.src);assert.ok(row,image.src);const bytes=await readFile('public'+image.src);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);if(row.sourceKind==='individual'){assert.equal(row.width*3,row.height*4);assert.ok(row.width>=1024)}assert.equal(bytes.subarray(8,12).toString(),'WEBP')}
    const pictures=JSON.parse(await readFile('src/francais/phrase-tcf-pictures.generated.json','utf8'))
    for(const src of new Set(pictures.map(image=>image.src))){assert.match(src,/^\/lib\/images\/tcf\//);const file=await open('public'+src);try{const buffer=Buffer.alloc(32);await file.read(buffer,0,32,0);assert.ok(!buffer.toString().startsWith('version https://git-lfs'))}finally{await file.close()}}
  })
}finally{await vite.close()}
