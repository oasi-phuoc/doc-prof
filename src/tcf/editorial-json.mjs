/** Editorial line fragments concatenate exactly, including their leading spaces.
 * A mono track uses string[]; multiple tracks use one string/string[] per track.
 * Runtime exercises always retain the existing string / per-track string[] schema. */
export function normalizeEditorialBank(value) {
  if (Array.isArray(value)) {
    const result=value.map(normalizeEditorialBank)
    return result.some((entry,index)=>entry!==value[index])?result:value
  }
  if (!value || typeof value!=='object') return value
  let result=value
  const set=(key,next)=>{if(next!==value[key])result={...result,[key]:next}}
  if (value.exercise) set('exercise',normalizeEditorialBank(value.exercise))
  const support=value.support
  if (support && typeof support==='object' && !Array.isArray(support)) {
    let next=support
    const put=(key,text)=>{if(text!==support[key])next={...next,[key]:text}}
    const fragments=text=>Array.isArray(text)&&text.every(part=>typeof part==='string')?text.join(''):text
    put('texte',fragments(support.texte))
    if (Array.isArray(support.transcription)) {
      put('transcription',Array.isArray(support.audios)
        ?support.transcription.map(fragments)
        :typeof support.audio==='string'?fragments(support.transcription):support.transcription)
    }
    set('support',next)
  }
  return result
}

export function canonicalEditorialJson(value) {
  const sort=input=>Array.isArray(input)?input.map(sort):input&&typeof input==='object'
    ?Object.fromEntries(Object.keys(input).sort().map(key=>[key,sort(input[key])])):input
  return JSON.stringify(sort(normalizeEditorialBank(value)))
}

/** Parse source JSON with editorial fragments into the existing exercise schema. */
export function parseEditorialJson(source) {
  return normalizeEditorialBank(JSON.parse(source))
}
