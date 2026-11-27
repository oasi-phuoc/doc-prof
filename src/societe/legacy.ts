const oldUnits: Record<string, string> = {
  situation: 'voisins',
  reperes: 'langues',
  regions: 'paysages',
  'cantons-1': 'cantons',
  'cantons-2': 'cantons',
  eaux: 'eaux',
  dates: 'histoire',
  etat: 'pouvoirs',
  democratie: 'participer',
  federalisme: 'pouvoirs',
  pouvoirs: 'pouvoirs',
  droits: 'participer',
}

const oldExercises: Record<string, string> = {
  cantons: 'cantons',
  'chefs-lieux': 'cantons',
  sigles: 'cantons',
  'serie-2': 'cantons',
  villes: 'cantons',
  lacs: 'eaux',
  'cours-eau': 'eaux',
  regions: 'paysages',
  dates: 'histoire',
  resume: 'voisins',
  pouvoirs: 'pouvoirs',
  competences: 'pouvoirs',
  devoirs: 'participer',
  democratie: 'participer',
}

/** Remplace la recette d’une fiche de l’ancien catalogue par le sujet correspondant. */
export function normalizeSocieteBlock<T extends { topic: string; exerciseType: string }>(block: T): T {
  const match = /^societe-suisse-(theorie|ex)-(.+)$/.exec(block.exerciseType)
  if (!match) return block
  const [, ancienType, motif] = match
  const theorie = ancienType === 'theorie'
  const unite = (theorie ? oldUnits : oldExercises)[motif] ?? 'voisins'
  const topic = `societe-${unite}`
  return { ...block, topic, exerciseType: `${topic}-${theorie ? 'theorie' : 'ce'}` }
}
