"use client";

import { usePathname } from "next/navigation";

export default function HeaderPathFilter({ children }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin")) {
    return null;
  }

  return children;
}
