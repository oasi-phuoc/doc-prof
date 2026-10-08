/** Type d’exercice du domaine Activités créatives et manuelles. */
export function isAcmType(typeId: string): boolean {
  return typeId.startsWith('acm-')
}
