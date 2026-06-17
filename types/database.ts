/**
 * Supabase Database type definitions.
 * 
 * For production: regenerate with:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * 
 * This stub satisfies TypeScript while the project is bootstrapped without
 * a live Supabase connection.
 */
export type Database = {
  public: {
    Tables: {
      tours: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category: string;
          age_groups: string[];
          duration_days: number;
          duration_nights: number;
          price_per_person: number;
          pricing_tiers: Record<string, number>;
          difficulty: string;
          max_group_size: number | null;
          destinations: string[];
          inclusions: string[];
          exclusions: string[];
          itinerary: unknown[];
          waypoints: unknown[];
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
        };
        Insert: Partial<Database['public']['Tables']['tours']['Row']> & {
          title: string;
          slug: string;
          category: string;
          duration_days: number;
          duration_nights: number;
          price_per_person: number;
        };
        Update: Partial<Database['public']['Tables']['tours']['Row']>;
      };
      blog_posts: {
        Row: {
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
          status: string;
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
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      enquiries: {
        Row: {
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
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['enquiries']['Row']> & {
          name: string;
          phone: string;
        };
        Update: Partial<Database['public']['Tables']['enquiries']['Row']>;
      };
      site_settings: {
        Row: {
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
        };
        Insert: Partial<Database['public']['Tables']['site_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>;
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          region: string | null;
          description: string | null;
          image: string | null;
          image_alt: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['destinations']['Row']> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['destinations']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tour_category: 'spiritual' | 'trek' | 'hill_station' | 'heritage' | 'beach' | 'wildlife';
      difficulty_level: 'easy' | 'moderate' | 'challenging';
      post_status: 'draft' | 'scheduled' | 'published';
      enquiry_status: 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed';
    };
  };
};
