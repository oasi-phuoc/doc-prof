import type { LogistiqueUnit } from '../approved-banks'

export const module612 = [
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
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des marchandises se trouvent près d’une porte isolante.",
        "caption": "Avant l’expédition, vérifiez les conditions de conservation et préparez leur suivi pendant le trajet."
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
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-lifo-tournee-schema-v002.webp",
        "alt": "Compartiment de véhicule vu de dessus, lots C, B et A de gauche à droite. Le lot A est près de la porte arrière.",
        "caption": "Avec une seule porte, l’ordre des arrêts aide à positionner les lots. La répartition des masses et l’arrimage restent à vérifier."
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
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités regroupées relient deux zones de quai.",
        "caption": "Le cross-docking réduit l’attente entre l’entrée et la réexpédition grâce aux créneaux et aux données à jour."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "12. La planification des transports",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "12.1 et 12.2 Préparer une tournée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une {g}tournée{/g} regroupe des arrêts ordonnés et un trajet. Vérifiez volumes, masse, accès, créneaux, durée de travail et manutention. Préparez l’ordre de déchargement avec les accès au véhicule. Tenez compte des imprévus et du suivi des statuts."
      },
      {
        "kind": "heading",
        "text": "12.3 Make or Buy (distribution)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le transport {g}propre{/g} permet de maîtriser les moyens. Le transport sous-traité peut augmenter la capacité et la couverture. Comparez coût complet, délais, qualité, risques et souplesse."
      },
      {
        "kind": "heading",
        "text": "12.4 Denrées périssables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des marchandises se trouvent près d’une porte isolante.",
        "caption": "Avant l’expédition, vérifiez les conditions de conservation et préparez leur suivi pendant le trajet."
      },
      {
        "kind": "paragraph",
        "text": "Préservez la {g}chaîne du froid{/g} ou les conditions prévues de la denrée. Vérifiez le véhicule, les températures et les documents. Consignez tout écart et demandez la décision qualité selon la procédure."
      },
      {
        "kind": "heading",
        "text": "12.5 et 12.6 Répartition, arrimage et regroupage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-lifo-tournee-schema-v002.webp",
        "alt": "Compartiment de véhicule vu de dessus, lots C, B et A de gauche à droite. Le lot A est près de la porte arrière.",
        "caption": "Avec une seule porte, l’ordre des arrêts aide à positionner les lots. La répartition des masses et l’arrimage restent à vérifier."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités regroupées relient deux zones de quai.",
        "caption": "Le cross-docking réduit l’attente entre l’entrée et la réexpédition grâce aux créneaux et aux données à jour."
      },
      {
        "kind": "paragraph",
        "text": "Répartissez et arrimez la charge selon les données du véhicule. Le {g}regroupage{/g} réunit plusieurs petits flux. Le {g}cross-docking{/g} organise l’entrée et la réexpédition avec un stockage limité. Il demande des informations et horaires alignés entre les arrivées et départs."
      }
    ],
    "module": "612",
    "revision": "612-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
