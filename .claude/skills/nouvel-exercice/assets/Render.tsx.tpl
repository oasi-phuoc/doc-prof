import type { Block } from "@/lib/schema";
import { Consigne } from "@/features/print/Consigne";
import { useConsigne } from "@/features/print/useConsigne";
import type { Answer, Item } from "./definition";

type Props = {
  block: Block;
  data: { items: Item[]; answers: Answer[] };
  mode: "student" | "teacher";
};

export function __Kind__Render({ block, data, mode }: Props) {
  const consigne = useConsigne("__kind__"); // texte issu de src/content/consignes
  const { items, answers } = data;

  return (
    <section
      className="exercise"
      data-kind="__kind__"
      aria-labelledby={`${block.id}-consigne`}
    >
      <Consigne id={`${block.id}-consigne`} picto="relier" text={consigne} />

      <ol className="mt-4 grid gap-4">
        {items.map((item, index) => (
          <li key={item.id}>
            {/* Rendu apprenant·e : espace de réponse dimensionné avec --write-line */}
            {mode === "teacher" ? (
              <span className="font-bold">{answers[index]}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
