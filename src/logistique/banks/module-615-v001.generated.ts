import type { LogistiqueUnit } from '../approved-banks'

export const module615 = [
  {
    "id": "log-615-objectifs-apercu",
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
          "Classer les {g}envois spéciaux{/g} et appliquer les règles {g}MD / LQ{/g}",
          "Préparer lettres et colis (séparation, rollbox, signalétique)",
          "Choisir et {g}étiqueter{/g} les supports de charges",
          "Relier {g}NPA{/g}, hubs, niveaux de distribution et modes de transport"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 615",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier le service, le format et la destination avant le tri.",
          "Choisir et étiqueter le support selon les consignes du dépôt.",
          "Signaler les cas spéciaux et vérifier leur acceptation auprès du service qualifié."
        ]
      }
    ],
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "15. Préparer les envois pour le processus de tri",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "15.1–15.6 Envois spéciaux & MD",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les envois spéciaux nécessitent un traitement défini selon leurs caractéristiques. Pour une marchandise réglementée, la prise en charge dépend du contenu exact, du mode, de la réglementation et du prestataire."
      },
      {
        "kind": "table",
        "headers": [
          "Situation",
          "Traitement de référence"
        ],
        "rows": [
          [
            "Envoi conforme pour le tri prévu",
            "L’identifier et l’orienter selon le service et la destination."
          ],
          [
            "Envoi de taille ou de forme inhabituelle",
            "Faire vérifier le traitement adapté et les limites applicables."
          ],
          [
            "Envoi réglementé ou incertain",
            "Suspendre la remise et faire vérifier la prise en charge par le service qualifié."
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "15.7–15.11 Préparation aux points de dépôt",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/615/commun/log-615-notions-1-v001.svg",
        "alt": "Identifier. Dossier et destination. Séparer. Service et format. Remettre. Support étiqueté.",
        "caption": "Vérifier la catégorie et le service avant le transfert."
      },
      {
        "kind": "paragraph",
        "text": "{g}Préparation{/g} = trier avant centre (ex. express dans même RX). Points de dépôt : guichets, filiales, BA, automates…"
      },
      {
        "kind": "paragraph",
        "text": "{g}Lettres :{/g} vérifier service, format et traitement demandé selon la procédure du centre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Colis :{/g} regrouper selon le service, le format et le traitement prévus par le site."
      },
      {
        "kind": "paragraph",
        "text": "👉 Erreur de rollbox (Express dans Economy) = retard + client mécontent. En cas de situation inhabituelle ou de risque, suspendre le traitement, avertir le poste responsable et suivre la procédure sans manipuler le contenu."
      },
      {
        "kind": "heading",
        "text": "15.12–15.14 Supports de charges & étiquetage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/615/commun/log-615-notions-2-v001.svg",
        "alt": "Contenu. Unités et service. Destination. Centre ou départ. Contrôle. Identité et statut.",
        "caption": "Le support doit correspondre au flux et à ses conditions."
      },
      {
        "kind": "table",
        "headers": [
          "Support",
          "Fonction"
        ],
        "rows": [
          [
            "Bac réutilisable",
            "Regrouper des envois compatibles."
          ],
          [
            "Support roulant",
            "Déplacer des unités du flux autorisé."
          ],
          [
            "Palette ou conteneur",
            "Regrouper des unités selon le système prévu."
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Étiquetage = {g}quoi{/g} + {g}où{/g}. Poste : A/B · FN/GF · auto/manuel. DHL : n°/code-barres conteneur. Planzer : QR + GPS."
      },
      {
        "kind": "heading",
        "text": "15.15–15.17 Centres & NPA",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les centres s’implantent selon l’accès aux modes, les volumes, les délais et les besoins régionaux. Vérifier les règles de circulation applicables au départ."
      },
      {
        "kind": "paragraph",
        "text": "Le NPA suisse compte quatre chiffres. Le routage précis suit les règles d’acheminement du prestataire et peut évoluer. 1er chiffre → centre / région de desserte · suite → tournée facteur."
      },
      {
        "kind": "heading",
        "text": "15.18–15.23 Hubs, niveaux & modes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Hub{/g} = nœud de regroupement / tri / réacheminement · {g}cross-docking{/g} ↓ trajets."
      },
      {
        "kind": "table",
        "headers": [
          "Niveaux",
          "Exemple"
        ],
        "rows": [
          [
            "{g}1{/g}",
            "Direct (coursier, repas)"
          ],
          [
            "{g}2{/g}",
            "Usine → magasin / transport marchandises"
          ],
          [
            "{g}3{/g}",
            "Automate → centre → destinataire"
          ],
          [
            "{g}Multi{/g}",
            "International (avion, dédouanement…)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Modes :{/g} route (flexible, RPLP, nuit) · rail (volume, écolo, peu de raccordements) · eau (lent, cheap) · air (rapide, cher). En CH distribution : surtout {g}route + rail{/g}."
      }
    ],
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Canal de distribution{/g} — Lien organisé entre les acteurs et destinations de la distribution."
      },
      {
        "kind": "paragraph",
        "text": "{g}Catégorie de tri{/g} — Classement qui oriente l’envoi vers un traitement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contenant collectif{/g} — Support qui regroupe plusieurs unités identifiées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle d’acceptation{/g} — Vérification des conditions nécessaires à la remise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Envoi spécial{/g} — Envoi soumis à un traitement particulier selon le dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Étiquette de support{/g} — Indication du contenu, du traitement ou de la destination du support."
      },
      {
        "kind": "paragraph",
        "text": "{g}Format de tri{/g} — Catégorie attribuée selon les exigences du traitement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Hub{/g} — Nœud où les flux sont regroupés et redistribués."
      },
      {
        "kind": "paragraph",
        "text": "{g}NPA{/g} — Numéro postal d’acheminement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rollbox{/g} — Support roulant qui regroupe des unités dans le flux prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Service qualifié{/g} — Fonction autorisée pour vérifier un traitement ou une acceptation particulière."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri manuel{/g} — Traitement effectué sans le circuit automatisé prévu pour la catégorie."
      }
    ],
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le dépôt prépare 24 colis pour une destination et 31 pour une autre. Calculez le total.",
    "answer": "55 colis.",
    "calculation": "24 + 31 = 55.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-maths-fiche-2",
    "kind": "maths",
    "prompt": "Il faut traiter 73 unités par lots d’exercice de 12. Combien de lots complets et d’unités restantes ?",
    "answer": "Six lots et une unité.",
    "calculation": "73 = 6 × 12 + 1.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-maths-fiche-3",
    "kind": "maths",
    "prompt": "Vous étiquetez cinq supports, chacun avec deux étiquettes. Calculez le nombre d’étiquettes.",
    "answer": "Dix étiquettes.",
    "calculation": "5 × 2 = 10.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 160 envois, 24 demandent un traitement manuel. Calculez la part.",
    "answer": "15 %.",
    "calculation": "24 ÷ 160 × 100 = 15 %.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un hub reçoit quatre lots de 48 envois. Il en transfère 175 sur le premier départ. Calculez le solde.",
    "answer": "17 envois.",
    "calculation": "4 × 48 − 175 = 17.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-615-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles données orientent la préparation d’un envoi ?",
    "answer": "Sa catégorie, son service, son format, sa destination et les exigences de prise en charge.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert une étiquette de support ?",
    "answer": "Indiquer les données nécessaires au traitement et prévenir les erreurs de destination.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quand faut-il demander l’avis du service qualifié ?",
    "answer": "Quand la nature, l’acceptation ou la règle d’un envoi particulier est incertaine.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-verification-fiche-4",
    "kind": "verification",
    "prompt": "Qu’est-ce qui oriente un envoi vers le tri manuel ?",
    "answer": "Les critères du réseau, dont une forme, une présentation ou des données non adaptées au traitement automatique.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-verification-fiche-5",
    "kind": "verification",
    "prompt": "Comment un hub contribue-t-il au flux ?",
    "answer": "Il regroupe, répartit et organise le départ des unités.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un envoi déformé porte une mention dont la signification n’est pas claire. Que faites-vous ?",
    "answer": "Ne pas l’intégrer au tri et prévenir le poste qualifié selon la procédure, sans manipuler le contenu.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le support porte une étiquette d’une autre destination. Quelle suite ?",
    "answer": "Suspendre le départ, rapprocher contenu et référence, puis faire corriger et contrôler l’étiquette.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-615-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un lot urgent se trouve dans un regroupement ordinaire. Comment traitez-vous l’écart ?",
    "answer": "Identifier le dossier et demander l’affectation au bon service avant la clôture, avec une trace.",
    "module": "615",
    "revision": "615-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
