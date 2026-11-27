export type GrammarCoStatement = {
  id: string
  text: string
  correct: boolean
  evidence: string
}

const statementsByAudio = {
  'gram-co-se-deplacer-piste170': [
    ['plan', 'La personne demande un plan de la ville.', true, '« Vous avez un plan de la ville, s’il vous plaît ? »'],
    ['bus', 'La personne préfère prendre le bus.', false, '« Je préfère le métro pour aller plus vite. »'],
    ['gauche', 'Après avoir traversé la rue, il faut tourner à gauche.', true, '« Vous traversez la rue, vous tournez à gauche. »'],
    ['station', 'La station de métro est en face de l’opéra.', false, '« La station de métro est en face du commissariat. »'],
    ['direct', 'Le trajet en métro est direct.', false, '« Non. Il faut changer à Opéra et prendre la ligne 7. »'],
  ],
  'gram-co-boulangerie-piste127': [
    ['croissants', 'Le client achète deux croissants.', true, '« Deux croissants, s’il vous plaît. »'],
    ['tarte', 'Il commande une tarte pour deux personnes.', false, '« Une tarte pour combien ? Pour six. »'],
    ['carte', 'Il paie avec sa carte.', true, '« Par carte ? Oui, sans contact. »'],
  ],
  'gram-co-boulangerie-piste135': [
    ['maman', 'Le message est laissé par la mère de Léa.', true, '« Salut Léa, c’est maman. »'],
    ['commerce', 'Le Macaron Doré est un restaurant.', false, '« Tu connais la pâtisserie Le Macaron Doré ? »'],
    ['gateau', 'La personne propose d’acheter un gâteau.', true, '« Je peux acheter le gâteau chez eux. »'],
  ],
  'gram-co-gare-piste171': [
    ['covoiturage', 'Marianne aime le covoiturage.', true, '« J’adore le covoiturage. »'],
    ['greve', 'En cas de grève, les trains circulent normalement.', false, '« Quand il y a une grève, les trains sont annulés. »'],
    ['fenetre', 'Claire réserve une place côté fenêtre quand elle prend le train.', true, '« Je réserve une place côté fenêtre et je dors. »'],
  ],
  'gram-co-lieux-culturels-piste226': [
    ['lieu', 'La personne va passer ses vacances à Nice.', true, '« Je vais à Nice pendant les vacances. »'],
    ['cinema', 'L’Acropolis est un cinéma.', false, '« C’est une grande salle de spectacles. »'],
    ['visite', 'La personne peut faire une visite guidée de la ville.', true, '« Tu peux faire une visite guidée et te promener. »'],
  ],
  'gram-co-hotel-piste233': [
    ['mois', 'La première famille va au festival en juillet.', true, '« En juillet, on va au festival Musilac. »'],
    ['duree', 'Le festival dure une semaine.', false, '« Ça dure quatre jours. »'],
    ['hebergement', 'La première famille dormira dans un petit hôtel.', true, '« On va dans un petit hôtel en demi-pension. »'],
  ],
  'gram-co-gare-piste180': [
    ['train', 'La personne prend un TGV.', true, '« Je prends le TGV. »'],
    ['jour', 'Elle part le dimanche.', false, '« Je prends le TGV de 6 h samedi. »'],
    ['prix', 'Le billet coûte 20 euros.', true, '« Le billet est à 20 euros. »'],
  ],
  'gram-co-restaurant-piste124': [
    ['table', 'Le serveur propose une table pour deux personnes.', false, '« Voici une table pour quatre. »'],
    ['poisson', 'Le menu spécial contient du poisson.', true, '« Un menu spécial Atlantique avec du poisson. »'],
    ['legumes', 'Le plat est servi avec des petits légumes.', true, '« Avec du poisson et des petits légumes. »'],
  ],
  'gram-co-pharmacie-piste158': [
    ['main', 'La personne a une brûlure à la main.', true, '« J’ai une brûlure à la main. »'],
    ['creme', 'Elle doit mettre la crème une fois par jour.', false, '« Une crème à mettre quatre fois par jour. »'],
    ['duree', 'Le traitement dure une semaine.', true, '« Pendant une semaine. »'],
  ],
  'gram-co-boulangerie-piste134': [
    ['chocolat', 'La personne veut un pain au chocolat.', true, '« Oui, un pain au chocolat. »'],
    ['raisin', 'Elle veut du pain au raisin.', false, '« Mais pas de pain au raisin. »'],
    ['croissant', 'La première personne propose deux croissants.', true, '« Deux baguettes, deux croissants… ? »'],
  ],
  'gram-co-hotel-piste201': [
    ['double', 'Le client demande une chambre double.', true, '« Vous avez une chambre double disponible… ? »'],
    ['dates', 'Il veut réserver pour la nuit du 13 au 14 juin.', false, '« Pour la nuit du 12 au 13 juin. »'],
    ['simple', 'L’hôtel a des chambres simples disponibles.', true, '« Non, mais nous avons des chambres simples. »'],
  ],
  'gram-co-universite-ecole-piste081': [
    ['prof', 'La personne cherche le bureau du professeur Martin.', true, '« Je cherche le bureau du professeur Martin. »'],
    ['nouveau', 'L’autre personne est nouvelle à la faculté.', true, '« Je suis nouveau à la fac. »'],
    ['secretariat', 'Elle lui conseille de demander à la bibliothèque.', false, '« Demande au secrétariat. »'],
  ],
  'gram-co-magasin-vetements-piste111': [
    ['saison', 'C’est l’été.', false, '« C’est l’hiver. »'],
    ['chaud', 'Il faut mettre des chaussures chaudes.', true, '« Mettez un manteau et des chaussures chaudes. »'],
    ['bonnet', 'Il faut penser à prendre un bonnet.', true, '« N’oubliez pas le bonnet. »'],
  ],
  'gram-co-medecin-piste145': [
    ['age', 'Le fils de Madame Martin a cinq ans.', true, '« Mon fils de cinq ans… »'],
    ['dent', 'Le garçon a une dent cassée.', true, '« …a une dent cassée. »'],
    ['cabinet', 'Le médecin lui dit de venir au cabinet médical.', false, '« Non. Appelez le cabinet dentaire, plutôt. »'],
  ],
  'gram-co-sport-piste212': [
    ['neige', 'Il neige.', true, '« Il fait froid, il neige. »'],
    ['lieu', 'Les pistes dont parle le présentateur sont dans le Jura.', false, '« Les pistes ouvrent ce week-end dans les Alpes. »'],
    ['luge', 'Le présentateur propose de préparer sa luge.', true, '« Préparez votre luge, vos skis ou votre surf. »'],
  ],
  'gram-co-quotidien-piste092': [
    ['retard', 'Christian aime être en retard.', false, '« Je n’aime pas être en retard. »'],
    ['heure', 'Quand il peut, il arrive à 7 h 30.', true, '« Quand je peux, j’arrive en avance à 7 h 30. »'],
    ['reveil', 'Il se réveille tôt.', true, '« Je me réveille tôt. »'],
  ],
  'gram-co-lieux-culturels-piste225': [
    ['sortie', 'Les deux personnes décident d’aller au théâtre.', false, '« Au cinéma. »'],
    ['seance', 'Elles choisissent la séance de 20 h 30.', true, '« 20 h 30. »'],
    ['repas', 'Elles vont manger une pizza avant la séance.', true, '« On va manger une pizza avant. »'],
  ],
  'gram-co-reglement-immeuble-piste069': [
    ['voisin', 'Le voisin est content.', false, '« Mon voisin n’est pas content. »'],
    ['musique', 'Flo écoute la musique trop fort.', true, '« J’écoute la musique trop fort. »'],
    ['calme', 'Flo dit respecter le règlement et le calme.', false, '« Je ne respecte pas le règlement et le calme. »'],
  ],
  'gram-co-se-deplacer-a2-piste_013': [
    ['accident', 'La cliente vient d’avoir un petit accident.', true, '« Je viens d’avoir un petit accident. »'],
    ['clignotant', 'Le clignotant fonctionne encore.', false, '« Le clignotant ne marche plus. »'],
    ['appel', 'Le garagiste prévoit de l’appeler dans la journée.', true, '« Je vous appelle dans la journée pour la réparation. »'],
  ],
  'gram-co-sport-a2-piste_128': [
    ['cours', 'Le cours était fatigant.', true, '« C’était un peu fatigant. »'],
    ['repos', 'Pour Amandine, on va à la salle pour se reposer.', false, '« On va à la salle pour bouger, pas pour se reposer. »'],
    ['courbatures', 'Julie pense qu’elle va avoir des courbatures.', true, '« Je vais avoir des courbatures, Amandine. »'],
  ],
  'gram-co-sante-a2-piste_118': [
    ['fumer', 'Bianca demande si elle peut fumer.', true, '« Ça te dérange si je fume ? »'],
    ['endroit', 'Claire permet à Bianca de fumer sur place.', false, '« Ici, ce n’est pas possible. Il faut que tu sortes. »'],
    ['sante', 'Claire dit que fumer est mauvais pour la santé.', true, '« Tu sais que c’est mauvais pour ta santé. »'],
  ],
  'gram-co-loisirs-a2-piste_094': [
    ['inscription', 'Il faut réserver pour participer.', false, '« Pas besoin de réserver. »'],
    ['debutants', 'Les débutants peuvent participer.', true, '« Débutants, intermédiaires, confirmés, vous pouvez tous participer. »'],
    ['heure', 'Le rendez-vous est à 10 heures.', true, '« Retrouvez-nous à 10 h place de la République. »'],
  ],
} satisfies Record<string, readonly (readonly [string, string, boolean, string])[]>

/** Les affirmations utilisent les transcriptions des pistes déjà versionnées.
 *  L’inventaire Word du complément grammaire identifie les reprises par piste. */
export function grammarCoStatements(audioId: string): GrammarCoStatement[] {
  const rows = statementsByAudio[audioId as keyof typeof statementsByAudio]
  return rows?.map(([id, text, correct, evidence]) => ({ id, text, correct, evidence })) ?? []
}
