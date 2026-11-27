import type { LogistiqueUnit } from '../approved-banks'

export const module308 = [
  {
    "id": "log-308-theorie-source",
    "kind": "theorie",
    "blocks": [
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
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-qualite-photo-v002.webp",
        "alt": "Une employée mesure le diamètre d’une pièce à l’aide d’un pied à coulisse.",
        "caption": "Choisissez un instrument adapté à la dimension et à la précision demandée."
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
        "kind": "image",
        "src": "/assets/logistique/300/308/commun/log-308-pesee-photo-v002.webp",
        "alt": "Des pièces sont pesées sur une balance, avec un récipient vide près du plateau.",
        "caption": "La tare d’un récipient est retirée du poids brut pour connaître la masse nette."
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
        "src": "/assets/logistique/300/308/commun/log-308-masses-schema-v003.webp",
        "alt": "Une barre partage les 14 kg de masse brute en 12 kg de contenu et 2 kg de tare.",
        "caption": "En retirant 2 kg de tare à la masse brute de 14 kg, on trouve 12 kg de contenu."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "8. Les contrôles de quantités",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "8.1 Mesurer",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Choisissez l’unité selon le produit : pièces, mètres, litres ou kilogrammes. Pour comparer deux valeurs, utilisez la même unité. Par exemple {g}1 pied = 0,3048 m{/g}. Mesurez selon la précision attendue."
      },
      {
        "kind": "heading",
        "text": "8.2 Techniques de comptage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/309/commun/log-309-qualite-photo-v002.webp",
        "alt": "Une employée mesure le diamètre d’une pièce à l’aide d’un pied à coulisse.",
        "caption": "Choisissez un instrument adapté à la dimension et à la précision demandée."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}compteur manuel{/g} aide pour des pièces nombreuses. Pour la longueur, utilisez un mètre ou un instrument adapté. Un {g}volume{/g} peut se lire dans un récipient gradué ou se calculer à partir de dimensions. Le {g}comptage par pesage{/g} nécessite des pièces comparables et une masse unitaire déterminée. Vérifiez le résultat par un comptage de contrôle."
      },
      {
        "kind": "heading",
        "text": "8.3 Utilisation des balances",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/308/commun/log-308-masses-schema-v003.webp",
        "alt": "Une barre partage les 14 kg de masse brute en 12 kg de contenu et 2 kg de tare.",
        "caption": "En retirant 2 kg de tare à la masse brute de 14 kg, on trouve 12 kg de contenu."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/308/commun/log-308-pesee-photo-v002.webp",
        "alt": "Des pièces sont pesées sur une balance, avec un récipient vide près du plateau.",
        "caption": "La tare d’un récipient est retirée du poids brut pour connaître la masse nette."
      },
      {
        "kind": "paragraph",
        "text": "La {g}masse brute{/g} inclut le récipient et son contenu. La {g}tare{/g} correspond au récipient. La {g}masse nette{/g} est le contenu, donc brute moins tare. Mettez la balance à zéro, choisissez une plage adaptée et tarez le contenant. Une {g}calibration{/g} ou un étalonnage compare la mesure à une référence connue. La {g}vérification légale{/g} est requise pour certains usages, notamment lors de transactions, selon les règles de métrologie."
      }
    ],
    "module": "308",
    "revision": "308-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
