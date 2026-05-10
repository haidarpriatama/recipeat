"use client";
import { usePathname } from "next/navigation";

export default function MainContainer({ children }) {
  const pathname = usePathname();
  const hiddenPaths = ["/login", "/signup", "/forgot-password", "/admin"];
  const isHidden = hiddenPaths.some((path) => pathname?.startsWith(path));

  return (
    <main className={`min-h-screen ${isHidden ? "" : "pt-20"}`}>
      {children}
    </main>
  );
}
