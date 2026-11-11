# Inventaire de compatibilité C0

`npm run interactive:inventory` produit `inventory.json` à partir de **chaque type réel du catalogue**, avec `buildPage`, puis applique le nouvel adaptateur. Paramètres : graine 20261107, deux items, niveau par défaut ; source, champs, layouts, configuration et deux items témoins sont conservés par entrée. Le résultat est reproductible, sans modification des banques.

- 2 071 types de catalogue ; 2 103 couples type/domaine après ajout des variantes TCF CSC et CFR.
- 20 domaines déclarés : 19 présents dans les variantes du catalogue. `français` est un ancien domaine sans thème actif dans le catalogue actuel ; son fallback de configuration est une addition, ce qui ne constitue pas une couverture du français.
- 51 layouts observés sur 53 déclarés. `vocab-write` et `audio-match` ne sortent pas dans ces tirages : couverture non démontrée.
- 640 variantes produisent au moins une activité convertible : 504 uniquement en QCM source, 23 adaptations numériques vérifiées, 79 uniquement guidées et 34 mêlant QCM et activités guidées. Ce nombre décrit la conversion structurelle observée, pas une validation pédagogique de chaque famille, graine et niveau.
- 1 463 variantes sont non prises en charge, y compris huit échecs de génération déjà présents : association de syllabes `alpha-x-gz` et sept exercices Soutien contenant un jeton sans catégorie. Les détails sont conservés dans l’inventaire ; aucune donnée de banque n’a été réécrite pour masquer ces erreurs.

## Contrats de conversion actuels

| Source | Traitement | Limite |
|---|---|---|
| Addition, soustraction, multiplication entières, résultat manquant | QCM adapté, calcul recalculé et comparé au corrigé source | Pas de division, fraction, décimal ou opérande manquant dans cette tranche |
| Aire du carré | Côté positif, aire et unité vérifiées ; distracteurs géométriques distincts | Autres figures non prises en charge |
| Signes et problèmes CSC | Signe unique recalculé ; problème, nombres et corrigé comparés à la banque ; contexte conservé et cartes numériques déterministes | Cinq types CSC observés avec les opérations posées ; les autres rendus demandent encore leur adaptation ; les signes ambigus sont signalés |
| QCM `select` | 2–6 choix source distincts ; réponse unique retrouvée | Choix audio individuels non pris en charge dans ce layout |
| Dictées et calculs oraux CSC/CFR | Tous les extraits vérifiés contre le lexique et le corrigé ; une piste complète, une question par dictée | Nombres de 0 à 1 000 et calculs explicitement vérifiables ; extrait manquant ou incohérent signalé |
| Reconnaissance des sons `listen-check` | Une question Oui / Non par mot, son de la consigne conservé, audio et image source ; correspondance vérifiée entre cases cochées et corrigé | Piste absente ou partagée entre mots distincts signalée ; aucune phonétique déduite de l’orthographe ; ne remplace pas un QCM multi-réponses |
| TCF QCM et cadres audio | Priorité aux variantes en images, même depuis une forme papier à écrire ; piste conservée | Deux QCM maximum par audio, projetés ensemble avec trois choix source chacun ; bonne réponse conservée |
| Lignes / production écrite TCF | Activité guidée, modèle après révélation, observation humaine | Aucun score automatique |
| PO à images, dont quatre scènes | Projection et déplacement par boutons ; modèle après révélation | Aucun ordre ou score automatique inventé |
| Associations audio | Une question par enregistrement, mots ou images source, correspondances vérifiées | Repli guidé pour un audio de mot remplaçant une syllabe ; six choix source maximum |
| Paires de vocabulaire | Micro-questions avec propositions source ; mot complet vérifié pour les parties à compléter | Associations indépendantes, sans élimination des paires déjà traitées |
| Phrases à ordonner | Deux à six jetons source manipulables, modèle séparé, appréciation humaine | Phrases longues ou incohérentes signalées ; aucun ordre alternatif déclaré faux automatiquement |
| Dossiers complets | Explication de non-compatibilité | Ouvrir une fiche individuelle |
| Autres layouts | Motif explicite, visible dans la préparation | Ne sont pas masqués par domaine |

## Risques avant extension

Vérifier les contextes et médias propres à chaque famille ; les QCM multi-réponses ne sont pas encore convertis. Tester d’autres graines, les niveaux non échantillonnés, les continuations de documents, les titres très longs, les accents et les éditions libres complexes. Le convertisseur travaille sur les blocs avant pagination A4 pour ne pas rejouer les items des pages de suite.

Inventaire recalculé le 11 novembre 2026. Les nombres historiques du prototype décrivaient un catalogue antérieur ; plusieurs exercices de grammaire auparavant rendus en TCF utilisent maintenant le layout `text` et demandent un adaptateur dédié. Aucune compatibilité générique n’est déduite du seul domaine.
