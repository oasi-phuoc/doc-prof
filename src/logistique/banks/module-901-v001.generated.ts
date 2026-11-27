import type { LogistiqueUnit } from '../approved-banks'

export const module901 = [
  {
    "id": "log-901-objectifs-apercu",
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
          "Citer les {g}4 phases{/g} de gestion d'un projet logistique et le lien avec le PDCA",
          "Expliquer les {g}objectifs / résultats{/g} et les types de {g}faisabilité{/g}",
          "Décrire les principes d'une bonne {g}planification{/g} et d'une {g}exécution{/g} maîtrisée",
          "Justifier l'importance de l'{g}évaluation{/g} finale (théorie ↔ réalité, FICO)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 901",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Cadrer un projet logistique et comparer les solutions selon leur faisabilité.",
          "Construire un planning avec des dépendances, des responsables et une marge.",
          "Suivre les écarts, puis comparer délais, coûts et résultats pour tirer des enseignements."
        ]
      }
    ],
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. Planifier et évaluer les projets logistiques",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les entreprises cherchent clients et projets (marketing). Mission du logisticien : bien gérer les tâches logistiques. Tous les projets ne réussissent pas · facteurs souvent ambigus → {g}étude de faisabilité{/g} pour une vue d'ensemble."
      },
      {
        "kind": "paragraph",
        "text": "{g}Phases éprouvées{/g} (rappel cycle {g}PDCA{/g}, module {g}506{/g}) : 1. Étude de faisabilité 2. Planification du projet 3. Exécution du projet 4. Évaluation du projet"
      },
      {
        "kind": "heading",
        "text": "1.1 Étude de faisabilité (Feasibility Study)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/900/901/cfc/log-901-notions-1-v001.svg",
        "alt": "Options. Comparer deux implantations. Critères. Capacité, sécurité et coûts. Décision. Documenter le choix.",
        "caption": "Le choix s’appuie sur des critères observables et un mandat validé."
      },
      {
        "kind": "paragraph",
        "text": "Analyser les solutions possibles · identifier les risques · estimer les chances de réussite. Plus le projet est complexe, plus l'étude l'est."
      },
      {
        "kind": "paragraph",
        "text": "Vérifie si les solutions atteignent les {g}conditions cadres{/g} (logistique, services, production…). L'évaluation économique (avantages pour le client) n'en fait pas toujours partie · souvent via {g}analyse coûts-bénéfices{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Objectifs",
          "Résultats"
        ],
        "rows": [
          [
            "Estimer les investissements",
            "Analyser / évaluer les solutions"
          ],
          [
            "Assurer la qualité",
            "Documenter opportunités et risques"
          ],
          [
            "Identifier les risques",
            "Préconiser une décision"
          ],
          [
            "Identifier la solution optimale",
            ""
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Petits projets : solution rapide, peu de ressources · étude légère. Grands défis / longues ressources → vérifier :"
      },
      {
        "kind": "table",
        "headers": [
          "Faisabilité",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Technique{/g}",
            "Réalisable ? propriétés des matériaux…"
          ],
          [
            "{g}Économique{/g}",
            "Moyens de l'investisseur · investir avant paiement client · marge à la fin"
          ],
          [
            "{g}Politique{/g}",
            "Parties prenantes (collab., fournisseurs, clients) · culturel / éthique / sociopolitique"
          ],
          [
            "{g}Juridique{/g}",
            "Conformité réglementaire"
          ],
          [
            "{g}Organisationnelle{/g}",
            "Organisation capable de planifier, piloter, surveiller"
          ],
          [
            "{g}Ressources{/g}",
            "Personnel, matériel, machines, savoir-faire (lié au financier / orga.)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "1.2 Planification du projet",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/900/901/cfc/log-901-notions-2-v001.svg",
        "alt": "Diagnostic jours 1 et 2. Installation jours 3 à 8 et formation jours 3 à 6. Le contrôle attend les deux activités et occupe les jours 9 et 10.",
        "caption": "L’installation fixe la date du contrôle. Les tâches s’étendent sur dix jours hors réserve."
      },
      {
        "kind": "paragraph",
        "text": "Démarre {g}après{/g} faisabilité OK {g}et{/g} mandat {g}écrit{/g} (donneur / preneur d'ordre)."
      },
      {
        "kind": "paragraph",
        "text": "Inscrire les activités sur un calendrier avec durée, responsable, ressources, dépendances et critères de fin. Repérer les tâches qui fixent le délai du projet, puis prévoir une réserve adaptée aux risques."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple{/g} : après un diagnostic de 2 jours, une installation de 6 jours et une formation de 4 jours peuvent se dérouler en parallèle. Le contrôle de 2 jours attend les deux. La durée minimale de ce planning est de 10 jours."
      },
      {
        "kind": "heading",
        "text": "1.3 Exécution du projet",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Communication{/g} centrale · collaborateurs = ressource clé. Points de situation = positifs (amélioration), pas « contrôle excessif ». Écarts / problèmes : détecter tôt, traiter vite · procédure connue de l'équipe."
      },
      {
        "kind": "paragraph",
        "text": "Le responsable {g}documente{/g} les activités → pistes d'amélioration / capitalisation pour le prochain mandat."
      },
      {
        "kind": "heading",
        "text": "1.4 Évaluation du projet",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dès la fin : objectifs / résultats atteints ? Comparer données théoriques (faisabilité) ↔ {g}réalité{/g}. Pas forcément corriger a posteriori · surtout apprendre pour les {g}futurs{/g} mandats."
      },
      {
        "kind": "paragraph",
        "text": "Comparer le coût réel au budget sur un périmètre identique, avec l'appui de FICO. Présenter au mandant les résultats, les écarts, leurs causes et les actions à suivre."
      }
    ],
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Mandat{/g} — Accord qui précise le but, le périmètre, les responsabilités et les résultats attendus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Périmètre{/g} — Ensemble des activités, sites et livrables inclus dans le projet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Faisabilité{/g} — Capacité d'une solution à remplir les conditions fixées avec les ressources et contraintes réelles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Livrable{/g} — Résultat vérifiable à remettre pour une étape du projet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Partie prenante{/g} — Personne ou organisation qui contribue au projet ou subit ses effets."
      },
      {
        "kind": "paragraph",
        "text": "{g}Jalon{/g} — Point de validation ou de décision placé dans le calendrier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dépendance{/g} — Relation par laquelle le début ou la fin d'une tâche dépend d'une autre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réserve{/g} — Marge prévue pour absorber un aléa de coût ou de délai."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chemin critique{/g} — Suite de tâches qui fixe la durée minimale du projet selon le planning."
      },
      {
        "kind": "paragraph",
        "text": "{g}Risque{/g} — Événement incertain susceptible d'influencer un objectif."
      },
      {
        "kind": "paragraph",
        "text": "{g}Écart budgétaire{/g} — Différence entre le montant constaté et la référence budgétaire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Retour d'expérience{/g} — Bilan documenté qui aide à améliorer un projet ultérieur."
      }
    ],
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le projet débute par 2 jours d'analyse. Viennent ensuite 4 jours de préparation, puis 3 jours de tests. Les étapes sont successives. Quelle durée hors réserve ?",
    "answer": "9 jours",
    "calculation": "2 + 4 + 3 = 9.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-2",
    "kind": "maths",
    "prompt": "Après 2 jours de diagnostic, une tâche de 6 jours et une de 4 jours se font en parallèle. Il faut ensuite 2 jours pour contrôler les deux résultats. Quelle durée au plus tôt ?",
    "answer": "10 jours",
    "calculation": "2 + max(6, 4) + 2 = 10.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le budget prévoit CHF 14 000. Les dépenses totalisent CHF 12 800 et un engagement restant vaut CHF 1 750. Calculez le coût final estimé et l'écart au budget.",
    "answer": "CHF 14 550, dépassement CHF 550",
    "calculation": "12 800 + 1 750 = 14 550. 14 550 − 14 000 = 550.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-4",
    "kind": "maths",
    "prompt": "Avant changement, le processus prend 18 min par commande. Le pilote indique 15 min. Quel gain relatif au dixième ?",
    "answer": "16,7 %",
    "calculation": "(18 − 15) ÷ 18 × 100 ≈ 16,7.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un investissement de CHF 9 000 procure CHF 3 600 d'économies annuelles constantes. Calculez le retour simple en années, hors actualisation.",
    "answer": "2,5 ans",
    "calculation": "9 000 ÷ 3 600 = 2,5.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un projet de 16 jours prévoit une réserve de délai égale à 12,5 % de cette durée. Quel délai annoncer réserve incluse ?",
    "answer": "18 jours",
    "calculation": "16 × 0,125 = 2. 16 + 2 = 18.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-maths-fiche-7",
    "kind": "maths",
    "prompt": "On attend 95 % de commandes sans erreur sur 240. On en constate 222 sans erreur. Combien en manquent pour atteindre l'objectif ?",
    "answer": "6 commandes",
    "calculation": "240 × 0,95 = 228. 228 − 222 = 6.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles sont les quatre phases du module ?",
    "answer": "Étude de faisabilité, planification, exécution, évaluation.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi fixer des critères d'acceptation lors du mandat ?",
    "answer": "Pour rendre le résultat attendu vérifiable et décider sur des éléments observables.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-3",
    "kind": "verification",
    "prompt": "Donnez deux dimensions de faisabilité et une question pour chacune.",
    "answer": "Par exemple technique : le matériel est-il compatible ? Organisationnelle : peut-on assurer le service pendant le changement ?",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelles informations ajouter à une liste de tâches pour obtenir un planning utile ?",
    "answer": "Durées et dates, dépendances, responsables, ressources, jalons et réserve appropriée.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi identifier le chemin critique ?",
    "answer": "Un retard sur une tâche critique peut repousser le projet si aucune adaptation ne compense ce retard.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-verification-fiche-6",
    "kind": "verification",
    "prompt": "Que comparer lors de l'évaluation finale ?",
    "answer": "Objectifs, coûts et délais prévus, résultats mesurés, qualité du service et raisons des écarts.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le site veut déplacer la réception pendant l'exploitation. Décrivez une étude de faisabilité courte.",
    "answer": "Comparer deux configurations, mesurer capacité et accès, vérifier sécurité et continuité, estimer coûts et ressources, puis documenter une décision et ses conditions.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-situation-fiche-2",
    "kind": "situation",
    "prompt": "L'installation d'un rayonnage prend du retard et le test en dépend. Comment réagir ?",
    "answer": "Revoir le planning et le chemin critique, confirmer le délai, évaluer le décalage et les tâches réalisables en parallèle, puis informer le mandant et faire valider l'ajustement.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le projet est livré à l'heure. Les coûts dépassent le budget et les erreurs restent au niveau initial. Proposez un bilan.",
    "answer": "Comparer les trois objectifs avec des mesures homogènes, expliquer les écarts documentés, valider les actions de suivi et conserver les enseignements pour le projet suivant.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-901-situation-fiche-4",
    "kind": "situation",
    "prompt": "Vous remplacez une procédure de préparation et souhaitez éviter une conclusion fondée sur un seul jour. Que mesurez-vous ?",
    "answer": "Définir une période avant et après, noter volumes et mix, suivre cadence et erreurs selon les mêmes règles, puis comparer avec les critères du mandat.",
    "module": "901",
    "revision": "901-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
