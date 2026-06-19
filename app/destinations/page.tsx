import type { Metadata } from 'next';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Destination } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Top Destinations in India | Anant Anand',
  description: 'Explore the top spiritual and scenic destinations in India.',
};

async function getDestinations(): Promise<Destination[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load destinations:', error.message);
    return [];
  }

  return (data ?? []) as unknown as Destination[];
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  const regionSet = new Set(destinations.map((d) => d.region).filter((r): r is string => !!r));
  const regions = Array.from(regionSet);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4">
            Discover Incredible Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From the spiritual ghats of the Ganges to the serene backwaters of Kerala, find the perfect backdrop for your next journey.
          </p>
        </div>

        {/* Region Filter */}
        {regions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['All Regions', ...regions].map((region) => (
              <button
                key={region}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  region === 'All Regions'
                    ? 'bg-royal-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-royal-50 hover:text-royal-800 border border-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {/* Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">No destinations available yet.</p>
            </div>
          ) : (
            destinations.map((dest) => (
              <Link 
                key={dest.id} 
                href={`/tours?destination=${dest.slug}`}
                className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3]"
              >
                <img 
                  src={dest.image ?? '/placeholder-destination.svg'} 
                  alt={dest.image_alt ?? dest.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {dest.region && (
                    <p className="text-saffron-400 text-sm font-semibold mb-1 uppercase tracking-wider">
                      {dest.region}
                    </p>
                  )}
                  <h2 className="text-3xl font-display font-bold text-white mb-2">
                    {dest.name}
                  </h2>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
