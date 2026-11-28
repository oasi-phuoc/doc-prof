/** Le texte décrit la scène et sert de repère quand son illustration reste à produire. */
type Scene = { caption: string; brief: string; exampleIndex?: number; src?: string }

const scene = (caption: string, brief: string, exampleIndex?: number): Scene => ({ caption, brief, exampleIndex })

export const falcVisualPlans: Readonly<Record<string, Scene[] | undefined>> = {
  modaux: [scene('Je peux partir', 'Une adulte range ses cahiers. L’enseignant vient de signaler la fin du cours.'), scene('Je dois partir', 'La même adulte regarde son agenda pour partir à son rendez-vous. Montrer l’agenda et l’heure, sans écriture intégrée.')],
  pronominaux: [scene('Je parle de moi', 'Kenza se prépare devant son miroir. Elle parle à une amie qui attend près de la porte.'), scene('Je parle à mon amie', 'Kenza s’adresse à sa même amie, qui se prépare à son tour devant le miroir.')],
  a9: [scene('Jamais', 'Un calendrier du mois sans marque de trajet en bus. Mettre les mots et le titre dans la légende.'), scene('Plus', 'Deux calendriers, avant puis maintenant. Avant, plusieurs petits bus marquent des trajets. Maintenant, aucun trajet. Les mots seront ajoutés en légende.')],
  c3: [
    { caption: 'Un bus', brief: 'À l’arrêt, un voyageur parle à une conductrice. Un bus s’approche derrière eux.', src: '/lib/images/grammaire/communication/plan-du-reseau-a-larret.webp' },
    { caption: 'Une ligne', brief: 'Deux lignes de bus sont représentées. Les cercles indiquent les arrêts de chaque ligne.', src: '/lib/images/grammaire/theorie/plan-de-deux-lignes-de-bus.webp' },
  ],
  c4: [scene('Je donne une information', 'Une personne indique une grande salle de sport. Son visage est calme.'), scene('Je montre ma surprise', 'La même personne entre dans cette salle et regarde le plafond très haut, les yeux écarquillés. Même cadrage du lieu.')],
  d1: [
    { caption: 'Du vélo', brief: 'Une femme porte un casque et roule à vélo sur une piste dans un parc.', src: '/lib/images/tcf/qcm-audit/grammaire-randonnee-a-velo.webp' },
    { caption: 'De la danse', brief: 'Quatre adultes font le même pas de danse dans une salle de cours.', src: '/lib/images/tcf/qcm-audit/grammaire-cours-de-danse-fitness.webp' },
  ],
  d2: [
    { caption: 'Amina lave le vélo', brief: 'Amina frotte le guidon du vélo avec une éponge.', src: '/lib/images/grammaire/theorie/laver-le-velo.webp' },
    { caption: 'Amina se lave', brief: 'Au lavabo, Amina applique de la mousse sur ses joues avec ses mains.', src: '/lib/images/grammaire/theorie/se-laver-le-visage-au-lavabo.webp' },
  ],
  d3: [scene('Avec toi', 'Une femme en manteau jaune se dirige vers la porte à côté d’un ami. Elle lui parle.'), scene('Moi', 'Une femme en manteau jaune reste assise et se désigne pendant qu’un ami se dirige vers la porte.')],
  e7: [
    { caption: 'Vers le marché', brief: 'Sur le plan, la flèche part de la maison et pointe vers les étals du marché.', src: '/lib/images/grammaire/theorie/trajet-vers-le-marche.webp' },
    { caption: 'De retour du marché', brief: 'Sur le même plan, la flèche part des étals du marché et pointe vers la maison.', src: '/lib/images/grammaire/theorie/trajet-du-marche-vers-la-maison.webp' },
  ],
  e4: [
    { caption: 'Souvent', brief: 'Sur le calendrier, dix jours sur quatorze portent un dessin de bus.', src: '/lib/images/grammaire/theorie/trajets-en-bus-souvent.webp' },
    { caption: 'Rarement', brief: 'Sur le même calendrier, un seul jour sur quatorze porte un dessin de bus.', src: '/lib/images/grammaire/theorie/trajets-en-bus-rarement.webp' },
  ],
  e5: [scene('D’abord', 'Un homme en pull bleu ouvre la porte d’une pièce encore sombre.'), scene('Ensuite', 'Le même homme à l’intérieur appuie sur l’interrupteur et la pièce s’éclaire.')],
  f2: [scene('Demander un service', 'Une visiteuse demande à une personne près de la porte de l’ouvrir. La porte est fermée.'), scene('Dire ce qu’il faut faire', 'Une personne tient une porte ouverte. Un collègue lui demande de la fermer, avec un geste vers la poignée.')],
  f3: [scene('Je dis oui', 'À la pause, une collègue invite une personne à manger. L’invitée accepte, avec son repas à la main.', 1), scene('Je dis non', 'La même collègue l’invite. L’invitée montre qu’elle va travailler en retournant à son bureau.', 2)],
  f5: [scene('Dire qui est présent', 'Une personne est visible devant une porte. On la découvre, aucun détail sur son métier ou son identité.'), scene('Dire qui c’est', 'La même scène. Une personne indique son voisin devant la porte et le présente.')],
  f6: [scene('Mon sac', 'Une femme montre le sac qu’elle tient et indique qu’il lui appartient.'), scene('Ma clé', 'La même femme tient sa clé devant elle. Le cadrage permet de voir clairement la clé.')],
  f7: [scene('Un sac lourd', 'Un voyageur soulève un sac de voyage avec effort. Le sac est le seul objet important.'), scene('Une valise lourde', 'Une voyageuse soulève une valise avec effort. Cadrer le geste et la valise.')],
  f8: [{ caption: 'Infirmière', brief: 'Salma, infirmière, utilise un appareil pour prendre la tension du patient.', src: '/lib/images/tcf/qcm-audit/vocab-infirmiere.webp' }],
  f9: [
    { caption: 'Plus lourd', brief: 'Le plateau du sac vert est plus bas que le plateau du sac gris. Un fond jaune met en évidence le sac vert.', src: '/lib/images/grammaire/theorie/sac-vert-plus-lourd.webp' },
    { caption: 'Moins lourd', brief: 'Le plateau du sac gris est plus haut que le plateau du sac vert. Un fond jaune met en évidence le sac gris.', src: '/lib/images/grammaire/theorie/sac-gris-moins-lourd.webp' },
  ],
  f12: [scene('Une petite salle', 'Petite salle de cours avec deux chaises et une table. Dessiner le cadre serré de la pièce.'), scene('Une salle claire', 'Salle de cours éclairée par une grande fenêtre, avec la lumière répartie sur les tables.')],
  f13: [scene('Le plus léger', 'Trois sacs de formes différentes sur une table. Trois étiquettes de poids seront ajoutées sous l’image, avec le sac gris le plus léger.'), scene('La moins chère', 'Trois valises en vitrine. Prévoir une place sous l’illustration pour les trois prix, avec la valise verte au prix le plus bas.')],
  f14: [
    { caption: 'Plus de livres', brief: 'La pile de Lina compte quatre livres. Celle de Paul en compte deux.', src: '/lib/images/grammaire/theorie/comparer-deux-piles-de-livres.webp' },
    { caption: 'Lire plus souvent', brief: 'La semaine de Lina comporte cinq jours avec un dessin de livre. Celle de Paul en comporte deux.', src: '/lib/images/grammaire/theorie/comparer-les-moments-de-lecture.webp' },
  ],
  'description-physique': [
    { caption: 'Des cheveux bouclés', brief: 'Ana a des cheveux bruns. Des boucles encadrent son visage.', src: '/lib/images/grammaire/theorie/portrait-de-cheveux-boucles.webp' },
    { caption: 'Des yeux marron', brief: 'Gros plan sur deux yeux aux iris marron.', src: '/lib/images/tcf/qcm-audit/qcm-delf100-yeux-marron.png' },
  ],
  f10: [scene('Conseiller de se reposer', 'Dans un lieu de travail, une collègue conseille à un ami fatigué de faire une pause. Montrer un fauteuil libre à proximité.'), scene('Proposer de prendre le bus', 'Au guichet d’information, une employée montre l’arrêt de bus à la personne qui demande une solution pour son trajet.')],
  f11: [scene('Dire ce qui se passe', 'Un ami ferme la porte d’une pièce. Un autre le voit depuis l’intérieur.'), scene('Donner une consigne', 'La porte est encore ouverte. Une personne indique la poignée en demandant à son ami de fermer.')],
  g1: [scene('Un citron', 'Sur l’étal, plusieurs citrons sont disponibles. Une personne demande un citron sans en montrer un en particulier.'), scene('Une pomme', 'Sur le même étal, plusieurs pommes sont disponibles. La personne demande une pomme.')],
  g2: [scene('Une tasse sur la table', 'Une tasse bleue est reconnaissable sur une table. Le dialogue présente d’abord cette tasse.'), scene('La tasse dont on parle', 'Même tasse bleue. Une personne la prend au moment où l’autre la lui montre.')],
  g4: [
    { caption: 'Compter les pommes', brief: 'Trois pommes rouges sont alignées sur une table, avec un espace entre chaque pomme.', src: '/lib/images/grammaire/theorie/compter-trois-pommes.webp' },
    { caption: 'Peser les pommes', brief: 'Des pommes rouges sont posées dans le plateau d’une balance au marché.', src: '/lib/images/grammaire/theorie/peser-les-pommes-au-marche.webp' },
  ],
  g5: [scene('Quelques pommes', 'Une main prend un petit groupe de pommes parmi beaucoup de pommes sur un étal.'), scene('Chaque pomme', 'La même personne prend les pommes une à une. Un seul fruit dans ses mains est clairement visible.')],
  g6: [scene('Du pain', 'Une personne mange une tranche de pain. Une partie du pain reste sur la table.'), scene('Du marché', 'Sur un petit plan, une flèche part des étals du marché vers la maison. Le mot « marché » est en légende.')],

  h1: [scene('Aujourd’hui', 'Une personne prend le bus. Une vignette de calendrier sans texte symbolise aujourd’hui.'), scene('Hier', 'Le même trajet sur une frise, le jour précédent. Les mots Aujourd’hui et Hier seront dans les légendes.')],
  h3: [scene('Lina arrive', 'Lina arrive seule à l’entrée du cours. Représenter l’horloge et un seul personnage.'), scene('Lina et Sara arrivent', 'Même entrée, même horloge, avec Lina et Sara qui arrivent ensemble.')],
  h4: [scene('La situation avant', 'Un logement près de la gare. Une flèche discrète situe le logement à côté des voies.'), scene('Chaque matin', 'Calendrier avec un symbole de bus chaque matin de la semaine. Même trajet répété.')],
  h5: [scene('Le bus est parti avant', 'Une frise en deux temps. D’abord un bus quitte l’arrêt. Ensuite une personne arrive à l’arrêt vide. Les heures restent en légende.')],
  h6: [scene('Samira sort', 'Samira passe seule la porte d’un établissement à midi. Aucun objet dans ses mains.'), scene('Samira sort le pain', 'Samira déplace un pain depuis l’intérieur vers la table extérieure. Le pain est l’objet du geste.')],
  h7: [scene('Une personne se lève', 'Lina s’assoit au bord du lit le matin. Une horloge montre 7 heures.'), scene('Deux personnes se lèvent', 'Deux adultes se lèvent. L’horloge indique la même heure et le geste est clairement visible.')],
  h8: [scene('L’attente', 'Une personne attend à un arrêt, sans bus. La posture d’attente est claire.'), scene('L’arrivée du bus', 'Même arrêt, même personne. Un bus arrive. Le changement dans la scène est visible.')],
  i2: [scene('Mon sac', 'Une personne pose la main sur son propre sac pour le montrer à quelqu’un.'), scene('Ma clé', 'La même personne montre sa propre clé. Les légendes indiquent comment éviter de répéter le nom.')],
  i3: [scene('Ce sac', 'Un client montre l’un des sacs du magasin du doigt. Distinguer le sac des autres par sa forme.'), scene('Cette valise', 'Le même client montre une des valises. Garder un cadrage cohérent, avec deux objets bien séparés.')],
  i4: [{ caption: 'Le bus puis « le »', brief: 'Une femme en veste mauve montre le bus à son interlocutrice.', src: '/lib/images/grammaire/theorie/indiquer-le-bus-que-je-prends.webp' }],
  i5: [{ caption: 'Parler à Samir', brief: 'Un homme en pull bleu parle à Samir. Samir porte une veste verte et le regarde.', src: '/lib/images/grammaire/theorie/parler-a-samir-devant-le-centre.webp' }],
  i7: [
    { caption: 'Revenir du marché', brief: 'Sur le plan, la flèche part du marché et pointe vers la maison.', src: '/lib/images/grammaire/theorie/trajet-du-marche-vers-la-maison.webp' },
    { caption: 'Aller au marché', brief: 'Sur le même plan, la flèche part de la maison et pointe vers le marché.', src: '/lib/images/grammaire/theorie/trajet-vers-le-marche.webp' },
  ],

  j1: [{ caption: 'Maintenant', brief: 'Un bébé dort dans son lit. À la porte, une adulte porte un doigt à ses lèvres.', src: '/lib/images/grammaire/theorie/signe-de-parler-doucement.webp' }],
  j2: [{ caption: 'Il y a un instant', brief: 'À l’arrêt, un voyageur regarde le bus qui s’éloigne sur la route.', src: '/lib/images/grammaire/theorie/voir-le-bus-qui-vient-de-partir.webp' }],
  j3: [{ caption: 'Deux actions en même temps', brief: 'Nadia mélange des légumes dans un saladier. Deux notes près de la radio montrent qu’elle est allumée.', src: '/lib/images/grammaire/theorie/ecouter-la-radio-en-cuisinant.webp' }],
  j4: [scene('Un projet pour ce soir', 'Un adulte prépare les ingrédients du repas prévu pour le soir. Les ingrédients ne sont pas encore cuisinés.'), scene('Un projet avec d’autres', 'Deux personnes se préparent à cuisiner ensemble pour le soir. Même cuisine et mêmes ingrédients.')],
  o2: [scene('D’abord le repas, ensuite le départ', 'Une frise de gauche à droite. À gauche, deux personnes terminent leur repas. À droite, elles sortent. Les mots restent dans la légende.')],
  o3: [scene('S’il pleut, prendre le bus', 'Une prévision de pluie et un trajet en bus figurent comme deux icônes reliées. La condition est écrite en légende.')],
  j6: [{ caption: 'L’action reste la même', brief: 'Deux pompiers posent une barrière rouge et blanche en travers d’une rue.', src: '/lib/images/grammaire/theorie/fermer-la-route-avec-une-barriere.webp' }],
  j7: [scene('Les paroles de Lina', 'Lina annonce son départ à une collègue, avec son sac en main. Ses mots seront écrits sous l’image.'), scene('Parler à quelqu’un de ce qu’a dit Lina', 'Sa collègue rapporte le départ à une troisième personne. Lina sort en arrière-plan.')],
  j10: [{ caption: 'Un appel que je n’ai pas pu faire', brief: 'Une femme regarde une fiche de contact sur son téléphone. Le champ du numéro est vide.', src: '/lib/images/grammaire/theorie/regarder-un-contact-sans-numero.webp' }],

  k1: [scene('Je suis d’accord', 'Deux adultes discutent près d’un arrêt de bus. La personne qui accepte montre l’arrêt de la main.', 1), scene('Je préfère marcher', 'Même endroit. Une autre personne indique le trottoir et propose de marcher.', 2)],
  k3: [{ caption: 'Rentrer parce qu’on est fatigué', brief: 'Un homme bâille en fermant son casier. Il porte déjà son sac et la sortie est derrière lui.', src: '/lib/images/grammaire/theorie/rentrer-parce-qu-on-est-fatigue.webp' }],
  k4: [scene('Du retard à la décision', 'En deux moments sur une frise, la personne attend le bus qui tarde, puis elle commence à marcher. La relation est lisible dans les légendes.')],
  k5: [{ caption: 'Un but à la poste', brief: 'Au bureau de poste, un client tient une enveloppe devant l’employée du guichet.', src: '/lib/images/grammaire/theorie/entrer-a-la-poste-avec-une-lettre.webp' }],
  k6: [scene('Deux manières de se déplacer', 'Composition simple en comparaison. Lina monte dans le bus et Sami passe à pied au même endroit.')],
  k7: [{ caption: 'Un obstacle et l’action qui arrive quand même', brief: 'Une cycliste en veste jaune continue de pédaler. La pluie tombe autour d’elle.', src: '/lib/images/grammaire/theorie/partir-a-velo-malgre-la-pluie.webp' }],
}
