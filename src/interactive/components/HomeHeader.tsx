export function HomeHeader({homeHref='/interactif'}:{homeHref?:string}) {
  return <header className="ci-header ci-no-print ci-setup-home-header" data-ci-toolbar>
    <div className="ci-header-start"><a href={homeHref} className="brand" aria-label="ClairFLE"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>Clair<span className="brand-accent">FLE</span></a><a className="ci-primary ci-create-link" href="/generateur">Créer des fiches</a></div>
  </header>
}
