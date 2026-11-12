import { REVIEWED_REFLEXIVES } from './phrase-reviewed-reflexives'
import type { ThemedFrame } from './phrase-theme-frames'

/**
 * Editorial supplement. Each row whitelists the objects of ONE verb in ONE
 * everyday setting. No free combination of nouns, verbs or locations.
 * Object notation: article | noun | agreed postnominal adjective.
 */
export const PHRASE_DOMAINS = {
  alimentation: 'Alimentation et cuisine', logement: 'Logement et vie quotidienne',
  vetements: 'Vêtements et achats', formation: 'École et formation',
  travail: 'Travail et démarches', transport: 'Déplacements et voyages',
  sante: 'Santé et soin de soi', relations: 'Famille et relations',
  loisirs: 'Culture et loisirs', nature: 'Nature et environnement',
  numerique: 'Numérique et communication', sport: 'Sport et mouvement',
} as const
export type PhraseDomain = keyof typeof PHRASE_DOMAINS
type Row = { id: string; core: string; domain: PhraseDomain; objects: string; place: string }
const row = (id: string, core: string, domain: PhraseDomain, objects: string, place: string): Row => ({ id, core, domain, objects, place })
const kitchen = 'dans/preposition la/determinant cuisine/nom'
const home = 'à/preposition la/determinant maison/nom'
const school = 'pendant/preposition le/determinant cours/nom'
const office = 'au/preposition bureau/nom'
const garden = 'dans/preposition le/determinant jardin/nom'
const shop = 'dans/preposition la/determinant boutique/nom'
const trip = 'pendant/preposition le/determinant voyage/nom'
const party = 'pendant/preposition la/determinant fête/nom'
const sport = 'pendant/preposition l’/determinant entraînement/nom'
const screen = 'sur/preposition l’/determinant écran/nom'

