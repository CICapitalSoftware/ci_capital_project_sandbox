// components/FlipStatCard.tsx
"use client";

import { useState } from 'react';

interface Stat {
  value: string;
  label: string;
  description?: string;
}

export default function FlipStatCard({ stat }: { stat: Stat }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="bg-white shadow-lg border border-sky-100 p-6 text-center cursor-pointer h-48 w-full relative"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-3xl md:text-4xl font-bold text-sky-600">
            {stat.value}
          </div>
          <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
          <div className="text-[10px] text-neutral-400 mt-2">(click to flip)</div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 bg-white border border-sky-100 rounded-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-sm text-neutral-600 text-center">
            {stat.description || 'No additional info'}
          </p>
        </div>
      </div>
    </div>
  );
}