import type { LogistiqueUnit } from '../approved-banks'

export const module301 = [
  {
    "id": "log-301-objectifs-apercu",
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
          "Expliquer le rôle de la {g}logistique d'approvisionnement{/g} et des acheteurs (dont la règle des {g}6B{/g})",
          "Distinguer missions {g}stratégiques{/g} et {g}opérationnelles{/g}",
          "Citer ce que l'entreprise peut s'approvisionner et classer les biens",
          "Expliquer la décision {g}Make or Buy{/g} et l'{g}externalisation{/g}",
          "Décrire comment déterminer {g}quantités{/g} et {g}moments{/g} d'achat (prévisions, saisonnier, spéculatif)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 301",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier le besoin et planifier la disponibilité selon les six bons de la logistique.",
          "Comparer une fabrication interne et un achat sur le coût total, la qualité et le délai.",
          "Décider du déclenchement et de la quantité d’un réapprovisionnement."
        ]
      }
    ],
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. La logistique d'approvisionnement",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Sujet du quotidien à différents niveaux et rôles : personne seule, famille ou {g}entreprise{/g} — chacune doit se procurer des produits. Quantités différentes, mais réflexions et démarche {g}similaires{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Chez les particuliers : fournisseurs et prix souvent connus → achat facile. En entreprise : défi de taille."
      },
      {
        "kind": "paragraph",
        "text": "L'{g}achat{/g} est une tâche centrale. Des spécialistes ({g}acheteurs{/g}) recherchent, négocient et fournissent la marchandise au meilleur rapport qualité/prix et les conditions de livraison."
      },
      {
        "kind": "paragraph",
        "text": "{g}Règle des 6B{/g} (objectif, Jünemann) : {g}bonne{/g} marchandise, {g}bonne{/g} quantité, {g}bonne{/g} qualité, {g}bon{/g} moment, {g}bon{/g} endroit, {g}bon{/g} prix."
      },
      {
        "kind": "paragraph",
        "text": "Défis : large choix dans un monde interconnecté, influences politiques et naturelles, aspects financiers, protection de l'environnement, etc."
      },
      {
        "kind": "heading",
        "text": "1.1 La procédure d'approvisionnement",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/301/commun/log-301-notions-1-v001.svg",
        "alt": "Besoin. Échéance et quantité. Commande. Conditions validées. Disponibilité. Réception et contrôle.",
        "caption": "Le contrôle d’entrée termine le flux d’approvisionnement."
      },
      {
        "kind": "paragraph",
        "text": "Atteindre les objectifs d'achat exige connaissances spécialisées, compétences de négociation et répartition claire des tâches — souvent {g}stratégiques{/g} vs {g}opérationnelles{/g}."
      },
      {
        "kind": "heading",
        "text": "Missions stratégiques (planification)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Négociation des conditions de prix et de livraison",
          "Collaboration au développement des produits",
          "Garantie du savoir-faire (*know-how*)",
          "Optimisation des processus d'approvisionnement",
          "Garantie à long terme des sources d'approvisionnement"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} souvent effectuées par les {g}cadres{/g} de l'approvisionnement."
      },
      {
        "kind": "heading",
        "text": "Missions opérationnelles (exécution)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Passation de la commande",
          "Contrôle des délais",
          "Contrôle de la livraison"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} peuvent être exécutées aussi par des acheteurs juniors. La commande respecte ce qui a été décidé au niveau stratégique."
      },
      {
        "kind": "heading",
        "text": "1.1.1 But de l'approvisionnement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Comme tout individu, l'entreprise se procure ce dont elle a besoin pour fonctionner, par ex. : - biens - informations - prestations de services - capitaux - main-d'œuvre - licences, brevets"
      },
      {
        "kind": "paragraph",
        "text": "Exemples : matières premières (fèves de cacao) ; main-d'œuvre (récolte de légumes)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Catégories de biens à acquérir :{/g} - {g}Biens de consommation durables{/g} - {g}Matériaux de production{/g} — matières premières, matières auxiliaires, consommables - {g}Biens d'équipement{/g} — machines de fabrication/bureau, halles de production et de stockage - {g}Prestations de services{/g} — nettoyage, gardiennage, formation, support informatique"
      },
      {
        "kind": "heading",
        "text": "1.2 Make or Buy (faire ou acheter)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/301/commun/log-301-notions-2-v001.svg",
        "alt": "Faire. Matière, travail et capacité. Acheter. Prix, transport et contrôle.",
        "caption": "Comparer la même quantité, la même qualité et la même échéance."
      },
      {
        "kind": "paragraph",
        "text": "Question du quotidien : « Je le fais ou je l'achète ? » (ex. pain maison vs boulangerie). Facteurs : {g}prix{/g}, {g}qualité{/g}, {g}temps{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Même logique en entreprise : qu'est-ce qui est plus rentable / génère plus de profit — fabriquer soi-même ou faire fabriquer ? Décision ancrée dans la {g}stratégie{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Principe guide :"
      },
      {
        "kind": "paragraph",
        "text": "> Nous ne faisons que ce que nous savons faire {g}mieux{/g} que les autres."
      },
      {
        "kind": "list",
        "items": [
          "{g}Make{/g} — l'entreprise croit être la mieux placée ; s'appuie sur ses {g}compétences clés{/g}.",
          "{g}Buy{/g} — les acheteurs cherchent le producteur le plus apte à fabriquer et livrer."
        ]
      },
      {
        "kind": "heading",
        "text": "1.3 Externalisation (*outsourcing*)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*out* = hors de · *source* = source"
      },
      {
        "kind": "paragraph",
        "text": "Transfert d'une activité (en tout ou en partie) vers un {g}partenaire externe{/g}, basé sur des {g}contrats{/g} (durée, objectif des prestations). Choix du partenaire crucial ; confiance et communication ouverte."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemples typiques :{/g} travaux de nettoyage, assistance informatique, distribution, comptabilité, etc."
      },
      {
        "kind": "heading",
        "text": "1.4 Quelles quantités doit-on acheter ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Question clé : « Combien ? » — comme en cuisine (nombre de convives)."
      },
      {
        "kind": "paragraph",
        "text": "En entreprise : {g}prévision{/g} et {g}planification des besoins{/g} (valeurs empiriques + attentes pour le futur proche). Quantité discutée avec le fournisseur ; conditions de livraison clarifiées."
      },
      {
        "kind": "paragraph",
        "text": "Cela aide à : - fixer les quantités à acheter et le {g}nombre de commandes par an{/g} - définir conditions et modalités de livraison avec le partenaire"
      },
      {
        "kind": "paragraph",
        "text": "Autres aspects : ressources en personnel, capacité de stockage, consommation/écoulement des marchandises → chaque entreprise a une planification {g}individuelle{/g}."
      },
      {
        "kind": "heading",
        "text": "1.5 À quel moment acheter ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Principe : acheter quand les besoins se font sentir. Exceptions : - {g}Produits saisonniers{/g} — disponibles seulement à certaines périodes - {g}Achats spéculatifs{/g} — profiter d'une hausse/baisse de prix (facteurs politiques/économiques). Ex. : pétrole, devises (CHF / EUR) ; aussi situations comme la spéculation sur les masques"
      }
    ],
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Approvisionnement{/g} — Acquisition des ressources nécessaires à une activité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Besoin brut{/g} — Quantité totale demandée sur une période."
      },
      {
        "kind": "paragraph",
        "text": "{g}Besoin net{/g} — Quantité encore à couvrir après les ressources utilisables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Commande{/g} — Demande adressée à un fournisseur selon les conditions convenues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût complet{/g} — Somme des postes de coût compris dans le périmètre défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}Délai{/g} — Temps entre deux événements définis, ici commande et disponibilité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Externalisation{/g} — Transfert d’une activité à un prestataire selon un accord."
      },
      {
        "kind": "paragraph",
        "text": "{g}Faire ou acheter{/g} — Comparaison entre réaliser en interne et acquérir auprès d’un tiers."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Quantité traitée ou commandée ensemble."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande{/g} — Seuil de stock qui déclenche un contrôle ou un réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sourcing{/g} — Recherche et choix des sources d’approvisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — Réserve destinée à couvrir certains aléas."
      }
    ],
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le stock utilisable est de 85 pièces et il en faut 120. Calculez le besoin net.",
    "answer": "35 pièces.",
    "calculation": "120 − 85 = 35 pièces.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-maths-fiche-2",
    "kind": "maths",
    "prompt": "La fabrication consomme 9 CHF de matière, 13,60 CHF de travail, 7,30 CHF de consommables et 8 CHF d’infrastructure par pièce. Calculez le coût.",
    "answer": "37,90 CHF par pièce.",
    "calculation": "9 + 13,60 + 7,30 + 8 = 37,90 CHF.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le prix est de 24 CHF par pièce pour 200 pièces. Le transport coûte 560 CHF au total. Calculez le coût d’achat livré par pièce.",
    "answer": "26,80 CHF par pièce.",
    "calculation": "24 + 560 ÷ 200 = 26,80 CHF.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un fournisseur livre en 4 jours et le contrôle prend 1 jour. L’article est requis le vendredi. Quel jour commandez-vous au plus tard si chaque jour compte ?",
    "answer": "Le dimanche précédent.",
    "calculation": "4 + 1 = 5 jours. Vendredi − 5 jours = dimanche.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-maths-fiche-5",
    "kind": "maths",
    "prompt": "Comparez un coût interne de 37,90 CHF au coût d’achat livré de 26,72 CHF. Calculez l’économie relative au coût interne, au centième près.",
    "answer": "11,18 CHF et 29,50 %.",
    "calculation": "37,90 − 26,72 = 11,18 CHF. 11,18 ÷ 37,90 × 100 ≈ 29,50 %.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-301-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un prix de 24 CHF augmente de 25 %. Les frais restent à 2,80 CHF par pièce. Calculez le total livré.",
    "answer": "32,80 CHF.",
    "calculation": "24 × 1,25 + 2,80 = 32,80 CHF.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-301-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle est la différence entre besoin brut et besoin net ?",
    "answer": "Le brut couvre la demande totale. Le net tient compte de ce qui est disponible ou attendu à temps.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel est l’objectif des six bons ?",
    "answer": "Mettre à disposition le bon produit, dans la bonne quantité, qualité, au bon moment, endroit et coût.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-verification-fiche-3",
    "kind": "verification",
    "prompt": "Citez deux critères de faire ou acheter.",
    "answer": "Par exemple le coût total et le délai, complétés par la qualité et les capacités.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-verification-fiche-4",
    "kind": "verification",
    "prompt": "En quoi une externalisation diffère-t-elle d’un achat ponctuel ?",
    "answer": "Elle confie une activité à un tiers selon un périmètre et une durée.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qu’est-ce qui déclenche une commande au point de commande ?",
    "answer": "Le franchissement du seuil défini pour le stock suivi.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-verification-fiche-6",
    "kind": "verification",
    "prompt": "Citez une tâche opérationnelle et une tâche stratégique.",
    "answer": "Suivre une livraison et choisir une source d’approvisionnement, respectivement.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le prix d’achat est inférieur au coût interne, mais le contrôle exige deux jours de plus. Comment éclairez-vous la décision ?",
    "answer": "Comparez les coûts complets et vérifiez la date réelle de disponibilité avant de recommander une option.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le dépôt annonce 40 pièces libres et 30 réservées. L’atelier en demande 60 aujourd’hui. Que communiquez-vous ?",
    "answer": "Seules 40 sont utilisables pour ce besoin. Signalez les 20 pièces qui manquent et clarifiez le délai.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un client double son volume prévu pour le mois prochain. Que vérifiez-vous ?",
    "answer": "La demande confirmée, le stock, les capacités et délais fournisseurs, puis la date de réévaluation.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-301-situation-fiche-4",
    "kind": "situation",
    "prompt": "Le prestataire proposé réalise l’opération mais ne fournit aucune preuve de contrôle qualité. Que fixez-vous avant l’accord ?",
    "answer": "Définir prestation, critères mesurables, preuve attendue et procédure de traitement des écarts.",
    "module": "301",
    "revision": "301-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
