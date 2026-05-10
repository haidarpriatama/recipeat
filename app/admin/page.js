import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, UtensilsCrossed, Heart } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  // Fetch stats from DB
  const [totalUsers, totalRecipes, totalFavorites] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.favorite.count(),
  ]);

  const stats = [
    { title: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Recipes", value: totalRecipes, icon: UtensilsCrossed, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Favorites", value: totalFavorites, icon: Heart, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the admin dashboard, {session.user.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon size={28} className={stat.color} />
              </div>
              <div>
                <p className="text-slate-500 font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <p className="text-slate-600 mb-6">Manage the application from the sidebar or use these quick links.</p>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/users" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
            Manage Users
          </a>
          <a href="/admin/recipes" className="px-6 py-3 bg-[#006941] text-white rounded-xl font-semibold hover:bg-[#004b2d] transition-colors">
            Manage Recipes
          </a>
          <a href="/admin/ingredients" className="px-6 py-3 bg-[#eff1f2] text-[#2c2f30] rounded-xl font-semibold hover:bg-[#dadddf] transition-colors">
            Manage Ingredients
          </a>
        </div>
      </div>
    </div>
  );
}
