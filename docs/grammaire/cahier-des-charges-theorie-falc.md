# Cahier des charges — théorie de grammaire en FALC

## 1. Objectif et périmètre

Un élève allophone doit pouvoir lire une fiche, comprendre à quoi sert la notion et l’utiliser dans une phrase nouvelle. La refonte reprend la théorie existante en français facile à lire et à comprendre (FALC), du pré-A1 au B1. Le niveau de français et l’aisance en lecture sont deux repères distincts. Une règle avancée peut demander des phrases très simples.

Le chantier couvre les fiches du catalogue Grammaire, les fiches associant théorie et exercices, leurs aperçus, le mode Libre et les formats d’impression proposés. Les banques d’exercices, de vocabulaire, de compréhension et de production servent à vérifier les liens pédagogiques. Le chantier éditorial porte sur les contenus de théorie. [Catalogue et niveaux](../../src/grammaire/catalog.ts) · [Cahier des charges des banques graduées](implementation/cahier-des-charges-v2.md)

### Inventaire de départ

Le catalogue compte **98 fiches actives dans 19 thèmes**. L’archive contient 99 entrées. L’ancienne fiche « Les destinations » (`gram-a5-theorie`) a rejoint « Le verbe aller » (`gram-a4-theorie`). Son identifiant de compatibilité et le contenu pédagogique correspondant entrent dans la vérification. [Registre actif](../../src/grammaire/theory/index.ts) · [Archive de théorie](../../scripts/grammar_curriculum/theory-source.json)

| Thème | Fiches actives |
|---|---:|
| Entrer en contact | 3 |
| Se présenter | 5 |
| Conjuguer au présent | 11 |
| Poser une question | 3 |
| La phrase exclamative | 1 |
| Parler d’une activité | 3 |
| Se situer dans l’espace | 3 |
| Se situer dans le temps | 4 |
| Demander et proposer | 3 |
| Décrire | 10 |
| Conseiller quelqu’un | 2 |
| Parler des aliments | 6 |
| Parler du passé | 9 |
| Les pronoms | 9 |
| Parler d’une action | 3 |
| Parler de l’avenir | 5 |
| Parler des faits divers | 5 |
| S’expliquer et argumenter | 2 |
| Exprimer quelque chose | 11 |
| **Total** | **98** |

### Conservation du contenu

- Pour chaque fiche, relever l’identifiant, le niveau, l’objectif et les renvois. Inventorier les règles, les formes des tableaux, les exemples distincts, les distinctions de sens ou de registre, les exceptions, les erreurs expliquées et les médias utiles.
- Relier chaque élément source à sa nouvelle place dans un registre de suivi. Indiquer si l’élément a été repris, reformulé, déplacé, fusionné avec un doublon identique ou corrigé. En cas de correction, consigner le passage d’origine et le motif grammatical. Un exemple reformulé garde la construction ou le contraste qui le rend utile.
- Si la théorie devient trop dense, répartir les notions sur plusieurs pages courtes sous la même entrée. Donner un titre précis à chaque page. Les variantes, les tableaux complets et les exceptions gardent une place identifiable dans la fiche. Vérifier les correspondances avec les niveaux et les exercices associés.

## 2. Rédaction pour les élèves allophones

| Exigence | Application |
|---|---|
| Dire à quoi sert la règle | Donner un titre concret et, si utile, un objectif que l’élève peut se dire. « Dire où est un objet » donne une action observable. |
| Partir d’une phrase | Montrer une phrase complète avant d’introduire la règle. Choisir des situations familières comme prendre le bus, chercher une salle, prendre un rendez-vous ou expliquer un retard. |
| Faire ressortir une différence | Pour deux formes qui se ressemblent, garder le même contexte et le même vocabulaire autant que possible. Montrer ce qui change dans les mots, leur place ou leur sens. |
| Écrire court | Viser 10 à 12 mots par phrase explicative et une seule idée par phrase. Séparer les actions successives. Allonger un exemple si la construction étudiée l’exige. |
| Expliquer les mots de grammaire | Introduire le mot au moment où l’élève en a besoin. Donner une définition ou une question de repérage, suivie d’un exemple. Garder ensuite le même terme. Inclure les notions utiles à l’exercice associé, comme « complément d’objet direct », avec la forme longue avant le sigle. |
| Garder une règle exacte | Préciser le cas traité. Donner un exemple à chaque exception importante et indiquer le lien avec les règles voisines lorsque nécessaire. L’exemple résolu indique aussi comment trouver la forme. |
| Montrer l’usage | Lorsqu’une fiche enseigne l’oral familier, la politesse ou la différence entre oral et écrit, signaler le contexte avec des mots simples et montrer une phrase pour chaque usage existant. |
| S’adresser directement à l’élève | Utiliser « tu » pour les consignes ou « je » pour le but que l’élève se donne. Choisir des interlocuteurs et des référents explicites. Préférer une mise en situation brève que le public peut comprendre sans connaître les habitudes locales. |
| Adapter la charge de lecture | Au pré-A1/A1, donner un modèle très court, nommer les objets et espacer les étapes. En A2/B1, garder les raisonnements complets et les construire en plusieurs étapes courtes. Conserver les niveaux associés aux fiches à plusieurs publics. |

