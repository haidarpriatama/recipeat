// lib/auth.js
// File ini untuk server-side (Node.js runtime) - boleh import Prisma dan Supabase
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import prisma from './prisma';
import authConfig from './auth.config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'supabase',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          return null;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: data.user.email },
          select: { role: true },
        });

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: dbUser?.role || 'USER',
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: { 
              name: user.name || user.email,
              role: user.role || undefined,
            },
            create: { 
              id: user.id, 
              email: user.email, 
              name: user.name || user.email,
              role: 'USER'
            },
          });
        } catch (error) {
          console.error('Error upserting user in signIn callback:', error);
        }
      }
      return true;
    },
  },
});
