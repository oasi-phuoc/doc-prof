import {parseEditorialJson} from '../src/tcf/editorial-json.mjs'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { gallerySubjectTypes, gallerySubjectThemes } from './gallery-subject-types.mjs'

const IMAGE = /\.(?:png|jpe?g|webp|svg|gif|avif|bmp|ico)$/i
const norm = text => String(text).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/œ/g, 'oe').replace(/[’‘]/g, "'")
const pretty = text => text.replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase())
const read = (root, file, fallback = []) => {
  try { return parseEditorialJson(readFileSync(path.join(root, file), 'utf8')) } catch { return fallback }
}
function walk(root, dir = '') {
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.git', 'dist', '.vercel', '.codex', '.agents', 'work'].includes(entry.name)) return []
    const file = path.posix.join(dir, entry.name)
    return entry.isDirectory() ? walk(root, file) : IMAGE.test(file) ? [file] : []
  })
}
export function repositoryImages(root) {
  try {
    return [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, maxBuffer: 32 * 1024 * 1024 }).toString().split('\0'))]
      .filter(file => !file.startsWith('work/') && IMAGE.test(file) && existsSync(path.join(root, file))).sort()
  } catch { return walk(root).sort() }
}

const RULES = [
  ['Alimentation et boissons', /aliment|nourriture|recette|restaurant|cuisine|dessert|fruit|legume|chocolat|cacao|\bcafe\b|\bthe\b|tarte|salade|boisson|boulanger|patisser|steak|poisson|viande/],
  ['Transports et voyages', /transport|voyag|avion|aeroport|train|\bbus\b|\btram\b|\bvelo\b|voiture|valise|passeport|billet|gare|bateau/],
  ['Logement et mobilier', /logement|maison|mobilier|meuble|appartement|canape|fauteuil|armoire|chaise|chambre|cuisine|\blit\b|table|salon/],
  ['Vêtements et accessoires', /vetement|accessoire|pantalon|robe|costume|chaussure|chemise|bijou|lunette|echarpe|manteau|sac/],
  ['Santé et corps', /sante|corps|medec|pharmac|hopital|malade|dentiste|douleur|ventre/],
  ['École et formation', /ecole|formation|classe|etudi|lycee|universit|enseign|scolaire|cahier|crayon|stylo/],
  ['Travail et métiers', /travail|metier|profession|emploi|bureau|artisan|entreprise|retraite/],
  ['Loisirs et culture', /loisir|culture|sport|musee|theatre|cinema|musique|livre|concert|bibliotheque|fete|anniversaire|cadeau/],
  ['Nature et animaux', /nature|animaux|animal|\bchats?\b|\bchiens?\b|oiseau|arbre|plante|fleur|jardin|montagne|\bmer\b|foret/],
  ['Ville et services', /ville|commerce|magasin|poste|banque|mairie|rue|parc|police|service/],
  ['Personnes et relations', /famille|personne|relation|emotion|sentiment|visage|couple|ami|enfant|femme|homme/],
  ['Temps et météo', /temps|meteo|horloge|cadran|calendrier|saison|pluie|soleil|neige/],
]

