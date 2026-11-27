import { fmt } from './column-arith'
import type { MathItem } from './types'

const assets = [
  ['crayons?', 'ecole-bureau/crayon', 'Crayons'],
  ['cahiers?', 'ecole-bureau/cahier', 'Cahiers'],
  ['livres?|romans?|bandes dessinées', 'ecole-bureau/livre', 'Livres'],
  ['stylos?', 'ecole-bureau/stylo', 'Stylos'],
  ['gommes?', 'ecole-bureau/gomme', 'Gommes'],
  ['feuilles?', 'ecole-bureau/feuille-de-papier', 'Feuilles'],
  ['pommes?', 'fruits/pomme', 'Pommes'],
  ['poires?', 'fruits/poire', 'Poires'],
  ['bananes?', 'fruits/banane', 'Bananes'],
  ['oranges?', 'fruits/orange', 'Oranges'],
  ['citrons?', 'fruits/citron', 'Citrons'],
  ['raisins?', 'fruits/raisin', 'Raisin'],
  ['carottes?', 'legumes/carotte', 'Carottes'],
  ['tomates?', 'legumes/tomate', 'Tomates'],
  ['salades?', 'legumes/salade', 'Salade'],
  ['sandwichs?', 'aliments/sandwich', 'Sandwich'],
  ['soupes?', 'aliments/soupe', 'Soupe'],
  ['glaces?', 'desserts/glace', 'Glaces'],
  ['pains?', 'aliments/pain', 'Pains'],
  ['croissants?', 'aliments/croissant', 'Croissants'],
  ['chocolats? chauds?', 'boissons/chocolat-chaud', 'Chocolat chaud'],
  ['jus de pomme', 'boissons/jus', 'Jus de pomme'],
  ['biscuits?', 'desserts/biscuit', 'Biscuits'],
  ['bonbons?', 'desserts/bonbon', 'Bonbons'],
  ['tartes?', 'desserts/tarte', 'Tarte'],
  ['bouteilles?', 'boissons/bouteille-deau', 'Bouteilles'],
  ['ballons?', 'sports/ballon', 'Ballons'],
  ['billes?', 'loisirs/bille', 'Billes'],
  ['lapins?', 'animaux-ferme-compagnie/lapin', 'Lapins'],
  ['poules?', 'animaux-ferme-compagnie/poule', 'Poules'],
  ['chaises?', 'maison/chaise', 'Chaises'],
  ['tables?', 'maison/table', 'Tables'],
  ['fleurs?', 'plantes/fleur', 'Fleurs'],
  ['arbres?', 'plantes/arbre', 'Arbres'],
  ['bus|autobus', 'transports/bus', 'Bus'],
  ['trains?', 'transports/train', 'Train'],
  ['camions?', 'transports/camion', 'Camion'],
  ['voitures?', 'transports/voiture', 'Voiture'],
  ['vélos?', 'transports/velo', 'Vélo'],
  ['billets? de banque|billets? de [0-9]+|francs?|CHF', 'argent-administration/billet-de-banque', 'Argent'],
  ['enveloppes?', 'argent-administration/enveloppe', 'Enveloppes'],
  ['piscines?', 'ville/piscine', 'Piscine'],
  ['sauts?', 'loisirs/corde-a-sauter', 'Sauts'],
  ['moutons?', 'animaux-ferme-compagnie/mouton', 'Moutons'],
  ['peluches?', 'loisirs/peluche', 'Peluches'],
  ['puzzles?', 'loisirs/puzzle', 'Puzzle'],
  ['paniers?', 'objets/panier', 'Panier'],
  ['drapeaux?', 'pays/drapeau', 'Drapeaux'],
  ['glaciers?', 'nature/glacier', 'Glacier'],
  ['montagnes?', 'nature/montagne', 'Montagnes'],
  ['boussoles?', 'voyage/boussole', 'Boussoles'],
  ['photos?|photographies?', 'loisirs/photo', 'Photos'],
  ['ascenseurs?', 'maison/ascenseur', 'Ascenseur'],
  ['écoles?|élèves?', 'ville/école', 'École'],
  ['chaussures?', 'vetements/chaussures', 'Chaussures'],
  ['tickets?', 'transports/ticket-de-bus', 'Tickets'],
  ['pages?', 'ecole-bureau/livre', 'Pages'],
  ['billets?(?! de banque| de [0-9]+)', 'loisirs/billets-de-spectacle', 'Billets'],
  ['chemins?', 'nature/sentier', 'Chemin'],
  ['choux?', 'legumes/chou', 'Choux'],
  ['boîtes?', 'objets/boîte', 'Boîtes'],
  ['papillons?', 'insectes-petites-betes/papillon', 'Papillons'],
  ['cartes?', 'loisirs/jeu-de-cartes', 'Cartes'],
  ['paquets?', 'objets/paquet', 'Paquets'],
  ['colliers?|perles?', 'accessoires/collier', 'Collier'],
  ['parkings?', 'ville/parking', 'Parking'],
  ['médailles?', 'sports/médaille', 'Médailles'],
  ['buts?', 'sports/ballon-de-football', 'Football'],
  ['omelettes?', 'aliments/omelette', 'Omelettes'],
  ['œufs?', 'aliments/œuf', 'Œufs'],
  ['albums?', 'loisirs/album', 'Album'],
  ['timbres?', 'argent-administration/timbre', 'Timbres'],
  ['bonnets?', 'vetements/bonnet', 'Bonnets'],
  ['chevaux?|cheval', 'animaux-ferme-compagnie/cheval', 'Chevaux'],
  ['souris', 'animaux-ferme-compagnie/souris', 'Souris'],
  ['immeubles?|appartements?', 'ville/immeuble', 'Immeuble'],
  ['cubes?', 'formes/cube', 'Cubes'],
  ['tulipes?', 'plantes/tulipe', 'Tulipes'],
  ['bouquets?', 'plantes/bouquet', 'Bouquets'],
  ['carrés?|carreaux', 'formes/carré', 'Carrés'],
  ['rectangles?', 'formes/rectangle', 'Rectangle'],
  ['enfants?', 'famille-personnes/enfant', 'Enfants'],
  ['blocs?', 'formes/cube', 'Blocs'],
  ['trajets?', 'nature/sentier', 'Trajet'],
] as const

