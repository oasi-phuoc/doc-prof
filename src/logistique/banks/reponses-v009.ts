import type { LogistiqueUnit } from '../approved-banks'

const cases = [
  {
    "code": "105",
    "section": "5.2.4 Évaluer le degré de transformation",
    "q": "Une pièce découpée doit encore être percée puis assemblée. De quelle catégorie relève-t-elle à ce stade ?",
    "answer": "Produit semi-fini",
    "options": [
      "Produit semi-fini",
      "Matière première",
      "Produit fini",
      "Marchandise à éliminer"
    ],
    "list": "Pour une fabrication de caisses, nommez dans l’ordre les trois degrés de transformation, du bois brut à la caisse prête à être livrée.",
    "answers": [
      "Matière première",
      "Produit semi-fini",
      "Produit fini"
    ],
    "ordered": true
  },
  {
    "code": "202",
    "section": "2.4.2 Hygiène personnelle",
    "q": "Après avoir vidé un collecteur de déchets, vous retournez préparer des commandes. Quelle action vient avant la reprise ?",
    "answer": "Appliquer la procédure d’hygiène des mains du poste",
    "options": [
      "Appliquer la procédure d’hygiène des mains du poste",
      "Toucher les articles seulement avec le bord des doigts",
      "Reprendre et nettoyer les mains en fin de journée",
      "Essuyer les mains sur les vêtements de travail"
    ],
    "list": "Avant la reprise au poste, donnez deux points d’hygiène visibles à contrôler, l’un consacré aux mains et l’autre à la tenue.",
    "answers": [
      "Mains propres selon la procédure du poste",
      "Tenue de travail propre"
    ]
  },
  {
    "code": "303",
    "section": "3.3.2 Réception non planifiée",
    "q": "Un camion arrive sans créneau confirmé alors que le quai est occupé. Quelle première décision correspond au processus du site ?",
    "answer": "Signaler l’arrivée et faire confirmer la prise en charge",
    "options": [
      "Signaler l’arrivée et faire confirmer la prise en charge",
      "Commencer le déchargement dès l’arrivée",
      "Enregistrer les quantités prévues comme reçues",
      "Annuler le créneau déjà attribué sans prévenir"
    ],
    "list": "Une arrivée imprévue vient d’être annoncée. Indiquez les deux vérifications qui portent sur le dossier de livraison et la disponibilité du quai.",
    "answers": [
      "Vérifier le dossier ou l’annonce de livraison",
      "Vérifier la disponibilité du quai avec la personne responsable"
    ]
  },
  {
    "code": "306",
    "section": "6.4.2 Échange standard (pièce contre pièce)",
    "q": "Le transporteur apporte deux palettes conformes à l’accord d’échange standard. Quel mouvement règle l’échange sur place ?",
    "answer": "Remettre deux supports admissibles au transporteur",
    "options": [
      "Remettre deux supports admissibles au transporteur",
      "Remettre n’importe quels deux supports de la même taille",
      "Créer automatiquement un crédit pour une palette",
      "Remettre un bon de réception en échange de chaque palette"
    ],
    "list": "Dans un échange pièce contre pièce, indiquez les deux éléments à contrôler dans la remise, l’un portant sur le nombre et l’autre sur l’état des supports.",
    "answers": [
      "Le même nombre de supports admissibles",
      "La conformité des supports aux critères d’échange"
    ]
  },
  {
    "code": "403",
    "section": "3.7 Rayonnage cantilever (porte-à-faux)",
    "q": "Vous devez ranger de longs profilés rigides inadaptés à un palettier ordinaire. Quel système du cours est conçu pour cette forme de marchandise ?",
    "answer": "Rayonnage cantilever",
    "options": [
      "Rayonnage cantilever",
      "Casier en nid d’abeille pour petites pièces",
      "Rayonnage suspendu pour vêtements",
      "Rayonnage dynamique pour cartons unitaires"
    ],
    "list": "Nommez les deux parties du cantilever qui assurent respectivement le portage des produits longs et le maintien vertical de l’installation.",
    "answers": [
      "Les bras en porte-à-faux supportent les produits",
      "Les montants verticaux soutiennent les bras"
    ],
    "ordered": true
  },
  {
    "code": "406",
    "section": "6.3 FIFO — First In, First Out",
    "q": "Les lots A, B et C sont entrés respectivement les 3, 5 et 4 mai. Quel lot sort en premier selon FIFO ?",
    "answer": "Le lot A",
    "options": [
      "Le lot A",
      "Le lot B",
      "Le lot C",
      "Le lot le plus coûteux"
    ],
    "list": "Les lots J, K et L sont entrés respectivement les 7, 4 et 9 juin. Numérotez les trois sorties en appliquant FIFO.",
    "answers": [
      "Lot K",
      "Lot J",
      "Lot L"
    ],
    "ordered": true
  },
  {
    "code": "501",
    "section": "1.3.1 De l'idée au produit",
    "q": "Une caisse réutilisable vient d’être assemblée pour la première fois. Quel est le rôle de cet exemplaire à ce stade ?",
    "answer": "Vérifier la solution avant de décider de la fabrication",
    "options": [
      "Vérifier la solution avant de décider de la fabrication",
      "Tenir lieu systématiquement de stock de vente",
      "Remplacer le cahier des charges du besoin",
      "Fixer la cadence de livraison sans autre essai"
    ],
    "list": "Avant de lancer une série, donnez deux informations à relever lors de l’essai d’un prototype, l’une sur le besoin et l’autre sur l’ajustement des pièces.",
    "answers": [
      "Le prototype satisfait-il le besoin prévu ?",
      "Les pièces s’assemblent-elles correctement ?"
    ]
  },
  {
    "code": "602",
    "section": "2.4.1 Mécaniques",
    "q": "Un instrument fragile peut se déplacer dans sa caisse pendant le trajet. Quel choix répond directement à ce risque ?",
    "answer": "Adapter le calage à la forme et au jeu de l’instrument",
    "options": [
      "Adapter le calage à la forme et au jeu de l’instrument",
      "Poser une nouvelle étiquette d’adresse",
      "Ajouter de l’espace libre autour de l’instrument",
      "Remplacer la déclaration par un ticket de pesée"
    ],
    "list": "Indiquez séparément la fonction du calage interne et celle de la caisse extérieure face aux risques mécaniques.",
    "answers": [
      "Le calage limite les mouvements et les contacts",
      "La caisse maintient et protège le contenu des efforts extérieurs"
    ],
    "ordered": true
  },
  {
    "code": "701",
    "section": "1.5 Causes des différences",
    "q": "Le comptage retrouve 29 unités alors que le système en affiche 35. Quelle démarche doit précéder la validation de la correction de stock ?",
    "answer": "Vérifier le résultat et rechercher la cause de l’écart",
    "options": [
      "Vérifier le résultat et rechercher la cause de l’écart",
      "Corriger le stock en gardant seulement le premier comptage",
      "Reporter l’écart sur une autre référence",
      "Considérer les six unités comme vendues sans pièce justificative"
    ],
    "list": "Une référence montre un manque de six unités. Nommez deux traces de mouvements à comparer pour rechercher une entrée oubliée ou une sortie non saisie.",
    "answers": [
      "Bon de réception ou trace d’entrée",
      "Bon d’expédition ou trace de sortie"
    ]
  },
  {
    "code": "803",
    "section": "3.2 CRM (Customer Relationship Management)",
    "q": "Le service client doit retrouver le dernier échange relatif à une réclamation. Quelle fonction du CRM répond à ce besoin ?",
    "answer": "Retrouver l’historique des interactions du client",
    "options": [
      "Retrouver l’historique des interactions du client",
      "Étalonner la balance du quai",
      "Attribuer un emplacement physique à une palette",
      "Mesurer automatiquement la masse du contenu"
    ],
    "list": "Une collègue reprend la réclamation d’un client. Donnez deux informations à retrouver dans le CRM, l’une qui identifie le client et l’autre qui rappelle les échanges précédents.",
    "answers": [
      "Identifiant ou coordonnées du client",
      "Historique des échanges et de la réclamation"
    ]
  },
  {
    "code": "902",
    "section": "1.4 Transmettre et contrôler",
    "q": "Un écart de quantité a été traité. Quel message permet à l’équipe suivante de contrôler le résultat ?",
    "answer": "Un message indique le dossier, la décision et le contrôle restant",
    "options": [
      "Un message indique le dossier, la décision et le contrôle restant",
      "Un message annonce seulement que le quai est libre",
      "Un message répète le nombre commandé sans identifier le dossier",
      "Un message supprime la trace du premier contrôle"
    ],
    "list": "Vous transmettez le cas d’une livraison partielle à l’équipe suivante. Donnez trois informations distinctes qui lui permettront de retrouver le cas, comprendre la décision puis vérifier la suite.",
    "answers": [
      "La référence du dossier ou du lot",
      "La décision prise à propos de l’écart",
      "Le contrôle restant et son échéance si elle est connue"
    ],
    "ordered": true
  }
]

