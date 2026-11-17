# Sept trios de vêtements — 17 novembre 2026

**Sept trios supplémentaires sont activés : un A1, quatre A2 et deux B1**, soit trois questions CE et quatre CO. Quatre appartiennent au reliquat historique et trois au suivi DELF Actif. Treize PNG natifs sont utilisés dix-sept fois ; les quatre autres choix réemploient quatre images existantes.

Douze compositions sont créées : manteau/écharpe/gants, short/tee-shirt, robe/sandales, maillot/sandales, costume/cravate, blouse professionnelle, imperméable, short de bain, jupe de soirée, anorak, pyjama et veste blanche. Une treizième image reprend le maillot une pièce bleu existant avec un fond harmonisé. Tous les sujets sont entiers et les ensembles montrent toutes les pièces annoncées. Le costume comprend veste et pantalon assortis avec la cravate ; le pyjama comprend son haut et son pantalon. Le type « Objet » et le thème « Vêtements et accessoires » rendent les nouveaux fichiers recherchables.

Les treize fichiers et les quatre réemplois sont contrôlés avec la référence ivoire lisse `co834-boissons-dessinees.webp`. Les médianes des coins restent à trois valeurs de canal au plus de `[253, 242, 225]`, avec comparaison visuelle des fonds, matières et ombres. Quatre premières versions sont écartées, dont le costume généré en 1 447 × 1 087 ; l’anorak nécessite une deuxième reprise du fond. Dix-huit appels de génération produisent les treize fichiers finaux, tous conservés en **1 448 × 1 086 natifs**, sans recadrage ou recompression locale. Les premières sources et le maillot original restent conservés. [Sources, générations, reprises et mesures](revue-trios-vetements-20261117.json).

Chaque support est relu en entier. La piste froide demande bien le manteau, l’écharpe et les gants : le duo manteau/gants existant ne suffit pas. Le séjour à la montagne demande des habits chauds avec des gants, tandis que les draps et serviettes sont déjà fournis. La blouse correspond au travail dans un institut, sans inventer de contexte médical. Le pantalon, le short de bain et la jupe de soirée sont trois vêtements du bas distincts ; la jupe n’est pas remplacée par une robe.

L’anorak à déposer au vestiaire reste distinct de l’imperméable conseillé contre la pluie. Pour la réponse « son maillot » de Bastien, le short de bain représente cette catégorie. La dame au guichet est reconnue par la veste blanche ; les deux autres choix gardent exactement le manteau rouge et le pull vert. Les illustrations désignent des vêtements, pas des portraits ou des scènes de dialogue.

La comparaison des six banques avec `5465a1b8` vérifie **sept ajouts de format QCM image**, sans modification des questions, réponses texte, transcriptions, barèmes ou MP3. Les quatre réemplois et les anciennes métadonnées sont conservés. Aucune nouvelle écoute humaine n’est attestée. [Comparaison et contrôles](verification-trios-vetements-20261117.json).

## Vérification

- **763 décisions historiques** : 366 trios actifs, 112 textes conservés et 285 trios à préparer.
- **346 supports / 1 663 questions DELF Actif**, 1 021 relectures de contexte et banque TCF contrôlés.
- **2 448 variantes image**, avec douze cas de mélange vérifiés.
- **Dix-neuf tests des catalogues réussis après fusion**. Galerie : **7 066 images**. Audio : **8 801 fichiers, 6 734 questions et 15 183 formats de réponse**. Les trois variantes CE sont suivies dans la banque de lecture.
- Chromium : **12 vues** sur ordinateur et mobile, sept questions vérifiées deux fois et **42 affichages d’image**. Chargement, proportions 4:3, cases élève/corrigé et bascule Texte/Image contrôlés sans erreur JavaScript. Les aperçus isolent les QCM et ne remplacent pas une vérification des documents CE complets. [Résultats navigateur](trios-vetements-20261117-browser.json).
- TypeScript, compilation de production, budgets de chargement et vérification des **696 types de jeu** réussis.

Les 48 illustrations du quotidien reçues sur `origin/main` (`4fed764c`) sont conservées octet pour octet. Les trois fichiers générés en conflit sont reconstruits à partir des sources combinées. Les banques, le rendu et le manifeste TCF restent identiques à ceux des douze vues navigateur. Catalogues, TypeScript, compilation et budgets sont revérifiés après fusion.

## Reste à faire

- **285 trios historiques** : 109 A1, 157 A2 et 19 B1. Le registre les répartit en 225 cas de lieux et relations de contexte, 47 concepts complets et 13 types de documents.
- Le lot initial de 433 compte **148 trios intégrés et 285 en attente**. Le suivi initial de 573 compte **287 trios actifs, un texte conservé et 285 en attente**.
- **380 candidats DELF Actif** : 58 A1, 201 A2 et 121 B1. Ce suivi distinct compte désormais **366 trios actifs** — 204 A1, 137 A2 et 25 B1 — et **917 questions maintenues en texte**. Les candidats nécessitent encore une vérification individuelle des trois choix.
- Le contrôle final de la bibliothèque audio, les compléments pédagogiques de grammaire et les vérifications des fiches enregistrées en production restent suivis dans le [bilan du cahier des charges](bilan-cahier-des-charges-20261111.md).
