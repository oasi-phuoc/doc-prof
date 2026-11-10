# ADR 0005 — Polices locales et chiffres tabulaires

Les deux imports Google Fonts globaux sont remplacés par les mêmes familles locales, DM Sans et Fraunces, sous licence SIL OFL 1.1. Les originaux proviennent d’un commit figé du dépôt officiel ; les licences et empreintes sont incluses dans `public/fonts/interface/`.

DM Sans ne fournit pas de substitution OpenType `tnum`, et les deux familles existantes ne possèdent pas U+202F. Un sous-ensemble d’Inter fournit donc uniquement les chiffres, espaces insécables et signes mathématiques du jeu. La propriété `unicode-range` conserve DM Sans pour les lettres. Les pages imprimables ne prennent pas ce complément numérique. Cette décision évite de remplacer la famille principale du produit pour obtenir un minuteur stable.

FontTools 4.61.1 et Brotli 1.2.0 sont des outils de fabrication facultatifs, sans dépendance JavaScript ou Python à installer pour construire ou utiliser le site. Le script vérifie les sources et produit les WOFF2 de façon reproductible. Le budget de 150 Kio s’applique à l’ensemble des trois fichiers.

La racine HTML passe en français ; le jeu utilise les chiffres tabulaires et une pile de repli système. Les mouvements des mascottes restent conformes aux demandes explicites du propriétaire.

Validation : empreintes, licences et budget dans `fonts.test.mjs` ; chargement réel sans HTTPS externe, égalité des largeurs de `0000` et `8888`, espace fine et cartes mobiles dans `fonts-browser.mjs`. La comparaison A4 sert à la référence les mêmes fichiers de polices que la nouvelle version, par interception de la réponse CSS Google : elle isole le changement d’origine des polices. Elle ne prétend pas comparer deux versions différentes des fontes distribuées à des dates différentes par Google. Aucun style de fiche A4 n’est changé.
