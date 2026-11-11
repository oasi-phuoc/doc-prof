# ADR 0013 — Plusieurs bilans, export et import locaux

Décision du 11 novembre 2026 : Terminer et Nouvelle partie ne suppriment plus une séance achevée. Le journal compacté reste dans `sessions` pendant sept jours après la dernière utilisation. L’écran de préparation liste les parties en cours et les bilans de la même fiche, permet de les ouvrir, les exporter et les supprimer après confirmation. Les révisions atomiques et la fenêtre propriétaire protègent aussi les suppressions.

La base physique passe de 3 à 4 pour ajouter l’index composé `sourceRef` (type de source et identifiant). Les magasins, clés et données existants sont conservés. Le schéma de séance reste 5. Les versions futures sont préservées et ne sont pas interprétées. La liste retrouve aussi les anciennes parties d’une fiche modifiée ; leur ouverture ou export est toutefois bloqué si le plan ne peut plus être reconstruit à l’identique.

Les séances mémorisent désormais les positions source effectivement retenues, en plus de la sélection initiale. La reconstruction conserve ainsi une exclusion de médias même si le fichier manquant redevient disponible. L’import et la reprise partagent recette autorisée, graine, options, sélection et numéro de relance ; ils ne reçoivent jamais une recette ou un corrigé depuis le fichier importé.

Le format JSON `clairfle-session` version 1 contient le schéma de séance, la date d’export, un état compacté, les références de source et un bilan dérivé. Le texte des questions et les clés de correction ne sont pas exportés. Les observations libres et comptages le sont, ce qu’indique l’interface. Un export de plus de 2 Mo est refusé pour conserver une limite d’import cohérente.

L’import vérifie l’enveloppe, les versions, les dates, l’identifiant, la référence de fiche, le plan complet, l’instantané et le bilan recalculé avant toute écriture. Un aperçu propose Importer ou Annuler. Une partie ou un identifiant déjà présent ne sont jamais remplacés. Une autre fenêtre propriétaire empêche la mutation. Après validation, l’import constitue une nouvelle utilisation locale : sa durée de conservation repart de la date d’import. Aucun transfert n’écrit au serveur.

L’[ADR 0020](adr-0020-coherence-des-verdicts.md) renforce la vérification des instantanés : chaque verdict Solo est comparé au choix enregistré et au corrigé du plan reconstruit, y compris en l’absence de réponse. Modifier ensemble un verdict et les totaux du bilan ne suffit pas à rendre un fichier incohérent importable.

La fiche d’origine doit rester accessible et inchangée, avec ses médias nécessaires. Un brouillon local doit encore exister sur l’appareil de destination ; l’export n’embarque pas sa recette et ne le recrée pas. Ces fichiers ne constituent donc pas une sauvegarde autonome des fiches.

« Effacer les données locales du jeu » demande confirmation puis vide les magasins du jeu, y compris les versions inconnues explicitement visées par cet effacement, et retire ses anciens drapeaux. Les accès et données sans rapport avec le jeu sont conservés. Une fenêtre active ayant une ancienne révision ne peut pas recréer son journal supprimé. Les écritures de temps et de contexte sont regroupées et vidées seulement lorsqu’elles ont changé, ce qui évite de modifier une révision lors d’une seconde fermeture du même écran.

Le bilan peut être imprimé en A4 avec observations et comptages. Les commandes et champs de saisie sont masqués ; les cartes physiques et le rendu A4 des fiches gardent leur impression propre.

Validation : six tests de domaine supplémentaires et [archives-results.json](archives-results.json) couvrent deux parties successives, ouverture d’un ancien bilan, export, PDF, import dans un navigateur vierge, annulation sans écriture, doublon, fichiers invalides, propriété entre onglets, suppression et effacement. Les parcours de navigation, brouillons avec migration 1 → 4, reprise durable et comparaison A4 passent aussi.
