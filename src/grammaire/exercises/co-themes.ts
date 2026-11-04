/** User-provided audio lots and their agreed grammar destinations. */
export const GRAMMAR_CO_THEMES = [
  {id:'presenter',label:'Se présenter',topic:'gram-se-presenter',subId:'a1',existing:true},
  {id:'famille',label:'Parler de sa famille',topic:'gram-se-presenter',subId:'famille',existing:true},
  {id:'fetes',label:'Fêtes',topic:'gram-temps',subId:'co-fetes'},
  {id:'logement',label:'Logement',topic:'gram-decrire',subId:'co-logement'},
  {id:'problemes-domestiques',label:'Problèmes domestiques',topic:'gram-demander',subId:'co-problemes-domestiques'},
  {id:'reglement-immeuble',label:'Règlement d’immeuble',topic:'gram-conseiller',subId:'co-reglement-immeuble'},
  {id:'universite-ecole',label:'Université-école',topic:'gram-activite',subId:'co-universite-ecole'},
  {id:'quotidien',label:'Quotidien',topic:'gram-present',subId:'co-quotidien'},
  {id:'travail',label:'Au travail',topic:'gram-decrire',subId:'co-travail'},
  {id:'magasin-vetements',label:'Magasin de vêtements',topic:'gram-demander',subId:'co-magasin-vetements'},
  {id:'restaurant',label:'Restaurant',topic:'gram-aliments',subId:'co-restaurant'},
  {id:'boulangerie',label:'À la boulangerie',topic:'gram-aliments',subId:'co-boulangerie'},
  {id:'medecin',label:'Chez le médecin',topic:'gram-conseiller',subId:'co-medecin'},
  {id:'pharmacie',label:'À la pharmacie',topic:'gram-conseiller',subId:'co-pharmacie'},
  {id:'se-deplacer',label:'Se déplacer',topic:'gram-espace',subId:'co-se-deplacer'},
  {id:'gare',label:'À la gare',topic:'gram-temps',subId:'co-gare'},
  {id:'aeroport',label:'À l’aéroport',topic:'gram-questions',subId:'co-aeroport'},
  {id:'hotel',label:'À l’hôtel',topic:'gram-demander',subId:'co-hotel'},
  {id:'sport',label:'Le sport',topic:'gram-activite',subId:'co-sport'},
  {id:'lieux-culturels',label:'Lieux culturels',topic:'gram-espace',subId:'co-lieux-culturels'},
] as const
export type GrammarCoThemeId = (typeof GRAMMAR_CO_THEMES)[number]['id']
export type GrammarCoLevel = 'A1' | 'A2'
export function grammarCoTypeId(subId: string): string {return `gram-ex-${subId}-co-theme`}
export function grammarCoThemeForType(typeId: string) {
  return GRAMMAR_CO_THEMES.find(theme=>grammarCoTypeId(theme.subId)===typeId||
    (theme.id==='presenter'&&typeId==='gram-ex-a1-co-audio')||
    (theme.id==='famille'&&typeId==='gram-ex-famille-fam-co'))
}
export function isGrammarCoType(typeId: string): boolean { return Boolean(grammarCoThemeForType(typeId)) }
export function normalizeGrammarCoBlock<T extends { exerciseType: string; grammarCoLevel?: GrammarCoLevel }>(block: T): T {
  const theme=grammarCoThemeForType(block.exerciseType)
  if (!theme || block.exerciseType===grammarCoTypeId(theme.subId)) return block
  return {...block,exerciseType:grammarCoTypeId(theme.subId),grammarCoLevel:block.grammarCoLevel??'A1'}
}
