import actionPictures from './phrase-action-pictures.generated.json'
export const PRONOUN_PICTOGRAMS = ['je','tu','il','elle','nous','vous','ils','elles'].map(label=>({label,src:`/lib/images/gattegno/pronom-${label}.webp`}))
export const pictureKey=(word:string)=>word.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/œ/g,'oe').replace(/[’']/g,' ').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim()
export const ACTION_PICTOGRAMS=actionPictures
export const GATTEGNO_PICTOGRAMS=[...PRONOUN_PICTOGRAMS,...ACTION_PICTOGRAMS]
export const INTERROGATIVE_PICTOGRAMS=[
  {label:'qui',src:'/lib/images/gattegno/interrogatif-qui.webp'},
  {label:'à qui',src:'/lib/images/gattegno/interrogatif-a-qui.webp'},
  {label:'que / quoi',src:'/lib/images/gattegno/interrogatif-quoi.webp'},
  {label:'où',src:'/lib/images/gattegno/interrogatif-ou.webp'},
  {label:'quand',src:'/lib/images/gattegno/interrogatif-quand.webp'},
  {label:'comment',src:'/lib/images/gattegno/interrogatif-comment.webp'},
  {label:'pourquoi',src:'/lib/images/gattegno/interrogatif-pourquoi.webp'},
  {label:'combien',src:'/lib/images/gattegno/interrogatif-combien.webp'},
  {label:'quel / quelle',src:'/lib/images/gattegno/interrogatif-quel-quelle.webp'},
  {label:'lequel / laquelle',src:'/lib/images/gattegno/interrogatif-lequel-laquelle.webp'},
]
export const NEGATION_PICTOGRAMS=[
  {label:'ne… pas',src:'/lib/images/gattegno/negation-ne-pas.webp'},
]
