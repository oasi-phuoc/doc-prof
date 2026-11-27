import type { LogistiqueUnit } from '../approved-banks'

export const module407 = [
  {
    "id": "log-407-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "7. Moyens de transport",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "7.1 Notions de base",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyage{/g} et {g}transport{/g} sont liés. Chez EnterSite / en logistique interne : {g}transporter{/g} = déplacer des marchandises {g}au sein{/g} de l'entreprise (unité d'exploitation délimitée : logistique, production…)."
      },
      {
        "kind": "paragraph",
        "text": "Deux familles : - {g}Installations fixes{/g} : convoyeurs à rouleaux, bandes… - {g}Engins mobiles{/g} (sans installation fixe) : chariots élévateurs, etc."
      },
      {
        "kind": "heading",
        "text": "7.2 Moyens de transport dans la logistique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Du simple appareil aux systèmes complexes. Classification possible selon plusieurs critères."
      },
      {
        "kind": "heading",
        "text": "7.2.1 Critères de subdivision",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Critère",
          "Exemples"
        ],
        "rows": [
          [
            "{g}Guidage{/g}",
            "Sur rails (transstockeur) · sans rail (FTS / AGV)"
          ],
          [
            "{g}Mobilité{/g}",
            "Flux 2D (chariot élévateur) · 1D (convoyeur à rouleaux)"
          ],
          [
            "{g}Entraînement{/g}",
            "Manuel (transpalette) · mécanique (appareil à timon)"
          ],
          [
            "{g}Automatisation{/g}",
            "Opérateur (préparateur) · ordinateur (transstockeur auto)"
          ],
          [
            "{g}Type de marchandise{/g}",
            "Unitaire (palettes) · vrac · liquides"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "7.2.2 Choisir le bon moyen",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Type de marchandise · poids/dimensions · quantité · direction et longueur du trajet · effet de rationalisation recherché."
      },
      {
        "kind": "heading",
        "text": "7.2.3 Manuels",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-manuel-photo-v002.webp",
        "alt": "Transpalette manuel orange, timon noir et fourches basses, posé près d’une palette.",
        "caption": "Le timon commande et dirige le transpalette. Ses fourches basses dégagent la palette du sol pour un court déplacement."
      },
      {
        "kind": "paragraph",
        "text": "Toujours utiles sur {g}courtes{/g} distances : flexibles et économiques. Ex. : transpalette manuel · chariot à bras · palan à chaîne."
      },
      {
        "kind": "heading",
        "text": "7.2.4 Convoyeurs continus",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Colis en carton posés sur les rouleaux métalliques d’un convoyeur fixe.",
        "caption": "Les rouleaux soutiennent les cartons et les guident sur un trajet défini."
      },
      {
        "kind": "paragraph",
        "text": "Transport {g}permanent{/g} sur parcours linéaire. Grandes quantités (production de masse, Poste…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} automatisation · peu de personnel {g}−{/g} investissement ↑ · rentable seulement si forte utilisation · pas pour tous produits · panne = arrêt du flux"
      },
      {
        "kind": "paragraph",
        "text": "Ex. : bande · rouleaux · chaîne."
      },
      {
        "kind": "heading",
        "text": "7.2.5 Ponts et portiques roulants",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Levage {g}aérien{/g} · déplacement 3D possible · lourds / encombrants. Intérieur ou extérieur."
      },
      {
        "kind": "heading",
        "text": "7.2.6 Engins de manutention internes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Au sol · manuels ou mécaniques · largeur d'allée ({g}AST{/g}) adaptée. Sans rail = flexibilité."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : transpalette électrique à timon · gerbeur · tracteur porté · préparateurs de commandes (petite levée…)."
      },
      {
        "kind": "heading",
        "text": "7.2.7 Chariot élévateur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-chariot-contrepoids-photo-v002.webp",
        "alt": "Chariot orange à contrepoids, grand bloc arrière, cabine et mât avant avec fourches.",
        "caption": "Le mât lève les fourches à l’avant. Le contrepoids se reconnaît au bloc arrière."
      },
      {
        "kind": "paragraph",
        "text": "Engin le plus fréquent. Fourches / accessoires · mât hydraulique · inclinaison (prise/dépose, anti-glissement). Variantes : contrepoids · mât rétractable · gerbeur assis…"
      },
      {
        "kind": "paragraph",
        "text": "{g}RFID{/g} sur engins : enregistrement auto palettes · attribution emplacements · régulation vitesse (zones/MD) · optimisation d'itinéraires."
      },
      {
        "kind": "heading",
        "text": "7.2.8 Transstockeur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transstockeur-photo-v003.webp",
        "alt": "Un transstockeur se déplace sur des rails au milieu d’un rayonnage haut.",
        "caption": "Le transstockeur est guidé dans l’allée. Il utilise un chariot vertical pour déposer ou reprendre la charge à l’emplacement."
      },
      {
        "kind": "paragraph",
        "text": "Guidé par {g}rails{/g} dans l'allée · stockage/déstockage rationnel. Souvent 1 appareil / allée (coût ↑, rendement ↑). Déplacement entre allées via aiguillages possible (capacité ↓)."
      },
      {
        "kind": "paragraph",
        "text": "Auto : fourche télescopique. Alternative : {g}engin de mise en stock{/g} (allée un peu plus large · manuel · siège au sol ou poste sur mât)."
      },
      {
        "kind": "heading",
        "text": "7.3 Loi du levier",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Chariot à {g}contrepoids{/g} = levier à deux bras. Charge hors base des roues · essieu {g}avant{/g} = point d'appui. Moment du chariot > moment de la charge sinon {g}basculement{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Pour ↑ capacité : alourdir le chariot · allonger l'arrière · raccourcir le bras de charge."
      },
      {
        "kind": "table",
        "headers": [
          "Terme",
          "Sens (contrepoids)"
        ],
        "rows": [
          [
            "Point d'appui P",
            "Essieu avant"
          ],
          [
            "Forces F",
            "Charge / contrepoids"
          ],
          [
            "Bras a",
            "Distance essieu → force"
          ],
          [
            "Moment",
            "Force × bras (Nm)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Équilibre ex. : 0,4 m × 200 N = 80 Nm = 0,8 m × 100 N."
      },
      {
        "kind": "paragraph",
        "text": "Sûr tant que : {g}M gauche (contrepoids) > M droite (mât + charge){/g}."
      },
      {
        "kind": "heading",
        "text": "7.4 Diagrammes de capacité de charge",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plaque signalétique : charge max {g}jamais{/g} dépassée. Diagramme : poids autorisé selon {g}distance du centre de gravité{/g} et souvent {g}hauteur de levage{/g}."
      },
      {
        "kind": "list",
        "items": [
          "Sans hauteur (ex. gerbeur à timon) : lire poids vs distance CdG",
          "Avec hauteur : capacité {g}↓{/g} quand hauteur ↑ · même lecture + tenir compte du niveau"
        ]
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "7. Moyens de transport",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "7.1 Déplacer les marchandises sur un site",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}transport interne{/g} relie les postes, par exemple la réception et le stockage. Une {g}installation fixe{/g} transporte sur un parcours défini. Un {g}engin mobile{/g} peut changer d’itinéraire."
      },
      {
        "kind": "heading",
        "text": "7.2 Choisir un moyen de transport",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Regardez la charge, sa masse, ses dimensions, la distance, le nombre de déplacements et la place disponible. Un appareil peut être manuel ou motorisé, guidé ou libre, automatique ou commandé par une personne. Les moyens adaptés aux palettes, au vrac et aux liquides diffèrent."
      },
      {
        "kind": "heading",
        "text": "7.2.3 Manuels",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-manuel-photo-v002.webp",
        "alt": "Transpalette manuel orange, timon noir et fourches basses, posé près d’une palette.",
        "caption": "Le timon commande et dirige le transpalette. Ses fourches basses dégagent la palette du sol pour un court déplacement."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}transpalette manuel{/g} lève légèrement une palette pour la déplacer sur une courte distance. Le timon sert à diriger et à pomper. Le {g}chariot à bras{/g} transporte d’autres charges légères ou compatibles. Un {g}palan à chaîne{/g} sert à soulever une charge adaptée."
      },
      {
        "kind": "heading",
        "text": "7.2.4 Convoyeurs continus",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Colis en carton posés sur les rouleaux métalliques d’un convoyeur fixe.",
        "caption": "Les rouleaux soutiennent les cartons et les guident sur un trajet défini."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}convoyeur{/g} transporte de nombreux colis sur un parcours régulier. Les modèles à {g}rouleaux{/g}, à {g}bande{/g} et à {g}chaîne{/g} conviennent à des marchandises différentes. Une panne peut arrêter le flux entier. Les {g}ponts{/g} et {g}portiques roulants{/g} lèvent des charges encombrantes et les déplacent par le haut."
      },
      {
        "kind": "heading",
        "text": "7.2.6 Engins de manutention internes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les engins au sol offrent des parcours plus flexibles. L’{g}AST{/g} représente la largeur d’allée de travail nécessaire pour manœuvrer avec la charge dans les conditions spécifiées. Vérifier l’engin, la palette et le site avant de choisir."
      },
      {
        "kind": "heading",
        "text": "7.2.7 Chariot élévateur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-chariot-contrepoids-photo-v002.webp",
        "alt": "Chariot orange à contrepoids, grand bloc arrière, cabine et mât avant avec fourches.",
        "caption": "Le mât lève les fourches à l’avant. Le contrepoids se reconnaît au bloc arrière."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}chariot élévateur{/g} associe des {g}fourches{/g}, un {g}mât de levage{/g} ou un autre dispositif adapté et des commandes. Le {g}contrepoids{/g}, le {g}mât rétractable{/g} et le {g}gerbeur{/g} répondent à des besoins différents. La {g}RFID{/g} peut identifier une unité lors du passage. Les données peuvent soutenir le suivi des emplacements."
      },
      {
        "kind": "heading",
        "text": "7.2.8 Transstockeur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-transstockeur-photo-v003.webp",
        "alt": "Un transstockeur se déplace sur des rails au milieu d’un rayonnage haut.",
        "caption": "Le transstockeur est guidé dans l’allée. Il utilise un chariot vertical pour déposer ou reprendre la charge à l’emplacement."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}transstockeur{/g} est guidé dans l’allée et dessert les emplacements. Il peut être manuel, semi-automatique ou automatique. Le chariot de mise en stock peut être une autre solution quand l’organisation et la largeur d’allée le permettent."
      },
      {
        "kind": "heading",
        "text": "7.3 Loi du levier",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sur un chariot à {g}contrepoids{/g}, l’{g}essieu avant{/g} joue le rôle de point d’appui dans le modèle simplifié. Le {g}moment{/g} vaut {g}force × bras de levier{/g} en N·m. À force égale, une charge plus éloignée exerce un moment plus grand. Par exemple, 200 N à 0,4 m donnent 80 N·m. Une force de 100 N à 0,8 m donne le même moment."
      },
      {
        "kind": "heading",
        "text": "7.4 Diagramme de capacité de charge",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}diagramme de capacité de charge{/g} donne la charge admissible selon le {g}centre de gravité de la charge{/g} et, suivant l’engin, la hauteur de levage. Vérifier la configuration et les accessoires. Pour une charge inconnue ou une combinaison absente du diagramme, arrêter et demander une vérification."
      }
    ],
    "module": "407",
    "revision": "407-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
