export function isTcmCfrType(typeId: string): boolean {
  return typeId.startsWith('tcm-cfr-')
}

export function isTcmCfrDomain(domain: string | undefined): boolean {
  return domain === 'tcm-cfr'
}