const ROWS: readonly Row[] = [
  row('manger','mange','alimentation','une|poire|mûre;un|abricot|mûr;une|omelette|chaude;des|lentilles|vertes;une|clémentine|juteuse;des|fraises|fraîches',kitchen),
  row('goûter','goûte','alimentation','une|compote|tiède;un|biscuit|croustillant;une|pêche|mûre;un|melon|sucré;une|confiture|maison;une|sauce|épicée',kitchen),
  row('préparer','prépare','alimentation','une|quiche|salée;un|gratin|doré;une|crêpe|fine;un|pique-nique|végétarien;un|dessert|fruité;une|sauce|tomatée',kitchen),
  row('cuisiner','cuisine','alimentation','du|riz|complet;des|lentilles|vertes;des|courgettes|fraîches;une|ratatouille|maison;un|curry|épicé;une|quiche|végétarienne',kitchen),
  row('couper','coupe','alimentation','une|carotte|crue;un|concombre|frais;un|melon|mûr;une|aubergine|violette;un|citron|jaune;un|poivron|rouge',kitchen),
  row('mélanger','mélange','alimentation','la|pâte|épaisse;la|sauce|crémeuse;le|yaourt|nature;la|vinaigrette|maison;la|crème|liquide;les|ingrédients|secs',kitchen),
  row('griller','grille','alimentation','des|courgettes|fraîches;des|poivrons|rouges;une|saucisse|végétale;des|aubergines|violettes;des|amandes|entières;des|tartines|épaisses',kitchen),
  row('décorer','décore','logement','la|salle|commune;le|salon|familial;la|fenêtre|centrale;le|sapin|vert;un|vase|transparent;la|table|ronde',home),
  row('acheter','achète','vetements','un|pantalon|bleu;une|ceinture|noire;des|chaussettes|épaisses;des|sandales|légères;un|pyjama|chaud;une|casquette|rouge',shop),
  row('fêter','fête','relations','une|naissance|récente;un|départ|prochain;une|réussite|collective;des|retrouvailles|familiales;une|promotion|professionnelle;une|nouvelle|heureuse','avec/preposition ses/determinant proches/nom'),
  row('payer','paie','travail','la|facture|mensuelle;le|parking|souterrain;les|frais|administratifs;la|cotisation|annuelle;le|supplément|demandé;le|solde|restant','au/preposition guichet/nom'),
  row('accrocher','accroche','logement','une|affiche|colorée;une|guirlande|lumineuse;un|calendrier|mural;une|étagère|légère;un|miroir|rond;une|décoration|dorée',home),
  row('apporter','apporte','formation','un|dictionnaire|bilingue;une|calculatrice|solaire;des|feutres|lavables;un|carnet|neuf;une|trousse|complète;des|documents|utiles','en/preposition classe/nom'),
  row('emporter','emporte','transport','une|gourde|pleine;une|carte|routière;un|parapluie|pliant;un|guide|touristique;une|boussole|précise;une|couverture|légère',trip),
  row('rapporter','rapporte','transport','une|carte|postale;une|spécialité|locale;une|poterie|artisanale;un|carnet|rempli;une|recette|régionale;un|bijou|artisanal','après/preposition le/determinant voyage/nom'),
  row('porter','porte','vetements','une|jupe|longue;un|pantalon|clair;des|sandales|neuves;une|ceinture|large;une|casquette|verte;des|chaussettes|rayées',party),
  row('enfiler','enfile','vetements','un|pyjama|propre;une|veste|chaude;des|chaussettes|épaisses;une|robe|longue;un|tablier|propre;des|bottes|neuves',home),
  row('laver','lave','logement','les|vitres|sales;les|rideaux|blancs;les|draps|tachés;une|nappe|sale;les|carreaux|blancs;les|coussins|tachés',home),
  row('nettoyer','nettoie','logement','le|four|encrassé;le|réfrigérateur|vide;le|lavabo|taché;la|baignoire|sale;le|tapis|poussiéreux;le|balcon|couvert',home),
  row('essuyer','essuie','logement','les|assiettes|mouillées;l’|évier|humide;le|comptoir|mouillé;le|miroir|embué;les|couverts|propres;la|vaisselle|fragile',home),
  row('sécher','sèche','logement','une|nappe|humide;des|chaussettes|mouillées;les|draps|propres;le|tapis|mouillé;les|couverts|propres;une|serviette|humide',home),
  row('repasser','repasse','vetements','un|tee-shirt|propre;une|jupe|plissée;une|nappe|blanche;un|tablier|froissé;une|serviette|propre;un|drap|froissé',home),
  row('ranger','range','logement','le|placard|encombré;les|couverts|propres;les|outils|propres;les|chaussures|sèches;le|garage|encombré;les|provisions|achetées',home),
  row('poser','pose','logement','une|tasse|vide;une|lampe|neuve;un|coussin|moelleux;une|assiette|pleine;une|bougie|éteinte;un|plateau|lourd','sur/preposition la/determinant table/nom'),
  row('cacher','cache','loisirs','une|surprise|amusante;un|indice|précieux;une|figurine|dorée;une|enveloppe|rouge;un|coffret|secret;une|bille|brillante','pendant/preposition le/determinant jeu/nom'),
  row('montrer','montre','travail','son|abonnement|annuel;une|attestation|officielle;un|formulaire|rempli;un|justificatif|récent;son|permis|valide;une|convocation|officielle','au/preposition guichet/nom'),
  row('chercher','cherche','numerique','un|fichier|récent;une|adresse|précise;un|courriel|important;une|information|fiable;un|contact|professionnel;une|vidéo|éducative',screen),
  row('trouver','trouve','formation','une|solution|simple;une|réponse|exacte;un|exemple|concret;une|erreur|fréquente;une|explication|claire;un|synonyme|courant','dans/preposition le/determinant manuel/nom'),
  row('ramasser','ramasse','nature','des|déchets|plastiques;des|coquillages|blancs;des|brindilles|sèches;des|glands|mûrs;des|châtaignes|brunes;des|noisettes|mûres','dans/preposition la/determinant forêt/nom'),
  row('attraper','attrape','sport','une|balle|jaune;un|frisbee|rouge;un|volant|blanc;un|anneau|bleu;une|corde|tendue;un|foulard|rouge',sport),
  row('lancer','lance','sport','une|balle|souple;un|volant|blanc;un|anneau|léger;un|javelot|léger;un|disque|rouge;un|ballon|ovale',sport),
  row('jeter','jette','logement','une|éponge|usée;un|emballage|vide;un|mouchoir|usagé;un|carton|abîmé;une|enveloppe|déchirée;un|flacon|vide','dans/preposition la/determinant poubelle/nom'),
  row('pousser','pousse','logement','un|fauteuil|roulant;une|poussette|vide;un|carton|lourd;un|portail|rouillé;une|table|basse;un|meuble|léger','avec/preposition précaution/nom'),
  row('tirer','tire','logement','un|tiroir|coincé;une|corde|tendue;une|valise|lourde;une|poignée|métallique;une|luge|rouge;un|volet|roulant','avec/preposition précaution/nom'),
  row('lever','lève','sport','un|bras|tendu;une|jambe|droite;un|genou|plié;les|épaules|raides;un|drapeau|rouge;un|haltère|léger',sport),
  row('baisser','baisse','logement','les|yeux|fatigués;les|bras|levés;le|chauffage|électrique;la|barrière|métallique;le|rideau|épais;la|visière|transparente','avec/preposition précaution/nom'),
  row('dessiner','dessine','loisirs','un|portrait|expressif;un|visage|souriant;une|fusée|rouge;un|bateau|blanc;un|village|calme;un|jardin|fleuri','sur/preposition une/determinant feuille/nom'),
  row('colorier','colorie','loisirs','une|étoile|jaune;un|papillon|bleu;une|fleur|rouge;un|drapeau|tricolore;un|triangle|vert;une|fusée|violette','avec/preposition des/determinant crayons/nom'),
  row('regarder','regarde','loisirs','un|documentaire|animalier;une|émission|culturelle;une|pièce|comique;un|ballet|classique;un|dessin|animé;une|série|policière','avec/preposition ses/determinant amis/nom'),
  row('observer','observe','nature','une|fourmi|noire;un|écureuil|roux;une|abeille|active;une|feuille|dentelée;un|nuage|sombre;un|champignon|rouge','avec/preposition attention/nom'),
  row('admirer','admire','loisirs','une|sculpture|ancienne;une|mosaïque|colorée;une|fresque|ancienne;une|poterie|artisanale;un|vitrail|coloré;une|gravure|ancienne','dans/preposition le/determinant musée/nom'),
  row('filmer','filme','loisirs','un|concert|gratuit;une|répétition|publique;un|défilé|costumé;une|danse|traditionnelle;une|interview|courte;une|scène|comique','avec/preposition une/determinant caméra/nom'),
  row('photographier','photographie','nature','un|papillon|bleu;une|cascade|impressionnante;un|écureuil|roux;un|nuage|rose;une|montagne|enneigée;une|libellule|bleue','pendant/preposition la/determinant promenade/nom'),
  row('écouter','écoute','loisirs','un|podcast|culturel;un|concert|classique;une|interview|récente;un|conte|africain;un|poème|enregistré;une|émission|musicale','avec/preposition attention/nom'),
  row('chanter','chante','loisirs','un|couplet|joyeux;un|chant|traditionnel;une|comptine|connue;un|air|populaire;une|mélodie|douce;un|hymne|national','dans/preposition la/determinant chorale/nom'),
  row('danser','danse','loisirs','un|tango|argentin;une|polka|rapide;une|rumba|lente;un|rock|endiablé;une|samba|brésilienne;une|ronde|joyeuse',party),
  row('aimer','aime','loisirs','le|cinéma|italien;la|peinture|moderne;le|théâtre|contemporain;les|romans|policiers;la|photographie|numérique;les|contes|traditionnels',''),
  row('adorer','adore','nature','les|chevaux|blancs;les|papillons|colorés;les|jardins|fleuris;les|forêts|tropicales;les|paysages|marins;les|fleurs|sauvages',''),
  row('détester','déteste','alimentation','les|plats|froids;le|lait|tiède;les|boissons|gazeuses;les|sauces|piquantes;le|café|amer;les|aliments|brûlés',''),
  row('préférer','préfère','vetements','les|chaussures|plates;les|vestes|légères;les|pantalons|larges;les|robes|longues;les|couleurs|vives;les|chaussettes|épaisses',''),
  row('avoir','a','travail','un|rendez-vous|professionnel;un|contrat|temporaire;une|réunion|importante;une|formation|gratuite;un|emploi|stable;une|mission|urgente',''),
  row('visiter','visite','transport','un|château|médiéval;une|exposition|temporaire;un|monument|historique;une|cathédrale|ancienne;un|quartier|piéton;un|port|ancien',trip),
  row('traverser','traverse','transport','un|passage|piéton;une|avenue|animée;une|place|publique;un|tunnel|éclairé;une|passerelle|étroite;un|carrefour|dangereux','avec/preposition prudence/nom'),
  row('longer','longe','nature','un|canal|tranquille;une|falaise|rocheuse;un|champ|fleuri;un|ruisseau|clair;une|haie|épaisse;une|forêt|dense','pendant/preposition la/determinant randonnée/nom'),
  row('contourner','contourne','transport','un|rond-point|fleuri;un|chantier|fermé;un|véhicule|immobilisé;un|bâtiment|ancien;une|barrière|fermée;un|rocher|imposant','avec/preposition prudence/nom'),
  row('inviter','invite','relations','ses|parents|âgés;ses|collègues|sympathiques;des|voisins|serviables;une|amie|proche;un|cousin|éloigné;ses|camarades|enthousiastes','pour/preposition le/determinant repas/nom'),
  row('aider','aide','relations','un|camarade|absent;une|personne|âgée;un|collègue|débutant;une|amie|malade;un|voisin|blessé;une|passante|perdue','avec/preposition patience/nom'),
  row('remercier','remercie','relations','une|bénévole|attentive;un|collègue|serviable;une|infirmière|attentionnée;un|guide|patient;une|voisine|généreuse;un|ami|fidèle','pour/preposition le/determinant service/nom rendu/adjectif'),
  row('saluer','salue','relations','un|collègue|souriant;une|commerçante|aimable;un|passant|connu;une|amie|proche;ses|cousins|éloignés;ses|parents|âgés','avant/preposition le/determinant départ/nom'),
  row('appeler','appelle','relations','une|amie|proche;son|cousin|éloigné;ses|grands-parents|paternels;un|collègue|absent;sa|sœur|aînée;son|frère|cadet','au/preposition téléphone/nom'),
  row('embrasser','embrasse','relations','son|grand-père|maternel;sa|grand-mère|paternelle;ses|parents|émus;son|frère|cadet;une|amie|proche;son|cousin|préféré','avant/preposition le/determinant départ/nom'),
  row('caresser','caresse','nature','un|cheval|calme;un|poney|docile;un|chaton|roux;un|agneau|blanc;une|chèvre|docile;un|chiot|joueur','avec/preposition douceur/nom'),
  row('soigner','soigne','sante','une|brûlure|légère;une|coupure|superficielle;une|égratignure|récente;une|ampoule|douloureuse;une|entorse|légère;une|piqûre|douloureuse','avec/preposition attention/nom'),
  row('consoler','console','relations','un|enfant|triste;une|amie|inquiète;un|camarade|déçu;une|voisine|bouleversée;son|frère|cadet;sa|cousine|attristée','avec/preposition douceur/nom'),
  row('garder','garde','travail','un|reçu|original;une|facture|importante;un|justificatif|récent;une|attestation|officielle;un|document|confidentiel;un|contrat|signé','dans/preposition un/determinant dossier/nom'),
  row('surveiller','surveille','logement','le|four|chaud;la|cuisson|lente;la|casserole|pleine;la|bougie|allumée;le|portail|ouvert;la|porte|ouverte',home),
  row('protéger','protège','nature','la|rivière|polluée;les|oiseaux|migrateurs;la|faune|locale;les|plantes|rares;une|espèce|menacée;les|arbres|centenaires','avec/preposition une/determinant association/nom'),
  row('sauver','sauve','nature','un|hérisson|blessé;un|chiot|abandonné;un|phoque|échoué;une|tortue|coincée;un|animal|piégé;un|faon|blessé','avec/preposition les/determinant secours/nom'),
  row('réparer','répare','logement','une|lampe|cassée;une|poignée|abîmée;une|étagère|instable;un|robinet|défectueux;un|tiroir|coincé;une|horloge|ancienne','avec/preposition les/determinant outils/nom'),
  row('bricoler','bricole','logement','un|coffre|solide;un|banc|rustique;un|cadre|décoratif;un|tabouret|bas;une|boîte|solide;une|tablette|murale','dans/preposition l’/determinant atelier/nom'),
  row('coller','colle','loisirs','un|timbre|neuf;un|autocollant|rond;une|gommette|rouge;un|ruban|doré;une|image|découpée;une|mosaïque|colorée','avec/preposition soin/nom'),
  row('plier','plie','logement','une|serviette|propre;un|drap|sec;un|torchon|propre;une|couverture|légère;un|tee-shirt|propre;une|nappe|blanche',home),
  row('déchirer','déchire','logement','un|emballage|vide;une|enveloppe|fermée;un|brouillon|inutile;un|sachet|vide;une|étiquette|abîmée;un|carton|mince','avant/preposition le/determinant tri/nom'),
  row('étudier','étudie','formation','un|dialogue|court;un|document|historique;un|schéma|détaillé;une|langue|étrangère;un|chapitre|nouveau;une|photographie|ancienne',school),
  row('réviser','révise','formation','la|grammaire|française;le|vocabulaire|professionnel;les|fractions|simples;les|conjugaisons|irrégulières;la|géographie|européenne;les|accords|difficiles','avant/preposition l’/determinant examen/nom'),
  row('recopier','recopie','formation','un|dialogue|court;une|définition|précise;un|tableau|complet;un|titre|court;une|adresse|complète;une|consigne|importante','dans/preposition son/determinant cahier/nom'),
  row('corriger','corrige','formation','une|dictée|courte;un|texte|personnel;une|réponse|fausse;un|calcul|erroné;une|phrase|incorrecte;un|résumé|incomplet',school),
  row('compter','compte','travail','les|billets|reçus;les|clients|présents;les|produits|vendus;les|colis|livrés;les|heures|effectuées;les|commandes|reçues',office),
  row('calculer','calcule','travail','un|budget|mensuel;une|réduction|commerciale;une|surface|totale;un|salaire|net;une|dépense|annuelle;une|somme|totale','avec/preposition une/determinant calculatrice/nom'),
  row('mesurer','mesure','logement','une|étagère|neuve;une|fenêtre|étroite;un|rideau|long;un|tapis|rond;un|couloir|étroit;une|planche|brute','avec/preposition un/determinant mètre/nom'),
  row('raconter','raconte','relations','un|souvenir|heureux;une|anecdote|amusante;un|voyage|récent;une|rencontre|inattendue;une|expérience|personnelle;une|journée|exceptionnelle','à/preposition ses/determinant amis/nom'),
  row('demander','demande','travail','un|renseignement|précis;une|attestation|officielle;un|remboursement|partiel;un|devis|gratuit;une|autorisation|écrite;un|duplicata|officiel','au/preposition guichet/nom'),
  row('expliquer','explique','formation','une|méthode|simple;un|calcul|difficile;un|mot|nouveau;une|consigne|complexe;une|démarche|logique;un|raisonnement|précis','avec/preposition un/determinant exemple/nom'),
  row('allumer','allume','logement','le|chauffage|électrique;le|four|électrique;une|guirlande|lumineuse;un|projecteur|puissant;le|réchaud|portable;une|lanterne|rouge',home),
  row('fermer','ferme','logement','le|portail|métallique;un|tiroir|plein;la|boîte|vide;le|placard|mural;le|robinet|extérieur;le|parasol|rayé','avant/preposition le/determinant départ/nom'),
  row('commencer','commence','formation','un|exercice|oral;une|dictée|courte;un|résumé|personnel;une|traduction|simple;un|chapitre|nouveau;un|dialogue|court',school),
  row('terminer','termine','travail','un|rapport|mensuel;un|dossier|urgent;une|commande|importante;un|inventaire|annuel;une|tâche|difficile;un|projet|collectif',office),
  row('continuer','continue','formation','un|exercice|écrit;un|calcul|compliqué;une|lecture|silencieuse;un|résumé|personnel;une|traduction|difficile;un|dialogue|court',school),
  row('répéter','répète','formation','une|question|simple;un|dialogue|court;une|adresse|complète;un|numéro|important;une|définition|précise;une|formule|utile','à/preposition voix/nom haute/adjectif'),
  row('gagner','gagne','sport','une|course|régionale;un|tournoi|local;une|coupe|nationale;une|compétition|amicale;un|trophée|collectif;une|finale|difficile','avec/preposition son/determinant équipe/nom'),
  row('perdre','perd','transport','son|passeport|valide;son|portefeuille|neuf;son|parapluie|pliant;sa|gourde|bleue;son|guide|touristique;sa|valise|rouge',trip),
  row('marquer','marque','sport','un|essai|décisif;un|panier|décisif;des|buts|spectaculaires;des|points|décisifs;un|but|spectaculaire;un|point|supplémentaire','pendant/preposition le/determinant match/nom'),
  row('emprunter','emprunte','loisirs','un|roman|policier;un|magazine|illustré;un|album|illustré;une|revue|culturelle;un|guide|historique;un|recueil|poétique','à/preposition la/determinant bibliothèque/nom'),
  row('prêter','prête','loisirs','un|roman|policier;une|guitare|acoustique;une|caméra|numérique;une|tente|légère;un|jeu|éducatif;un|magazine|illustré','à/preposition un/determinant ami/nom'),
  row('oublier','oublie','travail','un|document|important;une|réunion|prévue;un|horaire|modifié;un|dossier|urgent;une|démarche|nécessaire;une|convocation|officielle',''),
  row('utiliser','utilise','numerique','une|tablette|numérique;une|application|gratuite;un|logiciel|libre;une|imprimante|partagée;un|clavier|virtuel;une|messagerie|sécurisée',office),
  row('partager','partage','relations','un|repas|convivial;une|expérience|personnelle;une|chambre|spacieuse;une|nouvelle|heureuse;un|souvenir|heureux;une|idée|originale','avec/preposition ses/determinant amis/nom'),
  row('planter','plante','nature','un|rosier|blanc;un|pommier|nain;des|tulipes|rouges;des|salades|vertes;un|framboisier|vigoureux;un|arbuste|fleuri',garden),
  row('arroser','arrose','nature','les|tomates|mûres;un|rosier|blanc;les|semis|fragiles;les|salades|vertes;un|arbuste|fleuri;le|potager|familial',garden),
  row('semer','sème','nature','des|radis|roses;des|carottes|précoces;des|haricots|verts;du|persil|frisé;du|gazon|rustique;des|pois|ronds',garden),
  row('envelopper','enveloppe','relations','un|bouquet|parfumé;un|coffret|précieux;une|surprise|fragile;un|bijou|artisanal;une|bougie|parfumée;une|boîte|décorative','dans/preposition du/determinant papier/nom'),
  row('signer','signe','travail','un|contrat|temporaire;une|autorisation|parentale;un|formulaire|officiel;une|attestation|officielle;un|reçu|original;une|pétition|locale','avec/preposition un/determinant stylo/nom'),
  row('souligner','souligne','formation','une|date|importante;une|expression|utile;une|réponse|exacte;un|verbe|irrégulier;une|consigne|essentielle;une|citation|courte','avec/preposition une/determinant règle/nom'),

  row('lire','lit','numerique','un|courriel|récent;un|message|urgent;une|notification|importante;un|article|scientifique;une|publication|récente;une|annonce|officielle',screen),
  row('boire','boit','alimentation','une|tisane|chaude;une|limonade|fraîche;un|chocolat|chaud;un|bouillon|salé;un|smoothie|fruité;une|infusion|parfumée','pendant/preposition la/determinant pause/nom'),
  row('écrire','écrit','travail','un|rapport|détaillé;une|demande|officielle;une|annonce|courte;un|résumé|clair;un|bilan|précis;une|attestation|officielle',office),
  row('ouvrir','ouvre','numerique','un|fichier|récent;une|application|gratuite;un|courriel|important;un|onglet|supplémentaire;un|document|partagé;un|logiciel|libre',screen),
  row('prendre','prend','transport','le|métro|automatique;le|tramway|moderne;une|navette|gratuite;un|autocar|confortable;un|taxi|collectif;un|funiculaire|rouge',trip),
  row('finir','finit','formation','une|dictée|courte;un|résumé|détaillé;une|lecture|silencieuse;un|calcul|compliqué;un|chapitre|difficile;une|traduction|simple',school),
  row('choisir','choisit','travail','un|métier|manuel;une|formation|professionnelle;un|horaire|adapté;un|stage|pratique;une|mission|temporaire;un|projet|collectif','avec/preposition soin/nom'),
  row('voir','voit','nature','un|renard|roux;un|chevreuil|craintif;une|étoile|filante;une|marmotte|curieuse;un|hibou|silencieux;une|biche|attentive','pendant/preposition la/determinant promenade/nom'),
  row('faire','fait','sport','une|randonnée|facile;une|course|rapide;une|promenade|quotidienne;un|exercice|physique;un|parcours|sportif;un|saut|impressionnant','avec/preposition ses/determinant amis/nom'),
  row('mettre','met','vetements','des|baskets|neuves;une|ceinture|noire;une|casquette|verte;des|bottes|fourrées;une|cravate|bleue;une|jupe|longue','avant/preposition le/determinant départ/nom'),
  row('apprendre','apprend','formation','une|langue|étrangère;une|règle|nouvelle;une|comptine|traditionnelle;un|dialogue|court;une|formule|utile;une|définition|précise',school),
  row('comprendre','comprend','formation','un|texte|complexe;un|dialogue|rapide;une|explication|détaillée;une|question|difficile;une|méthode|nouvelle;une|expression|imagée',school),
  row('descendre','descend','transport','une|pente|douce;un|sentier|étroit;une|avenue|animée;un|chemin|caillouteux;une|rampe|inclinée;un|escalier|métallique','avec/preposition prudence/nom'),
  row('attendre','attend','transport','un|taxi|libre;une|navette|gratuite;le|tramway|rouge;un|autocar|scolaire;un|bateau|blanc;un|métro|bondé','à/preposition l’/determinant arrêt/nom'),
  row('vendre','vend','vetements','une|veste|neuve;une|robe|longue;un|manteau|chaud;une|ceinture|large;un|pantalon|bleu;des|bottes|neuves',shop),
  row('dire','dit','relations','un|mensonge|évident;un|compliment|sincère;une|parole|rassurante;un|mot|gentil;une|phrase|encourageante;une|chose|importante','à/preposition son/determinant ami/nom'),
  row('suivre','suit','transport','un|itinéraire|balisé;une|route|sinueuse;une|direction|précise;un|sentier|forestier;un|parcours|indiqué;une|déviation|provisoire','avec/preposition attention/nom'),
  row('vivre','vit','relations','une|rencontre|inoubliable;un|moment|heureux;une|expérience|enrichissante;une|période|difficile;une|journée|exceptionnelle;une|soirée|mémorable','avec/preposition ses/determinant proches/nom'),
  row('conduire','conduit','transport','une|camionnette|électrique;un|minibus|scolaire;un|scooter|électrique;un|camion|frigorifique;un|véhicule|utilitaire;un|autocar|touristique','avec/preposition prudence/nom'),
  row('construire','construit','logement','une|étagère|solide;un|abri|léger;un|garage|spacieux;un|mur|épais;un|banc|rustique;une|cloison|intérieure','avec/preposition les/determinant outils/nom'),
  row('peindre','peint','loisirs','un|portrait|expressif;une|miniature|colorée;un|paysage|marin;une|fresque|colorée;une|toile|abstraite;une|aquarelle|délicate','dans/preposition l’/determinant atelier/nom'),
  row('cueillir','cueille','nature','des|framboises|mûres;des|fraises|rouges;des|mûres|noires;des|prunes|jaunes;des|abricots|mûrs;des|noisettes|mûres',garden),
  row('offrir','offre','relations','un|bouquet|parfumé;un|bijou|artisanal;un|coffret|gourmand;un|parfum|léger;un|spectacle|amusant;une|invitation|personnelle','pour/preposition un/determinant anniversaire/nom'),
  row('couvrir','couvre','logement','le|plat|chaud;la|casserole|pleine;le|canapé|ancien;le|fauteuil|fragile;les|meubles|anciens;le|lit|simple','avec/preposition un/determinant tissu/nom'),
  row('découvrir','découvre','transport','une|ville|médiévale;un|village|pittoresque;un|monument|historique;un|château|ancien;un|quartier|animé;une|île|volcanique',trip),
  row('tenir','tient','logement','un|plateau|plein;une|tasse|chaude;une|échelle|stable;un|sac|lourd;une|boîte|fragile;un|vase|ancien','avec/preposition précaution/nom'),
  row('sentir','sent','alimentation','une|orange|fraîche;un|citron|coupé;une|épice|douce;une|soupe|chaude;un|biscuit|chaud;un|gâteau|chaud',kitchen),
  row('servir','sert','alimentation','un|bouillon|chaud;une|quiche|salée;une|compote|tiède;un|gratin|doré;une|tisane|parfumée;une|crème|froide','pendant/preposition le/determinant repas/nom'),
  row('connaître','connaît','travail','le|règlement|intérieur;les|horaires|habituels;une|procédure|simple;un|métier|manuel;une|entreprise|locale;un|collègue|expérimenté',''),
  row('vouloir','veut','vetements','un|pantalon|confortable;une|veste|imperméable;un|manteau|chaud;des|chaussures|plates;un|sac|léger;une|écharpe|douce',''),
  row('recevoir','reçoit','travail','une|convocation|officielle;une|réponse|positive;une|facture|détaillée;une|attestation|officielle;un|devis|gratuit;une|confirmation|écrite',office),
  row('battre','bat','sport','son|record|personnel;une|équipe|adverse;un|adversaire|redoutable;un|record|régional;un|record|national;un|rival|expérimenté','pendant/preposition la/determinant compétition/nom'),
  row('éteindre','éteint','logement','le|chauffage|électrique;le|four|chaud;une|bougie|parfumée;la|radio|allumée;le|réchaud|portable;une|lanterne|rouge','avant/preposition le/determinant départ/nom'),
  row('traduire','traduit','formation','une|consigne|simple;un|dialogue|court;un|article|scientifique;une|annonce|officielle;un|message|personnel;une|expression|courante','avec/preposition un/determinant dictionnaire/nom'),
  row('coudre','coud','vetements','une|jupe|longue;une|poche|intérieure;un|tablier|propre;un|rideau|léger;une|nappe|blanche;une|étiquette|brodée','avec/preposition une/determinant aiguille/nom'),
  row('joindre','joint','travail','une|attestation|officielle;un|justificatif|récent;une|facture|originale;un|certificat|médical;une|photocopie|lisible;un|devis|signé','à/preposition son/determinant dossier/nom'),
  row('atteindre','atteint','sport','la|ligne|finale;un|objectif|personnel;une|vitesse|élevée;une|distance|importante;un|niveau|supérieur;un|score|élevé','pendant/preposition l’/determinant entraînement/nom'),
  row('résoudre','résout','formation','une|équation|complexe;une|devinette|amusante;un|exercice|difficile;un|sudoku|complexe;un|rébus|facile;un|problème|logique',school),

  // The second group now covers practical verbs beyond finir and choisir.
  row('remplir','remplit','travail','un|formulaire|officiel;un|dossier|complet;un|questionnaire|anonyme;une|fiche|administrative;une|demande|officielle;un|tableau|mensuel',office),
  row('réussir','réussit','formation','un|examen|oral;un|exercice|difficile;une|dictée|courte;un|calcul|compliqué;un|test|pratique;une|présentation|orale',school),
  row('nourrir','nourrit','nature','les|oiseaux|sauvages;un|chaton|orphelin;un|chiot|affamé;des|poules|rousses;un|poney|docile;un|lapin|blanc','à/preposition la/determinant ferme/nom'),
  row('applaudir','applaudit','loisirs','un|artiste|talentueux;une|chanteuse|célèbre;un|spectacle|réussi;une|danseuse|étoile;un|orchestre|symphonique;un|comédien|drôle','après/preposition le/determinant spectacle/nom'),
  row('réunir','réunit','travail','les|documents|nécessaires;les|pièces|justificatives;les|participants|inscrits;les|collègues|disponibles;les|dossiers|urgents;les|candidats|retenus',office),
  row('rafraîchir','rafraîchit','alimentation','une|boisson|gazeuse;une|salade|verte;une|limonade|maison;un|jus|fruité;une|compote|maison;un|melon|mûr','dans/preposition le/determinant réfrigérateur/nom'),
  row('salir','salit','vetements','son|pantalon|clair;sa|chemise|blanche;ses|chaussettes|neuves;sa|jupe|claire;son|tablier|propre;ses|baskets|blanches','dans/preposition la/determinant boue/nom'),
  row('agrandir','agrandit','logement','la|maison|familiale;la|cuisine|ancienne;le|salon|commun;une|fenêtre|étroite;le|garage|privé;la|terrasse|couverte','pendant/preposition les/determinant travaux/nom'),
  row('assouplir','assouplit','sport','ses|muscles|raides;ses|épaules|tendues;ses|chevilles|raides;ses|poignets|raides;ses|articulations|douloureuses;son|dos|tendu',sport),
  // Extra contexts give IR verbs useful alternatives in every setting.
  row('choisir','choisit','alimentation','un|menu|végétarien;un|dessert|fruité;une|boisson|fraîche;une|entrée|froide;un|plat|régional;une|soupe|chaude','au/preposition restaurant/nom'),
  row('finir','finit','alimentation','son|repas|chaud;sa|soupe|chaude;son|dessert|fruité;son|sandwich|frais;sa|compote|tiède;son|petit-déjeuner|copieux','avant/preposition le/determinant départ/nom'),
  row('choisir','choisit','nature','une|plante|locale;un|arbuste|fleuri;des|graines|biologiques;un|rosier|blanc;des|fleurs|sauvages;un|pommier|nain','à/preposition la/determinant pépinière/nom'),
  row('réunir','réunit','nature','des|branches|sèches;des|graines|mûres;des|feuilles|mortes;des|pierres|plates;des|brindilles|sèches;des|cailloux|ronds',garden),
  row('choisir','choisit','loisirs','un|spectacle|comique;un|concert|gratuit;un|roman|policier;une|pièce|classique;une|exposition|temporaire;une|activité|créative','avec/preposition ses/determinant amis/nom'),
  row('choisir','choisit','transport','un|itinéraire|balisé;une|destination|proche;un|hébergement|confortable;une|excursion|guidée;une|correspondance|pratique;une|place|libre','avant/preposition le/determinant voyage/nom'),
  row('réunir','réunit','transport','les|bagages|enregistrés;les|voyageurs|inscrits;les|billets|réservés;les|passeports|valides;les|cartes|routières;les|guides|touristiques','avant/preposition le/determinant départ/nom'),
  row('choisir','choisit','logement','une|lampe|neuve;une|table|ronde;un|canapé|confortable;un|tapis|épais;un|fauteuil|moelleux;un|rideau|clair',shop),
  row('choisir','choisit','sante','un|savon|doux;une|crème|hydratante;un|shampoing|doux;un|pansement|imperméable;un|dentifrice|fluoré;une|lotion|apaisante','à/preposition la/determinant pharmacie/nom'),
  row('choisir','choisit','relations','un|cadeau|personnel;une|surprise|amusante;une|invitation|originale;un|bouquet|parfumé;une|carte|personnalisée;un|souvenir|précieux','pour/preposition son/determinant ami/nom'),
  row('réunir','réunit','relations','ses|amis|proches;ses|cousins|éloignés;ses|voisins|sympathiques;ses|parents|âgés;ses|proches|disponibles;des|invités|enthousiastes',party),
  row('choisir','choisit','numerique','un|logiciel|libre;une|application|gratuite;un|clavier|ergonomique;une|tablette|numérique;une|imprimante|partagée;un|ordinateur|portable',shop),
  row('agrandir','agrandit','numerique','une|photo|numérique;une|image|floue;une|icône|ronde;un|texte|illisible;un|tableau|détaillé;une|carte|interactive',screen),
  row('choisir','choisit','sport','un|parcours|balisé;un|entraînement|adapté;un|exercice|adapté;un|ballon|léger;une|raquette|légère;un|vélo|neuf','avec/preposition son/determinant entraîneur/nom'),
]

