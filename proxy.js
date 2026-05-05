// proxy.js - Next.js 16 menggunakan nama file "proxy.js" (bukan "middleware.js")
// Fungsi harus di-export sebagai named export "proxy"
import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Hanya lindungi route /admin
  // Route lain (favorites, meal-plans) pakai Supabase client session via AuthGuard
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Cek apakah ada session cookie dari next-auth
    const sessionToken = 
      request.cookies.get('__Secure-next-auth.session-token')?.value ||
      request.cookies.get('next-auth.session-token')?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.nextUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
