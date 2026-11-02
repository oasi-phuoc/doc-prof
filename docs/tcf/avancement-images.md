# Avancement des illustrations CE / CO

## Priorité du lot en cours

Reprendre d’abord les variantes retirées lors de l’audit visuel. Les textes CE sont disponibles et relus. Pour les CO, le périmètre demandé « audios déjà remplacés » doit être distingué de la préparation technique : aucun des 408 nouveaux fichiers sources n’a encore été basculé dans la bibliothèque servie ; 617 anciennes références ont un remplacement préparé.

Lot CE prioritaire : **12 illustrations validées visuellement et 11 variantes QCM image CE activées**. Les deux variantes relatives aux légumes et aux équipements de hockey/neige sont maintenant incluses. La première version du théâtre avait des bras supplémentaires : elle a été écartée, corrigée et seule la seconde version est utilisée.

Le lot comporte désormais **39 nouvelles images CE validées et 50 variantes CE activées au total**, dont les 11 reprises prioritaires. Les réutilisations sont contrôlées visuellement et consignées (téléphone fixe, pommes de terre, théâtre, parking, tarte aux pommes, crème glacée, petit-déjeuner, musée et hôtel de ville). Les correspondances trompeuses restent écartées : le casque audio ne remplace pas un casque de vélo, et une lampe de chevet ne remplace pas une lampe de bureau.

Le registre reproductible [images-generees.json](images-generees.json) conserve les fichiers, empreintes, contrôles visuels et références des questions activées. Les QCM texte et les corrigés sont conservés. Les montants, dates, jours et mois ne sont pas ajoutés dans les images.

## Suite

- Pour les images CO, confirmer si les 617 correspondances préparées constituent le périmètre souhaité ; le second lot de sources non rapprochées reste différé.
- Grammaire : les dix scènes de la première planche ont été régénérées individuellement dans le style dessiné CE/CO, contrôlées et intégrées aux activités ; 150 autres illustrations restent à générer. La planche photographique est écartée.
- Les autres candidats de [images-a-generer.json](images-a-generer.json) restent suivis individuellement ; les 1 101 assets du plan historique ne sont pas tous générés à ce stade.

## Audio et fiches enregistrées

Les 111 passages et les neuf sources à réaligner ont leurs candidats corrigés. Restent la validation par écoute, les correspondances encore ouvertes, puis la migration des banques et des fiches enregistrées. Le détail est dans [le rapport audio](remplacement-audio/README.md).

La variable du frontend est `VITE_FICHES_API_URL`. Elle pointe vers le Worker de l’API des fiches. La liaison à D1 est définie côté serveur dans `api/fiches/wrangler.toml`, avec le binding `DB` et la base `clairfle-fiches`. L’URL seule ne donne pas l’autorisation d’administrer ou migrer D1. Aucun contenu de `.env` privé n’a été lu ni publié.
