// ── Tours ────────────────────────────────────────────────
export type TourCategory = 'spiritual' | 'trek' | 'hill_station' | 'heritage' | 'beach' | 'wildlife';
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging';
export type AgeGroup = 'senior' | 'family' | 'youth' | 'school';

export interface Waypoint {
  day: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string[];
  accommodation?: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: TourCategory;
  age_groups: AgeGroup[];
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  pricing_tiers: Record<string, number>;
  difficulty: DifficultyLevel;
  max_group_size: number | null;
  destinations: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  waypoints: Waypoint[];
  images: string[];
  hero_image: string | null;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// ── Blog Posts ────────────────────────────────────────────
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  author_name: string;
  author_bio: string | null;
  category: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  schema_type: string;
  canonical_url: string | null;
  read_time_minutes: number | null;
  related_tour_ids: string[];
  created_at: string;
  updated_at: string;
}

// ── Enquiries ─────────────────────────────────────────────
export type EnquiryStatus = 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed';

export interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  tour_id: string | null;
  tour_name: string | null;
  travel_date: string | null;
  group_size: number | null;
  message: string | null;
  whatsapp_opt_in: boolean;
  source_page: string | null;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
}

// ── Site Settings ─────────────────────────────────────────
export interface SiteSettings {
  id: number;
  agency_name: string | null;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  hero_bg_url: string | null;
  stat_tours: number | null;
  stat_years: number | null;
  stat_destinations: number | null;
  stat_families: number | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  footer_about: string | null;
  site_meta_title: string | null;
  site_meta_description: string | null;
  default_og_image: string | null;
  map_embed_url: string | null;
  updated_at: string;
}

// ── Destinations ──────────────────────────────────────────
export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
  image: string | null;
  image_alt: string | null;
  is_featured: boolean;
  created_at: string;
}
