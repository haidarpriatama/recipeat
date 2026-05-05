"use client";

import { useState } from 'react';
import { CalendarPlus, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddToMealPlanButton({ recipeId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      // Get the intended slot from URL if available
      const intendedSlot = searchParams.get('slot') || "Lunch";

      // In a real app, we'd show a modal to pick the day.
      // For this demo, we'll just add it to 'Monday' of the current week.
      const today = new Date();
      const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = DAYS[today.getDay()];
      
      // Normalize to Monday 00:00:00 for the week start
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      weekStart.setHours(0, 0, 0, 0);

      const res = await fetch('/api/mealplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipeId, 
          weekStart: weekStart.toISOString(),
          dayOfWeek: currentDay,
          mealType: intendedSlot
        }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
        router.push('/meal-plans');
      }
    } catch (error) {
      console.error('Error adding to meal plan:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding || isSuccess}
      className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold transition-all shadow-lg active:scale-95 ${
        isSuccess 
          ? "bg-green-500 text-white" 
          : "bg-[#006941] hover:bg-[#005535] text-white"
      }`}
    >
      {isSuccess ? (
        <>
          <Check className="h-5 w-5" /> Added to Plan
        </>
      ) : (
        <>
          <CalendarPlus className="h-5 w-5" /> 
          {isAdding ? "Planning..." : "Plan this Meal"}
        </>
      )}
    </button>
  );
}
