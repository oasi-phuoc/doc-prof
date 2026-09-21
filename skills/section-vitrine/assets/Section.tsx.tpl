import type { ReactNode } from "react";

export function Band({
  tone = "white",
  id,
  children,
}: {
  tone?: "white" | "band";
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${tone === "band" ? "bg-band" : "bg-white"} py-16 md:py-24`}>
      <div className="mx-auto max-w-[1120px] px-6 md:px-10">{children}</div>
    </section>
  );
}

/** Rangée texte / image : texte sur 5 colonnes, image sur 6, une colonne libre entre les deux. */
export function Row({
  label,
  title,
  children,
  media,
  reverse = false,
}: {
  label?: string;
  title: string;
  children: ReactNode;
  media: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-12">
      <div className={`md:col-span-5 ${reverse ? "md:order-2 md:col-start-8" : ""}`}>
        {label ? <p className="mb-3 font-medium text-brand-700">{label}</p> : null}
        <h2 className="font-display text-[2rem] font-light leading-tight text-ink">{title}</h2>
        <div className="mt-5 max-w-[65ch] text-ink-soft">{children}</div>
      </div>
      <div className={`md:col-span-6 ${reverse ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
        {media}
      </div>
    </div>
  );
}
