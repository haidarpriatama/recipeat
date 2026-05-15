"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Timer, Star, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/ui/SafeImage";

export default function MealCard({ meal, compact = false, onDelete, onRepeatToggle }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatWeekly, setRepeatWeekly] = useState(meal.repeatWeekly ?? false);

  const handleDelete = async () => {
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
        setConfirmOpen(false);
        if (onDelete) onDelete();
        else router.refresh();
      } else {
        alert("Failed to delete meal.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRepeatToggle = async () => {
    setIsRepeating(true);
    const newVal = !repeatWeekly;
    try {
      const res = await fetch('/api/mealplan/repeat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealPlanId: meal.mealPlanId,
          recipeId: meal.id,
          dayOfWeek: meal.dayOfWeek,
          mealType: meal.mealType,
          repeatWeekly: newVal,
        }),
      });
      if (res.ok) {
        setRepeatWeekly(newVal);
        if (onRepeatToggle) onRepeatToggle();
      }
    } catch (error) {
      console.error("Repeat toggle error:", error);
    } finally {
      setIsRepeating(false);
    }
  };

  return (
    <>
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
            onClick={() => setConfirmOpen(true)}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-400 shadow-sm transition-colors hover:text-red-500"
            title="Remove from plan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="relative h-48 md:h-auto md:w-1/3">
            <SafeImage
              src={meal.image}
              alt={meal.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-between p-6 md:w-2/3">
            <div>
              <Link href={`/recipes/${meal.id}`}><h3 className="mb-2 text-xl font-bold hover:text-[#006941] transition-colors">{meal.title}</h3></Link>
              <p className="text-sm text-[#595c5d] line-clamp-2">{meal.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-[#595c5d]">
                <span className="inline-flex items-center gap-1.5"><Timer className="h-4 w-4 text-[#006941]" />{meal.prepTime}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#ffb800] text-[#ffb800]" />
                  {meal.rating || "0.0"}
                </span>
              </div>
              <button
                onClick={handleRepeatToggle}
                disabled={isRepeating}
                title={repeatWeekly ? "Stop repeating weekly" : "Repeat every week on this day"}
                className="inline-flex items-center gap-2 disabled:opacity-50"
              >
                <span className={`text-xs font-semibold transition-colors duration-200 ${repeatWeekly ? "text-[#006941]" : "text-[#595c5d]"}`}>Weekly</span>
                {isRepeating
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#006941]" />
                  : (
                    <span className={`relative inline-flex h-4 w-7 flex-shrink-0 rounded-full transition-colors duration-200 ${repeatWeekly ? "bg-[#006941]" : "bg-[#d4d6d7]"}`}>
                      <span className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200 self-center ${repeatWeekly ? "translate-x-3.5" : "translate-x-0.5"}`} />
                    </span>
                  )
                }
              </button>
            </div>
          </div>
        </div>
      </article>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="p-6">
              <h3 className="mb-2 text-xl font-extrabold text-[#2c2f30]">Remove from plan?</h3>
              <p className="text-sm text-[#595c5d]">
                Are you sure you want to remove <span className="font-bold text-[#2c2f30]">{meal.title}</span> from your meal plan?
              </p>
            </div>
            <div className="flex justify-end gap-3 bg-[#eff1f2]/50 px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[#595c5d] hover:bg-[#e0e3e4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ color: "white" }}
                className="rounded-xl bg-[#b31b25] px-4 py-2 text-sm font-bold shadow-md hover:bg-[#92141c] disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
