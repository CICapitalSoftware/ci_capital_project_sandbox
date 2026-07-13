'use client';

import { useEffect, useRef } from 'react';

/**
 * Real-time graphic tying the company to Egypt's actual stock market.
 * Embeds TradingView's free "Mini Symbol Overview" widget for EGX30
 * (Egypt's benchmark index) — genuinely live/delayed real market data,
 * not fabricated numbers. No API key required; TradingView's embed
 * widgets are free to use on any site.
 * https://www.tradingview.com/widget/mini-symbol-overview/
 */
export default function EgyptLiveGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear in case of a re-run (e.g. React Strict Mode double-invoke in dev).
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: 'EGX:EGX30',
      width: '100%',
      height: '100%',
      locale: 'en',
      dateRange: '1M',
      colorTheme: 'light',
      trendLineColor: '#0284c7',
      underLineColor: 'rgba(2, 132, 199, 0.15)',
      underLineBottomColor: 'rgba(2, 132, 199, 0)',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-sky-100 shadow-xl bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Faint Egypt silhouette watermark behind the chart */}
      <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none">
        <path
          d="M 90 40 L 190 40 L 195 60 L 210 65 L 215 90 L 205 110 L 210 150 L 200 190 L 195 230 L 180 260 L 150 270 L 120 260 L 105 230 L 95 190 L 85 150 L 80 110 L 85 70 Z"
          fill="#0284c7"
        />
      </svg>

      {/* Header label */}
      <div className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-sky-100 text-xs font-medium text-sky-700 tracking-wide">
        EGX 30 · Egypt's Benchmark Index
      </div>

      {/* Live TradingView widget */}
      <div className="absolute inset-0 pt-16 pb-4 px-4">
        <div ref={containerRef} className="tradingview-widget-container w-full h-full" />
      </div>

      <div className="absolute bottom-3 right-4 z-10 text-[10px] text-neutral-400">
        Live data via TradingView
      </div>
    </div>
  );
}