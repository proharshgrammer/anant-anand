import { notFound } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getTourBySlug } from '@/lib/supabase/queries/tours';

// Force dynamic rendering — page reads Supabase cookies for session
export const dynamic = 'force-dynamic';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  IndianRupee,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Mountain,
} from 'lucide-react';
import type { AgeGroup } from '@/types';
import EnquiryPopup from '@/components/public/EnquiryPopup';

// --- Dynamic import of Leaflet map (ssr: false required) ---
const TourMap = nextDynamic(() => import('@/components/tours/TourMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-xl border border-gray-200"
      style={{ height: '400px' }}
    >
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        <p className="text-sm font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

// ── Metadata generation ─────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerClient();
  const tour = await getTourBySlug(supabase, params.slug);

  if (!tour) {
    return { title: 'Tour Not Found' };
  }

  return {
    title: tour.meta_title || tour.title,
    description: tour.meta_description || tour.short_description || undefined,
    openGraph: {
      title: tour.meta_title || tour.title,
      description: tour.meta_description || tour.short_description || undefined,
      images: tour.og_image ? [tour.og_image] : tour.hero_image ? [tour.hero_image] : [],
    },
  };
}

// ── Age-group badge config ───────────────────────────────────
const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  senior: 'Senior Pilgrims 👴',
  family: 'Families 👨‍👩‍👧‍👦',
  youth: 'Youth & Couples 🎒',
  school: 'School Groups 🎓',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  challenging: 'bg-red-100 text-red-800',
};

// ── Page component ───────────────────────────────────────────
export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerClient();
  const tour = await getTourBySlug(supabase, params.slug);

  if (!tour) {
    notFound();
  }

  const heroImage =
    tour.hero_image ||
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';

  // ── TouristTrip JSON-LD structured data ────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.short_description || tour.description || undefined,
    image: tour.hero_image || (tour.images?.[0]) || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#f0fdfa] pt-16">
      {/* ── Hero Banner ─────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden">
        <img
          src={heroImage}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {tour.age_groups?.map((ag) => (
              <span
                key={ag}
                className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {AGE_GROUP_LABELS[ag as AgeGroup] || ag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display leading-tight mb-3">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              {tour.duration_days} Days / {tour.duration_nights} Nights
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              {tour.destinations?.slice(0, 3).join(', ') || 'Multiple Destinations'}
            </span>
            {tour.max_group_size && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-400" />
                Max {tour.max_group_size} Pax
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Body Grid ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Main Content (left 2/3) ─────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Tour Overview</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {tour.description || tour.short_description || 'Detailed description coming soon.'}
              </p>
            </section>

            <Separator />

            {/* Photo Gallery */}
            {tour.images && tour.images.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tour.images.slice(0, 6).map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={img}
                        alt={`${tour.title} — photo ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Day-by-Day Itinerary Accordion */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                  Day-by-Day Itinerary
                </h2>
                {/* Day 1 open by default (D-03) */}
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="day-1"
                  className="space-y-2"
                >
                  {tour.itinerary.map((day) => (
                    <AccordionItem
                      key={day.day}
                      value={`day-${day.day}`}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                    >
                      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50 text-left">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0">
                            {day.day}
                          </span>
                          <span className="font-semibold text-gray-900">{day.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 pt-2">
                        <p className="text-gray-600 leading-relaxed mb-3">{day.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {day.meals && day.meals.length > 0 && (
                            <span>🍽 {day.meals.join(', ')}</span>
                          )}
                          {day.accommodation && (
                            <span>🏨 {day.accommodation}</span>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Interactive Route Map */}
            {tour.waypoints && tour.waypoints.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                  Route Map
                </h2>
                <TourMap waypoints={tour.waypoints} className="h-[420px]" />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  📱 Use two fingers to scroll the map on mobile
                </p>
              </section>
            )}
          </div>

          {/* ── Sidebar (right 1/3) ─────────────────── */}
          <aside className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
              <p className="text-sm text-gray-500 font-medium mb-1">Starting from</p>
              <div className="flex items-baseline gap-1 mb-4">
                <IndianRupee className="w-6 h-6 text-gray-900" />
                <span className="text-4xl font-bold text-gray-900">
                  {tour.price_per_person?.toLocaleString('en-IN') || 'On Request'}
                </span>
                <span className="text-gray-500 text-sm ml-1">/ person</span>
              </div>

              {/* Pricing tiers if available */}
              {tour.pricing_tiers && Object.keys(tour.pricing_tiers).length > 0 && (
                <div className="mb-4 space-y-1.5 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Group Pricing
                  </p>
                  {Object.entries(tour.pricing_tiers).map(([tier, price]) => (
                    <div key={tier} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{tier}</span>
                      <span className="font-semibold text-gray-900 flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {Number(price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA — "Get a Quote" (UI-SPEC) */}
              <a
                id="tour-get-quote-btn"
                href={`https://wa.me/911234567890?text=${encodeURIComponent(`Hi! I'd like a quote for: ${tour.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Get a Quote
              </a>

              <Separator className="my-4" />

              {/* Quick Facts */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-800">
                    {tour.duration_days}D / {tour.duration_nights}N
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {tour.category?.replace('_', ' ')}
                  </span>
                </div>
                {tour.difficulty && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Difficulty</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        DIFFICULTY_COLOR[tour.difficulty] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Mountain className="w-3 h-3 inline mr-1" />
                      {tour.difficulty}
                    </span>
                  </div>
                )}
                {tour.max_group_size && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Group</span>
                    <span className="font-medium text-gray-800">{tour.max_group_size} people</span>
                  </div>
                )}
                {tour.destinations && tour.destinations.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 flex-shrink-0">Destinations</span>
                    <span className="font-medium text-gray-800 text-right">
                      {tour.destinations.join(' → ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 5-second delayed enquiry popup (LEAD-01, D-01) */}
      <EnquiryPopup
        tourName={tour.title}
        tourId={tour.id}
        sourcePage={`/tours/${params.slug}`}
        delayMs={5000}
      />
    </main>
    </>
  );
}
