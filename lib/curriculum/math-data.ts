import type { MathModule } from "./types";

const sm = (code: string, title: string) => ({
  id: code.replace(/\./g, "-"),
  code,
  title,
});

/**
 * Modules algèbre A1–A13 (A2 = add./soust.), géométrie G1–G7.
 * Renumérotation : ancien A2→A3 … ancien A12→A13.
 */
export const MATH_MODULES: MathModule[] = [
  {
    id: "A1",
    code: "A1",
    title: "Nombres naturels",
    branch: "algebra",
    prerequisiteIds: [],
    submodules: [
      sm("A1.1", "Compter en français"),
      sm("A1.2", "Valeur positionnelle"),
      sm("A1.3", "Comparer les nombres"),
      sm("A1.4", "Droite numérique"),
      sm("A1.5", "Suites numériques"),
    ],
  },
  {
    id: "A2",
    code: "A2",
    title: "Addition et soustraction",
    branch: "algebra",
    prerequisiteIds: ["A1"],
    description: "Calcul posé et mental : retenue, emprunt, estimation (PER / CSC).",
    submodules: [
      sm("A2.1", "Addition"),
      sm("A2.2", "Soustraction"),
      sm("A2.3", "Estimation et arrondi"),
      sm("A2.4", "Problèmes"),
    ],
  },
  {
    id: "A3",
    code: "A3",
    title: "Multiplication et division",
    branch: "algebra",
    prerequisiteIds: ["A2"],
    submodules: [
      sm("A3.1", "Multiplication"),
      sm("A3.2", "Multiplication en colonnes"),
      sm("A3.3", "Division"),
      sm("A3.4", "Division en colonnes"),
      sm("A3.5", "Multiples et diviseurs"),
      sm("A3.6", "PGCD et PPCM"),
      sm("A3.7", "Problèmes"),
    ],
  },
  {
    id: "A4",
    code: "A4",
    title: "Fractions",
    branch: "algebra",
    prerequisiteIds: ["A3"],
    submodules: [
      sm("A4.1", "Notion et représentation"),
      sm("A4.2", "Fractions équivalentes"),
      sm("A4.3", "Comparaison"),
      sm("A4.4", "Addition et soustraction"),
      sm("A4.5", "Multiplication"),
      sm("A4.6", "Division "),
      sm("A4.7", "Fractions et décimaux"),
      sm("A4.8", "Problèmes"),
    ],
  },
  {
    id: "A5",
    code: "A5",
    title: "Nombres décimaux",
    branch: "algebra",
    prerequisiteIds: ["A1", "A4"],
    description: "Prérequis : A1 et fin de A4 (A4.8).",
    submodules: [
      sm("A5.1", "Lire et écrire"),
      sm("A5.2", "Suite de nombres à virgule"),
      sm("A5.3", "Arrondir"),
      sm("A5.4", "Addition et soustraction"),
      sm("A5.5", "Multiplication"),
      sm("A5.6", "Division"),
      sm("A5.7", "Problèmes"),
    ],
  },
  {
    id: "A6",
    code: "A6",
    title: "Pourcentages et proportions",
    branch: "algebra",
    prerequisiteIds: ["A5"],
    submodules: [
      sm("A6.1", "Notion de pourcentage"),
      sm("A6.2", "Pourcentage d'un nombre"),
      sm("A6.3", "Augmentation et réduction"),
      sm("A6.4", "Problèmes"),
    ],
  },
  {
    id: "A7",
    code: "A7",
    title: "Nombres relatifs",
    branch: "algebra",
    prerequisiteIds: ["A1", "A3"],
    submodules: [
      sm("A7.1", "Les nombres relatifs"),
      sm("A7.2", "Comparer"),
      sm("A7.3", "Addition et soustraction"),
      sm("A7.4", "Multiplication et division"),
    ],
  },
  {
    id: "A8",
    code: "A8",
    title: "Puissances et racines",
    branch: "algebra",
    prerequisiteIds: ["A3"],
    submodules: [
      sm("A8.1", "Notion et représentation"),
      sm("A8.2", "Calcul de puissances"),
      sm("A8.3", "Puissances de 10"),
      sm("A8.4", "Racine carrée"),
      sm("A8.5", "Priorité des opérations"),
    ],
  },
  {
    id: "A9",
    code: "A9",
    title: "Expressions algébriques",
    branch: "algebra",
    prerequisiteIds: ["A5", "A7"],
    submodules: [
      sm("A9.1", "Lire et écrire une expression"),
      sm("A9.2", "Variable et inconnue"),
      sm("A9.3", "Substitution"),
      sm("A9.4", "Réduction"),
      sm("A9.5", "Développement"),
      sm("A9.6", "Factorisation"),
    ],
  },
  {
    id: "A10",
    code: "A10",
    title: "Équations du 1er degré",
    branch: "algebra",
    prerequisiteIds: ["A9"],
    submodules: [
      sm("A10.1", "Résolution d'équations"),
      sm("A10.2", "Équations avec fractions"),
      sm("A10.3", "Méthode de substitution"),
      sm("A10.4", "Méthode d'addition / soustraction"),
    ],
  },
  {
    id: "G1",
    code: "G1",
    title: "Formes",
    branch: "geometry",
    prerequisiteIds: [],
    submodules: [
      sm("G1.1", "Reconnaissance"),
      sm("G1.2", "Propriétés"),
    ],
  },
  {
    id: "G2",
    code: "G2",
    title: "Conversions d'unités",
    branch: "geometry",
    prerequisiteIds: [],
    submodules: [
      sm("G2.1", "Longueur, aire, volume (m, m², m³)"),
      sm("G2.2", "Capacité, masse, temps (L, g, h)"),
    ],
  },
  {
    id: "G3",
    code: "G3",
    title: "Périmètres",
    branch: "geometry",
    prerequisiteIds: [],
    algebraRefs: ["A3"],
    submodules: [
      sm("G3.1", "Carré"),
      sm("G3.2", "Rectangle"),
      sm("G3.3", "Triangle"),
      sm("G3.4", "Polygones réguliers"),
      sm("G3.5", "Cercle et π"),
    ],
  },
  {
    id: "G4",
    code: "G4",
    title: "Aires des figures planes",
    branch: "geometry",
    prerequisiteIds: [],
    algebraRefs: ["A3", "A5", "A8", "A4"],
    submodules: [
      sm("G4.1", "Carré"),
      sm("G4.2", "Rectangle"),
      sm("G4.3", "Triangle"),
      sm("G4.4", "Parallélogramme"),
      sm("G4.5", "Trapèze"),
      sm("G4.6", "Disque"),
      sm("G4.7", "Losange"),
      sm("G4.8", "Figures composées"),
    ],
  },
  {
    id: "G5",
    code: "G5",
    title: "Solides et volumes",
    branch: "geometry",
    prerequisiteIds: ["G4"],
    algebraRefs: ["A3", "A8", "A4", "A5", "G4"],
    submodules: [
      sm("G5.1", "Reconnaître les solides"),
      sm("G5.2", "Volume du cube"),
      sm("G5.3", "Pavé droit"),
      sm("G5.4", "Prisme et pyramide"),
      sm("G5.5", "Cylindre"),
      sm("G5.6", "Cône et sphère"),
    ],
  },
  {
    id: "G6",
    code: "G6",
    title: "Se repérer dans le plan",
    branch: "geometry",
    prerequisiteIds: [],
    algebraRefs: ["A3"],
    submodules: [
      sm("G6.1", "Se repérer dans le plan"),
      sm("G6.2", "Repère cartésien"),
    ],
  },
  {
    id: "G7",
    code: "G7",
    title: "Transformations du plan",
    branch: "geometry",
    prerequisiteIds: [],
    algebraRefs: ["A3", "A6"],
    submodules: [
      sm("G7.1", "Reproduction de figures"),
      sm("G7.2", "Symétrie axiale"),
      sm("G7.3", "Symétrie centrale"),
      sm("G7.4", "Translation"),
      sm("G7.5", "Rotation"),
    ],
  },
];

