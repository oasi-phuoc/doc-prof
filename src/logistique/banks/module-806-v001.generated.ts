import type { LogistiqueUnit } from '../approved-banks'

export const module806 = [
  {
    "id": "log-806-objectifs-apercu",
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
          "Saisir et formater des données dans un classeur Excel",
          "Créer des formules (opérateurs, priorités, {g}références absolues F4{/g})",
          "Utiliser des fonctions statistiques et métiers (SI, RECHERCHV, ARRONDI…)",
          "Créer un graphique adapté et préparer une {g}source de données{/g} pour le publipostage"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 806",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Construire un tableau de stock avec des données dans les bonnes unités.",
          "Calculer et vérifier des résultats avec des formules, fonctions et références recopiables.",
          "Choisir un graphique pertinent et préparer une liste fiable pour un publipostage."
        ]
      }
    ],
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Excel Microsoft 365",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les fichiers Excel s'appellent des {g}classeurs{/g}. Nouveau classeur vierge · modèles · liste {g}Récent{/g} · {g}Ouvrir{/g} un existant."
      },
      {
        "kind": "heading",
        "text": "6.1 L'écran de travail",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ruban, barre de formule, feuille (lignes / colonnes / cellules), onglets de feuilles."
      },
      {
        "kind": "heading",
        "text": "6.2 Saisir des données",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Texte, chiffres, dates/heures, formules, fonctions. Excel reconnaît chiffres / dates / heures pour les calculs. Texte aligné à {g}gauche{/g} · nombres à {g}droite{/g}. Paramètres régionaux {g}Suisse{/g} : souvent le {g}point{/g} comme séparateur décimal."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sélection multiple{/g} (zones non contiguës) : maintenir {g}Ctrl{/g} pendant la sélection."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Formater un nombre",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Par défaut : format {g}Standard{/g}. Menu contextuel → {g}Format de cellule{/g} → décimales · séparateur de milliers…"
      },
      {
        "kind": "heading",
        "text": "6.3 Calculs simples",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "6.3.1 Principe des formules",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toute formule commence par {g}={/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Opérateurs",
          "Exemples"
        ],
        "rows": [
          [
            "Maths `+ − * / % ^`",
            "`=5%` → 0,05 · `=2^3` → 8"
          ],
          [
            "Comparaison `= <> < > <= >=`",
            "résultat {g}VRAI{/g} / {g}FAUX{/g}"
          ],
          [
            "Concaténation `&`",
            "`\"Ouest\"&\" et \"&\"Nord\"`"
          ],
          [
            "Référence",
            "`B1:C4` désigne une plage. Le séparateur des arguments d'une fonction dépend des paramètres régionaux."
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Fonctions{/g} = formules préécrites (ex. {g}MOYENNE{/g})."
      },
      {
        "kind": "heading",
        "text": "6.3.2 Formule simple",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Cellule résultat → `=` → cliquer les cellules + opérateurs → {g}Enter{/g}. Ex. `=B2*C2`."
      },
      {
        "kind": "heading",
        "text": "6.3.3 Fonctions statistiques (Accueil → Édition)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Fonction",
          "Rôle"
        ],
        "rows": [
          [
            "Somme",
            "Total"
          ],
          [
            "Moyenne",
            "Moyenne"
          ],
          [
            "Nb",
            "Nombre de valeurs numériques"
          ],
          [
            "Max / Min",
            "Plus grande / plus petite"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Priorités :{/g} `2*3+4=10` · `2*(3+4)=14` → utiliser des {g}parenthèses{/g}."
      },
      {
        "kind": "heading",
        "text": "6.3.4 Référence absolue",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/806/cfc/log-806-notions-1-v001.svg",
        "alt": "Taux source. E1 contient 3 %. Résultat en C2. =B2*$E$1. Résultat en C3. =B3*$E$1.",
        "caption": "Le taux reste dans E1; le montant à la ligne suivante passe de B2 à B3."
      },
      {
        "kind": "paragraph",
        "text": "Fixer une cellule à la recopie : touche {g}F4{/g} → `$A$1` · 2ᵉ F4 = ligne seule · 3ᵉ = colonne seule."
      },
      {
        "kind": "heading",
        "text": "6.4 Calcul avec fonctions",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "`=` + début du nom → liste · double-clic → arguments."
      },
      {
        "kind": "table",
        "headers": [
          "Fonction",
          "Usage"
        ],
        "rows": [
          [
            "ARRONDI / .INF / .SUP",
            "Arrondir (ex. paquets / palettes)"
          ],
          [
            "ARRONDI.AU.MULTIPLE",
            "Ex. 5 centimes · ou `=ARRONDI(n*20;0)/20` (négatifs visibles)"
          ],
          [
            "RANG · GRANDE/PETITE.VALEUR",
            "Classement / nᵉ valeur"
          ],
          [
            "NB.SI · NB.SI.ENS · SOMME.SI(.ENS)",
            "Compter / sommer sous condition"
          ],
          [
            "SI · SIERREUR",
            "Condition · masquer #N/A (ex. avec RECHERCHV)"
          ],
          [
            "NBVAL · NB",
            "Non vides / nombres"
          ],
          [
            "VPM",
            "Mensualité prêt"
          ],
          [
            "RECHERCHV / RECHERCHX",
            "Recherche dans un tableau"
          ],
          [
            "GAUCHE / DROITE",
            "Extraire caractères"
          ],
          [
            "ANNEE / MOIS / JOUR",
            "Extraire d'une date"
          ],
          [
            "`&` / CONCATENER",
            "Lier textes (espace entre `\" \"`)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Données → Convertir{/g} : vérifier l'aperçu, le séparateur et le format des nouvelles colonnes avant validation. {g}Durées cumulées > 24 h :{/g} utiliser le format de durée `[h]:mm`. Vérifier le résultat en heures sur un calcul connu."
      },
      {
        "kind": "heading",
        "text": "6.4.1–6.4.3 Formats",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}%{/g} : un rapport de 0,945 s'affiche comme 94,5 % en format pourcentage. Le format change l'affichage, la valeur utilisée dans les calculs reste 0,945.",
          "Boutons ↑/↓ décimales",
          "Format {g}Comptabilité{/g} + symbole monétaire (CHF…)"
        ]
      },
      {
        "kind": "heading",
        "text": "6.5 Afficher les formules",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dans l'onglet {g}Formules{/g}, utiliser {g}Afficher les formules{/g} pour inspecter les références. Le raccourci dépend du clavier et de la version."
      },
      {
        "kind": "heading",
        "text": "6.6 Créer un graphique",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/806/cfc/log-806-notions-2-v001.svg",
        "alt": "Graphique en colonnes. Janvier : 50 palettes, février : 30 palettes, mars : 60 palettes. L'axe vertical part de zéro.",
        "caption": "Les colonnes comparent les quantités. Le mois est sur l’axe horizontal, l’unité figure sur l’axe vertical."
      },
      {
        "kind": "heading",
        "text": "6.6.1 Types",
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
            "Histogramme / courbe",
            "Évolution dans le temps"
          ],
          [
            "Secteurs",
            "% d'une seule série"
          ],
          [
            "Barres",
            "Comparaisons"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "6.6.2–6.6.4 Création",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sélectionner données (Ctrl si non contiguës) → {g}Insertion{/g} → Graphiques recommandés ou type choisi. {g}Déplacer le graphique{/g} → Nouvelle feuille (onglet Création)."
      },
      {
        "kind": "heading",
        "text": "6.7 Publipostage (mailing)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Envoi en nombre = {g}2 fichiers{/g} :"
      },
      {
        "kind": "table",
        "headers": [
          "Fichier",
          "Contenu"
        ],
        "rows": [
          [
            "Document de base (Word)",
            "Texte fixe + {g}champs{/g}"
          ],
          [
            "Source de données (Excel)",
            "Infos variables = {g}champs{/g} × {g}enregistrements{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Procédure :{/g} créer Excel → lettre Word → Publipostage → {g}Sélection des destinataires{/g} (liste existante) → insérer champs → {g}Aperçu{/g} → {g}Terminer{/g} (document fusionné)."
      }
    ],
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Classeur{/g} — Fichier qui regroupe une ou plusieurs feuilles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Feuille{/g} — Grille organisée en lignes et en colonnes dans le classeur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cellule{/g} — Intersection d'une ligne et d'une colonne, par exemple B2."
      },
      {
        "kind": "paragraph",
        "text": "{g}Plage{/g} — Ensemble de cellules référencées comme B2:B8."
      },
      {
        "kind": "paragraph",
        "text": "{g}Formule{/g} — Expression commençant par le signe égal et calculant une valeur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fonction{/g} — Calcul prédéfini utilisé dans une formule avec des arguments."
      },
      {
        "kind": "paragraph",
        "text": "{g}Référence relative{/g} — Référence dont la ligne ou la colonne change à la recopie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Référence absolue{/g} — Référence dont la ligne et la colonne sont fixées, comme $B$2."
      },
      {
        "kind": "paragraph",
        "text": "{g}Format de cellule{/g} — Règle d'affichage d'une donnée, par exemple CHF ou pourcentage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Série{/g} — Ensemble de valeurs représentées dans un graphique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Recherche exacte{/g} — Mise en correspondance avec la valeur égale à la clé recherchée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Publipostage{/g} — Production de documents personnalisés par fusion d'un modèle et d'une liste de données."
      }
    ],
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-1",
    "kind": "maths",
    "prompt": "La cellule B2 contient 36 pièces et C2 contient le prix unitaire de CHF 7,50. Donnez une formule de valorisation et le résultat.",
    "answer": "=B2*C2 donne CHF 270",
    "calculation": "36 × 7,50 = 270.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-2",
    "kind": "maths",
    "prompt": "B2, B3 et B4 contiennent 8, 16 et 21. Quelle est la somme et quelle formule utiliser dans Excel en français ?",
    "answer": "=SOMME(B2:B4) donne 45",
    "calculation": "8 + 16 + 21 = 45.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le taux se trouve en E1 et vaut 3 %. La valeur en B2 est CHF 7 500. Donnez en C2 une formule recopiable vers C3 et le résultat de C2.",
    "answer": "=B2*$E$1 donne CHF 225",
    "calculation": "La valeur est relative, le taux est fixe. 7 500 × 0,03 = 225.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-4",
    "kind": "maths",
    "prompt": "Évaluez =2*(3+4) et comparez à =2*3+4.",
    "answer": "14 contre 10",
    "calculation": "2 × 7 = 14 et 6 + 4 = 10.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un fournisseur annonce 165 pièces par carton et vous devez expédier 710 pièces. Combien de cartons faut-il au minimum ?",
    "answer": "5 cartons",
    "calculation": "710 ÷ 165 ≈ 4,30. Arrondir à l'entier supérieur.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-6",
    "kind": "maths",
    "prompt": "La cellule B8 contient 0,945. Quel affichage donne le format pourcentage avec une décimale ?",
    "answer": "94,5 %",
    "calculation": "0,945 est équivalent à 94,5 sur 100.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-maths-fiche-7",
    "kind": "maths",
    "prompt": "Les valeurs quotidiennes sont 26, 39, 41 et 34. Donnez le résultat de MOYENNE.",
    "answer": "35",
    "calculation": "(26 + 39 + 41 + 34) ÷ 4 = 35.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle référence utiliser pour empêcher totalement le déplacement de B1 à la recopie ?",
    "answer": "$B$1.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi conserver un code postal avec un zéro initial en texte quand il sert d'identifiant ?",
    "answer": "Pour conserver tous ses caractères tels qu'ils doivent apparaître dans les données et dans la fusion.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-verification-fiche-3",
    "kind": "verification",
    "prompt": "Comment rechercher un article par sa référence exacte ?",
    "answer": "Utiliser une correspondance exacte dans la fonction de recherche et traiter l'absence de résultat de manière explicite.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelle représentation choisir pour suivre une évolution mensuelle ?",
    "answer": "Une courbe ou des colonnes ordonnées dans le temps, avec les mois et l'unité identifiés.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-verification-fiche-5",
    "kind": "verification",
    "prompt": "Comment préparer les colonnes d'un fichier de publipostage ?",
    "answer": "Utiliser un en-tête par champ, une ligne par destinataire et vérifier les types de données et les doublons.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-situation-fiche-1",
    "kind": "situation",
    "prompt": "Les premières valeurs sont justes mais les lignes suivantes affichent 0 après recopie. Le taux est toujours en F1. Comment diagnostiquer ?",
    "answer": "Comparer les formules, fixer le taux avec $F$1, recopier et vérifier un résultat à la main.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-situation-fiche-2",
    "kind": "situation",
    "prompt": "Vous devez présenter les réceptions des six derniers mois. Décrivez votre préparation.",
    "answer": "Organiser une ligne par mois, vérifier les totaux, choisir colonnes ou courbe et préciser mois, unité et période du graphique.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-806-situation-fiche-3",
    "kind": "situation",
    "prompt": "Avant de générer des lettres, certains noms sont vides et les codes postaux ont perdu un caractère. Que faites-vous ?",
    "answer": "Corriger la liste avec les données sources autorisées, conserver les identifiants en texte et vérifier plusieurs lettres via l'aperçu avant fusion.",
    "module": "806",
    "revision": "806-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
