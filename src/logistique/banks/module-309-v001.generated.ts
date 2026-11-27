import type { LogistiqueUnit } from '../approved-banks'

export const module309 = [
  {
    "id": "log-309-objectifs-apercu",
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
          "Définir la {g}qualité{/g} et l'{g}assurance qualité{/g}",
          "Distinguer critères {g}subjectifs{/g} et {g}objectifs{/g}",
          "Expliquer le rôle de la logistique (échantillons, {g}quarantaine AQ{/g})",
          "Comparer {g}sous- / bonne / sur-qualité{/g}",
          "Choisir entre contrôle {g}complet{/g} et {g}par échantillonnage{/g} (improvisé, simple, multiple) et décrire un contrôle de {g}fonctionnement{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 309",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Traduire une exigence en critère observable avec une unité et une tolérance.",
          "Distinguer contrôle exhaustif, échantillonnage et assurance qualité.",
          "Rattacher le constat et la décision au lot contrôlé."
        ]
      }
    ],
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "9. Contrôle de la qualité",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "9.1 Importance de l'assurance qualité",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-notions-1-v001.svg",
        "alt": "Exigence. Critère et tolérance. Contrôle. Méthode et résultat. Statut. Libération ou suivi.",
        "caption": "La décision s’appuie sur un résultat et son mode de mesure."
      },
      {
        "kind": "paragraph",
        "text": "L'{g}assurance qualité{/g} = toutes les mesures pour garantir une qualité {g}constante{/g} des produits/services."
      },
      {
        "kind": "paragraph",
        "text": "Particularité élevée : agroalimentaire, aéronautique, pharmaceutique (santé, sécurité). Ex. aéronautique : chaque composant avec {g}certificat{/g} (origine, matériaux) — risque de certificats falsifiés → défi pour le contrôle."
      },
      {
        "kind": "paragraph",
        "text": "Souvent confié à des collaborateurs formés : service AQ ou {g}laboratoire{/g} d'essai. Crucial si la production dépend de la qualité des achats."
      },
      {
        "kind": "heading",
        "text": "9.2 Définition de la qualité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "> « La qualité, c'est quand la {g}performance{/g} correspond à l'{g}attente{/g}. »"
      },
      {
        "kind": "heading",
        "text": "9.3 Critères de qualité",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Subjectifs{/g} — opinions, sentiments, jugement personnel (ex. : choisir VW pour la réputation du SAV)",
          "{g}Objectifs{/g} — mesurables : géométrie, labo, contrôles, couleur, évaluations clients (ex. : 96 % d'avis positifs à la réception d'hôtel ; écarts géométriques sur échantillons)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Outils possibles :{/g} contrôle géométrique · colorimètre / nuancier · composition chimique en labo · contrôle de fonctionnement (sommaire ou approfondi)."
      },
      {
        "kind": "heading",
        "text": "9.3.1 Contrôles par échantillonnage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Prélèvement d'échantillons à l'arrivée pour vérifier composition, dureté, couleur, épaisseur, etc. Suivre les {g}procédures internes{/g} ; étiquetage {g}100 % fiable{/g}. Courant en chimie et alimentaire (ex. céréales avant déchargement bateau)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock AQ / quarantaine{/g} Marchandises échantillonnées {g}non disponibles{/g} tant que le contrôle n'a pas validé. Zone dédiée (« AQ », quarantaine) + étiquettes si besoin — pas de mélange avec stock libre / production."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rôle de la logistique{/g} Souvent : prélever, étiqueter, transmettre au service compétent ; solde en quarantaine. Après résultat : {g}refuser/renvoyer{/g} ou {g}valider{/g} et stocker."
      },
      {
        "kind": "heading",
        "text": "9.4 Niveau de qualité",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Niveau",
          "Sens"
        ],
        "rows": [
          [
            "{g}Sous-qualité{/g}",
            "N'atteint pas les exigences · apparemment moins cher · retours, perte de confiance"
          ],
          [
            "{g}Bonne qualité{/g}",
            "Correspond aux attentes · juste prix · partenaire fiable"
          ],
          [
            "{g}Sur-qualité{/g}",
            "Au-delà des besoins · plus cher à produire · trop cher pour un besoin « basique »"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "9.5 Contrôles de qualité dans les entreprises",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-notions-2-v001.svg",
        "alt": "Complet. Toutes les unités sont vérifiées. Échantillon. Une partie définie est vérifiée.",
        "caption": "Le plan applicable indique la sélection et la règle d’acceptation."
      },
      {
        "kind": "paragraph",
        "text": "De l'anglais *quality assurance* : tous les processus pour une qualité constante. Indispensable pour répondre au client. Gestion de la qualité / ISO → module {g}506{/g}."
      },
      {
        "kind": "heading",
        "text": "9.6 Techniques de contrôle",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Selon sensibilité des marchandises, fiabilité fournisseur, risques production. Méthodes définies en management qualité : {g}contrôle complet{/g} ou {g}par échantillonnage{/g}."
      },
      {
        "kind": "heading",
        "text": "9.6.1 Contrôle complet",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Toute{/g} la livraison contrôlée — coûteux (ex. kits à démonter/assembler). Justifié notamment si : - premier achat / fournisseur non éprouvé - défauts graves antérieurs - mauvaise impression à l'arrivée - biens très chers / haute qualité exigée - forte dépendance à la qualité reçue"
      },
      {
        "kind": "paragraph",
        "text": "But : éviter la répétition d'erreurs et la perte de confiance clients."
      },
      {
        "kind": "heading",
        "text": "9.6.2 Contrôles par échantillonnage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La fiabilité du fournisseur contribue à définir le plan, avec les exigences et conséquences d’un défaut. Une certification ne remplace pas à elle seule les contrôles convenus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Improvisé (spontané){/g} — non planifié, là où c'est le plus simple : - recomptage partiel - soulever le haut pour voir le bas - pesage partiel - ouvrir une unité pour vérifier le contenu"
      },
      {
        "kind": "paragraph",
        "text": "{g}Planifié{/g} — quantité et technique prédéfinies par la qualité ; résultats discutés avec le fournisseur → améliorations. Simple ou multiple."
      },
      {
        "kind": "paragraph",
        "text": "{g}Échantillonnage simple{/g} Ex. : 2 unités par livraison, ou 1 livraison sur 2. Ou {g}plans d'échantillonnage{/g} : - grandeur du {g}lot{/g} - {g}n{/g} = quantité prélevée - {g}Tol n{/g} = défauts autorisés - {g}niveau de qualité{/g} (1–3 ; plus bas = plus strict) - {g}niveau de contrôle{/g} : approfondi / normal / sommaire (quantité contrôlée)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Échantillonnage multiple{/g} Plusieurs prélèvements ; tableau : {g}Refuser{/g} / {g}Poursuivre{/g} / {g}Accepter{/g}. On continue tant qu'on est en « poursuivre »."
      },
      {
        "kind": "paragraph",
        "text": "Ex. pratique (palette 980 paquets de vis, lots de 30) : - défauts cumulés 1 → poursuivre - 1 → poursuivre - 2 → poursuivre - 3 → poursuivre - 3 → {g}accepter{/g} Total testé : 150 · défectueux : 3"
      },
      {
        "kind": "heading",
        "text": "9.7 Contrôle du fonctionnement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrôle opérationnel : complet ou par échantillonnage. Nécessaire si marchandises sensibles. Rudimentaire (allumer) ou complet (banc d'essai). Critères : entreprise et/ou loi."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : lampe de chevet = allumer ; composants électroniques = montage sur banc de test."
      },
      {
        "kind": "paragraph",
        "text": "Entre entreprises certifiées : souvent le fournisseur s'engage par écrit à contrôler avant livraison → destinataire peut s'en dispenser."
      }
    ],
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Assurance qualité{/g} — Organisation qui donne confiance dans la capacité à répondre aux exigences."
      },
      {
        "kind": "paragraph",
        "text": "{g}Caractéristique{/g} — Propriété mesurable ou observable d’un article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conformité{/g} — Satisfaction d’une exigence définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle complet{/g} — Vérification de toutes les unités du lot."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle visuel{/g} — Vérification de critères observables avec la méthode définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Échantillon{/g} — Partie du lot choisie pour un contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exigence{/g} — Critère attendu tel qu’il est défini au dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Libération{/g} — Autorisation de mettre le lot à disposition après le contrôle prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot non conforme{/g} — Lot qui ne satisfait pas aux règles d’acceptation applicables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mesure{/g} — Détermination d’une valeur avec un instrument, une méthode et une unité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Plan de contrôle{/g} — Description des critères, prélèvements et règles de décision."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tolérance{/g} — Intervalle ou écart admis autour de la valeur de référence."
      }
    ],
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-maths-fiche-1",
    "kind": "maths",
    "prompt": "On inspecte 45 pièces. Quatre sont non conformes. Combien sont conformes à ce contrôle ?",
    "answer": "41 pièces.",
    "calculation": "45 − 4 = 41.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un diamètre est de 24,8 mm et la valeur de référence de 25,0 mm. Calculez l’écart absolu.",
    "answer": "0,2 mm.",
    "calculation": "25,0 − 24,8 = 0,2 mm.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une fiche fixe 80 ± 2 mm. Donnez les deux limites.",
    "answer": "78 et 82 mm.",
    "calculation": "80 − 2 = 78 mm. 80 + 2 = 82 mm.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le contrôle prend 75 secondes par pièce. Donnez la durée pour huit pièces, en minutes.",
    "answer": "Dix minutes.",
    "calculation": "8 × 75 = 600 s = 10 min.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-maths-fiche-5",
    "kind": "maths",
    "prompt": "Neuf unités sur un échantillon de 180 ont un écart. Calculez la part constatée dans l’échantillon.",
    "answer": "5 %.",
    "calculation": "9 ÷ 180 × 100 = 5 %.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-309-maths-fiche-6",
    "kind": "maths",
    "prompt": "Deux lots testés donnent 12 écarts sur 300 et 8 sur 100. Calculez la proportion cumulée.",
    "answer": "5 %.",
    "calculation": "(12 + 8) ÷ (300 + 100) × 100 = 5 %.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-309-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence entre assurance qualité et contrôle d’entrée ?",
    "answer": "L’assurance organise la qualité. Le contrôle d’entrée conçoit ou réalise des vérifications sur les livraisons.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-verification-fiche-2",
    "kind": "verification",
    "prompt": "Qu’est-ce qu’un critère mesurable ?",
    "answer": "Un critère associé à une méthode d’observation, une unité si nécessaire et une règle de décision.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi définir l’échantillon à l’avance ?",
    "answer": "Pour appliquer le même plan et limiter les biais de sélection.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que faut-il consigner avec une mesure ?",
    "answer": "Lot, critère, valeur, unité, référence de contrôle et suite éventuelle.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-verification-fiche-5",
    "kind": "verification",
    "prompt": "Une certification suffit-elle à supprimer le contrôle prévu ?",
    "answer": "Le contrôle change seulement selon le plan et les responsabilités applicables.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-verification-fiche-6",
    "kind": "verification",
    "prompt": "Que sépare un stock bloqué d’un stock libéré ?",
    "answer": "La décision autorisée d’utiliser ou de distribuer le lot.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une pièce est juste à la limite annoncée. Comment décidez-vous ?",
    "answer": "Vérifier l’intervalle, la méthode, l’instrument et la règle d’acceptation avant de conclure.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le lot arrive sans document demandé au plan de contrôle. Quelle suite ?",
    "answer": "Consigner la pièce manquante, maintenir le statut approprié et demander le document.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-situation-fiche-3",
    "kind": "situation",
    "prompt": "Les pièces contrôlées proviennent toutes du carton ouvert d’abord. Pourquoi le signaler ?",
    "answer": "Ce choix peut biaiser le résultat. Appliquer le plan d’échantillonnage prévu.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-309-situation-fiche-4",
    "kind": "situation",
    "prompt": "Deux mesures différentes sont relevées sur la même pièce. Que vérifiez-vous ?",
    "answer": "Vérifier procédure, unité, instrument et conditions, puis transmettre l’écart avec les relevés.",
    "module": "309",
    "revision": "309-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
