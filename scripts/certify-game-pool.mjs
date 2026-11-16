import {readFile,writeFile,access} from 'node:fs/promises'
import {createServer} from 'vite'
const file='src/interactive/pools/catalog.generated.json',catalog=JSON.parse(await readFile(file,'utf8'))
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-pool-certification'})
try{
 const {poolRecipe}=await vite.ssrLoadModule('/src/interactive/pools/recipe.ts'),{convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {blockingPoolIssues}=await vite.ssrLoadModule('/src/interactive/pools/issues.ts')
 const {collectMedia}=await vite.ssrLoadModule('/src/interactive/media/assets.ts')
 const seeds=[20261107,42,20261115],accepted=[]
 for(const type of catalog.items){
  let guided=false
  const candidates=type.domain==='tpf'||!type.complete?['facile','moyen','avance']:[type.difficulty],levels=[]
  for(const difficulty of candidates){let valid=true
   for(const seed of seeds){try{const recipe=poolRecipe({version:1,entries:[{id:type.id,count:type.complete?1:5,difficulty}],shuffle:true},seed);recipe.pages=Array.from({length:16},()=>recipe.pages[0]);const game=convertRecipe(recipe);if(!game.questions.length||blockingPoolIssues(game.issues).length||recipe.pages.some((_,page)=>!game.questions.some(q=>q.source.page===page))){valid=false;break}guided ||= game.questions.some(q=>q.mode!=='choice');const urls=[...new Set([...collectMedia(game.questions,{baseUrl:'https://pool.example/'}).map(asset=>decodeURIComponent(new URL(asset.url).pathname)),...game.questions.flatMap(q=>q.phraseImages?.flatMap(image=>image.imageSrc?[image.imageSrc]:[])??[])])];if((await Promise.allSettled(urls.map(url=>access('public'+url)))).some(r=>r.status==='rejected')){valid=false;break}}catch{valid=false;break}}
   if(valid)levels.push(difficulty)
  }
  if(levels.length)accepted.push({...type,guided,levels,difficulty:levels.includes(type.difficulty)?type.difficulty:levels[0]})
 }
 await writeFile(file,JSON.stringify({...catalog,scope:'Complete generated questions and local media verified at all 16 source positions, for each offered level, on three seeds. Blocking conversion issues exclude a type; supported guided activities remain explicit. Every configured pool is checked again before storage.',verifiedSeeds:seeds,verifiedPositions:16,items:accepted})+'\n')
 console.log(`${accepted.length} types de jeu certifiés sur trois graines, parmi ${catalog.items.length} candidats.`)
}finally{await vite.close()}