export const logistiqueResponseExercises: readonly LogistiqueUnit[] = cases.flatMap((entry) => {
  const common = {
    module: entry.code,
    kind: 'verification' as const,
    revision: 'reponses-v009',
    approvedFor: ['501', '902'].includes(entry.code) ? ['CFC'] as const : ['CFC', 'AFP'] as const,
    theorySection: entry.section,
  }
  return [
    { ...common, id: `log-${entry.code}-qcm-v009`, prompt: entry.q, answer: entry.answer, options: entry.options },
    { ...common, id: `log-${entry.code}-lignes-v009`, prompt: entry.list, answer: entry.answers.join('\n'),
      numberedAnswers: entry.answers, ...(entry.ordered ? { orderedAnswers: true } : {}) },
  ]
})

const response = (answer: string) => ({ answer })

export const logistiqueStructuredExercises: readonly LogistiqueUnit[] = [
  {
    id: 'log-105-comparer-conditions-v009', module: '105', revision: 'structures-v009',
    kind: 'verification', approvedFor: ['AFP', 'CFC'], theorySection: "5.3 Les critères d'aptitude au stockage des marchandises",
    prompt: 'Pour chaque marchandise, complétez le risque ou la protection adaptée.',
    answer: 'Adaptez la protection au risque principal.',
    table: { presentation: 'tableau-comparaison', headers: ['Marchandise', 'Risque à maîtriser', 'Protection proposée'],
      rows: [
        ['Verres dans un carton', 'Chocs et pression', response('Cloisons et calage')],
        ['Produit réfrigéré', response('Température inadaptée'), 'Zone réfrigérée et contrôle de température'],
      ] },
  },
  {
    id: 'log-306-comparer-echange-v009', module: '306', revision: 'structures-v009',
    kind: 'situation', approvedFor: ['AFP', 'CFC'], theorySection: "6.4 Procédure d'échange de palettes EURO",
    prompt: 'Deux arrivées sont traitées selon des accords distincts. Complétez la comparaison pour transmettre la décision au quai.',
    answer: 'Appliquez l’accord prévu à l’arrivée et gardez la trace requise par la procédure du site.',
    table: { presentation: 'tableau-comparaison', headers: ['Accord applicable', 'Traitement immédiat', 'Suivi'],
      rows: [
        ['Échange pièce contre pièce', response('Remettre le même nombre de supports admissibles'), 'Enregistrer le mouvement'],
        ['Échange contre un bon', 'Établir le bon prévu', response('Conserver le bon pour suivre et régler la créance de palettes')],
      ] },
  },
  {
    id: 'log-406-comparer-rotation-v009', module: '406', revision: 'structures-v009',
    kind: 'verification', approvedFor: ['AFP', 'CFC'], theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'Les lots 12 et 18 sont entrés respectivement lundi et mercredi. Comparez le résultat selon chacune des règles de l’exercice.',
    answer: 'La règle de sortie détermine le lot prioritaire. Elle ne change pas leur date d’entrée.',
    table: { presentation: 'tableau-comparaison', headers: ['Règle', 'Critère', 'Lot sorti en premier'],
      rows: [
        ['FIFO', 'Entrée la plus ancienne', response('Lot 12')],
        ['LIFO', response('Entrée la plus récente'), 'Lot 18'],
      ] },
  },
  {
    id: 'log-403-classer-installations-v009', module: '403', revision: 'structures-v009',
    kind: 'verification', approvedFor: ['AFP', 'CFC'], theorySection: '3. Les formes de stockage',
    prompt: 'Attribuez à chaque besoin le stockage suspendu, le rayonnage compartimenté ou le rayonnage cantilever. Utilisez chaque forme une fois.',
    answer: 'Les accès et la forme de la marchandise guident le choix du stockage.',
    table: { presentation: 'tableau-classement', headers: ['Besoin', 'Forme de stockage'],
      rows: [
        ['Plusieurs types de longues poutres', response('Rayonnage cantilever')],
        ['Casiers pour petites pièces de formes différentes', response('Rayonnage compartimenté')],
        ['Vêtements préparés sur cintres', response('Stockage suspendu')],
      ] },
  },
  {
    id: 'log-602-classer-contraintes-v009', module: '602', revision: 'structures-v009',
    kind: 'situation', approvedFor: ['AFP', 'CFC'], theorySection: '2.4 Contraintes de protection',
    prompt: 'Avant l’envoi, classez chaque incident possible dans la catégorie mécanique, climatique ou vol.',
    answer: 'Le classement aide à choisir une protection qui répond à chaque risque constaté.',
    table: { presentation: 'tableau-classement', headers: ['Incident possible', 'Catégorie'],
      rows: [
        ['Un carton glisse et heurte la paroi du véhicule', response('Mécanique')],
        ['La condensation atteint les pièces métalliques', response('Climatique')],
        ['Une personne ouvre un colis pour en soustraire une pièce', response('Vol')],
      ] },
  },
  {
    id: 'log-803-classer-fonctions-v009', module: '803', revision: 'structures-v009',
    kind: 'verification', approvedFor: ['AFP', 'CFC'], theorySection: "3. Logiciel d'exploitation",
    prompt: 'Pour orienter les demandes internes, attribuez à chaque demande l’une des trois fonctions ERP, CRM et comptabilité financière.',
    answer: 'La fonction dépend du but du traitement et des utilisateurs concernés.',
    table: { presentation: 'tableau-classement', headers: ['Demande', 'Fonction concernée'],
      rows: [
        ['Reprendre les échanges avec un client au sujet d’une commande', response('CRM')],
        ['Coordonner les informations entre approvisionnement et stock', response('ERP')],
        ['Enregistrer une facture dans les comptes de l’entreprise', response('Comptabilité financière')],
      ] },
  },
  {
    id: 'log-303-ordonner-reception-v009', module: '303', revision: 'structures-v009',
    kind: 'situation', approvedFor: ['AFP', 'CFC'], theorySection: '3.3.1 Réception planifiée',
    prompt: 'Le site impose de vérifier le créneau avant de contrôler les colis. La réception ne peut être enregistrée qu’après ce contrôle. Attribuez à chaque action son rang de 1 à 3.',
    answer: 'Confirmez le créneau, contrôlez la livraison, puis enregistrez les quantités réellement acceptées.',
    table: { presentation: 'tableau-ordre', headers: ['Action', 'Rang'],
      rows: [
        ['Enregistrer les quantités acceptées', response('3')],
        ['Confirmer le créneau', response('1')],
        ['Effectuer le contrôle de la livraison', response('2')],
      ] },
  },
  {
    id: 'log-701-ordonner-inventaire-v009', module: '701', revision: 'structures-v009',
    kind: 'verification', approvedFor: ['AFP', 'CFC'], theorySection: '1.3 Déroulement',
    prompt: 'Vous devez contrôler l’inventaire d’une allée. Attribuez à chaque action son rang de 1 à 3 selon la méthode du cours.',
    answer: 'Le rapprochement a lieu à partir du résultat du comptage préparé.',
    table: { presentation: 'tableau-ordre', headers: ['Action', 'Rang'],
      rows: [
        ['Compter les articles sur place', response('2')],
        ['Rapprocher les deux quantités', response('3')],
        ['Préparer les références à compter', response('1')],
      ] },
  },
  {
    id: 'log-902-ordonner-traitement-v009', module: '902', revision: 'structures-v009',
    kind: 'situation', approvedFor: ['CFC'], theorySection: '1. Une méthode en quatre étapes',
    prompt: 'Vous préparez le suivi d’un écart. Attribuez aux actions du dossier leur rang de 1 à 4 selon la méthode du cours.',
    answer: 'L’analyse donne une base à la décision, qui est ensuite transmise et contrôlée.',
    table: { presentation: 'tableau-ordre', headers: ['Action', 'Rang'],
      rows: [
        ['Prendre une décision', response('3')],
        ['Lire la situation', response('1')],
        ['Transmettre le dossier et contrôler la suite', response('4')],
        ['Calculer les quantités et les comparer', response('2')],
      ] },
  },
]
