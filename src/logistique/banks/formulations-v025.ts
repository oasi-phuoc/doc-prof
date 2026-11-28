import type { LogistiqueUnit } from '../approved-banks'
import type { LogistiqueWording } from '../wording'

const contexts: Readonly<Record<string, string>> = {
  'Le magasin calcule le disponible avant choix de la quantité à commander.':
    'Le magasin vérifie son stock avant de décider combien de pièces commander.',
  'Le poste remonte du besoin à la préparation, la vérification et la réception.':
    'L’équipe organise les tâches avant la réception.',
  'L’équipe évalue les commandes effectivement disponibles selon les critères retenus.':
    'L’équipe vérifie quelles commandes ont été servies selon les conditions prévues.',
}

const plainContexts: Readonly<Record<string, string>> = {
  'Une réserve de filtres sert l’atelier entre deux réceptions.':
    'L’atelier garde des filtres en réserve entre deux livraisons.',
  'Un entrepôt de matières premières alimente une ligne de fabrication à partir de sa réserve.':
    'La ligne de fabrication a besoin de matières premières. L’entrepôt les fournit à partir de son stock.',
  'Un stock d’approvisionnement alimente une ligne et sépare les composants déjà réservés.':
    'Le stock d’approvisionnement contient les composants pour la ligne de montage. Les composants déjà réservés sont mis à part.',
  'En système Two-Bin, le deuxième bac couvre le délai après le signal de réapprovisionnement du premier.':
    'Le système Two-Bin utilise deux bacs. Pendant le remplissage du premier bac, le poste utilise le deuxième.',
  'Une face de prélèvement sert plusieurs commandes dont certaines sont réservées.':
    'Les articles de plusieurs commandes sont pris dans la même zone de prélèvement. Une partie du stock est déjà réservée.',
  'Vous rapprochez le relevé physique des mouvements enregistrés à la clôture.':
    'Vous faites le point en fin de période. Comparez ce qui est compté aux entrées et sorties enregistrées.',
  'L’ERP suit les quantités et réservations du même article pour plusieurs services.':
    'Plusieurs services utilisent le même article. L’ERP indique les quantités et les réservations.',
  'Le poste rapproche les entrées, les sorties et les réserves de la zone suivie.':
    'Vous suivez le stock de cette zone. Vous comparez les entrées, les sorties et les quantités réservées.',
  'Le logiciel suit les entrées et sorties de la référence ainsi que les réservations.':
    'Le logiciel suit un article. Il montre les entrées, les sorties et les quantités réservées.',
  'La fiche sépare les quantités physiques et les unités prévues pour des demandes.':
    'La fiche indique la quantité présente sur place. Elle indique aussi les unités déjà prévues pour des demandes.',
  'Le poste prépare les contrôles de profil et les ordres en attente d’un transstockeur.':
    'Avant d’utiliser le transstockeur, le poste vérifie le profil des charges et prépare les ordres en attente.',
  'La PCP vérifie les créneaux de préparation et de contrôle avant l’ouverture des ordres.':
    'La PCP organise la production. L’équipe vérifie le temps de préparation et de contrôle avant de lancer les ordres.',
  'Le service express organise les remises selon les créneaux et le temps de contrôle nécessaire.':
    'Le service express fixe l’heure de remise des colis. Il garde assez de temps pour les contrôles.',
  'L’expéditeur prévoit les délais de contrôle et de traitement documentaire avant la remise.':
    'Avant de remettre l’envoi, l’expéditeur prévoit du temps pour contrôler la marchandise et remplir les documents.',
}

