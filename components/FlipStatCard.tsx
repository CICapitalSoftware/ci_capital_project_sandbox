// components/FlipStatCard.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: string;
  label: string;
  description?: string;
}

// Splits a value like "$1,200+" or "30%" or "500" into prefix/number/suffix
// so the numeric part can be animated while everything around it (currency
// signs, commas, %, +) is preserved exactly as authored.
function parseStatValue(raw: string) {
  const match = raw.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
  if (!match) {
    return { prefix: '', numeric: null as number | null, suffix: raw, decimals: 0, hasCommas: false };
  }
  const [, prefix, numberPart, suffix] = match;
  const hasCommas = numberPart.includes(',');
  const cleaned = numberPart.replace(/,/g, '');
  const numeric = parseFloat(cleaned);
  const decimalMatch = cleaned.match(/\.(\d+)$/);
  const decimals = decimalMatch ? decimalMatch[1].length : 0;
  return { prefix, numeric: isNaN(numeric) ? null : numeric, suffix, decimals, hasCommas };
}

function formatNumber(n: number, decimals: number, hasCommas: boolean) {
  const fixed = n.toFixed(decimals);
  if (!hasCommas) return fixed;
  const [whole, dec] = fixed.split('.');
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${withCommas}.${dec}` : withCommas;
}

function useCountUp(targetValue: string, active: boolean, durationMs = 1500) {
  const [display, setDisplay] = useState<string>(() => {
    const { prefix, numeric, suffix, decimals, hasCommas } = parseStatValue(targetValue);
    if (numeric === null) return targetValue;
    return `${prefix}${formatNumber(0, decimals, hasCommas)}${suffix}`;
  });
  const hasRunRef = useRef(false);

  useEffect(() => {
    const { prefix, numeric, suffix, decimals, hasCommas } = parseStatValue(targetValue);

    if (numeric === null) {
      setDisplay(targetValue);
      return;
    }

    if (!active || hasRunRef.current) return;
    hasRunRef.current = true;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic — fast start, gentle settle, feels more natural than linear.
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      setDisplay(`${prefix}${formatNumber(current, decimals, hasCommas)}${suffix}`);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(`${prefix}${formatNumber(numeric, decimals, hasCommas)}${suffix}`);
      }
    };

    requestAnimationFrame(tick);
  }, [active, targetValue, durationMs]);

  return display;
}

export default function FlipStatCard({ stat }: { stat: Stat }) {
  const [flipped, setFlipped] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    // Respect prefers-reduced-motion — show the final value immediately.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animatedValue = useCountUp(stat.value, inView);

  return (
    <div
      ref={cardRef}
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
          <div className="text-3xl md:text-4xl font-bold text-sky-600 tabular-nums">
            {animatedValue}
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