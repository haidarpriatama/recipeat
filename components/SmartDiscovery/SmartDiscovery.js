"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Search, X, History, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SmartDiscovery({ initialQuery = "", initialIngredients = [], availableIngredients = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // availableIngredients are already sorted by most-used from the server
  const ingredientOptions = availableIngredients.length > 0 ? availableIngredients : [];

  const [hiddenQuickAdds, setHiddenQuickAdds] = useState([]);

  // Quick Add: first 8 most-used ingredients that are not hidden
  const quickAddIngredients = ingredientOptions
    .filter(item => !hiddenQuickAdds.includes(item))
    .slice(0, 8);

  const [selectedIngredients, setSelectedIngredients] = useState(initialIngredients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('recipeSearchHistory')) || [];
      setSearchHistory(history);
    } catch (e) {}
    try {
      const hidden = JSON.parse(localStorage.getItem('hiddenQuickAdds')) || [];
      setHiddenQuickAdds(hidden);
    } catch (e) {}
  }, []);

  const hideQuickAdd = (item) => {
    try {
      const next = [...hiddenQuickAdds, item];
      setHiddenQuickAdds(next);
      localStorage.setItem('hiddenQuickAdds', JSON.stringify(next));
    } catch(e) {}
  };

  const saveToHistory = (query) => {
    if (!query.trim()) return;
    try {
      let history = JSON.parse(localStorage.getItem('recipeSearchHistory')) || [];
      history = history.filter(item => item !== query.trim());
      history.unshift(query.trim());
      if (history.length > 3) {
        history = history.slice(0, 3);
      }
      localStorage.setItem('recipeSearchHistory', JSON.stringify(history));
      setSearchHistory(history);
    } catch (e) {}
  };

  const customSelectedIngredients = selectedIngredients.filter(
    (ingredient) => !quickAddIngredients.includes(ingredient)
  );

  const filteredIngredientOptions = ingredientOptions.filter((ingredient) =>
    ingredient.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
  );

  const buildAndNavigate = (query, ingredients) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    if (ingredients.length > 0) {
      params.set('ingredients', ingredients.join(','));
    } else {
      params.delete('ingredients');
    }
    params.delete('page');
    startTransition(() => {
      router.push(`/explore?${params.toString()}`);
    });
  };

  const handleSearch = () => {
    saveToHistory(searchQuery);
    setShowHistory(false);
    buildAndNavigate(searchQuery, selectedIngredients);
  };

  const removeIngredient = (ingredientToRemove) => {
    const next = selectedIngredients.filter(item => item !== ingredientToRemove);
    setSelectedIngredients(next);
    buildAndNavigate(searchQuery, next);
  };

  const toggleIngredient = (ingredient) => {
    const next = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(item => item !== ingredient)
      : [...selectedIngredients, ingredient];
    setSelectedIngredients(next);
    buildAndNavigate(searchQuery, next);
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="Search for recipes or ingredients (e.g. Salmon, Pasta...)"
            className="w-full bg-white rounded-xl py-4 pl-12 pr-4 border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#006941] outline-none transition-shadow"
          />
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] border border-[#eff1f2] overflow-hidden z-20">
              <div className="px-4 py-2 bg-[#f5f6f7] text-[10px] font-bold uppercase tracking-widest text-[#959798]">
                Recent Searches
              </div>
              <ul>
                {searchHistory.map((item, index) => (
                  <li key={index} className="border-b border-[#eff1f2] last:border-0">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                      onClick={() => {
                        setSearchQuery(item);
                        saveToHistory(item);
                        buildAndNavigate(item, selectedIngredients);
                        setShowHistory(false);
                      }}
                      className="group w-full text-left px-4 py-3 text-sm text-[#595c5d] hover:bg-[#f3fcf3] hover:text-[#006941] transition-colors flex items-center gap-3"
                    >
                      <History size={16} className="text-[#abadae] flex-shrink-0 transition-colors group-hover:text-[#006941]" />
                      <span className="truncate font-medium">{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button 
          onClick={handleSearch}
          disabled={isPending}
          className="bg-[#006941] hover:bg-[#005535] text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md disabled:opacity-70"
        >
          {isPending ? "Searching..." : <><span>Find Recipes</span> <Search size={18} /></>}
        </button>
      </div>

      {ingredientOptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#006941]">
              Quick Add
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            {[...quickAddIngredients, ...customSelectedIngredients].map((item) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleIngredient(item)}
                  disabled={isPending}
                  className={`group flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all border disabled:opacity-60 ${
                    isSelected
                      ? "bg-[#006941] border-[#006941] text-white shadow-md hover:bg-red-500 hover:border-red-500"
                      : "bg-transparent border-dashed border-[#006941]/40 text-[#006941] shadow-sm hover:border-solid hover:bg-[#006941] hover:text-white"
                  }`}
                >
                  <span>{item}</span>
                  <span 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isSelected) {
                        removeIngredient(item);
                      } else {
                        hideQuickAdd(item);
                      }
                    }}
                    className={`ml-0.5 rounded-full p-0.5 transition-colors hidden group-hover:flex items-center justify-center ${
                      isSelected ? 'hover:bg-red-700' : 'hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <X size={14} />
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isPending}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all border border-[#006941] bg-[#006941] text-white shadow-md hover:bg-[#005535] disabled:opacity-60"
            >
              <Plus size={16} />
              <span>Add More</span>
            </button>
          </div>
        </div>
      )}

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
                      {isSelected && (
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeIngredient(item);
                          }}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-red-700 transition-colors hidden group-hover:flex items-center justify-center"
                        >
                          <X size={14} />
                        </span>
                      )}
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
