'use client';

import { useEffect, useRef, useState } from 'react';

export interface OfficeLocation {
  city: string;
  address: string;
  phone?: string;
  /** Strongly preferred — avoids a runtime geocoding lookup entirely. */
  lat?: number;
  lng?: number;
  /** Fallback only, used to geocode via OpenStreetMap Nominatim if lat/lng are missing. */
  mapQuery?: string;
}

interface OfficeLocationsProps {
  offices: OfficeLocation[];
  title?: string;
}

const LEAFLET_CSS_ID = 'leaflet-css';
const LEAFLET_JS_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS_SRC = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

let leafletPromise: Promise<void> | null = null;

function loadLeaflet(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).L) return Promise.resolve();
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const link = document.createElement('link');
      link.id = LEAFLET_CSS_ID;
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_SRC;
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Leaflet script'));
    document.head.appendChild(script);
  });

  return leafletPromise;
}

// Free, no-key geocoding fallback via OpenStreetMap Nominatim.
// Fair-use only — prefer setting lat/lng directly in Strapi when possible.
async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const results = await res.json();
    if (results?.[0]) {
      return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
    }
    return null;
  } catch (err) {
    console.error(`[OfficeLocations] Geocoding failed for "${query}":`, err);
    return null;
  }
}

const DEFAULT_ICON_HTML = `<div style="
  width:18px;height:18px;border-radius:50%;
  background:#0284c7;border:2px solid #ffffff;
  box-shadow:0 1px 4px rgba(0,0,0,0.3);
"></div>`;

const ACTIVE_ICON_HTML = `<div style="
  width:22px;height:22px;border-radius:50%;
  background:#0c4a6e;border:3px solid #ffffff;
  box-shadow:0 2px 6px rgba(0,0,0,0.4);
"></div>`;

