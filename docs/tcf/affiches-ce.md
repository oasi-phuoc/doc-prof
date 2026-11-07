# Documents en image — CE TCF CSC

Le toggle **Texte / Image** garde le même exercice et le même barème. Les supports, questions et corrigés de la banque `a0-a1` sont adaptés au contexte suisse. Les références à Paris, à des villes et monuments français, aux numéros et sites français ont été remplacées par des références suisses cohérentes. Les montants utilisent tous la notation **CHF**, avec les mêmes valeurs numériques. Les matières ou langues comme « français » restent inchangées. Les distracteurs devenus identiques après localisation ont été corrigés. Le relevé figure dans `ce-swiss-localization.json` ; le script `scripts/localize-tcf-ce-switzerland.py` permet de reproduire la transformation sans toucher aux audios CO.

## Présentation et bouton Page

La fiche suit la présentation habituelle : **titre de l’exercice → consigne → image → questions**. Par défaut, les questions commencent sur la feuille suivante. La coupure fonctionne comme le bouton **Page** de la première question : un clic l’annule, un autre la rétablit. Les autres sauts manuels restent possibles. L’en-tête institutionnel est omis sur la feuille dédiée au document ; le titre d’exercice, sa consigne et le pied de page restent présents. Une image horizontale utilise une feuille paysage ; les questions suivantes restent en portrait. L’image garde ses proportions et n’est pas découpée.

Les questions d’association conservent leur tableau des personnes sur une feuille de réponses et leur barème. La coupure peut également être annulée pour rapprocher ce tableau du document.

## Police et illustrations

**URW Gothic**, une police géométrique proche de Century Gothic, est utilisée uniquement dans les images CE. Les polices des titres, consignes, questions, corrigés et images CO ne changent pas. Le fichier et sa licence se trouvent dans `scripts/assets/ce-font/`. Les exports de messages embarquent ce fichier dans Chromium et enregistrent son empreinte dans le catalogue.

Toutes les affiches illustrées précédemment générées doivent être refaites avec les nouveaux textes suisses, la typographie lisible et des personnages différents d’un document à l’autre. La technique peinte chaleureuse validée est conservée ; les références graphiques ne doivent pas servir à copier les mêmes visages. Varier naturellement les carnations, âges, genres, coiffures, morphologies et situations de handicap, sans stéréotypes. Les profils de chaque document sont préparés dans `ce-art-prompts.json`.

Aucun surlignage, mot souligné, flèche ou indice ne doit désigner une réponse. Les activités illustrées gardent leur nom écrit. Les simples messages restent des images de téléphone, courriel ou lettre contenant le texte exact, sans illustration explicative supplémentaire.

Les genres sont enregistrés dans `src/tcf/content/ce-document-formats.json`. Les choix nommés par l’utilisateur ont priorité sur le type technique du support. Les documents **S’informer** sont purement informatifs, sans slogans publicitaires ajoutés. Portrait ou paysage sont autorisés pour tous les genres, selon la composition ; les cartes postales peuvent notamment être en paysage.

## Catalogue et avancement

Les correspondances ont été réexportées en URW Gothic avec les textes suisses. Les documents illustrés sont intégrés progressivement dans l’ordre demandé après génération et contrôle visuel. Le détail et les éventuels blocages figurent dans `ce-art-status.json`. Les anciennes propositions sont conservées dans `ce-art-candidates/`, hors de la banque active. Elles ne doivent pas être réactivées sans reprise et contrôle.

Le catalogue actif `src/tcf/content/ce-art.json` contient uniquement les images disponibles pour le texte et le format actuels. Modifier le texte ou le genre invalide l’ancienne image : la fiche utilise alors le texte mis à jour. Les anciennes compositions HTML avec de petites illustrations ne sont plus utilisées.

La génération suit l’ordre des titres demandé : Lire des instructions, S’orienter dans le temps, S’orienter dans l’espace, S’informer, puis reprises CO. Si le service atteint une limite (`usage_limit_reached`), consigner le blocage dans le suivi et reprendre les documents en attente à partir de `ce-art-prompts.json`. Avant activation : vérifier le texte, chaque nombre et montant CHF, les lieux suisses, le genre demandé, la police, les noms d’activités, l’absence de surlignage, la lisibilité et la diversité des visages. L’OCR seul ne suffit pas à valider une image.

## Scripts de vérification

Chromium, ImageMagick et Playwright sont nécessaires pour les exports et tests de navigateur.

```sh
node scripts/generate-ce-messages.mjs /chemin/vers/playwright/index.mjs
node scripts/generate-ce-messages.mjs /chemin/vers/playwright/index.mjs --verify
node scripts/check-tcf-formats.mjs
node scripts/check-ce-page-layout.mjs /chemin/vers/playwright/index.mjs
node scripts/check-ce-page-toggle.mjs /chemin/vers/playwright/index.mjs
```

Le script d’export conserve les messages dont le texte, le genre et la police correspondent déjà. Un ou plusieurs identifiants peuvent suivre le chemin de Playwright pour cibler des messages. La vérification compare le texte caractère par caractère et contrôle son emplacement sur le support.

Pour les CO TCF, `co-character-refresh.json` prépare séparément la reprise des quatre anciennes scènes de bibliothèque et des six situations de « Les achats » avec des personnages distincts. Les objets, couleurs pertinentes, situations et audios restent cohérents avec les supports. La demande de police concerne uniquement les images CE.
