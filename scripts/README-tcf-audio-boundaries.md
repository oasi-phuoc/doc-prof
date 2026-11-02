# Préparation et contrôle des coupes audio TCF

Cet outil local prépare les fichiers de travail nécessaires au remplacement de la bibliothèque CO. Il ne modifie aucune référence ni aucun fichier de production, ne supprime aucun audio et n'appelle aucun service de transcription. Il faut fournir les nouvelles sources et une transcription horodatée au mot. `ffmpeg` et `ffprobe` doivent être disponibles ; Python utilise uniquement sa bibliothèque standard.

## Préparer un plan

```sh
mkdir -p /workspace/work/tcf-audio-replacement
python scripts/tcf_audio_boundaries.py example --plan-only > /workspace/work/tcf-audio-replacement/plan-exemple.json
```

Adapter cet exemple aux sources réelles. Le tableau `words` contient chaque mot avec `text`, `start`, `end` (secondes dans la source) et `kind` : `dialogue`, `announcement` ou `instruction`. Inclure les paroles voisines, y compris les annonces et consignes, pour borner les marges ; une transcription incomplète ne permet pas de garantir ces limites. Les horodatages doivent identifier l'attaque et la fin réelles des mots. Séparer et réaligner un token fusionné tel que `Document2.Bonjour`.

Chaque segment indique les indices `first_word` et `last_word`, **inclusifs et commençant à zéro**, ainsi que `id`, `name`, `tags` et `transcript`. Réutiliser l'identifiant de dialogue existant lorsqu'il convient. La transcription doit correspondre aux mots sélectionnés ; la ponctuation reste celle des mots horodatés.

Un alignement DTW peut attribuer un instant sans durée propre à un petit mot coarticulé, par exemple le « a » de « n’y a ». Ce mot n’est pas étiré artificiellement. Il reste dans un `alignment_group` indivisible avec les mots liés, leur texte et leurs horodatages natifs conservés. Le groupe a une durée positive ; les coupes portent sur ses bords, jamais à l’intérieur. Un groupe incohérent avec ses horodatages ou sa transcription est refusé.

Les marges demandées sont de 80 ms avant et 120 ms après par défaut, au maximum 250 ms. Elles sont réduites à la fin du mot précédent et au début du mot suivant. Un chevauchement des horodatages ou une frontière impossible à représenter sans rogner un mot est refusé. Le découpage ne repose pas sur les silences. Une incertitude doit être inscrite dans `boundary_uncertainty`, ou `uncertain: true` sur le mot. Une confiance inférieure à 0,9 est aussi bloquante, y compris sur les voisins immédiats.

```sh
# Facultatif : manifeste candidate sans générer d'audio.
python scripts/tcf_audio_boundaries.py plan --source /chemin/nouvelle-source.mp3 --plan /chemin/plan.json

# Décodage PCM puis coupes aux échantillons exacts.
python scripts/tcf_audio_boundaries.py prepare --source /chemin/nouvelle-source.mp3 --plan /chemin/plan.json

# Même précision, FLAC sans perte et décodage en flux pour limiter le disque.
python scripts/tcf_audio_boundaries.py prepare --compact --source /chemin/nouvelle-source.mp3 --plan /chemin/plan.json
```

La commande imprime le chemin du manifeste. Chaque exécution crée un dossier `run-*` distinct dans `/workspace/work/tcf-audio-replacement`. Un autre `--work-dir` doit être explicitement nommé `work` ou `work-*`. Les dossiers de production, liens symboliques et traversées de chemins sont refusés.

Une préparation produit `manifest.json` au statut `needs_review`, la copie du plan, le PCM source, les candidats WAV PCM 16 bits avec les canaux et la fréquence d'origine, quatre fenêtres de contrôle et une forme d'onde SVG par segment. `review.html` contient les lecteurs audio. Les fenêtres couvrent jusqu'à deux secondes avant et après chacune des deux frontières. Une fenêtre vide au bord physique de la source est signalée explicitement.

Avec `--compact`, les candidats et fenêtres sont des FLAC sans perte. Le PCM source reste un flux en mémoire limitée ; ses échantillons sont comptés et hachés sans créer de fichier PCM complet. La validation redécode l'original et chaque FLAC pour comparer les échantillons exacts. Les sources, les plans, les fichiers générés et leurs preuves sont conservés.

## Écouter et valider

Ouvrir `review.html`, écouter chaque fenêtre disponible puis chaque candidat en entier. Contrôler les premiers et derniers mots, l'absence de fragments d'annonces, consignes ou dialogues voisins, les syllabes, la fluidité et la transcription.

Copier `review-template.json` vers un fichier de revue et le renseigner **uniquement après ces écoutes réelles**. Le modèle laisse toutes les écoutes et vérifications à `false`. Fournir :

- le nom du vérificateur et l'attestation exacte `J'ai écouté les fichiers indiqués et vérifié la transcription.` ;
- pour chaque écoute, `human_listening: true`, `listened_at` en ISO 8601 avec fuseau horaire et une note d'observation ;
- pour une fenêtre extérieure vide, `not_applicable: true`, la raison conservée, `checked_at` et une note constatant le bord source ; aucune écoute de cette fenêtre ne doit être déclarée ;
- la transcription vérifiée avec `human_checked: true`, son texte et `checked_at` ;
- les neuf contrôles qualité à `true` et aucune incertitude non résolue.

```sh
python scripts/tcf_audio_boundaries.py validate --manifest /workspace/work/tcf-audio-replacement/run-XXX/manifest.json --review /chemin/revue-humaine.json
```

La validation exige la revue du manifeste et des fichiers exacts. Elle recalcule les empreintes et les frontières, puis compare les échantillons du candidat et des fenêtres au PCM source. Elle conserve le manifeste initial et écrit un nouveau `validated-manifest-*.json` avec la revue humaine. Les écoutes restent des attestations humaines : le lecteur et le programme ne peuvent pas établir automatiquement qu'une personne a réellement écouté. Si une frontière est incertaine ou si un contrôle échoue, corriger le plan et créer une nouvelle préparation.

Les statuts sont `candidate`, `needs_review`, `validated`. Un fichier préparé n'est pas validé. Le manifeste validé est un justificatif de contrôle ; la migration des références, la sauvegarde et le remplacement en production constituent des opérations distinctes.

## Vérification technique

```sh
python -m unittest discover -s scripts -p 'test_tcf_audio_boundaries.py' -v
```

Les tests utilisent uniquement des signaux synthétiques temporaires. Leurs preuves de revue sont fabriquées pour tester les refus et le schéma ; elles n'attestent aucune écoute humaine réelle.