export type ReviewedPredicate = { id: string; pred: string; domain: PhraseDomain }
const nounDomains = new Map<string, PhraseDomain>()
const exactDomains = new Map<string, PhraseDomain>()
const verbDomains = new Map<string, PhraseDomain>()
const key = (id: string, pred: string) => `${id}:${pred}`
const objects = (source: string) => source.split(';').map(encoded => {
  const [article, noun, adjective] = encoded.split('|')
  if (!article || !noun || !adjective) throw new Error(`Objet incomplet : ${encoded}`)
  return { noun, plain: `${article}/determinant ${noun}/nom`, adjective }
})

function compile(kind: 'simple' | 'adjectif' | 'preposition' | 'both'): ReviewedPredicate[] {
  const entries = ROWS.flatMap(({ id, core, domain, objects: source, place }) => {
    if (!verbDomains.has(id)) verbDomains.set(id,domain)
    if ((kind === 'preposition' || kind === 'both') && !place) return []
    return objects(source).map(({ noun, plain, adjective }) => {
      const pred = `${core}/verbe ${plain}${kind === 'adjectif' || kind === 'both' ? ` ${adjective}/adjectif` : ''}${kind === 'preposition' || kind === 'both' ? ` ${place}` : ''}`
      nounDomains.set(noun, nounDomains.get(noun) ?? domain)
      exactDomains.set(key(id, pred), domain)
      return { id, pred, domain }
    })
  })
  return [...new Map(entries.map(entry => [key(entry.id,entry.pred),entry])).values()]
}
export const REVIEWED_SIMPLE = compile('simple')
export const REVIEWED_ADJECTIVES = compile('adjectif')
export const REVIEWED_PREPOSITIONS = compile('preposition')
export const REVIEWED_ADJECTIVE_PREPOSITIONS = compile('both')
for (const { id, domain, preds } of REVIEWED_REFLEXIVES) {
  verbDomains.set(id,domain)
  for (const pred of preds) exactDomains.set(key(id, pred), domain)
}

