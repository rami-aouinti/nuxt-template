import { readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const BUNDLE_DIR = '.output/public/_nuxt'

const thresholds = {
  totalJsKb: Number.parseInt(process.env.BUNDLE_BUDGET_TOTAL_JS_KB ?? '10000', 10),
  totalCssKb: Number.parseInt(process.env.BUNDLE_BUDGET_TOTAL_CSS_KB ?? '600', 10),
  maxJsChunkKb: Number.parseInt(process.env.BUNDLE_BUDGET_MAX_JS_CHUNK_KB ?? '1600', 10),
}

const assets = readdirSync(BUNDLE_DIR)
const jsAssets = assets.filter((file) => extname(file) === '.js')
const cssAssets = assets.filter((file) => extname(file) === '.css')

const totalJsBytes = jsAssets.reduce(
  (sum, file) => sum + statSync(join(BUNDLE_DIR, file)).size,
  0,
)
const totalCssBytes = cssAssets.reduce(
  (sum, file) => sum + statSync(join(BUNDLE_DIR, file)).size,
  0,
)
const maxJsChunkBytes = jsAssets.reduce(
  (max, file) => Math.max(max, statSync(join(BUNDLE_DIR, file)).size),
  0,
)

const toKb = (bytes) => Number((bytes / 1024).toFixed(2))

const metrics = {
  totalJsKb: toKb(totalJsBytes),
  totalCssKb: toKb(totalCssBytes),
  maxJsChunkKb: toKb(maxJsChunkBytes),
}

console.table(metrics)

const violations = Object.entries(thresholds).filter(
  ([metric, limit]) => metrics[metric] > limit,
)

if (violations.length > 0) {
  console.error('Bundle budget exceeded:')
  for (const [metric, limit] of violations) {
    console.error(`- ${metric}: ${metrics[metric]}KB > ${limit}KB`)
  }
  process.exit(1)
}

console.log('Bundle budget check passed.')
