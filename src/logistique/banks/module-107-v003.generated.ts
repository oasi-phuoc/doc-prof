import type { LogistiqueUnit } from '../approved-banks'

export const module107 = [
  {
    "id": "log-107-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "7. Les catégories de déchets CH",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Le module 106 distingue les déchets urbains, les déchets de chantier et les matériaux d’excavation. Le choix du périmètre, notamment l’inclusion ou l’exclusion des matériaux d’excavation, modifie fortement le total."
      },
      {
        "kind": "paragraph",
        "text": "Le chapitre compare les déchets de chantier, les déchets urbains, les déchets spéciaux et les boues d’épuration. Ces regroupements servent à lire les flux. Le classement d’un déchet particulier suit les règles de la filière concernée."
      },
      {
        "kind": "paragraph",
        "text": "Dans une statistique de déchets, vérifiez si les quantités sont données en tonnes pour un même périmètre ou sous forme de pourcentage. - Déchets de chantier : distinguer les matériaux d’excavation et les autres déchets de chantier. - Déchets urbains : distinguer les collectes séparées et les déchets résiduels. - Déchets spéciaux : vérifier les catégories incluses dans le total. - Boues d’épuration : indiquer si la mesure porte sur la masse brute ou sèche."
      },
      {
        "kind": "heading",
        "text": "Les quatre catégories principales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchets de chantier{/g} En Suisse, de grandes quantités sont stockées dans une pluralité de petites décharges parfois peu appropriées. On distingue notamment : déchets encombrants de chantier (tri), gravats, déchets d'exploitation, déchets industriels et artisanaux. Les déchets industriels/artisanaux comprennent les déchets de production qui ne sont ni spéciaux ni urbains (ex. certaines scories métalliques, sable de fonderie, boues papetières). Leur élimination diffère des urbains (quantités, nocivité)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchets urbains{/g} Déchets des ménages et déchets de composition comparable. Incluent déchets mixtes (ordures), encombrants et objets destinés au tri — {g}partie gérée par les services publics{/g} (communes / associations intercommunales) : compostables, sacs poubelle, verre, métaux, plastique, etc."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchets spéciaux{/g} Contrôlés par les cantons et au niveau fédéral via l'{g}OMoD{/g} (ordonnance sur les mouvements de déchets). Recyclage écologique « traditionnel » souvent impossible ; grande diversité → traitements spécifiques. Majoritairement industrie/artisanat : boues organiques, matières inorganiques, acides/bases chargés de métaux lourds, piles, terres polluées, adjuvants de filtration, résidus chimiques, etc."
      },
      {
        "kind": "paragraph",
        "text": "{g}Boues d'épuration{/g} Issues de l'assainissement des eaux usées. Matières solides minérales et organiques ; teneur en eau {g}90 à 99 %{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1 L'inventaire des déchets (sélection)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/106/commun/log-106-tri-photo-v002.webp",
        "alt": "Le carton et le métal sont dirigés vers deux bacs distincts.",
        "caption": "Cette séparation aide à tenir l’inventaire des matières et à déterminer leur filière."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bois usagé{/g} — selon teneur en substances nocives : - bois naturel (forêt) - poussières / sciures (menuiseries) - meubles vernis ou traités - bois imprégné"
      },
      {
        "kind": "paragraph",
        "text": "Le bois usagé doit être orienté selon sa composition et les consignes locales. Le bois traité sort de la filière du bois naturel. Les règles de combustion et les installations admises dépendent du déchet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pneus usagés{/g} — rechapage si possible ; sinon souvent {g}cimenteries{/g} (énergie). Dépôt en décharge {g}interdit depuis 2000{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballages / canettes aluminium{/g} — refonte ≈ {g}95 %{/g} d'énergie en moins vs bauxite. Presses / points de collecte ; grande valeur marchande."
      },
      {
        "kind": "paragraph",
        "text": "{g}Matière d'excavation{/g} — polluée vs non polluée. Non polluée → décharges / partiellement gravier. Polluée (« contaminée ») → traitements selon degré (ex. Kölliken : EPI intégrale)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Piles et batteries{/g} — utilisez la collecte prévue. Les modalités dépendent du type de batterie, de son état et du circuit de reprise. Une batterie endommagée doit être signalée au responsable avant toute manipulation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchets biogènes{/g} — compostage / fermentation préférables à l'UIOM. ~1,3 Mt/an ; une part encore dans les ordures → UIOM."
      },
      {
        "kind": "paragraph",
        "text": "{g}Appareils électriques et électroniques{/g} — reprise gratuite ({g}OREA{/g}). Métaux recyclables + métaux lourds. Collecte sélective décharge les urbains / UIOM."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballages en verre{/g} — collecte triée (blanc / brun / vert) ; fusion → nouveaux contenants ; reste → construction / isolation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Boues d’épuration{/g} — distinguer la masse liquide de la matière sèche. Leur traitement et la récupération de certaines ressources relèvent de filières réglementées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Appareils réfrigérants{/g} — avant 1994 : fréons (couche d'ozone). Sous {g}OREA{/g} ; dépôts gratuits."
      },
      {
        "kind": "paragraph",
        "text": "{g}Plastiques mixtes{/g} — hors PET, encore beaucoup d'incinération UIOM ; fort potentiel de recyclage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lampes fluorescentes{/g} — mercure / métaux lourds ; reprise gratuite (SENS). Ampoules à incandescence / halogènes → déchets urbains."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchets médicaux{/g} — la filière dépend de la catégorie. Les déchets à risque suivent les consignes particulières et les circuits autorisés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Métaux{/g} — ferreux (magnétiques), non ferreux (Cu, laiton), gris (Pb, Zn, Sn, Al), nobles (Au, Ag). Points communaux + récupérateurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Meubles{/g} — encombrants / reprise magasins / seconde main."
      },
      {
        "kind": "paragraph",
        "text": "{g}Papier et carton{/g} — collecte bord de route ; tri qualité ; import/export selon besoins des usines."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bouteilles PET{/g} — collecte par type (> 26 000 points). Pollution si PE lait / PET huile-vinaigre mélangés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Acier émaillé / fer blanc{/g} — ~5 000 points ; ~12 000 t/an ; taux ~79 %."
      },
      {
        "kind": "paragraph",
        "text": "{g}Textiles et chaussures{/g} — ~40 000 t collectées/an (souvent œuvres) ; autant encore dans les ordures."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballages{/g} — stratégie CH d'optimisation (> 20 ans) : légers, recyclables ou éliminables avec urbains."
      },
      {
        "kind": "heading",
        "text": "7.2 Les dispositions légales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sans règles : risques environnementaux, qualité de vie, tourisme. La gestion des déchets est omniprésente dans la législation."
      },
      {
        "kind": "heading",
        "text": "7.2.1 Constitution fédérale (Cst.)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Art. 74 Cst. :{/g} la Confédération légifère sur la protection de l'être humain et de son environnement naturel contre les atteintes nuisibles ou incommodantes."
      },
      {
        "kind": "paragraph",
        "text": "Hiérarchie : Constitution → lois → ordonnances (modalités d'application)."
      },
      {
        "kind": "heading",
        "text": "7.2.2 Loi sur la protection de l'environnement (LPE)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Adoptée en {g}1983{/g} (après l'ancrage constitutionnel de 1971). Régit notamment : - limitation et élimination des déchets - planification et obligation d'éliminer - financement - assainissement des sites pollués"
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} la LPE met l'accent sur la {g}limitation{/g} de la pollution par les déchets."
      },
      {
        "kind": "heading",
        "text": "7.2.3 Ordonnances clés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Basées sur la LPE et la LEaux :"
      },
      {
        "kind": "paragraph",
        "text": "{g}OLED{/g} — ordonnance sur la limitation et l’élimination des déchets. Elle a remplacé l’OTD et fixe notamment des règles de réduction, de traitement et de stockage définitif."
      },
      {
        "kind": "paragraph",
        "text": "{g}OMoD{/g} (mouvements de déchets) — mouvements internes CH (remise, réception, transport de spéciaux), transfrontaliers, exécution. Concerne déchets spéciaux et déchets soumis à contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}OREA{/g} — restitution, reprise et élimination des appareils électriques/électroniques (loisirs, bureautique, ICT, électroménager, luminaires, sources lumineuses, outils, sport, jouets…)."
      },
      {
        "kind": "heading",
        "text": "7.3 Les déchets spéciaux",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "7.3.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Déchets qui, par leurs propriétés chimiques ou physiques, sont {g}nocifs{/g} pour l'environnement ou l'homme et exigent un {g}traitement particulier{/g}. Pas avec les urbains. Ex. : peintures, colles, solvants, acides, chimie, détergents, piles, huiles/graisses, sols pollués, séparateurs d'hydrocarbures, huiles moteur, batteries auto, filtrats, émulsions, eaux/boues métalliques…"
      },
      {
        "kind": "paragraph",
        "text": "Les quantités de déchets spéciaux publiées dépendent du périmètre et de l’année."
      },
      {
        "kind": "heading",
        "text": "7.3.2 Traitement spécial",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/107/commun/log-107-filiere-photo-v002.webp",
        "alt": "Une opératrice contrôle un document près de fûts fermés sur des rétentions distinctes.",
        "caption": "Avant le départ, le responsable vérifie les contenants, la catégorie et le destinataire autorisé."
      },
      {
        "kind": "paragraph",
        "text": "Manutention et traitement hautement professionnels. Sites, installations et méthodes réglementés. Seules les personnes / entreprises avec {g}autorisation cantonale{/g} peuvent accepter des déchets spéciaux. Classification labo (toxicité/danger) → tri, traitement, emballage, stockage temporaire → recyclage ou traitement énergétique / physico-chimique."
      },
      {
        "kind": "heading",
        "text": "7.3.3 Danger potentiel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mauvaise manutention → infiltration eau / sol / air. {g}Paracelse :{/g} « Tout est poison… la dose seule fait que quelque chose n'est pas un poison. » Conservation correcte + protection des influences extérieures réduisent le danger. En cas de doute : traiter comme dangereux."
      },
      {
        "kind": "heading",
        "text": "7.3.4 Sept précautions élémentaires",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Manutention{/g} 1. Ne pas ouvrir le contenant 2. Précaution maximale (ne pas renverser, éviter casse/poussière) 3. Suivre les consignes du site et les instructions de sécurité. Utiliser uniquement les protections adaptées à la situation. Signaler tout contenant endommagé au responsable."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage{/g} 4. Accès contrôlé (verrouillable) 5. Ne pas mélanger substances inconnues 6. À l'abri des intempéries 7. Contenants étanches / bacs de rétention"
      },
      {
        "kind": "heading",
        "text": "7.4 Élimination des déchets spéciaux",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/304/commun/log-304-documents-photo-v003.webp",
        "alt": "Des documents d’accompagnement sont rapprochés au poste de contrôle.",
        "caption": "Avant remise, rapprochez les documents, la catégorie de déchets, les contenants et le destinataire autorisé."
      },
      {
        "kind": "paragraph",
        "text": "La remise suit les prescriptions applicables et la procédure du site. Le détenteur vérifie que le repreneur est autorisé pour le déchet à remettre et tient les documents requis."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "7. Les catégories de déchets CH",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Les catégories et l’inventaire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les {g}déchets urbains{/g}, ceux issus de l’activité économique ou du chantier et les {g}déchets spéciaux{/g} suivent des règles et filières qui dépendent de leur nature. L’{g}inventaire{/g} recense les matières, quantités, lieux et filières. Vérifiez le code et la catégorie au moyen des règles et consignes applicables."
      },
      {
        "kind": "heading",
        "text": "7.1 Choisir le bon circuit",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/106/commun/log-106-tri-photo-v002.webp",
        "alt": "Le carton et le métal sont dirigés vers deux bacs distincts.",
        "caption": "Cette séparation aide à tenir l’inventaire des matières et à déterminer leur filière."
      },
      {
        "kind": "paragraph",
        "text": "La {g}prévention{/g} évite de produire le déchet. Le {g}réemploi{/g} permet de garder un support en service. Le {g}recyclage{/g} transforme une matière récupérée. Une quantité collectée peut contenir des refus de tri. Le {g}taux de collecte{/g} et la quantité finalement recyclée répondent à des questions différentes."
      },
      {
        "kind": "heading",
        "text": "7.2 Dispositions légales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}Constitution{/g} et la {g}LPE{/g}, loi sur la protection de l’environnement, posent un cadre. L’{g}OLED{/g} concerne la limitation et l’élimination des déchets. L’{g}OMoD{/g} règle les mouvements de déchets soumis à contrôle. Des prescriptions supplémentaires concernent les mouvements internationaux, dont la {g}Convention de Bâle{/g}."
      },
      {
        "kind": "heading",
        "text": "7.3 Les déchets spéciaux",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/107/commun/log-107-filiere-photo-v002.webp",
        "alt": "Une opératrice contrôle un document près de fûts fermés sur des rétentions distinctes.",
        "caption": "Avant le départ, le responsable vérifie les contenants, la catégorie et le destinataire autorisé."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}déchet spécial{/g} demande un traitement ou un contrôle particulier. Gardez-le identifié, dans un contenant adapté, sans mélange qui compliquerait son traitement. Suivez les consignes du site. Si l’étiquette, le contenu ou l’état est douteux, suspendez la remise et demandez un contrôle à la personne responsable."
      },
      {
        "kind": "heading",
        "text": "7.4 Remettre un déchet à la filière",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/304/commun/log-304-documents-photo-v003.webp",
        "alt": "Des documents d’accompagnement sont rapprochés au poste de contrôle.",
        "caption": "Avant remise, rapprochez les documents, la catégorie de déchets, les contenants et le destinataire autorisé."
      },
      {
        "kind": "paragraph",
        "text": "Vérifiez le type et la quantité, l’emballage, les documents et l’autorisation du destinataire. Le prestataire utilise la filière prévue. Le transport peut relever de règles distinctes comme {g}ADR/SDR{/g} selon la classification. Gardez une trace de la remise."
      }
    ],
    "module": "107",
    "revision": "107-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
