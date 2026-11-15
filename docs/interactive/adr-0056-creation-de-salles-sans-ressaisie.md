# ADR 0056 — Configuration intégrée et accès enseignant réutilisable

Le propriétaire souhaite intégrer la configuration au code pour lancer les parties directement depuis ClairFLE. L’adresse publique est intégrée ; la clé privée de création reste dans le secret Cloudflare existant. L’activation du Worker reste une opération initiale d’hébergement, distincte du push de code.

## Adresse du serveur

`competition/config.ts` fournit l’adresse publique du Worker existant sans dépendre d’un nouveau réglage Vercel. Les variables dédiées gardent la priorité, puis la variable d’API fiches, notamment pour conserver l’isolation des tests locaux et des serveurs personnalisés. Aucune clé n’est codée en dur ni préfixée `VITE_`.

## Autorisation de création

La première création vérifie toujours `COMPETITION_HOST_KEY` côté serveur. Après une création réussie, le Worker émet un accès signé HMAC-SHA256, avec une origine autorisée, un domaine de signature propre à la création, une date d’émission, une expiration à 30 jours et un nonce aléatoire. L’usage de cet accès ne renouvelle pas son expiration. Changer la clé serveur invalide les autorisations existantes.

Le navigateur conserve seulement cet accès dans son stockage local, lié à l’adresse de l’API. La clé saisie n’est conservée ni dans le stockage local, ni dans celui de l’onglet. Les créations suivantes sont directes. Le bouton **Oublier mon accès enseignant** efface l’autorisation sur l’appareil et actualise les autres onglets ; une expiration ou un HTTP 401 réaffiche le formulaire. Un échec réseau ne supprime pas l’accès. Un stockage indisponible n’empêche pas la salle courante de fonctionner. La lecture locale accepte cinq minutes d’écart sur la date d’émission pour les appareils dont l’horloge retarde ; la signature et les dates restent strictement vérifiées côté serveur, sans cette tolérance.

Cet accès permet uniquement de créer des salles. Il ne remplace ni une autorisation enseignant sur une salle particulière, ni celle d’un élève. Il n’apparaît jamais dans les réponses publiques des salles. Les capacités historiques par salle gardent leur expiration de deux heures et leur stockage dans l’onglet. Le bouton d’oubli local ne ferme pas les salles déjà ouvertes et ne révoque pas une copie exportée du jeton ; la rotation de la clé serveur les invalide toutes. Les limitations de débit et les origines autorisées restent appliquées. Les anciens cookies de rôle client ne deviennent pas une preuve d’accès enseignant.

## Validation et activation

Les tests couvrent la signature, le changement de clé, l’expiration, l’origine, une durée falsifiée, les stockages indisponibles et la séparation des rôles. Le parcours navigateur crée une seconde salle depuis un autre onglet sans ressaisie, vérifie l’absence de clé privée dans les stockages, l’oubli partagé entre onglets et le retour au formulaire après un vrai refus serveur. Le test `workerd` crée une autre salle avec le jeton conservé après redémarrage du processus, sans renvoyer la clé privée. Le [relevé qualité](quality-room-access-results.json) distingue ces validations du contrôle de production bloqué par le réseau.

Le [guide d’activation](guide-competition.md#activation-par-ladministrateur) reste nécessaire pour déployer une première fois le Worker et y définir son secret. Le propriétaire a déjà renseigné `VITE_COMPETITION_API_URL` dans Vercel avec l’adresse attendue : elle reste prioritaire, sans modification nécessaire. Le contrôle direct du point public a été bloqué par le proxy réseau de cet environnement avant d’atteindre le Worker ; il ne renseigne pas son état de production. Aucun déploiement externe n’est effectué par cette modification.
