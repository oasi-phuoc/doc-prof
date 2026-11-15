import type {MascotKind} from '../../domain/mascot'

export type Power = 1|2|3
export type Material = 'leaf'|'feather'|'ink'|'quill'|'moon'|'fire'|'cheese'|'rock'|'claw'|'ribbon'|'star'|'cloud'|'banana'|'sun'|'paw'|'dust'|'bamboo'|'wisp'|'bubble'|'ice'|'coin'|'water'
export type Signature = {id:MascotKind; material:Material; color:string; light:string; normal:string; double:string; triple:string; durations:readonly [number,number,number]; phase:number}
const signature=(id:MascotKind,material:Material,color:string,light:string,normal:string,double:string,triple:string,phase:number,durations:readonly [number,number,number]=[920,1420,2100]):Signature=>({id,material,color,light,normal,double,triple,phase,durations})
/** Each level names a different composition; these are also the contact-sheet captions. */
export const SIGNATURES:readonly Signature[]=[
  signature('leaf','leaf','#389b60','#d6ff8b','feuilles portées','courants croisés et graines','couronnes végétales opposées',.1),
  signature('owl','feather','#9b85d4','#f0eeff','plume lunaire','trois battements et lune','rosace de lune et plumes',.5),
  signature('octopus','ink','#9a48bc','#efc2ff','encre visqueuse','jets entrelacés et bulle','six poches d’encre en fusion',.8),
  signature('hedgehog','quill','#b77c45','#ffe4aa','piquants en parabole','deux salves rebondissantes','salves radiales alternées',1.1),
  signature('rabbit','moon','#ed8fca','#fff2ff','croissants bondissants','trois bonds et ondes','rondes lunaires élastiques',1.4),
  signature('dragon','fire','#ed6433','#fff3aa','souffle de dragon','nappes de feu tressées','serpents de flammes',1.7),
  signature('rat','cheese','#e6ac31','#fff3b8','fromage en ricochet','trois ricochets décalés','horloge de miettes',2.1),
  signature('ox','rock','#9c794b','#efc992','onde minérale lourde','deux secousses et résonance','couronne sismique',2.4),
  signature('tiger','claw','#ed9131','#fff1c5','trois griffures progressives','éventails croisés','douze griffures radiales',2.8),
  signature('snake','ribbon','#6ab45e','#d5ffad','ruban sinusoïdal','hélice double à deux contacts','nœud de deux hélices',3.1),
  signature('horse','star','#6985d5','#e7edff','comète et sabots','étoiles croisées et galop','constellation de sabots',3.5),
  signature('goat','cloud','#88b7cf','#f0fbff','cyclone nuageux','deux entonnoirs entrelacés','cyclone annulaire stratifié',3.8),
  signature('monkey','banana','#e8b632','#fff5ae','salto banane','trois bonds inégaux','saltos en spirale',4.1),
  signature('rooster','sun','#e6a133','#fff7bf','éventail solaire','onde et couronne solaire','aurore à douze rayons',4.4),
  signature('dog','paw','#e4a263','#fff0c8','empreintes bondissantes','piste alternée des deux pattes','ronde de pattes',4.7),
  signature('boar','dust','#a18062','#e1d1ae','rouleau de terre','deux rouleaux de poussière','vortex de terre à deux niveaux',5),
  signature('panda','bamboo','#53a06a','#dbffc1','bambou flexible','trois éventails de bambou','palissade et rosace',5.3),
  signature('fox','wisp','#ed9d45','#fff4bc','feu follet','trois feux follets réunis','trois orbites irrégulières',5.6),
  signature('tanuki','leaf','#8c9f4c','#edffc3','rouleau de feuilles','deux rouleaux fusionnés','rouleaux végétaux aplatis',5.9),
  signature('otter','bubble','#73bfd5','#e0ffff','bulles élastiques','jets de bulles croisés','bulles et couronne d’eau',6.2),
  signature('koala','leaf','#8bbba7','#e8fff2','eucalyptus en portance','rafale qui soulève les feuilles','rose des vents végétale',6.5),
  signature('turtle','water','#56acac','#d6fff7','bouclier aquatique','deux fronts imbriqués','anneaux et carapace fluide',6.8),
  signature('axolotl','star','#a28de6','#e8f6ff','étoile filante aquatique','trois arcs et trois rides','constellation sous-marine',7.1),
  signature('leopard','ice','#82bfd7','#f0ffff','trois griffes glacées','éventails et condensation','dentelle de givre',7.4),
  signature('crane','feather','#a6bbce','#fff9f2','plumes en piqué','trois courants en profondeur','deux rondes de plumes',7.7),
  signature('cat','coin','#e4b64c','#fff7ce','sceau porte-bonheur','trois sceaux en trèfle','cercle de chance réfléchissant',8),
  signature('koi','water','#479fcf','#d9faff','jet d’eau continu','deux jets d’eau tressés','colonne de vortex aquatique',8.3),
  signature('red-panda','leaf','#db7c43','#ffe9a1','boucle de feuilles d’érable','nappes d’automne croisées','roues d’érable étagées',8.6),
  signature('penguin','ice','#67b7d1','#eeffff','glissade et trace de givre','deux rails obliques','rails courbes de glace',8.9),
  signature('kitsune','fire','#ef7038','#fff2b2','spirale de feu vivant','deux courants de feu tressés','tornade de feu grandissante',9.2),
]
export const signatureFor=(id:MascotKind)=>SIGNATURES.find(item=>item.id===id)??SIGNATURES[0]!
export const SUPER_AURA_COLORS:Record<MascotKind,string>={leaf:'#49d69c',owl:'#7aa9f5',octopus:'#ce59dd',hedgehog:'#e8ba56',rabbit:'#c694f0',dragon:'#fb3e68',rat:'#f0c663',ox:'#d4ad66',tiger:'#ef7147',snake:'#73e3b4',horse:'#b9a3ff',goat:'#b8b9eb',monkey:'#ef9e40',rooster:'#ef8243',dog:'#ec9c98',boar:'#a9756e',panda:'#4ed5a7',fox:'#d784ec',tanuki:'#b0d675',otter:'#6ee3e7',koala:'#74dabd',turtle:'#5edac6',axolotl:'#e5a5f6',leopard:'#c4c9fa',crane:'#e4c6f4',cat:'#f1b094',koi:'#65dce8','red-panda':'#ed867e',penguin:'#afc9f9',kitsune:'#c68cf6'}
export const sceneDuration=(id:MascotKind,level:Power,timeout=false)=>timeout?700:signatureFor(id).durations[level-1]!
export const contactTime=(id:MascotKind,level:Power,local=false)=>sceneDuration(id,level)*(local?.62:level===3?.68:level===2?.69:.63)
export const feedbackDuration=(requestedSeconds:number,id:MascotKind,level:Power,timeout=false)=>Math.max(requestedSeconds*1000,sceneDuration(id,level,timeout)+140)
