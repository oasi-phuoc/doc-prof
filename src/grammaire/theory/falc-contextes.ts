import type { GrammarTheoryBlock, TheoryImageCell } from '@/francais/grammar-theory'

type Practice = Extract<GrammarTheoryBlock, { kind: 'practice' }>
type ContextualLesson = {
  comparison: Extract<GrammarTheoryBlock, { kind: 'image-row' }>
  repere: string[]
  practice: Practice
  reference: GrammarTheoryBlock[]
}

function scene(caption: string, description: string, example: string, alt: string, src: string): TheoryImageCell {
  return { src, caption, description, example, alt }
}

function exercise(prompt: string, answer: string, explanation: string): Practice['items'][number] {
  return { prompt, answer, explanation }
}

function reference(title: string, headers: string[], rows: string[][]): GrammarTheoryBlock[] {
  return [{ kind: 'heading', sub: true, text: title }, { kind: 'table', headers, rows, colHeader: true, rowHeader: false }]
}

function lesson(
  label: string,
  cells: TheoryImageCell[],
  repere: string[],
  instruction: string,
  items: Practice['items'],
  details: GrammarTheoryBlock[] = [],
): ContextualLesson {
  return { comparison: { kind: 'image-row', label, cells }, repere, practice: { kind: 'practice', instruction, items }, reference: details }
}

