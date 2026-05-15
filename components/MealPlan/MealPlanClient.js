"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import MealCard from "./MealCard";
import RecipePickerModal from "./RecipePickerModal";
import Link from "next/link";

const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ── Calendar ────────────────────────────────────────────────────────────────
function Calendar({ selectedDate, onDateSelect }) {
  const [viewDate, setViewDate] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const cursor = new Date(year, month, 1);
    const days = [];

    const firstDay = cursor.getDay();
    const shift = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = shift - 1; i >= 0; i--) {
      days.push({ label: prevMonthDays - i, muted: true, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    while (cursor.getMonth() === month) {
      days.push({ label: cursor.getDate(), muted: false, date: new Date(cursor) });
      cursor.setDate(cursor.getDate() + 1);
    }
    let nextDay = 1;
    while (days.length % 7 !== 0 || days.length < 42) {
      days.push({ label: nextDay, muted: true, date: new Date(year, month + 1, nextDay++) });
    }
    return days;
  };

  const days = getCalendarDays();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });
  const year = viewDate.getFullYear();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,105,65,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">{monthName} {year}</h3>
        <div className="flex items-center gap-1 text-[#595c5d]">
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            type="button"
            className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            type="button"
            className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-[#595c5d]">
        {"MTWTFSS".split("").map((day, i) => (
          <span key={`h-${i}`} className="uppercase">{day}</span>
        ))}
        {days.map((day, idx) => {
          const today = new Date();
          const isToday =
            !day.muted &&
            day.date.getDate() === today.getDate() &&
            day.date.getMonth() === today.getMonth() &&
            day.date.getFullYear() === today.getFullYear();
          const isSelected =
            day.date.getDate() === selectedDate.getDate() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getFullYear() === selectedDate.getFullYear();
          return (
            <button
              key={`d-${idx}`}
              onClick={() => onDateSelect(day.date)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isSelected
                  ? "bg-[#006941] font-bold text-white shadow-lg shadow-[#006941]/20"
                  : isToday
                  ? "font-bold text-[#006941] ring-1 ring-[#006941]/40"
                  : day.muted
                  ? "text-[#abadae]"
                  : "hover:bg-[#eff1f2]"
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Timeline skeleton ────────────────────────────────────────────────────────
function TimelineSkeleton() {
  return (
    <div className="space-y-12">
      {["Breakfast", "Lunch", "Dinner"].map((slot) => (
        <div key={slot} className="relative pl-16">
          <div className="absolute left-4 top-1 h-4 w-4 rounded-full bg-[#caffdc]" />
          <div className="mb-4 flex items-center gap-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-[#eff1f2]" />
            <div className="h-4 w-16 animate-pulse rounded bg-[#eff1f2]" />
          </div>
          <div className="h-36 animate-pulse rounded-2xl bg-[#eff1f2]" />
        </div>
      ))}
    </div>
  );
}

// ── Timeline item ────────────────────────────────────────────────────────────
const SLOT_TIME = { Breakfast: "08:00 AM", Lunch: "01:30 PM", Dinner: "07:30 PM" };
const SLOTS = ["Breakfast", "Lunch", "Dinner"];

function TimelineItem({ slot, meals, dateStr, onMealDeleted }) {
  const slotMeals = meals.filter((m) => m.mealType === slot);
  const remaining = 3 - slotMeals.length;
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <article className="group relative pl-16">
      <div className="absolute left-4 top-1 z-10 h-4 w-4 rounded-full bg-[#006941] ring-4 ring-[#caffdc]" />
      <div className="mb-4 flex items-center gap-4">
        <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#58615a]">
          {slot}
        </span>
        <span className="text-sm font-medium text-[#595c5d]">{SLOT_TIME[slot]}</span>
      </div>

      <div className="space-y-4">
        {slotMeals.map((meal) => (
          <MealCard key={`${meal.id}-${slot}`} meal={{ ...meal, slot, time: SLOT_TIME[slot] }} compact onDelete={onMealDeleted} />
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#abadae] bg-white/60 p-8 text-center transition-all hover:border-[#006941] hover:bg-[#f3fcf3]"
          >
            <PlusCircle className="mb-2 h-9 w-9 text-[#757778] transition-colors group-hover:text-[#006941]" />
            <span className="text-sm font-bold text-[#757778] transition-colors group-hover:text-[#006941]">
              Plan your {slot.toLowerCase()}
            </span>
            <span className="mt-1 text-xs font-medium text-[#959798]">
              {remaining} slot{remaining === 1 ? "" : "s"} left
            </span>
          </button>
        )}
      </div>

      {pickerOpen && (
        <RecipePickerModal
          slot={slot}
          dateStr={dateStr}
          onClose={() => setPickerOpen(false)}
          onAdded={onMealDeleted}
        />
      )}
    </article>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MealPlanClient({
  initialDateStr,
  initialMeals = [],
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateFromUrl = searchParams.get("date");
    const source = dateFromUrl || initialDateStr;

    if (source) {
      const parsed = parseDate(source);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    return new Date();
  });
  const [meals, setMeals] = useState(initialMeals);
  const [loading, setLoading] = useState(false);

  const dateStr = formatDate(selectedDate);
  const dayName = DAYS_FULL[selectedDate.getDay()];
  const displayDate = selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const fetchMeals = useCallback(async (date) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mealplan?date=${formatDate(date)}`);
      if (res.ok) {
        const data = await res.json();
        setMeals(data.meals || []);
      }
    } catch (e) {
      console.error("Failed to fetch meals:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fetchMeals(selectedDate);
  }, [selectedDate, fetchMeals]);

  const handleDateSelect = (dateObj) => {
    setSelectedDate(dateObj);
    const params = new URLSearchParams(searchParams);
    params.set("date", formatDate(dateObj));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleMealDeleted = () => {
    fetchMeals(selectedDate);
  };

  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:px-10">
      {/* Sidebar calendar */}
      <aside className="space-y-6 lg:col-span-3">
        <Calendar
          key={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </aside>

      {/* Main timeline */}
      <section className="space-y-8 lg:col-span-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#006941]">
              Today&apos;s Journey
            </span>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">
              {dayName}, {displayDate}
            </h1>
          </div>
          <Link
            href={`/explore?date=${dateStr}`}
            style={{ color: "white" }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
          >
            Add Recipes
          </Link>
        </div>

        <div className="relative space-y-12 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-[#7bfeb8]">
          {loading ? (
            <TimelineSkeleton />
          ) : (
            SLOTS.map((slot) => (
              <TimelineItem
                key={slot}
                slot={slot}
                meals={meals}
                dateStr={dateStr}
                onMealDeleted={handleMealDeleted}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
