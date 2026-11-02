# Traitement local des sources CO

Les scripts de ce dossier effectuent la transcription, le repérage et le rapprochement des sources. Ils ne remplacent pas la bibliothèque servie et ne déclarent jamais une écoute réelle sur la base de l’ASR ou du signal.

Le moteur utilisé est Sherpa-ONNX 2.0.1, Parakeet TDT v3 multilingue INT8, avec prise en charge du français. L’archive officielle est disponible dans [la distribution Sherpa-ONNX](https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2) ; son SHA-256 vérifié est `5793d0fd397c5778d2cf2126994d58e9d56b1be7c04d13c7a15bb1b4eafb16bf`. Les dépendances du traitement sont dans `asr-requirements.lock.txt` ; `ffmpeg` et `ffprobe` sont également nécessaires. Aucun audio n’est transmis à un service externe.

Les neuf pistes bloquées ont ensuite été transcrites et réalignées en français avec `whisper_alignment.py`. Cet outil expose les têtes d’attention déjà présentes dans le modèle Whisper small INT8, sans modifier ses poids, et utilise le DTW natif Sherpa sur une grille de 20 ms. Les graphes enrichis restent en mémoire ; les modèles originaux sont conservés. Les dix têtes sélectionnées sont celles publiées par OpenAI pour Whisper small. Le paquet `onnx` est nécessaire pour cette opération. Les résultats restent des estimations automatiques, avec provenance et empreintes, sans attestation d’écoute.

Le catalogue de travail fournit `sources[]` avec `source_id`, `source_file` et `sha256`. Le transcripteur vérifie les empreintes et reprend uniquement les résultats dont la source et les paramètres correspondent. Les fenêtres de calcul VAD ne sont pas des dialogues. Les horodatages TDT sont des estimations sur une grille de 80 ms ; les durées des tokens peuvent être nulles. La ponctuation isolée tardive ne définit pas la fin acoustique d’un mot.

```sh
# Dans l’environnement actuel, cet interpréteur et les modèles sont déjà installés.
/workspace/work/tcf-audio-replacement/asr-venv/bin/python scripts/audio_replacement/transcribe_parakeet.py --model-dir /workspace/work/tcf-audio-replacement/sherpa-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8 --catalogue /workspace/work/tcf-audio-replacement/source-catalogue.json --output-dir /workspace/work/tcf-audio-replacement/source-asr-parakeet --threads 3

# Plans de travail nouveaux, avec exclusions textuelles et incertitudes explicites.
python scripts/audio_replacement/prepare_source_plans.py --output-dir /workspace/work/tcf-audio-replacement/plans-nouvelle-revision

# Recherche de passages, puis preuve de signal sur les meilleurs candidats.
python scripts/audio_replacement/match_sources.py
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python scripts/audio_replacement/verify_acoustic_matches.py

# Encodage des candidats FLAC déjà préparés et vérification intégrale des MP3.
python scripts/audio_replacement/encode_candidate_mp3.py

# Recomposer les cinq séries utiles sans annonces de numérotation ; conserver les preuves de chaque passage.
python scripts/audio_replacement/assemble_audio_parts.py

# Correspondances de travail et brouillons des banques ; aucune écriture en production.
python scripts/audio_replacement/build_proposed_replacements.py
python scripts/audio_replacement/build_report.py
```

`prepare_source_plans.py` s’appuie sur `segmentation-overrides.json` pour les décisions textuelles déjà prises. Il refuse d’écraser un dossier contenant les mêmes plans ; utiliser un nouveau dossier pour chaque révision. Les plans corrigés du lot actuel incluent notamment la séparation des trois messages téléphoniques de la piste A1 08. Un plan lisible géométriquement reste à écouter.

`transcribe_sherpa.py` permet une lecture indépendante avec le modèle Whisper small INT8 officiel. Cet export donne des horodatages de segments, sans horodatages de mots. Il peut s’arrêter après une annonce d’exercice sur un original ; comparer la couverture et conserver cette sortie comme incomplète. Une seconde transcription des candidats sans préambule a servi à signaler les divergences factuelles, pas à certifier l’écoute.

Les manifestes de découpe se préparent avec [tcf_audio_boundaries.py](../README-tcf-audio-boundaries.md). La préparation de migration et les sauvegardes sont décrites dans [tcf_audio_replacement.py](../README-tcf-audio-replacement.md). Ne pas utiliser les correspondances candidates comme des validations de frontières ou des autorisations de suppression.
