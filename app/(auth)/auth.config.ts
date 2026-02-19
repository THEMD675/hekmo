import type { NextAuthConfig } from "next-auth";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // OAuth Providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials provider for email/password
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(_credentials) {
        // This is handled by the main auth.ts file
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Public routes - no auth required
      const publicPaths = ["/", "/pricing", "/privacy", "/terms"];
      const publicPrefixes = [
        "/dashboard",
        "/onboarding",
        "/api/whatsapp",
        "/api/stripe",
        "/api/business",
        "/api/health",
      ];

      const isPublicPath = publicPaths.includes(pathname);
      const isPublicPrefix = publicPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      );

      if (isPublicPath || isPublicPrefix) {
        return true;
      }

      // Redirect logged-in users away from auth pages
      const isOnRegister = pathname.startsWith("/register");
      const isOnLogin = pathname.startsWith("/login");
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      // Protect chat routes
      const isOnChat = pathname.startsWith("/chat");
      if (isOnChat && !isLoggedIn) {
        return false;
      }

      return true;
    },
    jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
        token.type = ((user as { type?: "guest" | "regular" }).type ||
          "regular") as "guest" | "regular";
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { type?: string }).type = token.type as string;
      }
      return session;
    },
  },
};
