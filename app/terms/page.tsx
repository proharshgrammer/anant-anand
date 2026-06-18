import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Anant Anand Tour Packages.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 font-display text-center mb-8">
          Terms of Use
        </h1>

        <article className="prose prose-lg max-w-none mx-auto">
          <p className="text-sm text-gray-500">
            Last updated: 1 June 2026
          </p>

          <p>
            Welcome to Anant Anand Tour Packages. By accessing or using our
            website and services, you agree to be bound by these Terms of Use.
            Please read them carefully before using our website or engaging our
            services.
          </p>

          <h2>Booking and Payment Terms</h2>
          <p>
            Our website provides information about tour packages and serves as
            a platform for submitting enquiries. At this time, we do not process
            online payments or bookings directly through the website.
          </p>
          <ul>
            <li>
              All bookings are confirmed after direct communication with our
              team via phone, WhatsApp, or email.
            </li>
            <li>
              Pricing displayed on our website is indicative and subject to
              change based on seasonality, availability, and specific
              requirements.
            </li>
            <li>
              Final pricing and payment terms will be provided in your
              personalised quotation.
            </li>
            <li>
              A booking is considered confirmed only after receiving written
              confirmation from our team and payment of the required deposit
              (if applicable).
            </li>
          </ul>

          <h2>Cancellation and Refund Policy</h2>
          <p>
            Cancellation and refund terms are provided at the time of booking
            confirmation and may vary depending on the tour package, season,
            and service providers involved. General guidelines include:
          </p>
          <ul>
            <li>
              Cancellations made 30 or more days before departure: Full refund
              minus processing fees
            </li>
            <li>
              Cancellations made 15–29 days before departure: 50% refund
            </li>
            <li>
              Cancellations made less than 15 days before departure: No refund
            </li>
            <li>
              Refunds, if applicable, will be processed within 15 business days
            </li>
          </ul>
          <p>
            Please note that these are general guidelines. Specific terms for
            your booking will be detailed in your confirmation documents.
          </p>

          <h2>User Responsibilities</h2>
          <p>By using our website and services, you agree to:</p>
          <ul>
            <li>
              Provide accurate, current, and complete information when
              submitting enquiries or bookings
            </li>
            <li>
              Not use our website for any unlawful purpose or in violation of
              applicable laws and regulations
            </li>
            <li>
              Not attempt to disrupt or interfere with the security or
              functionality of our website
            </li>
            <li>
              Respect the terms and conditions of third-party service providers
              (hotels, transport operators, etc.) engaged as part of your tour
            </li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            Anant Anand Tour Packages acts as an organiser and intermediary for
            travel services. We make reasonable efforts to ensure the quality
            and safety of all services provided. However:
          </p>
          <ul>
            <li>
              We are not liable for any loss, damage, injury, or delay caused
              by events beyond our reasonable control, including but not limited
              to natural disasters, weather conditions, political unrest,
              strikes, or acts of God
            </li>
            <li>
              Our liability is limited to the value of the services provided and
              does not extend to consequential damages
            </li>
            <li>
              Third-party service providers (hotels, transport, guides) operate
              under their own terms and conditions
            </li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, and
            design — is the property of Anant Anand Tour Packages unless
            otherwise credited. You may not reproduce, distribute, or modify
            any content without our prior written permission.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Use are governed by and construed in accordance with
            the laws of India. Any disputes arising from these terms shall be
            subject to the exclusive jurisdiction of the courts in Rishikesh,
            Uttarakhand.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Use at any
            time without prior notice. Changes will be effective immediately
            upon posting on this page. Your continued use of our website after
            any changes constitutes acceptance of the new terms.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms of Use, please contact
            us:
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
