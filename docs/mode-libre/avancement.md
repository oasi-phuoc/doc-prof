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
| L1 — Générateur et contrats d’état | En cours | Panneau unique, réglages communs et géométrie vérifiés sur le parcours Algèbre. Édition directe de l’addition A4. Identités, verrous, historique et reprise durable à mettre en place. |
| L2 — Pilotes | À lancer après L1 | Calcul avec recalcul, QCM illustré et document avec sous-questions. Prouver les parcours de bout en bout avant de généraliser. |
| L3 — Mathématiques et tests | À lancer après les pilotes | Mathématiques, géométrie, logique, TPM et TCM, selon les profils recensés. |
| L4 — Autres profils imprimables | À lancer après les pilotes | Alphabétisation, Soutien FR, Gattegno, calligraphie et cartes. |
| L5 — Grammaire et TCF/TPF | À lancer après les pilotes | Banques graduées, supports, audio, snapshots et barèmes. |
| L6 — Société et Logistique AFP/CFC | À lancer après les pilotes | Partir du générateur commun et de la référence Logistique V2.13 recensée en L0, avec les six types de contenu et les variantes Complet et Résumé. Valider les deux diplômes et leurs règles de rendu. |
| L7 — Cas d’échec et ergonomie avancée | À lancer après le socle | Cas de reprise, quotas, médias durables, pagination et actions en série. |
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
