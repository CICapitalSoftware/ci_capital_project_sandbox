export default function MediaKitPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-4">
        Media Kit
      </h1>
      <div className="h-1 w-16 bg-sky-600 mb-6"></div>
      <p className="text-neutral-700 text-lg max-w-3xl">
        Downloadable assets including logos, brand guidelines, executive bios, 
        high-resolution images, and corporate fact sheets.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 border border-sky-100 p-6 text-center">
          <div className="text-4xl mb-2">📄</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">Fact Sheet</h3>
          <p className="text-xs text-neutral-500 mt-1">PDF - 2MB</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">Logo Pack</h3>
          <p className="text-xs text-neutral-500 mt-1">ZIP - 5MB</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6 text-center">
          <div className="text-4xl mb-2">👤</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">Executive Bios</h3>
          <p className="text-xs text-neutral-500 mt-1">PDF - 1MB</p>
        </div>
      </div>
    </section>
  );
}