"use client";

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SmartDiscovery({ initialQuery = "", initialIngredients = [], availableIngredients = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ingredientOptions = availableIngredients.length > 0 ? availableIngredients : [
    "Telur", "Bayam", "Tomat", "Bawang Putih", "Bawang Merah", 
    "Minyak Goreng", "Ayam", "Jamur", "Daging Sapi", "Cabai", "Pasta", "Keju"
  ];

  const [selectedIngredients, setSelectedIngredients] = useState(initialIngredients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const popularIngredients = ["Ayam", "Telur", "Bawang Putih", "Bawang Merah", "Tomat", "Cabai", "Bayam", "Keju"];
  const quickAddIngredients = [
    ...popularIngredients.filter((ingredient) => ingredientOptions.includes(ingredient)),
    ...ingredientOptions.filter((ingredient) => !popularIngredients.includes(ingredient)),
  ].slice(0, 8);
  const customSelectedIngredients = selectedIngredients.filter(
    (ingredient) => !quickAddIngredients.includes(ingredient)
  );
  const filteredIngredientOptions = ingredientOptions.filter((ingredient) =>
    ingredient.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }

    if (selectedIngredients.length > 0) {
      params.set('ingredients', selectedIngredients.join(','));
    } else {
      params.delete('ingredients');
    }

    router.push(`/explore?${params.toString()}`);
  };

  const removeIngredient = (ingredientToRemove) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredientToRemove));
  };

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      removeIngredient(ingredient);
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <div className="bg-[#f5f6f7] rounded-2xl p-6 md:p-8 mb-12">
      <h2 className="font-headline text-2xl font-bold text-[#2c2f30] mb-2">
        Smart Discovery
      </h2>
      <p className="text-slate-500 mb-6">
        Find recipes based on what&apos;s in your pantry right now.
      </p>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for recipes or ingredients (e.g. Salmon, Pasta...)"
            className="w-full bg-white rounded-xl py-4 pl-12 pr-4 border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#006941] outline-none transition-shadow"
          />
        </div>
        <button 
          onClick={handleSearch}
          className="bg-[#006941] hover:bg-[#005535] text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md"
        >
          Find Recipes <Search size={18} />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#006941]">
            Quick Add
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full border border-[#006941] bg-[#006941] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#005535]"
          >
            Add More
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {[...quickAddIngredients, ...customSelectedIngredients].map((item) => {
            const isSelected = selectedIngredients.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleIngredient(item)}
                className={`group flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isSelected
                    ? "bg-[#006941] border-[#006941] text-white shadow-md hover:bg-red-500 hover:border-red-500"
                    : "bg-transparent border-dashed border-[#006941]/40 text-[#006941] shadow-sm hover:border-solid hover:bg-[#006941] hover:text-white"
                }`}
              >
                <span>{item}</span>
                {isSelected && <X size={14} className="hidden group-hover:block" />}
              </button>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0f10]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-headline text-xl font-bold text-[#2c2f30]">Select Ingredients</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={ingredientSearchQuery}
                  onChange={(e) => setIngredientSearchQuery(e.target.value)}
                  placeholder="Search ingredients..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition-shadow focus:ring-2 focus:ring-[#006941]"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {filteredIngredientOptions.map((item) => {
                  const isSelected = selectedIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleIngredient(item)}
                      className={`group flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        isSelected 
                          ? "bg-[#006941] border-[#006941] text-white shadow-md hover:bg-red-500 hover:border-red-500" 
                          : "bg-transparent border-dashed border-slate-300 text-slate-600 hover:border-solid hover:border-[#006941]/50 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected && <X size={14} className="hidden group-hover:block" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-[#006941] hover:bg-[#005535] text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
