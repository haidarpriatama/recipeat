export default function AdminIngredientsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="h-10 w-64 rounded-xl bg-slate-300"></div>
          <div className="h-4 w-72 rounded bg-slate-200"></div>
        </div>
        <div className="h-12 w-44 rounded-xl bg-[#006941]/40"></div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-2 h-4 w-28 rounded bg-slate-200"></div>
            <div className="h-9 w-12 rounded bg-slate-300"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Table title row */}
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="h-5 w-44 rounded bg-slate-300"></div>
        </div>
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 bg-slate-50 px-6 py-4">
          {["w-12", "w-24", "w-16", "w-16"].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-slate-300`}></div>
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center gap-4 border-t border-slate-100 px-6 py-4"
          >
            {/* ID */}
            <div className="h-4 w-24 rounded bg-slate-200"></div>
            {/* Name */}
            <div className="h-4 w-32 rounded bg-slate-300"></div>
            {/* Used In */}
            <div className="h-4 w-16 rounded bg-slate-200"></div>
            {/* Actions */}
            <div className="flex justify-end gap-2">
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
