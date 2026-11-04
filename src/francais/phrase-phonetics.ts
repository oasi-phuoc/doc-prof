/** Small explicit lexicon of aspirated h words used in the phrase banks. */
const ASPIRATED_H = /^(?:haricot|héros|haut|haie|harpe|hache|hall(?:s)?$|hockey|hibou|honte|hasard|hiss|heurt|hurl|hoch)/i

export function startsWithVowelSound(word: string): boolean {
  return /^[aeiouyhéèêëàâäîïôöùûüœ]/i.test(word) && !ASPIRATED_H.test(word)
}
