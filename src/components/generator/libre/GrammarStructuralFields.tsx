import type { ReactNode } from 'react'
import { joinPhrase } from '@/francais/phrase-sentences'
import { isContextualGrammarMatch } from '@/grammaire/curriculum/types'
import type {
  GrammarChoice, GrammarCriterion, GrammarDialogueQuestion, GrammarQuestion, GrammarReadingQuestion, GrammarUnit,
} from '@/grammaire/curriculum/types'

export type GrammarField = (name: string, value: string, update: (text: string) => GrammarQuestion,
  options?: { multiline?: boolean; review?: boolean; error?: string }) => ReactNode

const review = { review: true }
const longReview = { multiline: true, review: true }
const multiline = { multiline: true }
const choiceKey = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ')

function replaceAt<T>(values: T[], index: number, value: T): T[] {
  return values.map((current, position) => position === index ? value : current)
}

function criteriaFields(edit: GrammarField, rubric: GrammarCriterion[], update: (rubric: GrammarCriterion[]) => GrammarQuestion,
  prefix = 'Critère'): ReactNode {
  return rubric.map((criterion, index) => edit(`${prefix} ${index + 1}`, criterion.label,
    (label) => update(replaceAt(rubric, index, { ...criterion, label }))))
}

function withChoices(ordered: GrammarChoice[], id: string, text: string): GrammarChoice[] {
  return ordered.map((choice) => choice.id === id ? { ...choice, text } : choice)
}

function childFields<Q extends GrammarReadingQuestion | GrammarDialogueQuestion>(edit: GrammarField, child: Q, index: number,
  shuffled: GrammarChoice[] | undefined, change: (child: Q, choices?: GrammarChoice[]) => GrammarQuestion) {
  const number = index + 1
  return <>
    {shuffled?.map((choice, position) => edit(`Question ${number} · Choix ${position + 1}`, choice.text, (text) => {
      const answers = child.answers.map((answer) => choiceKey(answer) === choiceKey(choice.text) ? text : answer)
      return change({ ...child, options: withChoices(child.options!, choice.id, text), answers }, withChoices(shuffled, choice.id, text))
    }, review))}
    {child.answers.map((answer, position) => edit(`Question ${number} · Réponse ${position + 1}`, answer,
      (value) => change({ ...child, answers: replaceAt(child.answers, position, value) })))}
    {edit(`Question ${number} · Explication`, child.explanation, (explanation) => change({ ...child, explanation }), multiline)}
  </>
}

