# Audit et banques Gattegno

Les thèmes de phrases sont désormais : **Simple**, **Déterminants**, **Verbes pronominaux**, **Adjectif**, **Préposition**, **Adverbe** et **Conjonctions**. Les tableaux de référence restent séparés. Les anciens thèmes de négation sont réunis avec leurs thèmes affirmatifs.

Chaque exercice propose **Positive / Négative / Mixte**. Le réglage est propre à l’exercice, conservé lors d’un changement de format et propagé aux exercices/pages ajoutés. Le mode mixte équilibre les deux formes à une phrase près dès qu’au moins deux phrases sont demandées. Les anciennes recettes de négation sont migrées vers le thème correspondant avec la forme négative sélectionnée.

## Quotas des combinaisons

Chaque thème et chaque groupe de verbes (« Simple » et « Autres ») dispose désormais d’au moins **525 constructions affirmatives**, avec leurs **525 formes négatives**. Les 16 catégories sont séparées dans [combinations.json](combinations.json), avec les phrases complètes.

| Catégories présentes | Nombre par cas | Cas | Total |
|---|---:|---:|---:|
| Aucune des quatre : phrases simples | 50 | 1 | 50 |
| Adjectif seul, adverbe seul, préposition seule ou conjonction seule | 50 | 4 | 200 |
| Deux catégories : les six paires possibles | 25 | 6 | 150 |
| Trois catégories : les quatre trios possibles | 25 | 4 | 100 |
| Les quatre catégories ensemble | 25 | 1 | 25 |

Les sept thèmes et les deux groupes représentent **14 banques**, soit **7 350 références affirmatives et 7 350 négatives** dans ce rapport. Les six thèmes non pronominaux partagent des familles de constructions compatibles avec leur vocabulaire ; « Déterminants » conserve ses sujets avec déterminants. Les pronominaux ont leurs propres actions. Les anciennes constructions restent disponibles en complément de ces quotas. Les quantités sont des tailles de banque : une fiche conserve un seul modèle par verbe.

Les combinaisons associent des prédicats complets issus des banques, des adjectifs postnominaux explicitement accordés avec leur nom, des adverbes compatibles avec le verbe et des coordinations additives avec *et*. Le deuxième verbe garde son propre infinitif et sa conjugaison. Les phrases ne sont jamais rendues simples en supprimant une préposition obligatoire.

## Échantillon de contrôle historique

[audit.json](audit.json) contient **100 phrases distinctes par thème, par forme et par groupe de verbes** : 2 800 références au total, soit 100 affirmatives et 100 négatives pour chacun des deux groupes dans chacun des sept thèmes. Les noms propres, groupes nominaux et pronoms sont représentés. Les phrases proviennent de modèles verbaux avec des compléments rédigés et relus ; le moteur peut produire d’autres instanciations de ces modèles.

La banque pronominale comporte 61 constructions : 42 dans « Simple » et 19 dans « Autres », avec au moins trois contextes par construction. Les pronoms réfléchis et les verbes reçoivent des pastilles distinctes. Un même verbe n’est pas répété sur une fiche ; le nombre demandé est donc plafonné au nombre de modèles disponibles dans le groupe choisi. Cela ne limite pas la banque à ce nombre de phrases : chaque modèle possède plusieurs contextes et sujets possibles.

## Catégories autorisées

Chaque exercice propose quatre réglages **Avec / Sans** : adverbes, prépositions, conjonctions et adjectifs. « Avec » autorise la catégorie dans la banque du thème ; « Sans » l’exclut. Par défaut, les catégories sont autorisées. Les réglages se conservent dans les recettes, les changements de format et les nouveaux exercices/pages, et restent indépendants pour chaque bloc existant.

Les filtres sélectionnent des prédicats complets. Ils ne coupent pas un complément nécessaire : *s’occuper du jardin* est exclu sans prépositions. Des variantes pronominales simples ont été rédigées, notamment *Je me lève le matin* et *Je me rase la barbe*. *Le matin* reste un groupe déterminant + nom. Les mots négatifs *ne/n’* et *pas* restent disponibles même sans les autres adverbes.

Si la catégorie centrale du thème est exclue (par exemple « Adjectif » sans adjectifs), les modèles simples sont utilisés. Les quatre formats partagent le même tirage filtré. La quantité de questions tient compte du nombre de verbes encore disponibles, et les consignes de production écrite respectent les exclusions.

## Corrections issues de l’audit

- **Négation et élisions** : `J’n’éteins pas…` devient `Je n’éteins pas…` ; `Je ne m’habille pas…` place correctement le pronom réfléchi.
- **Articles** : `ne lit pas un roman` devient `ne lit pas de roman` ; les articles définis sont conservés. `ne… pas` ne change pas l’article attribut de *être*.
- **Contractions et h aspiré** : `de un voyage` devient `d’un voyage`, `près de le lac` devient `près du lac`, mais `de haricots` conserve le h aspiré.
- **Accords** : *ils lèvent / jettent / envoient* ; *elles sont contentes* ; tableaux complets pour *s’asseoir*, *se souvenir*, *se vêtir*, etc.
- **Catégories** : le pronom réfléchi est brun et le verbe orange ; *vanille* n’est plus étiqueté comme adjectif dans un prédicat ; les contractions prépositionnelles ont la bonne catégorie.
- **Cohérence** : suppression de sujets bébés pour des actions adultes ; remplacement de compléments peu naturels comme *laver la dent*, *continuer le chemin*, *savoir un poème* sans *par cœur*.
- **Conjonctions** : le verbe de la seconde proposition conserve sa propre conjugaison. Les assemblages aléatoires avec *donc*, *car* ou *mais*, sans relation de sens justifiée, sont remplacés par la coordination additive *et*.
- **Exercices** : une même graine sélectionne les mêmes phrases et sujets dans les quatre formats. Les mots à remettre dans l’ordre sont toujours effectivement mélangés. Les prénoms et noms géographiques gardent leur majuscule.

## Étendue du contrôle

Le contrôle parcourt les modèles, leurs prédicats et les personnes disponibles, en plus des 2 800 références. Il vérifie les catégories, les contraintes de chaque thème, les accords ciblés, l’orthographe des contractions, la négation, les trois modes, la migration des recettes et l’indépendance des blocs d’une même fiche. La cohérence des contextes a fait l’objet d’une révision éditoriale ; les assertions automatiques ne sont pas présentées comme une preuve générale du sens d’une phrase française.

```sh
node scripts/audit-gattegno.cjs --write
node scripts/audit-gattegno-combinations.cjs --write
```

Le second audit vérifie chaque quota exact, l’unicité dans chaque banque, les catégories réellement présentes, les accords des deux propositions et l’accès aux constructions via les paramètres, les trois formes et les quatre formats.

L’option `--write` régénère les rapports et les phrases de référence. Sans cette option, le script effectue les mêmes contrôles sans modifier les fichiers.
