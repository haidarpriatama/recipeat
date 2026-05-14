"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
          className="flex items-center gap-2 rounded-xl bg-[#006941] px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Ingredient
        </button>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No ingredients added yet.</p>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              {availableIngredients.length > 0 ? (
                <div className="flex-1">
                  <select
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                    className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2 text-sm"
                  >
                    <option value="">Select ingredient...</option>
                    {availableIngredients.map((ai) => (
                      <option key={ai.id} value={ai.name}>
                        {ai.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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
