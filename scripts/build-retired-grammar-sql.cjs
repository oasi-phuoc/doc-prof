/** Keep the D1 maintenance query aligned with the shared retirement policy. */
const fs=require('node:fs')
const file='api/fiches/maintenance/purge-retired-grammar.sql'
const subthemes=JSON.parse(fs.readFileSync('src/grammaire/curriculum/retired-subthemes.json','utf8'))
const sql=fs.readFileSync(file,'utf8')
const updated=sql.replace(/json_each\('\[[^']*\]'\) s/,`json_each('${JSON.stringify(subthemes)}') s`)
if(updated===sql&&!sql.includes(JSON.stringify(subthemes)))throw Error('Retirement list not found in D1 query')
fs.writeFileSync(file,updated)
console.log(`${subthemes.length} retired grammar notions in the D1 maintenance query.`)
