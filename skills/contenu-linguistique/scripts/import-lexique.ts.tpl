/**
 * Import d'un lexique Excel (une feuille = un thème) vers src/content/lexique/<theme>.json
 *
 * Usage : npx tsx scripts/import-lexique.ts <fichier.xlsx> [--out src/content/lexique]
 * Dépendances : npm i -D xlsx zod tsx
 *
 * Le script ne corrige rien en silence : toute ligne invalide est rapportée,
 * et le code de sortie est 1 s'il y a au moins une erreur.
 */
import * as XLSX from "xlsx";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const LEVELS = ["A1.1", "A1", "A2", "B1", "B2"] as const;

const Entry = z.object({
  id: z.string().min(1),
  lemma: z.string().min(1),
  forms: z.array(z.string().min(1)).min(1),
  pos: z.string().min(1),
  gender: z.enum(["m", "f", "mf"]).optional(),
  level: z.enum(LEVELS),
  syllables: z.array(z.string().min(1)).min(1),
  theme: z.string().min(1),
  imageId: z.string().optional(),
  definition: z.string().optional(),
  example: z.string().optional(),
});
type Entry = z.infer<typeof Entry>;

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Normalise pour comparer syllabes et lemme : sans espaces, tirets ni apostrophes. */
const squash = (s: string) => s.toLowerCase().replace(/[\s'’\-]/g, "");

const cell = (row: Record<string, unknown>, key: string): string =>
  String(row[key] ?? "").trim();

const [file, ...rest] = process.argv.slice(2);
if (!file) {
  console.error("Usage : npx tsx scripts/import-lexique.ts <fichier.xlsx> [--out dossier]");
  process.exit(2);
}
const outIndex = rest.indexOf("--out");
const outDir = outIndex >= 0 ? rest[outIndex + 1] : "src/content/lexique";

const workbook = XLSX.readFile(file);
const errors: string[] = [];
mkdirSync(outDir, { recursive: true });

for (const sheetName of workbook.SheetNames) {
  const theme = slug(sheetName);
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
    defval: "",
  });
  const entries: Entry[] = [];
  const seen = new Set<string>();

  rows.forEach((row, i) => {
    const where = `${sheetName} ligne ${i + 2}`;
    const lemma = cell(row, "lemme");
    if (!lemma) return; // ligne vide

    const candidate = {
      id: `${theme}.${slug(lemma)}`,
      lemma,
      forms: cell(row, "formes")
        ? cell(row, "formes").split(";").map((f) => f.trim()).filter(Boolean)
        : [lemma],
      pos: cell(row, "nature"),
      gender: cell(row, "genre") || undefined,
      level: cell(row, "niveau"),
      syllables: cell(row, "syllabes").split("-").map((s) => s.trim()).filter(Boolean),
      theme,
      imageId: cell(row, "image") || undefined,
      definition: cell(row, "definition") || undefined,
      example: cell(row, "exemple") || undefined,
    };

    const parsed = Entry.safeParse(candidate);
    if (!parsed.success) {
      errors.push(`${where} : ${parsed.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join(" ; ")}`);
      return;
    }
    const entry = parsed.data;

    if (squash(entry.syllables.join("")) !== squash(entry.lemma)) {
      errors.push(`${where} : les syllabes « ${entry.syllables.join("-")} » ne redonnent pas « ${entry.lemma} »`);
      return;
    }
    if (seen.has(entry.id)) {
      errors.push(`${where} : doublon « ${entry.lemma} » dans le thème`);
      return;
    }
    seen.add(entry.id);
    entries.push(entry);
  });

  writeFileSync(
    join(outDir, `${theme}.json`),
    JSON.stringify({ version: 1, theme, entries }, null, 2) + "\n"
  );
  console.log(`${sheetName} → ${entries.length} entrées`);
}

if (errors.length) {
  console.error(`\n${errors.length} erreur(s) :`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
