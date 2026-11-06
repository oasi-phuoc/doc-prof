/** Illustrations choisies uniquement d’après le document, jamais d’après les réponses. */
export type CeIllustration = { src: string; label: string }
const image = (path: string, label: string): CeIllustration => ({ src: `/lib/images/vocabulaire/${path}.webp`, label })
const RULES: Array<{ words: RegExp; image: CeIllustration }> = [
  { words: /pique.nique/, image: image('loisirs/pique-nique', 'Pique-nique') },
  { words: /montagne|randonnee/, image: image('nature/montagne', 'Montagne') },
  { words: /chalet|hebergement/, image: image('maison/chalet', 'Chalet') },
  { words: /foret/, image: image('nature/forêt', 'Forêt') },
  { words: /fromag/, image: image('aliments/fromage', 'Fromage') },
  { words: /\bski\b/, image: image('sports/ski', 'Ski') },
  { words: /\bcamping\b|\btente\b/, image: image('loisirs/camping', 'Camping') },
  { words: /plage|baignade|\bmer\b/, image: image('nature/plage', 'Plage') },
  { words: /boulangerie/, image: image('ville/boulangerie', 'Boulangerie') },
  { words: /petit.dejeuner|cereales|pain grille/, image: image('aliments/petit-dejeuner', 'Petit-déjeuner') },
  { words: /pharmaci|medicament/, image: image('ville/pharmacie', 'Pharmacie') },
  { words: /cafeteria|pause.cafe|croissant|\bcafe\b/, image: image('boissons/café', 'Café') },
  { words: /clinique|hopital|radiologie|urgences/, image: image('ville/hopital', 'Hôpital') },
  { words: /medecin|docteur|dentiste/, image: image('metiers/médecin', 'Médecin') },
  { words: /dejeuner|restaurant|diner|repas/, image: image('ville/restaurant', 'Restaurant') },
  { words: /\btrain|\bgare|ferroviaire/, image: image('transports/train', 'Train') },
  { words: /\bbus\b|autobus|arret/, image: image('transports/bus', 'Bus') },
  { words: /avion|aeroport|\bvol\b/, image: image('transports/avion', 'Avion') },
  { words: /velo|bicyclette/, image: image('transports/vélo', 'Vélo') },
  { words: /ecole|classe|professeur|eleve/, image: image('ville/école', 'École') },
  { words: /livre|lecture|bibliotheque/, image: image('ecole-bureau/livre', 'Livre') },
  { words: /television|telejournal|emission|chaine/, image: image('technologie/télévision', 'Télévision') },
  { words: /cinema|\bfilm|seance/, image: image('ville/cinema', 'Cinéma') },
  { words: /piscine|natation|nager/, image: image('ville/piscine', 'Piscine') },
  { words: /anniversaire|invitation|\bfete/, image: image('temps-calendrier/anniversaire', 'Fête') },
  { words: /entreprise|bureau|reunion|atelier|directeur/, image: image('ecole-bureau/bureau', 'Bureau') },
  { words: /magasin|supermarche|achat|courses/, image: image('ville/magasin', 'Magasin') },
  { words: /\bparc\b|jardin|promenade/, image: image('ville/parc', 'Parc') },
  { words: /telephone|appeler|\bappels?\b/, image: image('technologie/téléphone', 'Téléphone') },
]
const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
export function ceIllustrationsFor(text: string): CeIllustration[] {
  const normalized = normalize(text).replace(/\ben train de\b/g, '')
  const matches = RULES.flatMap((rule) => {
    const match = rule.words.exec(normalized)
    return match ? [{ image: rule.image, index: match.index }] : []
  }).sort((a, b) => a.index - b.index)
  return matches.filter((entry, i) => matches.findIndex((other) => other.image.src === entry.image.src) === i).map((entry) => entry.image)
}
export function ceIllustrationFor(text: string): CeIllustration | undefined {
  return ceIllustrationsFor(text)[0]
}

/** Découpe sans réécriture : toutes les phrases, dates et informations sont conservées. */
export function ceIllustratedPassages(text: string, context = '', maxBlockLength = 340): Array<{ text: string; illustration?: CeIllustration }> {
  const paragraphs = text.split(/\n\s*\n/).filter((part) => part.trim())
  const parts = paragraphs.flatMap((part) => {
    if (part.length <= maxBlockLength) return [part]
    const lines = part.split(/\n|(?<=[.!?])\s+(?=[A-ZÀ-Ÿ])/u)
    const groups: string[] = []
    for (const line of lines) {
      if (!groups.length || groups[groups.length - 1].length + line.length > Math.max(120, maxBlockLength - 60)) groups.push(line)
      else groups[groups.length - 1] += `\n${line}`
    }
    return groups.filter((group) => group.trim())
  })
  const seen = new Set<string>()
  return parts.map((part, index) => {
    const candidate = ceIllustrationFor(part) ?? (index === 0 ? ceIllustrationFor(`${context} ${text}`) ?? image('argent-administration/enveloppe', 'Message') : undefined)
    const illustration = candidate && !seen.has(candidate.src) && seen.size < 3 ? candidate : undefined
    if (illustration) seen.add(illustration.src)
    return { text: part, illustration }
  })
}
