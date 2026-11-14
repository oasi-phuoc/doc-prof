# Écrire une phrase en images

Dans Gattegno, les sept thèmes proposent **Écrire une phrase en images**, juste avant **Production écrite**. Chaque question présente une ligne d’indices et une ligne pour écrire. Par exemple : **je · manger · pomme** permet d’écrire « Je mange une pomme. ». Les déterminants et la conjugaison sont à compléter par l’élève ; plusieurs phrases peuvent convenir.

Les cadres reprennent les couleurs grammaticales du tableau Gattegno : pronom brun, verbe orange, nom vert, et les couleurs existantes pour les autres natures. Les pronoms sont toujours nommés pour préciser qui parle. **Afficher les mots sous les images** ajoute les autres légendes. Les relations abstraites, adjectifs et mots de négation restent des indices écrits dans leurs cadres de couleur.

## Choisir et personnaliser

La génération réutilise les constructions de la banque existante, avec le thème, le groupe de verbes, la forme positive/négative/mixte et les exclusions de catégories choisis. Une nouvelle génération renouvelle le tirage. Une construction dont un nom ou un verbe ne possède pas d’illustration compatible est exclue ; aucune image approchante n’est choisie pour masquer cette absence. Les 19 513 constructions de la banque ne sont donc pas toutes disponibles en images.

**Personnaliser les images** ouvre toutes les phrases de l’exercice, y compris celles réparties sur plusieurs pages. Pour chaque indice, on peut rechercher une image, modifier son mot, choisir sa nature grammaticale, changer sa place ou employer un mot seul. On peut aussi ajouter ou retirer des indices et des phrases, régler les légendes par phrase et adapter la phrase exemple. Ces choix se conservent dans la recette enregistrée.

La phrase exemple figure uniquement dans le corrigé. En Classe et Solo, les images sont agrandissables ; le modèle complet reste masqué jusqu’à sa révélation par l’enseignant. L’appréciation reste humaine, car les images admettent plusieurs réponses. Cet exercice ne fournit pas de QCM ni de score automatique de compétition.

## Illustrations

Les objets, personnages et lieux viennent du catalogue TCF existant. Les **8 pronoms** et **206 actions nouvellement illustrées** sont des fichiers individuels de **1 448 × 1 086 pixels**, avec un décor complet. Ils reprennent le [style TCF validé](../tcf/style-images.md) : peinture numérique semi-réaliste, volumes doux, contours fins et couleurs naturelles. Les visages, âges, carnations et vêtements varient entre scènes. Les références sont celles du commit `48a753d8d6bd095e41968b39da88dbcb331fee11`.

Les 214 nouveaux fichiers WebP complètent 35 références TCF ; *rouler* réutilise la scène de conduite en déplacement. Le [manifeste](illustrations-generation-20261114.json) conserve les originaux individuels et les empreintes SHA-256. Les anciens fonds blancs et les petites vignettes de planches sont exclus de l’application. Les images sont recherchables dans la collection Gattegno du catalogue.

La génération a atteint sa limite temporaire. La [file de reprise](illustrations-en-attente.json) contient 42 verbes sources et le bonus *rougir* encore à illustrer, avec leurs contextes. Ces entrées n’utilisent pas d’image de remplacement arbitraire. Le générateur conserve les prédicats disposant des images nécessaires ; on peut aussi personnaliser une phrase et employer des mots indices.

## Impression et contrôles

Les indices d’une phrase restent sur une seule ligne imprimée, avec leur ligne d’écriture. La pagination automatique prévoit trois phrases courtes par page, ou deux pour les séries d’indices plus denses. Les corrigés suivent le même découpage. Une taille de police personnalisée très élevée ou un en-tête inhabituellement long peut nécessiter moins de questions.

```sh
node --test tests/interactive/phrase-images.test.mjs
npm run test:gattegno:images:browser
npm run test:gattegno
npm run test:gattegno:browser
```

Le [parcours navigateur](phrases-images-browser-results.json) vérifie la personnalisation, la sauvegarde simulée et la relecture, les couleurs, l’impression A4, le zoom, les médias préchargés sans réseau et le modèle masqué avant révélation, sur ordinateur et téléphone. Les limites et les contrôles effectivement exécutés figurent dans le [relevé qualité](quality-phrases-images-results.json).
