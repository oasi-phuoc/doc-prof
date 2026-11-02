# Avancement des illustrations CE / CO

## Priorité du lot en cours

Reprendre d’abord les variantes retirées lors de l’audit visuel. Les textes CE sont disponibles et relus. Pour les CO, le périmètre demandé « audios déjà remplacés » doit être distingué de la préparation technique : aucun des 408 nouveaux fichiers sources n’a encore été basculé dans la bibliothèque servie ; 617 anciennes références ont un remplacement préparé.

Au premier point de sauvegarde : **9 illustrations validées visuellement et 9 variantes QCM image CE activées**. La première version du théâtre avait des bras supplémentaires : elle a été écartée, corrigée et seule la seconde version est utilisée.

Le registre reproductible [images-generees.json](images-generees.json) conserve les fichiers, empreintes, contrôles visuels et références des questions activées. Les QCM texte et les corrigés sont conservés. Les montants, dates, jours et mois ne sont pas ajoutés dans les images.

## Suite

- Terminer les deux variantes CE prioritaires restantes : légumes, puis patins / raquettes à neige.
- Pour les images CO, confirmer si les 617 correspondances préparées constituent le périmètre souhaité ; le second lot de sources non rapprochées reste différé.
- Régénérer les dix illustrations de grammaire récemment produites dans le style dessiné CE/CO ; la planche au style photographique n’a pas été intégrée.
- Les autres candidats de [images-a-generer.json](images-a-generer.json) restent suivis individuellement ; les 1 101 assets du plan historique ne sont pas tous générés à ce stade.

## Audio et fiches enregistrées

Les 111 passages et les neuf sources à réaligner ont leurs candidats corrigés. Restent la validation par écoute, les correspondances encore ouvertes, puis la migration des banques et des fiches enregistrées. Le détail est dans [le rapport audio](remplacement-audio/README.md).

La variable du frontend est `VITE_FICHES_API_URL`. Elle pointe vers le Worker de l’API des fiches. La liaison à D1 est définie côté serveur dans `api/fiches/wrangler.toml`, avec le binding `DB` et la base `clairfle-fiches`. L’URL seule ne donne pas l’autorisation d’administrer ou migrer D1. Aucun contenu de `.env` privé n’a été lu ni publié.
