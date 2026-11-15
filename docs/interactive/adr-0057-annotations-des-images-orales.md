# ADR 0057 — Annoter les images des activités orales

Ce lot complète la manipulation d’images M14 : les activités orales et les scènes illustrées de une à quatre images disposent d’outils de dessin dans leur visionneuse. Les mots à remettre en ordre et les QCM ne sont pas transformés en activités d’annotation. Les modèles restent privés jusqu’à la révélation et l’appréciation reste humaine.

## Utilisation

Agrandir une image, puis choisir le stylo, le surligneur, le cadre ou l’ovale. Quatre couleurs sont proposées. Un tracé se fait au doigt, au stylet ou à la souris ; la main conserve le déplacement de l’image, notamment après zoom. **Annuler** enlève le dernier tracé de cette image et **Tout effacer** enlève ceux de cette image seulement. Les repères restent visibles sur les petites images après fermeture et suivent leur image si les scènes sont réordonnées.

Les boutons font au moins 44 pixels. Au clavier, choisir un outil, atteindre la zone de dessin par Tab, commencer avec Entrée, déplacer le repère avec les flèches, puis terminer avec Entrée. Maj accélère le déplacement. Échap annule un tracé inachevé ; sans tracé en cours, Échap ferme la visionneuse et rend le focus à son bouton d’ouverture. Une interruption tactile, une perte de focus, un changement de taille ou de zoom annule le geste inachevé.

Le temps de réflexion et le battement automatique Solo sont suspendus tant que la visionneuse annotable est ouverte, puis reprennent à la fermeture. L’audio et les commandes de la console enseignant sont aussi suspendus. Pause et verrou interdisent les modifications ; le verrou laisse l’image consultable. Les tracés restent modifiables après révélation pour expliquer la correction, sans changer le résultat de l’activité.

## Données et reprise

Chaque tracé contient uniquement un outil, une couleur et des points entiers dans le repère 0–1000 de l’image. Le rendu SVG suit l’image à toutes les tailles et au zoom. Les fichiers d’origine ne sont jamais modifiés. Il n’y a ni image raster copiée, ni adresse temporaire, ni texte de corrigé dans les données d’annotation.

Les actions `IMAGE_ANNOTATION_ADD`, `IMAGE_ANNOTATION_UNDO` et `IMAGE_ANNOTATION_CLEAR` passent par l’autorité et la sauvegarde existantes de la séance. Elles identifient la question, l’image, l’écran et la tentative. Le moteur refuse les écritures pendant la pause ou le verrou, les gestes d’un ancien écran ou d’une ancienne tentative, les images hors de l’activité et les données invalides. Chaque image accepte au plus 48 tracés de 160 points ; les gestes longs conservent leurs extrémités avec un échantillonnage borné.

Les tracés validés survivent à la navigation, au rechargement, à la reprise et aux instantanés compactés. Une nouvelle tentative repart sans annotation, comme pour l’ordre des scènes. Les gestes en cours ne sont pas enregistrés. Les anciens états sans annotation gardent leur format et leur empreinte de plan. Les évaluations, statistiques et charges de compétition ne reçoivent aucune clé ou notation nouvelle.

Les outils légers sont inclus dans les composants déjà chargés, avec les mêmes limites de taille de bundle. Cette décision évite qu’un premier agrandissement demande un module JavaScript absent après le préchargement et la coupure réseau. Les images utilisent les blobs déjà préparés. L’ouverture à froid hors ligne et la synchronisation distante des tracés restent hors de ce lot.

## Vérification

Les tests de domaine couvrent les bornes, la séparation entre images, la copie des points, les gardes, les tentatives, la relecture et les instantanés. Le parcours navigateur utilise les vraies banques PO et des événements tactiles CDP, souris et clavier. Il vérifie les quatre outils, l’annulation, le zoom, la reprise, le verrou, les minuteurs Solo et la poursuite après une erreur d’image. La [revue visuelle](annotation-proofs/index.html), les [résultats natifs](image-annotations-results.json) et le [relevé qualité](quality-image-annotations-results.json) consignent les contrôles exécutés ; les essais physiques ENI et téléphone restent à effectuer.
