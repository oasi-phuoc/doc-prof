/** Shared TypeScript loader for the Gattegno bank audits. */
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

module.exports = { load, get, root }
