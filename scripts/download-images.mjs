#!/usr/bin/env node
/**
 * Downloads every photo listed in scripts/image-plan.json from the Unsplash CDN at 4K
 * and renders local WebP variants with sharp:
 *   -lg.webp  3840px (4K / QHD+ displays)
 *   -md.webp  1600px (cards, tablets)
 *   -sm.webp   800px (thumbnails, mobile)
 * It also writes src/data/media.json with dimensions + photographer credits.
 *
 * Usage: npm run images            (skips files that already exist)
 *        npm run images -- --force (re-download everything)
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const plan = JSON.parse(await readFile(path.join(root, 'scripts/image-plan.json'), 'utf8'))
const force = process.argv.includes('--force')

const VARIANTS = [
  { suffix: 'lg', width: 3840, quality: 84 },
  { suffix: 'md', width: 1600, quality: 80 },
  { suffix: 'sm', width: 800, quality: 76 },
]

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  )

async function fetchOriginal(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=3840&q=92&fm=jpg&fit=max`
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      if (attempt === 3) throw new Error(`photo-${id}: ${error.message}`)
      await new Promise((resolve) => setTimeout(resolve, attempt * 1200))
    }
  }
  return null
}

async function render(job) {
  const outDir = path.join(root, 'public', job.dir)
  await mkdir(outDir, { recursive: true })
  const targets = VARIANTS.map((variant) => ({
    ...variant,
    file: path.join(outDir, `${job.name}-${variant.suffix}.webp`),
  }))

  const allExist = (await Promise.all(targets.map((target) => exists(target.file)))).every(Boolean)
  if (allExist && !force) {
    const meta = await sharp(targets[0].file).metadata()
    return { width: meta.width, height: meta.height, skipped: true }
  }

  const original = await fetchOriginal(job.id)
  const source = sharp(original, { failOn: 'none' }).rotate()
  const meta = await source.metadata()

  await Promise.all(
    targets.map((target) =>
      source
        .clone()
        .resize({ width: Math.min(target.width, meta.width), withoutEnlargement: true })
        .webp({ quality: target.quality, effort: 5, smartSubsample: true })
        .toFile(target.file),
    ),
  )

  const width = Math.min(3840, meta.width)
  return { width, height: Math.round((meta.height / meta.width) * width), skipped: false }
}

const jobs = []
for (const [slug, images] of Object.entries(plan.cars)) {
  images.forEach((image, index) => {
    jobs.push({
      group: 'cars',
      key: slug,
      id: image.id,
      author: image.author ?? null,
      alt: image.alt,
      dir: `images/cars/${slug}`,
      name: String(index + 1).padStart(2, '0'),
    })
  })
}
for (const [key, image] of Object.entries(plan.site)) {
  jobs.push({
    group: 'site',
    key,
    id: image.id,
    author: image.author ?? null,
    alt: image.alt,
    dir: 'images/site',
    name: key,
  })
}

const media = { cars: {}, site: {} }
let done = 0
const failures = []

async function worker(queue) {
  while (queue.length) {
    const job = queue.shift()
    try {
      const result = await render(job)
      const entry = {
        src: `/${job.dir}/${job.name}`,
        alt: job.alt,
        width: result.width,
        height: result.height,
        credit: job.author,
        unsplashId: job.id,
      }
      if (job.group === 'cars') {
        media.cars[job.key] ??= []
        media.cars[job.key][Number(job.name) - 1] = entry
      } else {
        media.site[job.key] = entry
      }
      done += 1
      console.log(`${result.skipped ? 'skip' : ' ok '} [${done}/${jobs.length}] ${job.dir}/${job.name} (${result.width}x${result.height})`)
    } catch (error) {
      failures.push(`${job.dir}/${job.name}: ${error.message}`)
      console.error(`FAIL ${job.dir}/${job.name}: ${error.message}`)
    }
  }
}

const queue = [...jobs]
await Promise.all(Array.from({ length: 6 }, () => worker(queue)))

for (const key of Object.keys(media.cars)) media.cars[key] = media.cars[key].filter(Boolean)

await writeFile(path.join(root, 'src/data/media.json'), `${JSON.stringify(media, null, 2)}\n`)
console.log(`\nWrote src/data/media.json — ${done} images, ${failures.length} failures`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
}
