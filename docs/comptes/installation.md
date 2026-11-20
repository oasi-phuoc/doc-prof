# Comptes personnels et configuration Resend

Le code conserve les accès existants, notamment le rôle administrateur et son mot de passe actuel. Les nouveaux comptes sont personnels : prénom, nom, adresse professionnelle se terminant exactement par `@admin.vs.ch`, puis confirmation par e-mail. Mot de passe de 8 à 128 caractères avec majuscule, minuscule, chiffre et caractère spécial. Les mots de passe sont dérivés avec PBKDF2-SHA256, un sel aléatoire par utilisateur et 100 000 itérations. Les jetons de confirmation et de session ne sont conservés dans D1 que sous forme de condensats SHA-256. Confirmation valable 24 heures, session valable sept jours, révocation à la déconnexion.

Chaque utilisateur accède seulement à ses fiches. Le nom du profil remplace côté serveur le nom d’enregistrement envoyé par le navigateur. Les trois accès minimum sont Algèbre, Géométrie et Alphabétisation. L’administrateur peut attribuer d’autres domaines depuis Catalogue → Comptes enseignants ; les nouvelles autorisations apparaissent après reconnexion. Les comptes ne peuvent pas modifier eux-mêmes leurs droits. Les anciennes fiches partagées restent disponibles avec les accès existants ; aucune ancienne fiche n’est attribuée arbitrairement à un nouveau compte.

## État de cette livraison

Implémentation et tests locaux prêts. Le Worker de production et la migration D1 ne sont pas déployés depuis cette session : aucune authentification Cloudflare de déploiement n’est disponible. L’authentification OAuth du MCP Resend a été tentée mais la découverte OAuth est refusée par le réseau. Aucune clé publiée dans le chat n’a été utilisée. Aucun e-mail réel n’est annoncé comme envoyé.

## Expéditeur

`onboarding@resend.dev` sert uniquement à un test vers l’adresse du propriétaire du compte Resend, ou une adresse de test Resend. Ce n’est pas un expéditeur utilisable pour les inscriptions générales `@admin.vs.ch`. Le serveur refuse ce mode pour l’inscription. Les confirmations ne sont jamais redirigées vers une boîte personnelle : cela ne prouverait pas la maîtrise de l’adresse professionnelle.

Envoyer depuis `@outlook.com` ou `@admin.vs.ch` par Resend demanderait de valider ces domaines ; posséder une boîte mail ne donne pas ce droit. Pour ouvrir les inscriptions à tous, il faut un domaine ou sous-domaine dont les DNS sont administrables. L’adresse d’expédition peut appartenir à ce domaine, indépendamment du domaine professionnel des destinataires.

Documentation officielle lue : <https://resend.com/setup.md>. Le SDK officiel est installé côté Worker, jamais dans la page. Le modèle de confirmation est stocké dans Resend et appelé par son identifiant avec la variable `CONFIRMATION_URL`. Une clé d’idempotence est associée à chaque tentative de confirmation ; les erreurs transitoires sont retentées brièvement.

## Installation côté serveur

1. Se connecter à Cloudflare avec `npx wrangler login` depuis `api/fiches`, ou fournir un jeton Cloudflare de déploiement par le canal sécurisé de l’environnement. Exécuter `npm ci`, puis `npm run db:apply` pour appliquer `0002_personal_accounts.sql`. Les anciennes lignes sont conservées.
2. Révoquer toute clé Resend publiée dans un chat. Connecter le MCP Resend par OAuth ou fournir une nouvelle clé par le gestionnaire de secrets. Pour un essai : `node scripts/setup-resend.mjs --test`, depuis `api/fiches`, avec `RESEND_API_KEY` dans l’environnement sécurisé ; destinataire par défaut : la boîte personnelle indiquée par le propriétaire. Pour le modèle : `node scripts/setup-resend.mjs --template` avec un accès autorisant la gestion des modèles. La commande retourne l’identifiant du modèle sans afficher la clé.
3. Pour l’application, créer une clé Resend d’envoi limitée au domaine validé. Dans Cloudflare Workers, configurer `RESEND_API_KEY`, `RESEND_FROM` et `RESEND_VERIFY_TEMPLATE_ID` avec `npx wrangler secret put NOM_DU_SECRET` (saisie masquée). Aucun de ces secrets ne porte le préfixe `VITE_`. `APP_ORIGIN` doit être l’URL publique du site ; la valeur proposée est `https://doc-prof.vercel.app`.
4. Exécuter `npm run deploy`. Conserver les secrets existants `ACCESS_ADMIN`, `ACCESS_FULL` et `ACCESS_PARTIAL`. Ne pas les remplacer lors de la configuration des e-mails. Le site utilise déjà `VITE_FICHES_API_URL=https://clairfle-fiches.phuoc-van.workers.dev`.
5. Vérifier le parcours réel : inscription, réception, confirmation, connexion, enregistrement puis réouverture d’une fiche. Contrôler l’état `delivered` dans Resend. Un autre compte ne doit pas voir cette fiche. Les tests locaux simulent Resend et ne démontrent pas une livraison réelle.

Le connecteur MCP local `resend` a été ajouté à `https://mcp.resend.com/mcp`. Il reste à terminer `codex mcp login resend` dans un environnement qui peut joindre ce service. Cela ne remplace pas les secrets du Worker.
