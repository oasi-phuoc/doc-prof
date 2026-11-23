# Relecture — Place de l’adjectif, A1 et A2

Date : 23 novembre 2026. Statut : pilote relu techniquement, validation enseignante en attente. La notion f12 couvre huit offres et porte Décrire à 39 offres sur 63.

Accès : Grammaire → Décrire → La place de l’adjectif → A1 — pilote ou A2 — pilote. Placer l’adjectif propose QCM/lacune aux deux niveaux ; Mots dans l’ordre travaille des groupes nominaux aux deux niveaux. Correction et transformation sont prévues en A2 uniquement.

| Niveau | Banques | Offres | Unités sélectionnables | Réalisations |
| --- | ---: | ---: | ---: | ---: |
| A1 | 2 | 3 | 100 | 150 |
| A2 | 4 | 5 | 200 | 250 |
| Total | 6 | 8 | 300 | 400 |

Les sources contiennent 50 situations A1 et 50 A2, réemployées entre mécaniques. Les 300 unités ne représentent pas 300 histoires originales. Certaines situations A2 forment des contrastes minimaux : les mots peuvent être proches, mais les faits, le sens demandé et la relation à exprimer changent. Ni les graines ni les seuls prénoms ne servent à atteindre le quota. Zéro approbation enseignante enregistrée.

## Progression linguistique

- En A1, la place est guidée explicitement : avant ou après le nom, avec l’adjectif indiqué. Le corpus comporte 25 groupes de chaque type et 32 adjectifs. Les couleurs, formes, origines et types d’objets alternent avec petit, grand, bon, joli, jeune, vieux, mauvais et nouveau. Une autre position n’est pas présentée comme systématiquement agrammaticale dans tous les registres : elle peut simplement ne pas satisfaire la consigne guidée.
- Bel, vieil et nouvel précèdent les noms masculins singuliers commençant par une voyelle ou un h muet : un bel arbre, un bel hôtel, un vieil immeuble, un vieil homme, un nouvel élève. Le h aspiré de héros maintient beau et vieux. Les pluriels et les féminins distinguent la position de l’accord.
- En A2, quinze adjectifs et cinquante contextes travaillent notamment ancien, seul, propre, certain, brave, pauvre, grand, cher, pur, vrai, simple, curieux, sacré et dernier. Les faits distinguent ancien statut / ancienneté, personne unique / sans compagnie, appartenance / propreté, bienveillance / courage, compassion / ressources, grandeur / taille, valeur affective / prix, intensité / classement, année finale / année précédente.
- Les règles de position ne sont pas absolues. Quinze situations A2 conservent une autre formulation recevable en contexte. Une variante admise n’est jamais proposée comme fausse réponse du QCM. La lacune et les reformulations gardent ces variantes ; les autres formulations équivalentes restent appréciées par l’enseignant.
- Les corrections comportent toutes une erreur d’accord véritable dans le groupe signalé. Elles ne reposent pas sur l’affirmation abusive qu’une inversion grammaticale serait toujours fautive. Le modèle corrige l’accord et garde le sens ; les variantes admises sont conservées. Les segments d’erreur sont contrôlés dans la phrase complète.
- Les transformations partent d’une expression descriptive rédigée, puis demandent un adjectif précis au même sens : une collègue qui travaillait auparavant avec moi → une ancienne collègue, une question facile → une question simple. Le reste de la phrase est conservé. Les identités et rôles restent fictifs.

## Groupes nominaux et tableau

Les activités d’ordre déplacent trois éléments pour construire un groupe nominal. La place y est imposée comme contrainte de manipulation, même lorsque le QCM ou la reformulation du même contexte admet plusieurs placements. Certains changements de position exigeraient aussi une autre forme, comme nouvel / nouveau : l’ordre conserve les mots effectivement fournis.

Le contrat `orderScope: noun-group` distingue ces groupes des phrases verbales et des étapes entières. Il est rejeté sur un autre type d’unité ou lorsqu’il est mélangé au contrat d’étapes. Les filtres de polarité et de catégories ne retirent pas les mots obligatoires de ces groupes ; les commandes correspondantes et les compteurs de phrases positives/négatives sont masqués. Les anciens exercices de phrases et de chronologie conservent leurs filtres et comportements.

Les situations et indices restent consultables dans le panneau de lecture du tableau, avec une question ou une consigne courte. Le glisser-déposer conserve les alternatives au toucher et au clavier, l’annulation et la correction privée jusqu’à révélation. Le groupe l’année dernière vérifie aussi la conservation de l’apostrophe.

Les lacunes réservent 75 mm pour écrire le groupe entier. Les cadres A4 conservent leur format fixe et les variantes de correction. Aucun texte n’est masqué pour faire tenir une page.

## Sources, compatibilité et suite

`scripts/build-grammar-adjectifs.py` compile seulement f12 à partir des deux TSV `adjectifs-f12-a1.tsv` et `adjectifs-f12-a2.tsv`. Le contrôle de reconstruction se fait dans un répertoire temporaire. Aucune illustration n’est requise pour f12 par le registre ; aucun média n’est généré.

La banque écrite historique f12 est supprimée ; les autres lignes, le CO et les théories sont conservés. La politique de retrait et sa requête D1 sont synchronisées localement. Le nettoyage des fiches enregistrées reste différé à la demande du propriétaire ; aucun script de consultation ou suppression distante, aucun déploiement Worker.

Dans le pool, QCM et ordre utilisent leur banque A1 par défaut ; correction et transformation utilisent A2, leur seul niveau disponible. Le niveau A2 des deux premiers types se choisit dans le générateur puis se conserve au lancement de cette sélection au tableau. Le réglage générique de difficulté du pool ne constitue pas actuellement un sélecteur de niveau grammatical.

Restent dans Décrire : superlatif f13 (10 offres), comparaison des quantités et activités f14 (8), description physique (6), soit 24 offres. Relecture pédagogique humaine, impression physique et recette ENI restent ouvertes.
