import type { ThemedFrame } from './phrase-theme-frames'
import { REFLEXIVE_SUPPLEMENT_ER, REFLEXIVE_SUPPLEMENT_AUTRES } from './phrase-reflexive-supplement'
import { REVIEWED_REFLEXIVES } from './phrase-reviewed-reflexives'
import { mergeReviewedFrames } from './phrase-reviewed-corpus'
import { phraseVerbGroupOf } from './phrase-verb-groups'

/** Complete simple variants, without adverbs, prepositions, conjunctions or adjectives. */
const SIMPLE_COMPLEMENTS: Record<string, readonly string[]> = {
  'se coiffer': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
  's’habiller': ['le/determinant matin/nom', 'chaque/determinant jour/nom'],
  'se déshabiller': ['le/determinant soir/nom', 'chaque/determinant soir/nom'],
  'se lever': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
  'se coucher': ['le/determinant soir/nom', 'chaque/determinant soir/nom'],
  'se réveiller': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
  'se préparer': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
  'se reposer': ['le/determinant dimanche/nom', 'chaque/determinant dimanche/nom'],
  'se promener': ['le/determinant dimanche/nom', 'chaque/determinant soir/nom'],
  'se dépêcher': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
  's’entraîner': ['le/determinant samedi/nom', 'chaque/determinant semaine/nom'],
  's’amuser': ['le/determinant dimanche/nom', 'chaque/determinant soir/nom'],
  'se baigner': ['le/determinant dimanche/nom', 'chaque/determinant été/nom'],
  'se réchauffer': ['les/determinant mains/nom', 'les/determinant pieds/nom'],
  'se changer': ['le/determinant soir/nom', 'chaque/determinant soir/nom'],
  'se rafraîchir': ['le/determinant visage/nom', 'les/determinant mains/nom'],
  's’endormir': ['le/determinant soir/nom', 'chaque/determinant soir/nom'],
  'se détendre': ['le/determinant dimanche/nom', 'chaque/determinant soir/nom'],
  'se taire': ['quelques/determinant instants/nom', 'un/determinant moment/nom'],
  's’asseoir': ['quelques/determinant minutes/nom', 'un/determinant moment/nom'],
  'se vêtir': ['le/determinant matin/nom', 'chaque/determinant matin/nom'],
}

/** Every entry is a distinct reflexive construction with reviewed complete contexts. */
function frame(id: string, core: string, complements: readonly string[]): ThemedFrame {
  const prefix = /^[aeiouhéèêàâîôûœ]/i.test(core) ? 's’' : 'se_'
  const variants = [...new Set([...complements, ...(SIMPLE_COMPLEMENTS[id] ?? [])])]
  return { id, preds: variants.map(complement => `${prefix}${core}/verbe ${complement}`) }
}

