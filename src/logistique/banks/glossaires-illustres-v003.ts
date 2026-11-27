import type { LogistiqueUnit } from '../approved-banks'
import type { LogistiqueGlossaryFigure } from '@/math/types'

export const glossaryIllustrations: Readonly<Record<string, readonly (readonly [term: string, file: string, caption?: string])[]>> = {
  '100': [
    ["réception", "log-100-reception-photo-v002.webp"],
    ["emplacement", "log-110-mouvement-photo-v002.webp"],
  ],
  '101': [
    ["ambre", "log-101-ambre-photo-v003.webp"],
    ["ravitaillement", "log-101-napoleon-photo-v003.webp", "Imaginer le transport des vivres et du matériel à l’époque napoléonienne."],
    ["conteneur", "log-101-1956-photo-v003.webp"],
    ["informatique", "log-101-ordinateur-photo-v003.webp"],
  ],
  '102': [
    ["transbordement", "log-102-plateforme-photo-v002.webp"],
    ["flux d’informations", "log-803-erp-photo-v002.webp"],
  ],
  '103': [
    ["flux de données", "log-110-mouvement-photo-v002.webp"],
    ["règle des 6B", "log-103-preparation-photo-v002.webp", "La préparation vérifie notamment le bon article et la bonne quantité."],
  ],
  '104': [
    ["production", "log-104-tri-chutes-photo-v002.webp"],
    ["transbordement", "log-102-plateforme-photo-v002.webp"],
  ],
  '105': [
    ["Fragilité", "log-105-fragile-photo-v002.webp"],
    ["Hygrométrie", "log-105-hygrometrie-photo-v003.webp"],
    ["Produit fini", "log-104-tri-chutes-photo-v002.webp", "La caisse assemblée est un produit fini pour cet atelier."],
  ],
  '106': [
    ["tri à la source", "log-106-tri-photo-v002.webp"],
    ["UIOM", "log-106-uiom-photo-v003.webp"],
  ],
  '107': [
    ["rétention", "log-107-filiere-photo-v002.webp"],
    ["recyclage", "log-106-tri-photo-v002.webp", "Le tri prépare les matières avant leur traitement."],
  ],
  '108': [
    ["microplastiques", "log-108-plastique-photo-v003.webp"],
  ],
  '109': [
    ["badge d’accès", "log-109-badge-photo-v002.webp"],
  ],
  '110': [
    ["donnée de mouvement", "log-110-mouvement-photo-v002.webp"],
    ["intralogistique", "log-103-preparation-photo-v002.webp", "Le prélèvement s’effectue à l’intérieur de l’entrepôt."],
  ],
  '201': [
    ["client", "log-201-client-photo-v002.webp"],
    ["réclamation", "log-209-retour-photo-v002.webp"],
  ],
  '202': [
    ["tenue de travail", "log-202-hygiene-photo-v003.webp"],
    ["écoute active", "log-203-feedback-photo-v002.webp"],
  ],
  '203': [
    ["retour factuel", "log-203-feedback-photo-v002.webp"],
  ],
  '204': [
    ["étude de marché", "log-204-marche-photo-v002.webp"],
    ["offre", "log-205-offre-photo-v002.webp"],
  ],
  '205': [
    ["part de marché", "log-204-part-marche-schema-v003.webp"],
  ],
  '206': [
    ["écoute active", "log-203-feedback-photo-v002.webp"],
    ["communication verbale", "log-206-communication-photo-v002.webp"],
  ],
  '207': [
    ["avant-vente", "log-207-prevente-photo-v002.webp"],
    ["évaluation fournisseur", "log-204-marche-photo-v002.webp"],
  ],
  '208': [
    ["conseil de vente", "log-208-vente-photo-v002.webp"],
    ["télévente", "log-206-communication-photo-v002.webp"],
  ],
  '209': [
    ["retour", "log-209-retour-photo-v002.webp"],
    ["défaut", "log-309-qualite-photo-v002.webp"],
  ],
  '301': [
    ["Sourcing", "log-204-marche-photo-v002.webp"],
    ["Faire ou acheter", "log-104-tri-chutes-photo-v002.webp"],
    ["Point de commande", "log-312-cycle-stock-schema-v003.webp"],
  ],
  '302': [
    ["Comparaison d’offres", "log-204-marche-photo-v002.webp"],
  ],
  '303': [
    ["Quai", "log-303-quai-photo-v002.webp"],
    ["Contrôle d’entrée", "log-100-reception-photo-v002.webp"],
  ],
  '304': [
    ["Document d’accompagnement", "log-304-documents-photo-v003.webp"],
    ["Étiquette", "log-100-reception-photo-v002.webp"],
  ],
  '305': [
    ["Déchargement", "log-305-dechargement-photo-v002.webp"],
    ["Signalisation", "log-405-circulation-photo-v002.webp"],
    ["Engin de manutention", "log-409-transpalette-photo-v002.webp"],
  ],
  '306': [
    ["Box-palette", "log-306-supports-speciaux-photo-v004.webp", "La caisse métallique de droite retient des copeaux."],
    ["Cadre de palette", "log-306-cadre-photo-v003.webp", "Les cadres emboîtés rehaussent les parois."],
    ["Couvercle de palette", "log-306-cadre-photo-v003.webp", "Le couvercle est visible à côté des cadres."],
    ["CHEP", "log-306-chep-photo-v002.webp", "Exemple de palette CHEP en bois bleu."],
    ["Demi-palette", "log-306-formats-photo-v002.webp", "La demi-palette de 800 × 600 mm est à droite."],
    ["Entrée de fourches", "log-306-eur-photo-v002.webp", "Repérez les ouvertures sous le plateau."],
    ["Palette EUR / EPAL 1", "log-306-eur-photo-v002.webp", "1 200 × 800 × 144 mm."],
    ["Palette industrielle", "log-306-formats-photo-v002.webp", "Le format industriel de 1 200 × 1 000 mm est à gauche."],
    ["Palette synthétique", "log-306-supports-speciaux-photo-v004.webp", "La palette en plastique bleu est à gauche."],
    ["Plot", "log-306-eur-photo-v002.webp", "Les blocs de bois séparent les planches du dessus et du dessous."],
    ["Rollbox", "log-615-rollcontainer-photo-v002.webp"],
  ],
  '307': [
    ["Dommage apparent", "log-307-dommage-photo-v002.webp"],
    ["Preuve", "log-307-dommage-photo-v002.webp", "La photo documente l’état du carton à la réception."],
  ],
  '308': [
    ["pied à coulisse", "log-309-qualite-photo-v002.webp"],
    ["tare", "log-308-pesee-photo-v002.webp", "Le récipient vide a sa propre masse."],
  ],
  '309': [
    ["Mesure", "log-309-qualite-photo-v002.webp"],
    ["Libération", "log-309-quarantaine-photo-v003.webp", "Les unités en attente de décision sont séparées."],
  ],
  '310': [
    ["Conditionnement", "log-310-mise-en-stock-photo-v002.webp"],
    ["Étiquette de stock", "log-801-etiquette-photo-v002.webp"],
    ["Emplacement", "log-110-mouvement-photo-v002.webp"],
  ],
  '311': [
    ["Sourcing multiple", "log-204-marche-photo-v002.webp", "Les offres sont demandées à plusieurs fournisseurs."],
    ["Point de commande", "log-312-cycle-stock-schema-v003.webp"],
  ],
  '312': [
    ["Stock physique", "log-312-froid-photo-v002.webp"],
    ["Point de commande", "log-312-cycle-stock-schema-v003.webp"],
  ],
  '401': [
    ["Fonction de réserve", "log-401-reserve-photo-v002.webp"],
    ["Affinage", "log-402-maturation-photo-v002.webp"],
  ],
  '402': [
    ["Entrepôt de maturation", "log-402-maturation-photo-v002.webp"],
    ["Entrepôt de réserve", "log-401-reserve-photo-v002.webp"],
  ],
  '403': [
    ["Cantilever", "log-403-rayonnages-photo-v002.webp", "Les planches reposent sur les bras du cantilever."],
    ["Drive-in", "log-403-drivein-photo-v003.webp"],
    ["Rayonnage compartimenté", "log-403-nid-photo-v003.webp"],
    ["Rayonnage dynamique", "log-406-fifo-photo-v002.webp"],
    ["Rayonnage mobile", "log-403-mobile-photo-v003.webp"],
    ["Stockage au sol", "log-403-sol-photo-v003.webp"],
    ["Stockage suspendu", "log-403-suspendu-photo-v003.webp"],
  ],
  '404': [
    ["Entrepôt couvert", "log-404-abri-photo-v002.webp", "L’auvent protège les palettes par le dessus."],
    ["Condition de stockage", "log-105-hygrometrie-photo-v003.webp", "Le capteur mesure l’humidité du local."],
  ],
  '405': [
    ["Risque", "log-405-circulation-photo-v002.webp", "La séparation réduit le risque de collision entre piétons et engins."],
  ],
  '406': [
    ["FIFO", "log-406-fifo-photo-v002.webp"],
    ["LIFO", "log-403-drivein-photo-v003.webp", "À accès unique, la palette la plus proche de l’entrée ressort en premier."],
    ["Traçabilité de stock", "log-110-mouvement-photo-v002.webp"],
  ],
  '407': [
    ["Chariot élévateur", "log-407-chariot-contrepoids-photo-v002.webp"],
    ["Convoyeur", "log-407-convoyeur-photo-v002.webp"],
    ["Timon", "log-407-manuel-photo-v002.webp", "La poignée noire permet de commander et d’orienter le transpalette."],
    ["Transstockeur", "log-409-transstockeur-photo-v003.webp"],
    ["Pont roulant", "log-410-levage-photo-v002.webp"],
  ],
  '408': [
    ["Allée", "log-408-organisation-photo-v002.webp"],
    ["Adresse de stock", "log-110-mouvement-photo-v002.webp"],
  ],
  '409': [
    ["AGV", "log-409-agv-photo-v002.webp"],
    ["AutoStore", "log-409-autostore-photo-v003.webp"],
    ["Bras porteurs", "log-409-mat-retractable-photo-v002.webp", "Les bras munis de roues dépassent devant le poste de conduite."],
    ["Chariot à mât rétractable", "log-409-mat-retractable-photo-v002.webp"],
    ["Chariot latéral", "log-409-lateral-photo-v002.webp"],
    ["Contrepoids", "log-409-contrepoids-photo-v002.webp", "Le bloc arrière équilibre la charge portée à l’avant."],
    ["Fourches", "log-409-transpalette-photo-v002.webp", "Les deux bras bas entrent sous la palette."],
    ["Gerbeur", "log-409-gerbeur-photo-v002.webp"],
    ["Mât", "log-409-gerbeur-photo-v002.webp", "La structure verticale guide la montée des fourches."],
    ["Tracteur de manutention", "log-409-tracteur-photo-v003.webp"],
    ["Transpalette", "log-409-transpalette-photo-v002.webp"],
    ["Transstockeur", "log-409-transstockeur-photo-v003.webp"],
  ],
  '410': [
    ["Convoyeur à rouleaux", "log-407-convoyeur-photo-v002.webp"],
    ["Convoyeur vertical", "log-410-vertical-photo-v003.webp"],
    ["Dispositif de prise de charge", "log-410-levage-photo-v002.webp", "Le crochet est visible au-dessus de la zone de levage."],
    ["Engin de levage", "log-410-levage-photo-v002.webp"],
  ],
  '501': [
    ["Assemblage", "log-104-tri-chutes-photo-v002.webp"],
    ["Nomenclature", "log-505-nomenclature-photo-v002.webp"],
  ],
  '502': [
    ["Poste", "log-503-ligne-photo-v002.webp"],
    ["Stock intermédiaire", "log-401-reserve-photo-v002.webp"],
  ],
  '503': [
    ["Atelier", "log-104-tri-chutes-photo-v002.webp"],
    ["Poste", "log-503-ligne-photo-v002.webp"],
  ],
  '504': [
    ["Deux bacs", "log-504-deux-bacs-photo-v002.webp"],
    ["Kanban", "log-504-deux-bacs-photo-v002.webp", "La carte orange donne le signal de réapprovisionnement."],
  ],
  '505': [
    ["BOM", "log-505-nomenclature-photo-v002.webp"],
    ["Contrôle d’avancement", "log-503-ligne-photo-v002.webp"],
  ],
  '506': [
    ["Contrôle qualité", "log-309-qualite-photo-v002.webp"],
    ["Traçabilité", "log-506-trace-photo-v002.webp"],
  ],
  '601': [
    ["Picking", "log-103-preparation-photo-v002.webp"],
    ["Pick-and-pack", "log-601-pick-photo-v002.webp"],
  ],
  '602': [
    ["Calage", "log-602-conditionnement-photo-v002.webp"],
    ["Unité d’expédition", "log-801-etiquette-photo-v002.webp"],
  ],
  '603': [
    ["Film étirable", "log-310-mise-en-stock-photo-v002.webp"],
    ["Feuillard", "log-603-feuillard-photo-v003.webp"],
    ["Arrimage", "log-603-sangles-photo-v002.webp"],
  ],
  '604': [
    ["Plateforme", "log-612-cross-dock-photo-v002.webp"],
  ],
  '605': [
    ["Point de retrait", "log-201-client-photo-v002.webp"],
    ["Tri", "log-605-tri-colis-photo-v002.webp"],
  ],
  '606': [
    ["Arrimage", "log-603-sangles-photo-v002.webp"],
  ],
  '607': [
    ["Wagon", "log-607-rail-photo-v002.webp"],
    ["Interface rail-route", "log-102-plateforme-photo-v002.webp"],
  ],
  '608': [
    ["ULD", "log-608-uld-photo-v002.webp"],
    ["Contrôle d’acceptation", "log-608-controle-photo-v003.webp"],
  ],
  '609': [
    ["Port", "log-609-port-photo-v002.webp"],
    ["Transbordement", "log-102-plateforme-photo-v002.webp"],
  ],
  '610': [
    ["Chaussée roulante", "log-610-rola-photo-v003.webp"],
    ["Conteneur ISO", "log-607-rail-photo-v002.webp"],
  ],
  '611': [
    ["Trieur", "log-605-tri-colis-photo-v002.webp"],
  ],
  '612': [
    ["Cross-docking", "log-612-cross-dock-photo-v002.webp"],
    ["Transport sous conditions", "log-312-froid-photo-v002.webp"],
  ],
  '613': [
    ["réclamation", "log-209-retour-photo-v002.webp"],
  ],
  '614': [
    ["Collecte", "log-615-rollcontainer-photo-v002.webp"],
  ],
  '615': [
    ["Rollbox", "log-615-rollcontainer-photo-v002.webp"],
  ],
  '616': [
    ["Tri de distribution", "log-616-lettres-photo-v003.webp"],
  ],
  '701': [
    ["Inventaire", "log-701-inventaire-photo-v002.webp"],
  ],
  '702': [
    ["Amortissement linéaire", "log-702-amortissement-schema-v003.webp"],
  ],
  '703': [
    ["Salaire net", "log-703-brut-net-schema-v003.webp"],
  ],
  '704': [
    ["Indicateur", "log-704-indicateurs-photo-v002.webp"],
  ],
  '705': [
    ["Stock de sécurité", "log-401-reserve-photo-v002.webp"],
  ],
  '801': [
    ["SSCC", "log-801-etiquette-photo-v002.webp"],
    ["RFID", "log-801-rfid-photo-v003.webp"],
  ],
  '802': [
    ["Enregistreur de données", "log-802-mesure-photo-v002.webp"],
  ],
  '803': [
    ["ERP", "log-803-erp-photo-v002.webp"],
  ],
  '804': [
    ["Droit de lecture", "log-109-badge-photo-v002.webp", "Comme l’accès physique, la lecture d’un fichier peut être réservée aux personnes autorisées."],
  ],
  '805': [
    ["table des matières", "log-805-titres-schema-v002.webp"],
    ["légende", "log-307-dommage-photo-v002.webp", "Une légende explique ce que montre la photo dans le compte rendu."],
  ],
  '806': [
    ["Référence absolue", "log-806-recopie-schema-v003.webp"],
  ],
  '807': [
    ["Diapositive", "log-807-presentation-photo-v002.webp"],
  ],
  '808': [
    ["Bloc-notes", "log-808-notes-photo-v002.webp"],
  ],
  '809': [
    ["Poste de contrôle", "log-809-poste-photo-v002.webp"],
  ],
  '901': [
    ["Dépendance", "log-901-planning-schema-v002.webp"],
  ],
  '902': [
    ["non-conformité", "log-307-dommage-photo-v002.webp"],
    ["stock physique", "log-401-reserve-photo-v002.webp"],
  ],
}

