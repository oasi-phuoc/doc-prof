# Découpes TCF issues des 127 originaux de grammaire

Les 127 originaux A1 reçus pour la grammaire ont permis d’identifier **131 anciennes références CO**. Les identités reposent sur trois ancres à corrélation ≥ 0,8 et un décalage commun à 40 ms près. Les originaux de grammaire sont conservés sans modification ; leurs [127 transcriptions](../../../../grammaire/co-import/transcriptions.json) sont maintenant intégrées à leur propre banque.

**Les 131 coupes TCF sont préparées et passent les contrôles techniques automatiques.** Chaque coupe possède un FLAC comparé exactement aux échantillons de la source, un MP3 intégralement décodé et quatre fenêtres de frontière. Le MP3 final a été retranscrit ; six divergences ont reçu une seconde reconnaissance française. Le premier « Oh » de la piste 094 manquait réellement dans la première coupe : un alignement DTW rétablit son attaque à 13,194 s, avant la limite précédente. La version précédente reste conservée.

Les cinq fichiers `vie-quotidienne-objet-4-1` à `4-5` correspondent à cinq règles distinctes dans la piste 067. Ils utilisent chacun leur passage, sans numéro parlé. Ce sont cinq extraits différents, pas cinq alias du même dialogue. La fin inachevée « Nous sommes ouverts » de la piste 044 est exclue de sa version TCF, sans inventer de suite. Quatre sources ont nécessité un réalignement DTW : 049, 094, 126 et 171.

- [131 sources identifiées et fenêtres historiques](liaisons-a-decouper.json) : nom conservé pour la reprise des anciens liens ; les fenêtres estimées ne servent pas de coupes validées.
- [131 coupes préparées](decoupes-preparees.json), avec empreintes, limites et chemins de travail.
- [Contrôles après encodage](validation-technique.json) : 131 reconnaissances finales, 131 contrôles techniques réussis ; aucune écoute humaine attestée.
- [Sélection explicite des mots utiles](segmentation-overrides.json), [sources reçues](sources.json) et [preuves de signal](preuves-signal.json).
- [Corrections appliquées à sept exercices](../../corrections-appliquees-20261104.json) : quatorze audios installés, dont des coupes réutilisées de ce lot, et 57 questions relues. Toutes les banques de ce lot atteignent maintenant leur minimum de questions.

Le registre historique compte **1 021 anciennes références avec candidat préparé sur 1 318** ; aucune des 131 identités de ce lot n’attend encore son découpage. Les **297 sans original retrouvé** disposent de leur transcription directe de repli. Les corrections utilisant un autre enregistrement reçu sont documentées comme des remplacements, jamais comme une identité retrouvée avec l’ancien fichier.

## Reprise

Le travail se trouve dans `/workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work`. L’index courant est `segmentation-index-v3.json`. Les 126 autres plans de la version 2 restent utilisés sans nouvelle coupe ; seule la piste 094 possède une nouvelle préparation. Les sorties ASR précédentes sont conservées.

```sh
python scripts/audio_replacement/publish_grammar_tcf_candidates.py --work /workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work
python scripts/audio_replacement/validate_grammar_tcf_candidates.py --work /workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work --extra-asr-dir /workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work/candidate-asr-prefix-v3
python scripts/audio_replacement/build_reconciliation_report.py --work /workspace/work/tcf-audio-reconciliation-20261104 --prepared-grammar /workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work/prepared-grammar-proposals.json
```

Ces vérifications automatiques et relectures textuelles n’attestent pas une écoute humaine ni la justesse de toutes les questions du corpus. Les noms propres encore incertains restent signalés dans les rapports.
