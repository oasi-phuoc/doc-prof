# ADR 0047 — Oral guidé et remise en ordre par glisser-déposer

Ce lot termine la recette logicielle M14-lite de F31 et applique la demande du propriétaire : des zones numérotées pour déplacer les mots et les images au doigt ou à la souris. Les flèches visibles des images sont retirées. Les commandes clavier et le déplacement par deux pressions restent disponibles.

## Images, rôles et modèles

L’adaptateur accepte explicitement une à quatre images, sans suppression silencieuse. Les 175 activités illustrées des banques PO CSC et CFR conservent leurs images, questions, lieu, rôles et objectif. Une scène de quatre images propose un récit et la consigne source complète reste consultable. Les scènes sans image ne sont pas assimilées à ce contrat. Les sources invalides ou trop longues sont signalées ; aucun modèle n’est inventé pour remplacer un exemple absent.

La narration et toutes les répliques du dialogue source restent dans le corrigé privé. Les rôles et relances sont publics, séparés des exemples. En Classe, le modèle apparaît après révélation par l’enseignant. **Lire le modèle** ouvre le texte complet et les images ; Échap referme la lecture et rend le focus au bouton. En Solo, cette lecture suspend le battement automatique et le reprend à la fermeture. La feuille enseignant conserve aussi l’exemple complet et les rôles.

Les relances se révèlent une à une. Leur historique est défilable ; sur mobile il partage la ligne de la mascotte pour conserver l’espace des images. Les quatre zones, les commandes et le bouton d’annulation tiennent sur 360 × 640 lorsque la situation détaillée est refermée. Les images s’agrandissent individuellement.

## Déplacement dans les zones

Un glissement affiche une copie de l’élément sous le doigt ou la souris et souligne la zone visée. Le dépôt insère l’élément à cette position, en décalant les autres. Aucune modification n’est enregistrée pendant le mouvement : un dépôt hors des zones, Échap ou une interruption tactile annule le geste. Les éléments identiques restent distingués par leur position source.

Le même comportement sert aux phrases courtes et aux images. Deux pressions successives permettent aussi de choisir un élément puis sa destination. Les flèches gauche et droite du clavier déplacent l’élément ciblé ; son focus suit le déplacement. **Annuler le déplacement** restaure l’ordre précédent dans l’écran ouvert. La manipulation est désactivée avec le verrou enseignant et après révélation.

Les dépôts utilisent l’action de séance existante `IMAGE_ORDER_SET`. Ordre, relances et appréciations restent conservés à la navigation, après rechargement et dans les instantanés ; le geste en cours et son annulation locale ne sont pas persistés. Ni le modèle privé ni les adresses temporaires des fichiers préchargés ne sont ajoutés au journal. Les anciennes séances dont le plan oral change doivent être relancées selon la protection d’obsolescence existante ; aucune migration silencieuse n’est effectuée.

## Périmètre et recette

L’oral et l’ordre des scènes restent appréciés par l’enseignant, sans verdict automatique ni question de prédiction fabriquée. Les rangs numériques et alphabétiques proposés en QCM gardent leur mécanisme de choix. M14 complète avec annotation et M07 avec ordre automatiquement évalué restent ouverts. Le mode Classe reste collectif, sans sélection obligatoire d’un élève au tableau.

Les preuves du lot sont dans [guided-oral-results.json](guided-oral-results.json), [ordering-results.json](ordering-results.json) et [quality-guided-oral-results.json](quality-guided-oral-results.json). Elles distinguent les contrôles exécutés des parcours disponibles. Le préchargement reste en mémoire dans la page ouverte ; l’ouverture à froid hors ligne et le pilote ENI réel restent à réaliser.
