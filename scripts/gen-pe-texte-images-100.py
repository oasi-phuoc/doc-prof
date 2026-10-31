#!/usr/bin/env python3
"""Génère / met à jour 100 exercices PE texte_images (ex. 11) dans a0-a1/pe.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOCAB = ROOT / "public/lib/images/vocabulaire"
PE_JSON = ROOT / "src/tcf/content/a0-a1/pe.json"
CONSIGNE = "Complétez le texte à l’aide des images. Écrivez les mots correctement."

# Index stem → chemins (plusieurs possibles).
_STEM_INDEX: dict[str, list[Path]] = {}
for _p in VOCAB.rglob("*.webp"):
    _STEM_INDEX.setdefault(_p.stem.lower(), []).append(_p)


def _norm(s: str) -> str:
    return (
        s.lower()
        .replace("é", "e")
        .replace("è", "e")
        .replace("ê", "e")
        .replace("à", "a")
        .replace("â", "a")
        .replace("ô", "o")
        .replace("û", "u")
        .replace("ù", "u")
        .replace("î", "i")
        .replace("ï", "i")
        .replace("ç", "c")
        .replace("œ", "oe")
    )


_NORM_INDEX: dict[str, list[Path]] = {}
for _stem, _paths in _STEM_INDEX.items():
    _NORM_INDEX.setdefault(_norm(_stem), []).extend(_paths)


def img(cat: str, slug: str) -> str:
    """Résout une image vocabulaire ; préfère le dossier `cat` si possible."""
    # 1) exact dans le dossier
    path = VOCAB / cat / f"{slug}.webp"
    if path.is_file():
        return f"/lib/images/vocabulaire/{cat}/{path.name}"
    # 2) stem exact (casse / accents) dans le dossier
    if (VOCAB / cat).is_dir():
        for cand in (VOCAB / cat).glob("*.webp"):
            if cand.stem.lower() == slug.lower() or _norm(cand.stem) == _norm(slug):
                return f"/lib/images/vocabulaire/{cat}/{cand.name}"
        # préfixe dans le dossier
        pref = sorted((VOCAB / cat).glob(f"{slug}*.webp"))
        if pref:
            return f"/lib/images/vocabulaire/{cat}/{pref[0].name}"
    # 3) stem exact global
    hits = _STEM_INDEX.get(slug.lower()) or _NORM_INDEX.get(_norm(slug)) or []
    if hits:
        # préférer cat
        for h in hits:
            if h.parent.name == cat:
                return f"/lib/images/vocabulaire/{h.parent.name}/{h.name}"
        h = hits[0]
        return f"/lib/images/vocabulaire/{h.parent.name}/{h.name}"
    # 4) préfixe global
    nslug = _norm(slug)
    for stem, paths in _NORM_INDEX.items():
        if stem.startswith(nslug) or nslug.startswith(stem):
            for h in paths:
                if h.parent.name == cat:
                    return f"/lib/images/vocabulaire/{h.parent.name}/{h.name}"
            h = paths[0]
            return f"/lib/images/vocabulaire/{h.parent.name}/{h.name}"
    raise FileNotFoundError(f"Image manquante : {cat}/{slug}.webp")


def blank(n: int) -> str:
    return f"_____ ({n})"


def sent(*parts: str) -> str:
    return " ".join(p for p in parts if p).strip()


# (scene, scenario, mots[(mot, cat, slug)], lignes avec blanks déjà numérotés)
# 100 thèmes distincts — style A1, histoire courte / message / consignes.

ENTRIES: list[dict] = []


def add(
    scene: str,
    scenario: str,
    mots: list[tuple[str, str, str]],
    lignes: list[str],
    *,
    keep_id: str | None = None,
) -> None:
    assert len(mots) == 5, scene
    text = "\n".join(lignes)
    for i in range(1, 6):
        assert f"({i})" in text, f"{scene}: manque blank {i}"
    ENTRIES.append(
        {
            "keep_id": keep_id,
            "scene": scene,
            "scenario": scenario,
            "mots": [{"mot": m, "image": img(c, s)} for m, c, s in mots],
            "texte": text,
        }
    )


# —— 1–2 : existants (réécrits une phrase / ligne) ——
add(
    "La carte postale",
    "vacances",
    [
        ("montagne", "nature", "montagne"),
        ("soleil", "meteo", "soleil"),
        ("photos", "loisirs", "photo"),
        ("oiseaux", "oiseaux", "oiseau"),
        ("poisson", "aliments", "poisson"),
    ],
    [
        "Madame Rosa,",
        "J’espère que tu vas bien.",
        f"Moi, je passe de très bonnes vacances ! Je suis à la {blank(1)}.",
        f"Je reste ici pendant deux semaines. Il y a du {blank(2)} tous les matins.",
        f"Nous prenons beaucoup de {blank(3)}.",
        f"Nous aimons écouter les {blank(4)} et observer les animaux dans la nature.",
        f"Hier, j’ai mangé du {blank(5)} et des frites au restaurant.",
        "Et toi, que fais-tu en ce moment ?",
        "J’ai hâte d’avoir de tes nouvelles !",
        "À bientôt.",
    ],
    keep_id="tcf-a1-tpa-pe-2",
)

add(
    "Le chemin du conservatoire",
    "loisirs",
    [
        ("boulangerie", "ville", "boulangerie"),
        ("chaussures", "vetements", "chaussures"),
        ("parc", "ville", "parc"),
        ("vert", "couleurs", "vert"),
        ("voiture", "transports", "voiture"),
    ],
    [
        f"Quand tu sors du foyer, il faut prendre à gauche au bout de la rue. Continue tout droit jusqu’à la {blank(1)}.",
        f"Après, tu passes devant le magasin de {blank(2)}, puis tu traverses le petit {blank(3)}.",
        f"Le conservatoire sera sur ta droite. C’est un grand bâtiment {blank(4)}.",
        f"Je peux t’y emmener en {blank(5)} quand j’ai le temps.",
        "Tu peux aussi prendre le bus numéro 13.",
        "Bon trajet !",
    ],
    keep_id="tcf-a1-tpb-pe-2",
)

# —— 3–100 : nouveaux thèmes ——
MORE = [
    (
        "Au marché",
        "magasins",
        [("pomme", "fruits", "pomme"), ("carotte", "legumes", "carotte"), ("pain", "aliments", "baguette"), ("fromage", "aliments", "fromage"), ("lait", "boissons", "lait")],
        [
            "Bonjour Lea,",
            f"Ce matin, je vais au marché. J’achète une {blank(1)} et une {blank(2)}.",
            f"Ensuite, je prends du {blank(3)} encore chaud.",
            f"Pour le déjeuner, j’achète aussi du {blank(4)}.",
            f"Enfin, je n’oublie pas une bouteille de {blank(5)}.",
            "À tout à l’heure !",
        ],
    ),
    (
        "La matinée à l’école",
        "ecole",
        [("cartable", "ecole-bureau", "cartable"), ("crayon", "ecole-bureau", "crayon"), ("cahier", "ecole-bureau", "cahier"), ("livre", "ecole-bureau", "dictionnaire"), ("cantine", "ecole-bureau", "cantine")],
        [
            "Salut Karim,",
            f"Aujourd’hui, j’arrive à l’école avec mon {blank(1)}.",
            f"En classe, j’écris avec un {blank(2)} dans mon {blank(3)}.",
            f"Nous lisons un {blank(4)} de français.",
            f"À midi, nous mangeons à la {blank(5)}.",
            "Bonne journée !",
        ],
    ),
    (
        "Chez le médecin",
        "sante",
        [("fievre", "sante", "fievre"), ("medicament", "sante", "medicament"), ("mal-de-tête", "sante", "mal-de-tête"), ("eau", "boissons", "eau"), ("lit", "maison", "berceau")],
        [
            "Chère amie,",
            f"Je ne vais pas bien. J’ai de la {blank(1)}.",
            f"Le médecin me donne un {blank(2)}.",
            f"J’ai aussi mal à la tête : c’est un {blank(3)}.",
            f"Je bois beaucoup d’{blank(4)} et je reste au {blank(5)}.",
            "Je te rappelle demain.",
        ],
    ),
    (
        "Le week-end en famille",
        "vie-quotidienne",
        [("papa", "famille-personnes", "papa"), ("maman", "famille-personnes", "maman"), ("parc", "ville", "parc"), ("ballon", "sports", "ballon"), ("glace", "desserts", "glace")],
        [
            "Bonjour,",
            f"Ce week-end, je sors avec mon {blank(1)} et ma {blank(2)}.",
            f"Nous allons au {blank(3)} près de la maison.",
            f"Je joue au {blank(4)} avec mon frère.",
            f"Après, nous mangeons une {blank(5)}.",
            "À bientôt !",
        ],
    ),
    (
        "Voyage en train",
        "transports",
        [("gare", "ville", "gare"), ("train", "transports", "train"), ("billet", "voyage", "aller-retour"), ("valise", "voyage", "bagage"), ("quai", "voyage", "quai")],
        [
            "Salut Nora,",
            f"Demain, je vais à la {blank(1)}.",
            f"Je prends le {blank(2)} pour Lyon.",
            f"J’ai déjà mon {blank(3)}.",
            f"Je prépare ma {blank(4)} ce soir.",
            f"Le départ est sur le {blank(5)} numéro 3.",
            "Bon voyage à toi aussi !",
        ],
    ),
    (
        "Invitation à dîner",
        "fetes",
        [("invitation", "loisirs", "decoration-de-fete"), ("salade", "legumes", "laitue"), ("poulet", "aliments", "poulet"), ("gâteau", "desserts", "gâteau"), ("jus", "boissons", "jus")],
        [
            "Cher ami,",
            f"Voici mon {blank(1)} pour samedi soir.",
            f"Nous mangeons une {blank(2)} pour commencer.",
            f"Ensuite, il y a du {blank(3)}.",
            f"Pour le dessert, j’ai préparé un {blank(4)}.",
            f"Tu peux apporter un {blank(5)} d’orange.",
            "À samedi !",
        ],
    ),
    (
        "À la plage",
        "vacances",
        [("mer", "nature", "mer"), ("sable", "nature", "dune"), ("maillot", "vetements", "debardeur"), ("serviette", "hygiene", "serviette"), ("crème", "aliments", "creme")],
        [
            "Bonjour Paul,",
            f"Nous sommes à la {blank(1)}.",
            f"Les enfants jouent dans le {blank(2)}.",
            f"Je porte mon {blank(3)} de bain.",
            f"J’ai aussi une grande {blank(4)}.",
            f"N’oublie pas la {blank(5)} solaire !",
            "Bisous.",
        ],
    ),
    (
        "Courses au supermarché",
        "magasins",
        [("caddie", "objets", "caddie"), ("riz", "aliments", "riz"), ("œuf", "aliments", "oeuf"), ("yaourt", "aliments", "yaourt"), ("caisse", "ville", "caisse")],
        [
            "Liste pour demain :",
            f"Je prends un {blank(1)} à l’entrée.",
            f"J’achète du {blank(2)} et des {blank(3)}.",
            f"Je mets aussi un {blank(4)} nature.",
            f"Je paie à la {blank(5)}.",
            "Merci !",
        ],
    ),
    (
        "Le sport du mardi",
        "loisirs",
        [("football", "sports", "football"), ("chaussures", "vetements", "baskets"), ("eau", "boissons", "bouteille-deau"), ("coach", "metiers", "enseignant"), ("vestiaire", "maison", "armoire")],
        [
            "Salut,",
            f"Mardi, je joue au {blank(1)}.",
            f"Je mets mes {blank(2)} de sport.",
            f"J’apporte une {blank(3)}.",
            f"Notre {blank(4)} commence l’entraînement à 18 heures.",
            f"On se change dans le {blank(5)}.",
            "À mardi !",
        ],
    ),
    (
        "Dans mon appartement",
        "maison",
        [("cuisine", "maison", "cuisine"), ("table", "maison", "table"), ("chaise", "maison", "chaise"), ("fenêtre", "maison", "fenêtre"), ("lampe", "maison", "chandelier")],
        [
            "Voici ma maison :",
            f"J’aime cuisiner dans la {blank(1)}.",
            f"Nous mangeons à la {blank(2)}.",
            f"Il y a quatre {blank(3)} autour.",
            f"La {blank(4)} donne sur la rue.",
            f"Le soir, j’allume la {blank(5)}.",
            "Bienvenue chez moi !",
        ],
    ),
]

# Fix words that may not exist - I'll verify after building more entries.
# Continue adding many more themes in batches via MORE list.

MORE += [
    (
        "Le jour de pluie",
        "vie-quotidienne",
        [("pluie", "meteo", "pluie"), ("parapluie", "meteo", "parapluie-ouvert"), ("bottes", "vetements", "bottes-de-pluie"), ("manteau", "vetements", "blouson"), ("thé", "boissons", "thé")],
        [
            "Bonjour,",
            f"Aujourd’hui, il y a de la {blank(1)}.",
            f"Je prends mon {blank(2)}.",
            f"Je mets mes {blank(3)}.",
            f"J’enfile aussi mon {blank(4)}.",
            f"À la maison, je bois un {blank(5)} chaud.",
            "Reste au sec !",
        ],
    ),
    (
        "Visite au zoo",
        "loisirs",
        [("lion", "animaux-sauvages", "lion"), ("éléphant", "animaux-sauvages", "éléphant"), ("singe", "animaux-sauvages", "singe"), ("oiseau", "oiseaux", "oiseau"), ("photo", "loisirs", "photo")],
        [
            "Salut Maya,",
            f"Au zoo, nous voyons un {blank(1)}.",
            f"Il y a aussi un grand {blank(2)}.",
            f"Les enfants regardent un {blank(3)}.",
            f"J’écoute un {blank(4)} coloré.",
            f"Je prends une {blank(5)} devant la cage.",
            "C’était super !",
        ],
    ),
    (
        "Le petit-déjeuner",
        "vie-quotidienne",
        [("bol", "cuisine", "bol"), ("céréales", "aliments", "céréales"), ("banane", "fruits", "banane"), ("café", "boissons", "café"), ("beurre", "aliments", "beurre")],
        [
            "Chaque matin :",
            f"Je prépare mon {blank(1)}.",
            f"J’y mets des {blank(2)}.",
            f"Je mange aussi une {blank(3)}.",
            f"Papa boit un {blank(4)}.",
            f"Sur mon pain, je mets du {blank(5)}.",
            "Bon appétit !",
        ],
    ),
    (
        "À la bibliothèque",
        "lieux-publics",
        [("bibliotheque", "ville", "bibliotheque"), ("livre", "ecole-bureau", "atlas"), ("carte", "voyage", "carte"), ("silence", "ecole-bureau", "ardoise"), ("sac", "accessoires", "sac")],
        [
            f"Cet après-midi, je vais à la {blank(1)}.",
            f"Je cherche un {blank(2)} sur la France.",
            f"Je regarde aussi une {blank(3)} du monde.",
            f"Ici, on fait {blank(4)} : on parle tout bas.",
            f"Je range tout dans mon {blank(5)}.",
            "À demain.",
        ],
    ),
    (
        "Le premier jour de travail",
        "travail",
        [("bureau", "ecole-bureau", "bureau"), ("ordinateur", "technologie", "ordinateur"), ("collègues", "famille-personnes", "collègues"), ("réunion", "ecole-bureau", "agenda"), ("badge", "objets", "badge")],
        [
            "Bonjour,",
            f"Aujourd’hui, je m’installe à mon {blank(1)}.",
            f"J’ouvre mon {blank(2)}.",
            f"Je salue mes nouveaux {blank(3)}.",
            f"À 10 heures, il y a une {blank(4)}.",
            f"On me donne un {blank(5)} pour entrer.",
            "Bonne journée !",
        ],
    ),
    (
        "Anniversaire surprise",
        "fetes",
        [("cadeau", "objets", "cadeau"), ("ballon", "loisirs", "bille"), ("gâteau", "desserts", "gâteau"), ("bougie", "objets", "bougie"), ("musique", "musique", "musique")],
        [
            "Chère Sara,",
            f"Pour ton anniversaire, j’apporte un {blank(1)}.",
            f"La salle est décorée avec un {blank(2)}.",
            f"Il y a un grand {blank(3)} au chocolat.",
            f"Nous allumons une {blank(4)}.",
            f"Ensuite, on danse sur de la {blank(5)}.",
            "Joyeux anniversaire !",
        ],
    ),
    (
        "Le camping",
        "vacances",
        [("tente", "loisirs", "camping"), ("feu", "nature", "feu"), ("lampe", "objets", "bougie"), ("sac-de-couchage", "voyage", "bagage"), ("rivière", "nature", "fleuve")],
        [
            "Salut,",
            f"Nous dormons dans une {blank(1)}.",
            f"Le soir, nous faisons un {blank(2)}.",
            f"J’allume une {blank(3)} dans le noir.",
            f"Mon {blank(4)} est très chaud.",
            f"Le matin, nous marchons près de la {blank(5)}.",
            "À plus !",
        ],
    ),
    (
        "Chez le coiffeur",
        "vie-quotidienne",
        [("cheveux", "corps", "cheveux"), ("ciseaux", "ecole-bureau", "ciseaux"), ("miroir", "sante", "miroir-dentaire"), ("peigne", "hygiene", "peigne"), ("chaise", "maison", "fauteuil")],
        [
            "Bonjour,",
            f"Aujourd’hui, je coupe mes {blank(1)}.",
            f"Le coiffeur utilise des {blank(2)}.",
            f"Je me regarde dans le {blank(3)}.",
            f"Il passe un {blank(4)}.",
            f"Je suis assis sur une {blank(5)} confortable.",
            "Merci !",
        ],
    ),
    (
        "Le bus du matin",
        "transports",
        [("arrêt-de-bus", "ville", "arrêt-de-bus"), ("bus", "transports", "bus"), ("ticket", "transports", "carte-journaliere"), ("siège", "maison", "chaise"), ("école", "ville", "ecole")],
        [
            f"Je vais à l’{blank(5)} en transports.",
            f"J’attends à l’{blank(1)}.",
            f"Le {blank(2)} arrive à 7 h 40.",
            f"Je valide mon {blank(3)}.",
            f"Je m’assieds sur un {blank(4)} libre.",
            "Bonne route !",
        ],
    ),
    (
        "Recette de salade",
        "vie-quotidienne",
        [("tomate", "legumes", "tomate"), ("concombre", "legumes", "concombre"), ("huile", "aliments", "huile"), ("couteau", "cuisine", "couteau"), ("assiette", "cuisine", "assiette")],
        [
            "Recette simple :",
            f"Coupez une {blank(1)}.",
            f"Ajoutez un {blank(2)}.",
            f"Mettez un peu d’{blank(3)}.",
            f"Utilisez un {blank(4)} pour tout couper.",
            f"Servez dans une {blank(5)}.",
            "C’est prêt !",
        ],
    ),
]

MORE += [
    (
        "Le cours de musique",
        "ecole",
        [("piano", "musique", "piano"), ("guitare", "musique", "guitare"), ("professeur", "metiers", "professeur"), ("partition", "ecole-bureau", "feuille-de-papier"), ("salle", "maison", "chambre")],
        [
            f"Aujourd’hui, nous jouons du {blank(1)}.",
            f"Mon ami préfère la {blank(2)}.",
            f"Notre {blank(3)} explique la leçon.",
            f"Nous lisons une {blank(4)}.",
            f"Le cours a lieu dans une grande {blank(5)}.",
            "Bravo à tous !",
        ],
    ),
    (
        "À la pharmacie",
        "sante",
        [("pharmacie", "ville", "pharmacie"), ("sirop", "boissons", "sirop"), ("comprime", "sante", "comprime"), ("ordonnance", "ecole-bureau", "feuille-de-papier"), ("pharmacien", "metiers", "pharmacienne")],
        [
            f"Je vais à la {blank(1)}.",
            f"J’achète un {blank(2)} pour la toux.",
            f"Le médecin prescrit aussi un {blank(3)}.",
            f"Je donne mon {blank(4)}.",
            f"Le {blank(5)} m’explique comment prendre les médicaments.",
            "Merci beaucoup.",
        ],
    ),
    (
        "Jardinage",
        "maison",
        [("fleur", "plantes", "tulipe"), ("arrosoir", "objets", "seau"), ("terre", "nature", "champ"), ("gants", "vetements", "gants"), ("soleil", "meteo", "soleil")],
        [
            "Ce samedi :",
            f"Je plante une {blank(1)}.",
            f"J’utilise un {blank(2)}.",
            f"Je mets de la {blank(3)} dans le pot.",
            f"Je porte des {blank(4)}.",
            f"Il fait beau : il y a du {blank(5)}.",
            "Le jardin est beau !",
        ],
    ),
    (
        "Soirée cinéma",
        "loisirs",
        [("cinema", "ville", "cinema"), ("billet", "loisirs", "billets-de-spectacle"), ("popcorn", "aliments", "chips"), ("ami", "famille-personnes", "ami"), ("film", "ville", "cinema")],
        [
            f"Ce soir, nous allons au {blank(1)}.",
            f"J’achète un {blank(2)}.",
            f"Nous mangeons du {blank(3)}.",
            f"Je viens avec mon {blank(4)}.",
            f"Le {blank(5)} commence à 20 heures.",
            "À ce soir !",
        ],
    ),
    (
        "Déménagement",
        "maison",
        [("carton", "objets", "boîte"), ("camion", "transports", "camion"), ("canapé", "maison", "canape"), ("clé", "objets", "cle"), ("voisin", "famille-personnes", "ami")],
        [
            f"Nous mettons les affaires dans un {blank(1)}.",
            f"Un {blank(2)} vient chercher les meubles.",
            f"Attention au {blank(3)} : il est lourd !",
            f"Le propriétaire me donne la {blank(4)}.",
            f"Mon nouveau {blank(5)} est très gentil.",
            "Bienvenue dans le nouveau logement !",
        ],
    ),
    (
        "Le match de basket",
        "loisirs",
        [("basket", "sports", "basket"), ("maillot", "vetements", "t-shirt"), ("panier", "sports", "but"), ("arbitre", "metiers", "juge"), ("spectateurs", "famille-personnes", "famille")],
        [
            f"Samedi, il y a un match de {blank(1)}.",
            f"Je porte mon {blank(2)} de l’équipe.",
            f"Je marque un point dans le {blank(3)}.",
            f"L’{blank(4)} siffle la fin du match.",
            f"Les {blank(5)} applaudissent.",
            "Quelle belle victoire !",
        ],
    ),
    (
        "Visite à la ferme",
        "vacances",
        [("vache", "animaux-ferme-compagnie", "vache"), ("poule", "animaux-ferme-compagnie", "poule"), ("cheval", "animaux-ferme-compagnie", "cheval"), ("lait", "boissons", "lait"), ("ferme", "animaux-ferme-compagnie", "ferme")],
        [
            f"Nous visitons une {blank(5)}.",
            f"Je vois une {blank(1)} dans le pré.",
            f"Il y a aussi une {blank(2)}.",
            f"Les enfants montent sur un {blank(3)}.",
            f"Le fermier nous offre du {blank(4)} frais.",
            "C’était une belle journée.",
        ],
    ),
    (
        "La lessive",
        "vie-quotidienne",
        [("machine-a-laver", "electromenager", "machine-a-laver"), ("chemise", "vetements", "chemise"), ("pantalon", "vetements", "pantalon"), ("savon", "hygiene", "savon"), ("panier", "objets", "caddie")],
        [
            f"Je mets le linge dans la {blank(1)}.",
            f"Il y a une {blank(2)} blanche.",
            f"Je lave aussi un {blank(3)}.",
            f"J’ajoute du {blank(4)}.",
            f"Ensuite, je range tout dans le {blank(5)}.",
            "Le linge est propre !",
        ],
    ),
    (
        "Rendez-vous à la poste",
        "lieux-publics",
        [("poste", "ville", "poste"), ("lettre", "ecole-bureau", "feuille-de-papier"), ("timbre", "objets", "etiquette-prix"), ("colis", "objets", "colis"), ("guichet", "ville", "comptoire")],
        [
            f"Je vais à la {blank(1)}.",
            f"J’envoie une {blank(2)} à ma grand-mère.",
            f"J’achète un {blank(3)}.",
            f"Je dépose aussi un {blank(4)}.",
            f"Je parle à la personne au {blank(5)}.",
            "Merci, au revoir !",
        ],
    ),
    (
        "Le goûter",
        "vie-quotidienne",
        [("biscuit", "desserts", "biscuit"), ("chocolat", "desserts", "chocolat"), ("pomme", "fruits", "pomme"), ("verre", "cuisine", "mug"), ("table", "maison", "table")],
        [
            "À 16 heures :",
            f"Je mange un {blank(1)}.",
            f"Parfois, je prends un peu de {blank(2)}.",
            f"Ou bien une {blank(3)}.",
            f"Je bois dans un {blank(4)}.",
            f"Nous sommes assis à la {blank(5)}.",
            "Bon goûter !",
        ],
    ),
]

MORE += [
    (
        "En avion",
        "voyage",
        [("avion", "transports", "avion"), ("aéroport", "voyage", "aeroport"), ("passeport", "voyage", "passeport"), ("siège", "maison", "fauteuil"), ("hôtesse", "metiers", "agente-d-entretien")],
        [
            f"Nous partons de l’{blank(2)}.",
            f"Je monte dans l’{blank(1)}.",
            f"Je montre mon {blank(3)}.",
            f"Je m’installe dans mon {blank(4)}.",
            f"L’{blank(5)} nous souhaite un bon voyage.",
            "Décollage !",
        ],
    ),
    (
        "Cours de dessin",
        "ecole",
        [("crayon", "ecole-bureau", "crayon"), ("papier", "ecole-bureau", "feuille-de-papier"), ("couleur", "couleurs", "rouge"), ("gomme", "ecole-bureau", "gomme"), ("dessin", "loisirs", "dessin")],
        [
            f"Je prends un {blank(1)}.",
            f"Je dessine sur une feuille de {blank(2)}.",
            f"J’utilise une {blank(3)} vive.",
            f"S’il y a une erreur, j’utilise une {blank(4)}.",
            f"À la fin, mon {blank(5)} est réussi.",
            "Quel talent !",
        ],
    ),
    (
        "Le pique-nique",
        "loisirs",
        [("panier", "objets", "caddie"), ("sandwich", "aliments", "sandwich"), ("couverture", "maison", "couverture"), ("parc", "ville", "parc"), ("raisin", "fruits", "raisin")],
        [
            f"Nous préparons un {blank(1)} de pique-nique.",
            f"Chacun a un {blank(2)}.",
            f"Nous mettons une {blank(3)} sur l’herbe.",
            f"Nous sommes dans un {blank(4)}.",
            f"Pour le dessert, il y a du {blank(5)}.",
            "Quelle belle journée !",
        ],
    ),
    (
        "Réparer le vélo",
        "transports",
        [("vélo", "transports", "velo"), ("roue", "transports", "velo"), ("clé", "outils", "cle"), ("casque", "vetements", "casquette"), ("garage", "maison", "cave")],
        [
            f"Mon {blank(1)} est cassé.",
            f"La {blank(2)} est plate.",
            f"J’utilise une {blank(3)}.",
            f"Je remets mon {blank(4)} avant de partir.",
            f"Je travaille dans le {blank(5)}.",
            "C’est réparé !",
        ],
    ),
    (
        "Soirée pizza",
        "fetes",
        [("pizza", "aliments", "pizza"), ("fromage", "aliments", "fromage"), ("four", "electromenager", "four"), ("assiette", "cuisine", "assiette"), ("ami", "famille-personnes", "ami")],
        [
            f"Ce soir, nous mangeons une {blank(1)}.",
            f"Il y a beaucoup de {blank(2)} dessus.",
            f"Elle cuit dans le {blank(3)}.",
            f"Je sers dans une {blank(4)}.",
            f"Je partage avec mon {blank(5)}.",
            "Miam !",
        ],
    ),
    (
        "Le chat de la maison",
        "maison",
        [("chat", "animaux-ferme-compagnie", "chat"), ("lait", "boissons", "lait"), ("coussin", "maison", "coussin"), ("jouet", "loisirs", "balle"), ("fenêtre", "maison", "fenêtre")],
        [
            f"Mon {blank(1)} s’appelle Minou.",
            f"Il boit du {blank(2)}.",
            f"Il dort sur un {blank(3)}.",
            f"Il aime son {blank(4)}.",
            f"Le matin, il regarde par la {blank(5)}.",
            "Quel adorable animal !",
        ],
    ),
    (
        "À la boulangerie",
        "magasins",
        [("croissant", "aliments", "croissant"), ("baguette", "aliments", "baguette"), ("brioche", "aliments", "brioche"), ("euro", "argent-administration", "pièce"), ("vendeuse", "metiers", "vendeuse")],
        [
            f"Bonjour, je voudrais un {blank(1)}.",
            f"Et aussi une {blank(2)}, s’il vous plaît.",
            f"Pour mon frère, une {blank(3)}.",
            f"Je paie avec un {blank(4)}.",
            f"La {blank(5)} est très souriante.",
            "Au revoir et merci !",
        ],
    ),
    (
        "Leçon de natation",
        "loisirs",
        [("piscine", "ville", "piscine"), ("maillot", "vetements", "debardeur"), ("lunettes", "accessoires", "lunettes"), ("moniteur", "metiers", "enseignant"), ("douche", "maison", "salle-de-bain")],
        [
            f"Le cours a lieu à la {blank(1)}.",
            f"Je porte mon {blank(2)}.",
            f"Je mets mes {blank(3)}.",
            f"Le {blank(4)} explique les mouvements.",
            f"Après, je prends une {blank(5)}.",
            "Je progresse bien !",
        ],
    ),
    (
        "Tempête d’hiver",
        "vie-quotidienne",
        [("neige", "meteo", "neige"), ("froid", "meteo", "froid"), ("bonnet", "vetements", "bonnet"), ("gants", "vetements", "gants"), ("chocolat-chaud", "boissons", "chocolat-chaud")],
        [
            f"Il tombe de la {blank(1)}.",
            f"Il fait très {blank(2)}.",
            f"Je mets mon {blank(3)}.",
            f"Je porte aussi des {blank(4)}.",
            f"À la maison, je bois un {blank(5)}.",
            "Restez au chaud !",
        ],
    ),
    (
        "Visite du musée",
        "loisirs",
        [("musée", "ville", "musee"), ("tableau", "loisirs", "peinture"), ("guide", "metiers", "enseignant"), ("billet", "loisirs", "billets-de-spectacle"), ("photo", "loisirs", "photo")],
        [
            f"Nous visitons un {blank(1)}.",
            f"Je regarde un beau {blank(2)}.",
            f"Un {blank(3)} explique l’histoire.",
            f"J’achète un {blank(4)} à l’entrée.",
            f"Les photos sont interdites : pas de {blank(5)} !",
            "C’était intéressant.",
        ],
    ),
]

MORE += [
    (
        "Le supermarché bio",
        "magasins",
        [("légume", "legumes", "légume"), ("fruit", "fruits", "fruit"), ("oeuf", "aliments", "oeuf"), ("miel", "aliments", "confiture"), ("panier", "objets", "caddie")],
        [
            f"J’achète un {blank(1)} frais.",
            f"Je choisis aussi un {blank(2)}.",
            f"Il y a une boîte d’{blank(3)}.",
            f"J’ajoute un pot de {blank(4)}.",
            f"Tout va dans mon {blank(5)}.",
            "Courses terminées !",
        ],
    ),
    (
        "Réveil du matin",
        "vie-quotidienne",
        [("réveil", "objets", "réveil"), ("lit", "maison", "lit"), ("pyjama", "vetements", "pyjama"), ("salle-de-bain", "maison", "salle-de-bain"), ("brosse-à-dents", "hygiene", "brosse-a-dents")],
        [
            f"Mon {blank(1)} sonne à 7 heures.",
            f"Je sors du {blank(2)}.",
            f"Je quitte mon {blank(3)}.",
            f"Je vais dans la {blank(4)}.",
            f"Je prends ma {blank(5)}.",
            "La journée commence !",
        ],
    ),
    (
        "Le restaurant",
        "loisirs",
        [("menu", "ecole-bureau", "feuille-de-papier"), ("soupe", "aliments", "soupe"), ("steak", "aliments", "poulet"), ("fourchette", "cuisine", "fourchette"), ("addition", "argent-administration", "addition")],
        [
            f"Le serveur apporte le {blank(1)}.",
            f"Je commence par une {blank(2)}.",
            f"Ensuite, je mange un {blank(3)}.",
            f"Je mange avec une {blank(4)}.",
            f"À la fin, nous payons l’{blank(5)}.",
            "Bon appétit !",
        ],
    ),
    (
        "Le jardin public",
        "lieux-publics",
        [("banc", "ville", "banc"), ("arbre", "plantes", "arbre"), ("fontaine", "ville", "fontaine"), ("oiseau", "oiseaux", "oiseau"), ("livre", "ecole-bureau", "livre")],
        [
            f"Je m’assieds sur un {blank(1)}.",
            f"Il y a un grand {blank(2)}.",
            f"Près de la {blank(3)}, l’eau coule.",
            f"J’écoute un {blank(4)}.",
            f"Je lis mon {blank(5)}.",
            "Quel calme !",
        ],
    ),
    (
        "Préparer le cartable",
        "ecole",
        [("stylo", "ecole-bureau", "stylo"), ("règle", "ecole-bureau", "règle"), ("cahier", "ecole-bureau", "cahier"), ("trousse", "ecole-bureau", "trousse"), ("devoirs", "ecole-bureau", "devoirs")],
        [
            f"Je mets un {blank(1)} dans la trousse.",
            f"J’ai besoin d’une {blank(2)}.",
            f"Mon {blank(3)} de maths est prêt.",
            f"Tout est dans ma {blank(4)}.",
            f"Je vérifie mes {blank(5)}.",
            "Prêt pour l’école !",
        ],
    ),
    (
        "Le concert",
        "loisirs",
        [("guitare", "musique", "guitare"), ("batterie", "musique", "batterie"), ("micro", "electromenager", "micro-onde"), ("scène", "loisirs", "scene"), ("public", "famille-personnes", "famille")],
        [
            f"Le musicien joue de la {blank(1)}.",
            f"Il y a aussi une {blank(2)}.",
            f"Il chante dans un {blank(3)}.",
            f"Ils sont sur la {blank(4)}.",
            f"Le {blank(5)} applaudit fort.",
            "Super concert !",
        ],
    ),
    (
        "Journée à la montagne",
        "vacances",
        [("ski", "sports", "ski"), ("neige", "meteo", "neige"), ("lunettes", "accessoires", "lunettes"), ("gants", "vetements", "gants"), ("chalet", "maison", "chalet")],
        [
            f"Nous faisons du {blank(1)}.",
            f"Il y a beaucoup de {blank(2)}.",
            f"Je porte des {blank(3)} de soleil.",
            f"Mes {blank(4)} sont chauds.",
            f"Le soir, nous rentrons au {blank(5)}.",
            "Quelle aventure !",
        ],
    ),
    (
        "Le chien du voisin",
        "vie-quotidienne",
        [("chien", "animaux-ferme-compagnie", "chien"), ("laisse", "objets", "corde"), ("parc", "ville", "parc"), ("os", "aliments", "fromage"), ("niche", "animaux-ferme-compagnie", "niche")],
        [
            f"Le {blank(1)} du voisin s’appelle Rex.",
            f"Nous sortons avec une {blank(2)}.",
            f"Nous allons au {blank(3)}.",
            f"Je lui donne un {blank(4)}.",
            f"Le soir, il dort dans sa {blank(5)}.",
            "Quel gentil animal !",
        ],
    ),
    (
        "Atelier cuisine",
        "ecole",
        [("farine", "aliments", "farine"), ("oeuf", "aliments", "oeuf"), ("sucre", "aliments", "sucre"), ("fouet", "cuisine", "fouet"), ("moule", "cuisine", "moule-à-gâteau")],
        [
            f"Nous mettons de la {blank(1)}.",
            f"Nous cassons un {blank(2)}.",
            f"Nous ajoutons du {blank(3)}.",
            f"Nous mélangeons avec un {blank(4)}.",
            f"Nous versons dans un {blank(5)}.",
            "Le gâteau va au four !",
        ],
    ),
    (
        "La nouvelle robe",
        "magasins",
        [("robe", "vetements", "robe"), ("miroir", "sante", "miroir-dentaire"), ("cabine", "vetements", "cabine-d-essayage"), ("prix", "argent-administration", "prix"), ("carte", "argent-administration", "carte-bancaire")],
        [
            f"J’essaie une {blank(1)} bleue.",
            f"Je me regarde dans le {blank(2)}.",
            f"Je change dans la {blank(3)}.",
            f"Je regarde le {blank(4)}.",
            f"Je paie avec ma {blank(5)}.",
            "Elle me plaît beaucoup !",
        ],
    ),
]

MORE += [
    (
        "Le feu rouge",
        "transports",
        [("feu-rouge", "ville", "feu-rouge"), ("piéton", "famille-personnes", "homme"), ("trottoir", "ville", "trottoir"), ("voiture", "transports", "voiture"), ("passage", "ville", "passage-pieton")],
        [
            f"Le {blank(1)} est rouge.",
            f"Le {blank(2)} attend.",
            f"Il reste sur le {blank(3)}.",
            f"Une {blank(4)} passe.",
            f"Ensuite, il traverse au {blank(5)}.",
            "Attention à la route !",
        ],
    ),
    (
        "La fête de l’école",
        "ecole",
        [("spectacle", "loisirs", "spectacle"), ("danse", "loisirs", "danse"), ("costume", "vetements", "costume"), ("microphone", "electromenager", "micro-onde"), ("applaudissements", "loisirs", "festival")],
        [
            f"Il y a un {blank(1)} ce soir.",
            f"Les élèves font une {blank(2)}.",
            f"Je porte un {blank(3)}.",
            f"Je chante dans le {blank(4)}.",
            f"La salle répond par des {blank(5)}.",
            "Quelle belle fête !",
        ],
    ),
    (
        "Le potager",
        "maison",
        [("tomate", "legumes", "tomate"), ("salade", "legumes", "laitue"), ("arrosoir", "objets", "seau"), ("panier", "objets", "caddie"), ("soleil", "meteo", "soleil")],
        [
            f"Je cueille une {blank(1)}.",
            f"Je coupe de la {blank(2)}.",
            f"J’arrose avec un {blank(3)}.",
            f"Je remplis mon {blank(4)}.",
            f"Les plantes aiment le {blank(5)}.",
            "Récolte du jour !",
        ],
    ),
    (
        "Urgence dentaire",
        "sante",
        [("dent", "corps", "dent"), ("dentiste", "metiers", "dentiste"), ("fauteuil", "maison", "fauteuil"), ("douleur", "sante", "douleur"), ("rendez-vous", "temps-calendrier", "calendrier")],
        [
            f"J’ai mal à une {blank(1)}.",
            f"Je vais chez le {blank(2)}.",
            f"Je m’assieds dans le {blank(3)}.",
            f"Il soigne ma {blank(4)}.",
            f"J’ai un {blank(5)} demain matin.",
            "Ça va mieux !",
        ],
    ),
    (
        "Le bateau",
        "vacances",
        [("bateau", "transports", "bateau"), ("mer", "nature", "mer"), ("gilet", "vetements", "gilet"), ("capitaine", "metiers", "controleur"), ("île", "nature", "île")],
        [
            f"Nous montons sur un {blank(1)}.",
            f"Nous naviguons sur la {blank(2)}.",
            f"Je porte un {blank(3)} de sauvetage.",
            f"Le {blank(4)} dirige le bateau.",
            f"Nous arrivons sur une petite {blank(5)}.",
            "Quelle belle sortie !",
        ],
    ),
    (
        "Le bricolage",
        "maison",
        [("marteau", "outils", "marteau"), ("clou", "outils", "clou"), ("échelle", "outils", "echelle"), ("peinture", "loisirs", "peinture"), ("mur", "maison", "mur")],
        [
            f"J’utilise un {blank(1)}.",
            f"Je plante un {blank(2)}.",
            f"Je monte sur une {blank(3)}.",
            f"Je mets de la {blank(4)} blanche.",
            f"Je peins le {blank(5)} de la chambre.",
            "Travail terminé !",
        ],
    ),
    (
        "Le goûter d’anniversaire",
        "fetes",
        [("bonbon", "desserts", "bonbon"), ("jus", "boissons", "jus"), ("chapeau", "vetements", "chapeau"), ("jeu", "loisirs", "jeu"), ("ami", "famille-personnes", "ami")],
        [
            f"Il y a des {blank(1)} sur la table.",
            f"Nous buvons un {blank(2)}.",
            f"Chacun porte un {blank(3)} de fête.",
            f"Nous jouons à un {blank(4)}.",
            f"J’invite mon meilleur {blank(5)}.",
            "Bonne fête !",
        ],
    ),
    (
        "Le métro",
        "transports",
        [("métro", "transports", "metro"), ("ticket", "transports", "ticket-de-bus"), ("plan", "voyage", "carte"), ("station", "ville", "station"), ("porte", "maison", "porte")],
        [
            f"Je prends le {blank(1)}.",
            f"Je valide mon {blank(2)}.",
            f"Je regarde le {blank(3)} du réseau.",
            f"Je descends à la {blank(4)} centrale.",
            f"Attention à la {blank(5)} qui se ferme !",
            "Bonne journée.",
        ],
    ),
    (
        "La salade de fruits",
        "vie-quotidienne",
        [("fraise", "fruits", "fraise"), ("kiwi", "fruits", "kiwi"), ("orange", "fruits", "orange"), ("bol", "cuisine", "bol"), ("cuillère", "cuisine", "cuillere")],
        [
            f"Je coupe une {blank(1)}.",
            f"J’ajoute un {blank(2)}.",
            f"Je mets aussi une {blank(3)}.",
            f"Je mélange dans un {blank(4)}.",
            f"Je mange avec une {blank(5)}.",
            "C’est délicieux !",
        ],
    ),
    (
        "Le nouveau téléphone",
        "vie-quotidienne",
        [("téléphone", "technologie", "téléphone"), ("chargeur", "technologie", "chargeur"), ("photo", "loisirs", "photo"), ("message", "technologie", "sms"), ("écouteurs", "sports", "casque-audio")],
        [
            f"J’ai un nouveau {blank(1)}.",
            f"Je branche le {blank(2)}.",
            f"Je prends une {blank(3)}.",
            f"J’envoie un {blank(4)} à mon frère.",
            f"J’écoute de la musique avec mes {blank(5)}.",
            "Technologie pratique !",
        ],
    ),
]

MORE += [
    (
        "Le cours de géographie",
        "ecole",
        [("carte", "voyage", "carte"), ("monde", "nature", "paysage"), ("crayon", "ecole-bureau", "crayon"), ("cahier", "ecole-bureau", "cahier"), ("professeur", "metiers", "professeur")],
        [
            f"Nous regardons une {blank(1)}.",
            f"Elle montre le {blank(2)} entier.",
            f"Je colorie avec un {blank(3)}.",
            f"Je prends des notes dans mon {blank(4)}.",
            f"Le {blank(5)} pose des questions.",
            "C’est passionnant !",
        ],
    ),
    (
        "La boulangerie du village",
        "magasins",
        [("village", "ville", "centre-ville"), ("pain", "aliments", "baguette"), ("tarte", "desserts", "tarte"), ("file", "famille-personnes", "famille"), ("sourire", "famille-personnes", "contente")],
        [
            f"Dans mon {blank(1)}, il y a une boulangerie.",
            f"J’achète du {blank(2)} tous les matins.",
            f"Le dimanche, je prends une {blank(3)}.",
            f"Il y a souvent une {blank(4)} devant la porte.",
            f"La vendeuse a toujours un {blank(5)}.",
            "Quel bon pain !",
        ],
    ),
    (
        "Le spa et la détente",
        "sante",
        [("bain", "maison", "salle-de-bain"), ("serviette", "hygiene", "serviette"), ("crème", "aliments", "creme"), ("thé", "boissons", "thé"), ("silence", "nature", "horizon")],
        [
            f"Je prends un {blank(1)} chaud.",
            f"Je me sèche avec une {blank(2)}.",
            f"Je mets de la {blank(3)} sur les mains.",
            f"Je bois un {blank(4)}.",
            f"J’apprécie le {blank(5)}.",
            "Je me sens bien.",
        ],
    ),
    (
        "Le match de tennis",
        "loisirs",
        [("raquette", "sports", "raquette"), ("balle", "sports", "balle"), ("court", "ville", "stade"), ("short", "vetements", "short"), ("eau", "boissons", "eau")],
        [
            f"Je tiens ma {blank(1)}.",
            f"Je frappe la {blank(2)}.",
            f"Nous jouons sur le {blank(3)}.",
            f"Je porte un {blank(4)}.",
            f"Entre les sets, je bois de l’{blank(5)}.",
            "Quel match !",
        ],
    ),
    (
        "La chambre d’hôtel",
        "voyage",
        [("hôtel", "ville", "hôtel"), ("lit", "maison", "lit"), ("télévision", "technologie", "télévision"), ("douche", "maison", "salle-de-bain"), ("clé", "objets", "cle")],
        [
            f"Nous dormons dans un {blank(1)}.",
            f"Il y a un grand {blank(2)}.",
            f"Je regarde la {blank(3)}.",
            f"La {blank(4)} est propre.",
            f"La réception me donne la {blank(5)}.",
            "Bon séjour !",
        ],
    ),
    (
        "Le marché aux fleurs",
        "magasins",
        [("rose", "couleurs", "rose"), ("tulipe", "plantes", "tulipe"), ("vase", "objets", "vase"), ("eau", "boissons", "eau"), ("parfum", "hygiene", "parfum")],
        [
            f"J’achète une {blank(1)} rouge.",
            f"Et aussi une {blank(2)} jaune.",
            f"Je les mets dans un {blank(3)}.",
            f"Je verse de l’{blank(4)}.",
            f"La pièce sent bon : quel {blank(5)} !",
            "Cadeau pour maman.",
        ],
    ),
    (
        "Le nettoyage de printemps",
        "maison",
        [("balai", "objets", "balai"), ("seau", "objets", "seau"), ("éponge", "objets", "éponge"), ("fenêtre", "maison", "fenêtre"), ("poussière", "nature", "dune")],
        [
            f"Je prends le {blank(1)}.",
            f"Je remplis un {blank(2)} d’eau.",
            f"Je lave avec une {blank(3)}.",
            f"Je nettoie la {blank(4)}.",
            f"Il n’y a plus de {blank(5)}.",
            "La maison brille !",
        ],
    ),
    (
        "La sortie vélo",
        "loisirs",
        [("vélo", "transports", "velo"), ("casque", "outils", "casque-de-chantier"), ("parc", "ville", "parc"), ("pont", "ville", "pont"), ("gourde", "boissons", "bouteille-deau")],
        [
            f"Je monte sur mon {blank(1)}.",
            f"Je mets mon {blank(2)}.",
            f"Nous roulons jusqu’au {blank(3)}.",
            f"Nous traversons un {blank(4)}.",
            f"J’ai ma {blank(5)} d’eau.",
            "Bonne balade !",
        ],
    ),
    (
        "Le cours d’anglais",
        "ecole",
        [("dictionnaire", "ecole-bureau", "dictionnaire"), ("cahier", "ecole-bureau", "cahier"), ("stylo", "ecole-bureau", "stylo"), ("professeur", "metiers", "professeur"), ("exercice", "ecole-bureau", "exercice")],
        [
            f"J’ouvre mon {blank(1)}.",
            f"J’écris dans mon {blank(2)}.",
            f"J’utilise un {blank(3)} bleu.",
            f"Le {blank(4)} parle lentement.",
            f"Nous faisons un {blank(5)}.",
            "I speak English !",
        ],
    ),
    (
        "Le pique-nique sous la pluie",
        "loisirs",
        [("nuage", "meteo", "nuage"), ("parapluie", "meteo", "parapluie-ouvert"), ("sac", "accessoires", "sac"), ("sandwich", "aliments", "sandwich"), ("maison", "maison", "maison")],
        [
            f"Il y a un gros {blank(1)} gris.",
            f"Nous ouvrons un {blank(2)}.",
            f"Nous rangeons tout dans le {blank(3)}.",
            f"Nous mangeons notre {blank(4)} rapidement.",
            f"Puis nous rentrons à la {blank(5)}.",
            "Une autre fois !",
        ],
    ),
]

MORE += [
    (
        "La fête nationale",
        "fetes",
        [("drapeau", "pays", "drapeau"), ("feu-d-artifice", "loisirs", "festival"), ("musique", "musique", "musique"), ("place", "ville", "place"), ("famille", "famille-personnes", "famille")],
        [
            f"On voit le {blank(1)} français.",
            f"Le soir, il y a un {blank(2)}.",
            f"On écoute de la {blank(3)}.",
            f"Tout le monde est sur la {blank(4)}.",
            f"Je suis avec ma {blank(5)}.",
            "Vive la fête !",
        ],
    ),
    (
        "Le cours de yoga",
        "sante",
        [("tapis", "maison", "tapis"), ("respiration", "corps", "poumon"), ("silence", "nature", "horizon"), ("eau", "boissons", "eau"), ("salle", "ecole-bureau", "salle-de-classe")],
        [
            f"Je m’installe sur mon {blank(1)}.",
            f"Nous travaillons la {blank(2)}.",
            f"Il faut du {blank(3)} dans la pièce.",
            f"J’ai une bouteille d’{blank(4)}.",
            f"Le cours a lieu dans une {blank(5)} calme.",
            "Je me détends.",
        ],
    ),
    (
        "Acheter des chaussures",
        "magasins",
        [("chaussures", "vetements", "chaussures"), ("pointure", "nombres-mesures", "centimètre"), ("miroir", "sante", "miroir-dentaire"), ("boîte", "objets", "boîte"), ("vendeur", "metiers", "vendeuse")],
        [
            f"Je cherche des {blank(1)} noires.",
            f"Je donne ma {blank(2)}.",
            f"Je marche devant le {blank(3)}.",
            f"Le vendeur apporte une {blank(4)}.",
            f"Le {blank(5)} est très patient.",
            "Je les prends !",
        ],
    ),
    (
        "Le jardin zoologique aquatique",
        "loisirs",
        [("poisson", "animaux-aquatiques", "poisson"), ("requin", "animaux-aquatiques", "requin"), ("dauphin", "animaux-aquatiques", "dauphin"), ("eau", "boissons", "eau"), ("photo", "loisirs", "photo")],
        [
            f"Je vois un {blank(1)} coloré.",
            f"Il y a aussi un {blank(2)}.",
            f"Ils nagent dans un grand {blank(3)}.",
            f"L’{blank(4)} est bleue et claire.",
            f"Je prends une {blank(5)}.",
            "Magnifique !",
        ],
    ),
    (
        "Le petit frère",
        "vie-quotidienne",
        [("bébé", "famille-personnes", "bébé"), ("biberon", "objets", "biberon"), ("jouet", "loisirs", "jouet"), ("berceau", "maison", "berceau"), ("maman", "famille-personnes", "maman")],
        [
            f"Mon {blank(1)} a six mois.",
            f"Il boit son {blank(2)}.",
            f"Il aime son {blank(3)}.",
            f"Il dort dans son {blank(4)}.",
            f"Ma {blank(5)} le berce.",
            "Il est trop mignon !",
        ],
    ),
    (
        "Le cours d’informatique",
        "ecole",
        [("ordinateur", "technologie", "ordinateur"), ("clavier", "technologie", "clavier"), ("souris", "technologie", "souris"), ("écran", "technologie", "écran"), ("internet", "technologie", "ordinateur")],
        [
            f"J’allume mon {blank(1)}.",
            f"J’écris sur le {blank(2)}.",
            f"Je clique avec la {blank(3)}.",
            f"Je regarde l’{blank(4)}.",
            f"Nous cherchons sur {blank(5)}.",
            "Cours terminé.",
        ],
    ),
    (
        "La randonnée",
        "vacances",
        [("sac-à-dos", "accessoires", "sac"), ("carte", "voyage", "carte"), ("bouteille", "boissons", "bouteille-deau"), ("forêt", "nature", "forêt"), ("colline", "nature", "colline")],
        [
            f"Je porte un {blank(1)}.",
            f"Nous suivons une {blank(2)}.",
            f"J’ai une {blank(3)} d’eau.",
            f"Nous marchons dans la {blank(4)}.",
            f"Nous montons sur une {blank(5)}.",
            "Quelle vue !",
        ],
    ),
    (
        "Le marché de Noël",
        "fetes",
        [("sapin", "plantes", "sapin"), ("guirlande", "loisirs", "decoration-de-fete"), ("chocolat", "desserts", "chocolat"), ("cadeau", "objets", "cadeau"), ("lumière", "objets", "ampoule")],
        [
            f"Il y a un grand {blank(1)}.",
            f"Une {blank(2)} décore la place.",
            f"Je mange du {blank(3)} chaud.",
            f"J’achète un {blank(4)}.",
            f"Partout, il y a de la {blank(5)}.",
            "Joyeux Noël !",
        ],
    ),
    (
        "La lessive du week-end",
        "vie-quotidienne",
        [("chaussettes", "vetements", "chaussettes"), ("t-shirt", "vetements", "t-shirt"), ("sèche-linge", "electromenager", "sèche-linge"), ("panier", "objets", "caddie"), ("armoire", "maison", "armoire")],
        [
            f"Je lave mes {blank(1)}.",
            f"Je mets aussi un {blank(2)}.",
            f"Ensuite, je mets le linge dans le {blank(3)}.",
            f"Je ramasse tout dans le {blank(4)}.",
            f"Je range dans l’{blank(5)}.",
            "C’est fait !",
        ],
    ),
    (
        "Le premier emploi",
        "travail",
        [("cv", "ecole-bureau", "feuille-de-papier"), ("entretien", "famille-personnes", "homme"), ("costume", "vetements", "costume"), ("entreprise", "ville", "immeuble"), ("contrat", "ecole-bureau", "feuille-de-papier")],
        [
            f"J’envoie mon {blank(1)}.",
            f"J’ai un {blank(2)} d’embauche.",
            f"Je porte un {blank(3)}.",
            f"L’{blank(4)} est au centre-ville.",
            f"Je signe mon {blank(5)}.",
            "Nouveau départ !",
        ],
    ),
]

MORE += [
    (
        "Le goûter à l’école",
        "ecole",
        [("pomme", "fruits", "pomme"), ("compote", "desserts", "salade-de-fruits"), ("gâteau", "desserts", "gâteau"), ("serviette", "hygiene", "serviette"), ("récréation", "loisirs", "jeu")],
        [
            f"À 10 heures, je mange une {blank(1)}.",
            f"Parfois, j’ai une {blank(2)}.",
            f"Aujourd’hui, il y a un {blank(3)} d’anniversaire.",
            f"Je nettoie avec une {blank(4)}.",
            f"Ensuite, c’est la {blank(5)}.",
            "On joue dehors !",
        ],
    ),
    (
        "La visite chez grand-mère",
        "vie-quotidienne",
        [("grand-mere", "famille-personnes", "grand-mere"), ("gâteau", "desserts", "gâteau"), ("thé", "boissons", "thé"), ("photo", "loisirs", "photo"), ("jardin", "maison", "jardin")],
        [
            f"Je rends visite à ma {blank(1)}.",
            f"Elle a préparé un {blank(2)}.",
            f"Nous buvons du {blank(3)}.",
            f"Nous regardons une vieille {blank(4)}.",
            f"Ensuite, nous marchons dans le {blank(5)}.",
            "Je l’aime beaucoup.",
        ],
    ),
    (
        "Le stade",
        "loisirs",
        [("stade", "ville", "stade"), ("ticket", "loisirs", "billets-de-spectacle"), ("écharpe", "vetements", "écharpe"), ("but", "sports", "but"), ("cri", "famille-personnes", "garçon")],
        [
            f"Nous allons au {blank(1)}.",
            f"J’ai mon {blank(2)}.",
            f"Je porte mon {blank(3)} aux couleurs de l’équipe.",
            f"Il y a un {blank(4)} magnifique !",
            f"Tout le monde pousse un grand {blank(5)}.",
            "Allez l’équipe !",
        ],
    ),
    (
        "La salle de sport",
        "sante",
        [("haltère", "sports", "haltère"), ("tapis", "sports", "tapis-de-yoga"), ("serviette", "hygiene", "serviette"), ("eau", "boissons", "eau"), ("coach", "metiers", "enseignant")],
        [
            f"Je soulève un {blank(1)}.",
            f"Je cours sur le {blank(2)}.",
            f"J’ai une {blank(3)}.",
            f"Je bois de l’{blank(4)}.",
            f"Mon {blank(5)} me corrige.",
            "Séance terminée !",
        ],
    ),
    (
        "Le ferry",
        "voyage",
        [("ferry", "transports", "ferry"), ("voiture", "transports", "voiture"), ("mer", "nature", "mer"), ("vent", "meteo", "vent"), ("île", "nature", "île")],
        [
            f"Nous prenons le {blank(1)}.",
            f"La {blank(2)} monte à bord.",
            f"Nous regardons la {blank(3)}.",
            f"Il y a du {blank(4)}.",
            f"Nous arrivons sur l’{blank(5)}.",
            "Traversée réussie !",
        ],
    ),
    (
        "Le magasin de jouets",
        "magasins",
        [("poupée", "loisirs", "poupée"), ("voiture", "transports", "voiture"), ("ballon", "sports", "ballon"), ("prix", "argent-administration", "prix"), ("enfant", "famille-personnes", "enfant")],
        [
            f"Ma sœur veut une {blank(1)}.",
            f"Mon frère préfère une {blank(2)}.",
            f"Moi, je choisis un {blank(3)}.",
            f"Nous regardons le {blank(4)}.",
            f"Chaque {blank(5)} est content.",
            "Merci papa !",
        ],
    ),
    (
        "Le lever du soleil",
        "vacances",
        [("soleil", "meteo", "soleil"), ("mer", "nature", "mer"), ("photo", "loisirs", "photo"), ("café", "boissons", "café"), ("balcon", "maison", "balcon")],
        [
            f"Le {blank(1)} se lève.",
            f"Il brille sur la {blank(2)}.",
            f"Je prends une {blank(3)}.",
            f"Je bois un {blank(4)}.",
            f"Je suis sur le {blank(5)} de l’hôtel.",
            "Moment magique.",
        ],
    ),
    (
        "La classe de sciences",
        "ecole",
        [("calculatrice", "ecole-bureau", "calculatrice"), ("fleur", "plantes", "tulipe"), ("cahier", "ecole-bureau", "cahier"), ("expérience", "ecole-bureau", "exercice"), ("blouse", "sante", "blouse-blanche")],
        [
            f"Nous regardons dans un {blank(1)}.",
            f"Nous étudions une {blank(2)}.",
            f"Je note dans mon {blank(3)}.",
            f"Nous faisons une {blank(4)}.",
            f"Je porte une {blank(5)} blanche.",
            "Science amusante !",
        ],
    ),
    (
        "Le barbecue",
        "fetes",
        [("grill", "loisirs", "barbecue"), ("saucisse", "aliments", "saucisse"), ("salade", "legumes", "laitue"), ("pain", "aliments", "baguette"), ("ami", "famille-personnes", "ami")],
        [
            f"Papa allume le {blank(1)}.",
            f"Nous cuisons une {blank(2)}.",
            f"Il y a aussi de la {blank(3)}.",
            f"Nous mangeons du {blank(4)}.",
            f"Tous mes {blank(5)}s sont là.",
            "Belle soirée !",
        ],
    ),
    (
        "Le taxi",
        "transports",
        [("taxi", "transports", "taxi"), ("valise", "voyage", "bagage"), ("adresse", "ecole-bureau", "feuille-de-papier"), ("chauffeur", "metiers", "chauffeur-de-bus"), ("argent", "argent-administration", "billet")],
        [
            f"J’appelle un {blank(1)}.",
            f"Je mets ma {blank(2)} dans le coffre.",
            f"Je donne mon {blank(3)}.",
            f"Le {blank(4)} connaît le chemin.",
            f"Je paie avec de l’{blank(5)}.",
            "Merci, bonne journée !",
        ],
    ),
]

MORE += [
    (
        "Le cours de théâtre",
        "loisirs",
        [("costume", "vetements", "costume"), ("scène", "loisirs", "scene"), ("masque", "loisirs", "masque"), ("texte", "ecole-bureau", "feuille-de-papier"), ("public", "famille-personnes", "famille")],
        [
            f"Je porte un {blank(1)}.",
            f"Je monte sur la {blank(2)}.",
            f"Parfois, je mets un {blank(3)}.",
            f"J’apprends mon {blank(4)}.",
            f"Le {blank(5)} regarde attentivement.",
            "Bravo les acteurs !",
        ],
    ),
    (
        "La chambre d’ami",
        "maison",
        [("lit", "maison", "lit"), ("oreiller", "maison", "oreiller"), ("couverture", "maison", "couverture"), ("lampe", "maison", "lampe"), ("fenêtre", "maison", "fenêtre")],
        [
            f"Il y a un {blank(1)} confortable.",
            f"Voici un {blank(2)} doux.",
            f"Une {blank(3)} chaude est prête.",
            f"La {blank(4)} est sur la table.",
            f"La {blank(5)} donne sur le jardin.",
            "Bonne nuit !",
        ],
    ),
    (
        "Le magasin de fruits",
        "magasins",
        [("banane", "fruits", "banane"), ("pomme", "fruits", "pomme"), ("raisin", "fruits", "raisin"), ("balance", "objets", "balance"), ("sac", "accessoires", "sac")],
        [
            f"Je prends une {blank(1)}.",
            f"Et deux {blank(2)}s.",
            f"Du {blank(3)} aussi, s’il vous plaît.",
            f"On pèse sur la {blank(4)}.",
            f"Je mets tout dans mon {blank(5)}.",
            "Merci !",
        ],
    ),
    (
        "L’orage",
        "vie-quotidienne",
        [("orage", "meteo", "orage"), ("éclair", "meteo", "eclair"), ("pluie", "meteo", "pluie"), ("fenêtre", "maison", "fenêtre"), ("bougie", "objets", "bougie")],
        [
            f"Il y a un {blank(1)}.",
            f"Je vois un {blank(2)}.",
            f"Il tombe de la {blank(3)}.",
            f"Je ferme la {blank(4)}.",
            f"S’il n’y a plus d’électricité, j’allume une {blank(5)}.",
            "Restez en sécurité !",
        ],
    ),
    (
        "Le musée des enfants",
        "loisirs",
        [("dinosaure", "animaux-sauvages", "lion"), ("maquette", "loisirs", "jeu"), ("atelier", "ecole-bureau", "salle-de-classe"), ("guide", "metiers", "enseignant"), ("cadeau", "objets", "cadeau")],
        [
            f"Nous voyons un {blank(1)}.",
            f"Il y a une {blank(2)} d’avion.",
            f"Les enfants participent à un {blank(3)}.",
            f"Un {blank(4)} explique tout.",
            f"À la boutique, j’achète un petit {blank(5)}.",
            "Visite réussie !",
        ],
    ),
    (
        "Le petit-déjeuner à l’hôtel",
        "voyage",
        [("croissant", "aliments", "croissant"), ("jus", "boissons", "jus-d-orange"), ("œuf", "aliments", "oeuf"), ("buffet", "maison", "buffet"), ("thé", "boissons", "thé")],
        [
            f"Je prends un {blank(1)}.",
            f"Je bois un {blank(2)} d’orange.",
            f"Il y a aussi un {blank(3)}.",
            f"Tout est sur le {blank(4)}.",
            f"Maman préfère un {blank(5)}.",
            "Bon appétit !",
        ],
    ),
    (
        "La leçon de maths",
        "ecole",
        [("calculatrice", "ecole-bureau", "calculatrice"), ("règle", "ecole-bureau", "règle"), ("cahier", "ecole-bureau", "cahier"), ("tableau", "ecole-bureau", "tableau"), ("exercice", "ecole-bureau", "exercice")],
        [
            f"J’utilise une {blank(1)}.",
            f"Je trace avec une {blank(2)}.",
            f"J’écris dans mon {blank(3)}.",
            f"Le professeur écrit au {blank(4)}.",
            f"Nous finissons un {blank(5)} difficile.",
            "2 + 2 = 4 !",
        ],
    ),
    (
        "Le jardin d’enfants",
        "vie-quotidienne",
        [("toboggan", "loisirs", "manege"), ("bac-à-sable", "loisirs", "jeu"), ("ballon", "sports", "ballon"), ("enfant", "famille-personnes", "enfant"), ("parc", "ville", "parc")],
        [
            f"Les enfants glissent sur le {blank(1)}.",
            f"Ils jouent dans le {blank(2)}.",
            f"Ils se passent un {blank(3)}.",
            f"Chaque {blank(4)} rit.",
            f"Nous sommes dans le {blank(5)}.",
            "Belle après-midi !",
        ],
    ),
    (
        "La soirée pizza maison",
        "maison",
        [("pâte", "aliments", "pate"), ("tomate", "legumes", "tomate"), ("fromage", "aliments", "fromage"), ("four", "electromenager", "four"), ("couteau", "cuisine", "couteau")],
        [
            f"Nous étalons la {blank(1)}.",
            f"Nous ajoutons de la {blank(2)}.",
            f"Nous mettons du {blank(3)}.",
            f"La pizza va dans le {blank(4)}.",
            f"Je coupe avec un {blank(5)}.",
            "À table !",
        ],
    ),
    (
        "Le rendez-vous à la mairie",
        "lieux-publics",
        [("mairie", "ville", "mairie"), ("document", "ecole-bureau", "feuille-de-papier"), ("guichet", "ville", "comptoire"), ("tampon", "objets", "tampon"), ("fonctionnaire", "metiers", "employe-de-bureau")],
        [
            f"Je vais à la {blank(1)}.",
            f"J’apporte un {blank(2)}.",
            f"Je vais au {blank(3)}.",
            f"On met un {blank(4)} sur le papier.",
            f"Le {blank(5)} m’explique la suite.",
            "Dossier terminé.",
        ],
    ),
]

MORE += [
    (
        "La chasse aux insectes",
        "loisirs",
        [("papillon", "insectes-petites-betes", "papillon"), ("abeille", "insectes-petites-betes", "abeille"), ("loupe", "objets", "loupe"), ("carnet", "ecole-bureau", "cahier"), ("jardin", "maison", "jardin")],
        [
            f"Je vois un {blank(1)}.",
            f"Attention à l’{blank(2)} !",
            f"Je regarde avec une {blank(3)}.",
            f"Je note dans mon {blank(4)}.",
            f"Nous sommes dans le {blank(5)}.",
            "Nature passionnante !",
        ],
    ),
    (
        "Le déménagement de bureau",
        "travail",
        [("carton", "objets", "boîte"), ("chaise", "maison", "chaise"), ("lampe", "maison", "lampe"), ("ordinateur", "technologie", "ordinateur"), ("ascenseur", "maison", "ascenseur")],
        [
            f"Nous remplissons un {blank(1)}.",
            f"Nous déplaçons une {blank(2)}.",
            f"Je débranche la {blank(3)}.",
            f"Je porte mon {blank(4)}.",
            f"Nous montons par l’{blank(5)}.",
            "Nouveau bureau prêt !",
        ],
    ),
    (
        "La soirée jeux",
        "fetes",
        [("carte", "loisirs", "jeu-de-cartes"), ("dé", "loisirs", "dé"), ("pion", "loisirs", "dé"), ("table", "maison", "table"), ("rire", "famille-personnes", "contente")],
        [
            f"Nous jouons aux {blank(1)}s.",
            f"Je lance le {blank(2)}.",
            f"Je déplace mon {blank(3)}.",
            f"Nous sommes autour de la {blank(4)}.",
            f"Tout le monde a le {blank(5)} aux lèvres.",
            "Soirée réussie !",
        ],
    ),
    (
        "Le marché aux poissons",
        "magasins",
        [("poisson", "aliments", "poisson"), ("crevette", "animaux-aquatiques", "crevette"), ("glace", "meteo", "glace"), ("vendeur", "metiers", "vendeuse"), ("sac", "accessoires", "sac")],
        [
            f"J’achète du {blank(1)} frais.",
            f"Il y a aussi des {blank(2)}s.",
            f"Tout est sur de la {blank(3)}.",
            f"Le {blank(4)} me conseille.",
            f"Je mets tout dans mon {blank(5)}.",
            "Pour le dîner ce soir !",
        ],
    ),
    (
        "La nuit étoilée",
        "vacances",
        [("étoile", "animaux-aquatiques", "étoile-de-mer"), ("lune", "ciel-espace", "lune"), ("télescope", "technologie", "ordinateur"), ("couverture", "maison", "couverture"), ("silence", "nature", "horizon")],
        [
            f"Je regarde une {blank(1)}.",
            f"La {blank(2)} est pleine.",
            f"J’utilise un {blank(3)}.",
            f"Je suis sous une {blank(4)}.",
            f"Il y a un grand {blank(5)}.",
            "Quel ciel !",
        ],
    ),
    (
        "Le cours de cuisine asiatique",
        "loisirs",
        [("riz", "aliments", "riz"), ("baguettes", "aliments", "baguette"), ("bol", "cuisine", "bol"), ("sauce", "aliments", "huile"), ("wok", "cuisine", "wok")],
        [
            f"Nous cuisinons du {blank(1)}.",
            f"Nous mangeons avec des {blank(2)}.",
            f"Je sers dans un {blank(3)}.",
            f"J’ajoute de la {blank(4)}.",
            f"Tout cuit dans le {blank(5)}.",
            "Délicieux !",
        ],
    ),
    (
        "La rentrée scolaire",
        "ecole",
        [("cartable", "ecole-bureau", "cartable"), ("trousse", "ecole-bureau", "trousse"), ("cahier", "ecole-bureau", "cahier"), ("classe", "ecole-bureau", "salle-de-classe"), ("ami", "famille-personnes", "ami")],
        [
            f"J’ai un nouveau {blank(1)}.",
            f"Ma {blank(2)} est pleine.",
            f"J’ouvre mon {blank(3)} neuf.",
            f"Je découvre ma {blank(4)}.",
            f"Je retrouve mon {blank(5)}.",
            "Bonne rentrée !",
        ],
    ),
    (
        "Le week-end pluvieux",
        "vie-quotidienne",
        [("livre", "ecole-bureau", "livre"), ("thé", "boissons", "thé"), ("couverture", "maison", "couverture"), ("film", "ville", "cinema"), ("canapé", "maison", "canape")],
        [
            f"Je lis un {blank(1)}.",
            f"Je bois un {blank(2)}.",
            f"Je m’enveloppe dans une {blank(3)}.",
            f"Nous regardons un {blank(4)}.",
            f"Nous sommes sur le {blank(5)}.",
            "Week-end cosy !",
        ],
    ),
    (
        "La visite du château",
        "loisirs",
        [("château", "ville", "château"), ("tour", "ville", "château"), ("escalier", "maison", "escalier"), ("guide", "metiers", "enseignant"), ("photo", "loisirs", "photo")],
        [
            f"Nous visitons un {blank(1)}.",
            f"Nous montons dans une {blank(2)}.",
            f"L’{blank(3)} est très long.",
            f"Le {blank(4)} raconte l’histoire.",
            f"Je prends une {blank(5)} du paysage.",
            "Impressionnant !",
        ],
    ),
    (
        "Le match de handball",
        "loisirs",
        [("handball", "sports", "handball"), ("ballon", "sports", "ballon"), ("maillot", "vetements", "t-shirt"), ("but", "sports", "but"), ("équipe", "famille-personnes", "famille")],
        [
            f"Nous jouons au {blank(1)}.",
            f"Je passe le {blank(2)}.",
            f"Je porte mon {blank(3)}.",
            f"Je marque un {blank(4)}.",
            f"Toute l’{blank(5)} est contente.",
            "Match gagné !",
        ],
    ),
]

MORE += [
    (
        "La cuisine du dimanche",
        "maison",
        [("poulet", "aliments", "poulet"), ("riz", "aliments", "riz"), ("salade", "legumes", "laitue"), ("four", "electromenager", "four"), ("table", "maison", "table")],
        [
            f"Nous cuisinons un {blank(1)}.",
            f"Il y a du {blank(2)} à côté.",
            f"Et une {blank(3)} verte.",
            f"Tout cuit dans le {blank(4)}.",
            f"Nous mangeons à la {blank(5)}.",
            "Dimanche en famille.",
        ],
    ),
    (
        "Le parc d’attractions",
        "loisirs",
        [("manège", "loisirs", "manege"), ("billet", "loisirs", "billets-de-spectacle"), ("barbe-à-papa", "desserts", "barbe-à-papa"), ("photo", "loisirs", "photo"), ("ami", "famille-personnes", "ami")],
        [
            f"Je monte sur un {blank(1)}.",
            f"J’ai mon {blank(2)} d’entrée.",
            f"Je mange de la {blank(3)}.",
            f"Nous prenons une {blank(4)}.",
            f"Je suis avec mon {blank(5)}.",
            "Journée géniale !",
        ],
    ),
    (
        "Le contrôle médical",
        "sante",
        [("médecin", "metiers", "médecin"), ("tension", "sante", "fievre"), ("poids", "nombres-mesures", "kilogramme"), ("ordonnance", "ecole-bureau", "feuille-de-papier"), ("salle-d-attente", "ecole-bureau", "salle-de-classe")],
        [
            f"Je vois le {blank(1)}.",
            f"Il mesure ma {blank(2)}.",
            f"Il note mon {blank(3)}.",
            f"Il me donne une {blank(4)}.",
            f"J’attendais dans la {blank(5)}.",
            "Tout va bien.",
        ],
    ),
    (
        "La bibliothèque municipale",
        "lieux-publics",
        [("roman", "ecole-bureau", "livre"), ("bande-dessinée", "ecole-bureau", "livre"), ("carte", "objets", "carte"), ("silence", "ecole-bureau", "ardoise"), ("étagère", "maison", "etagere")],
        [
            f"J’emprunte un {blank(1)}.",
            f"Mon frère prend une {blank(2)}.",
            f"J’ai ma {blank(3)} de lecteur.",
            f"Ici, on respecte le {blank(4)}.",
            f"Les livres sont sur une {blank(5)}.",
            "Bonne lecture !",
        ],
    ),
    (
        "Le camping-car",
        "vacances",
        [("camping-car", "transports", "caravane"), ("route", "transports", "autoroute"), ("lit", "maison", "lit"), ("cuisine", "maison", "cuisine"), ("vue", "nature", "paysage")],
        [
            f"Nous voyageons en {blank(1)}.",
            f"Nous suivons une belle {blank(2)}.",
            f"Le soir, nous dormons dans le {blank(3)}.",
            f"Il y a une petite {blank(4)} à bord.",
            f"Le matin, quelle {blank(5)} !",
            "Liberté totale.",
        ],
    ),
    (
        "Le cours de chant",
        "ecole",
        [("micro", "electromenager", "micro-onde"), ("piano", "musique", "piano"), ("note", "musique", "musique"), ("professeur", "metiers", "professeur"), ("chanson", "musique", "musique")],
        [
            f"Je chante dans le {blank(1)}.",
            f"Le {blank(2)} accompagne.",
            f"J’apprends une {blank(3)}.",
            f"Le {blank(4)} corrige ma voix.",
            f"Nous répétons une {blank(5)}.",
            "Do ré mi !",
        ],
    ),
    (
        "Le goûter sportif",
        "loisirs",
        [("banane", "fruits", "banane"), ("eau", "boissons", "eau"), ("serviette", "hygiene", "serviette"), ("ballon", "sports", "ballon"), ("parc", "ville", "parc")],
        [
            f"Après le sport, je mange une {blank(1)}.",
            f"Je bois de l’{blank(2)}.",
            f"Je m’essuie avec une {blank(3)}.",
            f"Nous rangeons le {blank(4)}.",
            f"Nous quittons le {blank(5)}.",
            "Bon effort !",
        ],
    ),
    (
        "La nouvelle école",
        "ecole",
        [("porte", "maison", "porte"), ("couloir", "maison", "couloir"), ("salle", "ecole-bureau", "salle-de-classe"), ("tableau", "ecole-bureau", "tableau"), ("professeur", "metiers", "professeur")],
        [
            f"J’ouvre la {blank(1)} de l’école.",
            f"Je marche dans le {blank(2)}.",
            f"Je trouve ma {blank(3)}.",
            f"Il y a un grand {blank(4)} blanc.",
            f"Le {blank(5)} se présente.",
            "Bienvenue !",
        ],
    ),
    (
        "Le dîner végétarien",
        "vie-quotidienne",
        [("légume", "legumes", "légume"), ("riz", "aliments", "riz"), ("tofu", "aliments", "riz"), ("assiette", "cuisine", "assiette"), ("fourchette", "cuisine", "fourchette")],
        [
            f"Ce soir, nous mangeons un {blank(1)}.",
            f"Il y a du {blank(2)}.",
            f"Et un peu de {blank(3)}.",
            f"Je sers dans une {blank(4)}.",
            f"Je mange avec une {blank(5)}.",
            "Repas léger !",
        ],
    ),
    (
        "Le feu d’artifice d’été",
        "fetes",
        [("nuit", "heure-horloge", "minuit"), ("feu-d-artifice", "loisirs", "festival"), ("couverture", "maison", "couverture"), ("glace", "desserts", "glace"), ("ami", "famille-personnes", "ami")],
        [
            f"C’est la {blank(1)} du 14 juillet.",
            f"Nous regardons le {blank(2)}.",
            f"Nous sommes sur une {blank(3)}.",
            f"Je mange une {blank(4)}.",
            f"Je suis avec mon {blank(5)}.",
            "Que c’est beau !",
        ],
    ),
]


def one_sentence_per_line(lignes: list[str]) -> list[str]:
    """Découpe chaque ligne en phrases (., !, ?) tout en gardant les intitulés courts."""
    out: list[str] = []
    for line in lignes:
        line = line.strip()
        if not line:
            continue
        # Ne pas découper les intitulés trop courts sans point final utile
        parts = re.split(r"(?<=[.!?])\s+", line)
        for p in parts:
            p = p.strip()
            if p:
                out.append(p)
    return out


def main() -> None:
    # Ajouter MORE (sauf doublons de scène avec les 2 keep)
    existing_scenes = {e["scene"] for e in ENTRIES}
    for scene, scenario, mots, lignes in MORE:
        if scene in existing_scenes:
            scene = f"{scene} (bis)"
        existing_scenes.add(scene)
        add(scene, scenario, mots, one_sentence_per_line(lignes))

    # Les 2 premiers aussi en une phrase / ligne
    for e in ENTRIES[:2]:
        e["texte"] = "\n".join(one_sentence_per_line(e["texte"].split("\n")))

    # Garder exactement 100 thèmes uniques (2 existants + 98 nouveaux).
    seen: set[str] = set()
    selected: list[dict] = []
    for e in ENTRIES:
        if e["scene"] in seen:
            continue
        seen.add(e["scene"])
        selected.append(e)
        if len(selected) == 100:
            break
    assert len(selected) == 100, f"Attendu 100, obtenu {len(selected)}"

    with PE_JSON.open(encoding="utf-8") as f:
        bank = json.load(f)

    bank = [e for e in bank if e.get("type_exercice") != "texte_images"]

    new_exercises = []
    for i, e in enumerate(selected, start=1):
        eid = e.get("keep_id") or f"tcf-a0a1-pe-texte-images-{i:03d}"
        new_exercises.append(
            {
                "id": eid,
                "niveau": "A0-A1",
                "competence": "PE",
                "type_exercice": "texte_images",
                "theme": f"TCF CSC · Texte à compléter · {e['scene']}",
                "scenario": e["scenario"],
                "scene": e["scene"],
                "consigne": CONSIGNE,
                "tags": ["mots-cles"],
                "points": 5,
                "support": {"texte": e["texte"], "mots": e["mots"]},
                "questions": [],
                "consigne_supplementaire": None,
            }
        )

    bank.extend(new_exercises)
    with PE_JSON.open("w", encoding="utf-8") as f:
        json.dump(bank, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"OK : {len(new_exercises)} texte_images écrits dans {PE_JSON}")


if __name__ == "__main__":
    main()
