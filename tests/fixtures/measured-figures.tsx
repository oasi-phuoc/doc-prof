import { createRoot } from 'react-dom/client'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import { CompositeFigure } from '@/components/math/CompositeFigure'
import '@/App.css'
import '@/components/generator/worksheet-typography.css'
const dims={unit:'cm',side:6,length:12,width:5,height:4,radius:3,a:8,b:6,c:7,base:8,top:4,bottom:9,d1:8,d2:5,triangleKind:'scalene'} as const
const figures=['square','rectangle','triangle','circle','rhombus','parallelogram','trapezoid','cube','cuboid','cylinder','cone','sphere','pentagon'] as const
createRoot(document.getElementById('root')!).render(<main className="worksheet-sheet" style={{width:900,height:'auto',maxHeight:'none',aspectRatio:'auto',overflow:'visible',padding:40,fontSize:20}}><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:30}}>{figures.map(type=><section key={type} data-type={type}><h2 style={{fontSize:'inherit'}}>{type}</h2><GeometryFigure type={type} dims={dims}/></section>)}<section data-type="composite"><h2 style={{fontSize:'inherit'}}>Forme composée</h2><CompositeFigure scene={{outline:'M50 40H200V150H50Z',labels:[{x:125,y:25,text:'12 cm'},{x:218,y:95,text:'5 cm',anchor:'start'}]}}/></section></div></main>)
