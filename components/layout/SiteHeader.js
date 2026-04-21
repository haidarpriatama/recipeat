"use client"; // Tambahkan ini karena kita butuh usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionLink from "@/components/ui/ActionLink";

export default function SiteHeader({
  brand = "Recipeat", // Aku beri default value jaga-jaga jika props kosong
  navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Meal Plans", href: "/meal-plans" },
    { label: "Recipes", href: "/recipes" },
    { label: "Favorites", href: "/favorites" },
  ],
  loginAction = { label: "Login", href: "/login" },
  primaryAction = { label: "Sign Up", href: "/signup" },
}) {
  // Panggil usePathname di sini
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full bg-[#f5f6f7]/80 backdrop-blur-xl shadow-sm shadow-[#006941]/5">
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10">
        <Link className="text-2xl font-black tracking-tighter text-[#006941]" href="/">
          {brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            // Cek apakah halaman sedang aktif
            const isActive = pathname === link.href;

            return (
              // Aku ubah tag <a> menjadi <Link> dan gabungkan class milikmu
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-sm font-semibold tracking-tight transition-all duration-300 ease-out hover:scale-105 hover:text-[#006941] ${
                  isActive ? "text-[#006941]" : "text-slate-600"
                }`}
              >
                {link.label}
                
                {/* Garis hijau penanda menu aktif muncul tepat di bawah teks */}
                {isActive && (
                  <span className="absolute left-0 -bottom-[6px] w-full h-[3px] bg-[#006941] rounded-t-md" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {/* Tag <a> ini juga sebaiknya pakai <Link> untuk Next.js */}
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