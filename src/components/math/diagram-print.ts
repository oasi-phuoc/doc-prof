/** Attend les PNG de la version imprimable, qui est montée dans un conteneur caché. */
export function waitForWorksheetDiagrams(root: HTMLElement): Promise<void> {
  if (!root.querySelector('[data-diagram-source]')) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let decoding = false
    const finish = (error?: Error) => {
      observer.disconnect()
      clearTimeout(timeout)
      if (error) reject(error)
      else resolve()
    }
    const check = () => {
      if (decoding) return
      if (root.querySelector('[data-diagram-source="failed"]')) {
        finish(new Error('Un dessin de géométrie ne peut pas être préparé pour l’impression.'))
        return
      }
      if (root.querySelector('[data-diagram-source="pending"]')) return
      decoding = true
      const images = [...root.querySelectorAll<HTMLImageElement>('img.worksheet-diagram-png, img.math-sion-background')]
      void Promise.all(images.map(image => image.decode())).then(
        () => finish(),
        () => finish(new Error('Une image de géométrie ne peut pas être imprimée.')),
      )
    }
    const observer = new MutationObserver(check)
    const timeout = setTimeout(() => finish(new Error('Les dessins de géométrie sont encore en cours de préparation.')), 20_000)
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-diagram-source'] })
    check()
  })
}
