import type { LogistiqueUnit } from '../approved-banks'

export const module606 = [
  {
    "id": "log-606-objectifs-apercu",
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
          "Expliquer les atouts / contraintes du {g}transport routier{/g} en Suisse",
          "Relier les {g}forces dynamiques{/g} à la sécurisation du chargement",
          "Appliquer les règles de {g}répartition{/g} (essieux) et citer les moyens d'arrimage",
          "Décrire la {g}RPLP{/g} (objectifs, tarification, utilisation des recettes)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 606",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier le dossier routier au trajet, aux documents et au service prévu.",
          "Distinguer effets du mouvement et limites de l’ensemble véhicule-charge.",
          "Interpréter une redevance chiffrée à partir d’hypothèses explicites."
        ]
      }
    ],
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Le transport routier",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Trafic routier",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/606/commun/log-606-notions-1-v001.svg",
        "alt": "Départ. Véhicule et envois. Trajet. Arrêts et contraintes. Destination. Heure et remise.",
        "caption": "Valider les données du trajet et les transmettre aux personnes concernées."
      },
      {
        "kind": "paragraph",
        "text": "Malgré la {g}RPLP{/g} (depuis 2001), la route reste avantageuse : flexibilité et liberté d'organisation (quoi, quand, où). Idéale pour la {g}distribution fine{/g}. Contreparties : embouteillages · réglementation forte (nuit, dimanche, fériés, temps de conduite…)."
      },
      {
        "kind": "paragraph",
        "text": "Trafic dense surtout sur le {g}plateau{/g} · axe N–S via le {g}Gothard{/g}. Les PL suisses transportent surtout des biens d'approvisionnement (denrées alimentaires en tête, ex. 2019)."
      },
      {
        "kind": "heading",
        "text": "6.1.1 Forces dynamiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une accélération s’exprime en m/s² et une force en N. L’accélération de la pesanteur vaut environ 9,81 m/s²."
      },
      {
        "kind": "table",
        "headers": [
          "Force",
          "Sens / effet"
        ],
        "rows": [
          [
            "{g}Accélération{/g}",
            "Vers l'{g}arrière{/g} · ↑ avec masse et accélération"
          ],
          [
            "{g}Décélération{/g}",
            "Vers l'{g}avant{/g} · inertie · souvent > accélération (freinage fort) · jusqu'à ~1 g"
          ],
          [
            "{g}Centrifuge{/g}",
            "Vers l'{g}extérieur{/g} du virage · ↑ avec rayon ↓ et vitesse · {g}vitesse au carré{/g} (×2 vitesse → ×4 force) · risque de renversement si charge glisse"
          ],
          [
            "{g}Verticales{/g} (vibrations)",
            "Secousses · ↓ frottement / adhérence · charge peut « perdre » le sol → {g}arrimage{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Comprendre ces forces = mieux sécuriser le chargement."
      },
      {
        "kind": "heading",
        "text": "6.1.2 Sécuriser le véhicule",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Avant chargement : véhicule correctement sécurisé (procédures / checklist)."
      },
      {
        "kind": "heading",
        "text": "6.2 Répartition de la charge",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/606/commun/log-606-notions-2-v001.svg",
        "alt": "Total. Masse de l’ensemble. Répartition. Charges et limites locales.",
        "caption": "Seuls les documents applicables valident la configuration réelle."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Bases légales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Positionner pour : - ≥ {g}20 %{/g} du poids effectif sur l'essieu {g}directeur{/g} - ≥ {g}25 %{/g} sur l'essieu {g}tracteur{/g} - ne pas dépasser charges max. / essieu ni {g}poids total{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Permis de circulation : charges essieux · poids à vide · charge utile · poids total."
      },
      {
        "kind": "heading",
        "text": "6.2.2 Chargement et sécurisation",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Mode",
          "Principe"
        ],
        "rows": [
          [
            "Arrimage de {g}blocage{/g}",
            "Contact tous côtés avec parois → pas de déplacement"
          ],
          [
            "Arrimage de {g}force{/g}",
            "Charge libre sur le pont · exigences d'arrimage {g}élevées{/g}"
          ],
          [
            "Plan de {g}répartition{/g}",
            "Vérifie si charge complète peut aller contre paroi frontale"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "6.2.3 Chargement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Palettes : transversal · longitudinal · mixte. Itinéraire de déchargement → {g}LIFO{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Procédure :{/g} 1. Définir le {g}bloc{/g} (L/T/mixte) + {g}centre de gravité{/g} (milieu du bloc) 2. Calculer la {g}longueur{/g} du bloc 3. Centrer sur la surface · répartir selon poids / CdG · LIFO selon tournée 4. Avec plan de charge utile : CdG dans la {g}zone verte{/g} · sinon pas contre la paroi frontale"
      },
      {
        "kind": "heading",
        "text": "6.2.4 Sécurisation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Arrimer contre {g}toutes{/g} les forces dynamiques. Moyens : sangles · chaînes · filets · tapis antidérapants · barres (H/V) · coussins d'air…"
      },
      {
        "kind": "heading",
        "text": "6.3 RPLP",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Depuis 2005 : trains routiers / articulés jusqu'à {g}40 t{/g} (accords bilatéraux UE). Objectif politique : report vers le {g}rail{/g} (transit alpin). RPLP votée 1998 · en vigueur {g}2001{/g} · véhicules > {g}3,5 t{/g} (exceptions)."
      },
      {
        "kind": "paragraph",
        "text": "Vérifier les barèmes et modalités de déclaration officiels applicables au véhicule et au trajet, à la date du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectifs :{/g} freiner hausse du trafic lourd · report rail · ↓ impact environnemental."
      },
      {
        "kind": "paragraph",
        "text": "{g}Recettes :{/g} 1/3 cantons (coûts routiers non couverts) · 2/3 Confédération (ferroviaire, bruit : NLFA, Rail 2000, TGV…). Facturation mensuelle par l'administration des douanes."
      },
      {
        "kind": "paragraph",
        "text": "👉 Coûts élevés → véhicules récents rentables {g}et{/g} plus écologiques."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. EnterSite{/g} — Rupperswil → Marly · {g}122 km{/g} · 26 t · EURO 5 ≈ {g}98.35 CHF{/g} · EURO 6 ≈ {g}72.30 CHF{/g}."
      }
    ],
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Accélération{/g} — Variation de la vitesse par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Arrimage{/g} — Maintien de la charge sur le véhicule selon les règles et dispositifs applicables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge utile{/g} — Quantité ou masse utile prévue dans les limites du véhicule et du dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Desserte routière{/g} — Transport par route reliant les destinations prévues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Essieu{/g} — Élément lié aux roues auquel une charge est attribuée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Force{/g} — Effort exprimé en newtons."
      },
      {
        "kind": "paragraph",
        "text": "{g}Kilométrage{/g} — Distance parcourue dans le périmètre mesuré."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lettre de voiture{/g} — Document qui atteste des données du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Masse{/g} — Grandeur mesurée en kilogrammes ou tonnes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Répartition{/g} — Distribution de la charge selon la configuration du véhicule."
      },
      {
        "kind": "paragraph",
        "text": "{g}RPLP{/g} — Redevance suisse sur le trafic des poids lourds liée aux prestations."
      },
      {
        "kind": "paragraph",
        "text": "{g}Trajet{/g} — Parcours du départ à une destination prévue."
      }
    ],
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un circuit dessert trois sites sur 22, 38 et 24 km. Calculez la distance.",
    "answer": "84 km.",
    "calculation": "22 + 38 + 24 = 84 km.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un trajet de 95 km est suivi d’un retour de 89 km. Calculez le total.",
    "answer": "184 km.",
    "calculation": "95 + 89 = 184 km.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une livraison part à 8 h 35, roule 65 min puis attend 20 min. Calculez l’heure de fin d’attente.",
    "answer": "10 h.",
    "calculation": "8 h 35 + 65 min + 20 min = 10 h.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un lot fictif comprend 12 unités de 45 kg. Calculez la masse.",
    "answer": "540 kg.",
    "calculation": "12 × 45 = 540 kg.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un calcul d’exercice donne 0,03 CHF par tonne-kilomètre avec 12 t et 80 km. Calculez le coût selon cette hypothèse.",
    "answer": "28,80 CHF.",
    "calculation": "0,03 × 12 × 80 = 28,80 CHF.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-606-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel est un avantage fréquent du transport routier ?",
    "answer": "La souplesse de desserte des points accessibles par route.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quelle différence entre accélération et force ?",
    "answer": "L’accélération s’exprime en m/s². Une force s’exprime en N.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi la masse totale ne suffit-elle pas ?",
    "answer": "Les limites et la répartition par essieu et configuration doivent être vérifiées.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelles données alimentent le dossier d’un trajet ?",
    "answer": "Destinations, distances, délais, documents, véhicule et données des unités.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que signifie RPLP ?",
    "answer": "Redevance sur le trafic des poids lourds liée aux prestations.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le trajet initial est fermé. Quelle suite organisez-vous ?",
    "answer": "Vérifier le trajet de remplacement autorisé, la nouvelle heure et les contraintes du véhicule, puis transmettre la mise à jour.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-situation-fiche-2",
    "kind": "situation",
    "prompt": "La masse mesurée diffère du dossier avant départ. Que faites-vous ?",
    "answer": "Suspendre la validation, vérifier l’unité et les limites applicables, puis signaler.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-606-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un devis routier mélange transport et redevance. Quelles précisions demandez-vous ?",
    "answer": "Les distances, données et coûts retenus, et si les postes sont inclus ou séparés.",
    "module": "606",
    "revision": "606-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
