export default function AdminRecipesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="h-10 w-56 rounded-xl bg-slate-300"></div>
          <div className="h-4 w-96 rounded bg-slate-200"></div>
        </div>
        <div className="h-12 w-44 rounded-xl bg-[#006941]/40"></div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-2 h-4 w-24 rounded bg-slate-200"></div>
            <div className="h-9 w-12 rounded bg-slate-300"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 bg-slate-50 px-6 py-4">
          {["w-10", "w-24", "w-20", "w-24", "w-16", "w-16"].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-slate-300`}></div>
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 items-center gap-4 border-t border-slate-100 px-6 py-4"
          >
            {/* Image placeholder */}
            <div className="h-12 w-16 rounded-lg bg-slate-200"></div>
            {/* Title + subtitle */}
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded bg-slate-300"></div>
              <div className="h-3 w-24 rounded bg-slate-200"></div>
            </div>
            {/* Category badge */}
            <div className="h-6 w-20 rounded-full bg-slate-200"></div>
            {/* Date */}
            <div className="h-4 w-24 rounded bg-slate-200"></div>
            {/* Status badge */}
            <div className="h-6 w-20 rounded-full bg-slate-200"></div>
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-200"></div>
              <div className="h-9 w-9 rounded-lg bg-slate-200"></div>
              <div className="h-9 w-9 rounded-lg bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-10 rounded-xl bg-slate-200"></div>
        ))}
      </div>
    </div>
  );
}
