import type { MathItem } from '@/math/types'
import { soutienAudioFor } from '@/francais/soutien/audio'
import type { Choice, Question } from './types'
import { hash } from './seeds'
import { isGrammarQuestion } from '@/grammaire/curriculum/validation'

type Adaptation = { part: number; prompt: string; instruction: string; choices: Choice[]; correctId?: string; model: string; mode?: Question['mode']; audio?: string; images?: string[]; words?: string[]; teacherLed?: boolean; choiceOrderPolicy?: Question['choiceOrderPolicy'] }
type Result = { items: Adaptation[]; issues: string[] }
const textKey = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
const letters = (value: string) => textKey(value).replace(/[^\p{L}\p{N}]/gu, '')
const sameBag = (a: string[], b: string[]) => JSON.stringify(a.map(textKey).sort()) === JSON.stringify(b.map(textKey).sort())
function capChoices(choices: Choice[], correctId: string, key: string): Choice[] {
  const kept = new Set([correctId, ...choices.filter((choice) => choice.id !== correctId).sort((a, b) => hash(`${key}:${a.id}`) - hash(`${key}:${b.id}`)).slice(0, 5).map((choice) => choice.id)])
  return choices.filter((choice) => kept.has(choice.id))
}

function phraseOrdering(words: string[], ordered: string[], model: string): Result {
  if (words.length < 2 || words.length > 6 || words.some((word) => !word) || new Set(words.map(textKey)).size < 2 || !sameBag(words, ordered) || !model || letters(model) !== letters(ordered.join(' '))) return { items: [], issues: ['Phrase à ordonner non vérifiable ou hors limite de deux à six éléments.'] }
  return { items: [{ part: 0, prompt: 'Remets les mots dans l’ordre.', instruction: 'Choisissez un mot puis une autre place, ou utilisez les flèches du clavier.', choices: [], model, mode: 'sequence', words: words.every((word, index) => word === ordered[index]) ? [...words.slice(1), words[0]!] : words, teacherLed: true }], issues: ['Phrase manipulable avec modèle source ; les autres ordres possibles sont appréciés par l’enseignant, sans verdict automatique.'] }
}

