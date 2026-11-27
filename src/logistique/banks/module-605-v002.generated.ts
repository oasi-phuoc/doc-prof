import type { LogistiqueUnit } from '../approved-banks'

export const module605 = [
  {
    "id": "log-605-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "5. Mode d'envoi postal",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "5.1 Adressage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/100/commun/log-100-reception-photo-v002.webp",
        "alt": "Des personnes contrôlent l’étiquette et le bon d’un colis.",
        "caption": "L’étiquette doit être lisible et décrire le bon envoi avant la mise en tri."
      },
      {
        "kind": "paragraph",
        "text": "Une adresse lisible et correcte facilite le tri et la remise. Vérifier la présentation prévue pour le support et la destination."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lettres — points clés :{/g} - Aligné à {g}gauche{/g} · 3 à 6 lignes · pas de lignes vides - Nom entreprise / nom + prénom complets - Rue + n° · ou {g}Case postale{/g} + n° - {g}NPA{/g} + localité complets - Pas de soulignement ni espaces entre lettres"
      },
      {
        "kind": "paragraph",
        "text": "Étiquette à gauche ou droite (droite = plus de place expéditeur / pub)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Colis — conseils Poste :{/g} 1. Police 3–4 mm (12–16 pt) · laser / jet d'encre · pas décorative 2. Destinataire : personne/entreprise · rue/n° ou CP · NPA + localité 3. Expéditeur : de préférence {g}vertical{/g} · à gauche · ≥ {g}10 mm{/g} du destinataire 4. {g}Code-barres{/g} d'envoi (expéditeur + n° d'envoi) 5. Étiquettes prestations (ex. Priority, Signature) à {g}droite{/g} du code-barres"
      },
      {
        "kind": "paragraph",
        "text": "👉 Étiquetage correct = travail Poste simplifié · évite hausses de prix."
      },
      {
        "kind": "heading",
        "text": "5.2 Modes d'envoi",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "5.2.1 Lettres",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Prestation",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Courrier A{/g}",
            "J+1 · lun–sam"
          ],
          [
            "{g}Courrier B{/g}",
            "Plus économique · au plus tard 3e jour ouvrable · lun–ven"
          ],
          [
            "{g}Recommandé (R){/g}",
            "Signature · preuve · assuré jusqu'à {g}500 CHF{/g} · J+1 lun–ven"
          ],
          [
            "{g}En main propre (RMP){/g}",
            "Remise uniquement à la personne nommée"
          ],
          [
            "{g}Remboursement (BLN){/g}",
            "Signature + paiement · crédit compte postal expéditeur"
          ],
          [
            "{g}Swiss-Express Lune{/g}",
            "Avant {g}9 h{/g} · J+1 lun–sam"
          ],
          [
            "{g}SameDay Coursier{/g}",
            "Jour même · lun–ven · plus cher"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.2.2 Colis",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Prestation",
          "Contenu"
        ],
        "rows": [
          [
            "{g}PostPac Priority (PRI){/g}",
            "J+1 lun–ven"
          ],
          [
            "{g}PostPac Economy{/g}",
            "2e jour ouvrable lun–ven"
          ],
          [
            "{g}Encombrants (SP){/g}",
            "Volumineux / non emballés · tri {g}manuel{/g}"
          ],
          [
            "{g}Signature (SI){/g}",
            "Contre signature · responsabilité jusqu'à {g}1 500 CHF{/g}"
          ],
          [
            "{g}BLN / RMP{/g}",
            "Comme lettres"
          ],
          [
            "{g}Assurance (AS){/g}",
            "Comme SI + jusqu'à {g}5 000 CHF{/g} · discret (aspect SI)"
          ],
          [
            "{g}Fragile (FRA){/g}",
            "Soin particulier · jusqu'à {g}5 000 CHF{/g} · manuel"
          ],
          [
            "{g}Lune / SameDay{/g}",
            "Comme lettres"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Listes non exhaustives · combinaisons possibles. Autres CEP/DEC sur le marché."
      },
      {
        "kind": "heading",
        "text": "5.3 Envoi à l'étranger",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrôle douanier pays d'origine {g}et{/g} destination · documents complets. Le routage dépend du service, du contenu, du format et du réseau du prestataire. Distinguer les documents et les autres marchandises selon leur nature et la réglementation, et contrôler les formalités du dossier. Autres CEP internationaux actifs."
      },
      {
        "kind": "heading",
        "text": "5.4 Centres de tri",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Des cartons sont dirigés vers deux branches équipées de rouleaux.",
        "caption": "La lecture de l’identifiant indique la branche ou le secteur de tri."
      },
      {
        "kind": "heading",
        "text": "5.4.1 Lettres",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "3 grands centres · zone d'oblitération / 1er tri. Machine lit rue + NPA. Si échec → photo → saisie manuelle (ex. Coire). Code-barres bas = ordre 2e tri. Tri {g}séquencé{/g} : centre · secteur · rue · n° · ordre des boîtes → facteur reçoit conteneur (BB) déjà classé."
      },
      {
        "kind": "heading",
        "text": "5.4.2 Colis",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Séparation au dépôt (Priority / Economy · encombrants · Express) · RollBox RX. 1er tri par NPA · 2e tri vers centres de distribution (train/camion) · secteurs."
      },
      {
        "kind": "heading",
        "text": "5.4.3 Santé",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Exosquelette{/g} : structure externe · ergonomie · ↓ accidents dos (lien module {g}405{/g}) · testé par la Poste. Préférer auxiliaires (chariots, tables à ciseaux, ventouses, diables…) · règles {g}SUVA{/g} de levage."
      },
      {
        "kind": "heading",
        "text": "5.5 Distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ville : lettres / colis / express souvent séparés · campagne : même coursier. Fusion PostMail + PostLogistics → {g}Logistics Services{/g}. Moyens : pied, vélo, tricycle élec. ({g}DXP{/g}, cargo, VR-bike), voiture, camionnette. Service public = couverture nationale. Ville : > {g}2000{/g} lettres/jour · campagne : moins d'envois mais parfois > {g}50 km{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Scanner (smartphone) · codes-barres · données ménage · nouveaux clients → système {g}AMP{/g} (mis à jour quotidiennement) · sert au tri séquencé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Preuve d'identité{/g} (ex. RMP) : carte d'identité · passeport · permis CH · livret étrangers · carte d'identité Poste."
      },
      {
        "kind": "heading",
        "text": "5.5.1 PickPost",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "> {g}2500{/g} points (gares, magasins, stations…) · retrait flexible lettres recommandées / colis · pas de frais extra · avis SMS/e-mail."
      },
      {
        "kind": "heading",
        "text": "5.5.2 My Post 24",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Automates {g}24/7{/g} · retrait / dépôt · adresse alternative / 2e livraison. CEP privés : offres similaires."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "5. Mode d'envoi postal",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "5.1 Adressage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/100/commun/log-100-reception-photo-v002.webp",
        "alt": "Des personnes contrôlent l’étiquette et le bon d’un colis.",
        "caption": "L’étiquette doit être lisible et décrire le bon envoi avant la mise en tri."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}adresse{/g} permet la lecture et la distribution. Vérifiez destinataire, voie, numéro, {g}NPA{/g}, localité et pays si nécessaire. Placez les inscriptions selon les zones prévues. Une étiquette lisible évite les erreurs de tri."
      },
      {
        "kind": "heading",
        "text": "5.2 et 5.3 Modes d’envoi et international",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}mode d’envoi{/g} dépend du poids, du format, du délai, des besoins de suivi et des prestations comme le recommandé. Pour un envoi international, vérifiez aussi le contenu autorisé, les déclarations, les documents douaniers et le format d’adresse prévu par le pays."
      },
      {
        "kind": "heading",
        "text": "5.4 Centres de tri",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Des cartons sont dirigés vers deux branches équipées de rouleaux.",
        "caption": "La lecture de l’identifiant indique la branche ou le secteur de tri."
      },
      {
        "kind": "paragraph",
        "text": "Une machine lit l’adresse ou le code et dirige l’envoi vers une branche. Les envois que la machine ne peut pas traiter suivent une opération manuelle. Gardez l’étiquette dégagée et le colis compatible avec les convoyeurs prévus."
      },
      {
        "kind": "heading",
        "text": "5.5 Distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le centre ou le secteur de distribution prépare la {g}tournée{/g} finale. La preuve de remise et le traitement des absences dépendent du service choisi. Conservez l’identifiant d’envoi pour une recherche."
      }
    ],
    "module": "605",
    "revision": "605-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
