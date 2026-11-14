# Catégories audio et scénarios — 14 novembre 2026

La relecture des [1 021 questions](delf-actif-20261113/revue-contexte-20261114.md) et ses 41 corrections sont terminées. Le classement ci-dessous porte sur les **346 nouveaux supports DELF Actif** ; il ne constitue pas une nouvelle écoute humaine.

**96 dialogues sont retenus comme candidats à une association de scènes.** Parmi eux, **18 sont maintenant disponibles avec une scène réexaminée** et **78 attendent une illustration adaptée**. Avec les 21 dialogues historiques, le tirage de quatre scénarios dispose de **39 pistes**, contre 21 auparavant.

| Nouveaux supports | Candidats | Avec scène disponible | Scène à préparer |
|---|---:|---:|---:|
| A1 | 41 | 7 | 34 |
| A2 | 39 | 10 | 29 |
| B1 | 16 | 1 | 15 |
| Total | 96 | 18 | 78 |

Les **250 autres supports** restent disponibles dans leurs formats de compréhension : 188 messages, annonces ou prises de position, 18 suites de phrases ou consignes, quatre échanges essentiellement temporels, cinq descriptions ou questionnaires et 35 documents longs. Ce classement ne signifie pas que leur transcription est incorrecte. Une adaptation future des documents longs demanderait une scène spécifique et une relecture.

Les tags **court, moyen et long** continuent de suivre la durée ou la catégorie pédagogique documentée. **Scénario est un tag supplémentaire** : il exige une situation cohérente et une scène liée au texte exact. Un dialogue d’achat un peu plus long peut donc conserver son format complet tout en devenant disponible pour l’association.

Le tirage et la sélection manuelle acceptent désormais les dialogues adaptés provenant des exercices complets. Ils reportent ensemble l’audio, la transcription et l’image. Deux pistes liées à la même image ou à une scène interchangeable ne sont pas proposées ensemble. Un changement de transcription invalide sa liaison ; une candidature sans scène n’entre pas dans le tirage. Les deux leurres restent dans les thèmes entendus avec leurs concepts absents des transcriptions.

**Sept PNG originaux 4:3**, trois A1 et quatre A2, sont intégrés après examen : demande de salle sans numéro, bijouterie avec pendentif tour Eiffel, pharmacie avec pharmacien homme, deux paquets jaunes de biscuits, prêt de l’anorak bleu, paquet bleu clair à ruban bleu foncé et billetterie avec jeune cliente. Ils servent à huit liaisons ; la scène de jeune cliente remplace un réemploi adulte et sert aussi à un dialogue supplémentaire. Dix autres liaisons réemploient six images existantes examinées. Les personnages varient en genre, âge, carnation et morphologie ; une scène inclut une utilisatrice de fauteuil roulant. Les illustrations ne prétendent pas donner la nationalité ou l’âge exact des locuteurs.

Toutes les nouvelles images sont des PNG **natifs 1 448 × 1 086**. Leurs octets sont conservés, sans recadrage ni conversion. Le [registre de génération](generation-scenarios-20261114.json) conserve références, empreintes et notes de contrôle. Aucune réponse QCM, transcription ou piste audio n’est modifiée par ce lot d’illustrations. Les **510 candidatures QCM DELF Actif** et **370 trios historiques** restent des suivis distincts de ces scènes.

Le [registre de classement](scenarios-audio-20261114.json) conserve les 346 transcriptions, catégories, preuves et descriptions des scènes manquantes. Les scènes disponibles sont aussi repérables dans les galeries image et audio.

Contrôles terminés : **600 tirages sur 600**, sélection manuelle avec recalcul des leurres, 1 371 pistes correctement indexées et classées dans le générateur et le catalogue, 12 tests des catalogues, TypeScript et vérification des 1 021 relectures. [Chromium](scenarios-audio-20261114-browser.json) charge les douze images de deux pages A1/A2, dont les sept nouveaux PNG natifs, sans erreur. Galerie : **6 573 images**. Catalogue audio : 8 801 fichiers, 6 634 questions et 14 815 formats de réponse.

```sh
node scripts/check-tcf-association-images.mjs
node scripts/check-tcf-bank.mjs
python3 scripts/check-delf-actif-context-review.py
node tests/audio-replacement/scenarios-browser.mjs
```
