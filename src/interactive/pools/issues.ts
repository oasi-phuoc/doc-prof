import informational from './informational-issues.json'
import type {Issue} from '../domain/types'
export const isPoolInformation=(reason:string)=>informational.includes(reason)||/^Audio \d+ : activité guidée, car la piste ne permet pas de garantir une seule réponse parmi les propositions\.$/.test(reason)
export const blockingPoolIssues=(issues:Issue[])=>issues.filter(issue=>!isPoolInformation(issue.reason))
