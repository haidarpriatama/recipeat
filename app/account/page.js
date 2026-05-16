import React from 'react';
import Link from 'next/link';
// Impor semua ikon dari Lucide React
import { User, Mail, ArrowRight, Heart, Star, Compass, CalendarRange } from 'lucide-react';

export default function ProfilePage() {
  return (
    // min-h-screen dan pt-24 agar tidak tertabrak oleh SiteHeader global
    <div className="bg-[#f5f6f7] text-[#2c2f30] font-body antialiased min-h-screen flex flex-col pt-24 pb-20 md:pb-12">
      
      {/* --- KANVAS KONTEN UTAMA --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-12 lg:gap-16 pt-4">
        
        {/* --- SECTION 1: PROFIL & PENGATURAN --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kartu Profil (Kiri) */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-[0_32px_64px_rgba(44,47,48,0.06)] p-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#006941]/5 to-transparent pointer-events-none"></div>
            
            <div className="z-10 mb-6 w-24 h-24 rounded-full bg-[#006941] flex items-center justify-center shadow-lg">
              <span className="font-headline font-bold text-white text-2xl">S</span>
            </div>
            
            <h1 className="font-headline text-2xl font-bold text-[#2c2f30] mb-1 z-10">
              Sarah Jenkins
            </h1>
            <p className="font-label text-[#595c5d] mb-8 z-10">
              @sarahcooks
            </p>
            
            <div className="flex gap-4 w-full z-10">
              <button className="flex-1 bg-[#eff1f2] hover:bg-[#e6e8ea] rounded-lg p-4 transition-colors group">
                <p className="font-headline font-bold text-red-600 text-lg">Sign out</p>
              </button>
              <button className="flex-1 bg-[#eff1f2] hover:bg-[#e6e8ea] rounded-lg p-4 transition-colors group">
                <p className="font-headline font-bold text-red-600 text-lg">Delete</p>
              </button>
            </div>
          </div>

          {/* Form Pengaturan (Kanan) */}
          <div className="lg:col-span-8 bg-[#eff1f2] rounded-xl p-8 lg:p-10">
            <h2 className="font-headline text-2xl font-bold text-[#2c2f30] mb-8">
              Account Settings
            </h2>
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input: Username */}
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-[#2c2f30]" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={20} />
                    </div>
                    <input 
                      className="w-full bg-white rounded-lg border-0 py-3 pl-12 pr-4 text-[#2c2f30] shadow-sm focus:ring-2 focus:ring-[#006941] focus:outline-none font-body" 
                      id="username" 
                      type="text" 
                      defaultValue="sarahcooks" 
                    />
                  </div>
                </div>

                {/* Input: Full Name */}
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-[#2c2f30]" htmlFor="fullName">
                    Full Name
                  </label>
                  <input 
                    className="w-full bg-white rounded-lg border-0 py-3 px-4 text-[#2c2f30] shadow-sm focus:ring-2 focus:ring-[#006941] focus:outline-none font-body" 
                    id="fullName" 
                    type="text" 
                    defaultValue="Sarah Jenkins" 
                  />
                </div>
              </div>

              {/* Input: Email */}
              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-[#2c2f30]" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input 
                    className="w-full bg-white rounded-lg border-0 py-3 pl-12 pr-4 text-[#2c2f30] shadow-sm focus:ring-2 focus:ring-[#006941] focus:outline-none font-body" 
                    id="email" 
                    type="email" 
                    defaultValue="sarah.jenkins@example.com" 
                  />
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-4 flex justify-end">
                <button 
                  className="bg-[#006941] hover:bg-[#005535] text-white font-headline font-bold py-4 px-10 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5" 
                  type="button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* --- SECTION 2: FAVORITE RECIPES --- */}
        <section className="pt-8 mb-20 md:mb-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline text-3xl font-bold text-[#2c2f30]">
                Favorite Recipes
              </h2>
              <p className="font-body text-[#595c5d] mt-2">
                Your curated collection of culinary delights.
              </p>
            </div>
            <Link href="/favorites" className="text-[#006941] font-label font-bold hover:text-[#005535] transition-colors hidden md:flex items-center gap-1 group">
              View All 
              <span className="transform group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Kartu Resep 1 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4 shadow-[0_32px_64px_rgba(44,47,48,0.04)]">
                  <div className="w-full h-full bg-gray-200 animate-pulse group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <span className="text-gray-400 font-body">Image placeholder</span>
                  </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-[#8c4a00] shadow-sm">
                  <Heart size={20} fill="currentColor" />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2c2f30] mb-1 group-hover:text-[#006941] transition-colors">
                    Artisan Avocado Toast
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#595c5d] font-label">
                    <span className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-[#8c4a00]" /> 4.9
                    </span>
                    <span>•</span>
                    <span>15 Min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Resep 2 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4 shadow-[0_32px_64px_rgba(44,47,48,0.04)]">
                  <div className="w-full h-full bg-gray-200 animate-pulse group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <span className="text-gray-400 font-body">Image placeholder</span>
                  </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-[#8c4a00] shadow-sm">
                  <Heart size={20} fill="currentColor" />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2c2f30] mb-1 group-hover:text-[#006941] transition-colors">
                    Harvest Buddha Bowl
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#595c5d] font-label">
                    <span className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-[#8c4a00]" /> 4.8
                    </span>
                    <span>•</span>
                    <span>35 Min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Resep 3 */}
            <div className="group cursor-pointer hidden lg:block">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4 shadow-[0_32px_64px_rgba(44,47,48,0.04)]">
                  <div className="w-full h-full bg-gray-200 animate-pulse group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <span className="text-gray-400 font-body">Image placeholder</span>
                  </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-[#8c4a00] shadow-sm">
                  <Heart size={20} fill="currentColor" />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2c2f30] mb-1 group-hover:text-[#006941] transition-colors">
                    Rustic Pesto Pasta
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#595c5d] font-label">
                    <span className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-[#8c4a00]" /> 5.0
                    </span>
                    <span>•</span>
                    <span>25 Min</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- BOTTOM NAVBAR (Hanya muncul di Mobile) --- */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.05)] md:hidden z-50">
        <Link href="/explore" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#006941] transition-all p-2">
          <Compass size={24} className="mb-1" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Explore</span>
        </Link>
        <Link href="/meal-plans" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#006941] transition-all p-2">
          <CalendarRange size={24} className="mb-1" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Plans</span>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#006941] transition-all p-2">
          <Heart size={24} className="mb-1" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Favorites</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center justify-center text-[#006941] bg-[#006941]/10 rounded-xl px-6 py-2 transition-all">
          <User size={24} className="mb-1" />
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </Link>
      </nav>

    </div>
  );
}