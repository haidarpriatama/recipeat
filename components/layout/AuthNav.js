"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/**
 * AuthNav — rendered inside SiteHeader.
 * Shows Login + Sign Up when logged out; profile avatar + logout when logged in.
 */
export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    return <div className="h-9 w-32 rounded-full bg-slate-200 animate-pulse" />;
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
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-[#dff5e8] px-3 py-1.5 text-[#006941] font-semibold text-sm hover:bg-[#c8efd8] transition-colors"
        aria-label="Open user menu"
      >
        {/* Avatar */}
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#7bfeb8] font-bold text-[#004b2d]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : (
            <span className="text-xs">{initials}</span>
          )}
        </span>
        <span className="hidden lg:block max-w-[120px] truncate">{displayName}</span>
        <span className="ml-0.5 text-[#006941]">▾</span>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl shadow-black/10">
            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#f3fcf3] hover:text-[#006941] transition-colors"
            >
              <User size={15} />
              My Profile
            </Link>
            <hr className="my-1 border-slate-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
