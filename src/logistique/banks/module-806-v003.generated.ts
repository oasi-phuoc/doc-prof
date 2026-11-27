import type { LogistiqueUnit } from '../approved-banks'

export const module806 = [
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
        "kind": "image",
        "src": "/assets/logistique/800/803/commun/log-803-erp-photo-v002.webp",
        "alt": "Une opératrice confronte son tableau et les données de la livraison.",
        "caption": "Distinguez en colonnes les références, les quantités et les unités avant de calculer."
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
        "src": "/assets/logistique/800/806/cfc/log-806-recopie-schema-v003.webp",
        "alt": "E1 contient trois pour cent. Les lignes utilisent B2 fois E1 pour 225 francs et B3 fois E1 pour 126 francs. La référence E1 reste fixe.",
        "caption": "En recopiant la formule, B2 devient B3 et la référence $E$1 garde la cellule du taux."
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
        "src": "/assets/logistique/800/806/cfc/log-806-receptions-mensuelles-schema-v002.webp",
        "alt": "Histogramme avec 50 palettes en janvier, 30 en février et 60 en mars. Axe vertical commençant à zéro.",
        "caption": "Dans ce graphique, la colonne de mars est la plus haute. Écrivez les mois et l’unité de mesure sur le graphique."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Une équipe compare des colonnes sur un graphique imprimé.",
        "caption": "Pour être lisible, le graphique donne la période, l’unité et un type adapté au message."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "6. Excel Microsoft 365",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 et 6.2 Le classeur",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/803/commun/log-803-erp-photo-v002.webp",
        "alt": "Une opératrice confronte son tableau et les données de la livraison.",
        "caption": "Distinguez en colonnes les références, les quantités et les unités avant de calculer."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}classeur{/g} contient des feuilles. Une {g}cellule{/g} est repérée par colonne et ligne, par exemple B2. Une {g}plage{/g} réunit plusieurs cellules. Saisissez les quantités, dates et unités dans les colonnes prévues. Un {g}format{/g} modifie l’affichage : 0,945 en format pourcentage donne 94,5 %. Un code avec zéro initial peut devoir rester en texte."
      },
      {
        "kind": "heading",
        "text": "6.3 Calculs simples",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/806/cfc/log-806-recopie-schema-v003.webp",
        "alt": "E1 contient trois pour cent. Les lignes utilisent B2 fois E1 pour 225 francs et B3 fois E1 pour 126 francs. La référence E1 reste fixe.",
        "caption": "En recopiant la formule, B2 devient B3 et la référence $E$1 garde la cellule du taux."
      },
      {
        "kind": "paragraph",
        "text": "Une {g}formule{/g} commence par =. Les parenthèses précisent la priorité. La {g}référence relative{/g} évolue quand on copie la formule. La {g}référence absolue{/g}, par exemple $E$1, reste fixe. Pour valoriser plusieurs lignes au même taux, utilisez par exemple =B2*$E$1 puis vérifiez le résultat."
      },
      {
        "kind": "heading",
        "text": "6.4 et 6.5 Fonctions et vérification",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}SOMME{/g}, {g}MOYENNE{/g}, {g}NB{/g}, {g}MIN{/g} et {g}MAX{/g} résument des données. {g}SI{/g} applique une condition. {g}NB.SI{/g} compte selon un critère. {g}RECHERCHX{/g} ou {g}RECHERCHV{/g} retrouve une référence selon les réglages. {g}ARRONDI{/g} ajuste le nombre de décimales. Affichez et relisez les formules en cas d’écart."
      },
      {
        "kind": "heading",
        "text": "6.6 Créer un graphique",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/806/cfc/log-806-receptions-mensuelles-schema-v002.webp",
        "alt": "Histogramme avec 50 palettes en janvier, 30 en février et 60 en mars. Axe vertical commençant à zéro.",
        "caption": "Dans ce graphique, la colonne de mars est la plus haute. Écrivez les mois et l’unité de mesure sur le graphique."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Une équipe compare des colonnes sur un graphique imprimé.",
        "caption": "Pour être lisible, le graphique donne la période, l’unité et un type adapté au message."
      },
      {
        "kind": "paragraph",
        "text": "Choisissez les colonnes pour comparer des mois et une courbe pour suivre une évolution. Indiquez {g}axes{/g}, {g}unité{/g} et période. Pour préparer un {g}publipostage{/g}, fournissez une ligne par destinataire et une colonne par champ. Vérifiez les données avant de fusionner."
      }
    ],
    "module": "806",
    "revision": "806-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
