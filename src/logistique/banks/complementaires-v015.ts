import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueComplementaryFormats = [
  {
    id: 'log-101-frise-transport-v015', module: '101', revision: 'complementaires-v015', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.3 Les grandes étapes de la logistique',
    prompt: 'Complétez la frise. Les dates manquantes sont 1956 et 1896.', answer: '',
    table: { presentation: 'frise-chronologique', headers: ['Date', 'Évolution du transport'], rows: [
      ['1804', 'Une locomotive à vapeur transporte une charge sur des rails.'],
      [{ answer: '1896' }, 'Un des premiers camions automobiles transporte des marchandises.'],
      ['1948', 'L’aéroport de Kloten entre en exploitation.'],
      [{ answer: '1956' }, 'Le transport maritime par conteneurs se développe avec Malcolm McLean.'],
    ] },
  },
  {
    id: 'log-101-frise-suivi-v015', module: '101', revision: 'complementaires-v015', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.4 L’évolution de l’informatique',
    prompt: 'Complétez l’évolution du suivi des marchandises, du registre papier au scan.', answer: '',
    table: { presentation: 'frise-chronologique', headers: ['Repère', 'Trace du mouvement'], rows: [
      ['Au départ', 'Le magasinier note l’entrée dans un registre papier.'],
      ['Ensuite', { answer: 'Les postes consultent des données saisies dans une base commune.' }],
      ['Suivi mobile', { answer: 'Le scan associe un article, un emplacement et un mouvement.' }],
    ] },
  },
  {
    id: 'log-701-frise-plan-inventaire-v015', module: '701', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.3 Déroulement',
    prompt: 'Complétez le planning d’inventaire. Le comptage a lieu le 26 novembre et les écarts sont examinés le lendemain.', answer: '',
    table: { presentation: 'frise-chronologique', headers: ['Date', 'Action'], rows: [
      ['24 novembre', 'Étiqueter les zones et confirmer l’unité de comptage.'],
      [{ answer: '26 novembre' }, 'Relever les quantités physiques.'],
      [{ answer: '27 novembre' }, 'Comparer les relevés et traiter les écarts selon la procédure.'],
    ] },
  },
  {
    id: 'log-901-frise-projet-v015', module: '901', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC'],
    theorySection: '1. Planifier et évaluer les projets logistiques',
    prompt: 'Un dépôt prépare un nouveau plan de circulation. Nommez les phases manquantes dans la frise du projet.', answer: '',
    table: { presentation: 'frise-chronologique', headers: ['Échéance', 'Phase du projet'], rows: [
      ['2 septembre', 'Faisabilité. Comparer l’espace et les contraintes des solutions.'],
      ['16 septembre', { answer: 'Planification. Fixer les tâches, leurs responsables et les délais.' }],
      ['7 octobre', 'Exécution. Mettre en place le plan retenu.'],
      ['21 octobre', { answer: 'Évaluation. Comparer le résultat et les objectifs du mandat.' }],
    ] },
  },
  {
    id: 'log-207-justifier-offre-v015', module: '207', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '7.4 Les évaluations des fournisseurs',
    prompt: 'Vous commandez 120 bacs à recevoir sous 3 jours. Votre budget est de 600 CHF, livraison comprise.', answer: '',
    table: { presentation: 'justifier-decision', title: 'Offres de deux fournisseurs', headers: ['Offre', 'Quantité et délai', 'Total'], rows: [
      ['A', '120 bacs sous 3 jours', '570 CHF'], ['B', '110 bacs sous 2 jours', '520 CHF'],
    ], questions: [
      { prompt: 'Quelle offre retenez-vous ?', answer: 'L’offre A.' },
      { prompt: 'Sur quelles données fondez-vous cette décision ?', answer: 'A livre les 120 bacs à temps pour 570 CHF, dans le budget.' },
      { prompt: 'Pourquoi l’autre offre ne suffit-elle pas ?', answer: 'L’offre B laisse 10 bacs manquants.' },
    ] },
  },
  {
    id: 'log-403-justifier-rayonnage-v015', module: '403', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '3.7 Rayonnage cantilever (porte-à-faux)',
    prompt: 'Vous devez ranger des profilés de 4 m sans les déformer. Comparez les supports proposés.', answer: '',
    table: { presentation: 'justifier-decision', title: 'Solutions de rangement', headers: ['Solution', 'Caractéristique'], rows: [
      ['A · Casiers', 'Chaque logement fait 1 m.'], ['B · Cantilever', 'Les bras soutiennent ensemble le profilé de 4 m.'],
    ], questions: [
      { prompt: 'Quel support choisissez-vous pour ces profilés ?', answer: 'Le rayonnage cantilever, solution B.' },
      { prompt: 'Justifiez avec la forme du produit.', answer: 'Le produit long est porté par les bras du rayonnage sur sa longueur.' },
      { prompt: 'Quel renseignement vérifiez-vous avant de ranger ?', answer: 'La charge admissible et la compatibilité du support selon la procédure du site.' },
    ] },
  },
  {
    id: 'log-601-justifier-organisation-v015', module: '601', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.1.7 Une ou plusieurs commandes',
    prompt: 'X doit être prête dans 10 min et Y dans 30 min. Les deux commandes passent par les mêmes allées.', answer: '',
    table: { presentation: 'justifier-decision', title: 'Organisation du prélèvement', headers: ['Organisation', 'Délai pour X'], rows: [
      ['A · X seule, puis Y', '8 min'], ['B · X et Y ensemble, puis tri', '13 min'],
    ], questions: [
      { prompt: 'Quelle organisation retenez-vous ?', answer: 'A. Préparer X seule, puis Y.' },
      { prompt: 'Quel délai guide votre choix ?', answer: 'X est prête en 8 min avec A et en 13 min avec B. La limite est de 10 min.' },
      { prompt: 'Quand le regroupement serait-il possible ?', answer: 'Si le prélèvement et le tri respectent les deux délais.' },
    ] },
  },
  {
    id: 'log-901-justifier-projet-v015', module: '901', revision: 'complementaires-v015', kind: 'situation', approvedFor: ['CFC'],
    theorySection: '1.1 Étude de faisabilité (Feasibility Study)',
    prompt: 'Un projet doit démarrer sous 20 jours, avec un budget maximal de 8 000 CHF. Le mandant accepte un pilote limité.', answer: '',
    table: { presentation: 'justifier-decision', title: 'Solutions étudiées', headers: ['Solution', 'Délai', 'Coût'], rows: [
      ['A · Déploiement complet', '28 jours', '7 600 CHF'], ['B · Pilote', '15 jours', '6 800 CHF'],
    ], questions: [
      { prompt: 'Quelle solution respecte les contraintes ?', answer: 'B. Le pilote prend 15 jours et coûte 6 800 CHF.' },
      { prompt: 'Quelle contrainte écarte A ?', answer: 'Le délai. A demande 28 jours pour une limite de 20 jours.' },
      { prompt: 'Quel résultat du pilote présenterez-vous au mandant ?', answer: 'Un résultat mesurable dans le périmètre testé, par exemple le taux d’erreurs avant et après.' },
    ] },
  },
] satisfies readonly LogistiqueUnit[]
