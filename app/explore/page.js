export default function ExplorePage() {
  return (
    <div className="bg-[#f5f6f7] text-[#2c2f30] min-h-screen font-sans">
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8">
        
        {/* Hero Section: Today's Special */}
        <section className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12 shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] group">
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Seasonal Harvest Buddha Bowl" 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 text-white max-w-2xl">
            <span className="bg-[#006941] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Today's Special</span>
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">Seasonal Harvest Buddha Bowl with Miso Dressing</h1>
            <p className="text-lg text-stone-200 mb-6">Experience a symphony of textures and earthy flavors curated by Chef Julian. Freshly picked root vegetables meets silky fermented dressing.</p>
            <div className="flex items-center gap-6">
              <button className="bg-gradient-to-r from-[#006941] to-[#005c38] text-[#caffdc] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                View Recipe <span>→</span>
              </button>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1">⏱ 25 mins</span>
                <span className="flex items-center gap-1">🔥 420 kcal</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-sm font-bold text-[#006941] uppercase tracking-widest mb-6">Meal Type</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-5 h-5 rounded text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" type="checkbox" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Breakfast</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 rounded text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" type="checkbox" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Lunch</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-5 h-5 rounded text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" type="checkbox" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Dinner</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 rounded text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" type="checkbox" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Snacks</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#006941] uppercase tracking-widest mb-6">Serving Time</h3>
              <div className="space-y-4">
                <input className="w-full h-1.5 bg-[#e6e8ea] rounded-lg appearance-none cursor-pointer accent-[#006941]" max="120" min="5" type="range" defaultValue="45" />
                <div className="flex justify-between text-xs font-bold text-[#595c5d]">
                  <span>Under 15m</span>
                  <span>Max 2h</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#006941] uppercase tracking-widest mb-6">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#f3fcf3] text-[#58615a] px-3 py-1.5 rounded-full text-xs font-bold border border-[#e4ede5]">Vegan</span>
                <span className="bg-[#eff1f2] text-[#595c5d] px-3 py-1.5 rounded-full text-xs font-bold">Gluten-Free</span>
                <span className="bg-[#f3fcf3] text-[#58615a] px-3 py-1.5 rounded-full text-xs font-bold border border-[#e4ede5]">Keto</span>
                <span className="bg-[#eff1f2] text-[#595c5d] px-3 py-1.5 rounded-full text-xs font-bold">Low Carb</span>
                <span className="bg-[#eff1f2] text-[#595c5d] px-3 py-1.5 rounded-full text-xs font-bold">Dairy-Free</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#006941] uppercase tracking-widest mb-6">Cuisines</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" name="cuisine" type="radio" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Italian</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" name="cuisine" type="radio" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Mediterranean</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" name="cuisine" type="radio" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Japanese</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-5 h-5 text-[#006941] focus:ring-[#006941] border-[#abadae]/30 accent-[#006941]" name="cuisine" type="radio" />
                  <span className="text-[#595c5d] font-medium group-hover:text-[#006941] transition-colors">Mexican</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Recipe Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-[#2c2f30] tracking-tight mb-1">Discover Flavors</h2>
                <p className="text-[#595c5d]">248 recipes found for your current selection</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#595c5d]">Sort by:</span>
                <select className="bg-transparent border-none font-bold text-[#006941] focus:ring-0 cursor-pointer outline-none">
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Quickest Prep</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Recipe Card 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] flex flex-col group cursor-pointer border border-transparent hover:border-[#006941]/10 transition-all">
                <div className="relative h-56">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Honey Glazed Salmon" src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974&auto=format&fit=crop" />
                  <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur text-red-500 flex items-center justify-center hover:bg-white transition-colors">
                    ♥
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Dinner</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#006941] transition-colors text-[#2c2f30]">Honey Glazed Salmon with Wild Asparagus</h3>
                  <div className="mt-auto flex items-center justify-between text-[#595c5d]">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span>⏱ 20m</span>
                      <span>🔥 340 kcal</span>
                    </div>
                    <span className="text-[#006941] font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>

              {/* Recipe Card 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] flex flex-col group cursor-pointer border border-transparent hover:border-[#006941]/10 transition-all">
                <div className="relative h-56">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Kale Salad" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop" />
                  <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur text-gray-400 flex items-center justify-center hover:bg-white transition-colors">
                    ♡
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Vegan</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#006941] transition-colors text-[#2c2f30]">Crispy Chickpea & Kale Power Salad</h3>
                  <div className="mt-auto flex items-center justify-between text-[#595c5d]">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span>⏱ 15m</span>
                      <span>🔥 280 kcal</span>
                    </div>
                    <span className="text-[#006941] font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>

              {/* Recipe Card 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] flex flex-col group cursor-pointer border border-transparent hover:border-[#006941]/10 transition-all">
                <div className="relative h-56">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Margherita Pizza" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" />
                  <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur text-gray-400 flex items-center justify-center hover:bg-white transition-colors">
                    ♡
                  </button>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Italian</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#006941] transition-colors text-[#2c2f30]">Artisan Sourdough Margherita Pizza</h3>
                  <div className="mt-auto flex items-center justify-between text-[#595c5d]">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span>⏱ 45m</span>
                      <span>🔥 520 kcal</span>
                    </div>
                    <span className="text-[#006941] font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] hover:bg-[#006941]/10 transition-colors">
                &lt;
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#006941] text-[#caffdc] font-bold">1</button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full text-[#595c5d] font-bold hover:bg-[#006941]/10 transition-colors">2</button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full text-[#595c5d] font-bold hover:bg-[#006941]/10 transition-colors">3</button>
              <span className="text-[#595c5d] px-2">...</span>
              <button className="h-10 w-10 flex items-center justify-center rounded-full text-[#595c5d] font-bold hover:bg-[#006941]/10 transition-colors">12</button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] hover:bg-[#006941]/10 transition-colors">
                &gt;
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 mt-24 py-12 px-6 md:px-12 border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-800 mb-6 block">Recipeat</span>
            <p className="text-[#595c5d] max-w-sm mb-6">Redefining home cooking through seasonal inspiration and editorial-grade nutrition. Join our community of culinary curators.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#2c2f30] uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-[#595c5d] font-medium">
              <li><a className="hover:text-[#006941] transition-colors" href="#">Recipe Index</a></li>
              <li><a className="hover:text-[#006941] transition-colors" href="#">Meal Planner</a></li>
              <li><a className="hover:text-[#006941] transition-colors" href="#">Grocery Sync</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#2c2f30] uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-[#595c5d] font-medium">
              <li><a className="hover:text-[#006941] transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-[#006941] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#006941] transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto border-t border-[#abadae]/10 mt-12 pt-8 flex justify-between text-xs font-bold text-[#595c5d] uppercase tracking-widest">
          <span>© 2026 Recipeat UI. All rights reserved.</span>
          <span>Designed for the Modern Kitchen</span>
        </div>
      </footer>
    </div>
  );
}