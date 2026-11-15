# ADR 0055 — Transparence et énergie des mascottes

Les précisions du propriétaire après l’ADR 0054 demandent de supprimer les fonds blancs et les fragments dans les coins, de montrer la colère pendant les critiques même à faible vie, puis de restaurer la fatigue, et d’ajouter une enveloppe d’énergie animée dont la couleur suit l’attaque de chaque mascotte.

## Images et contours

Douze planches transparentes remplacent les six planches classiques, quatre planches étendues et deux planches de colère. Elles conservent les trente identités, les six poses et les indices existants. Leurs dimensions et empreintes sont consignées dans la [provenance](mascot-transparency-provenance.json). Les sorties RGBA du générateur d’images sont copiées sans retouche raster. Le fond blanc CSS des personnages est également supprimé ; les cadres de sélection restent des commandes visibles.

Les cinq planches de santé existantes restent inchangées. Un retrait uniforme ne suffit pas à enlever le fragment d’oreille signalé en haut à droite du Lapin très fatigué, dont le corps atteint lui-même le bord de la cellule. `scripts/mascot-combat-crops.mjs` lit l’alpha et génère un contour CSS par dessin, d’après sa composante corporelle principale. Les 120 masques excluent les fragments isolés tout en préservant le corps. La commande `npm run mascots:combat-masks` régénère uniquement les métadonnées TypeScript.

## Critiques et palette

La règle précédente « une aura n’annule jamais la fatigue » de l’ADR 0054 est remplacée par la demande explicite du propriétaire : victoire et KO restent prioritaires ; sinon un critique ×2 ou ×3 impose la pose énervée, y compris à 20 points et moins. La charge reste visible pendant la question et la scène d’attaque. À la fin de celle-ci, la pose revient au seuil de vie courant, même si le battement de correction continue.

L’enveloppe animée de flammes d’énergie est ajoutée aux particules de signature existantes. Ses deux couches, ses particules montantes et sa lueur suivent `signatureFor(mascot)` ; le ×3 emploie une teinte éclaircie de la même palette, une enveloppe plus grande et des éclairs. Eau bleue, feu orangé, végétaux verts : aucune couleur de critique universelle ne remplace la signature. Les aperçus et le jeu partagent ces composants. La préférence système de réduction des animations ne les désactive pas, conformément à la demande antérieure.

## Boucle de rendu

L’audit a trouvé qu’une adaptation de résolution pouvait programmer une image dans `measure()` et une seconde en fin de dessin. Le planificateur RAF fusionne maintenant les demandes d’animation, de redimensionnement et d’adaptation, y compris celles émises pendant le dessin. Un arrêt annule toute demande en attente. Les durées de scène, les dégâts, les probabilités et les journaux de partie ne changent pas.

## Vérification

Les [planches de revue](mascot-energy-proofs/index.html) montrent les trente personnages au repos, en ×2 à 40 points, en ×3 à 20 points, puis après retour aux deux seuils de fatigue, sur des fonds sombres. Les [résultats](mascot-energy-results.json) portent sur les ressources et composants réels. Le parcours de cycle de vie joue des réponses depuis 100 points jusqu’à 20, puis les deux niveaux critiques ; il vérifie la colère pendant chaque scène, la restauration après celle-ci et les coins du Lapin. Les contrôles de palette et de transparence couvrent les trente identités. Les contrôles réellement exécutés figurent dans le [relevé qualité du lot](quality-mascot-energy-results.json).

Le [guide des salles](guide-competition.md#activation-par-ladministrateur) détaille l’activation Cloudflare et la variable Vercel. Cette modification ne déploie aucun service externe et ne publie aucune configuration cloud.
