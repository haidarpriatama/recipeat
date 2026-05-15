"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Timer, Star, Loader2, Check } from "lucide-react";

export default function RecipePickerModal({ slot, dateStr, onClose, onAdded }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(null);
  const [added, setAdded] = useState(new Set());

  const fetchRecipes = useCallback(async (query) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mealTypes: slot });
      if (query) params.set("q", query);
      const res = await fetch(`/api/explore?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes || []);
      }
    } catch (e) {
      console.error("Failed to fetch recipes:", e);
    } finally {
      setLoading(false);
    }
  }, [slot]);

  useEffect(() => { fetchRecipes(""); }, [fetchRecipes]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchRecipes(q), 300);
    return () => clearTimeout(timeout);
  }, [q, fetchRecipes]);

  const handleAdd = async (recipe) => {
    if (added.has(recipe.id) || adding === recipe.id) return;
    setAdding(recipe.id);

    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = DAYS[dateObj.getDay()];
    const weekStartDate = new Date(dateObj);
    weekStartDate.setDate(dateObj.getDate() - (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1));
    const pad = (n) => String(n).padStart(2, "0");
    const weekStart = `${weekStartDate.getFullYear()}-${pad(weekStartDate.getMonth() + 1)}-${pad(weekStartDate.getDate())}`;

    try {
      const res = await fetch("/api/mealplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id, weekStart, dayOfWeek, mealType: slot }),
      });
      if (res.ok) {
        setAdded((prev) => new Set([...prev, recipe.id]));
        if (onAdded) onAdded();
      } else if (res.status === 409) {
        const data = await res.json();
        alert(data.message);
      }
    } catch (e) {
      console.error("Add error:", e);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative z-10 flex flex-col w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl bg-[#f5f6f7] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-[#eff1f2]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#006941]">{slot}</p>
            <h2 className="text-xl font-extrabold text-[#2c2f30] leading-tight">Pick a recipe</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[#595c5d] hover:bg-[#eff1f2] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 bg-white border-b border-[#eff1f2]">
          <div className="flex items-center gap-2 rounded-xl bg-[#f5f6f7] px-3 py-2">
            <Search className="h-4 w-4 text-[#959798] flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search ${slot.toLowerCase()} recipes…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent text-sm text-[#2c2f30] placeholder:text-[#abadae] outline-none"
            />
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#006941]" />
            </div>
          ) : recipes.length === 0 ? (
            <p className="text-center text-sm text-[#959798] py-12">No recipes found.</p>
          ) : (
            recipes.map((recipe) => {
              const isAdded = added.has(recipe.id);
              const isAdding = adding === recipe.id;
              return (
                <button
                  key={recipe.id}
                  onClick={() => handleAdd(recipe)}
                  disabled={isAdding}
                  className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98] ${
                    isAdded
                      ? "bg-[#f3fcf3] border border-[#caffdc]"
                      : "bg-white hover:bg-[#f3fcf3] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2c2f30] line-clamp-1">{recipe.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-[#959798]">
                      {recipe.cookTime && (
                        <span className="inline-flex items-center gap-1">
                          <Timer className="h-3 w-3 text-[#006941]" />{recipe.cookTime} min
                        </span>
                      )}
                      {recipe.rating != null && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#ffb800] text-[#ffb800]" />
                          {Number(recipe.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isAdding
                      ? <Loader2 className="h-4 w-4 animate-spin text-[#006941]" />
                      : isAdded
                      ? <Check className="h-4 w-4 text-[#006941]" />
                      : null
                    }
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
