import type { LogistiqueUnit } from '../approved-banks'

const exercises = [
  ['103', 'Objectifs de la logistique', 'Reliez chaque objectif à la décision qui le favorise le plus directement.', [
    ['Disponibilité de livraison', 'Maintenir un stock de sécurité sur un article à forte demande.'],
    ['Capital immobilisé plus faible', 'Réduire les quantités qui restent longtemps sans mouvement.'],
    ['Coûts logistiques plus faibles', 'Regrouper des expéditions compatibles sans retarder les clients.'],
  ]],
  ['206', '6. Communication', 'Reliez chaque outil de communication à un exemple au quai.', [
    ['Question ouverte', 'Que manque-t-il pour terminer le contrôle ?'],
    ['Question fermée', 'Le bon de livraison est-il signé ?'],
    ['Reformulation', 'Si j’ai bien compris, vous gardez le lot de côté jusqu’au nouveau comptage.'],
  ]],
  ['306', "6.4 Procédure d'échange de palettes EURO", 'Reliez le mode d’échange à la trace laissée après la livraison.', [
    ['Échange pièce contre pièce', 'Le transporteur reprend aussitôt des supports admissibles.'],
    ['Échange contre un bon', 'Le transporteur reçoit une preuve pour obtenir les supports plus tard.'],
    ['Échange avec compte courant', 'Le mouvement modifie un solde suivi entre les partenaires.'],
  ]],
  ['308', '8.2.5 Mesure du poids', 'Reliez chaque notion à ce que la balance mesure dans l’exemple.', [
    ['Brut', 'Les pièces et leur bac, pesés ensemble.'],
    ['Tare', 'Le bac vide, sans les pièces.'],
    ['Net', 'Les pièces seules, après déduction du poids du bac.'],
  ]],
  ['406', '6. Principes de stockage', 'Reliez chaque principe à la règle appliquée dans le dépôt.', [
    ['Emplacement fixe', 'La même référence occupe toujours cette adresse.'],
    ['Stockage chaotique', 'Vous enregistrez l’adresse libre choisie.'],
    ['FIFO', 'Le premier lot entré sort d’abord.'],
    ['LIFO', 'Le dernier lot entré sort d’abord.'],
  ]],
  ['601', '1.1 Stratégies et notions', 'Reliez chaque terme à ce que vous faites pendant la préparation.', [
    ['Prélèvement', 'Vous prenez la quantité demandée à l’adresse indiquée.'],
    ['Transfert interne', 'Vous déplacez les articles à l’intérieur de l’entrepôt.'],
    ['Préparation par allée', 'Vous regroupez votre travail selon les allées à parcourir.'],
  ]],
  ['701', "1.2 Types d'inventaire", 'Reliez le type d’inventaire à son organisation.', [
    ['Inventaire à date fixe', 'Les stocks sont comptés à une date de référence déterminée.'],
    ['Inventaire permanent', 'Les emplacements sont contrôlés à tour de rôle sur l’année.'],
    ['Inventaire par sondage', 'Un échantillon représentatif sert à estimer l’ensemble.'],
  ]],
  ['803', "3. Logiciel d'exploitation", 'Reliez la fonction logicielle au besoin de l’entreprise.', [
    ['ERP', 'Partager des données de gestion communes entre les services.'],
    ['CRM', 'Suivre les contacts, demandes et échanges avec les clients.'],
    ['Gestion de matériel', 'Suivre les besoins et les mouvements des articles.'],
    ['PCP', 'Planifier la fabrication et suivre son avancement.'],
  ]],
] as const

export const logistiqueMatchingExercises = exercises.map(([module, theorySection, prompt, pairs]): LogistiqueUnit => ({
  id: `log-${module}-associations-v013`, module, theorySection, prompt, kind: 'verification', revision: 'associations-v013',
  answer: pairs.map(([left, right]) => `${left} → ${right}`).join('\n'),
  pairs: pairs.map(([left, right]) => ({ left, right })),
  approvedFor: ['CFC', 'AFP'],
}))
