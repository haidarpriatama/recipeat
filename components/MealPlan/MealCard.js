"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Timer, UtensilsCrossed, Flame, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MealCard({ meal, compact = false }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this meal from your plan?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/mealplan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mealPlanId: meal.mealPlanId,
          recipeId: meal.id,
          dayOfWeek: meal.dayOfWeek,
          mealType: meal.mealType
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete meal.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className={compact ? "group relative" : "group relative pl-16"}>
      {!compact && <div className="absolute left-4 top-1 z-10 h-4 w-4 rounded-full bg-[#006941] ring-4 ring-[#caffdc]" />}
      {!compact && (
        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#58615a]">{meal.slot}</span>
          <span className="text-sm font-medium text-[#595c5d]">{meal.time}</span>
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_16px_38px_-14px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_16px_38px_-14px_rgba(0,105,65,0.25)] md:flex">
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-400 shadow-sm transition-colors hover:text-red-500"
          title="Remove from plan"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
        <div className="relative h-48 md:h-auto md:w-1/3">
          <Image src={meal.image} alt={meal.imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 100vw" />
        </div>
        <div className="flex flex-col justify-between p-6 md:w-2/3">
          <div>
            <Link href={`/recipes/${meal.id}`}><h3 className="mb-2 text-xl font-bold hover:text-[#006941] transition-colors">{meal.title}</h3></Link>
            <p className="text-sm text-[#595c5d] line-clamp-2">{meal.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-semibold text-[#595c5d]">
            <span className="inline-flex items-center gap-1.5"><Timer className="h-4 w-4 text-[#006941]" />{meal.prepTime}</span>
            <span className="inline-flex items-center gap-1.5"><UtensilsCrossed className="h-4 w-4 text-[#006941]" />{meal.difficulty}</span>
            <span className="inline-flex items-center gap-1.5"><Flame className="h-4 w-4 text-[#006941]" />{meal.calories}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
