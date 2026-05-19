"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const FILTERS = {
  mealType: [
    { label: "Breakfast" },
    { label: "Lunch" },
    { label: "Dinner" },
  ],
};

const SERVING_TIMES = [
  { label: "<15 min", value: "under_15" },
  { label: "<30 min", value: "under_30" },
  { label: "<60 min", value: "under_60" },
  { label: ">60 min", value: "over_60" },
];

export default function FilterSidebar({ selectedMealTypes = [], selectedServingTimes = [], searchParams = {} }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (params) => {
    startTransition(() => {
      router.push(`/explore?${params.toString()}`, { scroll: false });
    });
  };

  const toggleMealType = (label) => {
    const next = selectedMealTypes.includes(label)
      ? selectedMealTypes.filter((m) => m !== label)
      : [...selectedMealTypes, label];
    const params = new URLSearchParams(searchParams);
    if (next.length > 0) {
      params.set("mealTypes", next.join(","));
    } else {
      params.delete("mealTypes");
    }
    params.delete("page");
    navigate(params);
  };

  const toggleServingTime = (value) => {
    const next = selectedServingTimes.includes(value)
      ? selectedServingTimes.filter((t) => t !== value)
      : [...selectedServingTimes, value];
    const params = new URLSearchParams(searchParams);
    if (next.length > 0) {
      params.set("servingTimes", next.join(","));
    } else {
      params.delete("servingTimes");
    }
    params.delete("page");
    navigate(params);
  };

  return (
    <aside className="w-full space-y-10 lg:w-64 lg:flex-shrink-0">
      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Meal Type</h3>
        <div className="space-y-3">
          {FILTERS.mealType.map((item) => {
            const isSelected = selectedMealTypes.includes(item.label);
            return (
              <button
                key={item.label}
                onClick={() => toggleMealType(item.label)}
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center gap-3 disabled:opacity-60"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    isSelected ? "border-[#006941] bg-[#006941]" : "border-[#abadae]/30 bg-white"
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Serving Time</h3>
        <div className="space-y-3">
          {SERVING_TIMES.map((item) => {
            const isSelected = selectedServingTimes.includes(item.value);
            return (
              <button
                key={item.value}
                onClick={() => toggleServingTime(item.value)}
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center gap-3 disabled:opacity-60"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    isSelected ? "border-[#006941] bg-[#006941]" : "border-[#abadae]/30 bg-white"
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
