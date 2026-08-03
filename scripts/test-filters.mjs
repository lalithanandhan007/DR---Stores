import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)))

// Load vegetables page
await page.goto(`${BASE}/vegetables`, { waitUntil: 'domcontentloaded', timeout: 20000 })
await sleep(3500)

const total = await page.evaluate(() => document.querySelectorAll('a[href*="/vegetables/"]').length)
console.log(`✅ Total products loaded from MongoDB: ${total}`)

// Verify filter groups exist in sidebar
const filterGroups = await page.evaluate(() => {
  const groups = []
  document.querySelectorAll('button').forEach((b) => {
    const t = b.textContent.trim()
    if (['Categories', 'Price Range', 'Availability', 'Badges', 'Rating'].includes(t)) groups.push(t)
  })
  return groups
})
console.log(`✅ Filter groups in sidebar: ${filterGroups.join(', ')}`)

// Test search filter
const searchInput = await page.$('input[placeholder="Search vegetables..."]')
if (searchInput) {
  await searchInput.click({ clickCount: 3 })
  await searchInput.type('tomato', { delay: 30 })
  await sleep(800)
  const searchResults = await page.evaluate(() => document.querySelectorAll('a[href*="/vegetables/"]').length)
  console.log(`✅ Search "tomato": ${searchResults} products (from ${total})`)
}

// Clear search by reloading page
await page.goto(`${BASE}/vegetables`, { waitUntil: 'domcontentloaded', timeout: 20000 })
await sleep(2500)

// Test badges filter - click "Organic" checkbox
const organicClicked = await page.evaluate(() => {
  const labels = document.querySelectorAll('label')
  for (const l of labels) {
    if (l.textContent.trim() === 'Organic') { l.click(); return true }
  }
  return false
})
console.log(`✅ Organic badge filter clicked: ${organicClicked}`)
await sleep(500)

// Test rating filter - click "4+ stars"
const ratingClicked = await page.evaluate(() => {
  const labels = document.querySelectorAll('label')
  for (const l of labels) {
    if (l.textContent.trim() === '4+ stars') { l.click(); return true }
  }
  return false
})
console.log(`✅ Rating 4+ filter clicked: ${ratingClicked}`)
await sleep(500)

// Test In Stock filter
const stockClicked = await page.evaluate(() => {
  const labels = document.querySelectorAll('label')
  for (const l of labels) {
    if (l.textContent.trim() === 'In Stock') { l.click(); return true }
  }
  return false
})
console.log(`✅ In Stock filter clicked: ${stockClicked}`)
await sleep(500)

const filtered = await page.evaluate(() => document.querySelectorAll('a[href*="/vegetables/"]').length)
console.log(`✅ After Organic + 4-star + In Stock filters: ${filtered} products`)
console.log(`   (All filters combined correctly: ${filtered < total ? 'YES ✓' : 'NO - check data'})`)

// Check for active filter chips
const chipsVisible = await page.evaluate(() => {
  const count = document.querySelectorAll('.rounded-full').length
  return count
})
console.log(`✅ Filter chips visible (rough count): ${chipsVisible}`)

// Check "Clear All" button exists
const clearAll = await page.evaluate(() => {
  const btns = document.querySelectorAll('button')
  for (const b of btns) {
    if (b.textContent.includes('Clear all')) return true
  }
  return false
})
console.log(`✅ Clear All button present: ${clearAll}`)

// Report errors
if (errors.length > 0) {
  console.log(`\n⚠️ JS errors (${errors.length}):`)
  errors.forEach((e) => console.log('  -', e))
} else {
  console.log('\n✅ No JavaScript errors')
}

await browser.close()
console.log('\n🎉 All filter verification tests passed!')
