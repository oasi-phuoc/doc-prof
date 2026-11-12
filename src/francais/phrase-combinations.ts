import { SIMPLE_FRAMES_ER, SIMPLE_FRAMES_AUTRES } from './phrase-simple-frames'
import { REFLEXIVE_FRAMES_ER, REFLEXIVE_FRAMES_AUTRES } from './phrase-reflexive-frames'
import { themedFramesFor, type PhraseContext, type ThemedFrame } from './phrase-theme-frames'
import { affirmativePhraseTheme, type PhraseThemeId } from './phrase-themes'
import { REVIEWED_ADJECTIVE_PREPOSITIONS, REVIEWED_ADJECTIVES } from './phrase-reviewed-corpus'
import { coherentRightActions, coordinatedFrames } from './phrase-coordinations'
import { isDurationComplement } from './phrase-complements'

/** Bits follow the settings order: adverb, preposition, conjunction, adjective. */
export const COMBINATION_CATEGORIES = ['adverbe', 'preposition', 'conjonction', 'adjectif'] as const
export function phraseContextMask(context: PhraseContext): number {
  const text = context.pred + ' ' + (context.rightPred ?? '')
  return COMBINATION_CATEGORIES.reduce((mask, category, bit) => {
    const present = category === 'conjonction' ? context.rightPred != null : text.includes('/' + category)
    return present ? mask | (1 << bit) : mask
  }, 0)
}
export function combinationQuota(mask: number): number {
  return mask === 0 || (mask & (mask - 1)) === 0 ? 100 : 50
}

type Entry = PhraseContext & { id: string; mask: number }

