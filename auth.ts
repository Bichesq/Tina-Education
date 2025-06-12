import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter UserName",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        const user = { id: "1", name: "Bichesq", email: "bichesq@gmail.com" };
        if (username === user.name && password === "nextgmail.com") {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      // This callback is required for middleware to work properly
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnManuscripts = nextUrl.pathname.startsWith("/manuscripts");
      const isOnReviews = nextUrl.pathname.startsWith("/reviews");

      console.log("🔐 Authorized callback - auth:", auth);
      console.log("🔐 Authorized callback - isLoggedIn:", isLoggedIn);
      console.log("🔐 Authorized callback - pathname:", nextUrl.pathname);

      // Allow access to protected routes only if logged in
      if (isOnDashboard || isOnManuscripts || isOnReviews) {
        return isLoggedIn;
      }

      // Allow access to all other routes
      return true;
    },
    async session({ session, token }) {
      console.log("🔐 Session callback - session:", session);
      console.log("🔐 Session callback - token:", token);
      if (token?.sub) {
        session.user.id = token.sub;

        // Fetch user role from database
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          });
          if (user) {
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("🔐 JWT callback - token:", token);
      console.log("🔐 JWT callback - user:", user);
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
