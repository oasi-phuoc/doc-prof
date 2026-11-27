import type { LogistiqueUnit } from '../approved-banks'

export const module408 = [
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
        "src": "/assets/logistique/400/408/commun/log-408-organisation-photo-v002.webp",
        "alt": "Une vue en hauteur montre les zones de stockage et les allées d’un entrepôt.",
        "caption": "La planification relie zones, voies de circulation, emplacements et surfaces disponibles."
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
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-epis-photo-v005.webp",
        "alt": "Palettes orientées en biais dans des places tracées de part et d’autre d’une allée centrale.",
        "caption": "Stockage au sol en épis. Les places en biais facilitent certaines manœuvres. Le tracé de l’allée et l’angle des supports déterminent la surface utile."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-mat-retractable-photo-v002.webp",
        "alt": "Un chariot à mât rétractable présente deux bras porteurs devant le poste de conduite.",
        "caption": "L’Ast dépend du modèle et de la palette. Vérifiez les données du constructeur avant de tracer l’allée."
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
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Un opérateur saisit le rangement d’un carton à l’aide d’un terminal.",
        "caption": "La lecture au rangement associe l’article à un endroit précis. La référence article et le code d’emplacement renseignent deux choses différentes."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "8. Organisation de l'entrepôt",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "8.1 à 8.4 Rôles, planification et types de dépôt",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-epis-photo-v005.webp",
        "alt": "Palettes orientées en biais dans des places tracées de part et d’autre d’une allée centrale.",
        "caption": "Stockage au sol en épis. Les places en biais facilitent certaines manœuvres. Le tracé de l’allée et l’angle des supports déterminent la surface utile."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/408/commun/log-408-organisation-photo-v002.webp",
        "alt": "Une vue en hauteur montre les zones de stockage et les allées d’un entrepôt.",
        "caption": "La planification relie zones, voies de circulation, emplacements et surfaces disponibles."
      },
      {
        "kind": "paragraph",
        "text": "Repérez la réception, le contrôle, la réserve, la préparation, les retours et l’expédition. Chaque zone a un rôle et une capacité. La {g}planification{/g} intègre besoins, volumes, équipements et circulation. Un dépôt de réserve, de production ou de distribution n’organise pas les mêmes parcours. Le choix d’une forme au sol dépend aussi de l’emplacement du quai, des allées et des issues."
      },
      {
        "kind": "heading",
        "text": "8.5 Charge au sol",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Comparez la charge et sa répartition avec la capacité de la surface. La masse répartie sur une surface s’exprime par exemple en kg/m². Une {g}charge ponctuelle{/g}, telle qu’un pied de rayonnage, se vérifie selon les données de l’installation."
      },
      {
        "kind": "heading",
        "text": "8.6 Largeur d'allée (Ast)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-mat-retractable-photo-v002.webp",
        "alt": "Un chariot à mât rétractable présente deux bras porteurs devant le poste de conduite.",
        "caption": "L’Ast dépend du modèle et de la palette. Vérifiez les données du constructeur avant de tracer l’allée."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}Ast{/g} désigne la largeur de travail nécessaire à un engin pour manœuvrer selon sa fiche et la charge prévue. Tenez compte du support, de la direction de prise, des obstacles et du site. Gardez les voies libres."
      },
      {
        "kind": "heading",
        "text": "8.7 à 8.9 Surface, volume et rayonnages",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L’utilisation des {g}surfaces{/g} compare m² utiles et disponibles. L’utilisation de l’{g}espace{/g} compare des volumes en m³. Suivre la même définition pour les deux valeurs du rapport. Un {g}rayonnage{/g} augmente le nombre de niveaux, dans les limites de charge et de hauteur."
      },
      {
        "kind": "heading",
        "text": "8.10 à 8.13 Références et flux",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Un opérateur saisit le rangement d’un carton à l’aide d’un terminal.",
        "caption": "La lecture au rangement associe l’article à un endroit précis. La référence article et le code d’emplacement renseignent deux choses différentes."
      },
      {
        "kind": "paragraph",
        "text": "La référence article indique {g}quoi{/g}. La {g}numérotation des emplacements{/g} indique {g}où{/g}. La suite peut préciser zone, allée, travée, niveau et case. Un {g}plan de stockage{/g} montre les zones et flux. Le système doit refléter les entrées, déplacements, préparations et sorties."
      }
    ],
    "module": "408",
    "revision": "408-v005",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