Le titre, l’exemple et la règle forment le socle de chaque notion. L’auteur choisit la suite selon le besoin. Une conjugaison peut se lire dans un petit tableau. Un placement de pronom peut se voir dans deux phrases successives. Un accord peut demander des étapes numérotées et un encadré « Attention ». Un essai bref avec réponse peut aider l’élève à vérifier sa lecture. Les intitulés « Je regarde », « Je retiens » et « J’explique » sont facultatifs et leur ordre est libre. Les fiches qui les utilisent déjà restent lisibles dans les versions enregistrées. [Cadre FALC du projet](../../.claude/skills/falc/SKILL.md) · [Les règles du FALC](https://falc.unapei.org/quest-ce-que-le-falc/les-regles-du-falc/)

### Extraits modèles pour le lot pilote

Ces extraits montrent trois manières de faire comprendre une notion. Chaque fiche complète reprend aussi les autres éléments de sa source.

#### Pré-A1 / A1 — Le verbe être

**Dire où je suis**

**Je suis** à Sion.\
**Nous sommes** à Sion.

Je parle de moi. Je dis « je ».\
Je parle de ma sœur et de moi. Je dis « nous ».

| Le premier mot | La forme du verbe être |
|---|---|
| je | suis |
| nous | sommes |

Dans la fiche complète, continuer avec les autres personnes et les autres usages déjà présents, comme dire comment on se sent. Reprendre les exemples et les encadrés de la source. [Source du verbe être](../../src/grammaire/theory/present.ts)

#### A1 / A2 — Devant et derrière

**Dire où se trouve le vélo**

Le vélo est **devant** la maison.\
Le vélo est **derrière** la maison.

« Devant » indique le côté qui fait face à la rue, dans cet exemple.\
« Derrière » indique l’autre côté, au dos de la maison.

Une paire de dessins peut montrer la même maison, la même porte et le même vélo. Garder le même point de vue et déplacer seulement le vélo. En légende, dire où il se trouve. Les autres mots de lieu et les formes « du » et « des » restent dans la fiche complète. [Source des mots de lieu](../../src/grammaire/theory/espace.ts)

#### A2 / B1 — L’accord du participe passé avec avoir

**Choisir entre « mangé » et « mangée »**

Elle a **mangé** une pomme.\
La pomme qu’elle a **mangée** était bonne.

Elle a mangé quoi ? Une pomme.\
« Une pomme » est le complément d’objet direct.\
Ici, « mangé » est le participe passé.\
« La pomme » est le groupe de mots repris par « que ».\
Dans la deuxième phrase, « que » est le complément d’objet direct.

1. Dans la première phrase, « une pomme » vient après « mangé ». On écrit « mangé ».
2. Dans la deuxième phrase, « que » vient avant « a mangée ». Il reprend « la pomme ». On ajoute **e** à « mangé ».

Avec « avoir », regarde où est le complément d’objet direct.\
S’il vient avant le verbe, le participe passé s’accorde avec lui.

La fiche complète traite aussi l’accord avec être et garde les exemples au pluriel et avec les pronoms. Un renvoi mène aux cas des verbes pronominaux déjà étudiés. [Source de l’accord et des verbes pronominaux](../../src/grammaire/theory/passe.ts)

## 3. Typographie et mise en page

**Reprendre le rendu de la théorie de maths comme référence commune.** Les titres, le corps, les légendes et les tableaux de grammaire prennent la famille de `.math-theory-lesson`.

```css
font-family: 'Didact Gothic', 'Arial', sans-serif;
```

Le fichier de fonte local est `didact-gothic-v1.ttf`. Didact Gothic figure aussi en tête de la pile du réglage actuel « Géométrique », qui propose Century Gothic en repli. Pour la grammaire, appliquer explicitement la pile des maths à la théorie. Centraliser cette référence pour les deux rendus afin de suivre la même police lors d’une évolution. L’aperçu et l’impression utilisent la même pile, y compris dans une fiche qui mélange théorie et exercices. Tester le chargement de la fonte et vérifier la police effectivement utilisée sur un titre, une phrase, un tableau et une légende. Les visuels de maths servent de référence de composition. Les informations de grammaire restent disponibles en texte sélectionnable et dans l’ordre de lecture. [Style de la théorie de maths](../../src/App.css#L6707) · [Chargement de la fonte](../../src/components/generator/worksheet-typography.css) · [Réglages des polices](../../src/typography/font-families.ts)

| Élément | Exigence |
|---|---|
| Corps, exemples, tableaux, légendes | Utiliser au moins 14 pt à l’impression. À l’écran, prendre une taille de lecture équivalente et respecter le zoom. Appliquer un interligne de 1,5 au texte courant. |
| Titres et emphase | Prendre le titre principal de 20 pt des maths comme base. Utiliser du gras pour la hiérarchie et les mots à observer. Vérifier la lisibilité du gras et des accents, notamment dans « êtes », « où » et « dès ». |
| Ordre de lecture | Aligner le texte à gauche. Présenter les blocs dans un flux vertical. Réserver les colonnes aux tableaux et aux comparaisons explicites. Sur largeur étroite, empiler les exemples et répéter les libellés nécessaires. |
| Espaces et pagination | Réunir la règle, l’exemple ou la légende qui lui donne son sens. Viser une à deux pages par notion. En cas de débordement, passer au bloc suivant sur une autre page ou proposer l’A4 selon le format. Répéter les en-têtes des tableaux fractionnés. |
| Couleur et contraste | Utiliser un fond clair et un texte foncé. Assurer un contraste d’au moins 4,5:1 pour le texte courant et 3:1 pour les grands titres et les repères graphiques utiles. Vérifier le résultat sur papier en noir et blanc. |

Dans une phrase annotée, reprendre le code du projet quand il aide à repérer une forme. Bleu pour le sujet, rouge pour le verbe et vert pour la terminaison. Sur une même notion, garder les mêmes repères d’un exemple à l’autre. Ajouter un libellé, un soulignement, du gras ou une colonne nommée pour que l’élève retrouve le sens en noir et blanc. Par exemple, une colonne « Sujet » peut contenir **nous**, et une colonne « Verbe » peut contenir **parlons** avec **-ons** souligné. [Code couleur du cadre FALC](../../.claude/skills/falc/SKILL.md#code-couleur-constant-sur-toutes-les-fiches) · [Cahier de la théorie de maths](../mathematiques/cahier-des-charges.md)

## 4. Illustrations utiles et personnages variés

- Ajouter une image, un dessin simple ou un schéma quand il répond à une question de lecture. Un dessin montre la place d’un objet. Une frise montre l’ordre de deux actions. Un dialogue court et ses interlocuteurs aident à comprendre « tu » et « vous ». Un tableau suffit quand le point à observer est une terminaison.
- Reprendre les visuels existants qui conviennent. Préparer un fichier par scène utile, avec un sujet principal et un cadrage lisible au format final. Garder le même décor, les mêmes objets et les mêmes personnages quand une paire d’images sert à observer un seul changement.
- À l’échelle d’un thème et du catalogue, varier les personnages, prénoms, âges, genres, carnations, morphologies et situations de vie. Représenter aussi des personnes en situation de handicap dans des scènes ordinaires. Quand une nationalité, une origine ou une langue fait partie de la notion, l’indiquer explicitement dans une légende ou un dialogue. Répartir les rôles et vérifier l’ensemble des scènes pour éviter de reproduire le même couple de personnages ou d’associer systématiquement une origine à un rôle.
- Mettre le visuel près de sa phrase et prévoir une légende courte. Donner une alternative textuelle à l’image informative. Si la légende fournit déjà toute l’information de l’image, utiliser une alternative vide pour éviter la répétition à la lecture. Garder la règle et les exemples en texte dans la fiche. Vérifier que l’élève peut répondre même si le visuel est indisponible.
- Associer chaque nouveau visuel à l’identifiant de la fiche, au bloc illustré, à son texte alternatif et à sa provenance. Relire les images une par une, puis par thème, à l’écran et en impression noir et blanc.

## 5. Mise en œuvre et compatibilité

1. **Inventaire.** Figer le relevé des 98 fiches et de l’alias des destinations. Associer les blocs existants, les alias et les liens vers les exercices à leur cible. Relever les recettes, brouillons Libre et documents partagés qui utilisent des blocs historiques.
2. **Pilote.** Intégrer les trois fiches modèles complètes dans le générateur. Réutiliser les blocs de titre, texte, exemple, tableau et image existants. Permettre des sections titrées librement si le contenu le demande. Aligner le gabarit d’écriture FALC sur la structure souple de ce cahier. Tester les trois fiches et ajuster le rendu avant de traiter toutes les autres.
3. **Déploiement par thème.** Réécrire et vérifier les fiches par lots. Garder les `typeId`, niveaux, liens catalogue et références d’exercices. Un renommage de titre ou une division en plusieurs pages garde les mêmes références d’accès. Une recette de catalogue peut régénérer la nouvelle théorie. Un contenu enregistré comme version personnelle garde ses textes, mises en forme utiles, médias, sauts et ordre. Proposer une reprise volontaire de la nouvelle version lorsqu’elle écraserait des modifications personnelles.
4. **Rendu commun.** Appliquer le style mathématique de référence aux blocs du domaine grammaire et aux blocs de grammaire reconnus dans une fiche mixte. Identifier le domaine dans le rendu partagé. Les anciens blocs `regarder`, `expliquer` et `retenir` doivent rester pris en charge dans le lecteur et l’éditeur. Vérifier le changement de page avec et sans ces sections, notamment après un tableau ou une image. [Génération](../../src/grammaire/generate.ts) · [Blocs de théorie](../../src/francais/grammar-theory.ts) · [Rendu](../../src/components/item-view/problems.tsx) · [Éditeur Libre](../../src/components/generator/libre/TheoryEditor.tsx)
5. **Contrôles et archives.** Garder l’archive source et ses empreintes de référence. Adapter le contrôle de restauration pour distinguer les fiches migrées, couvertes par le registre de conservation, et les fiches encore protégées par les contrôles historiques. Garder les exercices indépendants de la génération de théorie. Vérifier qu’en créant, modifiant, enregistrant et rouvrant une fiche Libre, son contenu et ses médias font l’aller-retour. [Sources éditoriales](../../scripts/grammar_curriculum/README.md) · [Contrôle du catalogue et des banques](../../scripts/test-grammar-curriculum.cjs)

Les aides bilingues déjà associées à une fiche suivent ses blocs révisés. Si une nouvelle aide est demandée, la préparer après validation du français, garder les exemples français et respecter la langue et son sens de lecture. [Aides en langue d’origine](../../.claude/skills/falc/SKILL.md#7-traduction-daide-langue-dorigine)

## 6. Validation et livraison

| Contrôle | Critère de réception |
|---|---|
| Couverture | Chaque fiche active et l’alias des destinations figurent dans le registre. Toutes les unités pédagogiques recensées ont une destination vérifiée, avec une explication écrite pour chaque correction ou fusion. |
| Qualité du français | Une personne enseignante relit chaque fiche en suivant les niveaux et les objectifs. Elle vérifie les règles, exemples, exceptions, cas de registre et liens vers les exercices. Chaque notion a un exemple résolu lisible sans aide. |
| Compréhension par les élèves | Associer des élèves allophones à la rédaction et à la relecture dès le pilote. Pour chaque lot, faire lire des fiches aux publics concernés, dont des lecteurs débutants pour le pré-A1/A1. Noter les mots ou images qui demandent une explication. Vérifier que l’élève peut dire à quoi sert la fiche, repérer la forme et appliquer la règle à une phrase nouvelle. Reprendre et refaire lire les passages qui bloquent. Suivre la validation par fiche et par niveau. |
| Écran et accès au texte | Vérifier l’ordre de lecture, les titres, les intitulés de tableau et les textes alternatifs. À 320 px CSS de largeur, puis au zoom à 200 %, vérifier que le texte courant se lit sans défilement horizontal et que les images, phrases et légendes restent entières. |
| Papier et PDF | Comparer aperçu et PDF A4, puis double A5 lorsque le format est proposé. Vérifier les débuts et fins de page, les tableaux, les images, les fiches mixtes et les exemples en noir et blanc. À la taille réelle, la police et les repères restent lisibles. |
| Compatibilité | Ouvrir une ancienne recette, un ancien brouillon modifié et une fiche nouvelle. Vérifier l’accès à chaque fiche du catalogue et à ses exercices. Vérifier les réglages de police dans une fiche mixte et la parité de la police de théorie avec les maths. |

Livrer un gabarit réutilisable, les fiches révisées, le registre de correspondance, les visuels nécessaires et leurs légendes, puis un bilan qui relie les fiches à leurs relectures et aux preuves d’impression. Distinguer dans le bilan les fiches rédigées, relues par une personne enseignante et vérifiées avec des élèves. Donner la priorité aux fiches pré-A1/A1 et aux notions prérequises, puis traiter le reste des 19 thèmes jusqu’à couverture complète. [Participation et règles du FALC](https://falc.unapei.org/quest-ce-que-le-falc/les-regles-du-falc/)
