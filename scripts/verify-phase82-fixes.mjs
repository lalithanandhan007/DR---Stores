/* Focused verification of the two Phase 8.2 frontend fixes:
   1. Real invoice PDF download (admin Order Detail + Orders list)
   2. "Assign Delivery Partner" modal no longer blank-pages

   Requires: backend :5000, frontend :5173, DB seeded, Chrome installed.
   Run: node scripts/verify-phase82-fixes.mjs
*/
import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173'
const DOWNLOAD_DIR = path.resolve('scripts', '.downloads-test')
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })

const errors = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const check = (label, cond, extra = '') => {
  console.log(`${cond ? '✅' : '❌'} ${label}${cond ? '' : `  ${extra}`}`)
  if (!cond) errors.push(`ASSERT FAILED: ${label}`)
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
// Force Chrome to accept the PDF download
const cdp = await page.createCDPSession()
await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR })

page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`[console] ${msg.text().slice(0, 300)}`) })
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message.slice(0, 300)}`))

/* ---------- 1. Admin login ---------- */
await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(1200)
await page.evaluate(() => {
  const tab = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Email'))
  if (tab) tab.click()
})
await sleep(1000)
await page.type('input[type="email"], input[autocomplete="email"]', 'admin@drstores.com')
const pwdInputs = await page.$$('input[type="password"]')
if (pwdInputs[0]) await pwdInputs[0].type('demo123')
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => /Sign In|Log In/.test(b.textContent.trim()))
  if (btn) btn.click()
})
await sleep(3500)
const token = await page.evaluate(() => localStorage.getItem('dr-token'))
check('Admin session token stored', !!token)
const role = await page.evaluate(() => localStorage.getItem('dr-role'))
check('Admin role stored', role === 'admin', `role=${role}`)

/* ---------- 2. Admin orders list ---------- */
await page.goto(`${BASE}/admin/orders`, { waitUntil: 'domcontentloaded', timeout: 30000 })
await sleep(3000)
const ordersBody = await page.evaluate(() => document.body.innerText.slice(0, 3000))
check('Admin orders page renders', /order|Order/i.test(ordersBody), ordersBody.slice(0, 200))
check('Admin orders page NOT blank', (await page.evaluate(() => document.body.innerHTML.length)) > 500)

/* Grab first order id from the row's #id button */
const orderId = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /^#[\w-]+$/.test(x.textContent.trim()))
  return b ? b.textContent.trim().replace(/^#/, '') : null
})
check('Order row present (got order id)', !!orderId, `id=${orderId}`)

/* ---------- 3. Order detail ---------- */
if (orderId) {
  await page.goto(`${BASE}/admin/orders/${orderId}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await sleep(2500)
  const detailText = await page.evaluate(() => document.body.innerText.slice(0, 3000))
  check('Order detail renders', /Order #|Invoice|Items|Total/i.test(detailText), detailText.slice(0, 200))
  check('Order detail NOT blank', (await page.evaluate(() => document.body.innerHTML.length)) > 500)

  /* ---------- 4. Invoice PRINT button still present & works ---------- */
  const hasPrintBtn = await page.evaluate(() =>
    [...document.querySelectorAll('button')].some((b) => /Print/i.test(b.textContent)))
  check('Invoice Print button present', hasPrintBtn)

  /* ---------- 5. Download real PDF ---------- */
  const dlBefore = fs.readdirSync(DOWNLOAD_DIR).length
  const clickDownload = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    const b = btns.find((x) => /Download/.test(x.textContent))
    if (b) { b.click(); return true }
    return false
  })
  check('Download button clicked', clickDownload)
  await sleep(4500)
  const files = fs.readdirSync(DOWNLOAD_DIR)
  const pdf = files.find((f) => f.endsWith('.pdf'))
  check('A .pdf file was produced', !!pdf && files.length > dlBefore, files.join(', '))
  if (pdf) {
    const data = fs.readFileSync(path.join(DOWNLOAD_DIR, pdf))
    check('PDF header valid (%PDF)', data.subarray(0, 5).toString() === '%PDF-', data.subarray(0, 8).toString())
    check('PDF filename has order id', /D\.R\.STORES-Invoice-[\w-]+\.pdf/.test(pdf), pdf)
  }

  /* ---------- 6. Assign Delivery Partner modal ---------- */
  const assignClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    const b = btns.find((x) => /Assign Delivery Partner|Reassign|Assign/i.test(x.textContent) && x.offsetParent !== null)
    if (b) { b.click(); return true }
    return false
  })
  check('Assign Delivery Partner button found & clicked', assignClicked)
  await sleep(2500)
  const afterModal = await page.evaluate(() => document.body.innerText.slice(0, 2500))
  const modalOpen = await page.evaluate(() => !!document.querySelector('.fixed.inset-0'))
  check('Assign modal opened (overlay present)', modalOpen)
  check('Assign modal shows partner list', /Choose partner/i.test(afterModal), afterModal.slice(0, 200))
  check('Assign modal does NOT crash to blank page', (await page.evaluate(() => document.body.innerHTML.length)) > 500)
  const partnerCards = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => /deliveries|km|₹/.test(b.textContent)).length)
  check(`Partner cards rendered (${partnerCards})`, partnerCards >= 1)

  // close the modal cleanly
  const closed = await page.evaluate(() => {
    const x = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === '' && b.closest('.fixed.inset-0'))
    if (x) { x.click(); return true }
    return false
  })
  await sleep(1000)
  check('Assign modal closes cleanly', closed || (await page.evaluate(() => !document.querySelector('.fixed.inset-0'))))
  check('Page still alive after modal close', (await page.evaluate(() => document.body.innerHTML.length)) > 500)
}

/* ---------- 7. Reports ---------- */
console.log('\n================ SUMMARY ================')
if (errors.length === 0) {
  console.log('✅ All checks passed — no console/page errors.')
} else {
  console.log(`❌ ${errors.length} issue(s):`)
  errors.forEach((e) => console.log('  - ' + e))
}
await browser.close()
process.exit(errors.length ? 1 : 0)
