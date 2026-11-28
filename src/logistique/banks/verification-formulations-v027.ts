import type { LogistiqueUnit } from '../approved-banks'
import type { LogistiqueWording } from '../wording'

const questionWording: Readonly<Record<string, LogistiqueWording>> = {
  'Quels éléments doivent être comparables lorsqu’on calcule un coût par unité ?': {
    normal: 'Quelles données devez-vous vérifier pour comparer deux coûts par unité ?',
    falc: 'Vous comparez deux coûts par unité.\nQue vérifiez-vous pour que la comparaison soit juste ?',
  },
  'Pourquoi vérifier les niveaux réellement accessibles avant d’annoncer une capacité ?': {
    normal: 'Pourquoi vérifier quels niveaux sont accessibles avant d’annoncer la capacité de stockage ?',
    falc: 'Vous voulez annoncer la capacité de stockage.\nPourquoi faut-il vérifier quels niveaux sont accessibles ?',
  },
  'Quelle modification augmente le moment sans changer la force ?': {
    normal: 'Comment augmenter le moment du levier en gardant la même force ?',
    falc: 'Vous gardez la même force.\nQue changez-vous sur le levier pour augmenter le moment ?',
  },
  'Quelle différence faites-vous entre volume utile et encombrement extérieur ?': {
    normal: 'Quelle est la différence entre le volume utile et l’encombrement extérieur ?',
    falc: 'Que mesure le volume utile ?\nEt que mesure l’encombrement extérieur ?',
  },
  'Quelle unité donne la formule résistance en N/mm² × section en mm² ?': {
    normal: 'Vous multipliez la résistance en N/mm² par la section en mm². Dans quelle unité exprimez-vous le résultat ?',
    falc: 'La résistance est en N/mm².\nLa section est en mm².\nVous multipliez les deux valeurs.\nQuelle est l’unité du résultat ?',
  },
  'Pourquoi ajouter le temps de transfert au délai de bout en bout ?': {
    normal: 'Pourquoi inclure la durée du transfert dans le délai de bout en bout ?',
    falc: 'Le délai de bout en bout est le temps total du départ à l’arrivée.\nPourquoi faut-il y compter le temps de transfert ?',
  },
  'Quelles deux grandeurs combine-t-on pour obtenir des tonnes-kilomètres ?': {
    normal: 'Quelles deux grandeurs utilisez-vous pour calculer les tonnes-kilomètres ?',
    falc: 'Vous calculez des tonnes-kilomètres.\nDe quelles deux données avez-vous besoin ?',
  },
  'Comment calculez-vous la valeur d’un article compté à l’inventaire ?': {
    normal: 'À partir de l’inventaire, comment calculez-vous la valeur du stock pour une référence ?',
    falc: 'Vous avez compté les articles d’une même référence.\nComment calculez-vous ce que vaut ce stock ?',
  },
  'Quelle base utilisez-vous pour imputer un intérêt au stock ?': {
    normal: 'Sur quelle valeur du stock appliquez-vous le taux d’intérêt ?',
    falc: 'Vous voulez calculer un intérêt sur le stock.\nSur quelle valeur appliquez-vous le taux d’intérêt ?',
  },
  'Quels éléments faut-il connaître pour calculer l’amortissement linéaire annuel ?': {
    normal: 'De quelles données avez-vous besoin pour calculer l’amortissement linéaire annuel ?',
    falc: 'Vous calculez l’amortissement linéaire pour une année.\nQuelles données devez-vous connaître ?',
  },
  'Pourquoi comparer le coût moyen d’une unité en indiquant aussi le volume ?': {
    normal: 'Pourquoi préciser le volume d’activité lorsque vous comparez le coût moyen par unité ?',
    falc: 'Vous comparez le coût moyen d’une unité dans deux cas.\nPourquoi devez-vous aussi indiquer la quantité traitée dans chaque cas ?',
  },
  'Quelle grandeur sert de point de départ au salaire net et au coût direct de l’employeur ?': {
    normal: 'De quel montant partez-vous pour calculer le salaire net et le coût direct de l’employeur ?',
    falc: 'Vous voulez calculer le salaire net.\nVous voulez aussi calculer le coût direct pour l’employeur.\nQuel est le montant de départ dans les deux cas ?',
  },
  'Quel écart de périmètre faut-il contrôler quand on compare deux rémunérations ?': {
    normal: 'Lorsque vous comparez deux rémunérations, que devez-vous vérifier sur les coûts inclus ?',
    falc: 'Vous comparez deux rémunérations.\nQue devez-vous vérifier au sujet des coûts compris dans chaque montant ?',
  },
  'Pourquoi exprimer consommation et stock moyen dans la même unité ?': {
    normal: 'Pourquoi utiliser la même unité pour la consommation et le stock moyen ?',
    falc: 'Vous comparez la consommation et le stock moyen.\nPourquoi faut-il les exprimer dans la même unité ?',
  },
  'Comment calculez-vous le résultat sur la période ?': {
    normal: 'Comment calculez-vous le résultat financier de cette période ?',
    falc: 'Vous cherchez le résultat financier de la période.\nQuel calcul faites-vous ?',
  },
  'Que permet de vérifier la clé d’un GTIN ?': {
    normal: 'À quoi sert la clé de contrôle d’un GTIN ?',
    falc: 'Un GTIN contient une clé de contrôle.\nQue permet-elle de vérifier ?',
  },
  'Pourquoi compter des feuilles plutôt que des pages avant un tirage recto verso ?': {
    normal: 'Pourquoi faut-il calculer le nombre de feuilles nécessaires avant un tirage recto verso ?',
    falc: 'Vous allez imprimer recto verso.\nPourquoi faut-il compter les feuilles pour savoir combien de papier préparer ?',
  },
  'Pourquoi vérifier le nombre de copies ou versions dans un calcul d’espace occupé ?': {
    normal: 'Pourquoi vérifier le nombre de copies ou de versions lorsque vous calculez l’espace occupé ?',
    falc: 'Vous calculez l’espace que prennent les fichiers.\nPourquoi devez-vous vérifier le nombre de copies ou de versions ?',
  },
  'Que faut-il contrôler avant de comparer deux montants importés ?': {
    normal: 'Quelles vérifications faites-vous avant de comparer deux montants importés ?',
    falc: 'Vous avez importé deux montants.\nQue vérifiez-vous avant de les comparer ?',
  },
  'Pourquoi conserver le même facteur pour la largeur et la hauteur d’une image ?': {
    normal: 'Lorsque vous redimensionnez une image, pourquoi appliquer le même facteur à sa largeur et à sa hauteur ?',
    falc: 'Vous changez la taille d’une image.\nPourquoi multipliez-vous sa largeur et sa hauteur par le même nombre ?',
  },
  'Que faut-il revérifier après modification d’une ligne dans un tableau ?': {
    normal: 'Après avoir modifié une ligne du tableau, que devez-vous vérifier de nouveau ?',
    falc: 'Vous avez modifié une ligne dans le tableau.\nQu’est-ce que vous vérifiez de nouveau ?',
  },
  'Quel effet ont les signes dollar dans la référence $E$1 ?': {
    normal: 'Que font les signes dollar dans la référence $E$1 dans Excel ?',
    falc: 'Dans Excel, vous lisez la référence $E$1.\nÀ quoi servent les signes dollar ?',
  },
  'Quelle durée se distingue de la transition entre deux diapositives ?': {
    normal: 'Dans un diaporama, quelle durée est distincte du temps de transition entre les diapositives ?',
    falc: 'La transition est le passage d’une diapositive à la suivante.\nQuelle autre durée compte dans le diaporama ?',
  },
  'Pourquoi vérifier le service couvert avant de comparer deux estimations d’impact ?': {
    normal: 'Pourquoi vérifier quel service couvre chaque estimation avant de comparer leurs impacts ?',
    falc: 'Vous avez deux estimations d’impact.\nPourquoi faut-il vérifier quel service chaque estimation prend en compte ?',
  },
  'Pourquoi rapporter la masse de déchets au nombre de visiteurs ?': {
    normal: 'Pourquoi calculer la masse de déchets par visiteur ?',
    falc: 'Vous connaissez la masse totale de déchets et le nombre de visiteurs.\nÀ quoi sert le calcul de la masse de déchets par visiteur ?',
  },
  'Quel montant appartient à l’encaissement quand une vente a été payée en partie ?': {
    normal: 'Un client a payé une partie de sa facture. Quel montant enregistrez-vous comme encaissement ?',
    falc: 'Le client a réglé une partie de sa facture.\nQuel montant comptez-vous dans l’encaissement ?',
  },
  'Quel groupe sert de base si l’on mesure le passage d’une étape du parcours client à la suivante ?': {
    normal: 'Quel groupe prenez-vous comme base pour mesurer le passage d’une étape du parcours client à la suivante ?',
    falc: 'Vous mesurez le passage d’une étape du parcours client à la suivante.\nQuel groupe de personnes prenez-vous comme base ?',
  },
  'Quelles données faut-il harmoniser pour calculer une part de marché ?': {
    normal: 'Quelles données devez-vous rendre comparables avant de calculer une part de marché ?',
    falc: 'Vous calculez une part de marché.\nQuelles données devez-vous comparer dans les mêmes conditions ?',
  },
  'Pourquoi comparer une tolérance et une mesure dans la même unité ?': {
    normal: 'Pourquoi exprimer la mesure et la tolérance dans la même unité avant de les comparer ?',
    falc: 'Vous comparez une mesure à une tolérance.\nPourquoi faut-il utiliser la même unité ?',
  },
  'À quoi sert la quantité donnée par la formule d’Andler ?': {
    normal: 'À quoi sert la quantité économique obtenue avec la formule d’Andler ?',
    falc: 'La formule d’Andler donne une quantité économique.\nÀ quoi sert ce résultat ?',
  },
  'Que représente la remontée du niveau après la baisse du stock sur un cycle de réapprovisionnement ?': {
    normal: 'Après une baisse du stock, son niveau remonte. Que représente cette remontée dans le cycle de réapprovisionnement ?',
    falc: 'Le niveau du stock baisse. Ensuite, il remonte.\nQue représente cette remontée dans le cycle de réapprovisionnement ?',
  },
}

