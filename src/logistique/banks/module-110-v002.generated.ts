import type { LogistiqueUnit } from '../approved-banks'

export const module110 = [
  {
    "id": "log-110-theorie-source",
    "kind": "theorie",
    "blocks": [
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
        "kind": "image",
        "src": "/assets/logistique/100/103/commun/log-103-preparation-photo-v002.webp",
        "alt": "Une préparatrice contrôle la pièce et le bon associés à la commande.",
        "caption": "En préparation, rapprocher le produit physique des informations de la commande."
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
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Le terminal de l’opératrice enregistre dans quel rayon elle range le colis.",
        "caption": "Le rangement produit une donnée de mouvement. La référence article reste la même."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "10. Définition de la gestion des marchandises",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "10.1 et 10.2 Les tâches de l’entrepôt",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/103/commun/log-103-preparation-photo-v002.webp",
        "alt": "Une préparatrice contrôle la pièce et le bon associés à la commande.",
        "caption": "En préparation, rapprocher le produit physique des informations de la commande."
      },
      {
        "kind": "paragraph",
        "text": "La {g}gestion des marchandises{/g} suit les références, les quantités et les emplacements. Les équipes réceptionnent, contrôlent, rangent, préparent et remettent les unités. Les {g}6B{/g} aident à vérifier la bonne marchandise, quantité, qualité, destination, heure et coût. La disponibilité doit être compatible avec la place, le travail et le budget."
      },
      {
        "kind": "heading",
        "text": "10.3 Importance des données",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un article et ses mouvements doivent rester traçables. Une erreur d’unité entre pièce et carton peut créer un écart au moment de préparer. L’{g}ERP{/g} ou le {g}WMS{/g} associe références, documents, stock et emplacements."
      },
      {
        "kind": "heading",
        "text": "10.4 Données statiques et dynamiques (ERP)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Le terminal de l’opératrice enregistre dans quel rayon elle range le colis.",
        "caption": "Le rangement produit une donnée de mouvement. La référence article reste la même."
      },
      {
        "kind": "paragraph",
        "text": "Les {g}données de base{/g} décrivent ce qui change peu, comme le numéro d’article et son unité. Les {g}données de mouvement{/g} décrivent un événement, par exemple une réception de 24 pièces à une date donnée. Un {g}transfert{/g} change l’emplacement même si le nombre de pièces du site reste identique."
      },
      {
        "kind": "heading",
        "text": "10.5 Domaines de la gestion des matières",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L’{g}approvisionnement{/g} cherche à couvrir les besoins. Le {g}stockage{/g} garde les pièces disponibles. L’{g}intralogistique{/g} organise leur circulation dans le site. La {g}production{/g} transforme ou assemble, tandis que la {g}distribution{/g} remet le produit au client. Les retours et déchets sont orientés vers la filière prévue."
      },
      {
        "kind": "heading",
        "text": "10.6 Indicateurs (KPI)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un {g}indicateur clé de performance (KPI){/g} sert à comparer des résultats sur un périmètre défini. Le {g}taux de service{/g} suit les demandes satisfaites. La {g}rotation des stocks{/g} compare sorties et stock moyen. Le {g}taux de rebut{/g} mesure la part écartée. Un {g}besoin net{/g} tient compte du stock utilisable et des entrées attendues à temps. Par exemple 50 pièces demandées, 20 disponibles et une réception confirmée de 10 donnent un besoin net de 20 pièces."
      }
    ],
    "module": "110",
    "revision": "110-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
