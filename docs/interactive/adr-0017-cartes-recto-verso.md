# ADR 0017 — Cartes recto verso

Le propriétaire demande des cartes de même couleur sur leurs deux faces et le retrait du texte « CLAIRFLE · carte réponse · palette ». Chaque jeu produit désormais deux pages consécutives : recto puis verso. Les six carrés de 88 mm restent en deux colonnes et trois lignes, centrés sur une page A4 portrait. Les deux faces portent la même lettre, forme et couleur personnalisée, sans légende.

Le réglage par défaut correspond à un retournement sur bord long : les colonnes sont inversées au verso. Le bord court inverse les lignes. Seules les positions changent ; les lettres et dessins restent lisibles. Les motifs d’économie d’encre sont liés à l’identité A–F, et non à la position de la carte dans la grille, pour rester identiques sur les deux faces.

Le navigateur ne peut pas activer le duplex de l’imprimante. L’outil indique de choisir le même bord dans la fenêtre d’impression, A4 à 100 %, avec couleurs ou arrière-plans, sans en-têtes ni pieds de page. L’alignement mécanique de l’imprimante se vérifie sur une feuille d’essai.

`duplex-browser.mjs` vérifie huit combinaisons : deux bords, couleur ou économie d’encre et un ou deux jeux. Pour chaque carte, il compare la géométrie réfléchie, le carré de 88 mm, la couleur, la forme, le motif, l’absence de légende et le nombre réel de pages PDF. Deux jeux donnent quatre pages, donc deux feuilles physiques et douze cartes. Résultats : [duplex-results.json](duplex-results.json) et [PDF exemple](screenshots/cartes-recto-verso-a4.pdf). Les parcours existants d’impression sont actualisés.
