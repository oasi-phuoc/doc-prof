# Inventaire des types du générateur, lot L0

Le relevé du 27 novembre 2026 fige le commit `561d0a0a8a5a07ce6ead950a44850926fb42336d` et son arbre `e2b1a0d7a2a973115f00fb87c8001bff5e9064dd`. Le [cahier des charges Logistique V2.13](../logistique/cahier-des-charges.md) et la publication `logistique-theories-101-306-407-409-v002` définissent les données de la cible.

La [matrice JSON](audit-types.json) rapproche 3 132 déclarations du catalogue et 4 086 contextes de génération sur 21 domaines. Le script suit les thèmes et les choix de type du générateur, les lettres et sons, les sous-thèmes de Grammaire et de Logistique, les niveaux et les supports des tests de français. Pour chaque génération, il relève les dispositions, les champs réellement présents et une empreinte du contenu. Les fixtures locales des rôles `admin`, `full` et `partial` donnent accès respectivement à 21, 19 et 3 domaines.

| Résultat | Contextes |
|---|---:|
| Générables | 3 365 |
| Générables en aperçu pilote de Grammaire | 528 |
| Masqués pour le niveau ou la variante | 171 |
| Sans unité produite | 4 |
| Avec erreur de génération | 15 |
| Domaines en préparation | 3 |

Les 15 erreurs de génération concernent 14 exercices Soutien FR et un exercice d’Alphabétisation. Les quatre résultats vides se trouvent dans ces deux mêmes domaines. Les entrées JSON conservent les identifiants, variantes et motifs pour la reproduction. Les deux déclarations de Calligraphie absentes des sélecteurs correspondent à d’anciens formats. Leur réouverture a été vérifiée par les lecteurs de recettes sur les deux témoins `calli-4-lignes` et `calli-6-lignes`. [Recettes](audit-recettes.md)

| Domaine | Types générables | Résumés générables | Résumés indisponibles |
|---|---:|---:|---:|
| Logistique CFC | 480 | 4 | 76 |
| Logistique AFP | 378 | 4 | 59 |

Le script exécute également les constructeurs des six tests standard et produit 117 pages avec contenu. Les compteurs de ces pages se trouvent dans la section `standard` du relevé JSON.

Le relevé initial au commit `e72ec7c24` utilisait la référence Logistique V2.11 et la publication `logistique-100-v001`. Il comptait 2 974 déclarations et 90 types Logistique générables. Ces chiffres correspondent à l’historique de cet arbre.

## Reproduction

Exécuter les commandes depuis la racine d’un checkout du commit audité muni des scripts de ce lot, avec Node 24 et les dépendances du verrou. La graine `20261126` fixe les inventaires des types et des recettes. Les droits individuels des comptes et les parcours qui ne passent pas par les sélecteurs du générateur restent à éprouver séparément.

```sh
npm ci
node scripts/audit-mode-libre.mjs /tmp/doc-prof-mode-libre types
```

Les variantes encore ouvertes comprennent les réglages qui modifient les règles d’un type au-delà du niveau et du support, les effets détaillés des contrôles, les profils d’édition et les comparaisons de rendu par famille. [Relevé des contrôles](audit-controles.md)
