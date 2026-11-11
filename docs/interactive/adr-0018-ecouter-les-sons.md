# ADR 0018 — Reconnaissance des sons par mot

Le layout imprimable `listen-check` fournit plusieurs mots, les pistes et images correspondantes, la liste des mots cochés et son corrigé textuel. Le jeu le refusait parce que ces pistes appartenaient aux propositions individuelles. Il devient une question indépendante par mot : « Entends-tu le son … ? », avec deux cartes Oui / Non. L’audio et l’image éventuelle viennent du même indice source.

Le son est repris littéralement de la consigne standard du générateur. Une consigne personnalisée est conservée avec l’indication de répondre Oui ou Non ; aucun son n’est déduit des lettres du mot. La bonne réponse vient des cases cochées de la fiche, après vérification de leur cohérence avec le corrigé, de l’unicité des mots et de l’appartenance des réponses à la liste source. Cette vérification ne certifie pas le contenu phonétique de chaque enregistrement.

Une piste absente ne produit pas de question et garde un motif dans la préparation. Une même piste associée à des mots distincts est également signalée. Les positions source conservent leurs indices, même après ces exclusions. Les fichiers déclarés mais indisponibles passent par le précontrôle des médias existant. Le nom du mot reste dans le corrigé enseignant ; la projection ne donne que le son demandé, la piste, l’image et les deux cartes.

Les modes, minuteurs, grisé de correction, reprise et bilans utilisent le moteur existant. La fiche papier et le modèle serveur restent inchangés. Ce choix est une adaptation en micro-questions, pas la prise en charge générale des QCM multi-réponses.

Quatre tests supplémentaires couvrent correspondances, cible phonétique, erreurs, pistes absentes et partagées, variantes réelles avec et sans images, évaluation et non-régression du contenu A4. Le parcours mobile et desktop vérifie lecture native, correction collective, reprise, réponse erronée, réponse négative juste, temps écoulé et suite automatique : [sound-check-results.json](sound-check-results.json). L’inventaire passe de 471 à 631 variantes avec une activité, sur 2 081, pour le tirage documenté ; les huit erreurs de génération préexistantes restent visibles.
