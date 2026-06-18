import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-saffron-500 mb-4 block">
                Anant Anand
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Curated travel experiences tailored to your age group — Senior Pilgrims, Families, Youth, and School Groups. Discover India with us.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-saffron-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/destinations" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Destinations</Link>
              </li>
              <li>
                <Link href="/tours" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Tours</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Terms of Use</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Age Groups</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tours?ageGroup=senior" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Senior Pilgrims</Link>
              </li>
              <li>
                <Link href="/tours?ageGroup=families" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Families</Link>
              </li>
              <li>
                <Link href="/tours?ageGroup=youth" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">Youth & Couples</Link>
              </li>
              <li>
                <Link href="/tours?ageGroup=school" className="text-sm text-gray-400 hover:text-saffron-500 transition-colors">School Groups</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-saffron-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Ganga Vihar, Rishikesh<br />
                  Uttarakhand 249201, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-saffron-500 mr-3 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-400 text-sm hover:text-saffron-500 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-saffron-500 mr-3 flex-shrink-0" />
                <a href="mailto:namaste@anantanand.com" className="text-gray-400 text-sm hover:text-saffron-500 transition-colors">
                  namaste@anantanand.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Anant Anand Tour Packages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
