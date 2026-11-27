import type { LogistiqueUnit } from '../approved-banks'

export const module616 = [
  {
    "id": "log-616-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "16. Processus dans les centres de tri / distribution",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Principes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Lettres et colis : machines et process différents · même logique : {g}1er tri{/g} puis {g}2e tri{/g}."
      },
      {
        "kind": "heading",
        "text": "16.1 Notions",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Terme",
          "Sens"
        ],
        "rows": [
          [
            "Commissionnement",
            "Regrouper pour bases / suite"
          ],
          [
            "Préparation des envois",
            "Avant tri (presta, format…)"
          ],
          [
            "Région de desserte",
            "Zone du {g}tri secondaire{/g} du centre"
          ],
          [
            "CCR",
            "Centres colis {g}régionaux{/g} (soutien)"
          ],
          [
            "{g}Tri de dépôt{/g}",
            "1er tri · hors région → autre centre"
          ],
          [
            "{g}Tri de distribution{/g}",
            "2e tri · dans la région du centre"
          ],
          [
            "{g}Tri séquentiel (GFS){/g}",
            "Ordre de la tournée facteur"
          ],
          [
            "Base de distribution",
            "Office où part la tournée"
          ],
          [
            "Clinique des colis",
            "Réparation colis endommagés"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "16.2–16.4 Flux global",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entrée → préparation → 1er tri → 2e tri (même centre ou autre) → commissionnement → sortie. 3 {g}PZ{/g} principaux · NPA / tableaux d'acheminement. CCR ex. : Vétroz, Ostermundigen, Härkingen, Urdorf, Cadenazzo…"
      },
      {
        "kind": "heading",
        "text": "16.5–16.7 Tri lettres (Poste)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Logistique de site{/g} (gestion quais/véhicules) → {g}entrée{/g} (robots/manuel · PromoPost/journaux parfois directs) → {g}préparation{/g} (FN/GF · auto/manuel · A/B · oblitération) → {g}tri{/g} (IRV, DBCS, GFSA · GF · manuel) → codage auto / {g}vidéocodage{/g} (ex. Coire) → casiers / buts de tri."
      },
      {
        "kind": "paragraph",
        "text": "{g}GFS{/g} : 2–3 phases après tri distribution → ordre boîtes / noms → {g}BB{/g} → commissionnement ({g}SB{/g}) → sortie (train si autre centre · route si bases)."
      },
      {
        "kind": "paragraph",
        "text": "Outils : CFC · IRV · robot portail · casiers manuels · unité GF · GFSA."
      },
      {
        "kind": "heading",
        "text": "16.8–16.9 Tri colis (Poste)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Des cartons passent sur des rouleaux dans un dispositif de tri.",
        "caption": "Une branche correspond au secteur attribué. Le rejet ou le hors-format relève d’une procédure séparée."
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Entrée{/g} — endommagés → clinique · non-colis retirés · aptitude mécanique · adresse vers le haut",
          "2. {g}Identification{/g} — ACS · pesée/mesure clients · VCS · MCS",
          "3. {g}Tri{/g} — distribution (même centre) vs dépôt (autre)",
          "4. {g}Sortie autres centres{/g} — RX → WB · souvent {g}train{/g}",
          "5. {g}Sortie{/g} — bases de distribution (route)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Machines : {g}plateaux inclinables{/g} (1 envoi/plateau · glissement variable) · {g}bandes transversales{/g} (précis, soigneux, rapide) · {g}rouleaux inclinés{/g} (fond plat requis). Aussi : convoyeurs, FTS, robots."
      },
      {
        "kind": "heading",
        "text": "16.10 Sécurité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Badge · clôture · éclairage · sacs {g}transparents{/g} · vestiaires perso · caméras · alarmes. Travail : instruction machines · passeport formation · MD · permis Suva chariots."
      },
      {
        "kind": "heading",
        "text": "16.11–16.15 NPA, IATA, MIL",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rappel NPA 4 chiffres (module {g}615{/g}) · Liechtenstein 9485–9498. Internationaux : 5–7 chiffres / lettres · certains pays sans. {g}IATA{/g} : 3 lettres aéroport (ZRH, LHR, CDG) · aussi sur AWB/codes. Les envois adressés à un service particulier suivent les conditions publiées pour cette destination. Vérifier le canal et l’adressage avec le prestataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. retour baskets :{/g} Aarau → Härkingen (1er tri) → train Daillens (10XX) → 2e tri → base → commerçant."
      },
      {
        "kind": "heading",
        "text": "16.16–16.23 Logistique entre centres & aides",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/615/commun/log-615-rollcontainer-photo-v002.webp",
        "alt": "Un rollcontainer regroupe des cartons au centre.",
        "caption": "Le support maintient plusieurs envois ensemble et se rattache au bon flux entre centres."
      },
      {
        "kind": "table",
        "headers": [
          "Outil",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Grue de terminal{/g}",
            "Transfert de supports compatibles, dans les limites de l’équipement."
          ],
          [
            "Pilotage logistique extérieure",
            "Centrale · ordres véhicules/grues"
          ],
          [
            "Véhicules de site",
            "Manœuvre WB"
          ],
          [
            "{g}Caisses mobiles{/g}",
            "RX ou {g}vrac{/g} (volume ↑ · déchargement ↓)"
          ],
          [
            "{g}Camions double pont{/g}",
            "Organisation de transport selon le plan, les unités et la capacité validés."
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Signalétique : Planzer (fiche + Datamatrix) · Poste (fiche avant RX · écran lieu cible vrac)."
      },
      {
        "kind": "paragraph",
        "text": "Aides internes : tracteurs RX · chariots SB/palettes · mât rétractable · contrepoids. Ergo : plates-formes · points de déversement · bandes télescopiques · aides traction · trottinettes."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "16. Processus dans les centres de tri et distribution",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Principes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}tri{/g} affecte chaque envoi à un niveau et à une destination. Le {g}centre de tri{/g} répartit les envois entre zones. Le {g}centre de distribution{/g} organise la remise finale. La {g}consolidation{/g} regroupe ce qui doit partir ensemble."
      },
      {
        "kind": "heading",
        "text": "16.2–16.9 Flux, tri lettres et colis",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Des cartons passent sur des rouleaux dans un dispositif de tri.",
        "caption": "Une branche correspond au secteur attribué. Le rejet ou le hors-format relève d’une procédure séparée."
      },
      {
        "kind": "paragraph",
        "text": "La réception contrôle les supports, enregistre les unités et alimente la machine. La lecture d’une adresse ou d’un code détermine la sortie. Les lettres et colis suivent des installations différentes. Les hors-format ou les envois non lus passent par une opération manuelle autorisée."
      },
      {
        "kind": "heading",
        "text": "16.10 Sécurité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ne mettez pas les mains dans un convoyeur en marche. En cas d’arrêt ou d’envoi inconnu, signalez et suivez la procédure. Les protections et zones de passage doivent rester libres."
      },
      {
        "kind": "heading",
        "text": "16.11–16.23 Codes, transferts et aides",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/615/commun/log-615-rollcontainer-photo-v002.webp",
        "alt": "Un rollcontainer regroupe des cartons au centre.",
        "caption": "Le support maintient plusieurs envois ensemble et se rattache au bon flux entre centres."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}NPA{/g} identifie une zone postale. Un code {g}IATA{/g} identifie notamment un aéroport. L’identification {g}MIL{/g} s’emploie dans le contexte militaire prévu. Les équipes utilisent les codes adaptés à chaque filière. Les transports entre centres utilisent horaires, supports, moyens de tri et documents de remise pour maintenir le lien entre unité et destination."
      }
    ],
    "module": "616",
    "revision": "616-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
