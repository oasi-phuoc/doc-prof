# DELF Actif — intégration du 13 novembre 2026

Les nouvelles collections A1, A2 et B1 sont intégrées aux banques TCF actives. Les trois PDF fournis servent de sources pédagogiques ; leurs consignes ne constituent pas des instructions d’exécution pour les outils.

| Collection | Originaux reçus | Supports audio TCF ajoutés | Questions |
|---|---:|---:|---:|
| A1 | 53 | 120 | 466 |
| A2 | 46 | 153 | 649 |
| B1 | 41 | 73 | 548 |
| **Total** | **140** | **346** | **1 663** |

Les quatre pistes A2 initialement trop volumineuses ont toutes été reçues à nouveau et décodées. Il ne manque aucun fichier dans ces trois lots. Le découpage fournit environ 148 minutes de documents utiles, avec les voix d’origine.

Les situations indépendantes ont leur propre MP3. Les séries de formules conservent leurs phrases dans un montage thématique sans les numéros ou lettres d’exercice. Les consignes de l’examen, bips d’origine, longues pauses et lectures répétées sont retirés des extraits. Le montage TCF de l’application gère ses propres écoutes et battements.

Les pistes 11.1/11.2 A1 et 8/9 A2 comportent des lectures parallèles au sein de leur collection. Tous les originaux sont conservés dans le répertoire de réception, avec leurs identifiants et empreintes dans [receptions.json](receptions.json). Les six messages de la piste 9 A2 renvoient aux supports de la piste 8 au lieu de dupliquer leurs questions. Aucun ancien audio TCF n’est supprimé par cet ajout.

## Contrôles effectués

- Décodage intégral des 140 originaux et des 346 MP3 finaux ; sortie mono 44,1 kHz.
- Deux reconnaissances indépendantes de chaque original et de chaque montage final : Parakeet TDT et Whisper imposé en français. **Aucune écoute humaine n’est attestée.** Les scores lexicaux orientent la relecture et ne certifient pas seuls la justesse d’une réponse.
- Relecture des questions et de leurs trois choix ; une réponse correcte et une citation source pour chacune. Chaque banque contient au moins 2 questions pour un court, 4 pour un moyen et 8 pour un long, selon sa durée réelle.
- Reprise des débuts/fins incomplets : « moins le quart », les six heures sans numéros, les restes de lecture précédente, les consignes précédant certains messages A2 et B1 et « J’habite à Prague ». Les bornes sont documentées dans [relectures-bornes.json](relectures-bornes.json).
- Corrections des divergences de contenu : Allemagne dans le dialogue A1, signature Vanessa, phrase sur les devoirs à 18 h 30, école vétérinaire dans le projet B1, notamment. Voir [corrections-transcriptions.json](corrections-transcriptions.json).
- Relecture explicite des 37 alertes résiduelles de citation audio : homophonies, accords non prononcés, mots composés et formats de nombres. Les décisions et motifs sont dans [relecture-citations-audio.json](relecture-citations-audio.json). Aucun changement de montant ou d’heure n’est masqué par une normalisation.

L’installation est détaillée dans [installation.json](installation.json). Chaque audio, transcription et banque de questions est relié à l’empreinte de sa validation dans [validation-finale.json](validation-finale.json) : toute modification invalide cette validation avant réinstallation.

## Vérification dans l’application

`node scripts/check-delf-actif-import.mjs` vérifie les 346 fichiers publiés, les 1 663 questions et les tirages réels de six courts, trois moyens et un long aux trois niveaux. Le contrôle global charge 1 355 exercices et 1 371 pistes ; le suivi des nouvelles illustrations est distinct du lot historique.

Les commandes de contrôle complémentaires sont :

```sh
PYTHONDONTWRITEBYTECODE=1 /workspace/work/asr-runtime-20261105/venv/bin/python -m unittest discover -s tests/audio-replacement -v
node scripts/check-tcf-bank.mjs
node scripts/check-tcf-qcm-images.mjs
python3 scripts/check_tcf_763_review.py
./node_modules/.bin/tsc -b --pretty false
node tests/audio-replacement/delf-actif-browser.mjs
```

