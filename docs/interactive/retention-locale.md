# Durée de conservation des séances

Les journaux et instantanés de schéma 1 ou 2 datant de plus de sept jours sont effacés lors d’une ouverture ou reprise de séance. Le nettoyage est mutualisé entre les lectures et répété au plus une fois par heure dans un même document. Les parties récemment utilisées sont conservées.

Les schémas inconnus et les dates impossibles à vérifier sont préservés : un ancien moteur ne doit pas supprimer les données d’une version future. La lecture d’une séance invalide reste refusée. Un échec d’accès à IndexedDB laisse le jeu utilisable avec le message de sauvegarde indisponible.

La purge se déroule dans une transaction IndexedDB. Une fenêtre restée ouverte sur un journal expiré ne peut pas le recréer avec une ancienne révision. Le modèle de fiche sur le serveur et les réglages permanents ne sont pas concernés.

Validation : `retention-browser.mjs` couvre deux schémas expirés, une séance récente, un schéma futur, une date invalide, le refus d’une ancienne écriture et le lancement du jeu après nettoyage. Résultats : `retention-results.json`.
