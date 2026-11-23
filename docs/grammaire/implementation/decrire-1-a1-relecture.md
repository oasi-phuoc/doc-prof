# Relecture — Décrire, première tranche A1

Date : 23 novembre 2026. Statut : pilote relu techniquement ; validation pédagogique humaine en attente. Cette livraison couvre 21 des 63 offres du thème. Elle ne clôt pas le thème.

Accès : Grammaire → Décrire → La météo, C’est / il est / il y a, Déterminants possessifs, Adjectifs qualificatifs ou Les professions → A1 — pilote.

| Notion | Activités | Offres | Unités sélectionnables | Réalisations |
| --- | ---: | ---: | ---: | ---: |
| Météo (f4) | 3 | 4 | 150 | 200 |
| Identifier, qualifier, présence (f5) | 3 | 4 | 150 | 200 |
| Possessifs (f6) | 3 | 4 | 150 | 200 |
| Adjectifs qualificatifs (f7) | 4 | 5 | 200 | 250 |
| Professions (f8) | 3 | 4 | 150 | 200 |
| Total de cette tranche | 16 | 21 | 800 | 1 050 |

Les cinq TSV contiennent 250 situations sources, réemployées entre les mécaniques. Les 800 unités ne représentent donc pas 800 histoires originales. Les 100 problèmes d’association comprennent chacun deux réponses, soit 200 liens ; leur contexte reste groupé au tableau. Les QCM et les lacunes partagent les mêmes unités.

## Choix linguistiques

- Météo : il fait + adjectif, il y a + groupe nominal, il pleut et il neige. Cinquante bulletins illustrés réemploient huit symboles météo. Les températures, horaires et intensités viennent du texte, pas du dessin. Les fichiers chaud/froid du catalogue représentent une boisson et un glaçon : ils ne servent pas à déduire la météo. Dans les associations, l’image illustre la situation 1 ; les deux bulletins sont écrits.
- C’est / il est / elle est / il y a : chaque situation précise l’acte demandé. Pour qualifier, la reprise par un pronom personnel est explicite ; on ne présente pas c’est + adjectif comme une construction généralement incorrecte. Les corrections ciblent des erreurs d’élision, de conjugaison et d’orthographe (Ce est, Il sont, Elle sont, il y as), sans déclarer automatiquement fautif tout emploi de il est + article. Les transformations donnent la phrase attendue sans conserver la question initiale.
- Possessifs : le possesseur fixe la famille du déterminant ; le nom fixe le genre et le nombre. Les cas mon amie, ton histoire, son adresse et sa haie distinguent la voyelle, le h muet et le h aspiré. Son sac à Nora et sa voiture à Paul distinguent le genre du nom de celui du possesseur. Leur / leurs dépend du nombre du nom, même avec plusieurs propriétaires. Les relations avec une amie, une école ou une activité ne sont pas décrites comme la propriété d’une personne.
- Adjectifs : accords attributs après être, avec des formes régulières et irrégulières (longue, sèche, belle, neuve…). Les adjectifs épicènes peuvent donner seulement deux choix distincts ; aucune graphie fausse n’est inventée pour atteindre quatre choix. Les transformations indiquent le nouveau sujet ; les productions demandent deux phrases et reprennent une seconde information fournie. Les états des personnages sont fictifs, sans jugement sur une personne réelle. Le bel prénominal relève de la future notion sur la place de l’adjectif.
- Professions : cinquante métiers distincts sont reliés à une activité et un lieu fictifs. Le pronom du personnage est donné, sans inférer le genre d’un métier. Les distracteurs sont pris dans d’autres domaines et les variantes acceptées ne servent pas de fausses réponses. Les échanges et productions passent explicitement à je suis… Le modèle reste non exclusif. Le vocabulaire de certains métiers demande un accompagnement : l’étiquette A1 du pilote ne constitue pas une certification pédagogique indépendante.
- Les productions, transformations, corrections et jeux de rôles restent guidés par l’enseignant, sans verdict automatique. Les modèles et les critères restent privés avant la révélation. Les jeux de rôles comprennent une relance fondée sur les faits du personnage.

## Médias, sources et retraits

Le [manifeste des médias](decrire-media-manifest.json) documente les huit réemplois et leurs empreintes. Les copies sous SHA-256 sont identiques aux sources et ne changent pas lors d’une modification ultérieure du catalogue. L’obligation IMG-f4-A1 couvre 50 situations illustrées, sans prétendre créer 50 images différentes. Les 7 967 entrées antérieures du catalogue sont conservées à l’identique ; huit entrées sont ajoutées.

`python3 scripts/build-grammar-decrire.py` compile f4–f8 à partir des TSV. La reconstruction de contrôle se fait en répertoire temporaire et compare les cinq banques et le manifeste, sans changer les données utilisées par les essais navigateur.

Les cinq banques écrites historiques remplacées sont supprimées ; les lignes restantes sont comparées à la version antérieure. La théorie et le CO restent protégés. La requête D1 est alignée localement avec la politique de retrait. Le nettoyage des fiches enregistrées reste différé à la demande du propriétaire ; aucun appel de consultation ou de suppression des fiches distantes, ni déploiement Worker.

À poursuivre dans ce même thème : comparaison (f9), place de l’adjectif (f12), superlatif (f13), comparaison de quantités et d’activités (f14), description physique et ses illustrations. Ces 42 offres ne sont pas déclarées livrées.
