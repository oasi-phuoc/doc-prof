# Formats CO et corrigés CE

L’aperçu du générateur affiche de nouveau les trois icônes **Texte**, **Image** et **Phrase** pour les questions de compréhension orale des tests TCF CSC, TCF CFR et TPF. Les tests assemblés possèdent un exercice personnalisé pour conserver leur tirage : ce stockage ne masque plus les commandes de format. Les cadres partageant un audio proposent les boutons pour chacune de leurs questions.

Le changement de format conserve les questions, leurs variantes, les points et les enregistrements. Une variante absente de la banque reste visible mais désactivée ; le générateur ne fabrique pas de choix d’images.

Les bonnes réponses des QCM CE portent une coche tracée dans leur case. Elle reste imprimable lorsque les arrière-plans sont désactivés, contrairement à l’ancien remplissage par une couleur de fond. La fiche élève conserve ses cases vides et le corrigé conserve exactement le même ordre de réponses.

Le parcours `npm run test:tcf:formats` vérifie 51 questions CO dans les trois niveaux et les QCM CE de CSC et CFR, à l’écran et en média d’impression. Le niveau A2–B1 ne possède pas d’entrée CE dans la banque actuelle. Le parcours est intégré à la CI commune.

- [Résultats navigateur](formats-results.json).
- [PDF élève et corrigé sans arrière-plans](corriges-ce-sans-arriere-plan.pdf), avec trois questions d’un document CE.
- Captures des [boutons CO](screenshots/co-formats.png), des [cadres à plusieurs questions](screenshots/co-cadres.png) et du [corrigé CE](screenshots/ce-corrige.png).
