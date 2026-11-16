# ADR 0060 — Pools d’exercices de plusieurs domaines

**Jouer en classe** ouvre `/interactif`. L’enseignant sélectionne directement un ou plusieurs types d’exercices, dans un ou plusieurs domaines. Il n’est pas nécessaire de créer ou d’enregistrer une fiche.

La sélection reste cochée lorsque le domaine ou la recherche change. Chaque type conserve son niveau et son nombre d’éléments ; les séries composées conservent leur structure complète. Les générateurs numériques proposent aussi leur plage de nombres. Le mélange des questions est activé par défaut et peut être désactivé avant la préparation. Un pool contient au maximum seize types distincts.

## Exercices proposés

Le catalogue est construit depuis l’inventaire des adaptateurs existants, puis vérifié avec les véritables générateurs et médias locaux. La certification contrôle chaque niveau proposé, trois graines et les seize positions possibles dans un pool. Une erreur de génération, une conversion partielle ou un média absent retire le type ou son niveau de la liste. Les domaines sans type disponible disparaissent du filtre. Les domaines autorisés du compte restent appliqués.

Les indications propres aux activités guidées sont reconnues par une liste exacte ; elles ne masquent pas les autres erreurs. Une activité guidée conserve son modèle et l’appréciation de l’enseignant. Elle ne devient pas un QCM à score automatique. Les duels et salles utilisent uniquement les questions dont la réponse est vérifiable, comme auparavant.

```sh
npm run pool:catalog
```

Cette commande reconstruit et certifie le catalogue. Les commandes de développement et de compilation vérifient qu’il correspond toujours à l’inventaire. Avant l’enregistrement, la configuration réellement choisie est à nouveau convertie : chaque type doit produire des questions, sans erreur bloquante.

## Parties et stockage

Le jeu appelle directement les générateurs des domaines. Le format interne commun des paramètres est réutilisé, avec en-tête vide et génération active ; aucune fiche serveur ni saisie figée n’est chargée. La première partie emploie la graine vérifiée lors de la création du pool. Une nouvelle partie renouvelle la graine et garde les types, niveaux, plages et options. Les nouveaux tirages sont vérifiés avant remplacement ; un tirage incomplet est écarté sans enlever silencieusement un type.

Le pool est conservé dans le magasin IndexedDB `pools`, ajouté par migration vers la version 5. Les autres magasins et leurs données restent présents. `/interactif?pool=…` retrouve le pool dans le même navigateur. L’accueil propose les douze pools récents disponibles pour le compte. Modifier un pool en crée une nouvelle version avec un nouvel identifiant : les anciennes parties conservent leur source.

Classe, Solo, préréglages, feuille enseignant, préchargement, bilans et archives réutilisent le moteur existant. Les journaux portent une référence `pool`, la graine, les positions et options ; ils ne copient ni configuration institutionnelle ni corrigé. Une reprise conserve le tirage et la progression. Un export de partie exige le pool original sur cet appareil pour être réimporté. L’effacement global des données locales inclut les pools.

Les pools ne sont pas encore synchronisés entre appareils. Une salle en ligne reçoit ses questions résolues du pool et conserve le protocole de compétition existant. La disponibilité réelle des salles dépend de la configuration du serveur de compétition.

Les raccourcis historiques **Jouer cette fiche**, dans le générateur et la bibliothèque, restent disponibles pour rouvrir les parties existantes.

## Vérification

Les [tests de domaine](../../tests/interactive/pools.test.mjs) couvrent le catalogue, la validation, les graines, le mélange, la fidélité des paramètres, les références, les reprises et les charges de compétition. Le [parcours Chromium](../../tests/interactive/pools-browser.mjs) vérifie des pools de plusieurs domaines sans appel à l’API de fiches, Classe et Solo, mobile et ordinateur, reprise durable, nouvelle partie et modification sans altérer la source précédente. Les [résultats](pool-results.json), [captures](pool-proofs/index.html) et [contrôles exécutés](quality-pool-results.json) consignent la validation de ce lot.
