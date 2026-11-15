> Référence fournie par le propriétaire le 15 novembre 2026. Les précisions du message utilisateur priment : les ×3 restent locaux à la victime, et peuvent aussi grandir et tourner au centre ; les vies restent sur les côtés, en chiffres seuls ; le combat reste épuré. Voir ADR 0054 pour les choix effectivement implémentés et les limites des vérifications.

# Cahier des charges — Refonte intégrale des animations d’attaque des 30 mascottes

**Projet :** `oasi-phuoc/doc-prof` — mode Jeu, duels à deux et duels par équipes  
**Destinataire :** Codex / développeur chargé de l’implémentation  
**Version du cahier des charges :** 1.2 consolidée — 15 novembre 2026  
**Statut :** spécification d’implémentation, pas une fonctionnalité déjà développée  
**Périmètre :** **90 chorégraphies** (30 mascottes × normal / critique ×2 / critique ×3), **60 auras persistantes personnalisées** (×2 et ×3 pour chaque mascotte), **120 nouveaux dessins d’état** (fatiguée à ≤50 PV, critique à ≤20 PV, victoire et KO pour chacune des 30 mascottes), plus animations d’état et variantes locales en cas de mauvaise réponse.

> **RÈGLE ABSOLUE ×3 :** lors d’une attaque super critique ×3, AUCUNE attaque ni particule de combat ne doit traverser l’espace de l’attaquant vers l’adversaire. L’effet naît **autour de la mascotte qui perd les points de vie** ; ses éléments apparaissent **en périphérie**, tournoient ou s’organisent si nécessaire, puis **convergent de l’extérieur vers le centre de cette mascotte**. Cela vaut aussi lorsque le joueur s’inflige lui-même les dégâts en répondant mal. Le ×3 n’est pas « un ×2 avec une grosse explosion à l’arrivée » : c’est une chorégraphie d’implosion locale propre à la mascotte qui produit l’effet.

---

## 0. Résultat attendu et définition de « terminé »

L’application doit passer de **30 motifs SVG appliqués à 10 mouvements génériques** à **30 comportements visuels réellement différents**, chacun comportant trois mises en scène :

- **Normal (×1, 10 %)** : attaque thématique nette, courte, lisible, avec un déplacement cohérent de la source vers la cible *uniquement si la réponse est juste* ; émission, traînée et impact distincts.
- **Critique ×2 (20 %)** : escalade reconnaissable de l’attaque de la mascotte ; composition, trajectoires, rythme et particules spécifiques ; **interdit :** trois à cinq copies strictement identiques du ×1 décalées dans le temps.
- **Super critique ×3 (30 %)** : scène spectaculaire **entièrement centrée sur la victime**, avec **spawn périphérique → mouvement orbital / aspiration / resserrement → convergence centripète → impact central → dissipation**. Chaque mascotte possède sa propre structure d’implosion (géométrie, rythme, matière, particules, finale), sans vol interjoueurs.

Les effets doivent évoquer la qualité de VFX d’un bon jeu vidéo 2D : **matière crédible, inertie, accélération, tourbillons volumétriques simulés, traînées qui naissent réellement derrière l’objet en mouvement, étincelles qui se détachent, eau qui éclabousse, poussière qui s’enroule, profondeur en plusieurs couches**. « Réaliste » concerne le comportement physique et la finition des effets, **pas** un photoréalisme incompatible avec les illustrations des mascottes. Respecter un style visuel cohérent, chaleureux et non violent : aucune arme, sang, blessure ou effet horrifique.

**NOUVELLES EXIGENCES P0, à ne pas oublier :** (a) l’**aura de charge d’énergie style jeu vidéo** est *persistante pendant toute la question ×2/×3*, autour des deux mascottes, et suit la pause ; (b) chaque mascotte a **quatre dessins d’état originaux** — fatiguée (≤50 PV), très fatiguée / état critique (≤20 PV), victoire et KO. Les nouveaux états se déclenchent selon les PV, et l’état final reste affiché après le verdict. Les états sont des illustrations distinctes, pas une teinte rouge ajoutée au portrait normal.

**Critères éliminatoires :**

1. Une seule animation CSS générique réutilisée 30 fois avec un autre SVG ;
2. Un ×3 qui part de l’attaquant, traverse l’écran, puis explose ;
3. Des traînées dessinées en permanence à la même place au lieu de suivre l’historique de l’objet ;
4. Un cyclone qui n’est qu’une icône en rotation ;
5. Une critique ×2 qui se limite à multiplier des clones du ×1 ;
6. Un effet inaccessible sur mobile, une question masquée, une baisse de vie appliquée plusieurs fois, ou une animation coupée avant son final ;
7. Des animations prétendument complètes avec seulement une maquette, une image fixe, un exemple de mascotte ou des `TODO` pour les autres.
8. Une aura ×2/×3 qui n’apparaît qu’à la résolution, clignote ou disparaît avant la fin de la question.
9. Des dessins fatigué / critique / vainqueur / KO absents, identiques entre mascottes, ou remplacés par une simple désaturation.

---

## 1. État réel du dépôt et contraintes existantes

