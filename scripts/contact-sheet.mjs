#!/usr/bin/env node
/** Dev helper: renders labelled contact sheets of downloaded images for visual QA. */
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const media = JSON.parse(await readFile(path.join(root, 'src/data/media.json'), 'utf8'))
const outDir = path.join(root, 'scripts/.qa')
await mkdir(outDir, { recursive: true })

const W = 360
const H = 240
const COLS = 6

async function sheet(name, entries) {
  const rows = Math.ceil(entries.length / COLS)
  const tiles = await Promise.all(
    entries.map(async ([label, src], index) => {
      const file = path.join(root, 'public', `${src}-sm.webp`)
      const image = await sharp(file).resize(W, H, { fit: 'cover' }).toBuffer()
      const text = Buffer.from(
        `<svg width="${W}" height="${H}"><rect x="0" y="${H - 26}" width="${W}" height="26" fill="rgba(0,0,0,0.75)"/><text x="8" y="${H - 8}" font-family="Helvetica" font-size="15" fill="#fff">${label}</text></svg>`,
      )
      return [
        { input: image, left: (index % COLS) * W, top: Math.floor(index / COLS) * H },
        { input: text, left: (index % COLS) * W, top: Math.floor(index / COLS) * H },
      ]
    }),
  )
  await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: '#111' } })
    .composite(tiles.flat())
    .jpeg({ quality: 70 })
    .toFile(path.join(outDir, `${name}.jpg`))
}

const mode = process.argv[2] ?? 'primary'
if (mode === 'primary') {
  await sheet('primary', Object.entries(media.cars).map(([slug, images]) => [slug, images[0].src]))
} else if (mode === 'site') {
  await sheet('site', Object.entries(media.site).map(([key, image]) => [key, image.src]))
} else {
  const slugs = mode.split(',')
  await sheet(`cars-${slugs.length}`, slugs.flatMap((slug) => media.cars[slug].map((image, i) => [`${slug.slice(0, 22)} #${i + 1}`, image.src])))
}
console.log('done')
