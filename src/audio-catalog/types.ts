export type AudioImage = { src: string; available: boolean }
export type AudioChoice = { letter: string; text?: string; image?: AudioImage; correct?: boolean; answer?: string }
export type AudioFormat = { label: string; kind: 'text' | 'image' | 'lines' | 'yes-no' | 'association'; choices?: AudioChoice[]; model?: string; lines?: number; rows?: { label: string; answer: string }[] }
export type AudioQuestion = { id: string; prompt: string; images: AudioImage[]; formats: AudioFormat[] }
export type AudioBlock = { id: string; title: string; level?: string; instruction?: string; images: AudioImage[]; questions: AudioQuestion[] }
export type AudioDetail = { transcripts: { text: string; sources: string[] }[]; blocks: AudioBlock[]; images: AudioImage[]; notes: string[] }
export type CatalogAudio = { id: string; src: string; label: string; themes: string[]; types: string[]; collection: string; levels: string[]; bytes: number; duration?: number; keywords: string; transcriptCount: number; questionCount: number; variantCount: number }
export type AudioIndex = { schemaVersion: number; entries: CatalogAudio[]; details: Record<string,{ file: string; version: string }> }
