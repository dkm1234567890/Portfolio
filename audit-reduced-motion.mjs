import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(String(err)))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1500))

const result = await page.evaluate(() => {
  const introOverlay = document.querySelector('.fixed.inset-0.z-\\[100\\]')

  // The three RiverPath strokes share the same `d`; grab the one with the
  // most specific stroke so we know we're reading the base layer.
  const strokes = [...document.querySelectorAll('path')].filter((p) =>
    (p.getAttribute('stroke') || '').includes('water-deep')
  )
  const basePath = strokes[0]
  const basePathLength = basePath ? basePath.style.pathLength : null

  // The wake/splash overlay svg specifically (not PaperBoat's own <svg>,
  // which always renders regardless of reduced motion).
  const wakeOverlay = document.querySelector('svg.overflow-visible')
  const wakeCircles = wakeOverlay ? wakeOverlay.querySelectorAll('circle').length : 0

  const shipWrapper = document.querySelector('.z-\\[5\\] > .absolute.left-0.top-0')
  const shipTransform = shipWrapper ? getComputedStyle(shipWrapper).transform : null

  const scrollBehavior = getComputedStyle(document.documentElement).scrollBehavior
  const bodyText = document.body.innerText

  return {
    introOverlayPresent: Boolean(introOverlay),
    basePathLength,
    wakeOverlayPresent: Boolean(wakeOverlay),
    wakeCircleCount: wakeCircles,
    shipTransform,
    scrollBehavior,
    factsSample: {
      hasName: bodyText.includes('Dodda Krishna Murthy'),
      hasIntro: bodyText.includes('Networks, systems'),
      hasSkillsHeading: bodyText.includes('What I work with'),
      hasFirstProject: bodyText.includes('Battleship'),
      hasResume: bodyText.includes('Download resume'),
      hasContact: bodyText.includes('Send a message'),
    },
  }
})

console.log(JSON.stringify(result, null, 2))
console.log('console/page errors:', consoleErrors.length)
consoleErrors.forEach((e) => console.log(' -', e))

await browser.close()
