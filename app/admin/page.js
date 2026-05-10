import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, UtensilsCrossed, Heart, Carrot } from "lucide-react";

export default async function AdminDashboardPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const q = searchParams?.q || "";

  if (q) {
    const [matchedRecipes, matchedUsers, matchedIngredients] = await Promise.all([
      prisma.recipe.findMany({
        where: { title: { contains: q, mode: "insensitive" } },
        take: 5,
        include: { category: true },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.ingredient.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 5,
      }),
    ]);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f30]">Search Results</h1>
          <p className="mt-2 text-[#595c5d]">Showing top matches for <span className="font-bold">"{q}"</span> across the platform.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-30px_rgba(44,47,48,0.25)]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#2c2f30]">
              <Users className="h-5 w-5 text-[#006941]"/> Users ({matchedUsers.length})
            </h2>
            {matchedUsers.length > 0 ? (
               <ul className="divide-y divide-[#eff1f2]">
                 {matchedUsers.map(u => (
                   <li key={u.id} className="flex items-center justify-between py-3">
                     <div>
                       <p className="font-semibold text-[#2c2f30]">{u.name}</p>
                       <p className="text-xs text-[#595c5d]">{u.email}</p>
                     </div>
                     <Link href="/admin/users" className="text-xs font-bold text-[#006941] hover:underline">Manage</Link>
                   </li>
                 ))}
               </ul>
            ) : <p className="text-sm text-[#595c5d]">No users found.</p>}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-30px_rgba(44,47,48,0.25)]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#2c2f30]">
              <UtensilsCrossed className="h-5 w-5 text-[#006941]"/> Recipes ({matchedRecipes.length})
            </h2>
            {matchedRecipes.length > 0 ? (
               <ul className="divide-y divide-[#eff1f2]">
                 {matchedRecipes.map(r => (
                   <li key={r.id} className="flex items-center justify-between py-3">
                     <div>
                       <p className="font-semibold text-[#2c2f30]">{r.title}</p>
                       <p className="text-xs text-[#595c5d]">{r.category?.name || "Uncategorized"}</p>
                     </div>
                     <Link href={`/admin/recipes/${r.id}/edit`} className="text-xs font-bold text-[#006941] hover:underline">Edit</Link>
                   </li>
                 ))}
               </ul>
            ) : <p className="text-sm text-[#595c5d]">No recipes found.</p>}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-30px_rgba(44,47,48,0.25)]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#2c2f30]">
              <Carrot className="h-5 w-5 text-[#006941]"/> Ingredients ({matchedIngredients.length})
            </h2>
            {matchedIngredients.length > 0 ? (
               <ul className="divide-y divide-[#eff1f2]">
                 {matchedIngredients.map(i => (
                   <li key={i.id} className="flex items-center justify-between py-3">
                     <div>
                       <p className="font-semibold text-[#2c2f30]">{i.name}</p>
                     </div>
                     <Link href="/admin/ingredients" className="text-xs font-bold text-[#006941] hover:underline">Manage</Link>
                   </li>
                 ))}
               </ul>
            ) : <p className="text-sm text-[#595c5d]">No ingredients found.</p>}
          </section>
        </div>
      </div>
    );
  }

  const [totalUsers, totalRecipes, totalFavorites, totalIngredients] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.favorite.count(),
    prisma.ingredient.count(),
  ]);

  const stats = [
    { title: "Total Users", value: totalUsers, icon: Users, tone: "bg-white text-[#2c2f30] border border-[#eff1f2]" },
    { title: "Total Recipes", value: totalRecipes, icon: UtensilsCrossed, tone: "bg-white text-[#2c2f30] border border-[#eff1f2]" },
    { title: "Favorites", value: totalFavorites, icon: Heart, tone: "bg-white text-[#2c2f30] border border-[#eff1f2]" },
    { title: "Ingredients", value: totalIngredients, icon: Carrot, tone: "bg-white text-[#2c2f30] border border-[#eff1f2]" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-[#006941] to-[#005c38] p-8 text-white shadow-[0_30px_60px_-30px_rgba(0,105,65,0.6)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#caffdc]">Dashboard Overview</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Welcome back, {session.user.name || "Admin"}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#caffdc]">
          Review platform health, curate recipes, and maintain pantry taxonomy from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.title} className={`rounded-2xl p-5 shadow-[0_16px_32px_-24px_rgba(44,47,48,0.25)] ${stat.tone}`}>
              <div className="mb-3 inline-flex rounded-xl bg-black/5 p-2.5">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium opacity-80">{stat.title}</p>
              <p className="mt-1 text-3xl font-extrabold">{stat.value}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_-30px_rgba(44,47,48,0.25)]">
        <h2 className="text-xl font-extrabold text-[#2c2f30]">Quick Actions</h2>
        <p className="mt-1 text-sm text-[#595c5d]">Jump to high-frequency admin tools.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/admin/recipes" style={{ color: "white" }} className="rounded-xl bg-[#006941] px-5 py-3 text-sm font-bold transition-colors hover:bg-[#005c38]">Manage Recipes</a>
          <a href="/admin/ingredients" className="rounded-xl bg-[#eff1f2] px-5 py-3 text-sm font-bold text-[#2c2f30] transition-colors hover:bg-[#e0e3e4]">Manage Ingredients</a>
          <a href="/admin/users" className="rounded-xl bg-[#eff1f2] px-5 py-3 text-sm font-bold text-[#2c2f30] transition-colors hover:bg-[#e0e3e4]">Manage Users</a>
        </div>
      </section>
    </div>
  );
}
