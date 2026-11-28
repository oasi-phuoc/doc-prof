import type { ExerciseType } from '@/math/types'
import type { TcfPeEmailReponse, TcfPeSmsReponse, TcfPoDialogue, TcfQuestion } from '@/tcf/types'
import { GRAMMAR_CO_BANK } from './co-bank'
import type { GrammarScenario } from './parcours'

export function choice(enonce: string, answer: string, distractors: [string, string]): TcfQuestion {
  return {
    enonce,
    type_reponse: 'qcm_texte',
    melanger: true,
    choix: [answer, ...distractors].map((texte, index) => ({
      id: String(index + 1), texte, correct: index === 0,
    })),
  }
}

type WritingExercise =
  | Pick<TcfPeSmsReponse, 'type_exercice' | 'consigne' | 'support'>
  | Pick<TcfPeEmailReponse, 'type_exercice' | 'consigne' | 'support'>

type DailyScenario = {
  id: string
  level: 'A1' | 'A2'
  topic: ExerciseType['topic']
  subthemeId: string
  title: string
  read: { title: string; text: string; questions: TcfQuestion[] }
  listen: { track: string; label: string; questions: TcfQuestion[] }
  write: WritingExercise
  speak: TcfPoDialogue['support']
}

function dailyScenario(plan: DailyScenario): GrammarScenario {
  const recording = GRAMMAR_CO_BANK.find(entry => entry.exercise.id === plan.listen.track)?.exercise.support
  if (!recording?.audio || !recording.transcription?.length) {
    throw new Error('Enregistrement ou transcription manquante pour le parcours ' + plan.id + ' (' + plan.listen.track + ').')
  }
  const source = {
    niveau: plan.level === 'A1' ? 'A0-A1' : 'A1-A2',
    scene: plan.title,
  } as const
  return {
    type: {
      id: plan.id,
      topic: plan.topic,
      label: 'Parcours ' + plan.level + ' — ' + plan.title,
      description: 'Lire, écouter, écrire et jouer une démarche du quotidien.',
      instruction: plan.title,
      visual: 'texte',
      preferredColumns: 1,
      preferredCount: 1,
    },
    subthemeId: plan.subthemeId,
    stages: [
      {
        title: 'Compréhension écrite · Lire le document',
        exercise: {
          ...source, id: plan.id + '-ce', competence: 'CE', type_exercice: 'annonce',
          consigne: 'Lisez le document. Cochez une réponse par question.',
          support: { titre: plan.read.title, texte: plan.read.text, image: null },
          questions: plan.read.questions,
        },
      },
      {
        title: 'Compréhension orale · Écouter et noter',
        audioLabel: plan.listen.label,
        exercise: {
          ...source, id: plan.id + '-co', competence: 'CO', type_exercice: 'complet',
          consigne: 'Écoutez l’enregistrement deux fois. Cochez une réponse par question.',
          support: { audio: recording.audio, transcription: recording.transcription },
          questions: plan.listen.questions,
        },
      },
      {
        title: 'Production écrite · Écrire un message',
        exercise: { ...source, ...plan.write, id: plan.id + '-pe', competence: 'PE', questions: [] },
      },
      {
        title: 'Production orale · Jouer la situation',
        exercise: {
          ...source, id: plan.id + '-po', competence: 'PO', type_exercice: 'dialogue',
          consigne: 'Jouez la situation à deux. Puis échangez les rôles.',
          support: { ...plan.speak, repliques_au_corrige: true },
          questions: [],
        },
      },
    ],
  }
}

const metro = dailyScenario({
  id: 'gram-parcours-travaux-metro-a2',
  level: 'A2',
  topic: 'gram-espace',
  subthemeId: 'e7',
  title: 'Adapter un trajet en métro',
  read: {
    title: 'Votre trajet pour l’atelier',
    text: 'L’atelier commence à 14 heures. Pour y aller, vous avez prévu de retrouver votre amie à la station Victor Hugo. Elle vient avec son ticket de métro et vous attend à l’entrée.',
    questions: [
      choice('À quelle heure commence l’atelier ?', 'À 14 heures.', ['À 13 heures.', 'À 15 heures.']),
      choice('Où devez-vous retrouver votre amie ?', 'À la station Victor Hugo.', ['Devant l’atelier.', 'Au guichet de la gare.']),
    ],
  },
  listen: {
    track: 'gram-co-se-deplacer-a2-piste_014',
    label: 'Annonce dans le métro',
    questions: [
      choice('Pourquoi la station Victor Hugo n’est-elle plus desservie ?', 'Il y a des travaux sur la ligne 5.', ['Les bus sont en grève.', 'Le guichet est fermé.']),
      choice('Quel moyen de transport est proposé ?', 'Un bus de remplacement.', ['Un autre métro.', 'Un taxi.']),
    ],
  },
  write: {
    type_exercice: 'sms_reponse',
    consigne: 'Prévenez votre amie du changement de trajet.',
    support: {
      expediteur: 'Une amie',
      sms_recu: 'Je suis en route pour la station Victor Hugo. Est-ce que je prends le métro comme prévu ?',
      consigne: 'Expliquez le problème. Proposez de vous retrouver à l’arrêt du bus de remplacement. Dites si le même ticket est valable. Utilisez « à la station » ou « à l’arrêt ».',
      nb_mots: { min: 30, max: 55 },
      reponse_modele: 'Salut ! Il y a des travaux sur la ligne 5 et le métro ne s’arrête plus à la station Victor Hugo. Retrouvons-nous à l’arrêt du bus de remplacement. Ton ticket est encore valable. À tout à l’heure !',
    },
  },
  speak: {
    situation: 'Vous cherchez l’arrêt du bus de remplacement. Demandez le chemin et vérifiez si votre ticket est valable.\nAgent. Donnez un repère pour trouver l’arrêt. Confirmez que le ticket reste valable.',
    repliques: [
      { locuteur: 'eleve', texte: 'Bonjour, où est l’arrêt du bus de remplacement ?' },
      { locuteur: 'examinateur', texte: 'Prenez la sortie et tournez à droite. L’arrêt est devant vous.' },
      { locuteur: 'eleve', texte: 'Mon ticket de métro est encore valable ?' },
      { locuteur: 'examinateur', texte: 'Oui, vous pouvez l’utiliser dans le bus.' },
    ],
  },
})

