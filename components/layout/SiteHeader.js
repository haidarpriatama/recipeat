"use client"; // Wajib ada agar usePathname berfungsi

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthNav from "@/components/layout/AuthNav";

export default function SiteHeader({
  brand = "Recipeat",
  navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Meal Plans", href: "/meal-plans" },
    { label: "Favorites", href: "/favorites" },
  ],
}) {
  const pathname = usePathname();

  // --- LOGIKA PENYEMBUNYI HEADER KESELURUHAN ---
  // Jika URL saat ini adalah /login, /signup, atau berada di /admin, header ini akan menghilang total (return null)
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin")) {
    return null; 
  }
  // ---------------------------------

  return (
    <header className="fixed top-0 z-50 w-full bg-[#f5f6f7]/80 backdrop-blur-xl shadow-sm shadow-[#006941]/5">
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10">
        
        {/* LOGO KIRI */}
        <Link
          className="text-2xl font-bold tracking-tighter !text-[#006941]"
          style={{ color: "#006941" }}
          href="/"
        >
          {brand}
        </Link>

        {/* --- MENU TENGAH --- 
            Hanya akan muncul jika pathname BUKAN "/" (Landing Page) 
        */}
        {pathname !== "/" && (
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
        )}

        {/* BAGIAN KANAN (Login/Profil) */}
        <AuthNav />
      </div>
    </header>
  );
}