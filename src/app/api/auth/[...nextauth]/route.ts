import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@/lib/mongo/client';

// Define the type for the extended JWT token
declare module 'next-auth' {
  interface User {
    role?: string; // Custom role added to user
  }

  interface Session {
    user: {
      id?: string; // User ID added to session
      role?: string; // Role added to session
    } & DefaultSession["user"]; // Include default fields (e.g., name, email, image)
  }

  interface JWT {
    role?: string; // Role added to JWT token
  }
}

// Define auth options with proper types
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? 'user', // Default role as 'user'
        };
      },
      // authorization: {
      //   params: {
      //     prompt: 'consent',
      //     access_type: 'offline',
      //     response_type: 'code',
      //   },
      // },
    }),
  ],
  callbacks: {
    // JWT Callback to generate a token for the user
    async jwt({ token, user, trigger, session }) {
      // Fetch specific user role during initial sign-in
      if (user) {
        token.role = user.role;
      }

      // Update token name with the session name
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    // Session Callback to generate the session object to be access by the user
    async session({ session, token }) {
      // Expose role in the session
      session.user.role = token.role as string | undefined;
      session.user.id = token.sub
      return session;
    },
  },
  pages: {
    signIn: '/signin'
  },
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt'
  }
};

// API Route Handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
