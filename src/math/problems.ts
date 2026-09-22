import type { Difficulty } from './types'
import { pairAdd, pairDiv, pairMul, pairSub } from './difficulty'
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'

type ProblemMaker = (rng: Rng, difficulty: Difficulty) => MathItem

function problem(
  prompt: string,
  calc: string,
  response: string,
): MathItem {
  return {
    layout: 'text',
    prompt,
    calcAnswer: calc,
    responseAnswer: response,
    answer: `${calc} = ${response}`,
  }
}

/** Problèmes d'addition — A1 / A2 avec piège / B1 multi-étapes. */
const addProblems: Record<Difficulty, ProblemMaker[]> = {
  facile: [
    (rng, d) => {
      const p = pairAdd(rng, d)
      return problem(
        pick(rng, [
          `Lina a ${p.a} billes. Elle en gagne ${p.b}. Combien a-t-elle de billes ?`,
          `Il y a ${p.a} pommes. On ajoute ${p.b} pommes. Combien y a-t-il de pommes ?`,
          `Noa a ${p.a} CHF. On lui donne ${p.b} CHF. Combien a-t-il ?`,
        ]),
        `${p.a} + ${p.b}`,
        String(p.result),
      )
    },
  ],
  moyen: [
    (rng, d) => {
      const p = pairAdd(rng, d)
      const trap = int(rng, 2, Math.min(40, calcTrap(d)))
      return problem(
        pick(rng, [
          `Léa a ${p.a} billes dans une boîte bleue et ${trap} billes dans une boîte rouge. Elle gagne ${p.b} billes pour la boîte bleue. Combien a-t-elle de billes dans la boîte bleue ?`,
          `Un bus compte ${p.a} passagers. ${trap} personnes attendent à l’arrêt suivant. ${p.b} personnes montent. Combien y a-t-il de passagers dans le bus ?`,
          `Sam a économisé ${p.a} CHF. Son frère a ${trap} CHF. On donne ${p.b} CHF à Sam. Combien Sam a-t-il maintenant ?`,
        ]),
        `${p.a} + ${p.b}`,
        String(p.result),
      )
    },
  ],
  avance: [
    (rng, d) => {
      const p = pairAdd(rng, d)
      const extra = int(rng, 2, Math.min(50, Math.floor(p.a / 4) || 5))
      const total = p.result + extra
      return problem(
        pick(rng, [
          `Une classe a déjà ${p.a} stylos. On reçoit deux cartons de ${p.b} et ${extra} stylos. Combien de stylos la classe a-t-elle en tout ?`,
          `Noa met ${p.a} CHF de côté, puis ${p.b} CHF, puis encore ${extra} CHF. Combien a-t-il économisé au total ?`,
          `Un magasin a vendu ${p.a} cahiers le matin et ${p.b} l’après-midi. Le soir, ${extra} cahiers sont encore vendus. Combien de cahiers ont été vendus dans la journée ?`,
        ]),
        `${p.a} + ${p.b} + ${extra}`,
        String(total),
      )
    },
  ],
}

const subProblems: Record<Difficulty, ProblemMaker[]> = {
  facile: [
    (rng, d) => {
      const p = pairSub(rng, d)
      return problem(
        pick(rng, [
          `Lina a ${p.a} billes. Elle en donne ${p.b}. Combien lui en reste-t-il ?`,
          `Il y a ${p.a} pommes. On en mange ${p.b}. Combien reste-t-il de pommes ?`,
          `Noa a ${p.a} CHF. Il dépense ${p.b} CHF. Combien lui reste-t-il ?`,
        ]),
        `${p.a} − ${p.b}`,
        String(p.result),
      )
    },
  ],
  moyen: [
    (rng, d) => {
      const p = pairSub(rng, d)
      const trap = int(rng, 2, Math.min(40, calcTrap(d)))
      return problem(
        pick(rng, [
          `Léa a ${p.a} billes. Elle en prête ${p.b} à Sam et en voit ${trap} par terre (elle ne les ramasse pas). Combien lui reste-t-il ?`,
          `Un bus part avec ${p.a} passagers. ${p.b} descendent. ${trap} personnes regardent le bus depuis le trottoir. Combien reste-t-il de passagers ?`,
          `Noa a ${p.a} CHF. Il achète un cadeau à ${p.b} CHF. Son frère a encore ${trap} CHF. Combien reste-t-il à Noa ?`,
        ]),
        `${p.a} − ${p.b}`,
        String(p.result),
      )
    },
  ],
  avance: [
    (rng, d) => {
      const start = pairSub(rng, d).a
      const first = int(rng, 2, Math.max(3, Math.floor(start / 3)))
      const second = int(rng, 1, Math.max(2, start - first - 1))
      const left = start - first - second
      return problem(
        pick(rng, [
          `Une bibliothèque a ${start} livres. On en prête ${first}, puis on en range ${second} dans une autre salle. Combien de livres restent sur les rayons ?`,
          `Noa a ${start} CHF. Il dépense ${first} CHF le matin et ${second} CHF l’après-midi. Combien lui reste-t-il ?`,
          `Un réservoir contient ${start} litres. On en utilise ${first} litres, puis ${second} litres. Combien de litres restent ?`,
        ]),
        `${start} − ${first} − ${second}`,
        String(left),
      )
    },
  ],
}

