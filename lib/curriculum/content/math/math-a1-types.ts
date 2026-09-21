import type { PivotCode } from "../../../pivot-langs";

export type LocaleKey = "fr" | PivotCode;

/** Voyelles / graphèmes vocaliques (rouge), consonnes prononcées (noir), lettres muettes (gris). */
export type WordPhonemeKind = "vowel" | "consonant" | "silent";

export type ReadAloudWordPart = {
  text: string;
  kind: WordPhonemeKind;
};

/** Une case : chiffre en bleu thème + mot découpé phonétiquement. */
export type ReadAloudCell = {
  num: string;
  parts: ReadAloudWordPart[];
  /** Double soulignement bleu (ex. cinq, sept, cent sur la fiche CSC). */
  wordUnderline?: boolean;
};

export type ReadAloudRow = {
  col1: ReadAloudCell;
  col2: ReadAloudCell;
  col3: ReadAloudCell;
};

/** Légende sous le tableau (point de couleur + libellé). */
export type ReadAloudLegendItem = {
  swatch: "accentAlg" | "red" | "text" | "gray";
  labelFr: string;
  labelPivot?: Partial<Record<PivotCode, string>>;
};

/** Section « lire / compter » (table + légende couleurs + audio). */
export type TheoryReadAloud = {
  headingFr: string;
  introFr?: string[];
  /** Même idée que introFr, affichée sous « Traduire » (une langue pivot à la fois). */
  introPivot?: Partial<Record<PivotCode, string[]>>;
  rows: ReadAloudRow[];
  legendFr: ReadAloudLegendItem[];
  /** Audio / vidéo pédagogique dans `public/` (ex. « compter en français »). */
  audioSrc?: string;
};

export type ShapeExplorerShape = {
  id: string;
  /** 60×60 viewBox thumbnail SVG, no label */
  svg: string;
  tabs: Array<{ label: string; blocks: MathRichBlock[] }>;
};

/** Bloc de théorie riche (style section française). */
export type MathRichBlock =
  | { type: "heading"; fr: string; black?: boolean }
  | { type: "rule"; titleFr: string; itemsFr: string[]; pivot?: Partial<Record<PivotCode, { title: string; items: string[] }>> }
  | { type: "note"; fr: string; pivot?: Partial<Record<PivotCode, string>> }
  | { type: "example"; fr: string; pivot?: Partial<Record<PivotCode, string>> }
  | { type: "table"; headersFr: string[]; rows: string[][]; captionFr?: string; accentHeader?: boolean; textAlignRows?: "left" | "center"; colAligns?: ("left" | "center")[]; autoWidth?: boolean }
  | { type: "plain"; fr: string; pivot?: Partial<Record<PivotCode, string>> }
  | { type: "highlight"; fr: string; pivot?: Partial<Record<PivotCode, string>> }
  | { type: "svg"; markup: string; captionFr?: string; noFrame?: boolean }
  | { type: "section"; labelFr: string; itemsFr: string[] }
  | { type: "bullets"; labelFr?: string; itemsFr: string[] }
  | { type: "svg_row"; items: Array<{ markup: string; captionFr?: string }> }
  | { type: "shape_explorer"; shapes: ShapeExplorerShape[] }
  | { type: "mult_table" }
  | { type: "div_table" }
  | { type: "power_table" }
  | { type: "theory_toggle"; labelA: string; labelB: string; blocksA: MathRichBlock[]; blocksB: MathRichBlock[] }
  | { type: "theory_tabs"; tabs: Array<{ label: string; blocks: MathRichBlock[] }> }
  | {
      type: "mul_step_cards";
      /** Digits [M,C,D,U] for the first operand (e.g. [0,3,7,4] for 374) */
      a: number[];
      /** Digits [M,C,D,U] for the second operand (e.g. [0,0,0,2] for 2) */
      b: number[];
      op: string;
      steps: Array<{
        numFr: string;
        textsFr: string[];
        carries: (number | null)[];
        result: (number | null)[];
      }>;
    }
  | {
      type: "mul2_step_cards";
      /** Digits [DM,M,C,D,U] for the first operand */
      a: number[];
      /** Digits [DM,M,C,D,U] for the second operand */
      b: number[];
      /** Numeric result value (used to determine 4 vs 5 col display) */
      result: number;
      /** If set, inserts a decimal comma in the result row after this many digits from the right */
      decimalPos?: number;
      steps: Array<{
        numFr: string;
        textsFr: string[];
        carries1: (number | null)[];
        carries2: (number | null)[];
        p1: (number | null)[];
        p2shifted: (number | null)[];
        res: (number | null)[];
      }>;
    }
  | {
      type: "div_step_cards";
      /** 4-digit dividend */
      dividend: number;
      /** 1-digit divisor */
      divisor: number;
      steps: Array<{
        numFr: string;
        textsFr: string[];
        /** How many division sub-steps are complete (0 = just pose, 4 = all done) */
        stepsComplete: number;
      }>;
    }
  | {
      type: "add_step_cards";
      /** Column labels — use "," for the decimal comma separator */
      colLabels: string[];
      /** Operator shown on left of second operand row */
      op: string;
      /** Label for carry/borrow row — default "R" (addition) or "E" (subtraction) */
      carryLabel?: string;
      a: (number | null)[];
      b: (number | null)[];
      steps: Array<{
        numFr: string;
        textsFr: string[];
        carries: (number | null)[];
        result: (number | null)[];
      }>;
    }
  | {
      type: "add_sub_toggle_cards";
      addColLabels: string[];
      addA: (number | null)[];
      addB: (number | null)[];
      addSteps: Array<{
        numFr: string;
        textsFr: string[];
        carries: (number | null)[];
        result: (number | null)[];
        aDisplay?: (number | string | null)[];
      }>;
      addNoteFr?: string;
      subColLabels: string[];
      subA: (number | null)[];
      subB: (number | null)[];
      subSteps: Array<{
        numFr: string;
        textsFr: string[];
        carries: (number | null)[];
        result: (number | null)[];
        aDisplay?: (number | string | null)[];
      }>;
      subNoteFr?: string;
    }
  | {
      type: "shape_explorer";
      shapes: Array<{
        id: string;
        svg: string;
        tabs: Array<{ label: string; blocks: MathRichBlock[] }>;
      }>;
    };

