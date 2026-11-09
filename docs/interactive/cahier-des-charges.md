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

---

# CLAIRFLE — JEUX COLLECTIFS INTERACTIFS
## Cahier des charges intégral et plan d'implémentation exécutable par Codex — Refonte totale du module de jeux

**Version :** 3.0 — 7 novembre 2026  
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

Ces points n'empêchent pas la réalisation du premier prototype : vérifier **la teinte exacte des six cartes déjà possédées**, le modèle/résolution de l'ENI, le public prioritaire (adultes FLE, jeunes, mixte), l'usage souhaité du minuteur et des équipes, ainsi que le besoin éventuel d'une tablette professeur privée. Ces choix doivent être confirmés **avec une démo tactile et de vraies cartes**, pas seulement sur une capture d'écran.

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

Documenter les scripts installés, les nouvelles dépendances justifiées, les limitations connues et les échecs observés.

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

## 44. Critères de refus d'une implémentation

L'implémentation est **non conforme** si elle se limite à modifier les CSS de l'ancien `GameBoard`, si elle impose un appareil par élève, si elle génère six propositions erronées ou ambiguës, si la bonne réponse apparaît avant l'action du professeur, si elle ne propose que `rounds[0]`, si elle attribue des points à des élèves qui ont levé des cartes non numérisées, si elle casse une fiche A4, si elle masque un domaine incompatible sans explication, ou si son esthétique est destinée à la maternelle.

## 45. Dernière instruction à Codex

**Commence par livrer C0 + C1 + une première tranche C2/C3/C4 pleinement fonctionnelle, démontrant le rituel A–F en classe et une séance de plusieurs questions.** Présente à l'utilisateur les choix d'interface et les captures avant de généraliser. Continue ensuite les lots par familles, en gardant les priorités et en signalant honnêtement les zones qui requièrent une revue humaine ou un test sur l'écran interactif réel.

**Ce cahier des charges décrit la cible ; les fonctionnalités sont à développer. Il ne prétend pas qu'elles existent déjà.**
