import type { LogistiqueUnit } from '../approved-banks'

export const module405 = [
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
        "src": "/assets/logistique/400/405/commun/log-405-circulation-photo-v002.webp",
        "alt": "Des protections et un marquage séparent une voie piétonne de l’espace des engins.",
        "caption": "Les barrières et protections de montants limitent l’exposition aux engins et aux chocs."
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
        "src": "/assets/logistique/100/107/commun/log-107-filiere-photo-v002.webp",
        "alt": "Des fûts fermés sont conservés sur des dispositifs de rétention distincts.",
        "caption": "Le rangement des produits exige une identification, des contenants adaptés et le respect des règles de séparation."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "5. Dangers dans les entrepôts",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "5.1 Risque d'accident",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/405/commun/log-405-circulation-photo-v002.webp",
        "alt": "Des protections et un marquage séparent une voie piétonne de l’espace des engins.",
        "caption": "Les barrières et protections de montants limitent l’exposition aux engins et aux chocs."
      },
      {
        "kind": "paragraph",
        "text": "Réduisez les croisements entre engins et piétons. Protégez les montants de rayonnage, gardez les passages libres et rangez des charges stables dans la limite admissible. Une {g}protection collective{/g} sépare la circulation ou limite l’exposition. Les {g}EPI{/g} complètent les protections selon la tâche."
      },
      {
        "kind": "heading",
        "text": "5.2 et 5.3 Incendie et vol",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Respectez les consignes de stockage, les issues, la signalisation et les accès aux dispositifs d’alerte. Un {g}accès autorisé{/g} est limité au rôle de la personne. Suivez les mouvements pour expliquer un écart de stock ou une ouverture non prévue."
      },
      {
        "kind": "heading",
        "text": "5.4 Matières dangereuses",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/107/commun/log-107-filiere-photo-v002.webp",
        "alt": "Des fûts fermés sont conservés sur des dispositifs de rétention distincts.",
        "caption": "Le rangement des produits exige une identification, des contenants adaptés et le respect des règles de séparation."
      },
      {
        "kind": "paragraph",
        "text": "Reconnaissez l’étiquetage, les conditions de stockage et les produits qui doivent être séparés. En cas de fuite, éloignez-vous de la zone dangereuse et alertez selon la procédure. Un contenant inconnu ou endommagé doit être traité par les personnes compétentes."
      },
      {
        "kind": "heading",
        "text": "5.5 Nuisibles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Surveillez emballages, denrées et zones de passage. Indiquez l’emplacement et les indices repérés. Le site décide du traitement et du sort des unités selon ses règles d’hygiène et de qualité."
      }
    ],
    "module": "405",
    "revision": "405-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