Lecture de la branche `main` du dépôt [oasi-phuoc/doc-prof](https://github.com/oasi-phuoc/doc-prof) le 15 novembre 2026. **Codex doit relire la branche au début de son intervention**, car le code peut évoluer.

| Élément existant | Emplacement | Situation et intervention attendue |
|---|---|---|
| Catalogue des 30 attaques | `src/interactive/duel/signature-attacks.ts` | 30 noms/couleurs/motifs, mais 10 types de mouvements. Le remplacer par un registre de 30 véritables scènes ×3 niveaux. |
| Motifs SVG | `src/interactive/duel/SignatureAttackArt.tsx` | Utilisables comme référence d'identité, mais insuffisants en tant que rendu final ; réemployer ou retravailler sans recycler le même mouvement. |
| Animation générique | `src/interactive/duel/effects.css` | Contient les dix `@keyframes ci-attack-*` et les effets critiques actuels ; remplacer la partie attaques par le moteur spécialisé en conservant ce qui reste utile. |
| Rendu et assemblage | `src/interactive/duel/DuelImpact.tsx` | Actuellement multiplie des SVG qui voyagent entre joueurs ; réécrire l'orchestration, surtout la branche ×3. |
| Calcul de géométrie | `src/interactive/duel/effects.ts` | `measureFighters`, `attackTrajectory`, `impactFor` : conserver la résolution correcte des auteurs/cibles ; adapter les trajectoires normales et ×2 ; ne pas appeler la trajectoire interjoueurs pour ×3. |
| Auras critiques | `CriticalSpecials.tsx` et `SuperCriticalSpecials.tsx` | Recomposer ×2 selon la mascotte ; **interdire la charge autour de l'attaquant en ×3**. |
| Jeu et chronologie | `src/interactive/duel/DuelGame.tsx` | Affiche l'effet pendant la correction avec un seuil `freshImpact` de 1 100 ms. Incompatible avec des VFX cinématiques de 1,6–2,2 s : traiter l'orchestration et le cycle de vie. |
| Domaines, dégâts | `src/interactive/duel/core.ts` | Dégâts ×1/×2/×3 : 10/20/30 %. 65/25/10 % de tirage. Préserver les mécaniques de score, de premier clic et de reprise. |
| Prévisualisation | `src/interactive/duel/MascotAttackPreview.tsx` | Conserver « Voir l’attaque », et le choix des critiques ; brancher sur le **même moteur exact** que le combat, et non une démonstration simplifiée. |
| Portraits et réactions | `src/interactive/duel/duel.css`, `src/interactive/competition/Avatar.tsx`, `src/interactive/domain/mascot.ts` | Portraits de 276 px sur grand écran, 144 px sur mobile ; préserver barre de vie sous le portrait ; **ajouter quatre variantes illustrées distinctes par mascotte** (fatigue ≤50, état critique ≤20, victoire, KO), les intégrer aux sprites/atlas ou fichiers dédiés et synchroniser les transitions avec les PV. |
| Auras pendant les questions critiques | `src/interactive/duel/DuelGame.tsx`, `CriticalSpecials.tsx`, `SuperCriticalSpecials.tsx` | Les effets actuels apparaissent essentiellement pendant l’impact. **Créer un composant de charge persistante pendant toute la phase `question` pour ×2/×3**, autour des DEUX combattants, avec une direction artistique thématique par mascotte. |
| Tests | `tests/interactive/mascot-effects.test.mjs`, `mascots-effects-browser.mjs`, `duel-browser.mjs` | Ajouter des preuves automatiques des 90 scènes, du ×3 strictement centripète, de la compatibilité et des performances. |

**Contraintes de la version actuelle :** React 19, TypeScript, Vite, SVG/CSS, Playwright. Le budget gzip du mode Jeu est d’environ 3 Mo, déjà proche de sa limite (voir `docs/interactive/quality-duel-v2-results.json`). **Ne pas ajouter une grosse bibliothèque graphique sans mesurer son coût.** Le duel peut fonctionner sur une page préparée hors réseau : les animations doivent fonctionner sans requête externe.

**Règles fonctionnelles à préserver :** 30 mascottes uniques, duel local sur écran commun, victoire/KO/match nul, tirage des binômes, historique compatible, premier clic valide, une réponse = une résolution, dégâts appliqués une seule fois, expiration du temps = −10 % à chacun sans attaque de l'autre, modes clavier et tactile, tutoriel/aperçus. Aucun changement du calcul du score sous prétexte qu'une attaque comporte 15 particules ou 8 impacts visuels.

---

## 2. Direction artistique commune et différences obligatoires

### 2.1 Langage VFX

**Trois plans minimum lorsque pertinent :** arrière-plan de matière (brume légère, turbulences, réfraction simulée) ; corps animé (flux d'eau, flamme, feuille, étoile, etc.) ; premier plan (étincelles, gouttes, éclats, contours, lueur). Toutes les particules ne sont pas nécessaires sur toutes les attaques : la matière commande le rendu.

**Animation organique :** trajectoires par courbes continues, rythme non linéaire, animation interne d'un effet (le courant de l'eau circule à l'intérieur du jet, pas seulement le jet lui-même), vitesses variables par élément, traînées générées au fur et à mesure et se dissipant, déformations et dissipation propres à la matière.

**Lecture visuelle :** même avec les réponses affichées et deux mascottes proches, le spectateur doit identifier en moins d'une seconde *qui est à l'origine de l'effet*, *qui perd la vie* et *où se situe l'impact*. Pour ×3, l'origine du pouvoir est identifiée par **le thème visuel et le verdict textuel**, jamais par un projectile envoyé depuis l'attaquant.

**Différenciation réelle :** deux mascottes peuvent partager une catégorie physique (feu/eau/vent), mais **jamais** la même combinaison de (1) silhouette dynamique, (2) loi de mouvement, (3) cinématique des particules, (4) rythme, (5) animation d'impact. Exemple : le dragon a un souffle continu en nappes turbulentes ; le kitsune a plusieurs filaments de flammes orbitaux ; le renard a des lueurs errantes façon feu follet. Ils ne doivent pas se confondre.

### 2.2 Exigences précises par matériau

- **Cyclones et tornades :** vraie rotation autour d'un axe, **plusieurs couronnes de particules** à des profondeurs différentes, vitesse angulaire variable, entonnoir / couronne dont le rayon change avec la hauteur, poussières ou nuages entraînés tangentiellement, cœur visible, masquage avant/arrière. Une image de tornade pivotée sur elle-même est refusée.
- **Étoiles filantes :** tête lumineuse en mouvement ; traînée **née à l'ancienne position de la tête**, conservant un historique de points, diminuant en largeur et luminosité avec son âge ; éventuelles poussières stellaires qui se décrochent ; au choc, tête et traînée se dissipent séparément. Aucun trait de longueur fixe simplement collé derrière l'étoile.
- **Feu / boules de feu :** cœur chaud blanc-jaune, bord rouge-orange, turbulence directionnelle, flammes qui s'étirent dans le sens inverse de l'avancée, étincelles avec inertie, traînée persistante qui s'éteint par morceaux ; fumée légère si le budget le permet. Pas de simple cercle orange en rotation.
- **Eau :** ruban fluide ou jets continus avec oscillation, épaisseur et transparence variable, écume de tête, gouttes émises aux changements de direction, séparation au choc, vague de propagation ; pas de sprite bleu étiré sans écoulement interne.
- **Vent / poussière :** trajectoires tourbillonnantes cohérentes, particules passives avec inertie et traînée, transparence stratifiée, sens de circulation reconnaissable ; ne pas confondre toutes les attaques de vent.
- **Feuilles / plumes :** chaque objet a sa propre translation, portance, rotation, battement ou chute ; vitesse relative et profondeur, pas un ensemble d'objets soudés dans un unique SVG.
- **Bulles :** déformation élastique, flottement, reflets mobiles, tailles variables, petites éclaboussures ou anneaux à l'éclatement ; ne pas utiliser la même dynamique qu'une pierre.
- **Glace / neige :** cristaux structurés, petits éclats, condensation froide douce, traînées plus nettes et brèves, absence de stroboscope.
- **Roche / terre :** poids, accélération, débris à trajectoire balistique et poussière à traînée lente ; pas de pierres flottant comme des bulles.
- **Énergie magique / lumière :** halo limité au voisinage de l'effet, gradients, filaments, pulsations fluides ; éviter les grands flashs blancs sur tout l'écran.

### 2.3 Intensités et style

| Niveau | Intention | Densité relative | Narration |
|---|---|---:|---|
| ×1 | Rapide, précis, satisfaisant | 1× | Préparation très courte → trajet → impact |
| ×2 | Puissance renforcée, composition enrichie | 1,5–2,2× | Mise en tension → plusieurs gestes **différents** → impact composé |
| ×3 | Événement rare, spectaculaire, local | 2,2–3× (adaptatif) | Couronne extérieure autour de la **victime** → tournoiement / attraction → implosion au centre → dissipation |

Les densités sont indicatives, **pas** des multiplicateurs de dégâts. La qualité visuelle dépend d'abord de la trajectoire et du rythme, pas du nombre brut de particules.

---

## 3. Contrat fonctionnel sans ambiguïté

### 3.1 Bonne réponse

- **×1 :** mascotte ayant répondu juste = source ; adversaire = victime ; attaque voyage de la première vers la seconde ; −10 % appliqués par le moteur de jeu.
- **×2 :** même attribution, **chorégraphie dédiée** avec deux gestes ou davantage ; −20 % appliqués **une fois**.
- **×3 :** mascotte ayant répondu juste = thème / émetteur logique ; adversaire = victime. **AUCUN mouvement d'attaque depuis l'attaquant vers la victime**. Naissance des éléments uniquement dans l'anneau extérieur **autour de la victime** ; convergence vers son centre ; −30 % appliqués une fois.

### 3.2 Mauvaise réponse (auto-dégât)

Aucune animation ne doit faire croire que l'adversaire a attaqué. La mascotte qui s'est trompée perd ses propres vies. Son propre thème visuel sert à produire une **version locale de retour de sort** :

- **×1 :** petit effet auto-infligé local, identifiable avec la même matière que sa signature, sans départ depuis l'autre joueur ; −10 %.
- **×2 :** recul / débordement local propre au personnage, avec une cinématique ×2, sans projectile venant de l'autre joueur ; −20 %.
- **×3 :** **exactement la règle centripète ×3** autour de cette mascotte : périphérie → centre, signature du personnage qui s'est trompé ; −30 %.

**Conséquence :** les objets de maladresse génériques (livres, pommes, cailloux, etc.) ne doivent plus être l'effet par défaut des trois niveaux. Ils peuvent être conservés uniquement comme **repli technique** si le moteur VFX échoue, et ne doivent pas apparaître avec l'effet signature normal.

### 3.3 Fin du minuteur

Temps écoulé : **deux réactions locales simples distinctes**, −10 % à chaque joueur, aucune attaque interjoueurs, aucun ×2/×3 même si la question portait cette étiquette. Le texte « Temps écoulé : les deux joueurs perdent 10 % » demeure visible. Repli obligatoire en cas d'absence de capacités graphiques.

### 3.4 KO et autres états

Les dégâts, l'arrêt à 0 %, l'annonce du vainqueur ou du nul et la sauvegarde ne dépendent pas de l'état du rendu. L'animation doit pouvoir être stoppée proprement lors d'une navigation, d'une pause, d'un changement de duel, d'une fermeture du composant ou d'un redimensionnement. Aucun impact en doublon au `rerender`, à la reprise ou sous double clic.

---

## 4. Grammaire cinématique des trois niveaux

### 4.1 Normal ×1

**Durée cible :** 650 à 1050 ms. Début identifiable (0–15 %), trajet animé (15–75 %), impact matériel (65–90 %), dissipation (80–100 %). La traînée se développe **après** le passage de la tête, puis décroît. La réaction de la victime commence au voisinage de l'impact visible, pas systématiquement dès le clic.

Le déplacement doit viser la zone réelle de la mascotte : pas le bas de l'écran, pas la barre de vie, pas le centre du cadre de réponse. Adapter le point d'arrivée à la largeur et hauteur du portrait. Ne jamais utiliser un trait rectiligne lumineux générique comme effet principal.

### 4.2 Critique ×2

**Durée cible :** 1100 à 1600 ms. Une version ×2 doit posséder des **événements visuels spécifiques** : par exemple une boucle avant le second projectile, une séparation du flux, deux volutes qui s'entrecroisent, un battement rythmé, un impact en deux temps, un petit anneau thématique. Ne pas simplement recopier le SVG ×1 trois fois. Chaque mascotte a son propre nombre de séquences, ses angles, ses espacements et son animation d'arrivée. Les impacts multiples sont **uniquement graphiques** ; −20 % une seule fois.

### 4.3 Super critique ×3 : **implosion centripète locale, obligatoire**

**Durée cible :** 1700 à 2300 ms (mode qualité). Toute la scène est calculée **à partir du rectangle de la victime**. L'attaquant peut changer de pose, mais **aucune charge, halo d'attaque, projectile, étincelle voyageuse ou rayon offensif ne doit naître chez lui ou partir de son centre**. Une petite expression de satisfaction ou une pose de l'attaquant est acceptable uniquement si elle ne ressemble pas au point de départ d'un projectile.

**Phases obligatoires, à adapter artistiquement par mascotte :**

1. **0–18 % — Apparition périphérique :** des éléments de matière surgissent dans un anneau autour de la victime ; ils ne sont pas déjà au centre ; plusieurs angles de départ différents.
2. **18–48 % — Organisation :** formation de couronnes, spirales, cyclones, lignes radiales courbées ou orbites ; particules à vitesses distinctes ; avant-plan et arrière-plan.
3. **48–82 % — Compression :** chaque élément important réduit sa distance au **centre de la mascotte** ; mouvement centripète clairement perceptible ; accélération ou aspiration crédible ; traînées derrière chaque tête mobile.
4. **82–92 % — Contact central :** fusion, implosion lumineuse ou éclaboussure / choc thématique **localisé sur la mascotte victime** ; pas de gros flash plein écran.
5. **92–100 % — Dissipation :** résidus spécifiques (braises, gouttelettes, feuilles, poussières, reflets, cristaux), qui s'éteignent autour de la victime.

Pour les formes circulaires, utiliser un modèle du type `P(t) = C_victime + r(t) × [cos(θ(t)), sin(θ(t))]`, avec `r(t)` **globalement décroissant** sur la phase de compression et `θ(t)` variable pour l'enroulement ; le bruit organique reste borné et n'empêche jamais la convergence. Les anneaux peuvent être elliptiques pour tenir dans la zone de jeu. La position d'apparition de chaque élément majeur doit se trouver **à l'extérieur du disque central de la mascotte**, sauf fines particules secondaires d'impact qui n'apparaissent que dans la dernière phase.

**×3 interdit :** `attackTrajectory(attacker, victim)`, SVG de 160 px qui vole de gauche à droite, `SuperCriticalSpecials` faisant une charge autour de l'attaquant, explosion générique simplement ajoutée à l'attaque normale, motifs qui se déplacent principalement du centre vers le dehors *avant* le contact. Une **onde de dissipation sortante après l'impact** est autorisée si l'attaque auparavant était bien centripète.

### 4.4 Contraintes du minuteur de correction

Aujourd'hui, la phase de correction peut durer 1 s et `DuelGame.tsx` ne montre l'effet que pendant 1 100 ms. Cela **couperait les nouveaux ×2 et ×3**. Exigence : dissocier la **durée du visuel** et l'**application instantanée de la règle de dégâts**, tout en garantissant que le moteur n'affiche pas la question suivante avant la fin de l'animation. Définir explicitement `effectiveFeedbackMs = max(feedbackSeconds × 1000, sceneDurationMs + safeMarginMs)` pour la durée de présentation, avec `safeMarginMs` d'environ 100–150 ms. Cela peut modifier la durée apparente de correction mais **pas** les dégâts, le premier clic ou les résultats. Tester pause/reprise, retour navigateur et reprise après rechargement. Ne pas modifier arbitrairement les journaux existants : si une modification de la logique persistée est nécessaire, migrer/versionner proprement après tests de compatibilité. Afficher le temps restant en accord avec la vraie durée de présentation, jamais un compte à rebours à zéro tandis que l'écran est encore verrouillé.

**Alternative tolérée seulement pour un mode « rapide » explicitement choisi :** scène condensée sous 1 s **sans abandonner les phases et sans changer la règle ×3**. La qualité cinématique constitue le mode par défaut.

---

### 4.5 Auras de puissance **persistantes** pendant toute la question (nouvelle exigence P0)

**Déclencheur :** dès l'entrée dans `state.phase === 'question'`, si le tour annonce le multiplicateur **2** ou **3**, les **deux mascottes** se chargent d'une aura énergétique inspirée visuellement des jeux de combat / transformations de type « aura de Saiyan ». On ne sait pas à l'avance qui va répondre, donc ne jamais réserver une aura au futur gagnant. Les deux auras sont **personnalisées selon le thème propre de chaque mascotte**, et non une silhouette lumineuse universelle simplement recolorée.

- **×1 :** aucune aura spéciale persistante.
- **×2 :** halo énergétique de forme fluctuante, contours qui s'étirent vers le haut, particules ascendantes, petites pulsations, oscillation interne continue, pas de flash violent. Chaque mascotte a sa texture (eau, plumes, feuilles, étoiles, brume, vapeur, flammes, cristaux, etc.). Intensité moyenne, clairement perceptible.
- **×3 :** aura **nettement plus puissante** : plusieurs enveloppes de profondeur, flux d'énergie verticaux ou circulaires, perturbations de matière, particules animées, montée de charge périodique **sans extinction** et sans masquer la mascotte. Chaque mascotte possède son propre comportement (ex. cyclone nuageux = véritable rotation multi-couches ; kitsune = langues de feu qui montent ; cheval = comètes à traînées derrière les étoiles ; carpe koï = remous et gouttes en suspension). Ce halo reste un **effet d'état non offensif** ; il ne constitue jamais un projectile ×3 venant de l'autre camp.
- **Persistance :** l'aura apparaît **dès le premier frame visible de la question** et continue **tant que le statut est `question`**, que le minuteur soit activé ou non, y compris si un joueur réfléchit plusieurs minutes. Aucun `setTimeout` de 800 ms / 1500 ms qui la supprime.
- **Pause :** geler proprement la timeline de l'aura pendant `paused === true`, garder le visuel en place (ou un état gelé discret) ; reprendre exactement au point où elle était. Un écran de pause peut masquer visuellement l'arène, mais ne doit ni réinitialiser ni perdre la phase de charge.
- **Fin de question :** sur réponse ou expiration, **arrêter / dissiper** l'aura dans une transition de ~150–300 ms, puis jouer l'effet de résolution. Ne jamais laisser les vieilles auras derrière une nouvelle question ni superposer plusieurs composants sur un `rerender`.
- **Personnalisation :** prévoir `aura2Id` et `aura3Id` par mascotte, avec des primitives partagées autorisées mais une **composition cinématique spécifique** à chaque couple mascotte/niveau. Toute aura doit rester lisible à 144 px et à 276 px.
- **Ergonomie :** contrôler la luminosité et l'opacité ; aucune pulsation stroboscopique ; les cartes, consignes, PV et commandes restent lisibles ; l'aura ne bloque pas les clics et ne déborde pas sans limite. La comparaison ×2 vs ×3 doit être évidente en capture comme en mouvement.

**Cas à tester :** question ×2 sans minuteur pendant 2 minutes ; question ×3 avec minuteur pendant toute sa durée ; pause/reprise ; redimensionnement ; réponse correcte / erreur / expiration ; nouveau binôme ; retour depuis une reprise de journal. Test DOM : présence et animation continue de l'aura pendant **toute** la phase `question`, absence après changement de phase. Exiger une preuve vidéo sur au moins deux mascottes de matières opposées et des assertions pour les **30 identités**.

### 4.6 Transitions visuelles du portrait et des PV

1. **Le moteur de combat demeure l'unique source de vérité** pour `hp.left`, `hp.right`, `resolution.winner`, `resolution.draw`. La pose est **dérivée** de ces valeurs ; ne rien écrire de nouveau dans les journaux pour enregistrer une image ou un seuil.
2. **Fin de l'impact :** jouer une brève réaction appropriée (`hurt`), puis faire apparaître l'illustration `tired`, `critical-tired` ou `defeat` selon les PV. Utiliser un fondu rapide ou un morph compatible avec le style des sprites, sans téléportation visuelle.
3. **Pas de régénération fictive :** les poses ne reviennent jamais à `normal` tant que les PV restent ≤50, même si la question suivante commence. Si un futur mode de soin existe, re-déterminer l'état à partir des PV à chaque mise à jour.
4. **Défaite définitive :** à 0 PV, laisser jouer une courte animation d'affaissement non graphique puis afficher l'illustration KO stable. Le gagnant reçoit une animation d'entrée en victoire suivie de la pose triomphante stable. En cas de double KO, afficher les deux KO et **aucune** victoire.
5. **Tournois :** chaque duel affiche victoire et KO dans l'arène de résultat ; pour les rencontres suivantes, les nouveaux combattants repartent à 100 PV. Le bilan final conserve les résultats avec identités exactes ; éviter qu'un joueur d'une rencontre précédente apparaisse KO à la place du nouveau binôme.
6. **Auto-dégât :** le même calcul des seuils s'applique si le joueur perd des PV par mauvaise réponse ou timeout. À l'expiration, chaque combattant peut entrer dans **un état différent** selon ses PV après −10.
7. **Préchargement :** toutes les nouvelles images d'état nécessaires à un duel doivent être préchargées localement avec la mascotte ; aucun téléchargement externe ni effet de chargement visible au passage de 51 à 50, de 21 à 20 ou de 1 à 0.

---

## 5. Catalogue de production : **30 mascottes, 90 chorégraphies**

Les descriptions suivantes sont des **obligations de résultat visuel**. Codex peut changer les paramètres de dessin ou les outils de rendu, mais pas remplacer une chorégraphie par le mouvement d'une autre. Pour chaque mascotte, livrer une animation ×1, une ×2 **différente** et une ×3 **strictement locale et centripète**. Les variantes d'auto-dégâts réutilisent le thème et le niveau, mais restent sur le joueur fautif.

### 01 — Esprit feuille (`leaf`) — Feuilles dansantes
- **×1 :** quatre à six feuilles indépendantes s'envolent en chemin incurvé, battent autour de leur nervure, laissent une fine turbulence verte et se déposent en une petite gerbe feuillue à l'arrivée ; profondeurs variées.
- **×2 :** deux courants d'air de directions légèrement opposées se croisent ; feuilles claires et foncées avancent à vitesses distinctes, tournoient en deux passages et libèrent des graines lumineuses avant un impact floral.
- **×3 :** huit à douze feuilles émergent sur une **couronne périphérique autour de la victime** ; deux cercles de vent tournent en sens opposés, les feuilles se resserrent par spirales vers son centre, forment une rose de feuillage qui s'implose en pollen vert. **Aucun vent ne traverse l'écran depuis l'attaquant.**

### 02 — Hibou (`owl`) — Plumes lunaires
- **×1 :** croissant de lumière souple précédé d'une plume oscillante ; trajectoire en arc de lune, reflet doré laissant un fin sillage argent-violet ; plumes qui se séparent au contact.
- **×2 :** trois battements de plumes à différentes hauteurs, une lune miniature qui croît entre les passages, puis l'éventail de plumes se referme sur la cible avec un scintillement froid.
- **×3 :** croissants lunaires apparaissant à plusieurs angles **autour de la victime** ; ils dessinent une rosace externe, des plumes tournent lentement puis accélèrent **vers le centre**, qui absorbe la lumière en un halo lunaire fugitif.

### 03 — Pieuvre (`octopus`) — Nuage d’encre
- **×1 :** goutte épaisse d'encre propulsée en courbe, oscillation visqueuse, filaments fluides qui restent dans son sillage ; diffusion violette nuageuse au point d'impact.
- **×2 :** deux jets d'encre de viscosités différentes s'entrelacent, bulles colorées éclatant derrière ; le premier contact forme un anneau d'encre, le second remplit brièvement son intérieur.
- **×3 :** six poches d'encre apparaissent à la **périphérie de la victime**, gonflent en volutes denses et dessinent un tourbillon à plusieurs couches ; aspiration de chaque bras d'encre **de l'extérieur au centre**, fusion en une goutte sombre puis dispersion de microgouttes.

### 04 — Hérisson (`hedgehog`) — Pluie de piquants stylisés
- **×1 :** faisceau de piquants cartoon non agressifs, chacun avec sa propre accélération et oscillation ; léger souffle sable, arrivée en éventail et petite poussière douce.
- **×2 :** deux vagues de piquants suivent des arcs décalés ; quelques piquants rebondissent brièvement en tournant, l'ensemble se referme comme une couronne au point visé.
- **×3 :** piquants et poussières apparaissent en cercle **autour de la victime**, pivotent progressivement pour pointer **vers son centre**, puis convergent en salves radiales à vitesses alternées et s'évanouissent en étincelles couleur miel.

### 05 — Lapin lunaire (`rabbit`) — Bonds lunaires
- **×1 :** petit croissant rose bondit le long de deux arcs successifs ; impulsions de poussière scintillante et étoiles en retard le long du chemin ; impact rebond doux.
- **×2 :** trois bonds de hauteur différente se succèdent avec un effet d'anticipation élastique, chaque atterrissage émet une vaguelette lunaire ; dernier bond plus ample vers la cible.
- **×3 :** demi-lunes et étoiles naissent **dans un cercle externe autour de la victime** ; elles bondissent d'un point orbital à l'autre, puis chaque rebond s'effectue sur un cercle plus petit jusqu'au **centre**, où naît une empreinte lunaire lumineuse.

### 06 — Dragon (`dragon`) — Souffle de dragon
- **×1 :** **langue de feu fluide**, non un pictogramme : cœur jaune, manteau orange, bord rouge translucide ; turbulence interne, braises qui se détachent derrière le front, traînée chaude persistante, dissipation au contact.
- **×2 :** souffle continu qui se sépare en deux nappes de flammes torsadées ; les deux nappes contournent légèrement la trajectoire et se rejoignent en une gerbe de braises, avec pulsation d'intensité progressive.
- **×3 :** plusieurs **serpents de feu** naissent à différents points de la couronne **autour de la victime** ; ils tournent le long d'arcs concentriques, leurs queues de braises suivent, puis toutes les têtes serpentent **vers le centre** et produisent une petite implosion dorée.

### 07 — Rat (`rat`) — Fromages rebondissants
- **×1 :** coin de fromage miniature à rotation inertielle et rebond en parabole, laissant trois miettes qui retombent séparément ; petit « pouf » de miettes au point d'arrivée.
- **×2 :** trois coins de tailles distinctes effectuent des ricochets désynchronisés, une miette se sépare à chaque contact virtuel ; les trois trajectoires se rejoignent en final.
- **×3 :** morceaux de fromage et miettes apparaissent **autour de la victime** comme une horloge ; les morceaux tournent en cercles de plus en plus serrés, rebondissent sur des anneaux imaginaires, puis s'assemblent **au centre** avant de se disperser en miettes.

### 08 — Bœuf (`ox`) — Charge de terre
- **×1 :** pulse de sol brun qui se propage de façon lourde vers la cible, éclats de roche stylisés à inertie propre et ride de poussière ; petit soulèvement au contact.
- **×2 :** deux secousses de vitesses différentes créent un décalage des cailloux et un effet de résonance, suivi d'un affaissement de poussière au point d'impact.
- **×3 :** un anneau de poussière / fragments de terre **se forme autour de la victime**, les débris orbitent lentement puis sont tirés **vers le centre** par des sillons de terre convergents ; tassement central et nuage bref sans projection vers l'attaquant.

### 09 — Tigre (`tiger`) — Griffes de tigre lumineuses
- **×1 :** trois traînées de griffes orange dessinées **séquentiellement** dans le sens de leur course, avec prolongement puis effacement du trait ; la griffe arrive par un arc rapide et laisse trois marques lumineuses fugaces.
- **×2 :** deux éventails de griffes se succèdent sous des angles différents, leurs traces restent visibles quelques instants et s'entrecroisent dans une étoile fauve ; ce n'est pas la simple répétition du même SVG.
- **×3 :** douze traces courtes surgissent sur le **périmètre entourant la victime**, orientées radialement ; trois vagues décalées les font glisser **vers le centre** en arcs qui se croisent, puis les traces convergent en un motif de tigre lumineux. Sans violence graphique.

### 10 — Serpent (`snake`) — Onde serpentine
- **×1 :** ruban énergétique vert avec une onde sinusoïdale **qui se propage le long du corps** ; tête en avance, queue souple en retard et sillage très fin.
- **×2 :** deux rubans de fréquences différentes s'enroulent en double hélice sur le trajet ; ils se séparent avant l'arrivée et effectuent deux impacts décalés.
- **×3 :** un serpent d'énergie **se dessine en anneau autour de la victime**, puis deux hélices secondaires évoluent sur ce cercle ; l'ensemble réduit son rayon en continu et se résorbe **au centre** comme un nœud lumineux.

### 11 — Cheval (`horse`) — Galop d’étoiles
- **×1 :** empreintes lumineuses apparaissant au rythme d'un galop, suivies d'une **étoile filante** ; la tête lumineuse avance, tandis que sa longue traînée se **construit et vieillit derrière elle** ; poussière d'or sur son passage.
- **×2 :** deux étoiles de tailles différentes suivent des courbes de galop entrecroisées, avec quatre battements de sabots lumineux dont les traces s'éteignent dans l'ordre ; choc en étoile dorée.
- **×3 :** constellation d'empreintes et **étoiles filantes** surgissant **sur un anneau externe autour de la victime** ; chaque étoile suit une orbite décroissante **vers le centre**, laissant derrière elle un sillage progressivement prolongé puis effacé ; finale en constellation compacte.

### 12 — Chèvre (`goat`) — Cyclone nuageux **(référence prioritaire cyclone réaliste)**
- **×1 :** **mini-cyclone volumétrique simulé** : entonnoir de vapeur, couronnes tournant à des vitesses différentes, poussière entraînée tangentiellement, cœur plus clair et masquage avant/arrière ; le cyclone se déplace vers la cible tout en **tournant réellement sur son axe**.
- **×2 :** deux cyclones de rayons et vitesses distincts s'entrelacent sans se superposer exactement ; leur turbulence mélange des filaments de nuages et une poussière spiralée ; réunion en bourrasque au contact.
- **×3 :** **cyclone annulaire formé directement autour de la victime**, plusieurs couches avec rotation, ascendance et profondeur ; le diamètre de l'anneau diminue progressivement pendant que le courant attire les nuages et poussières **de l'extérieur vers le centre**. L'entonnoir se referme sur le centre, puis s'évapore. **Interdit :** utiliser uniquement `rotate()` sur un SVG de tornade.

### 13 — Singe (`monkey`) — Salto de bananes
- **×1 :** banane en rotation avec trajectoire de lancer parabolique, silhouette qui s'incline selon la vitesse et petites étoiles joyeuses dans la traînée ; rebond final.
- **×2 :** trois bananes en sauts de grenouille et ricochets distincts ; leurs rotations ne sont pas synchronisées ; le dernier rebond crée une gerbe jaune.
- **×3 :** bananes disposées en arc **autour de la victime**, chacune réalise un salto orbital, puis des sauts progressivement plus proches du centre ; collision centrale sous forme de spirale jaune et étoiles.

### 14 — Coq (`rooster`) — Éclat de l’aube
- **×1 :** soleil miniature s'ouvre en éventail de rayons qui s'allongent de la source vers la cible, avec montée progressive de lumière et poussières dorées, puis s'éteint.
- **×2 :** deux levers de lumière successifs : première onde horizontale et seconde couronne rayonnante, chacune avec sa propre vitesse d'ouverture ; final en éclat chaud sans flash violent.
- **×3 :** douze rayons de lever de soleil apparaissent **au bord du cercle entourant la victime** ; ils se courbent **vers le centre**, dessinent une rosace lumineuse qui se resserre et s'éteint dans un disque d'aube concentré.

### 15 — Chien Shiba (`dog`) — Patte bondissante
- **×1 :** empreinte de patte fait un saut dynamique et laisse deux petites empreintes temporaires à l'arrière ; accent élastique et poussière beige.
- **×2 :** alternance rapide de plusieurs appuis gauche/droite, trajectoire sautillante à amplitudes différentes, dernière empreinte plus large au contact.
- **×3 :** empreintes apparaissant comme un chemin circulaire **autour de la victime** ; elles « courent » sur une spirale de rayon décroissant, convergent **au centre** en une grande empreinte dorée, puis disparaissent.

### 16 — Sanglier (`boar`) — Bourrasque de terre
- **×1 :** rafale basse brun-terre qui roule comme une vague de poussière ; gros grains plus lents, grains fins plus rapides, vortex horizontal discret et sillage dissipé.
- **×2 :** deux rouleaux de poussière venant de hauteurs différentes se croisent, puis replient la matière en spirale serrée autour de la cible, sans créer un cyclone vertical identique à la chèvre.
- **×3 :** un **anneau horizontal de poussière autour de la victime** tournoie en couche basse et couche haute ; les grains glissent tangentiellement avant d'être happés **vers le centre**, formant un petit nuage terreux qui retombe.

### 17 — Panda (`panda`) — Choc de bambou
- **×1 :** tige de bambou souple qui se courbe comme un ressort avant de transmettre un pulse vert ; feuilles individuelles qui vibrent et tournoient derrière, contact élastique.
- **×2 :** trois arcs de bambou s'ouvrent successivement comme un éventail ; les feuilles échappées suivent des courants distincts avant un impact en feuille verte.
- **×3 :** tiges / courbes de bambou apparaissent **en enceinte circulaire autour de la victime**, s'inclinent vers l'intérieur comme des ressorts, libèrent des feuilles en orbite puis toutes les courbes et feuilles se referment **vers le centre** dans une rosace de bambou.

### 18 — Renard (`fox`) — Étincelles rousses
- **×1 :** petites lueurs orange (feux follets) progressant en trajectoire souple, avec des points lumineux qui restent quelques instants aux positions antérieures ; finale scintillante ; **ne ressemble pas** au jet de flammes du dragon.
- **×2 :** trois feux follets se poursuivent, se séparent puis se réunissent autour du point visé, avec des traînées de luminosités différentes et des scintillements asynchrones.
- **×3 :** feux follets naissent **autour de la victime** comme un collier lumineux ; ils tournent selon trois orbites irrégulières puis plongent **vers le centre**, leurs traces orangées se refermant comme des pétales de lumière.

### 19 — Tanuki (`tanuki`) — Roulade de feuilles
- **×1 :** boule de feuilles vert-olive roulante, avec feuilles individuelles qui se détachent puis sont reprises par la turbulence ; progression en roulade hélicoïdale.
- **×2 :** deux rouleaux de feuilles passent à des hauteurs différentes, fusionnent brièvement, puis éparpillent des feuilles sèches avec inertie au contact.
- **×3 :** plusieurs petits rouleaux de feuilles apparaissent **à la périphérie de la victime** et décrivent une danse circulaire ; leur axe de roulade s'incline, chaque rouleau s'aplatit puis s'enroule **vers le centre**, finale en nœud d'automne. Distinct de l'Esprit feuille, qui est plus aérien.

### 20 — Loutre (`otter`) — Ricochet de bulles
- **×1 :** chapelet de bulles translucides, tailles et vitesses différentes, reflets décalés, flottement et déformations élastiques ; elles rebondissent comme sur une surface d'eau imaginaire et éclatent doucement.
- **×2 :** deux jets de bulles forment des arcs croisés ; quelques bulles se scindent, d'autres fusionnent avant une gerbe de petites gouttes.
- **×3 :** plusieurs bulles apparaissent **en cercle extérieur autour de la victime** ; elles circulent en orbites liquides, s'étirent sous l'aspiration et se rapprochent **du centre**, puis éclatent en une couronne d'eau concentrée.

### 21 — Koala (`koala`) — Onde d’eucalyptus
- **×1 :** feuilles d'eucalyptus allongées portées par une brise lente ; portance distincte et balancement, sillage menthe très discret, retombée au contact.
- **×2 :** première vague de feuilles tournoyantes, deuxième rafale plus rapide qui relève les premières ; un arc végétal se referme doucement sur la cible.
- **×3 :** **couronne d'eucalyptus entourant la victime** ; les feuilles longues pivotent comme les aiguilles d'une boussole, puis chacune glisse en spirale **vers le centre**, où elles forment brièvement une fleur verte avant dissipation.

### 22 — Tortue (`turtle`) — Vague protectrice
- **×1 :** front d'eau turquoise compact, comme un petit bouclier liquide en mouvement ; ondes internes et écume à l'avant, petites gouttelettes sur les bords ; impact doux ondulatoire.
- **×2 :** deux fronts de vague successifs s'emboîtent, le second rattrape le premier et produit des anneaux aquatiques ; le rythme est plus pesant que le jet rapide de la carpe koï.
- **×3 :** **plusieurs anneaux d'eau apparaissent autour de la victime** avec géométrie de carapace discrète ; les ondulations **se contractent vers le centre** à vitesses décalées, comme une protection qui se referme, puis micro-éclaboussures centrales.

### 23 — Axolotl (`axolotl`) — Étoiles aquatiques **(référence prioritaire étoile filante)**
- **×1 :** étoile lumineuse bleu-lilas à tête nettement visible ; **traînée dynamique** d'eau lumineuse générée depuis les positions précédentes de la tête, plus fine et transparente vers l'arrière ; bulles se décrochant du sillage et se dispersant à l'arrivée.
- **×2 :** trois étoiles aquatiques filent en arcs différents, chacune produisant **sa propre traînée persistante** ; l'une passe derrière les autres ; leurs arrivées créent trois ondes d'eau distinctes.
- **×3 :** **huit étoiles apparaissent sur la périphérie entourant la victime**, jamais près de l'attaquant ; elles décrivent des arcs orbitaux puis filent **vers le centre** en laissant des traits longs qui **se dessinent derrière la tête** et restent un instant visibles ; finale en constellation sous-marine et bulles. Aucun rayon fixe pré-dessiné.

### 24 — Panthère des neiges (`leopard`) — Griffes de givre
- **×1 :** trois griffes de givre bleuté progressent comme des filaments glacés, laissant un bref dépôt de cristaux et de brume blanche ; final en petites étoiles de neige.
- **×2 :** éventails glacés croisés à hauteurs différentes, cristaux de taille variée et légère condensation qui s'étire derrière chaque passage ; impact en couronne gelée.
- **×3 :** éclats de givre naissent **autour de la victime** en flocon géant ; des arcs cristallins tournent puis s'orientent **vers le centre**, laissant une fine dentelle de glace qui se condense en halo froid et disparaît. Aucun effet de blessure.

### 25 — Grue (`crane`) — Plumes de vent
- **×1 :** plumes fines à portance réaliste simulée : bascule du rachis, oscillation, descente légère et accélération par la brise ; ruban d'air argenté dans leur sillage.
- **×2 :** trois courants de plumes de vitesses différentes convergent après une boucle, certaines plumes passent devant la cible, d'autres derrière ; impact en éventail ivoire.
- **×3 :** plumes apparaissant sur **un anneau périphérique autour de la victime** ; deux couches tournent en sens contraire, les plumes changent leur angle d'incidence en étant aspirées **vers le centre**, finale en plume lumineuse qui s'efface.

### 26 — Chat porte-bonheur (`cat`) — Patte porte-bonheur
- **×1 :** petit disque doré / sceau de patte qui tourne sur son axe avec reflets changeants, rebond de porte-bonheur et fines poussières d'or ; impact en empreinte lumineuse.
- **×2 :** trois sceaux dorés pivotent chacun à une vitesse différente, suivent des trajectoires croisant deux petites boucles et composent un trèfle lumineux à l'arrivée.
- **×3 :** **pièces et empreintes dorées apparaissent en cercle autour de la victime**, tournent comme un mobile puis se rapprochent **vers le centre** en alignant leurs reflets ; fusion dans un sceau de chance compact, puis disparition.

### 27 — Carpe koï (`koi`) — Jet d’eau **(référence prioritaire liquide réaliste)**
- **×1 :** **jet d'eau continu animé** : tête d'écume blanche, ruban bleu d'épaisseur variable, oscillation interne et gouttelettes qui naissent aux courbes ; **traînée liquide qui suit le déplacement**, impact en vraie gerbe avec gouttes indépendantes.
- **×2 :** deux jets serpentent l'un autour de l'autre, s'enroulent, se séparent légèrement puis frappent en deux temps ; chaque jet a ses propres bulles et éclaboussures, sans simple duplication décalée.
- **×3 :** **tourbillon d'eau qui se forme autour de la victime** : anneau d'écume extérieur, courants azur à profondeurs différentes, gouttes prises dans l'orbite ; rotation crédible puis contraction nette **de la périphérie vers le centre** jusqu'à une colonne d'eau locale qui retombe. Aucune vague envoyée depuis le koï.

### 28 — Panda roux (`red-panda`) — Tourbillon d’automne
- **×1 :** feuilles d'érable orange tournoient en petites boucles, tombent avec portance puis remontent brièvement dans une bourrasque ; traînées dorées fugitives.
- **×2 :** deux nappes de feuilles d'automne suivent des courants croisés, avec véritables rotations indépendantes et petits tourbillons secondaires ; impact en éventail roux.
- **×3 :** **mini-tourbillons orange apparaissant en anneau autour de la victime**, les feuilles d'érable tournent à des hauteurs différentes puis sont entraînées **vers le centre** ; finale en feuille d'érable lumineuse qui se défait. Plus tourbillonnant et orangé que le Tanuki.

### 29 — Manchot (`penguin`) — Glissade glacée
- **×1 :** coulée de glace stylisée qui glisse vers la cible, laisse une **vraie trace de givre derrière son front** et projette des cristaux fins ; arrêt en glissade et petit nuage froid.
- **×2 :** deux glissades de directions obliques alternent, chacune laissant un rail de givre distinct ; les rails se croisent et scintillent avant de s'effacer.
- **×3 :** **rails de glace incurvés apparaissent sur une couronne autour de la victime** ; plusieurs glissades glacées parcourent ces rails, qui deviennent progressivement plus petits **jusqu'au centre** ; les traces se fissurent en petits cristaux à la convergence, puis se dissipent.

### 30 — Kitsune (`kitsune`) — Tourbillon de flammes **(référence prioritaire feu réaliste)**
- **×1 :** **tourbillon de feu à filaments dynamiques** : flammes qui s'enroulent autour d'un axe mobile, cœur jaune-blanc, bord orange, braises détachées et **traînée de feu persistante derrière la tête du mouvement** ; pas un SVG fixe qui tourne à 780°.
- **×2 :** deux courants de feu hélicoïdaux se tressent, alternent une phase de compression et une ré-expansion, traînent des braises indépendantes ; collision lumineuse localisée avec résidus encore incandescents.
- **×3 :** **six à huit flammes folles naissent directement sur le cercle entourant la victime**, créent un **cyclone de feu local** dont les filaments orbitent et se penchent graduellement **vers l'intérieur** ; les traînées de braises restent visibles derrière les filaments tandis que le rayon se réduit ; implosion centrale dorée suivie d'une extinction progressive. Aucune flamme ne voyage du kitsune vers l'autre joueur.

**Contrôle de complétude :** le catalogue ci-dessus comprend exactement les 30 identifiants de `MASCOTS` (`src/interactive/domain/mascot.ts`) ; chacun possède trois scénarios documentés. Les scènes doivent être réellement codées et prévisualisables, pas seulement listées dans une configuration.

---

## 5 bis. Catalogue des **120 nouveaux dessins de mascottes** (30 × 4 états)

**Livrable impératif supplémentaire :** pour **chacune des 30 mascottes**, produire quatre illustrations de personnage **distinctes** qui complètent les six poses existantes :

1. **`tired` — 21–50 PV restants :** personnage visiblement fatigué / légèrement éprouvé, respiration plus lourde, pose moins assurée, légers signes cartoon d'effort (plumes en désordre, feuilles tombantes, traces de poussière, faible vapeur, etc.) ; aucune blessure graphique.
2. **`critical-tired` — 1–20 PV restants :** personnage **très fatigué, en état critique**, posture nettement affaiblie, tête basse, ailes/oreilles/queue retombantes selon l'espèce, tremblement subtil ou respiration laborieuse stylisée ; aspect très éprouvé **sans sang ni lésion visible**. Reconnaissable d'un seul coup d'œil, différent de `tired` et de `defeat`.
3. **`victory` — vainqueur du duel :** pose de triomphe propre à la personnalité et à l'espèce, lue facilement à petite taille ; entrée en célébration puis repos stable. Même un gagnant qui n'a que 10 PV passe à `victory` une fois le résultat annoncé.
4. **`defeat` — 0 PV / perdant :** pose KO de dessin animé, affaissée / tombée, yeux fermés ou spirales cartoon et animation de chute douce avant un maintien stable. **Aucun rendu macabre ou sanglant**. En cas de double KO, deux illustrations `defeat` simultanées.

**Il s'agit de 120 véritables nouveaux dessins ou frames d'illustration**, et pas de 120 recolorations CSS de l'image actuelle. Les silhouettes, yeux, vêtements / accessoires, particularités et proportions doivent rester fidèles aux personnages actuels. Les auras et l'état d'usure sont des choses distinctes : un combattant à 20 PV peut être à la fois en `critical-tired` et entouré d'une aura ×3 pendant une question critique. L'aura se superpose **sans remplacer** l'illustration.

### 5 bis.1 Direction artistique, personnage par personnage

| Mascotte | Fatiguée (≤50 PV) | Très fatiguée / critique (≤20 PV) | Victoire | KO / défaite |
|---|---|---|---|---|
| Esprit feuille | Bord de feuille un peu abaissé, quelques brindilles au sol | Feuille tombante et énergie végétale presque éteinte | Feuille redressée, bras/rameaux en hauteur | Fanée et posée au sol, feuilles immobiles |
| Hibou | Ailes basses, plumes ébouriffées | Paupières lourdes, ailes très tombantes, équilibre fragile | Ailes majestueusement ouvertes | Affaissé, yeux fermés, plumes au sol |
| Pieuvre | Tentacules moins toniques, expression lasse | Corps affaissé, tentacules étalés sans énergie | Tentacules hauts, pose rayonnante | Aplatie, petite goutte d'encre stylisée |
| Hérisson | Dos un peu arrondi, piquants détendus | Piquants mous, fatigue et respiration visible | Piquants dressés, pose fière | Petite boule immobile, yeux fermés |
| Lapin lunaire | Oreilles inclinées, pattes hésitantes | Oreilles entièrement tombantes, tête basse | Grand bond lunaire | Couché, oreilles sur le côté |
| Dragon | Ailes basses, petite fumée faible | Queue lourde, ailes repliées, souffle minuscule | Ailes déployées, flamme triomphale | Couché, fumée se dissipant |
| Rat | Épaules courbées, moustaches tombantes | Pattes tremblantes, tête basse | Geste malin avec fromage | Renversé doucement, yeux fermés |
| Bœuf | Tête inclinée, poussière légère | Sabots fléchis, effort visible, souffle lent | Pose puissante, sabots au sol | Couché, cornes abaissées |
| Tigre | Oreilles baissées, griffes moins tendues | Épaules affaissées, queue pendante | Griffes levées, expression fière | Allongé, pattes étendues |
| Serpent | Corps moins haut, petite ondulation lente | Tête posée près des anneaux, énergie faible | Tête haute, courbe fière | Lovée au sol, yeux clos |
| Cheval | Encolure basse, crinière décoiffée | Genoux légèrement pliés, souffle court | Cabrement stylisé | Couché, encolure reposée |
| Chèvre | Barbe / oreilles tombantes, petite volute lente | Pattes faibles, regard épuisé, nuage presque éteint | Posture fière sur rocher / nuage | Assise puis affaissée, yeux fermés |
| Singe | Queue tombante, bras relâchés | Recroquevillé, fatigue très marquée | Cabriole victorieuse | Étendu, queue immobile |
| Coq | Crête moins droite, ailes basses | Plumage retombant, tête penchée | Poitrine bombée, ailes relevées | Assis, crête penchée, yeux clos |
| Chien Shiba | Oreilles abaissées, queue moins haute | Queue et oreilles tombantes, posture vacillante | Queue dressée, patte fière | Couché, yeux en spirale cartoon |
| Sanglier | Tête basse, petites poussières | Pattes fléchies, corps lourd, regard épuisé | Pose de charge maîtrisée et fière | Couché sur le flanc, souffle dissipé |
| Panda | Posture assise un peu lasse | Tête très basse, bras relâchés | Deux bras levés, bambou en fête | Assis puis affaissé, yeux fermés |
| Renard | Queue moins fournie visuellement, oreilles inclinées | Queue traînante, front baissé, étincelles faibles | Queue relevée, pose rusée | Lovée au sol, yeux fermés |
| Tanuki | Épaules basses, feuilles collées au pelage | Silhouette accroupie, énergie épuisée | Petit saut joyeux, feuilles en éventail | Couché, feuilles au repos |
| Loutre | Moustaches basses, petites gouttes | Sur le dos, pattes relâchées, bulles rares | Splash joyeux, pattes en l'air | Sur le dos, yeux clos, eau calme |
| Koala | Oreilles basses, étreinte moins ferme | Somnolent, tête appuyée, yeux presque clos | Expression tranquille et fière, feuille haute | Endormi KO, immobile |
| Tortue | Cou rentré partiellement, démarche lourde | Tête très basse près de la carapace, fatigue visible | Tête redressée, carapace rayonnante | Complètement rentrée / avachie, calme |
| Axolotl | Branchies légèrement tombantes, regard las | Branchies affaissées, corps très peu tonique | Petit saut joyeux, bulles scintillantes | Au sol, branchies au repos, yeux clos |
| Panthère des neiges | Oreilles basses, souffle froid léger | Queue lourde, épaules tombantes, yeux mi-clos | Posture majestueuse et fière | Allongée, cristaux au repos |
| Grue | Plumes moins ordonnées, ailes basses | Cou penché, appui fragile, ailes fermées | Ailes grandes ouvertes, tête haute | Accroupie, cou reposé, yeux fermés |
| Chat porte-bonheur | Patte levée moins haut, clochette tombante | Patte basse, tête inclinée, lumière faible | Patte levée, clochette brillante | Couché, clochette silencieuse |
| Carpe koï | Nageoire basse, gouttes lentes | Corps fléchi, petite ondulation épuisée | Saut aquatique en arc | Posée sur une vague calme, yeux fermés |
| Panda roux | Queue moins haute, petite fatigue | Queue au sol, tête basse, oreilles penchées | Queue en panache, saut victorieux | Recroquevillé, queue immobile |
| Manchot | Ailerons bas, léger déséquilibre | Ailerons presque immobiles, tête basse | Glissade de joie avec bras ouverts | Assis sur la glace, yeux fermés |
| Kitsune | Queues / oreilles abaissées, braises faibles | Queues retombantes, énergie de flammes presque éteinte | Queues en éventail, flammes triomphales | Couché, petites étincelles s'éteignant |

Ces directives décrivent les intentions, pas une autorisation de remplacer le dessin source par un emoji ou une forme géométrique générique. **Le nouveau visuel doit conserver le visage et les traits de la mascotte correspondante.** Prévoir des fichiers source éditables, les exports optimisés et une planche/contact sheet de comparaison des 30 × 4 poses.

### 5 bis.2 Transitions, animation de repos et sélection des états

- **`tired` :** boucle discrète et lente (respiration, oreilles/plumes/queue qui descendent légèrement), non stroboscopique. Ne doit pas avoir l'air déjà KO.
- **`critical-tired` :** respiration plus marquée, regard lourd et micro-tremblement très discret, suffisamment différent pour être visible à 144 px ; pas de simulation graphique de blessure.
- **`victory` :** animation d'entrée individuelle (bond, ailes, nageoire, queue, flamme, etc.) 0,6–1,5 s, puis pose en maintien / boucle légère.
- **`defeat` :** animation d'entrée individuelle (perte d'énergie, affaissement, petite chute cartoon) 0,5–1,2 s, puis **immobilité ou respiration minimale**. Ne jamais faire revenir le personnage perdant en position victorieuse pendant la transition de manche.
- **Changement d'état :** crossfade léger ou animation morph / frame dédiée ; ce n'est pas une simple opacité sur une image fixe. Les réactions d'impact sont prioritaires pendant l'instant du choc, puis céder aux états de seuil.
- **Tailles :** silhouette et traits compréhensibles à **144 px** en mobile et **276 px** sur ordinateur ; ne pas tronquer oreilles, cornes, queue, ailes ou carapace. Aucun artefact de fond, transparence conservée.

**Format des ressources :** les six poses actuelles utilisent des spritesheets / atlas (voir `src/interactive/domain/mascot.ts`). Ne pas écraser leurs index, ni changer leur ordre implicitement. Deux choix techniques recevables : (a) atlas étendu avec métadonnées explicites et tests sur le découpage ; (b) quatre images transparentes optimisées par mascotte, référencées par manifeste, préchargées pour la partie. Dans les deux cas, fournir un mécanisme de vérification qui échoue si une des **120 images manque**, et un repli visuel gracieux en cas d'erreur de décodage. Ne pas charger d'assets par URL distante.

### 5 bis.3 Pseudocode non ambigu des seuils

```ts
type CombatPortraitState = 'normal' | 'tired' | 'critical-tired' | 'victory' | 'defeat';

type MatchOutcome = 'ongoing' | 'winner' | 'loser' | 'draw-ko';

function portraitForHp(hp: number, outcome: MatchOutcome): CombatPortraitState {
  if (outcome === 'winner') return 'victory';
  if (outcome === 'loser' || outcome === 'draw-ko' || hp <= 0) return 'defeat';
  if (hp <= 20) return 'critical-tired';
  if (hp <= 50) return 'tired';
  return 'normal';
}
```

`outcome` est calculé à partir du verdict du **duel courant**. Le `draw-ko` ne désigne que le double KO ; un match nul avec des PV positifs (si un futur mode le permet) ne doit pas afficher deux KO arbitrairement. La fonction ci-dessus est conceptuelle : intégrer les vrais types de domaine sans créer une deuxième source de vérité.

---

## 5 ter. Catalogue des **60 auras thématiques persistantes** (30 × ×2 / ×3)

Les auras sont un **état continu pendant la question**, distinct des attaques de résolution. Leurs primitives sont réutilisables, mais chacune des 30 mascottes doit avoir **son mouvement caractéristique** et une intensification visuellement évidente entre ×2 et ×3.

| Mascotte | Aura critique ×2 persistante | Aura super critique ×3 persistante |
|---|---|---|
| Esprit feuille | Volutes vertes et feuilles qui montent | Deux couronnes végétales qui tournent en sens contraires, souffle ascendant |
| Hibou | Halo lunaire pâle, plumes légères | Croissants concentriques et plumes en orbite lente |
| Pieuvre | Brume violette liquide et bulles d'encre | Courants d'encre en couches, petites spirales abyssales |
| Hérisson | Piquants lumineux en vibration douce | Couronne de pointes d'énergie rayonnante, pulsation régulière |
| Lapin lunaire | Petites étoiles et lueur rose lunaire | Arcs lunaires en orbite avec poudre d'étoiles ascendante |
| Dragon | Langues de feu flottantes, braises fines | Colonnes de flammes turbulentes en deux couches, effet d'air chaud |
| Rat | Pépites dorées flottantes avec rebonds | Spirales de miettes et rayons jaunes en ascension |
| Bœuf | Poussière minérale et halo terre | Grains rocheux en suspension, vibrations telluriques rythmiques |
| Tigre | Griffes de lumière apparaissant par vagues | Trois enveloppes d'énergie tigrée en pulsations décalées |
| Serpent | Ruban d'énergie vert qui s'enroule | Double hélice de flux serpentins autour du corps |
| Cheval | Lignes de vitesse et étoiles montantes | Comètes miniatures à traînées temporisées autour du portrait |
| Chèvre | Brume tournante autour des jambes | Entonnoir de cyclone multi-couches tournant réellement autour de l'axe |
| Singe | Arcs dorés bondissants | Couronnes de rebonds élastiques, éclats en rythme |
| Coq | Halo d'aurore et rayons doux | Couronnes solaires pulsantes, petites pointes de lumière ascendantes |
| Chien Shiba | Empreintes et souffle d'énergie | Pattes spectrales qui font le tour du portrait en sautillant |
| Sanglier | Poussière tourbillonnante près du sol | Double vortex terreux bas avec débris en suspension |
| Panda | Feuilles et halos vert tendre | Deux flux de bambou stylisés et feuilles à spirales verticales |
| Renard | Feux follets orangés flottants | Feux follets multiples en ellipses et étincelles diffuses |
| Tanuki | Feuilles brunes prises par le vent | Tourbillons de feuilles superposés en contre-rotation |
| Loutre | Bulles réfléchissantes ascendantes | Anneaux d'eau et bulles qui se déforment puis remontent |
| Koala | Brume menthe et feuilles lentes | Double courant d'eucalyptus en tourbillons doux |
| Tortue | Lueur aqueuse semi-circulaire | Deux boucliers de courant d'eau pulsatiles concentriques |
| Axolotl | Poussière étoilée et bulles | Constellations tournantes et petites comètes à traînées réelles |
| Panthère des neiges | Brume givrée et cristaux en suspension | Voiles de neige en spirale et éclats de givre tournants |
| Grue | Courant de vent avec plumes élégantes | Deux ailes de vent imaginaires et orbites de plumes |
| Chat porte-bonheur | Lueur dorée et petits talismans | Cercle de chance, empreintes et étoiles dorées flottantes |
| Carpe koï | Rubans d'eau et gouttes ascendantes | Courants d'eau en hélices avec petites écumes brillantes |
| Panda roux | Feuilles rouges ascendantes | Deux roues de feuilles d'érable en rotation opposée |
| Manchot | Cristaux froids et flocons doux | Couronne glacée stratifiée et poussière de glace ascendante |
| Kitsune | Feu follet orange et braises | Flammes fantômes ondulantes autour de plusieurs queues, vortex vertical |

Pour chacune des 60 auras, vérifier au minimum **trois couches ou comportements caractéristiques lorsqu'ils sont pertinents**, continuité de l'énergie sur toute la durée de question, stabilité lors d'un temps d'attente long, et absence d'interaction avec les réponses. Le rendu ne doit pas être un effet d'attaque permanent infligeant des dégâts : **aucun PV n'est modifié par une aura**.

---

## 6. Architecture d'implémentation recommandée

### 6.1 Principe

Utiliser un **moteur de scène VFX léger**, piloté par une horloge unique, plutôt que 30 feuilles de style presque identiques. La donnée de jeu fournit **mascotte émettrice logique, mascotte victime, type de résolution, niveau, positions, graine stable**. Le moteur produit **une timeline déterministe** comportant *émissions, gestes, trajectoires, traînées, lumières, impact, dissipation*, et sait dessiner chaque scène à un instant `t`.

**Solution proposée :** rendu hybride **Canvas 2D + SVG** sans dépendance lourde : Canvas pour particules nombreux, trajectoires et historiques de traînées ; SVG/CSS pour silhouettes vectorielles, masques complexes, portraits et petits effets résiduels. Un `<canvas>` transparent en overlay `position: fixed; pointer-events: none` suffit pour les deux camps ; le rendu est limité à la scène active. Une solution pure SVG est acceptable **uniquement si** elle prouve des particules réellement indépendantes, des traînées historiques et la fluidité mobile. WebGL n'est pas imposé ; ne l'introduire qu'après benchmark justifiant le coût, avec repli Canvas 2D.

Le moteur VFX **ne calcule ni dégâts ni vainqueur**. Il ne modifie pas les journaux de réponses. Sa disparition, une exception graphique, le manque de GPU ou un changement de fenêtre ne doivent jamais empêcher le duel de continuer.

### 6.2 Organisation des fichiers (suggestion)

```text
src/interactive/duel/
  vfx/
    types.ts                 # Contrats typés scène, motif, émetteurs, ancres, niveaux
    catalog.ts               # Enregistre les 30 signatures et garantit exhaustivité
    director.ts              # Construit la timeline déterministe pour 1/2/3
    clock.ts                 # Déroulement, pause/reprise, seek, arrêt, time scale
    geometry.ts              # Portrait, centre, anneau, clip mobile, trajectoires
    particles.ts             # Émetteurs, particules, forces, trajectoires, trails
    materials.ts             # Eau, feu, poussière, feuilles, bulles, givre, lumière
    renderer-canvas.ts       # Dessin Canvas2D, layers, résolution et DPR
    renderer-svg.tsx         # Motifs vectoriels optionnels, masques, lueurs
    quality.ts               # Budget de particules, simplification automatique
    DuelVfxLayer.tsx         # Adaptateur React propre et click-through
    PersistentCritAura.tsx   # Aura ×2/×3, visible pendant toute la question
    portrait-states.ts       # Sélecteur d'état par HP + outcome, testable
    CombatPortrait.tsx       # Images normal/tired/critical-tired/victory/defeat
    portrait-assets.ts       # Manifeste et préchargement des 120 états
    signatures/
      leaf.ts owl.ts octopus.ts hedgehog.ts rabbit.ts dragon.ts
      rat.ts ox.ts tiger.ts snake.ts horse.ts goat.ts
      monkey.ts rooster.ts dog.ts boar.ts panda.ts fox.ts
      tanuki.ts otter.ts koala.ts turtle.ts axolotl.ts leopard.ts
      crane.ts cat.ts koi.ts red-panda.ts penguin.ts kitsune.ts
```

Les noms sont indicatifs ; ne pas créer une arborescence artificiellement énorme si certains modules peuvent être regroupés sans nuire à l'identité de chaque mascotte. L'important est que **les 90 timeline descriptors existent réellement** et sont testables séparément. Les anciens composants `DuelImpact`, `SignatureAttackArt`, `CriticalSpecials`, `SuperCriticalSpecials` doivent être supprimés, réemployés comme adaptateurs ou réduits à leurs fonctions encore utiles ; éviter la double exécution d'anciens et nouveaux effets.

### 6.3 Contrats TypeScript attendus (exemple conceptuel)

```ts
type AttackLevel = 1 | 2 | 3;
type AttackOutcome = 'correct' | 'mistake' | 'timeout';
type VfxQuality = 'high' | 'balanced' | 'low';

type Rect = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };

type AttackSceneInput = {
  mascot: MascotKind;                    // thème de l'effet (auteur logique)
  level: AttackLevel;                    // 1, 2 ou 3
  outcome: AttackOutcome;
  attackerSide?: 'left' | 'right';
  victimSide: 'left' | 'right';
  attackerRect?: Rect;
  victimRect: Rect;
  victimPlayArea: Rect;                 // limites de sécurité visuelle
  viewport: Rect;
  stableSeed: string;                   // id de question / duel + révision
  quality: VfxQuality;
};

type AttackScene = {
  durationMs: number;
  choreographyId: string;              // unique par mascotte et niveau
  materialId: string;
  renderAt(ms: number): FrameDescription;  // déterministe pour tout ms
  cancel(): void;
};

type MascotAttackDefinition = {
  mascot: MascotKind;
  normal: (input: AttackSceneInput) => AttackScene;
  critical2: (input: AttackSceneInput) => AttackScene;
  critical3Inward: (input: AttackSceneInput) => AttackScene;
  aura2: (mascot: MascotKind, seed: string) => AuraScene;
  aura3: (mascot: MascotKind, seed: string) => AuraScene;
  portraitAssets: {
    tired: string;
    criticalTired: string;
    victory: string;
    defeat: string;
  };
  backfire: {
    normal: (input: AttackSceneInput) => AttackScene;
    critical2: (input: AttackSceneInput) => AttackScene;
    critical3Inward: (input: AttackSceneInput) => AttackScene;
  };
};
```

**Important :** le champ `portraitAssets` désigne les **dessins** à produire et précharger, pas des URLs qu'il suffirait d'inventer. `AuraScene` doit supporter lecture continue, pause/reprise et destruction. `backfire` peut réutiliser la composition thématique et le code du ×3 pour le même avatar, mais ses trajectoires ×1/×2 doivent rester strictement locales ; il n'est pas nécessaire de fabriquer 180 œuvres indépendantes. Ne pas utiliser les noms de ces types comme un substitut à leur implémentation.

### 6.4 Horloge, randomisation, stabilité

- Le temps graphique est **fonction du temps écoulé** : `frame = f(seed, level, mascot, t, layout)`, pas du nombre de `requestAnimationFrame` exécutés. Même scène, même seed et même instant = même rendu (à tolérance graphique connue).
- Les valeurs aléatoires (taille, angle initial, vitesse, couleur secondaire) proviennent d'un générateur **déterministe** déjà présent dans le projet (`createRng(hash(...))`) ou d'une version stable équivalente ; jamais `Math.random()` pendant `renderAt`.
- Une animation déclenchée par le tour `roundId` démarre **une fois** ; plusieurs rendus React ne la redémarrent pas.
- `pause` gèle le temps VFX ; `resume` reprend sans saut. `cancel()` libère RAF, buffers, écouteurs et mémoire ; nouvelle question annule la précédente.
- Changement de viewport : recalcul de l'ancrage et **conservation de la progression normalisée** ; jamais saut aléatoire sur l'autre joueur.
- La timeline fournit au minimum des jalons explicites `emerge`, `travel/orbit`, `contact`, `dissipate`, utilisés pour caler la réaction de la victime. Éviter une réaction au clic quand le projectile n'est pas arrivé.

### 6.5 Géométrie de ×3 et anti-attaque interjoueurs

Déterminer `C` (centre de la mascotte victime), `Rportrait` (rayon de référence) et les dimensions utiles du demi-terrain. Produire des points de spawn **autour de C** avec des angles répartis / irréguliers, un rayon externe adapté au téléphone. Réduire dynamiquement le rayon de l'effet si le demi-terrain manque de place ; ne jamais déplacer le point central vers l'adversaire pour « faire de la place ».

Exemple de loi centripète (à améliorer selon la matière) :

```ts
const u = clamp((t - inwardStart) / inwardDuration, 0, 1);
const eased = u * u * (3 - 2 * u);
const radius = mix(outerRadius, coreRadius, eased); // outerRadius > coreRadius
const angle = initialAngle + angularSpeed * u + twist(u);
const x = victimCenter.x + radius * Math.cos(angle);
const y = victimCenter.y + ellipseFactor * radius * Math.sin(angle);
```

**Invariant géométrique vérifiable :** pendant la phase de compression, la moyenne (ou médiane robuste) des distances des émetteurs principaux au centre victime diminue sensiblement et durablement, pour chaque mascotte ; aucun élément offensif principal ne démarre dans une zone de l'attaquant puis n'entre dans la zone de la victime. Les particules secondaires de dissipations peuvent s'éloigner *après* le contact central.

Sur téléphone étroit, privilégier une orbite elliptique, réduire la taille / la densité et masquer les bords plutôt que faire déborder l'effet sur les réponses du voisin. Le cercle imaginaire est un **espace autour de la mascotte**, pas une obligation de débordement hors écran.

### 6.6 Traînées authentiques

Pour chaque projectile / étoile / braise / goutte :

1. L'émetteur possède une tête calculée `head(t)` ;
2. Le moteur mémorise ou reconstitue les positions de cette tête aux instants antérieurs `t-Δ, t-2Δ, ...` ;
3. Le tracé des traînées utilise ces points historiques, ordonnés **de l'arrière vers la tête** ;
4. L'alpha et l'épaisseur décroissent avec **l'âge des segments**, pas seulement avec la distance à la tête ;
5. Des débris / étincelles se détachent suivant vitesse, courbure, turbulence et matériau ;
6. Une fois la tête disparue, **la traînée survit brièvement**, puis se dissipe naturellement.

En mode déterministe, on peut reconstruire les points historiques par échantillonnage de `positionAt(t−k×Δ)` sans stockage non déterministe. **Validation visuelle obligatoire** : capture de plusieurs images successives démontrant que la longueur de la traînée augmente lorsque la tête avance, puis que les anciennes portions s'effacent.

### 6.7 Matériaux et effets procéduraux

Fournir des primitives techniques réutilisables, **sans en faire des chorégraphies identiques** : `FluidRibbon`, `FirePlume`, `VortexRing`, `GravityDust`, `ShootingStarTrail`, `FlutterLeaf`, `BuoyantBubble`, `FrostCrystal`, `EnergyArc`, `ImpactRipple`, `GlowCore`, `SoftSmoke`. Chaque signature combine ces primitives avec ses **propres paramètres, événements et trajectoires**. Préférer une simulation crédible stylisée à un faux moteur physique lourd. Les épaisseurs, lissages, opacités, vitesses et angles doivent être interpolés avec continuité ; pas de `jump cut` involontaire.

---

## 7. Rendu, performance, compatibilité et accessibilité

### 7.1 Performances

**Cibles de performance (mesurées, pas simplement affirmées) :**

- Grand écran 1366×768 : cible 60 fps sur machine de référence raisonnable ; capture des temps de rendu moyen et p95 ; éviter toute jank perceptible.
- Mobile 390×844 et 360×640 : viser 30 fps stables au minimum sur environnement de test contraint ; réduire le nombre de particules, le flou et la résolution interne en mode faible, **sans modifier la chorégraphie**.
- DPR plafonné raisonnablement (ex. 2 sur mobile). Un **seul** overlay de rendu par duel actif, pas 30 canvases ou 90 RAF concurrents.
- Les limites concrètes de budget doivent être établies par **benchmark sur le dépôt** avant de figer la valeur des particules : commencer avec ~80–160 particules visuelles actives en mode équilibré, moins en mode faible, puis ajuster avec mesures et captures. Ne pas se contenter de déclarer « optimisé ».
- Pas de chargement réseau au déclenchement d'une attaque ; pas de ressources imposantes ou de textures externes. Nettoyer tous les caches et buffers du rendu à l'arrêt.
- Le budget de bundle `scripts/interactive-budgets.mjs` est **bloquant**. Optimiser / retirer le moteur existant si nécessaire au lieu d'augmenter la limite pour passer les tests.

### 7.2 Lisibilité, appareils, accessibilité

- Modes testés : 1366×768, 390×844, 360×640, 844×390, plein écran, zoom 200 % si praticable, tactile, souris et clavier.
- Effets localisés et **non interactifs** (`pointer-events: none`; `aria-hidden="true"`). Le statut textuel « Bonne réponse / Mauvaise réponse / Vie perdue » et la barre de vie restent le **canal d'information officiel**.
- Ne pas masquer durablement l'énoncé ou les cartes, ne pas faire scintiller l'écran entier, ne pas employer de flash blanc violent ni de séquence stroboscopique. Limiter les halos localement.
- Réactions lisibles mais non choquantes : oscillation, petit recul, élasticité ; ne pas simuler de blessure ou détresse graphique.
- Conserver les animations actives selon le contrat actuel du dépôt ; ajouter si possible une **option locale « Effets simplifiés »** pour les environnements peu puissants et la sensibilité au mouvement. Cette option modifie la densité et l'amplitude, **jamais** la lecture des dégâts ni la règle centripète. Ne pas supprimer silencieusement toutes les animations en raison de `prefers-reduced-motion` si cela contredit le comportement actuellement testé ; en revanche éviter par défaut les effets visuellement agressifs.

### 7.3 Mode dégradé et robustesse

- Canvas 2D indisponible, erreur de VFX, onglet en arrière-plan, taille zéro, écran tourné en plein effet : retour à une **petite animation CSS/SVG sûre et thématique**, puis poursuite du jeu. Les calculs de dégâts ne dépendent jamais du renderer.
- La scène est réinitialisable sans fuite mémoire et sans laisser de calques invisibles couvrant les boutons.
- Déclenchements dans une nouvelle rencontre et changements de mascottes ne doivent pas réutiliser des particules / couleurs de l'ancien combattant.
- L'aperçu doit supporter 30 mascottes, les deux sens et trois niveaux sans lancer deux scenes simultanées en s'empilant.

---

## 8. Intégration UI, prévisualisation et synchronisation

1. **Préparation :** conserver la grille de mascottes ; afficher le vrai nom de l'attaque ; bouton « Voir l’attaque », avec sélection **Normal**, **Critique ×2**, **Super critique ×3** (un seul choix actif ; remplacer les deux cases à cocher cumulables par des radios / segmenté pour éviter un état ambigu). Les essais montrent la **même scène** que le duel, avec cible visible.
2. **Combat :** passer les rectangles / centres mesurés au moteur seulement au bon moment ; afficher l'effet dans une couche unique respectant les frontières du duel. Bon sens gauche→droite/droite→gauche pour ×1/×2 ; **×3 invariant quel que soit le côté de l'attaquant**.
3. **Résultat :** synchroniser le moment où la cible semble touchée et la réaction du portrait ; la valeur HP peut changer instantanément dans le domaine, mais sa transition visuelle et son annonce doivent rester compréhensibles.
4. **Compte à rebours :** appliquer la règle du §4.4 afin que l'animation ne disparaisse pas avant son final ; pause/reprise/retour/rechargement inclus. Le texte ne doit pas annoncer une nouvelle question pendant la fin de l'effet précédent.
5. **Équipes :** l'attaque utilise **la mascotte du membre qui vient de répondre**, jamais la mascotte du premier membre de son équipe. La mascotte victime doit être celle du duel en cours.
6. **Hors ligne :** pas de téléchargement d'effet après la préparation, pas de CDN requis.
7. **Auras permanentes de la question :** afficher `PersistentCritAura` pendant `state.phase === 'question'` selon `round.multiplier` (×2 et ×3), autour des **deux** mascottes. Prévoir timeline continue et conservation lors de la pause, pas seulement `CriticalSpecials` après le clic. Dissiper au verdict.
8. **Portraits progressifs :** intégrer `CombatPortrait` aux deux côtés ; choisir image selon le tableau §3.4, sans modifier les PV du moteur. Pour un joueur à 50 PV, afficher `tired` ; à 20 PV, `critical-tired` ; à 0 PV, KO. Une victoire passe au dessin `victory` après l'impact. Garder les barres de vie visibles en permanence.
9. **Surfaces de résultat :** les portraits victoire/KO doivent être visibles à la fin de chaque duel et lors des écrans intermédiaires pertinents, y compris en tournoi ; éviter que le rendu ne se limite à un message textuel. Les états `tired`/`critical-tired` restent visibles pendant toutes les questions où les seuils s'appliquent.

---

## 9. Plan de réalisation imposé à Codex

### Lot A — Audit et base de comparaison

- Lire les fichiers listés au §1 et le contrat du jeu. Identifier toutes les dépendances à `attackSequence`, `DuelImpact`, `freshImpact`, `effects.css` et aux tests existants.
- Exécuter les suites existantes, enregistrer état initial, captures normales/×2/×3 pour les références, budget gzip, tailles de viewport.
- Créer une courte note d'architecture dans `docs/interactive/` expliquant la décision Canvas/SVG, les compromis et la stratégie du minuteur de correction.
- Inventorier et vérifier les 30 illustrations d'origine / spritesheets pour dessiner fidèlement les 120 nouvelles poses et les 60 auras.

### Lot B — Moteur VFX et primitives

- Implémenter une API typée de scène avec `renderAt(t)` déterministe, annulation, pause, resize ; overlay non interactif et clipping de sécurité.
- Ajouter primitives « traînée historique », « cyclone multi-couches », « flamme turbulente », « eau ruban/écume », « feuilles portées », « bulles », « poussières », « lueur », etc.
- **Démonstrateurs non négociables :** (1) Chèvre : cyclone véritable ; (2) Axolotl : étoile filante + traînée qui reste derrière ; (3) Kitsune : flammes avec traînée de feu ; (4) Carpe koï : écoulement et éclaboussures. Les quatre doivent fonctionner en ×1, ×2, ×3 avant industrialisation.
- Passer les tests existants sans changer règles de combat et journal.

### Lot B bis — Auras persistantes et états de vie / de résultat (P0)

- Développer `PersistentCritAura` avec une timeline **illimitée par la durée de la question**, seulement ×2/×3 ; les deux combattants sont concernés et leurs thèmes diffèrent ; pause/reprise, sans fuite RAF.
- Réaliser les **60 variantes d'aura** du §5 ter et leur intensification ×2→×3, vérifier l'effet de charge de jeu vidéo sans masquer la question.
- Dessiner / exporter / intégrer les **120 nouveaux visuels** du §5 bis : `tired`, `critical-tired`, `victory`, `defeat` pour les 30 mascottes, en conservant leurs identités graphiques.
- Brancher les seuils inclusifs : 51–100 normal, 21–50 fatigué, 1–20 très fatigué, 0 KO ; après duel victoire prime sur fatigue. Vérifier les deux personnages sur timeout / double KO.
- Conserver les états de seuil pendant les questions et la pose finale jusqu'à la sortie / au binôme suivant ; précharger tous les visuels nécessaires hors réseau.

### Lot C — Les 90 scènes et retours de sort

- Implémenter les 30 signatures **exactement** selon le catalogue du §5, toutes en ×1, ×2, ×3 ; comparer visuellement les signatures similaires et les rendre reconnaissables.
- Fournir les variantes locales en cas de mauvaise réponse (×1, ×2) et le ×3 centripète auto-infligé, sans remplacer la signature par un objet générique.
- Livrer une prévisualisation complète : changement de mascotte / niveau / côté / réponse, redémarrage, vitesse 0,5× et lecture image par image en **mode développement seulement**, afin de vérifier matière et trajectoire.

### Lot D — Intégration, responsive, correction

- Brancher le moteur unique sur `DuelGame`, le prévisualiseur et les deux modes (duel, équipes).
- Supprimer / désactiver les anciens coups dupliqués. Éviter la nouvelle question avant la dissipation de ×2/×3 ; corriger les minuteries sans changer les points.
- Adapter les scènes aux petits écrans ; définir qualité équilibrée / faible sans créer de comportements de combat divergents.
- Vérifier l'empilement visuel : **portrait selon PV → aura persistante pendant question → animation d'attaque pendant feedback → réaction → portrait mis à jour / victoire / KO**.

### Lot E — Validation et livraison

- Tests unitaires, intégration navigateur, captures de séquences, contrôle visuel humain sur **toutes les 90 scènes**, **60 auras** et **120 poses nouvelles**, mesure performance, conformité bundle, tests A4 hors périmètre.
- Publier dans `docs/interactive/` un rapport d'acceptation liant chaque mascotte et chaque niveau à une preuve visuelle (captures à plusieurs instants ou courte vidéo de test), une liste de vérifications exécutées et les limitations éventuelles.
- **Pas de livrable « 90 scènes faites » sans preuves.** Pas de hausse artificielle de budget, pas de suppression de tests existants pour verdir la CI.

---

## 10. Critères de recette / tests d'acceptation

### 10.1 Complétude et unicité

- [ ] Les 30 IDs de `MASCOTS` sont couverts à 100 %.
- [ ] Pour chacun, les trois niveaux ont une timeline et un `choreographyId` distincts : **90 entrées**.
- [ ] Deux mascottes différentes ne partagent pas **une même chorégraphie complète** sous deux palettes. Différences visibles de rythme, trajectoires, géométrie et finale.
- [ ] Aucun niveau ×2 n'est un simple clonage temporel du ×1.
- [ ] Chaque entrée possède une capture de début, développement, contact et dissipation ; une revue humaine valide la lisibilité.

### 10.1 bis — Auras et portraits progressifs (blocage impératif)

- [ ] Les 30 mascottes possèdent chacune **deux auras persistantes identifiables** (×2/×3), soit 60 compositions thématiques ; ×3 visiblement plus intense que ×2.
- [ ] Chaque aura apparaît **au premier affichage** d'une question critique, autour **des deux joueurs**, et reste vivante pendant toute la phase `question` ; aucun arrêt au bout d'une seconde.
- [ ] Sans minuteur, une question ×2 ou ×3 laissée ouverte **deux minutes** conserve l'aura sans perte de performance ni dérive ; avec minuteur elle persiste jusqu'au verdict ; pause/reprise = continuité sans double création.
- [ ] Pas d'aura critique pendant une question normale ni dans l'écran du duel suivant ; aucun effet de dégâts de la simple aura.
- [ ] Les 30 mascottes disposent chacune de **quatre vrais visuels** `tired`, `critical-tired`, `victory`, `defeat` : **120 images vérifiées** (pas de simples filtres ou changement de couleur).
- [ ] PV **100, 90, 60, 51** = normal ; PV **50, 40, 21** = fatigué ; PV **20, 10, 1** = critique / très fatigué ; PV **0** = KO.
- [ ] Fatigue / critique demeurent visibles pendant toute la question et les tours suivants ; nouvelle attaque ne recrée pas de clignotement ni d'image manquante.
- [ ] Une victoire affiche le **dessin `victory` du bon personnage**, même à 10 PV ; perdant en `defeat`. Double KO = **deux KO**, aucun triomphe.
- [ ] Mauvaise réponse et expiration déclenchent les mêmes seuils de portrait que bonne réponse, pour chaque victime réelle.
- [ ] Les 120 visuels sont chargés sans réseau externe et n'affectent pas l'ordre des six poses existantes ; les sprites/atlas n'ont pas de décalage visuel ni d'effet de cropping.
- [ ] Preuves visuelles des quatre états pour chacune des 30 mascottes sur mobile et ordinateur ; transitions non graphiques et compréhensibles.

### 10.2 Géométrie spécifique ×3 — blocage impératif

Pour **chacune des 30 mascottes**, tester ×3 en situation *bonne réponse à gauche*, *bonne réponse à droite*, *erreur à gauche*, *erreur à droite* :

- [ ] L'attaque commence dans une **couronne autour de la mascotte perdant la vie**, pas près de l'attaquant.
- [ ] Aucun projectile offensif ne traverse le couloir interjoueurs (test de géométrie / traces d'émetteurs).
- [ ] Les éléments principaux ont une phase périphérique, puis une **convergence mesurable des distances au centre** avant l'impact.
- [ ] L'impact final est localisé au centre du portrait victime ; pas sur la barre de vie ni les cartes.
- [ ] La réaction et les **−30 %** concernent exclusivement le joueur perdant ; aucun dommage graphique ou numérique ajouté par nombre de projectiles.
- [ ] Aucune « charge offensive autour de l'attaquant » ne subsiste dans le ×3.

### 10.3 Réalisme visible des matériaux

- [ ] Cyclone Chèvre (×1/×2/×3) : plusieurs anneaux tournent réellement autour d'un axe ; particules avec vitesse tangentielle, profondeur et rayon variable.
- [ ] Axolotl et Cheval : la **traînée d'étoile naît derrière la tête**, grandit pendant le déplacement et persiste après son passage.
- [ ] Dragon et Kitsune : les **braises et traînées de feu** restent brièvement dans le sillage, avec turbulence de flamme ; les deux personnages restent distincts.
- [ ] Koï : eau avec courants internes + gouttes qui se séparent à la courbe / au choc ; ×3 tourbillon local sans jet traversant.
- [ ] Feuilles / plumes / bulles : chaque particule importante bouge indépendamment, et non au sein d'un SVG rigide unique.
- [ ] Roche, glace, poussière et aube : matières reconnaissables, finales différenciées.

### 10.4 Règles de jeu et cas limites

- [ ] Réponse juste : −10 / −20 / −30 % à l'adversaire selon le niveau, une seule fois.
- [ ] Mauvaise réponse : −10 / −20 / −30 % à soi, une seule fois ; pas de faux coup adverse.
- [ ] Expiration : −10 % **aux deux** ; aucune attaque traversante ni ×3 ; doubles KO = nul.
- [ ] Premier clic décisif, double clic ignoré, aucune nouvelle atteinte lors des re-renders.
- [ ] Les 30 mascottes restent uniques entre joueurs ; en équipes, bonne mascotte à chaque duel.
- [ ] Le personnage reste dans son état `tired` à 50 PV et `critical-tired` à 20 PV, même après un changement de question ; l'aura ×2/×3 se superpose correctement sans remplacer la pose.
- [ ] Pause/reprise, sortie, nouvelle partie, rotation écran, zoom et redimensionnement sans mémoire résiduelle ou projectile fantôme.
- [ ] Les journaux anciens demeurent lisibles conformément aux politiques actuelles ; aucun changement du score à la reprise.
- [ ] Les chronologies ×2 / ×3 **ne sont pas coupées** lorsque le réglage de correction est de 1 s.
- [ ] Aperçu et combat rendent la **même** chorégraphie pour une même mascotte/niveau/seed/layout.

### 10.5 Qualité / CI

- [ ] `npm test` et les tests existants du duel passent, avec compte rendu exact.
- [ ] `npm run test:interactive:duel` et `npm run test:interactive:mascots-effects` passent après mise à jour **des assertions**, pas en supprimant les parcours.
- [ ] `npm run build`, `npm run lint` et `npm run check:interactive:budgets` passent.
- [ ] Les screenshots et tests d'accessibilité existants (`test:interactive:a4`, `test:interactive:accessibility`) ne régressent pas.
- [ ] Preuves de fonctionnement 1366×768, 390×844, 360×640 et paysage mobile.
- [ ] Benchmarks d'image par seconde / temps de rendu en qualité haute et faible ; pas d'affirmation de 60 fps sans mesure.
- [ ] Aucune nouvelle dépendance massive ni chargement distant ; utilisation hors réseau après préparation conservée.

### 10.6 Protocole de captures

Créer un **catalogue de validation** pour 30 mascottes × 3 niveaux, plus **60 auras** et **120 images de personnage** (fatigué, très fatigué, victoire et KO), avec 5 vues à `t = 0 %, 20 %, 50 %, 80 %, 95 %` et, si possible, des clips courts pour les quatre références prioritaire (goat, axolotl, kitsune, koi). Le PNG seul ne permet pas d'évaluer une traînée ou un cyclone : filmer ou contrôler les positions entre plusieurs frames. Déposer les preuves dans un répertoire de tests / documentation adapté, sans gonfler le bundle livré. Afficher dans l'outil de développement l'identifiant de la scène, le niveau, le côté victime, l'instant et le seed.

---

## 11. Priorités, arbitrages et interdits

| Priorité | Exigence | Peut être simplifiée ? |
|---|---|---|
| **P0** | ×3 100 % **victime-centré et extérieur→intérieur**, tous scénarios | **Non** |
| **P0** | Aura ×2/×3 **persistante du début à la fin de la question** pour les deux joueurs ; 60 variantes thématiques | **Non** |
| **P0** | **120 dessins originaux** : fatigue ≤50 PV, critique ≤20 PV, victoire, KO pour les 30 mascottes | **Non** |
| **P0** | 30 personnages × 3 chorégraphies réelles, visuellement distinctes | **Non** |
| **P0** | Dégâts, sauvegarde, équipe, premier clic inchangés | **Non** |
| **P0** | Traînées réelles / cyclone réel / flammes réelles / eau dynamique pour les personnages concernés | **Non** |
| **P0** | Aucun effet coupé, rejoué ou empilé intempestivement | **Non** |
| **P0** | Mobile jouable, clics possibles, pas de flash stroboscopique | **Non** |
| P1 | Particules nombreuses, plusieurs couches, halos et blur fin | Oui, adaptatif selon appareil |
| P1 | Outil de développement pas-à-pas, captures automatisées | Partiellement, mais preuves finales requises |
| P2 | Audio synchronisé et vibrations haptique | **Hors périmètre**, sauf demande ultérieure |
| P2 | WebGL avancé / shaders très coûteux | Optionnel, seulement si benchmark positif |

**Interdits de livraison :** modifier les pourcentages de dégâts ; remplacer les 30 signatures par 10 presets ; changer la mascotte de l'attaquant selon le camp ; publier seulement 4 démonstrateurs ; faire dépendre les effets du réseau ; masquer les régressions en modifiant des seuils ; laisser du code mort qui déclenche l'ancien projectile en parallèle ; marquer une tâche « terminée » uniquement parce que TypeScript compile.

---

## 12. Instructions prêtes à donner à Codex

Copier le texte ci-dessous dans Codex **en joignant ce cahier des charges au dépôt**, idéalement sous `docs/interactive/cahier-des-charges-vfx-mascottes.md` :

> Tu travailles dans le dépôt `oasi-phuoc/doc-prof`. Implémente intégralement le cahier des charges « Refonte intégrale des animations d’attaque des 30 mascottes » fourni dans `docs/interactive/cahier-des-charges-vfx-mascottes.md`. Commence par auditer l'état actuel et les tests sans modifier les règles du jeu. Livrer **30 mascottes × 3 animations = 90 chorégraphies réellement différentes**, **60 auras persistantes personnalisées** (×2 et ×3 autour des deux mascottes du début à la fin de la question), **120 nouveaux dessins d'état** (fatigué à 50 PV ou moins, très fatigué/état critique à 20 PV ou moins, vainqueur et KO pour chacune), avec rendu 2D de qualité jeu vidéo, matière animée, traînées temporelles, particules indépendantes et réactions synchronisées. **Obligation P0 : toutes les attaques ×3 apparaissent directement autour de la mascotte qui perd les points de vie et convergent du périmètre vers son centre ; aucune attaque ×3 ne doit partir de l'attaquant ou traverser l'arène.** Les réponses incorrectes restent des auto-dégâts avec signature du personnage fautif. Conserver les dégâts 10/20/30 %, les probabilités 65/25/10 %, les délais d'expiration, le premier clic et les journaux. Adapter la durée de correction afin que les effets ne soient jamais coupés. Prioriser et démontrer : cyclone véritable (Chèvre), étoile filante à traînée persistante (Axolotl/Cheval), flammes à traînée (Kitsune/Dragon), eau fluide (Koï). Crée les 120 images originales cohérentes avec les personnages, puis branche les transitions sur les seuils exacts 50/20/0 et le verdict final. Implémente les 90 scènes et les 60 auras, pas seulement les démonstrateurs ; branche le même moteur sur l'aperçu et le combat. Fournis les tests et preuves, mesures sur mobile et desktop, et passe build/lint/tests/budgets sans relever les limites. Travaille par lots vérifiables, puis livre une synthèse des fichiers changés, captures et écarts éventuels. Ne déclare pas « terminé » si une seule mascotte/une seule intensité manque.

### Sortie attendue de Codex

À la fin, Codex doit fournir :

1. Liste des fichiers créés/modifiés et explication de l'architecture retenue.
2. Liste de **30 × 3** scènes réellement implémentées, avec leurs identifiants ; liste de **30 × 2** auras permanentes et inventaire des **30 × 4** dessins d'état, chemins et preuves.
3. Tableau de couverture de **bonne réponse / erreur / gauche / droite / ×1 / ×2 / ×3** et test spécifique de la convergence ×3.
4. Résultats bruts des tests exécutés, build, lint, budgets ; mention explicite de ce qui n'a pas été exécuté.
5. Preuves visuelles : galerie de captures / clips pour 90 attaques, maintien des 60 auras pendant la question, et planche des **120 portraits** aux seuils 50 / 20 / 0 et à la victoire.
6. Mesures de performance et compromis sur mobile.
7. Limites résiduelles et recommandations, sans qualifier de livré ce qui ne l'est pas.

---

## 13. Références source du dépôt

- [Catalogue actuel : `signature-attacks.ts`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/signature-attacks.ts)
- [Motifs actuels : `SignatureAttackArt.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/SignatureAttackArt.tsx)
- [Composant d'impact : `DuelImpact.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/DuelImpact.tsx)
- [CSS des attaques : `effects.css`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/effects.css)
- [Résolution des impacts : `effects.ts`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/effects.ts)
- [Moteur de duel : `core.ts`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/core.ts)
- [Rendu en combat : `DuelGame.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/DuelGame.tsx)
- [Prévisualisation : `MascotAttackPreview.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/interactive/duel/MascotAttackPreview.tsx)
- [ADR actuel 0046 — signatures de mascottes](https://github.com/oasi-phuoc/doc-prof/blob/main/docs/interactive/adr-0046-attaques-des-mascottes.md)
- [ADR actuel 0052 — critiques ×3](https://github.com/oasi-phuoc/doc-prof/blob/main/docs/interactive/adr-0052-duels-critiques-et-mascottes-uniques.md)
- [Relevé qualité des duels version 2](https://github.com/oasi-phuoc/doc-prof/blob/main/docs/interactive/quality-duel-v2-results.json)

**Note :** ceci est une **spécification de refonte**, pas un engagement que l'application possède déjà ces animations. Elle privilégie des mouvements physiquement crédibles, un rendu vraiment distinct pour chaque mascotte, et la règle « ×3 extérieur → centre sur la victime » à toute autre optimisation visuelle.
