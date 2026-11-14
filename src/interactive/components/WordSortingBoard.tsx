import {PHRASE_COLORS} from '@/francais/phrase-banks'
import type {PhraseCategory} from '@/math/types'
import type {WordSorting} from '../domain/types'
import {useWordSorting} from './useWordSorting'
import {SequenceDragGhost} from './SequenceDragGhost'
import {IconButton} from './Icons'
import './word-sorting.css'

export function WordSortingBoard({sorting,placements,onPlacements,disabled,targets,onRead}:{sorting:WordSorting;placements?:(string|null)[];onPlacements?:(placements:(string|null)[])=>void;disabled:boolean;targets?:string[];onRead:()=>void}){
  const {root,help,values,blocked,selected,drag,announcement,choose,placeSelected,canUndo,undo,escape,pointerProps}=useWordSorting(sorting,placements,onPlacements,disabled)
  if(targets){
    const correct=values.filter((value,index)=>value===targets[index]).length,missing=values.filter(value=>value===null).length
    return <section className="ci-sort-review" aria-label="Bilan du classement"><b>{correct} / {values.length} éléments bien classés</b>{missing>0&&<p>{missing} élément(s) à classer.</p>}<details><summary>Voir le classement proposé</summary><ul tabIndex={0} aria-label="Classement proposé à faire défiler">{values.map((value,index)=><li key={index}>{index+1}. {sorting.sentence.tokens[index]} → {sorting.categories.find(category=>category.id===value)?.label??'À classer'} · {value===targets[index]?'Juste':value===null?'À classer':'À corriger'}</li>)}</ul></details></section>
  }
  const bucket=(target:number,label:string)=>{
    const category=sorting.categories[target],id=category?.id??null,indices=values.flatMap((value,index)=>value===id?[index]:[])
    const color=category?PHRASE_COLORS[category.id.replace(/^category-/,'') as PhraseCategory]:undefined
    return <section key={target} data-ci-sort-destination={target} className={`ci-sort-bucket${target===-1?' ci-sort-pool':''}${drag?.target===target?' ci-sort-target':''}`} aria-label={label} style={color?{borderTopColor:color}:undefined}>
      <button type="button" className="ci-sort-destination" disabled={blocked||selected===null} aria-label={`Déposer dans ${label}`} onClick={()=>placeSelected(target)}><b>{label}</b><small aria-hidden="true">{indices.length}</small></button>
      <div className="ci-sort-words">{indices.map(index=><button key={index} type="button" data-ci-sort-word={index} className={`ci-sort-word${selected===index?' ci-sort-selected':''}${drag?.source===index?' ci-sort-dragging':''}`} {...pointerProps(index)} disabled={blocked} aria-label={`Élément ${index+1} : ${sorting.sentence.tokens[index]}`} aria-pressed={selected===index} onClick={()=>choose(index)}><small aria-hidden="true">{index+1}</small><b>{sorting.sentence.tokens[index]}</b></button>)}</div>
    </section>
  }
  return <div ref={root} className="ci-word-sorting" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();escape()}}}>
    <div className="ci-sort-tools"><p id={help}>Glissez un mot, ou choisissez-le puis sa catégorie.</p><IconButton icon="transcript" label="Lire la phrase et les catégories" onClick={onRead}/><IconButton icon="reset" label="Annuler le classement" disabled={!canUndo} onClick={undo}/></div>
    <div role="group" aria-label="Mots et catégories" aria-describedby={help}>{bucket(-1,'Mots à classer')}<div className="ci-sort-columns">{sorting.categories.map((category,index)=>bucket(index,category.label))}</div></div>
    <span className="ci-sr-only" role="status">{announcement}</span>
    <SequenceDragGhost drag={drag}>{drag&&<b>{sorting.sentence.tokens[drag.source]}</b>}</SequenceDragGhost>
  </div>
}
