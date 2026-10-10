#!/usr/bin/env python3
"""
Remplit les 3 formes (qcm_texte / qcm_image / lignes) pour toutes les questions CE/CO.
- lignes : toujours
- qcm_image : seulement si les 3 choix sont illustrables (images distinctes)
- qcm_texte : dérivé des libellés / images quand la forme active n’est pas déjà texte
Génère un rapport des images manquantes concrètes (pas Oui/Non / abstract).
"""
from __future__ import annotations

import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOCAB = ROOT / "public/lib/images/vocabulaire"
BANKS = list((ROOT / "src/content/tcf").glob("*/ce.json")) + list(
    (ROOT / "src/content/tcf").glob("*/co.json")
)

HOUR_NAMES = {
    0: "minuit",
    1: "une",
    2: "deux",
    3: "trois",
    4: "quatre",
    5: "cinq",
    6: "six",
    7: "sept",
    8: "huit",
    9: "neuf",
    10: "dix",
    11: "onze",
    12: "midi",
    13: "treize",
    14: "quatorze",
    15: "quinze",
    16: "seize",
    17: "dix-sept",
    18: "dix-huit",
    19: "dix-neuf",
    20: "vingt",
    21: "vingt-et-une",
    22: "vingt-deux",
    23: "vingt-trois",
}

