/** Presentation only: keep the stored source, grading and saved plan unchanged. */
export function playPrompt(prompt:string):string {
  const text=prompt.trim()
  return /^[\p{N}\s.,()+−\-×÷*/]+\s*=\s*\?$/u.test(text)&&/[+−\-×÷*/]/u.test(text)
    ? text.replace(/\s*=\s*\?$/u,'')
    : prompt
}
