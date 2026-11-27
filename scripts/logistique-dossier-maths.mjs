const number = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 2 })
const n = (value) => number.format(value)
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

export const dossierMaths = { stock, series, planning, area, audit, cost, mass, levels, cadence, lever }
