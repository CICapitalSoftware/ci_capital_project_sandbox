// app/layout.tsx
import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";

// Load a high-performance, razor-thin corporate font vector straight from Google
const financialSans = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-financial-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CI Capital | Institutional Architecture Portal",
  description: "Enterprise portfolio layout configured with thin-ruled financial typography layers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${financialSans.variable} antialiased bg-stone-50 text-neutral-950`}>
        {children}
      </body>
    </html>
  );
}