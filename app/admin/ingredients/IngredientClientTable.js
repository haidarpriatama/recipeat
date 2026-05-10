"use client";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteIngredientAction, updateIngredientAction } from "./actions";

export default function IngredientClientTable({ ingredients }) {
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    await updateIngredientAction(editItem.id, formData.get("name"));
    setEditItem(null);
    setIsSubmitting(false);
  };

  const handleDeleteSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await deleteIngredientAction(deleteItem.id);
    setDeleteItem(null);
    setIsSubmitting(false);
  };

  return (
    <>
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
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#595c5d]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff1f2]">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="transition-colors hover:bg-[#f5f6f7]">
                  <td className="px-6 py-4 text-sm font-semibold text-[#595c5d]">ING-{String(ingredient.id).padStart(5, "0")}</td>
                  <td className="px-6 py-4 font-semibold text-[#2c2f30]">{ingredient.name}</td>
                  <td className="px-6 py-4 text-sm text-[#595c5d]">{ingredient._count.recipes} recipes</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditItem(ingredient)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#006941] transition-colors hover:bg-[#f3fcf3]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteItem(ingredient)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#b31b25] transition-colors hover:bg-[#ffefee]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[#595c5d]">
                    No ingredients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eff1f2] px-6 py-4">
              <h3 className="text-lg font-extrabold text-[#2c2f30]">Edit Ingredient</h3>
              <button onClick={() => setEditItem(null)} className="text-[#595c5d] hover:text-[#2c2f30]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-2 mb-6">
                <label htmlFor="name" className="text-sm font-bold text-[#2c2f30]">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editItem.name}
                  className="w-full rounded-xl border border-[#eff1f2] bg-white px-4 py-3 outline-none focus:border-[#006941] focus:ring-1 focus:ring-[#006941]"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#595c5d] hover:bg-[#eff1f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ color: "white" }}
                  className="rounded-xl bg-[#006941] px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[#005c38] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="p-6">
              <h3 className="mb-2 text-xl font-extrabold text-[#2c2f30]">Delete Ingredient?</h3>
              <p className="text-sm text-[#595c5d]">
                Are you sure you want to delete <span className="font-bold text-[#2c2f30]">{deleteItem.name}</span>? This will remove it from all recipes and cannot be undone.
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
