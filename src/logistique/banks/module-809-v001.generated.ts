import type { LogistiqueUnit } from '../approved-banks'

export const module809 = [
  {
    "id": "log-809-objectifs-apercu",
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
          "Définir l'{g}intralogistique{/g} et citer ses domaines d'activité",
          "Expliquer les {g}objectifs{/g} du poste de contrôle (indicateurs + visualisation)",
          "Décrire son {g}rôle{/g} (évaluation / recommandations vs décision humaine)",
          "Citer les {g}exigences{/g} envers les collaborateurs du poste de contrôle"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 809",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Repérer les flux internes et les données utiles à la gestion de l'entrepôt.",
          "Comparer les prévisions, l'activité réelle et les alertes au poste de contrôle.",
          "Choisir une réponse opérationnelle adaptée puis confirmer le retour à la normale."
        ]
      }
    ],
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "9. Poste de contrôle",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "9.1 Intralogistique",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/809/commun/log-809-notions-1-v001.svg",
        "alt": "Réception. Livraisons et contrôles. Stockage. Mouvements et positions. Expédition. Préparation et départs.",
        "caption": "Les événements du WMS suivent les mouvements entre zones."
      },
      {
        "kind": "paragraph",
        "text": "Terme d'origine allemande (manutention / stockage). {g}Logistique interne{/g} à l'entreprise : contrôler, exécuter et organiser le {g}flux de matériel{/g} interne."
      },
      {
        "kind": "paragraph",
        "text": "👉 Même domaine que le flux de matériel interne / micro-logistique · met en évidence la frontière {g}interne ↔ externe{/g}."
      },
      {
        "kind": "heading",
        "text": "9.1.1 Rôles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Réception et sortie · systèmes de stockage · transport · logiciel picking / tri · télématique, capteurs, robotique · logiciels métier · systèmes complets."
      },
      {
        "kind": "paragraph",
        "text": "👉 Harmoniser le plus grand nombre possible de domaines et de conditions."
      },
      {
        "kind": "heading",
        "text": "9.2 Le poste de contrôle",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le poste de contrôle centralise les données d'exploitation. Il peut utiliser un WMS ainsi que les mesures des équipements et les observations du terrain."
      },
      {
        "kind": "heading",
        "text": "9.2.1 Objectifs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Regrouper les {g}KPI{/g} d'intralogistique (saisie, évaluation, analyse récurrente), par ex. :"
      },
      {
        "kind": "list",
        "items": [
          "Volume / urgences en commissionnement",
          "Transports utilisés / actifs",
          "Capacité personnel (expédition, picking)",
          "Livraisons entrantes encore ouvertes",
          "Taux de prélèvement · volume prévu du jour"
        ]
      },
      {
        "kind": "paragraph",
        "text": "L'affichage des volumes, urgences et états facilite la détection d'une perturbation. Avant d'agir, confirmer la fraîcheur de la donnée et la zone touchée."
      },
      {
        "kind": "paragraph",
        "text": "Niveau technique du poste de contrôle → impact fort sur l'{g}efficacité{/g} des processus."
      },
      {
        "kind": "heading",
        "text": "9.2.2 Rôle",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/809/commun/log-809-notions-2-v001.svg",
        "alt": "Qualifier. Source, heure et impact. Coordonner. Informer et agir selon le rôle. Clôturer. Vérifier et consigner.",
        "caption": "L’équipe vérifie la réalité de l’écart et la reprise du flux."
      },
      {
        "kind": "paragraph",
        "text": "Selon l'infrastructure : visualisation · planification · optimisation · prévisions vs réalité · limites de performance · controlling · état du système."
      },
      {
        "kind": "paragraph",
        "text": "Le responsable peut ↑ / modifier ressources ou mesures organisationnelles. En général le poste de contrôle {g}évalue, prépare et visualise{/g} — il ne pilote pas toujours directement. Particularité : les collaborateurs {g}associent{/g} les recommandations à leur expérience · {g}eux{/g} décident des mesures finales."
      },
      {
        "kind": "heading",
        "text": "9.2.3 Exigences collaborateurs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Pivot de l'intralogistique · formation logistique solide + expérience · bonnes compétences {g}IT / Excel{/g} · pensée analytique, process, prévoyante · {g}travail en équipe{/g} fréquent."
      },
      {
        "kind": "heading",
        "text": "9.2.4 Conclusion",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Instrument de {g}contrôle opérationnel{/g} en intralogistique : soutient planification et pilotage · visualise / surveille en continu · détecte écarts objectifs ↔ réalité · propose des {g}recommandations d'action{/g}."
      }
    ],
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Intralogistique{/g} — Organisation des flux de marchandises et des informations à l'intérieur du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Poste de contrôle{/g} — Fonction qui rassemble les données et aide à coordonner les décisions de l'exploitation."
      },
      {
        "kind": "paragraph",
        "text": "{g}WMS{/g} — Système logiciel dédié à la gestion des opérations d'entrepôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur{/g} — Mesure définie pour suivre l'état ou la performance d'un processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Capacité{/g} — Quantité de travail réalisable avec les moyens disponibles sur une période."
      },
      {
        "kind": "paragraph",
        "text": "{g}File d'attente{/g} — Ensemble d'unités ou de tâches en attente d'une opération."
      },
      {
        "kind": "paragraph",
        "text": "{g}Alerte{/g} — Signal à traiter selon sa gravité et la procédure prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Écart{/g} — Différence entre une valeur mesurée et une référence."
      },
      {
        "kind": "paragraph",
        "text": "{g}Priorité{/g} — Ordre de traitement fixé en fonction de critères tels que sécurité et échéance."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cadence{/g} — Quantité traitée par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mode dégradé{/g} — Organisation temporaire prévue pour maintenir certaines activités pendant un incident."
      },
      {
        "kind": "paragraph",
        "text": "{g}Escalade{/g} — Transmission d'un incident au niveau de responsabilité compétent."
      }
    ],
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-maths-fiche-1",
    "kind": "maths",
    "prompt": "Vous prévoyez 56 lignes de picking et 41 sont terminées. Combien restent à préparer ?",
    "answer": "15 lignes",
    "calculation": "56 − 41 = 15.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-maths-fiche-2",
    "kind": "maths",
    "prompt": "Deux opérateurs préparent chacun 28 lignes par heure pendant 2 h. Quelle quantité traitent-ils ?",
    "answer": "112 lignes",
    "calculation": "2 × 28 × 2 = 112.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le poste suit 35 livraisons attendues, dont 27 enregistrées au quai. Combien ne sont pas encore enregistrées ?",
    "answer": "8 livraisons",
    "calculation": "35 − 27 = 8.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le contrôle constate 20 palettes en attente. On en traite 6 et 4 nouvelles arrivent. Combien attendent maintenant ?",
    "answer": "18 palettes",
    "calculation": "20 − 6 + 4 = 18.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-maths-fiche-5",
    "kind": "maths",
    "prompt": "La cadence prévue vaut 80 unités/h et la cadence constatée 68. Quel écart relatif au plan observez-vous ?",
    "answer": "−15 %",
    "calculation": "(68 − 80) ÷ 80 × 100 = −15.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-809-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un quai résorbe un retard net de 12 colis/h après les nouvelles arrivées. Après combien d'heures un retard initial de 42 colis disparaît-il ?",
    "answer": "3 h 30",
    "calculation": "42 ÷ 12 = 3,5 h.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-809-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quels flux relèvent de l'intralogistique ?",
    "answer": "Par exemple la réception, les transferts, le stockage, la préparation et la mise à disposition à l'intérieur du site.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que compare un tableau de suivi lorsqu'il affiche un écart ?",
    "answer": "La mesure réelle et une valeur cible pour la même période, la même unité et le même processus.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi vérifier l'heure d'une alerte ?",
    "answer": "Elle aide à savoir si la donnée est récente, si la situation évolue et qui intervenait.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelle est la différence entre une recommandation et une décision ?",
    "answer": "La recommandation aide à choisir. La décision engage une action et relève d'un rôle autorisé.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-verification-fiche-5",
    "kind": "verification",
    "prompt": "Donnez un élément à inscrire à la clôture d'un incident.",
    "answer": "Par exemple l'heure de reprise, la cause constatée, l'action et l'indicateur revenu dans la plage prévue.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le tableau indique un convoyeur arrêté, mais l'équipe terrain le voit tourner. Que faites-vous ?",
    "answer": "Vérifier l'identifiant du matériel, l'heure et la source du signal; signaler l'incohérence et suivre la procédure avant d'écarter l'alerte.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux ordres atteignent le même seuil d'urgence et un seul opérateur est disponible. Comment fixer l'ordre ?",
    "answer": "Comparer sécurité, échéances, dépendances et ressources; faire confirmer la priorité selon la procédure et informer les personnes concernées.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-809-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le retard au quai augmente malgré le renfort. Proposez un suivi.",
    "answer": "Comparer arrivées et sorties sur la même durée, localiser le goulet, ajuster l'affectation ou le flux avec le responsable et mesurer le résultat.",
    "module": "809",
    "revision": "809-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
