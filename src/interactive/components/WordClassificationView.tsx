import { Fragment } from 'react'
import type { WordClassification } from '../domain/types'
import './WordClassificationView.css'

/** Neutral words and the target position only; no source colour or category. */
export function WordClassificationView({ classification }: { classification: WordClassification }) {
  return <div className="ci-word-classification" role="group" aria-label="Phrase à classer">
    <p className="ci-classification-progress">Élément {classification.target + 1}/{classification.tokens.length}</p>
    <p className="ci-classification-sentence">{classification.prefix}{classification.tokens.map((word, index) => <Fragment key={index}>
      {index > 0 && !/['’]$/.test(classification.tokens[index - 1]!) ? ' ' : ''}
      <span className={index === classification.target ? 'ci-classification-target' : undefined} aria-current={index === classification.target ? 'step' : undefined}>{word}</span>
    </Fragment>)}{classification.ending??'.'}</p>
  </div>
}
