# Architecture de la première tranche

`src/interactive/domain/types.ts` sépare `Question` (projection publique), `Correction` (enseignant), `Game`, `Session` et `Action`. `QuestionStage` reçoit seulement la question publique, la phase, la sélection et la palette. Aucun indicateur de justesse n’est transmis aux cartes. La correction est rendue séparément, uniquement après l’action `REVEAL`.

`convertRecipe` reconstruit chaque bloc avec la graine employée par `buildWorksheets`, avant découpage pour impression. Les identifiants incluent la page source, le bloc, l’item, la sous-question et un hash déterministe du contenu. Les choix source ne sont pas gonflés artificiellement. Les remplacements d’images de la banque sont appliqués sans modifier les items source. Les images déposées temporairement passent dans un champ privé de navigation, sans modifier le contrat de sauvegarde de la recette v1 ; leur disponibilité après fermeture de l’onglet n’est pas garantie. Une recette `FicheRecipe` reste en version 1, sans champs de séance.

`transition` est une fonction pure. Elle interdit le choix avant le signal, la révélation avant discussion et le passage suivant avant révélation ; `SKIP` reste une action explicite. Pause bloque les actions. L’historique conserve la dernière observation par question, sans inventer un vote de groupe. Les productions ouvertes ont uniquement une observation manuelle.

`InteractiveApp` charge le brouillon depuis un état d’historique distinct ou retrouve une fiche via l’API existante. `/interactif`, `/interactif/:ficheId` et la démonstration passent par le contrôle d’accès existant et le contrôle des domaines. Les routes de rafraîchissement Vercel sont ajoutées. Les composants et CSS du jeu sont chargés à la demande et ne remplacent pas l’aperçu A4.

La palette est une préférence `localStorage` versionnée, indépendante de la fiche. La séance est conservée dans `sessionStorage` par recette et sélection de questions ; aucun nom d’élève ni vote physique n’est enregistré. Une reprise repart en réflexion pour ne pas exposer un corrigé sur le projecteur. « Recommencer à zéro » efface cette reprise. Le choix de questions et la configuration de jeu ne créent aucune écriture API.

Pas de preset partagé ni endpoint nouveau : cette extension attend la remise à niveau de l’authentification. Voir l’audit sécurité. Les médias sont lus explicitement, sans autoplay ; une erreur de chargement laisse la navigation possible.
