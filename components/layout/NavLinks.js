"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ navLinks }) {
  const pathname = usePathname();

  return (
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
  );
}
