import catalog from './association-image-themes.json'

export type ReviewedScenarioScene = { image: string; transcription: string; sceneKey: string }
type SourceScene = { audio: string; image: string; transcription: string }

/** A length tag alone never makes a recording an illustrated scenario. */
export function reviewedAssociationScene(audio: string, transcription: string, exercise: string): ReviewedScenarioScene | undefined {
  const source = catalog.sources.find((row) => row.audio === audio && row.transcription === transcription && row.exercise === exercise)
  return source ? { image: source.image, transcription: source.transcription, sceneKey: source.sceneKey } : undefined
}

function words(value: string): string {
  return ` ${value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, ' ').trim()} `
}

/** An audio edit invalidates its scene review until the catalog is reviewed again. */
export function associationSceneThemes(source: SourceScene): readonly string[] {
  return catalog.sources.find((row) => row.audio === source.audio && row.image === source.image && row.transcription === source.transcription)?.themes ?? []
}

export function associationSceneKey(source: SourceScene): string | undefined {
  return catalog.sources.find((row) => row.audio === source.audio && row.image === source.image && row.transcription === source.transcription)?.sceneKey
}

/** Whole scenes from the heard themes, with their distinguishing concepts absent. */
export function associationThemedDecoyImages(sources: readonly SourceScene[]): string[] {
  const themes = sources.map(associationSceneThemes)
  if (!sources.length || themes.some((group) => !group.length)) return []
  const heardThemes = new Set(themes.flat())
  const heardImages = new Set(sources.map((source) => source.image))
  const heardScenes = new Set(sources.map((source) => catalog.sources.find((row) => row.audio === source.audio && row.image === source.image && row.transcription === source.transcription)?.sceneKey))
  const transcript = words(sources.map((source) => source.transcription).join(' '))
  return catalog.decoys.filter((decoy) =>
    !heardImages.has(decoy.image)
    && !heardScenes.has(decoy.sceneKey)
    && decoy.themes.some((theme) => heardThemes.has(theme))
    && !decoy.absentTerms.some((term) => transcript.includes(words(term))),
  ).map((decoy) => decoy.image)
}
