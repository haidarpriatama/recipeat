"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function RecipeIngredientManager({ initialIngredients = [] }) {
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
          className="flex items-center gap-1 rounded-lg bg-[#eff1f2] px-3 py-1.5 text-xs font-semibold text-[#006941] hover:bg-[#dadddf] transition-colors"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No ingredients added yet.</p>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Ingredient (e.g. Olive Oil)"
                value={ing.name}
                onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                className="flex-1 rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2 text-sm"
              />
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
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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
