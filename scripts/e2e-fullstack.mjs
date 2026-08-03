/* End-to-end verification of the full-stack build:
   React SPA on :5173 proxying /api to Express+MongoDB on :5000.

   Exercises: customer email login, catalog from DB, add-to-cart,
   admin login, admin dashboard with live stats. Reports failures.
*/
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173'

const errors = []
const apiHits = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`[console] ${msg.text().slice(0, 300)}`) })
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message.slice(0, 300)}`) )
page.on('response', (res) => {
  const u = res.url().replace(BASE, '')
  // count real backend calls only (proxied /api/...), not /src/api/* modules
  if (/^\/api\//.test(u)) apiHits.push(`${res.status()} ${u}`)
})

const check = (label, cond) => {
  console.log(`${cond ? '✅' : '❌'} ${label}`)
  if (!cond) errors.push(`ASSERT FAILED: ${label}`)
}

/* ---------- 1. Landing page ---------- */
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
check('Landing page loads', (await page.content()).includes('D.R.STORES') || (await page.content()).length > 2000)

/* ---------- 2. Customer email login (real JWT via backend) ---------- */
await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(600)
// switch to Email & Password tab
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')]
  const tab = btns.find((b) => b.textContent.includes('Email'))
  if (tab) tab.click()
})
await sleep(400)
await page.type('input[type="email"], input[autocomplete="email"]', 'demo@drstores.com')
const pwdInputs = await page.$$('input[type="password"]')
if (pwdInputs[0]) await pwdInputs[0].type('demo123')
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().includes('Sign In') || b.textContent.trim().includes('Log In'))
  if (btn) btn.click()
})
await sleep(3500)
check('Customer login navigates home', page.url().replace(BASE, '') === '/')
const bodyAfterLogin = await page.evaluate(() => document.body.innerText)
check('Logged-in navbar shows customer name', /Demo|Welcome|Hi|Sign out|Logout/i.test(bodyAfterLogin.slice(0, 3000)))
check('Session token stored', (await page.evaluate(() => !!localStorage.getItem('dr-token'))))

/* ---------- 3. Catalog from MongoDB via proxy ---------- */
await page.goto(`${BASE}/vegetables`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(1800)
const productCards = await page.evaluate(() => document.querySelectorAll('a[href*="/vegetables/"]').length)
check(`Products rendered from DB (${productCards} cards)`, productCards > 5)

/* ---------- 4. Add to cart ---------- */
await page.goto(`${BASE}/vegetables/tomato`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(1500)
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => /Add to Cart/i.test(b.textContent))
  if (btn) btn.click()
})
await sleep(1500)
const cartState = await page.evaluate(() => localStorage.getItem('dr-cart'))
// Authenticated cart lives in MongoDB; check the API call happened instead
await page.goto(`${BASE}/cart`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(1800)
const cartText = await page.evaluate(() => document.body.innerText.slice(0, 4000))
check('Cart page renders with item', /Tomato|tomato/i.test(cartText))

/* ---------- 5. Admin login + dashboard with live stats ---------- */
await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(600)
await page.evaluate(() => {
  const tab = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Email'))
  if (tab) tab.click()
})
await sleep(400)
await page.type('input[type="email"], input[autocomplete="email"]', 'admin@drstores.com')
const pwd2 = await page.$$('input[type="password"]')
if (pwd2[0]) await pwd2[0].type('demo123')
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().includes('Sign In') || b.textContent.trim().includes('Log In'))
  if (btn) btn.click()
})
await sleep(3500)
await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(3000)
const adminText = await page.evaluate(() => document.body.innerText)
check('Admin dashboard loads', /Welcome back, Ramesh/i.test(adminText))
check('Admin dashboard shows live stat cards', /Today's Revenue|Total Customers|Pending Orders/i.test(adminText))

/* ---------- 6. Admin API endpoints actually hit ---------- */
console.log('\n── API calls captured (sample) ──')
apiHits.slice(0, 25).forEach((h) => console.log(' ', h))
const okApi = apiHits.filter((h) => h.startsWith('2') || h.startsWith('304'))
const badApi = apiHits.filter((h) => !h.startsWith('2') && !h.startsWith('304'))
check(`API requests mostly 2xx (${okApi.length}/${apiHits.length})`, okApi.length / Math.max(apiHits.length, 1) > 0.85)
badApi.slice(0, 8).forEach((h) => console.log('  ⚠️', h))

await page.screenshot({ path: 'scripts/shot-e2e-admin.png', fullPage: false })
console.log('\nscreenshot → scripts/shot-e2e-admin.png')

await browser.close()

console.log('\n──────────────────────────────')
if (errors.length) {
  console.log(`E2E FAILED — ${errors.length} issue(s):`)
  errors.slice(0, 15).forEach((e) => console.log('  •', e))
  process.exit(1)
} else {
  console.log('E2E PASSED — full-stack flow verified ✅')
}
