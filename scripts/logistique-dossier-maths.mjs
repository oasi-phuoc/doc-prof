const number = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 2 })
const precise = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 3 })
const n = (value) => number.format(value)
const n3 = (value) => precise.format(value)
const sum = (values) => values.reduce((total, value) => total + value, 0)
const percent = (value, total) => n(value / total * 100)

function stock(unit, [initial, received, used, held, daily, delay]) {
  const end = initial + received - used
  const available = end - held
  return [
    [`Le relevé ouvre à ${initial} ${unit}. Il enregistre une entrée de ${received} et une sortie de ${used}. Quel est le stock physique final ?`,
      `${end} ${unit}`, `Additionnez les entrées et retranchez les sorties. ${initial} + ${received} − ${used} = ${end}.`],
    [`Le comptage de ${end} ${unit} inclut ${held} unités réservées qui restent sur place. Quel stock peut servir une autre demande ?`,
      `${available} ${unit}`, `Le disponible exclut ce qui est déjà affecté. ${end} − ${held} = ${available}.`],
    [`Il reste ${available} ${unit} disponibles et on en consomme ${daily} par jour. Sur combien de journées complètes peut-on compter sans arrivée ?`,
      `${Math.floor(available / daily)} jours complets`, `Divisez ${available} par ${daily} et retenez la partie entière. Une journée partielle ne couvre pas une journée complète.`],
    [`La sortie prévue est de ${daily} ${unit} par jour pour les ${delay} prochains jours. Le stock disponible en contient ${daily * delay - held}. Quel manque faut-il couvrir ?`,
      `${held} ${unit}`, `Le besoin vaut ${daily} × ${delay} = ${daily * delay}. Le manque est de ${daily * delay} − ${daily * delay - held} = ${held}.`],
    [`Une entrée de ${received} ${unit} porte le stock à ${initial + received} avant toute sortie. Retrouvez le solde avant réception et sa part du nouveau stock, au centième de pour cent.`,
      `${initial} ${unit}, soit ${percent(initial, initial + received)} %`, `Retirez l’entrée pour retrouver le solde initial. ${initial + received} − ${received} = ${initial}. Rapportez ensuite ce solde à ${initial + received}.`],
  ]
}

function series(unit, [groups, per, request, defect, pack, available]) {
  const total = groups * per
  return [
    [`Le poste doit traiter ${groups} lots de ${per} ${unit}. Quel nombre d’unités le relevé doit-il annoncer ?`,
      `${total} ${unit}`, `Chaque lot apporte ${per} unités. ${groups} × ${per} = ${total}.`],
    [`Le besoin est de ${request} ${unit}. Chaque groupe en apporte ${per}. Combien de groupes complets faut-il prévoir au minimum ?`,
      `${Math.ceil(request / per)} groupes`, `Divisez ${request} par ${per} et prenez l’entier supérieur s’il reste une partie à servir.`],
    [`Parmi ${total} ${unit} contrôlés, ${defect} sont mis de côté. Quelle fraction en pour cent reste dans le lot, au centième ?`,
      `${percent(total - defect, total)} %`, `Le nombre retenu vaut ${total} − ${defect} = ${total - defect}. Rapportez-le à l’effectif contrôlé.`],
    [`Il reste ${available} ${unit}. Ils sont groupés par ${pack}. Donnez le nombre de groupes pleins et le reliquat à tracer séparément.`,
      `${Math.floor(available / pack)} groupes, reliquat de ${available % pack} ${unit}`, `La division s’écrit ${available} = ${Math.floor(available / pack)} × ${pack} + ${available % pack}.`],
    [`Le dossier mentionne ${total + pack} ${unit}. Le contrôle trouve ${groups} groupes de ${per} et ${pack - 1} unités isolées. Quel écart signé faut-il transmettre ?`,
      `−1 ${unit}`, `Le constat totalise ${groups} × ${per} + ${pack - 1} = ${total + pack - 1}. Constat moins prévu vaut −1.`],
  ]
}

function planning(unit, [window, first, second, batch, breakTime, pending]) {
  const cycle = first + second
  return [
    [`Avant la prise en charge, le contrôle dure ${first} min et la préparation ${second} min. Les étapes se succèdent. À quelle heure finiront-elles si elles commencent à 8 h ?`,
      `${n(8 + Math.floor(cycle / 60))} h ${String(cycle % 60).padStart(2, '0')}`, `Additionnez les étapes. ${first} + ${second} = ${cycle} min après 8 h.`],
    [`Il faut finir à 12 h. La préparation et le contrôle prennent ensemble ${cycle} min et la remise encore ${breakTime} min. Quelle est l’heure de début au plus tard ?`,
      `${Math.floor((720 - cycle - breakTime) / 60)} h ${String((720 - cycle - breakTime) % 60).padStart(2, '0')}`, `Remontez de ${cycle} + ${breakTime} = ${cycle + breakTime} min depuis 12 h.`],
    [`Sur un créneau de ${window} min, ${breakTime} min sont bloquées. Une opération dure ${cycle} min. Combien d’opérations entières tiennent dans le temps utilisable ?`,
      `${Math.floor((window - breakTime) / cycle)} opérations`, `Il reste ${window} − ${breakTime} = ${window - breakTime} min. Divisez par ${cycle} et gardez le nombre d’opérations complètes.`],
    [`Le poste traite ${batch} ${unit} en ${first} min à cadence constante. Combien de minutes faut-il pour ${batch * 2} unités avec cette cadence ?`,
      `${2 * first} min`, `Le volume à traiter est deux fois plus grand. À cadence constante, le temps double, soit ${first} × 2.`],
    [`La file contient ${pending} ${unit}. Pendant chacune de deux périodes, on en traite ${batch} et ${batch - 2} nouveaux arrivent. À combien s’élève la file après les deux périodes ?`,
      `${pending - 4} ${unit}`, `Le solde baisse de ${batch} − ${batch - 2} = 2 unités par période. Après deux périodes, il reste ${pending} − 2 × 2.`],
  ]
}

