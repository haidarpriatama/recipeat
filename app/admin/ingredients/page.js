import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import IngredientClientTable from "./IngredientClientTable";
import AddIngredientButton from "./AddIngredientButton";

export default async function AdminIngredientsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const { q = "" } = await searchParams;

  const ingredients = await prisma.ingredient.findMany({
    where: q
      ? { name: { contains: q, mode: "insensitive" } }
      : undefined,
    include: {
      recipes: {
        include: {
          recipe: {
            select: { title: true }
          }
        }
      },
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
        <AddIngredientButton />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Global Inventory" value={total} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
        <MetricCard label="Used in Recipes" value={active} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
        <MetricCard label="Unused" value={unused} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
      </div>

      <IngredientClientTable ingredients={ingredients} />
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
