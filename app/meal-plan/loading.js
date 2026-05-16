export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <div className="bg-[#006941] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-12 w-3/4 bg-white/20 animate-pulse rounded-md"></div>
            <div className="h-6 w-full max-w-md bg-white/20 animate-pulse rounded-md"></div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="h-12 w-40 bg-white/20 animate-pulse rounded-full"></div>
              <div className="h-12 w-48 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-[300px] h-[300px] bg-white/20 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* Navigation Tabs Skeleton */}
        <div className="flex overflow-x-auto pb-4 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 animate-pulse rounded-full shrink-0"></div>
          ))}
        </div>

        {/* Content Area Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="lg:w-2/3 space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md"></div>
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-md"></div>
            </div>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6">
                <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-xl hidden sm:block shrink-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded-md"></div>
                  <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded-md"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 animate-pulse rounded-full"></div>
                    <div className="h-6 w-16 bg-slate-200 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-md mb-6"></div>
              <div className="h-[200px] bg-slate-200 animate-pulse rounded-xl mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-4 w-16 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
