import React from "react";
import { Search } from "lucide-react";

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] pt-8 pb-12 font-body">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        
        {/* Header Banner & Search Skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#e6e8ea] p-8 md:p-10 rounded-[2rem] animate-pulse">
          <div className="space-y-4 w-full md:w-1/2">
            <div className="h-10 w-64 rounded bg-slate-300 md:h-12"></div>
            <div className="h-6 w-full max-w-md rounded bg-slate-200"></div>
          </div>
          
          <div className="w-full md:w-96 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <div className="w-full h-[52px] bg-white rounded-xl shadow-sm border border-slate-100"></div>
          </div>
        </header>

        {/* Filters / Tags Skeleton */}
        <div className="flex flex-wrap gap-3 animate-pulse">
          <div className="h-10 w-28 bg-[#006941]/50 rounded-xl"></div>
        </div>

        {/* Recipe Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <article key={i} className="bg-white rounded-[1.5rem] p-4 shadow-sm flex flex-col gap-5 border border-slate-100 animate-pulse">
              <div className="w-full aspect-square rounded-xl bg-slate-200"></div>
              <div className="flex flex-col flex-grow space-y-3 px-2">
                <div className="h-5 w-20 bg-slate-200 rounded-lg"></div>
                <div className="h-6 w-full bg-slate-300 rounded"></div>
                <div className="h-6 w-2/3 bg-slate-300 rounded"></div>
                <div className="mt-auto flex justify-end pt-2">
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
