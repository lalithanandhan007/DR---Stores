/* Headless verification of the admin Orders module (frontend-only).
   Sets the admin demo session in localStorage, then loads and exercises
   /admin/orders and /admin/orders/:id. Reports console/page errors. */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173'

const ADMIN_SESSION = `
  localStorage.setItem('dr-role', 'admin');
  localStorage.setItem('dr-user', JSON.stringify({
    id: 'usr_admin_demo', name: 'Store Admin', email: 'admin@drstores.com',
    phone: '9876543210', avatar: null, memberSince: new Date().toISOString()
  }));
`

const errors = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`) })
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

async function openRoute(path) {
  await page.evaluateOnNewDocument(ADMIN_SESSION)
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 30000 })
  await sleep(1200)
}

async function snap(name) {
  await page.screenshot({ path: `scripts/shot-${name}.png`, fullPage: false })
  console.log(`  screenshot → scripts/shot-${name}.png`)
}

/* ---------------- 1. Orders list page ---------------- */
console.log('→ /admin/orders')
await openRoute('/admin/orders')

const rowCount = await page.$$eval('table tbody tr', (rows) => rows.length)
console.log(`  table rows rendered: ${rowCount}`)

const heading = await page.$eval('h1', (el) => el.textContent).catch(() => '—')
console.log(`  h1: "${heading}"`)

const kpiChips = await page.$$eval('button', (btns) => btns.filter((b) => b.textContent.includes('Orders') || b.textContent.includes('Pending') || b.textContent.includes('Delivered')).length)
console.log(`  KPI chips found: ${kpiChips}`)

// Live search
const searchHandle = await page.$('input[placeholder^="Search by"]')
if (searchHandle) {
  await searchHandle.type('Priya')
  await sleep(600)
  const afterSearch = await page.$$eval('table tbody tr', (rows) => rows.length)
  console.log(`  live search "Priya" → ${afterSearch} rows (expect filtered to Priya's orders)`)
  const firstRowText = await page.$eval('table tbody tr', (r) => r.textContent).catch(() => '')
  console.log(`  first row contains "Priya": ${firstRowText.includes('Priya')}`)
  await searchHandle.click({ clickCount: 3 })
  await page.keyboard.press('Backspace')
  await sleep(500)
}

// Open a row → detail page
const firstId = await page.$eval('table tbody tr button', (b) => b.textContent).catch(() => null)
console.log(`  first order id button: ${firstId}`)
if (firstId) {
  await page.$eval('table tbody tr button', (b) => b.click())
  await sleep(1400)
  console.log(`→ detail page (URL: ${page.url()})`)
  const detailHeading = await page.$eval('h1', (el) => el.textContent).catch(() => '—')
  console.log(`  detail h1: "${detailHeading}"`)
  await snap('order-detail')

  // Timeline rendered?
  const timelineNodes = await page.$$eval('ol li', (lis) => lis.length).catch(() => 0)
  console.log(`  timeline steps rendered: ${timelineNodes}`)

  // Products table rows
  const productRows = await page.$$eval('table tbody tr', (rows) => rows.length).catch(() => 0)
  console.log(`  products/invoice table rows: ${productRows}`)

  // Status action bar present?
  const statusBar = await page.evaluate(() => document.body.innerText.includes('Next step'))
  console.log(`  status action bar present: ${statusBar}`)

  // Customer panel
  const customerPanel = await page.evaluate(() => document.body.innerText.includes('Lifetime Spend'))
  console.log(`  customer panel present: ${customerPanel}`)

  // Trigger a status change (Accept Order on a pending order)
  const pendingOrder = await page.evaluate(() => document.body.innerText.includes('Pending'))
  if (pendingOrder) {
    const acceptBtn = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll('button')]
      return btns.find((b) => b.textContent.includes('Accept Order'))
    })
    if (acceptBtn) {
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')]
        const b = btns.find((x) => x.textContent.includes('Accept Order'))
        if (b) b.click()
      })
      await sleep(900)
      const toast = await page.evaluate(() => document.body.innerText.includes('Order accepted'))
      console.log(`  accept-order toast fired: ${toast}`)
      await snap('order-accepted')
    } else {
      console.log('  no Accept Order button on this order (non-pending status — expected)')
    }
  }

  // Back to list
  await page.goto(`${BASE}/admin/orders`, { waitUntil: 'networkidle0' })
  await sleep(1000)
  await snap('orders-list')
}

/* ---------------- 3. Bogus id → not found ---------------- */
console.log('→ /admin/orders/ORD-99999 (not found)')
await openRoute('/admin/orders/ORD-99999')
const notFound = await page.evaluate(() => document.body.innerText.includes('Order not found'))
console.log(`  not-found state rendered: ${notFound}`)

await browser.close()

console.log('\n================ RESULT ================')
if (errors.length === 0) {
  console.log('✅ No console/page errors')
} else {
  console.log(`❌ ${errors.length} error(s):`)
  errors.forEach((e) => console.log('  ' + e))
}
process.exit(errors.length ? 1 : 0)