const BASE_REFLEXIVE_FRAMES_ER: readonly ThemedFrame[] = [
  frame('se laver', 'lave', ['les/determinant mains/nom', 'le/determinant visage/nom', 'les/determinant cheveux/nom']),
  frame('se brosser', 'brosse', ['les/determinant dents/nom', 'les/determinant cheveux/nom', 'les/determinant ongles/nom']),
  frame('se coiffer', 'coiffe', ['devant/preposition le/determinant miroir/nom', 'avec/preposition un/determinant peigne/nom', 'avant/preposition le/determinant départ/nom']),
  frame('s’habiller', 'habille', ['dans/preposition la/determinant chambre/nom', 'pour/preposition la/determinant fête/nom', 'chaudement/adverbe']),
  frame('se déshabiller', 'déshabille', ['dans/preposition la/determinant cabine/nom', 'avant/preposition la/determinant douche/nom', 'lentement/adverbe']),
  frame('se lever', 'lève', ['à/preposition sept/determinant heures/nom', 'avec/preposition le/determinant soleil/nom', 'tôt/adverbe']),
  frame('se coucher', 'couche', ['après/preposition le/determinant repas/nom', 'à/preposition vingt-deux/determinant heures/nom', 'tôt/adverbe']),
  frame('se réveiller', 'réveille', ['avec/preposition le/determinant réveil/nom', 'avant/preposition la/determinant sonnerie/nom', 'doucement/adverbe']),
  frame('se préparer', 'prépare', ['pour/preposition le/determinant cours/nom', 'pour/preposition la/determinant randonnée/nom', 'avant/preposition la/determinant réunion/nom']),
  frame('se reposer', 'repose', ['après/preposition le/determinant travail/nom', 'dans/preposition le/determinant salon/nom', 'pendant/preposition la/determinant pause/nom']),
  frame('se promener', 'promène', ['dans/preposition le/determinant parc/nom', 'près_du/preposition lac/nom', 'avec/preposition un/determinant ami/nom']),
  frame('se dépêcher', 'dépêche', ['avant/preposition le/determinant départ/nom', 'dans/preposition le/determinant couloir/nom', 'pour/preposition le/determinant rendez-vous/nom']),
  frame('s’arrêter', 'arrête', ['devant/preposition la/determinant poste/nom', 'à/preposition la/determinant boulangerie/nom', 'près_de/preposition la/determinant fontaine/nom']),
  frame('s’installer', 'installe', ['dans/preposition le/determinant fauteuil/nom', 'près_de/preposition la/determinant fenêtre/nom', 'à/preposition côté/nom du/preposition bureau/nom']),
  frame('se présenter', 'présente', ['au/preposition groupe/nom', 'à/preposition la/determinant réception/nom', 'devant/preposition la/determinant classe/nom']),
  frame('s’entraîner', 'entraîne', ['au/preposition stade/nom', 'avec/preposition un/determinant ballon/nom', 'chaque/determinant semaine/nom']),
  frame('s’amuser', 'amuse', ['avec/preposition les/determinant enfants/nom', 'pendant/preposition la/determinant fête/nom', 'dans/preposition le/determinant jardin/nom']),
  frame('se baigner', 'baigne', ['dans/preposition le/determinant lac/nom', 'dans/preposition la/determinant mer/nom', 'près_du/preposition rivage/nom']),
  frame('se doucher', 'douche', ['après/preposition le/determinant sport/nom', 'avant/preposition le/determinant repas/nom', 'le/determinant matin/nom']),
  frame('s’occuper', 'occupe', ['du/preposition jardin/nom', 'des/preposition plantes/nom', 'de/preposition son/determinant chien/nom']),
  frame('se rappeler', 'rappelle', ['la/determinant date/nom du/preposition rendez-vous/nom', 'la/determinant consigne/nom', 'les/determinant vacances/nom']),
  frame('se tromper', 'trompe', ['de/preposition numéro/nom', 'de/preposition chemin/nom', 'dans/preposition le/determinant calcul/nom']),
  frame('se cacher', 'cache', ['derrière/preposition un/determinant arbre/nom', 'sous/preposition la/determinant table/nom', 'dans/preposition la/determinant cabane/nom']),
  frame('se pencher', 'penche', ['vers/preposition la/determinant fenêtre/nom', 'sur/preposition le/determinant dessin/nom', 'avec/preposition prudence/nom']),
  frame('s’éloigner', 'éloigne', ['du/preposition bord/nom', 'de/preposition la/determinant route/nom', 'lentement/adverbe']),
  frame('s’approcher', 'approche', ['de/preposition la/determinant porte/nom', 'du/preposition tableau/nom', 'du/preposition guichet/nom']),
  frame('s’inquiéter', 'inquiète', ['pour/preposition son/determinant frère/nom', 'pour/preposition sa/determinant voisine/nom', 'du/preposition retard/nom']),
  frame('s’intéresser', 'intéresse', ['à/preposition la/determinant musique/nom', 'aux/preposition animaux/nom', 'au/preposition jardinage/nom']),
  frame('s’organiser', 'organise', ['pour/preposition les/determinant vacances/nom', 'avec/preposition ses/determinant collègues/nom', 'avant/preposition le/determinant voyage/nom']),
  frame('se renseigner', 'renseigne', ['sur/preposition les/determinant horaires/nom', 'à/preposition l’/determinant accueil/nom', 'auprès_du/preposition secrétariat/nom']),
  frame('se diriger', 'dirige', ['vers/preposition la/determinant sortie/nom', 'vers/preposition la/determinant gare/nom', 'vers/preposition le/determinant parc/nom']),
  frame('se protéger', 'protège', ['du/preposition soleil/nom', 'contre/preposition la/determinant pluie/nom', 'avec/preposition un/determinant casque/nom']),
  frame('se soigner', 'soigne', ['avec/preposition les/determinant médicaments/nom', 'selon/preposition les/determinant conseils/nom du/preposition médecin/nom', 'à/preposition la/determinant maison/nom']),
  frame('se concentrer', 'concentre', ['sur/preposition le/determinant travail/nom', 'pendant/preposition la/determinant lecture/nom', 'dans/preposition le/determinant calme/nom']),
  frame('se réchauffer', 'réchauffe', ['près_du/preposition feu/nom', 'avec/preposition une/determinant couverture/nom', 'après/preposition la/determinant promenade/nom']),
  frame('se sécher', 'sèche', ['les/determinant mains/nom', 'les/determinant cheveux/nom', 'avec/preposition une/determinant serviette/nom']),
  frame('se changer', 'change', ['après/preposition le/determinant travail/nom', 'dans/preposition la/determinant cabine/nom', 'avant/preposition la/determinant fête/nom']),
  frame('se couper', 'coupe', ['les/determinant ongles/nom', 'les/determinant cheveux/nom', 'une/determinant mèche/nom']),
  frame('se baisser', 'baisse', ['sous/preposition la/determinant branche/nom', 'devant/preposition le/determinant placard/nom', 'lentement/adverbe']),
  frame('se raser', 'rase', ['la/determinant barbe/nom', 'le/determinant menton/nom', 'les/determinant jambes/nom']),
]

