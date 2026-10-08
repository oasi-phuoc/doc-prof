/** Type d’exercice du domaine Vocabulaire. */
export function isVocabulaireType(typeId: string): boolean {
  return typeId.startsWith('vocabulaire-')
}
