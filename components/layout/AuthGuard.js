"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Wraps protected content.
 * Shows a spinner while checking auth; redirects to /login if not logged in.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006941] border-t-transparent" />
      </div>
    );
  }

  return children;
}
