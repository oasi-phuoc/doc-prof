---
name: texte-interface
description: Rédige ou relit les textes de l'interface du site en français (boutons, libellés, messages d'erreur, états vides, confirmations, aide, textes de la page d'accueil) selon le ton du projet (vouvoiement, casse de phrase, verbes d'action, écriture inclusive avec point médian). À utiliser dès qu'on écrit, corrige ou traduit une chaîne affichée à l'utilisateur, même pour un simple libellé de bouton.
---

# Textes de l'interface

Les utilisateurs sont des formateurs·trices de FLE, souvent pressé·e·s. Les textes doivent se lire en une seconde et dire quoi faire. (Les **consignes des fiches** destinées aux apprenant·e·s suivent d'autres règles : voir `contenu-linguistique` et `relecture-linguistique`.)

## Règles

1. **Vouvoiement**, ton chaleureux et direct.
2. **Casse de phrase** : seule la première lettre est en majuscule (« Créer une fiche », pas « Créer Une Fiche »).
3. **Verbe d'action à l'infinitif** pour les boutons et les actions (« Imprimer », « Dupliquer »).
4. **Un nom, une action.** Une même action porte le même mot partout ; voir le vocabulaire ci-dessous.
5. **Écriture inclusive avec point médian** : « apprenant·e·s », « formateur·trice·s ». Éviter de l'alourdir : reformuler quand c'est possible (« votre groupe »).
6. **Pas de jargon** technique visible (« schéma », « graine », « JSON »). Dans l'interface, parler de « fiche », « exercice », « corrigé ».
7. **Messages d'erreur** : dire ce qui s'est passé, puis comment corriger, en une ou deux phrases. Pas d'excuse théâtrale, pas de code technique.
8. **États vides** : dire ce qu'on peut faire (« Aucune fiche pour l'instant. Partez d'un modèle ou créez-en une. »).
9. **Confirmations** courtes, au passé (« Fiche enregistrée »).
10. **Pas de point d'exclamation**, sauf rare célébration.

## Vocabulaire du projet

| Action ou objet | Mot à utiliser | À éviter |
|---|---|---|
| Nouvelle fiche | Créer une fiche | Générer, Nouveau document |
| Sortie papier | Imprimer | Exporter en papier |
| Version formateur·trice | Corrigé | Solutions, Réponses |
| Nouveau tirage d'un exercice | Régénérer | Rafraîchir, Randomiser |
| Sauvegarde | Enregistrer | Sauver, Sauvegarder |
| Copie | Dupliquer | Cloner |
| Objectif de la fiche | Je peux… (formulé pour l'apprenant·e) | Objectif pédagogique en jargon |
| Mots hors niveau | Mots qui dépassent le niveau | Erreurs de vocabulaire |

## Où écrire les textes

Toutes les chaînes vont dans le dictionnaire i18n (`src/i18n/fr.ts` ou équivalent), avec des clés stables (`builder.print.button`). Jamais de chaîne française écrite directement dans un composant.

## Exemples

- Erreur d'import : « Ce fichier n'est pas une fiche valide. Le champ « exercices » est manquant. Vérifiez qu'il vient bien du site. »
- Garde-fou de niveau : « 3 mots dépassent le niveau A1. » · action « Voir les mots » · action secondaire « Les garder pour cette fiche ».
- Image manquante : « Aucune image pour ce mot. Un cadre à dessiner a été ajouté. »
- Banque trop petite : « Seulement 5 mots disponibles pour 8 cases. Réduisez le nombre de cases ou choisissez un thème plus large. »

## Terminé quand

Tous les textes sont dans le dictionnaire · casse de phrase · vocabulaire du projet respecté · chaque erreur explique comment corriger.
