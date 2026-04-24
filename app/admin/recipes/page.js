import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminRecipesPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
      _count: {
        select: { favorites: true, mealPlans: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recipes Management</h1>
          <p className="text-slate-500 mt-2">View and manage all recipes available to users.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#006941] text-white font-bold rounded-xl hover:bg-[#004b2d] transition-colors shadow-sm">
          + Add New Recipe
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Cook Time</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Stats</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-500">#{recipe.id}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">{recipe.title}</td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      {recipe.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{recipe.cookTime} mins</td>
                  <td className="py-4 px-6 text-slate-500 text-sm">
                    {recipe._count.favorites} favs
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">No recipes found. Start adding some!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
