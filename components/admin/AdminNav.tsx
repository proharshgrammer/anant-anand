'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  MapPin,
  Menu,
  X,
  Globe,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/tours',
    label: 'Tours',
    icon: Map,
  },
  {
    href: '/admin/blog',
    label: 'Blog Posts',
    icon: FileText,
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    icon: MessageSquare,
  },
  {
    href: '/admin/destinations',
    label: 'Destinations',
    icon: Globe,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-teal-800/30">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-saffron-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-saffron-600 transition-colors">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">
              Anant Anand
            </div>
            <div className="text-teal-400 text-xs">Tour Packages Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-teal-300 hover:bg-teal-800/60 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-teal-800/30">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-teal-400 hover:text-white hover:bg-teal-800/60 transition-all mb-1"
        >
          <Globe className="w-4.5 h-4.5" />
          <span>View Website</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-teal-400 hover:text-red-300 hover:bg-red-900/20 transition-all disabled:opacity-50"
          id="admin-logout-btn"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>{loggingOut ? 'Signing out…' : 'Log Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-teal-950 to-teal-900 min-h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-teal-950 border-b border-teal-800/50 px-4 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-saffron-500 rounded-md flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">
            Anant Anand Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-teal-300 hover:text-white p-1"
          aria-label="Toggle navigation menu"
          id="mobile-nav-toggle"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-gradient-to-b from-teal-950 to-teal-900 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