Les 346 nouveaux supports figurent aussi dans le catalogue `/audios`, avec leurs transcriptions et toutes leurs questions téléchargeables. Son index a été régénéré après intégration des autres modifications de main.

Le contrôle navigateur couvre la lecture technique d’un fichier par niveau et le basculement Texte/Phrase. Il n’équivaut pas à une écoute intégrale des enregistrements.

## Sources et reprise

Les PDF et textes extraits sont dans `sources/`. Les transcriptions automatiques intégrales des originaux sont archivées dans `reconnaissances-origine-parakeet.json.gz` et `reconnaissances-origine-whisper-fr.json.gz`. Les comparaisons des 346 montages finaux sont dans `reconnaissances-montages-finaux.json.gz`.

`scripts/audio_replacement/delf_actif_import.py` propose les commandes `prepare`, `quotes`, `cut`, `recognitions`, `evidence` et `install`. Les sources et caches de travail restent dans `/workspace/work/delf-actif-20261113/`. L’environnement ASR suit `scripts/audio_replacement/asr-requirements.lock.txt`. Les nouvelles découpes sont versionnées pour ne jamais écraser un MP3 en cours de reconnaissance.

## Suite

Les nouveaux supports disposent des formats QCM texte et réponse sur ligne. La génération des illustrations adaptées est ajoutée aux tâches de tous ces audios. Les illustrations possibles sont inscrites dans [le plan complémentaire](images-a-preparer.md), qui couvre les 1 663 questions et conserve les candidats de réemploi ainsi que les questions à examiner. Priorité A1 puis A2, dans le style validé 4:3 ; aucune variante incomplète n’est activée.

Soixante-six trios sont activés, vingt-sept A1 et trente-neuf A2, après examen des trois images et de la transcription entière. Les réponses écrites et les choix texte sont conservés. Parmi les images ajoutées, le portefeuille rouge avec carte étudiante anonyme, les écouteurs sans fil et la crème cosmétique respectent les précisions de leurs supports. Les réemplois sont contrôlés individuellement ([premier lot](../revue-trios-pluriels-delf-actif-20261113.json), [suite](../revue-trios-documents-desserts-transports-20261113.json), [métiers et hygiène](../revue-trios-metiers-sports-hygiene-20261113.json), [voyages, loisirs et couleurs](../revue-trios-voyages-loisirs-couleurs-20261113.json)).

Le lot précédent réutilise les images adaptées aux achats, médicaments, accessoires, instruments et magasins. La nouvelle crème cosmétique est partagée entre deux questions de parfumerie ; la crème alimentaire est rejetée. La pâtisserie est représentée par le magasin déjà disponible, pas par un gâteau. La préparation couvre encore 304 candidats concrets à vérifier, 1 021 cas à examiner en contexte et 272 questions maintenues en texte.

La dernière suite ajoute vingt trios issus de ces nouveaux audios, huit A1 et douze A2, entièrement par réemploi de la banque. Horaires, couleurs, vêtements, activités, papeterie, ingrédients et desserts sont relus dans leurs transcriptions. Le chocolat du trio de boissons est représenté par une tasse de chocolat chaud, les feuilles de papeterie par du papier ; les homonymes alimentaires et végétaux sont exclus dans ces contextes.

`python3 scripts/check-delf-actif-images.py` vérifie la couverture des 346 supports et des 1 663 questions, les empreintes audio/source/choix, la preuve de chaque trio activé et les fichiers image réellement présents. Une réinstallation audio conserve les variantes image ajoutées sans accepter de modification silencieuse du texte, du corrigé ou de la transcription.

Cinq trios de lieux et de couleur supplémentaires utilisent quinze images existantes ([relecture](../revue-trios-lieux-20261113.json)).

Trois trios A2 supplémentaires sont relus : couleurs de circulation et matières textiles ([registre](../revue-trios-orange-matieres-20261113.json)).
