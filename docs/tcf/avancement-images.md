# Avancement des illustrations CE / CO

## Priorité du lot en cours

Le périmètre CO demandé le 3 novembre 2026 couvre **les 834 sources audio actives**. **Priorité aux niveaux A1 et A2, au format paysage 4:3 et dans le style dessiné CE/CO défini.** Pour les prochaines images comportant des personnages, varier les visages, les origines et nationalités représentées, les genres, les âges, les morphologies et les situations de handicap, de façon naturelle et sans clichés. Les illustrations passent avant la reprise des 432 anciennes références audio encore à rapprocher. Aucune confirmation de périmètre supplémentaire n’est attendue.

**182 illustrations CO sont générées et contrôlées visuellement au format paysage 4:3 (1 280 × 960) : 169 illustrations de réponses et les 13 scènes d’association signalées par l’audit.** Les 41 premières images ont été reprises au bon format ; une version 4:3 du casque réutilisé complète cette correction. 77 nouveaux QCM image sont activés, avec les mêmes identifiants, réponses correctes et options texte. Les scènes d’itinéraire, d’achats et de famille sont rétablies ; leurs marqueurs d’image en attente sont retirés. L’ancienne scène montrant un bus de la mauvaise ligne n’est plus utilisée par l’exercice. La première image d’ordinateur contenant aussi un téléviseur parasite a été écartée et corrigée avant activation. Quatorze scènes avec personnages ont été régénérées avant intégration pour renouveler les distributions ; les professions médicales et la coiffure appliquent également cette consigne de diversité.

Le [plan CO des 834 sources](images-co-834-a-generer.json) conserve chaque réception, les liens vers les supports et les questions, les fichiers générés et les éléments restants. Il suit 423 questions candidates, dont 77 activées dans ce lot ; 346 restent à traiter. Parmi les 741 concepts initialement manquants du plan, 128 disposent désormais d’une image contrôlée en 4:3 ; 613 restent ouverts, y compris les réutilisations qui demandent une reprise au format requis. Ce nombre ne comprend pas les scènes d’association, maintenant terminées.

Lot CE prioritaire : **12 illustrations validées visuellement et 11 variantes QCM image CE activées**. Les deux variantes relatives aux légumes et aux équipements de hockey/neige sont maintenant incluses. La première version du théâtre avait des bras supplémentaires : elle a été écartée, corrigée et seule la seconde version est utilisée.

Le lot comporte désormais **48 nouvelles images CE validées et 59 variantes CE activées au total**, dont les 11 reprises prioritaires. Les réutilisations sont contrôlées visuellement et consignées (téléphone fixe, pommes de terre, théâtre, parking, tarte aux pommes, crème glacée, petit-déjeuner, musée et hôtel de ville). Les correspondances trompeuses restent écartées : le casque audio ne remplace pas un casque de vélo, et une lampe de chevet ne remplace pas une lampe de bureau.

Le registre reproductible [images-generees.json](images-generees.json) conserve les fichiers, empreintes, contrôles visuels et références des questions activées. Les QCM texte et les corrigés sont conservés. Les montants, dates, jours et mois ne sont pas ajoutés dans les images.

Le lot CO continue en priorité pour A1 et A2. Les nouveaux fichiers sont contrôlés à l’export : rapport 4:3 exact, sujet entier et style dessiné CE/CO. Les 834 réceptions restent toutes présentes dans le suivi, y compris celles qui partagent une analyse antérieure. Pour 234 sources, aucun exercice actuel n’est encore relié par les rapprochements disponibles : leurs illustrations de questions restent à définir une fois le lien établi. La présence d’une image existante ne certifie pas à elle seule son adéquation à la réponse.

## Suite

- Terminer les trios CO entièrement illustrables, dans le style dessiné CE/CO, puis reprendre les 432 références à rapprocher. Les réponses abstraites et les montants, dates, jours et mois restent en texte.
- Grammaire : les dix scènes de la première planche ont été régénérées individuellement dans le style dessiné CE/CO, contrôlées et intégrées aux activités ; 150 autres illustrations restent à générer. La planche photographique est écartée.
- Les autres candidats CE de [images-a-generer.json](images-a-generer.json) restent suivis individuellement. Ce plan historique renvoie au suivi CO actualisé ; ses 1 101 concepts initiaux ne sont pas tous générés.

## Audio et fiches enregistrées

Les 834 sources disposent de 1 548 extraits FLAC et MP3 préparés, plus 13 assemblages. **886 anciennes références sur 1 318 sont reliées à un candidat ; 432 restent ouvertes.** Aucune écoute n’est certifiée et la bascule des fichiers audio en production reste à faire, ainsi que la migration des fiches enregistrées. Le détail est dans [le rapport audio](remplacement-audio/README.md).

La variable du frontend est `VITE_FICHES_API_URL`. Elle pointe vers le Worker de l’API des fiches. La liaison à D1 est définie côté serveur dans `api/fiches/wrangler.toml`, avec le binding `DB` et la base `clairfle-fiches`. L’URL seule ne donne pas l’autorisation d’administrer ou migrer D1. Aucun contenu de `.env` privé n’a été lu ni publié.
