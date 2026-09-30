import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage()

// Start with reduced motion OFF, so the ship's rock/flutter loop is running.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200)) // let the intro finish and settle

const flagPathAt = () => document.querySelector('svg[aria-label*="sailing ship"] path[stroke="var(--flag-dark)"]')?.getAttribute('d')

const before1 = await page.evaluate(flagPathAt)
await new Promise((r) => setTimeout(r, 900))
const before2 = await page.evaluate(flagPathAt)

// Now flip the OS setting mid-session, WITHOUT reloading — this is the exact
// scenario usePrefersReducedMotion() exists for, and the one Motion's own
// useReducedMotion() (read-once) would miss.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await new Promise((r) => setTimeout(r, 2500)) // give any in-flight loop time to visibly move

const after1 = await page.evaluate(flagPathAt)
await new Promise((r) => setTimeout(r, 900))
const after2 = await page.evaluate(flagPathAt)

console.log('flag `d` changed while motion ON (expected: true) ->', before1 !== before2)
console.log('flag `d` changed while motion OFF post-toggle (expected: false) ->', after1 !== after2)
console.log({ before1, before2, after1, after2 })

await browser.close()
