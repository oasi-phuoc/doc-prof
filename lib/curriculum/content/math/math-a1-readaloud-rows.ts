import type { ReadAloudRow, ReadAloudWordPart } from "./math-a1-types";

const c = "consonant" as const;
const v = "vowel" as const;
const s = "silent" as const;

function p(text: string, kind: typeof c | typeof v | typeof s): ReadAloudWordPart {
  return { text, kind };
}

function cell(
  num: string,
  parts: ReadAloudWordPart[],
  wordUnderline?: boolean,
): ReadAloudRow["col1"] {
  return wordUnderline ? { num, parts, wordUnderline: true } : { num, parts };
}

/**
 * Tableau « compter en français » : segments alignés sur la fiche CSC
 * (chiffres en bleu côté UI ; voyelles rouge, consonnes noir, muet gris).
 */
export const A1_COMPTER_EN_FRANCAIS_ROWS: ReadAloudRow[] = [
  {
    col1: cell("1", [p("un", v)]),
    col2: cell("11", [p("onz", c), p("e", s)]),
    col3: cell("21", [
      p("v", c),
      p("in", v),
      p("gt", s),
      p(" ", c),
      p("e", v),
      p("t", c),
      p(" ", c),
      p("un", v),
    ]),
  },
  {
    col1: cell("2", [p("d", c), p("eu", v), p("x", s)]),
    col2: cell("12", [p("d", c), p("ou", v), p("z", c), p("e", s)]),
    col3: cell("22", [
      p("v", c),
      p("in", v),
      p("gt", s),
      p(" ", c),
      p("d", c),
      p("eu", v),
      p("x", s),
    ]),
  },
  {
    col1: cell("3", [p("tr", c), p("oi", v), p("s", s)]),
    col2: cell("13", [p("tr", c), p("ei", v), p("z", c), p("e", s)]),
    col3: cell("30", [p("tr", c), p("en", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("4", [p("qu", c), p("a", v), p("tr", c), p("e", s)]),
    col2: cell("14", [p("qu", c), p("a", v), p("t", c), p("or", v), p("z", c), p("e", s)]),
    col3: cell("40", [p("qu", c), p("a", v), p("r", c), p("an", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("5", [p("c", c), p("in", v), p("q", c)], true),
    col2: cell("15", [p("qu", c), p("in", v), p("z", c), p("e", s)]),
    col3: cell("50", [p("c", c), p("in", v), p("qu", c), p("an", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("6", [p("s", c), p("i", v), p("x", c)]),
    col2: cell("16", [p("s", c), p("ei", v), p("z", c), p("e", s)]),
    col3: cell("60", [p("s", c), p("oi", v), p("x", c), p("an", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("7", [p("s", c), p("e", v), p("pt", s)], true),
    col2: cell("17", [
      p("d", c),
      p("i", v),
      p("x", c),
      p("-", c),
      p("s", c),
      p("e", v),
      p("pt", s),
    ]),
    col3: cell("70", [p("s", c), p("e", v), p("pt", c), p("a", v), p("nt", c), p("e", s)]),
  },
  {
    col1: cell("8", [p("h", s), p("ui", v), p("t", c)]),
    col2: cell("18", [
      p("d", c),
      p("i", v),
      p("x", c),
      p("-", c),
      p("h", s),
      p("ui", v),
      p("t", c),
    ]),
    col3: cell("80", [p("h", s), p("ui", v), p("t", c), p("an", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("9", [p("n", c), p("eu", v), p("f", c)]),
    col2: cell("19", [
      p("d", c),
      p("i", v),
      p("x", c),
      p("-", c),
      p("n", c),
      p("eu", v),
      p("f", c),
    ]),
    col3: cell("90", [p("n", c), p("o", v), p("n", c), p("an", v), p("t", c), p("e", s)]),
  },
  {
    col1: cell("10", [p("d", c), p("i", v), p("x", c)]),
    col2: cell("20", [p("v", c), p("in", v), p("gt", s)]),
    col3: cell("100", [p("c", c), p("en", v), p("t", s)], true),
  },
];
