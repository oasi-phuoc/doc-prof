import raw from './contracts.json'
import type { GrammarPresentation, GrammarSnapshot, GrammarUnit } from '@/grammaire/curriculum/types'
import { createGrammarQuestion } from '@/grammaire/curriculum/questions'
import { grammarGroups } from '@/grammaire/curriculum/scenario'
import { grammarRequestKey } from '@/grammaire/curriculum/generate'
import type { PageConfig } from '@/math/types'

/** Technical fixtures stay outside the registry and can never satisfy a bank quota. */
export function contractFixture(name:keyof typeof raw.cases,presentation?:GrammarPresentation,breakAfter?:string):PageConfig {
  const spec=raw.cases[name],mode=presentation??spec.presentation as GrammarPresentation
  const units=structuredClone(spec.units) as GrammarUnit[]
  if('hasImage' in spec&&spec.hasImage)for(const u of units)u.imageSupports=[structuredClone(raw.image)] as GrammarUnit['imageSupports']
  const config:PageConfig={domain:'grammaire',topic:spec.topic as PageConfig['topic'],exerciseType:spec.activityId,
    difficulty:'facile',count:units.length,columns:1,grammarLevel:'A1',grammarActivityId:spec.activityId,
    grammarPresentation:mode,grammarBankRevision:'technical-contracts-2026-11-12.1',grammarPreview:true,
    ...(breakAfter?{grammarPageBreakAfterQuestionIds:[breakAfter]}:{})}
  const questions=units.map(u=>createGrammarQuestion(u,mode,839)),groups=grammarGroups(questions,mode)
  const snapshot:GrammarSnapshot={schemaVersion:1,activityId:spec.activityId,level:'A1',presentation:mode,bankRevision:config.grammarBankRevision!,
    seed:839,requestKey:grammarRequestKey(config),instruction:spec.instruction,pilot:true,questions,...(groups?{groups}:{})}
  return {...config,grammarSnapshot:snapshot}
}
