# Activités créatives et manuelles (ACM)

Dans le générateur, choisir **ACM**, puis un **Thème** et une **Activité**. Le catalogue se trouve dans `activities.json`. Chaque fiche indique le matériel, le temps de travail et les consignes numérotées. Pour la pâte à sel et les activités peintes, prévoir le temps de séchage en plus.

Le catalogue compte **210 activités**. Le quilling, le paper layering, les cartes pop-up, la pâte à sel, les créations saisonnières, la perspective, l’ombrage, la peinture et les paysages en papier déchiré ont chacun vingt activités. Le thème Peinture couvre la gouache, l’aquarelle, la peinture au tampon et les empreintes. Le catalogue propose aussi dix activités de dessin au crayon, dix de collage et dix d’origami.

## Photos d’étape

Chaque entrée de `stepImages` correspond à la consigne de même position dans `steps`. Les photos déjà intégrées restent en place. Les entrées avec un champ `brief` affichent **Photo à générer** avec la description du geste ou de l’état à photographier. Les pages gardent la numérotation des étapes et la liste du matériel figure sur la première page.

Les dix fiches d’origami, les dix fiches de dessin au crayon et les dix fiches de collage ont maintenant une image à chaque étape. Dix fiches de peinture sur vingt sont entièrement illustrées. Les descriptions des autres photos à produire figurent dans `activities.json`.

Pour une nouvelle série, choisir une lumière naturelle diffuse et garder le même matériel, les mêmes couleurs et les mêmes mains d’une étape à l’autre. Un fond mat ivoire convient quand le plan de travail aide à comprendre la prise de vue. Pour l’origami, les cartes pop-up et les autres réalisations qui se lisent seules, le fond peut être transparent. Centrer le pliage ou l’objet dans le cadre et laisser une marge pour voir les bords, les pointes et les rabats. Garder les mains ou le support dans le cadre quand ils expliquent le geste.

Privilégier la vue de dessus pour les tracés, découpes et plis. Passer à une vue oblique pour montrer l’épaisseur, un mécanisme ou une ombre portée. Garder le même type de fond et les mêmes repères au long d’une série. Montrer l’état exact décrit dans la fiche. La dernière vue présente le résultat de cette même série.

- Utiliser des photos réelles ou des images au rendu photographique en format raster. Pour un fond transparent, conserver le canal alpha à l’export WebP.
- Pour l’origami et tout autre pliage, associer une image distincte à chaque geste. Montrer les coins à rabattre, l’orientation du papier, les ouvertures et les retournements dans l’ordre. Garder le même papier et le même cadrage dans toute la série. Pour l’éventail, prévoir une vue par pli successif.
- Quand le sens du pli est difficile à lire, superposer une flèche à la photo qui précède le geste. La flèche part du bord ou de la pointe à déplacer et indique où la ramener. Le repère « Pli suivant » indique que la photo montre l’état de départ. Dans `nextFold`, noter `from` et `to` en pourcentages depuis le coin supérieur gauche de la photo et `ratio` comme largeur divisée par hauteur. Revoir le tracé si le cadrage de la photo change.
- Pour la peinture, le collage et le dessin, montrer les gestes utiles et le résultat réel ou réaliste de la même réalisation. Utiliser les matériaux indiqués dans la fiche.
- Pour intégrer une photo validée, la placer en WebP sous `public/lib/images/acm` et remplacer le `brief` de l’étape par `src` et `alt`. Garder la photo à la même position. Créditer les photos externes et vérifier la licence de réutilisation. Tester l’aperçu et l’impression après intégration.

## Sources d’inspiration

- Pliages traditionnels et gobelet en papier. [Origami Guide](https://origami.guide/howto/origami-step-by-step/), [Japan Society](https://www.japansociety.org.uk/rsn/lessons/resources/RSN-Resources-OrigamiCup.pdf).
- Série de photos d’un avion en papier à comparer avec la fiche avant toute réutilisation. [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Files_by_ABF/How_to_build_a_paper_airplane).
- Observation de la nature et techniques d’impression. [ASU Art Museum](https://asuartmuseum.org/wp-content/uploads/2022/09/asu_art_museum-art_artist_resources-stamping_with_nature.pdf), [Peabody Essex Museum](https://www.pem.org/virtual-art-activities).
- Composition avec des formes de papier découpées. [National Gallery of Art](https://www.nga.gov/educational-resources/art-tales-pre-k/art-tales-henri-matisse).
- Construction des valeurs, du volume et des ombres au crayon. [Getty](https://www.getty.edu/education/teachers/classroom_resources/tips_tools/downloads/exploring_value.pdf).
