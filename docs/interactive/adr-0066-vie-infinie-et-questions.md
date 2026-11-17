# Duels : 100, 200 ou vie infinie

Dans **Compétition → Préparer un duel** ou **Préparer les équipes**, le réglage **Vie** propose uniquement **100**, **200** et **∞ — Vie infinie**. Les nouvelles parties refusent les valeurs intermédiaires. À 200 points, les mascottes conservent leur forme adulte.

En vie infinie, **Nombre de questions par duel** permet de choisir un entier de 1 à 100, avec 10 par défaut. Par exemple, 10, 15 ou 20 questions. Le premier clic continue de résoudre la question : une bonne réponse donne exactement un point à son auteur, même en critique ×2, ×3 ou ×4. Une erreur ou un délai dépassé compte comme une question jouée, sans point pour aucun joueur. La vie ne diminue jamais.

Les attaques et les réactions restent animées. La vie est indiquée par ∞, accompagnée du nombre de bonnes réponses ; la progression affiche seulement la question courante et le total choisi. Aucun avertissement de coup fatal ne s’applique à la vie infinie. Les questions disponibles sont mélangées puis reprises si le total choisi dépasse le contenu du pool.

Après la dernière correction, le plus grand nombre de bonnes réponses remporte le duel. Une égalité donne un match nul, y compris si les deux scores valent zéro. Le résultat affiche les deux scores. Dans un tournoi par équipes, chaque paire dispose du même nombre de questions et repart de zéro ; l’équipe qui remporte le plus de duels gagne, comme dans le tournoi existant.

Les paramètres sont conservés sur l’appareil. Les journaux de version 5 reconstruisent les scores à partir des réponses acceptées : une action périmée ou un double clic ne peut pas ajouter un second point. La pause, la reprise, les expirations et l’arrêt volontaire conservent leurs protections. Un duel arrêté avant son terme n’attribue pas de victoire à la paire en cours.

Les anciennes parties des versions 2, 3 et 4 restent rejouées avec leurs paramètres d’origine, y compris leurs anciennes valeurs de vie. Pour une nouvelle partie, un ancien réglage inférieur ou égal à 100 devient 100 ; un ancien réglage supérieur à 100 devient 200. La lecture ne réécrit pas le journal d’une ancienne partie.

Les tests de domaine couvrent la validation, les scores, les erreurs, les délais, les égalités, les équipes, les attaques critiques, les pauses et les anciens journaux. Le parcours navigateur vérifie des parties de 10 et 15 questions, leur reprise après rechargement, le jeu hors connexion après préparation et la migration des paramètres. Le parcours de combat existant conserve les vérifications des 100/200 points, des animations ×4, des formes adultes, des dégâts et des K.-O.
