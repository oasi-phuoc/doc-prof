# Gestes corrigés et huit trios de lieux — 16 novembre 2026

**Les deux illustrations signalées sont remplacées.** La nageuse a désormais le corps horizontal, une respiration latérale et un mouvement de crawl cohérent. La skieuse a les genoux fléchis, le bassin en arrière et les deux mains sur une seule poignée de traction. L’image nautique représente le **ski nautique**, conformément au choix de la question (« la voile / le ski nautique / le surf »).

Les deux chemins d’image sont conservés pour appliquer les corrections aux usages existants. Les fichiers sont les PNG natifs de génération, en **1 448 × 1 086**, sans redimensionnement. Une première reprise de la poignée, qui comportait une barre superflue, a été écartée. Les versions précédentes, leurs empreintes et les décisions de reprise restent tracées dans le [registre des gestes](correction-gestes-natation-ski-20261116.json).

**Huit nouveaux trios A1 sont également activés**, quatre en CE et quatre en CO. Cinq images complètent dix-neuf usages de onze images existantes : studio de radio, kiosque de presse, intérieur de bus, site Internet de festivals et affiche de festival. Les catégories du catalogue sont conservées, notamment « Lieu et décor » et « Document ».

| Question | Trois choix illustrés |
| --- | --- |
| `delf-a1v-ce-015#3` | Domicile des élèves, école, studio de radio |
| `delf-a1v-ce-030#4` | Kiosque, pont, fontaine |
| `tcf-a1-sem1-ce-2#3` | Domicile, école, restaurant |
| `tcf-a1-tpb-ce-4#5` | Site Internet, livre, affiche |
| `delf-a1-2022-co-ex3-34#5` | Bureau, domicile, gare |
| `delf-a1-2022-co-ex4-68#4` | Bibliothèque, cantine, salle de sport |
| `tcf-a1-tpa-co-1#2` | Bureau, maison, école |
| `tcf-a1-tpbb-co-2#3` | Domicile, restaurant, intérieur de bus |

Chaque support a été relu en entier. La négation de Monsieur Lenoir est conservée : il **n’est pas** au bureau. Le lieu actuel de Catherine est distingué de la course demandée à l’école. Pour Sammy, « Il doit être chez moi » reste une hypothèse. Les lieux représentent des catégories de réponses ; ils ne prétendent pas reproduire une adresse, un personnage nommé ou l’itinéraire réel. Les images de logement pour « studio de radio », de calendrier pour les festivals et de plateau-repas pour une salle de cantine sont écartées. [Sources, choix, empreintes et décisions](revue-trios-lieux-supports-20261116.json).

La comparaison complète des six banques avec le commit `5c303cca` confirme **huit ajouts de format image**, sans modification de question, texte, transcription, réponse ou MP3. Les autres images existantes sont conservées. Les métadonnées des deux illustrations corrigées sont actualisées, avec leur historique. Aucune écoute humaine supplémentaire n’est attestée. [Comparaison et contrôles](verification-trios-lieux-supports-20261116.json).

## Vérification

- Les 763 décisions historiques passent : **309 trios actifs, 112 questions conservées en texte et 342 trios en attente**.
- Les 346 supports et 1 663 questions DELF Actif, ainsi que leurs 1 021 relectures contextuelles, passent les contrôles.
- Les **2 350 variantes image**, les douze cas de mélange et la banque TCF passent.
- Les treize tests des catalogues passent ; le test audio est exécuté hors de la restriction réseau locale pour permettre son chargement Vite. La galerie compte **6 839 images**. Le catalogue audio conserve **8 801 fichiers, 6 734 questions et 15 112 formats de réponse**.
- Chromium vérifie les huit nouvelles questions et les deux questions utilisant les gestes corrigés, sur ordinateur et mobile : **20 vues, 60 affichages d’image**, cases du corrigé et bascule Texte/Image, sans erreur JavaScript. Les deux images corrigées sont aussi récupérées par HTTP et leurs empreintes correspondent aux nouveaux PNG. Les aperçus isolent les QCM ; ils ne remplacent pas les documents CE complets. [Résultats navigateur](trios-lieux-supports-20261116-browser.json).
- TypeScript, compilation de production et budgets de chargement passent.

## Reste à faire

- **342 trios historiques** : 135 A1, 184 A2 et 23 B1. Le reliquat comprend 263 cas de lieux et relations de contexte, 64 concepts complets et 15 types de documents. Le lot initial de 433 compte 91 trios intégrés et 342 en attente ; le suivi initial de 573 compte 230 actifs, un texte conservé et 342 en attente.
- **421 candidats DELF Actif** : 71 A1, 225 A2 et 125 B1. Ce suivi distinct compte 325 trios actifs et 917 questions maintenues en texte.
- Le contrôle final de la bibliothèque audio, les compléments pédagogiques de grammaire et la vérification des fiches enregistrées en production restent décrits dans le [bilan du cahier des charges](bilan-cahier-des-charges-20261111.md).