# Libellé normalisé → slug vocabulaire (ou chemin relatif thème/slug)
ALIASES: dict[str, str] = {
    "par telephone": "technologie/telephone-portable",
    "au telephone": "technologie/telephone-portable",
    "telephone": "technologie/telephone-portable",
    "telephone portable": "technologie/telephone-portable",
    "smartphone": "technologie/smartphone",
    "sur internet": "technologie/internet",
    "internet": "technologie/internet",
    "en ligne": "technologie/internet",
    "par courrier": "argent-administration/enveloppe",
    "courrier": "argent-administration/enveloppe",
    "par email": "technologie/ordinateur",
    "par e-mail": "technologie/ordinateur",
    "par mail": "technologie/ordinateur",
    "le sport": "sports/sport",
    "du sport": "sports/sport",
    "faire du sport": "sports/sport",
    "sport": "sports/sport",
    "le basket": "sports/basket",
    "basket": "sports/basket",

    "un jeu video": "technologie/jeu-video",
    "un jeu vidéo": "technologie/jeu-video",
    "jeu video": "technologie/jeu-video",
    "jeu vidéo": "technologie/jeu-video",
    "la grippe": "sante/grippe",
    "grippe": "sante/grippe",
    "au bord du lac": "nature/lac",
    "le lac": "nature/lac",
    "lac": "nature/lac",
    "se reposer": "actions/dormir",
    "un apéro": "boissons/cocktail",
    "apero": "boissons/cocktail",
    "apéro": "boissons/cocktail",
    "des pastilles": "sante/comprime",
    "la salsa": "musique/musique",
    "allemande": "pays/allemagne",
    "le francais": "pays/france",
    "le français": "pays/france",
    "d'un studio": "maison/appartement",
    "un studio": "maison/appartement",
    "il travaille": "ecole-bureau/bureau",
    "de travail": "ecole-bureau/bureau",
    "un contrat de travail": "ecole-bureau/diplôme",
    "des pastilles": "sante/comprime",


    "un mariage": "famille-personnes/mariés",
    "mariage": "famille-personnes/mariés",
    "des vacances": "voyage/valise",
    "de ses vacances": "voyage/valise",
    "pour les vacances": "voyage/valise",
    "vacances": "voyage/valise",
    "la musique": "musique/musique",
    "musique": "musique/musique",
    "pluvieux": "meteo/pluie",
    "la pluie": "meteo/pluie",
    "pluie": "meteo/pluie",
    "de la meteo": "meteo/meteo",
    "de la météo": "meteo/meteo",
    "meteo": "meteo/meteo",
    "météo": "meteo/meteo",
    "regarder un film": "ville/cinema",
    "un film": "ville/cinema",
    "film": "ville/cinema",
    "en pleine nature": "nature/forêt",
    "la nature": "nature/forêt",
    "nature": "nature/forêt",
    "spaghetti au pesto": "aliments/spaghetti",
    "spaghetti": "aliments/spaghetti",
    "en mai": "temps-calendrier/calendrier",
    "en juin": "temps-calendrier/calendrier",
    "un stage": "ecole-bureau/bureau",
    "son travail": "ecole-bureau/bureau",
    "son mode de vie": "maison/maison",
    "francaise": "pays/france",
    "française": "pays/france",
    "poser des questions": "actions/lever-la-main",
    "ennuyeux": "actions/dormir",
    "votre adresse": "maison/maison",
    "un seul": "nombres-mesures/un",
    "une seule": "nombres-mesures/un",
    "pour six": "nombres-mesures/six",

    "a l accueil": "actions/demander-a-l-accueil",
    "a l'accueil": "actions/demander-a-l-accueil",
    "au restaurant": "ville/restaurant",
    "dans un restaurant": "ville/restaurant",
    "dans le restaurant": "ville/restaurant",
    "restaurant": "ville/restaurant",
    "au cinema": "ville/cinema",
    "au cinéma": "ville/cinema",
    "cinema": "ville/cinema",
    "en bus": "transports/bus",
    "par le bus": "transports/bus",
    "le bus": "transports/bus",
    "bus": "transports/bus",
    "en voiture": "transports/voiture",
    "la voiture": "transports/voiture",
    "voiture": "transports/voiture",
    "en train": "transports/train",
    "le train": "transports/train",
    "train": "transports/train",
    "en metro": "transports/metro",
    "en métro": "transports/metro",
    "metro": "transports/metro",
    "a pied": "actions/marcher",
    "a velo": "transports/velo",
    "a vélo": "transports/velo",
    "velo": "transports/velo",
    "vélo": "transports/velo",
    "dans la cuisine": "maison/cuisine",
    "a la cuisine": "maison/cuisine",
    "cuisine": "maison/cuisine",
    "dans le salon": "maison/salon",
    "au salon": "maison/salon",
    "salon": "maison/salon",
    "dans la chambre": "maison/chambre",
    "chambre": "maison/chambre",
    "dans la salle de bain": "maison/salle-de-bain",
    "salle de bain": "maison/salle-de-bain",
    "a l ecole": "ville/école",
    "a l'ecole": "ville/école",
    "a l'école": "ville/école",
    "ecole": "ville/école",
    "école": "ville/école",
    "a la plage": "nature/plage",
    "plage": "nature/plage",
    "au parc": "ville/parc",
    "parc": "ville/parc",
    "a la gare": "ville/gare",
    "gare": "ville/gare",
    "a la poste": "ville/poste",
    "poste": "ville/poste",
    "a la banque": "ville/banque",
    "banque": "ville/banque",
    "a la pharmacie": "ville/pharmacie",
    "pharmacie": "ville/pharmacie",
    "a l hopital": "ville/hopital",
    "a l'hopital": "ville/hopital",
    "a l'hôpital": "ville/hopital",
    "hopital": "ville/hopital",
    "hôpital": "ville/hopital",
    "au marche": "ville/marché",
    "au marché": "ville/marché",
    "marche": "ville/marché",
    "marché": "ville/marché",
    "a la bibliotheque": "ville/bibliotheque",
    "bibliotheque": "ville/bibliotheque",
    "bibliothèque": "ville/bibliotheque",
    "au supermarche": "ville/supermarche",
    "au supermarché": "ville/supermarche",
    "supermarche": "ville/supermarche",
    "supermarché": "ville/supermarche",
    "au cafe": "ville/café",
    "au café": "ville/café",
    "cafe": "ville/café",
    "café": "ville/café",
    "a la piscine": "loisirs/piscine",
    "piscine": "loisirs/piscine",
    "au musee": "ville/musee",
    "au musée": "ville/musee",
    "musee": "ville/musee",
    "musée": "ville/musee",
    "a l hotel": "ville/hôtel",
    "a l'hotel": "ville/hôtel",
    "a l'hôtel": "ville/hôtel",
    "hotel": "ville/hôtel",
    "hôtel": "ville/hôtel",
    "au travail": "ecole-bureau/bureau",
    "au bureau": "ecole-bureau/bureau",
    "bureau": "ecole-bureau/bureau",
    "carte bancaire": "technologie/carte-bancaire",
    "par carte": "technologie/carte-bancaire",
    "par carte bancaire": "technologie/carte-bancaire",
    "en especes": "argent-administration/especes",
    "en espèces": "argent-administration/especes",
    "especes": "argent-administration/especes",
    "espèces": "argent-administration/especes",
    "cheque": "argent-administration/chequier",
    "chèque": "argent-administration/chequier",
    "les boissons": "boissons/boisson",
    "des boissons": "boissons/boisson",
    "boissons": "boissons/boisson",
    "boisson": "boissons/boisson",
    "du pain": "aliments/pain",
    "le pain": "aliments/pain",
    "pain": "aliments/pain",
    "de l eau": "boissons/eau",
    "eau": "boissons/eau",
    "du cafe": "boissons/café",
    "du café": "boissons/café",
    "il est malade": "sante/malade",
    "elle est malade": "sante/malade",
    "malade": "sante/malade",
    "au rez-de-chaussee": "maison/rez-de-chaussee",
    "au rez-de-chaussée": "maison/rez-de-chaussee",
    "au premier etage": "maison/escalier",
    "au premier étage": "maison/escalier",
    "demain": "temps-calendrier/calendrier",
    "aujourd hui": "temps-calendrier/calendrier",
    "aujourd'hui": "temps-calendrier/calendrier",
    "hier": "temps-calendrier/calendrier",
    "la semaine prochaine": "temps-calendrier/calendrier",
    "ce week-end": "temps-calendrier/calendrier",
    "le week-end": "temps-calendrier/calendrier",
}


