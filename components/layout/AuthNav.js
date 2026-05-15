"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { getSession, signOut } from "next-auth/react";

/**
 * AuthNav fetches session client-side after hydration so public HTML does not
 * block on auth/session resolution.
 */
export default function AuthNav() {
  const [session, setSession] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resolved, setResolved] = useState(false);
  const user = session?.user;

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const nextSession = await getSession();
        if (!cancelled) {
          setSession(nextSession);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to resolve session:", error);
        }
      } finally {
        if (!cancelled) {
          setResolved(true);
        }
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(loadSession);
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timeoutId = window.setTimeout(loadSession, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setDropdownOpen(false);
    window.location.href = "/";
  };

  if (!resolved || !user) {
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
          style={{ color: "white" }}
          className="inline-flex items-center justify-center font-bold transition-all duration-300 ease-out active:scale-95 px-6 py-2.5 text-sm rounded-full bg-[#006941] text-white shadow-lg shadow-[#006941]/20 hover:scale-105"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // ── Logged-in state ──
  const displayName = user?.name || user?.email || "User";
  const avatarUrl = user?.image;
  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setDropdownOpen((open) => !open);
        }}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#7bfeb8] bg-[#006941] text-white shadow-sm"
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

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
          }}
        />
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
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-[#f3fcf3] hover:text-[#006941]"
            >
              <LayoutDashboard size={15} />
              Admin
            </Link>
          )}
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
