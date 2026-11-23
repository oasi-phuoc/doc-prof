import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const directory = fileURLToPath(new URL('.', import.meta.url))
const wrangler = fileURLToPath(new URL('./node_modules/wrangler/bin/wrangler.js', import.meta.url))
const accessSecrets = ['ACCESS_ADMIN', 'ACCESS_FULL', 'ACCESS_PARTIAL']

function runWrangler(args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, ...args], {
      cwd: directory,
      stdio: [input === undefined ? 'ignore' : 'pipe', 'inherit', 'inherit'],
    })
    child.once('error', reject)
    child.once('close', code => resolve(code ?? 1))
    if (child.stdin) {
      child.stdin.on('error', error => { if (error.code !== 'EPIPE') reject(error) })
      child.stdin.end(input)
    }
  })
}

export async function deployWithBuildSecrets({ env = process.env, args = [], run = runWrangler, log = console.log } = {}) {
  // Les options Wrangler (dry-run, autre environnement, autre configuration…)
  // conservent les secrets distants. La synchronisation concerne la commande
  // sans options configurée pour le build de production de ce Worker.
  if (args.length === 0) {
    const secrets = {}
    for (const name of accessSecrets) {
      const value = env[name]
      if (typeof value !== 'string' || value.trim() === '') continue
      if (value !== value.trim()) {
        log(`La variable de build ${name} contient un espace en début ou fin. Corrigez sa valeur avant de déployer.`)
        return 1
      }
      secrets[name] = value
    }
    const names = Object.keys(secrets)
    if (names.length > 0) {
      log(`Configuration des secrets d’accès du Worker : ${names.join(', ')}.`)
      // Entrée standard JSON : aucune valeur dans les arguments, logs ou fichiers.
      // Le PATCH de Wrangler ne modifie que les clés fournies ; aucune clé nulle.
      const code = await run(['secret', 'bulk'], JSON.stringify(secrets))
      if (code !== 0) return code
    }
  }
  return run(['deploy', ...args])
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    process.exitCode = await deployWithBuildSecrets({ args: process.argv.slice(2) })
  } catch {
    console.error('Le processus de déploiement n’a pas pu être lancé.')
    process.exitCode = 1
  }
}
