import type { LogistiqueUnit } from '../approved-banks'

type GapExercise = {
  module: string
  section: string
  prompt: string
  answers: string[]
  distractors?: string[]
}

const exercises: GapExercise[] = [
  {
    module: '101', section: 'Chasser, transformer, consommer',
    prompt: 'Dans la chaîne ancienne, chasser procurait la ressource. On pouvait ensuite la ___ avant de la ___.',
    answers: ['transformer', 'consommer'], distractors: ['chercher'],
  },
  {
    module: '101', section: 'Approvisionnement, production, distribution',
    prompt: 'Pour fabriquer un article, l’entreprise commence par l’___ en matières. La ___ transforme ces matières. La ___ livre le produit fini.',
    answers: ['approvisionnement', 'production', 'distribution'], distractors: ['facturation'],
  },
  {
    module: '101', section: '1.2 Produits commerciaux et circuits commerciaux',
    prompt: 'La route de la ___ reliait des régions d’Asie et d’Europe par des étapes. L’___, une résine fossilisée, arrivait notamment de la région baltique.',
    answers: ['soie', 'ambre'], distractors: ['or'],
  },
  {
    module: '105', section: '5.1 Caractéristiques et manipulation des marchandises',
    prompt: 'Une marchandise ___ risque de se casser sous les chocs. Une marchandise ___ doit être utilisée avant sa date limite.',
    answers: ['fragile', 'périssable'], distractors: ['empilable'],
  },
  {
    module: '105', section: '5.1 Caractéristiques et manipulation des marchandises',
    prompt: 'Le ___ représente l’espace occupé par un colis. La ___ indique combien de matière il contient.',
    answers: ['volume', 'masse'], distractors: ['température'],
  },
  {
    module: '105', section: '5.2 Degré de transformation',
    prompt: 'La matière ___ sert de point de départ. Après une première transformation, une pièce qui doit encore être usinée est un produit ___.',
    answers: ['première', 'semi-fini'],
  },
  {
    module: '306', section: '6.2.1 Support de charge selon EURO',
    prompt: 'L’empreinte de la palette EUR 1 est de 1 200 × ___ mm. Les ___ séparent le plateau du sol et laissent la place aux fourches.',
    answers: ['800', 'plots'], distractors: ['1 000', 'couvercles'],
  },
  {
    module: '306', section: '6.5 Support de charge selon CHEP',
    prompt: 'Dans le pool ___ de CHEP, le prestataire reste propriétaire des supports. Les retours suivent les règles de ___.',
    answers: ['fermé', 'collecte'], distractors: ['ouvert', 'production'],
  },
  {
    module: '306', section: '6.6 Supports de charge spéciaux',
    prompt: 'Les parois d’une ___ retiennent des copeaux en vrac. Une ___ offre un plateau plat et lavable si le modèle est adapté.',
    answers: ['box-palette', 'palette synthétique'], distractors: ['demi-palette en bois'],
  },
  {
    module: '308', section: '8.2.5 Mesure du poids',
    prompt: 'La masse ___ comprend la marchandise et son emballage. Pour obtenir la masse ___, il faut déduire la ___.',
    answers: ['brute', 'nette', 'tare'],
  },
  {
    module: '308', section: '8.2.5 Mesure du poids',
    prompt: 'Pour estimer le nombre de pièces par pesage, on divise la masse nette du lot par la masse ___ d’une pièce. On consigne le ___ du contrôle.',
    answers: ['unitaire', 'résultat'], distractors: ['brute', 'couvercle'],
  },
  {
    module: '308', section: '8.2.3 Accessoires de mesure des longueurs (précision)',
    prompt: 'Le ___ sert à mesurer la dimension d’une pièce. On compare ensuite la mesure aux limites de la ___.',
    answers: ['pied à coulisse', 'tolérance'], distractors: ['compteur', 'palette'],
  },
  {
    module: '409', section: "9.2 Types d'engins au sol",
    prompt: 'Pour un déplacement à faible hauteur, on utilise un ___. Pour poser des palettes les unes au-dessus des autres, un ___ lève la charge plus haut.',
    answers: ['transpalette', 'gerbeur'], distractors: ['tracteur'],
  },
  {
    module: '409', section: '9.4.1 Mât de levage',
    prompt: 'Le ___ guide la montée des fourches. La levée ___ correspond au début du mouvement, avant que la hauteur extérieure du mât augmente.',
    answers: ['mât', 'libre'], distractors: ['timon', 'latérale'],
  },
  {
    module: '409', section: '9.2.10 Transstockeur',
    prompt: 'Le ___ dessert les emplacements d’un rayonnage. Un ___ circule au sol pour transporter des charges sur des trajets prévus.',
    answers: ['transstockeur', 'AGV'], distractors: ['palan'],
  },
]

export const logistiqueGapExercises = exercises.map<LogistiqueUnit>(({ module, section, prompt, answers, distractors }, index) => ({
  id: `log-${module}-trous-v006-${index + 1}`,
  module,
  revision: 'trous-v006',
  approvedFor: ['CFC', 'AFP'],
  kind: 'verification',
  prompt,
  answer: answers.join(' / '),
  theorySection: section,
  gaps: { answers, distractors },
}))
