"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarCardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read date from URL or use today
  const dateParam = searchParams.get("date");
  const today = new Date();
  
  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed)) return parsed;
    }
    return today;
  });

  // Keep internal state for the month being viewed
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  // Sync state if URL changes externally
  useEffect(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed)) {
        setSelectedDate(parsed);
        setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    } else {
      setSelectedDate(today);
      setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateParam]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (dateObj) => {
    // Format to YYYY-MM-DD
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("date", dateStr);
    router.push(`?${params.toString()}`);
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Day of week: 0 is Sun, 1 is Mon... we want Mon=0, Sun=6
    const firstDay = date.getDay();
    const shift = firstDay === 0 ? 6 : firstDay - 1; 
    
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    // Prev month days
    for (let i = shift - 1; i >= 0; i--) {
      days.push({
        label: prevMonthDays - i,
        muted: true,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month days
    while (date.getMonth() === month) {
      days.push({
        label: date.getDate(),
        muted: false,
        date: new Date(date)
      });
      date.setDate(date.getDate() + 1);
    }
    
    // Next month days to fill up to 42 days (6 rows of 7) to keep height consistent
    let nextDay = 1;
    while (days.length % 7 !== 0 || days.length < 42) {
      days.push({
        label: nextDay,
        muted: true,
        date: new Date(year, month + 1, nextDay)
      });
      nextDay++;
    }
    
    return days;
  };

  const days = getCalendarDays();
  
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' });
  const year = viewDate.getFullYear();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,105,65,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">{monthName} {year}</h3>
        <div className="flex items-center gap-1 text-[#595c5d]">
          <button onClick={handlePrevMonth} type="button" className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={handleNextMonth} type="button" className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-[#595c5d]">
        {"MTWTFSS".split("").map((day, index) => (
          <span key={`header-${day}-${index}`} className="uppercase">{day}</span>
        ))}
        {days.map((day, idx) => {
          const isSelected = 
            day.date.getDate() === selectedDate.getDate() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getFullYear() === selectedDate.getFullYear();
            
          return (
            <button 
              key={`day-${idx}`} 
              onClick={() => handleDateClick(day.date)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isSelected 
                  ? "bg-[#006941] font-bold text-white shadow-lg shadow-[#006941]/20" 
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