export const MATH_ALGEBRA_ORDER = MATH_MODULES.filter((m) => m.branch === "algebra").map(
  (m) => m.id,
);

export const MATH_GEOMETRY_TAB_ORDER = [
  ...MATH_MODULES.filter((m) => m.branch === "geometry").map((m) => m.id),
];

/** Chaîne séquentielle G1→G5. G6 et G7 s’ouvrent en parallèle (G6.1, G7.1). */
export const MATH_GEOMETRY_SEQUENTIAL_IDS = ["G1", "G2", "G3", "G4", "G5"] as const;
export const MATH_GEOMETRY_PARALLEL_OPEN_IDS = ["G6", "G7"] as const;

/** Ancienne numérotation A2–A12 → nouvelle A3–A13 (après insertion du nouvel A2). */
/** Ancienne numérotation G6 → G7 (après insertion du G6 « Se repérer »). */
export const GEOMETRY_LEGACY_ID_MAP: Record<string, string> = {
  G6: "G7",
};

export const ALGEBRA_LEGACY_ID_MAP: Record<string, string> = {
  A1: "A1",
  A2: "A3",
  A3: "A4",
  A4: "A5",
  A5: "A6",
  A6: "A7",
  A7: "A8",
  A8: "A9",
  A9: "A10",
  A10: "A10",
  A11: "A10",
  A12: "A10",
};

export function getMathModule(id: string): MathModule | undefined {
  return MATH_MODULES.find((m) => m.id === id);
}

/** Résout un sous-module (ex. A1-1) sans charger le catalogue de leçons lourd. */
export function getMathSubmoduleRef(
  submoduleId: string,
): { moduleId: string; code: string } | null {
  for (const mod of MATH_MODULES) {
    const sub = mod.submodules.find((s) => s.id === submoduleId);
    if (sub) return { moduleId: mod.id, code: sub.code };
  }
  // Fallback : A1-1 → module A1, code A1.1
  const m = /^([A-Z]+\d+)/i.exec(submoduleId);
  if (!m) return null;
  const moduleId = m[1]!.toUpperCase();
  if (!getMathModule(moduleId)) return null;
  return { moduleId, code: submoduleId.replace(/-/g, ".") };
}

/** Branche pour un module ou sous-module (onglet sidebar maths). */
export function getMathBranchForPathSegment(
  segment: string,
): MathModule["branch"] | null {
  const upper = segment.toUpperCase();
  const direct = getMathModule(upper);
  if (direct) return direct.branch;
  const ref = getMathSubmoduleRef(upper);
  if (!ref) return null;
  return getMathModule(ref.moduleId)?.branch ?? null;
}

/** Module visible dans la liste mais pas encore ouvert aux élèves (G7, etc.). */
export function isMathModuleAccessibleToStudent(mod: MathModule | undefined): boolean {
  return !!mod && !mod.comingSoon;
}

export function prerequisitesMet(
  module: MathModule,
  completed: Set<string>,
): { ok: true } | { ok: false; missing: string[] } {
  const missing = module.prerequisiteIds.filter((id) => !completed.has(id));
  if (missing.length === 0) return { ok: true };
  return { ok: false, missing };
}

