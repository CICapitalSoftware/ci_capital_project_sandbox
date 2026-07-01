"use client";

import React from 'react';

export default function IRContactsPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          Investor Relations Contacts
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          Connect with our investor relations team
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact person 1 */}
        <div className="bg-white border border-sky-100 shadow-sm p-6">
          <h3 className="text-xl font-light text-neutral-950 uppercase tracking-tight mb-2">Head of Investor Relations</h3>
          <p className="text-sm text-neutral-700 font-medium">Ahmed El-Sayed</p>
          <p className="text-sm text-neutral-500 mt-1">a.elsayed@cicapital.com</p>
          <p className="text-sm text-neutral-500">+20 (2) 2345 6789 ext. 101</p>
        </div>

        <div className="bg-white border border-sky-100 shadow-sm p-6">
          <h3 className="text-xl font-light text-neutral-950 uppercase tracking-tight mb-2">Investor Relations Manager</h3>
          <p className="text-sm text-neutral-700 font-medium">Mona Ibrahim</p>
          <p className="text-sm text-neutral-500 mt-1">m.ibrahim@cicapital.com</p>
          <p className="text-sm text-neutral-500">+20 (2) 2345 6789 ext. 102</p>
        </div>
      </div>

      <div className="mt-12 bg-sky-50 border border-sky-100 p-8 text-center">
        <h2 className="text-xl font-light text-neutral-950 uppercase tracking-tight mb-4">General Inquiries</h2>
        <p className="text-neutral-700 text-sm max-w-2xl mx-auto">
          For general investor relations inquiries, please email us at <span className="text-sky-600 font-medium">investors@cicapital.com</span> or call <span className="text-sky-600 font-medium">+20 (2) 2345 6789</span>.
        </p>
      </div>
    </section>
  );
}