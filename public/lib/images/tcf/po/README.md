# Images de production orale TCF

Les images de PO sont rangées dans `a1/` (CSC, suites de quatre scènes) et `a2/` (CFR, scènes individuelles). Les noms de fichiers sont conservés. Les banques et l’exercice de présentation en grammaire utilisent ces nouveaux chemins. Le résolveur des médias redirige aussi les anciens chemins des fiches déjà enregistrées.

## Critères

Chaque nouvelle image est une illustration horizontale de grand format en BD semi-réaliste couleur : contours fins, lumière soignée, proportions et gestes crédibles, décor quotidien suisse sauf lieu différent demandé. Une seule scène, sans bulles, médaillon, montage, logo ni signature. La diversité des carnations, visages, cheveux, âges et vêtements est représentée naturellement, sans stéréotypes. Voir aussi les [critères communs](../co/scenes/CRITERES-ILLUSTRATIONS.md).

CSC : les personnages sont entièrement recréés. Les quatre étapes gardent leurs visages, vêtements, objets et décor ; seule l’action évolue selon le scénario. Les étapes suivantes prennent la première **nouvelle** image comme référence, jamais l’ancienne illustration.

CFR : les scènes sont entièrement recréées depuis leurs briefs pédagogiques, avec une nouvelle composition, un nouveau décor et des visages originaux. Il ne s’agit pas d’appliquer un style aux anciennes images.

## Avancement du 1er novembre 2026

Les **407 images ont été entièrement régénérées** et contrôlées pour leur contenu : 76 suites CSC (304 images), 99 scènes CFR, et les quatre images de présentation également utilisées en grammaire. Les noms sont conservés et tous les liens pointent vers `tcf/po/a1` ou `tcf/po/a2`. Les nouveaux personnages restent cohérents dans chaque suite.

Le contrôle du style a entraîné **14 corrections CFR**, avec la [référence BD du projet](../../comprehension/_style-ref-bd-realiste.webp) : contours dessinés visibles, couleurs et ombres illustrées, décors également dessinés, sans rendu photographique. La référence guide le style et ne fournit pas les identités des personnages.

**Quatre images identifiées restent à corriger pour le style** : `a1/billet-bus-automate-1.webp` à `a1/billet-bus-automate-4.webp`. Leurs personnages et leurs actions ont été recréés et restent cohérents ; leur rendu est encore trop photographique. La limite de génération bloque leur nouvelle correction jusqu’au **2 novembre 2026 vers 12:36, heure suisse**. Une tentative produisant un montage a été écartée et n’est utilisée par aucune fiche. Les quatre corrections devront être validées puis appliquées ensemble.

Le manifeste distingue l’état de génération (`counts`) et le suivi du style (`style_reviewed`, `style_revision`, `style_pending`). Les champs `original` sont historiques. Les descriptions ne mentionnent plus de médaillon téléphonique lorsque le nouvel appel est montré dans un seul décor. Les dialogues sont conservés.

## Vérification

```sh
# Fichiers, liens, empreintes, suites complètes et compatibilité des anciens chemins :
node scripts/check-tcf-po-images.mjs --complete
# À lancer après résolution de toutes les corrections de style identifiées :
node scripts/check-tcf-po-images.mjs --complete --style-complete
```

Le script `scripts/stage-tcf-po-image.py` permet de conserver et de relire des images préparées avant de publier des suites CSC complètes. Les corrections d’une suite déjà publiée doivent également être appliquées aux quatre scènes ensemble, en conservant les noms et les identités.
