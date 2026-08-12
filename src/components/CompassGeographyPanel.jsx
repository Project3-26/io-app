import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, Map, Navigation, X } from 'lucide-react'
import { getChapterGeography, getPreviewChapterGeography } from '../services/compass'

export default function CompassGeographyPanel({ chapterId, feature, onClose }) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })
  const mapNodeRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    const previewData = getPreviewChapterGeography(chapterId)
    if (previewData) {
      setState({ loading: false, data: previewData, error: '' })
      return () => controller.abort()
    }

    getChapterGeography(chapterId, { signal: controller.signal })
      .then((data) => setState({ loading: false, data, error: '' }))
      .catch((error) => {
        if (error?.code === 'REQUEST_CANCELLED') return
        setState({ loading: false, data: null, error: error?.message || 'Place context is unavailable right now.' })
      })

    return () => controller.abort()
  }, [chapterId])

  useEffect(() => {
    const interactive = Boolean(feature?.interactiveMapsEnabled && state.data?.mapStyleUrl)
    if (!interactive || !mapNodeRef.current || mapRef.current) return undefined

    let cancelled = false
    let map
    Promise.all([
      import('maplibre-gl'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ]).then(([maplibre]) => {
      if (cancelled || !mapNodeRef.current) return
      map = new maplibre.Map({
        container: mapNodeRef.current,
        style: state.data.mapStyleUrl,
        bounds: state.data.bounds || undefined,
        fitBoundsOptions: { padding: 48, maxZoom: 8 },
        attributionControl: true,
      })
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right')
      map.on('load', () => {
        for (const place of state.data.places || []) {
          const marker = document.createElement('button')
          marker.type = 'button'
          marker.className = place.isStoryLocation ? 'biblical-map-marker biblical-map-marker-current' : 'biblical-map-marker'
          marker.setAttribute('aria-label', place.name)
          marker.innerHTML = place.isStoryLocation ? '<span aria-hidden="true">▲</span>' : '<span aria-hidden="true">●</span>'
          const popup = new maplibre.Popup({ offset: 22, closeButton: false }).setHTML(
            `<strong>${escapeHtml(place.name)}</strong>${place.summary ? `<p>${escapeHtml(place.summary)}</p>` : ''}`,
          )
          new maplibre.Marker({ element: marker, anchor: 'bottom' })
            .setLngLat([place.longitude, place.latitude])
            .setPopup(popup)
            .addTo(map)
        }
        for (const route of state.data.routes || []) {
          if (!Array.isArray(route.coordinates) || route.coordinates.length < 2) continue
          const isComparisonRoute = route.kind === 'comparison'
          map.addSource(`route-${route.id}`, {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route.coordinates } },
          })
          map.addLayer({
            id: `route-${route.id}`,
            type: 'line',
            source: `route-${route.id}`,
            paint: {
              'line-color': isComparisonRoute ? '#9fb4c4' : '#2bb9d0',
              'line-width': isComparisonRoute ? 2 : 3.5,
              'line-opacity': isComparisonRoute ? 0.75 : 0.95,
              'line-dasharray': isComparisonRoute ? [2, 1.5] : [1, 0],
            },
          })
        }
      })
      mapRef.current = map
    })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
    }
  }, [feature?.interactiveMapsEnabled, state.data])

  const data = state.data
  const showMap = Boolean(feature?.interactiveMapsEnabled && data?.mapStyleUrl)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:p-6">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close place context" />
      <section className="relative z-[101] flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#071a2d] text-white shadow-2xl shadow-black/50">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/40 bg-white text-[#168ee8] shadow-lg shadow-black/25"><Navigation size={21} fill="currentColor" /></span>
            <div><div className="text-sm font-semibold">Where we are</div><div className="text-[11px] text-slate-400">{feature?.previewOnly ? 'John 4 interactive-map pilot' : 'Biblical places in this chapter'}</div></div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-white/5 hover:text-white" aria-label="Close place context"><X size={18} /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {state.loading && <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin" /> Loading place context…</div>}
          {state.error && <div className="m-5 border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-100">{state.error}</div>}
          {data && <>
            {showMap ? <div ref={mapNodeRef} className="h-64 w-full bg-[#0b2a43] sm:h-80" aria-label="Interactive biblical map" /> : <div className="flex min-h-44 items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_50%_35%,#164d68_0%,#092940_42%,#071a2d_72%)] px-6 text-center"><div><Map size={28} className="mx-auto text-cyan-300" /><p className="mt-3 text-sm font-medium text-slate-200">Interactive map is currently unavailable.</p><p className="mt-1 text-xs leading-5 text-slate-400">The chapter’s approved place context is still available below.</p></div></div>}
            <div className="space-y-5 p-4 sm:p-5">
              {data.summary && <p className="text-sm leading-6 text-slate-300">{data.summary}</p>}
              <div className="space-y-3">{(data.places || []).map((place) => <article key={place.id} className="border border-white/10 bg-white/[0.04] p-3.5"><div className="flex items-start gap-3"><span className={place.isStoryLocation ? 'mt-0.5 text-[#2da9f5]' : 'mt-0.5 text-cyan-300'}>{place.isStoryLocation ? <Navigation size={17} fill="currentColor" /> : <Map size={17} />}</span><div><h3 className="text-sm font-semibold text-white">{place.name}</h3>{place.ancientRegion && <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-cyan-300">{place.ancientRegion}</p>}{place.summary && <p className="mt-2 text-sm leading-6 text-slate-300">{place.summary}</p>}</div></div></article>)}</div>
              {data.routeComparison && <section className="border border-cyan-300/20 bg-cyan-300/[0.06] p-3.5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Why this route matters</p><h3 className="mt-1 text-sm font-semibold text-white">{data.routeComparison.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{data.routeComparison.body}</p></section>}
              {data.routes?.length > 0 && <div className="border-t border-white/10 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Journey context</p>{data.routes.map((route) => <div key={route.id} className="mt-2 flex gap-2 text-sm leading-6 text-slate-300"><span className={route.kind === 'comparison' ? 'mt-2 h-0.5 w-5 shrink-0 border-t-2 border-dashed border-slate-400' : 'mt-2 h-0.5 w-5 shrink-0 bg-cyan-300'} /><p><span className="font-semibold text-white">{route.name}.</span> {route.summary}</p></div>)}</div>}
              <footer className="border-t border-white/10 pt-4 text-[11px] leading-5 text-slate-500">
                © 2026 Project 3|26. Original biblical map design, place context, and route materials are protected. Third-party map and research sources are credited in Map Sources & Attribution.
              </footer>
            </div>
          </>}
        </div>
      </section>
    </div>
  )
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]))
}