const imageRoot = '/lib/images/vocabulaire/'
const numberPattern = String.raw`\d+(?:[,.]\d+)?`
const assetPatterns = assets.map(([noun, path, label]) => ({
  image: `${imageRoot}${path}.webp`,
  label,
  context: new RegExp(`(?<!\\p{L})(?:${noun})(?!\\p{L})`, 'iu'),
  quantity: new RegExp(`(${numberPattern})[ \\u202f]+((?:${noun}))(?!\\p{L})`, 'giu'),
  order: new RegExp(`(${noun})\\s*×\\s*(${numberPattern})`, 'giu'),
}))

export type ProblemAid = {
  pictures: Array<{ image: string; label: string; quantity?: string }>
  facts: Array<{ label: string; value: string }>
}

export function problemAid(item: MathItem): ProblemAid {
  const prompt = item.prompt ?? ''
  const pictures: ProblemAid['pictures'] = []
  const seen = new Set<string>()
  for (const asset of assetPatterns) {
    const direct = asset.label === 'Argent' ? [] : [...prompt.matchAll(asset.quantity)]
      .map((match) => ({ label: match[2]!, quantity: match[1]! }))
    const ordered = [...prompt.matchAll(asset.order)]
      .map((match) => ({ label: match[1]!, quantity: match[2]! }))
    const unique = new Map([...direct, ...ordered].map((row) => [`${row.quantity} ${row.label.toLowerCase()}`,row]))
    if (unique.size) {
      seen.add(asset.image)
      for (const row of unique.values()) pictures.push({ image: asset.image, ...row })
    }
  }
  for (const asset of assetPatterns) {
    if (!seen.has(asset.image) && asset.context.test(prompt)) {
      pictures.push({ image: asset.image, label: asset.label })
    }
  }
  const values = new Set(
    [...prompt.matchAll(new RegExp(numberPattern, 'g'))].map(match => Number(match[0].replace(',', '.'))),
  )
  const facts = (item.problemVarDefs ?? []).flatMap(({ key, label }) => {
    const value = item.problemVars?.[key]
    return value !== undefined && values.has(value) ? [{ label, value: fmt(value) }] : []
  })
  return { pictures: pictures.slice(0, 4), facts: facts.slice(0, 5) }
}

export function isMathProblemHelpType(typeId: string): boolean {
  return typeId.startsWith('problemes-') || typeId === 'proportion-problemes'
}
