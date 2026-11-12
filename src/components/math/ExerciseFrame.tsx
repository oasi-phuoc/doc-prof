import type { ReactNode } from 'react'

/** Cadre de fiche avec le même bandeau que les questions TCF. */
export function ExerciseFrame({title,children,className=''}:{title:string;children:ReactNode;className?:string}) {
  return <section className={`tcf-question is-audio-frame ${className}`} aria-label={title}>
    <h4 className="tcf-audio-frame-head">{title}</h4>
    <div className="tcf-audio-frame-body">{children}</div>
  </section>
}