function verificationWording(prompt: string): LogistiqueWording | undefined {
  const definition = /^Dans ce module, expliquez le terme (« .+ ») avec vos propres mots\.$/u.exec(prompt)
  if (definition) {
    const term = definition[1]
    return {
      normal: `Que signifie ${term} ? Expliquez ce terme avec vos propres mots.`,
      falc: `Que veut dire ${term} ?\nRépondez avec vos mots.`,
    }
  }
  const endOfContext = prompt.indexOf('. ')
  if (endOfContext < 0) return undefined
  const context = prompt.slice(0, endOfContext + 1)
  const question = prompt.slice(endOfContext + 2)
  const rates = /^Comment interprétez-vous la progression de (\d+ %) à (\d+ %) \?$/u.exec(question)
  const wording = rates ? {
    normal: `Que signifie le passage de ${rates[1]} à ${rates[2]} ? Exprimez l’évolution en points de pourcentage.`,
    falc: `Le taux était de ${rates[1]}. Il est maintenant de ${rates[2]}.\nDe combien de points de pourcentage a-t-il augmenté ?`,
  } : Object.hasOwn(questionWording, question) ? questionWording[question] : undefined
  if (wording) return { normal: `${context} ${wording.normal}`, falc: `${context}\n${wording.falc}` }
}

export function reviewLogistiqueVerificationWording(units: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  return units.map((unit) => {
    if (unit.wording || unit.kind !== 'verification' || !/^dossiers-\d{3}-v005$/.test(unit.revision)) return unit
    const wording = verificationWording(unit.prompt)
    return wording ? { ...unit, prompt: wording.normal, wording } : unit
  })
}
