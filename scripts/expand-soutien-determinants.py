#!/usr/bin/env python3
"""Enrichit determinants avec une phrase par mot du type 5 (completes)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANKS = ROOT / "src/francais/soutien/banks.ts"

# Phrases type 10 — une par mot type 5 (completes), style existant.
# blank = déterminant corrigé ; pas de soulignement (u retiré).
PHRASES: dict[str, list[tuple[str, list]]] = {
    "a": [
        ("Le bateau avance sur le lac.", [{"blank": "Le"}, {"t": " bateau avance sur le lac."}]),
        ("Les animaux jouent avec le ballon.", [{"blank": "Les"}, {"t": " animaux jouent avec "}, {"blank": "le"}, {"t": " ballon."}]),
        ("L’avion vole au-dessus de l’arbre.", [{"blank": "L’"}, {"t": " avion vole au-dessus de "}, {"blank": "l’"}, {"t": " arbre."}]),
        ("La famille de Sara mange une salade.", [{"blank": "La"}, {"t": " famille de Sara mange une salade."}]),
        ("Je pose le vase et l’allumette sur une table.", [{"t": "Je pose "}, {"blank": "le"}, {"t": " vase et "}, {"blank": "l’"}, {"t": " allumette sur une table."}]),
        ("L’aspirateur est dans un placard.", [{"blank": "L’"}, {"t": " aspirateur est dans un placard."}]),
        ("La datte est dans mon assiette.", [{"blank": "La"}, {"t": " datte est dans mon assiette."}]),
        ("Je n’arrive pas à allumer les allumettes.", [{"t": "Je n’arrive pas à allumer "}, {"blank": "les"}, {"t": " allumettes."}]),
        ("Le ballon rouge roule dans la cour.", [{"blank": "Le"}, {"t": " ballon rouge roule dans la cour."}]),
        ("L’arbre du parc est très grand.", [{"blank": "L’"}, {"t": " arbre du parc est très grand."}]),
        ("L’animal dort dans la grange.", [{"blank": "L’"}, {"t": " animal dort dans la grange."}]),
        ("Le vase est plein d’eau fraîche.", [{"blank": "Le"}, {"t": " vase est plein d’eau fraîche."}]),
    ],
    "o": [
        ("Le piano est trop lourd à porter.", [{"blank": "Le"}, {"t": " piano est trop lourd à porter."}]),
        ("L’otarie nage près du rocher.", [{"blank": "L’"}, {"t": " otarie nage près du rocher."}]),
        ("Le cobra se cache sous la pierre.", [{"blank": "Le"}, {"t": " cobra se cache sous la pierre."}]),
        ("Le fromage est dans le frigo.", [{"blank": "Le"}, {"t": " fromage est dans "}, {"blank": "le"}, {"t": " frigo."}]),
        ("La moto file sur la route.", [{"blank": "La"}, {"t": " moto file sur la route."}]),
        ("Le donut est sur l’assiette.", [{"blank": "Le"}, {"t": " donut est sur "}, {"blank": "l’"}, {"t": " assiette."}]),
        ("La robe bleue est dans l’armoire.", [{"blank": "La"}, {"t": " robe bleue est dans "}, {"blank": "l’"}, {"t": " armoire."}]),
        ("La coccinelle marche sur la rose.", [{"blank": "La"}, {"t": " coccinelle marche sur la rose."}]),
        ("Le flocon tombe sur le manteau.", [{"blank": "Le"}, {"t": " flocon tombe sur "}, {"blank": "le"}, {"t": " manteau."}]),
        ("Le losange est dessiné au tableau.", [{"blank": "Le"}, {"t": " losange est dessiné au tableau."}]),
        ("Le robot marche tout seul.", [{"blank": "Le"}, {"t": " robot marche tout seul."}]),
        ("L’orange est juteuse et ronde.", [{"blank": "L’"}, {"t": " orange est juteuse et ronde."}]),
    ],
    "i": [
        ("Le tigre dort dans la jungle.", [{"blank": "Le"}, {"t": " tigre dort dans la jungle."}]),
        ("Le briquet est sur la table.", [{"blank": "Le"}, {"t": " briquet est sur la table."}]),
        ("Le cookie est trop sucré.", [{"blank": "Le"}, {"t": " cookie est trop sucré."}]),
        ("Le canari chante près de la fenêtre.", [{"blank": "Le"}, {"t": " canari chante près de la fenêtre."}]),
        ("Le kiwi est vert et acidulé.", [{"blank": "Le"}, {"t": " kiwi est vert et acidulé."}]),
        ("L’épinard est dans le panier.", [{"blank": "L’"}, {"t": " épinard est dans "}, {"blank": "le"}, {"t": " panier."}]),
        ("Le citron est très acide.", [{"blank": "Le"}, {"t": " citron est très acide."}]),
        ("La cerise tombe de l’arbre.", [{"blank": "La"}, {"t": " cerise tombe de "}, {"blank": "l’"}, {"t": " arbre."}]),
        ("La viande est dans le frigo.", [{"blank": "La"}, {"t": " viande est dans "}, {"blank": "le"}, {"t": " frigo."}]),
        ("Le hérisson se cache sous les feuilles.", [{"blank": "Le"}, {"t": " hérisson se cache sous les feuilles."}]),
        ("Le navire avance sur la mer.", [{"blank": "Le"}, {"t": " navire avance sur la mer."}]),
        ("Le hibou crie dans la nuit.", [{"blank": "Le"}, {"t": " hibou crie dans la nuit."}]),
    ],
    "u": [
        ("L’uniforme est propre et rangé.", [{"blank": "L’"}, {"t": " uniforme est propre et rangé."}]),
        ("La sucette est trop sucrée.", [{"blank": "La"}, {"t": " sucette est trop sucrée."}]),
        ("Le biscuit est dans la boîte.", [{"blank": "Le"}, {"t": " biscuit est dans la boîte."}]),
        ("La prune mûre tombe du prunier.", [{"blank": "La"}, {"t": " prune mûre tombe du prunier."}]),
        ("Le nuage cache le soleil.", [{"blank": "Le"}, {"t": " nuage cache "}, {"blank": "le"}, {"t": " soleil."}]),
        ("L’huile est dans la bouteille.", [{"blank": "L’"}, {"t": " huile est dans la bouteille."}]),
        ("La plume flotte dans le vent.", [{"blank": "La"}, {"t": " plume flotte dans "}, {"blank": "le"}, {"t": " vent."}]),
        ("Le muguet parfumé pousse au jardin.", [{"blank": "Le"}, {"t": " muguet parfumé pousse au jardin."}]),
        ("La luciole brille dans la nuit.", [{"blank": "La"}, {"t": " luciole brille dans la nuit."}]),
        ("La peinture est encore fraîche.", [{"blank": "La"}, {"t": " peinture est encore fraîche."}]),
        ("Le pull turquoise est unique.", [{"blank": "Le"}, {"t": " pull turquoise est unique."}]),
        ("La dune surplombe le rivage.", [{"blank": "La"}, {"t": " dune surplombe "}, {"blank": "le"}, {"t": " rivage."}]),
    ],
    "e": [
        ("La crevette est dans l’assiette.", [{"blank": "La"}, {"t": " crevette est dans "}, {"blank": "l’"}, {"t": " assiette."}]),
        ("La fenêtre est ouverte sur le jardin.", [{"blank": "La"}, {"t": " fenêtre est ouverte sur "}, {"blank": "le"}, {"t": " jardin."}]),
        ("La pelote de laine est sur la table.", [{"blank": "La"}, {"t": " pelote de laine est sur la table."}]),
        ("Le requin nage dans la mer.", [{"blank": "Le"}, {"t": " requin nage dans la mer."}]),
        ("La recette est écrite au tableau.", [{"blank": "La"}, {"t": " recette est écrite au tableau."}]),
        ("La chemise bleue est pliée.", [{"blank": "La"}, {"t": " chemise bleue est pliée."}]),
        ("La peluche est sur le lit.", [{"blank": "La"}, {"t": " peluche est sur "}, {"blank": "le"}, {"t": " lit."}]),
        ("La grenade est un fruit juteux.", [{"blank": "La"}, {"t": " grenade est un fruit juteux."}]),
        ("Le chemin mène à l’école.", [{"blank": "Le"}, {"t": " chemin mène à "}, {"blank": "l’"}, {"t": " école."}]),
        ("Le repas est prêt pour midi.", [{"blank": "Le"}, {"t": " repas est prêt pour midi."}]),
        ("Le melon n’est pas pour eux.", [{"blank": "Le"}, {"t": " melon n’est pas pour eux."}]),
        ("Le bébé dort dans son berceau.", [{"blank": "Le"}, {"t": " bébé dort dans son berceau."}]),
    ],
    "y": [
        ("Le stylo est sur le bureau.", [{"blank": "Le"}, {"t": " stylo est sur "}, {"blank": "le"}, {"t": " bureau."}]),
        ("Le pyjama est confortable.", [{"blank": "Le"}, {"t": " pyjama est confortable."}]),
        ("La bicyclette est dans le garage.", [{"blank": "La"}, {"t": " bicyclette est dans "}, {"blank": "le"}, {"t": " garage."}]),
        ("Le cygne nage sur l’étang.", [{"blank": "Le"}, {"t": " cygne nage sur "}, {"blank": "l’"}, {"t": " étang."}]),
        ("Le gymnaste saute très haut.", [{"blank": "Le"}, {"t": " gymnaste saute très haut."}]),
        ("La pyramide est immense.", [{"blank": "La"}, {"t": " pyramide est immense."}]),
        ("L’encyclopédie est sur l’étagère.", [{"blank": "L’"}, {"t": " encyclopédie est sur "}, {"blank": "l’"}, {"t": " étagère."}]),
        ("La myrtille est bleue et sucrée.", [{"blank": "La"}, {"t": " myrtille est bleue et sucrée."}]),
        ("Le cyclone approche de la côte.", [{"blank": "Le"}, {"t": " cyclone approche de la côte."}]),
        ("Le gymnase est grand et clair.", [{"blank": "Le"}, {"t": " gymnase est grand et clair."}]),
        ("L’hydravion atterrit à midi.", [{"blank": "L’"}, {"t": " hydravion atterrit à midi."}]),
        ("Le kayak glisse sur le lac.", [{"blank": "Le"}, {"t": " kayak glisse sur "}, {"blank": "le"}, {"t": " lac."}]),
    ],
}


def fmt_part(p: dict) -> str:
    if "blank" in p:
        return f"{{ blank: '{p['blank']}' }}"
    t = p["t"].replace("\\", "\\\\").replace("'", "\\'")
    return f"{{ t: '{t}' }}"


def fmt_entry(sentence: str, parts: list) -> str:
    s = sentence.replace("\\", "\\\\").replace("'", "\\'")
    parts_src = ", ".join(fmt_part(p) for p in parts)
    if len(parts) == 1 or (len(parts) == 2 and "blank" in parts[0] and "t" in parts[1]):
        return (
            "      {\n"
            f"        parts: [{parts_src}],\n"
            f"        sentence: '{s}',\n"
            "      }"
        )
    # multiline for longer
    inner = ",\n          ".join(fmt_part(p) for p in parts)
    return (
        "      {\n"
        "        parts: [\n"
        f"          {inner},\n"
        "        ],\n"
        f"        sentence: '{s}',\n"
        "      }"
    )


def main() -> None:
    text = BANKS.read_text()
    for vid, rows in PHRASES.items():
        assert len(rows) >= 10, (vid, len(rows))
        block_lines = ["    determinants: ["]
        for i, (sentence, parts) in enumerate(rows):
            entry = fmt_entry(sentence, parts)
            block_lines.append(entry + (",\n" if i < len(rows) - 1 else "\n"))
        block_lines.append("    ],")
        new_block = "\n".join(block_lines)
        pattern = rf"(id: '{vid}'[\s\S]*?)(    determinants: \[[\s\S]*?\n    \],)"
        m = re.search(pattern, text)
        if not m:
            raise SystemExit(f"determinants block not found for {vid}")
        text = text[: m.start(2)] + new_block + text[m.end(2) :]
        print(vid, "->", len(rows))
    BANKS.write_text(text)
    print("ok")


if __name__ == "__main__":
    main()