export function GrammarStructuralFields({ question, edit }: { question: GrammarQuestion; edit: GrammarField }) {
  const unit = question.unit
  const replace = (next: GrammarUnit): GrammarQuestion => ({ ...question, unit: next })
  const prompt = () => edit('Énoncé', unit.prompt, (value) => replace({ ...unit, prompt: value }), longReview)
  const answers = (name = 'Réponse') => unit.answers.map((answer, index) => edit(`${name} ${index + 1}`, answer,
    (value) => replace({ ...unit, answers: replaceAt(unit.answers, index, value) }), multiline))
  const lines = (count: number, update: (count: number) => GrammarQuestion) =>
    edit('Lignes de réponse', String(count), (value) => update(/^\d+$/.test(value) ? Number(value) : -1))

  if (unit.kind === 'completion') return null
  if (unit.kind === 'personal-gap') {
    return criteriaFields(edit, unit.rubric, (rubric) => replace({ ...unit, rubric }))
  }
  if (unit.kind === 'correct') {
    return <>
      {edit('Texte à corriger', unit.prompt, (value) => {
        const normalized = value.normalize('NFC')
        const segment = unit.error
        const start = segment ? normalized.indexOf(segment.text) : -1
        const error = segment && start >= 0 ? { ...segment, start, end: start + segment.text.length } : undefined
        return { ...replace({ ...unit, prompt: normalized, error }), libreSegmentShown: error ? question.libreSegmentShown : undefined }
      }, longReview)}
      {edit('Fragment à corriger', unit.error?.text ?? '', (text) => {
        const start = unit.prompt.indexOf(text)
        return { ...replace({ ...unit, error: text ? { segmentId: 'prompt', text, start, end: start + text.length } : undefined }),
          libreSegmentShown: text ? true : undefined }
      }, { review: true, error: 'Le fragment doit faire partie du texte à corriger.' })}
      {answers('Correction')}
    </>
  }
  if (unit.kind === 'transform') {
    return <>
      {prompt()}
      {unit.directiveDisplay !== 'heading' && (typeof unit.targetSubject === 'string'
        ? edit('Sujet à utiliser', unit.targetSubject, (targetSubject) => replace({ ...unit, targetSubject }), review)
        : edit('Transformation demandée', unit.directive, (directive) => replace({ ...unit, directive }), review))}
      {answers()}
    </>
  }
  if (unit.kind === 'order') {
    return <>
      {unit.tokens.map((token, index) => edit(`Élément ${index + 1} de la solution`, token.text, (text) => {
        const tokens = replaceAt(unit.tokens, index, { ...token, text })
        const sentence = joinPhrase(tokens).replace(/[.!?]+$/, '')
        const ending = unit.answers[0]?.match(/[.!?]+$/)?.[0] ?? ''
        return { ...question, tokens: question.tokens?.map((item) => item.id === token.id ? { ...item, text } : item),
          unit: { ...unit, tokens, answers: [sentence + ending] } }
      }, review))}
    </>
  }
  if (unit.kind === 'match') {
    return <>
      {isContextualGrammarMatch(unit.source.typeId) && prompt()}
      {unit.pairs.map((pair, index) => <fieldset key={pair.id} className="libre-grid-fields">
        <legend>Paire {index + 1}</legend>
        {edit(`Gauche ${index + 1}`, pair.left,
          (left) => replace({ ...unit, pairs: replaceAt(unit.pairs, index, { ...pair, left }) }), review)}
        {edit(`Droite ${index + 1}`, pair.right, (right) => ({
          ...question, rightOptions: question.rightOptions && withChoices(question.rightOptions, pair.id, right),
          unit: { ...unit, pairs: replaceAt(unit.pairs, index, { ...pair, right }) },
        }), review)}
      </fieldset>)}
    </>
  }
  if (unit.kind === 'production' || unit.kind === 'form') {
    return <>
      {prompt()}
      {edit('Tâche', unit.task, (task) => replace({ ...unit, task }), longReview)}
      {criteriaFields(edit, unit.rubric, (rubric) => replace({ ...unit, rubric }))}
      {unit.kind === 'production' ? <>
        {answers('Exemple')}
        {unit.mode === 'written' && lines(unit.writeLines, (writeLines) => replace({ ...unit, writeLines }))}
      </> : unit.fields.map((field, index) => <fieldset key={field.id} className="libre-grid-fields">
        <legend>Champ {index + 1}</legend>
        {edit(`Libellé du champ ${index + 1}`, field.label,
          (label) => replace({ ...unit, fields: replaceAt(unit.fields, index, { ...field, label }) }), review)}
        {edit(`Indication du champ ${index + 1}`, field.hint ?? '',
          (hint) => replace({ ...unit, fields: replaceAt(unit.fields, index, { ...field, hint: hint || undefined }) }), review)}
        {edit(`Exemple du champ ${index + 1}`, field.model,
          (model) => replace({ ...unit, fields: replaceAt(unit.fields, index, { ...field, model }) }))}
      </fieldset>)}
    </>
  }
  if (unit.kind === 'reading') {
    return <>
      {prompt()}
      {edit('Genre du document', unit.genre, (genre) => replace({ ...unit, genre }), review)}
      {edit('Texte du document', unit.text, (text) => replace({ ...unit, text }), {
        ...longReview, error: 'Le document doit encore contenir les extraits cités dans le corrigé.',
      })}
      {unit.questions.map((child, index) => <fieldset key={child.id} className="libre-grid-fields">
        <legend>Question du document {index + 1}</legend>
        {edit(`Énoncé ${index + 1}`, child.prompt, (value) =>
          replace({ ...unit, questions: replaceAt(unit.questions, index, { ...child, prompt: value }) }), longReview)}
        {childFields(edit, child, index, question.readingOptions?.[child.id], (changed, ordered) => ({
          ...question, unit: { ...unit, questions: replaceAt(unit.questions, index, changed) },
          readingOptions: ordered ? { ...question.readingOptions, [child.id]: ordered } : question.readingOptions,
        }))}
        {child.evidence.map((quote, quoteIndex) => edit(`Question ${index + 1} · Extrait ${quoteIndex + 1}`, quote, (value) =>
          replace({ ...unit, questions: replaceAt(unit.questions, index,
            { ...child, evidence: replaceAt(child.evidence, quoteIndex, value) }) }), {
          ...multiline, error: 'Citez un passage présent mot pour mot dans le document.',
        }))}
      </fieldset>)}
    </>
  }
  return <>
    {prompt()}
    {edit('Situation', unit.situation, (situation) => replace({ ...unit, situation }), longReview)}
    {unit.roles.map((role, index) => <fieldset key={role.id} className="libre-grid-fields">
      <legend>Rôle {index + 1}</legend>
      {edit(`Nom du rôle ${index + 1}`, role.label, (label) =>
        replace({ ...unit, roles: replaceAt(unit.roles, index, { ...role, label }) }), review)}
      {edit(`Objectif du rôle ${index + 1}`, role.goal, (goal) =>
        replace({ ...unit, roles: replaceAt(unit.roles, index, { ...role, goal }) }), longReview)}
    </fieldset>)}
    {unit.turns.map((turn, index) => edit(`Réplique ${index + 1}`, turn.text, (text) =>
      replace({ ...unit, turns: replaceAt(unit.turns, index, { ...turn, text }) }), longReview))}
    {unit.contract === 'open' ? <>
      {edit('Tâche', unit.task, (task) => replace({ ...unit, task }), longReview)}
      {unit.followUps.map((followUp, index) => edit(`Relance ${index + 1}`, followUp,
        (text) => replace({ ...unit, followUps: replaceAt(unit.followUps, index, text) }), review))}
      {answers('Exemple')}
      {criteriaFields(edit, unit.rubric, (rubric) => replace({ ...unit, rubric }))}
      {unit.writeLines > 0 && lines(unit.writeLines, (writeLines) => replace({ ...unit, writeLines }))}
    </> : unit.questions.map((child, index) => <fieldset key={child.id} className="libre-grid-fields">
      <legend>Question du dialogue {index + 1}</legend>
      {childFields(edit, child, index, question.scenarioOptions?.[child.id], (changed, ordered) => ({
        ...question, unit: { ...unit, questions: replaceAt(unit.questions, index, changed) },
        scenarioOptions: ordered ? { ...question.scenarioOptions, [child.id]: ordered } : question.scenarioOptions,
      }))}
    </fieldset>)}
  </>
}