function area(unit, [length, width, pitchLength, pitchWidth, occupied, keepFree]) {
  const cap = Math.floor(length / pitchLength) * Math.floor(width / pitchWidth)
  const capRotated = Math.floor(length / pitchWidth) * Math.floor(width / pitchLength)
  return [
    [`La zone rectangulaire mesure ${n(length)} m sur ${n(width)} m. Quel nombre de mètres carrés faut-il inscrire au plan ?`,
      `${n(length * width)} m²`, `La surface vaut longueur × largeur. ${n(length)} × ${n(width)} = ${n(length * width)} m².`],
    [`Le plan autorise une trame régulière de ${n(pitchLength)} m sur ${n(pitchWidth)} m par unité. Dans une zone utile de ${n(length)} m sur ${n(width)} m, combien de ${unit} tiennent dans cette orientation ?`,
      `${cap} ${unit}`, `Les deux côtés permettent ${Math.floor(length / pitchLength)} et ${Math.floor(width / pitchWidth)} unités entières. Multipliez ces deux nombres.`],
    [`Le plan prévoit ${cap} emplacements de ${unit}, dont ${occupied} occupés. Quel est le taux d’occupation au centième de pour cent ?`,
      `${percent(occupied, cap)} %`, `Divisez les places occupées par la capacité du plan. ${occupied} ÷ ${cap} × 100 ≈ ${percent(occupied, cap)} %.`],
    [`Sur ${cap} places, ${occupied} sont prises. Il faut en laisser au moins ${keepFree} libres. Combien de ${unit} peut-on ajouter selon ce critère ?`,
      `${cap - occupied - keepFree} ${unit}`, `La marge utilisable vaut ${cap} − ${occupied} − ${keepFree} = ${cap - occupied - keepFree}.`],
    [`Deux trames régulières sont autorisées pour ${unit}. La zone mesure ${n(length)} m sur ${n(width)} m. Comparez les capacités selon que le côté de ${n(pitchLength)} m ou celui de ${n(pitchWidth)} m est parallèle à la longueur.`,
      `${cap} puis ${capRotated} places`, `Divisez et arrondissez à l’entier inférieur sur chaque côté avant de multiplier. On obtient ${cap} dans la première orientation et ${capRotated} dans l’autre.`],
  ]
}

function audit(unit, [a, errorsA, b, errorsB, threshold, fixed]) {
  return [
    [`Une série compte ${a} ${unit} contrôlés et ${errorsA} écarts. Calculez le taux d’écart au centième de pour cent.`,
      `${percent(errorsA, a)} %`, `Rapportez le nombre d’écarts au nombre contrôlé. ${errorsA} ÷ ${a} × 100 ≈ ${percent(errorsA, a)} %.`],
    [`Sur ${a} ${unit}, on trouve ${errorsA} écarts. Sur ${b} autres, on en trouve ${errorsB}. Calculez le taux global au centième de pour cent.`,
      `${percent(errorsA + errorsB, a + b)} %`, `Regroupez les effectifs. (${errorsA} + ${errorsB}) ÷ (${a} + ${b}) × 100 ≈ ${percent(errorsA + errorsB, a + b)} %.`],
    [`Le seuil de suivi est d’au plus ${threshold} % d’écarts sur ${b} ${unit}. Quel nombre entier d’écarts est le maximum compatible ?`,
      `${Math.floor(b * threshold / 100)} écarts`, `Le seuil correspond à ${b} × ${threshold} ÷ 100 = ${n(b * threshold / 100)}. Gardez l’entier inférieur si le seuil n’est pas entier.`],
    [`Le relevé avant action consigne ${errorsA} écarts et le relevé suivant en trouve ${fixed} sur un effectif identique. Quelle baisse relative du nombre d’écarts constatez-vous, au centième de pour cent ?`,
      `${percent(errorsA - fixed, errorsA)} %`, `L’écart de nombre est ${errorsA} − ${fixed} = ${errorsA - fixed}. Rapportez-le au nombre de départ, ${errorsA}.`],
    [`Dans les ${a} ${unit} contrôlés, ${errorsA} sont signalés pour un premier motif et ${errorsB} pour un autre. ${fixed} sont comptés dans les deux groupes. Combien d’unités distinctes sont signalées ?`,
      `${errorsA + errorsB - fixed} ${unit}`, `Additionnez les deux groupes et retranchez les doubles comptages. ${errorsA} + ${errorsB} − ${fixed} = ${errorsA + errorsB - fixed}.`],
  ]
}

