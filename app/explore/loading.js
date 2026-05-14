import { Clock3, Star } from "lucide-react";
import React from "react";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12">
        {/* Hero Skeleton */}
        <section className="mb-12 h-[450px] md:h-[500px] w-full animate-pulse rounded-xl bg-slate-200 shadow-sm">
          <div className="flex h-full flex-col justify-end p-8 md:p-10">
            <div className="mb-4 h-10 w-3/4 rounded bg-slate-300 md:h-12 md:w-1/2"></div>
            <div className="mb-6 h-6 w-full max-w-2xl rounded bg-slate-300"></div>
            <div className="h-6 w-full max-w-xl rounded bg-slate-300"></div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="h-12 w-32 rounded-xl bg-slate-300"></div>
              <div className="flex gap-4">
                <div className="h-6 w-20 rounded bg-slate-300"></div>
                <div className="h-6 w-16 rounded bg-slate-300"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar Skeleton */}
          <aside className="w-full space-y-10 lg:w-64 lg:flex-shrink-0 animate-pulse">
            <div>
              <div className="mb-6 h-4 w-24 rounded bg-slate-300"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-slate-300"></div>
                    <div className="h-4 w-20 rounded bg-slate-300"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6 h-4 w-24 rounded bg-slate-300"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-slate-300"></div>
                    <div className="h-4 w-24 rounded bg-slate-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <section className="flex-1">
            {/* Smart Discovery Skeleton */}
            <div className="mb-6 h-14 w-full animate-pulse rounded-xl bg-slate-200" />

            <div className="mb-8 animate-pulse">
              <div className="h-8 w-48 rounded bg-slate-300"></div>
              <div className="mt-2 h-4 w-64 rounded bg-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <article key={i} className="flex h-full flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm animate-pulse">
                  <div className="relative h-56 bg-slate-200"></div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 h-6 w-3/4 rounded bg-slate-300"></div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="h-4 w-16 rounded bg-slate-200"></div>
                        <div className="h-4 w-20 rounded bg-slate-200"></div>
                      </div>
                      <div className="h-4 w-4 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