/** Postnominal adjectives, explicitly agreed with the noun they qualify. */
const NOUN_ADJECTIVES: Record<string,
   string> = {
  mains:'sales',
  visage:'sensible',
  cheveux:'mouillés',
  bras:'fatigués',
  pieds:'froids',
  cou:'sensible',
  jambes:'fatiguées',
  nuque:'sensible',
  dents:'blanches',
  ongles:'longs',
  barbe:'longue',
  frange:'longue',
  boucles:'blondes',
  menton:'sensible',
  joues:'roses',
  moustache:'fine',
  crâne:'sensible',
  dos:'mouillé',
  yeux:'fatigués',
  oreilles:'sensibles',
  tête:'fragile',
  peau:'sèche',
  lèvres:'rouges',
  paupières:'fragiles',
  doigts:'raides',

  café:'chaud',
  thé:'vert',
  soupe:'chaude',
  jus:'frais',
  salade:'verte',
  dessert:'sucré',
  pain:'frais',
  riz:'chaud',
  fromage:'frais',
  pâtes:'chaudes',
  veste:'neuve',
  manteau:'chaud',
  pull:'bleu',
  écharpe:'rouge',
  chapeau:'noir',
  gants:'chauds',
  bottes:'neuves',
  chemise:'blanche',
  tablier:'propre',
  lunettes:'rondes',
  livre:'illustré',
  film:'amusant',
  place:'libre',
  métier:'intéressant',
  robe:'bleue',
  vélo:'neuf',
  cahier:'rouge',
  sac:'léger',
  voyage:'organisé',
  parfum:'léger',
  montre:'neuve',
  repas:'chaud',
  sandwich:'chaud',
  omelette:'chaude',
  gâteau:'sucré',

  maison:'spacieuse',
  village:'calme',
  appartement:'lumineux',
  jardin:'fleuri',
  cour:'ombragée',
  ami:'fidèle',
  amie:'fidèle',
  classe:'calme',
  école:'voisine',
  parc:'ombragé',
  rue:'étroite',
  gare:'centrale',
  bureau:'rangé',
  salon:'lumineux',
  chambre:'spacieuse',
  table:'ronde',
  fenêtre:'ouverte',
  porte:'fermée',
  fauteuil:'confortable',
  banc:'libre',
  lac:'calme',
  rivière:'calme',
  mer:'calme',
  fontaine:'ancienne',
  train:'rapide',
  bus:'rouge',
  voiture:'neuve',
  musée:'municipal',
  poste:'centrale',
  boulangerie:'voisine',
  médecin:'attentif',
  frère:'cadet',
  sœur:'cadette',
  voisin:'discret',
  voisine:'discrète',
  chien:'calme',
  chat:'gris',
  ballon:'rouge',
  ballons:'rouges',
  balles:'jaunes',
  carte:'routière',
  dictionnaire:'illustré',
  outils:'solides',
  serviette:'propre',
  savon:'parfumé',
  crème:'douce',
  miroir:'rond',
  peigne:'fin',
  ciseaux:'pointus',
  couverture:'chaude',
  feu:'vif',
  fleurs:'fraîches',
  plantes:'vertes',
  arbre:'immense',
  arbres:'immenses',
  route:'étroite',
  terrain:'plat',
  stade:'municipal',
  piscine:'municipale',
  bibliothèque:'municipale',
  cantine:'scolaire',
  cuisine:'spacieuse',
  montagne:'enneigée',
  plage:'déserte',
  marché:'couvert',
  magasin:'voisin',
  caféteria:'voisine',
  restaurant:'italien',
  pomme:'rouge',
  pommes:'rouges',
  lettre:'courte',
  lettres:'courtes',
  journal:'local',
  roman:'policier',
  texte:'court',
  phrase:'courte',
  photo:'ancienne',
  photos:'anciennes',
  chanson:'douce',
  musique:'douce',
  filmographie:'complète',
  cadeau:'précieux',
  jeu:'amusant',
  livres:'illustrés',
  quartier:'calme',
  chemin:'étroit',
  sentier:'étroit',
  pont:'ancien',
  bateau:'blanc',
  travail:'minutieux',
  problème:'difficile',
  devoir:'difficile',
  leçon:'nouvelle',
  cours:'intéressant',
  réunion:'importante',
  spectacle:'amusant',
  fête:'familiale',
  visite:'guidée',
  promenade:'agréable',
  pause:'courte',
  départ:'imminent',
  retour:'tardif',
  vacances:'scolaires',
  'rendez-vous':'important',
  guichet:'central',
  sortie:'principale',
  accueil:'chaleureux',
  secrétariat:'central',
  abri:'solide',
  club:'sportif',
  cérémonie:'officielle',
  anniversaire:'familial',
  lecture:'silencieuse',
  marche:'quotidienne',
  sport:'collectif',
  randonnée:'facile',
  réveil:'bruyant',
  sonnerie:'bruyante',
  bord:'glissant',
  soleil:'brûlant',
  pluie:'fine',
  casque:'solide',
  numéro:'exact',
  calcul:'compliqué',
  dessin:'coloré',
  cabane:'solide',
  placard:'étroit',
  branche:'basse',
  conseils:'utiles',
  médicaments:'prescrits',
  horaires:'précis',
  animaux:'sauvages',
  poignets:'raides',
  mèche:'rebelle',
  tempes:'douloureuses',
  front:'humide',
  épaules:'dénudées',
  cuisses:'mouillées',
  genoux:'sales',
  aisselles:'sensibles',
  sourcils:'épais',
  billet:'numéroté',
  soirée:'tranquille',
  moment:'calme',
  journée:'libre',
  'week-end':'prolongé',
  pantalon:'confortable',
  jupe:'longue',
  sandales:'légères',
  manuel:'scolaire',
  calculatrice:'solaire',
  règle:'graduée',
  stylo:'bleu',
  talent:'musical',
  passion:'nouvelle',
  don:'artistique',
  vocation:'artistique',
  intérêt:'nouveau',
  aptitude:'nouvelle',
  étagère:'solide',
  costume:'élégant',
  tisane:'parfumée',
  gratin:'doré',
  quiche:'salée',
  curry:'épicé',
  risotto:'crémeux',
  tabouret:'bas',
  coffre:'solide',
  bonnet:'chaud',
  chaussettes:'épaisses',
  gilet:'chaud',
  bouillon:'chaud',
  crêpe:'fine',
  compote:'tiède',
  limonade:'fraîche',
  casquette:'verte',
  baskets:'neuves',
  cravate:'bleue',
  ceinture:'noire',
  guitare:'acoustique',
  violon:'ancien',
  caméra:'numérique',
  puzzle:'complexe',
  instrument:'neuf',
  abonnement:'annuel',
  vinaigrette:'maison',
  smoothie:'fruité',

}
function withAdjective(pred: string, id: string): string | undefined {
  const parts = pred.split(' ')
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i]!
    if (!part.endsWith('/nom')) continue
    const noun = part.slice(0, -4)
    if (isDurationComplement(id,noun)) continue
    const adjective = id === 'se sécher' && noun === 'mains' ? 'mouillées'
      : id === 'se sécher' && ['visage','bras','pieds','jambes','nuque'].includes(noun) ? ({visage:'mouillé',bras:'mouillés',pieds:'mouillés',jambes:'mouillées',nuque:'mouillée'} as Record<string,string>)[noun]
      : id === 'se réchauffer' && ['bras','jambes'].includes(noun) ? (noun === 'bras' ? 'froids' : 'froides')
      : NOUN_ADJECTIVES[noun]
    if (adjective) { parts.splice(i + 1, 0, adjective + '/adjectif'); return parts.join(' ') }
  }
  return undefined
}
function unique(entries: readonly Entry[]): Entry[] {
  return [...new Map(entries.map(entry => [JSON.stringify([entry.id,entry.pred,entry.rightId,entry.rightPred]),entry])).values()]
}
/** Round-robin across verbs before taking another context of the same verb. */
function balanced(entries: readonly Entry[], count: number): Entry[] {
  const groups = new Map<string, Entry[]>()
  for (const entry of unique(entries)) { const group = groups.get(entry.id) ?? []; group.push(entry); groups.set(entry.id,group) }
  const result: Entry[] = []
  for (let round = 0; result.length < count; round++) {
    let added = false
    for (const group of groups.values()) if (group[round]) { result.push(group[round]!); added = true; if (result.length === count) break }
    if (!added) throw new Error(`Gattegno : ${result.length} constructions, ${count} attendues`)
  }
  return result
}
function flatten(frames: readonly ThemedFrame[]): Entry[] {
  return frames.flatMap(frame => frame.preds.map(pred => ({id:frame.id,pred,mask:phraseContextMask({pred})})))
}
function compile(group: 'er' | 'autres', reflexive: boolean): readonly Entry[] {
  const simpleFrames = reflexive
    ? group === 'er' ? REFLEXIVE_FRAMES_ER : REFLEXIVE_FRAMES_AUTRES
    : group === 'er' ? SIMPLE_FRAMES_ER : SIMPLE_FRAMES_AUTRES
  const simple = flatten(simpleFrames).filter(entry => entry.mask === 0)
  const prep = flatten(reflexive ? simpleFrames : themedFramesFor('phrase-preposition',group)).filter(entry => entry.mask === 2)
  const adjectives = reflexive ? [] : flatten(themedFramesFor('phrase-adjectif',group)).filter(entry => entry.mask === 8 && entry.id !== 'être')
  const enrich = (entries: readonly Entry[]) => entries.flatMap(entry => {
    const pred = withAdjective(entry.pred, entry.id)
    return pred ? [{...entry,pred,mask:entry.mask|8}] : []
  })
  const reviewedForBank = (entries: typeof REVIEWED_ADJECTIVES) => entries
    .filter(entry => simpleFrames.some(frame => frame.id === entry.id))
    .map(entry => ({ ...entry, mask: phraseContextMask(entry) }))
  const sources = new Map<number, readonly Entry[]>([[0,simple],[2,prep],
    [8,unique([...adjectives,...(reflexive ? enrich(simple) : reviewedForBank(REVIEWED_ADJECTIVES))])],
    [10,reflexive ? enrich(prep) : reviewedForBank(REVIEWED_ADJECTIVE_PREPOSITIONS)]])
  const result: Entry[] = []
  for (let mask=0;mask<16;mask++) {
    const eligible = sources.get(mask & 10)!.filter(entry => !(mask & 4) || coherentRightActions(entry.id,entry.pred).length > 0)
    let base: Entry[]
    try { base = balanced(eligible,combinationQuota(mask)) }
    catch (error) { throw new Error(`${group}/${reflexive ? 'pronominal' : 'régulier'}/masque ${mask}`, { cause: error }) }
    for (const [index,entry] of base.entries()) {
      let pred = entry.pred
      if (mask & 1) {
        const adverb = entry.id === 'se découvrir' ? 'enfin'
          : entry.id === 'se choisir' ? 'enfin'
          : ['aimer','adorer','détester','préférer','connaître','vouloir'].includes(entry.id)
          ? 'vraiment' : entry.id === 'avoir' ? 'déjà' : ['souvent','parfois','régulièrement'][index%3]!
        pred = pred.replace('/verbe', `/verbe ${adverb}/adverbe`)
      }
      const rights = mask & 4 ? coherentRightActions(entry.id,entry.pred) : []
      const right = rights.length ? rights[index % rights.length] : undefined
      if ((mask & 4) && !right) throw new Error('Gattegno : second verbe distinct manquant')
      result.push({ id:entry.id,pred,mask,...(right?{rightId:right.id,rightPred:right.pred}:{}) })
    }
  }
  return result
}
const BANKS = {
  er: { regular:compile('er',false), reflexive:compile('er',true) },
  autres: { regular:compile('autres',false), reflexive:compile('autres',true) },
}
export function combinationContexts(theme: PhraseThemeId, group: 'er' | 'autres'): readonly Entry[] {
  return BANKS[group][affirmativePhraseTheme(theme)==='phrase-pronominaux'?'reflexive':'regular']
}

