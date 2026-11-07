# Avancement TCF — 7 novembre 2026

Les lots visuels demandés et le nouveau tirage « objet » sont terminés et vérifiés localement. **Les 299 remplacements audio restent bloqués par les fichiers sources manquants. Aucun envoi sur `origin/main` n’a été effectué**, conformément à la demande d’envoi une fois le travail terminé.

Ce bilan reprend les critères de `style-images.md`, des illustrations CO et PO, et les dernières demandes utilisateur. Les anciens plans datés des 2–5 novembre restent des archives ; leurs compteurs ne décrivent plus la banque actuelle. Aucun pourcentage global n’est calculé à partir de périmètres différents.

| Demande | État vérifié | Reste |
|---|---|---|
| Quatre pictogrammes de communication | Téléphone avec combiné ; même téléphone avec bulle ; enveloppe ouverte avec @ ; même enveloppe avec feuille lignée. 85 usages corrigés. | 0 dans ce lot |
| PO : trois thèmes pour poser des questions | 15 thèmes dans chacun des deux niveaux ; 238 références remplacées par des illustrations thématiques validées. Anciens supports enregistrés redirigés. | 0 dans ce lot |
| Quatre images PO de l’automate de bus | Quatre étapes dessinées, personnages et accessoires cohérents ; manifeste PO complet : 407 images, aucune correction de style identifiée en attente. | 0 dans ce lot |
| 254 usages CE/CO, 150 fichiers | 98 fichiers conformes conservés à l’identique, 8 réutilisations validées, 44 reprises générées et inspectées. 60 occurrences remplacées. | 0 dans ce lot |
| Horloges | 120 horloges et 9 minuteurs : même cadran et aiguilles calculées ; durées rouges et unités vérifiées. | 0 dans l’inventaire dédié |
| Reconnaissance d’objets | Catalogue de 211 concepts illustrés ; **107 pistes sur 1 025** satisfont le seuil d’au moins trois objets distincts identifiés dans leur transcription. Tags cumulables, 3 OUI / 2 NON et cinq positions mélangées. | Enrichissement possible du lexique pour les noms non encore couverts |
| Remplacement audio | 726 références déjà installées, 299 restantes. Aucune des 299 n’a été remplacée sans les sources de contrôle. | 299 |

## Images et réponses : état de la banque actuelle

Les **5 393 usages d’images actifs CE/CO** sont rattachés à un fichier relu et vérifié par empreinte. Aucun ne pointe encore vers le dossier d’images du vocabulaire. Les fichiers originaux restent conservés, sauf l’harmonisation des cadrans expressément autorisée et les quatre corrections PO.

Par rapport au commit de référence `c8b5ea2f`, le registre dénombre 1 954 usages d’images remplacés, 369 ajoutés (123 variantes QCM complètes) et 42 retirés dans 14 variantes ambiguës. Les questions correspondantes restent disponibles en texte. Le lot de reprise compte 517 fichiers relus, dont 506 utilisés par ces modifications ; 228 autres cibles déjà relues sont réutilisées. Ces nombres ne représentent pas autant de générations nouvelles dans cette seule session.

Les 1 721 variantes QCM image actives conservent trois propositions distinctes et les mêmes identifiants/corrigés que le texte. Les quatre distracteurs explicitement demandés ont été corrigés. Les 26 banques historiques de reconnaissance d’objets et leurs 130 images principales restent compatibles avec les fiches enregistrées. Le nouveau tirage est construit séparément à partir de la piste choisie.

La revue contextuelle couvre **7 851 questions dans 1 009 supports** : 6 758 décisions antérieures conservées uniquement pour un contenu source/question identique, et 1 093 questions revues sur leur source active. Aucun support CE ni pool CO n’est sous le minimum structurel actuellement demandé. Cette relecture des textes/transcriptions ne constitue pas une écoute humaine de tous les audios.

## Ce qui reste à faire selon les critères et la couverture demandée

