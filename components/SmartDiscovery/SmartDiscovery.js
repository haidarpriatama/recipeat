"use client"; // Wajib karena kita pakai useState

import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

export default function SmartDiscovery() {
  // 1. Data daftar semua bahan yang tersedia di database/sistem
  const availableIngredients = [
    "Eggs", "Spinach", "Tomato", "Garlic", "Onion", 
    "Olive Oil", "Chicken", "Mushroom", "Bell Pepper", "Beef", "Pasta"
  ];

  // 2. State untuk menyimpan bahan yang DIPILIH dan status Pop-up
  const [selectedIngredients, setSelectedIngredients] = useState(["Eggs", "Spinach"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Fungsi untuk menghapus bahan dari daftar pilihan
  const removeIngredient = (ingredientToRemove) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredientToRemove));
  };

  // 4. Fungsi untuk menambah bahan dari Pop-up
  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      removeIngredient(ingredient); // Hapus jika sudah ada (toggle off)
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]); // Tambah jika belum ada
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

      {/* --- SEARCH BAR --- */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for ingredients (e.g. Salmon, Kale, Garlic...)"
            className="w-full bg-white rounded-xl py-4 pl-12 pr-4 border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#006941] outline-none transition-shadow"
          />
        </div>
        <button className="bg-[#006941] hover:bg-[#005535] text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md">
          Find Recipes <Search size={18} />
        </button>
      </div>

      {/* --- QUICK ADD SECTION --- */}
      <div>
        {/* Label Quick Add + Ikon Plus */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#006941]">
            Quick Add
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#006941]/10 text-[#006941] hover:bg-[#006941]/20 p-1 rounded-full transition-colors"
            title="Add ingredients"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Daftar Bahan yang Dipilih */}
        <div className="flex flex-wrap gap-3">
          {selectedIngredients.length === 0 && (
            <span className="text-sm text-slate-400 italic">No ingredients selected. Click + to add.</span>
          )}
          
          {selectedIngredients.map((item) => (
            <div 
              key={item} 
              className="flex items-center gap-2 px-4 py-2 bg-[#e0f2eb] border border-[#006941] text-[#006941] rounded-full text-sm font-semibold shadow-sm transition-all"
            >
              <span>{item}</span>
              {/* Tombol Delete (X) */}
              <button 
                onClick={() => removeIngredient(item)}
                className="hover:bg-[#006941]/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- POP-UP (MODAL) INGREDIENTS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0f10]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-headline text-xl font-bold text-[#2c2f30]">Select Ingredients</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Isi Modal (Pilihan Bahan) */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                {availableIngredients.map((item) => {
                  const isSelected = selectedIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleIngredient(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        isSelected 
                          ? "bg-[#006941] border-[#006941] text-white shadow-md" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-[#006941]/50 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Modal */}
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