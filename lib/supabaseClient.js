import { createClient } from "@supabase/supabase-js";

// Singleton browser client — import this wherever you need Supabase in client components
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
