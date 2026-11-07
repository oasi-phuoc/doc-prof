import replacements from './three-themes-images.json'
import { tcfImageSrc } from './media'

/** Les anciens supports PO gardent leur thème, avec les illustrations générées. */
export function threeThemeImageSrc(src: string): string {
  const resolved = tcfImageSrc(src)
  const [, path = resolved, suffix = ''] = resolved.match(/^([^?#]+)(.*)$/) ?? []
  const replacement = (replacements as Record<string, string>)[path]
  return replacement ? replacement + suffix : resolved
}
