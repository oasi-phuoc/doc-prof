import type { LogistiqueUnit } from '../approved-banks'

export const module409 = [
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transpalette-photo-v002.webp",
        "alt": "Engin orange compact avec timon noir et deux fourches près du sol, sans mât haut.",
        "caption": "Le transpalette électrique déplace des palettes au sol avec des fourches à faible levée."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-gerbeur-photo-v002.webp",
        "alt": "Gerbeur orange à timon avec un mât vertical et des bras porteurs sous les fourches.",
        "caption": "Le mât du gerbeur guide la montée des fourches pour empiler ou déposer en rayonnage."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-tracteur-photo-v003.webp",
        "alt": "Un petit tracteur industriel tire des chariots à roulettes.",
        "caption": "Le tracteur déplace plusieurs chariots roulants. Repérez la liaison entre les unités et la longueur totale du train."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-telescopique-photo-v002.webp",
        "alt": "Engin orange sur quatre roues, avec un bras incliné épais terminé par des fourches.",
        "caption": "Le bras télescopique porte les fourches. La portée et la hauteur dépendent de sa position."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}bras télescopique{/g} porte l’accessoire. Il s’allonge pour atteindre une position à distance ou en hauteur. La capacité varie avec son extension, la hauteur et la configuration de l’engin. {g}+{/g} capacité · hauteur · {g}−{/g} coûts · maniabilité"
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-prepareur-photo-v003.webp",
        "alt": "Un engin de préparation à petite levée présente une plateforme de conduite et des fourches basses.",
        "caption": "Le préparateur à petite levée rapproche l’opérateur de la marchandise dans les niveaux bas."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-contrepoids-photo-v002.webp",
        "alt": "Chariot orange à contrepoids, grand bloc arrière, cabine et mât avant avec fourches.",
        "caption": "Repérez le contrepoids derrière la cabine et la charge portée à l’avant."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-mat-retractable-photo-v002.webp",
        "alt": "Chariot de rayonnage orange, grand mât et deux bras porteurs avec roues devant la cabine.",
        "caption": "Sur cet engin, le mât peut ramener la charge entre les bras porteurs pour circuler."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transstockeur-photo-v003.webp",
        "alt": "Un transstockeur est guidé par les rails au pied d’un rayonnage haut.",
        "caption": "Le mât et la navette desservent les emplacements le long d’une allée guidée."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-lateral-photo-v002.webp",
        "alt": "Engin orange allongé, cabine en bout et fourches latérales au milieu de la plateforme.",
        "caption": "La prise latérale et la plateforme facilitent la manutention de marchandises longues."
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
        "src": "/assets/logistique/400/409/commun/log-409-agv-photo-v002.webp",
        "alt": "Plateforme motorisée orange basse avec capteurs, sans cabine ni timon.",
        "caption": "Une plateforme AGV transporte des charges sur un trajet commandé. Le modèle illustré roule sans conducteur à bord."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-autostore-photo-v003.webp",
        "alt": "Des robots se déplacent au-dessus de bacs empilés sur une grille.",
        "caption": "Les robots se déplacent sur la grille au-dessus des colonnes de bacs. Le poste de prélèvement reçoit les bacs demandés."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "9. Les engins de manutention",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "9.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un {g}engin de manutention au sol{/g} se déplace sur le sol, même s’il lève aussi une charge en hauteur. Choisissez-le selon le poids, les dimensions, la hauteur du rangement, la place et le trajet. La {g}capacité résiduelle{/g} indique ce que l’engin peut porter dans une configuration donnée."
      },
      {
        "kind": "heading",
        "text": "9.2 Reconnaître les engins au sol",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un {g}timon{/g} est la poignée de direction et de commande de certains engins. Un {g}mât{/g} guide la montée des fourches. Sur un appareil en {g}porte-à-faux{/g}, la charge avance au-delà de l’appui avant; sur d’autres modèles des {g}bras porteurs{/g} entourent ou soutiennent la zone de charge."
      },
      {
        "kind": "heading",
        "text": "9.2.1 Transpalette électrique à timon",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transpalette-photo-v002.webp",
        "alt": "Engin orange compact avec timon noir et deux fourches près du sol, sans mât haut.",
        "caption": "Le transpalette électrique déplace des palettes au sol avec des fourches à faible levée."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}transpalette électrique{/g} soulève juste assez pour transporter une palette. Il est utile au quai et sur les trajets au sol. Repérez les fourches basses et le timon."
      },
      {
        "kind": "heading",
        "text": "9.2.2 Gerbeur électrique à timon (S2)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-gerbeur-photo-v002.webp",
        "alt": "Gerbeur orange à timon avec un mât vertical et des bras porteurs sous les fourches.",
        "caption": "Le mât du gerbeur guide la montée des fourches pour empiler ou déposer en rayonnage."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}gerbeur{/g} possède un mât vertical. Il transporte, soulève et dépose les palettes à la hauteur autorisée. Le timon permet de le commander à pied sur le modèle illustré."
      },
      {
        "kind": "heading",
        "text": "9.2.3 Tracteurs (S1)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-tracteur-photo-v003.webp",
        "alt": "Un petit tracteur industriel tire des chariots à roulettes.",
        "caption": "Le tracteur déplace plusieurs chariots roulants. Repérez la liaison entre les unités et la longueur totale du train."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}tracteur{/g} tire des chariots roulants. Il déplace plusieurs lots dans une tournée interne. Il faut prévoir la longueur du train et le rayon de manœuvre."
      },
      {
        "kind": "heading",
        "text": "9.2.4 Chariot élévateur télescopique (R4)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-telescopique-photo-v002.webp",
        "alt": "Engin orange sur quatre roues, avec un bras incliné épais terminé par des fourches.",
        "caption": "Le bras télescopique porte les fourches. La portée et la hauteur dépendent de sa position."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}bras télescopique{/g} peut varier en longueur. Il permet d’atteindre un point en hauteur ou en avant. L’extension change la capacité admissible, à vérifier sur le diagramme de l’engin."
      },
      {
        "kind": "heading",
        "text": "9.2.5 et 9.2.6 Préparateurs de commandes",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-prepareur-photo-v003.webp",
        "alt": "Un engin de préparation à petite levée présente une plateforme de conduite et des fourches basses.",
        "caption": "Le préparateur à petite levée rapproche l’opérateur de la marchandise dans les niveaux bas."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}préparateur à petite levée{/g} rapproche la personne du lieu de prélèvement au niveau bas. Un {g}préparateur vertical{/g} peut monter jusqu’au niveau de picking voulu si l’installation et l’engin le permettent."
      },
      {
        "kind": "heading",
        "text": "9.2.7 Contrepoids (R1)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-contrepoids-photo-v002.webp",
        "alt": "Chariot orange à contrepoids, grand bloc arrière, cabine et mât avant avec fourches.",
        "caption": "Repérez le contrepoids derrière la cabine et la charge portée à l’avant."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}contrepoids{/g} à l’arrière équilibre une charge placée devant l’essieu avant. Le bloc de poids arrière, la cabine et le mât avant sont des signes distinctifs. Vérifiez capacité, place de manœuvre et équipement adapté."
      },
      {
        "kind": "heading",
        "text": "9.2.8 Mât rétractable (R2)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-mat-retractable-photo-v002.webp",
        "alt": "Chariot de rayonnage orange, grand mât et deux bras porteurs avec roues devant la cabine.",
        "caption": "Sur cet engin, le mât peut ramener la charge entre les bras porteurs pour circuler."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}mât rétractable{/g} avance pour déposer ou prendre une palette, puis revient vers le châssis pour la déplacer. Les bras porteurs sont visibles à l’avant. Cet engin est courant dans les rayonnages d’entrepôt."
      },
      {
        "kind": "heading",
        "text": "9.2.9 à 9.2.12 Gerbeurs portés et engins spécialisés",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transstockeur-photo-v003.webp",
        "alt": "Un transstockeur est guidé par les rails au pied d’un rayonnage haut.",
        "caption": "Le mât et la navette desservent les emplacements le long d’une allée guidée."
      },
      {
        "kind": "list",
        "items": [
          "{g}Gerbeur à conducteur porté{/g} : le cariste est à bord. Certains modèles prennent deux palettes si leur conception et leur diagramme le permettent.",
          "{g}Transstockeur{/g} : guidé dans l’allée pour déposer et reprendre des marchandises aux emplacements.",
          "{g}Tri-directionnel{/g} : ses fourches pivotent et travaillent sur les deux faces d’une allée étroite, dans les configurations prévues.",
          "{g}Multidirectionnel{/g} : ses roues orientables changent le sens de déplacement, utile notamment pour les charges longues."
        ]
      },
      {
        "kind": "heading",
        "text": "9.2.13 Latéral (R3)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-lateral-photo-v002.webp",
        "alt": "Engin orange allongé, cabine en bout et fourches latérales au milieu de la plateforme.",
        "caption": "La prise latérale et la plateforme facilitent la manutention de marchandises longues."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}chariot latéral{/g} prend la charge par le côté et la pose sur sa plateforme. Il convient aux profilés, planches et autres marchandises longues."
      },
      {
        "kind": "heading",
        "text": "9.3 Choisir une motorisation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le matériel peut être {g}électrique{/g}, à {g}combustion{/g} (diesel ou gaz selon le modèle) ou {g}hybride{/g}. Comparez autonomie, recharge ou ravitaillement, émissions, bruit, entretien et conditions du lieu. L’emploi en intérieur se décide selon les règles du site et la ventilation, entre autres."
      },
      {
        "kind": "heading",
        "text": "9.4 Parties de l’engin",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Le {g}mât{/g} peut avoir plusieurs étages, comme le {g}duplex{/g} ou le {g}triplex{/g}. La {g}levée libre{/g} permet de faire monter les fourches sans augmenter immédiatement la hauteur totale du mât.",
          "Les {g}fourches{/g} prennent le support par ses entrées. Leur position, leur longueur et leur espacement doivent convenir à la charge.",
          "Des {g}rallonges{/g} et des {g}fourches rétractables{/g} permettent d’atteindre une charge plus éloignée. Elles modifient le bras de levier et peuvent réduire la capacité. Vérifier le {g}diagramme de charge{/g}.",
          "Les {g}fourches relevables{/g} et dispositifs de circulation dépendent de l’équipement, du trajet et des prescriptions applicables."
        ]
      },
      {
        "kind": "heading",
        "text": "9.5 Outils portés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un accessoire répond à une tâche précise. Le {g}ripage latéral{/g} décale les fourches pour aligner la charge. Une {g}tête rotative{/g} peut orienter un bac. Une {g}pince{/g} adaptée saisit certaines charges, par exemple une bobine. Une {g}potence{/g} ou un {g}grappin{/g} répond à des usages spécifiques. Vérifier l’autorisation, la charge et le diagramme de l’ensemble."
      },
      {
        "kind": "heading",
        "text": "9.6 FTS / AGV",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-agv-photo-v002.webp",
        "alt": "Plateforme motorisée orange basse avec capteurs, sans cabine ni timon.",
        "caption": "Une plateforme AGV transporte des charges sur un trajet commandé. Le modèle illustré roule sans conducteur à bord."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}AGV{/g}, ou véhicule à guidage automatique, transporte des charges sans conducteur à bord. Son guidage peut utiliser des repères au sol, des capteurs ou une carte. Il faut respecter les zones de circulation et les consignes aux croisements."
      },
      {
        "kind": "heading",
        "text": "9.7 Transstockeurs auto / semi-auto",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}transstockeur{/g} travaille le long de rayonnages guidés. Un système semi-automatique peut recevoir une destination choisie par l’opérateur. Un système automatique reçoit des ordres du {g}WMS{/g}, le logiciel de gestion de l’entrepôt. Le {g}contrôle de profil{/g} vérifie si l’unité peut entrer. Un {g}double jeu{/g} enchaîne un rangement et un prélèvement."
      },
      {
        "kind": "heading",
        "text": "9.8 AutoStore",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-autostore-photo-v003.webp",
        "alt": "Des robots se déplacent au-dessus de bacs empilés sur une grille.",
        "caption": "Les robots se déplacent sur la grille au-dessus des colonnes de bacs. Le poste de prélèvement reçoit les bacs demandés."
      },
      {
        "kind": "paragraph",
        "text": "{g}AutoStore{/g} range les marchandises dans des bacs empilés sous une grille. Des robots se déplacent au-dessus pour reprendre les bacs et les acheminer à un poste. L’organisation des bacs favorise l’accès aux articles demandés souvent."
      }
    ],
    "module": "409",
    "revision": "409-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
