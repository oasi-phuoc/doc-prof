import type { LogistiqueUnit } from '../approved-banks'

export const module409 = [
  {
    "id": "log-409-objectifs-apercu",
    "kind": "objectifs-apercu",
    "blocks": [
      {
        "kind": "heading",
        "text": "Objectifs",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Définir un {g}engin de manutention au sol{/g} et citer les principaux types (timon, préparateurs, élévateurs, transstockeur…)",
          "Comparer les {g}entraînements{/g} (diesel, gaz, élec., hybride) selon intérieur/extérieur",
          "Décrire mâts, {g}levées libres{/g}, fourches et {g}outils portés{/g}, en tenant compte du {g}centre de gravité{/g}",
          "Expliquer AGV/FTS, {g}transstockeurs{/g} (manuel → auto) et le principe {g}Autostore{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 409",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier le rôle des engins au sol, des systèmes guidés et du transstockage.",
          "Comparer les usages attendus et vérifier la documentation de la configuration.",
          "Reconnaître les limites d’une intervention sur un équipement automatisé."
        ]
      }
    ],
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "9. Les engins de manutention",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Suite du module {g}407{/g} (moyens de transport). Le transport d'objets tient compte de l'{g}économie{/g} (rentabilité) et de l'{g}écologie{/g}. Ce module traite des véhicules qui se déplacent {g}au sol{/g}."
      },
      {
        "kind": "heading",
        "text": "9.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Engin de manutention{/g} = véhicule · {g}au sol{/g} = qui touche le sol pour se déplacer."
      },
      {
        "kind": "paragraph",
        "text": "Classé selon le mouvement {g}horizontal{/g} — pas la hauteur de levage. Un chariot à contrepoids avec 12 m de levage reste un engin de manutention au sol."
      },
      {
        "kind": "heading",
        "text": "9.2 Types d'engins au sol",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-notions-1-v001.svg",
        "alt": "Transpalette. Déplacement du support. Gerbeur. Transport et stockage. Transstockeur. Desserte du rayonnage.",
        "caption": "Les fonctions indiquent une famille. La documentation fixe les conditions d’usage."
      },
      {
        "kind": "table",
        "headers": [
          "Catégorie",
          "Types"
        ],
        "rows": [
          [
            "Engins à {g}timon{/g}",
            "Transpalette électrique · gerbeur électrique"
          ],
          [
            "{g}Préparation{/g} de commandes",
            "Petite levée · grande levée (vertical)"
          ],
          [
            "{g}Tracteur{/g} (S1)",
            "Tracteur"
          ],
          [
            "{g}Chariot élévateur{/g}",
            "Contrepoids (R1) · mât rétractable (R2) · télescopique (R4) · latéral (R3) · multidirectionnel"
          ],
          [
            "Engin de {g}mise en stock{/g}",
            "Gerbeur · tri-directionnel"
          ],
          [
            "{g}Transstockeur{/g}",
            "Desserte rayonnages moyennes/grandes hauteurs"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "Porte-à-faux vs bras porteurs",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Porte-à-faux{/g} : charge hors base des roues — télescopique, contrepoids, mise en stock",
          "{g}Bras porteurs{/g} : charge entre/sur les bras — mât rétractable, gerbeur, multidirectionnel"
        ]
      },
      {
        "kind": "heading",
        "text": "9.2.1 Transpalette électrique à timon",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Levée de {g}transport{/g} · surtout chargement / déchargement de véhicules. {g}+{/g} maniabilité · économique · {g}−{/g} transport seulement"
      },
      {
        "kind": "heading",
        "text": "9.2.2 Gerbeur électrique à timon (S2)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Transport {g}et{/g} empilage / stockage au 1er niveau de rayonnage. {g}+{/g} maniabilité · hauteur · {g}−{/g} hauteur limitée"
      },
      {
        "kind": "heading",
        "text": "9.2.3 Tracteurs (S1)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "« Tractent » de grandes quantités : marchandises préparées dans des chariots roulants. {g}+{/g} vitesse · simplicité · {g}−{/g} maniabilité · déplace chariots seulement"
      },
      {
        "kind": "heading",
        "text": "9.2.4 Chariot élévateur télescopique (R4)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bras télescopique massif déplacé vers l'arrière → sert de {g}contrepoids{/g} (seul ce type de construction permet de soulever). {g}+{/g} capacité · hauteur · {g}−{/g} coûts · maniabilité"
      },
      {
        "kind": "heading",
        "text": "9.2.5 Préparateur de commandes vertical",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Chariot {g}2D{/g} : vertical + horizontal, mais lié au sol. {g}+{/g} allées étroites · 2 axes · {g}−{/g} coûts · vitesse"
      },
      {
        "kind": "heading",
        "text": "9.2.6 Préparateur à petite levée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Déplace homme + support de charge horizontalement vers le prélèvement. {g}+{/g} vitesse · maniabilité · {g}−{/g} pas de picking vertical haut"
      },
      {
        "kind": "heading",
        "text": "9.2.7 Contrepoids (R1)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le plus connu · tailles et entraînements variés · intérieur / extérieur. Capacité = taille + poids. Outils portés possibles. {g}+{/g} charge · variantes · outils · V+H · {g}−{/g} coûts · maniabilité"
      },
      {
        "kind": "heading",
        "text": "9.2.8 Mât rétractable (R2)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le mât recule la charge {g}entre{/g} la base des roues (contrairement au contrepoids où le poids propre fixe la capacité). {g}+{/g} charge · variantes · maniabilité · V+H · {g}−{/g} coûts · sol plan · vue avant limitée"
      },
      {
        "kind": "heading",
        "text": "9.2.9 Gerbeur à conducteur porté assis",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Siège {g}latéral{/g} · pas de mât qui s'avance. Convient à l'expédition. Peut prendre {g}2 palettes{/g} (fourches + levée initiale). {g}+{/g} maniabilité · V+H · {g}−{/g} charge limitée · vue avant · sol plan"
      },
      {
        "kind": "heading",
        "text": "9.2.10 Transstockeur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Desserte de rayonnages moyens/hauts · formes variables. {g}Pas de retournement{/g} dans l'allée → largeur minimale. Guidage manuel, semi-auto ou auto · souvent rails sol + plafond. {g}+{/g} opération min. · V+H · occupation max · auto · {g}−{/g} coûts · pas de longs trajets"
      },
      {
        "kind": "heading",
        "text": "9.2.11 Mise en stock tri-directionnel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Allées très étroites (~{g}1500–1800 mm{/g}) · pas de retournement. Conducteur porté en hauteur {g}ou{/g} cabine au sol. Fourches {g}pivotantes{/g} (tri-directionnel) → stocker/déstocker haut. {g}+{/g} allée min. · occupation · {g}−{/g} coûts · sol plan · pas de longs trajets"
      },
      {
        "kind": "heading",
        "text": "9.2.12 Multidirectionnel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Change de sens {g}sur place{/g} (roues L/R, même diagonale). Maniabilité exceptionnelle pour un engin massif. {g}+{/g} sens sélectionnable · charge ↑ · V+H · {g}−{/g} coûts · massif · sol plan"
      },
      {
        "kind": "heading",
        "text": "9.2.13 Latéral (R3)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandises {g}longues{/g}. Cabine dans le sens de marche · mât coulissant {g}perpendiculaire{/g} → prise latérale, dépôt sur pont de chargement. {g}+{/g} intérieur/extérieur · longs · vitesse · {g}−{/g} coûts · rayon · hauteur limitée · usage dédié"
      },
      {
        "kind": "heading",
        "text": "9.3 Marché",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Grande concurrence (comme l'auto). Marques spécialisées · regrouper autant d'appareils que possible chez un même fournisseur. En Suisse : {g}Linde{/g} et {g}Still{/g} (groupe {g}Kion{/g})."
      },
      {
        "kind": "heading",
        "text": "9.3.1 Fabricants (CA mondial, Md USD)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Fabricant",
          "Origine",
          "2013",
          "2020"
        ],
        "rows": [
          [
            "Toyota Industries",
            "Japon",
            "7,71",
            "12,7"
          ],
          [
            "Groupe Kion",
            "Allemagne",
            "6,11",
            "6,9"
          ],
          [
            "Jungheinrich",
            "Allemagne",
            "3,16",
            "4,6"
          ],
          [
            "Mitsubishi Nichiyu",
            "Japon",
            "1,96",
            "3,8"
          ],
          [
            "Crown",
            "USA",
            "2,4",
            "3,6"
          ],
          [
            "Hyster-Yale",
            "USA",
            "2,67",
            "2,8"
          ],
          [
            "Anhui / Hangcha",
            "Chine",
            "~1",
            "1,9 / 1,3"
          ],
          [
            "Manitou",
            "France",
            "—",
            "1,3"
          ],
          [
            "Doosan",
            "Corée",
            "—",
            "1,0"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "*(Source Statista — ordres de grandeur)*"
      },
      {
        "kind": "heading",
        "text": "9.3.2 Types d'entraînement",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Mode",
          "Points clés"
        ],
        "rows": [
          [
            "{g}Diesel{/g}",
            "Extérieur · puissance ↑ (jusqu'à ~100 t) · pas d'intérieur (échappements) · le plus résistant"
          ],
          [
            "{g}Gaz{/g}",
            "Intérieur {g}et{/g} extérieur si bonne ventilation · combine diesel + élec."
          ],
          [
            "{g}Électrique{/g}",
            "Le plus utilisé · silencieux · zéro échappement · charge batterie · puissance souvent ↓ · récupération possible"
          ],
          [
            "{g}Hybride{/g}",
            "Générateur diesel/gaz {g}ou{/g} moteur élec. · intérieur et extérieur"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Essence : rare."
      },
      {
        "kind": "heading",
        "text": "9.3.3 Comparaison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Combustion (diesel / essence / gaz){/g} {g}+{/g} rapidement opérationnel · pentes · chargement/déchargement · charge ↑ (poids propre) · achat souvent ↓ {g}−{/g} bruit · émissions · odeur · entretien (usure)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Électrique{/g} {g}+{/g} sans échappement · silencieux · coûts d'exploitation ↓ · maniabilité {g}−{/g} charge batterie · frais généraux · coût d'acquisition · moins de puissance"
      },
      {
        "kind": "paragraph",
        "text": "{g}Hybride{/g} {g}+{/g} environnement · faible usure · maniabilité · conso ↓ {g}−{/g} acquisition · entretien ↑"
      },
      {
        "kind": "heading",
        "text": "9.4 Parties de l'engin",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "9.4.1 Mât de levage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Soulever hydrauliquement fourches + charge."
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Remarque"
        ],
        "rows": [
          [
            "Simplex",
            "Quasi disparu"
          ],
          [
            "Duplex",
            "Minimum moderne"
          ],
          [
            "Triplex",
            "Déjà standard"
          ],
          [
            "Quadruplex",
            "Rare · plus épais/lourd"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "« Mât à bonne visibilité » : chaînes / cylindres {g}latéraux{/g} → vue avant dégagée."
      },
      {
        "kind": "heading",
        "text": "9.4.2 Types de courses",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Sans levée libre{/g} : le mât se déploie avec la fourche (locaux hauts · modèles anciens)",
          "{g}Levée libre partielle{/g} : fourche jusqu'à ~{g}400 mm{/g} sans déployer le mât",
          "{g}Levée libre complète{/g} : fourche jusqu'à hauteur de construction sans sortir le profilé intérieur → locaux bas, camions, wagons (préférer à l'achat)"
        ]
      },
      {
        "kind": "heading",
        "text": "9.4.3 Fourches",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Inclinaison = sécuriser au transport + déposer avec délicatesse. Contrepoids : mât inclinable. Mât rétractable : mât souvent rigide → {g}fourches inclinables{/g}."
      },
      {
        "kind": "heading",
        "text": "9.4.4 Rallonges",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Longueur type Euro-palette : {g}800–1200 mm{/g} (plus la capacité est faible, plus les fourches sont courtes). Petites capacités : profilé en U + cheville. Grosses : profilé creux fermé."
      },
      {
        "kind": "heading",
        "text": "9.4.5 Fourches rétractables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rallonges avancées {g}hydrauliquement{/g} · camions chargés d'un seul côté · rayonnages doubles accessibles d'un côté."
      },
      {
        "kind": "paragraph",
        "text": "👉 {g}CdG{/g} : rallonges / rétractables avancent le centre de gravité → informer le cariste · {g}diagramme de charge{/g} sur l'engin."
      },
      {
        "kind": "heading",
        "text": "9.4.6 Fourches relevables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Voie publique : fourches relevées {g}ou{/g} barre de protection. Relevables si circulation publique régulière (quais, gares). Occasionnel → barre suffit."
      },
      {
        "kind": "heading",
        "text": "9.5 Outils portés",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Outil",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Grille de protection{/g}",
            "Protège le cariste des chutes d'éléments · attention en rayonnage (décrochage)"
          ],
          [
            "{g}Ripage latéral{/g}",
            "Positionnement au cm · garder position {g}neutre{/g} médiane"
          ],
          [
            "{g}Écartement des fourches{/g}",
            "Largeur hydraulique depuis le siège · {g}double fourche{/g} = 2 palettes · pas pour pincer non-palettisé"
          ],
          [
            "{g}Tête rotative{/g}",
            "Vider bacs / pivoter palettes · souvent + pinces · bacs à sabots fermés"
          ],
          [
            "{g}Pince à balles{/g}",
            "Charges non sensibles à la pression (papier, cellulose, électroménager)"
          ],
          [
            "{g}Pince à bobines{/g}",
            "Surfaces arrondies · 1 ou 2 grappins · papier (tonnes) · + rotative"
          ],
          [
            "{g}Pince à pierres{/g}",
            "Parallélépipèdes · carrières · mâchoires structurées · hydraulique"
          ],
          [
            "{g}Grappin bois rond{/g}",
            "Grumes / troncs · parcs à bois · engins lourds"
          ],
          [
            "{g}Éperon{/g}",
            "Rouleaux de moquette jusqu'à ~4 m · CdG à mi-longueur · conduite prudente"
          ],
          [
            "{g}Potence{/g}",
            "Saisie par le haut · machines, armatures, longs · CdG · ne pas télescoper chargé"
          ],
          [
            "{g}Compresseur de charge{/g}",
            "Stabilise piles non sanglées (boissons…) · force adaptée · soupape si long trajet"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "9.6 FTS / AGV",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-notions-2-v001.svg",
        "alt": "Parcours. Trajet défini. Surveillance. État du flux. Écart. Signalement prévu.",
        "caption": "Une panne est traitée par la procédure et le personnel autorisé."
      },
      {
        "kind": "paragraph",
        "text": "Systèmes de transport {g}sans conducteur{/g} (FTS / AGV) : grandes quantités sur {g}itinéraires identiques{/g} (souvent entrepôt ↔ production). Anciens modèles : arceau souple anti-collision à l'avant."
      },
      {
        "kind": "heading",
        "text": "9.6.1 Guidage",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Induction{/g} : câble noyé dans le sol + générateur de fréquence · bifurcations programmables",
          "{g}Optique{/g} : piste réfléchissante balayée par capteurs"
        ]
      },
      {
        "kind": "heading",
        "text": "9.6.2 Systèmes intelligents",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plus de guidage fixe · {g}parcours d'apprentissage{/g} · ultrasons / laser anti-collision · validation auprès d'un poste central aux croisements."
      },
      {
        "kind": "heading",
        "text": "9.7 Transstockeurs auto / semi-auto",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "9.7.1 Manuel / semi-automatique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sur {g}rails{/g} · commandés par une personne · mât vertical guidé haut/bas · plate-forme vers l'emplacement. Semi-auto : picking {g}statique{/g} · conducteur ou saisie du n° d'emplacement. « Homme va à la marchandise »."
      },
      {
        "kind": "heading",
        "text": "9.7.2 Automatique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sans conducteur · ordres WMS · stockent / prélèvent palettes ou conteneurs. {g}Double jeu{/g} : enchaîne entrée puis sortie sans retour au point de départ. Souvent {g}1 appareil / allée{/g} (coût ↑, efficacité et sécurité d'approvisionnement ↑). Entrée : {g}contrôle de profil{/g} (dimensions)."
      },
      {
        "kind": "heading",
        "text": "9.8 Autostore",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Technologie de stockage {g}robotisée{/g} (entreprise norvégienne, 1996) — cube automatisé, pas issue de l'auto asiatique. >{g}45 pays{/g} · partenaires locaux (vente, install, maintenance)."
      },
      {
        "kind": "heading",
        "text": "9.8.1 Fonctionnement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Matériel + logiciel."
      },
      {
        "kind": "list",
        "items": [
          "{g}Grille{/g} : structure remplie de caisses · planifiée selon le bâtiment (« technique Lego »)",
          "{g}Robots{/g} : rails sur la grille · axes {g}X/Y{/g} · désempilent en profondeur · modèles selon conso/taille",
          "{g}Caisses{/g} : empilées · 1 étiquette = 1 emplacement · multi-compartiments / multi-articles possibles · tailles variées"
        ]
      },
      {
        "kind": "heading",
        "text": "9.8.2 Avantages",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Occupation d'espace {g}max{/g} · vitesse · {g}24/7{/g} (pas de congés) · logiciel réordonne : articles à {g}rotation rapide{/g} en haut, faible rotation en bas (phases calmes)."
      }
    ],
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Accessoire porté{/g} — Équipement ajouté à l’engin avec son propre champ d’usage."
      },
      {
        "kind": "paragraph",
        "text": "{g}AGV{/g} — Véhicule guidé automatiquement sur des itinéraires ou selon une logique prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chariot de manutention{/g} — Engin qui déplace ou lève des charges selon sa conception."
      },
      {
        "kind": "paragraph",
        "text": "{g}Configuration{/g} — Ensemble du modèle, des accessoires et des conditions retenues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrepoids{/g} — Masse intégrée dans une conception de stabilité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Énergie d’entraînement{/g} — Énergie qui alimente la motorisation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Gerbeur{/g} — Engin conçu pour transporter et gerber dans ses limites."
      },
      {
        "kind": "paragraph",
        "text": "{g}Levée libre{/g} — Course pendant laquelle la levée se fait sans modifier certaines dimensions du mât."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mât{/g} — Structure de levage d’un engin selon sa conception."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transpalette{/g} — Appareil destiné à déplacer un support compatible au niveau de travail prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transstockeur{/g} — Machine qui dessert des emplacements selon un système défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}Zone automatisée{/g} — Partie du site dont certains mouvements sont pilotés automatiquement."
      }
    ],
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un cycle fictif dure quatre minutes. Combien de cycles complets tiennent dans une heure sans interruption ?",
    "answer": "Quinze cycles.",
    "calculation": "60 ÷ 4 = 15.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-maths-fiche-2",
    "kind": "maths",
    "prompt": "Deux engins effectuent neuf et onze trajets. Combien de trajets sont enregistrés ?",
    "answer": "20 trajets.",
    "calculation": "9 + 11 = 20.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une batterie est hors service 35 min sur 120 min observées. Combien de minutes restent disponibles ?",
    "answer": "85 minutes.",
    "calculation": "120 − 35 = 85 min.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un appareil automatisé traite 20 bacs par séquence, pendant six séquences identiques. Donnez le total.",
    "answer": "120 bacs.",
    "calculation": "20 × 6 = 120.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-maths-fiche-5",
    "kind": "maths",
    "prompt": "Une tournée utilise 5,6 kWh pour 28 mouvements. Calculez la consommation moyenne par mouvement.",
    "answer": "0,20 kWh par mouvement.",
    "calculation": "5,6 ÷ 28 = 0,20 kWh.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-409-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que distingue un transpalette et un gerbeur ?",
    "answer": "Le gerbeur est prévu pour gerber dans ses limites. Le transpalette est d’abord un moyen de déplacement de supports.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi vérifier l’accessoire dans une configuration ?",
    "answer": "Il peut modifier les limites, la géométrie et les usages autorisés.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que fait un transstockeur ?",
    "answer": "Il dépose et prélève des unités au sein d’un système de stockage conçu pour lui.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quand intervient du personnel dans une zone automatisée ?",
    "answer": "Selon l’autorisation et la procédure contrôlée applicables.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que comparez-vous pour choisir un entraînement ?",
    "answer": "Usage prévu, environnement, énergie disponible et restrictions du site.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le marquage d’un accessoire ne correspond pas au dossier de l’engin. Que faites-vous ?",
    "answer": "Suspendre son usage et faire vérifier la compatibilité documentaire.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un AGV est arrêté dans un passage. Quelle suite ?",
    "answer": "Appliquer la consigne de circulation, signaler et attendre la prise en charge habilitée.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-409-situation-fiche-3",
    "kind": "situation",
    "prompt": "L’équipe compare deux moyens pour des produits longs. Quelles données relève-t-elle ?",
    "answer": "Dimensions, masse, orientation, parcours, accès et conditions de stockage.",
    "module": "409",
    "revision": "409-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
