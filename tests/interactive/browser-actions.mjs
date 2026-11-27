import { setTimeout as delay } from 'node:timers/promises'

/** Follow the real compact toolbar, opening Options before a hidden command. */
export function gameControl(root,name) {
  const locator=root.getByRole('button',{name,exact:true,includeHidden:true})
  const reveal=async()=>{
    if(await locator.isVisible())return
    const page=typeof root.page==='function'?root.page():root
    const options=page.getByRole('button',{name:'Options du jeu',exact:true})
    if(!await options.isVisible()){
      const leave=page.getByRole('button',{name:'Quitter le plein écran',exact:true})
      if(await leave.isVisible())await leave.click()
    }
    if(await options.isVisible()&&await options.getAttribute('aria-expanded')!=='true')await options.click()
  }
  return new Proxy(locator,{get(target,key){
    if(['click','tap','focus','hover'].includes(key))return async(...args)=>{await reveal();return target[key](...args)}
    const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value
  }})
}

export async function useSixCards(page) {
  await page.getByRole('button', { name: /^Préparer la séance/ }).click()
  const settings = page.getByRole('dialog', { name: 'Préparer la séance', exact: true })
  await settings.getByText('Ordre des questions et préréglages', { exact: true }).click()
  await settings.getByRole('combobox', { name: 'Nombre maximal de choix' }).selectOption('6')
  await settings.getByRole('button', { name: 'Fermer · Préparer la séance', exact: true }).click()
  await page.locator('.ci-launch:enabled').waitFor()
}

/** Playwright's synchronous predicate poll treats a Promise as truthy, even
 * when it later resolves false. Await each storage read on the test side.
 * The deadline uses Node's real clock, independent of a frozen page clock. */
export async function waitForBrowserValue(page, read, timeout = 30000) {
  const deadline = performance.now() + timeout
  do {
    const value = await page.evaluate(read)
    if (value) return value
    await delay(50)
  } while (performance.now() < deadline)
  throw new Error('La donnée attendue n’a pas été enregistrée dans le navigateur avant le délai de test.')
}

/** Exercise the teacher confirmation; Solo keeps its direct Skip action. */
export async function skipQuestion(page) {
  const solo = await page.locator('.ci-solo-session').count() > 0
  await gameControl(page,'Passer').click()
  if (!solo) await page.getByRole('dialog', { name: /Passer (cette question|ces deux questions) \?/ }).getByRole('button', { name: 'Passer sans correction', exact: true }).click()
}
