import type { TcfQuestion } from '@/tcf/types'
import { p, sheet, table } from '@/grammaire/theory/falc-sheet'
import type { GrammarTheoryBlock } from '@/francais/grammar-theory'

export const santeTheory: Record<string, GrammarTheoryBlock[]> = {
  'corps-theorie-a1': sheet({
    title: 'Les parties du corps',
    intro: 'Je nomme les parties du corps.',
    regarder: [
      'Je montre ma tête.',
      'Je lève mon bras.',
      'Je plie mes genoux.',
    ],
    expliquer: [
      table(['Sur le corps', 'Mots à retenir'], [
        ['En haut', 'la tête, le cou, les épaules'],
        ['Sur les côtés', 'le bras, la main, les doigts'],
        ['Au milieu', 'le ventre, le dos'],
        ['En bas', 'la jambe, le genou, le pied'],
      ]),
    ],
    retenir: [
      p('J’apprends le mot avec son article.'),
      p('Je montre le genou droit, puis le genou gauche.'),
    ],
  }),
  'douleurs-theorie-a1': sheet({
    title: 'Dire où j’ai mal',
    intro: 'Je dis où j’ai mal.',
    regarder: [
      'J’ai mal au genou.',
      'J’ai mal à la tête.',
      'J’ai mal à l’épaule.',
      'J’ai mal aux dents.',
    ],
    expliquer: [
      table(['Le mot', 'Je dis'], [
        ['le genou', 'J’ai mal au genou.'],
        ['la tête', 'J’ai mal à la tête.'],
        ['l’épaule', 'J’ai mal à l’épaule.'],
        ['les dents', 'J’ai mal aux dents.'],
      ]),
    ],
    retenir: [
      p('Je dis « j’ai mal ». Puis je nomme la partie du corps.'),
      p('À l’oral, je complète « j’ai mal » avec « le dos ».'),
    ],
  }),
  'specialistes-theorie-a1': sheet({
    title: 'Les professionnels de la santé',
    intro: 'Je reconnais les métiers. Je trouve le bon cabinet.',
    regarder: [
      'Je vais chez le dentiste.',
      'J’emmène mon enfant chez le pédiatre.',
      'Je parle avec la pharmacienne.',
    ],
    expliquer: [
      table(['Métier', 'Ce que fait cette personne'], [
        ['Le dentiste, la dentiste', 'Cette personne soigne les dents.'],
        ['Le pédiatre, la pédiatre', 'Ce médecin soigne les enfants.'],
        ['L’ophtalmologue', 'Ce médecin examine les yeux.'],
        ['Le pharmacien, la pharmacienne', 'Cette personne travaille à la pharmacie.'],
      ]),
    ],
    retenir: [
      p('Je dis « chez le dentiste » ou « à la pharmacie ».'),
      p('Je choisis un métier et je l’explique.'),
    ],
  }),
  'soins-theorie-a1': sheet({
    title: 'Prendre rendez-vous',
    intro: 'J’appelle le cabinet. Je demande un rendez-vous.',
    regarder: [
      'Bonjour, je voudrais prendre rendez-vous.',
      'Mardi à 9 h, c’est possible ?',
      'Oui, mardi à 9 h. Merci, au revoir.',
    ],
    expliquer: [
      p('Je salue. Je dis pourquoi j’appelle.'),
      p('J’écoute le jour et l’heure.'),
      p('Je répète le jour et l’heure pour confirmer.'),
    ],
    retenir: [
      p('Je note le jour, l’heure et le lieu du rendez-vous.'),
      p('Je joue la scène. Le cabinet propose mercredi à 14 h.'),
    ],
  }),
  'soins-vocabulaire-a1': [
    { kind: 'heading', text: 'Les mots du cabinet et de la pharmacie' },
    table(['Mot', 'Exemple'], [
      ['le cabinet médical', 'J’appelle le cabinet médical.'],
      ['le rendez-vous', 'J’ai rendez-vous le mardi 12 à 9 h.'],
      ['la consultation', 'La consultation commence à 9 h.'],
      ['la pharmacie', 'Je vais à la pharmacie.'],
      ['l’ordonnance', 'Voici mon ordonnance.'],
      ['le pharmacien, la pharmacienne', 'Je pose une question à la pharmacienne.'],
    ]),
  ],
}

const specialistQuestions = [
  { prompt: 'Quel professionnel s’occupe des dents ?', answers: ['Le dentiste', 'Le pédiatre', 'Le pharmacien'] },
  { prompt: 'Pour quel problème peut-on appeler le docteur Jacques ?', answers: ['Un problème aux yeux', 'Un problème aux dents', 'Un problème au dos'] },
  { prompt: 'Qui peut-on appeler pour un problème au dos ?', answers: ['Mme Dubac', 'Le docteur Jacques', 'Le docteur Lejeune'] },
  { prompt: 'Qui reçoit les enfants ?', answers: ['Le pédiatre', 'Le dentiste', 'Le docteur Jacques'] },
]

export const santeSpecialistQuestions = specialistQuestions.map<TcfQuestion>(({ prompt, answers }) => ({
  enonce: prompt,
  type_reponse: 'qcm_texte',
  points: 1,
  melanger: true,
  choix: answers.map((texte, index) => ({ id: String(index + 1), texte, correct: index === 0 })),
  formes: { lignes: { nb_lignes: 1, reponse_modele: answers[0]! } },
}))
