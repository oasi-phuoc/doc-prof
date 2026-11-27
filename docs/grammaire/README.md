# Reprise de la grammaire

Les activités par niveau sont suivies dans le [bilan des banques graduées](implementation/README.md). Les 160 situations de la première banque de communication sont conservées dans le [registre des scènes](images-a-preparer.json). Les situations illustrées sont disponibles en [fiches de lecture, d’écrit et d’oral](fiches-communication-illustrees.md). La [compréhension orale](co-import/README.md) garde sa banque dans le générateur.

Le **Vocabulaire illustré** apparaît à la suite de la théorie dans les sous-thèmes concernés. La provenance des cartes est indiquée dans la [banque de vocabulaire](../../src/grammaire/media/word-vocab/bank.json).

## Bilan historique de la reprise

La théorie a été rétablie dans son état antérieur au commit `b04247cb`. Les types d’exercices et les banques actuels sont conservés.

| Contenu | Résultat |
|---|---:|
| Fiches de théorie antérieures conservées | 99 |
| Sous-thèmes avec une nouvelle banque de 50 phrases | 90 |
| Phrases dans les nouvelles banques | 4 500 |
| Banques d’introduction complétées à 50 phrases | 7 |
| Phrases dans ces banques d’introduction | 350 |
| Thèmes avec des activités de communication | 16 |
| Nouveaux types CE / PE / PO | 48 |
| Variantes par type CE, PE ou PO | 10 |
| Situations différentes, partagées entre les trois compétences | 160 |
| Variantes utilisables au total | 480 |
| Questions de lecture rattachées à ces documents | 800 |
| Illustrations de grammaire générées et intégrées | 10 |

## Théorie

La théorie révisée est intégrée au générateur. Le contrôle couvre les 98 fiches en A4 et en double A5. [Cahier des charges de la théorie en FALC](cahier-des-charges-theorie-falc.md) · [Bilan et registre de relecture](implementation/theorie-falc.md)

Les 99 entrées de l’archive documentent le contenu rétabli. Le catalogue actuel compte 98 fiches après le regroupement des destinations et du verbe aller. Les anciennes recettes de la fiche des destinations ouvrent la fiche du verbe aller. Le thème Aide-mémoire a été retiré du catalogue lors de la reprise historique. Les banques d’exercices et les fiches de théorie se reconstruisent séparément.

## Exercices

Les 16 anciens fichiers de banques cumulées ont été retirés. Ils sont remplacés par une banque ciblée par sous-thème, avec un nom court. Chaque nouvelle banque contient 50 énoncés différents, un seul blanc par énoncé et trois choix distincts dont une réponse attendue. Le contexte ou la forme demandée précise la réponse, y compris pour les temps qui peuvent autrement être interchangeables.

Le même type d’exercice propose **QCM texte** et **réponse dans le blanc** avec le sélecteur de format existant. Le choix des phrases et l’ordre des réponses restent déterministes à graine identique. Une sélection d’une seule question garde le temps ou le mode demandé dans la consigne.

Les sept banques ordinaires des thèmes d’introduction ont été complétées à 50 éléments. Les activités particulières de présentation, nationalités, provenance et famille restent disponibles, avec leurs supports existants et leur capacité réelle. Les questions de présentation manquantes sur la ville et les langues ont été ajoutées. Les informations personnelles libres restent à écrire : aucune nationalité ou aucun prénom arbitraire n’est présenté comme la bonne réponse de l’apprenant.

## Communication

La première banque proposait dix fiches de situation du quotidien pour chacun des seize thèmes de communication. Elles couvraient les transports, les rendez-vous, le logement, les démarches, les achats, les activités et les échanges sociaux. Chaque situation fournit les éléments suivants.

- un document court de CE avec cinq questions simples et leurs réponses présentes dans le support ;
- une tâche de PE demandant une seule phrase ;
- une tâche de PO demandant une seule prise de parole courte, avec modèle réservé au corrigé.

Chacune des 160 situations a sa propre illustration dans le style dessiné CE/CO. Le [registre des illustrations](illustrations.json) conserve les chemins, empreintes et contrôles. Le [registre des scènes](images-a-preparer.json) donne l’état de chacune des 160 situations.

La revue des personnages a remplacé huit scènes. Les remplacements concernent le musée, l’atelier vélo, la bibliothèque, la cantine et la gare. La revue des autres groupes de communication et des scènes de compréhension orale reste ouverte. [Critères graphiques et diversité des personnages](../tcf/style-images.md)

En compréhension écrite graduée, « Se situer dans le temps → Le moment → Lire une situation » propose 80 questions sur 20 documents A1. Quatre documents réemploient un visuel TCF. [Relecture et sources](implementation/temps-a1-a2-relecture.md)

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
