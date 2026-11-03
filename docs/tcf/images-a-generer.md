# Plan historique des images QCM

> Plan initial conservé pour la traçabilité. Les 13 scènes d’association sont désormais réalisées. Le [suivi actuel](avancement-images.md) et le [plan CO des 834 sources](images-co-834-a-generer.json) font foi pour la reprise : priorité A1/A2, paysage 4:3, style dessiné CE/CO.

618 questions candidates ; 1101 images manquantes, plus 13 scènes d’association en attente. Aucun fichier image n’a été généré.

- Ne lancer aucune génération tant que le quota est épuisé.
- Relire les trois propositions et le support indiqué avant de générer.
- Les candidats sont un plan de reprise, pas une certification visuelle automatique.
- Réutiliser les images existantes indiquées ; générer seulement les assets manquants.
- Garder montants, dates, jours et mois en texte. Les horloges doivent avoir trois cadrans distincts.
- Ne lier formes.qcm_image qu’après création et contrôle des trois fichiers, avec mêmes id et correct que le QCM texte.
- Conserver le QCM texte et le corrigé rédigé.

Le fichier `images-a-generer.json` contient les références exactes, les trois réponses, les images réutilisables, les chemins prévus et tous les prompts.

## Scènes d’association prioritaires

Ces scènes ne sont pas utilisées dans les tirages automatiques tant que leur illustration reste en attente.

- `tcf-a2-s1-co-4` — dialogue 1 — `/lib/images/tcf/co/scenes/vie-quotidienne/les-dialogues-du-quotidien-1-audite.webp`
  Motif : The visible bus displays line 3 and is immediately beside the speakers at the stop. The assigned dialogue asks where to catch bus 15 and directs the person across the square, then into the first street on the right. This is a concrete line-number and route-context mismatch.
