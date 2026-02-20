const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const swPath = path.join(__dirname, '..', 'service-worker.js')
const swContent = fs.readFileSync(swPath, 'utf8')

// Extract urlsToCache array
const match = swContent.match(/urlsToCache\s*=\s*\[([\s\S]*?)\]/)
if (!match) {
    console.error('Could not find urlsToCache in service-worker.js')
    process.exit(1)
}

// Parse file paths from array
const urlsRaw = match[1]
const urls = urlsRaw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith("'") || line.startsWith('"'))
    .map(line => line.replace(/['",]/g, '').trim())
    .filter(url => url && url !== '/')

// Generate hash from file contents
const hash = crypto.createHash('md5')

urls.forEach(url => {
    const filePath = path.join(__dirname, '..', url === '/' ? 'index.html' : url)
    try {
        const content = fs.readFileSync(filePath)
        hash.update(content)
    } catch (e) {
        console.error(`Could not read file: ${filePath}`)
    }
})

const versionHash = hash.digest('hex').substring(0, 8)
const newCacheName = `answer-sound-v${versionHash}`

// Update CACHE_NAME in service-worker.js
const updatedContent = swContent.replace(
    /const CACHE_NAME = ['"]answer-sound-v[^'"]*['"];/,
    `const CACHE_NAME = '${newCacheName}';`
)

fs.writeFileSync(swPath, updatedContent)
console.log(`Updated CACHE_NAME to ${newCacheName}`)
