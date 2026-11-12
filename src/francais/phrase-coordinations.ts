import { predicateDomain, REVIEWED_SIMPLE, type PhraseDomain } from './phrase-reviewed-corpus'
import { REVIEWED_REFLEXIVES } from './phrase-reviewed-reflexives'
import { phraseVerbGroupOf } from './phrase-verb-groups'
import { baseInfinitive } from './phrase-conjugate'
import type { PhraseContext, ThemedFrame } from './phrase-theme-frames'

type Action = { id: string; pred: string; domain: PhraseDomain }
const pools = new Map<string, Action[]>()
const reflexiveActions: Action[] = REVIEWED_REFLEXIVES.flatMap(({ id, domain, preds }) =>
  preds.filter(pred => !/\/(?:adjectif|adverbe|preposition)\b/.test(pred)).map(pred => ({ id, domain, pred })),
)
for (const action of [...REVIEWED_SIMPLE, ...reflexiveActions]) {
  const key = `${action.domain}:${phraseVerbGroupOf(action.id)}`
  const pool = pools.get(key) ?? []
  if (!pool.some(previous => previous.id === action.id && previous.pred === action.pred)) pool.push(action)
  pools.set(key, pool)
}

/** Both actions share a setting AND the selected grammatical verb group. */
export function coherentRightActions(id: string, pred: string): readonly Action[] {
  const domain = predicateDomain(id, pred)
  const actions = domain ? (pools.get(`${domain}:${phraseVerbGroupOf(id)}`) ?? [])
    .filter(action => baseInfinitive(action.id) !== baseInfinitive(id)) : []
  if (id === 's’asseoir' && domain === 'logement') {
    return actions.filter(action => action.id === 'couvrir' || (action.id === 'tenir' && /(?:plateau|tasse)\/nom/.test(action.pred)))
  }
  return actions
}

export function coordinatedFrames(simple: readonly { id: string; preds: readonly string[] }[]): ThemedFrame[] {
  return simple.flatMap(({ id, preds }) => {
    const contexts: PhraseContext[] = preds.flatMap((pred, index) => {
      const rights = coherentRightActions(id, pred)
      // Keep five reviewed alternatives per left action, rotating across verbs.
      const byVerb = new Map<string, Action[]>()
      for (const action of rights) { const list = byVerb.get(action.id) ?? []; list.push(action); byVerb.set(action.id, list) }
      const verbs = [...byVerb.values()]
      if (!verbs.length) return []
      return Array.from({ length: Math.min(5, rights.length) }, (_, offset) => {
        const alternatives = verbs[offset % verbs.length]!
        const right = alternatives[(index + Math.floor(offset / verbs.length)) % alternatives.length]!
        return { pred, rightId: right.id, rightPred: right.pred }
      })
    })
    return contexts.length >= 2 ? [{ id, preds: [...new Set(contexts.map(context => context.pred))], contexts }] : []
  })
}
