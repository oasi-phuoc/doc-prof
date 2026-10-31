# Images de production orale TCF

Les images de PO sont rangées dans `a1/` (CSC, suites de quatre scènes) et `a2/` (CFR, scènes individuelles). Les noms de fichiers sont conservés. Les banques et l’exercice de présentation en grammaire utilisent ces nouveaux chemins. Le résolveur des médias redirige aussi les anciens chemins des fiches déjà enregistrées.

## Critères

Chaque nouvelle image est une illustration horizontale de grand format en BD semi-réaliste couleur : contours fins, lumière soignée, proportions et gestes crédibles, décor quotidien suisse sauf lieu différent demandé. Une seule scène, sans bulles, médaillon, montage, logo ni signature. La diversité des carnations, visages, cheveux, âges et vêtements est représentée naturellement, sans stéréotypes. Voir aussi les [critères communs](../co/scenes/CRITERES-ILLUSTRATIONS.md).

CSC : les personnages sont entièrement recréés. Les quatre étapes gardent leurs visages, vêtements, objets et décor ; seule l’action évolue selon le scénario. Les étapes suivantes prennent la première **nouvelle** image comme référence, jamais l’ancienne illustration.

CFR : les scènes sont entièrement recréées depuis leurs briefs pédagogiques, avec une nouvelle composition, un nouveau décor et des visages originaux. Il ne s’agit pas d’appliquer un style aux anciennes images.

## Avancement du 31 octobre 2026

La limite de génération a interrompu le travail ; l’outil annonce sa réinitialisation le **1er novembre 2026 à 11:32 UTC**.

- **42 nouvelles images publiées** : 6 suites CSC complètes (24 images) et 18 scènes CFR.
- **50 nouvelles images préparées** dans `pending/a1/`, conservées pour terminer leurs suites.
- **315 images restent à générer**.
- Les **407 fichiers actifs** ont été déplacés. Cela comprend les 403 images de PO CSC/CFR et les quatre images de présentation également utilisées en grammaire.

Une suite CSC incomplète conserve ses quatre anciennes images déplacées : aucun mélange d’anciens et de nouveaux personnages dans une même histoire. Le dossier `pending/` contient uniquement les nouvelles images préparées ; aucune fiche ne le référence.

[`illustrations-manifest.json`](illustrations-manifest.json) contient les briefs, le casting de chaque suite, les actions, les chemins et les empreintes. `generated` indique une nouvelle image publiée ; `prepared` une nouvelle image conservée en attente de sa suite ; `pending` une image encore à générer. Les champs `original` sont historiques. Les descriptions des scènes redessinées sans médaillon téléphonique ont été ajustées ; les dialogues restent identiques.

## Reprise et vérification

Générer d’abord les images manquantes des suites déjà commencées, notamment `a-la-boulangerie-4.webp` (`a1-04-4`) et `au-commissariat-4.webp` (`a1-11-4`) : leurs trois premières images sont déjà préparées. Inspecter leur première nouvelle image avant de l’utiliser comme référence. Après une génération :

```sh
python3 scripts/stage-tcf-po-image.py stage CLE /chemin/image-generee.png
# Après contrôle visuel de la nouvelle image :
python3 scripts/stage-tcf-po-image.py review CLE
# Publie uniquement les scènes CFR prêtes et les suites CSC complètes et relues :
python3 scripts/stage-tcf-po-image.py publish
node scripts/check-tcf-po-images.mjs
# Vérification stricte lorsque les 407 images auront été régénérées :
node scripts/check-tcf-po-images.mjs --complete
```
