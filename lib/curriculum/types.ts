/** Marqueurs pédagogiques de la structure officielle. */
export type PedagogicMarker = "prerequisite" | "cross_ref" | "quiz";

/** Compétences CECRL / PER (français). */
export type CompetenceCode = "CO" | "CE" | "PO" | "PE";

export type FrenchSection = "ALPHA" | "A0" | "A1" | "A2" | "B1" | "B2" | "V1" | "V2" | "V3" | "V4" | "V5" | "V6" | "V7" | "V8" | "V9" | "V10";

export type FrenchTab = "general" | "vocabulaire" | "grammaire" | "conjugaison" | "communication";

export type FrenchTheme = {
  id: string;
  slug: string;
  code: string;
  title: string;
  section: FrenchSection;
  summary: string;
  markers: PedagogicMarker[];
  /** Onglet d'affichage : undefined = "general". */
  tab?: FrenchTab;
  /** Seuil de passage vers la section suivante (ex. Alpha → A0). */
  milestoneExit?: boolean;
  prerequisiteSlugs?: string[];
};

export type MathBranch = "algebra" | "geometry" | "stats";

export type MathSubmodule = {
  id: string;
  code: string;
  title: string;
};

export type MathModule = {
  id: string;
  code: string;
  title: string;
  branch: MathBranch;
  submodules: MathSubmodule[];
  prerequisiteIds: string[];
  /** Références vers modules algèbre utiles (affichage tags). */
  algebraRefs?: string[];
  description?: string;
  /** Module not yet available — shown in list but non-interactive for students. */
  comingSoon?: boolean;
};

export type ModuleProgressState =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export type MedalTier = "bronze" | "silver" | "gold";

export type MathModuleProgress = {
  state: ModuleProgressState;
  /** 0–1 sous-modules complétés (approximation). */
  subProgress: number;
  subTotal: number;
  /** Note sur 6 après quiz module, si terminé. */
  grade?: number;
  medal?: MedalTier;
  /** ISO date dernier quiz. */
  lastEvalAt?: string;
  evaluationAttempts?: number;
  reviewFlag?: boolean;
};

/** v1 : ancienne numérotation algèbre A1–A12. v2 : A2 add./soust., A3–A13 (anciennement A2–A12). */
export type StoredProgressV1 = {
  version: 1 | 2;
  math: Record<string, MathModuleProgress>;
  /** Dernier module maths terminé (pour règle 1). */
  lastCompletedMathModuleId?: string;
  lastActivityAt: string;
  /** Note du dernier quiz par module (maths). */
  lastQuizGrades: Record<string, number>;
  frenchLevel: FrenchSection | "PA";
  /** ISO : masquer le bloc évaluation jusqu'à cette date. */
  evaluationSnoozeUntil?: Record<string, string>;
  /** Niveau de validation : base (≥4), moyen (≥5), avancé (≥5.5). */
  level?: "base" | "moyen" | "avance";
  /** Suivi de complétion par sous-module, ex. "A1-1" → "completed". */
  submoduleStates?: Record<string, ModuleProgressState>;
  /** Score brut des évaluations par sous-module. */
  submoduleScores?: Record<string, { score: number; max: number; grade: number }>;
  /** Leçons français complétées (slug → "completed"). */
  frenchLessons?: Record<string, "completed">;
  /**
   * Évaluations grammaire en attente de correction professeur (Ex7 rédaction).
   * Clefs = slug de leçon.
   */
  frenchEvalPending?: Record<string, {
    autoCorrect: number;
    autoTotal: number;
    writeMax: number;
    lessonCode: string;
    submissionId?: string;
    at: string;
  }>;
  /** Progression communication (id leçon → complété). */
  commProgress?: Record<string, boolean>;
  /** Progression lecture (modules, sous-modules, évaluations). */
  lectureProgress?: {
    version: 2;
    modules: Record<string, string>;
    submodules: Record<string, string>;
    evaluations?: Record<string, { grade: number; passed: boolean; total: number; date: string }>;
    revisions?: Record<string, string>;
  };
  /** Historique local des tentatives d'évaluation (sync cloud via eval_attempts). */
  attemptHistory?: {
    version: 1;
    attempts: Array<{
      subject: string;
      moduleId?: string;
      lessonId?: string;
      lessonKey: string;
      score: number;
      maxScore: number;
      grade?: number;
      attemptNumber: number;
      at: string;
    }>;
  };
};
