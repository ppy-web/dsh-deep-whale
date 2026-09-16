import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assets = {
  dawn: 'teyvat-dawn.png',
  night: 'teyvat-night.png',
  traveler: 'teyvat-traveler.png',
  lantern: 'elemental-lantern.png',
}

const encode = async (name) => {
  const buffer = await readFile(resolve(root, 'assets', assets[name]))
  return `data:image/png;base64,${buffer.toString('base64')}`
}

const [dawn, night, traveler, lantern] = await Promise.all(
  Object.keys(assets).map(encode),
)

const source = `/** Generated from the checked-in original Teyvat-inspired artwork. */
export const GENSHIN_IMPACT_DAWN = ${JSON.stringify(dawn)}
export const GENSHIN_IMPACT_NIGHT = ${JSON.stringify(night)}
export const GENSHIN_IMPACT_TRAVELER = ${JSON.stringify(traveler)}
export const GENSHIN_IMPACT_LANTERN = ${JSON.stringify(lantern)}

const svg = (body: string): string =>
  \`data:image/svg+xml,\${encodeURIComponent(\`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">\${body}</svg>\`)}\`

export const GENSHIN_IMPACT_GOLD_TRIM = svg(\`
  <path d="M0 40h240" stroke="#d9b86c" stroke-width="2" opacity=".62"/>
  <path d="M0 40c26-26 44-26 70 0s44 26 70 0 44-26 70 0 22 22 30 0" fill="none" stroke="#7ed6c1" stroke-width="3" opacity=".74"/>
  <path d="M8 40c22-16 39-16 62 0M170 40c22-16 39-16 62 0" fill="none" stroke="#fff4d5" stroke-width="1" opacity=".8"/>
\`)

export const GENSHIN_IMPACT_GOLD_FRAME = svg(\`
  <path d="M8 8h224v64H8z" fill="none" stroke="#d9b86c" stroke-width="3" opacity=".76"/>
  <path d="M18 18h204v44H18z" fill="none" stroke="#7ed6c1" stroke-width="1" opacity=".68"/>
  <circle cx="8" cy="8" r="5" fill="#e9c778"/><circle cx="232" cy="8" r="5" fill="#e9c778"/>
  <circle cx="8" cy="72" r="5" fill="#e9c778"/><circle cx="232" cy="72" r="5" fill="#e9c778"/>
\`)
`

await mkdir(resolve(root, 'src', 'client'), { recursive: true })
await writeFile(resolve(root, 'src', 'client', 'asset-urls.ts'), source)
