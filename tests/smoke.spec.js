import { test, expect } from '@playwright/test'

// The intro overlay plays a ~2.6s animation on first visit and locks scroll.
// Mark it as already seen so every test starts on a settled page.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('introSeen', '1')
  })
})

test('home page loads without console or page errors', async ({ page }) => {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dodda Krishna Murthy')
  await expect(page.locator('#projects')).toBeAttached()

  expect(errors).toEqual([])
})

test('navbar links navigate to their sections', async ({ page }) => {
  await page.goto('/')

  const nav = page.locator('header nav')
  await nav.getByRole('link', { name: 'Contact' }).click()
  await expect(page.locator('#contact')).toBeInViewport()

  await nav.getByRole('link', { name: 'Resume' }).click()
  await expect(page.locator('#resume')).toBeInViewport()
})

test('theme toggle switches and persists the theme', async ({ page }) => {
  await page.goto('/')

  const html = page.locator('html')
  const before = await html.getAttribute('data-theme')
  const after = before === 'dark' ? 'light' : 'dark'

  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click()
  await expect(html).toHaveAttribute('data-theme', after)
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('theme')))
    .toBe(after)
})

test('contact form shows validation errors for empty submit', async ({ page }) => {
  await page.goto('/#contact')

  await page.getByRole('button', { name: 'Send a message' }).click()
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByText('Enter your name.')).toBeVisible()
  await expect(page.getByText('Enter your email.')).toBeVisible()
  await expect(page.getByText('Enter a message.')).toBeVisible()
})

test('contact form sends successfully (EmailJS mocked)', async ({ page }) => {
  // Never hit the real EmailJS API from tests.
  await page.route('**/api.emailjs.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' })
  )

  await page.goto('/#contact')
  await page.getByRole('button', { name: 'Send a message' }).click()

  await page.getByLabel('Name').fill('Playwright Smoke Test')
  await page.getByLabel('Email').fill('smoke@example.com')
  await page.getByLabel('Message').fill('This is an automated smoke test message, at least twenty characters long.')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByText('Message sent.', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Send another message' })).toBeVisible()
})

test('resume download link points to a real file', async ({ page, request }) => {
  await page.goto('/')

  const href = await page
    .locator('#resume')
    .getByRole('link', { name: 'Download resume' })
    .getAttribute('href')
  expect(href).toBeTruthy()

  const res = await request.get(new URL(href, page.url()).href)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('pdf')
})
