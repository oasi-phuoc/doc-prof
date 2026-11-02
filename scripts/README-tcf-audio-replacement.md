# Remplacement CO : inventaire et transaction hors production

`tcf_audio_replacement.py` prépare le remplacement dans le dossier de travail. Il ne modifie jamais `public/`, `src/`, D1 ou un navigateur ; il ne possède aucune commande de promotion/suppression et n’appelle aucun service externe. Python standard, `ffmpeg` et `ffprobe` suffisent. Il conserve les identifiants des fiches et des exercices et prépare uniquement des correspondances à une cible par ancienne référence. Un découpage 1→N exige une réaffectation explicite des questions dans un outil dédié ; ce script le refuse.

```sh
# Inventaire réel : fichiers, SHA-256, ffprobe, partages, banques et archives.
python scripts/tcf_audio_replacement.py

# Plan avec les correspondances et un export local D1/API/navigateur.
python scripts/tcf_audio_replacement.py --mapping /workspace/work/tcf-audio-replacement/mapping.json --recipe-export /workspace/work/tcf-audio-replacement/fiches.json --plan

# Staging MP3 + JSON + sauvegardes, après revue des sources et coupes.
python scripts/tcf_audio_replacement.py --mapping /workspace/work/tcf-audio-replacement/mapping.json --recipe-export /workspace/work/tcf-audio-replacement/fiches.json --prepare
```

`--repo` sélectionne le dépôt, `--work-dir` le dossier de travail, et `--recipe-export` est répétable. Les sorties exigent un dossier `work` ou `work-*` hors du dépôt. Les chemins traversants, liens symboliques et nouvelles racines audio sont refusés. Le dossier de production reste exclusivement `public/lib/audio/tcf/co/`, servi sous `/lib/audio/tcf/co/`. `run/staged/public/...` est un artefact de transaction hors du site, pas une seconde bibliothèque de production.

La sortie stdout est un objet JSON `{run_dir,plan,prepared,promotion_ready,blockers}`. Un plan partiel retourne 0 avec ses blocages ; une préparation sans sources validées retourne 2 et conserve son rapport. Une erreur de schéma ou de chemin dangereux retourne 2 sur stderr. Aucune erreur ne déclenche une suppression.

## Correspondances

Schéma `version: 1` :

```json
{
  "version": 1,
  "replacements": [
    {
      "dialogue_id": "dialogue-existant",
      "old_refs": ["/lib/audio/tcf/co/ecole/ancien-dialogue.mp3"],
      "new_ref": "/lib/audio/tcf/co/ecole/accueil.mp3",
      "staged_file": "/workspace/work/tcf-audio-replacement/run-XXX/dialogue-existant/candidate.wav",
      "validated_manifest": "/workspace/work/tcf-audio-replacement/run-XXX/validated-manifest-XXX.json",
      "transcription": "Bonjour, madame.",
      "tags": ["accueil"],
      "final_file_review": "/workspace/work/tcf-audio-replacement/revues/accueil-mp3.json"
    }
  ]
}
```

`validated_manifest` et `final_file_review` peuvent être omis pour un plan préparatoire, qui reste bloqué. Le fichier `staged_file` doit exister. Tous les chemins de fichiers relatifs sont résolus depuis le mapping.

Le manifeste doit provenir de `tcf_audio_boundaries.py validate`. L’outil retrouve le `manifest.json` initial, recalcule son empreinte, revalide les sources/coupes/contrôles/échantillons et la revue humaine, puis compare le manifeste validé au manifeste préparé. Le statut `validated` seul ne suffit pas. Le `dialogue_id`, la transcription normalisée et les tags doivent correspondre au segment exact. WAV PCM et FLAC de contrôle sont compatibles lorsque la version de l’outil boundaries les prend en charge.

Si `staged_file` est le candidat WAV/FLAC exact validé, la préparation l’encode en MP3 dans le staging, sans modifier la source. Un MP3 déjà encodé est accepté seulement si son SHA-256 est celui obtenu par l’encodage déterministe du candidat validé (`libmp3lame`, qualité 2, métadonnées supprimées). Le conteneur réel est contrôlé ; un WAV renommé `.mp3` n’est pas une production MP3 valide. Chaque nouveau MP3 est sondé et entièrement décodé par ffmpeg.

Plusieurs `old_refs` peuvent désigner des anciens alias d’un même dialogue ; chaque ancienne référence n’a qu’une cible et ne peut figurer dans deux entrées. Deux dialogues ne peuvent partager `new_ref`. Les chaînes de renommage et collisions avec une cible existante non désignée sont bloquées. Les usages partagés du même chemin dans les banques sont tous modifiés ensemble. Les références d’autres fonctionnalités ou littéraux TypeScript restent protégés.

## Revue du fichier MP3 final

La validation du candidat PCM précède l’encodage. La revue du **MP3 final** lie ensuite l’écoute aux octets effectivement destinés au site. La préparation écrit `final-review-templates/<dialogue_id>.json`, avec les vérifications à `false`. Copier et remplir ce modèle uniquement après l’écoute réelle du MP3 final. Le champ `final_file_review` du mapping pointe vers la copie renseignée ; relancer la préparation reproduit le même MP3 et vérifie son empreinte. La première préparation est donc utile pour écouter les octets finaux ; elle reste bloquée pour la promotion.

