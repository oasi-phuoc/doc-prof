type Scene = {
  src: string
  caption: string
  alt: string
  description?: string
  exampleIndex?: number
}

export const falcVisualPlans: Readonly<Record<string, Scene[] | undefined>> = {
  modaux: [
    { caption: 'Je peux partir', alt: 'Asami range ses cahiers. L’enseignant tient la porte ouverte et lui indique qu’elle peut partir.', src: '/lib/images/grammaire/theorie/ranger-ses-cahiers-en-fin-de-cours.webp' },
    { caption: 'Je dois partir', alt: 'Asami a rangé ses cahiers. Elle consulte son agenda avant de partir à son rendez-vous.', src: '/lib/images/grammaire/theorie/consulter-son-agenda-avant-de-partir.webp' },
  ],
  pronominaux: [
    { caption: 'Je parle de moi', alt: 'Kenza ajuste le col de son pull devant le miroir. Son amie en bleu l’écoute près de la porte.', src: '/lib/images/grammaire/theorie/kenza-se-prepare-devant-le-miroir.webp' },
    { caption: 'Je parle à mon amie', alt: 'L’amie de Kenza ajuste sa veste bleue devant le miroir. Kenza lui parle depuis la porte.', src: '/lib/images/grammaire/theorie/lamie-de-kenza-se-prepare.webp' },
  ],
  a9: [
    { caption: 'Jamais', alt: 'Un homme va au travail à vélo. Il longe la rue sur la piste cyclable.', src: '/lib/images/grammaire/theorie/aucun-trajet-en-bus.webp' },
    { caption: 'Plus', alt: 'Une femme marche sur le trottoir. Derrière elle, un autre voyageur monte dans le bus.', src: '/lib/images/grammaire/theorie/plus-de-trajets-en-bus.webp' },
  ],
  c3: [
    { caption: 'Un bus', alt: 'À l’arrêt, un voyageur parle à une conductrice. Un bus s’approche derrière eux.', src: '/lib/images/grammaire/communication/plan-du-reseau-a-larret.webp' },
    { caption: 'Une ligne', alt: 'À l’arrêt, l’employée montre la ligne rouge sur un plan de bus. Une ligne bleue est aussi visible.', src: '/lib/images/grammaire/theorie/plan-de-deux-lignes-de-bus.webp' },
  ],
  c4: [
    { caption: 'Je donne une information', alt: 'Dans la salle de sport, Esteban montre la pièce à son ami. Son visage reste calme.', src: '/lib/images/grammaire/theorie/indiquer-la-grande-salle.webp' },
    { caption: 'Je montre ma surprise', alt: 'Dans la même salle, Esteban regarde le plafond très haut et ouvre les mains, étonné.', src: '/lib/images/grammaire/theorie/setonner-devant-la-grande-salle.webp' },
  ],
  d1: [
    { caption: 'Du vélo', alt: 'Une femme porte un casque et roule à vélo sur une piste dans un parc.', src: '/lib/images/tcf/qcm-audit/grammaire-randonnee-a-velo.webp' },
    { caption: 'De la danse', alt: 'Quatre adultes font le même pas de danse dans une salle de cours.', src: '/lib/images/tcf/qcm-audit/grammaire-cours-de-danse-fitness.webp' },
  ],
  d2: [
    { caption: 'Amina lave le vélo', alt: 'Amina frotte le guidon du vélo avec une éponge.', src: '/lib/images/grammaire/theorie/laver-le-velo.webp' },
    { caption: 'Amina se lave', alt: 'Au lavabo, Amina applique de la mousse sur ses joues avec ses mains.', src: '/lib/images/grammaire/theorie/se-laver-le-visage-au-lavabo.webp' },
  ],
  d3: [
    { caption: 'Avec toi', alt: 'Léonie en manteau jaune marche à côté de Nico et lui parle.', src: '/lib/images/grammaire/theorie/marcher-avec-son-ami.webp' },
    { caption: 'Moi', alt: 'Léonie reste assise sur un banc et pose la main sur sa poitrine. Nico franchit la porte.', src: '/lib/images/grammaire/theorie/rester-sur-le-banc.webp' },
  ],
  e7: [
    { caption: 'Vers le marché', alt: 'Une femme avec un sac vide se dirige vers l’étal de fruits et légumes.', src: '/lib/images/grammaire/theorie/trajet-vers-le-marche.webp' },
    { caption: 'De retour du marché', alt: 'La même femme s’éloigne de l’étal. Son sac contient des carottes et des légumes.', src: '/lib/images/grammaire/theorie/trajet-du-marche-vers-la-maison.webp' },
  ],
  e4: [
    { caption: 'Souvent', alt: 'Sora met un pied sur la marche du bus. Elle porte son sac de travail.', src: '/lib/images/grammaire/theorie/trajets-en-bus-souvent.webp', description: 'Quand elle travaille loin, Sora prend le bus cinq jours par semaine.' },
    { caption: 'Rarement', alt: 'Sora marche sur le trottoir à côté du bus. Les portes du bus sont fermées.', src: '/lib/images/grammaire/theorie/trajets-en-bus-rarement.webp', description: 'Quand elle travaille près de chez elle, Sora marche. Elle prend le bus quelques fois par mois.' },
  ],
  e5: [
    { caption: 'D’abord', alt: 'Un homme en pull bleu ouvre la porte. La pièce derrière lui est sombre.', src: '/lib/images/grammaire/theorie/ouvrir-la-porte-de-la-piece.webp' },
    { caption: 'Ensuite', alt: 'Le même homme appuie sur l’interrupteur. La lampe de la pièce est allumée.', src: '/lib/images/grammaire/theorie/allumer-la-lumiere-dans-la-piece.webp' },
  ],
  f2: [
    { caption: 'Demander un service', alt: 'Une visiteuse s’adresse à un homme près de la porte fermée. Elle lui montre la porte.', src: '/lib/images/grammaire/theorie/demander-douvrir-une-porte.webp' },
    { caption: 'Dire ce qu’il faut faire', alt: 'Un employé tient la porte ouverte. Sa collègue lui montre la poignée.', src: '/lib/images/grammaire/theorie/demander-de-fermer-une-porte.webp' },
  ],
  f3: [
    { caption: 'Je dis oui', alt: 'Daniela invite sa collègue à manger. Sa collègue arrive avec sa boîte et s’apprête à s’asseoir.', src: '/lib/images/grammaire/theorie/accepter-linvitation-au-repas.webp', exampleIndex: 1 },
    { caption: 'Je dis non', alt: 'Daniela propose de manger ensemble. Sa collègue garde sa boîte et montre le bureau où elle va travailler.', src: '/lib/images/grammaire/theorie/decliner-linvitation-au-repas.webp', exampleIndex: 2 },
  ],
  f5: [
    { caption: 'Dire qui est présent', alt: 'Un homme en chemise verte se tient devant une porte bleue, sur le palier.', src: '/lib/images/grammaire/theorie/remarquer-un-homme-devant-la-porte.webp' },
    { caption: 'Dire qui c’est', alt: 'Sur le même palier, une femme fait un geste vers son voisin en chemise verte pour le présenter.', src: '/lib/images/grammaire/theorie/presenter-son-voisin-sur-le-palier.webp' },
  ],
  f6: [
    { caption: 'Mon sac', alt: 'Au bureau des objets trouvés, une femme pose la main sur son sac bordeaux.', src: '/lib/images/grammaire/theorie/montrer-son-sac-aux-objets-trouves.webp' },
    { caption: 'Ma clé', alt: 'Au même comptoir, la femme montre sa clé à l’employée.', src: '/lib/images/grammaire/theorie/montrer-sa-cle-aux-objets-trouves.webp' },
  ],
  f7: [
    { caption: 'Un sac lourd', alt: 'Un voyageur plie les genoux pour soulever un gros sac bleu à deux mains. Son visage montre l’effort.', src: '/lib/images/grammaire/theorie/soulever-un-sac-lourd.webp' },
    { caption: 'Une valise lourde', alt: 'Une voyageuse soulève une grande valise bordeaux à deux mains. La valise a des roulettes.', src: '/lib/images/grammaire/theorie/soulever-une-valise-lourde.webp' },
  ],
  f8: [{ caption: 'Infirmière', alt: 'Salma, infirmière, utilise un appareil pour prendre la tension du patient.', src: '/lib/images/tcf/qcm-audit/vocab-infirmiere.webp' }],
  f9: [
    { caption: 'Plus lourd', alt: 'Le plateau de la balance qui porte le sac vert descend plus bas que celui du sac gris.', src: '/lib/images/grammaire/theorie/sac-vert-plus-lourd.webp' },
    { caption: 'Moins lourd', alt: 'Le plateau de droite porte le sac gris. Il est plus haut que celui du sac vert.', src: '/lib/images/grammaire/theorie/sac-gris-moins-lourd.webp' },
  ],
  f12: [
    { caption: 'Une petite salle', alt: 'Dans une salle étroite, deux chaises entourent une table.', src: '/lib/images/grammaire/theorie/observer-une-petite-salle-de-cours.webp' },
    { caption: 'Une salle claire', alt: 'La lumière entre par la grande fenêtre et éclaire les tables.', src: '/lib/images/grammaire/theorie/observer-une-salle-de-cours-claire.webp' },
  ],
  f13: [
    { caption: 'Le plus léger', alt: 'Trois sacs côte à côte sur un comptoir. Ils sont gris, vert et bordeaux.', src: '/lib/images/grammaire/theorie/trois-sacs-trois-poids.webp', description: 'Le sac gris pèse 2 kg, le vert 4 kg et le bordeaux 7 kg.' },
    { caption: 'La moins chère', alt: 'Dans une boutique, trois valises sur roulettes sont alignées. La valise verte est au milieu.', src: '/lib/images/grammaire/theorie/trois-valises-trois-prix.webp', description: 'La valise orange coûte 75 CHF, la verte 49 CHF et la bleue 89 CHF.' },
  ],
  f14: [
    { caption: 'Plus de livres', alt: 'Lina montre ses quatre livres. Devant Paul, la pile ne contient que deux livres.', src: '/lib/images/grammaire/theorie/comparer-deux-piles-de-livres.webp' },
    { caption: 'Lire plus souvent', alt: 'Assise près de Paul, Lina lit un livre rouge. Paul boit un thé et son livre est fermé.', src: '/lib/images/grammaire/theorie/comparer-les-moments-de-lecture.webp', description: 'Cette semaine, Lina lit cinq jours. Paul lit deux jours.' },
  ],
  'description-physique': [
    { caption: 'Des cheveux bouclés', alt: 'Ana a des cheveux bruns. Des boucles encadrent son visage.', src: '/lib/images/grammaire/theorie/portrait-de-cheveux-boucles.webp' },
    { caption: 'Des yeux marron', alt: 'Gros plan sur deux yeux aux iris marron.', src: '/lib/images/tcf/qcm-audit/qcm-delf100-yeux-marron.png' },
  ],
  f10: [
    { caption: 'Conseiller de se reposer', alt: 'Un homme se frotte le front. Sa collègue lui indique un fauteuil libre.', src: '/lib/images/grammaire/theorie/conseiller-a-un-collegue-de-se-reposer.webp' },
    { caption: 'Proposer de prendre le bus', alt: 'Près de la gare, un homme montre l’arrêt de bus à une voyageuse.', src: '/lib/images/tcf/co/scenes/reprises/dialogue-train-absent-prendre-bus.png' },
  ],
  f11: [
    { caption: 'Dire ce qui se passe', alt: 'Tom tient la poignée et ferme la porte. Son ami Jules regarde ce qu’il fait.', src: '/lib/images/grammaire/theorie/observer-un-ami-fermer-la-porte.webp' },
    { caption: 'Donner une consigne', alt: 'La porte est ouverte. Jules la montre à son ami Tom, qui l’écoute.', src: '/lib/images/grammaire/theorie/demander-a-un-ami-de-fermer-la-porte.webp' },
  ],
  g1: [
    { caption: 'Un citron', alt: 'Issa parle à la vendeuse devant une caisse de citrons. Il ne désigne aucun fruit en particulier.', src: '/lib/images/grammaire/theorie/demander-un-citron-au-marche.webp' },
    { caption: 'Une pomme', alt: 'Au même étal, Issa demande une pomme. Plusieurs pommes sont dans la caisse.', src: '/lib/images/grammaire/theorie/demander-une-pomme-au-marche.webp' },
  ],
  g2: [
    { caption: 'Une tasse sur la table', alt: 'Une femme regarde la tasse bleue posée devant elle sur la table.', src: '/lib/images/grammaire/theorie/reperer-une-tasse-sur-la-table.webp' },
    { caption: 'La tasse dont on parle', alt: 'La même femme prend la tasse bleue par son anse.', src: '/lib/images/grammaire/theorie/prendre-la-tasse-bleue.webp' },
  ],
  g4: [
    { caption: 'Compter les pommes', alt: 'Trois pommes rouges sont alignées sur une table, avec un espace entre chaque pomme.', src: '/lib/images/grammaire/theorie/compter-trois-pommes.webp' },
    { caption: 'Peser les pommes', alt: 'Des pommes rouges sont posées dans le plateau d’une balance au marché.', src: '/lib/images/grammaire/theorie/peser-les-pommes-au-marche.webp' },
  ],
  g5: [
    { caption: 'Quelques pommes', alt: 'Hana tient trois pommes ensemble au-dessus d’une caisse pleine.', src: '/lib/images/grammaire/theorie/prendre-quelques-pommes.webp' },
    { caption: 'Chaque pomme', alt: 'Hana tient une seule pomme dans la main pour l’examiner. Les autres restent dans la caisse.', src: '/lib/images/grammaire/theorie/prendre-les-pommes-une-a-une.webp' },
  ],
  g6: [
    { caption: 'Du pain', alt: 'Un homme mange une tranche de pain. Le reste de la miche est posé sur la table.', src: '/lib/images/grammaire/theorie/manger-une-tranche-de-pain.webp' },
    { caption: 'Du marché', alt: 'Une femme s’éloigne du marché avec son sac de légumes.', src: '/lib/images/grammaire/theorie/trajet-du-marche-vers-la-maison.webp' },
  ],

  h1: [
    { caption: 'Aujourd’hui', alt: 'Une voyageuse pose le pied sur la marche d’un bus dont la porte est ouverte. C’est le trajet d’aujourd’hui.', src: '/lib/images/grammaire/theorie/monter-dans-le-bus-du-quartier.webp' },
    { caption: 'Hier', alt: 'On retrouve la même voyageuse qui monte dans le bus. Cette fois, la phrase parle du trajet d’hier.', src: '/lib/images/grammaire/theorie/monter-dans-le-bus-du-quartier.webp' },
  ],
  h3: [
    { caption: 'Lina arrive', alt: 'Lina franchit seule la porte bleue d’une salle de cours.', src: '/lib/images/grammaire/theorie/entrer-seule-en-classe.webp' },
    { caption: 'Lina et Sara arrivent', alt: 'Lina et Sara franchissent la même porte, l’une derrière l’autre.', src: '/lib/images/grammaire/theorie/entrer-a-deux-en-classe.webp' },
  ],
  h4: [
    { caption: 'La situation avant', alt: 'Un immeuble aux volets verts est séparé du quai de la gare par un trottoir et une clôture.', src: '/lib/images/grammaire/theorie/habiter-pres-de-la-gare.webp' },
    { caption: 'Chaque matin', alt: 'Le matin, une voyageuse tient sa boîte de repas et regarde dehors depuis le bus.', src: '/lib/images/grammaire/theorie/le-bus-chaque-matin.webp' },
  ],
  h5: [{ caption: 'Le bus est parti avant', alt: 'Un voyageur vient d’arriver à l’abri. Au bout de la rue, il voit le bus s’éloigner.', src: '/lib/images/grammaire/theorie/bus-deja-parti-avant-huit-heures.webp', description: 'Le bus est parti avant 8 heures. Le voyageur arrive à 8 heures.' }],
  h6: [
    { caption: 'Samira sort', alt: 'Samira sort de la boulangerie. Ses mains sont vides.', src: '/lib/images/grammaire/theorie/sortir-de-la-boulangerie.webp' },
    { caption: 'Samira sort le pain', alt: 'Samira porte le pain de la boulangerie jusqu’à une table dehors.', src: '/lib/images/grammaire/theorie/porter-le-pain-sur-la-terrasse.webp' },
  ],
  h7: [
    { caption: 'Une personne se lève', alt: 'Au lever du jour, Lina s’assoit au bord du lit. Elle pose les pieds par terre.', src: '/lib/images/grammaire/theorie/se-lever-seule-le-matin.webp' },
    { caption: 'Deux personnes se lèvent', alt: 'Dans la même chambre, Lina est debout. La personne à ses côtés se redresse au bord du lit.', src: '/lib/images/grammaire/theorie/se-lever-a-deux-le-matin.webp' },
  ],
  h8: [
    { caption: 'L’attente', alt: 'Un homme reste sous l’abri et regarde la rue. Aucun bus ne vient encore.', src: '/lib/images/grammaire/theorie/attendre-sous-labri-de-bus.webp' },
    { caption: 'L’arrivée du bus', alt: 'L’homme est toujours sous le même abri. Un bus bleu et blanc arrive.', src: '/lib/images/grammaire/theorie/voir-le-bus-arriver-a-larret.webp' },
  ],
  i2: [
    { caption: 'Mon sac', alt: 'Au comptoir des objets trouvés, Jorge désigne son sac bleu.', src: '/lib/images/grammaire/theorie/reconnaitre-son-sac.webp' },
    { caption: 'Ma clé', alt: 'Au même comptoir, Jorge tient sa clé en l’air pour la montrer à l’employé.', src: '/lib/images/grammaire/theorie/reconnaitre-sa-cle.webp' },
  ],
  i3: [
    { caption: 'Ce sac', alt: 'Dans la boutique, la cliente montre le sac vert sur le comptoir.', src: '/lib/images/grammaire/theorie/montrer-un-sac-au-comptoir.webp' },
    { caption: 'Cette valise', alt: 'Dans la même boutique, la cliente montre une valise orange à roulettes.', src: '/lib/images/grammaire/theorie/montrer-une-valise-au-comptoir.webp' },
  ],
  i4: [{ caption: 'Le bus puis « le »', alt: 'Une femme en veste mauve montre le bus à son interlocutrice.', src: '/lib/images/grammaire/theorie/indiquer-le-bus-que-je-prends.webp' }],
  i5: [{ caption: 'Parler à Samir', alt: 'Un homme en pull bleu parle à Samir. Samir porte une veste verte et le regarde.', src: '/lib/images/grammaire/theorie/parler-a-samir-devant-le-centre.webp' }],
  i7: [
    { caption: 'Revenir du marché', alt: 'La femme revient du marché. Elle emporte un sac rempli de légumes.', src: '/lib/images/grammaire/theorie/trajet-du-marche-vers-la-maison.webp' },
    { caption: 'Aller au marché', alt: 'Une femme avec un sac vide se dirige vers l’étal de fruits et légumes.', src: '/lib/images/grammaire/theorie/trajet-vers-le-marche.webp' },
  ],

  j1: [{ caption: 'Maintenant', alt: 'Un bébé dort dans son lit. À la porte, une adulte porte un doigt à ses lèvres.', src: '/lib/images/grammaire/theorie/signe-de-parler-doucement.webp' }],
  j2: [{ caption: 'Il y a un instant', alt: 'À l’arrêt, un voyageur regarde le bus qui s’éloigne sur la route.', src: '/lib/images/grammaire/theorie/voir-le-bus-qui-vient-de-partir.webp' }],
  j3: [{ caption: 'Deux actions en même temps', alt: 'Nadia mélange des légumes dans un saladier. Deux notes près de la radio montrent qu’elle est allumée.', src: '/lib/images/grammaire/theorie/ecouter-la-radio-en-cuisinant.webp' }],
  j4: [
    { caption: 'Un projet pour ce soir', alt: 'Seul dans sa cuisine, Luan regarde les légumes entiers sur le plan de travail.', src: '/lib/images/grammaire/theorie/preparer-le-repas-de-ce-soir.webp' },
    { caption: 'Un projet avec d’autres', alt: 'Dans la même cuisine, deux personnes regardent les légumes qu’elles vont préparer ensemble.', src: '/lib/images/grammaire/theorie/prevoir-de-cuisiner-ensemble.webp' },
  ],
  o2: [{ caption: 'D’abord le repas, ensuite le départ', alt: 'Devant la porte, deux adultes enfilent leurs vestes. Leurs assiettes sont vides.', src: '/lib/images/grammaire/theorie/repas-termine-avant-le-depart.webp', description: 'Le repas se termine d’abord. Ensuite, les deux personnes partent.' }],
  o3: [{ caption: 'S’il pleut, prendre le bus', alt: 'Sous un parapluie rouge, une femme et un homme s’apprêtent à monter dans le bus. La pluie tombe autour d’eux.', src: '/lib/images/grammaire/theorie/si-pluie-alors-bus.webp' }],
  j6: [{ caption: 'L’action reste la même', alt: 'Deux pompiers posent une barrière rouge et blanche en travers d’une rue.', src: '/lib/images/grammaire/theorie/fermer-la-route-avec-une-barriere.webp' }],
  j7: [
    { caption: 'Les paroles de Lina', alt: 'Lina tient son sac rouge et lève la main en parlant à sa collègue.', src: '/lib/images/grammaire/theorie/annoncer-son-depart.webp' },
    { caption: 'Parler à quelqu’un de ce qu’a dit Lina', alt: 'La collègue parle à une autre personne. Elle fait un geste vers Lina, qui s’éloigne dans le couloir.', src: '/lib/images/grammaire/theorie/rapporter-ce-que-lina-a-dit.webp' },
  ],
  j10: [{ caption: 'Un appel que je n’ai pas pu faire', alt: 'Une femme regarde une fiche de contact sur son téléphone. Le champ du numéro est vide.', src: '/lib/images/grammaire/theorie/regarder-un-contact-sans-numero.webp' }],

  k1: [
    { caption: 'Je suis d’accord', alt: 'Irina sourit et montre l’arrêt de bus à Antoine.', src: '/lib/images/grammaire/theorie/accepter-de-prendre-le-bus.webp', exampleIndex: 1 },
    { caption: 'Je préfère marcher', alt: 'Antoine montre le trottoir dans la direction opposée à l’arrêt de bus. Irina l’écoute.', src: '/lib/images/grammaire/theorie/proposer-de-continuer-a-pied.webp', exampleIndex: 2 },
  ],
  k3: [{ caption: 'Rentrer parce qu’on est fatigué', alt: 'Un homme bâille en fermant son casier. Il porte déjà son sac et la sortie est derrière lui.', src: '/lib/images/grammaire/theorie/rentrer-parce-qu-on-est-fatigue.webp' }],
  k4: [{ caption: 'Du retard à la décision', alt: 'Un homme regarde sa montre à l’arrêt vide. Une femme s’éloigne à pied avec son téléphone.', src: '/lib/images/grammaire/theorie/retard-du-bus-puis-marche.webp', description: 'Le bus tarde à venir. La voyageuse décide de marcher.' }],
  k5: [{ caption: 'Un but à la poste', alt: 'Au bureau de poste, un client tient une enveloppe devant l’employée du guichet.', src: '/lib/images/grammaire/theorie/entrer-a-la-poste-avec-une-lettre.webp' }],
  k6: [{ caption: 'Deux manières de se déplacer', alt: 'Lina pose le pied sur la marche du bus. À côté de l’arrêt, Sami continue à pied sur le trottoir.', src: '/lib/images/grammaire/theorie/prendre-le-bus-et-aller-a-pied.webp' }],
  k7: [{ caption: 'Un obstacle et l’action qui arrive quand même', alt: 'Une cycliste en veste jaune continue de pédaler. La pluie tombe autour d’elle.', src: '/lib/images/grammaire/theorie/partir-a-velo-malgre-la-pluie.webp' }],
}
