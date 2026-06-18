import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-royal-900">
      {/* Background Image Setup */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Placeholder for actual background image */}
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900 via-royal-800/80 to-magenta-900/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
          alt="Beautiful landscape of India"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6 tracking-tight">
            Journeys Crafted For Every Stage of Life
          </h1>
          <p className="text-xl sm:text-2xl text-royal-100 font-body font-light mb-12 max-w-2xl">
            Experience the spiritual and scenic beauty of India with tour packages tailored specifically to your age group and preferences.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-white text-lg font-medium mb-4">Find your perfect journey</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/tours?ageGroup=senior"
                className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-300 group hover:border-saffron-500/50"
              >
                <div className="w-12 h-12 bg-saffron-500/20 text-saffron-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-saffron-500 group-hover:text-white">
                  <span className="text-2xl">👴</span>
                </div>
                <span className="text-white text-sm font-medium text-center">Senior Pilgrims</span>
              </Link>
              
              <Link
                href="/tours?ageGroup=families"
                className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-300 group hover:border-magenta-500/50"
              >
                <div className="w-12 h-12 bg-magenta-500/20 text-magenta-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-magenta-500 group-hover:text-white">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <span className="text-white text-sm font-medium text-center">Families</span>
              </Link>

              <Link
                href="/tours?ageGroup=youth"
                className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-300 group hover:border-royal-400/50"
              >
                <div className="w-12 h-12 bg-royal-400/20 text-royal-300 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-royal-500 group-hover:text-white">
                  <span className="text-2xl">🎒</span>
                </div>
                <span className="text-white text-sm font-medium text-center">Youth & Couples</span>
              </Link>

              <Link
                href="/tours?ageGroup=school"
                className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-300 group hover:border-amber-400/50"
              >
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-amber-500 group-hover:text-white">
                  <span className="text-2xl">🏫</span>
                </div>
                <span className="text-white text-sm font-medium text-center">School Groups</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