function cost(unit, [qty, base, higher, fixed, ceiling, discount]) {
  const delivered = qty * base + fixed
  return [
    [`Pour ${qty} ${unit}, le tarif est de CHF ${n(base)} par unité et CHF ${n(fixed)} de frais fixes. Quel est le total à prévoir ?`,
      `CHF ${n(delivered)}`, `Le prix proportionnel vaut ${qty} × ${n(base)}. Ajoutez les frais fixes. Le total est CHF ${n(delivered)}.`],
    [`Un montant de CHF ${n(delivered)} couvre ${qty} ${unit}. Quel coût complet moyen par unité faut-il comparer, au centime ?`,
      `CHF ${n(delivered / qty)} par unité`, `Répartissez le total, frais inclus, sur les ${qty} unités. ${n(delivered)} ÷ ${qty} ≈ ${n(delivered / qty)}.`],
    [`Deux offres de même périmètre facturent CHF ${n(base)} l’unité avec CHF ${n(fixed)} de frais, ou CHF ${n(higher)} sans supplément. À partir de combien de ${unit} la première devient-elle strictement moins chère ?`,
      `À partir de ${Math.floor(fixed / (higher - base)) + 1} ${unit}`, `Le gain par unité est CHF ${n(higher - base)}. Il doit compenser strictement CHF ${n(fixed)} de frais. Comparez la quantité à ${n(fixed / (higher - base))}.`],
    [`Sur un budget de CHF ${n(ceiling)}, comptez CHF ${n(fixed)} de frais puis CHF ${n(base)} par unité. Combien de ${unit} peut-on payer au maximum ?`,
      `${Math.floor((ceiling - fixed) / base)} ${unit}`, `Retirez d’abord les frais fixes. Divisez le solde de CHF ${n(ceiling - fixed)} par le tarif et gardez l’entier inférieur.`],
    [`Le volume est de ${qty} ${unit} à CHF ${n(base)} l’unité. Un rabais de ${discount} % s’applique seulement au montant proportionnel. Les frais fixes restent à CHF ${n(fixed)}. Quel total faut-il prévoir ?`,
      `CHF ${n(qty * base * (1 - discount / 100) + fixed)}`, `Appliquez le rabais au montant de CHF ${n(qty * base)}, puis ajoutez CHF ${n(fixed)}.`],
  ]
}

function mass(unit, [gross, tare, packets, limit, ratio, extra]) {
  const net = gross - tare
  return [
    [`La masse brute de ${n(gross)} kg inclut un support de ${n(tare)} kg. Calculez la masse nette de ${unit}.`,
      `${n(net)} kg`, `Retirez la tare de la masse brute. ${n(gross)} − ${n(tare)} = ${n(net)} kg.`],
    [`La masse nette de ${n(net)} kg est répartie également dans ${packets} unités de ${unit}. Calculez la masse nette par unité au centième de kilogramme.`,
      `${n(net / packets)} kg par unité`, `Divisez la masse nette totale par le nombre d’unités. ${n(net)} ÷ ${packets} ≈ ${n(net / packets)}.`],
    [`La fiche de l’exercice limite la masse totale à ${n(limit)} kg. L’unité actuelle pèse ${n(gross)} kg. Quel écart à la limite faut-il relever ?`,
      `${n(Math.abs(limit - gross))} kg ${gross > limit ? 'au-dessus' : 'en dessous'} de la limite`, `Comparez la masse brute à la limite écrite. La différence absolue est de ${n(Math.abs(limit - gross))} kg.`],
    [`Le stock dispose de ${n(net)} kg de ${unit}. Une unité consomme ${n(ratio)} kg. Combien d’unités entières ce stock couvre-t-il et quelle masse reste-t-il ?`,
      `${Math.floor(net / ratio)} unités, reste ${n(net - Math.floor(net / ratio) * ratio)} kg`, `Comptez seulement des unités entières, puis retranchez leur consommation de la masse initiale.`],
    [`Deux relevés de masse brute donnent ${n(gross)} kg avant la remise d’une partie et ${n(gross - extra)} kg après. Le contenant de ${n(tare)} kg est identique. Quel pourcentage de la masse de ${unit} a été retiré, au centième ?`,
      `${percent(extra, net)} %`, `La masse retirée est de ${n(extra)} kg. Le pourcentage se calcule sur la masse nette initiale de ${n(net)} kg.`],
  ]
}

