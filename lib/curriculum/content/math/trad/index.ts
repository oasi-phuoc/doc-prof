import type { SubmoduleTrad } from "./trad-types";
import { enrichSubmoduleTrad } from "./extra-pivots";
import { TRAD_A1_1 } from "./trad-a1-1";
import { TRAD_A1_2 } from "./trad-a1-2";
import { TRAD_A1_3 } from "./trad-a1-3";
import { TRAD_A1_4 } from "./trad-a1-4";
import { TRAD_A1_5 } from "./trad-a1-5";
import { TRAD_A2_1 } from "./trad-a2-1";
import { TRAD_A2_2 } from "./trad-a2-2";
import { TRAD_A2_3 } from "./trad-a2-3";
import { TRAD_A2_4 } from "./trad-a2-4";
import { TRAD_A3_1 } from "./trad-a3-1";
import { TRAD_A3_2 } from "./trad-a3-2";
import { TRAD_A3_3 } from "./trad-a3-3";
import { TRAD_A3_4 } from "./trad-a3-4";
import { TRAD_A3_5 } from "./trad-a3-5";
import { TRAD_A3_6 } from "./trad-a3-6";
import { TRAD_A3_7 } from "./trad-a3-7";
import { TRAD_A4_1 } from "./trad-a4-1";
import { TRAD_A4_2 } from "./trad-a4-2";
import { TRAD_A4_3 } from "./trad-a4-3";
import { TRAD_A4_4 } from "./trad-a4-4";
import { TRAD_A4_5 } from "./trad-a4-5";
import { TRAD_A4_6 } from "./trad-a4-6";
import { TRAD_A4_7 } from "./trad-a4-7";
import { TRAD_A4_8 } from "./trad-a4-8";
import { TRAD_A5_1 } from "./trad-a5-1";
import { TRAD_A5_2 } from "./trad-a5-2";
import { TRAD_A5_3 } from "./trad-a5-3";
import { TRAD_A5_4 } from "./trad-a5-4";
import { TRAD_A5_5 } from "./trad-a5-5";
import { TRAD_A5_6 } from "./trad-a5-6";
import { TRAD_A5_7 } from "./trad-a5-7";
import { TRAD_A6_1 } from "./trad-a6-1";
import { TRAD_A6_2 } from "./trad-a6-2";
import { TRAD_A6_3 } from "./trad-a6-3";
import { TRAD_A6_4 } from "./trad-a6-4";
import { TRAD_A6_5 } from "./trad-a6-5";
import { TRAD_A6_6 } from "./trad-a6-6";
import { TRAD_A6_7 } from "./trad-a6-7";
import { TRAD_A7_1 } from "./trad-a7-1";
import { TRAD_A7_2 } from "./trad-a7-2";
import { TRAD_A7_3 } from "./trad-a7-3";
import { TRAD_A7_4 } from "./trad-a7-4";
import { TRAD_A7_5 } from "./trad-a7-5";
import { TRAD_A8_1 } from "./trad-a8-1";
import { TRAD_A8_2 } from "./trad-a8-2";
import { TRAD_A8_3 } from "./trad-a8-3";
import { TRAD_A8_4 } from "./trad-a8-4";
import { TRAD_A8_5 } from "./trad-a8-5";
import { TRAD_A9_1 } from "./trad-a9-1";
import { TRAD_A9_2 } from "./trad-a9-2";
import { TRAD_A9_3 } from "./trad-a9-3";
import { TRAD_A9_4 } from "./trad-a9-4";
import { TRAD_A9_5 } from "./trad-a9-5";
import { TRAD_A9_6 } from "./trad-a9-6";
import { TRAD_A10_1 } from "./trad-a10-1";
import { TRAD_A10_2 } from "./trad-a10-2";
import { TRAD_A10_3 } from "./trad-a10-3";
import { TRAD_A10_4 } from "./trad-a10-4";
import { TRAD_A11_1 } from "./trad-a11-1";
import { TRAD_A11_2 } from "./trad-a11-2";
import { TRAD_A11_3 } from "./trad-a11-3";
import { TRAD_A11_4 } from "./trad-a11-4";
import { TRAD_A11_5 } from "./trad-a11-5";
import { TRAD_A11_6 } from "./trad-a11-6";
import { TRAD_A11_7 } from "./trad-a11-7";
import { TRAD_G1_1 } from "./trad-g1-1";
import { TRAD_G1_2 } from "./trad-g1-2";
import { TRAD_G2_1 } from "./trad-g2-1";
import { TRAD_G2_2 } from "./trad-g2-2";
import { TRAD_G3_1 } from "./trad-g3-1";
import { TRAD_G3_2 } from "./trad-g3-2";
import { TRAD_G3_3 } from "./trad-g3-3";
import { TRAD_G3_4 } from "./trad-g3-4";
import { TRAD_G3_5 } from "./trad-g3-5";
import { TRAD_G4_1 } from "./trad-g4-1";
import { TRAD_G4_2 } from "./trad-g4-2";
import { TRAD_G4_3 } from "./trad-g4-3";
import { TRAD_G4_4 } from "./trad-g4-4";
import { TRAD_G4_5 } from "./trad-g4-5";
import { TRAD_G4_6 } from "./trad-g4-6";
import { TRAD_G4_7 } from "./trad-g4-7";
import { TRAD_G4_8 } from "./trad-g4-8";
import { TRAD_G5_1 } from "./trad-g5-1";
import { TRAD_G5_2 } from "./trad-g5-2";
import { TRAD_G5_3 } from "./trad-g5-3";
import { TRAD_G5_4 } from "./trad-g5-4";
import { TRAD_G5_5 } from "./trad-g5-5";
import { TRAD_G5_6 } from "./trad-g5-6";
import { TRAD_G6_1 } from "./trad-g6-1";
import { TRAD_G6_2 } from "./trad-g6-2";
import { TRAD_G6_3 } from "./trad-g6-3";
import { TRAD_G6_4 } from "./trad-g6-4";
import { TRAD_G6_5 } from "./trad-g6-5";
import { TRAD_G6_6 } from "./trad-g6-6";
import { TRAD_G6_7 } from "./trad-g6-7";
import { TRAD_G7_1 } from "./trad-g7-1";
import { TRAD_G7_2 } from "./trad-g7-2";
import { TRAD_G7_3 } from "./trad-g7-3";
import { TRAD_G7_4 } from "./trad-g7-4";
import { TRAD_G7_5 } from "./trad-g7-5";

