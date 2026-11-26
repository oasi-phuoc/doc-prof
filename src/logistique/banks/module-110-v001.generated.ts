import type { LogistiqueUnit } from '../approved-banks'

export const module110 = [
  {
    "id": "log-110-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "Objectifs du module 110",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "À l'issue de ce module, l'apprenti·e est capable de :"
      },
      {
        "kind": "list",
        "items": [
          "Définir la gestion des marchandises et ses niveaux d'intégration",
          "Relier la gestion matière aux {g}6B{/g}",
          "Distinguer objectifs formels, spécifiques et sociaux (et leurs conflits)",
          "Différencier données de {g}base{/g} et de {g}mouvement{/g}",
          "Expliquer déterministe / stochastique / heuristique et le calcul du besoin net",
          "Citer les principes de picking et les KPI courants (rotation, durée, taux de service, ROI)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 110",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Ce module définit la {g}gestion des marchandises{/g} : périmètre, objectifs, données, domaines et indicateurs."
      },
      {
        "kind": "heading",
        "text": "Vous allez découvrir",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. Périmètre et niveaux d'intégration (6B)",
          "2. Objectifs formels, spécifiques et sociaux",
          "3. Données de base vs de mouvement",
          "4. Approvisionnement, intralogistique, production, distribution",
          "5. KPI (rotation, durée, taux de service, ROI…)"
        ]
      },
      {
        "kind": "heading",
        "text": "Source",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "EnterSite — Logistics by ASFL / SVBL"
      },
      {
        "kind": "heading",
        "text": "10. Définition de la gestion des marchandises",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "10.1 Que comprend la gestion des marchandises ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La gestion des marchandises organise les flux physiques et les informations qui les relient. Elle couvre notamment les réceptions, les stocks, l’intralogistique et la préparation des expéditions."
      },
      {
        "kind": "list",
        "items": [
          "{g}Approvisionnement et stockage{/g} — planification des besoins (matières premières, fournitures, produits commerciaux, services, informations) → §10.5.1",
          "{g}Logistique interne{/g} — préparation des commandes et transports internes → §10.5.2",
          "{g}Production et élimination{/g} — flux en production, rebuts et déchets → §10.5.3",
          "{g}Distribution{/g} — livraison des produits prêts à vendre → §10.5.4"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Trois niveaux d'intégration :"
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Gestion intégrée des matières{/g} — articles et infos requis par la production, gérés de façon centrale",
          "2. {g}Gestion intégrée avancée{/g} — approvisionnement de toute l'entreprise (approvisionnement, stocks, planification de production)",
          "3. {g}Gestion totalement intégrée des matériaux{/g} — jusqu'à la livraison au marché des biens et services"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Schéma progressif : Approvisionnement + Logistique + Production → (+ planification production) → (+ distribution)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Difficulté :{/g} faire coïncider les objectifs des services (couvrir les besoins, capacité de livraison, moins de manquants, moins de coûts de stockage…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}À retenir :{/g} dans la gestion matière, le {g}bon article{/g} est mis à disposition au {g}bon moment{/g}, au {g}bon endroit{/g}, dans la {g}bonne quantité{/g}, avec la {g}bonne qualité{/g} et au {g}bon prix{/g} ({g}6B{/g} — Jünemann)."
      },
      {
        "kind": "heading",
        "text": "10.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Organiser les flux et les stocks pour satisfaire les besoins au moment convenu avec des coûts maîtrisés. Les {g}indicateurs{/g} du §10.6 permettent de comparer les résultats et de suivre les effets d’un changement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectif fondamental :{/g} couvrir les besoins de la production et/ou des prestations de service {g}à temps{/g} et de manière {g}économique{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Trois groupes d'objectifs :"
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectifs formels{/g} (plutôt long terme, économiques, en valeur) - {g}Coûts d'achat{/g} — passation de commande + prix d'achat (à minimiser) - {g}Frais de stockage{/g} — capital immobilisé, faible rotation (à maintenir bas) - {g}Coûts de ruptures de stock{/g} — éviter erreurs / mauvaises dates de commande"
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectifs spécifiques{/g} — les 6B (bonne marchandise, endroit, moment, quantité, qualité, prix) + délai fournisseur inférieur au délai client souhaité si pas en stock"
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectifs sociaux / environnementaux{/g} - Emballage respectueux de l'environnement - Recyclage - Protection de l'environnement (ex. transport)"
      },
      {
        "kind": "paragraph",
        "text": "Souvent {g}conflit d'objectifs{/g} (ex. emballage écolo ↑ vs prix ↑)."
      },
      {
        "kind": "heading",
        "text": "10.3 Importance",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Facteur essentiel pour les {g}marges{/g}. Impacts sur qualité, {g}fiabilité des livraisons{/g} et rentabilité."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}diagramme de Sankey{/g} représente les flux par des bandes dont la largeur traduit une grandeur, par exemple le volume ou la masse. Employer la même unité pour toutes les branches comparées."
      },
      {
        "kind": "heading",
        "text": "10.4 Données statiques et dynamiques (ERP)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-gestion-entrepot-schema-v001.svg",
        "alt": "Contrôler la réception — Tracer le mouvement — Préparer la sortie",
        "caption": "La fiche article relie chaque mouvement à une quantité et à un emplacement."
      },
      {
        "kind": "heading",
        "text": "10.4.1 Données de base (Master Data) — statiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Réutilisées pour plusieurs opérations : numéro d’article, désignation, unité de base, poids, volume et, quand le système le prévoit, emplacement fixe ou fournisseur de référence. Une donnée de base peut être actualisée selon la procédure. Aussi : clients, fournisseurs, personnel, nomenclatures / listes de pièces."
      },
      {
        "kind": "heading",
        "text": "10.4.2 Données de mouvement (Transaction Data) — dynamiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Consignent un événement : réception, sortie, transfert, commande ou facture. Les quantités de stock et moyennes de consommation sont des états ou indicateurs calculés à partir des opérations enregistrées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} les mouvements s'appuient sur les données de base. Fiabilité des deux = clé d'une bonne gestion des articles."
      },
      {
        "kind": "heading",
        "text": "10.5 Domaines de la gestion des matières",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "10.5.1 Approvisionnement et stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Fournir matières premières (bois, acier, granulés…), auxiliaires (vis, emballages…), consommables (lubrifiants…), marchandises commerciales (non transformées), services, informations (dessins…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Détermination des besoins — 3 méthodes{/g} 1. {g}Déterministe{/g} (programme) — nomenclatures, gammes, OF, prévisions, commandes (articles coûteux, investissements) 2. {g}Stochastique{/g} (consommation) — historique extrapolé + conjoncture (retail, commandes court terme) 3. {g}Heuristique{/g} — estimation subjective (nouveaux articles)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Questions d'optimisation :{/g} make or buy · besoins nets · choix fournisseur · modes de transport · quand · analyse ABC"
      },
      {
        "kind": "paragraph",
        "text": "Exemple besoin net : - Besoin de 250 pièces pour la date fixée, dont 100 disponibles et 50 attendues à temps. Besoin net : 250 − 100 − 50 = {g}100 pièces{/g} à couvrir."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage :{/g} éviter les attentes ; stocks optimaux ; moins d'intermédiaires ; distances internes courtes ; haute disponibilité. La logistique de stockage décide quoi / où / combien / comment stocker et sortir."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réception :{/g} contrôle identité, quantité, qualité. {g}Entreposage :{/g} emplacement fixe ou flexible, zones par catégorie ou implantation selon la rotation. En emplacement flexible, enregistrer la position réelle du stock à chaque mouvement."
      },
      {
        "kind": "heading",
        "text": "10.5.2 Intralogistique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Préparation des commandes{/g} - 1 étape (par commande) / 2 étapes (par articles, puis répartition) - En série / en parallèle (zones) - Dynamique (marchandise → homme) / statique (homme → marchandise) - Uni- / bi- / multidimensionnelle"
      },
      {
        "kind": "paragraph",
        "text": "Souvent {g}formes mixtes{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transports internes :{/g} mouvements dans l'entreprise ; critères = distance, priorité, délais, volume/poids, capacité engins, sécurité. Objectif : moins de temps de passage et de trajets à vide, coûts ↓, appro production sûr."
      },
      {
        "kind": "heading",
        "text": "10.5.3 Production et élimination",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Questions : quoi produire (type, qty, délais) ? Comment éviter stocks intermédiaires ? Comment organiser transports/trajets ?"
      },
      {
        "kind": "paragraph",
        "text": "Élimination rebuts/déchets : économique, normes de recyclage, environnement (objectifs sociaux). Entrées (MP, énergie…) / sorties (déchets, chaleur, eaux usées, bruit…) — voir module 501."
      },
      {
        "kind": "heading",
        "text": "10.5.4 Distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Livraison des produits demandés par le marché. Questions : emballage transport, sécurité, make or buy, transporteurs, vente directe/indirecte."
      },
      {
        "kind": "heading",
        "text": "10.6 Indicateurs (KPI)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Chiffre pour évaluer / comparer un contexte opérationnel ou économique. En gestion des matières : {g}Key Performance Indicators{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemples{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Rotation des stocks = sorties de la période ÷ stock moyen, exprimés dans la même unité. Ex. 150 000 / 100 000 = {g}1,5×{/g} (stock renouvelé 1,5 fois)"
      },
      {
        "kind": "paragraph",
        "text": "Durée moyenne de stockage = nombre de jours de la période ÷ rotation du stock sur cette période. Ex. 360 / 1,5 = {g}240 jours{/g} Pour cet exemple, on utilise une année conventionnelle de {g}360 jours{/g}. Indiquer la convention utilisée dans le résultat."
      },
      {
        "kind": "paragraph",
        "text": "Taux de service = commandes satisfaites selon le critère retenu ÷ commandes reçues × 100. Préciser la période et le critère, par exemple livraison complète. Ex. 237 ÷ 262 × 100 ≈ {g}90,46 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Intensité matières = achats × 100 / CA Ex. 82 millions de francs ÷ 154 millions de francs × 100 ≈ {g}53,25 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}ROI (Du Pont, 1919) :{/g} rentabilité mesurée au capital investi — système d'indicateurs reliant plusieurs ratios."
      },
      {
        "kind": "paragraph",
        "text": "Autres ratios de stockage : voir le recueil de formules logistique."
      }
    ],
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}approvisionnement{/g} — Activités qui permettent de disposer des articles nécessaires au moment voulu."
      },
      {
        "kind": "paragraph",
        "text": "{g}besoin net{/g} — Quantité encore à couvrir après prise en compte du stock utilisable et des réceptions attendues à temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}donnée de base{/g} — Information de référence réutilisée dans plusieurs opérations, comme la désignation d’un article."
      },
      {
        "kind": "paragraph",
        "text": "{g}donnée de mouvement{/g} — Enregistrement d’une opération, avec par exemple article, quantité, date et emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}ERP{/g} — Progiciel de gestion intégré qui partage les informations entre des activités comme les achats, les stocks et la vente."
      },
      {
        "kind": "paragraph",
        "text": "{g}intralogistique{/g} — Organisation des déplacements, du stockage et de la préparation des marchandises au sein d’un site ou d’une entreprise."
      },
      {
        "kind": "paragraph",
        "text": "{g}inventaire{/g} — Comptage ou contrôle physique des articles, comparé au stock enregistré."
      },
      {
        "kind": "paragraph",
        "text": "{g}réapprovisionnement{/g} — Action destinée à reconstituer un stock ou la quantité disponible à un emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}rebut{/g} — Produit ou partie de produit écarté parce qu’il ne satisfait pas aux critères retenus."
      },
      {
        "kind": "paragraph",
        "text": "{g}rotation du stock{/g} — Rapport entre les sorties de la période et le stock moyen, dans la même unité."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock disponible{/g} — Quantité utilisable pour le besoin considéré après prise en compte des réservations et blocages."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock moyen{/g} — Quantité moyenne en stock pendant la période d’observation."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock de sécurité{/g} — Quantité prévue pour couvrir des variations de demande ou de délai."
      },
      {
        "kind": "paragraph",
        "text": "{g}taux de livraison à temps{/g} — Part des livraisons effectuées au plus tard à la date prévue, selon le périmètre défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}taux de service{/g} — Part des demandes ou commandes satisfaites selon les critères retenus."
      },
      {
        "kind": "paragraph",
        "text": "{g}unité de base{/g} — Unité utilisée pour enregistrer ou convertir les quantités d’un article, par exemple pièce, kilogramme ou litre."
      }
    ],
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-maths-origine-1",
    "kind": "maths",
    "prompt": "Sur 750 moniteurs livrés pendant l’année, 670 sont arrivés à la date prévue ou avant. Calculez le taux de livraison à temps, au centième de pour cent.",
    "answer": "Le taux de livraison à temps est de 89,33 %.",
    "calculation": "670 ÷ 750 × 100 ≈ 89,33 %.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-maths-origine-2",
    "kind": "maths",
    "prompt": "Les sorties annuelles d’un article sont de 450 pièces et le stock moyen est de 40 pièces. Calculez la rotation et la durée moyenne de stockage avec une année conventionnelle de 360 jours.",
    "answer": "Le stock tourne 11,25 fois par an. La durée moyenne de stockage est de 32 jours.",
    "calculation": "450 ÷ 40 = 11,25 rotations. 360 ÷ 11,25 = 32 jours.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-110-maths-origine-3",
    "kind": "maths",
    "prompt": "Un atelier produit 350 pièces. Il écarte 27 pièces comme rebuts. Calculez le taux de rebut au centième de pour cent.",
    "answer": "Le taux de rebut est de 7,71 %.",
    "calculation": "27 ÷ 350 × 100 ≈ 7,71 %.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-maths-origine-4",
    "kind": "maths",
    "prompt": "Les achats de marchandises d’une entreprise fictive s’élèvent à 154,7 millions de francs et son chiffre d’affaires à 228 millions. Quelle part les achats représentent-ils, au centième de pour cent ?",
    "answer": "Les achats de marchandises représentent 67,85 % du chiffre d’affaires.",
    "calculation": "154,7 ÷ 228 × 100 ≈ 67,85 %.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-110-maths-origine-5",
    "kind": "maths",
    "prompt": "Une commande demande 450 pièces. Il en reste 78 disponibles et 120 autres arriveront avant la préparation. Combien de pièces faut-il encore couvrir ?",
    "answer": "Le besoin net est de 252 pièces.",
    "calculation": "450 − 78 − 120 = 252 pièces.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-maths-creation-6",
    "kind": "maths",
    "prompt": "Un article compte 85 pièces disponibles le matin. L’équipe réceptionne 24 pièces en bon état puis en expédie 37. Quel est le stock disponible si aucune pièce n’est réservée ou bloquée ?",
    "answer": "Le stock disponible est de 72 pièces.",
    "calculation": "85 + 24 − 37 = 72 pièces.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-origine-1",
    "kind": "verification",
    "prompt": "Classez le numéro d’article, l’unité de base, une réception aujourd’hui et la sortie d’hier en données de base ou données de mouvement.",
    "answer": "Le numéro d’article et l’unité de base sont des données de base. La réception et la sortie sont des données de mouvement.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-origine-2",
    "kind": "verification",
    "prompt": "Citez deux activités d’intralogistique au sein d’un dépôt.",
    "answer": "La préparation des commandes et les transports internes.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-origine-3",
    "kind": "verification",
    "prompt": "Donnez un objectif économique, un objectif lié au service et un objectif environnemental pour un dépôt.",
    "answer": "Par exemple réduire le coût de stockage, livrer les articles à la date demandée et favoriser le réemploi des emballages.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-origine-4",
    "kind": "verification",
    "prompt": "Pourquoi un stock très bas et une livraison rapide peuvent-ils être difficiles à concilier ?",
    "answer": "Un stock bas limite les coûts mais laisse moins de marge devant une hausse de demande ou un retard d’approvisionnement.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-origine-5",
    "kind": "verification",
    "prompt": "Rappelez les six éléments à contrôler pour la disponibilité d’un article selon les 6B.",
    "answer": "La bonne marchandise, au bon moment, au bon endroit, en bonne quantité, en bonne qualité et au bon prix.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-verification-creation-6",
    "kind": "verification",
    "prompt": "Expliquez pourquoi le délai de référence d’un fournisseur et la date de livraison d’une commande donnée appartiennent à des catégories différentes.",
    "answer": "Le délai de référence est un paramètre de planification réutilisé. La date prévue dans une commande appartient à cette transaction.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-110-situation-creation-1",
    "kind": "situation",
    "prompt": "Le bon de livraison indique 36 cartons. Vous en comptez 35, dont un endommagé. Qu’indiquez-vous à la réception ?",
    "answer": "Enregistrer ou signaler 35 cartons reçus, dont un endommagé. Appliquer la procédure d’écart et isoler le carton abîmé si nécessaire avant qu’il ne devienne disponible.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-situation-creation-2",
    "kind": "situation",
    "prompt": "La fiche indique une unité de base en pièces. Le fournisseur envoie cinq cartons de douze pièces chacun. Décrivez le contrôle à faire avant de valider la réception.",
    "answer": "Vérifier le conditionnement et l’unité d’enregistrement. Si tous les cartons sont complets et acceptés, valider une entrée de 5 × 12 = 60 pièces.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-situation-creation-3",
    "kind": "situation",
    "prompt": "Un article est placé dans un nouvel emplacement. Le stock total reste identique. Quelle donnée devez-vous enregistrer pour faciliter le prochain prélèvement ?",
    "answer": "Enregistrer le transfert avec l’article, la quantité déplacée et les emplacements de départ et d’arrivée, selon la procédure.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-situation-creation-4",
    "kind": "situation",
    "prompt": "Un client demande 40 pièces pour demain. Le dépôt en a 30. Une réception de 20 pièces est prévue après-demain. Que faut-il faire ?",
    "answer": "Le besoin non couvert pour demain est de 10 pièces. Vérifier une autre source ou une avance de livraison, puis communiquer un délai réaliste selon la procédure.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-110-situation-creation-5",
    "kind": "situation",
    "prompt": "Deux équipes calculent un taux de service. L’une compte les commandes livrées intégralement, l’autre les lignes livrées. Que faut-il fixer avant de comparer les taux ?",
    "answer": "Fixer une même unité de comptage, une même période, le critère de service et le traitement des livraisons partielles puis recalculer.",
    "module": "110",
    "revision": "110-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
