/** Public country-gender clue, retained in plain text for the reading dialog. */
export function GrammarCountryPrompt({text,gender}:{text:string;gender?:'masculin'|'féminin'|'pluriel'}) {
  const marker=gender?`(${gender})`:''
  const at=marker?text.indexOf(marker):-1
  if(at<0)return <>{text}</>
  return <>{text.slice(0,at)}<span className="grammar-country-hint tcf-verbe-theme">{marker}</span>{text.slice(at+marker.length)}</>
}
