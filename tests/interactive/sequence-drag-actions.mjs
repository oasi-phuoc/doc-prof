import assert from 'node:assert/strict'

/** Real browser pointer capture, including Chromium's native touch dispatch. */
export async function dragSequence(page,source,target,{touch=false,finish='drop',screenshot}={}) {
  const from=await source.boundingBox(),to=await target.boundingBox()
  assert.ok(from&&to,'Both ordering zones must be visible')
  const start={x:from.x+from.width/2,y:from.y+from.height/2},end={x:to.x+to.width/2,y:to.y+to.height/2}
  const before=await source.evaluate(node=>[...node.parentElement.children].map(child=>child.getAttribute('data-ci-source-index')))
  const client=touch?await page.context().newCDPSession(page):null
  try{
    if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]})
    else {await page.mouse.move(start.x,start.y);await page.mouse.down()}
    for(let step=1;step<=8;step++){
      const point={x:start.x+(end.x-start.x)*step/8,y:start.y+(end.y-start.y)*step/8}
      if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]})
      else await page.mouse.move(point.x,point.y)
    }
    await page.locator('.ci-order-ghost').waitFor()
    assert.equal(await page.locator('.ci-order-dragging').count(),1)
    assert.equal(await target.evaluate(node=>node.classList.contains('ci-order-target')),true)
    assert.deepEqual(await source.evaluate(node=>[...node.parentElement.children].map(child=>child.getAttribute('data-ci-source-index'))),before,'The preview must not commit an intermediate order')
    if(screenshot)await page.screenshot({path:screenshot})
    if(finish==='escape')await page.keyboard.press('Escape')
    if(finish==='outside'){
      if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:8,y:8}]})
      else await page.mouse.move(8,8)
    }
    if(touch)await client.send('Input.dispatchTouchEvent',{type:finish==='cancel'?'touchCancel':'touchEnd',touchPoints:[]})
    else await page.mouse.up()
    await page.locator('.ci-order-ghost').waitFor({state:'detached'})
  }finally{await client?.detach()}
}
