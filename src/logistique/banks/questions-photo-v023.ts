import type { LogistiquePhotoPresentation, LogistiqueQuestionImage } from '@/math/types'
import type { LogistiqueUnit } from '../approved-banks'

function photoTask(presentation: LogistiquePhotoPresentation, src: string, alt: string, lines = 2) {
  const image: LogistiqueQuestionImage = { src, alt, caption: '', width: 180, placement: 'droite', visibility: 'both' }
  return { presentation, image, lines }
}

export const logistiquePhotoExercises = [
  {
    id: 'log-406-photo-emplacement-v023', module: '406', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '6.1 Lotissement par case (emplacement fixe)',
    prompt: 'Quel principe de rangement le bac R08 illustre-t-il ? Justifiez à partir du rayonnage.',
    answer: 'L’emplacement fixe. Le bac et sa place portent tous les deux la référence R08.',
    photoTask: photoTask('identifier-photo', '/assets/logistique/400/406/commun/log-406-emplacement-fixe-photo-v010.webp',
      'Une main place un bac R08 dans un rayon dont la lisse porte aussi la référence R08.'),
  },
  {
    id: 'log-408-photo-appui-v023', module: '408', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '8.5 Charge au sol',
    prompt: 'Quel type de charge le pied du rayonnage transmet-il au sol ? Appuyez-vous sur la surface en contact.',
    answer: 'Une charge ponctuelle. L’effort est concentré sur la petite surface de la platine.',
    photoTask: photoTask('identifier-photo', '/assets/logistique/400/408/commun/log-408-charge-ponctuelle-photo-v010.webp',
      'Un montant métallique rejoint le sol sur une petite plaque boulonnée.'),
  },
  {
    id: 'log-504-photo-signal-v023', module: '504', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC'],
    theorySection: '4.2 Système Kanban',
    prompt: 'Nommez le type de signal présenté. À quel moment sert-il dans le cycle du bac ?',
    answer: 'C’est une carte Kanban. Elle déclenche le réapprovisionnement lorsque le stock prévu dans le bac a été consommé.',
    photoTask: photoTask('identifier-photo', '/assets/logistique/500/504/cfc/log-504-kanban-photo-v010.webp',
      'Une main retire une carte orange de la pochette du bac de composants.'),
  },
  {
    id: 'log-405-photo-plan-v023', module: '405', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '5.1.3 Organisation des secours',
    prompt: 'Que montre la responsable près de la porte ? Citez une autre indication utile à connaître pour une évacuation.',
    answer: 'Elle montre le parcours d’évacuation. Il faut aussi connaître le point de rassemblement ou la façon de donner l’alerte.',
    photoTask: photoTask('decrire-photo', '/assets/logistique/400/405/commun/log-405-plan-durgence-photo-v010.webp',
      'Une responsable montre du doigt le chemin dessiné sur un document mural près d’une sortie verte.', 3),
  },
  {
    id: 'log-408-photo-occupation-v023', module: '408', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '8.9 Stockage sur rayonnages',
    prompt: 'Relevez les positions libres et occupées. Expliquez comment établir le taux d’occupation du rayonnage.',
    answer: 'Le rayonnage a deux positions libres et quatre occupées. Le taux rapporte les quatre positions occupées aux six positions, soit environ 67 %.',
    photoTask: photoTask('decrire-photo', '/assets/logistique/400/408/commun/log-408-taux-doccupation-photo-v010.webp',
      'Un rayonnage comporte deux colonnes de trois places. La place du milieu à gauche et celle du bas à droite sont vides.', 3),
  },
  {
    id: 'log-503-photo-goulot-v023', module: '503', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC'],
    theorySection: '3.3.3 Fabrication à la chaîne (flux)',
    prompt: 'Décrivez ce qui arrive aux bacs avant et après le poste. Quel effet cela peut-il avoir sur l’atelier ?',
    answer: 'Les bacs s’accumulent avant le contrôle et la table de sortie reste peu chargée. Ce poste forme un goulot qui limite le débit de l’ensemble.',
    photoTask: photoTask('decrire-photo', '/assets/logistique/500/503/cfc/log-503-goulot-photo-v010.webp',
      'Plusieurs bacs pleins précèdent le poste occupé par une opératrice. Une seule boîte est posée sur la table de sortie.', 3),
  },
  {
    id: 'log-602-photo-calage-v023', module: '602', revision: 'questions-photo-v023', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '2.3.2 Accessoires de rembourrage',
    prompt: 'Décrivez où le rembourrage est placé. Quel mouvement de la pièce doit-il limiter pendant le transport ?',
    answer: 'Les cales se trouvent entre la pièce et les parois. Elles limitent le déplacement de la pièce et le risque de choc contre le carton.',
    photoTask: photoTask('decrire-photo', '/assets/logistique/600/602/commun/log-602-protection-photo-v010.webp',
      'Dans un carton ouvert, deux blocs de mousse entourent une pièce métallique.', 3),
  },
] satisfies readonly LogistiqueUnit[]
