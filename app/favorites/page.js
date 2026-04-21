import React from 'react';
import Image from 'next/image';
// 1. Impor ikon dari lucide-react di bagian atas
import { Heart, Star, Clock, Search } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] pt-24 pb-12 font-body">
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        
        {/* --- SECTION 1: HEADER BANNER & SEARCH --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#e6e8ea] p-8 md:p-10 rounded-[2rem]">
          <div className="space-y-2">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#006941]">
              Your Favorites
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Your curated collection of go-to meals and culinary inspirations.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative group">
            {/* Menggunakan Lucide Search */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#006941] transition-colors">
              <Search size={20} />
            </div>
            
            <input 
              className="w-full bg-white text-slate-800 rounded-xl py-4 pl-12 pr-4 border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#7bfeb8] outline-none transition-all font-body text-sm placeholder:text-slate-400" 
              placeholder="Search saved recipes..." 
              type="text" 
            />
          </div>
        </header>

        {/* --- SECTION 2: FILTERS / TAGS --- */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-[#7bfeb8] text-[#004b2d] rounded-xl font-semibold text-sm tracking-wide transition-colors">
            All Saved
          </button>
          <button className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm tracking-wide transition-colors shadow-sm">
            Dinner
          </button>
          <button className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm tracking-wide transition-colors shadow-sm">
            Quick & Easy
          </button>
          <button className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm tracking-wide transition-colors shadow-sm">
            Vegan
          </button>
        </div>

        {/* --- SECTION 3: RECIPE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Card 1: Buddha Bowl */}
          <article className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img 
                src="/favorite4.png" 
                alt="Roasted Harvest Buddha Bowl" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-md">
                {/* Menggunakan Lucide Heart dengan properti fill */}
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
            <div className="flex flex-col flex-grow space-y-3 px-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Vegan</span>
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Healthy</span>
              </div>
              <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                Roasted Harvest Buddha Bowl
              </h3>
              <div className="mt-auto flex items-center justify-between text-slate-500 text-sm pt-2">
                <div className="flex items-center gap-1 text-[#8c4a00]">
                  {/* Menggunakan Lucide Star */}
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">4.9</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  {/* Menggunakan Lucide Clock */}
                  <Clock size={16} />
                  <span>25 min</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Salmon */}
          <article className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img 
                src="/favorit3.png" 
                alt="Honey Glazed Salmon" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-md">
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
            <div className="flex flex-col flex-grow space-y-3 px-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">High Protein</span>
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Dinner</span>
              </div>
              <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                Honey Glazed Salmon
              </h3>
              <div className="mt-auto flex items-center justify-between text-slate-500 text-sm pt-2">
                <div className="flex items-center gap-1 text-[#8c4a00]">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">4.8</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Clock size={16} />
                  <span>20 min</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3: Avocado Toast */}
          <article className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img 
                src="/favorit2.png" 
                alt="Artisan Avocado Toast" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-md">
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
            <div className="flex flex-col flex-grow space-y-3 px-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Breakfast</span>
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Quick</span>
              </div>
              <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                Artisan Avocado Toast
              </h3>
              <div className="mt-auto flex items-center justify-between text-slate-500 text-sm pt-2">
                <div className="flex items-center gap-1 text-[#8c4a00]">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">4.7</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Clock size={16} />
                  <span>10 min</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 4: Mushroom Risotto */}
          <article className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img 
                src="/favorit1.png" 
                alt="Creamy Wild Mushroom Risotto" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-md">
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
            <div className="flex flex-col flex-grow space-y-3 px-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Comfort Food</span>
                <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">Dinner</span>
              </div>
              <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                Creamy Wild Mushroom Risotto
              </h3>
              <div className="mt-auto flex items-center justify-between text-slate-500 text-sm pt-2">
                <div className="flex items-center gap-1 text-[#8c4a00]">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">4.9</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Clock size={16} />
                  <span>45 min</span>
                </div>
              </div>
            </div>
          </article>

        </div>

        {/* --- SECTION 4: LOAD MORE BUTTON --- */}
        <div className="flex justify-center pt-8 pb-4">
          <button className="px-8 py-4 bg-[#e0e3e4] text-slate-700 hover:bg-[#dadddf] rounded-xl font-headline font-bold tracking-tight transition-colors shadow-sm active:scale-95">
            Load More Favorites
          </button>
        </div>

      </main>
    </div>
  );
}
