# Questions de reconnaissance d’objet — contrôle à faire

Demande du 17 novembre 2026. **Statut : à faire ; aucune revue générale déclarée terminée.**

Revoir les questions CE et CO qui demandent de reconnaître un objet ou un moyen de transport en image. Pour « en voiture », « à vélo » ou un autre objet nommé, vérifier dans la source et la question que l’on attend bien la reconnaissance de cet objet : l’image sélectionnée doit alors montrer la voiture, le vélo ou l’objet correspondant, dans le style peint TCF sur fond ivoire validé. Une scène générique contenant une personne ne suffit pas.

Pour chaque trio concerné :

1. Relire la source entière, la question et les trois choix. Distinguer la reconnaissance de l’objet d’une action, d’un lieu ou d’une situation qui nécessite un décor.
2. Examiner les trois fichiers réellement sélectionnés, y compris les distracteurs. Vérifier le bon objet, le nombre, les couleurs ou caractéristiques demandées, sans élément qui révèle la réponse.
3. Comparer le fond à `/lib/images/tcf/qcm-audit/co834-boissons-dessinees.webp`, référence ivoire RGB [253, 242, 225], et conserver le format paysage 4:3.
4. Réutiliser une illustration d’objet validée si elle convient exactement. Sinon, générer une correction dans le même style, la vérifier visuellement et remplacer la référence utilisée par la question.
5. Consigner la clé `exercice#question`, les chemins avant/après, les empreintes, la justification et le statut. Actualiser le catalogue, ses mots-clés visuels et le registre de revue correspondant.

| Périmètre | Statut | Résultat attendu |
| --- | --- | --- |
| Reconnaissance voiture / vélo / autres véhicules | À inventorier et contrôler | Le véhicule demandé, sur fond ivoire, lorsque la question vise sa reconnaissance |
| Autres objets nommés dans les réponses CE/CO | À inventorier et contrôler | L’objet exact et ses caractéristiques, sur fond ivoire |
| Questions exigeant une scène ou une action | À distinguer lors de la revue | Conserver une scène appropriée au sens de la question |

Le nombre de questions concernées reste à établir. Ce suivi est distinct des **261 trios historiques à créer**, des **380 candidats DELF Actif** et du contrôle des fonds des **66 images ajoutées au commit `16f77c72`** ; certains fichiers pourront appartenir à plusieurs de ces périmètres.

Le contrôle des fonds des 66 ajouts est désormais terminé : 34 remplacements, dix fonds d’objets conformes conservés et 22 décors de scènes conservés ([rapport](../gallery/correction-fonds-ajouts-20261117.md)). Cela ne constitue pas la revue des images effectivement sélectionnées dans les questions.
