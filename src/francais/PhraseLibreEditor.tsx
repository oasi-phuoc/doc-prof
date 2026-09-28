import { PHRASE_CATEGORY_LABELS, PHRASE_COLORS } from '@/francais/phrase-banks'
import { joinPhrase } from '@/francais/phrase-sentences'
import type { MathItem, PhraseCategory, PhraseToken } from '@/math/types'

const CATEGORIES = Object.keys(PHRASE_CATEGORY_LABELS) as PhraseCategory[]

function parsePhraseKind(typeId: string): 'colorier' | 'ordre' | 'construire' | 'ecrire' | null {
  if (/-colorier$/.test(typeId)) return 'colorier'
  if (/-ordre$/.test(typeId)) return 'ordre'
  if (/-construire$/.test(typeId)) return 'construire'
  if (/-ecrire$/.test(typeId)) return 'ecrire'
  return null
}

function rebuildColorItem(item: MathItem, tokens: PhraseToken[]): MathItem {
  return {
    ...item,
    tokens,
    answer: tokens.map((token) => token.category).join(' · '),
    responseAnswer: joinPhrase(tokens),
  }
}

function rebuildOrderItem(item: MathItem, tokens: PhraseToken[], correct?: string): MathItem {
  const sentence = (correct ?? item.responseAnswer ?? item.answer ?? joinPhrase(tokens)).trim()
  return {
    ...item,
    tokens,
    labels: tokens.map((token) => token.text),
    answer: sentence.endsWith('.') ? sentence : `${sentence}.`,
    responseAnswer: sentence.endsWith('.') ? sentence : `${sentence}.`,
  }
}

export function PhraseLibreEditor({
  exerciseType,
  items,
  instruction,
  onChangeItems,
  onChangeInstruction,
}: {
  exerciseType: string
  items: MathItem[]
  instruction: string
  onChangeItems: (items: MathItem[]) => void
  onChangeInstruction: (instruction: string) => void
}) {
  const kind = parsePhraseKind(exerciseType)
  if (!kind) return null

  if (kind === 'ecrire') {
    return (
      <div className="phrase-libre-editor">
        <b>Consigne (production écrite)</b>
        <label className="phrase-libre-field">
          <span>Texte de la consigne</span>
          <textarea
            rows={3}
            value={instruction}
            onChange={(event) => onChangeInstruction(event.target.value)}
            aria-label="Consigne de production écrite"
          />
        </label>
        <small className="muted">Les phrases viennent de la banque ; vous pouvez corriger la consigne.</small>
      </div>
    )
  }

  function updateItem(index: number, next: MathItem) {
    const copy = [...items]
    copy[index] = next
    onChangeItems(copy)
  }

  function updateToken(itemIndex: number, tokenIndex: number, patch: Partial<PhraseToken>) {
    const item = items[itemIndex]
    if (!item?.tokens) return
    const tokens = item.tokens.map((token, i) => (i === tokenIndex ? { ...token, ...patch } : token))
    if (item.layout === 'phrase-order') {
      updateItem(itemIndex, rebuildOrderItem(item, tokens))
    } else {
      updateItem(itemIndex, rebuildColorItem(item, tokens))
    }
  }

  return (
    <div className="phrase-libre-editor">
      <b>
        {kind === 'construire'
          ? 'Verbes (mode libre)'
          : kind === 'ordre'
            ? 'Phrases et couleurs (mode libre)'
            : 'Mots et couleurs (mode libre)'}
      </b>
      <small className="muted">
        Contenu tiré de la banque : corrigez un mot ou une catégorie si le sens n’est pas juste.
      </small>
      <div className="phrase-libre-list">
        {items.map((item, itemIndex) => (
          <div className="phrase-libre-card" key={`phrase-libre-${itemIndex}`}>
            <span className="phrase-libre-index">{itemIndex + 1}.</span>
            {kind === 'construire' ? (
              <label className="phrase-libre-field">
                <span>Verbe</span>
                <input
                  type="text"
                  value={item.prompt ?? item.calcAnswer ?? ''}
                  onChange={(event) => {
                    const verb = event.target.value
                    updateItem(itemIndex, {
                      ...item,
                      prompt: verb,
                      calcAnswer: verb,
                    })
                  }}
                  aria-label={`Verbe de la phrase ${itemIndex + 1}`}
                />
              </label>
            ) : (
              <>
                <div className="phrase-libre-tokens">
                  {(item.tokens ?? []).map((token, tokenIndex) => (
                    <div className="phrase-libre-token" key={`${itemIndex}-${tokenIndex}`}>
                      <input
                        type="text"
                        value={token.text}
                        onChange={(event) =>
                          updateToken(itemIndex, tokenIndex, { text: event.target.value })
                        }
                        aria-label={`Mot ${tokenIndex + 1} de la phrase ${itemIndex + 1}`}
                      />
                      <label className="phrase-libre-cat">
                        <span
                          className="phrase-libre-swatch"
                          style={{ background: PHRASE_COLORS[token.category] }}
                          aria-hidden
                        />
                        <select
                          value={token.category}
                          onChange={(event) =>
                            updateToken(itemIndex, tokenIndex, {
                              category: event.target.value as PhraseCategory,
                            })
                          }
                          aria-label={`Catégorie du mot ${tokenIndex + 1}`}
                        >
                          {CATEGORIES.map((cat) => (
                            <option value={cat} key={cat}>
                              {PHRASE_CATEGORY_LABELS[cat]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
                {kind === 'ordre' ? (
                  <label className="phrase-libre-field">
                    <span>Phrase correcte</span>
                    <input
                      type="text"
                      value={item.responseAnswer ?? item.answer ?? ''}
                      onChange={(event) =>
                        updateItem(
                          itemIndex,
                          rebuildOrderItem(item, item.tokens ?? [], event.target.value),
                        )
                      }
                      aria-label={`Phrase correcte ${itemIndex + 1}`}
                    />
                  </label>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function isPhraseLibreEditable(typeId: string): boolean {
  return parsePhraseKind(typeId) != null
}
