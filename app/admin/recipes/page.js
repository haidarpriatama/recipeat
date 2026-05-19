import { auth } from "@/lib/auth";
import { getSafeImageSrc } from "@/lib/images";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import RecipesTableClient from "./RecipesTableClient";

export default async function AdminRecipesPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const resolvedParams = await searchParams;
  const q = resolvedParams?.q || "";
  const page = parseInt(resolvedParams?.page || "1", 10);
  const pageSize = 16;
  const skip = (page - 1) * pageSize;

  const whereClause = q
    ? { title: { contains: q, mode: "insensitive" } }
    : undefined;

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const [recipes, totalCount, totalRecipes, publishedRecipes, draftRecipes, newThisWeek] = await Promise.all([
    prisma.recipe.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        cookTime: true,
        status: true,
        createdAt: true,
        categories: {
          select: {
            name: true,
          },
        },
        _count: { select: { favorites: true, ingredients: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.recipe.count({ where: whereClause }),
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: "PUBLISHED" } }),
    prisma.recipe.count({ where: { status: "DRAFT" } }),
    prisma.recipe.count({ where: { createdAt: { gte: weekAgo } } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Serialize to plain objects (no Date/Prisma objects) for the client component
  const serializedRecipes = recipes.map((r) => ({
    id: r.id,
    title: r.title,
    imageUrl: getSafeImageSrc(r.imageUrl),
    cookTime: r.cookTime,
    status: r.status,
    categoryName: r.categories && r.categories.length > 0 ? r.categories.map(c => c.name).join(", ") : null,
    createdAt: r.createdAt.toISOString(),
    _count: r._count,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#006941]">Manage Recipes</h1>
          <p className="mt-2 max-w-2xl text-[#595c5d]">
            Review, organize, and curate your collection of seasonal culinary creations.
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          style={{ color: "white" }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-6 py-3 font-bold shadow-lg transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Recipes" value={totalRecipes} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
        <StatCard label="Published" value={publishedRecipes} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
        <StatCard label="Drafts" value={draftRecipes} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
        <StatCard label="New This Week" value={newThisWeek} tone="bg-white text-[#2c2f30] border border-[#eff1f2]" />
      </div>

      <RecipesTableClient
        recipes={serializedRecipes}
        page={page}
        totalPages={totalPages}
        q={q}
      />
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl p-5 ${tone}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