function levels(unit, [rows, levels, places, loadLimit, massPerUnit, closed]) {
  const cap = rows * levels * places
  return [
    [`Le plan prévoit ${rows} travées, ${levels} niveaux et ${places} positions par niveau et par travée. Combien de ${unit} le plan peut-il recevoir ?`, `${cap} ${unit}`, `${rows} × ${levels} × ${places} = ${cap} positions.`],
    [`Un niveau complet de ${places} ${unit} est condamné. Combien de positions restent sur les ${cap} prévues ?`, `${cap - places} positions`, `Retirez les positions du niveau condamné. ${cap} − ${places} = ${cap - places}.`],
    [`Le plan prévoit ${cap} positions pour ${unit}. ${closed} positions sont fermées. Quelle part en pour cent reste exploitable, au centième ?`, `${percent(cap - closed, cap)} %`, `Le plan laisse ${cap} − ${closed} = ${cap - closed} positions ouvertes. Comparez-les à la capacité totale.`],
    [`Dans cet exercice de lecture, la charge maximale indiquée est de ${loadLimit} kg pour un niveau. Chaque unité pèse ${massPerUnit} kg. Combien d’unités respecte cette limite et la limite de ${places} positions ?`, `${Math.min(places, Math.floor(loadLimit / massPerUnit))} unités`, `La masse permet ${Math.floor(loadLimit / massPerUnit)} unités au plus et le plan donne ${places} positions. Retenez la plus petite des deux limites.`],
    [`Vous devez trouver ${cap - closed + places} positions sur un plan. Chaque travée entière en fournit ${levels * places}. Combien de travées faut-il au minimum ?`, `${Math.ceil((cap - closed + places) / (levels * places))} travées`, `Une travée fournit ${levels} × ${places} = ${levels * places} positions. Divisez le besoin par ce nombre et arrondissez au supérieur.`],
  ]
}

function cadence(unit, [incoming, outgoing, minutes, interval, reserve, stopped]) {
  return [
    [`Le suivi mesure ${incoming} ${unit} par minute à l’entrée du flux. Quel total attend-on en ${minutes} min à cadence constante ?`, `${incoming * minutes} ${unit}`, `Multipliez la cadence par la durée. ${incoming} × ${minutes} = ${incoming * minutes}.`],
    [`Le flux reçoit ${incoming} ${unit} par minute et traite ${outgoing} par minute. Quel nombre d’unités s’ajoute à la file en ${minutes} min ?`, `${(incoming - outgoing) * minutes} ${unit}`, `L’accumulation vaut ${incoming} − ${outgoing} = ${incoming - outgoing} par minute, puis multipliez par ${minutes}.`],
    [`Une réserve de file accepte ${reserve} ${unit}. À une accumulation de ${incoming - outgoing} unités par minute, après combien de minutes la réserve atteint-elle sa limite ? Donnez la durée au centième.`, `${n(reserve / (incoming - outgoing))} min`, `Divisez la marge de la file par sa hausse par minute. ${reserve} ÷ ${incoming - outgoing} ≈ ${n(reserve / (incoming - outgoing))}.`],
    [`Deux opérateurs se relaient. Le premier traite ${incoming} ${unit} par minute pendant ${minutes} min et le second ${outgoing} pendant ${interval} min. Calculez la cadence moyenne au centième sur ces deux durées.`, `${n((incoming * minutes + outgoing * interval) / (minutes + interval))} unités/min`, `Le total traité est ${incoming * minutes + outgoing * interval}, en ${minutes + interval} min. Divisez les deux totaux.`],
    [`La cadence attendue est de ${outgoing} ${unit} par minute pendant ${minutes} min. Un arrêt empêche tout traitement pendant ${stopped} min. Combien d’unités de moins terminent ce créneau ?`, `${outgoing * stopped} ${unit}`, `Les unités perdues correspondent à la durée d’arrêt. ${outgoing} × ${stopped} = ${outgoing * stopped}.`],
  ]
}

function lever(_unit, [force, arm, comparable, otherArm, addedForce, addedArm]) {
  const moment = force * arm
  return [
    [`Sur le modèle de table, une force de ${force} N agit à ${n(arm)} m du pivot. Quel moment exerce-t-elle ?`, `${n(moment)} N·m`, `Moment = force × bras. ${force} × ${n(arm)} = ${n(moment)} N·m.`],
    [`On cherche le même moment de ${n(moment)} N·m avec une force de ${comparable} N. Quel bras faut-il, au centième de mètre ?`, `${n(moment / comparable)} m`, `Bras = moment ÷ force. ${n(moment)} ÷ ${comparable} ≈ ${n(moment / comparable)} m.`],
    [`La force de ${force} N passe de ${n(arm)} m à ${n(otherArm)} m. Calculez la variation du moment en donnant le signe.`, `${n(force * (otherArm - arm))} N·m`, `Moment final moins initial vaut ${force} × (${n(otherArm)} − ${n(arm)}) = ${n(force * (otherArm - arm))} N·m.`],
    [`Deux forces agissent dans le même sens de rotation, ${force} N à ${n(arm)} m et ${addedForce} N à ${n(addedArm)} m. Quel moment total calculer ?`, `${n(moment + addedForce * addedArm)} N·m`, `Additionnez les moments de même sens. ${force} × ${n(arm)} + ${addedForce} × ${n(addedArm)} = ${n(moment + addedForce * addedArm)}.`],
    [`Le modèle oppose les moments de ${force} N à ${n(arm)} m et de ${addedForce} N à ${n(addedArm)} m. Quel écart sépare leurs valeurs ?`, `${n(Math.abs(moment - addedForce * addedArm))} N·m`, `Calculez séparément ${n(moment)} et ${n(addedForce * addedArm)} N·m, puis prenez leur différence absolue.`],
  ]
}

