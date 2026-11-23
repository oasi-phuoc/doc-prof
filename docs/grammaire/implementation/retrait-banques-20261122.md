# Retrait des anciennes banques, à la demande du propriétaire

La demande du 22 novembre remplace la politique de conservation décrite dans le rapport de clôture Famille : le propriétaire demande explicitement de supprimer les anciennes fiches dépendantes et leurs banques. Les rapports datés antérieurs restent des traces historiques ; leurs engagements de compatibilité ne décrivent plus la politique courante.

Les 25 notions disposant d’une base graduée sont retirées de la branche historique. Les nouveaux blocs choisissent directement un niveau réellement disponible, A1, A2 ou B1 ; aucun « Banque actuelle » supplémentaire n’est proposé. Le menu retire aussi les anciens types sans équivalent direct et le récit Famille fusionné. Les recettes graduées avec leur sélection canonique restent lisibles. Une recette sans niveau utilisant une notion retirée n’est plus chargée ou régénérée silencieusement.

Le [manifeste de retrait](retrait-banques-20261122.json) recense les fichiers supprimés et les 24 banques de base supprimées des deux registres historiques (1 200 items). Il faut ajouter les anciennes banques de compléments du présent, les lectures/productions modales, les sept fichiers de questions et les données intégrées aux générateurs de présentation : ces données ne sont plus dans le code applicatif. Les modules de présentation restants contiennent seulement les métadonnées des menus. Les bases des notions **non encore migrées** restent disponibles jusqu’à leur remplacement, pour poursuivre le cahier des charges sans supprimer des activités qui n’ont pas de nouvelle banque.

Les références nécessaires à la reconstruction éditoriale sont distinctes du code applicatif : les questions utilisent leurs sources corrigées, et Famille conserve uniquement ses 40 supports sélectionnés. Les tests qui comparent des sorties antérieures lisent la référence figée dans Git ; aucune banque historique n’est réintroduite dans l’application pour ces tests. Les fichiers CO et de théorie restent identiques à la référence contrôlée.

## Fiches enregistrées sur le serveur

L’accès à `clairfle-fiches.phuoc-van.workers.dev` échoue avec une réponse réseau 403 dans cet environnement, y compris lors de la vérification d’accès étendue. **Aucune fiche distante n’a été annoncée comme supprimée.** Le nombre de fiches dépendantes n’a pas pu être lu.

Deux moyens concrets de nettoyage sont disponibles, sans déployer de Worker :

- [Requête SQL D1](../../../api/fiches/maintenance/purge-retired-grammar.sql) : supprime seulement les recettes contenant un bloc historique d’une notion remplacée, dans les pages, blocs supplémentaires ou le snapshot du mode libre.
- `npm run grammar:prune-retired-fiches` : inventaire à blanc par API. Définir `FICHES_API_URL` et `FICHES_API_TOKEN` dans l’environnement, puis ajouter `-- --apply` pour la suppression effective. Le jeton reste privé et les contenus/noms des fiches ne sont pas imprimés. Un accès administrateur permet de traiter l’inventaire complet du site.

Ces deux chemins et la détection applicative sont testés avec les mêmes cas : ancien bloc principal, bloc supplémentaire, snapshot libre, fiche graduée, CO, notion non migrée et autre domaine. Les fiches graduées et CO sont préservées. Une erreur d’API interrompt le nettoyage sans déclarer une suppression non confirmée.

L’ancienne entrée « Écouter (Ali) », dépourvue d’enregistrement disponible, est retirée avec sa banque intégrée. Les CO importées actives et leurs fichiers restent protégés.
