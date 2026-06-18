'use client';

import { useFilterStore } from '@/lib/store/tourFilters';
import type { AgeGroup, TourCategory } from '@/types';
import { Filter, X } from 'lucide-react';

const AGE_GROUPS: { value: AgeGroup | 'all'; label: string }[] = [
  { value: 'all', label: 'All Ages' },
  { value: 'senior', label: 'Senior Pilgrims' },
  { value: 'family', label: 'Families' },
  { value: 'youth', label: 'Youth & Couples' },
  { value: 'school', label: 'School Groups' },
];

const CATEGORIES: { value: TourCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'spiritual', label: 'Spiritual & Pilgrimage' },
  { value: 'heritage', label: 'Heritage & Culture' },
  { value: 'hill_station', label: 'Hill Stations' },
  { value: 'trek', label: 'Trekking & Adventure' },
  { value: 'wildlife', label: 'Wildlife Safari' },
  { value: 'beach', label: 'Beaches & Coastal' },
];

const DURATIONS = [
  { value: 'all', label: 'Any Duration' },
  { value: '1-3', label: '1 - 3 Days' },
  { value: '4-7', label: '4 - 7 Days' },
  { value: '8+', label: '8+ Days' },
];

const BUDGETS = [
  { value: 'all', label: 'Any Budget' },
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10k-25k', label: '₹10,000 - ₹25,000' },
  { value: '25k-50k', label: '₹25,000 - ₹50,000' },
  { value: '50k+', label: 'Above ₹50,000' },
];

export default function ToursFilterPanel() {
  const {
    ageGroup,
    category,
    duration,
    budget,
    setFilter,
    resetFilters,
  } = useFilterStore();

  const handleReset = () => {
    resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key: any, value: any) => {
    setFilter(key, value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center font-display">
          <Filter className="w-5 h-5 mr-2 text-saffron-600" />
          Filters
        </h2>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-saffron-600 flex items-center transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Reset All
        </button>
      </div>

      <div className="space-y-8">
        {/* Age Group Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Age Group</h3>
        <div className="space-y-2">
          {AGE_GROUPS.map((group) => (
            <label key={group.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="ageGroup"
                value={group.value}
                checked={ageGroup === group.value}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300"
              />
              <span className={`ml-2 text-sm ${ageGroup === group.value ? 'text-saffron-700 font-medium' : 'text-gray-600'}`}>{group.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <select
          value={category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm rounded-md bg-gray-50"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

        {/* Duration */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Duration</h3>
          <div className="space-y-2">
            {DURATIONS.map((item) => (
              <label key={item.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="duration"
                  value={item.value}
                  checked={duration === item.value}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 cursor-pointer"
                />
                <span className={`ml-3 text-sm transition-colors ${duration === item.value ? 'text-saffron-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Budget (Per Person)</h3>
          <div className="space-y-2">
            {BUDGETS.map((item) => (
              <label key={item.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="budget"
                  value={item.value}
                  checked={budget === item.value}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 cursor-pointer"
                />
                <span className={`ml-3 text-sm transition-colors ${budget === item.value ? 'text-saffron-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Reset Button (Mobile only) */}
      <div className="mt-8 lg:hidden">
        <button
          type="button"
          onClick={handleReset}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
