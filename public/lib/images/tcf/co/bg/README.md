# Images des QCM CO et CE — TCF CSC et CFR

Décors en WebP, style BD semi-réaliste en couleur, une seule scène par fichier. Les lieux sont vides : aucun personnage, silhouette, reflet humain, portrait, logo ou bulle. Les scènes précédemment créées dans `../scenes/` restent indépendantes.

Les objets déjà disponibles dans `/lib/images/vocabulaire/` sont réutilisés. Les collections de tomates, œufs et DVD représentent des quantités concrètes et comptables, sans chiffre écrit. Les illustrations de personnes nécessaires aux choix de métiers sont dans `../personnes/` ; les cuisiniers et voyageurs existants sont réutilisés.

Une variante image n'est proposée que si **tous** les choix sont représentables par des images distinctes correspondant à leur sens entier. Un seul choix non illustrable conserve toute la question en texte. Les noms de personnes ou de domiciles privés, dates, jours, mois, numéros, montants et phrases abstraites restent en texte. Une affirmation telle que « le magasin est fermé le lundi » ne devient pas une image de magasin, ni une salle de français une personne portant un drapeau.

Les lieux connus par leur architecture, comme la tour Eiffel ou le Louvre, peuvent être illustrés ; cela ne rend pas illustrable le domicile d'une personne nommée. Les quantités d'objets sont distinguées des numéros et identifiants.

Correspondances explicites et briefs : [`scripts/tcf-qcm-image-registry.json`](../../../../../../scripts/tcf-qcm-image-registry.json). `manifest.json` suit les fichiers générés.

Depuis la racine du dépôt :

```sh
python3 scripts/tcf_qcm_images.py          # audit sans modifier les banques
python3 scripts/tcf_qcm_images.py --apply  # exige tous les fichiers avant écriture
python3 -m unittest discover -s scripts -p 'test_tcf_qcm_images.py'
node scripts/check-tcf-qcm-images.mjs
```

Les banques modifiées sont `a0-a1/{ce,co}.json` (CSC) et `a1-a2/{ce,co}.json` (CFR). Les textes, supports audio/écrits et bonnes réponses sont conservés. Les identifiants et positions des choix restent synchronisés entre Texte et Image, y compris après mélange et dans les cadres multi-audios.
