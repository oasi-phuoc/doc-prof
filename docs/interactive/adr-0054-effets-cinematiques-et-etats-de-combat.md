# ADR 0054 — Signatures cinématiques et états de combat

Le [cahier fourni le 15 novembre](cahier-animations-fourni-20261115.md) est une référence de produit. La précision donnée dans le message du propriétaire prime sur sa règle de convergence : **un ×3 reste local à la victime, mais peut grandir et tourner sur place**. Le Kitsune utilise notamment cette formation centrale. Les barres latérales avec chiffres seuls et le combat épuré de l’ADR 0053 sont conservés.

## Moteur et matières

`duel/vfx/catalog.ts` décrit trente signatures, chacune avec trois compositions nommées. `model.ts` calcule une scène pure depuis l’identité, le niveau, la graine, le temps et les positions des joueurs. Les trente trajectoires normales et leurs compositions doubles utilisent des courants croisés, bonds, paraboles, hélices, éventails, ricochets ou traces progressives. Les triples ajoutent leurs gestes locaux propres : constellations, couronnes, griffures, sceaux, palissades, spirales et volumes. Les gestes principaux et les particules fines sont distincts.

Le rendu Canvas2D remplace dans le jeu et les aperçus les anciennes images SVG simplement déplacées. Les traces reconstruisent les positions antérieures de leur tête et perdent progressivement épaisseur et opacité. Les cyclones projettent des nappes hélicoïdales à différentes hauteurs, avec vitesses angulaires, rayons et ombrages de profondeur variables. Les flammes ont un cœur chaud ; l’eau, des filets et gouttes séparées ; plumes et feuilles, leur portance ; les pierres, une chute plus lourde.

Une seule couche et une seule boucle RAF dessinent les deux auras et la résolution du duel actif. Les soixante auras sont persistantes, propres à l’identité et au niveau, sans durée d’épuisement. Leur énergie s’éteint en 230 ms à la résolution. Le DPR démarre à 1,5 au maximum sur les petits écrans, à 2 ailleurs ; un intervalle d’affichage trop lent réduit d’abord cette résolution, puis la densité si nécessaire. Le texte et les personnages DOM gardent leur résolution native. Les zones de question, réponses et commandes sont exclues du dessin. Aucune requête de média ne part au déclenchement d’un effet. Aucune dépendance de rendu supplémentaire, aucun son, aucune vibration et aucune désactivation automatique selon `prefers-reduced-motion` ne sont ajoutés.

Une erreur réutilise **la signature de son propre auteur** dans son espace ; l’adversaire n’attaque pas. Le champ historique d’objets tombants est seulement une métadonnée de compatibilité. Une expiration produit deux réactions locales simples à dix points, sans appliquer le critique. Les échecs de Canvas ou du rendu déclenchent un petit repli de la couleur de la signature ; le moteur de jeu et le passage automatique continuent.

## Durées, pause et reprise

Les durées actuelles sont 920 ms, 1 420 ms et 2 100 ms. Les nouveaux journaux **version 3** appliquent `max(battement demandé, durée de scène + 140 ms)`. Le réglage de l’enseignant reste intact. L’annonce de préparation explique que l’animation peut prolonger la correction.

Les journaux version 2 restent rejouables avec leurs délais historiques. Leur présentation est accélérée seulement si leur ancien délai est plus court que la nouvelle scène ; leurs événements, critiques, résultats et échéances ne sont pas recalculés selon les règles cinématiques. Les journaux version 1 gardent le traitement conservateur décrit dans l’ADR 0052. Une future modification des règles de délai devra également préserver ces versions.

La perte de vie est décidée une seule fois par le domaine. Le nombre affiché et la réaction visuelle attendent le contact de la scène. Le temps visuel provient du battement restant, ce qui conserve l’instant à la pause et à la reprise. Une rotation ou un redimensionnement remesure les positions sans recommencer la scène. La pause garde les personnages et Canvas montés, gèle les animations et suspend aussi l’audio. La sortie annule la boucle, les observateurs et les écouteurs.

## Cent vingt dessins physiques

Cinq nouvelles planches RGBA originales, de quatre colonnes sur six lignes, contiennent chacune vingt-quatre dessins : fatigue, grande fatigue, victoire et KO pour six personnages. Le manifeste `combat-portraits.ts` conserve les indices des six poses historiques et de l’expression énervée. Les [empreintes et sources](combat-art-provenance.json) indiquent les PNG originaux, copiés sans retouche raster. Une petite marge de découpage évite les fragments de cellules voisines.

Le choix du portrait est explicite : victoire prioritaire ; défaite ou zéro point → KO ; 1–20 → grande fatigue ; 21–50 → fatigue ; 51–100 → normal. Une aura n’annule jamais la fatigue. Chaque dessin possède une entrée ou une respiration ; le KO se stabilise au sol. Les vainqueurs et perdants restent illustrés dans le bilan et entre deux rencontres d’équipe ; le prochain binôme commence à cent points. Les nouvelles planches sont chargées **et décodées avant de commencer**, puis servies depuis les blobs préparés hors ligne. Une erreur de dessin garde un repli de la même identité.

## Aperçus et preuves

L’aperçu emploie exactement le moteur du jeu, avec un choix exclusif Normal / ×2 / ×3 et un essai d’erreur pour chaque camp. L’atelier de développement ajoute ralenti, déplacement dans le temps, image suivante et vie de démonstration ; il est retiré de la compilation de production. Le laboratoire de preuves n’est accessible par aucune route produit.

La [galerie de revue](vfx-proofs/index.html) contient les 90 compositions à cinq instants, les 60 auras à cinq temps éloignés et les 120 portraits. Quatre films couvrent les trois niveaux de la Chèvre, de l’Axolotl, du Kitsune et de la Koï. Les [mesures](vfx-gallery-results.json) distinguent le coût de dessin des intervalles entre images, avec des vues de téléphone émulées à DPR 3, plafonné à 2 par le rendu.

Les tests automatisés vérifient les règles, les images réelles, l’indépendance des ×3 vis-à-vis de la position de l’adversaire, les auto-dégâts, les traces, la persistance des auras et les seuils. Les parcours natifs vérifient aussi premier clic, portrait et paysage, hors ligne, reprise, tournoi, pause avec comparaison de pixels, redimensionnement et défaillances forcées de Canvas. Les résultats effectivement exécutés sont consignés dans les rapports qualité.

Ces preuves Chromium et la revue des planches par Codex ne constituent pas un essai physique Android, iOS ou ENI, ni une validation artistique du propriétaire. La cible est un rendu de jeu stylisé, procédural et léger ; une appréciation de réalisme reste un jugement visuel. Aucun déploiement externe ni publication de configuration cloud n’est effectué par ce lot.
