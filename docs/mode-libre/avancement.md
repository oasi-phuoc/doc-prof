# Suivi de la refonte du mode Libre

**Mise à jour le 26 novembre 2026**

- [Cahier des charges validé — V1.2](cahier-des-charges.md)
- [Référence du code consulté pour la publication](https://github.com/oasi-phuoc/doc-prof/commit/c24a995b76c68c284b2614e113120cdb2873ba81)
- [Cahier des charges Logistique V2.11](../logistique/cahier-des-charges.md) et [suivi Logistique](../logistique/avancement-cahier-des-charges-20261126.md)

## Prérequis Cloudflare

Le 26 novembre, le Worker `clairfle-fiches` a répondu HTTP 200 à `/health`, avec les vérifications d’accès administrateur et de schéma positives. D1 enregistre les trois migrations `0001_fiches.sql`, `0002_personal_accounts.sql` et `0003_admin_accounts.sql`. La requête préalable CORS depuis le site a répondu HTTP 204.

La recette en production a vérifié 22 réponses HTTP sur deux comptes synthétiques, dont un avec les droits Logistique AFP et CFC. Elle couvre la création par l’administrateur, le rejet d’un formulaire incomplet ou invalide, la connexion, le refus d’un doublon, les droits, l’enregistrement et l’isolation des fiches, le retrait d’un domaine et la révocation des sessions. Le nettoyage des deux comptes et des fiches de recette a été vérifié. Les suites locales du serveur et du script de déploiement ont également passé 18 tests. Le parcours et les commandes de vérification figurent dans la [documentation des comptes](../comptes/installation.md).

Dans Chrome, la recette du site de production a vérifié la connexion administrateur, l’ouverture de **Comptes enseignants**, la création depuis **Créer le compte** (HTTP 201) et la connexion du compte créé depuis **Mon compte** (HTTP 200). Le compte synthétique de ce test a également été supprimé.

## Avancement par lot

| Lot | État | Preuve ou étape suivante |
|---|---|---|
| Prérequis comptes | Validé en production | Recette Cloudflare, contrôle D1 et tests des comptes ci-dessus. |
| Cahier des charges | V1.2 validée | Exigences, arbitrages et critères de réception approuvés et publiés. |
| L0 — Inventaire exécutable | À lancer | Figer le commit et l’arbre Git sur la branche cible à jour. Établir la référence de build, les matrices par type et contrôle, les recettes historiques et les mesures écran/PDF. |
| L1 — Générateur et contrats d’état | À lancer après L0 | Panneau unique, géométrie de l’aperçu, identité des unités, verrous, historique et contrat de reprise. |
| L2 — Pilotes | À lancer après L1 | Calcul avec recalcul, QCM illustré et document avec sous-questions. Prouver les parcours de bout en bout avant de généraliser. |
| L3 — Mathématiques et tests | À lancer après les pilotes | Mathématiques, géométrie, logique, TPM et TCM, selon les profils recensés. |
| L4 — Autres profils imprimables | À lancer après les pilotes | Alphabétisation, Soutien FR, Gattegno, calligraphie et cartes. |
| L5 — Grammaire et TCF/TPF | À lancer après les pilotes | Banques graduées, supports, audio, snapshots et barèmes. |
| L6 — Société et Logistique AFP/CFC | À lancer après les pilotes | Partir du générateur commun déjà raccordé aux modules Logistique 101 et 105. Valider les domaines AFP et CFC pour la réception finale. |
| L7 — Cas d’échec et ergonomie avancée | À lancer après le socle | Cas de reprise, quotas, médias durables, pagination et actions en série. |
| L8 — Réception complète | À lancer après la couverture | Critères de réception, preuves par contexte, accessibilité, performances et revue. |

À chaque lot, inscrire le commit vérifié, les commandes et leurs résultats, les liens vers les preuves et les éventuels cas bloqués. L’état « validé » correspond à une condition de sortie démontrée.
