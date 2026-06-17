import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anant Anand Tour Packages — Coming Soon',
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-teal-700">
      <div className="text-center text-white px-6">
        <h1 className="font-display text-5xl font-bold mb-4">
          Anant Anand Tour Packages
        </h1>
        <p className="font-devanagari text-2xl text-cream-200 mb-2">
          अनंत आनंद टूर पैकेजेस
        </p>
        <p className="text-teal-100 text-lg mt-4">
          Age-Group Based Travel Experiences • Coming Soon
        </p>
        <a
          href="/admin/login"
          className="inline-block mt-8 px-6 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-cream-100 transition-colors"
        >
          Admin Login →
        </a>
      </div>
    </main>
  );
}
