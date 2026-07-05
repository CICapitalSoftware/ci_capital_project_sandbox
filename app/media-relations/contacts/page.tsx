export default function MediaContactsPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-4">
        Media Contacts
      </h1>
      <div className="h-1 w-16 bg-sky-600 mb-6"></div>
      <p className="text-neutral-700 text-lg max-w-3xl">
        Contact information for media inquiries, press accreditation, and interview requests.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sky-50 border border-sky-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">Media Relations Team</h3>
          <p className="mt-2 text-neutral-700">media@cicapital.com</p>
          <p className="text-neutral-700">+20 2 1234 5678</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">Press Inquiries</h3>
          <p className="mt-2 text-neutral-700">press@cicapital.com</p>
          <p className="text-neutral-700">+20 2 8765 4321</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">Address</h3>
          <p className="mt-2 text-neutral-700">Cairo, Egypt</p>
          <p className="text-neutral-700 text-sm mt-1">For urgent media inquiries, please call the media hotline.</p>
        </div>
      </div>
    </section>
  );
}