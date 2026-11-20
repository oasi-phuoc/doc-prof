# Comptes créés par l’administrateur

Les comptes personnels sont créés depuis **Catalogue → Comptes enseignants**, avec le compte administrateur existant. Son mot de passe reste inchangé. Il n’y a plus d’inscription publique, de confirmation par e-mail ni de dépendance à Resend. Aucun domaine d’expédition n’est nécessaire.

## Créer un compte

1. Ouvrir **Comptes enseignants** avec l’accès admin.
2. Saisir le prénom, le nom et l’adresse professionnelle `@admin.vs.ch` de la personne. Cette adresse sert d’identifiant ; l’application ne prétend pas en vérifier la propriété.
3. Choisir un mot de passe de 8 à 128 caractères avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial. Le saisir une seconde fois.
4. Cocher les domaines supplémentaires souhaités. Algèbre, Géométrie et Alphabétisation sont incluses pour tous.
5. Cliquer sur **Créer le compte**. Le compte est actif immédiatement. Communiquer directement à la personne son adresse de connexion et le mot de passe choisi ; l’application n’envoie aucun e-mail.

La personne utilise ensuite **Mon compte** sur la page de connexion. Chaque compte voit ses propres fiches, et le nom du profil sert de nom d’enregistrement. Les anciennes fiches partagées restent accessibles avec les accès historiques. L’administrateur peut ajuster les domaines d’un compte ; les droits du serveur changent immédiatement, et la liste des domaines du navigateur est actualisée à la prochaine connexion.

Les mots de passe ne sont ni renvoyés par l’API ni enregistrés en clair : dérivation PBKDF2-SHA256 avec un sel aléatoire par utilisateur et 100 000 itérations. Les sessions durent sept jours et sont révocables à la déconnexion ; seuls leurs condensats sont stockés dans D1. Cinq échecs de connexion bloquent le compte quinze minutes. La création des comptes et la modification des accès exigent le rôle administrateur côté serveur.

## Activation du serveur

Le code et les tests sont prêts. Cette session ne dispose pas d’une authentification Cloudflare de déploiement : la migration distante et le Worker de production ne sont pas annoncés comme déployés.

Depuis `api/fiches`, avec un accès Cloudflare autorisé :

```sh
npm ci
npx wrangler login
npm run db:apply
npm run deploy
```

Conserver les secrets existants `ACCESS_ADMIN`, `ACCESS_FULL` et `ACCESS_PARTIAL`. Aucun secret Resend n’est nécessaire. Le site conserve son URL d’API : `VITE_FICHES_API_URL=https://clairfle-fiches.phuoc-van.workers.dev`.

La migration `0002_personal_accounts.sql` crée les utilisateurs, sessions et propriétaires des fiches. La migration `0003_admin_accounts.sql` retire uniquement la table des anciens liens de confirmation ; utilisateurs, sessions et fiches sont conservés. La colonne historique `verified_at` indique désormais l’activation lors de la création par l’administrateur. Les anciens comptes en attente ne sont pas activés automatiquement.

Après déploiement : créer deux comptes depuis l’admin, vérifier leur connexion sans e-mail, enregistrer une fiche avec chacun, puis contrôler que chacun retrouve uniquement ses propres fiches. Vérifier aussi l’attribution et le retrait d’un domaine supplémentaire.

Le SDK, le script de configuration et les variables Resend ont été retirés du projet. Si une clé avait été créée dans Resend, elle peut être révoquée ; aucun remplacement n’est nécessaire pour ce fonctionnement.
