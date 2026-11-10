# Polices locales

Sources Google Fonts figées au commit `5bb28733cec313b63fbd415b574b5ae35c8aa8b8`, licence SIL Open Font License 1.1 conservée pour chaque famille. Le manifeste indique les SHA-256 des originaux et des WOFF2, leurs tailles et les axes conservés. Aucune requête vers un service de polices n’est nécessaire.

- DM Sans : texte de l’interface, poids variables 400–700, axe optique fixé à 9.
- Fraunces : titres décoratifs déjà présents dans le site, poids 500–600 et axe optique conservé.
- Inter : sous-ensemble numérique du jeu, poids 400–700, chiffres tabulaires, espaces insécables et signes mathématiques. DM Sans n’a pas de fonction OpenType `tnum` ; ce complément garde le texte en DM Sans tout en stabilisant les chiffres. Il contient aussi U+202F, absent des deux autres sources.

Les WOFF2 couvrent le français et ses ligatures ; la famille numérique fournit U+00A0 et U+202F. Le total reste sous 150 Kio. Les styles du jeu utilisent les chiffres tabulaires et la pile de repli système. Les autres pages conservent leur famille principale.

Pour régénérer depuis la racine du dépôt (outils de fabrication uniquement, inutiles au build Node et au site) :

```sh
font_sources=$(mktemp -d /tmp/clairfle-font-sources.XXXXXX)
font_revision=5bb28733cec313b63fbd415b574b5ae35c8aa8b8
curl --fail --location "https://raw.githubusercontent.com/google/fonts/$font_revision/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf" --output "$font_sources/clairfle-dmsans.ttf"
curl --fail --location "https://raw.githubusercontent.com/google/fonts/$font_revision/ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf" --output "$font_sources/clairfle-fraunces.ttf"
curl --fail --location "https://raw.githubusercontent.com/google/fonts/$font_revision/ofl/inter/Inter%5Bopsz,wght%5D.ttf" --output "$font_sources/clairfle-inter.ttf"
for font_family in dmsans fraunces inter; do
  curl --fail --location "https://raw.githubusercontent.com/google/fonts/$font_revision/ofl/$font_family/OFL.txt" --output "$font_sources/clairfle-$font_family-OFL.txt"
done
python -m pip install --target /tmp/clairfle-font-tools fonttools==4.61.1 brotli==1.2.0
PYTHONPATH=/tmp/clairfle-font-tools python scripts/build-interface-fonts.py "$font_sources"
node --test tests/interactive/fonts.test.mjs
```

Le script vérifie les empreintes des sources et préserve les dates des tables pour rendre la sortie reproductible.
