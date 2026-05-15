/**
 * app/api/explore/route.js
 *
 * Used ONLY for client-side navigation (filter changes, pagination) after
 * the initial SSR render. The initial page load no longer calls this endpoint.
 *
 * Uses the shared fetchPublicExploreRecipes / fetchAuthenticatedExploreRecipes
 * helpers from lib/queries/explore.js which apply:
 * - Minimal `select` (no large `include`)
 * - Public result caching (60s) via unstable_cache
 * - Separate targeted Favorite query for logged-in users
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  fetchPublicExploreRecipes,
  fetchAuthenticatedExploreRecipes,
} from "@/lib/queries/explore";

export const runtime = "nodejs";
export const preferredRegion = "sin1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const selectedMealTypes = searchParams.get("mealTypes")
    ? searchParams.get("mealTypes").split(",").filter(Boolean)
    : [];
  const selectedServingTimes = searchParams.get("servingTimes")
    ? searchParams.get("servingTimes").split(",").filter(Boolean)
    : [];
  const ingredientsFilter = searchParams.get("ingredients")
    ? searchParams.get("ingredients").split(",").filter(Boolean)
    : [];
  const page = parseInt(searchParams.get("page") || "1", 10);

  const filters = {
    q,
    categoryFilter,
    selectedMealTypes,
    selectedServingTimes,
    ingredientsFilter,
  };

  try {
    // Only resolve session if a session cookie appears to be present.
    // Avoids unnecessary Supabase/NextAuth round-trips for anonymous requests.
    const cookieHeader = request.headers.get("cookie") || "";
    const hasSessionCookie =
      cookieHeader.includes("next-auth.session-token") ||
      cookieHeader.includes("__Secure-next-auth.session-token");

    let result;
    if (hasSessionCookie) {
      const session = await auth();
      const userId = session?.user?.id;
      result = userId
        ? await fetchAuthenticatedExploreRecipes(filters, page, userId)
        : await fetchPublicExploreRecipes(filters, page);
    } else {
      // No session cookie — skip auth entirely, use cached public query
      result = await fetchPublicExploreRecipes(filters, page);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/explore] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
