# Fonds des 66 ajouts au catalogue — 17 novembre 2026

Le contrôle demandé porte sur les 66 images du commit `16f77c72`, après la publication des six trios fruits et menus dans `6c86ed77`.

| Périmètre | Résultat |
| --- | --- |
| 23 fruits | 20 fonds corrigés, trois conservés |
| 19 légumes | Douze fonds corrigés, sept conservés |
| Deux ustensiles | Deux fonds corrigés |
| 22 scènes d’action | Décors peints de cuisine ou salle de bains conservés |
| Total | 66 fichiers contrôlés, 34 remplacements |

Les objets isolés sont comparés visuellement à `co834-boissons-dessinees.webp`, référence ivoire RGB [253, 242, 225] (`#FDF2E1`). Les 44 objets finaux ont une médiane du coin supérieur gauche 40 × 40 qui s’écarte d’au plus trois valeurs par canal de cette référence. Les ombres légères sont conservées. Les scènes gardent un décor approprié à l’action ; la mesure d’un coin contenant une plante ou une fenêtre n’est pas utilisée pour leur imposer un fond uni.

Les 34 corrections sont produites avec l’image initiale et la référence réelle jointes. Le contrôle final compare les sujets, feuilles, coupes, couleurs et compositions avant/après, puis les fonds côte à côte. Une première reprise du jacquier, encore trop jaune, est écartée et remplacée. Il y a donc 35 générations pour 34 remplacements retenus.

Les chemins existants sont conservés. Les PNG natifs produits restent dans l’espace de travail et sont publiés aux adresses WebP existantes avec un encodage sans perte et sans redimensionnement. Les pixels RGB décodés du WebP sont identiques à ceux du PNG généré, vérification effectuée pour chaque remplacement. Aucun recoloriage local n’est appliqué aux pixels. Les empreintes avant/après, la provenance native, les mesures, prompts et décisions sont dans le [registre individuel](correction-fonds-ajouts-20261117.json).

Quatre titres et leurs mots-clés sont corrigés d’après les images visibles : « Servir une soupe avec une louche », « Servir une soupe dans un bol », « Couper un concombre sur une planche » et « Chou-rave vert et une tranche ». Les noms physiques antérieurs restent identiques pour les références déjà enregistrées.

Le catalogue garde **7 331 images**, avec **102 titres et listes de mots-clés révisés visuellement**. Le contrôle des fonds ne clôt pas l’audit des autres images : **3 675 images TCF attendent leur revue des mots-clés**, et 3 554 autres entrées sont au statut `not_started`.

Les banques de questions et fichiers audio sont conservés. Le suivi TCF reste à **261 trios historiques à préparer** et **380 candidats DELF Actif**. La nouvelle [tâche de contrôle des objets et véhicules effectivement sélectionnés dans les QCM](../tcf/controle-objets-fond-ivoire-20261117.md) reste à inventorier ; elle est distincte de ce contrôle du dernier ajout au catalogue. Le [bilan du cahier des charges](../tcf/bilan-cahier-des-charges-20261111.md#à-terminer-dans-lordre) conserve les autres chantiers.

Les 22 tests des catalogues passent. Le navigateur charge les 34 fichiers corrigés avec vérification de leurs empreintes et dimensions, puis contrôle six aperçus sur ordinateur et mobile, sans erreur. Les preuves de cohérence des fichiers, des références et de l’affichage sont dans la [vérification de ce lot](verification-fonds-ajouts-20261117.json) et le [relevé navigateur](fonds-ajouts-20261117-browser.json).
