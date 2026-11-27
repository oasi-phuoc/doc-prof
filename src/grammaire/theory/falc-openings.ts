/** Exemples résolus et repères de lecture des fiches du catalogue Grammaire. */
type TheoryOpening = {
  examples: string[]
  lines: string[]
  reference: string
}

function opening(examples: string[], lines: string[], reference: string): TheoryOpening {
  return { examples, lines, reference }
}

export const falcOpenings: Readonly<Record<string, TheoryOpening | undefined>> = {
  // Se présenter
  a1: opening(['Je {c}m’appelle{/c} Lina.', 'J’{c}habite{/c} à Sion.', 'Je {c}parle{/c} français.'], [
    'Pour dire ton prénom, commence par « Je m’appelle ».',
    'Pour dire ta ville, commence par « J’habite à ».',
    'Pour dire une langue, commence par « Je parle ».',
  ], 'Les mots pour parler de moi'),
  a2: opening(['{c}Amir{/c} travaille ici.', '{c}Il{/c} travaille ici.'], [
    '« Il » remplace « Amir ».',
    '« Il » est un pronom sujet. Il indique qui travaille.',
  ], 'Les pronoms sujets'),
  a3: opening(['Rui est {c}portugais{/c}.', 'Inês est {c}portugaise{/c}.'], [
    '« Portugais » et « portugaise » indiquent la même nationalité.',
    'Ici, la forme change avec la personne.',
    'Dans ces phrases, écris l’adjectif avec une minuscule.',
  ], 'Les formes des nationalités'),
  a6: opening(['J’habite à Genève. Je {c}viens de{/c} Sion.', 'Je {c}viens du{/c} Portugal.'], [
    '« Venir de » indique le lieu d’où tu viens.',
    'La forme change avec le lieu. Ici, « de + le » donne « du ».',
  ], 'Les formes de « venir de »'),
  famille: opening(['Voici {c}mon{/c} frère. Voici {c}ma{/c} sœur.', 'Voici {c}mes{/c} parents.'], [
    '« Mon », « ma » et « mes » viennent avant le nom.',
    'Ils indiquent que je parle de ma famille.',
    'Regarde le nom qui suit pour choisir « mon », « ma » ou « mes ».',
  ], 'Les mots de la famille'),

  // Présent
  m2: opening(['{sujet}Je{/sujet} {verbe}suis{/verbe} à Sion.', '{sujet}Nous{/sujet} {verbe}sommes{/verbe} à Sion.'], [
    'Je parle de moi. Je dis « je ».',
    'Je parle de ma sœur et de moi. Je dis « nous ».',
    '« Suis » et « sommes » sont deux formes du verbe être.',
  ], 'Les formes du verbe être'),
  m3: opening(['J’{c}ai{/c} un billet.', 'Vous {c}avez{/c} un billet.'], [
    'Le billet est dans ta poche. Tu peux dire « J’ai un billet ».',
    'Avec « je », dis « j’ai ». Avec « vous », dis « vous avez ».',
    'Le verbe avoir sert aussi à dire ton âge.',
  ], 'Les formes et les usages du verbe avoir'),
  a4: opening(['Je {c}vais à{/c} Sion.', 'Nous {c}allons au{/c} marché.', 'Nous {c}allons chez{/c} le médecin.'], [
    '« Aller » indique où tu te déplaces.',
    'Choisis la forme du verbe avec le sujet.',
    'Puis choisis le mot qui introduit le lieu.',
  ], 'Les lieux, les personnes et les formes du verbe'),
  m4: opening(['{sujet}Je{/sujet} parl{fin}e{/fin} français.', '{sujet}Nous{/sujet} parl{fin}ons{/fin} français.'], [
    '« Parler » est la forme du dictionnaire. On l’appelle l’infinitif.',
    'Ici, garde « parl- ». Change la fin selon le sujet.',
    'La fin du verbe s’appelle la terminaison.',
  ], 'Les terminaisons des verbes comme « parler »'),
  m5: opening(['Je man{c}ge{/c} à midi.', 'Nous man{c}geons{/c} à midi.'], [
    'Avec « nous », ajoute « e » avant « ons » dans « mangeons ».',
    'Ce « e » garde le même son pour la lettre « g ».',
    'D’autres verbes en -er ont aussi une écriture particulière.',
  ], 'Les verbes dont l’écriture change'),
  m6: opening(['Je {c}finis{/c} à midi. Nous {c}finissons{/c} à midi.', 'Je {c}pars{/c} à midi. Nous {c}partons{/c} à midi.'], [
    '« Finir » et « partir » se terminent par « -ir » à l’infinitif.',
    'Avec « nous », tu écris « finissons » ou « partons ».',
    'Ces verbes suivent deux modèles différents.',
  ], 'Les modèles des verbes en -ir'),
  m7: opening(['Je {c}prends{/c} le bus. Nous {c}prenons{/c} le bus.', 'Je {c}vois{/c} le bus. Nous {c}voyons{/c} le bus.'], [
    '« Prendre » et « voir » suivent des modèles différents.',
    'Repère la forme qui va avec « je », « nous » ou un autre sujet.',
  ], 'Les formes à retrouver pour chaque verbe'),
  modaux: opening(['Je {c}peux{/c} partir. Le cours est fini.', 'Je {c}dois{/c} partir. J’ai un rendez-vous.', 'Je {c}veux{/c} partir. J’en ai envie.'], [
    '« Peux » indique que c’est possible.',
    '« Dois » indique une obligation.',
    '« Veux » indique une envie ou une volonté.',
  ], 'Les formes de pouvoir, devoir et vouloir'),
  pronominaux: opening(['Je {c}me{/c} prépare.', 'Tu {c}te{/c} prépares.'], [
    '« Se préparer » est un verbe pronominal.',
    'Choisis le petit mot devant le verbe. Avec « je », mets « me ».',
    'Avec « tu », mets « te ».',
  ], 'Les pronoms devant le verbe'),
  a8: opening(['Je prends le bus.', 'Je {c}ne{/c} prends {c}pas{/c} le bus.'], [
    'Pour dire le contraire, place « ne » avant le verbe.',
    'Place « pas » après le verbe.',
    'Devant une voyelle ou un h muet, utilise « n’ ».',
  ], 'La place de « ne » et « pas »'),
  a9: opening(['Je {c}ne{/c} prends {c}jamais{/c} le bus.', 'Je {c}ne{/c} prends {c}plus{/c} le bus.'], [
    '« Jamais » veut dire à aucun moment.',
    'Avec « plus », la situation a changé. Avant, je prenais le bus.',
  ], 'Les mots de la négation et leur sens'),

  // Entrer en contact
  b1: opening(['À une amie. {c}Tu{/c} viens avec moi ?', 'À deux amis. {c}Vous{/c} venez avec moi ?'], [
    '« Tu » s’adresse à une seule personne que tu tutoies.',
    '« Vous » s’adresse à plusieurs personnes.',
    '« Vous » peut aussi marquer la politesse avec une seule personne.',
  ], 'Choisir entre tu et vous'),
  b2: opening(['Tu arrives à la pharmacie. « {c}Bonjour{/c} ! »', 'Tu pars. « {c}Au revoir{/c} ! »'], [
    'Dis « bonjour » quand tu rencontres quelqu’un pendant la journée.',
    'Dis « au revoir » au moment de partir.',
    'Avec des proches, « salut » peut servir aux deux moments.',
  ], 'Saluer quand tu arrives et quand tu pars'),
  b3: opening(['« {c}Merci{/c} de m’aider. »', '« {c}De rien{/c}. »'], [
    'La première personne remercie pour l’aide reçue.',
    'La deuxième personne répond « De rien ».',
  ], 'Remercier et répondre'),

  // Questions et exclamation
  c1: opening(['{c}Tu viens{/c} demain ?', '{c}Est-ce que{/c} tu viens demain ?', '{c}Viens-tu{/c} demain ?'], [
    'Ces trois questions demandent la même chose.',
    'À l’oral, tu peux garder « tu viens » et changer l’intonation.',
    'Dans la dernière question, « tu » vient après le verbe.',
  ], 'La forme des trois questions'),
  c2: opening(['{c}Tu travailles{/c} demain ? Oui.', '{c}Où{/c} travailles-tu ? À la poste.'], [
    'Une question fermée appelle souvent « oui » ou « non ».',
    'Une question ouverte demande une information.',
    'Ici, « où » demande un lieu.',
  ], 'Les mots pour demander une information'),
  c3: opening(['{c}Quel{/c} bus prends-tu ?', '{c}Quelle{/c} ligne prends-tu ?'], [
    'Regarde le nom. On dit « un bus » et « une ligne ».',
    'Écris « quel bus », « quelle ligne », « quels bus » ou « quelles lignes ».',
  ], 'Les quatre formes de quel'),
  c4: opening(['La salle est grande.', '{c}Comme{/c} la salle est grande {c}!{/c}'], [
    'La première phrase donne une information.',
    'La seconde montre une réaction, par exemple la surprise.',
    'Écris un point d’exclamation à la fin.',
  ], 'Les formes pour exprimer une réaction'),

  // Activités et espace
  d1: opening(['Je fais {c}du{/c} vélo.', 'Je fais {c}de la{/c} danse.', 'Je fais {c}de l’{/c}escalade.'], [
    'Pour parler d’une activité, tu peux dire « je fais ».',
    'Le nom de l’activité t’aide à choisir « du », « de la » ou « de l’ ».',
  ], 'Faire et les noms d’activités'),
  d2: opening(['Amina lave le vélo.', 'Amina {c}se{/c} lave.'], [
    'Dans la première phrase, Amina lave un objet.',
    'Dans la seconde, Amina lave son propre corps.',
    '« Se » renvoie à Amina.',
  ], 'Me, te, se, nous et vous'),
  d3: opening(['Je viens avec {c}toi{/c}.', '{c}Moi{/c}, je reste ici.'], [
    'Après « avec », utilise « toi » pour parler à quelqu’un.',
    'Tu peux aussi dire « moi » pour insister sur ta réponse.',
    '« Moi » et « toi » sont des pronoms toniques.',
  ], 'Les formes des pronoms toniques'),
  e1: opening(['La clé est {c}sur{/c} la boîte.', 'La clé est {c}dans{/c} la boîte.'], [
    'Avec « sur », la clé est posée au-dessus de la boîte.',
    'Avec « dans », la clé se trouve à l’intérieur.',
    '« Sur » et « dans » sont des prépositions de lieu.',
  ], 'Les mots pour situer un objet'),
  e6: opening(['Le vélo est {c}devant{/c} la maison.', 'Le vélo est {c}derrière{/c} la maison.'], [
    'Sur le dessin, la porte donne sur la rue.',
    '« Devant » indique le côté de la porte, dans cet exemple.',
    '« Derrière » indique le côté opposé.',
  ], 'Les autres mots pour préciser un lieu'),
  e7: opening(['Je vais {c}au{/c} marché.', 'Je reviens {c}du{/c} marché.'], [
    '« Au » réunit « à » et « le ». Il indique ici la destination.',
    '« Du » réunit « de » et « le ». Il indique ici le départ.',
  ], 'Réunir « à » ou « de » avec un article'),

  // Temps
  e2: opening(['Le cours commence {c}à 8 heures{/c}.', 'Le cours commence {c}en septembre{/c}.'], [
    'Pour dire une heure, utilise « à ».',
    'Pour dire un mois, utilise « en ».',
  ], 'Dire l’heure, la date ou la saison'),
  e3: opening(['Je travaille ici {c}depuis{/c} lundi.', 'J’ai travaillé ici {c}pendant{/c} deux jours.'], [
    '« Depuis lundi » donne le début. Je travaille encore ici.',
    '« Pendant deux jours » donne la durée du travail.',
  ], 'Le début, la durée et le moment passé'),
  e4: opening(['Je prends {c}souvent{/c} le bus.', 'Je prends {c}rarement{/c} le bus.'], [
    '« Souvent » veut dire de nombreuses fois.',
    '« Rarement » veut dire peu de fois.',
    'Ces mots indiquent la fréquence.',
  ], 'Les mots pour dire la fréquence'),
  e5: opening(['{c}D’abord{/c}, ouvre la porte.', '{c}Ensuite{/c}, allume la lumière.'], [
    '« D’abord » indique la première action.',
    '« Ensuite » indique l’action qui vient après.',
  ], 'Les mots qui donnent l’ordre des actions'),

  // Demander et décrire
  f1: opening(['Je veux {c}ce{/c} sac.', 'Je veux {c}cette{/c} valise.', 'Je veux {c}ces{/c} sacs.'], [
    'Ces mots aident à montrer de quel objet tu parles.',
    'On dit « un sac », donc « ce sac ».',
    'On dit « une valise », donc « cette valise ».',
  ], 'Les quatre mots pour montrer'),
  f2: opening(['{c}Pouvez-vous{/c} ouvrir la porte, s’il vous plaît ?', 'Tu {c}dois{/c} fermer la porte.'], [
    'Avec « Pouvez-vous… ? », je demande un service poliment.',
    'Avec « tu dois », je dis ce qu’une personne a l’obligation de faire.',
  ], 'Demander, dire une obligation ou dire une envie'),
  f3: opening(['« Tu viens manger avec nous ? »', '« {c}Oui, avec plaisir{/c}. »', '« {c}Non, merci{/c}. Je travaille. »'], [
    '« Oui, avec plaisir » permet d’accepter l’invitation.',
    '« Non, merci » permet de refuser poliment.',
  ], 'Les réponses possibles à une proposition'),
  f4: opening(['Aujourd’hui, {c}il pleut{/c}.', 'Demain, {c}il fait{/c} froid.'], [
    'Pour parler de pluie, dis « il pleut ».',
    'Pour parler de température, tu peux dire « il fait froid ».',
  ], 'Les phrases pour parler de la météo'),
  f5: opening(['{c}Il y a{/c} un homme devant la porte.', '{c}C’est{/c} mon voisin.', '{c}Il est{/c} médecin.'], [
    '« Il y a » dit qu’une personne ou une chose est présente.',
    '« C’est » aide à dire qui c’est.',
    '« Il est » peut présenter le métier.',
  ], 'Présence, identité et description'),
  f6: opening(['J’ai un sac. C’est {c}mon{/c} sac.', 'J’ai une clé. C’est {c}ma{/c} clé.', 'J’ai deux clés. Ce sont {c}mes{/c} clés.'], [
    '« Mon », « ma » et « mes » indiquent à qui appartient l’objet.',
    'Regarde aussi le nom après ce mot. « Clés » est au pluriel.',
  ], 'Choisir mon, ma, mes et les autres formes'),
  f7: opening(['Un sac {c}lourd{/c}.', 'Une valise {c}lourde{/c}.', 'Deux valises {c}lourdes{/c}.'], [
    '« Lourd » décrit le sac. C’est un adjectif.',
    'L’adjectif prend la forme du nom qu’il décrit.',
    'Avec « valises », l’adjectif est au féminin et au pluriel.',
  ], 'Les formes des adjectifs'),
  f8: opening(['Salma est {c}infirmière{/c}.', 'C’est une {c}infirmière{/c}.'], [
    'Pour dire le métier de Salma, tu peux dire « Salma est infirmière ».',
    'Avec « c’est », tu peux dire « C’est une infirmière ».',
  ], 'Les formes pour dire un métier'),
  f9: opening(['Le sac vert est {c}plus lourd que{/c} le sac gris.', 'Le sac gris est {c}moins lourd que{/c} le sac vert.'], [
    'Pour comparer le poids des sacs, utilise l’adjectif « lourd ».',
    '« Plus » et « moins » indiquent le sens de la comparaison.',
  ], 'Comparer avec plus, moins ou aussi'),
  f12: opening(['C’est une {c}petite{/c} salle.', 'C’est une salle {c}claire{/c}.'], [
    'Ici, « petite » se place avant le nom « salle ».',
    '« Claire » se place après « salle ».',
    'La place dépend de l’adjectif et parfois de son sens.',
  ], 'La place de l’adjectif dans le groupe du nom'),
  f13: opening(['Des trois sacs, le sac gris est {c}le plus léger{/c}.', 'Des trois valises, la valise verte est {c}la moins chère{/c}.'], [
    'Je compare un objet à tout le groupe.',
    '« Le plus » ou « la moins » indique un extrême dans ce groupe.',
  ], 'Les formes du superlatif'),
  f14: opening(['Lina a {c}plus de{/c} livres que Paul.', 'Lina lit {c}plus que{/c} Paul.'], [
    'Avec le nom « livres », écris « plus de livres ».',
    'Avec le verbe « lit », écris « lit plus ».',
  ], 'Comparer une quantité ou une action'),
  'description-physique': opening(['Ana a les cheveux {c}bouclés{/c}.', 'Noé a les yeux {c}marron{/c}.'], [
    'Après « avoir », nomme la partie du corps que tu décris.',
    '« Bouclés » décrit la forme des cheveux.',
    '« Marron » décrit ici la couleur des yeux.',
  ], 'Les mots pour décrire les cheveux, les yeux et le corps'),

  // Conseils
  f10: opening(['Tu {c}devrais{/c} te reposer.', 'Vous {c}pourriez{/c} prendre le bus.'], [
    '« Tu devrais » permet de donner un conseil.',
    '« Vous pourriez » permet de proposer une solution poliment.',
    'Après ces formes, utilise l’infinitif. Ici, « prendre » reste entier.',
  ], 'Les formes de devoir et pouvoir au conditionnel'),
  f11: opening(['Tu fermes la porte.', '{c}Ferme{/c} la porte, s’il te plaît.'], [
    'La seconde phrase donne une consigne.',
    '« Ferme » est à l’impératif. Le sujet « tu » disparaît.',
    'Pour ce verbe en -er, écris ici « ferme » sans « s ».',
  ], 'Les formes de l’impératif'),

  // Aliments et quantité
  g1: opening(['Je cherche {c}un{/c} citron.', 'Je cherche {c}une{/c} pomme.', 'Je cherche {c}des{/c} poires.'], [
    'Je dis quel fruit je cherche. N’importe quel citron convient.',
    '« Un », « une » et « des » sont des articles indéfinis.',
  ], 'Un, une et des'),
  g2: opening(['Tu vois une tasse sur la table ?', 'Prends {c}la{/c} tasse, s’il te plaît.'], [
    'Après la première phrase, on sait de quelle tasse je parle.',
    'J’utilise alors « la ». « La » est un article défini.',
  ], 'Le, la, l’ et les'),
  g3: opening(['Je prends {c}du{/c} pain.', 'Je prends {c}de la{/c} soupe.', 'Je prends {c}de l’{/c}eau.'], [
    'Je parle d’une quantité de pain, de soupe ou d’eau.',
    'La quantité exacte reste inconnue.',
    '« Du », « de la » et « de l’ » sont ici des articles partitifs.',
  ], 'Les articles pour une quantité non précisée'),
  g4: opening(['Il me faut {c}trois pommes{/c}.', 'Il me faut {c}un kilo de pommes{/c}.'], [
    'Un nombre peut venir directement avant le nom.',
    'Après « un kilo », ajoute « de » avant le nom.',
  ], 'Les nombres et les expressions de quantité'),
  g5: opening(['Je prends {c}quelques{/c} pommes.', 'Je prends {c}chaque{/c} pomme dans ma main.'], [
    '« Quelques » indique un petit nombre. On ne sait pas combien.',
    '« Chaque » veut dire une par une. Le nom reste au singulier.',
  ], 'Les mots de quantité devant le nom'),
  g6: opening(['Je mange {c}du{/c} pain.', 'Je reviens {c}du{/c} marché.'], [
    '« Du pain » parle ici d’une quantité.',
    'Dans « du marché », « du » réunit « de » et « le ».',
    'Regarde toute la phrase pour comprendre le sens de « du ».',
  ], 'Les formes contractées et le partitif'),

  // Passé
  h1: opening(['Aujourd’hui, je prends le bus.', 'Hier, j’{c}ai pris{/c} le bus.'], [
    'Hier, le trajet a eu lieu. Il est terminé.',
    'Dans cette phrase, « ai pris » est au passé composé.',
    'Le passé composé se forme avec deux mots. Ici, « ai » et « pris ».',
  ], 'Reconnaître le passé composé'),
  h2: opening(['Hier, Nadia {c}a rangé{/c} la salle.', 'Hier, nous {c}avons rangé{/c} la salle.'], [
    '« A » et « avons » sont des formes du verbe avoir.',
    'Choisis la forme avec le sujet.',
    'Ajoute le participe passé. Ici, c’est « rangé ».',
  ], 'Les formes d’avoir et du participe passé'),
  h3: opening(['Lina est {c}arrivée{/c} à 8 heures.', 'Lina et Sara sont {c}arrivées{/c} à 8 heures.'], [
    'Avec le verbe arriver, utilise « être » au passé composé.',
    'Dans ces exemples, « arrivées » parle de deux personnes.',
    'Le participe passé change avec le sujet. Regarde la fin du mot.',
  ], 'Choisir la forme d’être et la fin du participe'),
  h4: opening(['Avant, nous {c}habitions{/c} près de la gare.', 'Chaque matin, nous {c}prenions{/c} le bus.'], [
    '« Habitions » décrit une situation dans le passé.',
    '« Prenions » montre une habitude dans le passé.',
    'Les deux verbes sont à l’imparfait.',
  ], 'Les terminaisons de l’imparfait'),
  h5: opening(['À 8 heures, le bus {c}était déjà parti{/c}.', 'À 8 heures, je suis arrivé à l’arrêt.'], [
    'Le bus est parti en premier. Ensuite, je suis arrivé.',
    '« Était parti » est au plus-que-parfait.',
    'Utilise « avoir » ou « être » à l’imparfait. Ajoute le participe passé.',
  ], 'Le plus-que-parfait avec avoir ou être'),
  h6: opening(['Samira {c}est sortie{/c} à midi.', 'Samira {c}a sorti{/c} le pain.'], [
    'Dans la première phrase, Samira est sortie elle-même.',
    'Dans la seconde, elle a sorti quoi ? Le pain.',
    'Pour ce verbe, utilise « avoir » quand il a un complément d’objet direct.',
  ], 'Les verbes qui peuvent se construire avec être ou avoir'),
  h7: opening(['Lina {c}s’est levée{/c} à 7 heures.', 'Nous {c}nous sommes levés{/c} à 7 heures.'], [
    '« Se lever » est un verbe pronominal.',
    'Place le petit pronom avant la forme du verbe être.',
    'Ici, on lit « s’est » ou « nous sommes ».',
  ], 'Le pronom, le verbe être et le participe'),
  h8: opening(['J’{c}attendais{/c} le bus.', 'Le bus {c}est arrivé{/c}.'], [
    '« Attendais » montre une action en cours dans le passé.',
    '« Est arrivé » indique un événement qui s’est produit à ce moment-là.',
  ], 'Décrire la situation ou raconter un événement'),
  h9: opening(['Elle a {c}mangé{/c} une pomme.', 'La pomme qu’elle a {c}mangée{/c} était bonne.'], [
    'Elle a mangé quoi ? Une pomme.',
    '« Une pomme » est le complément d’objet direct.',
    'Dans la première phrase, « une pomme » vient après « mangé ».',
    'Dans la seconde, « que » vient avant « a mangée ». Il reprend « la pomme ».',
    'Avec « avoir », le participe passé s’accorde avec ce complément s’il est placé avant.',
  ], 'L’accord avec être et avec avoir'),

  // Pronoms
  i1: opening(['Je connais une femme. Cette femme travaille à la poste.', 'Je connais une femme {c}qui{/c} travaille à la poste.'], [
    'Dans la seconde phrase, « qui » reprend « une femme ».',
    'Le pronom « qui » relie les deux informations.',
    'Ici, « qui » est le sujet du verbe « travaille ».',
  ], 'Choisir qui, que, où ou dont'),
  i2: opening(['C’est mon sac. C’est {c}le mien{/c}.', 'C’est ma clé. C’est {c}la mienne{/c}.'], [
    '« Le mien » remplace « mon sac ». « La mienne » remplace « ma clé ».',
    'Regarde le nom remplacé pour choisir « le », « la » ou « les ».',
  ], 'Les pronoms possessifs'),
  i3: opening(['Je veux ce sac. Je veux {c}celui-ci{/c}.', 'Je veux cette valise. Je veux {c}celle-ci{/c}.'], [
    '« Celui-ci » remplace « ce sac ». « Celle-ci » remplace « cette valise ».',
    'Choisis « celui » ou « celle » selon le nom remplacé.',
  ], 'Les formes pour montrer sans répéter le nom'),
  i4: opening(['Je prends {c}le bus{/c}.', 'Je {c}le{/c} prends.'], [
    'Je prends quoi ? Le bus. C’est le complément d’objet direct.',
    'Le pronom « le » remplace « le bus ». Il vient ici avant « prends ».',
  ], 'Placer le, la, l’ ou les'),
  i5: opening(['Je parle {c}à Samir{/c}.', 'Je {c}lui{/c} parle.'], [
    'Je parle à qui ? À Samir. C’est le complément d’objet indirect.',
    'Avec « parler à », dis « lui » pour une personne.',
    'Dis « leur » pour plusieurs personnes.',
  ], 'Placer lui et leur'),
  i6: opening(['{c}Quelqu’un{/c} a sonné.', 'Je cherche {c}quelque chose{/c}.'], [
    '« Quelqu’un » parle d’une personne dont on ne dit pas le nom.',
    '« Quelque chose » parle d’une chose sans la nommer.',
  ], 'Les pronoms pour parler sans nommer'),
  i7: opening(['Je reviens du marché. J’{c}en{/c} reviens.', 'Je vais au marché. J’{c}y{/c} vais.'], [
    'Dans la première phrase, « en » remplace « du marché ».',
    'Dans la seconde, « y » remplace « au marché ».',
    'Regarde si le groupe indique ici le départ ou la destination.',
  ], 'Choisir en ou y selon le groupe remplacé'),
  i8: opening(['Voici le livre. Je t’ai parlé {c}de ce livre{/c}.', 'Voici le livre {c}dont{/c} je t’ai parlé.'], [
    'On dit « parler de quelque chose ».',
    'Ici, « dont » reprend « de ce livre ».',
    'Les deux informations forment une seule phrase.',
  ], 'Repérer le lien avec de'),
  i9: opening(['C’est la salle. Nous travaillons {c}dans cette salle{/c}.', 'C’est la salle {c}dans laquelle{/c} nous travaillons.'], [
    'Garde le mot « dans » pour indiquer le lieu.',
    '« Laquelle » reprend « la salle ». Le nom est féminin et singulier.',
  ], 'Les formes de lequel et leurs contractions'),

  // Action et avenir
  j1: opening(['Chut ! Le bébé {c}est en train de{/c} dormir.'], [
    'Le bébé dort au moment où je parle.',
    '« Être en train de » indique que l’action est en cours.',
    'Après « de », ajoute l’infinitif. Ici, c’est « dormir ».',
  ], 'Dire ce qui se passe en ce moment'),
  j2: opening(['Le bus {c}vient de{/c} partir.'], [
    'Le bus est parti il y a très peu de temps.',
    'Pour exprimer ce passé récent, dis « venir de » puis l’infinitif.',
  ], 'Les formes de venir pour dire ce qui vient de se passer'),
  j3: opening(['Nadia écoute la radio {c}en cuisinant{/c}.'], [
    'Nadia cuisine et écoute la radio en même temps.',
    '« En cuisinant » est au gérondif.',
    'Dans cette phrase, la même personne fait les deux actions.',
  ], 'Former et utiliser le gérondif'),
  j4: opening(['Ce soir, je {c}vais préparer{/c} le repas.', 'Ce soir, nous {c}allons préparer{/c} le repas.'], [
    'Le repas sera préparé après le moment où je parle.',
    'Choisis la forme du verbe aller. Garde ensuite « préparer » entier.',
  ], 'Aller suivi de l’infinitif'),
  j5: opening(['Demain, j’arriver{fin}ai{/fin} tôt.', 'Demain, nous arriver{fin}ons{/fin} tôt.'], [
    '« Arriverai » et « arriverons » sont au futur simple.',
    'Pour « arriver », garde l’infinitif et ajoute la terminaison du sujet.',
    'Certains verbes changent de début au futur.',
  ], 'Les terminaisons et les formes irrégulières du futur simple'),
  o1: opening(['Je {c}vais appeler{/c} Paul. J’ai mon téléphone en main.', 'À la fin du cours, j’{c}appellerai{/c} Paul.'], [
    'Les deux phrases parlent d’une action à venir.',
    'Le futur proche présente souvent une action déjà prévue.',
    'Le futur simple convient aussi pour annoncer un projet ou une promesse.',
  ], 'Choisir un futur selon la situation'),
  o2: opening(['Quand nous {c}aurons fini{/c} le repas, nous partirons.'], [
    'Nous finirons le repas en premier. Nous partirons ensuite.',
    '« Aurons fini » est au futur antérieur.',
    'Ce temps montre une action terminée avant un autre moment futur.',
  ], 'Le futur antérieur avec avoir ou être'),
  o3: opening(['{c}S’il pleut{/c} demain, nous {c}prendrons{/c} le bus.'], [
    'Il peut pleuvoir demain. C’est la condition.',
    'Après « si », le verbe « pleut » est au présent.',
    '« Nous prendrons » donne le résultat possible au futur.',
  ], 'Une condition possible et son résultat'),

  // Faits divers et hypothèses
  j6: opening(['Les pompiers ferment la route.', 'La route {c}est fermée{/c} par les pompiers.'], [
    'Dans la seconde phrase, le sujet est « la route ».',
    'Les pompiers font l’action. La route subit l’action.',
    '« Est fermée » est à la forme passive.',
  ], 'Former le passif et nommer qui fait l’action'),
  j7: opening(['Lina dit : « Je pars. »', 'Lina dit {c}qu’elle part{/c}.'], [
    'Avec les guillemets, je répète les mots exacts de Lina.',
    'Avec « que », je rapporte ses paroles dans ma phrase.',
    'Ici, « je » devient « elle » et « pars » devient « part ».',
  ], 'Rapporter des paroles et adapter les mots'),
  j8: opening(['Je {c}voudrais{/c} un verre d’eau, s’il vous plaît.', 'Tu {c}pourrais{/c} remplir ta gourde ici.'], [
    '« Voudrais » rend la demande plus polie.',
    '« Pourrais » sert ici à proposer une idée.',
    'Ces deux formes sont au conditionnel.',
  ], 'Les emplois du conditionnel présent'),
  j9: opening(['{c}Si j’avais{/c} un vélo, je {c}viendrais{/c} à vélo.'], [
    'J’imagine que j’ai un vélo.',
    'Après « si », j’utilise ici l’imparfait « avais ».',
    'Je donne le résultat imaginé au conditionnel « viendrais ».',
  ], 'Imaginer une condition et son résultat'),
  j10: opening(['Si j’avais eu ton numéro, je t’{c}aurais appelé{/c}.'], [
    'Je n’avais pas ton numéro. Je ne t’ai pas appelé.',
    'J’imagine une action passée qui n’a pas eu lieu.',
    '« Aurais appelé » est ici au conditionnel passé.',
  ], 'Former et utiliser le conditionnel passé'),

  // Argumentation et expression
  k1: opening(['« On prend le bus ? »', '« Je {c}suis d’accord{/c}. C’est plus rapide. »', '« Je {c}ne suis pas d’accord{/c}. Je préfère marcher. »'], [
    '« Je suis d’accord » indique que je partage l’avis.',
    'Je peux donner ma raison après avoir formulé mon avis.',
  ], 'Dire son accord ou son désaccord'),
  k2: opening(['Le bus est en retard. {c}Donc{/c}, j’appelle mon employeur.', 'Le bus est en retard. {c}Pourtant{/c}, j’arrive à l’heure.'], [
    'Un connecteur relie deux idées.',
    '« Donc » introduit ici un résultat.',
    '« Pourtant » annonce ici un résultat surprenant.',
  ], 'Les mots pour relier les idées'),
  k3: opening(['Je rentre {c}parce que{/c} je suis fatigué.'], [
    'Pourquoi est-ce que je rentre ? Parce que je suis fatigué.',
    '« Parce que » donne la raison. On l’appelle aussi la cause.',
  ], 'Les façons de donner une raison'),
  k4: opening(['Le bus est en retard. {c}Donc{/c}, je marche.'], [
    'Le bus est en retard. C’est la raison.',
    'Je marche. C’est le résultat. « Donc » annonce ce résultat.',
  ], 'Les mots pour annoncer un résultat'),
  k5: opening(['Je vais à la poste {c}pour{/c} envoyer une lettre.', 'Je l’écris {c}pour que{/c} mon frère reçoive des nouvelles.'], [
    '« Pour » et « pour que » indiquent ici le but.',
    'Après « pour », « envoyer » reste à l’infinitif.',
    'Après « pour que », on lit ici « mon frère reçoive ».',
  ], 'Exprimer le but avec un infinitif ou un subjonctif'),
  k6: opening(['Lina prend le bus, {c}alors que{/c} Sami va à pied.'], [
    'La phrase compare deux manières de se déplacer.',
    '« Alors que » signale la différence entre les deux choix.',
  ], 'Les mots pour opposer ou comparer deux idées'),
  k7: opening(['{c}Même s’{/c}il pleut, elle part à vélo.'], [
    'La pluie pourrait empêcher le départ à vélo.',
    'Elle part quand même. On appelle ce lien la concession.',
    'Après « même si », utilise l’indicatif. Ici, c’est « pleut ».',
  ], 'Présenter un obstacle et dire ce qui arrive quand même'),
  k8: opening(['{c}Ce qui{/c} m’aide, c’est la carte.', '{c}Ce que{/c} je cherche, c’est la gare.', '{c}Ce dont{/c} j’ai besoin, c’est un plan.'], [
    'Après « ce qui », le verbe « aide » a déjà son sujet.',
    'Après « ce que », tu vois ici le sujet « je ».',
    'On dit « avoir besoin de ». Ici, utilise « ce dont ».',
  ], 'Choisir ce qui, ce que ou ce dont'),
  k9: opening(['Je donne {c}le livre{/c} {c}à Lina{/c}.', 'Je {c}le lui{/c} donne.'], [
    '« Le » remplace « le livre ». « Lui » remplace « à Lina ».',
    'Dans cette phrase, « le » vient avant « lui ».',
    'Les deux pronoms viennent avant le verbe « donne ».',
  ], 'L’ordre de deux pronoms'),
  k10: opening(['Il faut que tu {c}viennes{/c} demain.', 'Je suis contente que tu {c}viennes{/c} demain.'], [
    '« Viennes » est au subjonctif.',
    '« Il faut que » indique ici une obligation.',
    '« Je suis contente que » indique ici un sentiment.',
  ], 'Reconnaître les expressions qui demandent le subjonctif'),
  k11: opening(['Je commence {c}à{/c} préparer le repas.', 'J’arrête {c}de{/c} préparer le repas.'], [
    'Ici, « préparer » est à l’infinitif.',
    'On apprend ensemble le premier verbe et le mot qui le suit.',
    'On dit « commencer à » et « arrêter de ».',
  ], 'Les verbes suivis de à ou de'),
  k12: opening(['Je suis contente que tu {c}aies envoyé{/c} le message.'], [
    'Tu as envoyé le message. L’envoi a déjà eu lieu.',
    'Après « je suis contente que », on utilise le subjonctif.',
    '« Aies envoyé » est au subjonctif passé.',
  ], 'Avoir ou être au subjonctif suivi du participe'),
  k13: opening(['Je crois que Lina {c}viendra{/c}.', 'Je doute que Lina {c}vienne{/c}.'], [
    '« Je crois que » présente ici une opinion. « Viendra » est à l’indicatif.',
    '« Je doute que » exprime un doute. « Vienne » est au subjonctif.',
  ], 'Choisir le subjonctif ou l’indicatif selon le sens'),
}
