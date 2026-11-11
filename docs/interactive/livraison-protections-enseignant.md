# Protections des commandes enseignant

En préparation du mode Classe, « Maintenir le bouton pour révéler » active un appui de 600 ms, avec anneau de progression. La préférence est conservée sur cet appareil ; elle est désactivée par défaut pour garder le clic simple existant. Le maintien fonctionne au pointeur et avec Entrée ou Espace. Un appui court, un geste annulé, une perte de focus ou un onglet masqué annulent le geste. Le raccourci Entrée n’agit que lorsque le focus se trouve dans les commandes de phase ; il ne contourne pas le maintien.

Le cadenas en pied de séance bloque les commandes enseignant, le passage de phase, les réglages, la navigation dans l’application et les interactions audio. Le déverrouillage et la sortie du plein écran restent accessibles. Le verrou est conservé après actualisation. Il ne remplace pas la pause : un décompte de réflexion déjà lancé continue en Classe, sans changement automatique de question.

Pendant dix secondes après révélation, la flèche « Masquer à nouveau » revient à la discussion et retire toute indication de bonne réponse des cartes. Les comptages, observations et activités précédentes sont conservés. La révélation retirée n’est plus comptée dans le bilan ; une nouvelle révélation la remplace sans doublon. Sur un écran à deux questions, les deux corrections sont retirées ensemble. Le délai ne repart pas de zéro après pause ou rechargement. Un événement arrivé sur une autre question ou après expiration est ignoré par le moteur.

« Passer » demande une confirmation en Classe. Le drapeau en pied permet de terminer plus tôt, également après confirmation. Le bouton Annuler est focalisé à l’ouverture ; Échap annule et restitue le focus. Pendant la confirmation, l’audio et le décompte de réflexion sont suspendus. Terminer ouvre le bilan : les activités corrigées restent conservées et celles sans correction sont marquées passées, sans résultat inventé.

En Solo, les choix, la correction et le passage automatique restent identiques. Les protections enseignant ne sont pas affichées, même si la préférence de maintien a été enregistrée.

Validation : 78 tests de domaine, parcours Classe, protections au toucher/pointeur/clavier, mobile, reprise, concurrence entre onglets, compactage et conservation locale. Les [résultats dédiés](teacher-protections-results.json) couvrent 360 × 640, 390 × 700 et 1366 × 768. Voir [mobile](screenshots/teacher-protections-360.png) et [ordinateur](screenshots/teacher-protections-1366.png). Les essais sur ENI réel restent à effectuer.