/** Explicit source relations only. Each audio/association gets its own stable source part. */
export function adaptSourceItem(item: MathItem, exerciseType: string, sourceInstruction = ''): Result | undefined {
  if (item.layout==='grammar') {
    if (!isGrammarQuestion(item.grammar)) return {items:[],issues:['Question grammaticale invalide : vérifiez la fiche source.']}
    const q=item.grammar, u=q.unit
    const model=u.answers.join(' / ')+'\n'+u.explanation
    const prompt=u.kind==='completion' && u.givenVerb?u.prompt.replace('___',`___ (${u.givenVerb})`):u.prompt
    if (u.kind==='completion' && q.presentation==='choice') {
      const correct=q.options!.find(option=>u.answers.includes(option.text))!
      return {items:[{part:0,prompt,instruction:'',choices:q.options!,correctId:correct.id,choiceOrderPolicy:'fixed',
        model:u.prompt.replace('___',correct.text)+'\n'+u.explanation}],issues:[]}
    }
    if (u.kind==='match') return {items:u.pairs.map((pair,part)=>({part,prompt:pair.left,
      instruction:'Une phrase à la fois : choisissez la forme qui convient.',choices:q.rightOptions!,correctId:pair.id,choiceOrderPolicy:'fixed' as const,
      model:pair.left.replace('___',pair.right)})),issues:[]}
    if (u.kind==='order') return {items:[{part:0,prompt:sourceInstruction+(u.givenVerb?` (${u.givenVerb})`:''),instruction:'Choisissez un mot puis sa place, ou utilisez les flèches du clavier.',
      choices:[],mode:'sequence',words:q.tokens!.map(t=>t.text),model,teacherLed:true}],issues:[]}
    const instruction=u.kind==='transform'?`Réécrivez avec le sujet « ${u.targetSubject} ».`:sourceInstruction
    // Oral stages display the prompt. The target subject must be visible there,
    // not only in the instruction used by the reading dialog.
    const oralPrompt=u.kind==='transform'?`${prompt}\n${instruction}`:prompt
    return {items:[{part:0,prompt:oralPrompt,instruction:instruction+(u.givenVerb?` (${u.givenVerb})`:''),choices:[],mode:'oral',model,teacherLed:true}],issues:[]}
  }
  if (item.layout === 'listen-check') {
    const options = item.options ?? [], checked = item.labels
    const keys = options.map(textKey), checkedKeys = checked?.map(textKey)
    if (!sourceInstruction.trim() || !options.length || options.length > 64 || keys.some((key) => !key) || new Set(keys).size !== keys.length ||
      !checkedKeys || new Set(checkedKeys).size !== checkedKeys.length || checkedKeys.some((key) => !keys.includes(key)) ||
      !sameBag(checked ?? [], item.answer.split(' · ').filter((word) => word.trim()))) return { items: [], issues: ['Écoute des sons : les mots cochés et le corrigé de la fiche doivent être cohérents.'] }
    const items: Adaptation[] = [], issues: string[] = []
    // Keep the source phonetic target verbatim; never infer a sound from spelling.
    const sound = /^Écoutez les mots et cochez quand vous entendez le son (.+?)\.$/u.exec(sourceInstruction.trim())?.[1]
    const prompt = sound ? `Entends-tu le son ${sound} ?` : `${sourceInstruction.trim()} Réponds oui ou non pour ce mot.`
    options.forEach((word, part) => {
      const audio = item.optionAudioSrcs?.[part]
      if (!audio) { issues.push(`Mot ${part + 1} : enregistrement absent, question non retenue.`); return }
      if (item.optionAudioSrcs?.some((other, index) => index !== part && other === audio && keys[index] !== keys[part])) {
        issues.push(`Mot ${part + 1} : une même piste désigne plusieurs mots, écoute à vérifier.`); return
      }
      const correctId = checkedKeys.includes(keys[part]!) ? 'yes' : 'no'
      items.push({ part, prompt, instruction: 'Écoutez ce mot puis choisissez Oui ou Non.', audio,
        choices: [{ id: 'yes', text: 'Oui' }, { id: 'no', text: 'Non' }], correctId,
        model: `${word} : ${correctId === 'yes' ? 'Oui' : 'Non'}.`,
        images: item.optionImages?.[part] ? [item.optionImages[part]!] : [] })
    })
    issues.push('La reconnaissance du son est proposée en une question Oui / Non par mot ; le corrigé vient des cases cochées dans la fiche.')
    return { items, issues }
  }
  if (item.layout === 'audio-order' && item.audioOrder) {
    const { clips, slots, mode } = item.audioOrder
    const issues: string[] = [], items: Adaptation[] = []
    if (!['words', 'images'].includes(mode) || clips.length < 2 || clips.length > 64 || slots.length !== clips.length || new Set(slots.map((slot) => slot.correctNum)).size !== clips.length || slots.some((slot) => !Number.isInteger(slot.correctNum) || slot.correctNum < 1 || slot.correctNum > clips.length)) return { items, issues: ['Association audio incohérente : chaque case doit désigner un enregistrement distinct.'] }
    const choices: Choice[] = slots.map((slot, index) => ({ id: `s${index}`, text: mode === 'words' ? slot.word?.trim() ?? '' : '', ...(mode === 'images' ? { image: slot.imageSrc } : {}) }))
    const labels = choices.map((choice) => mode === 'words' ? textKey(choice.text) : choice.image?.split('#')[0])
    if (labels.some((label) => !label) || new Set(labels).size !== labels.length) return { items, issues: ['Deux réponses audio sont identiques ou absentes : association à vérifier.'] }
    clips.forEach((clip, part) => {
      const slotIndex = slots.findIndex((slot) => slot.correctNum === part + 1)
      const slot = slots[slotIndex]!
      if (!clip.audioSrc || !clip.word.trim() || mode === 'words' && textKey(slot.word ?? '') !== textKey(clip.word)) { issues.push(`Audio ${part + 1} : piste ou correspondance source non vérifiable.`); return }
      // The alphabet generator sometimes substitutes a whole-word recording for
      // an unavailable syllable. Preserve that as an open activity, never grade it.
      const wholeWordFallback = exerciseType.startsWith('alpha-') && clip.audioSrc !== soutienAudioFor(clip.word)
      const sharedRecording = clips.some((other, index) => index !== part && other.audioSrc === clip.audioSrc && textKey(other.word) !== textKey(clip.word))
      if (wholeWordFallback || sharedRecording) {
        items.push({ part, prompt: 'Écoute et propose une réponse.', instruction: 'Écoutez puis échangez avec l’enseignant.', choices: [], model: clip.word, mode: 'oral', audio: clip.audioSrc, teacherLed: true })
        issues.push(`Audio ${part + 1} : activité guidée, car la piste ne permet pas de garantir une seule réponse parmi les propositions.`)
        return
      }
      const correctId = choices[slotIndex]!.id
      items.push({ part, prompt: mode === 'words' ? 'Quel mot ou quelle syllabe entends-tu ?' : 'Quelle image correspond à ce que tu entends ?', instruction: 'Écoutez puis choisissez une carte.', choices: capChoices(choices, correctId, `${exerciseType}:${part}:${clip.audioSrc}`), correctId, model: clip.word, audio: clip.audioSrc })
    })
    issues.push('L’association audio est proposée en une question par enregistrement, avec uniquement les réponses de la fiche.')
    if (choices.length > 6) issues.push('Six propositions source au maximum sont conservées par enregistrement, avec la réponse prévue par la fiche.')
    return { items, issues }
  }
  if (item.layout === 'vocab-match' && item.vocabPairs?.length) {
    const items: Adaptation[] = [], issues: string[] = []
    const right = [...new Map((item.options ?? []).filter((value) => value.trim()).map((value) => [textKey(value), value.trim()])).values()]
    const choices = right.map((text, index) => ({ id: `r${index}`, text }))
    const pairs = item.vocabPairs
    if (!['syllables', 'image', 'text'].includes(item.vocabMatchMode ?? '') || pairs.length > 64 || pairs.some((pair) => !pair.left.trim() || !pair.right.trim() || !item.labels?.some((label) => textKey(label) === textKey(pair.left)) || !right.some((value) => textKey(value) === textKey(pair.right)))) return { items, issues: ['Paires de vocabulaire absentes ou incohérentes avec les éléments de la fiche.'] }
    const seen = new Set<string>()
    pairs.forEach((pair, part) => {
      const correctId = choices.find((choice) => textKey(choice.text) === textKey(pair.right))!.id
      const ambiguous = new Set(pairs.filter((other) => textKey(other.left) === textKey(pair.left)).map((other) => textKey(other.right))).size > 1
      let prompt = item.vocabMatchMode === 'image' ? 'Quel mot correspond à cette image ?' : `Que faut-il associer à « ${pair.left} » ?`
      if (item.vocabMatchMode === 'syllables') {
        const targets = item.answer.split(' · ').flatMap((segment) => { const match = /^(.+?)\s*\+\s*(.+?)\s*→\s*(.+)$/.exec(segment); return match && textKey(match[1]!) === textKey(pair.left) && textKey(match[2]!) === textKey(pair.right) && letters(match[3]!) === letters(pair.left + pair.right) ? [match[3]!.trim()] : [] })
        if (targets.length !== 1) { issues.push(`Paire ${part + 1} : mot complet non vérifiable dans la source.`); return }
        prompt = `Complète « ${targets[0]} » : ${pair.left}___`
      }
      const identity = item.vocabMatchMode === 'syllables' ? prompt : textKey(pair.left)
      if (seen.has(identity)) return
      seen.add(identity)
      const teacherLed = choices.length < 2 || ambiguous && item.vocabMatchMode !== 'syllables'
      items.push({ part, prompt, instruction: 'Choisissez la proposition qui complète ou correspond à l’élément affiché.', choices: teacherLed ? [] : capChoices(choices, correctId, `${exerciseType}:${part}`), ...(teacherLed ? {} : { correctId }), model: teacherLed ? [...new Set(pairs.filter((other) => textKey(other.left) === textKey(pair.left)).map((other) => other.right))].join(' / ') : pair.right, images: item.vocabMatchMode === 'image' ? [pair.left] : [], ...(teacherLed ? { mode: 'oral', teacherLed: true } : {}) })
      if (teacherLed) issues.push(`Paire ${part + 1} : association à guider sans verdict automatique.`)
    })
    issues.push('L’association est proposée en micro-questions indépendantes ; aucune réponse déjà utilisée n’est retirée automatiquement. Les mots à compléter montrent le mot source complet.')
    return { items, issues }
  }
  if (item.layout === 'order' && item.orderOp === undefined) {
    if (!/^remettez la phrase en ordre[.]?$/.test(textKey(item.prompt ?? ''))) return { items: [], issues: ['Ce classement demande une activité dédiée ; sa consigne ne décrit pas une phrase à remettre en ordre.'] }
    return phraseOrdering(item.sequence?.map((word) => word.trim()) ?? [], item.placeParts ?? [], item.answer.trim())
  }
  if (item.layout === 'phrase-order') {
    const words = item.tokens?.map((token) => token.text.trim()) ?? []
    const ordered = item.labels ?? []
    const model = item.responseAnswer?.trim() || item.answer.trim()
    return phraseOrdering(words, ordered, model)
  }
}
