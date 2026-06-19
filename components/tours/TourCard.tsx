import Link from 'next/link';
import { Clock, IndianRupee, Backpack, GraduationCap } from 'lucide-react';
import type { Tour, AgeGroup } from '@/types';

// Age group badge configuration
const AGE_BADGES: Record<AgeGroup, { label: string; color: string; icon?: React.ReactNode }> = {
  senior: { label: 'Senior Pilgrims', color: 'bg-saffron-500 text-white', icon: <span className="mr-1 text-sm">👴</span> },
  family: { label: 'Families', color: 'bg-magenta-600 text-white', icon: <span className="mr-1 text-sm">👨‍👩‍👧‍👦</span> },
  youth: { label: 'Youth & Couples', color: 'bg-royal-600 text-white', icon: <Backpack className="w-3 h-3 mr-1" /> },
  school: { label: 'School Groups', color: 'bg-amber-500 text-white', icon: <GraduationCap className="w-3 h-3 mr-1" /> },
};

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={tour.hero_image || 'https://images.unsplash.com/photo-1514222134-b57fbb8ce073?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={tour.title}
          width={800}
          height={450}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-royal-800 shadow-sm capitalize">
          {tour.category.replace('_', ' ')}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        {/* Age Group Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tour.age_groups?.map((age) => {
            const badge = AGE_BADGES[age as AgeGroup];
            if (!badge) return null;
            return (
              <span key={age} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                {badge.icon}
                {badge.label}
              </span>
            );
          })}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 font-display line-clamp-2">
          <Link href={`/tours/${tour.slug}`} className="hover:text-saffron-600 transition-colors">
            {tour.title}
          </Link>
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 mt-auto">
          <div className="flex items-center font-medium">
            <Clock className="h-4 w-4 mr-1 text-saffron-500" />
            {tour.duration_days} Days / {tour.duration_nights} Nights
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Starting from</span>
            <div className="flex items-center text-gray-900 font-bold text-lg">
              <IndianRupee className="h-4 w-4 mr-0.5" />
              <span>{tour.price_per_person?.toLocaleString('en-IN') || 'On Request'}</span>
            </div>
          </div>
          <Link 
            href={`/tours/${tour.slug}`}
            className="text-royal-600 font-semibold hover:text-royal-800 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
