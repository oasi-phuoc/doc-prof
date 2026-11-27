import type { LogistiqueUnit } from '../approved-banks'

export const module703 = [
  {
    "id": "log-703-objectifs-apercu",
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
          "Distinguer coûts de personnel {g}directs{/g} / {g}indirects{/g} et salaire / rémunération",
          "Expliquer des leviers de {g}réduction{/g} des coûts et les formes d'emploi",
          "Décrire les {g}trois piliers{/g} et calculer un ordre de grandeur brut → net",
          "Citer les droits/obligations {g}CO{/g} et les devoirs {g}LAA{/g} de prévention"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 703",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comprendre les dépenses de personnel du point de vue de l'employeur.",
          "Lire un exemple de décompte de salaire et distinguer prévoyance et autres assurances.",
          "Relier organisation du travail, obligations des parties et prévention des accidents."
        ]
      }
    ],
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. Coût du personnel",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les collaborateurs sont essentiels au succès — et génèrent des {g}coûts de personnel{/g}, souvent parmi les plus importants. Catégories (lien module {g}702{/g}) : salaires · prestations sociales · prestations spéciales (formation, gratifications…) · administration RH."
      },
      {
        "kind": "heading",
        "text": "3.1 Point de vue entreprise",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "Directs vs indirects",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Directs",
          "Indirects"
        ],
        "rows": [
          [
            "Salaire {g}brut{/g} / rémunération",
            "Équipement poste · recrutement"
          ],
          [
            "Cotisations retraite, maladie, chômage…",
            ""
          ],
          [
            "Primes vacances / Noël · gratifications",
            ""
          ],
          [
            "Frais pro (formation, déplacements)",
            ""
          ],
          [
            "Maintien salaire maladie",
            ""
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.1.1 Salaire vs rémunération",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Salaire{/g} : contrepartie du travail, qui peut par exemple être fixée au mois, à l'heure ou à la pièce.",
          "{g}Rémunération{/g} : terme plus large englobant notamment le salaire, les primes et les avantages convenus."
        ]
      },
      {
        "kind": "heading",
        "text": "3.1.2 Réduire les coûts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Jusqu'à ~{g}80 %{/g} des coûts totaux selon secteur. Leviers : {g}réserves{/g} (saisons) · ↓ heures supp. (compensation) · ↓ absentéisme · {g}externalisation{/g} (qualité à préserver, module {g}301{/g})."
      },
      {
        "kind": "heading",
        "text": "3.1.3 Fixes vs temporaires",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Emploi durable : relation de travail généralement à durée indéterminée; salaire et délais de congé à lire dans le contrat et les règles applicables. Mission temporaire : emploi direct à durée déterminée ou mission via une agence. L'activité indépendante relève d'un autre statut."
      },
      {
        "kind": "paragraph",
        "text": "Objectif employeur responsable : emploi durable · maîtriser les coûts court {g}et{/g} long terme."
      },
      {
        "kind": "heading",
        "text": "3.2 Point de vue collaborateur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/703/cfc/log-703-notions-1-v001.svg",
        "alt": "Brut. CHF 4 800. Retenues. CHF 510. Net. CHF 4 290.",
        "caption": "Le coût employeur ajoute ses propres charges au brut."
      },
      {
        "kind": "paragraph",
        "text": "{g}Brut{/g} = avant déductions légales · {g}net{/g} = versé."
      },
      {
        "kind": "heading",
        "text": "3.2.1 Trois piliers",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/703/cfc/log-703-notions-2-v001.svg",
        "alt": "1er pilier. AVS et AI, avec les PC. 2e pilier. Prévoyance professionnelle. 3e pilier. Prévoyance individuelle.",
        "caption": "Les trois piliers couvrent des besoins complémentaires."
      },
      {
        "kind": "table",
        "headers": [
          "Pilier",
          "Contenu"
        ],
        "rows": [
          [
            "{g}1{/g} Public",
            "AVS et AI, complétées par les PC selon les conditions."
          ],
          [
            "{g}2{/g} Professionnel",
            "Prévoyance professionnelle, avec prestations selon le plan et les données de la personne."
          ],
          [
            "{g}3{/g} Privé",
            "Facultatif · {g}3a{/g} (vieillesse / logement · déductible) · {g}3b{/g} (épargne / risques)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.2.2 Déductions sur le salaire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Selon la situation, le salaire brut peut être diminué notamment des cotisations AVS, AI, APG, AC, d'assurance contre les accidents non professionnels et de prévoyance professionnelle. Pour un décompte réel, contrôler les conditions et taux applicables à la période ainsi que le plan de prévoyance et les données du contrat."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple fictif mensuel{/g} : brut CHF 4 800, retenues CHF 510, net CHF 4 290."
      },
      {
        "kind": "paragraph",
        "text": "👉 Personnel ≠ seulement salaire : + {g}charges sociales{/g}."
      },
      {
        "kind": "heading",
        "text": "3.3 Droits et obligations (CO)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "",
          "Employeur",
          "Employé"
        ],
        "rows": [
          [
            "{g}Droits{/g}",
            "Prestation complète · fidélité · vérité · direction",
            "Revenu · emploi · expression · égalité"
          ],
          [
            "{g}Obligations{/g}",
            "Assistance · personnalité/données · égalité H/F · biens · certificat",
            "Travail personnel · diligence/loyauté · comptes · heures supp. · ordres"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.3.1 Protection santé (LAA art. 82)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Employeur : mesures prévention (expérience, technique, conditions) · faire collaborer le personnel. Employé : assister · EPI · dispositifs de sécurité · ne pas les retirer sans autorisation. Travaux à risques particuliers : certificat de formation possible (CF)."
      }
    ],
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Salaire brut{/g} — Salaire avant les retenues à la charge du personnel."
      },
      {
        "kind": "paragraph",
        "text": "{g}Salaire net{/g} — Montant après retenues, avant d'éventuelles autres opérations sur le versement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rémunération{/g} — Ensemble des contreparties du travail, incluant salaire et prestations convenues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cotisation{/g} — Contribution financière à une assurance ou à un régime social."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge employeur{/g} — Coût supporté par l'employeur au-delà du salaire brut selon le décompte."
      },
      {
        "kind": "paragraph",
        "text": "{g}AVS{/g} — Assurance-vieillesse et survivants de la prévoyance publique suisse."
      },
      {
        "kind": "paragraph",
        "text": "{g}AI{/g} — Assurance-invalidité."
      },
      {
        "kind": "paragraph",
        "text": "{g}LPP{/g} — Cadre légal de la prévoyance professionnelle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pilier 3a{/g} — Prévoyance individuelle liée, soumise à des conditions."
      },
      {
        "kind": "paragraph",
        "text": "{g}Travail temporaire{/g} — Mission de durée limitée, éventuellement dans le cadre d'une location de services."
      },
      {
        "kind": "paragraph",
        "text": "{g}Absentéisme{/g} — Absences observées sur une période, rapportées à une base explicite si mesurées en taux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Équipement de protection individuelle{/g} — Équipement porté pour réduire l'exposition à un risque."
      }
    ],
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le brut mensuel est de CHF 4 800 et les retenues totalisent CHF 510. Calculez le net.",
    "answer": "CHF 4 290",
    "calculation": "4 800 − 510 = 4 290.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une fiche indique un taux fictif de retenues de 7,2 % sur CHF 5 200 et une retenue LPP de CHF 205. Calculez le net de l'exemple.",
    "answer": "CHF 4 620,60",
    "calculation": "5 200 − 5 200 × 0,072 − 205 = 4 620,60.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-3",
    "kind": "maths",
    "prompt": "Deux personnes travaillent chacune 36 h. Le coût économique retenu est CHF 41 par heure. Calculez le coût total.",
    "answer": "CHF 2 952",
    "calculation": "2 × 36 × 41 = 2 952.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le salaire brut annuel est CHF 62 400, les charges employeur CHF 8 200 et la formation CHF 1 500. Calculez le budget global.",
    "answer": "CHF 72 100",
    "calculation": "62 400 + 8 200 + 1 500 = 72 100.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-5",
    "kind": "maths",
    "prompt": "Comparez 160 h en agence à CHF 53/h et une solution interne à CHF 45/h avec CHF 600 de coûts d'intégration.",
    "answer": "Interne CHF 7 800, agence CHF 8 480, écart CHF 680",
    "calculation": "160 × 53 = 8 480. 160 × 45 + 600 = 7 800. 8 480 − 7 800 = 680.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-maths-fiche-6",
    "kind": "maths",
    "prompt": "Sur 1 280 heures planifiées, 64 sont des absences. Calculez la part des heures d'absence.",
    "answer": "5 %",
    "calculation": "64 ÷ 1 280 × 100 = 5.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence y a-t-il entre salaire brut et coût total employeur ?",
    "answer": "Le coût total inclut le brut et les charges et moyens financés par l'entreprise.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quels sont les trois piliers de la prévoyance suisse ?",
    "answer": "Prévoyance publique, professionnelle et individuelle.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi le salaire net varie-t-il selon les situations ?",
    "answer": "Les cotisations, bases de calcul et retenues dépendent notamment des assurances et des données du contrat.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que peut apporter une formation à la préparation des commandes ?",
    "answer": "Une meilleure maîtrise des tâches, moins d'erreurs et une exposition réduite aux accidents.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qui doit participer à la prévention des accidents du travail ?",
    "answer": "L'employeur organise les mesures et le personnel les applique et collabore à leur mise en œuvre.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le quai prévoit un surcroît d'activité de trois semaines. Comparez des heures internes supplémentaires et une mission temporaire.",
    "answer": "Estimer coût, capacité, délais d'intégration, formation au poste et contraintes de repos; vérifier que la solution couvre les risques et le besoin.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un opérateur arrive dans la zone de manutention sans équipement prescrit. Quelle suite donnez-vous ?",
    "answer": "Interrompre la tâche exposée, fournir l'équipement, rappeler la consigne et vérifier qu'il peut travailler sans danger.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-703-situation-fiche-3",
    "kind": "situation",
    "prompt": "Vous comparez deux décomptes dont les bruts sont égaux et les nets différents. Que vérifiez-vous ?",
    "answer": "La période et chaque retenue avec sa base de calcul, le plan de prévoyance et le régime d'assurance, par les canaux RH appropriés.",
    "module": "703",
    "revision": "703-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
