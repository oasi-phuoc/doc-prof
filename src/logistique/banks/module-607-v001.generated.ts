import type { LogistiqueUnit } from '../approved-banks'

export const module607 = [
  {
    "id": "log-607-objectifs-apercu",
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
          "Expliquer les atouts du {g}rail{/g} et le rôle de la Suisse / NLFA",
          "Décrire les {g}forces dynamiques{/g} en ferroviaire (triage, vibrations)",
          "Appliquer les principes de {g}chargement{/g} (responsabilité, rapports essieux/bogies)",
          "Lire un marquage {g}MD{/g} (classe + ONU) et citer des perspectives d'avenir"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 607",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Situer les axes et points de transfert dans un trajet ferroviaire.",
          "Relier le triage, les mouvements et les contraintes du dossier de transport.",
          "Vérifier les repères d’identification et les responsabilités avant la remise."
        ]
      }
    ],
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "7. Le transport ferroviaire",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Variante {g}économique{/g} et {g}écologique{/g} pour de grandes quantités. En Suisse : crucial pour contourner l'{g}interdiction de nuit{/g} des camions. Interrégional / national souvent au {g}rail{/g} · ramassage / livraison finale souvent à la {g}route{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Rôle central CH dans le trafic {g}N–S{/g} européen. Asie → Europe : rail gagne vs maritime (« {g}nouvelle route de la soie{/g} » / BRI)."
      },
      {
        "kind": "paragraph",
        "text": "{g}CFF Cargo{/g} : ~{g}29,8 Mt{/g}/an (wagons complets, trains complets, combiné) ≈ {g}10 000{/g} trajets camion/jour."
      },
      {
        "kind": "paragraph",
        "text": "{g}+{/g} vs autres modes : plus rapide que mer · moins cher que air · nettement plus écologique qu'air / eau / route."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. ports rhénans (Bâle){/g} — objectif {g}50 %{/g} conteneurs sur rail (vs ~10 % aujourd'hui / 90 % camion) · {g}Gateway Basel Nord{/g} : mieux relier rail–route–eau."
      },
      {
        "kind": "heading",
        "text": "7.1 Principaux itinéraires",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/607/commun/log-607-notions-1-v001.svg",
        "alt": "Enlèvement. Site de départ. Rail. Liaison et terminal. Livraison. Desserte finale.",
        "caption": "Les dossiers de remise précisent qui prend en charge chaque étape."
      },
      {
        "kind": "heading",
        "text": "7.1.1 Suisse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Axe {g}N–S{/g} (Gothard dès 1882 · NLFA) · axe {g}O–E{/g} Genève → Suisse orientale via Berne / Zurich."
      },
      {
        "kind": "heading",
        "text": "7.1.2 Europe",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Liaisons N–S cruciales. Traité de {g}Maastricht{/g} (1992) : accès au réseau européen au-delà des frontières."
      },
      {
        "kind": "heading",
        "text": "7.1.3 Global",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Chine dominante · investissements mer + rail · {g}Belt and Road Initiative (BRI){/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.4 NLFA",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Œuvre du siècle · 3 tunnels de base + accès : - {g}Lötschberg{/g} 34,7 km (2007) - {g}Saint-Gothard{/g} {g}57 km{/g} (2016) — plus long tunnel ferroviaire du monde - {g}Ceneri{/g} 15,4 km (sept. 2020) — achèvement NLFA"
      },
      {
        "kind": "paragraph",
        "text": "{g}Avantages :{/g} - Capacité : 210 créneaux/jour transit · objectif 260 (fin 2022) - Temps : Rotterdam–Milan ≈ {g}−2 h{/g} - Trains jusqu'à {g}750 m{/g} · ~{g}2100 t{/g} N→S / {g}2000 t{/g} S→N · ~{g}100 km/h{/g} - Durabilité : >3000 emplacements semi-remorques/jour · {g}0,3 t CO₂{/g} économisée / remorque · jusqu'à ~{g}890 t CO₂{/g}/jour à pleine capacité"
      },
      {
        "kind": "paragraph",
        "text": "👉 Coût total NLFA > {g}22,6 milliards CHF{/g}."
      },
      {
        "kind": "heading",
        "text": "7.2 Forces dynamiques (rail)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/607/commun/log-607-notions-2-v001.svg",
        "alt": "Unité. Identité et masse. Service. Trajet et contraintes.",
        "caption": "Les conditions techniques sont vérifiées sur le dossier applicable."
      },
      {
        "kind": "paragraph",
        "text": "Aiguillages / manœuvres = contraintes fortes."
      },
      {
        "kind": "table",
        "headers": [
          "Force",
          "Ordre de grandeur"
        ],
        "rows": [
          [
            "{g}Décélération{/g}",
            "Jusqu'à {g}4 g{/g} en gare de triage (« laisser-couler »)"
          ],
          [
            "{g}Vibrations / centrifuge{/g}",
            "~{g}0,3 g{/g} (aiguillages, virages)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "7.2.1 Sécuriser les wagons",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Avant chargement : véhicules correctement sécurisés."
      },
      {
        "kind": "heading",
        "text": "7.2.2 Charger correctement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Chargeur / client{/g} responsable (CIM art. 13 al. 2 · CGV CFF Cargo) : directives, limites de charge, poids exact sur lettre de voiture."
      },
      {
        "kind": "paragraph",
        "text": "Règles : charger / sécuriser selon directives · répartir uniformément · éviter max. pour marchandises hygroscopiques (bois, sable…) · utiliser équipements de pesage."
      },
      {
        "kind": "paragraph",
        "text": "Poids important sur les {g}essieux{/g} · compactage (cloisons, coussins d'air). {g}Ne jamais{/g} mettre le fragile contre les parois frontales."
      },
      {
        "kind": "paragraph",
        "text": "Rapports max. : essieux {g}1:2{/g} · bogies {g}1:3{/g} · transversal : écart ≤ {g}25 %{/g} (facteur 1,25). *Bogie* = chariot sous le véhicule portant les essieux/roues."
      },
      {
        "kind": "heading",
        "text": "7.3 Marchandises dangereuses",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Wagons MD : {g}classe de danger{/g} + {g}n° ONU{/g}. Le numéro ONU identifie une marchandise réglementée dans le cadre applicable. L’identification et la prise en charge se vérifient auprès du service qualifié."
      },
      {
        "kind": "heading",
        "text": "7.4 Avenir",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Projets de report route → rail · {g}Cargo Sous Terrain{/g} (module {g}610{/g}) · tubes rapides type {g}Hyperloop{/g} (plus lointain)."
      }
    ],
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Axe ferroviaire{/g} — Ensemble de liaisons reliant des régions ou points du réseau."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bogie{/g} — Ensemble roulant d’un véhicule ferroviaire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Desserte{/g} — Service qui relie la destination au réseau."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fret{/g} — Transport de marchandises ou ensemble de marchandises transportées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Gare de triage{/g} — Site où sont organisés les mouvements et regroupements de wagons."
      },
      {
        "kind": "paragraph",
        "text": "{g}Interface rail-route{/g} — Point de transfert entre les réseaux ferroviaire et routier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lettre de voiture{/g} — Document attestant des données du trajet et des unités."
      },
      {
        "kind": "paragraph",
        "text": "{g}Manœuvre{/g} — Déplacement de véhicules ferroviaires selon les règles de l’exploitant."
      },
      {
        "kind": "paragraph",
        "text": "{g}RID{/g} — Règlement concernant le transport international ferroviaire de marchandises dangereuses."
      },
      {
        "kind": "paragraph",
        "text": "{g}Terminal{/g} — Lieu prévu pour remettre ou transférer des unités de transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Unité de chargement{/g} — Ensemble identifié pris en charge pour le transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Wagon{/g} — Véhicule ferroviaire qui reçoit des marchandises ou unités prévues."
      }
    ],
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une liaison comprend 92 km par rail puis 18 km par route. Calculez la distance totale.",
    "answer": "110 km.",
    "calculation": "92 + 18 = 110 km.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un dossier regroupe 12 unités au départ et huit au second terminal. Calculez le nombre total à suivre.",
    "answer": "20 unités.",
    "calculation": "12 + 8 = 20.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le trajet dure 3 h 20 puis le transfert 45 min. Calculez le total.",
    "answer": "4 h 05.",
    "calculation": "3 h 20 + 45 min = 4 h 05.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 45 envois, 39 ont obtenu une confirmation d’arrivée. Combien manquent au relevé ?",
    "answer": "Six confirmations.",
    "calculation": "45 − 39 = 6.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 180 envois ferroviaires, 153 arrivent dans le délai. Calculez le taux.",
    "answer": "85 %.",
    "calculation": "153 ÷ 180 × 100 = 85 %.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-607-verification-fiche-1",
    "kind": "verification",
    "prompt": "À quoi sert un terminal ?",
    "answer": "À prendre en charge ou transférer des unités sur les moyens prévus.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi distinguer trajet ferroviaire et desserte finale ?",
    "answer": "Le domicile ou site final peut demander un autre mode ou un autre prestataire.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quel phénomène justifie de vérifier les contraintes du chargement ?",
    "answer": "Les mouvements liés au transport et aux opérations du réseau.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que doit indiquer le dossier des unités ?",
    "answer": "Les références, destinations, masses et autres données nécessaires à la prise en charge.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel règlement concerne les marchandises dangereuses par rail dans son champ d’application ?",
    "answer": "Le RID, avec les règles et restrictions applicables au dossier.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un transfert routier n’est plus confirmé à l’arrivée du train. Quelle suite proposez-vous ?",
    "answer": "Informer les responsables de transfert et convenir d’une nouvelle desserte validée.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-situation-fiche-2",
    "kind": "situation",
    "prompt": "Une unité manque au relevé du terminal. Que comparez-vous ?",
    "answer": "Le manifeste, les références et les traces des points précédents.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-607-situation-fiche-3",
    "kind": "situation",
    "prompt": "L’étiquette de danger est illisible. Que faites-vous ?",
    "answer": "Suspendre la remise et demander une vérification par les personnes qualifiées.",
    "module": "607",
    "revision": "607-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