def strip_acc(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def norm_key(s: str) -> str:
    s = strip_acc(s.strip().lower())
    s = s.replace("’", "'").replace("`", "'")
    s = re.sub(r"[«»\"“”]", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def slugify(s: str) -> str:
    s = norm_key(s)
    s = re.sub(r"[^\w\s\-]", "", s, flags=re.UNICODE)
    return re.sub(r"\s+", "-", s).strip("-")


def build_index():
    by_slug: dict[str, str] = {}
    by_label: dict[str, str] = {}
    by_theme: dict[str, list[tuple[str, str]]] = {}
    for theme in sorted(VOCAB.iterdir()):
        if not theme.is_dir():
            continue
        by_theme[theme.name] = []
        for f in theme.glob("*.webp"):
            path = f"/lib/images/vocabulaire/{theme.name}/{f.name}"
            by_slug[f.stem] = path
            by_theme[theme.name].append((f.stem, path))
            label = f.stem.replace("-", " ")
            for key in {
                f.stem,
                label,
                norm_key(f.stem),
                norm_key(label),
                slugify(label),
            }:
                by_label.setdefault(key, path)
    # aliases
    for k, v in ALIASES.items():
        if "/" in v:
            theme, slug = v.split("/", 1)
            path = f"/lib/images/vocabulaire/{theme}/{slug}.webp"
            if (VOCAB / theme / f"{slug}.webp").exists():
                by_label[norm_key(k)] = path
                by_label[slugify(k)] = path
        elif v in by_slug:
            by_label[norm_key(k)] = by_slug[v]
            by_label[slugify(k)] = by_slug[v]
    return by_slug, by_label, by_theme


BY_SLUG, BY_LABEL, BY_THEME = build_index()


def is_abstract(text: str) -> bool:
    t = norm_key(text)
    if t in {
        "oui",
        "non",
        "oui, c'est vrai",
        "non, c'est faux",
        "oui c'est vrai",
        "non c'est faux",
        "ce n'est pas dit",
        "on ne sait pas",
        "on ne le sait pas",
        "je ne sais pas",
        "peut-etre",
        "peut-être",
        "un cdi",
        "une",

        "aucune de ces reponses",
        "aucune de ces réponses",
    }:
        return True
    if re.fullmatch(r"\d+\s*%", t):
        return True
    if re.fullmatch(r"\d+\s*(euros?|francs?|chf|€)", t):
        return True
    if re.fullmatch(r"\d+\s*minutes?", t):
        return True
    if re.fullmatch(r"\d+\s*ans?", t):
        return True
    if re.fullmatch(r"\d+\s*degres?", t) or re.fullmatch(r"\d+\s*degrés?", t):
        return True
    if re.fullmatch(r"\d+", t):
        return True
    if re.match(r"^(l['']?activite|l['']?activité|exercice|question|le stage|le club)\s*\d+", t):
        return True
    if "trop cher" in t or "pas assez" in t:
        return True
    if t in {
        "ce n'est pas precise",
        "ce n'est pas précisé",
        "oui, un peu",
        "tres peu",
        "très peu",
        "beaucoup",
        "aucun",
        "une fois",
        "plus calme",
        "plus bruyante",
        "plus animee",
        "plus animée",
        "le week-end seulement",
        "les monstres",
        "le mamco",
        "jeu devinup",
        "cats",
        "un cdd",
        "seul",
        "sale",
        "mauvais",
        "moyenne",
        "a tout le monde",
        "non, il n'est pas indique",
        "non, il n'est pas indiqué",
        "on maigrira",
        "vieux et bruyant",
        "petit et sombre",
        "petit et brun",
        "studio pres des commerces",
        "studio près des commerces",
    }:
        return True
    if t.startswith("l'expose") or t.startswith("l’exposé") or t.startswith("l'atelier") or t.startswith("l’atelier"):
        return True
    return False




def resolve_hour(text: str) -> str | None:
    t = norm_key(text).replace("heures", "h").replace("heure", "h")
    if t in {"midi", "a midi"}:
        return BY_SLUG.get("midi")
    if t in {"minuit", "a minuit"}:
        return BY_SLUG.get("minuit")
    m = re.search(r"(?:a\s*)?(\d{1,2})\s*h(?:\s*(\d{1,2}))?", t)
    if not m:
        return None
    h = int(m.group(1))
    mi = int(m.group(2) or 0)
    if h > 23:
        return None
    base = HOUR_NAMES.get(h)
    if not base:
        return None
    if base in ("midi", "minuit") and mi == 0:
        return BY_SLUG.get(base)
    # Pour 12 h / 0 h avec minutes, aussi tenter douze- / minuit- numériques
    bases = [base]
    if h == 12:
        bases = ["midi", "douze"]
    if h == 0:
        bases = ["minuit"]
    cands: list[str] = []
    for b in bases:
        if mi == 0:
            cands += [f"{b}-heures", f"{b}-heures-numerique", b]
        elif mi == 30:
            cands += [f"{b}-heures-trente", f"{b}-heures-et-demie", "midi-et-demie"]
        elif mi == 15:
            cands += [f"{b}-heures-quinze", f"{b}-heures-et-quart", "midi-et-quart"]
        elif mi == 45:
            cands += [f"{b}-heures-quarante-cinq", f"{b}-heures-moins-le-quart"]
        else:
            cands += [f"{b}-heures"]
    for c in cands:
        if c in BY_SLUG:
            return BY_SLUG[c]
    return None



def resolve_image(text: str) -> str | None:
    if not text or is_abstract(text):
        return None
    hour = resolve_hour(text)
    if hour:
        return hour
    raw = text.strip()
    keys = [
        norm_key(raw),
        slugify(raw),
        slugify(re.sub(r"^(au|a la|a l'|a l’|dans le|dans la|dans un|dans une|en|par|sur|le|la|les|un|une|des|du|de la|de l'|de l’)\s+", "", norm_key(raw), flags=re.I)),
    ]
    # strip trailing punctuation
    for k in list(keys):
        keys.append(re.sub(r"[.!?]+$", "", k).strip())
    for k in keys:
        if not k:
            continue
        if k in BY_LABEL:
            return BY_LABEL[k]
        if k in BY_SLUG:
            return BY_SLUG[k]
    # contained vocab label (longest first)
    low = norm_key(raw)
    best = None
    best_len = 0
    for label, path in BY_LABEL.items():
        if " " not in label and "-" not in label and len(label) < 4:
            continue
        lab = label.replace("-", " ")
        if len(lab) >= 4 and lab in low and len(lab) > best_len:
            best = path
            best_len = len(lab)
    return best


def label_from_image(path: str) -> str:
    stem = Path(path).stem
    return stem.replace("-", " ")


def correct_texte(q: dict) -> str:
    if q.get("type_reponse") == "qcm_texte":
        for c in q.get("choix") or []:
            if c.get("correct"):
                return (c.get("texte") or "").strip()
        return ((q.get("choix") or [{}])[0].get("texte") or "").strip()
    if q.get("type_reponse") == "qcm_image":
        for c in q.get("choix") or []:
            if c.get("correct"):
                return label_from_image(c.get("image") or "")
        return label_from_image(((q.get("choix") or [{}])[0].get("image") or ""))
    return (q.get("reponse_modele") or "").strip()


def make_lignes(reponse: str, nb: int | None = None) -> dict:
    return {
        "nb_lignes": nb if nb is not None else (1 if len(reponse) < 40 else 2),
        "reponse_modele": reponse,
    }


def try_qcm_image_from_textes(textes: list[str]) -> dict | None:
    imgs = [resolve_image(t) for t in textes]
    if any(i is None for i in imgs):
        return None
    if len(set(imgs)) != len(imgs):
        return None
    choix = []
    for i, (t, img) in enumerate(zip(textes, imgs)):
        item = {"id": "abcd"[i], "image": img}
        if i == 0:
            # caller must pass correct first — we rebuild with correct flag outside
            pass
        choix.append(item)
    return None  # rebuilt below


def build_qcm_image(choices: list[tuple[str, bool]]) -> dict | None:
    """choices: list of (texte, correct)."""
    resolved = []
    for texte, correct in choices:
        img = resolve_image(texte)
        if not img:
            return None
        resolved.append((img, correct, texte))
    imgs = [r[0] for r in resolved]
    if len(set(imgs)) != len(imgs):
        return None
    choix = []
    for i, (img, correct, _) in enumerate(resolved):
        item: dict = {"id": "abcd"[i], "image": img}
        if correct:
            item["correct"] = True
        choix.append(item)
    return {"melanger": True, "choix": choix}


def build_qcm_texte_from_images(choices: list[tuple[str, bool]]) -> dict:
    choix = []
    for i, (img, correct) in enumerate(choices):
        item: dict = {"id": "abcd"[i], "texte": label_from_image(img)}
        if correct:
            item["correct"] = True
        choix.append(item)
    return {"melanger": True, "choix": choix}


def distractors_for(path: str, n: int = 2) -> list[str]:
    theme = path.strip("/").split("/")[3] if "/vocabulaire/" in path else None
    pool = list(BY_THEME.get(theme or "", []))
    out = []
    for slug, p in pool:
        if p == path:
            continue
        out.append(p)
        if len(out) >= n:
            break
    # fallback any
    if len(out) < n:
        for theme_words in BY_THEME.values():
            for slug, p in theme_words:
                if p != path and p not in out:
                    out.append(p)
                if len(out) >= n:
                    return out
    return out


def try_forms_from_lignes(reponse: str) -> tuple[dict | None, dict | None]:
    """Return (qcm_texte, qcm_image) if concrete enough."""
    img = resolve_image(reponse)
    concept = None
    if not img:
        # try extract after verbs
        m = re.search(
            r"(?:acheter|prendre|voir|aller(?:\s+à|\s+au|\s+a)?|manger|boire|visiter)\s+(.+)$",
            reponse.strip(),
            flags=re.I,
        )
        if m:
            concept = m.group(1).strip(" .")
            img = resolve_image(concept)
    if not img:
        # longest vocab match inside
        img = resolve_image(reponse)
    if not img:
        return None, None
    label = concept or label_from_image(img)
    # if original short, prefer it as label
    if len(reponse.split()) <= 5 and not is_abstract(reponse):
        label = reponse.strip(" .")
    dist = distractors_for(img, 2)
    if len(dist) < 2:
        return None, None
    textes = [label, label_from_image(dist[0]), label_from_image(dist[1])]
    # ensure unique labels
    if len(set(norm_key(t) for t in textes)) < 3:
        return None, None
    qcm_texte = {
        "melanger": True,
        "choix": [
            {"id": "a", "texte": textes[0], "correct": True},
            {"id": "b", "texte": textes[1]},
            {"id": "c", "texte": textes[2]},
        ],
    }
    qcm_image = {
        "melanger": True,
        "choix": [
            {"id": "a", "image": img, "correct": True},
            {"id": "b", "image": dist[0]},
            {"id": "c", "image": dist[1]},
        ],
    }
    return qcm_texte, qcm_image


def enrich_question(q: dict, stats: Counter) -> dict:
    t = q.get("type_reponse")
    formes = dict(q.get("formes") or {})
    reponse = correct_texte(q)

    # Always ensure lignes in formes if not active, or keep active
    if t != "lignes":
        if not formes.get("lignes") or not (formes["lignes"].get("reponse_modele") or "").strip():
            formes["lignes"] = make_lignes(reponse, q.get("nb_lignes"))
            stats["added_lignes"] += 1
    else:
        # ensure reponse_modele present
        if not (q.get("reponse_modele") or "").strip():
            q = {**q, "reponse_modele": reponse or "…"}
            stats["fixed_lignes_empty"] += 1

    if t == "qcm_texte":
        choix = q.get("choix") or []
        pairs = [((c.get("texte") or "").strip(), bool(c.get("correct"))) for c in choix]
        # normalize: ensure one correct
        if not any(c for _, c in pairs) and pairs:
            pairs[0] = (pairs[0][0], True)
        img_forme = build_qcm_image(pairs)
        if img_forme:
            formes["qcm_image"] = img_forme
            stats["added_qcm_image"] += 1
        else:
            stats["skip_qcm_image"] += 1
            for texte, _ in pairs:
                if not resolve_image(texte) and not is_abstract(texte):
                    stats[f"miss:{texte}"] += 1

    elif t == "qcm_image":
        choix = q.get("choix") or []
        pairs = [((c.get("image") or "").strip(), bool(c.get("correct"))) for c in choix]
        if not any(c for _, c in pairs) and pairs:
            pairs[0] = (pairs[0][0], True)
        formes["qcm_texte"] = build_qcm_texte_from_images(pairs)
        stats["added_qcm_texte"] += 1

    elif t == "lignes":
        qt, qi = try_forms_from_lignes(reponse)
        if qt:
            formes["qcm_texte"] = qt
            stats["added_qcm_texte_from_lignes"] += 1
        if qi:
            formes["qcm_image"] = qi
            stats["added_qcm_image_from_lignes"] += 1
        if not qt and not qi:
            stats["lignes_only"] += 1

    # Drop empty formes
    cleaned = {}
    for k, v in formes.items():
        if k == t:
            continue  # active form lives at root
        if k == "lignes" and (v.get("reponse_modele") or "").strip():
            cleaned[k] = v
        elif k in ("qcm_texte", "qcm_image") and v.get("choix"):
            cleaned[k] = v
    if cleaned:
        q = {**q, "formes": cleaned}
    elif "formes" in q:
        q = {k: v for k, v in q.items() if k != "formes"}
    return q


def missing_concrete_candidates(stats: Counter, limit: int = 80) -> list[tuple[int, str]]:
    items = []
    for k, v in stats.items():
        if k.startswith("miss:"):
            items.append((v, k[5:]))
    items.sort(reverse=True)
    return items[:limit]


def main():
    global BY_SLUG, BY_LABEL, BY_THEME
    BY_SLUG, BY_LABEL, BY_THEME = build_index()
    stats: Counter = Counter()
    for bank in sorted(BANKS):
        data = json.loads(bank.read_text())
        for ex in data:
            qs = ex.get("questions") or []
            ex["questions"] = [enrich_question(q, stats) for q in qs]
        bank.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"wrote {bank.relative_to(ROOT)}")

    report = {
        "stats": {k: v for k, v in stats.items() if not k.startswith("miss:")},
        "top_missing": missing_concrete_candidates(stats, 100),
    }
    out = ROOT / "scripts/fill-tcf-formes-report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report["stats"], ensure_ascii=False, indent=2))
    print("top missing:")
    for n, t in report["top_missing"][:40]:
        print(f"  {n:4d}  {t}")


if __name__ == "__main__":
    main()
