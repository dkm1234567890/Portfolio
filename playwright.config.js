import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    // Dummy EmailJS config so the contact-form test works without a local
    // .env (fresh clone, CI): emailjs.send() rejects missing IDs before it
    // ever makes the request the test mocks. Vite lets process env beat
    // .env, so a dev server started by Playwright always uses these — fine,
    // since tests never send a real message.
    env: {
      VITE_EMAILJS_SERVICE_ID: process.env.VITE_EMAILJS_SERVICE_ID || 'test_service',
      VITE_EMAILJS_TEMPLATE_ID: process.env.VITE_EMAILJS_TEMPLATE_ID || 'test_template',
      VITE_EMAILJS_PUBLIC_KEY: process.env.VITE_EMAILJS_PUBLIC_KEY || 'test_public_key',
    },
  },
})
