# MODE D'EMPLOI POUR CODEX — À LIRE AVANT LE CAHIER DES CHARGES

> **Mission :** dans `https://github.com/oasi-phuoc/doc-prof`, concevoir et implémenter une **nouvelle plateforme de jeux collectifs pour écran numérique interactif**, depuis zéro côté expérience interactive. Le présent document est **l'instruction fonctionnelle, artistique, technique et de validation de référence**, pas une simple source d'idées. Les exigences P0 sont obligatoires. Les phases P1/P2 doivent être planifiées et réalisées progressivement, avec jalons vérifiables.

## Message de lancement à donner à Codex

**Lis ce fichier entier.** Ouvre le dépôt et vérifie l'architecture réelle de la branche active ; si elle a changé depuis l'audit, adapte les chemins. Commence par **cartographier les types d'exercices réellement présents et leurs réponses**, puis implémente le moteur de séance et l'expérience de jeu **neufs**. N'utilise pas les anciens `GameBoard` / `play-model` comme fondations du nouveau moteur. Garde les générateurs, la compatibilité des fiches A4, leurs corrigés, audios, images, recettes enregistrées, graines et modes libres. Développe d'abord un parcours fonctionnel « fiche enregistrée → Jeu → question → vote à 6 cartes → réponse au tableau → correction manuelle → suivante → bilan », puis élargis à l'ensemble des domaines. Fais des tests réels, de la documentation et des démonstrations représentatives. **Ne revendique pas la prise en charge d'une famille tant que sa conversion et son rendu ne sont pas testés.**

**Processus de livraison :** travaille par incréments cohérents, produis un récapitulatif des changements et des tests à chaque incrément ; utilise une branche ou un espace de travail isolé quand c'est possible. **Ne pousse pas directement sur `main` et ne déploie pas en production sans validation explicite du propriétaire**, même si un fichier d'instructions plus ancien du dépôt prévoit un push automatique. Exécute les contrôles de qualité ; ne reprends pas une ancienne directive « pas de build/lint » pour cette refonte de grande ampleur.

**Sécurité :** ne reproduis, ne publie et n'inclus aucun mot de passe dans les fichiers, commits, logs ou exemples. Audite les accès client et serveur avant tout partage, sauvegarde interutilisateur ou déploiement.

## Priorités non négociables

1. **Participation collective à six cartes physiques** : A–F et six couleurs constantes ; 1 élève au tableau, autres élèves avec leurs propres cartes papier/plastifiées, sans téléphone individuel.
2. **Refonte créative complète** : esthétique **adolescente, moderne, premium et ludique**, pas de look enfantin ; conserver l'esprit des grandes cartes de couleur montrées au propriétaire, en proposant une direction originale cohérente.
3. **Révélation contrôlée par l'enseignant** : ni correction affichée pendant le vote, ni avance imposée après un clic.
4. **Réutilisation des contenus réels** : banque de maths, FLE, TPF/TCF, grammaire, alphabétisation, soutien, logique, jeux papier et médias ; conservation totale de l'impression.
5. **Moteur sérieux** : tours, navigation, pause, reprise, correction, contenu ouvert, bilan honnête, erreurs réseau/médias, accessibilité tactile/clavier.
6. **Tests et non-régression** : stabilité des fiches, qualité des distracteurs, correspondance couleurs/cartes, sécurité et performance.

## Définition du résultat attendu à l'issue de la mission

Un enseignant ouvre n'importe quelle fiche **compatible**, clique sur **« Jouer »**, voit une prévisualisation des mécaniques proposées, démarre la séance en plein écran, pilote toutes les questions avec une navigation claire, fait voter la classe à l'aide de cartes physiques A–F, fait intervenir un élève au tableau, déclenche lui-même la correction et accède à un bilan. Les autres formats restent consultables ou sont indiqués comme « activité à guider » / « conversion non disponible » avec explication. L'ancien mode jeu n'apparaît plus après bascule.

## Nouveautés de la V4 et règle de précédence

> **Règle de précédence.** La **PARTIE X (§46 à §74)** et les **annexes C à E**, placées après le §45, **complètent et, en cas de contradiction, remplacent** les Parties I à IX. Les passages supplantés portent un bandeau « ⚠ SUPPLANTÉ » ; rien n'est supprimé, pour la traçabilité.

**Ce que la V4 ajoute :** un modèle de données et une machine à états uniques (§48, §49) ; le déterminisme et le mélange équilibré (§50) ; l'arbre de compatibilité (§51) ; les familles d'erreurs de distracteurs (§52) ; les contenus non mathématiques (§53) ; la spécification de chaque mécanique (§54) ; l'évaluation et les scores (§55) ; le comptage manuel (§56) ; la confidentialité sur écran unique (§57) ; le design system calculé (§58) ; les maquettes et la microcopy (§59, §60) ; le tactile et les médias (§61, §62) ; la persistance et les routes (§63, §64) ; la sécurité, la confidentialité et l'accessibilité actionnables (§65 à §67) ; les budgets et les tests (§68, §69) ; la livraison et le pilote (§70, §71) ; le registre des décisions par défaut (§72) ; les cas limites (§73) ; la documentation (§74).

**Ordre de lecture recommandé :** ce mode d'emploi, puis le §46 (contradictions résolues), puis les Parties I à IX avec la PARTIE X ouverte en regard.

---

# CLAIRFLE — JEUX COLLECTIFS INTERACTIFS
## Cahier des charges intégral et plan d'implémentation exécutable par Codex — Refonte totale du module de jeux

**Version :** 4.0 — 7 novembre 2026 (V3.0 complétée : Parties I–IX conservées, PARTIE X et annexes C à E ajoutées)
**Projet :** `oasi-phuoc/doc-prof` — https://github.com/oasi-phuoc/doc-prof
**Destination :** écran numérique interactif (ENI/TBI), navigateur, classe entière
**Statut :** document de référence à transmettre à Codex ; ce fichier n'effectue lui-même aucune modification du dépôt.
**Décisions de produit validées :** **refaire de zéro tous les jeux et leur interface**, en conservant les banques et générateurs de fiches ; **1 élève joue au tableau, tous les autres répondent en levant l'une de leurs 6 cartes physiques de couleur** ; direction artistique **adolescente, contemporaine, ludique, soignée et non enfantine** ; production du jeu sur écran interactif.

---

# PARTIE I — VISION ET RÈGLES FONDATRICES

## 1. Vision du produit

ClairFLE doit permettre à un enseignant de créer une fiche pédagogique dans son environnement habituel, puis de transformer sans ressaisie tout ou partie de son contenu en une **séance de jeu collectif tactile**. Le jeu projette une question ou une situation sur l'écran interactif. Un élève intervient au tableau ; chaque élève assis participe en choisissant l'une de ses six cartes physiques de couleur. L'enseignant orchestre le rythme, la discussion, les indices et la correction.

Le système n'est **ni un simple quiz en ligne**, ni une application où chaque élève a besoin d'un appareil. L'objectif premier est l'apprentissage actif de groupe, avec un seul écran, six cartes réutilisables par élève et un enseignant.

### Objectifs de réussite

1. Transformer une fiche compatible en une activité jouable en **deux actions maximum** après son ouverture : « Jouer » puis « Démarrer » (réglages facultatifs).
2. Offrir à chaque question une participation simultanée du groupe par cartes, dès lors que le contenu se prête à un vote ou à un choix.
3. Permettre à l'élève au tableau de manipuler directement les éléments lorsque la mécanique est adaptée.
4. Produire une expérience homogène, accueillante, contemporaine et dynamique dans toutes les disciplines, avec des animations discrètes et maîtrisées.
5. **Ne jamais inventer de corrigé ni de distracteur pédagogique non fiable** ; signaler les questions qui demandent une validation humaine.
6. Préserver à l'identique le fonctionnement des fiches A4, du mode libre, des banques de données et des recettes déterministes.

### Indicateurs de validation (à mesurer en situation)

- À l'observation : l'enseignant lance un jeu depuis une fiche sans guide externe.
- Tous les élèves peuvent identifier les six couleurs et leurs codes depuis le fond de la salle.
- Une réponse peut être votée sur carte, sélectionnée au tableau, puis révélée sans afficher prématurément le corrigé.
- Une session de plusieurs questions avance, revient, se met en pause et termine correctement.
- Toutes les familles couvertes ont des tests automatiques et des scénarios concrets.

## 2. Périmètre exact de « repartir à zéro »

**À refaire intégralement :** le modèle de séance interactive ; la navigation entre questions ; les règles de participation par cartes ; l'interface de projection ; le système de composants ludiques ; les transitions ; la gestion de la correction ; les scores facultatifs ; les interfaces de création/configuration des jeux ; les modèles de jeux visuels.

**À conserver comme sources de contenu :** `src/math/*`, `src/francais/*`, `src/tcf/*`, `src/grammaire/*`, `src/alphabetisation/*`, `src/jeux/*` (banques/cartes imprimables), `src/logique/*`, les domaines actifs ou futurs, le modèle `FicheRecipe`, les fichiers multimédias et les fonctions existantes qui fournissent des exercices ou rendent des figures fiables.

**À conserver absolument :** impression et aperçu A4, doubles A5, corrigés, en-têtes institutionnels, graine, mode libre, sauvegardes existantes et accès aux documents selon les droits actuels — en sécurisant ces droits lorsque nécessaire.

**À ne pas faire :** modifier les générateurs uniquement pour « satisfaire » artificiellement un jeu ; superposer deux systèmes de quiz ; conserver les anciens choix UX par inertie ; réécrire tout doc-prof ; imposer des scores ou des chronos ; exiger des smartphones élèves.

## 3. Hypothèses produit à confirmer sans bloquer le développement

- Le jeu utilise les couleurs proposées **jaune, rouge, orange, bleu, vert, violet**, qui correspondent aux six couleurs déjà référencées dans l'ancien module. Leur correspondance avec les cartes réellement possédées par la classe est **configurable dans les paramètres globaux** avant mise en service.
- Chaque carte comporte aussi une **lettre A–F** et un motif/symbole identifiable, afin qu'aucune réponse ne dépende de la seule couleur.
- Un enseignant contrôle une séance depuis l'ENI ; un second écran enseignant privé est une amélioration future, pas une dépendance au premier lancement.
- Les élèves disposent physiquement des six cartes ; l'outil peut **imprimer un jeu de six cartes par élève** pour les classes non équipées.
- Une fiche contenant des questions ouvertes peut quand même être projetée, mais elle n'est pas automatiquement convertie en QCM à six choix sans justification pédagogique.

---

# PARTIE II — LE RITUEL DE CLASSE À SIX COULEURS

## 4. Principe des six cartes

Chaque élève possède six cartes : **A / jaune, B / rouge, C / orange, D / bleu, E / vert, F / violet** dans la proposition initiale. Sur le tableau, les réponses A à F utilisent toujours le **même code de couleur et la même lettre**. Ces associations sont constantes pendant toutes les séances pour automatiser le geste ; seul le contenu des réponses et leur position logique varient.

Les cartes ne sont **pas** des jugements de valeur (rouge = faux, vert = vrai) : elles sont six **identifiants de réponse neutres**. Pour marquer une bonne ou une mauvaise réponse après correction, employer en plus `✓`, `✕`, un contour, un texte et une animation dédiée ; éviter toute confusion avec les couleurs des cartes.

**Nombre de réponses :** le moteur accepte 2 à 6 choix lorsque c'est pédagogiquement défendable. Les six cartes restent disponibles physiquement et le tableau rend très claires les seules cartes actives ; une configuration peut privilégier six réponses si des distracteurs **vérifiés** existent. Ne jamais compléter un vrai/faux avec quatre réponses inventées ou afficher six propositions indistinctes par obligation esthétique.

### Kit de cartes physiques

- Un PDF A4 portrait avec **six cartes en grille 2 × 3** ; une page = un jeu par élève, traits de coupe et marges d'impression.
- Chaque carte : aplat de couleur, lettre A–F très grande, forme/pictogramme distinct, face de lecture identique à l'écran ; contrastes vérifiés.
- Possibilité de produire un exemplaire « économie d'encre / noir et blanc » où lettre et motif restent exploitables.
- Option « imprimer X jeux » / recommandations de plastification, sans imposer une commande ou un matériel propriétaire.
- La disposition physique des cartes et l'ordre à l'écran doivent pouvoir être expliqués sur une fiche de démarrage.

## 5. Déroulement par défaut d'une question

**Étape 1 — Question.** Le tableau affiche la question, son image/audio éventuel et les choix colorés. Les réponses sont lisibles sans zoom. Aucune bonne réponse n'est visible.

**Étape 2 — Réflexion.** L'enseignant donne un temps de recherche (libre ou chronométré). Les élèves préparent leur carte sans la montrer. L'élève au tableau peut réfléchir sans sélectionner encore.

**Étape 3 — Vote simultané.** L'enseignant annonce « Montrez votre carte ! » ; les élèves lèvent une carte. Les autres ne doivent pas simplement copier le geste au tableau. Un signal visuel/sonore optionnel peut accompagner ce moment, sans bruit imposé.

**Étape 4 — Réponse au tableau.** L'élève touche la carte/réponse correspondante ou effectue la manipulation prévue. Son action devient visible. L'enseignant peut demander une justification et comparer avec les cartes levées.

**Étape 5 — Discussion.** Avant correction, l'enseignant peut solliciter un raisonnement, demander un indice ou faire changer d'avis. Une variante permet un second vote « avant/après explication ».

**Étape 6 — Révélation.** Seule l'action explicite « Révéler la correction » affiche la ou les bonnes réponses, une explication courte et éventuellement un visuel animé de réussite. En mode sans correction automatique, l'enseignant valide manuellement.

**Étape 7 — Suite.** Bouton très visible « Question suivante ». Le score et la progression sont facultatifs. **Ne jamais passer automatiquement au bout de 900 ms** : le tempo appartient à l'enseignant.

### Pourquoi cet ordre est crucial

Sur un seul écran projeté, sélectionner trop tôt la réponse au tableau permet aux autres de copier. Le rituel **réfléchir → voter avec carte → agir au tableau → argumenter → révéler** préserve la participation de toute la classe.

## 6. Rôles et responsabilités

| Participant | Action | Enregistrement automatique ? |
|---|---|---|
| Élèves à leur place | Montrent A–F avec leurs cartes physiques | **Non**. Aucun téléphone, caméra ou capteur n'est prévu. |
| Élève au tableau | Touche, choisit, glisse, classe, colorie, dessine selon le jeu | Oui, la réponse au tableau est connue de l'application. |
| Enseignant | Démarre, pose la consigne, voit les cartes, guide et révèle la correction | Les actions explicitement saisies peuvent être enregistrées. |
| Groupe/classe | Discute et revoit collectivement | Un bilan collectif est possible, mais **pas de statistiques individuelles inventées**. |

Aucun taux de réussite des élèves assis ne doit être annoncé par la plateforme sans méthode réelle de collecte. L'enseignant peut saisir **manuellement** un comptage global A–F ou noter « classe majoritairement juste » sans fiche nominative. Toute donnée saisie manuellement doit être étiquetée comme telle.

## 7. Trois modes de séance

### Mode A — « Toute la classe vote » (défaut et priorité absolue)

Une question, deux à six cartes colorées, vote simultané, réponse au tableau et correction sur commande. Fonctionne pour maths, FLE, compréhension écrite/orale, vocabulaire, logique et questions de sciences à réponse vérifiable.

### Mode B — « Manipule au tableau »

L'élève au tableau ordonne, associe, déplace, colorie ou construit ; **le reste de la classe reste impliqué** grâce à une question de prédiction A–F avant l'action (par exemple « quelle image vient ensuite ? ») ou à un vote final sur le résultat. Le vote par couleurs ne doit pas être artificiel dans les tâches purement ouvertes.

### Mode C — « Défi coopératif »

La classe cherche ensemble une réussite collective (ex. atteindre un nombre de réponses validées). Scores, points, badges ou chronomètre : **optionnels**, jamais imposés pour les publics débutants, FALC ou les séances d'oral.

Modes futurs sous condition : « Deux équipes », « Vote avant/après », « Défi de révision » et « Atelier de langage » ; aucune obligation de classement nominatif.

---

# PARTIE III — EXPÉRIENCE VISUELLE ET ERGONOMIE

## 8. Direction artistique

Identité **validée : jeu collectif pour adolescents et préadolescents**, moderne, graphique, dynamique, élégant, visuellement plaisant, sans esthétique enfantine. La même direction doit convenir à des adultes en FLE : bannir personnages de dessin animé, mascottes bébé, cliparts, stickers scolaires, bordures criardes et confettis permanents. Le rendu évoque un **studio de quiz / jeu arcade éducatif de qualité**, avec des compositions aérées, des dégradés subtils et six cartes fortes. L'utilisateur apprécie les propositions visuelles précédemment montrées : conserver leur esprit (grandes réponses colorées, interfaces aérées, panneaux nets), sans les copier servilement.

- Grands espaces ivoire et gris bleuté ou fond doux peu saturé ; cartes colorées au premier plan, jamais une interface multicolore saturée partout.
- Éléments graphiques de type **game-show moderne** : haut de page discret, barre de progression fine, grosses cartes de choix, résultat valorisé sans humiliation, micro-animations de transitions nettes.
- Inspirations structurelles : quiz contemporain, cartes pédagogiques tactiles, grande typographie, mise en page éditoriale ; éviter les effets casinos/gambling et les décors arcade agressifs.
- Typographie sans-serif lisible, chiffres tabulaires pour les maths, hiérarchie typographique forte.
- Rayon cohérent des cartes ; ombre subtile ; contours lisibles ; bordures renforcées à la sélection.
- Une même structure pour toutes les disciplines : **titre discret → question dominante → médias/figure → six réponses → contrôle enseignant → progression**.
- Microanimations courtes et signifiantes (carte sélectionnée, résultat révélé, fin de manche). Désactivables et compatibles avec `prefers-reduced-motion`.
- Options de thème : clair en premier ; sombre après tests de contraste ; palette des cartes indépendante du thème.

### Palette initiale à prototyper (pas une imposition définitive)

| Carte | Couleur | Code | Couleur du texte suggérée |
|---|---|---|---|
| A | Jaune | `#F4C84B` | sombre |
| B | Rouge | `#CC3456` | blanc |
| C | Orange | `#E98C2F` | sombre |
| D | Bleu | `#2463C5` | blanc |
| E | Vert | `#188268` | blanc |
| F | Violet | `#7643D6` | blanc |

Les six couleurs sont à tester **sur l'écran réellement utilisé** et sur le papier des cartes. Toujours associer lettre et pictogramme ; prévoir un mode déficience de vision des couleurs. Pas de « rouge = erreur / vert = bonne réponse » avant ou après vote.


## 8 bis. Charte créative détaillée : « Studio Quiz Ado »

### Positionnement et références de sensation

Cette direction est **une exigence utilisateur**, pas une hypothèse. Le jeu doit s'adresser visuellement à des adolescents sans exclure les adultes en FLE. Mots-clés : **studio de quiz contemporain, tactile, clair, vif, concentré, énergique, élégant**. La pédagogie reste au centre : le décor ne prend jamais la place du contenu.

