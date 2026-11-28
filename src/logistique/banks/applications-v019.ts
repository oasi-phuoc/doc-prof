import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueApplicationExercises = [
  {
    id: 'log-302-processus-confirmation-v019', module: '302', revision: 'applications-v019', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '2.3.3 La confirmation de commande',
    prompt: 'La confirmation du fournisseur indique jeudi. La commande exige mardi.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Rapprocher les pièces', 'Vérifier que la confirmation concerne bien la commande.'],
      ['Identifier l’écart', { answer: 'Repérer le décalage entre les dates de livraison.' }],
      ['Clarifier', { answer: 'Demander au fournisseur de confirmer le délai qui peut être tenu.' }],
      ['Mettre à jour le dossier', 'Inscrire la date convenue et informer la personne qui attend la livraison.'],
    ] },
  },
  {
    id: 'log-309-decision-controle-serie-v019', module: '309', revision: 'applications-v019', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '9.6.1 Contrôle complet',
    prompt: 'Vous trouvez un emballage ouvert dans un lot. Le client exige que chaque emballage soit fermé.', answer: '',
    table: {
      presentation: 'justifier-decision', title: 'Contrôle avant libération du lot', headers: ['Méthode', 'Contrôle prévu'],
      rows: [['Contrôle complet', 'Les 30 emballages'], ['Échantillonnage', '5 emballages sur 30']],
      questions: [
        { prompt: 'Quelle méthode choisissez-vous ? Justifiez votre choix.', answer: 'Le contrôle complet, pour vérifier la fermeture de chaque emballage.' },
        { prompt: 'Que faites-vous des emballages ouverts ?', answer: 'Les isoler selon la procédure et enregistrer les défauts constatés.' },
        { prompt: 'Que notez-vous sur le relevé de contrôle ?', answer: 'La référence du lot, le nombre contrôlé et le nombre d’emballages ouverts.' },
      ],
    },
  },
  {
    id: 'log-402-decision-sites-v019', module: '402', revision: 'applications-v019', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '2.3.1 Centralisé vs décentralisé (production)',
    prompt: 'Vous desservez deux ateliers. Ils doivent recevoir les pièces en 4 h au maximum.', answer: '',
    table: {
      presentation: 'justifier-decision', title: 'Deux organisations possibles', headers: ['Organisation', 'Délai maximal', 'Coût par semaine'],
      rows: [['Un dépôt central', '6 h', '900 CHF'], ['Deux dépôts de proximité', '3 h', '1 050 CHF']],
      questions: [
        { prompt: 'Quelle organisation retenez-vous ? Justifiez avec le délai.', answer: 'Les dépôts de proximité. Leur délai maximal de 3 h respecte la limite de 4 h.' },
        { prompt: 'Quel compromis présentez-vous à votre responsable ?', answer: 'Le délai est respecté avec un coût supérieur de 150 CHF par semaine.' },
        { prompt: 'Quelle mesure permet de vérifier le service après le changement ?', answer: 'Le délai réel entre la demande de pièces et la livraison à chaque atelier.' },
      ],
    },
  },
  {
    id: 'log-404-processus-humidite-v019', module: '404', revision: 'applications-v019', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '4.4 Conditions pour un stockage optimal',
    prompt: 'Des cartons secs arrivent après une fuite dans la zone prévue. Complétez la marche à suivre.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Sécuriser la zone', 'Signaler l’humidité avant tout déplacement des cartons.'],
      ['Choisir un autre emplacement', { answer: 'Vérifier qu’un emplacement propre, sec et autorisé est disponible.' }],
      ['Entreposer', { answer: 'Placer les cartons dans cet emplacement et en noter la référence.' }],
      ['Suivre la fuite', 'Attendre la remise en état avant d’utiliser l’ancienne zone.'],
    ] },
  },
  {
    id: 'log-502-cas-alimentation-v019', module: '502', revision: 'applications-v019', kind: 'situation', approvedFor: ['CFC'],
    theorySection: "2.3.1 Stocks d'approvisionnement / de production",
    prompt: 'Vous alimentez le poste d’assemblage. Il doit pouvoir utiliser 40 pièces avant le prochain passage.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Relevé du poste', headers: ['État', 'Quantité'],
      rows: [['Pièces prêtes au poste', '24 pièces'], ['Pièces à contrôler', '12 pièces']],
      questions: [
        { kind: 'choix', prompt: 'Quel stock compte pour alimenter le poste maintenant ?', options: ['Pièces prêtes', 'Pièces à contrôler', 'Les deux stocks'], answer: 'Pièces prêtes', points: 1 },
        { kind: 'calcul', prompt: 'Combien de pièces prêtes apportez-vous ?', calculation: '40 − 24 = 16 pièces', answer: 'Vous apportez 16 pièces prêtes.', points: 3 },
        { prompt: 'Pourquoi séparer les pièces à contrôler ?', answer: 'Pour éviter leur utilisation avant la validation du contrôle.', points: 2 },
      ],
    },
  },
  {
    id: 'log-504-processus-two-bin-v019', module: '504', revision: 'applications-v019', kind: 'verification', approvedFor: ['CFC'],
    theorySection: '4.3 Système Two-Bin',
    prompt: 'Le bac de service est vide. Complétez le réapprovisionnement avec le système Two-Bin.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Constater le signal', 'Repérer le bac de service vide.'],
      ['Déclencher le réassort', { answer: 'Envoyer le signal prévu pour faire remplir le bac vide.' }],
      ['Maintenir le service', { answer: 'Prélever dans le second bac pendant le réapprovisionnement.' }],
      ['Reconstituer la réserve', 'Remettre le bac rempli derrière le bac en service.'],
    ] },
  },
  {
    id: 'log-602-decision-rembourrage-v019', module: '602', revision: 'applications-v019', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '2.3.2 Accessoires de rembourrage',
    prompt: 'Une pièce fragile bouge dans le carton fermé. Deux moyens sont disponibles.', answer: '',
    table: {
      presentation: 'justifier-decision', title: 'Protection de la pièce', headers: ['Moyen', 'Effet constaté'],
      rows: [['Cales adaptées', 'Bloquent le mouvement'], ['Intercalaire plat', 'Sépare, avec du jeu sur les côtés']],
      questions: [
        { prompt: 'Que choisissez-vous ? Justifiez votre choix.', answer: 'Les cales adaptées, car elles immobilisent la pièce dans le carton.' },
        { prompt: 'Que contrôlez-vous avant la fermeture ?', answer: 'La pièce ne bouge plus et le carton se ferme sans comprimer la pièce.' },
        { prompt: 'Quelle indication transmettez-vous pour les prochains colis ?', answer: 'Le type de cales et leur position dans le carton.' },
      ],
    },
  },
  {
    id: 'log-605-cas-departs-postaux-v019', module: '605', revision: 'applications-v019', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: "5.2 Modes d'envoi",
    prompt: 'Vous préparez l’enlèvement postal. Les envois prêts et ceux dont l’adresse est incomplète sont séparés.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Relevé avant enlèvement', headers: ['Statut', 'Lettres', 'Colis'],
      rows: [['Prêts', '18', '6'], ['Adresse incomplète', '3', '2']],
      questions: [
        { kind: 'choix', prompt: 'Quel groupe remettez-vous au transporteur ?', options: ['Prêts', 'Adresse incomplète', 'Tous les envois'], answer: 'Prêts', points: 1 },
        { kind: 'calcul', prompt: 'Combien d’envois remettez-vous au total ?', calculation: '18 + 6 = 24 envois', answer: 'Vous remettez 24 envois.', points: 3 },
        { prompt: 'Que faites-vous des autres envois ?', answer: 'Compléter et vérifier les adresses avant un prochain départ.', points: 2 },
      ],
    },
  },
] satisfies readonly LogistiqueUnit[]