function route(_unit, [firstKm, secondKm, firstMin, secondMin, stop, deadline]) {
  const km = firstKm + secondKm
  const trip = firstMin + secondMin + stop
  return [
    [`Le parcours comporte deux tronçons de ${firstKm} et ${secondKm} km. Quelle distance figure au relevé de trajet ?`, `${km} km`, `Additionnez les deux tronçons. ${firstKm} + ${secondKm} = ${km} km.`],
    [`Les tronçons durent ${firstMin} et ${secondMin} min, séparés par un transfert de ${stop} min. Quelle durée totale annoncer ?`, `${trip} min`, `Le transfert compte dans le délai de bout en bout. ${firstMin} + ${stop} + ${secondMin} = ${trip} min.`],
    [`Le parcours complet de ${km} km doit finir dans les ${deadline} min. Les déplacements et le transfert demandent ${trip} min. Calculez la marge ou le dépassement par rapport au délai.`, `${Math.abs(deadline - trip)} min ${deadline >= trip ? 'de marge' : 'de dépassement'}`, `Comparez le délai prévu à celui du parcours complet. La différence absolue vaut ${Math.abs(deadline - trip)} min.`],
    [`Le trajet parcourt ${km} km en ${firstMin + secondMin} min de déplacement. Une attente de ${stop} min s’ajoute. Calculez la vitesse moyenne sur la durée totale, au dixième de kilomètre par heure.`, `${n(Math.round(km * 600 / trip) / 10)} km/h`, `Divisez ${km} km par ${trip} ÷ 60 heures, puis arrondissez au dixième.`],
    [`Il reste ${secondKm} km et ${secondMin} min de déplacement prévus. Le délai de livraison permet ${secondMin + stop} min pour terminer. Quel délai intermédiaire maximum peut-on absorber, si le temps de déplacement reste le même ?`, `${stop} min`, `La marge avant l’échéance vaut ${secondMin + stop} − ${secondMin} = ${stop} min. Comparez un délai supplémentaire à cette marge.`],
  ]
}

function tonneDistance(_unit, [km, tonnes, tariff, altKm, altTonnes, fee]) {
  const work = km * tonnes
  const charge = work * tariff
  return [
    [`Le dossier d’exercice retient ${tonnes} t sur ${km} km. Calculez les tonnes-kilomètres retenus.`, `${n(work)} t·km`, `Multipliez la masse retenue par la distance. ${tonnes} × ${km} = ${work} t·km.`],
    [`Le tarif fictif est de CHF ${n3(tariff)} par tonne-kilomètre pour ${tonnes} t sur ${km} km. Calculez la redevance d’exercice au centime.`, `CHF ${n(charge)}`, `La base vaut ${work} t·km. Multipliez par le tarif fictif pour obtenir CHF ${n(charge)}.`],
    [`Deux itinéraires font ${km} et ${altKm} km pour la même masse de ${tonnes} t. Avec un tarif fictif de CHF ${n3(tariff)} par t·km, calculez la différence de redevance, au centime.`, `CHF ${n(Math.abs(altKm - km) * tonnes * tariff)}`, `La différence de base est ${Math.abs(altKm - km)} × ${tonnes} t·km. Multipliez par CHF ${n3(tariff)}.`],
    [`Un relevé indique CHF ${n3(charge)} pour ${km} km au tarif fictif de CHF ${n3(tariff)} par t·km. Retrouvez la masse retenue.`, `${tonnes} t`, `La masse est égale au montant divisé par distance × tarif. ${n3(charge)} ÷ (${km} × ${n3(tariff)}) = ${tonnes}.`],
    [`Le dossier chiffre deux parcours. Le premier retient ${tonnes} t sur ${km} km et le second ${altTonnes} t sur ${altKm} km. Le tarif fictif est de CHF ${n3(tariff)} par t·km. Ajoutez CHF ${fee} de frais fixes pour l’ensemble. Quel est le total au centime ?`, `CHF ${n((work + altTonnes * altKm) * tariff + fee)}`, `Calculez les deux bases, ${work} et ${altTonnes * altKm} t·km. Appliquez le tarif à leur somme, puis ajoutez les frais fixes.`],
  ]
}