export const falcContextualLessons: Readonly<Record<string, ContextualLesson | undefined>> = {
  a1: lesson('Se présenter à son premier cours', [
    scene('Dire son prénom', 'L’enseignante demande le prénom de l’élève.', '« {c}Je m’appelle{/c} Yara. »',
      'Yara pose la main sur sa poitrine en parlant à son enseignante, à l’entrée de la salle de cours.', '/lib/images/grammaire/theorie/dire-son-prenom-au-premier-cours.webp'),
    scene('Dire où on habite', 'L’enseignante pose une deuxième question. Yara donne sa ville.', '« {c}J’habite à{/c} Sion. »',
      'Yara montre un point sur une carte de ville. L’enseignante regarde le point.', '/lib/images/grammaire/theorie/montrer-ou-on-habite.webp'),
  ], ['Pour dire ton prénom, commence par {c}je m’appelle{/c}.', 'Pour nommer ta ville, commence par {c}j’habite à{/c}.', 'Pour parler d’une langue, dis « Je parle français », par exemple.'],
  'Complète avec « m’appelle » ou « habite ».', [
    exercise('Je dis mon prénom. « Je ___ Daniel. »', 'm’appelle', 'Daniel est un prénom.'),
    exercise('Je donne ma ville. « J’___ à Martigny. »', 'habite', 'Martigny est la ville où je vis.'),
  ], reference('Dire plusieurs choses sur moi', ['Ce que je dis', 'Ma phrase'], [
    ['Mon prénom', 'Je m’appelle Yara.'], ['Ma ville', 'J’habite à Sion.'], ['Une langue', 'Je parle arabe.'], ['Ma nationalité', 'Je suis suisse.'],
  ])),

  a3: lesson('Lire deux présentations avec la même nationalité', [
    scene('Rui se présente', 'Rui montre son pays sur la carte.', '« Je suis {c}portugais{/c}. »',
      'Rui montre le Portugal en vert sur une carte affichée en classe.', '/lib/images/grammaire/theorie/se-presenter-en-disant-portugais.webp'),
    scene('Inês se présente', 'Inês montre le même pays.', '« Je suis {c}portugaise{/c}. »',
      'Inês montre le Portugal en vert sur une carte posée sur la table.', '/lib/images/grammaire/theorie/se-presenter-en-disant-portugaise.webp'),
  ], ['« Portugais » et « portugaise » indiquent la même nationalité.', 'Dans ces phrases, la forme change avec la personne.', 'Écris l’adjectif de nationalité avec une minuscule.'],
  'Complète avec « portugais » ou « portugaise ».', [
    exercise('C’est Ana. Elle dit « Je suis ___. »', 'portugaise', 'Ana utilise ici la forme féminine.'),
    exercise('C’est Rui. Il dit « Je suis ___. »', 'portugais', 'Rui utilise ici la forme masculine.'),
  ], reference('Les formes changent selon le mot', ['Masculin', 'Féminin'], [
    ['français', 'française'], ['italien', 'italienne'], ['marocain', 'marocaine'], ['suisse', 'suisse'],
  ])),

  a6: lesson('Dire d’où on vient', [
    scene('Une ville', 'Sara montre la ville de Sion sur une carte de la Suisse.', '« Je viens {c}de{/c} Sion. »',
      'Sara montre le point qui situe Sion dans le sud-ouest de la Suisse.', '/lib/images/grammaire/theorie/carte-sion-en-suisse.webp'),
    scene('Un pays', 'Mateus montre le Portugal sur une carte.', '« Je viens {c}du{/c} Portugal. »',
      'Mateus montre le Portugal en vert, à l’ouest de l’Espagne.', '/lib/images/grammaire/theorie/carte-portugal-en-europe.webp'),
  ], ['« Je viens de » indique un lieu de départ ou d’origine.', 'Devant le nom « le Portugal », {c}du{/c} réunit « de » et « le ».'],
  'Complète avec « de » ou « du ».', [
    exercise('Lina vient ___ Lausanne.', 'de', 'Lausanne est une ville. On dit « de Lausanne ». '),
    exercise('Mateus vient ___ Portugal.', 'du', 'On dit « le Portugal ». Ici, « de + le » devient « du ». '),
  ], reference('Choisir la forme avec le nom du lieu', ['Lieu', 'Je viens…'], [
    ['Sion', 'de Sion'], ['La Suisse', 'de Suisse'], ['L’Italie', 'd’Italie'], ['Le Maroc', 'du Maroc'], ['Les Philippines', 'des Philippines'],
  ])),

  famille: lesson('Présenter deux personnes de la famille', [
    scene('Parler de son frère', 'Sana montre la photo de son frère.', '« Voici {c}mon{/c} frère. »',
      'Dans son album, Sana montre la photo de son frère, à gauche. Il porte une chemise bleue.', '/lib/images/grammaire/theorie/montrer-un-portrait-de-famille.webp'),
    scene('Parler de sa sœur', 'Sana montre la photo de sa sœur.', '« Voici {c}ma{/c} sœur. »',
      'Dans le même album, Sana montre la photo de sa sœur, à droite. Elle porte un haut violet.', '/lib/images/grammaire/theorie/montrer-un-second-portrait-de-famille.webp'),
  ], ['« Mon » et « ma » indiquent ici que je parle de ma famille.', 'Regarde le mot qui suit. On dit « un frère » et « une sœur ».', 'Avec plusieurs personnes, dis « mes parents » ou « mes sœurs ».'],
  'Complète avec « mon », « ma » ou « mes ».', [
    exercise('Je montre ma famille. Voici ___ tante.', 'ma', 'On dit « une tante ». Écris « ma tante ». '),
    exercise('Je montre deux photos. Voici ___ cousins.', 'mes', '« Cousins » est au pluriel. Écris « mes cousins ». '),
  ], reference('À qui appartient la relation ?', ['La personne qui parle de sa famille', 'Exemple'], [
    ['Moi', 'Mon frère, ma sœur, mes parents.'], ['Toi', 'Ton frère, ta sœur, tes parents.'], ['Lui ou elle', 'Son frère, sa sœur, ses parents.'],
    ['Nous, vous, eux', 'Notre sœur. Votre frère. Leurs parents.'],
  ])),

  b1: lesson('Demander de l’aide à un ami ou à une personne inconnue', [
    scene('Une amie', 'Malik parle à son amie Inès. Ils se disent déjà « tu ».', '« {c}Tu peux{/c} m’aider ? »',
      'Deux amis parlent près d’une voiture. Malik s’adresse à Inès.', '/lib/images/tcf/co/scenes/reprises/dialogue-projet-voiture-deux-amis.png'),
    scene('Une personne inconnue', 'Dans la rue, Yanis demande son chemin à une personne inconnue.', '« Excusez-moi, {c}vous pouvez{/c} m’aider ? »',
      'Yanis parle à une passante. Elle lui montre le chemin.', '/lib/images/tcf/co/scenes/delf-actif/scenario-demander-chemin-spectacle.png'),
  ], [
    'Avec un ami ou une personne proche, tu dis souvent {c}tu{/c}.',
    'Avec un adulte que tu ne connais pas, commence par {c}vous{/c}.',
    'Pour parler à plusieurs personnes, dis aussi {c}vous{/c}, même à tes amis.',
  ], 'Complète avec « tu » ou « vous ».', [
    exercise('Je parle à ma sœur. « ___ viens avec moi ? »', 'Tu', 'Je dis « tu » quand je parle à ma sœur.'),
    exercise('Je parle à deux amis. « ___ venez avec moi ? »', 'Vous', 'Je parle à deux personnes. « Vous » sert aussi avec des amis.'),
  ], reference('Une personne ou plusieurs personnes', ['Situation', 'Exemple'], [
    ['Un enfant', 'Tu as quel âge ?'], ['Un camarade que tu tutoies', 'Tu habites où ?'],
    ['Un professeur ou une médecin, dans une relation de politesse', 'Vous pouvez répéter ?'],
    ['Un groupe', 'Vous êtes prêts ?'], ['Une personne te propose de dire « tu »', 'D’accord, on peut se dire « tu ».'],
  ])),

  b2: lesson('Saluer quand on arrive le matin ou le soir', [
    scene('Le matin, j’arrive', 'À 9 heures, Naïma entre à la boulangerie.', '« {c}Bonjour{/c} ! »',
      'Dans une boulangerie éclairée par le soleil, une cliente salue le boulanger.', '/lib/images/tcf/co/scenes/grammaire/a1-137-commander-a-la-boulangerie.png'),
    scene('Le soir, j’arrive', 'À 19 heures, Simran entre au restaurant.', '« {c}Bonsoir{/c} ! »',
      'Simran salue le serveur à l’entrée. Dans la rue, les lampes sont allumées et le ciel est sombre.', '/lib/images/grammaire/theorie/saluer-le-soir.webp'),
  ], [
    'Quand tu arrives, dis {c}bonjour{/c} le matin et pendant la journée.',
    'Le soir, tu peux dire {c}bonsoir{/c}. Il n’y a pas d’heure fixe.',
    'Quand tu pars le soir, tu peux dire « Au revoir » ou « Bonne soirée ».',
  ], 'Complète avec « bonjour », « bonsoir » ou « bonne soirée ».', [
    exercise('Tu arrives à la pharmacie le matin. « ___ ! »', 'Bonjour', 'Tu arrives pendant la journée.'),
    exercise('Tu arrives chez tes voisins le soir. « ___ ! »', 'Bonsoir', 'Tu arrives le soir.'),
    exercise('Tu quittes le restaurant le soir. « Au revoir et ___ ! »', 'bonne soirée', 'Tu pars. Tu souhaites une bonne soirée.'),
  ], reference('D’autres mots pour saluer', ['Quand tu arrives', 'Quand tu pars'], [
    ['Bonjour ! pendant la journée', 'Au revoir ! à tout moment'], ['Bonsoir ! le soir', 'Bonne journée ! pendant la journée'],
    ['Salut ! avec des proches', 'Bonne soirée ! le soir'], ['Bonjour et bonsoir conviennent avec tu et vous.', 'Salut ! avec des proches. À bientôt ! si tu penses revoir la personne.'],
  ])),

  b3: lesson('Remercier et répondre dans la même scène', [
    scene('Je remercie', 'Les cahiers de Ravi tombent. Lila les ramasse et les lui donne.', 'Ravi dit « {c}Merci{/c} ! »',
      'Dans le couloir, Lila tend deux cahiers à Ravi, assis dans son fauteuil roulant.', '/lib/images/grammaire/theorie/rendre-des-cahiers.webp'),
    scene('Je réponds', 'Ravi remercie Lila. Elle lui répond.', 'Lila répond « {c}De rien{/c} ! »',
      'Ravi tient les deux cahiers sur ses genoux. Lila lui sourit et ouvre les mains en lui répondant.', '/lib/images/grammaire/theorie/repondre-apres-un-remerciement.webp'),
  ], ['Dis {c}merci{/c} quand quelqu’un t’aide.', 'Quand on te dit « merci », tu peux répondre {c}de rien{/c}.'],
  'Complète avec « merci » ou « de rien ».', [
    exercise('On te prête un stylo. Tu dis « ___ ! »', 'Merci', 'Tu remercies la personne qui te prête le stylo.'),
    exercise('Tu rends un service. On te dit merci. Tu réponds « ___ ! »', 'De rien', 'Tu réponds à la personne qui te remercie.'),
  ], reference('Remercier et répondre avec d’autres mots', ['Pour remercier', 'Pour répondre'], [
    ['Merci beaucoup !', 'Avec plaisir !'], ['C’est gentil de votre part !', 'Je vous en prie !'], ['Merci de m’avoir aidé.', 'Il n’y a pas de quoi.'],
  ])),

  a2: lesson('La même personne parle ou devient le sujet de la phrase', [
    scene('Je parle de moi', 'Nora pose la main sur sa poitrine. Elle parle de son travail.', 'Nora dit « {c}Je{/c} travaille ici. »',
      'Dans l’atelier de vélos, Nora porte un tablier rouge. Elle pose la main sur sa poitrine en parlant.', '/lib/images/grammaire/theorie/indiquer-qui-travaille-dans-un-atelier.webp'),
    scene('On parle de Nora', 'Un collègue parle de Nora à une cliente.', 'Il dit « {c}Elle{/c} travaille ici. »',
      'Dans le même atelier, le collègue se tourne vers la cliente et désigne Nora, qui répare le vélo.', '/lib/images/grammaire/theorie/presenter-une-collegue.webp'),
  ], ['La personne qui parle dit {c}je{/c} pour parler d’elle-même.', 'Ici, {c}elle{/c} remplace « Nora ». Le pronom indique qui travaille.'],
  'Complète avec « je », « il » ou « elle ».', [
    exercise('Karim parle de lui. « ___ travaille à la poste. »', 'Je', 'Karim parle de lui-même.'),
    exercise('Lila parle de Karim. « ___ travaille à la poste. »', 'Il', 'Lila parle de Karim. « Il » remplace son prénom.'),
  ], reference('Les pronoms qui indiquent de qui on parle', ['Pronom', 'À qui ou à quoi il correspond'], [
    ['Je / j’', 'La personne qui parle. On écrit « j’habite ».'], ['Tu / vous', 'La personne ou les personnes à qui on parle.'],
    ['Il / elle', 'La personne ou la chose dont on parle.'], ['Nous', 'La personne qui parle avec d’autres personnes.'],
    ['Ils / elles', 'Plusieurs personnes ou choses. « Elles » pour un groupe au féminin.'],
  ])),

  m2: lesson('Dire où je suis au téléphone', [
    scene('Je suis à la gare', 'Lina attend seule devant la gare.', '« {sujet}Je{/sujet} {verbe}suis{/verbe} à la gare. »',
      'En veste mauve, Lina téléphone seule devant l’entrée de la gare.', '/lib/images/grammaire/theorie/attendre-seule-devant-la-gare.webp'),
    scene('Nous sommes à la gare', 'Lina attend avec une amie devant la même gare.', '« {sujet}Nous{/sujet} {verbe}sommes{/verbe} à la gare. »',
      'Lina est toujours au téléphone devant la gare. Une amie se tient à ses côtés.', '/lib/images/grammaire/theorie/attendre-a-deux-devant-la-gare.webp'),
  ], ['Je parle de moi. Je dis {c}je suis{/c}.', 'Je parle de moi et d’une autre personne. Je dis {c}nous sommes{/c}.', '« Suis » et « sommes » sont deux formes du verbe être.'],
  'Complète avec « suis » ou « sommes ».', [
    exercise('J’appelle le secrétariat. « Bonjour, je ___ devant la salle. »', 'suis', 'Avec « je », écris « suis ». '),
    exercise('Ma sœur est avec moi. « Nous ___ devant la salle. »', 'sommes', 'Je parle de ma sœur et de moi. Écris « nous sommes ». '),
  ], [
    { kind: 'heading', sub: true, text: 'Dire comment on se sent' },
    { kind: 'image-row', label: 'Deux émotions dans des situations différentes', cells: [
      scene('Contente', 'Sofia reçoit une bonne nouvelle. Elle sourit.', 'Sofia {verbe}est{/verbe} {c}contente{/c}.',
        'Portrait de Sofia avec un grand sourire.', '/lib/images/vocabulaire/famille-personnes/contente.webp'),
      scene('Inquiète', 'Anna attend une nouvelle importante.', 'Anna {verbe}est{/verbe} {c}inquiète{/c}.',
        'Anna attend sur un banc, les mains serrées et le visage soucieux.', '/lib/images/tcf/qcm-audit/qcm-delf2-attente-inquietude.png'),
    ] },
    { kind: 'paragraph', text: 'Après « je suis » ou « elle est », tu peux dire une émotion. Sofia dit « Je suis contente ». ' },
    { kind: 'page' },
    { kind: 'heading', sub: true, text: 'Donner son métier ou sa nationalité' },
    { kind: 'image-row', label: 'Deux informations pour se présenter', cells: [
      scene('Un métier', 'Amir travaille le bois dans un atelier. Il présente son métier.', '« Je {verbe}suis{/verbe} {c}menuisier{/c}. »',
        'Amir travaille une planche avec un rabot dans un atelier.', '/lib/images/tcf/catalogue/metiers/menuisier.webp'),
      scene('Une nationalité', 'Au guichet, Mauro donne sa nationalité.', '« Je {verbe}suis{/verbe} {c}suisse{/c}. »',
      'Au guichet, Mauro montre un passeport rouge avec une croix blanche.', '/lib/images/grammaire/theorie/montrer-son-passeport-suisse.webp'),
    ] },
    { kind: 'paragraph', text: 'Le mot après « je suis » donne l’information. Par exemple, « menuisier » donne le métier.' },
    { kind: 'page' },
    ...reference('Les formes du verbe être au présent', ['Pronom', 'Forme et exemple'], [
      ['Je', 'suis · Je suis à la gare.'], ['Tu', 'es · Tu es prêt.'], ['Il / elle / on', 'est · Elle est cuisinière.'],
      ['Nous', 'sommes · Nous sommes à Sion.'], ['Vous', 'êtes · Vous êtes là.'], ['Ils / elles', 'sont · Elles sont fatiguées.'],
    ]),
  ]),

  m3: lesson('Dire ce que j’ai ou donner mon âge', [
    scene('Un objet', 'Rayan montre son billet à la contrôleuse.', '« J’{c}ai{/c} un billet. »',
      'Sur le quai de la gare, Rayan tend un billet à la contrôleuse devant le train.', '/lib/images/grammaire/theorie/montrer-son-billet-au-controleur.webp'),
    scene('Un âge', 'Rayan remplit sa fiche. Il dit son âge.', '« J’{c}ai{/c} 25 ans. »',
      'Au guichet de la gare, Rayan remplit une fiche. L’employée le regarde écrire.', '/lib/images/grammaire/theorie/donner-son-age-au-guichet.webp'),
  ], ['Le verbe avoir peut dire ce que tu as avec toi.', 'Pour donner ton âge, utilise aussi le verbe avoir.', 'Avec « je », on écrit « j’ai ». Avec « vous », on écrit « vous avez ».'],
  'Complète avec « ai » ou « avez ».', [
    exercise('Je montre mon sac. « J’___ un sac. »', 'ai', 'Avec « je », dis « j’ai ». '),
    exercise('L’employée parle à une personne. « Vous ___ un billet ? »', 'avez', 'Avec « vous », dis « vous avez ». '),
  ], reference('Les formes et les usages du verbe avoir', ['Pronom', 'Forme et exemple'], [
    ['Je / tu', 'J’ai 25 ans. Tu as un ticket.'], ['Il / elle / on', 'Il a une clé.'], ['Nous / vous', 'Nous avons soif. Vous avez froid.'], ['Ils / elles', 'Elles ont un rendez-vous.'],
  ])),

  a4: lesson('Donner sa destination', [
    scene('Une ville', 'Fatima monte dans un train pour Sion.', '« Je {c}vais à{/c} Sion. »',
      'Fatima prend appui sur sa canne et monte dans le train régional.', '/lib/images/grammaire/theorie/prendre-le-train-vers-sion.webp'),
    scene('Un lieu', 'Fatima se rend au marché.', '« Je {c}vais au{/c} marché. »',
      'Avec la même canne et le même sac violet, Fatima se dirige vers les étals du marché.', '/lib/images/grammaire/theorie/arriver-au-marche.webp'),
  ], ['Avec « je », on dit {c}je vais{/c}. Avec « nous », on dit {c}nous allons{/c}.', 'Pour une ville, dis « à Sion ». Avec « le marché », dis « au marché ».', 'Pour une personne, tu peux dire « chez ». Exemple. « Je vais chez le médecin. »'],
  'Complète avec « à », « au » ou « chez ».', [
    exercise('Je vais ___ Lausanne.', 'à', 'Lausanne est une ville. On dit « à Lausanne ». '),
    exercise('Je vais ___ musée.', 'au', 'On dit « le musée ». « À + le » devient « au ». '),
  ], [
    ...reference('Aller au présent', ['Personnes', 'Formes'], [['Je / tu', 'vais / vas'], ['Il / elle / on', 'va'], ['Nous / vous', 'allons / allez'], ['Ils / elles', 'vont']]),
    { kind: 'paragraph', text: 'Je vais à la poste, à l’école, en Italie, au Portugal ou aux Philippines.' },
  ]),

  a8: lesson('Dire ce que je fais ou ce que je ne fais pas', [
    scene('Je monte dans le bus', 'Ce matin, Awa monte dans le bus.', '« Je prends le bus. »',
      'Awa, en manteau vert, pose un pied sur la marche du bus dont la porte est ouverte.', '/lib/images/grammaire/theorie/monter-dans-le-bus.webp'),
    scene('Je pars à pied', 'Ce matin, Awa choisit de marcher.', '« Je {c}ne{/c} prends {c}pas{/c} le bus. »',
      'Avec son manteau vert et son sac orange, Awa marche sur le trottoir. Le bus est derrière elle.', '/lib/images/grammaire/theorie/partir-a-pied-pres-du-bus.webp'),
  ], ['Pour dire le contraire, mets {c}ne{/c} avant le verbe et {c}pas{/c} après.', 'Devant une voyelle ou un h muet, écris « n’ ».'],
  'Complète avec « ne », « n’ » ou « pas ».', [
    exercise('Je mange chez moi. Je ___ mange pas au café.', 'ne', '« Ne » vient avant « mange ». '),
    exercise('Je voyage en train. Je ne prends ___ le bus.', 'pas', '« Pas » vient après « prends ». '),
  ], reference('Regarder le mot après « ne »', ['Situation', 'Exemple'], [
    ['Le verbe commence par une voyelle', 'Je n’habite pas à Genève.'],
    ['Deux mots au passé composé', 'Je n’ai pas pris le bus.'],
    ['Une consigne à l’infinitif', 'Ne pas fumer.'],
  ])),

  c1: lesson('Poser la même question de plusieurs façons', [
    scene('Une question entre amis', 'Maël parle à une amie dans le couloir.', '« Tu viens demain {c}?{/c} »',
      'Maël parle à son amie à l’entrée de la salle de cours. Il avance une main ouverte.', '/lib/images/grammaire/theorie/bavarder-dans-le-couloir-apres-le-cours.webp'),
    scene('Une autre façon de poser la question', 'Maël pose la même question à son amie.', '« {c}Est-ce que{/c} tu viens demain ? »',
      'Maël parle à son amie à l’entrée de la salle de cours. Il avance une main ouverte.', '/lib/images/grammaire/theorie/bavarder-dans-le-couloir-apres-le-cours.webp'),
  ], ['Ces phrases demandent la même chose.', 'À l’oral, ta voix peut montrer que « Tu viens demain ? » est une question.', 'Tu peux aussi commencer la phrase par « est-ce que ».'],
  'Complète avec « Est-ce que » ou « ? ».', [
    exercise('___ tu travailles demain ?', 'Est-ce que', 'La question commence par « Est-ce que ». '),
    exercise('Tu prends le train demain ___', '?', 'À l’écrit, termine la question par un point d’interrogation.'),
  ], reference('Les trois façons de poser une question', ['Forme', 'La même question'], [
    ['Voix qui monte à l’oral', 'Tu viens demain ?'], ['Est-ce que', 'Est-ce que tu viens demain ?'], ['Sujet après le verbe', 'Viens-tu demain ? Le trait relie « viens » et « tu ».'],
  ])),

  c2: lesson('Demander une confirmation ou une information', [
    scene('Je veux savoir si c’est ouvert', 'Eva veut savoir si elle peut encore entrer à la poste.', '« La poste est ouverte ? » « {c}Oui{/c}. »',
      'Eva parle à un employé au comptoir de la poste. La porte d’entrée est ouverte.', '/lib/images/grammaire/theorie/demander-si-la-poste-est-ouverte.webp'),
    scene('Je veux une heure', 'Eva demande l’heure de fermeture. L’employé lui indique l’horloge.', '« {c}À quelle heure{/c} fermez-vous ? » « À 18 heures. »',
      'Au même comptoir, l’employé indique l’horloge. La grande aiguille est en haut et la petite en bas.', '/lib/images/grammaire/theorie/demander-lheure-de-fermeture.webp'),
  ], ['Une question fermée permet souvent de répondre oui ou non.', 'Une question ouverte demande une information.', '« Où » demande un lieu. « Quand » demande un moment.'],
  'Complète avec « Où » ou « Quand ».', [
    exercise('Je demande un lieu. « ___ se trouve la poste ? »', 'Où', 'Le lieu indique l’endroit où se trouve la poste.'),
    exercise('Je demande un jour. « ___ fermes-tu ? »', 'Quand', 'Le jour indique un moment.'),
  ], reference('Choisir un mot pour demander une information', ['Je cherche', 'Question'], [
    ['Une personne', 'Qui vient ?'], ['Une chose', 'Qu’est-ce que tu cherches ?'], ['Un lieu', 'Où habites-tu ?'],
    ['Un moment', 'Quand ouvre la poste ?'], ['Une raison', 'Pourquoi pars-tu ?'], ['Une manière ou une quantité', 'Comment viens-tu ? Combien de billets ?'],
  ])),

  e1: lesson('Placer une clé sur une boîte ou dans une boîte', [
    scene('Sur la boîte', 'La clé est posée sur le couvercle.', 'La clé est {c}sur{/c} la boîte.',
      'La clé jaune repose sur le couvercle de la boîte bleue fermée.', '/lib/images/grammaire/theorie/poser-la-cle-sur-la-boite.webp'),
    scene('Dans la boîte', 'La clé est à l’intérieur.', 'La clé est {c}dans{/c} la boîte.',
      'La même clé jaune repose au fond de la boîte bleue ouverte. Le couvercle est à côté.', '/lib/images/grammaire/theorie/placer-la-cle-dans-la-boite.webp'),
  ], ['Repère d’abord la boîte. Elle t’aide à situer la clé.', '{c}Sur{/c} veut dire ici que la clé touche le dessus. {c}Dans{/c} veut dire à l’intérieur.'],
  'Complète avec « sur » ou « dans ».', [
    exercise('Tu ouvres ton sac. Le billet est à l’intérieur. Il est ___ ton sac.', 'dans', 'Le billet est à l’intérieur du sac.'),
    exercise('Tu poses le billet. Il touche le dessus de la table. Il est ___ la table.', 'sur', 'Le billet touche le dessus de la table.'),
  ], reference('D’autres mots pour dire où se trouve un objet', ['Mot', 'Exemple'], [
    ['sous', 'Le sac est sous la chaise.'], ['devant / derrière', 'Le vélo est devant la maison.'], ['entre', 'La pharmacie est entre la poste et la gare.'],
    ['près de / loin de', 'L’arrêt est près de l’école.'], ['à côté de', 'La chaise est à côté de la porte.'],
  ])),

  e2: lesson('Lire l’heure ou la date d’un rendez-vous', [
    scene('Une heure', 'L’horloge indique 9 heures.', 'Je viens {c}à{/c} 9 heures.',
      'La grande aiguille de l’horloge pointe sur le 12 et la petite sur le 9. Il est 9 heures.', '/lib/images/tcf/qcm-audit/co834-horloge-0900-dessinee.webp'),
    scene('Une date', 'Le calendrier indique le 14 mars.', 'Je viens {c}le{/c} 14 mars.',
      'Une main montre le numéro 14 sur la page du calendrier.', '/lib/images/grammaire/theorie/calendrier-14-mars.webp'),
  ], ['Pour une heure, dis {c}à{/c} 9 heures.', 'Pour une date, dis {c}le{/c} 14 mars.', 'Pour un mois seul, dis {c}en{/c} mars.'],
  'Complète avec « à », « le » ou « en ».', [
    exercise('Le cours commence ___ 8 heures.', 'à', '8 heures indique une heure.'),
    exercise('Le cours commence ___ 12 septembre.', 'le', '12 septembre indique une date.'),
  ], reference('Le jour, le mois et la saison', ['Moment', 'Exemple'], [
    ['Jour précis', 'Je reviens lundi.'], ['Même jour chaque semaine', 'Je travaille le lundi.'], ['Mois ou année', 'En juillet. En 2027.'],
    ['Saison', 'Au printemps. En été. En automne. En hiver.'], ['Partie de la journée', 'Le matin. L’après-midi. Le soir.'],
  ])),

  e3: lesson('Dire quand une action commence ou combien de temps elle dure', [
    scene('Le début', 'Aïcha a commencé lundi. Elle travaille encore ici.', 'Je travaille ici {c}depuis{/c} lundi.',
      'Aïcha range des cahiers sur une étagère dans la papeterie où elle travaille.', '/lib/images/grammaire/theorie/frise-depuis-lundi.webp'),
    scene('La durée', 'Aïcha travaille de 9 heures à 11 heures demain.', 'Je travaille {c}pendant{/c} deux heures.',
      'Aïcha montre un créneau dans son agenda, au comptoir de la papeterie.', '/lib/images/grammaire/theorie/duree-de-neuf-a-onze-heures.webp'),
  ], ['Avec {c}depuis{/c}, l’action a commencé et continue au moment dont tu parles.', '{c}Pendant{/c} donne la durée de l’action, au passé, au présent ou au futur.'],
  'Complète avec « depuis » ou « pendant ».', [
    exercise('J’habite ici ___ juin. J’habite toujours ici.', 'depuis', 'Juin indique le début et j’habite encore ici.'),
    exercise('Demain, je travaille de 9 heures à midi. Je travaille ___ trois heures.', 'pendant', 'Trois heures donne la durée du travail prévu.'),
  ], reference('Deux autres façons de parler du temps', ['Mot', 'Exemple'], [
    ['pour, une durée prévue', 'Je pars pour une semaine.'], ['il y a, un moment dans le passé', 'Je suis arrivée il y a trois jours.'],
    ['depuis, avec une durée', 'J’habite ici depuis deux ans. J’habite encore ici.'],
  ])),

  f1: lesson('Montrer un sac ou une valise au magasin', [
    scene('Un sac', 'Une cliente montre un sac sur le comptoir.', '« Je voudrais {c}ce{/c} sac. »',
      'Dans une boutique, une cliente montre le sac vert posé sur le comptoir.', '/lib/images/grammaire/theorie/montrer-un-sac-au-comptoir.webp'),
    scene('Une valise', 'La même cliente montre une valise sur le comptoir.', '« Je voudrais {c}cette{/c} valise. »',
      'La même cliente montre une valise orange à roulettes sur le comptoir.', '/lib/images/grammaire/theorie/montrer-une-valise-au-comptoir.webp'),
  ], ['Regarde le nom qui vient après le mot. On dit « un sac » et « une valise ».', 'Pour montrer plusieurs objets, dis {c}ces{/c}. Exemple. « Ces sacs ».'],
  'Complète avec « ce », « cette », « cet » ou « ces ».', [
    exercise('Je montre une chaise. « Est-ce que ___ chaise est libre ? »', 'cette', '« Chaise » est un nom féminin. On dit « une chaise ». '),
    exercise('Je montre deux chaises. « Est-ce que ___ chaises sont libres ? »', 'ces', 'Je montre plusieurs chaises. Au pluriel, écris « ces ». '),
  ], reference('Les quatre formes pour montrer', ['Le nom', 'Je montre'], [
    ['Un sac', 'Ce sac'], ['Un ordinateur. Le début est une voyelle.', 'Cet ordinateur'],
    ['Un homme. Le h est muet.', 'Cet homme'], ['Une chaise', 'Cette chaise'], ['Des sacs ou des chaises', 'Ces sacs ou ces chaises'],
  ])),

  f4: lesson('Dire le temps qu’il fait', [
    scene('De la pluie', 'Maya tient son parapluie sous la pluie.', '{c}Il pleut.{/c}',
      'Maya tient un parapluie bleu. On voit la pluie tomber autour d’elle.', '/lib/images/grammaire/theorie/ouvrir-un-parapluie-sous-la-pluie.webp'),
    scene('Du froid', 'Idris porte un manteau, une écharpe et des gants.', '{c}Il fait froid.{/c}',
      'Idris remonte son écharpe avec ses mains gantées. Du givre couvre la rambarde au bord du lac.', '/lib/images/grammaire/theorie/sortir-quand-il-fait-froid.webp'),
  ], ['Pour parler de la pluie, dis {c}il pleut{/c}.', 'Pour parler de la température, tu peux dire {c}il fait chaud{/c} ou {c}il fait froid{/c}.'],
  'Complète avec « pleut » ou « fait froid ».', [
    exercise('Des gouttes tombent du ciel. Il ___.', 'pleut', 'Les gouttes indiquent la pluie.'),
    exercise('Le thermomètre indique −2 °C. Il ___.', 'fait froid', 'Tu parles de la température.'),
  ], reference('D’autres phrases pour parler du temps', ['Ce que tu observes', 'Ce que tu peux dire'], [
    ['Du soleil', 'Il y a du soleil. Il fait beau.'], ['Des nuages', 'Il y a des nuages.'],
    ['De la neige', 'Il neige.'], ['Du vent', 'Il y a du vent.'],
  ])),

  g3: lesson('Parler d’une quantité à table', [
    scene('Une partie du pain', 'Éva coupe du pain. On ne dit pas combien de pain elle prend.', 'Je prends {c}du{/c} pain.',
      'Éva coupe le pain sur une planche. Une tranche est déjà posée à côté du pain.', '/lib/images/grammaire/theorie/couper-une-tranche-de-pain.webp'),
    scene('Une quantité de soupe', 'Tenzin se sert. On ne dit pas combien de soupe il prend.', 'Je prends {c}de la{/c} soupe.',
      'Tenzin remplit son bol de soupe avec une louche. La soupière est devant lui.', '/lib/images/grammaire/theorie/verser-de-la-soupe-dans-un-bol.webp'),
  ], ['« Du », « de la » et « de l’ » indiquent ici une quantité non précisée.', 'On dit {c}du{/c} pain, {c}de la{/c} soupe et {c}de l’{/c}eau.'],
  'Complète avec « du », « de la » ou « de l’ ».', [
    exercise('Tu verses une quantité de lait. « Je prends ___ lait. »', 'du', 'On dit « le lait ». Dans cette phrase, écris « du lait ». '),
    exercise('Tu verses une quantité d’eau. « Je prends ___eau. »', 'de l’', '« Eau » commence par une voyelle. Écris « de l’eau ». '),
  ], reference('Parler d’une quantité ou la préciser', ['Sans quantité précise', 'Avec une quantité précise'], [
    ['Du pain', 'Une tranche de pain'], ['De la soupe', 'Un bol de soupe'], ['De l’eau', 'Un verre d’eau'],
  ])),
}
