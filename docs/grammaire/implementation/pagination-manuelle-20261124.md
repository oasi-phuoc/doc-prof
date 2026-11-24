# Questions groupées et sauts de page manuels — 24 novembre 2026

La demande du propriétaire remplace la pagination automatique précédente : **toutes les questions sélectionnées restent sur la page de l’exercice, même si elles dépassent l’A4**. Aucun budget de hauteur ne crée plus de page par question, document, situation ou bloc ajouté.

Un bouton dans la marge de chaque question permet d’ajouter ou d’annuler un saut après cette question, avec l’icône habituelle de TCF. Il est disponible pour les questions graduées, productions, situations ouvertes et questions de lecture/dialogue, ainsi que les questions des exercices historiques. Les supports de lecture seuls n’ont pas de bouton. Les commandes sont masquées à l’impression.

Les questions, options et ordre restent identiques après un clic. La numérotation continue sur la page suivante. Si la coupure intervient dans une lecture ou un dialogue, son support est rappelé sur la suite ; il n’est pas dupliqué dans le contenu sauvegardé ou réédité. Les exercices ajoutés restent sur la page d’origine tant qu’aucun saut n’est choisi. Une coupure après la dernière question ne crée pas de page vide.

Les clés stables `grammarPageBreakAfterQuestionIds` servent désormais à toutes les questions graduées, sans nouveau format de recette. Les exercices historiques gardent leurs indicateurs par index. Les théories, autres domaines, banques, audios, images et fiches enregistrées ne sont pas modifiés.

## Vérifications actuelles

- `npm run test:grammar:pagination` : les 493 offres graduées, six questions/situations ou deux textes, conservation complète des items, coupures successives, sauvegarde/relecture, répétition des supports, blocs multiples et ancien QCM.
- `npm run test:grammar:pagination:browser` ou `npm run test:grammar:browser` : six questions sur une seule page, icônes, clic et annulation, numéros, images, dialogue, lecture, ancien QCM et commandes absentes du rendu imprimé.
- Contrôles globaux des niveaux et contrats, régressions du présent/contact/négations/questions, compilation de production et lint.

Les preuves sont dans `pagination-manuelle-20261124-proofs/`. Le dépassement vertical est autorisé par cette nouvelle règle ; ce contrôle vérifie le regroupement et les coupures choisies, sans promettre qu’un nombre quelconque de questions tient physiquement sur l’A4.

Les anciens contrôles de toutes les banques sur A4 décrivent l’ancienne pagination automatique. Leur commande globale est conservée sous `test:grammar:browser:legacy-layout` pour référence ; la régression active utilise la règle manuelle. Les preuves des livraisons antérieures restent un historique de leurs révisions.
