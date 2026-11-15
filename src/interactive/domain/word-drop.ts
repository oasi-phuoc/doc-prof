import type {Choice,Question} from './types'

/** Only explicit completion sources call this helper. Never infer a gap in a QCM. */
export function sourceWordBlank(prompt:string,choices:Choice[]):Question['wordBlank'] {
  const parts=prompt.split('___')
  if(parts.length!==2||parts.some(part=>part.includes('_'))||prompt.length>3000||choices.length<2||choices.length>6||choices.some(choice=>typeof choice.id!=='string'||!choice.id||choice.id.length>120||typeof choice.text!=='string'||!choice.text.trim()||choice.text.length>120||choice.image||choice.audio))return
  return {before:parts[0]!,after:parts[1]!}
}

export function isWordDropQuestion(question:Question):boolean {
  const expected=sourceWordBlank(question.prompt,question.choices)
  return question.mode==='choice'&&!!question.wordBlank&&!!expected&&question.wordBlank.before===expected.before&&question.wordBlank.after===expected.after
}

export function validWordDrop(question:Question,choiceId:unknown):choiceId is string {
  return isWordDropQuestion(question)&&typeof choiceId==='string'&&question.choices.some(choice=>choice.id===choiceId)
}
