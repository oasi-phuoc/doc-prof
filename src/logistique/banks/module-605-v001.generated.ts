import type { LogistiqueUnit } from '../approved-banks'

export const module605 = [
  {
    "id": "log-605-objectifs-apercu",
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
          "Appliquer les règles d'{g}adressage{/g} lettres et colis",
          "Comparer les principales {g}prestations{/g} (A/B, Priority/Economy, Signature…)",
          "Décrire le flux {g}étranger{/g} et le {g}tri{/g} (lettres séquencé, colis)",
          "Expliquer la {g}distribution{/g}, PickPost et My Post 24"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 605",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Rédiger une adresse lisible et la rattacher au bon envoi.",
          "Choisir une prestation selon le trajet, le délai et le suivi demandé.",
          "Comprendre le passage du dépôt au tri et à la remise."
        ]
      }
    ],
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "5. Mode d'envoi postal",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "5.1 Adressage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-notions-1-v001.svg",
        "alt": "Destinataire. Nom ou organisation. Voie. Rue et numéro. Destination. NPA et localité.",
        "caption": "Vérifier les règles d’adressage en vigueur du prestataire."
      },
      {
        "kind": "paragraph",
        "text": "Une adresse lisible et correcte facilite le tri et la remise. Vérifier la présentation prévue pour le support et la destination."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lettres — points clés :{/g} - Aligné à {g}gauche{/g} · 3 à 6 lignes · pas de lignes vides - Nom entreprise / nom + prénom complets - Rue + n° · ou {g}Case postale{/g} + n° - {g}NPA{/g} + localité complets - Pas de soulignement ni espaces entre lettres"
      },
      {
        "kind": "paragraph",
        "text": "Étiquette à gauche ou droite (droite = plus de place expéditeur / pub)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Colis — conseils Poste :{/g} 1. Police 3–4 mm (12–16 pt) · laser / jet d'encre · pas décorative 2. Destinataire : personne/entreprise · rue/n° ou CP · NPA + localité 3. Expéditeur : de préférence {g}vertical{/g} · à gauche · ≥ {g}10 mm{/g} du destinataire 4. {g}Code-barres{/g} d'envoi (expéditeur + n° d'envoi) 5. Étiquettes prestations (ex. Priority, Signature) à {g}droite{/g} du code-barres"
      },
      {
        "kind": "paragraph",
        "text": "👉 Étiquetage correct = travail Poste simplifié · évite hausses de prix."
      },
      {
        "kind": "heading",
        "text": "5.2 Modes d'envoi",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "5.2.1 Lettres",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Prestation",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Courrier A{/g}",
            "J+1 · lun–sam"
          ],
          [
            "{g}Courrier B{/g}",
            "Plus économique · au plus tard 3e jour ouvrable · lun–ven"
          ],
          [
            "{g}Recommandé (R){/g}",
            "Signature · preuve · assuré jusqu'à {g}500 CHF{/g} · J+1 lun–ven"
          ],
          [
            "{g}En main propre (RMP){/g}",
            "Remise uniquement à la personne nommée"
          ],
          [
            "{g}Remboursement (BLN){/g}",
            "Signature + paiement · crédit compte postal expéditeur"
          ],
          [
            "{g}Swiss-Express Lune{/g}",
            "Avant {g}9 h{/g} · J+1 lun–sam"
          ],
          [
            "{g}SameDay Coursier{/g}",
            "Jour même · lun–ven · plus cher"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.2.2 Colis",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Prestation",
          "Contenu"
        ],
        "rows": [
          [
            "{g}PostPac Priority (PRI){/g}",
            "J+1 lun–ven"
          ],
          [
            "{g}PostPac Economy{/g}",
            "2e jour ouvrable lun–ven"
          ],
          [
            "{g}Encombrants (SP){/g}",
            "Volumineux / non emballés · tri {g}manuel{/g}"
          ],
          [
            "{g}Signature (SI){/g}",
            "Contre signature · responsabilité jusqu'à {g}1 500 CHF{/g}"
          ],
          [
            "{g}BLN / RMP{/g}",
            "Comme lettres"
          ],
          [
            "{g}Assurance (AS){/g}",
            "Comme SI + jusqu'à {g}5 000 CHF{/g} · discret (aspect SI)"
          ],
          [
            "{g}Fragile (FRA){/g}",
            "Soin particulier · jusqu'à {g}5 000 CHF{/g} · manuel"
          ],
          [
            "{g}Lune / SameDay{/g}",
            "Comme lettres"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Listes non exhaustives · combinaisons possibles. Autres CEP/DEC sur le marché."
      },
      {
        "kind": "heading",
        "text": "5.3 Envoi à l'étranger",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrôle douanier pays d'origine {g}et{/g} destination · documents complets. Le routage dépend du service, du contenu, du format et du réseau du prestataire. Distinguer les documents et les autres marchandises selon leur nature et la réglementation, et contrôler les formalités du dossier. Autres CEP internationaux actifs."
      },
      {
        "kind": "heading",
        "text": "5.4 Centres de tri",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-notions-2-v001.svg",
        "alt": "Dépôt. Envoi identifié. Tri. Destination et traitement. Remise. Distribution ou retrait.",
        "caption": "Chaque événement utile peut être relié à l’identifiant."
      },
      {
        "kind": "heading",
        "text": "5.4.1 Lettres",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "3 grands centres · zone d'oblitération / 1er tri. Machine lit rue + NPA. Si échec → photo → saisie manuelle (ex. Coire). Code-barres bas = ordre 2e tri. Tri {g}séquencé{/g} : centre · secteur · rue · n° · ordre des boîtes → facteur reçoit conteneur (BB) déjà classé."
      },
      {
        "kind": "heading",
        "text": "5.4.2 Colis",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Séparation au dépôt (Priority / Economy · encombrants · Express) · RollBox RX. 1er tri par NPA · 2e tri vers centres de distribution (train/camion) · secteurs."
      },
      {
        "kind": "heading",
        "text": "5.4.3 Santé",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Exosquelette{/g} : structure externe · ergonomie · ↓ accidents dos (lien module {g}405{/g}) · testé par la Poste. Préférer auxiliaires (chariots, tables à ciseaux, ventouses, diables…) · règles {g}SUVA{/g} de levage."
      },
      {
        "kind": "heading",
        "text": "5.5 Distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ville : lettres / colis / express souvent séparés · campagne : même coursier. Fusion PostMail + PostLogistics → {g}Logistics Services{/g}. Moyens : pied, vélo, tricycle élec. ({g}DXP{/g}, cargo, VR-bike), voiture, camionnette. Service public = couverture nationale. Ville : > {g}2000{/g} lettres/jour · campagne : moins d'envois mais parfois > {g}50 km{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Scanner (smartphone) · codes-barres · données ménage · nouveaux clients → système {g}AMP{/g} (mis à jour quotidiennement) · sert au tri séquencé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Preuve d'identité{/g} (ex. RMP) : carte d'identité · passeport · permis CH · livret étrangers · carte d'identité Poste."
      },
      {
        "kind": "heading",
        "text": "5.5.1 PickPost",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "> {g}2500{/g} points (gares, magasins, stations…) · retrait flexible lettres recommandées / colis · pas de frais extra · avis SMS/e-mail."
      },
      {
        "kind": "heading",
        "text": "5.5.2 My Post 24",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Automates {g}24/7{/g} · retrait / dépôt · adresse alternative / 2e livraison. CEP privés : offres similaires."
      }
    ],
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Adresse d’expédition{/g} — Coordonnées de l’émetteur de l’envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Adresse de remise{/g} — Coordonnées de la destination retenue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Affranchissement{/g} — Indication du paiement ou des conditions associées à l’acheminement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centre de tri{/g} — Site qui répartit les envois selon leur traitement et leur destination."
      },
      {
        "kind": "paragraph",
        "text": "{g}Code-barres{/g} — Représentation lisible par un équipement de certaines données d’identification."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dédouanement{/g} — Formalités qui permettent le passage douanier de l’envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Identifiant d’envoi{/g} — Référence utilisée pour retrouver le dossier et les événements."
      },
      {
        "kind": "paragraph",
        "text": "{g}NPA{/g} — Numéro postal d’acheminement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de retrait{/g} — Lieu désigné où le destinataire peut prendre en charge l’envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Prestation{/g} — Service choisi et défini par des conditions."
      },
      {
        "kind": "paragraph",
        "text": "{g}Suivi{/g} — Consultation des événements enregistrés pour l’envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri{/g} — Répartition des envois entre destinations ou parcours."
      }
    ],
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-maths-fiche-1",
    "kind": "maths",
    "prompt": "Vous préparez 45 lettres et 17 colis. Combien d’envois remettez-vous ?",
    "answer": "62 envois.",
    "calculation": "45 + 17 = 62.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-maths-fiche-2",
    "kind": "maths",
    "prompt": "Sur 120 adresses, neuf sont à corriger. Combien sont prêtes après le premier contrôle ?",
    "answer": "111 adresses.",
    "calculation": "120 − 9 = 111.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un tarif d’exercice est de 2,40 CHF par envoi. Calculez le coût pour 15 envois.",
    "answer": "36 CHF.",
    "calculation": "15 × 2,40 = 36 CHF.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-maths-fiche-4",
    "kind": "maths",
    "prompt": "Une remise démarre à 15 h 46 et termine à 16 h 12. Calculez sa durée.",
    "answer": "26 minutes.",
    "calculation": "14 + 12 = 26 min.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 225 envois, 18 nécessitent un traitement manuel. Calculez la part.",
    "answer": "8 %.",
    "calculation": "18 ÷ 225 × 100 = 8 %.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-605-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que signifie NPA ?",
    "answer": "Numéro postal d’acheminement.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert l’adresse de l’expéditeur ?",
    "answer": "À rattacher l’envoi à son émetteur et à faciliter le retour si nécessaire.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-verification-fiche-3",
    "kind": "verification",
    "prompt": "Comment comparer deux prestations ?",
    "answer": "Vérifier le délai, la destination, les conditions, l’identification et le suivi.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel rôle joue le centre de tri ?",
    "answer": "Il répartit les envois par traitement et destination.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que vérifiez-vous avant un envoi à l’étranger ?",
    "answer": "Les règles du pays et du prestataire, les formalités et les documents applicables à l’envoi.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le NPA et la localité semblent contradictoires. Que faites-vous ?",
    "answer": "Vérifier la destination auprès d’une source autorisée avant dépôt.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le client demande une preuve de remise. Comment choisissez-vous ?",
    "answer": "Vérifier les prestations qui répondent à ce besoin pour la destination et expliquer leurs conditions.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-605-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un colis manque au relevé d’un départ. Comment organisez-vous la recherche ?",
    "answer": "Utiliser l’identifiant et les traces du dépôt, tri et transfert avant d’établir l’écart.",
    "module": "605",
    "revision": "605-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
