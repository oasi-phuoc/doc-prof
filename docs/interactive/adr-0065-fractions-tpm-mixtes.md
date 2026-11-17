# Fractions TPM : réduire et calculer

La série **TPM → Fractions (réduire et calculer)** rejoint les exercices sélectionnables du mode jeu. Elle reprend les six questions du générateur existant : réduction avec un terme manquant, réduction complète, addition, soustraction, multiplication et division. Les deux dernières utilisent au moins un numérateur négatif, comme la fiche source.

La quantité proposée par défaut est six, avec un choix de un à six éléments. Le générateur produit au maximum six questions : le réglage du pool respecte cette limite et refuse une quantité supérieure. La plage générique de nombres n’est pas proposée, car elle ne pilote pas les numérateurs et dénominateurs de cette série.

L’adaptateur utilise les étiquettes de la source pour identifier chaque sous-exercice, puis réutilise les vérifications rationnelles exactes des fractions d’algèbre. Il vérifie l’énoncé, l’opération, la réponse et sa simplification, sans exécuter d’expression. Une étiquette absente ou ambiguë, un opérateur contradictoire, un dénominateur nul ou un corrigé incohérent produit une raison d’exclusion explicite.

Les six cartes ont des valeurs mathématiques distinctes. Les réponses entières, nulles ou négatives sont conservées ; le tri compare les valeurs exactement. Les fractions restent verticales et les marqueurs de résultat vide ne sont pas projetés. La correction reste dans la carte colorée, avec les autres cartes grisées.

Classe conserve la révélation enseignante. Solo conserve les réponses immédiates, le délai facultatif et l’avancement automatique. Les compétitions et duels réutilisent les mêmes cartes et les mêmes corrigés. La reprise garde le tirage ; une nouvelle partie renouvelle sa graine. Les modèles, les générateurs et l’impression des fiches ne sont pas modifiés.

Les tests de domaine vérifient 900 configurations générées, les réductions, les quatre opérations et les signes par calculs indépendants, les choix distincts, les limites de quantité, les erreurs de source, les nouvelles parties et la confidentialité du corrigé des salles. Le parcours navigateur couvre la série complète en Classe sur trois tailles d’écran, le jeu hors connexion après préparation, la reprise, le Solo et le duel.

Les expressions TPM à plusieurs opérations, puissances et priorités demandent encore leurs propres adaptateurs. Aucun serveur de production n’est déployé par ce lot.
