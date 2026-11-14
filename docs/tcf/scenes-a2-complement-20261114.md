# Complément des scènes CO A2 — 14 novembre 2026

**Douze nouvelles images A2**, en PNG natif **1 448 × 1 086**, sont générées, examinées et ajoutées au catalogue. Les octets sont conservés sans recadrage ni conversion. Le style suit les références validées du commit `48a753d8`.

**Neuf liaisons audio sont activées.** Les titres, accords et rôles visibles sont documentés dans les transcriptions ; les interlocuteurs non confirmés restent hors cadre, et les élèves figurants ne sont pas assignés à une voix précise. Mélanie, le départ de vacances et le projet de pizza gardent leurs images au catalogue, avec liaison en attente de vérification des personnes. Aucune écoute humaine n’est attestée.

| Nouvelle scène | Liaison audio | Contrôle de sens |
| --- | --- | --- |
| Le bouquet de roses | Activée | Fleuriste féminine présentant une seule rose blanche comme échantillon de commande. Carnet vierge, aucune commande ou bouquet de dix-huit fleurs déjà livré ; le nombre reste une information audio. Interlocuteur non confirmé hors cadre. |
| Le pull pour la montagne | Activée | Vendeur homme proposant un pull léger écru à maille fine, sans laine épaisse, étiquette de composition ou achat accompli. Le coton est donné par le texte, non prouvé par le dessin. Client non confirmé hors cadre. |
| Les compliments après la visite | Activée | Guide féminine recevant les remerciements, main sur le cœur, plan sans nom et rue non identifiable. Aucun monument ou ville précis ajouté, pas de vente ou demande de direction. Visiteur non confirmé hors cadre. |
| La monnaie pour la machine | Activée | Homme montrant trois pièces sans valeur ou devise écrite, dont deux semblables, près d’une machine sans fonction inventée. Aucun billet de cinq euros ou achat terminé ; demandeur hors cadre. |
| Le repas de fin d’année | Activée | Enseignante féminine acceptant une invitation verbale d’un groupe d’élèves non attribués à une voix précise. Aucun repas, restaurant, menu, carte d’invitation ou événement déjà réalisé. |
| Le service de Claudine | Activée | Claudine s’avance volontairement vers l’avant avec son cahier ouvert et un geste vers elle-même. Accord féminin prête documenté ; professeur et camarade remplacé hors cadre, groupe arrière non identifié à une voix. |
| La sortie au bowling refusée | Activée | Père au domicile, expression ferme, paume en geste d’arrêt et autre main vers l’intérieur. Pas de bowling ni sortie déjà autorisée ; enfant et ami Mathieu non représentés, leurs genres ne sont pas inventés. |
| Les horaires du samedi | Activée | Employé homme renseignant près de l’entrée d’un magasin de cadeaux, sans jour, horaire, calendrier ou achat déjà effectué. Visiteur non confirmé hors cadre, personnages et objets utiles entiers. |
| La pâtisserie le 11 novembre | Activée | Commerçant homme indiquant les alternatives dans la rue depuis une pâtisserie, sans enseigne, date, horaire, supermarché annoncé ouvert ou gâteau acheté. Les ouvertures futures restent des informations audio. |
| La décoration avec Mélanie | Personnes à vérifier | Deux personnes commencent à installer une guirlande sans texte ; la table reste vide, sans fête ou occasion précise inventée. La mère est documentée, le genre de Mélanie n’est pas déduit du prénom ; liaison en attente. |
| La fin des vacances | Personnes à vérifier | Départ du domicile après le séjour, valise entière et remerciements amicaux, sans destination, nationalité, transport ou relation amoureuse ajoutés. Genres des deux interlocuteurs non confirmés, liaison en attente. |
| La pizza de ce soir | Personnes à vérifier | Discussion à domicile devant une boule de pâte et deux fromages, sans pizza cuite, repas servi, légumes, viande ou cuisine professionnelle. Aucun geste de cuisson déjà réalisé. Genres des interlocuteurs à vérifier. |

La fleuriste présente **une rose blanche comme échantillon**, pas le bouquet commandé : le nombre de dix-huit roses reste dans l’audio. Les trois pièces sont sans valeur écrite, devant une machine dont la fonction n’est pas inventée. Le pull est proposé, pas déjà acheté. Le père refuse la sortie au domicile, sans sortie au bowling représentée comme autorisée. Les horaires, dates et ouvertures futures ne sont pas écrits dans les images. Les repas ne sont pas montrés comme déjà réalisés.

Les six candidats de réemploi ont été vus puis écartés : bouquet mixte, guide homme, chemise au lieu du pull, cuisinier professionnel, pizza déjà cuite et pièces isolées sans machine. Le [registre de génération](generation-scenarios-a2-complement-20261114.json) conserve leurs empreintes et motifs, les prompts complets, références et contrôles de personnes.

## Avancement des scénarios

| Niveau | Candidats | Liés | À terminer | Image préparée, personnes à vérifier | Sans image préparée |
| --- | ---: | ---: | ---: | ---: | ---: |
| A1 | 41 | 23 | 18 | 18 | 0 |
| A2 | 39 | 21 | 18 | 7 | 11 |
| B1 | 16 | 1 | 15 | 0 | 15 |
| Total | 96 | 45 | 51 | 25 | 26 |

Avec les 21 sources historiques, le tirage dispose de **66 pistes liées**. Il reste **26 situations sans image préparée** (11 A2 et 15 B1) et **25 liaisons à vérifier sur les personnes** (18 A1 et sept A2). Toutes les situations A1 candidates ont déjà une image liée ou préparée. Ces comptes concernent les scénarios ; les trios QCM et autres travaux restent suivis dans le [bilan général](bilan-cahier-des-charges-20261111.md).

## Vérifications

La [comparaison des six banques](verification-scenes-a2-complement-20261114.json) prouve qu’aucun texte, question, choix, réponse, transcription ou MP3 n’est modifié. Aucun trio QCM nouveau dans ce lot.

Contrôles réussis : **600 tirages reproductibles**, **12 tests des catalogues**, **1 371 pools audio classés**, **1 021 relectures de contexte**, TypeScript et compilation. Le [contrôle Chromium](scenarios-a2-complement-20261114-browser.json) charge **18 images sur trois associations**, avec les neuf nouvelles liaisons, puis les **12 nouveaux PNG dans la galerie**, sans erreur. Galerie : **6 896 images**.

Les ajouts de la console enseignant jusqu’à `7c2e27d2` sont intégrés. Les six captures de documentation venues de main sont conservées ; elles ne sont pas comptées parmi les douze scènes générées. Après intégration, TypeScript, la compilation, les contrôles des scènes, les 12 tests des catalogues et les tests de la console passent. Le parcours Chromium est revérifié sur cette base, sans erreur.
