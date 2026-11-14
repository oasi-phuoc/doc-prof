# Catégories audio et scénarios — 14 novembre 2026

La relecture des [1 021 questions](delf-actif-20261113/revue-contexte-20261114.md) et ses 41 corrections sont terminées. Le classement porte sur les **346 nouveaux supports DELF Actif** ; il ne constitue pas une nouvelle écoute humaine.

**Priorité demandée : générer les scènes avant les trios, en commençant par A1 puis A2.** Aucun nouveau trio QCM n’est ajouté pendant cette reprise.

**96 dialogues** conviennent à une association de scènes. **36 sont liés à une scène disponible** ; **60 attendent encore une validation ou une illustration**. Avec les 21 dialogues historiques, le tirage dispose de **57 pistes**, contre 21 auparavant.

| Nouveaux supports | Candidats | Avec scène disponible | À terminer |
|---|---:|---:|---:|
| A1 | 41 | 23 | 18 |
| A2 | 39 | 12 | 27 |
| B1 | 16 | 1 | 15 |
| Total | 96 | 36 | 60 |

Les **250 autres supports** gardent leurs formats de compréhension : 188 messages, annonces ou prises de position, 18 suites de phrases ou consignes, quatre échanges essentiellement temporels, cinq descriptions ou questionnaires et 35 documents longs. Cette catégorie ne signifie pas que leur transcription est incorrecte.

Les tags **court, moyen et long** suivent la durée ou la catégorie pédagogique documentée. **Scénario est un tag supplémentaire** : une situation cohérente et une scène liée au texte exact sont nécessaires. La sélection manuelle reporte ensemble audio, transcription et image. Deux scènes interchangeables ne sont pas tirées ensemble ; un changement de transcription invalide la liaison. Les deux leurres restent dans les thèmes entendus avec leurs concepts absents des transcriptions.

Le premier lot comportait [sept PNG A1/A2](generation-scenarios-20261114.json) servant à huit liaisons, et dix liaisons par réemploi. Ce lot est conservé.

La [reprise prioritaire](generation-scenarios-priorite-20261114.json) produit **20 nouveaux PNG A1 natifs 1 448 × 1 086** et repère un réemploi. **Douze scènes sont activées** après contrôle des rôles documentés : nouveau professeur, cahier oublié, arrivée en retard, aide à l’exposé, demande de chemin, certificat de scolarité, rangement des tapis, course sur piste, révision sans calculatrice, récréation avec blousons, remise du cahier de Dania et nouvelle camarade Anissa.

**Neuf autres images sont préparées sans activation**, car la transcription ne confirme pas toutes les personnes représentées : invitation au rugby, conseil pour un mal de ventre, bibliothèque, poisson avec riz, prêt du compas, musique et lecture, vélo et promenade, saut en hauteur et réemploi du jeu sur ordinateur. Elles attendent une vérification des personnes dans les voix de l’audio. Elles ne sont pas comptées comme scènes disponibles. Le registre distingue cette attente de la conformité graphique et conserve les images, prompts et empreintes.

La [suite des six scènes A2](generation-scenarios-a2-suite-20261114.json) est terminée : bagage levé au porte-bagages, place cédée, chien gardé devant la pâtisserie, comparaison de deux téléphones, shampoing/dentifrice et erreur de place. **Deux liaisons** sont activées (bagage et place cédée). Les **quatre autres images sont au catalogue**, avec personnes du dialogue à vérifier avant liaison. Tous les personnages utiles sont entiers ; le premier cadrage des téléphones est écarté. Le lot garde les octets PNG natifs et ne modifie aucun texte, QCM, corrigé ou audio. [Vérification des six banques](verification-scenes-a2-suite-20261114.json).

À la fin de la suite A2, les 64 attentes comprenaient 13 images préparées et 51 situations sans image. Ce bilan intermédiaire est conservé dans son registre. Le complément A1 ci-dessous actualise les totaux.

Le [complément A1](scenes-a1-complement-20261114.md) ajoute **13 PNG natifs**, **quatre liaisons** et **neuf préparations avec personnes à vérifier**. Les prénoms seuls ne valident pas le genre représenté. **Aucune situation A1 candidate ne reste sans image liée ou préparée.** Les 60 attentes se répartissent maintenant en **22 images préparées à vérifier** et **38 situations sans image préparée** (23 A2, 15 B1). [Registre](generation-scenarios-a1-complement-20261114.json) et [comparaison des banques](verification-scenes-a1-complement-20261114.json).

**Contrôle demandé sur les personnes :** vérifier les rôles, les destinataires de « Monsieur » et « Madame », les accords et les personnages nommés. L’apparence ou une estimation de hauteur de voix ne prouvent pas une identité de genre. Les cas non documentés restent en attente ; un enseignant peut rester hors cadre quand la source ne précise pas son genre. Les élèves figurants d’un groupe ne reçoivent pas arbitrairement la voix d’un locuteur précis. Aucune écoute humaine n’est attestée.

Les personnages varient en âge, carnation, genre, coiffure et morphologie, avec fauteuil roulant, appareil auditif et vêtements variés, sans stéréotypes. Ces choix illustratifs ne sont pas des informations à déduire des audios. Le rendu suit le commit **48a753d8**, avec paysage exact **4:3**, sujets utiles entiers et octets PNG conservés sans recadrage ni conversion.

La [comparaison des six banques](verification-scenes-priorite-20261114.json) confirme : **zéro nouveau trio, question, réponse, transcription ou MP3 modifié**. Les **277 trios DELF Actif actifs**, **469 candidatures restantes** et **370 trios historiques** sont conservés pendant la priorité aux scènes.

Le [registre de classement](scenarios-audio-20261114.json) conserve les 346 sources et les motifs individuels. Les images sont indexées dans la galerie et seules les scènes activées sont liées aux audios du sélecteur. Galerie : **6 641 images** ; catalogue audio : 8 801 fichiers, 6 634 questions et 14 856 formats de réponse.

Les contrôles couvrent les empreintes, les rôles documentés et l’exclusion des vingt-deux attentes illustrées, 600 tirages déterministes avec leurres thématiques, la sélection manuelle, les catalogues, TypeScript et les 1 021 décisions de contexte. Le rapport [Chromium prioritaire](scenarios-priorite-20261114-browser.json) complète celui du [premier lot](scenarios-audio-20261114-browser.json).

```sh
node scripts/check-tcf-association-images.mjs
node scripts/check-tcf-bank.mjs
python3 scripts/check-delf-actif-context-review.py
node tests/audio-replacement/scenarios-browser.mjs --priority
```

Le [contrôle Chromium A2](scenarios-a2-suite-20261114-browser.json) charge les six images d’une association comprenant les deux nouvelles liaisons, puis les six nouvelles scènes dans la galerie. Galerie : **6 865 images**. Catalogue audio : **8 801 fichiers**, **6 634 questions**, **14 856 formats**. Aucun nouveau trio ni écoute humaine dans cette suite.

Le [contrôle Chromium du complément A1](scenarios-a1-complement-20261114-browser.json) charge 18 images sur trois associations et les 13 nouveaux PNG dans la galerie. Les 12 tests de catalogues, TypeScript, la compilation et les 600 tirages passent. Galerie actuelle : **6 878 images**. Aucun QCM, corrigé ou audio modifié.
