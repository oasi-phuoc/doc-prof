import type { GrammarTheoryBlock, TheoryImageCell } from '@/francais/grammar-theory'

type Practice = Extract<GrammarTheoryBlock, { kind: 'practice' }>
type ContextualLesson = {
  comparison: Extract<GrammarTheoryBlock, { kind: 'image-row' }>
  repere: string[]
  practice: Practice
  reference: GrammarTheoryBlock[]
}

function scene(caption: string, description: string, example: string, alt: string, src = ''): TheoryImageCell {
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
      'À dessiner. Yara, une jeune adulte, se présente à une enseignante à l’entrée d’une salle de cours.'),
    scene('Dire où on habite', 'L’enseignante pose une deuxième question. Yara donne sa ville.', '« {c}J’habite à{/c} Sion. »',
      'À dessiner. Les mêmes personnages consultent une carte simplifiée du Valais avec un point à Sion. La légende de la fiche donne le nom.'),
  ], ['Pour dire ton prénom, commence par {c}je m’appelle{/c}.', 'Pour nommer ta ville, commence par {c}j’habite à{/c}.', 'Pour parler d’une langue, dis « Je parle français », par exemple.'],
  'Complète avec « m’appelle » ou « habite ».', [
    exercise('Je dis mon prénom. « Je ___ Daniel. »', 'm’appelle', 'Daniel est un prénom.'),
    exercise('Je donne ma ville. « J’___ à Martigny. »', 'habite', 'Martigny est la ville où je vis.'),
  ], reference('Dire plusieurs choses sur moi', ['Ce que je dis', 'Ma phrase'], [
    ['Mon prénom', 'Je m’appelle Yara.'], ['Ma ville', 'J’habite à Sion.'], ['Une langue', 'Je parle arabe.'], ['Ma nationalité', 'Je suis suisse.'],
  ])),

  a3: lesson('Lire deux présentations avec la même nationalité', [
    scene('Rui se présente', 'Rui montre son pays sur la carte.', '« Je suis {c}portugais{/c}. »',
      'Carte du Portugal aux couleurs de son drapeau.', '/lib/images/vocabulaire/pays/portugal.webp'),
    scene('Inês se présente', 'Inês montre le même pays.', '« Je suis {c}portugaise{/c}. »',
      'La même carte du Portugal, le pays d’Inês et de Rui.', '/lib/images/vocabulaire/pays/portugal.webp'),
  ], ['« Portugais » et « portugaise » indiquent la même nationalité.', 'Dans ces phrases, la forme change avec la personne.', 'Écris l’adjectif de nationalité avec une minuscule.'],
  'Complète avec « portugais » ou « portugaise ».', [
    exercise('C’est Ana. Elle dit « Je suis ___. »', 'portugaise', 'Ana utilise ici la forme féminine.'),
    exercise('C’est Rui. Il dit « Je suis ___. »', 'portugais', 'Rui utilise ici la forme masculine.'),
  ], reference('Les formes changent selon le mot', ['Masculin', 'Féminin'], [
    ['français', 'française'], ['italien', 'italienne'], ['marocain', 'marocaine'], ['suisse', 'suisse'],
  ])),

  a6: lesson('Dire d’où on vient', [
    scene('Une ville', 'Sara montre la ville de Sion.', '« Je viens {c}de{/c} Sion. »',
      'À dessiner. Sara, une jeune femme avec une veste jaune, montre le point de Sion sur une carte locale simple.'),
    scene('Un pays', 'Mateus montre le Portugal.', '« Je viens {c}du{/c} Portugal. »',
      'À dessiner. Mateus montre le Portugal en couleur sur une carte d’Europe. Éviter les détails qui détournent du pays.'),
  ], ['« Je viens de » indique un lieu de départ ou d’origine.', 'Devant le nom « le Portugal », {c}du{/c} réunit « de » et « le ».'],
  'Complète avec « de » ou « du ».', [
    exercise('Lina vient ___ Lausanne.', 'de', 'Lausanne est une ville. On dit « de Lausanne ». '),
    exercise('Mateus vient ___ Portugal.', 'du', 'On dit « le Portugal ». Ici, « de + le » devient « du ». '),
  ], reference('Choisir la forme avec le nom du lieu', ['Lieu', 'Je viens…'], [
    ['Sion', 'de Sion'], ['La Suisse', 'de Suisse'], ['L’Italie', 'd’Italie'], ['Le Maroc', 'du Maroc'], ['Les Philippines', 'des Philippines'],
  ])),

  famille: lesson('Présenter deux personnes de la famille', [
    scene('Parler de son frère', 'Sana montre son frère à une amie.', '« Voici {c}mon{/c} frère. »',
      'À dessiner. Sana montre un portrait de son frère adulte sur une planche de photos de famille.'),
    scene('Parler de sa sœur', 'Sana montre sa sœur à la même amie.', '« Voici {c}ma{/c} sœur. »',
      'À dessiner. Même planche de photos et même personne. Sana indique le portrait de sa sœur adulte.'),
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
      'À dessiner. Simran salue une serveuse à l’entrée d’un restaurant. Dehors, le ciel est sombre et les lampes de la rue sont allumées.'),
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
      'À dessiner. Dans un couloir de cours, Lila, étudiante avec un foulard mauve, rend deux cahiers à Ravi, qui utilise un fauteuil roulant.'),
    scene('Je réponds', 'Lila reçoit le merci de Ravi.', 'Lila répond « {c}De rien{/c} ! »',
      'À dessiner. Dans le même couloir, Ravi tient ses cahiers et sourit. Lila lui répond. Garder les personnages du premier dessin.'),
  ], ['Dis {c}merci{/c} quand quelqu’un t’aide.', 'Quand on te dit « merci », tu peux répondre {c}de rien{/c}.'],
  'Complète avec « merci » ou « de rien ».', [
    exercise('On te prête un stylo. Tu dis « ___ ! »', 'Merci', 'Tu remercies la personne qui te prête le stylo.'),
    exercise('Tu rends un service. On te dit merci. Tu réponds « ___ ! »', 'De rien', 'Tu réponds à la personne qui te remercie.'),
  ], reference('Remercier et répondre avec d’autres mots', ['Pour remercier', 'Pour répondre'], [
    ['Merci beaucoup !', 'Avec plaisir !'], ['C’est gentil de votre part !', 'Je vous en prie !'], ['Merci de m’avoir aidé.', 'Il n’y a pas de quoi.'],
  ])),

  a2: lesson('La même personne parle ou devient le sujet de la phrase', [
    scene('Je parle de moi', 'Nora montre son tablier et parle de son travail.', 'Nora dit « {c}Je{/c} travaille ici. »',
      'À dessiner. Une employée adulte avec des lunettes, debout dans un atelier de réparation, se désigne avec la main.'),
    scene('On parle de Nora', 'Un collègue parle de Nora à une cliente.', 'Il dit « {c}Elle{/c} travaille ici. »',
      'À dessiner. Dans le même atelier, un collègue indique Nora à une cliente. Garder le même tablier pour Nora.'),
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
      'À dessiner. Lina attend au téléphone devant une gare et porte une veste mauve. Elle est seule au premier plan.'),
    scene('Nous sommes à la gare', 'Lina attend avec une amie devant la même gare.', '« {sujet}Nous{/sujet} {verbe}sommes{/verbe} à la gare. »',
      'À dessiner. Même gare et même Lina. Une amie est maintenant à ses côtés. Lina téléphone toujours.'),
  ], ['Je parle de moi. Je dis {c}je suis{/c}.', 'Je parle de moi et d’une autre personne. Je dis {c}nous sommes{/c}.', '« Suis » et « sommes » sont deux formes du verbe être.'],
  'Complète avec « suis » ou « sommes ».', [
    exercise('J’appelle le secrétariat. « Bonjour, je ___ devant la salle. »', 'suis', 'Avec « je », écris « suis ». '),
    exercise('Ma sœur est avec moi. « Nous ___ devant la salle. »', 'sommes', 'Je parle de ma sœur et de moi. Écris « nous sommes ». '),
  ], [
    { kind: 'heading', sub: true, text: 'Dire comment on se sent' },
    { kind: 'image-row', label: 'Deux émotions dans des situations différentes', cells: [
      scene('Contente', 'Lina reçoit une bonne nouvelle. Elle sourit.', 'Lina {verbe}est{/verbe} {c}contente{/c}.',
        'Portrait de Lina avec un grand sourire.', '/lib/images/vocabulaire/famille-personnes/contente.webp'),
      scene('Inquiète', 'Anna attend une nouvelle importante.', 'Anna {verbe}est{/verbe} {c}inquiète{/c}.',
        'Anna attend sur un banc, les mains serrées et le visage soucieux.', '/lib/images/tcf/qcm-audit/qcm-delf2-attente-inquietude.png'),
    ] },
    { kind: 'paragraph', text: 'Après « je suis » ou « elle est », tu peux dire une émotion. Lina dit « Je suis contente ». ' },
    { kind: 'page' },
    { kind: 'heading', sub: true, text: 'Donner son métier ou sa nationalité' },
    { kind: 'image-row', label: 'Deux informations pour se présenter', cells: [
      scene('Un métier', 'Amir travaille le bois dans un atelier. Il présente son métier.', '« Je {verbe}suis{/verbe} {c}menuisier{/c}. »',
        'Amir travaille une planche avec un rabot dans un atelier.', '/lib/images/tcf/catalogue/metiers/menuisier.webp'),
      scene('Une nationalité', 'Au guichet, Mauro donne sa nationalité.', '« Je {verbe}suis{/verbe} {c}suisse{/c}. »',
        'Carte de la Suisse, rouge avec une croix blanche.', '/lib/images/vocabulaire/pays/suisse.webp'),
    ] },
    { kind: 'paragraph', text: 'Le mot après « je suis » donne l’information. Par exemple, « menuisier » donne le métier.' },
    { kind: 'page' },
    ...reference('Les formes du verbe être au présent', ['Pronom', 'Forme et exemple'], [
      ['Je', 'suis · Je suis à la gare.'], ['Tu', 'es · Tu es prêt.'], ['Il / elle / on', 'est · Elle est cuisinière.'],
      ['Nous', 'sommes · Nous sommes à Sion.'], ['Vous', 'êtes · Vous êtes là.'], ['Ils / elles', 'sont · Elles sont fatiguées.'],
    ]),
  ]),

  m3: lesson('Dire ce que j’ai ou donner mon âge', [
    scene('Un objet', 'Rayan montre son billet au contrôleur.', '« J’{c}ai{/c} un billet. »',
      'À dessiner. Une personne tient un billet près du quai. Le papier est visible sans texte imprimé.'),
    scene('Un âge', 'Rayan remplit sa fiche. Il dit son âge.', '« J’{c}ai{/c} 25 ans. »',
      'À dessiner. Rayan remplit une fiche à un guichet. Prévoir de la place au-dessus pour une légende indépendante.'),
  ], ['Le verbe avoir peut dire ce que tu as avec toi.', 'Pour donner ton âge, utilise aussi le verbe avoir.', 'Avec « je », on écrit « j’ai ». Avec « vous », on écrit « vous avez ».'],
  'Complète avec « ai » ou « avez ».', [
    exercise('Je montre mon sac. « J’___ un sac. »', 'ai', 'Avec « je », dis « j’ai ». '),
    exercise('L’employée parle à une personne. « Vous ___ un billet ? »', 'avez', 'Avec « vous », dis « vous avez ». '),
  ], reference('Les formes et les usages du verbe avoir', ['Pronom', 'Forme et exemple'], [
    ['Je / tu', 'J’ai 25 ans. Tu as un ticket.'], ['Il / elle / on', 'Il a une clé.'], ['Nous / vous', 'Nous avons soif. Vous avez froid.'], ['Ils / elles', 'Elles ont un rendez-vous.'],
  ])),

  a4: lesson('Donner sa destination', [
    scene('Une ville', 'Fatima monte dans un train pour Sion.', '« Je {c}vais à{/c} Sion. »',
      'À dessiner. Fatima avec un sac et une canne monte dans un train. Une légende indépendante donne le nom de la ville.'),
    scene('Un lieu', 'Fatima se rend au marché.', '« Je {c}vais au{/c} marché. »',
      'À dessiner. Fatima avec le même sac arrive au marché. Deux étals suffisent pour situer l’endroit.'),
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
      'À dessiner. Awa monte dans un bus à l’arrêt. Montrer une porte ouverte et un pied déjà sur la marche.'),
    scene('Je pars à pied', 'Ce matin, Awa choisit de marcher.', '« Je {c}ne{/c} prends {c}pas{/c} le bus. »',
      'À dessiner. Même Awa au même arrêt. Le bus est au loin et Awa marche sur le trottoir dans une autre direction.'),
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
      'À dessiner. Deux amis parlent au seuil d’une salle de cours. Maël doit poser une question, avec un geste simple.'),
    scene('Une autre façon de poser la question', 'Maël pose la même question à son amie.', '« {c}Est-ce que{/c} tu viens demain ? »',
      'À dessiner. Même paire, même couloir. Les paroles apparaîtront dans la légende, en texte sélectionnable.'),
  ], ['Ces phrases demandent la même chose.', 'À l’oral, ta voix peut montrer que « Tu viens demain ? » est une question.', 'Tu peux aussi commencer la phrase par « est-ce que ».'],
  'Complète avec « Est-ce que » ou « ? ».', [
    exercise('___ tu travailles demain ?', 'Est-ce que', 'La question commence par « Est-ce que ». '),
    exercise('Tu prends le train demain ___', '?', 'À l’écrit, termine la question par un point d’interrogation.'),
  ], reference('Les trois façons de poser une question', ['Forme', 'La même question'], [
    ['Voix qui monte à l’oral', 'Tu viens demain ?'], ['Est-ce que', 'Est-ce que tu viens demain ?'], ['Sujet après le verbe', 'Viens-tu demain ? Le trait relie « viens » et « tu ».'],
  ])),

  c2: lesson('Demander une confirmation ou une information', [
    scene('Je veux savoir si c’est ouvert', 'Eva demande une confirmation à l’accueil.', '« La poste est ouverte ? » « {c}Oui{/c}. »',
      'À dessiner. Eva et un employé se parlent à l’accueil de la poste. Les paroles seront écrites en dehors de l’image.'),
    scene('Je veux une heure', 'Eva demande l’heure de fermeture.', '« {c}À quelle heure{/c} fermez-vous ? » « À 18 heures. »',
      'À dessiner. Même accueil de la poste. L’employé montre une horloge simple réglée à 18 heures.'),
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
      'À dessiner. Une clé jaune repose sur le couvercle d’une boîte bleue. Montrer le contact entre la clé et le couvercle.'),
    scene('Dans la boîte', 'La clé est à l’intérieur.', 'La clé est {c}dans{/c} la boîte.',
      'À dessiner. La même clé jaune est visible à l’intérieur de la même boîte bleue, dont le couvercle est ouvert.'),
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
      'À dessiner. Une horloge simple montre 9 heures, grande aiguille en haut et petite aiguille à gauche. Fond clair et uni.'),
    scene('Une date', 'Le calendrier indique le 14 mars.', 'Je viens {c}le{/c} 14 mars.',
      'À dessiner. Page de calendrier de mars, le 14 clairement entouré. Le mot « mars » et la date restent en texte dans la légende.'),
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
      'À dessiner. Une frise montre un point de départ lundi et une flèche qui continue jusqu’à aujourd’hui.'),
    scene('La durée', 'Aïcha travaille de 9 heures à 11 heures demain.', 'Je travaille {c}pendant{/c} deux heures.',
      'À dessiner. Deux petites horloges, à 9 heures et à 11 heures, reliées par un trait qui montre la durée de deux heures.'),
  ], ['Avec {c}depuis{/c}, l’action a commencé et continue au moment dont tu parles.', '{c}Pendant{/c} donne la durée de l’action, au passé, au présent ou au futur.'],
  'Complète avec « depuis » ou « pendant ».', [
    exercise('J’habite ici ___ juin. J’habite toujours ici.', 'depuis', 'Juin indique le début et j’habite encore ici.'),
    exercise('Demain, je travaille de 9 heures à midi. Je travaille ___ trois heures.', 'pendant', 'Trois heures donne la durée du travail prévu.'),
  ], reference('Deux autres façons de parler du temps', ['Mot', 'Exemple'], [
    ['pour, une durée prévue', 'Je pars pour une semaine.'], ['il y a, un moment dans le passé', 'Je suis arrivée il y a trois jours.'],
    ['depuis, avec une durée', 'J’habite ici depuis deux ans. J’habite encore ici.'],
  ])),

  f1: lesson('Montrer un sac ou une valise au magasin', [
    scene('Un sac', 'L’élève montre un sac près du comptoir.', '« Je voudrais {c}ce{/c} sac. »',
      'À dessiner. Une jeune femme aux cheveux épais et courts montre un sac vert sur le comptoir d’une boutique.'),
    scene('Une valise', 'L’élève montre une valise près du comptoir.', '« Je voudrais {c}cette{/c} valise. »',
      'À dessiner. Même boutique et même personne. Elle montre une valise à roulettes au même emplacement.'),
  ], ['Regarde le nom qui vient après le mot. On dit « un sac » et « une valise ».', 'Pour montrer plusieurs objets, dis {c}ces{/c}. Exemple. « Ces sacs ».'],
  'Complète avec « ce », « cette », « cet » ou « ces ».', [
    exercise('Je montre une chaise. « Est-ce que ___ chaise est libre ? »', 'cette', '« Chaise » est un nom féminin. On dit « une chaise ». '),
    exercise('Je montre deux chaises. « Est-ce que ___ chaises sont libres ? »', 'ces', 'Je montre plusieurs chaises. Au pluriel, écris « ces ». '),
  ], reference('Les quatre formes pour montrer', ['Le nom', 'Je montre'], [
    ['Un sac', 'Ce sac'], ['Un ordinateur. Le début est une voyelle.', 'Cet ordinateur'],
    ['Un homme. Le h est muet.', 'Cet homme'], ['Une chaise', 'Cette chaise'], ['Des sacs ou des chaises', 'Ces sacs ou ces chaises'],
  ])),

  f4: lesson('Dire le temps qu’il fait', [
    scene('De la pluie', 'Maya ouvre son parapluie.', '{c}Il pleut.{/c}',
      'À dessiner. Maya, adulte aux cheveux noirs attachés, tient un parapluie sous des gouttes de pluie bien visibles.'),
    scene('Du froid', 'Idris porte un manteau, une écharpe et des gants.', '{c}Il fait froid.{/c}',
      'À dessiner. Idris, homme âgé, porte des gants et une écharpe un jour froid. Aucun signe de pluie.'),
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
      'À dessiner. Éva coupe une tranche dans un pain posé sur une planche. Le pain entier et la tranche sont bien visibles.'),
    scene('Une quantité de soupe', 'Tenzin se sert. On ne dit pas combien de soupe il prend.', 'Je prends {c}de la{/c} soupe.',
      'À dessiner. Tenzin, adulte en pull bleu, verse de la soupe d’une soupière dans un bol. Le geste et la soupe sont bien visibles.'),
  ], ['« Du », « de la » et « de l’ » indiquent ici une quantité non précisée.', 'On dit {c}du{/c} pain, {c}de la{/c} soupe et {c}de l’{/c}eau.'],
  'Complète avec « du », « de la » ou « de l’ ».', [
    exercise('Tu verses une quantité de lait. « Je prends ___ lait. »', 'du', 'On dit « le lait ». Dans cette phrase, écris « du lait ». '),
    exercise('Tu verses une quantité d’eau. « Je prends ___eau. »', 'de l’', '« Eau » commence par une voyelle. Écris « de l’eau ». '),
  ], reference('Parler d’une quantité ou la préciser', ['Sans quantité précise', 'Avec une quantité précise'], [
    ['Du pain', 'Une tranche de pain'], ['De la soupe', 'Un bol de soupe'], ['De l’eau', 'Un verre d’eau'],
  ])),
}
