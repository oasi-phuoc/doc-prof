import type { LogistiqueUnit } from '../approved-banks'

export const module616 = [
  {
    "id": "log-616-objectifs-apercu",
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
          "Distinguer {g}tri de dépôt{/g}, {g}tri de distribution{/g} et {g}GFS{/g}",
          "Décrire les flux {g}lettres{/g} et {g}colis{/g} en centre (entrée → sortie)",
          "Citer machines clés et mesures de {g}sécurité{/g}",
          "Relier NPA / IATA / MIL et les outils de {g}logistique de site{/g} (WB, grue, double pont)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 616",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Suivre un envoi de l’entrée au tri primaire puis secondaire.",
          "Distinguer la région de desserte, le routage et l’ordre de la tournée.",
          "Documenter les écarts et respecter les consignes de sécurité du centre."
        ]
      }
    ],
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "16. Processus dans les centres de tri / distribution",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Principes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Lettres et colis : machines et process différents · même logique : {g}1er tri{/g} puis {g}2e tri{/g}."
      },
      {
        "kind": "heading",
        "text": "16.1 Notions",
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
            "Commissionnement",
            "Regrouper pour bases / suite"
          ],
          [
            "Préparation des envois",
            "Avant tri (presta, format…)"
          ],
          [
            "Région de desserte",
            "Zone du {g}tri secondaire{/g} du centre"
          ],
          [
            "CCR",
            "Centres colis {g}régionaux{/g} (soutien)"
          ],
          [
            "{g}Tri de dépôt{/g}",
            "1er tri · hors région → autre centre"
          ],
          [
            "{g}Tri de distribution{/g}",
            "2e tri · dans la région du centre"
          ],
          [
            "{g}Tri séquentiel (GFS){/g}",
            "Ordre de la tournée facteur"
          ],
          [
            "Base de distribution",
            "Office où part la tournée"
          ],
          [
            "Clinique des colis",
            "Réparation colis endommagés"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "16.2–16.4 Flux global",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/616/commun/log-616-notions-1-v001.svg",
        "alt": "Entrée. Réception et préparation. Premier tri. Région ou autre centre. Second tri. Base et tournée.",
        "caption": "La destination et le statut déterminent le prochain départ."
      },
      {
        "kind": "paragraph",
        "text": "Entrée → préparation → 1er tri → 2e tri (même centre ou autre) → commissionnement → sortie. 3 {g}PZ{/g} principaux · NPA / tableaux d'acheminement. CCR ex. : Vétroz, Ostermundigen, Härkingen, Urdorf, Cadenazzo…"
      },
      {
        "kind": "heading",
        "text": "16.5–16.7 Tri lettres (Poste)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Logistique de site{/g} (gestion quais/véhicules) → {g}entrée{/g} (robots/manuel · PromoPost/journaux parfois directs) → {g}préparation{/g} (FN/GF · auto/manuel · A/B · oblitération) → {g}tri{/g} (IRV, DBCS, GFSA · GF · manuel) → codage auto / {g}vidéocodage{/g} (ex. Coire) → casiers / buts de tri."
      },
      {
        "kind": "paragraph",
        "text": "{g}GFS{/g} : 2–3 phases après tri distribution → ordre boîtes / noms → {g}BB{/g} → commissionnement ({g}SB{/g}) → sortie (train si autre centre · route si bases)."
      },
      {
        "kind": "paragraph",
        "text": "Outils : CFC · IRV · robot portail · casiers manuels · unité GF · GFSA."
      },
      {
        "kind": "heading",
        "text": "16.8–16.9 Tri colis (Poste)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/616/commun/log-616-notions-2-v001.svg",
        "alt": "Identifier. Données et aptitudes. Orienter. Branche déterminée. Confirmer. Sortie et destination.",
        "caption": "Le routage doit rester lié à l’identifiant de l’envoi."
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Entrée{/g} — endommagés → clinique · non-colis retirés · aptitude mécanique · adresse vers le haut",
          "2. {g}Identification{/g} — ACS · pesée/mesure clients · VCS · MCS",
          "3. {g}Tri{/g} — distribution (même centre) vs dépôt (autre)",
          "4. {g}Sortie autres centres{/g} — RX → WB · souvent {g}train{/g}",
          "5. {g}Sortie{/g} — bases de distribution (route)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Machines : {g}plateaux inclinables{/g} (1 envoi/plateau · glissement variable) · {g}bandes transversales{/g} (précis, soigneux, rapide) · {g}rouleaux inclinés{/g} (fond plat requis). Aussi : convoyeurs, FTS, robots."
      },
      {
        "kind": "heading",
        "text": "16.10 Sécurité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Badge · clôture · éclairage · sacs {g}transparents{/g} · vestiaires perso · caméras · alarmes. Travail : instruction machines · passeport formation · MD · permis Suva chariots."
      },
      {
        "kind": "heading",
        "text": "16.11–16.15 NPA, IATA, MIL",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rappel NPA 4 chiffres (module {g}615{/g}) · Liechtenstein 9485–9498. Internationaux : 5–7 chiffres / lettres · certains pays sans. {g}IATA{/g} : 3 lettres aéroport (ZRH, LHR, CDG) · aussi sur AWB/codes. Les envois adressés à un service particulier suivent les conditions publiées pour cette destination. Vérifier le canal et l’adressage avec le prestataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. retour baskets :{/g} Aarau → Härkingen (1er tri) → train Daillens (10XX) → 2e tri → base → commerçant."
      },
      {
        "kind": "heading",
        "text": "16.16–16.23 Logistique entre centres & aides",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Outil",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Grue de terminal{/g}",
            "Transfert de supports compatibles, dans les limites de l’équipement."
          ],
          [
            "Pilotage logistique extérieure",
            "Centrale · ordres véhicules/grues"
          ],
          [
            "Véhicules de site",
            "Manœuvre WB"
          ],
          [
            "{g}Caisses mobiles{/g}",
            "RX ou {g}vrac{/g} (volume ↑ · déchargement ↓)"
          ],
          [
            "{g}Camions double pont{/g}",
            "Organisation de transport selon le plan, les unités et la capacité validés."
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Signalétique : Planzer (fiche + Datamatrix) · Poste (fiche avant RX · écran lieu cible vrac)."
      },
      {
        "kind": "paragraph",
        "text": "Aides internes : tracteurs RX · chariots SB/palettes · mât rétractable · contrepoids. Ergo : plates-formes · points de déversement · bandes télescopiques · aides traction · trottinettes."
      }
    ],
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Base de distribution{/g} — Site à partir duquel part la tournée ou le service de remise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centre de distribution{/g} — Site qui réceptionne, trie et réachemine des envois."
      },
      {
        "kind": "paragraph",
        "text": "{g}Commissionnement{/g} — Regroupement des envois selon les destinations et la suite du réseau."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle de sortie{/g} — Vérification des dossiers et des unités avant départ."
      },
      {
        "kind": "paragraph",
        "text": "{g}Écart de tri{/g} — Affectation ou résultat différent de la destination ou du traitement prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Identifiant d’envoi{/g} — Référence qui relie l’envoi à ses événements."
      },
      {
        "kind": "paragraph",
        "text": "{g}Région de desserte{/g} — Zone servie par un site ou un départ."
      },
      {
        "kind": "paragraph",
        "text": "{g}Routage{/g} — Attribution d’un trajet ou d’un point de traitement selon les règles du réseau."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri de dépôt{/g} — Premier tri qui répartit les envois entre destinations ou centres."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri de distribution{/g} — Répartition interne qui prépare les zones ou bases de distribution."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri séquentiel{/g} — Classement dans l’ordre prévu d’une tournée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Vidéocodage{/g} — Lecture assistée d’une image de données d’adresse dans un système autorisé."
      }
    ],
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le centre reçoit 850 envois et en transfère 390 vers une autre région. Combien restent pour son flux ?",
    "answer": "460 envois.",
    "calculation": "850 − 390 = 460.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-maths-fiche-2",
    "kind": "maths",
    "prompt": "Trois départs prennent 240, 165 et 95 envois. Calculez le total.",
    "answer": "500 envois.",
    "calculation": "240 + 165 + 95 = 500.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une ligne fictive traite 75 unités par minute pendant six minutes. Calculez le volume.",
    "answer": "450 unités.",
    "calculation": "75 × 6 = 450.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 20 supports expédiés, 18 obtiennent une confirmation. Combien restent à vérifier ?",
    "answer": "Deux supports.",
    "calculation": "20 − 18 = 2.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 2 000 envois, 35 exigent une correction de tri. Calculez le taux au centième.",
    "answer": "1,75 %.",
    "calculation": "35 ÷ 2 000 × 100 = 1,75 %.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-616-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel est le but du premier tri ?",
    "answer": "Orienter l’envoi vers la bonne destination régionale ou le bon centre.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert le tri séquentiel ?",
    "answer": "Préparer l’ordre de remise d’une tournée.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi distinguer lettres et colis dans les équipements ?",
    "answer": "Leurs formats et besoins de traitement diffèrent.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelles données aident à expliquer un écart de tri ?",
    "answer": "Identifiant, destination prévue, traitement observé, moment et point de passage.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qui traite un blocage mécanique dans une zone protégée ?",
    "answer": "Le personnel habilité selon la procédure de l’installation.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un colis se trouve au départ d’une mauvaise région. Quelle suite ?",
    "answer": "Vérifier le dossier puis obtenir la correction et l’enregistrement autorisés avant départ.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-situation-fiche-2",
    "kind": "situation",
    "prompt": "Une machine ne lit pas l’adresse de plusieurs lettres. Comment les orientez-vous ?",
    "answer": "Suivre le parcours de contrôle ou traitement manuel prévu, en protégeant les données.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-616-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un support arrive vide alors que le dossier annonce des envois. Que vérifiez-vous ?",
    "answer": "Le dossier du support et les traces des étapes précédentes, puis transmettre l’écart au responsable.",
    "module": "616",
    "revision": "616-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
