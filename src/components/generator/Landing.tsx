import { Header } from '@/components/generator/Header'

export function Landing({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="landing-page">
      <Header onCreate={onCreate} />
      <main id="top">
        <section className="hero landing-hero no-print">
          <div className="hero-copy">
            <p className="eyebrow">Des fiches qui font avancer</p>
            <h1>
              Le français devient
              <br />
              <em>plus clair.</em>
            </h1>
            <p className="hero-text">
              Composez en quelques minutes des fiches simples, respectueuses et prêtes à imprimer pour vos
              apprenant·e·s.
            </p>
            <div className="hero-actions">
              <button className="button" type="button" onClick={onCreate}>
                Créer une fiche <span>→</span>
              </button>
            </div>
            <p className="microcopy">
              <span className="check">✓</span> Gratuit, sans compte, vos fiches restent à vous.
            </p>
          </div>
          <div className="landing-art">
            <span>Français</span>
            <span>Mathématiques</span>
            <span>Algèbre</span>
            <span>Géométrie</span>
            <span>Lecture</span>
            <span>Gattegno</span>
            <div className="art-card">
              <b>Fiches claires</b>
              <small>à imprimer et partager</small>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer no-print" id="aide">
        <span>
          Clair<span className="brand-accent">FLE</span>
        </span>
        <span>Fiches pour la classe.</span>
        <span>Essai local · sans compte</span>
      </footer>
    </div>
  )
}
