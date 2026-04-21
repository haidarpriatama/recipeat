"use client"; // Wajib ada agar usePathname berfungsi

import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionLink from "@/components/ui/ActionLink";

export default function SiteHeader({
  brand = "Recipeat",
  navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Meal Plans", href: "/meal-plans" },
    { label: "Recipes", href: "/recipes" },
    { label: "Favorites", href: "/favorites" },
  ],
  loginAction = { label: "Login", href: "/login" },
  primaryAction = { label: "Sign Up", href: "/signup" },
}) {
  const pathname = usePathname();

  // --- LOGIKA PENYEMBUNYI HEADER ---
  // Jika URL saat ini adalah /login atau /signup, header ini akan menghilang (return null)
  if (pathname === "/login" || pathname === "/signup") {
    return null; 
  }
  // ---------------------------------

  return (
    <header className="fixed top-0 z-50 w-full bg-[#f5f6f7]/80 backdrop-blur-xl shadow-sm shadow-[#006941]/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link className="text-2xl font-black tracking-tighter text-[#006941]" href="/">
          {brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-sm font-semibold tracking-tight transition-all duration-300 ease-out hover:scale-105 hover:text-[#006941] ${
                  isActive ? "text-[#006941]" : "text-slate-600"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-0 -bottom-[6px] w-full h-[3px] bg-[#006941] rounded-t-md" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-[#006941] lg:block"
            href={loginAction.href}
          >
            {loginAction.label}
          </Link>

          {primaryAction && (
            <ActionLink href={primaryAction.href} size="sm" variant="header">
              {primaryAction.label}
            </ActionLink>
          )}
        </div>
      </div>
    </header>
  );
}