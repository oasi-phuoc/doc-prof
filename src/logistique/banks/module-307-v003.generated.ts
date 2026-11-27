import type { LogistiqueUnit } from '../approved-banks'

export const module307 = [
  {
    "id": "log-307-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "7. Contrôle sommaire et traitement des dommages",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Erreurs et dommages ne sont pas rares en logistique. Il faut les {g}reconnaître{/g}, en analyser les {g}causes{/g} et améliorer le {g}taux d'erreur{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1 Erreur dans la livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les contrôles d'identification globale et détaillée (module {g}304{/g}) doivent déjà faire ressortir défauts et erreurs."
      },
      {
        "kind": "heading",
        "text": "7.1.1 Mauvais destinataire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Livraison non destinée à EnterSite → l'identification {g}globale{/g} doit l'éviter. Sinon : temps et coûts inutiles."
      },
      {
        "kind": "paragraph",
        "text": "Prévention : adresses et contacts clairs (interne + transversal) entre expéditeur, transporteur et destinataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} risque accru pour les entreprises à {g}plusieurs succursales{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.2 Marchandises incorrectes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Bon destinataire ≠ bon contenu. Expéditeur : {g}double contrôle{/g} ou {g}scanners{/g}. Destinataire : identification {g}détaillée{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.3 Mauvaise quantité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Aussi une erreur de livraison. Le scanner « mauvaise marchandise » ne suffit pas toujours pour la quantité — surtout petites pièces en grandes quantités. Outils → module {g}308{/g}."
      },
      {
        "kind": "heading",
        "text": "7.1.4 Différence qualitative",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dommages transport / influences extérieures : déchirures, bosses, déformations ; papier/humidité, etc. Livraison « correcte » sans la qualité attendue = erreur. Garantie qualité → module {g}309{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} contenants endommagés = aussi anomalie qualitative (empêchent la vente)."
      },
      {
        "kind": "heading",
        "text": "7.1.5 Livraison tardive",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Date convenue liée à production / livraison client. Non-respect → annulation possible, image dégradée, coûts ↑."
      },
      {
        "kind": "heading",
        "text": "7.1.6 Taux d'erreur et conséquences",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Accord qualité fournisseur–client : {g}taux d'erreur{/g} toléré (selon valeur/importance des articles) + conséquences (jusqu'à {g}pénalité{/g}). Chaque erreur est de trop ; impact image possible. Le {g}taux d'erreur de livraison{/g} est un chiffre-clé (approfondi en stockage)."
      },
      {
        "kind": "heading",
        "text": "7.2 Dégâts",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/305/commun/log-305-dechargement-photo-v002.webp",
        "alt": "Une remorque immobilisée se trouve à proximité du quai.",
        "caption": "Contrôlez l’état de la livraison à l’interface de transport avant que les unités changent de zone."
      },
      {
        "kind": "paragraph",
        "text": "Première vision (identification globale) : chargement déplacé / palettes renversées → contraintes fortes, dommages probables. Dommages {g}climatiques{/g} (humidité, température) moins évidents — surtout en international ; bureaux de contrôle qualité si besoin."
      },
      {
        "kind": "paragraph",
        "text": "Suremballage de transport protège l'emballage de {g}vente{/g}. Emballage de vente déjà endommagé → souvent {g}non présenté{/g} en point de vente."
      },
      {
        "kind": "heading",
        "text": "7.2.1 Emballages endommagés durant le transport",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Distinguer {g}suremballage{/g} et {g}emballage de vente{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Aspect",
          "Interprétation"
        ],
        "rows": [
          [
            "{g}Déchiré{/g}",
            "Contenu souvent endommagé ; emballage de vente abîmé → impropre à la vente"
          ],
          [
            "{g}Taché{/g}",
            "Tache de l'intérieur = casse → inutilisable ; de l'extérieur = parfois OK pour suremballage, pas pour emballage de vente"
          ],
          [
            "{g}Écrasé / cabossé{/g}",
            "Vérifier le contenu ; emballage de vente → {g}refuser{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "7.2.2 Moyens auxiliaires pour détecter les dommages",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-mesure-photo-v002.webp",
        "alt": "Un enregistreur de température est vérifié à côté d’un bac isolé.",
        "caption": "Un indicateur renseigne sur un dépassement. Un enregistreur conserve une série de mesures à rapprocher des heures du trajet."
      },
      {
        "kind": "paragraph",
        "text": "Produits coûteux/délicats : indicateurs et enregistreurs pour chocs, basculement, froid, etc. Preuves pour assurance : {g}photos{/g} et/ou {g}données{/g}. Enjeu aussi : confiance client / réputation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de basculement{/g} - Sable de quartz bleu : activer en retirant la séparation ; inclinaison ~{g}60°{/g} → sable visible - Billes de verre : la bille se déplace et reste collée selon l'angle"
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de choc{/g} Tube verre + liquide rouge : chute/choc anormal → coloration {g}irréversible{/g} du tube central."
      },
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de température{/g} Chaîne du froid critique ; dégâts peu visibles. Points de couleur → rouge si température dépassée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Utilisation en 5 étapes :{/g} 1. Appliquer l'indicateur sur l'emballage 2. Transporteur confirme l'intégrité à la prise en charge 3. Réception vérifie à la livraison 4. Transporteur confirme indicateur déclenché ou manquant 5. Examen du produit → libération ou traitement du sinistre"
      },
      {
        "kind": "paragraph",
        "text": "{g}Infrarouge{/g} Mesure rapide de température {g}instantanée{/g} — ne reconstitue pas l'historique du transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enregistreurs numériques{/g} Température, humidité, inclinaison, chocs en continu ; seuils ; app mobile. Usages exigeants : musées, pharma, médical…"
      },
      {
        "kind": "heading",
        "text": "7.3 En cas de dommage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-dommage-photo-v002.webp",
        "alt": "Une opératrice enregistre un coin de carton écrasé avec un appareil photo.",
        "caption": "Photographiez le défaut et rattachez la preuve au document, au lot et à la date."
      },
      {
        "kind": "paragraph",
        "text": "Signalement {g}immédiat{/g} au supérieur ; documentation selon directives (formulaire de constatation). Photos sous tous les angles → jointes au protocole."
      },
      {
        "kind": "heading",
        "text": "7.3.1 Comportement selon le mode de livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport accompagné{/g} - {g}Camion{/g} : constater avec le chauffeur ; signature sur formulaire ; transmission au fournisseur - {g}Courrier / coursier{/g} : déclaration de dommage (formulaire + délais selon prestataire) ; {g}conserver{/g} l'envoi jusqu'à fin d'enquête"
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport non accompagné{/g} - {g}Ferroviaire{/g} : signaler au gestionnaire d'événements ferroviaires de la région (constat sur place) - {g}Conteneur par camion{/g} : signaler transporteur/fournisseur ; parfois {g}interrompre{/g} le déchargement jusqu'à évaluation"
      },
      {
        "kind": "heading",
        "text": "Protocole des dégâts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Utiliser le formulaire ou l’enregistrement prévu, avec date, références, constat et pièces utiles. L’intervention du transporteur dépend de la procédure et des règles applicables."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "7. Contrôle sommaire et traitement des dommages",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "7.1 Erreur dans la livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}contrôle sommaire{/g} repère les écarts visibles : destinataire, article, quantité, qualité ou délai. Vérifiez le bon et l’étiquette avant de clore la réception. Une différence peut bloquer la vente, retarder la production ou demander un retour."
      },
      {
        "kind": "heading",
        "text": "7.2 Dégâts",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-mesure-photo-v002.webp",
        "alt": "Un enregistreur de température est vérifié à côté d’un bac isolé.",
        "caption": "Un indicateur renseigne sur un dépassement. Un enregistreur conserve une série de mesures à rapprocher des heures du trajet."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/305/commun/log-305-dechargement-photo-v002.webp",
        "alt": "Une remorque immobilisée se trouve à proximité du quai.",
        "caption": "Contrôlez l’état de la livraison à l’interface de transport avant que les unités changent de zone."
      },
      {
        "kind": "paragraph",
        "text": "Observez le carton, le support et les signes de choc, de chute, d’humidité ou d’écrasement. Un {g}indicateur de choc{/g} ou de {g}basculement{/g} signale un seuil. Un {g}enregistreur{/g} fournit des valeurs dans le temps. Une mesure {g}infrarouge{/g} donne une température de surface dans les conditions de mesure. Gardez l’identifiant et l’heure du relevé."
      },
      {
        "kind": "heading",
        "text": "7.3 En cas de dommage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-dommage-photo-v002.webp",
        "alt": "Une opératrice enregistre un coin de carton écrasé avec un appareil photo.",
        "caption": "Photographiez le défaut et rattachez la preuve au document, au lot et à la date."
      },
      {
        "kind": "paragraph",
        "text": "Mettez en attente le lot selon la procédure. Notez les faits dans un {g}protocole de dégâts{/g}, avec photos, références, quantités et heure. Pour une remise accompagnée, consignez l’écart avec le transporteur selon les règles. Sans transporteur présent, gardez les preuves et avertissez les personnes désignées dans le délai applicable. Attendez la décision de disposition du lot."
      }
    ],
    "module": "307",
    "revision": "307-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
