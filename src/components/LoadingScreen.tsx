type Props = { title?: string; description?: string; variant?: 'page' | 'panel' | 'inline' }

/** Shared route and data loading UI; no worksheet banks, images or timers to load. */
export function LoadingScreen({ title = 'Ouverture de ClairFLE', description = 'Votre espace arrive…', variant = 'page' }: Props) {
  if (variant === 'inline') return <div className="cfl-loading-inline" role="status" aria-live="polite" aria-label={title}><span data-ci-motion aria-hidden="true" className="cfl-loading-mini" /><span>{title}</span></div>
  const Root = variant === 'page' ? 'main' : 'section'
  const Heading = variant === 'page' ? 'h1' : 'h2'
  return <Root className={`cfl-loading cfl-loading--${variant}`} data-loading-screen={variant}>
    <div className="cfl-loading-body" role="status" aria-live="polite" aria-atomic="true" aria-label={title}>
      <div className="cfl-loading-scene" aria-hidden="true">
        <span data-ci-motion className="cfl-loading-orbit" />
        <span data-ci-motion className="cfl-loading-dot cfl-loading-dot--one" /><span data-ci-motion className="cfl-loading-dot cfl-loading-dot--two" /><span data-ci-motion className="cfl-loading-dot cfl-loading-dot--three" />
        <span data-ci-motion className="cfl-loading-logo"><span className="cfl-loading-mark"><i /><i /><i /></span></span>
      </div>
      <span className="cfl-loading-brand">Clair<span>FLE</span></span>
      <Heading>{title}</Heading>
      <p>{description}</p>
      <div className="cfl-loading-track" aria-hidden="true"><span data-ci-motion /></div>
    </div>
  </Root>
}
