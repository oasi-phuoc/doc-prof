import { isNegativePhraseTheme, isPhraseThemeId, PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories, type PhrasePolarity } from './phrase-themes'
import { phraseSelection } from './phrase-options'
import { frameForContext, type ThemedFrame } from './phrase-theme-frames'
import { withNegation } from './phrase-negation'
import {
  COMMON,
  instantiateThemeFrame,
  isProperNameToken,
  joinPhrase,
  pronounsForFrame,
  resolveAdjPlacement,
  subjectKindOf,
  subjectsForAdjPlacement,
  type AdjPlacement,
  type SubjectKind,
} from './phrase-sentences'
import { PRODUCTION_PROMPTS_BY_THEME, type PhraseThemeId } from './phrase-banks'
import { pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem, PhraseToken, PhraseVerbGroup } from '@/math/types'
import {illustratedFrames,phraseImageClues,imageSubjectsForFrame,imageExtraFrames} from './phrase-images'
import {passiveFrames,passivePhrase,phraseSentence,phraseSyntaxRoles,syntaxModel,type PhraseSentenceType,type PhraseVoice} from './phrase-forms'

export type PhraseBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
  bankQuestionCap?: number
}

export type { PhraseThemeId }

type BuiltPhrase = {
  tokens: PhraseToken[]
  sentence: string
  verbInfinitive: string
  verbInfinitives: string[]
  question?:boolean
}

function uncap(text: string): string {
  if (!text) return text
  return text[0]!.toLowerCase() + text.slice(1)
}

/** Minuscule pour le tirage « ordre », sauf prénoms / noms propres. */
function tokenForOrder(token: PhraseToken): PhraseToken {
  if (isProperNameToken(token)) {
    const capped = token.text ? token.text[0]!.toUpperCase() + token.text.slice(1) : token.text
    return capped === token.text ? token : { ...token, text: capped }
  }
  return { ...token, text: uncap(token.text) }
}

function builtFromTokens(tokens: PhraseToken[], verbInfinitive: string, rightInfinitive?:string): BuiltPhrase {
  return { tokens, sentence: joinPhrase(tokens), verbInfinitive, verbInfinitives:rightInfinitive?[verbInfinitive,rightInfinitive]:[verbInfinitive] }
}

/**
 * Tirage équilibré : ~⅓ prénom, ~⅓ déterminant+nom, ~⅓ pronom
 * (quand le thème et le verbe le permettent).
 */
