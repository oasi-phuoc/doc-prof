# ADR 0024 — Nombres et calculs en plusieurs extraits audio

Les dictées de nombres et calculs oraux des exercices 1 et 2 de TCM CSC et TCM CFR sont converties en choix numériques. Le convertisseur compare tous les extraits au lexique du générateur, vérifie les opérandes et recalcule le corrigé. Un extrait manquant, permuté ou incohérent produit un motif d’incompatibilité. Le lexique de 0 à 1 000 est vérifié ; les données libres gardent leurs valeurs validées.

Les extraits ordonnés sont conservés dans `Question.audioParts` et `Round.audioParts`. Chaque dictée garde sa propre question : un préfixe commun, par exemple « deux cent », ne fusionne pas 201 et 202. Une dictée répétée reste aussi un écran indépendant. Les autres questions partageant un enregistrement gardent leur groupement existant.

Avant lecture, les extraits sont décodés dans un même contexte et assemblés en un WAV temporaire. La durée et la barre de lecture couvrent tout le nombre ou calcul. Un démarrage consomme une écoute, pause et reprise ne la doublent pas, le quota et les autorisations supplémentaires survivent au rechargement. Les opérandes ne sont pas affichés dans la consigne projetée. Classe et Solo conservent leurs règles de minuteur et de correction.

Le précontrôle inspecte chaque extrait, avec ses questions concernées. Une erreur empêche toute lecture partielle et propose une nouvelle tentative. L’assemblage est annulable, limité à douze extraits, 32 Mio et 120 secondes décodées ; l’interface signale un échec après huit secondes. Les contextes sont fermés et les URL temporaires sont révoquées après changement ou sortie. Les plans enregistrés conservent les adresses source, jamais ces URL temporaires.

Les salles transmettent la liste ordonnée, bornée et contrôlée par origine. Le défi local précharge chacun de ces extraits : la composition fonctionne ensuite sans réseau sur l’appareil préparé. Cela ne fournit pas un démarrage à froid hors ligne ni une synchronisation d’appareils séparés sans réseau.

Onze tests de domaine couvrent 100 graines des deux tests, le lexique complet, les incohérences, les préfixes et répétitions, la composition PCM en stéréo, les limites, l’annulation et le contrat des salles. Les exemples WAV vérifient l’ordre des échantillons et les répétitions, au-delà d’un simple contrôle de taille.

Le [parcours navigateur](audio-sequences-results.json) vérifie sur mobile et ordinateur les vrais MP3 de nombres, addition et multiplication, la durée composée, pause/reprise, quotas, autorisation, rechargement, correction Solo et question suivante automatique. Il contrôle aussi un extrait final absent, un changement de question pendant le chargement et quatre enregistrements d’un défi local avec le réseau désactivé. Axe ne détecte pas de violation sur les vues examinées.

```sh
node --test tests/interactive/audio-sequences.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:audio-sequences
```
