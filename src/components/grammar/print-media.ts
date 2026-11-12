/** Printing must wait for verified bytes and decoded images, including hidden copies. */
export function waitForGrammarPrintImages(root:HTMLElement):Promise<void> {
  const supports=Array.from(root.querySelectorAll('.grammar-support-image'))
  if(!supports.length)return Promise.resolve()
  return new Promise((resolve,reject)=>{
    let decoding=false,finished=false
    const finish=(error?:Error)=>{
      if(finished)return
      finished=true;clearTimeout(timer);observer.disconnect()
      root.removeEventListener('load',check,true);root.removeEventListener('error',check,true)
      if(error)reject(error);else resolve()
    }
    const check=()=>{
      if(finished||decoding)return
      const error=root.querySelector('.grammar-support-image .grammar-media-error,.grammar-support-image .ci-media-error')
      if(error){finish(new Error(error.textContent??'Image indisponible.'));return}
      if(supports.some(s=>!s.isConnected)){finish(new Error('La fiche a changé. Relancez l’impression.'));return}
      const images=supports.map(s=>s.querySelector('img'))
      if(images.some(i=>!i||!i.complete||!i.naturalWidth))return
      decoding=true
      void Promise.all(images.map(i=>i!.decode())).then(()=>finish(),()=>finish(new Error('Une image ne peut pas être imprimée. Réessayez après son chargement.')))
    }
    const observer=new MutationObserver(check)
    const timer=setTimeout(()=>finish(new Error('Le chargement des images n’est pas terminé. Réessayez dans un instant.')),15000)
    observer.observe(root,{subtree:true,childList:true,attributes:true})
    root.addEventListener('load',check,true);root.addEventListener('error',check,true)
    check()
  })
}
