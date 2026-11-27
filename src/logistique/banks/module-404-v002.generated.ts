import type { LogistiqueUnit } from '../approved-banks'

export const module404 = [
  {
    "id": "log-404-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "4. Prescriptions de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Entrepôts ouverts, couverts, fermés",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/404/commun/log-404-abri-photo-v002.webp",
        "alt": "Un auvent protège les palettes devant la porte d’un entrepôt fermé.",
        "caption": "Le stockage sous auvent protège du dessus tout en restant ouvert sur les côtés."
      },
      {
        "kind": "heading",
        "text": "4.1.1 À ciel ouvert",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Biens {g}insensibles{/g} aux intempéries et peu exposés au vol. Terrain accessible, souvent clôturé."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : citernes · vrac (charbon, sable, gravier) · bois non transformé · ciment durci · containers · tubes béton en bloc."
      },
      {
        "kind": "heading",
        "text": "4.1.2 Couverts (semi-ouverts)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toit, {g}ouverts{/g} sur les côtés. Protection soleil/pluie ; insensibles aux variations T°/humidité ; peu de risque de vol."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : engins de chantier · tubes acier · planches brutes · palettes vides · tuiles/briques."
      },
      {
        "kind": "heading",
        "text": "4.1.3 Fermés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandises sensibles aux intempéries ou au vol. Un ou plusieurs étages · murs + toit. Hauts rayonnages : souvent {g}structure de stockage d'abord{/g}, puis enveloppe du bâtiment."
      },
      {
        "kind": "heading",
        "text": "4.2 Hauteurs d'entrepôt",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.2.1 Faible hauteur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stockage au sol · chariots conventionnels (mâts ~{g}7 m{/g}). Courant en {g}PME{/g} · peu coûteux · rayonnages dans locaux existants."
      },
      {
        "kind": "heading",
        "text": "4.2.2 Moyenne hauteur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Jusqu'à ~{g}15 m{/g} · locaux existants souvent ≤ 7 m → nouvelles infrastructures. Engins adaptés : chariots pour rayonnages hauts / allées étroites / mât rétractable / {g}transstockeurs{/g}."
      },
      {
        "kind": "heading",
        "text": "4.2.3 Grande hauteur (MGH)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Jusqu'à ~{g}45 m{/g} · rares en Suisse. Pas de chariots libres traditionnels → systèmes de stockage {g}complexes{/g}."
      },
      {
        "kind": "heading",
        "text": "4.3 Structure de l'entrepôt",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-organisation-photo-v002.webp",
        "alt": "Le hall présente des rangées de palettiers et des voies dégagées.",
        "caption": "La structure, les engins et l’accès aux allées déterminent les possibilités de stockage."
      },
      {
        "kind": "heading",
        "text": "4.3.1 Mécanisés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rayonnages moyens / hauts + {g}transstockeurs à conducteur{/g}. Efficaces pour nombreux articles en petites quantités. Souvent 1 appareil / allée (changement d'allée rare)."
      },
      {
        "kind": "heading",
        "text": "4.3.2 Automatiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Matériel + {g}logiciels{/g} · supervision humaine (dysfonctionnements). Accès restreint — danger {g}mortel{/g} si entrée non autorisée. Transstockeurs commandés par ordinateur (entrée via convoyeurs / sortie via WMS)."
      },
      {
        "kind": "heading",
        "text": "4.3.3 Systèmes complexes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Éléments en réseau : déchargement/chargement · stockage statique/dynamique · convoyeurs continus (bande, rouleaux) · discontinus (chariots, AGV, transstockeurs, monte-charge) · picking · emballage."
      },
      {
        "kind": "paragraph",
        "text": "Défi : harmoniser les performances · une panne ne doit pas tout arrêter."
      },
      {
        "kind": "heading",
        "text": "4.4 Conditions pour un stockage optimal",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stockage professionnel = conservation {g}ordonnée{/g}. Trois principes :"
      },
      {
        "kind": "heading",
        "text": "4.4.1 Propreté",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Locaux, installations, outils, marchandises, voies."
      },
      {
        "kind": "paragraph",
        "text": "Avantages : moins d'accidents · durabilité des équipements · satisfaction collaborateurs · image · moins de pertes/dégradations."
      },
      {
        "kind": "heading",
        "text": "4.4.2 Spaciosité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Assez d'espace → manutention optimale · entrées/sorties plus rapides · moins de recherches/déplacements inutiles · moins d'accidents."
      },
      {
        "kind": "heading",
        "text": "4.4.3 Netteté (clarté)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Zones{/g} : entrée → sortie (+ secteurs selon entreprise)",
          "{g}Zones de stockage{/g} : volume, rotation, valeur, périssabilité, dangerosité…",
          "{g}Marquage / étiquetage{/g} : vue d'ensemble du transit interne",
          "{g}N° d'articles{/g} : identification, information, contrôle, classification",
          "{g}Localisation{/g} : attribution à un emplacement · base de la gestion informatisée · évite recherches et trajets à vide"
        ]
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "4. Prescriptions de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Entrepôts ouverts, couverts, fermés",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/404/commun/log-404-abri-photo-v002.webp",
        "alt": "Un auvent protège les palettes devant la porte d’un entrepôt fermé.",
        "caption": "Le stockage sous auvent protège du dessus tout en restant ouvert sur les côtés."
      },
      {
        "kind": "paragraph",
        "text": "Un stockage {g}ouvert{/g} est exposé aux conditions extérieures. Un dépôt {g}couvert{/g} protège surtout contre les précipitations directes. Un {g}local fermé{/g} permet de mieux maîtriser l’accès et les conditions. Choisissez selon la marchandise, les intempéries, la sécurité et les prescriptions du site."
      },
      {
        "kind": "heading",
        "text": "4.2 et 4.3 Hauteur et structure",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-organisation-photo-v002.webp",
        "alt": "Le hall présente des rangées de palettiers et des voies dégagées.",
        "caption": "La structure, les engins et l’accès aux allées déterminent les possibilités de stockage."
      },
      {
        "kind": "paragraph",
        "text": "La hauteur de stockage dépend du bâtiment, des installations, de la charge et des engins. Les voies, issues et zones de travail doivent rester libres. Contrôlez la {g}charge au sol{/g}, celle des rayonnages et l’accès des moyens de manutention."
      },
      {
        "kind": "heading",
        "text": "4.4 Conditions pour un stockage optimal",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Identifiez les emplacements et organisez un rangement compatible avec le type de bien, le délai et les mouvements. Gardez les charges stables et contrôlez l’état des supports, la lumière, l’air, la température, l’humidité et les nuisibles selon le produit. Les prescriptions relatives aux incendies, marchandises dangereuses et accès s’appliquent au local et à l’activité."
      }
    ],
    "module": "404",
    "revision": "404-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
