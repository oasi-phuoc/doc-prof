import type { TcfExercise } from '@/tcf/types'
import type { Question } from './types'

type OralQuestion = Pick<Question,'prompt'|'images'|'hints'|'oralSituation'> & {mode:'oral'|'sequence'}
type Adaptation = { question?: OralQuestion; model?: string; issues: string[] }
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)
const text=(value:unknown)=>typeof value==='string'?value.trim():''
const invalid=(reason:string):Adaptation=>({issues:[`Support oral : ${reason}`]})

/** Public images, roles and prompts stay separate from all example answers. */
export function adaptGuidedOral(exercise:TcfExercise,instruction:string):Adaptation|undefined {
  if(exercise.competence!=='PO')return undefined
  const support:unknown=exercise.support
  if(!object(support))return invalid('les données de la scène sont invalides.')
  let images:string[]=[]
  if(support.images!==undefined){
    if(!Array.isArray(support.images)||support.images.some(src=>typeof src!=='string'||!src.trim()||src.length>2048))return invalid('vérifiez les références des images.')
    images=support.images.map(src=>String(src).trim())
  }
  if(support.image!==undefined&&support.image!==null){
    if(!text(support.image)||typeof support.image!=='string'||support.image.length>2048)return invalid('la référence de l’image est invalide.')
    if(images.length&&!(images.length===1&&images[0]===text(support.image)))return invalid('les deux champs d’images se contredisent.')
    images=[text(support.image)]
  }
  if(images.length<1||images.length>4)return invalid('la visionneuse accepte une à quatre images ; aucune image n’est retirée automatiquement.')
  if(exercise.type_exercice==='sequence_4_images'&&images.length!==4)return invalid('cette séquence nécessite exactement quatre images.')
  const rawHints=support.questions??support.exemples_questions??[]
  if(!Array.isArray(rawHints)||rawHints.length>32||rawHints.some(hint=>typeof hint!=='string'||!hint.trim()||hint.length>1500))return invalid('les relances doivent être des textes explicites et non vides.')
  const hints=rawHints.map(hint=>String(hint).trim())
  const roles=[['lieu','Lieu'],['vous_etes','Votre rôle'],['vous_voulez','Votre objectif'],['je_suis','Rôle de l’enseignant']] as const
  if(roles.some(([key])=>support[key]!=null&&(typeof support[key]!=='string'||String(support[key]).length>500)))return invalid('les rôles ou le lieu de la scène sont invalides.')
  const situation=roles.flatMap(([key,label])=>text(support[key])?[`${label} : ${text(support[key])}`]:[]).join('\n')
  if(['reponse_modele','description_modele'].some(key=>support[key]!=null&&typeof support[key]!=='string'))return invalid('le récit modèle doit être un texte explicite.')
  const description=text(support.reponse_modele)||text(support.description_modele)
  const turns=support.repliques??[]
  if(!Array.isArray(turns)||turns.length>32||turns.some(turn=>!object(turn)||!['examinateur','eleve'].includes(String(turn.locuteur))||!text(turn.texte)||text(turn.texte).length>1500))return invalid('le dialogue modèle doit conserver les interlocuteurs et leurs répliques.')
  const dialogue=turns.map(turn=>`${turn.locuteur==='examinateur'?'Enseignant':'Élève'} : ${text(turn.texte)}`).join('\n')
  const model=[description,dialogue?`Exemple d’échange\n${dialogue}`:''].filter(Boolean).join('\n\n')||'Aucun modèle n’est fourni pour cette activité. L’enseignant apprécie la production.'
  if(model.length>24000)return invalid('le modèle dépasse la taille disponible ; il n’est pas tronqué.')
  const sequence=images.length===4
  return {question:{mode:sequence?'sequence':'oral',images,hints,prompt:sequence?'Racontez l’histoire.':instruction||'Décrivez l’image et jouez la situation.',...(situation?{oralSituation:situation}:{})},model,issues:[]}
}
