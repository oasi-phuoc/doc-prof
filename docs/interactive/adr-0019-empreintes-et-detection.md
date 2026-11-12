# ADR 0019 — Empreintes de modèles et détection de secrets

Après intégration des mises à jour audio de `main`, Gitleaks classe comme `generic-api-key` des SHA-256 de fichiers de vocabulaire `tokens.txt` et `small-tokens.txt`. Les valeurs sont des empreintes de 64 caractères hexadécimaux, placées dans `parameters.model_files_sha256` du rapport `docs/tcf/remplacement-audio/bascule-preuves-reconnaissances-20261105.json`. Le producteur `report_full_switch.py` reprend ces paramètres des rapports de reconnaissance. Ce sont des preuves d’identité de fichiers de modèles, pas des identifiants d’accès. Les valeurs n’ont pas été reproduites dans les sorties de diagnostic.

`.gitleaks.toml` conserve toutes les règles officielles. L’exception s’ajoute seulement à `generic-api-key` et exige simultanément le chemin exact du rapport et une correspondance complète de la forme `tokens.txt": "<64 caractères hexadécimaux>"` ou `small-tokens.txt": "<64 caractères hexadécimaux>"`. Ces champs ont été vérifiés dans leur contexte de fichiers de modèles. Le filtre porte sur la correspondance plutôt que la ligne, qui peut être tronquée à une limite de fragment du scanner ; le guillemet final est facultatif pour cette même raison. Aucun répertoire, rapport entier, chaîne contenant « token » ou autre règle n’est exclu.

L’autotest génère trois valeurs temporaires sans autorité : une empreinte dans ce rapport, un jeton GitHub et une clé générique. Les deux dernières doivent être détectées, y compris la clé générique située dans le même rapport autorisé. L’empreinte seule doit être admise, et les deux valeurs détectées doivent être masquées dans le rapport brut. Ces fichiers sont supprimés en fin de contrôle. Le téléchargement épinglé et sa vérification SHA-256 sont conservés.

Gitleaks 8.30 lit les fichiers par fragments de 100 Ko et cherche une ligne vide avant de couper. Sans séparateur, le gros rapport peut produire une correspondance sur un préfixe incomplet de SHA-256. Sa copie temporaire est donc validée comme JSON, puis chaque saut de ligne est doublé : aucune valeur ni champ n’est retiré ou changé. Le scanner retrouve des limites sûres et le rapport final remappe les numéros vers les lignes d’origine. Le fichier versionné reste intact. L’autotest utilise aussi un document de plus de 100 Ko ; les préfixes hexadécimaux incomplets ne sont pas ajoutés à l’exception.

Le périmètre reste les commits depuis C0 et les fichiers actuellement modifiés. Cette correction de faux positifs ne clôt pas la migration de l’authentification F22 et ne certifie pas l’historique antérieur ni le bundle complet. Voir [secrets-results.json](secrets-results.json).

## Actualisation du 12 novembre 2026

L’intégration des relectures TCF apporte les mêmes preuves de fichiers de modèles dans cinq rapports supplémentaires, ainsi que le vocabulaire `medium-tokens.txt`. Les signalements vérifiés portent sur des valeurs SHA-256 de 64 caractères hexadécimaux sous des chemins de fichiers de modèles. L’exception conserve la condition simultanée sur le champ exact et le chemin du rapport ; les noms de vocabulaire admis sont `tokens.txt`, `small-tokens.txt` et `medium-tokens.txt`.

Les six fichiers admis, tous dans `docs/tcf/remplacement-audio/`, sont :

- `bascule-preuves-reconnaissances-20261105.json` ;
- `correction-debut-allo-brigitte-20261112.json` ;
- `adjudications-contextuelles-20261112.json` ;
- `corrections-4-editions-20261111.json` ;
- `verification-numero-radio-cinema-20261112.json` ;
- `validation-87-20261111.json`.

Chaque copie temporaire reçoit les mêmes séparateurs JSON sûrs. L’autotest exige huit détections masquées : un jeton GitHub synthétique, une clé générique dans chacun des six rapports et une empreinte de vocabulaire placée dans un rapport non autorisé. Les trois variantes de vocabulaire sont testées dans chacun des rapports autorisés. Les valeurs des documents versionnés sont conservées et les autres règles restent actives.
