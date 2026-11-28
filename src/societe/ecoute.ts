import type { GrammarCoStatement } from '@/grammaire/exercises/co-true-false'

type Affirmation = readonly [text: string, correct: boolean, evidence: string]

const banque: Record<string, readonly Affirmation[]> = {
  voisins: [
    ['Le groupe part de Genève.', true, 'Le groupe part de Genève.'],
    ['Le groupe va en Italie.', false, 'Le groupe va à Annemasse, en France.'],
    ['Le départ est à neuf heures.', true, 'Le départ est à neuf heures.'],
  ],
  cantons: [
    ['Lina est à Sion.', true, 'Lina dit qu’elle est à Sion.'],
    ['Sion est dans le canton de Vaud.', false, 'Sion est dans le canton du Valais.'],
    ['Demain, Lina va à Lausanne.', true, 'Elle annonce qu’elle va à Lausanne demain.'],
  ],
  paysages: [
    ['La sortie se passe dans les Alpes.', true, 'Le groupe va à Zermatt, dans les Alpes.'],
    ['Le groupe se retrouve à l’école.', false, 'Le groupe se retrouve à la gare.'],
    ['Il faut prendre de bonnes chaussures.', true, 'Le message demande de prendre de bonnes chaussures.'],
  ],
  eaux: [
    ['Le groupe marche au bord du Léman.', true, 'Il marche au bord du Léman, à Genève.'],
    ['Le Rhône entre dans le lac à cet endroit.', false, 'À cet endroit, le Rhône sort du lac.'],
    ['Le rendez-vous est près du pont.', true, 'Le message indique un rendez-vous près du pont.'],
  ],
  langues: [
    ['Le point d’accueil est à Bienne.', true, 'Le point d’accueil est à Bienne.'],
    ['Le service est au numéro six.', false, 'Le service est au numéro huit.'],
    ['On peut parler allemand à l’accueil.', true, 'Le service accueille en français ou en allemand.'],
  ],
  histoire: [
    ['La Suisse devient un État fédéral en 1848.', true, 'Le message associe 1848 à la création de l’État fédéral.'],
    ['Le droit de vote des femmes est le premier événement cité.', false, 'Le message cite d’abord la création de l’État fédéral.'],
    ['La date de 1971 concerne le droit de vote au niveau fédéral.', true, 'Le message précise le niveau fédéral.'],
  ],
  commune: [
    ['Le rendez-vous est jeudi.', true, 'Le service confirme le rendez-vous de jeudi.'],
    ['Il faut aller au guichet numéro quatre.', false, 'Il faut se présenter au guichet deux.'],
    ['Le service demande une carte d’identité.', true, 'Le message demande d’apporter une carte d’identité.'],
  ],
  transports: [
    ['Le train arrive à Bienne à 9 h 20.', true, 'L’arrivée annoncée à Bienne est à 9 h 20.'],
    ['Le bus de 9 h 18 attend encore.', false, 'Le bus de 9 h 18 est déjà parti.'],
    ['Le prochain bus part du quai B.', true, 'Le prochain bus part à 9 h 38 au quai B.'],
  ],
  logement: [
    ['La buanderie rouvre mardi.', true, 'Elle rouvre mardi à onze heures.'],
    ['L’équipe doit remplacer une fenêtre.', false, 'L’équipe doit réparer un tuyau.'],
    ['En cas de fuite, il faut indiquer le numéro de la machine.', true, 'La régie demande le numéro de la machine.'],
  ],
  formation: [
    ['La séance commence à 18 h 30.', true, 'La séance est fixée à jeudi à 18 h 30.'],
    ['La présentation a lieu dans la salle quatre.', false, 'La présentation a lieu dans la salle trois.'],
    ['Il faut confirmer sa présence avant mercredi soir.', true, 'Le message demande la confirmation avant mercredi soir.'],
  ],
  'assurance-maladie': [
    ['Le message concerne un décompte de soins.', true, 'Le montant annoncé concerne les soins du mois dernier.'],
    ['La prime figure sur le même bulletin que le montant des soins.', false, 'La prime mensuelle figure sur un bulletin séparé.'],
    ['Il faut joindre la référence du décompte pour demander une vérification.', true, 'La caisse demande la référence et la question.'],
  ],
  'trois-piliers': [
    ['Le certificat de prévoyance professionnelle est disponible auprès de la caisse de pension.', true, 'Le service du personnel indique la caisse de pension.'],
    ['Le troisième pilier est obligatoire.', false, 'Le message indique qu’il est privé et facultatif.'],
    ['Une caisse de compensation AVS fournit l’extrait de compte individuel.', true, 'C’est le service indiqué pour obtenir cet extrait.'],
  ],
  pouvoirs: [
    ['Le chantier concerne le service communal des travaux.', true, 'Le message indique ce service pour le chantier de la rue des Saules.'],
    ['Le Parlement est le contact pour les règles scolaires cantonales.', false, 'Il faut contacter le service cantonal de l’enseignement.'],
    ['Le nom du greffe est indiqué sur le courrier.', true, 'Pour un litige devant un tribunal, le message renvoie au courrier.'],
  ],
  participer: [
    ['La réunion est ouverte aux habitants.', true, 'Les habitants peuvent venir le mercredi.'],
    ['Le message annonce des résultats de votation.', false, 'La commune recueille des avis sur le projet de la place.'],
    ['Un avis écrit peut être envoyé jusqu’à vendredi.', true, 'Le message donne vendredi comme limite.'],
  ],
  salaire: [
    ['Le message concerne la fiche de salaire de juin.', true, 'La fiche de juin est disponible.'],
    ['Le montant net figure avant les déductions.', false, 'Le montant net se trouve en bas de la fiche.'],
    ['Pour une question, il faut indiquer le mois et le nom de la ligne.', true, 'Le service du personnel demande ces deux informations.'],
  ],
}

export function listeningStatements(id: string): GrammarCoStatement[] | undefined {
  return banque[id]?.map(([text, correct, evidence], index) => ({
    id: `societe-${id}-vf-${index + 1}`, text, correct, evidence,
  }))
}