- `tcf-a2-sb-co-4` — dialogue 1 — `/lib/images/tcf/co/scenes/magasins/les-achats-1.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sb-co-4` — dialogue 2 — `/lib/images/tcf/co/scenes/magasins/les-achats-2.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sb-co-4` — dialogue 3 — `/lib/images/tcf/co/scenes/magasins/les-achats-3.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sb-co-4` — dialogue 4 — `/lib/images/tcf/co/scenes/magasins/les-achats-4.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sb-co-4` — dialogue leurre — `/lib/images/tcf/co/scenes/magasins/les-achats-leurre-1.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sb-co-4` — dialogue leurre — `/lib/images/tcf/co/scenes/magasins/les-achats-leurre-2.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue 1 — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-1.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue 2 — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-2.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue 3 — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-3.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue 4 — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-4.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue leurre — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-leurre-1.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.
- `tcf-a2-sc-co-4` — dialogue leurre — `/lib/images/tcf/co/scenes/vie-quotidienne/la-famille-2-leurre-2.webp`
  Motif : The referenced source file is absent from public/. The contact sheet displays a file-not-found error, so no image can be shown or semantically validated.

## tcf-a1j-s1-ce-1 — question 5

Quel moyen de paiement faut-il utiliser ?

- A. Une carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- B. Un chèque — générer be9f5ef48c65
- C. Des espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp

## tcf-a1j-s1-ce-1 — question 7

Que devez-vous faire avec le ticket reçu ?

- A. L'imprimer — générer f348b0b2fca9
- B. Le recopier — générer 3a9285e0fbda
- C. Le renvoyer — générer 755191a3fe03

## tcf-a1j-s1-ce-1 — question 8

Où devez-vous présenter votre ticket ?

- A. À l'accueil du musée — générer 5efd32f0afe4
- B. À la sortie du musée — générer c974906de914
- C. Au restaurant du musée — générer 89c8dff57510

## tcf-a1j-s1-ce-3 — question 6

Quel appareil utilise-t-on pour filmer ?

- A. Un téléphone portable — réutiliser /lib/images/vocabulaire/technologie/telephone-portable.webp
- B. Une caméra professionnelle — générer c863c24623c0
- C. Une tablette — réutiliser /lib/images/vocabulaire/technologie/tablette.webp

## tcf-a1j-s1-ce-4 — question 2

Quelle activité est proposée à la MLC ?

- A. Le théâtre — générer b3a9535d4a2f
- B. La natation — réutiliser /lib/images/vocabulaire/sports/natation.webp
- C. L'escalade — réutiliser /lib/images/vocabulaire/sports/escalade.webp

## tcf-a1j-s2-ce-1 — question 6

Que fait-on fondre dans la casserole ?

- A. Le chocolat et le beurre — générer 2df8e0308bac
- B. Le sucre et le chocolat — générer d9fd0d541584
- C. La farine et le beurre — générer c2b4e04cdc02

## tcf-a1j-s2-ce-2 — question 4

Que faut-il emporter pour se protéger du soleil ?

- A. De la crème solaire — générer 7594233a027f
- B. Un parapluie — réutiliser /lib/images/vocabulaire/accessoires/parapluie.webp
- C. Des gants — réutiliser /lib/images/vocabulaire/vetements/gants.webp

## tcf-a1j-s3-ce-3 — question 8

Quel cours a lieu le mercredi ?

- A. Le yoga — réutiliser /lib/images/vocabulaire/sports/yoga.webp
- B. Le surf — générer 6d404d15dcb9
- C. Le volleyball — réutiliser /lib/images/vocabulaire/sports/volleyball.webp

## tcf-a1-s2-ce-1 — question 2

Quel événement allez-vous fêter ?

- A. Un mariage — réutiliser /lib/images/tcf/co/bg/mariage.webp
- B. Un anniversaire — réutiliser /lib/images/tcf/co/bg/fete-anniversaire.webp
- C. Un départ en retraite — générer 9376dbc6cc4e

## tcf-a1-s2-ce-4 — question 10

Quel matériel est disponible pour les cours ?

- A. Des ordinateurs portables — générer 6743578c51e2
- B. Des appareils photo — générer bafe50cddb9a
- C. Des instruments de musique — générer 8f3006705008

## tcf-a1-s3-ce-1 — question 5

Que propose Léa pour dimanche midi ?

- A. Manger ensemble — générer b77ee749e60b
- B. Jouer au badminton — générer 0aa98aab3456
- C. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp

## tcf-a1-s3-ce-2 — question 9

Après quel lieu faut-il tourner à droite ?

- A. Le stade de foot — générer 0398dc176cac
- B. La piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp
- C. La mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp

## tcf-a1-s3-ce-3 — question 5

Que sert-on pendant la pause ?

- A. Du café et des croissants — générer 2b166a2961bd
- B. Du thé et des sandwichs — générer f613c53194b8
- C. Du jus et des biscuits — générer b0abeacde340

## tcf-a1-s3-ce-4 — question 2

Que peut-on emporter si l'on n'a pas faim ?

- A. Des biscuits ou un fruit — générer d64baf3eff8b
- B. Du fromage ou une soupe — générer 04116d502f22
- C. Une salade ou du poisson — générer 02cf8206027b

## tcf-a1-s3-ce-4 — question 4

Quel petit-déjeuner rapide est proposé ?

- A. Un bol de lait aux céréales — générer f740b5cee036
- B. Un bol de soupe aux légumes — générer 581507f7b820
- C. Un sandwich au fromage — générer 81795dce2be8

## tcf-a1-s3-ce-4 — question 7

Quel aliment apporte de la vitamine C ?

- A. Un fruit — réutiliser /lib/images/vocabulaire/fruits/fruit.webp
- B. Du pain grillé — générer a5a6f0ab9261
- C. Du café — réutiliser /lib/images/vocabulaire/boissons/café.webp

## tcf-a1-s4-ce-1 — question 4

Avec quoi faut-il prendre les gélules ?

- A. Un grand verre d'eau — générer 183eebb7cd69
- B. Un verre de lait — générer fc08f12c7321
- C. Une tasse de café — générer a61bbbcb4616

## tcf-a1-s4-ce-3 — question 1

Quelle activité est proposée ?

- A. Un vol en montgolfière — générer 20ba09710800
- B. Un vol en avion — générer 6beb6cafc0f3
- C. Une sortie en bateau — générer 368a7ed3ecad

## tcf-a1p-s4-ce-1 — question 7

Quelle activité Thomas adore-t-il ?

- A. Faire du vélo — générer bbbd36cf47df
- B. Jouer au tennis — générer 26876e2318ce
- C. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp

## tcf-a1-tpa-ce-4 — question 5

Que propose le restaurant le matin ?

- A. Des petits-déjeuners — générer 588fadad8728
- B. Des concerts — réutiliser /lib/images/vocabulaire/musique/concert.webp
- C. Des cours de cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp

## tcf-a1-tpb-ce-3 — question 4

Quel déjeuner est proposé le samedi ?

- A. Un déjeuner indien — générer df269517fadb
- B. Un déjeuner mexicain — générer 46df304677b6
- C. Un déjeuner italien — générer 82c87ca020f8

## tcf-a1-sem1-ce-2 — question 7

Que va-t-on manger ?

- A. Des glaces et des bonbons — générer 5c62465d7eb1
- B. Des crêpes et des gâteaux — générer 030efc6984f5
- C. Des fruits et des biscuits — générer 64af636138e5

## delf-a1v-ce-002 — question 2

Quel type de chaussures faut-il porter ?

- A. Des chaussons d'escalade — générer 449e9b7e8e29
- B. Des bottes de pluie — réutiliser /lib/images/vocabulaire/vetements/bottes-de-pluie.webp
- C. Des chaussures de ski — générer 806691849798

## delf-a1v-ce-002 — question 4

Quel vêtement est conseillé ?

- A. Un pantalon souple — générer b4548c105274
- B. Un costume — réutiliser /lib/images/vocabulaire/vetements/costume.webp
- C. Une robe de soirée — générer c7bf9ea3fa5a

## delf-a1v-ce-003 — question 2

Que vont-ils manger ?

- A. Une soupe à la courge — générer 85a4901c09b9
- B. Une salade de tomates — générer ffb4171c4e3e
- C. Une pizza au fromage — générer b678c5e49e03

## delf-a1v-ce-007 — question 7

Avec quel professionnel Karim a-t-il rendez-vous le soir ?

- A. Un dentiste — réutiliser /lib/images/vocabulaire/metiers/dentiste.webp
- B. Un médecin — réutiliser /lib/images/vocabulaire/metiers/médecin.webp
- C. Un coiffeur — générer 885edeb02c7b

## delf-a1v-ce-008 — question 8

Quelle activité est proposée après le repas ?

- A. Jouer aux cartes — générer b445eb281345
- B. Regarder un film — générer 288e5a9a788e
- C. Faire une promenade — générer 36a122d59ba7

## delf-a1v-ce-011 — question 6

Que peut-on manger au marché ?

- A. Des marrons chauds — générer 8429cd4152ab
- B. Des glaces — réutiliser /lib/images/vocabulaire/desserts/glace.webp
- C. Des crêpes — réutiliser /lib/images/vocabulaire/desserts/crêpe.webp

## delf-a1v-ce-013 — question 1

Quel objet Julien vend-il ?

- A. Un vélo de ville — générer 3415ce9ccecf
- B. Un vélo de course — générer 074b50f18ca4
- C. Un vélo d'enfant — générer 254a56e0dea7

## delf-a1v-ce-016 — question 1

Sur quel bouton faut-il appuyer pour allumer la machine ?

- A. Le bouton rouge — générer de7e6a795304
- B. Le bouton bleu — générer c98436035d39
- C. Le bouton vert — générer 6c7a07bea2b2

## delf-a1v-ce-016 — question 3

Avec quel liquide faut-il remplir le réservoir ?

- A. De l'eau froide — générer 58609410062e
- B. De l'eau chaude — générer 666bb407c360
- C. Du lait froid — générer 1fe74c5ecc57

## delf-a1v-ce-021 — question 7

À côté de quel magasin se trouve la boutique ?

- A. Le magasin de jouets — réutiliser /lib/images/tcf/co/bg/magasin-jouets.webp
- B. Le magasin de chaussures — réutiliser /lib/images/tcf/co/bg/magasin-chaussures.webp
- C. Le magasin de fleurs — générer 909d4bb264fc

## delf-a1v-ce-022 — question 7

Après quel lieu faut-il tourner à droite ?

- A. Le pont — générer b3120ed6dab5
- B. La fontaine — générer adb2adefbf24
- C. La mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp

## delf-a1v-ce-024 — question 5

Devant quelle entrée faut-il retrouver Pierre ?

- A. L'entrée A — générer b641d16a3e55
- B. L'entrée B — générer 1c3f6146a48e
- C. L'entrée C — générer c81ae09b15f3

## delf-a1v-ce-024 — question 7

En face de quoi se trouve la patinoire ?

- A. Du parking — générer 78e8682f2fb1
- B. Du restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp
- C. Du cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp

## delf-a1v-ce-026 — question 5

Où faut-il tourner à droite ?

- A. À la fontaine — générer 54294ec7857b
- B. Au parking — générer b539ebfaf403
- C. À la sortie — générer 92d379e0fbf8

## delf-a1v-ce-028 — question 4

À quelle heure part le premier bus de la ligne 12 de la gare ?

- A. À 7 h — réutiliser /lib/images/vocabulaire/heure-horloge/sept-heures.webp
- B. À 7 h 10 — réutiliser /lib/images/vocabulaire/heure-horloge/sept-heures-dix.webp
- C. À 7 h 22 — générer 55e74376a470

## delf-a1v-ce-028 — question 5

À quelle heure le deuxième bus de la ligne 12 passe-t-il au Lac ?

- A. À 7 h 18 — générer 1e9a3b6b4f48
- B. À 7 h 08 — générer ef5a8bbc48a6
- C. À 7 h 32 — générer 0e6613aa2b72

## delf-a1v-ce-030 — question 8

Que peut-on gagner au tirage au sort ?

- A. Un panier garni — générer c9128b611947
- B. Un gâteau — réutiliser /lib/images/vocabulaire/desserts/gâteau.webp
- C. Un livre de recettes — générer 52806b6e76ae

## delf-a1v-ce-034 — question 6

Sous quelle forme est servi le petit-déjeuner ?

- A. Un buffet — réutiliser /lib/images/vocabulaire/maison/buffet.webp
- B. Un panier à emporter — générer aa1c608b838f
- C. Un plateau en chambre — générer b90fd3918c5d

## delf-a1v-ce-036 — question 1

Quelle activité est proposée aux enfants ?

- A. Le théâtre — générer b3a9535d4a2f
- B. La danse — réutiliser /lib/images/vocabulaire/loisirs/danse.webp
- C. La peinture — réutiliser /lib/images/vocabulaire/loisirs/peinture.webp

## delf-a1v-ce-041 — question 2

Quel espace extérieur possède l'appartement ?

- A. Un balcon — réutiliser /lib/images/tcf/co/bg/balcon.webp
- B. Un jardin — réutiliser /lib/images/tcf/co/bg/jardin.webp
- C. Une terrasse — générer c99a5652f3bc

## delf-a1v-ce-042 — question 1

Quelle activité est proposée le jeudi soir ?

- A. La danse — réutiliser /lib/images/vocabulaire/loisirs/danse.webp
- B. La peinture — réutiliser /lib/images/vocabulaire/loisirs/peinture.webp
- C. Le théâtre — générer b3a9535d4a2f

## delf-a1v-ce-042 — question 5

Quel commerce va ouvrir ?

- A. Une boucherie — générer 59a49a38191a
- B. Une boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. Une pharmacie — réutiliser /lib/images/tcf/co/bg/pharmacie.webp

## delf-a1v-ce-047 — question 6

Quels meubles sont à vendre ?

- A. Un canapé et deux fauteuils — générer d563f0fe7936
- B. Un lit et deux tables — générer 2cba1526dfe4
- C. Une armoire et deux chaises — générer 71abc491732c

## delf-a1v-ce-050 — question 1

Quels produits vend-on à la ferme ?

- A. Du fromage et du miel — générer dcc41d44506b
- B. Du pain et de la confiture — générer f2bab4ed0d7b
- C. Des fruits et des légumes — générer b190abf23f89

## delf-a1v-ce-053 — question 10

Quels lieux relie la ligne ?

- A. La gare et l'aéroport — générer e3e6e88601ba
- B. La gare et le port — générer 12c0929eeb18
- C. L'aéroport et l'université — générer 862a7b0eed6b

## delf-a1v-ce-054 — question 4

Quel lieu occupait cet espace auparavant ?

- A. Un parking — générer f6145b0eb230
- B. Une école — réutiliser /lib/images/tcf/co/bg/ecole.webp
- C. Une gare — réutiliser /lib/images/tcf/co/bg/gare.webp

## delf-a1v-ce-054 — question 6

Que cultive-t-on dans le jardin ?

- A. Des légumes et des fleurs — générer 8a96589c653c
- B. Des céréales et des arbres fruitiers — générer f2ef3fc89b65
- C. Du café et du thé — générer a2c2223bca60

## delf-a1v-ce-057 — question 4

Que prépare Kenji ?

- A. Des sushis — réutiliser /lib/images/vocabulaire/aliments/sushi.webp
- B. Des tartes — réutiliser /lib/images/vocabulaire/desserts/tarte.webp
- C. Des pommes de terre — générer 3762b0724d76

## delf-a1v-ce-059 — question 8

Quel spectacle est prévu le mois prochain ?

- A. Un spectacle d'oiseaux de proie — générer d38d01f66d88
- B. Un spectacle de dauphins — générer 6b805b842d01
- C. Un spectacle de chevaux — générer c4dc2fa029f7

## delf-a1v-ce-060 — question 5

Que faites-vous samedi matin ?

- A. Une randonnée jusqu'au lac — générer 1906a52da05c
- B. Une visite de fromagerie — générer ff0883747975
- C. Du ski de fond — générer 49f09ac722ee

## delf-a1v-ce-060 — question 6

Où est prévu le pique-nique ?

- A. Au bord de l'eau — générer 92017c946914
- B. Dans le chalet — réutiliser /lib/images/tcf/co/bg/chalet.webp
- C. Au centre du village — générer 175c31a5007d

## delf-a1v-ce-063 — question 6

Que faut-il acheter chez Globe-trotter pour profiter de l'offre ?

- A. Un sac de voyage et un guide — générer debf3c7f606d
- B. Une valise et un billet — générer ec4e1aad3b84
- C. Un livre et une carte — générer 1ae7fa03bb95

## delf-a1v-ce-064 — question 6

Quel plat peut-on commander toute la journée ?

- A. Des sandwichs — réutiliser /lib/images/vocabulaire/aliments/sandwich.webp
- B. Des plats chauds — générer 3d979241f136
- C. Des crêpes — réutiliser /lib/images/vocabulaire/desserts/crêpe.webp

## delf-a1s-ce-001 — question 7

Quel objet est interdit ?

- A. Le dictionnaire — générer 16edefcaf66e
- B. Le stylo — réutiliser /lib/images/vocabulaire/ecole-bureau/stylo.webp
- C. La montre — réutiliser /lib/images/vocabulaire/accessoires/montre.webp

## delf-a1s-ce-004 — question 4

Où a lieu le spectacle ?

- A. Au collège — réutiliser /lib/images/tcf/co/bg/ecole.webp
- B. Au théâtre de la ville — générer 0524d82daa72
- C. À la mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp

## delf-a1s-ce-005 — question 4

Que trouve-t-on dans le frigo ?

- A. Des légumes et du poisson — générer 0bd01d1c691f
- B. De la viande et des pâtes — générer 9308a1f43419
- C. Du fromage et du pain — générer 4870a4852b1d

## delf-a1s-ce-010 — question 1

Quelle activité l'annonce propose-t-elle ?

- A. Une course à pied — générer 5a1574cc2c23
- B. Une course à vélo — générer 16ee39bed5cd
- C. Une course de natation — générer 3d177d7559e9

## delf-a1s-ce-011 — question 9

Où les poèmes gagnants seront-ils affichés ?

- A. Dans les bus de la ville — générer 0b7277dd9f7f
- B. Dans les restaurants — générer cb04689a1675
- C. Dans les trains — réutiliser /lib/images/vocabulaire/transports/train.webp

## delf-a1s-ce-013 — question 5

Que faut-il faire avant de se baigner ?

- A. Prendre une douche — générer 541a4f6f18e3
- B. Acheter un ballon — générer 44507d327b8c
- C. Manger un repas — générer fa398fcc51f6

## delf-a1s-ce-025 — question 8

Dans quel rayon se trouve le livre ?

- A. Le rayon jeunesse — générer f9bacdc6bb2d
- B. Le rayon histoire — générer cd3a2d334f3c
- C. Le rayon sciences — générer affc30f91b04

## delf-a1s-ce-028 — question 6

À quelle heure le premier car de semaine arrive-t-il à Sembrancher ?

- A. À 9 h 52 — générer 1a367037384d
- B. À 9 h 35 — réutiliser /lib/images/vocabulaire/heure-horloge/neuf-heures-trente-cinq.webp
- C. À 10 h 05 — réutiliser /lib/images/vocabulaire/heure-horloge/dix-heures-cinq.webp

## delf-a1s-ce-028 — question 7

À quelle heure le second car de semaine arrive-t-il à Médran ?

- A. À 16 h 26 — générer 27142fe870b0
- B. À 16 h 05 — réutiliser /lib/images/vocabulaire/heure-horloge/seize-heures-cinq.webp
- C. À 16 h 58 — générer f90be793c188

## delf-a1s-ce-028 — question 9

À quelle heure le car du week-end en hiver arrive-t-il à Verbier centre ?

- A. À 14 h 28 — générer 4d6fd6154071
- B. À 13 h 56 — générer ff97ec9cf16f
- C. À 19 h 58 — générer 26fa9e60dfc4

## delf-a1s-ce-029 — question 5

À quelle heure le tram arrive-t-il à Plainpalais ?

- A. À 10 h 58 — générer 7eff6b16ffd8
- B. À 11 h 04 — générer b95cd40f4a50
- C. À 11 h 09 — générer afee6fb3bb32

## delf-a1s-ce-029 — question 6

À quelle heure le tram arrive-t-il à la Cité universitaire ?

- A. À 11 h 04 — générer b95cd40f4a50
- B. À 10 h 58 — générer 7eff6b16ffd8
- C. À 11 h 09 — générer afee6fb3bb32

## delf-a1s-ce-032 — question 10

À quelle heure le train de Zurich est-il annoncé ?

- A. À 9 h 52 — générer 1a367037384d
- B. À 8 h 47 — générer 79a966aca07b
- C. À 7 h 54 — générer ca520b37ed6b

## delf-a1s-ce-033 — question 1

Quel type d'objets est proposé dans l'annonce ?

- A. Des livres et des fournitures d'occasion — générer dad711280a0f
- B. Des vêtements neufs — générer 9662969a96f3
- C. Des instruments de musique — générer 8f3006705008

## delf-a1s-ce-034 — question 9

Quel atelier se déroule à la cafétéria ?

- A. L'atelier cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp
- B. L'atelier théâtre — générer ad5f5ee754d1
- C. L'atelier robotique — générer cd81fadbd4f8

## delf-a1s-ce-035 — question 8

Que vont-ils visiter l'après-midi ?

- A. Le parc et ses labyrinthes — générer f0642fa82cd9
- B. La ville et ses magasins — générer 21a92886c330
- C. Le musée et sa bibliothèque — générer 7927734b3a2b

## delf-a1s-ce-036 — question 1

Quel type d'atelier est proposé ?

- A. Un atelier de robotique — générer 614ee218d8de
- B. Un atelier de cuisine — générer c91385d544ea
- C. Un atelier de théâtre — générer 139003908d9f

## delf-a1s-ce-037 — question 9

Quel organisme peut aider à trouver un stage ?

- A. Le centre d'orientation professionnelle — générer 83e5fa300de8
- B. La bibliothèque municipale — générer 2e0a9f709018
- C. Le centre sportif — générer 43d9cbad7d30

## delf-a1s-ce-038 — question 9

Que Tom rêve-t-il de voir ?

- A. Les montagnes — réutiliser /lib/images/tcf/co/bg/montagne.webp
- B. Un parc d'attractions — réutiliser /lib/images/tcf/co/bg/parc-attractions.webp
- C. Un musée d'art — générer 640c7c11101e

## delf-a1s-ce-041 — question 9

Quel type d'hébergement utilise-t-elle en été ?

- A. Le camping — réutiliser /lib/images/tcf/co/bg/camping.webp
- B. Les hôtels de luxe — générer 5a631dace7d2
- C. Les auberges de jeunesse — générer 2759e93c0b22

## delf-a1s-ce-044 — question 1

Quel musée vient d'ouvrir ?

- A. Le musée du chocolat et des bonbons — générer 7884656e2b9e
- B. Le musée du pain et des fromages — générer f705403727bd
- C. Le musée des fruits et des légumes — générer 07c194ba234d

## delf-a1s-ce-045 — question 3

Quel matériel trouve-t-on dans ce magasin ?

- A. Des instruments de musique et des partitions — générer 3f84d04e8209
- B. Des vêtements et des chaussures — générer 2086536a8acb
- C. Des livres et des fournitures scolaires — générer 0dae713b1148

## delf-a1s-ce-045 — question 4

Quel type de matériel d'événement vend-il aussi ?

- A. Du matériel de concert — générer 4f9afec867b7
- B. Du matériel de camping — générer 872bf5d86c62
- C. Du matériel de cuisine — générer 7631463b2625

## delf-a1s-ce-046 — question 3

À côté de quel bâtiment se trouve la nouvelle bibliothèque ?

- A. L'hôtel de ville — générer 98453d119856
- B. La gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Le théâtre — réutiliser /lib/images/tcf/co/bg/theatre.webp

## delf-a1s-ce-047 — question 5

Quel crayon faut-il apporter ?

- A. Un crayon gris — générer 3455f12e5a59
- B. Un crayon rouge — générer cb2ed9ffce00
- C. Un crayon jaune — générer e5cc06969f06

## delf-a1s-ce-049 — question 1

Quel événement le collège organise-t-il ?

- A. La fête de la musique — réutiliser /lib/images/tcf/co/bg/concert.webp
- B. La fête du sport — générer 0bd6b7d5f018
- C. La fête du cinéma — générer ffe7b67dbbd3

## delf-a1-2022-ce-ex1-auberge — question 8

Où faut-il passer le jour du départ ?

- A. À la réception — réutiliser /lib/images/vocabulaire/voyage/reception.webp
- B. Au restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp
- C. Au bureau de change — générer 7d5809830e71

## delf-a1-2022-ce-ex1-carte — question 7

Où Ana lit-elle des livres ?

- A. Dans les cafés — réutiliser /lib/images/vocabulaire/boissons/café.webp
- B. Dans les trains — réutiliser /lib/images/vocabulaire/transports/train.webp
- C. Dans les musées — générer 1c08c1565dbf

## delf-a1-2022-ce-ex2-clinique — question 4

À côté de quel bureau se trouve l'accueil pendant cette période ?

- A. Le bureau des frais de séjour — générer f31c48803543
- B. Le bureau des admissions — générer 74b0ba9d4501
- C. Le bureau de la pharmacie — générer 51293f821bf0

## delf-a1-2022-ce-ex4-voisins — question 3

Dans quels espaces publics la fête se déroule-t-elle ?

- A. Les rues — générer 4554b45d4555
- B. Les gares — générer da3a26757d82
- C. Les stades — générer 2fee91c2d821

## tcf-a1j-s1-co-3 — question 1

Quel gâteau Marie propose-t-elle de préparer ?

- A. Un gâteau au citron — générer a14ef527c4c4
- B. Un gâteau au chocolat — générer 40b742b7985d
- C. Un gâteau aux fraises — générer 8921a6017fbb

## tcf-a1j-s2-co-1 — question 3

Quel fromage les visiteurs vont-ils manger ?

- A. Du fromage de chèvre — réutiliser /lib/images/vocabulaire/aliments/fromage-de-chevre.webp
- B. Du fromage de brebis — générer c83761f74ee0
- C. Du fromage de vache — générer dd39092e3677

## tcf-a1j-s2-co-3 — question 1

Quels fruits faut-il utiliser ?

- A. Des poires au sirop — générer c52b42c054fb
- B. Des pommes fraîches — générer 696e493d40b2
- C. Des pêches au sirop — générer f694221012ff

## tcf-a1j-s2-co-5 — question 5

Quel gâteau Adrien prépare-t-il ?

- A. Un gâteau aux pommes — générer 6feafff4fbbb
- B. Un gâteau au chocolat — générer 40b742b7985d
- C. Un gâteau au citron — générer a14ef527c4c4

## tcf-a1j-s2-co-5 — question 7

Quels objets de protection sont conseillés ?

- A. Des lunettes de soleil et de la crème solaire — générer fc15cf96998e
- B. Un parapluie et un imperméable — générer 5fb44e9d6044
- C. Des gants et un bonnet — générer 83d487815c0d

## tcf-a1j-s3-co-1 — question 1

À quel cours Lisa propose-t-elle de participer ?

- A. Un cours de piano — générer 58eb70256485
- B. Un cours de violon — générer 79c78f62683b
- C. Un cours de flûte — générer e7bad43ee047

## tcf-a1j-s3-co-2 — question 4

Où peut-on manger après la visite ?

- A. Au restaurant du musée — générer 89c8dff57510
- B. À la cafétéria de la gare — générer 2c195660c1de
- C. Au restaurant du parc — générer 80f2e4138d02

## tcf-a1j-s3-co-5 — question 7

Quel accessoire faut-il prendre pour la tête ?

- A. Un chapeau — réutiliser /lib/images/vocabulaire/vetements/chapeau.webp
- B. Un casque de vélo — générer 6b018e889cae
- C. Un bonnet de laine — générer f137023c3623

## tcf-a1j-s3-co-5 — question 8

Quel produit Jeanne apporte-t-elle ?

- A. De la crème solaire — générer 7594233a027f
- B. Du dentifrice — réutiliser /lib/images/vocabulaire/hygiene/dentifrice.webp
- C. Du savon — réutiliser /lib/images/vocabulaire/hygiene/savon.webp

## tcf-a1-s1-co-1 — question 5

Où Gilles propose-t-il de manger ?

- A. Dans un restaurant près de son hôtel — générer 99f6abbf3068
- B. Dans le restaurant de son entreprise — générer 1e3815bad790
- C. Dans un café près de la gare — générer a3e05ed537e8

## tcf-a1-s1-co-2 — question 1

Dans quel rayon faut-il aller pour profiter de l’offre ?

- A. Au rayon librairie — générer 0463ade9b531
- B. Au rayon vêtements — générer 723dc1d4401b
- C. Au rayon bricolage — générer cad994ca20f9

## tcf-a1-s1-co-2 — question 5

Où faut-il demander le bon de participation ?

- A. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- B. À l’entrée — réutiliser /lib/images/tcf/co/bg/entree-maison.webp
- C. À la librairie municipale — générer 06bb33f69462

## tcf-a1-s1-co-5 — question 4

Quels produits d’hygiène faut-il mettre dans le sac ?

- A. Le dentifrice et les brosses à dents — générer 46205d9bab84
- B. Le savon et le shampooing — générer 414095db5c3f
- C. La crème et le parfum — générer 8149d2f1ec7d

## tcf-a1-s2-co-2 — question 6

Quel accessoire coûte 25 euros ?

- A. Un chapeau — réutiliser /lib/images/vocabulaire/vetements/chapeau.webp
- B. Un sac — générer b48c69f2021e
- C. Un parapluie — réutiliser /lib/images/vocabulaire/accessoires/parapluie.webp

## tcf-a1-s2-co-5 — question 4

Quels aliments composent le dessert ?

- A. De la glace avec une banane — générer 0bea21a7ce1a
- B. Un gâteau avec des fraises — générer cf4d4662031f
- C. Un yaourt avec une pomme — générer ac85576d88c3

## tcf-a1-s3-co-4 — question 5

Dans quel rayon se trouve le produit ?

- A. Au rayon frais — générer f088bcb378ed
- B. Au rayon boissons — générer 9068718fd913
- C. Au rayon boulangerie — générer 71457a190482

## tcf-a1-s4-co-4 — question 1

Quel objet est nouveau ?

- A. Un sac — générer b48c69f2021e
- B. Un manteau — réutiliser /lib/images/vocabulaire/vetements/manteau.webp
- C. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp

## tcf-a1p-s4-co-1 — question 6

Quel moyen de paiement faut-il apporter ?

- A. Un chèque — générer be9f5ef48c65
- B. Une carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- C. Des espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp

## tcf-a1p-s4-co-2 — question 4

Quels objets sont disponibles gratuitement ?

- A. Des journaux — générer c3fbdd8fc4e4
- B. Des écouteurs — réutiliser /lib/images/vocabulaire/technologie/écouteurs.webp
- C. Des couvertures — réutiliser /lib/images/vocabulaire/maison/couverture.webp

## tcf-a1p-s4-co-5 — question 5

Quels vêtements faut-il apporter pour se protéger du soleil et se baigner ?

- A. Un chapeau et un maillot de bain — générer 83244c3241ea
- B. Un bonnet et une combinaison de ski — générer d31fa32e3d3f
- C. Un manteau et des gants — générer d6a833dd034a

## tcf-a1p-s3-co-1 — question 7

Quel dessert sera apporté ?

- A. Une tarte aux pommes — générer 3cfdd714bc3a
- B. Un gâteau au chocolat — générer 40b742b7985d
- C. Une salade de fruits — réutiliser /lib/images/vocabulaire/desserts/salade-de-fruits.webp

## tcf-a1p-s3-co-3 — question 2

Avec quel professionnel le premier rendez-vous a-t-il lieu ?

- A. Le dentiste — réutiliser /lib/images/vocabulaire/metiers/dentiste.webp
- B. Le médecin — réutiliser /lib/images/vocabulaire/metiers/médecin.webp
- C. L’avocat — générer b4fc7ef8ff4d

## tcf-a1-tpa-co-1 — question 4

Où faut-il aller chercher Margot ?

- A. À l’école — réutiliser /lib/images/tcf/co/bg/ecole.webp
- B. À la gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Au centre sportif — générer eb86112d610e

## tcf-a1-tpa-co-4 — question 1

Quel restaurant la personne n’aime-t-elle pas ?

- A. Le restaurant de l’université — générer ab7eea2adade
- B. Le restaurant de la gare — générer 916d6573cd97
- C. Le restaurant de l’hôtel — générer a6a917953b36

## tcf-a1-tpb-co-2 — question 3

À quelle heure le train partira-t-il ?

- A. À 9 h 06 — générer e802c3136a5f
- B. À 9 h 16 — générer b00433f344ad
- C. À 10 h 06 — générer 1ae59e877906

## tcf-a1-tpb-co-3 — question 2

Quel type d’entreprise recrute ?

- A. Une entreprise de service — générer ca9308bedad2
- B. Une entreprise agricole — générer fbef88ae7ff6
- C. Une entreprise de construction — générer 72793a334b97

## tcf-a1-tpb-co-4 — question 1

Quel lieu la personne cherche-t-elle ?

- A. La piscine de l’université — générer 1b8a6531398e
- B. La bibliothèque de l’université — générer 650d2ccd338f
- C. La cantine de l’université — générer e1b23bf8a5a6

## tcf-a1-sem1-co-1 — question 6

Que doivent-ils attendre ?

- A. L’arrêt de l’avion — générer 5aa49e2ac262
- B. Le départ de l’avion — générer a5e7da9881ab
- C. L’arrivée du pilote — générer 27b5a54e76f5

## tcf-a1-sem1-co-2 — question 1

Où peut-on manger le midi ?

- A. Au restaurant de l’entreprise — générer 724a3551d63f
- B. Au restaurant du musée — générer 89c8dff57510
- C. Au restaurant de la gare — générer a65d7fbb8151

## tcf-ss-a1-s1-co-4 — question 5

Où faut-il venir chercher le cadeau ?

- A. À l’accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- B. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- C. À la sortie — générer 92d379e0fbf8

## tcf-ss-a1-s4-co-1 — question 1

Quel appareil faut-il pour acheter l’e-ticket ?

- A. Un téléphone portable — réutiliser /lib/images/vocabulaire/technologie/telephone-portable.webp
- B. Un ordinateur fixe — générer b3d5349627f5
- C. Une imprimante — réutiliser /lib/images/vocabulaire/technologie/imprimante.webp

## tcf-ss-a1-s4-co-3 — question 5

Avec quoi peut-on colorier les espaces vides ?

- A. Des crayons de couleur ou des feutres — générer 611e4d8fae64
- B. De l’encre ou du charbon — générer 65ec158c94f0
- C. Des craies ou de la peinture — générer 964bf515d232

## tcf-ss-a1-s5-co-2 — question 4

Quel dessert Claire apporte-t-elle ?

- A. Une tarte aux fraises — générer ac7f419dce8c
- B. Un gâteau au chocolat — générer 40b742b7985d
- C. Une salade de fruits — réutiliser /lib/images/vocabulaire/desserts/salade-de-fruits.webp

## tcf-ss-a1-s5-co-3 — question 4

Quel moyen de paiement faut-il apporter ?

- A. Un chèque — générer be9f5ef48c65
- B. Une carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- C. Des espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp

## tcf-ss-a1-s6-co-2 — question 2

Pourquoi le voisin n’est-il pas content ?

- A. La musique est trop forte — générer d40f9534a8fd
- B. Le chien aboie — générer e6b09c3823b1
- C. La porte est bloquée — générer c6c7e35f3ad8

## tcf-ss-a1-s6-co-3 — question 3

À quel service la carte d’étudiant permet-elle de s’inscrire ?

- A. La bibliothèque — réutiliser /lib/images/tcf/co/bg/bibliotheque.webp
- B. Le gymnase municipal — générer 986e43727f55
- C. La piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp

## tcf-ss-a1-s8-co-4 — question 4

Que visitent les élèves le matin ?

- A. Un musée de peinture — générer f84b97e2c8a8
- B. Un château — réutiliser /lib/images/tcf/co/bg/chateau.webp
- C. Un musée des sciences — générer 46975abea508

## tcf-ss-a1-s9-co-2 — question 4

Quelle est la cause de son retard ?

- A. Une panne de métro — générer d234bb4f3f76
- B. Une panne de voiture — réutiliser /lib/images/vocabulaire/transports/panne-de-voiture.webp
- C. Un embouteillage — réutiliser /lib/images/vocabulaire/transports/embouteillage.webp

## tcf-ss-a1-s9-co-3 — question 8

Quel achat Alex demande-t-il de faire ?

- A. Les tickets — générer 730428bfd894
- B. Les boissons — réutiliser /lib/images/vocabulaire/boissons/boisson.webp
- C. Les glaces — réutiliser /lib/images/vocabulaire/desserts/glace.webp

## tcf-ss-a1-s9-co-4 — question 7

Que feront-ils le soir ?

- A. Regarder la télévision — générer b14ac3e444af
- B. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Jouer au tennis — générer 26876e2318ce

## tcf-ss-a1-s10-co-2 — question 1

Quel vêtement la personne a-t-elle acheté ?

- A. Une robe rouge — générer 437924daf0f1
- B. Une veste bleue — générer a840cdfdb301
- C. Une jupe verte — générer 88a6b997029d

## tcf-ss-a1-s10-co-2 — question 7

Quels goûts Margot aime-t-elle pour le gâteau ?

- A. Le chocolat blanc et les fruits rouges — générer cbd917e14911
- B. Le chocolat noir et les agrumes — générer 6bd6e7b6fb55
- C. La vanille et la noix de coco — générer 5163b8b75348

## tcf-ss-a1-s10-co-3 — question 1

Quels logements sont proposés à la visite ?

- A. Des studios et des appartements — générer 37f0f189b732
- B. Des maisons et des châteaux — générer dcfdb434c1c3
- C. Des bureaux et des magasins — générer 248becd5d0f2

## tcf-ss-a1-s10-co-3 — question 4

Quel espace extérieur accompagne les studios ?

- A. Une terrasse — réutiliser /lib/images/tcf/co/bg/terrasse.webp
- B. Un balcon fermé — générer 566306fb620a
- C. Une piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp

## tcf-ss-a1-s11-co-2 — question 2

Quel pain faut-il utiliser ?

- A. Une demi-baguette — générer d50ee3d47055
- B. Un croissant — réutiliser /lib/images/vocabulaire/aliments/croissant.webp
- C. Du pain de mie — générer 75277054f3bf

## tcf-ss-a1-s12-co-2 — question 1

Quel musée va ouvrir ?

- A. Un musée d’art moderne — générer 0ab5acf21bf4
- B. Un musée des sciences — générer 46975abea508
- C. Un musée d’histoire — réutiliser /lib/images/tcf/co/bg/musee-histoire.webp

## tcf-ss-a1-s12-co-4 — question 5

Quel moyen de paiement est refusé ?

- A. Les chèques — générer 832e6c1c473f
- B. Les espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp
- C. La carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp

## tcf-ss-a1-s13-co-4 — question 2

Quelle activité Anthony propose-t-il ?

- A. Travailler ensemble — générer 0ff0cb7ee5af
- B. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Faire du sport — réutiliser /lib/images/tcf/co/bg/salle-de-sport.webp

## tcf-ss-a1-s13-co-4 — question 4

Quel objet ne faut-il pas oublier ?

- A. Le cahier — réutiliser /lib/images/vocabulaire/ecole-bureau/cahier.webp
- B. La calculatrice — réutiliser /lib/images/vocabulaire/ecole-bureau/calculatrice.webp
- C. Le dictionnaire — générer 16edefcaf66e

## tcf-ss-a1-s14-co-1 — question 3

Quelle activité a lieu le lundi midi ?

- A. Le club photo — générer be39ec8513e6
- B. Le club musique — générer d294f42dde99
- C. Le cours de gym — générer 2514fe5e2c2a

## tcf-ss-a1-s14-co-3 — question 5

Quelles chaussures faut-il mettre ?

- A. Des chaussures de sport — générer 156f40c5a624
- B. Des bottes de pluie — réutiliser /lib/images/vocabulaire/vetements/bottes-de-pluie.webp
- C. Des chaussures de ville — générer f9e55937da20

## tcf-ss-a1-s14-co-3 — question 6

Quel accessoire faut-il porter sur la tête ?

- A. Une casquette — réutiliser /lib/images/vocabulaire/vetements/casquette.webp
- B. Un casque de vélo — générer 6b018e889cae
- C. Un bonnet de laine — générer f137023c3623

## tcf-ss-a1-s14-co-3 — question 7

Que faut-il apporter pour le pique-nique ?

- A. Un sandwich et une bouteille d’eau — générer 0e50e0292c3c
- B. Une pizza et une canette de soda — générer 031a1cb863f6
- C. Une soupe et une tasse de café — générer cbfdf11e0ab8

## tcf-ss-a1-s14-co-3 — question 8

Que Manu apporte-t-il pour toute la classe ?

- A. Une boîte de gâteaux — générer d9194de5459f
- B. Un panier de pommes — générer 44868384583f
- C. Un paquet de bonbons — générer c7b5c71ee5d5

## tcf-ss-a1-s16-co-1 — question 4

Comment la lumière dans la pièce est-elle décrite ?

- A. La pièce est sombre — générer e4d4747cb9f7
- B. La pièce est lumineuse — générer c3ad38ae591f
- C. La pièce est très ensoleillée — générer 0538db01b3bb

## tcf-ss-a1-s16-co-2 — question 4

Quels autres articles sont proposés ?

- A. Des chaussures et des accessoires — générer bff90c628f6f
- B. Des livres et des jeux — générer 6b1a724b2cf1
- C. Des meubles et des lampes — générer f643b34acc71

## tcf-ss-a1-s16-co-4 — question 2

À côté de quel objet les clés se trouvent-elles ?

- A. Le pot de fleurs — générer 27d9003ce885
- B. Le téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp
- C. La télévision — réutiliser /lib/images/vocabulaire/technologie/télévision.webp

## tcf-ss-a1-s17-co-4 — question 4

Quels aliments composent les entrées décrites ?

- A. Des légumes — générer 159b7a5e2950
- B. Des fruits — réutiliser /lib/images/vocabulaire/fruits/fruit.webp
- C. Du poisson — réutiliser /lib/images/vocabulaire/aliments/poisson.webp

## tcf-ss-a1-s18-co-2 — question 1

Dans quel rayon la promotion sur le poisson a-t-elle lieu ?

- A. Le rayon frais — générer 0177c3d081c4
- B. Le rayon surgelés — générer 265d102b4b5b
- C. Le rayon vêtements — générer 40dee4eb73ea

## tcf-ss-a1-s18-co-3 — question 2

Où les clients doivent-ils aller pour payer leurs achats ?

- A. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- B. À l’accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- C. À la sortie du parking — générer 149ccf4c7d95

## tcf-ss-a1-s19-co-3 — question 1

Quel sport les élèves vont-ils pratiquer ?

- A. Le tennis de table — générer da47aae8b2d9
- B. Le basketball — réutiliser /lib/images/vocabulaire/sports/basketball.webp
- C. Le football — réutiliser /lib/images/vocabulaire/sports/football.webp

## tcf-ss-a1-s19-co-3 — question 3

Quels livres la personne cherche-t-elle ?

- A. Les livres d’histoire — générer 1d65bd85ca69
- B. Les livres de français — générer 6ed45c61f006
- C. Les livres de mathématiques — générer 64fa8a3eb9de

## tcf-ss-a1-s19-co-4 — question 1

Quel rendez-vous est annulé ?

- A. Un déjeuner au restaurant — générer 18351acde0bf
- B. Une séance de cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Un cours de sport — réutiliser /lib/images/tcf/co/bg/gymnase.webp

## tcf-ss-a1-s20-co-3 — question 2

Dans la deuxième situation, que prépare la personne ?

- A. Un gâteau au chocolat — générer 40b742b7985d
- B. Une tarte aux pommes — générer 3cfdd714bc3a
- C. Une salade de fruits — réutiliser /lib/images/vocabulaire/desserts/salade-de-fruits.webp

## tcf-ss-a1-s20-co-3 — question 7

Dans la cinquième situation, quel objet vient d’être acheté ?

- A. Un CD — générer 4b22b570e1e4
- B. Un livre — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp
- C. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp

## tcf-ss-a1-s21-co-1 — question 4

Quel cours lui est conseillé pour se préparer ?

- A. Le cours d’expression orale — générer 8ff6c5b1c5aa
- B. Le cours de dessin — réutiliser /lib/images/tcf/co/bg/cours-dessin.webp
- C. Le cours de sport — réutiliser /lib/images/tcf/co/bg/gymnase.webp

## tcf-ss-a1-s21-co-4 — question 1

Quel type d’établissement recrute ?

- A. Un restaurant d’entreprise — générer 492a306fbe43
- B. Une boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. Une pharmacie — réutiliser /lib/images/tcf/co/bg/pharmacie.webp

## tcf-ss-a1-s22-co-1 — question 4

Quel autre mal le patient signale-t-il ?

- A. Un mal de tête — réutiliser /lib/images/vocabulaire/sante/mal-de-tête.webp
- B. Un mal de dents — générer 1b76adfe941c
- C. Un mal de dos — générer 7343c3fe2e6b

## tcf-ss-a1-s22-co-2 — question 3

Quels aliments sont proposés au bar ?

- A. Des salades et des sandwichs — générer 6b1251fe8a61
- B. Des pizzas et des pâtes — générer 9a1c5beb92ea
- C. Des soupes et des grillades — générer 727d865b5316

## tcf-ss-a1-s22-co-4 — question 1

Pour quel repas les plats sont-ils préparés ?

- A. Le repas du soir — générer c671ddd88bf9
- B. Le petit déjeuner — réutiliser /lib/images/tcf/co/bg/petit-dejeuner-maison.webp
- C. Le déjeuner du lendemain — générer 690a1740f335

## tcf-ss-a1-s22-co-4 — question 4

Quels légumes la personne voulait-elle ajouter ?

- A. Des carottes et des pommes de terre — générer 2bf99a89efec
- B. Des tomates et des courgettes — générer 14e20d86f7e0
- C. Des haricots et des petits pois — générer 6dc9358b953f

## tcf-ss-a1-s23-co-1 — question 2

Pour quelle sortie les places sont-elles proposées ?

- A. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- B. Une pièce de théâtre — générer d8953c7ddfe7
- C. Une séance de cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp

## tcf-ss-a1-s23-co-2 — question 3

Quels aliments faut-il manger en entrée ?

- A. Des légumes — générer 159b7a5e2950
- B. Des gâteaux — réutiliser /lib/images/vocabulaire/desserts/gâteau.webp
- C. Des fromages — réutiliser /lib/images/vocabulaire/aliments/fromage.webp

## tcf-ss-a1-s23-co-2 — question 5

Quels fruits sont de saison selon le message ?

- A. Les pommes et les poires — générer baea646241f5
- B. Les fraises et les framboises — générer 60817b5cd6f1
- C. Les pêches et les abricots — générer 97a7b968987c

## tcf-ss-a1-s23-co-4 — question 6

Sous quelle forme le repas est-il prévu ?

- A. Un buffet — générer 357780fc82ca
- B. Un menu servi à table — générer 39fd3f83b8ab
- C. Un repas à emporter — générer 934ec532c787

## tcf-ss-a1-s24-co-1 — question 5

Quel type de repas est évoqué ?

- A. Un buffet — générer 357780fc82ca
- B. Un repas au restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp
- C. Un pique-nique — réutiliser /lib/images/tcf/co/bg/pique-nique.webp

## tcf-ss-a1-s24-co-3 — question 2

De quels objets Tim a-t-il besoin ?

- A. Des serviettes et des assiettes — générer 2ee757631bd3
- B. Des casseroles et des poêles — générer 1a4d4ecfbf27
- C. Des nappes et des bougies — générer b92d969b9926

## tcf-ss-a1-s24-co-4 — question 4

Quels salons sont annoncés dans la visite ?

- A. Le salon rouge et le petit salon — générer 9653315b84a2
- B. Le salon bleu et le grand salon — générer 09ee72acab76
- C. Le salon vert et le salon de musique — générer 044fcfc40aa9

## tcf-ss-a1-s26-co-3 — question 8

Que fera-t-elle avant de rentrer cuisiner ?

- A. Les courses — réutiliser /lib/images/vocabulaire/sports/course.webp
- B. Une séance de sport — générer c9f1da59328c
- C. Une visite au musée — générer 5f39fc017989

## tcf-ss-a1-s29-co-1 — question 3

Quelle salade est commandée ?

- A. Une salade chinoise — générer 1455d45b191a
- B. Une salade grecque — générer a98310ed8c28
- C. Une salade italienne — générer cd542aa9dea1

## tcf-ss-a1-s29-co-2 — question 3

Quelle entrée ce menu comprend-il ?

- A. Une salade italienne — générer cd542aa9dea1
- B. Une soupe de légumes — générer 7c19995b2621
- C. Une assiette de fromage — générer 592953f35482

## tcf-ss-a1-s29-co-2 — question 4

Comment les pâtes sont-elles préparées ?

- A. Aux légumes — générer 8546c8a5cc6c
- B. Au poulet — réutiliser /lib/images/vocabulaire/aliments/poulet.webp
- C. Au fromage — réutiliser /lib/images/vocabulaire/aliments/fromage.webp

## tcf-ss-a1-s29-co-3 — question 5

Avec quoi cet aliment est-il servi ?

- A. Des petits légumes — générer d51a21923f62
- B. Des frites — réutiliser /lib/images/vocabulaire/aliments/frites.webp
- C. Des pâtes — réutiliser /lib/images/vocabulaire/aliments/pâtes.webp

## tcf-ss-a1-s29-co-4 — question 4

Quels éléments du repas les clients refusent-ils ?

- A. Le dessert et le fromage — générer 5d4821a08500
- B. L’entrée et le plat — générer 4da20961efb9
- C. Le pain et la salade — générer 44358c7f0053

## tcf-ss-a1-s29-co-4 — question 7

Quel jus de légumes est commandé ?

- A. Un jus de tomate — générer 10e5012f144c
- B. Un jus de carotte — générer 1b0fedc6be4c
- C. Un jus de betterave — générer 438bdc0cd2ba

## tcf-ss-a1-s30-co-1 — question 4

Quel type de crêpes est proposé ?

- A. Des crêpes bretonnes — générer 0a96a63f00ed
- B. Des crêpes japonaises — générer 6c1dc765a398
- C. Des crêpes américaines — générer ce3936889480

## tcf-ss-a1-s30-co-4 — question 5

Avec quoi faut-il prendre le comprimé selon le dialogue ?

- A. Un verre d’eau — réutiliser /lib/images/vocabulaire/boissons/eau.webp
- B. Une tasse de café — générer a61bbbcb4616
- C. Un verre de jus de fruits — générer fcdeb285f2ed

## tcf-ss-a1-s31-co-2 — question 2

Quels symptômes le produit vise-t-il selon la publicité ?

- A. La toux et le mal de gorge — générer 13d89974de16
- B. Le mal de dos et les brûlures — générer b71b3f3f229e
- C. Les douleurs dentaires et les otites — générer 2b354a77b8d1

## tcf-ss-a1-s31-co-2 — question 5

Où le produit est-il disponible ?

- A. Dans les pharmacies — générer 2863e3614ca6
- B. Dans les boulangeries — générer ac541b7d7a02
- C. Dans les librairies — générer 9782b9945f3c

## tcf-ss-a1-s33-co-3 — question 4

Quel type de chambre est disponible à la place ?

- A. Des chambres simples — générer cbc76cf097b1
- B. Des chambres familiales — générer 803b9d86fa1d
- C. Des suites — générer 5db01ef5e45b

## tcf-ss-a1-s33-co-4 — question 2

Quels paysages sont associés aux Alpes ?

- A. Les montagnes et les forêts — générer 42808611aacc
- B. La mer et les plages — générer 877414e8dcbe
- C. Les déserts et les dunes — générer 4c7e73dc4eba

## tcf-ss-a1-s33-co-4 — question 3

Quels paysages sont associés à la Normandie ?

- A. La campagne et les rivières — générer b6b623732ec0
- B. Les glaciers et les sommets — générer 8d46b4f60f9f
- C. Les déserts et les dunes — générer 4c7e73dc4eba

## tcf-ss-a1-s33-co-4 — question 4

Quels paysages sont associés à la Provence ?

- A. La mer et les plages — générer 877414e8dcbe
- B. Les glaciers et les sommets — générer 8d46b4f60f9f
- C. Les déserts et les dunes — générer 4c7e73dc4eba

## tcf-ss-a1-s34-co-1 — question 2

Où le petit déjeuner est-il proposé ?

- A. Au restaurant du camping — générer 6b5efb59345d
- B. À la piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp
- C. Dans les tentes — réutiliser /lib/images/vocabulaire/loisirs/tente.webp

## tcf-ss-a1-s34-co-1 — question 3

Quelle forme de repas est proposée le soir ?

- A. Un buffet — générer 357780fc82ca
- B. Un pique-nique — réutiliser /lib/images/tcf/co/bg/pique-nique.webp
- C. Un menu à emporter — générer b8455741cbcc

## tcf-ss-a1-s34-co-3 — question 7

Quel temps est prévu pour demain ?

- A. De la pluie et du froid — générer 1168630d88a0
- B. Du soleil et de la chaleur — générer 962cfd460737
- C. De la neige et du vent — générer 824ee7aa1e22

## tcf-ss-a1-s34-co-4 — question 4

Quel temps fait-il à Strasbourg ?

- A. De la pluie et du vent — générer 5797cab4ce8d
- B. Du soleil et de la chaleur — générer 962cfd460737
- C. De la neige et du brouillard — générer 2fb3a663b6aa

## tcf-ss-a1-s35-co-4 — question 1

Quelle activité commence à 10 h ?

- A. Une sortie en canoé-kayak — générer 582f807f7876
- B. Un cours de voile — générer 624b88e40310
- C. Un cours d’escalade — générer efcd4dd846bf

## tcf-ss-a1-s35-co-4 — question 6

Quel type de cours leur est alors proposé ?

- A. Un cours pour débutants — générer a0b56de6696b
- B. Un cours pour professionnels — générer ecfb6029a38c
- C. Un cours réservé aux enfants — générer c0204049b589

## tcf-ss-a1-s38-co-3 — question 3

Quels maux signale-t-il ?

- A. Un mal de gorge et un mal de tête — générer 5ddb245588e2
- B. Un mal de dos et un mal de dents — générer 6e25671d8bf2
- C. Un mal de ventre et un mal au bras — générer ab3130bc05cd

## tcf-ss-a1-s39-co-3 — question 2

Quelle heure annonce-t-on au début ?

- A. 11 h 17 — générer 0c8bf5e768b8
- B. 11 h 07 — générer 0da0a3643f1b
- C. 10 h 17 — générer 784c2a82bf0c

## tcf-ss-a1-s40-co-3 — question 1

Pour quel document l’homme fait-il une démarche ?

- A. Un passeport — réutiliser /lib/images/vocabulaire/voyage/passeport.webp
- B. Une carte de visite — générer ba873cc2de37
- C. Une carte de bibliothèque — générer 807259130554

## tcf-ss-a1-s41-co-1 — question 1

Quel logement la personne cherche-t-elle ?

- A. Un appartement calme — générer e2c8b724dd64
- B. Une maison isolée — générer 71d0c8ba6c08
- C. Un studio meublé — générer 77a7797629c4

## tcf-ss-a1-s41-co-1 — question 8

Quel espace extérieur lui plaît ?

- A. Un jardin — réutiliser /lib/images/tcf/co/bg/jardin.webp
- B. Une terrasse sur le toit — générer cb2566b20dae
- C. Une cour partagée — générer 7015d2580533

## tcf-ss-a1-s42-co-3 — question 2

Où devrait-on ranger les vélos ?

- A. Dans le local à vélos — générer e56f09db2b0c
- B. Dans les escaliers — réutiliser /lib/images/vocabulaire/maison/escalier.webp
- C. Dans les couloirs — réutiliser /lib/images/vocabulaire/maison/couloir.webp

## tcf-ss-a1-s42-co-3 — question 3

Que trouve-t-on dans les escaliers ?

- A. Des bouteilles — réutiliser /lib/images/vocabulaire/objets/bouteille.webp
- B. Des chaussures — réutiliser /lib/images/vocabulaire/vetements/chaussures.webp
- C. Des journaux — générer c3fbdd8fc4e4

## tcf-ss-a1-s42-co-3 — question 5

Où peut-on jeter les bouteilles en verre ?

- A. Dans une poubelle pour le verre — générer 7d324ea9c39d
- B. Dans le local à vélos — générer e56f09db2b0c
- C. Dans le garage — réutiliser /lib/images/vocabulaire/maison/garage.webp

## tcf-ss-a1-s43-co-3 — question 2

Quel pain demande-t-il ?

- A. Une baguette — réutiliser /lib/images/vocabulaire/aliments/baguette.webp
- B. Un pain complet — générer f75027e5b940
- C. Un pain aux noix — générer f106af5bef6a

## tcf-ss-a1-s43-co-4 — question 6

Quel dessert choisit-elle ?

- A. Une tarte aux pommes — générer 3cfdd714bc3a
- B. Un éclair — réutiliser /lib/images/vocabulaire/meteo/eclair.webp
- C. Une tarte au citron — générer b7c1b054229e

## tcf-ss-a1-s44-co-2 — question 3

Quel produit lui donne-t-on ?

- A. Une crème — réutiliser /lib/images/vocabulaire/aliments/creme.webp
- B. Un sirop — réutiliser /lib/images/vocabulaire/boissons/sirop.webp
- C. Des gouttes — générer 5c44ce00b1ef

## tcf-ss-a1-s45-co-1 — question 3

Quels transports peut-il prendre ?

- A. Le métro ou le bus — générer 906b288bc8bc
- B. Le train ou le tramway — générer 92a41ae9f798
- C. Le taxi ou le bateau — générer c146386a7607

## tcf-ss-a1-s45-co-2 — question 5

À quelle heure part le TGV demandé ?

- A. À 8 heures — réutiliser /lib/images/vocabulaire/heure-horloge/huit-heures.webp
- B. À 8 h 06 — générer 8a34edd9dc81
- C. À 9 heures — réutiliser /lib/images/vocabulaire/heure-horloge/neuf-heures.webp

## tcf-ss-a1-s45-co-2 — question 8

À quelle heure part le TER proposé ?

- A. À 8 h 06 — générer 8a34edd9dc81
- B. À 8 heures — réutiliser /lib/images/vocabulaire/heure-horloge/huit-heures.webp
- C. À 9 h 06 — générer e802c3136a5f

## tcf-ss-a1-s46-co-3 — question 1

Quel événement a lieu aujourd'hui ?

- A. La fête du sport — générer 0bd6b7d5f018
- B. La fête de la musique — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. La fête du cinéma — générer ffe7b67dbbd3

## tcf-ss-a1-s47-co-1 — question 8

Où veut-elle acheter à manger ?

- A. À la machine — générer fab1493302a8
- B. À la boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. Au restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp

## tcf-ss-a1-s47-co-2 — question 1

Quelle professeure est évoquée ?

- A. La professeure de français — générer 25c79ccef5bd
- B. La professeure de musique — générer 6676a97d2a46
- C. La professeure de sport — générer 5e317a024fab

## tcf-ss-a1-s47-co-3 — question 2

Quel légume faut-il couper ?

- A. Des tomates — réutiliser /lib/images/vocabulaire/legumes/tomate.webp
- B. Des carottes — réutiliser /lib/images/vocabulaire/legumes/carotte.webp
- C. Des pommes de terre — générer 3762b0724d76

## tcf-ss-a1-s47-co-3 — question 4

Quel objet cherche-t-on ?

- A. Un parapluie — réutiliser /lib/images/vocabulaire/accessoires/parapluie.webp
- B. Un manteau — réutiliser /lib/images/vocabulaire/vetements/manteau.webp
- C. Un sac — générer b48c69f2021e

## tcf-ss-a1-s47-co-3 — question 8

Quel objet doit-elle apporter ?

- A. Un livre de français — générer 929c96995c9e
- B. Un cahier de musique — générer 38b59869c170
- C. Un dictionnaire anglais — générer 2371e4768d36

## tcf-ss-a1-s48-co-1 — question 5

Quelle activité propose-t-il après ?

- A. Manger une glace — générer 60fb6a9a7751
- B. Jouer au football — générer f3686ebe2d92
- C. Aller à un concert — réutiliser /lib/images/tcf/co/bg/concert.webp

## tcf-ss-a1-s48-co-3 — question 4

À quel jeu vidéo pourront-ils jouer ?

- A. Un jeu de football — générer 12be397fdce1
- B. Un jeu de course automobile — générer ac6cd971bad1
- C. Un jeu de tennis — générer 83c8f978740e

## tcf-ss-a1-s50-co-4 — question 3

Quelle boisson est demandée en premier ?

- A. Une carafe d'eau — générer 057e3d24eca8
- B. Un café — réutiliser /lib/images/vocabulaire/boissons/café.webp
- C. Un jus de pomme — générer 70ee2d433ec3

## tcf-ss-a1-s52-co-2 — question 1

Quelle douleur au ventre est mentionnée ?

- A. Un mal de ventre — réutiliser /lib/images/vocabulaire/sante/mal-de-ventre.webp
- B. Une brûlure au ventre — générer c93c0e9a2da2
- C. Une blessure au ventre — générer 6d69c690f6af

## tcf-ss-a1-s52-co-2 — question 3

Quelle autre douleur est citée ?

- A. Un mal de tête — réutiliser /lib/images/vocabulaire/sante/mal-de-tête.webp
- B. Un mal de dos — générer 7343c3fe2e6b
- C. Un mal de pied — générer 0b0c334fd52d

## tcf-ss-a1-s53-co-1 — question 3

À quelle heure devait-il partir ?

- A. 14 h 27 — générer 847290677be0
- B. 16 h 18 — générer 0891ffabd506
- C. 14 h 18 — générer c3c9dfd4f2ed

## tcf-ss-a1-s53-co-1 — question 4

À quelle heure part le train suivant ?

- A. 16 h 18 — générer 0891ffabd506
- B. 14 h 27 — générer 847290677be0
- C. 16 h 27 — générer de240bf51293

## tcf-ss-a1-s53-co-1 — question 5

Où peut-on demander le remboursement du billet ?

- A. À l'accueil de la gare — générer bf4c56396441
- B. Dans le train suivant — générer 109b7d68c492
- C. À l'office du tourisme — réutiliser /lib/images/tcf/co/bg/bureau-information.webp

## tcf-ss-a1-s53-co-2 — question 4

À quelle heure part-il ?

- A. 8 h 17 — générer c0b1510106d7
- B. 8 h 07 — générer fa93dd8416d6
- C. 8 h 47 — générer 222ab72a131b

## tcf-ss-a1-s53-co-3 — question 4

À quelle heure arrive-t-il à Paris ?

- A. 12 h 03 — générer e04fa7acc651
- B. 11 h 22 — générer 70e07d2a9d3d
- C. 12 h 30 — réutiliser /lib/images/vocabulaire/heure-horloge/midi-trente.webp

## tcf-ss-a1-s54-co-3 — question 1

Quel cabinet rappelle le rendez-vous ?

- A. Le cabinet dentaire — réutiliser /lib/images/tcf/co/bg/cabinet-dentaire.webp
- B. Le cabinet vétérinaire — générer d0067cf05f8c
- C. Le cabinet de pédiatrie — générer 6744331d043a

## tcf-ss-a1-s55-co-2 — question 3

Qu'est-ce qui manque en covoiturage selon elle ?

- A. Une voiture-bar — générer 37c9ed249537
- B. Une fenêtre — réutiliser /lib/images/vocabulaire/maison/fenêtre.webp
- C. Une radio — réutiliser /lib/images/vocabulaire/technologie/radio.webp

## tcf-ss-a1-s55-co-2 — question 5

Quel problème de ponctualité cite Antoine ?

- A. Des retards fréquents — générer d86fecd89e65
- B. Des départs trop tôt — générer caa90039284d
- C. Des arrêts trop courts — générer 2f233a5f6f35

## tcf-ss-a1-s55-co-3 — question 4

À quelle heure l'arrivée est-elle prévue ?

- A. 11 h 02 — générer 57d97737a7d7
- B. 11 h 20 — réutiliser /lib/images/vocabulaire/heure-horloge/onze-heures-vingt.webp
- C. 12 h 02 — générer 3979ef1b402e

## tcf-ss-a1-s55-co-4 — question 7

Quel bagage doit-il enregistrer ?

- A. Une grande valise — générer 7e007dd5fd6e
- B. Un petit sac — générer 92a4c6089f51
- C. Une poussette — réutiliser /lib/images/vocabulaire/transports/poussette.webp

## tcf-ss-a1-s57-co-1 — question 1

Quel pain allongé est commandé ?

- A. Une baguette — réutiliser /lib/images/vocabulaire/aliments/baguette.webp
- B. Une brioche — réutiliser /lib/images/vocabulaire/aliments/brioche.webp
- C. Un pain de mie — générer 8860ce592cec

## tcf-ss-a1-s57-co-1 — question 2

Quelle viennoiserie est mentionnée ?

- A. Des croissants — réutiliser /lib/images/vocabulaire/aliments/croissant.webp
- B. Des chaussons aux pommes — générer 27a24cd778fe
- C. Des pains aux raisins — générer e1a9c223db85

## tcf-ss-a1-s57-co-1 — question 3

Quel dessert est demandé pour quatre puis pour six ?

- A. Une tarte — réutiliser /lib/images/vocabulaire/desserts/tarte.webp
- B. Un gâteau au chocolat — générer 40b742b7985d
- C. Une glace — réutiliser /lib/images/vocabulaire/desserts/glace.webp

## tcf-ss-a1-s57-co-2 — question 5

Quelle viennoiserie ne faut-il pas acheter ?

- A. Du pain aux raisins — générer bdf8a10399fd
- B. Du pain au chocolat — réutiliser /lib/images/vocabulaire/aliments/pain-au-chocolat.webp
- C. Des croissants — réutiliser /lib/images/vocabulaire/aliments/croissant.webp

## tcf-ss-a1-s57-co-3 — question 3

Quel problème a son fils ?

- A. Une dent cassée — générer 6f98daf590b8
- B. Un bras cassé — générer ff8b74195f20
- C. Une brûlure à la main — générer 3b188af3d0c8

## tcf-ss-a1-s57-co-3 — question 4

Quel cabinet doit-elle appeler ?

- A. Le cabinet dentaire — réutiliser /lib/images/tcf/co/bg/cabinet-dentaire.webp
- B. Le cabinet vétérinaire — générer d0067cf05f8c
- C. Le cabinet de pédiatrie — générer 6744331d043a

## tcf-ss-a1-s58-co-1 — question 6

Que commande la cliente dans la troisième situation ?

- A. Un café et un croissant — générer b3ee57b33653
- B. Un thé et une tartine — générer 58399f9d05e5
- C. Un jus et une brioche — générer 444ebf5b888c

## tcf-ssx-a1-objet-18-co-1 — question 2

Quels outils pour couper et coller sont demandés ?

- A. Des ciseaux et de la colle — générer 29e5cb0a4a24
- B. Un couteau et du ruban — générer fe7817ff539b
- C. Une scie et des clous — générer 90395a30569f

## tcf-ssx-a1-objet-18-co-1 — question 3

Quel cahier faut-il apporter ?

- A. Un grand cahier — générer 517448ba4e4c
- B. Un petit cahier — générer a6b01d45fafb
- C. Un cahier de musique — générer 38b59869c170

## tcf-sc-17-metro-c-est-loin-co-4 — question 1

Quel lieu la personne cherche-t-elle ?

- A. La station de métro — générer 0844675a2519
- B. La gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. L'arrêt de bus — générer 031cfb932212

## tcf-sc-18-aller-a-la-poste-co-4 — question 2

Quels transports peut-elle prendre ?

- A. Le bus ou le tram — générer afc3fdd1fbf2
- B. Le train ou le métro — générer c936c0eda6a3
- C. Le bateau ou le taxi — générer 299a466e71d0

## tcf-sc-20-activites-proposees-co-4 — question 2

Quelles activités sont proposées ?

- A. Le canoë-kayak ou l'escalade — générer 55ff7a6749ac
- B. La natation ou le tennis — générer c79b7406149c
- C. Le ski ou le patinage — générer 1f0f5eabbf0b

## tcf-sc-21-cours-de-surf-co-4 — question 2

Quel sport voudrait-elle apprendre ?

- A. Le surf — générer 6d404d15dcb9
- B. Le ski — réutiliser /lib/images/vocabulaire/sports/ski.webp
- C. L'escalade — réutiliser /lib/images/vocabulaire/sports/escalade.webp

## tcf-sc-24-meteo-escalade-co-4 — question 2

Quel temps est annoncé pour demain ?

- A. De la pluie et du vent — générer 5797cab4ce8d
- B. Du soleil et de la chaleur — générer 962cfd460737
- C. Du brouillard et de la neige — générer d0abfbd26cbf

## tcf-sc-28-places-de-concert-co-4 — question 1

Pour quel spectacle cherche-t-on des places ?

- A. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- B. Une pièce de théâtre — générer d8953c7ddfe7
- C. Un film — réutiliser /lib/images/tcf/co/bg/cinema.webp

## tcf-ssx-a1-ecole-cahier-d-anglais-co-4 — question 1

Quel objet l'élève rend-il ?

- A. Un cahier d'anglais — générer d8ad88f215bf
- B. Un livre de français — générer 929c96995c9e
- C. Un dictionnaire italien — générer 35c2c45dea1f

## tcf-ssx-a1-ecole-dictionnaires-de-francais-co-4 — question 1

Quel type de dictionnaires la personne cherche-t-elle ?

- A. Des dictionnaires de français — générer 4f3ca518b702
- B. Des dictionnaires d'anglais — générer f9d316f90f98
- C. Des dictionnaires d'italien — générer b22fc6d3b83c

## tcf-ssx-a1-ecole-dictionnaires-de-francais-co-4 — question 2

À côté de quels livres se trouvent-ils ?

- A. Les livres de sciences — générer 6308cf3644c5
- B. Les livres de musique — générer 1e7965200fcf
- C. Les livres de cuisine — générer 9b511cf764ee

## tcf-ssx-a1-ecole-stylo-vert-co-4 — question 1

Quel objet est prêté ?

- A. Un stylo — générer 8e4309172597
- B. Un crayon — réutiliser /lib/images/vocabulaire/ecole-bureau/crayon.webp
- C. Un feutre — réutiliser /lib/images/vocabulaire/ecole-bureau/feutre.webp

## tcf-ssx-a1-ecole-viande-au-restaurant-u-co-4 — question 2

Dans quel restaurant cet aliment est-il servi ?

- A. Le restaurant de l'université — générer ab7eea2adade
- B. Le restaurant de l'hôtel — générer a6a917953b36
- C. Le restaurant de la gare — générer 916d6573cd97

## tcf-ssx-a1-ecole-viande-au-restaurant-u-co-4 — question 3

Quel aliment la personne dit-elle ne pas manger ?

- A. La viande — réutiliser /lib/images/vocabulaire/aliments/viande.webp
- B. Les légumes — générer 90de79c523db
- C. Le fromage — réutiliser /lib/images/vocabulaire/aliments/fromage.webp

## delf-a1-2022-co-ex1-03 — question 2

Dans quel musée y a-t-il une nouvelle exposition ?

- A. Le musée des sciences — générer 61e66f12efb4
- B. Le musée de la mer — générer 4a13d54969ca
- C. Le musée d'histoire — réutiliser /lib/images/tcf/co/bg/musee-histoire.webp

## delf-a1-2022-co-ex1-05 — question 7

Pour quel repas faut-il les tomates ?

- A. Le repas de ce soir — générer 35a009818c1d
- B. Le repas de demain midi — générer 0742f5ef60fa
- C. Le petit déjeuner — réutiliser /lib/images/tcf/co/bg/petit-dejeuner-maison.webp

## delf-a1-2022-co-ex1-06 — question 2

Quel légume achète-t-il ?

- A. Des pommes de terre — générer 3762b0724d76
- B. Des carottes — réutiliser /lib/images/vocabulaire/legumes/carotte.webp
- C. Des tomates — réutiliser /lib/images/vocabulaire/legumes/tomate.webp

## delf-a1-2022-co-ex1-11 — question 3

Où Jacques travaille-t-il ?

- A. Dans un magasin de motos — générer 85532f3cbfde
- B. Dans un magasin de vélos — générer c80bf77287ca
- C. Dans un restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp

## delf-a1-2022-co-ex1-11 — question 4

Quelle activité propose-t-il au parc ?

- A. Faire du vélo — générer bbbd36cf47df
- B. Jouer au football — générer f3686ebe2d92
- C. Courir — réutiliser /lib/images/vocabulaire/actions/courir.webp

## delf-a1-2022-co-ex1-12 — question 4

Où peut-on voir de petits animaux ?

- A. Dans les forêts de la région — générer 8c66d60f5446
- B. Dans un musée — réutiliser /lib/images/tcf/co/bg/musee.webp
- C. Dans un supermarché — réutiliser /lib/images/tcf/co/bg/supermarche.webp

## delf-a1-2022-co-ex1-12 — question 5

Où faut-il chercher les petits animaux ?

- A. Dans les arbres — réutiliser /lib/images/vocabulaire/plantes/arbre.webp
- B. Dans les gares — générer 7458b7170365
- C. Dans les magasins — générer e216360ad2b4

## delf-a1-2022-co-ex1-12 — question 9

Que peut-on admirer pendant la visite ?

- A. Les grands immeubles et les boulevards — générer 45003505c590
- B. Les champs et les vaches — générer 70e88782c480
- C. Les plages et les falaises — générer 6a540e77d09f

## delf-a1-2022-co-ex2-14 — question 10

Quel temps est annoncé dans le sud ?

- A. Des orages importants — générer f8469d602006
- B. Un ciel dégagé — générer d55423a4a616
- C. De la neige — réutiliser /lib/images/vocabulaire/meteo/neige.webp

## delf-a1-2022-co-ex2-17 — question 10

Quels fruits sont annoncés au marché ?

- A. Des pommes et des bananes — générer 98ece4b786ea
- B. Des poires et des fraises — générer 66185fc6b8a7
- C. Des oranges et des pêches — générer f865b17f1741

## delf-a1-2022-co-ex2-18 — question 12

Quel équipement reste disponible ?

- A. La boîte aux lettres — réutiliser /lib/images/vocabulaire/argent-administration/boîte-aux-lettres.webp
- B. Le guichet des colis — générer 3449ba41a33c
- C. Le distributeur de timbres — générer b429e2682d5a

## delf-a1-2022-co-ex2-20 — question 5

Que peut-on y acheter ?

- A. Des boissons et des biscuits — générer 80d8f3a8b422
- B. Des livres et des journaux — générer b2b236c246e2
- C. Des vêtements et des chaussures — générer 2086536a8acb

## delf-a1-2022-co-ex2-22 — question 3

Chez quel professionnel va-t-elle aller ?

- A. Le médecin — réutiliser /lib/images/vocabulaire/metiers/médecin.webp
- B. Le dentiste — réutiliser /lib/images/vocabulaire/metiers/dentiste.webp
- C. Le coiffeur — générer 1770e2891746

## delf-a1-2022-co-ex2-22 — question 6

À quelle sortie la personne veut-elle être accompagnée ?

- A. Une fête — générer c1894208bd4c
- B. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. Une exposition — réutiliser /lib/images/vocabulaire/loisirs/exposition.webp

## delf-a1-2022-co-ex2-23 — question 1

Quels produits sont en promotion ?

- A. Les poissons — réutiliser /lib/images/vocabulaire/aliments/poisson.webp
- B. Les légumes — générer 90de79c523db
- C. Les boissons — réutiliser /lib/images/vocabulaire/boissons/boisson.webp

## delf-a1-2022-co-ex2-23 — question 7

Où les clients doivent-ils se rendre ?

- A. À l'entrée du magasin — générer bbb3e9f7aadb
- B. Au parking — générer b539ebfaf403
- C. Au rayon jouets — générer c4a1f4f70317

## delf-a1-2022-co-ex2-24 — question 6

Quels produits seront ensuite en réduction ?

- A. Les légumes — générer 90de79c523db
- B. Les poissons — réutiliser /lib/images/vocabulaire/aliments/poisson.webp
- C. Les jouets — réutiliser /lib/images/vocabulaire/loisirs/jouet.webp

## delf-a1-2022-co-ex2-25 — question 8

À quelle heure partira le train ?

- A. 9 h 03 — générer 4af2ac685690
- B. 9 h 30 — réutiliser /lib/images/vocabulaire/heure-horloge/neuf-heures-trente.webp
- C. 10 h 03 — générer 50d1b470de6a

## delf-a1-2022-co-ex3-31 — question 3

À quelle heure est le rendez-vous ?

- A. 15 h 40 — réutiliser /lib/images/vocabulaire/heure-horloge/quinze-heures-quarante.webp
- B. 15 h 14 — générer 6cd8edff719f
- C. 16 h 40 — réutiliser /lib/images/vocabulaire/heure-horloge/seize-heures-quarante.webp

## delf-a1-2022-co-ex3-36 — question 9

Que faut-il apporter pour la réunion ?

- A. Des feuilles et des stylos — générer 65a61409d4ab
- B. Des livres et des cahiers — générer 99569a332795
- C. Des crayons et des gommes — générer 97d2ae49817d

## delf-a1-2022-co-ex4-41 — question 8

De quelle couleur son manteau est-il ?

- A. Rose — générer 618d663af0f1
- B. Bleu — réutiliser /lib/images/vocabulaire/couleurs/azur.webp
- C. Vert — réutiliser /lib/images/vocabulaire/couleurs/vert.webp

## delf-a1-2022-co-ex4-45 — question 5

Quel professeur a donné des explications ?

- A. La professeure de dessin — générer 65674e449937
- B. La professeure d'anglais — générer 4da4e8a1d18f
- C. La professeure d'histoire — générer b975aa5bbb3b

## delf-a1-2022-co-ex4-47 — question 5

Pourquoi faut-il se dépêcher ?

- A. Le cours commence maintenant — générer ebb65953b89c
- B. Le cours est annulé — générer 3eaa4d879a90
- C. Le cours est terminé — générer cde13aecb6d6

## delf-a1-2022-co-ex4-48 — question 5

Quels documents la personne cherche-t-elle ?

- A. Des livres et des journaux — générer b2b236c246e2
- B. Des films et des disques — générer 6fc0ab281183
- C. Des cartes et des affiches — générer 6cbee869ed1e

## delf-a1-2022-co-ex1-60 — question 5

Qu'apporte Jeannette ?

- A. Les boissons et les ballons — générer b4d16c17229b
- B. Le gâteau et les fleurs — générer a308625ff421
- C. Le pain et le fromage — générer c08b1656dcd7

## delf-a1-2022-co-ex1-61 — question 6

Quel repas Fabiola va-t-elle préparer ?

- A. Une salade avec du poulet — générer 8ab3f2c0bd8c
- B. Des pâtes à la tomate — générer abf45c70332d
- C. Du poisson avec du riz — générer dd40fb30cc87

## delf-a1-2022-co-ex2-62 — question 3

Quels produits sont en promotion ?

- A. Les disques — générer 814086461d71
- B. Les livres — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp
- C. Les vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp

## delf-a1-2022-co-ex2-63 — question 1

Quel événement est annoncé ?

- A. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- B. Une exposition — réutiliser /lib/images/vocabulaire/loisirs/exposition.webp
- C. Un spectacle de théâtre — générer ecb4ece23e23

## delf-a1-2022-co-ex2-64 — question 3

À quelle heure le train partira-t-il ?

- A. 10 h 24 — générer 12571291e5ff
- B. 10 h 42 — générer 2dc00ee8fe5e
- C. 11 h 24 — générer 8e38c8d17ecd

## delf-a1-2022-co-ex2-64 — question 4

De quelle voie partira-t-il ?

- A. La voie E — générer eb71e1eb484d
- B. La voie B — générer a943fdea8cf2
- C. La voie D — générer aeea7da7bfac

## delf-a1-2022-co-ex4-68 — question 8

Que peut-on y prendre en plus des livres ?

- A. Des films — générer 57c361aa9816
- B. Des vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp
- C. Des instruments — réutiliser /lib/images/vocabulaire/musique/instruments.webp

## delf-a1-2022-co-ex4-69 — question 3

Quel accompagnement y a-t-il souvent à la cantine ?

- A. Du riz — réutiliser /lib/images/vocabulaire/aliments/riz.webp
- B. Des pâtes — réutiliser /lib/images/vocabulaire/aliments/pâtes.webp
- C. Des pommes de terre — générer 3762b0724d76

## delf-a1-2022-co-76 — question 8

Quels sports le candidat pratique-t-il ?

- A. Le basketball et le karaté — générer b1787d0bd6bd
- B. Le football et le tennis — générer 93efdaf23b3c
- C. La natation et le judo — générer a1f62a66bfc2

## delf-a1-2022-co-77 — question 9

Quelle préférence demande la neuvième question ?

- A. Le film préféré — générer cbc019bf4773
- B. Le livre préféré — générer 84d7e426878f
- C. Le sport préféré — générer 1d288bf652f7

## delf-a1-2022-co-80 — question 1

Quelles couleurs préférées sont annoncées au début ?

- A. Le bleu et le vert — générer 4efd9ebcfdf9
- B. Le rouge et le jaune — générer 0fd60ad647bb
- C. Le noir et le blanc — générer 994890d8e15a

## delf-a1-2022-co-84 — question 4

Quel vêtement la personne cherche-t-elle ?

- A. Des pulls — générer 88e315aa872e
- B. Des pantalons — réutiliser /lib/images/vocabulaire/vetements/pantalon.webp
- C. Des chemises — réutiliser /lib/images/vocabulaire/vetements/chemise.webp

## delf-a1-2022-co-84 — question 6

Quel moyen de paiement la personne évoque-t-elle ?

- A. Les espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp
- B. La carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- C. Le chèque — générer 3fdab7ee8aab

## delf-a1-2022-co-85 — question 6

Quelle boisson est achetée ?

- A. Du jus d'orange — réutiliser /lib/images/vocabulaire/boissons/jus-d-orange.webp
- B. Du jus de pomme — générer 266a07fc7265
- C. Du lait — réutiliser /lib/images/vocabulaire/boissons/lait.webp

## delf-a1-2022-co-85 — question 14

À quelle heure a lieu le départ suivant ?

- A. 11 h 58 — générer de1d833648a2
- B. 11 h 48 — générer b64d064673f2
- C. 12 h 58 — générer 18580c1239a8

## delf-a1-2022-co-86 — question 1

Quel produit la personne souhaite-t-elle acheter ?

- A. Une boîte de chocolats — réutiliser /lib/images/vocabulaire/desserts/boite-de-chocolats.webp
- B. Un bouquet de fleurs — générer 928e1a97b862
- C. Une bouteille de vin — générer a7e10b55e91a

## delf-a1-2022-co-86 — question 2

Pour quelle occasion l'achète-t-elle ?

- A. Un anniversaire — réutiliser /lib/images/tcf/co/bg/fete-anniversaire.webp
- B. Un mariage — réutiliser /lib/images/tcf/co/bg/mariage.webp
- C. Un départ en retraite — générer 9376dbc6cc4e

## delf-a1-2022-co-86 — question 10

Quel type d'offre de restaurant est évoqué ?

- A. Un menu — réutiliser /lib/images/vocabulaire/aliments/menu.webp
- B. Un plat seul — générer b51b19eb5239
- C. Un dessert seul — générer 3a84de4cc3d9

## delf-a1-2022-co-86 — question 11

Quel type de chose la personne recherche-t-elle ?

- A. Un animal — réutiliser /lib/images/vocabulaire/animaux-ferme-compagnie/animal.webp
- B. Un vêtement — générer 9b21b982b6f5
- C. Un meuble — générer b27fc3163ea0

## delf-a1-2022-co-89 — question 1

Dans quel rayon les clients doivent-ils aller ?

- A. Le rayon librairie — générer e9013d72b032
- B. Le rayon vêtements — générer 40dee4eb73ea
- C. Le rayon jouets — générer a9199c1eaa05

## delf-a1-2022-co-89 — question 5

Où faut-il demander un bon ?

- A. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- B. À l'entrée — réutiliser /lib/images/tcf/co/bg/entree-maison.webp
- C. Au parking — générer b539ebfaf403

## delf-a1-2022-co-92 — question 1

Que demande la personne ?

- A. De l'aide pour préparer son sac — générer 764e0de3f50f
- B. De l'aide pour faire ses devoirs — générer b5dc576e0387
- C. De l'aide pour cuisiner — générer 9095d466489d

## delf-a1-2022-co-92 — question 4

Quels objets de toilette faut-il prendre avec les serviettes ?

- A. Le dentifrice et les brosses à dents — générer 46205d9bab84
- B. Le savon et le peigne — générer e7bdddbb60a2
- C. Le shampoing et le sèche-cheveux — générer 3e39ad71677f

## delf-a1-2022-co-92 — question 7

Dans quel bagage faut-il mettre les objets de toilette ?

- A. Le sac — générer 0a0f3774a372
- B. La valise — réutiliser /lib/images/vocabulaire/voyage/valise.webp
- C. Le panier — réutiliser /lib/images/vocabulaire/objets/panier.webp

## delf-a1-2022-co-94 — question 1

Quelle fête a lieu ce week-end ?

- A. La fête des mères — générer c8ff993f904e
- B. La fête des pères — générer bde7b3dd02f7
- C. La fête de la musique — réutiliser /lib/images/tcf/co/bg/concert.webp

## delf-a1-2022-co-96 — question 1

Quel objet est prêté ?

- A. Un stylo — générer 8e4309172597
- B. Un crayon — réutiliser /lib/images/vocabulaire/ecole-bureau/crayon.webp
- C. Un feutre — réutiliser /lib/images/vocabulaire/ecole-bureau/feutre.webp

## delf-a1-2022-co-96 — question 5

Dans quel restaurant cet aliment est-il servi ?

- A. Le restaurant de l'université — générer ab7eea2adade
- B. Le restaurant de l'hôtel — générer a6a917953b36
- C. Le restaurant de la gare — générer 916d6573cd97

## delf-a1-2022-co-96 — question 6

Quel aliment la personne ne mange-t-elle pas ?

- A. La viande — réutiliser /lib/images/vocabulaire/aliments/viande.webp
- B. Les légumes — générer 90de79c523db
- C. Le fromage — réutiliser /lib/images/vocabulaire/aliments/fromage.webp

## delf-a1-2022-co-ex5-53 — question 4

Quels couverts sont nommés ?

- A. Un couteau et une fourchette — générer 2fa9386655ea
- B. Une cuillère et une louche — générer fd621f9ae768
- C. Une spatule et une pince — générer 0be338165a83

## delf-a1-2022-co-ex5-53 — question 5

Quelle boisson est nommée ?

- A. Une bouteille d'eau — réutiliser /lib/images/vocabulaire/boissons/bouteille-deau.webp
- B. Une bouteille de lait — générer c2b213a17e80
- C. Une bouteille de jus — générer ed1c4335755e

## delf-a1-2022-co-ex5-55-1 — question 3

Quel objet pour écrire achète-t-elle ?

- A. Un stylo — générer 8e4309172597
- B. Un crayon — réutiliser /lib/images/vocabulaire/ecole-bureau/crayon.webp
- C. Un feutre — réutiliser /lib/images/vocabulaire/ecole-bureau/feutre.webp

## delf-a1-2022-co-ex5-55-2 — question 1

Quel objet la personne prend-elle ?

- A. Des enveloppes — réutiliser /lib/images/vocabulaire/argent-administration/enveloppe.webp
- B. Des timbres — réutiliser /lib/images/vocabulaire/argent-administration/timbre.webp
- C. Des cartes postales — générer 88feb36de74f

## delf-a1-2022-co-ex5-56 — question 2

Quel accessoire de vue se trouve sur le bureau ?

- A. Des lunettes — générer 49dc1fdc4bc6
- B. Des lentilles — générer ec9ee54edae6
- C. Une loupe — réutiliser /lib/images/vocabulaire/objets/loupe.webp

## delf-a1-2022-co-ex5-56 — question 4

Quelle boisson est sur le bureau ?

- A. Une bouteille d'eau — réutiliser /lib/images/vocabulaire/boissons/bouteille-deau.webp
- B. Une bouteille de jus — générer ed1c4335755e
- C. Une bouteille de lait — générer c2b213a17e80

## delf-a1-2022-co-ex5-58-1 — question 1

Pour quelle occasion ces vêtements sont-ils utilisés ?

- A. Le travail — réutiliser /lib/images/tcf/co/bg/bureau.webp
- B. Le sport — réutiliser /lib/images/vocabulaire/sports/sport.webp
- C. Une fête — générer c1894208bd4c

## delf-a1-2022-co-ex5-58-2 — question 2

Quel moyen de paiement est demandé ?

- A. Les espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp
- B. La carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- C. Le chèque — générer 3fdab7ee8aab

## delf-a1-2022-co-ex5-71 — question 3

Quelle activité propose-t-il ?

- A. Regarder un film à la télévision — générer c7304ab36c5e
- B. Jouer au football — générer f3686ebe2d92
- C. Faire une promenade — générer 36a122d59ba7

## delf-a1-2022-co-ex5-71 — question 5

Quel objet le destinataire possède-t-il pour entrer ?

- A. La clé de l'appartement — générer dabc4d41a2dc
- B. Un badge d'entreprise — générer 7ad4aa4c4537
- C. Une carte d'hôtel — générer 903b3674657f

## delf-a1-2022-co-ex5-71 — question 6

Que prépare Pierre ?

- A. Des pâtes à la sauce tomate — générer b98ebc312e30
- B. Du poisson avec du riz — générer dd40fb30cc87
- C. Du poulet avec des frites — générer df5586f7ac66

## delf-a1-2022-co-ex5-72 — question 4

Quel siège se trouve dans le bureau ?

- A. Une grande chaise — générer 249c4f92d074
- B. Un canapé — réutiliser /lib/images/vocabulaire/maison/canape.webp
- C. Un fauteuil roulant — réutiliser /lib/images/vocabulaire/sante/fauteuil-roulant.webp

## delf-a1-2022-co-ex5-72 — question 6

Quel appareil pour les boissons y trouve-t-on ?

- A. Une machine à café — réutiliser /lib/images/vocabulaire/electromenager/machine-à-café.webp
- B. Une bouilloire — réutiliser /lib/images/vocabulaire/electromenager/bouilloire.webp
- C. Un distributeur de jus — générer 04eace3d1524

## tcf-a2j-s1-ce-1 — question 4

Quel objet faut-il retrouver dans le jeu 3 ?

- A. La couronne de la reine — générer 5dc88dc39d65
- B. La clé du château — générer 2e78d7b8b58c
- C. La montre de l’inspecteur — générer 13fe4d3afc26

## tcf-a2j-s1-ce-3 — question 7

Document 3 — Quel bouton sert à choisir la position de cuisson ?

- A. Le bouton blanc — générer 4e27fde5d3d6
- B. Le bouton rouge — générer de7e6a795304
- C. Le bouton horloge — générer 2e687de35c4d

## tcf-a2j-s2-ce-1 — question 8

Document 6 — Que faut-il apporter au stade ?

- A. Un ballon — réutiliser /lib/images/vocabulaire/sports/ballon.webp
- B. Une raquette de tennis — réutiliser /lib/images/vocabulaire/sports/raquette-de-tennis.webp
- C. Un bonnet de bain — générer e95e213c4bdb

## tcf-a2j-s2-ce-3 — question 7

Document 2 — Que peut-on ajouter pour éviter d’avoir faim ?

- A. Du yaourt et des céréales — générer 79b5aa76668b
- B. Du beurre et du sel — générer c2eb8d684ffb
- C. Du café et du sucre — générer e47644072ebf

## tcf-a2j-s2-ce-3 — question 8

Document 3 — Que conseille le texte au réveil ?

- A. Boire un grand verre d’eau — générer 5330d1e68c85
- B. Boire un café très sucré — générer 4b9742eb90ca
- C. Attendre midi avant de boire — générer 3cecf40ae457

## tcf-a2-s1-ce-1 — question 7

Document 5 — Quels spectacles sont proposés à Lille ?

- A. Des spectacles de marionnettes — générer 9c43805dd169
- B. Des spectacles de magie — générer e231cf396c67
- C. Des spectacles de danse — générer 306636e4fbb1

## tcf-a2-s1-ce-3 — question 1

Document 1 — Où faut-il mettre les invendus ?

- A. À la poubelle — réutiliser /lib/images/vocabulaire/objets/poubelle.webp
- B. Dans la vitrine — générer d767a2b5ded5
- C. Dans le réfrigérateur — réutiliser /lib/images/vocabulaire/electromenager/refrigerateur.webp

## tcf-a2-s1-ce-3 — question 2

Document 1 — Avec quoi faut-il nettoyer la vitrine ?

- A. Du produit désinfectant — générer af61fd58a093
- B. Du produit vaisselle — générer 060173b9f18f
- C. Du savon pour les mains — générer 3b336cae3b5c

## tcf-a2-s1-ce-3 — question 7

Document 2 — Que faut-il mettre au-dessus des fruits ?

- A. La crème — réutiliser /lib/images/vocabulaire/aliments/creme.webp
- B. La pâte — générer 43de5d6d2877
- C. La farine — réutiliser /lib/images/vocabulaire/aliments/farine.webp

## tcf-a2p-s1-ce-3 — question 4

Document 2 — Quels ingrédients faut-il faire fondre ensemble ?

- A. Le beurre et le chocolat — générer 54567ba1344b
- B. Le sucre et les céréales — générer e1dd2a91e07e
- C. Le beurre et les céréales — générer 9a1e3f6596b1

## tcf-a2p-s2-ce-1 — question 2

Quel accompagnement est servi avec le rôti de veau ?

- A. Du riz — réutiliser /lib/images/vocabulaire/aliments/riz.webp
- B. Des pâtes — réutiliser /lib/images/vocabulaire/aliments/pâtes.webp
- C. Des pommes de terre — générer 3762b0724d76

## tcf-a2p-s2-ce-1 — question 3

Quelle entrée est proposée dans le menu 3 ?

- A. Une assiette de crudités — générer fba6960e99b9
- B. Une soupe froide — générer 842b3c0b31a7
- C. Une salade de fruits — réutiliser /lib/images/vocabulaire/desserts/salade-de-fruits.webp

## tcf-a2p-s2-ce-2 — question 5

Quelle spécialité de l’île aime-t-elle ?

- A. Le fromage de chèvre — réutiliser /lib/images/vocabulaire/aliments/fromage-de-chevre.webp
- B. Le gâteau au chocolat — générer 2cda655077b0
- C. La soupe de poisson — générer 577664a10582

## tcf-a2p-s2-ce-3 — question 3

Quels ingrédients faut-il faire fondre pour le caramel ?

- A. Le beurre et le sucre — générer 7e9f2b16ea1b
- B. Le lait et la farine — générer f39706017b3b
- C. Le chocolat et la crème — générer 9421f87184a1

## tcf-a2p-s4-ce-1 — question 4

Quel équipement accompagne l’appartement de l’annonce 3 ?

- A. Une place de garage — générer 18eb73f7ce40
- B. Une piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp
- C. Un jardin privé — générer 2129d101428f

## tcf-a2p-s4-ce-2 — question 6

Quel objet l’équipe conseille-t-elle d’apporter ?

- A. Un appareil photo — réutiliser /lib/images/vocabulaire/technologie/appareil-photo.webp
- B. Un ordinateur portable — réutiliser /lib/images/vocabulaire/technologie/ordinateur-portable.webp
- C. Un casque de vélo — générer 6b018e889cae

## tcf-a2-sa-ce-1 — question 2

Document 1 — Que faut-il apporter au cours de danse ?

- A. Une bouteille d’eau — réutiliser /lib/images/vocabulaire/boissons/bouteille-deau.webp
- B. Une serviette de bain — générer 201f3a85ed45
- C. Un livre — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp

## tcf-a2-sa-ce-3 — question 2

Document 1 — Sur quel appareil faut-il compléter le formulaire ?

- A. Un ordinateur — réutiliser /lib/images/vocabulaire/technologie/ordinateur.webp
- B. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp
- C. Une tablette tactile — générer 1cc64d5246fb

## tcf-a2-sb-ce-2 — question 3

Quel type de fête Isabelle prépare-t-elle ?

- A. Une fête surprise — générer 8a650cd412c8
- B. Une fête professionnelle — générer f5912a816383
- C. Une fête publique — générer 76b1f5ec8563

## tcf-a2-sb-ce-3 — question 2

Document 1 — Avec quel produit faut-il laver les vitres ?

- A. Le produit bleu — générer dbeea39c2c58
- B. Le produit désinfectant — générer bf595943414d
- C. Le savon pour les mains — générer aec864d84871

## tcf-a2-sb-ce-3 — question 4

Document 1 — Où faut-il déposer les objets oubliés ?

- A. À l’accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- B. Dans les toilettes — réutiliser /lib/images/vocabulaire/maison/toilettes.webp
- C. Dans le bureau du docteur — générer 50a47e8ab947

## tcf-a2-sb-ce-4 — question 4

Que peut-on fabriquer soi-même ?

- A. Une étagère — réutiliser /lib/images/vocabulaire/maison/etagere.webp
- B. Une voiture de sport — générer 57f804ba4853
- C. Un téléphone portable — réutiliser /lib/images/vocabulaire/technologie/telephone-portable.webp

## tcf-a2-sc-ce-4 — question 1

Quels spectacles sont proposés en décembre ?

- A. Des spectacles de lumière et de musique — générer 3980f80adf32
- B. Des spectacles de cirque et de magie — générer da1d95b6d201
- C. Des spectacles de danse et de théâtre — générer 8434825711c0

## tcf-a2-sc-ce-4 — question 5

Quelle activité les plus grands pratiquent-ils devant la grande roue ?

- A. Le ski — réutiliser /lib/images/vocabulaire/sports/ski.webp
- B. Le patin à glace — générer e4b890649d39
- C. Le vélo — réutiliser /lib/images/vocabulaire/transports/velo.webp

## delf-a2j-ce-001 — question 3

Quels produits apprend-on à réaliser dans l’atelier 2 ?

- A. Des croissants et des pains au chocolat — générer 8f1991c296c2
- B. Des pizzas et des pâtes — générer 9a1c5beb92ea
- C. Des soupes et des salades — générer 62cfa5032bf7

## delf-a2j-ce-001 — question 4

Quelle tradition pâtissière l’atelier 2 présente-t-il ?

- A. La pâtisserie suisse — générer 12e668729cdf
- B. La pâtisserie italienne — générer aee90b38d94d
- C. La pâtisserie japonaise — générer 189a05fe38ea

## delf-a2j-ce-004 — question 3

Que peut-on admirer dans le stage 3 ?

- A. Des paysages — réutiliser /lib/images/vocabulaire/nature/paysage.webp
- B. Des voitures anciennes — générer 8071fec26984
- C. Des costumes — réutiliser /lib/images/vocabulaire/vetements/costume.webp

## delf-a2j-ce-010 — question 2

Quels articles sont soldés ?

- A. Des vêtements et des chaussures — générer 2086536a8acb
- B. Des meubles et des lampes — générer f643b34acc71
- C. Des livres et des jeux — générer 6b1a724b2cf1

## delf-a2j-ce-010 — question 7

Quel type de cours est proposé à la piscine ?

- A. Des cours de natation — générer 9cad4a185163
- B. Des cours de plongée — générer aa197b588cd6
- C. Des cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp

## delf-a2j-ce-012 — question 3

Dans quelles disciplines les chats s’affrontent-ils ?

- A. La danse et le chant — générer 679e53f5defb
- B. Le théâtre et la peinture — générer 145e3f6124b0
- C. Le sport et la cuisine — générer e9e3d31f0d57

## delf-a2j-ce-018 — question 2

Quels ingrédients composent les plats de Légumina ?

- A. Des légumes et des céréales — générer 862bb061ec50
- B. De la viande et des légumes — générer 12ecd1be11c4
- C. Du poisson et du riz — générer d527ac316ca2

## delf-a2j-ce-020 — question 5

Qu’a apporté Fred à manger ?

- A. Un gâteau au fromage — générer 20976bc76899
- B. Une tarte aux fraises — générer ac7f419dce8c
- C. Une salade de fruits — réutiliser /lib/images/vocabulaire/desserts/salade-de-fruits.webp

## delf-a2j-ce-021 — question 5

Quel gâteau vont-elles préparer ?

- A. Un gâteau au chocolat — générer 40b742b7985d
- B. Un gâteau au citron — générer a14ef527c4c4
- C. Un gâteau aux pommes — générer 6feafff4fbbb

## delf-a2j-ce-021 — question 6

Sur quel choix Julia demande-t-elle une idée ?

- A. Le film à voir au cinéma — générer 47f4b07ff853
- B. Le livre à emprunter — générer 202e2647c3a8
- C. Le gâteau à préparer — générer dcd5237eaea3

## delf-a2j-ce-023 — question 8

Quel costume Karl a-t-il vu en vitrine ?

- A. Un costume de lion — générer 14a076461ad0
- B. Un costume de pirate — générer 5af53ba3865f
- C. Un costume de robot — générer ba16c7dcbf44

## delf-a2j-ce-027 — question 1

Quel service la plateforme propose-t-elle ?

- A. De la musique en ligne — générer e47ded510e51
- B. Des films en ligne — générer 151758e562b2
- C. Des livres en ligne — générer 409f671134fa

## delf-a2j-ce-028 — question 7

Que faut-il faire avant de partir après le spectacle ?

- A. Ranger la salle — générer 5eb94cc44aa6
- B. Faire une nouvelle répétition — générer b943103401c5
- C. Vendre les costumes — générer f43d4003d3c8

## delf-a2j-ce-031 — question 8

Quel bouton faut-il presser sur les bornes des quais ?

- A. Le bouton rouge — générer de7e6a795304
- B. Le bouton vert — générer 6c7a07bea2b2
- C. Le bouton bleu — générer c98436035d39

## delf-a2j-ce-032 — question 6

Quel moyen de transport remplace le métro ?

- A. Un bus gratuit — générer e7b18398c749
- B. Un taxi payant — générer 4757b5160694
- C. Un train spécial — générer 33fb1a5928cc

## delf-a2j-ce-035 — question 1

À quel appareil une liseuse ressemble-t-elle ?

- A. Une tablette tactile — générer 1cc64d5246fb
- B. Un téléphone fixe — générer 361e1b1b7baf
- C. Une télévision — réutiliser /lib/images/vocabulaire/technologie/télévision.webp

## delf-a2j-ce-035 — question 2

À quoi la liseuse sert-elle uniquement ?

- A. Lire des livres numériques — générer bc4f6596a411
- B. Regarder des films — générer cb1b7b7d5318
- C. Jouer à des jeux vidéo — générer 2b47a2f02343

## delf-a2j-ce-039 — question 3

Où les ateliers ont-ils lieu ?

- A. Dans les parcs de la ville — générer 6e224c85373a
- B. Dans les salles de cinéma — générer 5ba0582f2688
- C. Dans les gares — générer 7458b7170365

## delf-a2j-ce-040 — question 1

Quel type de chocolat faut-il utiliser ?

- A. Du chocolat noir — générer 4fd6d8e2b41c
- B. Du chocolat blanc — générer 1751cf97b1d3
- C. Du chocolat au lait — générer 8a73fe238dd7

## delf-a2j-ce-043 — question 7

Quel autre appareil est déconseillé ?

- A. Le téléphone portable — réutiliser /lib/images/vocabulaire/technologie/telephone-portable.webp
- B. La lampe de bureau — générer 86d1a8a27d41
- C. L’imprimante — réutiliser /lib/images/vocabulaire/technologie/imprimante.webp

## delf-a2j-ce-044 — question 3

Quel type de papier faut-il choisir pour les cahiers ?

- A. Du papier recyclé — générer 3876826a1c8d
- B. Du papier plastifié — générer 826a39af387d
- C. Du papier brillant — générer 7c7fcc20c2ac

## delf-a2j-ce-046 — question 7

Où faut-il remplir la carafe ?

- A. Au robinet — réutiliser /lib/images/vocabulaire/hygiene/robinet.webp
- B. À la fontaine de la cour — générer 5e888a089595
- C. Dans la cuisine du professeur — générer 370445a041c3

## delf-a2j-ce-047 — question 7

Quelle activité est interdite ?

- A. Regarder des vidéos — générer 157f6ce643f8
- B. Faire des recherches — générer 3da968ed61aa
- C. Travailler à deux — générer 6eb530e1ff13

## delf-a2j-ce-048 — question 4

Que chaque élève doit-il apporter ?

- A. Un gâteau traditionnel de son pays — générer af1160b98543
- B. Une boisson — réutiliser /lib/images/vocabulaire/boissons/boisson.webp
- C. Un instrument de musique — générer 7b9e405390f8

## delf-a2j-ce-053 — question 8

Que mange-t-on le mardi gras selon le texte ?

- A. Des crêpes — réutiliser /lib/images/vocabulaire/desserts/crêpe.webp
- B. Des pizzas — réutiliser /lib/images/vocabulaire/aliments/pizza.webp
- C. Des tartes aux pommes — générer 4f1c9a733951

## delf-a2j-ce-059 — question 2

Quels bébés animaux peut-on découvrir ?

- A. Des singes — générer 4df3a19671d3
- B. Des lions — générer 99ccce79d807
- C. Des tortues — générer 5c29cc7b37c5

## delf-a2j-ce-061 — question 2

Quel bateau peut-on louer ?

- A. Un canoë — générer 7634f02e5734
- B. Un voilier — réutiliser /lib/images/vocabulaire/transports/voilier.webp
- C. Un bateau à moteur — générer c95d18e692a1

## delf-a2j-ce-061 — question 8

Quels visiteurs ne sont pas acceptés, même tenus en laisse ?

- A. Les animaux — réutiliser /lib/images/vocabulaire/animaux-ferme-compagnie/animaux.webp
- B. Les groupes de centres de loisirs — générer 23efda4156a1
- C. Les familles — réutiliser /lib/images/vocabulaire/famille-personnes/famille.webp

## delf-a2j-ce-062 — question 1

Quel objet la publicité présente-t-elle ?

- A. Un réveil — réutiliser /lib/images/vocabulaire/objets/réveil.webp
- B. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp
- C. Une radio de voiture — générer 2cbe98daf433

## delf-a2j-ce-067 — question 2

Quel type de soirée est organisé ?

- A. Une soirée jeux — générer 7900a8b5f0b9
- B. Une soirée cinéma — générer 9767e4b7c2c4
- C. Une soirée danse — générer 85534a6f6e72

## delf-a2j-ce-068 — question 1

Quel type de jeu est Dobble ?

- A. Un jeu de cartes — réutiliser /lib/images/vocabulaire/loisirs/jeu-de-cartes.webp
- B. Un jeu de dés — générer 41ccd0f0cd29
- C. Un jeu de construction — générer 253c6b8d3d57

## delf-a2j-ce-069 — question 1

Que faut-il ouvrir pour commencer ?

- A. La mallette — générer 6b167083d239
- B. Une boîte de cartes — générer c9a31eaadfb9
- C. Un livre — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp

## delf-a2j-ce-069 — question 7

Quel bouton permet d’écouter la description ?

- A. Le bouton vert — générer 6c7a07bea2b2
- B. Le bouton rouge — générer de7e6a795304
- C. Le bouton bleu — générer c98436035d39

## delf-a2r-ce-002 — question 3

Document 1 — Que les participants viennent-ils faire ?

- A. Chanter leurs chansons préférées — générer d0fc2162ce0f
- B. Peindre des tableaux — générer e60c89d72e59
- C. Regarder des films — générer cb1b7b7d5318

## delf-a2r-ce-007 — question 3

Document 1 — Où les clients peuvent-ils se reposer ?

- A. Au bord de l’eau — générer 92017c946914
- B. Au pied des pistes de ski — générer e989a95089a0
- C. Dans le désert — réutiliser /lib/images/vocabulaire/nature/désert.webp

## delf-a2r-ce-007 — question 4

Document 2 — Quel type d’hébergement est présenté ?

- A. Une auberge de jeunesse — générer 541d920166f9
- B. Un camping — réutiliser /lib/images/tcf/co/bg/camping.webp
- C. Un hôtel de luxe — générer 2d5428451739

## delf-a2r-ce-008 — question 7

Document 3 — Que comprend l’offre Formule Hôtel ?

- A. Une chambre et le petit-déjeuner — générer 4276af446a96
- B. Une chambre et tous les repas — générer e12306cb3f7c
- C. Une chambre et un forfait de ski — générer a5fdc2a0d874

## delf-a2r-ce-009 — question 6

Document 2 — Quels équipements sportifs sont à disposition ?

- A. Une salle de sport et une piscine — générer 0a2bdfcba16f
- B. Un stade et un court de tennis — générer 3451559ce42e
- C. Une patinoire et un terrain de rugby — générer 6ac291f1ed4d

## delf-a2r-ce-010 — question 1

Document 1 — Sur quel espace l’appartement donne-t-il ?

- A. Une cour calme — générer c7cc5fc9f1b7
- B. Une rue bruyante — générer f55b714e75bc
- C. Un parking couvert — générer efe6ca1b68b0

## delf-a2r-ce-010 — question 6

Document 2 — Quelles pièces sont communes ?

- A. La cuisine et le salon — générer 18e0f7c346d5
- B. La chambre et la salle de classe — générer 885fd5e47a0e
- C. Le garage et le jardin — générer 272b9e610acd

## delf-a2r-ce-011 — question 1

Quelle activité permet d’apprendre un instrument ?

- A. L’atelier de musique — générer 0d5157c8ccf7
- B. L’atelier de théâtre — générer c7dcf41ee54e
- C. Le cours de cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp

## delf-a2r-ce-012 — question 6

De quoi les membres du club de lecture discutent-ils ?

- A. Des livres qu’ils ont lus — générer 0cc9ec492ea2
- B. Des recettes qu’ils ont cuisinées — générer 75dc139535a0
- C. Des films qu’ils ont réalisés — générer cb0ef9c3bdf8

## delf-a2r-ce-013 — question 1

Quel musée présente des arts d’Afrique et d’Asie ?

- A. Le musée des cultures du monde — générer 49bf4f3e549b
- B. Le musée des sciences — générer 61e66f12efb4
- C. Le musée de cire — générer 7e158d139cac

## delf-a2r-ce-013 — question 6

Quel musée présente les stars préférées des visiteurs ?

- A. Le musée de cire — générer 7e158d139cac
- B. Le musée des sciences — générer 61e66f12efb4
- C. Le musée des cultures du monde — générer 49bf4f3e549b

## delf-a2r-ce-015 — question 5

Que contient le sandwich ?

- A. Du jambon et du beurre — générer 619ede8ff5a9
- B. Du thon et de la salade — générer 225b4fd47cbc
- C. Du fromage et des tomates — générer 837617fb8bf9

## delf-a2r-ce-016 — question 1

Que contient la formule sandwich ?

- A. Un sandwich jambon-beurre et une boisson — générer 797191a0b799
- B. Un sandwich au thon et une soupe — générer fdda35397955
- C. Un sandwich au fromage et un dessert — générer 2342048c077f

## delf-a2r-ce-016 — question 6

Quelle soupe le menu produits de la mer comprend-il ?

- A. Une soupe miso — générer 0405a00870e0
- B. Une soupe à l’oignon — générer e64a9e8c64a0
- C. Une soupe de tomates — générer 48bc389c9363

## delf-a2r-ce-017 — question 3

Quels féculents accompagnent l’émincé ?

- A. Des pommes de terre — générer 3762b0724d76
- B. Du riz — réutiliser /lib/images/vocabulaire/aliments/riz.webp
- C. Des pâtes — réutiliser /lib/images/vocabulaire/aliments/pâtes.webp

## delf-a2r-ce-018 — question 7

Quel ingrédient constitue la base du risotto ?

- A. Le riz — réutiliser /lib/images/vocabulaire/aliments/riz.webp
- B. Les pommes de terre — générer 22800756395b
- C. Les nouilles — réutiliser /lib/images/vocabulaire/aliments/nouilles.webp

## delf-a2r-ce-018 — question 8

Quels fruits de mer trouve-t-on dans le risotto ?

- A. Des crevettes — réutiliser /lib/images/vocabulaire/animaux-aquatiques/crevette.webp
- B. Des moules — générer b69f4b71c7b4
- C. Des huîtres — réutiliser /lib/images/vocabulaire/animaux-aquatiques/huitre.webp

## delf-a2r-ce-020 — question 1

Dans quel commerce obtient-on des bons d’achat ?

- A. Le supermarché — réutiliser /lib/images/tcf/co/bg/supermarche.webp
- B. Le cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Le magasin de téléphones — générer c72863ee2e2a

## delf-a2r-ce-024 — question 8

Où la fête aura-t-elle lieu ?

- A. Dans la salle d’un café — générer 25d22020e033
- B. Dans un parc — réutiliser /lib/images/tcf/co/bg/parc.webp
- C. À l’université — réutiliser /lib/images/tcf/co/bg/universite.webp

## delf-a2r-ce-029 — question 7

Que Delphine demande-t-elle d’apporter ?

- A. Des jus de fruits et du soda — générer d7d4c8ff31ac
- B. Du pain et du fromage — générer 784f44f8eafb
- C. Du café et du thé — générer a2c2223bca60

## delf-a2r-ce-034 — question 9

Où faut-il s’inscrire ?

- A. À l’accueil du centre — générer 73ae858b4ca5
- B. À la mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp
- C. À la bibliothèque — réutiliser /lib/images/tcf/co/bg/bibliotheque.webp

## delf-a2r-ce-035 — question 9

Quelle activité permet de découvrir les spécialités suisses ?

- A. Un cours de cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp
- B. Un cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- C. Un atelier de peinture — générer c4051ad4c87f

## delf-a2r-ce-036 — question 3

Quel vêtement doit couvrir le haut du corps au travail ?

- A. Une blouse — générer df5b9df35d56
- B. Un maillot de bain — réutiliser /lib/images/vocabulaire/vetements/maillot-de-bain.webp
- C. Un manteau de pluie — générer ceefb0e5a251

## delf-a2r-ce-036 — question 4

Quel vêtement est prévu pour le bas du corps ?

- A. Un pantalon — réutiliser /lib/images/vocabulaire/vetements/pantalon.webp
- B. Un short de bain — générer 187235e3a7aa
- C. Une jupe de soirée — générer fe86a9b569ab

## delf-a2r-ce-036 — question 8

Dans quelle pièce faut-il manger ?

- A. La salle de repos — générer 9551d6aa8753
- B. La salle de soins — générer 50b608f313e7
- C. Le couloir — réutiliser /lib/images/vocabulaire/maison/couloir.webp

## delf-a2r-ce-038 — question 2

Quels vêtements faut-il mettre à son arrivée ?

- A. Un uniforme et un tablier — générer 4e507f2b203b
- B. Un costume et une cravate — générer d2e84674e103
- C. Un maillot et un bonnet — générer 2dca0fc84b89

## delf-a2r-ce-038 — question 3

Quel équipement est obligatoire aux pieds ?

- A. Des chaussures de service — générer f3eabbe7a298
- B. Des sandales de plage — générer d7e358fe3dd6
- C. Des chaussures de ski — générer 806691849798

## delf-a2r-ce-038 — question 5

Quels espaces faut-il nettoyer ?

- A. Les tables et le sol — générer d0b63a678584
- B. Les fenêtres et le toit — générer 7ad7958574c0
- C. Le parking et le jardin — générer 899484567a75

## delf-a2r-ce-039 — question 2

Pour quelle occasion la famille Martin a-t-elle réservé ?

- A. Un anniversaire — réutiliser /lib/images/tcf/co/bg/fete-anniversaire.webp
- B. Un mariage — réutiliser /lib/images/tcf/co/bg/mariage.webp
- C. Un pot de départ — générer e729d997d75f

## delf-a2r-ce-039 — question 5

Pour quelle occasion M. Roch veut-il une table ?

- A. Un pot de départ — générer e729d997d75f
- B. Un anniversaire — réutiliser /lib/images/tcf/co/bg/fete-anniversaire.webp
- C. Un mariage — réutiliser /lib/images/tcf/co/bg/mariage.webp

## delf-a2r-ce-039 — question 8

Quel événement est prévu le lendemain ?

- A. Une réception de mariage — générer 10c5ba9c8e61
- B. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. Un cours de cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp

## delf-a2r-ce-040 — question 4

Quel produit laitier entre dans le premier mélange ?

- A. Le lait — réutiliser /lib/images/vocabulaire/boissons/lait.webp
- B. La crème glacée — générer 6aa7dec040c9
- C. Le yaourt — réutiliser /lib/images/vocabulaire/aliments/yaourt.webp

## delf-a2r-ce-040 — question 5

Quels ingrédients ajoute-t-on ensuite ?

- A. Du jambon et des oignons — générer 1b707348431d
- B. Du chocolat et des pommes — générer 0cf236409cc3
- C. Du poulet et des carottes — générer 1e32ba13cc5f

## delf-a2r-ce-042 — question 5

Quels fruits faut-il ajouter ?

- A. Des pommes et des poires — générer 9dd6fb9363ec
- B. Des oranges et des citrons — générer 272abc0c5fc4
- C. Des fraises et des framboises — générer 30b26262e1a2

## delf-a2r-ce-043 — question 3

Quels vêtements sont interdits ?

- A. Les shorts et les bermudas — générer 83c09c628a1c
- B. Les maillots une pièce — générer 3e7b42d64918
- C. Les maillots deux pièces — générer 45a061346e42

## delf-a2r-ce-043 — question 4

Dans quoi faut-il ranger ses affaires ?

- A. Un casier — réutiliser /lib/images/vocabulaire/ecole-bureau/casier.webp
- B. Un sac au bord de l’eau — générer d79918848d81
- C. Une boîte à l’accueil — générer 2e4e735ff14a

## delf-a2r-ce-045 — question 2

Quelles boissons sont notamment citées ?

- A. Des jus de fruits — réutiliser /lib/images/vocabulaire/boissons/jus.webp
- B. Du lait chaud — générer ef8aab64471b
- C. Du café préparé — générer c69e5e3b7c77

## delf-a2r-ce-046 — question 6

Quel comportement faut-il éviter dans les chambres la nuit ?

- A. Faire du bruit — générer be1a2b8a3b25
- B. Dormir — réutiliser /lib/images/vocabulaire/actions/dormir.webp
- C. Lire silencieusement — générer 63807642c31f

## delf-a2r-ce-048 — question 1

Quel aliment ne faut-il pas donner avant le repas ?

- A. Des bonbons — réutiliser /lib/images/vocabulaire/desserts/bonbon.webp
- B. Des légumes — générer 159b7a5e2950
- C. Du pain — réutiliser /lib/images/vocabulaire/aliments/pain.webp

## delf-a2r-ce-048 — question 7

Où peut-elle aller jouer ?

- A. Dans le jardin — réutiliser /lib/images/tcf/co/bg/jardin.webp
- B. Dans la rue — générer 7dc7f857ae84
- C. Dans le parking — générer ee79504f6818

## delf-a2r-ce-050 — question 6

Que propose-t-elle après le rendez-vous ?

- A. Aller au restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp
- B. Aller nager — générer 564f8f603ae9
- C. Faire les magasins — générer d5582901c7dd

## delf-a2r-ce-050 — question 7

Quel type de restaurant connaît-elle ?

- A. Un restaurant italien — générer 79c702c64bf9
- B. Un restaurant japonais — générer 604c09693175
- C. Un restaurant indien — générer 6561a7d2748b

## delf-a2r-ce-051 — question 5

Quelle quantité d’huile est indiquée ?

- A. Une cuillère à soupe — générer 317705e2fd9d
- B. Un verre — réutiliser /lib/images/vocabulaire/cuisine/verre.webp
- C. Un demi-litre — générer 47329d4d466e

## delf-a2r-ce-055 — question 5

Quels aliments sont conseillés pour rester concentré ?

- A. Le poisson et les fruits secs — générer b7397c520e3d
- B. Les frites et les bonbons — générer fb818433ee96
- C. Les pâtisseries et les sodas — générer 3c2cc2c33c0a

## delf-a2r-ce-055 — question 10

Quels exercices peuvent aider à s’endormir ?

- A. Des exercices de relaxation — générer 838e55bba25b
- B. Des exercices de sprint — générer dde8fc6caa12
- C. Des exercices de calcul chronométrés — générer 0c4d35f1e4d6

## delf-a2r-ce-056 — question 5

Quelle boisson est recommandée ?

- A. Le thé vert — générer a6e05299130b
- B. Le soda — réutiliser /lib/images/vocabulaire/boissons/soda.webp
- C. Le café très sucré — générer 84ff044addfd

## delf-a2r-ce-060 — question 10

Sur quel meuble peut-on dormir chez un hôte de couchsurfing ?

- A. Un canapé — réutiliser /lib/images/vocabulaire/maison/canape.webp
- B. Une table de cuisine — générer 15341f427c55
- C. Un bureau — réutiliser /lib/images/vocabulaire/ecole-bureau/bureau.webp

## delf-a2r-ce-062 — question 4

Quel moyen de transport relie Täsch à Zermatt ?

- A. Un petit train — générer 862943b65dc8
- B. Un bateau — réutiliser /lib/images/vocabulaire/transports/bateau.webp
- C. Un avion — réutiliser /lib/images/vocabulaire/transports/avion.webp

## delf-a2r-ce-062 — question 5

Dans quel hébergement le groupe passe-t-il la nuit ?

- A. Un chalet — réutiliser /lib/images/tcf/co/bg/chalet.webp
- B. Un camping — réutiliser /lib/images/tcf/co/bg/camping.webp
- C. Une auberge de jeunesse — générer 541d920166f9

## delf-a2r-ce-063 — question 7

Quel type de biens vend-il surtout ?

- A. Des maisons — réutiliser /lib/images/vocabulaire/maison/maison.webp
- B. Des magasins — générer 781deb8227d1
- C. Des bureaux — réutiliser /lib/images/tcf/co/bg/bureau.webp

## delf-a2r-ce-066 — question 3

Quelle nouveauté est mise en avant ?

- A. Les livres de cuisine — générer 9b511cf764ee
- B. Les livres de sport — générer 185836247dd1
- C. Les cartes routières — générer 18bfd4a86c25

## delf-a2r-ce-067 — question 6

Quel hébergement est proposé pour un séjour paisible ?

- A. Une maison d’hôtes près du lac — générer 460b08a746f7
- B. Un camping au centre-ville — générer 98efa38563fe
- C. Une chambre dans une gare — générer 569c8a18f0c9

## delf-a2r-ce-070 — question 3

Quelle protection faut-il porter pour le hockey ?

- A. Un casque — réutiliser /lib/images/vocabulaire/accessoires/casque.webp
- B. Un masque de plongée — générer efe319380e6b
- C. Un gilet de sauvetage — générer ac98b3817fe8

## delf-a2r-ce-070 — question 4

Quel équipement faut-il porter aux pieds pour le hockey ?

- A. Des patins — générer ed549a909d95
- B. Des raquettes — générer e6e35814c7c6
- C. Des palmes — réutiliser /lib/images/vocabulaire/sports/palmes.webp

## tcf-a2j-s1-co-1 — question 19

Que peut-on voir à 11 h ?

- A. Le repas des lions — générer 5e661b9f0701
- B. Le repas des girafes — générer d1f862e82237
- C. Le repas des dauphins — générer aa5adb3a720f

## tcf-a2j-s2-co-1 — question 4

Quels objets faut-il apporter ?

- A. Un maillot de bain et une serviette — générer b7cd7c8d975f
- B. Un ballon et une raquette — générer dbbfbad028b2
- C. Un cahier et un stylo — générer bedd7c96f687

## tcf-a2j-s2-co-1 — question 13

Vers quelles caisses faut-il se diriger ?

- A. Les caisses automatiques — générer 3ed19b68fd35
- B. Les caisses réservées aux groupes — générer a28889c8bcb4
- C. Les caisses à l’extérieur — générer 975e6934fa80

## tcf-a2j-s2-co-1 — question 17

Où faut-il déposer les audioguides ?

- A. À l’accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- B. À la cafétéria — réutiliser /lib/images/tcf/co/bg/cantine.webp
- C. Dans les salles — générer b0994714de30

## tcf-a2j-s2-co-2 — question 8

Que peut-on gagner sur Radiogen ?

- A. Des places de cinéma — générer 515615ec1cc9
- B. Des places de théâtre — générer b9c01be3f926
- C. Des places de concert — générer 12364c7f4ffd

## tcf-a2j-s2b-co-1 — question 1

À quel cours la personne n’est-elle pas venue ?

- A. Au cours de natation — générer eb82d6d99458
- B. Au cours de tennis — générer 71f949130ffe
- C. Au cours de musique — réutiliser /lib/images/tcf/co/bg/cours-musique.webp

## tcf-a2-s1-co-1 — question 1

Quel salon accueille les visiteurs ?

- A. Le salon de l’automobile — générer ef44fadd9202
- B. Le salon du livre — générer 6f475889b200
- C. Le salon de l’agriculture — générer 3faa18b043b2

## tcf-a2-s1-co-1 — question 6

Quel produit faut-il acheter pour participer ?

- A. De la lessive — réutiliser /lib/images/vocabulaire/hygiene/lessive.webp
- B. Du savon — réutiliser /lib/images/vocabulaire/hygiene/savon.webp
- C. Du shampoing — générer 5ef621f947d4

## tcf-a2-s1-co-1 — question 9

Où trouve-t-on le formulaire ?

- A. À l’entrée du magasin — générer bbb3e9f7aadb
- B. À la sortie du parking — générer 149ccf4c7d95
- C. Au bureau de poste — réutiliser /lib/images/tcf/co/bg/poste.webp

## tcf-a2-s1-co-2 — question 5

Quel type de magasin propose des promotions ?

- A. Un magasin de vêtements — réutiliser /lib/images/tcf/co/bg/magasin-vetements.webp
- B. Un magasin de sport automobile — générer 0f9f938538d2
- C. Un magasin de meubles — générer faf057560ce0

## tcf-a2-s1-co-4 — question 5

Quelle première activité est proposée ?

- A. Faire du vélo dans la forêt — générer d483a5013a3f
- B. Faire du ski en montagne — générer 4ca501145722
- C. Faire une promenade sur la plage — générer b0f59a44a94d

## tcf-a2p-s1-co-1 — question 5

Quelle activité est autorisée au musée ?

- A. Prendre des photos — réutiliser /lib/images/vocabulaire/loisirs/photographie.webp
- B. Entrer avec un sac — générer 7b6ee1bb287c
- C. Manger dans les salles — générer 3589ba082429

## tcf-a2p-s1-co-1 — question 13

Quels cours sont proposés à la piscine ?

- A. Des cours de natation — générer 9cad4a185163
- B. Des cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- C. Des cours de tennis — générer d28f860d34cc

## tcf-a2p-s1-co-3 — question 2

De quel cours Malika parle-t-elle ?

- A. Du cours de théâtre — générer edd95ce83052
- B. Du cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- C. Du cours de musique — réutiliser /lib/images/tcf/co/bg/cours-musique.webp

## tcf-a2p-s1-co-4 — question 7

Quel concert intéresse la personne ?

- A. Le concert de hip-hop — générer a3295ad3fae1
- B. Le concert de jazz — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. Le concert de rock — générer ec733f7a5103

## tcf-a2p-s1-co-4 — question 16

Quel cadeau est proposé ?

- A. Une place de concert — générer 5adf2951fa1a
- B. Un livre de recettes — générer 52806b6e76ae
- C. Une raquette de tennis — réutiliser /lib/images/vocabulaire/sports/raquette-de-tennis.webp

## tcf-a2p-s2-co-2 — question 7

Quels objets Julie demande-t-elle d’apporter ?

- A. Une brosse à dents et un pyjama — générer b2ad1f4210d4
- B. Un maillot de bain et une serviette — générer b7cd7c8d975f
- C. Un cahier et un stylo — générer bedd7c96f687

## tcf-a2p-s2-co-4 — question 13

De quel type de piscine s’agit-il ?

- A. Une piscine olympique — générer 67b026410dfd
- B. Une piscine pour bébés — générer ddb64493037c
- C. Une piscine privée — générer d91860c5d269

## tcf-a2-sa-co-1 — question 16

Quelle action est interdite aux enfants ?

- A. Nourrir les animaux — réutiliser /lib/images/vocabulaire/actions/nourrir-les-animaux.webp
- B. Regarder les animaux — générer 7c23fcabbb72
- C. Visiter le zoo — réutiliser /lib/images/tcf/co/bg/zoo.webp

## tcf-a2-sa-co-3 — question 3

Quel type de chambres souhaite-t-elle ?

- A. Des chambres doubles — générer 7df2449418dc
- B. Des chambres simples — générer cbc76cf097b1
- C. Des chambres familiales — générer 803b9d86fa1d

## tcf-a2-sa-co-3 — question 6

Quel équipement souhaite-t-elle trouver dans les chambres ?

- A. Une baignoire — réutiliser /lib/images/vocabulaire/hygiene/baignoire.webp
- B. Un ordinateur — réutiliser /lib/images/vocabulaire/technologie/ordinateur.webp
- C. Une télévision géante — générer 7df3fe96e480

## tcf-a2-sa-co-3 — question 7

Quel moyen de paiement veut-elle utiliser ?

- A. Un chèque — générer be9f5ef48c65
- B. Une carte bancaire — réutiliser /lib/images/vocabulaire/technologie/carte-bancaire.webp
- C. Des espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp

## tcf-a2-sa-co-4 — question 5

Quel commerce la personne a-t-elle trouvé fermé ?

- A. Le magasin de journaux — générer be0672cdd153
- B. La boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. La pharmacie — réutiliser /lib/images/tcf/co/bg/pharmacie.webp

## tcf-a2-sa-co-4 — question 10

Quelle sortie est proposée ?

- A. Une visite au musée d’histoire — générer e45126c896fa
- B. Une séance de cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Une sortie à la piscine — générer bd7832a7d611

## tcf-a2-sb-co-1 — question 5

Quels produits sont en promotion ?

- A. Des légumes — générer 159b7a5e2950
- B. Des fruits — réutiliser /lib/images/vocabulaire/fruits/fruit.webp
- C. Des poissons — réutiliser /lib/images/vocabulaire/aliments/poisson.webp

## tcf-a2-sb-co-1 — question 17

Que peut-on acheter au guichet ouvert ?

- A. Des places — générer 10319ff7920c
- B. Des livres — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp
- C. Des vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp

## tcf-a2-sb-co-2 — question 4

Quels objets peut-on vendre ?

- A. Des tables et des chaises — générer 12e3c4fdd3ef
- B. Des fruits et des légumes — générer b190abf23f89
- C. Des livres et des journaux — générer b2b236c246e2

## tcf-a2-sb-co-2 — question 12

Quels cadeaux peut-on gagner ?

- A. Des places de concert et des CD — générer 49a41ec64743
- B. Des vêtements et des chaussures — générer 2086536a8acb
- C. Des livres et des magazines — générer d29ba2465ee2

## tcf-a2-sb-co-4 — question 1

Quel objet la personne veut-elle acheter ?

- A. Un sac — générer b48c69f2021e
- B. Un manteau — réutiliser /lib/images/vocabulaire/vetements/manteau.webp
- C. Un chapeau — réutiliser /lib/images/vocabulaire/vetements/chapeau.webp

## tcf-a2-sb-co-4 — question 2

Entre quelles couleurs hésite-t-elle ?

- A. Le vert et le noir — générer 55b608cf002b
- B. Le bleu et le rouge — générer 64b6eddc8906
- C. Le blanc et le jaune — générer a173465c18a2

## tcf-a2-sb-co-4 — question 9

Quel dessert a-t-elle raté ?

- A. Une crème au chocolat — générer 6178a512b809
- B. Une tarte aux pommes — générer 3cfdd714bc3a
- C. Une glace à la vanille — générer c77dccbfe5a3

## tcf-a2-sc-co-1 — question 10

Où faut-il se retrouver ce soir ?

- A. Au bar de la plage — générer 65793add185f
- B. À la gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Au centre commercial — réutiliser /lib/images/tcf/co/bg/centre-commercial.webp

## tcf-a2-sc-co-1 — question 16

Que recevront les autres clients ?

- A. Un t-shirt — réutiliser /lib/images/vocabulaire/vetements/t-shirt.webp
- B. Une casquette — réutiliser /lib/images/vocabulaire/vetements/casquette.webp
- C. Un sac — générer b48c69f2021e

## tcf-a2-sc-co-4 — question 13

Quel rendez-vous a-t-il oublié ?

- A. Un déjeuner — générer 48dfc1a2e224
- B. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. Un cours — réutiliser /lib/images/tcf/co/bg/salle-classe.webp

## tcf-ss-a2-s3-co-1 — question 4

Quels produits sont offerts pour s’excuser ?

- A. Des fraises et des myrtilles — générer 7e0f83f053bd
- B. Des pommes et des poires — générer 9dd6fb9363ec
- C. Des oranges et des citrons — générer 272abc0c5fc4

## tcf-ss-a2-s3-co-1 — question 5

Où peut-on retirer le colis en semaine ?

- A. À l’accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- B. Au parking — générer b539ebfaf403
- C. À la caisse automatique — générer 6e3cc7fc8aba

## tcf-ss-a2-s3-co-2 — question 3

Quel cadeau la personne a-t-elle gagné ?

- A. Une télévision — réutiliser /lib/images/vocabulaire/technologie/télévision.webp
- B. Un ordinateur — réutiliser /lib/images/vocabulaire/technologie/ordinateur.webp
- C. Un lecteur DVD — générer c9dcae8daa9f

## tcf-ss-a2-s3-co-3 — question 3

Où se trouve le bulletin de participation ?

- A. À la caisse de la librairie — générer 07841704cdc2
- B. À la mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp
- C. À l’entrée du parking — générer 190b6defe6e6

## tcf-ss-a2-s3-co-3 — question 4

Quels légumes sont en promotion ?

- A. Les tomates et les carottes — générer 664e6729256f
- B. Les pommes de terre et les oignons — générer ab9152b575b4
- C. Les courgettes et les poivrons — générer 9ca28e999c80

## tcf-ss-a2-s3-co-3 — question 5

Quel rayon propose une dégustation ?

- A. La boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- B. La poissonnerie — générer be4f0337345c
- C. La boucherie — générer 7c83417211ed

## tcf-ss-a2-s3-co-3 — question 6

Quels produits Valérie fait-elle goûter ?

- A. Des pâtisseries — générer d9f954358d38
- B. Des fromages — réutiliser /lib/images/vocabulaire/aliments/fromage.webp
- C. Des boissons — réutiliser /lib/images/vocabulaire/boissons/boisson.webp

## tcf-ss-a2-s5b-co-2 — question 2

Dans quelle structure fera-t-elle son stage ?

- A. Une association — générer 766102c743b5
- B. Une banque — réutiliser /lib/images/tcf/co/bg/banque.webp
- C. Un restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp

## tcf-ss-a2-s7-co-3 — question 5

Quel cours madame Lenfant donnera-t-elle ?

- A. Un cours de chant — générer 2d720222e5f4
- B. Un cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- C. Un cours de dessin — réutiliser /lib/images/tcf/co/bg/cours-dessin.webp

## tcf-ss-a2-s10-co-2 — question 7

Quels événements auront lieu le soir ?

- A. Un feu d’artifice et un bal — générer 86e85a86e44d
- B. Un marché et une conférence — générer 9a90aa1ead8a
- C. Un spectacle et une exposition — générer 1825575c7b70

## tcf-ss-a2-s10-co-4 — question 3

Quels sports aimerait-il pratiquer ?

- A. La randonnée et le tennis — générer de11d68150bd
- B. La natation et le football — générer 65e74685f56e
- C. Le ski et le rugby — générer 28f6df82829c

## tcf-ss-a2-s13-co-4 — question 7

Quel autre produit envisagent-elles d’acheter ?

- A. Un parfum ou une eau de toilette — générer 8d59e0279e41
- B. Une montre ou un bracelet — générer 1bb78367b56a
- C. Un sac ou des chaussures — générer 8341a4ae3815

## tcf-ss-a2-s14-co-4 — question 1

Que cherche la personne ?

- A. La sortie du magasin — générer bc37c6957995
- B. L’entrée du musée — générer 927c808eb350
- C. La caisse du restaurant — générer 89634ece27ee

## tcf-ss-a2-s14-co-4 — question 8

Quelles couleurs compare-t-elle ?

- A. Le rouge et le bleu — générer 74547e750999
- B. Le vert et le jaune — générer 857e1b0c9ec3
- C. Le noir et le blanc — générer 994890d8e15a

## tcf-ss-a2-s15-co-4 — question 4

Vers quels lieux doivent-ils ensuite se diriger ?

- A. Les douches et les vestiaires — générer c2fa6d2094d9
- B. Le restaurant et le parking — générer 521649eaa7b7
- C. L’accueil et la salle de sport — générer 50fe7f8b7c93

## tcf-ss-a2-s15-co-4 — question 5

Que faut-il rendre au guichet en sortant ?

- A. La clé du casier — générer 6ab9db6995d8
- B. Le bonnet de bain — générer 07b2c36cc965
- C. Le ticket d’entrée — générer e0b9c553597c

## tcf-ss-a2-s16-co-3 — question 6

Sur quoi l’appartement offre-t-il une vue ?

- A. Les montagnes — réutiliser /lib/images/tcf/co/bg/montagne.webp
- B. La plage — réutiliser /lib/images/tcf/co/bg/plage.webp
- C. Un parking — générer f6145b0eb230

## tcf-ss-a2-s16-co-4 — question 1

Quel type de logement les personnes évoquent-elles notamment ?

- A. Un studio — réutiliser /lib/images/tcf/co/bg/studio.webp
- B. Une maison — réutiliser /lib/images/tcf/co/bg/maison.webp
- C. Une chambre d’hôtel — générer 43e4b7a5f622

## tcf-ss-a2-s17-co-1 — question 6

Sur quel lieu la terrasse donne-t-elle ?

- A. Un parc — réutiliser /lib/images/tcf/co/bg/parc.webp
- B. Une rue — générer c659a51b3b6b
- C. Un parking — générer f6145b0eb230

## tcf-ss-a2-s17-co-2 — question 5

Quel type de visite est organisé ?

- A. Une visite groupée — générer f1bb6bc40bf1
- B. Une visite individuelle — générer 5393aad0960a
- C. Une visite virtuelle — générer 8f3be28400db

## tcf-ss-a2-s17-co-4 — question 4

Quel transport se trouve à cinq minutes ?

- A. Une station de métro — générer 431168c87f8d
- B. Un arrêt de tramway — générer ddb782fd0887
- C. Une gare — réutiliser /lib/images/tcf/co/bg/gare.webp

## tcf-ss-a2-s18-co-1 — question 5

Que Didier apportera-t-il ?

- A. Un gâteau — réutiliser /lib/images/vocabulaire/desserts/gâteau.webp
- B. Un bouquet de tulipes — générer 4a8451a0400f
- C. Une bouteille de vin — générer a7e10b55e91a

## tcf-ss-a2-s18-co-4 — question 3

Dans quel quartier se trouve ce logement ?

- A. Le quartier de la gare — générer b45766b6645b
- B. Le quartier du port — générer ba73340b0353
- C. Le quartier de la mairie — générer bdbfb0ff2ca8

## tcf-ss-a2-s20-co-4 — question 1

Quel sandwich la personne commande-t-elle ?

- A. Un sandwich au fromage — générer 81795dce2be8
- B. Un sandwich au poulet — générer dc680a719dad
- C. Un sandwich au thon — générer 503aeb6fb2a8

## tcf-ss-a2-s21-co-1 — question 9

Où la personne a-t-elle rencontré le chanteur ?

- A. Dans un magasin de disques — générer d7d450ab3604
- B. Dans une gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Dans une salle de concert — générer 79029d6166d7

## tcf-ss-a2-s21-co-3 — question 1

À quel type de musée les visiteurs sont-ils invités ?

- A. Un musée du jeu vidéo — générer 386ebd24640c
- B. Un musée du sport — générer 2342bfcb960c
- C. Un musée de peinture — générer f84b97e2c8a8

## tcf-ss-a2-s21-co-3 — question 9

Quel équipement de sol est conseillé ?

- A. Un tapis de gym — générer 86bde69ed810
- B. Une couverture de pique-nique — générer b5e107d80468
- C. Une planche de surf — générer 801037e2d80f

## tcf-ss-a2-s21-co-3 — question 10

Quelle boisson faut-il prévoir ?

- A. Une bouteille d’eau — réutiliser /lib/images/vocabulaire/boissons/bouteille-deau.webp
- B. Une bouteille de soda — générer 95a8867c2af0
- C. Une tasse de café — générer a61bbbcb4616

## tcf-ss-a2-s22-co-4 — question 5

Quelle sortie ont-elles faite après avoir commencé à parler ?

- A. Boire un verre — générer 315d8a184179
- B. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Visiter un musée — réutiliser /lib/images/tcf/co/bg/musee.webp

## tcf-ss-a2-s23-co-2 — question 4

Quel menu est commandé ensuite ?

- A. Un menu végétarien — générer 9b58e05be793
- B. Un menu de poisson — générer 398b8e519585
- C. Un menu de viande — générer 1d3b03cdf179

## tcf-ss-a2-s23-co-3 — question 3

Quel jeu familier est notamment prévu ?

- A. Un jeu de cartes — réutiliser /lib/images/vocabulaire/loisirs/jeu-de-cartes.webp
- B. Un jeu de quilles — générer 956f38a2e193
- C. Un jeu de fléchettes — générer 5d8e88dcdcf7

## tcf-ss-a2-s24-co-1 — question 5

Que le professeur prêtera-t-il à Marine ?

- A. Un instrument — générer 14ea609043a6
- B. Un ordinateur — réutiliser /lib/images/vocabulaire/technologie/ordinateur.webp
- C. Un vélo — réutiliser /lib/images/vocabulaire/transports/velo.webp

## tcf-ss-a2-s24-co-3 — question 2

Quels accompagnements sont prévus ?

- A. Des haricots et des frites — générer a9673b0b3951
- B. Du riz et des carottes — générer 8a661393407c
- C. Des pâtes et des tomates — générer 316afbbc7004

## tcf-ss-a2-s24-co-4 — question 2

Près de quel lieu ce commerce se trouve-t-il ?

- A. Le jardin public — générer dbe3cf340967
- B. La gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Le collège — réutiliser /lib/images/tcf/co/bg/ecole.webp

## tcf-ss-a2-s24-co-4 — question 10

Quel document Camille souhaite-t-elle obtenir ?

- A. Une carte de cantine — générer f612936f5a0c
- B. Une carte de bibliothèque — générer 807259130554
- C. Une carte de transport — générer f2f5928a2522

## tcf-ss-a2-s25-co-2 — question 5

Quelle activité est proposée après le sport ?

- A. Un pique-nique dans le parc — générer 48c2e5a843f3
- B. Une séance de cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Une visite de musée — générer db5830e319ed

## tcf-ss-a2-s25-co-4 — question 7

Quels fruits Johan n’aime-t-il pas ?

- A. Les pommes et les poires — générer baea646241f5
- B. Les fraises et les bananes — générer a092565a4e3e
- C. Les oranges et les raisins — générer 33d280a8830d

## tcf-ss-a2-s25-co-4 — question 10

Quelle boisson prend-il au petit-déjeuner ?

- A. Un verre de lait — générer fc08f12c7321
- B. Un café — réutiliser /lib/images/vocabulaire/boissons/café.webp
- C. Un jus d’orange — réutiliser /lib/images/vocabulaire/boissons/jus-d-orange.webp

## tcf-ss-a2-s26-co-1 — question 13

Quel type de plats le chef expliquera-t-il ?

- A. Des plats sucrés — générer 678c50345d54
- B. Des plats de poisson — générer 176ba33a00b2
- C. Des plats de viande — générer be05d90145ae

## tcf-ss-a2-s26-co-2 — question 3

Quel type d’achat préfère-t-elle faire ?

- A. Un lave-linge d’occasion — générer 3e17288f7cab
- B. Un lave-linge neuf — générer 25da4308bce4
- C. Un sèche-linge neuf — générer b1d26f62910d

## tcf-ss-a2-s28-co-2 — question 6

Que les étudiants étrangers peuvent-ils pratiquer dans ce lieu ?

- A. La langue française — générer 7a2d432da2ff
- B. La danse classique — générer 367f5918a7b0
- C. La cuisine professionnelle — générer 3a93d564b211

## tcf-ss-a2-s28-co-3 — question 6

Quels bijoux de mariage sont cités ?

- A. Les alliances — réutiliser /lib/images/vocabulaire/accessoires/alliances.webp
- B. Les boucles d’oreilles — générer adf0b810e3b3
- C. Les bracelets — réutiliser /lib/images/vocabulaire/accessoires/bracelet.webp

## tcf-ss-a2-s28-co-3 — question 7

Quel voyage suit traditionnellement le mariage dans la liste entendue ?

- A. Le voyage de noces — générer 4b377e5f36ab
- B. Le voyage scolaire — générer 49014a9d1b2c
- C. Le voyage d’affaires — générer c2e6d297131f

## tcf-ss-a2-s29-co-1 — question 10

Quelle association scolaire est nommée à la fin de la liste d’activités ?

- A. L’association sportive scolaire — générer add5906c7ffa
- B. L’association des commerçants — générer 463d39608061
- C. L’association des voyageurs — générer d19731c2f33f

## tcf-ss-a2-s30-co-1 — question 3

Quel liquide était utilisé à l’origine ?

- A. De l’eau de mer — générer 0a8c5d6e0895
- B. Du lait — réutiliser /lib/images/vocabulaire/boissons/lait.webp
- C. Du jus de fruits — réutiliser /lib/images/vocabulaire/boissons/jus.webp

## tcf-ss-a2-s30-co-2 — question 1

Quel type de jeu utilise notamment des cartes dans la liste ?

- A. Un jeu de cartes — réutiliser /lib/images/vocabulaire/loisirs/jeu-de-cartes.webp
- B. Un jeu de piste — générer ae3bca9d9675
- C. Un jeu vidéo — réutiliser /lib/images/vocabulaire/technologie/jeu-video.webp

## tcf-ss-a2-s30-co-2 — question 10

Quel appareil est cité parmi les activités artistiques ?

- A. Un appareil photo — réutiliser /lib/images/vocabulaire/technologie/appareil-photo.webp
- B. Un appareil de chauffage — générer 4448592c3109
- C. Un appareil médical — générer 6cbba3395edf

## tcf-ss-a2-s30-co-4 — question 6

Quel objet apprend-on à fabriquer dans l’atelier évoqué ?

- A. Une ceinture — réutiliser /lib/images/vocabulaire/accessoires/ceinture.webp
- B. Une table — réutiliser /lib/images/vocabulaire/maison/table.webp
- C. Un sac — générer b48c69f2021e

## tcf-ss-a2-s31-co-3 — question 4

Qu’est-ce qui ne plaît pas aux enfants ?

- A. Lire les sous-titres — générer bffc6d7e4bff
- B. Écouter de la musique — générer 5d1772d40002
- C. Regarder des dessins animés — générer b5c34a47f4cf

## tcf-ss-a2-s32-co-2 — question 4

Quel prélèvement médical est cité ?

- A. Une prise de sang — générer ab6fc0b6143f
- B. Une prise de température du four — générer f062b9e5a5c5
- C. Une prise électrique — réutiliser /lib/images/vocabulaire/technologie/prise-electrique.webp

## tcf-ss-a2-s33-co-1 — question 6

Quels lieux de pratique sont cités ?

- A. Une salle de gym et un club de fitness — générer df4b4e2a3e33
- B. Une bibliothèque et un musée — générer 7daac2689d64
- C. Une pharmacie et un hôpital — générer 7b327f56b106

## tcf-ss-a2-s34-co-1 — question 5

Quel repas préfère-t-elle à une salade ?

- A. Un sandwich traditionnel — générer 7bb3c045c102
- B. Une pizza — réutiliser /lib/images/vocabulaire/aliments/pizza.webp
- C. Un plat de pâtes — générer 1b32a4cb5514

## tcf-ss-a2-s34-co-2 — question 6

Quel produit d’hygiène des dents est cité ?

- A. Le dentifrice — réutiliser /lib/images/vocabulaire/hygiene/dentifrice.webp
- B. Le shampoing — générer a5d1b3050d01
- C. Le déodorant — réutiliser /lib/images/vocabulaire/hygiene/déodorant.webp

## tcf-ss-a2-s34-co-2 — question 10

Quels produits de maquillage sont cités ?

- A. Le rouge à lèvres et le mascara — générer 12cb762e017d
- B. Le dentifrice et le shampoing — générer 7632936a2a74
- C. Le savon et le gel douche — générer cfea9b286af4

## tcf-ss-a2-s34-co-4 — question 5

Quelle habitude la deuxième personne aime-t-elle ?

- A. Faire la sieste — générer 4d63cbf66436
- B. Courir le soir — générer 59b8ec0b7321
- C. Boire du café la nuit — générer 07073f7441b9

## tcf-ss-a2-s37-co-1 — question 1

Quel milieu professionnel le vocabulaire concerne-t-il ?

- A. L’entreprise et le bureau — générer 7aec106de717
- B. L’hôpital — réutiliser /lib/images/tcf/co/bg/hopital.webp
- C. Le restaurant — réutiliser /lib/images/tcf/co/bg/restaurant.webp

## tcf-ss-a2-s37-co-4 — question 6

À quelle heure le train doit-il arriver à Paris ?

- A. 13 h 12 — générer c153ef81f9e4
- B. 12 h 13 — générer e5a591e159fa
- C. 14 h 12 — générer 570857dc2d46

## tcf-ss-a2-s38-co-4 — question 3

Quel moyen de transport Vincent a-t-il choisi ?

- A. Une voiture de location — générer 9ade9f49fd52
- B. Le train — réutiliser /lib/images/vocabulaire/transports/train.webp
- C. Le bus — réutiliser /lib/images/vocabulaire/transports/bus.webp

## tcf-ss-a2-s39-co-3 — question 4

Quel cadeau apporte-t-il ?

- A. Un bouquet de tulipes — générer 4a8451a0400f
- B. Une boîte de chocolats — réutiliser /lib/images/vocabulaire/desserts/boite-de-chocolats.webp
- C. Une bouteille de vin — générer a7e10b55e91a

## tcf-ss-a2-s40-co-1 — question 5

Quel groupe une autre personne veut-elle rejoindre le mardi ?

- A. Le groupe des musiciens — générer e5d0b3a7c229
- B. Le groupe des nageurs — générer 8b5fca3fca34
- C. Le groupe des randonneurs — générer 7b2906f7ceeb

## tcf-ss-a2-s40-co-1 — question 8

Quel musée peut-on visiter le week-end ?

- A. Le musée de la forêt — générer 18429c9485f7
- B. Le musée de l’automobile — générer bdc30706324f
- C. Le musée du cinéma — générer 24a750b52155

## tcf-ss-a2-s41-co-2 — question 5

Quel lieu les élèves visiteront-ils ?

- A. Un musée d’histoire naturelle — générer 7f7cc89d653d
- B. Un musée de peinture — générer f84b97e2c8a8
- C. Un château — réutiliser /lib/images/tcf/co/bg/chateau.webp

## tcf-ss-a2-s42-co-1 — question 9

Quel type de collecte est organisé ?

- A. Des produits alimentaires — générer 74516d227fdd
- B. Des vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp
- C. Des livres scolaires — générer 3a6e5659b8ed

## tcf-ss-a2-s43-co-1 — question 1

Quel menu le client commande-t-il ?

- A. Le menu végétarien — générer 425191a7ab61
- B. Le menu de poisson — générer 728e45eb011e
- C. Le menu de viande — générer 58afa9c687a4

## tcf-ss-a2-s43-co-2 — question 8

Quel arôme liquide ajoute-t-on ?

- A. De la vanille — réutiliser /lib/images/vocabulaire/epices-herbes/vanille.webp
- B. Du citron — réutiliser /lib/images/vocabulaire/fruits/citron.webp
- C. De la fleur d'oranger — générer 815a5297ed8a

## tcf-ss-a2-s43-co-3 — question 1

Quel objet fabrique-t-on dans cet atelier ?

- A. Une ceinture — réutiliser /lib/images/vocabulaire/accessoires/ceinture.webp
- B. Un portefeuille — réutiliser /lib/images/vocabulaire/argent-administration/portefeuille.webp
- C. Un sac — générer b48c69f2021e

## tcf-ss-a2-s43-co-4 — question 2

Quel monument est conseillé aux amateurs d'histoire ?

- A. L'église — réutiliser /lib/images/tcf/co/bg/eglise.webp
- B. Le théâtre — réutiliser /lib/images/tcf/co/bg/theatre.webp
- C. Le palais de justice — générer 7fc758bcecd9

## tcf-ss-a2-s43-co-4 — question 3

Quelle visite guidée est proposée ?

- A. Une visite du village — générer 62e49fa0c627
- B. Une visite de l'aquarium — générer fe32c637d29f
- C. Une visite de l'aéroport — générer 131d40179efe

## tcf-ss-a2-s44-co-4 — question 3

Quel bureau risque de fermer ?

- A. Le bureau de poste — réutiliser /lib/images/tcf/co/bg/poste.webp
- B. L'office de tourisme — générer 28494024cbf3
- C. Le commissariat — générer c0087bdfa341

## tcf-ss-a2-s45-co-2 — question 2

Quel produit la personne ne trouve-t-elle pas au début ?

- A. Le savon — réutiliser /lib/images/vocabulaire/hygiene/savon.webp
- B. Le shampoing — générer a5d1b3050d01
- C. La crème solaire — générer 140c3c1e3bdd

## tcf-ss-a2-s45-co-2 — question 5

Quel produit est recherché à la fin ?

- A. Le dentifrice — réutiliser /lib/images/vocabulaire/hygiene/dentifrice.webp
- B. Le gel douche — réutiliser /lib/images/vocabulaire/hygiene/gel-douche.webp
- C. Le rouge à lèvres — générer 6aeec9d3c6a4

## tcf-ss-a2-s47-co-4 — question 5

De quel club scolaire garde-t-elle un bon souvenir ?

- A. Du club de théâtre — générer cfae8f8ef8a6
- B. Du club de football — générer 80546e2c0710
- C. Du club de cuisine — générer e1ccad65ba39

## tcf-ss-a2-s48-co-1 — question 2

Quel cours va-t-elle suivre ?

- A. Un cours de cuisine — générer 382a0bc20dc1
- B. Un cours de danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- C. Un cours de français — réutiliser /lib/images/tcf/co/bg/cours-francais.webp

## tcf-ss-a2-s48-co-2 — question 2

Quelle activité Catherine pratique-t-elle pour sa forme ?

- A. Du sport — réutiliser /lib/images/vocabulaire/sports/sport.webp
- B. Du théâtre — générer 141068626994
- C. De la peinture — réutiliser /lib/images/vocabulaire/loisirs/peinture.webp

## tcf-ss-a2-s48-co-3 — question 9

Quels vêtements faut-il prendre ?

- A. Des vêtements adaptés pour courir — générer eda0c1f42d26
- B. Des vêtements de pluie — générer cec9cc64156e
- C. Des vêtements de fête — générer 3350954f3202

## tcf-ss-a2-s48-co-3 — question 12

Quel nouveau rayon peut-on visiter ?

- A. Le rayon BD — générer 70b962d3ba7b
- B. Le rayon cuisine — générer 3bff7b9e520a
- C. Le rayon voyage — générer 661fcce75c34

## tcf-ss-a2-s48-co-4 — question 1

Quel spectacle les élèves ont-ils vu ?

- A. Une pièce de théâtre — générer d8953c7ddfe7
- B. Un spectacle de danse — générer 0d7a86f0f057
- C. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp

## tcf-ss-a2-s49-co-3 — question 1

Où la personne doit-elle aller demain ?

- A. Au centre des impôts — générer 811561e8887c
- B. À la banque — réutiliser /lib/images/tcf/co/bg/banque.webp
- C. À l'hôpital — réutiliser /lib/images/tcf/co/bg/hopital.webp

## tcf-ss-a2-s50-co-2 — question 14

Quelle spécialité y mange-t-on ?

- A. Des crêpes — réutiliser /lib/images/vocabulaire/desserts/crêpe.webp
- B. Des pizzas — réutiliser /lib/images/vocabulaire/aliments/pizza.webp
- C. Des moules — générer b69f4b71c7b4

## tcf-ss-a2-s51-co-4 — question 1

Quel sport pratique Julien ?

- A. Le surf — générer 6d404d15dcb9
- B. Le ski — réutiliser /lib/images/vocabulaire/sports/ski.webp
- C. Le vélo — réutiliser /lib/images/vocabulaire/transports/velo.webp

## tcf-ss-a2-s52-co-3 — question 2

Où la personne doit-elle aller pour fumer ?

- A. Dehors — réutiliser /lib/images/tcf/co/bg/exterieur.webp
- B. Dans la cuisine — réutiliser /lib/images/tcf/co/bg/cuisine.webp
- C. Dans la salle d'attente — générer 78d661ecc1ef

## tcf-ss-a2-s53-co-1 — question 4

Quel autre examen le médecin a-t-il reçu ?

- A. Une radio des poumons — générer 587687fe8c4e
- B. Une radio du bras — générer ff3bcb9639f9
- C. Une radio des dents — générer d10da0d45157

## tcf-ss-a2-s54-co-1 — question 5

Qu'est-ce qui va être proposé dans une petite heure ?

- A. Une navette — générer 470cb2a06ec6
- B. Un taxi gratuit — générer bf45ab8439b9
- C. Un tram spécial — générer d1a780a1a49e

## tcf-ss-a2-s55-co-3 — question 5

À quelle heure part le train pour Perpignan ?

- A. À 12 h 02 — générer cdc85fd55649
- B. À 12 h 20 — réutiliser /lib/images/vocabulaire/heure-horloge/midi-vingt.webp
- C. À 13 h 02 — générer abcdf94a20cb

## tcf-ss-a2-s55-co-4 — question 1

Que commande la cliente ?

- A. Un café gourmand — générer 0bb260bd3a38
- B. Un thé au lait — générer 02a497468b14
- C. Un chocolat chaud — réutiliser /lib/images/vocabulaire/boissons/chocolat-chaud.webp

## tcf-ss-a2-s55-co-4 — question 2

Que demande-t-elle en plus ?

- A. Un verre d'eau — réutiliser /lib/images/vocabulaire/boissons/eau.webp
- B. Un jus d'orange — réutiliser /lib/images/vocabulaire/boissons/jus-d-orange.webp
- C. Un verre de lait — générer fc08f12c7321

## tcf-ss-a2-s57-co-3 — question 4

Dans quel bâtiment se déroule-t-il ?

- A. Au palais des congrès — générer da2e696f92ee
- B. À la mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp
- C. À l'université — réutiliser /lib/images/tcf/co/bg/universite.webp

## tcf-ss-a2-s59-co-1 — question 6

Quel type de chaussures lui conseille-t-elle ?

- A. Des chaussures de ville — générer f9e55937da20
- B. Des bottes de pluie — réutiliser /lib/images/vocabulaire/vetements/bottes-de-pluie.webp
- C. Des sandales — réutiliser /lib/images/vocabulaire/vetements/sandales.webp

## tcf-ss-a2-s60-co-1 — question 2

Quelle habitude est présentée comme mauvaise pour la santé ?

- A. Manger trop vite — générer 566a1f033da3
- B. Boire de l'eau — générer 70bcc89aceea
- C. Manger des fruits — générer 8756ca1bcc27

## tcf-ss-a2-s60-co-2 — question 1

Dans quel type de bâtiment la personne habite-t-elle ?

- A. Un immeuble moderne — générer f0288e8424aa
- B. Une maison ancienne — générer 1009f750cdaf
- C. Une ferme isolée — générer 53347b15a4ad

## tcf-ss-a2-s60-co-3 — question 5

Quel espace vert existe déjà ?

- A. Un petit parc — générer 01e51caa765d
- B. Un grand jardin botanique — générer e34e8bfa7c12
- C. Une forêt — réutiliser /lib/images/tcf/co/bg/foret.webp

## tcf-ss-a2-s60-co-3 — question 6

Quel nouvel espace un habitant propose-t-il de créer ?

- A. Un jardin urbain — générer bdf341aa0a9e
- B. Un centre commercial — réutiliser /lib/images/tcf/co/bg/centre-commercial.webp
- C. Un parking — générer f6145b0eb230

## tcf-ss-a2-s60-co-3 — question 9

Quel aménagement pour les déplacements manque selon un habitant ?

- A. Des pistes cyclables — générer c7cb7caeef10
- B. Des autoroutes — réutiliser /lib/images/vocabulaire/transports/autoroute.webp
- C. Des voies de tram — générer fbc604d258a3

## tcf-ssx-a2-annonce-1-5-co-2 — question 2

Dans quel rayon s’est-il perdu ?

- A. Au rayon fruits et légumes — générer b0d45a659810
- B. Au rayon jouets — générer c4a1f4f70317
- C. Au rayon boulangerie — générer 71457a190482

## tcf-ssx-a2-annonce-1-5-co-2 — question 3

Où attend-il ses parents ?

- A. À l’entrée du magasin — générer bbb3e9f7aadb
- B. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- C. Au parking — générer b539ebfaf403

## tcf-ssx-a2-annonce-2-6-co-2 — question 2

Que faut-il acheter pour avoir l’offre ?

- A. Une place de cinéma — générer f4cc9b221b94
- B. Un paquet de bonbons — générer c7b5c71ee5d5
- C. Une boisson — réutiliser /lib/images/vocabulaire/boissons/boisson.webp

## tcf-ssx-a2-annonce-3-3-co-2 — question 1

Quelle caisse est fermée ?

- A. La caisse prioritaire — générer 5d188b6061ab
- B. La caisse rapide — générer 514b2f2f846a
- C. La caisse automatique — générer b00b19d34c26

## tcf-ssx-a2-annonce-4-4-co-2 — question 3

Quels produits auront des surprises demain ?

- A. Les téléphones et les ordinateurs — générer 54a3e3d08965
- B. Les télévisions et les radios — générer 0de32a469787
- C. Les appareils photo — générer d97b29491bc2

## tcf-ssx-a2-annonce-6-4-co-2 — question 3

Qu’est-ce qui est offert ?

- A. Un grand café — générer 9854be24bb89
- B. Un jus d’orange — réutiliser /lib/images/vocabulaire/boissons/jus-d-orange.webp
- C. Un sandwich — réutiliser /lib/images/vocabulaire/aliments/sandwich.webp

## tcf-ssx-a2-radio-19-3-co-3 — question 1

Quel temps fait-il aujourd’hui ?

- A. Un grand soleil — générer 129be0169cbf
- B. De la pluie — réutiliser /lib/images/vocabulaire/meteo/pluie.webp
- C. De la neige — réutiliser /lib/images/vocabulaire/meteo/neige.webp

## tcf-ssx-a2-annonce-6-3-co-2 — question 1

Où se passe cette annonce ?

- A. Au salon du tourisme — générer 462528526904
- B. Dans une gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. À l’aéroport — réutiliser /lib/images/tcf/co/bg/aeroport.webp

## tcf-ssx-a2-annonce-6-3-co-2 — question 3

Quelle activité est citée ?

- A. La baignade — générer 4f5111372cb9
- B. Le ski — réutiliser /lib/images/vocabulaire/sports/ski.webp
- C. L’escalade — réutiliser /lib/images/vocabulaire/sports/escalade.webp

## tcf-ssx-a2-annonce-6-5-co-2 — question 1

Quel nouveau service est proposé ?

- A. Une laverie — générer 6c503aef9a58
- B. Une boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. Un taxi — réutiliser /lib/images/vocabulaire/transports/taxi.webp

## tcf-ssx-a2-conversation-22-co-4 — question 8

Quel objet a été prêté ?

- A. Un livre — réutiliser /lib/images/vocabulaire/ecole-bureau/livre.webp
- B. Un film — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Un disque — générer c164205e9733

## tcf-ssx-a2-conversation-32-co-4 — question 4

Quel transport choisit-elle finalement ?

- A. Le bus — réutiliser /lib/images/vocabulaire/transports/bus.webp
- B. La voiture — réutiliser /lib/images/vocabulaire/transports/voiture.webp
- C. La marche à pied — générer 547a9a5cb852

## tcf-ssx-a2-radio-17-1-co-3 — question 2

Quels sports sont conseillés aux plus sportifs ?

- A. Le vélo et la natation — générer 0cdb874c74dc
- B. Le football et le tennis — générer 93efdaf23b3c
- C. La course et le ski — générer 01c5afc068a0

## tcf-ssx-a2-radio-18-1-co-3 — question 1

Qu’est-ce qui va ouvrir ?

- A. Une fromagerie — réutiliser /lib/images/tcf/co/bg/fromagerie.webp
- B. Une boulangerie — réutiliser /lib/images/tcf/co/bg/boulangerie.webp
- C. Une boucherie — générer 59a49a38191a

## tcf-ssx-a2-radio-20-2-co-3 — question 3

Où a lieu la rencontre ?

- A. Dans la grande salle des fêtes — générer 0cacdbfb9ed5
- B. Au musée — réutiliser /lib/images/tcf/co/bg/musee.webp
- C. À la mairie — réutiliser /lib/images/tcf/co/bg/mairie.webp

## tcf-ssx-a2-annonce-1-6-co-2 — question 1

Qu’est-ce qui a été retrouvé ?

- A. Un portefeuille — réutiliser /lib/images/vocabulaire/argent-administration/portefeuille.webp
- B. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp
- C. Un sac — générer b48c69f2021e

## tcf-ssx-a2-annonce-3-5-co-2 — question 3

Qu’est-ce qui est à disposition des voyageurs ?

- A. Des films — générer 57c361aa9816
- B. Des journaux — générer c3fbdd8fc4e4
- C. Des repas — réutiliser /lib/images/vocabulaire/aliments/plateau-repas.webp

## tcf-sc-10-fete-de-la-nature-co-2 — question 3

Qu'est-ce qu'on peut acheter sur place ?

- A. Des paniers-repas — générer 3138182600b6
- B. Des assiettes — réutiliser /lib/images/vocabulaire/cuisine/assiette.webp
- C. Des tables de pique-nique — générer 8e33e56e2d89

## tcf-sc-10-fete-de-la-nature-co-2 — question 4

Que faut-il apporter ?

- A. Des assiettes et des couverts — générer e2c2f1c3028d
- B. Un sandwich et une boisson — générer 31474ff5a57c
- C. Une nappe et des chaises — générer 458991647ee2

## tcf-ssx-a2-radio-salon-du-tatouage-co-3 — question 1

Quel salon a lieu à Paris cette semaine ?

- A. Le salon du tatouage — générer 30fbb0260133
- B. Le salon de la coiffure — générer 67129606c9a1
- C. Le salon du livre — générer 6f475889b200

## tcf-ssx-a2-radio-fete-de-la-ville-co-3 — question 1

Quel événement est annoncé ?

- A. La fête de la ville — générer 12e679dd9614
- B. Un marché de Noël — réutiliser /lib/images/vocabulaire/loisirs/marche-de-noel.webp
- C. Une course à pied — générer 5a1574cc2c23

## tcf-ssx-a2-radio-fete-de-la-ville-co-3 — question 2

Où peut-on écouter des concerts ?

- A. Dans les rues — générer 0741fc6955c3
- B. Au stade — réutiliser /lib/images/tcf/co/bg/stade.webp
- C. Dans une salle de concert — générer 79029d6166d7

## tcf-ssx-a2-famille-regarder-le-foot-co-4 — question 1

Que propose l'enfant à son papa ?

- A. Regarder le foot — générer c6e11fa206c4
- B. Jouer au foot — générer 373a5f3ba8e5
- C. Aller au stade — réutiliser /lib/images/tcf/co/bg/stade.webp

## tcf-sc-15-accident-camion-co-4 — question 2

Quel véhicule a causé l'accident ?

- A. Un camion de déménagement — générer df8c111dd96e
- B. Un bus — réutiliser /lib/images/vocabulaire/transports/bus.webp
- C. Une moto — réutiliser /lib/images/vocabulaire/transports/moto.webp

## tcf-ssx-a2-famille-plat-dans-le-four-co-4 — question 4

Quel légume ne doit pas brûler ?

- A. Les courgettes — réutiliser /lib/images/vocabulaire/legumes/courgette.webp
- B. Les carottes — réutiliser /lib/images/vocabulaire/legumes/carotte.webp
- C. Les pommes de terre — générer 22800756395b

## tcf-ssx-a2-famille-film-d-action-co-4 — question 1

Que propose la première personne ?

- A. Regarder un film d'action — générer e3906dd36583
- B. Aller au cinéma — réutiliser /lib/images/tcf/co/bg/cinema.webp
- C. Regarder un match — générer ee2a17e5cfcd

## tcf-ssx-a2-annonce-cles-retrouvees-co-2 — question 2

Où faut-il aller les chercher ?

- A. À l'accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp
- B. À la caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- C. Au parking — générer b539ebfaf403

## tcf-ssx-a2-famille-pates-a-la-tomate-co-4 — question 1

Que va-t-on manger ce soir ?

- A. Des pâtes à la tomate — générer abf45c70332d
- B. Une salade de tomates — générer ffb4171c4e3e
- C. Une pizza — réutiliser /lib/images/vocabulaire/aliments/pizza.webp

## tcf-ssx-a2-transport-comment-tu-rentres-co-4 — question 3

Que lui prête Jules ?

- A. Un parapluie — réutiliser /lib/images/vocabulaire/accessoires/parapluie.webp
- B. Un ticket de bus — générer e5764664c609
- C. Une veste — réutiliser /lib/images/vocabulaire/vetements/veste.webp

## tcf-ssx-a2-famille-trouver-un-cadeau-co-4 — question 3

Que propose Martin ?

- A. Des tickets pour un match — générer f5b55684a3ff
- B. Un ballon — réutiliser /lib/images/vocabulaire/sports/ballon.webp
- C. Un maillot — réutiliser /lib/images/vocabulaire/vetements/maillot.webp

## delf-a2-2021-co-ex1-02 — question 3

Quel équipement faut-il attacher ?

- A. La ceinture — réutiliser /lib/images/vocabulaire/transports/ceinture-de-sécurité.webp
- B. Le casque — générer 50a071f76f47
- C. Les bagages — réutiliser /lib/images/vocabulaire/voyage/bagage.webp

## delf-a2-2021-co-ex1-02 — question 5

Dans quel lieu se trouve-t-on ?

- A. Un parking — générer f6145b0eb230
- B. Un musée — réutiliser /lib/images/tcf/co/bg/musee.webp
- C. Une piscine — réutiliser /lib/images/tcf/co/bg/piscine.webp

## delf-a2-2021-co-ex1-03 — question 3

À quelle heure part-il ?

- A. 9 h 10 — réutiliser /lib/images/vocabulaire/heure-horloge/neuf-heures-dix.webp
- B. 12 h 07 — générer 41b99355ace7
- C. 17 h — réutiliser /lib/images/vocabulaire/heure-horloge/dix-sept-heures.webp

## delf-a2-2021-co-ex1-03 — question 7

À quelle heure son arrivée est-elle prévue ?

- A. 12 h 07 — générer 41b99355ace7
- B. 9 h 10 — réutiliser /lib/images/vocabulaire/heure-horloge/neuf-heures-dix.webp
- C. 10 h 45 — réutiliser /lib/images/vocabulaire/heure-horloge/dix-heures-quarante-cinq.webp

## delf-a2-2021-co-ex1-03 — question 11

De quel quai partira-t-il ?

- A. Du quai A — générer c3c843a756af
- B. Du quai B — générer 7a41d5ab27a2
- C. Du quai C — générer 4d198aeabb86

## delf-a2-2021-co-ex1-04 — question 3

De quelle voie part-il ?

- A. La voie B — générer a943fdea8cf2
- B. La voie A — générer 78bea85d42ab
- C. La voie D — générer aeea7da7bfac

## delf-a2-2021-co-ex1-05 — question 3

À quel endroit l'attente est-elle trop longue ?

- A. Aux caisses du rez-de-chaussée — générer 93e03ec09330
- B. À l'entrée du parking — générer 190b6defe6e6
- C. Au rayon vêtements — générer 723dc1d4401b

## delf-a2-2021-co-ex1-08 — question 3

Quel lieu faut-il repérer ?

- A. La sortie — générer 298ed47d35a6
- B. La caisse — réutiliser /lib/images/vocabulaire/objets/caisse.webp
- C. L'accueil — réutiliser /lib/images/tcf/co/bg/secretariat.webp

## delf-a2-2021-co-ex1-08 — question 8

À quel moyen de paiement cette caisse est-elle réservée ?

- A. La carte — générer 12b16293a4cc
- B. Les espèces — réutiliser /lib/images/vocabulaire/argent-administration/especes.webp
- C. Le chèque — générer 3fdab7ee8aab

## delf-a2-2021-co-ex2-09 — question 2

Sur quels produits les réductions s'appliquent-elles ?

- A. Les produits alimentaires — générer 500c216cb3b1
- B. Les vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp
- C. Les meubles — réutiliser /lib/images/vocabulaire/maison/meubles.webp

## delf-a2-2021-co-ex3-17 — question 10

Où doit-il le prendre ?

- A. À l'entrée du bureau des réclamations — générer 9c12bc679b98
- B. Au guichet de la gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. À la sortie du magasin — générer 7be1e80fb83e

## delf-a2-2021-co-ex3-21 — question 4

Quelle activité doit-il arrêter ?

- A. Écouter de la musique — générer 5d1772d40002
- B. Regarder un film — générer 288e5a9a788e
- C. Jouer au football — générer f3686ebe2d92

## delf-a2-2021-co-ex3-23 — question 4

À quel événement l'autre personne ne peut-elle pas venir ?

- A. Une soirée — générer d3ac1e9538c1
- B. Un cours — réutiliser /lib/images/tcf/co/bg/salle-classe.webp
- C. Un voyage — réutiliser /lib/images/vocabulaire/voyage/voyage.webp

## delf-a2-2021-co-ex3-23 — question 11

Quel nouvel aménagement rend ce déplacement agréable ?

- A. Des pistes cyclables — générer c7cb7caeef10
- B. Des autoroutes — réutiliser /lib/images/vocabulaire/transports/autoroute.webp
- C. Des voies ferrées — générer b71adfb4ca1a

## delf-a2-2021-co-ex4-28 — question 1

Quels produits ne doivent pas être rangés en bas des rayons ?

- A. Les produits dangereux — générer 2434988ceb13
- B. Les produits alimentaires — générer 500c216cb3b1
- C. Les produits en promotion — générer 854cade7fbc7

## delf-a2-2021-co-ex4-29 — question 1

Quel événement est commenté ?

- A. Un mariage — réutiliser /lib/images/tcf/co/bg/mariage.webp
- B. Un anniversaire — réutiliser /lib/images/tcf/co/bg/fete-anniversaire.webp
- C. Un départ à la retraite — générer 485b546ebb03

## delf-a2-2021-co-ex4-29 — question 3

Quel accessoire fleuri est mentionné ?

- A. Un bouquet de fleurs — générer 928e1a97b862
- B. Une couronne de feuilles — générer 7cb2cc2838aa
- C. Un bracelet de pétales — générer 020819a87b81

## delf-a2-2021-co-ex4-31 — question 2

Dans quel secrétariat se trouve-t-elle d'abord ?

- A. Le secrétariat pédagogique — générer a0dee0b37d05
- B. Le secrétariat administratif — générer 29aa3b49e144
- C. Le secrétariat médical — générer 23cfe84f1cb8

## delf-a2-2021-co-ex4-31 — question 3

Vers quel secrétariat doit-elle aller ?

- A. Le secrétariat administratif — générer 29aa3b49e144
- B. Le secrétariat pédagogique — générer a0dee0b37d05
- C. Le secrétariat de la mairie — générer fee8fadefd2e

## delf-a2-2021-co-ex4-31 — question 6

Quel cadeau est proposé ?

- A. Une tablette numérique — générer ab91645dac0c
- B. Un téléphone — réutiliser /lib/images/vocabulaire/technologie/téléphone.webp
- C. Un appareil photo — réutiliser /lib/images/vocabulaire/technologie/appareil-photo.webp

## delf-a2-2021-co-ex1-34 — question 22

Où s'est-il perdu ?

- A. Au rayon des jouets — générer a7c5bfdf755a
- B. Au rayon alimentaire — générer 0ed88269b484
- C. Au parking — générer b539ebfaf403

## delf-a2-2021-co-ex1-35 — question 12

Avec quoi peut-on néanmoins entrer ?

- A. Une boisson — réutiliser /lib/images/vocabulaire/boissons/boisson.webp
- B. Un barbecue — réutiliser /lib/images/vocabulaire/loisirs/barbecue.webp
- C. Un panier-repas — générer 8a7b66b34725

## delf-a2-2021-co-ex2-38 — question 3

Où les artistes exposent-ils leurs œuvres ?

- A. Sous la grande tente — générer d11a29886aa8
- B. Dans la gare — réutiliser /lib/images/tcf/co/bg/gare.webp
- C. Dans le parc — réutiliser /lib/images/tcf/co/bg/parc.webp

## delf-a2-2021-co-ex2-38 — question 6

Quel type de magasin est Rozam ?

- A. Un magasin de jardinage — générer d4d9d52b48f3
- B. Un magasin de vêtements — réutiliser /lib/images/tcf/co/bg/magasin-vetements.webp
- C. Un magasin de musique — générer 2e5bf7d262f0

## delf-a2-2021-co-ex3-39 — question 3

Quels objets a-t-il retrouvés ?

- A. Les clés et le badge — générer 5c98fffad252
- B. Le téléphone et le portefeuille — générer 0ac701e8666e
- C. Les lunettes et le sac — générer a279c81fbba7

## delf-a2-2021-co-ex3-41 — question 5

Quel cadeau Marc a-t-il choisi ?

- A. Une cafetière — réutiliser /lib/images/vocabulaire/electromenager/cafetiere.webp
- B. Une tablette numérique — générer ab91645dac0c
- C. Une montre — réutiliser /lib/images/vocabulaire/accessoires/montre.webp

## delf-a2-2021-co-ex4-42 — question 10

Quel spectacle vont-elles voir ?

- A. Un film — réutiliser /lib/images/tcf/co/bg/cinema.webp
- B. Un concert — réutiliser /lib/images/tcf/co/bg/concert.webp
- C. Une pièce de théâtre — générer d8953c7ddfe7

## delf-a2-2021-co-47 — question 8

Quelle préférence alimentaire la question 9 demande-t-elle ?

- A. Le plat préféré — générer a30071aec873
- B. La boisson préférée — générer 8c47eb676894
- C. Le dessert préféré — générer 233b936ec1ec

## tcf-ss-b1-s1-co-1 — question 9

Où faut-il déposer le bulletin de concours rempli ?

- A. Dans la boîte à la sortie du magasin — générer 0c34d452726a
- B. Au rayon informatique — générer ec8bb215ef52
- C. À l'entrée du parking — générer 190b6defe6e6

## tcf-ss-b1-s2-co-2 — question 1

De quoi parle cette annonce ?

- A. Des légumes bio — générer 6b5010f2253d
- B. Des voitures — réutiliser /lib/images/vocabulaire/transports/voiture.webp
- C. Des vêtements — réutiliser /lib/images/vocabulaire/vetements/vetements.webp

## tcf-ss-b1-s3-co-1 — question 4

Que doivent fermer les parents pendant la journée ?

- A. Les volets — réutiliser /lib/images/vocabulaire/maison/volet.webp
- B. Les robinets — réutiliser /lib/images/vocabulaire/hygiene/robinet.webp
- C. Les portes du réfrigérateur — générer fad32162d8cc

## tcf-ss-b1-s3-co-1 — question 8

Quel vêtement Madame Thierry met-elle sur la tête de sa petite fille ?

- A. Un chapeau en toile — générer 7ba67fd6ded6
- B. Un bonnet en laine — générer 6f025960254b
- C. Un casque de vélo — générer 6b018e889cae

## tcf-ss-b1-s3-co-2 — question 4

Quel repas français a été inscrit au patrimoine Unesco ?

- A. Le repas gastronomique français — générer f540e0b4a51a
- B. La baguette — réutiliser /lib/images/vocabulaire/aliments/baguette.webp
- C. Le fromage — réutiliser /lib/images/vocabulaire/aliments/fromage.webp

## tcf-ss-b1-s5-co-4 — question 8

Quel outil permet de réaliser l'œuvre collective ?

- A. Des ordinateurs reliés à une table de dessin — générer b8e3c0acfc06
- B. Des appareils photo jetables — générer dff3ca430742
- C. Des instruments de musique — générer 8f3006705008

## tcf-ss-b1-s6-co-1 — question 1

Quel type de parc est annoncé ?

- A. Un parc d'attractions — réutiliser /lib/images/tcf/co/bg/parc-attractions.webp
- B. Un parc naturel — générer f7e209d1e226
- C. Un parc aquatique — générer 4a68246d2aef

## tcf-ss-b1-s6-co-1 — question 10

Où a lieu le spectacle « Show et lumière » ?

- A. Au bord du lac — réutiliser /lib/images/tcf/co/bg/lac.webp
- B. À l'entrée du parking — générer 190b6defe6e6
- C. Dans la cafétéria — réutiliser /lib/images/tcf/co/bg/cantine.webp

## tcf-ss-b1-s7-co-2 — question 1

De quel type de jeu vidéo parle-t-on ?

- A. Un jeu de football — générer 12be397fdce1
- B. Un jeu de course — générer 900b44bd6c94
- C. Un jeu de stratégie — générer 33cadc784399

## tcf-ss-b1-s7-co-4 — question 8

À quel atelier Théo participe-t-il ?

- A. L'atelier théâtre — générer ad5f5ee754d1
- B. L'atelier chant — générer e86658ac6ca0
- C. L'atelier karaté — générer 8db629d5ee8e

## tcf-ss-b1-s9-co-3 — question 5

Quelles boîtes faut-il aussi éviter selon le document ?

- A. Les boîtes rayées, fondues ou décolorées — générer 7f9ae76f1f04
- B. Les boîtes en verre intactes — générer 82119570159e
- C. Les boîtes neuves en acier inoxydable — générer c1bd71aa0d80

## tcf-ss-b1-s9-co-3 — question 8

Que conseille le document pour remplacer un film plastique comme couvercle ?

- A. Une assiette retournée — générer 1737eb9dc5b0
- B. Une feuille de PVC chauffée — générer e3c9243c8b01
- C. Un moule en silicone plié — générer 8296abcc6745

## tcf-ss-b1-s11-co-1 — question 10

Dans quels établissements des chats sont-ils adoptés pour apaiser les résidents ?

- A. Des maisons de retraite — générer 11b873fbccdd
- B. Des gares ferroviaires — générer 20911f290515
- C. Des centres commerciaux — générer 83d2d7f8a7da

## tcf-ss-b1-s11-co-2 — question 6

Dans Une sirène à Paris, qui est Lula ?

- A. Une sirène — réutiliser /lib/images/vocabulaire/autre/sirène.webp
- B. Une journaliste — générer d28f9890df7c
- C. Une professeure — réutiliser /lib/images/vocabulaire/metiers/professeure.webp

## tcf-ss-b1-s12-co-2 — question 5

Qu'est-ce qui manquait à M. Pokora ?

- A. La danse — réutiliser /lib/images/tcf/co/bg/salle-de-danse.webp
- B. Le théâtre — réutiliser /lib/images/tcf/co/bg/theatre.webp
- C. Les films futuristes — générer 3d105cd93a22

## tcf-ss-b1-s12-co-4 — question 2

Quel lieu a éveillé son envie de faire ce métier à l'adolescence ?

- A. L'atelier d'une amie couturière de sa mère — générer 584d2077f332
- B. Une usine automobile — générer b44b6b44b1a1
- C. Une salle de cinéma — générer f1d1fda7e042

## tcf-ss-b1-s14-co-4 — question 7

Quelle activité est proposée au début de l'appel ?

- A. Courir autour du lac — générer 8c9092e48342
- B. Faire de la natation — générer d7cd71fc768f
- C. Jouer au tennis — générer 26876e2318ce

