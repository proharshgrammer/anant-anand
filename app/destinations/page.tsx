import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Top Destinations in India | Anant Anand',
  description: 'Explore the top spiritual and scenic destinations in India.',
};

// Stubbing destinations data as no API is specified yet.
const destinations = [
  {
    id: 1,
    name: 'Haridwar',
    region: 'North India',
    image: 'https://images.unsplash.com/photo-1603058862899-7bce2d1dd2cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 12,
  },
  {
    id: 2,
    name: 'Char Dham',
    region: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1626083076891-b9247ebdebc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 8,
  },
  {
    id: 3,
    name: 'Rishikesh',
    region: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 15,
  },
  {
    id: 4,
    name: 'Manali',
    region: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 10,
  },
  {
    id: 5,
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 9,
  },
  {
    id: 6,
    name: 'Kerala',
    region: 'South India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    toursCount: 14,
  },
];

export default function DestinationsPage() {
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

        {/* Region Filter Stub */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['All Regions', 'North India', 'Uttarakhand', 'Himachal Pradesh', 'South India'].map((region) => (
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

        {/* Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link 
              key={dest.id} 
              href={`/tours?destination=${dest.name.toLowerCase()}`}
              className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3]"
            >
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-saffron-400 text-sm font-semibold mb-1 uppercase tracking-wider">
                  {dest.region}
                </p>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  {dest.name}
                </h2>
                <p className="text-gray-300 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {dest.toursCount} Tours Available →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
