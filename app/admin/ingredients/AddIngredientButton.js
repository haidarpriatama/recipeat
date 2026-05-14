"use client";
import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { createIngredientAction } from "./actions";

export default function AddIngredientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const name = formData.get("name");
    try {
      await createIngredientAction(name);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ color: "white" }}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-6 py-3 font-bold shadow-lg transition-opacity hover:opacity-90"
      >
        <PlusCircle className="h-5 w-5" />
        Add Ingredient
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eff1f2] px-6 py-4">
              <h3 className="text-lg font-extrabold text-[#2c2f30]">Add New Ingredient</h3>
              <button onClick={() => setIsOpen(false)} className="text-[#595c5d] hover:text-[#2c2f30]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-2 mb-6">
                <label htmlFor="name" className="text-sm font-bold text-[#2c2f30]">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoFocus
                  placeholder="e.g. Olive Oil"
                  className="w-full rounded-xl border border-[#eff1f2] bg-white px-4 py-3 outline-none focus:border-[#006941] focus:ring-1 focus:ring-[#006941]"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                  {isSubmitting ? "Adding..." : "Add Ingredient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
