import type { LogistiqueUnit } from '../approved-banks'

export const module614 = [
  {
    "id": "log-614-objectifs-apercu",
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
          "Distinguer {g}prise en charge{/g}, points {g}desservis{/g} et {g}non desservis{/g}",
          "Décrire les processus de prise en charge {g}privée{/g} et {g}commerciale{/g}",
          "Appliquer la levée des {g}boîtes aux lettres{/g} (5 étapes + cas particuliers)",
          "Expliquer le vidage des {g}automates{/g} (ordre retirer → entreposer, catégories)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 614",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer la prise en charge au domicile, au point desservi ou en libre-service.",
          "Vérifier les conditions de prestation et les heures de remise.",
          "Suivre les dépôts et les levées à partir des enregistrements prévus."
        ]
      }
    ],
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "14. Possibilités de dépôt",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "14.1 Bases",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}dépôt{/g} = point de départ du voyage logistique : envoi déposé / réceptionné / préparé pour transport, tri, distribution. Ex. EnterSite : LOGO vient chercher les appareils · factures/lettres déposées en boîte aux lettres publique."
      },
      {
        "kind": "heading",
        "text": "14.2 Termes",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Terme",
          "Sens"
        ],
        "rows": [
          [
            "Retirer / collecter / réceptionner",
            "Point de vue {g}entreprise de distribution{/g}"
          ],
          [
            "Déposer",
            "Point de vue {g}client{/g} qui remet l'envoi"
          ],
          [
            "Expéditeur / déposant",
            "Qui envoie"
          ],
          [
            "Destinataire",
            "Qui reçoit"
          ],
          [
            "Entreprise de distribution / CEC & courrier",
            "Prise en charge, transport, livraison"
          ],
          [
            "Clientèle privée / commerciale",
            "Usage perso vs professionnel"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "14.3 Possibilités",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/614/commun/log-614-notions-1-v001.svg",
        "alt": "Collecte. Enlèvement à l’adresse. Point desservi. Prise en charge au guichet. Libre-service. Disponibilité selon le point.",
        "caption": "Le canal est choisi selon l’envoi, le service et ses conditions."
      },
      {
        "kind": "heading",
        "text": "14.3.1 Prise en charge",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Collaborateurs viennent chercher chez le client · privée ou commerciale · régulière ou à la demande."
      },
      {
        "kind": "list",
        "items": [
          "{g}Privé{/g} : commande en ligne / Post-App · domicile ou adresse choisie",
          "{g}Commercial{/g} : lettres, colis, VinoLog, express, étranger · selon besoins"
        ]
      },
      {
        "kind": "heading",
        "text": "14.3.2 Déposer soi-même",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Points desservis{/g} Filiales propres ou {g}partenaires{/g} (Poste : Volg, Landi… · DPD : magasins, pharmacies…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Points non desservis{/g} - {g}Boîtes aux lettres{/g} (Poste) · 24/7 · lettres affranchies - {g}Automates à colis{/g} (My Post 24, DHL…) · dépôt / expédition · affranchissement possible sur place - {g}Point clientèle commerciale self-service{/g} : convention + badge · envois affranchis dans conteneurs · levée 1×/jour"
      },
      {
        "kind": "paragraph",
        "text": "👉 Prise en charge = confort + contact · coûts personnel/véhicules. Desservi = moins de ramassage · loyers/personnel. Non desservi = 24/7 · ↓ personnel · ↑ acquisition/entretien."
      },
      {
        "kind": "heading",
        "text": "14.4 Prise en charge chez les clients",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "14.4.1 Privé (ex. Poste pick@home)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ordre → smartphone facteur. Standard : contrôler/traiter ordre · scanner · confirmer prise en charge · suite expédition. Cas spéciaux : étiquette retour, emballage, produits sans code-barres (consignes QMS)."
      },
      {
        "kind": "heading",
        "text": "14.4.2 Commercial",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Mode",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Régulier{/g}",
            "Jours/plages contractuels"
          ],
          [
            "{g}Occasionnel{/g}",
            "Sur commande"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Les quantités, volumes, accès et créneaux déterminent le type de collecte selon le contrat et l’organisation en vigueur."
      },
      {
        "kind": "heading",
        "text": "14.5 Levée des points non desservis",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/614/commun/log-614-notions-2-v001.svg",
        "alt": "Créneau. Horaire prévu. Collecte. Constat et quantité. Transmission. Enregistrement et suite.",
        "caption": "Le service peut expliquer le suivi à partir des traces autorisées."
      },
      {
        "kind": "paragraph",
        "text": "Respecter {g}horaires{/g} et processus → satisfaction client."
      },
      {
        "kind": "heading",
        "text": "14.5.1 Boîtes aux lettres (5 étapes)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Appliquer les horaires et la procédure du prestataire. Relever la collecte et tout écart, préserver la confidentialité et transmettre les constats au poste compétent.### 14.5.2 Événements particuliers Consigner les détériorations et tout événement particulier. Une demande de récupération est traitée par le service compétent selon les règles applicables, dont la confidentialité."
      },
      {
        "kind": "heading",
        "text": "14.5.3 Automates (My Post 24)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les automates proposent des services selon le site et le contrat. Les opérations de levée et la résolution des écarts relèvent du personnel autorisé et des procédures du prestataire."
      },
      {
        "kind": "heading",
        "text": "14.5.4 Erreurs automates",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Deux envois / casier · automate plein. Prévention : bien vérifier fond · vider {g}avant{/g} d'entreposer."
      }
    ],
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Automate de dépôt{/g} — Équipement qui permet une remise selon les services et conditions prévus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Collecte{/g} — Prise en charge d’envois pour leur acheminement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déposant{/g} — Personne ou organisation qui remet un envoi au prestataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dépôt{/g} — Remise d’un envoi dans le canal choisi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dépôt non desservi{/g} — Remise dans un point sans accueil permanent par une personne."
      },
      {
        "kind": "paragraph",
        "text": "{g}Desservi{/g} — Point où le service est assuré par du personnel pendant les horaires prévus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enlèvement{/g} — Prise en charge organisée à une adresse."
      },
      {
        "kind": "paragraph",
        "text": "{g}Expéditeur{/g} — Personne ou organisation qui envoie la marchandise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Heure de levée{/g} — Moment annoncé pour collecter les envois d’un point."
      },
      {
        "kind": "paragraph",
        "text": "{g}Preuve de prise en charge{/g} — Événement ou document permettant de constater la remise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Retour{/g} — Envoi qui revient selon le dossier et les conditions prévues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tournée de collecte{/g} — Séquence organisée de points à desservir."
      }
    ],
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une prise en charge comporte 17 lettres et 26 colis. Calculez le nombre d’envois.",
    "answer": "43 envois.",
    "calculation": "17 + 26 = 43.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un relevé annonce 38 envois et on en compte 36. Calculez le manque.",
    "answer": "Deux envois.",
    "calculation": "38 − 36 = 2.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une tournée passe à 13 h 25, puis 46 min après au point suivant. Calculez l’heure.",
    "answer": "14 h 11.",
    "calculation": "13 h 25 + 46 min = 14 h 11.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-maths-fiche-4",
    "kind": "maths",
    "prompt": "Huit enlèvements durent chacun six minutes, hors déplacement. Calculez la durée.",
    "answer": "48 minutes.",
    "calculation": "8 × 6 = 48 min.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 85 dépôts, 17 ont exigé un accueil en personne. Calculez la part.",
    "answer": "20 %.",
    "calculation": "17 ÷ 85 × 100 = 20 %.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-614-verification-fiche-1",
    "kind": "verification",
    "prompt": "Qu’est-ce qui distingue le dépôt de la collecte ?",
    "answer": "Le client remet l’envoi, le prestataire le prend en charge.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quels éléments vérifier avant de recommander un canal ?",
    "answer": "Format, service, destination, preuve demandée, horaire et conditions en vigueur.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi distinguer collecte régulière et occasionnelle ?",
    "answer": "L’une suit des créneaux convenus, l’autre dépend d’une commande ponctuelle.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-verification-fiche-4",
    "kind": "verification",
    "prompt": "À quoi sert la preuve de prise en charge ?",
    "answer": "À retrouver le moment et le dossier de remise.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que faire si le comptage diffère du relevé ?",
    "answer": "Vérifier selon la procédure et signaler l’écart avec les références.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le client ne peut pas se déplacer et a cinq colis. Quelles données réunissez-vous ?",
    "answer": "Adresse, service, volumes, disponibilité et conditions d’enlèvement avant confirmation.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un automate n’accepte pas l’envoi. Quelle suite proposez-vous ?",
    "answer": "Vérifier le format et le service, puis orienter vers un canal autorisé compatible.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-614-situation-fiche-3",
    "kind": "situation",
    "prompt": "L’expéditeur réclame une preuve après une prise en charge. Que fournissez-vous ?",
    "answer": "La trace prévue pour le dossier, par le canal approprié au rôle et aux règles de confidentialité.",
    "module": "614",
    "revision": "614-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
