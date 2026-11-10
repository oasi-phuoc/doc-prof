import { useEffect, useRef, useState } from 'react'

export function SessionObservations({ note, onSave }: { note: string; onSave: (value: string) => void }) {
  const [value, setValue] = useState(note)
  const save = useRef(onSave)
  useEffect(() => { save.current = onSave }, [onSave])
  useEffect(() => {
    if (value === note) return
    const timer = setTimeout(() => save.current(value), 400)
    return () => clearTimeout(timer)
  }, [value, note])
  return <section className="ci-panel ci-observations">
    <label htmlFor="ci-session-note">Observations</label>
    <p id="ci-session-note-help">Stockées sur cet appareil. Évitez les noms d’élèves ; ce champ reste visible sur cet écran.</p>
    <textarea id="ci-session-note" aria-describedby="ci-session-note-help" maxLength={2000} rows={4} value={value} onChange={(event) => setValue(event.target.value)} onBlur={() => { if (value !== note) onSave(value) }} />
    <p role="status">{value.length} / 2 000 caractères{value === note ? ' · Enregistré localement si la sauvegarde est disponible.' : ' · Enregistrement…'}</p>
  </section>
}
