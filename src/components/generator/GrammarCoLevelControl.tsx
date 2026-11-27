import type { GrammarCoLevel } from '@/grammaire/exercises/co-themes'

export function GrammarCoLevelControl({ value, a1Available = true, a2Available, onChange }: {
  value: GrammarCoLevel
  a1Available?: boolean
  a2Available: boolean
  onChange: (level: GrammarCoLevel) => void
}) {
  if (!a1Available || !a2Available) return null
  return (
    <div className="mode-toggle-block">
      <b>Niveau</b>
      <div className="mode-toggle" role="group" aria-label="Niveau de compréhension orale">
        {(['A1','A2'] as const).map(level=>(
          <button key={level} type="button" className={value===level?'active':''}
            aria-pressed={value===level}
            onClick={()=>{if(level!==value)onChange(level)}}>{level}</button>
        ))}
      </div>
    </div>
  )
}
