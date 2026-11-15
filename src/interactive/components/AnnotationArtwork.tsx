import {ANNOTATION_COLORS,type ImageStroke} from '../domain/image-annotations'

export function AnnotationShapes({strokes,width,height}:{strokes:readonly ImageStroke[];width:number;height:number}) {
  const point=([x,y]:[number,number])=>[x*width/1000,y*height/1000]
  return <>{strokes.map((stroke,index)=>{
    const color=ANNOTATION_COLORS[stroke.color],size=Math.max(width,height)/(stroke.tool==='highlighter'?65:250),first=point(stroke.points[0]!),last=point(stroke.points.at(-1)!)
    const props={stroke:color,strokeWidth:size,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const}
    return <g key={index} data-annotation-stroke={stroke.tool} opacity={stroke.tool==='highlighter'?.4:1}>
      {stroke.tool==='rectangle'?<rect {...props} x={Math.min(first[0]!,last[0]!)} y={Math.min(first[1]!,last[1]!)} width={Math.abs(first[0]!-last[0]!)} height={Math.abs(first[1]!-last[1]!)}/>:
       stroke.tool==='ellipse'?<ellipse {...props} cx={(first[0]!+last[0]!)/2} cy={(first[1]!+last[1]!)/2} rx={Math.abs(first[0]!-last[0]!)/2} ry={Math.abs(first[1]!-last[1]!)/2}/>:
       stroke.points.length===1?<circle cx={first[0]} cy={first[1]} r={size/2} fill={color}/>:<polyline {...props} points={stroke.points.map(p=>point(p).join(',')).join(' ')}/>}
    </g>
  })}</>
}

export function AnnotationPreview({strokes,width,height}:{strokes:readonly ImageStroke[];width:number;height:number}) {
  if(!strokes.length)return null
  return <svg aria-hidden="true" data-annotation-preview viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}><AnnotationShapes strokes={strokes} width={width} height={height}/></svg>
}