1. **Retrouver les sources audio et finaliser les 299 références.** Le dossier `/workspace/work` a disparu avec les originaux extraits et les découpes candidates. Les six anciennes références d’archives téléversées ont été essayées : aucune n’est actuellement autorisée/résoluble. Les fichiers audio servis sont présents, mais aucun des 299 n’a l’empreinte du candidat préparé attendu. Les sources ou les candidats vérifiables doivent être fournis à un emplacement accessible avant reprise des coupes, contrôles et installations. Les registres conservent 151 décisions éditoriales ; 148 références demandent encore leur décision. Les motifs techniques peuvent se cumuler, notamment 110 contrôles de frontière de source. Ne pas remplacer ces sources par de la parole synthétique.
2. **Étendre les variantes image aux autres questions concrètes encore textuelles.** L’inventaire actuel signale 763 trios candidats à préparer ou revoir, en commençant par réutiliser la banque. Ce n’est pas un nombre ferme d’images nouvelles : il faut contrôler le sens entier des trois choix et leur distinction avant activation. Ce travail est distinct de la revue des 254 usages existants, maintenant clôturée.
3. **Trier 3 612 autres questions textuelles sur le plan visuel.** Ce compteur automatique recouvre des situations concrètes et des notions abstraites ; il ne signifie pas 3 612 images à générer. Les 545 questions de personne/rôle/diagnostic, 428 de montant/mesure/taux et 782 de calendrier/identité/langue restent classées séparément. Garder les réponses en texte lorsqu’une image ne permet pas de les prouver, notamment les montants, dates, jours et mois.
4. **Compléter la CE A2-B1 si la couverture des trois niveaux TPF est attendue.** La banque actuelle ne contient aucun support CE dans ce niveau. Les niveaux TCF CSC et CFR sont présents.
5. **Après reprise des audios, refaire les contrôles contextuels et le calcul des tags.** Le tag « objet » dépend de la transcription exacte de chaque piste ; les mots ambigus ou non couverts ne sont pas comptés automatiquement. Le catalogue peut être enrichi avec des synonymes et des images validées. Une piste nommant seulement deux concepts admissibles reste exclue. Les petites horloges accessoires des scènes ne font pas partie de l’inventaire des 129 cadrans dédiés.
6. **Publication finale.** Reprendre les éventuels changements récents de `origin/main`, vérifier l’ensemble, puis pousser sans force quand le travail demandé est terminé. La migration des fiches déjà enregistrées dans D1 n’est pas attestée par ce travail et nécessite l’accès serveur approprié.

## Contrôles réalisés

Compilation TypeScript et build Vite réussis. Contrôles réussis : 1 009 exercices / 1 025 pistes, 7 851 liaisons question/source, 1 721 variantes QCM et 12 régressions de mélange, 407 illustrations PO et anciens chemins, 15 thèmes PO et 64 tirages, 129 cadrans et quatre tests géométriques, dix tests de correspondance QCM et sept de réutilisation sémantique. Le tirage objet est vérifié pour chaque piste éligible : cinq images distinctes, trois vraies, deux fausses, exclusion de tous les concepts nommés des distracteurs, source de la bonne piste, stabilité du corrigé, reproductibilité avec la même graine et variation réelle des positions sur 64 graines. Aucun remplacement des 299 audios n’est déclaré validé.

Le build signale toujours un paquet JavaScript volumineux ; il réussit. L’optimisation de ce paquet ne fait pas partie de ce lot.

## Registres de référence

- `communication-pictogrammes-20261107.json` et `po-trois-themes-images-20261107.json` ;
- `po-corrections-style-20261107.json` et le manifeste PO ;
- `revue-254-usages-20261107.json`, `images-generees.json`, `reprise-images-20261106.json` ;
- `audit-contextuel-20261106.json`, `operations-contexte-20261106.json`, `images-restantes-contextuelles-20261106.json` ;
- `objets-tirage-20261107.json` et `horloges-aiguilles-uniformes-20261106.json` ;
- `remplacement-audio/bascule-restant-20261105.json` et les preuves de reconnaissance associées.
