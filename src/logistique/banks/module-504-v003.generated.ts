import type { LogistiqueUnit } from '../approved-banks'

export const module504 = [
  {
    "id": "log-504-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "4. Le flux de matériel",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Suite du module {g}503{/g} (types / organisation) : comment gérer matières premières et semi-finis pour atteindre les objectifs de production ({g}501{/g}). Planification délicate : caractéristiques et {g}quantités{/g} influencent fortement le flux."
      },
      {
        "kind": "heading",
        "text": "4.1 Types de flux",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.1.1 Flux externe",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Souvent assuré par des {g}prestataires logistiques{/g}. Choix des fournisseurs = qualité de service client. En {g}Lean{/g} (503) : peu de réserves pour absorber retards / non-livraisons."
      },
      {
        "kind": "heading",
        "text": "4.1.2 Flux interne",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Responsabilité de l'entreprise (ex. EnterSite AG). De la livraison MP/semi-finis jusqu'à leur mise en œuvre. Objectifs lean : efforts ↓ · processus clairs · tâches attribuées · {g}chemin le plus direct{/g}."
      },
      {
        "kind": "heading",
        "text": "4.2 Système Kanban",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Méthode de gestion selon le principe du {g}flux tiré{/g} (prélèvement / appel) · orienté uniquement sur le besoin du {g}poste consommateur{/g}. Japonais : « carte » / « tableau ». Développé chez {g}Toyota{/g} (1947) : productivité, rapidité client, espace limité, stocks coûteux."
      },
      {
        "kind": "heading",
        "text": "4.2.1 Fonctionnement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Si niveau < {g}minimum{/g} → appel au sous-traitant. Le poste aval prélève ce dont il a besoin {g}après{/g} l'opération amont. La fiche (Kanban) accompagne le lot et revient quand le lot est entamé. Règles strictes : seules pièces {g}conformes{/g} livrées."
      },
      {
        "kind": "paragraph",
        "text": "Évolution : carte → {g}conteneur{/g} étiqueté → {g}numérique{/g} (code-barres / QR · ERP / GPAO → sous-traitant, module {g}505{/g}) · moins d'erreurs et de pertes de temps."
      },
      {
        "kind": "heading",
        "text": "4.3 Système Two-Bin",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/504/cfc/log-504-deux-bacs-photo-v002.webp",
        "alt": "Un bac vide porte une carte orange et un second bac contient des pièces.",
        "caption": "Le bac vide donne le signal de réapprovisionnement. Le second fournit les pièces pendant l’attente."
      },
      {
        "kind": "paragraph",
        "text": "Deux conteneurs. Réappro quand le 1er est {g}vide{/g} et le 2e {g}entamé{/g}. Infos sur le conteneur. Quantité du 2e = couverture jusqu'au retour du 1er. Défi lean : assez, mais {g}pas trop{/g}."
      },
      {
        "kind": "heading",
        "text": "4.4 Commande optique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marquage / signalétique sur le conteneur = seuil de commande. Déclenchement : bon, e-mail, scan code-barres/QR… Déterminer {g}où{/g} placer le repère est plus délicat que de déclencher."
      },
      {
        "kind": "heading",
        "text": "4.5 Just in Time (JIT)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Des opérateurs contrôlent les documents et la palette livrée.",
        "caption": "Une arrivée au bon moment demande une heure confirmée et des données fiables sur les unités attendues."
      },
      {
        "kind": "paragraph",
        "text": "« Juste à temps » : livrer MP / semi-finis {g}au poste{/g} au moment voulu · ↓ coûts de stockage (idéalement sans stock) · fabrication sans retard. Exige flux {g}externe + interne{/g} parfaitement organisés · toute la {g}supply chain{/g}. Origine : Japon / automobile."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple EnterSite (Rupperswil){/g} — cartouche SwissEnterSite (GT10-TN221) : 18 pièces, fournisseurs mondiaux. Commande client → besoin → pièces programmées jour J · monteurs + poste prêts → si JIT OK = coûts ↓ (pas de stock tampon)."
      },
      {
        "kind": "heading",
        "text": "4.5.1 Avantages / inconvénients",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} Économie stockage · pas d'immobilisation · process accéléré · évite « boutiques vides » · personnel d'appro ↓ · temps de passage ↓"
      },
      {
        "kind": "paragraph",
        "text": "{g}−{/g} Dépendance flux externe · aléas (embouteillages, grèves, météo…) · worst case = {g}arrêt{/g} de production (+ coûts / image)"
      },
      {
        "kind": "paragraph",
        "text": "Contrats client–fournisseur : qualité + {g}sanctions{/g} si objectifs non tenus."
      },
      {
        "kind": "heading",
        "text": "4.6 Just in Sequence (JIS)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "« Juste à temps {g}et dans le bon ordre{/g} » · développement du JIT (surtout auto). Mêmes +/- que JIT. Différence : marchandise {g}déballée{/g} et rangée dans l'ordre pour le monteur (« à portée de main »), pas seulement en emballage de transport près du poste."
      },
      {
        "kind": "heading",
        "text": "4.7 Low Cost Automation (LCA)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Des cartons avancent sur une courte piste de rouleaux.",
        "caption": "Un dispositif simple facilite le déplacement entre deux postes quand il correspond au flux et à la charge."
      },
      {
        "kind": "paragraph",
        "text": "Aussi « Lean Automation » : automatiser à partir de l'{g}existant{/g} (outils, machines, personnel) · compléter {g}ponctuellement{/g} avec composants standard du marché. Objectif : process automatisé au max. · tâches répétitives avec {g}moins de personnel{/g} · temps de passage ↓."
      },
      {
        "kind": "heading",
        "text": "4.8 Jidoka",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "« Automation {g}autonome{/g} » : machine sans surveillance humaine continue · capteurs détectent les écarts → {g}avertissement / arrêt{/g} · évite produits défectueux · qualité ↑. Étape vers une automatisation où la machine corrigerait elle-même les erreurs."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "4. Le flux de matériel",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Types de flux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}flux externe{/g} relie fournisseurs, site et clients. Le {g}flux interne{/g} suit les matières, pièces et retours entre zones. Les informations déclenchent ou confirment le mouvement."
      },
      {
        "kind": "heading",
        "text": "4.2 et 4.3 Kanban et Two-Bin",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/504/cfc/log-504-deux-bacs-photo-v002.webp",
        "alt": "Un bac vide porte une carte orange et un second bac contient des pièces.",
        "caption": "Le bac vide donne le signal de réapprovisionnement. Le second fournit les pièces pendant l’attente."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}Kanban{/g} est un signal qui autorise ou demande un réapprovisionnement. En système {g}Two-Bin{/g}, on utilise un premier bac puis on signale son réapprovisionnement dès qu’il est vide. Le deuxième bac couvre la consommation pendant le délai. La {g}commande optique{/g} utilise un repère visible qui indique le besoin."
      },
      {
        "kind": "heading",
        "text": "4.5 et 4.6 Just in Time et Just in Sequence",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Des opérateurs contrôlent les documents et la palette livrée.",
        "caption": "Une arrivée au bon moment demande une heure confirmée et des données fiables sur les unités attendues."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}juste-à-temps (JIT){/g} met la quantité requise à disposition au moment du besoin. Le {g}Just in Sequence (JIS){/g} exige en plus le bon ordre des unités. Ces pratiques réduisent certains stocks et demandent des livraisons fiables et des informations précises. Prévoyez comment signaler et traiter un retard."
      },
      {
        "kind": "heading",
        "text": "4.7 et 4.8 Low Cost Automation et Jidoka",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Des cartons avancent sur une courte piste de rouleaux.",
        "caption": "Un dispositif simple facilite le déplacement entre deux postes quand il correspond au flux et à la charge."
      },
      {
        "kind": "paragraph",
        "text": "La {g}Low Cost Automation (LCA){/g} vise des dispositifs simples et peu coûteux, comme une alimentation sur rouleaux. Le {g}Jidoka{/g} consiste à repérer un défaut et permettre l’arrêt ou l’alerte avant qu’il se propage. Cherchez sa cause et vérifiez la reprise."
      }
    ],
    "module": "504",
    "revision": "504-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
