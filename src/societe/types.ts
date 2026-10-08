/** Type d’exercice du domaine Société. */
export function isSocieteType(typeId: string): boolean {
  return typeId.startsWith('societe-')
}