const mulProblems: Record<Difficulty, ProblemMaker[]> = {
  facile: [
    (rng, d) => {
      const p = pairMul(rng, d)
      return problem(
        pick(rng, [
          `Une boîte contient ${p.a} crayons. Combien y a-t-il de crayons dans ${p.b} boîtes ?`,
          `Un cahier coûte ${p.a} CHF. Combien coûtent ${p.b} cahiers ?`,
        ]),
        `${p.a} × ${p.b}`,
        String(p.result),
      )
    },
  ],
  moyen: [
    (rng, d) => {
      const p = pairMul(rng, d)
      const trap = int(rng, 2, 20)
      return problem(
        pick(rng, [
          `Chaque boîte contient ${p.a} crayons. On a ${p.b} boîtes pleines et ${trap} crayons seuls (déjà comptés à part). Combien de crayons y a-t-il dans les boîtes ?`,
          `Un billet de spectacle coûte ${p.a} CHF. Une famille achète ${p.b} billets. Le parking coûte ${trap} CHF (paiement séparé). Combien coûtent les billets ?`,
        ]),
        `${p.a} × ${p.b}`,
        String(p.result),
      )
    },
  ],
  avance: [
    (rng, d) => {
      const p = pairMul(rng, d)
      const discount = int(rng, 1, Math.min(15, Math.floor(p.result / 5) || 1))
      return problem(
        pick(rng, [
          `${p.b} cahiers coûtent ${p.a} CHF chacun. Le magasin offre une réduction de ${discount} CHF sur le total. Combien paie-t-on finalement ?`,
          `Une rangée a ${p.a} chaises. Il y a ${p.b} rangées. On enlève ${discount} chaises cassées. Combien reste-t-il de chaises utilisables ?`,
        ]),
        `${p.a} × ${p.b} − ${discount}`,
        String(p.result - discount),
      )
    },
  ],
}

const divProblems: Record<Difficulty, ProblemMaker[]> = {
  facile: [
    (rng, d) => {
      const p = pairDiv(rng, d)
      return problem(
        pick(rng, [
          `On partage ${p.a} billes entre ${p.b} enfants, équitablement. Combien chacun reçoit-il ?`,
          `${p.a} élèves forment des groupes de ${p.b}. Combien de groupes obtient-on ?`,
        ]),
        `${p.a} ÷ ${p.b}`,
        String(p.result),
      )
    },
  ],
  moyen: [
    (rng, d) => {
      const p = pairDiv(rng, d)
      const trap = int(rng, 2, 15)
      return problem(
        pick(rng, [
          `On partage ${p.a} billes entre ${p.b} enfants. Il reste aussi ${trap} billes dans une autre boîte (non partagées). Combien chaque enfant reçoit-il ?`,
          `${p.a} cartes sont rangées par paquets de ${p.b}. ${trap} cartes d’un autre jeu restent sur la table. Combien de paquets complets obtient-on ?`,
        ]),
        `${p.a} ÷ ${p.b}`,
        String(p.result),
      )
    },
  ],
  avance: [
    (rng, d) => {
      const p = pairDiv(rng, d)
      const leftover = int(rng, 1, Math.max(1, p.b - 1))
      const total = p.a + leftover
      return problem(
        pick(rng, [
          `On a ${total} gommes. On remplit des boîtes de ${p.b} gommes. Combien de boîtes complètes obtient-on, et combien de gommes restent ?`,
          `${total} élèves doivent former des groupes de ${p.b}. Combien de groupes complets peut-on former, et combien d’élèves restent sans groupe ?`,
        ]),
        `${total} ÷ ${p.b}`,
        `${p.result} reste ${leftover}`,
      )
    },
  ],
}

function calcTrap(d: Difficulty): number {
  if (d === 'facile') return 10
  if (d === 'moyen') return 80
  return 200
}

export function makeWordProblem(
  rng: Rng,
  difficulty: Difficulty,
  kind: 'addition' | 'soustraction' | 'multiplication' | 'division',
): MathItem {
  const table =
    kind === 'addition'
      ? addProblems
      : kind === 'soustraction'
        ? subProblems
        : kind === 'multiplication'
          ? mulProblems
          : divProblems
  const makers = table[difficulty]
  return pick(rng, makers)(rng, difficulty)
}
