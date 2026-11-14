import type {PhraseSentenceType,PhraseVoice} from '@/francais/phrase-forms'

export function PhraseFormControls({sentenceType,voice,onSentenceType,onVoice}:{sentenceType:PhraseSentenceType;voice:PhraseVoice;onSentenceType:(value:PhraseSentenceType)=>void;onVoice:(value:PhraseVoice)=>void}) {
  return <>
    <div className="mode-toggle-block"><b>Type de phrase</b><div className="mode-toggle is-3" role="group" aria-label="Type de phrase">
      {([['declarative','Affirmatif'],['interrogative','Interrogatif'],['mixed','Mixte']] as const).map(([value,label])=><button key={value} type="button" aria-pressed={sentenceType===value} className={sentenceType===value?'active':''} onClick={()=>onSentenceType(value)}>{label}</button>)}
    </div></div>
    <div className="mode-toggle-block"><b>Voix de la phrase</b><div className="mode-toggle is-3" role="group" aria-label="Voix de la phrase">
      {([['active','Actif'],['passive','Passif'],['mixed','Mixte']] as const).map(([value,label])=><button key={value} type="button" aria-pressed={voice===value} className={voice===value?'active':''} onClick={()=>onVoice(value)}>{label}</button>)}
    </div></div>
  </>
}
