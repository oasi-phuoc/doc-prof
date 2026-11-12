import type { MathItem } from '@/math/types'
import { buildCscProblem } from '@/tcm-csc/problems'
import { CSC_SIGN_NAMES } from '@/tcm-csc/items'
import type { Choice } from './types'

type CscMath =
  | { kind: 'operator' | 'sign-name'; prompt: string; choices: Choice[]; correctId: string; model: string }
  | { kind: 'problem'; prompt: string; context: string; result: number; model: string }
  | { kind: 'invalid'; reason: string }

/** Only explicit, consistent CSC data can produce an automatic game answer. */
export function verifiedCscMath(item: MathItem): CscMath | undefined {
  const task = item.cscTask
  if (task?.kind === 'sign-name') {
    if (item.layout !== 'inline' || item.libreError || !Object.hasOwn(CSC_SIGN_NAMES,task.symbol) || item.prompt !== task.symbol || item.answer !== CSC_SIGN_NAMES[task.symbol]) return {kind:'invalid',reason:'Le signe et son nom ne correspondent plus. Validez la fiche avant de jouer.'}
    const choices = Object.values(CSC_SIGN_NAMES).map((text,index)=>({id:`name${index}`,text}))
    return {kind:'sign-name',prompt:`Comment se lit le signe « ${task.symbol} » ?`,choices,correctId:choices.find(choice=>choice.text===item.answer)!.id,model:`${task.symbol} : ${item.answer}`}
  }
  if (task?.kind === 'problem') {
    try {
      const problem = buildCscProblem(task.templateId, task.a, task.b)
      if (item.layout !== 'algebra' || item.libreError || item.prompt?.trim() !== problem.statement.trim() || item.answer.trim() !== problem.answer) {
        return { kind: 'invalid', reason: 'Le problème CSC, ses nombres et son corrigé ne correspondent plus. Validez les modifications dans la fiche.' }
      }
      const paragraphs = problem.statement.split('\n\n')
      return { kind: 'problem', prompt: paragraphs.pop()!, context: paragraphs.join('\n\n'), result: problem.result, model: problem.answer }
    } catch (error) {
      return { kind: 'invalid', reason: error instanceof Error ? error.message : 'Problème CSC non vérifiable.' }
    }
  }
  if (task?.kind === 'operator') {
    if (item.layout !== 'csc-task' || item.libreError || ![task.a, task.b].every((n) => Number.isInteger(n) && n >= 0 && n <= 100) ||
      !['+', '−'].includes(task.operation) || !['operator', 'equals'].includes(task.blank)) return { kind: 'invalid', reason: 'Les données du signe à compléter ne sont pas valides.' }
    const result = task.operation === '+' ? task.a + task.b : task.a - task.b
    const correct = task.blank === 'equals' ? '=' : task.operation
    if (result < 0 || result > 100 || item.answer.trim() !== correct) return { kind: 'invalid', reason: 'Le calcul et le corrigé du signe à compléter ne correspondent plus.' }
    if (task.blank === 'operator' && task.b === 0) return { kind: 'invalid', reason: 'Avec zéro, les signes + et − conviennent tous les deux : cette question ne peut pas recevoir un verdict automatique.' }
    const choices = ['+', '−', '='].map((text, index) => ({ id: `sign${index}`, text }))
    return {
      kind: 'operator',
      prompt: `Complète : ${task.a} ${task.blank === 'operator' ? '□' : task.operation} ${task.b} ${task.blank === 'equals' ? '□' : '='} ${result}`,
      choices, correctId: choices.find((choice) => choice.text === correct)!.id,
      model: `${task.a} ${task.operation} ${task.b} = ${result}`,
    }
  }
}