/** Index every repository image once, then enrich it from the existing banks. */
export function buildGalleryCatalog(root, files = repositoryImages(root)) {
  const metadata = new Map()
  const reviewedObjects = new Set()
  const associationScenes = new Set()
  const coSources = new Map()
  const curated = read(root, 'docs/gallery/classement-tcf-20261113.json', {})
  const classifications = new Map((curated.images ?? []).map(image => [image.path, image]))
  const replacementSources = new Map((curated.replacements ?? []).map(image => [image.path, image.original]))
  const keywordAudit = read(root, 'docs/gallery/audit-mots-cles-tcf-20261117.json', {})
  const auditsByPath = new Map((keywordAudit.images ?? []).map(image => [image.path, image]))
  const add = (src, data) => {
    if (typeof src !== 'string' || !src.startsWith('/')) return
    const previous = metadata.get(src) ?? { labels: [], themes: [], types: [], keywords: [] }
    for (const key of ['labels', 'themes', 'types', 'keywords']) previous[key].push(...(data[key] ?? []).filter(Boolean))
    metadata.set(src, previous)
  }
  const vocabFile = path.join(root, 'src/jeux/vocab-images.ts')
  if (existsSync(vocabFile)) {
    const text = readFileSync(vocabFile, 'utf8').split('export const VOCAB_IMAGE_THEMES')[1]
    if (text) {
      const themes = parseEditorialJson(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1).replace(/^\[\]\s*=\s*/, ''))
      for (const theme of themes) for (const word of theme.words) add(word.src, { labels: [word.label], themes: [theme.label] })
    }
  }
  for (const image of read(root, 'docs/tcf/images-generees.json', {}).images ?? []) {
    add(image.path, { labels: [image.label], types: image.gallery_types, themes: image.gallery_themes })
  }
  for (const manifest of ['docs/gallery/complements-20261116.json', 'docs/gallery/objets-20261116.json', 'docs/gallery/quotidien-20261116.json', 'docs/gallery/ajouts-20261117.json']) for (const image of read(root, manifest, {}).images ?? []) {
    if (image.status === 'visually_reviewed') {
      add(image.path, { labels: [image.label], types: [image.type], themes: [image.type, image.subtype, 'Style TCF validé'], keywords: image.aliases ?? [] })
      if (image.type === 'Objet') reviewedObjects.add(image.path)
    }
  }
  for (const image of read(root, 'public/lib/images/tcf/po/illustrations-manifest.json', {}).images ?? []) {
    add(image.path, { labels: [image.title && `${image.title} — scène ${image.step ?? ''}`], themes: [image.title], types: ['Scénario'], keywords: [image.action] })
  }
  for (const manifest of ['media-supports', 'presentation-media', 'family-media']) {
    for (const image of read(root, `docs/grammaire/implementation/${manifest}.json`, {}).supports ?? []) {
      add(image.src, { labels: [image.alt], themes: ['Grammaire'], types: ['Illustration'] })
    }
  }
  for (const image of read(root, 'docs/grammaire/implementation/decrire-media-manifest.json', {}).images ?? []) {
    add(image.src, { labels: [image.alt], themes: ['Grammaire', 'Temps et météo'], types: ['Illustration'], keywords: [image.source?.path?.split('/').at(-1)?.replace(/\.webp$/, '')] })
  }
  for(const image of read(root,'docs/gattegno/illustrations-generation-20261114.json',{}).images??[])add(image.path,{labels:[image.label],themes:['Gattegno','Style TCF validé',image.category==='pronom'?'Pronoms personnels':'Verbes d’action'],types:[image.category==='pronom'?'Personnage':'Action']})
  for (const image of read(root, 'src/tcf/content/ce-art.json')) add(image.src, { labels: [image.label], types: ['Document'] })
  for (const image of read(root, 'src/tcf/object-images.json')) add(image.image, { labels: [image.label], themes: [pretty(image.family ?? '')], types: ['Objet'], keywords: image.aliases })
  for (const image of classifications.values()) add(image.path, { labels: [image.label], themes: image.themes, keywords: image.aliases })
  const tcf = path.join(root, 'src/tcf/content')
  if (existsSync(tcf)) for (const level of ['a0-a1', 'a1-a2', 'a2-b1']) for (const skill of ['ce', 'co', 'pe', 'po']) {
    for (const ex of read(root, `src/tcf/content/${level}/${skill}.json`)) {
      const context = [ex.scenario && pretty(ex.scenario)]
      if (skill === 'co') {
        coSources.set(ex.id, ex)
        if (ex.type_exercice === 'association_images') {
          const levelTheme = level === 'a1-a2' ? 'CO CFR A2' : `CO ${level.toUpperCase()}`
          for (const situation of ex.situations ?? []) {
            if (!situation.image?.startsWith('/')) continue
            associationScenes.add(situation.image)
            add(situation.image, { types: ['Scénario'], themes: [...context, levelTheme, situation.dialogue == null ? 'Leurres CO' : 'Situations CO'],
              labels: [ex.scene] })
          }
        }
      }
      for (const q of ex.questions ?? []) {
        const texts = new Map((q.choix ?? []).map(c => [c.id, c.texte]))
        for (const c of [...(q.choix ?? []), ...(q.formes?.qcm_image?.choix ?? [])]) {
          // A reused choice depicts its answer, not every situation that asks about it.
          add(c.image, { labels: [c.texte ?? texts.get(c.id)] })
        }
      }
    }
  }
  for (const scene of read(root, 'src/tcf/association-image-themes.json', {}).sources ?? []) {
    const source = coSources.get(scene.exercise)
    if (!source) continue
    const support = source.support ?? {}, index = scene.dialogue - 1
    const text = Array.isArray(support.transcription) ? support.transcription[index] : support.transcription
    const audio = support.audios?.[index] ?? (index === 0 ? support.audio : undefined)
    if (audio !== scene.audio || text !== scene.transcription || createHash('sha256').update(text).digest('hex') !== scene.sourceSha256) continue
    associationScenes.add(scene.image)
    const levelTheme = source.niveau === 'A1-A2' ? 'CO CFR A2' : source.niveau === 'A0-A1' ? 'CO A1' : 'CO B1'
    add(scene.image, { types: ['Scénario'], themes: [levelTheme, 'Situations CO'], labels: [source.scene] })
  }
  for (const reuse of read(root, 'docs/gallery/co-cfr-a2-reuses-20261113.json', {}).reuses ?? []) {
    if (reuse.status !== 'visually_reviewed') continue
    const source = coSources.get(reuse.source_id)
    if (!source || source.niveau !== 'A1-A2') continue
    const support = source.support ?? {}, index = reuse.audio_index - 1
    const text = Array.isArray(support.transcription) ? support.transcription[index] : support.transcription
    const audio = support.audios?.[index] ?? (index === 0 ? support.audio : undefined)
    if (audio !== reuse.audio || typeof text !== 'string' || createHash('sha256').update(text).digest('hex') !== reuse.transcription_sha256) continue
    associationScenes.add(reuse.path)
    add(reuse.path, { types: ['Scénario'], labels: [reuse.label], themes: ['CO CFR A2', 'Situations CO'] })
  }
  return files.filter(file => !['docs/', 'scripts/', 'tmp/'].some(prefix => file.startsWith(prefix))).map(file => {
    const src = file.startsWith('public/') ? '/' + file.slice(7) : '/' + file
    const meta = metadata.get(src) ?? { labels: [], themes: [], types: [], keywords: [] }
    const stem = path.basename(file, path.extname(file)).replace(/^(?:extension573|co\d+|co-personnages-\d+|vocab)-/, '').replace(/-dessine[es]?$/, '')
    let label = meta.labels.find(Boolean) ?? pretty(stem)
    if (/^\d+$/.test(label) && file.includes('/logique/')) label = `${pretty(file.split('/logique/')[1].split('/')[0])} — ${label}`
    const collection = file.startsWith('docs/') || file.startsWith('scripts/') || file.startsWith('tmp/') ? 'Documentation et captures' : file.includes('/vocabulaire/') ? 'Vocabulaire' : file.includes('/tcf/') ? 'TCF' : file.includes('/gattegno/') ? 'Gattegno' : file.includes('/grammaire/') ? 'Grammaire' : file.includes('/logique/') ? 'Logique' : file.includes('/jeux/') || file.includes('/interactive/') ? 'Jeux et interactif' : 'Identité visuelle'
    let types = [...meta.types]
    if (/logo|favicon|icons?\.|react.svg|vite.svg/.test(file)) types = ['Illustration']
    else if (/\/logique\/|\/formes\/|\/couleurs\/|\/nombres-mesures\//.test(file)) types = ['Forme et symbole']
    else if (/\/actions\//.test(file)) types = ['Action']
    else if (/\/po\/|\/scenes\/|\/communication\//.test(file)) types.push('Scénario')
    else if (/ce-art|ce-documents/.test(file)) types.push('Document')
    else if (/\/bg\//.test(file)) types.push('Lieu et décor')
    else if (/\/metiers\//.test(norm(file))) {
      types.push('Personnage')
      if (!/^(?:etudiant|etudiante|eleve|retraite|retraitee|chomeur|chomeuse)$/.test(norm(label))) types.push('Métier')
    }
    else if (/personnage|portrait|famille|emotion/.test(norm(file))) types.push('Personnage')
    else if (/\/vocabulaire\/(?:ville|nature|pays|ciel-espace|orientation)\//.test(file)) types.push('Lieu et décor')
    else if (/\/vocabulaire\/(?:animaux[^/]*|oiseaux|insectes[^/]*)\//.test(file)) {
      const subject = norm(label)
      if (['ferme', 'chenil', 'ecurie', 'poulailler', 'zoo'].includes(subject)) types.push('Lieu et décor')
      else if (['niche', 'groin', 'nid', 'plume', 'laisse', 'collier', 'cage'].includes(subject)) types.push('Objet')
      else types.push('Animal')
    }
    else if (/\/vocabulaire\/(?:plantes|fruits[^/]*|legumes[^/]*)\//.test(file)) types.push('Végétal')
    else if (/\/vocabulaire\//.test(file) && !types.length) types.push('Objet')
    else if (/qcm-audit/.test(file) && !types.length) {
      const subject = norm(label)
      if (/\b(?:passeport|billet|carte bancaire|carte d|permis|convocation|diplome|affiche|formulaire|annonce)\b/.test(subject)) types.push('Document')
      else if (/\b(?:acheter|preparer|cuisiner|manger|boire|demander|telephoner|parler|ranger|reparer|chercher|attendre|payer|promener|faire du|faire de|se rendre|s inscrire)\b/.test(subject)) types.push('Scénario')
      else if (/\b(?:pantalon|robe|costume|canape|fauteuil|lit|armoire|chaise|table|velo|voiture|train|bus|avion|bateau|horloge|montre|sac|livre|romans?|bouteille|carafe|jus|tarte|glace|salade|chocolat|cafe|cacao|the|plante|fleur|telephone|cle|crayon|stylo|cahier|assiette|verre|guitare|pain|pomme|banane|casque|pompe|antivol|manteau|chaussure|parapluie|gant|lunette|lampe)\b/.test(subject)) types.push('Objet')
    }
    if (!types.length) types.push('Illustration')
    const classification = classifications.get(src)
    if (classification) {
      types = [...classification.types]
      if (classification.label) label = classification.label
    }
    if (associationScenes.has(src)) types.push('Scénario')
    types = types.filter(type => type !== 'Animal et végétal')
    if (!types.length) types.push('Illustration')
    if (/\/vocabulaire\/sante\//.test(file) && /^(?:allergie|blessure|brulure|coupure|douleur|fievre|fracture|grippe|infection|mal de tete|mal de ventre|malade|nausee|rhume|toux|vomissement|vertige)$/.test(norm(label))) types = ['Maladie']
    const origin = replacementSources.get(src) ?? src
    const sourcePaths = [file, origin, ...meta.keywords.filter(term => term.startsWith('/'))].join(' ')
    if (/\/logique\//.test(file)) types = ['Logique']
    else if (/\/pays\/|\/presenter\/(?!portrait-)|nationalit|drapeau/.test(norm(sourcePaths))) types = ['Pays et nationalité']
    else if (/\/corps\//.test(origin)) types = ['Partie du corps']
    else if (/(?:horloges?|cadrans?|pendules?|reveils?|clocks?|montres?)(?:[-_. /]|$)/.test(norm(file))) types = ['Heure et horloge']
    types = types.filter(type => !['Version antérieure', 'Logo et icône', 'Capture et référence'].includes(type))
    if (!types.length) types.push('Illustration')
    // A reviewed balloon bouquet is an object, even though "bouquet" can name flowers.
    if (!reviewedObjects.has(src)) types = gallerySubjectTypes({label, types, file, origin, themes: meta.themes})
    const themes = new Set(meta.themes)
    if (file.includes('/vocabulaire/')) themes.add(pretty(file.split('/vocabulaire/')[1].split('/')[0]))
    const subject = norm([label, ...meta.labels, ...meta.themes, file].join(' '))
    for (const [theme, rule] of RULES) if (rule.test(subject)) themes.add(theme)
    if (!themes.size) themes.add(collection === 'Documentation et captures' ? 'Documentation' : collection === 'Logique' ? 'Formes et logique' : 'Autres images')
    const audit = auditsByPath.get(src)
    if (audit?.status === 'visually_reviewed') {
      const actualHash = createHash('sha256').update(readFileSync(path.join(root, file))).digest('hex')
      if (actualHash !== audit.sha256) throw new Error(`L’image ${src} a changé depuis sa révision des mots-clés.`)
      if (typeof audit.visual_label !== 'string' || !Array.isArray(audit.visual_keywords) || audit.visual_keywords.some(keyword => typeof keyword !== 'string' || !keyword.trim())) {
        throw new Error(`La révision des mots-clés de ${src} doit contenir un titre et une liste de mots-clés valides.`)
      }
      label = audit.visual_label
    }
    const keywords = audit?.status === 'visually_reviewed'
      ? [...new Set(audit.visual_keywords)].join(' ')
      : [...new Set([...meta.labels, ...meta.keywords, pretty(stem)])].filter(Boolean).join(' ')
    return { id: file, src, label, themes: gallerySubjectThemes([...themes], types), types: [...new Set(types)], collection, keywords, bytes: statSync(path.join(root, file)).size }
  }).sort((a, b) => Number(/^(?:\d|[a-f\d]{12}$)/i.test(a.label)) - Number(/^(?:\d|[a-f\d]{12}$)/i.test(b.label)) || a.label.localeCompare(b.label, 'fr') || a.id.localeCompare(b.id))
}

export function generateImageGallery(root) {
  const images = buildGalleryCatalog(root)
  const out = path.join(root, 'src/gallery')
  mkdirSync(out, { recursive: true })
  const writeChanged = (file, value) => { if (!existsSync(file) || readFileSync(file, 'utf8') !== value) writeFileSync(file, value) }
  writeChanged(path.join(out, 'catalog.generated.json'), JSON.stringify(images) + '\n')
  const imports = images.filter(image => !image.id.startsWith('public/'))
  writeChanged(path.join(out, 'assets.generated.ts'), '// Generated by scripts/image-gallery-catalog.mjs.\n' + imports.map((image, i) => `import asset${i} from ${JSON.stringify('/' + image.id + '?url')}`).join('\n') + '\nexport const galleryAssetUrls: Record<string, string> = {\n' + imports.map((image, i) => `  ${JSON.stringify(image.id)}: asset${i},`).join('\n') + '\n}\n')
  const auditPath = path.join(root, 'docs/gallery/audit-mots-cles-tcf-20261117.json')
  const audit = read(root, 'docs/gallery/audit-mots-cles-tcf-20261117.json', null)
  if (audit) {
    const catalogByPath = new Map(images.map(image => [image.src, image]))
    const progress = { total: audit.images.length, visually_reviewed: 0, pending: 0, not_started: 0, by_collection: {} }
    for (const entry of audit.images) {
      if (!['not_started', 'pending', 'visually_reviewed'].includes(entry.status)) {
        throw new Error(`Statut d’audit invalide pour ${entry.path} : ${entry.status}`)
      }
      const current = catalogByPath.get(entry.path)
      if (!current) throw new Error(`Image absente du catalogue d’audit : ${entry.path}`)
      entry.current_label = current.label
      entry.current_keywords = current.keywords
      progress[entry.status] += 1
      progress.by_collection[entry.collection] = (progress.by_collection[entry.collection] ?? 0) + 1
    }
    audit.progress = progress
    writeChanged(auditPath, JSON.stringify(audit, null, 2) + '\n')
  }
  return images.length
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`${generateImageGallery(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'))} images indexées.`)
}
