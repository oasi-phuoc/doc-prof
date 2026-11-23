import { spawn } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { copyFile, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
const root = process.cwd(), temporary = await mkdtemp(path.join(tmpdir(), 'clairfle-secrets-'))
const version = '8.30.1'
const checksum = '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb'
const baseline = '0addb36d662842040cc8ed64e8b2c0ca81eac810'
const modelEvidence = [
  'bascule-preuves-reconnaissances-20261105.json',
  'correction-debut-allo-brigitte-20261112.json',
  'adjudications-contextuelles-20261112.json',
  'corrections-4-editions-20261111.json',
  'verification-numero-radio-cinema-20261112.json',
  'validation-87-20261111.json',
].map(file => `docs/tcf/remplacement-audio/${file}`)
const delfEvidence = [
  'signature-52-1-d7caa132e648.json',
  'signature-52-2-caaca983b5dd.json',
].map(file => `docs/tcf/delf-actif-20261113/relectures/${file}`)
const existingSceneRecords=(await Promise.all(['20261114','20261115'].map(async date=>JSON.parse(await readFile(`docs/interactive/revue-identifiants-scenes-${date}.json`,'utf8')).reviewed))).flat()
const sceneRecords=[...existingSceneRecords,...JSON.parse(await readFile('docs/interactive/revue-identifiants-pool-integration-20261116.json','utf8')).reviewed,...JSON.parse(await readFile('docs/interactive/revue-identifiants-tcf-20261122.json','utf8')).reviewed]
const sceneEvidence=[...new Set(sceneRecords.map(record=>record.file))]
const normalizedEvidence = [...modelEvidence, ...delfEvidence,...sceneEvidence]
const publicImageHashes=JSON.parse(await readFile('docs/interactive/revue-empreintes-delf-lot2-20261123.json','utf8')).reviewed
for(const record of publicImageHashes){
  if(record.file!=='docs/tcf/delf-actif-20261113/lot2-100-20261123-preparation.json'||!/^public\/lib\/images\/tcf\/qcm-audit\/qcm-delf2-[a-z-]+\.png$/.test(record.path)||createHash('sha256').update(await readFile(record.path)).digest('hex')!==record.sha256)throw new Error('Empreinte publique de référence incohérente.')
}
async function separateJsonLines(file) {
  const source = await readFile(file, 'utf8')
  JSON.parse(source)
  // Gitleaks 8.30 seeks a blank line after each 100 kB fragment. Keep JSON
  // values intact while giving it safe boundaries instead of partial hashes.
  await writeFile(file, source.replace(/\n/g, '\n\n'))
}
function command(file, args, cwd = root) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }); const chunks = []
    child.stdout.on('data', (chunk) => chunks.push(chunk)); child.stderr.on('data', () => {})
    child.on('error', () => reject(new Error(`Impossible de lancer ${path.basename(file)}.`)))
    child.on('exit', (code) => resolve({ code, stdout: Buffer.concat(chunks).toString() }))
  })
}
async function required(file, args, cwd) { const result = await command(file, args, cwd); if (result.code !== 0) throw new Error(`Échec de ${path.basename(file)} ; aucune sortie potentiellement sensible n’est reproduite.`); return result.stdout }
async function scan(binary, args, name) {
  const output = path.join(temporary, `${name}.json`)
  const result = await command(binary, [...args, '--config', path.join(root, '.gitleaks.toml'), '--no-banner', '--no-color', '--redact=100', '--report-format=json', `--report-path=${output}`])
  if (![0, 1].includes(result.code)) throw new Error(`Le contrôle Gitleaks ${name} n’a pas pu terminer (code ${result.code}).`)
  const findings = JSON.parse(await readFile(output, 'utf8')) ?? []
  // Deliberately never print Match, Secret, commit messages or raw scanner output.
  return findings.map((finding) => ({ rule: finding.RuleID, file: finding.File.replace(temporary + path.sep, ''), line: name === 'changed' && normalizedEvidence.some(file => finding.File.endsWith(file)) ? Math.ceil(finding.StartLine / 2) : finding.StartLine }))
}
try {
  if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('Le scanner épinglé nécessite Linux x64.')
  const archive = path.join(temporary, 'gitleaks.tar.gz')
  await required('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '60', `https://github.com/gitleaks/gitleaks/releases/download/v${version}/gitleaks_${version}_linux_x64.tar.gz`, '--output', archive])
  if (createHash('sha256').update(await readFile(archive)).digest('hex') !== checksum) throw new Error('Empreinte du scanner Gitleaks incorrecte.')
  await required('tar', ['-xzf', archive, '-C', temporary, 'gitleaks'])
  const binary = path.join(temporary, 'gitleaks')
  const canaryDirectory = path.join(temporary, 'canary'); await mkdir(canaryDirectory)
  const canary = 'ghp_' + randomBytes(27).toString('base64url').replace(/[-_]/g, 'A')
  const genericCanary = randomBytes(32).toString('hex')
  await writeFile(path.join(canaryDirectory, 'canary.js'), `const syntheticUnissuedToken = '${canary}'\n`)
  const evidenceDirectory = path.join(canaryDirectory, 'docs/tcf/remplacement-audio'); await mkdir(evidenceDirectory, { recursive: true })
  for (const file of modelEvidence) {
    const evidenceCanary = path.join(canaryDirectory,file)
    await writeFile(evidenceCanary, JSON.stringify({
      padding: 'A'.repeat(100_000),
      '/tmp/clairfle-model/tokens.txt': randomBytes(32).toString('hex'),
      '/tmp/clairfle-model/small-tokens.txt': randomBytes(32).toString('hex'),
      '/tmp/clairfle-model/medium-tokens.txt': randomBytes(32).toString('hex'),
      api_key: genericCanary,
    }, null, 2))
    await separateJsonLines(evidenceCanary)
  }
  for (const file of delfEvidence) {
    const evidenceCanary = path.join(canaryDirectory, file)
    await mkdir(path.dirname(evidenceCanary), { recursive: true })
    await writeFile(evidenceCanary, JSON.stringify({
      padding: 'A'.repeat(100_000),
      '/tmp/clairfle-model/small-tokens.txt': randomBytes(32).toString('hex'),
      api_key: genericCanary,
    }, null, 2))
    await separateJsonLines(evidenceCanary)
  }
  const sceneKeyCanaries=[]
  for(const file of sceneEvidence){
    const evidenceCanary=path.join(canaryDirectory,file),key=randomBytes(32).toString('hex');sceneKeyCanaries.push(key)
    await mkdir(path.dirname(evidenceCanary),{recursive:true})
    await writeFile(evidenceCanary,JSON.stringify({padding:'A'.repeat(100_000),key,api_key:genericCanary,reviewed:sceneRecords.filter(record=>record.file===file).map(record=>({key:record.sceneId}))},null,2))
    await separateJsonLines(evidenceCanary)
  }
  const hashEvidence=path.join(canaryDirectory,publicImageHashes[0].file)
  await mkdir(path.dirname(hashEvidence),{recursive:true})
  await writeFile(hashEvidence,JSON.stringify({padding:'A'.repeat(100_000),...Object.fromEntries(publicImageHashes.map(record=>[record.field,randomBytes(32).toString('hex')])),api_key:genericCanary,reviewed:publicImageHashes.map(record=>({[record.field]:record.sha256}))},null,2))
  const outsideEvidence = path.join(evidenceDirectory,'unreviewed.json')
  await writeFile(outsideEvidence,JSON.stringify({ '/tmp/clairfle-model/tokens.txt':randomBytes(32).toString('hex') },null,2))
  const selfTest = await scan(binary, ['dir', canaryDirectory], 'canary')
  const canaryReport = await readFile(path.join(temporary, 'canary.json'), 'utf8')
  if (selfTest.length !== normalizedEvidence.length + sceneEvidence.length + publicImageHashes.length + 3 || !selfTest.some((finding) => finding.rule.includes('github')) ||
    normalizedEvidence.some(file => !selfTest.some(finding => finding.rule === 'generic-api-key' && finding.file.endsWith(file))) ||
    !selfTest.some(finding => finding.rule === 'generic-api-key' && finding.file.endsWith('unreviewed.json')) ||
    selfTest.filter(finding=>finding.rule==='generic-api-key'&&finding.file.endsWith(publicImageHashes[0].file)).length!==publicImageHashes.length+1||
    sceneEvidence.some(file=>selfTest.filter(finding=>finding.rule==='generic-api-key'&&finding.file.endsWith(file)).length!==2)||
    canaryReport.includes(canary) || canaryReport.includes(genericCanary)||sceneKeyCanaries.some(key=>canaryReport.includes(key))) throw new Error('L’autotest de détection, d’exception ou de masquage du scanner a échoué.')
  await required('git', ['cat-file', '-e', `${baseline}^{commit}`])
  const tree = path.join(temporary, 'changed'); await mkdir(tree)
  const tracked = await required('git', ['diff', '--name-only', '--diff-filter=ACMR', '-z', baseline])
  const untracked = await required('git', ['ls-files', '--others', '--exclude-standard', '-z'])
  const files = [...new Set([...tracked.split('\0'), ...untracked.split('\0')].filter(Boolean))]
  for (const file of files) {
    const source = path.resolve(root, file), destination = path.resolve(tree, file)
    if (!source.startsWith(root + path.sep) || !destination.startsWith(tree + path.sep)) throw new Error('Chemin de fichier invalide.')
    if (!(await lstat(source)).isFile()) continue
    await mkdir(path.dirname(destination), { recursive: true }); await copyFile(source, destination)
    if (normalizedEvidence.includes(file)) await separateJsonLines(destination)
  }
  const history = await scan(binary, ['git', `--log-opts=${baseline}..HEAD`, root], 'history')
  const changed = await scan(binary, ['dir', tree], 'changed')
  const report = { tool: `Gitleaks ${version}`, selfTest: `Jeton GitHub et clés génériques synthétiques non émis détectés dans ${normalizedEvidence.length} rapports, contenus masqués ; key et api_key restent détectés dans les ${sceneEvidence.length} rapports de références publiques, seuls ${sceneRecords.length} identifiants publics exacts sont admis ; empreintes de vocabulaires admises dans huit rapports précis et détectées ailleurs ; deux empreintes de PNG publics exactes admises dans le rapport DELF du 23 novembre, avec des empreintes aléatoires et api_key toujours détectées dans ce même fichier.`, baseline, changedFiles: files.length, findings: [...history, ...changed], scope: 'Commits depuis le jalon C0 et fichiers modifiés/non suivis actuels. Les secrets historiques préexistants et le bundle complet exigent encore la migration d’authentification F22 ; ce contrôle ne certifie pas leur absence.' }
  await writeFile('docs/interactive/secrets-results.json', JSON.stringify(report, null, 2) + '\n')
  if (report.findings.length) { console.error(JSON.stringify(report.findings, null, 2)); throw new Error('Gitleaks a trouvé des valeurs à vérifier ; leur contenu est masqué.') }
  console.log(`Gitleaks ${version} : aucun secret détecté dans le périmètre des modifications (${files.length} fichiers).`)
} finally { await rm(temporary, { recursive: true, force: true }) }
