import actionPictures from './phrase-action-pictures.generated.json'
export const PRONOUN_PICTOGRAMS = ['je','tu','il','elle','nous','vous','ils','elles'].map(label=>({label,src:`/lib/images/gattegno/pronom-${label}.webp`}))
export const pictureKey=(word:string)=>word.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/œ/g,'oe').replace(/[’']/g,' ').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim()
export const ACTION_PICTOGRAMS=actionPictures
export const GATTEGNO_PICTOGRAMS=[...PRONOUN_PICTOGRAMS,...ACTION_PICTOGRAMS]
