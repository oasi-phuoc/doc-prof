# ADR 0008 — Verrou enseignant et rétractation de correction

Le schéma de séance 3 ajoute au moteur le verrou des commandes, l’instant de révélation injecté par le contrôleur et le nombre de rétractations par question. Le reducer reste sans lecture d’horloge : `transition` reçoit le temps de l’événement en quatrième argument ; la reprise utilise le même `at` du journal. Une rétractation exige le mode Classe, la phase révélée, un écran identique, une séance non suspendue et non verrouillée, et un délai strictement inférieur à dix secondes. Un doublon après la première rétractation n’a aucun effet.

La rétractation retire les tentatives courantes du bilan et remet l’écran en discussion. Les activités antérieures, comptages et marques restent conservés. Une nouvelle révélation ne peut donc pas ajouter une seconde entrée de résultat pour la même question. Les rétractations de chaque question appariée sont comptées séparément. Les instantanés copient et valident ces champs, sans ajouter de texte de question ni de clé de réponse.

Les journaux et instantanés de schéma 1 et 2 restent lisibles, sans écriture à la lecture. Leurs événements de révélation datés permettent de retrouver le délai ; un ancien instantané sans date ne crée aucune nouvelle fenêtre d’annulation. La première écriture et tout compactage produisent le schéma 3. Les anciens moteurs refusent cette version au lieu d’ignorer un verrou ou une rétractation. Les versions supérieures restent conservées et refusées. La base physique reste en version 2 ; le nettoyage couvre maintenant les schémas de séance 1, 2 et 3.

Le verrou est vérifié dans le reducer, et non seulement par les boutons désactivés. `TEACHER_LOCK_SET` reste autorisé pour déverrouiller, y compris en pause. La sortie du plein écran agit sur l’affichage et reste disponible. Le maintien de 600 ms est une protection de geste dans le composant de révélation ; tout raccourci doit passer par cette commande quand la préférence est active.

`FINISH` conserve les résultats existants et complète uniquement les questions non traitées avec une marque « passée ». La confirmation reste une interaction de présentation ; le bilan est conservé dans le journal et compacté comme auparavant.

Tests : `teacher-protections.test.mjs`, `teacher-protections-browser.mjs`, `checkpoint.test.mjs`, `checkpoint-browser.mjs`, `retention-browser.mjs` et suites Classe, reprise et concurrence. Les règles restantes de navigation par question et de nouvelle tentative font l’objet d’un incrément séparé.
