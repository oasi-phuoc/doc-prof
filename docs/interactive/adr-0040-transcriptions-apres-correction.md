# ADR 0040 — Relecture des transcriptions après correction

Le réglage **Proposer la transcription après les réponses** apparaît dans la préparation des séances qui contiennent un texte d’écoute disponible. Il est activé par défaut et enregistré sur cet appareil. Les anciennes préférences restent acceptées ; le champ facultatif ne change pas la version de stockage. Les mises à jour concurrentes gardent les autres préférences.

## Sources et séparation des données

La conversion reprend uniquement `support.transcription` des exercices CO, rattaché au chemin de la piste effectivement jouée. Un tableau de transcriptions garde ses positions, y compris les cases vides. Un texte commun à plusieurs pistes ne permet pas de deviner leur découpage. Des versions contradictoires ou un texte manquant n’autorisent aucune reconstitution. Les anciennes références et leurs remplacements ne sont pas considérés comme interchangeables tant que la fiche joue encore l’ancienne piste.

Le texte reste dans `Correction.transcript`, séparé de la question projetée. Il n’est ni injecté dans le DOM avant lecture, ni ajouté aux données publiques de compétition. Les fiches CO éditées qui utilisent ce support bénéficient de la même conversion ; une banque audio sans questions convertibles ne devient pas jouable par ce seul ajout. Les textes existants sont repris tels quels : cela ne constitue pas une nouvelle validation humaine des enregistrements.

## Moment de la lecture

L’icône de livre près du lecteur devient accessible pendant la correction, une fois **toutes les questions du plan utilisant cet enregistrement** corrigées. Les chemins relatifs et absolus d’une même piste sont reconnus. Une question passée bloque l’accès ; les questions non sélectionnées et celles d’autres enregistrements ne le bloquent pas. Cette règle protège notamment la deuxième question Solo portant sur la même écoute.

La fenêtre de lecture conserve les paragraphes, accepte Échap et rend le focus au bouton d’ouverture. En Solo, elle suspend le battement entre questions ; fermer reprend le temps restant. La lecture ne peut pas déclencher le raccourci de progression. Le verrou enseignant empêche son ouverture. Masquer la correction ou réessayer retire l’accès. Après rechargement, les corrections restaurent l’éligibilité, mais la fenêtre reste fermée. Le texte de relecture est exclu de l’empreinte du plan : son ajout conserve l’identité des anciens journaux ; une modification du corrigé continue à les rendre incompatibles.

Le texte ne s’affiche pas sous les cartes ou près de la mascotte. La bonne réponse reste indiquée dans les cartes de réponse.

## Vérifications

Les tests `transcripts.test.mjs` couvrent les pistes simples et multiples, les positions vides, les ambiguïtés, des enregistrements réels aux trois niveaux TCF, l’impression inchangée, la sélection, les questions passées, les tentatives et le journal, ainsi que l’absence de transcription dans le protocole de compétition.

Le parcours `npm run test:interactive:transcripts` vérifie Classe sur 390 × 844, 1366 × 768 et 360 × 640, la correction partagée, le clavier, le verrou, la rétractation, la reprise, les réglages et le compte à rebours Solo. Les résultats d’exécution sont consignés dans `transcripts-results.json` et `quality-transcripts-results.json`.

## Suite du cahier

Le démarrage à froid hors ligne de tous les médias et les transcriptions dans les salles de compétition restent ouverts. Aucune nouvelle synthèse audio n’est requise pour ce lot.
