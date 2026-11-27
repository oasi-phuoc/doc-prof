import type { LogistiqueUnit } from '../approved-banks'

export const module502 = [
  {
    "id": "log-502-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Logistique de production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Processus d'une entreprise de fabrication situé entre la logistique d'{g}approvisionnement{/g} (input) et de {g}distribution{/g} (output)."
      },
      {
        "kind": "paragraph",
        "text": "Elle {g}planifie et contrôle{/g} le flux de marchandises : - Approvisionner la production depuis les entrepôts (matières premières, auxiliaires, consommables…) - Après fabrication : {g}évacuer{/g} et stocker correctement les produits - Soutenir les activités de production"
      },
      {
        "kind": "heading",
        "text": "2.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Plusieurs postes de fabrication sont alignés et disposent de bacs.",
        "caption": "La logistique de production alimente chaque poste en tenant compte de son rythme."
      },
      {
        "kind": "paragraph",
        "text": "Toutes les mesures du processus de {g}création de valeur{/g} : de la prise en charge des {g}facteurs de production{/g} jusqu'au transfert des produits finis à la distribution."
      },
      {
        "kind": "paragraph",
        "text": "Mettre à disposition matériaux et informations : {g}bon type{/g}, {g}bonne quantité{/g}, {g}bonne qualité{/g}, {g}bon moment{/g} — comparer la {g}règle des 6B{/g} (Jünemann, module 101)."
      },
      {
        "kind": "table",
        "headers": [
          "Objectif",
          "Sens"
        ],
        "rows": [
          [
            "Délais d'{g}exécution{/g} courts",
            "Temps de passage ↓"
          ],
          [
            "Grand respect des {g}délais{/g}",
            "Fiabilité"
          ],
          [
            "{g}Stocks{/g} aussi bas que possible",
            "Coûts de stockage ↓"
          ],
          [
            "Niveau de {g}qualité{/g} élevé",
            "Peu de rebuts / retours"
          ],
          [
            "Utilisation optimale de la {g}capacité{/g}",
            "Homme + machine"
          ],
          [
            "{g}Voies de transport{/g} optimales",
            "Flux dans l'atelier"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 En résumé : réduire au maximum les {g}coûts de fabrication{/g}."
      },
      {
        "kind": "heading",
        "text": "2.3 Types de stocks dans la production",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Une zone de préparation est visible devant des palettiers de réserve.",
        "caption": "Des quantités sont réservées entre deux étapes pour alimenter un poste. Distinguez ce stock des produits déjà terminés."
      },
      {
        "kind": "heading",
        "text": "2.3.1 Stocks d'approvisionnement / de production",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stocker matières premières, semi-finis et finis nécessaires à la production."
      },
      {
        "kind": "paragraph",
        "text": "- {g}Entrepôt d'approvisionnement{/g} : réception des marchandises {g}achetées{/g} - {g}Entrepôts de production{/g} : souvent dans la zone de prod. → distances ↓ Petites entreprises : les deux souvent {g}réunis{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Rôle"
        ],
        "rows": [
          [
            "Production {g}en amont{/g}",
            "MP, semi-finis, finis pour démarrer le process"
          ],
          [
            "{g}Intermédiaire{/g}",
            "Semi-finis en attente d'une étape suivante"
          ],
          [
            "Production {g}en aval{/g}",
            "Semi-finis / finis prêts pour suite (ex. peinture) ou marché"
          ],
          [
            "Stock de {g}proximité{/g}",
            "Petits espaces, souvent {g}mobiles{/g} · libre-service · en général {g}sans{/g} compta ERP pièce à pièce (vis = poste consommable du produit fini)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.4 Logistique opérationnelle d'élimination",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/106/commun/log-106-tri-photo-v002.webp",
        "alt": "Carton et métal sont séparés dans des contenants de collecte.",
        "caption": "Les chutes et les emballages suivent des flux séparés des pièces utilisées en production."
      },
      {
        "kind": "paragraph",
        "text": "Collecter, trier, emballer, stocker et évacuer les déchets — préparation et exécution {g}écologique{/g} et {g}économique{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Ordre de priorité : {g}prévention{/g} → {g}valorisation{/g} → {g}élimination{/g}."
      },
      {
        "kind": "heading",
        "text": "2.4.1 Tâches (logistique classique)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Contenu"
        ],
        "rows": [
          [
            "Prestation {g}principale{/g}",
            "Transport, Transbordement, Stockage ({g}TTS{/g})"
          ],
          [
            "Prestation {g}supplémentaire{/g}",
            "Collecte, tri, emballage / regroupement"
          ],
          [
            "Prestation d'{g}information{/g}",
            "Commandes, suivi, traçabilité"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "🔎 Détails élimination : module {g}106{/g}."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "2. Logistique de production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}logistique de production{/g} met les matières, pièces et informations à disposition des postes. Elle suit aussi les {g}encours{/g}, puis la sortie des produits finis."
      },
      {
        "kind": "heading",
        "text": "2.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Plusieurs postes de fabrication sont alignés et disposent de bacs.",
        "caption": "La logistique de production alimente chaque poste en tenant compte de son rythme."
      },
      {
        "kind": "paragraph",
        "text": "L’équipe évite les ruptures et les attentes inutiles. Elle prépare la quantité, l’endroit et le moment du besoin. Le planning et les mouvements doivent rester cohérents. Vérifiez délais, distances, manutention et qualité."
      },
      {
        "kind": "heading",
        "text": "2.3 Types de stocks dans la production",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Une zone de préparation est visible devant des palettiers de réserve.",
        "caption": "Des quantités sont réservées entre deux étapes pour alimenter un poste. Distinguez ce stock des produits déjà terminés."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock d’approvisionnement{/g} contient ce qui doit encore entrer en fabrication. Le {g}stock de production{/g} comprend des pièces disponibles et des {g}encours{/g} entre étapes. Le {g}stock de produits finis{/g} attend sa distribution. Un {g}stock tampon{/g} absorbe un décalage de rythme."
      },
      {
        "kind": "heading",
        "text": "2.4 Logistique opérationnelle d'élimination",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/106/commun/log-106-tri-photo-v002.webp",
        "alt": "Carton et métal sont séparés dans des contenants de collecte.",
        "caption": "Les chutes et les emballages suivent des flux séparés des pièces utilisées en production."
      },
      {
        "kind": "paragraph",
        "text": "Les chutes, emballages et pièces non conformes suivent un {g}flux séparé{/g}. Identifiez et triez à la source. Gardez les éléments réutilisables et remettez les autres à la filière adaptée. Suivez quantité, statut et destination."
      }
    ],
    "module": "502",
    "revision": "502-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
