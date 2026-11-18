/** Metadata shared by the generator and the preview, without loading the reading banks. */
export function isFamilyReadingType(typeId: string): boolean {
  return /^gram-ex-famille-fam-(?:recit|email)$/.test(typeId)
}

export function isQuestionReadingType(typeId: string): boolean {
  return /^gram-ex-c[123]-question-reading-(?:ce|write)$/.test(typeId)
}

export function isGrammarReadingType(typeId: string): boolean {
  return isFamilyReadingType(typeId) || isQuestionReadingType(typeId) || typeId === 'gram-ex-modaux-communication-ce'
}
