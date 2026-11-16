# Fonds d’objets harmonisés et seize trios A2 — 16 novembre 2026

**Les trois nouvelles compositions alimentaires ont leur fond corrigé**, à la demande de l’utilisateur : beurre-œufs, pain-lait et fruits-céréales reprennent le fond ivoire clair, lisse et presque uniforme de l’image de boissons explicitement validée. Les premières versions jaunes et texturées sont écartées avant intégration. Le [guide de style](style-images.md) précise désormais cette règle pour les objets.

La comparaison visuelle et un échantillon de fond vide confirment la reprise : la référence a une médiane RGB de 253, 242, 225 ; les trois images corrigées s’en écartent au maximum de deux niveaux par canal. Ce contrôle local de teinte complète la revue visuelle ; il ne signifie pas que les images entières ont des pixels identiques. Les sources avant/après, leurs empreintes et les mesures sont conservées dans le [registre des fonds](correction-fonds-objets-20261116.json).

**Seize trios A2 supplémentaires sont activés**, quatorze historiques et deux DELF Actif : huit questions CE et huit CO. Huit PNG natifs **1 448 × 1 086** sont conservés sans redimensionnement. Ils couvrent les trois compositions alimentaires, les lieux de vie à la campagne, sur une île et à la montagne, la patinoire et le bowling. Dix usages de ces nouveaux fichiers complètent **38 usages de 24 images existantes**. Onze appels de génération comprennent les trois reprises de fond ; huit fichiers finaux sont ajoutés.

Les supports sont relus en entier. Les achats demandés sont le beurre et les œufs ; les autres aliments du message sont déjà disponibles. Les associations de fruits pour la recette sont réutilisées. La préférence de Jean pour la campagne est distinguée de celle des couples pour la ville. Le titre de film « Gare Cornavin » n’est pas confondu avec le lieu du rendez-vous. La fille souhaite aller au bowling, mais son père refuse : le QCM porte sur son souhait. Les illustrations de lieux ne prétendent pas représenter les domiciles réels des locuteurs ni une météo observée pendant la tempête. [Sources, choix et décisions](revue-trios-aliments-paysages-20261116.json).

La comparaison complète des six banques avec `e9201e79` confirme **seize ajouts de format image**, sans changement de question, réponse, texte, transcription, barème ou MP3. Les anciennes images et leurs métadonnées sont conservées. Aucune écoute humaine supplémentaire n’est attestée. [Comparaison et contrôles](verification-trios-aliments-paysages-20261116.json).

## Vérification

- **763 décisions historiques** : 337 trios actifs, 112 questions maintenues en texte et 314 trios à préparer.
- **346 supports / 1 663 questions DELF Actif** et 1 021 relectures contextuelles vérifiés.
- **2 382 variantes image**, douze cas de mélange et banque TCF contrôlés.
- **Treize tests des catalogues réussis**. Galerie : **6 853 images**. Catalogue audio : **8 801 fichiers, 6 734 questions et 15 127 formats de réponse**.
- Chromium : **32 vues**, couvrant les seize questions sur ordinateur et mobile, avec **96 affichages d’image**. Chargement, proportions, cases du corrigé et bascule Texte/Image vérifiés sans erreur JavaScript. Les trois fonds sont aussi examinés ensemble dans le QCM. Les aperçus isolent les questions et ne remplacent pas les documents CE complets. [Résultats navigateur](trios-aliments-paysages-20261116-browser.json).
- TypeScript, compilation de production et budgets de chargement réussis.

## Reste à faire

- **314 trios historiques** : 127 A1, 164 A2 et 23 B1. Parmi eux, 241 cas de lieux et relations de contexte, 59 concepts complets et 14 types de documents.
- Le lot initial de 433 compte **119 trios intégrés et 314 en attente**. Le suivi initial de 573 compte **258 trios actifs, un texte conservé et 314 en attente**.
- **417 candidats DELF Actif** : 69 A1, 223 A2 et 125 B1. Ce suivi distinct compte **329 trios actifs** et 917 questions maintenues en texte.
- Le contrôle final de la bibliothèque audio, les compléments pédagogiques de grammaire et les vérifications des fiches enregistrées en production restent suivis dans le [bilan du cahier des charges](bilan-cahier-des-charges-20261111.md).
