import { cp, mkdir, rm, stat, writeFile } from 'node:fs/promises'

const output = new URL('./app/out/', import.meta.url)
const destination = new URL('./site-dist/', import.meta.url)

await stat(output)
await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(output, destination, { recursive: true })
await cp(new URL('./app/LICENSE', import.meta.url), new URL('PIP-LICENSE.txt', destination))
await writeFile(new URL('.nojekyll', destination), '')

console.log('Packaged the complete playable Hold’em app, its MIT license, and Pages static-asset support.')
