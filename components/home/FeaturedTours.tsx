import Link from 'next/link';
import { getFeaturedTours } from '@/lib/supabase/queries/tours';
import { createServerClient } from '@/lib/supabase/server';
import { Clock, MapPin, IndianRupee } from 'lucide-react';

export default async function FeaturedTours() {
  const supabase = createServerClient();
  const tours = await getFeaturedTours(supabase);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-saffron-600 font-semibold tracking-wide uppercase">Featured Journeys</h2>
          <p className="mt-2 text-3xl leading-8 font-display font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Most Popular Packages
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Carefully curated itineraries that showcase the best of India's spiritual and natural heritage.
          </p>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">More featured tours coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.hero_image || 'https://images.unsplash.com/photo-1514222134-b57fbb8ce073?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={tour.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-royal-800 shadow-sm">
                    {tour.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                    <Link href={`/tours/${tour.slug}`} className="hover:text-saffron-600 transition-colors">
                      {tour.title}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-saffron-500" />
                      {tour.duration_days} Days
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-900 font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span className="text-xl">{tour.price_per_person?.toLocaleString('en-IN') || 'On Request'}</span>
                    </div>
                    <Link 
                      href={`/tours/${tour.slug}`}
                      className="text-royal-600 font-medium hover:text-royal-800 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link 
            href="/tours"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-royal-700 hover:bg-royal-800 transition-colors duration-300"
          >
            Explore All Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