function pickBalancedSubject(
  rng: Rng,
  theme: PhraseThemeId,
  frameId: string,
  preds: readonly string[],
  pool: readonly string[],
  adjPlacement: AdjPlacement,
): string {
  const detTheme = theme === 'phrase-determinants' || theme === 'phrase-negation-determinants'
  const adjLocked = (theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif') && adjPlacement !== 'comp'
  if (detTheme || adjLocked) return pick(rng, [...pool])

  const proper = pool.filter((item) => subjectKindOf(item) === 'proper')
  const common = pool.filter((item) => subjectKindOf(item) === 'common')
  const pronouns = [...pronounsForFrame(frameId, preds)]

  const kinds: SubjectKind[] = []
  if (proper.length) kinds.push('proper')
  if (common.length) kinds.push('common')
  if (pronouns.length) kinds.push('pronoun')
  if (!kinds.length) return pick(rng, [...pool])

  const kind = pick(rng, kinds)
  if (kind === 'proper') return pick(rng, proper)
  if (kind === 'common') return pick(rng, common)
  return pick(rng, [...pronouns])
}

/** Un modèle = un verbe. Sujet et complément varient ; le verbe ne se répète pas sur la fiche. */
function pickPhrase(
  rng: Rng,
  theme: PhraseThemeId,
  used: Set<string>,
  frames: readonly ThemedFrame[],
  negative = false,
  illustrated = false,
  passive = false,
  question = false,
  passiveAgent=true,
): BuiltPhrase {
  const unused = frames.filter((frame) => !used.has(`frame:${frame.id}`))
  const model = pick(rng, unused.length ? unused : frames)
  const frame = model.contexts ? frameForContext(model.id, pick(rng, [...model.contexts])) : model
  used.add(`frame:${frame.id}`)
  const isAdj = (theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif') && frame.preds.some(pred=>pred.includes('/adjectif'))
  const adjPlacement: AdjPlacement = isAdj&&!illustrated
    ? resolveAdjPlacement(frame.id, pick(rng, model.contexts ? ['comp', 'both'] as const : ['comp', 'subj', 'both'] as const))
    : 'comp'
  const pool = subjectsForAdjPlacement(theme, adjPlacement)
  const tokens = instantiateThemeFrame(
    theme,
    frame,
    () => illustrated ? pick(rng,imageSubjectsForFrame(frame)) : passive ? pick(rng,[...COMMON]) : pickBalancedSubject(rng, theme, frame.id, frame.preds, pool, adjPlacement),
    (preds) => pick(rng, [...preds]),
    () => illustrated ? pick(rng,imageSubjectsForFrame({id:frame.rightId??frame.id,preds:frame.rightPreds??frame.preds}).filter(subject=>!/^Je\/|^Tu\/|^Nous\/|^Vous\//.test(subject))) : pick(rng, [...COMMON]),
    adjPlacement,
  )
  const infinitives=frame.rightId?[frame.id,frame.rightId]:[frame.id]
  const positive=passive?passivePhrase(tokens,infinitives,passiveAgent):tokens
  if(!positive)throw new Error('Cette construction ne peut pas être transformée à la voix passive.')
  const final=negative?withNegation(positive,passive?infinitives.map(()=>'être'):infinitives):positive
  return {...builtFromTokens(final,frame.id,frame.rightId),sentence:phraseSentence(final,question),...(question?{question:true}:{})}
}

function typeColor(phrase: BuiltPhrase): MathItem {
  return {
    layout: 'phrase-color',
    prompt: undefined,
    tokens: phrase.tokens,
    /** Corrigé = pastilles colorées seulement (pas de phrase). */
    answer: phrase.tokens.map((token) => token.category).join(' · '),
  }
}

function typeOrder(rng: Rng, phrase: BuiltPhrase): MathItem {
  const ordered = phrase.tokens.map(tokenForOrder)
  const scrambled = shuffle(rng, ordered)
  if (scrambled.length > 1 && scrambled.every((token, i) => token.text === ordered[i]!.text)) {
    scrambled.push(scrambled.shift()!)
  }
  return {
    layout: 'phrase-order',
    tokens: scrambled,
    answer: phrase.sentence,
    responseAnswer: phrase.sentence,
    labels: ordered.map((token) => token.text),
  }
}

/** Pastilles = catégories de la phrase modèle (corrigé cohérent). */
function typeBuild(phrase: BuiltPhrase): MathItem {
  return {
    layout: 'phrase-build',
    prompt: phrase.verbInfinitive,
    pastilles: phrase.tokens.map(token => token.category),
    answer: phrase.sentence,
    responseAnswer: phrase.sentence,
    calcAnswer: phrase.verbInfinitive,
  }
}

export function parsePhraseType(typeId: string): { theme: PhraseThemeId; kind: string } | null {
  const match = /^(.*)-(svc|colorier|ordre|construire|images|ecrire)$/.exec(typeId)
  return match && isPhraseThemeId(match[1]!) ? { theme: match[1], kind: match[2]! } : null
}

const INSTRUCTIONS: Record<string, string> = {
  svc: 'Entourez le sujet et soulignez le verbe.',
  colorier: 'Coloriez chaque mot selon sa catégorie.',
  ordre: 'Mettez dans l’ordre les mots. Pensez à la majuscule et au point.',
  construire: 'Écrivez les phrases selon la couleur du mot.',
  ecrire: 'Écrivez des phrases.',
}

/** Un ancien mode « Libre » sans items enregistrés retombe sur le 1er groupe. */
export function phraseBankGroup(group: PhraseVerbGroup = 'er'): Exclude<PhraseVerbGroup, 'libre'> {
  return group === 'libre' ? 'er' : group
}

export function tryGeneratePhraseBatch(
  exerciseType: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty = 'moyen',
  group: PhraseVerbGroup = 'er',
  polarity?: PhrasePolarity,
  categories?: PhraseCategories,
  imageLabels=false,
  sentenceType:PhraseSentenceType='declarative',
  voice:PhraseVoice='active',
): PhraseBatch | null {
  void difficulty
  const bank = phraseBankGroup(group)
  if (exerciseType === 'phrase-tableau-categories') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'labels', answer: 'tableau', prompt: 'Tableau des catégories' }],
      instruction: 'Repérez les catégories de la grammaire en couleur.',
      preferredColumns: 1,
    }
  }
  if (exerciseType === 'phrase-tableau-mots') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'words', answer: 'tableau', prompt: 'Tableau des mots' }],
      instruction: 'Repérez les mots selon leur catégorie.',
      preferredColumns: 1,
    }
  }
  if (exerciseType === 'phrase-tableau-vide') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'outline', answer: 'tableau', prompt: 'Tableau vide' }],
      instruction: 'Observez la structure du tableau Gattegno.',
      preferredColumns: 1,
    }
  }

  const parsed = parsePhraseType(exerciseType)
  if (!parsed) return null

  const { theme: savedTheme, kind } = parsed
  const selection = phraseSelection(savedTheme, bank, categories)
  const {theme}=selection
  const activeFrames=kind==='images'?illustratedFrames(imageExtraFrames(selection.frames,theme,bank,categories)):selection.frames
  const passives=passiveFrames(activeFrames),frames=voice==='passive'?passives:activeFrames
  const mode = polarity ?? (isNegativePhraseTheme(savedTheme) ? 'negative' : 'positive')
  const n = Math.min(Math.max(1, count), frames.length)
  const polarities = mode === 'mixed'
    ? shuffle(rng, Array.from({ length: n }, (_, index) => n === 1 ? pick(rng, [true, false]) : index < Math.ceil(n / 2)))
    : Array.from({ length: n }, () => mode === 'negative')
  const used = new Set<string>()
  const mixFlags=(mode:string,positive:string)=>mode==='mixed'?shuffle(rng,Array.from({length:n},(_,index)=>n===1?pick(rng,[true,false]):index<Math.ceil(n/2))):Array.from({length:n},()=>mode===positive)
  const questions=sentenceType==='declarative'?Array(n).fill(false):mixFlags(sentenceType,'interrogative')
  const passiveFlags=voice==='active'?Array(n).fill(false):mixFlags(voice,'passive').map(value=>value&&passives.length>0)
  if(!n)return {items:[],instruction:voice==='passive'?'Aucune construction compatible avec la voix passive pour ces filtres. Choisissez un autre thème ou groupe de verbes.':'Aucune construction illustrée n’est disponible avec ces filtres. Choisissez un autre groupe de verbes ou un autre thème.',preferredColumns:1,bankQuestionCap:0}
  if(kind==='images'){
    const items:MathItem[]=[],seen=new Set<string>()
    for(const [index,negative] of polarities.entries()){
      for(let attempt=0;attempt<64;attempt++){
        const phrase=pickPhrase(rng,theme,used,passiveFlags[index]?passives:frames,negative,true,passiveFlags[index],questions[index],categories?.preposition!==false),clues=phraseImageClues(phrase.tokens,phrase.verbInfinitives)
        if(!clues||seen.has(phrase.sentence))continue
        seen.add(phrase.sentence)
        items.push({layout:'phrase-images',tokens:phrase.tokens,...(phrase.question?{phraseQuestion:true}:{}),phraseImages:clues,phraseImageLabels:imageLabels,writeLines:1,answer:phrase.sentence,responseAnswer:phrase.sentence})
        break
      }
    }
    return {items,instruction:items.length?'Écrivez une phrase à partir des images. Ajoutez les mots nécessaires. Plusieurs phrases sont possibles.':'Aucune construction illustrée n’est disponible avec ces filtres. Choisissez un autre groupe de verbes ou un autre thème.',preferredColumns:1,bankQuestionCap:frames.length}
  }
  // Draw all sentences first: the exercise layout cannot change the bank or subjects drawn.
  const phrases = polarities.map((negative,index) => pickPhrase(rng, theme, used, passiveFlags[index]?passives:frames, negative,false,passiveFlags[index],questions[index],categories?.preposition!==false))
  const items: MathItem[] = phrases.map(phrase => {
    if (kind === 'svc') return {layout:'phrase-svc',tokens:phrase.tokens,phraseSyntaxRoles:phraseSyntaxRoles(phrase.tokens),answer:syntaxModel(phrase.tokens),responseAnswer:phrase.sentence,...(phrase.question?{phraseQuestion:true}:{})}
    if (kind === 'colorier') return {...typeColor(phrase),...(phrase.question?{phraseQuestion:true}:{})}
    if (kind === 'ordre') return {...typeOrder(rng, phrase),...(phrase.question?{phraseQuestion:true}:{})}
    if (kind === 'construire') return {...typeBuild(phrase),...(phrase.question?{phraseQuestion:true}:{})}
    return { layout: 'phrase-write', writeLines: 1, answer: phrase.sentence, responseAnswer: phrase.sentence,...(phrase.question?{phraseQuestion:true}:{}) }
  })
  const prompts = PRODUCTION_PROMPTS_BY_THEME[theme]
  const excluded = PHRASE_OPTIONAL_CATEGORIES.filter(({ category }) => categories?.[category] === false)
  const restrictions = excluded.length
    ? ` N’utilisez pas les catégories suivantes : ${excluded.map(({ label }) => label.toLowerCase()).join(', ')}.${categories?.adverbe === false && mode !== 'positive' ? ' Les mots de négation ne… pas restent autorisés.' : ''}`
    : ''
  const baseInstruction = kind === 'ecrire'
    ? excluded.length
      ? theme === 'phrase-pronominaux' ? 'Écrivez des phrases avec des verbes pronominaux.' : INSTRUCTIONS.ecrire!
      : pick(rng, [...prompts])
    : INSTRUCTIONS[kind]!
  const formInstruction = mode === 'mixed'
    ? 'Mélangez des phrases affirmatives et négatives.'
    : mode === 'negative' ? 'Utilisez la forme négative (ne… pas).' : 'Utilisez la forme affirmative.'
  return {
    items,
    instruction: kind === 'ecrire' ? `${baseInstruction} ${formInstruction}${sentenceType==='interrogative'?' Posez des questions avec « Est-ce que ».':sentenceType==='mixed'?' Mélangez déclarations et questions.':''}${voice==='passive'?' Utilisez la voix passive.':voice==='mixed'?' Mélangez les voix active et passive lorsque la construction le permet.':''}${restrictions}` : baseInstruction,
    preferredColumns: 1,
    bankQuestionCap: frames.length,
  }
}
