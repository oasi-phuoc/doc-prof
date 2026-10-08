/** Type d’exercice du domaine Sciences et santé. */
export function isSanteType(typeId: string): boolean {
  return typeId.startsWith('sante-')
}
