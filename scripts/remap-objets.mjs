#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), 'public/lib/images/vocabulaire')
const SRC = join(DIR, 'objets')

const MAP = {
  nourriture: `abricot ananas artichaut asperge aubergine basilic beignet betterave beurre biscuit boisson bonbon brocoli brownie cassis celeri cerise champignon chips chocolat chocolat-chaud citron citronnade citrouille coing concombre confiture cookie coriandre courgette crepe crevette croissant cupcake datte dinde donut echalote epinard farine fenouil figue flan fraise framboise frites gauffre gaufre goyave gratin hamburger haricot homard huile huitre infusion jus kiwi lait lentille limonade litchi macaron madeleine mandarine mangue mayonnaise melon miel milkshake mille-feuille muffin mure myrtille navet nectarine noisette noix noix-de-coco oeuf oignon olive pamplemousse papaye pasteque peche persil petit-pois piment pizza pois-chiche poivron potiron prune radis raisin romarin sandwich smoothie soda soja sucette thym tiramisu tisane vanille wasabi wrap yaourt wok beurre bocal bouteille marmite`.split(/\s+/),
  animaux: `aigle araignee autruche baleine cameleon canard canari cerf chenille chevre chrysalide cigogne cobra coccinelle cochon colibri colombe coq coyote crabe crapaud criquet crocodile cygne dauphin dodo ecureuil elephant escargot faucon fourmi gazelle gecko girafe gorille grenouille guepe hanneton herisson hibou hippocampe hirondelle hyene ibis iguane kangourou koala lezard libellule limace loup luciole lynx mante-religieuse meduse mesange morse mouche mouette moustique mygale oie oryx otarie panda paon pelican perdrix perroquet phoque pieuvre pigeon pingouin poney python quetzal renard requin salamandre sauterelle scarabee scorpion toucan tortue tyrannosaure ver-de-terre wallaby walrus wapiti whippet wombat yak yeti yorkshire zebre zebu`.split(/\s+/),
  loisirs: `accordeon album appareil-photo basketball banjo batterie batte billard bowling boxe boxeur cerf-volant clarinette clown corde-a-sauter echecs escalade flute gymnase gymnastique haltere hamac handball harmonica hobby hockey jazz judo kayak kazoo lyre maracas marionnette medaille olympiade olympique piano puzzle raquette randonnee rugby saxophone skateboard snowboard stade tambour tambourin tennis trombone ludotheque trophee volleyball wakeboard water-polo windsurf xylophone yoga yoyo zouk jouet peluche poupee toupie loto`.split(/\s+/),
  travail: `actrice agricultrice architecte astronaute avocate bouchere charpentiere chauffeuse coiffeuse factrice fermiere juge livreuse maconne mecanicienne musicienne pecheuse peintre photographe pilote policiere pompiere scientifique serveuse steward trapezieste veterinaire cow-boy`.split(/\s+/),
  sante: `ambulance bouche bras coton-tige deodorant docteur doigt dos epaule genou hygiene jambe langue lotion nez oreille pied poing reflexe savon shampoing seche-cheveux`.split(/\s+/),
  ecole: `addition alphabet ardoise atlas calculatrice compas crayon equerre encyclopedie feutre globe gomme intercalaire marqueur post-it pupitre rapporteur regle surligneur`.split(/\s+/),
  nature: `azalee bambou bouquet campagne canyon cerisier chene colline coquelicot corail cypres desert dune edelweiss erable etang falaise feuille foin galaxie glycine gouffre gazon herbe hetre houx iris jonquille lavande lune lys marguerite marais muguet myosotis nenuphar noisetier oeillet olivier orchidee ozone palmier paquerette peuplier pissenlit pivoine planete prairie rocher sapin saturne saule-pleureur sentier sequoia tournesol tulipe vallee volcan yucca zinnia etoile comete`.split(/\s+/),
  vetements: `bague beret blouson bottines bracelet calecon chaussons collier culotte fez foulard legging maillot sandales soulier soutien-gorge uniforme zipper`.split(/\s+/),
  logement: `balai buffet bungalow chaise commode douche escalier fauteuil fenetre foyer grange igloo lavabo lave-vaisselle miroir penderie porte poubelle refrigerateur table table-de-nuit tapis toit tente wigwam bungalow climatiseur`.split(/\s+/),
  transports: `bulldozer caravane ferry fusee helicoptere moto montgolfiere navire paquebot scooter sous-marin telepherique tracteur trottinette wagon wagonnet yacht`.split(/\s+/),
  journee: `blizzard cyclone hiver tempete tornade typhon flocon semaine deux dix douze huit onze quatorze quinze seize six treize zero`.split(/\s+/),
  couleurs: `acrylique azur bronze cyan kaki turquoise`.split(/\s+/),
  presenter: `femme garcon homme maman papa`.split(/\s+/),
  famille: `maman papa bebe`.split(/\s+/),
  achats: `bazar vitrine`.split(/\s+/),
  administration: `tampon timbre`.split(/\s+/),
}

const FORMES = `carre cercle cone cube cylindre hexagone losange ovale pentagone polygone pyramide rectangle sphere trapeze triangle zigzag`.split(/\s+/)

function stem(name) {
  return name
    .replace(/\.webp$/i, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const moved = {}
for (const file of readdirSync(SRC)) {
  const s = stem(file)
  let dest = null
  if (FORMES.includes(s)) dest = 'formes'
  else {
    for (const [theme, words] of Object.entries(MAP)) {
      if (words.some((w) => {
        const n = stem(`${w}.webp`)
        return s === n || s.includes(n) || n.includes(s)
      })) {
        dest = theme
        break
      }
    }
  }
  if (!dest) continue
  const targetDir = join(DIR, dest)
  mkdirSync(targetDir, { recursive: true })
  const target = join(targetDir, file)
  if (existsSync(target)) continue
  renameSync(join(SRC, file), target)
  moved[dest] = (moved[dest] ?? 0) + 1
}

console.log(moved)
console.log('restant objets', readdirSync(SRC).length)
