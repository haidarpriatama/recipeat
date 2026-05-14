import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Overview Banner Skeleton */}
      <section className="rounded-3xl bg-slate-300 p-8 shadow-sm">
        <div className="h-3 w-32 rounded bg-slate-400 mb-4"></div>
        <div className="mt-2 h-10 w-64 rounded bg-slate-400"></div>
        <div className="mt-4 h-4 w-full max-w-md rounded bg-slate-400/80"></div>
      </section>

      {/* Stats Cards Skeleton */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 h-10 w-10 rounded-xl bg-slate-200"></div>
            <div className="h-4 w-24 rounded bg-slate-200 mb-2"></div>
            <div className="mt-1 h-8 w-16 rounded bg-slate-300"></div>
          </article>
        ))}
      </section>

      {/* Quick Actions Skeleton */}
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="h-6 w-48 rounded bg-slate-300 mb-2"></div>
        <div className="h-4 w-64 rounded bg-slate-200"></div>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="h-11 w-32 rounded-xl bg-slate-300"></div>
          <div className="h-11 w-40 rounded-xl bg-slate-200"></div>
          <div className="h-11 w-36 rounded-xl bg-slate-200"></div>
        </div>
      </section>
    </div>
  );
}