const ALL_TRADS: SubmoduleTrad[] = [
  TRAD_A1_1, TRAD_A1_2, TRAD_A1_3, TRAD_A1_4, TRAD_A1_5,
  TRAD_A2_1, TRAD_A2_2, TRAD_A2_3, TRAD_A2_4,
  TRAD_A3_1, TRAD_A3_2, TRAD_A3_3, TRAD_A3_4, TRAD_A3_5, TRAD_A3_6, TRAD_A3_7,
  TRAD_A4_1, TRAD_A4_2, TRAD_A4_3, TRAD_A4_4, TRAD_A4_5, TRAD_A4_6, TRAD_A4_7, TRAD_A4_8,
  TRAD_A5_1, TRAD_A5_2, TRAD_A5_3, TRAD_A5_4, TRAD_A5_5, TRAD_A5_6, TRAD_A5_7,
  TRAD_A6_1, TRAD_A6_2, TRAD_A6_3, TRAD_A6_4, TRAD_A6_5, TRAD_A6_6, TRAD_A6_7,
  TRAD_A7_1, TRAD_A7_2, TRAD_A7_3, TRAD_A7_4, TRAD_A7_5,
  TRAD_A8_1, TRAD_A8_2, TRAD_A8_3, TRAD_A8_4, TRAD_A8_5,
  TRAD_A9_1, TRAD_A9_2, TRAD_A9_3, TRAD_A9_4, TRAD_A9_5, TRAD_A9_6,
  TRAD_A10_1, TRAD_A10_2, TRAD_A10_3, TRAD_A10_4,
  TRAD_A11_1, TRAD_A11_2, TRAD_A11_3, TRAD_A11_4, TRAD_A11_5, TRAD_A11_6, TRAD_A11_7,
  TRAD_G1_1, TRAD_G1_2,
  TRAD_G2_1, TRAD_G2_2,
  TRAD_G3_1, TRAD_G3_2, TRAD_G3_3, TRAD_G3_4, TRAD_G3_5,
  TRAD_G4_1, TRAD_G4_2, TRAD_G4_3, TRAD_G4_4, TRAD_G4_5, TRAD_G4_6, TRAD_G4_7, TRAD_G4_8,
  TRAD_G5_1, TRAD_G5_2, TRAD_G5_3, TRAD_G5_4, TRAD_G5_5, TRAD_G5_6,
  TRAD_G6_1, TRAD_G6_2, TRAD_G6_3, TRAD_G6_4, TRAD_G6_5, TRAD_G6_6, TRAD_G6_7,
  TRAD_G7_1, TRAD_G7_2, TRAD_G7_3, TRAD_G7_4, TRAD_G7_5,
];

const TRAD_MAP = new Map<string, SubmoduleTrad>(
  ALL_TRADS.map((t) => [t.submoduleId, t]),
);

const ENRICHED = new Map<string, SubmoduleTrad>();

export function getTrad(submoduleId: string): SubmoduleTrad | undefined {
  const cached = ENRICHED.get(submoduleId);
  if (cached) return cached;
  const raw = TRAD_MAP.get(submoduleId);
  if (!raw) return undefined;
  const enriched = enrichSubmoduleTrad(raw);
  ENRICHED.set(submoduleId, enriched);
  return enriched;
}

export type { SubmoduleTrad, BlockTrad, TradString, LangCode } from "./trad-types";
