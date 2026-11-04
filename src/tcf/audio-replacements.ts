import replacements from './content/audio-replacements.json'

const aliases: Readonly<Record<string, string>> = replacements

/** Keep a saved audio selection attached to its corrected recording. */
export function resolveTcfAudioReference(audio: string | undefined): string | undefined {
  const path = audio?.trim()
  return path ? aliases[path] ?? path : undefined
}