const immeuble = dailyScenario({
  id: 'gram-parcours-reglement-immeuble-a1',
  level: 'A1',
  topic: 'gram-conseiller',
  subthemeId: 'f11',
  title: 'Accueillir une voisine dans l’immeuble',
  read: {
    title: 'Bienvenue dans l’immeuble',
    text: 'Votre boîte aux lettres est à côté de l’entrée. Le local à vélos est dans la cour. Pour toute question, passez à la loge du gardien entre 8 et 10 heures.',
    questions: [
      choice('Où est le local à vélos ?', 'Dans la cour.', ['Dans le hall.', 'Dans la cave.']),
      choice('Quand pouvez-vous voir le gardien ?', 'Entre 8 et 10 heures.', ['À midi.', 'Après 22 heures.']),
    ],
  },
  listen: {
    track: 'gram-co-reglement-immeuble-piste067',
    label: 'Consignes de l’immeuble',
    questions: [
      choice('Que faut-il mettre sur la boîte aux lettres ?', 'Son nom.', ['Son numéro de téléphone.', 'Son prénom et son âge.']),
      choice('À partir de quelle heure faut-il éviter le bruit ?', 'Après 22 heures.', ['Après 10 heures.', 'Après 8 heures.']),
    ],
  },
  write: {
    type_exercice: 'sms_reponse',
    consigne: 'Répondez à la personne qui vient d’emménager.',
    support: {
      expediteur: 'La nouvelle voisine',
      sms_recu: 'Bonjour, je viens d’arriver avec mon vélo. Où dois-je le mettre ? Et comment recevoir mon courrier ?',
      consigne: 'Souhaitez la bienvenue. Indiquez le local à vélos et dites ce qu’il faut mettre sur la boîte aux lettres. Utilisez « Rangez » ou « Mettez ».',
      nb_mots: { min: 18, max: 40 },
      reponse_modele: 'Bonjour et bienvenue ! Rangez votre vélo dans le local à vélos, dans la cour. Mettez votre nom sur la boîte aux lettres près de l’entrée.',
    },
  },
  speak: {
    situation: 'La nouvelle voisine veut savoir où ranger son vélo et à quelle heure il faut éviter le bruit. Elle vous pose les deux questions. Répondez avec le document et l’enregistrement.',
    repliques: [
      { locuteur: 'examinateur', texte: 'Bonjour ! Où est-ce que je peux ranger mon vélo ?' },
      { locuteur: 'eleve', texte: 'Rangez-le dans le local, dans la cour.' },
      { locuteur: 'examinateur', texte: 'Et le soir, à quelle heure faut-il être calme ?' },
      { locuteur: 'eleve', texte: 'Ne faites pas de bruit après 22 heures.' },
    ],
  },
})

