import type { MathExerciseItem } from "./math-a1-types";

export const GENERATED_ALGEBRA_LESSONS = new Set([
  "A6-4", "A6-5", "A7-5",
  "A9-1", "A9-2", "A9-3", "A9-4", "A9-5", "A9-6",
  "A10-1", "A10-2", "A10-3", "A10-4",
]);

const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(values: readonly T[]) => values[ri(0, values.length - 1)]!;
const signed = (value: number) => value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;
const answer = (value: number | string) => String(value).replace(".", ",");

function item(id: string, promptFr: string, value: number | string, type: MathExerciseItem["type"] = "number"): MathExerciseItem {
  const normalized = String(value);
  const variants = new Set([normalized, normalized.replace(/−/g, "-")]);
  if (normalized.includes(".")) variants.add(normalized.replace(".", ","));
  const acceptable = [...variants];
  return { id, promptFr, type, acceptable };
}

function expression(a: number, variable: string, b = 0) {
  return `${a === 1 ? "" : a}${variable}${b === 0 ? "" : ` ${signed(b)}`}`;
}

function generateOne(lessonId: string, id: string): MathExerciseItem {
  const variable = pick(["x", "a", "n", "y"] as const);
  const x = ri(-9, 12);
  const a = ri(2, 9);
  const b = ri(-12, 12);

  switch (lessonId) {
    case "A6-4": {
      if (Math.random() < 0.5) {
        const percent = pick([5, 10, 15, 20, 25, 30, 40, 50]);
        const base = ri(4, 80) * 10;
        const result = base * (100 - percent) / 100;
        return item(id, `Un article coûte ${base} CHF avec une réduction de ${percent} %. Quel est son prix final ?`, result);
      }
      const total = ri(4, 20) * 5;
      const percent = pick([20, 25, 40, 50, 60, 75, 80]);
      const part = total * percent / 100;
      return item(id, `${answer(part)} réussites sur ${total} correspondent à quel taux de réussite ?`, percent, "short_text");
    }
    case "A6-5": {
      const mode = ri(0, 3);
      const percent = pick([5, 10, 15, 20, 25, 30, 40, 50]);
      const base = ri(4, 80) * 10;
      if (mode === 0) return item(id, `Calculez ${percent} % de ${base}.`, base * percent / 100);
      if (mode === 1) {
        const total = ri(4, 20) * 5;
        const part = total * percent / 100;
        return item(id, `${answer(part)} personnes sur ${total} représentent quel pourcentage ?`, percent, "short_text");
      }
      const factor = mode === 2 ? 1 + percent / 100 : 1 - percent / 100;
      return item(id, `Une valeur de ${base} est ${mode === 2 ? "augmentée" : "réduite"} de ${percent} %. Quelle est la nouvelle valeur ?`, base * factor);
    }
    case "A7-5": {
      const value = Math.random() < 0.7 ? -ri(1, 100) : ri(1, 100);
      return item(id, `Calculez |${value}|.`, Math.abs(value));
    }
    case "A9-2":
    case "A9-3": {
      const result = a * x + b;
      return item(id, `Calculez ${expression(a, variable, b)} pour ${variable} = ${x}.`, result);
    }
    case "A9-1": {
      const mode = ri(0, 2);
      const exponent = ri(1, 3);
      const literal = exponent === 1 ? variable : `${variable}${["", "", "²", "³"][exponent]}`;
      if (mode === 0) return item(id, `Dans le monôme ${a}${literal}, quel est le coefficient ?`, a);
      if (mode === 1) return item(id, `Dans le monôme ${a}${literal}, quelle est la partie littérale ?`, literal, "short_text");
      return item(id, `Quel est le degré du monôme ${a}${literal} ?`, exponent);
    }
    case "A9-4": {
      const c = ri(1, 9);
      const subtract = Math.random() < 0.5 && a > c;
      const coefficient = subtract ? a - c : a + c;
      return item(id, `Réduisez ${a}${variable} ${subtract ? "−" : "+"} ${c}${variable}.`, `${coefficient}${variable}`, "short_text");
    }
    case "A9-5": {
      const inner = ri(1, 9);
      const minus = Math.random() < 0.5;
      const constant = a * inner * (minus ? -1 : 1);
      return item(id, `Développez ${a}(${variable} ${minus ? "−" : "+"} ${inner}).`, expression(a, variable, constant), "short_text");
    }
    case "A9-6": {
      const factor = ri(2, 9);
      const c = ri(1, 9);
      const minus = Math.random() < 0.5;
      return item(id, `Factorisez ${factor * a}${variable} ${minus ? "−" : "+"} ${factor * c}.`, `${factor}(${a}${variable} ${minus ? "−" : "+"} ${c})`, "short_text");
    }
    case "A10-1": {
      const mode = ri(0, 3);
      if (mode === 0) return item(id, `Résolvez ${a}x = ${a * x}.`, x);
      if (mode === 1) return item(id, `Résolvez ${expression(a, "x", b)} = ${a * x + b}.`, x);
      if (mode === 2) {
        const rightCoefficient = ri(1, a - 1);
        const rightConstant = a * x + b - rightCoefficient * x;
        return item(id, `Résolvez ${expression(a, "x", b)} = ${expression(rightCoefficient, "x", rightConstant)}.`, x);
      }
      const inside = ri(1, 8);
      const minus = Math.random() < 0.5;
      const target = a * (x + (minus ? -inside : inside));
      return item(id, `Résolvez ${a}(x ${minus ? "−" : "+"} ${inside}) = ${target}.`, x);
    }
    case "A10-2": {
      const denominator = ri(2, 9);
      const solution = ri(-8, 12) * denominator;
      const constant = ri(-5, 8);
      const result = solution / denominator + constant;
      return item(id, `Résolvez x/${denominator} ${signed(constant)} = ${result}.`, solution);
    }
    case "A10-3": {
      const y = ri(-8, 10);
      const sum = x + y;
      return item(id, `Système : x + y = ${sum} et y = ${y}. Quelle est la valeur de x ?`, x);
    }
    case "A10-4": {
      const y = ri(-8, 10);
      const first = a * x + y;
      const second = a * x - y;
      return item(id, `Système : ${a}x + y = ${first} et ${a}x − y = ${second}. Quelle est la valeur de x ?`, x);
    }
    default:
      return item(id, `Calculez ${a} × ${Math.abs(x)}.`, a * Math.abs(x));
  }
}

export function generateAlgebraQuestions(lessonId: string, count = 5, seedLabel = "practice"): MathExerciseItem[] {
  return Array.from({ length: count }, (_, index) => generateOne(lessonId, `${lessonId}-${seedLabel}-${index + 1}-${ri(1000, 9999)}`));
}
