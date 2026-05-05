// lib/auth.config.js
// File ini HANYA berisi config dasar yang kompatibel dengan Edge Runtime.
// Jangan import Prisma atau Supabase di sini!

/** @type {import('next-auth').NextAuthConfig} */
const authConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [], // Provider lengkap ada di lib/auth.js
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true; // Semua route lain boleh diakses
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default authConfig;