const BASE_REFLEXIVE_FRAMES_AUTRES: readonly ThemedFrame[] = [
  frame('se rafraîchir', 'rafraîchit', ['avec/preposition un/determinant verre/nom d’/preposition eau/nom', 'près_de/preposition la/determinant fontaine/nom', 'après/preposition la/determinant marche/nom']),
  frame('se sentir', 'sent', ['bien/adverbe', 'mieux/adverbe', 'en/preposition forme/nom']),
  frame('se servir', 'sert', ['du/preposition dictionnaire/nom', 'de/preposition la/determinant carte/nom', 'des/preposition outils/nom']),
  frame('s’endormir', 'endort', ['dans/preposition le/determinant train/nom', 'après/preposition le/determinant film/nom', 'rapidement/adverbe']),
  frame('s’entendre', 'entend', ['avec/preposition son/determinant frère/nom', 'avec/preposition sa/determinant voisine/nom', 'avec/preposition ses/determinant collègues/nom']),
  frame('se détendre', 'détend', ['après/preposition le/determinant travail/nom', 'dans/preposition le/determinant jardin/nom', 'avec/preposition de_la/determinant musique/nom']),
  frame('se taire', 'tait', ['pendant/preposition le/determinant spectacle/nom', 'après/preposition la/determinant sonnerie/nom', 'dans/preposition la/determinant bibliothèque/nom']),
  frame('s’asseoir', 'assied', ['sur/preposition le/determinant banc/nom', 'près_de/preposition la/determinant fenêtre/nom', 'à/preposition côté/nom du/preposition bureau/nom']),
  frame('se souvenir', 'souvient', ['des/preposition vacances/nom', 'du/preposition voyage/nom', 'de/preposition la/determinant chanson/nom', 'du/preposition rendez-vous/nom']),
  frame('se mettre', 'met', ['au/preposition travail/nom', 'à/preposition l’/determinant abri/nom', 'près_du/preposition feu/nom']),
  frame('se rendre', 'rend', ['à/preposition la/determinant mairie/nom', 'au/preposition marché/nom', 'chez/preposition le/determinant médecin/nom']),
  frame('se réjouir', 'réjouit', ['de/preposition la/determinant visite/nom', 'du/preposition retour/nom de/preposition son/determinant ami/nom', 'des/preposition retrouvailles/nom']),
  frame('se réunir', 'réunit', ['avec/preposition ses/determinant voisins/nom', 'avec/preposition ses/determinant collègues/nom', 'avec/preposition les/determinant membres/nom du/preposition club/nom']),
  frame('se vêtir', 'vêt', ['chaudement/adverbe', 'avec/preposition soin/nom', 'pour/preposition la/determinant cérémonie/nom']),
  frame('se conduire', 'conduit', ['bien/adverbe', 'avec/preposition prudence/nom', 'avec/preposition respect/nom']),
]

function mergeFrames(base: readonly ThemedFrame[], extra: readonly ThemedFrame[]): readonly ThemedFrame[] {
  const frames = new Map(base.map(frame => [frame.id, frame]))
  for (const frame of extra) {
    const previous = frames.get(frame.id)
    frames.set(frame.id, { ...frame, preds: [...new Set([...(previous?.preds ?? []), ...frame.preds])] })
  }
  return [...frames.values()]
}
export const REFLEXIVE_FRAMES_ER = mergeReviewedFrames(mergeFrames(BASE_REFLEXIVE_FRAMES_ER, REFLEXIVE_SUPPLEMENT_ER), REVIEWED_REFLEXIVES.filter(frame => phraseVerbGroupOf(frame.id) === 'er'))
export const REFLEXIVE_FRAMES_AUTRES = mergeReviewedFrames(mergeFrames(BASE_REFLEXIVE_FRAMES_AUTRES, REFLEXIVE_SUPPLEMENT_AUTRES), REVIEWED_REFLEXIVES.filter(frame => phraseVerbGroupOf(frame.id) !== 'er'))
