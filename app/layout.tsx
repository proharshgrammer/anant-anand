import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Tiro_Devanagari_Sanskrit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const tiroDevanagari = Tiro_Devanagari_Sanskrit({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-tiro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Anant Anand Tour Packages — Age-Group Based Travel Experiences',
    template: '%s | Anant Anand Tour Packages',
  },
  description:
    'Discover curated travel experiences tailored to your age group — Senior Pilgrims, Families, Youth, and School Groups. Explore India with Anant Anand Tour Packages.',
  keywords: [
    'tour packages India',
    'pilgrimage tours',
    'family holidays India',
    'senior travel',
    'Char Dham yatra',
    'North India tours',
    'Anant Anand tours',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://anantanandtourpackages.in',
    siteName: 'Anant Anand Tour Packages',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${tiroDevanagari.variable}`}
    >
      <body className="font-body bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
