# Essais techniques G2 — Dialogues et supports images

12 novembre 2026. Ces exemples testent les contrats absents des cinq premières notions pilotes. Ils sont conservés dans `tests/grammar/fixtures/contracts.json`, hors registre et hors menus ; ils ne valident aucun quota de banque. Relecture linguistique par l’assistant ; validation enseignante en attente.

## Dialogues fermés et jeux de rôle

La présentation de bloc `scenario-set` sélectionne des situations, avec le champ **Nombre de situations**. Un dialogue fermé possède des rôles, des intentions, des répliques et des questions liées par ID. Chaque réplique à compléter possède exactement un blanc et référence une seule question. Les réponses des enfants déclarent leur mécanique réelle : QCM de 2 à 6 choix ou lacune. Le bloc peut ainsi mélanger les deux sans toggle global trompeur.

Le jeu de rôle ouvert conserve les rôles, une amorce, la tâche, les relances, un modèle non exclusif et une grille. L’élève reçoit les informations nécessaires à l’échange et peut préparer des notes. Le corrigé reprend la situation, les rôles, le modèle et les critères ; il ne répète pas l’amorce et les relances pour laisser la place au modèle sur l’A4. La projection affiche les intentions et les relances. L’appréciation reste humaine, sans choix correct ou note automatique.

Le snapshot stocke chaque situation une fois et ses groupes `kind: situation`. Les dialogues fermés sont développés en support et questions à l’impression. Le support est repris sur les continuations. Les sauts par question utilisent les mêmes IDs stables que les lectures ; leur activation ne relance pas le tirage. Le réassemblage pour le mode libre supprime les répétitions de supports sans écraser les questions. Au tableau, `source.scenarioId` relie chaque réponse à son contexte ; l’ordre papier des propositions est conservé.

Les deux dialogues fermés contiennent quatre questions, dont deux QCM et deux lacunes. Le jeu de rôle ouvert est une troisième situation, avec deux rôles et deux relances. Les imports refusent notamment un rôle absent, un blanc non relié, des questions dupliquées, un mélange de choix incohérent, un groupe forgé ou une partie d’impression enregistrée à la place de la situation canonique. Une banque de deux exemples est rejetée par le quota de 50 situations.

## Images intégrées

Les supports complètent une activité grammaticale : une même image existante est essayée avec QCM, lacune et production écrite. Aucun type autonome Image n’est ajouté. Les cinq essais A4 (deux contrats de situation et trois réalisations illustrées) donnent 16 réponses imprimées élève/corrigé. Ces réponses ne s’ajoutent pas aux compteurs de variantes de banques.

La référence porte un ID, un texte alternatif, des dimensions, une empreinte SHA-256 et la provenance : chemin d’origine, manifeste et justification du réemploi. Les chemins persistants pointent vers `/lib/images/grammaire/curriculum/sha256/<empreinte>.<extension>` (WebP, PNG ou JPG). L’original partagé est conservé. Une nouvelle image reçoit un nouveau chemin ; une correction éditoriale ne remplace jamais les octets d’une copie déjà référencée.

Le manifeste [media-supports.json](media-supports.json) décrit une copie binaire de l’illustration existante des cinq tomates, dont le manifeste d’origine indique `generated` et `visual_reviewed`. La copie n’est pas une génération d’image ; aucune licence tierce n’est inventée. Les fichiers source et copié ont la même empreinte. La galerie reprend le texte alternatif comme libellé et exclut les artefacts temporaires du dossier `work/`.

Avant affichage sur papier ou au tableau, le chargeur vérifie les octets puis fournit une URL de blob du contenu vérifié. Un fichier modifié, absent ou indécodable produit un diagnostic ; aucune autre image ne prend sa place. Le bouton d’impression attend la vérification et le décodage des copies imprimées, et refuse de lancer l’impression en cas d’échec. L’agrandissement au tableau utilise les mêmes octets vérifiés. Une fiche archivée reste lisible sans sa révision de banque, tant que ses fichiers versionnés sont conservés.

Les onze obligations illustrées du registre restent à compléter dans leurs activités hôtes. Cet essai ne déclare aucune banque de 50 situations illustrées prête ni aucune approbation enseignante.

## Vérification

- `npm run test:grammar:contracts` : groupes, liens, contrats fermés/ouverts, critères, absence de verdict libre, sauvegardes archivées, coupures, réassemblage, provenance et empreintes des fichiers.
- Vite sur le port 5183 puis `npm run test:grammar:contracts:browser` : import réel dans le générateur, fiche/corrigé A4, sauts réversibles, lancement en classe, agrandissement et erreurs médias simulées. Le test vérifie aussi une image retardée avant impression.
- Les tests de niveaux, G0, adaptateurs interactifs et parcours des banques existantes restent requis, car les rendus et la sérialisation sont partagés.

Les résultats datés sont consignés dans [verification.json](verification.json). Aucun audio, transcription ou contenu de théorie n’est modifié.
