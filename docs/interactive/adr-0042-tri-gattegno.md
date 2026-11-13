# ADR 0042 — Classer les éléments Gattegno

Les sept variantes `phrase-color` deviennent des questions de classement : chaque occurrence est encadrée dans sa phrase complète, avec une carte par catégorie présente dans cette phrase. Les catégories viennent des étiquettes explicites de la banque et du corrigé imprimable vérifié. Un même mot peut donc recevoir des catégories différentes selon sa position. Les apostrophes et les locutions restent entières.

Les mots sont projetés sans couleur grammaticale ni catégorie dans les données publiques. Les cartes gardent leur ordre, lettre et couleur ; une catégorie peut servir plusieurs fois. De deux à six catégories, la correction est automatique ; les autres phrases restent guidées avec le modèle enseignant, sans score inventé. Les données incomplètes ou incohérentes sont signalées dans la préparation. La fiche et son corrigé A4 ne sont pas modifiés.

Classe conserve le vote collectif. Solo et le défi local acceptent plusieurs occurrences de la même catégorie. La salle Internet transporte seulement les mots neutres et la position visée ; son moteur privé conserve le corrigé, y compris après redémarrage SQLite. Le nouveau duel réutilise ces mêmes questions et peut les répéter jusqu’à la fin du combat.

Huit tests couvrent 2 800 configurations sources, les répétitions, les clés altérées, les catégories nombreuses, les réglages du plan, les nouvelles graines, la feuille enseignant, la reprise et le transport public. Le parcours `word-classification-browser.mjs` couvre Classe, Solo et compétition locale sur trois tailles d’écran. Les preuves sont consignées dans `word-classification-results.json` et le relevé qualité du lot. Le glisser-déposer libre dans des colonnes et les autres sources de tri M08 restent ouverts.
