import type { LogistiqueUnit } from '../approved-banks'

export const module801 = [
  {
    "id": "log-801-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. Identification des marchandises",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Chez les grands distributeurs, chaque article porte un {g}GTIN{/g} (Global Trade Item Number). À la caisse, un {g}scanner laser{/g} lit les barres / espaces clairs et récupère désignation + prix depuis l'ordinateur central. Un numéro seul ne suffit pas : il faut l'accès à la liste du système."
      },
      {
        "kind": "paragraph",
        "text": "{g}Avantages :{/g} moins de saisies manuelles, ticket détaillé et mise à jour du prix dans le système."
      },
      {
        "kind": "heading",
        "text": "1.1 SSCC (Serial Shipping Container Code)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/100/commun/log-100-reception-photo-v002.webp",
        "alt": "Une équipe lit un identifiant associé à un envoi.",
        "caption": "L’identifiant de l’unité relie les événements des différents points de passage."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}SSCC{/g} identifie une unité logistique, par exemple une palette expédiée. Il contient {g}18 chiffres{/g}. Le code GS1-128 peut porter cette donnée sous l'identifiant d'application {g}(00){/g}."
      },
      {
        "kind": "heading",
        "text": "1.2 GTIN-8, GTIN-13, ISBN",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "1.2.1 Global Trade Item Number (GTIN)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le GTIN est un {g}identifiant numérique{/g}. Un code-barres tel qu'EAN-13 peut le représenter. Le système associe la référence à la désignation et au prix."
      },
      {
        "kind": "table",
        "headers": [
          "Bureau",
          "Rôle"
        ],
        "rows": [
          [
            "{g}GS1 Suisse{/g}",
            "Enregistrement GTIN (Suisse)"
          ],
          [
            "{g}Agence ISBN Suisse{/g}",
            "Livres (ISBN)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 {g}GTIN-13{/g} = standard le plus répandu en Europe (13 positions). {g}UPC{/g} (USA, 12 chiffres) : on ajoute un {g}0{/g} devant → GTIN-13 compatible."
      },
      {
        "kind": "heading",
        "text": "1.3 Structure GTIN-13, GTIN-8, ISBN",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le préfixe ordinaire indique généralement l'organisation GS1 qui a attribué le numéro, pas le pays de fabrication. Certains préfixes sont réservés à des catégories particulières. Le dernier chiffre sert au contrôle."
      },
      {
        "kind": "table",
        "headers": [
          "Préfixe",
          "Signification"
        ],
        "rows": [
          [
            "400–440",
            "Allemagne"
          ],
          [
            "{g}76{/g}",
            "Suisse et Liechtenstein"
          ],
          [
            "90–91",
            "Autriche"
          ],
          [
            "00–13",
            "États-Unis"
          ],
          [
            "977",
            "Périodiques (monde)"
          ],
          [
            "978–979",
            "Livres (monde)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "1.3.1 ISBN vs GTIN-13",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}ISBN{/g} = International Standard Book Number. Ancien {g}ISBN-10{/g} → intégré au GTIN-13 en {g}2007{/g} via préfixe {g}978{/g} (ou {g}979{/g})."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} 978-3-7657-1111-4 → GTIN-13 sans tirets : {g}9783765711114{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "Segment",
          "Sens"
        ],
        "rows": [
          [
            "978",
            "Livre"
          ],
          [
            "3",
            "Groupe d’enregistrement germanophone"
          ],
          [
            "7657",
            "Maison d'édition"
          ],
          [
            "1111",
            "Numéro de publication"
          ],
          [
            "4",
            "Contrôle"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "1.4 GS1-128",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Code-barres de {g}transport{/g} pour unités de commande / livraison / transport · scan EM/SM · assurance qualité. Sur palettes, cartons, emballages standard, présentoirs… Souvent + {g}SSCC{/g} pour Track & Trace mondial. Utilisé aussi où la {g}sécurité{/g} compte (santé, chimie, alimentation)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tracking{/g} = où est la marchandise maintenant · {g}Tracing{/g} = traçabilité du parcours."
      },
      {
        "kind": "heading",
        "text": "1.5 Code QR (Quick Response)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Développé en {g}1994{/g} par {g}Denso Wave{/g} (Japon) pour la logistique automobile Toyota. Matrice {g}2D{/g} de points · 3 repères d'orientation · correction d'erreurs jusqu'à {g}~30 %{/g} de perte. Lecture via smartphone (« mobile tagging »). Usages : expositions, musées, sentiers, monuments…"
      },
      {
        "kind": "heading",
        "text": "1.5.1 Stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Selon la syntaxe et le système adoptés, une étiquette peut associer référence, durée de validité et lot. Il faut aussi conserver le lien entre le lot et les mouvements pour permettre un {g}rappel ciblé{/g}."
      },
      {
        "kind": "heading",
        "text": "1.6 Code Data Matrix",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Code {g}2D{/g} très répandu · inscriptions permanentes (laser, estampage aiguille…) · chimie / médecine · tickets / adressage postal. Norme {g}ISO/IEC 16022{/g}. Capacité jusqu'à {g}~3 116{/g} chiffres ou {g}~2 335{/g} caractères ASCII. Angle droit de lignes continues = position. Correction d'erreurs → souvent plus sûr / compact que le 1-D."
      },
      {
        "kind": "heading",
        "text": "1.6.1 Distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Adresse magazine via Data Matrix · lecture par {g}caméra{/g} (2D, sans mouvement optique). QR : jusqu'à ~{g}4 000{/g} caractères (magazines) · Data Matrix plus {g}petit{/g} → industrie. Aussi : affranchissement envois en nombre · retour courrier indistribuable (Poste)."
      },
      {
        "kind": "heading",
        "text": "1.7 Placement des codes",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-pose-etiquette-schema-v002.webp",
        "alt": "Vue de face d’une charge palettisée suffisamment haute. La zone de pose du symbole est comprise entre 400 et 800 mm de la base et le symbole reste à au moins 50 mm du bord.",
        "caption": "Repérez la base et le bord vertical avant la pose. Schéma de principe hors échelle pour une unité de hauteur suffisante."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "Le symbole doit rester lisible après filmage. Mesurez la position sur l’unité avec les critères du site."
      },
      {
        "kind": "heading",
        "text": "Palettes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sur une unité palettisée, prévoir deux faces accessibles lorsque le protocole le prévoit. Pour l'étiquette logistique GS1, la zone de pose habituelle du symbole se situe entre {g}400 et 800 mm{/g} de la base, avec au moins {g}50 mm{/g} du bord vertical. Suivre les consignes adaptées aux unités basses."
      },
      {
        "kind": "heading",
        "text": "Cartons",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marquage sur {g}≥ 2 côtés{/g}, en bas à droite. Distances : {g}34 mm{/g} à droite (+0 / −23 mm) · {g}32 mm{/g} vers le bas. Étiquette de recouvrement possible."
      },
      {
        "kind": "heading",
        "text": "Longs / cylindriques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Diamètre ≥ {g}20 mm{/g} ou arête ≥ {g}30 mm{/g} → étiquette autocollante · sinon {g}étiquette volante{/g}. Marquage radial : longueur du symbole ≤ {g}1/6{/g} de la circonférence."
      },
      {
        "kind": "heading",
        "text": "1.8 RFID (Radio Frequency Identification)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Identification / localisation {g}automatique{/g} sans contact visuel obligatoire. Objectifs logistique : ↓ ruptures · ↑ contrôle erreurs · ↓ coûts personnel. Commerce : suivi palettes / cartons sur toute la chaîne."
      },
      {
        "kind": "heading",
        "text": "1.8.1 Composants",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-rfid-photo-v003.webp",
        "alt": "Une étiquette radio avec antenne visible est placée près d’un lecteur.",
        "caption": "Repérez le tag et son antenne. Le lecteur utilise une communication radio selon la technologie et les conditions de lecture."
      },
      {
        "kind": "table",
        "headers": [
          "Élément",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Transpondeur / tag{/g} (puce + antenne)",
            "Fixé sur/dans l'objet (souvent adhésif)"
          ],
          [
            "{g}Lecteur / encodeur{/g}",
            "Lit ou écrit selon le matériel. La portée dépend du système, de l'étiquette et de l'environnement."
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "1.8.2 Applications",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Antivol magasins · accès bâtiments / remontées · EM / transport / stockage · blanchisseries · bibliothèques · animaux · vision : caisse supermarché / passeports / implants médicaux (débat vie privée)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Hôpital (Caroline du Nord) : puce bébé → alarme « Code Pink » aux sorties → enlèvement évité. {g}Ex.{/g} Chronométrage sport (marathon, Ironman) : puce chaussure / vélo · temps live."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "1. Identification des marchandises",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 SSCC (Serial Shipping Container Code)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/100/commun/log-100-reception-photo-v002.webp",
        "alt": "Une équipe lit un identifiant associé à un envoi.",
        "caption": "L’identifiant de l’unité relie les événements des différents points de passage."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}SSCC{/g} identifie une unité d’expédition précise. Il comporte {g}18 chiffres{/g}. Deux palettes du même article ont des SSCC différents. Le symbole {g}GS1-128{/g} peut porter le SSCC sous l’identifiant d’application {g}(00){/g}."
      },
      {
        "kind": "heading",
        "text": "1.2 à 1.4 GTIN, ISBN et GS1-128",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}GTIN{/g} identifie une référence commerciale. Le {g}GTIN-8{/g} et le {g}GTIN-13{/g} ont un nombre de chiffres différent. Un {g}ISBN{/g} identifie une édition de livre. Un code {g}UPC{/g} courant à 12 chiffres peut être représenté sur 13 positions avec un zéro initial. Le chiffre de contrôle aide à vérifier la lecture. Un préfixe GS1 ne prouve pas le pays de fabrication. Le {g}GS1-128{/g} permet d’encoder plusieurs données typées."
      },
      {
        "kind": "heading",
        "text": "1.5 et 1.6 QR et Data Matrix",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}QR{/g} se reconnaît notamment à ses trois grands repères carrés. Le {g}Data Matrix{/g} a deux bordures adjacentes pleines. Ces codes à deux dimensions permettent de porter des informations selon la syntaxe utilisée. Le {g}lot{/g} aide à isoler les marchandises concernées par un rappel."
      },
      {
        "kind": "heading",
        "text": "1.7 Placement des codes",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-pose-etiquette-schema-v002.webp",
        "alt": "Vue de face d’une charge palettisée suffisamment haute. La zone de pose du symbole est comprise entre 400 et 800 mm de la base et le symbole reste à au moins 50 mm du bord.",
        "caption": "Repérez la base et le bord vertical avant la pose. Schéma de principe hors échelle pour une unité de hauteur suffisante."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "Le symbole doit rester lisible après filmage. Mesurez la position sur l’unité avec les critères du site."
      },
      {
        "kind": "paragraph",
        "text": "Placez l’étiquette sur une surface accessible. Sur une unité palettisée de hauteur suffisante, le symbole de l’étiquette logistique GS1 se place habituellement entre {g}400 et 800 mm{/g} de la base et à au moins {g}50 mm{/g} du bord vertical. Suivez les consignes adaptées au type de support. Vérifiez la lecture après filmage."
      },
      {
        "kind": "heading",
        "text": "1.8 RFID (Radio Frequency Identification)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-rfid-photo-v003.webp",
        "alt": "Une étiquette radio avec antenne visible est placée près d’un lecteur.",
        "caption": "Repérez le tag et son antenne. Le lecteur utilise une communication radio selon la technologie et les conditions de lecture."
      },
      {
        "kind": "paragraph",
        "text": "La {g}RFID{/g} relie une étiquette à un lecteur par radio. Elle peut lire sans contact visuel direct selon le matériel et les conditions. {g}Tracking{/g} suit les événements récents. Le {g}tracing{/g} reconstruit le parcours enregistré."
      }
    ],
    "module": "801",
    "revision": "801-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
