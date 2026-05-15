"use client";

import { usePathname } from "next/navigation";

export default function HeaderPathFilter({ children }) {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return children;
}
