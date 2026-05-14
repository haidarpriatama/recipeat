import { ArrowLeft } from "lucide-react";
import React from "react";

export default function RecipeDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-24 text-[#2c2f30]">
      {/* Back button area skeleton */}
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-6 md:px-12 animate-pulse">
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 text-slate-300" />
          <div className="h-4 w-32 rounded bg-slate-300"></div>
        </div>
      </div>

      <main className="mx-auto max-w-screen-xl px-6 md:px-12">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section Skeleton */}
            <div className="relative h-[400px] w-full bg-slate-200 lg:h-[600px] animate-pulse"></div>

            {/* Content Section Skeleton */}
            <div className="flex flex-col justify-center p-10 md:p-16 animate-pulse">
              <div className="mb-4 h-10 w-3/4 rounded bg-slate-300 md:h-12"></div>
              
              <div className="mb-8 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-full bg-slate-200"></div>
                ))}
              </div>
              
              <div className="mb-10 space-y-3">
                <div className="h-4 w-full rounded bg-slate-200"></div>
                <div className="h-4 w-full rounded bg-slate-200"></div>
                <div className="h-4 w-2/3 rounded bg-slate-200"></div>
              </div>

              <div className="mb-10 flex flex-wrap items-center gap-8 border-y border-slate-100 py-6">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="h-5 w-20 rounded bg-slate-300"></div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-40 rounded-xl bg-slate-300"></div>
                <div className="h-[56px] w-[56px] rounded-xl bg-slate-200"></div>
              </div>

              {/* Ingredients & Instructions Skeleton */}
              <div className="mt-12 space-y-12">
                <div>
                  <div className="mb-6 h-6 w-32 rounded bg-slate-300"></div>
                  <ul className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <li key={i} className="flex justify-between border-b border-slate-50 pb-3">
                        <div className="h-4 w-32 rounded bg-slate-200"></div>
                        <div className="h-4 w-16 rounded bg-slate-300"></div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-8 h-8 w-40 rounded bg-slate-300"></div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                    <div className="space-y-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-5">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-300"></div>
                          <div className="w-full space-y-2 pt-2">
                            <div className="h-4 w-full rounded bg-slate-200"></div>
                            <div className="h-4 w-5/6 rounded bg-slate-200"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
