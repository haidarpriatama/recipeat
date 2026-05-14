"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";

function IngredientDropdown({ value, onChange, availableIngredients }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIngredients = availableIngredients.filter((ai) =>
    ai.name.toLowerCase().includes(query.toLowerCase())
  );

  const isExactMatch = availableIngredients.some(
    (ai) => ai.name.toLowerCase() === query.toLowerCase()
  );

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div
        className="w-full cursor-pointer appearance-none rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus-within:ring-2 text-sm flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-[#2c2f30]" : "text-[#595c5d]"}>
          {value || "Select ingredient..."}
        </span>
        <ChevronDown className="text-gray-400" size={18} />
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-2 z-50 w-full rounded-2xl bg-white p-3 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.15)] border border-[#eff1f2] max-h-72 flex flex-col">
          <div className="bg-white pb-3 pt-1">
            <input
              type="text"
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#006941] transition-shadow"
              placeholder="Search or type to add..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="space-y-1 overflow-y-auto flex-1">
            {filteredIngredients.map((ai) => (
              <button
                key={ai.id}
                type="button"
                className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-[#2c2f30] hover:bg-[#f5f6f7] transition-colors"
                onClick={() => {
                  onChange(ai.name);
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                {ai.name}
              </button>
            ))}
            
            {query.trim() !== "" && !isExactMatch && (
              <button
                type="button"
                className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-[#006941] hover:bg-[#caffdc] transition-colors flex items-center gap-2"
                onClick={() => {
                  onChange(query.trim());
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                <Plus size={16} /> Add &quot;{query.trim()}&quot; to database
              </button>
            )}
            
            {filteredIngredients.length === 0 && query.trim() === "" && (
              <div className="px-4 py-3 text-sm text-center text-[#595c5d] italic">
                Type to search or add new ingredient.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipeIngredientManager({ initialIngredients = [], availableIngredients = [] }) {
  const [ingredients, setIngredients] = useState(
    initialIngredients.length > 0 ? initialIngredients : [{ name: "", quantity: "" }]
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="ingredientsData" value={JSON.stringify(ingredients)} />
      
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#595c5d]">Ingredients</label>
        <button
          type="button"
          onClick={addIngredient}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-4 py-2 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> Add Ingredient
        </button>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No ingredients added yet.</p>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              {availableIngredients.length > 0 ? (
                <IngredientDropdown
                  value={ing.name}
                  onChange={(val) => handleIngredientChange(idx, "name", val)}
                  availableIngredients={availableIngredients}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Ingredient (e.g. Olive Oil)"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                  className="flex-1 rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2 text-sm"
                />
              )}
              <input
                type="text"
                placeholder="Quantity (e.g. 2 tbsp)"
                value={ing.quantity}
                onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)}
                className="w-1/3 rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="mt-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove ingredient"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