export function illustrateLogistiqueGlossaries(units: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  const byFile = new Map<string, LogistiqueGlossaryFigure>()
  const byModule = new Map<string, Map<string, LogistiqueGlossaryFigure>>()
  for (const unit of units) {
    if (unit.kind !== 'theorie') continue
    const modulePictures = new Map<string, LogistiqueGlossaryFigure>()
    for (const block of unit.blocks) {
      const images = block.kind === 'image' ? [block] : block.kind === 'image-row' ? block.cells : []
      for (const { src, alt } of images) {
        const file = src.split('/').at(-1)!
        if (!modulePictures.has(file)) modulePictures.set(file, { src, alt })
        if (!byFile.has(file)) byFile.set(file, { src, alt })
      }
    }
    byModule.set(unit.module, modulePictures)
  }

  return units.map((unit) => {
    if (unit.kind !== 'glossaire') return unit
    const entries = glossaryIllustrations[unit.module]
    if (!entries) return unit
    return {
      ...unit, revision: `${unit.module}-glossaire-illustre-v003`,
      illustrations: Object.fromEntries(entries.map(([term, file, caption]) => {
        const figure = byModule.get(unit.module)?.get(file) ?? byFile.get(file)
        if (!figure || !unit.approvedFor.every((diploma) =>
          figure.src.includes('/commun/') || figure.src.includes(`/${diploma.toLowerCase()}/`))) {
          throw new Error(`Image autorisée introuvable pour le glossaire ${unit.module} : ${file}`)
        }
        return [term, { ...figure, caption }]
      })),
    }
  })
}
