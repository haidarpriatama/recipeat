"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * Wraps protected content.
 * Shows a spinner while checking auth; redirects to /login if not logged in.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006941] border-t-transparent" />
      </div>
    );
  }

  return children;
}
