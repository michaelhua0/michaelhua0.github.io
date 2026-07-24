import { mkdir, writeFile } from 'node:fs/promises'

const serverDirectory = new URL('../dist/server/', import.meta.url)
const serverEntry = new URL('index.js', serverDirectory)

const workerSource = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const url = new URL(request.url)
    const isPageRequest = !url.pathname.split('/').pop()?.includes('.')

    if (!isPageRequest) {
      return response
    }

    const indexUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}
`

await mkdir(serverDirectory, { recursive: true })
await writeFile(serverEntry, workerSource)
