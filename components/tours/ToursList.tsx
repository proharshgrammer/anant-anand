import TourCard from './TourCard';
import type { Tour } from '@/types';
import { Map } from 'lucide-react';

interface ToursListProps {
  tours: Tour[];
  isLoading: boolean;
}

export default function ToursList({ tours, isLoading }: ToursListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100 shadow-sm flex flex-col">
            <div className="h-56 bg-gray-200 rounded-t-2xl"></div>
            <div className="p-6 flex-grow flex flex-col gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-saffron-50 text-saffron-600 rounded-full flex items-center justify-center mb-4">
          <Map className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No tours found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any tours matching your current filters. Try adjusting your search criteria or resetting filters to see more options.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
