"use client";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Determine placeholder based on current path
  let placeholder = "Search everything...";
  if (pathname === "/admin/users") placeholder = "Search users by name or email...";
  if (pathname === "/admin/recipes") placeholder = "Search recipes by title...";
  if (pathname === "/admin/ingredients") placeholder = "Search ingredients by name...";

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (query === currentQ) return; // Prevent interrupting navigation

      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      // We push the new URL to keep the same pathname but update query
      // Using replace to not clutter browser history with every keystroke
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757778]" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl bg-white py-3 pl-11 pr-4 text-sm text-[#2c2f30] outline-none ring-[#006941]/20 transition focus:ring-2"
      />
    </div>
  );
}
