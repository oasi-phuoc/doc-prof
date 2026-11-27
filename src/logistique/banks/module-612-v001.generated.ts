import type { LogistiqueUnit } from '../approved-banks'

export const module612 = [
  {
    "id": "log-612-objectifs-apercu",
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
          "Expliquer la {g}planification de tournées{/g} (LIFO, disposition, cadre légal)",
          "Mener une réflexion {g}Make or Buy{/g} / scoring en distribution",
          "Appliquer les bases {g}denrées / chaîne du froid{/g} et les {g}7 principes HACCP{/g}",
          "Relier {g}répartition/arrimage{/g}, regroupage et variantes de {g}Cross-Docking{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 612",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Construire une tournée à partir des étapes, créneaux et contraintes.",
          "Comparer un service interne à un service confié à un partenaire.",
          "Distinguer prévision de trajet, validation du dossier et suivi des écarts."
        ]
      }
    ],
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "12. La planification des transports",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "12.1 En mutation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Objectif : livrer de façon {g}économique{/g}, {g}rapide{/g} et {g}sûre{/g}. Contraintes : écologie · délais clients · pénurie de chauffeurs · pression coûts / énergie (transport parfois > {g}30 %{/g} des coûts logistiques) · sécurité · lois. ~{g}5000{/g} entreprises de transport en CH · majorité des prestations par la {g}route{/g}."
      },
      {
        "kind": "heading",
        "text": "12.2 Principe d'une tournée",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-notions-1-v001.svg",
        "alt": "Départ. Envois et heure. Arrêts. Créneaux et service. Retour. Clôture des dossiers.",
        "caption": "Chaque arrêt tient compte du trajet précédent et du temps de service."
      },
      {
        "kind": "paragraph",
        "text": "Distribution de détail → {g}plan de tournée{/g} selon lieux de déchargement · métier des {g}disponents{/g}."
      },
      {
        "kind": "heading",
        "text": "12.2.1 LIFO",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dernier chargé = premier déchargé. Ex. : Estavayer 1er stop → chargé {g}en dernier{/g} · Genève dernier stop → chargé {g}en premier{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Efficacité aussi : itinéraire / restrictions · véhicules · priorités clients · engins de déchargement · temps de travail/repos chauffeurs."
      },
      {
        "kind": "heading",
        "text": "12.2.2 Organisation (disposition)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Dispositio* = ordre / affectation. Décisions → ordres de transport. {g}Télématique{/g} : localisation, suivi · données : position · ETA · trafic · avancement · temps de conduite restant · pauses · clôture tâche client."
      },
      {
        "kind": "heading",
        "text": "12.2.3 Cadre légal (aperçu)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Abrév.",
          "Domaine"
        ],
        "rows": [
          [
            "{g}LTr{/g}",
            "Travail, pauses, repos"
          ],
          [
            "{g}LCR{/g}",
            "Circulation routière"
          ],
          [
            "{g}OSR{/g}",
            "Signalisation"
          ],
          [
            "{g}RPLP{/g}",
            "Redevance PL (module {g}606{/g})"
          ],
          [
            "{g}OTR{/g}",
            "Durée travail / repos chauffeurs"
          ],
          [
            "{g}ADR/SDR{/g}",
            "Marchandises dangereuses"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.2.4 Planification des tournées",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Données obligatoires : expéditeur / destinataire (adresse, date/heure, particularités) · envoi (type, pièces, dimensions, poids, MD, froid, valeur/assurance)."
      },
      {
        "kind": "paragraph",
        "text": "Facteurs : {g}géographie{/g} (relief, météo, cols, interdictions Gothard/San Bernardino…) · {g}écologie{/g} (km ↓, conso ↓) · {g}rentabilité{/g} (véhicule, itinéraires directs, RPLP, coûts vs revenus)."
      },
      {
        "kind": "paragraph",
        "text": "Étapes : collecter/trier ordres · véhicule optimal · contraintes · chauffeur adapté · enregistrer h/km · améliorer."
      },
      {
        "kind": "heading",
        "text": "12.3 Make or Buy (distribution)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Lien module {g}301{/g}. Opérationnelle (coûts court terme) vs {g}stratégique{/g} (long terme + critères subjectifs · analyse valeur / pondération)."
      },
      {
        "kind": "heading",
        "text": "12.3.1 Critères",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Coûts{/g} · {g}risques{/g} (fiabilité, dépendance prestataires) · {g}qualité{/g} (transparence interne) · {g}image{/g} · {g}liquidités{/g} (investissements flotte) · {g}ressources{/g} (chauffeurs, véhicules)."
      },
      {
        "kind": "heading",
        "text": "12.3.2 Scoring",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Critères pondérés (ex. coûts {g}40 %{/g}) · variantes notées · somme 100 %. Ex. : flotte interne gagne → conserver / développer."
      },
      {
        "kind": "heading",
        "text": "12.3.3 Scoring +/−",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} quantitatif + qualitatif · multi-critères · multi-départements · transparent. {g}−{/g} pondération subjective · effort ↑."
      },
      {
        "kind": "heading",
        "text": "12.4 Denrées périssables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bases : LDA · {g}ODAlOUs{/g} · ordonnances. {g}Devoir d'annonce{/g} (art. 20) si activité alimentaire."
      },
      {
        "kind": "heading",
        "text": "12.4.1 Contenants",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Uniquement contenants alimentaires · symbole {g}verre-fourchette{/g} (UE) = contact alimentaire sûr."
      },
      {
        "kind": "heading",
        "text": "12.4.2 Chaîne du froid",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Réfrigération < {g}+5 °C{/g} · congélation < {g}−18 °C{/g}. Ininterrompue prod. → conso."
      },
      {
        "kind": "paragraph",
        "text": "Indicatifs : beurre +10 · viande / lait +6 · haché/poisson +2 · surgelés −18 · glaces −20. Étiquettes obligatoires."
      },
      {
        "kind": "heading",
        "text": "12.4.3 HACCP",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Hazard Analysis Critical Control Points* · origines spatiales (1959) · hygiène UE depuis 2006."
      },
      {
        "kind": "paragraph",
        "text": "{g}7 principes :{/g} identifier dangers · CCP · valeurs limites · surveillance · mesures correctives · vérification système · {g}documentation{/g}."
      },
      {
        "kind": "heading",
        "text": "12.4.4 Surveillance T°",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Enregistreurs / numérique · pré-refroidir/réchauffer si besoin · panne → informer disponent immédiatement · rupture = risque non-commercialisation."
      },
      {
        "kind": "heading",
        "text": "12.5 Répartition & arrimage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rappel module {g}606{/g} : accélération · décélération · centrifuge · verticales. Légal : ≥{g}20 %{/g} essieu directeur · ≥{g}25 %{/g} tracteur · max essieux / poids total. Responsabilité finale : {g}chauffeur{/g} (même si tiers a chargé). Brochure ASTAG « Charger correctement, arrimer correctement »."
      },
      {
        "kind": "paragraph",
        "text": "La compatibilité des supports, des unités et de l’arrimage se vérifie auprès du personnel qualifié et dans les documents applicables."
      },
      {
        "kind": "heading",
        "text": "12.6 Regroupage & Cross-Docking",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-notions-2-v001.svg",
        "alt": "Entrée. Envoi confirmé. Regroupage. Destination et créneau. Sortie. Départ enregistré.",
        "caption": "L’identifiant et la destination restent visibles entre les quais."
      },
      {
        "kind": "paragraph",
        "text": "{g}Regroupage :{/g} remplir unités à moitié vides pour ↓ km / carburant."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cross-Docking{/g} (module {g}604{/g}) : | Variante | Idée | | --- | --- | | {g}1 étape{/g} | Fournisseur prépare déjà pour le client · réception → expédition | | {g}2 étapes{/g} | Regroupement en nouvelles unités au hub | | {g}Multi-niveaux{/g} | + montage, remplissage, conditionnement, découpe, étiquetage… · éventuellement + stock |"
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} stock ↓ · étapes ↓ · CO₂ ↓. Judicieux : grandes qté stables · périssables · actions · haute valeur / délais courts."
      }
    ],
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Créneau{/g} — Plage convenue pour une prise en charge ou une remise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cross-docking{/g} — Transfert orienté vers l’expédition avec séjour limité et sans mise en stock durable."
      },
      {
        "kind": "paragraph",
        "text": "{g}Délai de service{/g} — Temps prévu ou mesuré dans le périmètre de service."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enlèvement{/g} — Prise en charge à l’origine du trajet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Groupage{/g} — Réunion d’envois dans un flux commun."
      },
      {
        "kind": "paragraph",
        "text": "{g}HACCP{/g} — Démarche de maîtrise des dangers et points critiques dans son champ d’application."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marge de temps{/g} — Temps réservé pour un aléa ou une contrainte."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ordre de transport{/g} — Dossier qui précise le travail et les données à traiter."
      },
      {
        "kind": "paragraph",
        "text": "{g}Planification{/g} — Choix organisé des ressources, trajets, dates et séquences."
      },
      {
        "kind": "paragraph",
        "text": "{g}Preuve de livraison{/g} — Trace de la remise selon les conditions du service."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tournée{/g} — Séquence organisée de points à desservir."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport sous conditions{/g} — Transport prévu avec des paramètres ou contraintes à respecter."
      }
    ],
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une tournée parcourt 44, 37 et 19 km. Calculez la distance totale.",
    "answer": "100 km.",
    "calculation": "44 + 37 + 19 = 100 km.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-maths-fiche-2",
    "kind": "maths",
    "prompt": "Elle part à 7 h 25 et cumule 70 min de trajet et 35 min d’arrêts. Calculez l’arrivée.",
    "answer": "9 h 10.",
    "calculation": "7 h 25 + 105 min = 9 h 10.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un service interne coûte 180 CHF et une option externe 155 CHF plus 35 CHF de transfert. Comparez.",
    "answer": "L’interne est à 180 CHF contre 190 CHF, soit 10 CHF de moins.",
    "calculation": "155 + 35 = 190. 190 − 180 = 10 CHF.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 18 arrêts, 15 sont confirmés. Calculez le reste à vérifier.",
    "answer": "Trois arrêts.",
    "calculation": "18 − 15 = 3.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-maths-fiche-5",
    "kind": "maths",
    "prompt": "On dispose de 240 min. La tournée prévoit 125 min de conduite et 85 d’opérations. Calculez la marge.",
    "answer": "30 minutes.",
    "calculation": "240 − 125 − 85 = 30 min.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles données relever pour bâtir la tournée ?",
    "answer": "Origines, destinations, volumes, délais, exigences, véhicule et contraintes du dossier.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que signifie défendre une marge de temps réaliste ?",
    "answer": "Prévoir du temps pour des imprévus ou contraintes identifiés sans promettre un délai impossible.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quel intérêt a le cross-docking ?",
    "answer": "Orienter les unités reçues vers leur départ sans stockage durable quand le flux le permet.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi comparer deux options au même périmètre ?",
    "answer": "Les frais et responsabilités doivent couvrir les mêmes prestations et contraintes.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quels éléments vérifier pour une denrée sous conditions ?",
    "answer": "Le dossier et les exigences applicables à l’envoi, ainsi que les contrôles du service compétent.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un client impose un créneau qui chevauche un autre arrêt prioritaire. Que faites-vous ?",
    "answer": "Vérifier possibilités et contraintes, puis convenir d’un ajustement autorisé avant confirmation.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un détour menace la qualité de service. Comment gérez-vous l’écart ?",
    "answer": "Évaluer la nouvelle échéance, vérifier la faisabilité et informer le responsable et les destinataires prévus.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-612-situation-fiche-3",
    "kind": "situation",
    "prompt": "Deux lots au même départ ont des conditions différentes. Que vérifiez-vous ?",
    "answer": "La compatibilité selon le dossier et le plan validé, puis les possibilités d’affectation séparée.",
    "module": "612",
    "revision": "612-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
