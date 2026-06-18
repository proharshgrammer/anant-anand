'use client';

import { useEffect, useState, Suspense } from 'react';
import { useFilterUrlSync } from '@/hooks/useFilterUrlSync';
import { useFilterStore } from '@/lib/store/tourFilters';
import { getPublicTours } from '@/lib/supabase/queries/tours';
import { createClient } from '@/lib/supabase/client';
import ToursFilterPanel from '@/components/tours/ToursFilterPanel';
import ToursList from '@/components/tours/ToursList';
import type { Tour } from '@/types';
import { ArrowUpDown } from 'lucide-react';

function ToursContent() {
  const { isInitialized } = useFilterUrlSync();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  const filters = useFilterStore((state) => ({
    ageGroup: state.ageGroup,
    category: state.category,
    duration: state.duration,
    budget: state.budget,
    sort: state.sort,
  }));

  const { sort, setFilter } = useFilterStore();

  useEffect(() => {
    if (!isInitialized) return;

    let isMounted = true;
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const data = await getPublicTours(supabase, filters);
        if (isMounted) setTours(data);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
    };
  }, [filters, isInitialized]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Explore Tours</h1>
          <p className="text-gray-500 text-lg">Find the perfect journey for your next adventure.</p>
        </div>
        
        {/* Sort Dropdown */}
        <div className="mt-6 md:mt-0 flex items-center space-x-3">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 flex items-center">
            <ArrowUpDown className="w-4 h-4 mr-1 text-gray-400" />
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setFilter('sort', e.target.value as any)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm rounded-md bg-white shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <ToursFilterPanel />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <ToursList tours={tours} isLoading={!isInitialized || isLoading} />
        </main>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
        </div>
      }>
        <ToursContent />
      </Suspense>
    </div>
  );
}
