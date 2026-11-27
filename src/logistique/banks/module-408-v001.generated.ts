import type { LogistiqueUnit } from '../approved-banks'

export const module408 = [
  {
    "id": "log-408-objectifs-apercu",
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
          "Expliquer la {g}planification{/g} et l'agencement d'un entrepôt",
          "Distinguer les entrepôts par {g}fonction{/g} et les formes au sol",
          "Calculer / interpréter {g}charge au sol{/g}, {g}Ast{/g}, taux d'{g}occupation{/g} surface et espace",
          "Décrire charges de rayonnage, {g}numérotation{/g}, {g}flux{/g} interne et {g}images de stock{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 408",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer surfaces brutes, utiles et occupées dans un dépôt.",
          "Lire les coordonnées d’emplacement et organiser des flux compréhensibles.",
          "Interpréter un ratio d’utilisation et vérifier les contraintes locales."
        ]
      }
    ],
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "8. Organisation de l'entrepôt",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Objectif : flux de marchandises le {g}plus court et simple{/g} possible. Les exemples sont indicatifs selon la tâche de l'entreprise."
      },
      {
        "kind": "heading",
        "text": "8.1 Structure d'une entreprise de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Recevoir de grandes quantités, stocker, livrer selon besoin. Besoins typiques : - réception performante - capacité de stockage suffisante - secteur {g}préparation de commandes{/g} - service {g}expédition{/g}"
      },
      {
        "kind": "heading",
        "text": "8.2 Planification d'un entrepôt",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-notions-1-v001.svg",
        "alt": "Réception. Contrôle d’entrée. Stock. Adresses et circulation. Expédition. Préparation et départ.",
        "caption": "Le plan prend aussi en compte les accès et la circulation."
      },
      {
        "kind": "paragraph",
        "text": "Planification complexe, individuelle — avantage concurrentiel (JIT). Circulation fluide au premier plan."
      },
      {
        "kind": "paragraph",
        "text": "{g}Questions clés :{/g} flux optimal · quelles marchandises/quantités · exigences (périssable, vol, MD) · fonctions (tampon…) · charge au sol / occupation · rayonnages, ERP, engins · chaotique vs case · automatisation · extensions."
      },
      {
        "kind": "paragraph",
        "text": "S'appuyer sur plans, chiffres clés (rotation, stock moyen), {g}ABC{/g}. Réserver de la capacité en pointe. Occupation optimale des emplacements : {g}80–90 %{/g} max (au-delà → problèmes quotidiens)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Agencement{/g} : plan d'implantation (flux, zones, rayonnages). Après mise en service : vérifier/optimiser. Simulations numériques pour détecter les erreurs avant aménagement."
      },
      {
        "kind": "heading",
        "text": "8.3 Types d'entrepôts par fonction",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Intermédiaire{/g}",
            "Tampon entre étapes de process"
          ],
          [
            "{g}Produits finis{/g}",
            "Attente expédition · délai ↓ · près de l'expédition"
          ],
          [
            "{g}Transbordement{/g}",
            "Court séjour · réception diverse → points de vente (distribution)"
          ],
          [
            "{g}Approvisionnement / MP{/g}",
            "Garantir le flux de production"
          ],
          [
            "{g}Préparation de commandes{/g}",
            "Accès efficace · espace/temps/coûts"
          ],
          [
            "{g}Réserve{/g}",
            "Fluctuations · faible rotation · stocks élevés"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "8.4 Formes simples (sol)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sans rayonnage · extérieur ou fermé · volumineux/lourds/vrac."
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} pas d'installations · organisation simple · surfaces flexibles {g}−{/g} peu mécanisable · hauteur limitée · mauvaises vue d'ensemble si gros stocks"
      },
      {
        "kind": "heading",
        "text": "8.4.1 Blocs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bonne occupation · pas d'accès direct à chaque unité · {g}FIFO difficile{/g} · grandes quantités homogènes · attention pression d'empilement."
      },
      {
        "kind": "heading",
        "text": "8.4.2 Rangées / lignes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Allées entre rangées · occupation ↓ · accès ↑ · FIFO possible · meilleure vue."
      },
      {
        "kind": "heading",
        "text": "8.4.3 Épis",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Moins de temps de manœuvre · occupation encore ↓ · rare (accès prioritaire sur occupation)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} forme compacte = meilleure occupation, temps d'accès ↑."
      },
      {
        "kind": "heading",
        "text": "8.5 Charge au sol",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Forces {g}statiques{/g} (stock) et {g}dynamiques{/g} (engins). Rayonnages/préparateurs → charges {g}ponctuelles{/g} élevées. Afficher le max (norme : blanc sur bleu). Sans panneau ≠ illimité → vérifier ingénieur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conversion :{/g} 1 kg ≈ {g}10 N{/g} (pratique ; physique 9,81). Palette 1000 kg → ~10 000 N."
      },
      {
        "kind": "paragraph",
        "text": "Rayonnage : jusqu'à {g}7 t+{/g} sous un montant (~100 cm²). Même somme de forces qu'en bloc, mais concentrée."
      },
      {
        "kind": "paragraph",
        "text": "Engins : charges dynamiques (transstockeur jusqu'à ~20 t) · fortes à l'arrêt (ex. fourches latérales en hauteur)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Autres facteurs :{/g} qualité du sol · hauteur locaux · accès (portes, ascenseur) · climat."
      },
      {
        "kind": "heading",
        "text": "Exemples",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. 80 palettes × 850 kg sur 10×13 m → ~{g}5230 N/m²{/g} (523 kg/m²)",
          "2. Un calcul de charge moyenne ne détermine pas le nombre admissible de palettes. L’implantation, les charges ponctuelles et les données de l’installation restent à vérifier."
        ]
      },
      {
        "kind": "heading",
        "text": "8.6 Largeur d'allée (Ast)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Largeur nécessaire au chariot pour stocker/déstocker. Plus large = moins de surface de stockage."
      },
      {
        "kind": "paragraph",
        "text": "La largeur d’allée se vérifie à partir du diagramme du modèle, de la charge et des exigences du site."
      },
      {
        "kind": "paragraph",
        "text": "Ordres de grandeur : contrepoids 3 roues ~{g}4 m{/g} · mât rétractable ~{g}3 m{/g}."
      },
      {
        "kind": "heading",
        "text": "8.7 Utilisation des surfaces",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-notions-2-v001.svg",
        "alt": "Brute. Ensemble du périmètre. Nette. Après exclusions.",
        "caption": "Préciser ce que le dénominateur inclut."
      },
      {
        "kind": "table",
        "headers": [
          "Notion",
          "Calcul"
        ],
        "rows": [
          [
            "Surface {g}globale{/g}",
            "L × l × nb étages"
          ],
          [
            "Surface {g}brute{/g}",
            "Globale − inutilisable (piliers, sanitaires, quais…)"
          ],
          [
            "Surface {g}nette{/g}",
            "Brute − allées"
          ],
          [
            "{g}Taux d'exploitation surfaces{/g}",
            "Nette / brute × 100"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Ex. Rupperswil : 65×45 = 2925 m² → brute 2650 → nette 1350 → taux ≈ {g}51 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Volume : Euro I ≈ 1 m² de base en pratique · hauteur 1 m → ~1 m³."
      },
      {
        "kind": "heading",
        "text": "8.8 Utilisation de l'espace",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Intègre la {g}hauteur{/g}. Taux = volume utilisé / volume total × 100. Ex. : nette 1350 · hauteur pièce 5 m · hauteur palettes 1,60 m → 2160/6750 ≈ {g}32 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Aussi critique en transport (route, rail, mer, air)."
      },
      {
        "kind": "heading",
        "text": "8.9 Stockage sur rayonnages",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Meilleure utilisation du volume vs sol. Alvéole = 2 montants + traverses · souvent 3 palettes. Places au sol · puis niveaux 1, 2… Picking manuel surtout au sol."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charges :{/g} traverse (alvéole) · au sol (entre 2 montants) · totale (rayonnage entier)."
      },
      {
        "kind": "paragraph",
        "text": "Hauteurs homogènes dans une alvéole = meilleure occupation. Types : hauteur (faible ≤7 m · >5,5 m = spécialistes · jusqu'à 45 m) · profondeur 1100/750 mm · traverses souvent 2700 mm · lourds vissés."
      },
      {
        "kind": "heading",
        "text": "8.10 Numérotation des articles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Objectifs : {g}identifier{/g} · {g}classifier{/g} · {g}informer{/g} · {g}contrôler{/g} (chiffre de contrôle, ex. GTIN-13 → module 801)."
      },
      {
        "kind": "heading",
        "text": "8.11 Numérotation des emplacements",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "« Adresse » dans l'entrepôt (rue/maison/étage/appart.). Pas de norme unique. Ex. : étagère–niveau–emplacement ou étagère–emplacement–niveau · pairs/impairs sur rayonnages doubles."
      },
      {
        "kind": "heading",
        "text": "8.12 Flux de marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Externe :{/g} fournisseurs ↔ entreprise ↔ clients (modes de transport). {g}Interne type :{/g} réception → contrôle → préparation stockage → mise en stock → sortie → picking → emballage → chargement."
      },
      {
        "kind": "paragraph",
        "text": "Variantes : contrôle sauté si accord · réserve palettes vs zone picking · automatique (marchandise vers l'homme)."
      },
      {
        "kind": "heading",
        "text": "8.13 Images de stock",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Vue d'occupation (libres / zones). {g}Analogique{/g} (cartes/sachets) ou {g}numérique{/g} (WMS/Excel) · actualisation continue."
      }
    ],
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Adresse de stock{/g} — Suite de repères qui identifie une position de rangement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Allée{/g} — Voie utilisée selon les déplacements admis et le plan du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Capacité utile{/g} — Nombre de positions ou volume exploitable sous les contraintes spécifiées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge ponctuelle{/g} — Effort concentré sur une petite surface."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux interne{/g} — Déplacement des marchandises entre zones du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Implantation{/g} — Position relative des zones, accès, équipements et emplacements."
      },
      {
        "kind": "paragraph",
        "text": "{g}Surface brute{/g} — Aire totale du périmètre mesuré."
      },
      {
        "kind": "paragraph",
        "text": "{g}Surface nette{/g} — Aire restante ou utilisée selon les exclusions définies."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux d’exploitation{/g} — Part d’une ressource employée selon un quotient dont le périmètre est précisé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux d’occupation{/g} — Rapport entre les positions utilisées et les positions disponibles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Travée{/g} — Partie d’un rayonnage comprise entre des montants."
      },
      {
        "kind": "paragraph",
        "text": "{g}Zone de transit{/g} — Espace prévu pour un passage ou un séjour limité."
      }
    ],
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un bâtiment fictif mesure 28 m sur 18 m. Calculez la surface brute.",
    "answer": "504 m².",
    "calculation": "28 × 18 = 504 m².",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-maths-fiche-2",
    "kind": "maths",
    "prompt": "Sur 500 m², 330 m² servent au stockage. Calculez la part de surface.",
    "answer": "66 %.",
    "calculation": "330 ÷ 500 × 100 = 66 %.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-maths-fiche-3",
    "kind": "maths",
    "prompt": "Six allées ont chacune deux côtés de 15 positions. Calculez le total.",
    "answer": "180 positions.",
    "calculation": "6 × 2 × 15 = 180.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-maths-fiche-4",
    "kind": "maths",
    "prompt": "La position 2 d’un niveau contient huit bacs et la position 3 en contient douze. Calculez le total compté.",
    "answer": "20 bacs.",
    "calculation": "8 + 12 = 20.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un modèle répartit 8 000 N sur 4 m² de manière uniforme. Calculez l’effort surfacique moyen.",
    "answer": "2 000 N/m² dans le modèle.",
    "calculation": "8 000 ÷ 4 = 2 000 N/m².",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-408-verification-fiche-1",
    "kind": "verification",
    "prompt": "Pourquoi distinguer surface brute et surface de stockage ?",
    "answer": "Les voies, services et zones non stockantes peuvent être inclus dans la surface brute.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que manque-t-il à un taux d’occupation sans dénominateur ?",
    "answer": "La capacité de référence et le périmètre, nécessaires pour l’interpréter.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-verification-fiche-3",
    "kind": "verification",
    "prompt": "Comment reconnaître une adresse d’emplacement ?",
    "answer": "Décomposer les éléments indiqués par le système, par exemple allée, travée, niveau et position.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi la charge moyenne ne suffit-elle pas sur le terrain ?",
    "answer": "Des efforts locaux ou dynamiques peuvent être plus contraignants que la moyenne.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel intérêt donne la séparation des flux ?",
    "answer": "Elle facilite une circulation claire et limite les croisements indésirables.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le plan indique une capacité théorique mais une zone est réservée à la circulation. Quel chiffre utilisez-vous ?",
    "answer": "Relever les positions réellement utilisables et documenter l’exclusion.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux articles portent des codes ressemblants. Comment réduire les erreurs de rangement ?",
    "answer": "Vérifier référence et adresse lors du mouvement, puis prévoir un repère distinct selon le système.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-408-situation-fiche-3",
    "kind": "situation",
    "prompt": "L’occupation baisse après un nouveau découpage. Que vérifiez-vous avant de conclure ?",
    "answer": "Que le même stock et des capacités comparables sont mesurés et que le périmètre est le même.",
    "module": "408",
    "revision": "408-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
