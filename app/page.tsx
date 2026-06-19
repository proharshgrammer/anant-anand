import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeaturedTours from '@/components/home/FeaturedTours';
import EnquiryPopup from '@/components/public/EnquiryPopup';

export const metadata: Metadata = {
  title: 'Anant Anand Tour Packages — Age-Group Based Travel Experiences',
};

// Force dynamic rendering — page uses Supabase server client (cookies)
export const dynamic = 'force-dynamic';

export default function HomePage() {
  // ── LocalBusiness JSON-LD structured data ───────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Anant Anand Tour Packages',
    description: 'Curated travel experiences tailored to every age group — Senior Pilgrims, Families, Youth, and School Groups.',
    url: 'https://anantanandtourpackages.in',
    telephone: '+91 123 456 7890',
    email: 'namaste@anantanand.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Ganga Vihar',
      addressLocality: 'Rishikesh',
      addressRegion: 'Uttarakhand',
      postalCode: '249201',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Tours Section */}
      <FeaturedTours />

      {/* 3. Why Choose Us (Stub) */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Why Choose Anant Anand?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            (Why Choose Us Section - Coming Soon)
          </p>
        </div>
      </section>

      {/* 4. Destination Highlights (Stub) */}
      <section className="py-24 bg-gray-50 text-center border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Top Destinations</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            (Destination Highlights Section - Coming Soon)
          </p>
        </div>
      </section>

      {/* 5. Testimonials (Stub) */}
      <section className="py-24 bg-royal-900 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-8">What Our Travellers Say</h2>
          <p className="text-royal-100 max-w-2xl mx-auto">
            (Testimonials Section - Coming Soon)
          </p>
        </div>
      </section>

      {/* 6. Blog Preview (Stub) */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Travel Stories & Tips</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            (Blog Preview Section - Coming Soon)
          </p>
        </div>
      </section>

      {/* 7. Enquiry Strip (Stub) */}
      <section className="py-16 bg-saffron-50 text-center border-t border-saffron-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your journey?</h2>
          <p className="text-gray-600 mb-8">
            (Enquiry Strip - Coming Soon)
          </p>
        </div>
      </section>

      {/* 5-second delayed enquiry popup on homepage (LEAD-01, D-01) */}
      <EnquiryPopup sourcePage="/" delayMs={5000} />
    </div>
    </>
  );
}
