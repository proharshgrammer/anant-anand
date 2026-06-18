import { create } from 'zustand';
import type { TourCategory, AgeGroup } from '@/types';

export interface FilterState {
  ageGroup: AgeGroup | 'all';
  category: TourCategory | 'all';
  duration: 'all' | '1-3' | '4-7' | '8+';
  budget: 'all' | 'under-10k' | '10k-25k' | '25k-50k' | '50k+';
  sort: 'newest' | 'price-asc' | 'price-desc';
}

interface FilterStore extends FilterState {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  ageGroup: 'all',
  category: 'all',
  duration: 'all',
  budget: 'all',
  sort: 'newest',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set(initialState),
}));
