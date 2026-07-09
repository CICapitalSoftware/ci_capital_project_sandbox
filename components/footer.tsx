// components/Footer.tsx
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold uppercase tracking-tight">CI Capital</h3>
          <p className="mt-4 text-neutral-300 text-sm max-w-md leading-relaxed">
            CI Capital is a premier diversified financial services group in Egypt, offering institutional investment banking, asset management, and non-banking credit solutions.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><a href="#about" className="hover:text-white transition-colors">Our Firm</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Solutions</a></li>
            <li><a href="#media" className="hover:text-white transition-colors">Media Relations</a></li>
            <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Subscribe to our newsletter</h4>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Email address"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-400">
        <p>© 2026 CI Capital. All rights reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}