import { describe, expect, it } from "vitest";
import { mulberry32 } from "@/lib/rng";
import { makeTestContext } from "@/test/fixtures";
import { generate, paramsSchema } from "./definition";

const ctx = makeTestContext(); // petit lexique de test, niveau A1
const params = paramsSchema.parse({ theme: "test", count: 5 });

describe("__LABEL__", () => {
  it("donne le même résultat avec la même graine", () => {
    expect(generate(params, mulberry32(42), ctx)).toEqual(
      generate(params, mulberry32(42), ctx)
    );
  });

  it("garde items et corrigé alignés, sans doublon, sur 1000 graines", () => {
    for (let seed = 0; seed < 1000; seed++) {
      const { items, answers, warnings } = generate(params, mulberry32(seed), ctx);
      expect(answers).toHaveLength(items.length);
      expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
      expect(warnings ?? []).toEqual([]);
    }
  });

  it("signale une réserve trop petite au lieu de planter", () => {
    const tooMany = { ...params, count: 12 };
    const { warnings } = generate(tooMany, mulberry32(1), ctx);
    expect(warnings?.length).toBeGreaterThan(0);
  });

  it("n'utilise que des mots du niveau visé ou en dessous", () => {
    const { items } = generate(params, mulberry32(3), ctx);
    for (const item of items) {
      const level = ctx.lexicon.byId(item.id)?.level;
      expect(level && ctx.isAtOrBelowLevel(level)).toBe(true);
    }
  });
});
