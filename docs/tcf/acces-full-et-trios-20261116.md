# Accès du compte full et suite des trios — 16 novembre 2026

Le compte `jebosseplus` correspond au rôle **full**. TCF CSC, TCF CFR, TCM CSC et TCM CFR font désormais partie de ses droits de base, dans l’application et dans l’API de fiches. Ces quatre tests restent accessibles si la liste de domaines est absente ou si une ancienne configuration ne contient que l’algèbre. Les autres domaines configurés sont conservés.

L’API autorisait déjà l’enregistrement dans les domaines accessibles au compte : le même contrôle couvre maintenant les quatre tests. Les droits du compte partiel et les contrôles des fiches mêlant plusieurs domaines sont conservés.

## Vérification de l’accès

- **Sept tests** passent, avec le véritable gestionnaire de requêtes du Worker et une base SQLite locale : création, liste, mise à jour, configurations absentes ou anciennes, fiches mixtes et refus des accès non autorisés.
- Le parcours dans Chromium sur un écran de 390 pixels utilise la connexion `jebosseplus`, puis ouvre les quatre tests. Quatre copies sont enregistrées dans la base locale et retrouvées après rechargement, sans ressaisie du mot de passe. Aucune erreur JavaScript : [preuve du navigateur](acces-full-20261116-browser.json).
- La vérification TypeScript de l’API passe.

**Limite de production :** le proxy réseau de cet environnement bloque l’URL publique du Worker Cloudflare avant de l’atteindre. Aucun identifiant de déploiement Cloudflare n’est disponible ici. Aucun déploiement du Worker ni écriture dans sa base de production n’a été effectué ; l’accès réel en ligne reste à confirmer. La configuration Worker déjà versionnée contient les quatre domaines pour le compte full. La modification de ses droits par défaut doit aussi être déployée pour couvrir un serveur dont cette liste serait absente ou ancienne.

## Neuf nouveaux trios A2

**Neuf trios sont activés**, deux historiques et sept DELF Actif. Quatre PNG originaux 4:3 sont ajoutés : un ticket d’entrée automobile et les tartes au chocolat, au citron et à l’abricot. Les **23 autres usages réemploient 22 images distinctes** examinées dans la banque.

Les trois parfums sont représentés par des tartes entières, avec une garniture reconnaissable. La tablette de chocolat et les fruits seuls sont écartés. Le ticket de piscine est remplacé par un ticket adapté au contexte de la machine utilisée depuis une voiture. Les autres trios portent sur les publics, pièces justificatives, spectacles, transports, métiers, sports et animaux d’origine des viandes.

La comparaison des six banques confirme que seuls les neuf formats QCM image sont ajoutés : questions, textes, réponses, transcriptions et MP3 sont conservés. Les anciens fichiers réutilisés gardent leurs octets. Aucune nouvelle écoute humaine n’est attestée. [Relecture et sources](revue-trios-tartes-documents-20261116.json), [comparaison](verification-trios-tartes-documents-20261116.json).

Les 763 décisions historiques, les 346 supports / 1 663 questions DELF Actif, les 1 021 relectures contextuelles, les 2 327 variantes QCM et les douze cas de mélange passent les contrôles. Treize tests des catalogues passent. La galerie compte **6 828 images** ; le catalogue audio conserve **6 734 questions et 15 096 formats**. Seize vues dans le navigateur couvrent les neuf questions sur ordinateur et mobile avec le rôle full : 54 affichages d’images, corrigés et bascule des formats vérifiés, aucune erreur JavaScript ([preuve](trios-tartes-documents-20261116-browser.json)).

La vérification TypeScript du site, la compilation de production et les budgets de chargement passent également. Les mesures de la compilation sont conservées dans le [rapport de chargement](../interactive/performance-results.json).

## Reste à faire

- **353 trios historiques** : 143 A1, 187 A2 et 23 B1.
- **433 candidats DELF Actif** à vérifier : 71 A1, 225 A2 et 137 B1. Le suivi compte désormais **313 trios actifs**.
- Confirmer l’accès et l’enregistrement du compte full sur le service de production ; publier la mise à jour du Worker si sa configuration en ligne ne contient pas encore les quatre domaines.
- Les autres chantiers du TCF, dont les vérifications audio, la grammaire et les anciennes fiches enregistrées, restent détaillés dans le [bilan du cahier des charges](bilan-cahier-des-charges-20261111.md).
