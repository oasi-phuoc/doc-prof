import type { LogistiqueUnit } from '../approved-banks'

const cases = [
  {
    module: '103', section: 'Objectifs de la logistique', afp: true,
    multiple: {
      prompt: 'Vous devez réduire le capital immobilisé tout en gardant les livraisons disponibles. Quelles décisions pouvez-vous étudier ?',
      correct: ['Supprimer le stock dormant après analyse de la demande', 'Avec un fournisseur fiable, tester des livraisons plus petites et régulières'],
      distractors: ['Augmenter tous les stocks sans regarder leur rotation', 'Accepter toutes les ruptures pour garder un stock nul'],
    },
    verdict: {
      prompt: 'Si un stock de réserve améliore la disponibilité de livraison, il peut aussi immobiliser du capital.',
      answer: 'Vrai', justification: 'L’entreprise finance les articles pendant qu’ils attendent en stock. Le stock de réserve peut éviter certaines ruptures, mais il a un coût.',
    },
  },
  {
    module: '206', section: "6.2.3 L'écoute active", afp: true,
    multiple: {
      prompt: 'Au changement d’équipe, votre collègue annonce un problème sur le lot B. Quelles réactions montrent que vous l’écoutez activement ?',
      correct: ['Reformuler ce qui est bloqué', 'Demander dans quelle zone le lot attend'],
      distractors: ['Supposer que le lot est au quai habituel', 'L’interrompre pour raconter un autre incident'],
    },
    verdict: {
      prompt: 'Reformuler une consigne de quai avec vos propres mots permet à la personne qui l’a donnée de vérifier ce que vous avez compris.',
      answer: 'Vrai',
    },
  },
  {
    module: '303', section: '3.3.1 Réception planifiée', afp: true,
    multiple: {
      prompt: 'Une réception de quatre caisses est annoncée pour 10 h. Quelles informations pouvez-vous utiliser pour préparer le poste avant l’arrivée ?',
      correct: ['Le créneau et le quai prévus', 'Les dimensions annoncées pour prévoir une zone de dépôt adaptée'],
      distractors: ['Un nombre de caisses prétendument constaté avant leur arrivée', 'La signature d’un contrôle physique qui reste à faire'],
    },
    verdict: {
      prompt: 'Pour une réception planifiée, vous pouvez enregistrer quatre caisses comme reçues dès que l’annonce signale quatre caisses.',
      answer: 'Faux', justification: 'L’annonce est une prévision. Enregistrez la quantité constatée au contrôle et signalez l’écart selon la procédure du site.',
    },
  },
  {
    module: '406', section: '6.2.1 Conditions', afp: true,
    multiple: {
      prompt: 'Le dépôt passe d’emplacements fixes à des emplacements variables. Quelles données permettent de retrouver un bac après son rangement ?',
      correct: ['L’identifiant du bac', 'L’adresse de son nouvel emplacement enregistrée dans le système'],
      distractors: ['La place qu’occupait l’article la semaine dernière', 'Le nom de la personne qui a réservé le créneau de livraison'],
    },
    verdict: {
      prompt: 'En stockage chaotique, une place vide peut accueillir un article si la place est compatible et que l’adresse réelle est enregistrée.',
      answer: 'Vrai',
    },
  },
  {
    module: '501', section: '1.4 Structure des produits', afp: false,
    multiple: {
      prompt: 'Pour fabriquer une caisse, la nomenclature indique un fond, quatre côtés et huit vis. Quelles décisions pouvez-vous prendre à partir de cette nomenclature ?',
      correct: ['Vérifier quels composants doivent être disponibles', 'Déterminer le besoin de vis pour le nombre de caisses demandé'],
      distractors: ['Confirmer le temps réel de fabrication de la série', 'Conclure que chaque composant est déjà en stock'],
    },
    verdict: {
      prompt: 'Remplacer un composant dans la version validée d’une caisse peut nécessiter de mettre sa nomenclature à jour avant la prochaine fabrication.',
      answer: 'Vrai', justification: 'La nomenclature décrit les composants réellement prévus pour fabriquer le produit. La version utilisée doit correspondre au changement autorisé.',
    },
  },
  {
    module: '601', section: '1.1.5 Informations', afp: true,
    multiple: {
      prompt: 'Deux bacs au même rayon contiennent des pièces visuellement proches. Quels éléments de l’ordre de préparation devez-vous contrôler au prélèvement ?',
      correct: ['La référence demandée', 'L’adresse à laquelle cette référence doit être prélevée', 'La quantité à prélever'],
      distractors: ['Le prix de la pièce au magasin'],
    },
    verdict: {
      prompt: 'Une référence correspond à l’ordre de préparation, mais le libellé du bac donne une quantité différente de celle demandée. Vous devez prélever exactement la quantité indiquée sur le bac.',
      answer: 'Faux', justification: 'L’ordre de préparation fixe le besoin. Le libellé du bac peut indiquer une quantité de conditionnement ou de stock. Faites vérifier toute incohérence.',
    },
  },
  {
    module: '701', section: '1.3 Déroulement', afp: true,
    multiple: {
      prompt: 'Dans le même rayon, certains articles sont comptés à la pièce et d’autres en boîtes. Quelles précautions préparent un relevé exploitable ?',
      correct: ['Indiquer l’unité attendue pour chaque article', 'Séparer les emballages vides des articles à compter'],
      distractors: ['Additionner les pièces et les boîtes dans une seule case', 'Reporter le stock informatique à la place du comptage'],
    },
    verdict: {
      prompt: 'Lors de l’inventaire, étiqueter les rayons aide l’équipe à retrouver les emplacements et à suivre le plan de comptage.',
      answer: 'Vrai',
    },
  },
  {
    module: '803', section: '3.1 ERP (Enterprise Resource Planning)', afp: true,
    multiple: {
      prompt: 'La réception et la préparation consultent le même article dans un ERP. Quelles informations de gestion peuvent leur être communes ?',
      correct: ['La référence qui identifie l’article', 'Le stock enregistré après un mouvement validé'],
      distractors: ['Le code d’accès privé du responsable', 'La quantité physique d’un mouvement qui n’a jamais été enregistré ni contrôlé'],
    },
    verdict: {
      prompt: 'Un ERP peut partager des données entre deux services même si chacun utilise un écran adapté à son travail.',
      answer: 'Vrai', justification: 'Le système intègre les données communes, par exemple les références. Chaque service consulte ou complète les informations autorisées depuis ses propres fonctions.',
    },
  },
  {
    module: '901', section: '1.4 Évaluation du projet', afp: false,
    multiple: {
      prompt: 'Un projet visait à réduire les erreurs de préparation en deux mois. Quelles informations rendent le bilan comparable à l’objectif ?',
      correct: ['Le même mode de calcul du taux d’erreurs avant et après', 'Les résultats et le périmètre mesurés sur la période prévue'],
      distractors: ['Une impression recueillie auprès d’une seule personne', 'Les chiffres d’un autre dépôt sans vérifier ses méthodes'],
    },
    verdict: {
      prompt: 'Pour comparer le budget au coût réel, on peut exclure du coût réel des travaux qui faisaient partie du budget sans le signaler.',
      answer: 'Faux', justification: 'Comparez le même périmètre. Présentez les travaux exclus et leur effet si le périmètre a changé.',
    },
  },
] satisfies {
  module: string
  section: string
  afp: boolean
  multiple: { prompt: string; correct: string[]; distractors: string[] }
  verdict: { prompt: string; answer: 'Vrai' | 'Faux'; justification?: string }
}[]

export const logistiqueChoiceExercises = cases.flatMap<LogistiqueUnit>(({ module, section, afp, multiple, verdict }) => {
  const source = { module, theorySection: section, revision: 'choix-v011', kind: 'verification' } as const
  const approvedFor = afp ? ['CFC', 'AFP'] as const : ['CFC'] as const
  return [
    {
      ...source, approvedFor, id: `log-${module}-choix-multiples-v011`, prompt: multiple.prompt,
      options: [...multiple.correct, ...multiple.distractors], answer: multiple.correct.join('\n'),
      choice: { kind: 'multiple', correct: multiple.correct },
    },
    {
      ...source, approvedFor, id: `log-${module}-vrai-faux-v011`, prompt: verdict.prompt,
      answer: verdict.answer, choice: { kind: 'true-false', justification: verdict.justification },
    },
  ]
})
