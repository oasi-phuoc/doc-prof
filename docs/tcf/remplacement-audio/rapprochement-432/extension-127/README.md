# Recherche dans les 127 audios A1 ajoutés à main

L’import de grammaire `35332e09`, reçu pendant la reprise des 432 références, ajoute 127 originaux A1. Leur consultation a permis de retrouver **131 références CO supplémentaires**, avec trois ancres du signal concordantes, une corrélation d’au moins 0,8 et un écart de décalage d’au plus 40 ms.

Les fichiers et les entrées de grammaire conservent leur état d’import original et `audio-only`. Cette recherche produit uniquement des preuves de correspondance pour les anciennes références CO.

- [127 sources consultées](sources.json) : identifiants d’envoi, fichiers, empreintes et provenance de l’import.
- [131 liaisons à découper](liaisons-a-decouper.json) : anciennes références, sources concordantes, preuves et fenêtres temporelles estimées.
- [Comparaisons du signal](preuves-signal.json), y compris les tentatives sans confirmation.

Les fenêtres estimées localisent l’ancien fichier dans l’original. **Elles ne sont pas des découpes validées** : les introductions, consignes, mots complets, répétitions et frontières restent à contrôler. Ces 131 références ne sont donc pas ajoutées aux 890 candidats déjà préparés.

Le [registre des identités de sources](../../identites-sources-unifiees.json) réunit maintenant **1 021 références sur 1 318** : 890 candidats préparés et 131 sources identifiées dont les découpes restent à préparer. Sur les 432 références de départ, **135 sont rapprochées** et **297 disposent de la transcription de leur fichier actuel sans source d’origine retrouvée**. Les 432 retranscriptions restent toutes conservées.

Pour reprendre cette recherche :

```sh
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python scripts/audio_replacement/fingerprint_sources.py --catalogue /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search/source-catalogue.json --refs-json /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search/remaining-428.json --work /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search --keep 12 --output-name discovery.json
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python scripts/audio_replacement/verify_recording_discovery.py --discovery /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search/discovery.json --refs-json /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search/remaining-428.json --output /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search/waveform-evidence.json --top 3
python scripts/audio_replacement/build_reconciliation_report.py --work /workspace/work/tcf-audio-reconciliation-20261104 --grammar-search /workspace/work/tcf-audio-reconciliation-20261104/grammar-source-search
```

Aucun audio servi, aucune question et aucune transcription de banque n’ont été modifiés par cette recherche. Aucune écoute humaine n’est déclarée.