const LEGACY_NOUN_DOMAINS: Partial<Record<PhraseDomain, string>> = {
  alimentation: 'pomme pommes soupe pain farine œufs confiture beurre lait paprika chocolat salade fromage tarte yaourt steak dîner petit-déjeuner riz pâtes tomate brocoli champignon courgette betterave nourriture',
  logement: 'maison appartement chambre salon table fenêtre porte fauteuil banc placard cave buanderie linge vaisselle vitre sol bouilloire casserole assiette serviette verre rideau lit miroir cheminée couverture pot canapé coussin lampe clé clés bruit froid',
  vetements: 'manteau chapeau écharpe pull bague chemise montre veste gants jupe robe pantalon bottes chaussures vêtement vêtements pyjama',
  formation: 'école classe élève élèves maître maîtresse leçon tables poème mot mots français maths biologie lecture stylo colle gomme feuille cahier devoir texte phrase exercice consigne explication règle calcul réponse test tentative cours récréation contrôle grammaire page pages',
  travail: 'bureau collègues collègue travail horaires accueil secrétariat mairie réunion dossier document documents facture loyer note rendez-vous guichet',
  transport: 'rue pont route gare douane chemin sentier piste trajet billet billets ticket abonnement passeport visa bagage bagages valise réservation bateau voyage train bus voiture camion autocar aéroport quai station départ itinéraire vacances',
  sante: 'mains visage cheveux bras pieds cou jambes nuque dents ongles barbe frange boucles menton joues moustache crâne dos yeux oreilles tête peau lèvres paupières doigts poignets savon crème peigne rasoir médicaments médecin santé repos douche bain sommeil réveil sieste',
  relations: 'ami amis amie amies frère sœur voisin voisine voisins maman papa parents cousine cousin famille enfants bébé copain copine facteur chauffeur anniversaire mariage victoire naissance retrouvailles proches fête cadeau secret',
  loisirs: 'film films chanson musique radio concert théâtre spectacle danse berceuse refrain valse salsa ballet tableau musée photo photographie dessin mandala roman livre livres journal histoire conte blague rêve jeu puzzle trésor',
  nature: 'arbre arbres plante plantes jardin fleurs fleur forêt lac rivière mer paysage campagne cascade colline côte grotte parc montagne plage soleil pluie vent île ferme chat chien lapin oiseau oiseaux insecte étoiles graines herbe papillon cailloux feuilles fontaine rivage',
  numerique: 'ordinateur tablette clavier logiciel fichier application courriel messagerie imprimante écran télé',
  sport: 'sport ballon balle balles frisbee stade piscine terrain course match compétition randonnée marche tournoi équipe raquette haltère',
}
for (const [domain, nouns] of Object.entries(LEGACY_NOUN_DOMAINS)) {
  for (const noun of nouns.split(' ')) nounDomains.set(noun, nounDomains.get(noun) ?? domain as PhraseDomain)
}

