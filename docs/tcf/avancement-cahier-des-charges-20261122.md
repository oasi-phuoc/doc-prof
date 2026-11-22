# Cahier des charges TCF — état du 22 novembre 2026

Ce bilan utilise les banques et registres actuels après récupération de `main` au commit `a67c622a`, puis intégration du lot véhicules. Les anciens bilans de lots restent datés : leurs compteurs décrivent leur état à cette date.

## Ce qui reste à faire

| Chantier | Reste vérifiable | Détail |
| --- | --- | --- |
| Trios historiques CE/CO | **261 trios** | 98 A1, 144 A2 et 19 B1 ; 219 scènes ou lieux contextuels, 31 ensembles de concepts et onze familles de documents |
| Nouveaux supports DELF Actif | **221 candidats** | 101 A2 et 120 B1 ; réemploi ou génération, revue des trois réponses et activation après contrôle |
| Questions d’objets et véhicules | **76 entrées de transport encore à qualifier**, puis autres objets à inventorier | Distinguer objet, véhicule, action, accessoire, document et lieu ; contrôler les images effectivement sélectionnées et leurs fonds |
| Titres et mots-clés des images TCF | **3 887 fichiers en attente de revue visuelle** | Vérifier le contenu visible, les noms, catégories et synonymes ; conserver l’empreinte et le statut de chaque fichier |
| Bibliothèque audio et corrigés | Contrôle éditorial final de l’ensemble à poursuivre | Les installations historiques sont terminées ; les rapprochements documentaires incomplets et les contrôles de source restent suivis séparément |
| Fiches enregistrées et production | Validation serveur des anciennes fiches à confirmer | Vérifier le parcours réel des comptes et les anciennes recettes enregistrées, notamment après les changements de comptes enseignants reçus par le pull |

Les deux files de création de trios sont distinctes : **482 trios/candidats restent à traiter au total**. Les 76 entrées de transport concernent des variantes déjà actives à revoir en contexte ; elles ne sont pas comptées comme 76 nouveaux trios à créer. La file des mots-clés porte sur les fichiers du catalogue.

Le suivi DELF Actif n’a plus de candidat A1, mais le reliquat historique contient encore 98 trios A1. Les 917 questions DELF Actif maintenues en texte gardent leur décision documentée : montants, dates, identités ou réponses dont l’image ne prouve pas le sens.

Chaque prochaine modification audio doit être suivie d’un contrôle des transcriptions, questions, bonnes réponses, images et tags correspondants. Les anciennes 299 références signalées en attente ne constituent plus le compteur actuel des installations à effectuer. Le lot historique de 1 025 installations et celui des 87 validations/quatre corrections sont clôturés ; le contrôle global de la bibliothèque demeure un autre périmètre. Les références non rapprochées aux PDF de l’audit historique restent une limite documentaire, sans être assimilées à autant d’audios erronés.

## Ce qui est terminé ou déjà en place

- Historique : **390 trios actifs**, 112 questions conservées en texte, 261 trios à préparer. Le suivi initial de 573 compte 311 actifs, un texte conservé et 261 à préparer ; celui de 433 compte 172 actifs et 261 à préparer.
- DELF Actif : **525 trios actifs**, 221 candidats et 917 questions en texte, sur 346 supports et 1 663 questions. Les 1 021 relectures de contexte sont terminées, avec 41 questions corrigées.
- Lot courant : **95 trios revus**, dont 93 corrigés, un conservé et un nouveau trio B1. Dix nouvelles images sur fond ivoire et onze réemplois couvrent les 285 choix. [Rapport](vehicules-ivoire-20261122.md).
- **Images de base conservées dans la banque**, variantes sous des chemins distincts et 34 fonds initiaux rétablis à côté des versions harmonisées. Le catalogue compte 7 608 images ; 167 titres/listes de mots-clés ont leur revue visuelle enregistrée.
- Reconnaissance d’objets : règle d’au moins trois concepts illustrés, tirage **3 OUI / 2 NON**, exclusion des objets entendus parmi les leurres et positions mélangées. Le contrôle actuel valide 211 concepts et 134 pistes éligibles parmi 1 371 entrées ; les autres pistes ne deviennent pas automatiquement éligibles.
- Scénarios : cinq associations, 117 sources et 80 leurres provenant d’autres audios, avec 600 tirages contrôlés. Les reprises de cadrage et d’interlocuteurs suivies dans les lots précédents sont clôturées.
- Corrigé de l’entretien PO sur une colonne, numéros gras et colorés alignés, pour TCF-CSC, TCF-CFR et TPF ; chaque transcription démarre sur sa page. [Preuves du 16 novembre](corrige-entretien-transcriptions-20261116.md).
- Réglages de mise en page : coupures entre questions d’un audio complet, cinq questions CE par défaut, polices globales et quatre polices indépendantes pour le texte CE, cadre dans la couleur du thème. [Rapport](reglages-mise-en-page-20261117.md).
- Les cinq formats de compilation CO passent les contrôles d’ordre des deux écoutes, pauses, annonces et fichiers. Aucun MP3 ni aucune transcription n’est modifié par le lot courant ; aucune nouvelle écoute humaine n’est annoncée.

## Points séparés du développement TCF dans l’application

La remise des huit documents Word PO en style photographique était demandée hors application. Leur livraison n’a pas été revérifiée dans ce lot et ne doit pas être déclarée terminée sur la seule base du catalogue de l’application.

La grammaire conserve son [suivi pédagogique propre](../grammaire/README.md). Les ajouts de présentation, identité, nationalités et famille récupérés par le pull ne clôturent pas à eux seuls tout le cahier des charges de grammaire.

## Fichiers de suivi

- [Décisions historiques et images sélectionnées](revue-763-20261107.json)
- [Liste des trios historiques restants](extension-573-20261107.md)
- [Candidats DELF Actif restants](delf-actif-20261113/images-a-preparer.md)
- [Contrôle des objets et véhicules](controle-objets-fond-ivoire-20261117.md)
- [171 questions de transport repérées et leur statut](controle-vehicules-ivoire-20261122.json)
- [Audit des titres et mots-clés](../gallery/audit-mots-cles-tcf-20261117.json)
- [Preuves du lot courant](verification-vehicules-ivoire-20261122.json)
