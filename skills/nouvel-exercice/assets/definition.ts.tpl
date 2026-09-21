import { z } from "zod";
import { shuffle, type Rng } from "@/lib/rng";
import type { ExerciseDefinition, GenerationContext } from "../types";
import { __Kind__Render } from "./Render";
// TODO : choisir le pictogramme dans src/components/pictograms
import { PictoRelier as Icon } from "@/components/pictograms";

export const paramsSchema = z.object({
  theme: z.string().min(1),
  count: z.number().int().min(2).max(12),
  // Ajouter ici les autres paramètres, avec bornes explicites.
});
export type Params = z.infer<typeof paramsSchema>;

export type Item = { id: string /* + ce qui est affiché à l'apprenant·e */ };
export type Answer = string;

export function generate(params: Params, rng: Rng, ctx: GenerationContext) {
  const warnings: string[] = [];

  // 1. Réserve : données du contexte, filtrées par niveau. Aucun contenu en dur ici.
  const pool = ctx.lexicon
    .byTheme(params.theme)
    .filter((entry) => ctx.isAtOrBelowLevel(entry.level));

  if (pool.length < params.count) {
    warnings.push(
      `${pool.length} mots disponibles pour ${params.count} éléments : réduire le nombre ou élargir le thème.`
    );
  }

  // 2. Tirage à graine, sans doublon.
  const picked = shuffle(rng, pool).slice(0, params.count);

  // 3. Items (version apprenant·e) et réponses (corrigé), dans le même ordre.
  const items: Item[] = picked.map((entry) => ({ id: entry.id }));
  const answers: Answer[] = picked.map((entry) => entry.lemma);

  return { items, answers, warnings };
}

export const definition: ExerciseDefinition<Params> = {
  kind: "__kind__",
  label: "__LABEL__",
  skills: ["lexique"],
  levels: ["alpha", "post-alpha", "lecteur"],
  icon: Icon,
  paramsSchema,
  defaults: { theme: "", count: 6 },
  generate,
  Render: __Kind__Render,
};
