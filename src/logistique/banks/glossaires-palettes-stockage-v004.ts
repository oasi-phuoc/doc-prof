export const palletAndStorageTerms: Readonly<Record<string, readonly (readonly [term: string, definition: string])[]>> = {
  '306': [
    ['Conteneur-réservoir', 'Cuve montée dans un châssis de manutention. Le matériau, les accessoires et le volume sont adaptés au produit transporté.'],
    ['Pal-Box', 'Caisse en carton ondulé montée sur des plots. L’espace sous la caisse permet de l’engager avec des fourches compatibles.'],
    ['Palette en tôle d’acier', 'Support dont le plateau est en tôle d’acier. La masse, la charge et les dimensions admissibles dépendent du modèle.'],
    ['Varitainer', 'Exemple de palette-réservoir. Une cuve sur un support manutentionnable sert à transporter ou stocker un liquide ou un vrac fin compatible.'],
  ],
  '403': [
    ['Bloc à plat', 'Stockage au sol en un seul niveau. Des blocs d’unités sont disposés de part et d’autre des allées prévues.'],
    ['Bloc en piles', 'Stockage avec des unités superposées au sol. Il suppose des supports compatibles et le respect des limites de stabilité et de charge.'],
    ['Carrousel horizontal', 'Installation où les casiers se déplacent en boucle horizontale pour arriver au poste de prélèvement.'],
    ['Casier en nid d’abeille', 'Assemblage de casiers profonds qui séparent des marchandises longues, comme des tubes.'],
    ['Drive-through', 'Rayonnage compact à deux accès. Le chargement et le prélèvement peuvent s’effectuer à des extrémités opposées.'],
    ['Magasin grande hauteur', 'Entrepôt dont les rayonnages très hauts peuvent être desservis par des transstockeurs.'],
    ['Navette de stockage', 'Petit chariot qui se déplace dans un canal de stockage pour déposer ou reprendre une charge.'],
    ['Paternoster', 'Carrousel vertical qui amène le compartiment demandé à une hauteur de travail.'],
    ['Rayonnage à palettes', 'Rayonnage constitué de montants et de lisses. Les palettes reposent sur les lisses à des niveaux définis.'],
    ['Rayonnage push-back', 'Rayonnage compact à accès unique. Une nouvelle palette pousse les précédentes en profondeur. La dernière entrée ressort en premier.'],
    ['Robot mobile autonome (AMR)', 'Véhicule qui se déplace dans l’entrepôt avec ses capteurs et transporte, par exemple, un bac.'],
    ['Stockage en rangées', 'Implantation qui aligne des charges le long d’une allée pour permettre l’accès aux unités.'],
    ['Stockage horizontal à cassettes', 'Installation qui garde les tubes ou profils dans des cassettes et présente la cassette demandée au poste.'],
    ['Stockage suspendu dynamique', 'Stockage où des charges suspendues se déplacent sur un rail pour être amenées au poste.'],
  ],
}

const photo = (module: string, subject: string) => `log-${module}-${subject}-photo-v005.webp`

export const palletAndStorageFigures: Readonly<Record<string, readonly (readonly [term: string, file: string, caption?: string])[]>> = {
  '306': [
    ['Conteneur-réservoir', photo('306', 'cuve-inox')],
    ['Pal-Box', photo('306', 'pal-box'), 'Les plots blancs ménagent les passages sous la caisse.'],
    ['Palette en tôle d’acier', photo('306', 'tole-acier')],
    ['Palette INKA', photo('306', 'inka'), 'Les pieds moulés de la palette vide s’emboîtent.'],
    ['Palette à fûts', photo('306', 'palette-futs')],
    ['Cadre grillagé', photo('306', 'cadre-grillage'), 'Le panneau grillagé est ouvert pour accéder au lot.'],
    ['Box à claire-voie', photo('306', 'claire-voie')],
    ['Réservoir sur palette', photo('306', 'varitainer'), 'La cuve est munie d’un robinet de soutirage.'],
    ['Varitainer', photo('306', 'varitainer')],
  ],
  '403': [
    ['Bloc à plat', photo('403', 'bloc-plat')],
    ['Bloc en piles', 'log-403-sol-photo-v003.webp'],
    ['Carrousel horizontal', photo('403', 'carrousel-horizontal')],
    ['Casier en nid d’abeille', 'log-403-nid-photo-v003.webp'],
    ['Drive-through', photo('403', 'drive-through'), 'Une deuxième allée est visible au fond.'],
    ['Magasin grande hauteur', photo('403', 'grande-hauteur')],
    ['Navette de stockage', photo('403', 'navette'), 'La navette rouge se déplace sous la charge.'],
    ['Paternoster', 'log-403-rotatif-photo-v003.webp'],
    ['Rayonnage à palettes', photo('403', 'rayonnage-palettes')],
    ['Rayonnage compartimenté', photo('403', 'compartiments')],
    ['Rayonnage push-back', photo('403', 'push-back')],
    ['Robot mobile autonome (AMR)', photo('403', 'robot-amr')],
    ['Stockage en rangées', photo('403', 'rangees')],
    ['Stockage horizontal à cassettes', photo('403', 'cassettes')],
    ['Stockage suspendu dynamique', photo('403', 'suspendu-dynamique')],
  ],
  '404': [
    ['Entrepôt fermé', photo('404', 'entrepot-ferme')],
    ['Entrepôt ouvert', photo('404', 'a-ciel-ouvert')],
    ['Stockage automatisé', photo('403', 'grande-hauteur')],
  ],
}

export const storageArrangementTerms: Readonly<Record<string, readonly (readonly [string, string])[]>> = {
  '403': [['Râtelier vertical', 'Support à séparations qui maintient debout des produits longs ou des panneaux. L’accès et la stabilité dépendent du dispositif prévu.']],
  '408': [['Stockage en épis', 'Disposition des places de stockage au sol en biais par rapport à l’allée. Elle facilite certaines manœuvres mais utilise généralement moins bien la surface que des rangées droites.']],
}

export const storageArrangementFigures = {
  '403': [['Râtelier vertical', 'log-403-ratelier-vertical-photo-v006.webp']],
  '408': [['Stockage en épis', 'log-408-epis-photo-v005.webp']],
} as const
