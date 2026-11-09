# Architecture du jeu en classe

`convertRecipe` reconstruit la recette v1 avec les mêmes graines et blocs que le générateur A4. Les questions publiques ne contiennent ni corrigé ni indicateur de justesse. Les corrections vivent dans une table séparée, jamais transmise à `QuestionStage` ; `CorrectionView` est monté uniquement après l’action enseignant `REVEAL`.

`domain/plan.ts` construit les écrans de séance sans modifier la recette ou le jeu source. Les questions cochées sont regroupées par URL audio exacte. Un classement dérivé de l’identifiant du jeu et des questions retient au plus deux questions par piste, puis conserve leur ordre source. Deux QCM audio partagent un écran et les six emplacements : A–C et D–F. Une réduction éventuelle à trois choix conserve toujours le choix correct et deux distracteurs de la banque, avec avertissement. Aucun distracteur n’est fabriqué pour atteindre trois cartes. Les productions ouvertes ne sont pas transformées en QCM.

`domain/session.ts` reste une fonction pure. L’index désigne un écran du plan. `selections` associe chaque question à son choix. La discussion est bloquée tant que les deux QCM n’ont pas de sélection. La révélation et le saut enregistrent séparément chaque question source. Aucune action ne mesure les votes physiques. Le bouton précédent est retiré de l’interface ; la transition interne est conservée pour vérifier la cohérence de l’historique.

`SessionView` orchestre les effets et le rendu. Le minuteur observe la phase de réflexion, la pause, la visibilité de l’onglet et les événements du lecteur audio. Aucun événement audio ou expiration du minuteur n’émet une transition de phase. Les composants du tour restent montés pendant la pause pour conserver la position audio ; le contenu est masqué via `hidden`. Une nouvelle lecture réinitialise le temps de réflexion qui commencera à sa fin. Le lecteur est arrêté à la révélation et au changement d’écran.

Les préférences de palette v2 (pastel par défaut), formes v1 et minuteur v1 sont séparées dans `localStorage`. La session reste dans `sessionStorage`, isolée par identifiant de recette et plan. Une reprise ouvre la réflexion avec les choix effacés et l’historique conservé. Les formats ou valeurs de reprise invalides sont ignorés. Ni identité élève ni vote physique n’est enregistré.

`InteractiveApp` charge les brouillons par l’historique et les fiches enregistrées par l’API existante. Les routes et contrôles de domaine sont conservés. Les images déposées temporairement restent des données transitoires de navigation. Les composants et CSS interactifs sont chargés à la demande et leurs styles sont limités à `.ci-app`. La recette v1, les banques imprimables `src/jeux` et les composants de feuilles A4 ne sont pas remplacés.

Les variantes TCF `qcm_image` sont prises en priorité à partir de `formSelect.variants`, puis les QCM actifs ou les variantes texte valides. La sélection et la correction utilisent les identifiants des choix, pas leur texte. Une image correcte est affichée depuis le même objet de choix au corrigé.

Aucun nouveau serveur de séance, endpoint, preset partagé ou permission n’est introduit. La remise à niveau de l’authentification reste décrite dans [l’audit sécurité](audit-securite.md).
