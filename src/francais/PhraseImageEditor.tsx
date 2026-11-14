import {useRef,useState} from 'react'
import type {MathItem,PhraseCategory,PhraseImageClue} from '@/math/types'
import {PHRASE_CATEGORY_LABELS,PHRASE_COLORS} from './phrase-banks'
import {GATTEGNO_PICTOGRAMS} from './phrase-pictograms'
import tcfPictures from './phrase-tcf-pictures.generated.json'
import {VocabImagePicker} from '@/tcf/VocabImagePicker'
import {MAX_PHRASE_IMAGE_CLUES,nounPicture,newPictureSentence} from './phrase-images'
const choices=[...GATTEGNO_PICTOGRAMS.map(image=>({...image,theme:'Gattegno — pronoms et verbes'})),...tcfPictures.map(image=>({...image,theme:'TCF — objets, personnages et lieux'}))]

export function PhraseImageEditor({items,instruction,onChangeItems,onChangeInstruction}:{items:MathItem[];instruction:string;onChangeItems:(items:MathItem[])=>void;onChangeInstruction:(instruction:string)=>void}) {
  const [selected,setSelected]=useState<{item:number;clue:number}|null>(null)
  const trigger=useRef<HTMLButtonElement|null>(null)
  const close=()=>{setSelected(null);requestAnimationFrame(()=>trigger.current?.focus())}
  const update=(index:number,patch:Partial<MathItem>)=>onChangeItems(items.map((item,i)=>i===index?{...item,...patch}:item))
  const cluesFor=(index:number,clues:PhraseImageClue[])=>update(index,{phraseImages:clues})
  const patchClue=(item:number,clue:number,patch:Partial<PhraseImageClue>)=>cluesFor(item,(items[item]?.phraseImages??[]).map((value,i)=>i===clue?{...value,...patch}:value))
  const imageLabel=(src:string)=>choices.find(image=>image.src===src)?.label
  return <div className="phrase-libre-editor">
    <label className="phrase-libre-field"><span>Consigne</span><textarea value={instruction} onChange={event=>onChangeInstruction(event.target.value)}/></label>
    <small>Choisissez les images, leur ordre et la nature des mots. Adaptez l’exemple après avoir changé les images.</small>
    <div className="phrase-image-editor-list">{items.map((item,itemIndex)=><div className="phrase-libre-card" key={itemIndex}>
      <b>Phrase {itemIndex+1}</b>
      {items.length>1&&<button type="button" onClick={()=>onChangeItems(items.filter((_,index)=>index!==itemIndex))}>Supprimer cette phrase</button>}
      {(item.phraseImages??[]).map((clue,index)=><div className="phrase-image-editor-clue" key={index} style={{borderColor:PHRASE_COLORS[clue.category]}}>
        <span>{index+1}.</span>
        <label>Nature du mot<select aria-label={`Nature de l’indice ${index+1}, phrase ${itemIndex+1}`} value={clue.category} onChange={event=>patchClue(itemIndex,index,{category:event.target.value as PhraseCategory})}>{Object.entries(PHRASE_CATEGORY_LABELS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        <label>Mot ou indice<input aria-label={`Mot de l’indice ${index+1}, phrase ${itemIndex+1}`} value={clue.label} onChange={event=>patchClue(itemIndex,index,{label:event.target.value})}/></label>
        <button type="button" aria-label={`Changer l’image ${index+1}, phrase ${itemIndex+1}`} onClick={event=>{trigger.current=event.currentTarget;setSelected({item:itemIndex,clue:index})}}>{clue.imageSrc&&<img src={clue.imageSrc} alt=""/>}Choisir une image</button>
        <label>Place<select aria-label={`Place de l’indice ${index+1}, phrase ${itemIndex+1}`} value={index} onChange={event=>{const next=[...item.phraseImages!];const [moved]=next.splice(index,1);next.splice(Number(event.target.value),0,moved!);cluesFor(itemIndex,next)}}>{item.phraseImages!.map((_,place)=><option key={place} value={place}>{place+1}</option>)}</select></label>
        <button type="button" disabled={item.phraseImages!.length<=2} aria-label={`Supprimer l’indice ${index+1}, phrase ${itemIndex+1}`} onClick={()=>cluesFor(itemIndex,item.phraseImages!.filter((_,i)=>i!==index))}>Supprimer</button>
        {clue.imageSrc&&<button type="button" onClick={()=>patchClue(itemIndex,index,{imageSrc:undefined})}>Utiliser le mot seul</button>}
      </div>)}
      <div className="phrase-libre-actions">
        <button type="button" disabled={(item.phraseImages?.length??0)>=MAX_PHRASE_IMAGE_CLUES} onClick={()=>cluesFor(itemIndex,[...item.phraseImages??[],{category:'nom',label:'pomme',imageSrc:nounPicture('pomme')}])}>Ajouter une image</button>
        <button type="button" disabled={(item.phraseImages?.length??0)>=MAX_PHRASE_IMAGE_CLUES} onClick={()=>cluesFor(itemIndex,[...item.phraseImages??[],{category:'preposition',label:'avec'}])}>Ajouter un mot indice</button>
      </div>
      <label className="phrase-image-label-option"><input type="checkbox" checked={item.phraseImageLabels??false} onChange={event=>update(itemIndex,{phraseImageLabels:event.target.checked})}/> Afficher les mots sous les images</label>
      <label className="phrase-libre-field"><span>Phrase exemple</span><textarea aria-label={`Phrase exemple ${itemIndex+1}`} value={item.responseAnswer??item.answer} onChange={event=>update(itemIndex,{answer:event.target.value,responseAnswer:event.target.value})}/></label>
    </div>)}</div>
    <button type="button" onClick={()=>onChangeItems([...items,newPictureSentence()])}>Ajouter une phrase en images</button>
    <VocabImagePicker choices={choices} open={!!selected} onClose={close}
      initialQuery={selected?items[selected.item]?.phraseImages?.[selected.clue]?.label??'':''}
      onPick={(src,pickedLabel)=>{
        if(selected){const label=pickedLabel??imageLabel(src);patchClue(selected.item,selected.clue,{imageSrc:src,...(label?{label}:{})});close()}
      }}/>
  </div>
}
