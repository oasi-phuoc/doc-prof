import type { SVGProps } from "react";

type PictoProps = SVGProps<SVGSVGElement> & { title?: string };

/** Pictogramme de consigne « __name__ ». Décoratif par défaut ; passer `title` s'il porte le sens seul. */
export function Picto__Name__({ title, ...props }: PictoProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={48}
      height={48}
      fill="none"
      stroke="var(--color-stroke)"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {/* Pastille de fond : même rayon pour tout le jeu */}
      <circle cx="48" cy="48" r="44" fill="var(--color-tint-green)" stroke="none" />
      {/* Motif : dessiner ici, 3 à 6 formes simples, marge intérieure ≥ 6 unités, pas de texte */}
    </svg>
  );
}
