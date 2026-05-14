import React from "react";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] font-body">
      {/* Header Banner Skeleton */}
      <div className="h-64 w-full bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>

      <main className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <div className="-mt-24 grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Sidebar Profile Card Skeleton */}
          <div className="col-span-1 space-y-8 animate-pulse">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md"></div>
              <div className="mx-auto mb-2 h-8 w-48 rounded bg-slate-300"></div>
              <div className="mx-auto mb-6 h-4 w-32 rounded bg-slate-200"></div>
              
              <div className="mt-8 flex justify-center gap-8 border-t border-slate-100 pt-8">
                <div className="flex flex-col items-center">
                  <div className="mb-2 h-8 w-8 rounded bg-slate-300"></div>
                  <div className="h-3 w-16 rounded bg-slate-200"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2 h-8 w-8 rounded bg-slate-300"></div>
                  <div className="h-3 w-16 rounded bg-slate-200"></div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 h-5 w-32 rounded bg-slate-300"></div>
              <div className="space-y-4">
                <div className="h-10 w-full rounded-xl bg-slate-200"></div>
                <div className="h-10 w-full rounded-xl bg-slate-200"></div>
              </div>
            </div>
          </div>

          {/* Main Content Area Skeleton */}
          <div className="col-span-1 lg:col-span-2 space-y-8 animate-pulse">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-8 w-48 rounded bg-slate-300"></div>
                <div className="h-4 w-24 rounded bg-slate-200"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 rounded-2xl border border-slate-100 p-3 shadow-sm">
                    <div className="h-24 w-24 rounded-xl bg-slate-200"></div>
                    <div className="flex flex-1 flex-col py-2">
                      <div className="mb-2 h-4 w-16 rounded bg-slate-200"></div>
                      <div className="mb-2 h-5 w-full rounded bg-slate-300"></div>
                      <div className="mt-auto h-3 w-20 rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
