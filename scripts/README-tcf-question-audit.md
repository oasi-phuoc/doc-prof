# Audit CE / CO en cours

La relecture sémantique couvre actuellement **356 questions**, sur **32 textes CE**
et **68 pistes CO**, dont les **46 scénarios**. Elle ne couvre pas encore toute la banque.
Le contrôle structurel porte sur les six banques CE/CO des trois niveaux.

Chaque révision contient un identifiant de fait, la question, trois réponses de
même nature et un extrait justificatif du support. Les faits et les bonnes réponses
doivent être distincts dans un même texte ou audio. Une preuve textuelle confirme
l’ancrage dans le support ; la cohérence du sens nécessite toujours la relecture.

Les pools relus comportent 2 questions pour les courts et scénarios, 4 pour les
moyens, 10 pour les longs. `co-reviewed-pools.json` conserve leur tag pédagogique :
un court enrichi de deux questions reste court. Les pistes pas encore relues gardent
leur comportement existant. Le nombre de questions tirées sur une fiche reste un
réglage distinct du nombre disponible dans le pool.

Les formes texte, lignes de réponse et images partagent la même bonne réponse.
Le rapprochement d’images utilise la banque existante et le sens du choix entier.
Une heure peut reprendre une horloge existante exacte ; un cadran ne peut pas
distinguer 8 h de 20 h. Les durées, identifiants, jours, mois et dates restent du texte.
Les quantités concrètes déjà illustrées (tomates, œufs, DVD) restent disponibles.
Un mot repéré au milieu d’une phrase ne suffit pas pour lui attribuer une image.

Les dates impossibles et les supports insuffisants sont à vérifier, sans inventer
des informations pour atteindre un quota. La retranscription locale de quelques
enregistrements a aussi révélé des textes incomplets ou sans rapport avec l’audio.
Leurs notes de contrôle automatique sont dans `tcf-co-source-review-notes.json` ;
ce ne sont pas des transcriptions validées à publier sans relecture.

```sh
python3 scripts/apply_tcf_question_reviews.py --apply
python3 scripts/tcf_qcm_images.py --apply
python3 -m unittest discover -s scripts -p test_tcf_qcm_images.py
node scripts/check-tcf-question-audit.mjs --write
node scripts/check-tcf-qcm-images.mjs
```

L’application est idempotente et contrôle toutes les preuves avant d’écrire.
Le rapport `tcf-question-audit-status.json` indique la couverture réelle, les textes
restants et les écarts de taille des pools. Les différences entre réponse modèle et
QCM sont des alertes à relire : certaines sont seulement des variantes de formulation.
`node scripts/check-tcf-question-audit.mjs --complete` doit échouer tant que la
relecture intégrale n’est pas terminée.
