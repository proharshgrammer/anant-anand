import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Anant Anand Tour Packages.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 font-display text-center mb-8">
          Privacy Policy
        </h1>

        <article className="prose prose-lg max-w-none mx-auto">
          <p className="text-sm text-gray-500">
            Last updated: 1 June 2026
          </p>

          <p>
            Anant Anand Tour Packages (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;) respects your privacy and is committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website or use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect the following types of information when you use our
            website or submit an enquiry:
          </p>
          <ul>
            <li>
              <strong>Personal Identification Information:</strong> Name, phone
              number, email address, and any other information you voluntarily
              provide through our enquiry forms.
            </li>
            <li>
              <strong>Travel Preferences:</strong> Information about your travel
              plans, group size, preferred destinations, and special
              requirements shared through our forms or direct communications.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you navigate
              and interact with our website, collected through cookies and
              similar technologies.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>
              To respond to your enquiries and provide you with information
              about our tour packages and services
            </li>
            <li>
              To improve our website, services, and customer experience
            </li>
            <li>
              To communicate with you regarding your enquiries, bookings, and
              travel arrangements
            </li>
            <li>
              To comply with legal obligations and protect our legal rights
            </li>
          </ul>

          <h2>Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul>
            <li>
              With service providers who assist us in operating our website and
              business (e.g., hosting services, communication platforms) —
              these providers are contractually bound to protect your data
            </li>
            <li>
              If required by law, to comply with a legal obligation or protect
              our rights
            </li>
            <li>
              With your explicit consent or at your direction
            </li>
          </ul>

          <h2>Data Retention and Security</h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfil the purposes for which it was collected, or as required by
            applicable law. We implement appropriate technical and
            organisational measures to protect your personal data against
            unauthorised access, alteration, disclosure, or destruction.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time (where processing is based on consent)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the
            information provided below.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website may use cookies and similar tracking technologies to
            enhance your browsing experience. You can control cookie
            preferences through your browser settings. Please note that
            disabling certain cookies may affect the functionality of our
            website.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. We
            encourage you to review this policy periodically.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li>Email: namaste@anantanand.com</li>
            <li>Phone: +91 123 456 7890</li>
            <li>
              Address: 123 Ganga Vihar, Rishikesh, Uttarakhand 249201, India
            </li>
          </ul>
        </article>
      </div>
    </main>
  );
}