function volume(unit, [length, width, height, count, limit, fill]) {
  const litres = length * width * height / 1000
  return [
    [`Une caisse rectangulaire mesure intérieurement ${length} × ${width} × ${height} cm. Quel est son volume utile en litres ? Prenez 1 L = 1 000 cm³.`, `${n3(litres)} L`, `Multipliez les trois dimensions en cm, puis divisez les cm³ obtenus par 1 000.`],
    [`Le volume mesuré est de ${n3(litres)} L par unité pour ${count} ${unit}. Quel volume total en m³ faut-il relever ? Prenez 1 m³ = 1 000 L et arrondissez au millième.`, `${n3(count * litres / 1000)} m³`, `Calculez le volume total de ${n3(count * litres)} L puis divisez par 1 000.`],
    [`Le dossier impose une limite de ${limit} L et l’unité complétée mesure ${n3(litres)} L. Calculez l’écart absolu à la limite et indiquez son sens.`, `${n3(Math.abs(litres - limit))} L ${litres > limit ? 'au-dessus' : litres < limit ? 'en dessous' : 'd’écart'}`, `Comparez le volume utile et la limite dans la même unité. L’écart absolu vaut ${n3(Math.abs(litres - limit))} L.`],
    [`Un emballage de ${n3(litres)} L n’est rempli qu’à ${fill} %. Quel volume représente le contenu, au millième de litre ?`, `${n3(litres * fill / 100)} L`, `Multipliez le volume utile par ${fill} ÷ 100.`],
    [`Une caisse a une base intérieure de ${length} × ${width} cm. Pour recevoir ${n3(litres)} L, quelle hauteur intérieure minimale faut-il dans ce modèle rectangulaire ?`, `${height} cm`, `Convertissez le volume en cm³ en multipliant par 1 000. Divisez par l’aire de la base, ${length} × ${width} cm².`],
  ]
}

function tension(_unit, [strength, section, newtons, reference, elongation, width]) {
  const force = strength * section
  return [
    [`Dans l’essai théorique, la résistance à la traction est de ${strength} N/mm² et la section de ${section} mm². Calculez la force de rupture du modèle.`, `${force} N`, `Force de rupture = résistance à la traction × section. ${strength} × ${section} = ${force} N.`],
    [`Pour une section de ${section} mm² et une force de rupture de ${force} N mesurée, quelle résistance le modèle attribue-t-il à la matière ?`, `${strength} N/mm²`, `Divisez la force en newtons par la section en millimètres carrés.`],
    [`Comparez les forces de rupture théoriques de deux sections de ${section} et ${width} mm², à ${strength} N/mm². Quel écart absolu trouvez-vous ?`, `${Math.abs(strength * (width - section))} N`, `Calculez les deux forces dans le même modèle et prenez la valeur absolue de leur différence.`],
    [`Une bande de formation longue de ${reference} mm s’allonge de ${elongation} mm lors d’un essai. Calculez l’allongement relatif au centième de pour cent.`, `${percent(elongation, reference)} %`, `Rapportez l’augmentation à la longueur initiale. ${elongation} ÷ ${reference} × 100 ≈ ${percent(elongation, reference)} %.`],
    [`Le dossier d’essai affiche ${newtons} N pour une force déjà calculée à la rupture. Exprimez cette force en kN, avec 1 kN = 1 000 N.`, `${n3(newtons / 1000)} kN`, `La conversion vaut ${newtons} ÷ 1 000 = ${n3(newtons / 1000)} kN. Il s’agit toujours d’une force.`],
  ]
}

function depreciation(_unit, [purchase, residual, years, elapsed, maintenance, rate]) {
  const amortisable = purchase - residual
  const yearly = amortisable / years
  return [
    [`Le prix est de CHF ${n(purchase)} et la valeur résiduelle prévue de CHF ${n(residual)}. Quelle base amortissable retenir ?`, `CHF ${n(amortisable)}`, `Déduisez la valeur résiduelle du prix d’acquisition. ${n(purchase)} − ${n(residual)} = ${n(amortisable)}.`],
    [`La valeur amortissable est de CHF ${n(amortisable)} sur ${years} ans. Quelle annuité donne l’amortissement linéaire, au centime ?`, `CHF ${n(yearly)} par an`, `Répartissez la même base sur ${years} années. ${n(amortisable)} ÷ ${years} ≈ ${n(yearly)}.`],
    [`Au départ, l’équipement vaut CHF ${n(purchase)}. Sa base amortissable est de CHF ${n(amortisable)} sur ${years} ans. Calculez sa valeur nette comptable après ${elapsed} ans, au centime.`, `CHF ${n(purchase - yearly * elapsed)}`, `Retirez ${elapsed} annuités égales de la valeur d’achat. ${n(purchase)} − ${elapsed} × (${n(amortisable)} ÷ ${years}) ≈ ${n(purchase - yearly * elapsed)}.`],
    [`Le plan fixe une valeur de départ de CHF ${n(purchase)}, une valeur résiduelle de CHF ${n(residual)} et une durée de ${years} ans. Les frais d’entretien s’élèvent à CHF ${n(maintenance)} par an. Quel coût annuel retenir pour ces deux postes, au centime ?`, `CHF ${n(yearly + maintenance)} par an`, `Ajoutez CHF ${n(maintenance)} à l’annuité calculée sur ${n(amortisable)} ÷ ${years}.`],
    [`Le capital moyen immobilisé est de CHF ${n((purchase + residual) / 2)}. Le taux d’intérêt fictif est de ${n(rate)} % par an. Quel intérêt annuel est imputé à ce capital ?`, `CHF ${n((purchase + residual) / 2 * rate / 100)}`, `Multipliez le capital moyen par le taux annuel converti en décimal.`],
  ]
}

