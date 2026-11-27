# Sciences et santé

Le domaine `santé` couvre dix thèmes avec un parcours gradué d’A1 à B1. Le menu Thème → Niveau → Type d’exercice présente les fiches de théorie en FALC et les quatre compétences disponibles.

- `catalog.ts` définit les thèmes et les références aux supports existants. Il conserve la compatibilité de l’ancienne fiche « À venir ».
- `content.ts` contient les premières fiches FALC et le questionnaire adapté de la piste de Grammaire `gram-co-medecin-piste147`.
- `sequences.json` contient les textes, transcriptions, activités et modèles de réponse. `sequences.ts` les assemble avec les composants du générateur TCF.
- `generate.ts` associe les activités et leurs corrigés aux feuilles.

Le [cahier des charges](../../docs/sciences-sante/cahier-des-charges.md) décrit l’approche fide, FALC et DELF. Le [registre des sources](../../docs/sciences-sante/sources.md) précise les documents adaptés et l’origine des audios.
