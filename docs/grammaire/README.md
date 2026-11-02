# Reprise de la grammaire

La théorie et les exercices des 17 thèmes concernés ont été repris. Les théories « Entrer en contact » et « Se présenter » restent identiques à leur version précédente, vérifiée par empreinte SHA-256.

| Contenu | Résultat |
|---|---:|
| Fiches de théorie réécrites en français facile | 105 |
| Fiches de théorie préservées | 8 |
| Sous-thèmes avec une nouvelle banque de 50 phrases | 104 |
| Phrases dans les nouvelles banques | 5 200 |
| Banques d’introduction complétées à 50 phrases | 8 |
| Phrases dans ces banques d’introduction | 400 |
| Thèmes avec des activités de communication | 16 |
| Nouveaux types CE / PE / PO | 48 |
| Variantes par type CE, PE ou PO | 10 |
| Situations différentes, partagées entre les trois compétences | 160 |
| Variantes utilisables au total | 480 |
| Questions de lecture rattachées à ces documents | 800 |
| Illustrations de grammaire générées et intégrées | 10 |

## Théorie

Chaque fiche conserve son identifiant, son thème et sa présentation : « Je regarde », « J’explique », « Je retiens », exemples en couleur, tableaux, espacements et passage à la page suivante. Les explications donnent l’usage, la construction, des exemples et les difficultés à éviter. Les tableaux conservés ont aussi reçu les corrections nécessaires, notamment pour **dont**, le contraste indicatif/subjonctif et les variantes de pluriel admises.

## Exercices

Les 16 anciens fichiers de banques cumulées ont été retirés. Ils sont remplacés par une banque ciblée par sous-thème, avec un nom court. Chaque nouvelle banque contient 50 énoncés différents, un seul blanc par énoncé et trois choix distincts dont une réponse attendue. Le contexte ou la forme demandée précise la réponse, y compris pour les temps qui peuvent autrement être interchangeables.

Le même type d’exercice propose **QCM texte** et **réponse dans le blanc** avec le sélecteur de format existant. Le choix des phrases et l’ordre des réponses restent déterministes à graine identique. Une sélection d’une seule question garde le temps ou le mode demandé dans la consigne.

Les huit banques ordinaires des thèmes d’introduction ont été complétées à 50 éléments. Les activités particulières de présentation, nationalités, provenance et famille restent disponibles, avec leurs supports existants et leur capacité réelle. Les questions de présentation manquantes sur la ville et les langues ont été ajoutées. Les informations personnelles libres restent à écrire : aucune nationalité ou aucun prénom arbitraire n’est présenté comme la bonne réponse de l’apprenant.

## Communication

Les 16 thèmes de communication proposent chacun dix fiches de situation du quotidien : transports, rendez-vous, logement, démarches, achats, activités et échanges sociaux. Chaque situation fournit :

- un document court de CE avec cinq questions simples et leurs réponses présentes dans le support ;
- une tâche de PE demandant une seule phrase ;
- une tâche de PO demandant une seule prise de parole courte, avec modèle réservé au corrigé.

Dix illustrations du sous-thème « Demander une possibilité » ont été régénérées individuellement dans le style dessiné CE/CO, contrôlées puis intégrées aux variantes CE, PE et PO correspondantes. La première planche au rendu photographique est écartée. Le registre [illustrations.json](illustrations.json) conserve les chemins, empreintes et contrôles. Les 150 autres descriptions restent dans [images-a-preparer.json](images-a-preparer.json). Les activités continuent de fonctionner avec leurs informations écrites et aucune image future manquante n’est référencée.

## Vérification et entretien

La couverture détaillée est dans [audit.json](audit.json). Les contenus éditoriaux et le générateur reproductible se trouvent dans `scripts/grammar_curriculum/`.

```sh
python scripts/grammar_curriculum/build.py
node scripts/test-grammar-curriculum.cjs
node_modules/.bin/tsc -b --pretty false
node_modules/.bin/oxlint src/grammaire scripts/test-grammar-curriculum.cjs
```

Les contrôles vérifient notamment les 104 sous-thèmes, les tailles de banque, les doublons, le nombre de réponses, les deux formats, la conservation des théories protégées, la sélection effective des dix variantes et la validité des exercices dans le moteur TCF. Des cas de langue ciblés couvrent les accords, les pronoms et les consignes de conjugaison. La compilation Vite a également été validée sans recopier les médias publics.

Cette reprise concerne la grammaire. La préparation des audios et les validations encore nécessaires avant leur bascule restent documentées dans [le rapport audio](../tcf/remplacement-audio/README.md).
