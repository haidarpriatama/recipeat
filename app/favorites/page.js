import { footerContent } from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import AuthGuard from "@/components/layout/AuthGuard";
import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Search } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import FavoriteButton from "@/components/RecipeCard/FavoriteButton";

export const metadata = {
  title: "Favorites – Recipeat",
  description: "Your saved recipes collection.",
};

export default async function FavoritesPage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const session = await auth();
  const userId = session?.user?.id;
  
  const query = searchParams?.q || "";

  let favorites = [];
  if (userId && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    
    if (dbUser) {
      favorites = await prisma.favorite.findMany({
        where: { 
          userId: dbUser.id,
          recipe: query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          } : undefined
        },
        include: {
          recipe: {
            include: { category: true }
          }
        },
        orderBy: { savedAt: 'desc' }
      });
    }
  }

  return (
    <AuthGuard>
    <>
      <div className="min-h-screen bg-[#f5f6f7] pt-24 pb-12 font-body">
        <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        
        {/* --- SECTION 1: HEADER BANNER & SEARCH --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#e6e8ea] p-8 md:p-10 rounded-[2rem]">
          <div className="space-y-2">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#006941]">
              Your Favorites
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Your curated collection of go-to meals and culinary inspirations.
            </p>
          </div>
          
          <form action="/favorites" className="w-full md:w-96 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#006941] transition-colors">
              <Search size={20} />
            </div>
            
            <input 
              name="q"
              defaultValue={query}
              className="w-full bg-white text-slate-800 rounded-xl py-4 pl-12 pr-4 border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#006941] outline-none transition-all font-body text-sm placeholder:text-slate-400" 
              placeholder="Search saved recipes..." 
              type="text" 
            />
          </form>
        </header>

        {/* --- SECTION 2: FILTERS / TAGS --- */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-[#006941] text-[#FFFFFF] rounded-xl font-semibold text-sm tracking-wide transition-colors">
            All Saved
          </button>
        </div>

        {/* --- SECTION 3: RECIPE GRID --- */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Heart size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800">No favorites yet</h3>
              <p className="text-slate-500">Explore our recipes and save your favorites to see them here.</p>
            </div>
            <Link 
              href="/explore" 
              style={{ color: "white" }}
              className="px-6 py-3 bg-[#006941] rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((fav) => (
              <article key={fav.recipe.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl flex flex-col gap-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <Link href={`/recipes/${fav.recipe.id}`} className="block h-full">
                    <Image 
                      src={fav.recipe.imageUrl || "/favorite4.png"} 
                      alt={fav.recipe.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  </Link>
                  <FavoriteButton 
                    recipeId={fav.recipe.id} 
                    initialFavorited={true}
                    className="absolute top-3 right-3"
                  />
                </div>
                <div className="flex flex-col flex-grow space-y-3 px-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#f3fcf3] text-[#006941] text-xs font-semibold rounded-lg">
                      {fav.recipe.category?.name || "Recipe"}
                    </span>
                  </div>
                  <Link href={`/recipes/${fav.recipe.id}`}>
                    <h3 className="font-headline font-bold text-xl leading-tight text-slate-800 group-hover:text-[#006941] transition-colors">
                      {fav.recipe.title}
                    </h3>
                  </Link>
                  <div className="mt-auto flex items-center justify-end text-slate-500 text-sm pt-2">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock size={16} />
                      <span>{fav.recipe.cookTime} min</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <div className="flex justify-center pt-8 pb-4">
            <button className="px-8 py-4 bg-[#e0e3e4] text-slate-700 hover:bg-[#dadddf] rounded-xl font-headline font-bold tracking-tight transition-colors shadow-sm active:scale-95">
              Load More Favorites
            </button>
          </div>
        )}

        </main>
      </div>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </>
    </AuthGuard>
  );
}
