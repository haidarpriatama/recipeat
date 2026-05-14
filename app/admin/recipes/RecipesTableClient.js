"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, ExternalLink, X } from "lucide-react";
import { deleteRecipeAction } from "./actions";

function TableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="grid grid-cols-6 gap-4 bg-slate-50 px-6 py-4">
          {["w-10", "w-24", "w-20", "w-24", "w-16", "w-16"].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-slate-300`} />
          ))}
        </div>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 items-center gap-4 border-t border-slate-100 px-6 py-4">
            <div className="h-12 w-16 rounded-lg bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded bg-slate-300" />
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="flex justify-end gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-10 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default function RecipesTableClient({ recipes, page, totalPages, q }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteItem, setDeleteItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("id", deleteItem.id);
    await deleteRecipeAction(formData);
    setDeleteItem(null);
    setIsSubmitting(false);
  };

  const navigate = (p) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    startTransition(() => {
      router.push(`/admin/recipes?${params.toString()}`);
    });
  };

  return (
    <>
      {isPending ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#eff1f2]/60">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Image</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Recipe</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Date Added</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#595c5d]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eff1f2]">
                  {recipes.map((recipe) => {
                    const published = recipe.status === "PUBLISHED";
                    return (
                      <tr key={recipe.id} className="transition-colors hover:bg-[#f5f6f7]">
                        <td className="px-6 py-4">
                          <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#eff1f2]">
                            <Image
                              src={recipe.imageUrl || "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2c2f30]">{recipe.title}</p>
                          <p className="text-xs text-[#595c5d]">{recipe.cookTime} mins • {recipe._count.favorites} favorites</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold text-[#58615a]">
                            {recipe.categoryName || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#595c5d]">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${published ? "bg-[#caffdc] text-[#006941]" : "bg-[#ffc69a]/50 text-[#7b4000]"}`}>
                            {published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {published ? (
                              <Link
                                href={`/recipes/${recipe.id}`}
                                target="_blank"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#006941] transition-colors hover:bg-[#f3fcf3]"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            ) : (
                              <span
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 cursor-not-allowed"
                                title="Draft recipes cannot be viewed externally"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </span>
                            )}
                            <Link
                              href={`/admin/recipes/${recipe.id}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#006941] transition-colors hover:bg-[#f3fcf3]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteItem(recipe)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#b31b25] transition-colors hover:bg-[#ffefee]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {recipes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#595c5d]">
                        No recipes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    disabled={isPending}
                    style={{ color: page === p ? "white" : undefined }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors ${
                      page === p
                        ? "bg-[#006941] text-white"
                        : "bg-white text-[#595c5d] hover:bg-[#eff1f2]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="p-6">
              <h3 className="mb-2 text-xl font-extrabold text-[#2c2f30]">Delete Recipe?</h3>
              <p className="text-sm text-[#595c5d]">
                Are you sure you want to delete <span className="font-bold text-[#2c2f30]">{deleteItem.title}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 bg-[#eff1f2]/50 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[#595c5d] hover:bg-[#e0e3e4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                style={{ color: "white" }}
                className="rounded-xl bg-[#b31b25] px-4 py-2 text-sm font-bold shadow-md hover:bg-[#92141c] disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
