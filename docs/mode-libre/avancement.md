# Suivi de la refonte du mode Libre

**Mise à jour le 27 novembre 2026**

- [Cahier des charges validé — V1.2](cahier-des-charges.md)
- [Référence du code consulté pour la publication](https://github.com/oasi-phuoc/doc-prof/commit/c24a995b76c68c284b2614e113120cdb2873ba81)
- [Cahier des charges Logistique V2.13](../logistique/cahier-des-charges.md) et [suivi Logistique](../logistique/avancement-cahier-des-charges-20261126.md)

## Prérequis Cloudflare

Le 26 novembre, le Worker `clairfle-fiches` a répondu HTTP 200 à `/health`, avec les vérifications d’accès administrateur et de schéma positives. D1 enregistre les trois migrations `0001_fiches.sql`, `0002_personal_accounts.sql` et `0003_admin_accounts.sql`. La requête préalable CORS depuis le site a répondu HTTP 204.

La recette en production a vérifié 22 réponses HTTP sur deux comptes synthétiques, dont un avec les droits Logistique AFP et CFC. Elle couvre la création par l’administrateur, le rejet d’un formulaire incomplet ou invalide, la connexion, le refus d’un doublon, les droits, l’enregistrement et l’isolation des fiches, le retrait d’un domaine et la révocation des sessions. Le nettoyage des deux comptes et des fiches de recette a été vérifié. Les suites locales du serveur et du script de déploiement ont également passé 18 tests. Le parcours et les commandes de vérification figurent dans la [documentation des comptes](../comptes/installation.md).

Dans Chrome, la recette du site de production a vérifié la connexion administrateur, l’ouverture de **Comptes enseignants**, la création depuis **Créer le compte** (HTTP 201) et la connexion du compte créé depuis **Mon compte** (HTTP 200). Le compte synthétique de ce test a également été supprimé.

## Avancement par lot

| Lot | État | Preuve ou étape suivante |
|---|---|---|
| Prérequis comptes | Validé en production | Recette Cloudflare, contrôle D1 et tests des comptes ci-dessus. |
| Cahier des charges | V1.2 validée | Exigences, arbitrages et critères de réception approuvés et publiés. |
| L0 — Inventaire exécutable | En cours | Référence de reprise `561d0a0`. [4 086 contextes](audit-types.md), [13 comparaisons écran et PDF](audit-controles.md) et [7 recettes témoins](audit-recettes.md). La reprise `03ec309` porte l’inventaire à 4 141 contextes. Les 15 erreurs de génération observées sont corrigées. Cinq variantes produisent zéro unité. Poursuivre les vérifications des profils, des droits individuels et des effets des réglages. |
| L1 — Générateur et contrats d’état | En cours | Panneau unique, géométrie, listes identifiées et verrous vérifiés sur l’Algèbre. Historique et reprise locale par compte et par fiche. Étendre les preuves aux autres profils et aux droits individuels. |
| L2 — Pilotes | En cours | Calcul en ligne, CE avec support commun et CO 1 avec QCM illustrés. Édition et correction testées sur les trois pilotes. Étendre les preuves de reprise et de verrouillage par forme. |
| L3 — Mathématiques et tests | En cours | Les huit calculs en ligne directs et à trou recalculent leur résultat. Raccorder les autres familles d’Algèbre, la Géométrie, la Logique et les exercices TPM / TCM. |
| L4 — Autres profils imprimables | En cours | Calligraphie, cartes, variantes Gattegno équipées de leur éditeur, mots illustrés et mots à compléter. Poursuivre les listes, associations, dictées et grilles restantes. |
| L5 — Grammaire et TCF/TPF | En cours | Édition de la théorie grammaticale et pilotes TCF/TPF CE et CO 1. Les banques graduées, supports audio hors pilote, productions et barèmes restent à recevoir. |
| L6 — Société et Logistique AFP/CFC | En cours | Éditeurs des références structurées et questions simples A4. Étendre la preuve de chaque variante, les activités mixtes, le contrôle de la réserve papier et les droits AFP/CFC individuels. |
| L7 — Cas d’échec et ergonomie avancée | En cours | Récupération, isolation entre comptes et résolution de versions concurrentes vérifiées. Reste à vérifier les quotas, la durée, les médias de chaque profil, les préférences et les actions en série. |
| L8 — Réception complète | À lancer après la couverture | Critères de réception, preuves par contexte, accessibilité, performances et revue. |

À chaque lot, inscrire le commit vérifié, les commandes et leurs résultats, les liens vers les preuves et les éventuels cas bloqués. L’état « validé » correspond à une condition de sortie démontrée.

## Panneau unique et addition A4

Le commit `03ec309`, basé sur `6cd8c38`, intègre les réglages et les éditeurs spécialisés dans le panneau gauche du mode Libre. L’en-tête et le pied de page utilisent le même emplacement. La bascule Édition / Aperçu apparaît jusqu’à 550 px et rend le focus au dernier champ utilisé.

Le test Chromium couvre sept largeurs en A4 et deux en double A5 sur la fiche Algèbre. Il vérifie la géométrie, le contenu à l’ouverture et à la fermeture, les menus du rôle partiel et l’absence de débordement horizontal global. Les PDF comparés à 1 366 px conservent leur texte, leur pagination et leurs dimensions.

L’addition en ligne A4 recalcule le corrigé à la saisie. La quantité augmente en gardant les questions éditées et une réduction demande confirmation. Une saisie invalide conserve la dernière valeur appliquée. Les boutons d’impression et d’enregistrement proposent cette valeur, et l’annulation rend le focus au champ. Le brouillon durable, les autres profils, l’édition directe du double A5 et les sorties consignées au §9.5 restent à recevoir.

Les générateurs des phrases à remettre en ordre acceptent les noms composés. L’association de syllabes retourne une activité vide lorsque sa banque de mots est épuisée. La relance de l’inventaire sur `03ec309` couvre 4 141 contextes, sans erreur de génération. L’activation de cinq variantes sans unité reste à traiter.

```sh
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre-l1 types
node tests/mode-libre/layout-browser.mjs
node tests/logistique/generator-browser.mjs
node --test tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
node_modules/.bin/tsc -b
node_modules/.bin/vite build --outDir /tmp/doc-prof-libre-l1-dist --emptyOutDir
npm run lint
```

Les dix parcours Mode Libre et les deux parcours Logistique sur fixture passent. Les suites Logistique et accès totalisent 16 tests réussis. TypeScript, Vite et le lint passent. La compilation émet des avertissements de taille des bundles et signale les médias interactifs absents du checkout partiel.

## Révisions, reprise et pilotes

La révision `3e93ba5` ajoute jusqu’à 50 niveaux d’annulation, le verrou des calculs et un brouillon IndexedDB par compte enseignant et par fiche. La recette Chromium vérifie la restauration d’une saisie invalide, le choix entre deux versions créées dans plusieurs onglets et l’isolation entre deux comptes. La récupération automatique s’appuie sur l’identifiant stable du compte enseignant.

La révision `89211f7` raccorde la compréhension écrite et les QCM illustrés CO 1 du TPF et des deux TCF. Une modification du support demande de vérifier les corrigés liés. L’import d’une image cible un choix. Le parcours de sauvegarde et de réouverture a été testé sur une API simulée dans Chromium. Les validations communes de format sont partagées avec le Worker.

La révision `db12f47` raccorde les additions, soustractions, multiplications et divisions en ligne, avec leurs variantes à trou. Les tests vérifient le recalcul, la conservation de la dernière valeur valide et le refus d’un diviseur nul. Les essais de calligraphie, de cartes recto-verso et de Gattegno vérifient la stabilité à l’ouverture et la modification en direct.

```sh
node tests/mode-libre/layout-browser.mjs
node tests/mode-libre/draft-browser.mjs
node tests/mode-libre/structured-browser.mjs
node tests/mode-libre/arithmetic-browser.mjs
node --test tests/mode-libre/arithmetic.test.mjs tests/mode-libre/metadata.test.mjs
```

## Double A5 et contenus structurés

La révision `d90588a` permet de modifier chaque moitié A5 des calculs en ligne. Le navigateur vérifie la conservation de l’autre moitié, le verrou lors d’un tirage local et le contenu destiné à l’impression. La validation des recettes distingue les deux listes d’occurrences et leurs identifiants.

Les essais sur les mots illustrés et les mots à compléter partent de la liste visible. Le changement de colonnes en Alphabétisation garde les mots édités. Les essais Grammaire et Logistique modifient le contenu structuré, y compris un tableau après un saut de page. Pour le module Logistique 101, le passage de Résumé à Complet demande une confirmation lorsque la référence a été modifiée. Les deux diplômes conservent la grille de calcul et la séparation du sujet et du corrigé. Un exercice de Société et l’état sans contenu de Soutien FR sont également testés.

La suite des banques de Logistique génère les 858 types. La recette navigateur des cours vérifie les 80 modules CFC et les 63 modules AFP, ainsi que les mises en page des exercices des modules 105 et 110. Les suites unitaires Calcul, Métadonnées, Logistique et Accès totalisent 26 réussites.

```sh
node tests/mode-libre/native-browser.mjs
node tests/logistique/published-browser.mjs
node --test tests/mode-libre/arithmetic.test.mjs tests/mode-libre/metadata.test.mjs tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
```
