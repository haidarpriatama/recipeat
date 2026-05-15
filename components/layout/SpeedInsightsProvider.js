"use client";

import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

const EXCLUDED_PREFIXES = ["/admin", "/login", "/signup", "/forgot-password", "/reset-password"];

export default function SpeedInsightsProvider() {
  const pathname = usePathname();

  if (EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return <SpeedInsights />;
}
