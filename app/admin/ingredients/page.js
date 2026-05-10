import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminIngredientsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const ingredients = await prisma.ingredient.findMany({
    include: {
      _count: {
        select: { recipes: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const total = ingredients.length;
  const active = ingredients.filter((ingredient) => ingredient._count.recipes > 0).length;
  const unused = total - active;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f30]">Manage Ingredients</h1>
          <p className="mt-2 text-[#595c5d]">Detailed overview of your master pantry inventory.</p>
        </div>
        <button className="rounded-xl bg-[#006941] px-6 py-3 font-bold text-white transition-colors hover:bg-[#005c38]">
          Add Ingredient
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Global Inventory" value={total} tone="bg-[#eff1f2] text-[#2c2f30]" />
        <MetricCard label="Used in Recipes" value={active} tone="bg-[#f3fcf3] text-[#006941]" />
        <MetricCard label="Unused" value={unused} tone="bg-[#ffc69a]/40 text-[#7b4000]" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
        <div className="border-b border-[#eff1f2] px-6 py-4">
          <h2 className="text-lg font-bold text-[#2c2f30]">Ingredient Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#eff1f2]/60">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Ingredient</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Used In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff1f2]">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="transition-colors hover:bg-[#f5f6f7]">
                  <td className="px-6 py-4 text-sm font-semibold text-[#595c5d]">ING-{String(ingredient.id).padStart(5, "0")}</td>
                  <td className="px-6 py-4 font-semibold text-[#2c2f30]">{ingredient.name}</td>
                  <td className="px-6 py-4 text-sm text-[#595c5d]">{ingredient._count.recipes} recipes</td>
                </tr>
              ))}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-[#595c5d]">
                    No ingredients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl p-5 ${tone}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
