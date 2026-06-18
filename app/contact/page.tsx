import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import EnquiryForm from '@/components/public/EnquiryForm';

export const metadata: Metadata = {
  title: 'Get in Touch',
  description:
    'Contact Anant Anand Tour Packages. Call, message, or visit us for curated travel experiences across India.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or ready to plan your next trip? We&apos;d love to
            hear from you.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column — Office info + EnquiryForm */}
          <div className="space-y-8">
            {/* Office information card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 font-display mb-6">
                Our Office
              </h2>
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      123 Ganga Vihar, Rishikesh
                      <br />
                      Uttarakhand 249201, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a
                      href="tel:+911234567890"
                      className="text-sm text-saffron-600 hover:text-saffron-700 transition-colors mt-0.5 inline-block"
                    >
                      +91 123 456 7890
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:namaste@anantanand.com"
                      className="text-sm text-saffron-600 hover:text-saffron-700 transition-colors mt-0.5 inline-block"
                    >
                      namaste@anantanand.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Business Hours
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Mon–Sat, 9:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 font-display mb-4">
                Send Us an Enquiry
              </h2>
              <EnquiryForm sourcePage="/contact" />
            </div>
          </div>

          {/* Right column — Map embed */}
          <div>
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.28,30.08,78.33,30.14&layer=mapnik&marker=30.11,78.30"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              &copy; OpenStreetMap contributors
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
