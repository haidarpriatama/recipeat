import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Only guard routes that rely on NextAuth server session.
  // Favorites / meal-plans use Supabase client session via AuthGuard,
  // so checking them here causes false redirects to /login.
  const isProtectedRoute = pathname.startsWith('/admin');

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl);
    // You could also add a callbackUrl parameter here to redirect the user back after login
    return NextResponse.redirect(loginUrl);
  }

  // Continue to the requested page
  return NextResponse.next();
});

// Optionally, configure matcher to only run middleware on specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
