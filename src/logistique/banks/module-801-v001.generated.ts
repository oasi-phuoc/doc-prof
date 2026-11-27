import type { LogistiqueUnit } from '../approved-banks'

export const module801 = [
  {
    "id": "log-801-objectifs-apercu",
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
          "Expliquer le rôle du {g}GTIN{/g} à la caisse et la différence GTIN-8 / GTIN-13 / ISBN / UPC",
          "Décrire {g}SSCC{/g} et {g}GS1-128{/g} pour le suivi des unités de transport",
          "Comparer {g}QR{/g} et {g}Data Matrix{/g} et citer des usages logistiques",
          "Appliquer les règles de {g}placement{/g} des codes et expliquer le principe {g}RFID{/g} (tag + lecteur)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 801",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier un article, une unité d'expédition et un lot en choisissant la bonne donnée.",
          "Reconnaître les supports optiques et le principe d'une lecture par radio.",
          "Placer l'étiquette pour la rendre lisible aux points de passage."
        ]
      }
    ],
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
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
        "src": "/assets/logistique/800/801/commun/log-801-notions-1-v001.svg",
        "alt": "GTIN. Référence de produit. SSCC. Unité logistique précise. Lot. Série à tracer.",
        "caption": "Deux palettes du même produit gardent des SSCC différents."
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
        "src": "/assets/logistique/800/801/commun/log-801-notions-2-v001.svg",
        "alt": "Sur le côté de la palette, une étiquette apparaît dans la zone de 400 à 800 mm depuis la base. Une marge d'au moins 50 mm la sépare du bord vertical.",
        "caption": "Schéma de principe hors échelle. Les dimensions concernent le symbole de l’étiquette logistique GS1 sur une unité de hauteur suffisante."
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
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}GTIN{/g} — Identifiant GS1 d'une référence commerciale à un niveau d'emballage défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}GTIN-8{/g} — Identifiant de huit chiffres pouvant notamment être utilisé sur de petits articles."
      },
      {
        "kind": "paragraph",
        "text": "{g}GTIN-13{/g} — Identifiant commercial de treize chiffres avec un chiffre de contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}SSCC{/g} — Identifiant GS1 de dix-huit chiffres attribué à une unité logistique."
      },
      {
        "kind": "paragraph",
        "text": "{g}GS1-128{/g} — Symbole linéaire qui peut encoder plusieurs données typées, dont le SSCC."
      },
      {
        "kind": "paragraph",
        "text": "{g}Identifiant d'application{/g} — Préfixe qui indique la nature et le format d'une donnée GS1."
      },
      {
        "kind": "paragraph",
        "text": "{g}ISBN{/g} — Numéro international attribué à une édition ou à un format de publication."
      },
      {
        "kind": "paragraph",
        "text": "{g}Data Matrix{/g} — Symbole matriciel à deux dimensions reconnaissable à ses deux bordures pleines adjacentes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Code QR{/g} — Symbole matriciel repérable notamment par trois motifs carrés dans les coins."
      },
      {
        "kind": "paragraph",
        "text": "{g}RFID{/g} — Identification par échange radio entre une étiquette et un lecteur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Ensemble d'unités rattaché à une même origine ou fabrication pour le suivi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chiffre de contrôle{/g} — Chiffre calculé à partir des autres pour détecter certaines erreurs de saisie."
      }
    ],
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le même article est livré en 12 cartons de 8 pièces. Combien de pièces contrôlez-vous ?",
    "answer": "96 pièces",
    "calculation": "12 × 8 = 96.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-maths-fiche-2",
    "kind": "maths",
    "prompt": "Chaque palette reçoit deux étiquettes portant le même SSCC. Combien d'étiquettes pour 17 palettes ?",
    "answer": "34 étiquettes",
    "calculation": "17 × 2 = 34.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 150 lectures de test, 144 réussissent du premier coup. Combien faut-il relire ?",
    "answer": "6 lectures",
    "calculation": "150 − 144 = 6.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-maths-fiche-4",
    "kind": "maths",
    "prompt": "Dans l'exercice, le symbole doit laisser au moins 50 mm libres au bord. Vous mesurez 37 mm. De combien au minimum faut-il l'éloigner ?",
    "answer": "13 mm",
    "calculation": "50 − 37 = 13.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-maths-fiche-5",
    "kind": "maths",
    "prompt": "Pour les douze premiers chiffres d'un GTIN-13, la somme pondérée vaut 84. Quelle valeur ajouter pour atteindre le multiple de 10 suivant ?",
    "answer": "6",
    "calculation": "90 − 84 = 6.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-801-maths-fiche-6",
    "kind": "maths",
    "prompt": "Sur 250 passages, 240 sont lus à la première tentative. Quel est le taux de réussite initial ?",
    "answer": "96 %",
    "calculation": "240 ÷ 250 × 100 = 96.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-801-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que distingue le SSCC lorsque deux palettes transportent le même produit ?",
    "answer": "Les deux unités logistiques, chacune avec son propre SSCC.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-verification-fiche-2",
    "kind": "verification",
    "prompt": "De quelle donnée a-t-on besoin pour rappeler une série d'articles fabriqués ensemble ?",
    "answer": "Le numéro de lot, à associer à la référence et aux mouvements concernés.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-verification-fiche-3",
    "kind": "verification",
    "prompt": "Un GTIN permet-il de déduire le prix à lui seul ?",
    "answer": "Le GTIN identifie la référence; le prix est rattaché à cette référence dans le système.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel repère visuel distingue un Data Matrix d'un QR courant ?",
    "answer": "Le Data Matrix possède deux bords adjacents pleins. Le QR possède trois grands repères carrés.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi vérifier la lisibilité de l'étiquette après filmage d'une palette ?",
    "answer": "Le film peut masquer, froisser ou rendre réfléchissant le symbole.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-verification-fiche-6",
    "kind": "verification",
    "prompt": "Que lit-on avec un lecteur RFID ?",
    "answer": "Des données de l'étiquette transmises par radio, selon la portée et l'environnement.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-situation-fiche-1",
    "kind": "situation",
    "prompt": "Deux palettes identiques à destination de deux clients ont le même SSCC. Comment intervenir ?",
    "answer": "Mettre les unités en attente, identifier chacune, attribuer les SSCC distincts selon la procédure et vérifier la cohérence du système et des étiquettes.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-situation-fiche-2",
    "kind": "situation",
    "prompt": "Une palette doit pouvoir être lue depuis deux faces. Où coller les étiquettes ?",
    "answer": "Choisir deux faces accessibles selon la consigne de pose, loin des bords et des plis, avec le même identifiant sur les deux faces. Tester après filmage.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-801-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le service qualité annonce que seul le lot B4 est touché. Comment éviter le retrait de tous les articles ?",
    "answer": "Associer référence, lot et mouvements dans le système, isoler les unités B4 et identifier précisément les livraisons à signaler.",
    "module": "801",
    "revision": "801-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