const dossierRules: readonly { pattern: RegExp; normal: string; falc: string }[] = [
  {
    pattern: /Le relevé ouvre à (\d+) ([^.]+)\. Il enregistre une entrée de (\d+) et une sortie de (\d+)\. Quel est le stock physique final \?$/u,
    normal: 'Le stock initial est de $1 $2. Le relevé indique une entrée de $3 unités et une sortie de $4 unités. Quel est le stock physique à la fin ?',
    falc: 'Au départ, le stock contient $1 $2.\nIl entre $3 unités.\nIl sort $4 unités.\nCombien d’unités restent sur place ? C’est le stock physique final.',
  },
  {
    pattern: /Le comptage de (\d+) ([^.]+) inclut (\d+) unités réservées qui restent sur place\. Quel stock peut servir une autre demande \?$/u,
    normal: 'Le stock physique compte $1 $2, dont $3 unités déjà réservées. Combien d’unités sont disponibles pour une nouvelle demande ?',
    falc: 'Vous comptez $1 $2.\nDans ce stock, $3 unités sont déjà réservées.\nCombien d’unités pouvez-vous utiliser pour une autre demande ?',
  },
  {
    pattern: /Il reste (\d+) ([^.]+) disponibles et on en consomme (\d+) par jour\. Sur combien de journées complètes peut-on compter sans arrivée \?$/u,
    normal: 'Le stock disponible est de $1 $2. La consommation est de $3 unités par jour. Combien de jours entiers ce stock couvre-t-il sans nouvelle livraison ?',
    falc: 'Il reste $1 $2.\nVous utilisez $3 unités chaque jour.\nIl n’y a pas de nouvelle livraison.\nCombien de jours entiers pouvez-vous travailler avec ce stock ?',
  },
  {
    pattern: /La sortie prévue est de (\d+) ([^.]+) par jour pour les (\d+) prochains jours\. Le stock disponible en contient (\d+)\. Quel manque faut-il couvrir \?$/u,
    normal: 'Vous prévoyez une sortie de $1 $2 par jour pendant $3 jours. Le stock disponible compte $4 unités. Combien d’unités manquent pour couvrir le besoin ?',
    falc: 'Il faut $1 $2 chaque jour, pendant $3 jours.\nLe stock disponible contient $4 unités.\nCombien d’unités manquent ?',
  },
  {
    pattern: /Une entrée de (\d+) ([^.]+) porte le stock à (\d+) avant toute sortie\. Retrouvez le solde avant réception et sa part du nouveau stock, au centième de pour cent\.$/u,
    normal: 'L’entrée de $1 $2 porte le stock à $3 unités. Aucune sortie n’a encore eu lieu. Calculez le stock avant la réception. Quelle part du nouveau stock représente-t-il ? Arrondissez le pourcentage à deux décimales.',
    falc: 'Vous recevez $1 $2.\nAprès la réception, le stock contient $3 unités. Rien n’est sorti.\nCalculez d’abord le stock avant la réception.\nQuelle part du nouveau stock cela représente-t-il ?\nDonnez le pourcentage avec deux chiffres après la virgule.',
  },
  {
    pattern: /Le poste doit traiter (\d+) lots de (\d+) ([^.]+)\. Quel nombre d’unités le relevé doit-il annoncer \?$/u,
    normal: 'Le poste doit traiter $1 lots de $2 $3 chacun. Combien d’unités cela représente-t-il au total ?',
    falc: 'Le poste doit traiter $1 lots.\nChaque lot contient $2 $3.\nCombien d’unités le poste doit-il traiter en tout ?',
  },
  {
    pattern: /Le besoin est de (\d+) ([^.]+)\. Chaque groupe en apporte (\d+)\. Combien de groupes complets faut-il prévoir au minimum \?$/u,
    normal: 'Vous avez besoin de $1 $2. Un groupe contient $3 unités. Combien de groupes entiers faut-il prendre au minimum ?',
    falc: 'Vous voulez au moins $1 $2.\nChaque groupe contient $3 unités.\nVous prenez uniquement des groupes entiers.\nQuel est le plus petit nombre de groupes à prendre ?',
  },
  {
    pattern: /Il reste (\d+) ([^.]+)\. Ils sont groupés par (\d+)\. Donnez le nombre de groupes pleins et le reliquat à tracer séparément\.$/u,
    normal: 'Il reste $1 $2 à répartir par groupes de $3. Indiquez le nombre de groupes complets et le reliquat à noter séparément.',
    falc: 'Vous avez $1 $2.\nFaites des groupes de $3 unités.\nCombien de groupes complets pouvez-vous faire ?\nCombien d’unités restent à noter séparément ? C’est le reliquat.',
  },
  {
    pattern: /Avant la prise en charge, le contrôle dure (\d+) min et la préparation (\d+) min\. Les étapes se succèdent\. À quelle heure finiront-elles si elles commencent à 8 h \?$/u,
    normal: 'Les opérations commencent à 8 h. Le contrôle dure $1 min, puis la préparation dure $2 min. À quelle heure ces deux étapes se terminent-elles ?',
    falc: 'Vous commencez à 8 h.\nFaites d’abord le contrôle. Il dure $1 min.\nFaites ensuite la préparation. Elle dure $2 min.\nÀ quelle heure avez-vous terminé ?',
  },
  {
    pattern: /Il faut finir à 12 h\. La préparation et le contrôle prennent ensemble (\d+) min et la remise encore (\d+) min\. Quelle est l’heure de début au plus tard \?$/u,
    normal: 'La préparation et le contrôle durent ensemble $1 min. La remise dure ensuite $2 min. À quelle heure faut-il commencer au plus tard pour terminer à 12 h ?',
    falc: 'La préparation et le contrôle durent $1 min en tout.\nLa remise prend encore $2 min.\nVous devez avoir terminé à 12 h.\nÀ quelle heure pouvez-vous commencer au plus tard ?',
  },
  {
    pattern: /Sur un créneau de (\d+) min, (\d+) min sont bloquées\. Une opération dure (\d+) min\. Combien d’opérations entières tiennent dans le temps utilisable \?$/u,
    normal: 'Sur les $1 min du créneau, $2 min sont indisponibles. Chaque opération dure $3 min. Combien d’opérations complètes pouvez-vous réaliser ?',
    falc: 'Le créneau dure $1 min.\nVous ne pouvez pas utiliser $2 min.\nUne opération dure $3 min.\nCombien d’opérations pouvez-vous finir dans le temps qui reste ?',
  },
  {
    pattern: /Le poste traite (\d+) ([^.]+) en (\d+) min à cadence constante\. Combien de minutes faut-il pour (\d+) unités avec cette cadence \?$/u,
    normal: 'Le poste traite $1 $2 en $3 min. Combien de minutes faut-il pour traiter $4 $2 à la même cadence ?',
    falc: 'Le poste traite $1 $2 en $3 min.\nLa cadence ne change pas.\nCombien de minutes faut-il pour traiter $4 $2 ?',
  },
  {
    pattern: /Sur (\d+) ([^,]+), (\d+) sont satisfaites dans les conditions prévues\. Calculez le taux de service au centième de pour cent\.$/u,
    normal: 'Sur $1 $2, $3 remplissent les conditions du service. Calculez le taux de service en pourcentage et arrondissez à deux décimales.',
    falc: 'Il y a $1 $2.\n$3 remplissent les conditions du service.\nCalculez le taux de service.\nDonnez le résultat en pourcentage avec deux chiffres après la virgule.',
  },
  {
    pattern: /Un montant de CHF ([\d'’.,]+) couvre (\d+) ([^.]+)\. Quel coût complet moyen par unité faut-il comparer, au centime \?$/u,
    normal: 'Le coût total, frais compris, est de CHF $1 pour $2 $3. Calculez le coût moyen par unité et arrondissez au centime.',
    falc: 'Il y a $2 $3.\nLe total est de CHF $1 avec les frais.\nQuel est le coût moyen d’une unité ?\nArrondissez au centime.',
  },
  {
    pattern: /Le plan prévoit (\d+) travées, (\d+) niveaux et (\d+) positions par niveau et par travée\. Combien de ([^.]+) le plan peut-il recevoir \?$/u,
    normal: 'Le rayonnage compte $1 travées. Chaque travée a $2 niveaux, avec $3 positions par niveau. Combien de $4 peut-on ranger au total ?',
    falc: 'Le rayonnage compte $1 travées.\nIl y a $2 niveaux dans chaque travée.\nChaque niveau offre $3 positions.\nCombien de $4 peut-on ranger en tout ?',
  },
]

const shortQuestions: readonly (readonly [string, string, string])[] = [
  ['Quel objectif professionnel guide ce dossier ?', 'Quel est le but du travail décrit dans cette situation ?',
    'Quel est le but de ce travail ?'],
  ['Quel critère du cours appliquez-vous ici ?', 'Sur quel point du cours vous appuyez-vous pour décider dans cette situation ?',
    'Quel point du cours vous aide à prendre une décision ici ?'],
  ['Quelle mesure prenez-vous avant de continuer ?', 'Quelle action prenez-vous avant de poursuivre le travail ?',
    'Que faites-vous avant de continuer ?'],
  ['Quelle information laissez-vous au poste suivant pour qu’il puisse contrôler le dossier ?',
    'Quelles informations transmettez-vous au poste suivant pour qu’il puisse vérifier l’opération ?',
    'Le poste suivant doit pouvoir vérifier le travail.\nQuelles informations lui donnez-vous ?'],
  ['Quelle conséquence le dossier cherche-t-il à éviter ?', 'Quel problème faut-il éviter dans cette situation ?',
    'Quel problème veut-on éviter ?'],
  ['Comment vérifiez-vous un total quand le relevé comporte des lots complets et des unités isolées ?',
    'Comment calculez-vous le total des unités à partir de lots complets et d’unités seules ?',
    'Le relevé contient des lots complets et des unités seules.\nExpliquez comment calculer le nombre total d’unités.'],
  ['Quel total utilisez-vous comme dénominateur pour le taux d’écart d’un contrôle ?',
    'Quelle quantité totale sert de dénominateur quand vous calculez le taux d’écart ?',
    'Vous calculez le taux d’écart d’un contrôle.\nQuel nombre mettez-vous sous la barre de division ? Ce nombre s’appelle le dénominateur.'],
  ['Pour estimer le temps de travail utilisable, que faut-il retirer du créneau total ?',
    'Quelles durées retirez-vous du créneau pour obtenir le temps de travail utilisable ?',
    'Vous voulez connaître le temps disponible pour travailler.\nQuels moments retirez-vous de la durée totale du créneau ?'],
  ['À quelle condition la file d’attente grandit-elle ?', 'Que devez-vous comparer pour savoir si la file d’attente s’allonge ?',
    'Quand la file d’attente devient-elle plus longue ?\nExpliquez le lien entre les arrivées et le travail du poste.'],
  ['Quelle masse comparez-vous à une limite qui porte sur une unité emballée ?',
    'Quelle masse mesurez-vous pour vérifier que l’unité emballée respecte la limite ?',
    'Une limite de masse s’applique à l’unité emballée.\nQuelle masse mesurez-vous pour vérifier cette limite ?'],
  ['Quelle quantité sert à accepter une nouvelle demande si une partie des unités est réservée ?',
    'Quelle quantité vérifiez-vous avant d’accepter une nouvelle demande quand des unités sont déjà réservées ?',
    'Des unités sont déjà réservées.\nQuel nombre vérifiez-vous pour savoir si vous pouvez accepter une autre demande ?'],
  ['Pourquoi la surface seule ne permet-elle pas de donner le nombre de positions ?',
    'Pourquoi la surface totale ne suffit-elle pas pour calculer le nombre d’emplacements ?',
    'Vous connaissez la surface totale.\nPourquoi devez-vous encore vérifier d’autres éléments pour compter les emplacements ?'],
  ['a) Formulez l’objectif. b) Expliquez le contrôle à prévoir. c) Indiquez la trace à préparer.',
    'a) Précisez le but de l’opération. b) Expliquez ce que vous devez contrôler. c) Indiquez ce que vous devez noter pour garder une trace.',
    'a) Quel est le but de l’opération ?\nb) Que devez-vous vérifier ?\nc) Que devez-vous noter pour garder une trace ?'],
  ['a) Indiquez la suite immédiate. b) Justifiez-la par une conséquence possible. c) Dites ce que votre collègue doit retrouver dans la trace.',
    'a) Quelle action prenez-vous immédiatement ? b) Quelle conséquence voulez-vous éviter ? c) Quelles informations votre collègue doit-il retrouver ?',
    'a) Que faites-vous tout de suite ?\nb) Quel problème voulez-vous éviter avec cette action ?\nc) Que notez-vous pour votre collègue ?'],
  ['a) Indiquez le critère à vérifier sur la nouvelle donnée. b) Précisez ce que vous consignez. c) Expliquez le risque si l’ancienne conclusion est réutilisée.',
    'a) Quel point contrôlez-vous avec la nouvelle information ? b) Quelles données notez-vous ? c) Quel risque prenez-vous si vous reprenez l’ancienne conclusion ?',
    'a) Que vérifiez-vous avec la nouvelle information ?\nb) Que notez-vous ?\nc) Quel problème peut arriver si vous reprenez l’ancienne conclusion ?'],
  ['a) Donnez l’objectif. b) Que vérifiez-vous ? c) Que consignez-vous ?',
    'a) Quel est le but de l’opération ? b) Quels éléments devez-vous vérifier ? c) Quelles informations devez-vous enregistrer ?',
    'a) Quel est le but du travail ?\nb) Que vérifiez-vous ?\nc) Que notez-vous ?'],
  ['a) Décidez de la suite. b) Quel risque évitez-vous ? c) Que consignez-vous ?',
    'a) Quelle action choisissez-vous pour la suite ? b) Quel risque cherchez-vous à éviter ? c) Quelles informations enregistrez-vous ?',
    'a) Que faites-vous ensuite ?\nb) Quel problème voulez-vous éviter ?\nc) Que notez-vous ?'],
  ['a) Quel critère vérifiez-vous ? b) Que consignez-vous ? c) Quel risque subsiste ?',
    'a) Quel critère utilisez-vous pour effectuer le contrôle ? b) Quelles informations notez-vous ? c) Quel risque reste présent ?',
    'a) Quel point vérifiez-vous ?\nb) Que notez-vous ?\nc) Quel problème peut encore se produire ?'],
]

const photoWording: Readonly<Record<string, LogistiqueWording>> = {
  'log-406-photo-emplacement-v023': {
    normal: 'Quel principe de rangement le bac R08 illustre-t-il ? Justifiez votre réponse en observant le rayonnage.',
    falc: 'Regardez le bac R08 et l’étiquette du rayon.\nQuel principe de rangement est utilisé ?\nExpliquez quel détail vous aide à répondre.',
  },
  'log-408-photo-appui-v023': {
    normal: 'Quel type de charge le pied du rayonnage transmet-il au sol ? Justifiez en décrivant la surface en contact.',
    falc: 'Regardez le pied du rayonnage et la plaque qui touche le sol.\nQuel type de charge le pied transmet-il au sol ?\nDécrivez la taille de la surface en contact avec le sol.',
  },
  'log-504-photo-signal-v023': {
    normal: 'Comment appelle-t-on le signal visible sur la photo ? À quel moment l’utilise-t-on pour réapprovisionner le bac ?',
    falc: 'Regardez le signal sur le bac.\nComment s’appelle ce signal ?\nQuand l’utilisez-vous pour demander de nouvelles pièces ?',
  },
  'log-405-photo-plan-v023': {
    normal: 'Qu’indique la responsable près de la porte ? Citez une autre information à connaître pour organiser l’évacuation.',
    falc: 'Regardez le document que la responsable montre près de la porte.\nQuelle information montre-t-elle ?\nCitez une autre information utile pour évacuer.',
  },
  'log-408-photo-occupation-v023': {
    normal: 'Combien de positions sont libres et combien sont occupées ? Expliquez comment calculer le taux d’occupation du rayonnage.',
    falc: 'Comptez les places libres.\nComptez les places avec une palette.\nExpliquez comment utiliser ces nombres pour trouver le taux d’occupation.',
  },
  'log-503-photo-goulot-v023': {
    normal: 'Décrivez la situation des bacs avant et après le poste de contrôle. Quel effet cette situation peut-elle avoir sur la production ?',
    falc: 'Regardez les bacs avant le poste de contrôle.\nRegardez les bacs après le poste.\nDécrivez la différence.\nQuel effet a-t-elle sur la production de l’atelier ?',
  },
  'log-602-photo-calage-v023': {
    normal: 'Où se trouve le rembourrage ? Quel mouvement de la pièce doit-il limiter pendant le transport ?',
    falc: 'Regardez la pièce dans le carton.\nOù sont les blocs de rembourrage ?\nQue doit éviter le rembourrage quand le carton est transporté ?',
  },
}

const cases: Readonly<Record<string, { falc: string; questions: readonly string[] }>> = {
  'log-308-cas-masse-v016': {
    falc: 'Contrôlez la palette avant le départ.\nLe client limite la masse de la marchandise seule à 190 kg.',
    questions: [
      'Comment s’appelle la masse de la palette avec sa marchandise ?',
      'Calculez la masse de la marchandise seule.',
      'La masse de la marchandise respecte-t-elle la limite du client ?',
    ],
  },
  'log-406-cas-repartir-fifo-v016': {
    falc: 'Préparez 36 pièces du même article.\nDeux lots sont disponibles. Suivez la règle FIFO.',
    questions: [
      'Dans quel lot prenez-vous les premières pièces ?',
      'Calculez combien de pièces vous prenez dans le lot R.',
      'Quel mouvement de stock notez-vous pour le lot R ?',
    ],
  },
  'log-601-cas-conditionnement-v016': {
    falc: 'Préparez 28 pièces D52 d’après la fiche.',
    questions: [
      'À quelle adresse se trouve l’article D52 ?',
      'Vous prenez 3 cartons complets. Combien de pièces seules faut-il ajouter ?',
      'Que vérifiez-vous avant de valider la préparation ?',
    ],
  },
  'log-701-cas-ecart-positive-v016': {
    falc: 'Comparez le stock compté et le stock du système.\nSi l’écart dépasse 2 unités, comptez à nouveau.',
    questions: [
      'Combien d’unités avez-vous comptées ?',
      'Calculez l’écart signé. Faites stock réel moins stock théorique.',
      'Que faites-vous avant de modifier le stock ?',
    ],
  },
}

function withContext(prompt: string, start: number, normal: string, falc: string): LogistiqueWording {
  const originalContext = prompt.slice(0, start).trim()
  const context = contexts[originalContext] ?? originalContext
  return {
    normal: [context, normal].filter(Boolean).join(' '),
    falc: [plainContexts[originalContext] ?? context, falc].filter(Boolean).join('\n'),
  }
}

function dossierWording(prompt: string, maths: boolean): LogistiqueWording | undefined {
  if (maths) {
    for (const { pattern, normal, falc } of dossierRules) {
      const match = pattern.exec(prompt)
      if (match) return withContext(prompt, match.index, match[0].replace(pattern, normal), match[0].replace(pattern, falc))
    }
    return undefined
  }
  const matched = shortQuestions.find(([suffix]) => prompt.endsWith(suffix))
  if (matched) return withContext(prompt, prompt.length - matched[0].length, matched[1], matched[2])
  return undefined
}

export function reviewLogistiqueWording(units: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  return units.map((unit) => {
    if (!('prompt' in unit)) return unit
    const reviewedCase = cases[unit.id]
    if (reviewedCase && unit.kind === 'situation' && unit.table?.questions) {
      const questions = unit.table.questions
      if (questions.length !== reviewedCase.questions.length) throw new Error(`Nombre de sous-questions différent dans ${unit.id}`)
      return { ...unit, wording: { normal: unit.prompt, falc: reviewedCase.falc }, table: { ...unit.table,
        questions: questions.map((question, index) => ({ ...question,
          wording: { normal: question.prompt, falc: reviewedCase.questions[index]! },
        })),
      } }
    }
    const wording = photoWording[unit.id] ?? (/^dossiers-\d{3}-v005$/.test(unit.revision)
      ? dossierWording(unit.prompt, unit.kind === 'maths') : undefined)
    return wording ? { ...unit, prompt: wording.normal, wording } : unit
  })
}
