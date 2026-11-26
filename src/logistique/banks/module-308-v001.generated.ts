import type { LogistiqueUnit } from '../approved-banks'

export const module308 = [
  {
    "id": "log-308-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "Objectifs du module 308",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "À l'issue de ce module, l'apprenti·e est capable de :"
      },
      {
        "kind": "list",
        "items": [
          "Utiliser des {g}unités{/g} courantes et des techniques de comptage par quantités partielles",
          "Choisir des outils de {g}mesure{/g} (longueurs, volumes) adaptés",
          "Distinguer les principaux types de {g}balances{/g} et leur usage",
          "Expliquer {g}tarage{/g}, {g}calibrage{/g} et l'{g}obligation de vérification{/g} en Suisse"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 308",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Ce module traite des {g}contrôles de quantités{/g} : compter, mesurer et peser — unités, techniques et instruments utilisés en logistique."
      },
      {
        "kind": "heading",
        "text": "Vous allez découvrir",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. Unités décimales et étrangères (TEU, gallon…)",
          "2. Techniques de comptage par quantités partielles",
          "3. Mesure longueurs / volumes (pied à coulisse, micromètre, débitmètre…)",
          "4. Types de balances professionnelles",
          "5. Tarage, calibrage et obligation de vérification (métrologie CH)"
        ]
      },
      {
        "kind": "heading",
        "text": "Source",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "EnterSite — Logistics by ASFL / SVBL · Suite du module 307"
      },
      {
        "kind": "heading",
        "text": "8. Les contrôles de quantités",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Le comptage, la mesure et le pesage sont essentiels pour contrôler les marchandises. En Suisse, les unités du Système international ({g}SI{/g}) coexistent dans les documents logistiques avec d’autres unités ou regroupements, par exemple la pinte et la douzaine."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemples d’unités{/g}"
      },
      {
        "kind": "list",
        "items": [
          "Baril de pétrole américain : environ 159 l",
          "Gallon USA : 3,79 l · Gallon GB : 4,55 l",
          "Douzaine : 12 · Grosse : 144 (12×12)",
          "Pouce (inch) : 2,54 cm",
          "Carat : 0,2 g",
          "Paire : 2",
          "Pinte impériale (GB) : environ 0,568 l",
          "Shipping ton (US) : 1,132 m³",
          "{g}TB{/g} : indice de jauge brute d’un navire. Le {g}TJB{/g} désigne une ancienne unité de jauge.",
          "{g}TEU{/g} ou {g}EVP{/g} : équivalent vingt pieds, unité utilisée pour exprimer une capacité en conteneurs."
        ]
      },
      {
        "kind": "heading",
        "text": "8.1 Mesurer",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Souvent longueur / largeur / hauteur. Autrefois : pied, pas, coude… {g}1 pied = 0,3048 m{/g}"
      },
      {
        "kind": "paragraph",
        "text": "En 1791, la France retient pour le mètre le dix-millionième de la distance du pôle à l’équateur le long d’un méridien. Le mètre des Archives, en platine, date de 1799. La Suisse est l’un des 17 signataires de la {g}Convention du mètre{/g} en 1875. Le prototype international en platine-iridium est adopté en 1889. La définition actuelle s’appuie sur la vitesse de la lumière dans le vide."
      },
      {
        "kind": "heading",
        "text": "8.2 Techniques de comptage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Compétences numériques + {g}quantités partielles{/g} pour éviter de tout compter pièce à pièce."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : 1536 pièces en cartons de 12 → 128 cartons × 12 (échantillon du contenu carton). Encore plus simple avec 3 niveaux : pièces/carton × cartons/couche × couches."
      },
      {
        "kind": "paragraph",
        "text": "Ex. simple : 8 pièces/couche × 4 couches = {g}32{/g} Ex. complexe : 2×12 + 1×27 + 3×(4×21) = {g}303{/g}"
      },
      {
        "kind": "heading",
        "text": "8.2.1 Compteur manuel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bouton + affichage cumulatif — grandes quantités sur la durée (ex. visiteurs)."
      },
      {
        "kind": "heading",
        "text": "8.2.2 Mesure des longueurs (quotidien / travail)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mètre courant suffit souvent. Un {g}compteur métrique{/g} peut mesurer la longueur de fils et câbles qui défilent. Un {g}télémètre laser{/g} mesure une distance en ligne droite. Roue de mesure + compteur pour câbles/cordes ; confection automatique chez producteurs."
      },
      {
        "kind": "heading",
        "text": "8.2.3 Accessoires de mesure des longueurs (précision)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mètres pliants/rubans parfois imprécis (plusieurs mm/m). Contrôler la classe de précision ou la tolérance annoncée pour l’instrument et les comparer au besoin du contrôle."
      },
      {
        "kind": "list",
        "items": [
          "{g}Pied à coulisse{/g} : épaisseur, diamètre et profondeur selon le modèle. Vérifier sa résolution et son exactitude.",
          "{g}Micromètre{/g} (palmer) : 0,01 mm à 1/1000 mm · matériaux fins · fragile",
          "{g}Gabarit / chablon{/g} : Poste (tarifs lettres), contrôle vis, tolérances"
        ]
      },
      {
        "kind": "heading",
        "text": "8.2.4 Mesure des volumes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Récipient jaugé ; stations-service : compteur mécanique/électronique."
      },
      {
        "kind": "list",
        "items": [
          "{g}Pompe à piston{/g} : aspiration/refoulement ; compteur × volume cylindre",
          "{g}Débitmètre{/g} : débit liquide/gaz ; aussi ultrasons",
          "{g}Scanner volumétrique{/g} : dimensions emballages/palettes → entrée marchandises, emplacements, chargement transport"
        ]
      },
      {
        "kind": "heading",
        "text": "8.2.5 Mesure du poids",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}masse{/g} s’exprime notamment en kilogrammes. Le {g}poids{/g} est la force de gravité exercée sur l’objet et s’exprime en newtons. Le poids d’un même objet est environ six fois plus faible sur la Lune. Au dépôt, les balances affichent généralement une masse en kilogrammes ou en grammes."
      },
      {
        "kind": "paragraph",
        "text": "Deux principes"
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Comparaison des masses{/g} (avec poids connu)",
          "2. {g}Dynamomètre{/g} (mesure directe de la force)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Balances de comparaison{/g}"
      },
      {
        "kind": "list",
        "items": [
          "{g}Bras égaux{/g} : levier ; poids normalisés jusqu'à équilibre",
          "{g}Romaine{/g} : bras inégaux ; contrepoids mobile + échelle"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Dynamomètre / balances à ressort{/g}"
      },
      {
        "kind": "list",
        "items": [
          "Le ressort se déforme sous l’effet d’une force. Un appareil gradué en masse dépend de la gravité locale. L’usure du ressort peut fausser l’indication dans un sens ou l’autre.",
          "Dynamomètres de traction (grues) : marchandises suspendues, jusqu'à plusieurs tonnes"
        ]
      },
      {
        "kind": "heading",
        "text": "8.2.6 Balances professionnelles",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Usage"
        ],
        "rows": [
          [
            "{g}Balance de table{/g}",
            "Petites marchandises · bureau, petites pièces, sortie"
          ],
          [
            "{g}Balance compteuse{/g}",
            "Poids de référence (ex. 10 pces) → calcule le nombre total · inventaires (vis, clous…)"
          ],
          [
            "{g}Plate-forme de pesage{/g}",
            "Charges importantes · sol ou rampe · Déposer la charge selon les consignes du poste et exclure les masses qui ne font pas partie de la pesée ou les compenser par une tare connue."
          ],
          [
            "{g}Pèse-palettes{/g}",
            "Adapté palettes · moyen de transport non pesé · aussi intégré convoyeurs"
          ],
          [
            "{g}Manutention + pesage{/g}",
            "Transpalette/chariot avec écran · systèmes embarqués camions"
          ],
          [
            "{g}Pont-bascule{/g}",
            "Camions/wagons · poids total − tare véhicule = charge · douanes, gares, transbordement…"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "8.3 Utilisation des balances",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Règles d’utilisation"
      },
      {
        "kind": "list",
        "items": [
          "Instruments de précision : propres, entretien par spécialistes ; ne pas toucher au mécanisme",
          "Respecter charge {g}max{/g} (et parfois min) ; ponts-bascules : pas toujours adaptés aux chariots",
          "Suivre le mode d’emploi, y compris le temps de stabilisation ou de préchauffage s’il est prescrit."
        ]
      },
      {
        "kind": "heading",
        "text": "8.3.1 Tarer et calibrer",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/308/commun/log-308-brut-tare-net-schema-v001.svg",
        "alt": "La masse brute de 6,5 kg moins la tare de 0,7 kg donne une masse nette de 5,8 kg.",
        "caption": "La tare correspond ici à la masse de l’emballage vide."
      },
      {
        "kind": "list",
        "items": [
          "{g}Tarer{/g} : mettre à zéro avec emballage vide → peser sans compter la {g}tare{/g} (poids emballage)",
          "{g}Mise à zéro{/g} : régler l’indication à zéro quand la balance est vide.",
          "{g}Étalonnage{/g} : comparer les indications à des valeurs de référence pour connaître l’écart.",
          "{g}Ajustage{/g} : intervenir sur l’instrument afin d’améliorer ses indications. Il se distingue de l’étalonnage."
        ]
      },
      {
        "kind": "heading",
        "text": "8.3.2 Obligation de vérification",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L’{g}art. 125 Cst.{/g} attribue la compétence en métrologie à la Confédération. La {g}loi fédérale sur la métrologie{/g} et les ordonnances applicables précisent quels usages exigent un contrôle officiel de conformité. Les marquages et l’intervalle de vérification dépendent de la catégorie d’instrument. Une vérification est distincte d’un étalonnage."
      },
      {
        "kind": "paragraph",
        "text": "Plombs de contrôle : ne pas endommager ; manquants/endommagés → signaler + {g}mettre hors service{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemples d’usages réglementés{/g} : mesure utilisée pour une décision douanière ou pour la vente au public de carburant. Les erreurs maximales tolérées dépendent du type d’instrument et de l’usage."
      },
      {
        "kind": "paragraph",
        "text": "Un contrôle interne de mélange peut relever de la procédure de l’entreprise. Pour une vente fondée sur la quantité mesurée ou le contrôle de préemballages, appliquer les prescriptions propres à l’usage."
      }
    ],
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}ajustage{/g} — Intervention qui modifie les indications de l’instrument pour les rapprocher des valeurs attendues."
      },
      {
        "kind": "paragraph",
        "text": "{g}baril de pétrole{/g} — Unité de volume d’environ 159 litres, équivalant à 42 gallons américains."
      },
      {
        "kind": "paragraph",
        "text": "{g}carat métrique{/g} — Unité de masse de 0,2 gramme, notamment employée pour les pierres précieuses."
      },
      {
        "kind": "paragraph",
        "text": "{g}comptage par groupes{/g} — Calcul du nombre d’objets à partir de groupes de même taille, en ajoutant les pièces qui restent."
      },
      {
        "kind": "paragraph",
        "text": "{g}balance compteuse{/g} — Balance qui estime le nombre de pièces d’après la masse mesurée et une masse de référence."
      },
      {
        "kind": "paragraph",
        "text": "{g}compteur manuel{/g} — Instrument qui ajoute une unité au total à chaque action de l’opérateur."
      },
      {
        "kind": "paragraph",
        "text": "{g}débitmètre{/g} — Instrument de mesure d’une quantité qui traverse un circuit par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}douzaine{/g} — Regroupement de douze pièces."
      },
      {
        "kind": "paragraph",
        "text": "{g}dynamomètre{/g} — Instrument qui mesure une force, exprimée notamment en newtons."
      },
      {
        "kind": "paragraph",
        "text": "{g}étalonnage{/g} — Comparaison documentée entre les indications d’un instrument et des valeurs de référence."
      },
      {
        "kind": "paragraph",
        "text": "{g}EVP / TEU{/g} — Équivalent vingt pieds, unité utilisée pour exprimer une capacité en conteneurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}gabarit{/g} — Outil qui aide à vérifier si une pièce respecte des dimensions ou des limites définies."
      },
      {
        "kind": "paragraph",
        "text": "{g}gallon{/g} — Unité de volume valant environ 3,79 litres aux États-Unis ou 4,55 litres dans le système impérial."
      },
      {
        "kind": "paragraph",
        "text": "{g}masse brute{/g} — Masse totale de la marchandise et de son emballage."
      },
      {
        "kind": "paragraph",
        "text": "{g}masse nette{/g} — Masse de la marchandise seule."
      },
      {
        "kind": "paragraph",
        "text": "{g}micromètre{/g} — Instrument de mesure précis employé pour des dimensions adaptées à sa plage de mesure."
      },
      {
        "kind": "paragraph",
        "text": "{g}mise à zéro{/g} — Réglage de l’indication à zéro quand l’instrument est vide."
      },
      {
        "kind": "paragraph",
        "text": "{g}pied à coulisse{/g} — Instrument coulissant qui mesure des dimensions extérieures, intérieures ou des profondeurs, selon le modèle."
      },
      {
        "kind": "paragraph",
        "text": "{g}pinte impériale{/g} — Unité de volume d’environ 0,568 litre."
      },
      {
        "kind": "paragraph",
        "text": "{g}pont-bascule{/g} — Plateforme de pesage destinée notamment aux véhicules."
      },
      {
        "kind": "paragraph",
        "text": "{g}pouce{/g} — Unité de longueur égale à 2,54 centimètres."
      },
      {
        "kind": "paragraph",
        "text": "{g}résolution{/g} — Plus petite variation d’indication que l’on peut lire sur l’instrument."
      },
      {
        "kind": "paragraph",
        "text": "{g}tare{/g} — Masse du contenant ou de l’emballage, que l’on retranche pour obtenir la masse nette."
      },
      {
        "kind": "paragraph",
        "text": "{g}tolérance{/g} — Écart admissible entre une valeur constatée et une valeur spécifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}vérification officielle{/g} — Contrôle de conformité aux prescriptions applicables à un instrument réglementé."
      }
    ],
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-maths-source-1",
    "kind": "maths",
    "prompt": "Vous réceptionnez six fûts contenant chacun 158,8 l d’huile. Pour un exercice de contrôle, prélevez 0,1 % du contenu de chaque fût. Vous utilisez une bouteille de 250 ml et une étiquette par fût. Vérifiez la capacité et calculez le matériel nécessaire.",
    "answer": "Une bouteille suffit par fût. Il faut six bouteilles et six étiquettes.",
    "calculation": "158,8 × 0,001 = 0,1588 l = 158,8 ml. 158,8 ml < 250 ml.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-maths-source-2",
    "kind": "maths",
    "prompt": "Dix boulons de référence pèsent 136,16 g. Un envoi pèse 6,5 kg avec un emballage de 700 g. Estimez le nombre de boulons et arrondissez à la pièce la plus proche.",
    "answer": "L’envoi contient environ 426 boulons. Le nombre exact se confirme par un comptage.",
    "calculation": "6 500 − 700 = 5 800 g. 5 800 × 10 ÷ 136,16 ≈ 425,97, soit 426.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-308-maths-source-3",
    "kind": "maths",
    "prompt": "Le bulletin annonce des écrans de 22, 24 et 15 pouces. Les diagonales mesurées sont respectivement 55,88 cm, 60,96 cm et 38,10 cm. Comparez les diagonales en utilisant 1 pouce = 2,54 cm.",
    "answer": "Les trois diagonales correspondent au bulletin sur ce critère.",
    "calculation": "22 × 2,54 = 55,88. 24 × 2,54 = 60,96. 15 × 2,54 = 38,10.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-maths-source-4",
    "kind": "maths",
    "prompt": "La masse brute d’un envoi est de 7 600 kg. L’emballage représente 7 % de la masse brute. Calculez la tare et la masse nette.",
    "answer": "La tare est de 532 kg et la masse nette de 7 068 kg.",
    "calculation": "7 600 × 0,07 = 532 kg. 7 600 − 532 = 7 068 kg.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-maths-origine-1",
    "kind": "maths",
    "prompt": "Une palette contient quatre couches. Chaque couche comporte six cartons de douze pièces. Calculez le nombre de pièces sur la palette.",
    "answer": "La palette contient 288 pièces.",
    "calculation": "4 × 6 × 12 = 288 pièces.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-source-1",
    "kind": "verification",
    "prompt": "Donnez le volume approximatif d’un gallon américain et celui d’un gallon impérial. Donnez un exemple de produit mesuré avec ces unités.",
    "answer": "Un gallon américain vaut environ 3,79 l et un gallon impérial environ 4,55 l. Un carburant liquide en est un exemple.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-source-2",
    "kind": "verification",
    "prompt": "Comment un pont-bascule permet-il de déterminer la masse de la marchandise transportée par un camion ?",
    "answer": "On soustrait la masse du camion vide à la masse du camion chargé. Les deux mesures sont prises dans des conditions comparables.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-source-3",
    "kind": "verification",
    "prompt": "Expliquez comment une balance à bras égaux permet de déterminer la masse d’une pièce.",
    "answer": "On place la pièce sur un plateau et des masses de référence sur l’autre jusqu’à obtenir l’équilibre.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-source-4",
    "kind": "verification",
    "prompt": "Citez deux exemples où une mesure peut être soumise à des prescriptions de métrologie légale.",
    "answer": "Une mesure utilisée pour la vente au public de carburant ou pour une décision douanière.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-source-5",
    "kind": "verification",
    "prompt": "Que peut-on mesurer avec un pied à coulisse équipé des accessoires habituels ?",
    "answer": "Une dimension extérieure ou intérieure, par exemple un diamètre, et une profondeur.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-origine-1",
    "kind": "verification",
    "prompt": "Quelle est la différence entre mettre à zéro une balance et la tarer avec un contenant vide ?",
    "answer": "La mise à zéro corrige l’indication à vide. La tare déduit la masse du contenant pour afficher celle du contenu.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-verification-origine-2",
    "kind": "verification",
    "prompt": "Quel résultat obtient-on en étalonnant une balance ?",
    "answer": "On connaît les écarts entre les indications de la balance et les valeurs de référence.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-situation-source-1",
    "kind": "situation",
    "prompt": "Vous devez mesurer le diamètre d’une vis, compter des sachets et relever le volume d’eau dans un petit récipient. Associez un instrument à chaque tâche.",
    "answer": "Utiliser un pied à coulisse pour le diamètre, un compteur manuel pour les sachets et un récipient jaugé pour le volume.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-situation-source-2",
    "kind": "situation",
    "prompt": "Le plan exige un diamètre de 8,00 mm avec une tolérance de ±0,05 mm. Votre mesure donne 8,07 mm. Calculez l’intervalle admissible et indiquez la suite à donner.",
    "answer": "L’intervalle va de 7,95 à 8,05 mm. Enregistrer le résultat hors tolérance et signaler l’écart selon la procédure.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-308-situation-source-3",
    "kind": "situation",
    "prompt": "Vous contrôlez un lot de vis identiques avec une balance compteuse. Décrivez la préparation de la balance, l’échantillon de référence et le contrôle du résultat.",
    "answer": "Choisir une balance adaptée, préparer la tare, peser un échantillon compté à la main puis peser le lot. Si le résultat est proche d’un seuil ou inattendu, vérifier par comptage.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-situation-source-4",
    "kind": "situation",
    "prompt": "Sur un fût cylindrique, le rayon intérieur est constant et le niveau du liquide atteint les deux tiers de la hauteur utile. Expliquez comment déterminer la quantité manquante.",
    "answer": "Dans un cylindre de section constante, le liquide occupe les deux tiers du volume utile. La quantité manquante est donc un tiers de ce volume.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-308-situation-origine-1",
    "kind": "situation",
    "prompt": "Une palette arrive avec quatre couches de huit cartons. Une couche a été ouverte et trois cartons ont été retirés. Calculez le nombre reçu et expliquez comment l’inscrire sur le bon.",
    "answer": "4 × 8 − 3 = 29 cartons. Inscrire la quantité comptée et signaler tout écart par rapport à la quantité annoncée.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-308-situation-origine-2",
    "kind": "situation",
    "prompt": "Vous voyez un marquage de vérification endommagé sur une balance utilisée au comptoir. Quelle mesure prenez-vous et que consignez-vous ?",
    "answer": "Écarter l’instrument de cet usage, informer la personne responsable et consigner l’identification de la balance, le défaut constaté et la date.",
    "module": "308",
    "revision": "308-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
