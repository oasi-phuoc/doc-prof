import {createPortal} from 'react-dom'
import type {ReactNode} from 'react'
import type {SequenceDrag} from './useSequenceOrder'
import './sequence-order.css'

export function SequenceDragGhost({drag,children}:{drag:SequenceDrag|null;children:ReactNode}) {
  if(!drag)return null
  const left=Math.max(0,Math.min(window.innerWidth-drag.width,drag.x-drag.offsetX)),top=Math.max(0,Math.min(window.innerHeight-drag.height,drag.y-drag.offsetY))
  return createPortal(<div className="ci-order-ghost" aria-hidden="true" style={{left,top,width:drag.width,height:drag.height}}>{children}</div>,document.body)
}
