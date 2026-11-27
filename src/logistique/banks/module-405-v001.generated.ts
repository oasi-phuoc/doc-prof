import type { LogistiqueUnit } from '../approved-banks'

export const module405 = [
  {
    "id": "log-405-objectifs-apercu",
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
          "Appliquer les règles de {g}sécurité{/g} d'empilage et de rayonnage",
          "Expliquer le principe {g}STOP{/g}, l'organisation des {g}secours{/g} et les bases du {g}temps de travail{/g} apprentis",
          "Décrire prévention et comportement en cas d'{g}incendie{/g}",
          "Citer mesures anti-{g}vol{/g}, règles MD ({g}FDS{/g}, SGH) et lutte contre les {g}nuisibles{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 405",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier les dangers de circulation, de charge, d’incendie et de stockage.",
          "Appliquer la logique STOP et transmettre les écarts au poste compétent.",
          "Interpréter les repères et statuts de prévention sans improviser une intervention."
        ]
      }
    ],
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "5. Dangers dans les entrepôts",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Potentiels fréquents : {g}accidents{/g} · {g}incendie{/g} · {g}vol{/g} · {g}substances dangereuses{/g} · {g}nuisibles{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Techniques de sécurité variables selon produits. Certaines entreprises connaissent les dangers sans appliquer les mesures."
      },
      {
        "kind": "heading",
        "text": "5.1 Risque d'accident",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/405/commun/log-405-notions-1-v001.svg",
        "alt": "Danger. Constat et lieu. Protection. Éviter l’exposition. Alerte. Poste compétent.",
        "caption": "Les mesures sont définies par le site et les personnes habilitées."
      },
      {
        "kind": "paragraph",
        "text": "Beaucoup d'engins + piétons dans un espace restreint. Voies pas toujours séparées → visiteurs particulièrement exposés. Rayonnages aussi soumis aux exigences de sécurité."
      },
      {
        "kind": "paragraph",
        "text": "> Stockage et transport interne = parmi les activités logistiques les {g}plus risquées{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Empiler correctement :{/g} sol plat et porteur · emplacement préparé · pile stable en elle-même · ne pas s'appuyer sur les murs · distances suffisantes · protéger les emballages · petites/légères sur grandes/lourdes · imbrication ou couches intermédiaires."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} plus la pile est haute, plus une irrégularité du sol déplace le centre de gravité → risque d'effondrement + pression asymétrique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge au sol :{/g} max admissible affichée (kg/m² ou N/m²). En logistique : facteur ≈ {g}10{/g} (75 kg → ~750 N). Détails → module {g}408{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rayonnages :{/g} stabilité · ne pas dépasser charges fabricant (traverse, sol, total) · charges réparties. Lisses non vissées → {g}goupilles{/g}. Grilles anti-chute · protections antichocs aux angles. Contrôles réguliers (déformations, goupilles)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Panneaux verticaux :{/g} pas de « feuilletage » manuel · ne pas appuyer sans sécuriser · installations adaptées · compartiments ≤ {g}0,5 m{/g}. Transport : préférer horizontal ; antidérapants."
      },
      {
        "kind": "paragraph",
        "text": "{g}Armoires à tiroirs :{/g} fixer mur/sol · blocage multi-tiroirs · remplir bas → haut · lourds en bas."
      },
      {
        "kind": "paragraph",
        "text": "Toujours dégager {g}voies d'évacuation{/g}, extincteurs, voies de circulation · portes coupe-feu non bloquées."
      },
      {
        "kind": "heading",
        "text": "5.1.1 Types de mesures",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Analyser les facteurs humains, matériels et organisationnels à partir de données datées et du contexte."
      },
      {
        "kind": "heading",
        "text": "5.1.2 Horaires de travail (apprentis CH)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les règles de travail et de repos varient selon la situation et l’âge. Vérifier les prescriptions applicables à l’activité et à la formation."
      },
      {
        "kind": "heading",
        "text": "5.1.3 Organisation des secours",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Adapter à l'entreprise (risques, formation, postes, com, signalisation). S'entraîner. En urgence : {g}Observer → Réfléchir → Agir{/g} (protéger/sauver d'abord, alerter)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Schéma d'annonce :{/g} Qui ? Quoi ? Quand ? Où ? Combien ? Autres dangers ?"
      },
      {
        "kind": "paragraph",
        "text": "Enquêter après incident pour améliorer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Principe STOP{/g} (ordre) : 1. {g}S{/g}ubstitution 2. {g}T{/g}echnique 3. {g}O{/g}rganisationnelle 4. {g}P{/g}ersonnes (EPI, instructions)"
      },
      {
        "kind": "paragraph",
        "text": "Ex. rayonnage mobile EnterSite : cellules HS → plan de travail, pas de chariot pendant picking, gilets, chaussures de sécurité, instruction."
      },
      {
        "kind": "paragraph",
        "text": "EPI logistique : tête · mains · dos (posture) · pieds."
      },
      {
        "kind": "heading",
        "text": "5.2 Risque d'incendie",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Grandes quantités de matériaux → feu vite majeur. Règles : {g}interdiction de fumer{/g} · prudence aux réparations."
      },
      {
        "kind": "heading",
        "text": "5.2.1 Détection / extinction",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Détecteurs{/g} fumée / chaleur (~60 °C) · alarme interne d'abord (ex. 3 min) pour écarter fausse alerte",
          "{g}Sprinklers{/g} : bouchon ~70 °C · jet jusqu'à ~8 m · prudence (dégâts d'eau)",
          "{g}Extinction CO₂{/g} : pas d'eau · quitter la pièce à la pré-alarme (asphyxie)"
        ]
      },
      {
        "kind": "heading",
        "text": "5.2.2 Classes de feu",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Choisir l'agent adapté — mauvais agent = inefficace ou dangereux."
      },
      {
        "kind": "heading",
        "text": "5.2.3 Comportement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Alerter → Sauver → Éteindre{/g} (ne pas retarder l'alarme)."
      },
      {
        "kind": "heading",
        "text": "5.3 Risque de vol",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Causes : contrôles faibles · interfaces · retours négligés · faiblesses orga · absence de directives."
      },
      {
        "kind": "paragraph",
        "text": "Mesures : contrôles E/S fiables · retours soignés · séparation homme/marchandises · moyens techniques · emballage · contrôles sacs/portes."
      },
      {
        "kind": "heading",
        "text": "5.4 Matières dangereuses",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/405/commun/log-405-notions-2-v001.svg",
        "alt": "Identité. Référence et étiquette. Danger. Pictogramme et FDS. Suivi. Zone et consignes.",
        "caption": "Consulter les données du produit et respecter le plan de stockage."
      },
      {
        "kind": "paragraph",
        "text": "Danger pour personnes, animaux, environnement si mauvaise manipulation. Exigences strictes, contrôles autorités."
      },
      {
        "kind": "paragraph",
        "text": "{g}Principe :{/g} confier le choix des conditions de stockage aux personnes compétentes, selon le produit, sa classification et la procédure applicable."
      },
      {
        "kind": "paragraph",
        "text": "{g}FDS (fiche de données de sécurité) :{/g} obligatoire · fabricant/importateur · dangers, protection, stockage, transport, élimination, accidents. Travailleur : suivre instructions / les demander / consulter FDS."
      },
      {
        "kind": "paragraph",
        "text": "{g}SGH/GHS :{/g} 9 symboles (→ module {g}105{/g}) · classification mondiale · commerce · SST / environnement / transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Zones :{/g} pictogrammes Suva + interdiction d'accès."
      },
      {
        "kind": "paragraph",
        "text": "{g}Risques :{/g} incendie (gaz toxiques, explosions, eaux d'extinction) · inondations · fuites/élimination incorrecte."
      },
      {
        "kind": "paragraph",
        "text": "Stockage : réduire risques · respect légal · état de l'art · piles sans endommager les récipients qui tombent."
      },
      {
        "kind": "heading",
        "text": "5.5 Nuisibles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Trois groupes : champignons/bactéries · insectes · petits mammifères."
      },
      {
        "kind": "paragraph",
        "text": "Prévention : entrepôt sec, propre, peu poussiéreux · T°/humidité/lumière défavorables. Lutte : chimie, physique, prédateurs, humain — limitation possible, exclusion totale rare."
      }
    ],
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Alerte{/g} — Signalement selon la procédure d’urgence ou de prévention."
      },
      {
        "kind": "paragraph",
        "text": "{g}Catégorie de danger{/g} — Groupe qui décrit la nature d’un risque identifié."
      },
      {
        "kind": "paragraph",
        "text": "{g}Danger{/g} — Source ou situation susceptible de causer un dommage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Équipement de protection{/g} — Matériel destiné à protéger une personne contre un risque précis."
      },
      {
        "kind": "paragraph",
        "text": "{g}Évacuation{/g} — Passage vers un lieu sûr selon le plan du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}FDS{/g} — Fiche de données de sécurité d’un produit, le cas échéant."
      },
      {
        "kind": "paragraph",
        "text": "{g}Incident{/g} — Événement dont les conséquences réelles ou potentielles demandent un suivi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nuisible{/g} — Organisme susceptible de détériorer ou contaminer les marchandises."
      },
      {
        "kind": "paragraph",
        "text": "{g}Plan d’urgence{/g} — Organisation des alertes, évacuations et responsabilités du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Risque{/g} — Probabilité et conséquences possibles liées à l’exposition à un danger."
      },
      {
        "kind": "paragraph",
        "text": "{g}SGH{/g} — Système de classification et d’étiquetage des produits chimiques."
      },
      {
        "kind": "paragraph",
        "text": "{g}STOP{/g} — Priorité aux mesures de substitution, techniques, organisationnelles et personnelles."
      }
    ],
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-maths-fiche-1",
    "kind": "maths",
    "prompt": "Sur 18 constats, 11 sont clôturés. Combien restent ouverts ?",
    "answer": "Sept constats.",
    "calculation": "18 − 11 = 7.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-maths-fiche-2",
    "kind": "maths",
    "prompt": "Parmi 80 contrôles, huit relèvent un écart de circulation. Calculez le taux.",
    "answer": "10 %.",
    "calculation": "8 ÷ 80 × 100 = 10 %.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une vérification prend 6 minutes par zone. Calculez la durée pour neuf zones successives.",
    "answer": "54 minutes.",
    "calculation": "9 × 6 = 54 min.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un plan fictif indique 22 m de passage principal et 17 m de passage secondaire. Calculez la longueur cumulée.",
    "answer": "39 m.",
    "calculation": "22 + 17 = 39 m.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-maths-fiche-5",
    "kind": "maths",
    "prompt": "Les signalements passent de 16 à 10 sur une période comparable. Calculez la baisse relative.",
    "answer": "37,5 %.",
    "calculation": "(16 − 10) ÷ 16 × 100 = 37,5 %.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-405-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que signifient les lettres STOP ?",
    "answer": "Substitution, mesures techniques, organisationnelles et personnelles, dans cet ordre.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quelle différence entre danger et risque ?",
    "answer": "Le danger peut causer un dommage. Le risque dépend aussi de l’exposition et des conséquences.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que faites-vous d’une voie d’évacuation occupée ?",
    "answer": "Signaler le danger et appliquer la procédure de dégagement ou de sécurisation prévue.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-verification-fiche-4",
    "kind": "verification",
    "prompt": "À quoi sert une fiche de données de sécurité ?",
    "answer": "À retrouver les propriétés de danger, précautions et mesures applicables au produit.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel est le rôle d’un pictogramme SGH ?",
    "answer": "Attirer l’attention sur un danger identifié dans le cadre de l’étiquetage.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un produit inconnu fuit dans une zone de stockage. Quelle première suite donnez-vous ?",
    "answer": "Empêcher l’exposition selon le plan du site, avertir le poste compétent et transmettre les références, sans manipuler le produit.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un engin et des piétons se croisent à un angle avec peu de visibilité. Quelle mesure proposez-vous ?",
    "answer": "Demander une séparation ou une maîtrise du croisement, puis faire vérifier le plan et sa mise en œuvre.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-405-situation-fiche-3",
    "kind": "situation",
    "prompt": "Vous remarquez des signes de dégradation sur deux emballages. Comment réagissez-vous ?",
    "answer": "Repérer les lots, prévenir l’usage et signaler au service désigné.",
    "module": "405",
    "revision": "405-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
