import type { LogistiqueUnit } from '../approved-banks'

export const module506 = [
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
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-qualite-photo-v002.webp",
        "alt": "Une opératrice relève la dimension d’une pièce au pied à coulisse.",
        "caption": "Le système qualité fixe le critère. Le contrôle vérifie le résultat sur la pièce."
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
        "kind": "image",
        "src": "/assets/logistique/500/506/cfc/log-506-pdca-schema-v003.webp",
        "alt": "Le cycle Planifier, Faire, Vérifier, Agir applique un contrôle à un lot avant de comparer les écarts et ajuster la procédure.",
        "caption": "Mesurez le résultat d’un changement avant de le retenir ou de relancer un cycle."
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
        "src": "/assets/logistique/500/506/cfc/log-506-trace-photo-v002.webp",
        "alt": "Une personne contrôle et scanne l’étiquette d’une caisse terminée.",
        "caption": "Associez le contrôle à l’identifiant du lot afin de retrouver la décision."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "6. Assurance qualité dans la production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 MQ vs AQ",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-qualite-photo-v002.webp",
        "alt": "Une opératrice relève la dimension d’une pièce au pied à coulisse.",
        "caption": "Le système qualité fixe le critère. Le contrôle vérifie le résultat sur la pièce."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}management de la qualité (MQ){/g} fixe les objectifs, organise les responsabilités et améliore les processus. L’{g}assurance qualité (AQ){/g} réunit les mesures qui permettent de vérifier que le processus peut atteindre la qualité exigée. Le {g}contrôle{/g} examine le résultat concret."
      },
      {
        "kind": "heading",
        "text": "6.2 Méthodes MQ / AQ",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/506/cfc/log-506-pdca-schema-v003.webp",
        "alt": "Le cycle Planifier, Faire, Vérifier, Agir applique un contrôle à un lot avant de comparer les écarts et ajuster la procédure.",
        "caption": "Mesurez le résultat d’un changement avant de le retenir ou de relancer un cycle."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}Kaizen{/g} désigne les améliorations continues. Le {g}PDCA{/g} enchaîne {g}Planifier{/g}, {g}Faire{/g}, {g}Vérifier{/g}, {g}Agir{/g}. Un {g}PAC{/g} organise le suivi. Le {g}Muda{/g} désigne le gaspillage, comme le transport inutile ou le rebut. {g}ISO 9001{/g} concerne les exigences d’un système de management de la qualité. Une certification de système est distincte d’un contrôle de lot."
      },
      {
        "kind": "heading",
        "text": "6.3 Ressources et efficacité énergétique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mesurez les ressources par unité produite sur un périmètre constant. L’{g}économie circulaire{/g} cherche à prolonger l’usage des matériaux grâce à la prévention, au réemploi, à la réparation et au recyclage."
      },
      {
        "kind": "heading",
        "text": "6.4 Traçabilité et instructions de procédure",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/506/cfc/log-506-trace-photo-v002.webp",
        "alt": "Une personne contrôle et scanne l’étiquette d’une caisse terminée.",
        "caption": "Associez le contrôle à l’identifiant du lot afin de retrouver la décision."
      },
      {
        "kind": "paragraph",
        "text": "La {g}traçabilité{/g} permet de retrouver lot, date, opération et résultat. Une {g}instruction de procédure (IP){/g} indique qui fait quoi, dans quel ordre et avec quels critères. Lors d’un écart, consignez la preuve, identifiez la cause, mettez en place une action et contrôlez son effet."
      }
    ],
    "module": "506",
    "revision": "506-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
