import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200))

const describe = () =>
  document.activeElement
    ? {
        tag: document.activeElement.tagName,
        text: (document.activeElement.textContent || document.activeElement.getAttribute('aria-label') || '').trim().slice(0, 44),
        top: Math.round(document.activeElement.getBoundingClientRect().top + window.scrollY),
      }
    : null

const trace = []
const MAX_TABS = 45

for (let i = 0; i < MAX_TABS; i++) {
  await page.keyboard.press('Tab')
  await new Promise((r) => setTimeout(r, 15))
  const state = await page.evaluate(describe)
  trace.push(state)
  if (state && state.tag === 'BODY') break // wrapped — headless has no browser chrome to tab into
}

trace.forEach((s, i) => console.log(i + 1, JSON.stringify(s)))

await browser.close()