```json
{
  "version": 1,
  "dialogue_id": "dialogue-existant",
  "audio_sha256": "EMPREINTE_DU_MP3_FINAL",
  "reviewer": "Nom du vérificateur",
  "human_listening": false,
  "listened_at": "",
  "notes": "",
  "transcription_checked": false,
  "transcription": "Bonjour, madame.",
  "checks": {
    "first_word_complete": false,
    "last_word_complete": false,
    "no_numbering": false,
    "no_instructions": false,
    "no_previous_dialogue": false,
    "no_next_dialogue": false,
    "no_truncated_syllable": false,
    "natural_silences": false,
    "coherent_full_dialogue": false
  }
}
```

Ce fichier consigne des preuves d’écoute ; le programme ne peut établir automatiquement qu’une personne a réellement écouté. Il ne transforme pas les valeurs du modèle en validations.

## Données préparées et exportées

Les trois `co.json` sont copiés avec les nouvelles références, transcriptions mono/multi alignées et tags ; les anciens tags sont conservés et fusionnés avec les nouveaux. Une entrée peut fournir `remove_tags: ["tag-obsolete"]` pour retirer explicitement un ancien tag sans retirer un nouveau tag validé. les IDs, questions et indices numériques `questions[].audio` / `situations[].dialogue` restent conservés. Les durées sont recalculées à partir du MP3 final. Les clés de `audio-durations.json` et `co-reviewed-pools.json` sont remappées ; des décisions de pools contradictoires fusionnées bloquent la promotion. Les rapports historiques, caches STT, sources de reconstruction et Git restent intacts.

Les recettes d’exports JSON API `{fiches:[]}`, D1 `results`, listes de lignes, objets navigateur/historique et exercices directs sont parcourues récursivement. Les `recipe` sérialisées en JSON sont décodées puis réencodées uniquement lorsqu’elles changent. Cela couvre pages, blocs supplémentaires, slots, instantanés libres et exercices copiés dans `libreItems`. Les deltas utilisent JSON Pointer avec échappement `~0`/`~1` et contiennent l’ancienne valeur. Pour une recette sérialisée, le remplacement externe de la string est accompagné des deltas internes et des gardes ID/empreinte/`updated_at`.

Une transcription d’exercice exportée différente des transcriptions canoniques actuelles est conservée et signalée pour examen ; elle n’est pas remplacée aveuglément. Une transcription multi-piste non alignée est aussi bloquante. Un export de navigateur n’établit pas la couverture de la base distante.

Pour documenter un **vrai export D1 complet** déjà fourni, l’option `--db-evidence fichier.json` accepte :

```json
{
  "version": 1,
  "kind": "cloudflare-d1-remote-export",
  "database": "clairfle-fiches",
  "export_file": "fiches.json",
  "export_sha256": "EMPREINTE_EXACTE_DU_FICHIER",
  "total_rows": 123,
  "complete": true,
  "exported_at": "DATE_ISO_8601_AVEC_FUSEAU",
  "reviewer": "Responsable de l’export"
}
```

Le fichier doit faire partie des `--recipe-export`, son enveloppe doit être reconnue, le nombre de lignes et les IDs uniques doivent correspondre, chaque ligne doit avoir `updated_at`, et l’export doit dater de moins de 24 heures. L’outil n’effectue aucune connexion distante et ne présente jamais cette attestation comme une inspection live. La future application doit encore vérifier les gardes de concurrence exactes ; la préparation ne remplace pas ce contrôle.

## Transaction et rollback

Chaque exécution conserve un nouveau dossier `replacement-*` :

- `inventory.json` : fichiers audio réels, empreintes, ffprobe, références et partage ; les fichiers non audio sont listés à conserver, sans être candidats à la suppression ;
- `plan.json` : couverture manquante des banques/indexes, références protégées, conflits, preuves absentes et candidats à examiner **sans suppression** ;
- avec une préparation validée, `staged/public/lib/audio/tcf/co/` contient uniquement les nouveaux MP3, et `staged/src/tcf/content/` les nouvelles données ;
- `backups/` conserve les anciens octets audio lisibles, JSON/indexes et exports originaux ; `rollback-manifest.json` relie les copies à leurs SHA-256 et à Git HEAD ; les pointeurs LFS non hydratés sont signalés et ne sont pas présentés comme des sauvegardes audio réelles ;
- `bank-deltas.json` et `recipe-deltas.json` permettent de revoir les modifications et de construire une application inverse.

Les sauvegardes sont créées avant les fichiers préparés. Le rollback réel doit d’abord restaurer les octets audio requis, puis les recettes encore égales à la version appliquée, puis les banques/indexes ; une restauration globale de D1 après des éditions utilisateurs pourrait perdre ces éditions. Ne pas supprimer sauvegardes, sources historiques ou fichiers temporaires avant validation complète.

La promotion reste hors de cet outil. Elle doit rendre les nouveaux fichiers disponibles dans le dossier existant avant la bascule des références, vérifier la concurrence D1 et empêcher un ancien onglet/historique de réenregistrer les URL obsolètes. D1 et le déploiement statique n’ont pas de transaction commune. Les suppressions ne peuvent intervenir qu’après contrôle de tous les consommateurs réels et des QR déjà diffusés. Aucun manifeste ne doit être considéré comme une autorisation de supprimer un fichier encore utilisé.

```sh
python -m unittest discover -s scripts -p 'test_tcf_audio_replacement.py' -v
```

Les tests utilisent des signaux et preuves **synthétiques**, explicitement nommés comme tels. Ils ne valident aucune écoute humaine d’un audio réel.
