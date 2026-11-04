import type { ThemedFrame } from './phrase-theme-frames'

/** Reviewed object/complement pairs: each prepositional variant retains a complete action. */
function body(id: string, core: string, objects: readonly string[], place: string): ThemedFrame {
  const verb = `${/^[aeiouhéèê]/.test(core) ? 's’' : 'se_'}${core}/verbe`
  return { id, preds: objects.flatMap(object => [`${verb} ${object}`, `${verb} ${object} ${place}`]) }
}
export const REFLEXIVE_SUPPLEMENT_ER: readonly ThemedFrame[] = [
  body('se laver', 'lave', ['les/determinant mains/nom','le/determinant visage/nom','les/determinant cheveux/nom','les/determinant bras/nom','les/determinant pieds/nom','le/determinant cou/nom','les/determinant jambes/nom','la/determinant nuque/nom'], 'avec/preposition du/determinant savon/nom'),
  body('se brosser', 'brosse', ['les/determinant dents/nom','les/determinant cheveux/nom','les/determinant ongles/nom','la/determinant barbe/nom'], 'devant/preposition le/determinant miroir/nom'),
  body('se coiffer', 'coiffe', ['les/determinant cheveux/nom','la/determinant frange/nom','les/determinant boucles/nom'], 'avec/preposition un/determinant peigne/nom'),
  body('se raser', 'rase', ['la/determinant barbe/nom','le/determinant menton/nom','les/determinant jambes/nom','les/determinant joues/nom','la/determinant moustache/nom','le/determinant crâne/nom'], 'devant/preposition le/determinant miroir/nom'),
  body('se sécher', 'sèche', ['les/determinant mains/nom','les/determinant cheveux/nom','le/determinant visage/nom','les/determinant pieds/nom','les/determinant jambes/nom','le/determinant dos/nom'], 'avec/preposition une/determinant serviette/nom'),
  body('se réchauffer', 'réchauffe', ['les/determinant mains/nom','les/determinant pieds/nom','les/determinant bras/nom','les/determinant jambes/nom'], 'près_du/preposition feu/nom'),
  body('se couper', 'coupe', ['les/determinant ongles/nom','les/determinant cheveux/nom','la/determinant barbe/nom','la/determinant moustache/nom','la/determinant frange/nom'], 'avec/preposition des/determinant ciseaux/nom'),
  body('se protéger', 'protège', ['le/determinant visage/nom','les/determinant mains/nom','les/determinant yeux/nom','les/determinant oreilles/nom','la/determinant tête/nom'], 'contre/preposition le/determinant froid/nom'),
  body('se soigner', 'soigne', ['les/determinant mains/nom','les/determinant pieds/nom','la/determinant peau/nom'], 'avec/preposition une/determinant crème/nom'),
  body('se frotter', 'frotte', ['les/determinant mains/nom','les/determinant yeux/nom','les/determinant bras/nom','les/determinant pieds/nom'], 'avec/preposition les/determinant doigts/nom'),
  body('se maquiller', 'maquille', ['les/determinant yeux/nom','les/determinant lèvres/nom','les/determinant joues/nom','les/determinant paupières/nom'], 'devant/preposition le/determinant miroir/nom'),
]
export const REFLEXIVE_SUPPLEMENT_AUTRES: readonly ThemedFrame[] = [
  body('se rafraîchir', 'rafraîchit', ['le/determinant visage/nom','les/determinant mains/nom','les/determinant pieds/nom','les/determinant bras/nom','la/determinant nuque/nom','les/determinant jambes/nom'], 'avec/preposition de_l’/determinant eau/nom'),
  body('se servir', 'sert', ['un/determinant café/nom','un/determinant thé/nom','une/determinant soupe/nom','un/determinant jus/nom','une/determinant salade/nom','un/determinant dessert/nom','du/determinant pain/nom','du/determinant riz/nom','du/determinant fromage/nom','des/determinant pâtes/nom'], 'dans/preposition la/determinant cuisine/nom'),
  body('se mettre', 'met', ['une/determinant veste/nom','un/determinant manteau/nom','un/determinant pull/nom','une/determinant écharpe/nom','un/determinant chapeau/nom','des/determinant gants/nom','des/determinant bottes/nom','une/determinant chemise/nom','un/determinant tablier/nom','des/determinant lunettes/nom'], 'avant/preposition le/determinant départ/nom'),
  body('se dégourdir', 'dégourdit', ['les/determinant jambes/nom','les/determinant bras/nom','les/determinant pieds/nom','les/determinant doigts/nom'], 'pendant/preposition la/determinant pause/nom'),
  body('se choisir', 'choisit', ['un/determinant livre/nom','un/determinant film/nom','une/determinant place/nom','un/determinant métier/nom','une/determinant robe/nom','un/determinant vélo/nom','un/determinant cahier/nom','un/determinant sac/nom'], 'avec/preposition soin/nom'),
  body('s’offrir', 'offre', ['un/determinant voyage/nom','un/determinant livre/nom','un/determinant parfum/nom','un/determinant vélo/nom','une/determinant montre/nom','une/determinant écharpe/nom','un/determinant repas/nom','un/determinant dessert/nom'], 'pour/preposition son/determinant anniversaire/nom'),
  body('se faire', 'fait', ['un/determinant café/nom','un/determinant sandwich/nom','une/determinant omelette/nom','une/determinant soupe/nom','une/determinant salade/nom','un/determinant thé/nom','un/determinant gâteau/nom','un/determinant dessert/nom'], 'dans/preposition la/determinant cuisine/nom'),
]
