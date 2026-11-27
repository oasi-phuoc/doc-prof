import type { LogistiqueUnit } from '../approved-banks'

export const module506 = [
  {
    "id": "log-506-objectifs-apercu",
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
          "Distinguer {g}MQ{/g} et {g}AQ{/g} (et du contrôle qualité produit)",
          "Expliquer {g}Kaizen{/g}, le cycle {g}PDCA{/g} et le {g}PAC{/g}",
          "Citer les {g}7 mudas{/g} et le principe {g}ISO 9001{/g} (audits inclus)",
          "Relier {g}traçabilité{/g}, {g}économie circulaire{/g} et {g}IP{/g} à la qualité / sécurité"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 506",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer management, assurance et contrôle de la qualité.",
          "Documenter une non-conformité et retrouver le lot concerné.",
          "Interpréter un indicateur avant et après une action d’amélioration."
        ]
      }
    ],
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Assurance qualité (AQ) dans la production",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Suite du module {g}501{/g} : la {g}qualité{/g} est un objectif central — la maintenir et l'{g}améliorer{/g}."
      },
      {
        "kind": "heading",
        "text": "6.1 MQ vs AQ",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "6.1.1 Management de la qualité (MQ)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Définir la {g}structure{/g} pour atteindre la qualité : types/orga de fabrication, flux matériel, tâches → souvent dans un {g}manuel qualité{/g}."
      },
      {
        "kind": "paragraph",
        "text": "👉 Le MQ s'applique à {g}toute{/g} l'entreprise (tous processus influençant la satisfaction client), pas seulement au produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. EnterSite{/g} — cartouche GT10-TN221 : documentation écrite (fournisseurs, MP, type/orga, flux) + tâches collaborateurs."
      },
      {
        "kind": "heading",
        "text": "6.1.2 Assurance qualité (AQ)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Après le MQ : {g}détecter et éliminer{/g} à temps les influences négatives · garantir le respect des directives MQ. L’assurance qualité organise la confiance dans le respect des exigences. Le contrôle qualité vérifie leur réalisation selon le plan prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Après prod. + expédition : qualité / satisfaction / coûts OK ? Oui → MQ validée · Non → cycle d'amélioration."
      },
      {
        "kind": "heading",
        "text": "6.2 Méthodes MQ / AQ",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/506/cfc/log-506-notions-2-v001.svg",
        "alt": "Constater. Exigence et résultat. Agir. Cause et action. Vérifier. Effet dans le temps.",
        "caption": "Le suivi porte sur le critère mesuré et sa méthode."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Kaizen",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Kai* = changement · *zen* = pour le mieux. Japon / auto (~1980) · amélioration {g}progressive{/g}. Outil clé : cycle {g}PDCA{/g}."
      },
      {
        "kind": "heading",
        "text": "6.2.2 Cycle PDCA (Shewhart)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Phase",
          "Sens"
        ],
        "rows": [
          [
            "{g}PLAN{/g}",
            "Problème · ressources · solution · conditions · objectifs"
          ],
          [
            "{g}DO{/g}",
            "Mettre en œuvre · rôles clairs · communication · imprévus possibles"
          ],
          [
            "{g}CHECK{/g}",
            "Phase {g}critique{/g} · ce qui marche · points faibles · causes"
          ],
          [
            "{g}ACT{/g}",
            "Évaluer · poursuivre si objectifs OK · {g}remettre en question{/g} en continu"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Amélioration constante · productivité / efficacité ↑."
      },
      {
        "kind": "heading",
        "text": "6.2.3–6.2.5 Processus d'amélioration continue (PAC)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Amélioration constante produits / process / services · {g}petites{/g} mesures rapides · ancré dans la culture."
      },
      {
        "kind": "paragraph",
        "text": "Démarche type : trier · éviter · propreté · ménage · ordre · simplicité · standardisation. Domaines : {g}bureau{/g} (ordre → moins d'erreurs) · {g}fabrication / logistique{/g} (distances ↓ · accès · flux d'info). Effets : potentiel collaborateurs · compétitivité · emplois. Facteurs clés : culture + bonne gestion."
      },
      {
        "kind": "heading",
        "text": "6.2.6 Muda (gaspillage)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Activités {g}sans valeur ajoutée{/g} · souvent « cécité professionnelle » → analyse (idéalement regard externe)."
      },
      {
        "kind": "paragraph",
        "text": "{g}7 mudas :{/g} 1. {g}Surstockage{/g} / stock inutile 2. {g}Surproduction{/g} 3. {g}Transport{/g} / déplacement inutile 4. {g}Temps d'attente{/g} 5. {g}Erreurs{/g} / qualité insuffisante (rebuts, reprises) 6. {g}Surprocessing{/g} (traitements inutiles) 7. {g}Sous-utilisation{/g} des compétences"
      },
      {
        "kind": "paragraph",
        "text": "Démarche : identifier → évaluer (bases uniformes · {g}Pareto{/g} 20/80) → contre-mesures → prioriser (court/moyen/long terme · responsables · dates · contrôle). Impliquer les collaborateurs."
      },
      {
        "kind": "heading",
        "text": "6.2.7 ISO 9001",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Certification = confirmation formelle MQ/AQ. - {g}ISO 9001{/g} : systèmes de management de la qualité - {g}ISO 14001{/g} : management environnemental"
      },
      {
        "kind": "paragraph",
        "text": "Suisse : {g}SN EN ISO 9001:2015{/g} (norme suisse + européenne + ISO · version 2015)."
      },
      {
        "kind": "paragraph",
        "text": "Couvre : organisation SMQ · personnel / infra · réalisation produit · mesure / analyse / amélioration. {g}+{/g} adéquation presta/qualité · satisfaction client · perf. · coûts ↓ · com. · moral · image. Coût élevé → avantages doivent le justifier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Audits :{/g} interne (formés en interne) · externe (organisme indépendant) avant certification."
      },
      {
        "kind": "heading",
        "text": "6.3 Ressources et efficacité énergétique",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "6.3.1 Économie circulaire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ressources limitées · métaux rares · émissions → repenser recyclage et flux. Maximiser l'efficacité des ressources · avantage concurrentiel."
      },
      {
        "kind": "paragraph",
        "text": "{g}Urban Mining{/g} : récupérer matières (métaux, plastiques) depuis appareils urbains mis au rebut (ex. démarche type Bosch)."
      },
      {
        "kind": "paragraph",
        "text": "Idéal : zéro déchet · substances réintroduites · cycles matériaux/énergie ralentis et resserrés · cadre politique uniforme."
      },
      {
        "kind": "paragraph",
        "text": "👉 Réduire déchets · recycler · allonger le cycle de vie (réemploi / transformation)."
      },
      {
        "kind": "heading",
        "text": "6.4 Traçabilité",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/506/cfc/log-506-notions-1-v001.svg",
        "alt": "Composants. Références et lots. Opérations. Dates et contrôles. Sorties. Dossiers de destination.",
        "caption": "Les liens entre étapes aident à délimiter un écart."
      },
      {
        "kind": "paragraph",
        "text": "Identifier le produit et les étapes nécessaires à la traçabilité. Les exigences dépendent du produit, du secteur et du périmètre du système de management."
      },
      {
        "kind": "paragraph",
        "text": "Documenter fabricants / fournisseurs / intermédiaires à chaque étape."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pourquoi ?{/g} En cas de défaut : identifier composant, fournisseur, autres produits touchés → réagir vite. 👉 Qualité {g}et{/g} sécurité produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. qualité :{/g} capteurs pression pneus bas de gamme → fausses alertes → coût / image > économie achat. {g}Ex. sécurité :{/g} plaquettes de frein défectueuses → retrouver véhicules / propriétaires → rappel."
      },
      {
        "kind": "heading",
        "text": "6.5 Instructions de procédure (IP)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Quand · dans quelle situation · par qui · de quelle manière. Schéma + responsables + outils. Indispensables pour ISO 9001 · contrôlées en audit · doivent être {g}appliquées{/g} au quotidien."
      },
      {
        "kind": "heading",
        "text": "6.6 Autres méthodes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Nombreux outils AQ dans le monde (sélection non exhaustive dans la formation) · Kaizen, PDCA, PAC, Muda, ISO restent des piliers."
      }
    ],
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Action corrective{/g} — Action sur une cause pour prévenir une répétition d’écart."
      },
      {
        "kind": "paragraph",
        "text": "{g}Assurance qualité{/g} — Partie du management qui donne confiance dans le respect des exigences."
      },
      {
        "kind": "paragraph",
        "text": "{g}Audit{/g} — Vérification structurée à partir de critères et de preuves."
      },
      {
        "kind": "paragraph",
        "text": "{g}Critère{/g} — Exigence ou condition qui aide à juger un résultat."
      },
      {
        "kind": "paragraph",
        "text": "{g}Instruction{/g} — Document qui précise les règles d’une opération et son champ d’application."
      },
      {
        "kind": "paragraph",
        "text": "{g}Management de la qualité{/g} — Pilotage de l’organisation concernant la qualité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Non-conformité{/g} — Non-satisfaction d’une exigence spécifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pareto{/g} — Mise en ordre des contributions pour distinguer les catégories dominantes."
      },
      {
        "kind": "paragraph",
        "text": "{g}PDCA{/g} — Cycle planifier, réaliser, vérifier et ajuster."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traçabilité{/g} — Possibilité de suivre un lot au moyen des identifiants et événements enregistrés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle qualité{/g} — Vérification du respect des exigences prévues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Version{/g} — État identifié d’un document, d’une donnée ou d’une procédure."
      }
    ],
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-maths-fiche-1",
    "kind": "maths",
    "prompt": "Sur 250 pièces inspectées, dix présentent un écart. Calculez le taux.",
    "answer": "4 %.",
    "calculation": "10 ÷ 250 × 100 = 4 %.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-maths-fiche-2",
    "kind": "maths",
    "prompt": "Trois causes recensent 12, 7 et 1 cas. Calculez la part de la première.",
    "answer": "60 %.",
    "calculation": "12 ÷ (12 + 7 + 1) × 100 = 60 %.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une unité est tracée dans 8 dossiers distincts. Quatre restent à vérifier. Combien ont été vérifiés ?",
    "answer": "Quatre dossiers.",
    "calculation": "8 − 4 = 4.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-maths-fiche-4",
    "kind": "maths",
    "prompt": "L’énergie consommée passe de 90 à 81 kWh pour le même volume. Calculez la baisse.",
    "answer": "9 kWh, soit 10 %.",
    "calculation": "90 − 81 = 9 kWh. 9 ÷ 90 × 100 = 10 %.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-maths-fiche-5",
    "kind": "maths",
    "prompt": "Deux séries donnent 4 écarts sur 100 et 18 écarts sur 300. Calculez le taux cumulé.",
    "answer": "5,5 %.",
    "calculation": "(4 + 18) ÷ (100 + 300) × 100 = 5,5 %.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que permet la traçabilité d’un défaut ?",
    "answer": "Retrouver les lots et opérations potentiellement concernés grâce aux identifiants.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que vérifie le contrôle qualité ?",
    "answer": "La conformité selon le critère, la méthode et la décision prévue.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que signifient les étapes PDCA ?",
    "answer": "Planifier, réaliser, vérifier et ajuster.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel est le lien entre action corrective et non-conformité ?",
    "answer": "L’action vise une cause identifiée pour éviter la répétition.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi vérifier la version d’une instruction ?",
    "answer": "Pour appliquer la règle valable dans le périmètre et à la date concernés.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un lot est lié à une mesure non conforme. Quelle suite ?",
    "answer": "Repérer la trace, sécuriser le statut et transmettre les faits selon la procédure.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux causes représentent la majorité des reprises. Comment utilisez-vous ce résultat ?",
    "answer": "Comparer fréquence et impact, choisir l’action prioritaire et suivre son résultat.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-506-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une instruction change après l’ouverture d’un ordre. Que vérifiez-vous ?",
    "answer": "L’application de la révision à cet ordre et la diffusion aux postes concernés.",
    "module": "506",
    "revision": "506-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
