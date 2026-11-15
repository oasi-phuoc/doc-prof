import type {RefObject} from 'react'
import type {Question} from '../domain/types'
import {GrammarCountryPrompt} from '@/components/grammar/GrammarCountryPrompt'
import './word-drop.css'

export function WordBlankPrompt({question,target,value,pending,hover,disabled,onDeposit,onEscape}:{question:Question;target:RefObject<HTMLButtonElement|null>;value?:string;pending?:string;hover?:string;disabled:boolean;onDeposit:()=>void;onEscape:()=>void}){
  const blank=question.wordBlank!
  return <span className="ci-word-blank-sentence"><GrammarCountryPrompt text={blank.before} gender={question.grammarCountryGender}/><button ref={target} type="button" className={`ci-word-blank${hover?' ci-word-blank-hover':''}`} data-ci-word-blank="true" disabled={disabled} aria-label={pending?`Déposer « ${pending} » dans le blanc`:value?`Proposition : ${value}${disabled?'':'. Retirer le mot proposé'}`:'Mot à compléter'} onClick={onDeposit} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();onEscape()}}}><span>{value??'…'}</span>{hover&&<span className="ci-word-blank-preview" aria-hidden="true">{hover}</span>}</button><GrammarCountryPrompt text={blank.after} gender={question.grammarCountryGender}/></span>
}
