import type { GrammarCoLevel } from '@/grammaire/exercises/co-themes'

export function GrammarCoLevelControl({ value, a2Available, onChange }: {
  value: GrammarCoLevel
  a2Available: boolean
  onChange: (level: GrammarCoLevel) => void
}) {
  return (
    <div className="mode-toggle-block">
      <b>Niveau</b>
      <div className="mode-toggle" role="group" aria-label="Niveau de compréhension orale">
        {(['A1','A2'] as const).map(level=>(
          <button key={level} type="button" className={value===level?'active':''}
            aria-pressed={value===level} disabled={level==='A2'&&!a2Available}
            title={level==='A2'&&!a2Available?'Audios A2 à venir':undefined}
            onClick={()=>{if(level!==value)onChange(level)}}>{level}</button>
        ))}
      </div>
      {!a2Available?<small>Les audios A2 seront ajoutés plus tard.</small>:null}
    </div>
  )
}
