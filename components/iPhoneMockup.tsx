interface IPhoneMockupProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export default function IPhoneMockup({
  imageUrl,
  alt = 'App screenshot',
  className = '',
}: IPhoneMockupProps) {
  return (
    <div className={`relative w-[250px] sm:w-[280px] lg:w-[300px] select-none ${className}`}>
      {/* Grounding shadow */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-neutral-950/25 blur-xl rounded-full"
        aria-hidden="true"
      />

      {/* Titanium frame */}
      <div className="relative aspect-[9/19.5] rounded-[2.8rem] bg-gradient-to-br from-neutral-600 via-neutral-800 to-neutral-950 p-[3px] shadow-2xl shadow-neutral-950/40">
        <div
          className="absolute inset-0 rounded-[2.8rem] ring-1 ring-inset ring-white/15 pointer-events-none"
          aria-hidden="true"
        />

        {/* Side buttons */}
        <span className="absolute -left-[2px] top-[19%] w-[2px] h-7 bg-neutral-700 rounded-l" aria-hidden="true" />
        <span className="absolute -left-[2px] top-[28%] w-[2px] h-11 bg-neutral-700 rounded-l" aria-hidden="true" />
        <span className="absolute -left-[2px] top-[41%] w-[2px] h-11 bg-neutral-700 rounded-l" aria-hidden="true" />
        <span className="absolute -right-[2px] top-[24%] w-[2px] h-14 bg-neutral-700 rounded-r" aria-hidden="true" />

        {/* Bezel / screen well */}
        <div className="relative w-full h-full rounded-[2.4rem] bg-black p-[9px] overflow-hidden">
          <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-neutral-100">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/CICapitalLogo-Ar.png';
              }}
            />
            {/* Glass glare */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-white/0 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Dynamic Island */}
          <div
            className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[86px] h-[24px] bg-black rounded-full ring-1 ring-white/10"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}