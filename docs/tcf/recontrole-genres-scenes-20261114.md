# Personnages des scènes déjà validées — 14 novembre 2026

Les **39 liaisons audio/scène**, correspondant à **33 images distinctes** avant la reprise prioritaire, ont été réexaminées avec leur transcription complète et les images ouvertes individuellement. Les empreintes du texte, du MP3 et de l’image sont conservées dans le [registre](recontrole-genres-scenes-20261114.json).

**Une inversion de rôle confirmée est corrigée.** Dans `tcf-a1-s3-co-4`, dialogue 4, « tu es fou » et « je suis motivé » décrivent le coureur au masculin. Deux reconnaissances existantes, liées à l’empreinte exacte du MP3, confirment « fou ». L’ancienne scène montrait une femme qui s’échauffait et un homme étonné. Le nouveau PNG montre le coureur masculin ; l’interlocuteur dont le genre n’est pas précisé reste hors cadre.

La correction utilise le style approuvé du commit `48a753d8`, en paysage natif **1 448 × 1 086**, sans texte ni bulles. Un premier candidat avec bulles a été rejeté. L’image liée dans la banque et dans le catalogue est corrigée. Les recettes déjà enregistrées qui contiennent l’ancien chemin chargent aussi le nouveau PNG grâce à la résolution des médias ; cela ne constitue pas une migration de la base D1. Le [contrôle Chromium](scenarios-genres-20261114-browser.json) vérifie ce cas.

| Résultat du contrôle | Liaisons |
| --- | ---: |
| Rôles documentés conformes, correction incluse | 6 |
| Aucun personnage d’interlocuteur visible | 4 |
| Rôles partiellement documentés | 16 |
| Genre des interlocuteurs non précisé dans la transcription | 13 |
| Total | 39 |

**29 liaisons historiques gardent une réserve sur les personnes.** Une image sans contradiction établie n’est pas déclarée entièrement confirmée : la transcription ne donne pas toujours le genre de chaque interlocuteur. Ces réserves restent dans le catalogue et le registre. Les mots désignant un tiers, un objet ou un personnage hors cadre ne sont pas attribués à tort à un interlocuteur visible. Une même image utilisée par deux audios est contrôlée séparément pour chacun.

Aucune nouvelle écoute humaine ni nouvelle reconnaissance audio n’est déclarée dans ce lot. Les indices retenus sont les rôles, titres, accords et personnages nommés de la source, avec les reconnaissances antérieures pour la correction du coureur. Une estimation de hauteur de voix ou l’apparence seule ne prouve pas une identité de genre.

La génération continue ensuite dans le [registre prioritaire des scènes](generation-scenarios-priorite-20261114.json), avant les trios. Les neuf nouveaux usages préparés dont les personnes restent incertaines ne sont pas activés.
