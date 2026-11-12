# ADR 0033 — Formes et propriétés du TCM CFR

Complément : l’[ADR 0034](adr-0034-triangles-reconnaissance.md) valide les dessins et active les triangles laissés en attente dans ce jalon.

Le jeu reprend les cartes `geoNameCard` des exercices `tcm-cfr-ex16` et `tcm-cfr-ex17`. L’exercice 17 produit une question de nom par carte. L’exercice 16 produit une question pour le nom et une question pour chacune de ses deux propriétés ; chaque partie conserve ses références source.

Sept figures simples sont relues dans ce contrat : carré, rectangle, losange, parallélogramme, cercle, trapèze isocèle non parallélogramme et pentagone. Les quatre premières apparaissent dans le tirage de propriétés ; les trois autres sont également acceptées dans des cartes librement choisies si les champs correspondent au contrat. Les sous-types de triangles restent signalés, car leur dessin demande encore une validation. Un tirage ordinaire de l’exercice 16 donne donc six micro-questions vérifiées pour deux cartes et un avertissement pour la troisième carte triangulaire. L’exercice 17 reprend ses trois noms.

| Figure | Première propriété | Deuxième propriété |
|---|---|---|
| Carré | Quatre côtés égaux | Quatre angles droits |
| Rectangle | Côtés opposés égaux | Quatre angles droits |
| Losange | Quatre côtés égaux | Angles opposés égaux |
| Parallélogramme | Côtés opposés parallèles | Côtés opposés égaux |
| Cercle | Points à égale distance du centre | Aucun côté |
| Trapèze | Une paire de côtés parallèles | Quatre côtés |
| Pentagone | Cinq côtés | Cinq sommets |

La conversion exige une carte nue, sans mesure ni autre calcul, le nom exact, les libellés et propriétés attendus dans leur ordre, et le corrigé complet correspondant. Une modification incohérente, une figure inconnue ou une propriété non relue est signalée. Les clés héritées d’un objet JavaScript ne peuvent pas devenir des figures. La question publique montre seulement le dessin nu : ni nom, ni propriété résolue, ni réponse cachée ne sont ajoutés au SVG.

Les choix sont déterministes, avec six cartes numériques ou six noms au maximum ; les relations textuelles emploient trois alternatives distinctes. Les réponses courtes correspondent à la question formulée, par exemple « côtés opposés » à « Quels côtés ont la même longueur ? ». Les modèles de correction gardent la propriété source complète. Le plafond de cartes et l’ordre numérique conservent la bonne réponse.

Les nouvelles parties changent les cartes choisies et les propositions, sans écrire sur le modèle enregistré. Le lien du générateur entre exercices 16 et 17 est conservé : le losange présent dans l’un correspond au parallélogramme dans l’autre. La classe reste collective ; le Solo corrige puis passe automatiquement à la suite ; les reprises conservent les figures et les clés. Le défi local reprend également ces cartes après chargement, hors ligne sur un appareil commun. Le contrat en ligne conserve le dessin public et retire la clé avant révélation.

Six nouveaux tests couvrent 600 configurations réelles (deux types, trois niveaux, cent graines), les sept cartes choisies librement, les données altérées, les options, les graines, les reprises et la compétition. Les huit tests de reconnaissance existants restent exécutés. Le [parcours navigateur étendu](recognition-results.json) vérifie trois tailles d’écran, les côtés opposés et angles droits du rectangle, le nom du pentagone, le Solo automatique et le défi local hors ligne. Les fiches et corrigés imprimés ne sont pas modifiés par cet adaptateur.

```sh
node --test tests/interactive/cfr-recognition.test.mjs
npm run test:interactive:recognition
```

Voir le [relevé qualité](quality-cfr-recognition-results.json) et le [contrat de reconnaissance précédent](adr-0032-reconnaissance-des-formes.md). La nouvelle narration des dictées CSC/CFR est reportée à la demande du propriétaire ; le [prompt des dix clips Denise](../tcm-csc/prompt-audios-denise.md) reste disponible.
