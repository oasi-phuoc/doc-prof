import type { LogistiqueUnit } from '../approved-banks'

export const module301 = [
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
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Une personne examine des offres près de plusieurs modèles de bacs.",
        "caption": "Les fournisseurs se comparent avec des caractéristiques et des conditions communes."
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
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Un atelier fabrique une caisse en bois à partir de planches.",
        "caption": "Pour décider de fabriquer ici ou d’acheter, comparez le travail, les coûts, la qualité et le délai."
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
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Une plateforme peut traiter les arrivées et départs pour le compte d’un donneur d’ordre. Le contrat fixe le service et les contrôles."
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
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Dans ce modèle, le seuil lance la commande avant la rupture. Le délai entre commande et réception doit être couvert."
      },
      {
        "kind": "paragraph",
        "text": "Principe : acheter quand les besoins se font sentir. Exceptions : - {g}Produits saisonniers{/g} — disponibles seulement à certaines périodes - {g}Achats spéculatifs{/g} — profiter d'une hausse/baisse de prix (facteurs politiques/économiques). Ex. : pétrole, devises (CHF / EUR) ; aussi situations comme la spéculation sur les masques"
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "1. La logistique d'approvisionnement",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 La procédure d'approvisionnement",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Une personne examine des offres près de plusieurs modèles de bacs.",
        "caption": "Les fournisseurs se comparent avec des caractéristiques et des conditions communes."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}approvisionnement{/g} assure au bon moment la bonne marchandise, en quantité et qualité prévues, au bon endroit et au bon prix. Ces repères sont les {g}6B{/g}. Les décisions {g}stratégiques{/g} fixent les fournisseurs, les contrats et les règles de stock. Les tâches {g}opérationnelles{/g} suivent le besoin, passent la commande et contrôlent la réception et la facture. On acquiert des matières, des marchandises, des moyens de travail ou des services."
      },
      {
        "kind": "heading",
        "text": "1.2 Make or Buy (faire ou acheter)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Un atelier fabrique une caisse en bois à partir de planches.",
        "caption": "Pour décider de fabriquer ici ou d’acheter, comparez le travail, les coûts, la qualité et le délai."
      },
      {
        "kind": "paragraph",
        "text": "Pour une caisse, comparez la fabrication interne ({g}Make{/g}) et l’achat ({g}Buy{/g}). Analysez la capacité, le coût complet, les délais, la qualité, les compétences et la dépendance au fournisseur. Un prix d’achat seul ne suffit pas à décider."
      },
      {
        "kind": "heading",
        "text": "1.3 Externalisation (outsourcing)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Une plateforme peut traiter les arrivées et départs pour le compte d’un donneur d’ordre. Le contrat fixe le service et les contrôles."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}externalisation{/g} confie une activité à un prestataire. Elle peut dégager des ressources ou apporter une expertise. Définissez le périmètre, la qualité attendue, les contrôles et les conditions de retour ou de continuité du service."
      },
      {
        "kind": "heading",
        "text": "1.4 et 1.5 Quantité et moment",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Dans ce modèle, le seuil lance la commande avant la rupture. Le délai entre commande et réception doit être couvert."
      },
      {
        "kind": "paragraph",
        "text": "Pour choisir la {g}quantité d’achat{/g}, comparez consommation, conditionnement, place, coût et baisse de prix par lot. Pour choisir la {g}date{/g}, calculez à partir de l’échéance et du délai complet, y compris préparation, trajet et réception. La réserve aide à absorber certains aléas."
      }
    ],
    "module": "301",
    "revision": "301-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
