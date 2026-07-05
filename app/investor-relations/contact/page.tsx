export default function IRContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-4">
        Investor Relations Contacts
      </h1>
      <div className="h-1 w-16 bg-sky-600 mb-6"></div>
      <p className="text-neutral-700 text-lg max-w-3xl">
        Contact details for the Investor Relations team, including email, phone, 
        and mailing address.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sky-50 border border-sky-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">Primary Contact</h3>
          <p className="mt-2 text-neutral-700">investor.relations@cicapital.com</p>
          <p className="text-neutral-700">+20 2 1234 5678</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-700">Address</h3>
          <p className="mt-2 text-neutral-700">Cairo, Egypt</p>
        </div>
      </div>
    </section>
  );
}