export type MathTheoryBlock = {
  /** Titre principal toujours affiché en français (langue d’étude). */
  title: { fr: string } & Partial<Record<PivotCode, string>>;
  /** Paragraphes : français + traductions pivot (sous « Traduire » uniquement). */
  paragraphs: { fr: string[] } & Partial<Record<PivotCode, string[]>>;
  /** Blocs riches optionnels — remplacent paragraphs si présents. */
  blocks?: MathRichBlock[];
  readAloud?: TheoryReadAloud;
};

export type MathExerciseItem = {
  id: string;
  /** Énoncé en français (langue d’apprentissage maths). */
  promptFr: string;
  /** Énoncé traduit selon la langue pivot (si absent → promptFr). */
  promptPivot?: Partial<Record<PivotCode, string>>;
  type: "short_text" | "number";
  /** Réponses acceptées après normalisation (voir normalizeMathAnswer). */
  acceptable: string[];
  /** Astuce affichée quand l’élève clique sur le bouton « ? » (entraînement seulement). */
  hintFr?: string;
};

export type MathSubmoduleLesson = {
  submoduleId: string;
  submoduleCode: string;
  theory: MathTheoryBlock;
  /** Questions fixes utilisées pour l’évaluation. */
  exercises: MathExerciseItem[];
  /** Grande banque d’exercices pour la pratique (chiffres randomisés). */
  exercisePool?: MathExerciseItem[];
  /** Nombre d’exercices à piocher dans exercisePool (défaut : 5). */
  poolSize?: number;
  /** Banques d’exercices par niveau (exercice 1, 2, 3…). Chaque banque génère un exercice distinct. */
  exercisePools?: MathExerciseItem[][];
  /** Nombre d’items à piocher dans chaque pool de exercisePools (défaut : 5 par pool). */
  poolSizes?: number[];
};

export function normalizeMathAnswer(raw: string): string {
  let s = raw.trim().toLowerCase();
  try {
    s = s.normalize("NFD").replace(/\u0300-\u036f/g, "");
  } catch {
    /* ignore */
  }
  return s.replace(/\s+/g, "").replace(/,/g, ".");
}

export function answerMatches(user: string, acceptable: string[]): boolean {
  const n = normalizeMathAnswer(user);
  if (!n) return false;
  return acceptable.some((a) => normalizeMathAnswer(a) === n);
}

export function pickTheoryForPivot(
  pivot: PivotCode,
  block: MathTheoryBlock,
): { title: string; paragraphs: string[] } {
  const title = block.title[pivot] ?? block.title.fr;
  const paragraphs = block.paragraphs[pivot] ?? block.paragraphs.fr;
  return { title, paragraphs };
}

/** Titre et texte français (affichage principal). */
export function pickTheoryFrench(block: MathTheoryBlock): { title: string; paragraphs: string[] } {
  return { title: block.title.fr, paragraphs: block.paragraphs.fr };
}

/** Traduction pivot pour zone sous le français (si présente). */
export function pickTheoryPivotTranslation(
  pivot: PivotCode,
  block: MathTheoryBlock,
): string[] | null {
  const t = block.paragraphs[pivot];
  if (!t) return null;
  const fr = block.paragraphs.fr;
  if (t.length === fr.length && t.every((line, i) => line === fr[i])) return null;
  return t;
}
