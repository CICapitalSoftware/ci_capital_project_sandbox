'use client';

import { useState } from 'react';

export interface OfficeLocation {
  city: string;
  address: string;
  phone?: string;
  /** Either provide lat/lng, or a plain-text query (e.g. full address) — one is required. */
  lat?: number;
  lng?: number;
  mapQuery?: string;
}

interface OfficeLocationsProps {
  offices: OfficeLocation[];
  title?: string;
}

/**
 * Uses Google Maps' unauthenticated embed format (maps.google.com/maps?...&output=embed),
 * which needs no API key. Good enough for a simple pin + pan/zoom; if you later want custom
 * styling or multiple pins on one map, that requires the Maps Embed API and a key.
 */
function buildMapSrc(office: OfficeLocation) {
  const query =
    office.lat != null && office.lng != null
      ? `${office.lat},${office.lng}`
      : office.mapQuery || office.address;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default function OfficeLocations({ offices, title = 'Our Offices' }: OfficeLocationsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!offices || offices.length === 0) return null;
  const active = offices[activeIdx];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-neutral-100">
      <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight text-center mb-12">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Office list */}
        <div className="w-full md:w-1/3 space-y-2">
          {offices.map((office, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={office.city + idx}
                onClick={() => setActiveIdx(idx)}
                aria-pressed={isActive}
                className={`w-full text-left p-5 border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 ${
                  isActive
                    ? 'border-sky-600 bg-sky-50'
                    : 'border-neutral-200 hover:border-sky-300'
                }`}
              >
                <div
                  className={`text-lg font-medium ${
                    isActive ? 'text-sky-600' : 'text-neutral-950'
                  }`}
                >
                  {office.city}
                </div>
                <div className="text-neutral-600 text-sm mt-1 leading-relaxed">
                  {office.address}
                </div>
                {office.phone && (
                  <div className="text-neutral-500 text-sm mt-1">{office.phone}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3">
          <div className="relative w-full shadow-sm" style={{ aspectRatio: '4 / 3' }}>
            <iframe
              key={activeIdx}
              src={buildMapSrc(active)}
              title={`Map showing our ${active.city} office`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}