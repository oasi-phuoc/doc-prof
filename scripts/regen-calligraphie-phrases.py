#!/usr/bin/env python3
"""Régénère sentences.phrase (10 × A1/A2/B1) pour les banques Voc.

Règles : voir .claude/skills/calligraphie-phrases/SKILL.md
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

# Subgroups → kind
KIND_BY_SUBGROUP = {
    "v1-description-physique": "adj",
    "v1-description-morale": "adj",
    "v6-couleurs": "adj",
    "v1-nationalites": "adj_nat",
    "v1-professions": "person",
    "v1-famille": "person",
    "v1-etat-civil": "adj",
    "v7-cuisine": "verb",
    "v9-direction": "expr",
}

# Force feminine nouns (heuristic overrides)
FEM_NOUNS = {
    "bague", "baguette", "banane", "cerise", "chaise", "chemise", "jupe", "robe",
    "veste", "casquette", "écharpe", "ceinture", "montre", "chaussure", "botte",
    "salle", "cuisine", "chambre", "cave", "terrasse", "cabane", "maison",
    "voiture", "moto", "gare", "station", "pharmacie", "maladie", "allergie",
    "bouche", "tête", "main", "jambe", "dent", "fièvre", "grippe", "toux",
    "année", "heure", "minute", "semaine", "journée", "soirée", "matinée",
    "saison", "neige", "pluie", "averse", "tempête", "météo", "biologie",
    "géographie", "histoire", "musique", "bibliothèque", "récréation",
    "addition", "carte", "valise", "plage", "montagne", "forêt", "rivière",
    "campagne", "cascade", "ville", "route", "rue", "avenue", "place",
    "église", "mosquée", "synagogue", "université", "école", "classe",
    "pomme", "poire", "orange", "tomate", "carotte", "salade", "soupe",
    "viande", "farine", "huile", "confiture", "boîte", "assiette", "casserole",
    "cuillère", "fourchette", "ampoule", "panne", "fuite", "clé", "porte",
    "fenêtre", "armoire", "table", "lampe", "douche", "baignoire", "cour",
    "cousine", "mère", "sœur", "tante", "fille", "femme", "grand-mère",
    "infirmière", "docteure", "boulangère", "vendeuse", "actresse",
    "course", "natation", "danse", "photo", "télévision", "radio",
    "identité", "nationalité", "profession", "adresse", "date",
}

MASC_NOUNS = {
    "blouson", "pantalon", "manteau", "pull", "tee-shirt", "short", "costume",
    "béret", "sac", "prix", "magasin", "marché", "restaurant", "café",
    "pain", "croissant", "beignet", "fromage", "beurre", "lait", "jus",
    "abricot", "ananas", "avocat", "citron", "raisin", "concombre", "poivron",
    "ail", "riz", "sucre", "sel", "bol", "plat", "four", "frigo", "micro-ondes",
    "appartement", "balcon", "bureau", "canapé", "fauteuil", "lit", "placard",
    "ascenseur", "couloir", "jardin", "garage", "grenier", "toilettes",
    "aspirateur", "chauffage", "lave-linge", "sèche-linge", "four",
    "cousin", "père", "frère", "oncle", "fils", "mari", "grand-père",
    "boulanger", "cuisinier", "médecin", "chirurgien", "pharmacien",
    "bras", "dos", "pied", "nez", "ventre", "cou", "doigt", "comprimé",
    "avion", "bateau", "bus", "métro", "train", "taxi", "vélo", "tramway",
    "bagage", "billet", "quai", "ticket", "passeport", "visa",
    "acteur", "chanteur", "musée", "cinéma", "théâtre", "parc", "stade",
    "carrefour", "feux", "pont", "port", "aéroport", "hôtel",
    "automne", "hiver", "été", "printemps", "soleil", "vent", "nuage",
    "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche",
    "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "basket-ball", "football", "tennis", "sport", "match", "jeu",
    "agenda", "crayon", "stylo", "cahier", "livre", "sac à dos", "cartable",
    "art", "français", "anglais", "calcul", "ordinateur", "tableau",
}


def hash_offset(word_id: str, mod: int) -> int:
    h = hashlib.md5(word_id.encode("utf-8")).hexdigest()
    return int(h[:8], 16) % max(mod, 1)


def starts_vowel(word: str) -> bool:
    w = word.strip()
    return bool(w) and w[0] in VOWELS


def infer_gender(label: str, entry: dict) -> str | None:
    if entry.get("feminine") and entry.get("feminine") == label:
        return "f"
    if entry.get("masculine") and entry.get("masculine") == label:
        return "m"
    if entry.get("feminine") and entry.get("masculine"):
        # label is one of the pair
        if label == entry.get("feminine"):
            return "f"
        if label == entry.get("masculine"):
            return "m"
    low = label.lower()
    if low in FEM_NOUNS:
        return "f"
    if low in MASC_NOUNS:
        return "m"
    # weak heuristic
    if low.endswith(("tion", "sion", "ette", "elle", "ance", "ence", "ure", "ade", "ée")):
        return "f"
    if low.endswith(("age", "isme", "ment", "eau", "ou", "oir")):
        return "m"
    if low.endswith("e") and not low.endswith(("iste", "aire", "ège", " gre")):
        return "f"
    return "m"


def det_def(label: str, gender: str | None) -> str:
    if gender is None:
        return ""
    if starts_vowel(label):
        return "l'"
    return "la " if gender == "f" else "le "


def det_ind(label: str, gender: str | None) -> str:
    if gender is None:
        return ""
    if starts_vowel(label):
        return "un " if gender == "m" else "une "
    return "une " if gender == "f" else "un "


def det_poss(gender: str | None) -> str:
    if gender == "f":
        return "ma "
    return "mon "


def det_poss2(gender: str | None) -> str:
    if gender == "f":
        return "ta "
    return "ton "


def det_ce(label: str, gender: str | None) -> str:
    if starts_vowel(label):
        return "cet " if gender != "f" else "cette "
    return "cette " if gender == "f" else "ce "


def de_du(label: str, gender: str | None) -> str:
    """de + article défini contracté."""
    if starts_vowel(label):
        return f"de l'{label}"
    if gender == "f":
        return f"de la {label}"
    return f"du {label}"


def kind_for(entry: dict) -> str:
    sg = entry.get("subgroup") or ""
    if sg in KIND_BY_SUBGROUP:
        return KIND_BY_SUBGROUP[sg]
    label = (entry.get("label") or "").strip()
    low = label.lower()
    if " " in label or low.startswith(("à ", "au ", "en ", "de ", "du ", "à l")):
        return "expr"
    # Paire de genre distincte → adjectif (sauf parenté / métier déjà classés).
    masc = (entry.get("masculine") or "").strip()
    fem = (entry.get("feminine") or "").strip()
    if masc and fem and masc != fem:
        if "famille" in sg or "profession" in sg or "etat-civil" in sg:
            return "person"
        return "adj"
    return "noun"


def fit(s: str) -> str | None:
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("l' ", "l'").replace("d' ", "d'")
    # Contractions avec frontières de mots (évite « Regarde le » → « Regardu »).
    s = re.sub(r"\bde le\b", "du", s)
    s = re.sub(r"\bà le\b", "au", s)
    s = re.sub(r"\bde les\b", "des", s)
    s = re.sub(r"\bà les\b", "aux", s)
    if not s:
        return None
    s = s[0].upper() + s[1:]
    if len(s) > MAX_CHARS:
        return None
    if not s.endswith((".", "?", "!")):
        s += "."
    if len(s) > MAX_CHARS:
        return None
    return s


def rotate(pool: list[str], offset: int, n: int = 10) -> list[str]:
    if not pool:
        return []
    out: list[str] = []
    i = offset
    seen: set[str] = set()
    guard = 0
    while len(out) < n and guard < len(pool) * 3:
        cand = pool[i % len(pool)]
        i += 1
        guard += 1
        if cand in seen:
            continue
        seen.add(cand)
        out.append(cand)
    return out


def build_noun_phrases(label: str, gender: str | None) -> dict[str, list[str]]:
    d = det_def(label, gender)
    i = det_ind(label, gender)
    p = det_poss(gender)
    p2 = det_poss2(gender)
    c = det_ce(label, gender)
    de = de_du(label, gender)
    a1 = [
        f"Léa achète {i}{label}.",
        f"{c}{label} me plaît beaucoup.",
        f"Où est {p}{label} ?",
        f"Il range {p2}{label}.",
        f"Nous aimons {d}{label}.",
        f"Elle montre {i}{label}.",
        f"{d}{label} est sur la table.",
        f"Tu cherches {p2}{label} ?",
        f"J’ai trouvé {i}{label}.",
        f"Sans {label}, c’est difficile.",
        f"Regarde {d}{label} là-bas.",
        f"Papa apporte {i}{label}.",
        f"Mila dessine {i}{label}.",
        f"On utilise {d}{label} souvent.",
        f"Voici {p}{label} préféré." if gender != "f" else f"Voici {p}{label} préférée.",
        f"Prends {d}{label}, s’il te plaît.",
        f"Ils parlent {de}.",
        f"Je prépare {i}{label}.",
        f"{c}{label} coûte cher.",
        f"Nous voyons {d}{label}.",
    ]
    a2 = [
        f"Hier, j’ai acheté {i}{label}.",
        f"Ce matin, {d}{label} manquait.",
        f"Nous avons rangé {d}{label}.",
        f"Elle a oublié {p}{label}.",
        f"Demain, je prendrai {i}{label}.",
        f"Quand j’arrive, je vois {d}{label}.",
        f"Il a perdu {p2}{label} hier.",
        f"Après le cours, range {d}{label}.",
        f"On a partagé {i}{label}.",
        f"J’ai noté {d}{label} dans mon carnet.",
        f"Tu as vu {p2}{label} ?",
        f"Nous allons chercher {i}{label}.",
        f"Elle a choisi {c}{label}.",
        f"Pendant la pause, j’ai pris {d}{label}.",
        f"Ils ont réparé {d}{label}.",
        f"Avant, j’avais {i}{label}.",
        f"Le soir, je range {p}{label}.",
        f"Nous avons regardé {d}{label}.",
        f"J’ai prêté {p}{label} à Noah.",
        f"Elle va utiliser {d}{label}.",
    ]
    a1s = [x for x in (fit(s) for s in a1) if x]
    a2s = [x for x in (fit(s) for s in a2) if x]
    # B1: keep short subordinations
    b1_raw = [
        f"Comme {d}{label} est utile, je le garde." if gender != "f" else f"Comme {d}{label} est utile, je la garde.",
        f"Si tu veux, prends {p2}{label}.",
        f"Bien que simple, {d}{label} aide.",
        f"Quand j’ai le temps, je range {d}{label}.",
        f"Puisque {d}{label} est prêt, on part." if gender != "f" else f"Puisque {d}{label} est prête, on part.",
        f"Dès que je vois {d}{label}, je souris.",
        f"Pour réussir, j’utilise {d}{label}.",
        f"Même fatigué, il cherche {d}{label}.",
        f"Avant de sortir, prends {d}{label}.",
        f"Sans {d}{label}, on ne peut pas.",
        f"Comme j’aime {d}{label}, j’en rachète.",
        f"Si {d}{label} tombe, ramasse-le." if gender != "f" else f"Si {d}{label} tombe, ramasse-la.",
        f"Lorsque j’ai faim, je prends {d}{label}.",
        f"Afin d’être prêt, prépare {d}{label}.",
        f"Alors que Léa lit, Noah range {d}{label}.",
    ]
    b1s = [x for x in (fit(s) for s in b1_raw) if x]
    return {"a1": a1s, "a2": a2s, "b1": b1s}


def fem_form(entry: dict, label: str) -> str:
    return entry.get("feminine") or label


def masc_form(entry: dict, label: str) -> str:
    return entry.get("masculine") or label


def build_color_phrases(label: str) -> dict[str, list[str]]:
    a1 = [
        f"Mon pull est {label}.",
        f"La robe est {label}.",
        f"J’aime le sac {label}.",
        f"Elle porte du {label}.",
        f"Ce cahier est {label}.",
        f"Nous choisissons le {label}.",
        f"Tu veux le stylo {label} ?",
        f"Le mur devient {label}.",
        f"Voici une fleur {label}.",
        f"Il préfère le {label}.",
        f"Ma trousse est {label}.",
        f"On peint en {label}.",
        f"Le ballon est {label}.",
        f"Elle dessine en {label}.",
        f"Ce chapeau est {label}.",
    ]
    a2 = [
        f"Hier, j’ai acheté un pull {label}.",
        f"Ce matin, le ciel était {label}.",
        f"Elle a choisi la jupe {label}.",
        f"Nous avons peint le mur {label}.",
        f"Demain, je mettrai du {label}.",
        f"Quand il pleut, le ciel est {label}.",
        f"Il a perdu son gant {label}.",
        f"Tu as vu sa veste {label} ?",
        f"J’ai colorié la maison en {label}.",
        f"Ils ont pris le ballon {label}.",
        f"Avant, ma chambre était {label}.",
        f"Nous allons acheter du {label}.",
        f"Elle a mis son écharpe {label}.",
        f"Le chat a les yeux {label}.",
        f"J’ai rangé le cahier {label}.",
    ]
    b1 = [
        f"Bien que {label}, le pull me plaît.",
        f"Comme le mur est {label}, on voit bien.",
        f"Si tu veux du {label}, prends celui-ci.",
        f"Même usé, le sac {label} sert encore.",
        f"Lorsque le ciel est {label}, on sort.",
        f"Puisque c’est {label}, je le choisis.",
        f"Dès que je vois du {label}, je souris.",
        f"Pour la fresque, utilise le {label}.",
        f"Alors que Léa prend le rouge, Noah prend le {label}.",
        f"Sans le {label}, le dessin est terne.",
        f"Bien que clair, le {label} reste vif.",
        f"Comme j’aime le {label}, j’en rachète.",
        f"Si la robe est {label}, elle ira bien.",
        f"Quand on peint, mélange un peu de {label}.",
        f"Afin d’égayer la page, ajoute du {label}.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


def build_adj_phrases(entry: dict, label: str) -> dict[str, list[str]]:
    if (entry.get("subgroup") or "") == "v6-couleurs":
        return build_color_phrases(label)
    m = masc_form(entry, label)
    f = fem_form(entry, label)
    a1 = [
        f"Léa est {f}.",
        f"Noah paraît {m}.",
        f"Reste {m}, s’il te plaît.",
        f"Elle reste très {f}.",
        f"Il est trop {m} aujourd’hui.",
        f"Ma sœur est {f}.",
        f"Ton frère semble {m}.",
        f"Soyez {m} en classe." if m == f else f"Soyez calmes en classe.",
        f"Une voix {f} rassure.",
        f"Un homme {m} aide Léa.",
        f"Elle devient {f}.",
        f"Il reste {m}.",
        f"Nous la trouvons {f}.",
        f"Je me sens {m}.",
        f"Tu es vraiment {m}.",
        f"Ils sont un peu {m}s." if not m.endswith(("s", "x")) else f"Ils sont très {m}.",
        f"Elle n’est pas {f}.",
        f"Comme il est {m} !",
        f"Voici une fille {f}.",
        f"C’est un garçon {m}.",
    ]
    # clean bad plurals
    a1 = [s.replace("calmess", "calmes") for s in a1]
    a1 = [re.sub(r"\b(\w+)ss\b", r"\1s", s) for s in a1]
    a2 = [
        f"Hier, elle était très {f}.",
        f"Ce matin, il paraît {m}.",
        f"Avant, Noah était moins {m}.",
        f"Demain, reste {m} et patient.",
        f"Quand elle parle, elle est {f}.",
        f"Nous l’avons trouvé {m}.",
        f"Elle est devenue plus {f}.",
        f"Il a toujours été {m}.",
        f"Après le match, il était {m}.",
        f"Tu as l’air {m} aujourd’hui.",
        f"Ma mère est restée {f}.",
        f"Le voisin semblait {m}.",
        f"Elle va rester {f}.",
        f"Nous étions calmes et {m}s." if not m.endswith("s") else f"Nous étions très {m}.",
        f"Pendant le cours, sois {m}.",
        f"Ils sont restés {m}s." if not m.endswith("s") else f"Ils sont restés {m}.",
        f"Je l’ai vue {f} hier.",
        f"Elle n’était pas {f}.",
        f"On la dit très {f}.",
        f"Il devient moins {m}.",
    ]
    b1 = [
        f"Bien qu’il soit {m}, il sourit.",
        f"Comme elle est {f}, on l’écoute.",
        f"Si tu es {m}, aide les autres.",
        f"Même fatiguée, elle reste {f}.",
        f"Lorsqu’il est {m}, tout va bien.",
        f"Puisqu’elle est {f}, elle guide.",
        f"Dès qu’il est {m}, on avance.",
        f"Pour réussir, restez {m}s." if not m.endswith("s") else f"Pour réussir, restez {m}.",
        f"Alors qu’elle est {f}, il doute.",
        f"Sans être {m}, il aide déjà.",
        f"Bien qu’elle soit {f}, elle ose.",
        f"Comme il reste {m}, on respire.",
        f"Si elle devient {f}, préviens-moi.",
        f"Quand on est {m}, on écoute.",
        f"Afin d’être {m}, je respire.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


def build_nat_phrases(entry: dict, label: str) -> dict[str, list[str]]:
    m = masc_form(entry, label)
    f = fem_form(entry, label)
    a1 = [
        f"Mon ami est {m}.",
        f"Léa est {f}.",
        f"Il est {m} et gentil.",
        f"Elle est {f} aussi.",
        f"Un élève {m} arrive.",
        f"Une voisine {f} sourit.",
        f"Nous parlons à un {m}.",
        f"Je connais une {f}.",
        f"Tu es {m} ?" if label == m else f"Tu es {f} ?",
        f"Ils sont {m}s." if not m.endswith("s") else f"Ils sont {m}.",
        f"Elle devient {f}.",
        f"Voici un ami {m}.",
        f"C’est une femme {f}.",
        f"Notre prof est {m}.",
        f"Sa mère est {f}.",
    ]
    a2 = [
        f"Hier, j’ai rencontré un {m}.",
        f"Ce matin, une {f} a parlé.",
        f"Mon voisin {m} est parti.",
        f"Elle a aidé une amie {f}.",
        f"Nous avons vu un guide {m}.",
        f"Demain, un ami {m} vient.",
        f"Quand j’étais petit, un {m}…",
        f"Il est devenu {m} officiel.",
        f"Elle est restée {f}.",
        f"J’ai écrit à un cousin {m}.",
        f"Tu as rencontré une {f} ?",
        f"Nous allons accueillir un {m}.",
        f"Le nouveau collègue est {m}.",
        f"La nouvelle collègue est {f}.",
        f"Ils ont voyagé avec un {m}.",
    ]
    # fix truncated
    a2 = [s if not s.endswith("…") else f"Avant, j’avais un ami {m}." for s in a2]
    b1 = [
        f"Bien qu’il soit {m}, il vit ici.",
        f"Comme elle est {f}, elle traduit.",
        f"Si ton ami est {m}, invite-le.",
        f"Même loin, mon ami {m} écrit.",
        f"Lorsqu’une {f} parle, j’écoute.",
        f"Puisqu’il est {m}, il explique.",
        f"Dès qu’un {m} arrive, on aide.",
        f"Pour l’aider, parle à la {f}.",
        f"Alors que le {m} lit, elle écrit.",
        f"Sans un guide {m}, on se perd.",
        f"Bien qu’elle soit {f}, elle reste.",
        f"Comme mon père est {m}, il sait.",
        f"Si elle devient {f}, dis-le moi.",
        f"Quand un {m} demande, on répond.",
        f"Afin d’aider un {m}, je traduis.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


def build_person_phrases(entry: dict, label: str, gender: str | None) -> dict[str, list[str]]:
    d = det_def(label, gender)
    i = det_ind(label, gender)
    a1 = [
        f"{d}{label} arrive demain.",
        f"J’aime {d}{label}.",
        f"{i}{label} habite ici.",
        f"Où est {d}{label} ?",
        f"Nous aidons {d}{label}.",
        f"Elle appelle {d}{label}.",
        f"{d}{label} sourit souvent.",
        f"Tu connais {d}{label} ?",
        f"Voici {d}{label} de Léa.",
        f"{d}{label} lit un livre.",
        f"Je parle à {d}{label}.".replace("à le ", "au ").replace("à la ", "à la "),
        f"Ils attendent {d}{label}.",
        f"{d}{label} prépare le repas.",
        f"On écoute {d}{label}.",
        f"Mila dessine {d}{label}.",
    ]
    # fix à le
    a1 = [s.replace("à le ", "au ") for s in a1]
    a2 = [
        f"Hier, {d}{label} est venu." if gender != "f" else f"Hier, {d}{label} est venue.",
        f"Ce matin, j’ai vu {d}{label}.",
        f"Nous avons aidé {d}{label}.",
        f"Demain, {d}{label} viendra.",
        f"Quand j’arrive, {d}{label} lit.",
        f"Elle a appelé {d}{label}.",
        f"J’ai écrit à {d}{label}.".replace("à le ", "au "),
        f"Ils ont rencontré {d}{label}.",
        f"{d}{label} a préparé le gâteau.",
        f"Tu as parlé à {d}{label} ?".replace("à le ", "au "),
        f"Nous allons voir {d}{label}.",
        f"Avant, {d}{label} vivait ici.",
        f"Pendant les vacances, {d}{label} joue.",
        f"Le soir, {d}{label} raconte.",
        f"Elle va aider {d}{label}.",
    ]
    a2 = [s.replace("à le ", "au ") for s in a2]
    b1 = [
        f"Bien que {d}{label} soit occupé, il aide." if gender != "f" else f"Bien que {d}{label} soit occupée, elle aide.",
        f"Comme {d}{label} sait, on écoute.",
        f"Si {d}{label} vient, prépare le thé.",
        f"Même fatigué, {d}{label} sourit." if gender != "f" else f"Même fatiguée, {d}{label} sourit.",
        f"Lorsque {d}{label} parle, on se tait.",
        f"Puisque {d}{label} part, dis au revoir.",
        f"Dès que {d}{label} arrive, on mange.",
        f"Pour aider {d}{label}, sois patient.",
        f"Alors que {d}{label} lit, Léa écrit.",
        f"Sans {d}{label}, la maison est vide.",
        f"Bien que jeune, {d}{label} aide.",
        f"Comme j’aime {d}{label}, je l’appelle.",
        f"Si tu vois {d}{label}, salue-le." if gender != "f" else f"Si tu vois {d}{label}, salue-la.",
        f"Quand {d}{label} chante, on sourit.",
        f"Afin d’aider {d}{label}, je reste.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


def build_verb_phrases(label: str) -> dict[str, list[str]]:
    # present 1pl / infinitive / imperative-ish short sentences
    a1 = [
        f"Nous devons {label} doucement.",
        f"Il faut {label} maintenant.",
        f"Tu peux {label} ici.",
        f"On va {label} ensemble.",
        f"J’aime {label} le matin.",
        f"Elle veut {label} vite.",
        f"Savoir {label} est utile.",
        f"Pour commencer, {label}.",
        f"N’oublie pas de {label}.",
        f"Nous apprenons à {label}.",
        f"Il préfère {label} seul.",
        f"Tu dois {label} encore.",
        f"On peut {label} dehors.",
        f"J’essaie de {label}.",
        f"Elle commence à {label}.",
    ]
    a2 = [
        f"Hier, j’ai dû {label}.",
        f"Ce matin, on a pu {label}.",
        f"Nous avons appris à {label}.",
        f"Elle a voulu {label} vite.",
        f"Demain, nous allons {label}.",
        f"Quand j’arrive, je vais {label}.",
        f"Il a oublié de {label}.",
        f"Tu as réussi à {label}.",
        f"Après le cours, on peut {label}.",
        f"J’ai commencé à {label}.",
        f"Ils ont décidé de {label}.",
        f"Avant, je ne savais pas {label}.",
        f"Nous allons {label} ensemble.",
        f"Elle va {label} ce soir.",
        f"Tu vas {label} demain.",
    ]
    b1 = [
        f"Bien qu’il faille {label}, j’attends.",
        f"Comme il faut {label}, on commence.",
        f"Si tu peux {label}, aide-nous.",
        f"Même pressé, il veut {label}.",
        f"Lorsque j’ai le temps, je vais {label}.",
        f"Puisqu’on doit {label}, préparons-nous.",
        f"Dès qu’on peut {label}, on le fait.",
        f"Pour bien {label}, va doucement.",
        f"Alors qu’elle veut {label}, il attend.",
        f"Sans savoir {label}, c’est dur.",
        f"Bien que simple, {label} demande soin.",
        f"Comme j’aime {label}, je m’exerce.",
        f"Si on doit {label}, faisons-le bien.",
        f"Quand il faut {label}, je m’applique.",
        f"Afin de {label}, prépare le matériel.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


def build_expr_phrases(label: str) -> dict[str, list[str]]:
    a1 = [
        f"C’est {label}.",
        f"On dit {label}.",
        f"Regarde {label}.",
        f"Je choisis {label}.",
        f"Elle demande {label}.",
        f"Nous voulons {label}.",
        f"Tu préfères {label} ?",
        f"Il répond {label}.",
        f"Voici l’option {label}.",
        f"J’écris {label}.",
        f"On apprend {label}.",
        f"Dis plutôt {label}.",
        f"Elle indique {label}.",
        f"Je note {label}.",
        f"Ils choisissent {label}.",
    ]
    a2 = [
        f"Hier, j’ai choisi {label}.",
        f"Ce matin, elle a dit {label}.",
        f"Nous avons demandé {label}.",
        f"Il a répondu {label}.",
        f"Demain, je dirai {label}.",
        f"Quand on commande, on dit {label}.",
        f"Tu as écrit {label} ?",
        f"Ils ont préféré {label}.",
        f"J’ai noté {label} dans mon cahier.",
        f"Elle va choisir {label}.",
        f"Nous allons indiquer {label}.",
        f"Avant, je ne disais pas {label}.",
        f"Pendant le cours, on révise {label}.",
        f"Le serveur a compris {label}.",
        f"J’ai répété {label} clairement.",
    ]
    b1 = [
        f"Bien que simple, dis {label}.",
        f"Comme on dit {label}, répète.",
        f"Si tu commandes, choisis {label}.",
        f"Même vite, articule {label}.",
        f"Lorsque tu hésites, dis {label}.",
        f"Puisqu’il faut choisir, prends {label}.",
        f"Dès que tu peux, note {label}.",
        f"Pour être clair, écris {label}.",
        f"Alors qu’il dit {label}, elle note.",
        f"Sans comprendre {label}, demande.",
        f"Bien qu’utile, {label} se pratique.",
        f"Comme j’ai appris {label}, je l’utilise.",
        f"Si on te demande, réponds {label}.",
        f"Quand tu commandes, précise {label}.",
        f"Afin d’être précis, dis {label}.",
    ]
    return {
        "a1": [x for x in (fit(s) for s in a1) if x],
        "a2": [x for x in (fit(s) for s in a2) if x],
        "b1": [x for x in (fit(s) for s in b1) if x],
    }


FORBIDDEN_PREFIXES = (
    "je vois ",
    "voici ",
    "c’est le mot",
    "c'est le mot",
    "j’écoute le mot",
    "j'écoute le mot",
    "je répète ",
    "je pense que ",
    "le mot du jour",
    "nous apprenons ",
    "répétez",
)


def contains_target(sentence: str, entry: dict) -> bool:
    label = entry["label"]
    forms = {label.lower()}
    if entry.get("feminine"):
        forms.add(str(entry["feminine"]).lower())
    if entry.get("masculine"):
        forms.add(str(entry["masculine"]).lower())
    low = sentence.lower()
    return any(f in low for f in forms if f)


def validate_pool(pool: list[str], entry: dict) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for s in pool:
        t = fit(s)
        if not t:
            continue
        low = t.lower()
        if any(low.startswith(p) for p in FORBIDDEN_PREFIXES):
            continue
        if "le mot " in low or "du mot " in low:
            continue
        if not contains_target(t, entry):
            continue
        if t in seen:
            continue
        seen.add(t)
        out.append(t)
    return out


def make_phrases(entry: dict) -> dict[str, list[str]]:
    label = entry["label"]
    kind = kind_for(entry)
    gender = infer_gender(label, entry)
    if kind == "adj":
        pools = build_adj_phrases(entry, label)
    elif kind == "adj_nat":
        pools = build_nat_phrases(entry, label)
    elif kind == "person":
        pools = build_person_phrases(entry, label, gender)
    elif kind == "verb":
        pools = build_verb_phrases(label)
    elif kind == "expr":
        pools = build_expr_phrases(label)
    else:
        pools = build_noun_phrases(label, gender)

    offset = hash_offset(entry["id"], 17)
    result: dict[str, list[str]] = {}
    for level in ("a1", "a2", "b1"):
        cleaned = validate_pool(pools.get(level, []), entry)
        picked = rotate(cleaned, offset, 10)
        # fallback fill with noun-like short authentic lines if short
        if len(picked) < 10:
            extra = validate_pool(build_noun_phrases(label, gender).get(level, []), entry)
            for s in rotate(extra, offset + 3, 10):
                if s not in picked:
                    picked.append(s)
                if len(picked) >= 10:
                    break
        if len(picked) < 10:
            # last resort: still meaningful short lines, varied
            fillers = [
                fit(f"Léa parle de {label}."),
                fit(f"Noah aime {label}."),
                fit(f"On utilise {label}."),
                fit(f"Elle choisit {label}."),
                fit(f"Il prépare {label}."),
                fit(f"Nous voyons {label}."),
                fit(f"Tu veux {label} ?"),
                fit(f"Mila regarde {label}."),
                fit(f"Ils prennent {label}."),
                fit(f"Je cherche {label}."),
            ]
            for s in fillers:
                if s and s not in picked and contains_target(s, entry):
                    picked.append(s)
                if len(picked) >= 10:
                    break
        result[level] = picked[:10]
        if len(result[level]) < 10:
            raise RuntimeError(f"Only {len(result[level])} phrases for {entry['id']} / {level}")
    return result


def process_file(path: Path) -> tuple[int, int]:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    updated = 0
    words = 0
    out_lines: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not (stripped.startswith("{") and '"label":' in stripped and '"sentences":' in stripped):
            out_lines.append(line)
            continue
        # trailing comma?
        trailing = ""
        payload = stripped
        if payload.endswith(","):
            trailing = ","
            payload = payload[:-1]
        try:
            entry = json.loads(payload)
        except json.JSONDecodeError as e:
            print(f"JSON error in {path.name}: {e}", file=sys.stderr)
            out_lines.append(line)
            continue
        words += 1
        phrases = make_phrases(entry)
        entry.setdefault("sentences", {})
        entry["sentences"]["phrase"] = phrases
        new_line = "      " + json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + trailing + "\n"
        out_lines.append(new_line)
        updated += 1
    path.write_text("".join(out_lines), encoding="utf-8")
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
