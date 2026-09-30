import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()

const res = await page.goto('http://localhost:4173/portfolio/', { waitUntil: 'networkidle0' })
const body = await res.text()
console.log('--- raw response body ---')
console.log(body)
console.log('--- end ---')

await new Promise((r) => setTimeout(r, 1000))
const domHtml = await page.evaluate(() => document.documentElement.outerHTML.slice(0, 1500))
console.log('--- current DOM (after JS) ---')
console.log(domHtml)

await browser.close()
