#!/usr/bin/env python3
"""Régénère sentences.phrase (10 × A1/A2/B1) — sens réel type Gattegno.

Règles : .claude/skills/calligraphie-phrases/SKILL.md
Sujet = personne (sauf états météo / lieux) ; complément qui va avec le verbe.
Ne modifie ni trous ni dictee.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK_DIR = ROOT / "src" / "francais" / "vocab-banks"
MAX_CHARS = 36
VOWELS = set("aeiouyàâäéèêëïîôùûühAEIOUYÀÂÄÉÈÊËÏÎÔÙÛÜH")

CAT = {
    "v7-fruits": "food",
    "v7-legumes": "food",
    "v7-boulangerie": "food",
    "v7-recettes": "food",
    "v7-quantites": "food",
    "v7-cuisine": "verb",
    "v7-restaurant": "food",
    "v6-vetements": "clothes",
    "v6-accessoires": "clothes",
    "v6-couleurs": "color",
    "v6-matieres": "material",
    "v1-description-physique": "adj",
    "v1-description-morale": "adj",
    "v1-etat-civil": "adj_status",
    "v1-nationalites": "nationality",
    "v1-famille": "person",
    "v1-professions": "person",
    "v4-pieces-maison": "place",
    "v4-type-logement": "place",
    "v4-equipements": "object",
    "v4-appareils-electromenagers": "object",
    "v4-pannes": "panne",
    "v5-materiel-scolaire": "object",
    "v5-matieres": "school",
    "v5-structure-ecole": "place",
    "v8-corps": "body",
    "v8-maladies": "illness",
    "v8-medecins": "person",
    "v8-pharmacie": "object",
    "v2-meteo": "weather",
    "v2-saisons": "season",
    "v2-heure": "time",
    "v2-jours-mois-dates": "calendar",
    "v9-transport": "transport",
    "v9-aeroport": "travel",
    "v9-train": "travel",
    "v9-hotel": "place",
    "v9-direction": "expr",
    "v9-espace-culturel": "place",
    "v9-paysage": "landscape",
    "v9-ville": "place",
    "v3-sport": "sport",
    "v10-animaux": "animal",
}

# Mots abstraits / cas particuliers (hors gabarit véhicule / objet)
WORD_CAT = {
    "retard": "abstract",
    "correspondance": "abstract",
    "billet": "object",
    "horaire": "object",
    "quai": "place",
    "voie": "place",
    "guichet": "place",
    "contrôleur": "person",
    "contrôleuse": "person",
    "voyageur": "person",
    "voyageuse": "person",
    "passager": "person",
    "passagère": "person",
    "boisson": "drink",
    "eau": "drink",
    "jus": "drink",
    "lait": "drink",
    "café": "drink",
    "thé": "drink",
    "vin": "drink",
    "bière": "drink",
    "limonade": "drink",
    "chocolat chaud": "drink",
    "dessert": "food",
    "entrée": "food",
    "plat": "food",
    "addition": "object",
    "pourboire": "object",
    "menu": "object",
    "célibataire": "adj_status",
    "marié": "adj_status",
    "mariée": "adj_status",
    "divorcé": "adj_status",
    "divorcée": "adj_status",
    "veuf": "adj_status",
    "veuve": "adj_status",
    "fiancé": "adj_status",
    "fiancée": "adj_status",
}

FEM = {
    "pomme", "poire", "banane", "cerise", "orange", "tomate", "carotte", "salade",
    "soupe", "baguette", "boîte", "bouteille", "assiette", "casserole", "cuillère",
    "fourchette", "robe", "jupe", "chemise", "veste", "écharpe", "chaussure", "bague",
    "chambre", "cuisine", "cave", "terrasse", "maison", "cabane", "armoire", "table",
    "lampe", "ampoule", "porte", "fenêtre", "bibliothèque", "école", "classe",
    "voiture", "gare", "pharmacie", "pluie", "neige", "averse", "tempête", "île",
    "mer", "montagne", "forêt", "rivière", "campagne", "cascade", "ville", "rue",
    "avenue", "place", "cousine", "mère", "sœur", "tante", "fille", "femme",
    "bouche", "tête", "main", "jambe", "dent", "fièvre", "grippe", "toux", "allergie",
    "heure", "année", "semaine", "journée", "saison", "course", "danse", "photo",
    "addition", "carte", "valise", "consultation", "arrivée", "casquette", "trousse",
    "feuille", "agrafeuse", "équerre", "perforatrice", "madeleine", "pâtisserie",
    "viennoiserie", "infirmerie", "direction", "bibliothèque",
}

PLURAL = {
    "chaussettes", "chaussons", "chaussures", "boucles d'oreilles", "lunettes",
    "gants", "baskets", "sandales",
}

MASS_WEATHER = {
    "brouillard", "soleil", "vent", "nuage", "neige", "pluie", "grêle", "orage",
    "averse", "tempête", "arc-en-ciel", "gel", "brume", "humidité",
}


def hash_offset(word_id: str, mod: int) -> int:
    h = hashlib.md5(word_id.encode()).hexdigest()
    return int(h[:8], 16) % max(mod, 1)


def vowel(w: str) -> bool:
    return bool(w) and w[0] in VOWELS


def gender(label: str, entry: dict) -> str:
    if entry.get("feminine") == label:
        return "f"
    if entry.get("masculine") == label:
        return "m"
    low = label.lower()
    if low in FEM:
        return "f"
    if low.endswith(("tion", "sion", "ette", "elle", "ance", "ence", "ure", "ade", "ée")):
        return "f"
    if low.endswith(("age", "isme", "ment", "eau", "oir")):
        return "m"
    if low.endswith("e") and not low.endswith(("iste", "aire")):
        return "f"
    return "m"


def arts(label: str, g: str) -> tuple[str, str, str, str]:
    """def, ind, poss, partitif."""
    if label in PLURAL or label.endswith("s") and " " not in label and label not in {"bus", "corps", "temps"}:
        return "les ", "des ", "mes ", "des "
    if vowel(label):
        return "l'", "un " if g == "m" else "une ", "mon " if g == "m" else "ma ", "de l'"
    if g == "f":
        return "la ", "une ", "ma ", "de la "
    return "le ", "un ", "mon ", "du "


def fit(s: str) -> str | None:
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("l' ", "l'").replace("d' ", "d'")
    s = re.sub(r"\bde le\b", "du", s)
    s = re.sub(r"\bà le\b", "au", s)
    s = re.sub(r"\bde les\b", "des", s)
    s = re.sub(r"\bà les\b", "aux", s)
    s = re.sub(r"\bprès de le\b", "près du", s)
    if not s:
        return None
    s = s[0].upper() + s[1:]
    if not s.endswith((".", "?", "!")):
        s += "."
    return s if len(s) <= MAX_CHARS else None


def clean(pool: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for s in pool:
        t = fit(s)
        if not t or t in seen:
            continue
        low = t.lower()
        if any(
            bad in low
            for bad in (
                "le mot ",
                "j’écoute le mot",
                "je vois le mot",
                "voici le mot",
                "moins célibataire",
                "oublié mon brouillard",
                "oublié le brouillard",
                "oublié ma pluie",
                "oublié le soleil",
                "mis l'ascenseur",
                "mis l’ascenseur",
            )
        ):
            continue
        seen.add(t)
        out.append(t)
    return out


def rotate(pool: list[str], offset: int, n: int = 10) -> list[str]:
    if not pool:
        return []
    out: list[str] = []
    i = offset
    seen: set[str] = set()
    guard = 0
    while len(out) < n and guard < len(pool) * 4:
        cand = pool[i % len(pool)]
        i += 1
        guard += 1
        if cand in seen:
            continue
        seen.add(cand)
        out.append(cand)
    return out


def cat_for(entry: dict) -> str:
    label = (entry.get("label") or "").strip().lower()
    if label in WORD_CAT:
        return WORD_CAT[label]
    sg = entry.get("subgroup") or ""
    if sg in CAT:
        return CAT[sg]
    if " " in label or label.startswith(("à ", "au ", "en ", "de ", "du ")):
        return "expr"
    masc = (entry.get("masculine") or "").strip()
    fem = (entry.get("feminine") or "").strip()
    if masc and fem and masc != fem:
        return "adj"
    return "object"


def phrases_abstract(label: str, g: str) -> dict[str, list[str]]:
    """Concepts (retard, correspondance…) — jamais « monter dans le retard »."""
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Il y a {i}{label}.",
        f"Léa a {i}{label}.",
        f"Noah évite {d}{label}.",
        f"Je crains {d}{label}.",
        f"Elle annonce {d}{label}.",
        f"Tu as {i}{label} ?",
        f"On parle de {d}{label}.",
        f"Papa signale {d}{label}.",
        f"Qui a {i}{label} ?",
        f"Voici {d}{label}.",
        f"Mila note {d}{label}.",
        f"Il explique {d}{label}.",
        f"Regarde : {d}{label}.",
        f"C’est {d}{label}.",
    ]
    a2 = [
        f"Hier, il y a eu {i}{label}.",
        f"Elle a annoncé {d}{label}.",
        f"Nous avons eu {i}{label}.",
        f"Tu as eu {i}{label} ?",
        f"Il a signalé {d}{label}.",
        f"On a parlé de {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"J’ai eu {i}{label}.",
        f"Papa a annoncé {d}{label}.",
        f"Léa a eu {i}{label}.",
        f"As-tu noté {d}{label} ?",
        f"Ils ont eu {i}{label}.",
        f"On va éviter {d}{label}.",
        f"Elle craint {d}{label}.",
    ]
    b1 = [
        f"S’il y a {i}{label}, attends.",
        f"Pourquoi crains-tu {d}{label} ?",
        f"Sans {d}{label}, on part à l’heure.",
        f"Quand {d}{label} arrive, on attend.",
        f"Où as-tu vu {d}{label} ?",
        f"Comme il y a {i}{label}, on attend.",
        f"Annonce {d}{label} tout de suite.",
        f"On évite {d}{label} si on peut.",
        f"J’ai peur de {d}{label}.",
        f"Note {d}{label} dans le carnet.",
        f"Avec {d}{label}, on change d’horaire.",
        f"Tu as déjà eu {i}{label} ?",
        f"Avant de partir, vérifie {d}{label}.",
        f"Voici encore {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def short_fillers(label: str, cat: str, g: str, forms: set[str], entry: dict) -> list[str]:
    """Secours courts, adaptés à la catégorie (pas « Elle a le brouillard »)."""
    if cat in ("adj", "adj_status", "nationality"):
        m = entry.get("masculine") or label
        f = entry.get("feminine") or label
        pool = [
            f"Léa est {f}.",
            f"Noah est {m}.",
            f"Il est {m}.",
            f"Elle est {f}.",
            f"Tu es {m} ?",
            f"Papa est {m}.",
            f"Maman est {f}.",
            f"Mon ami est {m}.",
            f"Ma sœur est {f}.",
            f"Il n’est pas {m}.",
            f"Elle n’est pas {f}.",
            f"On dit qu’il est {m}.",
            f"Reste {m}.",
            f"Elle reste {f}.",
        ]
    elif cat == "weather":
        d, _, _, part = arts(label, g)
        pool = [
            f"Il y a {part}{label}.",
            f"Je vois {d}{label}.",
            f"Tu vois {d}{label} ?",
            f"Léa voit {d}{label}.",
            f"Noah craint {d}{label}.",
            f"Regarde {d}{label}.",
            f"Voici {d}{label}.",
            f"On parle {part}{label}.",
            f"J’aime {d}{label}.",
            f"Elle observe {d}{label}.",
            f"Qui a vu {d}{label} ?",
            f"{d[0].upper() + d[1:]}{label} arrive.",
        ]
    elif cat in ("verb",):
        pool = [
            f"Je vais {label}.",
            f"Léa veut {label}.",
            f"Noah doit {label}.",
            f"Tu sais {label} ?",
            f"Il faut {label}.",
            f"Elle peut {label}.",
            f"On va {label}.",
            f"J’aime {label}.",
            f"Qui peut {label} ?",
            f"Papa veut {label}.",
        ]
    else:
        d, i, p, _ = arts(label, g)
        pool = [
            f"Léa aime {d}{label}.",
            f"Noah voit {d}{label}.",
            f"J’aime {d}{label}.",
            f"Où est {d}{label} ?",
            f"Tu vois {d}{label} ?",
            f"Regarde {d}{label}.",
            f"Voici {d}{label}.",
            f"C’est {d}{label}.",
            f"Je prends {i}{label}.",
            f"Elle cherche {d}{label}.",
            f"Il cherche {d}{label}.",
            f"On voit {d}{label}.",
            f"Tu aimes {d}{label} ?",
            f"J’ai vu {d}{label}.",
            f"Papa a {i}{label}.",
            f"Mila veut {i}{label}.",
            f"Qui veut {i}{label} ?",
            f"Prends {d}{label}.",
            f"Cherche {d}{label}.",
            f"Sans {d}{label}, non.",
        ]
    return [s for s in clean(pool) if any(f in s.lower() for f in forms if f)]


# —— Patrons par catégorie ——

def phrases_food(label: str, g: str) -> dict[str, list[str]]:
    d, i, p, _ = arts(label, g)
    a1 = [
        f"Léa mange {i}{label}.",
        f"Noah aime {d}{label}.",
        f"Je prends {p}{label}.",
        f"Elle coupe {d}{label}.",
        f"Nous achetons {i}{label}.",
        f"Tu veux {i}{label} ?",
        f"Qui a mangé {d}{label} ?",
        f"Papa apporte {i}{label}.",
        f"On partage {d}{label}.",
        f"Mila goûte {d}{label}.",
        f"Il préfère {d}{label}.",
        f"J’aime {d}{label}.",
        f"Elle aime {d}{label}.",
        f"Où est {d}{label} ?",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai mangé {i}{label}.",
        f"Elle a acheté {d}{label}.",
        f"Nous avons partagé {d}{label}.",
        f"Tu as goûté {d}{label} ?",
        f"Je prendrai {i}{label}.",
        f"Qui a apporté {d}{label} ?",
        f"Il a oublié {p}{label}.",
        f"Elle va préparer {d}{label}.",
        f"On va acheter {i}{label}.",
        f"As-tu lavé {d}{label} ?",
        f"J’ai mis {d}{label} là.",
        f"Ils ont mangé {d}{label}.",
        f"J’ai vu {d}{label}.",
        f"Papa a coupé {d}{label}.",
    ]
    b1 = [
        f"Si tu as faim, prends {i}{label}.",
        f"Comme j’aime {d}{label}, j’en veux.",
        f"Range {d}{label} avant de partir.",
        f"Pourquoi as-tu coupé {d}{label} ?",
        f"Sans {d}{label}, le goûter change.",
        f"Si tu veux, goûte {d}{label}.",
        f"Où as-tu mis {d}{label} ?",
        f"Quand {d}{label} est prêt, on mange." if g != "f" else f"Quand {d}{label} est prête, on mange.",
        f"Dès que je vois {d}{label}, j’ai faim.",
        f"Puisque {d}{label} est bon, prends-en." if g != "f" else f"Puisque {d}{label} est bonne, prends-en.",
        f"Avant le repas, lave {d}{label}.",
        f"Même petit, {d}{label} est bon." if g != "f" else f"Même petite, {d}{label} est bonne.",
        f"Prends {d}{label} si tu as faim.",
        f"J’en veux encore de {d}{label}." if not vowel(label) else f"J’en veux encore {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_drink(label: str, g: str) -> dict[str, list[str]]:
    d, i, p, _ = arts(label, g)
    a1 = [
        f"Léa boit {i}{label}.",
        f"Noah aime {d}{label}.",
        f"Je prends {p}{label}.",
        f"Elle verse {d}{label}.",
        f"Nous achetons {i}{label}.",
        f"Tu veux {i}{label} ?",
        f"Qui a bu {d}{label} ?",
        f"Papa apporte {i}{label}.",
        f"On partage {d}{label}.",
        f"Mila goûte {d}{label}.",
        f"Il préfère {d}{label}.",
        f"J’aime {d}{label}.",
        f"Où est {d}{label} ?",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai bu {i}{label}.",
        f"Elle a acheté {d}{label}.",
        f"Nous avons partagé {d}{label}.",
        f"Tu as goûté {d}{label} ?",
        f"Je prendrai {i}{label}.",
        f"Qui a apporté {d}{label} ?",
        f"Il a oublié {p}{label}.",
        f"Elle va servir {d}{label}.",
        f"On va acheter {i}{label}.",
        f"As-tu versé {d}{label} ?",
        f"J’ai mis {d}{label} là.",
        f"Ils ont bu {d}{label}.",
        f"Papa a bu {d}{label}.",
        f"Léa a pris {d}{label}.",
    ]
    b1 = [
        f"Si tu as soif, prends {i}{label}.",
        f"Comme j’aime {d}{label}, j’en veux.",
        f"Verse {d}{label} avant de partir.",
        f"Pourquoi as-tu bu {d}{label} ?",
        f"Sans {d}{label}, j’ai soif.",
        f"Si tu veux, goûte {d}{label}.",
        f"Où as-tu mis {d}{label} ?",
        f"Quand {d}{label} est prêt, on boit." if g != "f" else f"Quand {d}{label} est prête, on boit.",
        f"Dès que je vois {d}{label}, j’ai soif.",
        f"Puisque {d}{label} est froid, bois." if g != "f" else f"Puisque {d}{label} est froide, bois.",
        f"Prends {d}{label} si tu as soif.",
        f"J’en veux encore de {d}{label}." if not vowel(label) else f"J’en veux encore {d}{label}.",
        f"On boit {d}{label} ensemble.",
        f"Tu préfères {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_clothes(label: str, g: str) -> dict[str, list[str]]:
    d, i, p, _ = arts(label, g)
    a1 = [
        f"Léa porte {i}{label}.",
        f"Noah met {p}{label}.",
        f"J’achète {i}{label}.",
        f"Elle enfile {d}{label}.",
        f"Tu aimes {d}{label} ?",
        f"Où est {p}{label} ?",
        f"Papa lave {d}{label}.",
        f"Nous rangeons {d}{label}.",
        f"Mila essaie {d}{label}.",
        f"Qui a pris {p}{label} ?",
        f"Je cherche {p}{label}.",
        f"Il préfère {d}{label}.",
        f"Regarde {d}{label}.",
        f"Elle a {i}{label}.",
        f"On lave {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai porté {p}{label}.",
        f"Elle a acheté {i}{label}.",
        f"Nous avons lavé {d}{label}.",
        f"Tu as vu {p}{label} ?",
        f"Je mettrai {d}{label}.",
        f"Il a oublié {p}{label}.",
        f"Elle va enfiler {d}{label}.",
        f"As-tu rangé {d}{label} ?",
        f"J’ai choisi {d}{label}.",
        f"Ils ont essayé {d}{label}.",
        f"Qui a lavé {p}{label} ?",
        f"On va acheter {i}{label}.",
        f"J’ai trouvé {p}{label}.",
        f"Papa a plié {d}{label}.",
    ]
    b1 = [
        f"Si tu as froid, mets {d}{label}.",
        f"Prends {p}{label} avant de sortir.",
        f"Pourquoi portes-tu {d}{label} ?",
        f"Sans {d}{label}, j’ai froid.",
        f"Où as-tu mis {d}{label} ?",
        f"Lave {d}{label} s’il est sale." if g != "f" else f"Lave {d}{label} si elle est sale.",
        f"Quand il pleut, mets {d}{label}.",
        f"Range {d}{label} tout de suite.",
        f"Si {d}{label} est neuf, garde-le." if g != "f" else f"Si {d}{label} est neuve, garde-la.",
        f"Même usé, {d}{label} me plaît.",
        f"Cherche {p}{label} vite.",
        f"Enfile {d}{label} maintenant.",
        f"Je mets {d}{label} s’il fait froid.",
        f"As-tu besoin de {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_object(label: str, g: str) -> dict[str, list[str]]:
    d, i, p, _ = arts(label, g)
    a1 = [
        f"Léa range {d}{label}.",
        f"Noah ouvre {d}{label}.",
        f"Je regarde {d}{label}.",
        f"Elle pose {d}{label} ici.",
        f"Nous utilisons {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"Où est {d}{label} ?",
        f"Papa répare {d}{label}.",
        f"Qui a pris {d}{label} ?",
        f"Mila dessine {d}{label}.",
        f"Il touche {d}{label}.",
        f"J’aime {d}{label}.",
        f"Elle a {i}{label}.",
        f"On ferme {d}{label}.",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai rangé {d}{label}.",
        f"Elle a ouvert {d}{label}.",
        f"Nous avons déplacé {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Je nettoierai {d}{label}.",
        f"Il a cassé {d}{label}.",
        f"Elle va utiliser {d}{label}.",
        f"As-tu fermé {d}{label} ?",
        f"J’ai acheté {i}{label}.",
        f"Ils ont posé {d}{label}.",
        f"Qui a réparé {d}{label} ?",
        f"On va chercher {d}{label}.",
        f"J’ai trouvé {d}{label}.",
        f"Papa a pris {d}{label}.",
    ]
    b1 = [
        f"Si tu as besoin, prends {d}{label}.",
        f"Range {d}{label} avant de partir.",
        f"Pourquoi as-tu pris {d}{label} ?",
        f"Sans {d}{label}, c’est dur.",
        f"Où met-on {d}{label} ?",
        f"Ferme {d}{label} quand tu as fini.",
        f"Si {d}{label} tombe, ramasse.",
        f"Prends {d}{label} tout de suite.",
        f"Comme {d}{label} est utile, garde-le." if g != "f" else f"Comme {d}{label} est utile, garde-la.",
        f"Même vieux, {d}{label} sert.",
        f"Cherche {d}{label} vite.",
        f"Donne-moi {d}{label}.",
        f"Avant de partir, prends {d}{label}.",
        f"As-tu besoin de {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_place(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    # cas spéciaux
    if label == "ascenseur":
        return {
            "a1": [
                "Léa prend l’ascenseur.",
                "Noah attend l’ascenseur.",
                "Je cherche l’ascenseur.",
                "Où est l’ascenseur ?",
                "Elle voit l’ascenseur.",
                "Nous prenons l’ascenseur.",
                "Tu vois l’ascenseur ?",
                "Papa appelle l’ascenseur.",
                "On monte en ascenseur.",
                "Mila craint l’ascenseur.",
                "Il préfère l’ascenseur.",
                "Qui prend l’ascenseur ?",
                "Regarde l’ascenseur.",
                "Voici l’ascenseur.",
            ],
            "a2": [
                "Hier, j’ai pris l’ascenseur.",
                "L’ascenseur était en panne.",
                "Nous avons attendu l’ascenseur.",
                "Tu as vu l’ascenseur ?",
                "Je prendrai l’ascenseur.",
                "Il a appelé l’ascenseur.",
                "Elle va prendre l’ascenseur.",
                "As-tu trouvé l’ascenseur ?",
                "J’ai monté en ascenseur.",
                "Ils ont réparé l’ascenseur.",
                "Qui a bloqué l’ascenseur ?",
                "On va prendre l’ascenseur.",
                "J’ai manqué l’ascenseur.",
                "Papa a pris l’ascenseur.",
            ],
            "b1": [
                "Si tu es pressé, prends l’ascenseur.",
                "Appelle l’ascenseur avant de monter.",
                "Comme l’ascenseur est plein, j’attends.",
                "Pourquoi prends-tu l’ascenseur ?",
                "Sans l’ascenseur, prends l’escalier.",
                "Où se trouve l’ascenseur ?",
                "Si l’ascenseur est en panne, marche.",
                "Prends l’ascenseur tout de suite.",
                "Dès que l’ascenseur ouvre, entre.",
                "Même lent, l’ascenseur est utile.",
                "Cherche l’ascenseur vite.",
                "Attends l’ascenseur ici.",
                "Avant de monter, appelle-le.",
                "L’ascenseur est libre : monte.",
            ],
        }

    go = f"au {label}" if g == "m" and not vowel(label) else f"à {d}{label}"
    a1 = [
        f"Léa va {go}.",
        f"Noah entre dans {d}{label}.",
        f"Je cherche {d}{label}.",
        f"Où est {d}{label} ?",
        f"Elle regarde {d}{label}.",
        f"Nous nettoyons {d}{label}.",
        f"Tu connais {d}{label} ?",
        f"Papa ouvre {d}{label}.",
        f"On attend près de {d}{label}.",
        f"Mila dessine {d}{label}.",
        f"Il aime {d}{label}.",
        f"Qui range {d}{label} ?",
        f"Voici {d}{label}.",
        f"Regarde {d}{label}.",
        f"C’est {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai visité {d}{label}.",
        f"Elle a nettoyé {d}{label}.",
        f"Nous avons trouvé {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Demain, je vais {go}.",
        f"Il a fermé {d}{label}.",
        f"Elle va ranger {d}{label}.",
        f"As-tu ouvert {d}{label} ?",
        f"J’ai attendu près de {d}{label}.",
        f"Ils ont décoré {d}{label}.",
        f"Qui a nettoyé {d}{label} ?",
        f"On va voir {d}{label}.",
        f"J’ai trouvé {d}{label}.",
        f"Papa a ouvert {d}{label}.",
    ]
    b1 = [
        f"Si tu es perdu, demande {d}{label}.",
        f"Avant d’entrer, regarde {d}{label}.",
        f"Pourquoi fermes-tu {d}{label} ?",
        f"Sans {d}{label}, on reste dehors.",
        f"Où se trouve {d}{label} ?",
        f"Si {d}{label} est fermé, attends." if g != "f" else f"Si {d}{label} est fermée, attends.",
        f"Va {go} tout de suite.",
        f"Comme {d}{label} est grand, aide." if g != "f" else f"Comme {d}{label} est grande, aide.",
        f"Range {d}{label} avant de partir.",
        f"Même petit, {d}{label} sert.",
        f"Cherche {d}{label} vite.",
        f"On entre dans {d}{label}.",
        f"Près de {d}{label}, on attend.",
        f"As-tu vu {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_weather(label: str, g: str) -> dict[str, list[str]]:
    d, _, _, part = arts(label, g)
    if label in MASS_WEATHER:
        a1 = [
            f"Il y a {part}{label}.",
            f"Je regarde {d}{label}.",
            f"Léa aime {d}{label}.",
            f"Noah voit {d}{label}.",
            f"Tu vois {d}{label} ?",
            f"{d[0].upper() + d[1:]}{label} arrive.",
            f"On parle {part}{label}.",
            f"Elle dessine {d}{label}.",
            f"Nous observons {d}{label}.",
            f"Il craint {d}{label}.",
            f"Mila voit {d}{label}.",
            f"Qui a vu {d}{label} ?",
            f"Voici {d}{label}.",
            f"Regarde {d}{label}.",
        ]
        a2 = [
            f"Hier, il y avait {part}{label}.",
            f"Ce matin, j’ai vu {d}{label}.",
            f"Nous avons vu {d}{label}.",
            f"Tu as vu {d}{label} ?",
            f"Demain, il y aura {part}{label}.",
            f"Elle a vu {d}{label}.",
            f"Ils ont parlé {part}{label}.",
            f"J’ai observé {d}{label}.",
            f"Qui a annoncé {d}{label} ?",
            f"On va voir {d}{label}.",
            f"Il a craint {d}{label}.",
            f"As-tu vu {d}{label} ?",
            f"Papa a vu {d}{label}.",
            f"Léa a craint {d}{label}.",
        ]
        b1 = [
            f"S’il y a {part}{label}, reste ici.",
            f"Quand {d}{label} arrive, rentre.",
            f"Pourquoi crains-tu {d}{label} ?",
            f"Sans {d}{label}, le ciel est clair.",
            f"Où as-tu vu {d}{label} ?",
            f"Si {d}{label} continue, on attend.",
            f"Avant de sortir, regarde {d}{label}.",
            f"Comme {d}{label} est fort, reste." if g != "f" else f"Comme {d}{label} est forte, reste.",
            f"Dès que je vois {d}{label}, je rentre.",
            f"Même léger, {d}{label} change tout.",
            f"Regarde {d}{label} avant de sortir.",
            f"On reste s’il y a {part}{label}.",
            f"Avec {d}{label}, on attend.",
            f"Prends un manteau : {d}{label}.",
        ]
        return {"a1": a1, "a2": a2, "b1": b1}
    return phrases_object(label, g)


def phrases_season(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"J’aime {d}{label}.",
        f"Léa préfère {d}{label}.",
        f"Noah attend {d}{label}.",
        f"C’est {d}{label}.",
        f"Tu aimes {d}{label} ?",
        f"On parle de {d}{label}.",
        f"Elle aime {d}{label}.",
        f"Nous aimons {d}{label}.",
        f"Il préfère {d}{label}.",
        f"Qui aime {d}{label} ?",
        f"Voici {d}{label}.",
        f"En {label}, on joue." if not vowel(label) else f"En {label}, on joue.",
        f"Mila dessine {d}{label}.",
        f"Papa aime {d}{label}.",
    ]
    a2 = [
        f"Hier, on a parlé de {d}{label}.",
        f"J’ai aimé {d}{label}.",
        f"Elle a préféré {d}{label}.",
        f"Tu as aimé {d}{label} ?",
        f"Nous avons attendu {d}{label}.",
        f"Il a dessiné {d}{label}.",
        f"On va aimer {d}{label}.",
        f"Qui a choisi {d}{label} ?",
        f"J’ai vu {d}{label} arriver.",
        f"Papa aime {d}{label}.",
        f"Léa a attendu {d}{label}.",
        f"Ils ont parlé de {d}{label}.",
        f"As-tu aimé {d}{label} ?",
        f"Nous aimons {d}{label}.",
    ]
    b1 = [
        f"Si c’est {d}{label}, on sort.",
        f"Pourquoi aimes-tu {d}{label} ?",
        f"Sans {d}{label}, l’année change.",
        f"Quand {d}{label} arrive, on joue.",
        f"Comme j’aime {d}{label}, je souris.",
        f"En {label}, prends un manteau." if label in {"hiver", "automne"} else f"En {label}, on sort.",
        f"Où passes-tu {d}{label} ?",
        f"Même court, {d}{label} est beau." if g != "f" else f"Même courte, {d}{label} est belle.",
        f"J’attends {d}{label} avec joie.",
        f"On parle souvent de {d}{label}.",
        f"Prépare-toi pour {d}{label}.",
        f"Dès que {d}{label} vient, on rit.",
        f"Avec {d}{label}, tout change.",
        f"Tu préfères {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def plural_adj(m: str) -> str:
    if m.endswith(("s", "x", "z")):
        return m
    if m.endswith("al"):
        return m[:-2] + "aux"
    if m.endswith("eau"):
        return m + "x"
    return m + "s"


def phrases_adj(entry: dict, label: str) -> dict[str, list[str]]:
    m = entry.get("masculine") or label
    f = entry.get("feminine") or label
    mp = plural_adj(m)
    a1 = [
        f"Léa est {f}.",
        f"Noah est {m}.",
        f"Il paraît {m}.",
        f"Elle reste {f}.",
        f"Mon frère est {m}.",
        f"Ma sœur est {f}.",
        f"Tu es {m} ?",
        f"Ils sont {mp}.",
        f"Une fille {f} sourit.",
        f"Un garçon {m} aide.",
        f"Je me sens {m}.",
        f"Elle n’est pas {f}.",
        f"Il n’est pas {m}.",
        f"Papa est {m}.",
        f"Maman est {f}.",
    ]
    a2 = [
        f"Hier, elle était {f}.",
        f"Il paraissait {m}.",
        f"Nous l’avons trouvé {m}.",
        f"Tu as l’air {m}.",
        f"Demain, reste {m}.",
        f"Elle est devenue {f}.",
        f"Il a toujours été {m}.",
        f"Ma mère est restée {f}.",
        f"On la dit {f}.",
        f"Ils sont restés {mp}.",
        f"As-tu été {m} ?",
        f"Le voisin semblait {m}.",
        f"Léa est restée {f}.",
        f"Noah est devenu {m}.",
    ]
    b1 = [
        f"Bien qu’il soit {m}, il aide.",
        f"Comme elle est {f}, on l’écoute.",
        f"Si tu es {m}, aide-nous.",
        f"Pourquoi es-tu si {m} ?",
        f"Puisqu’il est {m}, il explique.",
        f"Quand on est {m}, on écoute.",
        f"Même fatiguée, elle reste {f}.",
        f"Sans être {m}, il aide déjà.",
        f"Dès qu’elle est {f}, on avance.",
        f"Lorsqu’il est {m}, tout va.",
        f"Elle reste {f} malgré tout.",
        f"Il paraît très {m} aujourd’hui.",
        f"On le trouve trop {m}.",
        f"Ne sois pas si {m}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_adj_status(entry: dict, label: str) -> dict[str, list[str]]:
    m = entry.get("masculine") or label
    f = entry.get("feminine") or label
    a1 = [
        f"Mon oncle est {m}.",
        f"Ma tante est {f}.",
        f"Il est encore {m}.",
        f"Elle est {f}.",
        f"Noah est {m}.",
        f"Léa est {f}.",
        f"Tu es {m} ?",
        f"Le voisin est {m}.",
        f"La voisine est {f}.",
        f"Papa était {m}.",
        f"On dit qu’elle est {f}.",
        f"Il reste {m}.",
        f"Elle reste {f}.",
        f"Mon ami est {m}.",
    ]
    a2 = [
        f"Il a dit qu’il était {m}.",
        f"Elle était encore {f}.",
        f"Nous avons appris qu’il est {m}.",
        f"Tu savais qu’elle est {f} ?",
        f"Mon oncle était {m}.",
        f"Elle est restée {f}.",
        f"Il est devenu {m}.",
        f"Ma sœur est restée {f}.",
        f"On m’a dit qu’il était {m}.",
        f"Le voisin est resté {m}.",
        f"As-tu su qu’elle est {f} ?",
        f"Léa est restée {f}.",
        f"Noah est devenu {m}.",
        f"Papa est resté {m}.",
    ]
    b1 = [
        f"Bien qu’il soit {m}, il est heureux.",
        f"Comme elle est {f}, elle voyage.",
        f"Si ton oncle est {m}, invite-le.",
        f"Pourquoi dit-il qu’il est {m} ?",
        f"Puisqu’il est {m}, il vit seul.",
        f"Même {m}, il aide sa famille.",
        f"Quand on est {m}, on choisit.",
        f"Elle est {f} depuis peu.",
        f"Il reste {m} par choix.",
        f"On dit souvent qu’il est {m}.",
        f"Ma tante reste {f}.",
        f"Est-il encore {m} ?",
        f"Est-elle encore {f} ?",
        f"Mon ami est encore {m}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_nationality(entry: dict, label: str) -> dict[str, list[str]]:
    m = entry.get("masculine") or label
    f = entry.get("feminine") or label
    a1 = [
        f"Mon ami est {m}.",
        f"Léa est {f}.",
        f"Il est {m}.",
        f"Elle est {f}.",
        f"Un élève {m} arrive.",
        f"Une voisine {f} sourit.",
        f"Tu es {m} ?",
        f"Je connais une {f}.",
        f"Notre prof est {m}.",
        f"Sa mère est {f}.",
        f"Voici un ami {m}.",
        f"Noah est {m}.",
        f"Papa est {m}.",
        f"Maman est {f}.",
    ]
    a2 = [
        f"J’ai rencontré un {m}.",
        f"Une {f} a parlé.",
        f"Mon voisin {m} est parti.",
        f"Elle a aidé une {f}.",
        f"Un ami {m} vient.",
        f"Nous avons vu un {m}.",
        f"Il est devenu {m}.",
        f"Elle est restée {f}.",
        f"Tu as rencontré une {f} ?",
        f"Le collègue est {m}.",
        f"La collègue est {f}.",
        f"Léa a rencontré un {m}.",
        f"Noah a aidé une {f}.",
        f"Papa connaît un {m}.",
    ]
    b1 = [
        f"Bien qu’il soit {m}, il vit ici.",
        f"Comme elle est {f}, elle traduit.",
        f"Si ton ami est {m}, invite-le.",
        f"Puisqu’il est {m}, il explique.",
        f"Dès qu’un {m} arrive, on aide.",
        f"Sans un guide {m}, on se perd.",
        f"Quand un {m} demande, on répond.",
        f"Même loin, mon ami {m} écrit.",
        f"Pourquoi aides-tu un {m} ?",
        f"Je parle avec une {f}.",
        f"On écoute un ami {m}.",
        f"Elle travaille avec un {m}.",
        f"Est-il vraiment {m} ?",
        f"Est-elle vraiment {f} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_person(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    D = d[0].upper() + d[1:]
    I = i[0].upper() + i[1:]
    a1 = [
        f"{D}{label} arrive demain.",
        f"Léa aide {d}{label}.",
        f"Noah appelle {d}{label}.",
        f"Je connais {d}{label}.",
        f"Elle écoute {d}{label}.",
        f"Où est {d}{label} ?",
        f"Nous saluons {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"Papa parle à {d}{label}.",
        f"Mila dessine {d}{label}.",
        f"Il aime {d}{label}.",
        f"{I}{label} habite ici.",
        f"Regarde {d}{label}.",
        f"Voici {d}{label}.",
    ]
    a2 = [
        f"Hier, {d}{label} est venu." if g != "f" else f"Hier, {d}{label} est venue.",
        f"J’ai vu {d}{label}.",
        f"Nous avons aidé {d}{label}.",
        f"Tu as parlé à {d}{label} ?",
        f"{D}{label} viendra demain.",
        f"Elle a appelé {d}{label}.",
        f"Ils ont vu {d}{label}.",
        f"J’ai écrit à {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"On va voir {d}{label}.",
        f"{D}{label} a préparé le repas.",
        f"As-tu salué {d}{label} ?",
        f"Papa a aidé {d}{label}.",
        f"Léa a vu {d}{label}.",
    ]
    b1 = [
        f"Si {d}{label} vient, prépare le thé.",
        f"Pourquoi appelles-tu {d}{label} ?",
        f"Sans {d}{label}, la maison est vide.",
        f"Quand {d}{label} chante, on sourit.",
        f"Afin d’aider {d}{label}, je reste.",
        f"Salue {d}{label} s’il arrive." if g != "f" else f"Salue {d}{label} si elle arrive.",
        f"Dès que {d}{label} arrive, on mange.",
        f"Puisque {d}{label} part, dis au revoir.",
        f"Comme {d}{label} sait, on écoute.",
        f"Où est {d}{label} maintenant ?",
        f"On aide {d}{label} ensemble.",
        f"J’attends {d}{label} ici.",
        f"Parle à {d}{label} tout de suite.",
        f"As-tu vu {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_color(label: str) -> dict[str, list[str]]:
    a1 = [
        f"Mon pull est {label}.",
        f"La robe est {label}.",
        f"Léa aime le {label}.",
        f"Noah choisit le {label}.",
        f"Tu veux du {label} ?",
        f"Le ballon est {label}.",
        f"Elle porte du {label}.",
        f"Ce cahier est {label}.",
        f"On peint en {label}.",
        f"Ma trousse est {label}.",
        f"Il préfère le {label}.",
        f"Voici du {label}.",
        f"C’est {label}.",
        f"J’aime le {label}.",
    ]
    a2 = [
        f"J’ai acheté un pull {label}.",
        f"Le ciel était {label}.",
        f"Elle a choisi du {label}.",
        f"Nous avons peint en {label}.",
        f"Tu as vu sa veste {label} ?",
        f"Je mettrai du {label}.",
        f"J’ai colorié en {label}.",
        f"Ils ont pris le {label}.",
        f"Qui a choisi le {label} ?",
        f"On va acheter du {label}.",
        f"Elle a mis du {label}.",
        f"As-tu le crayon {label} ?",
        f"Papa aime le {label}.",
        f"Léa a pris le {label}.",
    ]
    b1 = [
        f"Si tu veux du {label}, prends-en.",
        f"Pourquoi choisis-tu le {label} ?",
        f"Sans le {label}, c’est terne.",
        f"Quand c’est {label}, on voit bien.",
        f"Prends le crayon {label}.",
        f"Comme c’est {label}, je le choisis.",
        f"Où as-tu mis le {label} ?",
        f"Même clair, le {label} reste vif.",
        f"Ajoute du {label} ici.",
        f"Je préfère le {label}.",
        f"Peins en {label} tout de suite.",
        f"Le mur est trop {label}.",
        f"Avec du {label}, c’est joli.",
        f"Tu aimes le {label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_material(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, part = arts(label, g)
    a1 = [
        f"C’est en {label}.",
        f"Léa touche {d}{label}.",
        f"Noah aime {d}{label}.",
        f"Je vois {d}{label}.",
        f"Elle choisit {d}{label}.",
        f"Tu aimes {d}{label} ?",
        f"On utilise {d}{label}.",
        f"Papa préfère {d}{label}.",
        f"Voici {d}{label}.",
        f"Qui a {d}{label} ?",
        f"J’achète {d}{label}.",
        f"Il y a {part}{label}.",
        f"Regarde {d}{label}.",
        f"Mila dessine {d}{label}.",
    ]
    a2 = [
        f"J’ai touché {d}{label}.",
        f"Elle a choisi {d}{label}.",
        f"Nous avons vu {d}{label}.",
        f"Tu as touché {d}{label} ?",
        f"Il a acheté {d}{label}.",
        f"On a utilisé {d}{label}.",
        f"Qui a pris {d}{label} ?",
        f"J’ai trouvé {d}{label}.",
        f"Papa aime {d}{label}.",
        f"Léa a vu {d}{label}.",
        f"Ils ont pris {d}{label}.",
        f"As-tu vu {d}{label} ?",
        f"On va acheter {d}{label}.",
        f"Elle aime {d}{label}.",
    ]
    b1 = [
        f"Si c’est en {label}, c’est solide.",
        f"Pourquoi choisis-tu {d}{label} ?",
        f"Sans {d}{label}, ça casse.",
        f"Comme c’est en {label}, garde-le.",
        f"Où as-tu mis {d}{label} ?",
        f"Prends {d}{label} tout de suite.",
        f"On préfère {d}{label}.",
        f"Avec {d}{label}, c’est mieux.",
        f"Même simple, {d}{label} sert.",
        f"Cherche {d}{label} vite.",
        f"C’est fait en {label}.",
        f"J’aime le toucher du {label}." if g == "m" else f"J’aime le toucher de {d}{label}.",
        f"Tu veux {d}{label} ?",
        f"Voici un objet en {label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_transport(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Léa prend {d}{label}.",
        f"Noah attend {d}{label}.",
        f"Je monte dans {d}{label}.",
        f"Elle regarde {d}{label}.",
        f"Nous prenons {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"Où est {d}{label} ?",
        f"Papa préfère {d}{label}.",
        f"On voyage en {label}.",
        f"Mila dessine {d}{label}.",
        f"Il aime {d}{label}.",
        f"Qui prend {d}{label} ?",
        f"Regarde {d}{label}.",
        f"Voici {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai pris {d}{label}.",
        f"Elle a manqué {d}{label}.",
        f"Nous avons attendu {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Je prendrai {d}{label}.",
        f"Il a raté {d}{label}.",
        f"Elle va prendre {d}{label}.",
        f"As-tu pris {d}{label} ?",
        f"J’ai voyagé en {label}.",
        f"Ils ont pris {d}{label}.",
        f"Qui a pris {d}{label} ?",
        f"On va prendre {d}{label}.",
        f"Papa a pris {d}{label}.",
        f"Léa a vu {d}{label}.",
    ]
    b1 = [
        f"Si tu es en retard, prends {d}{label}.",
        f"Pourquoi prends-tu {d}{label} ?",
        f"Sans {d}{label}, on marche.",
        f"Quand {d}{label} arrive, on monte.",
        f"Où s’arrête {d}{label} ?",
        f"Prends {d}{label} tout de suite.",
        f"Si {d}{label} est en retard, appelle.",
        f"Même lent, {d}{label} est utile.",
        f"Attends {d}{label} ici.",
        f"Comme {d}{label} est plein, j’attends." if g != "f" else f"Comme {d}{label} est pleine, j’attends.",
        f"Cherche {d}{label} vite.",
        f"On part en {label}.",
        f"Avant de partir, prends {d}{label}.",
        f"Tu préfères {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_body(label: str, g: str) -> dict[str, list[str]]:
    d, _, p, _ = arts(label, g)
    a_le = f"à {d}{label}".replace("à le ", "au ").replace("à les ", "aux ")
    a1 = [
        f"J’ai mal {a_le}.",
        f"Léa lave {d}{label}.",
        f"Noah lève {d}{label}.",
        f"Je montre {d}{label}.",
        f"Elle touche {d}{label}.",
        f"Tu as mal {a_le} ?",
        f"Papa bande {d}{label}.",
        f"Nous protégeons {d}{label}.",
        f"Il bouge {d}{label}.",
        f"Mila dessine {d}{label}.",
        f"Qui a blessé {d}{label} ?",
        f"Je regarde {d}{label}.",
        f"Voici {d}{label}.",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai eu mal {a_le}.",
        f"Elle a lavé {d}{label}.",
        f"Nous avons soigné {d}{label}.",
        f"Tu as mal {a_le} ?",
        f"Il a blessé {d}{label}.",
        f"Elle va protéger {d}{label}.",
        f"J’ai levé {d}{label}.",
        f"As-tu bandé {d}{label} ?",
        f"Ils ont touché {d}{label}.",
        f"Qui a soigné {d}{label} ?",
        f"On va examiner {d}{label}.",
        f"Papa a lavé {d}{label}.",
        f"Léa a touché {d}{label}.",
        f"J’ai montré {d}{label}.",
    ]
    b1 = [
        f"Si tu as mal {a_le}, repose-toi.",
        f"Pourquoi touches-tu {d}{label} ?",
        f"Sans soin, {d}{label} empire.",
        f"Quand {d}{label} gonfle, va chez le médecin.",
        f"Où as-tu mal : {a_le} ?",
        f"Protège {d}{label} tout de suite.",
        f"Comme {d}{label} fait mal, j’arrête.",
        f"Dès que j’ai mal {a_le}, j’arrête.",
        f"Même fatigué, protège {d}{label}.",
        f"Lave {d}{label} avant de manger.",
        f"Montre {d}{label} au médecin.",
        f"J’ai mal {a_le} aujourd’hui.",
        f"Soigne {d}{label} vite.",
        f"Tu as froid {a_le} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_illness(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"J’ai {d}{label}." if not vowel(label) else f"J’ai {d}{label}.",
        f"Léa a {d}{label}.",
        f"Noah a {d}{label}.",
        f"Elle craint {d}{label}.",
        f"Tu as {d}{label} ?",
        f"On parle de {d}{label}.",
        f"Il soigne {d}{label}.",
        f"Qui a {d}{label} ?",
        f"Papa a eu {d}{label}.",
        f"Mila a {d}{label}.",
        f"Voici {d}{label}.",
        f"Je crains {d}{label}.",
        f"Elle a {i}{label}." if False else f"Elle a {d}{label}.",
        f"On évite {d}{label}.",
    ]
    # "J’ai la grippe" / "J’ai mal" — for illness often "J’ai une/la"
    a1[0] = f"J’ai {d}{label}."
    a2 = [
        f"Hier, j’ai eu {d}{label}.",
        f"Elle a eu {d}{label}.",
        f"Nous avons craint {d}{label}.",
        f"Tu as eu {d}{label} ?",
        f"Il a soigné {d}{label}.",
        f"On a parlé de {d}{label}.",
        f"Qui a eu {d}{label} ?",
        f"Papa a eu {d}{label}.",
        f"Léa a eu {d}{label}.",
        f"J’ai évité {d}{label}.",
        f"Elle craint {d}{label}.",
        f"As-tu eu {d}{label} ?",
        f"Ils ont eu {d}{label}.",
        f"On soigne {d}{label}.",
    ]
    b1 = [
        f"Si tu as {d}{label}, repose-toi.",
        f"Pourquoi crains-tu {d}{label} ?",
        f"Sans soin, {d}{label} empire.",
        f"Quand {d}{label} arrive, reste au lit.",
        f"Où soigne-t-on {d}{label} ?",
        f"Comme j’ai {d}{label}, je reste.",
        f"Évite {d}{label} si tu peux.",
        f"Dès que j’ai {d}{label}, j’appelle.",
        f"Même légère, {d}{label} fatigue." if g == "f" else f"Même léger, {d}{label} fatigue.",
        f"On parle souvent de {d}{label}.",
        f"Va chez le médecin : {d}{label}.",
        f"J’ai peur de {d}{label}.",
        f"Soigne {d}{label} vite.",
        f"Tu as déjà eu {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_verb(label: str) -> dict[str, list[str]]:
    a1 = [
        f"Léa veut {label}.",
        f"Noah doit {label}.",
        f"Je vais {label}.",
        f"Elle aime {label}.",
        f"Nous pouvons {label}.",
        f"Tu sais {label} ?",
        f"Il faut {label}.",
        f"Papa préfère {label}.",
        f"On commence à {label}.",
        f"Mila essaie de {label}.",
        f"Qui peut {label} ?",
        f"J’apprends à {label}.",
        f"Il veut {label}.",
        f"Elle peut {label}.",
    ]
    a2 = [
        f"Hier, j’ai dû {label}.",
        f"Elle a pu {label}.",
        f"Nous avons appris à {label}.",
        f"Tu as réussi à {label} ?",
        f"Demain, je vais {label}.",
        f"Il a oublié de {label}.",
        f"Elle va {label}.",
        f"As-tu commencé à {label} ?",
        f"Ils ont décidé de {label}.",
        f"Qui a voulu {label} ?",
        f"On va {label} ensemble.",
        f"J’ai essayé de {label}.",
        f"Papa a pu {label}.",
        f"Léa a voulu {label}.",
    ]
    b1 = [
        f"Si tu peux {label}, aide-nous.",
        f"Avant de {label}, lave-toi les mains.",
        f"Pourquoi veux-tu {label} ?",
        f"Sans savoir {label}, c’est dur.",
        f"Afin de {label}, prépare-toi.",
        f"Puisqu’il faut {label}, on commence.",
        f"Quand j’ai le temps, je vais {label}.",
        f"Dès qu’on peut {label}, on le fait.",
        f"Même pressé, il veut {label}.",
        f"On doit {label} maintenant.",
        f"Essaie de {label} tout de suite.",
        f"Il faut {label} avant midi.",
        f"Tu peux {label} ?",
        f"Je veux {label} aussi.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_expr(label: str) -> dict[str, list[str]]:
    a1 = [
        f"Léa dit « {label} ».",
        f"Noah choisit {label}.",
        f"Je préfère {label}.",
        f"Elle demande {label}.",
        f"Nous voulons {label}.",
        f"Tu choisis {label} ?",
        f"Il répond {label}.",
        f"On apprend {label}.",
        f"Papa indique {label}.",
        f"Mila note {label}.",
        f"Qui dit {label} ?",
        f"J’écris {label}.",
        f"Voici {label}.",
        f"C’est {label}.",
    ]
    a2 = [
        f"Hier, j’ai choisi {label}.",
        f"Elle a dit {label}.",
        f"Nous avons demandé {label}.",
        f"Tu as écrit {label} ?",
        f"Je dirai {label}.",
        f"Il a répondu {label}.",
        f"Elle va choisir {label}.",
        f"As-tu noté {label} ?",
        f"Ils ont préféré {label}.",
        f"Qui a dit {label} ?",
        f"On va indiquer {label}.",
        f"J’ai répété {label}.",
        f"Papa a dit {label}.",
        f"Léa a noté {label}.",
    ]
    b1 = [
        f"Si tu commandes, choisis {label}.",
        f"Pourquoi choisis-tu {label} ?",
        f"Sans comprendre {label}, demande.",
        f"Quand tu hésites, dis {label}.",
        f"Afin d’être précis, dis {label}.",
        f"Puisqu’il faut choisir, prends {label}.",
        f"Note {label} tout de suite.",
        f"Répète {label} clairement.",
        f"On répond {label}.",
        f"Dis {label} s’il te plaît.",
        f"J’écris encore {label}.",
        f"Tu as bien dit {label} ?",
        f"Choisis {label} maintenant.",
        f"Voici encore {label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_animal(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Léa regarde {d}{label}.",
        f"Noah aime {d}{label}.",
        f"Je vois {i}{label}.",
        f"Elle caresse {d}{label}.",
        f"Nous nourrissons {d}{label}.",
        f"Tu aimes {d}{label} ?",
        f"Où est {d}{label} ?",
        f"Papa voit {d}{label}.",
        f"On écoute {d}{label}.",
        f"Mila dessine {d}{label}.",
        f"Il observe {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"Regarde {d}{label}.",
        f"Voici {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai vu {i}{label}.",
        f"Elle a nourri {d}{label}.",
        f"Nous avons vu {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Je verrai {d}{label}.",
        f"Il a entendu {d}{label}.",
        f"Elle va caresser {d}{label}.",
        f"As-tu nourri {d}{label} ?",
        f"Ils ont observé {d}{label}.",
        f"Qui a trouvé {d}{label} ?",
        f"On va voir {d}{label}.",
        f"J’ai dessiné {d}{label}.",
        f"Papa a vu {d}{label}.",
        f"Léa aime {d}{label}.",
    ]
    b1 = [
        f"Si tu vois {d}{label}, reste calme.",
        f"Pourquoi crains-tu {d}{label} ?",
        f"Sans soin, {d}{label} est triste.",
        f"Quand {d}{label} dort, parle bas.",
        f"Où habite {d}{label} ?",
        f"Nourris {d}{label} avant de partir.",
        f"Comme {d}{label} a faim, donne à manger.",
        f"Dès que je vois {d}{label}, je souris.",
        f"Même petit, {d}{label} est vivant.",
        f"Approche {d}{label} doucement.",
        f"On regarde {d}{label} ensemble.",
        f"J’aime beaucoup {d}{label}.",
        f"Reste calme près de {d}{label}.",
        f"Tu aimes {d}{label} ?",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_school(label: str) -> dict[str, list[str]]:
    a1 = [
        f"Léa aime {label}.",
        f"Noah étudie {label}.",
        f"J’ai {label} demain.",
        f"Elle révise {label}.",
        f"Nous aimons {label}.",
        f"Tu aimes {label} ?",
        f"On a {label} ce matin.",
        f"Papa aide pour {label}.",
        f"Il déteste {label}.",
        f"Mila réussit en {label}.",
        f"Qui enseigne {label} ?",
        f"Je préfère {label}.",
        f"Voici {label}.",
        f"C’est {label}.",
    ]
    a2 = [
        f"Hier, j’ai eu {label}.",
        f"Elle a révisé {label}.",
        f"Nous avons étudié {label}.",
        f"Tu as aimé {label} ?",
        f"Demain, on a {label}.",
        f"Il a raté {label}.",
        f"Elle va réviser {label}.",
        f"As-tu fini {label} ?",
        f"Ils ont appris {label}.",
        f"Qui a enseigné {label} ?",
        f"On va étudier {label}.",
        f"J’ai réussi en {label}.",
        f"Papa a aidé pour {label}.",
        f"Léa a aimé {label}.",
    ]
    b1 = [
        f"Si tu as {label}, révise bien.",
        f"Pourquoi aimes-tu {label} ?",
        f"Sans {label}, le programme change.",
        f"Quand on a {label}, on écoute.",
        f"Comme j’aime {label}, je m’exerce.",
        f"Où as-tu le livre de {label} ?",
        f"Révise {label} tout de suite.",
        f"Si {label} est dur, demande.",
        f"Même dur, {label} est utile.",
        f"On travaille {label} ensemble.",
        f"J’aime beaucoup {label}.",
        f"Prépare {label} pour demain.",
        f"Tu réussis en {label} ?",
        f"Avant {label}, range ton cahier.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_calendar(label: str) -> dict[str, list[str]]:
    a1 = [
        f"C’est {label}.",
        f"Léa aime {label}.",
        f"Noah attend {label}.",
        f"J’écris {label}.",
        f"Tu aimes {label} ?",
        f"On parle de {label}.",
        f"Elle note {label}.",
        f"Nous aimons {label}.",
        f"Il préfère {label}.",
        f"Qui a dit {label} ?",
        f"Voici {label}.",
        f"Papa dit {label}.",
        f"Mila lit {label}.",
        f"Je dis {label}.",
    ]
    a2 = [
        f"Hier, c’était {label}.",
        f"Elle a noté {label}.",
        f"Nous avons dit {label}.",
        f"Tu as écrit {label} ?",
        f"Demain, c’est {label}.",
        f"Il a choisi {label}.",
        f"On a parlé de {label}.",
        f"Qui a dit {label} ?",
        f"J’ai lu {label}.",
        f"Papa a dit {label}.",
        f"Léa a aimé {label}.",
        f"As-tu noté {label} ?",
        f"Ils ont dit {label}.",
        f"On attend {label}.",
    ]
    b1 = [
        f"Si c’est {label}, on se prépare.",
        f"Pourquoi aimes-tu {label} ?",
        f"Sans {label}, on se perd.",
        f"Quand c’est {label}, on sourit.",
        f"Note {label} tout de suite.",
        f"Comme c’est {label}, on part.",
        f"Où as-tu écrit {label} ?",
        f"Dis {label} clairement.",
        f"On parle souvent de {label}.",
        f"J’attends {label} avec joie.",
        f"Prépare-toi pour {label}.",
        f"Tu préfères {label} ?",
        f"Voici encore {label}.",
        f"C’est déjà {label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_time(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Quelle {label} est-il ?" if g == "f" else f"Quel {label} est-il ?",
        f"Léa lit {d}{label}.",
        f"Noah regarde {d}{label}.",
        f"Je vois {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"On attend {d}{label}.",
        f"Elle dit {d}{label}.",
        f"Nous lisons {d}{label}.",
        f"Il note {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"Voici {d}{label}.",
        f"C’est {d}{label}.",
        f"Papa dit {d}{label}.",
        f"Mila lit {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai vu {d}{label}.",
        f"Elle a dit {d}{label}.",
        f"Nous avons lu {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Il a noté {d}{label}.",
        f"On a attendu {d}{label}.",
        f"Qui a dit {d}{label} ?",
        f"J’ai lu {d}{label}.",
        f"Papa a vu {d}{label}.",
        f"Léa a noté {d}{label}.",
        f"As-tu vu {d}{label} ?",
        f"Ils ont dit {d}{label}.",
        f"On va lire {d}{label}.",
        f"Elle aime {d}{label}.",
    ]
    b1 = [
        f"Si tu vois {d}{label}, dis-le.",
        f"Pourquoi regardes-tu {d}{label} ?",
        f"Sans {d}{label}, on est en retard.",
        f"Quand {d}{label} arrive, on part.",
        f"Où as-tu vu {d}{label} ?",
        f"Note {d}{label} tout de suite.",
        f"Comme {d}{label} passe, dépêche-toi.",
        f"Regarde {d}{label} avant de partir.",
        f"On lit {d}{label} ensemble.",
        f"J’attends {d}{label}.",
        f"Dis-moi {d}{label}.",
        f"Tu connais {d}{label} ?",
        f"Voici encore {d}{label}.",
        f"C’est déjà {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_sport(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Léa fait {d}{label}.",
        f"Noah aime {d}{label}.",
        f"Je pratique {d}{label}.",
        f"Elle regarde {d}{label}.",
        f"Nous aimons {d}{label}.",
        f"Tu aimes {d}{label} ?",
        f"On joue au {label}." if g == "m" and not vowel(label) else f"On fait {d}{label}.",
        f"Papa préfère {d}{label}.",
        f"Il apprend {d}{label}.",
        f"Qui fait {d}{label} ?",
        f"Voici {d}{label}.",
        f"J’aime {d}{label}.",
        f"Mila fait {d}{label}.",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai fait {d}{label}.",
        f"Elle a aimé {d}{label}.",
        f"Nous avons fait {d}{label}.",
        f"Tu as fait {d}{label} ?",
        f"Il a appris {d}{label}.",
        f"On va faire {d}{label}.",
        f"Qui a fait {d}{label} ?",
        f"J’ai regardé {d}{label}.",
        f"Papa a fait {d}{label}.",
        f"Léa a appris {d}{label}.",
        f"As-tu aimé {d}{label} ?",
        f"Ils ont fait {d}{label}.",
        f"Elle pratique {d}{label}.",
        f"Noah aime {d}{label}.",
    ]
    b1 = [
        f"Si tu aimes {d}{label}, joue.",
        f"Pourquoi fais-tu {d}{label} ?",
        f"Sans {d}{label}, je m’ennuie.",
        f"Quand on fait {d}{label}, on rit.",
        f"Comme j’aime {d}{label}, j’y vais.",
        f"Où pratiques-tu {d}{label} ?",
        f"Fais {d}{label} tout de suite.",
        f"Même dur, {d}{label} est fun.",
        f"On fait {d}{label} ensemble.",
        f"J’aime beaucoup {d}{label}.",
        f"Apprends {d}{label} avec moi.",
        f"Tu préfères {d}{label} ?",
        f"Avant {d}{label}, échauffe-toi.",
        f"Voici encore {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_panne(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Il y a {i}{label}.",
        f"Léa voit {d}{label}.",
        f"Noah craint {d}{label}.",
        f"Je vois {d}{label}.",
        f"Elle signale {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"On répare {d}{label}.",
        f"Papa règle {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"Voici {d}{label}.",
        f"Il y a {d}{label}.",
        f"Mila dit {d}{label}.",
        f"Regarde {d}{label}.",
        f"On parle de {d}{label}.",
    ]
    a2 = [
        f"Hier, il y a eu {i}{label}.",
        f"Elle a signalé {d}{label}.",
        f"Nous avons vu {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Il a réparé {d}{label}.",
        f"On a parlé de {d}{label}.",
        f"Qui a signalé {d}{label} ?",
        f"J’ai vu {d}{label}.",
        f"Papa a réglé {d}{label}.",
        f"Léa a craint {d}{label}.",
        f"As-tu vu {d}{label} ?",
        f"Ils ont réparé {d}{label}.",
        f"On va réparer {d}{label}.",
        f"Elle a vu {d}{label}.",
    ]
    b1 = [
        f"S’il y a {i}{label}, appelle.",
        f"Pourquoi crains-tu {d}{label} ?",
        f"Sans réparation, {d}{label} reste.",
        f"Quand {d}{label} arrive, on attend.",
        f"Où as-tu vu {d}{label} ?",
        f"Signale {d}{label} tout de suite.",
        f"Comme il y a {i}{label}, on attend.",
        f"Répare {d}{label} vite.",
        f"On parle souvent de {d}{label}.",
        f"J’ai peur de {d}{label}.",
        f"Appelle s’il y a {i}{label}.",
        f"Tu as déjà vu {d}{label} ?",
        f"Avant de partir, vérifie {d}{label}.",
        f"Voici encore {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


def phrases_landscape(label: str, g: str) -> dict[str, list[str]]:
    d, i, _, _ = arts(label, g)
    a1 = [
        f"Léa voit {d}{label}.",
        f"Noah aime {d}{label}.",
        f"Je regarde {d}{label}.",
        f"Elle dessine {d}{label}.",
        f"Nous visitons {d}{label}.",
        f"Tu vois {d}{label} ?",
        f"Où est {d}{label} ?",
        f"Papa photographie {d}{label}.",
        f"On aime {d}{label}.",
        f"Mila découvre {d}{label}.",
        f"Il admire {d}{label}.",
        f"Qui a vu {d}{label} ?",
        f"Voici {d}{label}.",
        f"Regarde {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai vu {d}{label}.",
        f"Elle a visité {d}{label}.",
        f"Nous avons admiré {d}{label}.",
        f"Tu as vu {d}{label} ?",
        f"Il a photographié {d}{label}.",
        f"On va voir {d}{label}.",
        f"Qui a découvert {d}{label} ?",
        f"J’ai dessiné {d}{label}.",
        f"Papa a vu {d}{label}.",
        f"Léa aime {d}{label}.",
        f"As-tu vu {d}{label} ?",
        f"Ils ont vu {d}{label}.",
        f"Noah aime {d}{label}.",
        f"On a visité {d}{label}.",
    ]
    b1 = [
        f"Si tu vois {d}{label}, souris.",
        f"Pourquoi aimes-tu {d}{label} ?",
        f"Sans {d}{label}, le voyage change.",
        f"Quand on voit {d}{label}, on s’arrête.",
        f"Où se trouve {d}{label} ?",
        f"Comme {d}{label} est beau, reste." if g != "f" else f"Comme {d}{label} est belle, reste.",
        f"Visite {d}{label} tout de suite.",
        f"Même loin, {d}{label} attire.",
        f"On admire {d}{label} ensemble.",
        f"J’aime beaucoup {d}{label}.",
        f"Photographions {d}{label}.",
        f"Tu préfères {d}{label} ?",
        f"Avant de partir, vois {d}{label}.",
        f"Voici encore {d}{label}.",
    ]
    return {"a1": a1, "a2": a2, "b1": b1}


BUILDERS = {
    "food": phrases_food,
    "drink": phrases_drink,
    "clothes": phrases_clothes,
    "object": phrases_object,
    "place": phrases_place,
    "weather": phrases_weather,
    "season": phrases_season,
    "adj": phrases_adj,
    "adj_status": phrases_adj_status,
    "nationality": phrases_nationality,
    "person": phrases_person,
    "color": phrases_color,
    "material": phrases_material,
    "transport": phrases_transport,
    "travel": phrases_transport,
    "body": phrases_body,
    "illness": phrases_illness,
    "verb": lambda label, g=None: phrases_verb(label),
    "expr": lambda label, g=None: phrases_expr(label),
    "animal": phrases_animal,
    "school": lambda label, g=None: phrases_school(label),
    "calendar": lambda label, g=None: phrases_calendar(label),
    "time": phrases_time,
    "sport": phrases_sport,
    "panne": phrases_panne,
    "landscape": phrases_landscape,
    "abstract": phrases_abstract,
}


def make_phrases(entry: dict) -> dict[str, list[str]]:
    label = entry["label"]
    g = gender(label, entry)
    cat = cat_for(entry)
    builder = BUILDERS.get(cat, phrases_object)

    if cat in ("adj", "adj_status", "nationality"):
        pools = builder(entry, label)  # type: ignore
    elif cat in ("verb", "expr", "color", "school", "calendar"):
        pools = builder(label)  # type: ignore
    else:
        pools = builder(label, g)  # type: ignore

    forms = {label.lower()}
    if entry.get("feminine"):
        forms.add(str(entry["feminine"]).lower())
    if entry.get("masculine"):
        forms.add(str(entry["masculine"]).lower())

    offset = hash_offset(entry["id"], 19)
    result: dict[str, list[str]] = {}
    for level in ("a1", "a2", "b1"):
        cleaned = clean(pools.get(level, []))
        cleaned = [s for s in cleaned if any(f in s.lower() for f in forms if f)]
        # Rotation seulement dans les bonnes phrases
        picked = rotate(cleaned, offset % max(len(cleaned), 1), 10) if cleaned else []
        if len(picked) < 10:
            extras = short_fillers(label, cat, g, forms, entry)
            for s in extras:
                if s not in picked:
                    picked.append(s)
                if len(picked) >= 10:
                    break
        if len(picked) < 10 and cat not in ("adj", "adj_status", "nationality", "verb", "weather", "abstract"):
            for s in clean(phrases_object(label, g).get(level, [])):
                if any(f in s.lower() for f in forms if f) and s not in picked:
                    picked.append(s)
                if len(picked) >= 10:
                    break
        if len(picked) < 10:
            emergency = clean(
                [
                    f"Voici {label}.",
                    f"C’est {label}.",
                    f"J’aime {label}.",
                    f"Tu aimes {label} ?",
                    f"Léa dit {label}.",
                    f"Noah dit {label}.",
                    f"On dit {label}.",
                    f"Je dis {label}.",
                    f"Elle dit {label}.",
                    f"Il dit {label}.",
                    f"Papa dit {label}.",
                    f"Mila dit {label}.",
                    f"Qui dit {label} ?",
                    f"Écris {label}.",
                    f"Lis {label}.",
                    f"Note {label}.",
                    f"Répète {label}.",
                    f"Voici encore {label}.",
                ]
            )
            for s in emergency:
                if s not in picked:
                    picked.append(s)
                if len(picked) >= 10:
                    break
        if len(picked) < 10:
            raise RuntimeError(f"Only {len(picked)} phrases for {entry['id']} / {level} ({cat})")
        result[level] = picked[:10]
    return result


def process_file(path: Path) -> tuple[int, int]:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    updated = words = 0
    out: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not (stripped.startswith("{") and '"label":' in stripped and '"sentences":' in stripped):
            out.append(line)
            continue
        trailing = ""
        payload = stripped
        if payload.endswith(","):
            trailing = ","
            payload = payload[:-1]
        try:
            entry = json.loads(payload)
        except json.JSONDecodeError as e:
            print(f"JSON error in {path.name}: {e}", file=sys.stderr)
            out.append(line)
            continue
        words += 1
        entry.setdefault("sentences", {})["phrase"] = make_phrases(entry)
        out.append("      " + json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + trailing + "\n")
        updated += 1
    path.write_text("".join(out), encoding="utf-8")
    return words, updated


def main() -> None:
    total_w = total_u = 0
    for path in sorted(BANK_DIR.glob("fr-*.ts")):
        w, u = process_file(path)
        total_w += w
        total_u += u
        print(f"{path.name}: {u}/{w} mots")
    print(f"Total: {total_u}/{total_w}")


if __name__ == "__main__":
    main()
