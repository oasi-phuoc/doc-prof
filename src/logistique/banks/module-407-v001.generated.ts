import type { LogistiqueUnit } from '../approved-banks'

export const module407 = [
  {
    "id": "log-407-objectifs-apercu",
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
          "Distinguer transport interne et types de {g}moyens{/g} (fixes / mobiles)",
          "Classer et {g}choisir{/g} un moyen selon critères (marchandise, trajet, automatisation…)",
          "Expliquer le rôle du {g}chariot élévateur{/g} et du {g}transstockeur{/g}",
          "Appliquer la {g}loi du levier{/g} et lire un {g}diagramme de capacité de charge{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 407",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer un moyen mobile et un moyen fixe selon la tâche et le parcours.",
          "Identifier les données de la charge et de l’installation à vérifier.",
          "Lire un principe de levier ou une capacité fournie comme donnée de fiche."
        ]
      }
    ],
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
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
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-notions-1-v001.svg",
        "alt": "Moyen mobile. Parcours variables autorisés. Moyen fixe. Trajet défini par l’installation.",
        "caption": "Le choix dépend du flux et de la compatibilité avec le site."
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
        "kind": "paragraph",
        "text": "Toujours utiles sur {g}courtes{/g} distances : flexibles et économiques. Ex. : transpalette manuel · chariot à bras · palan à chaîne."
      },
      {
        "kind": "heading",
        "text": "7.2.4 Convoyeurs continus",
        "sub": true
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
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-notions-2-v001.svg",
        "alt": "Identifier. Engin et configuration. Vérifier. Données de la charge. Décider. Selon documentation.",
        "caption": "Un diagramme de cours ne valide pas une opération réelle."
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
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Capacité admissible{/g} — Limite donnée pour une configuration et des conditions définies."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centre de gravité{/g} — Point de référence utilisé pour représenter la répartition du poids."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur{/g} — Installation destinée à déplacer les unités le long d’un parcours."
      },
      {
        "kind": "paragraph",
        "text": "{g}Distance de charge{/g} — Distance référencée dans le diagramme ou la documentation de l’équipement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Engin fixe{/g} — Équipement rattaché à une installation ou un parcours déterminé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Engin mobile{/g} — Moyen qui peut se déplacer entre des zones autorisées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux continu{/g} — Déplacement récurrent sur une installation selon le processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux discontinu{/g} — Transfert effectué par trajets ou opérations séparés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Guidage{/g} — Dispositif ou forme de pilotage qui définit une trajectoire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Levier{/g} — Modèle reliant une force, une distance et un effet autour d’un point d’appui."
      },
      {
        "kind": "paragraph",
        "text": "{g}Parcours{/g} — Trajet défini de l’origine vers la destination."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transstockeur{/g} — Équipement desservant les positions d’un ensemble de rayonnages."
      }
    ],
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un convoyeur fictif traite 24 bacs par minute. Combien traite-t-il en cinq minutes continues ?",
    "answer": "120 bacs.",
    "calculation": "24 × 5 = 120.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un engin effectue six allers-retours de 48 m par trajet simple. Donnez la distance.",
    "answer": "576 m.",
    "calculation": "6 × 2 × 48 = 576 m.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un transfert dure 18 minutes et l’attente 7 minutes. Calculez le délai total.",
    "answer": "25 minutes.",
    "calculation": "18 + 7 = 25 min.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-maths-fiche-4",
    "kind": "maths",
    "prompt": "On répartit 132 unités en lots de 12. Combien de lots prépare-t-on ?",
    "answer": "Onze lots.",
    "calculation": "132 ÷ 12 = 11.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-maths-fiche-5",
    "kind": "maths",
    "prompt": "Dans un modèle de levier de table, une force de 40 N agit à 0,5 m. Calculez le moment.",
    "answer": "20 N·m.",
    "calculation": "40 × 0,5 = 20 N·m.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-407-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel intérêt donne un convoyeur à un flux fréquent ?",
    "answer": "Il organise un parcours répétitif, dans les limites de sa conception.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi utiliser un moyen mobile pour des trajets variés ?",
    "answer": "Il peut desservir plusieurs zones autorisées selon le planning.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que relie le principe de levier ?",
    "answer": "La force, sa distance au point d’appui et le moment correspondant.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-verification-fiche-4",
    "kind": "verification",
    "prompt": "Un calcul de cours suffit-il à autoriser l’usage réel d’un moyen ?",
    "answer": "Les limites et procédures de l’installation réelle et l’autorisation doivent être vérifiées.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quelles données servent à comparer deux solutions de déplacement ?",
    "answer": "Parcours, types de charges, fréquence, capacité, durée, risques et coûts.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-situation-fiche-1",
    "kind": "situation",
    "prompt": "Les destinations changent toutes les heures. Quelle comparaison proposez-vous ?",
    "answer": "Examiner la souplesse nécessaire, le volume et les accès pour comparer moyen mobile et installation fixe.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le document reçu correspond à un autre modèle d’engin. Quelle suite ?",
    "answer": "Suspendre la décision, relever la référence exacte et faire vérifier le document applicable.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-407-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le flux dépasse souvent le débit prévu. Que mesurez-vous ?",
    "answer": "Cadence réelle, périodes de saturation, durée des arrêts et volume en attente.",
    "module": "407",
    "revision": "407-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
