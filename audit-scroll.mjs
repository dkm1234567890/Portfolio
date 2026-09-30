import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844 })
const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(String(err)))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200)) // let the intro finish

const shipSelector = '.z-\\[5\\] > .absolute.left-0.top-0'
const before = await page.evaluateHandle((sel) => document.querySelector(sel), shipSelector)

const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
console.log('document scrollHeight:', scrollHeight)

// Scroll through a good chunk of the river in steps, like a real user.
const steps = 25
for (let i = 1; i <= steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps)
  await new Promise((r) => setTimeout(r, 80))
}

const after = await page.evaluateHandle((sel) => document.querySelector(sel), shipSelector)
const sameNode = await page.evaluate((a, b) => a === b, before, after)
const finalTransform = await page.evaluate((sel) => {
  const el = document.querySelector(sel)
  return el ? getComputedStyle(el).transform : null
}, shipSelector)

console.log('ship DOM node identical before/after scroll (expected true, i.e. never remounted):', sameNode)
console.log('ship transform after scroll (expected non-identity, proves it actually moved):', finalTransform)
console.log('console/page errors during scroll:', consoleErrors.length)
consoleErrors.forEach((e) => console.log(' -', e))

await browser.close()