export function reviewedFrames(kind: 'simple' | 'adjectif' | 'preposition') {
  const entries = kind === 'simple' ? REVIEWED_SIMPLE : kind === 'adjectif' ? REVIEWED_ADJECTIVES : REVIEWED_PREPOSITIONS
  const frames = new Map<string, string[]>()
  for (const { id, pred } of entries) {
    const preds = frames.get(id) ?? []
    if (!preds.includes(pred)) preds.push(pred)
    frames.set(id, preds)
  }
  return [...frames].map(([id, preds]) => ({ id, preds }))
}

/** Merge by infinitive, retaining each genuinely distinct complete predicate once. */
export function mergeReviewedFrames(base: readonly ThemedFrame[], extra: readonly ThemedFrame[]): ThemedFrame[] {
  const frames = new Map(base.map(frame => [frame.id, frame]))
  for (const frame of extra) {
    const previous = frames.get(frame.id)
    frames.set(frame.id, { ...previous, ...frame, preds: [...new Set([...(previous?.preds ?? []), ...frame.preds])] })
  }
  return [...frames.values()]
}

/** The first object/location anchors old predicates to a practical setting. */
export function predicateDomain(id: string, pred: string): PhraseDomain | undefined {
  const plain = pred.split(' ').filter(part => !/\/(?:adverbe|adjectif)$/.test(part)).join(' ')
  const exact = exactDomains.get(key(id, pred)) ?? exactDomains.get(key(id, plain))
  if (exact) return exact
  for (const part of plain.split(' ')) {
    if (!part.endsWith('/nom')) continue
    const domain = nounDomains.get(part.slice(0, -4))
    if (domain) return domain
  }
  return verbDomains.get(id)
}
