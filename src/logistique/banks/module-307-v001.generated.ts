import type { LogistiqueUnit } from '../approved-banks'

export const module307 = [
  {
    "id": "log-307-objectifs-apercu",
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
          "Citer les principaux types d'{g}erreurs de livraison{/g} et comment les détecter",
          "Distinguer dommages sur suremballage et emballage de {g}vente{/g}",
          "Expliquer le rôle des {g}indicateurs{/g} (basculement, choc, température) et des enregistreurs",
          "Appliquer la procédure en {g}5 étapes{/g} et le comportement en cas de {g}sinistre{/g} (protocole, photos, signatures)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 307",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer une erreur de livraison d’un dommage et d’une cause supposée.",
          "Documenter l’état, l’identification et les éléments utiles au suivi.",
          "Orienter la marchandise selon la procédure et l’état constaté."
        ]
      }
    ],
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "7. Contrôle sommaire et traitement des dommages",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Erreurs et dommages ne sont pas rares en logistique. Il faut les {g}reconnaître{/g}, en analyser les {g}causes{/g} et améliorer le {g}taux d'erreur{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1 Erreur dans la livraison",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-notions-1-v001.svg",
        "alt": "Quantité. Manquant ou surplus. Référence. Article ou destination. État. Dommage observable.",
        "caption": "Une description précise aide à choisir le bon contrôle."
      },
      {
        "kind": "paragraph",
        "text": "Les contrôles d'identification globale et détaillée (module {g}304{/g}) doivent déjà faire ressortir défauts et erreurs."
      },
      {
        "kind": "heading",
        "text": "7.1.1 Mauvais destinataire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Livraison non destinée à EnterSite → l'identification {g}globale{/g} doit l'éviter. Sinon : temps et coûts inutiles."
      },
      {
        "kind": "paragraph",
        "text": "Prévention : adresses et contacts clairs (interne + transversal) entre expéditeur, transporteur et destinataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} risque accru pour les entreprises à {g}plusieurs succursales{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.2 Marchandises incorrectes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bon destinataire ≠ bon contenu. Expéditeur : {g}double contrôle{/g} ou {g}scanners{/g}. Destinataire : identification {g}détaillée{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.3 Mauvaise quantité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Aussi une erreur de livraison. Le scanner « mauvaise marchandise » ne suffit pas toujours pour la quantité — surtout petites pièces en grandes quantités. Outils → module {g}308{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.4 Différence qualitative",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dommages transport / influences extérieures : déchirures, bosses, déformations ; papier/humidité, etc. Livraison « correcte » sans la qualité attendue = erreur. Garantie qualité → module {g}309{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} contenants endommagés = aussi anomalie qualitative (empêchent la vente)."
      },
      {
        "kind": "heading",
        "text": "7.1.5 Livraison tardive",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Date convenue liée à production / livraison client. Non-respect → annulation possible, image dégradée, coûts ↑."
      },
      {
        "kind": "heading",
        "text": "7.1.6 Taux d'erreur et conséquences",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Accord qualité fournisseur–client : {g}taux d'erreur{/g} toléré (selon valeur/importance des articles) + conséquences (jusqu'à {g}pénalité{/g}). Chaque erreur est de trop ; impact image possible. Le {g}taux d'erreur de livraison{/g} est un chiffre-clé (approfondi en stockage)."
      },
      {
        "kind": "heading",
        "text": "7.2 Dégâts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Première vision (identification globale) : chargement déplacé / palettes renversées → contraintes fortes, dommages probables. Dommages {g}climatiques{/g} (humidité, température) moins évidents — surtout en international ; bureaux de contrôle qualité si besoin."
      },
      {
        "kind": "paragraph",
        "text": "Suremballage de transport protège l'emballage de {g}vente{/g}. Emballage de vente déjà endommagé → souvent {g}non présenté{/g} en point de vente."
      },
      {
        "kind": "heading",
        "text": "7.2.1 Emballages endommagés durant le transport",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Distinguer {g}suremballage{/g} et {g}emballage de vente{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Aspect",
          "Interprétation"
        ],
        "rows": [
          [
            "{g}Déchiré{/g}",
            "Contenu souvent endommagé ; emballage de vente abîmé → impropre à la vente"
          ],
          [
            "{g}Taché{/g}",
            "Tache de l'intérieur = casse → inutilisable ; de l'extérieur = parfois OK pour suremballage, pas pour emballage de vente"
          ],
          [
            "{g}Écrasé / cabossé{/g}",
            "Vérifier le contenu ; emballage de vente → {g}refuser{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "7.2.2 Moyens auxiliaires pour détecter les dommages",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Produits coûteux/délicats : indicateurs et enregistreurs pour chocs, basculement, froid, etc. Preuves pour assurance : {g}photos{/g} et/ou {g}données{/g}. Enjeu aussi : confiance client / réputation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de basculement{/g} - Sable de quartz bleu : activer en retirant la séparation ; inclinaison ~{g}60°{/g} → sable visible - Billes de verre : la bille se déplace et reste collée selon l'angle"
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de choc{/g} Tube verre + liquide rouge : chute/choc anormal → coloration {g}irréversible{/g} du tube central."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de température{/g} Chaîne du froid critique ; dégâts peu visibles. Points de couleur → rouge si température dépassée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Utilisation en 5 étapes :{/g} 1. Appliquer l'indicateur sur l'emballage 2. Transporteur confirme l'intégrité à la prise en charge 3. Réception vérifie à la livraison 4. Transporteur confirme indicateur déclenché ou manquant 5. Examen du produit → libération ou traitement du sinistre"
      },
      {
        "kind": "paragraph",
        "text": "{g}Infrarouge{/g} Mesure rapide de température {g}instantanée{/g} — ne reconstitue pas l'historique du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enregistreurs numériques{/g} Température, humidité, inclinaison, chocs en continu ; seuils ; app mobile. Usages exigeants : musées, pharma, médical…"
      },
      {
        "kind": "heading",
        "text": "7.3 En cas de dommage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-notions-2-v001.svg",
        "alt": "Identifier. Envoi et unité. Constater. État et moment. Suivre. Signalement et décision.",
        "caption": "Les preuves accompagnent le dossier de traitement."
      },
      {
        "kind": "paragraph",
        "text": "Signalement {g}immédiat{/g} au supérieur ; documentation selon directives (formulaire de constatation). Photos sous tous les angles → jointes au protocole."
      },
      {
        "kind": "heading",
        "text": "7.3.1 Comportement selon le mode de livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport accompagné{/g} - {g}Camion{/g} : constater avec le chauffeur ; signature sur formulaire ; transmission au fournisseur - {g}Courrier / coursier{/g} : déclaration de dommage (formulaire + délais selon prestataire) ; {g}conserver{/g} l'envoi jusqu'à fin d'enquête"
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport non accompagné{/g} - {g}Ferroviaire{/g} : signaler au gestionnaire d'événements ferroviaires de la région (constat sur place) - {g}Conteneur par camion{/g} : signaler transporteur/fournisseur ; parfois {g}interrompre{/g} le déchargement jusqu'à évaluation"
      },
      {
        "kind": "heading",
        "text": "Protocole des dégâts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Utiliser le formulaire ou l’enregistrement prévu, avec date, références, constat et pièces utiles. L’intervention du transporteur dépend de la procédure et des règles applicables."
      }
    ],
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Avarie{/g} — Dommage constaté sur un bien ou un envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bon de transport{/g} — Trace qui accompagne ou documente la prise en charge du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cause{/g} — Événement à établir à partir des constatations et de l’enquête."
      },
      {
        "kind": "paragraph",
        "text": "{g}Constat{/g} — Description précise de ce qui est observé au moment du contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dommage apparent{/g} — Altération observable lors du contrôle usuel."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballage de vente{/g} — Emballage dans lequel le produit est remis à l’utilisateur final."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de choc{/g} — Repère signalant un événement selon ses caractéristiques, sans établir seul la cause."
      },
      {
        "kind": "paragraph",
        "text": "{g}Isolement{/g} — Mise à part selon la procédure pour éviter la distribution d’un article en écart."
      },
      {
        "kind": "paragraph",
        "text": "{g}Preuve{/g} — Élément vérifiable conservé pour appuyer le constat."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réclamation{/g} — Signalement d’un écart accompagné d’une demande de traitement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Suremballage{/g} — Emballage extérieur destiné à regrouper et protéger pendant le transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traçabilité{/g} — Ensemble des données qui permettent de retrouver l’envoi et ses mouvements."
      }
    ],
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-maths-fiche-1",
    "kind": "maths",
    "prompt": "Sur 64 colis, sept ont un dommage apparent. Combien n’en présentent pas au contrôle initial ?",
    "answer": "57 colis.",
    "calculation": "64 − 7 = 57.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une livraison contient 14 cartons de 12 articles, dont 19 sont mis en contrôle. Combien restent hors de ce contrôle spécifique ?",
    "answer": "149 articles.",
    "calculation": "14 × 12 − 19 = 149.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 150 dossiers, 12 nécessitent une réserve. Calculez le taux.",
    "answer": "8 %.",
    "calculation": "12 ÷ 150 × 100 = 8 %.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-maths-fiche-4",
    "kind": "maths",
    "prompt": "Quatre dossiers sont traités en 2, 3, 5 et 6 jours. Calculez la moyenne.",
    "answer": "Quatre jours.",
    "calculation": "(2 + 3 + 5 + 6) ÷ 4 = 4 jours.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le taux de dossiers endommagés passe de 4,0 % à 2,5 %. Calculez l’écart et la baisse relative.",
    "answer": "1,5 point et 37,5 % de baisse relative.",
    "calculation": "4,0 − 2,5 = 1,5 point. 1,5 ÷ 4,0 × 100 = 37,5 %.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-307-maths-fiche-6",
    "kind": "maths",
    "prompt": "Les zones A et B traitent 60 et 140 colis, avec 6 et 7 dommages. Calculez le taux global.",
    "answer": "6,5 %.",
    "calculation": "(6 + 7) ÷ (60 + 140) × 100 = 6,5 %.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-307-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence entre un manquant et un dommage apparent ?",
    "answer": "Un manquant concerne la quantité, un dommage l’état observé.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que prouve une photographie ?",
    "answer": "L’état visible dans son cadre au moment du constat, avec la référence et les autres éléments utiles.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi distinguer la mesure de température de son historique ?",
    "answer": "Une mesure ponctuelle ne suffit pas à établir ce qui s’est produit sur tout le trajet.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que faire si un indicateur de choc a changé ?",
    "answer": "Noter le constat et appliquer le contrôle prévu, sans attribuer la cause.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qu’indique le suremballage ?",
    "answer": "Il protège ou regroupe les produits, mais son état ne suffit pas toujours à connaître leur état intérieur.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi relever les marques et références ?",
    "answer": "Elles permettent de rattacher le constat aux bons articles et documents.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un carton présente une déchirure avant ouverture. Qu’écrivez-vous ?",
    "answer": "La référence, l’emplacement du défaut, le moment et les preuves disponibles, puis signaler selon la procédure.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un fournisseur attribue le dommage au dépôt. Vous n’avez pas de preuve de la cause. Que transmettez-vous ?",
    "answer": "Les faits et les pièces de dossier. Distinguer ce qui est constaté et ce qui doit être vérifié.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le contenu est fragile et le transporteur repart. Que faites-vous du dossier ?",
    "answer": "Consigner les réserves pertinentes, préserver les éléments utiles et informer le poste désigné selon les délais.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-307-situation-fiche-4",
    "kind": "situation",
    "prompt": "Des écarts semblables reviennent avec un même emballage. Proposez un suivi.",
    "answer": "Comparer lots et conditions comparables, déterminer les contrôles à ajouter et suivre les résultats.",
    "module": "307",
    "revision": "307-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
