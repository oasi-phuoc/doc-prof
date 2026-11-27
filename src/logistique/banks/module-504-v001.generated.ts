import type { LogistiqueUnit } from '../approved-banks'

export const module504 = [
  {
    "id": "log-504-objectifs-apercu",
    "kind": "objectifs-apercu",
    "blocks": [
      {
        "kind": "heading",
        "text": "Objectifs",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer flux de matériel {g}externe{/g} et {g}interne{/g}",
          "Expliquer {g}Kanban{/g}, {g}Two-Bin{/g} et la commande {g}optique{/g}",
          "Comparer {g}JIT{/g} et {g}JIS{/g} (avantages, risques, contrats)",
          "Décrire {g}LCA{/g} et {g}Jidoka{/g} dans une logique lean / qualité"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 504",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Lire les flux de matériel externe et interne jusqu’aux postes.",
          "Comprendre le signal Kanban et les deux bacs.",
          "Comparer la synchronisation JIT et JIS et repérer les anomalies."
        ]
      }
    ],
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
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
        "src": "/assets/logistique/500/504/cfc/log-504-notions-1-v001.svg",
        "alt": "Premier bac. Prélever jusqu’au signal. Réserve. Couvrir la consommation. Retour. Réapprovisionnement suivi.",
        "caption": "Le bac de réserve couvre l’attente jusqu’au réassort."
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
        "kind": "image",
        "src": "/assets/logistique/500/504/cfc/log-504-notions-2-v001.svg",
        "alt": "JIT. Au moment prévu. JIS. Au moment et dans l’ordre.",
        "caption": "Dans les deux cas, vérifier la quantité attendue."
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
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Deux bacs{/g} — Organisation où l’épuisement du premier bac déclenche son réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux externe{/g} — Mouvement entre sites ou organisations."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux interne{/g} — Mouvement entre les zones du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux tiré{/g} — Flux dont le réapprovisionnement est déclenché par la consommation ou un besoin aval."
      },
      {
        "kind": "paragraph",
        "text": "{g}Jidoka{/g} — Principe de détection et d’arrêt face à une anomalie selon l’organisation."
      },
      {
        "kind": "paragraph",
        "text": "{g}JIS{/g} — Livraison synchronisée selon le moment et l’ordre requis."
      },
      {
        "kind": "paragraph",
        "text": "{g}JIT{/g} — Mise à disposition à la date ou heure du besoin."
      },
      {
        "kind": "paragraph",
        "text": "{g}Kanban{/g} — Signal utilisé pour déclencher ou suivre un réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}LCA{/g} — Automatisation par moyens simples et ciblés selon l’étude du poste."
      },
      {
        "kind": "paragraph",
        "text": "{g}Séquence{/g} — Ordre déterminé dans lequel les unités doivent être présentées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Signal de réassort{/g} — Information qui déclenche l’action de réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de poste{/g} — Quantité conservée près du poste en usage."
      }
    ],
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un bac de réserve contient 48 pièces. La consommation est de 12 pièces par heure. Combien d’heures couvre-t-il ?",
    "answer": "Quatre heures.",
    "calculation": "48 ÷ 12 = 4 h.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-maths-fiche-2",
    "kind": "maths",
    "prompt": "Quatre postes demandent neuf composants chacun. Calculez l’envoi total.",
    "answer": "36 composants.",
    "calculation": "4 × 9 = 36.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un lot est demandé à 10 h 12 et reçu à 10 h 48. Calculez son délai.",
    "answer": "36 minutes.",
    "calculation": "48 − 12 = 36 min.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-maths-fiche-4",
    "kind": "maths",
    "prompt": "Une séquence de 26 pièces comporte trois écarts. Quel nombre est conforme à cette vérification ?",
    "answer": "23 pièces.",
    "calculation": "26 − 3 = 23.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-maths-fiche-5",
    "kind": "maths",
    "prompt": "À huit pièces par heure, quel stock couvre un délai de trois heures avec une réserve de six pièces ?",
    "answer": "30 pièces.",
    "calculation": "8 × 3 + 6 = 30.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel rôle joue le signal Kanban ?",
    "answer": "Il organise le réapprovisionnement à partir du besoin ou de la consommation.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quand le bac de réserve est-il utilisé ?",
    "answer": "Selon le dispositif prévu, quand le premier bac est vide et que son réassort est demandé.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que rajoute JIS à la contrainte de temps ?",
    "answer": "La livraison dans le bon ordre d’utilisation.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quels deux trajets distingue-t-on dans le cours ?",
    "answer": "Le flux externe jusqu’au site et le flux interne dans le site.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel est le rôle du signalement dans Jidoka ?",
    "answer": "Détecter et traiter une anomalie avant qu’elle se propage.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le bac consommé n’a pas déclenché d’ordre visible. Que vérifiez-vous ?",
    "answer": "La référence, l’état du signal et le besoin, puis agir selon la procédure.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-situation-fiche-2",
    "kind": "situation",
    "prompt": "La livraison arrive à temps mais dans le mauvais ordre. Quel écart notez-vous ?",
    "answer": "Le délai est tenu. Documenter l’écart de séquence et avertir le poste aval.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-504-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le délai augmente et le bac de réserve ne couvre plus le besoin. Quelle information remontez-vous ?",
    "answer": "Délai réel, cadence de consommation et quantité manquante avant le réassort.",
    "module": "504",
    "revision": "504-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
