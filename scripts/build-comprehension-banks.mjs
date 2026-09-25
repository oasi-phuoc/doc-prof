/** Build comprehension-ecrite-banks.ts from embedded doc data + validate. */
import { writeFileSync } from 'fs'

const docs = [
  // === A1 (20) ===
  {
    id: 'ce-a1-01',
    level: 'a1',
    format: 'sms',
    theme: 'fr-journee',
    title: 'SMS de Marc',
    text: `Salut Léa ! C'est Marc. Je suis au parc de Martigny avec des amis. Le soleil brille. Je mange une glace. Je rentre à la maison à dix-sept heures. À ce soir. Marc.`,
    questions: [
      { prompt: 'Où est Marc ?', options: ['À Lausanne', 'Au parc de Martigny', 'À l\'école'], answer: 'Au parc de Martigny' },
      { prompt: 'Quelle heure pour rentrer ?', options: ['Dix-sept heures', 'Huit heures', 'Midi'], answer: 'Dix-sept heures' },
      { prompt: 'Qu\'est-ce que Marc mange ?', options: ['Une glace', 'Une pizza', 'Un sandwich'], answer: 'Une glace' },
      { prompt: 'Comment est le temps ?', options: ['Il pleut', 'Le soleil brille', 'Il neige'], answer: 'Le soleil brille' },
    ],
  },
  {
    id: 'ce-a1-02',
    level: 'a1',
    format: 'affiche',
    theme: 'fr-nourriture',
    title: 'Affiche — marché',
    text: `Marché de Sion — samedi matin. Stand de fruits : pommes, poires, fraises. Stand de pain : baguettes chaudes. Café gratuit pour les enfants. Entrée libre. Le marché est place du Midi.`,
    questions: [
      { prompt: 'Quand a lieu le marché ?', options: ['Samedi matin', 'Lundi soir', 'Mercredi'], answer: 'Samedi matin' },
      { prompt: 'Où est le marché ?', options: ['Place du Midi', 'Gare de Sion', 'Au lac'], answer: 'Place du Midi' },
      { prompt: 'Qu\'offre le stand de pain ?', options: ['Baguettes chaudes', 'Gâteaux', 'Fromage'], answer: 'Baguettes chaudes' },
      { prompt: 'Qui a un café gratuit ?', options: ['Les enfants', 'Les professeurs', 'Tout le monde'], answer: 'Les enfants' },
    ],
  },
  {
    id: 'ce-a1-03',
    level: 'a1',
    format: 'annonce',
    theme: 'fr-transports',
    title: 'Annonce — bus',
    text: `Bus ligne 5 : arrêt Hôpital fermé lundi. Le bus passe par la gare de Fribourg. Prochain arrêt : université. Départ toutes les quinze minutes. Billet : deux francs cinquante.`,
    questions: [
      { prompt: 'Quel arrêt est fermé lundi ?', options: ['Hôpital', 'Gare', 'Université'], answer: 'Hôpital' },
      { prompt: 'Où passe le bus ?', options: ['Par la gare de Fribourg', 'Par le lac', 'Par l\'aéroport'], answer: 'Par la gare de Fribourg' },
      { prompt: 'Combien coûte le billet ?', options: ['Deux francs cinquante', 'Cinq francs', 'Un franc'], answer: 'Deux francs cinquante' },
      { prompt: 'À quelle fréquence part le bus ?', options: ['Toutes les quinze minutes', 'Une fois par jour', 'Toutes les heures'], answer: 'Toutes les quinze minutes' },
    ],
  },
  {
    id: 'ce-a1-04',
    level: 'a1',
    format: 'message',
    theme: 'fr-famille',
    title: 'Note sur la porte',
    text: `Chère maman, je suis chez grand-mère à Conthey. Nous regardons la télé. Le dîner est à dix-neuf heures. Je rentre avec papa en voiture. Bisous, Nina.`,
    questions: [
      { prompt: 'Où est Nina ?', options: ['Chez grand-mère à Conthey', 'À l\'école', 'Au cinéma'], answer: 'Chez grand-mère à Conthey' },
      { prompt: 'À quelle heure est le dîner ?', options: ['Dix-neuf heures', 'Midi', 'Huit heures'], answer: 'Dix-neuf heures' },
      { prompt: 'Comment Nina rentre ?', options: ['En voiture avec papa', 'En bus', 'À pied'], answer: 'En voiture avec papa' },
      { prompt: 'Qu\'est-ce que Nina et grand-mère font ?', options: ['Regardent la télé', 'Cuisinent', 'Dorm'], answer: 'Regardent la télé' },
    ],
  },
  {
    id: 'ce-a1-05',
    level: 'a1',
    format: 'narratif',
    theme: 'fr-loisirs',
    title: 'Samuel au cinéma',
    text: `Samuel habite à Lausanne. Samedi, Samuel va au cinéma. Samuel achète un billet. Samuel regarde un film sur les animaux. Samuel boit un jus d\'orange. Samuel rentre content.`,
    questions: [
      { prompt: 'Où habite Samuel ?', options: ['À Lausanne', 'À Genève', 'À Berne'], answer: 'À Lausanne' },
      { prompt: 'Quand Samuel va au cinéma ?', options: ['Samedi', 'Lundi', 'Mercredi'], answer: 'Samedi' },
      { prompt: 'Sur quoi est le film ?', options: ['Sur les animaux', 'Sur le foot', 'Sur la cuisine'], answer: 'Sur les animaux' },
      { prompt: 'Qu\'est-ce que Samuel boit ?', options: ['Un jus d\'orange', 'Du café', 'De l\'eau'], answer: 'Un jus d\'orange' },
    ],
  },
  {
    id: 'ce-a1-06',
    level: 'a1',
    format: 'fiche',
    theme: 'fr-logement',
    title: 'Fiche appartement',
    text: `Appartement à Martigny : deux chambres, une cuisine, un salon. Loyer : mille deux cents francs par mois. Chauffage inclus. Animaux non acceptés. Visite mercredi à quatorze heures.`,
    questions: [
      { prompt: 'Combien de chambres ?', options: ['Deux chambres', 'Une chambre', 'Trois chambres'], answer: 'Deux chambres' },
      { prompt: 'Quel est le loyer ?', options: ['Mille deux cents francs par mois', 'Cinq cents francs', 'Deux mille francs'], answer: 'Mille deux cents francs par mois' },
      { prompt: 'Les animaux sont-ils acceptés ?', options: ['Animaux non acceptés', 'Oui, tous', 'Chiens seulement'], answer: 'Animaux non acceptés' },
      { prompt: 'Quand est la visite ?', options: ['Mercredi à quatorze heures', 'Lundi matin', 'Vendredi soir'], answer: 'Mercredi à quatorze heures' },
    ],
  },
  {
    id: 'ce-a1-07',
    level: 'a1',
    format: 'carte-postale',
    theme: 'fr-sante',
    title: 'Carte de Yasmine',
    text: `Bonjour papa et maman ! Je suis à la clinique de Sion pour un petit examen. Les infirmières sont gentilles. Je lis un livre. Je rentre demain après-midi. Gros bisous, Yasmine.`,
    questions: [
      { prompt: 'Où est Yasmine ?', options: ['À la clinique de Sion', 'À l\'école', 'À la plage'], answer: 'À la clinique de Sion' },
      { prompt: 'Pourquoi Yasmine est à la clinique ?', options: ['Pour un petit examen', 'Pour une fête', 'Pour le sport'], answer: 'Pour un petit examen' },
      { prompt: 'Qu\'est-ce que Yasmine lit ?', options: ['Un livre', 'Un journal', 'Une carte'], answer: 'Un livre' },
      { prompt: 'Quand Yasmine rentre ?', options: ['Demain après-midi', 'Ce soir', 'La semaine prochaine'], answer: 'Demain après-midi' },
    ],
  },
  {
    id: 'ce-a1-08',
    level: 'a1',
    format: 'sms',
    theme: 'fr-vetements',
    title: 'SMS boutique',
    text: `Bonjour Clara. Votre manteau bleu est prêt chez Couture Plus à Fribourg. Retrait mardi à dix heures. Apportez ce SMS. Merci. La boutique Couture Plus.`,
    questions: [
      { prompt: 'Quel vêtement est prêt ?', options: ['Manteau bleu', 'Pantalon noir', 'Robe rouge'], answer: 'Manteau bleu' },
      { prompt: 'Où est la boutique ?', options: ['À Fribourg', 'À Zurich', 'À Sion'], answer: 'À Fribourg' },
      { prompt: 'Quand retirer le manteau ?', options: ['Mardi à dix heures', 'Samedi', 'Ce soir'], answer: 'Mardi à dix heures' },
      { prompt: 'Qu\'apporter au retrait ?', options: ['Ce SMS', 'De l\'argent seulement', 'Un passeport'], answer: 'Ce SMS' },
    ],
  },
  {
    id: 'ce-a1-09',
    level: 'a1',
    format: 'affiche',
    theme: 'fr-achats',
    title: 'Soldes en magasin',
    text: `Magasin Économie à Vevey : soldes d\'été. T-shirts à dix francs. Chaussures à trente francs. Ouvert lundi au samedi. Fermé le dimanche. Entrée rue du Lac.`,
    questions: [
      { prompt: 'Où est le magasin ?', options: ['À Vevey', 'À Berne', 'À Neuchâtel'], answer: 'À Vevey' },
      { prompt: 'Prix des t-shirts ?', options: ['Dix francs', 'Cinquante francs', 'Vingt francs'], answer: 'Dix francs' },
      { prompt: 'Quel jour le magasin est fermé ?', options: ['Le dimanche', 'Le lundi', 'Le samedi'], answer: 'Le dimanche' },
      { prompt: 'Prix des chaussures ?', options: ['Trente francs', 'Dix francs', 'Cent francs'], answer: 'Trente francs' },
    ],
  },
  {
    id: 'ce-a1-10',
    level: 'a1',
    format: 'message',
    theme: 'fr-inviter',
    title: 'Invitation sur le frigo',
    text: `Les voisins : fête d\'été samedi à dix-huit heures dans le jardin. Apportez une boisson. Musique et jeux pour les enfants. Répondez à Paul ou Anne. Adresse : rue des Lilas 4, Sierre.`,
    questions: [
      { prompt: 'Quand est la fête ?', options: ['Samedi à dix-huit heures', 'Vendredi midi', 'Dimanche matin'], answer: 'Samedi à dix-huit heures' },
      { prompt: 'Où est la fête ?', options: ['Dans le jardin', 'Au restaurant', 'À l\'école'], answer: 'Dans le jardin' },
      { prompt: 'Qu\'apporter ?', options: ['Une boisson', 'Un gâteau obligatoire', 'Rien'], answer: 'Une boisson' },
      { prompt: 'Dans quelle ville ?', options: ['Sierre', 'Genève', 'Bâle'], answer: 'Sierre' },
    ],
  },
  {
    id: 'ce-a1-11',
    level: 'a1',
    format: 'annonce',
    theme: 'fr-travail',
    title: 'Petite annonce emploi',
    text: `Café du Centre à Monthey cherche serveur ou serveuse. Horaires : mardi à samedi, huit à seize heures. Téléphone : zéro vingt-sept quatre cent douze. Début le premier mars.`,
    questions: [
      { prompt: 'Quel métier ?', options: ['Serveur ou serveuse', 'Professeur', 'Médecin'], answer: 'Serveur ou serveuse' },
      { prompt: 'Où est le café ?', options: ['À Monthey', 'À Lausanne', 'À Nyon'], answer: 'À Monthey' },
      { prompt: 'Quels horaires ?', options: ['Mardi à samedi, huit à seize heures', 'Lundi seulement', 'Nuit'], answer: 'Mardi à samedi, huit à seize heures' },
      { prompt: 'Quand commence le travail ?', options: ['Le premier mars', 'Demain', 'En décembre'], answer: 'Le premier mars' },
    ],
  },
  {
    id: 'ce-a1-12',
    level: 'a1',
    format: 'narratif',
    theme: 'fr-description',
    title: 'Le chat de Julie',
    text: `Julie a un chat noir. Le chat de Julie s\'appelle Minou. Minou a les yeux verts. Minou dort sur le canapé. Julie donne à manger à Minou le matin. Julie aime Minou.`,
    questions: [
      { prompt: 'De quelle couleur est le chat ?', options: ['Noir', 'Blanc', 'Gris'], answer: 'Noir' },
      { prompt: 'Comment s\'appelle le chat ?', options: ['Minou', 'Felix', 'Tom'], answer: 'Minou' },
      { prompt: 'Où Minou dort ?', options: ['Sur le canapé', 'Dans le jardin', 'Sous la table'], answer: 'Sur le canapé' },
      { prompt: 'Quand Julie donne à manger ?', options: ['Le matin', 'La nuit', 'Jamais'], answer: 'Le matin' },
    ],
  },
  {
    id: 'ce-a1-13',
    level: 'a1',
    format: 'fiche',
    theme: 'fr-presenter',
    title: 'Fiche élève',
    text: `Nom : Thomas Keller. Âge : vingt ans. Ville : Yverdon. Langues : français et allemand. Études : école de commerce. Sport préféré : natation. Email : thomas.keller@mail.ch.`,
    questions: [
      { prompt: 'Quel est le nom ?', options: ['Thomas Keller', 'Paul Martin', 'Luc Dubois'], answer: 'Thomas Keller' },
      { prompt: 'Quelle ville ?', options: ['Yverdon', 'Zurich', 'Lugano'], answer: 'Yverdon' },
      { prompt: 'Quel sport préféré ?', options: ['Natation', 'Football', 'Ski'], answer: 'Natation' },
      { prompt: 'Quelles langues ?', options: ['Français et allemand', 'Italien seulement', 'Anglais seulement'], answer: 'Français et allemand' },
    ],
  },
  {
    id: 'ce-a1-14',
    level: 'a1',
    format: 'sms',
    theme: 'fr-famille',
    title: 'SMS du père',
    text: `Bonjour Emma. Papa est en retard au travail. Grand-père t\'attend à la gare de Nyon à seize heures. Prends le bus numéro trois. Bisous. Papa.`,
    questions: [
      { prompt: 'Qui attend Emma ?', options: ['Grand-père', 'Maman', 'La prof'], answer: 'Grand-père' },
      { prompt: 'Où est le rendez-vous ?', options: ['Gare de Nyon', 'École', 'Maison'], answer: 'Gare de Nyon' },
      { prompt: 'Quel bus prendre ?', options: ['Numéro trois', 'Numéro dix', 'Numéro un'], answer: 'Numéro trois' },
      { prompt: 'Pourquoi papa écrit ?', options: ['Papa est en retard au travail', 'Papa est malade', 'Papa part en voyage'], answer: 'Papa est en retard au travail' },
    ],
  },
  {
    id: 'ce-a1-15',
    level: 'a1',
    format: 'narratif',
    theme: 'fr-nourriture',
    title: 'Lina au restaurant',
    text: `Lina entre au restaurant « Le Sapin » à Sion. Lina commande une salade et de l\'eau. Le serveur apporte le plat. Lina mange avec appétit. Lina paie quinze francs. Lina dit merci.`,
    questions: [
      { prompt: 'Nom du restaurant ?', options: ['Le Sapin', 'Le Lac', 'Le Soleil'], answer: 'Le Sapin' },
      { prompt: 'Qu\'est-ce que Lina commande ?', options: ['Une salade et de l\'eau', 'Une pizza', 'Un café'], answer: 'Une salade et de l\'eau' },
      { prompt: 'Combien Lina paie ?', options: ['Quinze francs', 'Cinq francs', 'Cinquante francs'], answer: 'Quinze francs' },
      { prompt: 'Où est le restaurant ?', options: ['À Sion', 'À Fribourg', 'À Martigny'], answer: 'À Sion' },
    ],
  },
  {
    id: 'ce-a1-16',
    level: 'a1',
    format: 'carte-postale',
    theme: 'fr-transports',
    title: 'Carte de voyage',
    text: `Coucou les amis ! Je suis dans le train pour Lausanne. Le lac est très beau. J\'arrive à quinze heures trente. On se voit à la gare ? Bises, Hugo.`,
    questions: [
      { prompt: 'Où va Hugo ?', options: ['Lausanne', 'Genève', 'Berne'], answer: 'Lausanne' },
      { prompt: 'Dans quoi Hugo voyage ?', options: ['Dans le train', 'En avion', 'En bateau'], answer: 'Dans le train' },
      { prompt: 'À quelle heure Hugo arrive ?', options: ['Quinze heures trente', 'Huit heures', 'Vingt heures'], answer: 'Quinze heures trente' },
      { prompt: 'Qu\'est-ce qui est beau ?', options: ['Le lac', 'La montagne', 'La ville'], answer: 'Le lac' },
    ],
  },
  {
    id: 'ce-a1-17',
    level: 'a1',
    format: 'affiche',
    theme: 'fr-loisirs',
    title: 'Cours de dessin',
    text: `Atelier dessin pour enfants — bibliothèque de Payerne. Mercredis quinze heures à seize heures trente. Matériel fourni. Inscription à l\'accueil. Gratuit pour les résidents.`,
    questions: [
      { prompt: 'Où a lieu l\'atelier ?', options: ['Bibliothèque de Payerne', 'Stade', 'Piscine'], answer: 'Bibliothèque de Payerne' },
      { prompt: 'Quel jour ?', options: ['Mercredis', 'Lundis', 'Vendredis'], answer: 'Mercredis' },
      { prompt: 'Le matériel est-il fourni ?', options: ['Matériel fourni', 'Non, tout acheter', 'Seulement les crayons'], answer: 'Matériel fourni' },
      { prompt: 'C\'est gratuit pour qui ?', options: ['Les résidents', 'Touristes seulement', 'Personne'], answer: 'Les résidents' },
    ],
  },
  {
    id: 'ce-a1-18',
    level: 'a1',
    format: 'message',
    theme: 'fr-logement',
    title: 'Consignes locataire',
    text: `Chers locataires : réunion dans la salle commune jeudi à dix-neuf heures. Sujet : chauffage et recyclage. Merci de venir avec votre carnet de loyer. Le régisseur, M. Frei.`,
    questions: [
      { prompt: 'Quand est la réunion ?', options: ['Jeudi à dix-neuf heures', 'Mardi midi', 'Dimanche'], answer: 'Jeudi à dix-neuf heures' },
      { prompt: 'Où est la réunion ?', options: ['Salle commune', 'Dans la rue', 'À la mairie'], answer: 'Salle commune' },
      { prompt: 'Quels sujets ?', options: ['Chauffage et recyclage', 'Vacances', 'Sport'], answer: 'Chauffage et recyclage' },
      { prompt: 'Qu\'apporter ?', options: ['Carnet de loyer', 'Un gâteau', 'Des chaussures'], answer: 'Carnet de loyer' },
    ],
  },
  {
    id: 'ce-a1-19',
    level: 'a1',
    format: 'annonce',
    theme: 'fr-inviter',
    title: 'Soirée jeux',
    text: `Club « Échecs et compagnie » à Fribourg : soirée jeux vendredi vingt heures. Tout public. Thé et biscuits offerts. Entrée : cinq francs. Rue de Lausanne 12.`,
    questions: [
      { prompt: 'Quel jour la soirée ?', options: ['Vendredi', 'Mardi', 'Jeudi'], answer: 'Vendredi' },
      { prompt: 'À quelle heure ?', options: ['Vingt heures', 'Midi', 'Huit heures du matin'], answer: 'Vingt heures' },
      { prompt: 'Qu\'est-ce qui est offert ?', options: ['Thé et biscuits', 'Pizza', 'Vin'], answer: 'Thé et biscuits' },
      { prompt: 'Prix d\'entrée ?', options: ['Cinq francs', 'Gratuit', 'Vingt francs'], answer: 'Cinq francs' },
    ],
  },
  {
    id: 'ce-a1-20',
    level: 'a1',
    format: 'dialogue-ecrit',
    theme: 'fr-sante',
    title: 'Dialogue à la pharmacie',
    text: `Client : Bonjour, j\'ai mal à la tête.\nPharmacienne : Bonjour. Voici du paracétamol.\nClient : Merci. Je prends deux comprimés ?\nPharmacienne : Oui, matin et soir.\nClient : Merci. Au revoir.`,
    questions: [
      { prompt: 'Qu\'a le client ?', options: ['Mal à la tête', 'Mal au pied', 'Fièvre forte'], answer: 'Mal à la tête' },
      { prompt: 'Qu\'est-ce que la pharmacienne donne ?', options: ['Du paracétamol', 'Des vitamines', 'Un sirop'], answer: 'Du paracétamol' },
      { prompt: 'Combien de comprimés ?', options: ['Deux comprimés', 'Un comprimé', 'Cinq comprimés'], answer: 'Deux comprimés' },
      { prompt: 'Quand les prendre ?', options: ['Matin et soir', 'À midi seulement', 'La nuit'], answer: 'Matin et soir' },
    ],
  },
]

// Continue with A2 and B1 in part 2 - script will be extended
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

const limits = { a1: [30, 60], a2: [60, 120], b1: [120, 250] }
let errors = []
for (const d of docs) {
  const w = countWords(d.text.replace(/\\n/g, ' '))
  const [min, max] = limits[d.level]
  if (w < min || w > max) errors.push(`${d.id}: ${w} words (${min}-${max})`)
  if (d.questions.length !== 4) errors.push(`${d.id}: ${d.questions.length} questions`)
}
console.log('A1 count:', docs.filter((d) => d.level === 'a1').length)
console.log(errors.length ? errors.join('\n') : 'A1 OK')
for (const d of docs) console.log(d.id, countWords(d.text.replace(/\\n/g, ' ')))