**À obtenir :**
- Une grande zone de question typographiquement forte, des cartes A–F au dessin uniforme, une navigation discrète et des transitions qui donnent envie d'enchaîner.
- De la profondeur très légère (ombres douces, changements d'échelle mineurs, bordures), des dégradés peu prononcés, des animations de 150–350 ms si le matériel les supporte.
- Des métadonnées lisibles sans surcharge : discipline, thème, numéro de question, consigne ; un bouton **Révéler** nettement isolé de la réponse tactile de l'élève.
- Une page d'accueil de séance et un écran final qui ressemblent à un **produit fini**, pas à une page de paramètres techniques.
- Une dynamique adolescente pouvant évoquer une application de challenge sportif ou de quiz, **mais sans esthétique de pari, roulette, casino ou classement humiliant**.

**Interdits artistiques :**
- Mascottes, personnages à grosses têtes, emoji géants, stickers multicolores, typographies manuscrites pour bébés, cliparts de cahier.
- Fêtes de confettis systématiques, sons de victoire à chaque choix, expressions infantilisantes et grandes taches de couleurs sans fonction.
- Verrouiller le jeu à un thème sombre « gamer » si le projecteur ou la salle lumineuse rend le texte illisible.

### Design tokens imposés au composant, ajustables après essais matériels

- Surface principale (proposition) : `#F7F8FC` ; texte primaire `#182238` ; panneau `#FFFFFF` ; bordure légère `#DDE3EF`.
- Accent hors cartes (proposition) : indigo `#5456C5` ; ne pas confondre avec une option de réponse.
- Grille des six cartes : couleurs du tableau §8 ; correspondance papier/écran vérifiable en situation.
- Grille d'espacement basée sur 8 px ; taille des coins cohérente (par exemple 16–24 px pour cartes) ; ombres discrètes.
- Typographie sans-serif disponible et licenciée correctement, solution de repli système robuste ; nombres tabulaires pour maths ; textes FR avec accents, apostrophes et apostrophes typographiques.
- Aucune information importante indiquée par la couleur seule ; lettres A–F, textes et motifs restent visibles.

### Composition selon les activités

1. **Choix simples** : question centrée, six cartes 3×2 sur grands écrans ; consigne de vote visible.
2. **Avec image** : visuel dominant et cartes alignées dans une colonne/zone de hauteur suffisante, sans minuscule texte.
3. **Avec audio** : lecteur simple, numéro d'écoute et formes de réponses ; pas de décor animé pendant l'écoute.
4. **Glisser-déposer** : aire de manipulation vaste, cartes A–F utilisées avant ou après comme prédiction ; jamais réduction de la manipulation à un faux QCM.
5. **Oral** : images en grand, questions de relance et révélation progressive de mots-clés ; correction humaine explicitement indiquée.

### Design des états

`préparation` → `réflexion` → `vote cartes levées` → `élève au tableau` → `discussion` → `révélation` → `explication` → `suivante`. Chaque état possède un micro-texte, un code de layout et des possibilités de navigation documentés. Le feedback utilise signe ✓/✕/texte et animation contrôlée, jamais « la carte verte est juste ».

### Livrables visuels obligatoires avant industrialisation

- Prototype d'écran d'accueil de séance.
- Prototype de vote A–F à six choix.
- Prototype avec audio et QCM.
- Prototype manipulation par glisser-déposer.
- Prototype de correction détaillée.
- Prototype de bilan.
- Versions 1920×1080 et 1366×768, avec captures de contrôle ; ajustements après test ENI.

## 9. Gabarit principal — écran 16:9

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ClairFLE · Maths / Additions     Manche 2 / 8        ⏸   ⚙  Plein écran │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                       QUEL EST LE RÉSULTAT ?                           │
│                                                                        │
│                            788 + 771 = ?                               │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │ A  JAUNE         │  │ B  ROUGE         │  │ C  ORANGE        │       │
│  │  1 559           │  │  1 549           │  │  1 569           │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │ D  BLEU          │  │ E  VERT          │  │ F  VIOLET        │       │
│  │  1 459           │  │  1 560           │  │  1 599           │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  ① Réfléchir    ② Lever les cartes    ③ Jouer   ④ Révéler   Suivante → │
└────────────────────────────────────────────────────────────────────────┘
```

*Maquette de structure, non design final et non capture de l'application.* Le contrôle enseignant peut être compacté ; les boutons élèves doivent rester immenses. Si média volumineux : disposition deux zones question/image et réponses, sans miniaturiser les cartes.

### Tailles et dispositions à valider

- Cible primaire : paysage **1920×1080**, mais fonctionner aussi sur **1366×768**, **1280×800** et projection en fenêtre.
- Police de la question : cible 36–52 px selon longueur ; choix 30–42 px lorsque le contenu le permet ; textes plus longs adaptés par reflow, jamais coupés silencieusement.
- Surface tactile des éléments centraux : viser au moins **64×64 CSS px**, idéalement cartes nettement plus grandes ; contrôles enseignant au moins 44×44.
- Cartes en **3 colonnes × 2 rangées** sur grands écrans ; dégradation contrôlée sur petits écrans ; aucune barre de défilement nécessaire pour un QCM simple.
- Mode zoom, lecteur de consigne, sous-titres/transcriptions selon contenus, couleurs + lettres + motifs.
- La couleur doit rester identique dans le kit physique et sur l'écran.

## 10. États visuels d'une réponse

- **Neutre** : la carte est colorée et porte A–F ; pas de bonne réponse suggérée.
- **Sélectionnée par l'élève au tableau** : contour épais + légère élévation + marque de sélection, sans validation automatique.
- **Vote ouvert** : bandeau « Montrez votre carte » ; les cartes ne changent pas de correction.
- **Discussion** : sélection verrouillée facultativement, correction toujours invisible.
- **Révélée juste** : pictogramme ✓ et explication ; les autres cartes peuvent s'atténuer sans devenir invisibles.
- **Révélée incorrecte** : indiquer la réponse du tableau et la bonne réponse distinctement, sans humilier.
- **Indécidable / oral** : « Discussion / validation par l'enseignant » — aucun verdict automatique.

## 11. Écran enseignant et commandes

**Jamais de contrôles secrets qui affichent involontairement la correction en projection.** Actions : démarrer, vote, sélectionner, verrouiller, révéler, réécouter, indice, précédent, suivant, recommencer, pause, fin, plein écran, paramètres. Une éventuelle **console privée sur une tablette enseignant** demandera ultérieurement une architecture d'appairage sécurisée.

À la fin, proposer : refaire les questions difficiles, relancer la fiche avec une nouvelle graine, sauvegarder la configuration du jeu, retourner à la fiche A4, imprimer les cartes, consulter le bilan collectif.

## 12. Son, animation, accessibilité et inclusion

- Sons désactivés par défaut ou contrôlables globalement ; distinguer les **audios pédagogiques indispensables** des sons d'ambiance.
- Les audios de compréhension doivent être lus par action explicite (les navigateurs bloquent souvent la lecture automatique).
- Prévoir lecture/pause, réécoute, compteur si nécessaire, mode examen facultatif ; les contraintes d'écoute doivent suivre la consigne, non un paramètre global aveugle.
- Les jeux d'oral ne doivent pas enregistrer la voix des élèves sans fonctionnalité spécifique, consentement et procédure de traitement des données.
- Clavier, touche, pointer, focus visible, ARIA et alternative « choisir puis toucher une zone » pour le glisser-déposer.
- FALC : consigne courte, phrases simples, repères constants, possibilité d'afficher une seule information à la fois.
- Ne jamais imposer de vitesse à une classe hétérogène : chrono désactivable et temps de réflexion manuel.

---

# PARTIE IV — FAMILLES DE JEUX ET CONVERSION DES FICHES

## 13. Catalogue de mécaniques — ordre de réalisation

| ID | Mécanique | Participation avec six cartes | Action au tableau | Priorité |
|---|---|---|---|---|
| M01 | QCM texte / image de 2 à 6 choix | Vote A–F direct | Toucher la réponse | P0 |
| M02 | Calcul à six propositions plausibles | Vote A–F | Toucher + expliquer | P0 |
| M03 | Écoute puis choix | Vote A–F après audio | Lecture + sélection | P0 |
| M04 | Vrai/faux / deux choix | Vote sur deux cartes actives | Toucher | P0 |
| M05 | Compléter une phrase parmi des options | Vote A–F | Déposer/toucher le mot | P1 |
| M06 | Association mot/image | Vote sur la paire suivante | Relier ou déposer | P1 |
| M07 | Images dans l'ordre | Vote sur prochaine image A–F | Réordonner | P1 |
| M08 | Trier / classer | Prédire une catégorie A–F | Déposer un élément | P1 |
| M09 | Formes, mesures, aire, fraction | Vote sur réponse A–F | Manipuler grille/figure | P1 |
| M10 | Chercher l'intrus | Vote A–F | Entourer/toucher | P1 |
| M11 | Memory / paires | Vote sur paire ou case A–F quand pertinent | Retourner des cartes | P2 |
| M12 | Loto / défi collectif | Vote sur question associée | Cocher les cases | P2 |
| M13 | Chronologie / logique | Vote sur étape prochaine | Déplacer/justifier | P2 |
| M14 | Oral libre / description d'image | Cartes seulement si une vraie question de prédiction existe | Agrandir, annoter, parler | P1 |

**Règle absolue :** le vote A–F est le format central, mais ne doit jamais dégrader un objectif pédagogique. Une séquence d'images peut être interactive sans être artificiellement un QCM ; l'enseignant peut utiliser les six cartes uniquement pour des étapes de décision pertinentes.

> **Spécifications détaillées (données, interactions, évaluation, repli) de chaque mécanique : §54.** **M14-lite** (visionneuse d'images guidée par l'enseignant) est **promue P0**, car le scénario S03 du MVP l'exige ; M14 complète reste P1.

## 14. Correspondance avec les contenus réels de doc-prof

| Source existante | Données identifiées dans le dépôt | Jeu par défaut | Points de vigilance |
|---|---|---|---|
| Additions / algèbre | `MathItem` (`a`, `b`, `op`, `result`, `answer`) | M02 | Distracteurs exacts, cohérents, non répétitifs |
| Géométrie / carré et aire | `MathItem`, dimensions et figures | M09 ou M01 | Unités d'aire, ne pas confondre périmètre |
| TPF/TCF compréhension orale | `TcfQuestion`, choix, médias, `audioSrc` | M03 | Respect des écoutes, présence des pistes |
| TPF/TCF production orale | `sequence_4_images`, images, questions, modèles | M07 ou M14 | Jamais de correction « vraie/fausse » de discours libre |
| Grammaire | `GramBankItem` (`prompt`, `answer`, `options`, `hint`) | M01/M05 | Accord, variantes acceptées, orthographe |
| Jeux de cartes imprimables | `GameEntry`, memory, loto, tri, dominos | M06/M08/M11/M12 | Réutiliser les banques, pas le rendu papier |
| Alphabétisation et Soutien FR | lettres, syllabes, mots, sons, images, audios | M01/M03/M06 | Son ↔ graphie, oral, clarté des consignes |
| Logique | suites, rotations, intrus, matrices | M01/M10/M13 | Préserver les vrais critères de résolution |
| Domaines encore partiels | `vocabulaire`, `santé`, `société`, `acm`, etc. | Selon les items disponibles | Ne pas annoncer une prise en charge fictive |

## 15. Politique de conversion automatique

Chaque exercice reçoit un **statut de compatibilité** :

- `auto` : transformation et correction vérifiables automatiquement ; conversion directe.
- `assisted` : conversion possible mais demande la validation de propositions / réponses / médias.
- `teacher-led` : activité projetable/manipulable mais évaluation humaine (oral, rédaction, débat).
- `unsupported` : aucune mécanique fiable à ce stade ; afficher pourquoi et proposer une autre présentation, **sans masquer la fiche**.

Le moteur propose d'abord la mécanique recommandée, puis des variantes uniquement si elles respectent la même compétence. Un enseignant peut configurer choix, nombre d'options, affichage des indices et règles de correction. Les modifications sont enregistrées **dans un preset de jeu distinct**, jamais en altérant la recette de la fiche.

## 16. Distracteurs à six choix : qualité pédagogique

L'ancien principe « choisir une réponse au hasard » ne suffit pas. Pour créer six cartes à partir d'un calcul, il faut **une bonne réponse et jusqu'à cinq distracteurs distincts** basés sur des erreurs plausibles, sans introduire d'ambiguïté : erreur de retenue, écart de dizaine, inversion d'un chiffre, erreur d'opération, erreur d'unité, etc. Un validateur recalcule chaque candidat et élimine toute variante équivalente, hors domaine ou répétée.

**Exemple tiré de la fiche :** `788 + 771 = 1559`. Le tableau pourrait proposer `1559`, `1549`, `1569`, `1459`, `1560`, `1599` **uniquement après validation de leur cohérence**. L'ordre des six réponses est mélangé de manière déterministe, avec répartition des positions correctes pour éviter le biais « toujours la même couleur ».

Pour un QCM fourni par la banque avec trois réponses, **conserver les trois réponses** si deux nouvelles options sont pédagogiquement discutables. Les trois autres couleurs restent inactives visuellement. Ne pas transformer une question de compréhension orale en évaluation d'une notion différente pour atteindre six choix.

Pour une question ouverte sans modèle de réponse fiable, **ne pas fabriquer d'options**. Passer en mode discussion et validation enseignant.

## 17. Quatre expériences complètes tirées des exemples transmis

### Scénario S01 — Calcul en ligne : `788 + 771`

1. L'enseignant sélectionne la fiche « En ligne », appuie sur « Jouer », puis « Démarrer ».
2. Le tableau affiche l'opération en grand et jusqu'à six réponses colorées A–F.
3. Chaque élève calcule, choisit sa carte et la lève sur le signal.
4. L'élève au tableau touche une proposition ; le système enregistre la sélection **sans révéler le résultat**.
5. L'enseignant demande comment poser le calcul ou expliquer la retenue ; il appuie sur « Révéler ».
6. Le jeu affiche `1 559` et, si nécessaire, une décomposition explicative ; passage manuel à l'addition suivante.
7. Fin : bilan des questions au tableau, sans faux calcul du taux de réussite des élèves assis.

### Scénario S02 — Six documents audio et QCM

1. La fiche a déjà des documents audio et des choix de réponse dans la banque.
2. L'écran montre la consigne, « Audio 1 », un lecteur clair et les choix A–C (ou A–F si source validée).
3. L'enseignant lance le son ; l'application gère les écoutes uniquement selon le profil pédagogique configuré.
4. Vote des cartes, sélection au tableau, discussion, correction commandée ; audio suivant.
5. Pas de lecture automatique imprévisible ; afficher « piste indisponible » si un fichier manque.

### Scénario S03 — Quatre images : incident à vélo

1. Présentation des quatre images en haute définition, assez grandes pour une description orale.
2. Variante vote : « Quelle image montre la suite de cette situation ? » avec options pertinentes et images repérées par couleurs ; vote A–D.
3. L'élève au tableau remet ensuite les images en ordre ; discussion sur « d'abord, ensuite, puis, enfin ».
4. La production orale complète est **appréciée par l'enseignant** ; une proposition de récit peut être révélée comme exemple, pas comme réponse unique obligatoire.

### Scénario S04 — Aire d'un carré de côté 349 cm

1. Afficher un vrai carré, la longueur `349 cm`, la question « Quelle est son aire ? » et les choix colorés.
2. Vote individuel, choix tactile au tableau.
3. Montrer après correction la formule `côté × côté`, le calcul `349 × 349 = 121 801` et l'unité `cm²`.
4. Variante tactile : grille ou schéma de carré manipulable, si elle aide à comprendre la formule ; ne pas représenter littéralement 121 801 petits carrés.

---

# PARTIE V — ARCHITECTURE TECHNIQUE CIBLE

## 18. État du dépôt et décisions d'intégration

**Constats vérifiés dans la branche `main` au moment de l'analyse :**

- Stack : React, TypeScript strict, Vite ; `package.json`.
- Routes actuelles : `src/App.tsx`, `src/components/generator/routing.ts`.
- Génération : `src/math/generate.ts` (`buildPage`, `buildWorksheets`), `src/math/types.ts`.
- Recette reproductible : `src/fiches/recipe.ts`, `FicheRecipe` v1, graine, `libreSnapshot`, images.
- Sauvegarde : `src/fiches/api.ts`, `api/fiches/src/index.ts` (Worker + D1), `SavedFichesPage.tsx`.
- Ancien jeu : `src/components/game-board/{GameBoard.tsx,GameSetupBar.tsx,GameTimer.tsx,play-model.ts}` ; `GeneratorPage.tsx` utilise `boardMode`, `scoreMode`, `scoreCorrect`, etc.
- Les QCM/CHOIX TCF et séquences orales sont typés dans `src/tcf/types.ts` ; les banques de grammaire dans `src/grammaire/exercises/types.ts`.
- Le domaine `src/jeux` concerne notamment **des cartes imprimables** ; il ne doit pas imposer sa logique d'impression au nouveau mode projeté.

**Décision : l'ancien moteur de jeu est fonctionnellement abandonné et remplacé, pas simplement habillé d'une nouvelle feuille CSS.** Les anciens fichiers restent temporairement dans le dépôt pour permettre une migration contrôlée, puis sont supprimés après validation et bascule. On réutilise les fonctions de contenu et les composants de figures sûrs ; on ne conserve pas le contrat `PlayRound` comme norme architecturale.

## 19. Architecture proposée

```text
FicheRecipe v1 / PageConfig / graine / mode libre / corrections / images
                          │
              Générateurs existants doc-prof
                          │
         ┌────────────────┴─────────────────┐
         │                                  │
     SORTIE FICHE                     NOUVEAU MODULE
     A4 inchangée                     INTERACTIF
                                             │
                               Extracteurs d'items / adapter par domaine
                                             │
                               Modèle commun GameQuestion v2
                                             │
                             Éligibilité / options / médias / correction
                                             │
                                  Moteur de séance / états
                                             │
                        ┌────────────────────┴──────────────────┐
                        │                                       │
                 Interface projection                      Commandes prof
             six couleurs + manipulations                + bilan + presets
                        │
                 1 élève à l'écran + tous les autres votent par cartes
```

### Arborescence cible indicative

```text
src/interactive/
  domain/
    types.ts               # GameQuestion, GameSession, GamePreset
    contracts.ts           # interfaces stables
    validations.ts         # schémas de validation à l'entrée
  adapters/
    index.ts               # registre par domaine / type
    math.ts
    geometry.ts
    tcf-co.ts
    tcf-ce.ts
    tcf-po.ts
    grammar.ts
    literacy.ts
    printed-games.ts
    logic.ts
  question/
    normalize.ts           # conserver correctement réponses et médias
    choices.ts             # 2–6 propositions vérifiées
    distractors.ts         # erreurs plausibles, invariants pédagogiques
    compatibility.ts       # auto/assisted/teacher-led/unsupported
  session/
    reducer.ts             # machine à états testée
    selectors.ts
    persistence.ts         # reprise locale facultative
    scoring.ts             # score tableau vs données classe manuelles
  ui/
    InteractiveApp.tsx
    ProjectionShell.tsx
    QuestionStage.tsx
    SixColorGrid.tsx
    CardChoice.tsx
    TeacherToolbar.tsx
    VoteCue.tsx
    RevealPanel.tsx
    MediaStage.tsx
    SessionSummary.tsx
    games/                 # M01...M14, composants ciblés
  theme/
    tokens.css
    color-cards.ts
  print/
    SixCardKit.tsx         # PDF/print des cartes élèves
  tests/
    fixtures/
    ...
```

Créer des modules spécialisés et autonomes ; éviter un nouveau fichier monolithique de 800–1 000 lignes. Les noms exacts peuvent évoluer, mais **séparation données / règles / projection / contrôles** obligatoire.

## 20. Contrat de données canonique

> ⚠ **SUPPLANTÉ PAR §48** (modèle de données canonique unifié, qui prévaut). Cette section est conservée pour la traçabilité ; la table de correspondance des noms est au §48.8.

Le modèle de question doit être suffisamment générique pour les matières, mais la nature de la correction doit être explicite et typée. Exemple **illustratif** :

```ts
type ChoiceColor = 'yellow' | 'red' | 'orange' | 'blue' | 'green' | 'purple'
type Compatibility = 'auto' | 'assisted' | 'teacher-led' | 'unsupported'
type Mechanic =
  | 'single-choice' | 'multiple-choice' | 'audio-choice'
  | 'match' | 'sequence' | 'sort' | 'geometry'
  | 'oral-guided' | 'observation'

type QuestionSource = {
  ficheId?: string
  recipeVersion: number
  pageIndex: number
  blockIndex: number
  itemIndex: number
  seed: number
  contentHash: string
}

type GameChoice = {
  id: string
  label?: string
  imageSrc?: string
  audioSrc?: string
  isVerified: boolean
}

type GameQuestion = {
  id: string
  source: QuestionSource
  mechanic: Mechanic
  compatibility: Compatibility
  title: string
  prompt: string
  choices?: GameChoice[] // 2 à 6, pas nécessairement toujours 6
  media?: Array<{ kind: 'image' | 'audio' | 'svg'; src: string; alt?: string }>
  evaluation: 'automatic' | 'teacher' | 'none'
  expectedChoiceIds?: string[]
  teacherExplanation?: string
  sourceInstruction?: string
  settings?: { maxListens?: number; showHint?: boolean }
}
```

**Important :** le `expectedChoiceIds` ne doit être projeté qu'au moment de révélation. En pratique, si une future application élève distante est ajoutée, les solutions seront **retenues côté serveur** et exclues des charges utiles élèves. Le navigateur enseignant n'est pas un coffre-fort : distinguer confidentialité visuelle et secret cryptographique.

Une séance contient `GameQuestion[]`, `currentIndex`, `phase`, `selectedChoiceIds`, `teacherVerdict`, `answerRevealed`, `timestamps`, `optionalScore`, `manualVotes`, `presetVersion`. Les réponses physiques non comptées restent absentes, et ne deviennent jamais de faux événements automatiques.

## 21. Cycle d'état obligatoire

> ⚠ **SUPPLANTÉ PAR §49** (vocabulaire d'états unique, table de transitions, invariants). Le schéma ci-dessous reste valable comme vue d'ensemble, mais les noms d'états du §49.1 prévalent.

```text
SETUP
  ↓
QUESTION_VISIBLE
  ↓
REFLECTION
  ↓ (action enseignant)
CARDS_UP / CLASS_VOTE
  ↓ (action élève au tableau)
BOARD_ANSWER_SELECTED
  ↓ (discussion facultative)
DISCUSSION
  ↓ (action enseignant uniquement)
REVEAL
  ↓
NEXT_QUESTION ou RETRY ou SESSION_SUMMARY
```

Transitions déterministes contrôlées par un `reducer` ou une machine à états dédiée, avec tests sur chaque action. Retour et reprise sans double comptage. Les réponses ne sont jamais perdues lorsque l'enseignant affiche un indice ou revient à la question précédente. « Révéler » et « Suivante » restent deux actions distinctes.

Cas spéciaux : texte libre/oral = `evaluation: teacher` ; médias absents = avertissement avant démarrage ; interruption/audio = pause ; exit fullscreen = session toujours accessible ; refresh = proposition de reprise locale sans exposer des informations sensibles.

## 22. Déterminisme et reproductibilité

`FicheRecipe` et `seed` doivent continuer à reproduire les questions. Pour le jeu, dériver une graine stable par **identifiant de source + index + version de conversion** afin que le mélange des cartes, l'ordre des distracteurs et l'enchaînement puissent être reproduits. Utiliser `createRng(seed)` existant, sans `Math.random()` dans les adaptateurs. Conserver dans le preset `conversionVersion` et `paletteVersion` ; ne pas écraser la recette d'origine.

Attention aux questions d'une fiche multipage : `buildWorksheets` peut couper un exercice en feuilles de suite ; l'identité de question ne doit pas reposer uniquement sur son index dans une feuille affichée. Utiliser l'identité de bloc et d'item source, et dédupliquer lors de la conversion.

## 23. Intégration avec les pages existantes

**Depuis `GeneratorPage.tsx` :** ajouter « Jouer avec la classe » en accès immédiat, utilisant le contenu actuellement généré, y compris le mode libre validé. Ouvrir une expérience de projection isolée des réglages A4. L'ancien `boardMode` et les composants `GameBoard` seront retirés après bascule.

**Depuis `SavedFichesPage.tsx` :** action « Jouer » sur chaque fiche ; aucune ressaisie ; paramètres de jeu enregistrables séparément. Les fiches sauvegardées continuent à fonctionner sans migration destructive.

**Depuis `src/App.tsx` / `routing.ts` :** nouvelle route `/interactif` pour un brouillon ouvert et `/interactif/:ficheId` pour une fiche existante, avec navigation et retour explicites. Tester l'accès direct aux URL et l'actualisation Vercel.

**Depuis l'API :** ne pas étendre immédiatement le format `FicheRecipe` v1 pour y insérer des champs de jeu. Ajouter un stockage de **presets** lié à l'ID de fiche, avec migration SQL et validation côté serveur après la sécurisation de l'authentification. Une première itération peut sauvegarder localement les paramètres non sensibles. Les recettes A4 existantes sont relues telles quelles.

## 24. Gestion de six couleurs, médias et réponses

- Un seul registre de couleur : ID stable, lettre, nom affiché, hex, couleur du texte, motif. Ne pas disperser les codes dans les composants.
- Ordre A–F stable pour la classe ; les réponses sont assignées à ces codes par question selon un mélange déterministe et équilibré.
- Imprimer les cartes depuis exactement le même registre, pour éviter les différences entre PDF et écran.
- Visuels lourds en chargement différé ; précharger la **question suivante** et ses médias lorsqu'autorisé ; ne pas tout charger en mémoire.
- Audio : s'appuyer sur les chemins/banques existants, avec contrôle d'erreur, lecteur robuste, indicateur d'écoute et consignes spécifiques.
- Images : conserver qualité suffisante, ratio, `alt` et possibilité d'agrandir ; aucune image cassée remplacée silencieusement par un symbole sans explication.
- Figures SVG existantes : réutiliser leur géométrie/moteur de calcul, adapter le rendu tactile plutôt que recopier leur capture A4.

---

# PARTIE VI — PARAMÈTRES, CORRECTION, SCORES ET DONNÉES

## 25. Réglages avant séance

L'écran « Préparer le jeu » doit rester **très court** par défaut :

- Titre du jeu, fiche et nombre de questions.
- Mécanique recommandée, éventuel choix parmi les compatibles.
- Mode « toute la classe vote » sélectionné par défaut.
- Correction : différée par défaut / immédiate (facultative, avec avertissement sur l'effet de copie).
- Chronomètre : désactivé par défaut.
- Points, équipes, sons, animations : désactivables indépendamment.
- Ordre des questions : celui de la fiche / mélangé / sélectionner blocs.
- Boutons : « Démarrer » et « Réglages avancés ».

Le choix de la palette est un **paramètre global de classe**, non un réglage qui change à chaque jeu.

## 26. Correction et affichage des résultats

Une réponse QCM est corrigée uniquement après révélation. Association/séquence : distinguer solution exacte et solution partielle ; fournir un retour compréhensible. Les questions ouvertes : afficher une piste de discussion et une proposition modèle identifiée comme telle. Le professeur peut marquer « réussi / à revoir / non évalué », sans fausse précision.

Le rapport final affiche : questions parcourues, réponses au tableau, corrigés révélés, questions à revoir, temps de séance si choisi. Si le professeur saisit un comptage A–F, afficher « vote compté manuellement ». Aucun profil nominatif, suivi automatique des six cartes, ou caméra ne sont présumés.

## 27. Scores et stimulation positive

Objectif : soutien à la progression, non compétition obligatoire. Paramètres :

- **Sans score** (défaut) ;
- points collectifs de réussite ;
- deux équipes facultatives **si l'enseignant organise réellement les réponses par équipes** ;
- étoiles/badges de manche discrets et désactivables ;
- « On réessaie » et « Bien expliqué » plutôt que pénalité publique.

Un score du groupe ne peut pas être dérivé des réponses physiques non collectées. Les statistiques qui existent concernent **l'action au tableau** et/ou le **comptage manuel de l'enseignant**.

## 28. Sauvegarde, vie privée et sécurité

- Au départ : session locale sans noms d'élèves, reprise facultative, données minimales.
- Presets enregistrables par fiche lorsque l'API et l'authentification sont prêtes.
- Audit prioritaire du dispositif d'accès existant : le dépôt contient de la logique d'accès côté navigateur et des valeurs de secours. Ne pas y ajouter des fonctionnalités collaboratives sensibles avant correction.
- Authentification **côté serveur** pour les routes et opérations de stockage ; autorisations par rôle/domaine contrôlées par l'API ; politique CORS explicite, limites de taille et débit, validation de schémas, journalisation sans secrets.
- Aucun mot de passe dans l'URL, dans un lien partagé ou dans un fichier de spécification. Faire tourner les secrets déjà exposés et ne pas les inclure dans le bundle client.
- Pas de photographie vidéo, d'analyse automatique des cartes physiques ni d'enregistrement vocal dans le MVP.
- Attention au droit d'auteur des banques d'images/audios, à la confidentialité des scénarios d'élèves et aux usages scolaires des données.

---

# PARTIE VII — PLAN D'IMPLÉMENTATION DÉTAILLÉ

## 29. Stratégie de migration sans casse

**Approche recommandée : substitution progressive.** Écrire la nouvelle version dans `src/interactive/`, en parallèle du système existant, mais avec **aucune dépendance au vieux contrat `PlayRound`**. Pendant le développement, un indicateur interne ou une route dédiée permet de comparer. Dès que les tests de non-régression sont satisfaits, le bouton « Jeu » bascule sur le nouveau module ; supprimer ensuite les anciens composants de jeu, leurs états et le CSS inutilisé. Le système A4 reste constamment utilisable.

### Étape 0 — Cartographie et cadrage (P0)

**Actions :**

- Inventorier automatiquement tous les `exerciseType`, `layout`, domaines et types réellement générés.
- Générer des fixtures déterministes représentatives et des exemples de rendu pour chaque famille.
- Classer les types `auto/assisted/teacher-led/unsupported` ; vérifier options, réponse, images, audios, barèmes.
- Photographier / tester l'ENI cible, les navigateurs, la lisibilité depuis le fond de la salle et les six vraies cartes de couleur ; valider la palette.
- Définir la matrice officielle d'acceptation par domaine et mécanique.
- Créer une branche de développement, tests de base, pipeline CI et référence de régression A4.

**Livrables :** inventaire en JSON/CSV, matrice de compatibilité, carte des risques, design direction et fixtures. **Critère de sortie :** aucune catégorie importante n'est ignorée ou présentée faussement comme compatible.

### Étape 1 — Design system et prototype de rituel à six couleurs (P0)

**Actions :**

- Définir tokens, composants, polices, cartes A–F, iconographie, états, transitions, mode projection.
- Concevoir les écrans : préparation, question, vote, sélection tableau, discussion, révélation, bilan.
- Construire la grille 3×2 adaptable avec palettes paramétrables et conformité contraste.
- Mettre au point le kit imprimable de six cartes physiques.
- Prototyper **une addition réelle, un QCM, une question audio** avec le déroulement complet et les contrôles enseignant.
- Tester au tableau **avec un élève au premier plan et les autres avec les six cartes** ; observer biais de copie, temps de vote et lisibilité.

**Livrables :** bibliothèque visuelle, prototype jouable, impression des cartes, retours enseignants. **Critère de sortie :** l'expérience est compréhensible et agréable sans ancien `GameBoard`.

### Étape 2 — Moteur de contenu et adaptateurs (P0)

**Actions :**

- Définir `GameQuestion`, `GameSession`, `GamePreset`, validation runtime et erreurs typées.
- Développer la conversion depuis recettes et items, sans parser l'image/PDF des fiches.
- Adaptateurs initialement maths, QCM TCF/TPF et grammaire, puis géométrie/soutien/oral/jeux imprimables.
- Mécanisme de distracteurs validés et mélange déterministe, gestion 2–6 propositions.
- Références d'images/audio robustes, mode libre, recettes sauvegardées.
- Tests de reproductibilité et de non-ambiguïté ; conserver source/indices pédagogiques.

**Livrables :** `convertFicheToGame()`, adaptateurs, fixtures de validation. **Critère de sortie :** aucune conversion silencieuse trompeuse ; même recette et graine = même activité.

### Étape 3 — Moteur de séance collective (P0)

**Actions :**

- Implémenter le cycle réflexion → cartes levées → réponse tableau → discussion → correction → question suivante.
- Historique, précédent/suivant, pause/reprise, fin, relancer erreurs, prise en charge manuelle des questions ouvertes.
- Séparation des événements `boardAnswer`, `teacherReveal`, `manualVoteCount`, `teacherMark`.
- Score collectif optionnel sans fabriquer de statistiques élèves.
- Gestion d'une série entière, pas une question isolée qui force une régénération.

**Livrables :** moteur de session testable sans UI, intégration dans l'interface, récapitulatif. **Critère de sortie :** aucune révélation accidentelle ni double comptage.

### Étape 4 — MVP de classe, déploiement piloté (P0)

**Périmètre obligatoire :** M01, M02, M03 et M04 ; A–F constants ; contrôle enseignant ; progression ; correction différée ; plein écran ; audio ; kit de cartes ; lancement depuis fiche ouverte et fiche sauvegardée ; un bilan minimal.

> ⚠ **PRÉCISÉ PAR §70.1** : le périmètre du MVP inclut **M14-lite** (nécessaire à la production orale guidée), la feuille de séance enseignant, la persistance avec reprise, le précontrôle des médias, le comptage manuel simple et la page de diagnostic ; **M07 (remise en ordre d'images) reste P1.**

**Vérifications réelles :** 4 scénarios complets (addition, compréhension audio, production orale guidée en mode enseignant, aire de carré) sur deux tailles d'ENI et un ordinateur classique ; aucune régression A4, aucune fuite d'option correcte avant révélation.

**Livrables :** MVP déployable derrière activation contrôlée ; feuille de tests de classe. **Critère de sortie :** séance complète menée sans recourir à l'ancien mode jeu.

### Étape 5 — Jeux manipulables et richesse disciplinaire (P1)

**Actions :**

- M05 à M10 : texte à compléter, association, ordre, tri, géométrie, intrus.
- Motorisation de la prédiction A–F lorsque c'est pertinent avant manipulation au tableau.
- Adaptateurs approfondis : alphabétisation, soutien FR, logique, grammaire, domaines TPF/TCF.
- Visuels SVG, zones tactiles, retour partiel, lecture des consignes, support FALC.

**Livrables :** bibliothèque de mécaniques et couverture multi-domaines vérifiée. **Critère de sortie :** les activités restent pédagogiquement justes, sans « QCM forcé ».

### Étape 6 — Bibliothèque et préparation enseignant (P1)

**Actions :**

- Parcours « Mes fiches » → « Jouer », presets distincts des recettes A4, filtre par domaine/compétence/type.
- Préparation rapide, séries personnalisables, révision des questions difficiles.
- Paramètres globaux de palette, sons, motion, lisibilité ; impressions de cartes.
- Enregistrement de métadonnées minimales après sécurisation de l'API.

**Livrables :** bibliothèque utilisable au quotidien, presets, reprise. **Critère de sortie :** aucun enseignant ne doit reconfigurer 15 options à chaque séance.

### Étape 7 — Jeux enrichis et maturation (P2)

**Actions :**

- Memory, loto, suites complexes et autres variantes à forte valeur.
- Deux équipes ou vote avant/après, si réellement éprouvés en classe.
- Documentation enseignants, guide des six cartes, exemples de séances, contrôles d'accessibilité avancés.
- Tests de performance et revue de sécurité ; maintenance et nettoyage intégral de l'ancien module.

**Livrables :** V1 aboutie et dossier de recette d'acceptation. **Critère de sortie :** ancien jeu retiré proprement, aucune duplication d'architecture.

## 30. Backlog priorisé et dépendances

| ID | Travail | Priorité | Dépend de | Preuve de fin |
|---|---|---|---|---|
| F01 | Inventaire exerciseType/layout par domaine | P0 | — | Rapport généré et relu |
| F02 | Maquettes 6 cartes / grande projection | P0 | — | Tests 16:9 et couleurs physiques |
| F03 | Registre global couleur+lettre+motif | P0 | F02 | Même palette écran/PDF |
| F04 | Kit imprimable A4 des six cartes | P0 | F03 | Six cartes nettes sur papier |
| F05 | Modèle `GameQuestion` + validateurs | P0 | F01 | Schémas et tests |
| F06 | Adaptateur maths + distracteurs | P0 | F05 | Calculs exacts, 2–6 choix valides |
| F07 | Adaptateur QCM TPF/TCF | P0 | F05 | Bonnes réponses/images conservées |
| F08 | Lecteur audio robuste | P0 | F07 | Écoute/pause/reprise/erreur testées |
| F09 | `SixColorGrid` responsive | P0 | F03,F05 | Toucher, clavier, lettres A–F |
| F10 | Machine à états des sessions | P0 | F05 | Tests complets de transitions |
| F11 | Toolbar enseignant et révélation | P0 | F09,F10 | Corrigé invisible avant action |
| F12 | Navigation série complète + reprise | P0 | F10 | Toutes questions parcourues |
| F13 | Intégration `GeneratorPage` | P0 | F05,F11 | Bouton jouer sur brouillon |
| F14 | Intégration `SavedFichesPage` | P0 | F05,F11 | Bouton jouer sur fiche sauvée |
| F15 | Bilan collectif sans fausses stats | P0 | F10 | Séparation tableau/votes manuels |
| F16 | Tests A4 et CI | P0 | F01 | Aucun changement visuel non voulu |
| F17 | Pilote ENI réel | P0 | F06–F16 | Enseignant valide quatre scénarios |
| F18 | Séquences/images/manipulations | P1 | F05,F10 | Tri et ordre au doigt |
| F19 | Grammaire/soutien/alpha | P1 | F05 | Matrice d'adaptation validée |
| F20 | Géométrie / fractions | P1 | F05,F18 | Figures et unités justes |
| F21 | Presets liés aux fiches | P1 | F13,F14 + sécurité | Réouverture cohérente |
| F22 | Sécurisation API/auth | P0 sécurité | Audit | Contrôle serveur prouvé |
| F23 | Modes équipes et vote avant/après | P2 | F10,F17 | Réel bénéfice observé |
| F24 | Retrait du vieux mode jeu | P1 | F17 + régressions | Plus de dépendance au legacy |

### Dépendances critiques

`F01 → F05 → F06/F07 → F10 → F11/F12 → F13/F14 → F17` ; en parallèle `F02 → F03 → F04/F09`. Les tests `F16` commencent dès F01 et continuent à chaque étape. La sécurité `F22` précède tout nouveau stockage partagé de sessions/presets côté serveur.

## 31. Organisation en incréments livrables

**Incrément A — Prototype d'usage.** Une addition et un QCM, six cartes, vote puis tableau puis révélation. Le kit de cartes est prêt. Décision : lisibilité et pertinence du rituel.

**Incrément B — MVP réel.** Fiches en cours et enregistrées, plusieurs questions, son, correction, navigation, reprise, bilan, tests. Décision : peut-on animer une véritable séance de classe ?

**Incrément C — Couverture pédagogique.** Associations, ordre, géométrie, oral, soutien, grammaire. Décision : cohérence visuelle et justesse de conversion.

**Incrément D — Usage quotidien.** Bibliothèque, presets, maintenance, nettoyage legacy, sécurité et documentation. Décision : peut-on utiliser l'outil quotidiennement sans assistance technique ?

Aucune durée forfaitaire n'est fixée ici sans inventaire de l'ensemble des variantes et tests sur les équipements réels. Estimer les charges **après F01 et F02** ; réserver explicitement du temps à la validation pédagogique, aux écrans tactiles et aux médias, pas seulement au code.

## 32. Stratégie de qualité et tests

### Unitaires

- Conversion d'items de chaque type ; validation de corrigés, gestion de nombres, unités, textes/accents et réponses alternatives.
- Propriétés des distracteurs : exactement une bonne réponse pour `single-choice` ; choix distincts ; aucune option équivalente ; au plus six.
- Reproductibilité par graine et conservation du mode libre.
- États de séance : révélation uniquement sur demande, navigation, pause, reprise, fin, retard ou absence d'audio.
- Color registry : correspondance stable A–F et impression.

### Composants et navigation

- Interaction tactile/pointer, souris, clavier ; grandes cartes et zones de dépôt ; réduction des mouvements.
- Audio chargé/en erreur, images disponibles/absentes, zoom, lecteur d'écran.
- Plein écran, changement résolution, rafraîchissement, liens directs de fiche, retour sans perte.

### End-to-end et non-régression

- Playwright ou outil équivalent sur Chrome/Edge et navigateur réel de l'ENI.
- Capture/rendu de références A4 pour garantir l'absence de changement du générateur imprimable.
- API/autorisation : lecture et mise à jour de fiche autorisées par rôle, pas seulement par filtrage en frontend.
- Mesure performance : navigation fluide, médias préchargés prudemment, aucun blocage sur banque lourde.

### Test d'acceptation en vraie classe

1. Enseignant lance une fiche existante en deux actions.
2. Tous les élèves comprennent quelle carte physique correspond à quelle proposition.
3. L'élève au tableau manipule sans gêne ni touches ratées.
4. La classe vote avant que la réponse au tableau soit divulguée.
5. L'enseignant dispose du temps d'expliquer puis révèle ; l'application **ne passe pas seule** à la suite.
6. Une fiche de six questions est terminée, puis une nouvelle manche est lancée.
7. Le son n'est jamais lancé à contresens de la consigne.
8. Les mêmes fiches se réimpriment correctement en A4.

## 33. Définition de terminé (Definition of Done)

Un lot est terminé seulement si : son scénario de classe fonctionne ; ses types sont documentés et testés ; ses interfaces sont lisibles sur ENI ; ses états correction/vote sont sans fuite ; ses contenus respectent le corrigé ; les élèves peuvent participer par six cartes quand la mécanique le permet ; les variantes non prises en charge sont signalées ; les tests automatisés et A4 passent ; l'enseignant peut reprendre le contrôle à tout moment ; aucune statistique fictive n'est présentée.

## 34. Risques, arbitrages et réponses

| Risque | Impact | Prévention / réponse |
|---|---|---|
| Élèves copient l'élève au tableau | Vote collectif inutile | Vote simultané **avant** la sélection visible |
| Six choix artificiels créent des erreurs pédagogiques | Apprentissage faussé | 2–6 actifs, distracteurs validés, mode enseignant |
| Couleurs confondues au projecteur/papier | Réponses ambiguës | Lettre A–F + motif + contraste + test matériel |
| Contrôle enseignant dévoile le corrigé | Perte d'intérêt | Machine à états, révélation explicite et tests |
| Source d'exercice très hétérogène | Conversions incomplètes | Audit par `layout` et `exerciseType`, adaptateurs typés |
| Audio/image lourd, indisponible | Séance interrompue | Précontrôle média, préchargement, erreur lisible |
| Confusion entre score tableau et participation classe | Statistiques trompeuses | Origine des données explicite, aucun score fictif |
| Refonte casse les fiches imprimées | Régression majeure | Isoler nouveau moteur, référence A4, bascule progressive |
| Ancien accès basé en partie sur le client | Sécurité insuffisante | Audit et contrôle serveur avant partage des données |
| Design trop enfantin pour des adolescents et des adultes FLE | Rejet par certains publics | Design adolescent premium, pas de cliparts/mascottes, animations optionnelles |
| Fiches très longues | Séances difficilement pilotables | Sélection de blocs, limites de manche, reprise |

---

# PARTIE VIII — CONSIGNES EXÉCUTABLES POUR L'ÉQUIPE DE DÉVELOPPEMENT

## 35. Ordre des opérations à transmettre au développeur / agent de code

1. **Ne pas commencer par ajouter un jeu au module actuel.** Créer un dossier `src/interactive` autonome ; l'ancien `game-board` est un héritage à remplacer.
2. Produire d'abord l'inventaire de compatibilité des contenus du dépôt, avec fixtures de questions issues de la vraie génération.
3. Valider le système physique **six cartes A–F** : palettes, lisibilité, PDF de découpe, équivalences écran/papier, déroulement du vote collectif.
4. Maquetter les sept écrans/états clefs avant de figer les composants.
5. Construire la couche de conversion en fonctions pures, sans modifier `FicheRecipe` v1 ni réutiliser le layout A4 comme source d'interaction.
6. Construire le moteur de séance **sans UI**, avec un `reducer` testé ; brancher ensuite l'interface de projection.
7. Ajouter les boutons « Jouer » dans générateur et fiches sauvegardées, puis les routes, sans retirer l'impression.
8. Valider les quatre scénarios réels en situation sur ENI.
9. Étendre famille par famille avec critères de qualité, plutôt que chercher une compatibilité artificielle à 100 %.
10. Bascule finale, nettoyage de `boardMode` et du `src/components/game-board` hérités, suppression des CSS/states abandonnés et documentation.

## 36. Décisions fonctionnelles et artistiques considérées comme approuvées pour la V3

- Refonte du module interactif **de zéro**, oui ; réécriture de l'ensemble des générateurs de fiches, non.
- Jeu **collectif** prioritaire, élèves avec cartes physiques ; aucun terminal élève requis.
- Six couleurs avec correspondance stable A–F, palette configurable, lettres/motifs obligatoires.
- **Vote des cartes avant réponse au tableau** comme rituel par défaut ; enseignant maître du rythme.
- Correction différée **sur commande** ; pas de passage automatique obligatoire.
- 2–6 choix valides, sans faux distracteurs ; six cartes toujours disponibles mais seuls les choix pertinents actifs.
- Activités ouvertes conservées comme activités ouvertes ; l'oral est guidé, non auto-noté.
- Statistiques du tableau et éventuel comptage manuel de classe séparés.
- Mise en production contrôlée et sauvegarde des fiches A4 intacte.
- **Style adolescent, moderne et ludique, pas enfantin**, choix typographiques forts, surfaces nettes, effets mesurés et mêmes composants dans tous les domaines.
- Par défaut, le design de jeu exploite les 6 couleurs seulement pour les réponses : les autres surfaces restent calmes.

## 37. Questions restantes pour une validation de design après prototype

Ces points n'empêchent pas la réalisation du premier prototype : vérifier **la teinte exacte des six cartes déjà possédées**, le modèle/résolution de l'ENI, le public prioritaire (adultes FLE, jeunes, mixte), l'usage souhaité du minuteur et des équipes, ainsi que le besoin éventuel d'une tablette professeur privée. Ces choix doivent être confirmés **avec une démo tactile et de vraies cartes**, pas seulement sur une capture d'écran. **Valeurs par défaut proposées pour ne pas bloquer le développement : §72.**

---

## Annexe A — Liste de contrôle d'une première mise en service

- [ ] Les six cartes papier A–F correspondent exactement aux boutons de l'écran.
- [ ] Les six lettres sont reconnaissables sans dépendre des couleurs.
- [ ] « Vote avec vos cartes » précède la sélection au tableau.
- [ ] La réponse correcte n'est visible qu'après « Révéler ».
- [ ] La question suivante est choisie par l'enseignant.
- [ ] Trois à six questions d'une même fiche se succèdent correctement.
- [ ] Les audios et les images fonctionnent à la bonne résolution.
- [ ] L'enseignant peut contourner un exercice ouvert sans faux QCM.
- [ ] La palette reste stable entre questions et sessions.
- [ ] Les scores, chronos et effets peuvent être désactivés.
- [ ] Les fiches imprimées et les anciennes sauvegardes fonctionnent toujours.
- [ ] Le bilan n'attribue aucun score individuel aux cartes physiques.

## Annexe B — Sources techniques du périmètre étudié

- Dépôt : https://github.com/oasi-phuoc/doc-prof
- `src/components/game-board/GameBoard.tsx`, `play-model.ts`, `GameSetupBar.tsx`, `GameTimer.tsx` (héritage à remplacer)
- `src/components/generator/GeneratorPage.tsx`, `ResultPanel.tsx`, `SavedFichesPage.tsx`, `routing.ts`
- `src/math/types.ts`, `src/math/generate.ts`, `src/math/catalog.ts`, `src/math/rng.ts`
- `src/fiches/recipe.ts`, `src/fiches/api.ts`, `api/fiches/src/index.ts`
- `src/tcf/types.ts`, `src/tcf/co-audio-playlist.ts`, `src/grammaire/exercises/types.ts`
- `src/jeux/types.ts`, `src/jeux/templates.ts`

**Nature des constatations :** audit statique ciblé de l'architecture et de fichiers représentatifs ; l'inventaire exhaustif des types, les tests ENI et la validation pédagogique doivent encore être exécutés dans les premières étapes du projet.

---

# PARTIE IX — EXÉCUTION PRÉCISE PAR CODEX (ANNEXE CONTRACTUELLE V3)

## 38. Ordre d'exécution des lots (sans ambiguïté)

### Lot C0 — Vérification du dépôt et des contraintes réelles

**Entrées :** dépôt actuel, fichiers `CLAUDE.md`, `package.json`, `src/components/generator/*`, `src/math/*`, `src/fiches/*`, `src/tcf/*`, `src/jeux/*`, `src/components/game-board/*`.

**Travail :**
- Dresser une carte des flux actuels de génération, de sauvegarde, de mode libre et de rendu A4.
- Lister **tous** les `exerciseType` et les `layout` ; relier chaque famille à ses champs disponibles (`prompt`, `answer`, `options`, `images`, `audio`, figure, etc.).
- Vérifier les espaces de noms, le routage, la taille des bundles et les voies d'authentification sans exposer de secrets.
- Créer dans `docs/interactive/` un inventaire de compatibilité versionné et des fixtures qui reproduisent de vraies questions.

**Livrable vérifiable :** tableau d'inventaire `domain / exerciseType / layout / exemples / média / corrige / conversion / risques`, et une liste de tous les types impossibles à convertir automatiquement.

### Lot C1 — Bibliothèque graphique et prototype interactif « six cartes »

**Travail :** mettre en œuvre les design tokens, `ProjectionShell`, `SixColorGrid`, `TeacherToolbar`, `QuestionStage`, `CardChoice`, les variantes responsive et les composants d'état. Ajouter un kit A–F imprimable, écran de contrôle des couleurs et option de remappage avant la séance.

**Démonstration obligatoire :** six cartes A–F sur un fond premium et apaisé, question très lisible, élève qui sélectionne, correction masquée jusqu'au clic enseignant, séquence de vote visible. Tout doit fonctionner à la souris, au doigt et au clavier.

### Lot C2 — Modèle canonique, adaptateurs et génération pédagogique

**Travail :** modèle `GameQuestion` discriminé, adaptateurs par famille, registre de compatibilité, gestion fiable des assets, génération de distracteurs validée et déterministe, conservation des corrigés et des justifications. Refuser explicitement les conversions incertaines.

**Livrable vérifiable :** conversion de **vraies** additions, QCM FLE, audios, images, réponses ouvertes ; tests de toutes les branches déjà implémentées.

### Lot C3 — Moteur de séance et navigation réelle

**Travail :** machine à états sans dépendances DOM ; session de toutes les questions choisies ; précédent/suivant/saut, pause/reprise, réinitialisation ; correction enseignant seule ; suivi d'actions réel ; bilan de classe sans données inventées. Sauvegarde temporaire locale non sensible si besoin, isolée par session.

**Livrable vérifiable :** six questions successives d'une fiche, navigation arrière puis retour, coupure/rechargement et reprise sans révélation anticipée.

### Lot C4 — Points d'entrée de doc-prof

**Travail :**
- Ajouter « Jouer » depuis le générateur courant, sans toucher aux actions Imprimer / Corrigé.
- Ajouter « Jouer » sur les fiches enregistrées.
- Mettre en place un écran « Préparer une séance » : sélection de pages/blocs/questions, mécanique compatible, option six choix si justifiée, validation des médias, prévisualisation.
- Introduire les nouvelles routes ; gérer accès direct, retour au générateur et retour aux fiches.
- Prévoir un contrôle d'accès serveur cohérent avec les domaines autorisés (pas de confiance dans les rôles du front).

**Livrable vérifiable :** parcours complet sans copier-coller de données ni ressaisie de questions.

### Lot C5 — Quatre scènes de recette + couverture par domaines

Implémenter en priorité les quatre scénarios du §17 puis étendre : compréhension écrite, grammaire, alphabétisation, soutien, logique, géométrie, jeux de cartes papier réutilisables. Pour chaque mécanique : une fixture réaliste, tests de convertisseur, tests UI, une capture ENI et un fallback honnête.

**Livrable vérifiable :** matrice de couverture exacte publiée et mise à jour avec `auto / assisted / teacher-led / unsupported` ; aucun domaine annoncé compatible simplement parce qu'il figure au catalogue.

### Lot C6 — Finition, sécurité, tests et bascule

**Travail :** animations et sons configurables, accessibilité, performantes variantes media, thèmes clair et haut contraste, kit de cartes, réponses courtes, modes équipes optionnels, documentation. Tester le routage et l'A4. Une fois le nouveau parcours validé, retirer les anciens composants `game-board`, leurs états dans `GeneratorPage` et leurs feuilles CSS devenues inutiles, sans faire disparaître `src/jeux` (banques imprimables).

**Livrable vérifiable :** build propre, tests, mode A4 intact, zéro import legacy dans la nouvelle expérience, compte rendu de vérification sur écran tactile réel ou mention honnête si non testé.

## 39. Modèle de données minimum à respecter

> ⚠ **SUPPLANTÉ PAR §48** (modèle canonique unifié) **et §49** (états). Les invariants de cette section sont repris et précisés au §48.7 ; en cas d'écart de noms, la table du §48.8 fait foi.

Le contrat précis sera finalisé après l'audit, mais les invariants suivants doivent être présents :

```ts
type ColorCardId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type GameCompatibility = 'auto' | 'assisted' | 'teacher-led' | 'unsupported';
type QuestionPhase =
  | 'intro' | 'thinking' | 'cards-up'
  | 'board-turn' | 'discussion' | 'revealed' | 'explained';

type QuestionKind =
  | 'single-choice' | 'multi-choice' | 'matching' | 'ordering'
  | 'sorting' | 'grid' | 'geometry' | 'open-oral' | 'open-written'
  | 'audio-choice' | 'observation';

interface SourceReference {
  ficheId?: string;
  sourcePageIndex: number;
  sourceBlockIndex: number;
  sourceItemIndex: number;
  sourceType: string; // exerciseType exact d'origine
  originalSeed: number;
}

interface GameOption {
  id: ColorCardId;       // association physique constante
  label: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface GameQuestionBase {
  id: string;             // stable, déterministe, distinct
  source: SourceReference;
  title: string;
  instruction: string;
  kind: QuestionKind;
  options?: GameOption[]; // 2 à 6 choix si choix proposés
  compatibility: GameCompatibility;
  media?: Array<{
    type: 'image' | 'audio';
    url: string;
    alt?: string;
    transcript?: string;
  }>;
  durationHintSec?: number;
  feedback?: {
    explanation?: string;
    hints?: string[];
  };
}

interface GamePreset {
  version: 1;
  sourceFicheId?: string;
  selectedQuestionIds: string[];
  templateByQuestionId: Record<string, QuestionKind>;
  fixedColorMapping: Record<ColorCardId, string>;
  revealPolicy: 'teacher-only';
  timerEnabled: boolean;
  scoringEnabled: boolean;
}

interface GameSessionState {
  sessionId: string;
  questionIds: string[];
  currentIndex: number;
  phase: QuestionPhase;
  selectedOptionIds: string[];
  teacherRevealed: boolean;
  status: 'ready' | 'running' | 'paused' | 'completed';
}
```

**Impératif :** distinguer `correctOptionIds` dans un objet de correction non transmis à l'interface de vote avant révélation. Le contrôle par machine à états doit éviter une fuite visuelle, même si le correctif existe dans la mémoire client. Les réponses doivent rester déterministes pour une recette donnée ; le jeu peut mélanger les choix avec une graine distincte dérivée de celle du document.

Ne pas stocker le seul libellé comme identifiant unique : deux choix peuvent avoir la même chaîne ou être des images. Prévoir un ID stable, les bonnes réponses par ID et des variantes mathématiques équivalentes.

## 40. Contrôle de qualité — obligations renforcées

- Utiliser `npm ci`, `npm run build`, `npm run lint` quand l'environnement le permet. Si le dépôt ne définit pas encore un script `test`, créer une suite de tests et une commande `npm test`.
- Tests unitaires avec un environnement React/TypeScript adapté ; tests end-to-end navigateur pour au moins les parcours P0.
- Tests de non-régression des valeurs : aucune addition fausse, aucune réponse ambiguë, aucun choix dupliqué, bonne unité de géométrie, conservation des accents et ponctuation.
- Vérifier l'absence d'exposition des bonnes réponses dans le DOM visible avant révélation ; l'élève ne voit pas les hints enseignant par mégarde.
- Ne pas dégrader les captures A4 de référence, les fiches enregistrées ni les pages protégées.
- Pour tous les tours, gérer les erreurs : audio absent, image invalide, fiche supprimée, navigation arrière, refresh, internet indisponible.
- Mesurer la lisibilité sur plusieurs résolutions ; **ne pas promettre un test physique ENI** quand il n'a pas réellement eu lieu.
- Prévoir un mode `prefers-reduced-motion`, contraste renforcé, navigation clavier et solution sans glisser-déposer.

## 41. Sécurité, données et permissions

1. Le site contient des mécanismes de mot de passe dans l'accès frontend et dans l'API. **Auditer et corriger**, en priorité l'absence de secrets dans le bundle et dans les logs.
2. Vérifier le filtrage **serveur** de toutes les opérations sur fiches, présélections et séances. Un simple filtre de liste frontend ne sécurise rien.
3. Par défaut **pas de compte ni de suivi individuel élève**, pas de photographie de classe, pas de caméra, pas d'enregistrement oral, pas de stockage de votes physiques.
4. Les sauvegardes locales doivent rester faciles à effacer ; aucune donnée nominative dans les statistiques.
5. Appliquer CORS de manière contrôlée sur les nouvelles routes, validation serveur des payloads, limites de volume et permissions.
6. Maintenir la compatibilité avec `FicheRecipe` version 1 ; créer un **modèle de preset de jeu séparé** plutôt que casser les sauvegardes existantes.

## 42. Livrables écrits attendus de Codex

Créer ou maintenir dans le dépôt :

```text
docs/interactive/
  README.md                      # vision d'usage et comment lancer le mode jeu
  cahier-des-charges.md          # référence de ce document, éventuellement en lien
  audit-compatibilite.md         # inventaire par type réel
  design-system.md               # tokens, responsive, états, composants, captures
  regles-six-cartes.md           # kit papier, lettre/couleur/motif, rituel de vote
  architecture.md                # modèles, adaptateurs, données, routing
  guide-enseignant.md            # parcours écran et 6 cartes
  checklist-acceptation.md       # scénarios testés et non testés
  migration-ancien-mode.md       # remplacement et retrait sans casse
```

Documenter les scripts installés, les nouvelles dépendances justifiées, les limitations connues et les échecs observés. Fichiers supplémentaires exigés par la V4 : voir §74.

## 43. Backlog d'acceptation final : 22 scénarios obligatoires

- [ ] 01. Une fiche déjà sauvegardée lance le nouveau jeu.
- [ ] 02. Une fiche en cours de création lance le jeu sans devoir être sauvegardée.
- [ ] 03. L'impression A4 de la même fiche reste identique.
- [ ] 04. Six cartes physiques A–F s'alignent avec six réponses projetées, sans recalibrage à chaque question.
- [ ] 05. Si seules trois réponses sont valides, A/B/C sont actifs et D/E/F ne créent pas de faux distracteurs.
- [ ] 06. La classe peut réfléchir avant toute réponse visible au tableau.
- [ ] 07. Le signal « Levez votre carte » est clairement visible.
- [ ] 08. L'élève au tableau sélectionne une carte tactile sans correction automatique.
- [ ] 09. L'enseignant révèle manuellement la réponse.
- [ ] 10. Une réponse fausse est expliquée sans signal humiliant ni couleur ambiguë.
- [ ] 11. Les six questions d'une fiche se suivent sans régénérer la fiche à chaque fois.
- [ ] 12. On peut revenir à une question passée sans perdre l'historique de manière incohérente.
- [ ] 13. Un QCM de compréhension orale utilise le bon audio avec lecture/pause/réécoute.
- [ ] 14. Une séquence de quatre images s'affiche assez grande et se réordonne tactilement.
- [ ] 15. Une production orale se corrige humainement et ne reçoit pas de note inventée.
- [ ] 16. Une aire en cm² et une addition donnent des réponses exactes.
- [ ] 17. Les distracteurs sont distincts et une seule réponse correcte existe si question `single-choice`.
- [ ] 18. Le jeu reste utilisable à 1366×768 sans texte coupé.
- [ ] 19. Le mode sans son/mouvement reste utilisable.
- [ ] 20. Les médias manquants affichent une erreur compréhensible sans casser la séance.
- [ ] 21. Le bilan distingue score du joueur au tableau, vote de groupe non compté, et observations professeur.
- [ ] 22. L'interface adulte/adolescent répond à la charte : look contemporain, ludique, net, ni bébé ni surcharge décorative.

> Scénarios d'acceptation complémentaires 23 à 35 : voir §71.2.

## 44. Critères de refus d'une implémentation

L'implémentation est **non conforme** si elle se limite à modifier les CSS de l'ancien `GameBoard`, si elle impose un appareil par élève, si elle génère six propositions erronées ou ambiguës, si la bonne réponse apparaît avant l'action du professeur, si elle ne propose que `rounds[0]`, si elle attribue des points à des élèves qui ont levé des cartes non numérisées, si elle casse une fiche A4, si elle masque un domaine incompatible sans explication, ou si son esthétique est destinée à la maternelle.

## 45. Dernière instruction à Codex

**Commence par livrer C0 + C1 + une première tranche C2/C3/C4 pleinement fonctionnelle, démontrant le rituel A–F en classe et une séance de plusieurs questions.** Présente à l'utilisateur les choix d'interface et les captures avant de généraliser. Continue ensuite les lots par familles, en gardant les priorités et en signalant honnêtement les zones qui requièrent une revue humaine ou un test sur l'écran interactif réel.

**Ce cahier des charges décrit la cible ; les fonctionnalités sont à développer. Il ne prétend pas qu'elles existent déjà.**

---

# PARTIE X — COMPLÉMENTS V4 : RÉCONCILIATIONS ET SPÉCIFICATIONS MANQUANTES

> **Statut normatif.** La PARTIE X **complète** les Parties I à IX et **prévaut en cas de contradiction**. Quand une section antérieure est remplacée, elle porte en tête un bandeau « ⚠ SUPPLANTÉ ». Rien n'est supprimé des Parties I à IX : elles restent lisibles pour la traçabilité.
>
> **Honnêteté des constats.** Les affirmations sur le dépôt (noms de fichiers, signatures, scripts, versions) viennent de la V3 et **n'ont pas été revérifiées pour la V4** : elles sont à confirmer au lot C0. Les valeurs chiffrées marquées *proposition* (seuils, budgets, tailles relatives) sont des points de départ à calibrer sur matériel réel, pas des mesures. Les contrastes et distances de couleur du §58 ont, eux, été **calculés par script** (méthode donnée) et sont reproductibles.
>
> **Convention de lecture.** Les blocs de code TypeScript sont des **extraits normatifs non compilés** : les invariants sont obligatoires, les noms peuvent être ajustés après l'audit C0 à condition de tenir la table de correspondance du §46.

## 46. Registre de réconciliation V3 → V4

| # | Problème repéré dans la V3 | Décision V4 | Voir |
|---|---|---|---|
| 1 | Deux modèles de données concurrents (§20 `GameQuestion`, §39 `GameQuestionBase`) | Un seul modèle : question publique + clé de réponse séparée + plan de séance | §48 |
| 2 | Trois vocabulaires d'états (§8 bis, §21, §39) | Un vocabulaire `QuestionPhase`, table de correspondance, table de transitions | §49 |
| 3 | Solution portée par la question (`expectedChoiceIds`, §20) ou par un objet séparé (§39) | `AnswerKey` séparée ; l'état de séance ne contient jamais la clé | §48, §49 |
| 4 | Identité du choix confondue avec la carte (`GameOption.id: ColorCardId`, §39) alors que §24 mélange les positions | `choiceId` stable (contenu) distinct du `slot` A–F (position après mélange) | §48, §50 |
| 5 | Palette dans le preset (`fixedColorMapping`, §39) alors que §25 en fait un réglage global | `ClassroomSettings` global ; le preset ne garde que `paletteVersion` | §48 |
| 6 | MVP limité à M01–M04 (§29, étape 4) mais scénario S03 (production orale guidée) exigé à la recette MVP | **M14-lite** promue P0 ; M07 et M14 complète restent P1 | §54, §70 |
| 7 | « Correction immédiate » (§25) ambiguë face à « révélation par l'enseignant » (Priorité 3, `revealPolicy: 'teacher-only'`) | « Immédiate » = phase discussion sautée et bouton Révéler mis en avant ; **jamais** de révélation automatique | §55 |
| 8 | `RETRY` cité (§21) sans définition | Sémantique de nouvelle tentative, d'historique et de relance des erreurs | §55 |
| 9 | Révélation accidentelle sans récupération possible | `TEACHER_UNREVEAL` et protections anti-fausse manœuvre | §49, §57 |
| 10 | Comptage manuel autorisé (§6, §26) sans interface ni règles | Panneau de comptage, validations, étiquetage d'origine | §56 |
| 11 | Sur écran unique, l'enseignant n'a aucun endroit privé pour voir la bonne réponse | Feuille de séance imprimable (P0), console en seconde fenêtre (P1), tablette (P2) | §57 |
| 12 | « Reprise locale » (§21, §28) sans format ni politique | Journal d'événements + plan déterministe, IndexedDB, durée de vie | §63 |
| 13 | Transmission du brouillon vers `/interactif` non définie (§23) | Remise par IndexedDB (`draftId`) | §64 |
| 14 | Sécurité exprimée en intentions (§28, §41) | Plan actionnable S1–S8, tests d'acceptation, SQL illustratif | §65 |
| 15 | Distracteurs : exemples sans familles d'erreurs (§16) | Catalogue de familles, validation exacte, analyse d'erreurs après révélation | §52 |
| 16 | Mécaniques M05–M14 sans contrat de données ni règle d'évaluation | Fiche de spécification par mécanique | §54 |
| 17 | Seuils non mesurables (« lisible du fond », « fluide ») | Seuils initiaux proposés et protocole de mesure | §58, §68, §71 |
| 18 | Aucun plan de déploiement ni de retour arrière | Feature flag, étapes de release, rollback, critères go/no-go | §64, §70 |
| 19 | Textes longs : « jamais coupés » sans méthode | Échelle de repli de mise en page + contrôle de lisibilité à la préparation | §59 |
| 20 | « Tests de fuite » demandés sans définition | Oracle de non-fuite (DOM, ARIA, sérialisation) | §69 |

**Modifications faites en place dans les Parties I à IX (liste exhaustive)** : en-tête de version ; bloc « Nouveautés de la V4 » dans le mode d'emploi ; note sous la règle absolue du §13 ; bandeaux « ⚠ SUPPLANTÉ » en tête des §20, §21 et §39 ; bandeau « ⚠ PRÉCISÉ » à l'étape 4 du §29 ; renvois ajoutés aux §37, §42 et §43. Tout le reste est identique à la V3.

## 47. Glossaire

| Terme | Définition |
|---|---|
| **ENI / TBI** | Écran numérique interactif / tableau blanc interactif : l'unique écran tactile projeté à la classe. |
| **Fiche** | Feuille A4 générée par doc-prof (pages, blocs, items). |
| **Recette** (`FicheRecipe`) | Description reproductible d'une fiche : configuration, graine, mode libre. |
| **Graine** (*seed*) | Entier qui initialise le générateur pseudo-aléatoire. |
| **Item** | Exercice élémentaire d'une fiche (ex. `788 + 771`). |
| **Question** | Un item converti en `GameQuestion` jouable. |
| **Manche** | Libellé d'écran du rang d'une question (« Manche 2 / 8 »). |
| **Série / Séance** | Série : liste ordonnée des questions. Séance : exécution de la série par la classe, de « Démarrer » au bilan. |
| **Carte / slot** | Carte : l'une des six cartes physiques. Slot : la lettre A–F occupée par un choix pour une question donnée. |
| **Choix** | Contenu d'une proposition (`choiceId`), indépendant du slot. |
| **Élève au tableau** | L'élève qui agit sur l'ENI ; la seule personne dont les actions sont enregistrées automatiquement. |
| **Clé de réponse** (`AnswerKey`) | Solution, explications, indices et notes ; jamais fournie aux composants de vote avant révélation. |
| **Révélation** | Action de l'enseignant qui rend la clé visible. |
| **Comptage manuel** | Répartition A–F saisie à la main par l'enseignant. |
| **Preset de jeu** | Réglages d'une séance enregistrés à part de la recette A4. |
| **Réglages de classe** | Paramètres globaux (palette, thème, sons, mouvement…). |
| **Mécanique** | Modèle d'interaction M01–M14. |
| **Compatibilité** | `auto`, `assisted`, `teacher-led`, `unsupported` (§15, §51). |
| **FALC** | « Facile à lire et à comprendre ». |
| **CECRL** | Cadre européen commun de référence pour les langues (niveaux A1 à C2). |
| **TCF** | Test de connaissance du français. **FLE** : français langue étrangère. |

## 48. Modèle de données canonique unifié (⚠ remplace §20 et §39)

### 48.1 Cartes et palette

```ts
export type CardSlot = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export const CARD_SLOTS: readonly CardSlot[] = ['A', 'B', 'C', 'D', 'E', 'F']
export type CardColorId = 'yellow' | 'red' | 'orange' | 'blue' | 'green' | 'purple'
export type CardSymbolId = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'plus'   // voir §58.4
export type CardPatternId = 'dots' | 'stripes' | 'grid' | 'waves' | 'checker' | 'soft-fill'     // fond noir et blanc, §58.4

export interface CardDefinition {                // le « motif » du registre du §24 recouvre `symbol` ET `pattern`
  slot: CardSlot
  colorId: CardColorId
  nameFr: string          // « Jaune »
  hex: string             // fond de la carte
  textHex: string         // couleur du texte : calculée puis validée ≥ 4,5:1 (test)
  symbol: CardSymbolId    // silhouette, identique à l'écran et sur le papier
  pattern: CardPatternId  // motif de fond pour l'impression en noir et blanc (§58.8)
}
export interface CardPalette { paletteVersion: number; cards: Record<CardSlot, CardDefinition> }
```

### 48.2 Source, médias, choix

```ts
export interface SourceRef {
  ficheId?: string
  recipeVersion: number            // FicheRecipe v1 → 1
  pageIndex: number                // informatif : ne sert JAMAIS d'identité (§22, §50)
  blockIndex: number               // index du bloc dans la recette (pas dans la feuille paginée)
  itemIndex: number                // rang de l'item dans le bloc complet, avant pagination
  sourceType: string               // exerciseType exact d'origine
  layout?: string
  originalSeed: number
  contentHash: string              // hash canonique du contenu source (§50.1)
}

export type MediaRef =
  | { kind: 'image'; src: string; alt: string; width?: number; height?: number; credit?: string }
  | { kind: 'audio'; src: string; transcript?: string; durationSec?: number; credit?: string }
  | { kind: 'figure'; spec: FigureSpec; title: string; desc: string }   // rendu par un composant de confiance
export interface FigureSpec { type: string; params: Record<string, number | string | boolean> } // ex. { type: 'square', params: { side: 349, unit: 'cm' } }

export type Provenance = 'bank' | 'rule' | 'teacher'   // banque source / règle de distracteur (§52) / validé par l'enseignant

export interface Choice {
  choiceId: string                 // stable, unique dans la question ; jamais dérivé du seul libellé
  label?: string                   // texte brut (jamais du HTML)
  labelA11y?: string               // lecture lecteur d'écran si le libellé est ambigu
  imageSrc?: string
  imageAlt?: string
  audioSrc?: string
  provenance: Provenance           // remplace `isVerified` (V3 §20) : un choix non vérifié n'entre jamais dans un plan
  errorFamily?: string             // si distracteur généré (§52) ; sert à l'analyse d'erreurs après révélation
}
```

### 48.3 Question publique et clé de réponse

```ts
export type Compatibility = 'auto' | 'assisted' | 'teacher-led' | 'unsupported'
export type MechanicId = 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07'
  | 'M08' | 'M09' | 'M10' | 'M11' | 'M12' | 'M13' | 'M14'
export type QuestionKind =                      // modèle de réponse et d'évaluation (liste V3 §39 conservée)
  | 'single-choice' | 'multi-choice' | 'matching' | 'ordering' | 'sorting' | 'grid'
  | 'geometry' | 'open-oral' | 'open-written' | 'audio-choice' | 'observation'
// Vrai/faux (M04) = single-choice + choiceOrderPolicy 'fixed'. Intrus (M10) = single-choice. Voir §54.

export type InteractionSpec =                   // données PUBLIQUES des mécaniques de manipulation (sans solution)
  | { type: 'ordering'; items: Array<{ itemId: string; label?: string; imageSrc?: string; imageAlt?: string }> }
  | { type: 'matching'; left: ItemRef[]; right: ItemRef[] }
  | { type: 'sorting'; items: ItemRef[]; categories: Array<{ categoryId: string; label: string }> }
  | { type: 'grid'; rows: number; cols: number; mode: 'shade' | 'select' }
export interface ItemRef { itemId: string; label?: string; imageSrc?: string; imageAlt?: string }

export interface GameQuestion {                 // SÛR À RENDRE AVANT RÉVÉLATION
  id: string                                    // stable, déterministe (§50.1)
  source: SourceRef
  mechanicId: MechanicId
  kind: QuestionKind
  compatibility: Exclude<Compatibility, 'unsupported'>   // `unsupported` n'est jamais une question (→ plan.skipped)
  layout: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'     // composition §8 bis : choix / image / audio / manipulation / oral
  title: string                                 // discipline et thème (bandeau discret)
  instruction: string                           // consigne d'origine
  prompt: string                                // énoncé affiché
  promptA11y?: string                           // ex. « 788 plus 771 égale combien ? »
  media: MediaRef[]
  choices: Choice[]                             // [] pour les questions ouvertes ; sinon 2 à 6
  choiceOrderPolicy: 'shuffle' | 'fixed' | 'ascending' | 'pin-last'   // §50.4
  interaction?: InteractionSpec
  evaluation: 'automatic' | 'teacher' | 'none'
  settings: { maxListens?: number; durationHintSec?: number; hintCount: number; cefrLevel?: string; skillTags?: string[] }
}

export type Solution =
  | { type: 'choices'; correctChoiceIds: string[] }
  | { type: 'ordering'; orderedItemIds: string[]; acceptedAlternatives?: string[][] }
  | { type: 'matching'; pairs: Array<[string, string]> }
  | { type: 'sorting'; categoryByItemId: Record<string, string> }
  | { type: 'grid'; predicate: { kind: 'count'; count: number } | { kind: 'cells'; cells: Array<[number, number]> } }
  | { type: 'none' }                            // open-oral, open-written, observation

export interface HintStep { kind: 'hint' | 'keyword' | 'followup'; text: string }   // révélés un par un, cumulativement
export interface Explanation { summary?: string; steps?: string[]; formula?: string }

export interface AnswerKey {                    // JAMAIS passée aux composants de vote avant `revealed`
  questionId: string
  solution: Solution
  explanation?: Explanation                     // summary dès `revealed` ; steps en `explained`
  hints?: HintStep[]
  distractorNotes?: Record<string, string>      // choiceId → analyse d'erreur (« Retenue des dizaines oubliée »)
  modelAnswer?: { text: string }                // toujours affiché avec « Exemple — pas la seule réponse possible »
  teacherNotes?: string                         // jamais rendu sur la projection (§57)
}
```

### 48.4 Plan de séance

```ts
export interface SlotAssignment { slot: CardSlot; choiceId: string }   // seuls les n premiers slots sont actifs

export interface PlannedQuestion { question: GameQuestion; key: AnswerKey; slots: SlotAssignment[] } // slots = tentative 0
export interface PlanWarning { questionId?: string; code: string; messageFr: string }
export type ReasonCode = 'CONVERSION_ERROR' | 'UNKNOWN_EXERCISE_TYPE' | 'PRINT_ONLY_ACTION' | 'OPEN_PRODUCTION' | 'NO_ANSWER'
  | 'LETTER_REFERENCE' | 'AMBIGUOUS_ANSWER' | 'DUPLICATE_OPTIONS' | 'TOO_MANY_OPTIONS' | 'NO_VERIFIED_OPTIONS'   // §51.1
export interface SkippedItem { source: SourceRef; reasonCode: ReasonCode; messageFr: string }

export interface SessionPlan {
  planId: string                                // hash de (conversionVersion, paletteVersion, ids, slots, presetId)
  conversionVersion: number
  paletteVersion: number
  presetId?: string
  questions: PlannedQuestion[]
  warnings: PlanWarning[]                       // médias manquants, textes trop longs…
  skipped: SkippedItem[]                        // jamais de suppression silencieuse
}
// Les slots d'une nouvelle tentative (§55.3) se recalculent par deriveSlots(planned, attempt) (§50.3).
```

### 48.5 Preset de jeu (version 2)

```ts
export interface GamePreset {
  version: 2
  presetId: string
  name: string
  sourceFicheId?: string
  conversionVersion: number
  paletteVersion: number                        // la palette elle-même vit dans ClassroomSettings
  contentHashAtSave: string                     // détection d'obsolescence (§63.4)
  selectedQuestionIds: string[]
  orderMode: 'source' | 'shuffled' | 'custom'
  customOrder?: string[]
  mechanicByQuestionId: Record<string, MechanicId>      // remplace `templateByQuestionId` (V3)
  choiceOverrides?: Record<string, ChoiceOverride>      // validation enseignant des items `assisted` (§53)
  maxChoices: 2 | 3 | 4 | 5 | 6                         // plafond ; défaut 6 ; jamais complété artificiellement
  revealPolicy: 'teacher-only'                          // invariant de la V1
  correctionTiming: 'deferred' | 'immediate'            // sémantique précise : §55.1
  voteBeforeBoard: boolean                              // défaut true ; false = pas de phase `cards-up`
  timer: { enabled: boolean; defaultSec?: number }
  scoring: { mode: 'none' | 'collective' | 'teams' }
  effects: { sound?: boolean; motion?: 'full' | 'reduced'; badges: boolean }   // surcharges ; sinon valeurs de classe
}
export interface ChoiceOverride { removed: string[]; added: Array<{ label: string; imageSrc?: string }>; relabeled: Record<string, string> }
```

### 48.6 Réglages de classe (globaux, hors preset)

```ts
export interface ClassroomSettings {
  schemaVersion: 1
  paletteVersion: number
  paletteOverrides?: Partial<Record<CardSlot, { hex: string }>>    // étalonnage §58.6, contrastes revalidés
  theme: 'light' | 'high-contrast' | 'dark'                       // `dark` : P1
  sound: boolean                                                  // défaut false
  motion: 'full' | 'reduced'                                      // défaut : suit prefers-reduced-motion
  textScale: 1 | 1.15 | 1.3
  falc: boolean                                                   // une information à la fois, consignes courtes
  toolbarGuard: 'none' | 'hold-to-reveal'                         // §57.4
  numberFormat: { thousands: 'narrow-nbsp' | 'nbsp' | 'none'; decimal: ',' | '.' }   // §62.5
  keepAwake: boolean                                              // Wake Lock, §61.5
}
```

### 48.7 Invariants du modèle (obligatoires)

1. Aucun composant de vote ne reçoit `AnswerKey` ni `PlannedQuestion.key` avant `revealed` : les composants n'acceptent, par leur **type**, que `GameQuestion` et `SlotAssignment[]`.
2. `choiceId` est unique dans la question et **n'est jamais dérivé du seul libellé** (deux choix peuvent avoir le même texte ou être des images).
3. Questions à choix : 2 ≤ n ≤ 6 ; les slots actifs sont les n premières lettres (A, B, C…) ; les autres cartes sont inactives, sans faux choix.
4. Aucun choix sans `provenance` ; aucun choix non vérifié n'entre dans un plan (la vérification est une précondition d'entrée).
5. `unsupported` n'est jamais une `GameQuestion` : il alimente `plan.skipped` avec sa raison.
6. Tout texte du modèle est une chaîne brute ; aucun HTML (§65 S4).
7. `ClassroomSettings` et `GamePreset` sont deux objets distincts, stockés séparément.

### 48.8 Correspondance de noms V3 → V4

| V3 | V4 |
|---|---|
| `GameChoice.isVerified` | `Choice.provenance` |
| `expectedChoiceIds` (§20), `correctOptionIds` (§39) | `AnswerKey.solution` (`type: 'choices'`) |
| `Mechanic` (§20) / `QuestionKind` (§39) | `mechanicId` (M01–M14) + `kind` |
| `QuestionSource` / `SourceReference` (champs `sourcePageIndex`, `sourceBlockIndex`, `sourceItemIndex`) | `SourceRef` (champs `pageIndex`, `blockIndex`, `itemIndex`) |
| `GameOption.id: ColorCardId` | `Choice.choiceId` + `SlotAssignment.slot` |
| `GameQuestionBase.options` | `GameQuestion.choices` (contenu) + `PlannedQuestion.slots` (positions) |
| `GameCompatibility` | `Compatibility` |
| `GamePreset.templateByQuestionId` | `mechanicByQuestionId` |
| `GamePreset.fixedColorMapping` | `ClassroomSettings.paletteOverrides` |
| `GameSessionState.selectedOptionIds` | `QuestionRuntime.boardAnswer` |
| `GameSessionState.teacherRevealed` | `QuestionRuntime.revealed` |
| `GameSessionState.phase` | `QuestionRuntime.phase` de la question courante |
| `GameSessionState.questionIds` | `SessionState.questionOrder` |

## 49. Machine à états, événements et invariants (⚠ remplace §21)

### 49.1 Vocabulaire unique et correspondance

| `QuestionPhase` (V4) | V3 §21 | V3 §8 bis | Libellé FR |
|---|---|---|---|
| `intro` | `QUESTION_VISIBLE` | préparation | Question affichée |
| `thinking` | `REFLECTION` | réflexion | Réflexion |
| `cards-up` | `CARDS_UP` / `CLASS_VOTE` | vote cartes levées | Cartes levées |
| `board-turn` | `BOARD_ANSWER_SELECTED` (avec ou sans réponse encore) | élève au tableau | Élève au tableau |
| `discussion` | `DISCUSSION` | discussion | Discussion |
| `revealed` | `REVEAL` | révélation | Correction |
| `explained` | `REVEAL` (sous-état) | explication | Explication |

Niveau séance : `SETUP` → `status: 'ready'` ; `NEXT_QUESTION` → `NAV_NEXT` ; `SESSION_SUMMARY` → `status: 'completed'` ; `RETRY` → `RETRY_QUESTION`.

### 49.2 Types d'état et d'événement

```ts
export type QuestionPhase = 'intro' | 'thinking' | 'cards-up' | 'board-turn' | 'discussion' | 'revealed' | 'explained'
export type SessionStatus = 'ready' | 'running' | 'paused' | 'completed'
export type TeacherMark = 'success' | 'review' | 'unassessed'
export type Verdict = 'correct' | 'partial' | 'incorrect' | 'no-answer' | 'teacher-pending'

export type BoardAnswer =
  | { type: 'choices'; choiceIds: string[] }
  | { type: 'ordering'; itemIds: string[] }
  | { type: 'matching'; pairs: Array<[string, string]> }
  | { type: 'sorting'; categoryByItemId: Record<string, string> }
  | { type: 'grid'; cells: Array<[number, number]> }

export interface ManualTally {
  counts: Partial<Record<CardSlot, number>>          // entiers ≥ 0
  present?: number                                   // effectif présent (facultatif)
  classRead?: 'mostly-right' | 'split' | 'mostly-wrong'
  origin: 'teacher-manual'                           // constante : l'origine est toujours affichée (§56)
}
export interface AttemptRecord { attempt: number; boardAnswer?: BoardAnswer; verdict?: Verdict; revealedAt?: number }

export interface QuestionRuntime {
  phase: QuestionPhase
  attempt: number                                    // 0 = première tentative
  boardAnswer?: BoardAnswer
  locked: boolean
  revealed: boolean                                  // SEULE source de vérité de la visibilité de la clé
  verdict?: Verdict                                  // défini uniquement quand revealed = true
  hintsShown: number
  listens: number
  extraListens: number                               // écoutes accordées par l'enseignant (§62.3)
  manualTally?: ManualTally
  teacherMark?: TeacherMark
  badges: Array<'well-explained'>
  skipped: boolean
  history: AttemptRecord[]
  revealRetractions: number
}

export interface SessionState {
  schemaVersion: 1
  sessionId: string
  planId: string
  parentSessionId?: string                           // séance de relance (§55.4)
  status: SessionStatus
  questionOrder: string[]
  currentIndex: number
  byQuestion: Record<string, QuestionRuntime>
  notes?: string                                     // observations libres de l'enseignant (≤ 2 000 car., §56.4)
  lastSeq: number
}

type Actor = 'teacher' | 'board' | 'system'
interface EventBase { eventId: string; seq: number; at: number; actor: Actor; questionId?: string }
// `at` est injecté par l'appelant : le reducer ne lit jamais l'horloge.
export type SessionEvent = EventBase & (
  | { type: 'SESSION_START' } | { type: 'SESSION_PAUSE' } | { type: 'SESSION_RESUME' }
  | { type: 'SESSION_FINISH' } | { type: 'SESSION_REOPEN' } | { type: 'SESSION_NOTE_SET'; text: string }
  | { type: 'PHASE_ADVANCE'; to?: Exclude<QuestionPhase, 'intro' | 'revealed' | 'explained'> }
  | { type: 'PHASE_BACK' }
  | { type: 'BOARD_ANSWER_SET'; answer: BoardAnswer } | { type: 'BOARD_ANSWER_CLEAR' }
  | { type: 'BOARD_LOCK'; locked: boolean }
  | { type: 'HINT_SHOW' } | { type: 'HINT_HIDE' }
  | { type: 'AUDIO_LISTEN_STARTED' } | { type: 'AUDIO_EXTRA_LISTEN_GRANTED' }
  | { type: 'TIMER_ELAPSED' }
  | { type: 'MANUAL_TALLY_SET'; tally: ManualTally } | { type: 'MANUAL_TALLY_CLEAR' }
  | { type: 'TEACHER_REVEAL'; force?: boolean } | { type: 'TEACHER_UNREVEAL' }
  | { type: 'EXPLAIN_SHOW' } | { type: 'EXPLAIN_HIDE' }
  | { type: 'TEACHER_MARK'; mark: TeacherMark } | { type: 'TEACHER_BADGE'; badge: 'well-explained'; on: boolean }
  | { type: 'RETRY_QUESTION' }
  | { type: 'NAV_NEXT'; skip?: boolean } | { type: 'NAV_PREV' } | { type: 'NAV_GOTO'; index: number }
)

// Pur, déterministe, sans effet de bord. La clé de réponse n'est lue que pour calculer `verdict` au TEACHER_REVEAL.
export declare function reduce(state: SessionState, event: SessionEvent, plan: SessionPlan): SessionState
```

Les événements à portée de question (tous sauf `SESSION_*` et `NAV_*`) **doivent porter `questionId`** et sont **ignorés** (et journalisés comme obsolètes) s'il diffère de la question courante : un toucher au tableau arrivé pendant que l'enseignant change de question ne doit jamais contaminer la mauvaise question.

### 49.3 Plan de phases selon la question

| Cas | Phases parcourues (`*` = optionnelle) |
|---|---|
| QCM, calcul, audio, vrai/faux (vote activé) | `intro` → `thinking` → `cards-up` → `board-turn` → `discussion`* → `revealed` → `explained`* |
| Vote désactivé dans le preset (`voteBeforeBoard: false`) | `intro` → `thinking` → `board-turn` → `discussion`* → `revealed` → `explained`* |
| Manipulation avec prédiction (M06, M07, M08, M13) | `intro` → `thinking` → `cards-up` (prédiction) → `board-turn` (manipulation) → `discussion`* → `revealed` → `explained`* |
| Manipulation sans prédiction (M09 grille, M11, M12) | `intro` → `thinking`* → `board-turn` → `discussion`* → `revealed` → `explained`* |
| Question ouverte, orale ou d'observation (`teacher-led`) | `intro` → `thinking`* → `discussion` → `revealed` (pistes ou modèle) → `explained`* |

`PHASE_ADVANCE` mène à la phase suivante **du plan de la question** ; `to` permet de sauter une phase optionnelle mais **jamais d'entrer en `revealed`** (réservé à `TEACHER_REVEAL`).

### 49.4 Table de transitions

| Événement (acteur) | Phases autorisées | Effet | Garde / remarque |
|---|---|---|---|
| `SESSION_START` (enseignant) | `status = ready` | `running`, index 0, phase `intro` | plan non vide ; avertissements médias déjà affichés |
| `PHASE_ADVANCE` (enseignant) | `intro`, `thinking`, `cards-up`, `board-turn` | phase suivante du plan | n'entre jamais en `revealed` |
| `PHASE_BACK` (enseignant) | `thinking`, `cards-up`, `board-turn`, `discussion` | phase précédente du plan | `boardAnswer` conservée ; verrou levé |
| `BOARD_ANSWER_SET` (tableau) | `board-turn`, `discussion` | `boardAnswer` **remplacée** (jamais cumulée) | refusé si `locked` ou `revealed` ; la phase ne change pas |
| `BOARD_ANSWER_CLEAR` (tableau, enseignant) | `board-turn`, `discussion` | `boardAnswer` effacée | refusé si `locked` ou `revealed` |
| `BOARD_LOCK` (enseignant) | `board-turn`, `discussion` | `locked` mis à jour | |
| `HINT_SHOW` / `HINT_HIDE` (enseignant) | `thinking` à `discussion` | `hintsShown` ± 1, borné par `hintCount` | n'affecte pas `boardAnswer` |
| `AUDIO_LISTEN_STARTED` (système) | toute phase, `status = running` | `listens` + 1 | refusé si `listens ≥ maxListens + extraListens` |
| `AUDIO_EXTRA_LISTEN_GRANTED` (enseignant) | toute phase | `extraListens` + 1 | journalisé |
| `TIMER_ELAPSED` (système) | `thinking`, `cards-up`, `board-turn` | **aucun changement de phase** | signal visuel ou sonore seulement (I9) |
| `MANUAL_TALLY_SET` / `_CLEAR` (enseignant) | `cards-up` à `explained` | `manualTally` | validations §56 |
| `TEACHER_REVEAL` (enseignant) | `board-turn`, `discussion` ; `intro`, `thinking`, `cards-up` si `force: true` | `revealed = true`, `verdict` calculé, phase `revealed` | idempotent ; `no-answer` si aucune réponse au tableau |
| `EXPLAIN_SHOW` / `_HIDE` (enseignant) | `revealed`, `explained` | phase ↔ `explained` | |
| `TEACHER_UNREVEAL` (enseignant) | `revealed`, `explained` | `revealed = false`, `verdict` effacé, phase `discussion` (ou `board-turn` si absente du plan), `revealRetractions` + 1 | récupération d'une fausse manœuvre ; les points sont recalculés au prochain `TEACHER_REVEAL` |
| `TEACHER_MARK` / `TEACHER_BADGE` (enseignant) | `revealed`, `explained` ; toute phase si `evaluation = teacher` | `teacherMark`, `badges` | |
| `RETRY_QUESTION` (enseignant) | `discussion`, `revealed`, `explained` | `attempt` + 1, `history` enrichi, état remis à `thinking`, nouveaux slots (§50.3) | l'historique n'est jamais effacé |
| `NAV_NEXT` (enseignant) | question `revealed` / `explained`, ou `skip: true` depuis toute phase, ou `teacher-led` marquée | `currentIndex` + 1 ; `skip` pose `skipped = true` | **jamais** déclenché par minuteur, audio ou réponse au tableau (I8) ; à la dernière question : proposer `SESSION_FINISH` |
| `NAV_PREV` / `NAV_GOTO` (enseignant) | toute phase | `currentIndex` modifié | l'état de chaque question est conservé ; revenir sur une question révélée la laisse révélée |
| `SESSION_PAUSE` / `_RESUME` (enseignant) | `running` ↔ `paused` | pause : contenu masqué, minuteur et audio suspendus | |
| `SESSION_FINISH` (enseignant) | `running`, `paused` | `completed` | confirmation s'il reste des questions non traitées |
| `SESSION_REOPEN` (enseignant) | `completed` | `running` sur la dernière question | |
| `SESSION_NOTE_SET` (enseignant) | toute `status` | `notes` remplacé | 2 000 caractères maximum, refusé au-delà ; texte brut |

### 49.5 Invariants (chacun a au moins un test automatisé, §69)

- **I1 — Non-fuite.** L'état n'embarque jamais la clé ; `verdict` n'existe qu'après `revealed = true` ; les sélecteurs de projection ne lisent la clé que si `revealed`.
- **I2 — Révélation explicite.** Seul `TEACHER_REVEAL` (acteur `teacher`) met `revealed` à `true`.
- **I3 — Sélection.** `BOARD_ANSWER_SET` est refusé si `locked`, `revealed` ou phase hors `board-turn`/`discussion`.
- **I4 — Idempotence.** Un `eventId` déjà appliqué n'a aucun effet (reprise, double toucher, rejouage).
- **I5 — Pas de double comptage.** Une seule `boardAnswer` active par question et par tentative ; un score se calcule sur le dernier `TEACHER_REVEAL` non rétracté.
- **I6 — Navigation sans perte.** `NAV_*` ne réinitialise aucun `QuestionRuntime`.
- **I7 — Pureté.** Le reducer n'appelle ni `Date.now`, ni `Math.random`, ni le DOM ; aucune dépendance React.
- **I8 — Tempo humain.** Aucun minuteur, audio, chargement de média ni réponse au tableau ne déclenche un `NAV_*`, un `PHASE_ADVANCE` ou un `TEACHER_REVEAL`.
- **I9 — Minuteur informatif.** `TIMER_ELAPSED` n'a qu'un effet de présentation.
- **I10 — Événements obsolètes.** Un événement dont le `questionId` ne correspond pas à la question courante est ignoré.

### 49.6 Effets de bord (hors reducer)

Audio, minuteur, plein écran, verrou de veille, sauvegarde et préchargement vivent dans des **hooks d'effets** qui observent l'état et **émettent des événements** (`AUDIO_LISTEN_STARTED`, `TIMER_ELAPSED`…). Aucun effet n'écrit directement dans l'état. Le libellé du bouton principal par phase est défini au §60.

## 50. Identité, déterminisme et mélange équilibré (complète §22)

### 50.1 Identité

- `sourceKey = {scope}/{blockIndex}/{itemIndex}` avec `scope = ficheId` pour une fiche enregistrée, ou `draft:{recipeHash8}` pour un brouillon. `blockIndex` est l'index du bloc **dans la recette** ; `itemIndex` est le rang de l'item **dans le bloc complet, avant pagination** par `buildWorksheets`. Ni la feuille ni la page affichée n'entrent dans l'identité.
- `questionId = "q:" + sourceKey + "@v" + conversionVersion`.
- `contentHash` : hash **synchrone et non cryptographique** d'un JSON canonique du contenu source (clés triées, nombres normalisés, chaînes en NFC). L'algorithme (ex. FNV-1a 64 bits ou cyrb53) est fixé par un ADR avec au moins trois vecteurs de test. Il sert à l'identification et à la détection de dérive, **jamais** à la sécurité.
- Deux items de même `sourceKey` dans une conversion : dédupliquer et signaler (`DUPLICATE_SOURCE`).

### 50.2 Dérivation des graines

```ts
function deriveSeed(p: {
  originalSeed: number; sourceKey: string; conversionVersion: number
  purpose: 'distractors' | 'slots' | 'order' | 'replay'; attempt?: number
}): number {
  return hash32(`${p.originalSeed}|${p.sourceKey}|v${p.conversionVersion}|${p.purpose}|${p.attempt ?? 0}`)
}
```

Un `purpose` distinct par usage évite de corréler le choix des distracteurs et celui des positions. Toute la conversion passe par `createRng(deriveSeed(…))` (fonction existante, signature à confirmer au C0). **Règles de lint obligatoires** dans `src/interactive/` : interdiction de `Math.random`, de `Date.now` et de `new Date()` dans `domain/`, `adapters/`, `question/` et `session/reducer.ts`.

### 50.3 Attribution équilibrée des positions

```text
assignSlots(questions, planSeed):
  pour chaque n présent parmi {2,…,6} : sac[n] ← permutation seedée de [1..n]      (le vrai/faux, politique `fixed`, n'entre pas ici : §50.4)
  pour chaque question q de la série, dans l'ordre, si choiceOrderPolicy = 'shuffle' :
      p ← prochain élément de sac[n(q)] ; si le sac est vide, le reconstituer (nouvelle permutation seedée)
      si p égale la position correcte des deux questions précédentes → échanger avec l'élément suivant du sac
      placer la bonne réponse (ou la première des bonnes réponses) en p
      remplir les autres slots actifs par une permutation seedée (purpose = 'slots', sourceKey de q)
```

Garanties à tester : sur N questions à n choix en politique `shuffle`, chaque position correcte apparaît ⌊N/n⌋ ou ⌈N/n⌉ fois (écart ≤ 1) ; jamais plus de deux positions correctes identiques consécutives ; même entrée (mêmes questions, même ordre, mêmes graines, même version) = mêmes slots. **Conséquence assumée** : retirer ou ajouter une question dans le preset peut changer les slots des suivantes ; le plan résolu est donc identifié par `planId` et la reprise vérifie ce hash (§63.3). `deriveSlots(planned, attempt)` refait le tirage d'une seule question avec `attempt` dans la graine.

### 50.4 Politique d'ordre des choix

| Politique | Quand | Effet |
|---|---|---|
| `shuffle` | défaut (QCM, calcul, audio) | slots mélangés selon §50.3 |
| `fixed` | vrai/faux (**A = Vrai, B = Faux**, jamais mélangés) ; choix qui font référence à l'ordre ou aux lettres ; suites ordonnées | ordre de la source, slots attribués dans cet ordre |
| `ascending` | option de preset pour le calcul | tri numérique ; **désactive l'équilibrage** (la bonne réponse suit alors la valeur) |
| `pin-last` | libellés du type « Aucune de ces réponses », « Toutes les réponses », « Les deux » | ces choix prennent le dernier slot actif ; les autres sont mélangés |

La détection de `pin-last` repose sur des motifs normalisés (liste à finaliser et à tester au C0) ; en cas de doute (référence croisée aux lettres, § 53.3), la question passe en `assisted` avec `fixed`.

## 51. Compatibilité : arbre de décision et codes de raison (complète §15)

### 51.1 Règles (la première règle applicable l'emporte)

| Règle | Condition | Résultat | `reasonCode` |
|---|---|---|---|
| R0 | L'adaptateur lève une erreur sur l'item, ou la réponse stockée ne se recalcule pas | `unsupported` | `CONVERSION_ERROR` |
| R1 | `exerciseType` absent du registre d'adaptateurs | `unsupported` | `UNKNOWN_EXERCISE_TYPE` |
| R2 | Action uniquement papier (découper, coller, dessiner ou écrire sur la feuille) sans équivalent à l'écran ; si la consigne garde un sens projetée et discutée → `teacher-led` | `unsupported` ou `teacher-led` | `PRINT_ONLY_ACTION` |
| R3 | Production libre (oral, écrit) ou évaluation qui exige un jugement humain | `teacher-led` | `OPEN_PRODUCTION` |
| R4 | Aucune réponse source fiable (absente, vide, contradictoire) et pas de production libre ; `teacher-led` si l'énoncé est projetable | `unsupported` ou `teacher-led` | `NO_ANSWER` |
| R5 | L'énoncé ou un choix cite des lettres (« A ou B ? », « A et B ») | `assisted`, ordre `fixed` | `LETTER_REFERENCE` |
| R6 | Plusieurs réponses équivalentes ou variantes acceptées qui demandent un arbitrage | `assisted` | `AMBIGUOUS_ANSWER` |
| R7 | Choix en doublon (même libellé et même image) | `assisted` | `DUPLICATE_OPTIONS` |
| R8 | Plus de 6 choix dans la source | `assisted` | `TOO_MANY_OPTIONS` |
| R9 | Réponse connue **et** 2 à 6 choix source distincts | `auto` | — |
| R10 | Réponse connue, pas de choix source, générateur de distracteurs validé (§52) fournissant au moins 2 distracteurs valides | `auto` | — |
| R11 | Réponse connue, ni choix source ni générateur suffisant | `assisted` (l'enseignant propose ou valide les choix) | `NO_VERIFIED_OPTIONS` |

### 51.2 Avertissements orthogonaux (n'altèrent pas la compatibilité)

`MEDIA_MISSING` (média absent ou injoignable : la question est **exclue par défaut** de la série tant que l'enseignant ne confirme pas), `MEDIA_SLOW`, `TEXT_TOO_LONG` (§59.4), `ALT_MISSING`, `STAND_OUT_CHOICE` (§53.3), `STALE_PRESET` (§63.4).

### 51.3 Restitution à l'enseignant

L'écran « Préparer » affiche un résumé de la forme **« 10 jouables · 2 à valider · 3 à guider · 1 non convertible »**, chaque total ouvrant la liste des questions avec leur raison en français (§60.4). Toute question absente de la série figure dans `plan.skipped` ; la fiche A4 reste consultable et imprimable. Aucune question n'est jamais retirée sans trace.

## 52. Distracteurs mathématiques : familles d'erreurs et validation (complète §16)

### 52.1 Représentation exacte

```ts
interface NumericAnswer { num: bigint; den: bigint; unit?: string }   // fraction irréductible, den > 0
```

Aucun calcul en virgule flottante. Une valeur décimale de la banque est lue **depuis sa représentation décimale textuelle** (pas depuis sa valeur binaire). Deux réponses sont **équivalentes** si `num/den` sont égaux après normalisation **et** si l'unité canonique est la même (`cm²`, `cm^2` → `cm²`). Une valeur identique avec une autre unité est donc un distracteur légitime (`wrong-unit`). L'affichage passe par le formateur du §62.5 ; les décimaux non finis s'affichent en fraction.

### 52.2 Catalogue des familles d'erreurs

`r` désigne la bonne réponse, `k` le rang de colonne (0 = unités). Les familles au-delà de l'addition et de l'aire du carré (scénarios S01 et S04) ne s'activent **que si le domaine correspondant existe dans le dépôt** (inventaire C0).

| `errorFamily` | Opérations | Formule | Garde | Libellé d'analyse (FR) |
|---|---|---|---|---|
| `carry-omitted` | + × | `r − 10^(k+1)` pour chaque colonne `k` où une retenue est réellement sortie | retenue réelle | Retenue de la colonne des … oubliée |
| `carry-extra` | + × | `r + 10^(k+1)` (retenue ajoutée sans exister, ou comptée deux fois) | — | Retenue ajoutée en trop |
| `borrow-forgotten` | − | `r + 10^(k+1)` si un emprunt a eu lieu en colonne `k` et que la colonne suivante n'est pas réduite | emprunt réel | Emprunt non compensé |
| `borrow-extra` | − | `r − 10^(k+1)` | — | Emprunt compté deux fois |
| `smaller-minus-larger` | − | nombre formé, colonne par colonne, par `max(aₖ, bₖ) − min(aₖ, bₖ)` | ≠ `r` | Petit chiffre retranché au grand |
| `column-slip` | + − × | `r ± 10^k` | ne modifie pas le chiffre de tête | Erreur de calcul dans une colonne |
| `digit-transposition` | toutes | deux chiffres voisins de `r` permutés | pas de zéro de tête ; ≠ `r` | Deux chiffres inversés |
| `digit-substitution` | toutes | un chiffre de `r` remplacé par un chiffre voisin de `r` | ≠ `r` | Chiffre recopié par erreur |
| `factor-slip` | × aires | `(a±1)×b`, `a×(b±1)`, `c×(c±1)` | — | Un facteur décalé de 1 |
| `partial-product-omitted` | × (multiplicateur à ≥ 2 chiffres) | `r − a×bₖ×10^k` | — | Un produit partiel oublié |
| `place-value-shift` | × ÷ | `r×10` ou `r÷10` (si entier) | — | Zéro oublié ou en trop |
| `quotient-slip` | ÷ | `q ± 1` | ≥ 0 | Quotient décalé d'une unité |
| `remainder-confusion` | ÷ euclidienne | reste affiché à la place du quotient et inversement | distinct de `r` | Reste et quotient confondus |
| `operation-confusion` | + − × ÷ | résultat d'une opération voisine (a−b, a+b, a×b…) | filtre de magnitude (§52.3) | Mauvaise opération |
| `perimeter-confusion` | carré, rectangle | `4c` ; `2(L+l)` | unité de longueur | Périmètre confondu avec l'aire |
| `area-confusion` | périmètre demandé | `c²` ; `L×l` | unité d'aire | Aire confondue avec le périmètre |
| `side-doubling` | carré | `2c` | unité de longueur | Côté simplement doublé |
| `wrong-unit` | mesures, géométrie | même valeur, mauvaise unité (cm au lieu de cm²) | seulement si l'unité fait partie de la réponse évaluée | Unité oubliée ou incorrecte |
| `half-confusion` | aires | `r ÷ 2` | résultat entier uniquement | Confusion avec l'aire d'un triangle |
| `power-of-ten-slip` | conversions | ×10, ×100, ×1 000 erronés | valeur entière | Mauvais facteur de conversion |

### 52.3 Pipeline de validation et de sélection

1. **Double entrée.** Recalculer la bonne réponse depuis les opérandes et la comparer à celle de la source. Si elles diffèrent : `CONVERSION_ERROR` (on ne devine jamais laquelle est fausse).
2. **Génération.** Chaque famille applicable produit des candidats `{valeur, unité, famille}`.
3. **Filtres.** Écarter un candidat s'il est équivalent (valeur et unité) à la bonne réponse ou à un autre candidat ; s'il sort du domaine de la source (entier si la source est entière, positif sauf si la source admet des négatifs, ≤ 15 chiffres significatifs) ; ou s'il échoue au **filtre de magnitude**, soumis aux familles « arithmétiques » (`carry-*`, `borrow-*`, `column-slip`, `digit-*`, `operation-confusion`…) : le nombre de chiffres de la partie entière est celui de `r` ± 1 **et** `|c − r| ≤ max(|r|, 10)`. Les familles « conceptuelles » (`perimeter-confusion`, `area-confusion`, `side-doubling`, `wrong-unit`) sont plausibles par construction et ne passent que les filtres de distinction et de domaine.
4. **Sélection.** Choisir jusqu'à `maxChoices − 1` distracteurs en tournant entre les familles (ordre de priorité fixe par opération), **au plus 2 par famille**, départage par `createRng(deriveSeed(… 'distractors'))`.
5. **Effectif.** Au moins 3 distracteurs valides : `n = min(maxChoices, 1 + valides)`. Exactement 2 : `n = 3`. Moins de 2 : la question passe en `assisted` (`NO_VERIFIED_OPTIONS`) ; un calcul à deux choix est un pile ou face.
6. **Anti-indice.** L'ensemble final ne doit pas désigner la bonne réponse par un artefact systématique (seule à avoir un dernier chiffre unique, toujours médiane…). Contrôle statistique au §69.

### 52.4 Analyse d'erreurs après révélation

Chaque distracteur généré porte son `errorFamily` ; `AnswerKey.distractorNotes` reçoit le libellé d'analyse en français. En phase `explained`, un panneau facultatif « Pourquoi ces propositions ? » associe chaque carte à l'erreur probable, **uniquement pour les distracteurs de provenance `rule`**. Pour les distracteurs d'une banque, aucune analyse n'est inventée.

### 52.5 Exemple de contrôle : `788 + 771 = 1 559` (scénario S01)

Colonnes : unités 8 + 1 = 9 (pas de retenue) ; dizaines 8 + 7 = 15 (on écrit 5, retenue 1) ; centaines 7 + 7 + 1 = 15 (on écrit 5, retenue 1) ; milliers 1.

| Slot illustratif | Choix | Famille | Analyse |
|---|---|---|---|
| C | 1 559 | bonne réponse | — |
| B | 1 459 | `carry-omitted` (colonne des dizaines) | Retenue des dizaines oubliée |
| D | 1 549 | `column-slip` (−10) | Erreur de calcul dans la colonne des dizaines |
| E | 1 569 | `carry-extra` (colonne des unités) | Retenue ajoutée alors qu'il n'y en avait pas |
| F | 1 560 | `column-slip` (+1) | Erreur de calcul dans la colonne des unités |
| A | 1 599 | `digit-substitution` | Chiffre des dizaines recopié depuis celui des unités |

Les six valeurs de l'exemple du §16 se rattachent donc toutes à une famille définie ; **la répartition réelle sur les slots dépend de la graine**.

## 53. Contenus non mathématiques : provenance, validation enseignant, pièges (complète §14 et §16)

### 53.1 Règles générales

- **Aucune génération par IA, aucune traduction automatique, aucun contenu inventé à l'exécution.** Tout choix provient de la banque, d'une règle déterministe documentée, ou de l'enseignant (`provenance`).
- Un adaptateur qui hésite **dégrade la compatibilité** (`assisted`, `teacher-led`) au lieu de deviner.

### 53.2 Politique par domaine

| Domaine / source | Origine des choix | Distracteurs par règle ? | Particularités | Compatibilité par défaut |
|---|---|---|---|---|
| Grammaire (`GramBankItem` : `prompt`, `answer`, `options`, `hint`) | `options` de la banque | **Non** (accord, conjugaison et orthographe exigent une revue linguistique) | variantes acceptées, accents ; `hint` → `HintStep` | `auto` si `options` valides, sinon `assisted` |
| TCF/TPF compréhension orale et écrite (`TcfQuestion`, `audioSrc`) | choix de la banque (souvent 4) | Non | conserver le nombre de choix ; piste obligatoire ; `maxListens` d'après la consigne | `auto` |
| TCF/TPF production orale (`sequence_4_images`) | images, questions, modèles | Sans objet | M14-lite (P0) ; l'ordre des images de la banque peut servir M07 (P1) ; « modèle » → `modelAnswer` | `teacher-led` |
| Alphabétisation, Soutien FR | éléments de la banque (lettres, syllabes, mots, sons, images, audios) | Seulement si la banque fournit des confusions (paires phonétiques) | son ↔ graphie ; police adaptée au lecteur débutant (§58.5) | `auto` ou `assisted` |
| Logique (suites, rotations, intrus, matrices) | générateur ou banque | Non, sauf générateur existant | **unicité de la réponse** à certifier (une matrice peut admettre plusieurs réponses) | `auto` si unicité garantie, sinon `assisted` |
| Jeux imprimables (`GameEntry` : memory, loto, tri, dominos) | banques existantes | Sans objet | ne jamais reprendre la mise en page papier | selon la mécanique (M06, M08, M11, M12) |
| Vocabulaire, santé, société, ACM… (partiels) | selon les items disponibles | Non | pas de réponse ni de choix → `unsupported` ou `teacher-led`, avec explication | à établir au C0 |

### 53.3 Pièges à traiter explicitement

1. **Lettres des sources (risque n°1 de confusion en classe).** Une source peut étiqueter ses choix « A. », « B. »… Après mélange, ces lettres ne correspondent plus aux cartes. L'adaptateur **retire ces préfixes à l'affichage** et ne cite jamais de lettre dans un énoncé ; le corrigé A4 reste indexé sur l'ordre source, la clé de séance l'est sur `choiceId`.
2. **Plusieurs bonnes réponses** : `multi-choice` explicite ; le nombre attendu n'est annoncé que si la source l'annonce ; sinon `assisted`.
3. **Formulations négatives** (« Quelle phrase est incorrecte ? ») : conserver la mise en évidence de la source (gras), ne jamais l'inverser.
4. **Comparaison de chaînes** (jamais pour l'affichage) : normalisation Unicode NFC ; apostrophes `’` et `'` unifiées ; casse et diacritiques **significatifs** en grammaire et orthographe (« a » ≠ « à »).
5. **Choix-images** : `imageAlt` obligatoire, sinon avertissement `ALT_MISSING`.
6. **Choix qui se distingue par sa forme** (le plus long, le seul différent) : avertissement `STAND_OUT_CHOICE` à la préparation (information, pas un blocage).

### 53.4 Flux « à valider » (compatibilité `assisted`)

Dans « Préparer », chaque question `assisted` s'ouvre sur : l'énoncé, la réponse source, les choix candidats avec leur provenance, et trois actions (retirer, reformuler, ajouter). L'enseignant valide quand il reste au moins 2 choix et **exactement une bonne réponse** pour un `single-choice`. Le résultat est enregistré dans `GamePreset.choiceOverrides` (jamais dans la recette A4), les choix ajoutés prennent la provenance `teacher`, et la question est marquée « validée par l'enseignant » dans le bilan.

## 54. Spécifications détaillées des mécaniques M01 à M14 (complète §13)

### 54.1 Principes communs

- Le **vote A–F** porte toujours sur une décision pertinente (une réponse, une prédiction) et jamais sur un faux QCM ; un tableau sans prédiction pertinente se joue sans phase `cards-up` (§49.3).
- Toute action tactile a une **alternative sans geste** : clavier, ou « toucher puis toucher la destination » pour tout déplacement (WCAG 2.2, critère 2.5.7).
- Dans une question à un seul choix, **re-toucher la carte sélectionnée ne la désélectionne pas** (une main maladroite ne doit pas annuler une réponse) ; pour changer, on touche une autre carte ou on utilise « Effacer ». En choix multiple, le toucher bascule la sélection, avec un délai anti-rebond de 200 ms.

### 54.2 Mécaniques à choix

| ID | `kind` | Données requises | Action au tableau | Évaluation | Repli | Priorité |
|---|---|---|---|---|---|---|
| M01 | `single-choice`, `multi-choice` | 2 à 6 `choices` (texte ou image) ; solution `choices` | toucher une carte | égalité d'ensembles ; en choix multiple, détail correctes / manquantes / en trop | moins de 2 choix valides → `assisted` | P0 |
| M02 | `single-choice` | M01 + distracteurs générés (§52) + `explanation.steps` | toucher, puis « expliquer la méthode » | exacte | moins de 2 distracteurs → `assisted` | P0 |
| M03 | `audio-choice` | M01 + média audio + `maxListens` | lecture, pause, réécoute, puis sélection | exacte | piste absente → avertissement, question exclue par défaut | P0 |
| M04 | `single-choice`, ordre `fixed` | deux choix « Vrai » (A) et « Faux » (B) ; variante à trois choix avec « On ne sait pas » (C) | toucher | exacte | — | P0 |
| M10 | `single-choice` | 3 à 6 éléments dont un intrus ; `explanation.summary` = la règle | toucher l'intrus | exacte | plusieurs intrus possibles → `assisted` ; règle inconnue → pas d'explication | P1 |

### 54.3 Mécaniques de manipulation et d'oral

| ID | `kind` et données | Action au tableau (et alternative) | Vote A–F | Évaluation | Repli | Priorité |
|---|---|---|---|---|---|---|
| M05 | `single-choice` ; énoncé à un seul blanc `___` ; 2 à 6 mots | toucher un mot **ou** le glisser dans le blanc (aperçu dans la phrase) | direct, sur les mots | exacte | pas d'`options` → `assisted` | P1 |
| M06 | `matching` ; ≤ 6 paires | une **micro-question par paire** : l'élément de gauche s'affiche, les éléments de droite restants sont les choix ; toucher le bon | sur la paire courante | par paire ; bilan « k paires sur n » | plus de 6 paires → groupes de 6 ; association non univoque → `teacher-led` | P1 |
| M07 | `ordering` ; 2 à 6 éléments | glisser, ou toucher l'élément puis la place ; annuler le dernier déplacement | prédiction : « Quelle image vient en premier (ou ensuite) ? », choix = images repérées A–F | ordre exact (ou alternative listée) ; partiel : paires voisines correctes | ordre non unique et non listé → `teacher-led` ; plus de 6 éléments → découper | P1 |
| M08 | `sorting` ; éléments + ≤ 6 catégories | glisser, ou toucher l'élément puis la catégorie | prédiction : « Dans quelle catégorie va cet élément ? », **catégories = cartes** | par élément ; partiel | plus de 6 catégories → manipulation sans prédiction | P1 |
| M09 | `geometry` (choix + `figure`) ou `grid` | **P0** : M01 avec figure (scénario S04) ; **P1** : grille manipulable (colorier ou sélectionner des cases) | vote sur la valeur | choix : exacte ; grille : prédicat `count` ou `cells` | ne jamais dessiner 121 801 carreaux : schéma réduit (côté × côté) | P0 / P1 |
| M11 | `grid` ; ≤ 6 paires | retourner deux cartes | anticipation : après une première carte, la classe vote la position de la jumelle parmi ≤ 6 candidates repérées A–F | paire trouvée ou non | à reconcevoir après le pilote | P2 |
| M12 | `grid` ; ≤ 25 cases et tirages | cocher la case correspondante | chaque tirage = une question à ≤ 6 choix | cases cochées ; objectif collectif | idem | P2 |
| M13 | `ordering` (étapes ou suites logiques) | comme M07 | prédiction de l'étape suivante | comme M07 | comme M07 | P2 |
| M14 | `open-oral` ; 1 à 4 images ; `hints` (mots-clés, relances) ; `modelAnswer` | agrandir, zoomer, révéler les paliers un à un ; annoter (P1) | seulement si la banque fournit une vraie question de prédiction | **aucun verdict automatique** : `teacher-pending`, puis `TEACHER_MARK` | — | P1 |
| **M14-lite** | M14 sans annotation : visionneuse 1 à 4 images (zoom), consigne, paliers révélés un à un, modèle révélé à la demande, marquage enseignant | idem | idem | idem | — | **P0** (nécessaire au scénario S03 du MVP) |

Le type `observation` (affichage seul, discussion, sans évaluation) réutilise la visionneuse de M14-lite.

### 54.4 Composants transverses

`ZoomableImage` (agrandissement par bouton, déplacement au doigt ou au clavier, jamais bloquant), `AudioPlayer` (§62.3), `Timer` (§49.5, I9), `FigureRenderer` (carré, rectangle, grille, droite graduée…, nom accessible et description obligatoires), `ChoiceGrid` (`SixColorGrid` du §19).

## 55. Évaluation, scores, nouvelle tentative et relance (complète §26 et §27)

### 55.1 Moment de la correction et sens de « immédiate »

Aucune correction avant `TEACHER_REVEAL`. Le preset `correctionTiming: 'immediate'` signifie uniquement que la phase `discussion` est sautée et que le bouton **Révéler** passe en action principale dès qu'une réponse est posée au tableau. **La révélation automatique à la sélection n'est pas supportée en V1** : elle contredit la Priorité 3 et `revealPolicy: 'teacher-only'`. Activer `immediate` affiche l'avertissement du §25 (effet de copie).

### 55.2 Évaluation selon le type

| `kind` | `correct` | `partial` | `incorrect` | Détail restitué |
|---|---|---|---|---|
| `single-choice`, `audio-choice`, `geometry` (solution `choices`) | choix = solution | — | autre choix | réponse au tableau et bonne réponse, distinctes |
| `multi-choice` | ensemble identique | sélection non vide, **aucune** mauvaise réponse cochée, au moins une bonne manquante | au moins une mauvaise réponse cochée | « juste mais incomplet », cartes manquantes ou en trop |
| `ordering` | ordre identique (ou alternative listée) | au moins la moitié des paires voisines correctes | sinon | « k paires voisines sur n » |
| `matching` | toutes les paires | au moins la moitié | sinon | « k paires sur n » |
| `sorting` | tous les éléments | au moins la moitié | sinon | « k éléments sur n » |
| `grid` | prédicat satisfait | — | sinon | écart (cases en trop ou manquantes) |
| `open-oral`, `open-written`, `observation` | — | — | — | `teacher-pending`, puis marque de l'enseignant |

Un `geometry` dont la solution est de type `grid` s'évalue comme `grid`. Le seuil « la moitié » est une constante nommée et testée (*proposition*). Le détail est formulé en **texte** (« 3 paires sur 5 »), jamais en pourcentage, pour éviter toute fausse précision.

### 55.3 Nouvelle tentative (`RETRY_QUESTION`)

La question repart en `thinking` avec `attempt + 1` et de **nouveaux slots** (`deriveSlots`, §50.3) : les élèves doivent relire leurs cartes, ce qui limite la mémorisation « la bonne était C ». L'historique (`history`) conserve chaque tentative. **Le score ne compte que la dernière révélation non rétractée de la question** (I5). L'interface emploie « On réessaie », jamais « Raté ».

### 55.4 Relancer les questions difficiles

À la fin, « Refaire les questions à revoir » crée une **nouvelle séance** (`parentSessionId`) dont la sélection initiale contient les questions de verdict `incorrect` ou `partial`, de marque `review`, ou de comptage manuel `mostly-wrong` ; l'enseignant ajuste la liste avant de lancer. Les slots sont retirés avec `purpose: 'replay'` (tentative différente). « Nouvelle série avec une autre graine » relance la **génération** de la fiche avec une nouvelle graine (tirée par l'interface, hors convertisseurs) et ouvre un nouveau brouillon ; la recette d'origine n'est pas modifiée.

### 55.5 Scores

| Mode | Calcul | Affichage |
|---|---|---|
| `none` (défaut) | aucun | aucun point ; progression seule |
| `collective` | +1 par question dont la dernière révélation vaut `correct`, ou dont la marque est `success` ; `review` = 0 ; `unassessed` exclue du dénominateur | « 6 réussites au tableau sur 8 questions évaluées » (jamais « la classe a réussi à 75 % ») |
| `teams` (P2) | mêmes règles, attribuées à l'équipe active de la question (alternance par défaut, ou choix de l'enseignant) | deux totaux d'équipe ; aucun total individuel |

Un point n'est **jamais** attribué à des élèves assis. Les badges (« Bien expliqué ») sont des marques de l'enseignant, discrètes et désactivables.

## 56. Comptage manuel et notes enseignant (complète §6 et §26)

### 56.1 Interface

Disponible de `cards-up` à `explained`, via le bouton « Compter » : un panneau inférieur affiche **six compteurs** (seulement les slots actifs ; les autres sont grisés et inactifs), chacun avec `−` et `+` de 64 px et saisie numérique, un champ facultatif « Présents », et trois boutons de **lecture rapide** (« Majorité juste », « Partagé », « Majorité à revoir »). Un interrupteur « Montrer à la classe » est **désactivé par défaut**. Le panneau porte en permanence l'étiquette **« Comptage saisi par l'enseignant »**.

### 56.2 Validations

Entiers entre 0 et 99 par slot ; si « Présents » est renseigné, la somme des compteurs ne peut pas le dépasser ; un comptage n'existe que si la somme vaut au moins 1 ; les slots inactifs sont désactivés. Une valeur invalide est refusée avec un message, jamais corrigée en silence.

### 56.3 Usage et limites

- Le comptage est visible à la classe seulement si l'enseignant l'a demandé ; il n'affiche **jamais** la bonne réponse.
- Dans le bilan : « vote compté manuellement », par question. Après révélation, la part tombée sur la bonne carte peut être affichée avec la mention **« d'après votre comptage »** ; aucune moyenne entre questions n'est présentée comme un taux de réussite de la classe.
- Une question sans comptage n'affiche rien à cet endroit (pas de « 0 % »).

### 56.4 Notes

`teacherMark` (réussi, à revoir, non évalué) et `badges` sont portés par la question. Le bilan propose en plus un champ « Observations » libre (2 000 caractères maximum, stocké localement, avec la consigne « évitez les noms d'élèves »), alimenté par `SESSION_NOTE_SET`. `AnswerKey.teacherNotes` n'apparaît jamais sur la projection (§57).

## 57. Écran unique : confidentialité de projection, feuille enseignant, console (complète §11)

### 57.1 Problème

Le principe « jamais de contrôle secret qui affiche la correction » laisse l'enseignant sans endroit privé pour savoir si la réponse du tableau est juste, ni pour lire ses notes. Trois niveaux de réponse :

### 57.2 P0 — Feuille de séance enseignant (imprimable)

Document A4 généré depuis le **plan résolu** (mêmes slots que la projection, tentative 0), portant en tête **« ENSEIGNANT — NE PAS PROJETER »** et en pied le `planId`. Une ligne par question : numéro, énoncé abrégé (80 caractères), **carte de la bonne réponse** (lettre, nom de couleur, symbole) et son libellé, explication courte, notes enseignant ; pour les questions ouvertes, le modèle ou les pistes. Un changement de plan (nouvelle graine, retrait d'une question) rend la feuille obsolète : l'interface le signale par comparaison de `planId`. Cette feuille ne dépend d'aucune seconde fenêtre ni d'aucun serveur.

### 57.3 P1 — Console enseignant en seconde fenêtre

Ouverte par action de l'enseignant (`window.open`, geste utilisateur) sur le même navigateur et le même appareil (ordinateur de l'enseignant relié à l'ENI en écran étendu). Synchronisation par `BroadcastChannel` dont le nom contient l'identifiant aléatoire de séance. **La fenêtre de projection reste l'unique autorité** : la console envoie des commandes typées et validées, la projection applique le reducer et rediffuse l'état public. La console affiche la bonne réponse, les notes, les indices et les commandes ; sa fermeture n'affecte pas la séance. Pop-up bloquée : message explicatif, repli sur la feuille de séance. Aucun serveur, aucun appairage.

### 57.4 Protections contre les fausses manœuvres

- Le bouton **Révéler** est isolé : au moins 48 px de tout contrôle destiné à l'élève, forme et couleur neutres.
- Réglage `toolbarGuard: 'hold-to-reveal'` : appui maintenu 600 ms avec anneau de progression (Entrée maintenue au clavier).
- **Verrou de barre** (cadenas) : toute action enseignant est suspendue jusqu'au déverrouillage (utile quand un élève se tient près de la barre).
- Confirmation pour « Terminer la séance » et « Passer sans correction ».
- Après une révélation, « Masquer à nouveau » reste accessible 10 secondes (`TEACHER_UNREVEAL`).
- Raccourcis clavier actifs seulement quand le focus est dans la barre enseignant (WCAG 2.1.4).

### 57.5 P2 — Console distante (tablette)

Hors périmètre de la V1. Exige la sécurisation serveur (F22), un code d'appairage à courte durée de vie, un relais serveur, et que **la clé de réponse ne figure jamais dans la charge utile de la projection**. Elle fera l'objet d'un modèle de menaces dédié avant toute implémentation.

### 57.6 Pause et masquage

La pause masque le contenu (réglable) et suspend minuteur et audio. Un bouton « Masquer l'écran » (écran uni) sert aux interruptions ; il ne modifie pas l'état de la question.

## 58. Design system complet (complète §8, §8 bis et §24)

### 58.1 Tokens (propositions de départ, ajustables après essais matériels)

| Famille | Token | Valeur | Remarque |
|---|---|---|---|
| Couleur | `--cc-surface` | `#F7F8FC` | fond (V3 §8 bis) |
| Couleur | `--cc-panel` | `#FFFFFF` | panneaux |
| Couleur | `--cc-text` | `#182238` | 14,94:1 sur le fond |
| Couleur | `--cc-text-muted` | `#50607A` | 6,00:1 sur le fond, 6,37:1 sur blanc |
| Couleur | `--cc-border` | `#DDE3EF` | **décoratif seulement** (1,21:1) |
| Couleur | `--cc-border-strong` | `#7A859E` | contour d'un composant à identifier : 3,49:1 sur le fond |
| Couleur | `--cc-accent` | `#5456C5` | 5,63:1 sur le fond ; **jamais posé sur une carte** (§58.2) |
| Couleur | `--cc-feedback-bg` / `--cc-feedback-fg` | `#182238` / `#FFFFFF` | pastilles ✓ ✕ **neutres**, 15,85:1 ; jamais de vert/rouge sémantique |
| Espacement | `--sp-1` … `--sp-16` | 4, 8, 12, 16, 24, 32, 48, 64 px | grille de 8 px, demi-pas de 4 px |
| Rayon | `--r-card` / `--r-panel` / `--r-control` / `--r-pill` | 20 / 16 / 12 / 999 px | |
| Ombre | `--sh-1` / `--sh-2` / `--sh-lift` | `0 1px 2px` / `0 6px 16px` / `0 12px 28px` en `rgba(24,34,56, .08 / .12 / .18)` | statiques ; l'élévation s'anime par `transform` et par l'opacité d'un pseudo-élément |
| Cible | `--hit-central` / `--hit-teacher` / `--gap-hit` | 64 / 44 / 12 px | cartes et zones de dépôt bien plus grandes |
| Mouvement | `--dur-micro` / `--dur-ui` / `--dur-reveal` | 150 / 220 / 350 ms | dans la fourchette 150–350 ms du §8 bis ; `cubic-bezier(.2,.8,.2,1)` |
| Profondeur | `--z-toolbar` / `--z-overlay` / `--z-modal` / `--z-toast` | 10 / 20 / 30 / 40 | |

### 58.2 Les six cartes : contrastes calculés

Méthode : luminance relative sRGB et rapport de contraste WCAG 2.x. Seuils : 4,5:1 pour le texte normal ; 3:1 pour le texte large (≥ 24 px, ou ≥ 18,66 px gras) et pour les contours de composants.

| Carte | Fond | Texte | Contraste texte/fond | Carte contre `--cc-surface` | Anneau `--cc-text` contre la carte | Anneau blanc contre la carte |
|---|---|---|---|---|---|---|
| A jaune | `#F4C84B` | `#182238` | 9,97 | **1,50** | 9,97 | 1,59 |
| B rouge | `#CC3456` | `#FFFFFF` | 5,01 | 4,72 | 3,17 | 5,01 |
| C orange | `#E98C2F` | `#182238` | 6,23 | **2,40** | 6,23 | 2,54 |
| D bleu | `#2463C5` | `#FFFFFF` | 5,73 | 5,40 | 2,77 | 5,73 |
| E vert | `#188268` | `#FFFFFF` | 4,74 | 4,46 | 3,35 | 4,74 |
| F violet | `#7643D6` | `#FFFFFF` | 5,93 | 5,58 | 2,68 | 5,93 |

**Conséquences normatives**
1. Tous les couples texte/fond passent 4,5:1, **E (4,74) avec peu de marge** : toute retouche de teinte revalide ce rapport par test automatique.
2. **A et C ne se détachent pas du fond clair** (1,50 et 2,40, sous 3:1) : les six cartes portent un **contour de 3 px** de `--cc-text` (uniforme), ou une variante assombrie de leur couleur validée à ≥ 3:1 par test.
3. **Anneau de sélection en double couche** : un anneau intérieur blanc de 3 px et un anneau extérieur `--cc-text` de 6 px. Aucun des deux anneaux ne suffit seul (le sombre passe sous 3:1 sur D et F ; le blanc sur A et C), mais **au moins un des deux dépasse 3:1 sur chacune des six cartes**.
4. `--cc-accent` (indigo) vaut 1,01 à 1,26 contre B, D, E, F : il ne sert **jamais** d'anneau de focus ou de sélection sur une carte ; il reste réservé aux commandes sur surfaces neutres.

### 58.3 Daltonisme : distances calculées et option de palette

Méthode : simulation de Machado et al. (2009), sévérité 1,0, appliquée en RGB linéaire, puis distance **CIEDE2000** entre les six couleurs, repère de travail ΔE ≥ 10 pour « distinguable sans référence » (*proposition*). Le script de calcul a été validé sur deux couples de référence de Sharma et al. (2,0425 et 2,8615 reproduits). **Une simulation ne remplace pas un test avec des personnes concernées.**

| Vision | Paires les plus proches, palette de la V3 |
|---|---|
| Normale | D/F 17,2 · A/C 20,2 · B/F 32,1 |
| Protanopie | **D/F 3,4** · B/E 12,7 · A/C 14,0 |
| Deutéranopie | **D/F 2,2** · A/C 10,3 · B/E 13,6 |
| Tritanopie | D/E 10,7 · A/C 14,8 · B/C 18,7 |

**Constat : le bleu D et le violet F deviennent quasi indiscernables en protanopie et en deutéranopie** (ΔE 3,4 et 2,2), et jaune/orange (A/C) restent proches. D'où l'obligation **lettre + symbole + motif** (§3, §4, §8 bis) : la couleur ne porte jamais seule l'information.

**Option « palette daltonisme » (à tester si l'établissement peut choisir ou réimprimer ses cartes)** : remplacer F par un prune/magenta, par exemple `#AA3F88` (texte blanc : 5,56:1 ; contre le fond : 5,24:1). Les paires les plus proches deviennent : normale B/F 16,7 ; protanopie D/F 10,7 ; deutéranopie A/C 10,3 ; tritanopie B/F 10,6, soit **un pire cas de 10,3 contre 2,2** pour la palette d'origine. Si les cartes physiques existantes sont violettes, l'assistant d'étalonnage (§58.6) fait correspondre l'écran à ces cartes ; le symbole reste alors la sauvegarde.

### 58.4 Symboles des cartes

| Carte | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Symbole | cercle | carré | triangle | losange | hexagone | plus (croix droite) |
| Motif de fond (noir et blanc) | points | rayures diagonales | quadrillage | vagues | damier | aplat léger |

Silhouettes pleines, tracées en SVG, **identiques sur l'écran et sur le papier**, taille minimale de 56 px à l'écran et 18 mm sur papier. **Glyphes réservés, interdits comme symboles de carte** : ✓ et ✕ (correction), ★ (récompense), ▶ ⏸ (lecture), ← → (navigation). Le « plus » reste toujours droit (jamais pivoté, pour ne pas être confondu avec ✕). Les six silhouettes sont validées au prototype par un test de lecture à distance, en niveaux de gris.

### 58.5 Typographie

- Une famille sans empattement principale, éventuellement une famille d'affichage pour la question. **Polices auto-hébergées** (fichiers WOFF2 dans le dépôt, licence consignée dans `design-system.md`), **aucune requête vers un CDN de polices** (confidentialité, mode hors ligne, CSP).
- Candidats à comparer sur l'ENI (décision D03) : *Atkinson Hyperlegible* (conçue pour la lisibilité), *Lexend* (conçue pour faciliter la lecture), *Inter* (neutre, chiffres tabulaires) ; pour les exercices de lettres en alphabétisation, une police à lettres explicites comme *Andika* (conçue pour l'apprentissage de la lecture, « a » et « g » à un étage). Licence SIL OFL d'après leurs distributeurs : **à revérifier au C0**.
- Exigences : chiffres tabulaires (`font-variant-numeric: tabular-nums`) ; couverture du français (accents, œ/Œ, guillemets « », U+202F et U+00A0) ; sous-ensemble `latin` + `latin-ext` de 150 Ko au plus, WOFF2 (*proposition*) ; `font-display: swap` ; pile de repli `system-ui, "Segoe UI", Roboto, Arial, sans-serif` ; interlignage d'au moins 1,3 pour les consignes ; `lang="fr"` sur la racine.

### 58.6 Étalonnage des couleurs de la classe

Écran « Cartes de la classe » (`/interactif/cartes`) : (1) chaque couleur s'affiche en grand avec sa lettre et son symbole ; (2) l'enseignant pose la carte physique contre l'écran et règle teinte et clarté jusqu'à les confondre visuellement ; (3) le système recalcule `textHex` et **vérifie** texte ≥ 4,5:1 et contour ≥ 3:1, avec avertissement ou refus sinon ; (4) il enregistre `paletteOverrides` et incrémente `paletteVersion` ; (5) « Réinitialiser » rétablit la palette d'origine ; (6) la planche de contrôle imprimable est produite **depuis la même palette**. Un écran n'est pas un colorimètre : l'étalonnage reste visuel et se refait si l'ENI change.

### 58.7 Mouvement et thèmes

- Seuls `transform` et `opacity` sont animés (pas de `box-shadow`, `filter` ni `backdrop-filter`). Avec `prefers-reduced-motion: reduce` ou `ClassroomSettings.motion = 'reduced'` : transitions instantanées, aucun mouvement de décor, minuteur sans pulsation (texte seul).
- Thèmes : `light` (défaut) ; `high-contrast` (texte noir sur blanc, contours de 4 px, lettre dans un disque plein, aucun dégradé) ; `dark` (P1) avec **palette des cartes inchangée** et contrastes revalidés.

### 58.8 Kit imprimable des six cartes

| Élément | Spécification |
|---|---|
| Format | A4 portrait, grille 2 × 3 sans gouttière, marges de 10 mm : **carte ≈ 95 × 92,3 mm** |
| Découpe | traits de coupe dans les marges ; fonds perdus de 3 mm si l'imprimante le permet |
| Rendu | **vectoriel** (SVG ou PDF), polices incorporées, même registre que l'écran (§24) |
| Lettre | hauteur de capitale ≥ 45 mm : environ 19 minutes d'arc à 8 m et 16 à 10 m ; un optotype 20/20 mesure 5 minutes d'arc, soit une marge de l'ordre de 3 à 4 (à valider en salle) |
| Symbole, nom | symbole ≥ 18 mm ; nom de couleur en capitales ≥ 8 mm |
| Noir et blanc | aplat remplacé par un **motif de fond distinct par carte** (points, rayures, quadrillage, vagues, damier, aplat léger) ; lettre et symbole conservés |
| Quantité | « imprimer X jeux » = X pages |
| Support | papier ≥ 160 g/m² ou plastification mate (moins de reflets) ; recto-verso en miroir : P2 |
| Fiche de démarrage | schéma du rituel + tableau lettre / couleur / symbole (A4) |

### 58.9 États visuels des cartes (précise §10)

| État | Rendu |
|---|---|
| Neutre | fond de la carte, lettre, symbole, contour 3 px ; aucune carte n'est mise en avant |
| Pressée | échelle 0,98 pendant l'appui (retour visuel < 100 ms) |
| Sélectionnée au tableau | anneau double (§58.2), élévation de 4 px, pastille de texte « Au tableau » (jamais un ✓, réservé à la correction) |
| Verrouillée | même rendu, cadenas discret |
| Inactive (hors des n choix) | gris très clair `#E6EAF2`, lettre et symbole grisés, non focalisable, `aria-hidden` |
| Révélée juste | anneau plein de 8 px `--cc-text`, pastille ✓ neutre, texte « Bonne réponse » ; les autres cartes sont atténuées **sans que le contraste du texte passe sous 3:1** (texte large) |
| Révélée, réponse au tableau incorrecte | la bonne réponse comme ci-dessus ; la réponse du tableau en contour de **tirets** de 6 px avec pastille « Réponse au tableau » et ✕ neutre ; **aucune couleur d'erreur** |
| Question ouverte | bandeau « À discuter — validation par l'enseignant », aucun verdict |

## 59. Dispositions, maquettes et règles d'adaptation (complète §9)

### 59.1 Codes de composition (reprennent §8 bis)

| Code | Composition | Particularités |
|---|---|---|
| L1 | Choix simples | question centrée, grille 3 × 2 |
| L2 | Image ou figure | zone média + zone cartes ; jamais de miniaturisation des cartes |
| L3 | Audio | lecteur en tête, grille dessous, aucune animation de décor pendant l'écoute |
| L4 | Manipulation | aire de manipulation large ; cartes en bandeau pendant la manipulation, plein format pendant la prédiction |
| L5 | Oral | images en grand (1 à 4), consigne et paliers en bandeau, pas de cartes sauf prédiction |

### 59.2 Adaptation à la zone utile (propositions, à valider au C0 et à l'ENI)

On mesure la **zone utile de la scène**, pas l'appareil. Sans dépendre des container queries ni de `:has()` avant vérification du navigateur réel de l'ENI (§68), la mise en page s'appuie sur `ResizeObserver` et des classes de palier.

| Zone utile | L1 | L2 / L3 | Texte (plancher) |
|---|---|---|---|
| ≥ 1 700 × 900 (1920 × 1080) | grille 3 × 2 | média 50 %, cartes 2 × 3 | question 36–52 px ; choix 30–42 px |
| 1 200–1 699 × 650–899 (1366 × 768, 1280 × 800) | grille 3 × 2 compacte | média 45 %, cartes 2 × 3 | question ≥ 32 px ; choix ≥ 26 px |
| < 1 200 de large ou < 650 de haut (fenêtre) | grille 2 × 3 | média au-dessus (≤ 35 % de la hauteur), cartes 2 × 3 | question ≥ 28 px ; choix ≥ 24 px |
| < 800 de large ou portrait | liste verticale 1 × n | média au-dessus | question ≥ 24 px ; choix ≥ 22 px |

### 59.3 Maquettes de structure (non design final, non captures)

**W1 — Préparer le jeu**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ <  Retour à la fiche                  PRÉPARER LE JEU                    │
├──────────────────────────────────────────────────────────────────────────┤
│  Fiche : Additions — « En ligne »             Titre : [ Additions      ] │
│                                                                          │
│  QUESTIONS   14 dans la fiche                                            │
│   [x] 10 jouables     [x] 2 à valider     [x] 1 à guider                 │
│   [ ] 1 non convertible  (voir pourquoi)                                 │
│                                                                          │
│  MÉCANIQUE   [ Calcul à 6 propositions (M02) v ]       Choix : [ 6 v ]   │
│  MÉDIAS      OK  12 / 12 prêts                          [ Précharger ]   │
│  LISIBILITÉ  OK  aucun texte trop long                                   │
│  CARTES      A jaune · B rouge · C orange · D bleu · E vert · F violet   │
│              (réglages de classe)                                        │
│                                                                          │
│     [   DÉMARRER   ]                           Réglages avancés  >       │
└──────────────────────────────────────────────────────────────────────────┘
```

**W2 — Question avec figure (L2), phase de vote**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ClairFLE · Maths / Aires          Manche 4 / 8             ||   (o)  [ ] │
├──────────────────────────────────────────────────────────────────────────┤
│  QUELLE EST L'AIRE DE CE CARRÉ ?                  MONTREZ VOTRE CARTE !  │
│ ┌──────────────────────────┐  ┌───────────────┐ ┌───────────────┐        │
│ │                          │  │ A  1 396 cm   │ │ B  698 cm     │        │
│ │        [ carré ]         │  └───────────────┘ └───────────────┘        │
│ │        349 cm            │  ┌───────────────┐ ┌───────────────┐        │
│ │                          │  │ C 121 801 cm² │ │ D 121 801 cm  │        │
│ │                          │  └───────────────┘ └───────────────┘        │
│ └──────────────────────────┘  ┌───────────────┐ ┌───────────────┐        │
│                               │ E 122 150 cm² │ │ F 121 452 cm² │        │
│                               └───────────────┘ └───────────────┘        │
├──────────────────────────────────────────────────────────────────────────┤
│  1 Réfléchir   2 Lever les cartes   3 Au tableau   4 Révéler    Suivante │
└──────────────────────────────────────────────────────────────────────────┘
```

**W3 — Révélation, réponse du tableau incorrecte**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  QUELLE EST L'AIRE DE CE CARRÉ ?                          CORRECTION     │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐      │
│ │ A  1 396 cm   │  │ B  698 cm     │  │ ✓ C  121 801 cm²          │      │
│ │    (atténuée) │  │    (atténuée) │  │   BONNE RÉPONSE           │      │
│ └───────────────┘  └───────────────┘  └───────────────────────────┘      │
│ ┌ - - - - - - - ┐  ┌───────────────┐  ┌───────────────┐                  │
│ │ ✕ D 121 801 cm│  │ E  122 150 cm²│  │ F  121 452 cm²│                  │
│ │ RÉPONSE TABLEAU│  │    (atténuée) │  │    (atténuée) │                 │
│ └ - - - - - - - ┘  └───────────────┘  └───────────────┘                  │
│  Pas tout à fait — voyons pourquoi : côté × côté = 349 × 349 = 121 801   │
├──────────────────────────────────────────────────────────────────────────┤
│  [ Explication ]  [ Masquer à nouveau ]  [ On réessaie ]   [ Suivante → ]│
└──────────────────────────────────────────────────────────────────────────┘
```

**W4 — Panneau de comptage manuel**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ COMPTAGE SAISI PAR L'ENSEIGNANT                         Présents : [ 22 ]│
│  A [-] 03 [+]    B [-] 01 [+]    C [-] 14 [+]                            │
│  D [-] 04 [+]    E [-] 00 [+]    F [-] 00 [+]            Total : 22 / 22 │
│  Lecture rapide :  ( ) Majorité juste   ( ) Partagé   ( ) À revoir       │
│  [ ] Montrer à la classe  (désactivé par défaut)           [ Valider ]   │
└──────────────────────────────────────────────────────────────────────────┘
```

**W5 — Bilan**

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ SÉANCE TERMINÉE — Additions · 8 questions                                │
├──────────────────────────────────────────────────────────────────────────┤
│  Réussites au tableau : 6 sur 8 questions évaluées                       │
│  À revoir : Q3, Q7        Non évaluées : 0        Durée : 24 min         │
│                                                                          │
│  Q1  réussi     Au tableau : C    Comptage saisi : C 14 · D 4 · A 3 ...  │
│  Q2  réussi     Au tableau : A    —                                      │
│  Q3  à revoir   Au tableau : D    Comptage saisi : B 9 · D 8 · A 5 ...   │
│  ...                                                                     │
│  Aucun score individuel n'est calculé pour les cartes levées.            │
│  Observations : [ ..................................................... ]│
│  [ Refaire les questions à revoir ]   [ Imprimer le bilan ]   [ Fermer ] │
└──────────────────────────────────────────────────────────────────────────┘
```

### 59.4 Échelle de repli du texte long et contrôle de lisibilité

Aucun texte n'est jamais coupé en silence. Palier après palier :
1. Réduire la taille entre la cible et le plancher du §59.2, par recherche dichotomique **mesurée** (`ResizeObserver`), sans changer la mise en page.
2. Passer la grille en **liste verticale 1 × n** pour donner toute la hauteur au texte.
3. Zone de texte à **défilement interne** avec indicateur visible (« Suite ▾ ») : dernier recours.
4. Avertir à la préparation (`TEXT_TOO_LONG`) en listant les questions concernées et en suggérant de raccourcir la consigne dans la fiche.

Le **contrôle de lisibilité** de l'écran « Préparer » calcule, pour chaque question, à 1920 × 1080 et à 1366 × 768, le palier nécessaire (mesure hors écran) et signale celles qui exigent les paliers 2 à 4.

## 60. Matrice des états et microcopy français (complète §10)

### 60.1 Matrice des états

| Phase | Bandeau | Bouton principal | Actions secondaires | Visible à l'écran | Navigation |
|---|---|---|---|---|---|
| `intro` | « Nouvelle question » | Réfléchir | Indice (si disponible), Passer | énoncé, médias, cartes neutres | précédente, passer sans correction (confirmation) |
| `thinking` | « Réfléchissez. Gardez votre carte cachée. » | Lever les cartes | Indice, minuteur | idem + minuteur si activé | retour à `intro` |
| `cards-up` | « Montrez votre carte ! » | Au tableau | Compter, Indice | idem, bandeau renforcé | retour à `thinking` |
| `board-turn` | « Au tableau : touche ta réponse » | Révéler (inactif tant qu'aucune réponse au tableau : « En attente du tableau ») | Discussion, Verrouiller, Effacer, Compter, Indice | sélection (anneau, pastille), aucune correction | retour à `cards-up` |
| `discussion` | « On en parle : pourquoi ce choix ? » | Révéler | Verrouiller, Changer de réponse, Compter, Indice | idem | retour à `board-turn` |
| `revealed` | « Correction » + libellé du verdict | Question suivante | Explication, Masquer à nouveau (10 s), On réessaie, Marquer, Compter | clé, explication courte | précédente, suivante |
| `explained` | « Explication » | Question suivante | Retour à la correction, « Pourquoi ces propositions ? » (maths), On réessaie, Marquer | explication détaillée | précédente, suivante |
| pause | « Pause » | Reprendre | Masquer l'écran | contenu masqué | — |
| terminée | « Séance terminée » | Voir le bilan | Refaire les questions à revoir, Nouvelle série (autre graine), Enregistrer la configuration du jeu, Imprimer le bilan, Revenir à la fiche, Imprimer les cartes | bilan | — |

Pour une question ouverte, le bouton principal s'adapte : « Commencer », « Palier suivant », « Révéler le modèle ». **Une seule action principale** est mise en avant à la fois ; son libellé est celui de l'étape suivante.

### 60.2 Verdicts, marques et lignes de correction

| Valeur | Libellé | Pictogramme (pastille neutre) |
|---|---|---|
| `correct` | « Bonne réponse » | ✓ |
| `partial` | « Presque : une partie est juste » | demi-disque |
| `incorrect` | « Pas tout à fait — voyons pourquoi » | ✕ |
| `no-answer` | « Pas de réponse au tableau » | — |
| `teacher-pending` | « À discuter — validation par l'enseignant » | … |
| marques | « Réussi » · « À revoir » · « Non évalué » | texte seul |

Lignes de correction : « Bonne réponse : C · 121 801 cm² » ; « Réponse au tableau : D · 121 801 cm ». La lettre et le libellé sont toujours donnés ensemble.

### 60.3 Variantes FALC (réglage `falc`)

`intro` « Voici la question. » · `thinking` « Réfléchis. » · `cards-up` « Montrez votre carte. » · `board-turn` « Un élève répond au tableau. » · `discussion` « On en parle. » · `revealed` « Voici la réponse. » · terminée « C'est fini. » Une seule information principale à la fois ; phrases de moins de 12 mots.

### 60.4 Messages

| Code | Message |
|---|---|
| `CONVERSION_ERROR` | « Cette question n'a pas pu être convertie sans risque d'erreur. Elle reste disponible sur la fiche imprimée. » |
| `UNKNOWN_EXERCISE_TYPE` | « Ce type d'exercice n'est pas encore pris en charge en jeu. » |
| `PRINT_ONLY_ACTION` | « Cet exercice se fait sur papier (découper, coller, écrire). » |
| `OPEN_PRODUCTION` | « Production libre : à guider par l'enseignant, sans correction automatique. » |
| `NO_ANSWER` | « Aucune réponse fiable dans la fiche : impossible de proposer un jeu à choix. » |
| `LETTER_REFERENCE` | « L'énoncé ou les choix citent des lettres : à vérifier avant de jouer. » |
| `AMBIGUOUS_ANSWER` | « Plusieurs réponses sont possibles : à valider. » |
| `DUPLICATE_OPTIONS` | « Deux choix sont identiques : à corriger. » |
| `TOO_MANY_OPTIONS` | « Plus de six choix : sélectionnez ceux à garder. » |
| `NO_VERIFIED_OPTIONS` | « Aucun choix fiable n'est proposé : ajoutez ou validez les propositions. » |
| `MEDIA_MISSING` | « Un média est introuvable : la question est exclue tant que vous ne confirmez pas. » |
| `TEXT_TOO_LONG` | « Texte long : lisibilité réduite à l'écran. » |
| Audio indisponible | « Piste audio indisponible. Vous pouvez réessayer ou passer à la question suivante. » |
| Lecture bloquée | « Appuyez sur Lecture pour démarrer le son. » |
| Écoutes épuisées | « Nombre d'écoutes atteint. » |
| Image indisponible | « Image indisponible. » + bouton « Réessayer » |
| Fiche supprimée | « Cette fiche n'existe plus. Retour à vos fiches. » |
| Reprise | « Reprendre la séance du {date} (question {n} sur {N}) ? » |
| Plan changé | « La fiche ou le moteur a changé : la reprise à l'identique est impossible. » |
| Stockage | « Impossible de sauvegarder la séance sur cet appareil. Elle continue sans reprise automatique. » |
| Hors ligne | « Connexion perdue. La séance continue ; certaines sauvegardes sont suspendues. » |
| Seconde fenêtre bloquée | « Le navigateur a bloqué la seconde fenêtre. Autorisez-la ou imprimez la feuille de séance. » |
| Barre verrouillée | « Barre verrouillée. Touchez le cadenas pour la déverrouiller. » |

### 60.5 Annonces pour lecteurs d'écran

Les changements de phase passent par une région `role="status"` : « Question 3 sur 8 », « Cartes levées », « Correction : la bonne réponse est C, 121 801 cm² » (**uniquement après** `TEACHER_REVEAL`). Les annonces, `aria-label` et descriptions obéissent aux mêmes règles de non-fuite que le DOM visible (§69.2).

## 61. Interaction tactile, plein écran et gestes sur ENI (complète §9 et §12)

### 61.1 Événements et cibles

- **Pointer Events uniquement** (`pointerdown`, `pointerup`, `pointercancel`) ; aucune dépendance au survol ni au seul `click`. `touch-action: manipulation` sur les commandes, `touch-action: none` sur les éléments déplaçables.
- Cibles : ≥ 64 × 64 px pour les éléments centraux, ≥ 44 × 44 px pour l'enseignant, **≥ 12 px** entre cibles voisines (le minimum du critère WCAG 2.5.8 est de 24 px de cible).

### 61.2 Fiabilité sur cadres infrarouges (manches, paumes, contacts parasites)

- Un **seul pointeur actif** par composant interactif : les contacts simultanés supplémentaires sont ignorés.
- Un toucher est validé à `pointerup` si le pointeur est resté sur l'élément et s'est déplacé de moins de 10 px (tolérance de glissement).
- Lorsque `PointerEvent.width` et `height` sont renseignés, ignorer les contacts plus larges qu'un seuil réglable (paume) : fonction facultative, à valider sur l'ENI réel.
- Gel de 250 ms après une sélection pour absorber les doubles touchers ; retour visuel < 100 ms après `pointerdown`, avec un état « pressé » distinct de l'état « sélectionné ».

### 61.3 Glisser-déposer

Implémenté avec les Pointer Events, **pas** avec l'API HTML5 Drag and Drop, peu fiable au tactile : `setPointerCapture`, seuil de glissement de 8 px, zones de dépôt à rayon d'attraction, retour animé (hors mouvement réduit) si l'élément est relâché hors zone. L'alternative **« toucher puis toucher »** est toujours disponible ; le dernier déplacement est annulable ; au clavier, les flèches déplacent l'élément sélectionné entre les places.

### 61.4 Environnement du navigateur

`overscroll-behavior: none` ; `user-select: none` sur les commandes (pas sur les consignes) ; menu contextuel supprimé sur appui long des composants interactifs ; `-webkit-tap-highlight-color: transparent`. **Ne pas bloquer le zoom du navigateur** (WCAG 1.4.4) ; l'application fournit son propre zoom pour images et figures. `beforeunload` n'est armé que pendant une séance `running`.

### 61.5 Plein écran et veille

Le plein écran est demandé par un geste de l'enseignant ; s'il est indisponible, un mode « kiosque CSS » masque l'interface de l'application et un rappel indique F11. **La séance ne dépend pas du plein écran** (en sortir ne la perd pas). Le verrou de veille (`navigator.wakeLock.request('screen')`) est pris pendant `running` si `keepAwake`, repris au retour de visibilité, et son échec est silencieux (indiqué dans les réglages). `visibilitychange` suspend audio et minuteur quand l'onglet est masqué.

## 62. Médias : gestionnaire, précontrôle, audio, images, nombres (complète §24)

### 62.1 Précontrôle (écran « Préparer »)

`MediaManager.preflight(plan)` : URL uniques ; requête `GET` avec `Range: bytes=0-0` (repli quand `HEAD` n'est pas géré), délai de 8 s, 4 requêtes en parallèle ; images validées par `decode()`, audio par `loadedmetadata`. Statuts : `ok`, `slow` (> 3 s), `missing` (404 ou 410), `blocked` (CSP ou CORS), `invalid` (type MIME ou taille aberrante), `timeout`. Alertes de poids : image > 2 Mo, audio > 10 Mo (*proposition*). Le rapport donne les totaux et la liste, avec « Réessayer » et une bascule **« Exclure les questions concernées »**, activée par défaut pour `missing`, `blocked` et `invalid`.

**Origines admises** : même origine, liste blanche alignée sur la CSP (§65 S5), `data:` (petits fichiers) et `blob:` (préchargement). Tout autre schéma (`javascript:`…) est rejeté.

### 62.2 Préchargement

Pendant la séance, seule la **question suivante** est préchargée (la précédente reste en cache), **sans traitement différencié selon la bonne réponse** ; les images sont décodées avant affichage pour éviter les clignotements. « Précharger toute la séance » (blobs en mémoire, taille totale affichée) est un P1.

### 62.3 Audio

États : `idle → loading → ready → playing ⇄ paused → ended`, plus `error`.
- Une **écoute** est une lecture **réellement démarrée depuis le début** (événement média `playing` avec `currentTime < 0,5 s`) : ni une reprise après pause, ni une erreur avant lecture. Elle émet `AUDIO_LISTEN_STARTED`.
- `maxListens` atteint : bouton « Écouter » désactivé et message « Nombre d'écoutes atteint » ; l'enseignant peut accorder une écoute de plus (`AUDIO_EXTRA_LISTEN_GRANTED`, journalisé).
- `error`, ou `stalled` pendant plus de 8 s : message du §60.4 et « Réessayer ».
- Démarrage **toujours** par un geste (politique d'autolecture des navigateurs) ; aucun son d'ambiance pendant une écoute ; volume système non modifié.
- Le lecteur affiche « Écoute n / N » et une barre de progression doublée d'un texte. La transcription n'est accessible à la classe qu'après la correction, si le réglage correspondant est activé.

### 62.4 Images, figures et zoom

`alt` obligatoire ; ratio conservé (`object-fit: contain`), aucune déformation ; image défaillante = « Image indisponible » avec « Réessayer », **jamais** un pictogramme muet. Zoom en surimpression de 1× à 3× par boutons `+` et `−`, déplacement par glissement ou flèches, fermeture par bouton et Échap. Les figures SVG sont des composants de confiance alimentés par `FigureSpec`, avec `role="img"` et `<title>` / `<desc>` (ou `aria-label`).

### 62.5 Nombres et typographie française

- Formateur interne **déterministe** : `Intl.NumberFormat` varie selon le moteur et la version d'ICU (séparateur de milliers) et ne doit pas servir à produire le texte affiché ni les valeurs de test.
- Milliers : U+202F (espace fine insécable) par défaut, réglable ; décimal : `,` ; entre nombre et unité : U+00A0 ; regroupement dès 4 chiffres pour les quantités calculées, avec un indicateur `groupDigits` désactivable (années, identifiants).
- **Le format affiché doit être identique à celui du corrigé A4** (test de cohérence).
- Typographie française appliquée **au rendu seulement** (jamais stockée, jamais utilisée pour comparer) : U+202F avant `;` `!` `?`, U+00A0 avant `:` et dans les guillemets français ; opérateurs `×`, `÷`, `−` (U+2212) au lieu de `x`, `/`, `-`.
- Vérifier que la police retenue contient U+202F et U+00A0 ; sinon, repli sur U+00A0 avec `letter-spacing` ajusté. Test : « 1 559 » doit avoir la même largeur rendue sur les navigateurs cibles.
- `promptA11y` développe les symboles : « plus », « moins », « fois », « divisé par », « égale ».

## 63. Persistance, reprise et export (complète §21 et §28)

### 63.1 Magasins locaux

Base IndexedDB `clairfle-interactive` (petit wrapper maison, sans dépendance, sauf justification par ADR).

| Magasin | Contenu | Clé | Durée de vie | Remarques |
|---|---|---|---|---|
| `drafts` | instantané de recette (`FicheRecipe` v1, `libreSnapshot`, références d'images) | `draftId` | 24 h après la dernière ouverture | créé au clic « Jouer » depuis le générateur (§64.2) |
| `sessions` | `{ schemaVersion, sessionId, planId, source: { ficheId } ou { draftId }, presetRef, events[] }` | `sessionId` | 7 jours (réglable) | **ni clé de réponse, ni noms d'élèves** |
| `presets-local` | `GamePreset` v2 | `presetId` | jusqu'à suppression | avant F21 / F22 ; migration vers le serveur ensuite |
| `settings` | `ClassroomSettings` | `classroom` | permanent | |
| `media` (P1) | blobs préchargés | URL | durée de la séance | |

`localStorage` ne sert qu'à de petits drapeaux (feature flag, préférence de thème pour éviter un flash au chargement). Toute lecture ou écriture est dans un `try/catch` : stockage indisponible ou quota dépassé (`QuotaExceededError`) → la séance continue sans reprise automatique, avec le message du §60.4.

### 63.2 Journal d'événements

- Écriture après chaque événement, regroupée sur 300 ms, vidage forcé sur `visibilitychange` et `pagehide`.
- Plafond de 5 000 événements. À la fin de la séance : **compactage** (on garde l'instantané `SessionState` et le bilan, on supprime les événements de bas niveau comme l'audio ou le minuteur).
- Chaque enregistrement porte `schemaVersion`. Version **plus récente** que connue : lecture refusée, aucune modification. Version **plus ancienne** : fonction de migration testée. Aucune migration destructive.

### 63.3 Reprise

1. À l'ouverture d'une route `/interactif…`, chercher une séance non terminée de la même source.
2. Proposer « Reprendre la séance du {date} (question {n} sur {N}) ? » avec **Reprendre**, **Recommencer**, **Supprimer**.
3. Reprendre : reconstruire le plan (recette ou fiche, preset, `conversionVersion`, palette) et comparer `planId`. S'il est **identique**, rejouer le journal dans le reducer (idempotence, I4) : la séance revient au même état, `revealed` provenant du journal et jamais d'un recalcul. S'il **diffère**, message « Plan changé » (§60.4) avec deux issues : reprendre à la question N sans historique, ou recommencer.
4. Fiche source supprimée : message du §60.4, retour à « Mes fiches ».
5. Actualisation en `cards-up` ou `board-turn` : la phase et la réponse du tableau sont restituées ; **rien n'est révélé**.

### 63.4 Presets locaux et obsolescence

`contentHashAtSave` est comparé au `contentHash` courant des items sélectionnés. En cas d'écart, l'avertissement `STALE_PRESET` propose **Mettre à jour** (conserver ce qui correspond encore, par `sourceKey` et jamais par index d'affichage), **Dupliquer** ou **Ignorer**. Aucune suppression automatique.

### 63.5 Accès concurrents

Une seule fenêtre active par séance : `navigator.locks` (Web Locks) lorsqu'il existe, sinon sondage par `BroadcastChannel`. Une seconde ouverture propose « Séance ouverte dans un autre onglet : prendre la main / fermer ». La console du §57.3 est une fenêtre **suiveuse** déclarée, pas une concurrente.

### 63.6 Export, import et effacement

P1 : « Exporter la séance » (JSON : `schemaVersion`, date, état compacté, bilan, sans noms) et « Importer ». Réglages : « Effacer toutes les données locales de ClairFLE interactif » (base IndexedDB et drapeaux). **Aucune synchronisation serveur des séances en V1.**

## 64. Routes, transmission du brouillon, déploiement et drapeau de fonctionnalité (complète §23)

### 64.1 Routes

| Route | Rôle | Remarques |
|---|---|---|
| `/interactif?d={draftId}` | préparer un brouillon | sans `d` valide : retour au générateur avec message |
| `/interactif/:ficheId` | préparer une fiche enregistrée | accès contrôlé comme la fiche (§65 S2) |
| `…?s={sessionId}` | séance en cours | identifiant aléatoire non secret ; sert à la reprise après actualisation |
| `/interactif/cartes` | étalonnage des couleurs et planche d'impression | §58.6 |
| `/interactif/diagnostic` | diagnostic de l'appareil | §68.3 |
| `/interactif/console/:sessionId` | console enseignant (P1) | §57.3 |

Aucun secret, jeton ni mot de passe dans une URL.

### 64.2 Transmission du brouillon

Au clic sur « Jouer avec la classe » dans `GeneratorPage` : (1) sérialiser un instantané (`FicheRecipe` v1, `libreSnapshot`, références d'images, jamais les octets) ; (2) l'écrire dans `drafts` sous un `draftId` aléatoire ; (3) naviguer côté client vers `/interactif?d={draftId}` ; (4) à l'actualisation, relire l'instantané ; (5) s'il est introuvable ou expiré, message puis retour au générateur. Le générateur et ses actions Imprimer et Corrigé ne sont pas modifiés.

### 64.3 Hébergement de l'application monopage

Vérifier la règle de réécriture existante (`vercel.json` ou équivalent) pour que **chaque route ci-dessus se charge en accès direct et à l'actualisation**, sans réécrire les requêtes d'API ni les fichiers statiques. Un test e2e couvre chaque route.

### 64.4 Découpage du code

Tout `src/interactive/ui/**` est chargé par `React.lazy` et `Suspense`. Le chemin critique de l'A4 n'importe de `src/interactive/**` que le bouton et le chargeur paresseux (budgets au §68.1).

### 64.5 Drapeau de fonctionnalité

`VITE_INTERACTIVE_MODE` vaut `off`, `pilot` ou `on` :
- `off` : aucun bouton « Jouer », routes redirigées vers l'accueil ;
- `pilot` : visible seulement si `localStorage['clairfle.interactive'] === '1'`, posé par une visite de `?interactif=1` — **portillon de confort, pas une mesure de sécurité** ;
- `on` : visible pour tous.

Pendant la transition, `VITE_LEGACY_GAME` (`on` ou `off`) conserve ou masque l'ancien mode ; **les deux modes ne sont jamais proposés ensemble** à l'utilisateur. Aucune valeur `VITE_*` ne contient de secret (tout ce qui est préfixé est embarqué dans le bundle).

### 64.6 Retour arrière

Deux voies, à documenter dans `release-plan.md` : (a) passer le drapeau à `off` et redéployer ; (b) promouvoir le déploiement précédent par la fonction de retour instantané de l'hébergeur. L'ancien code n'est supprimé (F24) que **dans une PR séparée, plus tard**, pour que le retour reste trivial.

## 65. Sécurité : plan actionnable (complète §28 et §41)

**Ordonnancement.** Le MVP local exige S1, S4 et S5 (côté front). **F22 (S2, S3, S7, S8) précède tout stockage partagé** de presets ou de séances sur le serveur.

### S1 — Hygiène des secrets
- Chercher secrets, mots de passe, valeurs de secours et jetons dans le code, **l'historique git** et le **bundle de production** (`dist/`) ; outil de détection de secrets (gitleaks ou équivalent) en CI et en pré-commit.
- Faire tourner tout secret exposé ; purge de l'historique si nécessaire (décision du propriétaire).
- Aucun secret derrière un préfixe `VITE_`.
- **Acceptation :** recherche automatisée de chaînes sensibles dans `dist/` → 0 résultat ; aucun secret dans les journaux ni les URL.

### S2 — Authentification et autorisation côté serveur
- Toute route de l'API exige une authentification vérifiée **par le Worker** ; refus par défaut.
- Jeton de session : de préférence **cookie `HttpOnly; Secure; SameSite=Lax`**, l'API étant servie sous le même domaine enregistrable que le front (sous-domaine) ; sinon jeton court conservé **en mémoire** (jamais dans `localStorage`). Décision D04.
- Comparaison des secrets en temps constant ; tout mot de passe stocké l'est sous forme de condensat à coût adaptatif adapté au runtime (suivre les recommandations OWASP en vigueur), jamais en clair.
- Limitation des tentatives (par IP et par compte), expiration, déconnexion explicite, message identique pour « compte inconnu » et « mot de passe faux ».
- Autorisation **par route et par ressource** (rôle, domaine ou propriétaire selon le modèle retenu) : matrice de tests rôle × route × méthode ; tests négatifs (accès à une fiche d'un autre périmètre par identifiant deviné, champs superflus dans le corps de requête).
- Connexion accessible (WCAG 3.3.8) : aucun test cognitif imposé, collage et gestionnaires de mots de passe autorisés.

### S3 — Stockage des presets (API et SQL illustratif)

```sql
-- Illustratif : adapter noms, clés et modèle d'accès au schéma réel lors de F22.
CREATE TABLE IF NOT EXISTS game_presets (
  id                 TEXT PRIMARY KEY,                 -- UUID généré côté serveur
  fiche_id           TEXT NOT NULL,                    -- référence logique vers la fiche existante
  access_scope       TEXT NOT NULL,                    -- propriétaire, rôle ou domaine (modèle de S2)
  name               TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  schema_version     INTEGER NOT NULL,
  conversion_version INTEGER NOT NULL,
  content_hash       TEXT NOT NULL,
  payload            TEXT NOT NULL CHECK (length(payload) <= 262144),  -- JSON validé par le Worker
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at         TEXT
);
CREATE INDEX IF NOT EXISTS idx_game_presets_fiche ON game_presets (fiche_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_game_presets_scope ON game_presets (access_scope, updated_at);
```

| Méthode et chemin | Autorisation | Validation | Limites |
|---|---|---|---|
| `GET /presets?ficheId=` | lecture de la fiche | forme de `ficheId`, existence | pagination ≤ 50 |
| `PUT /presets/:id` | écriture sur la fiche | schéma `GamePreset` v2 **strict** (champs inconnus refusés), `payload` ≤ 256 Ko | débit par compte |
| `DELETE /presets/:id` | écriture sur la fiche | existence et droits | suppression logique (`deleted_at`) |

Requêtes **paramétrées** uniquement (`prepare().bind()` côté D1) ; migration SQL versionnée et réversible ; **aucune écriture de séance ni de vote** en V1.

### S4 — Rendu sûr (XSS, médias, SVG)
- Tout texte (fiche, mode libre, preset) est rendu **comme texte**. `dangerouslySetInnerHTML` est interdit dans `src/interactive/` (règle de lint) ; seule exception : un SVG produit par un générateur interne de confiance.
- SVG fourni par un utilisateur ou une banque non maîtrisée : affiché par `<img>` (aucun script exécuté) ou assaini, jamais injecté en ligne.
- URL de média validées (§62.1) ; liens externes avec `rel="noopener noreferrer"`.
- Le mode libre est traité comme **non fiable**, même si l'auteur est l'enseignant : une fiche partagée peut venir d'un autre.

### S5 — En-têtes HTTP, CSP, CORS
- CSP du front déployée d'abord en **mode rapport seulement**, puis appliquée : `default-src 'self'`, `script-src 'self'`, `img-src 'self' data: blob:`, `media-src 'self' blob:`, `font-src 'self'`, `connect-src 'self'` plus l'origine de l'API, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`. Les styles en ligne appellent une décision explicite (nonce, hash ou `style-src-attr`).
- `X-Content-Type-Options: nosniff` ; `Referrer-Policy: strict-origin-when-cross-origin` ; `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), fullscreen=(self)` (cohérent avec « ni caméra ni micro »).
- CORS de l'API : liste blanche d'origines exactes, jamais `*` avec identifiants, méthodes et en-têtes limités, `Vary: Origin`.

### S6 — Dépendances et chaîne de build
- `npm ci` avec fichier de verrouillage ; `npm audit --omit=dev` en CI, bloquant pour les failles hautes ou critiques des dépendances de production ; mises à jour automatisées (Dependabot ou Renovate) ; licences vérifiées.
- **Chaque nouvelle dépendance est justifiée** par un ADR (utilité, taille, licence, alternative sans dépendance). Candidats probables, à confirmer au C0 selon l'existant : Vitest, Testing Library, Playwright, `@axe-core/playwright`, fast-check, une bibliothèque de validation de schémas (réutiliser celle du dépôt, sinon zod ou équivalent).

### S7 — Abus, limites et débit
Limites de taille de corps, de longueur de champs et de nombre d'éléments ; limitation de débit sur la connexion et sur toutes les routes d'écriture ; quotas de stockage par compte ; erreurs sans détail interne.

### S8 — Journalisation et incident
Journaux structurés **sans secrets ni contenus d'élèves**, sans corps de requête complet, corrélés par identifiant de requête ; rétention courte ; procédure d'incident dans `securite.md` (qui prévenir, comment révoquer les jetons, comment faire tourner les secrets).

## 66. Confidentialité et conformité (complète §28)

| Donnée | Lieu | Durée | Personnelle ? | Effacement |
|---|---|---|---|---|
| Instantané de recette (brouillon) | IndexedDB local | 24 h | Non (contenu pédagogique) | automatique et bouton |
| Journal de séance (réponses au tableau, comptages manuels, marques) | IndexedDB local | 7 jours | Non par conception | automatique et bouton |
| Observations libres de l'enseignant | IndexedDB local | 7 jours | **Possible** (saisie libre) | automatique et bouton |
| Réglages de classe | IndexedDB local | permanent | Non | bouton |
| Presets (serveur, après F22) | D1 | jusqu'à suppression | Non | suppression logique puis purge |
| Journaux serveur | Worker | courte | adresses IP selon l'hébergeur | selon la politique d'hébergement |

- **Aucune donnée nominative d'élève**, aucun identifiant d'élève, aucune caméra ni micro (permissions refusées par en-tête, §65 S5).
- **Aucune requête vers un tiers à l'exécution** : polices et scripts auto-hébergés, aucun traceur, aucune mesure d'audience. Toute mesure d'usage future serait agrégée, sans contenu ni identifiant, et soumise à décision du propriétaire.
- Le champ « Observations » affiche en permanence « évitez les noms d'élèves ».
- Droits d'auteur : le champ `credit` d'un média est conservé et affichable (« À propos de ce média ») ; avertissement s'il manque pour un média non maîtrisé ; licences des polices et icônes consignées.
- Cadre légal applicable (RGPD ou équivalent local, règles de l'établissement, public mineur) : **à confirmer par le propriétaire**. La minimisation évite d'avoir à gérer des données d'élèves.

## 67. Accessibilité : exigences testables (complète §12 et §40)

**Cible : WCAG 2.2 niveau AA** pour l'interface projetée et l'écran de préparation.

| Critère | Application |
|---|---|
| 1.4.3, 1.4.11 | contrastes du §58.2 ; contour des composants ≥ 3:1 |
| 1.4.4, 1.4.12 | zoom navigateur non bloqué ; interlignage et espacement modifiables sans perte |
| 2.1.1, 2.1.4 | tout au clavier ; raccourcis à caractère unique seulement avec le focus dans le composant |
| 2.3.1 | aucun clignotement de plus de 3 flashs par seconde ; mouvement réduit respecté |
| 2.4.7, 2.4.11 | focus visible et jamais masqué par la barre enseignant (anneau double, §58.2) |
| 2.5.7 | tout glisser a une alternative à un seul pointeur (§61.3) |
| 2.5.8 | cibles ≥ 24 px (on vise 44 à 64 px et plus) |
| 3.3.1, 3.3.3 | erreurs identifiées en texte avec suggestion de correction |
| 4.1.2, 4.1.3 | rôles, états et messages de statut (§60.5) |

### Motifs ARIA
- `single-choice` : `role="radiogroup"` nommé par l'énoncé ; cartes en `role="radio"` avec `aria-checked`, tabindex itinérant, flèches pour naviguer, Espace ou Entrée pour choisir ; les lettres A à F sélectionnent **uniquement quand le focus est dans la grille**.
- `multi-choice` : `role="group"` et `role="checkbox"`.
- Cartes inactives : `aria-hidden="true"`, non focalisables.
- Changement de question : le focus va à l'énoncé (`tabindex="-1"`), annonce « Question n sur N ».
- Glisser-déposer : instructions reliées par `aria-describedby`, alternative toucher / toucher, déplacement par flèches avec annonces « position 2 sur 4 ».
- Audio : boutons nommés, temps annoncé, `aria-live="polite"` avec parcimonie.
- **Aucune annonce ni aucun libellé ne révèle la bonne réponse avant `revealed`.**

### Vérification
Axe automatisé en CI (il ne détecte qu'une partie des problèmes) **et** liste de contrôle manuelle : clavier seul, au moins un lecteur d'écran, zoom à 200 %, mouvement réduit, contraste élevé. Résultats consignés dans `checklist-acceptation.md` ; **ce qui n'a pas été testé s'écrit « non testé »**.

## 68. Performance et compatibilité (complète §32 et §40)

### 68.1 Budgets initiaux (propositions, à calibrer au C0 puis sur l'ENI)

| Mesure | Budget initial |
|---|---|
| Croissance du bundle principal (A4) | ≤ 5 Ko gzip (bouton et chargeur paresseux) |
| Bundle de la route `/interactif` (JS et CSS, hors polices et médias) | ≤ 200 Ko gzip |
| Polices (WOFF2) | ≤ 150 Ko au total |
| Conversion d'une fiche de 50 questions | ≤ 150 ms sur ordinateur moyen, à mesurer sur matériel ENI ; découper en tranches au-delà de 100 ms |
| Retour visuel après `pointerdown` | < 100 ms |
| Animations | 60 images/s visées ; dégradation automatique (ombres animées coupées) si le temps de trame dépasse 24 ms de façon soutenue |
| Première question affichée après « Démarrer » (médias en cache) | ≤ 2 s |
| Préchargement | question suivante seulement ; images décodées ≤ 4 mégapixels |

Mesure : `size-limit` (ou équivalent) en CI, profilage manuel sur l'ENI, résultats dans `checklist-acceptation.md`.

### 68.2 Compatibilité

- Cibles : Chrome et Edge (courantes − 2), Firefox (courante), Safari et iPadOS en meilleur effort ; **navigateur de l'ENI à relever** (Android WebView, ChromeOS, Windows) avec la page de diagnostic.
- `browserslist` et `build.target` de Vite alignés sur la matrice relevée. Aucune API récente sans vérification et repli : container queries, `:has()`, `structuredClone`, `BroadcastChannel`, Web Locks, Wake Lock.
- `crypto.randomUUID()` exige un contexte sécurisé (HTTPS ou localhost) : prévoir un repli pour les identifiants.

### 68.3 Page de diagnostic (`/interactif/diagnostic`)

Affiche, avec une sortie texte copiable pour `diagnostic-eni.md` : agent utilisateur ; tailles d'écran et de fenêtre, rapport de pixels ; `navigator.maxTouchPoints` et types de pointeurs ; **latence** (délai `pointerdown` → image suivante, sur 10 touchers) ; prise en charge du plein écran, de Wake Lock, de `BroadcastChannel`, de Web Locks, d'IndexedDB (quota estimé), des container queries ; `prefers-reduced-motion` et `prefers-contrast` ; état de la connexion ; test d'**autolecture audio** (geste requis) ; test des **polices** (U+202F, U+00A0, chiffres tabulaires) ; test de **contacts parasites** (zone où poser la paume : nombre de contacts simultanés rapportés) ; test des **six aplats** plein écran.

C'est le moyen de **ne pas promettre un test ENI qui n'a pas eu lieu** (§40) : la mention « testé sur ENI » exige un rapport de diagnostic joint.

## 69. Stratégie de test détaillée et CI (complète §32 et §40)

### 69.1 Outils recommandés (s'aligner sur l'existant au C0)

Vitest (unitaires, compatible Vite), Testing Library (composants), Playwright (e2e et captures), `@axe-core/playwright` (accessibilité), fast-check (tests de propriétés).

### 69.2 Oracle de non-fuite (tests obligatoires)

1. **Signature structurelle.** Pour 20 questions aléatoires et chaque phase antérieure à `revealed`, calculer la signature DOM normalisée de chaque carte (balises, classes, attributs, rôles, `aria-*`, **texte retiré**) : toutes les cartes actives d'une question ont la même signature.
2. **Sérialisation.** `JSON.stringify` des props des composants de vote et de l'état de séance ne contient ni `solution`, `correct`, `expected`, `explanation`, `hints`, `teacherNotes`, ni `distractorNotes`.
3. **Accessibilité.** Aucun `aria-label`, `aria-live`, `title` ni texte masqué ne mentionne la bonne réponse avant révélation.
4. **Réseau.** Aucun préchargement ni priorité différenciés selon la bonne réponse.
5. **Typage.** Les composants de vote refusent un `AnswerKey` (test de type avec `expectTypeOf`).
6. **Actualisation.** L'état persisté avant révélation ne contient aucune information de correction.

### 69.3 Pyramide

**Unitaires**
- *Reducer* : tests pilotés par la table du §49.4 (un cas accepté et un cas refusé par ligne), invariants I1 à I10 ; **tests à base de modèle** : séquences aléatoires d'événements (fast-check) sans violation d'invariant, jamais de `revealed` sans `TEACHER_REVEAL`, relecture du journal = même état.
- *Distracteurs* : propriétés sur au moins 1 000 items générés (une seule bonne réponse ; choix distincts en valeur **et** en unité ; au plus 6 ; une famille par distracteur ; bonne réponse recalculée = celle de la source). **Anti-indice** : la bonne réponse est la médiane de l'ensemble dans au plus (1/n + 0,20) des cas, et seule à avoir un dernier chiffre distinct dans au plus 10 % des cas (*propositions de seuils*).
- *Déterminisme* : mêmes entrées, mêmes questions, mêmes slots, même `planId` ; vecteurs de test du hash et de `deriveSeed` ; équilibre des slots (§50.3) sur 100 séries aléatoires.
- *Formatage* : « 1 559 », « 121 801 cm² », décimaux, grands nombres, séparateurs U+202F et U+00A0. **Aucun test ne dépend de `Intl` ni de l'horloge.**
- *Compatibilité* : une fixture par `reasonCode`.

**Composants et accessibilité** : clavier complet, pointeur, tactile simulé ; cartes inactives ; anneau de focus visible ; axe sur chaque écran et chaque phase ; mouvement réduit ; thème à contraste élevé.

**Détecteur de débordement** : pour chaque fixture, à 1920 × 1080 et à 1366 × 768, aucun texte ne déborde de son conteneur sans indicateur de défilement (`scrollWidth ≤ clientWidth` et `scrollHeight ≤ clientHeight`) : couvre l'acceptation n° 18.

**E2E** (Playwright, Chromium d'abord, WebKit et Firefox en meilleur effort) : les scénarios automatisables des §43 et §71.2 ; accès direct et actualisation de chaque route ; reprise ; console (P1).

**Non-régression A4** : captures des **pages imprimables** de référence générées **dans le conteneur de CI** (même système, mêmes polices) pour éviter les écarts entre machines ; tolérance nulle sur la mise en page.

**API (Worker)** : matrice d'autorisation rôle × route × méthode, tests négatifs (identifiants devinés, champs superflus, tailles), limites de débit.

**Performance** : `size-limit`, mesure de conversion.

### 69.4 Seuils
Couverture de branches ≥ 90 % sur `domain/`, `question/` et `session/reducer.ts` (*proposition*) ; aucune règle de lint désactivée sans commentaire justificatif.

### 69.5 Règles de lint obligatoires
`no-restricted-properties` (`Math.random`, `Date.now`) et `no-restricted-syntax` (`new Date()`) dans `domain/`, `adapters/`, `question/` et `session/reducer.ts` ; `no-restricted-imports` interdisant tout import de `src/components/game-board/**` depuis `src/interactive/**` (garantit « zéro import legacy », lot C6) ; `react/no-danger` ; `@typescript-eslint/no-floating-promises`.

### 69.6 Intégration continue
Jobs, **tous requis avant fusion** : installation (`npm ci`) → typage (`tsc --noEmit`) → lint → tests unitaires et composants → build → budgets de taille → recherche de secrets dans `dist/` → e2e → accessibilité → non-régression A4 → audit de dépendances. Protection de branche : PR obligatoire, **aucun push direct sur `main`**, déploiement de prévisualisation par PR pour essayer l'ENI.

### 69.7 Données de test
Fixtures issues de la **vraie génération** (graines fixées) pour chaque `reasonCode`, chaque mécanique et S01 à S04 ; fichiers « golden » JSON du plan, relus manuellement à chaque changement de `conversionVersion`.

## 70. Livraison : MVP réconcilié, backlog étendu, release et retour arrière (complète §29 à §31)

### 70.1 Périmètre exact du MVP (incrément B, étape 4)

| Élément | Dans le MVP | Remarque |
|---|---|---|
| Mécaniques | M01, M02, M03, M04, **M14-lite** ; S04 par M01 + `figure` (M09 en version P0) | S03 : étapes 1 et 4 par M14-lite (visionneuse, consigne, paliers, modèle, marque) ; étape 2 (vote A–D sur les images) par M01 à choix-images **si** la question existe dans les données ; étape 3 (remise en ordre au tableau) = M07, **P1** |
| Rituel | phases du §49 complètes | action principale unique par phase (§60) |
| Contrôle enseignant | révélation isolée, `TEACHER_UNREVEAL`, verrou de barre, pause | §57.4 |
| Comptage manuel | version simple : six compteurs et lecture rapide | §56 |
| Feuille de séance enseignant | oui | §57.2 |
| Persistance et reprise | oui (IndexedDB, journal) | §63 |
| Médias | précontrôle, lecteur audio, messages d'erreur | §62 |
| Palette | registre unique, étalonnage minimal, planche imprimable | §58.6 |
| Diagnostic de l'appareil | oui | §68.3 |
| Presets | **locaux uniquement** | serveur après F22 |
| Sécurité | S1, S4, S5 (côté front) | S2, S3, S7, S8 avec F22 |
| Lancement | depuis un brouillon et depuis une fiche enregistrée | F13, F14 |
| Bilan | minimal : réponses au tableau, comptages saisis, marques, observations | §26, §56 |
| Drapeau | `pilot` | §64.5 |
| **Hors MVP** | M05 à M08, M10 à M13 ; M09 grille ; console P1 ; hors ligne ; équipes ; thème sombre | |

### 70.2 Backlog complémentaire (s'ajoute à F01–F24 du §30)

| ID | Travail | Priorité | Dépend de | Preuve de fin |
|---|---|---|---|---|
| F25 | Page de diagnostic ENI et navigateur (§68.3) | P0 | — | Rapport copiable produit sur l'ENI réel |
| F26 | Réglages de classe, assistant d'étalonnage, planche (§58.6) | P0 | F03 | Écran et papier comparés ; contrastes revalidés |
| F27 | Feuille de séance enseignant imprimable (§57.2) | P0 | F06, F07, F10 | Même `planId` que la projection |
| F28 | Persistance IndexedDB, journal, reprise (§63) ; précise la partie « reprise » de F12 | P0 | F10 | Reprise sans révélation anticipée |
| F29 | Gestionnaire de médias, précontrôle, lecteur audio (§62) | P0 | F05 | Statuts de média testés (complète F08) |
| F30 | Comptage manuel et notes (§56) | P0 | F10 | Validations testées, étiquette d'origine visible |
| F31 | M14-lite : visionneuse guidée (§54.3) | P0 | F05, F10 | Scénario S03 joué |
| F32 | Drapeau, chargement paresseux, routes, réécriture SPA (§64) | P0 | — | Accès direct et actualisation de chaque route |
| F33 | CI complète : lint dédiés, budgets, secrets, e2e, axe, A4 (§69) | P0 | F16 | Pipeline vert, règles actives |
| F34 | Dérivation de graines et mélange équilibré (§50) | P0 | F05 | Équilibre et déterminisme prouvés |
| F35 | Tokens CSS, polices auto-hébergées, tests de contraste (§58) | P0 | F03 | Tests de contraste automatiques |
| F36 | Thème à contraste élevé, thème sombre (§58.7) | P1 | F35 | Contrastes revalidés |
| F37 | Console enseignant en seconde fenêtre (§57.3) | P1 | F10, F27 | La console pilote une séance sans fuite vers la projection |
| F38 | Audit d'accessibilité complet : clavier, lecteur d'écran, zoom (§67) | P1 | F09, F11 | Liste manuelle remplie |
| F39 | Export et import de séance, effacement (§63.6) | P1 | F28 | Aller-retour testé |
| F40 | Préchargement complet, hors ligne (§62.2) | P1 | F29 | Séance complète sans réseau après préchargement |
| F41 | Documentation enseignant et fiche de démarrage (§74) | P1 | F17 | Relecture par un enseignant |
| F42 | Kit de cartes noir et blanc, recto-verso (§58.8) | P2 | F04 | Impression d'essai |
| F43 | Console distante sur tablette (§57.5) | P2 | F22 | Modèle de menaces approuvé |
| F44 | Revue de sécurité finale, test de charge de l'API (§65) | P1 | F22 | Rapport sans faille haute ouverte |
| F45 | Second pilote élargi (§71) | P1 | F17 | Grille d'observation remplie |
| F46 | Détecteur de débordement et contrôle de lisibilité de « Préparer » (§59.4, §69) | P0 | F09 | Acceptation n° 18 |

### 70.3 Tailles relatives (aucune durée promise)

Échelle : **S** = un module, peu de dépendances ; **M** = plusieurs modules et tests ; **L** = transversal, fortes dépendances, nombreux tests ; **XL** = incertitude forte ou dépendance externe. À recalibrer après F01 et F02 (§31).

| Taille | Éléments |
|---|---|
| S | F03, F25, F30, F32, F34, F35, F36, F39, F42 |
| M | F01, F02, F04, F05, F07, F08, F11, F12, F13, F14, F15, F17, F24, F26, F27, F28, F29, F31, F33, F37, F38, F40, F41, F44, F45, F46 |
| L | F06, F09, F10, F16, F19, F20, F21, F23 |
| XL | F18, F22, F43 |

### 70.4 Chemin critique mis à jour

`F01 → F05 → F34 → F06 / F07 → F10 → F11 / F12 / F28 / F30 → F13 / F14 → F25 + F27 + F29 → F17`.
En parallèle : `F32` et `F33` dès le début ; `F02 → F03 → F26 / F35 / F04 / F09 → F46`. `F22` précède F21 et F43.

### 70.5 Étapes de mise en service

| Étape | Drapeau | Public | Condition de sortie |
|---|---|---|---|
| R0 Développement | `off` en production, prévisualisation par PR | équipe | scénarios 01 à 22 automatisés au vert, « non testé » explicité |
| R1 Pilote | `pilot` | propriétaire et 1 à 2 enseignants | au moins 2 séances réelles sans incident bloquant, grille du §71.1 remplie, retours traités |
| R2 Généralisation | `on`, ancien mode masqué | tous | stable pendant une durée fixée par le propriétaire, aucun défaut P0 ou P1 ouvert |
| R3 Nettoyage | `on` | tous | PR de suppression du legacy (F24), séparée, A4 inchangé |

**Critères go / no-go avant R1** (tous requis) : (1) CI verte (typage, lint, tests, e2e, axe, A4 sans différence, budgets, secrets) ; (2) oracle de non-fuite vert (§69.2) ; (3) rapport de diagnostic de l'ENI réel joint ; (4) aucune régression A4 ; (5) S1, S4, S5 appliqués et 0 secret dans `dist/` ; (6) retour arrière essayé une fois à blanc (§64.6) ; (7) **validation explicite du propriétaire** (aucun déploiement en production sans elle, cf. mode d'emploi). Avant R2 s'ajoutent : F22 terminée si des presets serveur sont activés, et validation du propriétaire après le pilote.

### 70.6 Hygiène des pull requests

Une PR par lot ou sous-lot cohérent (**≈ 800 lignes modifiées au plus, hors fixtures générées**, *proposition*) ; aucun fichier monolithique de 800 lignes ou plus (§19) ; description : lot et scénarios couverts, tests ajoutés, captures à 1920 × 1080 et 1366 × 768, risques, liste « non testé » ; revue selon l'annexe E.

## 71. Protocole de pilote et scénarios complémentaires (complète §32 et §43)

### 71.1 Protocole

- **Préconditions :** ENI réel, rapport de diagnostic joint, six cartes physiques (ou planche imprimée), fiche d'au moins six questions comprenant une addition, un audio, une aire et une production orale.
- **Rôles :** l'enseignant anime ; un observateur note, **sans filmer ni photographier les élèves et sans noter de noms**.
- **Déroulé :** (1) test d'identification des cartes depuis le dernier rang (cartes montrées au hasard) ; (2) séance de six questions ; (3) une actualisation volontaire du navigateur pour vérifier la reprise ; (4) bilan et impression.
- **Éthique :** aucune donnée nominative ; consentement de l'enseignant ; information de la direction selon les règles de l'établissement.
- **Consignation :** mesure, valeur, date, matériel, mention testé ou non testé, dans `checklist-acceptation.md` et `observation-pilote.md`.

| # | Mesure | Méthode | Seuil initial (*proposition*) |
|---|---|---|---|
| 1 | Actions de lancement | compter les touchers entre la fiche ouverte et la première question | ≤ 2, hors réglages facultatifs |
| 2 | Identification des cartes depuis le dernier rang | six cartes montrées au hasard, comptage global (sans noms) | ≥ 95 % d'identifications correctes |
| 3 | Lisibilité de l'énoncé et des choix depuis le dernier rang | oui / non, sur trois questions de longueurs différentes | « oui » partout |
| 4 | Touches ratées au tableau | sélections voulues non enregistrées ou non voulues enregistrées | ≤ 1 sur 10 |
| 5 | Latence perçue | page de diagnostic sur l'ENI | médiane < 100 ms |
| 6 | Rituel « vote avant tableau » respecté | l'observateur coche si les cartes sont levées avant le toucher au tableau | 100 % des questions |
| 7 | Fausses manœuvres de l'enseignant | révélation ou passage non voulus | 0 non récupérée (récupérée par `UNREVEAL` = acceptable) |
| 8 | Incidents techniques bloquants | relevé | 0 |
| 9 | Autonomie de l'enseignant | questionnaire de 5 items (1 à 5), dont « j'ai pu animer sans aide technique » | ≥ 4 sur 5 |
| 10 | Tempo | durée moyenne par question | information seulement |

### 71.2 Scénarios d'acceptation complémentaires (23 à 35)

- [ ] 23. Actualisation du navigateur pendant `cards-up` : la reprise est proposée, la phase et la réponse du tableau sont restituées, rien n'est révélé.
- [ ] 24. Révélation accidentelle : « Masquer à nouveau » rétablit la discussion ; le score n'est pas compté deux fois.
- [ ] 25. Écoute limitée à deux : la troisième lecture est impossible ; l'écoute accordée par l'enseignant est journalisée.
- [ ] 26. Fiche mêlant 1 question non convertible, 1 à guider et 4 automatiques : « Préparer » affiche les compteurs et les raisons, la série contient la question à guider, rien n'est supprimé en silence.
- [ ] 27. Douze questions à choix : aucune position correcte n'apparaît plus de ⌈12/n⌉ fois, jamais trois fois de suite.
- [ ] 28. La planche des six cartes imprimée et l'écran sont comparés avec l'assistant d'étalonnage ; l'enseignant valide la correspondance.
- [ ] 29. Un comptage manuel est saisi, affiché avec « Comptage saisi par l'enseignant » et repris dans le bilan ; une question sans comptage n'affiche rien.
- [ ] 30. Un cycle complet de question est mené **au clavier seul**.
- [ ] 31. Thème à contraste élevé, mouvement réduit et son coupé : séance complète utilisable.
- [ ] 32. Après préchargement, la séance se termine sans réseau (si F40 est livrée) ; sinon, messages clairs et séance non bloquée.
- [ ] 33. Une fiche modifiée après l'enregistrement d'un preset : avertissement `STALE_PRESET`, aucune perte.
- [ ] 34. Un appel direct à l'API sans droit sur le domaine est refusé par le serveur (lecture et écriture de presets).
- [ ] 35. La feuille de séance enseignant indique, pour chaque question, la même carte que la projection (même `planId`).

## 72. Registre des décisions par défaut et questions au propriétaire (complète §37)

**Règle :** si une question reste sans réponse, Codex applique le **défaut retenu** et le consigne dans `docs/interactive/decisions/` ; le développement n'est pas bloqué.

| ID | Décision | Défaut retenu | Qui tranche | Quand |
|---|---|---|---|---|
| D01 | Palette finale et teintes des cartes physiques | palette du §8 + étalonnage visuel (§58.6) ; option daltonisme (§58.3) | propriétaire | après démonstration tactile (C1) |
| D02 | Symboles des cartes | cercle, carré, triangle, losange, hexagone, plus (§58.4) | propriétaire | prototype C1 |
| D03 | Polices | Atkinson Hyperlegible (interface et énoncés), Andika pour les exercices de lettres ; comparaison sur l'ENI avec Lexend et Inter | propriétaire | C1 |
| D04 | Authentification et domaine de l'API | cookie `HttpOnly; Secure; SameSite=Lax`, API en sous-domaine du front | propriétaire et Codex (audit) | avant F22 |
| D05 | Glisser-déposer | Pointer Events maison avec « toucher puis toucher », sans bibliothèque | Codex (ADR) | F18 |
| D06 | Pile de test | Vitest, Testing Library, Playwright, axe, fast-check (si absents) | Codex (ADR) | C0 |
| D07 | Validation de schémas à l'exécution | réutiliser l'existant, sinon zod | Codex (ADR) | C2 |
| D08 | Seconde fenêtre enseignant | P1 par `BroadcastChannel` ; tablette en P2 | propriétaire | après R1 |
| D09 | Presets | locaux d'abord, serveur après F22 (§23) | — | — |
| D10 | Hors ligne | préchargement manuel (P1), pas de service worker en V1 | Codex (ADR) | F40 |
| D11 | Équipes, vote avant/après | P2, seulement si le pilote le justifie | propriétaire | après R2 |
| D12 | Public prioritaire (adultes FLE, jeunes, mixte) | mixte, ton sobre et neutre (§60) | propriétaire | C1 |
| D13 | Cartes recto-verso | P2 | propriétaire | F42 |
| D14 | Durée de conservation locale des séances | 7 jours | propriétaire | avant R1 |
| D15 | Format des nombres | U+202F et virgule (§62.5), réglable | propriétaire | C2 |
| D16 | Durée de stabilité avant suppression du legacy | à fixer par le propriétaire | propriétaire | avant R3 |

**Questions à poser au propriétaire avant C0** (par ordre d'impact) :
1. Modèle, résolution, système et navigateur de l'ENI, ou accès pour y lancer la page de diagnostic.
2. Photo ou valeurs exactes des six cartes physiques, ou accord pour en imprimer de nouvelles.
3. Taille de la classe et profondeur de la salle (validation des distances de lecture).
4. Public prioritaire : adultes FLE, adolescents ou mixte.
5. Élèves mineurs ? Règles de l'établissement sur les données.
6. Dépôt public ou privé, et état d'exposition des secrets.
7. Confirmation de l'hébergement (front et API) et du modèle d'accès (comptes, ou mot de passe partagé par domaine).
8. Disponibilité d'un enseignant et d'une classe pour le pilote.

## 73. Catalogue des cas limites (complète §40)

| Cas | Comportement attendu |
|---|---|
| Image absente ou invalide | « Image indisponible » avec « Réessayer » ; question exclue par défaut à la préparation ; séance jamais bloquée |
| Audio absent, ou erreur en cours de lecture | message du §60.4, « Réessayer », passage possible à la suite ; écoute non comptée si la lecture n'a pas démarré |
| Lecture audio bloquée par le navigateur | bouton Lecture visible et message ; jamais de lecture automatique |
| Média lent | statut `slow`, avertissement à la préparation ; indicateur de chargement visible, jamais d'attente silencieuse |
| Fiche supprimée pendant la séance | la séance continue (plan en mémoire) ; message à la reprise |
| Exception de conversion sur un item | l'item passe en `unsupported` (`CONVERSION_ERROR`) ; les autres items sont convertis |
| Choix en doublon, moins de 2 choix, plus de 6 choix | `assisted` avec raison |
| Choix-image sans `alt` | avertissement `ALT_MISSING` |
| Calcul à résultat nul, négatif, décimal ou très grand | domaine fixé par la source (§52.3), jamais de virgule flottante |
| Balises HTML dans un libellé | rendues comme texte, jamais interprétées |
| Accents, apostrophes, composition Unicode | comparaison en NFC, affichage inchangé |
| Double toucher, contacts simultanés | un seul pointeur actif, gel de 250 ms (§61.2) |
| Événement arrivé après changement de question | ignoré (I10) |
| Actualisation du navigateur | reprise proposée (§63.3) |
| Retour arrière du navigateur | retour à la route précédente sans perdre la séance ; confirmation si la séance est `running` |
| Sortie du plein écran | la séance continue |
| Verrou de veille refusé | échec silencieux, indiqué dans les réglages |
| Stockage indisponible ou plein | séance sans reprise automatique, avec message |
| Deux onglets sur la même séance | prise de main ou fermeture proposée (§63.5) |
| Journal de séance volumineux | plafond de 5 000 événements, compactage final |
| Bloc coupé en plusieurs feuilles par `buildWorksheets` | identité par `sourceKey` (§50.1), dédoublonnage |
| `conversionVersion` différente entre sauvegarde et reprise | `planId` différent, message « Plan changé » |
| Horloge système modifiée en cours de séance | aucune logique ne dépend de l'horloge, hors affichage des durées |
| Fichier média au nom accentué ou avec espaces | encodage d'URL correct, testé |
| Texte très long | échelle de repli du §59.4 |
| Aucune question jouable dans la fiche | « Préparer » explique pourquoi et renvoie à la fiche A4 ; « Démarrer » inactif |

## 74. Documentation complémentaire et ADR (complète §42)

À ajouter à l'arborescence `docs/interactive/` du §42 :

```text
docs/interactive/
  securite.md              # S1 à S8, procédure d'incident, rotation des secrets
  diagnostic-eni.md        # rapports de diagnostic collectés (un par appareil)
  fixtures.md              # catalogue des fixtures, graines, procédure de régénération
  release-plan.md          # étapes R0 à R3, go / no-go, retour arrière
  observation-pilote.md    # grille du §71.1 et résultats
  microcopy.md             # messages et variantes FALC (§60)
  glossaire.md             # §47
  decisions/               # ADR numérotés (D01 à D16 et suivants)
```

Un **ADR** (contexte, options, décision, conséquences, date) est obligatoire pour toute nouvelle dépendance, tout choix d'algorithme (hash, formateur), et toute dérogation à une règle de lint ou à un budget.

---

## Annexe C — Gabarit d'inventaire du lot C0

En-tête du fichier `docs/interactive/audit-compatibilite.csv` (une ligne par couple `exerciseType` / `layout`) :

```csv
domain,exerciseType,layout,sourceFiles,fixtureId,hasPrompt,hasAnswer,hasOptions,optionsCount,media,answerKind,optionsSource,compatibility,reasonCode,proposedMechanic,distractorGenerator,printOnly,needsMediaPreflight,risks,reviewer,status
```

| Colonne | Contenu |
|---|---|
| `domain` | domaine doc-prof (math, français, TCF, grammaire, alphabétisation, jeux, logique…) |
| `exerciseType`, `layout` | valeurs **exactes** du dépôt |
| `sourceFiles` | fichiers qui produisent ce type |
| `fixtureId` | fixture issue de la vraie génération |
| `hasPrompt`, `hasAnswer`, `hasOptions`, `optionsCount` | champs réellement disponibles |
| `media` | aucun, image, audio, figure, plusieurs |
| `answerKind` | numérique, texte, choix, ordre, association, tri, libre |
| `optionsSource` | banque, règle, aucune |
| `compatibility`, `reasonCode` | résultat du §51 |
| `proposedMechanic` | M01 à M14 |
| `distractorGenerator` | famille(s) du §52, ou « aucune » |
| `printOnly`, `needsMediaPreflight` | oui ou non |
| `risks`, `reviewer`, `status` | risques, relecteur, état (à faire, relu, validé) |

## Annexe D — Exemples canoniques (scénarios S01 et S04)

Exemples **illustratifs** du modèle du §48 ; les valeurs de `source`, de graine et de slots sont fictives. `\u202f` (espace fine insécable) et `\u00a0` (espace insécable) sont écrits en clair pour qu'ils restent visibles.

**S01 — `788 + 771`**

```jsonc
{
  "question": {
    "id": "q:fiche-123/0/3@v1",
    "source": { "ficheId": "fiche-123", "recipeVersion": 1, "pageIndex": 0, "blockIndex": 0, "itemIndex": 3,
                "sourceType": "<exerciseType réel>", "originalSeed": 123456, "contentHash": "<hash>" },
    "mechanicId": "M02", "kind": "single-choice", "compatibility": "auto", "layout": "L1",
    "title": "Maths · Additions", "instruction": "Calcule.",
    "prompt": "788 + 771 = ?", "promptA11y": "788 plus 771 égale combien ?",
    "media": [],
    "choices": [
      { "choiceId": "c1", "label": "1\u202f559", "provenance": "bank" },
      { "choiceId": "c2", "label": "1\u202f549", "provenance": "rule", "errorFamily": "column-slip" },
      { "choiceId": "c3", "label": "1\u202f459", "provenance": "rule", "errorFamily": "carry-omitted" },
      { "choiceId": "c4", "label": "1\u202f569", "provenance": "rule", "errorFamily": "carry-extra" },
      { "choiceId": "c5", "label": "1\u202f599", "provenance": "rule", "errorFamily": "digit-substitution" },
      { "choiceId": "c6", "label": "1\u202f560", "provenance": "rule", "errorFamily": "column-slip" }
    ],
    "choiceOrderPolicy": "shuffle", "evaluation": "automatic", "settings": { "hintCount": 0 }
  },
  "key": {
    "questionId": "q:fiche-123/0/3@v1",
    "solution": { "type": "choices", "correctChoiceIds": ["c1"] },
    "explanation": {
      "summary": "788 + 771 = 1\u202f559",
      "steps": [
        "Unités : 8 + 1 = 9",
        "Dizaines : 8 + 7 = 15, on écrit 5 et on retient 1",
        "Centaines : 7 + 7 + 1 = 15, on écrit 5 et on retient 1",
        "Milliers : on écrit la retenue, 1"
      ]
    },
    "distractorNotes": {
      "c2": "Erreur de calcul dans la colonne des dizaines",
      "c3": "Retenue des dizaines oubliée",
      "c4": "Retenue ajoutée alors qu'il n'y en avait pas",
      "c5": "Chiffre des dizaines recopié depuis celui des unités",
      "c6": "Erreur de calcul dans la colonne des unités"
    }
  },
  "slots": [   // illustratif : la répartition réelle dépend de la graine (§50.3)
    { "slot": "A", "choiceId": "c5" }, { "slot": "B", "choiceId": "c3" }, { "slot": "C", "choiceId": "c1" },
    { "slot": "D", "choiceId": "c2" }, { "slot": "E", "choiceId": "c4" }, { "slot": "F", "choiceId": "c6" }
  ]
}
```

**S04 — aire d'un carré de côté 349 cm**

```jsonc
{
  "question": {
    "id": "q:fiche-123/1/0@v1",
    "source": { "ficheId": "fiche-123", "recipeVersion": 1, "pageIndex": 0, "blockIndex": 1, "itemIndex": 0,
                "sourceType": "<exerciseType réel>", "originalSeed": 123456, "contentHash": "<hash>" },
    "mechanicId": "M09", "kind": "geometry", "compatibility": "auto", "layout": "L2",
    "title": "Maths · Aires", "instruction": "Calcule l'aire.",
    "prompt": "Quelle est l'aire de ce carré ?",
    "media": [ { "kind": "figure", "spec": { "type": "square", "params": { "side": 349, "unit": "cm" } },
                 "title": "Carré de côté 349 cm", "desc": "Un carré dont chaque côté mesure 349 centimètres." } ],
    "choices": [
      { "choiceId": "c1", "label": "121\u202f801\u00a0cm²", "provenance": "bank" },
      { "choiceId": "c2", "label": "1\u202f396\u00a0cm", "provenance": "rule", "errorFamily": "perimeter-confusion" },
      { "choiceId": "c3", "label": "698\u00a0cm", "provenance": "rule", "errorFamily": "side-doubling" },
      { "choiceId": "c4", "label": "121\u202f801\u00a0cm", "provenance": "rule", "errorFamily": "wrong-unit" },
      { "choiceId": "c5", "label": "122\u202f150\u00a0cm²", "provenance": "rule", "errorFamily": "factor-slip" },
      { "choiceId": "c6", "label": "121\u202f452\u00a0cm²", "provenance": "rule", "errorFamily": "factor-slip" }
    ],
    "choiceOrderPolicy": "shuffle", "evaluation": "automatic", "settings": { "hintCount": 0 }
  },
  "key": {
    "questionId": "q:fiche-123/1/0@v1",
    "solution": { "type": "choices", "correctChoiceIds": ["c1"] },
    "explanation": {
      "summary": "aire = côté × côté = 349 × 349 = 121\u202f801\u00a0cm²",
      "formula": "côté × côté",
      "steps": [ "349 × 349 = 121\u202f801", "Unité : cm × cm = cm²" ]
    },
    "distractorNotes": {
      "c2": "Périmètre confondu avec l'aire (4 × 349)",
      "c3": "Côté simplement doublé (2 × 349)",
      "c4": "Unité oubliée : une aire s'exprime en cm²",
      "c5": "Un facteur décalé de 1 (349 × 350)",
      "c6": "Un facteur décalé de 1 (349 × 348)"
    }
  }
}
```

Les valeurs ont été recalculées : 4 × 349 = 1 396 ; 2 × 349 = 698 ; 349 × 349 = 121 801 ; 349 × 350 = 122 150 ; 349 × 348 = 121 452. Le choix `c4` a la même valeur que la bonne réponse mais une unité différente : c'est un distracteur légitime et **distinct** pour le validateur (§52.1). Il n'est pas figuré dans la figure : la figure n'affiche que la longueur du côté.

## Annexe E — Liste de contrôle de revue de pull request

- [ ] Le lot et les scénarios d'acceptation couverts sont nommés (numéros du §43 et du §71.2).
- [ ] Aucun import depuis `src/components/game-board/**` ; aucun `Math.random`, `Date.now` ni `new Date()` dans les modules de domaine.
- [ ] Les composants de vote ne reçoivent pas `AnswerKey` (types) ; l'oracle de non-fuite (§69.2) est vert.
- [ ] Aucun texte projeté, `aria-label`, `title` ni annonce ne révèle la correction avant `revealed`.
- [ ] Captures à 1920 × 1080 et 1366 × 768 jointes ; aucun texte coupé.
- [ ] Non-régression A4 : aucune différence ; fiches enregistrées intactes.
- [ ] Les tests ajoutés couvrent les branches nouvelles ; tout écart de couverture est expliqué.
- [ ] Toute nouvelle dépendance est justifiée par un ADR (utilité, taille, licence, alternative).
- [ ] Aucun secret ni donnée nominative dans le code, les fixtures et les journaux.
- [ ] La liste « non testé » est à jour ; rien n'est annoncé comme testé sur ENI sans rapport de diagnostic.
- [ ] Les nouvelles chaînes figurent dans le catalogue de microcopy (§60), avec variante FALC si l'état en possède une.

---

**Fin de la PARTIE X.** La V4 conserve l'intention de la V3 et referme ses points ouverts ; **elle décrit toujours la cible : les fonctionnalités sont à développer et ne prétendent pas exister déjà.**
