import { createContext, useContext } from 'react'

export type MediaResolver = (source: string) => string
export const originalMedia: MediaResolver = source => source
/** Rendering can use temporary URLs while plans and journals retain source URLs. */
export const PreparedMediaContext = createContext<MediaResolver>(originalMedia)
export const usePreparedMedia = () => useContext(PreparedMediaContext)
