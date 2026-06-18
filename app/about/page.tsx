import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Anant Anand Tour Packages — our story, mission, and commitment to age-group based travel experiences.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 font-display text-center mb-8">
          About Anant Anand Tour Packages
        </h1>

        <article className="prose prose-lg max-w-none mx-auto">
          {/* Our Story */}
          <h2>Our Story</h2>
          <p>
            Founded with a deep passion for travel and a profound respect for
            India&apos;s cultural and spiritual heritage, Anant Anand Tour Packages
            was born from the belief that every journey should be as unique as the
            traveller. What began as a small initiative to help senior pilgrims
            navigate the sacred circuits of Uttarakhand has grown into a
            full-fledged travel agency dedicated to curating meaningful
            experiences for all age groups.
          </p>
          <p>
            Our founder&apos;s years of exploring the length and breadth of India —
            from the snow-capped peaks of the Himalayas to the sun-kissed beaches
            of Kerala — revealed a simple truth: travel transforms lives. We
            built Anant Anand to share that transformation, offering itineraries
            that blend comfort, authenticity, and discovery in equal measure.
          </p>
          <p>
            Today, we serve hundreds of travellers each year, from school groups
            on educational tours to families seeking memorable holidays and
            senior pilgrims fulfilling lifelong dreams. Every trip we design
            reflects our commitment to quality, safety, and the timeless spirit
            of Indian hospitality.
          </p>

          {/* What We Offer */}
          <h2>What We Offer</h2>
          <p>
            At Anant Anand, we specialise in <strong>age-group based travel
            curation</strong> — recognising that a family with young children has
            very different needs from a group of retired pilgrims or a bunch of
            college friends seeking adventure. Our tours are thoughtfully
            segmented into four primary categories:
          </p>
          <ul>
            <li>
              <strong>Senior Pilgrims</strong> — Gentle-paced spiritual journeys
              with comfortable accommodations, accessible routes, and experienced
              guides who understand the needs of older travellers.
            </li>
            <li>
              <strong>Families</strong> — Kid-friendly itineraries with a mix of
              cultural experiences, nature activities, and enough downtime to keep
              everyone happy.
            </li>
            <li>
              <strong>Youth &amp; Couples</strong> — Adventure-packed trips,
              offbeat destinations, and immersive experiences designed for young
              travellers and couples seeking something beyond the ordinary.
            </li>
            <li>
              <strong>School Groups</strong> — Educational tours that combine
              curriculum-linked learning with travel, managed with the discipline
              and safety protocols that schools and parents expect.
            </li>
          </ul>
          <p>
            Beyond group segmentation, we offer customised itineraries, reliable
            transport, verified accommodations, and 24/7 support throughout your
            journey. Whether you&apos;re planning a weekend getaway or an
            extensive pilgrimage circuit, we handle every detail so you can focus
            on making memories.
          </p>

          {/* Our Commitment */}
          <h2>Our Commitment</h2>
          <p>
            <strong>Safety first.</strong> Every tour we operate follows strict
            safety protocols. Our vehicles are well-maintained, our drivers are
            experienced, and our on-ground coordinators are trained to handle
            any situation. For senior and school groups, we maintain enhanced
            supervision standards.
          </p>
          <p>
            <strong>Quality without compromise.</strong> We partner with verified
            hotels, guesthouses, and service providers who share our commitment
            to cleanliness, comfort, and courteous service. We personally inspect
            every property we recommend.
          </p>
          <p>
            <strong>Transparent pricing.</strong> What you see is what you pay.
            No hidden charges, no surprise fees. Our quotes include all
            applicable taxes and services, clearly itemised so you know exactly
            what you&apos;re getting.
          </p>
          <p>
            <strong>Sustainable and responsible travel.</strong> We believe in
            giving back to the communities we visit. We promote local guides,
            support small businesses, and encourage our travellers to respect
            local customs and environments. Travel, for us, is a privilege — and
            we treat it with the responsibility it deserves.
          </p>
        </article>
      </div>
    </main>
  );
}
