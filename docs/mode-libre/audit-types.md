# Inventaire des types du générateur, référence L0

Le relevé du 26 novembre 2026 porte sur le commit `e72ec7c2424ce55cc8ca56cf9a4a33924df03915`, arbre `f66ab1df6224fe5b5330a69d3f3d675de161e558`. La cible inclut le [cahier des charges Logistique V2.11](../logistique/cahier-des-charges.md) et la publication de banque `logistique-100-v001`.

La [matrice](audit-types.json) enregistre 2 974 types déclarés dans le catalogue et 21 domaines référencés par les options d’accès. Les comptes codés dans l’application ont respectivement 21, 19 et 3 domaines pour les rôles `admin`, `full` et `partial`. Il s’agit des droits par rôle chargés en local. Les droits individuels et les routes autonomes qui n’alimentent pas ce catalogue demandent un relevé distinct.

| Domaine | Types déclarés | Avec contenu généré | Banque indisponible |
|---|---:|---:|---:|
| Logistique CFC | 400 | 50 | 350 |
| Logistique AFP | 315 | 40 | 275 |

Les 715 types Logistique font partie des 2 974 déclarations. Le script appelle le générateur Logistique pour chaque type avec la graine `20261126`, la configuration par défaut du diplôme et une demande de deux unités. La matrice donne le nombre obtenu et le format de rendu observé. Les 90 types générables produisent 36 contextes au format théorie (cours ou glossaire) et 54 au format texte (mathématiques, vérification et situations). Hors Logistique, les entrées déclarées restent à exécuter. La somme des déclarations ne mesure donc pas la couverture des activités actives de l’application.

Pour reproduire les mesures, utiliser le script [audit-mode-libre.mjs](../../scripts/audit-mode-libre.mjs) dans une copie du code à la référence ci-dessus, avec les dépendances du verrou installées, Chromium et `pdfinfo`. Lancer `node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre-l0`. Le champ `commit` identifie la révision courante et `tree` son arbre. Les mesures dépendent de l’état de la copie et des banques à l’exécution. La variable `CHROMIUM_PATH` permet d’indiquer le chemin du navigateur.

L0 reste en cours. Il faut établir les contextes comportementaux par variante, format, niveau et accès, puis renseigner le profil cible, le schéma de données, l’éditeur actuel et les paramètres applicables. Les contrôles à prouver figurent dans [le relevé écran et PDF](audit-controles.md).
