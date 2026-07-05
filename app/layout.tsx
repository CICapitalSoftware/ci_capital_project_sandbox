// app/layout.tsx
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

// ✅ Fixed: Playfair Display with valid weights
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // 300 removed – not available
  display: 'swap',
});

export const metadata = {
  title: 'CI Capital | Investment Banking',
  description: 'CI Capital is Egypt\'s premier diversified financial services group…',
  icons: {
    icon: '/CICapitalLogo-Ar.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}