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

Le 23 novembre 2026, après correction des réglages de build Cloudflare, le contrôle effectué par l’utilisateur sur l’URL du Worker affiche `{"ok":true}`. Cela confirme que l’API est servie, mais ne vérifie ni le schéma D1 ni les accès administrateur. La création des comptes et la sauvegarde de leurs fiches en production restent à confirmer. Cette session ne dispose pas d’une authentification Cloudflare permettant de vérifier directement ces opérations distantes.

Dans **Workers & Pages → clairfle-fiches → Settings → Builds**, utiliser :

| Réglage | Valeur |
|---|---|
| Branche de production | `main` |
| Root directory | `api/fiches` |
| Build command | `npm ci` |
| Deploy command | `npm run deploy` |

Un build lancé depuis la racine avec `npm run build` construit l’interface du site. Le Worker des comptes doit exécuter `api/fiches/src/index.ts`, avec la liaison D1 `DB` définie dans `api/fiches/wrangler.toml`. Le déploiement seul n’applique pas les migrations D1.

Depuis `api/fiches`, avec un accès Cloudflare autorisé :

```sh
npm ci
npx wrangler login
npx wrangler d1 migrations list clairfle-fiches --remote
npm run db:apply
npm run deploy
```

Conserver les secrets existants `ACCESS_ADMIN`, `ACCESS_FULL` et `ACCESS_PARTIAL`. Aucun secret Resend n’est nécessaire. Le site conserve son URL d’API : `VITE_FICHES_API_URL=https://clairfle-fiches.phuoc-van.workers.dev`.

Ces secrets d’accès du Worker doivent correspondre aux mots de passe des accès existants du site : `ACCESS_ADMIN` à `VITE_ACCESS_ADMIN`, `ACCESS_FULL` à `VITE_ACCESS_FULL`, et `ACCESS_PARTIAL` à `VITE_ACCESS_PARTIAL`. Ils se règlent dans **Variables and Secrets**, de type **Secret**, sans en publier les valeurs. Le jeton de gestion `CLOUDFLARE_API_TOKEN` sert aux outils de déploiement ; ce n’est pas un mot de passe de l’application et il n’est pas requis dans les variables d’exécution du Worker.

**Attention à la section choisie :** les **Build variables** sont disponibles pendant la construction et le déploiement ; elles ne deviennent pas automatiquement des secrets d’exécution. `ACCESS_ADMIN` doit être ajouté au Worker dans **Settings → Variables and Secrets**, en dehors de **Builds**. Sa présence dans la liste des variables du build ne suffit pas.

### Contrôler la configuration du Worker

Après un déploiement réussi, ouvrir `https://clairfle-fiches.phuoc-van.workers.dev/health`. Ce contrôle public ne renvoie que des indicateurs et vérifie les colonnes par des requêtes `SELECT … LIMIT 0`, sans lire de données personnelles ni modifier de fiches.

| Indicateur de `checks` | Si la valeur est `false` |
|---|---|
| `adminAccessConfigured` | Le secret d’exécution `ACCESS_ADMIN` est absent ou vide sur ce Worker. |
| `databaseBound` | La liaison D1 `DB` manque. |
| `fichesSchemaReady` | La table des fiches ou une de ses colonnes nécessaires, dont `owner_id`, est indisponible. |
| `accountsSchemaReady` | Les tables des comptes ou sessions, ou leurs colonnes nécessaires, sont indisponibles. |

La réponse porte `service: "clairfle-fiches"`. Le statut HTTP est 200 quand tous les indicateurs sont vrais, 503 sinon ; une réponse 503 contenant ces indicateurs est donc un résultat de diagnostic exploitable. Une réponse 404 indique que cette version de l’API n’est pas encore déployée à l’adresse consultée. Ces indicateurs ne vérifient pas la valeur du mot de passe, l’historique des migrations ni une création effective de compte : après un contrôle positif, poursuivre les vérifications de connexion et de sauvegarde décrites ci-dessous.

Lors d’une demande de gestion des comptes avec un mot de passe saisi, l’absence de `ACCESS_ADMIN` renvoie désormais une erreur de configuration explicite (503), au lieu de signaler un mauvais mot de passe. Un mot de passe incorrect reste refusé (401) ; aucune authentification n’est contournée.

La migration `0002_personal_accounts.sql` crée les utilisateurs, sessions et propriétaires des fiches. La migration `0003_admin_accounts.sql` retire uniquement la table des anciens liens de confirmation ; utilisateurs, sessions et fiches sont conservés. La colonne historique `verified_at` indique désormais l’activation lors de la création par l’administrateur. Les anciens comptes en attente ne sont pas activés automatiquement.

Après déploiement : créer deux comptes depuis l’admin, vérifier leur connexion sans e-mail, enregistrer une fiche avec chacun, puis contrôler que chacun retrouve uniquement ses propres fiches. Vérifier aussi l’attribution et le retrait d’un domaine supplémentaire.

## Reprendre après un refus de mot de passe

Le message **« Le mot de passe n’est pas reconnu par la synchronisation »** correspond à un refus HTTP 401. Le navigateur efface alors le mot de passe de synchronisation refusé, tout en pouvant conserver l’accès administrateur à l’interface. Le message **« Saisissez votre mot de passe pour synchroniser les fiches »** indique que ce mot de passe n’est plus mémorisé ; il ne prouve pas une panne D1.

La page **Comptes enseignants** propose désormais **Confirmer l’accès administrateur** dans ces deux cas. Saisir le mot de passe administrateur puis cliquer sur **Accéder aux comptes** relance le chargement avec une vérification côté serveur. Si le refus intervient pendant une création, les champs restent saisis ; la création n’est pas rejouée automatiquement et exige un nouveau clic sur **Créer le compte**. Une autre solution reste de se déconnecter puis de revenir par **Admin / accès existant**.

Vérification de cette reprise : `node --test tests/interactive/accounts-auth-browser.mjs` couvre quatre scénarios navigateur (mot de passe absent, refus puis nouvelle saisie, création interrompue sans doublon, accès non administrateur refusé). Ce contrôle utilise une API simulée et ne remplace pas la vérification de production. Les comptes et sauvegardes ont également été vérifiés dans cette session avec un Worker et une D1 locaux isolés : 15 scénarios ont passé, dont la séparation des fiches, le retrait des droits et la persistance après redémarrage ; aucune donnée de production n’a été modifiée par ces tests.

Le SDK, le script de configuration et les variables Resend ont été retirés du projet. Si une clé avait été créée dans Resend, elle peut être révoquée ; aucun remplacement n’est nécessaire pour ce fonctionnement.
