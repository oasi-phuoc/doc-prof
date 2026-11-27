import type { LogistiqueUnit } from '../approved-banks'

export const module410 = [
  {
    "id": "log-410-objectifs-apercu",
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
          "Distinguer convoyage {g}fixe{/g} et engins {g}mobiles{/g}, et citer les convoyeurs {g}verticaux{/g}",
          "Décrire ponts / portiques / {g}Container-Carrier{/g} et appliquer les {g}règles de levage{/g} (dont angle β)",
          "Expliquer les convoyeurs {g}continus{/g} (rouleaux, chaînes) et les {g}éléments de transfert{/g}",
          "Décrire le principe du convoyeur à {g}accumulation{/g} et de la {g}table à billes{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 410",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier les convoyeurs verticaux ou continus à leur fonction dans le flux.",
          "Identifier les zones de transfert, d’accumulation et de sortie.",
          "Reconnaître les limites d’accès et transmettre les incidents au poste qualifié."
        ]
      }
    ],
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "10. Les dispositifs de convoyage",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Contrairement aux chariots de manutention ({g}mobiles{/g}), les systèmes de convoyage sont {g}fixes{/g}. Objectif similaire : amener les marchandises au bon endroit. Le {g}type{/g} et la {g}quantité{/g} déterminent le convoyeur."
      },
      {
        "kind": "heading",
        "text": "10.1 Convoyeur vertical",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/410/commun/log-410-notions-2-v001.svg",
        "alt": "Niveau départ. Zone de remise. Mouvement. Transfert prévu. Niveau arrivée. Zone de reprise.",
        "caption": "Le convoyeur transporte les seules unités prévues par la conception."
      },
      {
        "kind": "paragraph",
        "text": "Transport vers le {g}haut{/g} ou le {g}bas{/g} · complète souvent les convoyeurs horizontaux · liaison entre étages."
      },
      {
        "kind": "heading",
        "text": "10.1.1 Plate-forme / table élévatrice (PEMP)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mouvement {g}alternatif{/g} · souvent sur quais. Structure à {g}ciseaux{/g} hydrauliques (= table élévatrice à ciseaux). Aussi : adapter la hauteur d'un plan de travail. Apparenté : {g}transpalette à ciseaux{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur à étages{/g} (classique) : hisse le produit {g}et{/g} une partie de la voie de transport à l'étage suivant."
      },
      {
        "kind": "heading",
        "text": "10.1.2 Convoyeur en S",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mouvement en forme de {g}S{/g}. Rouleaux à l'étage bas → plates-formes tournantes du convoyeur S (vertical) → rouleaux à l'étage haut. Même idée : {g}Liftveyor{/g} / ascenseur à sacs (produit + élément de voie soulevés ensemble)."
      },
      {
        "kind": "heading",
        "text": "10.1.3 Élévateurs de marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrairement aux monte-charges : transport {g}non accompagné{/g}. Souvent intégrés au flux automatique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chargement / déchargement d'un seul côté{/g} Rouleaux → {g}contrôle de profil{/g} → porte → étage → rouleaux. Capacité limitée (pas de prise/dépose simultanée au même étage). Sécurité d'accès : personnes interdites."
      },
      {
        "kind": "paragraph",
        "text": "{g}Deux côtés{/g} Capacité nettement ↑ : pendant qu'on décharge d'un côté, le chargement suivant est déjà prêt de l'autre · cycles croisés haut/bas."
      },
      {
        "kind": "heading",
        "text": "10.1.4 Monte-charges inclinés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entrepôts (souvent {g}mobiles{/g}), chantiers, fermes (balles de foin). Marchandises moyennes, pas trop lourdes · chargement/déchargement souvent {g}manuel{/g}. Ex. : combiné avec basculement pour rouleaux de papier."
      },
      {
        "kind": "heading",
        "text": "10.2 Engins de levage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Servent à {g}soulever{/g} (pas à transporter sur distance comme un convoyeur)."
      },
      {
        "kind": "heading",
        "text": "10.2.1 Ponts roulants",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Enjambent la surface · rails de chaque côté. {g}Chariot roulant{/g} = mécanisme de levage mobile latéralement sur la charpente. Ex. bipoutre 25 t."
      },
      {
        "kind": "heading",
        "text": "10.2.2 Ponts roulants suspendus",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Charpente {g}suspendue{/g} au rail (rails au plafond) · chariots à membrure inférieure. Plus légers / moins chers que les portiques · pas pour charges très lourdes. Passage possible vers travée voisine / voie suspendue."
      },
      {
        "kind": "paragraph",
        "text": "🔎 Check-lists {g}SUVA{/g} : engins de levage · grues industrie/artisanat."
      },
      {
        "kind": "heading",
        "text": "10.2.3 Portique roulant & Container-Carrier",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Portique{/g} : terminaux conteneurs, ports, zones de transbordement (sur rails)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Container-Carrier (cavalier){/g} : aussi un portique, mais {g}sur roues{/g} (libre) · alternative au chariot élévateur à conteneurs. Empile jusqu'à ~{g}4{/g} conteneurs · cabine ~8 m · mât >10 m · allées très étroites grâce à la construction en portique."
      },
      {
        "kind": "heading",
        "text": "10.2.4 Dispositifs de prise de charge",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Chariot roulant{/g} — déplacement transversal du levage : - {g}Membrure inférieure{/g} (monopoutre) : suspendu à la poutre - {g}Membrure supérieure{/g} (bipoutre) : sur la face supérieure des poutres - {g}Chariot d'angle{/g} : version spéciale"
      },
      {
        "kind": "paragraph",
        "text": "{g}Moufle inférieure & crochet{/g} — palan à câble = {g}mouflage{/g} : - 1 poulie → palan simple · rapport {g}1:2{/g} - 2 poulies → palan double · rapport {g}1:4{/g} Le crochet est fixé au moufle inférieur (partie mobile)."
      },
      {
        "kind": "heading",
        "text": "10.2.5 Règles de levage (grue / pont)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Interdit{/g} de se tenir sous une charge suspendue · signal SUVA · vue d'ensemble · éloigner les non-autorisés",
          "2. Uniquement dispositifs de levage / suspension {g}contrôlés et appropriés{/g} · jamais improvisés · charge nominale inscrite ou code couleur",
          "3. Contrôler régulièrement (fissures, frottement) · retirer si endommagé · attention produits chimiques (capacité ↓ sans dommage visible)",
          "4. Protéger des {g}arêtes vives{/g} (gaines, tuyaux, élingues renforcées)",
          "5. {g}Nœuds interdits{/g} (détruisent le tissu)",
          "6. Jamais poser sangle/élingue sur la {g}pointe{/g} du crochet · linguet fermé · ne pas tordre",
          "7. {g}Centre de gravité{/g} à la verticale sous le crochet · objets longs → {g}palonnier{/g}",
          "8. Respecter l'{g}angle d'inclinaison β{/g} : plus β ↑, capacité ↓ · {g}β > 60° interdit{/g} · à 60° ≈ 50 % · à 45° ≈ 70 %"
        ]
      },
      {
        "kind": "heading",
        "text": "10.3 Convoyeurs continus",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/410/commun/log-410-notions-1-v001.svg",
        "alt": "Entrée. Identification du bac. Transfert. Choix de la branche. Sortie. Contrôle de destination.",
        "caption": "Les zones et leur capacité permettent de comprendre le déplacement."
      },
      {
        "kind": "paragraph",
        "text": "Un convoyeur continu dessert un parcours défini par sa conception. Son mode de mouvement dépend du dispositif."
      },
      {
        "kind": "heading",
        "text": "10.3.1 Convoyeur à rouleaux (galets)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Détail, caisses, palettes · souvent combiné (chaînes, bandes pour pentes/courbes). Intégration possible : remplisseuses, {g}cerclage{/g}. Virages : entraînement souvent par bande."
      },
      {
        "kind": "heading",
        "text": "10.3.2 Convoyeur à chaîne porteuse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entraînement {g}dynamique{/g} (ex. entrée d'entrepôt auto). Chaînes sous les planches extérieures de palette · galets sous la planche centrale = appui. Prise longitudinale ou transversale · combinaison possible avec bande (palettes + Rolltainers)."
      },
      {
        "kind": "paragraph",
        "text": "👉 Ne jamais pénétrer dans l'installation · traverser uniquement sur les {g}ponts{/g} prévus."
      },
      {
        "kind": "heading",
        "text": "10.3.3 Éléments de transfert",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Changer de direction, transférer ou retirer de la ligne."
      },
      {
        "kind": "table",
        "headers": [
          "Élément",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Distributeur à chaîne{/g}",
            "Chaîne se soulève sous la charge → convoyeur parallèle"
          ],
          [
            "{g}Pousseur à chaîne{/g}",
            "Pousse perpendiculairement (rouleaux transversaux / glissière)"
          ],
          [
            "{g}Pousseur légers{/g}",
            "Bras hydraulique · colis postaux / tri"
          ],
          [
            "{g}Table rotative{/g}",
            "Tourne la palette (ex. 90° devant monte-charge)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Signal : galet palpeur ou cellule photoélectrique."
      },
      {
        "kind": "heading",
        "text": "10.3.4 Convoyeur à rouleaux à accumulation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sections commandables individuellement → stocker sans s'empiler. Freinage des rouleaux = arrêt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fonctionnement :{/g} rouleaux de traction (ex. rouges) tirés vers le haut par un {g}ressort{/g} → entraînent les porteurs. Produit sur {g}galet palpeur{/g} → genouillère pousse l'entraînement vers le bas → plus d'entraînement. Galet déchargé → reprise."
      },
      {
        "kind": "heading",
        "text": "10.3.5 Table à billes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Billes encastrées (quelques mm) · déplacement {g}toutes directions{/g} presque sans effort · reconditionnement (grandes feuilles papier…). Variante : buses d'air. Ex. : PEMP mobile + table à billes."
      }
    ],
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Accumulation{/g} — Attente contrôlée d’unités sur une section prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consigne d’accès{/g} — Règle qui détermine où et quand une personne peut entrer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur à bande{/g} — Installation qui transporte les unités sur une bande mobile."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur à rouleaux{/g} — Installation dont les rouleaux supportent le mouvement des unités."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur continu{/g} — Installation assurant un flux successif sur un parcours prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur vertical{/g} — Dispositif destiné à relier des hauteurs ou niveaux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Débit{/g} — Quantité traitée par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Engin de levage{/g} — Équipement qui soulève une charge dans le cadre de sa conception."
      },
      {
        "kind": "paragraph",
        "text": "{g}Élément de transfert{/g} — Dispositif qui change le sens ou la trajectoire d’une unité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Palier{/g} — Niveau ou zone de prise en charge d’une installation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de transfert{/g} — Interface entre deux parties du flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Zone protégée{/g} — Secteur dont les accès sont maîtrisés pour limiter l’exposition."
      }
    ],
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-maths-fiche-1",
    "kind": "maths",
    "prompt": "La ligne traite 30 bacs par minute pendant quatre minutes. Calculez le volume.",
    "answer": "120 bacs.",
    "calculation": "30 × 4 = 120.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une section permet d’attendre 22 bacs et en contient 16. Combien de positions restent libres ?",
    "answer": "Six positions.",
    "calculation": "22 − 16 = 6.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un passage vertical prend 42 secondes par lot. Calculez la durée de cinq passages successifs.",
    "answer": "210 secondes, soit 3 min 30 s.",
    "calculation": "42 × 5 = 210 s = 3 min 30 s.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-maths-fiche-4",
    "kind": "maths",
    "prompt": "Trois sections reçoivent 8, 12 et 14 unités. Calculez le total.",
    "answer": "34 unités.",
    "calculation": "8 + 12 + 14 = 34.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-maths-fiche-5",
    "kind": "maths",
    "prompt": "Une ligne traite 360 unités en 18 minutes effectives sur 24 minutes observées. Comparez les deux débits moyens.",
    "answer": "20 unités/min en fonctionnement et 15 sur la période.",
    "calculation": "360 ÷ 18 = 20. 360 ÷ 24 = 15.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-410-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que permet un convoyeur vertical ?",
    "answer": "Relier des niveaux définis pour des unités compatibles.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert une zone d’accumulation ?",
    "answer": "Absorber temporairement un écart de cadence dans les limites prévues.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-verification-fiche-3",
    "kind": "verification",
    "prompt": "Qu’est-ce qu’un élément de transfert ?",
    "answer": "Un dispositif qui oriente les unités entre tronçons selon le processus.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que signifie une hausse de débit ?",
    "answer": "Davantage d’unités par unité de temps dans le même périmètre.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qui intervient après un blocage dans une zone protégée ?",
    "answer": "Une personne habilitée selon la procédure de l’installation.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un colis reste bloqué dans une zone inaccessible. Comment réagissez-vous ?",
    "answer": "Identifier le lieu et le risque, signaler au poste compétent et ne pas pénétrer dans la zone.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-situation-fiche-2",
    "kind": "situation",
    "prompt": "La section aval est pleine alors que l’amont accélère. Que vérifiez-vous ?",
    "answer": "Valeurs de cadence, état de la zone, limite d’accumulation et consignes de régulation.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-410-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un colis est orienté vers la mauvaise branche. Que consignez-vous ?",
    "answer": "Identifiant, lieu, heure et destination prévue, puis faire appliquer la correction autorisée.",
    "module": "410",
    "revision": "410-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
