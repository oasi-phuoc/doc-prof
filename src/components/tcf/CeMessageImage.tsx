import type { TcfCeExercise } from '@/tcf/types'

/** Modèles de correspondance : uniquement le support de communication et le texte original. */
export function CeMessageImage({ exercise, genre }: { exercise: TcfCeExercise; genre: string }) {
  const support = exercise.support
  const text = support.texte
  const contact = 'expediteur' in support ? support.expediteur : text.trim().split('\n').at(-1)
  const medium = genre || exercise.type_exercice
  if (medium === 'whatsapp' || medium === 'sms') return <div className="ce-message-export"><div className="ce-phone">
    <div className="ce-phone-camera" />
    <div className="ce-phone-screen">
      <header className="ce-phone-contact">{contact || 'Message'}</header>
      <div className="ce-phone-conversation"><div className="ce-message-source ce-phone-bubble">{text}</div></div>
      <div className="ce-phone-input" aria-hidden="true"><span>＋</span><div /><span>➤</span></div>
    </div>
  </div></div>
  if (medium === 'email') return <div className="ce-message-export"><div className="ce-email-window">
    <header className="ce-email-toolbar">Courrier</header>
    <dl className="ce-email-fields">
      {'de' in support ? <><dt>De</dt><dd>{support.de}</dd></> : null}
      {'a' in support ? <><dt>À</dt><dd>{support.a}</dd></> : null}
      {'objet' in support ? <><dt>Objet</dt><dd>{support.objet}</dd></> : null}
    </dl>
    <div className="ce-message-source ce-email-text">{text}</div>
  </div></div>
  return <div className="ce-message-export"><div className="ce-letter-paper"><div className="ce-message-source ce-letter-text">{text}</div></div></div>
}
