/**
 * Résout un chemin d’image Jeux en préférant la médiathèque /lib
 * (souvent déjà déployée) puis la banque lecture.
 */
const LIB_BY_LABEL: Record<string, string> = {
  abricot: '/lib/images/vocabulaire/nourriture/abricot.webp',
  ail: '/lib/images/vocabulaire/nourriture/ail.webp',
  ananas: '/lib/images/vocabulaire/nourriture/ananas.webp',
  asperge: '/lib/images/vocabulaire/nourriture/asperge.webp',
  aubergine: '/lib/images/vocabulaire/nourriture/aubergine.webp',
  avocat: '/lib/images/vocabulaire/nourriture/avocat.webp',
  banane: '/lib/images/vocabulaire/nourriture/banane.webp',
  betterave: '/lib/images/vocabulaire/nourriture/betterave.webp',
  beurre: '/lib/images/vocabulaire/nourriture/beurre.webp',
  brocoli: '/lib/images/vocabulaire/nourriture/brocoli.webp',
  carotte: '/lib/images/vocabulaire/nourriture/carotte.webp',
  cerise: '/lib/images/vocabulaire/nourriture/cerise.webp',
  champignon: '/lib/images/vocabulaire/nourriture/champignon.webp',
  citron: '/lib/images/vocabulaire/nourriture/citron.webp',
  concombre: '/lib/images/vocabulaire/nourriture/concombre.webp',
  confiture: '/lib/images/vocabulaire/nourriture/confiture.webp',
  farine: '/lib/images/vocabulaire/nourriture/farine.webp',
  figue: '/lib/images/vocabulaire/nourriture/figue.webp',
  fraise: '/lib/images/vocabulaire/nourriture/fraise.webp',
  framboise: '/lib/images/vocabulaire/nourriture/framboise.webp',
  fromage: '/lib/images/vocabulaire/nourriture/fromage.webp',
  fruit: '/lib/images/vocabulaire/nourriture/fruit.webp',
  lait: '/lib/images/vocabulaire/nourriture/lait.webp',
  oignon: '/lib/images/vocabulaire/nourriture/oignon.webp',
  orange: '/lib/images/vocabulaire/nourriture/orange.webp',
  pain: '/lib/images/vocabulaire/nourriture/pain.webp',
  poisson: '/lib/images/vocabulaire/nourriture/poisson.webp',
  pomme: '/lib/images/vocabulaire/nourriture/pomme.webp',
  poulet: '/lib/images/vocabulaire/nourriture/poulet.webp',
  raisin: '/lib/images/vocabulaire/nourriture/raisin.webp',
  riz: '/lib/images/vocabulaire/nourriture/riz.webp',
  salade: '/lib/images/vocabulaire/nourriture/salade.webp',
  soupe: '/lib/images/vocabulaire/nourriture/soupe.webp',
  tomate: '/lib/images/vocabulaire/nourriture/tomate.webp',
  yaourt: '/lib/images/vocabulaire/nourriture/yaourt.webp',
  'échalote': '/lib/images/vocabulaire/nourriture/échalote.webp',
  'épinard': '/lib/images/vocabulaire/nourriture/épinard.webp',
  eau: '/lib/images/vocabulaire/nourriture/eau.webp',
  chocolat: '/lib/images/vocabulaire/nourriture/chocolat.webp',
  courgette: '/lib/images/vocabulaire/nourriture/courgette.webp',
  chou: '/lib/images/vocabulaire/nourriture/chou.webp',
  boite: '/lib/images/vocabulaire/objets/boîte.webp',
  'boîte': '/lib/images/vocabulaire/objets/boîte.webp',
  bouteille: '/lib/images/vocabulaire/objets/bouteille.webp',
  chat: '/lib/images/vocabulaire/animaux/chat.webp',
  chien: '/lib/images/vocabulaire/animaux/chien.webp',
  oiseau: '/lib/images/vocabulaire/animaux/oiseau.webp',
  cheval: '/lib/images/vocabulaire/animaux/cheval.webp',
  vache: '/lib/images/vocabulaire/animaux/vache.webp',
  mouton: '/lib/images/vocabulaire/animaux/mouton.webp',
  livre: '/lib/images/vocabulaire/loisirs/livre.webp',
  cahier: '/lib/images/vocabulaire/ecole/cahier.webp',
  crayon: '/lib/images/vocabulaire/ecole/crayon.webp',
  maison: '/lib/images/vocabulaire/logement/maison.webp',
  chaise: '/lib/images/vocabulaire/logement/chaise.webp',
  porte: '/lib/images/vocabulaire/objets/porte.webp',
  'fenêtre': '/lib/images/vocabulaire/logement/fenêtre.webp',
  table: '/lib/images/vocabulaire/logement/table.webp',
  lampe: '/lib/images/vocabulaire/objets/lampe.webp',
  soleil: '/lib/images/vocabulaire/nature/soleil.webp',
  arbre: '/lib/images/vocabulaire/nature/arbre.webp',
  fleur: '/lib/images/vocabulaire/nature/fleur.webp',
  'vélo': '/lib/images/vocabulaire/transports/vélo.webp',
  bus: '/lib/images/vocabulaire/transports/bus.webp',
}

function lecturePath(label: string): string {
  return `/assets/words/lecture/${label}.webp`
}

/** Chemin image pour un libellé : /lib d’abord, sinon lecture. */
export function resolveGameImageSrc(label: string, fallback?: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return fallback
  if (fallback?.startsWith('data:') || fallback?.startsWith('blob:')) return fallback
  if (fallback?.startsWith('/lib/')) return fallback
  return LIB_BY_LABEL[key] ?? fallback ?? lecturePath(label.trim())
}
