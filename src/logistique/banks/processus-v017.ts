import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueProcessExercises = [
  {
    id: 'log-106-processus-recyclage-v017', module: '106', revision: 'processus-v017', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '6.4.3 Le recyclage', prompt: 'Complétez le parcours du carton propre après le déballage au dépôt.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Identifier la matière', 'Séparer le carton propre du plastique et du carton souillé.'],
      ['Trier sur place', { answer: 'Déposer le carton dans le contenant réservé à cette matière.' }],
      ['Préparer l’enlèvement', 'Regrouper les cartons triés selon la procédure du dépôt.'],
      ['Orienter le flux', { answer: 'Remettre la matière à la filière de récupération du carton.' }],
    ] },
  },
  {
    id: 'log-109-processus-acces-v017', module: '109', revision: 'processus-v017', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: "9.1 Autorisation d'accès", prompt: 'Vous devez transmettre à un collègue les données nécessaires à une livraison.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Préciser le besoin', 'Identifier les données utiles à sa tâche.'],
      ['Vérifier le droit', { answer: 'Confirmer que ce collègue est autorisé à recevoir ces données.' }],
      ['Limiter les données', { answer: 'Conserver uniquement les informations nécessaires à la livraison.' }],
      ['Transmettre', 'Utiliser le canal prévu par le site.'],
    ] },
  },
  {
    id: 'log-207-processus-offres-v017', module: '207', revision: 'processus-v017', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '7.4 Les évaluations des fournisseurs', prompt: 'Complétez les étapes pour comparer des offres sur le même besoin.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Fixer le besoin', { answer: 'Écrire les exigences indispensables et la quantité à fournir.' }],
      ['Examiner les offres', 'Écarter ou clarifier les offres qui ne répondent pas aux exigences.'],
      ['Appliquer les critères', { answer: 'Noter les offres comparables selon les critères et leur pondération.' }],
      ['Décider', 'Comparer les scores et justifier le choix par les données.'],
    ] },
  },
  {
    id: 'log-303-processus-quai-v017', module: '303', revision: 'processus-v017', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '3.3.1 Réception planifiée', prompt: 'Vous attendez une livraison planifiée. Complétez son parcours au quai.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Préparer l’arrivée', 'Vérifier le créneau, l’annonce et la place disponible au quai.'],
      ['Contrôler la marchandise', { answer: 'Comparer la livraison au dossier et signaler les écarts constatés.' }],
      ['Enregistrer la réception', { answer: 'Inscrire les quantités et l’état réellement constatés dans le système.' }],
      ['Transférer', 'Orienter les articles vers la zone prévue selon leur statut.'],
    ] },
  },
  {
    id: 'log-307-processus-dommage-v017', module: '307', revision: 'processus-v017', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '7.3 En cas de dommage', prompt: 'Une caisse arrive écrasée par camion. Complétez le schéma de traitement du dommage.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Signaler', { answer: 'Avertir le responsable dès le constat.' }],
      ['Relever les faits', 'Décrire le dommage sur le formulaire avec la référence du colis.'],
      ['Joindre les preuves', { answer: 'Photographier le défaut et relier les photos au constat.' }],
      ['Transmettre', 'Suivre la procédure du site et transmettre le dossier au destinataire prévu.'],
    ] },
  },
  {
    id: 'log-601-processus-pick-pack-v017', module: '601', revision: 'processus-v017', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.3 Pick-and-Pack', prompt: 'Complétez le processus Pick-and-Pack pour des articles déjà préemballés.', answer: '',
    table: { presentation: 'processus-a-completer', headers: ['Étape', 'Action'], rows: [
      ['Préparer le colis', 'Sélectionner l’emballage de départ prévu pour la commande.'],
      ['Prélever et emballer', { answer: 'Déposer directement les articles prélevés dans le colis de départ.' }],
      ['Contrôler le contenu', { answer: 'Vérifier les références et les quantités de la commande.' }],
      ['Clôturer la préparation', 'Fermer le colis après le contrôle.'],
    ] },
  },
] satisfies readonly LogistiqueUnit[]
