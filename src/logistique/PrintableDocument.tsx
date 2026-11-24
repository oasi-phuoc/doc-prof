import type { LogistiqueSnapshot, LogistiqueCorrection } from './types'
import { logistiqueDomainLabel } from './domains'

function CorrectionView({ correction }: { correction: LogistiqueCorrection }) {
  switch (correction.kind) {
    case 'choice':
      return <p>Réponse : {correction.correctIds.map(id => correction.options.find(option => option.id === id)?.text ?? id).join(' ; ')}</p>
    case 'boolean':
      return <p>Réponse : {correction.answer ? 'Vrai' : 'Faux'}. {correction.justification}</p>
    case 'open':
      return <><p>Réponse attendue : {correction.model}</p>{correction.criteria.length > 0 ? <ul>{correction.criteria.map((criterion, index) => <li key={`${criterion.description}-${index}`}>{criterion.description}{criterion.points == null ? '' : ` (${criterion.points} pt)`}</li>)}</ul> : null}</>
    case 'numeric':
      return <><p>Résultat : {correction.value} {correction.unit}</p><p>{correction.formula}</p><ol>{correction.steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol></>
    case 'matching':
      return <ul>{correction.pairs.map(pair => <li key={pair.leftId}>{pair.leftId} → {pair.rightId}</li>)}</ul>
    case 'ordering':
      return <p>Ordre attendu : {correction.orderedIds.join(' → ')}</p>
    case 'gap':
      return <ul>{correction.blanks.map(blank => <li key={blank.id}>{blank.id} : {blank.answers.join(' / ')}</li>)}</ul>
  }
}

function StudentPayload({ payload }: { payload: LogistiqueSnapshot['units'][number]['payload'] }) {
  switch (payload.kind) {
    case 'theory':
      return <section className="logistique-doc-unit"><h3>{payload.title}</h3><p className="logistique-doc-text">{payload.markdown}</p></section>
    case 'question':
      return <section className="logistique-doc-unit"><p>{payload.prompt}</p>{payload.options ? <ol type="A">{payload.options.map(option => <li key={option.id}>{option.text}</li>)}</ol> : null}<div className="logistique-answer-lines" style={{ '--answer-lines': payload.responseLines ?? 2 } as React.CSSProperties} aria-hidden="true" /></section>
    case 'calculation':
      return <section className="logistique-doc-unit"><p>{payload.prompt}</p>{payload.unit ? <p>Unité : {payload.unit}</p> : null}<div className="logistique-answer-lines" style={{ '--answer-lines': payload.responseLines } as React.CSSProperties} aria-hidden="true" /></section>
    case 'scenario':
      return <section className="logistique-doc-unit"><h3>{payload.title}</h3><p>{payload.context}</p><p><strong>Votre rôle :</strong> {payload.role}</p><p><strong>Mission :</strong> {payload.mission}</p>{payload.supports.map(support => <section className="logistique-doc-support" key={support.title}><h4>{support.title}</h4><p>{support.content}</p></section>)}<div className="logistique-answer-lines" style={{ '--answer-lines': payload.responseLines } as React.CSSProperties} aria-hidden="true" /></section>
    case 'glossary':
      return <section className="logistique-doc-unit"><h3>{payload.term}</h3><p>{payload.definition}</p>{payload.example ? <p><strong>Exemple :</strong> {payload.example}</p> : null}{payload.synonyms?.length ? <p><strong>Synonymes :</strong> {payload.synonyms.join(', ')}</p> : null}</section>
  }
}

export function LogistiquePrintableDocument({ snapshot, title, mode }: { snapshot: LogistiqueSnapshot; title: string; mode: 'student' | 'answers' }) {
  const label = logistiqueDomainLabel(snapshot.domain)
  return <article className="logistique-print-document" aria-label={`${label} — ${title} — ${mode === 'student' ? 'fiche élève' : 'corrigé'}`}>
    <header className="logistique-print-header"><p>{label} · {snapshot.diploma}</p><h1>{snapshot.submoduleCode} — {title}</h1><p>{mode === 'student' ? 'Fiche élève' : 'Corrigé'} · Révision de banque {snapshot.bankRevision}</p>{mode === 'student' ? <div className="logistique-student-fields"><span>Nom : __________________________</span><span>Classe : ______________</span><span>Date : ______________</span></div> : null}</header>
    <div className="logistique-print-items">{snapshot.units.map((unit, index) => <section className="logistique-print-item" key={`${unit.id}:${unit.revision}`}><p className="logistique-print-number">{index + 1}</p><StudentPayload payload={unit.payload} />{mode === 'answers' ? unit.correction ? <div className="logistique-correction"><h4>Correction</h4><CorrectionView correction={unit.correction} /></div> : <p className="logistique-no-correction">Aucun corrigé n’est fourni pour cette unité.</p> : null}</section>)}  </div>

  </article>
}
