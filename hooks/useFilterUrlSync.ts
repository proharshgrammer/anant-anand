import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFilterStore } from '@/lib/store/tourFilters';
import type { AgeGroup, TourCategory } from '@/types';

export function useFilterUrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  const {
    ageGroup,
    category,
    duration,
    budget,
    sort,
    setFilters,
  } = useFilterStore();

  // 1. Hydrate store from URL on initial load
  useEffect(() => {
    if (!isInitialized.current) {
      const urlAgeGroup = searchParams.get('ageGroup') as AgeGroup | 'all' | null;
      const urlCategory = searchParams.get('category') as TourCategory | 'all' | null;
      const urlDuration = searchParams.get('duration') as any;
      const urlBudget = searchParams.get('budget') as any;
      const urlSort = searchParams.get('sort') as any;

      const filtersToSet: any = {};
      if (urlAgeGroup) filtersToSet.ageGroup = urlAgeGroup;
      if (urlCategory) filtersToSet.category = urlCategory;
      if (urlDuration) filtersToSet.duration = urlDuration;
      if (urlBudget) filtersToSet.budget = urlBudget;
      if (urlSort) filtersToSet.sort = urlSort;

      if (Object.keys(filtersToSet).length > 0) {
        setFilters(filtersToSet);
      }
      isInitialized.current = true;
    }
  }, [searchParams, setFilters]);

  // 2. Sync store changes to URL
  useEffect(() => {
    if (!isInitialized.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (ageGroup !== 'all') params.set('ageGroup', ageGroup);
    else params.delete('ageGroup');

    if (category !== 'all') params.set('category', category);
    else params.delete('category');

    if (duration !== 'all') params.set('duration', duration);
    else params.delete('duration');

    if (budget !== 'all') params.set('budget', budget);
    else params.delete('budget');

    if (sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    // Only replace if the query string actually changed to prevent infinite loops
    if (newQuery !== currentQuery) {
      router.replace(`?${newQuery}`, { scroll: false });
    }
  }, [ageGroup, category, duration, budget, sort, searchParams, router]);

  return { isInitialized: isInitialized.current };
}
