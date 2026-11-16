/** Presentation only: keep the stored source, grading and saved plan unchanged. */
export function playPrompt(prompt:string):string {
  const text=prompt.trim()
  const equivalent=/^([+−-]?\d+\s*\/\s*\d+)\s*=\s*(□|[+−-]?\d+)\s*\/\s*(□|\d+)$/u.exec(text)
  if(equivalent&&(equivalent[2]==='□')!==(equivalent[3]==='□'))return equivalent[2]==='□'
    ? `Même valeur que ${equivalent[1]} : quel nombre sur ${equivalent[3]} ?`
    : `Même valeur que ${equivalent[1]} : ${equivalent[2]} sur quel nombre ?`
  const identifier=/^Dans (.+), le (numérateur|dénominateur) est(?:…|\?)?$/u.exec(text)
  if(identifier)return `Quel est le ${identifier[2]} de ${identifier[1]} ?`
  const clean=text.replace(/\s*=\s*(?:[?？□▢◻⬜☐]|_+|\.{2,}|…)?\s*$/u,'')
  return clean===text?prompt:clean||'='
}
