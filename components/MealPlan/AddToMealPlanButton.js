"use client";

import { useState } from 'react';
import { AlertCircle, CalendarPlus, Check } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AddToMealPlanButton({ recipeId, mealType }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [warning, setWarning] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      setWarning("");
      const intendedSlot = mealType || searchParams.get('slot') || "Lunch";

      const dateParam = searchParams.get('date');
      let today = new Date();
      
      if (dateParam) {
        const parsed = new Date(dateParam);
        if (!isNaN(parsed)) {
          const [y, m, d] = dateParam.split('-');
          if (y && m && d) {
            today = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          }
        }
      }

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
        const queryString = searchParams.toString();
        const callbackUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      if (res.status === 409) {
        const data = await res.json();
        setWarning(data.message || `${intendedSlot} meal plan is full.`);
        return;
      }

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
        if (dateParam) {
          router.push(`/meal-plans?date=${dateParam}`);
        } else {
          router.push('/meal-plans');
        }
      }
    } catch (error) {
      console.error('Error adding to meal plan:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAdd}
        disabled={isAdding || isSuccess}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold transition-all shadow-lg active:scale-95 ${
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

      {warning && (
        <div className="mt-4 flex max-w-md items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
    </>
  );
}
