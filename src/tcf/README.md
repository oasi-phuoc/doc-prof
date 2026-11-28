# TPF / TCF — tests de français

Les domaines du générateur utilisent la banque commune dans `src/tcf/content/{a0-a1,a1-a2,a2-b1}/`.

| Domaine | Id | Titre | Niveaux |
|---|---|---|---|
| TPF | `tpf` | Test de placement de français | A1, A2.1, A2.2 et B1 |
| TCF CSC | `tcf-csc` | Test de connaissance de français — CSC | A0-A1 seulement |
| TCF CFR | `tcf-cfr` | Test de connaissance de français — CFR | A1-A2 seulement |
| TCF B1 | `tcf-b1` | Test de connaissance de français — B1 | A2-B1 seulement |

Aucun sélecteur de niveau : le domaine fixe les niveaux. L’ancien id `tcf` est migré vers `tpf`.

Le moteur (types `Tcf*`, layout `tcf`, JSON `tcf-…`) reste ici — pas dans `src/math/`.

## TPF

Le test de placement contient une page d’informations et seize exercices. Les supports de CO et de CE proviennent de sélections distinctes dans les banques communes. A2.1 privilégie des documents courts et des informations explicites. A2.2 utilise des documents plus développés.

| Compétence | Déroulé |
|---|---|
| CO | Quatre écoutes, une par niveau A1, A2.1, A2.2 et B1 |
| CE | Quatre documents, un par niveau A1, A2.1, A2.2 et B1 |
| PE | Formulaire, texte de 40 à 50 mots, rédaction de 60 à 80 mots |
| PO | Entretien, lecture à voix haute progressive, questions sur trois thèmes, argumentation, description d’image et dialogue |

La lecture est un texte continu qui commence au niveau A1, passe par A2 et se termine au niveau B1. En argumentation, l’élève donne un avis pour ou contre une proposition de la vie quotidienne et le justifie. Le barème reste de 25 points par compétence.

La recette du test se trouve dans `tpf-placement.ts`. Les sujets dédiés et la sélection des supports se trouvent dans `tpf-content.ts`. Les anciennes recettes enregistrées conservent leurs exercices.

## TCF B1

Le domaine utilise l’en-tête, les fiches élève et corrigé, les réglages de mise en page et la bibliothèque du TCF. Le tirage et le choix libre des écoutes se limitent aux audios A2–B1.

| Compétence | Banque | Série proposée |
|---|---:|---|
| CE | 8 documents | Consignes, correspondance, comparaison d’offres, article |
| CO | 130 exercices | Extraits courts, extraits moyens, document long, situations illustrées |
| PE | 9 sujets | Message, récit, comparaison et argumentation |
| PO | 9 sujets | Entretien dirigé, interaction, expression d’un point de vue |

Les nouveaux exercices de CE, PE et PO sont des adaptations pédagogiques. Les documents de lecture reprennent les tableaux de comparaison des pages 32 à 39, les exemples de rédaction des pages 61 à 66 et le script oral de la page 87. Les sujets de production reprennent les situations et les exemples des pages 61 à 75 et 87 à 88. Le projet d’ateliers citoyens s’appuie aussi sur le dialogue déjà en banque. [Corrigés DELF B1](../../docs/tcf/delf-actif-20261113/sources/transcriptions-corriges-b1.txt).