function payroll(_unit, [gross, withheld, fixed, employer, allowance, months]) {
  const employeeCost = gross * withheld / 100 + fixed
  const employerCost = gross * (1 + employer / 100) + allowance
  return [
    [`Le salaire brut fictif vaut CHF ${gross}. L’exemple retient ${n(withheld)} % du brut et CHF ${fixed} en plus. Calculez le total des retenues au centime.`, `CHF ${n(employeeCost)}`, `Appliquez le taux au brut puis ajoutez la retenue fixe. ${gross} × ${n3(withheld / 100)} + ${fixed} ≈ ${n(employeeCost)}.`],
    [`Une fiche fictive indique CHF ${gross} de brut et CHF ${n(employeeCost)} de retenues. Calculez le salaire net.`, `CHF ${n(gross - employeeCost)}`, `Salaire net = brut − retenues. ${gross} − ${n(employeeCost)} = ${n(gross - employeeCost)}.`],
    [`Le brut vaut CHF ${gross}. La charge patronale fictive est de ${n(employer)} % du brut et l’équipement coûte CHF ${allowance} par mois. Quel coût mensuel obtient l’employeur sur ces postes, au centime ?`, `CHF ${n(employerCost)}`, `Ajoutez la charge proportionnelle et l’équipement au brut. Le résultat est de CHF ${n(employerCost)}.`],
    [`Une mission dure ${months} mois, avec un coût d’employeur constant de CHF ${n(employerCost)} par mois dans ce dossier. Calculez le budget total prévisionnel.`, `CHF ${n(employerCost * months)}`, `Multipliez le coût mensuel retenu par le nombre de mois. ${n(employerCost)} × ${months} = ${n(employerCost * months)}.`],
    [`Les retenues de CHF ${n(employeeCost)} portent sur un brut de CHF ${gross}. Quelle part du brut représentent-elles au centième de pour cent ?`, `${percent(employeeCost, gross)} %`, `Rapportez les retenues au brut et multipliez par 100.`],
  ]
}

function indicator(unit, [initial, final, days, used, daily, expected]) {
  const middle = (initial + final) / 2
  const rotation = used / middle
  return [
    [`Le stock est de ${initial} ${unit} au début et de ${final} à la fin. Calculez le stock moyen à l’aide de ces deux relevés.`, `${n(middle)} ${unit}`, `Stock moyen = (début + fin) ÷ 2. (${initial} + ${final}) ÷ 2 = ${n(middle)}.`],
    [`La consommation est de ${used} ${unit} pour un stock moyen de ${n(middle)}. Calculez la rotation sur cette période au centième.`, `${n(rotation)} rotations`, `Rotation = consommation ÷ stock moyen. ${used} ÷ ${n(middle)} ≈ ${n(rotation)}.`],
    [`La période dure ${days} jours. Calculez la durée moyenne de stockage au centième avec ${used} ${unit} consommés et un stock moyen de ${n(middle)}.`, `${n(days / rotation)} jours`, `Divisez les jours de la période par la rotation non arrondie ${used} ÷ ${n(middle)}.`],
    [`Le stock actuel est de ${final} ${unit} et la demande moyenne de ${daily} par jour. Donnez la couverture au centième et vérifiez si elle atteint ${expected} jours.`, `${n(final / daily)} jours, objectif ${final / daily >= expected ? 'atteint' : 'à compléter'}`, `Calculez ${final} ÷ ${daily}, puis comparez au délai exigé de ${expected} jours.`],
    [`Pour couvrir ${expected} jours de demande avec ${daily} ${unit} nécessaires chaque jour, quel stock cible faut-il ? Donnez son écart au stock actuel de ${final}.`, `${expected * daily} ${unit}, écart cible moins actuel de ${expected * daily - final}`, `Multipliez la demande quotidienne par la durée. Puis retranchez le stock actuel du besoin calculé.`],
  ]
}