export default function OfficeLocations({ offices, title = 'Our Offices' }: OfficeLocationsProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  // Parallel to `offices` — null where geocoding/coords failed for that entry.
  const markersRef = useRef<Array<any | null>>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [readyIdxSet, setReadyIdxSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!offices || offices.length === 0) return;
    let cancelled = false;

    loadLeaflet()
      .then(async () => {
        if (cancelled || !mapContainerRef.current) return;
        const L = (window as any).L;

        // Guard against React Strict Mode's mount→cleanup→mount cycle in dev,
        // which was tearing the map down mid-interaction and causing a
        // "Cannot read properties of null (reading 'offsetWidth')" crash.
        const existingId = (mapContainerRef.current as any)._leaflet_id;
        if (existingId && mapInstanceRef.current) {
          return;
        }

        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        });
        mapInstanceRef.current = map;

        // CARTO's "Positron, no labels" tiles: free, no API key, light/white
        // base with minimal clutter.
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        const makeIcon = (html: string) =>
          L.divIcon({ className: '', html, iconSize: [22, 22], iconAnchor: [11, 11] });

        const resolved = await Promise.all(
          offices.map(async (office, idx) => {
            if (office.lat != null && office.lng != null) {
              return { idx, office, lat: office.lat, lng: office.lng };
            }
            const coords = await geocodeAddress(office.mapQuery || office.address);
            return coords ? { idx, office, ...coords } : null;
          })
        );

        if (cancelled) return;

        const validPoints = resolved.filter(Boolean) as Array<{
          idx: number;
          office: OfficeLocation;
          lat: number;
          lng: number;
        }>;

        if (validPoints.length === 0) {
          setError('Could not locate any offices on the map.');
          return;
        }

        const markers: any[] = [];
        const nextMarkersRef: Array<any | null> = new Array(offices.length).fill(null);
        const readyIdxs = new Set<number>();

        validPoints.forEach(({ idx, office, lat, lng }) => {
          const marker = L.marker([lat, lng], { icon: makeIcon(DEFAULT_ICON_HTML) });
          marker.addTo(map);
          marker.bindPopup(
            `<div style="font-family:sans-serif;">
              <strong style="color:#0c4a6e;">${office.city}</strong><br/>
              <span style="color:#475569;font-size:13px;">${office.address}</span>
              ${office.phone ? `<br/><span style="color:#475569;font-size:13px;">${office.phone}</span>` : ''}
            </div>`
          );

          // Hover shows the popup without needing a click.
          marker.on('mouseover', () => marker.openPopup());
          marker.on('mouseout', () => marker.closePopup());
          // Clicking the pin itself also highlights the matching card.
          marker.on('click', () => setActiveIdx(idx));

          markers.push(marker);
          nextMarkersRef[idx] = marker;
          readyIdxs.add(idx);
        });

        markersRef.current = nextMarkersRef;
        setReadyIdxSet(readyIdxs);

        if (validPoints.length === 1) {
          map.setView([validPoints[0].lat, validPoints[0].lng], 13);
        } else {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds(), { padding: [40, 40] });
        }
      })
      .catch((err) => {
        console.error('[OfficeLocations]', err);
        if (!cancelled) setError('Map failed to load.');
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          // Container may already be detached — safe to ignore.
        }
        mapInstanceRef.current = null;
      }
    };
  }, [offices]);

  // Keep marker icons in sync with which card is active, and restyle the
  // previously active one back to normal.
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;
    markersRef.current.forEach((marker, idx) => {
      if (!marker) return;
      marker.setIcon(
        L.divIcon({
          className: '',
          html: idx === activeIdx ? ACTIVE_ICON_HTML : DEFAULT_ICON_HTML,
          iconSize: idx === activeIdx ? [22, 22] : [18, 18],
          iconAnchor: idx === activeIdx ? [11, 11] : [9, 9],
        })
      );
    });
  }, [activeIdx]);

  const handleCardClick = (idx: number) => {
    setActiveIdx(idx);
    const marker = markersRef.current[idx];
    const map = mapInstanceRef.current;
    if (marker && map) {
      map.flyTo(marker.getLatLng(), 15, { duration: 0.75 });
      marker.openPopup();
    }
  };

  if (!offices || offices.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-neutral-100">
      <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight text-center mb-12">
        {title}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:h-[520px]">
        {/* Scrollable office list */}
        <div className="relative w-full lg:w-1/3 lg:h-full">
          <div className="lg:h-full lg:overflow-y-auto pr-1 space-y-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:#0284c7_#f0f9ff]">
          {offices.map((office, idx) => {
            const isActive = idx === activeIdx;
            const isClickable = readyIdxSet.has(idx);
            return (
              <button
                key={office.city + idx}
                onClick={() => isClickable && handleCardClick(idx)}
                onMouseEnter={() => {
                  if (!isClickable) return;
                  setActiveIdx(idx);
                  markersRef.current[idx]?.openPopup();
                }}
                onMouseLeave={() => {
                  if (!isClickable) return;
                  markersRef.current[idx]?.closePopup();
                }}
                disabled={!isClickable}
                aria-pressed={isActive}
                className={`w-full text-left p-5 border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 ${
                  isActive ? 'border-sky-600 bg-sky-50' : 'border-neutral-200 hover:border-sky-300'
                } ${!isClickable ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`text-lg font-medium ${isActive ? 'text-sky-600' : 'text-neutral-950'}`}>
                  {office.city}
                </div>
                <div className="text-neutral-600 text-sm mt-1 leading-relaxed">{office.address}</div>
                {office.phone && <div className="text-neutral-500 text-sm mt-1">{office.phone}</div>}
              </button>
            );
          })}
          </div>
          {/* Fade hint indicating more offices below when scrollable */}
          <div className="hidden lg:block pointer-events-none absolute bottom-0 left-0 right-1 h-10 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="w-full lg:w-2/3 lg:h-full">
          <div className="relative w-full h-[360px] lg:h-full shadow-sm">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-sky-50 text-sky-900 text-sm px-6 text-center">
                {error}
              </div>
            ) : (
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}