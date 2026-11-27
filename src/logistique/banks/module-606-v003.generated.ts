import type { LogistiqueUnit } from '../approved-banks'

export const module606 = [
  {
    "id": "log-606-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Le transport routier",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Trafic routier",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/305/commun/log-305-dechargement-photo-v002.webp",
        "alt": "Une remorque est immobilisée devant un quai de chargement.",
        "caption": "Avant le départ, vérifiez le trajet, l’équipement, les accès et les documents."
      },
      {
        "kind": "paragraph",
        "text": "Malgré la {g}RPLP{/g} (depuis 2001), la route reste avantageuse : flexibilité et liberté d'organisation (quoi, quand, où). Idéale pour la {g}distribution fine{/g}. Contreparties : embouteillages · réglementation forte (nuit, dimanche, fériés, temps de conduite…)."
      },
      {
        "kind": "paragraph",
        "text": "Trafic dense surtout sur le {g}plateau{/g} · axe N–S via le {g}Gothard{/g}. Les PL suisses transportent surtout des biens d'approvisionnement (denrées alimentaires en tête, ex. 2019)."
      },
      {
        "kind": "heading",
        "text": "6.1.1 Forces dynamiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une accélération s’exprime en m/s² et une force en N. L’accélération de la pesanteur vaut environ 9,81 m/s²."
      },
      {
        "kind": "table",
        "headers": [
          "Force",
          "Sens / effet"
        ],
        "rows": [
          [
            "{g}Accélération{/g}",
            "Vers l'{g}arrière{/g} · ↑ avec masse et accélération"
          ],
          [
            "{g}Décélération{/g}",
            "Vers l'{g}avant{/g} · inertie · souvent > accélération (freinage fort) · jusqu'à ~1 g"
          ],
          [
            "{g}Centrifuge{/g}",
            "Vers l'{g}extérieur{/g} du virage · ↑ avec rayon ↓ et vitesse · {g}vitesse au carré{/g} (×2 vitesse → ×4 force) · risque de renversement si charge glisse"
          ],
          [
            "{g}Verticales{/g} (vibrations)",
            "Secousses · ↓ frottement / adhérence · charge peut « perdre » le sol → {g}arrimage{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Comprendre ces forces = mieux sécuriser le chargement."
      },
      {
        "kind": "heading",
        "text": "6.1.2 Sécuriser le véhicule",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Avant chargement : véhicule correctement sécurisé (procédures / checklist)."
      },
      {
        "kind": "heading",
        "text": "6.2 Répartition de la charge",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-sangles-photo-v002.webp",
        "alt": "Les unités chargées dans un véhicule sont réparties et maintenues.",
        "caption": "Répartir la masse et arrimer sont deux contrôles distincts. La limite par essieu reste à vérifier."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Bases légales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Positionner pour : - ≥ {g}20 %{/g} du poids effectif sur l'essieu {g}directeur{/g} - ≥ {g}25 %{/g} sur l'essieu {g}tracteur{/g} - ne pas dépasser charges max. / essieu ni {g}poids total{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Permis de circulation : charges essieux · poids à vide · charge utile · poids total."
      },
      {
        "kind": "heading",
        "text": "6.2.2 Chargement et sécurisation",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Mode",
          "Principe"
        ],
        "rows": [
          [
            "Arrimage de {g}blocage{/g}",
            "Contact tous côtés avec parois → pas de déplacement"
          ],
          [
            "Arrimage de {g}force{/g}",
            "Charge libre sur le pont · exigences d'arrimage {g}élevées{/g}"
          ],
          [
            "Plan de {g}répartition{/g}",
            "Vérifie si charge complète peut aller contre paroi frontale"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "6.2.3 Chargement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Palettes : transversal · longitudinal · mixte. Itinéraire de déchargement → {g}LIFO{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Procédure :{/g} 1. Définir le {g}bloc{/g} (L/T/mixte) + {g}centre de gravité{/g} (milieu du bloc) 2. Calculer la {g}longueur{/g} du bloc 3. Centrer sur la surface · répartir selon poids / CdG · LIFO selon tournée 4. Avec plan de charge utile : CdG dans la {g}zone verte{/g} · sinon pas contre la paroi frontale"
      },
      {
        "kind": "heading",
        "text": "6.2.4 Sécurisation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Arrimer contre {g}toutes{/g} les forces dynamiques. Moyens : sangles · chaînes · filets · tapis antidérapants · barres (H/V) · coussins d'air…"
      },
      {
        "kind": "heading",
        "text": "6.3 RPLP",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/606/commun/log-606-rplp-schema-v003.webp",
        "alt": "320 kilomètres multipliés par 18 tonnes et par un tarif fictif de 0,025 CHF la tonne-kilomètre donnent 144 CHF.",
        "caption": "Avec un tarif d’exercice de 0,025 CHF par tonne et kilomètre, 320 km et 18 t donnent CHF 144."
      },
      {
        "kind": "paragraph",
        "text": "Depuis 2005 : trains routiers / articulés jusqu'à {g}40 t{/g} (accords bilatéraux UE). Objectif politique : report vers le {g}rail{/g} (transit alpin). RPLP votée 1998 · en vigueur {g}2001{/g} · véhicules > {g}3,5 t{/g} (exceptions)."
      },
      {
        "kind": "paragraph",
        "text": "Vérifier les barèmes et modalités de déclaration officiels applicables au véhicule et au trajet, à la date du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Objectifs :{/g} freiner hausse du trafic lourd · report rail · ↓ impact environnemental."
      },
      {
        "kind": "paragraph",
        "text": "{g}Recettes :{/g} 1/3 cantons (coûts routiers non couverts) · 2/3 Confédération (ferroviaire, bruit : NLFA, Rail 2000, TGV…). Facturation mensuelle par l'administration des douanes."
      },
      {
        "kind": "paragraph",
        "text": "👉 Coûts élevés → véhicules récents rentables {g}et{/g} plus écologiques."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. EnterSite{/g} — Rupperswil → Marly · {g}122 km{/g} · 26 t · EURO 5 ≈ {g}98.35 CHF{/g} · EURO 6 ≈ {g}72.30 CHF{/g}."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "6. Le transport routier",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Trafic routier",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/305/commun/log-305-dechargement-photo-v002.webp",
        "alt": "Une remorque est immobilisée devant un quai de chargement.",
        "caption": "Avant le départ, vérifiez le trajet, l’équipement, les accès et les documents."
      },
      {
        "kind": "paragraph",
        "text": "Le transport routier dessert directement beaucoup de lieux. Le choix du véhicule et du trajet dépend de la capacité, des accès, des horaires et des règles applicables, dont le travail et le repos. Préparez les documents et la tournée avant le départ."
      },
      {
        "kind": "heading",
        "text": "6.2 Répartition de la charge",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-sangles-photo-v002.webp",
        "alt": "Les unités chargées dans un véhicule sont réparties et maintenues.",
        "caption": "Répartir la masse et arrimer sont deux contrôles distincts. La limite par essieu reste à vérifier."
      },
      {
        "kind": "paragraph",
        "text": "Comparez {g}poids total{/g}, {g}charge utile{/g} et {g}charges par essieu{/g}. Une charge trop concentrée peut dépasser une limite même si le poids total est acceptable. Répartissez les unités selon les données du véhicule, la stabilité et l’ordre de remise. Contrôlez l’{g}arrimage{/g} et les ancrages."
      },
      {
        "kind": "heading",
        "text": "6.3 RPLP",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/606/commun/log-606-rplp-schema-v003.webp",
        "alt": "320 kilomètres multipliés par 18 tonnes et par un tarif fictif de 0,025 CHF la tonne-kilomètre donnent 144 CHF.",
        "caption": "Avec un tarif d’exercice de 0,025 CHF par tonne et kilomètre, 320 km et 18 t donnent CHF 144."
      },
      {
        "kind": "paragraph",
        "text": "La {g}redevance poids lourds liée aux prestations (RPLP){/g} tient compte notamment de la distance parcourue, du poids déterminant et de la catégorie d’émissions. Vérifiez les règles et taux applicables. Dans un calcul d’exercice, multipliez kilomètres, tonnes et tarif converti dans l’unité demandée."
      }
    ],
    "module": "606",
    "revision": "606-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
