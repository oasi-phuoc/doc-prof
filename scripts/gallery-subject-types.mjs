import {readFileSync} from 'node:fs'
const subjects=JSON.parse(readFileSync(new URL('./gallery-subject-types.json',import.meta.url),'utf8'))
const norm=text=>String(text??'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/œ/g,'oe').replace(/[’‘]/g,"'").replace(/[-_]/g,' ').replace(/\s+/g,' ').trim()
const noun=text=>norm(text).replace(/^(?:(?:un|une|des|du|de la|le|la|les)\s+|l')/,'').replace(/\b([a-z]{4,})s\b/g,'$1')
const names=Object.fromEntries(Object.entries(subjects).map(([type,labels])=>[type,[...new Set(labels.map(noun))].sort((a,b)=>b.length-a.length)]))
const specific=new Set(['Fruit','Légume','Plat','Véhicule'])
const protectedTypes=new Set(['Action','Scène','Scénario','Document','Métier','Personnage','Animal','Partie du corps','Maladie','Pays et nationalité','Heure et horloge','Logique','Forme et symbole'])
function bestMatch(label){
 const key=noun(label)
 return Object.entries(names).flatMap(([type,words])=>{const name=words.find(word=>key===word||key.startsWith(word+' '));return name?[{type,name}]:[]}).sort((a,b)=>b.name.length-a.name.length)[0]?.type
}
/** Classify the depicted noun, never a food/vehicle merely mentioned in a scene. */
export function gallerySubjectTypes({label,types,file,origin=file,themes=[]}){
 if(types.some(type=>protectedTypes.has(type)))return types.filter(type=>type!=='Végétal')
 if(types.some(type=>specific.has(type)))return types.filter(type=>!['Objet','Végétal'].includes(type))
 const old=types.includes('Végétal'),fallback=()=>old?[...types.filter(type=>type!=='Végétal'),'Objet']:types
 if(/(?:couleur|swatch)/.test(norm(file))||/\bfeuille\b.*\b(?:papier|pvc|aluminium|cahier)\b/.test(noun(label))||/^(?:peche a la ligne|noyau)$/.test(noun(label))||norm(label)==='la pate')return fallback()
 if(/\/(?:bg|scenes|po|actions)\//.test(file))return fallback()
 if(/\/vocabulaire\/fruits[^/]*\//.test(origin))return['Fruit']
 if(/\/vocabulaire\/legumes[^/]*\//.test(origin))return['Légume']
 if(old&&themes.some(theme=>/^legumes?$/.test(noun(theme))))return['Légume']
 const parts=norm(label).split(/\s+(?:et|ou)\s+/),kinds=parts.map(bestMatch)
 if(parts.length>1&&kinds.some(type=>!type||type!==kinds[0]))return fallback()
 const kind=bestMatch(label)
 if(kind==='Aliment brut')return['Objet']
 if(kind)return[kind]
 return fallback()
}
/** The old broad botanical themes must not keep edible produce in Végétal. */
export function gallerySubjectThemes(themes,types){
 const result=new Set(themes.filter(theme=>types.includes('Végétal')||!['vegetal','vegetaux','plantes','plantes, fleurs et arbres'].includes(norm(theme))))
 for(const[type,theme]of[['Fruit','Fruits'],['Légume','Légumes'],['Plat','Plats'],['Véhicule','Véhicules']])if(types.includes(type))result.add(theme)
 if(types.some(type=>['Fruit','Légume','Plat'].includes(type)))result.add('Alimentation et boissons')
 if(types.includes('Véhicule'))result.add('Transports et voyages')
 if(types.includes('Végétal'))result.add('Plantes, fleurs et arbres')
 return[...result].filter(Boolean).sort()
}
