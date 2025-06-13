import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt", // Use JWT for credentials provider
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
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
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.picture) session.user.image = token.picture;
        if (token.role) session.user.role = token.role as any;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("🔐 JWT callback - token:", token);
      console.log("🔐 JWT callback - user:", user);
      console.log("🔐 JWT callback - account:", account);

      // For credentials provider, store user data in token
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
      }

      return token;
    },
  },
});