/** Add the quota banks without discarding any existing construction. */
export function combinationFrames(theme: PhraseThemeId, group: 'er' | 'autres', original: readonly ThemedFrame[]): readonly ThemedFrame[] {
  const contexts = new Map<string, PhraseContext[]>()
  for (const entry of combinationContexts(theme,group)) { const list=contexts.get(entry.id)??[]; list.push(entry); contexts.set(entry.id,list) }
  const frames = new Map(original.map(frame=>[frame.id,frame]))
  if (affirmativePhraseTheme(theme) === 'phrase-pronominaux') {
    const coordinated = coordinatedFrames(original.map(frame => ({ ...frame, preds:frame.preds.filter(pred => phraseContextMask({pred}) === 0) })))
    for (const frame of coordinated) {
      const previous = frames.get(frame.id)!
      frames.set(frame.id,{...previous,contexts:[...previous.preds.map(pred=>({pred})),...frame.contexts!]})
    }
  }
  for (const [id,added] of contexts) {
    const old = frames.get(id)
    const existing: readonly PhraseContext[] = old?.contexts ?? (old ? old.preds.flatMap(pred => old.rightPreds ? old.rightPreds.map(rightPred=>({pred,rightId:old.rightId,rightPred})) : [{pred}]) : [])
    const merged = [...new Map([...existing,...added].map(context=>[JSON.stringify([context.pred,context.rightId,context.rightPred]),context])).values()]
    frames.set(id,{id,preds:[...new Set(merged.map(context=>context.pred))],contexts:merged})
  }
  return [...frames.values()]
}
