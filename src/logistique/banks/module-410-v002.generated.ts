import type { LogistiqueUnit } from '../approved-banks'

export const module410 = [
  {
    "id": "log-410-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "10. Les dispositifs de convoyage",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Contrairement aux chariots de manutention ({g}mobiles{/g}), les systèmes de convoyage sont {g}fixes{/g}. Objectif similaire : amener les marchandises au bon endroit. Le {g}type{/g} et la {g}quantité{/g} déterminent le convoyeur."
      },
      {
        "kind": "heading",
        "text": "10.1 Convoyeur vertical",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Transport vers le {g}haut{/g} ou le {g}bas{/g} · complète souvent les convoyeurs horizontaux · liaison entre étages."
      },
      {
        "kind": "heading",
        "text": "10.1.1 Plate-forme / table élévatrice (PEMP)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mouvement {g}alternatif{/g} · souvent sur quais. Structure à {g}ciseaux{/g} hydrauliques (= table élévatrice à ciseaux). Aussi : adapter la hauteur d'un plan de travail. Apparenté : {g}transpalette à ciseaux{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convoyeur à étages{/g} (classique) : hisse le produit {g}et{/g} une partie de la voie de transport à l'étage suivant."
      },
      {
        "kind": "heading",
        "text": "10.1.2 Convoyeur en S",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mouvement en forme de {g}S{/g}. Rouleaux à l'étage bas → plates-formes tournantes du convoyeur S (vertical) → rouleaux à l'étage haut. Même idée : {g}Liftveyor{/g} / ascenseur à sacs (produit + élément de voie soulevés ensemble)."
      },
      {
        "kind": "heading",
        "text": "10.1.3 Élévateurs de marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrairement aux monte-charges : transport {g}non accompagné{/g}. Souvent intégrés au flux automatique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chargement / déchargement d'un seul côté{/g} Rouleaux → {g}contrôle de profil{/g} → porte → étage → rouleaux. Capacité limitée (pas de prise/dépose simultanée au même étage). Sécurité d'accès : personnes interdites."
      },
      {
        "kind": "paragraph",
        "text": "{g}Deux côtés{/g} Capacité nettement ↑ : pendant qu'on décharge d'un côté, le chargement suivant est déjà prêt de l'autre · cycles croisés haut/bas."
      },
      {
        "kind": "heading",
        "text": "10.1.4 Monte-charges inclinés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entrepôts (souvent {g}mobiles{/g}), chantiers, fermes (balles de foin). Marchandises moyennes, pas trop lourdes · chargement/déchargement souvent {g}manuel{/g}. Ex. : combiné avec basculement pour rouleaux de papier."
      },
      {
        "kind": "heading",
        "text": "10.2 Engins de levage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/410/commun/log-410-levage-photo-v002.webp",
        "alt": "Un pont roulant et son crochet sont visibles au-dessus d’une zone dégagée.",
        "caption": "Le pont se déplace sur ses rails et le palan lève la charge. Écartez les personnes de la zone de levage."
      },
      {
        "kind": "paragraph",
        "text": "Servent à {g}soulever{/g} (pas à transporter sur distance comme un convoyeur)."
      },
      {
        "kind": "heading",
        "text": "10.2.1 Ponts roulants",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Enjambent la surface · rails de chaque côté. {g}Chariot roulant{/g} = mécanisme de levage mobile latéralement sur la charpente. Ex. bipoutre 25 t."
      },
      {
        "kind": "heading",
        "text": "10.2.2 Ponts roulants suspendus",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Charpente {g}suspendue{/g} au rail (rails au plafond) · chariots à membrure inférieure. Plus légers / moins chers que les portiques · pas pour charges très lourdes. Passage possible vers travée voisine / voie suspendue."
      },
      {
        "kind": "paragraph",
        "text": "🔎 Check-lists {g}SUVA{/g} : engins de levage · grues industrie/artisanat."
      },
      {
        "kind": "heading",
        "text": "10.2.3 Portique roulant & Container-Carrier",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Portique{/g} : terminaux conteneurs, ports, zones de transbordement (sur rails)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Container-Carrier (cavalier){/g} : aussi un portique, mais {g}sur roues{/g} (libre) · alternative au chariot élévateur à conteneurs. Empile jusqu'à ~{g}4{/g} conteneurs · cabine ~8 m · mât >10 m · allées très étroites grâce à la construction en portique."
      },
      {
        "kind": "heading",
        "text": "10.2.4 Dispositifs de prise de charge",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Chariot roulant{/g} — déplacement transversal du levage : - {g}Membrure inférieure{/g} (monopoutre) : suspendu à la poutre - {g}Membrure supérieure{/g} (bipoutre) : sur la face supérieure des poutres - {g}Chariot d'angle{/g} : version spéciale"
      },
      {
        "kind": "paragraph",
        "text": "{g}Moufle inférieure & crochet{/g} — palan à câble = {g}mouflage{/g} : - 1 poulie → palan simple · rapport {g}1:2{/g} - 2 poulies → palan double · rapport {g}1:4{/g} Le crochet est fixé au moufle inférieur (partie mobile)."
      },
      {
        "kind": "heading",
        "text": "10.2.5 Règles de levage (grue / pont)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Interdit{/g} de se tenir sous une charge suspendue · signal SUVA · vue d'ensemble · éloigner les non-autorisés",
          "2. Uniquement dispositifs de levage / suspension {g}contrôlés et appropriés{/g} · jamais improvisés · charge nominale inscrite ou code couleur",
          "3. Contrôler régulièrement (fissures, frottement) · retirer si endommagé · attention produits chimiques (capacité ↓ sans dommage visible)",
          "4. Protéger des {g}arêtes vives{/g} (gaines, tuyaux, élingues renforcées)",
          "5. {g}Nœuds interdits{/g} (détruisent le tissu)",
          "6. Jamais poser sangle/élingue sur la {g}pointe{/g} du crochet · linguet fermé · ne pas tordre",
          "7. {g}Centre de gravité{/g} à la verticale sous le crochet · objets longs → {g}palonnier{/g}",
          "8. Respecter l'{g}angle d'inclinaison β{/g} : plus β ↑, capacité ↓ · {g}β > 60° interdit{/g} · à 60° ≈ 50 % · à 45° ≈ 70 %"
        ]
      },
      {
        "kind": "heading",
        "text": "10.3 Convoyeurs continus",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Deux cartons reposent sur un convoyeur fixe à rouleaux.",
        "caption": "Les rouleaux déplacent des colis sur un trajet défini entre deux postes."
      },
      {
        "kind": "paragraph",
        "text": "Un convoyeur continu dessert un parcours défini par sa conception. Son mode de mouvement dépend du dispositif."
      },
      {
        "kind": "heading",
        "text": "10.3.1 Convoyeur à rouleaux (galets)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Détail, caisses, palettes · souvent combiné (chaînes, bandes pour pentes/courbes). Intégration possible : remplisseuses, {g}cerclage{/g}. Virages : entraînement souvent par bande."
      },
      {
        "kind": "heading",
        "text": "10.3.2 Convoyeur à chaîne porteuse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entraînement {g}dynamique{/g} (ex. entrée d'entrepôt auto). Chaînes sous les planches extérieures de palette · galets sous la planche centrale = appui. Prise longitudinale ou transversale · combinaison possible avec bande (palettes + Rolltainers)."
      },
      {
        "kind": "paragraph",
        "text": "👉 Ne jamais pénétrer dans l'installation · traverser uniquement sur les {g}ponts{/g} prévus."
      },
      {
        "kind": "heading",
        "text": "10.3.3 Éléments de transfert",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Changer de direction, transférer ou retirer de la ligne."
      },
      {
        "kind": "table",
        "headers": [
          "Élément",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Distributeur à chaîne{/g}",
            "Chaîne se soulève sous la charge → convoyeur parallèle"
          ],
          [
            "{g}Pousseur à chaîne{/g}",
            "Pousse perpendiculairement (rouleaux transversaux / glissière)"
          ],
          [
            "{g}Pousseur légers{/g}",
            "Bras hydraulique · colis postaux / tri"
          ],
          [
            "{g}Table rotative{/g}",
            "Tourne la palette (ex. 90° devant monte-charge)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Signal : galet palpeur ou cellule photoélectrique."
      },
      {
        "kind": "heading",
        "text": "10.3.4 Convoyeur à rouleaux à accumulation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sections commandables individuellement → stocker sans s'empiler. Freinage des rouleaux = arrêt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fonctionnement :{/g} rouleaux de traction (ex. rouges) tirés vers le haut par un {g}ressort{/g} → entraînent les porteurs. Produit sur {g}galet palpeur{/g} → genouillère pousse l'entraînement vers le bas → plus d'entraînement. Galet déchargé → reprise."
      },
      {
        "kind": "heading",
        "text": "10.3.5 Table à billes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Billes encastrées (quelques mm) · déplacement {g}toutes directions{/g} presque sans effort · reconditionnement (grandes feuilles papier…). Variante : buses d'air. Ex. : PEMP mobile + table à billes."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "10. Les dispositifs de convoyage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "10.1 Convoyeur vertical",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un {g}convoyeur vertical{/g} relie des niveaux. Il transfère les marchandises selon un trajet défini. Vérifiez les dimensions et masses admises et l’interdiction éventuelle de transporter des personnes. Respectez les protections et les zones d’accès."
      },
      {
        "kind": "heading",
        "text": "10.2 Engins de levage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/410/commun/log-410-levage-photo-v002.webp",
        "alt": "Un pont roulant et son crochet sont visibles au-dessus d’une zone dégagée.",
        "caption": "Le pont se déplace sur ses rails et le palan lève la charge. Écartez les personnes de la zone de levage."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}palan{/g} soulève ou descend la charge. Un {g}pont roulant{/g} ou un {g}portique{/g} peut aussi la déplacer par le haut. Le {g}crochet{/g}, les accessoires et la charge admissible doivent être adaptés. Gardez les personnes hors de la zone dangereuse. Seul le personnel autorisé réalise les manœuvres selon les consignes."
      },
      {
        "kind": "heading",
        "text": "10.3 Convoyeurs continus",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/407/commun/log-407-convoyeur-photo-v002.webp",
        "alt": "Deux cartons reposent sur un convoyeur fixe à rouleaux.",
        "caption": "Les rouleaux déplacent des colis sur un trajet défini entre deux postes."
      },
      {
        "kind": "paragraph",
        "text": "Les convoyeurs à {g}bande{/g}, à {g}rouleaux{/g} ou à {g}chaîne{/g} déplacent un flux sur un trajet fixe. Choisissez selon la forme de la marchandise, la cadence et le parcours. Un bourrage ou une panne peut arrêter la ligne. Le traitement se fait après sécurisation et selon le rôle prévu."
      }
    ],
    "module": "410",
    "revision": "410-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
