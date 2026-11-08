# Audit sécurité C0 — prototype, avant généralisation

Aucune valeur de secret n’est reproduite ici. L’audit porte sur le code source et les mécanismes, pas sur les comptes ou les données de production.

| Observation | État | Action avant production |
|---|---|---|
| Des variables et valeurs de repli d’accès sont utilisées par le frontend ; `vite.config.ts` recopie des variables d’accès dans le préfixe public Vite | Préexistant, critique | Déplacer la vérification de connexion au serveur ; ne plus embarquer de secret dans le bundle ; renouveler les valeurs exposées |
| Le cookie de rôle client contrôle la navigation | Préexistant, insuffisant comme authentification | Session serveur vérifiée, jeton/cookie adapté et contrôle de chaque opération côté serveur |
| Le mot de passe partagé de synchronisation est conservé côté navigateur | Préexistant | Remplacer par une session limitée ; revoir stockage et expiration |
| L’API de fiches valide le bearer et applique les domaines à la liste, aux lectures et mutations | Contrôle serveur présent, inspection de code | Ajouter des tests d’intégration des rôles et vérifier les environnements déployés ; le test API simulée du prototype ne démontre pas la sécurité serveur |
| Les en-têtes CORS reprennent l’origine reçue | Préexistant | Liste d’origines autorisées explicite, avec vérification de la configuration de déploiement |
| Presets et séances partagés | Non créés | Garder cette extension bloquée jusqu’à correction de l’authentification |

## Périmètre du prototype

Le module ajoute uniquement de l’état local : palette sans identité dans `localStorage`, progression sans nom dans `sessionStorage`, brouillon dans l’historique. Il réutilise l’API existante en lecture pour un lien de fiche ; il ne crée aucune route serveur, aucune permission étendue et aucune écriture partagée. Les contrôles de navigation et de domaines sont conservés, y compris pour la démonstration. Aucun mot de passe existant n’est ajouté aux tests, journaux ou captures.

Les tests utilisent un rôle de démonstration et un bearer fictif uniquement dans un navigateur isolé, avec une API interceptée. Aucun envoi à un serveur réel ni modification de fiche enregistrée.

**La remise à niveau de l’accès n’est pas terminée dans ce premier jalon. La mise en production et les fonctions partagées restent à traiter après cette correction.** Une simple suppression des paramètres frontend casserait les accès actuels sans fournir de remplacement ; il faut réaliser et tester la chaîne serveur complète avant la bascule.
