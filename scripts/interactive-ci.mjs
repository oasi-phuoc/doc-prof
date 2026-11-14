import { createServer } from 'vite'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const root = process.cwd()
const temporary = await mkdtemp(path.join(tmpdir(), 'clairfle-browser-ci-'))
const mainPort = Number(process.env.INTERACTIVE_CI_PORT ?? 5180)
const baselinePort = Number(process.env.INTERACTIVE_CI_BASELINE_PORT ?? 5181)
const baseline = process.env.A4_BASELINE_REF ?? '0addb36d662842040cc8ed64e8b2c0ca81eac810'
if (![mainPort, baselinePort].every((port) => Number.isInteger(port) && port >= 1024 && port <= 65535) || new Set([mainPort, baselinePort, 5182]).size !== 3) throw new Error('Ports de test invalides ou en conflit.')
const servers = []
const main = `http://127.0.0.1:${mainPort}`
process.env.VITE_FICHES_API_URL = `${main}/__test_api`
function command(file, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { cwd: root, stdio: 'inherit', ...options })
    child.on('error', reject)
    child.on('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`${path.basename(file)} ${args.join(' ')} : code ${code ?? signal}`)))
  })
}
async function serve(directory, port, name) {
  const server = await createServer({ root: directory, cacheDir: path.join(temporary, `${name}-cache`), server: { host: '127.0.0.1', port, strictPort: true } })
  servers.push(server); await server.listen(); return server
}
const env = { ...process.env, INTERACTIVE_TEST_URL: main, A4_BASELINE_URL: `http://127.0.0.1:${baselinePort}`, A4_BASELINE_REF: baseline, A4_FONT_CSS: path.join(root, 'src/fonts.css') }
const startAt = process.env.INTERACTIVE_TEST_START_AT
let started = !startAt
const passed = []
const run = async (name) => { if (!started && name !== startAt) return; started = true; console.log(`Parcours : ${name}`); await command(process.execPath, [`tests/interactive/${name}.mjs`], { env }); passed.push(name) }
try {
  await serve(root, mainPort, 'main')
  for (const name of ['browser', 'classroom-browser', 'solo-browser', 'untimed-browser', 'mobile-play-browser', 'mobile-layout-print-browser', 'duplex-browser', 'media-browser', 'card-feedback-browser', 'teacher-protections-browser', 'navigation-browser', 'resume-browser', 'session-lease-browser', 'checkpoint-browser', 'retention-browser', 'drafts-browser', 'votes-browser', 'teacher-sheet-browser', 'diagnostic-browser', 'fonts-browser', 'mascot-browser', 'calibration-browser', 'accessibility-browser']) await run(name)

  // These existing integration fixtures own port 5182 one after another.
  for (const name of ['game-run-browser', 'durable-run-browser', 'presets-browser', 'listening-browser', 'transcripts-browser', 'audio-sequences-browser', 'full-preload-browser', 'loading-browser', 'archives-browser', 'source-adapters-browser', 'guided-oral-browser', 'printable-pairs-browser', 'printable-decks-browser', 'printable-riddles-browser', 'numeracy-browser', 'written-arithmetic-browser', 'ordering-browser', 'geometry-browser', 'polygon-measures-browser', 'place-value-browser', 'recognition-browser', 'word-classification-browser', 'sound-check-browser', 'readability-browser', 'tcm-csc-browser', 'tcf-formats-browser', 'gattegno-browser', 'phrase-images-browser', 'competition-browser', 'competition-transcripts-browser', 'duel-browser', 'mascots-effects-browser']) await run(name)
  await run('competition-worker')
  const previousApi = process.env.VITE_FICHES_API_URL
  process.env.VITE_FICHES_API_URL = 'http://127.0.0.1:5182/__test_api'
  const saved = await serve(root, 5182, 'saved')
  process.env.VITE_FICHES_API_URL = previousApi
  await run('saved-fiches'); await saved.close()
  await run('performance-browser')

  // Archive only reference code, without environment files or a second checkout.
  // Assets are shared; the fixture compares arithmetic/geometry with identical fonts.
  await command('git', ['cat-file', '-e', `${baseline}^{commit}`])
  const reference = path.join(temporary, 'reference'); await mkdir(reference)
  const archive = path.join(temporary, 'reference.tar')
  await command('git', ['archive', '--format=tar', '--output', archive, baseline, 'src', 'index.html', 'vite.config.ts', 'package.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'])
  await command('tar', ['-xf', archive, '-C', reference])
  await symlink(path.join(root, 'node_modules'), path.join(reference, 'node_modules'), 'dir')
  await symlink(path.join(root, 'public'), path.join(reference, 'public'), 'dir')
  await serve(reference, baselinePort, 'reference')
  await run('a4-regression')
  if (!started) throw new Error('Point de reprise des tests inconnu.')
  await writeFile('docs/interactive/quality-browser-results.json', JSON.stringify({ allStagesRun: !startAt, startAt: startAt ?? null, passed, baseline }, null, 2) + '\n')
  console.log(startAt ? `Parcours depuis ${startAt} et comparaison A4 passés.` : 'Tous les parcours navigateur et la comparaison A4 sont passés.')
} finally {
  await Promise.allSettled(servers.map((server) => server.close()))
  await rm(temporary, { recursive: true, force: true })
}
