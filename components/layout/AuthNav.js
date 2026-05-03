"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/**
 * AuthNav — rendered inside SiteHeader.
 * Shows Login + Sign Up when logged out; profile avatar + logout when logged in.
 */
export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Meal plan ready",
      description: "Your weekly plan for this week is ready.",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low stock alert",
      description: "Spinach and eggs are running low.",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "New recipe saved",
      description: "Honey Glazed Salmon was added to favorites.",
      time: "Yesterday",
      unread: false,
    },
  ];

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    // Render a placeholder to avoid layout shift
    return <div className="h-10 w-24 rounded-full bg-slate-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden text-sm font-semibold text-[#006941] transition-colors hover:text-[#004b2d] lg:block"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center font-bold transition-all duration-300 ease-out active:scale-95 px-6 py-2.5 text-sm rounded-full bg-[#006941] text-white shadow-lg shadow-[#006941]/20 hover:scale-105"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // ── Logged-in state ──
  const displayName = user.user_metadata?.name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setNotificationsOpen((open) => !open);
          setDropdownOpen(false);
        }}
        aria-label="Open notifications"
        aria-expanded={notificationsOpen}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d2d9d5] bg-white text-[#595c5d] transition-colors hover:text-[#006941]"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#8c4a00]" />
      </button>

      <button
        type="button"
        onClick={() => {
          setDropdownOpen((open) => !open);
          setNotificationsOpen(false);
        }}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#7bfeb8] bg-[#7bfeb8] text-[#004b2d] shadow-sm"
        aria-label="Open user menu"
        aria-expanded={dropdownOpen}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <span className="text-sm font-bold">{initials}</span>
        )}
      </button>

      {(dropdownOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}

      {notificationsOpen && (
        <div className="absolute right-12 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-black/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-[#2c2f30]">Notifications</p>
            <span className="text-xs font-semibold text-[#595c5d]">{notifications.length} items</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((item) => (
              <div key={item.id} className="border-b border-slate-100 px-4 py-3 last:border-b-0">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#2c2f30]">{item.title}</p>
                  {item.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#006941]" />}
                </div>
                <p className="text-xs text-[#595c5d]">{item.description}</p>
                <p className="mt-1 text-[11px] font-medium text-[#8d9092]">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dropdownOpen && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl shadow-black/10">
          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-[#f3fcf3] hover:text-[#006941]"
          >
            <User size={15} />
            My Profile
          </Link>
          <hr className="my-1 border-slate-100" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