const retour = dailyScenario({
  id: 'gram-parcours-retour-smartphone-a2',
  level: 'A2',
  topic: 'gram-demander',
  subthemeId: 'f2',
  title: 'Retourner un téléphone en panne',
  read: {
    title: 'Confirmation de commande',
    text: 'Votre commande de smartphone porte la référence VF3367Y. Gardez cette confirmation. Pour une panne, contactez le service après-vente et préparez votre référence.',
    questions: [
      choice('Quelle est la référence de la commande ?', 'VF3367Y.', ['VF3347Y.', 'VT3367Y.']),
      choice('Qui faut-il contacter en cas de panne ?', 'Le service après-vente.', ['Le facteur.', 'Le fabricant de la coque.']),
    ],
  },
  listen: {
    track: 'gram-co-faire-achats-a2-piste_007',
    label: 'Appel au service après-vente',
    questions: [
      choice('Quel est le problème du client ?', 'Son téléphone ne s’allume plus.', ['Son téléphone est perdu.', 'Son colis n’est pas arrivé.']),
      choice('Qu’est-ce que le service après-vente va envoyer ?', 'Un bon de retour par courriel.', ['Un autre téléphone par la poste.', 'Une facture par SMS.']),
    ],
  },
  write: {
    type_exercice: 'email_reponse',
    consigne: 'Écrivez au service après-vente pour obtenir le bon de retour.',
    support: {
      email_recu: { de: 'Service après-vente', objet: 'Votre demande de retour',
        texte: 'Nous attendons votre référence et une courte description de la panne pour vous envoyer votre bon de retour.' },
      consigne: 'Donnez la référence. Décrivez la panne. Demandez le bon de retour avec « Pouvez-vous… ? ». Remerciez.',
      nb_mots: { min: 30, max: 60 },
      reponse_modele: 'Bonjour, je vous écris pour la commande VF3367Y. Mon téléphone ne s’allume plus depuis hier. J’aimerais le retourner pour le faire réparer. Pouvez-vous m’envoyer le bon de retour par courriel, s’il vous plaît ? Merci de votre aide.',
    },
  },
  speak: {
    situation: 'Vous appelez le service après-vente. Donnez votre référence et décrivez la panne. Demandez la prochaine étape.\nEmployé. Demandez la référence et expliquez à quoi sert le bon de retour.',
    repliques: [
      { locuteur: 'eleve', texte: 'Bonjour, mon téléphone ne s’allume plus. Pouvez-vous m’aider ?' },
      { locuteur: 'examinateur', texte: 'Bien sûr. Quelle est votre référence de commande ?' },
      { locuteur: 'eleve', texte: 'VF3367Y. Comment puis-je vous renvoyer le téléphone ?' },
      { locuteur: 'examinateur', texte: 'Je vous envoie un bon de retour par courriel. Utilisez-le pour renvoyer le téléphone au service de réparation.' },
    ],
  },
})

const formation = dailyScenario({
  id: 'gram-parcours-demander-formation-a2',
  level: 'A2',
  topic: 'gram-present',
  subthemeId: 'modaux',
  title: 'Se renseigner sur une formation',
  read: {
    title: 'Préparer un projet de formation',
    text: 'Vous voulez apprendre le métier de graphiste. Le centre vous invite à une séance d’information mardi à 18 heures. Préparez une question sur les horaires et une question sur le financement. Dans l’annonce, CPF signifie « compte personnel de formation ».',
    questions: [
      choice('Quel métier voulez-vous apprendre ?', 'Graphiste.', ['Cuisinier.', 'Secrétaire.']),
      choice('Quand a lieu la séance d’information ?', 'Mardi à 18 heures.', ['Mardi à 8 heures.', 'Jeudi à 18 heures.']),
    ],
  },
  listen: {
    track: 'gram-co-formation-a2-piste_160',
    label: 'Annonce de formation',
    questions: [
      choice('Quel type de formation est proposé ?', 'Une formation diplômante.', ['Un stage sans diplôme.', 'Un cours de loisirs.']),
      choice('Où peut-on trouver les détails ?', 'Sur le site Internet de l’organisme.', ['À la gare.', 'Dans un message vocal.']),
    ],
  },
  write: {
    type_exercice: 'email_reponse',
    consigne: 'Répondez au centre de formation.',
    support: {
      email_recu: { de: 'Centre de formation', objet: 'Séance d’information',
        texte: 'Vous pouvez confirmer votre présence à la séance et nous envoyer vos questions sur la formation.' },
      consigne: 'Confirmez la séance de mardi. Dites quel métier vous voulez apprendre. Demandez les horaires et si vous pouvez utiliser votre CPF.',
      nb_mots: { min: 30, max: 60 },
      reponse_modele: 'Bonjour, je confirme ma présence mardi à 18 heures. Je voudrais apprendre le métier de graphiste. Pouvez-vous me donner les horaires des cours ? Est-ce que je peux utiliser mon compte personnel de formation pour financer les cours ? Merci pour votre aide.',
    },
  },
  speak: {
    situation: 'À la séance d’information, expliquez votre projet. Demandez quand vous pouvez suivre les cours et comment vérifier la prise en charge de la formation.\nCentre. Posez une question sur le projet et aidez la personne à retrouver les informations.',
    repliques: [
      { locuteur: 'examinateur', texte: 'Bonjour, quel métier vous intéresse ?' },
      { locuteur: 'eleve', texte: 'Je voudrais devenir graphiste. Est-ce que je peux suivre les cours le soir ?' },
      { locuteur: 'examinateur', texte: 'Regardons les horaires sur le site du centre.' },
      { locuteur: 'eleve', texte: 'Et comment puis-je vérifier si mon CPF peut payer la formation ?' },
    ],
  },
})

export const dailyGrammarScenarios: readonly GrammarScenario[] = [metro, immeuble, retour, formation]