function result(unit, [revenue, fixed, variable, qty, avgStock, rate]) {
  const expenses = fixed + variable * qty
  return [
    [`Pour ${qty} ${unit}, le dossier prévoit CHF ${fixed} de coûts fixes et CHF ${variable} de coûts variables par unité. Calculez les coûts totaux.`, `CHF ${n(expenses)}`, `Additionnez les coûts fixes et les coûts qui varient avec le volume. ${fixed} + ${variable} × ${qty} = ${n(expenses)}.`],
    [`Le chiffre d’affaires vaut CHF ${revenue} et les coûts de même périmètre CHF ${expenses}. Quel est le résultat ?`, `CHF ${n(revenue - expenses)}`, `Résultat = chiffre d’affaires − coûts. ${revenue} − ${expenses} = ${revenue - expenses}.`],
    [`Le chiffre d’affaires de CHF ${revenue} couvre des coûts de CHF ${expenses}. Quel pourcentage du chiffre d’affaires est absorbé par les coûts, au centième ?`, `${percent(expenses, revenue)} %`, `Rapportez les coûts au chiffre d’affaires. ${expenses} ÷ ${revenue} × 100 ≈ ${percent(expenses, revenue)} %.`],
    [`Vous prévoyez ${qty} ${unit} et CHF ${expenses} de coûts. Quel chiffre d’affaires moyen par unité couvre exactement ces coûts, au centime près ?`, `Environ CHF ${n(expenses / qty)} par unité`, `Répartissez les coûts sur les unités prévues. ${expenses} ÷ ${qty} ≈ ${n(expenses / qty)}.`],
    [`Le stock moyen vaut CHF ${avgStock}. Le dossier applique un coût annuel fictif de possession de ${n(rate)} %. Calculez ce poste pour une année.`, `CHF ${n(avgStock * rate / 100)}`, `Multipliez la valeur de stock moyenne par le taux annuel exprimé en décimal.`],
  ]
}

function capital(_unit, [initial, final, rate, months, space, rent]) {
  const average = (initial + final) / 2
  const annual = average * rate / 100
  return [
    [`La valeur du stock est de CHF ${n(initial)} au début et de CHF ${n(final)} à la fin. Estimez le capital moyen à partir de ces deux relevés.`, `CHF ${n(average)}`, `Additionnez les deux valeurs et divisez par deux. On obtient CHF ${n(average)}.`],
    [`Le capital moyen vaut CHF ${n(average)}. Le taux annuel fictif est de ${n(rate)} %. Quel intérêt annuel est imputé à ce stock ?`, `CHF ${n(annual)}`, `Multipliez le capital moyen par le taux annuel en décimal. Le résultat est de CHF ${n(annual)}.`],
    [`L’intérêt annuel de stockage vaut CHF ${n(annual)}. Pour un séjour de ${months} mois et une règle proportionnelle, calculez l’intérêt de cette période au centime.`, `CHF ${n(annual * months / 12)}`, `Divisez l’intérêt annuel par 12 et multipliez par ${months}.`],
    [`Le stock occupe ${space} m². Le loyer d’exercice est de CHF ${rent} par m² et par mois. Calculez le loyer du périmètre pour ${months} mois.`, `CHF ${n(space * rent * months)}`, `Multipliez la surface par le tarif et par le nombre de mois.`],
    [`L’intérêt annuel attribué au capital est de CHF ${n(annual)}. Le loyer annuel de la zone est de CHF ${n(space * rent * 12)}. Quel total annuel prévoir pour ces deux postes ?`, `CHF ${n(annual + space * rent * 12)}`, `Les deux montants portent sur une année. Additionnez l’intérêt et le loyer du même périmètre.`],
  ]
}

function service(unit, [total, onTime, second, secondOnTime, goal, recovery]) {
  return [
    [`Sur ${total} ${unit}, ${onTime} sont satisfaites dans les conditions prévues. Calculez le taux de service au centième de pour cent.`, `${percent(onTime, total)} %`, `Taux de service = unités satisfaites ÷ unités du même périmètre × 100. Le taux vaut ${percent(onTime, total)} %.`],
    [`Le relevé A satisfait ${onTime} unités sur ${total}, le B ${secondOnTime} sur ${second}. Calculez le taux commun sans compter d’unité deux fois.`, `${percent(onTime + secondOnTime, total + second)} %`, `Additionnez les deux nombres satisfaits et les deux effectifs. Le taux vaut ${onTime + secondOnTime} ÷ ${total + second} × 100.`],
    [`Le site exige au moins ${goal} % de ${unit} satisfaites sur ${total} au total. Quel est le nombre entier minimal à atteindre ?`, `${Math.ceil(total * goal / 100)} unités satisfaites`, `Appliquez le pourcentage au total puis arrondissez au supérieur pour atteindre au moins l’objectif.`],
    [`Le dossier satisfait d’abord ${onTime} des ${total} ${unit}. Une correction rend ${recovery} unités supplémentaires conformes. De combien de points de pourcentage le taux augmente-t-il ?`, `${percent(recovery, total)} points`, `Le dénominateur reste ${total}. Les ${recovery} nouvelles unités satisfaites donnent ${percent(recovery, total)} points d’augmentation.`],
    [`Sur ${total} ${unit}, il en reste ${total - onTime} non satisfaites. Pour un objectif d’au moins ${goal} %, calculez l’écart signé en unités satisfaites entre le minimum exigé et l’existant.`, `${Math.ceil(total * goal / 100) - onTime} unités`, `Le minimum exigé est ${Math.ceil(total * goal / 100)}. Le nombre satisfait est ${total} − ${total - onTime} = ${onTime}. Soustrayez ce second nombre du premier.`],
  ]
}

export const dossierMaths = {
  stock, series, planning, area, audit, cost, mass, levels, cadence, lever,
  route, tonneDistance, volume, tension, depreciation, payroll, indicator, result, capital, service,
}
