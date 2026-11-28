import titles from './content/audio-titles.json'

const titlesByPath: Readonly<Record<string, string>> = titles

export function tcfAudioTitle(path: string): string | undefined {
  return titlesByPath[path]
}
