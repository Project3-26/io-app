const MAPTILER_BASE_URL = 'https://api.maptiler.com/'
const ALLOWED_PATHS = ['maps/', 'tiles/', 'fonts/', 'sprites/']

export default async function handler(request, response) {
  const apiKey = process.env.MAPTILER_API_KEY || process.env.VITE_MAPTILER_API_KEY
  const requestUrl = new URL(request.url, `https://${request.headers.host}`)
  const resource = requestUrl.searchParams.get('resource') || ''

  if (!apiKey) {
    response.status(503).json({ error: 'Map service is not configured.' })
    return
  }

  if (!isAllowedResource(resource)) {
    response.status(400).json({ error: 'Invalid map resource.' })
    return
  }

  const mapTilerUrl = new URL(resource.replace(/^\//, ''), MAPTILER_BASE_URL)
  mapTilerUrl.searchParams.set('key', apiKey)

  try {
    const mapTilerResponse = await fetch(mapTilerUrl)
    const body = Buffer.from(await mapTilerResponse.arrayBuffer())
    const contentType = mapTilerResponse.headers.get('content-type') || 'application/octet-stream'

    response.setHeader('Content-Type', contentType)
    response.setHeader('Cache-Control', mapTilerResponse.ok ? 'public, max-age=3600, s-maxage=86400' : 'no-store')
    response.status(mapTilerResponse.status).send(body)
  } catch {
    response.status(502).json({ error: 'Map service is temporarily unavailable.' })
  }
}

function isAllowedResource(resource) {
  if (!resource || resource.includes('://') || resource.includes('..')) return false
  const path = resource.replace(/^\//, '')
  return ALLOWED_PATHS.some((prefix) => path.startsWith(prefix))
}
