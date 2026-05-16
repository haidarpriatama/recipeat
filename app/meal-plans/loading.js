export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:px-10">
        {/* Sidebar calendar skeleton */}
        <aside className="space-y-6 lg:col-span-3">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-[#eff1f2]"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-[#eff1f2]"></div>
                <div className="h-8 w-8 animate-pulse rounded bg-[#eff1f2]"></div>
              </div>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="mx-auto h-4 w-6 animate-pulse rounded bg-[#eff1f2]"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={`d-${i}`} className="mx-auto flex h-10 w-10 items-center justify-center">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-[#eff1f2]"></div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main timeline skeleton */}
        <section className="space-y-8 lg:col-span-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 h-4 w-32 animate-pulse rounded bg-[#eff1f2]"></div>
              <div className="h-10 w-64 animate-pulse rounded bg-[#eff1f2] md:h-12 md:w-80"></div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded-xl bg-[#eff1f2] md:h-11"></div>
          </div>

          <div className="relative space-y-12 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-[#7bfeb8]">
            {["Breakfast", "Lunch", "Dinner"].map((slot) => (
              <div key={slot} className="relative pl-16">
                <div className="absolute left-[22px] top-1/2 mt-[-8px] h-4 w-4 rounded-full bg-[#caffdc]" />
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-[#eff1f2]"></div>
                  <div className="h-4 w-16 animate-pulse rounded bg-[#eff1f2]"></div>
                </div>
                <div className="h-36 animate-pulse rounded-2xl bg-[#eff1f2]"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
